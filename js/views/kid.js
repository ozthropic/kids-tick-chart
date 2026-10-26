// views/kid.js — the kid-facing checklist screen.

import {
  getActive, getSettings, isChecked, toggleCheck, checkedCount,
  isRoutineComplete, isRewarded, recordCompletion, getStickerLog, getPendingSticker, ensureToday
} from '../state.js';
import { iconSvg } from '../icons.js';
import { stickerSvg } from '../stickers.js';
import { sfx } from '../audio.js';
import { burstAt } from '../confetti.js';
import { attachHoldGate } from '../gate.js';
import { askGrownUp } from '../quiz.js';
import { app } from '../bus.js';
import { esc, possessive } from '../util.js';

const BUNTING_COLORS = ['#FF8B7B', '#FFD166', '#7FD8BE', '#C792EA', '#F7A8C4', '#8FB4E3'];

function buntingSvg() {
  let flags = '';
  for (let i = 0; i < 8; i++) {
    const x = 12 + i * 48;
    const y = 8 + Math.sin((i / 7) * Math.PI) * 9;
    flags += `<path d="M${x} ${y} h26 l-13 22 Z" fill="${BUNTING_COLORS[i % 6]}" stroke="#3E3A5C" stroke-width="2.5" stroke-linejoin="round"/>`;
  }
  return `<svg viewBox="0 0 400 44" class="bunting-svg" preserveAspectRatio="xMidYMin meet" aria-hidden="true">
    <path d="M0 6 Q200 26 400 6" fill="none" stroke="#3E3A5C" stroke-width="3"/>${flags}</svg>`;
}

const STAR_PATH = 'M13 2.5 l2.9 6.6 7.2 0.6 -5.5 4.7 1.7 7 -6.3 -3.8 -6.3 3.8 1.7 -7 -5.5 -4.7 7.2 -0.6 Z';

function starsMarkup(total, filled, popIndex = -1) {
  let out = '';
  for (let i = 0; i < total; i++) {
    out += `<svg viewBox="0 0 26 26" class="pstar ${i < filled ? 'filled' : ''} ${i === popIndex ? 'pop' : ''}" aria-hidden="true"><path d="${STAR_PATH}"/></svg>`;
  }
  return out;
}

const LOCK_SVG = `<svg viewBox="0 0 24 24" class="gate-lock" aria-hidden="true">
  <path d="M8 10 V7 a4 4 0 0 1 8 0 v3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  <rect x="5.5" y="10" width="13" height="10" rx="3" fill="currentColor"/>
</svg>`;

const GATE_RING = `<svg viewBox="0 0 48 48" class="gate-ring" aria-hidden="true">
  <circle class="gate-ring-bg" cx="24" cy="24" r="15"/>
  <circle class="gate-ring-track" cx="24" cy="24" r="21"/>
  <circle class="gate-ring-fg" cx="24" cy="24" r="21" pathLength="100"/>
</svg>`;

const ALBUM_ICON = `<svg viewBox="0 0 26 26" class="btn-icon" aria-hidden="true">
  <path d="${STAR_PATH}" fill="#FFD166" stroke="#3E3A5C" stroke-width="1.8" stroke-linejoin="round" transform="translate(0 0)"/>
</svg>`;

function cardMarkup(item) {
  const checked = isChecked(item.id);
  return `<li><button class="card ${checked ? 'is-checked' : ''}" data-id="${esc(item.id)}">
    <span class="check" aria-hidden="true">
      <svg viewBox="0 0 40 40" class="check-svg">
        <path class="check-tick" d="M10 21 l8 8 L31 13" pathLength="40"/>
      </svg>
    </span>
    <span class="card-icon">${iconSvg(item.icon)}</span>
    <span class="card-label">${esc(item.label)}</span>
  </button></li>`;
}

