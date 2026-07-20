// ============================================================
// Speicher-Abstraktion.
// Aktuell: localStorage. Später: Supabase-Treiber mit gleicher
// Schnittstelle einhängen (setDriver) – Rest des Codes bleibt gleich.
// ============================================================

const PREFIX = 'matherasen_';

const localDriver = {
  get(key) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* voll/blockiert */ }
  },
  remove(key) {
    try { localStorage.removeItem(PREFIX + key); } catch { /* */ }
  },
};

// TODO (Supabase): Treiber mit { get, set, remove } implementieren,
// der Profile/Spielstände über @supabase/supabase-js synchronisiert.
let driver = localDriver;

export function setDriver(d) { driver = d; }
export function get(key) { return driver.get(key); }
export function set(key, value) { driver.set(key, value); }
export function remove(key) { driver.remove(key); }
