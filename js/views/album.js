// views/album.js — the sticker collection, one page per series.
//
// Series 1 (the 55 drawn characters) stays forever even once complete — the
// child knows them by heart. Series 2 (picture stickers) is the one still being
// collected. Owned stickers are full colour; unowned ones are dark ("off") until
// they are earned and light up.

import { SERIES, stickerSvg, stickerName } from '../stickers.js';
import { getOwnedStickers, getTodaysStickers } from '../state.js';
import { app } from '../bus.js';
import { esc } from '../util.js';

const BACK_SVG = `<svg viewBox="0 0 24 24" class="btn-icon" aria-hidden="true">
  <path d="M15 4 L7 12 L15 20" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// Remembered for the session so flipping back to the album lands on the same page.
let currentSeries = null;

function ownedIn(series, owned) {
  return series.ids.filter((id) => owned[id]).length;
}

export function render() {
  const root = document.getElementById('screen-album');
  const owned = getOwnedStickers();
  const todays = new Set(getTodaysStickers());

  if (!SERIES.some((s) => s.id === currentSeries)) {
    // Open on the first series that still has something to collect.
    const open = SERIES.find((s) => ownedIn(s, owned) < s.ids.length);
    currentSeries = (open || SERIES[SERIES.length - 1]).id;
  }
  const series = SERIES.find((s) => s.id === currentSeries);
  const count = ownedIn(series, owned);
  const all = count === series.ids.length;

  root.innerHTML = `
    <div class="album-wrap">
      <header class="album-header">
        <button class="big-btn back-btn" id="album-back">${BACK_SVG}<span>Back</span></button>
        <h1 class="album-title">My Sticker Album</h1>
        <p class="album-count">${all ? 'ALL ' : ''}${count} of ${series.ids.length}${all ? ' — WOW!' : ' collected'}</p>
      </header>
      <nav class="series-tabs" aria-label="Sticker series">
        ${SERIES.map((s) => {
          const n = ownedIn(s, owned);
          const done = n === s.ids.length;
          return `<button class="series-tab ${s.id === currentSeries ? 'sel' : ''} ${done ? 'complete' : ''}" data-series="${s.id}">
            <span class="series-tab-name">${esc(s.name)}</span>
            <span class="series-tab-count">${n} / ${s.ids.length}</span>
          </button>`;
        }).join('')}
      </nav>
      <div class="album-grid">
        ${series.ids.map((id) => {
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
  root.querySelectorAll('.series-tab').forEach((b) =>
    b.addEventListener('click', () => {
      currentSeries = b.dataset.series;
      render();
      window.scrollTo(0, 0);
    })
  );
}
