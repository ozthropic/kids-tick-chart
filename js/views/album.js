// views/album.js — the sticker collection. Owned stickers are full color,
// unowned ones render as dark silhouettes of the same art.

import { STICKER_IDS, stickerSvg, stickerName } from '../stickers.js';
import { getOwnedStickers, getTodaysStickers } from '../state.js';
import { app } from '../bus.js';
import { esc } from '../util.js';

const BACK_SVG = `<svg viewBox="0 0 24 24" class="btn-icon" aria-hidden="true">
  <path d="M15 4 L7 12 L15 20" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export function render() {
  const root = document.getElementById('screen-album');
  const owned = getOwnedStickers();
  const todays = new Set(getTodaysStickers());
  const count = Object.keys(owned).length;
  const all = count === STICKER_IDS.length;

  root.innerHTML = `
    <div class="album-wrap">
      <header class="album-header">
        <button class="big-btn back-btn" id="album-back">${BACK_SVG}<span>Back</span></button>
        <h1 class="album-title">My Sticker Album</h1>
        <p class="album-count">${all ? 'ALL ' : ''}${count} of ${STICKER_IDS.length}${all ? ' — WOW!' : ' collected'}</p>
      </header>
      <div class="album-grid">
        ${STICKER_IDS.map((id) => {
          const n = owned[id] || 0;
          const isNew = n > 0 && todays.has(id);
          return `<div class="album-slot ${n ? 'owned' : 'locked'}">
            ${stickerSvg(id)}
            ${n > 1 ? `<span class="slot-count">&times;${n}</span>` : ''}
            ${isNew ? '<span class="slot-new">NEW</span>' : ''}
            <span class="slot-name">${n ? esc(stickerName(id)) : '?'}</span>
          </div>`;
        }).join('')}
      </div>
    </div>`;

  root.querySelector('#album-back').addEventListener('click', () => app.show('kid'));
}
