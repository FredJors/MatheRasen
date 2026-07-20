// ============================================================
// Profil-Screen: Profildaten anzeigen/ändern, Statistik, Reset.
// ============================================================

import { state, setProfile, resetAll, playerLevel } from '../core/state.js';
import { on, emit } from '../core/events.js';
import { fillGradeSelect, fillStateSelect } from './onboarding.js';
import { isCloudConnected, cloudEmail, signOutCloud, updateCloudProfile } from '../core/sync.js';

let els = {};

export function initProfileScreen() {
  els = {
    name: document.getElementById('pf-name'),
    email: document.getElementById('pf-email'),
    cloud: document.getElementById('pf-cloud'),
    logout: document.getElementById('btn-logout'),
    grade: document.getElementById('pf-grade'),
    state: document.getElementById('pf-state'),
    stats: document.getElementById('stats-grid'),
  };

  els.logout.addEventListener('click', () => {
    if (confirm('Vom Cloud-Konto abmelden? Du spielst dann nur noch lokal auf diesem Gerät weiter.')) {
      signOutCloud();
      renderCloud();
      emit('toast', { icon: 'check', text: 'Abgemeldet – Spielstand bleibt lokal erhalten.' });
    }
  });
  on('cloud', renderCloud);

  fillGradeSelect(els.grade, state.profile?.grade ?? 7);
  fillStateSelect(els.state, state.profile?.state ?? 'NW');

  els.grade.addEventListener('change', updateProfile);
  els.state.addEventListener('change', updateProfile);
  document.getElementById('btn-reset').addEventListener('click', () => {
    if (confirm('Wirklich den gesamten Fortschritt löschen? Das kann nicht rückgängig gemacht werden.')) {
      resetAll();
    }
  });

  on('screen', (name) => { if (name === 'profile') render(); });
  on('stats', renderStats);
  render();
}

function updateProfile() {
  const profile = {
    ...state.profile,
    grade: parseInt(els.grade.value, 10),
    state: els.state.value,
  };
  setProfile(profile);
  updateCloudProfile(profile);
  emit('toast', { icon: 'book', text: 'Aufgaben an neuen Lehrplan angepasst!' });
}

function renderCloud() {
  const connected = isCloudConnected();
  els.cloud.textContent = connected ? `✓ Verbunden (${cloudEmail()})` : 'Nur dieses Gerät';
  els.cloud.style.color = connected ? 'var(--green-deep)' : '';
  els.logout.classList.toggle('hidden', !connected);
}

function render() {
  if (!state.profile) return;
  els.name.textContent = state.profile.name;
  els.email.textContent = state.profile.email;
  els.grade.value = String(state.profile.grade);
  els.state.value = state.profile.state;
  renderCloud();
  renderStats();
}

function renderStats() {
  const s = state.stats;
  const tiles = [
    [playerLevel(), 'Spieler-Level'],
    [state.coins, 'Münzen'],
    [s.tasksSolved, 'Aufgaben gelöst'],
    [s.tilesMowed, 'Kacheln gemäht'],
    [s.obstaclesCleared, 'Hindernisse entfernt'],
    [s.lawnsCompleted, 'Rasen komplett gemäht'],
    [s.expansions ?? 0, 'Rasen-Erweiterungen'],
    [s.plantsHarvested ?? 0, 'Pflanzen geerntet'],
  ];
  els.stats.innerHTML = tiles
    .map(([value, label]) => `<div class="stat-tile"><b>${value}</b><span>${label}</span></div>`)
    .join('');
}
