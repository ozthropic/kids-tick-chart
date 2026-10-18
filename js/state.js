// state.js — the ONLY module that touches localStorage.
// Schema: every payload carries {schema:1}. All reads fall back safely on
// missing/corrupt data. Dates are LOCAL "YYYY-MM-DD" strings (never UTC ISO —
// a 7pm bedtime in UTC+ timezones would land on tomorrow's date).

import { ROUTINES } from './presets.js';
import { STICKER_IDS, SERIES, isKnownSticker } from './stickers.js';

const K = {
  settings: 'kta.settings',
  routines: 'kta.routines',
  active: 'kta.active',
  day: 'kta.day',
  stickers: 'kta.stickers',
  history: 'kta.history',
  migrations: 'kta.migrations'
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const val = JSON.parse(raw);
    return (val && typeof val === 'object') ? val : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ schema: 1, ...value }));
  } catch {
    // quota / private mode — app keeps working in memory for this session
  }
}

// ---------- day / rollover ----------

export function todayStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDay() {
  const day = load(K.day, null);
  if (!day || day.date !== todayStr()) {
    return { date: todayStr(), checks: {}, rewarded: [] };
  }
  if (!day.checks || typeof day.checks !== 'object') day.checks = {};
  if (!Array.isArray(day.rewarded)) day.rewarded = [];
  return day;
}

// Returns true when a stale day was reset (caller should re-render Kid Mode).
export function ensureToday() {
  const stored = load(K.day, null);
  if (stored && stored.date !== todayStr()) {
    save(K.day, { date: todayStr(), checks: {}, rewarded: [] });
    return true;
  }
  return false;
}

// ---------- settings ----------

export function getSettings() {
  const s = load(K.settings, {});
  return {
    childName: typeof s.childName === 'string' ? s.childName : '',
    soundOn: s.soundOn !== false,
    onboarded: s.onboarded === true
  };
}

export function saveSettings(patch) {
  save(K.settings, { ...getSettings(), ...patch });
}

// ---------- routine configuration (parent editing state) ----------

function isCustom(it) {
  return typeof it.id === 'string' && it.id.startsWith('c_');
}

// Returns ordered [{id, on, label?, icon?}] — custom items carry label/icon
// inline; preset items resolve from presets.js. Preset items unseen in storage
// (e.g. added in a future app version) are appended enabled.
export function getRoutineConfig(routineId) {
  const preset = ROUTINES[routineId];
  if (!preset) return [];
  const stored = load(K.routines, {});
  const cfg = stored[routineId];
  let items;
  if (!cfg || !Array.isArray(cfg.items)) {
    items = preset.items.map(it => ({ id: it.id, on: true }));
  } else {
    items = cfg.items.filter(it =>
      it && typeof it.id === 'string' &&
      (isCustom(it) || preset.items.some(p => p.id === it.id))
    ).map(it => ({ ...it, on: it.on !== false }));
    for (const p of preset.items) {
      if (!items.some(it => it.id === p.id)) items.push({ id: p.id, on: true });
    }
  }
  return items;
}

export function saveRoutineConfig(routineId, items) {
  const stored = load(K.routines, {});
  stored[routineId] = { items };
  save(K.routines, stored);
}

export function addCustomItem(routineId, label, icon) {
  const items = getRoutineConfig(routineId);
  const id = 'c_' + Date.now();
  items.push({ id, on: true, label: label.trim() || 'My Task', icon: icon || 'star' });
  saveRoutineConfig(routineId, items);
  return id;
}

export function removeCustomItem(routineId, itemId) {
  const items = getRoutineConfig(routineId).filter(it => it.id !== itemId);
  saveRoutineConfig(routineId, items);
}

function resolveItem(routineId, it) {
  if (isCustom(it)) {
    return { id: it.id, label: it.label || 'My Task', icon: it.icon || 'star' };
  }
  const p = ROUTINES[routineId].items.find(x => x.id === it.id);
  return p ? { id: p.id, label: p.label, icon: p.icon } : null;
}

// ---------- publish / active routine ----------

