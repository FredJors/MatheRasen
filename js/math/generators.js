// ============================================================
// Aufgaben-Generatoren.
// Jeder Generator erzeugt prozedural Aufgaben zu einem Thema:
//   gen(diff) -> { text, answer, answerText?, unit?, hint, solution,
//                  type?: 'choice', choices?, answerIndex?, inputMode? }
// Neue Themen: unten per def(...) registrieren und in
// js/data/curricula.js einer Klassenstufe zuordnen.
// ============================================================

const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

// Zahl deutsch formatieren (Komma statt Punkt)
export const fmt = (n) => {
  const r = Math.round(n * 1000) / 1000;
  return String(r).replace('.', ',');
};

// Bruch kürzen und als String ausgeben
function frac(p, q) {
  const g = gcd(p, q) || 1;
  p /= g; q /= g;
  if (q < 0) { p = -p; q = -q; }
  return q === 1 ? `${p}` : `${p}/${q}`;
}

// Hochzahlen als Unicode (x² statt x^2)
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = (n) => String(n).split('').map((c) => SUP[c] ?? c).join('');

// Vorzeichen-Formatierung für Terme: term(-5, 'x') -> "− 5x"
function term(coef, sym = '') {
  if (coef === 0) return '';
  const sign = coef < 0 ? ' − ' : ' + ';
  const a = Math.abs(coef);
  const body = sym && a === 1 ? sym : `${a}${sym}`;
  return sign + body;
}

export const GENERATORS = {};

function def(id, label, maxDiff, gen) {
  GENERATORS[id] = { id, label, maxDiff, gen };
}

// ---------- Klasse 5/6: Arithmetik ----------

def('nz_addsub', 'Addieren & Subtrahieren', 3, (d) => {
  const max = d === 1 ? 900 : d === 2 ? 9000 : 90000;
  let a = ri(Math.floor(max / 8), max);
  let b = ri(Math.floor(max / 10), Math.floor(max / 2));
  const plus = Math.random() < 0.5;
  if (!plus && b > a) [a, b] = [b, a];
  const ans = plus ? a + b : a - b;
  return {
    text: `${a} ${plus ? '+' : '−'} ${b} = ?`,
    answer: ans,
    hint: 'Rechne schriftlich Stelle für Stelle.',
    solution: `${a} ${plus ? '+' : '−'} ${b} = ${ans}`,
  };
});

def('nz_muldiv', 'Multiplizieren & Dividieren', 3, (d) => {
  if (d === 1) {
    const a = ri(6, 13), b = ri(6, 14);
    return { text: `${a} · ${b} = ?`, answer: a * b, hint: 'Nutze das kleine Einmaleins geschickt.', solution: `${a} · ${b} = ${a * b}` };
  }
  if (d === 2) {
    const q = ri(12, 25), b = ri(6, 12);
    return { text: `${q * b} : ${b} = ?`, answer: q, hint: `Wie oft passt ${b} in ${q * b}?`, solution: `${q * b} : ${b} = ${q}` };
  }
  const a = ri(14, 29), b = ri(11, 19);
  return { text: `${a} · ${b} = ?`, answer: a * b, hint: 'Zerlege: a · b = a · 10 + a · Rest.', solution: `${a} · ${b} = ${a * b}` };
});

def('runden', 'Runden', 2, (d) => {
  const n = d === 1 ? ri(123, 9876) : ri(12345, 987654);
  const [u, name] = pick(d === 1 ? [[10, 'Zehner'], [100, 'Hunderter']] : [[100, 'Hunderter'], [1000, 'Tausender']]);
  const ans = Math.round(n / u) * u;
  return {
    text: `Runde ${n} auf ${name}.`,
    answer: ans,
    hint: 'Schaue auf die Ziffer rechts von der Rundungsstelle: ab 5 wird aufgerundet.',
    solution: `${n} ≈ ${ans}`,
  };
});