const SCRATCH_ICON = `<svg viewBox="0 0 48 48" class="scratch-chip-icon" aria-hidden="true">
  <circle cx="24" cy="24" r="21" fill="#DCDFE8" stroke="#3E3A5C" stroke-width="3"/>
  <path d="M8 30 L30 8 M14 38 L38 14" stroke="rgba(255,255,255,0.8)" stroke-width="3" stroke-linecap="round"/>
  <text x="24" y="33" text-anchor="middle" font-size="26" font-weight="900" fill="#3E3A5C">?</text>
</svg>`;

function latestStickerToday() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const today = getStickerLog().filter((s) => s.ts >= start.getTime());
  return today.length ? today[today.length - 1].id : null;
}

export function render() {
  const root = document.getElementById('screen-kid');
  const a = getActive();
  const settings = getSettings();

  if (!a) {
    root.dataset.accent = 'sun';
    root.innerHTML = `
      <div class="kid-wrap">
        <div class="kid-empty panel">
          <div class="kid-empty-icon">${iconSvg('star')}</div>
          <h1>Almost ready!</h1>
          <p>Ask a grown-up to hold the little button in the corner and set up your chart.</p>
        </div>
        <button class="gate-btn" id="gate-btn" aria-label="Parents: press and hold">${GATE_RING}${LOCK_SVG}</button>
      </div>`;
    attachHoldGate(root.querySelector('#gate-btn'), { ms: 3000, onComplete: openParentGate });
    return;
  }

  const name = settings.childName.trim();
  const title = `${name ? possessive(esc(name)) + ' ' : ''}${esc(a.title)} Chart`;
  const total = a.items.length;
  const filled = checkedCount();
  const done = isRoutineComplete() && isRewarded();
  // A card left unscratched (closed the app, or tapped "later") stays on offer
  // in the banner until it is scratched — a sticker is never lost.
  const pending = getPendingSticker();
  const doneSticker = done && !pending ? latestStickerToday() : null;
  const bannerInner = pending
    ? `<button class="scratch-chip" id="scratch-chip">${SCRATCH_ICON}<span>Scratch your sticker!</span></button>`
    : `${doneSticker ? `<span class="done-sticker">${stickerSvg(doneSticker)}</span>` : ''}
       <span class="done-text">All done${name ? ', ' + esc(name) : ''}! Amazing job!</span>`;

  root.dataset.accent = a.accent || 'sun';
  root.innerHTML = `
    <div class="kid-wrap">
      <header class="kid-header">
        ${buntingSvg()}
        <h1 class="kid-title">${title}</h1>
        <div class="progress-stars" id="progress-stars">${starsMarkup(total, filled)}</div>
      </header>
      <div class="panel kid-panel">
        <div class="done-banner ${done || pending ? 'show' : ''}" id="done-banner">${bannerInner}</div>
        <ul class="cards" id="cards">${a.items.map(cardMarkup).join('')}</ul>
      </div>
      <footer class="kid-footer">
        <button class="big-btn album-btn" id="album-btn">${ALBUM_ICON}<span>My Stickers</span></button>
      </footer>
      <button class="gate-btn" id="gate-btn" aria-label="Parents: press and hold">${GATE_RING}${LOCK_SVG}</button>
    </div>`;

  const cards = root.querySelector('#cards');
  cards.addEventListener('click', onCardTap);
  cards.addEventListener('pointerdown', onCardDown);
  cards.addEventListener('pointermove', onCardMove);
  ['pointerup', 'pointercancel'].forEach((ev) => cards.addEventListener(ev, cancelUntickHold));
  cards.addEventListener('contextmenu', (e) => e.preventDefault()); // long press: no menu
  root.querySelector('#album-btn').addEventListener('click', () => app.show('album'));
  const chip = root.querySelector('#scratch-chip');
  if (chip) chip.addEventListener('click', () => {
    const p = getPendingSticker();
    if (p) app.celebrate(p.id, { resumed: true });
  });
  attachHoldGate(root.querySelector('#gate-btn'), { ms: 3000, onComplete: openParentGate });
}

