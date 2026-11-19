# Recherche: Welche fehlenden Bausteine kommen dazu? (Stand 19.11.2026)

Beantwortet Issue #6. Niko wählt aus; der Bericht liefert je Kandidat Fakten und eine Empfehlung. Geschrieben wurden keine Steckbriefe, `data/` ist unverändert.

## Wie die Quellen geprüft wurden (bitte zuerst lesen)

Quellen sind mit **[P]** (primär: SAP, Regulierer) oder **[S]** (sekundär: Partner, Analysten, Blogs) markiert. Alle Abrufe und Suchen liefen am **19.11.2026**. Die Prüfstufe steht hinter jeder Quelle:

- **gelesen**: Seite abgerufen, Inhalt gelesen, Aussage geprüft.
- **Treffer**: URL und Auszug erschienen in einer Websuche; die Seite selbst wurde **nicht** abgerufen. Die Aussage stammt aus dem Suchauszug und ist nicht im Volltext geprüft.
- **Login**: SAP-Hinweis hinter S-User; nur der Titel ist bekannt (aus [P]-Seiten, die ihn nennen).

**Warum so wenige „gelesen“ bei SAP-Quellen:** `robots.txt` von `help.sap.com`, `www.sap.com`, `support.sap.com`, `learning.sap.com`, `news.sap.com`, `api.sap.com`, `blogs.sap.com`, `pages.community.sap.com` verbietet Bots (`Disallow: /`), `community.sap.com` antwortete mit 403. Das deckt sich mit dem Befund aus #19. Ich habe die Seiten deshalb nicht systematisch abgerufen. **Vor dieser Feststellung** habe ich einzelne Abrufe gemacht: eine Seite auf `support.sap.com` (Business Suite 7, gelesen), zwei auf `pages.community.sap.com` (SAP GUI Family, Business Client, gelesen), je einen Fehlversuch auf `news.sap.com` (404) und `community.sap.com` (403, auch mit Browser-Abruf), und ein PDF von `help.sap.com` (heruntergeladen, **ungelesen wieder gelöscht**). Diese drei gelesenen SAP-Seiten fließen in den Bericht ein; danach habe ich keine SAP-Hosts mehr abgerufen.

