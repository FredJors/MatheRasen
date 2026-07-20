// ============================================================
// Sonderpflanzen-Registry.
// Pflanzen wachsen zufällig auf dem Rasen (bevorzugt auf neu
// gekauften Flächen), brauchen Zeit zum Reifen und bringen beim
// Mähen Extra-Münzen. premiumOnly-Arten wachsen NUR auf neuem
// Boden – der Anreiz, den Rasen zu erweitern.
// Neue Arten: Eintrag ergänzen (coins, weight, growTime, draw).
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

export const PLANTS = {
  loewenzahn: {
    id: 'loewenzahn', label: 'Löwenzahn', coins: 4,
    weight: 5, premiumWeight: 3, premiumOnly: false, growTime: 45,
    draw(ctx, x, y, s, seed, growth) {
      const rng = mulberry(seed);
      const g = 0.35 + 0.65 * growth;
      for (let i = 0; i < 3; i++) {
        const ox = (rng() - 0.5) * 18 * s;
        const oy = (rng() - 0.5) * 8 * s;
        const hgt = (8 + rng() * 5) * s * g;
        ctx.strokeStyle = '#4f9432';
        ctx.lineWidth = 1.5 * s;
        ctx.beginPath();
        ctx.moveTo(x + ox, y + oy);
        ctx.lineTo(x + ox + (rng() - 0.5) * 3 * s, y + oy - hgt);
        ctx.stroke();
        ctx.fillStyle = '#f7d21a';
        ctx.beginPath();
        ctx.arc(x + ox, y + oy - hgt, 3.1 * s * g, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e0b400';
        ctx.beginPath();
        ctx.arc(x + ox, y + oy - hgt, 1.3 * s * g, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },

  klee: {
    id: 'klee', label: 'Glücksklee', coins: 8,
    weight: 2, premiumWeight: 3, premiumOnly: false, growTime: 60,
    draw(ctx, x, y, s, seed, growth) {
      const rng = mulberry(seed);
      const g = 0.35 + 0.65 * growth;
      for (let i = 0; i < 3; i++) {
        const ox = (rng() - 0.5) * 20 * s;
        const oy = (rng() - 0.5) * 9 * s - 3 * s;
        const r = 2.1 * s * g;
        ctx.fillStyle = i % 2 ? '#2f9e44' : '#37a94c';
        for (let p = 0; p < 4; p++) {
          const ang = (p / 4) * Math.PI * 2 + 0.6;
          ctx.beginPath();
          ctx.arc(x + ox + Math.cos(ang) * r, y + oy + Math.sin(ang) * r * 0.85, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillRect(x + ox - 0.8 * s, y + oy - 0.8 * s, 1.6 * s, 1.6 * s);
      }
    },
  },

  lavendel: {
    id: 'lavendel', label: 'Lavendel', coins: 12,
    weight: 0, premiumWeight: 2.5, premiumOnly: true, growTime: 75,
    draw(ctx, x, y, s, seed, growth) {
      const rng = mulberry(seed);
      const g = 0.35 + 0.65 * growth;
      for (let i = 0; i < 4; i++) {
        const ox = (rng() - 0.5) * 20 * s;
        const oy = (rng() - 0.5) * 8 * s + 2 * s;
        const hgt = (10 + rng() * 5) * s * g;
        const lean = (rng() - 0.5) * 4 * s;
        ctx.strokeStyle = '#5a9440';
        ctx.lineWidth = 1.4 * s;
        ctx.beginPath();
        ctx.moveTo(x + ox, y + oy);
        ctx.quadraticCurveTo(x + ox + lean * 0.5, y + oy - hgt * 0.6, x + ox + lean, y + oy - hgt);
        ctx.stroke();
        for (let b = 0; b < 4; b++) {
          const t = 0.55 + b * 0.15;
          ctx.fillStyle = b % 2 ? '#8f7ae0' : '#7c5cd6';
          ctx.beginPath();
          ctx.ellipse(x + ox + lean * t, y + oy - hgt * t, 1.9 * s * g, 1.3 * s * g, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  },

  goldbluete: {
    id: 'goldbluete', label: 'Goldblüte', coins: 25,
    weight: 0, premiumWeight: 1, premiumOnly: true, growTime: 95,
    draw(ctx, x, y, s, seed, growth, nowMs) {
      const rng = mulberry(seed);
      const g = 0.35 + 0.65 * growth;
      const hgt = 11 * s * g;
      ctx.strokeStyle = '#4f9432';
      ctx.lineWidth = 1.8 * s;
      ctx.beginPath();
      ctx.moveTo(x, y + 2 * s);
      ctx.lineTo(x, y + 2 * s - hgt);
      ctx.stroke();
      const cy = y + 2 * s - hgt;
      ctx.fillStyle = '#f5b70a';
      for (let p = 0; p < 6; p++) {
        const ang = (p / 6) * Math.PI * 2 + 0.3;
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(ang) * 3.6 * s * g, cy + Math.sin(ang) * 3 * s * g, 2.5 * s * g, 1.5 * s * g, ang, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#c98a00';
      ctx.beginPath();
      ctx.arc(x, cy, 2 * s * g, 0, Math.PI * 2);
      ctx.fill();
      // Funkeln, wenn reif
      if (growth >= 1) {
        ctx.fillStyle = `rgba(255,255,255,${0.5 + 0.5 * Math.sin(nowMs / 200 + seed)})`;
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(x + (rng() - 0.5) * 16 * s, cy + (rng() - 0.5) * 12 * s, 1.8 * s, 1.8 * s);
        }
      }
    },
  },
};

// Art auswählen: auf Premium-Boden gelten andere Gewichte,
// premiumOnly-Arten sind sonst ausgeschlossen.
export function pickPlantType(premium) {
  const entries = Object.values(PLANTS).filter((p) => premium || !p.premiumOnly);
  const weightOf = (p) => (premium ? p.premiumWeight : p.weight);
  const total = entries.reduce((sum, p) => sum + weightOf(p), 0);
  let roll = Math.random() * total;
  for (const p of entries) {
    roll -= weightOf(p);
    if (roll <= 0) return p.id;
  }
  return entries[0].id;
}
