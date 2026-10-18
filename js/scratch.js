// scratch.js — a finger-scratchable silver coating over a round sticker.
//
// The coating is a canvas drawn once; every finger stroke erases a round
// brush from it (destination-out). Progress is not read back from the pixels
// (getImageData on a large canvas is slow on iPad): the same brush also
// marks a coarse grid, and the share of grid cells inside the circle that
// the brush has touched is the "scratched" fraction. Past `threshold` the
// rest dissolves and `onComplete` fires once.

const GRID = 30;          // cells per side
const BRUSH = 0.078;      // brush radius as a fraction of the coat's diameter
const SPARKLES = 26;

function mulberry(seed) {
  return function () {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawCoat(canvas) {
  const size = canvas.width;
  const g = canvas.getContext('2d');
  const r = size / 2;
  g.clearRect(0, 0, size, size);
  g.save();
  g.beginPath();
  g.arc(r, r, r, 0, Math.PI * 2);
  g.clip();

  // brushed-silver base
  const grad = g.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#C9CDD8');
  grad.addColorStop(0.45, '#EEF0F5');
  grad.addColorStop(0.55, '#D5D8E2');
  grad.addColorStop(1, '#B9BECB');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);

  // faint diagonal sheen stripes
  g.strokeStyle = 'rgba(255,255,255,0.35)';
  g.lineWidth = size * 0.012;
  for (let i = -size; i < size * 2; i += size * 0.11) {
    g.beginPath();
    g.moveTo(i, 0);
    g.lineTo(i - size, size);
    g.stroke();
  }

  // sparkles: little four-point stars
  const rand = mulberry(size);
  g.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < SPARKLES; i++) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand()) * r * 0.9;
    const x = r + Math.cos(a) * d;
    const y = r + Math.sin(a) * d;
    const s = size * (0.012 + rand() * 0.02);
    g.beginPath();
    g.moveTo(x, y - s);
    g.quadraticCurveTo(x, y, x + s, y);
    g.quadraticCurveTo(x, y, x, y + s);
    g.quadraticCurveTo(x, y, x - s, y);
    g.quadraticCurveTo(x, y, x, y - s);
    g.fill();
  }

  // a big soft question mark — "something is under here"
  g.fillStyle = 'rgba(80, 84, 110, 0.28)';
  g.font = '900 ' + Math.round(size * 0.46) + 'px ui-rounded, -apple-system, "Segoe UI", system-ui, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('?', r, r + size * 0.03);

  // inner rim so it reads as a card, not a flat disc
  g.lineWidth = size * 0.03;
  g.strokeStyle = 'rgba(255,255,255,0.6)';
  g.beginPath();
  g.arc(r, r, r - g.lineWidth / 2, 0, Math.PI * 2);
  g.stroke();
  g.restore();
}

// Wires scratching onto `canvas`. Pointer events are taken from `surface`
// (the whole card) so a stroke that starts a little outside still counts.
export function attachScratch(canvas, surface, { threshold = 0.7, onStroke, onComplete } = {}) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  // layout width: unlike getBoundingClientRect it ignores the card's drop-in
  // transform (scaled to 0.5 while it is still off screen)
  const cssSize = canvas.offsetWidth || canvas.getBoundingClientRect().width || 300;
  const size = Math.round(cssSize * dpr);
  canvas.width = size;
  canvas.height = size;
  drawCoat(canvas);

  const g = canvas.getContext('2d');
  g.globalCompositeOperation = 'destination-out';
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.lineWidth = BRUSH * 2 * size;

  // coverage grid over the unit square; only cells inside the circle count
  const cells = new Uint8Array(GRID * GRID);
  const inside = new Uint8Array(GRID * GRID);
  let total = 0;
  for (let j = 0; j < GRID; j++) {
    for (let i = 0; i < GRID; i++) {
      const cx = (i + 0.5) / GRID - 0.5;
      const cy = (j + 0.5) / GRID - 0.5;
      if (cx * cx + cy * cy <= 0.25) {
        inside[j * GRID + i] = 1;
        total++;
      }
    }
  }
  let cleared = 0;
  let done = false;
  const last = new Map(); // pointerId -> {x, y} in unit coordinates

  function markCell(x, y) {
    // mark every in-circle cell whose centre lies within the brush
    const r = BRUSH;
    const i0 = Math.max(0, Math.floor((x - r) * GRID));
    const i1 = Math.min(GRID - 1, Math.floor((x + r) * GRID));
    const j0 = Math.max(0, Math.floor((y - r) * GRID));
    const j1 = Math.min(GRID - 1, Math.floor((y + r) * GRID));
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const k = j * GRID + i;
        if (!inside[k] || cells[k]) continue;
        const dx = (i + 0.5) / GRID - x;
        const dy = (j + 0.5) / GRID - y;
        if (dx * dx + dy * dy <= r * r) {
          cells[k] = 1;
          cleared++;
        }
      }
    }
  }

  function markSegment(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.ceil(len / (BRUSH / 2)));
    for (let s = 0; s <= steps; s++) {
      markCell(a.x + (dx * s) / steps, a.y + (dy * s) / steps);
    }
  }

  function toUnit(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };
  }

  function erase(a, b) {
    g.beginPath();
    g.moveTo(a.x * size, a.y * size);
    g.lineTo(b.x * size, b.y * size);
    g.stroke();
  }

  function progress() {
    return total ? cleared / total : 1;
  }

  function finish() {
    if (done) return;
    done = true;
    last.clear();
    g.clearRect(0, 0, size, size);
    if (onComplete) onComplete();
  }

  function down(e) {
    if (done) return;
    const p = toUnit(e);
    last.set(e.pointerId, p);
    try { surface.setPointerCapture(e.pointerId); } catch { /* not needed */ }
    erase(p, p); // a dot, so a plain tap scratches too
    markCell(p.x, p.y);
    if (onStroke) onStroke(progress(), true);
    e.preventDefault();
  }

  function move(e) {
    if (done) return;
    const prev = last.get(e.pointerId);
    if (!prev) return;
    const batch = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
    let from = prev;
    for (const ev of (batch.length ? batch : [e])) {
      const p = toUnit(ev);
      erase(from, p);
      markSegment(from, p);
      from = p;
    }
    last.set(e.pointerId, from);
    if (onStroke) onStroke(progress(), false);
    if (progress() >= threshold) finish();
    e.preventDefault();
  }

  function up(e) {
    last.delete(e.pointerId);
    if (!done && progress() >= threshold) finish();
  }

  const block = (e) => e.preventDefault();
  surface.addEventListener('pointerdown', down);
  surface.addEventListener('pointermove', move);
  surface.addEventListener('pointerup', up);
  surface.addEventListener('pointercancel', up);
  surface.addEventListener('touchstart', block, { passive: false }); // no iOS scroll/zoom
  surface.addEventListener('touchmove', block, { passive: false });

  return {
    progress,
    // QA / accessibility escape hatch: reveal without scratching
    reveal: finish,
    destroy() {
      surface.removeEventListener('pointerdown', down);
      surface.removeEventListener('pointermove', move);
      surface.removeEventListener('pointerup', up);
      surface.removeEventListener('pointercancel', up);
      surface.removeEventListener('touchstart', block);
      surface.removeEventListener('touchmove', block);
    }
  };
}
