// ============================================================
// Zentrale Konfiguration & Spiel-Balance
// Alle Stellschrauben des Spiels an einem Ort.
// ============================================================

// Isometrische Kachel-Geometrie (Welt-Pixel, vor Skalierung)
export const TILE_W = 64;
export const TILE_H = 32;
export const TILE_DEPTH = 7;    // "Dicke" der Rasenkachel
export const SPRITE_TOP = 28;   // Platz über der Kachel für hohes Gras

// Spielfeldgröße (später pro Level/Garten erweiterbar)
export const GRID = { cols: 12, rows: 9 };

export const BALANCE = {
  // Akku
  batteryMax: 100,          // Basis-Kapazität (Punkte)
  drainPerSec: 1.0,         // Verbrauch beim Mähen (Punkte/s)
  returnDrainFactor: 0.6,   // Verbrauch auf dem Rückweg
  lowBattery: 0.18,         // Anteil, ab dem der Mäher zur Station fährt
  chargePerSec: 5,          // Basis-Laderate (Punkte/s)
  taskCharge: 22,           // Akku-Bonus pro gelöster Aufgabe (Basis)
  minStartCharge: 0.25,     // Mindest-Akku, um die Ladestation zu verlassen

  // Rasen
  growthPerSec: 1 / 260,    // Nachwachsen (0..1 Halmhöhe pro Sekunde)
  mowHeight: 0.04,          // Halmhöhe nach dem Mähen
  mowMinCut: 0.3,           // erst ab dieser Höhe zählt eine Kachel als "gemäht"
  tallThreshold: 0.45,      // ab hier gilt Gras als "hoch"

  // Mäher (Basiswerte, via Upgrades erweiterbar)
  speedBase: 1.15,          // Kacheln pro Sekunde
  mowRadiusBase: 0.55,      // Mähradius in Kacheln

  // Belohnungen
  coinPerTile: 1,
  coinTaskBase: 6,          // + 4 * Schwierigkeit
  coinTaskPerDiff: 4,
  xpPerDiff: 5,
  lawnBonus: 60,            // Bonus: kompletter Rasen gemäht

  // Hindernisse / Extras
  spawn: {
    firstDelay: 30,         // Sekunden bis zum ersten Spawn
    minDelay: 45,
    maxDelay: 85,
    maxActive: 4,
  },

  // Rasen-Erweiterung (Plus-Felder am Rand)
  expansion: {
    baseCost: 120,          // Kosten der ersten Erweiterung
    costFactor: 1.35,       // Preisanstieg pro gekaufter Erweiterung
    maxCols: 18,
    maxRows: 14,
  },

  // Sonderpflanzen (wachsen bevorzugt auf neuem Boden)
  plants: {
    minDelay: 12,           // Sekunden zwischen Spawn-Versuchen
    maxDelay: 26,
    baseMax: 2,             // Grundlimit; +1 je Erweiterung
  },

  // Lern-Adaptivität: wie sich das Können (Mastery 0..1) pro Thema
  // nach jeder Antwort verändert und ab wann ein Thema "gemeistert" ist.
  mastery: {
    gainBase: 0.18,         // Zuwachs bei richtiger Antwort (Basis)
    gainPerDiff: 0.05,      // + pro Schwierigkeitsstufe darüber
    loss: 0.26,             // Anteil, den eine falsche Antwort abzieht
    masteredAt: 0.85,       // ab hier gilt ein Thema als gemeistert
  },
};

export const SAVE_INTERVAL_MS = 5000;
