// gate.js — press-and-hold parent gate. The element must contain an SVG ring
// with class .gate-ring-fg; CSS animates its stroke-dashoffset while the
// element carries the .holding class (transition duration = hold time).
// Completion is verified by timestamp, not just the timer firing.

export function attachHoldGate(el, { ms = 3000, onComplete }) {
  let timer = null;
  let t0 = 0;

  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    el.classList.remove('holding');
  };

  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    // A second finger aborts the hold. Without this, the extra pointerdown
    // would overwrite the timer handle and leave the first timer running —
    // a two-finger toddler tap would then open the gate seconds later.
    if (timer) {
      cancel();
      return;
    }
    try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    t0 = Date.now();
    el.classList.add('holding');
    timer = setTimeout(() => {
      const held = Date.now() - t0;
      cancel();
      if (held >= ms - 150) onComplete();
    }, ms);
  });

  ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) =>
    el.addEventListener(ev, cancel)
  );
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancel();
  });
  el.addEventListener('contextmenu', (e) => e.preventDefault());
}
