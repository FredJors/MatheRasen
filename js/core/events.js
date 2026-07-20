// ============================================================
// Mini-Event-Bus (Pub/Sub) – entkoppelt Spiel-Logik und UI.
// Events u. a.: 'coins', 'battery', 'mode', 'obstacles',
// 'toast', 'profile', 'stats', 'upgrades', 'screen', 'request-boost'
// ============================================================

const listeners = new Map();

export function on(event, fn) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(fn);
  return () => off(event, fn);
}

export function off(event, fn) {
  listeners.get(event)?.delete(fn);
}

export function emit(event, payload) {
  listeners.get(event)?.forEach((fn) => {
    try { fn(payload); } catch (e) { console.error(`[events] Fehler in Listener für "${event}"`, e); }
  });
}
