// ============================================================
// Screen-Manager: blendet Sections ein/aus, pflegt die Bottom-Nav.
// Neue Screens: Section mit id="screen-<name>" anlegen und
// (optional) Nav-Button mit data-nav="<name>" ergänzen.
// ============================================================

import { emit } from '../core/events.js';

const NAV_SCREENS = ['game', 'upgrades', 'profile', 'wissen'];

export function showScreen(name) {
  document.querySelectorAll('.screen').forEach((el) => {
    el.classList.toggle('active', el.id === `screen-${name}`);
  });

  const nav = document.getElementById('bottombar');
  nav.classList.toggle('hidden', !NAV_SCREENS.includes(name));
  nav.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.nav === name);
  });

  emit('screen', name);
}

export function initNav() {
  document.querySelectorAll('#bottombar .nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => showScreen(btn.dataset.nav));
  });
}
