# Nachrecherche: Testmanagement und Testautomatisierung mit SAP Cloud ALM und Tricentis (Stand 24.10.2026)

Ergänzt Abschnitt 2 und 6 aus `05_alm_toolchain_testing.md`. Viele SAP-Primärquellen sperren den automatischen Abruf (help.sap.com, api.sap.com, Teile von community.sap.com, Quartals-PDFs auf assets.dm.ux.sap.com). Das betrifft auch die offizielle API-Referenz und die SAP-Hilfeseiten zu den Testautomatisierungs-Endpunkten. Wo nur Partnerdokumentation (UiPath, Panaya, Tricentis) vorlag, ist das gekennzeichnet.

---

## Takeaway

- **Cloud ALM Test Management** besteht aus fünf Apps: Test Preparation, Test Plans, Test Execution, Defects und Analytics. Testfälle sind prozessbasiert, nicht dokumentbasiert.
- Ein manueller Testfall besteht aus **Aktivitäten** und **Aktionen**, also Testschritten mit erwartetem Ergebnis. Jede Aktion bekommt bei der Ausführung einen von zwei Pass-Status oder einen von vier Fail-Status; Fail erfordert einen Kommentar.
- **Testpläne** sind optional, aber der Weg zur Steuerung von Testzyklen.
- **Defects** sind ein eigenes Objekt mit Retest-Workflow (Status „Retest Required“ → „Closed“).
- 2026 hat SAP vor allem die **Feature-Ebene** zum Test-Gate ausgebaut: Testfälle hängen an Features, die Feature Traceability zeigt die Testbereitschaft, und neue Tester- und Feature-Rollen trennen Test und Deployment.
- **Automatisierung**: Cloud ALM hat keine eigene Engine. Es orchestriert externe Werkzeuge über eine Test-Automation-Schnittstelle. Belegt angebunden sind:
  - Tricentis (eingebettete Edition, Tosca Cloud, ECT)
  - das Test Automation Tool der Public Edition
  - UiPath Test Manager
  - Panaya
  - SmartBear Reflect

  Worksoft ist nur durch eine Wettbewerberquelle belegt.
- **KI für Test**:
  - Ein Joule-Agent für Requirements und User Stories ist seit W40/2026 verfügbar. Er verwaltet die Objekte, erzeugt aber laut Quelle keine Testfälle.
  - Die KI-Testfallgenerierung kommt über den **Test Management Assistant**, einen von sieben „Migration and Modernization Assistants“ (Sapphire 2026). Er erzeugt Testfälle aus Signavio-Modellen und Requirements und übergibt die Ausführung an Tricentis.
  - Für den Assistant wurde kein GA-Datum gefunden. Voraussetzungen sind Cloud ALM, Joule for Consultants und Joule for Developers; Erstfokus ist ECC → Cloud ERP Private.
- **SolMan-Ablösung**: Selective Data Transfer (SDT) überträgt Prozesshierarchie, Dokumente und Testfälle/Testschritte (inkl. Focused Build), ab SP50, einmalig, ohne Rollback. CBTA wird unterstützt, solange SolMan unterstützt wird, hat aber in Cloud ALM keinen Nachfolger. Nachfolger ist die Tricentis-Linie. Mainstream endet am 31.12.2027, Extended Maintenance inkl. Test Suite bis Ende 2030.
- **Tricentis 2026**:
  - Agentische E2E-Testgenerierung in ECT, angekündigt am 19.05.2026, abgerechnet über SAP AI Units. Eine formelle GA-Meldung fehlt, Fachpresse spricht von „hinzugefügt“.
  - In Tosca Cloud wird Agentic Test Automation über **AI-Credits** abgerechnet: jede Interaktion kostet einen Credit.
  - LiveCompare 2026.1 kann Cloud-ALM-Testrepositories für Test-Hits/-Gaps durchsuchen und hat einen MCP-Server.
  - Change Impact Analysis erhält eine Cloud-Option auf Basis von SeaLights ABAP.
- **APIs**: Offiziell belegt sind die Analytics API mit implementierungsbezogenen Providern (Tests, Defects, Requirements, Features, Tasks, Quality Gates) sowie API-Scopes für Defects, Features, Requirements, Process Management usw. Eine „Test Management API“ wird 2026 in einem SAP-Community-Blog für den Massenexport von Testfällen genutzt; ihren Umfang konnte ich nicht einsehen.

---

## Cited Findings

### 1. Cloud ALM Test Management im Detail

