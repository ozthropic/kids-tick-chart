// views/parent.js — Parent Mode: three tabs (Routines / Settings / History).
// Edits save to kta.routines immediately; the kid chart only changes on Publish.

import { ROUTINES, ROUTINE_ORDER } from '../presets.js';
import {
  getRoutineConfig, saveRoutineConfig, addCustomItem, removeCustomItem,
  publish, getActive, getSettings, saveSettings, getHistoryDays,
  exportData, importData, todayStr
} from '../state.js';
import { iconSvg, ALL_ICON_IDS } from '../icons.js';
import { setMuted } from '../audio.js';
import { app } from '../bus.js';
import { esc } from '../util.js';

let tab = 'routines';
let sel = 'bedtime';
let adding = false;
let pickedIcon = null;
let histDate = new Date();

export function render() {
  tab = 'routines';
  adding = false;
  pickedIcon = null;
  histDate = new Date();
  const active = getActive();
  sel = active ? active.routineId : 'bedtime';
  renderShell();
}

function renderShell() {
  const root = document.getElementById('screen-parent');
  root.innerHTML = `
    <div class="parent-wrap">
      <header class="parent-header">
        <h1 class="parent-title">Parent Mode</h1>
        <button class="close-btn" id="parent-close" aria-label="Close">&times;</button>
      </header>
      <nav class="tabs">
        <button class="tab ${tab === 'routines' ? 'sel' : ''}" data-tab="routines">Routines</button>
        <button class="tab ${tab === 'settings' ? 'sel' : ''}" data-tab="settings">Settings</button>
        <button class="tab ${tab === 'history' ? 'sel' : ''}" data-tab="history">History</button>
      </nav>
      <div class="tab-body" id="tab-body"></div>
    </div>`;

  root.querySelector('#parent-close').addEventListener('click', () => app.show('kid'));
  root.querySelectorAll('.tab').forEach((b) =>
    b.addEventListener('click', () => {
      tab = b.dataset.tab;
      renderShell();
    })
  );
  renderTab();
}

function renderTab() {
  const body = document.getElementById('tab-body');
  if (tab === 'routines') renderRoutines(body);
  else if (tab === 'settings') renderSettings(body);
  else renderHistory(body);
}

/* ───────────── Routines tab ───────────── */

function displayItem(routineId, it) {
  if (it.id.startsWith('c_')) {
    return { label: it.label || 'My Task', icon: it.icon || 'star', custom: true };
  }
  const p = ROUTINES[routineId].items.find((x) => x.id === it.id);
  return { label: p ? p.label : it.id, icon: p ? p.icon : 'star', custom: false };
}

