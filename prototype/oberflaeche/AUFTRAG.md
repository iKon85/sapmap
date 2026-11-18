# Auftrag: drei Alternativen je Skill (Wegwerf-Prototyp)

Die „S/4HANA-Landkarte“ ist eine interaktive Übersicht über 154 SAP-Bausteine („Steckbriefe“) rund um S/4HANA, für SAP-Berater aller Rollen (Architektur, Integration, Test, Basis, Projektleitung). Der Umbau ist ein Neubau.

Es gibt schon zwei Entwürfe, die Niko als **richtige Richtung** bewertet:
- `impeccable/`: violettes Register links, Raster nach Bereichen, Steckbrief als eigene Lesefläche mit violettem Kopfband.
- `taste/`: weiße Nachschlage-Seite mit Einstieg und Kennzahlen, 3 Spalten, Steckbrief als Spalte rechts.

Niko möchte **auf dieser Basis Alternativen sehen**: drei Entwürfe pro Skill, die sich deutlich voneinander und vom Ausgangsentwurf unterscheiden. Unterscheiden sollen sie sich darin, wie die Landschaft visualisiert wird, und in Struktur und Hauptinteraktion, nicht nur in Farbe oder Abständen. Was am Ausgangsentwurf trägt, darf bleiben.

## Fest vorgegeben (sonst ist alles frei)
1. **Echte Daten**: `fetch('../../../data/steckbriefe.json')` (154 Objekte). Datenmodell und Bereiche (`layer`): `/home/niko/projects/sapmap-proto/docs/datenmodell.md`. Ergänzend `data/toolchain-flows.json`. Keine erfundenen Zahlen.
2. **Look: shadcn/ui-Preset `b3QxdAzBg`, Farben und Schrift aus der Wavestone-CI** (Klarstellung Niko, 18.11.2026). Wo die CI etwas vorgibt, überschreibt sie das Preset; alles andere kommt aus dem Preset.
   - **Aus dem Preset:** Style **Nova**, Radius **Small**, Icons **Phosphor Icons** (lokale SVGs, z. B. aus `@phosphor-icons/core`), Menu **Default / Solid**, Menu Accent **Bold**. Token-Struktur nach shadcn-Muster (`--background`, `--foreground`, `--primary`, `--muted`, `--accent`, `--border`, `--ring`, `--chart-1…5`), hell und dunkel.
   - **Aus der Wavestone-CI** (statt Base Mist, Theme Indigo, Chart Lime, Manrope): Charta `/home/niko/.claude/skills/synced/8e2bf17d-125a-430c-960f-a255114b44ec_21aa5ca6-181e-4c59-ad5b-e54f0299953b/wavestone-pptx-de/reference/charte.md`. Kern: #FFFFFF, Text #000000, Markenviolett #451DC7 als `--primary` (weißer Text darauf), Akzent #04F06A (kein weißer Text darauf), #CAFEE0 (kein heller Text darauf), #250F6B; #FFCA4A/#FF2A49 nur für Statussignale; Diagrammfarben aus der Charta. Schrift `Aptos, "Segoe UI", system-ui, sans-serif` für Überschriften und Text, kein Webfont-Download. Die CI schlägt Skill-Defaults wie „never violet“.
3. **Steckbrief-Ansicht**: Jeder Entwurf zeigt, wie man von der Visualisierung zu einem Steckbrief kommt und wie dieser aussieht (Felder: name, aka, kurz, was, wie, s4, wann, lizenz, status/statusText, daten, verwandt, quellen, belegt/hinweis; `test` = Testperspektive).
4. Deutsch mit echten Umlauten. Bei 375 px scrollt die Seite nicht seitlich; Grafiken dürfen eigene Scroll-Container haben.

Orientierung (kein Muss): alte Seite `src/landkarte.html` (Ansichten: Landkarte, Schichtenmodell, Integrationswege, Toolchain, Zeitleiste), Befunde `docs/bestandsaufnahme.md`, Vokabular `GLOSSARY.md`.

## Technik
Plain HTML/CSS/JS, keine Netz-Abhängigkeiten. Je Entwurf ein Unterordner mit `index.html`. Nicht committen. Server im Ordner `/home/niko/projects/sapmap-proto` mit `python3 -m http.server <Port> --bind 127.0.0.1`, am Ende beenden. Sichtprüfung im headless Browser (MCP `chrome-devtools`, `new_page` mit eigenem `isolatedContext`, nur eigene Seiten anfassen und schließen): 1440 px und mobil 375×812 (Emulation danach zurücksetzen), Konsole fehlerfrei. Je Entwurf `shot-desktop.png`, `shot-steckbrief.png`, `shot-mobil.png` ablegen.
