// ============================================================
// Werkstatt mit zwei Tabs:
//   - Technik: funktionale Upgrades (Geschwindigkeit, Akku …)
//   - Deko:    Roboter-Skins & Garten-Deko (Kosmetik, Münz-Senke)
// ============================================================

import { UPGRADES, upgradeCost } from '../game/upgrades.js';
import { MOWER_SKINS, DECOR } from '../game/cosmetics.js';
import { state, addCoins, buyCosmetic, equipSkin, ownsCosmetic } from '../core/state.js';
import { on, emit } from '../core/events.js';
import { icon } from './icons.js';

let listEl = null;
let tab = 'tech';

export function initUpgradesScreen() {
  listEl = document.getElementById('upgrade-list');

  document.querySelectorAll('#werkstatt-tabs .seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      tab = btn.dataset.tab;
      document.querySelectorAll('#werkstatt-tabs .seg-btn').forEach((b) => b.classList.toggle('active', b === btn));
      render();
    });
  });

  on('coins', render);
  on('upgrades', render);
  on('cosmetics', render);
  on('screen', (name) => { if (name === 'upgrades') render(); });
  render();
}

function render() {
  if (!listEl) return;
  listEl.scrollTop = listEl.scrollTop; // Scrollposition halten
  listEl.innerHTML = '';
  if (tab === 'tech') renderTech();
  else renderDeko();
}

// ---------- Technik ----------

function renderTech() {
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
    if (!maxed) card.querySelector('button').addEventListener('click', () => buyUpgrade(def, level, cost));
    listEl.appendChild(card);
  }
}

function buyUpgrade(def, level, cost) {
  if (state.coins < cost) return;
  addCoins(-cost);
  state.upgrades[def.id] = level + 1;
  emit('upgrades', state.upgrades);
  emit('toast', { icon: def.icon, text: `${def.name} auf Stufe ${level + 1} ausgebaut!` });
}

// ---------- Deko ----------

function renderDeko() {
  const intro = document.createElement('p');
  intro.className = 'wissen-sub';
  intro.textContent = 'Roboter-Skins';
  listEl.appendChild(intro);

  for (const skin of MOWER_SKINS) {
    const owned = skin.cost === 0 || ownsCosmetic(skin.id);
    const active = state.cosmetics.skin === skin.id;
    listEl.appendChild(cosmeticCard({
      preview: skinPreview(skin),
      name: skin.name,
      status: active ? 'Aktiv am Roboter' : owned ? 'Freigeschaltet' : 'Roboter-Anstrich',
      button: active
        ? { label: 'Aktiv', disabled: true }
        : owned
          ? { label: 'Anlegen', primary: true, onClick: () => { equipSkin(skin.id); emit('toast', { icon: 'check', text: `${skin.name} angelegt!` }); } }
          : { label: `${icon('coin')} ${skin.cost}`, primary: true, disabled: state.coins < skin.cost,
              onClick: () => tryBuy(skin, () => equipSkin(skin.id)) },
    }));
  }

  const intro2 = document.createElement('p');
  intro2.className = 'wissen-sub';
  intro2.textContent = 'Garten-Deko';
  listEl.appendChild(intro2);

  for (const decor of DECOR) {
    const owned = ownsCosmetic(decor.id);
    listEl.appendChild(cosmeticCard({
      preview: decorPreview(decor),
      name: decor.name,
      status: owned ? 'Steht in deinem Garten' : 'Schmückt deinen Garten',
      button: owned
        ? { label: `${icon('check')} Im Garten`, disabled: true }
        : { label: `${icon('coin')} ${decor.cost}`, primary: true, disabled: state.coins < decor.cost,
            onClick: () => tryBuy(decor) },
    }));
  }
}

function tryBuy(item, after) {
  if (buyCosmetic(item.id, item.cost)) {
    emit('toast', { icon: 'check', text: `${item.name} gekauft!` });
    after?.();
  }
}

function cosmeticCard({ preview, name, status, button }) {
  const card = document.createElement('div');
  card.className = 'card cosmetic-card';
  const info = document.createElement('div');
  info.className = 'upgrade-info';
  info.innerHTML = `<h3>${name}</h3><p>${status}</p>`;
  const buy = document.createElement('div');
  buy.className = 'upgrade-buy';
  const btn = document.createElement('button');
  btn.className = `btn ${button.primary ? 'btn-primary' : 'btn-ghost'}`;
  btn.innerHTML = button.label;
  btn.disabled = Boolean(button.disabled);
  if (button.onClick && !button.disabled) btn.addEventListener('click', button.onClick);
  buy.appendChild(btn);

  const prev = document.createElement('div');
  prev.className = 'cosmetic-preview';
  prev.appendChild(preview);

  card.append(prev, info, buy);
  return card;
}

// ---------- Vorschau-Grafiken ----------

function makeCanvas() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const cv = document.createElement('canvas');
  cv.width = 52 * dpr;
  cv.height = 52 * dpr;
  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);
  return { cv, ctx };
}

function skinPreview(skin) {
  const { cv, ctx } = makeCanvas();
  ctx.translate(26, 28);
  // kleine Draufsicht des Roboters
  ctx.fillStyle = '#26313f';
  ctx.beginPath(); ctx.roundRect(-17, -12, 34, 8, 3); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-17, 4, 34, 8, 3); ctx.fill();
  ctx.fillStyle = skin.body;
  ctx.strokeStyle = skin.stroke;
  ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.roundRect(-16, -11, 32, 22, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = skin.bumper;
  ctx.beginPath(); ctx.roundRect(10, -8, 5, 16, 2); ctx.fill();
  ctx.fillStyle = skin.accent;
  ctx.beginPath(); ctx.roundRect(-3, -11, 3.4, 3, 1); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-3, 8, 3.4, 3, 1); ctx.fill();
  return cv;
}

function decorPreview(decor) {
  const { cv, ctx } = makeCanvas();
  decor.draw(ctx, 26, 40, 1.15, performance.now());
  return cv;
}