function renderRoutines(body) {
  const items = getRoutineConfig(sel);
  const active = getActive();
  const onCount = items.filter((it) => it.on).length;

  body.innerHTML = `
    <div class="routine-picker">
      ${ROUTINE_ORDER.map((id) => `
        <button class="routine-chip ${sel === id ? 'sel' : ''}" data-id="${id}">
          <span class="chip-icon">${iconSvg(ROUTINES[id].pickerIcon)}</span>
          <span class="chip-label">${ROUTINES[id].title}</span>
          ${active && active.routineId === id ? '<span class="chip-live">on chart</span>' : ''}
        </button>`).join('')}
    </div>
    <p class="tab-hint">Turn steps on or off for today, reorder them, then publish.</p>
    <ul class="edit-list">
      ${items.map((it, i) => {
        const d = displayItem(sel, it);
        return `<li class="edit-row ${it.on ? '' : 'is-off'}" data-id="${esc(it.id)}">
          <span class="edit-icon">${iconSvg(d.icon)}</span>
          <span class="edit-label">${esc(d.label)}</span>
          <span class="edit-actions">
            <button class="mini-btn act-up" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Move up">&#9650;</button>
            <button class="mini-btn act-down" data-i="${i}" ${i === items.length - 1 ? 'disabled' : ''} aria-label="Move down">&#9660;</button>
            ${d.custom ? `<button class="mini-btn act-del" data-i="${i}" aria-label="Delete">&#10005;</button>` : ''}
            <button class="switch ${it.on ? 'on' : ''}" data-i="${i}" role="switch" aria-checked="${it.on}" aria-label="${esc(d.label)} on or off"><span class="knob"></span></button>
          </span>
        </li>`;
      }).join('')}
    </ul>
    ${adding ? `
      <div class="add-form">
        <input type="text" id="add-name" class="text-input" maxlength="24" placeholder="What is the step called?" autocomplete="off">
        <p class="tab-hint">Pick a picture:</p>
        <div class="icon-grid">
          ${ALL_ICON_IDS.map((id) => `
            <button class="icon-choice ${pickedIcon === id ? 'sel' : ''}" data-icon="${id}" aria-label="${id}">${iconSvg(id)}</button>`).join('')}
        </div>
        <div class="add-actions">
          <button class="big-btn" id="add-cancel">Cancel</button>
          <button class="big-btn primary" id="add-save">Add Step</button>
        </div>
      </div>` : `
      <button class="big-btn add-item-btn" id="add-item">+ Add Custom Step</button>`}
    <div class="publish-bar">
      <button class="big-btn primary publish-btn" id="publish-btn" ${onCount ? '' : 'disabled'}>
        Publish to Chart (${onCount} step${onCount === 1 ? '' : 's'})
      </button>
      <p class="publish-note" id="publish-note"></p>
    </div>`;

  body.querySelectorAll('.routine-chip').forEach((b) =>
    b.addEventListener('click', () => {
      sel = b.dataset.id;
      adding = false;
      renderTab();
    })
  );

  const mutate = (fn) => {
    const list = getRoutineConfig(sel);
    fn(list);
    saveRoutineConfig(sel, list);
    renderTab();
  };

  body.querySelectorAll('.act-up').forEach((b) =>
    b.addEventListener('click', () => {
      const i = +b.dataset.i;
      mutate((l) => l.splice(i - 1, 0, l.splice(i, 1)[0]));
    })
  );
  body.querySelectorAll('.act-down').forEach((b) =>
    b.addEventListener('click', () => {
      const i = +b.dataset.i;
      mutate((l) => l.splice(i + 1, 0, l.splice(i, 1)[0]));
    })
  );
  body.querySelectorAll('.act-del').forEach((b) =>
    b.addEventListener('click', () => {
      const i = +b.dataset.i;
      const list = getRoutineConfig(sel);
      removeCustomItem(sel, list[i].id);
      renderTab();
    })
  );
  body.querySelectorAll('.switch').forEach((b) =>
    b.addEventListener('click', () => {
      const i = +b.dataset.i;
      mutate((l) => { l[i].on = !l[i].on; });
    })
  );

  const addBtn = body.querySelector('#add-item');
  if (addBtn) addBtn.addEventListener('click', () => { adding = true; pickedIcon = null; renderTab(); });

  if (adding) {
    body.querySelectorAll('.icon-choice').forEach((b) =>
      b.addEventListener('click', () => {
        pickedIcon = b.dataset.icon;
        body.querySelectorAll('.icon-choice').forEach((x) => x.classList.toggle('sel', x === b));
      })
    );
    body.querySelector('#add-cancel').addEventListener('click', () => { adding = false; renderTab(); });
    body.querySelector('#add-save').addEventListener('click', () => {
      const name = body.querySelector('#add-name').value.trim();
      if (!name) { body.querySelector('#add-name').focus(); return; }
      addCustomItem(sel, name, pickedIcon || 'star');
      adding = false;
      renderTab();
    });
  }

  body.querySelector('#publish-btn').addEventListener('click', () => {
    if (publish(sel)) {
      app.show('kid');
    } else {
      body.querySelector('#publish-note').textContent = 'Turn on at least one step first!';
    }
  });
}

/* ───────────── Settings tab ───────────── */

