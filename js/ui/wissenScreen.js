// ============================================================
// Lernheft: alle Themen-Erklärungen gesammelt, geordnet und
// trainierbar – erreichbar über das Buch-Symbol im Spiel.
// Zeigt zuerst die Themen des eigenen Lehrplans, darunter alle
// weiteren Themen nach Klassenstufen geordnet.
// ============================================================

import { GENERATORS } from '../math/generators.js';
import { EXPLANATIONS } from '../math/explanations.js';
import { getTopicsFor, BASE_CURRICULUM } from '../data/curricula.js';
import { state } from '../core/state.js';
import { on } from '../core/events.js';
import { showScreen } from './screens.js';
import { icon } from './icons.js';
import { renderExplanationHtml } from './explanationView.js';
import { openBoostTask } from './hud.js';
import { stateName } from '../data/bundeslaender.js';

const BANDS = [
  { label: 'Klasse 5–6', grades: [5, 6] },
  { label: 'Klasse 7–8', grades: [7, 8] },
  { label: 'Klasse 9–10', grades: [9, 10] },
  { label: 'Oberstufe (11–13)', grades: [11, 12, 13] },
];

let bodyEl = null;
let currentTopic = null;

export function initWissenScreen() {
  bodyEl = document.getElementById('wissen-body');
  document.getElementById('wissen-back').addEventListener('click', () => {
    if (currentTopic) {
      currentTopic = null;
      renderList();
    } else {
      showScreen('game');
    }
  });
  on('screen', (name) => {
    if (name === 'wissen') {
      if (currentTopic) renderTopic(currentTopic);
      else renderList();
    }
  });
}

function teaser(id) {
  const intro = EXPLANATIONS[id]?.intro ?? '';
  const first = intro.split('. ')[0] ?? '';
  if (!first) return '';
  return first.length > 95 ? `${first.slice(0, 92)}…` : first + (first.endsWith('.') ? '' : '.');
}

function topicCardHtml(id) {
  if (!GENERATORS[id]) return '';
  const title = EXPLANATIONS[id]?.title ?? GENERATORS[id].label;
  return `<button class="card topic-card" data-topic="${id}">
    <span class="topic-ico">${icon('book')}</span>
    <span class="topic-txt"><h3>${title}</h3><p>${teaser(id)}</p></span>
    <span class="chev">${icon('chev')}</span>
  </button>`;
}

function renderList() {
  currentTopic = null;
  const profile = state.profile;
  const mine = getTopicsFor(profile);

  let html = `<p class="wissen-sub">Deine Themen · ${profile.grade}. Klasse · ${stateName(profile.state)}</p>`;
  html += mine.map(topicCardHtml).join('');

  const seen = new Set(mine);
  for (const band of BANDS) {
    const ids = [];
    for (const grade of band.grades) {
      for (const id of BASE_CURRICULUM[grade] ?? []) {
        if (!seen.has(id) && !ids.includes(id)) ids.push(id);
      }
    }
    ids.forEach((id) => seen.add(id));
    if (ids.length) {
      html += `<p class="wissen-sub">${band.label}</p>` + ids.map(topicCardHtml).join('');
    }
  }

  bodyEl.innerHTML = html;
  bodyEl.querySelectorAll('[data-topic]').forEach((btn) => {
    btn.addEventListener('click', () => renderTopic(btn.dataset.topic));
  });
  bodyEl.scrollTop = 0;
}

function renderTopic(id) {
  currentTopic = id;
  const title = EXPLANATIONS[id]?.title ?? GENERATORS[id]?.label ?? id;
  bodyEl.innerHTML = `
    <div class="card topic-detail">
      <h2>${title}</h2>
      <div class="explanation">${renderExplanationHtml(id)}</div>
      <div class="wissen-actions">
        <button id="wissen-ueben" class="btn btn-primary btn-big">${icon('target')}<span>Jetzt üben</span></button>
        <button id="wissen-hard" class="btn btn-ghost">Herausforderung (schwer)</button>
      </div>
    </div>`;
  document.getElementById('wissen-ueben').addEventListener('click', () => openBoostTask({ topicId: id }));
  document.getElementById('wissen-hard').addEventListener('click', () =>
    openBoostTask({ topicId: id, difficulty: GENERATORS[id]?.maxDiff ?? 3 }));
  bodyEl.scrollTop = 0;
}
