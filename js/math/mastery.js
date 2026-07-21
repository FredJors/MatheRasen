// ============================================================
// Lern-Adaptivität: hält pro Thema fest, wie sicher ein Kind ist
// (Mastery 0..1) und leitet daraus ab,
//   - welche Themen häufiger drankommen (Schwächen zuerst),
//   - welche Schwierigkeit angemessen ist,
//   - welche Themen im Lernheft zum Üben empfohlen werden.
//
// Der Zustand liegt in state.topics; hier ist nur die Logik.
// ============================================================

import { state } from '../core/state.js';
import { emit } from '../core/events.js';
import { BALANCE } from '../config.js';

const M = BALANCE.mastery;

const LEVELS = [
  { max: 0.15, label: 'Neu', short: 'Neu' },
  { max: 0.40, label: 'Grundlagen', short: 'Grundlagen' },
  { max: 0.65, label: 'Auf gutem Weg', short: 'Auf gutem Weg' },
  { max: 0.85, label: 'Fast sicher', short: 'Fast sicher' },
  { max: 1.01, label: 'Gemeistert', short: 'Gemeistert' },
];

function entry(topicId) {
  return state.topics[topicId] ?? null;
}

export function masteryOf(topicId) {
  return entry(topicId)?.mastery ?? 0;
}

export function isMastered(topicId) {
  return masteryOf(topicId) >= M.masteredAt;
}

export function seenCount(topicId) {
  return entry(topicId)?.seen ?? 0;
}

export function topicStats(topicId) {
  const t = entry(topicId);
  return {
    seen: t?.seen ?? 0,
    correct: t?.correct ?? 0,
    wrong: t?.wrong ?? 0,
    mastery: t?.mastery ?? 0,
    streak: t?.streak ?? 0,
  };
}

export function masteryLevel(topicId) {
  const m = masteryOf(topicId);
  const index = LEVELS.findIndex((l) => m < l.max);
  return { index, ...LEVELS[index], ratio: m };
}

// Nach jeder beantworteten Aufgabe aufrufen.
export function recordResult(topicId, difficulty, correct) {
  const t = state.topics[topicId] ?? (state.topics[topicId] = {
    seen: 0, correct: 0, wrong: 0, mastery: 0, streak: 0, lastCorrect: null, lastSeen: 0,
  });

  t.seen += 1;
  state.topicSeq = (state.topicSeq ?? 0) + 1;
  t.lastSeen = state.topicSeq;
  t.lastCorrect = correct;

  if (correct) {
    t.correct += 1;
    t.streak = Math.max(1, t.streak + 1);
    const gain = M.gainBase + M.gainPerDiff * (difficulty - 1);
    t.mastery = Math.min(1, t.mastery + (1 - t.mastery) * gain);
  } else {
    t.wrong += 1;
    t.streak = Math.min(-1, t.streak - 1);
    t.mastery = Math.max(0, t.mastery - t.mastery * M.loss);
  }

  emit('mastery', { topicId, mastery: t.mastery });
}

// Gewicht eines Themas für die Zufallsauswahl der Aufgaben.
// Höheres Gewicht = kommt häufiger dran.
export function weightFor(topicId) {
  const t = entry(topicId);
  if (!t || t.seen === 0) return 1.8;           // neue Themen sanft einführen
  let w = 1 + (1 - t.mastery) * 2.5;            // Schwäche → deutlich häufiger
  if (t.lastCorrect === false) w += 1.6;        // zuletzt daneben → bald wiederholen
  if (t.mastery >= M.masteredAt) w *= 0.35;     // Gemeistertes nur zur Auffrischung
  return Math.max(0.15, w);
}

// Passende Schwierigkeit zum aktuellen Können (1..3), mit etwas Streuung.
export function recommendedDifficulty(topicId, maxDiff = 3) {
  const m = masteryOf(topicId);
  let d = m < 0.3 ? 1 : m < 0.65 ? 2 : 3;
  if (d > 1 && Math.random() < 0.3) d -= 1;      // ab und zu leichter (Selbstvertrauen)
  return Math.max(1, Math.min(maxDiff, d));
}

// Schwächste, noch nicht gemeisterte Themen für die Übungsempfehlung.
// Zuerst gesehene mit niedriger Mastery, dann bisher ungesehene.
export function weakestTopics(topicIds, n = 3) {
  const seen = topicIds
    .filter((id) => seenCount(id) > 0 && !isMastered(id))
    .sort((a, b) => masteryOf(a) - masteryOf(b));
  const unseen = topicIds.filter((id) => seenCount(id) === 0);
  return [...seen, ...unseen].slice(0, n);
}

export function allMastered(topicIds) {
  return topicIds.length > 0 && topicIds.every((id) => isMastered(id));
}
