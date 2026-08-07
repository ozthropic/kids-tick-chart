// views/onboarding.js — first-run flow: name → pick a routine → publish → kid.

import { ROUTINES, ROUTINE_ORDER } from '../presets.js';
import { saveSettings, publish } from '../state.js';
import { iconSvg } from '../icons.js';
import { app } from '../bus.js';
import { esc } from '../util.js';

let step = 1;
let childName = '';

export function render() {
  step = 1;
  childName = '';
  renderStep();
}

function renderStep() {
  const root = document.getElementById('screen-onboarding');

  if (step === 1) {
    root.innerHTML = `
      <div class="onboard-wrap panel">
        <div class="onboard-mascot">${iconSvg('star')}</div>
        <h1 class="onboard-title">Hi there!</h1>
        <p class="onboard-sub">What&rsquo;s your kiddo&rsquo;s name?</p>
        <input type="text" id="onboard-name" class="text-input onboard-input" maxlength="20" placeholder="e.g. Nick" autocomplete="off">
        <button class="big-btn primary" id="onboard-next">Next</button>
        <p class="tab-hint">You can change this later in Parent Mode.</p>
      </div>`;
    const input = root.querySelector('#onboard-name');
    input.value = childName;
    const go = () => {
      childName = input.value.trim();
      step = 2;
      renderStep();
    };
    root.querySelector('#onboard-next').addEventListener('click', go);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  } else {
    root.innerHTML = `
      <div class="onboard-wrap panel">
        <h1 class="onboard-title">${childName ? esc(childName) + '&rsquo;s' : 'Your'} first chart</h1>
        <p class="onboard-sub">Pick a routine to start with:</p>
        <div class="onboard-tiles">
          ${ROUTINE_ORDER.map((id) => `
            <button class="onboard-tile" data-id="${id}">
              <span class="tile-icon">${iconSvg(ROUTINES[id].pickerIcon)}</span>
              <span class="tile-label">${ROUTINES[id].title}</span>
            </button>`).join('')}
        </div>
        <p class="tab-hint">Tip: in Safari use <strong>Share &rarr; Add to Home Screen</strong> so the app is
        full-screen, works offline, and stickers are saved for good.</p>
      </div>`;
    root.querySelectorAll('.onboard-tile').forEach((b) =>
      b.addEventListener('click', () => {
        saveSettings({ childName, onboarded: true });
        publish(b.dataset.id);
        app.show('kid');
      })
    );
  }
}
