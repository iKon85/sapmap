# Recherche: UI-Bibliotheken für den Neubau (Stand 19.11.2026)

Beantwortet Issue #30. Quellen sind mit **[P]** (primär: npm-Registry, Herstellerdoku, Hersteller-Blog, GitHub-README, eigener Code) oder **[S]** (sekundär) markiert. Alle Seiten und Registry-Einträge wurden am **19.11.2026** abgerufen. Versionsangaben sind das `latest`-Tag der npm-Registry (`https://registry.npmjs.org/<paket>`) mit dem Veröffentlichungsdatum dieser Version.

Gesetzt und hier nicht neu bewertet: TanStack Start im Server-Modus, Postgres, Clerk, die ganze Seite hinter der Anmeldung, shadcn/ui mit Preset `b3QxdAzBg`, Tailwind v4, Wavestone-Farben, Aptos mit Archivo und IBM Plex als Rückfall, alle Grafiken als eigene HTML-/SVG-Komponenten ohne Grafik-Bibliothek.

Maßstab: Eine Bibliothek kommt nur rein, wenn eine konkrete Ansicht oder ein entschiedenes Feature sie braucht.

## Takeaway

- **Rein kommen 12 Laufzeitpakete**, alle schon im Prototyp `prototype/wavestone-shadcn` im Einsatz (außer Zod): Start/Router, React, Tailwind, shadcn samt `radix-ui`, `class-variance-authority`, `cn`, `tw-animate-css`, Phosphor, die drei Fontsource-Pakete und Zod. Dazu Vitest und Playwright für Tests.
- **Aus dem testreporter fallen für den Nachbau weg:** `@tanstack/react-query`, `@tanstack/react-table`, `recharts`, `cmdk`, `sonner`, `lucide-react` (durch Phosphor ersetzt), `clsx` + `tailwind-merge` (durch `cn` ersetzt), Testing Library und jsdom. Query, Table, cmdk und sonner kommen erst mit einem bestimmten Feature in Frage, Recharts gar nicht.
- **TanStack:** Start und Router decken Laden (Loader), Schreiben (Server-Funktionen) und URL-Zustand (`validateSearch` mit Zod 4, ohne Adapter) selbst ab. Von den übrigen 17 TanStack-Bibliotheken braucht der Neubau heute keine. Table wird erst mit der Katalog-Tabelle (#16) interessant, dann in Version 9.
- **Wavestone-Farben:** Der Prototyp zeigt den Weg und ist der Weg für den Neubau: Werte in `:root` und `.dark`, über `@theme inline` an Tailwind gereicht. Für den Neubau nur aufräumen: ein Farbschema statt drei, Bereichs- und Statusfarben als eigene Tokens.
- **Vorsicht:** TanStack Start hatte am 30.09.2026 eine XSS-Lücke (CVE-2026-102989). Versionen pinnen und Sicherheitsmeldungen verfolgen; der Prototyp steht auf `latest`.

## Übersicht

| Bibliothek | Empfehlung | Verwendungsort | Reifegrad (npm `latest`, Datum) |
|---|---|---|---|
| `@tanstack/react-start` + `@tanstack/react-router` | **rein** (gesetzt) | Routen, Loader, Server-Funktionen, Search-Params, Clerk-Middleware | stabil; Start 1.0 am 13.10.2026, `latest` 1.169.7 (19.11.2026); Router 1.170.46 (22.10.2026) |
| `tailwindcss` + `@tailwindcss/vite` | **rein** (gesetzt) | ganzes Styling | stabil, 4.3.5 (06.11.2026) |
| `shadcn` | **rein** | CLI für Komponenten, dazu `shadcn/tailwind.css` im Stylesheet | stabil, 4.23.0 (27.10.2026) |
| `radix-ui` | **rein** | Grundlage der shadcn-Komponenten: Sheet (Steckbrief mobil), Tabs bzw. Navigation, Tooltip, Toggle-Group (Filter), Switch (Testperspektive), Dropdown (Theme) | stabil, 1.8.1 (12.10.2026) |
| `class-variance-authority` | **rein** | Varianten in shadcn-Komponenten (Button, Badge, Toggle) | 0.7.1 (26.11.2024), seit zwei Jahren unverändert |
| `cn` | **rein**, statt `clsx` + `tailwind-merge` | Klassen zusammenführen in jeder Komponente | jung: 0.5.2 (02.11.2026), Neustart des Pakets am 01.09.2026, gepflegt vom shadcn-Team |
| `tw-animate-css` | **rein** | Ein- und Ausblenden von Sheet, Tooltip, Dropdown | 1.4.0 (24.09.2025) |
| `@phosphor-icons/react` | **rein** (gesetzt) | Status-Piktogramme, Kopfleiste, Schließen-Knöpfe, shadcn-Komponenten | 2.1.10 (22.05.2025), seit 18 Monaten kein Release |
| `@fontsource-variable/archivo`, `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono` | **rein** (gesetzt) | Rückfallschriften, selbst gehostet (K6) | je 5.3.0 (19.07.2026) |
| `zod` | **rein** | `validateSearch` aller Routen, Schema der Steckbriefe (Ablösung von `validate.py`), Eingaben der Server-Funktionen | stabil, 4.6.7 (12.10.2026) |
| `vitest` | **rein** | Logik ohne DOM: Schema, Ableitung der Datumsbeschriftungen, Regeln der Auswirkungsanalyse | stabil, 5.1.1 (18.11.2026); testreporter nutzt 4.1.12 |
| `@playwright/test` | **rein** (laut Karte #1 vorgesehen) | Vergleich alt gegen neu, Tastatur und Screenreader-Rollen, Anmeldung | stabil, 1.65.1 (13.11.2026) |
| `@tanstack/react-query` | nicht nötig; neu prüfen erst mit Konto, Abo und Mitteilungen, falls Loader nicht reichen | – | stabil, 5.108.1 (19.11.2026) |
| `@tanstack/react-table` | erst mit der Katalog-Tabelle (#16) | – | stabil, 9.3.1 (12.10.2026); 9.0.0 am 04.08.2026 |
| `recharts` | nicht nötig | – (Zeitleiste ist eine Liste, siehe Abschnitt 4) | stabil, 3.11.0 (17.11.2026) |
| `cmdk` | erst mit der Suche (#17), falls dort eine Befehlspalette entschieden wird | – | 1.1.1 (14.03.2025) |
| `sonner` | erst mit Konto und Abo | Rückmeldung nach „Abonnieren“, „Abo beendet“, „Link kopiert“ | stabil, 2.0.8 (09.08.2026) |
| `lucide-react` | nicht nötig | ersetzt durch Phosphor (Preset) | – |
| `clsx`, `tailwind-merge` | nicht nötig | ersetzt durch `cn` | – |
| `@testing-library/react`, `jsdom` | nicht nötig | Komponentenverhalten prüft Playwright im echten Browser | Testing Library 16.3.3 (27.08.2026), jsdom 31.0.1 (13.11.2026) |
| `date-fns` (im testreporter, nicht im Ticket) | nicht nötig | Datumsformat der Zeitleiste und „Neu seit …“ gehen mit `Intl.DateTimeFormat` und `Intl.RelativeTimeFormat` | – |
| `html-to-image` | offen, gehört zu den Feature-Details der Kundenlandschaft | Bildexport der Landkarte | 1.11.13 (14.02.2025) |

Alle Zeilen: [P] npm-Registry (19.11.2026). Start 1.0: [P] https://tanstack.com/blog (Eintrag „TanStack Start 1.0 is Stable“, 13.10.2026; abgerufen 19.11.2026).

## 1. Bestand im testreporter

[P] `/home/niko/projects/testreporter/frontend/package.json` und `src/` (gelesen 19.11.2026). Gezählt sind Dateien unter `src/` mit mindestens einem Import des Pakets; in Klammern die Testdateien darunter.

| Paket | Version im testreporter | Dateien mit Import | Wofür |
|---|---|---|---|
| `radix-ui` | ^1.8.1 | 17 (0) | shadcn-Komponenten unter `components/ui/` |
| `class-variance-authority` | ^0.7.1 | 5 (0) | Varianten in Button, Badge u. a. |
| `clsx` + `tailwind-merge` | ^2.1.1 / ^3.7.0 | je 1 (0) | nur `lib/utils.ts` (`cn()` mit erweiterter Klassengruppe für `text-badge`) |
| `tw-animate-css` | ^1.4.0 (devDependency) | – | per `@import` in `index.css` |
| `lucide-react` | ^0.577.0 | 198 (7) | Icons überall |
| `cmdk` | ^1.1.1 | 1 (0) | nur `components/ui/command.tsx`, benutzt vom `ProjectSwitcher` |
| `sonner` | ^2.0.8 | 74 (20) | rund 280 Aufrufe von `toast.success`/`toast.error` nach Mutationen |
| `@tanstack/react-table` | ^8.21.3 | 38 (7) | eigenes Data-Table-Modul (Gruppierung, Tastaturnavigation, Mobilansicht, URL-Zustand) |
| `@tanstack/react-query` | ^5.104.5 | 175 (70) | alle API-Zugriffe; die App ist eine SPA ohne Server-Loader |
| `zod` | ^4.6.7 | 14 (1) | Antwortverträge der API unter `lib/api/` |
| `recharts` | 2.15.4 (gepinnt) | 16 (0) | Trend-, Burndown-, Konvergenz-Diagramme, Sparklines |
| Vitest, Testing Library, jsdom | ^4.1.12, ^16.3.3, ^29.1.1 | Testsuite, `environment: 'jsdom'` | Komponententests |

Weitere Pakete dort, nicht im Ticket genannt: `react-router`, `@clerk/react`, `@dnd-kit/*` (6 Dateien), `date-fns` (22), `react-day-picker` (2), `@sentry/react` (2), `react-dropzone` (0 Importe, also toter Eintrag).

**Folgerung:** Der testreporter ist eine Daten-App (Tabellen, Diagramme, Formulare, viele Mutationen) als SPA. Query, Table, Recharts und sonner tragen dort echte Last. Die Landkarte ist eine Leseseite mit 154 festen Steckbriefen und wenigen Schreibaktionen erst mit Konto und Abo. „Dieselbe Basis“ heißt deshalb: dieselbe Styling- und Komponentenbasis, nicht dieselbe Datenschicht.

Zum Vergleich der Prototyp: [P] `origin/prototype/wavestone-shadcn:prototype/wavestone-shadcn/package.json`. Dort laufen bereits Start 1.169.5 und Router 1.170.46 (laut `pnpm-lock.yaml`), `radix-ui` (11 Importe), `class-variance-authority` (5), `cn` (19), `@phosphor-icons/react` (3 Dateien plus 2 shadcn-Komponenten), `tw-animate-css`, `shadcn`, Fontsource. Kein Query, kein Table, kein Zod.

## 2. Abgleich mit den Ansichten und Features

| Ansicht / Feature | Was sie braucht | Neue Bibliothek? |
|---|---|---|
| **Landkarte** | HTML-Raster mit Container Queries (Prototyp), Chips als Links, Status-Piktogramme | nein (Tailwind, Phosphor) |
| **Schichtenmodell** | CSS-Grid aus HTML-Kästen | nein |
| **Integrationswege, Toolchain** | HTML-Raster plus SVG-Ebene für Pfeile, selbst gerechnet | nein |
| **Toolchain-Flusstabelle** | 29 Zeilen aus `toolchain-flows.json`, ohne Sortierung und Filter | nein: shadcn `Table` (reines HTML), kein TanStack Table |
| **Clean Core** | statischer Text mit Links | nein |
| **Zeitleiste** | nach Jahr gruppierte Liste, Filter „Nur Wartungsenden“ | nein (Abschnitt 4) |
| **Steckbrief** | überlagert rechts, mobil Sheet von unten (#31) | `radix-ui` über shadcn `Sheet` |
| **Suche und Filter** | Suchfeld, Status-Filter, Testperspektive, alles in der URL (K5) | `zod` für `validateSearch` |
| **Theme hell/dunkel** | Inline-Skript und `.dark`-Klasse wie im Prototyp | nein (kein `next-themes`) |
| **Kundenlandschaft (F1)** | Bausteine markieren; Zustand in der URL bzw. am Konto; Bildexport | Bildexport offen (`html-to-image` als Kandidat), sonst nein |
| **Auswirkungsanalyse (F5)** | Regeln über `daten[].typ`, optionales Go-live-Datum | nein; ein einzelnes Datumsfeld (`<input type="month">` bzw. shadcn `Input`) |
| **„Neu seit …“ (F3)** | Vergleich von Recherche-Ständen, Liste der Änderungen | nein |
| **Prüflauf** | Job auf dem Server, keine Oberfläche außer ggf. Stand-Anzeige | keine UI-Bibliothek |
| **Konto, Abo, Mitteilungen** | Abo-Knopf je Baustein, Liste „Mitteilungen“, Einstellungen zur Sammelmail | Server-Funktionen + Loader; `sonner` für Rückmeldungen sinnvoll |
| **Suche und MCP (#17)** | entscheidet Activate-Übernahme | ggf. `cmdk`, falls eine Befehlspalette kommt |
| **Katalog-Tabelle (#16, geparkt)** | sortier- und filterbar, CSV-Export | `@tanstack/react-table` v9 |

## 3. TanStack-Ökosystem

Liste und Reifegrad-Kennzeichen von [P] https://tanstack.com/libraries (19.11.2026); Versionen [P] npm-Registry (19.11.2026); Ereignisse [P] https://tanstack.com/blog (19.11.2026). Die Website führt 19 Bibliotheken. **Ranger** steht nicht mehr auf der Liste (npm: `@tanstack/react-ranger` 0.0.5 vom 06.12.2025). Neu gegenüber dem Stand, den das Ticket voraussetzt: **Redact, Charts, Markdown, Highlight, Hotkeys, Intent, CLI**.

| Bibliothek | Kennzeichen tanstack.com | npm `latest` (Datum) | Was sie hier lösen würde | Empfehlung |
|---|---|---|---|---|
| **Start** | – (stabil) | `@tanstack/react-start` 1.169.7 (19.11.2026); 1.0 stabil laut Blog 13.10.2026 | Server, SSR, Server-Funktionen, Middleware für Clerk, Server-Routen für MCP | **rein** (gesetzt). Pinnen: Sicherheitsupdate CVE-2026-102989 (Blog, 30.09.2026) |
| **Router** | – (stabil) | 1.170.46 (22.10.2026) | dateibasierte Routen, Loader mit eigenem Cache, `validateSearch` | **rein** (kommt mit Start) |
| **Query** | – (stabil) | 5.108.1 (19.11.2026) | gemeinsamer Cache, Mutationen, optimistische Updates | **nicht nötig** (siehe unten) |
| **Table** | „fresh“ | 9.3.1 (12.10.2026); 9.0.0 am 04.08.2026 | Sortieren, Filtern, Gruppieren großer Tabellen | **erst mit #16** |
| **Virtual** | – (stabil) | 3.14.26 (03.11.2026) | lange Listen virtualisieren | **nicht nötig**: 154 Bausteine, Zeitleiste im niedrigen dreistelligen Bereich |
| **Form** | – (stabil) | 1.33.5 (11.08.2026); 1.0.0 am 02.03.2025; 2.0 als Alpha | Formularzustand, Validierung, Fehlermeldungen | **nicht nötig**: es gibt kein Formular mit mehr als ein bis zwei Feldern |
| **Store** | „alpha“ | 0.11.2 (29.09.2026); 1.0.0-alpha.0 | reaktiver Zustand außerhalb von React | **nicht nötig**: Zustand liegt in der URL (Search-Params) bzw. am Konto |
| **DB** | „beta“ | `@tanstack/react-db` 1.0.0-rc.1.5 (11.11.2026); RC1 laut Blog 29.10.2026 | Client-Datenbank mit Sync und Live-Abfragen | **nicht nötig**: Daten sind statisch oder wenige Konto-Daten |
| **Pacer** | „beta“ | 0.24.1 (05.10.2026) | Entprellen, Drosseln, Warteschlangen | **nicht nötig** (siehe unten) |
| **Hotkeys** | „beta“ | 0.27.1 (18.11.2026) | Tastenkürzel mit Bereichen | **nicht nötig**: heute nur Esc und Enter; das deckt Radix bzw. ein `onKeyDown` |
| **Devtools** | „alpha“ | `@tanstack/react-devtools` 0.10.14 (29.10.2026); Router-Devtools 1.167.4 | Entwicklerpanel | **nicht nötig** (optional nur lokal, kein Gewinn bei dieser Routenzahl) |
| **AI** | „fresh“ | `@tanstack/ai` 1.5.0 (17.11.2026); 1.0 laut Blog 23.10.2026 | KI-Bausteine, MCP-Anbindung | **nicht nötig**: der Prüflauf läuft als eigener Agentenauftrag (#21, #26), der MCP-Zugang folgt Activate (#17) |
| **Charts** | – | `@tanstack/react-charts` 1.5.0 (07.11.2026); 1.0 laut Blog 05.10.2026 | Diagramme | **nicht nötig**: keine Diagramm-Ansicht, Grafiken sind eigene Komponenten |
| **Redact** | – | `@tanstack/redact` 0.3.1 (04.11.2026); vorgestellt 26.10.2026 | kleinere Laufzeit statt React DOM | **nicht nötig**: Version 0.x, kein Bedarf bei der Bundle-Größe nachgewiesen |
| **Markdown** | – | `@tanstack/markdown` 1.2.0 (02.11.2026) | Markdown rendern | **nicht nötig**: Steckbrief-Felder sind Klartext |
| **Highlight** | – | `@tanstack/highlight` 1.2.12 (10.11.2026) | Syntax-Hervorhebung | **nicht nötig** |
| **Router-Ergänzung** `@tanstack/zod-adapter` | – | 1.167.0 (15.05.2026) | Zod 3 an `validateSearch` | **nicht nötig**: mit Zod 4 überflüssig (siehe unten) |
| **Intent, CLI, Config** | „alpha“ / „alpha“ / – | 0.5.6 / 0.72.16 / 0.22.2 | Werkzeuge für Paketautoren bzw. Gerüst | **nicht nötig** |

### Query neben Loadern und Server-Funktionen

Die Router-Doku sagt selbst, dass ihr eingebauter Cache für die meisten kleinen bis mittleren Apps reicht. [P] https://github.com/tanstack/router/blob/main/docs/router/guide/data-loading.md (über Context7, 19.11.2026), Abschnitt „To Router Cache or not to Router Cache?“:

- Router-Cache kann: Deduplizieren, Vorladen, Stale-while-revalidate je Route, grobe Invalidierung (`router.invalidate()`), Garbage Collection, „just works“ für SSR.
- Router-Cache kann nicht: Persistenz, Cache über Routen hinweg teilen, Mutations-APIs, optimistische Updates auf Cache-Ebene.

Für dieses Projekt:

- **Steckbriefe** sind Build-Daten. Sie werden importiert bzw. im Loader gelesen; es gibt nichts nachzuladen. Query hätte keinen Fall.
- **Konto, Abo, Mitteilungen** sind wenige Datensätze je Nutzer. Lesen per Loader (Root- oder Layout-Route), Schreiben per Server-Funktion, danach `router.invalidate()`. Das deckt „Abo-Stern auf dem Steckbrief, Zähler der Mitteilungen im Kopf“ ab, weil beide aus demselben Layout-Loader kommen.
- **Wann Query doch:** wenn ein Abo-Klick sofort und ohne Neuladen der Loader sichtbar sein muss (optimistisch) und das über mehrere Routen, oder wenn Mitteilungen per Polling frisch gehalten werden sollen. Das entscheidet die Spec „Konto und Abo“, nicht der Umbau.
- Kombiniert man beides, verlangt die Doku `defaultPreloadStaleTime: 0`, damit Query über Frische entscheidet ([P] gleiche Quelle, `router-query/SKILL.md`). Das ist eine weitere Stelle, an der zwei Caches aufeinander abgestimmt werden müssen; ein Grund mehr, nur einen zu nehmen.

### Search-Params mit Zod statt eigenem Zustand

`validateSearch` nimmt ein Zod-4-Schema direkt, ohne `@tanstack/zod-adapter`; Standardwerte per `.default()`, Rückfall bei kaputten Werten per `.catch()`. Typen werden abgeleitet, `Route.useSearch()` liefert sie typisiert. [P] https://github.com/tanstack/router/blob/main/docs/router/guide/search-params.md und `…/how-to/validate-search-params.md` (über Context7, 19.11.2026). Der Adapter ist nur für Zod 3 nötig.

Das löst K5 ohne Zustandsbibliothek: Ansicht, gewählter Baustein, Suchtext, Status-Filter, Testperspektive und später die Kundenlandschaft stehen in der URL. Der Prototyp macht es schon so (`validateSearch: validateProtoSearch`, hier noch von Hand ohne Zod).

### Table, Virtual, Form, Store, DB, Pacer

- **Table:** Die heutige Seite hat genau eine Tabelle, die Toolchain-Flüsse (29 Zeilen, keine Sortierung). Dafür reicht shadcn `Table`, das ist reines HTML ohne Bibliothek. TanStack Table lohnt erst mit der Katalog-Tabelle (#16, geparkt). Dann ist Version 9 aktuell (9.0.0 am 04.08.2026); der testreporter steht noch auf 8.21.3. Sein Data-Table-Modul ist darum nicht ohne Weiteres übertragbar; das wäre bei #16 zu prüfen.
- **Virtual:** Bei 154 Bausteinen und einer Zeitleiste dieser Größe rendert der Browser alles ohne Mühe. Virtualisierung würde zudem Strg+F und Vorrendern stören.
- **Form:** Die Eingaben nach dem Umbau sind ein Go-live-Datum (Auswirkungsanalyse), Abo an/aus je Baustein und ggf. ein Schalter für die Sammelmail. Dafür reichen kontrollierte shadcn-Felder plus Zod-Prüfung in der Server-Funktion. shadcn listet TanStack Form als Formularweg ([P] https://ui.shadcn.com/docs/theming, Navigation „Forms“, 19.11.2026). Das wird erst relevant, falls ein echtes Formular entsteht, etwa ein CSV-/LeanIX-Import der Kundenlandschaft (Ausbaustufe, nicht entschieden).
- **Store:** Die Kundenlandschaft lebt in der URL bzw. am Konto, die Auswahl im Router. Ein zweiter Zustandsort widerspräche K5. Store ist außerdem noch Alpha.
- **DB:** Für Offline-Sync und Live-Abfragen über viele Client-Daten gebaut. Hier gibt es keine solchen Daten. Version noch RC.
- **Pacer:** Die Suche filtert 154 Einträge synchron, das braucht kein Entprellen. Damit Tippen nicht den Verlauf füllt, schreibt die Suche mit `navigate({ search, replace: true })` in die URL. Falls doch nötig, reichen fünf Zeilen `setTimeout`.

### Start, Clerk-Middleware und Vorrendern

Nur soweit es die Bibliothekswahl berührt: Clerk kommt als `@clerk/tanstack-react-start` (1.7.16 vom 18.11.2026, [P] npm) und läuft als Start-Middleware. Wenn jede Anfrage durch die Middleware geht, ist SSR je Anfrage der einfache Weg; was dann noch vorgerendert wird, bleibt in #8 offen. Für die Bibliothekswahl ändert das nichts: Kein Paket aus der Liste setzt Vorrendern voraus oder schließt es aus. Phosphor rendert per SSR (Abschnitt 6), `cn`, Radix und Zod laufen auf Server und Client.

## 4. Zeitleiste: Recharts oder eigene Komponente?

**Eigene Komponente; Recharts nicht nötig.**

Die heutige Zeitleiste ist kein Diagramm. [P] `src/landkarte.html`, `renderTimeline()` (Zeilen 933–955): Sie sammelt alle `daten[]` der Steckbriefe zwischen 2023 und 2042, sortiert nach Datum, gruppiert nach Jahr und gibt je Jahr eine `<ul>` mit Datum, Baustein-Link und Text aus. Dazu ein Hinweiskasten (Klippenjahr) und zwei Filterknöpfe. Keine Achse, keine Skala, kein SVG.

- Im Neubau wird das eine semantische Liste (`<ol>` je Jahr, `<time>`): barrierefrei ohne Nacharbeit (offener Punkt W4 „Zeitleiste“ in #1), druckbar, durchsuchbar.
- Recharts ist für Kennzahlen-Diagramme gebaut (Achsen, Serien, Tooltips) und rendert SVG; die Einträge wären dann Grafikelemente statt Text mit Links. Das passt nicht zur entschiedenen Linie und löst hier kein Problem.
- Auch F5 („läuft 14 Monate nach Go-live aus“) bleibt eine Liste mit abgeleitetem Text. Falls später eine echte Zeitachse gewünscht ist, gilt dieselbe Linie wie für die anderen Grafiken: eigenes HTML/SVG. Das gilt ebenso für TanStack Charts.

## 5. Wavestone-Farben in den shadcn-Tokens

**So macht es der Prototyp** ([P] `origin/prototype/wavestone-shadcn:prototype/wavestone-shadcn/src/styles.css`):

1. `@import "tailwindcss"`, `"tw-animate-css"`, `"shadcn/tailwind.css"` und die Fontsource-Dateien.
2. `@font-face` für Aptos mit `src: local("Aptos"), url("/fonts-local/Aptos.ttf")` je Schnitt.
3. `@custom-variant dark (&:is(.dark *));` für die Klasse `.dark` am `<html>`.
4. `@theme inline { --color-primary: var(--primary); … --font-sans: "Aptos", "IBM Plex Sans", …; --radius-*: calc(var(--radius) * …) }`, also die shadcn-Zuordnung von Variable zu Tailwind-Farbe, unverändert aus dem Preset. Zusätzlich `--color-link`.
5. `:root { --ws-violett: #451dc7; --ws-tief: #250f6b; --ws-gruen: #04f06a; --ws-hellgruen: #cafee0; --ws-gelb; --ws-rot; --primary: var(--ws-violett); --accent: var(--ws-violett) /* Accent Bold */; --ring: var(--ws-violett); --radius: 0.45rem; … --st-neu, --st-aus, --st-abg, --st-umb, --cc-line }`.
6. `.dark { --background: #0d0920; --card: #161131; --primary: #6c4df2; --ring: var(--ws-gruen); --link: #b9a8ff; … color-scheme: dark }`.
7. Bereichsfarben als `--zc-*` in drei umschaltbaren Schemata (`:root[data-farben="infografik"]` usw.), je Bereich über `[data-zone="core"] { --zc: var(--zc-core) }` zugewiesen. Komponenten nutzen sie per Tailwind-Klasse mit Variable, z. B. `text-(--zc)`, `bg-(--st-neu)`.
8. Das Theme setzt ein Inline-Skript im `<head>` vor dem ersten Rendern (`localStorage` „theme“, sonst `prefers-color-scheme`). Keine Bibliothek dafür.

**Ist das der Weg für den Neubau?** Ja. Es ist genau der Weg, den shadcn dokumentiert: Werte unter `:root` und `.dark`, an Tailwind über `@theme inline`; neue Tokens auf dieselbe Weise ergänzen ([P] https://ui.shadcn.com/docs/theming, Abschnitte „Theme Tokens“ und „Adding New Tokens“, 19.11.2026). Das Preset bleibt dabei unangetastet, wie in #31 festgehalten.

Für den Neubau nur aufräumen, nicht neu erfinden:

- **Ein Schema statt drei:** Nur „Infografik“ bleibt (#31). Der Schalter `data-farben` und die Schemata „Tonstufen“ und „Ruhig“ entfallen; die `--zc-*`-Werte der Infografik stehen direkt in `:root` und `.dark`.
- **Bereichs- und Statusfarben als echte Tokens:** z. B. `--color-zone-core: var(--zc-core)` und `--color-status-neu: var(--st-neu)` in `@theme inline`. Dann heißen die Klassen `bg-status-neu` statt `bg-(--st-neu)`, und Tippfehler fallen auf. Das ist Geschmackssache und keine Pflicht; die heutige Schreibweise funktioniert.
- **Aptos:** Seit #13 dürfen die Dateien hinter der Anmeldung ausgeliefert werden; laut #31 kommt die Schrift aber nicht ins öffentliche Repo. Die `url()` des Prototyps passt dazu, wenn die Dateien beim Deploy außerhalb von Git bereitgestellt werden. Wo sie liegen, ist eine Hosting-Frage (#13), keine Bibliotheksfrage.

## 6. Phosphor Icons

[P] https://raw.githubusercontent.com/phosphor-icons/react/master/README.md (19.11.2026); Version [P] npm.

- **Paket:** `@phosphor-icons/react` 2.1.10 (22.05.2025). Das alte Paket `phosphor-react` ist abgelöst. shadcn setzt es mit `"iconLibrary": "phosphor"` in `components.json` ein (so im Prototyp); die shadcn-Komponenten importieren dann z. B. `XIcon`, `CheckIcon`, `CaretRightIcon` daraus.
- **Tree-Shaking:** Laut README landet nur der Code der benutzten Icons im Bundle. Ein Stern-Import (`import * as Icon`) kann das verhindern; also nicht verwenden.
- **Entwicklungsgeschwindigkeit:** Das README warnt, dass manche Bundler beim Import aus dem Hauptmodul alle über 9.000 Module transpilieren; Abhilfe sind Einzelpfade wie `@phosphor-icons/react/dist/csr/BellSimple`. Ob Vite 8 davon betroffen ist: **nicht gefunden.** Im Prototyp (Import aus dem Hauptmodul) ist kein Problem dokumentiert. Erst bei spürbar langsamem Dev-Start reagieren.
- **SSR:** Die Standard-Importe nutzen React Context (`IconContext`). Für Umgebungen ohne Context, gemeint sind React Server Components, gibt es den Unterpfad `@phosphor-icons/react/ssr`. TanStack Start rendert hier klassisch per SSR mit Hydration, nicht mit Server Components; Context funktioniert dort, der Prototyp rendert die Icons so. Der Hauptimport reicht also. Den `/ssr`-Pfad braucht es nur, falls später RSC eingesetzt werden (im Lockfile des Prototyps steckt `@tanstack/react-start-rsc` 0.1.66 als Abhängigkeit, genutzt wird es nicht).
- **Pflege:** Das letzte Release liegt 18 Monate zurück. Für eine stabile Icon-Sammlung ist das kein Alarmsignal, sollte aber bekannt sein: Neue React-Hauptversionen prüfen, bevor man aktualisiert.

## 7. cmdk und sonner

- **cmdk:** Der testreporter nutzt es an genau einer Stelle (Projektwechsler). Auf der Landkarte filtert das Suchfeld die Karte direkt, das ist eine andere Interaktion als eine Befehlspalette. Wie die Suche künftig arbeitet (Treffer über alle Ansichten, W5; BM25 und pgvector aus Activate), entscheidet #17. **Erst mit #17**, falls dort eine Palette (Strg+K, „Springe zu Baustein“) gewählt wird. Sonst weglassen. Hinweis: cmdk hat seit 14.03.2025 kein Release.
- **sonner:** Beim reinen Nachbau gibt es keine Aktion, die eine Rückmeldung braucht. Mit Konto und Abo schon: „Baustein abonniert“, „Abo beendet“, Fehler beim Speichern; mit der Kundenlandschaft „Link kopiert“. shadcn hat eine Toast-Komponente (Navigation der Doku); ob sie auf sonner aufsetzt, wurde nicht geprüft. **Erst mit Konto und Abo** (bzw. Kundenlandschaft); dann eine `<Toaster />` im Root-Layout. Barrierefreiheit (Ansage per Live-Region) nicht geprüft.

## 8. Tests

- **Vitest rein:** für reine Logik ohne DOM (Zod-Schema der Steckbriefe, abgeleitete Datumsbeschriftungen aus K4, Regeln der Auswirkungsanalyse, Vergleich der Recherche-Stände). Umgebung `node`, kein jsdom.
- **Playwright rein:** die Karte #1 nennt es für die Testentscheidungen; der Vergleich alt gegen neu, Tastatur, Rollen und Anmeldung laufen im echten Browser.
- **Testing Library und jsdom nicht nötig:** Komponentenverhalten deckt Playwright ab. Wer zusätzlich Komponententests will, nimmt sie dazu; im testreporter tragen sie eine SPA mit vielen Formularen, die es hier nicht gibt.

## Nicht geklärt

- Ob der Import aus dem Phosphor-Hauptmodul den Dev-Start mit Vite 8 merklich bremst: nicht gefunden, nur im Projekt messbar.
- Ob `cn` alle Sonderfälle von `tailwind-merge` abdeckt, die der Neubau braucht: Das README verspricht volle Parität. Eigene Font-Size-Tokens wie `text-badge` im testreporter mussten dort per `extendTailwindMerge` angemeldet werden. Ob und wie `cn` eigene Theme-Tokens kennt, wurde nicht geprüft. Bei eigenen `text-*`-Tokens im Neubau testen.
- Barrierefreiheit von sonner-Toasts: nicht geprüft.
- Technik für den Bildexport der Kundenlandschaft: bleibt bei den Feature-Details (Kandidat `html-to-image`, letztes Release 14.02.2025).
- Was hinter der Anmeldung vorgerendert wird: bleibt in #8; berührt die Bibliothekswahl nicht.
