// ============================================================
// Globaler Spielzustand + Persistenz.
// ============================================================

import { emit } from './events.js';
import * as storage from './storage.js';
import { BALANCE } from '../config.js';

export const state = {
  profile: null,   // { name, email, grade, state }
  coins: 0,
  xp: 0,
  upgrades: {},    // { upgradeId: level }
  stats: { tasksSolved: 0, tasksFailed: 0, tilesMowed: 0, obstaclesCleared: 0, lawnsCompleted: 0, expansions: 0, plantsHarvested: 0 },
  battery: BALANCE.batteryMax,
};

let savedGarden = null;

export function loadAll() {
  state.profile = storage.get('profile');
  const save = storage.get('save');
  if (save) {
    state.coins = save.coins ?? 0;
    state.xp = save.xp ?? 0;
    state.upgrades = save.upgrades ?? {};
    Object.assign(state.stats, save.stats ?? {});
    state.battery = save.battery ?? BALANCE.batteryMax;
    savedGarden = save.garden ?? null;
  }
}

export function getSavedGarden() { return savedGarden; }

export function persist(gardenData) {
  if (state.profile) storage.set('profile', state.profile);
  storage.set('save', {
    coins: state.coins,
    xp: state.xp,
    upgrades: state.upgrades,
    stats: state.stats,
    battery: state.battery,
    garden: gardenData ?? savedGarden,
  });
  if (gardenData) savedGarden = gardenData;
}

export function setProfile(profile) {
  state.profile = profile;
  storage.set('profile', profile);
  emit('profile', profile);
}

export function addCoins(n) {
  state.coins = Math.max(0, Math.round(state.coins + n));
  emit('coins', state.coins);
}

export function addXp(n) {
  state.xp += n;
  emit('xp', state.xp);
}

export function bumpStat(key, n = 1) {
  state.stats[key] = (state.stats[key] || 0) + n;
  emit('stats', state.stats);
}

export function playerLevel() {
  return Math.floor(Math.sqrt(state.xp / 40)) + 1;
}

export function resetAll() {
  storage.remove('profile');
  storage.remove('save');
  location.reload();
}
