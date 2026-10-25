# Recherche: Trägt TanStack Start im Prerender-Modus unsere Anforderungen? (Stand 25.10.2026)

Beantwortet Issue #7. Prüft die Empfehlung aus `docs/bestandsaufnahme.md`, Abschnitt 4. Quellen sind mit **[P]** (primär: offizielle Doku, Quellcode, GitHub-Issues/-Advisories des Projekts, npm-Registry) oder **[S]** (sekundär) markiert. **[Beweis]** heißt: selbst gebaut und beobachtet, siehe Abschnitt „Beweis-Build“.

## Takeaway

- **Empfehlung: ja, Start im Prerender-Modus.** Alle verlangten Punkte ließen sich im Beweis-Build mit der heutigen Version belegen: 154 Baustein-Seiten per `crawlLinks`, Zod-4-Search-Params, nginx:alpine ohne Node, Hash-Weiterleitung.
- **Reife:** Start ist seit dem 13.10.2026 offiziell 1.0 (stable). Gebaut wurde mit `@tanstack/react-start` 1.169.4, `@tanstack/react-router` 1.170.46, Vite 8.3.5, Zod 4.6.7.
- **Wichtigste Fallstricke:** (1) Hydration-Fehler, wenn eine vorgerenderte Seite von Search-Params abhängt. (2) Keine 404-Seite aus der Prerender-Pipeline. (3) Der Crawler folgt Links mit Query und Fragment. (4) Offene Prerender-Bugs, Build-Ausstieg bei Fehlern nicht überall belegt. (5) Lieferkettenangriff und XSS-Lücke im Jahr 2026: Versionen pinnen.
- **Gegenprobe:** Vite + Router allein liefert genau eine `index.html`. Vorrendern müsste man selbst bauen.

---

## 1. Version und Stabilität

| Befund | Beleg |
|---|---|
| „TanStack Start 1.0 is finally stable.“ Das Team verpflichtet sich auf die APIs; der RC-Vorbehalt entfällt. Der Beitrag erwähnt Prerendering nicht (er behandelt SSR, Streaming, Client-Rendering, selektives SSR, RSC). Autor Tanner Linsley, 13.10.2026. | [P] https://tanstack.com/blog/tanstack-start-1-0 (abgerufen 25.10.2026) |
| npm `latest`: `@tanstack/react-start` 1.169.4 (geändert 22.10.2026), `@tanstack/react-router` 1.170.46, `vite` 8.3.5, `zod` 4.6.7. Peer-Dependency von react-start: `vite >=8.0.0`. | [P] `npm view` am 25.10.2026 |
| Release-Takt: Releases der Start-Pakete am 22.10.2026 (u. a. `start-static-server-functions@1.167.44`, `start-server-core@1.169.45`). Keine Release-Notiz erwähnt Prerender/SSG. | [P] https://github.com/TanStack/router/releases (via API, 25.10.2026) |
| Sicherheitslage 2026: GHSA-qx66-fv34-fjm8, reflektiertes XSS in Server-Function-Antworten (kritisch, 30.09.2026; behoben ab `react-start` 1.168.60 / `start-server-core` 1.169.39). GHSA-g7cv-rxg3-hmpx, Schadcode in 42 `@tanstack/*`-Paketen (11.05.2026; betroffene Einzelversionen wurden ersetzt). | [P] https://github.com/TanStack/router/security/advisories (via API, 25.10.2026) |

Bewertung: stabil deklariert, aber sehr hoher Release-Takt (Patch-Versionen fast täglich) und zwei schwere Sicherheitsmeldungen im laufenden Jahr. Die XSS-Lücke betrifft Server-Functions, die wir nicht nutzen. Der Lieferkettenfall betrifft jede Variante mit `@tanstack/*`, auch Vite + Router.

## 2. Statisches Vorrendern: Konfiguration und Verhalten

Quelle für alles in diesem Abschnitt, sofern nicht anders genannt: [P] https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering (abgerufen 25.10.2026, ohne Datumsangabe auf der Seite).

