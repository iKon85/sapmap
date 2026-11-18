# Recherche: Wo läuft ein wöchentlicher Agentenauftrag, und was kostet er? (Stand 18.11.2026)

Beantwortet Issue #21 („Wo läuft ein wöchentlicher Agentenauftrag, und was kostet er?“). Quellen sind mit **[P]** (primär: offizielle Doku, Nutzungsbedingungen, Preisseite, Quellcode-Repository des Anbieters) oder **[S]** (sekundär) markiert. **[Rechnung]** heißt: selbst gerechnet, Annahmen stehen in Abschnitt 6. **[Schluss]** heißt: eigener Schluss aus den Quellen, nicht wörtlich belegt. Alle Seiten wurden am **18.11.2026** abgerufen. Die Doku-Seiten tragen kein Änderungsdatum.

## Takeaway

- **Alle drei Orte können wöchentlich unbeaufsichtigt laufen** (Cron-Trigger bzw. Zeitplan sind überall dokumentiert). Sie unterscheiden sich bei Anmeldung, Rechten für den PR, Reife und Eigenaufwand.
- **Kosten:** Mit API-Key rechnet sich ein Lauf mit 10 geänderten Bausteinen auf Sonnet 5.5 zu rund **1,30 USD** (Opus 5.5: rund 2,70 USD); Jahr (52 Läufe) rund 70 bzw. 140 USD **[Rechnung]**. Der Wert hängt an geschätzten Token-Zahlen (Abschnitt 6), nicht an gemessenen. Die Runner-Minuten kosten nichts, weil `iKon85/sapmap` ein öffentliches Repository ist.
- **Abo statt API-Key ist die Streitfrage.** Die Doku erlaubt den Abo-Token (`CLAUDE_CODE_OAUTH_TOKEN`) für GitHub Actions und CI ausdrücklich. Die Consumer-Bedingungen verbieten automatisierten Zugriff „except … via an Anthropic API Key or where we otherwise explicitly permit it“. Eine Stelle, die beides zusammenführt, habe ich nicht gefunden. Wer auf Nummer sicher gehen will, nimmt den API-Key.
- **Cloud-Aufgaben (Scheduled Tasks, früher Routines)** laufen auf dem Abo, haben keine eigene Rechnung, sind aber **Research Preview**, gehören einem persönlichen Konto und zählen gegen dasselbe Kontingent wie Nikos interaktive Arbeit.
- **PR-Rechte sind der größte Stolperstein der Action:** Sie erstellt keinen PR von selbst, sondern gibt einen Link aus; und Repositories im persönlichen Konto verbieten Workflows das Anlegen von PRs, solange die Einstellung nicht eingeschaltet ist.

---

## 1. Vergleich auf einen Blick

| | GitHub Action (`claude-code-action`) | Cloud-Aufgabe (Scheduled Task) | Agent SDK auf Hetzner/Coolify |
|---|---|---|---|
| Auslöser | `schedule` mit Cron; läuft nur vom Default-Branch | Zeitplan (mindestens stündlich), API-Aufruf, GitHub-Ereignis | Coolify „Scheduled Task“ (Cron im laufenden Container) |
| Anmeldung | API-Key, Abo-Token, Workload Identity Federation, Bedrock/Vertex/Foundry | nur claude.ai-Abo | API-Key oder Cloud-Anbieter; Abo-Token technisch möglich, Bedingungen offen |
| Kostenart | Tokens (API) **oder** Abo-Kontingent; Runner kostenlos (öffentliches Repo) | Abo-Kontingent; Überlauf nur mit eingeschalteten Usage Credits | Tokens (API); Server läuft ohnehin |
| Netz | Runner mit Internet **[nicht geprüft]**; Zugriff auf Anthropic-API nötig | Default: Allowlist (GitHub, Registries, Anthropic); „Full“ einstellbar | frei, eigener Server; nur `api.anthropic.com` zwingend |
| Rechte für PR | GitHub-App-Token oder eigener Token; PR-Anlage per Workflow-Einstellung freischalten | Push auf `claude/`-Branch über Anthropic-Proxy; PR aus der Sitzung | eigener Token im Container, vollständig selbst zu bauen |
| Reife | v1, Doku vollständig | **Research Preview**, „may change“ | Agent SDK stabil; Eigenbau der Hülle |
| Eigener Aufwand | gering (eine Workflow-Datei) | sehr gering (Dialog) | hoch (Image, Secrets, Git, Logs, Updates) |