def('einheiten', 'Größen & Einheiten', 3, (d) => {
  if (d === 1) {
    const n = ri(120, 950);
    return { text: `Wandle um: ${n} cm = ? m`, answer: n / 100, unit: 'm', hint: '100 cm = 1 m.', solution: `${n} cm = ${fmt(n / 100)} m` };
  }
  if (d === 2) {
    const n = ri(1200, 9800);
    return { text: `Wandle um: ${n} g = ? kg`, answer: n / 1000, unit: 'kg', hint: '1000 g = 1 kg.', solution: `${n} g = ${fmt(n / 1000)} kg` };
  }
  const h = ri(1, 4), m = ri(5, 55);
  return { text: `Wandle um: ${h} h ${m} min = ? min`, answer: h * 60 + m, unit: 'min', hint: '1 Stunde = 60 Minuten.', solution: `${h} · 60 + ${m} = ${h * 60 + m} min` };
});

def('rechteck', 'Flächen & Umfang', 3, (d) => {
  const a = ri(3, 12), b = ri(4, 15);
  if (d === 1) {
    return { text: `Ein Rechteck ist ${a} cm lang und ${b} cm breit.\nWie groß ist sein Flächeninhalt?`, answer: a * b, unit: 'cm²', hint: 'A = Länge · Breite.', solution: `A = ${a} · ${b} = ${a * b} cm²` };
  }
  if (d === 2) {
    return { text: `Ein Rechteck ist ${a} cm lang und ${b} cm breit.\nWie groß ist sein Umfang?`, answer: 2 * (a + b), unit: 'cm', hint: 'U = 2 · (Länge + Breite).', solution: `U = 2 · (${a} + ${b}) = ${2 * (a + b)} cm` };
  }
  return { text: `Ein Rechteck hat den Flächeninhalt ${a * b} cm² und die Länge ${a} cm.\nWie breit ist es?`, answer: b, unit: 'cm', hint: 'Breite = Fläche : Länge.', solution: `${a * b} : ${a} = ${b} cm` };
});

// ---------- Klasse 6/7: Brüche, Dezimalzahlen, Prozent ----------

def('brueche', 'Brüche', 3, (d) => {
  if (d === 1) {
    const q = pick([4, 5, 6, 8, 10]);
    const p1 = ri(1, q - 1), p2 = ri(1, q - 1);
    return {
      text: `${p1}/${q} + ${p2}/${q} = ?`,
      answer: (p1 + p2) / q, answerText: frac(p1 + p2, q), inputMode: 'text',
      hint: 'Gleiche Nenner: Zähler addieren, dann kürzen.',
      solution: `${p1}/${q} + ${p2}/${q} = ${frac(p1 + p2, q)}`,
    };
  }
  if (d === 2) {
    const q1 = pick([2, 3, 4]), q2 = pick([3, 4, 5, 6].filter((x) => x !== q1));
    const p1 = ri(1, q1 - 1) || 1, p2 = ri(1, q2 - 1) || 1;
    const num = p1 * q2 + p2 * q1, den = q1 * q2;
    return {
      text: `${p1}/${q1} + ${p2}/${q2} = ?`,
      answer: num / den, answerText: frac(num, den), inputMode: 'text',
      hint: `Bringe beide Brüche auf den Nenner ${den}.`,
      solution: `= ${p1 * q2}/${den} + ${p2 * q1}/${den} = ${frac(num, den)}`,
    };
  }
  const p1 = ri(1, 5), q1 = ri(2, 6), p2 = ri(1, 5), q2 = ri(2, 6);
  return {
    text: `${p1}/${q1} · ${p2}/${q2} = ?`,
    answer: (p1 * p2) / (q1 * q2), answerText: frac(p1 * p2, q1 * q2), inputMode: 'text',
    hint: 'Zähler mal Zähler, Nenner mal Nenner – dann kürzen.',
    solution: `= ${p1 * p2}/${q1 * q2} = ${frac(p1 * p2, q1 * q2)}`,
  };
});