- Aktivierung: `tanstackStart({ prerender: { enabled: true, crawlLinks: true } })` in `vite.config.ts`. Der Doku-Beispielwert für `enabled` ist `false`, es muss also eingeschaltet werden.
- Weitere Optionen: `autoSubfolderIndex` (Default `true`, schreibt `/seite/index.html`; `false` schreibt `/seite.html`), `autoStaticPathsDiscovery`, `concurrency`, `filter`, `retryCount`, `retryDelay`, `maxRedirects`, `failOnError` (Default `true`), `onSuccess`, außerdem `pages: [{ path, prerender: { enabled, outputPath } }]`.
- **Dynamische Routen:** Routen mit Pfad-Parametern (`/baustein/$id`) werden **nicht** automatisch gefunden. Sie werden vorgerendert, wenn eine bereits vorgerenderte Seite darauf verlinkt und `crawlLinks` an ist. Alternativ lassen sie sich einzeln in `pages` listen. Layout-Routen (`_…`) und Routen ohne Komponente (API) fehlen.
- **Ausgabeordner:** Die Prerender-Doku nennt keinen Standardordner. Die Hosting-Doku nennt `dist/client` als Client-Ausgabe (Netlify-Beispiel `publish = "dist/client"`): [P] https://tanstack.com/start/latest/docs/framework/react/guide/hosting. [Beweis] bestätigt `dist/client`; zusätzlich entsteht `dist/server` (nicht auszuliefern).
- **Quellcode des Crawlers** [P] (`node_modules/@tanstack/start-plugin-core/dist/esm/prerender.js`, Version 1.171.55, im Beweis-Build gelesen): Links werden per Regex aus dem gerenderten HTML gezogen (`href` mit `/` oder `./` am Anfang). Jede Antwort mit Status ≠ 2xx wirft einen Fehler (`Failed to fetch <pfad>`). Ausgabedatei: bei `autoSubfolderIndex` `<pfad>/index.html`.

## 3. Die 154 Seiten `/baustein/$id`

**Ergebnis [Beweis]:** Die echte `data/steckbriefe.json` (154 Einträge) wurde mit Zod geparst. Die Startseite verlinkt jeden Baustein per `<Link to="/baustein/$id">`. Der Build erzeugte 157 Seiten: `/`, `/schichten`, die 404-Seite und `dist/client/baustein/<id>/index.html` für alle 154 IDs. Die IDs mit Bindestrich (`s4-cloud-erp`, `calm-test-api`) machten keine Probleme. Der Build dauerte rund 3 Sekunden.

- Pro Seite eigene `<title>`- und `og:*`-Tags aus dem Loader (`head: ({ loaderData }) => …`). Beispiel `/baustein/pipo`: Titel „SAP Process Integration / Process Orchestration 7.5“ und passendes `og:description` im statischen HTML. Das erfüllt den Linkvorschau-Wunsch (N2).
- **Defekte interne Links brechen den Build** [Beweis]: Ein Link auf `/baustein/gibts-nicht` (Loader wirft `notFound()`, also 404) ließ den Build mit Exit-Code 1 abbrechen. Das ist eine brauchbare Prüfung gegen tote Links.
- Variante „explizite Liste“ statt `crawlLinks`: über `pages` möglich; die Liste müsste aus der JSON erzeugt werden. Nicht gebaut, weil `crawlLinks` genügt. Eine Liste hätte den Vorteil, dass Bausteine ohne Link von einer Seite trotzdem entstehen.

## 4. Typisierte Search-Params und Hydration

**Zod-Version.** Zod 4.6.7 ist `latest`. Für Zod 4 braucht es keinen Adapter: Das Schema geht direkt an `validateSearch`; für Standardwerte `.default()` bzw. `.catch()`. Nur für Zod 3 wird `@tanstack/zod-adapter` mit `fallback(…)` gebraucht. [P] https://tanstack.com/router/latest/docs/how-to/validate-search-params und https://tanstack.com/router/latest/docs/guide/search-params (beide abgerufen 25.10.2026). `validateSearch` wirft bei Fehlern in den `errorComponent` der Route (`routerCode: VALIDATE_SEARCH`); `.catch()` verhindert das. Mit `.default()` wird der Input-Typ von `search` verpflichtend, sodass `<Link to="/">` ohne `search` nicht mehr typt. Der Adapter-Weg (`fallback` + `.default`) macht ihn optional.

