# Bestandsaufnahme der S/4HANA-Landkarte

Stand: 25.10.2026, geprüft gegen Commit `5638be6` (Recherche vom 24.10.2026). Grundlage: vollständige Lektüre von `CLAUDE.md`, `README.md`, `docs/datenmodell.md`, `src/landkarte.html`, Auswertung beider Datendateien per Skript und eine Quellenstichprobe über 15 Steckbriefe.

Prioritäten: **kritisch** = falsche Aussagen für Nutzer, rechtliches Risiko oder Blocker für den Umbau. **Wichtig** = spürbar schlechtere Orientierung oder Wartung. **Nett** = Verbesserung ohne Schaden im Ist-Zustand.

---

## 1. Kritisch

### K1 Belegstatus ist systematisch zu großzügig

Von den 15 geprüften Steckbriefen ist bei 9 der Wert `belegt: ja` zu hoch angesetzt. Zwei sind inhaltlich veraltet, vier haben tote Links (404), und einer widerspricht sich selbst.

| Steckbrief | Befund |
|---|---|
| `dremio` | **veraltet**: Laut news.sap.com ist die Übernahme seit 06.07.2026 abgeschlossen; der Steckbrief nennt sie geplant, Closing „Q3 erwartet“. |
| `rpt-1` | veraltet: SAP führt RPT-1.5 und 1.6 selbst; „laut Drittquelle“ stimmt nicht mehr. Lizenz „Apache 2.0“ ohne den Vorbehalt „nur Forschung/nicht kommerziell“. Variantenzahlen stammen aus einer nicht verlinkten Quelle. |
| `pipo` | „2 Prozentpunkte“ Aufschlag steht an drei Stellen, ist aber in keiner lesbaren Quelle belegt; die SAP-News-Quelle liefert 404. |
| `solman` | innerer Widerspruch: `test` sagt „laut Quellen nicht übertragen“, `hinweis` sagt „nicht belegt“. Signavio-Sync, „RISE ohne SolMan-Rechte“ und Etappen ohne Quelle. |
| `idm` | nur Sekundär-/Anbieterquellen; Widerspruch (Consiness: Entra als „offizieller SAP-Nachfolger“) fehlt im `hinweis`, obwohl CLAUDE.md das verlangt. |
| `lama` | nur Anbieterquellen; PCG „Automatisierung künftig nur für RISE“ widerspricht `s4`/`wann`. |
| `business-suite` | Base/Premium-Stufen und Concur-Zuordnung ungedeckt; „50+ Assistenten, 200+ Agenten“ ist bei SAP Zukunft („in the coming months“), im Steckbrief Gegenwart. |
| `clean-core` | Weakest-Link-Regel, Success-Plan-Inhalt, KW 36/2026 ungedeckt; Measurement-Framework-Quelle 404; Level-B-Definition weicht zwischen SAP-Quellen ab, ohne Hinweis. |
| `bdc` | „Teil der Business AI Platform“, „über 200 Datenprodukte“, Zero-Copy-Partnerliste ungedeckt; Architekturquelle 404. |
| `tdms` | stützt sich auf Login-Hinweise und Anbieterseiten; `daten` enthält Wartungsenden der Business Suite 7, die die Zeitleiste als TDMS-Wartungsende zeigt. |
| `event-mesh` | Grenzwerte und „nur CPEA“ aus knowledgelib.io (ohne Autor und Datum, wirkt maschinell erzeugt); zwei Quellen 404; „Trial 2023 eingestellt“ ohne Quelle. |
| plausibel | `s4-cloud-erp` (kleine Lücken im `hinweis`), `agent-led-toolchain`, `neo`, `walkme-enable-now` (`hinweis` „nur eine Partnerquelle“ überholt). |

Hochgerechnet auf 94 Steckbriefe mit `ja` ist vermutlich mehr als die Hälfte zu hoch eingestuft. Die Ursache liegt in der Regel selbst: `belegt` gilt pro Steckbrief, dadurch rutschen ungedeckte Details in einen belegten Steckbrief.

