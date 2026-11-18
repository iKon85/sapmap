# Recherche: Clerk mit den Microsoft-365-Konten des Teams – Anmeldewege und Kosten (Stand 18.11.2026)

Beantwortet Issue #20. Quellen sind mit **[P]** (primär: Herstellerdoku von Clerk bzw. Microsoft, Preisseite, npm-Registry, GitHub-Releases, eigene Issues) oder **[S]** (sekundär) markiert. Alle Seiten wurden am **18.11.2026** abgerufen. Die Clerk-Doku trägt auf jeder Seite „Last updated on Nov 18, 2026“; das ist vermutlich das Build-Datum, nicht das Änderungsdatum der Seite. **Nichts davon wurde gegen eine echte Clerk-Instanz oder einen echten Entra-Tenant getestet** – es ist reine Dokumentationslage.

## Takeaway

- **Zwei Wege, ein Haken:** Der Social-Login „Microsoft“ ist im Free-Plan nutzbar, kann aber nur den Zielgruppen-Wert `common` (jedes Arbeits-, Schul- oder private Microsoft-Konto). Die Begrenzung aufs Team muss deshalb Clerk übernehmen. Enterprise-SSO (EASIE, SAML, eigenes OIDC) bindet an eine E-Mail-Domain und braucht den Pro-Plan.
- **Beschränkung:** Entweder **Invite-only** (im Doku-Text ohne Planhinweis) **oder** **Allowlist** nach Domain (nur im Modus „Open“, für Produktion laut Doku kostenpflichtig). Beides gleichzeitig geht nicht. Eine Tenant-Beschränkung gibt es beim Social-Login nicht; sie geht nur über SAML (Einzel-Tenant) oder ein eigenes OIDC.
- **Kosten bei 10–50 Nutzern:** Free-Plan 0 $. Pro 25 $/Monat (20 $/Monat bei Jahreszahlung), darin 1 SSO-Verbindung; jede weitere 75 $/Monat. Die Nutzerzahl spielt keine Rolle (50.000 aktive Nutzer pro App inklusive). Entscheidend ist die Anzahl **Domains bzw. Tenants** im Team.
- **Integration:** Offizielles SDK `@clerk/tanstack-react-start` 1.7.15, aktiv gepflegt. Es braucht eine Server-Laufzeit (Middleware). Ein MCP-Server-Leitfaden existiert nur für Next.js und Express, nicht für TanStack Start; die Bausteine für OAuth-Token-Prüfung gibt es aber auch dort.
- **Wiederverwendung:** Im Repo `iKon85/activate` steht **kein Clerk-Code und keine Clerk-Konfiguration**. Die Entscheidung („eigene Clerk-Anwendung, Invite-only, CIMD“) steht nur in Issue 9. Mehrere Anwendungen unter einem Plan sind laut Preisseite möglich.

## 1. Anmeldewege mit Microsoft-Konten

| Weg | Plan | Was im Tenant nötig ist | Wer darf sich anmelden | Quelle |
|---|---|---|---|---|
| **Social „Microsoft“** | Free (max. 3 Social-Verbindungen) | App-Registrierung in Entra, Redirect-URI von Clerk, Client-Secret; Haken bei ID-Tokens | alle Konten der Zielgruppe `common`; Einschränkung nur über Clerk | siehe unten |
| **Enterprise-SSO EASIE (OIDC)** | Pro | wie Social; zusätzlich Domain in Clerk | E-Mail-Domain; Mehr-Tenant-Anbieter | siehe unten |
| **Enterprise-SSO SAML** | Pro | Enterprise-App im Tenant des Kunden, Zuweisung von Nutzern/Gruppen, Metadaten-URL | Einzel-Tenant, nur zugewiesene Nutzer | siehe unten |
| **Eigenes OIDC** (Custom Provider) | Pro | App-Registrierung, Discovery-Endpoint, Client-ID/-Secret | je nach Endpoint (auch ein einzelner Tenant möglich) | siehe unten |

