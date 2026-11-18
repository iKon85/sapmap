---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: Alternative 1 „Verzeichnis“ (Prototyp)

Scope: Landschaft und Steckbrief der S/4HANA-Landkarte als aufklappbares Verzeichnis. Mode: Operate. Welt: Wavestone-CI (vom Auftrag festgelegt, aus dem Ausgangsentwurf `../impeccable/` übernommen). Ohne Rückfrage gebaut: Der Auftrag verlangt drei Alternativen und schließt Fragen aus; die drei ausgeteilten Strukturen des Würfels werden alle gebaut, die Entscheidungsseite entfiel.

Publikum und Aufgabe: SAP-Berater aller Rollen; vergleichen, sortieren, nachlesen, ohne die Liste zu verlassen. Inhalt: 154 Steckbriefe aus `data/steckbriefe.json`, 365 datierte Ereignisse.

## Direction contract

THESIS: Die Landschaft ist ein Verzeichnis, das man wie eine Gliederung aufklappt: 12 Bereiche, darunter die Bausteine, darunter der Steckbrief in der Zeile. Verweigert: das Kachelraster und die eigene Detailseite.
OWN-WORLD: Weißer Grund, schwarzer Text, Markenviolett als Kopfband und als Zeile des geöffneten Bausteins. Eine Tabelle mit Haarlinien in getöntem Violett. Statusmarken mit Piktogramm und Wort (Grün neu, Hellgrün umbenannt, Gelb läuft aus, Rot abgekündigt). Aptos-Stack, eine Familie, Tabellenziffern.
STORY: Der Berater sieht die ganze Landschaft in 12 Zeilen mit Zeitachse, klappt einen Bereich auf, vergleicht Bausteine nach Status und nächstem Termin, liest den Steckbrief an Ort und Stelle und springt über Verwandte zur nächsten Zeile.
FIRST VIEWPORT: Violettes Kopfband mit Titel, Suche, Testperspektive. Darunter Leiste mit Gliederung (Nach Bereich / Alle Bausteine), Statusfiltern und Zähler. Darunter die Tabelle: Spalten Baustein, Status, Zeitachse 2023–2031, Nächster Termin, Belegstatus; 12 Bereichszeilen füllen den ersten Bildschirm.
SIGNATURE: Die Zeitachse ist eine Tabellenspalte mit gemeinsamer Skala; die Heute-Linie läuft als eine durchgehende Linie durch alle Zeilen. Bewegung: nur Zustandswechsel beim Aufklappen (150–200 ms).
FORM: Struktur 4 von 6 der eigenen Liste (Verzeichnis), ausgeteilt als Führung. seed:e597bd8ad1f219e1. Übernommen von abgelehnten Herausforderern: Abfahrtstafel (Sortierung nach nächstem Termin, Zeilen behalten ihre Identität).
LOOK (Auftrag Punkt 2, Klarstellung vom 18.11.2026): shadcn/ui-Preset b3QxdAzBg für Form und Struktur (Style Nova mit kompakten Bedienelementen, Radius Small, Phosphor Icons lokal, Menu Default/Solid, Menu Accent Bold, Token nach shadcn-Muster, hell und dunkel); Farben und Schrift aus der Wavestone-CI (Violett #451DC7 als --primary, #04F06A, #CAFEE0, #250F6B, Aptos-Stack). Die CI überschreibt das Preset dort, wo sie etwas vorgibt.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Offen

Einstiegstext, Mehrfachzuordnung und die übrigen Ansichten der alten Seite sind nicht Teil dieser Alternative.
