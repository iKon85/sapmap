# Product

<!-- impeccable:product-schema 1 -->

Alle Angaben aus dem Auftrag der Hauptsession und den Repo-Dokumenten abgeleitet (Subagent ohne Rückfragekanal); nicht mit Niko bestätigt.

## Platform

web

## Stack

Statisches HTML/CSS/JS ohne Build und ohne Netz-Abhängigkeiten (Vorgabe des Auftrags für diesen Prototyp).

## Users

SAP-Berater aller Rollen (Architektur, Integration, Test, Basis, Projektleitung), die sich vor oder in einer S/4HANA-Einführung orientieren: Was gibt es, wie heißt es heute, wie hängt es zusammen, was läuft aus. Nutzung am Laptop im Büro oder im Workshop, oft per geteiltem Link aus Teams; gelegentlich am Telefon unterwegs.

## Product Purpose

Interaktive Übersicht über 154 SAP-Bausteine rund um S/4HANA. Jeder Baustein hat einen Steckbrief mit Was/Wie/S4-Bezug/Wann/Lizenz, Status, Daten und Quellen. Erfolg: in Sekunden den richtigen Baustein finden, seinen Steckbrief lesen, verwandte Bausteine anspringen und den Link teilen.

## Positioning

Eine kuratierte, deutschsprachige, quellenbelegte Landkarte mit offenem Belegstatus pro Steckbrief, statt Marketingseiten des Herstellers.

## Capabilities and Constraints

- Bereiche (`layer`), Portfolios mit Einzelprodukten (`parent`), Status, Belegstatus, Testperspektive (Feld `test`, nur auf Schalter).
- Ansichten: Landkarte, Schichtenmodell, Integrationswege, Toolchain, Zeitleiste.
- Zustand teilbar per URL; Zurück/Vor funktioniert.
- Vokabular nach `GLOSSARY.md` (Baustein, Steckbrief, Bereich, Portfolio, Belegstatus, Recherche-Stand).

## Brand Commitments

Wavestone-CI: Weiß/Schwarz, Markenviolett #451DC7, Akzent #04F06A und #CAFEE0 (je max. ca. 5 % Fläche, nie hell auf grün), tiefes Violett #250F6B, Ampelfarben #FFCA4A/#FF2A49 nur für Status. Schrift Aptos (lokaler Stack). Deutsch mit echten Umlauten.

## Evidence on Hand

`data/steckbriefe.json` (154 Steckbriefe). Kein Recherche-Datum in den Daten; Stand laut Projekt: Oktober 2026.

## Product Principles

- Ehrlich über Belege: Unsicheres sichtbar kennzeichnen.
- Ein Link zeigt genau das, was der Absender sah.
- Für alle Rollen schreiben; Testsicht ist zuschaltbar.

## Accessibility & Inclusion

WCAG 2.1 AA, Schrift mindestens 12 px, Status nie nur über Farbe.