def('dezimal', 'Dezimalzahlen', 3, (d) => {
  if (d === 1) {
    const a = ri(120, 999) / 100, b = ri(120, 999) / 100;
    const ans = Math.round((a + b) * 100) / 100;
    return { text: `${fmt(a)} € + ${fmt(b)} € = ?`, answer: ans, unit: '€', hint: 'Komma unter Komma schreiben.', solution: `= ${fmt(ans)} €` };
  }
  if (d === 2) {
    const a = ri(12, 987) / 100, f = pick([10, 100]);
    const ans = Math.round(a * f * 100) / 100;
    return { text: `${fmt(a)} · ${f} = ?`, answer: ans, hint: `Verschiebe das Komma um ${f === 10 ? 'eine Stelle' : 'zwei Stellen'} nach rechts.`, solution: `= ${fmt(ans)}` };
  }
  const a = ri(500, 2000) / 100, b = ri(100, 499) / 100;
  const ans = Math.round((a - b) * 100) / 100;
  return { text: `${fmt(a)} − ${fmt(b)} = ?`, answer: ans, hint: 'Schriftlich subtrahieren, Komma unter Komma.', solution: `= ${fmt(ans)}` };
});

def('ggt_kgv', 'Teiler & Vielfache', 3, (d) => {
  if (d <= 2) {
    const g = pick([4, 6, 8, 12]);
    const [f1, f2] = pick([[2, 3], [3, 5], [2, 5], [3, 7], [4, 5]]);
    const a = g * f1, b = g * f2;
    return { text: `Bestimme den ggT von ${a} und ${b}.`, answer: gcd(a, b), hint: 'Zerlege beide Zahlen in ihre Teiler.', solution: `ggT(${a}, ${b}) = ${gcd(a, b)}` };
  }
  const a = pick([4, 6, 8, 9]), b = pick([6, 10, 12, 15].filter((x) => x !== a));
  const l = (a * b) / gcd(a, b);
  return { text: `Bestimme das kgV von ${a} und ${b}.`, answer: l, hint: 'Das kgV ist das kleinste gemeinsame Vielfache.', solution: `kgV(${a}, ${b}) = ${l}` };
});

def('prozent', 'Prozentrechnung', 3, (d) => {
  if (d === 1) {
    const p = pick([10, 20, 25, 50, 75]), G = ri(2, 20) * 20;
    return { text: `Berechne ${p} % von ${G} €.`, answer: (G * p) / 100, unit: '€', hint: `${p} % = ${p}/100.`, solution: `${G} · ${p}/100 = ${fmt((G * p) / 100)} €` };
  }
  if (d === 2) {
    const b = pick([20, 40, 50, 80, 200]), r = pick([10, 20, 25, 50]);
    const a = (b * r) / 100;
    return { text: `Wie viel Prozent sind ${fmt(a)} von ${b}?`, answer: r, unit: '%', hint: 'Prozentsatz = Prozentwert : Grundwert · 100.', solution: `${fmt(a)} : ${b} · 100 = ${r} %` };
  }
  const G = ri(2, 12) * 50, p = pick([10, 20, 25, 40]);
  const W = (G * p) / 100;
  return { text: `${p} % eines Betrags sind ${fmt(W)} €.\nWie hoch ist der ganze Betrag (Grundwert)?`, answer: G, unit: '€', hint: 'Grundwert = Prozentwert : Prozentsatz · 100.', solution: `${fmt(W)} : ${p} · 100 = ${G} €` };
});

