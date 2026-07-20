// ============================================================
// Icon-Bibliothek: schlichte Linien-Icons im Stil der App
// (stroke: currentColor, dezente Farbakzente wo sinnvoll).
// Neue Icons: Eintrag ergänzen, überall via icon('name') nutzen.
// ============================================================

export const ICONS = {
  book: `<svg viewBox="0 0 24 24"><path d="M12 6.3C10 4.8 7.6 4.3 4.5 4.3v13.2c3.1 0 5.5.5 7.5 2 2-1.5 4.4-2 7.5-2V4.3c-3.1 0-5.5.5-7.5 2Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M12 6.3v13.2" stroke="currentColor" stroke-width="1.9"/></svg>`,

  coin: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="#f5b70a"/><circle cx="12" cy="12" r="5.6" fill="none" stroke="#dd9b04" stroke-width="1.6"/><path d="M12 9.2v5.6M9.9 10.8h4.2" stroke="#b57e00" stroke-width="1.5" stroke-linecap="round"/></svg>`,

  bolt: `<svg viewBox="0 0 24 24"><path d="M13 3 6 13.5h4.4L10.5 21l7-10.5h-4.4L13 3Z" fill="currentColor"/></svg>`,

  battery: `<svg viewBox="0 0 24 24"><rect x="3" y="7.8" width="15.5" height="8.4" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M21 10.4v3.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><rect x="5.3" y="10" width="6.5" height="4" rx="1" fill="#22c55e"/></svg>`,

  rocket: `<svg viewBox="0 0 24 24"><path d="M12 2.8c2.8 2 3.9 5.7 2.8 9.8L12 15.2l-2.8-2.6C8.1 8.5 9.2 4.8 12 2.8Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><circle cx="12" cy="8.6" r="1.6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 12.4c-1.7.9-2.5 2.3-2.6 4.2l3.2-1.2M15 12.4c1.7.9 2.5 2.3 2.6 4.2l-3.2-1.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/><path d="M12 17.2v3.4" stroke="#ef4444" stroke-width="2.4" stroke-linecap="round"/></svg>`,

  blade: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 12V5.6M12 12l5.5 3.2M12 12l-5.5 3.2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/></svg>`,

  charger: `<svg viewBox="0 0 24 24"><rect x="4.2" y="5.5" width="15.6" height="13" rx="3" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M13 7.8 9.6 12.8h2.3l-.5 3.4 3.4-5h-2.3l.5-3.4Z" fill="#f5b70a"/></svg>`,

  cap: `<svg viewBox="0 0 24 24"><path d="M3.2 9.3 12 5.2l8.8 4.1-8.8 4.1-8.8-4.1Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M7.3 12.2v3.5c0 1.1 2.1 2 4.7 2s4.7-.9 4.7-2v-3.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M20.8 9.6v4.6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>`,

  trophy: `<svg viewBox="0 0 24 24"><path d="M8 4.2h8v5.2a4 4 0 0 1-8 0V4.2Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M8 5.8H5.2a3.2 3.2 0 0 0 3.1 3.9M16 5.8h2.8a3.2 3.2 0 0 1-3.1 3.9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 13.4v3M9 19.6h6M10 16.4h4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>`,

  flower: `<svg viewBox="0 0 24 24"><path d="M12 13.5V20" stroke="#3f8f2e" stroke-width="1.9" stroke-linecap="round"/><path d="M12 17c-1.9.2-3.1-.5-3.7-1.9 1.7-.4 2.9.2 3.7 1.9Z" fill="#3f8f2e"/><g fill="#ffffff" stroke="#ccd5de" stroke-width="1"><circle cx="12" cy="6" r="2.1"/><circle cx="15.6" cy="8.4" r="2.1"/><circle cx="14.3" cy="12.3" r="2.1"/><circle cx="9.7" cy="12.3" r="2.1"/><circle cx="8.4" cy="8.4" r="2.1"/></g><circle cx="12" cy="9.5" r="1.9" fill="#f5c518"/></svg>`,

  cone: `<svg viewBox="0 0 24 24"><path d="M10.3 4.9c.4-1.2 3-1.2 3.4 0L17 16.8H7L10.3 4.9Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M8.8 12.4h6.4" stroke="#f5b70a" stroke-width="2.2" stroke-linecap="round"/><path d="M4.5 19.4h15" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>`,

  sprout: `<svg viewBox="0 0 24 24"><path d="M12 21v-8" stroke="#16a34a" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M12 13c.2-3.6 2.6-5.8 6.5-6-.4 3.9-2.7 6-6.5 6Z" fill="#22c55e"/><path d="M12 13c-.2-3-2.2-4.8-5.5-5 .3 3.3 2.3 5 5.5 5Z" fill="#16a34a"/></svg>`,

  robot: `<svg viewBox="0 0 24 24"><rect x="4.2" y="9.2" width="15.6" height="8.2" rx="4.1" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="8.6" cy="17.6" r="1.9" fill="currentColor"/><circle cx="15.4" cy="17.6" r="1.9" fill="currentColor"/><path d="M12 9V6.2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><circle cx="12" cy="5" r="1.3" fill="#22c55e"/></svg>`,

  bulb: `<svg viewBox="0 0 24 24"><path d="M12 3.4a5.6 5.6 0 0 1 3.1 10.3c-.6.4-1 1.1-1 1.9h-4.2c0-.8-.4-1.5-1-1.9A5.6 5.6 0 0 1 12 3.4Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M9.9 18.4h4.2M10.7 21h2.6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>`,

  target: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/></svg>`,

  check: `<svg viewBox="0 0 24 24"><path d="m5.5 12.6 4 4 9-9.6" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  'arrow-left': `<svg viewBox="0 0 24 24"><path d="M14.5 6 8.5 12l6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  chev: `<svg viewBox="0 0 24 24"><path d="m9.5 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  plus: `<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 8.2v7.6M8.2 12h7.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
};

export function icon(name, cls = '') {
  const svg = ICONS[name] ?? '';
  return cls ? svg.replace('<svg ', `<svg class="${cls}" `) : svg;
}
