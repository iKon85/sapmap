# Prototyp: Wavestone-Look auf shadcn

Wegwerf-Prototyp zu [Trägt der Wavestone-Look auf shadcn? Landkarte, Steckbrief und Schichtenmodell nachbauen](https://github.com/iKon85/sapmap/issues/31). Kein Produktivcode, wird nicht nach `main` übernommen.

## Starten

```bash
pnpm install
pnpm dev
```

Danach http://localhost:3031 öffnen. Kein Login, keine Datenbank. Die Daten kommen direkt aus `data/steckbriefe.json` im Repo.

## Varianten

Die schwarze Leiste am unteren Rand schaltet um; die Pfeiltasten blättern durch die Layouts. Alles steht in der URL und lässt sich verlinken:

| Parameter | Werte | Bedeutung |
|---|---|---|
| `layout` | `a` (Standard), `b`, `c` | A fünf Spalten · B Security als Zeile unter der Mitte · C Clean Core als Band über Kern und BTP |
| `farben` | `tonstufen` (Standard), `infografik`, `ruhig` | Wie die Bereiche farblich unterschieden werden |
| `steckbrief` | `overlay` (Standard), `spalte` | Steckbrief überlagert die Karte oder steht als feste Spalte daneben |
| `kante` | `oben` (Standard), `ohne` | Bereichsfarbe als farbige Oberkante am Kasten oder nur über Überschrift und Flächenton |
| `b` | ID eines Bausteins | geöffneter Steckbrief |

Gewählt am 19.11.2026: `?layout=c&farben=infografik`, Steckbrief überlagert, mit Oberkante.

Seiten: `/` Landkarte, `/schichtenmodell` Schichtenmodell. Die übrigen Ansichten sind bewusst nur als ausgegraute Reiter vorhanden.

## Schrift

Aptos darf nicht ins öffentliche Repo. Die Seite nimmt ein installiertes Aptos, sonst Dateien aus `public/fonts-local/` (nicht eingecheckt), sonst Archivo und IBM Plex. Die Screenshots in `screenshots/` sind mit Aptos entstanden.

## Stand der Technik

TanStack Start, React 19, TypeScript strict, Tailwind v4, shadcn auf radix-ui mit Preset `b3QxdAzBg`. Landkarte und Schichtenmodell sind eigene Komponenten aus HTML-Kästen mit CSS Grid und Container Queries, ohne Diagramm-Bibliothek.
