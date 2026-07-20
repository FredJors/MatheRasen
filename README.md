# 🌱 MatheRasen

Ein Mathe-Coach als Spiel für Schüler:innen der Klassen 5–13.
Du pflegst einen Garten mit einem Mähroboter – und lädst ihn mit Mathe auf.
Die Aufgaben passen zur Klassenstufe und zum Bundesland (Curriculum-Registry).

## Spielprinzip

- 🤖 Der Mähroboter mäht den isometrischen Pixel-Rasen automatisch (Zufallsmuster wie echte Roboter).
- 🔋 Der Akku leert sich beim Mähen; der Roboter fährt selbstständig zur Ladestation.
- ⚡ **Mathe-Boost:** Aufgaben lösen lädt den Akku schneller und bringt Münzen.
- 🪨 Hindernisse & 🌼 Extras spawnen zufällig – antippen und mit einer Aufgabe entfernen.
- 🛠️ **Werkstatt:** Münzen in Upgrades investieren (Geschwindigkeit, Mähbreite, Akku, Ladestation, Lernturbo).

## Lokal starten

Beliebiger statischer Server im Projektordner, z. B.:

```bash
python -m http.server 5173
# oder
npx serve .
```

Dann `http://localhost:5173` öffnen. (ES-Module brauchen `http://`, ein Doppelklick auf `index.html` reicht nicht.)

## Deployment (Netlify)

Kein Build-Schritt nötig – `netlify.toml` ist vorhanden. Repo verbinden oder Ordner per
`netlify deploy` hochladen, Publish-Verzeichnis ist `.`.

## Projektstruktur

```
index.html              App-Shell (alle Screens + Modals)
css/
  base.css              Design-Tokens, Layout, Topbar/Bottombar
  components.css        Karten, Buttons, Pills, Modals, Formulare
  screens.css           Screen-Layouts + Responsive (Hoch-/Querformat)
js/
  config.js             ⚙️ Alle Balance-Werte & Kachel-Geometrie
  main.js               Einstiegspunkt / Bootstrapping
  core/
    events.js           Pub/Sub-Event-Bus (entkoppelt Logik & UI)
    state.js            Globaler Spielzustand + Persistenz
    storage.js          Speicher-Abstraktion (localStorage → Supabase)
    loop.js             requestAnimationFrame-Spielschleife
  data/
    bundeslaender.js    Die 16 Bundesländer
    curricula.js        📚 Klassenstufe+Bundesland → Themen (Registry)
  math/
    generators.js       🧮 Aufgaben-Generatoren (24 Themen, prozedural)
    taskEngine.js       Aufgabenauswahl, Antwort-Parsing (Komma, Brüche)
  game/
    garden.js           Kachel-Raster, Graswachstum, Hindernis-Spawns
    mower.js            Fahrverhalten des Roboters
    renderer.js         Isometrischer Canvas-Renderer (Pixel-Gras-Sprites)
    obstacles.js        🪨 Hindernis-Registry (inkl. prozeduralem Zeichnen)
    upgrades.js         🛠️ Upgrade-Registry + Effekt-Berechnung
    game.js             Spiel-Controller (Modi, Akku, Belohnungen)
  ui/
    screens.js          Screen-Manager + Bottom-Navigation
    onboarding.js       Registrierung (Name, E-Mail, Klasse, Bundesland)
    hud.js              Spiel-HUD, Canvas-Eingabe, Toasts, Hilfe
    taskModal.js        Aufgaben-Dialog (Eingabe/Multiple-Choice, Tipp, Lösung)
    upgradesScreen.js   Werkstatt
    profileScreen.js    Profil + Statistik + Reset
netlify.toml            Netlify-Konfiguration (statisch, kein Build)
```

## Erweiterungspunkte (so ist alles angelegt)

| Was | Wo | Wie |
|---|---|---|
| Neues Aufgabenthema | `js/math/generators.js` | `def('id', 'Label', maxDiff, gen)` registrieren, dann in `curricula.js` einer Klassenstufe zuordnen |
| Lehrplan je Bundesland | `js/data/curricula.js` | `OVERRIDES.<LAND>[klasse] = { add: [...], remove: [...] }` |
| Neues Hindernis/Extra | `js/game/obstacles.js` | Eintrag mit `label, weight, reward, diff, draw()` – `draw()` später durch Sprite ersetzbar |
| Neues Upgrade | `js/game/upgrades.js` | Eintrag in `UPGRADES` + Effekt in `getEffects()` |
| Neuer Screen | `index.html` + `js/ui/screens.js` | Section `id="screen-<name>"` + Nav-Button `data-nav="<name>"` |
| Balance/Levelgröße | `js/config.js` | Zentrale Werte (`GRID`, `BALANCE`) |
| Kosmetik/Skins (geplant) | Renderer-Paletten | Farbpaletten in `renderer.js` sind zentral definiert und austauschbar |

## Supabase-Anbindung (aktiv)

Umgesetzt als **Offline-first-Sync**: localStorage bleibt der schnelle lokale Puffer,
die Cloud wird verzögert aktualisiert. Bausteine:

- `js/core/supabaseConfig.js` – Projekt-URL + Publishable Key (öffentlich, Sicherheit via RLS)
- `js/core/supabase.js` – minimaler Auth+REST-Client (nur `fetch`, keine CDN-Abhängigkeit)
- `js/core/sync.js` – Konto anlegen/anmelden, Spielstand-Push (debounced), `task_log`
- Onboarding: Registrieren (mit Passwort) / Anmelden / lokaler Fallback ohne Konto
- Profil: Cloud-Status + Abmelden

**Wichtig (Supabase-Dashboard):** Authentication → Sign In / Providers → E-Mail →
„Confirm email" ausschalten, sonst müssen Kinder erst einen Bestätigungslink klicken.

Schema (im SQL Editor ausführen):

```sql
create table profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  username text not null,
  grade int not null check (grade between 5 and 13),
  bundesland text not null,
  created_at timestamptz default now()
);

create table saves (
  profile_id uuid references profiles(id) primary key,
  coins int default 0,
  xp int default 0,
  upgrades jsonb default '{}',
  stats jsonb default '{}',
  battery real default 100,
  garden jsonb,
  updated_at timestamptz default now()
);

create table task_log (          -- für Lernfortschritts-Analyse
  id bigint generated always as identity primary key,
  profile_id uuid references profiles(id),
  topic_id text not null,
  difficulty int,
  correct boolean,
  created_at timestamptz default now()
);

-- Row Level Security aktivieren
alter table profiles enable row level security;
alter table saves enable row level security;
alter table task_log enable row level security;
```

Zugriffsregeln (danach im SQL Editor ausführen – jeder Nutzer darf nur die eigenen Daten):

```sql
create policy "profil lesen"    on profiles for select using (auth.uid() = id);
create policy "profil anlegen"  on profiles for insert with check (auth.uid() = id);
create policy "profil aendern"  on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "save lesen"      on saves for select using (auth.uid() = profile_id);
create policy "save anlegen"    on saves for insert with check (auth.uid() = profile_id);
create policy "save aendern"    on saves for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "log lesen"       on task_log for select using (auth.uid() = profile_id);
create policy "log anlegen"     on task_log for insert with check (auth.uid() = profile_id);
```

## Hinweis zu den Lehrplänen

`curricula.js` enthält einen KMK-orientierten Basis-Lehrplan pro Klassenstufe plus
beispielhafte Bundesland-Anpassungen. Die Struktur ist darauf ausgelegt, echte
Lehrplandaten pro Land einzupflegen, ohne Code anzufassen.