export function publish(routineId) {
  if (!ROUTINES[routineId]) return false;
  const items = getRoutineConfig(routineId)
    .filter(it => it.on)
    .map(it => resolveItem(routineId, it))
    .filter(Boolean);
  if (!items.length) return false;
  save(K.active, {
    routineId,
    title: ROUTINES[routineId].title,
    accent: ROUTINES[routineId].accent,
    publishedAt: Date.now(),
    items
  });
  return true;
}

export function getActive() {
  const a = load(K.active, null);
  return (a && Array.isArray(a.items) && a.items.length) ? a : null;
}

// ---------- checks ----------

function getChecks() {
  const a = getActive();
  if (!a) return [];
  const list = getDay().checks[a.routineId];
  return Array.isArray(list) ? list : [];
}

export function isChecked(itemId) {
  return getChecks().includes(itemId);
}

// Returns the new checked state of the item.
export function toggleCheck(itemId) {
  const a = getActive();
  if (!a) return false;
  const day = getDay();
  const list = Array.isArray(day.checks[a.routineId]) ? day.checks[a.routineId] : [];
  const i = list.indexOf(itemId);
  const nowChecked = i === -1;
  if (nowChecked) list.push(itemId);
  else list.splice(i, 1);
  day.checks[a.routineId] = list;
  save(K.day, day);
  return nowChecked;
}

export function checkedCount() {
  const a = getActive();
  if (!a) return 0;
  const checks = getChecks();
  return a.items.filter(it => checks.includes(it.id)).length;
}

export function isRoutineComplete() {
  const a = getActive();
  if (!a) return false;
  return checkedCount() === a.items.length;
}

export function isRewarded() {
  const a = getActive();
  if (!a) return false;
  return getDay().rewarded.includes(a.routineId);
}

// ---------- completion / reward / history ----------

// Marks today's active routine complete (idempotent) and picks a sticker,
// which waits as a scratch card until the child has scratched it off
// (claimPending). Returns the sticker id, or null if already rewarded today.
export function recordCompletion() {
  const a = getActive();
  if (!a) return null;
  const day = getDay();
  if (day.rewarded.includes(a.routineId)) return null;
  day.rewarded.push(a.routineId);
  save(K.day, day);

  const hist = load(K.history, { days: {} });
  if (!hist.days || typeof hist.days !== 'object') hist.days = {};
  const t = todayStr();
  const arr = Array.isArray(hist.days[t]) ? hist.days[t] : [];
  if (!arr.includes(a.routineId)) arr.push(a.routineId);
  hist.days[t] = arr;
  save(K.history, hist);

  return holdSticker(a.routineId);
}

// kta.stickers = { log: [{id, ts, routineId?}], pending: [{id, ts, routineId}] }
// `pending` are scratch cards not yet scratched off — normally one, but two
// routines finished before the first card was scratched queue up, so a
// sticker is never lost.
const isEntry = (e) => e && typeof e === 'object' && typeof e.id === 'string';

function loadStickers() {
  const s = load(K.stickers, {});
  const log = Array.isArray(s.log) ? s.log.filter(isEntry) : [];
  const pending = Array.isArray(s.pending) ? s.pending.filter(isEntry) : [];
  return { log, pending };
}

function saveStickers(st) {
  save(K.stickers, { log: st.log, pending: st.pending });
}

// Picks a sticker not yet owned or waiting, and parks it as a scratch card.
function holdSticker(routineId) {
  const st = loadStickers();
  const taken = new Set([...st.log, ...st.pending].map(s => s.id));
  const pool = STICKER_IDS.filter(id => !taken.has(id));
  const from = pool.length ? pool : STICKER_IDS;
  const pick = from[Math.floor(Math.random() * from.length)];
  st.pending.push({ id: pick, ts: Date.now(), routineId });
  saveStickers(st);
  return pick;
}

// The next scratch card waiting to be scratched, or null.
export function getPendingSticker() {
  return loadStickers().pending[0] || null;
}

// Scratch card finished: that sticker joins the album. Returns true when a
// sticker was actually added (false for a stale or test-only celebration).
export function claimPending(id) {
  const st = loadStickers();
  const i = st.pending.findIndex(p => p.id === id);
  if (i === -1) return false;
  const [card] = st.pending.splice(i, 1);
  st.log.push({ id: card.id, ts: Date.now(), routineId: card.routineId });
  saveStickers(st);
  return true;
}

