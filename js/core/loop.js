// ============================================================
// requestAnimationFrame-Spielschleife mit dt-Begrenzung.
// ============================================================

let running = false;

export function startLoop(update) {
  if (running) return;
  running = true;
  let last = performance.now();

  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.06, (now - last) / 1000); // max. 60 ms pro Schritt
    last = now;
    update(dt, now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

export function stopLoop() { running = false; }
