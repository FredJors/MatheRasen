// ============================================================
// HUD des Spiel-Screens: Pills, Status-Karte, Bubble, Buttons,
// Canvas-Interaktion (Hindernisse antippen), Lernheft-Zugang,
// Bell/Hilfe, Toasts (mit Icons).
// ============================================================

import { on, emit } from '../core/events.js';
import { state, addCoins } from '../core/state.js';
import { showScreen } from './screens.js';
import { game } from '../game/game.js';
import { BALANCE } from '../config.js';
import { OBSTACLES } from '../game/obstacles.js';
import { stateName } from '../data/bundeslaender.js';
import { openTask } from './taskModal.js';
import { icon } from './icons.js';

const ICON_PLAY = '<svg viewBox="0 0 24 24"><path d="M8.5 5.8v12.4L19 12 8.5 5.8Z" fill="currentColor"/></svg>';
const ICON_PAUSE = '<svg viewBox="0 0 24 24"><rect x="7" y="6" width="3.6" height="12" rx="1.4" fill="currentColor"/><rect x="13.4" y="6" width="3.6" height="12" rx="1.4" fill="currentColor"/></svg>';

const STATUS = {
  IDLE: { text: 'Bereit', dot: 'dot-green' },
  MOWING: { text: 'Mäht den Rasen …', dot: 'dot-green dot-pulse' },
  RETURNING: { text: 'Fährt zur Ladestation', dot: 'dot-amber dot-pulse' },
  CHARGING: { text: 'Lädt auf', dot: 'dot-amber dot-pulse' },
  EMPTY: { text: 'Akku leer! Löse eine Aufgabe', dot: 'dot-red dot-pulse' },
};

let els = {};
let toastTimer = null;

export function initHud() {
  els = {
    title: document.getElementById('garden-title'),
    sub: document.getElementById('garden-sub'),
    battVal: document.getElementById('batt-val'),
    battIco: document.getElementById('batt-ico'),
    battFill: document.getElementById('batt-fill'),
    bubbleVal: document.getElementById('bubble-val'),
    bubbleLabel: document.getElementById('bubble-label'),
    bubbleIco: document.getElementById('bubble-ico'),
    statusDot: document.getElementById('status-dot'),
    statusText: document.getElementById('status-text'),
    btnMain: document.getElementById('btn-main'),
    btnMainIco: document.getElementById('btn-main-ico'),
    btnBoost: document.getElementById('btn-boost'),
    btnFlash: document.getElementById('btn-flash'),
    bellBadge: document.getElementById('bell-badge'),
    toast: document.getElementById('toast'),
    canvas: document.getElementById('garden-canvas'),
  };

  els.btnMain.addEventListener('click', () => game.toggleMain());
  els.btnBoost.addEventListener('click', () => openBoostTask());
  els.btnFlash.addEventListener('click', () => openBoostTask());

  document.getElementById('btn-wissen').addEventListener('click', () => showScreen('wissen'));
  document.getElementById('btn-settings').addEventListener('click', () => showScreen('profile'));
  document.getElementById('btn-help').addEventListener('click', showHelp);
  document.getElementById('btn-bell').addEventListener('click', showObstacleInfo);

  initCanvasInput();
  initInfoModal();
  initConfirmModal();

  on('battery', renderBattery);
  on('coins', renderCoins);
  on('mode', renderMode);
  on('obstacles', renderBellBadge);
  on('toast', showToast);
  on('profile', renderProfileHeader);
  on('request-boost', () => openBoostTask());

  renderProfileHeader();
  renderBattery();
  renderCoins();
  renderMode(game.mode);
  renderBellBadge(game.garden?.obstacles.size ?? 0);
}

// ---------- Anzeige ----------

function renderProfileHeader() {
  const p = state.profile;
  if (!p) return;
  els.title.textContent = `${p.name}s Garten`;
  els.sub.textContent = `${p.grade}. Klasse · ${stateName(p.state)}`;
}

function renderBattery() {
  const max = game.effects().batteryMax;
  const pct = Math.round((state.battery / max) * 100);
  els.battVal.textContent = pct;
  els.bubbleVal.textContent = pct;
  els.battFill.style.transform = `scaleX(${Math.max(0.02, pct / 100)})`;
  els.battIco.classList.toggle('low', pct <= 35 && pct > 15);
  els.battIco.classList.toggle('critical', pct <= 15);
}

function renderCoins() {
  document.querySelectorAll('.coin-val').forEach((el) => { el.textContent = state.coins; });
}