def('negativ', 'Rationale Zahlen', 3, (d) => {
  if (d === 1) {
    const a = ri(2, 15), b = ri(a + 1, 25);
    return { text: `${a} − ${b} = ?`, answer: a - b, hint: 'Das Ergebnis ist negativ.', solution: `${a} − ${b} = ${a - b}` };
  }
  if (d === 2) {
    const a = ri(2, 9), b = ri(2, 9);
    return { text: `(−${a}) · ${b} = ?`, answer: -a * b, hint: 'Minus mal Plus ergibt Minus.', solution: `(−${a}) · ${b} = ${-a * b}` };
  }
  const t = ri(-9, -2), diff = ri(5, 15);
  return { text: `Morgens sind es ${t} °C. Bis mittags steigt die Temperatur um ${diff} °C.\nWie warm ist es mittags?`, answer: t + diff, unit: '°C', hint: 'Auf der Zahlengeraden nach rechts gehen.', solution: `${t} + ${diff} = ${t + diff} °C` };
});

def('dreisatz', 'Dreisatz & Zuordnungen', 2, (d) => {
  const per = pick([0.5, 1, 1.5, 2, 2.5, 3]);
  const a = ri(2, 5);
  let b = ri(2, 9);
  if (b === a) b = a + 2;
  const cost = a * per, ans = Math.round(b * per * 100) / 100;
  const item = pick(['Äpfel', 'Birnen', 'Kartoffeln', 'Tomaten']);
  return {
    text: `${a} kg ${item} kosten ${fmt(cost)} €.\nWie viel kosten ${b} kg?`,
    answer: ans, unit: '€',
    hint: 'Rechne zuerst den Preis für 1 kg aus.',
    solution: `1 kg = ${fmt(per)} € → ${b} kg = ${fmt(ans)} €`,
  };
});

// ---------- Klasse 7–9: Algebra ----------

def('lingl', 'Lineare Gleichungen', 3, (d) => {
  if (d === 1) {
    const x = ri(2, 20), b = ri(2, 30);
    return { text: `Löse:  x + ${b} = ${x + b}`, answer: x, hint: `Subtrahiere ${b} auf beiden Seiten.`, solution: `x = ${x + b} − ${b} = ${x}` };
  }
  if (d === 2) {
    const x = ri(-9, 9), a = ri(2, 7), b = ri(-10, 10);
    const c = a * x + b;
    return { text: `Löse:  ${a}x${term(b)} = ${c}`, answer: x, hint: `Erst ${b >= 0 ? '−' : '+'} ${Math.abs(b)}, dann durch ${a} teilen.`, solution: `${a}x = ${c - b} → x = ${x}` };
  }
  const x = ri(-6, 8), a = ri(3, 7), c = ri(1, a - 1), b = ri(-8, 8);
  const dd = (a - c) * x + b;
  return { text: `Löse:  ${a}x${term(b)} = ${c}x${term(dd)}`, answer: x, hint: 'Bringe alle x auf eine Seite, alle Zahlen auf die andere.', solution: `${a - c}x = ${dd - b} → x = ${x}` };
});

def('binom', 'Binomische Formeln', 3, (d) => {
  const a = ri(1, 9);
  let q, correct, wrongs;
  if (d === 1) {
    q = `Multipliziere aus:  (x + ${a})²`;
    correct = `x²${term(2 * a, 'x')}${term(a * a)}`;
    wrongs = [`x²${term(a * a)}`, `x²${term(a, 'x')}${term(a * a)}`, `x²${term(2 * a, 'x')}${term(2 * a)}`];
  } else if (d === 2) {
    q = `Multipliziere aus:  (x − ${a})²`;
    correct = `x²${term(-2 * a, 'x')}${term(a * a)}`;
    wrongs = [`x²${term(2 * a, 'x')}${term(a * a)}`, `x²${term(-2 * a, 'x')}${term(-a * a)}`, `x²${term(-a * a)}`];
  } else {
    q = `Multipliziere aus:  (x + ${a})(x − ${a})`;
    correct = `x²${term(-a * a)}`;
    wrongs = [`x²${term(a * a)}`, `x²${term(-2 * a, 'x')}${term(-a * a)}`, `x²${term(2 * a, 'x')}${term(a * a)}`];
  }
  const choices = shuffle([correct, ...wrongs]);
  return {
    text: q, type: 'choice', choices, answerIndex: choices.indexOf(correct),
    hint: '(a ± b)² = a² ± 2ab + b² · (a+b)(a−b) = a² − b².',
    solution: correct,
  };
});

