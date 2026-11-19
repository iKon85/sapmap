# S/4HANA-Landkarte

Interaktive Übersicht über Produkte und Konzepte rund um SAP S/4HANA für SAP-Berater, die sich vor einer Einführung orientieren.

## Inhalte

**Baustein**:
Ein Produkt, eine Capability oder ein Konzept, das auf der Landkarte als eigenes Element erscheint (z. B. SAP Cloud ALM, Clean Core).
_Avoid_: Produkt (zu eng), Lösung, Kachel, Chip

**Steckbrief**:
Die Beschreibung genau eines Bausteins mit allen Feldern, Quellen und Belegstatus.
_Avoid_: Datensatz, Eintrag, Karte

**Portfolio**:
Ein Baustein, der mehrere Einzelprodukte bündelt (z. B. SAP Signavio); seine Einzelprodukte verweisen über `parent` auf ihn.
_Avoid_: Dach, Suite (außer im Produktnamen)

**Einzelprodukt**:
Ein Baustein, der Teil eines Portfolios ist.
_Avoid_: Kind, Unterprodukt

**Bereich**:
Die fachliche Heimat eines Bausteins; jeder Baustein hat genau einen Bereich (Feld `layer`).
_Avoid_: Layer, Zone, Schicht, Kategorie

**Bereichsgruppe**:
Ein Kasten der Landkarte, der einen oder mehrere Bereiche zusammenfasst (z. B. SAP BTP mit Plattform, Business AI, Integration und Daten); ändert die Heimat keines Bausteins.
_Avoid_: Zone, Spalte, Band

**Mehrfachzuordnung**:
Die zusätzliche Anzeige eines Bausteins in einem weiteren Bereich, ohne dass sich seine Heimat ändert.
_Avoid_: ALSO, Zweitbereich

**Branche**:
Die Industrie, für die ein Baustein gebaut ist (z. B. Utilities); ein Merkmal des Bausteins, kein Bereich.
_Avoid_: Industrie, Branchenbereich

**Verwandter Baustein**:
Ein Baustein, der mit einem anderen fachlich zusammenhängt; die Beziehung gilt in beide Richtungen.
_Avoid_: Abhängigkeit, Link

## Lebenszyklus und Belege

**Status**:
Die Lebenszyklus-Einordnung eines Bausteins (aktiv, neu, umbenannt, läuft aus, abgekündigt).
_Avoid_: Zustand, Phase

**Wartungsende**:
Ein Datum, an dem eine Wartungs- oder Supportstufe für einen Baustein endet (Mainstream, Extended, Nutzungsrecht).
_Avoid_: EOL, Supportende, Auslaufdatum

**Belegstatus**:
Wie weit ein Steckbrief durch geprüfte Quellen gedeckt ist (belegt, teilweise belegt, unbelegt).
_Avoid_: Verifizierung, Qualität

**Kundenlandschaft**:
Die Menge der Bausteine, die ein Berater für einen Kunden auf der Seite markiert, egal ob im Einsatz oder geplant.
_Avoid_: Scope, Bebauungsplan, Mein Projekt

**Auswirkungsanalyse**:
Die regelbasierte Bewertung einer Kundenlandschaft: welche Wartungsenden, Statuswechsel und Nachfolger auf den Kunden zukommen.
_Avoid_: Bewertung, Impact-Analyse

**Recherche-Stand**:
Das Datum, zu dem die Inhalte der Steckbriefe zuletzt gegen Quellen geprüft wurden.
_Avoid_: Version, Release

**Roadmap-Eintrag**:
Eine von SAP angekündigte, geplante Neuerung zu einem Baustein, mit dem Quartal, in dem sie kommen soll.
_Avoid_: Roadmap-Item, Plan, Feature

**Release Note**:
Eine von SAP veröffentlichte Neuerung in einem bereits ausgelieferten Release eines Bausteins (What's New).
_Avoid_: Change Note, SAP-Hinweis, Änderung

**Abo**:
Die Bausteine, zu deren Änderungen ein Konto benachrichtigt wird.
_Avoid_: Thema, Interesse, Watchlist

**Mitteilung**:
Der Hinweis an ein Konto, dass sich an einem abonnierten Baustein etwas geändert hat; erscheint in der Sammelmail und unter „Mitteilungen“ auf der Seite.
_Avoid_: Notification, Message, Update

**Prüflauf**:
Der wöchentliche Durchgang, der SAP-Quellen auf neue oder geänderte Roadmap-Einträge und Release Notes prüft und daraus Änderungsvorschläge für Steckbriefe macht.
_Avoid_: Crawl, Scan, Sync, Abzug

## Einführung

**Einführung steuern**:
Methodik und Werkzeuge, mit denen das S/4HANA-Einführungsprojekt selbst geplant und gesteuert wird (SAP Activate, Projekte in Cloud ALM).
_Avoid_: Projektmanagement (für diesen Sinn), PM

**Projektmanagement (Fachfunktion)**:
Die betriebswirtschaftliche Funktion in S/4HANA, mit der ein Unternehmen seine eigenen Projekte abwickelt (PS, EPPM, CPM).
_Avoid_: Projektsteuerung, Einführungsprojekt

**Activate-Phase**:
Eine der sechs Phasen von SAP Activate (Discover, Prepare, Explore, Realize, Deploy, Run).
_Avoid_: Projektphase, Stage

**Testperspektive**:
Die zuschaltbare Sicht, die je Steckbrief zeigt, was der Baustein für Test und Qualitätssicherung bedeutet.
_Avoid_: Testmodus, Testansicht

## Oberfläche

**Ansicht**:
Eine der Hauptdarstellungen der Seite (Landkarte, Schichtenmodell, Integrationswege, Toolchain, Clean Core, Zeitleiste).
_Avoid_: Tab, Seite, View

**Landkarte**:
Die Ansicht, die alle Bausteine nach Bereich gruppiert zeigt.
_Avoid_: Map, Übersicht

**Auswahl**:
Der eine Baustein, dessen Steckbrief gerade offen ist; seine verwandten Bausteine werden hervorgehoben.
_Avoid_: Fokus, Selektion
