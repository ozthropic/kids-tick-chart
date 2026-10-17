// quiz.js — the grown-up check behind the parent gate.
//
// The 3-second hold alone stopped working once the child learned it, so the
// gate now also asks for a sum that a 2–5-year-old cannot do. The dialog is
// deliberately plain and grey: nothing here should look like a toy.

const WRONG_LIMIT = 3;
const MAX_DIGITS = 3;

let overlay = null;

function question() {
  const a = 12 + Math.floor(Math.random() * 28); // 12–39
  const b = 6 + Math.floor(Math.random() * 23);  // 6–28
  return { text: `${a} + ${b}`, answer: a + b };
}

export function closeQuiz() {
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
}

// Shows the challenge; calls onPass() only after a correct answer.
export function askGrownUp(onPass) {
  closeQuiz();
  let q = question();
  let typed = '';
  let wrong = 0;

  overlay = document.createElement('div');
  overlay.className = 'quiz-overlay';
  overlay.innerHTML = `
    <div class="quiz-card" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
      <p class="quiz-title" id="quiz-title">Grown-ups only</p>
      <p class="quiz-sub">Solve this to open Parent Mode.</p>
      <p class="quiz-q"><span id="quiz-q"></span> = <span class="quiz-typed" id="quiz-typed">&nbsp;</span></p>
      <div class="quiz-pad" id="quiz-pad">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button class="quiz-key" data-k="${n}">${n}</button>`).join('')}
        <button class="quiz-key quiz-key-aux" data-k="back" aria-label="Delete">&#9003;</button>
        <button class="quiz-key" data-k="0">0</button>
        <button class="quiz-key quiz-key-ok" data-k="ok">OK</button>
      </div>
      <p class="quiz-msg" id="quiz-msg">&nbsp;</p>
      <button class="quiz-cancel" id="quiz-cancel">Cancel</button>
    </div>`;
  document.body.appendChild(overlay);

  const card = overlay.querySelector('.quiz-card');
  const qEl = overlay.querySelector('#quiz-q');
  const typedEl = overlay.querySelector('#quiz-typed');
  const msgEl = overlay.querySelector('#quiz-msg');
  const paint = () => {
    qEl.textContent = q.text;
    typedEl.textContent = typed || ' ';
  };
  paint();

  overlay.querySelector('#quiz-pad').addEventListener('click', (e) => {
    const key = e.target.closest('.quiz-key');
    if (!key) return;
    const k = key.dataset.k;
    if (k === 'back') {
      typed = typed.slice(0, -1);
    } else if (k === 'ok') {
      if (!typed) return;
      if (Number(typed) === q.answer) {
        closeQuiz();
        onPass();
        return;
      }
      wrong += 1;
      if (wrong >= WRONG_LIMIT) {
        closeQuiz();
        return;
      }
      msgEl.textContent = 'Not quite — try this one.';
      q = question();
      typed = '';
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
    } else if (typed.length < MAX_DIGITS) {
      typed += k;
    }
    paint();
  });

  overlay.querySelector('#quiz-cancel').addEventListener('click', closeQuiz);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeQuiz();
  });
}
