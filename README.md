# sapmap · S/4HANA-Landkarte

Interaktive Architekturkarte der SAP-Landschaft rund um S/4HANA, Stand Oktober 2026. Eine einzige statische HTML-Seite ohne Server und ohne Build-Abhängigkeiten außer Python 3.

Ansichten:

- **Landkarte**: alle Bausteine nach Bereich, Klick öffnet den Steckbrief und hebt verwandte Bausteine hervor
- **Schichtenmodell**: wie die Kästen zusammengesteckt sind, von Infrastruktur und HANA über den Kern und die Clean-Core-Grenze bis zu Integration, Anwendungen und Anwendern
- **Integrationswege**: welche Technik zwischen S/4HANA und dem Rest der Landschaft läuft
- **Toolchain**: Werkzeuge der Einführung über die sechs SAP-Activate-Phasen, mit Cloud ALM als Rückgrat und einer Bahn für abgelöste Werkzeuge
- **Clean Core**: Stufen A bis D und die drei Erweiterungswege
- **Zeitleiste**: Wartungsenden und weitere datierte Ereignisse

Jeder Steckbrief beschreibt, was die Lösung macht, wie sie technisch funktioniert, wie sie mit S/4HANA zusammenhängt, wann man sie einsetzt, Lizenz, Daten und Quellen. Der Schalter „Testperspektive“ blendet zusätzlich ein, was die Lösung für Test und Qualitätssicherung bedeutet.

## Aufbau

```
src/landkarte.html          Vorlage: Layout, CSS, JavaScript; Platzhalter für die Daten
data/steckbriefe.json       alle Steckbriefe (eine Datei, ein Objekt pro Baustein)
data/toolchain-flows.json   Datenflüsse zwischen den Toolchain-Werkzeugen (Tabelle in der Toolchain-Ansicht)
scripts/validate.py         prüft die Daten (IDs, Verweise, Pflichtfelder, Datumsformat)
scripts/build.py            prüft und baut dist/
dist/index.html             fertige Seite zum Hosten
dist/artifact.html          dieselbe Seite ohne Dokumentgerüst, für Claude-Artifacts
docs/datenmodell.md         Felder, Bereiche, Status-Werte
docs/recherche/             Recherche-Notizen mit Quellen, aus denen die Steckbriefe entstanden sind
```

## Bauen und lokal ansehen

```bash
python3 scripts/build.py
open dist/index.html        # macOS; unter Windows: start dist\index.html
```

## Hosten

`dist/index.html` ist vollständig in sich geschlossen. Nur die Schriften kommen von Google Fonts; ohne Netz greifen Systemschriften. Die Datei kann auf jeden Webspace, nach GitHub Pages, Netlify oder Cloudflare Pages. Ansichten und Steckbriefe lassen sich direkt verlinken, z. B. `index.html#schichten` oder `index.html#pipo`.

## Stand der Inhalte

Recherche vom 24. Oktober 2026. Jeder Steckbrief trägt im Feld `belegt`, wie gut er durch Quellen gedeckt ist (`ja`, `teilweise`, `nein`). Auf der Karte sind nur teilweise belegte Bausteine gestrichelt umrandet. Links auf SAP-Hinweise (me.sap.com) brauchen einen S-User.
