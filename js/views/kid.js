// views/kid.js — the kid-facing checklist screen.

import {
  getActive, getSettings, isChecked, toggleCheck, checkedCount,
  isRoutineComplete, isRewarded, recordCompletion, getStickerLog, ensureToday
} from '../state.js';
import { iconSvg } from '../icons.js';
import { stickerSvg } from '../stickers.js';
import { sfx } from '../audio.js';
import { burstAt } from '../confetti.js';
import { attachHoldGate } from '../gate.js';
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
  <circle class="gate-ring-bg" cx="24" cy="24" r="20"/>
  <circle class="gate-ring-fg" cx="24" cy="24" r="20" pathLength="100"/>
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

function latestStickerToday() {
  const log = getStickerLog();
  return log.length ? log[log.length - 1].id : null;
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
    attachHoldGate(root.querySelector('#gate-btn'), { ms: 3000, onComplete: () => app.show('parent') });
    return;
  }

  const name = settings.childName.trim();
  const title = `${name ? possessive(esc(name)) + ' ' : ''}${esc(a.title)} Chart`;
  const total = a.items.length;
  const filled = checkedCount();
  const done = isRoutineComplete() && isRewarded();
  const doneSticker = done ? latestStickerToday() : null;

  root.dataset.accent = a.accent || 'sun';
  root.innerHTML = `
    <div class="kid-wrap">
      <header class="kid-header">
        ${buntingSvg()}
        <h1 class="kid-title">${title}</h1>
        <div class="progress-stars" id="progress-stars">${starsMarkup(total, filled)}</div>
      </header>
      <div class="panel kid-panel">
        <div class="done-banner ${done ? 'show' : ''}" id="done-banner">
          ${doneSticker ? `<span class="done-sticker">${stickerSvg(doneSticker)}</span>` : ''}
          <span class="done-text">All done${name ? ', ' + esc(name) : ''}! Amazing job!</span>
        </div>
        <ul class="cards" id="cards">${a.items.map(cardMarkup).join('')}</ul>
      </div>
      <footer class="kid-footer">
        <button class="big-btn album-btn" id="album-btn">${ALBUM_ICON}<span>My Stickers</span></button>
      </footer>
      <button class="gate-btn" id="gate-btn" aria-label="Parents: press and hold">${GATE_RING}${LOCK_SVG}</button>
    </div>`;

  const cards = root.querySelector('#cards');
  cards.addEventListener('click', onCardTap);
  cards.addEventListener('pointerdown', onCardPointerDown);
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) =>
    cards.addEventListener(ev, cancelHold)
  );
  root.querySelector('#album-btn').addEventListener('click', () => app.show('album'));
  attachHoldGate(root.querySelector('#gate-btn'), { ms: 3000, onComplete: () => app.show('parent') });
}

// --- card interaction ---
// Tap checks a step. A tap on an already-checked card is a rewarding no-op
// (toddlers repeat-tap their favorites); un-checking requires an 800ms
// press-and-hold so a kid can't accidentally undo their own progress.

const UNCHECK_HOLD_MS = 800;
let holdTimer = null;
let holdCard = null;
let swallowNextTap = false;

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
  if (banner) banner.classList.toggle('show', isRoutineComplete() && isRewarded());
}

function cancelHold() {
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
  if (holdCard) {
    holdCard.classList.remove('unchecking');
    holdCard = null;
  }
}

function onCardPointerDown(e) {
  const btn = e.target.closest('.card');
  if (!btn || !btn.classList.contains('is-checked')) return;
  cancelHold();
  holdCard = btn;
  btn.classList.add('unchecking');
  holdTimer = setTimeout(() => {
    holdTimer = null;
    const card = holdCard;
    cancelHold();
    // the click that follows pointerup must not re-check the card
    swallowNextTap = true;
    setTimeout(() => { swallowNextTap = false; }, 400);
    if (ensureToday()) {
      render();
      return;
    }
    if (card.classList.contains('is-checked')) {
      toggleCheck(card.dataset.id);
      card.classList.remove('is-checked');
      sfx.uncheck();
      syncProgress();
    }
  }, UNCHECK_HOLD_MS);
}

function onCardTap(e) {
  const btn = e.target.closest('.card');
  if (!btn) return;
  if (swallowNextTap) {
    swallowNextTap = false;
    return;
  }
  // date flipped since last render (tap landed inside the rollover window):
  // reset the screen instead of writing a check into the stale-looking day
  if (ensureToday()) {
    render();
    return;
  }
  if (!getActive()) return;

  if (btn.classList.contains('is-checked')) {
    bounceCard(btn);
    sfx.pop();
    return;
  }

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