## 2. GitHub Action mit `anthropics/claude-code-action`

**Cron-Trigger.** Mit einem `prompt`-Eingang läuft die Action im „automation mode“ auf jedem GitHub-Ereignis, auch auf `schedule`. [P] https://code.claude.com/docs/en/github-actions (Abschnitt „Run on a schedule“, abgerufen 18.11.2026). Die Doku nennt zwei Einschränkungen: „GitHub runs scheduled workflows only from the default branch and, in public repositories, disables the schedule after 60 days without repository activity.“ **Folge für uns [Schluss]:** Das Repository ist öffentlich (`gh repo view`, 18.11.2026). Der Prüflauf, der selbst PRs erzeugt, zählt wohl als Aktivität; belegt ist das nicht. Ein Wochenlauf ohne jede Änderung am Repository könnte nach 60 Tagen abgeschaltet werden.

**Anmeldung.** [P] https://code.claude.com/docs/en/github-actions (Abschnitt „Manual setup“):
- `ANTHROPIC_API_KEY`: API-Key aus der Claude Console, Eingang `anthropic_api_key`.
- `CLAUDE_CODE_OAUTH_TOKEN`: „an OAuth token that authenticates with your Claude subscription, available on Pro, Max, Ultra, Team, and Enterprise plans. Generate one by running `claude setup-token` locally.“ Eingang `claude_code_oauth_token`.
- Workload Identity Federation (kein gespeichertes Geheimnis; die Action tauscht das GitHub-OIDC-Token gegen Claude-API-Zugang) und Bedrock, Vertex, Foundry.
- Kostenhinweis der Doku: „If you authenticate with an OAuth token, runs use your Claude subscription instead of API billing.“

Der Token von `claude setup-token` ist laut [P] https://code.claude.com/docs/en/authentication (Abschnitt „Generate a long-lived token“, abgerufen 18.11.2026) ein „one-year OAuth token“ für „CI pipelines, scripts, or other environments where interactive browser login isn't available“. Er „can only make model requests“. Für einen Organisations-Secret rät die Doku zum API-Key, weil der OAuth-Token „tied to the subscription of the person who ran `claude setup-token`“ ist.

**Abo-Token und Nutzungsbedingungen (offen).** Zwei Primärquellen, die sich nicht klar aufeinander beziehen:
1. Die Claude-Code-Doku beschreibt den Abo-Token für CI und GitHub Actions als vorgesehenen Weg (siehe oben).
2. Die Consumer-Bedingungen untersagen, „to access the Services through automated or non-human means, whether through a bot, script, or otherwise“, mit der Ausnahme „Except when you are accessing our Services via an Anthropic API Key or where we otherwise explicitly permit it“. [P] https://www.anthropic.com/legal/consumer-terms (Abschnitt 3 Nr. 7, „Effective Oct 8, 2025“, abgerufen 18.11.2026).
3. Das Agent-SDK-Handbuch sagt: „Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK. Use the API key authentication methods … instead.“ [P] https://code.claude.com/docs/en/agent-sdk/overview (18.11.2026). Das betrifft Produkte für Dritte, nicht den Eigenbetrieb; ob es für einen Eigenbetrieb auf dem Abo etwas ändert, sagt die Seite nicht.

