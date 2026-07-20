// ============================================================
// Mähroboter: Zufalls-Fahrmuster (wie echte Mähroboter) und
// Zielsteuerung zurück zur Ladestation.
// Position in Garten-Koordinaten (ganze Zahlen = Kachelmitten).
// ============================================================

export class Mower {
  constructor(dock = { c: 0, r: 0 }) {
    this.c = dock.c;
    this.r = dock.r;
    this.angle = Math.PI / 4; // Fahrtrichtung im Gitterraum
    this.detour = 0;          // Ausweichrichtung beim Heimfahren
  }

  snap(c, r) { this.c = c; this.r = r; }

  distTo(c, r) { return Math.hypot(this.c - c, this.r - r); }

  tryMove(dt, speed, angle, garden) {
    const nc = this.c + Math.cos(angle) * speed * dt;
    const nr = this.r + Math.sin(angle) * speed * dt;
    // etwas vorausschauen, damit der Mäher nicht in Hindernisse "klebt"
    const lc = this.c + Math.cos(angle) * 0.3;
    const lr = this.r + Math.sin(angle) * 0.3;
    if (garden.walkable(nc, nr) && garden.walkable(lc, lr)) {
      this.c = nc;
      this.r = nr;
      this.angle = angle;
      return true;
    }
    return false;
  }

  // Zufalls-Fahrmuster: geradeaus, bei Kollision neue Richtung
  wander(dt, speed, garden) {
    if (this.tryMove(dt, speed, this.angle, garden)) return;
    for (let i = 0; i < 10; i++) {
      const candidate = Math.random() * Math.PI * 2;
      if (this.tryMove(dt, speed, candidate, garden)) return;
    }
  }

  // Richtung Ziel fahren (Ladestation), Hindernissen grob ausweichen
  seek(dt, speed, tc, tr, garden) {
    const direct = Math.atan2(tr - this.r, tc - this.c);
    if (this.tryMove(dt, speed, direct, garden)) {
      this.detour = 0;
      return;
    }
    if (!this.detour) this.detour = Math.random() < 0.5 ? 1 : -1;
    for (const spread of [0.9, 1.6, 2.3]) {
      if (this.tryMove(dt, speed, direct + this.detour * spread, garden)) return;
    }
    this.detour = -this.detour;
    this.wander(dt, speed, garden);
  }
}