function renderMode(mode) {
  const s = STATUS[mode] ?? STATUS.IDLE;
  els.statusText.textContent = s.text;
  els.statusDot.className = `dot ${s.dot}`;
  // Pause-Symbol nur beim Mähen; auf der Heimfahrt bedeutet ▶ „weitermähen“
  els.btnMainIco.innerHTML = mode === 'MOWING' ? ICON_PAUSE : ICON_PLAY;

  els.bubbleLabel.textContent = mode === 'CHARGING' ? 'Aufladen' : mode === 'EMPTY' ? 'Akku leer' : 'Akku';
  els.bubbleIco.classList.toggle('warn', mode === 'EMPTY');
}

function renderBellBadge(count) {
  els.bellBadge.textContent = count;
  els.bellBadge.classList.toggle('hidden', !count);
}

function showToast(payload) {
  const data = typeof payload === 'string' ? { icon: null, text: payload } : payload;
  els.toast.innerHTML = (data.icon ? icon(data.icon) : '') + `<span>${data.text}</span>`;
  els.toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.add('hidden'), 3400);
}

// ---------- Aufgaben ----------

// Mathe-Boost-Aufgabe (auch vom Lernheft mit festem Thema genutzt).
export function openBoostTask({ topicId, difficulty } = {}) {
  const eff = game.effects();
  const coins = BALANCE.coinTaskBase + eff.coinTaskBonus;
  const needsCharge = state.battery < eff.batteryMax - 1;
  const rewardHtml = needsCharge
    ? `${icon('bolt', 'ic-amber')} +${eff.taskCharge} Akku · ${icon('coin')} +${coins}+ Münzen`
    : `${icon('coin')} +${coins}+ Münzen`;

  openTask({
    topicId,
    difficulty,
    rewardHtml,
    onCorrect(task) {
      const charged = game.applyBoost();
      const coinReward = BALANCE.coinTaskBase + eff.coinTaskBonus + BALANCE.coinTaskPerDiff * task.difficulty;
      addCoins(coinReward);
      emit('toast', charged > 0
        ? { icon: 'bolt', text: `+${charged} Akku und +${coinReward} Münzen!` }
        : { icon: 'coin', text: `+${coinReward} Münzen!` });
    },
  });
}

function openObstacleTask(key) {
  const o = game.garden.obstacles.get(key);
  if (!o) return;
  const def = OBSTACLES[o.type];
  openTask({
    difficulty: def.diff,
    rewardHtml: `${icon(def.extra ? 'flower' : 'cone')} ${def.label} entfernen · ${icon('coin')} +${def.reward} Münzen`,
    onCorrect() { game.clearObstacle(key); },
  });
}

// ---------- Canvas-Eingabe ----------

function initCanvasInput() {
  const canvas = els.canvas;

  const hitObstacle = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    // Hindernis-Grafiken ragen über die Kachel hinaus: auch leicht
    // nach unten versetzte Punkte testen, damit Tippen auf die Grafik trifft.
    for (const dy of [0, 10, 20]) {
      const { c, r } = game.renderer.screenToGrid(clientX - rect.left, clientY - rect.top + dy);
      const key = game.garden.obstacleKeyAt(c, r);
      if (key) return key;
    }
    return null;
  };

  const hitPlus = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    return game.renderer.plusAt(clientX - rect.left, clientY - rect.top);
  };

  canvas.addEventListener('click', (e) => {
    const key = hitObstacle(e.clientX, e.clientY);
    if (key) { openObstacleTask(key); return; }
    const side = hitPlus(e.clientX, e.clientY);
    if (side) openExpansionDialog(side);
  });

  canvas.addEventListener('mousemove', (e) => {
    const hit = hitObstacle(e.clientX, e.clientY) || hitPlus(e.clientX, e.clientY);
    canvas.style.cursor = hit ? 'pointer' : 'default';
  });
}

// ---------- Rasen-Erweiterung ----------

