---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: Alternative 3 „Lagebild“ (Prototyp)

Scope: Landschaft und Steckbrief der S/4HANA-Landkarte als Punktmatrix. Mode: Operate. Welt: Wavestone-CI (vom Auftrag festgelegt, aus dem Ausgangsentwurf `../impeccable/` übernommen). Ohne Rückfrage gebaut: Der Auftrag verlangt drei Alternativen und schließt Fragen aus; die drei ausgeteilten Strukturen des Würfels werden alle gebaut, die Entscheidungsseite entfiel.

Publikum und Aufgabe: SAP-Berater aller Rollen; erkennen, wo sich etwas bewegt (neu, umbenannt, läuft aus), eine Gruppe auswählen und ihre Steckbriefe nacheinander lesen. Inhalt: 154 Steckbriefe aus `data/steckbriefe.json`.

## Direction contract

THESIS: Die Landschaft ist ein Lagebild: 12 Bereiche als Zeilen, eine wählbare Frage als Spalten, jeder Baustein genau ein Punkt. Wer eine Zelle wählt, hat einen Stapel Steckbriefe zum Durchblättern. Verweigert: die Namensliste, in der 119 unauffällige Bausteine die 35 auffälligen verdecken.
OWN-WORLD: Weißer Grund, schwarzer Text. Punkte als kleine Quadrate: aktiv in Markenviolett, die anderen Status in ihrer Signalfarbe mit Piktogramm. Die Auswahl steht als violette Tafel rechts, weiße Schrift darauf. Tiefviolett für Kopf des Steckbriefs. Aptos-Stack, Tabellenziffern.
STORY: Der Berater sieht auf einen Blick, wo Neues und Auslaufendes sitzt, schaltet die Spalten auf Belegstatus oder nächsten Termin, wählt eine Zelle und blättert durch die Steckbriefe dieser Auswahl.
FIRST VIEWPORT: Weiße Kopfzeile mit Titel, Suche, Testperspektive. Links die Matrix mit Spaltenumschalter (Status, Belegstatus, Nächster Termin) und allen 154 Punkten ohne Scrollen; rechts die violette Tafel „Auswahl“, ohne Auswahl mit den Zahlen der Lage und den nächsten Wartungsenden.
SIGNATURE: Der Spaltenwechsel. Ein Schalter sortiert alle 154 Punkte in einem Zug um; jeder Punkt wandert sichtbar an seinen neuen Platz (250 ms, einmalig, kein weiterer Bewegungseffekt).
FORM: Struktur 5 von 6 der eigenen Liste (Lagebild), ausgeteilt. seed:e597bd8ad1f219e1. Übernommen von abgelehnten Herausforderern: Rasterschrift nach Crouwel (ein Baustein, eine Zelle, sichtbares Raster), Schriftmuster mit Achsenregler (ein Regler verändert das ganze Feld).
LOOK (Auftrag Punkt 2, Klarstellung vom 18.11.2026): shadcn/ui-Preset b3QxdAzBg für Form und Struktur (Style Nova mit kompakten Bedienelementen, Radius Small, Phosphor Icons lokal, Menu Default/Solid, Menu Accent Bold, Token nach shadcn-Muster, hell und dunkel); Farben und Schrift aus der Wavestone-CI (Violett #451DC7 als --primary, #04F06A, #CAFEE0, #250F6B, Aptos-Stack). Die CI überschreibt das Preset dort, wo sie etwas vorgibt.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Offen

Einstiegstext, Mehrfachzuordnung und die übrigen Ansichten der alten Seite sind nicht Teil dieser Alternative.
