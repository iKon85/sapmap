# Recherche: Suche und MCP-Zugang – was übernehmen wir aus Activate? (Stand 19.11.2026)

Beantwortet Issue #17. Gesetzt waren schon: TanStack Start im Server-Modus (#8), die ganze Seite hinter einer Clerk-Anmeldung auf `sapmap.iverra.de` (#13), Postgres und Node laufen ohnehin. Quellen sind mit **[P]** (primär: Herstellerdoku, npm-Registry, Quelltext, eigene Issues und eigener Code) oder **[S]** (sekundär) markiert. Alle Webseiten und Registry-Abfragen stammen vom **19.11.2026**. Die Messung lief am selben Tag lokal. Skript, Anfragen und Rohergebnisse liegen in `prototypes/suche-messung/`.

## Kurzfassung

**Empfehlung je Frage** (entscheiden muss Niko):

1. **Was aus Activate übernehmen?** Übernehmen: den Grundsatz („Server liefert Bausteine, der Agent sucht“), kompakte Antworten mit Zählern und Stand, Clerk-OAuth mit CIMD und Invite-only, `/mcp` als Server-Route. **Nicht** übernehmen: BM25 per `pg_textsearch`, pgvector und BGE-M3. Die gab es in Activate wegen 62.324 englischer Abschnitte. Hier sind es 154 deutsche Steckbriefe.
2. **Reicht Volltext?** Ja. Gemessen mit 50 Anfragen: MiniSearch im Browser findet den erwarteten Baustein bei **46 von 50** in den Top 5 (39 auf Platz 1). Hybrid aus BM25 und BGE-M3 schafft **48 von 50** (41 auf Platz 1). Der Unterschied ist nicht gesichert (7 besser, 5 schlechter, 38 gleich, p ≈ 0,77). Embeddings kosten dagegen ein Modell mit 2,4 GB RAM im Stack. Die heutige Seite findet nur **27 von 50**; Befund W5 ist damit belegt.
3. **Eine Suche oder zwei?** **Eine Suchfunktion, zwei Orte:** dasselbe TypeScript-Modul (MiniSearch über die Steckbriefe) läuft im Browser für die Seite und im Server für `/mcp`. Es gibt keinen Suchindex in Postgres und kein eigenes Postgres-Image.
4. **MCP-Form?** **`/mcp` als Server-Route in der sapmap-App.** Der KI-Kompass betreibt genau diesen Weg bereits (TanStack Start, `@modelcontextprotocol/server` 2.4.0, Clerk-OAuth mit CIMD; eigener Code, läuft mit claude.ai, Desktop und Claude Code). Damit ist der „ungeklärte MCP-Weg“ aus #20 erledigt. Zu ergänzen sind zwei Dinge: `/mcp` und `/.well-known/…` müssen an der Anmeldewand der Seite vorbei, und der Server muss die Audience des Tokens prüfen. Der KI-Kompass prüft sie nicht. Als Inhaltsquelle im Activate-Server geht es nicht, denn diesen Server gibt es noch nicht. Ein Datenpaket hinter der Anmeldung kann ein Agent nicht selbst abrufen.
5. **Tool-Schnitt?** Vier statt fünf Tools: `suchen`, `auflisten`, `steckbrief` (also `get`, liefert gleich den ganzen Text und macht `read` überflüssig) und `stand`. `steckbrief` liefert Rückverweise, Portfolio und Einzelprodukte mit, Nachfolger erst, wenn das Schema v2 das Feld `nachfolger` hat. Filter: Bereich (mit Mehrfachzuordnung), Status, Belegstatus, Wartungsende bis Jahr, Portfolio.

**Entscheidungen, die bei Niko bleiben**

