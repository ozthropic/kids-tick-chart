// stickers.js — 55 collectible sticker characters.
//
// Every sticker is its own hand-drawn character: unique silhouette, colours and
// props. (An earlier version composed 10 animals x 5 themes, which made every
// row of the album the same animal five times over.)
//
// All art is original, drawn to the style guide in icons.js: 120x120 canvas,
// flat fills, 5-unit #3E3A5C outlines, everything rounded, dot eyes + smile arc.

const C = {
  ink: '#3E3A5C',
  white: '#FFFFFF',
  cream: '#FFF7E8',
  coral: '#FF8B7B',
  sun: '#FFD166',
  mint: '#7FD8BE',
  berry: '#C792EA',
  rose: '#F7A8C4',
  sky: '#8FB4E3',
  sky2: '#C3DAF2',
  check: '#4CC17E',
  night: '#55659E',
  wood: '#C89B6E',
  woodLt: '#E3BE93',
  tan: '#F2A65A',
  grey: '#B9BDD4',
  greyLt: '#DDE0EE',
  charcoal: '#4A4A63',
  pinkDeep: '#F080A8',
  teal: '#5BC0BE',
  lime: '#A8D46F'
};

const s = `stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
const st = `stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"`;

/* ── shared primitives ───────────────────────────────────────────────── */

const dot = (x, y, r = 3.2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.ink}"/>`;
const eyes = (lx, rx, y, r = 3.2) => dot(lx, y, r) + dot(rx, y, r);
const shutEyes = (lx, rx, y) =>
  `<path d="M${lx - 4} ${y} q4 4 8 0 M${rx - 4} ${y} q4 4 8 0" fill="none" ${st}/>`;
const smile = (x, y, w = 10) =>
  `<path d="M${x - w / 2} ${y} q${w / 2} ${w / 2} ${w} 0" fill="none" ${st}/>`;
const blush = (x, y, fill = C.rose) => `<circle cx="${x}" cy="${y}" r="4.2" fill="${fill}" opacity="0.9"/>`;
const nose = (x, y, rx = 4.4, ry = 3.4) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.ink}"/>`;
const muzzle = (x, y, rx, ry, fill = C.white) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${st}/>`;
const head = (fill, cx = 60, cy = 62, r = 30) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${s}/>`;
// Two-tone head: a darker cap over the top, then the outline re-drawn on top.
const cap = (fill, cy = 62, r = 30) =>
  `<path d="M${60 - r} ${cy} A${r} ${r} 0 0 1 ${60 + r} ${cy} Q75 ${cy - 10} 60 ${cy - 6} Q45 ${cy - 2} ${60 - r} ${cy} Z" fill="${fill}"/>` +
  `<circle cx="60" cy="${cy}" r="${r}" fill="none" ${s}/>`;
const perkyEars = (fill) =>
  `<path d="M28 44 L23 13 L47 30 Z" fill="${fill}" ${s}/><path d="M92 44 L97 13 L73 30 Z" fill="${fill}" ${s}/>`;
const floppyEars = (fill) =>
  `<ellipse cx="26" cy="58" rx="11" ry="22" fill="${fill}" ${s}/><ellipse cx="94" cy="58" rx="11" ry="22" fill="${fill}" ${s}/>`;
const roundEars = (fill, y = 34, r = 12) =>
  `<circle cx="34" cy="${y}" r="${r}" fill="${fill}" ${s}/><circle cx="86" cy="${y}" r="${r}" fill="${fill}" ${s}/>`;
const innerRoundEars = (fill, y = 34, r = 5.5) =>
  `<circle cx="34" cy="${y}" r="${r}" fill="${fill}"/><circle cx="86" cy="${y}" r="${r}" fill="${fill}"/>`;
const catEars = (fill, inner) =>
  `<path d="M32 46 L34 18 L56 34 Z" fill="${fill}" ${s}/><path d="M88 46 L86 18 L64 34 Z" fill="${fill}" ${s}/>` +
  `<path d="M38 38 L39 27 L48 34 Z" fill="${inner}"/><path d="M82 38 L81 27 L72 34 Z" fill="${inner}"/>`;
const whiskers = () =>
  `<path d="M20 62 h11 M21 71 h10 M100 62 h-11 M99 71 h-10" fill="none" ${st}/>`;
const spark = (x, y, r, fill = C.white) =>
  `<path d="M${x} ${y - r} L${x + r * 0.34} ${y - r * 0.34} L${x + r} ${y} L${x + r * 0.34} ${y + r * 0.34} L${x} ${y + r} L${x - r * 0.34} ${y + r * 0.34} L${x - r} ${y} L${x - r * 0.34} ${y - r * 0.34} Z" fill="${fill}" ${st}/>`;

/* ── the cast: 55 distinct characters ─────────────────────────────────── */

