// ============================================================
// Hindernis-/Extra-Registry.
// Neue Typen: Eintrag ergänzen (label, weight, reward, diff, draw).
// draw() zeichnet prozedural – kann später durch Sprites ersetzt
// werden (einfach draw() austauschen).
// ============================================================

function mulberry(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export const OBSTACLES = {
  rock: {
    id: 'rock', label: 'Felsbrocken', weight: 3, reward: 25, diff: 2, blocking: true,
    draw(ctx, x, y, s, seed) {
      const rng = mulberry(seed);
      const stones = 3 + Math.floor(rng() * 3);
      for (let i = 0; i < stones; i++) {
        const ox = (rng() - 0.5) * 30 * s, oy = (rng() - 0.5) * 13 * s;
        const r = (6 + rng() * 7) * s;
        ctx.fillStyle = ['#9aa3ad', '#8a939e', '#a8b1bb'][i % 3];
        ctx.beginPath();
        ctx.ellipse(x + ox, y + oy - r * 0.4, r, r * 0.78, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.beginPath();
        ctx.ellipse(x + ox - r * 0.3, y + oy - r * 0.75, r * 0.35, r * 0.22, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(40,50,60,0.25)';
        ctx.beginPath();
        ctx.ellipse(x + ox, y + oy + r * 0.25, r * 0.9, r * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },

  bush: {
    id: 'bush', label: 'Wilder Busch', weight: 3, reward: 22, diff: 2, blocking: true,
    draw(ctx, x, y, s, seed) {
      const rng = mulberry(seed);
      ctx.fillStyle = 'rgba(30,60,20,0.28)';
      ctx.beginPath();
      ctx.ellipse(x, y + 3 * s, 17 * s, 6 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      const blobs = 5 + Math.floor(rng() * 3);
      for (let i = 0; i < blobs; i++) {
        const ox = (rng() - 0.5) * 26 * s, oy = -(rng() * 14) * s;
        const r = (7 + rng() * 6) * s;
        ctx.fillStyle = ['#2f7a24', '#39902c', '#2a6d20'][i % 3];
        ctx.beginPath();
        ctx.arc(x + ox, y + oy - 4 * s, r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = 'rgba(140,220,90,0.7)';
        ctx.fillRect(x + (rng() - 0.5) * 26 * s, y - (rng() * 20 + 2) * s, 2 * s, 2 * s);
      }
    },
  },

  stump: {
    id: 'stump', label: 'Baumstumpf', weight: 2, reward: 30, diff: 3, blocking: true,
    draw(ctx, x, y, s, seed) {
      const rng = mulberry(seed);
      const w = 13 * s, h = 12 * s;
      ctx.fillStyle = 'rgba(60,40,20,0.25)';
      ctx.beginPath();
      ctx.ellipse(x, y + 3 * s, w * 1.25, 5.5 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7a5230';
      ctx.beginPath();
      ctx.ellipse(x, y, w, w * 0.5, 0, 0, Math.PI);
      ctx.rect(x - w, y - h, w * 2, h);
      ctx.fill();
      ctx.fillStyle = '#a8794e';
      ctx.beginPath();
      ctx.ellipse(x, y - h, w, w * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#8a6038';
      ctx.lineWidth = 1.5 * s;
      for (let i = 1; i <= 2; i++) {
        ctx.beginPath();
        ctx.ellipse(x, y - h, w * (i / 3), w * 0.5 * (i / 3), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (rng() > 0.4) {
        ctx.fillStyle = '#39902c';
        ctx.beginPath();
        ctx.arc(x + w * 0.7, y - h - 2 * s, 3.5 * s, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },

  flowers: {
    id: 'flowers', label: 'Blumen-Extra', weight: 1.5, reward: 45, diff: 2, blocking: false, extra: true,
    draw(ctx, x, y, s, seed) {
      const rng = mulberry(seed);
      for (let i = 0; i < 7; i++) {
        const ox = (rng() - 0.5) * 34 * s, oy = (rng() - 0.5) * 15 * s;
        const r = 3.2 * s;
        ctx.strokeStyle = '#3f8f2e';
        ctx.lineWidth = 1.4 * s;
        ctx.beginPath();
        ctx.moveTo(x + ox, y + oy);
        ctx.lineTo(x + ox, y + oy - 6 * s);
        ctx.stroke();
        for (let p = 0; p < 5; p++) {
          const ang = (p / 5) * Math.PI * 2;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x + ox + Math.cos(ang) * r, y + oy - 6 * s + Math.sin(ang) * r * 0.8, r * 0.62, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#f5c518';
        ctx.beginPath();
        ctx.arc(x + ox, y + oy - 6 * s, r * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
};

export function pickObstacleType() {
  const entries = Object.values(OBSTACLES);
  const total = entries.reduce((sum, o) => sum + o.weight, 0);
  let roll = Math.random() * total;
  for (const o of entries) {
    roll -= o.weight;
    if (roll <= 0) return o.id;
  }
  return entries[0].id;
}
