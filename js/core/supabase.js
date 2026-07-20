// ============================================================
// Minimaler Supabase-Client ohne Fremdbibliothek (nur fetch).
// Bewusst ohne CDN-Abhängigkeit: Schulnetze blockieren gern
// externe Skripte, und das Projekt bleibt ohne Build-Schritt.
//
// - Auth (GoTrue):  signUp / signIn / signOut / Token-Refresh
// - Daten (PostgREST):  rest('tabelle?query', {...})
// Die Session überlebt Neuladen via localStorage.
// ============================================================

import { SUPABASE_URL, SUPABASE_KEY } from './supabaseConfig.js';

const SESSION_KEY = 'matherasen_session';
let session = null; // { access_token, refresh_token, expires_at, user: { id, email } }

function loadSession() {
  try { session = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { session = null; }
}

function storeSession(s) {
  session = s;
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch { /* Speicher voll/blockiert */ }
}

function pickSession(data) {
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (data.expires_in ?? 3600),
    user: { id: data.user?.id, email: data.user?.email },
  };
}

// Häufige Auth-Fehler in verständliches Deutsch übersetzen
function translate(msg) {
  const m = String(msg ?? '');
  if (/invalid login credentials/i.test(m)) return 'E-Mail oder Passwort ist falsch.';
  if (/already registered/i.test(m)) return 'Diese E-Mail ist schon registriert.';
  if (/at least 6 characters/i.test(m)) return 'Das Passwort braucht mindestens 6 Zeichen.';
  if (/email not confirmed/i.test(m)) return 'Bitte bestätige zuerst deine E-Mail (Link in deinem Postfach).';
  if (/rate limit/i.test(m)) return 'Zu viele Versuche – warte kurz und probiere es erneut.';
  return m || 'Unbekannter Fehler.';
}

async function authFetch(path, body) {
  let res;
  try {
    res = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Keine Verbindung zum Server – bist du online?');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(translate(data.msg ?? data.error_description ?? data.message));
  return data;
}

export function currentUser() {
  return session?.user ?? null;
}

// Liefert { session: bool, needsConfirm: bool }
export async function signUp(email, password) {
  const data = await authFetch('signup', { email, password });
  if (data.access_token) {
    storeSession(pickSession(data));
    return { session: true, needsConfirm: false };
  }
  // E-Mail-Bestätigung ist aktiviert: Nutzer existiert, aber noch keine Session
  return { session: false, needsConfirm: true };
}

export async function signIn(email, password) {
  const data = await authFetch('token?grant_type=password', { email, password });
  storeSession(pickSession(data));
}

export function signOut() {
  storeSession(null);
}

async function ensureFreshSession() {
  if (!session) return null;
  if (session.expires_at - Date.now() / 1000 > 120) return session;
  try {
    const data = await authFetch('token?grant_type=refresh_token', { refresh_token: session.refresh_token });
    storeSession(pickSession(data));
  } catch {
    storeSession(null); // Refresh-Token abgelaufen → sauber ausloggen
  }
  return session;
}

// PostgREST-Aufruf, z. B.:
//   rest('profiles?id=eq.123&select=*')
//   rest('saves', { method: 'POST', body: {...}, headers: { Prefer: 'resolution=merge-duplicates' } })
export async function rest(path, { method = 'GET', body, headers = {} } = {}) {
  const s = await ensureFreshSession();
  const allHeaders = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', ...headers };
  if (s?.access_token) allHeaders.Authorization = `Bearer ${s.access_token}`;

  let res;
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      method,
      headers: allHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('offline');
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Supabase ${method} ${path.split('?')[0]} → ${res.status} ${detail.slice(0, 200)}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

loadSession();