**Beobachtung [Beweis]:**

1. Die vorgerenderte `index.html` kennt keine Query-Parameter. Der Prerender holt `/` ohne `?sel=…`.
2. Wird die Seite mit `/?sel=pipo&test=1` geladen, liest der Browser nach dem Laden die Werte korrekt aus (`sel=pipo test=1`), die Typen stimmen (`z.coerce.number().int().min(0).max(1).catch(0)`).
3. Ungültige Werte (`?test=abc`) werden durch `.catch(0)` abgefangen. **Nebenwirkung:** der Router schreibt die URL dabei auf `/?test=0` um. Wer das nicht will, braucht `stripSearchParams` (Doku: https://tanstack.com/router/latest/docs/guide/search-params).
4. **Hydration-Fehler.** Hing der gerenderte Text direkt von den Search-Params ab, meldete der Browser bei `/?sel=pipo&test=1` den React-Fehler **#418** (Hydration-Mismatch: HTML sagte `test=0`, Client rechnete `test=1`). Ohne Query kein Fehler. **Lösung [Beweis]:** den von Search-Params abhängigen Teil in `<ClientOnly fallback={…}>` (aus `@tanstack/react-router`) kapseln. Danach keine Konsolenmeldung, und der Zustand erscheint nach dem Hydrieren korrekt.

Folgerung für unser Projekt: Alles, was von `?sel=` oder `?test=` abhängt (Auswahl, Testperspektive), erscheint erst nach dem Hydrieren. Der vorgerenderte Inhalt zeigt den Grundzustand. Das passt zur Linkvorschau (kein Query nötig), kostet aber einen sichtbaren Zustandswechsel beim Öffnen eines geteilten Links.

## 5. Hash-Weiterleitung (`#schichten`, `#pipo`)

Der Hash erreicht nie den Server; das gilt für nginx und für den Prerender gleichermaßen. Die Weiterleitung kann deshalb nur clientseitig laufen. [Beweis]: ein `useEffect` in der Wurzelroute liest `location.hash` und ruft `router.navigate({ to: '/baustein/$id', params: { id }, hash: '', replace: true })`. `http://localhost:8099/#pipo` landete auf `/baustein/pipo`. Fallstrick: Das Ziel erscheint erst nach dem Hydrieren; zunächst sieht man kurz die Startseite. `beforeLoad` in der Wurzelroute wäre die Alternative, läuft aber beim Prerender ohne Hash und wurde nicht getestet. Der Text zu Hash-Scroll in der Router-Doku (`/guide/hash-scroll-restoration`) war unter dieser URL nicht abrufbar (404): nicht gefunden.

## 6. nginx:alpine, Unterordner-`index.html`, 404

**Getestet [Beweis]** mit `nginx:alpine` in Docker, `dist/client` als Wurzel, Konfiguration:

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;
  absolute_redirect off;
  error_page 404 /404.html;
  location / { try_files $uri $uri/ =404; }
  location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; try_files $uri =404; }
}
```

| Anfrage | Ergebnis |
|---|---|
| `/` und `/?sel=pipo&test=1` | 200 |
| `/baustein/pipo/` | 200 |
| `/baustein/pipo` und `/schichten` | 301 auf die Variante mit Slash (nginx-Standard für Verzeichnisse) |
| `/baustein/gibtsnicht`, `/foo` | 404 mit Inhalt von `404.html` |

- **404-Seite:** Die Prerender-Pipeline kann **keine** 404-Seite erzeugen, weil sie jede Nicht-2xx-Antwort als Fehler wirft (Quellcode, siehe Abschnitt 2; [Beweis]: `pages: [{ path: '/gibts-nicht', … outputPath: '/404.html' }]` ließ den Build mit „Failed to fetch … Not Found“ abbrechen). **Workaround [Beweis]:** eine echte Route `/nicht-gefunden` (Status 200) anlegen und per `pages: [{ path: '/nicht-gefunden', prerender: { enabled: true, outputPath: '/404.html' } }]` nach `404.html` schreiben. Der Nebeneffekt: Es entsteht `404.html` im Wurzelordner. Es gibt dabei kein `dist/client/nicht-gefunden/`. `defaultNotFoundComponent` im Router greift nur clientseitig (nach Hydrieren, z. B. bei Navigation).
- Redirect mit Slash: Unter Coolify/Traefik sollte `absolute_redirect off` gesetzt bleiben, sonst steht der interne Host/Port im `Location`-Header. Das hängt von der Proxy-Kette ab und wurde nicht mit Coolify getestet.
- Hashed Assets unter `/assets/` lassen sich dauerhaft cachen; die HTML-Dateien nicht.
- Seitengröße [Beweis]: `dist/client` 2,8 MB; ein JS-Bundle von 938 KB (nicht gzipped) für alles, weil React, Router und die komplette JSON im Client stecken.

## 7. Bekannte Fallstricke (offene Issues)

Alle [P] aus https://github.com/TanStack/router/issues (abgerufen 25.10.2026 über die GitHub-API). Beim Prerender-Suchbegriff gab es 9 offene Issues.

| Issue | Inhalt | Für uns relevant? |
|---|---|---|
| #8516 (27.09.2026, offen) | Fragment-Links (`/#abschnitt`) werden als eigene Seiten gecrawlt; erscheinen als Duplikate in `sitemap.xml`. | Nur bei Fragment-Links auf der Seite und Sitemap-Erzeugung. Mit `filter` (Pfad mit `#` ablehnen) vermeidbar. |
| #7837 (16.07.2026, offen, „information needed“) | Query-Strings im Crawler werden verfälscht, Endlosschleife bei Links mit Search-Params. | [Beweis]: **nicht reproduziert** mit `start-plugin-core` 1.171.55. Ein `<Link search={{ sel: 'pipo', test: 1 }}>` führte zu einem zusätzlichen Crawl `/?sel=pipo&amp;test=1` (`&amp;` bleibt undekodiert), der in dieselbe `index.html` schreibt. Der Build lief durch. Heißt: Wer viele Links mit Query rendert, rendert die Startseite mehrfach, und die zuletzt fertige Variante gewinnt. Search-abhängiger Inhalt gehört deshalb in `ClientOnly` (Abschnitt 4). |
| #8120 (19.08.2026, offen) | `retryCount` wiederholt nie, und ein fehlgeschlagener Crawl lasse den Build mit Exit-Code 0 enden (Version 1.168.46). | [Beweis]: bei einem toten Link brach der Build mit Exit-Code 1 ab (Version 1.171.55). Der Fehler ist für diesen Fall nicht reproduziert. Trotzdem in der CI die Seitenzahl (154 Bausteine) prüfen, nicht nur den Exit-Code. |
| #8483 (23.09.2026, offen) | `concurrency` wirkt nicht bei CPU-lastigen Seiten; Seiten rendern nacheinander. | Bei 154 kleinen Seiten irrelevant (3 s). |
| #6602 (06.02.2026, „information needed“) | Build hängt nach dem Prerender, SSR-Timeouts werden nicht aufgeräumt. | Nicht aufgetreten. |
| #8118, #7516, #6330, #6562 | Probleme mit Server-Dateinamen, Vite-Alias-Plugins, Cloudflare- und Vercel/Nitro-Presets. | Betreffen Plugins/Presets, die wir nicht nutzen. |