export function getStickerLog() {
  return loadStickers().log;
}

// Removes every sticker of one series — album entries and a pending scratch
// card alike — and nothing from any other series. If one of them was today's
// reward, today's routine starts over (ticks cleared) so it can earn a fresh
// sticker: otherwise a parent's test run would cost the child the day's
// sticker. `before` limits it to stickers earned before that time (ms).
// Returns how many stickers were removed.
export function resetSeries(seriesId, { before = Infinity } = {}) {
  const series = SERIES.find(s => s.id === seriesId);
  if (!series) return 0;
  const ids = new Set(series.ids);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const st = loadStickers();
  const reopen = new Set();
  let unknownToday = false; // earned today by an older version (no routineId)
  const noteToday = (e) => {
    if (e.ts >= start.getTime()) {
      if (e.routineId) reopen.add(e.routineId);
      else unknownToday = true;
    }
  };
  let removed = 0;
  const strip = (list) => list.filter((e) => {
    if (!ids.has(e.id) || !(e.ts < before)) return true;
    removed++;
    noteToday(e);
    return false;
  });
  st.log = strip(st.log);
  st.pending = strip(st.pending);
  saveStickers(st);

  if (reopen.size || unknownToday) {
    const day = getDay();
    const again = day.rewarded.filter(r => unknownToday || reopen.has(r));
    day.rewarded = day.rewarded.filter(r => !again.includes(r));
    for (const r of again) delete day.checks[r];
    save(K.day, day);
  }
  return removed;
}

// ---------- one-off data fixes ----------

// Each runs once per device, the first time a version containing it starts.
const MIGRATIONS = [
  {
    // 18 Oct 2026: a parent opened one Series-2 sticker while trying the new
    // series out. Put it back so Nick can win it himself. Only stickers
    // earned before this fix shipped are touched; Series 1 never is.
    id: 'reset-s2-parent-test-2026-10-18',
    run: () => resetSeries('s2', { before: Date.parse('2026-10-18T01:27:00Z') })
  }
];

// For tools/qa.html: seeded test data is marked as already fixed.
export const MIGRATION_IDS = MIGRATIONS.map(m => m.id);

export function runMigrations() {
  const m = load(K.migrations, {});
  const done = Array.isArray(m.done) ? m.done.slice() : [];
  let changed = false;
  for (const mig of MIGRATIONS) {
    if (done.includes(mig.id)) continue;
    try { mig.run(); } catch { /* a failed fix must never block the app */ }
    done.push(mig.id);
    changed = true;
  }
  if (changed) save(K.migrations, { done });
}

// { stickerId: count } for owned stickers. Ids retired by an app update are
// dropped so the album's "X of N" can never exceed the current cast.
export function getOwnedStickers() {
  const counts = {};
  for (const s of getStickerLog()) {
    if (isKnownSticker(s.id)) counts[s.id] = (counts[s.id] || 0) + 1;
  }
  return counts;
}

// Ids of stickers earned today (for the "NEW" badge).
export function getTodaysStickers() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return getStickerLog().filter(s => s.ts >= start.getTime()).map(s => s.id);
}

export function getHistoryDays() {
  const h = load(K.history, { days: {} });
  return (h.days && typeof h.days === 'object') ? h.days : {};
}

// ---------- backup / restore ----------

export function exportData() {
  const dump = {};
  for (const key of Object.values(K)) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      JSON.parse(raw); // never let a corrupt local value ride along in a backup
      dump[key] = raw;
    } catch { /* skip */ }
  }
  return btoa(unescape(encodeURIComponent(JSON.stringify(dump))));
}

export function importData(code) {
  try {
    const dump = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    if (!dump || typeof dump !== 'object') return false;
    const entries = Object.entries(dump).filter(
      ([k, v]) => k.startsWith('kta.') && typeof v === 'string'
    );
    if (!entries.length) return false;
    // Validate the whole batch first — one corrupt entry must reject the code
    // without leaving half the keys overwritten.
    for (const [, v] of entries) JSON.parse(v);
    for (const [k, v] of entries) localStorage.setItem(k, v);
    return true;
  } catch {
    return false;
  }
}