**Vorschlag:**
- `ja` nur, wenn jede Zahl, jedes Datum und jeder Name eine Quelle hat. Quellen bekommen `art` (primär/sekundär) und `abgerufen` (Datum). Aggregatoren ohne Autor sind kein Beleg.
- Ein Nachprüfungslauf über alle 94 `ja`-Steckbriefe, als eigene Commits.
- Linkcheck in der CI als Bericht, nicht als Build-Abbruch, weil sap.com Bots oft mit 403 abweist.

### K2 Der Filter „Nur Wartungsenden“ rät am Text

`isEol()` erkennt Wartungsenden per Regex im deutschen Text.

- Falsch positiv: „arXiv-Preprint mit Variant**endet**ails“ (`rpt-1`), „S/4HANA 2023: Start des 2-Jahres-Zyklus“, Neo-Ankündigung 2023, die BS7-Daten bei `tdms`.
- Falsch negativ: PI/PO Extended Maintenance 2030, IS-U EM 2030, TM LE-TRA 2030, EC-CS 2027, Enable-Now-Abos 04/2027, ECC EM 2030 (`transition-option`), BO P1-Support 2027.
- Die Zahl im Kasten „2027 ist das Klippenjahr“ wird daraus berechnet und ist damit falsch.

**Vorschlag:** `daten[]` bekommt ein Pflichtfeld `typ` (z. B. `wartungsende`, `ga`, `ankuendigung`, `umbenennung`, `release`, `sonstiges`), bei Wartungsenden zusätzlich `stufe` (mainstream/extended/nutzungsrecht). Die Zeitleiste filtert nach `typ`, nicht nach Text. Das ist auch die Voraussetzung für das Feature „Zeitleiste gegen Go-live“.

### K3 Legende und Code widersprechen sich beim Belegstatus

Legende und README versprechen: „nur teilweise belegt“ = gestrichelt. Der Code strichelt nur `belegt: "nein"`, also 2 Bausteine statt 58 teilweise belegter. Nutzer halten damit 58 Steckbriefe für voll belegt.

**Vorschlag:** gestrichelt für `teilweise` und `nein`, unterscheidbar (z. B. gestrichelt bzw. gepunktet), und die Legende passend.

### K4 Inhalte stecken im Code und driften

Außer `data/*.json` gibt es weitere Inhaltsquellen in `landkarte.html`:

- Mehrfachzuordnung (`ALSO`)
- Platzierung im Schichtenmodell (`cfg`)
- die komplette Integrationsgrafik
- Toolchain-Karten mit eigenen Beschreibungen **und eigenen Flusspfeilen** (`TC_LANES[].f`). Das ist eine zweite Wahrheit neben `toolchain-flows.json`.
- der Einstiegstext mit Datumsaussagen
- der Klippenjahr-Text
- Diagrammbeschriftungen wie „PI/PO (endet 2027)“, „Neo (endet 2028)“, „LaMa (endet 2027)“

Ändert sich ein Datum im Steckbrief, bleiben diese Stellen stehen. Die Prüfung kennt sie nicht, ein toter Verweis in `cfg` verschwindet stillschweigend (`if(!d) return ""`).

**Vorschlag:**
- Platzierung und Texte der Ansichten werden Daten (z. B. `data/ansichten/*.json`) mit Schema und Referenzprüfung.
- Datumsangaben in Beschriftungen werden aus den Steckbriefen abgeleitet, nicht getippt.
- Die Toolchain-Flüsse kommen aus genau einer Datei.

### K5 Teilbare Zustände sind kaputt

- Der Verlauf läuft nur über `replaceState`: Die Zurück-Taste springt aus der Seite heraus statt zur vorigen Ansicht.
- Ansicht und Auswahl teilen sich den Hash: Wer im Schichtenmodell einen Baustein wählt, landet nach dem Neuladen auf der Landkarte.
- Suche, Status-Filter und Testperspektive stehen nicht in der URL, die Testperspektive steckt nur in `localStorage`.

