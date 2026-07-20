// ============================================================
// Rendert eine Themen-Erklärung als HTML – genutzt im
// Aufgaben-Modal (nach dem Beantworten) und im Lernheft.
// ============================================================

import { EXPLANATIONS } from '../math/explanations.js';
import { icon } from './icons.js';

export function hasExplanation(topicId) {
  return Boolean(EXPLANATIONS[topicId]);
}

export function renderExplanationHtml(topicId) {
  const e = EXPLANATIONS[topicId];
  if (!e) return '';

  let html = `<p class="exp-intro">${e.intro}</p>`;

  if (e.steps?.length) {
    html += `<h4 class="exp-h">So gehst du vor</h4>
      <ol class="exp-steps">${e.steps.map((s) => `<li>${s}</li>`).join('')}</ol>`;
  }

  if (e.example) {
    html += `<div class="exp-example">
      <div class="exp-problem">Beispiel: ${e.example.problem}</div>
      ${e.example.steps.map((s) => `<div class="exp-exstep">${s}</div>`).join('')}
      <div class="exp-result">${e.example.result}</div>
    </div>`;
  }

  if (e.merke) {
    html += `<div class="exp-merke">${icon('bulb')}<span><b>Merke:</b> ${e.merke}</span></div>`;
  }

  return html;
}