// Hold 3 s, then prove you are a grown-up — the hold alone stopped working
// once the child learned it.
function openParentGate() {
  askGrownUp(() => app.show('parent'));
}

// --- card interaction ---
// A tap ticks a step. A ticked step does NOT untick on a tap: the child had
// made a game of tick, untick, tick. Unticking needs a finger held still on
// the card for 3 seconds, with no visible hint while holding, so only a
// grown-up who knows about it can undo a step (parents' request, 26 Oct 2026).
// Built like the parent gate's hold (js/gate.js): checked by timestamp, a
// second finger or a moving finger cancels it.

const UNTICK_HOLD_MS = 3000;
const MOVE_CANCEL_PX = 14;
let untickHold = null;     // { btn, pointerId, x, y, t0, timer }
let heldPress = false;     // this press already unticked: swallow its click

function cancelUntickHold() {
  if (untickHold) {
    clearTimeout(untickHold.timer);
    untickHold = null;
  }
}

function onCardDown(e) {
  heldPress = false;
  if (untickHold) {           // a second finger: no untick at all
    cancelUntickHold();
    return;
  }
  const btn = e.target.closest('.card');
  if (!btn || !isChecked(btn.dataset.id)) return;
  const t0 = Date.now();
  untickHold = {
    btn, pointerId: e.pointerId, x: e.clientX, y: e.clientY, t0,
    timer: setTimeout(() => {
      const h = untickHold;
      untickHold = null;
      if (h && Date.now() - h.t0 >= UNTICK_HOLD_MS - 150) untickByHold(h.btn);
    }, UNTICK_HOLD_MS)
  };
}

function onCardMove(e) {
  if (!untickHold || e.pointerId !== untickHold.pointerId) return;
  if (Math.hypot(e.clientX - untickHold.x, e.clientY - untickHold.y) > MOVE_CANCEL_PX) cancelUntickHold();
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelUntickHold();
});

function untickByHold(btn) {
  heldPress = true;
  if (ensureToday()) {
    render();
    return;
  }
  if (!getActive() || !isChecked(btn.dataset.id)) return;
  toggleCheck(btn.dataset.id);
  btn.classList.remove('is-checked');
  sfx.uncheck();
  syncProgress();
}

function bounceCard(btn) {
  btn.classList.remove('bounce');
  void btn.offsetWidth;
  btn.classList.add('bounce');
  btn.addEventListener('animationend', () => btn.classList.remove('bounce'), { once: true });
}

// Re-sync stars + done-banner from state (banner returns after un-tick → re-tick).
function syncProgress(popIndex = -1) {
  const a = getActive();
  if (!a) return;
  const stars = document.getElementById('progress-stars');
  if (stars) stars.innerHTML = starsMarkup(a.items.length, checkedCount(), popIndex);
  const banner = document.getElementById('done-banner');
  if (banner) banner.classList.toggle('show', (isRoutineComplete() && isRewarded()) || !!getPendingSticker());
}

function onCardTap(e) {
  const btn = e.target.closest('.card');
  if (!btn) return;
  // the finger lifting after a 3-second untick must not tick it straight back
  if (heldPress) {
    heldPress = false;
    return;
  }
  // date flipped since last render (tap landed inside the rollover window):
  // reset the screen instead of writing a check into the stale-looking day
  if (ensureToday()) {
    render();
    return;
  }
  if (!getActive()) return;
  // a ticked step only unticks with the 3-second hold (see above)
  if (isChecked(btn.dataset.id)) return;

  toggleCheck(btn.dataset.id);
  btn.classList.add('is-checked');
  bounceCard(btn);
  sfx.pop();
  burstAt(btn.querySelector('.check'));
  syncProgress(checkedCount() - 1);
  if (isRoutineComplete() && !isRewarded()) {
    const sticker = recordCompletion();
    if (sticker) setTimeout(() => app.celebrate(sticker), 750);
  }
}
