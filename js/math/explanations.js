// ============================================================
// Ausführliche Erklärungen zu jedem Aufgabenthema.
// Wichtigster Lern-Baustein des Spiels: wird nach jeder Aufgabe
// angeboten und ist im Lernheft (Buch-Symbol) jederzeit abrufbar.
//
// Struktur pro Thema:
//   title   – Überschrift
//   intro   – Was ist das? Warum braucht man es?
//   steps   – So gehst du Schritt für Schritt vor
//   example – Durchgerechnetes Beispiel mit Rechenweg
//   merke   – Merksatz
// ============================================================

export const EXPLANATIONS = {

  // ---------- Klasse 5/6 ----------

  nz_addsub: {
    title: 'Addieren & Subtrahieren',
    intro: 'Addieren (+) heißt zusammenzählen, Subtrahieren (−) heißt abziehen. Große Zahlen rechnest du am sichersten schriftlich – Stelle für Stelle, genau wie an einer Stellenwerttafel.',
    steps: [
      'Schreibe die Zahlen stellengerecht untereinander: Einer unter Einer, Zehner unter Zehner, Hunderter unter Hunderter.',
      'Beginne rechts bei den Einern und arbeite dich nach links vor.',
      'Wird eine Spalte beim Addieren größer als 9, schreibst du nur die Einerziffer hin und nimmst 1 als Übertrag mit in die nächste Spalte.',
      'Beim Subtrahieren: Reicht die obere Ziffer nicht, „borgst“ du dir eine 1 von der nächsthöheren Stelle.',
      'Kontrolle: Überschlage vorher grob (z. B. 476 + 258 ≈ 500 + 250 = 750) – so erkennst du grobe Fehler sofort.',
    ],
    example: {
      problem: '476 + 258',
      steps: [
        'Einer: 6 + 8 = 14 → 4 hinschreiben, 1 Übertrag',
        'Zehner: 7 + 5 + 1 = 13 → 3 hinschreiben, 1 Übertrag',
        'Hunderter: 4 + 2 + 1 = 7',
      ],
      result: '476 + 258 = 734',
    },
    merke: 'Immer Stellenwert unter Stellenwert schreiben – und die Überträge nie vergessen!',
  },

  nz_muldiv: {
    title: 'Multiplizieren & Dividieren',
    intro: 'Multiplizieren (·) ist wiederholtes Addieren: 3 · 4 bedeutet 4 + 4 + 4. Dividieren (:) ist das Gegenteil – gerechtes Aufteilen. Beide Rechenarten gehören zusammen: 24 : 6 = 4, weil 4 · 6 = 24.',
    steps: [
      'Lerne das kleine Einmaleins auswendig – es steckt in jeder großen Multiplikation.',
      'Zerlege große Aufgaben: 23 · 7 = 20 · 7 + 3 · 7 = 140 + 21 = 161.',
      'Beim Dividieren frage: „Wie oft passt der Teiler in die Zahl?“',
      'Mache immer die Probe: Ergebnis · Teiler muss die Ausgangszahl ergeben.',
    ],
    example: {
      problem: '24 · 13',
      steps: [
        'Zerlegen: 24 · 13 = 24 · 10 + 24 · 3',
        '24 · 10 = 240',
        '24 · 3 = 72',
        '240 + 72 = 312',
      ],
      result: '24 · 13 = 312',
    },
    merke: 'Zerlegen macht große Aufgaben klein: erst mit den Zehnern, dann mit den Einern rechnen.',
  },

  runden: {
    title: 'Runden',
    intro: 'Runden macht Zahlen einfacher, ohne sie stark zu verfälschen. Das brauchst du zum Überschlagen und um Ergebnisse schnell zu prüfen.',
    steps: [
      'Markiere die Rundungsstelle (Zehner, Hunderter, Tausender …).',
      'Schaue auf die Ziffer direkt rechts daneben – nur diese eine Ziffer entscheidet!',
      'Ist sie 0, 1, 2, 3 oder 4 → abrunden (Rundungsstelle bleibt).',
      'Ist sie 5, 6, 7, 8 oder 9 → aufrunden (Rundungsstelle wird um 1 größer).',
      'Alle Stellen rechts von der Rundungsstelle werden zu Nullen.',
    ],
    example: {
      problem: 'Runde 3 862 auf Hunderter',
      steps: [
        'Rundungsstelle: die 8 (Hunderter)',
        'Ziffer rechts daneben: 6 → aufrunden',
        '8 wird zu 9, Rest wird zu Nullen',
      ],
      result: '3 862 ≈ 3 900',
    },
    merke: 'Die Nachbarziffer entscheidet: ab 5 wird aufgerundet.',
  },

  einheiten: {
    title: 'Größen & Einheiten',
    intro: 'Längen, Gewichte und Zeiten kann man in verschiedenen Einheiten angeben. Zum Umwandeln brauchst du die Umrechnungszahl – sie sagt, wie oft die kleine Einheit in die große passt.',
    steps: [
      'Umrechnungszahlen kennen: 1 m = 100 cm, 1 km = 1000 m, 1 kg = 1000 g, 1 h = 60 min, 1 min = 60 s.',
      'Von der großen in die kleine Einheit (z. B. m → cm): multiplizieren.',
      'Von der kleinen in die große Einheit (z. B. cm → m): dividieren.',
      'Bei Kommazahlen verschiebst du einfach das Komma – so viele Stellen, wie die Umrechnungszahl Nullen hat.',
    ],
    example: {
      problem: '350 cm in m umwandeln',
      steps: [
        'cm → m: von klein nach groß, also dividieren',
        'Umrechnungszahl 100 → durch 100 teilen',
        '350 : 100 = 3,5 (Komma 2 Stellen nach links)',
      ],
      result: '350 cm = 3,5 m',
    },
    merke: 'Klein → groß: teilen. Groß → klein: mal nehmen. Achtung: Bei Stunden und Minuten ist die Umrechnungszahl 60, nicht 100!',
  },

  rechteck: {
    title: 'Flächeninhalt & Umfang',
    intro: 'Der Flächeninhalt A sagt, wie viel Platz eine Figur bedeckt (z. B. wie viele 1-cm-Quadrate hineinpassen). Der Umfang U ist die Länge des Weges einmal außen herum.',
    steps: [
      'Rechteck-Fläche: A = Länge · Breite. Stell dir Kästchenreihen vor: b Reihen mit je a Kästchen.',
      'Rechteck-Umfang: U = 2 · (a + b), denn jede Seite kommt zweimal vor.',
      'Rückwärtsaufgabe: Ist A bekannt und eine Seite gesucht, teile: b = A : a.',
      'Einheiten beachten: Fläche in cm² (Quadratzentimeter), Umfang in cm.',
    ],
    example: {
      problem: 'Rechteck mit a = 7 cm und b = 4 cm',
      steps: [
        'Fläche: A = 7 · 4 = 28 cm²',
        'Umfang: U = 2 · (7 + 4) = 2 · 11 = 22 cm',
      ],
      result: 'A = 28 cm², U = 22 cm',
    },
    merke: 'Fläche = mal rechnen (cm²), Umfang = alle Seiten zusammen (cm).',
  },

  brueche: {
    title: 'Brüche',
    intro: 'Ein Bruch beschreibt einen Teil von einem Ganzen: Der Nenner (unten) sagt, in wie viele gleiche Teile geteilt wurde, der Zähler (oben), wie viele Teile du davon nimmst. 3/4 einer Pizza = Pizza in 4 Teile schneiden, 3 nehmen.',
    steps: [
      'Addieren geht nur gleichnamig! Bringe beide Brüche erst auf denselben Nenner (Erweitern auf das kgV).',
      'Dann: Zähler addieren, Nenner bleibt gleich.',
      'Multiplizieren ist einfacher: Zähler · Zähler und Nenner · Nenner.',
      'Kürze am Ende immer so weit wie möglich (Zähler und Nenner durch dieselbe Zahl teilen).',
      'Erweitern und Kürzen ändern den Wert des Bruchs nicht – nur seine Schreibweise.',
    ],
    example: {
      problem: '2/3 + 1/4',
      steps: [
        'Gemeinsamer Nenner: kgV(3, 4) = 12',
        '2/3 = 8/12 (mit 4 erweitert), 1/4 = 3/12 (mit 3 erweitert)',
        '8/12 + 3/12 = 11/12',
      ],
      result: '2/3 + 1/4 = 11/12',
    },
    merke: 'Erst gleichnamig machen, dann Zähler addieren. Niemals Nenner + Nenner rechnen!',
  },

  dezimal: {
    title: 'Dezimalzahlen',
    intro: 'Dezimalzahlen sind Brüche mit den Nennern 10, 100, 1000 …: 0,7 = 7/10 und 0,25 = 25/100. Nach dem Komma kommen die Zehntel, Hundertstel und Tausendstel.',
    steps: [
      'Addieren/Subtrahieren: Schreibe Komma unter Komma und fülle fehlende Stellen mit Nullen auf.',
      'Dann rechnest du schriftlich wie mit ganzen Zahlen – das Komma wandert gerade nach unten ins Ergebnis.',
      'Mal 10, 100, 1000: Komma um 1, 2, 3 Stellen nach rechts.',
      'Geteilt durch 10, 100, 1000: Komma nach links.',
    ],
    example: {
      problem: '12,5 − 3,75',
      steps: [
        'Untereinander mit aufgefüllter Null: 12,50 − 3,75',
        'Hundertstel: 0 − 5 geht nicht → borgen: 10 − 5 = 5',
        'Zehntel: 4 − 7 geht nicht → borgen: 14 − 7 = 7',
        'Einer/Zehner: 11 − 3 = 8',
      ],
      result: '12,5 − 3,75 = 8,75',
    },
    merke: 'Komma unter Komma – und fehlende Stellen mit Nullen auffüllen.',
  },

  ggt_kgv: {
    title: 'ggT & kgV',
    intro: 'Der ggT (größter gemeinsamer Teiler) ist die größte Zahl, die zwei Zahlen beide teilt. Das kgV (kleinstes gemeinsames Vielfaches) ist die kleinste Zahl, die in beiden Vielfachenreihen vorkommt.',
    steps: [
      'Zerlege beide Zahlen in Primfaktoren (oder liste ihre Teiler bzw. Vielfachen auf).',
      'ggT: Multipliziere alle gemeinsamen Primfaktoren.',
      'kgV: Nimm jeden Primfaktor so oft, wie er höchstens vorkommt – oder rechne kgV = a · b : ggT.',
      'Anwendung: Mit dem ggT kürzt du Brüche, mit dem kgV machst du sie gleichnamig.',
    ],
    example: {
      problem: 'ggT und kgV von 24 und 36',
      steps: [
        '24 = 2 · 2 · 2 · 3 und 36 = 2 · 2 · 3 · 3',
        'Gemeinsam: 2 · 2 · 3 = 12 → ggT = 12',
        'kgV = 24 · 36 : 12 = 72',
      ],
      result: 'ggT = 12, kgV = 72',
    },
    merke: 'ggT zum Kürzen, kgV für den gemeinsamen Nenner.',
  },

  // ---------- Klasse 6/7 ----------

  prozent: {
    title: 'Prozentrechnung',
    intro: 'Prozent heißt „von Hundert“: 25 % = 25/100 = 0,25. Es gibt drei Größen: den Grundwert G (das Ganze, 100 %), den Prozentwert W (der Anteil) und den Prozentsatz p % (wie viel Hundertstel).',
    steps: [
      'Prozentwert gesucht: W = G · p/100 („p % von G“).',
      'Prozentsatz gesucht: p = W : G · 100.',
      'Grundwert gesucht: G = W : p · 100.',
      'Alternativ immer möglich: der Dreisatz über 1 % (Grundwert : 100 = 1 %).',
      'Merkhilfe: „von“ bedeutet „mal“ – 20 % von 150 heißt 0,2 · 150.',
    ],
    example: {
      problem: '20 % von 150 €',
      steps: [
        '20 % = 20/100 = 0,2',
        'W = 150 · 0,2 = 30',
        'Kontrolle per Dreisatz: 1 % = 1,50 € → 20 % = 30 €',
      ],
      result: '20 % von 150 € = 30 €',
    },
    merke: 'W = G · p/100 — und „von“ heißt „mal“.',
  },

  negativ: {
    title: 'Negative Zahlen',
    intro: 'Negative Zahlen liegen auf der Zahlengeraden links von der Null. Du kennst sie von Temperaturen (−5 °C) oder Kontoständen (Schulden). Mit ihnen kann man ganz normal rechnen – man muss nur die Vorzeichenregeln kennen.',
    steps: [
      'Stelle dir die Zahlengerade vor: Plus geht nach rechts, Minus nach links.',
      'Eine negative Zahl subtrahieren = addieren: 5 − (−3) = 5 + 3 = 8.',
      'Multiplizieren/Dividieren: gleiche Vorzeichen → Ergebnis positiv, verschiedene Vorzeichen → Ergebnis negativ.',
      'Also: (−) · (−) = (+) und (−) · (+) = (−).',
    ],
    example: {
      problem: '(−4) · 5 und (−4) · (−5)',
      steps: [
        '(−4) · 5: verschiedene Vorzeichen → negativ → −20',
        '(−4) · (−5): gleiche Vorzeichen → positiv → +20',
      ],
      result: '(−4) · 5 = −20 und (−4) · (−5) = 20',
    },
    merke: 'Minus mal Minus ergibt Plus.',
  },

  dreisatz: {
    title: 'Dreisatz',
    intro: 'Der Dreisatz hilft bei proportionalen Zuordnungen: doppelt so viel kostet doppelt so viel. Der Trick: Rechne erst auf 1 Einheit herunter, dann auf die gesuchte Menge hoch.',
    steps: [
      'Schritt 1: Notiere, was gegeben ist (z. B. 3 kg → 6 €).',
      'Schritt 2: Rechne auf 1 Einheit herunter – dividiere beide Seiten (1 kg → 2 €).',
      'Schritt 3: Rechne auf die gesuchte Menge hoch – multipliziere beide Seiten (5 kg → 10 €).',
      'Eine kleine Tabelle mit zwei Spalten hält alles übersichtlich.',
    ],
    example: {
      problem: '3 kg Äpfel kosten 6 €. Was kosten 5 kg?',
      steps: [
        '3 kg → 6 €',
        ': 3 auf beiden Seiten: 1 kg → 2 €',
        '· 5 auf beiden Seiten: 5 kg → 10 €',
      ],
      result: '5 kg kosten 10 €',
    },
    merke: 'Erst runter auf 1, dann rauf aufs Ziel.',
  },

  // ---------- Klasse 7–9 ----------

  lingl: {
    title: 'Lineare Gleichungen',
    intro: 'Eine Gleichung ist wie eine Waage im Gleichgewicht: Links und rechts vom = steht gleich viel. Gesucht ist die Zahl x, für die das stimmt. Damit die Waage im Gleichgewicht bleibt, musst du auf beiden Seiten immer dasselbe tun.',
    steps: [
      'Ziel: x soll ganz allein auf einer Seite stehen.',
      'Schaffe erst die Zahlen weg: +5 auf der x-Seite? Dann −5 auf beiden Seiten.',
      'Teile zum Schluss durch die Zahl vor dem x.',
      'Steht x auf beiden Seiten: Bringe erst alle x-Terme auf eine Seite (z. B. −2x auf beiden Seiten).',
      'Mache die Probe: Setze deine Lösung in die Original-Gleichung ein.',
    ],
    example: {
      problem: '3x + 5 = 17',
      steps: [
        '| −5 auf beiden Seiten: 3x = 12',
        '| : 3 auf beiden Seiten: x = 4',
        'Probe: 3 · 4 + 5 = 17 ✓',
      ],
      result: 'x = 4',
    },
    merke: 'Was du links tust, musst du auch rechts tun – die Waage bleibt im Gleichgewicht.',
  },

  binom: {
    title: 'Binomische Formeln',
    intro: 'Die drei binomischen Formeln sind Abkürzungen zum Ausmultiplizieren von Klammern. Sie entstehen, wenn du (a + b)(a + b) Schritt für Schritt ausmultiplizierst – dann siehst du, woher das mittlere Glied 2ab kommt: aus ab + ba.',
    steps: [
      '1. Formel: (a + b)² = a² + 2ab + b²',
      '2. Formel: (a − b)² = a² − 2ab + b²',
      '3. Formel: (a + b)(a − b) = a² − b²',
      'Erkenne a und b in der Aufgabe, setze in die passende Formel ein.',
      'Kontrolle im Zweifel: Klammern per Hand ausmultiplizieren (jedes mit jedem).',
    ],
    example: {
      problem: '(x + 5)²',
      steps: [
        'a = x, b = 5 → 1. Formel',
        'a² = x², 2ab = 2 · x · 5 = 10x, b² = 25',
      ],
      result: '(x + 5)² = x² + 10x + 25',
    },
    merke: 'Das mittlere Glied 2ab wird am häufigsten vergessen – (a+b)² ist NICHT a² + b²!',
  },

  linfkt: {
    title: 'Lineare Funktionen',
    intro: 'Eine lineare Funktion y = m·x + b beschreibt eine Gerade. m ist die Steigung (wie steil), b der y-Achsenabschnitt (wo die Gerade die y-Achse schneidet).',
    steps: [
      'Steigung aus zwei Punkten: m = (y₂ − y₁) : (x₂ − x₁) – „Höhenunterschied durch Breitenunterschied“ (Steigungsdreieck).',
      'm > 0: Gerade steigt. m < 0: Gerade fällt. m = 0: waagerecht.',
      'b bestimmen: Setze einen Punkt und m in y = mx + b ein und stelle nach b um.',
      'Zeichnen: Starte bei b auf der y-Achse, gehe 1 nach rechts und m nach oben.',
    ],
    example: {
      problem: 'Gerade durch P(1|3) und Q(3|7)',
      steps: [
        'm = (7 − 3) : (3 − 1) = 4 : 2 = 2',
        'b: 3 = 2 · 1 + b → b = 1',
      ],
      result: 'y = 2x + 1',
    },
    merke: 'Steigung m = Δy : Δx – erst hoch/runter, dann durch die Breite teilen.',
  },

  potenz: {
    title: 'Potenzgesetze',
    intro: 'Eine Potenz ist wiederholtes Multiplizieren: 2⁴ = 2 · 2 · 2 · 2. Die Potenzgesetze kannst du dir immer selbst herleiten, indem du die Faktoren zählst: 2³ · 2⁴ sind 3 + 4 = 7 Zweien.',
    steps: [
      'Gleiche Basis, mal: Exponenten addieren → aᵐ · aⁿ = aᵐ⁺ⁿ',
      'Gleiche Basis, geteilt: Exponenten subtrahieren → aᵐ : aⁿ = aᵐ⁻ⁿ',
      'Potenz einer Potenz: Exponenten multiplizieren → (aᵐ)ⁿ = aᵐ·ⁿ',
      'Negativer Exponent: a⁻ⁿ = 1/aⁿ. Und: a⁰ = 1.',
    ],
    example: {
      problem: '2³ · 2⁴',
      steps: [
        '2³ = 2 · 2 · 2 und 2⁴ = 2 · 2 · 2 · 2',
        'Zusammen: 7 Faktoren 2',
        'Also 2³ · 2⁴ = 2³⁺⁴ = 2⁷ = 128',
      ],
      result: '2³ · 2⁴ = 2⁷',
    },
    merke: 'Gleiche Basis: mal → plus, geteilt → minus, hoch → mal (bei den Exponenten).',
  },

  wurzel: {
    title: 'Wurzeln',
    intro: 'Die Quadratwurzel ist die Umkehrung des Quadrierens: √49 = 7, weil 7² = 49. Die Wurzel fragt also: „Welche Zahl mal sich selbst ergibt das?“',
    steps: [
      'Lerne die Quadratzahlen bis 20² = 400 – dann erkennst du Wurzeln sofort.',
      'Wurzelgesetz: √(a · b) = √a · √b. Damit kannst du Wurzeln vereinfachen.',
      'Genauso: √(a : b) = √a : √b.',
      'Aus negativen Zahlen kann man (in den reellen Zahlen) keine Wurzel ziehen.',
    ],
    example: {
      problem: '√(36 · 25)',
      steps: [
        '√(36 · 25) = √36 · √25',
        '√36 = 6 und √25 = 5',
        '6 · 5 = 30',
      ],
      result: '√(36 · 25) = 30',
    },
    merke: 'Wurzelziehen und Quadrieren heben sich gegenseitig auf.',
  },

  quadr: {
    title: 'Quadratische Gleichungen',
    intro: 'Eine quadratische Gleichung x² + px + q = 0 kann zwei, eine oder keine Lösung haben. Die pq-Formel liefert sie dir direkt – du musst die Gleichung nur vorher in die Normalform bringen (x² allein, alles auf eine Seite).',
    steps: [
      'Normalform herstellen: x² + px + q = 0 (vor dem x² darf nichts stehen – sonst erst teilen!).',
      'pq-Formel: x₁,₂ = −p/2 ± √((p/2)² − q).',
      'Der Ausdruck unter der Wurzel (Diskriminante) verrät die Lösungsanzahl: > 0 zwei, = 0 eine, < 0 keine Lösung.',
      'Schneller Weg (Satz von Vieta): Suche zwei Zahlen, deren Summe −p und deren Produkt q ist – das sind die Lösungen.',
    ],
    example: {
      problem: 'x² − x − 6 = 0',
      steps: [
        'p = −1, q = −6',
        'x₁,₂ = 0,5 ± √(0,25 + 6) = 0,5 ± √6,25 = 0,5 ± 2,5',
        'x₁ = 0,5 − 2,5 = −2 und x₂ = 0,5 + 2,5 = 3',
        'Vieta-Check: −2 + 3 = 1 = −p ✓ und (−2) · 3 = −6 = q ✓',
      ],
      result: 'x₁ = −2, x₂ = 3',
    },
    merke: 'Erst Normalform, dann pq-Formel – und p und q mit Vorzeichen ablesen!',
  },

  pyth: {
    title: 'Satz des Pythagoras',
    intro: 'Im rechtwinkligen Dreieck heißen die beiden Seiten am rechten Winkel Katheten (a, b), die längste Seite gegenüber dem rechten Winkel Hypotenuse (c). Für sie gilt immer: a² + b² = c².',
    steps: [
      'Finde zuerst den rechten Winkel – die Hypotenuse liegt ihm gegenüber.',
      'Hypotenuse gesucht: c = √(a² + b²).',
      'Kathete gesucht: Formel umstellen → a = √(c² − b²).',
      'Achtung: Der Satz gilt NUR im rechtwinkligen Dreieck!',
    ],
    example: {
      problem: 'Katheten a = 6 cm, b = 8 cm – wie lang ist c?',
      steps: [
        'c² = 6² + 8² = 36 + 64 = 100',
        'c = √100 = 10',
      ],
      result: 'c = 10 cm',
    },
    merke: 'Kathete² + Kathete² = Hypotenuse² – die Hypotenuse ist immer die längste Seite.',
  },

  // ---------- Klasse 10–13 ----------

  trig: {
    title: 'Trigonometrie',
    intro: 'Sinus, Kosinus und Tangens verbinden Winkel und Seitenlängen im rechtwinkligen Dreieck. Die Gegenkathete liegt dem Winkel α gegenüber, die Ankathete liegt an ihm an, die Hypotenuse ist die längste Seite.',
    steps: [
      'sin α = Gegenkathete : Hypotenuse',
      'cos α = Ankathete : Hypotenuse',
      'tan α = Gegenkathete : Ankathete',
      'Seite gesucht: Formel wählen, in der der Winkel und eine bekannte Seite vorkommen, dann umstellen.',
      'Winkel gesucht: Umkehrfunktion nutzen (sin⁻¹, cos⁻¹, tan⁻¹ auf dem Taschenrechner).',
      'Wichtige Werte: sin 30° = 0,5 · tan 45° = 1 · cos 60° = 0,5.',
    ],
    example: {
      problem: 'α = 30°, Hypotenuse c = 12 cm. Gegenkathete?',
      steps: [
        'sin α = GK : c → GK = c · sin α',
        'GK = 12 · sin 30° = 12 · 0,5',
      ],
      result: 'Gegenkathete = 6 cm',
    },
    merke: 'GAGA HühnerHof AG: sin = G/H, cos = A/H, tan = G/A.',
  },

  expo: {
    title: 'Exponentielles Wachstum',
    intro: 'Bei exponentiellem Wachstum wird in jedem Schritt mit demselben Faktor q multipliziert (nicht addiert!). Deshalb wächst es erst langsam und dann explosionsartig – wie Bakterien, Zinsen oder Halbierungen bei Medikamenten.',
    steps: [
      'Formel: Endwert = Startwert · qⁿ (n = Anzahl der Schritte).',
      'Verdoppelung: q = 2 · Verdreifachung: q = 3 · Halbierung: q = 1/2.',
      'Prozentuales Wachstum: +5 % pro Schritt heißt q = 1,05; −20 % heißt q = 0,8.',
      'Rückwärtsfrage „nach wie vielen Schritten?“ → führt zum Logarithmus.',
    ],
    example: {
      problem: '200 Bakterien verdoppeln sich stündlich. Wie viele nach 4 Stunden?',
      steps: [
        'q = 2, n = 4',
        '200 · 2⁴ = 200 · 16',
      ],
      result: '3200 Bakterien',
    },
    merke: 'Exponentiell = mal Faktor q pro Schritt, niemals plus!',
  },

  log: {
    title: 'Logarithmen',
    intro: 'Der Logarithmus beantwortet die Frage: „Basis hoch WAS ergibt diese Zahl?“ Zum Beispiel log₂ 8 = 3, weil 2³ = 8. Er ist also die Umkehrung des Potenzierens und der Schlüssel zu Gleichungen wie 2ˣ = 64.',
    steps: [
      'Definition: logₐ(x) = n bedeutet genau aⁿ = x.',
      'Gleichung aˣ = b lösen: x = logₐ(b). Oft hilft es, b als Potenz von a zu schreiben.',
      'log₁₀ von Zehnerpotenzen: einfach die Nullen zählen (log₁₀ 10 000 = 4).',
      'Probe: Setze dein Ergebnis als Exponent ein und prüfe, ob die Zahl herauskommt.',
    ],
    example: {
      problem: 'Löse 2ˣ = 64',
      steps: [
        '64 als Zweierpotenz schreiben: 64 = 2⁶',
        '2ˣ = 2⁶ → Exponenten vergleichen',
      ],
      result: 'x = 6',
    },
    merke: 'Der Logarithmus ist der gesuchte Exponent.',
  },

  abl: {
    title: 'Ableitungen',
    intro: 'Die Ableitung f′(x) gibt die Steigung des Graphen an jeder Stelle an – also wie schnell sich f gerade ändert (Tangentensteigung). Damit findest du z. B. Hoch- und Tiefpunkte.',
    steps: [
      'Potenzregel: (xⁿ)′ = n · xⁿ⁻¹ – „Exponent nach vorn, dann Exponent minus 1“.',
      'Konstanter Faktor bleibt stehen: (a · xⁿ)′ = a · n · xⁿ⁻¹.',
      'Summen werden gliedweise abgeleitet; eine konstante Zahl fällt weg (Ableitung 0).',
      'Steigung an einer Stelle: erst f′(x) bilden, dann die Stelle einsetzen.',
      'f′(x) = 0 lösen → Kandidaten für Hoch- und Tiefpunkte.',
    ],
    example: {
      problem: 'f(x) = x³. Wie groß ist f′(2)?',
      steps: [
        'Potenzregel: f′(x) = 3x²',
        'Einsetzen: f′(2) = 3 · 2² = 3 · 4',
      ],
      result: 'f′(2) = 12',
    },
    merke: 'Exponent nach vorn ziehen, dann Exponent um 1 verkleinern.',
  },

  integ: {
    title: 'Integrale',
    intro: 'Das bestimmte Integral misst die Fläche zwischen Graph und x-Achse. Integrieren ist die Umkehrung des Ableitens: Du suchst eine Stammfunktion F mit F′ = f.',
    steps: [
      'Stammfunktion mit der Potenzregel rückwärts: ∫xⁿ dx = xⁿ⁺¹/(n+1) – „Exponent plus 1, dann dadurch teilen“.',
      'Konstante Faktoren bleiben stehen, Summen gliedweise integrieren.',
      'Bestimmtes Integral: Grenzen einsetzen und subtrahieren: F(obere Grenze) − F(untere Grenze).',
      'Schreibweise: ∫ₐᵇ f(x) dx = [F(x)]ₐᵇ.',
    ],
    example: {
      problem: '∫₀³ 2x dx',
      steps: [
        'Stammfunktion von 2x: F(x) = x²',
        'Grenzen einsetzen: [x²]₀³ = 3² − 0²',
      ],
      result: '∫₀³ 2x dx = 9',
    },
    merke: 'Integrieren = Ableiten rückwärts. Am Ende: oben minus unten.',
  },

  vek: {
    title: 'Vektoren & Betrag',
    intro: 'Ein Vektor ist ein Pfeil mit Richtung und Länge – er beschreibt eine Verschiebung: v = (3|4) heißt „3 nach rechts, 4 nach oben“. Seine Länge nennt man Betrag |v|.',
    steps: [
      'Betrag in der Ebene: |v| = √(x² + y²) – das ist der Satz des Pythagoras!',
      'Im Raum kommt die dritte Koordinate dazu: |v| = √(x² + y² + z²).',
      'Abstand zweier Punkte: Verbindungsvektor bilden (Spitze minus Fuß), dann dessen Betrag.',
    ],
    example: {
      problem: 'Betrag von v = (3|4)',
      steps: [
        '|v| = √(3² + 4²) = √(9 + 16) = √25',
      ],
      result: '|v| = 5',
    },
    merke: 'Die Länge eines Vektors berechnest du mit Pythagoras.',
  },

  skalar: {
    title: 'Skalarprodukt',
    intro: 'Das Skalarprodukt zweier Vektoren ergibt eine Zahl (kein Vektor!) und verrät etwas über den Winkel zwischen ihnen. Besonders wichtig: Ist es 0, stehen die Vektoren senkrecht aufeinander.',
    steps: [
      'Komponentenweise rechnen: a · b = a₁·b₁ + a₂·b₂ (im Raum + a₃·b₃).',
      'a · b = 0 ⇔ a und b sind orthogonal (senkrecht).',
      'Vorzeichen deuten: > 0 spitzer Winkel, < 0 stumpfer Winkel.',
      'Orthogonalitäts-Aufgaben: Skalarprodukt aufstellen, gleich 0 setzen, nach der Unbekannten auflösen.',
    ],
    example: {
      problem: 'Für welches t sind a = (2|6) und b = (t|−1) orthogonal?',
      steps: [
        'a · b = 2t + 6 · (−1) = 2t − 6',
        'Orthogonal: 2t − 6 = 0',
      ],
      result: 't = 3',
    },
    merke: 'Skalarprodukt gleich null bedeutet: rechter Winkel.',
  },

  wkeit: {
    title: 'Wahrscheinlichkeit',
    intro: 'Die Wahrscheinlichkeit P misst Chancen zwischen 0 (unmöglich) und 1 (sicher). Wenn alle Ergebnisse gleich wahrscheinlich sind (Würfel, Münze), gilt die Laplace-Regel: günstige durch mögliche Ergebnisse.',
    steps: [
      'Zähle die möglichen Ergebnisse (Würfel: 6).',
      'Zähle die günstigen Ergebnisse (gerade Zahl: 2, 4, 6 → drei Stück).',
      'P = günstige : mögliche. Als Bruch, Dezimalzahl oder Prozent angeben.',
      'Mehrstufige Experimente: Baumdiagramm zeichnen – entlang eines Pfades multiplizieren, mehrere Pfade addieren.',
    ],
    example: {
      problem: 'Würfel: Wahrscheinlichkeit für eine gerade Zahl',
      steps: [
        'Mögliche Ergebnisse: 1, 2, 3, 4, 5, 6 → 6 Stück',
        'Günstige: 2, 4, 6 → 3 Stück',
        'P = 3/6, gekürzt 1/2',
      ],
      result: 'P(gerade) = 1/2',
    },
    merke: 'P = günstige Ergebnisse : mögliche Ergebnisse.',
  },
};
