// ============================================================
// Kosmetik-Registry: Roboter-Skins und Garten-Deko.
// Reine Optik – keine Spielwirkung; dient als sinnvolle
// Münz-Senke. Neue Kosmetik: einfach Eintrag ergänzen.
//
//  - MOWER_SKINS: Farben für drawMower(); 'classic' ist gratis.
//  - DECOR: prozedural gezeichnete Objekte, die außerhalb der
//    Mähfläche an festen Rand-Plätzen (spot 0..5) stehen.
// ============================================================

export const MOWER_SKINS = [
  { id: 'classic', name: 'Klassisch', cost: 0,
    body: '#f6f8f9', stroke: '#c9d1da', bumper: '#3c4b5e', accent: '#f5c518' },
  { id: 'sunny', name: 'Sonnengelb', cost: 80,
    body: '#ffd83b', stroke: '#e0af00', bumper: '#4a4133', accent: '#ffffff' },
  { id: 'mint', name: 'Minze', cost: 120,
    body: '#8fe4c4', stroke: '#3fae8a', bumper: '#2f5c50', accent: '#ffffff' },
  { id: 'coral', name: 'Koralle', cost: 160,
    body: '#ff8a73', stroke: '#e0533a', bumper: '#5c2f2a', accent: '#fff0d0' },
  { id: 'midnight', name: 'Mitternacht', cost: 240,
    body: '#2b3648', stroke: '#161d29', bumper: '#0d1219', accent: '#35d0e0' },
  { id: 'candy', name: 'Bonbon', cost: 320,
    body: '#e59be0', stroke: '#b85fb2', bumper: '#4a2f48', accent: '#fff0a0' },
];

export function skinById(id) {
  return MOWER_SKINS.find((s) => s.id === id) ?? MOWER_SKINS[0];
}

// Hilfsfunktion für die Deko-Vorschau (kleines Icon in den Shop-Karten)
function withGround(draw) {
  return (ctx, x, y, s, nowMs) => {
    ctx.fillStyle = 'rgba(16,27,44,0.10)';
    ctx.beginPath();
    ctx.ellipse(x, y + 4 * s, 13 * s, 5 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    draw(ctx, x, y, s, nowMs);
  };
}

export const DECOR = [
  {
    id: 'pond', name: 'Teich', cost: 90, spot: 0,
    draw: withGround((ctx, x, y, s) => {
      ctx.fillStyle = '#5bb0d8';
      ctx.beginPath();
      ctx.ellipse(x, y, 15 * s, 8 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#9fd3ea';
      ctx.lineWidth = 1.4 * s;
      ctx.beginPath();
      ctx.ellipse(x - 3 * s, y - 1 * s, 6 * s, 3 * s, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Seerosenblatt
      ctx.fillStyle = '#3fae6a';
      ctx.beginPath();
      ctx.ellipse(x + 5 * s, y + 1 * s, 4 * s, 2.4 * s, 0, 0.5, Math.PI * 2);
      ctx.fill();
    }),
  },
  {
    id: 'gnome', name: 'Gartenzwerg', cost: 130, spot: 1,
    draw: withGround((ctx, x, y, s) => {
      ctx.fillStyle = '#3f7fd0'; // Körper
      ctx.beginPath();
      ctx.moveTo(x - 5 * s, y);
      ctx.quadraticCurveTo(x, y - 3 * s, x + 5 * s, y);
      ctx.lineTo(x + 3.5 * s, y - 9 * s);
      ctx.lineTo(x - 3.5 * s, y - 9 * s);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#f3c9a3'; // Gesicht
      ctx.beginPath();
      ctx.arc(x, y - 11 * s, 3.4 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e0563a'; // Zipfelmütze
      ctx.beginPath();
      ctx.moveTo(x - 4 * s, y - 11 * s);
      ctx.quadraticCurveTo(x, y - 24 * s, x + 4 * s, y - 11 * s);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff'; // Bart
      ctx.beginPath();
      ctx.moveTo(x - 3 * s, y - 10 * s);
      ctx.quadraticCurveTo(x, y - 3 * s, x + 3 * s, y - 10 * s);
      ctx.closePath();
      ctx.fill();
    }),
  },
  {
    id: 'flowerbed', name: 'Blumenbeet', cost: 110, spot: 2,
    draw: withGround((ctx, x, y, s) => {
      ctx.fillStyle = '#7a5230';
      ctx.beginPath();
      ctx.ellipse(x, y, 15 * s, 7 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      const cols = ['#ef6f6f', '#f5c518', '#e59be0', '#ffffff'];
      for (let i = 0; i < 7; i++) {
        const ang = (i / 7) * Math.PI * 2;
        const fx = x + Math.cos(ang) * 9 * s;
        const fy = y + Math.sin(ang) * 4 * s - 2 * s;
        ctx.fillStyle = cols[i % cols.length];
        for (let p = 0; p < 5; p++) {
          const a = (p / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(fx + Math.cos(a) * 1.7 * s, fy + Math.sin(a) * 1.7 * s, 1.3 * s, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#c98a00';
        ctx.beginPath();
        ctx.arc(fx, fy, 1.2 * s, 0, Math.PI * 2);
        ctx.fill();
      }
    }),
  },
  {
    id: 'lantern', name: 'Laterne', cost: 150, spot: 3,
    draw: withGround((ctx, x, y, s, nowMs) => {
      ctx.strokeStyle = '#3a4655';
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - 15 * s);
      ctx.stroke();
      ctx.fillStyle = '#2b3546';
      ctx.beginPath();
      ctx.roundRect
        ? ctx.roundRect(x - 3.5 * s, y - 24 * s, 7 * s, 9 * s, 2 * s)
        : ctx.rect(x - 3.5 * s, y - 24 * s, 7 * s, 9 * s);
      ctx.fill();
      const glow = 0.6 + 0.4 * Math.sin((nowMs ?? 0) / 500);
      ctx.fillStyle = `rgba(255,214,80,${glow})`;
      ctx.beginPath();
      ctx.arc(x, y - 19.5 * s, 2.6 * s, 0, Math.PI * 2);
      ctx.fill();
    }),
  },
  {
    id: 'topiary', name: 'Formschnitt-Busch', cost: 100, spot: 4,
    draw: withGround((ctx, x, y, s) => {
      ctx.fillStyle = '#5c4326';
      ctx.fillRect(x - 1.5 * s, y - 6 * s, 3 * s, 6 * s);
      ctx.fillStyle = '#3fa04a';
      for (const [dy, r] of [[-9, 6], [-15, 5], [-20, 3.6]]) {
        ctx.beginPath();
        ctx.arc(x, y + dy * s, r * s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.arc(x - 2 * s, y - 11 * s, 2 * s, 0, Math.PI * 2);
      ctx.fill();
    }),
  },
  {
    id: 'birdbath', name: 'Vogelbad', cost: 180, spot: 5,
    draw: withGround((ctx, x, y, s) => {
      ctx.strokeStyle = '#b7bec8';
      ctx.fillStyle = '#cdd4dc';
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.moveTo(x - 2 * s, y);
      ctx.lineTo(x + 2 * s, y);
      ctx.lineTo(x + 1.4 * s, y - 9 * s);
      ctx.lineTo(x - 1.4 * s, y - 9 * s);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x, y - 10 * s, 7 * s, 3.2 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#6bc0e0';
      ctx.beginPath();
      ctx.ellipse(x, y - 10 * s, 5 * s, 2.1 * s, 0, 0, Math.PI * 2);
      ctx.fill();
    }),
  },
];

export function decorById(id) {
  return DECOR.find((d) => d.id === id);
}
