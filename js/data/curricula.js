// ============================================================
// Curriculum-Registry: Klassenstufe + Bundesland → Themen (Generator-IDs).
//
// BASE ist der gemeinsame Kern (KMK-Bildungsstandards).
// OVERRIDES passt einzelne Bundesländer an: pro Klassenstufe entweder
//   - ein komplettes Array (ersetzt die Liste), oder
//   - { add: [...], remove: [...] } für gezielte Anpassungen.
//
// >>> Erweiterung: Hier echte Lehrplandaten pro Land pflegen. Die
// aktuellen Overrides sind beispielhafte Näherungen. <<<
// ============================================================

export const BASE_CURRICULUM = {
  5:  ['nz_addsub', 'nz_muldiv', 'runden', 'einheiten', 'rechteck'],
  6:  ['brueche', 'dezimal', 'ggt_kgv', 'rechteck', 'wkeit'],
  7:  ['prozent', 'negativ', 'dreisatz', 'lingl', 'brueche'],
  8:  ['lingl', 'binom', 'linfkt', 'prozent', 'potenz'],
  9:  ['potenz', 'wurzel', 'quadr', 'pyth', 'binom'],
  10: ['trig', 'expo', 'log', 'quadr', 'pyth'],
  11: ['abl', 'expo', 'log', 'quadr', 'linfkt'],
  12: ['integ', 'abl', 'vek', 'skalar', 'expo'],
  13: ['integ', 'skalar', 'wkeit', 'abl', 'vek'],
};

const OVERRIDES = {
  // Bayern (LehrplanPLUS, G9): Stochastik-Grundlagen früher, Wurzeln in 8 angeteasert
  BY: { 8: { add: ['wurzel'] }, 10: { add: ['wkeit'] } },
  // Baden-Württemberg: lineare Funktionen früh, Trigonometrie in 9
  BW: { 7: { add: ['linfkt'] }, 9: { add: ['trig'] } },
  // NRW: rationale Zahlen bereits in 6
  NW: { 6: { add: ['negativ'] } },
  // Sachsen: traditionell zügiger Aufbau der Arithmetik
  SN: { 5: { add: ['negativ'] }, 9: { add: ['trig'] } },
  // Hessen: Einstieg Analysis in der E-Phase (10)
  HE: { 10: { add: ['abl'] } },
};

export function getTopicsFor(profile) {
  const grade = Math.min(13, Math.max(5, profile?.grade ?? 5));
  let topics = [...(BASE_CURRICULUM[grade] ?? BASE_CURRICULUM[5])];

  const override = OVERRIDES[profile?.state]?.[grade];
  if (Array.isArray(override)) {
    topics = [...override];
  } else if (override) {
    if (override.remove) topics = topics.filter((t) => !override.remove.includes(t));
    if (override.add) topics.push(...override.add.filter((t) => !topics.includes(t)));
  }
  return topics;
}
