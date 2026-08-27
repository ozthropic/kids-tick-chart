// state.js — the ONLY module that touches localStorage.
// Schema: every payload carries {schema:1}. All reads fall back safely on
// missing/corrupt data. Dates are LOCAL "YYYY-MM-DD" strings (never UTC ISO —
// a 7pm bedtime in UTC+ timezones would land on tomorrow's date).

import { ROUTINES } from './presets.js';
import { STICKER_IDS, isKnownSticker } from './stickers.js';

const K = {
  settings: 'kta.settings',
  routines: 'kta.routines',
  active: 'kta.active',
  day: 'kta.day',
  stickers: 'kta.stickers',
  history: 'kta.history'
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

// Marks today's active routine complete (idempotent) and awards a sticker.
// Returns the sticker id, or null if already rewarded today.
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

  return awardSticker();
}

function awardSticker() {
  const log = getStickerLog();
  const owned = new Set(log.map(s => s.id));
  const pool = STICKER_IDS.filter(id => !owned.has(id));
  const from = pool.length ? pool : STICKER_IDS;
  const pick = from[Math.floor(Math.random() * from.length)];
  log.push({ id: pick, ts: Date.now() });
  save(K.stickers, { log });
  return pick;
}

export function getStickerLog() {
  const s = load(K.stickers, { log: [] });
  return Array.isArray(s.log) ? s.log.filter(e => e && typeof e.id === 'string') : [];
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
