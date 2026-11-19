# Recherche: Konto und Abo – Versanddienst, Abmelden, späterer Tenant-SSO-Wechsel, Datenschutz (Stand 19.11.2026)

Beantwortet Issue #27. Baut auf `clerk-m365.md` (Branch `research/clerk-m365`, Issue #20) auf und wiederholt es nicht. Quellen sind mit **[P]** (primär: Anbieterdoku, Preisseite, Gesetzestext, RFC, Trust Center) oder **[S]** (sekundär) markiert; alle Seiten wurden am **19.11.2026** abgerufen, sofern nichts anderes steht. Preise stammen von den Anbieterseiten, nicht aus Vergleichsportalen. Was ich nicht gefunden oder nicht geprüft habe, steht als „nicht gefunden“ bzw. „nicht geprüft“. **Nichts davon wurde gegen eine echte Clerk-Instanz, einen Entra-Tenant oder einen Versanddienst-Account getestet.**

**Kein Rechtsrat.** Rechtstexte (DSGVO, TDDDG, DDG, UWG) sind als **[P]** belegt und gelten als gesicherte Rechtslage. Wie sie auf dieses Projekt passen (Rechtsgrundlage, Impressumspflicht, Einordnung der Abo-Mail), ist durchgängig **Einschätzung** und als solche gekennzeichnet. Die Einschätzungen ersetzen keine Beratung durch eine Juristin oder einen Datenschutzbeauftragten.

Rahmen (gesetzt, nicht neu verhandelt): TanStack Start im Server-Modus mit Postgres auf eigenem Server (Coolify, Hetzner), `sapmap.iverra.de`, die ganze Seite hinter der Anmeldung, im MVP Clerk Free mit „Mit Microsoft anmelden“ auf Einladung. Firmen-IT (Entra ID, Tenant-SSO, Mailversand über den Tenant) kommt nach dem MVP und darf nur nicht verbaut werden.

## Kurzfassung mit Empfehlung je Frage

