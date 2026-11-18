---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: Alternative 2 „Architekturschnitt“ (Prototyp)

Scope: Landschaft und Steckbrief der S/4HANA-Landkarte als Schichtenbild. Mode: Operate. Welt: Wavestone-CI (vom Auftrag festgelegt, aus dem Ausgangsentwurf `../impeccable/` übernommen). Ohne Rückfrage gebaut: Der Auftrag verlangt drei Alternativen und schließt Fragen aus; die drei ausgeteilten Strukturen des Würfels werden alle gebaut, die Entscheidungsseite entfiel.

Publikum und Aufgabe: SAP-Berater aller Rollen; verstehen, wo ein Baustein in der Architektur sitzt und womit er zusammenhängt. Inhalt: 154 Steckbriefe aus `data/steckbriefe.json`; Anordnung der Bereiche nach dem Schichtenmodell der bisherigen Seite.

## Direction contract

THESIS: Die Landschaft ist das eine Bild, das SAP-Berater ans Whiteboard zeichnen: Anwendungen oben, Integration dazwischen, Plattform darunter, Betrieb als Fundament, die Projektwerkzeuge als Säule daneben. Jeder Baustein hat darin genau einen Ort. Verweigert: die gleichförmige Spaltenliste, in der Lage nichts bedeutet.
OWN-WORLD: Weißer Grund, schwarzer Text. Der S/4HANA-Kern ist die eine violette Fläche des Bildes; alle anderen Bereiche liegen auf violett getöntem Grund. Die Clean-Core-Grenze ist eine grüne Linie um den Kern. Bausteine als weiße Plättchen mit kompakter Statusmarke; „SAP“ im Namen tritt zurück. Verwandte leuchten hellgrün, der zuletzt geöffnete Baustein tiefviolett. Aptos-Stack.
STORY: Der Berater erkennt die Lage der Bereiche, fährt über einen Baustein und sieht seine Verwandten im Bild aufleuchten, öffnet den Steckbrief und behält über den Lageplan die Orientierung.
FIRST VIEWPORT: Weiße Kopfzeile mit Titel, Suche, Testperspektive; Legende, die zugleich filtert. Darunter das Bild: links oben der violette Kern mit grüner Grenze, daneben LoB-Apps, darunter Integration als durchgehendes Band, rechts die Säule „Projekt & Lebenszyklus“.
SIGNATURE: Der Lageplan. Im Steckbrief bleibt das Schichtenbild als Miniatur stehen, markiert den eigenen Bereich und zählt die Verwandten je Bereich. Bewegung: nur das Aufleuchten der Verwandten (150 ms).
FORM: Struktur 1 von 6 der eigenen Liste (Architekturschnitt), ausgeteilt. seed:e597bd8ad1f219e1. Übernommen von abgelehnten Herausforderern: Liniennetz (den gewählten Korridor betonen, den Rest stehen lassen statt ausblenden).
LOOK (Auftrag Punkt 2, Klarstellung vom 18.11.2026): shadcn/ui-Preset b3QxdAzBg für Form und Struktur (Style Nova mit kompakten Bedienelementen, Radius Small, Phosphor Icons lokal, Menu Default/Solid, Menu Accent Bold, Token nach shadcn-Muster, hell und dunkel); Farben und Schrift aus der Wavestone-CI (Violett #451DC7 als --primary, #04F06A, #CAFEE0, #250F6B, Aptos-Stack). Die CI überschreibt das Preset dort, wo sie etwas vorgibt.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Offen

Einstiegstext, Mehrfachzuordnung und die übrigen Ansichten der alten Seite sind nicht Teil dieser Alternative.
