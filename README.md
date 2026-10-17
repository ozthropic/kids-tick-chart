# Kids Tick Chart

A visual routine checklist for little kids (ages ~2–5), built as an offline-capable PWA for iPad.
Big illustrated cards to tap, a cheer and confetti for every step, and a surprise collectible
sticker for finishing a routine.

## Using it on an iPad

Open the published URL in Safari, then **Share → Add to Home Screen**. It launches full-screen,
works with no internet, and keeps stickers permanently.

## How it works

- **Kid screen** — giant tappable cards with hand-drawn SVG art. Tap a step to tick it, tap it
  again to undo a mistake.
- **Parent Mode** — press and hold the lock button in the corner for 3 seconds, then
  answer a quick sum (a grown-up check the child cannot pass). Choose a
  routine (Morning / Mealtime / Tidy Up / Bedtime), switch individual steps on or off for today,
  reorder them, add custom steps with your own icon, then **Publish** to hand the iPad over.
- **Rewards** — completing a routine awards a sticker, collected in an album with one page per
  series: 55 drawn characters (Series 1) and 112 picture stickers (Series 2, `stickers/s2/001.jpg`
  … `112.jpg`, 512 px JPEGs cropped to the round artwork).
- **History** — a month calendar in Parent Mode stars every day at least one routine was finished.

Settings, stickers, and history live only in the browser's localStorage on that device — nothing is
uploaded anywhere. Parent Mode has a backup/restore code for moving to a new device.

## Running locally

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`. No build step, no dependencies — plain HTML, CSS, and ES modules.

`tools/` holds development helpers (state seeder, art gallery, app-icon generator); they are not
part of the app and are excluded from the service worker's offline cache.

## Deploying an update

Bump `VERSION` in `sw.js` on every deploy, otherwise installed devices keep serving the cached
previous version.
