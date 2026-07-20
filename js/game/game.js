// ============================================================
// Spiel-Controller: verbindet Garten, Mäher, Akku und Modi.
// Modi: IDLE → MOWING → RETURNING → CHARGING (→ MOWING) | EMPTY
// ============================================================

import { BALANCE } from '../config.js';
import { state, addCoins, bumpStat, persist } from '../core/state.js';
import { emit } from '../core/events.js';
import { Garden } from './garden.js';
import { Mower } from './mower.js';
import { Renderer } from './renderer.js';
import { getEffects } from './upgrades.js';
import { OBSTACLES } from './obstacles.js';

export const game = {
  garden: null,
  mower: null,
  renderer: null,
  mode: 'IDLE',
  userWantsMow: false,
  lawnClearAwarded: false,

  effects() { return getEffects(state.upgrades); },

  init(canvas, savedGarden) {
    this.garden = new Garden(savedGarden);
    this.mower = new Mower(this.garden.dock);
    this.renderer = new Renderer(canvas, this.garden, this.mower, this);
    const eff = this.effects();
    state.battery = Math.min(state.battery, eff.batteryMax);
    this.mode = 'IDLE';
    emit('mode', this.mode);
    emit('battery');
  },

  setMode(m) {
    if (this.mode !== m) {
      this.mode = m;
      emit('mode', m);
    }
  },

  drain(dt, factor) {
    state.battery = Math.max(0, state.battery - BALANCE.drainPerSec * factor * dt);
    emit('battery');
    if (state.battery <= 0) this.setMode('EMPTY');
  },

  update(dt, nowMs) {
    if (!this.garden) return;
    const nowSec = nowMs / 1000;
    const eff = this.effects();
    this.garden.update(dt, nowSec);

    switch (this.mode) {
      case 'MOWING': {
        this.mower.wander(dt, eff.speed, this.garden);
        const { cut, harvest } = this.garden.mowCircle(this.mower.c, this.mower.r, eff.mowRadius);
        if (cut) {
          addCoins(cut * BALANCE.coinPerTile);
          bumpStat('tilesMowed', cut);
        }
        for (const plant of harvest) {
          addCoins(plant.coins);
          bumpStat('plantsHarvested');
          this.renderer.addFloat(plant.c, plant.r, `+${plant.coins}`);
        }
        this.drain(dt, 1);
        if (this.mode !== 'MOWING') break;
        if (state.battery <= eff.batteryMax * BALANCE.lowBattery) {
          this.setMode('RETURNING');
        } else if (!this.lawnClearAwarded && this.garden.tallCount() === 0) {
          this.lawnClearAwarded = true;
          addCoins(BALANCE.lawnBonus);
          bumpStat('lawnsCompleted');
          emit('toast', { icon: 'trophy', text: `Alles gemäht! Bonus: +${BALANCE.lawnBonus} Münzen` });
          this.setMode('RETURNING');
        }
        break;
      }
      case 'RETURNING': {
        const { c, r } = this.garden.dock;
        this.mower.seek(dt, eff.speed * 1.05, c, r, this.garden);
        this.drain(dt, BALANCE.returnDrainFactor);
        if (this.mode === 'RETURNING' && this.mower.distTo(c, r) < 0.22) {
          this.mower.snap(c, r);
          this.setMode('CHARGING');
        }
        break;
      }
      case 'CHARGING': {
        state.battery = Math.min(eff.batteryMax, state.battery + eff.chargePerSec * dt);
        emit('battery');
        if (state.battery >= eff.batteryMax - 0.01) {
          if (this.userWantsMow && this.garden.tallCount() > 6) {
            this.lawnClearAwarded = false;
            this.setMode('MOWING');
          } else {
            this.setMode('IDLE');
          }
        }
        break;
      }
    }

    // Bonus wieder freischalten, sobald genug nachgewachsen ist
    if (this.lawnClearAwarded && this.garden.tallCount() > this.garden.total * 0.3) {
      this.lawnClearAwarded = false;
    }
  },

  // Haupt-Button: ▶ startet, ⏸ schickt den Mäher heim zur Ladestation
  toggleMain() {
    switch (this.mode) {
      case 'MOWING':
        // Anhalten = automatisch zur Ladestation zurückfahren und dort laden
        this.userWantsMow = false;
        this.setMode('RETURNING');
        break;
      case 'RETURNING': {
        // Unterwegs erneut gedrückt: weitermähen (wenn der Akku es hergibt)
        const eff = this.effects();
        if (state.battery > eff.batteryMax * (BALANCE.lowBattery + 0.05)) {
          this.userWantsMow = true;
          this.lawnClearAwarded = false;
          this.setMode('MOWING');
        } else {
          emit('toast', { icon: 'battery', text: 'Akku zu niedrig – der Mäher lädt erst an der Station.' });
        }
        break;
      }
      case 'IDLE': {
        this.userWantsMow = true;
        this.lawnClearAwarded = false;
        if (this.garden.tallCount() === 0) {
          emit('toast', { icon: 'sprout', text: 'Frisch gemäht! Das Gras wächst gerade nach.' });
        }
        this.setMode('MOWING');
        break;
      }
      case 'CHARGING': {
        const eff = this.effects();
        if (state.battery >= eff.batteryMax * BALANCE.minStartCharge) {
          this.userWantsMow = true;
          this.lawnClearAwarded = false;
          this.setMode('MOWING');
        } else {
          emit('toast', { icon: 'bolt', text: `Noch zu wenig Akku – ab ${Math.round(BALANCE.minStartCharge * 100)} % kann der Mäher starten. Tipp: Mathe-Boost!` });
        }
        break;
      }
      case 'EMPTY':
        emit('request-boost');
        break;
    }
  },

  // Akku-Bonus nach gelöster Aufgabe. Liefert tatsächlich geladene Punkte.
  applyBoost() {
    const eff = this.effects();
    const before = state.battery;
    state.battery = Math.min(eff.batteryMax, state.battery + eff.taskCharge);
    emit('battery');
    if (this.mode === 'EMPTY') this.setMode('RETURNING');
    return Math.round(state.battery - before);
  },

  // ---------- Rasen-Erweiterung ----------

  expansionCost() {
    const n = this.garden.expansionCount();
    return Math.round(BALANCE.expansion.baseCost * Math.pow(BALANCE.expansion.costFactor, n));
  },

  expandGarden(side) {
    const cost = this.expansionCost();
    if (state.coins < cost) {
      emit('toast', { icon: 'coin', text: `Zu wenig Münzen – die Erweiterung kostet ${cost}.` });
      return false;
    }
    addCoins(-cost);
    const { dc, dr } = this.garden.expand(side);
    this.mower.c += dc;
    this.mower.r += dr;
    this.renderer.resize();
    this.lawnClearAwarded = false;
    bumpStat('expansions');
    emit('toast', { icon: 'sprout', text: 'Rasen erweitert! Auf neuem Boden wachsen besondere Pflanzen.' });
    this.save();
    return true;
  },

  // Hindernis nach gelöster Aufgabe entfernen
  clearObstacle(key) {
    const o = this.garden.obstacles.get(key);
    if (!o) return;
    const def = OBSTACLES[o.type];
    this.garden.removeObstacle(key);
    addCoins(def.reward);
    bumpStat('obstaclesCleared');
    emit('toast', { icon: def.extra ? 'flower' : 'check', text: `${def.label} entfernt: +${def.reward} Münzen` });
  },

  save() {
    if (this.garden) persist(this.garden.serialize());
  },
};
