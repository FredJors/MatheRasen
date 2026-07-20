// ============================================================
// Werkstatt: Upgrade-Karten rendern und Käufe abwickeln.
// ============================================================

import { UPGRADES, upgradeCost } from '../game/upgrades.js';
import { state, addCoins } from '../core/state.js';
import { on, emit } from '../core/events.js';
import { icon } from './icons.js';

let listEl = null;

export function initUpgradesScreen() {
  listEl = document.getElementById('upgrade-list');
  on('coins', render);
  on('upgrades', render);
  on('screen', (name) => { if (name === 'upgrades') render(); });
  render();
}

function render() {
  if (!listEl) return;
  listEl.innerHTML = '';

  for (const def of UPGRADES) {
    const level = state.upgrades[def.id] ?? 0;
    const maxed = level >= def.max;
    const cost = maxed ? 0 : upgradeCost(def, level);

    const card = document.createElement('div');
    card.className = 'card upgrade-card';

    const dots = Array.from({ length: def.max }, (_, i) => `<span class="${i < level ? 'on' : ''}"></span>`).join('');

    card.innerHTML = `
      <div class="upgrade-ico">${icon(def.icon)}</div>
      <div class="upgrade-info">
        <h3>${def.name}</h3>
        <p>${def.desc}</p>
        <div class="level-dots">${dots}</div>
      </div>
      <div class="upgrade-buy">
        <button class="btn btn-primary" ${maxed || state.coins < cost ? 'disabled' : ''}>
          ${maxed ? 'Max.' : `${icon('coin')} ${cost}`}
        </button>
        <small>${maxed ? 'Ausgebaut!' : `Stufe ${level} → ${level + 1}`}</small>
      </div>`;

    if (!maxed) {
      card.querySelector('button').addEventListener('click', () => buy(def, level, cost));
    }
    listEl.appendChild(card);
  }
}

function buy(def, level, cost) {
  if (state.coins < cost) return;
  addCoins(-cost);
  state.upgrades[def.id] = level + 1;
  emit('upgrades', state.upgrades);
  emit('toast', { icon: def.icon, text: `${def.name} auf Stufe ${level + 1} ausgebaut!` });
}