function renderSettings(body) {
  const s = getSettings();
  body.innerHTML = `
    <div class="settings">
      <label class="field-label" for="child-name">Child&rsquo;s name</label>
      <div class="field-row">
        <input type="text" id="child-name" class="text-input" maxlength="20" value="${esc(s.childName)}" placeholder="e.g. Nick" autocomplete="off">
        <button class="big-btn" id="save-name">Save</button>
      </div>
      <p class="tab-hint" id="name-note"></p>

      <div class="field-row setting-toggle">
        <span class="field-label">Sounds</span>
        <button class="switch ${s.soundOn ? 'on' : ''}" id="sound-switch" role="switch" aria-checked="${s.soundOn}"><span class="knob"></span></button>
      </div>

      <div class="backup">
        <span class="field-label">Backup &amp; restore</span>
        <p class="tab-hint">Copy this code somewhere safe, or paste a code to restore stickers and settings.</p>
        <textarea id="backup-code" class="text-input backup-box" rows="3" spellcheck="false"></textarea>
        <div class="field-row">
          <button class="big-btn" id="backup-export">Create code</button>
          <button class="big-btn" id="backup-import">Restore</button>
        </div>
        <p class="tab-hint" id="backup-note"></p>
      </div>

      <p class="tab-hint install-tip">Tip: open this app in Safari and use <strong>Share &rarr; Add to Home Screen</strong>.
      It becomes a full-screen app, works offline, and stickers are saved for good.</p>
    </div>`;

  body.querySelector('#save-name').addEventListener('click', () => {
    saveSettings({ childName: body.querySelector('#child-name').value.trim() });
    body.querySelector('#name-note').textContent = 'Saved!';
    setTimeout(() => { const n = body.querySelector('#name-note'); if (n) n.textContent = ''; }, 1500);
  });

  body.querySelector('#sound-switch').addEventListener('click', () => {
    const on = !getSettings().soundOn;
    saveSettings({ soundOn: on });
    setMuted(!on);
    const sw = body.querySelector('#sound-switch');
    sw.classList.toggle('on', on);
    sw.setAttribute('aria-checked', String(on));
  });

  body.querySelector('#backup-export').addEventListener('click', () => {
    const box = body.querySelector('#backup-code');
    box.value = exportData();
    box.select();
    body.querySelector('#backup-note').textContent = 'Code created — copy it somewhere safe.';
  });

  body.querySelector('#backup-import').addEventListener('click', () => {
    const ok = importData(body.querySelector('#backup-code').value);
    body.querySelector('#backup-note').textContent = ok
      ? 'Restored! Reloading…'
      : 'That code does not look right.';
    if (ok) setTimeout(() => location.reload(), 800);
  });
}

/* ───────────── History tab ───────────── */

function renderHistory(body) {
  const days = getHistoryDays();
  const y = histDate.getFullYear();
  const m = histDate.getMonth();
  const first = new Date(y, m, 1);
  const startOffset = first.getDay(); // Sunday-first
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const monthName = first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = todayStr();

  let cells = '';
  for (let i = 0; i < startOffset; i++) cells += '<span class="cal-cell empty"></span>';
  for (let d = 1; d <= daysInMonth; d++) {
    const key = todayStr(new Date(y, m, d));
    const done = Array.isArray(days[key]) ? days[key].length : 0;
    cells += `<span class="cal-cell ${done ? 'has-star' : ''} ${key === today ? 'is-today' : ''}">
      <span class="cal-num">${d}</span>
      ${done ? `<svg viewBox="0 0 26 26" class="cal-star"><path d="M13 2.5 l2.9 6.6 7.2 0.6 -5.5 4.7 1.7 7 -6.3 -3.8 -6.3 3.8 1.7 -7 -5.5 -4.7 7.2 -0.6 Z"/></svg>` : ''}
      ${done > 1 ? `<span class="cal-count">&times;${done}</span>` : ''}
    </span>`;
  }

  const total = Object.values(days).reduce((n, arr) => n + (Array.isArray(arr) ? arr.length : 0), 0);

  body.innerHTML = `
    <div class="history">
      <div class="cal-nav">
        <button class="mini-btn" id="cal-prev" aria-label="Previous month">&#9664;</button>
        <span class="cal-month">${monthName}</span>
        <button class="mini-btn" id="cal-next" aria-label="Next month">&#9654;</button>
      </div>
      <div class="cal-week">
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
      </div>
      <div class="cal-grid">${cells}</div>
      <p class="tab-hint">A star means at least one routine was finished that day. ${total} routine${total === 1 ? '' : 's'} finished all-time.</p>
    </div>`;

  body.querySelector('#cal-prev').addEventListener('click', () => {
    histDate = new Date(y, m - 1, 1);
    renderTab();
  });
  body.querySelector('#cal-next').addEventListener('click', () => {
    histDate = new Date(y, m + 1, 1);
    renderTab();
  });
}
