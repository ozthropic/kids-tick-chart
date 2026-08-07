// confetti.js — per-tick DOM micro-burst + full-screen canvas rain.
// Both no-op under prefers-reduced-motion.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const COLORS = ['#FF8B7B', '#FFD166', '#7FD8BE', '#C792EA', '#F7A8C4', '#8FB4E3', '#4CC17E'];

// Small celebratory burst centered on an element (the tapped checkbox).
// 14 composited DOM particles, one shared CSS keyframe, self-cleaning.
export function burstAt(el, count = 14) {
  if (reduceMotion.matches || !el) return;
  const r = el.getBoundingClientRect();
  const holder = document.createElement('div');
  holder.className = 'confetti-burst';
  holder.style.left = (r.left + r.width / 2) + 'px';
  holder.style.top = (r.top + r.height / 2) + 'px';
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'confetti-p';
    const ang = (i / count) * Math.PI * 2 + Math.random() * 0.6;
    const dist = 55 + Math.random() * 75;
    p.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(1) + 'px');
    p.style.setProperty('--dy', (Math.sin(ang) * dist - 30).toFixed(1) + 'px');
    p.style.setProperty('--rot', Math.round(Math.random() * 540 - 270) + 'deg');
    p.style.setProperty('--dur', Math.round(550 + Math.random() * 350) + 'ms');
    p.style.background = COLORS[i % COLORS.length];
    if (Math.random() < 0.5) p.style.borderRadius = '50%';
    holder.appendChild(p);
  }
  document.body.appendChild(holder);
  setTimeout(() => holder.remove(), 1000);
}

// Full-screen confetti rain on a canvas (celebration screen).
let rafId = null;

export function startRain(canvas, durationMs = 3200) {
  if (reduceMotion.matches || !canvas) return;
  stopRain();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const g = canvas.getContext('2d');
  g.scale(dpr, dpr);

  const parts = [];
  for (let i = 0; i < 120; i++) {
    parts.push({
      x: Math.random() * w,
      y: -h * Math.random() - 20,
      vy: 120 + Math.random() * 160,        // px/s
      sway: 20 + Math.random() * 35,
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 8,
      rot: Math.random() * Math.PI,
      size: 7 + Math.random() * 7,
      color: COLORS[i % COLORS.length],
      round: Math.random() < 0.4
    });
  }

  const t0 = performance.now();
  let last = t0;
  const step = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const elapsed = now - t0;
    g.clearRect(0, 0, w, h);
    let alive = 0;
    for (const p of parts) {
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
      if (p.y < h + 20) alive++;
      const x = p.x + Math.sin(p.phase + elapsed / 400) * p.sway;
      g.save();
      g.translate(x, p.y);
      g.rotate(p.rot);
      g.fillStyle = p.color;
      if (p.round) {
        g.beginPath();
        g.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        g.fill();
      } else {
        g.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }
      g.restore();
    }
    if (alive > 0 && elapsed < durationMs + 4000) {
      rafId = requestAnimationFrame(step);
    } else {
      g.clearRect(0, 0, w, h);
      rafId = null;
    }
  };
  rafId = requestAnimationFrame(step);
}

export function stopRain() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}
