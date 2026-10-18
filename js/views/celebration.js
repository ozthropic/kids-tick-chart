// views/celebration.js — full-screen "Hooray!" + scratch-card sticker reveal.
// Stages are driven by classes on the section:
//   (base) → stage-card (the card has dropped in) → stage-reveal (scratched off).
//
// The sticker is only added to the album once the coating is scratched off
// (claimPending). Until then it waits as a pending card, so closing the app
// mid-scratch loses nothing — the card comes back on the next launch.

import { getSettings, claimPending, getPendingSticker } from '../state.js';
import { stickerSvg, stickerName } from '../stickers.js';
import { sfx } from '../audio.js';
import { startRain, stopRain, burstAt } from '../confetti.js';
import { attachScratch } from '../scratch.js';
import { app } from '../bus.js';
import { esc } from '../util.js';

const FINGER_SVG = `<svg viewBox="0 0 64 64" class="finger" aria-hidden="true">
  <rect x="17" y="27" width="34" height="31" rx="13" fill="#FFD9B8" stroke="#3E3A5C" stroke-width="3.5"/>
  <path d="M40 31 h5 a5 5 0 0 1 5 5 M40 41 h7 a5 5 0 0 1 5 5" fill="none" stroke="#3E3A5C" stroke-width="3" stroke-linecap="round"/>
  <rect x="26" y="4" width="12" height="36" rx="6" fill="#FFD9B8" stroke="#3E3A5C" stroke-width="3.5"/>
  <path d="M16 10 l-5 -3 M20 5 l-2 -5 M12 17 l-6 0" fill="none" stroke="#FFD166" stroke-width="3" stroke-linecap="round"/>
</svg>`;

let timers = [];
let scratch = null;

function later(fn, ms) {
  timers.push(setTimeout(fn, ms));
}

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function teardown() {
  clearTimers();
  stopRain();
  if (scratch) {
    scratch.destroy();
    scratch = null;
  }
}

// opts.resumed  — the card was left unscratched earlier (relaunch / "later")
// opts.instant  — QA hook: render the revealed state straight away
export function show(stickerId, opts = {}) {
  teardown();
  const root = document.getElementById('screen-celebration');
  const name = getSettings().childName.trim();
  const resumed = !!opts.resumed;

  root.className = 'screen'; // reset stage classes
  root.innerHTML = `
    <canvas class="celebrate-canvas" id="celebrate-canvas"></canvas>
    <div class="celebrate-inner">
      <h1 class="hooray">${resumed ? 'Look' : 'Hooray'}${name ? ', ' + esc(name) : ''}!</h1>
      <p class="hooray-sub">${resumed ? 'Your sticker is still waiting for you!' : 'You did your whole routine!'}</p>
      <div class="scratch-stage">
        <div class="scratch-card" id="scratch-card">
          <div class="scratch-sticker">${stickerSvg(stickerId)}</div>
          <canvas class="scratch-coat" id="scratch-coat" aria-label="Scratch to reveal your sticker"></canvas>
          <div class="scratch-hint" id="scratch-hint">${FINGER_SVG}<span>Scratch me!</span></div>
        </div>
        <p class="sticker-name">${esc(stickerName(stickerId))}</p>
        <p class="sticker-earned">A new sticker for your album!</p>
      </div>
      <div class="celebrate-actions">
        <button class="big-btn" id="celebrate-album">See My Album</button>
        <button class="big-btn primary" id="celebrate-done">Yay!</button>
      </div>
      <button class="celebrate-later" id="celebrate-later">Scratch it later</button>
    </div>`;

  app.show('celebration');
  if (resumed) sfx.shimmer(); else sfx.fanfare();
  const rain = root.querySelector('#celebrate-canvas');
  startRain(rain, resumed ? 1600 : 3200);

  const card = root.querySelector('#scratch-card');
  const coat = root.querySelector('#scratch-coat');
  let revealed = false;

  const reveal = () => {
    if (revealed) return;
    revealed = true;
    claimPending(stickerId); // save first — the fireworks can wait
    coat.classList.add('gone');
    card.classList.remove('idle');
    card.classList.add('popped');
    root.classList.add('stage-reveal');
    burstAt(card, 24);
    sfx.shimmer();
    later(() => sfx.fanfare(), 250);
    later(() => startRain(rain, 2200), 200);
  };

  if (opts.instant) {
    revealed = true;
    claimPending(stickerId);
    coat.classList.add('gone');
    root.classList.add('stage-card', 'stage-reveal');
  } else {
    const dropAt = resumed ? 250 : 900;
    later(() => root.classList.add('stage-card'), dropAt);
    // wire the scratching once the drop-in transition has settled
    later(() => {
      card.classList.add('idle');
      let lastSkritch = 0;
      scratch = attachScratch(coat, card, {
        threshold: 0.7,
        onStroke(progress, first) {
          if (first) {
            card.classList.remove('idle');
            card.classList.add('touched');
          }
          const now = performance.now();
          if (now - lastSkritch > 90) {
            lastSkritch = now;
            sfx.scratch();
          }
        },
        onComplete: reveal
      });
    }, dropAt + 750);
  }

  // After "Yay!" a second card that queued up (two routines finished before
  // the first was scratched) comes straight on; otherwise back to the chart.
  const leave = (to) => {
    teardown();
    const next = revealed ? getPendingSticker() : null;
    if (next && to === 'kid') show(next.id, { resumed: true });
    else app.show(to);
  };
  root.querySelector('#celebrate-done').addEventListener('click', () => leave('kid'));
  root.querySelector('#celebrate-album').addEventListener('click', () => leave('album'));
  root.querySelector('#celebrate-later').addEventListener('click', () => leave('kid'));
}
