# Recherche: Wie kommen wir maschinell an SAP-Roadmaps und Release Notes? (Stand 18.11.2026)

Beantwortet Issue #19 (Kind der Karte #1). Quellen sind mit **[P]** (primär: SAP selbst, also Nutzungsbedingungen, robots.txt, offizielle Doku, SAP-eigene GitHub-Repos) oder **[S]** (sekundär: Community-Posts Dritter, Suchzusammenfassungen, Partner-Blogs) markiert. **[Beobachtung]** heißt: in dieser Recherche selbst abgerufen und gesehen. **[Activate]** heißt: Befund aus dem privaten Schwesterrepo `iKon85/activate`, von dort übernommen, nicht hier nachgemessen. Alle Abrufe: 18.11.2026, sofern nicht anders genannt.

## Takeaway

- **Es gibt keinen erlaubten, öffentlichen, maschinellen Weg zu Roadmap-Einträgen.** Der Road Map Explorer (roadmaps.sap.com) leitet am 18.11.2026 ohne Anmeldung auf den SAP-Login um. Eine API, einen Feed oder einen dokumentierten Export haben wir nicht gefunden.
- **Die Nutzungsbedingungen sind der Engpass, nicht die Technik.** Die „Terms of Use for SAP Websites“ (Stand 26.02.2026) verbieten automatisierten Abruf („bots, scrapers, … Model Context Protocol (MCP), agent-frameworks“), Zwischenspeichern und Weitergabe, auch an KI-Anbieter. help.sap.com sperrt per robots.txt alle Clients, die nicht namentlich freigegeben sind. Ein wöchentlicher unbeaufsichtigter Abruf von help.sap.com oder roadmaps.sap.com wäre ein Verstoß, solange SAP nichts ausdrücklich erlaubt.
- **Der einzige ausdrücklich erlaubte maschinenlesbare Weg sind die SAP-Docs-Repos auf GitHub (CC-BY-4.0).** Sie enthalten aber die Handbücher, nicht die „What's New“-Einträge: In `btp-integration-suite` ist die „What's New“-Seite nur ein Verweis auf den What's New Viewer. Der Weg taugt höchstens als Änderungssignal („Doku-Seite zu Produkt X hat sich geändert“) für etwa ein Dutzend unserer Bausteine.
- **OData mit S-User-Session** (wie in `activate` für den Simplification Item Catalog) funktioniert technisch, ist aber an Nikos Person gebunden, nicht unbeaufsichtigt belegt und durch die me.sap.com-Bedingungen auf den eigenen Geschäftszweck beschränkt. Für den Road Map Explorer haben wir keinen Endpunkt gefunden und keine Session eingesetzt.
- **Empfehlung:** Den wöchentlichen Lauf nicht auf SAP-Websites bauen. Brauchbar sind (a) die E-Mail-Abonnements des What's New Viewers (SAP-seitig vorgesehen, Mensch im Kreislauf), (b) ein Änderungssignal über die GitHub-API der SAP-Docs-Repos, (c) ein manueller, von Niko angestoßener Abzug mit Session für die Karte, ohne Rohdaten im Repo. Vor jedem Abruf mit Session ist die Zweckfrage (Abschnitt 5) zu klären. Details in Abschnitt 7.

## Was ich selbst abgerufen habe (Offenlegung)

Die Bedingungen verbieten Bots und das Fälschen von User-Agent-Kennungen. Das gilt auch für diese Recherche, deshalb hier genau, was gelaufen ist:

