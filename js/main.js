// main.js — boot, screen switching, day-rollover watcher, SW registration.

import { app } from './bus.js';
import { ensureToday, getSettings } from './state.js';
import { initAudioUnlock, setMuted } from './audio.js';
import { initAutoUpdate } from './update.js';
import * as onboarding from './views/onboarding.js';
import * as kid from './views/kid.js';
import * as album from './views/album.js';
import * as parent from './views/parent.js';
import * as celebration from './views/celebration.js';

const views = { onboarding, kid, album, parent };
let current = '';

app.show = (name) => {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('screen--active'));
  const view = views[name];
  if (view && view.render) view.render();
  const section = document.getElementById('screen-' + name);
  if (section) section.classList.add('screen--active');
  current = name;
  window.scrollTo(0, 0);
};

app.celebrate = (stickerId) => {
  celebration.show(stickerId);
  current = 'celebration';
};

function boot() {
  ensureToday();
  setMuted(!getSettings().soundOn);
  initAudioUnlock();

  // Deep links for testing/QA: #kid #album #parent #onboarding #celebrate=<stickerId>.
  // Harmless in normal use — the app never generates hashes itself.
  const hash = location.hash.slice(1);
  const [hashScreen, hashValue] = hash.split('=');
  if (hashScreen === 'celebrate') {
    app.show('kid');
    app.celebrate((hashValue || 'fox-star').split('&')[0]);
  } else if (['kid', 'album', 'parent', 'onboarding'].includes(hashScreen)) {
    app.show(hashScreen);
  } else {
    app.show(getSettings().onboarded ? 'kid' : 'onboarding');
  }

  // Day rollover: reset checks when the date flips while the app stays open
  // (iPad on the nightstand overnight). Checked on wake + every minute.
  const checkRollover = () => {
    if (ensureToday() && current === 'kid') kid.render();
  };
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) checkRollover();
  });
  setInterval(checkRollover, 60000);

  // Block pinch zoom in standalone Safari (gesturestart is iOS-specific).
  document.addEventListener('gesturestart', (e) => e.preventDefault());

  initAutoUpdate();
}

boot();