**Social „Microsoft“.** [P] https://clerk.com/docs/guides/configure/auth-strategies/social-connections/microsoft (18.11.2026)
- Entwicklungsinstanz: vorkonfigurierte, geteilte Zugangsdaten, keine Einrichtung nötig. **Produktion braucht eigene Zugangsdaten.**
- Produktion: In Entra eine App registrieren mit „Accounts in any organizational directory (Any Microsoft Entra ID tenant – Multitenant) and personal Microsoft accounts“, Web-Redirect-URI aus dem Clerk-Dashboard, Client-Secret anlegen, unter „Authentication“ die Haken für Access-Token und ID-Token setzen, Werte in Clerk eintragen. Ein Azure-Konto wird vorausgesetzt.
- **Das Client-Secret läuft ab:** Standard 6 Monate, maximal 24 Monate. Danach stoppt die Anmeldung, bis ein neues Secret eingetragen ist. Das ist eine wiederkehrende Betriebsaufgabe.
- **nOAuth:** Bei Entra-Apps kann eine gefälschte E-Mail-Adresse zur Kontoübernahme führen. Clerk prüft strenger; zusätzlich empfiehlt die Doku den optionalen Claim `xms_edov` (Konfiguration im Manifest, mit Hinweis auf eine harmlose Portal-Warnung).
- **Einschränkung laut Doku:** Clerk unterstützt aktuell nur die Zielgruppe `common`. Support für `organizations`, `consumers` und einen bestimmten Tenant „in einer kommenden Version“; Termin nicht genannt. Nur Secret-Zugangsdaten, keine Zertifikate.

**EASIE.** [P] https://clerk.com/docs/guides/configure/auth-strategies/enterprise-connections/overview und …/easie/microsoft (18.11.2026)
- Entra-Setup identisch zum Social-Login (gleiche App-Registrierung, wird wiederverwendet). In Clerk kommt die **E-Mail-Domain** der erlaubten Nutzer dazu (ein Eingabefeld „Domain“; mehrere Domains pro Verbindung: nicht gefunden).
- Clerk weist selbst darauf hin: EASIE hängt an einem Mehr-Tenant-Anbieter und erhöht das Risiko, dass ein Nutzer aus einem fremden Tenant Zugriff bekommt; wer Einzel-Tenant braucht, soll SAML nehmen.
- **Automatisches Entziehen:** Wird ein Nutzer in Entra gelöscht, widerruft Clerk dessen Sitzungen (Prüfung mit bis zu 10 Minuten Verzögerung). Das ist ein echter Vorteil gegenüber dem Social-Login.

**SAML.** [P] https://clerk.com/docs/guides/configure/auth-strategies/enterprise-connections/saml/azure (18.11.2026)
- Clerk ist Service Provider. Der **Tenant-Admin** legt eine Enterprise-App (nicht aus der Galerie) an, weist Nutzer oder Gruppen zu, trägt Reply-URL und Entity-ID von Clerk ein, prüft die Attribut-Claims (E-Mail Pflicht) und schickt die „App Federation Metadata URL“. Das ist der aufwendigste Weg und braucht einen Admin im Tenant.
- Nach dem Aktivieren werden **alle Nutzer mit E-Mail-Adresse dieser Domain zum IdP umgeleitet**; bei Fehlkonfiguration können sich bestehende Nutzer nicht mehr anmelden. Die Domain muss exakt passen, Subdomains nur per Schalter (setzt eine eTLD+1-Domain voraus). [P] …/enterprise-connections/overview

**Eigenes OIDC.** [P] https://clerk.com/docs/guides/configure/auth-strategies/enterprise-connections/oidc/custom-provider (18.11.2026); Microsoft: https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc (18.11.2026)
- Clerk verlangt Discovery-Endpoint, Client-ID, Client-Secret. Microsoft nennt für den Endpoint die Form `https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration`; als `{tenant}` ist neben `common` auch eine Tenant-ID oder Domain erlaubt (dann nur Nutzer dieses Tenants).
- Clerk warnt: Entra liefert den Claim `email_verified` nicht immer. Notlösung „Standardwert True“ nur bei vollem Vertrauen in den Anbieter (nOAuth-Risiko).
- Ob die Kombination Clerk-Custom-OIDC + tenant-spezifischer Entra-Endpoint offiziell beschrieben oder getestet ist: **nicht gefunden.** Clerk beschreibt Entra nur über SAML und EASIE.

