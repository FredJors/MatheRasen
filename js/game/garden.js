// ============================================================
// Garten-Modell: Kachel-Raster mit Grashöhen (0..1), Hindernisse,
// Sonderpflanzen, Nachwachsen und Rasen-Erweiterung.
// Koordinaten: kontinuierlich, ganze Zahlen = Kachelmittelpunkte.
// Die Größe ist dynamisch – der Spieler kauft neue Reihen/Spalten
// an allen vier Seiten (Plus-Felder). Neue Flächen sind
// "Premium-Boden", auf dem wertvollere Pflanzen wachsen.
// ============================================================

import { GRID, BALANCE } from '../config.js';
import { pickObstacleType } from './obstacles.js';
import { PLANTS, pickPlantType } from './plants.js';
import { emit } from '../core/events.js';

const key = (c, r) => `${c},${r}`;

export class Garden {
  constructor(saved) {
    this.cols = saved?.cols ?? GRID.cols;
    this.rows = saved?.rows ?? GRID.rows;
    this.total = this.cols * this.rows;
    this.dock = saved?.dock ? { ...saved.dock } : { c: 0, r: 0 };
    this.h = new Float32Array(this.total);
    this.obstacles = new Map(); // "c,r" -> { type, c, r, seed }
    this.plants = new Map();    // "c,r" -> { type, c, r, seed, growth }
    this.premium = new Set(saved?.premium ?? []);

    const nowSec = performance.now() / 1000;
    this.spawnAt = nowSec + BALANCE.spawn.firstDelay;
    this.plantSpawnAt = nowSec + BALANCE.plants.minDelay;

    if (saved?.h?.length === this.total) {
      this.h.set(saved.h);
      for (const o of saved.obstacles ?? []) this.obstacles.set(key(o.c, o.r), o);
      for (const p of saved.plants ?? []) this.plants.set(key(p.c, p.r), p);
    } else {
      for (let i = 0; i < this.total; i++) this.h[i] = 0.55 + Math.random() * 0.45;
    }
  }

  idx(c, r) { return r * this.cols + c; }
  inBounds(c, r) { return c >= 0 && r >= 0 && c < this.cols && r < this.rows; }
  heightAt(c, r) { return this.h[this.idx(c, r)]; }

  expansionCount() { return (this.cols - GRID.cols) + (this.rows - GRID.rows); }

  nearDock(c, r, dist = 2.5) {
    return Math.hypot(c - this.dock.c, r - this.dock.r) < dist;
  }

  obstacleKeyAt(cf, rf) {
    const k = key(Math.round(cf), Math.round(rf));
    return this.obstacles.has(k) ? k : null;
  }

  // Befahrbar? (im Feld + keine Hindernis-Kachel)
  walkable(cf, rf) {
    const margin = 0.32;
    if (cf < -margin || rf < -margin || cf > this.cols - 1 + margin || rf > this.rows - 1 + margin) return false;
    return !this.obstacleKeyAt(cf, rf);
  }

  update(dt, nowSec) {
    for (let i = 0; i < this.total; i++) {
      if (this.h[i] < 1) this.h[i] = Math.min(1, this.h[i] + BALANCE.growthPerSec * dt);
    }
    for (const p of this.plants.values()) {
      if (p.growth < 1) p.growth = Math.min(1, p.growth + dt / PLANTS[p.type].growTime);
    }
    if (nowSec >= this.spawnAt) {
      const { minDelay, maxDelay } = BALANCE.spawn;
      this.spawnAt = nowSec + minDelay + Math.random() * (maxDelay - minDelay);
      if (this.obstacles.size < BALANCE.spawn.maxActive) this.spawnObstacle();
    }
    if (nowSec >= this.plantSpawnAt) {
      const { minDelay, maxDelay } = BALANCE.plants;
      this.plantSpawnAt = nowSec + minDelay + Math.random() * (maxDelay - minDelay);
      if (this.plants.size < this.maxPlants()) this.spawnPlant();
    }
  }

  maxPlants() {
    return BALANCE.plants.baseMax + Math.min(8, this.expansionCount());
  }

  freeTile(c, r) {
    const k = key(c, r);
    return !this.obstacles.has(k) && !this.plants.has(k) && !this.nearDock(c, r);
  }

  spawnObstacle() {
    for (let tries = 0; tries < 30; tries++) {
      const c = Math.floor(Math.random() * this.cols);
      const r = Math.floor(Math.random() * this.rows);
      if (!this.freeTile(c, r)) continue;
      const o = { type: pickObstacleType(), c, r, seed: Math.floor(Math.random() * 1e9) };
      this.obstacles.set(key(c, r), o);
      emit('obstacles', this.obstacles.size);
      emit('toast', o.type === 'flowers'
        ? { icon: 'flower', text: 'Ein Blumen-Extra ist im Garten aufgetaucht – antippen lohnt sich!' }
        : { icon: 'cone', text: 'Ein Hindernis ist im Garten aufgetaucht – tippe es an!' });
      return;
    }
  }