def('linfkt', 'Lineare Funktionen', 3, (d) => {
  if (d <= 2) {
    const x1 = ri(-3, 3), m = d === 1 ? ri(1, 5) : ri(-5, -1), dx = ri(1, 4);
    const y1 = ri(-5, 5);
    const x2 = x1 + dx, y2 = y1 + m * dx;
    return {
      text: `Eine Gerade geht durch P(${x1}|${y1}) und Q(${x2}|${y2}).\nBestimme die Steigung m.`,
      answer: m,
      hint: 'm = (y₂ − y₁) : (x₂ − x₁).',
      solution: `m = (${y2} − ${y1}) : (${x2} − ${x1}) = ${m}`,
    };
  }
  const m = ri(-4, 4) || 2, x = ri(-4, 4), b = ri(-6, 6);
  const y = m * x + b;
  return {
    text: `Eine Gerade mit Steigung m = ${m} geht durch P(${x}|${y}).\nBestimme den y-Achsenabschnitt b.`,
    answer: b,
    hint: 'Setze in y = m·x + b ein und stelle nach b um.',
    solution: `b = ${y} − ${m}·${x} = ${b}`,
  };
});

def('potenz', 'Potenzgesetze', 3, (d) => {
  const a = pick([2, 3, 5, 10, 'x']);
  if (d === 1) {
    const m = ri(2, 6), n = ri(2, 6);
    return { text: `Vereinfache:  ${a}${sup(m)} · ${a}${sup(n)} = ${a}${sup('?')}\nGib den Exponenten an.`, answer: m + n, hint: 'Bei gleicher Basis: Exponenten addieren.', solution: `${a}${sup(m)} · ${a}${sup(n)} = ${a}${sup(m + n)}` };
  }
  if (d === 2) {
    const m = ri(2, 5), n = ri(2, 4);
    return { text: `Vereinfache:  (${a}${sup(m)})${sup(n)} = ${a}${sup('?')}\nGib den Exponenten an.`, answer: m * n, hint: 'Potenz einer Potenz: Exponenten multiplizieren.', solution: `(${a}${sup(m)})${sup(n)} = ${a}${sup(m * n)}` };
  }
  const m = ri(2, 5), n = ri(m + 1, 8);
  return { text: `Vereinfache:  ${a}${sup(m)} : ${a}${sup(n)} = ${a}${sup('?')}\nGib den Exponenten an.`, answer: m - n, hint: 'Exponenten subtrahieren – das Ergebnis kann negativ sein.', solution: `${a}${sup(m)} : ${a}${sup(n)} = ${a}${sup(m - n)}` };
});

def('wurzel', 'Wurzeln', 3, (d) => {
  if (d === 1) {
    const k = ri(4, 15);
    return { text: `√${k * k} = ?`, answer: k, hint: 'Welche Zahl mal sich selbst ergibt das?', solution: `√${k * k} = ${k}` };
  }
  if (d === 2) {
    const k1 = ri(5, 12), k2 = ri(4, 9);
    return { text: `√${k1 * k1} + √${k2 * k2} = ?`, answer: k1 + k2, hint: 'Ziehe beide Wurzeln einzeln.', solution: `${k1} + ${k2} = ${k1 + k2}` };
  }
  const a = pick([4, 9, 16, 25]), b = pick([25, 36, 49, 100]);
  return { text: `√(${a} · ${b}) = ?`, answer: Math.sqrt(a * b), hint: '√(a·b) = √a · √b.', solution: `√${a} · √${b} = ${Math.sqrt(a)} · ${Math.sqrt(b)} = ${Math.sqrt(a * b)}` };
});