| # | Frage | Empfehlung | Sicherheit |
|---|---|---|---|
| 1 | Versanddienst fürs MVP | **Resend, Region Irland (eu-west-1)**: Gratis-Stufe (3.000 Mails/Monat, 100/Tag) reicht für rund 225 Mails/Monat, Subdomain mit SPF/DKIM/DMARC, eigene Header möglich, AVV mit Standardvertragsklauseln. Wer keinen weiteren US-Anbieter will: **Scaleway TEM** (Frankreich, ca. 0 €/Monat), mit offener Frage zur „nur transaktional“-Regel. | Preise/Limits belegt; Eignung = Einschätzung |
| 2 | Abmelden aus der Mail | **Signierter Link ohne Anmeldung** (HMAC über die Konto-ID, öffentliche Route mit POST für One-Click nach RFC 8058 plus Bestätigungsseite per GET). Feineinstellung der Abos bleibt in der angemeldeten Kontoseite. Die Mengenschwellen der Postfachanbieter (5.000 Mails/Tag) greifen hier nicht; SPF/DKIM/DMARC und One-Click trotzdem einrichten. | Regeln belegt; „greift nicht“ = Auslegung |
| 3 | Späterer Wechsel auf Tenant-SSO | Eigene `konto.id` als Schlüssel, `clerk_user_id` als austauschbare Spalte, E-Mail nur als Attribut, **keine Clerk-Organisationen**, Webhooks `user.deleted`/`user.merged` verarbeiten, Verknüpfung vorher in einer Entwicklungsinstanz testen (dort SSO kostenlos). | Doku-Lage; nicht getestet |
| 4 | Eine Clerk-Instanz auch für MCP | **Ja, eine Anwendung** für Seite und `/mcp`: Clerk unterstützt CIMD und DCR, Tarifbindung nicht gefunden; Lücke bleibt die TanStack-Variante des MCP-Leitfadens (Spike in #17). | Doku-Lage |
| 5 | Datenmodell | Clerk hält Identität und Sitzung; eigene Postgres hält `konto` (Spiegel), `abo`, `mitteilung` (Zeiger auf gemeinsame `aenderung`), `versand`. Skizze in Abschnitt 5. | Entwurf |
| 6 | Datenschutz | Clerk hat DPA in allen Plänen, DPF-Zertifizierung und SCC als Rückfall; Versanddienst mit AVV und SCC; Tracking in Mails aus; Konto-Löschung über Clerk-Webhook mit Kaskade; Datenschutzerklärung und Impressum als **öffentliche** Routen vor der Anmeldung. **Offen: wer ist Verantwortlicher (Niko als Person/Unternehmen oder die Firma)?** | Gesetze belegt; Anwendung = Einschätzung |
| 7 | Aufbewahrung Mitteilungen | **90 Tage ab Erzeugung** (gelesen oder nicht), die gemeinsame Änderungsliste bleibt davon unberührt. Üblich: GitHub hält ungespeicherte Benachrichtigungen 3 Monate. | Praxisbeleg: 1 Beispiel |

**Entscheidungen, die bei Niko bleiben:**
1. **Versanddienst** (Resend EU empfohlen; Scaleway TEM als EU-Anbieter-Alternative; Tabelle in Abschnitt 1).
2. **Aufbewahrungsdauer** der Mitteilungen (90 Tage empfohlen; 12 Monate oder „gelesen nach 30 Tagen“ als Alternativen, Abschnitt 7).
3. **Eine Clerk-Anwendung auch für den MCP-Zugang** (ja empfohlen) oder getrennte Anwendung.

**Vorab zu klären (kein Wahlpunkt, aber Voraussetzung für Abschnitt 6):** Wer betreibt die Seite rechtlich, Niko als Person bzw. mit eigenem Unternehmen oder eine Firma? Das entscheidet über Verantwortlichen, Impressum und die Frage, ob Beschäftigtendatenschutz überhaupt ins Spiel kommt.

**Neue Einsichten, die das Ticket nicht kannte:**
- Weil die ganze Seite hinter der Anmeldung liegt, braucht es **fünf bewusst öffentliche Ausnahmen** in der Clerk-Middleware: Anmeldeseite, Datenschutzerklärung, Impressum, Abmelde-Endpunkt (RFC 8058 verbietet Cookies und Anmeldung beim POST), Clerk-Webhook. Später kommen die OAuth-Endpunkte für MCP dazu.
- **Gmail meldet „subscribed messages“ ausdrücklich als Fall für One-Click**; die Abo-Mail ist genau so eine Nachricht.
- **Merge bei Clerk** (Backend-API seit 23.10.2026) kann Dubletten nach dem SSO-Wechsel zusammenführen, verbietet aber das Löschen eines Nutzers mit Enterprise-SSO-Konto; die Richtung der Zusammenführung ist also vorgegeben.
- **Clerk widerruft bei gelöschtem Entra-Nutzer nur die Sitzung, nicht das Konto** (aus dem Vorbericht). Die Abo-Mails eines ausgeschiedenen Kollegen laufen weiter, bis jemand das Konto löscht.

## 1. Versanddienst fürs MVP

**Last:** eine Sammelmail pro Woche an höchstens einige Dutzend Empfänger plus Einladungs-/Systemmails. Annahme zur Rechnung: 50 Empfänger × 4,3 Wochen ≈ 215 Mails plus etwa 10 Systemmails ≈ **225 Mails/Monat**. Die Einladungs- und Anmeldemails von Clerk laufen über Clerk selbst und zählen hier nicht.

### Vergleich

| | Resend | Scaleway TEM | Brevo | Amazon SES | Mailjet | Postmark |
|---|---|---|---|---|---|---|
| **Sitz** | USA (San Francisco) | Frankreich | Frankreich | USA (Region frei wählbar) | Frankreich (Konzern: Sinch) | USA (ActiveCampaign) |
| **Gratis-Kontingent** | 3.000 Mails/Monat, **100/Tag** | 300 Mails inklusive (Zeitraum auf der Seite nicht genannt) | **300/Tag**, ohne Zeitlimit | Free-Tier-Guthaben bis 200 $ für 6 Monate | 6.000/Monat, **200/Tag** | nur **100/Monat** |
| **Kleinste bezahlte Stufe** | Pro 20 $/Monat (50.000) | Pay-as-you-go 0,25 €/1.000 darüber; Scale 80 €/Monat | Starter 9 $/Monat (ab 5.000) | 0,10 $/1.000 (à la carte) bzw. 0,16 $/1.000 (Essentials, Standard für neue Konten) | Starter 9 $/Monat (8.000) | Basic 15 $/Monat (10.000) |
| **Kosten bei ca. 225 Mails/Monat** | 0 $ | ca. 0 € | 0 $ | unter 0,10 $ | 0 $ | 15 $ (Gratis reicht nicht) |
| **Datenstandort** | Versand wählbar: Irland, USA, Brasilien, Japan; Unterauftragnehmer (AWS, Datadog, Elastic u. a.) in den USA | nur **fr-par** (Paris) | EU (OVH Frankreich/Deutschland, Google Cloud Belgien) | Frankfurt, Irland, Stockholm u. a. wählbar | Rechenzentren „ausschließlich in der EU“ | **nur USA**, „keine Pläne für EU-Server“ |
| **AVV** | DPA mit EU-SCC (Module 1 und 2) | Vertragswerk/Verträge-Seite; Einzelheiten nicht geprüft | DPA im Konto; Text nicht geprüft | Teil der AWS Service Terms, SCC automatisch | DPA liegt bei Sinch; Text nicht geprüft | DPA vorhanden; Text nicht geprüft |
| **SPF/DKIM/DMARC auf Subdomain** | ja, mehrere Subdomains je Hauptdomain, SPF/DKIM/DMARC dokumentiert | ja (SPF, DKIM, DMARC), „rekursives SPF `include`“ nicht unterstützt | ja, Details nicht geprüft | ja (DKIM, SPF, MAIL FROM), Details nicht geprüft | ja, Details nicht geprüft | ja, Details nicht geprüft |
| **List-Unsubscribe / One-Click (RFC 8058)** | `/emails`-API: eigene Header möglich, Doku nennt beide Header; bei Broadcasts automatisch | eigene Header: **nicht gefunden** | eigene Header: nicht geprüft | **Subscription Management** (`ListManagementOptions`) setzt beide Header und eine gehostete Seite; eigene Header: nicht geprüft | Send API v3.1 hat Anleitung „Add Email Headers“ | nicht geprüft |
| **Node/SMTP** | `resend` 6.39.0 (18.11.2026); SMTP-Relay | `@scaleway/sdk` 4.3.2; SMTP-Relay | `@getbrevo/brevo` 6.2.0; SMTP | `@aws-sdk/client-sesv2` 3.1172.0; SMTP | `node-mailjet` 6.0.11; SMTP | `postmark` 5.1.1; SMTP |
| **Einschränkungen Gratis-Tarif** | 100/Tag, 3 Domains, **Logs 30 Tage**, 1 Webhook | Standardquota 10.000/Monat (per Support steigerbar), 1 Webhook je Domain; **nur Transaktionsmails erlaubt** (Marketing verboten) | **„Sent with Brevo“-Sticker immer**; bei Tageslimit nur 1.000 Mails in Warteschlange, Rest geht nicht raus | **Sandbox** (nur verifizierte Empfänger, 200/24 h) bis Produktionszugang beantragt ist | Mailjet-Logo erst ab Essential entfernbar (19 $/Monat), ob es bei API-Mails erscheint: nicht geprüft | Free: keine Überschreitung erlaubt; Log 45 Tage |

Quellen (alle [P], Anbieterseiten; abgerufen 19.11.2026):
- **Resend:** Preise `https://resend.com/pricing.md` und `https://resend.com/pricing`; Regionen `https://resend.com/docs/dashboard/domains/regions`; Domains/Subdomains `https://resend.com/docs/dashboard/domains/introduction`; DPA `https://resend.com/legal/dpa` (EU-SCC Modul 1/2); Unterauftragnehmer `https://resend.com/legal/subprocessors`; Header/Unsubscribe `https://resend.com/docs/dashboard/emails/add-unsubscribe-to-transactional-emails`; API-Parameter `headers` auf `https://resend.com/docs/api-reference/emails/send-email`. DPF-Zertifizierung von Resend: **nicht gefunden**.
- **Scaleway TEM:** `https://www.scaleway.com/en/transactional-email-tem/` (Preise, FAQ „nur transaktional“), Limits und „nur fr-par“ `https://www.scaleway.com/en/docs/managed-services/transactional-email/reference-content/tem-capabilities-and-limits/`, Domain-Einrichtung `…/how-to/configure-domain-with-transactional-email/`.
- **Brevo:** Preisseite `https://www.brevo.com/pricing/`; Free-Plan-Grenzen `https://help.brevo.com/hc/en-us/articles/208580669` (300/Tag, Sticker, Warteschlange); Standort `https://help.brevo.com/hc/en-us/articles/360001005510`. Widerspruch: Die Preisseite führt „No Brevo logo“ unter Starter, die Hilfeseite nennt dafür ein Add-on („Remove Brevo branding“).
- **Amazon SES:** `https://aws.amazon.com/ses/pricing/` (Essentials 0,16 $/1.000; à la carte 0,10 $/1.000; Free-Tier-Guthaben; Fußnote: neue Konten starten ab 21.07.2026 auf Essentials); Subscription Management `https://docs.aws.amazon.com/ses/latest/dg/sending-email-subscription-management.html`; Sandbox `https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html`; Regionen `https://docs.aws.amazon.com/general/latest/gr/ses.html`; DPA/SCC `https://aws.amazon.com/compliance/gdpr-center/`.
- **Mailjet:** `https://www.mailjet.com/pricing/` (Free 6.000/200 pro Tag, Starter 9 $, Essential 19 $), EU-Rechenzentren `https://www.mailjet.com/products/data-security-and-privacy/`, Header-Anleitung im Inhaltsverzeichnis von `https://dev.mailjet.com/email/guides/send-api-v31/`.
- **Postmark:** `https://postmarkapp.com/pricing` (Free 100/Monat, Basic 15 $, Log 45 Tage), Standort `https://postmarkapp.com/eu-privacy` („primary data and servers are hosted … outside of Chicago and AWS; no plans to add servers in the EU“).
- Alle Versanddienst-Preise ohne Steuer; Mailjet nennt französische USt zusätzlich. npm-Versionen per `npm view` am 19.11.2026 (**[P]**, Registry).

### Was Clerk selbst versendet, und taugt das für Abo-Mails?

- Clerk versendet **System- und Authentifizierungsmails** (Verifizierungscodes, Einladungen); Vorlagen sind per Handlebars/Revolvapp anpassbar. [P] `https://clerk.com/docs/guides/customizing-clerk/email-sms-templates.md`
- Eine Schnittstelle für **frei formulierte Mails** an Nutzer (Sammelmail) habe ich in der Clerk-Doku-Übersicht (`llms.txt`) **nicht gefunden**; die Backend-API kennt `createInvitation()` (sendet die Einladungsmail). Für die Wochenmail taugt Clerk deshalb nicht; es bleibt der Absender für Einladungen und Anmeldemails.
- Datenschutz-Nebenwirkung: Clerks E-Mail-Dienstleister behalten Empfängeradresse und Ereignisse bis zu 37 Tage. [P] `https://trust.clerk.com/` (FAQ „What happens when I delete a user“)

### Bewertung (Einschätzung)

- **Kriterium 1: Last passt in die Gratis-Stufe.** Alle außer Postmark. Die Tageslimits (Resend 100, Mailjet 200, Brevo 300) reichen für „einige Dutzend“ Empfänger in einem Lauf; ab etwa 100 Empfängern müsste der Resend-Versand über zwei Tage verteilt oder auf Pro (20 $) gewechselt werden.
- **Kriterium 2: EU-Datenstandort und AVV.** EU-Anbieter (Scaleway, Brevo, Mailjet) vermeiden eine zusätzliche Drittlandübermittlung; Resend und SES (US-Konzerne, EU-Region wählbar) lösen sie über SCC im AVV. Postmark scheidet wegen „nur USA“ und der Mindestgebühr aus.
- **Kriterium 3: wenig Einrichtung, wenig Code.** Resend: ein API-Aufruf, Domain per DNS. SES: AWS-Konto, IAM, Sandbox-Ausstieg, Konfigurationssets für Bounces; am meisten Aufwand, aber auch am billigsten und mit fertiger gehosteter Abmeldeseite. Scaleway: Konto samt Identitäts-/Zahlungsprüfung, danach einfach.
- **Kriterium 4: Eignung für „bestellte“ Abo-Mails.** Scaleway verbietet Marketing ausdrücklich („Can I send marketing emails? No“, Anti-Spam-Policy). Eine vom Nutzer per Knopf bestellte Wochenmail mit Fakten ist meines Erachtens ein Benachrichtigungsfall und keine Werbung; ob Scaleway das auch so sieht, ist **nicht geklärt**, eine Rückfrage beim Support ist billig. Brevo ist ein Marketing-Werkzeug mit Pflichtsticker im Gratis-Tarif; das passt schlecht zu Systemmails.
- **Empfehlung:** **Resend in Irland**, weil alles Verlangte ohne Aufpreis geht und die einzige Hürde (Drittlandübermittlung über SCC) bei Clerk ohnehin akzeptiert werden muss. **Scaleway TEM** ist die Alternative, wenn kein weiterer US-Auftragsverarbeiter gewünscht ist. Der spätere Wechsel auf den Firmen-Tenant sollte keinen Umbau kosten: Versand hinter **einer** Funktion (Empfänger, Betreff, HTML, Text, Header), die Anbieterwahl bleibt Konfiguration plus DNS.

### Absender und Domain-Einrichtung

- **Eigene Subdomain nur fürs Versenden**, z. B. `mail.sapmap.iverra.de` (Name ist Beispiel). Grund: Clerk legt für die App-Domain eigene DNS-Einträge an („session management and emails verified from your domain“, [P] `https://clerk.com/docs/guides/development/deployment/production.md`); eine getrennte Subdomain verhindert, dass SPF/DKIM-Einträge von Clerk und Versanddienst kollidieren.
- **Absenderanzeige** z. B. „S/4HANA-Landkarte“ mit Antwortadresse, die jemand liest. DMARC mindestens `p=none` mit `rua`-Adresse; Yahoo verlangt für Bulk-Sender `p=none` als Minimum. [P] `https://senders.yahooinc.com/best-practices/`
- **Open- und Link-Tracking ausschalten** (Resend: Einstellung je Domain, auf jeder Stufe, laut [P] Preisseite-FAQ). Für Änderungsmitteilungen gibt es keinen Zweck, der dagegen aufwiegt.
- **Kein Kontaktverzeichnis beim Versanddienst anlegen** (Resend „Audiences“, SES „Contact Lists“, Brevo „Contacts“): Der Bestand an Empfängern und Abmeldungen bleibt in der eigenen Postgres. Das hält die Löschkette kurz (Abschnitt 6).

## 2. Abmelden aus der Mail

### Was verlangt ist

| Regel | Inhalt | Greift bei einigen Dutzend Mails/Woche? | Quelle |
|---|---|---|---|
| **Gmail, alle Absender** | SPF **oder** DKIM, TLS, Spam-Rate unter 0,3 %; gilt „ab 1. Februar 2024“ für alle Absender an Gmail-Konten | Formal ja (aber trivial erfüllt, wenn der Versanddienst DKIM signiert) | [P] `https://support.google.com/a/answer/81126?hl=en` |
| **Gmail, mehr als 5.000 Mails/Tag** | SPF **und** DKIM **und** DMARC; „marketing and subscribed messages must support one-click unsubscribe“ plus sichtbarer Link im Text | **Nein**, Menge liegt um Größenordnungen darunter | dieselbe Seite |
| **Yahoo, Bulk-Sender** | SPF+DKIM, DMARC mindestens `p=none`, List-Unsubscribe mit One-Click (RFC 8058 „highly recommended“), Abmeldungen binnen 2 Tagen, Abmeldung ohne Anmeldung | Schwelle: **auf der Seite keine Zahl gefunden**; bei dieser Menge vermutlich nein | [P] `https://senders.yahooinc.com/best-practices/` |
| **Outlook.com (Microsoft), mehr als 5.000 Mails/Tag** | SPF, DKIM, DMARC müssen bestehen; ab 5.5.2025 zunächst Junk, später Ablehnung mit `550 5.7.515` | **Nein**, Menge zu klein | [P] `https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/strengthening-email-ecosystem-outlooks-new-requirements-for-high%E2%80%90volume-senders/4399730` |
| **RFC 8058 (One-Click)** | `List-Unsubscribe` mit einer HTTPS-URI **und** `List-Unsubscribe-Post: List-Unsubscribe=One-Click`; beide Header **müssen von der DKIM-Signatur abgedeckt** sein; URI muss Empfänger und Liste identifizieren; der POST darf **keine Cookies, keine HTTP-Authentifizierung** enthalten; der Absender darf **nicht weiterleiten** | Technischer Standard, nicht Pflicht für Kleinsender | [P] `https://www.rfc-editor.org/rfc/rfc8058.txt` |

**Einschätzung:** Die Mengenschwellen großer Postfachanbieter greifen bei dieser Last nicht. Empfänger sind zudem überwiegend Firmenpostfächer (vermutlich Exchange Online, nicht Outlook.com); deren Filter bewerten den Absender unabhängig von der Menge, und was sie verlangen, habe ich **nicht** belegt. Praktisch sinnvoll und fast ohne Aufwand: SPF, DKIM und DMARC auf der Absender-Subdomain, dazu One-Click. Eine „Abo-Mail“ ist laut Gmail-Wortlaut („subscribed messages“) genau der Fall, für den One-Click vorgesehen ist.

**Rechtlich (Deutschland):**
- **Gesichert [P]:** § 7 Abs. 2 Nr. 2 UWG verbietet **Werbung** per E-Mail ohne vorherige ausdrückliche Einwilligung; § 7 Abs. 2 Nr. 3 lit. c verlangt bei werblichen Nachrichten eine gültige Adresse, an die man die Einstellung richten kann. [P] `https://www.gesetze-im-internet.de/uwg_2004/__7.html`
- **Einschätzung:** Eine vom Nutzer per Knopf bestellte Mitteilung über Änderungen an Bausteinen enthält keine Werbung für eigene oder fremde Produkte; § 7 UWG greift dann nicht. Unabhängig davon gilt für die Datenverarbeitung das Widerspruchs- und Widerrufsrecht der DSGVO (Art. 21, bei Einwilligung Art. 7 Abs. 3 „so einfach wie die Erteilung“). Ein Abmeldelink in jeder Mail ist deshalb die saubere Lösung, auch ohne dass § 7 UWG sie erzwingt.

### Zwei Wege im gesetzten Stack

| Weg | Funktion | Nachteil |
|---|---|---|
| **A. Signierter Link ohne Anmeldung** | Link in Fußzeile und in `List-Unsubscribe`; `POST` setzt `konto.digest_abgemeldet_am`, `GET` zeigt eine Bestätigungsseite mit Link „Abos verwalten (Anmeldung)“ | Die Seite liegt sonst hinter der Anmeldung: **eine öffentliche Ausnahme** in der Clerk-Middleware nötig, gesonderte Prüfung der Signatur |
| **B. Abo-Verwaltung nur nach Anmeldung** | Link in der Mail führt zur Kontoseite | Verstößt gegen RFC 8058 (kein Login beim POST), gegen Yahoos Hinweis „Provide an obvious … process that doesn't require users to log in“ und ist für Empfänger, deren Sitzung abgelaufen ist (Free: 7 Tage, siehe Vorbericht), umständlich |

**Empfehlung: Weg A** für „Sammelmail abbestellen“, Weg B für die Feineinstellung je Baustein. Skizze:
- **Token:** HMAC-SHA256 über `konto.id` und Zweck („digest“) mit einem Server-Geheimnis; ohne Ablauf (Abmelden muss immer gehen), idempotent. Ein Rotieren des Geheimnisses sperrt alle alten Links (Notausgang, falls ein Link missbraucht wird).
- **Ein Link, zwei Bedeutungen:** One-Click bestellt nur die Sammelmail ab; die Mitteilungen auf der Seite („Glocke“) bleiben, weil sie nicht per Mail laufen. Die Abos je Baustein bleiben unverändert, damit ein erneutes Einschalten ohne Neuaufbau geht.
- **Header:** `List-Unsubscribe: <https://…/abmelden/<token>>` (optional zusätzlich `mailto:`), `List-Unsubscribe-Post: List-Unsubscribe=One-Click`; ob der gewählte Dienst sie in die DKIM-Signatur aufnimmt, **vor dem Start an einer Testmail prüfen** („Original anzeigen“, `h=` enthält beide Header). Das habe ich bei keinem Dienst geprüft.
- **Abmeldezustand gehört in die eigene DB**, nicht in die Listenverwaltung des Versanddienstes (siehe oben). Eine Rückmeldung bei dauerhaften Zustellfehlern (Webhook des Dienstes, Hard Bounce) sollte später das Konto auf `mail_aktiv=false` setzen; fürs MVP genügt ein Blick ins Dashboard (Einschätzung).

## 3. Späterer Wechsel auf Tenant-SSO ohne Umbau

Gegen die Clerk-Doku vom 19.11.2026 geprüft (alle [P]):

| Befund | Quelle |
|---|---|
| Clerk verknüpft Konten **automatisch über die E-Mail-Adresse**. Social-Login: Stimmt die vom Anbieter gelieferte, verifizierte Adresse mit einem vorhandenen Konto überein, wird verknüpft; ist sie unverifiziert, startet Clerk eine Verifizierung und verknüpft danach. | `https://clerk.com/docs/guides/configure/auth-strategies/social-connections/account-linking.md` |
| **Enterprise-SSO:** Adressen vom IdP gelten „standardmäßig als verifiziert“, bei Treffer wird das **bestehende Konto verknüpft und der Nutzer angemeldet**. Liefert der IdP eine **unverifizierte** Adresse, verknüpft Clerk **nicht** und legt ein **neues Konto** an. | `https://clerk.com/docs/guides/configure/auth-strategies/enterprise-connections/account-linking` |
| Nach Aktivieren einer SAML-/EASIE-Verbindung werden alle Nutzer mit E-Mail der Domain zum IdP umgeleitet (Vorbericht). | `clerk-m365.md`, Abschnitt 1 |
| Seit **23.10.2026**: **Merge** per Backend-API (`POST /users/{user_id}/merge`): E-Mails, verbundene Konten, Organisationszugehörigkeiten und Metadaten wandern auf den behaltenen Nutzer, der andere wird gelöscht; `dry_run` möglich, **nicht rückgängig**, Webhook `user.merged`. **Nicht erlaubt**, wenn der **zu löschende** Nutzer ein Enterprise-SSO-Konto hat. | `https://clerk.com/changelog/2026-10-23-merge-users.md` |
| Entwicklungsinstanzen: SSO-Verbindungen kostenlos (Vorbericht). Webhooks für Datenabgleich sind im Free-Plan enthalten. | `clerk-m365.md`; `https://clerk.com/pricing.md` |
| Organisationen: im Free-Plan 100 „retained organizations“ und höchstens 20 Mitglieder je Organisation; **Verified Domains und automatische Einladungen** nur im kostenpflichtigen B2B-Add-on (100 $/Monat bzw. 85 $ jährlich). | `https://clerk.com/pricing.md` |

### Was im MVP stehen muss (Einschätzung auf dieser Doku-Lage)

1. **Eigener Schlüssel:** `konto.id` (UUID) ist Primärschlüssel und Fremdschlüssel von `abo`, `mitteilung`, `versand`. `clerk_user_id` ist eine **eindeutige, aber austauschbare** Spalte. Grund: Ein Merge nach dem SSO-Wechsel löscht einen der beiden Clerk-Nutzer; die Nutzerkennung ändert sich dann, die Abos dürfen es nicht.
2. **E-Mail als Attribut, nicht als Schlüssel.** Clerk verknüpft über die E-Mail, deshalb muss sie **bei der Anmeldung per Microsoft-Button und später per SSO dieselbe** sein. Nutzer können ihre Adresse in Clerk ändern; als Schlüssel in der eigenen DB wäre das ein stiller Konto-Verlust.
3. **Keine Clerk-Organisationen im MVP.** Verified Domains und Auto-Einladung kosten extra, die Abos hängen am Konto, nicht an einer Organisation. Ein Mandantenfeld in der eigenen DB wäre eine Verallgemeinerung auf Vorrat; weglassen.
4. **„Verify at sign-up“ eingeschaltet lassen** (ist Standard). Der Social-Login von Microsoft liefert E-Mail-Angaben aus Entra, die Doku rät zum optionalen Claim `xms_edov` (Vorbericht); bei SSO würde eine unverifizierte Adresse ein **Zweitkonto** statt einer Verknüpfung erzeugen, und die Abos blieben am alten Konto.
5. **Webhooks vorsehen und beachten:** `user.deleted` (Konto samt Abos löschen), `user.merged` (`clerk_user_id` umhängen), `user.updated` (E-Mail-Spiegel). Der Webhook-Endpunkt ist eine der öffentlichen Ausnahmen (Signaturprüfung nach Clerk-Doku, nicht im Einzelnen geprüft).
6. **Vor dem Umschalten in einer Entwicklungsinstanz proben:** Social-Microsoft-Nutzer anlegen, dann EASIE/SAML-Verbindung mit derselben Domain, Verknüpfung beobachten (dort kostenlos). Beantwortet auch, ob die E-Mail aus Social und aus SSO übereinstimmt (z. B. Alias gegenüber Hauptadresse): **nicht gefunden**, nur testbar.
7. **Notausgang bei Dubletten:** `merge` mit dem SSO-Nutzer als **behaltenem** Nutzer; der alte Social-Nutzer ist der zu löschende (er hat kein Enterprise-Konto). `clerk_user_id` auf der Konto-Zeile folgt über `user.merged`.
8. **Offboarding von Anfang an mitdenken:** Bei gelöschtem Entra-Nutzer widerruft Clerk nur die Sitzung (Vorbericht). Ein Konto, das nur über SSO ankommt, verschwindet damit nicht aus der DB; die Sammelmail ginge weiter. Entweder jemand löscht das Clerk-Konto (löst `user.deleted` aus), oder ein Bounce-Handler schaltet die Mails ab (Abschnitt 2).
9. **Mailversand über den Tenant später:** hinter derselben Versandfunktion austauschbar (siehe Abschnitt 1). Welche Wege Exchange Online/Graph dafür bietet, ist nicht Teil dieses Auftrags und **nicht geprüft**.

## 4. Eine Clerk-Instanz auch für den MCP-Zugang?

Kurz, die Tiefe liefert die Recherche zu #17.
- **Stand:** Clerk bietet als OAuth-Server **Client ID Metadata Documents (CIMD)** und **Dynamic Client Registration (DCR)**. CIMD ist der bevorzugte Weg, DCR legt einen öffentlichen, unauthentifizierten Registrierungsendpunkt an und wird nur für Clients empfohlen, die ihn brauchen. Beide sind im Dashboard unter „OAuth applications“ je „Client onboarding“ einzuschalten; bei CIMD lassen sich Clients einzeln freigeben und unbekannte Clients erlauben oder sperren; PKCE (S256) und die Zustimmungsseite sind Pflicht. Clerk nennt ChatGPT und Claude ausdrücklich als Clients, die oft ohne `scope` anfragen (Standard-Scopes einstellbar). [P] `https://clerk.com/docs/guides/configure/auth-strategies/oauth/how-clerk-implements-oauth.md`, `…/client-id-metadata-documents.md`
- **Tarif:** In `https://clerk.com/pricing.md` kommt kein Eintrag zu OAuth-Anwendungen/MCP vor, die Doku nennt keinen Planhinweis. Eine ausdrückliche Zusage für den Free-Plan: **nicht gefunden**.
- **Lücke für TanStack Start:** Die Seite „Build and authenticate an MCP server“ führt nur Next.js und Express auf (Stand 19.11.2026, wie im Vorbericht). [P] `https://clerk.com/docs/guides/ai/mcp/build-mcp-server.md`
- **Empfehlung (Einschätzung):** **Eine** Clerk-Anwendung für Seite und `/mcp`. Vorteile: ein Nutzerkreis, ein Invite-only-Hebel, keine zweite Nutzerverwaltung, die Konten und Abos sind für `status` später ohne Abgleich verfügbar. Die Activate-Entscheidung „eigene Anwendung, nicht die des KI-Kompass“ gilt für das **andere Produkt** und steht dem nicht entgegen. Offen bleibt nur das Verhalten der Audience-Prüfung in der TanStack-Variante; das klärt der Spike aus dem Vorbericht.

## 5. Datenmodell-Skizze

**Prinzip:** Clerk hält, was mit Identität und Sitzung zu tun hat; die eigene Postgres hält, was fachlich zur Landkarte gehört. Die eigene Tabelle `konto` ist ein **Spiegel**, der beim ersten angemeldeten Zugriff angelegt wird (Upsert aus dem Clerk-Token) und per Webhook aktuell bleibt. Nur so läuft die Sammelmail ohne Aufruf der Clerk-API je Empfänger.

| Bei Clerk | In der eigenen Postgres |
|---|---|
| E-Mail-Adresse(n), Name, Profilbild, Verbindung zum Microsoft-Konto, Sitzungen, Einladungen, Anmelde-Logs | `konto`, `abo`, `mitteilung`, `versand` |

| Tabelle | Mindestens nötige Felder | Anmerkung |
|---|---|---|
| **`konto`** | `id` (UUID, PK) · `clerk_user_id` (eindeutig, austauschbar) · `email` (Kopie für den Versand) · `mail_aktiv` (bool) oder `digest_abgemeldet_am` · `erstellt_am` | Kein Name, kein Foto (Datensparsamkeit); wird der Name in der Oberfläche gebraucht, kommt er aus Clerk. Kein „zuletzt gesehen“. |
| **`abo`** | `konto_id` (FK, `ON DELETE CASCADE`) · `baustein_id` (Text, ID aus `steckbriefe.json`) · `erstellt_am` · PK (`konto_id`, `baustein_id`) | Kein FK auf Bausteine (sie liegen in JSON). Wird eine Baustein-ID umbenannt oder entfernt, braucht es eine Prüfung beim Build/Prüflauf (Datenmodell-Regel, offene Folgerung). |
| **`aenderung`** | `id` · `baustein_id` · `typ` (roadmap · release_note · steckbrief) · `kurzfakt` · `quelle_url` · `erkannt_am` · `pruefung_id` | **Gehört zur Prüflauf-Spec (#26)**, hier nur referenziert; enthält keine personenbezogenen Daten und ist die gemeinsame Quelle für Mail, Mitteilung und später `status`. |
| **`mitteilung`** | `id` · `konto_id` (FK, `CASCADE`) · `aenderung_id` (FK) · `erzeugt_am` · `gelesen_am` (NULL = ungelesen) · optional `per_mail_am` · eindeutig (`konto_id`, `aenderung_id`) | „Gelesen“ ist eine Spalte, keine eigene Tabelle (Glocke: ungelesen bis Öffnen). Nur ein **Zeiger** auf die gemeinsame Änderung, damit sich Aufbewahrung (Abschnitt 7) und Änderungsliste getrennt steuern lassen. |
| **`versand`** | `id` · `konto_id` (FK, `CASCADE`) · `pruefung_id` · `gesendet_am` · `status` · `provider_message_id` · eindeutig (`konto_id`, `pruefung_id`) | Verhindert Doppelversand bei Wiederholung des Laufs; wird nach der Aufbewahrungsfrist gelöscht. Optional im MVP (Occam: nur wenn der Lauf wiederholbar sein muss). |

Nicht nötig im MVP: Organisations-/Mandantenfeld, Abo-Gruppen (Bereich, Kundenlandschaft; spätere Ausbaustufe laut Karte), Token-Tabelle für Abmeldelinks (HMAC ohne Zustand), eigene Rollen/Rechte (wer darf: Clerk-Einladung).

## 6. Datenschutz (DSGVO, Deutschland)

### Welche personenbezogenen Daten fallen wo an

| Ort | Daten | Aufbewahrung / Beleg |
|---|---|---|
| **Clerk** | E-Mail, Name, Profilbild und Anbieter-ID aus dem Microsoft-Konto, Sitzungen (Geräte-/Netzdaten), Einladungen, Anwendungs-Logs | Logs im Free-Plan **1 Tag**, Pro 7 Tage [P] `https://clerk.com/pricing.md`; Cookies `__client` (HttpOnly) und `__session` [P] `https://trust.clerk.com/` |
| **Versanddienst** | Empfängeradresse, Betreff/Inhalt (Namen abonnierter Bausteine, ableitbar: Interessenprofil), Zustellstatus, bei eingeschaltetem Tracking Öffnungen und Klicks samt IP/Gerät | Resend: Logs 30 Tage [P]; Postmark 45 Tage [P]; sonst nicht geprüft |
| **Eigene DB** | `konto` (E-Mail), Abos, Mitteilungen, Versandprotokoll | durch eigenes Löschkonzept (siehe unten und Abschnitt 7) |
| **Server/Logs** | Reverse-Proxy-Logs (IP, Pfad, User-Agent), Anwendungslogs, Datenbank-Backups | Coolify/Hetzner: **nicht geprüft**; Einschätzung: kurze Frist (z. B. 7–14 Tage), Anwendungslogs ohne Mailtexte, E-Mail-Adressen maskiert |
| **Browser** | Clerk-Sitzungs-Cookies | Technisch erforderlich; siehe TDDDG unten |

### Rechtsgrundlagen

- **Gesichert [P]:** Art. 6 Abs. 1 DSGVO nennt u. a. Einwilligung (a), Vertrag oder vorvertragliche Maßnahmen auf Anfrage (b), berechtigte Interessen (f). [P] `https://dsgvo-gesetz.de/art-6-dsgvo/` (Wiedergabe des Verordnungstexts; EUR-Lex war mit dem Abrufwerkzeug nicht erreichbar).
- **Einschätzung (nach Fall):**
  - *Konto und Anmeldung der eingeladenen Kollegen:* Art. 6 Abs. 1 lit. b (Nutzungsverhältnis, das die Kollegin mit der Anmeldung begründet) oder lit. f (Interesse am geschützten Betrieb). Die **Einladungsmail** selbst stützt sich eher auf lit. f. Zuordnung hängt davon ab, wer Verantwortlicher ist.
  - *Abo-Mail:* Art. 6 Abs. 1 lit. b, weil die Person das Abo per Knopf **bestellt** hat; sauberer Wortlaut an der Schaltfläche („Du erhältst wöchentlich eine Mail mit …“). Alternativ lit. a, dann mit Widerruf wie Erteilung. **Kein Newsletter-Marketing**, keine Werbung (siehe § 7 UWG, Abschnitt 2).
  - *Beschäftigtenkontext:* Nutzen die Kollegen die Seite als Teil ihrer Arbeit im Auftrag ihres Arbeitgebers und ist **der Arbeitgeber** Betreiber, kommen Beschäftigtendatenschutz (§ 26 BDSG) und möglicherweise Mitbestimmung ins Spiel; das habe ich **nicht geprüft**. Betreibt **Niko** die Seite für sich und lädt Kollegen freiwillig ein, ist er der Verantwortliche und die Firma nur als Arbeitgeber der Adressinhaber betroffen. Das ist die Vorab-Frage in der Kurzfassung.

### Drittlandübermittlung

| Empfänger | Sitz | Mechanismus | Beleg |
|---|---|---|---|
| **Clerk, Inc.** | USA; Unterauftragnehmer mit Datenstandort USA (u. a. Google Cloud, PlanetScale, Datadog, Cloudflare, Vercel, Turbopuffer); **EU-Region: nicht gefunden** | **EU-US Data Privacy Framework** (selbstzertifiziert, Hinweis vom 22.02.2024); die **DPA enthält SCC** (Modul 1/2/3) als Rückfall und gilt laut Trust Center für **alle Pläne einschließlich Hobby/Free**, ohne gesonderte Unterschrift | [P] `https://clerk.com/legal/dpf.md`, `https://clerk.com/legal/dpa.md`, `https://trust.clerk.com/` |
| **Versanddienst** | Resend: USA, Versand über AWS in Irland wählbar; Scaleway/Brevo/Mailjet: EU | Resend: SCC Modul 1/2 im DPA, DPF-Zertifizierung **nicht gefunden**; EU-Anbieter: keine Übermittlung durch den Anbieter selbst, Unterauftragnehmer **nicht geprüft** | [P] `https://resend.com/legal/dpa` |
| **Hoster Hetzner (über Coolify)** | Rechenzentrumsstandort noch festzulegen | Auftragsverarbeitung mit Hetzner (AVV): **nicht geprüft** | – |

**Rechtsstand des DPF [S, aus Suchtreffern; EUR-Lex-Eintrag selbst nicht geöffnet]:** Das EuG hat die Klage gegen den Angemessenheitsbeschluss am 03.09.2025 abgewiesen (T-553/23); die **Berufung (Rs. C-703/25 P) ist eingelegt (31.10.2025) und beim EuGH anhängig**, ein Urteil ist nicht gemeldet. Folge (Einschätzung): Sich allein auf das DPF zu stützen trägt ein Restrisiko, das SCC im AVV auffängt (Clerk hat sie; bei jedem Versanddienst vor der Entscheidung prüfen).

### Browser-Speicher und Hinweise auf der Seite

- **§ 25 TDDDG [P]** `https://www.gesetze-im-internet.de/ttdsg/__25.html`: Speicherung/Zugriff auf Endgeräteinformationen braucht Einwilligung, **außer** (Abs. 2 Nr. 2), wenn sie „unbedingt erforderlich“ ist, damit der Anbieter einen vom Nutzer ausdrücklich gewünschten Dienst bereitstellen kann. **Einschätzung:** Die Sitzungs-Cookies von Clerk fallen darunter; ein Einwilligungsbanner ist nicht nötig, **solange keine Statistik-, Werbe- oder Tracking-Dienste** dazukommen (auch nicht in Mails: Tracking-Pixel aus).
- **Datenschutzerklärung (Art. 13 DSGVO):** nötig, **vor** der Erhebung abrufbar, also schon auf der Anmeldeseite. Inhalte: Verantwortlicher, Zwecke und Rechtsgrundlagen, Empfänger (Clerk, Versanddienst, Hoster), Drittlandübermittlung, Speicherdauern (Abschnitt 7), Rechte, Beschwerderecht. Gesicherte Pflicht, Inhalt als Einschätzung.
- **Impressum:** § 5 Abs. 1 DDG verpflichtet „Diensteanbieter … für **geschäftsmäßige, in der Regel gegen Entgelt angebotene** digitale Dienste“. [P] `https://www.gesetze-im-internet.de/ddg/__5.html`. **Einschätzung:** Ein unentgeltliches Werkzeug für einen geschlossenen Kreis eingeladener Kollegen ist eher **nicht** darunter; ob „geschäftsmäßig“ bei einem beruflich genutzten Hilfsmittel trotzdem greift, ist Auslegungssache und nicht geprüft. Da die Anmeldeseite über die Domain öffentlich erreichbar bleibt und ein Impressum nichts kostet: **Impressum und Datenschutzerklärung als zwei öffentliche Seiten** in der Fußzeile (sichtbar auch vor der Anmeldung).

### Was eine Kontolöschung umfassen muss

Auslöser: Löschung im Clerk-Dashboard, Selbstlöschung im Clerk-Profil oder Löschung durch den Betreiber; Anspruch nach Art. 17 DSGVO (gesicherte Rechtslage, [P] `https://dsgvo-gesetz.de/art-17-dsgvo/`). Bestandteile (Entwurf):
1. **Clerk-Nutzer löschen.** Clerk entfernt Nutzerdatensatz, Kennungen und Sitzungen sofort; Reste bleiben in Backups **15 Tage**, bei E-Mail-Dienstleistern bis zu **37 Tage**, in Logs **15 bis 90 Tage**. [P] `https://trust.clerk.com/`
2. **Webhook `user.deleted`** löst in der eigenen DB das Löschen von `konto` samt `abo`, `mitteilung` und `versand` aus (Kaskade).
3. **Offene Einladung** an dieselbe Adresse löschen (`deleteInvitation()` löscht „permanently … and its stored invitation email“). [P] `https://clerk.com/docs/llms.txt`
4. **Versanddienst:** nichts zu löschen, wenn kein Kontaktverzeichnis geführt wird; Logs laufen nach 30 Tagen (Resend) ab. Bei Bedarf Löschantrag an den Dienst.
5. **Backups der Postgres** halten die Daten bis zum Ablauf der Backup-Frist; Frist festlegen, dokumentieren, und nach einer Wiederherstellung die gelöschten Konten erneut löschen (Löschliste).
6. **Auskunft/Übertragbarkeit** (Art. 15/20): Der Datenbestand pro Konto ist klein (Abos, Mitteilungen); Auskunft auf Anfrage genügt (Einschätzung).
7. **Ausscheiden aus der Firma:** Siehe Abschnitt 3, Punkt 8.

## 7. Aufbewahrung von Mitteilungen

**Übliche Praxis:** Benachrichtigungen in Anwendungen haben eine begrenzte Lebensdauer. Beispiel [P]: GitHub hält Benachrichtigungen im Posteingang, die nicht als „Saved“ markiert sind, **3 Monate**; markierte bleiben unbegrenzt. [P] `https://docs.github.com/en/subscriptions-and-notifications/concepts/about-notifications` (ein Suchergebnis nannte zuerst fünf Monate; die Seite selbst sagt drei). Weitere Beispiele habe ich nicht gesichtet.

Wichtig für die Wahl: Die **gemeinsame Änderungsliste** (`aenderung`) enthält keine Personendaten und bleibt, was auch immer mit den persönlichen Mitteilungen geschieht. Gelöscht wird nur der **Zeiger** (`mitteilung`), der verrät, wer was abonniert hatte.

| Option | Regel | Folgen |
|---|---|---|
| **A. 90 Tage ab Erzeugung** (empfohlen) | Täglicher Job löscht Mitteilungen, die älter als 90 Tage sind, gelesen oder nicht. | Einfach (eine Zeile SQL, eine Zahl in der Datenschutzerklärung), passt zum wöchentlichen Takt (rund 13 Läufe), sparsam mit Personenbezug. Wer drei Monate nicht hereinschaut, verpasst Mitteilungen auf der Seite; das Mailarchiv und „Neu seit …“ decken das ab. |
| **B. 12 Monate ab Erzeugung** | wie A, aber länger | Deckt jahreszyklische Fragen (z. B. Roadmap-Quartale) ab, mehr Personenbezug und mehr Anzeige. Kein technischer Nachteil bei dieser Datenmenge. |
| **C. Gelesen nach 30 Tagen, ungelesen höchstens 12 Monate** | zweistufig | Beste Balance aus „nichts geht ungelesen verloren“ und Sparsamkeit, aber zwei Regeln, zwei Zahlen und mehr Text in der Datenschutzerklärung. |

Ebenso: `versand` mit derselben Frist wie `mitteilung` (oder kürzer; es dient nur der Wiederholbarkeit des Laufs). Die Frist ist ein Wert in der Konfiguration; Wechsel von A nach B ist ohne Migration möglich.

## Offen / nicht gefunden / nicht geprüft

- **Verantwortlicher** (Niko als Person/Unternehmen oder Firma) und damit Rechtsgrundlage, Beschäftigtendatenschutz, Impressum: ungeklärt, Frage an Niko.
- Invite-only im **Free**-Plan und Verhalten eines Eingeladenen beim Microsoft-Button: weiterhin offen (Vorbericht).
- **Planbindung** von OAuth/CIMD/DCR bei Clerk: kein Planhinweis gefunden. TanStack-Variante des MCP-Leitfadens: nicht vorhanden.
- **EU-Region** bei Clerk: nicht gefunden (Unterauftragnehmer-Standorte USA laut Trust Center).
- Ob E-Mail aus Social-Login und aus Tenant-SSO bei derselben Person übereinstimmen (Alias, Hauptadresse): nicht gefunden, nur im Test zu klären.
- Je Versanddienst nicht geprüft: Wortlaut des AVV bei Brevo, Mailjet, Scaleway, Postmark; eigene Header (`List-Unsubscribe`) bei Brevo, Postmark, SES, Scaleway; ob die Header in der DKIM-Signatur stehen (bei **keinem** Dienst getestet); DPF-Zertifizierung von Resend; Mailjet-Logo bei API-Mails.
- **Hetzner:** Rechenzentrumsstandort und AVV nicht geprüft; Dauer der Server-/Proxy-Logs und Backup-Frist der Postgres sind nicht entschieden.
- Anforderungen von **Exchange Online** an externe Absender (Firmenpostfächer): nicht belegt. Mengen-Schwelle bei Yahoo: auf der Seite keine Zahl gefunden.
- DSGVO-Text wurde über `dsgvo-gesetz.de` (Wiedergabe, [S]) gelesen, nicht über EUR-Lex; Beschluss-Nummer des DPF-Angemessenheitsbeschlusses nicht gegengelesen. Rechtsstand Latombe/C-703/25 P stammt aus Suchtreffern ([S]).
- Clerk-Doku trägt auf jeder Seite „Last updated on Nov 18, 2026“; das ist vermutlich das Build-Datum, echte Änderungsdaten: nicht gefunden.
