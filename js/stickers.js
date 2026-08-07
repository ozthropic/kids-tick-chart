// stickers.js — procedural sticker system: 10 base animals × 5 themes = 50
// unique stickers with deterministic ids "{base}-{theme}" (e.g. "fox-star").
// Follows the art style guide in icons.js (flat fills, #3E3A5C round outlines).
// Sticker canvas is 0 0 120 120: a die-cut badge disc + animal head + themed
// accessory. The "moon" theme draws every animal with sleepy closed eyes.

const C = {
  ink: '#3E3A5C',
  coral: '#FF8B7B',
  sun: '#FFD166',
  mint: '#7FD8BE',
  berry: '#C792EA',
  rose: '#F7A8C4',
  sky: '#8FB4E3',
  sky2: '#C3DAF2',
  cream: '#FFF7E8',
  check: '#4CC17E',
  night: '#55659E',
  white: '#FFFFFF',
  wood: '#C89B6E'
};

const s = `stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
const st = `stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"`;

const dot = (x, y, r = 3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.ink}"/>`;
const smile = (x, y, w = 10) => `<path d="M${x - w / 2} ${y} q${w / 2} ${w / 2} ${w} 0" fill="none" ${st}/>`;
const blush = (x, y) => `<circle cx="${x}" cy="${y}" r="4" fill="${C.rose}" opacity="0.85"/>`;
const sparkle = (x, y, r, fill = C.white) =>
  `<path d="M${x} ${y - r} L${x + r * 0.35} ${y - r * 0.35} L${x + r} ${y} L${x + r * 0.35} ${y + r * 0.35} L${x} ${y + r} L${x - r * 0.35} ${y + r * 0.35} L${x - r} ${y} L${x - r * 0.35} ${y - r * 0.35} Z" fill="${fill}" ${st}/>`;
const heart = (x, y, sc = 1) =>
  `<path d="M${x} ${y + 8 * sc} q${-9 * sc} ${-8 * sc} ${-5 * sc} ${-12 * sc} q${4 * sc} ${-3 * sc} ${5 * sc} ${2 * sc} q${1 * sc} ${-5 * sc} ${5 * sc} ${-2 * sc} q${4 * sc} ${4 * sc} ${-5 * sc} ${12 * sc} Z" fill="${C.white}" ${st}/>`;
