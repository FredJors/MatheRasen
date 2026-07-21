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
  topics: {},      // { topicId: { seen, correct, wrong, mastery, streak, lastCorrect, lastSeen } }
  topicSeq: 0,     // fortlaufender Zähler für Aktualität (Wiederholung)
  cosmetics: { owned: [], skin: 'classic' }, // gekaufte Deko/Skins + aktiver Roboter-Skin
};

let savedGarden = null;

export function loadAll() {
  state.profile = storage.get('profile');
  const save = storage.get('save');
  if (save) hydrate(save);
}

// Gespeicherten Stand (lokal oder Cloud) in den Zustand übernehmen.
function hydrate(save) {
  state.coins = save.coins ?? 0;
  state.xp = save.xp ?? 0;
  state.upgrades = save.upgrades ?? {};
  Object.assign(state.stats, save.stats ?? {});
  state.battery = save.battery ?? BALANCE.batteryMax;
  state.topics = save.topics ?? {};
  state.topicSeq = save.topicSeq ?? save.topic_seq ?? 0; // lokal camelCase / Cloud snake_case
  state.cosmetics = { owned: [], skin: 'classic', ...(save.cosmetics ?? {}) };
  savedGarden = save.garden ?? null;
}

export function getSavedGarden() { return savedGarden; }

export function persist(gardenData) {
  if (state.profile) storage.set('profile', state.profile);
  const payload = {
    coins: state.coins,
    xp: state.xp,
    upgrades: state.upgrades,
    stats: state.stats,
    battery: state.battery,
    topics: state.topics,
    topicSeq: state.topicSeq,
    cosmetics: state.cosmetics,
    garden: gardenData ?? savedGarden,
  };
  storage.set('save', payload);
  if (gardenData) savedGarden = gardenData;
  emit('persisted', payload); // Cloud-Sync hört mit (js/core/sync.js)
}

// Cloud-Spielstand übernehmen (z. B. nach Login auf neuem Gerät)
export function applyCloudSave(row) {
  if (!row) return;
  hydrate(row);
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

// ---------- Kosmetik ----------

export function ownsCosmetic(id) {
  return state.cosmetics.owned.includes(id);
}

export function buyCosmetic(id, cost) {
  if (state.coins < cost || ownsCosmetic(id)) return false;
  addCoins(-cost);
  state.cosmetics.owned.push(id);
  emit('cosmetics', state.cosmetics);
  return true;
}

export function equipSkin(id) {
  state.cosmetics.skin = id;
  emit('cosmetics', state.cosmetics);
}

export function resetAll() {
  storage.remove('profile');
  storage.remove('save');
  location.reload();
}