Weitere Hinweise:

- Das Start-Plugin braucht **Vite ≥ 8** (Peer-Dependency). Vite 8 ist `latest`.
- `resolve.tsconfigPaths: true` steht in der aktuellen Build-from-scratch-Anleitung (https://tanstack.com/start/latest/docs/framework/react/build-from-scratch, [P], über Context7 abgerufen).
- Der Router verlangt eine `getRouter()`-Funktion in `src/router.tsx` und die generierte `routeTree.gen.ts` (https://tanstack.com/start/latest/docs/framework/react/guide/routing, [P]).
- Kein Server-Code im Betrieb: `dist/server` und `server.js` sind nur Build-Zwischenstand.

## 8. Gegenprobe: Vite + TanStack Router allein

- Router allein ist eine Single-Page-App: `vite build` erzeugt eine `index.html` für alle URLs. [S, eigener Schluss aus der Router-Architektur; nicht im Beweis-Build ausprobiert.]
- Die Router-SSR-Anleitung beschreibt nur Server-Rendering (Streaming und nicht streamend), keine statische Erzeugung, und warnt: „these can be subject to change and should be regarded as experimental until Start reaches stable status.“ [P] https://tanstack.com/router/latest/docs/guide/ssr (abgerufen 25.10.2026; ohne Datumsangabe). Start ist inzwischen stabil; ob der Hinweis auf der Seite noch gilt, ist offen.
- Start hat einen SPA-Modus (`spa: { enabled: true }`): rendert nur die Wurzelroute in `_shell.html`, Rest clientseitig. Der Host muss dann alle 404 auf `_shell.html` umleiten. Doku: „Time to full content is longer“ und „less SEO-friendly“ (Linkvorschauen). [P] https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode (abgerufen 25.10.2026). Das wäre der Fall „Router allein“ mit etwas mehr Komfort.
- Fehlt bei Router allein also: Linkvorschau je Baustein, Inhalt ohne JavaScript, nginx-Regel `try_files … /index.html`. Eine Fremdlösung zum Vorrendern (nicht untersucht, nicht bewertet) müsste man ergänzen.

## 9. Beweis-Build

Lauf: ja. Ort: `/tmp/start-proof` (nicht im Repo). Inhalt: Start 1.169.4, Router 1.170.46, Vite 8.3.5, Zod 4.6.7, TypeScript 7.0.2 (`strict: true`, `tsc --noEmit` ohne Fehler), die echte `steckbriefe.json`. Routen: `/`, `/schichten`, `/baustein/$id`, `/nicht-gefunden`. Geprüft:

| Prüfung | Ergebnis |
|---|---|
| Build, `prerender` + `crawlLinks` | 157 Seiten, ca. 3 s; 154 × `baustein/<id>/index.html` |
| Titel/OG im statischen HTML | ja (`/baustein/pipo`) |
| `nginx:alpine`, Unterordner-Auslieferung | 200 mit Slash, 301 ohne; 404 liefert `404.html` |
| Search-Params nach Hydration, Zod-4 direkt | ja; `.catch(0)` schreibt `?test=0` in die URL |
| Hydration-Mismatch bei Search-abhängigem Text | React #418; behoben durch `ClientOnly` |
| Hash `#pipo` → `/baustein/pipo` | ja, clientseitig, kurzer Zwischenzustand |
| Toter interner Link | Build bricht mit Exit-Code 1 ab |
| 404 aus der Pipeline | geht nicht; Workaround über eine 200-Route + `outputPath` |

Nicht geprüft: Verhalten hinter Coolify/Traefik, Playwright-Vergleich, die Optik, mobiles Laden, Lighthouse, ein Vergleichsbau mit reinem Vite + Router, `beforeLoad`-Variante der Hash-Weiterleitung.

## Offen / nicht gefunden

- Datum/„Last updated“ der Doku-Seiten: auf den Seiten nicht angegeben.
- Eine offizielle Aussage, dass `crawlLinks` für dynamische Routen die empfohlene Methode sei, fehlt; die Doku nennt es nur als Möglichkeit.
- Offizielle Anleitung für nginx und statische 404-Seiten bei Start: nicht gefunden.
- Ob die Fixes für #8120 und #7837 in 1.171.55 gelandet sind oder ob die Probleme nur in anderen Konstellationen auftreten: nicht geklärt.