const CHARACTERS = [
  /* dogs */
  {
    id: 'blue-pup', name: 'Blue Pup', bg: C.sun,
    art: perkyEars(C.sky) + head(C.sky2) + cap(C.sky) +
      muzzle(60, 73, 15, 11) + eyes(51, 69, 57, 3.4) + nose(60, 67) + smile(60, 76, 11) +
      blush(33, 70) + blush(87, 70)
  },
  {
    id: 'orange-pup', name: 'Orange Pup', bg: C.sky2,
    art: perkyEars(C.tan) + head(C.tan) + cap(C.coral) +
      muzzle(60, 73, 14, 10) + eyes(51, 69, 58, 3.4) + nose(60, 68) + smile(60, 77, 10) +
      blush(33, 71, C.coral) + blush(87, 71, C.coral)
  },
  {
    id: 'spotty-dog', name: 'Spotty Dog', bg: C.mint,
    art: floppyEars(C.charcoal) + head(C.white) +
      `<circle cx="44" cy="46" r="7" fill="${C.charcoal}"/><circle cx="79" cy="72" r="6" fill="${C.charcoal}"/>` +
      `<circle cx="60" cy="62" r="30" fill="none" ${s}/>` +
      muzzle(60, 73, 13, 10, C.greyLt) + eyes(52, 70, 56, 3.2) + nose(60, 69) + smile(60, 77, 10)
  },
  {
    id: 'sausage-dog', name: 'Sausage Dog', bg: C.sun,
    art: `<ellipse cx="22" cy="62" rx="9" ry="24" fill="${C.wood}" ${s}/><ellipse cx="98" cy="62" rx="9" ry="24" fill="${C.wood}" ${s}/>` +
      `<ellipse cx="60" cy="64" rx="27" ry="30" fill="${C.woodLt}" ${s}/>` +
      muzzle(60, 78, 14, 11, C.cream) + eyes(51, 69, 58, 3.4) + nose(60, 74) + smile(60, 82, 10) +
      blush(37, 74, C.coral) + blush(83, 74, C.coral)
  },
  {
    id: 'fluffy-poodle', name: 'Fluffy Poodle', bg: C.berry,
    art: `<circle cx="30" cy="52" r="13" fill="${C.cream}" ${s}/><circle cx="90" cy="52" r="13" fill="${C.cream}" ${s}/>` +
      `<circle cx="42" cy="30" r="12" fill="${C.cream}" ${s}/><circle cx="60" cy="24" r="13" fill="${C.cream}" ${s}/><circle cx="78" cy="30" r="12" fill="${C.cream}" ${s}/>` +
      head(C.cream, 60, 66, 27) + muzzle(60, 76, 12, 9, C.white) +
      eyes(52, 68, 62, 3) + nose(60, 72, 4, 3) + smile(60, 80, 9)
  },
  {
    id: 'corgi', name: 'Corgi', bg: C.teal,
    art: `<path d="M26 46 L24 14 L48 30 Z" fill="${C.tan}" ${s}/><path d="M94 46 L96 14 L72 30 Z" fill="${C.tan}" ${s}/>` +
      `<path d="M32 40 L31 22 L44 32 Z" fill="${C.rose}"/><path d="M88 40 L89 22 L76 32 Z" fill="${C.rose}"/>` +
      head(C.tan) + `<path d="M60 32 v60" stroke="${C.white}" stroke-width="13" stroke-linecap="round"/>` +
      `<circle cx="60" cy="62" r="30" fill="none" ${s}/>` +
      muzzle(60, 74, 14, 10) + eyes(48, 72, 56, 3.2) + nose(60, 69) + smile(60, 78, 10)
  },

  /* pigs */
  {
    id: 'pink-piggy', name: 'Pink Piggy', bg: C.mint,
    art: `<path d="M34 40 L30 20 L50 30 Z" fill="${C.rose}" ${s}/><path d="M86 40 L90 20 L70 30 Z" fill="${C.rose}" ${s}/>` +
      head(C.rose) + `<ellipse cx="60" cy="70" rx="16" ry="12" fill="${C.pinkDeep}" ${st}/>` +
      `<ellipse cx="54" cy="70" rx="3" ry="4.4" fill="${C.ink}"/><ellipse cx="66" cy="70" rx="3" ry="4.4" fill="${C.ink}"/>` +
      eyes(50, 70, 54, 3.2) + blush(34, 66) + blush(86, 66) + smile(60, 84, 9)
  },
  {
    id: 'party-piglet', name: 'Party Piglet', bg: C.sky2,
    art: `<path d="M46 26 L60 4 L74 26 Z" fill="${C.berry}" ${s}/><circle cx="60" cy="6" r="5" fill="${C.sun}" ${st}/>` +
      `<path d="M34 46 L31 28 L49 36 Z" fill="${C.pinkDeep}" ${s}/><path d="M86 46 L89 28 L71 36 Z" fill="${C.pinkDeep}" ${s}/>` +
      head(C.pinkDeep, 60, 66, 28) + `<ellipse cx="60" cy="74" rx="14" ry="10" fill="${C.rose}" ${st}/>` +
      `<ellipse cx="55" cy="74" rx="2.6" ry="3.8" fill="${C.ink}"/><ellipse cx="65" cy="74" rx="2.6" ry="3.8" fill="${C.ink}"/>` +
      eyes(51, 69, 60, 3) + smile(60, 86, 8)
  },

  /* bunnies */
  {
    id: 'snow-bunny', name: 'Snow Bunny', bg: C.sky,
    art: `<ellipse cx="47" cy="26" rx="10" ry="24" fill="${C.white}" ${s}/><ellipse cx="73" cy="26" rx="10" ry="24" fill="${C.white}" ${s}/>` +
      `<ellipse cx="47" cy="28" rx="5" ry="15" fill="${C.rose}"/><ellipse cx="73" cy="28" rx="5" ry="15" fill="${C.rose}"/>` +
      head(C.white, 60, 68, 27) + eyes(51, 69, 64, 3.2) + blush(41, 74) + blush(79, 74) +
      `<path d="M56 71 h8 l-4 5 Z" fill="${C.rose}" ${st}/>` + smile(60, 80, 9)
  },
  {
    id: 'garden-bunny', name: 'Garden Bunny', bg: C.lime,
    art: `<ellipse cx="46" cy="28" rx="9" ry="22" fill="${C.greyLt}" ${s}/><ellipse cx="74" cy="24" rx="9" ry="22" fill="${C.greyLt}" ${s}/>` +
      `<circle cx="36" cy="34" r="4.5" fill="${C.white}" ${st}/><circle cx="30" cy="40" r="4.5" fill="${C.white}" ${st}/><circle cx="33" cy="30" r="3.4" fill="${C.sun}" ${st}/>` +
      head(C.greyLt, 60, 68, 27) + eyes(51, 69, 64, 3.2) + blush(41, 74) + blush(79, 74) +
      `<path d="M56 71 h8 l-4 5 Z" fill="${C.pinkDeep}" ${st}/>` + smile(60, 80, 9)
  },

  /* cats */
  {
    id: 'ginger-cat', name: 'Ginger Cat', bg: C.sky2,
    art: catEars(C.tan, C.rose) + head(C.tan) +
      `<path d="M46 40 v10 M60 36 v10 M74 40 v10" stroke="${C.coral}" stroke-width="4" stroke-linecap="round"/>` +
      eyes(50, 70, 60, 3.4) + whiskers() +
      `<path d="M56 68 h8 l-4 5 Z" fill="${C.rose}" ${st}/>` + smile(60, 77, 9)
  },
  {
    id: 'midnight-cat', name: 'Midnight Cat', bg: C.sun,
    art: catEars(C.charcoal, C.berry) + head(C.charcoal) +
      `<ellipse cx="50" cy="60" rx="5" ry="6" fill="${C.mint}"/><ellipse cx="70" cy="60" rx="5" ry="6" fill="${C.mint}"/>` +
      dot(50, 60, 2.4) + dot(70, 60, 2.4) + whiskers() +
      `<path d="M56 70 h8 l-4 5 Z" fill="${C.rose}" ${st}/>` +
      `<path d="M54 79 q6 5 12 0" fill="none" ${st}/>`
  },
  {
    id: 'calico-kitty', name: 'Calico Kitty', bg: C.teal,
    art: catEars(C.white, C.rose) + head(C.white) +
      `<path d="M60 32 A30 30 0 0 0 32 54 Q46 60 60 50 Z" fill="${C.tan}"/><circle cx="80" cy="76" r="9" fill="${C.charcoal}"/>` +
      `<circle cx="60" cy="62" r="30" fill="none" ${s}/>` +
      eyes(50, 70, 60, 3.4) + whiskers() +
      `<path d="M56 68 h8 l-4 5 Z" fill="${C.pinkDeep}" ${st}/>` + smile(60, 77, 9)
  },

  /* bears & friends */
  {
    id: 'brown-bear', name: 'Brown Bear', bg: C.sun,
    art: roundEars(C.wood) + innerRoundEars(C.rose) + head(C.wood) +
      muzzle(60, 72, 14, 10, C.cream) + eyes(50, 70, 58, 3.4) + nose(60, 68) + smile(60, 77, 10) +
      blush(34, 70, C.coral) + blush(86, 70, C.coral)
  },
  {
    id: 'panda', name: 'Panda', bg: C.mint,
    art: roundEars(C.charcoal) + head(C.white) +
      `<ellipse cx="47" cy="58" rx="10" ry="12" fill="${C.charcoal}" transform="rotate(-16 47 58)"/>` +
      `<ellipse cx="73" cy="58" rx="10" ry="12" fill="${C.charcoal}" transform="rotate(16 73 58)"/>` +
      `<circle cx="47" cy="59" r="4.4" fill="${C.white}"/><circle cx="73" cy="59" r="4.4" fill="${C.white}"/>` +
      dot(47, 59, 2.4) + dot(73, 59, 2.4) +
      nose(60, 72, 5, 3.6) + smile(60, 80, 10)
  },
  {
    id: 'polar-bear', name: 'Polar Bear', bg: C.sky,
    art: roundEars(C.white) + innerRoundEars(C.sky2) + head(C.white) +
      muzzle(60, 72, 14, 10, C.cream) + eyes(50, 70, 58, 3.4) + nose(60, 68) + smile(60, 77, 10) +
      spark(26, 34, 5, C.sky2) + spark(96, 40, 4, C.sky2)
  },
  {
    id: 'koala', name: 'Koala', bg: C.rose,
    art: `<circle cx="28" cy="46" r="15" fill="${C.grey}" ${s}/><circle cx="92" cy="46" r="15" fill="${C.grey}" ${s}/>` +
      `<circle cx="28" cy="46" r="7" fill="${C.greyLt}"/><circle cx="92" cy="46" r="7" fill="${C.greyLt}"/>` +
      head(C.grey, 60, 64, 28) + eyes(50, 70, 60, 3.4) +
      `<ellipse cx="60" cy="72" rx="7" ry="9" fill="${C.ink}"/>` + smile(60, 84, 8) +
      blush(38, 72) + blush(82, 72)
  },

  /* farm */
  {
    id: 'moo-cow', name: 'Moo Cow', bg: C.lime,
    art: `<path d="M26 40 q-8 -12 2 -16 q8 -2 8 8" fill="${C.cream}" ${s}/><path d="M94 40 q8 -12 -2 -16 q-8 -2 -8 8" fill="${C.cream}" ${s}/>` +
      `<ellipse cx="24" cy="56" rx="10" ry="8" fill="${C.rose}" ${s}/><ellipse cx="96" cy="56" rx="10" ry="8" fill="${C.rose}" ${s}/>` +
      head(C.white) + `<path d="M60 32 A30 30 0 0 0 34 47 Q44 56 58 47 Z" fill="${C.charcoal}"/>` +
      `<circle cx="60" cy="62" r="30" fill="none" ${s}/>` +
      eyes(50, 70, 58, 3.4) + `<ellipse cx="60" cy="76" rx="15" ry="11" fill="${C.rose}" ${st}/>` +
      `<circle cx="54" cy="75" r="2.6" fill="${C.ink}"/><circle cx="66" cy="75" r="2.6" fill="${C.ink}"/>`
  },
  {
    id: 'woolly-sheep', name: 'Woolly Sheep', bg: C.sky,
    art: `<circle cx="34" cy="38" r="13" fill="${C.cream}" ${s}/><circle cx="60" cy="28" r="15" fill="${C.cream}" ${s}/><circle cx="86" cy="38" r="13" fill="${C.cream}" ${s}/>` +
      `<circle cx="26" cy="58" r="12" fill="${C.cream}" ${s}/><circle cx="94" cy="58" r="12" fill="${C.cream}" ${s}/>` +
      `<ellipse cx="60" cy="68" rx="24" ry="24" fill="${C.greyLt}" ${s}/>` +
      `<ellipse cx="36" cy="62" rx="9" ry="6" fill="${C.grey}" ${s} transform="rotate(-24 36 62)"/>` +
      `<ellipse cx="84" cy="62" rx="9" ry="6" fill="${C.grey}" ${s} transform="rotate(24 84 62)"/>` +
      eyes(52, 68, 64, 3.2) + nose(60, 74, 4, 3) + smile(60, 82, 9)
  },
  {
    id: 'pony', name: 'Pony', bg: C.mint,
    art: `<path d="M36 40 L33 18 L50 32 Z" fill="${C.coral}" ${s}/><path d="M84 40 L87 18 L70 32 Z" fill="${C.coral}" ${s}/>` +
      `<path d="M34 30 q26 -18 52 0 q-8 12 -26 8 q-18 4 -26 -8 Z" fill="${C.berry}" ${s}/>` +
      `<ellipse cx="60" cy="66" rx="26" ry="29" fill="${C.coral}" ${s}/>` +
      `<ellipse cx="60" cy="80" rx="15" ry="11" fill="${C.cream}" ${st}/>` +
      `<circle cx="54" cy="79" r="2.6" fill="${C.ink}"/><circle cx="66" cy="79" r="2.6" fill="${C.ink}"/>` +
      eyes(50, 70, 60, 3.4) + blush(35, 72, C.rose) + blush(85, 72, C.rose)
  },
  {
    id: 'duckling', name: 'Duckling', bg: C.sky,
    art: `<path d="M60 34 q-2 -12 9 -14" fill="none" ${st}/><circle cx="72" cy="18" r="4.5" fill="${C.sun}" ${st}/>` +
      head(C.sun, 60, 64, 29) + eyes(50, 70, 58, 3.4) +
      `<ellipse cx="60" cy="74" rx="14" ry="8" fill="${C.tan}" ${s}/><ellipse cx="60" cy="81" rx="9" ry="4.5" fill="${C.tan}" ${st}/>` +
      blush(35, 70, C.coral) + blush(85, 70, C.coral)
  },
  {
    id: 'baby-chick', name: 'Baby Chick', bg: C.teal,
    art: `<path d="M31 46 q3 -22 29 -22 q26 0 29 22 l-11 -7 -8 8 -10 -8 -10 8 -8 -8 Z" fill="${C.cream}" ${s}/>` +
      head(C.sun, 60, 70, 27) + eyes(51, 69, 66, 3.2) +
      `<path d="M54 72 h12 l-6 8 Z" fill="${C.coral}" ${s}/>` +
      blush(38, 76, C.coral) + blush(82, 76, C.coral)
  },
  {
    id: 'rooster', name: 'Rooster', bg: C.sky2,
    art: `<path d="M42 34 q0 -13 10 -8 q2 -13 11 -6 q5 -11 13 0 q3 9 -3 15 Z" fill="${C.coral}" ${s}/>` +
      head(C.cream, 60, 66, 28) + eyes(50, 70, 62, 3.4) +
      `<path d="M53 70 h14 l-7 9 Z" fill="${C.sun}" ${s}/>` +
      `<ellipse cx="56" cy="85" rx="4.5" ry="6.5" fill="${C.coral}" ${st}/><ellipse cx="64" cy="85" rx="4.5" ry="6.5" fill="${C.coral}" ${st}/>` +
      blush(36, 74) + blush(84, 74)
  },
  {
    id: 'little-goat', name: 'Little Goat', bg: C.berry,
    art: `<path d="M40 30 q-8 -14 -2 -18 q8 0 8 14" fill="${C.woodLt}" ${s}/><path d="M80 30 q8 -14 2 -18 q-8 0 -8 14" fill="${C.woodLt}" ${s}/>` +
      `<ellipse cx="24" cy="56" rx="11" ry="7" fill="${C.cream}" ${s} transform="rotate(-18 24 56)"/>` +
      `<ellipse cx="96" cy="56" rx="11" ry="7" fill="${C.cream}" ${s} transform="rotate(18 96 56)"/>` +
      `<ellipse cx="60" cy="66" rx="25" ry="28" fill="${C.cream}" ${s}/>` +
      eyes(51, 69, 60, 3.2) + nose(60, 74, 4, 3) + smile(60, 82, 9) +
      `<path d="M56 88 q4 8 8 0" fill="${C.greyLt}" ${st}/>`
  },

  /* wild */
  {
    id: 'lion', name: 'Lion', bg: C.sky2,
    art: (() => {
      let mane = '';
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        mane += `<circle cx="${(60 + Math.cos(a) * 32).toFixed(1)}" cy="${(62 + Math.sin(a) * 32).toFixed(1)}" r="11" fill="${C.tan}" ${st}/>`;
      }
      return mane + head(C.sun, 60, 62, 26) +
        eyes(51, 69, 58, 3.2) + nose(60, 68, 5, 3.6) +
        `<path d="M60 71 v4 M52 80 q8 6 16 0" fill="none" ${st}/>` +
        blush(40, 68, C.coral) + blush(80, 68, C.coral);
    })()
  },
  {
    id: 'tiger', name: 'Tiger', bg: C.mint,
    art: roundEars(C.tan, 32, 11) + innerRoundEars(C.ink, 32, 5) + head(C.tan) +
      `<path d="M42 38 v9 M60 34 v9 M78 38 v9 M28 60 h9 M92 60 h-9" stroke="${C.ink}" stroke-width="4.5" stroke-linecap="round"/>` +
      muzzle(60, 74, 15, 10, C.cream) + eyes(50, 70, 60, 3.4) + nose(60, 70) +
      `<path d="M52 80 q8 6 16 0" fill="none" ${st}/>`
  },
  {
    id: 'elephant', name: 'Elephant', bg: C.sun,
    art: `<circle cx="24" cy="58" r="19" fill="${C.sky2}" ${s}/><circle cx="96" cy="58" r="19" fill="${C.sky2}" ${s}/>` +
      head(C.sky, 60, 58, 27) + eyes(50, 70, 52, 3.4) +
      `<path d="M51 64 q-3 20 4 28 q8 9 16 1 q5 -5 0 -9 q-5 4 -7 -2 q-4 -8 -1 -18 Z" fill="${C.sky}" ${s}/>` +
      blush(37, 62) + blush(83, 62)
  },
  {
    id: 'giraffe', name: 'Giraffe', bg: C.teal,
    art: `<path d="M44 32 L40 16 M76 32 L80 16" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>` +
      `<circle cx="40" cy="14" r="6" fill="${C.wood}" ${st}/><circle cx="80" cy="14" r="6" fill="${C.wood}" ${st}/>` +
      `<ellipse cx="24" cy="52" rx="12" ry="7" fill="${C.sun}" ${s} transform="rotate(-22 24 52)"/>` +
      `<ellipse cx="96" cy="52" rx="12" ry="7" fill="${C.sun}" ${s} transform="rotate(22 96 52)"/>` +
      `<ellipse cx="60" cy="66" rx="27" ry="29" fill="${C.sun}" ${s}/>` +
      `<circle cx="44" cy="50" r="5" fill="${C.wood}"/><circle cx="76" cy="52" r="4.4" fill="${C.wood}"/><circle cx="60" cy="42" r="3.6" fill="${C.wood}"/>` +
      eyes(50, 70, 62, 3.4) + `<ellipse cx="60" cy="80" rx="14" ry="10" fill="${C.woodLt}" ${st}/>` +
      `<circle cx="55" cy="79" r="2.4" fill="${C.ink}"/><circle cx="65" cy="79" r="2.4" fill="${C.ink}"/>`
  },
  {
    id: 'zebra', name: 'Zebra', bg: C.coral,
    art: `<path d="M36 40 L33 18 L50 32 Z" fill="${C.white}" ${s}/><path d="M84 40 L87 18 L70 32 Z" fill="${C.white}" ${s}/>` +
      `<ellipse cx="60" cy="64" rx="27" ry="30" fill="${C.white}" ${s}/>` +
      `<path d="M60 34 v14 M44 40 l6 10 M76 40 l-6 10 M34 58 h10 M86 58 h-10 M36 74 l9 -5 M84 74 l-9 -5" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>` +
      eyes(50, 70, 60, 3.4) + `<ellipse cx="60" cy="80" rx="14" ry="10" fill="${C.greyLt}" ${st}/>` +
      `<circle cx="55" cy="79" r="2.4" fill="${C.ink}"/><circle cx="65" cy="79" r="2.4" fill="${C.ink}"/>`
  },
  {
    id: 'monkey', name: 'Monkey', bg: C.lime,
    art: `<circle cx="24" cy="60" r="14" fill="${C.wood}" ${s}/><circle cx="96" cy="60" r="14" fill="${C.wood}" ${s}/>` +
      `<circle cx="24" cy="60" r="7" fill="${C.woodLt}"/><circle cx="96" cy="60" r="7" fill="${C.woodLt}"/>` +
      head(C.wood, 60, 62, 28) +
      `<ellipse cx="60" cy="70" rx="21" ry="19" fill="${C.woodLt}"/>` +
      `<circle cx="60" cy="62" r="28" fill="none" ${s}/>` +
      eyes(51, 69, 60, 3.4) + `<circle cx="56" cy="70" r="2.2" fill="${C.ink}"/><circle cx="64" cy="70" r="2.2" fill="${C.ink}"/>` +
      smile(60, 78, 12)
  },
  {
    id: 'hippo', name: 'Hippo', bg: C.sun,
    art: `<circle cx="34" cy="34" r="9" fill="${C.berry}" ${s}/><circle cx="86" cy="34" r="9" fill="${C.berry}" ${s}/>` +
      `<ellipse cx="60" cy="66" rx="30" ry="27" fill="${C.berry}" ${s}/>` +
      eyes(46, 74, 54, 3.4) +
      `<ellipse cx="60" cy="76" rx="22" ry="15" fill="${C.rose}" ${st}/>` +
      `<circle cx="52" cy="73" r="3" fill="${C.ink}"/><circle cx="68" cy="73" r="3" fill="${C.ink}"/>` +
      `<path d="M50 82 q10 7 20 0" fill="none" ${st}/>`
  },
  {
    id: 'rhino', name: 'Rhino', bg: C.rose,
    art: `<circle cx="32" cy="34" r="10" fill="${C.grey}" ${s}/><circle cx="88" cy="34" r="10" fill="${C.grey}" ${s}/>` +
      `<ellipse cx="60" cy="64" rx="29" ry="28" fill="${C.grey}" ${s}/>` +
      eyes(45, 75, 56, 3.4) +
      `<ellipse cx="60" cy="80" rx="20" ry="13" fill="${C.greyLt}" ${st}/>` +
      `<path d="M60 55 L66 79 L54 79 Z" fill="${C.cream}" ${s}/>` +
      `<circle cx="52" cy="85" r="2.6" fill="${C.ink}"/><circle cx="68" cy="85" r="2.6" fill="${C.ink}"/>`
  },

  /* forest */
  {
    id: 'fox', name: 'Fox', bg: C.sky2,
    art: `<path d="M30 48 L34 14 L58 34 Z" fill="${C.coral}" ${s}/><path d="M90 48 L86 14 L62 34 Z" fill="${C.coral}" ${s}/>` +
      `<path d="M37 40 L39 24 L50 34 Z" fill="${C.white}"/><path d="M83 40 L81 24 L70 34 Z" fill="${C.white}"/>` +
      head(C.coral, 60, 62, 29) +
      `<ellipse cx="60" cy="76" rx="18" ry="13" fill="${C.white}"/>` +
      `<circle cx="60" cy="62" r="29" fill="none" ${s}/>` +
      eyes(49, 71, 58, 3.4) + nose(60, 73) + smile(60, 80, 9) + blush(36, 68) + blush(84, 68)
  },
  {
    id: 'wolf', name: 'Wolf', bg: C.sun,
    art: `<path d="M30 46 L32 16 L56 34 Z" fill="${C.night}" ${s}/><path d="M90 46 L88 16 L64 34 Z" fill="${C.night}" ${s}/>` +
      `<path d="M38 38 L39 25 L49 33 Z" fill="${C.grey}"/><path d="M82 38 L81 25 L71 33 Z" fill="${C.grey}"/>` +
      head(C.night, 60, 64, 29) +
      `<path d="M60 48 q-19 9 -19 25 q0 15 19 19 q19 -4 19 -19 q0 -16 -19 -25 Z" fill="${C.greyLt}"/>` +
      `<circle cx="60" cy="64" r="29" fill="none" ${s}/>` +
      `<circle cx="46" cy="56" r="7.5" fill="${C.greyLt}"/><circle cx="74" cy="56" r="7.5" fill="${C.greyLt}"/>` +
      eyes(46, 74, 56, 3.6) + nose(60, 70, 5, 3.8) +
      `<path d="M60 74 v5" fill="none" ${st}/>` + smile(60, 81, 11)
  },
  {
    id: 'deer', name: 'Deer', bg: C.mint,
    art: `<path d="M45 45 L36 23 M36 23 L25 26 M36 23 L33 11 M75 45 L84 23 M84 23 L95 26 M84 23 L87 11" fill="none" stroke="${C.wood}" stroke-width="6" stroke-linecap="round"/>` +
      `<ellipse cx="26" cy="54" rx="11" ry="7" fill="${C.woodLt}" ${s} transform="rotate(-20 26 54)"/>` +
      `<ellipse cx="94" cy="54" rx="11" ry="7" fill="${C.woodLt}" ${s} transform="rotate(20 94 54)"/>` +
      head(C.woodLt, 60, 68, 27) +
      `<circle cx="44" cy="54" r="3.4" fill="${C.cream}"/><circle cx="76" cy="54" r="3.4" fill="${C.cream}"/><circle cx="60" cy="48" r="3" fill="${C.cream}"/>` +
      eyes(51, 69, 64, 3.2) + nose(60, 76, 5, 4) + smile(60, 84, 9)
  },
  {
    id: 'hedgehog', name: 'Hedgehog', bg: C.sky,
    art: (() => {
      let spikes = '';
      for (let i = 0; i <= 11; i++) {
        const a = Math.PI + (i / 11) * Math.PI;
        const px = 60 + Math.cos(a - 0.17) * 33, py = 70 + Math.sin(a - 0.17) * 33;
        const tx = 60 + Math.cos(a) * 47, ty = 70 + Math.sin(a) * 47;
        const nx = 60 + Math.cos(a + 0.17) * 33, ny = 70 + Math.sin(a + 0.17) * 33;
        spikes += `<path d="M${px.toFixed(1)} ${py.toFixed(1)} L${tx.toFixed(1)} ${ty.toFixed(1)} L${nx.toFixed(1)} ${ny.toFixed(1)} Z" fill="${C.wood}" ${st}/>`;
      }
      return spikes + `<ellipse cx="60" cy="72" rx="33" ry="29" fill="${C.woodLt}" ${s}/>` +
        `<ellipse cx="60" cy="80" rx="20" ry="18" fill="${C.cream}"/>` +
        eyes(51, 69, 72, 3.4) + nose(60, 84, 5, 3.8) +
        blush(36, 80, C.rose) + blush(84, 80, C.rose);
    })()
  },
  {
    id: 'squirrel', name: 'Squirrel', bg: C.teal,
    art: `<path d="M84 92 q22 -5 24 -28 q2 -22 -16 -27" fill="none" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/>` +
      `<path d="M84 92 q22 -5 24 -28 q2 -22 -16 -27" fill="none" stroke="${C.coral}" stroke-width="22" stroke-linecap="round"/>` +
      `<path d="M32 44 L29 21 L47 35 Z" fill="${C.coral}" ${s}/><path d="M72 44 L75 21 L57 35 Z" fill="${C.coral}" ${s}/>` +
      `<ellipse cx="52" cy="68" rx="27" ry="28" fill="${C.coral}" ${s}/>` +
      `<ellipse cx="52" cy="78" rx="16" ry="12" fill="${C.cream}" ${st}/>` +
      eyes(43, 61, 64, 3.4) + nose(52, 75, 4.4, 3.2) +
      `<path d="M52 78 v4" fill="none" ${st}/>` + blush(30, 74, C.rose)
  },
  {
    id: 'raccoon', name: 'Raccoon', bg: C.lime,
    art: `<path d="M32 44 L30 18 L52 32 Z" fill="${C.grey}" ${s}/><path d="M88 44 L90 18 L68 32 Z" fill="${C.grey}" ${s}/>` +
      head(C.grey, 60, 64, 29) +
      `<path d="M32 58 q14 -12 28 0 q14 -12 28 0 q-6 16 -20 12 q-8 4 -8 4 q0 0 -8 -4 q-14 4 -20 -12 Z" fill="${C.charcoal}"/>` +
      `<circle cx="60" cy="64" r="29" fill="none" ${s}/>` +
      `<circle cx="48" cy="60" r="6" fill="${C.white}"/><circle cx="72" cy="60" r="6" fill="${C.white}"/>` +
      dot(48, 60, 3) + dot(72, 60, 3) +
      `<ellipse cx="60" cy="78" rx="11" ry="8" fill="${C.cream}" ${st}/>` + nose(60, 76, 4, 3)
  },
  {
    id: 'owl', name: 'Owl', bg: C.sun,
    art: `<path d="M36 34 L30 14 L50 26 Z" fill="${C.berry}" ${s}/><path d="M84 34 L90 14 L70 26 Z" fill="${C.berry}" ${s}/>` +
      head(C.berry, 60, 64, 30) +
      `<circle cx="47" cy="58" r="13" fill="${C.white}" ${st}/><circle cx="73" cy="58" r="13" fill="${C.white}" ${st}/>` +
      dot(47, 58, 5) + dot(73, 58, 5) +
      `<path d="M54 70 h12 l-6 9 Z" fill="${C.sun}" ${s}/>` +
      `<path d="M46 86 q5 -6 10 0 M64 86 q5 -6 10 0" fill="none" stroke="${C.white}" stroke-width="3.5" stroke-linecap="round"/>`
  },
  {
    id: 'beaver', name: 'Beaver', bg: C.sky2,
    art: `<circle cx="30" cy="40" r="9" fill="${C.wood}" ${s}/><circle cx="90" cy="40" r="9" fill="${C.wood}" ${s}/>` +
      `<ellipse cx="60" cy="64" rx="28" ry="28" fill="${C.wood}" ${s}/>` +
      eyes(50, 70, 56, 3.4) + `<ellipse cx="60" cy="70" rx="12" ry="9" fill="${C.woodLt}" ${st}/>` +
      nose(60, 68, 4.4, 3.2) +
      `<rect x="52" y="76" width="16" height="14" rx="3" fill="${C.white}" ${st}/><path d="M60 76 v14" stroke="${C.ink}" stroke-width="2.5"/>`
  },

  /* water */
  {
    id: 'penguin', name: 'Penguin', bg: C.sky,
    art: `<ellipse cx="60" cy="64" rx="29" ry="31" fill="${C.night}" ${s}/>` +
      `<ellipse cx="60" cy="72" rx="19" ry="22" fill="${C.white}"/>` +
      `<ellipse cx="60" cy="64" rx="29" ry="31" fill="none" ${s}/>` +
      eyes(51, 69, 58, 3.4) + `<path d="M53 68 h14 l-7 8 Z" fill="${C.tan}" ${s}/>` +
      blush(42, 70, C.rose) + blush(78, 70, C.rose)
  },
  {
    id: 'whale', name: 'Whale', bg: C.sun,
    art: `<path d="M53 24 q4 -11 8 -3 M69 24 q-5 -11 -9 -3" fill="none" stroke="${C.sky2}" stroke-width="6" stroke-linecap="round"/>` +
      `<circle cx="61" cy="17" r="6" fill="${C.sky2}" ${st}/>` +
      `<path d="M88 62 q13 -17 20 -8 q-5 7 -6 12 q3 6 5 12 q-8 8 -19 -8 Z" fill="${C.sky}" ${s}/>` +
      `<ellipse cx="55" cy="68" rx="34" ry="25" fill="${C.sky}" ${s}/>` +
      `<path d="M23 73 q32 15 64 0 q-6 18 -32 18 q-26 0 -32 -18 Z" fill="${C.sky2}"/>` +
      `<ellipse cx="55" cy="68" rx="34" ry="25" fill="none" ${s}/>` +
      eyes(43, 67, 62, 3.4) + smile(55, 74, 14) + blush(31, 70, C.rose)
  },
  {
    id: 'octopus', name: 'Octopus', bg: C.mint,
    art: (() => {
      let legs = '';
      for (let i = 0; i < 5; i++) {
        const x = 26 + i * 17;
        legs += `<path d="M${x} 74 q-5 14 2 22 q7 6 12 -4" fill="none" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/>` +
          `<path d="M${x} 74 q-5 14 2 22 q7 6 12 -4" fill="none" stroke="${C.berry}" stroke-width="7" stroke-linecap="round"/>`;
      }
      return legs + `<ellipse cx="60" cy="56" rx="30" ry="27" fill="${C.berry}" ${s}/>` +
        eyes(50, 70, 52, 3.6) + smile(60, 62, 12) + blush(37, 60, C.rose) + blush(83, 60, C.rose);
    })()
  },
  {
    id: 'turtle', name: 'Turtle', bg: C.sky2,
    art: `<ellipse cx="24" cy="76" rx="11" ry="7" fill="${C.lime}" ${s}/><ellipse cx="96" cy="76" rx="11" ry="7" fill="${C.lime}" ${s}/>` +
      `<ellipse cx="60" cy="56" rx="33" ry="26" fill="${C.check}" ${s}/>` +
      `<path d="M60 30 v52 M27 56 h66 M38 38 l44 36 M82 38 l-44 36" stroke="${C.mint}" stroke-width="4"/>` +
      `<ellipse cx="60" cy="56" rx="33" ry="26" fill="none" ${s}/>` +
      `<circle cx="60" cy="90" r="17" fill="${C.lime}" ${s}/>` +
      eyes(53, 67, 87, 3.2) + smile(60, 94, 10)
  },
  {
    id: 'crab', name: 'Crab', bg: C.sky,
    art: `<path d="M24 46 q-11 8 -5 19 q9 8 15 -2 q-8 -7 -10 -17 Z" fill="${C.coral}" ${s}/>` +
      `<path d="M96 46 q11 8 5 19 q-9 8 -15 -2 q8 -7 10 -17 Z" fill="${C.coral}" ${s}/>` +
      `<ellipse cx="60" cy="66" rx="30" ry="23" fill="${C.coral}" ${s}/>` +
      `<path d="M47 44 v-11 M73 44 v-11" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>` +
      `<circle cx="47" cy="28" r="8" fill="${C.white}" ${st}/><circle cx="73" cy="28" r="8" fill="${C.white}" ${st}/>` +
      dot(47, 28, 3.4) + dot(73, 28, 3.4) + smile(60, 66, 14) +
      `<path d="M42 86 v6 M60 89 v5 M78 86 v6" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`
  },
  {
    id: 'seal', name: 'Seal', bg: C.berry,
    art: `<ellipse cx="60" cy="64" rx="27" ry="30" fill="${C.grey}" ${s}/>` +
      `<ellipse cx="60" cy="74" rx="17" ry="18" fill="${C.greyLt}"/>` +
      `<ellipse cx="60" cy="64" rx="27" ry="30" fill="none" ${s}/>` +
      eyes(50, 70, 58, 3.6) + nose(60, 72, 5, 3.6) +
      `<path d="M54 80 q6 6 12 0" fill="none" ${st}/>` + whiskers() +
      `<ellipse cx="24" cy="88" rx="11" ry="7" fill="${C.grey}" ${s} transform="rotate(-18 24 88)"/>` +
      `<ellipse cx="96" cy="88" rx="11" ry="7" fill="${C.grey}" ${s} transform="rotate(18 96 88)"/>`
  },
  {
    id: 'frog', name: 'Frog', bg: C.rose,
    art: `<circle cx="40" cy="34" r="14" fill="${C.check}" ${s}/><circle cx="80" cy="34" r="14" fill="${C.check}" ${s}/>` +
      `<circle cx="40" cy="34" r="7" fill="${C.white}"/><circle cx="80" cy="34" r="7" fill="${C.white}"/>` +
      dot(40, 34, 3.4) + dot(80, 34, 3.4) +
      `<ellipse cx="60" cy="70" rx="32" ry="24" fill="${C.check}" ${s}/>` +
      `<ellipse cx="60" cy="78" rx="18" ry="12" fill="${C.lime}"/>` +
      `<path d="M42 70 q18 14 36 0" fill="none" ${st}/>` +
      dot(52, 62, 2.4) + dot(68, 62, 2.4) + blush(34, 74, C.coral) + blush(86, 74, C.coral)
  },

  /* garden & pond */
  {
    id: 'butterfly', name: 'Butterfly', bg: C.mint,
    art: `<path d="M57 62 q-25 -33 -37 -17 q-10 14 8 25 q14 9 29 -8 Z" fill="${C.berry}" ${s}/>` +
      `<path d="M63 62 q25 -33 37 -17 q10 14 -8 25 q-14 9 -29 -8 Z" fill="${C.berry}" ${s}/>` +
      `<path d="M56 68 q-27 15 -21 33 q16 11 25 -15 Z" fill="${C.rose}" ${s}/>` +
      `<path d="M64 68 q27 15 21 33 q-16 11 -25 -15 Z" fill="${C.rose}" ${s}/>` +
      `<circle cx="35" cy="52" r="6" fill="${C.sun}"/><circle cx="85" cy="52" r="6" fill="${C.sun}"/>` +
      `<circle cx="45" cy="88" r="4.5" fill="${C.sun}"/><circle cx="75" cy="88" r="4.5" fill="${C.sun}"/>` +
      `<path d="M54 40 q-6 -12 -13 -16 M66 40 q6 -12 13 -16" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>` +
      `<circle cx="40" cy="22" r="4.5" fill="${C.sun}" ${st}/><circle cx="80" cy="22" r="4.5" fill="${C.sun}" ${st}/>` +
      `<ellipse cx="60" cy="76" rx="9" ry="17" fill="${C.sun}" ${s}/>` +
      `<circle cx="60" cy="52" r="13" fill="${C.sun}" ${s}/>` +
      eyes(56, 64, 50, 2.8) + smile(60, 56, 8)
  },
  {
    id: 'ladybug', name: 'Ladybug', bg: C.sky2,
    art: `<path d="M30 78 l-12 7 M30 64 l-13 -1 M90 78 l12 7 M90 64 l13 -1" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M52 28 q-5 -11 -12 -13 M68 28 q5 -11 12 -13" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>` +
      `<circle cx="38" cy="16" r="4.5" fill="${C.sun}" ${st}/><circle cx="82" cy="16" r="4.5" fill="${C.sun}" ${st}/>` +
      `<circle cx="60" cy="40" r="16" fill="${C.charcoal}" ${s}/>` +
      `<circle cx="53" cy="38" r="5" fill="${C.white}"/><circle cx="67" cy="38" r="5" fill="${C.white}"/>` +
      dot(53, 38, 2.6) + dot(67, 38, 2.6) +
      `<path d="M55 47 q5 4 10 0" fill="none" stroke="${C.white}" stroke-width="3" stroke-linecap="round"/>` +
      `<ellipse cx="60" cy="76" rx="34" ry="30" fill="${C.coral}" ${s}/>` +
      `<path d="M60 46 v60" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>` +
      `<circle cx="42" cy="66" r="7" fill="${C.charcoal}"/><circle cx="78" cy="66" r="7" fill="${C.charcoal}"/>` +
      `<circle cx="48" cy="90" r="5.5" fill="${C.charcoal}"/><circle cx="72" cy="90" r="5.5" fill="${C.charcoal}"/>`
  },
  {
    id: 'flamingo', name: 'Flamingo', bg: C.teal,
    art: `<path d="M44 100 v12 M58 100 v12" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>` +
      `<ellipse cx="50" cy="82" rx="29" ry="23" fill="${C.rose}" ${s}/>` +
      `<path d="M62 76 q15 -17 5 -29 q-11 -13 7 -19" fill="none" stroke="${C.ink}" stroke-width="17" stroke-linecap="round"/>` +
      `<path d="M62 76 q15 -17 5 -29 q-11 -13 7 -19" fill="none" stroke="${C.rose}" stroke-width="10" stroke-linecap="round"/>` +
      `<path d="M34 82 q16 -11 31 2 q-15 11 -31 -2 Z" fill="${C.pinkDeep}" ${st}/>` +
      `<circle cx="78" cy="27" r="13" fill="${C.rose}" ${s}/>` +
      `<path d="M89 26 l15 7 -15 8 Z" fill="${C.sun}" ${s}/>` +
      `<path d="M97 30 l7 3 -7 4 Z" fill="${C.ink}"/>` +
      dot(78, 23, 3) + blush(70, 32)
  },

  /* fantasy */
  {
    id: 'dino', name: 'Dino', bg: C.sun,
    art: `<path d="M34 38 L40 16 L52 34 Z" fill="${C.lime}" ${s}/><path d="M56 32 L64 12 L74 32 Z" fill="${C.lime}" ${s}/><path d="M78 38 L88 20 L92 40 Z" fill="${C.lime}" ${s}/>` +
      `<ellipse cx="60" cy="68" rx="29" ry="27" fill="${C.check}" ${s}/>` +
      `<ellipse cx="60" cy="76" rx="17" ry="13" fill="${C.lime}"/>` +
      `<ellipse cx="60" cy="68" rx="29" ry="27" fill="none" ${s}/>` +
      eyes(50, 70, 62, 3.4) + dot(55, 74, 2.4) + dot(65, 74, 2.4) + smile(60, 80, 12) +
      blush(36, 74, C.coral) + blush(84, 74, C.coral)
  },
  {
    id: 'unicorn', name: 'Unicorn', bg: C.sky2,
    art: `<path d="M60 38 L52 13 L70 18 Z" fill="${C.sun}" ${s}/>` +
      `<path d="M56 24 l10 3 M58 31 l9 3" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M36 42 L33 20 L50 34 Z" fill="${C.white}" ${s}/><path d="M84 42 L87 20 L70 34 Z" fill="${C.white}" ${s}/>` +
      `<path d="M30 40 q13 -8 24 0 q-5 11 -14 10 q-9 -1 -10 -10 Z" fill="${C.rose}" ${st}/>` +
      `<path d="M90 40 q-13 -8 -24 0 q5 11 14 10 q9 -1 10 -10 Z" fill="${C.berry}" ${st}/>` +
      `<ellipse cx="60" cy="70" rx="26" ry="27" fill="${C.white}" ${s}/>` +
      `<ellipse cx="60" cy="82" rx="14" ry="10" fill="${C.rose}" ${st}/>` +
      `<circle cx="55" cy="81" r="2.4" fill="${C.ink}"/><circle cx="65" cy="81" r="2.4" fill="${C.ink}"/>` +
      eyes(50, 70, 64, 3.4) + blush(37, 76) + blush(83, 76)
  },
  {
    id: 'dragon', name: 'Dragon', bg: C.sun,
    art: `<path d="M32 46 q-17 -13 -14 -27 q17 4 27 19 Z" fill="${C.berry}" ${s}/>` +
      `<path d="M88 46 q17 -13 14 -27 q-17 4 -27 19 Z" fill="${C.berry}" ${s}/>` +
      `<path d="M44 32 L40 13 L54 26 Z" fill="${C.cream}" ${s}/><path d="M76 32 L80 13 L66 26 Z" fill="${C.cream}" ${s}/>` +
      `<ellipse cx="60" cy="66" rx="29" ry="28" fill="${C.check}" ${s}/>` +
      `<ellipse cx="60" cy="77" rx="17" ry="13" fill="${C.lime}" ${st}/>` +
      eyes(49, 71, 60, 3.6) + dot(54, 75, 2.4) + dot(66, 75, 2.4) +
      `<path d="M52 84 q8 6 16 0" fill="none" ${st}/>`
  },
  {
    id: 'star-friend', name: 'Star Friend', bg: C.berry,
    art: `<path d="M60 16 L72 48 L106 51 L80 72 L88 106 L60 86 L32 106 L40 72 L14 51 L48 48 Z" fill="${C.sun}" ${s}/>` +
      eyes(50, 70, 58, 3.6) + smile(60, 66, 12) + blush(40, 64, C.coral) + blush(80, 64, C.coral)
  },
  {
    id: 'rainbow-friend', name: 'Rainbow Friend', bg: C.sky,
    art: `<path d="M18 82 A42 42 0 0 1 102 82" fill="none" stroke="${C.coral}" stroke-width="9" stroke-linecap="round"/>` +
      `<path d="M28 82 A32 32 0 0 1 92 82" fill="none" stroke="${C.sun}" stroke-width="9" stroke-linecap="round"/>` +
      `<path d="M38 82 A22 22 0 0 1 82 82" fill="none" stroke="${C.mint}" stroke-width="9" stroke-linecap="round"/>` +
      `<path d="M48 82 A12 12 0 0 1 72 82" fill="none" stroke="${C.berry}" stroke-width="9" stroke-linecap="round"/>` +
      `<circle cx="26" cy="90" r="13" fill="${C.white}" ${st}/><circle cx="94" cy="90" r="13" fill="${C.white}" ${st}/>` +
      eyes(53, 67, 56, 3.4) + smile(60, 62, 11)
  }
];

