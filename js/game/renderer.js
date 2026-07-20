// ============================================================
// Isometrischer Canvas-Renderer im Pixel-Gras-Stil.
// Kachel-Sprites werden einmalig prozedural vorgerendert
// (5 Wuchsstufen × 2 Grundtöne × 3 Varianten) und dann geblittet.
// ============================================================

import { TILE_W, TILE_H, TILE_DEPTH, SPRITE_TOP, BALANCE } from '../config.js';
import { OBSTACLES } from './obstacles.js';
import { PLANTS } from './plants.js';

const TW2 = TILE_W / 2;
const TH2 = TILE_H / 2;
const SPRITE_H = SPRITE_TOP + TILE_H + TILE_DEPTH;

function mulberry(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Farbpaletten (angelehnt an klassisches Pixel-Gras)
const BASE_MOWED = ['#b9e158', '#abd94c'];               // Schachbrett-Töne frisch gemäht
const BASE_STAGE = [null, null, '#8ccb45', '#7ec13f', '#72b53a'];
const BLADES = ['#5da832', '#6fbe3a', '#8ed44a', '#a5e455', '#4c9629'];
const TIPS = '#d9f077';
const SIDE_L = '#6fa938';
const SIDE_R = '#578f2e';

const BLADE_COUNT = [0, 8, 18, 32, 48];
const BLADE_HEIGHT = [0, 5, 9, 15, 21];

function diamondPath(ctx, cx, top) {
  ctx.beginPath();
  ctx.moveTo(cx, top);
  ctx.lineTo(cx + TW2, top + TH2);
  ctx.lineTo(cx, top + TILE_H);
  ctx.lineTo(cx - TW2, top + TH2);
  ctx.closePath();
}

function makeTileSprite(stage, tone, variant) {
  const cv = document.createElement('canvas');
  cv.width = TILE_W;
  cv.height = SPRITE_H;
  const ctx = cv.getContext('2d');
  const rng = mulberry(stage * 977 + tone * 131 + variant * 71 + 12345);
  const cx = TILE_W / 2;
  const top = SPRITE_TOP;

  // Seitenflächen (Kachel-"Dicke")
  ctx.fillStyle = SIDE_L;
  ctx.beginPath();
  ctx.moveTo(cx - TW2, top + TH2);
  ctx.lineTo(cx, top + TILE_H);
  ctx.lineTo(cx, top + TILE_H + TILE_DEPTH);
  ctx.lineTo(cx - TW2, top + TH2 + TILE_DEPTH);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = SIDE_R;
  ctx.beginPath();
  ctx.moveTo(cx, top + TILE_H);
  ctx.lineTo(cx + TW2, top + TH2);
  ctx.lineTo(cx + TW2, top + TH2 + TILE_DEPTH);
  ctx.lineTo(cx, top + TILE_H + TILE_DEPTH);
  ctx.closePath();
  ctx.fill();

  // Deckfläche
  ctx.fillStyle = stage < 2 ? BASE_MOWED[tone] : BASE_STAGE[stage];
  diamondPath(ctx, cx, top);
  ctx.fill();

  // Punkt-Textur
  diamondPath(ctx, cx, top);
  ctx.save();
  ctx.clip();
  for (let i = 0; i < 26; i++) {
    const s = rng(), t = rng();
    const px = cx + (s - t) * TW2;
    const py = top + (s + t) * TH2;
    ctx.fillStyle = rng() < 0.5 ? 'rgba(255,255,220,0.22)' : 'rgba(30,80,20,0.14)';
    ctx.fillRect(px, py, 2, 1);
  }
  // vereinzelte Blümchen auf gemähtem Rasen
  if (stage === 0 && variant === 2) {
    for (let i = 0; i < 3; i++) {
      const s = 0.2 + rng() * 0.6, t = 0.2 + rng() * 0.6;
      ctx.fillStyle = '#f7f19a';
      ctx.fillRect(cx + (s - t) * TW2, top + (s + t) * TH2, 2, 2);
    }
  }
  ctx.restore();

  // Grashalme
  const count = BLADE_COUNT[stage];
  const height = BLADE_HEIGHT[stage];
  for (let i = 0; i < count; i++) {
    const s = 0.07 + rng() * 0.86;
    const t = 0.07 + rng() * 0.86;
    const px = cx + (s - t) * TW2 * 0.94;
    const py = top + (s + t) * TH2 * 0.94 + 1;
    const bh = height * (0.6 + rng() * 0.8);
    const lean = (rng() - 0.5) * 7;
    ctx.strokeStyle = BLADES[Math.floor(rng() * BLADES.length)];
    ctx.lineWidth = rng() < 0.5 ? 1.4 : 2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(px + lean * 0.4, py - bh * 0.6, px + lean, py - bh);
    ctx.stroke();
    if (rng() < 0.35) {
      ctx.fillStyle = TIPS;
      ctx.fillRect(px + lean - 1, py - bh - 1, 2, 2);
    }
  }

  // Büschel bei sehr hohem Gras
  if (stage === 4) {
    for (let b = 0; b < 3; b++) {
      const s = 0.2 + rng() * 0.6, t = 0.2 + rng() * 0.6;
      const px = cx + (s - t) * TW2 * 0.9;
      const py = top + (s + t) * TH2 * 0.9;
      for (let f = -2; f <= 2; f++) {
        ctx.strokeStyle = BLADES[Math.floor(rng() * 3)];
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.quadraticCurveTo(px + f * 2.4, py - 14, px + f * 4.5, py - 22 - rng() * 4);
        ctx.stroke();
      }
    }
  }
  return cv;
}

function stageForHeight(h) {
  if (h < 0.15) return 0;
  if (h < 0.35) return 1;
  if (h < 0.6) return 2;
  if (h < 0.85) return 3;
  return 4;
}

export class Renderer {
  constructor(canvas, garden, mower, game) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.garden = garden;
    this.mower = mower;
    this.game = game;
    this.scale = 1;
    this.ox = 0;
    this.oy = 0;
    this.dpr = 1;
    this.lastScreenAngle = 0;
    this.floats = []; // schwebende "+X"-Texte (Ernte-Feedback)

    this.sprites = {};
    for (let stage = 0; stage <= 4; stage++) {
      for (let tone = 0; tone <= 1; tone++) {
        for (let v = 0; v <= 2; v++) {
          this.sprites[`${stage}-${tone}-${v}`] = makeTileSprite(stage, tone, v);
        }
      }
    }

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement);
    this.resize();
  }

  resize() {
    const rect = this.cv.parentElement.getBoundingClientRect();
    if (rect.width < 5 || rect.height < 5) return;
    this.dpr = Math.min(2.5, window.devicePixelRatio || 1);
    this.cv.width = Math.round(rect.width * this.dpr);
    this.cv.height = Math.round(rect.height * this.dpr);

    // Weltgröße dynamisch aus der aktuellen Gartengröße; Rand-Padding
    // lässt Platz für die Plus-Felder außerhalb des Rasens.
    const g = this.garden;
    const padX = TILE_W * 1.5;
    const padY = TILE_H * 1.3;
    const worldW = (g.cols + g.rows) * TW2 + padX * 2;
    const worldH = (g.cols + g.rows) * TH2 + SPRITE_TOP + TILE_DEPTH + 6 + padY * 2;
    this.scale = Math.min(this.cv.width / worldW, this.cv.height / worldH) * 0.99;
    // Welt-Ursprung: Kachelmitte (0,0) liegt bei wx=0, wy=0
    this.ox = (this.cv.width - worldW * this.scale) / 2 + (g.rows * TW2 + padX) * this.scale;
    this.oy = (this.cv.height - worldH * this.scale) / 2 + (TH2 + SPRITE_TOP + padY) * this.scale;
  }

  worldPos(c, r) { return [(c - r) * TW2, (c + r) * TH2]; }
  toScreen(wx, wy) { return [this.ox + wx * this.scale, this.oy + wy * this.scale]; }

  // CSS-Pixel → Garten-Koordinaten
  screenToGrid(px, py) {
    const x = (px * this.dpr - this.ox) / this.scale;
    const y = (py * this.dpr - this.oy) / this.scale;
    return { c: (x / TW2 + y / TH2) / 2, r: (y / TH2 - x / TW2) / 2 };
  }

  render(nowMs) {
    const { ctx, cv, garden, scale } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.imageSmoothingEnabled = false;

    // Weicher Schatten unter dem gesamten Rasen-Block
    const [swx, swy] = this.toScreen(...this.worldPos((garden.cols - 1) / 2, (garden.rows - 1) / 2));
    ctx.fillStyle = 'rgba(16,27,44,0.10)';
    ctx.beginPath();
    ctx.ellipse(swx, swy + 26 * scale, (garden.cols + garden.rows) * TW2 * 0.5 * scale, (garden.cols + garden.rows) * TH2 * 0.42 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Kacheln (Reihenfolge = Malerprinzip: hinten → vorne)
    const dw = TILE_W * scale;
    const dh = SPRITE_H * scale;
    for (let r = 0; r < garden.rows; r++) {
      for (let c = 0; c < garden.cols; c++) {
        const stage = stageForHeight(garden.heightAt(c, r));
        const tone = (c + r) % 2;
        const v = (c * 7 + r * 13) % 3;
        const [wx, wy] = this.worldPos(c, r);
        const [sx, sy] = this.toScreen(wx - TW2, wy - TH2 - SPRITE_TOP);
        ctx.drawImage(this.sprites[`${stage}-${tone}-${v}`], sx, sy, dw, dh);
      }
    }

    this.drawDock(nowMs);

    // Entities nach Tiefe sortiert zeichnen
    const entities = [...garden.obstacles.values()].map((o) => ({
      depth: o.c + o.r,
      draw: () => this.drawObstacle(o, nowMs),
    }));
    for (const p of garden.plants.values()) {
      entities.push({ depth: p.c + p.r - 0.01, draw: () => this.drawPlant(p, nowMs) });
    }
    entities.push({ depth: this.mower.c + this.mower.r + 0.01, draw: () => this.drawMower(nowMs) });
    entities.sort((a, b) => a.depth - b.depth);
    entities.forEach((e) => e.draw());

    this.drawPlusButtons(nowMs);
    this.drawFloats(nowMs);
  }

  // ---------- Sonderpflanzen ----------

  drawPlant(p, nowMs) {
    const { ctx, scale } = this;
    const [wx, wy] = this.worldPos(p.c, p.r);
    const [sx, sy] = this.toScreen(wx, wy);
    // Reife Pflanzen leuchten sanft: "jetzt ernten!"
    if (p.growth >= 1) {
      const pulse = 0.22 + 0.1 * Math.sin(nowMs / 300 + p.seed);
      ctx.fillStyle = `rgba(246,201,66,${pulse})`;
      ctx.beginPath();
      ctx.ellipse(sx, sy, TW2 * 0.55 * scale, TH2 * 0.55 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    PLANTS[p.type]?.draw(ctx, sx, sy, scale, p.seed, p.growth, nowMs);
  }

  // ---------- Plus-Felder (Rasen-Erweiterung) ----------

  plusButtons() {
    const g = this.garden;
    const btns = [];
    if (g.cols < BALANCE.expansion.maxCols) {
      btns.push({ side: 'colStart', c: -1.25, r: (g.rows - 1) / 2 });
      btns.push({ side: 'colEnd', c: g.cols + 0.25, r: (g.rows - 1) / 2 });
    }
    if (g.rows < BALANCE.expansion.maxRows) {
      btns.push({ side: 'rowStart', c: (g.cols - 1) / 2, r: -1.25 });
      btns.push({ side: 'rowEnd', c: (g.cols - 1) / 2, r: g.rows + 0.25 });
    }
    return btns;
  }

  // Gemeinsame Maße für Zeichnen und Trefferprüfung.
  // Wichtig: Mindestgrößen in Gerätepixeln, damit das Plus auch auf
  // kleinen Bildschirmen klar als Plus lesbar bleibt (und nicht die
  // schrägen Rautenkanten als "×" dominieren).
  plusMetrics() {
    const arm = Math.max(7.5 * this.scale, 5.5 * this.dpr);
    return {
      arm,
      halfW: Math.max(TW2 * 0.74 * this.scale, arm * 2.2),
      halfH: Math.max(TH2 * 0.74 * this.scale, arm * 1.5),
      hitR: Math.max(TILE_W * 0.42 * this.scale, arm * 3),
    };
  }

  // Trefferprüfung in CSS-Pixeln relativ zum Canvas
  plusAt(px, py) {
    const { hitR } = this.plusMetrics();
    for (const b of this.plusButtons()) {
      const [wx, wy] = this.worldPos(b.c, b.r);
      const [sx, sy] = this.toScreen(wx, wy);
      if (Math.hypot(px * this.dpr - sx, py * this.dpr - sy) < hitR) return b.side;
    }
    return null;
  }

  drawPlusButtons(nowMs) {
    const { ctx, scale } = this;
    const { arm, halfW, halfH } = this.plusMetrics();
    for (const b of this.plusButtons()) {
      const [wx, wy] = this.worldPos(b.c, b.r);
      let [sx, sy] = this.toScreen(wx, wy);
      sy += Math.sin(nowMs / 480 + b.c + b.r) * 2.2 * scale;

      // Schatten
      ctx.fillStyle = 'rgba(16,27,44,0.08)';
      ctx.beginPath();
      ctx.ellipse(sx, sy + halfH * 0.85, halfW * 0.7, halfH * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hellgraue Geister-Kachel
      ctx.fillStyle = '#e7ebef';
      ctx.strokeStyle = '#c7ced6';
      ctx.lineWidth = Math.max(1.7 * scale, 1.2 * this.dpr);
      ctx.beginPath();
      ctx.moveTo(sx, sy - halfH);
      ctx.lineTo(sx + halfW, sy);
      ctx.lineTo(sx, sy + halfH);
      ctx.lineTo(sx - halfW, sy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Dunkelgraues Plus: klar achsenparallel, gleich lange Arme
      ctx.strokeStyle = '#4e5e73';
      ctx.lineWidth = Math.max(3.4 * scale, 2.6 * this.dpr);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sx - arm, sy);
      ctx.lineTo(sx + arm, sy);
      ctx.moveTo(sx, sy - arm);
      ctx.lineTo(sx, sy + arm);
      ctx.stroke();
    }
  }

  // ---------- Schwebende Texte (Ernte-Feedback) ----------

  addFloat(c, r, text, color = '#c07f00') {
    this.floats.push({ c, r, text, color, born: performance.now() });
  }

  drawFloats(nowMs) {
    const { ctx, scale } = this;
    this.floats = this.floats.filter((f) => nowMs - f.born < 1200);
    if (!this.floats.length) return;
    ctx.textAlign = 'center';
    ctx.font = `800 ${Math.max(13 * this.dpr, 15 * scale)}px -apple-system, "Segoe UI", Roboto, sans-serif`;
    for (const f of this.floats) {
      const t = (nowMs - f.born) / 1200;
      const [wx, wy] = this.worldPos(f.c, f.r);
      const [sx, sy] = this.toScreen(wx, wy);
      const yy = sy - (14 + t * 28) * scale;
      ctx.globalAlpha = 1 - t * t;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 3.5 * scale;
      ctx.strokeText(f.text, sx, yy);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, sx, yy);
    }
    ctx.globalAlpha = 1;
  }

  drawDock(nowMs) {
    const { ctx, scale } = this;
    const [wx, wy] = this.worldPos(this.garden.dock.c, this.garden.dock.r);
    const [sx, sy] = this.toScreen(wx, wy);
    const u = scale;

    // Lade-Pad (flaches Iso-Feld)
    ctx.fillStyle = '#eef1f4';
    ctx.strokeStyle = '#cfd6de';
    ctx.lineWidth = 2 * u;
    ctx.beginPath();
    ctx.moveTo(sx, sy - TH2 * 0.82 * u);
    ctx.lineTo(sx + TW2 * 0.82 * u, sy);
    ctx.lineTo(sx, sy + TH2 * 0.82 * u);
    ctx.lineTo(sx - TW2 * 0.82 * u, sy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Stations-Block an der Rückseite
    ctx.fillStyle = '#f7f9fa';
    ctx.strokeStyle = '#d5dbe2';
    ctx.lineWidth = 1.5 * u;
    const bw = 17 * u, bh = 11 * u;
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(sx - bw / 2, sy - TH2 * 0.82 * u - bh + 2 * u, bw, bh, 3 * u)
      : ctx.rect(sx - bw / 2, sy - TH2 * 0.82 * u - bh + 2 * u, bw, bh);
    ctx.fill();
    ctx.stroke();

    // Status-LED
    const charging = this.game.mode === 'CHARGING';
    const pulse = charging ? 0.55 + 0.45 * Math.sin(nowMs / 280) : 1;
    ctx.fillStyle = charging ? `rgba(34,197,94,${pulse})` : '#22c55e';
    ctx.beginPath();
    ctx.arc(sx, sy - TH2 * 0.82 * u - bh / 2 + 2 * u, 2.4 * u, 0, Math.PI * 2);
    ctx.fill();

    // Lade-Ring
    if (charging) {
      ctx.strokeStyle = `rgba(34,197,94,${0.5 * pulse})`;
      ctx.lineWidth = 2.5 * u;
      ctx.beginPath();
      ctx.ellipse(sx, sy, (TW2 * 0.95 + 4 * Math.sin(nowMs / 350)) * u, (TH2 * 0.95 + 2 * Math.sin(nowMs / 350)) * u, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawObstacle(o, nowMs) {
    const { ctx, scale } = this;
    const [wx, wy] = this.worldPos(o.c, o.r);
    const [sx, sy] = this.toScreen(wx, wy);

    // Pulsierender Hinweis-Ring: "hier antippen"
    const pulse = 0.3 + 0.18 * Math.sin(nowMs / 320 + o.seed);
    ctx.strokeStyle = o.type === 'flowers' ? `rgba(245,183,10,${pulse})` : `rgba(255,255,255,${pulse})`;
    ctx.lineWidth = 2.4 * scale;
    ctx.beginPath();
    ctx.ellipse(sx, sy, TW2 * 0.72 * scale, TH2 * 0.72 * scale, 0, 0, Math.PI * 2);
    ctx.stroke();

    OBSTACLES[o.type]?.draw(ctx, sx, sy, scale, o.seed);
  }

  drawMower(nowMs) {
    const { ctx, scale } = this;
    const m = this.mower;
    const [wx, wy] = this.worldPos(m.c, m.r);
    const [sx, sy] = this.toScreen(wx, wy);
    const u = scale;
    const moving = this.game.mode === 'MOWING' || this.game.mode === 'RETURNING';

    if (moving) {
      const dxs = (Math.cos(m.angle) - Math.sin(m.angle)) * TW2;
      const dys = (Math.cos(m.angle) + Math.sin(m.angle)) * TH2;
      this.lastScreenAngle = Math.atan2(dys, dxs);
    }

    // Schatten
    ctx.fillStyle = 'rgba(16,27,44,0.22)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + 2 * u, 17 * u, 8 * u, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(sx, sy - 4 * u);
    ctx.rotate(this.lastScreenAngle);
    ctx.scale(u, u * 0.78); // leichte Iso-Stauchung

    const L = 30, W = 19;
    const rr = (x, y, w, h, r) => {
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
      else { ctx.beginPath(); ctx.rect(x, y, w, h); }
    };

    // Räder
    ctx.fillStyle = '#26313f';
    rr(-L / 2 - 1, -W / 2 - 2.5, 11, 5, 2.5); ctx.fill();
    rr(-L / 2 - 1, W / 2 - 2.5, 11, 5, 2.5); ctx.fill();

    // Karosserie
    ctx.fillStyle = '#f6f8f9';
    ctx.strokeStyle = '#c9d1da';
    ctx.lineWidth = 1.6;
    rr(-L / 2, -W / 2, L, W, 8); ctx.fill(); ctx.stroke();

    // Front-Stoßfänger
    ctx.fillStyle = '#3c4b5e';
    rr(L / 2 - 6, -W / 2 + 1.5, 5.5, W - 3, [0, 6, 6, 0]); ctx.fill();

    // Gelber Akzentstreifen
    ctx.fillStyle = '#f5c518';
    rr(-2, -W / 2, 3.5, 3, 1); ctx.fill();
    rr(-2, W / 2 - 3, 3.5, 3, 1); ctx.fill();

    // Lüftungsschlitz
    ctx.fillStyle = '#2b3546';
    rr(-L / 2 + 5, -2, 9, 4, 2); ctx.fill();

    // Status-LED
    const mode = this.game.mode;
    let led = '#9aa7b8';
    if (mode === 'CHARGING') led = `rgba(34,197,94,${0.5 + 0.5 * Math.sin(nowMs / 250)})`;
    else if (mode === 'MOWING') led = '#22c55e';
    else if (mode === 'RETURNING') led = '#f5b70a';
    else if (mode === 'EMPTY') led = `rgba(239,68,68,${0.4 + 0.6 * Math.abs(Math.sin(nowMs / 300))})`;
    ctx.fillStyle = led;
    ctx.beginPath();
    ctx.arc(L / 2 - 9.5, 0, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Mäh-Partikel
    if (mode === 'MOWING') {
      const rng = mulberry(Math.floor(nowMs / 90));
      ctx.fillStyle = 'rgba(120,190,60,0.8)';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(sx + (rng() - 0.5) * 34 * u, sy + (rng() * 8 + 2) * u, 2.2 * u, 2.2 * u);
      }
    }
  }
}