- (a) **MCP ja oder nein?** Wenn ja: als `/mcp` in der sapmap-App (empfohlen) oder vorerst gar nicht. Ein Aufschub kostet nichts, denn die Suche auf der Seite hängt nicht daran.
- (b) **Welche Suche?** MiniSearch als gemeinsames Modul (empfohlen) oder hybrid mit BGE-M3 für etwa 2 Treffer mehr in den Top 5 bei 50 Anfragen.
- Gleiche oder eigene Clerk-Anwendung wie Activate/KI-Kompass. Davon hängt ab, wer sich am MCP anmelden darf (offen aus #20).
- Tool-Namen deutsch (wie im KI-Kompass) oder englisch (wie in Activate).
- Auslöser für einen Nachtest mit Embeddings: zum Beispiel Fehlsuchen im Aufrufprotokoll.

---

## 1. Was Activate entschieden hat und ob es hier passt

Gelesen: Activate-Issues #3, #8, #9, #29 und #31 (alle geschlossen) [P, eigene Issues], die Checkouts `activate` (main), `activate-retrieval`, `activate-postgres-suche` und `activate-hybride`. **Activate hat noch keinen Server-Code.** Auf `main` liegen weder `src/` noch `package.json` (geprüft per `git ls-tree origin/main`), und offen sind nur Karten und Grilling-Tickets. Ein lauffähiges Vorbild ist der **KI-Kompass** (`/home/niko/projects/ki-kompass`, Commit `2dd0179`), auf den Activate #9 selbst verweist. Ihn habe ich nur gelesen.

| Entscheidung in Activate | Quelle | Passt hier 1:1? | Abweichung und Grund |
|---|---|---|---|
| **Grundsatz:** Der Server liefert Bausteine, der Agent sucht. Keine fragespezifischen Tools, keine KI auf dem Server. | #8 (24.10.2026) | **ja** | – |
| **Fünf Tools:** `search`, `list` mit Gesamtzahl, `get(id, tiefe)`, `read(id)`, `status(seit?)` | #8 | **teilweise** | `read` entfällt. Ein Steckbrief ist kurz (Median 338, höchstens 718 Tokens im BGE-M3-Tokenizer), `get` liefert ihn ganz. `tiefe` entfällt auch: Der Graph hat nur `verwandt` (2–5 IDs) und `parent`, eine Stufe reicht (Abschnitt 5). |
| **Rückgaben:** eine Zeile je Treffer, höchstens etwa 8.000 Tokens, Zähler je Facette, Stand in jeder Antwort, Fortsetzungsmarke | #8 | **ja** | Gemessen: Die Liste aller 154 Bausteine mit ID, Name, Bereich und Status hat **6.689 Tokens** und passt in eine Antwort. Mit aka und `kurz` sind es **18.049 Tokens**, das passt nicht (Abschnitt 5). |
| **Tool-Namen und Beschreibungen englisch**, der Agent übersetzt deutsche Suchbegriffe | #8 | **nein** | Der Inhalt ist deutsch. Die Beschreibungen sollten verlangen, dass der Agent deutsch sucht oder deutsche Synonyme nachschiebt. Englische Anfragen sind in der Messung der schwächste Typ der Volltextvarianten (Abschnitt 2). Der KI-Kompass nutzt deutsche Namen (`faelle_auflisten`, `paket_holen`). |
| **Suche:** BM25 per `pg_textsearch` + pgvector mit BGE-M3, RRF (Variante j, P@10 0,81); `ts_rank_cd` allein fällt ab | #29, #31 | **nein** | Den Gewinn der Embeddings erklärt Activate selbst mit der Sprachlücke DE→EN auf 62.324 Abschnitten (#29: Volltext ohne Übersetzung P@10 0,07). Hier gibt es diese Lücke nicht, und bei 154 Dokumenten ist ein Index im Browser trivial. Gemessen: Abschnitt 2. |
| **Gefiltert wird über eine gespeicherte `tsvector`-Spalte mit GIN-Index** (sonst etwa 10 s pro Anfrage) | #31 | entfällt | Bei 154 Zeilen dauert BM25 in Postgres im Mittel 4 ms, MiniSearch 0,5 ms (Abschnitt 2). |
| **Eigenes Postgres-Image** mit `pg_textsearch` in einer Registry (GHCR), Rückfall `ts_rank_cd` | #31 | **nein** | Wird bei einer Suche ohne Postgres nicht gebraucht. Postgres bleibt für Konten, Abos und Mitteilungen im Standard-Image. |
| **Stack:** TanStack Start mit `/mcp` und `/.well-known/…` als Server-Routen, `@modelcontextprotocol/server` v2 als OAuth-Resource-Server, Postgres + Drizzle | #9 (25.10.2026) | **ja** | Ist in sapmap durch #8 und #13 schon gesetzt. |
| **BGE-M3 als ONNX in Node**, Paritätstest, Python-Dienst als Rückfall | #9 | **nein** | Folgt aus der Messung. |
| **Zugang:** Clerk-OAuth mit CIMD, eigene Clerk-Anwendung, Invite-only, ein Weg für claude.ai, Desktop und Claude Code, kein statischer Token; wer darf, prüft eine einzige Stelle im Code | #3, #9 | **ja** | Hier kommt etwas dazu: Die ganze Seite liegt hinter der Anmeldung (#13). `/mcp` meldet sich aber per Bearer-Token an, nicht per Sitzung. Die Anmeldewand der Seite darf `/mcp` und `/.well-known/…` deshalb nicht auf die Anmeldeseite umleiten (Abschnitt 4). |
| **Jeder MCP-Aufruf wird protokolliert** (Zeit, Tool, Parameter) | #8 | **ja** | Das Protokoll ist hier zugleich der Auslöser für einen Nachtest mit Embeddings (Abschnitt 2). |
| **Server zustandslos** | #8 | **ja** | `createMcpHandler` baut je Anfrage einen frischen Server [P] https://ts.sdk.modelcontextprotocol.io/v2/serving/http |

## 2. Messung: reicht Volltext?

### Aufbau

- **Bestand:** die 154 Steckbriefe aus `data/steckbriefe.json` (Stand `main`, 19.11.2026).
- **Anfragen:** 50 Anfragen in sechs Typen, je mit den erwarteten IDs (`prototypes/suche-messung/anfragen.json`): 7 Produktnamen, 13 Abkürzungen oder Altnamen aus `aka`, 10 umschreibende Stichworte, 5 ganze Fragen, 8 englische Begriffe, 7 Tippfehler. **Ich habe die Anfragen gebaut und kenne den Bestand. Sie sind kein Urteil von Niko und keine Stichprobe echter Nutzung.** Mehrere erwartete IDs bedeuten: Jede davon zählt als Treffer.
- **Kennzahlen:** Treffer@1 (der erste Treffer ist erwartet; bei der heutigen Seite wählt Enter genau diesen), Treffer@5 (mindestens ein erwarteter in den Top 5), MRR@10, Anzahl leerer Ergebnisse.
- **Kein Tuning:** Jede Variante habe ich einmal eingestellt und einmal laufen lassen. Nach Ansicht der Ergebnisse habe ich nichts nachjustiert.
- **Nicht gemessen:** wie ein Agent die Anfrage umformuliert. Gemessen ist die rohe Eingabe, wie sie ein Mensch ins Suchfeld tippt. Activate #29 zeigt, dass Umformulieren durch den Agenten Volltext stark verbessert (dort P@10 0,07 → 0,65).

### Varianten

| Kürzel | Variante | Technik |
|---|---|---|
| c0 | **heutige Seite** | 1:1 `applyFilter()` aus `src/landkarte.html`: alle Wörter als Teilstring in Name, aka, kurz, was, id; keine Rangfolge (Dateireihenfolge) |
| c1 | **MiniSearch im Browser** | MiniSearch 7.2.0 [P] npm; alle Textfelder, Gewichte Name 4, aka 3, id 2, kurz 2, was 1, übrige weniger; Präfix ab 4 Zeichen, Tippfehlertoleranz 0,2 ab 5 Zeichen, ODER-Verknüpfung, Umlaute gefaltet, kleine Stoppwortliste, kein Stemming |
| p1 | Postgres `ts_rank_cd` | Konfiguration `german`, gewichtete Felder (A: Aliasspalte aus Name + aka + id, zusätzlich mit `simple`; B: kurz; C: was/wie/s4/wann; D: Rest), ODER-Anfrage |
| p2 | **Postgres BM25** | `pg_textsearch` 1.5.1, `text_config = 'german'`, Aliasspalte 3-mal und kurz 2-mal wiederholt (wie Activate #31) |
| p3 | p2 + Trigramm | p2 und `pg_trgm`-Wortähnlichkeit auf der Aliasspalte (Standardschwelle), per RRF |
| e1 | BGE-M3 allein | dichte Vektoren, pgvector 0.8.2, exakte Kosinus-Suche |
| h1 | **hybrid** | p2 + e1 per RRF (k = 60), entspricht Variante j aus Activate #31 |
| h2 | hybrid + Trigramm | p3 + e1 per RRF |

Postgres lief lokal im Image `activate-pg:17-ts` (Postgres 17.10, pgvector 0.8.2, pg_textsearch 1.5.1, pg_trgm 1.6), also dem Image aus Activate #31.

### Ergebnis: Treffer@1 / Treffer@5 je Anfragetyp

| Variante | Name (7) | Alias (13) | umschreibend (10) | Frage (5) | englisch (8) | Tippfehler (7) | **alle (50)** | MRR@10 | leer |
|---|---|---|---|---|---|---|---|---|---|
| c0 heutige Seite | 1 / 5 | 11 / 13 | 4 / 4 | 0 / 0 | 3 / 4 | 0 / 1 | **19 / 27** | 0,45 | 20 |
| c1 MiniSearch | 7 / 7 | 13 / 13 | 7 / 9 | 4 / 4 | 3 / 7 | 5 / 6 | **39 / 46** | 0,83 | 1 |
| p1 `ts_rank_cd` | 6 / 7 | 12 / 12 | 5 / 7 | 2 / 3 | 3 / 6 | 2 / 4 | **30 / 39** | 0,69 | 4 |
| p2 BM25 | 6 / 7 | 13 / 13 | 6 / 8 | 1 / 3 | 5 / 8 | 2 / 4 | **33 / 43** | 0,74 | 3 |
| p3 BM25 + Trigramm | 6 / 7 | 13 / 13 | 6 / 8 | 1 / 3 | 5 / 8 | 2 / 4 | **33 / 43** | 0,74 | 3 |
| e1 BGE-M3 | 6 / 7 | 12 / 13 | 7 / 9 | 2 / 4 | 8 / 8 | 5 / 7 | **40 / 48** | 0,86 | 0 |
| h1 BM25 + BGE-M3 | 7 / 7 | 13 / 13 | 7 / 9 | 2 / 4 | 7 / 8 | 5 / 7 | **41 / 48** | 0,88 | 0 |
| h2 h1 + Trigramm | 6 / 7 | 13 / 13 | 7 / 9 | 2 / 4 | 7 / 8 | 4 / 7 | **39 / 48** | 0,86 | 0 |

**Paarvergleich je Anfrage** (Rang des ersten erwarteten Treffers in den Top 10, zweiseitiger Vorzeichentest, `erg/vergleich.md`):

| Vergleich | besser | schlechter | gleich | p |
|---|---|---|---|---|
| c1 gegen c0 | 27 | 1 | 22 | < 0,01 |
| c1 gegen p2 | 11 | 3 | 36 | 0,06 |
| h1 gegen p2 | 13 | 1 | 36 | < 0,01 |
| **h1 gegen c1** | 7 | 5 | 38 | **0,77** |
| e1 gegen c1 | 8 | 8 | 34 | 1,00 |
| p2 gegen p1 | 10 | 7 | 33 | 0,63 |

### Was die Zahlen sagen

- **Die heutige Seite verfehlt fast die Hälfte.** Ganze Fragen findet sie nie, Tippfehler fast nie. 20 von 50 Anfragen bleiben ganz leer, weil jedes Wort als Teilstring vorkommen muss. Und selbst bei exakten Produktnamen steht der richtige Baustein nur einmal von sieben auf Platz 1, weil es keine Rangfolge gibt („Datasphere“: Platz 7, „Cloud ALM“: Platz 7). Damit ist W5 gemessen.
- **MiniSearch im Browser liegt gleichauf mit dem Hybrid.** Der Abstand zu h1 beträgt 2 Treffer in den Top 5 und 2 auf Platz 1. Er ist nicht gesichert (p ≈ 0,77). Gegenüber BM25 in Postgres ist MiniSearch eher besser (11 : 3, p ≈ 0,06). Das liegt vor allem an Präfix und Tippfehlertoleranz.
- **Embeddings helfen bei englischen Begriffen und bei Wortlücken**, nicht pauschal: „e-invoicing“ → `drc`, „Fioir“ → `fiori` (4 Zeichen, unter der Tippfehlerschwelle von c1), „Zahlungseingänge automatisch zuordnen“ → `taulia-cashapp` (das Wort „automatisch“ lenkt den Volltext auf andere Bausteine). Umgekehrt sinkt h1 bei „Nachfolger Solution Manager“ auf Platz 10 (c1: 4), bei „Datashpere“ auf Platz 3 (c1: 1).
- **Trigramme bringen nichts** (p3 = p2). Bei der Standardschwelle von 0,6 greift `pg_trgm` bei den Tippfehlern nicht. Eine niedrigere Schwelle habe ich nicht probiert (kein Tuning).
- **Keine Variante löst** „Wie bekomme ich Stammdaten aus dem Altsystem ins S/4?“ (erwartet `migration-cockpit` oder `syniti-admm`). Das ist eine Lücke im Wortschatz der Steckbriefe, kein Problem der Technik.
- **Viele Lücken lassen sich über die Daten schließen:** Ein `aka`-Eintrag wie „E-Invoicing“ bei `drc` oder „warehouse“ bei `ewm` würde die lexikalischen Varianten in genau diesen Fällen auf Platz 1 bringen (abgeleitet, nicht gemessen). Das gehört in die Datenbereinigung, nicht in die Suche.

### Betrieb (gemessen auf dem Laptop, 32 Threads, BGE-M3 mit 8 Threads)

| Größe | Wert |
|---|---|
| MiniSearch je Anfrage | 0,53 ms (Node 24) |
| MiniSearch-Bibliothek, minifiziert + gzip | 5.924 Bytes (esbuild) |
| Steckbriefe-JSON | 579.068 Bytes, gzip 160.393 Bytes; die heutige Seite bettet es ohnehin ein (`dist/index.html` 597.976 Bytes) |
| Postgres je Anfrage | `ts_rank_cd` 1,3 ms, BM25 4,0 ms, Trigramm 1,0 ms, Vektor 1,3 ms |
| BGE-M3: Modell laden / 154 Steckbriefe einbetten / eine Anfrage | 3,1 s / 84,6 s / 61 ms |
| BGE-M3: höchster Arbeitsspeicher des Prozesses | 2.423 MB (Activate #9 nennt für den Server etwa 2,3 GB) |

**Einordnung:** Ein Hybrid hieße für sapmap: ein Modell mit etwa 2,4 GB RAM im Server, ein Einbettungsschritt bei jeder Inhaltsänderung, ein eigenes Postgres-Image (wie in Activate #31) und ein Paritätstest zwischen ONNX und Python. Dafür gäbe es in dieser Messung 2 Treffer mehr von 50. **Empfehlung:** v1 ohne Embeddings, mit MiniSearch. Ein Nachtest kommt, wenn das Aufrufprotokoll von `/mcp` oder Rückmeldungen Fehlsuchen zeigen. Die Schnittstelle von `suchen` bleibt dabei gleich. Das ist dieselbe Logik, die Activate in #29 zuerst empfohlen hat.

## 3. Eine Suche oder zwei?

**Fakten:**
- Die Steckbriefe liegen in Git (`data/steckbriefe.json`), nicht in Postgres. Der Build liest sie, und die Seite bettet sie heute vollständig ein.
- MiniSearch ist reines TypeScript ohne Abhängigkeiten und läuft im Browser wie in Node (beides gemessen bzw. genutzt: Node 24 in der Messung; im Browser ist es der dokumentierte Einsatzzweck [P] https://www.npmjs.com/package/minisearch).
- In #13 steht: Auch das JSON liegt hinter der Anmeldung. Wer die Seite sieht, darf also auch den ganzen Bestand laden.

**Optionen:**

| Option | Seite | MCP | Folge |
|---|---|---|---|
| **A: ein Modul, zwei Orte** (empfohlen) | MiniSearch im Browser, sofort beim Tippen, ohne Server-Rundreise | dasselbe Modul in der Route `/mcp`, Index beim Serverstart aus dem JSON | eine Rangfolge, ein Test, keine Synchronisation zwischen Git und DB, kein Such-Index in Postgres |
| B: zwei Suchen | MiniSearch im Browser | BM25 in Postgres | zwei Rangfolgen, die auseinanderlaufen (gemessen: c1 und p2 unterscheiden sich bei 14 von 50 Anfragen); die Steckbriefe müssten zusätzlich nach Postgres |
| C: eine Serversuche | Seite fragt bei jedem Tastendruck den Server | Postgres | Rundreise je Tastendruck, Postgres-Tabelle mit den Steckbriefen nötig; bringt laut Messung nichts gegenüber A |

**Empfehlung A.** Das Modul bekommt die Filter aus Abschnitt 5, damit die Facetten auf der Seite und `auflisten`/`suchen` im MCP dasselbe liefern. Teste es mit `anfragen.json` als Vergleichstest. Er läuft wieder, wenn sich Gewichte, Felder oder `aka` ändern (Vorbild: Activate #9, „Vergleichstest“).

## 4. MCP-Form im gesetzten Stack

### Stand der Bibliotheken (19.11.2026)

- **`@modelcontextprotocol/server`:** `latest` ist **2.4.0** (veröffentlicht am 23.10.2026). 2.0.0 erschien am 27.07.2026, danach 2.1.0 bis 2.3.1 [P] `npm view @modelcontextprotocol/server time`. Die v2-Doku beschreibt `createMcpHandler(factory)` mit einem webstandardkonformen `fetch(Request) → Response`. Der Handler ist zustandslos (je Anfrage ein frischer `McpServer`) und bedient Clients des Protokolls von 2025 mit. **Er prüft weder Host noch Origin noch Token.** Das muss davor geschehen, das Ergebnis geht als `authInfo` hinein [P] https://ts.sdk.modelcontextprotocol.io/v2/serving/http.
- **Clerk, MCP-Leitfaden:** „Build and authenticate an MCP server“ gibt es weiterhin **nur für Next.js und Express**, für TanStack Start nicht (Seite „Last updated on Nov 19, 2026“) [P] https://clerk.com/docs/guides/ai/mcp/build-mcp-server. Der Leitfaden prüft das Token mit `authenticateRequest(request, { acceptsToken: 'oauth_token', audience: MCP_RESOURCE_URL })`. Dazu der Satz: „Always pass `audience`; without it, the audience isn't checked.“ [P] clerk-docs über Context7, Quelle https://github.com/clerk/clerk-docs/blob/main/docs/guides/ai/mcp/build-mcp-server.mdx.
- **Clerk in TanStack Start:** `auth({ acceptsToken: 'oauth_token' })` in Server-Routen ist dokumentiert [P] https://github.com/clerk/clerk-docs/blob/main/docs/guides/development/verifying-oauth-access-tokens.tanstack-react-start.mdx. Eine Option `audience` an `auth()` dokumentiert die Seite nicht. `clerkClient().authenticateRequest()` aus `@clerk/tanstack-react-start/server` nimmt sie aber an. Der Typ `AuthenticateRequestOptions` in `@clerk/backend` 3.25.0 enthält `audience` [P, Quelltext der Typdefinitionen `dist/tokens/factory.d.ts`, lokal im KI-Kompass installiert]. Ob die Option zur Laufzeit wirkt, habe ich **nicht getestet**.
- **`@clerk/mcp-tools`:** `latest` 0.9.0 (06.11.2026). Es gibt Exporte für `next`, `express`, `hono`, `server` und `stores/…`, **keinen für TanStack** [P] `npm view @clerk/mcp-tools exports`. Für TanStack Start wird er nicht gebraucht (siehe KI-Kompass).
- **`@clerk/tanstack-react-start`:** `latest` 1.7.16 [P] npm (in #20 war es noch 1.7.15).

### Der Weg ist im KI-Kompass schon gebaut

[P, eigener Code, `/home/niko/projects/ki-kompass`, Commit `2dd0179`; Doku `docs/connector.md`, Stand 22.10.2026]

- `app/routes/mcp.ts`: Server-Route `/mcp` mit `GET`, `POST` und `DELETE`. Logik in `app/server/connector.ts` mit `createMcpHandler`, `originValidationResponse`, `bearerAuthChallengeResponse` und `getOAuthProtectedResourceMetadataUrl` aus `@modelcontextprotocol/server` 2.4.0.
- Ohne gültiges Token antwortet die Route mit 401 und `WWW-Authenticate … resource_metadata=…` (RFC 9728). `app/routes/[.]well-known.$.ts` liefert die Metadaten der Ressource und eine Kopie der Metadaten des Autorisierungsservers von Clerk.
- `app/server/zugang.ts`: die eine Stelle `zugelassenePerson(anfrage, 'oauth_token' | 'session_token')` über `clerkClient().authenticateRequest(...)`. Dieselbe Prüfung gilt für Browser-Sitzung und MCP-Token.
- Clerk-Einstellung laut `docs/connector.md`: „Publish CIMD support“ an, Client admission „Any compatible CIMD client“, DCR aus, Access mode Invite-only. Nach dieser Doku ist der Connector in claude.ai verbunden und funktioniert mit claude.ai, Desktop und Claude Code; Activate #9 bestätigt das.
- **Was der KI-Kompass nicht tut:** Er übergibt **kein `audience`**. Das ist eine Folgerung aus dem Code (`authenticateRequest(anfrage, { acceptsToken: art })`). Nach der Clerk-Doku wird die Audience dann nicht geprüft. Ein Token, das dieselbe Clerk-Instanz für eine andere Ressource ausgestellt hat, würde also angenommen. Relevant wird das, sobald sapmap und eine andere App dieselbe Clerk-Anwendung teilen.
- In `docs/connector.md` steht außerdem eine Grenze von 150.000 Zeichen je Werkzeug-Ergebnis in claude.ai (Stand 22.10.2026). **[S]**: Die Zahl stammt aus der eigenen Doku, die Anthropic-Quelle dort habe ich nicht erneut geprüft.

### Die drei Formen im Vergleich

| Form | Was dafür spricht | Was dagegen spricht |
|---|---|---|
| **(a) `/mcp` als Server-Route in der sapmap-App** (empfohlen) | Vorlage aus dem KI-Kompass (etwa drei Dateien) und dieselbe Clerk-Anwendung wie die Seite, also ein Nutzerkreis. Die Suche ist dasselbe Modul wie auf der Seite. Das Aufrufprotokoll landet in der vorhandenen Postgres-DB. | Die Anmeldewand der Seite (#13) braucht zwei Ausnahmen: `/mcp` und `/.well-known/oauth-protected-resource/mcp` bzw. `/.well-known/oauth-authorization-server`. Diese Routen prüfen selbst per Bearer-Token und dürfen nicht zur Anmeldeseite umleiten. Der KI-Kompass löst das, indem `clerkMiddleware` nur für bestimmte Pfade läuft (`app/start.ts`). Für sapmap ist es umgekehrt (alles geschützt außer diesen Pfaden). Das ist Folgerung, nicht getestet. |
| (b) sapmap als zusätzliche Quelle im Activate-Server | ein Connector für beide Wissensquellen | **Der Activate-Server existiert noch nicht** (kein Code auf `main`). Dort sind englische Tools für englische Abschnitte entschieden, und der Nutzerkreis ist eine eigene Clerk-Anwendung (#9). Jede Steckbrief-Änderung müsste in ein anderes Repo und einen anderen Deploy. |
| (c) kein MCP, nur Datenpaket oder `llms.txt` hinter der Anmeldung | kein Server-Code für MCP | Hinter Clerk kann ein Agent die Datei nicht selbst abrufen. Er hat keine Browser-Sitzung, und ohne OAuth gibt es keinen Weg hinein. Es bliebe Herunterladen und Anhängen von Hand, ohne aktuellen Stand. Das ganze JSON hat 579.068 Zeichen, die kompakte Liste mit aka und `kurz` 18.049 Tokens (gemessen). |

**Empfehlung (a)**, in dieser Reihenfolge:

1. Connector aus dem KI-Kompass übernehmen.
2. `audience: 'https://sapmap.iverra.de/mcp'` ergänzen.
3. Die Ausnahmen in der Anmeldewand anlegen.
4. CIMD in der Production-Instanz einschalten.
5. Den Ablauf in einem Browsertest prüfen wie im KI-Kompass (`app/browsertest/connector.spec.ts`).

Ein eigener Spike wie in #20 vorgeschlagen ist damit nicht mehr nötig. Es bleibt ein Test beim Bau: die Audience-Prüfung zur Laufzeit und die Ausnahmen in der Anmeldewand.

## 5. Tool-Schnitt für Steckbriefe

Vorschlag mit deutschen Namen nach dem Vorbild des KI-Kompass (Namen sind Nikos Entscheidung). Alle Tools sind nur lesend (`readOnlyHint`). Jede Antwort trägt den Recherche-Stand.

| Tool | Entspricht in Activate | Leistung |
|---|---|---|
| `suchen(text, filter?)` | `search` | Das Such-Modul aus Abschnitt 3. Eine Zeile je Treffer: ID, Name, Bereich, Status, `kurz`. Dazu Gesamtzahl und Zähler je Facette. Höchstens 20 Treffer. Die Beschreibung bittet den Agenten, deutsch zu suchen, Abkürzungen und Altnamen direkt zu nehmen und bei wenigen Treffern Synonyme nachzuschieben. |
| `auflisten(filter?)` | `list` | Vollständige Aufzählung mit Gesamtzahl. Ohne Filter nur ID, Name, Bereich, Status: alle 154 haben so **6.689 Tokens** und passen unter die 8.000. Mit aka und `kurz` sind es **18.049 Tokens**. `kurz` kommt deshalb nur bei gefilterten Listen bis zu einer festen Zahl oder per Fortsetzungsmarke. |
| `steckbrief(id)` | `get` + `read` | Der ganze Steckbrief: alle Felder inklusive `test` (die Testperspektive), `quellen`, `belegt`, `hinweis` und `daten`. Dazu kommen die Beziehungen mit ID und Name: `verwandt` **plus Rückverweise** (die Seite ergänzt sie heute in `REL`), `parent` und die Einzelprodukte eines Portfolios, die Mehrfachzuordnungen, und **Nachfolger, sobald das Schema v2 das Feld `nachfolger` hat** (laut #2 nötig für die Auswirkungsanalyse). Eine Stufe reicht. Kein `tiefe`, denn den Rest holt der Agent mit einem weiteren Aufruf. |
| `stand(seit?)` | `status` | Recherche-Stand, Bestand je Bereich, Status und Belegstatus, Anzahl unbelegter Steckbriefe. `seit` liefert die Änderungen, sobald Recherche-Stände abgelegt werden (Feature „Neu seit …“, F3; Ablage dort noch offen). |

**Filter** (für `suchen` und `auflisten`, gleich wie auf der Seite):

| Filter | Grundlage heute | Hinweis |
|---|---|---|
| `bereich` | `layer`, mit Mehrfachzuordnung (`ALSO`) | Nach #4 sind es künftig 11 Bereiche, `pm` entfällt. |
| `status` | `status` (5 Werte) | Getrennt nach „läuft aus“ und „abgekündigt“, nicht zusammengefasst wie auf der heutigen Seite (W5). |
| `belegt` | `belegt` (ja/teilweise/nein) | – |
| `wartungsende_bis` (Jahr) | heute nur die Text-Erkennung `isEol()` in `src/landkarte.html` | Wird erst mit `daten[].typ` aus dem Schema v2 verlässlich (#2). Bis dahin besser weglassen als raten. |
| `portfolio` | `parent` | Einzelprodukte eines Portfolios. |
| Kundenlandschaft | – | **Nicht in v1.** Die Kundenlandschaft gehört zu einem Konto (F1). Über das OAuth-Token wäre die Person bekannt, aber Ablage und Spec von F1 fehlen noch. Kandidat für später. |

## Offen / nicht gefunden

- **Nicht gemessen:** wie gut Volltext wird, wenn ein Agent die Anfrage umformuliert, also der MCP-Fall. Der Wert dürfte über dem der rohen Eingabe liegen (Activate #29), hier ist er nicht belegt.
- **Nicht getestet:** ob `audience` in `clerkClient().authenticateRequest()` unter TanStack Start zur Laufzeit greift. Belegt ist nur, dass der Typ die Option enthält. Ebenso nicht getestet: die Ausnahmen für `/mcp` und `/.well-known/…` in einer Anmeldewand, die die ganze Seite schützt.
- **Nicht gefunden:** ein Clerk-Leitfaden für MCP mit TanStack Start, eine TanStack-Variante von `@clerk/mcp-tools` und eine Option `audience` in der Doku von `auth()` für TanStack Start.
- **Grenzen der Messung:** 50 selbst gebaute Anfragen, ein Bewerter (ich), Relevanz als feste ID-Liste statt Richterurteil wie in Activate. Bei so wenigen Anfragen sind Unterschiede von 2 bis 3 Treffern Rauschen (Vorzeichentest oben).
- **Tokenzahlen** habe ich als Differenz zweier `claude -p`-Aufrufe mit Haiku 5.5 gemessen (Grundlast 35.376 Tokens, zweimal gleich). Andere Claude-Modelle können leicht abweichen.
