// icons.js — the SVG icon library. Every icon is an inline SVG string.
//
// ── STYLE GUIDE (applies to icons here, stickers.js and any future art) ──
//  • viewBox "0 0 100 100", content within ~8-unit margins
//  • flat fills, 5-unit outline #3E3A5C, round linecap + linejoin
//  • everything rounded — no sharp corners
//  • one white/light highlight per major shape where it helps
//  • faces: dot eyes + smile arc (quadratic curve)
//  • palette = CSS design tokens below + SKIN/WOOD art constants; no gradients
// ─────────────────────────────────────────────────────────────────────────

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
  skin: '#FFD9B8',
  wood: '#C89B6E'
};

// shared outline attributes
const s = `stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
// thin outline for small details
const st = `stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"`;

const svg = (inner) =>
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

const dot = (x, y, r = 2.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.ink}"/>`;
const smile = (x, y, w = 12) => `<path d="M${x - w / 2} ${y} q${w / 2} ${w / 2} ${w} 0" fill="none" ${st}/>`;
const sparkle = (x, y, r = 6, fill = C.sun) =>
  `<path d="M${x} ${y - r} L${x + r * 0.35} ${y - r * 0.35} L${x + r} ${y} L${x + r * 0.35} ${y + r * 0.35} L${x} ${y + r} L${x - r * 0.35} ${y + r * 0.35} L${x - r} ${y} L${x - r * 0.35} ${y - r * 0.35} Z" fill="${fill}" ${st}/>`;
const drop = (x, y, sc = 1) =>
  `<path d="M${x} ${y} C${x + 5 * sc} ${y + 7 * sc} ${x + 6 * sc} ${y + 11 * sc} ${x} ${y + 14 * sc} C${x - 6 * sc} ${y + 11 * sc} ${x - 5 * sc} ${y + 7 * sc} ${x} ${y} Z" fill="${C.sky}" ${st}/>`;
const zee = (x, y, sc = 1) =>
  `<path d="M${x} ${y} h${9 * sc} l-${9 * sc} ${9 * sc} h${9 * sc}" fill="none" ${st}/>`;