Für eine Seite, die Berater untereinander verlinken, ist das der Kernfehler. Die geplanten Routen mit Search-Params lösen ihn.

### K6 Google Fonts werden extern geladen

Die Schriften kommen von fonts.googleapis.com. Bei einer öffentlichen Seite auf eigenem Server in Deutschland ist das ein bekanntes DSGVO-Risiko (Übermittlung der IP-Adresse; LG München I, 2022). **Vorschlag:** Archivo, IBM Plex Sans und IBM Plex Mono selbst hosten (beide unter OFL). Aufwand trivial.

---

## 2. Wichtig

### W1 Die Bereiche sind an mehreren Stellen unscharf geschnitten

Größen: tool 29, core 22, lob 22, int 20, btp 14, mig 12, ai 8, data 8, sec 7, ext 4, pm 4, ops 4.

- **`tool` gegen `pm`:** Die Grenze ist willkürlich. `calm-pm` liegt in pm, `cloud-alm`, `calm-test` und `agent-led-toolchain` in tool, `activate` in pm. Die Verwechslung „Projektmanagement“ ist strukturell angelegt: Der Bereich heißt `pm`, und beide Bereichsbeschreibungen (core und pm) reden von Projektmanagement. Die Toolchain-Ansicht hat bereits einen besseren Schnitt mit ihren Bahnen (Prozesse & Architektur, Analyse & Überführung, Cloud ALM, Test & Qualität, Methodik & Adoption).
  **Vorschlag:** tool, mig und pm neu schneiden, entlang der Toolchain-Bahnen. Dann sprechen Landkarte und Toolchain dieselbe Sprache.
- **`core` mischt Betriebsmodell und Anwendungen:** Die Deployment-Varianten (Cloud ERP, Private, On-Premise, Business Suite, RISE) stehen neben EWM, TM und MDG. Verträge und Betriebsmodelle verteilen sich auf drei Bereiche: `rise-grow` in core, `transition-option` in mig, `rise-ecs` und `sovereign-cloud` in ops.
  **Vorschlag:** ein Bereich „Betriebsmodelle & Verträge“, oder zumindest alle vier dort zusammenführen.
- **Utilities als einzige Branche:** Sieben Bausteine sind auf core und lob verteilt, mit DACH-Spezifika (Redispatch, EDA Österreich). Andere Branchen kommen nicht vor. Das ist ein Artefakt der Nachrecherche.
  **Vorschlag:** Branche als Facette (Feld `branche`), nicht als Bereich. Klären, ob Utilities sichtbar bleibt oder hinter einem Filter liegt.
- **`int` enthält Datenreplikation:** `slt`, `data-services` und `data-intelligence` sind eher Daten als Prozessintegration. Data Intelligence läuft zudem aus zugunsten von Datasphere.
- **`ext` mit 4 Bausteinen** ist dünn. Er funktioniert als „Clean-Core-Grenze“ im Bild, nicht als Bereich.

Die sechs Ansichten sind fachlich richtig gewählt. Zwei Probleme gibt es trotzdem, siehe W2.

### W2 Zwei Architekturbilder mit widersprüchlicher Raumlogik

Die Landkarte ist als Poster gebaut: Projekt oben, LoB links, Security rechts, Betrieb unten. Das Schichtenmodell zeigt dasselbe noch einmal anders: Security links, Projekt rechts, SaaS oben links. Wer zwischen beiden wechselt, muss sich neu orientieren. Die Integrationswege sind fachlich ein Ausschnitt des Schichtenmodells.

**Vorschlag:** entweder gleiche Orientierung in beiden Bildern, oder die Landkarte wird bewusst ein neutrales Raster nach Bereichen (Katalog) und das Schichtenmodell das eine Architekturbild. Ich empfehle das zweite: Es ist ehrlicher, mobil besser und macht Scoping und Rollenhervorhebung einfacher.

### W3 Lücken im Bestand