**Zustimmung im Tenant (Consent).** [P] https://learn.microsoft.com/en-us/entra/identity-platform/application-consent-experience (18.11.2026)
- Eine App aus einem **fremden Tenant** braucht je nach Richtlinie Zustimmung des Nutzers oder eines Admins; ist Nutzerzustimmung im Tenant deaktiviert oder die Berechtigung admin-pflichtig, müssen Nutzer einen Admin fragen. Ob das für die Berechtigungen `openid`/`profile`/`email` in den Tenants des Teams gilt: **nicht gefunden**, hängt von den Richtlinien der jeweiligen Tenants ab.
- Mit „Assignment required“ kann der Tenant-Admin eine Entra-App auf zugewiesene Nutzer beschränken; dann ist Nutzerzustimmung nicht mehr möglich, Admin-Zustimmung nötig. [P] https://learn.microsoft.com/en-us/entra/identity-platform/howto-restrict-your-app-to-a-set-of-users

## 2. Beschränkung auf das Team

[P] https://clerk.com/docs/guides/secure/restricting-access (18.11.2026) und https://clerk.com/docs/guides/users/inviting

| Mittel | Wirkung | Haken |
|---|---|---|
| **Invite-only** (Zugriffsmodus) | Nur Nutzer mit Einladung (Dashboard oder `createInvitation()`), per Enterprise-Verbindung oder manuell angelegt. Die Anmeldemaske blendet „Registrieren“ aus. Einladungen laufen nach einem Monat ab. | Im Doku-Text kein Planhinweis, und die Preistabelle führt es nicht als Funktion auf: ob im Free-Plan produktiv nutzbar, ist **nicht ausdrücklich bestätigt**. Ob sich ein Eingeladener per „Microsoft“-Button statt per Einladungslink-Formular registrieren kann (und ob die E-Mail übereinstimmen muss): **nicht gefunden**, vor der Entscheidung testen. Einladungen per API: 100 Aufrufe/Stunde. |
| **Allowlist** (E-Mail-Domain oder Adresse) | Nur passende Kennungen dürfen sich registrieren; Nutzer können die Kennung danach nicht ändern, um sie zu umgehen. | Gilt **nur im Modus „Open“** und ist dort der Ersatz für Invite-only (nicht kombinierbar). Doku: „requires a paid plan for production“. Eine leere Allowlist sperrt alle Registrierungen. Gilt bei neueren Anwendungen für Registrierungen, nicht Anmeldungen. |
| **Enterprise-Verbindung mit Domain** | Nur Nutzer der Domain; bei SAML zusätzlich nur die im Tenant zugewiesenen. Zählt im Invite-only-Modus als Zugangsweg. | Pro-Plan; eine Verbindung pro Domain bzw. Tenant (siehe Kosten). |
| **Tenant-Beschränkung beim Social-Login** | – | Nicht möglich (nur `common`, siehe oben). |
| **Wartelisten-Modus** | Anfragen sammeln, Admin gibt frei. | Alternative zu Invite-only; Free-Plan laut Preistabelle enthalten. |