export const ICONS = {

  /* ───────────── preset routine items ───────────── */

  bath: svg(`
    <circle cx="60" cy="24" r="7" fill="${C.sky2}" ${st}/>
    <circle cx="73" cy="16" r="5" fill="${C.sky2}" ${st}/>
    <circle cx="50" cy="14" r="4" fill="${C.sky2}" ${st}/>
    <circle cx="62" cy="22" r="2" fill="${C.white}"/>
    <path d="M20 34 V22 a9 9 0 0 1 9 -9 h7" fill="none" ${s}/>
    ${drop(36, 20, 0.7)}
    <path d="M14 48 H86 V56 A24 24 0 0 1 62 80 H38 A24 24 0 0 1 14 56 Z" fill="${C.white}" ${s}/>
    <line x1="8" y1="48" x2="92" y2="48" ${s}/>
    <path d="M30 80 l-5 9 M70 80 l5 9" fill="none" ${s}/>
  `),

  pyjamas: svg(`
    <path d="M36 12 L18 22 L26 34 L32 30 V44 H68 V30 L74 34 L82 22 L64 12 Q50 22 36 12 Z" fill="${C.berry}" ${s}/>
    ${sparkle(50, 28, 4.5, C.sun)}
    ${sparkle(40, 36, 3.5, C.sun)}
    ${sparkle(60, 36, 3.5, C.sun)}
    <path d="M32 52 H68 V86 H56 L50 68 L44 86 H32 Z" fill="${C.sky}" ${s}/>
    <path d="M40 52 V64 M50 52 V60 M60 52 V64" stroke="${C.white}" stroke-width="4" stroke-linecap="round"/>
  `),

  'brush-teeth': svg(`
    <rect x="8" y="12" width="44" height="11" rx="5.5" fill="${C.coral}" ${s}/>
    <rect x="52" y="9" width="30" height="16" rx="8" fill="${C.white}" ${s}/>
    <path d="M60 13 v8 M68 13 v8 M76 13 v8" stroke="${C.sky2}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M30 48 Q28 30 42 30 Q50 30 50 36 Q50 30 58 30 Q72 30 70 48 Q69 58 65 70 Q63 76 59 76 Q55 76 54 68 Q53 62 50 62 Q47 62 46 68 Q45 76 41 76 Q37 76 35 70 Q31 58 30 48 Z" fill="${C.white}" ${s}/>
    ${dot(43, 46)} ${dot(57, 46)}
    ${smile(50, 51, 12)}
  `),

  potty: svg(`
    <rect x="28" y="12" width="44" height="18" rx="7" fill="${C.sky2}" ${s}/>
    <circle cx="62" cy="21" r="3.5" fill="${C.white}" ${st}/>
    <rect x="36" y="30" width="28" height="10" fill="${C.white}" ${s}/>
    <ellipse cx="50" cy="52" rx="30" ry="15" fill="${C.white}" ${s}/>
    <ellipse cx="50" cy="52" rx="18" ry="8" fill="${C.sky2}" ${st}/>
    <path d="M40 66 L37 86 H63 L60 66" fill="${C.white}" ${s}/>
  `),

  'book-song': svg(`
    <ellipse cx="58" cy="26" rx="5" ry="4" fill="${C.ink}"/>
    <ellipse cx="76" cy="22" rx="5" ry="4" fill="${C.ink}"/>
    <path d="M62.5 25 V10 L80.5 6 V21 M62.5 12 L80.5 8" fill="none" ${st}/>
    <path d="M50 42 Q32 32 14 38 V80 Q32 74 50 84 Q68 74 86 80 V38 Q68 32 50 42 Z" fill="${C.white}" ${s}/>
    <path d="M50 42 V84" fill="none" ${s}/>
    <path d="M22 50 Q33 46 43 50 M22 60 Q33 56 43 60 M57 50 Q67 46 78 50 M57 60 Q67 56 78 60" fill="none" stroke="${C.sky}" stroke-width="3.5" stroke-linecap="round"/>
  `),

  sleep: svg(`
    <path d="M60 10 A38 38 0 1 0 88 58 A30 30 0 0 1 60 10 Z" fill="${C.sun}" ${s}/>
    <path d="M30 50 q4 4 8 0 M44 54 q4 4 8 0" fill="none" ${st}/>
    ${smile(42, 64, 12)}
    ${zee(66, 20, 1)}
    ${zee(82, 10, 0.6)}
    ${sparkle(16, 26, 5, C.sun)}
  `),

  'wake-up': svg(`
    <path d="M26 66 a24 24 0 0 1 48 0 Z" fill="${C.sun}" ${s}/>
    <path d="M50 30 V16 M28 38 L18 28 M72 38 L82 28 M20 56 H8 M92 56 H80" fill="none" ${s}/>
    <line x1="10" y1="66" x2="90" y2="66" ${s}/>
    ${dot(42, 56)} ${dot(58, 56)}
    ${smile(50, 59, 12)}
    <path d="M20 82 h14 M66 82 h14" fill="none" stroke="${C.mint}" stroke-width="5" stroke-linecap="round"/>
  `),

  'wash-face': svg(`
    <circle cx="50" cy="56" r="26" fill="${C.skin}" ${s}/>
    <path d="M36 34 q14 -10 28 0" fill="none" ${st}/>
    ${dot(41, 52)} ${dot(59, 52)}
    <circle cx="35" cy="61" r="4" fill="${C.rose}"/>
    <circle cx="65" cy="61" r="4" fill="${C.rose}"/>
    ${smile(50, 64, 14)}
    ${drop(18, 22)} ${drop(82, 22)} ${drop(50, 6, 0.8)}
  `),

  'get-dressed': svg(`
    <path d="M34 18 L14 30 L24 44 L32 38 V84 H68 V38 L76 44 L86 30 L66 18 Q58 26 50 26 Q42 26 34 18 Z" fill="${C.mint}" ${s}/>
    <path d="M50 64 q-9 -9 -5 -14 q4 -4 5 1 q1 -5 5 -1 q4 5 -5 14 Z" fill="${C.coral}" ${st}/>
    <path d="M42 22 q8 6 16 0" fill="none" ${st}/>
  `),

  breakfast: svg(`
    <path d="M34 32 q-4 -7 0 -14 M46 30 q4 -7 0 -14" fill="none" ${st}/>
    <path d="M17 50 a33 22 0 0 0 66 0 Z" fill="${C.coral}" ${s}/>
    <path d="M78 16 L64 46" fill="none" ${s}/>
    <ellipse cx="80" cy="13" rx="5.5" ry="7.5" fill="${C.sky2}" ${st} transform="rotate(24 80 13)"/>
    <ellipse cx="50" cy="50" rx="33" ry="8" fill="${C.white}" ${s}/>
    <circle cx="36" cy="49" r="3.2" fill="${C.sun}" ${st}/>
    <circle cx="47" cy="51" r="3.2" fill="${C.berry}" ${st}/>
    <circle cx="58" cy="49" r="3.2" fill="${C.mint}" ${st}/>
    <circle cx="66" cy="51" r="2.6" fill="${C.rose}" ${st}/>
    <path d="M42 80 h16" fill="none" ${s}/>
  `),

  'wash-hands': svg(`
    <path d="M12 20 h26 a10 10 0 0 1 10 10 v4" fill="none" ${s}/>
    <rect x="12" y="14" width="8" height="12" rx="4" fill="${C.sky2}" ${st}/>
    ${drop(48, 40)} ${drop(40, 52, 0.7)} ${drop(56, 52, 0.7)}
    <path d="M26 66 a24 17 0 0 0 48 0 Z" fill="${C.skin}" ${s}/>
    <path d="M34 72 q-3 3 0 6 M42 76 q-3 3 0 6" fill="none" ${st}/>
    <circle cx="76" cy="28" r="6" fill="${C.sky2}" ${st}/>
    <circle cx="86" cy="40" r="4" fill="${C.sky2}" ${st}/>
  `),

  'sit-table': svg(`
    <ellipse cx="40" cy="42" rx="15" ry="5.5" fill="${C.white}" ${st}/>
    <rect x="12" y="46" width="58" height="9" rx="4.5" fill="${C.wood}" ${s}/>
    <path d="M20 55 V84 M62 55 V84" fill="none" ${s}/>
    <rect x="80" y="20" width="8" height="42" rx="4" fill="${C.coral}" ${s}/>
    <rect x="66" y="54" width="22" height="8" rx="4" fill="${C.coral}" ${s}/>
    <path d="M70 62 V84 M84 62 V84" fill="none" ${s}/>
  `),

  'eat-food': svg(`
    <path d="M14 22 v10 M21 22 v10 M28 22 v10 M21 32 v20" fill="none" ${s}/>
    <ellipse cx="55" cy="60" rx="33" ry="16" fill="${C.white}" ${s}/>
    <ellipse cx="55" cy="60" rx="22" ry="9" fill="none" stroke="${C.sky2}" stroke-width="3.5"/>
    <path d="M44 52 l-8 6 12 2 Z" fill="${C.coral}" ${st}/>
    <rect x="58" y="50" width="6" height="10" rx="3" fill="${C.mint}" ${st}/>
    <circle cx="61" cy="46" r="7" fill="${C.mint}" ${st}/>
    <circle cx="55" cy="49" r="5" fill="${C.mint}" ${st}/>
    <circle cx="67" cy="49" r="5" fill="${C.mint}" ${st}/>
  `),

  'drink-water': svg(`
    <path d="M54 34 V14 h14" fill="none" stroke="${C.coral}" stroke-width="7" stroke-linecap="round"/>
    <path d="M35 52 L38.5 80 H61.5 L65 52 Z" fill="${C.sky}"/>
    <path d="M32 26 L38 84 H62 L68 26 Z" fill="none" ${s}/>
    <line x1="32" y1="26" x2="68" y2="26" ${s}/>
    <circle cx="46" cy="62" r="3" fill="${C.white}"/>
    <circle cx="55" cy="70" r="2.4" fill="${C.white}"/>
  `),

  'clean-up': svg(`
    <rect x="20" y="46" width="24" height="34" rx="7" fill="${C.mint}" ${s}/>
    <rect x="27" y="36" width="10" height="10" fill="${C.white}" ${st}/>
    <rect x="22" y="26" width="24" height="12" rx="5" fill="${C.sky}" ${s}/>
    <path d="M22 30 l-9 4 v5 h9" fill="${C.sky}" ${st}/>
    ${sparkle(62, 22, 6)}
    ${sparkle(76, 34, 4.5)}
    ${sparkle(64, 44, 3.5)}
    <path d="M56 58 q8 -6 15 0 q8 6 15 0 v20 q-7 6 -15 0 q-8 -6 -15 0 Z" fill="${C.rose}" ${s}/>
  `),

  'pick-up-toys': svg(`
    <circle cx="30" cy="28" r="13" fill="${C.coral}" ${s}/>
    <path d="M18 24 q12 8 24 0" fill="none" ${st}/>
    <circle cx="26" cy="24" r="3" fill="${C.white}"/>
    <rect x="54" y="16" width="19" height="19" rx="4" fill="${C.sun}" ${s}/>
    ${sparkle(63.5, 25.5, 4.5, C.white)}
    <rect x="14" y="42" width="72" height="11" rx="5.5" fill="${C.berry}" ${s}/>
    <path d="M22 53 h56 l-6 33 H28 Z" fill="${C.wood}" ${s}/>
    <path d="M50 76 q-8 -8 -4 -12 q4 -3 4 2 q0 -5 4 -2 q4 4 -4 12 Z" fill="${C.white}" ${st}/>
  `),

  'books-shelf': svg(`
    <rect x="20" y="34" width="14" height="44" rx="3" fill="${C.coral}" ${s}/>
    <rect x="36" y="28" width="14" height="50" rx="3" fill="${C.mint}" ${s}/>
    <rect x="52" y="34" width="14" height="44" rx="3" fill="${C.sun}" ${s}/>
    <rect x="70" y="32" width="13" height="46" rx="3" fill="${C.berry}" ${s} transform="rotate(9 76.5 55)"/>
    <path d="M24 42 h6 M40 36 h6 M56 42 h6" fill="none" ${st}/>
    <rect x="12" y="78" width="76" height="9" rx="4.5" fill="${C.wood}" ${s}/>
  `),

  'clothes-basket': svg(`
    <rect x="28" y="20" width="13" height="26" rx="6" fill="${C.rose}" ${s}/>
    <rect x="56" y="24" width="12" height="22" rx="6" fill="${C.sky}" ${s}/>
    <rect x="14" y="42" width="72" height="11" rx="5.5" fill="${C.wood}" ${s}/>
    <path d="M20 53 h60 l-7 33 H27 Z" fill="${C.sun}" ${s}/>
    <path d="M24 64 h52 M27 75 h46" fill="none" ${st}/>
    <path d="M34 53 l6 33 M50 53 v33 M66 53 l-6 33" fill="none" ${st}/>
  `),

  /* ───────────── bonus icons (custom items) ───────────── */

  medicine: svg(`
    <rect x="28" y="20" width="26" height="12" rx="5" fill="${C.coral}" ${s}/>
    <rect x="26" y="32" width="30" height="48" rx="9" fill="${C.white}" ${s}/>
    <rect x="31" y="44" width="20" height="20" rx="5" fill="${C.rose}" ${st}/>
    <path d="M41 48 v12 M35 54 h12" stroke="${C.white}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="76" cy="42" rx="8" ry="6" fill="${C.sky2}" ${st}/>
    <path d="M74 48 L68 76" fill="none" ${s}/>
  `),

  vitamins: svg(`
    <rect x="26" y="18" width="30" height="12" rx="5" fill="${C.coral}" ${s}/>
    <rect x="24" y="30" width="34" height="50" rx="10" fill="${C.sun}" ${s}/>
    <rect x="30" y="42" width="22" height="24" rx="6" fill="${C.white}" ${st}/>
    ${sparkle(41, 54, 6, C.sun)}
    <circle cx="72" cy="66" r="7" fill="${C.mint}" ${st}/>
    <circle cx="84" cy="54" r="6" fill="${C.coral}" ${st}/>
  `),

  'water-plant': svg(`
    <path d="M40 48 L62 34 L68 42 L46 56 Z" fill="${C.sky}" ${s}/>
    <rect x="10" y="46" width="32" height="28" rx="7" fill="${C.sky}" ${s}/>
    <path d="M14 46 a12 12 0 0 1 24 0" fill="none" ${s}/>
    ${drop(72, 44, 0.6)} ${drop(80, 52, 0.6)}
    <path d="M64 78 h22 l-4 14 h-14 Z" fill="${C.coral}" ${s}/>
    <path d="M75 78 V68" fill="none" ${s}/>
    <ellipse cx="66" cy="64" rx="8" ry="5" fill="${C.mint}" ${st} transform="rotate(-30 66 64)"/>
    <ellipse cx="84" cy="64" rx="8" ry="5" fill="${C.mint}" ${st} transform="rotate(30 84 64)"/>
  `),

  'feed-pet': svg(`
    <circle cx="34" cy="32" r="18" fill="${C.wood}" ${s}/>
    <ellipse cx="18" cy="26" rx="6" ry="10" fill="${C.wood}" ${s} transform="rotate(20 18 26)"/>
    <ellipse cx="50" cy="26" rx="6" ry="10" fill="${C.wood}" ${s} transform="rotate(-20 50 26)"/>
    ${dot(28, 30)} ${dot(40, 30)}
    <circle cx="34" cy="37" r="3" fill="${C.ink}"/>
    ${smile(34, 40, 8)}
    <path d="M52 66 h38 l-5 18 H57 Z" fill="${C.coral}" ${s}/>
    <circle cx="62" cy="62" r="3" fill="${C.sun}" ${st}/>
    <circle cx="72" cy="60" r="3" fill="${C.sun}" ${st}/>
    <circle cx="81" cy="62" r="3" fill="${C.sun}" ${st}/>
  `),

  'wash-hair': svg(`
    <circle cx="50" cy="58" r="24" fill="${C.skin}" ${s}/>
    <path d="M34 54 q4 4 8 0 M58 54 q4 4 8 0" fill="none" ${st}/>
    ${smile(50, 66, 12)}
    <circle cx="36" cy="30" r="11" fill="${C.white}" ${st}/>
    <circle cx="52" cy="24" r="13" fill="${C.white}" ${st}/>
    <circle cx="66" cy="31" r="10" fill="${C.white}" ${st}/>
    <circle cx="20" cy="16" r="5" fill="${C.sky2}" ${st}/>
    <circle cx="82" cy="14" r="4" fill="${C.sky2}" ${st}/>
    ${drop(84, 44, 0.7)}
  `),

  nap: svg(`
    <rect x="14" y="42" width="70" height="34" rx="15" fill="${C.sky2}" ${s}/>
    <circle cx="42" cy="56" r="16" fill="${C.skin}" ${s}/>
    <path d="M34 54 q3.5 3.5 7 0 M43 54 q3.5 3.5 7 0" fill="none" ${st}/>
    ${smile(42, 62, 8)}
    ${zee(66, 18, 1)}
    ${zee(82, 10, 0.6)}
  `),

  park: svg(`
    <circle cx="84" cy="16" r="8" fill="${C.sun}" ${st}/>
    <path d="M84 4 v-2 M96 16 h2 M92 8 l2 -2 M92 24 l2 2" fill="none" ${st}/>
    <circle cx="46" cy="38" r="22" fill="${C.mint}" ${s}/>
    <circle cx="28" cy="48" r="12" fill="${C.mint}" ${s}/>
    <circle cx="64" cy="48" r="12" fill="${C.mint}" ${s}/>
    <rect x="40" y="56" width="12" height="26" rx="5" fill="${C.wood}" ${s}/>
    <line x1="10" y1="84" x2="90" y2="84" ${s}/>
    <path d="M16 84 q2 -8 4 0 M76 84 q2 -8 4 0" fill="none" ${st}/>
  `),

  shoes: svg(`
    <path d="M18 36 h26 v16 q20 0 32 10 q8 5 8 12 H18 Z" fill="${C.coral}" ${s}/>
    <rect x="14" y="74" width="74" height="9" rx="4.5" fill="${C.white}" ${s}/>
    <path d="M26 44 l10 8 M26 52 l10 -8" stroke="${C.white}" stroke-width="4" stroke-linecap="round"/>
    <path d="M62 62 a14 10 0 0 1 20 8" fill="none" stroke="${C.white}" stroke-width="4" stroke-linecap="round"/>
  `),

  coat: svg(`
    <path d="M30 26 a20 15 0 0 1 40 0 V84 H30 Z" fill="${C.sky}" ${s}/>
    <path d="M30 42 h40 M30 58 h40 M30 72 h40" fill="none" ${st}/>
    <path d="M50 30 V84" stroke="${C.white}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="50" cy="38" r="3" fill="${C.sun}" ${st}/>
    <rect x="14" y="30" width="12" height="34" rx="6" fill="${C.sky}" ${s}/>
    <rect x="74" y="30" width="12" height="34" rx="6" fill="${C.sky}" ${s}/>
  `),

  backpack: svg(`
    <path d="M40 22 a10 10 0 0 1 20 0" fill="none" ${s}/>
    <rect x="24" y="24" width="52" height="58" rx="15" fill="${C.berry}" ${s}/>
    <rect x="34" y="50" width="32" height="24" rx="9" fill="${C.rose}" ${s}/>
    <circle cx="50" cy="62" r="3.5" fill="${C.sun}" ${st}/>
    <path d="M30 38 h40" fill="none" ${st}/>
  `),

  homework: svg(`
    <rect x="18" y="14" width="46" height="62" rx="6" fill="${C.white}" ${s}/>
    <path d="M26 28 h30 M26 40 h30 M26 52 h18" fill="none" stroke="${C.sky}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M52 82 L80 50 l10 8 L62 90 l-13 3 Z" fill="${C.sun}" ${s}/>
    <path d="M52 82 l3 8" fill="none" ${st}/>
    <path d="M80 50 l10 8" fill="none" ${st}/>
  `),

  sunscreen: svg(`
    <circle cx="80" cy="18" r="8" fill="${C.sun}" ${st}/>
    <path d="M80 6 v-2 M68 18 h-2 M92 18 h2 M72 10 l-2 -2 M88 10 l2 -2" fill="none" ${st}/>
    <rect x="34" y="26" width="24" height="11" rx="5" fill="${C.coral}" ${s}/>
    <path d="M32 37 h28 v34 q0 9 -9 9 h-10 q-9 0 -9 -9 Z" fill="${C.white}" ${s}/>
    <circle cx="46" cy="58" r="9" fill="${C.sun}" ${st}/>
    ${smile(46, 58, 8)}
  `),

  hairbrush: svg(`
    <ellipse cx="50" cy="32" rx="17" ry="19" fill="${C.coral}" ${s}/>
    <ellipse cx="50" cy="32" rx="10" ry="12" fill="${C.white}" ${st}/>
    ${dot(46, 27, 2)} ${dot(54, 27, 2)} ${dot(44, 34, 2)} ${dot(50, 36, 2)} ${dot(56, 34, 2)}
    <rect x="44" y="50" width="12" height="36" rx="6" fill="${C.coral}" ${s}/>
    ${sparkle(78, 22, 5)}
  `),

  snack: svg(`
    <path d="M52 26 q0 -9 8 -12" fill="none" ${s}/>
    <ellipse cx="64" cy="18" rx="9" ry="5.5" fill="${C.mint}" ${st} transform="rotate(-24 64 18)"/>
    <circle cx="50" cy="56" r="26" fill="${C.coral}" ${s}/>
    <circle cx="41" cy="47" r="5" fill="${C.white}" opacity="0.7"/>
    ${dot(42, 56)} ${dot(58, 56)}
    ${smile(50, 63, 12)}
  `),

  milk: svg(`
    <path d="M32 36 L50 20 L68 36 Z" fill="${C.sky}" ${s}/>
    <path d="M32 36 H68 V84 H32 Z" fill="${C.white}" ${s}/>
    <path d="M32 52 q9 -5 18 0 q9 5 18 0" fill="none" stroke="${C.sky}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="50" cy="68" r="7" fill="${C.sky2}" ${st}/>
  `),

  'make-bed': svg(`
    <rect x="12" y="26" width="11" height="46" rx="5.5" fill="${C.wood}" ${s}/>
    <rect x="12" y="56" width="76" height="16" rx="7" fill="${C.white}" ${s}/>
    <path d="M34 50 h52 v14 q-26 8 -52 0 Z" fill="${C.coral}" ${s}/>
    <ellipse cx="27" cy="50" rx="11" ry="7" fill="${C.white}" ${s} transform="rotate(-12 27 50)"/>
    <path d="M18 72 V84 M82 72 V84" fill="none" ${s}/>
  `),

  laundry: svg(`
    <rect x="22" y="14" width="56" height="70" rx="11" fill="${C.white}" ${s}/>
    <path d="M22 30 h56" fill="none" ${st}/>
    ${dot(32, 22, 3)} ${dot(43, 22, 3)}
    <circle cx="50" cy="56" r="19" fill="${C.sky2}" ${s}/>
    <circle cx="50" cy="56" r="12" fill="${C.sky}" ${st}/>
    <path d="M41 56 q4.5 -4 9 0 q4.5 4 9 0" fill="none" stroke="${C.white}" stroke-width="3.5" stroke-linecap="round"/>
  `),

  'trash-out': svg(`
    <rect x="42" y="14" width="16" height="9" rx="4.5" fill="${C.mint}" ${s}/>
    <rect x="24" y="23" width="52" height="11" rx="5.5" fill="${C.check}" ${s}/>
    <path d="M30 34 L36 86 H64 L70 34 Z" fill="${C.mint}" ${s}/>
    <path d="M42 44 v30 M50 44 v30 M58 44 v30" fill="none" ${st}/>
  `),

  'screen-off': svg(`
    <rect x="22" y="14" width="56" height="72" rx="10" fill="${C.white}" ${s}/>
    <rect x="29" y="24" width="42" height="48" rx="5" fill="${C.night}" ${st}/>
    <path d="M55 34 A12 12 0 1 0 64 52 A9.5 9.5 0 0 1 55 34 Z" fill="${C.sun}" ${st}/>
    ${sparkle(38, 36, 3.5, C.white)}
    ${sparkle(42, 60, 2.8, C.white)}
    <circle cx="50" cy="79" r="3" fill="none" ${st}/>
  `),

  'quiet-time': svg(`
    <path d="M74 12 A20 20 0 1 0 88 38 A16 16 0 0 1 74 12 Z" fill="${C.sun}" ${st}/>
    <circle cx="44" cy="54" r="26" fill="${C.skin}" ${s}/>
    <path d="M30 50 q4 4 8 0 M50 50 q4 4 8 0" fill="none" ${st}/>
    <circle cx="44" cy="64" r="2.5" fill="${C.ink}"/>
    <rect x="40" y="60" width="8" height="24" rx="4" fill="${C.skin}" ${s}/>
  `),

  music: svg(`
    <path d="M38 26 L74 18 V56" fill="none" ${s}/>
    <path d="M38 26 V64" fill="none" ${s}/>
    <ellipse cx="31" cy="66" rx="8.5" ry="6.5" fill="${C.berry}" ${s}/>
    <ellipse cx="67" cy="58" rx="8.5" ry="6.5" fill="${C.berry}" ${s}/>
    ${sparkle(16, 24, 5)}
    ${sparkle(86, 74, 5)}
  `),

  hug: svg(`
    <path d="M50 84 Q16 58 21 36 Q25 20 41 25 Q50 28 50 38 Q50 28 59 25 Q75 20 79 36 Q84 58 50 84 Z" fill="${C.rose}" ${s}/>
    ${dot(41, 44)} ${dot(59, 44)}
    <circle cx="35" cy="50" r="3.5" fill="${C.coral}"/>
    <circle cx="65" cy="50" r="3.5" fill="${C.coral}"/>
    ${smile(50, 52, 12)}
    <path d="M14 22 q-5 -6 0 -10 q4 -3 5 1 q1 -4 5 -1 q4 4 -3 10 Z" fill="${C.coral}" ${st}/>
    <path d="M84 16 q-5 -6 0 -10 q4 -3 5 1 q1 -4 5 -1 q4 4 -3 10 Z" fill="${C.coral}" ${st}/>
  `),

  // Two cartoon puppies — an original drawing in this app's style, for the
  // "pick up your toy dog" step. Blue pup in front, orange pup behind.
  teddy: svg(`
    <path d="M63 40 L60 22 L74 31 Z" fill="${C.coral}" ${s}/>
    <path d="M92 40 L95 22 L81 31 Z" fill="${C.coral}" ${s}/>
    <circle cx="77" cy="53" r="20" fill="${C.coral}" ${s}/>
    <ellipse cx="77" cy="60" rx="11" ry="8" fill="${C.white}" ${st}/>
    ${dot(70, 48, 2.4)} ${dot(84, 48, 2.4)}
    <ellipse cx="77" cy="56" rx="3.4" ry="2.6" fill="${C.ink}"/>
    ${smile(77, 62, 8)}
    <path d="M14 44 L11 20 L29 32 Z" fill="${C.sky}" ${s}/>
    <path d="M52 44 L55 20 L37 32 Z" fill="${C.sky}" ${s}/>
    <circle cx="33" cy="58" r="25" fill="${C.sky}" ${s}/>
    <path d="M33 33 a25 25 0 0 0 -23 15 a25 25 0 0 0 8 25 Z" fill="${C.sky2}"/>
    <circle cx="33" cy="58" r="25" fill="none" ${s}/>
    <ellipse cx="33" cy="66" rx="13" ry="10" fill="${C.white}" ${st}/>
    ${dot(25, 53, 3)} ${dot(42, 53, 3)}
    <ellipse cx="33" cy="61" rx="4.2" ry="3.2" fill="${C.ink}"/>
    ${smile(33, 68, 10)}
  `),

  star: svg(`
    <path d="M50 8 L60 36 L90 38 L67 57 L75 88 L50 70 L25 88 L33 57 L10 38 L40 36 Z" fill="${C.sun}" ${s}/>
    ${dot(43, 46)} ${dot(57, 46)}
    ${smile(50, 52, 12)}
  `)
};

// Icon ids offered in the parent custom-item picker, bonus icons first.
export const BONUS_ICON_IDS = [
  'medicine', 'vitamins', 'water-plant', 'feed-pet', 'wash-hair', 'nap',
  'park', 'shoes', 'coat', 'backpack', 'homework', 'sunscreen',
  'hairbrush', 'snack', 'milk', 'make-bed', 'laundry', 'trash-out',
  'screen-off', 'quiet-time', 'music', 'hug', 'teddy', 'star'
];

export const PRESET_ICON_IDS = [
  'bath', 'pyjamas', 'brush-teeth', 'potty', 'book-song', 'sleep',
  'wake-up', 'wash-face', 'get-dressed', 'breakfast', 'wash-hands',
  'sit-table', 'eat-food', 'drink-water', 'clean-up', 'pick-up-toys',
  'books-shelf', 'clothes-basket'
];

export const ALL_ICON_IDS = [...BONUS_ICON_IDS, ...PRESET_ICON_IDS];

ICONS.puppies = ICONS.teddy;

export function iconSvg(id) {
  return ICONS[id] || ICONS.star;
}