  spawnPlant() {
    for (let tries = 0; tries < 40; tries++) {
      const c = Math.floor(Math.random() * this.cols);
      const r = Math.floor(Math.random() * this.rows);
      if (!this.freeTile(c, r)) continue;
      const premium = this.premium.has(key(c, r));
      // Premium-Boden zieht Pflanzen an: normale Kacheln nur mit 45 % Chance
      if (!premium && Math.random() > 0.45) continue;
      const p = { type: pickPlantType(premium), c, r, seed: Math.floor(Math.random() * 1e9), growth: 0 };
      this.plants.set(key(c, r), p);
      return;
    }
  }

  removeObstacle(k) {
    if (this.obstacles.delete(k)) emit('obstacles', this.obstacles.size);
  }

  // Mäht alle Kacheln im Radius. Reife Pflanzen werden geerntet,
  // unreife bleiben stehen (zu klein fürs Mähwerk).
  mowCircle(cf, rf, radius) {
    let cut = 0;
    const harvest = [];
    const cMin = Math.max(0, Math.floor(cf - radius)), cMax = Math.min(this.cols - 1, Math.ceil(cf + radius));
    const rMin = Math.max(0, Math.floor(rf - radius)), rMax = Math.min(this.rows - 1, Math.ceil(rf + radius));
    for (let c = cMin; c <= cMax; c++) {
      for (let r = rMin; r <= rMax; r++) {
        if (this.obstacles.has(key(c, r))) continue;
        const dc = c - cf, dr = r - rf;
        if (dc * dc + dr * dr > radius * radius) continue;
        const i = this.idx(c, r);
        if (this.h[i] > BALANCE.mowMinCut) cut++;
        if (this.h[i] > BALANCE.mowHeight) this.h[i] = BALANCE.mowHeight;
        const plant = this.plants.get(key(c, r));
        if (plant && plant.growth >= 1) {
          harvest.push({ ...plant, coins: PLANTS[plant.type].coins, label: PLANTS[plant.type].label });
          this.plants.delete(key(c, r));
        }
      }
    }
    return { cut, harvest };
  }

  tallCount() {
    let n = 0;
    for (let i = 0; i < this.total; i++) if (this.h[i] > BALANCE.tallThreshold) n++;
    return n;
  }

  // Erweiterung: fügt an einer Seite eine Spalte/Reihe hinzu.
  // Bei colStart/rowStart verschieben sich alle Koordinaten um +1 –
  // der Rückgabewert (dc, dr) sagt dem Aufrufer, was er mitschieben
  // muss (z. B. den Mäher).
  expand(side) {
    const dc = side === 'colStart' ? 1 : 0;
    const dr = side === 'rowStart' ? 1 : 0;
    const newCols = this.cols + (side === 'colStart' || side === 'colEnd' ? 1 : 0);
    const newRows = this.rows + (side === 'rowStart' || side === 'rowEnd' ? 1 : 0);

    const h = new Float32Array(newCols * newRows).fill(-1);
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        h[(r + dr) * newCols + (c + dc)] = this.h[r * this.cols + c];
      }
    }
    for (let i = 0; i < h.length; i++) {
      if (h[i] < 0) h[i] = 0.7 + Math.random() * 0.3; // frisches hohes Gras
    }
    this.h = h;
    this.cols = newCols;
    this.rows = newRows;
    this.total = newCols * newRows;

    const shiftMap = (map) => {
      const next = new Map();
      for (const o of map.values()) {
        o.c += dc;
        o.r += dr;
        next.set(key(o.c, o.r), o);
      }
      return next;
    };
    this.obstacles = shiftMap(this.obstacles);
    this.plants = shiftMap(this.plants);
    this.premium = new Set([...this.premium].map((k) => {
      const [c, r] = k.split(',').map(Number);
      return key(c + dc, r + dr);
    }));
    this.dock.c += dc;
    this.dock.r += dr;

    // Die neue Fläche ist Premium-Boden
    if (side === 'colStart') for (let r = 0; r < newRows; r++) this.premium.add(key(0, r));
    if (side === 'colEnd') for (let r = 0; r < newRows; r++) this.premium.add(key(newCols - 1, r));
    if (side === 'rowStart') for (let c = 0; c < newCols; c++) this.premium.add(key(c, 0));
    if (side === 'rowEnd') for (let c = 0; c < newCols; c++) this.premium.add(key(c, newRows - 1));

    return { dc, dr };
  }

  serialize() {
    return {
      cols: this.cols,
      rows: this.rows,
      dock: { ...this.dock },
      h: Array.from(this.h, (v) => Math.round(v * 100) / 100),
      obstacles: [...this.obstacles.values()],
      plants: [...this.plants.values()].map((p) => ({ ...p, growth: Math.round(p.growth * 100) / 100 })),
      premium: [...this.premium],
    };
  }
}
