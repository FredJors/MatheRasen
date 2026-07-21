// ============================================================
// Task-Engine: wählt passend zum Profil (Klassenstufe + Bundesland)
// ein Thema aus dem Curriculum und erzeugt eine Aufgabe.
// ============================================================

import { GENERATORS, fmt } from './generators.js';
import { getTopicsFor } from '../data/curricula.js';
import { weightFor, recommendedDifficulty } from './mastery.js';

let lastTopic = null;

// Gewichtete Zufallsauswahl: Themen mit höherem Gewicht (Schwächen,
// zuletzt Falsches, Neues) kommen häufiger dran.
function weightedPick(ids) {
  const weights = ids.map((id) => (id === lastTopic ? weightFor(id) * 0.15 : weightFor(id)));
  const total = weights.reduce((s, w) => s + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < ids.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return ids[i];
  }
  return ids[ids.length - 1];
}

export function generateTask(profile, { difficulty, topicId } = {}) {
  let id;
  if (topicId && GENERATORS[topicId]) {
    // Gezieltes Training eines Themas (Lernheft)
    id = topicId;
  } else {
    const topics = getTopicsFor(profile).filter((tid) => GENERATORS[tid]);
    if (!topics.length) topics.push('nz_addsub');
    id = weightedPick(topics);
    lastTopic = id;
  }

  const gen = GENERATORS[id];
  // Ohne feste Vorgabe passt sich die Schwierigkeit dem Können an.
  const diff = difficulty != null
    ? Math.max(1, Math.min(gen.maxDiff, difficulty))
    : recommendedDifficulty(id, gen.maxDiff);
  const task = gen.gen(diff);
  return { ...task, topicId: id, topicLabel: gen.label, difficulty: diff };
}

// Nutzereingabe parsen: deutsche Kommas ("3,5") und Brüche ("3/4")
export function parseInput(raw) {
  if (raw == null) return null;
  const s = String(raw).trim().replace(/\s+/g, '').replace(',', '.').replace('−', '-');
  if (!s) return null;
  const m = s.match(/^([+-]?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (m) {
    const den = parseFloat(m[2]);
    return den === 0 ? null : parseFloat(m[1]) / den;
  }
  if (!/^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(s)) return null;
  return parseFloat(s);
}

export function checkAnswer(task, rawInput) {
  if (task.type === 'choice') return rawInput === task.answerIndex;
  const v = parseInput(rawInput);
  if (v == null) return false;
  const tol = task.tol ?? 0.015;
  return Math.abs(v - task.answer) <= tol;
}

export function formatSolution(task) {
  if (task.type === 'choice') return task.choices[task.answerIndex];
  const val = task.answerText ?? fmt(task.answer);
  return task.unit ? `${val} ${task.unit}` : val;
}