function openExpansionDialog(side) {
  const cost = game.expansionCost();
  const isCol = side === 'colStart' || side === 'colEnd';
  const tiles = isCol ? game.garden.rows : game.garden.cols;
  openConfirm({
    title: 'Rasen erweitern',
    html: `<p>Du kaufst eine neue ${isCol ? 'Rasenspalte' : 'Rasenreihe'} mit <b>${tiles} Kacheln</b> an dieser Seite.</p>
      <ul>
        <li><span class="ico">${icon('coin')}</span><span>Kosten: <b>${cost} Münzen</b> – du hast ${state.coins}.</span></li>
        <li><span class="ico">${icon('sprout')}</span><span>Auf neuem Boden wachsen besondere Pflanzen wie Glücksklee, Lavendel und Goldblüten – sie bringen beim Mähen Extra-Münzen!</span></li>
      </ul>`,
    okHtml: `${icon('coin')}<span>Für ${cost} Münzen kaufen</span>`,
    okDisabled: state.coins < cost,
    onOk: () => game.expandGarden(side),
  });
}

// ---------- Bestätigungs-Modal ----------

let confirmOnOk = null;

function initConfirmModal() {
  const modal = document.getElementById('confirm-modal');
  const hide = () => { modal.classList.add('hidden'); confirmOnOk = null; };
  document.getElementById('confirm-close').addEventListener('click', hide);
  document.getElementById('confirm-cancel').addEventListener('click', hide);
  modal.addEventListener('click', (e) => { if (e.target === modal) hide(); });
  document.getElementById('confirm-ok').addEventListener('click', () => {
    const fn = confirmOnOk;
    hide();
    fn?.();
  });
}

function openConfirm({ title, html, okHtml, okDisabled = false, onOk }) {
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-body').innerHTML = html;
  const ok = document.getElementById('confirm-ok');
  ok.innerHTML = okHtml;
  ok.disabled = okDisabled;
  confirmOnOk = onOk;
  document.getElementById('confirm-modal').classList.remove('hidden');
}

// ---------- Info-Modale ----------

function initInfoModal() {
  document.getElementById('info-close').addEventListener('click', hideInfo);
  document.getElementById('info-modal').addEventListener('click', (e) => {
    if (e.target.id === 'info-modal') hideInfo();
  });
}

function hideInfo() {
  document.getElementById('info-modal').classList.add('hidden');
}

function showInfo(title, html) {
  document.getElementById('info-title').textContent = title;
  document.getElementById('info-body').innerHTML = html;
  document.getElementById('info-modal').classList.remove('hidden');
}

function showHelp() {
  showInfo('So funktioniert’s', `<ul>
    <li><span class="ico">${icon('robot')}</span><span>Dein Mähroboter mäht den Rasen automatisch – starte ihn mit dem ▶-Button. Beim Anhalten fährt er von selbst zur Ladestation zurück.</span></li>
    <li><span class="ico">${icon('battery')}</span><span>Beim Mähen leert sich der Akku. An der Ladestation lädt er wieder auf.</span></li>
    <li><span class="ico">${icon('bolt')}</span><span>Mathe-Boost: Löse Aufgaben, um den Akku schneller zu laden und Münzen zu verdienen.</span></li>
    <li><span class="ico">${icon('cone')}</span><span>Ab und zu tauchen Hindernisse und Extras im Garten auf – tippe sie an und entferne sie mit einer Aufgabe.</span></li>
    <li><span class="ico">${icon('book')}</span><span>Im Lernheft (Buch-Symbol) findest du zu jedem Thema eine ausführliche Erklärung – und kannst gezielt üben.</span></li>
    <li><span class="ico">${icon('plus')}</span><span>Tippe auf die grauen Plus-Felder am Rand, um deinen Rasen zu vergrößern. Auf neuem Boden wachsen wertvolle Pflanzen – reife Pflanzen leuchten und bringen beim Mähen Extra-Münzen.</span></li>
    <li><span class="ico">${icon('blade')}</span><span>In der Werkstatt verbesserst du Geschwindigkeit, Mähbreite, Akku &amp; Co.</span></li>
  </ul>`);
}

function showObstacleInfo() {
  const obstacles = [...game.garden.obstacles.values()];
  if (!obstacles.length) {
    showInfo('Alles ruhig im Garten', '<p>Gerade gibt es keine Hindernisse. Sie tauchen mit der Zeit von selbst auf – du bekommst dann eine Nachricht.</p>');
    return;
  }
  const items = obstacles
    .map((o) => `<li><span class="ico">${icon(OBSTACLES[o.type].extra ? 'flower' : 'cone')}</span><span><b>${OBSTACLES[o.type].label}</b> – antippen und mit einer Aufgabe entfernen (+${OBSTACLES[o.type].reward} Münzen)</span></li>`)
    .join('');
  showInfo('Im Garten entdeckt', `<ul>${items}</ul>`);
}
