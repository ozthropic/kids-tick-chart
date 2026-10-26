// sw.js — cache-first offline layer. Bump VERSION on every deploy.

// Bumped on every deploy. Installed devices pick the new version up on
// their own (see js/update.js) — no need to reinstall the home-screen app.
const VERSION = 'kta-v8';

// Picture stickers never change once published (a changed picture must get a
// new file name), so they live in their own cache that survives app updates.
// An update then downloads only the small core files (~200 KB) instead of all
// 5.6 MB of pictures again, and installs in a second or two — quick enough to
// be applied right at launch instead of on the launch after.
const PICTURE_CACHE = 'kta-pictures-1';

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
  './js/quiz.js',
  './js/scratch.js',
  './js/views/onboarding.js',
  './js/views/kid.js',
  './js/views/celebration.js',
  './js/views/album.js',
  './js/views/parent.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Series-2 picture stickers. Cached on a best-effort basis: one missing file
// must never stop the whole update from installing.
// A corrected picture is published under a new name (keep in step with
// SERIES2_FILES in js/stickers.js); the old file is dropped from the picture
// cache on activation, so a device never shows the faulty one again.
const REPLACED_PICTURES = { 75: '075b' };
const STICKER_PICTURES = Array.from(
  { length: 112 },
  (_, i) => `./stickers/s2/${REPLACED_PICTURES[i + 1] || String(i + 1).padStart(3, '0')}.jpg`
);

async function prunePictures() {
  const pics = await caches.open(PICTURE_CACHE);
  const keep = new Set(STICKER_PICTURES.map((u) => new URL(u, self.location.href).href));
  for (const req of await pics.keys()) {
    if (!keep.has(req.url.split('?')[0])) await pics.delete(req);
  }
}

const fresh = (u) => new Request(u, { cache: 'reload' });

// Fills the picture cache: a picture already held anywhere (this cache, or
// the cache of the version being replaced) is copied, never re-downloaded.
async function fillPictures() {
  const pics = await caches.open(PICTURE_CACHE);
  await Promise.allSettled(STICKER_PICTURES.map(async (u) => {
    const req = new Request(u);
    if (await pics.match(req)) return;
    const held = await caches.match(req);
    if (held) return pics.put(req, held);
    return pics.add(fresh(u));
  }));
}

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    // cache: 'reload' bypasses the HTTP cache, so a VERSION bump can never
    // precache a stale copy of an asset alongside fresh ones.
    const c = await caches.open(VERSION);
    await c.addAll(ASSETS.map(fresh));
    await fillPictures();
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== VERSION && k !== PICTURE_CACHE).map((k) => caches.delete(k))
      ))
      .then(() => prunePictures())
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
      return fetch(e.request)
        .then((res) => {
          // A picture that missed the precache gets cached once it loads.
          if (res.ok && e.request.url.includes('/stickers/')) {
            const copy = res.clone();
            caches.open(PICTURE_CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => {
          if (e.request.mode === 'navigate') return caches.match('./index.html');
          return Response.error();
        });
    })
  );
});
