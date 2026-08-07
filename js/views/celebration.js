// views/celebration.js — full-screen "Hooray!" + sticker reveal sequence.
// Stages are driven by classes on the section: (base) → stage-gift → stage-reveal.

import { getSettings } from '../state.js';
import { stickerSvg, stickerName } from '../stickers.js';
import { sfx } from '../audio.js';
import { startRain, stopRain, burstAt } from '../confetti.js';
import { app } from '../bus.js';
import { esc } from '../util.js';

const GIFT_SVG = `<svg viewBox="0 0 120 120" aria-hidden="true">
  <path d="M60 30 q-18 -20 -27 -9 q-7 9 12 13 Z" fill="#F7A8C4" stroke="#3E3A5C" stroke-width="5" stroke-linejoin="round"/>
  <path d="M60 30 q18 -20 27 -9 q7 9 -12 13 Z" fill="#F7A8C4" stroke="#3E3A5C" stroke-width="5" stroke-linejoin="round"/>
  <rect x="22" y="52" width="76" height="54" rx="10" fill="#FF8B7B" stroke="#3E3A5C" stroke-width="5"/>
  <rect x="16" y="34" width="88" height="20" rx="10" fill="#FFD166" stroke="#3E3A5C" stroke-width="5"/>
  <rect x="52" y="34" width="16" height="72" fill="#C792EA" stroke="#3E3A5C" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="60" cy="32" r="7" fill="#FFD166" stroke="#3E3A5C" stroke-width="5"/>
</svg>`;

let timers = [];

function later(fn, ms) {
  timers.push(setTimeout(fn, ms));
}

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function leave(to) {
  clearTimers();
  stopRain();
  app.show(to);
}

export function show(stickerId) {
  const root = document.getElementById('screen-celebration');
  const name = getSettings().childName.trim();

  root.className = 'screen'; // reset stage classes
  root.innerHTML = `
    <canvas class="celebrate-canvas" id="celebrate-canvas"></canvas>
    <div class="celebrate-inner">
      <h1 class="hooray">Hooray${name ? ', ' + esc(name) : ''}!</h1>
      <p class="hooray-sub">You did your whole routine!</p>
      <div class="gift-stage">
        <button class="gift" id="gift" aria-label="Open your surprise">${GIFT_SVG}</button>
        <div class="sticker-reveal" id="sticker-reveal">
          <div class="sticker-shine">${stickerSvg(stickerId)}</div>
          <p class="sticker-name">${esc(stickerName(stickerId))}</p>
          <p class="sticker-earned">A new sticker for your album!</p>
        </div>
      </div>
      <div class="celebrate-actions">
        <button class="big-btn" id="celebrate-album">See My Album</button>
        <button class="big-btn primary" id="celebrate-done">Yay!</button>
      </div>
    </div>`;

  app.show('celebration');
  sfx.fanfare();
  startRain(root.querySelector('#celebrate-canvas'), 3200);

  const gift = root.querySelector('#gift');
  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    burstAt(gift);
    sfx.shimmer();
    root.classList.add('stage-reveal');
  };

  if (location.hash.includes('instant')) {
    // QA hook: jump straight to the revealed sticker (used by headless screenshots)
    revealed = true;
    root.classList.add('stage-gift', 'stage-reveal');
  } else {
    later(() => root.classList.add('stage-gift'), 900);
    later(reveal, 5200); // auto-open if the kid just watches
    gift.addEventListener('click', reveal);
  }

  root.querySelector('#celebrate-done').addEventListener('click', () => leave('kid'));
  root.querySelector('#celebrate-album').addEventListener('click', () => leave('album'));
}
