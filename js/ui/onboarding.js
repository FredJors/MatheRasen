// ============================================================
// Onboarding: Name, E-Mail, Klassenstufe, Bundesland.
// ============================================================

import { BUNDESLAENDER } from '../data/bundeslaender.js';
import { setProfile } from '../core/state.js';

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

export function initOnboarding(onDone) {
  const form = document.getElementById('onboard-form');
  const nameInput = document.getElementById('ob-name');
  const emailInput = document.getElementById('ob-email');
  const gradeSelect = document.getElementById('ob-grade');
  const stateSelect = document.getElementById('ob-state');
  const errorEl = document.getElementById('ob-error');

  fillGradeSelect(gradeSelect);
  fillStateSelect(stateSelect);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    let error = '';
    if (name.length < 2) error = 'Bitte gib einen Benutzernamen mit mindestens 2 Zeichen an.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) error = 'Bitte gib eine gültige E-Mail-Adresse an.';

    errorEl.textContent = error;
    errorEl.classList.toggle('hidden', !error);
    if (error) return;

    setProfile({
      name,
      email,
      grade: parseInt(gradeSelect.value, 10),
      state: stateSelect.value,
    });
    onDone();
  });
}
