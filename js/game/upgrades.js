// ============================================================
// Upgrade-Registry.
// Neue Upgrades: Eintrag ergänzen und Effekt in getEffects()
// verrechnen. Kosten steigen exponentiell pro Stufe.
// ============================================================

import { BALANCE } from '../config.js';

// icon = Name aus js/ui/icons.js
export const UPGRADES = [
  {
    id: 'speed', icon: 'rocket', name: 'Geschwindigkeit',
    desc: 'Der Mäher fährt schneller über den Rasen.',
    max: 5, baseCost: 60, costFactor: 1.7,
  },
  {
    id: 'blade', icon: 'blade', name: 'Mähbreite',
    desc: 'Breiteres Mähwerk – mäht mehr Fläche pro Fahrt.',
    max: 4, baseCost: 90, costFactor: 1.8,
  },
  {
    id: 'battery', icon: 'battery', name: 'Akku-Kapazität',
    desc: 'Größerer Akku – längere Mähfahrten am Stück.',
    max: 5, baseCost: 55, costFactor: 1.6,
  },
  {
    id: 'charger', icon: 'charger', name: 'Ladestation',
    desc: 'Die Station lädt den Akku schneller auf.',
    max: 5, baseCost: 55, costFactor: 1.6,
  },
  {
    id: 'tutor', icon: 'cap', name: 'Lernturbo',
    desc: 'Mathe-Boosts laden mehr Akku und bringen mehr Münzen.',
    max: 4, baseCost: 70, costFactor: 1.7,
  },
];

export function upgradeCost(def, currentLevel) {
  return Math.round(def.baseCost * Math.pow(def.costFactor, currentLevel));
}

export function getEffects(levels = {}) {
  const lvl = (id) => levels[id] ?? 0;
  return {
    speed: BALANCE.speedBase + lvl('speed') * 0.28,
    mowRadius: BALANCE.mowRadiusBase + lvl('blade') * 0.14,
    batteryMax: BALANCE.batteryMax + lvl('battery') * 22,
    chargePerSec: BALANCE.chargePerSec + lvl('charger') * 1.6,
    taskCharge: BALANCE.taskCharge + lvl('tutor') * 7,
    coinTaskBonus: lvl('tutor') * 3,
  };
}