Folgerung: Für „nur Niko plus benannte Kollegen“ (so beschließt es Activate #9) reicht Invite-only. Wer neue Kollegen einer Firma automatisch zulassen will, braucht Allowlist oder eine Enterprise-Verbindung (beides Pro).

## 3. Kosten (bei etwa 10–50 Nutzern)

[P] https://clerk.com/pricing (18.11.2026); Preise in US-Dollar, Steuern nicht ausgewiesen.

| Posten | Free („Hobby“) | Pro | Business |
|---|---|---|---|
| Grundpreis | 0 $ | 25 $/Monat; 20 $/Monat bei Jahreszahlung | 300 $/Monat; 250 $/Monat bei Jahreszahlung |
| Aktive Nutzer (MRU) | 50.000 pro App | 50.000 pro App inklusive, danach ab 0,02 $/Monat je Nutzer | wie Pro |
| Social-Verbindungen | höchstens 3 | unbegrenzt | unbegrenzt |
| SSO-Verbindungen (SAML, OIDC, EASIE) | nicht enthalten | 1 pro App inklusive; 2–15: 75 $/Monat je Verbindung; 16–100: 60 $ | wie Pro |
| Allowlist/Blocklist | Blocklist nicht enthalten; Allowlist laut Zugriffsdoku für Produktion kostenpflichtig | enthalten | enthalten |
| Sitzungsdauer | fest 7 Tage | frei einstellbar | frei einstellbar |
| Clerk-Branding entfernen, MFA | nein | ja | ja |
| Dashboard-Plätze | 3 | 3 | 10 |
| DPA/DSGVO | „Included“ (alle Pläne) | wie Free | wie Free |

- „MRU“ zählt einen Nutzer erst, wenn er **24 Stunden nach der Registrierung wiederkommt**. 10–50 Nutzer liegen weit unter jeder Grenze; die Nutzerzahl treibt hier keine Kosten.
- **Rechenbeispiele** (aus der Tabelle abgeleitet): Social-Login + Invite-only: 0 $. Pro + EASIE für eine Domain: 20–25 $/Monat. Pro + SAML/EASIE für drei Tenants: 20–25 $ + 2 × 75 $ = 170–175 $/Monat.
- Entwicklungsinstanzen: SSO-Verbindungen sind dort immer kostenlos (höchstens 25), laut Doku „all features free in development“. [P] …/enterprise-connections/overview
- Nicht geprüft: Datenverarbeitung in der EU (Standort der Clerk-Server), Ablauf der Kündigung/Downgrade-Regeln.

## 4. Wiederverwendung aus Activate

Gelesen per `gh`: Issues 3, 8, 9, 18, 20 des Repos `iKon85/activate`, die Dateien im Repo und alle acht Remote-Branches (`git grep -i clerk`: **keine Treffer**; GitHub-Codesuche ebenfalls leer). Der Inhalt des Repos besteht aus Recherche-Dokumenten, Glossar und Abzugsskripten.

- **Was dokumentiert ist** [P, eigene Entscheidung, Issue 9, 25.10.2026]: „OAuth über Clerk mit CIMD, **eigene Clerk-Anwendung (nicht die des KI-Kompass)**, Invite-only. Ein Weg für claude.ai, Desktop und Claude Code, kein statischer Token. Zuerst nur Niko, später lädt er benannte Kollegen ein; wer darf, prüft eine einzige Stelle im Code.“ Domain `activate.iverra.de`, Clerk über CNAME mit Präfix. Der KI-Kompass (`kompass.iverra.de/mcp`) dient dort als Vorbild (TanStack Start, Clerk-OAuth mit CIMD). Dessen Repo wurde **nicht gelesen** (nicht Teil dieses Auftrags).
- **Was nicht dokumentiert ist:** ob die Clerk-Anwendung für Activate schon angelegt ist, welcher Plan, welche Anmeldewege (Microsoft ja/nein). Issue 3 nennt Clerk nicht; es beschreibt den Standardweg als „OAuth mit externem IdP (CIMD und/oder DCR)“.
- **Eine Instanz für beide Apps?** Technisch gibt es drei Wege:
  1. **Zwei Clerk-Anwendungen unter einem Plan.** Die Preisseite sagt: „Every plan supports unlimited applications“, Add-ons gelten für alle Anwendungen, MRU-Grenzen und die eine inklusive SSO-Verbindung gelten **je Anwendung**. Zusätzliche Kosten für die zweite App: laut Preisseite keine. Eigene Nutzerlisten, eigene Entra-App-Zugangsdaten (die Redirect-URI ist je Clerk-Instanz verschieden; ob eine Entra-App mehrere Redirect-URIs aufnimmt, wurde hier nicht nachgelesen).
  2. **Eine Anwendung, Subdomains.** Gemeinsame Sitzungen über Subdomains einer Domain funktionieren laut Doku „by default“. [P] https://clerk.com/docs/guides/dashboard/dns-domains/satellite-domains (Hinweiskasten). Die Domain für sapmap ist in Issue 13 noch offen.
  3. **Satellite-Domains** für verschiedene Domains: 10 $/Monat je Satellit (Pro); Anmeldung läuft nur auf der Hauptdomain; die Doku nennt TanStack Start als unterstützt. Dieselbe Doku stuft das als „advanced“ ein.
  - Zu klären ist, ob dieselben Personen in beiden Apps zugelassen sein sollen. Bei getrennten Nutzerkreisen spricht die Invite-only-Liste für getrennte Anwendungen.
- **OAuth für MCP (Issue 17):** Clerk unterstützt MCP über **Client ID Metadata Documents (CIMD)**, Dynamic Client Registration, Zustimmungsseite und SDK-Unterstützung. [P] https://clerk.com/docs/guides/ai/mcp/overview. CIMD ist laut Doku **standardmäßig aus** („Publish CIMD support“); eingeschaltet, dürfen ohne Vorab-Registrierung alle kompatiblen Clients verbinden – einschränkbar auf „nur vorregistrierte Clients“. Clerk erzwingt PKCE (S256) und zeigt immer die Zustimmungsseite. [P] https://clerk.com/docs/guides/configure/auth-strategies/oauth/client-id-metadata-documents. Wer sich am MCP anmelden darf, bestimmen dann dieselben Zugriffsregeln der Anwendung (Invite-only usw.): Das ist eine Folgerung, kein dokumentierter Satz.

## 5. Integration mit TanStack Start (Server-Betrieb)

- **SDK:** `@clerk/tanstack-react-start`, npm `latest` **1.7.15**, veröffentlicht am 18.11.2026 (GitHub-Release 17:01 UTC; Vorgänger 1.7.14 am 17.11.2026). Peer-Abhängigkeiten: `@tanstack/react-start ^1.168.10`, `@tanstack/react-router ^1.170.7`, React 18 oder 19; Node ≥ 20.9.0. [P] `npm view` und https://github.com/clerk/javascript/releases (beide 18.11.2026). Das passt zu den in Issue 7 gebauten Versionen (react-start 1.169.4, react-router 1.170.46).
- **Reife:** Es ist ein erstklassiges SDK mit eigenem Quickstart und Referenz (`auth()`, `clerkMiddleware()`, `clerkClient`, React-Hooks). Offene Issues im Clerk-Repo mit „tanstack“ im Text: 3 Treffer, keiner Start-spezifisch (Stichprobe per GitHub-Suche, 18.11.2026). Ein „stable“-Siegel wie bei Start 1.0 nennt die Doku nicht. [P] https://clerk.com/docs/reference/tanstack-react-start/overview
- **Einrichtung** [P] https://clerk.com/docs/tanstack-react-start/getting-started/quickstart: Paket installieren; Schlüssel `VITE_CLERK_PUBLISHABLE_KEY` und `CLERK_SECRET_KEY`; Datei `src/start.ts` mit `clerkMiddleware()`; `<ClerkProvider>` in der Wurzelroute; Routen schützen per `createServerFn` + `auth()` in `beforeLoad`. **Achtung:** Mit einer eigenen `src/start.ts` fügt TanStack Start seine Standard-CSRF-Middleware nicht mehr hinzu; die Doku trägt sie ausdrücklich nach. **`clerkMiddleware()` schützt keine Routen von selbst**, alle sind zunächst öffentlich.
- **Folge für den Prerender-Plan (Folgerung, nicht getestet):** Seiten, die Clerk schützen soll, brauchen den Server (Middleware, `auth()`); ein reines nginx mit vorgerenderten Dateien kann keinen Zugriff prüfen. Die öffentliche Landkarte kann vorgerendert bleiben, die geschützten Bereiche (Suche, MCP) laufen auf dem Server. Wie sich `<ClerkProvider>` mit dem Prerender-Pfad verträgt (Hydration, Issue-7-Fallstricke): **nicht gefunden, nicht getestet.**
- **OAuth-Tokens im Server:** `auth({ acceptsToken: 'oauth_token' })` ist für TanStack-Start-Serverrouten dokumentiert (Antwort 401 bei ungültigem Token; liefert `userId` und `scopes`). [P] clerk-docs über context7, Quelle https://github.com/clerk/clerk-docs/blob/main/docs/guides/development/verifying-oauth-access-tokens.tanstack-react-start.mdx
- **Lücken:** Der MCP-Leitfaden („Build and authenticate an MCP server“) gibt es **nur für Next.js und Express**. [P] https://clerk.com/docs/guides/ai/mcp/build-mcp-server. Dort nutzt er `authenticateRequest(..., { audience })` aus `@clerk/backend` und die Hilfen `protectedResourceHandlerClerk`/`authServerMetadataHandlerClerk` aus `@clerk/mcp-tools/next`; Doku-Satz: „Always pass `audience`; without it, the audience isn't checked.“ Ob das TanStack-`auth()` einen `audience`-Parameter kennt und ob `@clerk/mcp-tools` eine TanStack-Variante hat: **nicht gefunden.** Das ist der wichtigste Punkt für einen Spike (siehe unten).

## 6. Empfehlung und was Niko klären muss

Reihenfolge nach Aufwand (Entscheidung liegt bei Niko; Fakten oben):

1. **Start: Social „Microsoft“ + Invite-only** (0 $): Einrichtung einmalig in einem Entra-Tenant, den Niko steuert; Einladungen für Kollegen. Offen: Test, ob Invite-only im Free-Plan produktiv geht und ob ein Eingeladener per Microsoft-Button hineinkommt.
2. **Wenn automatische Aufnahme nach Domain oder automatisches Entziehen gebraucht wird: Pro + EASIE** (20–25 $/Monat, 1 Domain). Wenn Einzel-Tenant und Zuweisung durch einen Admin nötig sind: **SAML** (Tenant-Admin nötig, 75 $ je weiterer Tenant).
3. Ein eigenes OIDC mit tenant-spezifischem Endpoint ist denkbar, aber bei Clerk für Entra nicht belegt.

Fragen an Niko (aus dem Ticket: „ob und wie Entra ID genutzt wird, klärt Niko“):
- Sind alle Kollegen im **selben** Tenant/derselben E-Mail-Domain? (Treibt die Kosten bei SSO.)
- Darf Niko eine **App-Registrierung** in einem Tenant anlegen, und wer verwaltet das Secret (Ablauf höchstens 24 Monate)?
- Erlauben die Tenants der Kollegen die Nutzerzustimmung für fremde Apps?
- Soll sapmap denselben Nutzerkreis haben wie Activate (eine oder zwei Clerk-Anwendungen)?

**Spike-Vorschlag** (klein, vor der Spec): Clerk-Entwicklungsinstanz mit Microsoft-Social, ein TanStack-Start-Projekt mit `clerkMiddleware()`, eine `/mcp`-Serverroute mit `auth({ acceptsToken: 'oauth_token' })` und Prüfung der Audience; Test mit claude.ai oder Claude Code. Beantwortet die drei offenen Punkte (Invite-only + Microsoft-Button, Audience in TanStack, Prerender + `<ClerkProvider>`).

## Offen / nicht gefunden

- Datum der Doku-Änderungen: Clerk zeigt auf allen Seiten dasselbe Datum (18.11.2026); echte Änderungsdaten: nicht gefunden.
- Termin für Tenant-spezifische Zielgruppen beim Social-Login („upcoming version“): nicht genannt.
- Planbindung von Invite-only: kein ausdrücklicher Satz gefunden.
- Verhalten einer eingeladenen Person beim Anmelden per Microsoft-Button: nicht gefunden.
- Mehrere Domains in einer EASIE- oder SAML-Verbindung: nicht gefunden.
- Offizielle Beschreibung von Entra als eigenes OIDC bei Clerk: nicht gefunden.
- TanStack-Variante von `@clerk/mcp-tools` und `audience`-Option in `auth()`: nicht gefunden.
- Mehrere Redirect-URIs in einer Entra-App-Registrierung für mehrere Clerk-Instanzen: hier nicht nachgelesen.
- Datenstandort/EU-Region von Clerk: nicht geprüft.
- Clerk-Konfiguration in Activate (Plan, Anmeldewege, Instanz): nicht dokumentiert; Repo `KI-Kompass` nicht gelesen.