const daisy = (x, y) => {
  let p = '';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    p += `<circle cx="${(x + Math.cos(a) * 5.5).toFixed(1)}" cy="${(y + Math.sin(a) * 5.5).toFixed(1)}" r="3.6" fill="${C.white}" ${st}/>`;
  }
  return p + `<circle cx="${x}" cy="${y}" r="3.4" fill="${C.sun}" ${st}/>`;
};
const zee = (x, y, sc = 1) =>
  `<path d="M${x} ${y} h${8 * sc} l-${8 * sc} ${8 * sc} h${8 * sc}" fill="none" stroke="${C.white}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;

// eyes: open dots normally, happy closed arcs for the sleepy (moon) theme
const eyes = (t, lx, rx, y) =>
  t.sleepy
    ? `<path d="M${lx - 4} ${y} q4 4 8 0 M${rx - 4} ${y} q4 4 8 0" fill="none" ${st}/>`
    : dot(lx, y, 3.2) + dot(rx, y, 3.2);

/* ───────────── themes ───────────── */

const THEMES = [
  {
    id: 'star',
    name: 'Starry',
    bg: C.sun,
    sleepy: false,
    deco: sparkle(26, 40, 6) + sparkle(96, 42, 5) + sparkle(90, 90, 5) + sparkle(26, 86, 4.5),
    accessory:
      `<path d="M46 34 L58 6 L70 34 Z" fill="${C.coral}" ${s}/>` +
      `<path d="M50 25 h16" stroke="${C.white}" stroke-width="4" stroke-linecap="round"/>` +
      `<circle cx="58" cy="7" r="5" fill="${C.sun}" ${st}/>`
  },
  {
    id: 'heart',
    name: 'Lovey',
    bg: C.rose,
    sleepy: false,
    deco: heart(24, 34, 1) + heart(98, 40, 0.8) + heart(90, 88, 0.9) + heart(26, 88, 0.7),
    accessory:
      `<path d="M79 28 L62 20 L66 38 Z" fill="${C.coral}" ${s}/>` +
      `<path d="M79 28 L96 18 L94 38 Z" fill="${C.coral}" ${s}/>` +
      `<circle cx="79" cy="28" r="5.5" fill="${C.sun}" ${st}/>`
  },
  {
    id: 'moon',
    name: 'Sleepy',
    bg: C.night,
    sleepy: true,
    deco:
      `<path d="M26 24 A14 14 0 1 0 36 42 A11 11 0 0 1 26 24 Z" fill="${C.white}" ${st}/>` +
      sparkle(96, 36, 4.5) + sparkle(24, 90, 4) + zee(92, 78, 1) + zee(100, 88, 0.6),
    accessory:
      `<path d="M38 32 Q46 8 88 15 L84 32 Z" fill="${C.berry}" ${s}/>` +
      `<rect x="34" y="30" width="54" height="10" rx="5" fill="${C.white}" ${st}/>` +
      `<circle cx="90" cy="14" r="5.5" fill="${C.white}" ${st}/>`
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    bg: C.sky2,
    sleepy: false,
    deco:
      `<path d="M22 52 A38 38 0 0 1 98 52" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M30 52 A30 30 0 0 1 90 52" fill="none" stroke="${C.sun}" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M38 52 A22 22 0 0 1 82 52" fill="none" stroke="${C.mint}" stroke-width="7" stroke-linecap="round"/>`,
    accessory:
      `<path d="M38 86 q22 13 44 0 l-3 13 q-19 10 -38 0 Z" fill="${C.coral}" ${s}/>` +
      `<path d="M48 92 v6 M60 95 v6 M72 92 v6" stroke="${C.white}" stroke-width="4" stroke-linecap="round"/>`
  },
  {
    id: 'flower',
    name: 'Blossom',
    bg: C.mint,
    sleepy: false,
    deco: daisy(24, 42) + daisy(96, 40) + daisy(28, 88) + `<circle cx="92" cy="86" r="3" fill="${C.white}"/>`,
    accessory: daisy(40, 30) + daisy(60, 23) + daisy(80, 30)
  }
];

/* ───────────── base animals (heads centered ~(60,62)) ───────────── */

const BASES = {
  bear: (t) => `
    <circle cx="38" cy="36" r="11" fill="${C.wood}" ${s}/>
    <circle cx="82" cy="36" r="11" fill="${C.wood}" ${s}/>
    <circle cx="38" cy="36" r="5" fill="${C.rose}"/>
    <circle cx="82" cy="36" r="5" fill="${C.rose}"/>
    <circle cx="60" cy="62" r="30" fill="${C.wood}" ${s}/>
    ${eyes(t, 49, 71, 57)}
    ${blush(40, 66)} ${blush(80, 66)}
    <ellipse cx="60" cy="72" rx="11" ry="8" fill="${C.cream}" ${st}/>
    <ellipse cx="60" cy="68" rx="4" ry="3" fill="${C.ink}"/>
    ${smile(60, 75, 8)}`,

  bunny: (t) => `
    <ellipse cx="48" cy="26" rx="9" ry="21" fill="${C.white}" ${s}/>
    <ellipse cx="72" cy="26" rx="9" ry="21" fill="${C.white}" ${s}/>
    <ellipse cx="48" cy="29" rx="4.5" ry="13" fill="${C.rose}"/>
    <ellipse cx="72" cy="29" rx="4.5" ry="13" fill="${C.rose}"/>
    <circle cx="60" cy="64" r="27" fill="${C.white}" ${s}/>
    ${eyes(t, 50, 70, 60)}
    ${blush(42, 70)} ${blush(78, 70)}
    <path d="M57 68 h6 l-3 4.5 Z" fill="${C.rose}" ${st}/>
    ${smile(60, 76, 8)}`,

  cat: (t) => `
    <path d="M36 46 L40 20 L58 35 Z" fill="${C.sun}" ${s}/>
    <path d="M84 46 L80 20 L62 35 Z" fill="${C.sun}" ${s}/>
    <path d="M42 38 L43 28 L51 34 Z" fill="${C.rose}"/>
    <path d="M78 38 L77 28 L69 34 Z" fill="${C.rose}"/>
    <circle cx="60" cy="64" r="28" fill="${C.sun}" ${s}/>
    ${eyes(t, 49, 71, 59)}
    <path d="M24 62 h11 M25 70 h10 M85 62 h11 M85 70 h10" fill="none" ${st}/>
    <path d="M57 67 h6 l-3 4 Z" fill="${C.rose}" ${st}/>
    ${smile(60, 75, 8)}`,

  fox: (t) => `
    <path d="M34 48 L38 17 L60 34 Z" fill="${C.coral}" ${s}/>
    <path d="M86 48 L82 17 L60 34 Z" fill="${C.coral}" ${s}/>
    <path d="M40 40 L42 27 L52 35 Z" fill="${C.white}"/>
    <path d="M80 40 L78 27 L68 35 Z" fill="${C.white}"/>
    <circle cx="60" cy="62" r="29" fill="${C.coral}" ${s}/>
    <ellipse cx="60" cy="75" rx="16" ry="11" fill="${C.white}"/>
    ${eyes(t, 48, 72, 57)}
    ${blush(40, 66)} ${blush(80, 66)}
    <circle cx="60" cy="72" r="3.5" fill="${C.ink}"/>
    ${smile(60, 78, 8)}`,

  frog: (t) => `
    <circle cx="42" cy="38" r="11" fill="${C.mint}" ${s}/>
    <circle cx="78" cy="38" r="11" fill="${C.mint}" ${s}/>
    ${t.sleepy
      ? `<path d="M38 38 q4 4 8 0 M74 38 q4 4 8 0" fill="none" ${st}/>`
      : `<circle cx="42" cy="38" r="5.5" fill="${C.white}" ${st}/><circle cx="78" cy="38" r="5.5" fill="${C.white}" ${st}/>${dot(42, 38, 2.4)}${dot(78, 38, 2.4)}`}
    <ellipse cx="60" cy="66" rx="31" ry="24" fill="${C.mint}" ${s}/>
    ${dot(54, 60, 1.8)} ${dot(66, 60, 1.8)}
    ${blush(38, 70)} ${blush(82, 70)}
    <path d="M46 70 q14 11 28 0" fill="none" ${st}/>`,

  owl: (t) => `
    <path d="M38 34 L33 17 L50 26 Z" fill="${C.berry}" ${s}/>
    <path d="M82 34 L87 17 L70 26 Z" fill="${C.berry}" ${s}/>
    <circle cx="60" cy="62" r="30" fill="${C.berry}" ${s}/>
    <circle cx="47" cy="56" r="12" fill="${C.white}" ${st}/>
    <circle cx="73" cy="56" r="12" fill="${C.white}" ${st}/>
    ${eyes(t, 47, 73, 56)}
    <path d="M55 66 h10 l-5 8 Z" fill="${C.sun}" ${s}/>
    <path d="M48 82 q4 -5 8 0 M64 82 q4 -5 8 0" fill="none" stroke="${C.white}" stroke-width="3.5" stroke-linecap="round"/>`,

  penguin: (t) => `
    <circle cx="60" cy="62" r="30" fill="${C.night}" ${s}/>
    <ellipse cx="60" cy="68" rx="19" ry="15" fill="${C.white}"/>
    ${eyes(t, 51, 69, 62)}
    ${blush(44, 70)} ${blush(76, 70)}
    <path d="M56 70 h8 l-4 6 Z" fill="${C.coral}" ${s}/>
    <path d="M34 40 q-6 -8 2 -12 M86 40 q6 -8 -2 -12" fill="none" ${st}/>`,

  dino: (t) => `
    <path d="M40 40 L47 21 L56 38 Z" fill="${C.sun}" ${s}/>
    <path d="M58 36 L66 17 L74 35 Z" fill="${C.sun}" ${s}/>
    <circle cx="60" cy="64" r="29" fill="${C.check}" ${s}/>
    ${eyes(t, 49, 71, 58)}
    ${blush(40, 68)} ${blush(80, 68)}
    ${dot(55, 70, 2)} ${dot(65, 70, 2)}
    ${smile(60, 76, 10)}`,

  duck: (t) => `
    <path d="M60 32 q-2 -9 7 -11" fill="none" ${st}/>
    <circle cx="60" cy="62" r="28" fill="${C.sun}" ${s}/>
    ${eyes(t, 49, 71, 56)}
    ${blush(40, 64)} ${blush(80, 64)}
    <ellipse cx="60" cy="72" rx="12" ry="6.5" fill="${C.coral}" ${s}/>
    <ellipse cx="60" cy="78" rx="8" ry="4" fill="${C.coral}" ${st}/>`,

  koala: (t) => `
    <circle cx="34" cy="42" r="13" fill="${C.sky2}" ${s}/>
    <circle cx="86" cy="42" r="13" fill="${C.sky2}" ${s}/>
    <circle cx="34" cy="42" r="6" fill="${C.rose}"/>
    <circle cx="86" cy="42" r="6" fill="${C.rose}"/>
    <circle cx="60" cy="64" r="28" fill="${C.sky2}" ${s}/>
    ${eyes(t, 48, 72, 58)}
    ${blush(40, 68)} ${blush(80, 68)}
    <ellipse cx="60" cy="70" rx="6.5" ry="9" fill="${C.ink}"/>
    ${smile(60, 82, 7)}`
};

/* ───────────── public API ───────────── */

export const BASE_ORDER = ['bear', 'bunny', 'cat', 'fox', 'frog', 'owl', 'penguin', 'dino', 'duck', 'koala'];
export const THEME_ORDER = THEMES.map((t) => t.id);

export const STICKER_IDS = [];
for (const b of BASE_ORDER) {
  for (const t of THEME_ORDER) STICKER_IDS.push(`${b}-${t}`);
}

function parts(id) {
  const i = id.lastIndexOf('-');
  const base = id.slice(0, i);
  const theme = THEMES.find((t) => t.id === id.slice(i + 1));
  return BASES[base] && theme ? { base, theme } : null;
}

export function stickerSvg(id) {
  const p = parts(id) || { base: 'bear', theme: THEMES[0] };
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="60" cy="60" r="58" fill="${C.white}"/>
    <circle cx="60" cy="60" r="58" fill="none" stroke="${C.ink}" stroke-width="3"/>
    <circle cx="60" cy="60" r="52" fill="${p.theme.bg}"/>
    ${p.theme.deco}
    ${BASES[p.base](p.theme)}
    ${p.theme.accessory}
  </svg>`;
}

export function stickerName(id) {
  const p = parts(id);
  if (!p) return 'Mystery Sticker';
  return `${p.theme.name} ${p.base.charAt(0).toUpperCase()}${p.base.slice(1)}`;
}
