// ============================================================
// Cloud-Synchronisation (Supabase).
// Offline-first: localStorage bleibt immer der schnelle Puffer,
// die Cloud wird verzögert (debounced) aktualisiert. Fällt das
// Netz aus, läuft das Spiel unverändert weiter.
//
// Events: emit('cloud', { status: 'synced' | 'error' | 'off' })
// ============================================================

import * as sb from './supabase.js';
import { on, emit } from './events.js';

let cloudReady = false;      // eingeloggt UND Profilzeile vorhanden
let pendingPayload = null;   // letzter Spielstand für den Debounce-Push
let pushTimer = null;

export function isCloudConnected() {
  return Boolean(sb.currentUser()) && cloudReady;
}

export function cloudEmail() {
  return sb.currentUser()?.email ?? null;
}

// ---------- Konto anlegen / anmelden ----------

function profileRow(profile) {
  return {
    id: sb.currentUser().id,
    email: profile.email,
    username: profile.name,
    grade: profile.grade,
    bundesland: profile.state,
  };
}

async function ensureProfileRow(profile) {
  await sb.rest('profiles', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body: profileRow(profile),
  });
}

// Registrierung. Heilt auch den Fall "Auth-Konto existiert schon,
// Profilzeile fehlt": dann wird eingeloggt und das Profil angelegt.
export async function registerCloud(profile, password) {
  try {
    const result = await sb.signUp(profile.email, password);
    if (result.needsConfirm) return { ok: false, needsConfirm: true };
  } catch (e) {
    if (/schon registriert/i.test(e.message)) {
      try {
        await sb.signIn(profile.email, password);
      } catch (e2) {
        return { ok: false, error: `${e.message} ${e2.message}` };
      }
    } else {
      return { ok: false, error: e.message };
    }
  }
  try {
    await ensureProfileRow(profile);
    cloudReady = true;
    emit('cloud', { status: 'synced' });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: 'Konto erstellt, aber Profil konnte nicht gespeichert werden. ' + e.message };
  }
}

export async function loginCloud(email, password) {
  try {
    await sb.signIn(email, password);
  } catch (e) {
    return { ok: false, error: e.message };
  }
  try {
    const data = await fetchCloudData();
    cloudReady = Boolean(data.profile);
    if (cloudReady) emit('cloud', { status: 'synced' });
    return { ok: true, ...data };
  } catch {
    return { ok: true, profile: null, save: null };
  }
}

async function fetchCloudData() {
  const uid = sb.currentUser().id;
  const [pRows, sRows] = await Promise.all([
    sb.rest(`profiles?id=eq.${uid}&select=*`),
    sb.rest(`saves?profile_id=eq.${uid}&select=*`),
  ]);
  const p = pRows?.[0];
  return {
    profile: p ? { name: p.username, email: p.email, grade: p.grade, state: p.bundesland } : null,
    save: sRows?.[0] ?? null,
  };
}

// Beim App-Start: bestehende Session nutzen und Cloud-Stand holen.
export async function restoreOnBoot() {
  if (!sb.currentUser()) return null;
  try {
    const data = await fetchCloudData();
    cloudReady = Boolean(data.profile);
    if (cloudReady) emit('cloud', { status: 'synced' });
    return cloudReady ? data : null;
  } catch {
    return null; // offline → lokal weiterspielen
  }
}

export function signOutCloud() {
  sb.signOut();
  cloudReady = false;
  emit('cloud', { status: 'off' });
}

// ---------- Spielstand & Profil hochladen ----------

export async function pushSave(payload) {
  if (!isCloudConnected()) return;
  // Kernfelder (immer vorhanden) + Zusatzfelder (topics/cosmetics).
  // Fehlen die Zusatzspalten noch in der DB, wird ohne sie erneut
  // versucht – so bricht der Sync nie ganz ab.
  const core = {
    profile_id: sb.currentUser().id,
    coins: payload.coins,
    xp: payload.xp,
    upgrades: payload.upgrades,
    stats: payload.stats,
    battery: payload.battery,
    garden: payload.garden,
    updated_at: new Date().toISOString(),
  };
  const full = {
    ...core,
    topics: payload.topics,
    topic_seq: payload.topicSeq,
    cosmetics: payload.cosmetics,
  };
  const send = (body) => sb.rest('saves', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body,
  });
  try {
    try {
      await send(full);
    } catch (e) {
      if (/topics|cosmetics|topic_seq|column|schema|PGRST/i.test(e.message)) {
        await send(core); // Zusatzspalten fehlen noch → Kern speichern
      } else {
        throw e;
      }
    }
    emit('cloud', { status: 'synced' });
  } catch {
    emit('cloud', { status: 'error' });
  }
}

export async function updateCloudProfile(profile) {
  if (!isCloudConnected()) return;
  try { await ensureProfileRow(profile); } catch { /* nächster Push versucht es erneut */ }
}

// Gelöste/fehlgeschlagene Aufgaben protokollieren (Lernanalyse)
export function logTask(task, correct) {
  if (!isCloudConnected()) return;
  sb.rest('task_log', {
    method: 'POST',
    body: {
      profile_id: sb.currentUser().id,
      topic_id: task.topicId,
      difficulty: task.difficulty,
      correct,
    },
  }).catch(() => { /* Protokoll ist nice-to-have */ });
}

// ---------- Automatischer Push (debounced) ----------

export function initSync() {
  on('persisted', (payload) => {
    pendingPayload = payload;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(flush, 8000);
  });
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}

function flush() {
  clearTimeout(pushTimer);
  if (pendingPayload) {
    const p = pendingPayload;
    pendingPayload = null;
    pushSave(p);
  }
}