**Grundkonzept**
- Testfälle sind prozessbasiert: jeder Testfall geht von einem Prozess aus, nicht von einem Dokument. Aktivitäten des Solution Process lassen sich als Testschritte wiederverwenden, ähnlich wie Testschritte im SolMan. Jeder Schritt hat eine Beschreibung und ein erwartetes Ergebnis; der Tester dokumentiert das tatsächliche Ergebnis — [SAP Learning: Planning and Executing Testing](https://learning.sap.com/courses/implementing-with-sap-cloud-alm/planning-and-executing-testing_ef46a49b-9885-4aaa-841d-5ac9c80a3681)
- Rollen laut Kurs: Testdesigner bereiten Testfälle und Schritte vor, Tester führen aus und dokumentieren. Testpläne sind optional und das zentrale Element für Testzyklen und Rollouts, mit Status für Vorbereitung, Ausführung und Abschluss sowie eigenem Ausführungskontext (Status, Defects, Start- und Enddatum) — gleiche Quelle

**Test Preparation (Expert Portal)**
- Manuelle Testfälle anlegen oder aus einer Tabelle hochladen; Struktur als Excel herunterladen und wieder hochladen.
- Automatisierte Testfälle anlegen oder importieren; sie öffnen sich im Automatisierungswerkzeug.
- Verknüpfung mit Requirements und User Stories, Tags, Vorbereitungsstatus als Freigabe für die Ausführung.

Quelle: [Expert Portal: Test Management](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal/testmanagement.html)

**Test Plans (Expert Portal)**
- Verantwortlicher, Zeitraum, Testfälle aus Test Preparation zuordnen, Tester je Testfall zuordnen.
- Status „In Testing“ erzeugt den Ausführungskontext für vorbereitete Testfälle; „Finished“ schließt den Zyklus ab.
- Wer Testfälle aus einem Plan entfernt oder den Plan löscht, löscht damit auch die zugehörigen Testläufe und Ergebnisse.

Quelle: [Expert Portal: Test Management](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal/testmanagement.html)

Widerspruch: Ein Private-Edition-Kurs sagt, Tester werden auf Planebene zugeordnet und nicht je Testfall. Nur Titel der Best-Practice-Testprozeduren kommen nach Cloud ALM; das vollständige Testskript liegt im Signavio Process Navigator. Ein Plan im Status „In Testing“ erscheint als Aufgabe auf der Overview des Testers — [SAP Learning: Preparing Test Plans](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-private-edition/preparing-test-plans-in-sap-cloud-alm_f75b41fd-3b98-4b3c-bf78-6513dc97a88c). Vermutlich ist der Kurs älter.

**Test Execution**
- Ausführung nur im Status „Prepared“; „Execute“ erzeugt einen neuen Testlauf, und unvollständige Läufe lassen sich fortsetzen.
- Jede Aktion bekommt einen von zwei Pass-Status oder einen von vier Fail-Status; Fail braucht einen Kommentar. Aus den Aktionsstatus ergibt sich der Testfallstatus.
- Defects werden aus dem Lauf angelegt und mit Testläufen verknüpft.
- Automatisierte Fälle: „Execute“ startet im angebundenen Werkzeug, „Refresh Test Progress“ holt den Stand, das Ausführungsprotokoll öffnet sich im Werkzeug. Ein Testfall mit laufendem Run kann nicht erneut gestartet werden. Gelöschte Datenvarianten werden als „Obsolete“ markiert.

Quellen: [Expert Portal: Test Execution](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal/test-execution.html) (die Seite enthält teils veraltete Aussagen, z. B. „Testplanverwaltung noch nicht verfügbar“); [Expert Portal: Test Management](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal/testmanagement.html)

**Retest und Reset**
- Workflow im Defect: Der Bearbeiter setzt „Retest Required“, worauf der Defect an den Melder zurückgeht. Dieser testet in Test Execution erneut und setzt dann „Closed“ — [Expert Portal: Defect Management](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal/defect-management.html)
- „Reset test“ löscht Ergebnisse für eine saubere Wiederholung — [SAP Community: Test Management 2025](https://community.sap.com/t5/technology-blog-posts-by-sap/what-s-new-in-sap-cloud-alm-test-management-updates-for-2025/ba-p/14285726)

**Testsequenzen**
- Blog „Introducing Test Case Sequences“ vom 28.05.2025 — [Expert Portal: Test Management (Ressourcenliste)](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal/testmanagement.html)
- Sequenzen legen Reihenfolge und Abhängigkeiten fest — [SAP Community 2025](https://community.sap.com/t5/technology-blog-posts-by-sap/what-s-new-in-sap-cloud-alm-test-management-updates-for-2025/ba-p/14285726)

**Weitere datierte Ressourcen (Expert Portal)**
- 14.11.2024: Testplan-Statusfilter
- 16.12.2024: Defect Management
- 24.04.2025: neue Importoptionen für manuelle Testfälle
- 21.08.2025: Tags in Testplänen
- 11.09.2025: Scope und Solution Process neu zuordnen
- 09.12.2025: PoC-Leitfaden für manuelles Testen

**Defects**
- Eigenes Objekt in der App „Defects“ mit Beschreibung, Tags, Release, Status, Priorität, geplantem Fertigstellungsdatum, Team, Verantwortlichem und Beobachtern — [Expert Portal: Test Management](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal/testmanagement.html)
- Aus Defects lassen sich Features anlegen oder zuordnen; es gibt Defect-Reporting je Testplan — [SAP Community 2025](https://community.sap.com/t5/technology-blog-posts-by-sap/what-s-new-in-sap-cloud-alm-test-management-updates-for-2025/ba-p/14285726)
- 2026 (blue.works-Wochenposts, Jahr aus der Reihenfolge erschlossen):
  - W18: Klassifizierung der Defects (funktional, technisch, Usability & Infrastruktur, Dokumentation, Scope, Handling)
  - W26: Gruppierung nach Klassifikation und Subklassifikation
  - W28/30: Sicht „By Solution Process“

  Quelle: [blue.works Tag-Seite 2](https://www.blue.works/en/tag/sap-cloud-alm/page/2/)
- W38/2026 (18.09.2026): Bei manuellen Tests sind die Defect-Aktionen aus der Execution-Übersicht in den Testlauf gewandert; für automatisierte Tests bleiben sie in der Übersicht — [blue.works W38](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-38-2/)
- Externe Defect-Werkzeuge: Eine SAP-Standardintegration Jira ↔ Cloud-ALM-Defects habe ich nicht gefunden. Es gibt Partner-Connectoren, z. B. den CoreALM Connector (bidirektional, alle Issue-Typen, Partnersupport) — [Atlassian Marketplace](https://marketplace.atlassian.com/apps/1235148/corealm-connector-for-jira-and-sap-cloud-alm)
- Laut SAP-PRESS-Stand April 2024 ließen sich Defects nicht mit einem Korrekturtransport verknüpfen — [SAP PRESS Blog](https://blog.sap-press.com/test-management-in-sap-cloud-alm). Den heutigen Stand habe ich nicht verifiziert.

**Traceability und Feature-Gate (2026)**
- W20: Testfälle und Features lassen sich in beide Richtungen verknüpfen (Test Preparation ↔ Features). W18: mehrere Tester je Feature. W26: zugewiesene Entwickler dürfen nicht mehr bestätigen, dass ein Feature getestet ist — [blue.works Tag-Seite 2](https://www.blue.works/en/tag/sap-cloud-alm/page/2/)
- W24 (11.06.2026): Testfälle lassen sich direkt in Features entfernen — [blue.works W24](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-24/)
- W34 (21.08.2026):
  - Feature Traceability mit Spalten für Test Preparation und Test Execution, inkl. Mikro-Balkendiagrammen
  - Testfälle schon in den Feature-Status In Specification, In Implementation und In Testing zuordenbar
  - Tester-Rolle (imp_cdm_Tester) plus Project Viewer genügt, um „Successfully Tested“ zu setzen

  Quelle: [blue.works W34](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-34-2/)
- W38: Feature Traceability zeigt auch Defects, die indirekt über Testausführungen und Testpläne verknüpft sind; neue Sicht „By Tester“ in Test Execution Analysis und auf der Overview-Karte — [blue.works W38](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-38-2/)
- W40: vordefinierte Tester-Rolle für Test Preparation, Test Plans, Test Execution, Defects und Analytics. W42: Feature-Rollenvorlagen, die Test und Produktivdeployment trennen. W42: Quality-Gate-Checklisten mit Download, Upload und Massenpflege — [blue.works Tag-Seite](https://www.blue.works/en/tag/sap-cloud-alm/)

**Analytics**

| App / Karte | Was sie zeigt |
|---|---|
| Test Execution Analysis | Fortschritt über die Zeit |
| Defect Reporting | Trend |
| Requirement Traceability | Readiness über Aufgaben, User Stories und Testfälle |
| Feature Traceability | Readiness über Aufgaben, User Stories und Testfälle |
| User Story Traceability | Readiness über Teilaufgaben und Testausführungen |
| Solution Process Traceability | Requirement-Status und Testfortschritt |
| Overview-Karten Test Preparation / Test Execution | aktueller Stand |

Quelle: [Expert Portal: Analytics](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal/analytics.html)

### 2. Testautomatisierung

**Grundsatz**
- Cloud ALM orchestriert, die Tools erstellen und führen aus. Laut SAP Learning werden zwei Werkzeuge unterstützt: das SAP S/4HANA Cloud Test Automation Tool (TAT) und Tricentis Test Automation (TTA). Die Ausführung läuft auf gehosteten oder On-Premise-Agenten — [SAP Learning: Planning and Executing Testing](https://learning.sap.com/courses/implementing-with-sap-cloud-alm/planning-and-executing-testing_ef46a49b-9885-4aaa-841d-5ac9c80a3681)
- SAP-Partnerseite: Cloud ALM hat keine eingebaute Automatisierungs-Engine. CBTA wird unterstützt, solange SolMan unterstützt wird, aber nicht für SAP-Cloud-Produkte. Die ALM-Plattformen bleiben offen für weitere Automatisierungswerkzeuge — [SAP Support: Test Automation](https://support.sap.com/en/alm/partners/test-automation.html)
- Tricentis Test Automation for SAP (TTA) gibt es als Term-Lizenz für alle Enterprise-Support-Kunden: Recorder für Fachanwender, Authoring, Testdaten-Services, „alle SAP-UIs und APIs“. Erweiterungen laufen über Reseller-Verträge: Load Testing, Change Impact Analysis, ECT und Business Process Change Analyzer — gleiche Quelle
- Limits der eingebetteten Edition: bis zu 5 Nutzer und 5 Agenten, laut Sapphire-2024-Session — [SAPinsider, 28.06.2024](https://sapinsider.org/blogs/ai-powered-innovations-in-sap-cloud-alm-with-tricentis-solutions). Eine neuere offizielle Limit-Angabe habe ich nicht gefunden.
- Cloud-ALM-Funktionen der TTA-Integration: Testfälle anlegen, Authoring, Ausführung, Ausführungsstatus und -historie, Import. Authoring läuft über XScan → Module → Builder. Offizielle Upgrade-Pfade: „TTA integrated with SolMan“ → „TTA integrated with Cloud ALM“ und „SAP Test Automation by Tricentis“ → ECT — [SAP Learning: Using TTA with Cloud ALM](https://learning.sap.com/courses/solution-transformation-consultant-sap-cloud-alm-delta/using-tricentis-test-automation-for-sap-integrated-with-sap-cloud-alm)
- Aktivierung über die App „Set Up Tricentis Test Automation for SAP“ in der Cloud-ALM-Administration. In der Public Edition dient Tricentis vor allem systemübergreifenden Integrationstests — [SAP Learning: Tricentis in Cloud ALM](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-public-edition/exploring-test-automation-capabilities-with-tricentis-in-sap-cloud-alm_fe87be0f-6c54-4148-afd4-4e3990e0b177)

**Test Automation Tool für SAP S/4HANA Cloud Public Edition**
- In die Public Edition eingebaut. Die App heißt „Test Your Processes“; der Test Execution Service läuft auf BTP mit einem virtuellen Testnutzer über IAS.
- Vorkonfigurierte Automaten entsprechen den manuellen Skripten im Process Navigator; wer Prozesse anpasst, muss die Automaten nachziehen.
- Testpläne werden im System angelegt, der Ausführungsstatus erscheint in Cloud ALM neben den manuellen Plänen.

Quelle: [SAP Learning: Introducing the Test Automation Tool](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-public-edition/introducing-the-test-automation-tool)
- Post-Upgrade-Tests: SAP führt Standardautomaten nach Release-Upgrades aus, wenn der Kunde zustimmt (Zustimmung in „Test Your Processes“, Varianten in „Manage Upgrade Tests“). Testdaten kommen aus dem System oder einem Test Data Container — [SAP Learning: Post-Upgrade Tests](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-public-edition/utilizing-post-upgrade-tests-in-the-test-automation-tool_ecc6fcfb-1188-4f45-b64a-9c42733198a8)
- Synchronisiert werden nur Testfälle zu Solution Processes aus dem Best-Practice-Szenario; die Schnittstelle besteht aus versionierten REST-APIs im API Hub (Stand 2021) — [SAP Blog 2021](https://blogs.sap.com/2021/08/16/integrating-sap-cloud-alm-and-the-test-automation-tool-for-sap-s-4-hana-cloud/)
- Es gibt eine Early-Release-Session zu TAT und Cloud ALM für Release 2608 — [SAP Learning Live Session 2608](https://learning.sap.com/live-sessions/sap-activate-sap-cloud-alm-test-automation-tool-2608-early-release-series)

**Anbindung von Drittwerkzeugen (Partnerdoku)**
- **UiPath Test Manager**:
  - Cloud-ALM-Service vom Typ „Unspecified Cloud Service (HTTP)“ mit Rolle „Test“; Endpunkt mit Use Case **„Test Automation“**, OAuth2 Client Credentials.
  - Nur automatisierte Testfälle; SAP-Kontext in Custom Fields (Country/Region, Scope, Solution Process).
  - Sync über „Synchronize Automated Test Cases“; Ausführung aus Cloud ALM oder UiPath; Ergebnisse über „Refresh Executed Test Runs from the Automation Provider“.

  Quelle: [UiPath Docs](https://docs.uipath.com/test-manager/automation-suite/2.2510/user-guide/sap-cloud-alm)
- **Panaya**:
  - Service-Typ „Test Automation (Deprecated)“, Basic Auth, eigener Testzyklus „SAP ALM Integration“.
  - Cloud-ALM-Scope wird zum Panaya-Ordner; Import in beide Richtungen; Datensätze werden zu Varianten.
  - Ausführung aus Cloud ALM auf Panaya-Agenten; Status und Logs kommen zurück.

  Quelle: [Panaya Docs](https://success.panaya.com/docs/calm)
- **Tosca Cloud**:
  - Importiert Prozessmodelle (BPMs) aus Cloud ALM und erzeugt daraus Testfälle in Masse.
  - Für jeden in Cloud ALM angelegten automatisierten Testfall entsteht ein Tosca-Testfall; Ausführung in Tosca Cloud oder Cloud ALM.
  - Voraussetzung ist eine Cloud-ALM-Serviceinstanz mit den Scopes `calm-api.processmanagement.read/write/delete`.

  Quelle: [Tricentis Docs: Tosca Cloud – Cloud ALM](https://docs.tricentis.com/tosca-cloud/en-us/content/admin_guide/sap_cloud_alm_integration.htm)
- **ECT Cloud**: Requirements und Testfälle aus Cloud ALM werden automatisch synchronisiert; Traceability zu Requirements und User Stories bleibt erhalten — [Tricentis Demo-Seite](https://www.tricentis.com/resources/ect-cloud-with-cloud-alm-demo)
- **SmartBear Reflect**: Erstellung und Ausführung in Cloud ALM, Ausführung in der Reflect-Cloud, Ergebnisse zurück ins Test Management; ALMathon-Sieger (11.11.2025) — [SmartBear](https://smartbear.com/blog/cloud-first-ai-powered-test-automation-in-sap-cloud-alm/)
- W38/2026: Offene automatisierte Läufe synchronisieren sich jetzt automatisch und periodisch mit den Providern; „Select All“ beim Import von bis zu 100 gefilterten automatisierten Testfällen — [blue.works W38](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-38-2/)

### 3. KI in Cloud ALM für Test

- **Joule-Agent für Requirements und User Stories** (W40/2026): auflisten, filtern, suchen, Zuordnung ändern, Status, Story Points, Sprint/Release. Ob er Testfälle oder Akzeptanzkriterien generiert, sagt die Quelle nicht. Verfügbarkeit über SAP for Me eventuell verzögert — [blue.works Tag-Seite](https://www.blue.works/en/tag/sap-cloud-alm/)
- **Joule in Issues & Actions** (W34) und **Joule für Projekt-Setup** (W36), Aktivierung über SAP for Me — [blue.works W34](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-34-2/); [blue.works Tag-Seite](https://www.blue.works/en/tag/sap-cloud-alm/)
- **Test Management Assistant**: Einer von sieben Migration and Modernization Assistants (Sapphire 2026). Er grenzt den Testumfang ein, generiert KI-Testfälle aus Signavio-Prozessmodellen und Requirements und übergibt die Ausführung an Tricentis — [SAP Learning: Seven Assistants](https://learning.sap.com/courses/sap-signavio-process-data-analyst/understanding-the-seven-migration-and-modernization-assistants_d0835832-580a-4244-816d-21591216c5da)
- SAP-FAQ (Juni 2026) zu den Assistants:
  - nur auf Cloud ALM, nicht im SolMan
  - Voraussetzungen: Cloud ALM, Joule for Consultants, Joule for Developers
  - Erstumfang: ECC → Cloud ERP Private unter RISE; Public Edition nicht im Erstfokus
  - Ziel: mindestens 35 % weniger Migrationsaufwand
  - kein GA-Datum, keine AI-Unit-Angaben

  Quelle: [SAP FAQ Migration and Modernization Assistants](https://www.sap.com/documents/2026/06/3eabc539-5b7f-0010-bca6-c68f7e60039b.html)
- Laut SAP-Demo-Asset (05/2026) und Event (21.07.2026) definiert der Assistant einen risikobasierten Testumfang, erzeugt Testfälle für Cloud ALM und legt Testdaten an — [SAP Asset](https://www.sap.com/assetdetail/2026/05/548e7ad3-547f-0010-bca6-c68f7e60039b.html); [SAP Event](https://www.sap.com/germany/events/2026-07-21-online-fast-track-migrations-with-test-management-assistant.html)
- Auf dem SAPinsider Las Vegas (März 2026) nannte SAP die „automatisierte Testfallerstellung“ als kommende Cloud-ALM-Funktion, ohne Termin — [SAPinsider, 16.03.2026](https://sapinsider.org/sap-cloud-alm-execution-platform-transformation/)
- Die Q2-2026-AI-Highlights enthalten für Cloud ALM nur die KI-Dokumentzusammenfassung (GA), keine Testfunktion — [SAP News, Juli 2026](https://news.sap.com/2026/07/sap-business-ai-release-highlights-q2-2026/)
- Historisch: Tricentis zeigte 2024 eine KI-Testfallgenerierung aus Cloud ALM auf Basis von BTP-AI-Services (Demo) — [BusinessWire, 04.06.2024](https://www.businesswire.com/news/home/20240604992514/en/Tricentis-Accelerates-Customer-Adoption-of-SAP-S4HANA-Cloud-with-Enhanced-Integration-and-AI-Capabilities)

### 4. Migration vom Solution Manager

- **Selective Data Transfer (SDT)**:
  - überträgt Prozesshierarchien, Bibliotheken, kundeneigene Solution Processes und Diagramme, Dokumente sowie Focused-Build-Testfälle und -Testschritte
  - baut Beziehungen über eindeutige IDs nach
  - Mindest-SP für die SDT-Reports: SP50; Readiness Check vorher
  - einmalige Migration ohne laufende Synchronisation und ohne Rollback; nur Löschen ist möglich
  - SAP empfiehlt, mit einem kleinen PoC-Paket zu beginnen

  Quelle: [SAP Learning: Performing SDT](https://learning.sap.com/courses/transition-from-sap-solution-manager-to-sap-cloud-alm/performing-selective-data-transfer-sdt)
- SDT ist als eigenes Projekt zu behandeln und deckt Test-Suite-Inhalte samt Testschritten ab — [SAP Learning: Transition Tools](https://learning.sap.com/courses/transition-from-sap-solution-manager-to-sap-cloud-alm/leveraging-transition-tools-and-services)
- SDT-Ablauf: scopen → exportieren → optional anpassen → importieren → validieren. Komponenten: SV-SMG-IMP und SV-SMG-OST-FB-TWB — [SAP Support: SDT](https://support.sap.com/en/alm/sap-cloud-alm/transition-to-sap-cloud-alm/selective_data_transfer_to_calm2.html)
- Ressource zum selektiven Teststep-Transfer vom 23.07.2025 — [Expert Portal: Test Management](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal/testmanagement.html)
- ALM Summit NA 2026: Session „Move your content from SAP Solution Manager to SAP Cloud ALM with the selective data transfer tool“ — [ALM Summit NA 2026](https://support.sap.com/en/alm/sap-almsummit/sap-alm-summit-na-2026-materials.html)
- Mapping: Die SolMan Test Suite entspricht in Cloud ALM Test Management, Defect Management und der TTA-Integration; die volle Tricentis-Suite ist separat lizenziert — [SAP Support: Transition](https://support.sap.com/en/alm/sap-cloud-alm/transition-to-sap-cloud-alm.html)
- Die SAP-FAQ führt die Transferwerkzeuge für Lösungsdoku und Testfälle weiterhin als „geplant“. Das ist veraltet, denn SDT existiert — [SAP ALM FAQ](https://support.sap.com/en/alm/faq.html)
- CBTA: unterstützt, solange SolMan unterstützt wird; kein Engine-Nachfolger in Cloud ALM — [SAP Support: Test Automation](https://support.sap.com/en/alm/partners/test-automation.html). On-Prem-Enterprise-Support-Kunden erhalten eine kostenlose Term-Lizenz für TTA integriert mit SolMan — [SAP ALM FAQ](https://support.sap.com/en/alm/faq.html)
- Tricentis-Migrationspfad: Tosca-Testfälle aus der SolMan-Integration nach Tosca Cloud hochladen. BlobId und BlobVersion bleiben erhalten, Testpakete werden zu Playlists. Ergebnisse fließen noch nicht zurück in den SolMan — [Tricentis Docs: SolMan → Tosca Cloud](https://docs.tricentis.com/tosca-cloud/en-us/content/sap_solutionmanager/migrate_sap_solman_to_cloud.htm)
- Wartung:
  - Mainstream bis Ende 2027
  - Extended Maintenance bis Ende 2030 ohne Aufpreis für Kunden mit Business-Suite-7-EM; umfasst auch die Test Suite

  Quelle: [SAP Solution Manager](https://support.sap.com/solution-manager)
- SAP empfiehlt, den Übergang vor dem 31.12.2027 abzuschließen — [SAP News, 18.06.2026](https://news.sap.com/2026/06/navigating-transition-to-sap-cloud-alm/)

### 5. Tricentis 2026

- 19.05.2026: Agentic AI Testing in ECT. Funktionen:
  - E2E-Testfälle aus natürlicher Sprache
  - QA-Agenten
  - selbstheilende Tests
  - Wiederverwendung von Signavio-Prozessmodellen über Cloud ALM

  Deployment und Skalierung über SAP AI Units; keine Verbrauchsraten, kein GA-Wortlaut. Neu: Cloud-Deployment-Option für Change Impact Analysis auf Basis von SeaLights ABAP, mit Code-Impact auf betroffene Geschäftsprozesse — [Tricentis News](https://www.tricentis.com/news/tricentis-releases-agentic-ai-testing-sap-business-transformation)
- Die Fachpresse formuliert „has added“ (21.05.2026) — [ChannelLife](https://channellife.news/story/tricentis-adds-ai-generated-testing-to-sap-ect-platform)
- ECT-Kunden können bereits vertraglich zugeteilte AI Units nutzen, ohne neuen Vertrag — [Tricentis Blog, 29.06.2026](https://www.tricentis.com/blog/sap-agent-led-toolchain-explained)
- Tosca Cloud Agentic Test Automation:
  - Abrechnung in **AI-Credits**: jede Interaktion kostet einen Credit, auch Fehlversuche
  - Warnung unter 2.000 Credits; bei null Credits ist die Funktion gesperrt
  - Voraussetzungen: Launcher auf der Ausführungsmaschine, 1920×1080 bei 100 % Skalierung, Chrome oder Edge

  Quelle: [Tricentis Docs: Agentic Test Automation](https://docs.tricentis.com/tosca-cloud/en-us/content/ai_integration/agentic_test_automation/landing_page.htm)
- Tosca 2612 (18.02.2026): Agentic Test Automation nur für Cloud- oder Hybridbetrieb, mit begrenzten Prompts — [ShiftSync](https://shiftsync.tricentis.com/product-updates/new-agentic-test-automation-capabilities-for-tosca-2612)
- März 2026: Die Agentic-QE-Plattform bringt SAP-GUI- und Web-Unterstützung für Agentic Test Automation; Quality Intelligence bewertet die Release-Readiness. Keine GA-Daten — [ADTmag, 12.03.2026](https://adtmag.com/articles/2026/03/12/tricentis-lauches-agentic-platform.aspx)
- LiveCompare 2026.1:
  - Aktion „Search Test Repository“ unterstützt Cloud-ALM-Testrepositories für Test-Hits/-Gaps
  - LiveCompare-MCP-Server
  - Tosca-Local-Integration abgekündigt (Tosca REST verwenden)
  - Patch 2 im Oktober 2026

  Quelle: [LiveCompare 2026.1 Release Notes](https://docs.tricentis.com/livecompare-2026.1/content/release_notes.htm)
- Die LiveCompare-Integrationsseite zeigt SolMan und Cloud ALM nur als Logos; dort steht lediglich, dass LiveCompare neben bestehenden ALM-, Transport- und Testplattformen arbeitet, ohne Beschreibung eines Datenflusses — [Tricentis: LiveCompare-Integrationen](https://www.tricentis.com/products/impact-analysis-livecompare/integrations)
- 09.10.2026: Tricentis ist Leader im Gartner Magic Quadrant 2026 für Agentic Software Quality Assurance Platforms — [Tricentis Newsroom](https://www.tricentis.com/news)
- ALM Summit NA 2026: Session „What's new in SAP ECT by Tricentis / Tricentis Test Automation, integrated with SAP Cloud ALM“; Folien nicht verlinkt — [ALM Summit NA 2026](https://support.sap.com/en/alm/sap-almsummit/sap-alm-summit-na-2026-materials.html)

### 6. Cloud ALM APIs für Test

- **Analytics API**: Implementierungsprovider Projects, Defects, Features, Requirements, Tasks, **Tests** (Ausführungen nach Projekt, Scope, Typ, Status) und **Quality Gates** — [Dynatrace Hub](https://www.dynatrace.com/hub/detail/sap-cloud-alm)
- Seit Q1 2023: Tests-Provider mit der Dimension Prozess; Defects-Provider mit Testfall-ID, Testfallname, Workstream, Assignee — [SAP Blog Q1 2023](https://blogs.sap.com/2023/05/15/sap-alm-api-integration-q1-updates/)
- **API-Scopes** (Lesevarianten) laut Partnerdoku, u. a.:
  - `calm-api.defects.read`, `calm-api.features.read`, `calm-api.requirements.read`
  - `calm-api.processmanagement.read`, `calm-api.analytics.read`, `calm-api.analytics.providers.read`

  Einen expliziten Testmanagement-Scope listet diese Quelle nicht — [New Relic Docs](https://docs.newrelic.com/docs/sap-solutions/install-and-configure/obtain-service-key/from-cloudalm-api-instance/)
- **Test-Automation-API**: Laut SAP-Präsentation (2022) können Cloud-Testautomatisierungsanbieter Tests starten und Ergebnisse liefern (Status „aktiv“); eine Test-Cases-API war damals „in Arbeit“ — [SAP ALM Partner Conference 2022](https://assets.dm.ux.sap.com/webinars/alm-partner-conference-emea-2022/pdfs/api_for_sap_cloud_alm_dupeyrat.pdf)
- **Test Management API** (2026):
  - SAP-Community-Blog „Mass exporting test cases from Cloud ALM via the Test Management API“ (Inhalt gesperrt) — [SAP Community](https://community.sap.com/t5/technology-blog-posts-by-sap/mass-exporting-test-cases-from-cloud-alm-via-the-test-management-api/ba-p/14448699)
  - Zusammenfassung, 31.07.2026: Ein Massendownload fehlt in der UI, deshalb ein Python-Prototyp über die API — [Saptix](https://saptix.com/2026/07/31/mass-exporting-test-cases-from-cloud-alm-via-the-test-management-api/)

---

## Inferences

- **Registrierung von Testwerkzeugen:** Panaya nutzt den als „Deprecated“ markierten Service-Typ „Test Automation“, UiPath dagegen einen generischen HTTP-Service mit Endpunkt-Use-Case „Test Automation“. SAP hat die Anbindung offenbar auf endpunktbasierte Registrierung umgestellt. Für neue Projekte: den aktuellen Weg (Endpunkt-Use-Case) wählen.
- **Feature als Test-Gate:** Seit 2026 ist das Feature das eigentliche Freigabeobjekt (Successfully Tested → Ready for Production → Deploy), mit Rollen, die Entwickler und Tester trennen. Testmanager sollten Testfälle früh an Features hängen (ab In Specification) und Feature Traceability als Readiness-Bericht nutzen.
- **Defect-Ketten:** Cloud ALM hat ein schlankes, eigenes Defect-Objekt. Wer Jira für Entwicklung nutzt, braucht einen Partner-Connector oder eine eigene API-Integration; sonst entstehen doppelte Defect-Ketten.
- **Löschen im Testplan:** Entfernt man Testfälle aus einem Plan, verschwinden auch deren Läufe und Ergebnisse. Für die Revisionssicherheit Pläne nicht umbauen, sondern kopieren.
- **Planung der KI-Testfallgenerierung:** Für 2026/27 realistisch nur über den Test Management Assistant (ECC → Private, Joule for Consultants/Developers lizenzpflichtig) oder über Tricentis (ECT mit AI Units, Tosca Cloud mit Credits). Eine native, kostenfreie Joule-Testfallgenerierung in Cloud ALM ist nicht belegt.
- **CBTA-Migration:** Kein Konverter von CBTA nach Tricentis gefunden. CBTA-Skripte müssen neu automatisiert werden, z. B. agentisch in Tosca oder ECT. Nur Tosca-Testfälle aus einer bestehenden SolMan-Tosca-Integration lassen sich übernehmen.
- **Rollen der Tricentis-Produkte:** Die eingebettete TTA-Edition (5/5, kostenlos) bleibt für Public-Edition-Integrationstests und PoCs sinnvoll. Für Private Edition mit SAP GUI ist ECT (oder Tosca Cloud) der realistische Pfad.

---

## Gaps

- Offizielle API-Referenz (api.sap.com, help.sap.com/docs/cloud-alm/apis): Umfang der Test Management API (Lesen/Schreiben, Objekte wie Aktivitäten und Aktionen, Testpläne) nicht einsehbar.
- Offizielle SAP-Hilfe zu „Test Automation“-Endpunkten und zur Abkündigung des alten Service-Typs nicht abrufbar.
- Quartals-PDFs „What's New Implementation“ Q4/2025–Q2/2026 nicht abrufbar; Roadmap Explorer nicht abgefragt (blockiert).
- GA-Datum und AI-Unit-Verbrauch für den Test Management Assistant und für die ECT-Agentik nicht gefunden.
- Aktuelle Limits der eingebetteten TTA-Edition (SAP GUI? weiterhin 5 Nutzer / 5 Agenten?) nicht offiziell bestätigt; letzter Beleg 2024.
- Worksoft-Cloud-ALM-Integration: weiterhin nur über eine Wettbewerberquelle belegt.
- Ob Defects heute mit Transporten oder Features verknüpft werden können, über „Feature aus Defect“ hinaus: nicht verifiziert.
- Keine Quelle zu einer SolMan-Wartungsverlängerung über 2030 hinaus.