Folge: „Treffer“-Quellen sind in der Steckbrief-Runde (#18) von Niko oder per Browser mit Anmeldung gegenzulesen, bevor `belegt: "ja"` gesetzt wird. Nicht-SAP-Quellen (SAPinsider, ARKYN, Evora, saptechnicalguru, ondevicesolutions) durften abgerufen werden und sind „gelesen“.

## Übersicht

| Kandidat | Status | Bereich (neu, #4) | Empfehlung | Quellenlage |
|---|---|---|---|---|
| SAP ERP 6.0 / ECC (SAP Business Suite 7) | auslaufend: Mainstream bis 31.12.2027, optionale Extended bis 31.12.2030 | `core` | **aufnehmen** (Ausgangssystem der Auswirkungsanalyse) | gut: 1 [P] gelesen, 1 [S] gelesen |
| Application Interface Framework (AIF) | aktiv, kein Abkündigungshinweis | `int` | **aufnehmen** (klein) | mittel: 2 [P] nur Treffer |
| Central Business Configuration (CBC) | aktiv, bisher nur Public Edition | `tool` | **aufnehmen** | mittel: 3 [P] nur Treffer |
| SAP GUI (mit SAP Business Client) | aktiv; ältere Versionen laufen aus (Windows 8.00: 31.07.2027) | `core` | **aufnehmen** | gut: 2 [P] gelesen, 1 [S] gelesen |
| Output Management / Formulare | aktiv; Adobe Document Services auf AS Java läuft aus (2027/2030) | `core` | **aufnehmen** | mittel: 1 [P] Treffer, Rest [S] |
| SAP Service and Asset Manager (SSAM) | aktiv; je Release rund 2 Jahre Mainstream | `lob` | **als Teil von `fsm` erwähnen** (Aufnahme nur bei EAM-Fokus) | mittel bis schwach: 1 [P] Treffer, 3 [S] gelesen |
| SAP Cloud Integration for data services (CI-DS) | aktiv; keine Abkündigung gefunden | `data` | **als Teil von `ibp` erwähnen** | schwach: nur Treffer |
| Basis: HANA System Replication | aktiv | `ops` | **aufnehmen** | mittel: 3 [P] Treffer |
| Basis: Systemkopie / -aktualisierung | kein Produkt, Verfahren | `ops` | **aufnehmen** | mittel bis schwach |
| Basis: SAP Web Dispatcher | aktiv, keine Daten | `ops` | **aufnehmen**, niedrige Priorität | schwach |
| Basis: SAProuter | aktiv, keine Daten | `ops` | **weglassen** | schwach |
| `central-finance` (vorhanden) | aktiv (folgt S/4HANA) | `core` | **Quellen nachtragen** | gut: 3 bis 4 [P] Treffer vorhanden |

Wenn alles mit „aufnehmen“ kommt: 154 + 8 = 162 Bausteine (ECC, AIF, CBC, GUI, Output Management, HSR, Systemkopie, Web Dispatcher).

## Takeaway

- **ECC ist der wichtigste Neuzugang.** Die Kundenlandschaft braucht ein Ausgangssystem, an dem die Wartungsenden 2027 und 2030 hängen. Heute stehen sie verstreut in `transition-option`, `tdms`, `is-u` und `solman`. Achtung Namensfalle: der vorhandene Baustein `business-suite` ist die **neue** Paketierung seit 2025, nicht Business Suite 7.
- **SAP GUI und Output Management** bringen harte, versionsbezogene Daten für die Auswirkungsanalyse (GUI 8.00, Business Client 8.00, ADS auf AS Java).
- **Basis** wird mit HSR und Systemkopie am ehesten gestärkt; Web Dispatcher und SAProuter haben keine Lebenszyklusdaten und sind schwach belegt.
- **`central-finance` hat tragfähige Primärquellen** (SAP-Help-Administrationsleitfaden, SAP-Learning-Kurs, SAP-Training); sie sind nur nicht im Volltext geprüft.
- **Utilities:** `prm` ist im Schnitt aus #4 als Utilities-Baustein geführt, ist aber branchenübergreifend. Zwei Utilities-Bausteine (`eda-at`, `redispatch`) haben schwache Quellenlage.
- **Nebenbefunde für bestehende Steckbriefe:** `fsm` nennt noch den Altnamen „SAP Asset Manager“; `hana-db` hat kein Wartungsdatum, obwohl HANA 2.0 SPS 08 vier Jahre Wartung hat; `prm` kennt das Wartungsende von MRS nicht (Sekundärquelle: 31.12.2027).

---

## 1. SAP ERP 6.0 / ECC (SAP Business Suite 7)

**Namen.** SAP nennt den Umfang „SAP Business Suite 7 core applications“: SAP ERP 6.0, SAP CRM 7.0, SAP SCM 7.0, SAP SRM 7.0 und „SAP Business Suite powered by SAP HANA“, jeweils die **jüngsten drei Erweiterungspakete**. „ECC“ (SAP ERP Central Component) ist der Alltagsname der Kernkomponente von SAP ERP 6.0; die SAP-Seite selbst sagt „SAP ERP 6.0“. Welche Erweiterungspakete konkret zählen: **nicht gefunden** (Hinweis 2881788 hinter Login).

**Lebenszyklus (harte Daten).**
- Mainstream-Wartung bis **Ende 2027** (31.12.2027). Danach optional **Extended Maintenance** vom Beginn 2028 bis Ende 2030, Aufschlag **zwei Prozentpunkte** auf die Wartungsbasis. Wer sie nicht nimmt oder wessen Frist abläuft, erhält „customer specific maintenance“. Angekündigt am 4.2.2020. [P] https://support.sap.com/en/release-upgrade-maintenance/maintenance-information/maintenance-strategy/s4hana-business-suite7.html, gelesen.
- Dieselben Daten bestätigt SAPinsider vom 28.9.2026. [S] https://sapinsider.org/blogs/sap-support-deadlines-2027-2030-2033/, gelesen.
- **Transition Option bis 2033** (Eigenschaften laut SAPinsider [S], gelesen, die sich auf „SAP's published prerequisites“ beruft): Abo, kaufbar ab 2028, nutzbar 2031 bis 2033, ausdrücklich **keine Wartungsverlängerung**; System muss vor dem 31.12.2030 nach ERP, private edition auf HANA, mindestens 2 TB, mit Max Success Plan (kostenpflichtig); Umfang betrifft ECC, nicht CRM/SCM/SRM; Eignung steht in SAP-Hinweis 3591251 (Login); Aufschlag 20 % bei Vertrag 2026, für 2027 oder später noch nicht genannt.
- Wo die Fakten schon stehen: Daten 2027-12-31 und 2030-12-31 in `transition-option` und `tdms`; ECC-Wartung IS-U in `is-u`.

**Widersprüche.**
- Frist der HANA-Überführung: SAPinsider (und EPI-USE laut `transition-option`) nennen Ende 2030, Consilio (laut `transition-option`) Ende 2031. Offen.
- Ein Suchtreffer behauptete, Extended Maintenance setze eine vertragliche Zusage zur S/4HANA-Konvertierung voraus. Die SAP-Seite sagt das nicht, ein Beleg wurde nicht gefunden. **Nicht übernehmen.**

**Bereich und verwandt.** `core` („das ERP in seinen Editionen“). Alternative `mig`, dort ist aber die Beschreibung „Werkzeuge“, nicht Systeme. Vorschlag `verwandt`: `s4-onprem`, `transition-option`, `rise-grow`, `sum-dmo`, `readiness-check`. Vorschlag-ID: `ecc`.

**Überschneidung.** `business-suite` (SAP Business Suite, Paketierung seit Feb. 2025; aka „Autonomous Suite“) ist ein **anderes** Thema und trägt nur den Namen. `s4-onprem`, `s4-private`, `rise-grow`, `sum-dmo`, `btc`, `sdt`, `dmlt`, `snp-kyano`, `tdms` und rund 25 weitere erwähnen ECC im Text; ein Steckbrief für das Ausgangssystem selbst fehlt. Entscheidung für Niko: CRM/SCM/SRM im selben Baustein nennen (Vorschlag) oder getrennt führen.

**Relevanz Features.** Höchste im ganzen Bericht: Die Auswirkungsanalyse bekommt ein Ausgangssystem mit Regeln „Mainstream 2027-12-31, Extended 2030-12-31, Transition Option 2033“. Ohne diesen Baustein müssten Regeln an `transition-option`/`tdms` hängen.

**Empfehlung: aufnehmen.** Name im Datenmodell vorschlagen: „SAP ERP 6.0 (ECC) / SAP Business Suite 7“.

---

## 2. Application Interface Framework (AIF)

**Name.** „SAP Application Interface Framework“ (AIF). In SAP S/4HANA Cloud Public Edition heißt dasselbe Werkzeug **„Message Monitoring“**. Altnamen: nicht gefunden.

**Was und Lebenszyklus.**
- Der SAP-Hilfeüberblick führt AIF in den Ausgaben 2022, 2023, 2025 (mit der ABAP-Plattform 2025 ausgeliefert), in der Cloud als Message Monitoring. [P] https://help.sap.com/docs/SAP_APPLICATION_INTERFACE_FRAMEWORK_OVERVIEW, Treffer.
- AIF ist in S/4HANA Teil des Kerns und muss dort nicht mehr als Add-on installiert werden; die Support-Seite dazu ist alt. Transaktionen `/AIF/IFMON` (Interface Monitor) und `/AIF/CUST` (Customizing). [P] https://support.sap.com/en/alm/sap-focused-run/expert-portal/integration-cloud-monitoring/sap-aif.html, Treffer (der Suchtreffer erwähnt: Überwachung auch in Solution Manager und Focused Run).
- Für ältere Systeme (ECC) gibt es AIF 4.0 als Add-on. Anwendungshilfe 4.0, letzte Doku-Änderung Februar 2025 (SP06). [P] https://help.sap.com/doc/92ec5c6caf4d409a8477b1bcdc52015a/4.0/en-US/SAP_Application_Interface_Framework_40_EN.pdf, Treffer. Release-Grenzen des Add-ons und ein Wartungsende: **nicht gefunden** (SAP-Hinweise hinter Login).
- Kein Abkündigungshinweis gefunden, kein hartes Datum.

**Bereich und verwandt.** `int`. Vorschlag `verwandt`: `central-finance`, `slt`, `s4-apis`, `focused-run`, `solman`. Vorschlag-ID: `aif`.

**Überschneidung.** `central-finance` (`wie`, `test`: Fehlerbehandlung über AIF; bestätigt: Fehler beim Laden von Kosten- und CO-Objekten laufen über AIF im Namensraum `/FINCF`, Administrationsleitfaden), `slt` (`test`). AIF hat keinen eigenen Steckbrief.

**Relevanz Features.** Gering für die Auswirkungsanalyse (kein Datum). Hoch für Integration und Test: Fehlermonitor ist Abnahmegegenstand in Abstimmungstests.

**Empfehlung: aufnehmen**, als kleiner Steckbrief. Ersatzweise als Absatz in `central-finance` und `slt`.

---

## 3. Central Business Configuration (CBC)

**Name.** „SAP Central Business Configuration“. Altnamen: nicht gefunden.

**Was und Status.**
- Zentrales Konfigurationswerkzeug für SAP-Cloud-Lösungen; „starting with SAP S/4HANA Cloud Public Edition“, laut Übersicht Oktober 2026 **bisher nur Public Edition**. [P] https://help.sap.com/doc/sap-central-business-configuration-overview/SHIP3.0/en-US/SAP_Central_Business_Configuration_Overview.pdf, Treffer. Unterstützung für Cloud ERP Private: **nicht gefunden**.
- Arbeitsweise: Projekte in der App Project Experience; Workspaces für das Customizing-System (Mandant 100) und das Entwicklungssystem (Mandant 80); Transport je nach Landschaft in CBC (2-System) oder in S/4HANA Cloud (3-System); Configuration Localization Tool für rund 160 Länder ohne SAP-Lokalisierung. [P] https://help.sap.com/doc/sap-central-business-configuration-overview/LATEST/en-US/SAP_Central_Business_Configuration_Overview.pdf, Treffer; ergänzend [P] https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-public-edition/setting-up-the-implementation-workspaces_d7a9b791-d8a5-424b-ae47-1d24f35cd2f1, Treffer.
- Abgrenzung zu Cloud ALM laut Übersicht: Cloud ALM für Einführung und Betrieb insgesamt, CBC für die Konfiguration der Projekte.
- Laufend neue Funktionen: „What's New … 2607 FD1 mit S/4HANA Cloud 2608“ und „2607 FD2“. [P] https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-sap/what-s-new-in-sap-central-business-configuration-2607-fd1-with-sap-s-4hana/ba-p/14476273, Treffer.
- Keine Abkündigung, kein Wartungsende gefunden.
- W3 behauptet „Pflicht in Public-Cloud-Projekten“. Ein ausdrücklicher Satz dazu: **nicht gefunden**. Vor Aufnahme in den Text prüfen.

**Bereich und verwandt.** `tool` (Toolchain & Methodik): Werkzeug der Einführung. Alternative `core`. Vorschlag `verwandt`: `s4-cloud-erp`, `cloud-alm`, `activate`, `rise-grow`. Vorschlag-ID: `cbc`.

**Überschneidung.** Keine: weder „Central Business Configuration“ noch „CBC“ kommen in einem Steckbrief vor.

**Relevanz Features.** Mittel: Regel „Public-Edition-Projekt → CBC einplanen“ ist denkbar, ein hartes Datum gibt es nicht.

**Empfehlung: aufnehmen.** Für Berater in GROW-Projekten das tägliche Werkzeug und im Bestand völlig unsichtbar.

---

## 4. SAP GUI (mit SAP Business Client)

**Name.** „SAP GUI Family“ mit SAP GUI for Windows, SAP GUI for the Java Environment, SAP GUI for HTML. Daneben „SAP Business Client“ (Shell mit Fiori-Launchpad-Anbindung). [P] https://pages.community.sap.com/topics/gui/family, gelesen.

**Lebenszyklus (harte Daten).**
| Komponente | Datum | Quelle |
|---|---|---|
| SAP GUI for Windows 8.10 | allgemein verfügbar 16.07.2026; unterstützt bis **30.06.2029** | [P] SAP-Community-Blog https://community.sap.com/t5/technology-blog-posts-by-sap/sap-gui-for-windows-8-10-is-coming-general-availability-as-of-16th-of-july/ba-p/14434135, Treffer (Seite per 403 gesperrt); [S] https://www.saptechnicalguru.com/sap-gui-8-10/, gelesen |
| SAP GUI for Windows 8.00 | Wartungsende **31.07.2027**; „limited support“ ab 13.01.2027 | [S] saptechnicalguru (gelesen) nennt 31.07.2027; das Datum 13.01.2027 stammt nur aus einem Suchauszug, Quelle nicht eindeutig |
| SAP GUI for Windows 7.70 | Wartungsende 09.04.2024 | [P] https://community.sap.com/t5/technology-blog-posts-by-sap/sap-gui-for-windows-8-00-is-coming-on-27th-of-january-2023-new-features/ba-p/13570993, Treffer |
| SAP GUI for Java 7.80 | Support endete 31.03.2025; 8.10 ist letzte Version mit macOS Intel | [P] https://pages.community.sap.com/topics/gui/family, gelesen |
| SAP Business Client 8.00 | Wartungsende **12.01.2027**; 8.10 verbindet Joule mit nativen GUI-Transaktionen | [P] https://pages.community.sap.com/topics/business-client, gelesen |

Maßgebliche Quelle für alle Daten ist SAP-Hinweis **147519** (Login). **Widerspruch:** EoLHQ (https://eolhq.com/product/sap-gui-8-10/, nur Treffer) schreibt, das Wartungsende von 8.10 sei noch nicht veröffentlicht; SAP-Blog und saptechnicalguru nennen 30.06.2029. Ich folge SAP. Die Familienseite listet unter Downloads noch 7.70/8.00 und nicht 8.10 für Windows, sie ist also nicht vollständig aktuell.

**Bereich und verwandt.** `core` (wie `fiori`). Vorschlag `verwandt`: `fiori`, `s4-onprem`, `s4-private`, `work-zone`, `tricentis-ect`. Vorschlag-ID: `sap-gui`.

**Überschneidung.** SAP GUI wird erwähnt in `fiori` (einzige UI in Cloud-Editionen, SAP GUI nur On-Premise/Private), `s4-cloud-erp`, `s4-onprem`, `is-u`, `tricentis-ect`, `calm-test-automation`, `walkme-dap`, `uidp` und weiteren; ein Steckbrief zum Client selbst fehlt.

**Relevanz Features.** Hoch: versionsbezogene Wartungsenden sind genau der Stoff der Auswirkungsanalyse; für Test ist die Clientbasis (GUI-Skripting, Automatisierung) relevant. Einschränkung: Die Kundenlandschaft markiert Bausteine, nicht Versionen. Die Daten gehören deshalb in `daten` als Text je Version.

**Empfehlung: aufnehmen** als „SAP GUI und SAP Business Client“ in einem Steckbrief.

---

## 5. Output Management / Formulare

**Namen.** „SAP S/4HANA Output Management“ (Ausgabesteuerung auf Basis von BRF+; Adobe Forms als Standardtechnik; in der Public Edition als Cloud-Funktion). Formularwerkzeug: „**SAP Forms service by Adobe**“ (BTP, Cloud Foundry; Vorgänger „SAP Cloud Platform Forms by Adobe“, „SAP Interactive Forms by Adobe“). On-Premise: **Adobe Document Services (ADS)** auf dem AS Java. Ältere Techniken: SAPscript, Smart Forms (laut SAP Learning in S/4HANA On-Premise weiter unterstützt). [P] https://learning.sap.com/courses/configuring-billing-and-invoicing-in-sap-s-4-hana-utilities/sap-s-4-hana-output-management-and-new-form-technologies, Treffer.

**Lebenszyklus (harte Daten).**
- NetWeaver AS Java 7.5 (Träger von ADS): Mainstream-Ende **Ende 2027**, Extended Maintenance **Ende 2030**, danach keine Updates. Empfohlener Weg ist SAP Forms service by Adobe, als On-Premise-Nachfolger ist ADS auf **SAP HANA XSA** angekündigt. [P] https://community.sap.com/t5/technology-blog-posts-by-sap/maintenance-strategy-adobe-forms-on-premise/ba-p/13627957 (alternativ `blogs.sap.com/t5/technology-blogs-by-sap/maintenance-strategy-adobe-forms-on-premise/ba-p/13627957`) und https://pages.community.sap.com/topics/adobe-forms, beide Treffer.
- Termin des XSA-Nachfolgers: laut Forms-Themenseite für Q1 2027 geplant; der Wartungsstrategie-Blog nannte ursprünglich den Supportzeitraum von S/4HANA 2025, und ein DSAG-Beitrag deutete eine Verschiebung an. Ob er geliefert ist: **nicht gefunden**. SAP-Produktseite: https://www.sap.com/documents/2025/05/d4e1a61d-067f-0010-bca6-c68f7e60039b.html, Treffer.
- NetWeaver bis 7.4 laufen nur mit der Neo-Variante des Forms-Dienstes; Neo endet am 31.12.2028 (deckt sich mit `neo`). [S] https://community.sap.com/t5/technology-blog-posts-by-members/integrating-netweaver-7-4-systems-with-sap-forms-service-by-adobe-on-cloud/ba-p/14021683, Treffer.
- SAPscript/Smart Forms: ein eigenes SAP-Enddatum für S/4HANA: **nicht gefunden**. Dass sie in den Cloud-Editionen fehlen, steht nur in einer Sekundärquelle; ein Datum aus Drittseiten (Bezug auf Business-Suite-Enden) ist widersprüchlich und **nicht übernehmen**.
- Hinweis 3464370 (AS-Java-Ende, Optionen) und 3617043 (XSA, Lizenz) nur über Suchauszüge bekannt, Login.

**Bereich und verwandt.** `core` (eingebaute Komponente). Alternative `ext`, weil Formulare angepasst werden. Vorschlag `verwandt`: `s4-onprem`, `s4-cloud-erp`, `key-user-ext`, `btp`, `neo`. Vorschlag-ID: `output-management`.

**Überschneidung.** Keine: Die Fundstellen in den Steckbriefen sind Alltagswörter (Ausgabe, Formular), nicht das Thema.

**Relevanz Features.** Mittel bis hoch: ADS auf AS Java ist ein klares Wartungsende (2027/2030) für Kunden mit Formularen. Für Test: Formulare und Druck gehören in jeden Regressionsumfang.

**Empfehlung: aufnehmen.** Wegen der dünnen SAP-Quellenlage und der XSA-Unsicherheit mit `belegt: "teilweise"` einplanen.

---

## 6. SAP Service and Asset Manager (SSAM)

**Name.** „SAP Service and Asset Manager“. Mit Release **2205** umbenannt aus „SAP Asset Manager“. [P] https://help.sap.com/docs/service-asset-manager, Treffer. Vorgänger: SAP Work Manager (Agentry/SAP Mobile Platform), SAP Inventory Manager, SAP Service Manager.

**Fakten.**
- Mobile App (iOS, Android, Windows) mit vier Rollenbildern: Internal Maintenance, Inventory Processing, Field Technician, Safety Technician. [S] https://www.evorait.com/solutions/mobile/farewell-sap-work-manager/ (23.5.2024), gelesen.
- Technik: SAP BTP Mobile Services, Mobile Development Kit (MDK), im Backend MAIF (Mobile Application Integration Framework), per Hinweis oder S/4HANA-Upgrade. [S] https://ondevicesolutions.com/upgrading-sap-service-and-asset-manager/ (20.2.2025), gelesen.
- **Release-Zyklus:** rund zwei Jahre Mainstream je Version. [S] ondevicesolutions (gelesen). Termine laut ARKYN (16.10.2026): SSAM **2410: 30.11.2026**, **2505: 31.05.2027**, **2511: 31.12.2027**. [S] https://www.arkyn.io/blog/sap-ecc-to-s4hana-migration-maintenance-guide, gelesen. Quelle ist ein Beratungsblog; SAP verweist selbst auf die Product Availability Matrix (Login).
- Work Manager: Mainstream-Ende Ende 2024 (Evora [S], gelesen); die Plattform-Standardunterstützung (SAP Mobile Platform) endet laut ARKYN am **31.12.2026**. [S], gelesen. Eine SAP-Primärquelle dazu: **nicht gefunden**.
- Abkündigung von SSAM: **nicht gefunden.**

**Bereich und verwandt.** `lob`. Vorschlag `verwandt`: `fsm`, `apm`, `s4-onprem`, `prm`, `btp`.

**Überschneidung.** `fsm` (`was`, `wann`) nennt „SAP Asset Manager“ als Instandhaltungsalternative: **Altname**, sollte „SAP Service and Asset Manager“ heißen. `apm` und `prm` stehen thematisch daneben. `prm`: Wartungsende von MRS ist dort „unbekannt“; ARKYN nennt **MRS 10.0: 31.12.2027 (verlängert bis 2030)** [S], gelesen. Zu MRS zusätzlich: https://leverx.com/blog/sap-mrs-end-of-maintenance (Treffer).

**Relevanz Features.** Gering bis mittel: das zweijährige Release-Raster passt schlecht zu Bausteinen ohne Version.

**Empfehlung: als Teil von `fsm` erwähnen** (Altname korrigieren, Abgrenzung zu Field Service Management). Eigenen Baustein nur, wenn Instandhaltung/EAM Zielgruppe sein soll.

---

## 7. SAP Cloud Integration for data services (CI-DS)

**Name.** „SAP Cloud Integration for data services“ (CI-DS), früher „SAP HANA Cloud Integration for data services“ (HCI-DS). Nicht mit `cloud-integration` (Cloud Integration der Integration Suite) oder `data-services` (SAP Data Services, On-Premise-ETL) verwechseln.

**Fakten.**
- Datenintegration vor allem für IBP; SAP Learning führt CI-DS als erste Importoption für IBP, neben SAP Cloud Integration, Excel-Add-in und Real-Time Integration. [P] https://learning.sap.com/learning-journeys/exploring-the-core-functions-in-sap-ibp/identifying-data-import-options_af26c723-c829-4154-8f3d-a9587f7b7c7c, Treffer. Für große Mengen wird WS-RFC empfohlen. [P] https://blogs.sap.com/t5/supply-chain-management-blogs-by-sap/integrating-sap-datasphere-with-sap-integrated-business-planning-using-sap/ba-p/13643214, Treffer.
- Ausrichtung: SAP-Community-Beitrag „Product Positioning and Direction“: **kein Plan, CI-DS einzustellen**, weiter unterstützt für IBP-Fälle. [P] https://community.sap.com/t5/supply-chain-management-blog-posts-by-sap/sap-cloud-integration-for-data-services-product-positioning-and-direction/ba-p/13591861, Treffer. Der Beitrag ist nach Auszug rund 21 Monate alt.
- Wartungsende: Eine Community-Frage nennt den PAM-Eintrag „End of Mainstream Maintenance“ Dezember 2027 und die Ankündigung einer Aktualisierung Ende 2025; die URL ließ sich aus dem Suchergebnis nicht eindeutig zuordnen. **Als nicht belegt behandeln.** Neo-Bezug (Ende 31.12.2028): aus Suchzusammenfassung, nicht geprüft.
- Harmonisierung der Integrationspfade im IBP („Harmonized Planning Area“) deutet Zusammenlegung an, sagt aber nichts über CI-DS. [P] https://learning.sap.com/courses/discovering-sap-ibp-harmonized-planning-area/harmonization-of-integration-tools-and-processes, Treffer.

**Bereich und verwandt.** Falls aufgenommen: `data` (Replikation/Datenintegration). `verwandt`: `ibp`, `data-services`, `cloud-integration`, `datasphere`, `neo`.

**Überschneidung.** `ibp` nennt CI-DS in `wie`, `s4`, `hinweis` (laut `hinweis` Hintergrundwissen, nicht belegt). `data-services` ist ein anderes Produkt.

**Relevanz Features.** Gering: kein belegtes Datum.

**Empfehlung: als Teil von `ibp` erwähnen** (Quellen aus diesem Abschnitt nachtragen, Abgrenzungssatz in `data-services`). Eigenen Baustein erst, wenn ein SAP-Wartungsdatum belegt ist.

---

## 8. Basis-Themen

`ops` hat nach #4 sechs Bausteine (`rise-ecs`, `sovereign-cloud`, `focused-run`, `lama`, `rise-grow`, `transition-option`). Alle vier Themen passen dort hinein. In keinem Steckbrief kommen „System Replication“, „HSR“ oder „SAProuter“ vor, „Web Dispatcher“ steht einmal in `rise-ecs`.

### 8.1 HANA System Replication (HSR)

- **Name:** SAP HANA System Replication; Teil von SAP HANA, nicht eigenes Produkt. [P] SAP HANA System Replication Guide (z. B. Ausgabe 2.0.07), https://help.sap.com/doc/c81e9406d08046c0a118c8bef71f6bdc/2.0.07/en-US/SAP_HANA_System_Replication_Guide_en.pdf, Treffer; die Ausgabe für SPS 08 war im Suchindex **nicht** zu finden. Einstieg: [P] https://developers.sap.com/tutorials/dt-sys-replication-part1.html, Treffer. FAQ-Hinweis 1999880 (Login).
- **Fakten:** Spiegel-Konfiguration (Secondary als Kopie des Primary) für Hochverfügbarkeit und Notfallwiederherstellung; ab HANA 2.0 Verbindung per Zertifikaten. Backup ist ein eigenes Thema und wurde **nicht** untersucht.
- **Harte Daten zur Plattform (Nebenbefund für `hana-db`):** HANA 2.0 SPS 08 allgemein verfügbar **20.11.2024**; neue Versionen alle zwei Jahre im 4. Quartal, je 4 Jahre Wartung. [P] https://community.sap.com/t5/technology-blog-posts-by-sap/sap-hana-2-0-sps-08-released-safeguarding-customer-investments-and/ba-p/13942543, Treffer. Ein Drittanbieter-Tracker (Quelle im Suchergebnis nicht benannt) nennt als Wartungsende Nov. 2028. SPS 07: April 2028 [S] https://masteringsap.com/wp-content/uploads/2023/11/SAP-HANA-2.0-Revision-and-Maintenance-Strategy.pdf, Treffer. SPS 09: **nicht gefunden**. Maßgeblich: SAP-Hinweis 2378962 (Login). `hana-db` hat heute keine Daten und kennzeichnet den Horizont als „nicht verifiziert“.
- **Bereich und verwandt:** `ops`; `hana-db`, `rise-ecs`, `s4-onprem`, `lama`. Vorschlag-ID: `hana-hsr`.
- **Überschneidung:** `rise-ecs` (aka „Disaster Recovery und Customer-Invoked Failover“) kennt DR aus Betriebssicht, nennt aber HSR nicht.
- **Relevanz:** Mittel. Für die Basis-Rolle zentral; die HANA-Wartungsenden gehören eher in `hana-db`.
- **Empfehlung: aufnehmen.**

### 8.2 Systemkopie und Systemaktualisierung

- **Name:** System Copy (homogen/heterogen) mit Software Provisioning Manager (SWPM); „Systemaktualisierung“ (Refresh) als Betriebsprozess. [P] SAP-Hinweis 3474615 (Wissensdatenbank; Login, nur Titel aus Suchtreffer: Unterschied „Database content refresh“, „Database instance move“, „Backup/restore based copy“); Leitfäden auf `help.sap.com` (z. B. Konvertierungsleitfaden OP2023: https://help.sap.com/doc/2b87656c4eee4284a5eb8976c0fe88fc/2023/en-US/CONV_OP2023.pdf, Treffer, behandelt Konvertierung, nicht Kopie). Einen aktuellen offiziellen System-Copy-Leitfaden für S/4HANA hat die Suche **nicht** geliefert.
- **Fakten:** Eine homogene Kopie nutzt dasselbe Betriebssystem und dieselbe Datenbankplattform. Nacharbeiten nach der Kopie bei S/4HANA beschreibt ein Community-Beitrag [S] https://blogs.sap.com/2017/12/12/sap-s4hana-on-premise-post-system-copy-steps/, Treffer. Hartes Datum: **nicht gefunden**.
- **Überschneidung:** `lama` (kurz, was, s4, wann: Automatisierung von Systemkopien; Wartung endet 31.12.2027), `tdms` (Alternativen: Systemkopie mit Bereinigung), `dmlt` (test). Das Verfahren selbst hat keinen Steckbrief.
- **Bereich und verwandt:** `ops`; `lama`, `tdms`, `dmlt`, `rise-ecs`. Vorschlag-ID: `systemkopie`.
- **Relevanz:** Mittel: für Test (Testsysteme auffrischen, Anonymisierung) und für die Auswirkungsanalyse über `lama` (Ende 2027).
- **Empfehlung: aufnehmen**, als Verfahrenssteckbrief mit der Abgrenzung zu LaMa und TDMS. `belegt: "teilweise"`.

### 8.3 SAP Web Dispatcher

- **Name:** SAP Web Dispatcher (Software-Lastverteiler und Reverse Proxy vor ABAP-/Java-Systemen, typisch für Fiori). Aktuelle Version laut Blog 7.93 ([S] https://rupeshschavan.blogspot.com/2024/08/sap-web-dispatcher-release-installation.html, Treffer, 2024).
- **Quellen:** SAP Learning „Installing and Configuring SAP Web Dispatcher“ [P] https://learning.sap.com/courses/technical-implementation-and-operation-i-of-sap-s-4hana-and-sap-business-suite/installing-and-configuring-sap-web-dispatcher, Treffer; Hinweis 908097 (Release, Patches, Kompatibilität; Login); ältere NetWeaver-Hilfeseiten. Eine aktuelle, versionierte Hilfeseite: **nicht gefunden**.
- **Fakten:** Abwärtskompatibel (neuester Web Dispatcher bedient ältere Backends); Update wie ein Kernel-Update. Wartungsende: **nicht gefunden**.
- **Überschneidung:** `rise-ecs` (`wie`, erwähnt). **Bereich und verwandt:** `ops`; `fiori`, `rise-ecs`, `cloud-connector`, `s4-onprem`. Vorschlag-ID: `web-dispatcher`.
- **Relevanz:** Gering für die Features (kein Datum), mittel für Fiori-Architekten.
- **Empfehlung: aufnehmen, niedrige Priorität.** Wer wenig Neues will, ergänzt stattdessen einen Absatz in `fiori`.

### 8.4 SAProuter

- **Name:** SAProuter (SAP Router). [P] https://support.sap.com/remote-support/saprouter.html, Treffer. Dokumentation Hinweis 30289, sichere Konfiguration 1895350, Release-Rollout 1897597, Registrierung 28976 (alle Login; die Nummern nennt [S] https://www.saptechnicalguru.com/sap-router-tips-and-tricks/, gelesen, 22.10.2026 aktualisiert).
- **Fakten:** Netzwerk-Proxy zwischen SAP-Systemen und externen Netzen, vor allem für die Verbindung zum SAP-Support. Kein Wartungsende, kein Lebenszyklusereignis gefunden.
- **Überschneidung:** keine. **Bereich:** `ops`.
- **Relevanz:** Gering.
- **Empfehlung: weglassen** (oder ein Satz im Steckbrief `focused-run`/`rise-ecs`, wenn jemand nach Supportverbindungen sucht).

---

## 9. `central-finance`: Quellenlage

Heute `belegt: "nein"`, `quellen: []`, `lizenz`: „keine belastbare Angabe“.

**Es gibt tragfähige Primärquellen.** Alle als „Treffer“ geprüft (Auszüge, kein Volltext):

1. **Administrationsleitfaden Central Finance** (Teil der SAP-S/4HANA-Anwendungshilfe, Ausgabe 2023): Ersteinrichtung über SAP LT Replication Server (Ladeobjekte, Monitor `LTRC`), Fehler bei Kosten- und CO-Objekten über AIF im Namensraum `/FINCF`, Smoke-Test vor der Replikation. [P] https://help.sap.com/doc/a9616f4a29354fc297c58499b754e3f8/2023.000/en-US/loio4857c0540cf5ef05e10000000a4450e5.pdf. Der Suchtreffer ist nur „Document Version: SAP S/4HANA 2023“ betitelt; die Zuordnung zu Central Finance folgt aus dem Auszug. Ausgaben für 2022 FPS02, 2020 und 1909 FPS02 liegen unter derselben Kennung.
2. **SAP Learning, kostenloser Kurs** „Discovering the Value of SAP S/4HANA Central Finance“ (2 Stunden): Konzept und Nutzen der Bereitstellungsoption. [P] https://learning.sap.com/courses/discovering-the-value-of-sap-s-4hana-central-finance
3. **SAP Training S4F60 (Überblick) und S4F61 (Implementierung):** Ausgangsdaten aus SAP-ERP- und Nicht-SAP-Systemen in ein zentrales S/4HANA; S4F61 deckt Erstladung, Echtzeitreplikation, Fehlerbehandlung, Abstimmung und Berichte ab. [P] https://training.sap.com/course/S4F60 und https://training.sap.com/course/S4F61
4. Ergänzend [S]: Community-Blog eines Mitglieds zum Erstladen von Aufträgen (AUFK) mit SLT-Filtern gegen AIF-Fehler. https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-members/sap-central-finance-aufk-initial-load-design-considerations/bc-p/13506208, Treffer.

**Was sie bestätigen:** Die Aussagen im Steckbrief zu SLT und AIF stimmen mit dem Leitfaden überein. Zum **MDG-Mapping** ist keine Aussage geprüft.

**Was offen bleibt:**
- Offizielle Schreibweise: SAP Learning und Training schreiben „SAP S/4HANA for central finance“ (kleingeschrieben, als Bereitstellungsoption). Ob „SAP Central Finance“ noch der Produktname ist: **nicht gefunden**.
- Central Finance in der **Public Edition** und Lebenszyklus/Wartungsende: **nicht gefunden**; es folgt dem S/4HANA-Release.
- Lizenz und Paketierung: **nicht gefunden**.

**Empfehlung:** Quellen 1 bis 3 in `quellen` eintragen, nach Gegenlesen im Browser `belegt: "teilweise"` setzen.

---

## 10. Utilities-Spezifika (Branche, Schnitt aus #4)

Betroffen sind die sieben Bausteine aus #4. Heute liegen sechs in `lob` und `is-u` in `core`. Ob sie sichtbar bleiben, entscheidet Niko. Die Quellenlage je Baustein, aus den vorhandenen `quellen` eingeschätzt:

| Baustein | `belegt` | Quellen (P = SAP/Regulierer, S = sonstige) | Befund Quellenlage |
|---|---|---|---|
| `is-u` | ja | 10: P: Roadmap Explorer, Learning, News, API-Hub; S: ASUG, Gambit, innobu, 2 × ZfK, Natuvion | **gut.** Offen laut `hinweis`: Simplification Items, FI-CA, CVI; IDEX-AT nur Partnerseite; Roadmap Explorer war nicht lesbar |
| `cloud-for-energy` | ja | 5, alle SAP: Produktseite, Feature Scope Description, 2 × Learning, Blog von 2015 | **gut bis mittel.** Alles primär, aber der Blog ist von 2015; deutsche Spezifika (MaBiS, iMSys, §14a) offen |
| `maco-cloud` | ja | 10: P: Roadmap Explorer, Learning, Produktseite, BNetzA; S: rku.it, BDEW, innobu × 2, ZfK, e3mag | **gut.** Zu Mitteilung 58 und API-Scopes nur innobu (S), nicht gegen BNetzA-Originale geprüft |
| `redispatch` | teilweise | 9: P: BNetzA Mitteilung 54; Partner-Seiten im SAP Store (PROLOGA, cronos); `help.sap.com` nur Seitentitel; S: utiligence, ZfK, innobu × 2, adesso | **schwach** bei der SAP-Produktaussage (IM4G-Umfang, Lizenz, §14a: keine SAP-Aussage) |
| `eda-at` | teilweise | 9: P: SAP Learning, SAP-Blog 2024/25; S: DSC, energate, karriere.at, freelancermap und drei Behörden-/Hochschul-Seiten | **schwach.** Keine SAP-Primärquelle für IDEX-AT; Gründungsjahr nur aus karriere.at |
| `der` | ja | 7: P: Feature Scope Description, Produktseite, Learning; S: ASUG, SAPinsider, Powernaut, GitHub (archiviertes Beispiel) | **gut.** Abgrenzung zu `cloud-for-energy` hat SAP nicht erklärt |
| `prm` | ja | 5: P: API-Hub, Produktseite, Learning, SAP-Community-Beitrag; S: ASUG | **gut**, aber siehe unten |

**Linkprüfung der Nicht-SAP-Quellen** (HTTP-Status am 19.11.2026 aus meiner Umgebung, SAP-Hosts nicht abgerufen):
- `eda-at`: https://www.klimafonds.gv.at/wp-content/uploads/sites/16/10_Leo-Kammerdiener_EDA.pdf antwortet **404**. Die Seiten `tugraz.at` (EnInnov-2026-PDF) und `eddie-web.projekte.fh-hagenberg.at` lieferten **Timeout** (Netzwerkproblem meiner Umgebung nicht ausgeschlossen; erneut prüfen).
- Alle übrigen Nicht-SAP-Links der sieben Bausteine antworteten mit 200; `sapinsider.org` (DER) mit 403 gegen Skripte, das ist erwartbar.

**Einordnung:**
- **`prm` ist nicht utilitiesspezifisch.** SAP Project and Resource Management ist branchenübergreifend; im Steckbrief steht nur „bei Kapital- und Versorgerprojekten“ (`wann`). Der Schnitt in #4 führt `prm` trotzdem unter den sieben. Vorschlag: `prm` ohne `branche` führen (Niko entscheidet) und die Zahl auf sechs setzen.
- **`apm`** hat laut `hinweis` seit 2025 einen Utilities-Fokus, steht aber nicht in der Liste aus #4.
- **Quellenlage:** `eda-at` und `redispatch` sind die einzigen schwachen. Redispatch und EDA haben **keine** SAP-Produktseite im Bestand; beide leben von Regulierer- und Partnerquellen. Wer Utilities sichtbar lässt, sollte diese zwei mit `belegt: "teilweise"` kennzeichnen (ist heute schon so).

---

## 11. Weitere Lücken beim Durchgehen der 154 IDs

Höchstens zehn, je eine Zeile; **keine Quellenprüfung**, nur Abgleich mit dem Bestand (Stichwortsuche in `data/steckbriefe.json`).

1. **SAP S/4HANA Asset Management (Instandhaltung, EAM):** `apm` nennt es im `hinweis` als fehlenden Steckbrief; EAM kommt sonst nur als Stichwort vor (`fsm`, `prm`, `is-u`).
2. **SAP Advanced Financial Closing, Cash Management und Bank-/Treasury-Themen:** Stichworte kommen in keinem Steckbrief vor; im Finanzbereich stehen nur `group-reporting`, `central-finance`, `taulia-cashapp`. Die SAP-Doku liegt als CC-BY-Repo vor (`SAP-docs/s4hana-cloud-advanced-financial-closing`).
3. **SAP BRIM (Billing and Revenue Innovation Management) und Abonnement-Abrechnung:** kommt nur als Wort in `event-hub` vor; für Utilities und Subscription-Geschäft relevant.
4. **Archivierung und Content-Server (OpenText, ADK):** in #4 ausdrücklich dieser Frage zugewiesen; `data-privacy` deckt ILM, die Archivierung selbst fehlt (Stichwort nur in `ctms`, `snp-kyano`). Nicht recherchiert.
5. **SAP Enterprise Support, Success Plans (Max Success Plan), SAP for Me und EarlyWatch:** Die Stichworte Success Plan, Enterprise Support, SAP for Me und EarlyWatch tauchen in zwölf Steckbriefen als Randnotiz auf (der Max Success Plan ist laut SAPinsider Voraussetzung der Transition Option); ein Steckbrief zu den Support-Angeboten fehlt.
6. **Produktlebenszyklus-Management (PLM, Engineering Control Center) und Produktkonformität/EHS:** keine Treffer im Bestand, während `dmc`, `ewm`, `tm`, `ppds-aatp` vorhanden sind.
7. **SAP Mobile Services / Mobile Start (BTP):** nur als Wort in `work-zone`, `task-center`; Träger von SSAM und anderen Mobile-Apps (siehe Abschnitt 6).
8. **UI-Anpassung (Screen Personas):** keine Treffer; relevant für Kunden mit SAP GUI (siehe Abschnitt 4).
9. **SAP Business One / Business ByDesign:** nicht im Bestand; je nach Zielgruppe (Mittelstand) eine bewusste Auslassung.

## Offen / nicht gefunden

- **SAP-Primärquellen sind überwiegend nicht im Volltext geprüft** (Bots gesperrt, siehe Anfang). Alle „Treffer“-Quellen brauchen ein Gegenlesen mit Anmeldung oder im Browser.
- Erweiterungspakete im Umfang von Business Suite 7 (Hinweis 2881788, Login): nicht gefunden.
- Frist der HANA-Überführung bei der Transition Option (Ende 2030 oder 2031): Widerspruch der Quellen, nicht aufgelöst.
- Wartungsende AIF-Add-on 4.0: nicht gefunden.
- CBC für Cloud ERP Private und „Pflicht“ in Public-Cloud-Projekten: nicht gefunden.
- SAP GUI for Windows 8.00 „limited support“ ab 13.01.2027: Quelle nicht eindeutig; SAP-Hinweis 147519 hinter Login.
- ADS auf XSA: Lieferstand und Termin nicht gefunden.
- SAPscript/Smart-Forms-Enddatum und ihr Status in den Cloud-Editionen: nicht gefunden.
- SSAM-Releasedaten (2410, 2505, 2511) nur aus einem Beratungsblog; Product Availability Matrix nicht gelesen.
- CI-DS-Wartungsende: nicht belegt.
- HANA 2.0 SPS 08 exaktes Wartungsende (Hinweis 2378962), SPS 09, aktuelle HSR-Ausgabe für SPS 08: nicht gefunden.
- Offizielle Systemkopie-Leitfäden für S/4HANA, Backup von HANA: nicht gefunden bzw. nicht untersucht.
- Central Finance: Public Edition, Lizenz, offizieller Produktname: nicht gefunden.
- Utilities: IDEX-AT-Primärquelle, `ebutilities.at` nicht lesbar, drei Links der Quellen in `eda-at` nicht erreichbar (404 und zwei Timeouts).
- Weitere Lücken (Abschnitt 11): nicht recherchiert, nur nach Bestandsabgleich vorgeschlagen.
