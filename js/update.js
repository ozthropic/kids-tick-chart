// update.js — over-the-air updates.
//
// The app updates itself from its own URL: the service worker fetches the new
// files in the background and swaps them in. A parent never has to delete the
// home-screen icon and add it again.
//
// Timing matters more than speed here: a reload that yanks the screen away
// mid-routine would upset a child. So an update applies either
//   * immediately, if it lands within the first seconds of launch (invisible), or
//   * on the next time the app is brought to the foreground (a natural restart),
// unless a parent asked for it explicitly from Settings, which reloads at once.

const BOOT = Date.now();
const LAUNCH_GRACE_MS = 8000;
const POLL_MS = 30 * 60 * 1000;

let registration = null;
let hadController = false;
let pendingReload = false;
let forceReload = false;

function reloadNow() {
  pendingReload = false;
  location.reload();
}

export function initAutoUpdate() {
  if (!('serviceWorker' in navigator)) return;

  // Captured before registering: with no controller this is a first install,
  // not an update, and must not trigger a reload.
  hadController = !!navigator.serviceWorker.controller;

  navigator.serviceWorker.register('./sw.js')
    .then((reg) => {
      registration = reg;
      return reg.update();
    })
    .catch(() => { /* offline, or SW unsupported — the app still works */ });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) {
      hadController = true;
      return;
    }
    if (forceReload || Date.now() - BOOT < LAUNCH_GRACE_MS) {
      reloadNow();
      return;
    }
    pendingReload = true;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    if (pendingReload) {
      reloadNow();
      return;
    }
    if (registration) registration.update().catch(() => {});
  });

  // The iPad can sit on a nightstand for hours; re-check occasionally.
  setInterval(() => {
    if (registration) registration.update().catch(() => {});
  }, POLL_MS);
}

// Parent-initiated check. Resolves to 'updating' | 'current' | 'unavailable'.
export async function checkForUpdate() {
  if (!registration) return 'unavailable';
  forceReload = true;
  try {
    await registration.update();
  } catch {
    forceReload = false;
    return 'unavailable';
  }
  // Give a newly discovered worker a moment to show up as installing/waiting.
  await new Promise((r) => setTimeout(r, 1800));
  if (registration.installing || registration.waiting) return 'updating';
  forceReload = false;
  return 'current';
}

// The version string baked into the running service worker, or null offline /
// before the worker has taken control.
export function getVersion() {
  return new Promise((resolve) => {
    const ctrl = navigator.serviceWorker && navigator.serviceWorker.controller;
    if (!ctrl) return resolve(null);
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve(null), 1500);
    channel.port1.onmessage = (e) => {
      clearTimeout(timer);
      resolve(typeof e.data === 'string' ? e.data : null);
    };
    try {
      ctrl.postMessage('VERSION', [channel.port2]);
    } catch {
      clearTimeout(timer);
      resolve(null);
    }
  });
}