Mein Schluss **[Schluss]**: Die Doku des Action-Herstellers kann man als „explicitly permit“ lesen, ein Satz, der das so sagt, steht nicht da. Für Team/Enterprise gelten die Commercial Terms (Stand „Jun 17, 2025“, https://www.anthropic.com/legal/commercial-terms, 18.11.2026), die in den abgerufenen Abschnitten keine Regel zu automatisiertem Zugriff enthalten; die Usage Policy, auf die sie verweisen, wurde nicht gelesen. Welchen Plan Niko hat, ist dem Repository nicht zu entnehmen. **Klärung nötig, wenn der Abo-Weg gewählt wird.**

**Rechte zum Öffnen eines PR.**
- Die GitHub-App hat Contents, Issues und Pull requests jeweils Lesen und Schreiben; der App-Name `Claude` wird für alle Claude-Funktionen geteilt, der Satz an Rechten ist größer als nötig (Actions, Workflows, Repository creation u. a.). Wer nur das Nötige will, legt eine eigene GitHub-App an. [P] https://code.claude.com/docs/en/github-actions (Abschnitt „GitHub App permissions“).
- Das Sicherheitsdokument der Action sagt zu PRs: „Claude does not create pull requests automatically“; Claude gibt einen Link aus, den ein Mensch öffnet. Außerdem: „Claude's push command can't update any other branch“ als den eigenen. [P] https://github.com/anthropics/claude-code-action/blob/main/docs/security.md (18.11.2026, über Textauszug der Abrufmaschine; nicht Wort für Wort geprüft).
- Wie sich ein PR trotzdem **unbeaufsichtigt** öffnen lässt (etwa `Bash(gh pr create:*)` in `--allowedTools`, wie es die Auto-Modus-Regeln der Seite `docs/usage.md` für „enge Regeln“ vorsehen), ist in den abgerufenen Seiten **nicht belegt** und nicht von mir getestet. Fallback ohne Agent-Rechte: Der Agent bearbeitet nur Dateien; ein Schritt danach im Workflow (`gh pr create` mit dem Workflow-Token) legt den PR an. [Schluss]
- GitHub-Einstellung: „You can choose to allow or prevent GitHub Actions workflows from creating or approving pull requests.“ Bei neuen Repositories im persönlichen Konto ist das ausgeschaltet; Ort: Settings → Actions → General → Workflow permissions. [P] https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository (18.11.2026).
- CI auf den Commits: GitHub startet auf Commits mit dem Standard-`GITHUB_TOKEN` keine Workflows. Die Doku rät, `github_token` nicht zu setzen, damit die Action als Claude-GitHub-App auftritt. [P] https://code.claude.com/docs/en/github-actions (Abschnitt „CI not running on Claude's commits“). Unser `build`/`validate` müsste im PR laufen; das entscheidet über die Token-Wahl.
- Prüfung des Auslösers: Läufe von `schedule` werden einem Repository-Nutzer zugeschrieben (meist wer zuletzt die `cron`-Zeile geändert hat). Ist das ein Bot, muss er in `allowed_bots` stehen. [P] derselbe Abschnitt „Who can trigger runs“.

**Grenzen und Schutz.**
- Es gibt `--max-turns`, Workflow-Timeouts und GitHub-Concurrency als Kostenbremse. [P] https://code.claude.com/docs/en/github-actions (Abschnitt „Manage costs“).
- Ein reiner `prompt` hat keinen Shell- und GitHub-Zugriff, bis man Werkzeuge freigibt (`--allowedTools` oder `permissions.allow`); bei einem Skill gelten dessen `allowed-tools`. Ebenda.
- „The action sanitizes content by stripping HTML comments, invisible characters, markdown image alt text, hidden HTML attributes, and HTML entities, but new bypass techniques may emerge.“ und „Text can still steer Claude.“ Die Seite sagt auch, die Action sei keine Sandbox und der Auto-Modus „a review, not a boundary“. [P] Sicherheitsdokument (siehe oben). **Folge für uns [Schluss]:** Roadmap-Einträge und Release Notes sind fremder Text in einem öffentlichen Repository. Dem Agenten nur Lesen und Bearbeiten unter `data/` geben, kein freier Netzzugriff, kein `Bash(*)`; der Mensch prüft den PR.
- Kosten der Hülle: Runner-Minuten verbrauchen GitHub-Guthaben (Free: 12 USD/Monat), „The use of standard GitHub-hosted runners is free … In public repositories“ [P] https://docs.github.com/en/billing/managing-billing-for-your-products/about-billing-for-github-actions (18.11.2026). Für ein öffentliches Repository also 0 USD.

## 3. Geplante Claude-Code-Cloud-Aufgaben (Scheduled Tasks, früher Routines)

Quelle für den ganzen Abschnitt, sofern nicht anders genannt: [P] https://code.claude.com/docs/en/routines (18.11.2026).

- **Status:** „Scheduled tasks are in research preview. Behavior, limits, and the API surface may change.“ Verfügbar auf Pro, Max, Ultra, Team und Enterprise; Team/Enterprise-Owner können sie abschalten. Anlegen unter claude.ai/code/routines oder mit `/schedule`.
- **Zeitplan:** Voreinstellungen (stündlich, täglich, wöchentlich), eigene Cron-Ausdrücke; „Expressions that run more often than once per hour are rejected.“ Zeitangaben im Cron in UTC, außer `CRON_TZ=`. Direkt auf die volle Stunde kann der Start „several minutes late“ sein.
- **Läuft als volle Cloud-Sitzung:** „Scheduled tasks run autonomously as full Claude Code cloud sessions.“ Mit Shell, Skills, Connectors. Das Repository wird bei jedem Lauf geklont; Claude pusht auf `claude/`-Branches, sofern der Prompt nichts anderes sagt. Welche Branches erlaubt sind, regeln Branch-Schutzregeln auf GitHub. Aus der Sitzung eines Laufs kann man den PR erstellen; ob die Aufgabe ihn **selbst** unbeaufsichtigt anlegen darf, steht auf der Seite nicht ausdrücklich. Die Beispiele („Docs drift … opens update PRs“) legen es nahe. Der GitHub-Proxy lehnt Branch-Löschungen und Tags ab, begrenzt aber nicht, welchen Branch ein Push aktualisiert [P] https://code.claude.com/docs/en/cloud-environments (Abschnitt GitHub proxy). GraphQL-Unterbefehle von `gh` (`gh pr create` gehört dazu) lehnt der Proxy ab; PR-Anlage läuft also über `gh api` (REST) oder die Sitzung selbst. [P] ebenda, Zeile zu `gh`; ob das bei Aufgaben so funktioniert, habe ich nicht ausprobiert.
- **Zählt gegen das Kontingent:** „Scheduled tasks draw down subscription usage the same way interactive sessions do.“ Eigene stündliche Obergrenzen: 100 geplante Läufe/Stunde je Konto. Ist das Kontingent erschöpft, laufen Aufgaben nur mit eingeschalteten Usage Credits weiter (Überlauf mit Abrechnung); sonst werden Läufe abgelehnt. Das Kontingent ist ein 5-Stunden- und ein Wochenlimit, geteilt zwischen Claude und Claude Code. [P] https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan („Updated over 2 weeks ago“, 18.11.2026). Wie viele Token ein Lauf vom Kontingent verbraucht: **nicht gefunden**; eine Umrechnung in Dollar ist nicht möglich.
- **Konto, nicht Team:** „Scheduled tasks belong to your individual claude.ai account. They are not shared with teammates“; Commits und PRs tragen den GitHub-Nutzer des Kontoinhabers.
- **Netz:** Jede Aufgabe nutzt eine Cloud-Umgebung. Standard: „Limited“ mit „Allow package managers“. Die Default-Allowlist umfasst unter anderem `api.anthropic.com`, `github.com`, `api.github.com`, `registry.npmjs.org`. Zugriffsstufen: None, Limited, Full („Any domain“). [P] https://code.claude.com/docs/en/cloud-environments (Abschnitte „Access levels“, „Default allowed domains“). Eine SAP-Domain (`sap.com`) steht nicht in der gelesenen Liste (Suche im abgerufenen Text, kein Treffer). Wollte man den Abruf der SAP-Quellen in dieser Umgebung machen, wäre „Full“ oder ein Eintrag unter „Allowed domains“ nötig. Zeitlimit eines ganzen Laufs: **nicht gefunden** (die Seite nennt nur Befehls-Zeitlimits: Vordergrundbefehl 2 Minuten Standard, bis 10 Minuten).
- **Anmeldung:** Nur Abo. „Cloud sessions always use your subscription credentials. If you set `ANTHROPIC_API_KEY` … in the cloud environment, it doesn't override“. `/schedule` verlangt ein claude.ai-Login; mit Console-API-Key nicht verfügbar. [P] https://code.claude.com/docs/en/authentication und Routines-Seite (Abschnitt Troubleshooting). Weil es ein Anthropic-Produkt ist, stellt sich die Frage der Consumer-Bedingungen nicht in der Schärfe wie bei Skripten **[Schluss]**.
- **Ausfälle:** Fehlt die GitHub-Verbindung, setzt die Aufgabe bis zu 72 Stunden aus und schaltet sich danach ab. Der Status „Succeeded“ sagt nur, dass die Sitzung ohne Fehlermeldung endete, nicht, dass die Arbeit getan ist.
- **Unbeaufsichtigt:** Die Sitzung startet im Auto-Modus (Klassifizierer entscheidet), es sei denn, er ist nicht verfügbar. Bei wiederholten Blockaden wartet sie auf eine Antwort. Ein Lauf kann also hängen bleiben, bis jemand die Sitzung öffnet.

## 4. Agent SDK auf dem eigenen Server (Coolify/Hetzner)

- **Was es ist:** „The Agent SDK spawns and supervises a `claude` CLI subprocess that owns a shell, a working directory, and session files on disk.“ [P] https://code.claude.com/docs/en/agent-sdk/hosting (18.11.2026). Es gibt Python und TypeScript; als Alternative `claude -p` auf der Kommandozeile mit `--output-format json`, `--max-turns` im SDK (`maxTurns`/`max_turns`), `--max-budget-usd` und `--permission-mode`. [P] https://code.claude.com/docs/en/headless (18.11.2026).
- **Muster „ephemeral sessions“:** Ein Container, ein Einstiegspunkt, der die Aufgabe liest, das SDK aufruft und endet. Hosting-Seite: Beispiel mit `maxTurns: 20`; bei Erreichen endet das Ergebnis mit `error_max_turns`. Ein Gesamt-Zeitlimit gibt es nicht („No top-level session timeout“), also `maxTurns` und Coolify-Timeout setzen. Ebenda.
- **Ressourcen:** Startwert „1 GiB RAM, 5 GiB disk, and 1 CPU per agent“. Netz: ausgehend HTTPS zu `api.anthropic.com`. Kosten des Containers: „A minimally provisioned container runs roughly $0.05 per hour, while a single long agent session can spend dollars in tokens.“ Ebenda. Für einen Lauf von einer Stunde Dauer also rund 5 Cent, falls der Container eigens dafür gestartet würde; auf einem schon vorhandenen Hetzner-Server fällt kein Zusatz an (Hetzner-Preise **nicht geprüft**).
- **Anmeldung:** Das Handbuch nennt `ANTHROPIC_API_KEY` oder Cloud-Anbieter (Bedrock, Vertex, Foundry u. a.). [P] https://code.claude.com/docs/en/agent-sdk/quickstart (18.11.2026). `CLAUDE_CODE_OAUTH_TOKEN` liest die CLI (Rangfolge Stufe 5 in der Authentifizierungs-Doku), aber nicht im `--bare`-Modus. Die Bedingungsfrage aus Abschnitt 2 gilt hier unverändert; das Handbuch selbst verweist für Anmeldung auf API-Key-Verfahren.
- **Coolify als Zeitgeber:** „Scheduled tasks let Coolify run a command inside an application container on a recurring schedule.“ Standard-Timeout 300 Sekunden, erlaubt 60 bis 36000; Überschreiten gilt als Fehlschlag; „When no application container is running, Coolify skips the run“, ohne Benachrichtigung und ohne Fehler; Zeitzone ist die des Servers; Ausgabe unter „Recent executions“. [P] https://coolify.io/docs/applications/operations/scheduled-tasks (18.11.2026). Der Befehl läuft in einem **laufenden** Anwendungscontainer; ein reiner Job-Container ist nicht vorgesehen. Für uns hieße das: Der Agent-Lauf liegt im Image der Landkarten-Auslieferung (nginx:alpine, siehe Recherche zu TanStack Start) oder in einer zweiten, dauerhaft laufenden Anwendung. Das ist ein Schnitt, den man bewusst wählen müsste **[Schluss]**.
- **Was selbst zu bauen ist:** Git-Zugang mit Schreibrecht (Token als Coolify-Secret), Klonen oder Mounten des Repositories, PR-Anlage (am einfachsten außerhalb des Agenten per `gh`), Fehlermeldungen (ein Exit-Code 0 beweist nichts, so auch die Coolify-Doku), Aktualisieren der SDK-Version („the bundled binary is pinned to the SDK package version, so updating the SDK is how you update the CLI“). Nichts davon ist von Anthropic als fertige Lösung für diesen Fall dokumentiert.

## 5. Preise der aktuellen Modelle

[P] https://platform.claude.com/docs/en/about-claude/pricing (abgerufen 18.11.2026). US-Dollar je Million Token (MTok).

| Modell | Input | Cache schreiben (5 min) | Cache lesen | Output | Batch Input / Output |
|---|---|---|---|---|---|
| Haiku 5.5 (Prompt bis 100.000 Token) | 0,10 | 0,125 | 0,01 | 0,50 | 0,05 / 0,25 |
| Sonnet 5.5 | 2 | 2,50 | 0,10 | 10 | 1 / 5 |
| Opus 5.5 | 4 | 5 | 0,20 | 20 | 2 / 10 |
| Fable 5.2 | 8 | 10 | 0,20 | 40 | 4 / 20 |

- Cache-Lesen kostet bei Sonnet 5.5 und Opus 5.5 das 0,05-fache des Input-Preises (Fußnote der Seite), bei anderen Modellen das 0,1-fache.
- Modelle ab Claude 4.7 nutzen einen neuen Tokenizer mit „approximately 30% more tokens for the same text“; für die 1M-Kontextfenster von Claude 4.6 und neuer „standard pricing“ ohne Langkontext-Aufschlag; Haiku 5.5 hat über 100.000 Prompt-Token höhere Preise.
- Web-Suche: „$10 USD per 1,000 searches“ plus Token; Web-Fetch ohne Zusatzkosten. Batch-API: 50 % Rabatt, aber nur für einzelne Nachrichten-Anfragen (nicht für den Agenten-Lauf des Agent SDK); Managed Agents haben „no batch mode“ und kosten zusätzlich 0,08 USD je Sitzungsstunde.
- Der Prompt-Beispiel der Action-Doku nennt `--model claude-opus-5-5`; welches Modell Claude Code ohne Angabe wählt: **nicht geprüft** (Verweis der Doku auf „model-config“).

## 6. Kostenschätzung für einen Lauf [Rechnung]

**Kein Wert ist gemessen.** Token-Zählung per API-Aufruf (`count_tokens`) hätte Repository-Inhalt an einen Dienst geschickt und wurde nicht gemacht. Alle Zahlen folgen aus den Annahmen unten; bei anderen Annahmen skalieren sie ungefähr linear.

**Gemessene Eingangsgrößen (Repository, 18.11.2026):**
- `data/steckbriefe.json`: 154 Bausteine, 517.962 Zeichen (JSON), im Mittel 3.363 Zeichen, Median 3.198, größter 7.135.
- `CLAUDE.md` + `docs/datenmodell.md` + `GLOSSARY.md`: 16.288 Zeichen.

**Annahmen:**
1. **2,5 Zeichen je Token** für deutschen JSON-Text mit dem neuen Tokenizer (Spanne 2,0 bis 3,5 denkbar). Ein Baustein ≈ **1.350 Token**; alle 154 ≈ 207.000 Token. Nur-geänderte-Bausteine-Zuschnitt: der Agent bekommt nie alle 154.
2. Je geändertem Baustein: Quelle (Roadmap-Eintrag, Release Note) 3.000 Token, bis zu 5 verwandte Steckbriefe für die Zuordnung (≈ 6.700 Token), Arbeitsnotizen: zusammen **12.000 Token neuer Kontext** je Baustein.
3. Fester Anteil je Lauf (Systemanweisungen des Agenten, Werkzeugbeschreibungen, `CLAUDE.md`, Datenmodell): **20.000 Token**. Die Größe der Claude-Code-Systemanweisung habe ich **nicht gefunden**; 20.000 ist eine Annahme.
4. **8 Gesprächsrunden** je Baustein, Output (inklusive Denken) **3.500 Token** je Baustein.
5. Eine frische Sitzung je Baustein (Kontext wächst von 20.000 auf 32.000 Token), Prompt-Caching an: neuer Kontext wird einmal zum Cache-Schreibpreis (5 min) gerechnet, jede Wiederholung zum Cache-Lesepreis.
6. Vergleichsfall „Einzelaufruf ohne Agentenschleife“ (Messages-API, nur Lesen, Ergebnis als Text): 19.000 Token Input (8.000 feste + Baustein + Quelle + 5 verwandte), 3.500 Output, ohne Caching.

**Ergebnis je Baustein (USD):**

| Modell | Agent mit Cache | Agent ohne Cache | Einzelaufruf | Einzelaufruf per Batch |
|---|---|---|---|---|
| Haiku 5.5 | 0,01 | 0,02 | 0,004 | 0,002 |
| Sonnet 5.5 | 0,13 | 0,46 | 0,07 | 0,04 |
| Opus 5.5 | 0,27 | 0,93 | 0,15 | 0,07 |

**Je Lauf (USD), Agent mit Cache:**

| Geänderte Bausteine | Sonnet 5.5 | Opus 5.5 | Einzelaufruf Sonnet 5.5 |
|---|---|---|---|
| 3 (ruhige Woche) | 0,40 | 0,80 | 0,22 |
| 10 (typisch?) | 1,33 | 2,66 | 0,73 |
| 30 (viele Release Notes) | 4,00 | 7,99 | 2,19 |
| 154 (Volllauf, nur zum Vergleich) | 20,51 | 41,03 | 11,26 |

- **Jahr:** 52 Läufe mit je 10 Bausteinen: Sonnet 5.5 ≈ **69 USD**, Opus 5.5 ≈ **139 USD**. Ohne Cache rund das 3,5-fache.
- Die Zahl „geänderte Bausteine pro Woche“ ist **unbekannt**: sie hängt an der Schnittstelle des deterministischen Teils und am Takt der SAP-Quellen. Das Ticket nennt keine Zahl; 3, 10 und 30 sind Spannen zum Rechnen, keine Beobachtung.
- **Zusatzkosten, falls der Agent selbst sucht:** 10 Websuchen je Lauf ≈ 0,10 USD, im Jahr 5,20 USD. Das Ticket sieht den Abruf im deterministischen Teil vor; dann entfällt der Posten.
- **Abo-Wege (Action mit Abo-Token, Cloud-Aufgabe):** kein Dollar-Betrag je Lauf; der Verbrauch geht vom Kontingent ab und lässt sich nicht in Token umrechnen (nicht gefunden).
- **Empfindlichkeit:** Die feste Last (Annahme 3) ist die unsicherste Größe. Läge sie bei 40.000 statt 20.000 Token, stiegen die Kosten je Baustein um rund 0,07 USD (Sonnet 5.5) bzw. 0,13 USD (Opus 5.5), also um die Hälfte; die Größenordnung bliebe. Die Annahme zu Gesprächsrunden und Output (4) wirkt ähnlich stark.

## 7. Einordnung

Keine Entscheidung, sondern eine Lesart der Befunde **[Schluss]**:

1. **Kostenseite ist klein.** Selbst im pessimistischen Fall (30 Bausteine, Opus 5.5, Agent) bleibt ein Lauf unter 10 USD, im Normalfall unter 3 USD. Das Argument für den Abo-Weg ist deshalb weniger der Preis als die Bequemlichkeit (kein API-Konto) und das Risiko, dass er Nikos eigenes Kontingent belastet.
2. **Eine Aufteilung nach Rechten ist leichter zu verantworten als ein allmächtiger Agent.** In allen drei Orten lässt sich der Agent auf „Dateien unter `data/` lesen und ändern“ beschränken, und ein Skript außerhalb des Agenten legt den PR an. Das senkt das Risiko durch fremden Text (Abschnitt 2) und umgeht die offene PR-Rechte-Frage der Action.
3. **Wer die GitHub Action wählt**, braucht: API-Key als Secret (oder geklärte Bedingungen für den Abo-Token), PR-Einstellung im Repository, eine Entscheidung zum Token (damit CI im PR läuft), `--max-turns`, Timeout, und gegen die 60-Tage-Abschaltung eine Aktivität im Repository.
4. **Wer die Cloud-Aufgabe wählt**, bekommt die kleinste Eigenleistung, nimmt aber Research-Preview-Status, Bindung an ein Konto, geteiltes Kontingent und einen unklaren Weg für den selbst angelegten PR in Kauf.
5. **Der Server-Weg** lohnt, wenn der deterministische Teil ohnehin dort liegen soll (etwa Abruf mit eigener Netzkonfiguration, Zustand zwischen den Läufen). Als Zeitgeber ist Coolify einfach; der Aufwand liegt in Image, Token und Überwachung.

## Offen / nicht gefunden

- Ob der Abo-Token im Eigenbetrieb (Action, Server) von den Consumer-Bedingungen „explicitly permitted“ ist: **kein Satz gefunden**; Usage Policy nicht gelesen. Welchen Plan Niko hat: unbekannt.
- Wie ein Agent in der Action einen PR **unbeaufsichtigt** anlegt (Rechte der Claude-App gegenüber dem Workflow-Token, `gh pr create` in `allowedTools`): in den abgerufenen Seiten nicht belegt, nicht getestet.
- Ob die Action-Läufe als Repository-Aktivität gegen die 60-Tage-Abschaltung zählen: nicht belegt.
- Ob GitHub-gehostete Runner beliebige SAP-Domains erreichen: nicht geprüft.
- Wie die Cloud-Aufgabe den PR anlegt (Proxy lehnt `gh`-GraphQL ab): nicht ausprobiert.
- Zeitlimit eines ganzen Cloud-Laufs und Token-Verbrauch gegen das Kontingent: nicht gefunden.
- Größe der Claude-Code-Systemanweisung (Annahme 3) und Standardmodell von Claude Code: nicht gefunden.
- Alle Token-Zahlen: nicht gemessen, nur aus Zeichenzahlen geschätzt (Annahme 1).
- Hetzner-Kosten und Coolify-Cron-Syntax-Seite: nicht abgerufen.
- Verwaltete Agenten mit Zeitplan (Managed Agents, 0,08 USD je Sitzungsstunde plus Token) sind eine vierte Möglichkeit, die das Ticket nicht nennt; Funktionsumfang nicht untersucht.