- `help.sap.com/robots.txt`, `roadmaps.sap.com/robots.txt`, `roadmaps.sap.com/` (einmal per HTTP, einmal per Browser bis zur Login-Seite), `sap.com/about/legal/terms-of-use.html`, `me.sap.com/assets/legal/terms-of-use.html`. Alle außer dem letzten liefen mit der Chrome-Kennung bzw. dem Stealth-Browser des Abrufwerkzeugs. Das ist nach Abschnitt 4 der Bedingungen („Spoofing user agent strings … not permitted“) fragwürdig. Der Abruf der me.sap.com-Bedingungen lief ohne Kennung. Weitere Abrufe an SAP-Websites habe ich unterlassen.
- **Nicht abgerufen:** Seiten und Hintergrund-Endpunkte von help.sap.com (What's New Viewer, Release Notes), weil robots.txt sie für uns sperrt. Aussagen dazu stammen aus Suchtreffern [S] oder aus SAP-eigenen Repos [P]. Der Road Map Explorer wurde nicht hinter dem Login angesehen; es wurde keine Anmeldung versucht und keine Session verwendet.
- GitHub-API für `SAP-docs` (öffentlich, ohne Anmeldung): Repo-Liste, Dateibäume, Lizenzdatei, Commit-Datum einer Datei.

## 1. Road Map Explorer (roadmaps.sap.com): Roadmap-Einträge je Produkt

| Befund | Beleg |
|---|---|
| Aufruf von `roadmaps.sap.com/` ohne Anmeldung liefert eine Weiterleitung auf den OAuth-Login des Dienstes (`…authentication.eu10.hana.ondemand.com/oauth/authorize`, Client `sb-roadmaps-prod…`) und danach auf `accounts.sap.com` („Sign In“, Feld „Email, User ID or Login Name“). Auf der Seite war kein Inhalt ohne Anmeldung zu sehen. | [Beobachtung] https://roadmaps.sap.com/ , 18.11.2026 |
| `roadmaps.sap.com/robots.txt` liefert Status 200 mit leerem Inhalt. Ob das „alles erlaubt“ bedeutet oder ein Platzhalter ist: nicht geklärt. Die Bedingungen verlangen Einhaltung von robots.txt, Meta-Direktiven und X-Robots-Tag; die Header wurden nicht geprüft. | [Beobachtung] https://roadmaps.sap.com/robots.txt , 18.11.2026 |
| Ältere Quellen sagen, man könne sich mit S-User anmelden oder kostenlos ein Konto auf roadmaps.sap.com anlegen. Der heutige Login-Zwang ist damit nicht im Widerspruch; ob das freie Konto noch möglich ist, ist nicht geprüft. | [S] https://community.sap.com/t5/blog-posts-about-sap-websites/use-the-sap-road-map-explorer-in-5-steps/ba-p/13433198 (Suchtreffer, nicht selbst gelesen) |
| Export: Der Road Map Explorer hat eine Schaltfläche, die eine Excel-Datei mit allen Innovationen der zusammengestellten Roadmap erzeugt. PDF-Roadmaps wurden mit der neuen Website eingestellt. Spalten der Excel-Datei: nicht gefunden. | [S] Suchtreffer zu https://community.sap.com/t5/blog-posts-about-sap-websites/use-the-sap-road-map-explorer-in-5-steps/ba-p/13433198 und https://blogs.sap.com/2021/04/08/5-tips-to-explore-the-product-roadmaps-of-sap-business-technology-platform/ |
| Oberfläche: Kanban-Board je Roadmap, Quartale (Time-Horizon-Filter), Status „Planned / In Development / Delivered“, ein „What's New“-Filter für neu hinzugekommene Einträge. Das gilt als Beschreibung der Oberfläche, nicht des Datenmodells. | [S] Suchzusammenfassungen zu https://community.sap.com/t5/technology-blog-posts-by-sap/roadmap-sap-cloud-alm/ba-p/14291033 und https://blogs.sap.com/2021/04/08/5-tips-to-explore-the-product-roadmaps-of-sap-business-technology-platform/ |
| Öffentliche API, OData-Dienst, RSS oder Atom für Roadmap-Einträge: **nicht gefunden.** Suche im SAP Business Accelerator Hub (api.sap.com) ergab keinen Roadmap- oder Release-Notes-Dienst. | [S] Suchtreffer, 18.11.2026; keine Primärquelle, die das Fehlen bestätigt |
| Ein Feld „zuletzt geändert“ je Roadmap-Eintrag: **nicht gefunden.** Die Oberfläche bietet nur den Filter „What's New“. Wie dieser technisch entsteht (Feld, Zeitstempel, Version): nicht gefunden. | [S] siehe oben |
| Rechtlicher Hinweis in SAP-Schulungsmaterial: Beim Arbeiten mit dem Road Map Explorer sei der Disclaimer auf der Seite zu beachten. Wortlaut des Disclaimers: nicht gefunden. Roadmap-Folien tragen üblicherweise den Vorbehalt, dass Inhalte keine Zusage sind und teils vertraulich. | [S] https://assets.dm.ux.sap.com/webinars/sap-user-groups-k4u/pdfs/200909_roadmap_explorer.pdf (Suchtreffer); https://www.sap.com/about/legal/materials-legal-notice.html (Suchtreffer, „not a commitment“) |

**Folge für die Anzeige:** Roadmap-Inhalte tragen den Vorbehalt „keine Zusage“. Wenn wir Quartalsangaben zeigen, dann als „laut SAP Road Map Explorer geplant, Stand …, ohne Gewähr“, mit Link, in eigener Formulierung.

## 2. Release Notes: What's New Viewer und help.sap.com

| Befund | Beleg |
|---|---|
| `help.sap.com/robots.txt` (Stand 17.10.2025): `User-agent: *` → `Disallow: /`. Freigegeben sind namentlich Suchmaschinen und eine Liste von KI-Bots (u. a. Googlebot, Bingbot, ClaudeBot, GPTBot). Ein eigener Client ohne diese Kennung ist ausgesperrt. Sitemap-Verweis: `help.sap.com/http.svc/sitemapxml/sitemaps/sitemap_index.xml`. | [P][Beobachtung] https://help.sap.com/robots.txt |
| Die SAP-Docs-Seite „What's New for SAP Integration Suite“ besteht nur aus einem Verweis auf `https://help.sap.com/whats-new/5793247a5d5741beb0decc5b7dee1160`, dem Hinweis auf E-Mail-Benachrichtigung (Glocke, mit Filter nach Capability) und einem Verweis auf die „Patch Release Notes“. Der Inhalt der Einträge steht **nicht** im Repo. | [P][Beobachtung] https://github.com/SAP-docs/btp-integration-suite/blob/main/docs/ISuite/what-s-new-for-sap-integration-suite-79cd682.md |
| Der What's New Viewer bietet Volltextsuche, Export, Filter (Einstellungen stehen in der URL) und E-Mail-Abonnements. Abonnement und gespeicherte Filter brauchen ein Help-Portal-Konto. Ein RSS-Feed: nicht bestätigt (ein Blogpost von 2021 wünscht ihn sich). | [S] Suchtreffer zu https://blogs.sap.com/2021/01/27/follow-changes-in-sap-products-with-the-new-whats-new-viewer/ , https://community.sap.com/t5/technology-blog-posts-by-sap/new-subscription-feature-for-sap-btp-what-s-new-viewer/ba-p/13552489 , https://community.sap.com/t5/technology-blog-posts-by-sap/spotlight-sap-hana-cloud-what-s-new-viewer/ba-p/13511984 |
| Interner Datenweg des Viewers (JSON-Endpunkt hinter der Oberfläche): **nicht untersucht**, weil robots.txt und Bedingungen den Abruf verbieten. Ob ein Export-Knopf ohne Anmeldung nutzbar ist: nicht geprüft. | eigene Entscheidung |
| S/4HANA Cloud Public Edition: Vorab-„What's New“ stehe im What's New Viewer oder im Werkzeug RASD (Release Assessment and Scope Dependency); für RASD und den vollen Vorab-Inhalt brauche man eine S-User-ID. Die Releases erscheinen halbjährlich (2508, 2602 laut Treffern). | [S] Suchtreffer zu https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-sap/preliminary-what-s-new-information-for-sap-s-4hana-cloud-public-edition/ba-p/14280980 (Beitrag ist von vor dem Release 2602) |
| SAP Signavio: Release Notes liegen seit dem Release Process Explorer August 2023 im SAP Help Portal („What's New in SAP Signavio Process Transformation Suite“). Die alte Seite `signavio.com/release-notes` listet nicht die neuesten Einträge (SAP-Knowledge-Base-Artikel 3407798). | [S] Suchtreffer zu https://help.sap.com/doc/3c260c717cd045d98d5c8069b8759094/SHIP/en-US/index.html und https://userapps.support.sap.com/sap/support/knowledge/en/3407798 |
| SAP Cloud ALM: Es gibt vierteljährliche „What's New“-Sitzungen (Implementation und Operations) mit Folien als PDF. Die Seite listet 2026 und Anfang 2027 Termine. Die Release Notes selbst stehen im Help Portal (URL im Treffer nicht genannt). | [S] https://support.sap.com/en/alm/alm-whats-new-calls/webinar-content-sap-cloud-alm-quarterly-updates.html und https://assets.dm.ux.sap.com/webinars/sap-cloud-alm-quarterly-updates/pdfs/ (Suchtreffer) |
| Änderungen an den Cloud-ALM-APIs stehen auf der Cloud-ALM-Roadmap und auf der „What's New“-Seite des API-Guides. | [S] https://answers.sap.com/t5/technology-q-a/info-about-changes-and-updates-to-sap-cloud-alm-apis/qaq-p/13699085 |

## 3. Der einzige ausdrücklich lizenzierte Weg: SAP-Docs-Repos auf GitHub

- Die GitHub-Organisation `SAP-docs` („SAP Documentation“) hat 38 öffentliche Repos. Die Dokumentation steht unter **CC-BY-4.0** (Lizenzdatei `LICENSE`, geprüft an `btp-integration-suite`; die Repo-Liste meldet CC-BY-4.0 für fast alle). [P][Beobachtung] https://github.com/SAP-docs , GitHub-API 18.11.2026.
- Die Markdown-Dateien sind die Quelle der Help-Portal-Seiten („The filenames in the docs directory are created based on the title of the page on SAP Help Portal“). [P] https://github.com/SAP-docs/btp-integration-suite#readme
- **Abdeckung unserer Bausteine (nach Repo-Namen, Inhalt nicht geprüft):** `btp-integration-suite` (Integration Suite, Cloud Integration, API Management, Event Mesh, Advisor/TPM, EIC, Assessments), `sap-datasphere`, `cloud-alm-setup-admin-guide` (nur Einrichtung und Administration von SAP Cloud ALM), `btp-cloud-platform`, `btp-cloud-identity-services`, `btp-task-center`, `btp-cloud-transport-management`, `btp-connectivity`, `btp-neo-environment`, `btp-master-data-integration`, `btp-build-work-zone-advanced`, `sap-artificial-intelligence`, `s4hana-cloud-advanced-financial-closing`. **Kein Repo** gefunden für S/4HANA Cloud Public Edition als Ganzes, Signavio, LeanIX, SuccessFactors, Ariba, Concur (nur die Entwicklerseite `preview.developer.concur.com`), Fieldglass, IBP, Digital Manufacturing und die Mehrheit der übrigen Bausteine.
- **Was nicht drinsteht:** die „What's New“-Einträge. In `btp-integration-suite` gibt es neben dem Verweis nur Einträge zu Patch-Versionen für API Management und Archivseiten zu Cloud Integration. Der Datasphere-Baum hat keine „What's New“-Datei (Suche nach „new/whats/release/roadmap“ im Dateibaum: nur Bilder und Seiten zu neuen Spalten). Beim Cloud-ALM-Repo ebenso nicht.
- **Als Änderungssignal brauchbar:** Die Commit-Historie einer Datei über die GitHub-API (Beispiel: Seite „What's New for SAP Integration Suite“, letzte Commits 02.07.2026 und 29.10.2024). Sie zeigt „Doku wurde überarbeitet“, nicht „Funktion X ist neu“. Die Commit-Nachrichten sind gesammelte Importe aus dem SAP-Redaktionssystem („Update from SAP DITA CMS (squashed)“) und damit nicht aussagekräftig.
- Nutzung: CC-BY-4.0 erlaubt Weitergabe und Bearbeitung mit Namensnennung und Lizenzhinweis. Die Bedingungen der SAP-Websites nehmen ausdrücklich aus, was „explicitly permitted otherwise“ ist. Dass dies die Repos abdeckt, ist ein Schluss von mir, keine Aussage von SAP.

## 4. Nutzungsbedingungen: Was darf ein Prüflauf?

Quelle: [P] https://www.sap.com/about/legal/terms-of-use.html („Revised and posted as of February 26, 2026“), Abschnitt 4, abgerufen 18.11.2026. Wörtliche Ausschnitte kurz, Rest sinngemäß.

- **Zweck:** Nur nicht-kommerzielle Nutzung. Kopieren, Verteilen, Anzeigen oder abgeleitete Werke aus SAP-Materialien sind untersagt. Herunterladen, Speichern und Anzeigen auf dem eigenen Gerät nur zum Betrachten, unverändert.
- **Technik:** Einhaltung von robots.txt, Meta-Direktiven und X-Robots-Tag ist Pflicht. „Spoofing user agent strings or bypassing rate limits, authentication, or other controls is not permitted.“
- **Automatisierung:** Untersagt sind automatisierte Methoden zum Abgreifen („bots, scrapers, spiders, crawlers, Model Context Protocol (MCP), agent-frameworks, or any other text and data mining technology“), auch für Text- und Data-Mining, KI-Training oder -Bewertung und kommerzielle Datensammlung. Ausnahme: Suchmaschinen für Standardindexierung.
- **Speichern und Weitergeben:** Verboten sind Massen-Download, persistente Kopien und „Cache, store or redistribute … to any third party, including any data broker or AI provider“.
- **Verantwortung:** Wer Dritte oder Werkzeuge einsetzt, haftet dafür.
- **Folgen:** SAP kann den Zugang sperren, Schadensersatz fordern und die Löschung aller Kopien verlangen.

Folgen für uns:

- Ein Claude-gestützter oder skriptgestützter wöchentlicher Abruf von help.sap.com oder roadmaps.sap.com fällt unter das Verbot, selbst wenn er technisch ginge. Das Speichern abgerufener Texte im Repo oder auf der Seite ebenso.
- „In eigener Formulierung mit Link zeigen“ (Wunsch aus dem Ticket) ist für abgeleitete Texte aus SAP-Materialien durch Abschnitt 4 nicht gedeckt. Gedeckt ist es für CC-BY-Material (Abschnitt 3) mit Namensnennung. Für Fakten wie „Release 2602 erschien im Februar 2026“ ist die Rechtslage nicht geprüft; das ist eine Rechtsfrage, kein Recherche-Befund.
- Ob die Bedingungen der SAP-Websites auch für roadmaps.sap.com gelten oder dort eigene Bedingungen stehen: **nicht gefunden.** Auf der Login-Seite stehen nur „Privacy Policy, Legal Disclosure, Cookie Statement“.
- **Anfrage bei SAP** („explicit permission“) ist der im Text selbst genannte Weg. Kontakt nennt der Text für Konto- und Datenschutzfragen: `webmaster@sap.com`. Für Erlaubnisanfragen: nicht gefunden.

## 5. Weg „OData mit S-User-Session“

Grundlage für `me.sap.com`-Dienste: [Activate] Issues #2, #16, #23 und Berichte `docs/research/wissensbasis-v1/01-…`, `01b-…`, `05-simplification-items.md` im Repo `iKon85/activate` (Stand 22. bis 24.10.2026). Ich habe dort nur gelesen und selbst keine Session verwendet. Keine Sitzungsdaten sind hier zitiert.

### Zwei verschiedene Dinge, nicht verwechseln

| | Activate „Roadmap Viewer“ | Road Map Explorer |
|---|---|---|
| Adresse | `me.sap.com/roadmapviewer` | `roadmaps.sap.com` |
| Inhalt | Methodik (Phasen, Liefergegenstände, Methodenaufgaben, Accelerators), z. B. `S4HANATRANSONPRE` | Produkt-Roadmaps: geplante und gelieferte Innovationen je Quartal |
| Zugang | komplett login-pflichtig; „Public access has been discontinued“ (SAP-Aussage 14.11.2024, via archive.org) [Activate] | login-pflichtig (Weiterleitung, [Beobachtung] 18.11.2026) |
| Datenweg | Cloud-ALM-iframe `pr.alm.me.sap.com`; Endpunkte nicht gefunden, nur per DevTools in der Session ermittelbar [Activate] | **nicht gefunden**; ohne Session nicht erreichbar, mit Session von mir nicht untersucht |
| Ablauf | Excel-„Projektplan“ als ZIP (XLS + XML) mit Pflichtangaben (Name, Unternehmen, E-Mail) im Dialog [Activate] | Excel-Export laut Suchtreffern, Spalten unbekannt |

Der Weg, der sich in `activate` bewährt hat, ist ein anderer Dienst: der Simplification Item Catalog (`me.sap.com/sic`, OData V2 `gss_rc_sic_gw_srv` auf `pr.alm.me.sap.com`, Note-Texte von `me.sap.com/backend/raw/sapnotes/Detail`). Er enthält weder Roadmap-Einträge noch Release Notes. Er zeigt aber, was „mit Session“ praktisch heißt.

### Was geht ohne Login, was nur mit Session

| Quelle | Ohne Login | Mit S-User-Session |
|---|---|---|
| roadmaps.sap.com | nur Login-Seite [Beobachtung] | Oberfläche und Excel-Export (laut [S]); Endpunkte unbekannt |
| me.sap.com/roadmapviewer | nur Login-Seite; `pr.alm.me.sap.com/launchpad` antwortet 401 [Activate] | Oberfläche, Projektplan-Export, Endpunkte per DevTools im iframe [Activate] |
| me.sap.com/sic (Katalog) | Datendienst 401, Notes-Dienst liefert Login-Weiterleitung [Activate] | OData-Abzug lief: 814 Items, 816 Notes, Vollabzug am 24.10.2026 [Activate] #23 |
| help.sap.com What's New Viewer | Seiten öffentlich lesbar, für Bots per robots.txt gesperrt [Beobachtung]; Abo/Favoriten brauchen Help-Portal-Konto [S] | Vorab-Inhalte der Public Edition brauchen S-User [S] |
| SAP-Docs-Repos | frei (GitHub, CC-BY-4.0) [Beobachtung] | nicht nötig |

### Was eine Session für einen unbeaufsichtigten wöchentlichen Lauf bedeutet

- **Ablauf/Erneuerung:** Im Activate-Test zog ein dauerhaftes Chrome-Profil die Session beim Öffnen von `me.sap.com/sic` still per SSO nach (Vollabzug ohne Rückfrage). Die Gültigkeitsdauer des Profils und der SSO-Anmeldung ist dort als „unbekannt“ geführt, ebenso ob MFA wieder verlangt wird. Für einen wöchentlichen Takt ist das **nicht belegt**. Ein abgelaufener Login würde den Lauf abbrechen und braucht Niko. [Activate] 03 und 05, #23
- **Bindung an die Person:** Die Zugangsdaten gehören Niko (Wavestone-Partnerkonto). Die me.sap.com-Bedingungen verbieten, Zugangsdaten an Dritte weiterzugeben (§ 6) und die Nutzung außerhalb des eigenen Geschäftszwecks im Rahmen des eigenen Lizenz- oder Partnervertrags (§ 12). Ein Lauf auf einem fremden Server, in CI oder durch einen Dienst mit hinterlegtem Passwort fällt damit weg; ein Lauf auf Nikos Rechner mit seinem Browserprofil bleibt im Rahmen. [P][Beobachtung] https://me.sap.com/assets/legal/terms-of-use.html , Abschnitte 6, 12
- **Zweck:** § 12 nennt als Nutzungszweck „Your sole business purpose“ im Rahmen des gültigen Software-, Partner- oder Wartungsvertrags. Ob der Betrieb von sapmap als eigenes Projekt dazu zählt: Rechtsfrage, nicht geklärt. Materialien dürfen laut § 12 nicht an Dritte weitergegeben werden. Eine öffentlich ausgelieferte Seite wäre eine Weitergabe von Inhalten; Titel, Quartal und Link wären ein anderer Fall als Beschreibungstexte, die Grenze ist aber nicht von SAP beschrieben. [P] ebd.
- **Vertraulichkeit:** Inhalte, die „accessed through SAP for Me“ werden, gelten dort als vertrauliche Information, sofern gekennzeichnet oder erkennbar vertraulich (§ 5). Was davon auf Roadmap- und Release-Notes-Inhalte zutrifft: nicht geklärt. [P] ebd.
- **Tempo:** SAP behält sich Sperren bei hohem Abrufvolumen vor (§ 13, Beispiel SAP-Notes); im Test antwortete der Notes-Dienst nach rund 50 Abrufen mit HTTP 429 und gab nach 1 bis 4 Minuten wieder frei. Das Katalog-Dienst-Limit: keines beobachtet. [P] ebd.; [Activate] #23
- **Änderungserkennung:** Beim Katalog gibt es `ChangedAt` je Item und `Version` je Note (nutzbar). Beim Roadmap Viewer fanden die Activate-Berichte kein „zuletzt geändert“ je Element, nur das Quartalsrelease (z. B. „26Q2“). Für den Road Map Explorer: nicht gefunden. [Activate] 05 und 01
- **Technische Fragilität:** Die Endpunkte sind interne Oberflächen-Dienste ohne Zusage und können sich mit jedem Release ändern. Dokumentierte, stabile APIs für diese Inhalte: nicht gefunden.
- **Lizenzierte Rohdaten:** `activate` hält die Rohdaten bewusst in `data/raw/` außerhalb von Git („lizenziert“). Für sapmap würde dasselbe gelten: Rohdaten nie nach `data/` oder `dist/`.

## 6. Zuordnung zu den 154 Steckbriefen

Stand der Datei: 154 Einträge in `data/steckbriefe.json`, Felder u. a. `id`, `name`, `layer`, `parent`, `quellen`, `daten`.

- **Schlüssel der Quellen:** Der What's New Viewer ist je Produkt oder Produktfamilie aufgebaut (z. B. ID `5793247a5d5741beb0decc5b7dee1160` für SAP Integration Suite; Filter nach Capability). Der Road Map Explorer filtert nach Produkt, Prozess, Branche, Fokusthema und Suite-Qualität [S]. Interne Produkt-IDs des Road Map Explorers: **nicht gefunden.** Ein deterministischer Schlüssel „unsere `id` ⇄ SAP-Produkt“ existiert nicht; die Abbildung müsste von Hand in einer Zuordnungstabelle gepflegt werden (Steckbrief-ID → What's-New-ID und/oder Roadmap-Produktname).
- **Stichprobe:**

| Baustein (`id`) | Roadmap (Road Map Explorer) | Release Notes | SAP-Docs-Repo |
|---|---|---|---|
| Cloud ALM (`cloud-alm`) | Roadmap vorhanden (Beitrag „Roadmap SAP Cloud ALM“, [S]) | Help Portal; vierteljährliche Sitzungen mit PDF-Folien [S] | nur Setup/Admin-Guide, keine Release Notes |
| S/4HANA Cloud Public Edition (`s4-cloud-erp`, hieß früher S/4HANA Cloud) | vorhanden (halbjährliche Releases) [S] | What's New Viewer; Vorab-Inhalt mit S-User/RASD [S] | keins gefunden |
| Integration Suite (`integration-suite` und Capabilities) | Roadmap im Road Map Explorer: nicht geprüft | What's New Viewer, Abo mit Capability-Filter [P]; Patch Release Notes [P] | `btp-integration-suite`: nur Verweise |
| Signavio (`signavio`, `signavio-*`) | nicht geprüft | Help Portal seit Aug. 2023 [S] | keins gefunden |
| Datasphere (`datasphere`) | nicht geprüft | What's New im Help Portal: nicht belegt | `sap-datasphere`: Handbuch, keine „What's New“-Datei gefunden |

- **Bausteine ohne eigene Roadmap oder Release Notes:** Das gilt voraussichtlich für Querschnittsthemen und Methodik ohne Produkt (z. B. `clean-core`, `activate`, `agent-led-toolchain`), für Partnerlösungen (`snp-kyano`, WalkMe-Bausteine, Tricentis-Bausteine; deren Release Notes liegen beim Partner) und für Kunden- oder Branchenthemen wie `redispatch`, `eda-at`. Das ist ein Schluss aus der Art der Bausteine; je Baustein geprüft wurde es nicht. Eine vollständige Liste würde die Suche aller 154 Einträge verlangen und gehört in ein Folgeticket, falls der Weg überhaupt gebaut wird.
- Bausteine mit `parent` (Signavio-, LeanIX-, Tricentis-, WalkMe-Unterprodukte) würden unter dem Dach-Produkt geführt; ob die Quellen auf Unterprodukt-Ebene filtern lassen: beim What's New Viewer plausibel (Capability-Filter, [P] nur für Integration Suite belegt), sonst nicht gefunden.

## 7. Empfehlung und mögliche Wege (Aufwand, Risiko)

1. **E-Mail-Abonnements des What's New Viewers** für die wichtigsten Produkte, Eingang bei Niko. SAP-seitig vorgesehen, keine Bedingungsfrage, kein Code. Der Mensch trägt Änderungen in die Steckbriefe ein (`daten`, `hinweis`). Schwäche: nicht für jedes Produkt belegt, braucht Konto, keine Maschinenlesbarkeit.
2. **Änderungssignal über die GitHub-API der SAP-Docs-Repos** (Commits je Datei, öffentlich, CC-BY). Deckt ca. 13 von 154 Bausteinen ab, gibt nur „Seite hat sich geändert“. Geringer Aufwand (ein Skript, ein wöchentlicher Lauf in CI ohne SAP-Websites). Schwäche: Commit-Nachrichten ohne Inhalt, ein Commit-Datum je Seite ist nur ein Hinweis.
3. **Manueller Abzug durch Niko mit Session** (Excel-Export aus dem Road Map Explorer; Notizen in eigener Formulierung), Rohdaten außerhalb des Repos. Das ist die einzige Quelle für Roadmap-Quartale. Vorher die Zweckfrage (Abschnitt 5) klären, am besten mit SAP oder dem Wavestone-Compliance-Kontakt. Nicht unbeaufsichtigt.
4. **Unbeaufsichtigter Session-Lauf** (wie `sic-fetch.mjs` in `activate`) nicht empfohlen: Ablauf der Anmeldung unbelegt, Zweck und Weitergabe offen, Endpunkte für Roadmap-Einträge unbekannt.
5. **Anfrage an SAP** nach einer ausdrücklichen Erlaubnis oder einer maschinenlesbaren Schnittstelle. Der Ausgang ist offen. Erst dann würde ein Aufbau auf help.sap.com lohnen.

## Offen / nicht gefunden

- Offizielle SAP-Aussage zu Roadmap-Export, -API oder -Feed: nicht gefunden.
- Felder und Spalten des Roadmap-Excel-Exports; Feld „zuletzt geändert“ je Roadmap-Eintrag: nicht gefunden.
- Nutzungsbedingungen und Disclaimer speziell für roadmaps.sap.com: nicht gefunden.
- Bedeutung des leeren `robots.txt` von roadmaps.sap.com und der Antwort-Header: nicht geklärt.
- RSS oder Atom für den What's New Viewer: nicht bestätigt. JSON-Endpunkt des Viewers: nicht untersucht (robots.txt/Bedingungen).
- URL der Cloud-ALM-Release-Notes im Help Portal; Roadmap-Einträge für Integration Suite, Signavio, Datasphere: nicht geprüft.
- Dauer der SSO-Anmeldung und MFA-Verhalten bei einem wöchentlichen Lauf: unbekannt (auch in `activate`).
- Ob SAP-Docs-Repos über die Dateien hinaus Release-Notes-Material enthalten (nur drei Repos im Detail geprüft): offen.
- Rechtsfragen (Anzeige von Fakten mit Link, Zweck „Geschäftszweck“ für ein eigenes Projekt): nicht Teil der Recherche, bei Bedarf rechtlich klären.