def('quadr', 'Quadratische Gleichungen', 3, (d) => {
  const range = d === 3 ? 9 : 6;
  let r1 = ri(-range, range), r2 = ri(-range, range);
  if (r1 === r2) r2 = r1 + ri(1, 3);
  const lo = Math.min(r1, r2), hi = Math.max(r1, r2);
  const p = -(lo + hi), q = lo * hi;
  return {
    text: `Löse:  x²${term(p, 'x')}${term(q)} = 0\nGib die größere Lösung an.`,
    answer: hi,
    hint: 'p-q-Formel: x = −p/2 ± √((p/2)² − q).',
    solution: `x₁ = ${lo}, x₂ = ${hi} → größere Lösung: ${hi}`,
  };
});

def('pyth', 'Satz des Pythagoras', 3, (d) => {
  const triple = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]);
  const k = d === 3 ? ri(2, 3) : 1;
  const [a, b, c] = triple.map((v) => v * k);
  if (d <= 2) {
    return {
      text: `Ein rechtwinkliges Dreieck hat die Katheten a = ${a} cm und b = ${b} cm.\nWie lang ist die Hypotenuse c?`,
      answer: c, unit: 'cm',
      hint: 'c² = a² + b².',
      solution: `c = √(${a}² + ${b}²) = √${a * a + b * b} = ${c} cm`,
    };
  }
  return {
    text: `Ein rechtwinkliges Dreieck hat die Hypotenuse c = ${c} cm und die Kathete a = ${a} cm.\nWie lang ist die Kathete b?`,
    answer: b, unit: 'cm',
    hint: 'b² = c² − a².',
    solution: `b = √(${c}² − ${a}²) = ${b} cm`,
  };
});

// ---------- Klasse 10–13: Analysis, Geometrie, Stochastik ----------

def('trig', 'Trigonometrie', 3, (d) => {
  if (d === 1) {
    const c = ri(3, 12) * 2;
    return {
      text: `Rechtwinkliges Dreieck: α = 30°, Hypotenuse c = ${c} cm.\nWie lang ist die Gegenkathete von α?`,
      answer: c / 2, unit: 'cm',
      hint: 'sin(30°) = 0,5 = Gegenkathete : Hypotenuse.',
      solution: `GK = ${c} · sin(30°) = ${c} · 0,5 = ${c / 2} cm`,
    };
  }
  if (d === 2) {
    const c = ri(4, 12) * 2, gk = c / 2;
    return {
      text: `Rechtwinkliges Dreieck: Gegenkathete ${gk} cm, Hypotenuse ${c} cm.\nWie groß ist der Winkel α (in Grad)?`,
      answer: 30, unit: '°',
      hint: `sin(α) = ${gk}/${c} = 0,5.`,
      solution: `sin(α) = 0,5 → α = 30°`,
    };
  }
  const ak = ri(4, 15);
  return {
    text: `Rechtwinkliges Dreieck: α = 45°, Ankathete ${ak} cm.\nWie lang ist die Gegenkathete?`,
    answer: ak, unit: 'cm',
    hint: 'tan(45°) = 1.',
    solution: `GK = ${ak} · tan(45°) = ${ak} cm`,
  };
});

