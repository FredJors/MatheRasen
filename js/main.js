// ============================================================
// Einstiegspunkt: lädt den Spielstand, zeigt Onboarding oder
// startet direkt das Spiel.
// ============================================================

import { loadAll, getSavedGarden, state } from './core/state.js';
import { startLoop } from './core/loop.js';
import { SAVE_INTERVAL_MS } from './config.js';
import { game } from './game/game.js';
import { showScreen, initNav } from './ui/screens.js';
import { initOnboarding } from './ui/onboarding.js';
import { initHud } from './ui/hud.js';
import { initTaskModal } from './ui/taskModal.js';
import { initUpgradesScreen } from './ui/upgradesScreen.js';
import { initProfileScreen } from './ui/profileScreen.js';
import { initWissenScreen } from './ui/wissenScreen.js';

let gameStarted = false;

function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  showScreen('game');
  game.init(document.getElementById('garden-canvas'), getSavedGarden());

  initHud();
  initTaskModal();
  initUpgradesScreen();
  initProfileScreen();
  initWissenScreen();

  startLoop((dt, now) => {
    game.update(dt, now);
    game.renderer.render(now);
  });

  setInterval(() => game.save(), SAVE_INTERVAL_MS);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') game.save();
  });
}

function boot() {
  loadAll();
  initNav();

  if (state.profile) {
    startGame();
  } else {
    initOnboarding(startGame);
    showScreen('onboarding');
  }
}

boot();

// Debug-Zugriff in der Browser-Konsole
window.__mr = { game, state };
