// ============================================================
// Onboarding mit Cloud-Konto:
// - Registrieren: Name, E-Mail, Passwort, Klassenstufe, Bundesland
// - Anmelden: E-Mail + Passwort (holt Profil + Spielstand aus der Cloud)
// - Fallback: lokal weiterspielen, wenn die Cloud nicht erreichbar ist
// ============================================================

import { BUNDESLAENDER } from '../data/bundeslaender.js';
import { setProfile, applyCloudSave } from '../core/state.js';
import { registerCloud, loginCloud } from '../core/sync.js';
import { emit } from '../core/events.js';

export function fillGradeSelect(select, value = 7) {
  select.innerHTML = '';
  for (let g = 5; g <= 13; g++) {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = `${g}. Klasse`;
    select.appendChild(opt);
  }
  select.value = String(value);
}

export function fillStateSelect(select, value = 'NW') {
  select.innerHTML = '';
  for (const b of BUNDESLAENDER) {
    const opt = document.createElement('option');
    opt.value = b.code;
    opt.textContent = b.name;
    select.appendChild(opt);
  }
  select.value = value;
}

let mode = 'register'; // 'register' | 'login'

export function initOnboarding(onDone) {
  const els = {
    form: document.getElementById('onboard-form'),
    rowName: document.getElementById('ob-row-name'),
    rowGradeState: document.getElementById('ob-row-gradestate'),
    name: document.getElementById('ob-name'),
    email: document.getElementById('ob-email'),
    password: document.getElementById('ob-password'),
    grade: document.getElementById('ob-grade'),
    state: document.getElementById('ob-state'),
    error: document.getElementById('ob-error'),
    submit: document.getElementById('ob-submit'),
    local: document.getElementById('ob-local'),
    switchBtn: document.getElementById('ob-switch'),
    fineprint: document.getElementById('ob-fineprint'),
  };

  fillGradeSelect(els.grade);
  fillStateSelect(els.state);

  const showError = (msg) => {
    els.error.textContent = msg ?? '';
    els.error.classList.toggle('hidden', !msg);
  };

  const setBusy = (busy, label) => {
    els.submit.disabled = busy;
    els.submit.textContent = label;
  };

  const setMode = (m) => {
    mode = m;
    const register = m === 'register';
    els.rowName.classList.toggle('hidden', !register);
    els.rowGradeState.classList.toggle('hidden', !register);
    els.local.classList.add('hidden');
    els.password.autocomplete = register ? 'new-password' : 'current-password';
    els.submit.textContent = register ? 'Konto erstellen' : 'Anmelden';
    els.switchBtn.textContent = register ? 'Anmelden' : 'Registrieren';
    els.switchBtn.previousSibling.textContent = register ? 'Schon ein Konto? ' : 'Neu hier? ';
    els.fineprint.textContent = register
      ? 'Dein Spielstand wird sicher in deinem Konto gespeichert – so kannst du auf jedem Gerät weiterspielen.'
      : 'Melde dich mit deinem MatheRasen-Konto an, um deinen Spielstand zu laden.';
    showError(null);
  };

  els.switchBtn.addEventListener('click', () => setMode(mode === 'register' ? 'login' : 'register'));

  // Fallback: ohne Cloud-Konto rein lokal spielen
  els.local.addEventListener('click', () => {
    const check = validateRegister();
    if (check.error) { showError(check.error); return; }
    setProfile(check.profile);
    emit('toast', { icon: 'sprout', text: 'Lokal gestartet – Spielstand bleibt auf diesem Gerät.' });
    onDone();
  });

  function validateRegister() {
    const name = els.name.value.trim();
    const email = els.email.value.trim();
    if (name.length < 2) return { error: 'Bitte gib einen Benutzernamen mit mindestens 2 Zeichen an.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: 'Bitte gib eine gültige E-Mail-Adresse an.' };
    return {
      profile: {
        name,
        email,
        grade: parseInt(els.grade.value, 10),
        state: els.state.value,
      },
    };
  }

  els.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError(null);
    const password = els.password.value;
    if (password.length < 6) { showError('Das Passwort braucht mindestens 6 Zeichen.'); return; }

    if (mode === 'register') {
      const check = validateRegister();
      if (check.error) { showError(check.error); return; }

      setBusy(true, 'Erstelle Konto …');
      const res = await registerCloud(check.profile, password);
      setBusy(false, 'Konto erstellen');

      if (res.ok) {
        setProfile(check.profile);
        emit('toast', { icon: 'check', text: 'Konto erstellt – dein Spielstand wird jetzt gesichert!' });
        onDone();
      } else if (res.needsConfirm) {
        setMode('login');
        showError('Fast geschafft! Bestätige den Link in deinem E-Mail-Postfach und melde dich dann hier an.');
      } else {
        showError(res.error);
        if (/verbindung|online/i.test(res.error ?? '')) els.local.classList.remove('hidden');
      }
    } else {
      const email = els.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { showError('Bitte gib eine gültige E-Mail-Adresse an.'); return; }

      setBusy(true, 'Melde an …');
      const res = await loginCloud(email, password);
      setBusy(false, 'Anmelden');

      if (res.ok && res.profile) {
        applyCloudSave(res.save);
        setProfile(res.profile);
        emit('toast', { icon: 'check', text: `Willkommen zurück, ${res.profile.name}!` });
        onDone();
      } else if (res.ok && !res.profile) {
        setMode('register');
        showError('Zu diesem Konto gibt es noch kein Spielprofil. Fülle die Felder aus und registriere dich – dein Konto wird dabei vervollständigt.');
      } else {
        showError(res.error);
        if (/verbindung|online/i.test(res.error ?? '')) {
          setMode('register');
          els.local.classList.remove('hidden');
        }
      }
    }
  });

  setMode('register');
}