def('expo', 'Exponentielles Wachstum', 3, (d) => {
  if (d <= 2) {
    const a = ri(2, 9) * 100, n = ri(3, d === 1 ? 4 : 6);
    const verb = d === 1 ? 'verdoppelt' : 'verdreifacht';
    const q2 = d === 1 ? 2 : 3;
    return {
      text: `Eine Bakterienkultur startet mit ${a} Bakterien und ${verb} sich jede Stunde.\nWie viele sind es nach ${n} Stunden?`,
      answer: a * q2 ** n,
      hint: `Anzahl = ${a} · ${q2}${sup('n')}.`,
      solution: `${a} · ${q2}${sup(n)} = ${a * q2 ** n}`,
    };
  }
  const a = pick([1600, 3200, 6400]), n = ri(3, 5);
  return {
    text: `Ein Medikament im Blut halbiert sich jede Stunde. Start: ${a} mg.\nWie viel mg sind es nach ${n} Stunden?`,
    answer: a / 2 ** n, unit: 'mg',
    hint: `Menge = ${a} · (1/2)${sup('n')}.`,
    solution: `${a} : ${2 ** n} = ${fmt(a / 2 ** n)} mg`,
  };
});

def('log', 'Logarithmen', 3, (d) => {
  if (d === 1) {
    const k = ri(3, 8);
    return { text: `log₂(${2 ** k}) = ?`, answer: k, hint: '2 hoch was ergibt die Zahl?', solution: `2${sup(k)} = ${2 ** k} → log₂ = ${k}` };
  }
  if (d === 2) {
    const k = ri(2, 6);
    return { text: `log₁₀(${10 ** k}) = ?`, answer: k, hint: 'Zähle die Nullen.', solution: `10${sup(k)} = ${10 ** k} → log₁₀ = ${k}` };
  }
  const k = ri(4, 9);
  return { text: `Löse:  2ˣ = ${2 ** k}`, answer: k, hint: 'Schreibe die rechte Seite als Zweierpotenz.', solution: `2${sup(k)} = ${2 ** k} → x = ${k}` };
});

def('abl', 'Ableitungen', 3, (d) => {
  if (d === 1) {
    const x0 = ri(1, 6);
    return { text: `f(x) = x²\nBerechne f′(${x0}).`, answer: 2 * x0, hint: 'f′(x) = 2x (Potenzregel).', solution: `f′(x) = 2x → f′(${x0}) = ${2 * x0}` };
  }
  if (d === 2) {
    const a = ri(1, 2), x0 = ri(1, 3);
    return { text: `f(x) = ${a === 1 ? '' : a}x³\nBerechne f′(${x0}).`, answer: 3 * a * x0 * x0, hint: `f′(x) = ${3 * a}x².`, solution: `f′(${x0}) = ${3 * a} · ${x0}² = ${3 * a * x0 * x0}` };
  }
  const b = ri(2, 8);
  return { text: `f(x) = x² − ${2 * b}x\nFür welches x gilt f′(x) = 0?`, answer: b, hint: `f′(x) = 2x − ${2 * b}.`, solution: `2x − ${2 * b} = 0 → x = ${b}` };
});

def('integ', 'Integrale', 3, (d) => {
  if (d === 1) {
    const b = ri(2, 6);
    return { text: `∫₀${sup(b)} 2x dx = ?`, answer: b * b, hint: 'Stammfunktion von 2x ist x².', solution: `[x²]₀${sup(b)} = ${b}² = ${b * b}` };
  }
  if (d === 2) {
    const b = ri(2, 4);
    return { text: `∫₀${sup(b)} 3x² dx = ?`, answer: b ** 3, hint: 'Stammfunktion von 3x² ist x³.', solution: `[x³]₀${sup(b)} = ${b}³ = ${b ** 3}` };
  }
  const b = ri(2, 6);
  return { text: `∫₁${sup(b)} 2x dx = ?`, answer: b * b - 1, hint: 'Obere minus untere Grenze einsetzen.', solution: `[x²]₁${sup(b)} = ${b * b} − 1 = ${b * b - 1}` };
});