Es fehlen:
- **SAP ECC / Business Suite 7**: das System, von dem fast alle migrieren. Ihre Wartungsenden (2027/2030) stecken heute versteckt in `tdms` und `transition-option`.
- **AIF (Application Interface Framework)**: Schnittstellen-Monitoring, wichtig für Integration und Test, im Text von Central Finance erwähnt.
- **Central Business Configuration**: Pflicht in Public-Cloud-Projekten.
- SAP GUI / Business Client, Output Management / Formulare, SAP Asset Manager (in `fsm` erwähnt), Cloud Integration for data services.

Die Basis-Rolle ist unterversorgt, `ops` hat 4 Bausteine. Es fehlen Web Dispatcher, SAProuter, HANA System Replication und Backup sowie Systemkopie und -aktualisierung.

`central-finance` hat keine einzige Quelle.

### W4 Barrierefreiheit (WCAG 2.1 AA)

- **1.4.3 Kontrast:** `--faint` (#8A95A4) erreicht hell nur 3,0:1 auf Weiß und 2,7:1 auf dem Hintergrund. Betroffen sind Abschnittsüberschriften im Steckbrief, Zählungen, Zeitleisten-Daten und Bahnnamen.
- **1.4.1 Benutzung von Farbe:** „neu“ und „umbenannt“ unterscheiden sich nur durch die Farbe des Punkts.
- **4.1.2 Name, Rolle, Wert:**
  - Schichtenmodell und Integrationsgrafik sind `role="img"`. Ihre anklickbaren `role="button"`-Kinder sind damit für Screenreader unsichtbar.
  - Die Tabs haben kein `tabpanel` und kein `aria-controls`, außerdem keine Pfeiltasten-Bedienung.
  - Der Filter „Nur Wartungsenden“ meldet seinen Zustand nicht nach.
- **Screenreader-Ausgabe:** `aria-live` liegt auf dem ganzen Detail-Panel, jede Auswahl liest den kompletten Steckbrief vor.
- **Mobile Bottom-Sheet:** keine Fokusführung, kein Fokus-Rücksprung.
- **Esc:** hebt die Auswahl auch beim Tippen in der Suche auf.
- **Schriftgrößen:** 10,5 bis 11,5 px für Beschriftungen und Einzelprodukte.

### W5 Suche und Filter

- Beides wirkt nur auf die Landkarte. Wer tippt, wird aus jeder Ansicht auf die Landkarte geworfen.
- Keine Trefferzahl, keine Meldung „keine Treffer“. Enter wählt stillschweigend den ersten Treffer.
- Gesucht wird nur in Name, aka, kurz, was und id, nicht in s4, wann oder Lizenz.
- Der Status-Filter hat kein „aktiv“ und fasst „abgekündigt“ unter „läuft aus“.
- Ein Klick ins Leere hebt die Auswahl auf. Das ist überraschend und kostet bei Fehlklicks den offenen Steckbrief.

### W6 Das Schema ist zu schwach für die Daten, die es tragen soll

- `status` mischt Lebenszyklus und Namensgeschichte. Ein Baustein kann umbenannt sein **und** auslaufen.
- „neu“ hat keinen Stichtag. Die Legende sagt „neu seit 2025“, das veraltet.
- `daten[]` ohne `typ` (siehe K2).
- `quellen[]` ohne Art und Abrufdatum. `belegt` gilt pro Steckbrief statt pro Aussage (siehe K1).
- Leere Information steht als Text drin („keine belastbare Angabe“) statt als fehlendes Feld.
- Die Regel „verwandt: 2 bis 5“ wird nicht geprüft und ist verletzt: `signavio` 8, `leanix` 6, `walkme` 6.
- `test` ist Pflicht, auch dort, wo es nichts Testspezifisches zu sagen gibt.

### W7 Diagramme

- Textkürzung über eine geschätzte Zeichenbreite (`CH=6.7`): Bei anderer Schrift laufen Beschriftungen über oder werden unnötig gekürzt.
- Das Schichtenmodell ist 1800 px breit. „Einpassen“ macht die Schrift auf Laptop-Breite unlesbar klein (etwa 6 px effektiv).
- Integrationsgrafik und Toolchain brauchen 760 bzw. 1000 px Mindestbreite. Mobil bleiben sie Scroll-Flächen ohne Hinweis, dass man scrollen kann.

### W8 Mobil

- Der Einstieg („Was sich seit ECC-Zeiten verschoben hat“) ist auf Geräten unter 900 px **nie sichtbar**, weil das Panel dort nur als Bottom-Sheet bei einer Auswahl aufgeht.
- Die fixierte Tab-Leiste mit Auswahlpille ist bei 400 px eng: Die Pille nimmt 60 % ein.

### W9 Technik und Wartung

**Was trägt:**
- Daten als JSON getrennt von der Darstellung
- Validierung vor dem Build
- Design-Tokens mit Hell/Dunkel
- konsequentes Escaping
- keine Abhängigkeiten

**Was nicht trägt:**
- 600 Zeilen Rendering über String-Templates, DOM-Zustand über Klassen-Toggles
- globale Variablen (`SEL`, `ST_F`, `TL_F`)
- `dist/` ist eingecheckt und wird von Hand mitgebaut
- keine Tests
- jede Ansicht rendert beim Start, auch unsichtbare
- `artifact.html` als zweites Ausgabeformat ist nach dem Umbau überflüssig

---

## 3. Nett

- N1 Theme-Umschalter: Das CSS kennt `data-theme`, aber es gibt keinen Schalter.
- N2 Linkvorschau (Open-Graph-Tags) je Baustein für geteilte Links in Teams und Slack. Mit Vorrendern gratis.
- N3 Druckansicht für Steckbrief und Landkarte.
- N4 Zählungen zeigen nur Heimat-Bausteine, obwohl die Mehrfachzuordnungen mit angezeigt werden. Das ist missverständlich.
- N5 Tooltip-Kurzbeschreibung (`title`) gibt es nur für Maus, nicht für Touch und Tastatur.
- N6 Der Recherche-Stand („Stand Oktober 2026“) steht als fester Text im Kopf, statt aus den Daten zu kommen.

---

## 4. Stack-Empfehlung: TanStack Start im Prerender-Modus

**Empfehlung: TanStack Start (React, TypeScript strict) mit statischem Vorrendern, ohne Server-Laufzeit.**

- **Statisches Hosting:** Start rendert alle Routen beim Build zu HTML (`prerender.enabled`, `crawlLinks`). Die 154 Seiten `/baustein/$id` werden über die Links der Landkarte automatisch gefunden. Heraus kommt ein Ordner mit Dateien, den nginx ausliefert, ohne Node im Betrieb.
- **Was Vite + Router allein nicht kann:** Ohne Start gibt es eine leere `index.html` für alle URLs. Dann gibt es keine Linkvorschau je Baustein (N2), keinen lesbaren Inhalt ohne JavaScript und einen langsameren ersten Aufbau auf Mobilgeräten. Für Vorrendern müsste man ein Fremd-Plugin anbauen. Damit hätte man Start nachgebaut, nur schlechter gewartet.
- **Wartbarkeit:** dateibasierte Routen, typisierte Search-Params (`validateSearch` mit Zod) und dieselbe Router-API. Der Mehraufwand gegenüber Vite + Router ist eine Plugin-Zeile und das Vorrendern in der Konfiguration.
- **Features:** Alle vorgeschlagenen Features laufen rein im Browser (Zustand in der URL und in `localStorage`). Keines braucht einen Server. Sollte später doch einer nötig sein, etwa für gemeinsam bearbeitete Projekt-Scopings, lässt sich Start auf den Node-Server-Modus umstellen, ohne die Routen umzubauen. Vite + Router hätte diesen Weg nicht.
- **Risiko:** Start ist jünger als Router. Abgefedert wird das, weil wir nur den Prerender-Pfad nutzen, keine Server-Funktionen. Der Playwright-Vergleich alt gegen neu fängt Regressionen.

Hash-Weiterleitungen (`#schichten`, `#pipo`) laufen in beiden Varianten clientseitig in der Wurzelroute, weil der Hash nie beim Server ankommt.

---

## 5. Mögliche neue Features

| # | Feature | Nutzen | Aufwand | Auswirkung auf die Architektur |
|---|---|---|---|---|
| F1 | **Projekt-Scoping** („Mein Projekt“): Bausteine markieren, als Liste exportieren (Markdown, CSV) und als Bild (SVG/PNG der Landkarte mit hervorgehobenem Scope) | Hoch für Architektur und Projektleitung: Scope-Bild direkt für den Kick-off. Zugleich Basis für F5. | M (Bildexport ist der teure Teil) | Scope als Search-Param (`?scope=…`) und in `localStorage`. Die Landkarte muss sich exportierbar rendern lassen, also SVG oder ein sauberes DOM-zu-Bild. Spricht für W2 (Landkarte als Raster). |
| F2 | **Rollenansicht**: Rolle wählen (Architektur, Integration, Test, Basis, Projektleitung). Relevante Bausteine werden hervorgehoben, rollenspezifische Steckbrief-Abschnitte eingeblendet. | Hoch für alle Rollen; verallgemeinert die Testperspektive (die ist schon eine Rollenansicht für eine Rolle). | Code S, **Daten L** (154 Steckbriefe bewerten, für Basis und Integration Texte ergänzen) | Schema: `rollen[]` je Steckbrief, Testperspektive wird `perspektive=test`. Search-Param `?rolle=`. Setzt W3 (Basis-Lücken) voraus, sonst ist die Basis-Sicht leer. |
| F3 | **„Neu seit …“**: Änderungen zwischen Recherche-Ständen markieren, mit Änderungsliste je Stand | Mittel bis hoch: Wiederkehrende Nutzer sehen sofort, was sich bewegt hat (z. B. Dremio-Abschluss). Macht K1 sichtbar und pflegbar. | M | Recherche-Stände als Git-Tags oder Schnappschüsse. Ein Build-Schritt vergleicht die Stände und erzeugt `aenderungen.json`. Neues Feld `geprueft` (Datum) je Steckbrief. Rein statisch. |
| F4 | **Vergleich** zweier Bausteine nebeneinander (`/vergleich?a=event-mesh&b=aem`) | Mittel: genau die Fragen, die in Workshops kommen. Die `wann`-Felder enthalten die Abgrenzung schon. | S | Neue Route, verwendet die Feld-Komponenten des Steckbriefs wieder. Keine Schemaänderung. |
| F5 | **Zeitleiste gegen Projektplan**: Go-live-Datum (optional Phasen) eingeben; Wartungsenden erscheinen relativ dazu („läuft 14 Monate nach Go-live aus“), optional nur für den Scope aus F1 | Hoch für Projektleitung und Architektur: beantwortet „was müssen wir mitmigrieren?“ | M | Setzt K2 voraus (`daten[].typ`). Search-Param `?golive=2028-01`. Mit F1 zusammen am stärksten. |
| F6 | **Katalog-Tabelle** aller Bausteine: sortier- und filterbar nach Bereich, Status, Belegstatus und nächstem Wartungsende, mit CSV-Export | Mittel: schneller Überblick für die Projektleitung, nebenbei ein Pflegewerkzeug für die Daten | S | Einziger sinnvoller Einsatz von TanStack Table neben der Fluss-Tabelle. Neue Route `/katalog`. |

**Meine Empfehlung für 2–3 Features:** F1 Projekt-Scoping und F5 Zeitleiste gegen Projektplan. Zusammen beantworten sie die Kernfrage der Zielgruppe: Was davon betrifft mein Projekt, und was läuft mir dabei weg? Als drittes Feature F3 „Neu seit …“, weil die Daten nachweislich schnell veralten. F2 lohnt erst, wenn die Datenlücken der Basis-Rolle geschlossen sind.
