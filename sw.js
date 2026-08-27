// sw.js — cache-first offline layer. Bump VERSION on every deploy.

// Bumped on every deploy. Installed devices pick the new version up on
// their own (see js/update.js) — no need to reinstall the home-screen app.
const VERSION = 'kta-v3';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/main.js',
  './js/bus.js',
  './js/util.js',
  './js/state.js',
  './js/presets.js',
  './js/icons.js',
  './js/stickers.js',
  './js/audio.js',
  './js/confetti.js',
  './js/gate.js',
  './js/update.js',
  './js/views/onboarding.js',
  './js/views/kid.js',
  './js/views/celebration.js',
  './js/views/album.js',
  './js/views/parent.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    // cache: 'reload' bypasses the HTTP cache, so a VERSION bump can never
    // precache a stale copy of an asset alongside fresh ones.
    caches.open(VERSION)
      .then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const DEV = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

// The page asks which version is actually running (shown in Parent Settings).
self.addEventListener('message', (e) => {
  if (e.data === 'VERSION' && e.ports && e.ports[0]) e.ports[0].postMessage(VERSION);
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (DEV) return; // always network-fresh during local development
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
    })
  );
});
