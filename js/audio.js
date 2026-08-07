// audio.js — all SFX synthesized with Web Audio. No audio files.
// iOS: context is created/resumed inside the first user gesture (initAudioUnlock)
// and resumed whenever the PWA returns to the foreground.

let ctx = null;
let master = null;
let muted = false;

function ensureCtx() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
  }
  // iOS uses a non-standard 'interrupted' state after calls/Siri/alarms —
  // checking only for 'suspended' would leave the app permanently silent.
  if (ctx.state !== 'running' && ctx.state !== 'closed') ctx.resume().catch(() => {});
  return ctx;
}

export function setMuted(m) {
  muted = !!m;
  if (master) master.gain.value = muted ? 0 : 1;
}

export function initAudioUnlock() {
  const unlock = () => {
    const c = ensureCtx();
    if (c) {
      const buf = c.createBuffer(1, 1, 22050);
      const src = c.createBufferSource();
      src.buffer = buf;
      src.connect(c.destination);
      src.start(0);
    }
    document.removeEventListener('pointerdown', unlock, true);
  };
  document.addEventListener('pointerdown', unlock, true);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && ctx && ctx.state !== 'running' && ctx.state !== 'closed') {
      ctx.resume().catch(() => {});
    }
  });
}

function tone({ freq = 440, freqEnd = 0, time = 0, dur = 0.15, type = 'sine', vol = 0.5, attack = 0.005 }) {
  const t0 = ctx.currentTime + time;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

// Filtered-noise swell under the fanfare — reads as a little crowd cheer.
function cheer() {
  const t0 = ctx.currentTime + 0.1;
  const dur = 1.2;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1000;
  bp.Q.value = 0.8;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(0.16, t0 + 0.45);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(bp);
  bp.connect(g);
  g.connect(master);
  src.start(t0);
}

export const sfx = {
  pop() {
    if (!ensureCtx()) return;
    tone({ freq: 550, freqEnd: 880, dur: 0.12, type: 'sine', vol: 0.45 });
    tone({ freq: 1100, freqEnd: 1760, dur: 0.1, type: 'triangle', vol: 0.12 });
  },

  uncheck() {
    if (!ensureCtx()) return;
    tone({ freq: 500, freqEnd: 320, dur: 0.12, type: 'sine', vol: 0.2 });
  },

  fanfare() {
    if (!ensureCtx()) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((f, i) =>
      tone({ freq: f, time: i * 0.09, dur: 0.22, type: 'triangle', vol: 0.35 })
    );
    tone({ freq: 1046.5, time: 0.38, dur: 0.65, type: 'triangle', vol: 0.3 });
    tone({ freq: 1318.5, time: 0.38, dur: 0.65, type: 'triangle', vol: 0.2 });
    cheer();
  },

  shimmer() {
    if (!ensureCtx()) return;
    const notes = [1046.5, 1174.7, 1318.5, 1568, 1760, 2093]; // C-major pentatonic climb
    notes.forEach((f, i) =>
      tone({
        freq: f * (1 + (Math.random() - 0.5) * 0.012),
        time: i * 0.07,
        dur: 0.6,
        type: 'sine',
        vol: 0.16
      })
    );
  }
};
