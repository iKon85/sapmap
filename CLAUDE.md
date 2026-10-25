# CLAUDE.md

Statische Ein-Seiten-App: interaktive Karte der SAP-Landschaft rund um S/4HANA. Sprache der Inhalte und der Oberfläche: Deutsch mit echten Umlauten.

## Arbeitsweise

- Inhalte ändern: nur in `data/steckbriefe.json` bzw. `data/toolchain-flows.json`. Layout und Logik: nur in `src/landkarte.html`.
- `dist/` wird erzeugt, nie von Hand bearbeiten. Nach jeder Änderung `python3 scripts/build.py` laufen lassen und `dist/` mit committen (die Website liefert `dist/index.html` aus).
- Der Build bricht ab, wenn `scripts/validate.py` Fehler findet. Fehler beheben, nicht die Prüfung lockern.
- Datenmodell, Bereiche (`layer`) und Status-Werte: `docs/datenmodell.md`.

## Steckbriefe

- Neuer Baustein: Objekt in `data/steckbriefe.json` einfügen, alle Pflichtfelder füllen. Die Reihenfolge in der Datei bestimmt die Reihenfolge auf der Landkarte.
- Ein Produkt eines Portfolios bekommt `"parent": "<Dach-ID>"`; es erscheint dann eingerückt unter dem Dach.
- `verwandt`: 2 bis 5 IDs, nur existierende. Rückverweise ergänzt die Seite automatisch.
- Quellen nur mit echten, geprüften URLs. Was nur Fachwissen ist, mit `belegt: "teilweise"` oder `"nein"` und einem `hinweis` kennzeichnen. Widersprüche zwischen Quellen in `hinweis` offen nennen.
- Eigene Formulierungen, keine Sätze aus Quellen übernehmen.
- Das Feld `test` ist die Testperspektive; es wird nur bei eingeschaltetem Schalter angezeigt. Die übrigen Felder schreiben für alle SAP-Rollen, nicht nur für Testmanager.

## Wo Bausteine auf der Seite erscheinen

- Landkarte: automatisch nach `layer`. Zusätzliche Bereichszuordnung über `ALSO` in `src/landkarte.html`.
- Schichtenmodell: Platzierung in `renderStack()` (Objekt `cfg`). Neue Bausteine ohne Platz werden automatisch nach `layer` einsortiert; für eine gute Darstellung dort gezielt eintragen.
- Integrationswege: feste Grafik in `renderIntegration()`.
- Toolchain: Karten in `TC_LANES` (Bahn, Spalten = Activate-Phasen 1 bis 6).
- Zeitleiste: automatisch aus `daten` aller Steckbriefe; Wartungsenden erkennt `isEol()` am Text.

## Prüfen

```bash
python3 scripts/validate.py
python3 scripts/build.py
```

Seite im Browser in hellem und dunklem Modus und bei etwa 400 px Breite ansehen; die Seite darf nie seitlich scrollen (nur die Grafiken in ihren eigenen Scroll-Containern).

## Agent skills

### Issue tracker

Issues, Specs und die Wayfinder-Karte liegen als GitHub Issues in `iKon85/sapmap` (`gh`-CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Standard-Labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` und `docs/adr/` im Repo-Wurzelverzeichnis. See `docs/agents/domain.md`.