/* ── public API ───────────────────────────────────────────────────────── */

const BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));

export const STICKER_IDS = CHARACTERS.map((c) => c.id);

export function stickerSvg(id) {
  const c = BY_ID.get(id);
  if (!c) {
    // A sticker earned on an older version — show a friendly mystery badge
    // rather than a blank square.
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="58" fill="${C.white}"/>
      <circle cx="60" cy="60" r="58" fill="none" stroke="${C.ink}" stroke-width="3"/>
      <circle cx="60" cy="60" r="52" fill="${C.greyLt}"/>
      ${spark(60, 60, 26, C.sun)}
    </svg>`;
  }
  // The badge parts carry a class so the album can strip them for unearned
  // stickers, leaving the character's silhouette as a tease.
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle class="badge-rim" cx="60" cy="60" r="58" fill="${C.white}"/>
    <circle class="badge-rim" cx="60" cy="60" r="58" fill="none" stroke="${C.ink}" stroke-width="3"/>
    <clipPath id="kta-badge-clip"><circle cx="60" cy="60" r="52"/></clipPath>
    <circle class="badge-bg" cx="60" cy="60" r="52" fill="${c.bg}"/>
    <g clip-path="url(#kta-badge-clip)">
      <path class="badge-bg" d="M23 47 A38 38 0 0 1 58 15" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="8" stroke-linecap="round"/>
      ${c.art}
    </g>
  </svg>`;
}

export function stickerName(id) {
  const c = BY_ID.get(id);
  return c ? c.name : 'Mystery Sticker';
}

export function isKnownSticker(id) {
  return BY_ID.has(id);
}