def('vek', 'Vektoren: Betrag', 3, (d) => {
  if (d <= 2) {
    const [x, y, l] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 6, 10]]);
    return { text: `Berechne den Betrag des Vektors  v = (${x} | ${y}).`, answer: l, hint: '|v| = √(x² + y²).', solution: `|v| = √(${x}² + ${y}²) = ${l}` };
  }
  const [x, y, z, l] = pick([[1, 2, 2, 3], [2, 3, 6, 7], [4, 4, 7, 9], [2, 6, 9, 11]]);
  return { text: `Berechne den Betrag des Vektors  v = (${x} | ${y} | ${z}).`, answer: l, hint: '|v| = √(x² + y² + z²).', solution: `|v| = √(${x * x} + ${y * y} + ${z * z}) = ${l}` };
});

def('skalar', 'Skalarprodukt', 3, (d) => {
  if (d <= 2) {
    const a1 = ri(-5, 6) || 2, a2 = ri(-5, 6) || 3, b1 = ri(-5, 6) || 1, b2 = ri(-5, 6) || -2;
    const ans = a1 * b1 + a2 * b2;
    return {
      text: `a = (${a1} | ${a2}),  b = (${b1} | ${b2})\nBerechne das Skalarprodukt a · b.`,
      answer: ans,
      hint: 'a · b = a₁·b₁ + a₂·b₂.',
      solution: `${a1}·${b1} + ${a2}·${b2} = ${ans}`,
    };
  }
  const a1 = pick([2, 3, 4]), m = pick([-3, -2, 2, 3]), b2 = ri(1, 4);
  const a2 = a1 * m, t = -m * b2;
  return {
    text: `Für welches t sind  a = (${a1} | ${a2})  und  b = (t | ${b2})  orthogonal?`,
    answer: t,
    hint: 'Orthogonal bedeutet: Skalarprodukt = 0.',
    solution: `${a1}·t + ${a2}·${b2} = 0 → t = ${t}`,
  };
});

def('wkeit', 'Wahrscheinlichkeit', 3, (d) => {
  if (d === 1) {
    const variant = pick([
      { q: 'Du würfelst einmal.\nWie groß ist die Wahrscheinlichkeit für eine gerade Zahl?', p: [1, 2] },
      { q: 'Du würfelst einmal.\nWie groß ist die Wahrscheinlichkeit für eine 6?', p: [1, 6] },
      { q: 'Du würfelst einmal.\nWie groß ist die Wahrscheinlichkeit für eine Zahl größer als 4?', p: [1, 3] },
    ]);
    return {
      text: variant.q, answer: variant.p[0] / variant.p[1], answerText: frac(...variant.p), inputMode: 'text',
      hint: 'Günstige Ergebnisse : mögliche Ergebnisse. Antwort als Bruch, z. B. 1/2.',
      solution: `P = ${frac(...variant.p)}`,
    };
  }
  if (d === 2) {
    const r = ri(2, 6), bl = ri(2, 6);
    return {
      text: `In einer Urne liegen ${r} rote und ${bl} blaue Kugeln. Du ziehst eine Kugel.\nWie groß ist die Wahrscheinlichkeit für Rot?`,
      answer: r / (r + bl), answerText: frac(r, r + bl), inputMode: 'text',
      hint: `Insgesamt sind ${r + bl} Kugeln in der Urne. Antwort als Bruch.`,
      solution: `P(rot) = ${frac(r, r + bl)}`,
    };
  }
  const variant = pick([
    { q: 'Du wirfst zwei Münzen.\nWie groß ist die Wahrscheinlichkeit für genau einmal Kopf?', p: [1, 2] },
    { q: 'Du wirfst zwei Würfel.\nWie groß ist die Wahrscheinlichkeit für die Augensumme 7?', p: [1, 6] },
    { q: 'Du wirfst zwei Münzen.\nWie groß ist die Wahrscheinlichkeit für zweimal Kopf?', p: [1, 4] },
  ]);
  return {
    text: variant.q, answer: variant.p[0] / variant.p[1], answerText: frac(...variant.p), inputMode: 'text',
    hint: 'Zeichne ein Baumdiagramm. Antwort als Bruch.',
    solution: `P = ${frac(...variant.p)}`,
  };
});
