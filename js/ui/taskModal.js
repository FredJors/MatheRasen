// ============================================================
// Aufgaben-Modal: zeigt eine generierte Aufgabe, prüft die
// Antwort und bietet nach dem Beantworten IMMER eine
// ausführliche Erklärung an (Lernen hat höchste Priorität).
// Ablauf: Prüfen → richtig/2× falsch → „Weiter“ + Erklärung.
// ============================================================

import { generateTask, checkAnswer, formatSolution } from '../math/taskEngine.js';
import { state, bumpStat, addXp } from '../core/state.js';
import { BALANCE } from '../config.js';
import { icon } from './icons.js';
import { hasExplanation, renderExplanationHtml } from './explanationView.js';
import { logTask } from '../core/sync.js';
import { recordResult } from '../math/mastery.js';

const els = {};
let current = null; // { task, onCorrect, attempts, selectedChoice, done }

export function initTaskModal() {
  els.modal = document.getElementById('task-modal');
  els.topic = document.getElementById('task-topic');
  els.diff = document.getElementById('task-diff');
  els.question = document.getElementById('task-question');
  els.zone = document.getElementById('task-answer-zone');
  els.feedback = document.getElementById('task-feedback');
  els.check = document.getElementById('task-check');
  els.explainBtn = document.getElementById('task-explain');
  els.explainPanel = document.getElementById('task-explanation');
  els.reward = document.getElementById('task-reward');
  els.card = els.modal.querySelector('.modal-card');

  els.explainBtn.innerHTML = `${icon('bulb')}<span>Erklärung anzeigen</span>`;
  els.explainBtn.addEventListener('click', showExplanation);
  document.getElementById('task-close').addEventListener('click', closeModal);
  els.modal.addEventListener('click', (e) => { if (e.target === els.modal) closeModal(); });
  els.check.addEventListener('click', onCheck);
}

export function openTask({ difficulty, topicId, rewardHtml, onCorrect } = {}) {
  const task = generateTask(state.profile, { difficulty, topicId });
  current = { task, onCorrect, attempts: 0, selectedChoice: null, done: false };

  els.topic.textContent = task.topicLabel;
  els.diff.textContent = '★'.repeat(task.difficulty) + '☆'.repeat(3 - task.difficulty);
  els.question.textContent = task.text;
  els.feedback.textContent = '';
  els.feedback.className = 'task-feedback';
  els.check.textContent = 'Prüfen';
  els.explainBtn.classList.add('hidden');
  els.explainPanel.classList.add('hidden');
  els.explainPanel.innerHTML = '';
  els.reward.innerHTML = rewardHtml ? `Belohnung: ${rewardHtml}` : '';

  els.zone.innerHTML = '';
  if (task.type === 'choice') {
    const grid = document.createElement('div');
    grid.className = 'choice-grid';
    task.choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.addEventListener('click', () => {
        if (current?.done) return;
        current.selectedChoice = i;
        grid.querySelectorAll('.choice-btn').forEach((b, j) => b.classList.toggle('selected', i === j));
      });
      grid.appendChild(btn);
    });
    els.zone.appendChild(grid);
  } else {
    const row = document.createElement('div');
    row.className = 'task-input-row';
    const numeric = task.inputMode !== 'text';

    const input = document.createElement('input');
    input.className = 'task-input';
    input.id = 'task-input';
    input.autocomplete = 'off';
    input.inputMode = numeric ? 'decimal' : 'text';
    input.placeholder = numeric ? 'Deine Antwort' : 'z. B. 3/4';
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') onCheck(); });

    // ±-Knopf: die Zahlen-Tastatur am Handy hat keine Minus-Taste.
    // Der Knopf setzt/entfernt ein führendes Minus – geräteunabhängig
    // und ohne die Lösung zu verraten (erscheint bei jeder Zahlaufgabe).
    if (numeric) {
      const signBtn = document.createElement('button');
      signBtn.type = 'button';
      signBtn.className = 'sign-btn';
      signBtn.textContent = '±';
      signBtn.setAttribute('aria-label', 'Minus-Vorzeichen setzen oder entfernen');
      signBtn.addEventListener('click', () => {
        const v = input.value.trim().replace('−', '-');
        input.value = v.startsWith('-') ? v.slice(1) : '-' + v;
        input.focus();
        const end = input.value.length;
        try { input.setSelectionRange(end, end); } catch { /* egal */ }
      });
      row.appendChild(signBtn);
    }

    row.appendChild(input);
    if (task.unit) {
      const unit = document.createElement('span');
      unit.className = 'task-unit';
      unit.textContent = task.unit;
      row.appendChild(unit);
    }
    els.zone.appendChild(row);
    setTimeout(() => input.focus(), 60);
  }

  els.modal.classList.remove('hidden');
  els.card.scrollTop = 0;
}

function onCheck() {
  if (!current) return;
  if (current.done) { closeModal(); return; } // "Weiter"

  const { task } = current;
  let rawInput;
  if (task.type === 'choice') {
    if (current.selectedChoice == null) {
      setFeedback('Wähle zuerst eine Antwort aus.', 'err');
      return;
    }
    rawInput = current.selectedChoice;
  } else {
    rawInput = document.getElementById('task-input')?.value ?? '';
    if (!String(rawInput).trim()) {
      setFeedback('Gib zuerst eine Antwort ein.', 'err');
      return;
    }
  }

  if (checkAnswer(task, rawInput)) {
    current.done = true;
    setFeedback('✔ Richtig! Stark gerechnet.', 'ok');
    markChoices(true);
    bumpStat('tasksSolved');
    addXp(BALANCE.xpPerDiff * task.difficulty);
    recordResult(task.topicId, task.difficulty, true);
    logTask(task, true);
    current.onCorrect?.(task);
    els.check.textContent = 'Weiter';
    offerExplanation();
    return;
  }

  current.attempts++;
  els.card.classList.remove('shake');
  void els.card.offsetWidth; // Animation neu starten
  els.card.classList.add('shake');

  if (current.attempts === 1) {
    setFeedback(`✖ Leider falsch. Tipp: ${task.hint}`, 'err');
  } else {
    current.done = true;
    markChoices(false);
    setFeedback(`✖ Die richtige Antwort: ${formatSolution(task)}\n${task.solution}`, 'err');
    bumpStat('tasksFailed');
    recordResult(task.topicId, task.difficulty, false);
    logTask(task, false);
    els.check.textContent = 'Weiter';
    offerExplanation();
  }
}

function offerExplanation() {
  if (hasExplanation(current.task.topicId)) {
    els.explainBtn.classList.remove('hidden');
  }
}

function showExplanation() {
  if (!current) return;
  els.explainPanel.innerHTML = renderExplanationHtml(current.task.topicId);
  els.explainPanel.classList.remove('hidden');
  els.explainBtn.classList.add('hidden');
  els.explainPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function markChoices(success) {
  const { task } = current;
  if (task.type !== 'choice') return;
  els.zone.querySelectorAll('.choice-btn').forEach((b, i) => {
    if (i === task.answerIndex) b.classList.add('correct');
    else if (i === current.selectedChoice && !success) b.classList.add('wrong');
  });
}

function setFeedback(text, cls) {
  els.feedback.textContent = text;
  els.feedback.className = `task-feedback ${cls}`;
}

function closeModal() {
  els.modal.classList.add('hidden');
  current = null;
}
