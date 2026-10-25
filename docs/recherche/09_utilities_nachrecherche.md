# 09 Utilities-Nachrecherche (DE/AT-Versorger), Stand 24.10.2026

Methodenhinweis: Viele Seiten auf help.sap.com waren gesperrt (robots), ebenso die SAP-News-Artikel Feb. 2026 („Zukunftssicheres ERP für Energieversorger“) und VSE/MaCo sowie ebutilities.at (leere Seite). SAP Learning, sap.com-Produkt- und Store-Seiten, BNetzA, BDEW, ZfK, ASUG und einige Partnerseiten ließen sich lesen. Alles, was mit **[Ableitung]** markiert ist, ist eine Schlussfolgerung ohne direkten Beleg.

---

## 1. SAP Market Communication for Utilities (MaCo Cloud)

### Takeaway
Die MaCo Cloud ist ein Public-Cloud-Service mit Fiori-Oberfläche, der nur den Kommunikationsteil der deutschen MaKo übernimmt: Marktprozesse, EDIFACT-Nachrichten per AS4/E-Mail und Marktpartnerdaten. Die Fachlogik und die Stammdaten bleiben in S/4HANA Utilities. Gekoppelt wird über die Application Process Engine (APE) auf beiden Seiten, über Transferdokumente (TDOC) und Prozessdokumente (PDOC) sowie über die Schicht UCOM. Die deutschen Prozesse (GPKE, WiM) liegen in S/4HANA in der „Utilities Solution for Germany“ (US4G), dem Nachfolger von IDEX. Die Formatwechsel setzt SAP um. Bei den Kunden bleibt der Regressionstest. Nicht belegt ist, ob und wie die MaCo Cloud die neuen API-Webdienste (MaLo-Ident, Steuern) abwickelt.

### Cited Findings
- Aufgabenteilung: S/4HANA Utilities macht die Verarbeitung, die MaCo Cloud die Kommunikation. Komponenten der MaCo Cloud sind Market Processes, Market Messages und Market Partners. Market Message Transfer (MMT) verpackt EDIFACT-Nachrichten für E-Mail oder AS4 und packt eingehende aus. Ausgehende Nachrichten bestätigt der Partner mit CONTRL, für eingehende schickt MMT selbst ein CONTRL zurück. — [SAP Learning: MaCo-Architektur](https://learning.sap.com/learning-journeys/transitioning-to-sap-s-4hana-for-utilities/analyzing-and-applying-sap-market-communication-architecture-for-utilities)
- Die MaCo Cloud läuft nur mit SAP Fiori, weil sie ausschließlich als Public Cloud bereitgestellt wird. Eigene Stammdaten wie Geschäftspartner oder Zählpunkt hält sie nicht, sie fragt sie per TDOC beim Business-System ab. Die APE läuft in beiden Systemen und erzeugt TDOCs und PDOCs, UCOM (Common Utilities Layer) verbindet S/4HANA Utilities mit der MaCo Cloud. US4G ist der Nachfolger von IDEX und steuert z. B. GPKE Lieferbeginn und WiM Beginn Messstellenbetrieb. Monitoring für PDOC, TDOC und Ausnahmedokumente gibt es in beiden Systemen. Die Prozesse sind nur für Deutschland relevant. — [same](https://learning.sap.com/learning-journeys/transitioning-to-sap-s-4hana-for-utilities/analyzing-and-applying-sap-market-communication-architecture-for-utilities)
- Lösungstyp „Business Essentials“. SAP übernimmt regulatorische Formatänderungen und pflegt die Marktpartnerdaten. Die Lösung ergänzt S/4HANA Utilities, setzt es laut Seite aber nicht voraus. AS4, Preise und Tenants nennt die Seite nicht. — [sap.com MaCo](https://www.sap.com/products/scm/market-communication-for-utilities.html)
- rku.it hat im Januar 2019 als erstes Unternehmen in Deutschland erste Nachrichten über die MaCo Cloud verschickt und sie in die eigene Plattform eingebunden. — [rku.it PM 02/2019](https://rku-it.de/fileadmin/user_upload/rku.it_PM_Erfolgreiche_Anbindung_MaCo-Cloud_190211.pdf)
- Partnerprodukte rund um die MaCo Cloud im SAP Store:
  - durchgängiges Monitoring vom S/4HANA-Backend bis zur MaCo Cloud — [CLC xinteg MaCo Monitor](https://www.sap.com/sk/products/erp/partners/clc-xinteg-gmbh-endtoend-monitoring-with-clcpadd-maco-monitor.html)
  - Fristenüberwachung — [cerebricks Deadline Monitor](https://www.sap.com/mena/products/financial-management/partners/cerebricks-gmbh-deadline-monitor-for-maco-cloud.html)
  - Archivanbindung, nur der Titel des Store-Eintrags ist bekannt — [GISA](https://www.sap.com/sea/products/technology-platform/partners/gisa-gmbh-gisa-archive-platform-for-sap-market-communication-for-utilities.html)
  - Gasprozesse über SAP Market Communication, läuft auf BTP als Erweiterung zu SAP Utilities Core, Lizenz nach MaLo-IDs — [PROLOGA Gas](https://www.sap.com/products/scm/partners/prologa-gmbh-enhancements-for-german-gas-suppliers.html)
- Es gibt ein eigenes Produkt „SAP S/4HANA Utilities Master Data Updates Option for Germany“ (Komponente IS-U-LIB-DE-MDU). Ein KBA zu UTILMD 55218/55640 ist zusätzlich der MaCo Cloud zugeordnet. — [SAP KBA 3779683](https://userapps.support.sap.com/sap/support/knowledge/en/3779683)
- Kunden:
  - Uniper (adesso, 03/2025) setzt für die Marktrolle Lieferant S/4HANA Utilities mit MaCo-Cloud ein, rechtzeitig vor dem 24-h-Lieferantenwechsel. — [e3mag/adesso](https://e3mag.com/en/s-4-hana-utilities-24-hour-change-of-supplier/)
  - TEAG (07/2026) nutzt S/4HANA Utilities, Service Cloud V2, MaCo, BTP und BDC. — [SAP News DE 07/2026](https://news.sap.com/germany/2026/07/teag-sap-grundlage-naechste-generation-energiewirtschaft/)
- innobu (11/2025) beschreibt die „SAP Mako Cloud“ als Integrationsschicht, die auch mit ECC funktioniere. Der Artikel ist werblich und nennt keine Belege. — [innobu SAP Mako Cloud](https://www.innobu.com/de/artikel/sap-mako-cloud.html)

**Regulatorischer Rahmen 2024–2027**
- AS4:
  - Strom: Nutzung ab 1.10.2023, Pflicht ab 1.4.2024 (BK6-21-282). S/MIME-E-Mail ist danach nicht mehr zulässig. — [BDEW AS4 Strom](https://www.bdew.de/energie/as4-in-der-sparte-strom/)
  - Gas: geplant zum 1.10.2024. — [ZfK AS4 Gas](https://www.zfk.de/digitalisierung/it/as4-von-strom-zu-gas)
- 24-h-Lieferantenwechsel (LFW24):
  - Die BNetzA legte ihn am 21.3.2024 auf den 1.4.2025 fest. — [BDEW LFW24](https://www.bdew.de/energie/lieferantenwechsels-in-24-stunden/)
  - Später wurde er von 4.4.2025 auf 6.6.2025 verschoben, weil die Software erst Mitte Q1 2025 kommen sollte. — [ZfK 12/2024](https://www.zfk.de/digitalisierung/bundesnetzagentur-verschiebt-24-stunden-lieferantenwechsel)
- DSAG-Umfrage (05/2025, 42 EVU): 83 % laufen noch auf ECC. Die von SAP empfohlene LFW24-Standardlösung ist nur auf S/4HANA voll umsetzbar, ECC-Kunden brauchen Eigenentwicklungen. Als Engpass wird u. a. das Testen mit Marktpartnern genannt. — [ZfK DSAG](https://www.zfk.de/digitalisierung/it/dsag-umfrage-stadtwerke-sehen-massive-huerden-beim-24h-lieferantenwechsel)
- Datenformat-Mitteilungen der BNetzA:
  - Nr. 54 (veröffentlicht 1.10.2025, gültig ab 1.4.2026): EDIFACT-Versionen, Entscheidungsbäume 4.2, Redispatch-XML (ActivationDocument 1.1f u. a.), AS4-Übertragungsweg 2.5. — [BNetzA Mitteilung 54](https://www.bundesnetzagentur.de/DE/Beschlusskammern/BK06/BK6_83_Zug_Mess/835_mitteilungen_datenformate/Mitteilung_54/Mitteilung_Nr_54.html)
  - Nr. 55/56: gültig ab 1.10.2026. Nr. 57/58: gültig ab 1.4.2027, Nr. 58 veröffentlicht am 1.10.2026. Nr. 53 (1.9.2025): Konsultation des Konzepts für API-Webdienste. — [BNetzA Übersicht](https://bundesnetzagentur.de/DE/Beschlusskammern/BK06/BK6_83_Zug_Mess/835_mitteilungen_datenformate/Datenformate-node.html)
- Mitteilung 58 laut innobu:
  - Ab 1.4.2027 gelten nur ActivationDocument AWT 1.1g, die Redispatch-XML-Historie und Übertragungsweg 1.11 (mTLS-Zertifikate für REST).
  - UTILTS bleibt. Die API-Webdienste bleiben vorerst auf MaLo-Ident und Steuern beschränkt, der geplante API-Ersatz für UTILTS ist gestrichen.
  - Die nächste Konsultation ist für Feb. 2027 angekündigt.
  - — [innobu Mitteilung 58](https://www.innobu.com/de/artikel/mako-mitteilung-58-utilts-bleibt-april-2027.html)
- Die MaLo-Ident-API ist seit 6.6.2025 verbindlich. APIs sind synchrones JSON nach dem EDI@Energy-API-Leitfaden. Nr. 56 brachte zum 1.10.2026 u. a. AS4-Profil 1.2 und UTILMD Strom 2.2 mit Steuerbarkeits-Kennzeichen. EDM- und Abrechnungssysteme müssen EDIFACT, AS4 und API-Clients parallel bedienen. — [innobu MaKo 2026](https://www.innobu.com/en/articles/mako-2026-edifact-api-migration.html)

### Inferences
- [Ableitung] Weil die MaCo Cloud keine Stammdaten hält, sind TDOC-Rückfragen ins Backend die kritische Integrationsstrecke. Massentests (z. B. Jahreswechsel, Stichtage) müssen deshalb immer beide Systeme gemeinsam belasten.
- [Ableitung] Laut sap.com „setzt die Lösung S/4HANA nicht voraus“, und rku.it hat schon 2019 angebunden. Eine Kopplung an IS-U auf ECC über Partner war also offenbar möglich. Ob SAP das heute für ECC unterstützt, ist offen.
- [Ableitung] Die API-Webdienste (MaLo-Ident, Steuern) laufen nicht über AS4/EDIFACT. Wie die MaCo Cloud sie abdeckt, ist ungeklärt. Im Projekt sollte man das bei SAP nachfragen.

### Gaps
- Keine SAP-Quelle zu Lizenzmetrik und Preisen der MaCo Cloud oder zum Paket „Utilities Core for Germany“
- Keine SAP-Quelle zu API-Webdiensten, mTLS/Übertragungsweg 1.11 und Rechenzentrumsstandort
- Kein offizielles Release- und Testfenster-Modell für Formatwechsel gefunden

---

## 2. Redispatch 2.0, §14a EnWG, Smart Meter / MSB

### Takeaway
SAP hat kein eigenes Redispatch-2.0-Produkt. Im Standard sind einzelne Bausteine erkennbar, etwa Redispatch-bezogene MaBiS-Zählpunkt-Aktivierungen in der deutschen Master-Data-Updates-Option. Den Kern liefern meist Partner, im SAP-Umfeld z. B. PROLOGA (Redis 2.0 Cockpit) und UTILIGENCE, außerhalb von SAP z. B. Soptim/Esterion und Kisters. Für §14a EnWG wurde keine SAP-Produktaussage gefunden. Formatseitig betrifft §14a das Steuerbarkeits-Kennzeichen in UTILMD Strom 2.2 und die API „Steuern“. Für den intelligenten Messstellenbetrieb gibt es den SAP-Prozessbaustein „SAP Intelligent Metering for German Energy Utilities“ (IM4G), dazu Partner-Apps.

### Cited Findings
- Redispatch 2.0 war für den 1.10.2021 geplant und startete am 20.9.2021 mit einer Übergangslösung, die am 31.5.2022 endete. Danach liefen Piloten. Datenhub ist RAIDA (Connect+). Die SAP-Rolle beschreibt der Artikel nicht. — [ZfK 10/2022](https://www.zfk.de/digitalisierung/redispatch-20-was-funktioniert-inzwischen-und-was-nicht)
- PROLOGA Energy „Redis 2.0 Cockpit“: Fiori-Apps in der Cloud mit Übersicht, Datenaustausch-Monitor, Abrufdokumentation und Anlagenlandschaft. Lizenziert in Blöcken von 10.000 Zählpunkten, Laufzeit mindestens 1 Jahr. Eine direkte IS-U-Integration nennt die Seite nicht. — [SAP Store PROLOGA](https://www.sap.com/sea/products/crm/partners/prologa-energy-gmbh-redis-20-cockpit.html)
- UTILIGENCE: Redispatch-2.0-Lösung direkt in S/4HANA Utilities/IS-U mit Bezug zu IDEX und EDM. Abgedeckt sind Engpassprognose, Maßnahmen, Fahrplan- und Einsatzdaten, Marktkommunikation mit ÜNB/VNB/EIV und Abrechnung. — [UTILIGENCE](https://www.utiligence.de/en/sap-s4hana-utilities/redispatch-2-0)
- Soptim/Esterion bieten ein SaaS-Portal für Anlagenbetreiber und EIV mit Connect+-Anbindung und REST-API für Stammdaten, ohne SAP-Bezug. — [ZfK 07/2021](https://www.zfk.de/digitalisierung/redispatch-20-loesung-fuer-einsatzverantwortliche-und-betreiber)
- Auf help.sap.com gibt es im Bereich „Utilities Master Data Updates Germany“ eine Seite „Versand von MaBiS-ZP-Aktivierungen/Deaktivierungen für Redispatch“. Bekannt ist nur der Titel aus dem Suchergebnis, die Seite war gesperrt. — [help.sap.com (Titel)](https://help.sap.com/docs/utilities-master-data-updates-germany/product-assistance/76a7c5b228de4a8490bc1c2edab8529f.html?locale=de-DE)
- Netz Leipzig (VNB und gMSB, Strom und Gas) führt mit adesso S/4HANA Utilities ein. Im Scope sind Redispatch 2.0, MaBiS, GaBi Gas und HKNR, Betrieb über RISE, Go-live bis 2027. Der R/3-IS-U-Betrieb endet Ende 2027. — [adesso PM 07/2026](https://www.adesso.de/en/news/presse/adesso-supports-the-netzgesellschaft-of-leipziger-stadtwerke-with-strategic-sap-transformation.jsp)
- In Mitteilung 54 und 58 sind die Redispatch-Formate XML (ActivationDocument, AcknowledgementDocument, Kaskade). Ab 1.4.2027 gilt ActivationDocument AWT 1.1g. — [BNetzA Mitteilung 54](https://www.bundesnetzagentur.de/DE/Beschlusskammern/BK06/BK6_83_Zug_Mess/835_mitteilungen_datenformate/Mitteilung_54/Mitteilung_Nr_54.html), [innobu Mitteilung 58](https://www.innobu.com/de/artikel/mako-mitteilung-58-utilts-bleibt-april-2027.html)
- Der Austausch der Redispatch-2.0-Daten in Deutschland läuft per REST/JSON (Aussage in einem Ponton-Interview). — [energate](https://www.energate-messenger.com/news/220936/over-99-per-cent-of-the-processes-are-fully-automated-in-less-than-a-minute)
- §14a: UTILMD Strom 2.2 bringt ein Kennzeichen für Steuerbarkeit, und die API „Steuern“ bleibt neben MaLo-Ident im API-Scope. — [innobu MaKo 2026](https://www.innobu.com/en/articles/mako-2026-edifact-api-migration.html), [innobu Mitteilung 58](https://www.innobu.com/de/artikel/mako-mitteilung-58-utilts-bleibt-april-2027.html)
- Partner-Apps rund um iMSys und Rollout:
  - cronos „SmartSwitch2Go“: Fiori-App, mit der Monteure die Deparametrierung eines Smart Meters starten. Sie ist in die Standardprozesse von „SAP Intelligent Metering for German Energy Utilities“ eingebunden. — [SAP Store cronos](https://www.sap.com/africa/products/technology-platform/partners/cronos-unternehmensberatung-gmbh-smart-switchgo.html)
  - cronos: Rolloutplanung für Smart Meter auf SCP/HANA, unterstützt IS-U als Backend. — [SAP Store cronos Rollout](https://www.sap.com/mena/products/technology-platform/partners/cronos-unternehmensberatung-gmbh-smartromgo.html)
- FairConsult listet unter „Metrology & Smart Grids“ SAP EDM, SAP IM4G, MOS-Abrechnung und Redispatch 2.0. — [FairConsult](https://www.fairconsult24-7.de/en/sap-solutions/)

### Inferences
- [Ableitung] Für Netzbetreiber sind Redispatch 2.0 und §14a im Testplan eigene Teilprojekte mit Fremdsystemen: Netzleittechnik/SCADA, Connect+/RAIDA, Gateway-Administration, Steuerbox/CLS. Das S/4HANA-Projekt testet nur die Schnittstelle und die Abrechnung (z. B. reduzierte Netzentgelte nach §14a, Redispatch-Bilanzierung/Ausfallarbeit).
- [Ableitung] IM4G ist ein SAP-Baustein für die deutschen iMSys-Prozesse in IS-U bzw. S/4HANA Utilities. Den Umfang konnten wir nicht prüfen.

### Gaps
- Keine SAP-Primärquelle (help.sap.com gesperrt) zu Redispatch-, §14a- und IM4G-Funktionsumfang
- Unklar, ob die MaCo Cloud Redispatch-XML abwickelt

---

## 3. Energy Data Management, Cloud for Energy, MDM/MDUS, DER

### Takeaway
EDM in S/4HANA Utilities bleibt das Profil- und Zeitreihenmodul im Kern: Profile, Prüfung, Ersatzwerte, RTP-Abrechnung, Bilanzierung, AMI-Import. SAP Cloud for Energy ist eine Cloud-Ergänzung für große Messwertmengen. Sie bildet Abrechnungsgrößen, die S/4HANA abruft. S/4HANA bleibt führend für Abrechnung, Bilanzierung und Zählerstammdaten. SAP sagt selbst, EDM könne je nach Landschaft in S/4HANA, in Cloud for Energy oder in einem Drittsystem liegen. Cloud for Energy ergänzt EDM also, statt es zwingend zu ersetzen. MDUS ist kein SAP-Produkt, sondern das Integrationsmuster (Enterprise Services) zwischen SAP und MDM- bzw. Head-End-Systemen, 2- oder 3-stufig. Neu ist **SAP Distributed Energy Resources** (DER, früher SAP Utilities Core foundation bzw. Cloud for Utilities foundation, Kern: Measurement Concept Management). Seit 2026 hat es eine eigene Zeitreihenverwaltung, die funktional an Cloud for Energy heranrückt.

### Cited Findings
- EDM-Komponenten in S/4HANA Utilities:
  - Profile in fünf Typen: elementar, synthetisch, Formel, Tag, Integral
  - Prüfungen und Ersatzwertverfahren, RTP- und TOU-Abrechnung, Bilanzierungsrolle
  - Import aus AMR-Systemen per BAPI, Business Function ISU_AMI_2
  - Profilwerte können in einem externen System bleiben und per Enterprise Service gelesen werden
  - SAP Business Data Cloud wird als Ziel für Profildaten genannt
  - — [SAP Learning EDM](https://learning.sap.com/courses/configuring-device-management-in-sap-s-4hana-utilities/understanding-the-energy-data-management-components)
- Cloud for Energy:
  - Zielbild laut SAP Learning: S/4HANA Utilities bleibt führend für Bilanzierung, Abrechnung und Zählerstammdaten. Cloud for Energy übernimmt die Big-Data-Verarbeitung und liefert Aggregate und Abrechnungsgrößen. EDM kann je nach Landschaft in S/4HANA, in Cloud for Energy oder in einem Drittsystem laufen.
  - Technik: CIM-Schnittstelle, IEC 61968-9 für Head-End/Mediation, Parquet-Export, Updates bis zu wöchentlich, Rechenzentren in den USA und in Europa, Funktionen für VEE (Prüfung, Ersatzwert, Bearbeitung) und Anomalieerkennung.
  - — [SAP Learning MaCo-/C4E-Architektur](https://learning.sap.com/learning-journeys/transitioning-to-sap-s-4hana-for-utilities/analyzing-and-applying-sap-market-communication-architecture-for-utilities)
- Feature Scope Description Cloud for Energy (Stand 29.05.2024):
  - Energy Data Services, CIM-API, Anomalieerkennung, Billing Determinant Service
  - Integration mit S/4HANA Utilities **oder** IS-U auf ECC: Zählerstammdaten über bestehende Enterprise Services, TOU-Abrechnung über Profilkopf-Replikation, klassische Abrechnung über Ablese-Zeitreihen
  - Rechenzentren in den Niederlanden und US-Ost
  - — [help.sap.com FSD C4E](https://help.sap.com/doc/31bee3d58ecc41ecbc90e3e25f06c0ea/CLOUD/en-US/FSD.pdf)
- sap.com: Lösungstyp Business Essentials, setzt S/4HANA nicht voraus, synchronisiert Gerätestammdaten mit S/4HANA Utilities. — [sap.com C4E](https://www.sap.com/products/scm/cloud-for-energy.html)
- MDUS:
  - Steht für Meter Data Unification and Synchronisation. Klassisch ist der 3-stufige Weg SAP – MDM – Head-End, daneben gibt es einen 2-stufigen Weg, bei dem EDM die „Quelle der Wahrheit“ für Messdaten ist. Beide nutzen dieselben Enterprise Services. — [SAP-Blog AGL](https://blogs.sap.com/2015/05/04/sap-simplies-meter-data-management-agl-leads-the-way/)
  - Landis+Gyr bietet einen MDUS-Adapter mit über 50 Service-Operationen. — [Landis+Gyr](https://www.landisgyr.com/product/mdus-sap-for-utilities-adaptor)
- SAP Distributed Energy Resources:
  - Feature Scope Description 2.3 (04/2026): Umbenennung in SAP Distributed Energy Resources. Version 2.0 (02/2025) hieß „SAP Utilities Core“. Version 2.2 (01/2026) brachte die Zeitreihenverwaltung.
  - Funktionen: MCM mit technischen und kommerziellen Modellen (Marktlokation, Rechenformeln), Events an S/4HANA Utilities, Migrations-API, Parquet-Upload, Validierung, Interpolation, Abrechnungsgrößen, Replikation von Gerätestammdaten und Profilköpfen aus S/4HANA Utilities.
  - — [help.sap.com FSD DER](https://help.sap.com/doc/492e2072e8f042c3b689dae9709cecab)
- sap.com „SAP Utilities Core foundation“: BTP, Event Mesh, OData, Anbindung über ein MCM-Add-on in S/4HANA Utilities, Lizenz in Blöcken von 1.000 Objekten, Laufzeit 1–5 Jahre. — [sap.com Utilities Core foundation](https://www.sap.com/products/technology-platform/utilities-core-foundation.html)
- SAP Learning: „SAP Cloud for Utilities foundation“ entspricht MCM und läuft auf BTP mit HANA Cloud und Event Mesh. — [SAP Learning](https://learning.sap.com/learning-journeys/transitioning-to-sap-s-4hana-for-utilities/analyzing-and-applying-sap-market-communication-architecture-for-utilities)
- Das GitHub-Repo „cloud-for-utilities-foundation-samples“ (CAP auf BTP) ist seit 4.3.2025 archiviert. — [GitHub](https://github.com/SAP-samples/cloud-for-utilities-foundation-samples)
- DER-Roadmap:
  - H1 2026: Energiegemeinschaften, Anomalieerkennung
  - H2 2026: steuerbare Anlagen (Wechselrichter, HEMS), synthetische Lastprofile, tiefere S/4-Integration
  - nach 2026: Energy Settlement, Gas, IoT, Agenten
  - — [ASUG 06/2026](https://www.asug.com/insights/clean-data-energy-communities-and-the-flexibility-market-saps-distributed-energy-resources-roadmap)
- SAPinsider (03/2026) beschreibt DER als neue Public-Cloud-Lösung auf BTP und als Datenorchestrierungsschicht, nicht als Steuerungssystem. — [SAPinsider](https://sapinsider.org/articles/distributed-energy-resources-enables-energy-flexibility/)
- Powernaut ist seit 07/2026 Partner. — [Powernaut](https://www.powernaut.io/blog/powernaut-sap-partnership)
- BDC-Datenprodukte für Utilities: Zeitreihen und Stammdaten zur Energiebilanzierung seit Q1 2026, Ablesung und Abrechnung bis Q4 2026 geplant. — [ASUG](https://www.asug.com/insights/sap-bets-on-ai-agents-to-tame-utilities-most-complex-workflow)

### Inferences
- [Ableitung] Cloud for Energy (Zeitreihen und VEE) und DER (MCM plus seit 2026 Zeitreihen) überschneiden sich. Eine Zusammenführung wäre plausibel, belegt ist sie nicht.
- [Ableitung] Für deutsche Netzbetreiber mit vielen EEG-Anlagen ist MCM bzw. DER wegen der Messkonzepte und Rechenformeln (UTILTS) der relevantere Baustein, Cloud for Energy dagegen wegen der Mengen im iMSys-Rollout.

### Gaps
- Keine Aussage, ob Cloud for Energy die deutsche Bilanzierung (MaBiS) oder iMSys-Formate unterstützt
- Kein Abkündigungs- oder Fusionshinweis für Cloud for Energy

---

## 4. Kundenservice: Service Cloud V2 Utilities Add-on, C4U, Agenten

### Takeaway
„SAP Cloud for Utilities (C4U)“ war ab 2018 der Dachname einer SaaS-Suite. Ihre Front-Office-Teile laufen heute als **SAP Sales and Service, utilities add-on** auf Service Cloud V2. Die Grundlage (MCM) wurde über „Utilities Core foundation“ zu SAP Distributed Energy Resources. SAP migriert C4C-Kunden (V1) aktiv auf V2. Den Utilities Customer Self-Service Agent gibt es seit Q4 2025, 2026 kommen Agenten für Abrechnungsausnahmen. Daneben steht Customer Engagement im S/4HANA-Kern (Interaction Center, Agent Workplace).

### Cited Findings
- Add-on-Name „SAP Sales and Service, utilities add-on“: Preis USD 67 pro Nutzer und Monat, Laufzeit 3–36 Monate, integriert mit S/4HANA Utilities. — [sap.com Service Cloud Pricing](https://www.sap.com/products/crm/service-cloud/pricing.html)
- Integration über iFlows mit Kunde, Vertrag und Utilities-Objekten. Schnellansichten für Vertragskonto und Verbrauchsstelle, globale Suche einschließlich Contract Accounts und Premises, Fallmanagement mit Flow Builder. — [SAP Learning Service Cloud](https://learning.sap.com/courses/configuring-master-data-and-basic-functions-in-sap-s-4hana-utilities/attending-the-customer-with-service-cloud)
- Webinar zur Migration C4C (V1) → V2 Utilities Add-on am 11.08.2026: Datenmigration von Vertragskonto und Verbrauchsstelle, Werkzeuge Readiness Check Tool, Data Transfer Tool, TransforMate und AssessMate (KI, in Entwicklung, PDI-Erweiterungen → BTP). — [sap.com Event 08/2026](https://www.sap.com/germany/events/2026-08-11-online-migration-from-c4c-to-service-cloud-version-2-utilities-add-on.html)
- C4U wurde 2018 angekündigt, Ende-zu-Ende-Verfügbarkeit war bis Ende 2021 geplant. C4U ersetzt das On-Premise-IS-U nicht, empfohlen wird ein Hybridmodell. — [Gambit Wiki](https://www.gambit-group.com/at/en/wiki/sap-is-u-utilities/)
- Utilities Customer Self-Service Agent und „AI Summary for Billed Consumption“ sind seit Q4 2025 live. Dazu kommen Case Classification Agent, Case Summary und Similar Case Recommendation in Service Cloud 2.0. Für Q2 2026 ist ein Joule-Agent für Abrechnungsbeleg-Ausnahmen genannt. — [ASUG Joule Utilities](https://www.asug.com/insights/sap-positions-joule-as-a-process-native-copilot-for-the-utilities-value-chain)
- Vier Agenten laut ASUG: Billing-Document-Agent (Q3 2026), Implausible Meter Reading Resolution Agent, Outsorted Invoicing Document Resolution Agent und Utilities Tariff Agent (PoC). — [ASUG Agents](https://www.asug.com/insights/sap-bets-on-ai-agents-to-tame-utilities-most-complex-workflow)
- Der Self-Service-Agent wird im Feb. 2026 als „newly released“ beworben und als nahtlos mit S/4HANA Utilities integriert beschrieben. — [sap.com Event 02/2026](https://www.sap.com/germany/events/2026-02-19-online-smarter-service-for-utilities-introducing-the-utilities-customer-self-service.html)
- Joule in Service Cloud V2 ist in Joule Base ohne Aufpreis enthalten. — [sap.com Joule SSCV2](https://www.sap.com/germany/products/crm/joule-with-sap-service-cloud-version-2.html)
- Customer Engagement in S/4HANA Utilities: Interaction Center mit Suche, Ablesung, Rechnungskorrektur, Ein- und Auszug, BPEM-Fall und Agent Workplace. — [SAP Learning Customer Engagement](https://learning.sap.com/courses/transitioning-to-sap-s-4hana-for-utilities/utilizing-customer-engagement-functions-for-effective-customer-service-operations)

### Inferences
- [Ableitung] „C4U“ ist als Produktname überholt. Wer ihn in Ausschreibungen liest, meint heute meist das V2 Utilities Add-on oder einen C4C-Bestand.

### Gaps
- Kein offizielles Wartungsende für C4C V1 bzw. C4C for Utilities
- Uneinheitliche Termine für den Billing-Exception-Agenten (Q2 vs. Q3 2026)

---

## 5. Österreich: EDA / ebUtilities

### Takeaway
Die österreichische MaKo läuft zentral über die Kommunikationsplattform **EDA** (EDA GmbH, getragen von Netzbetreibern und Interessenvertretungen). Technik: AS4/ebMS3 mit Ponton X/P, verschlüsselte ebUtilities-XML-Nachrichten. Das Regelwerk liegt bei E-Control: SoMa MaKo V2.1 gilt seit 23.12.2025, Rechtsgrundlage ElWG §17. ebUtilities ist die Informationsplattform mit Registrierung und Prozessbeschreibungen. SAP bietet für Österreich keinen Cloud-Service. Auf SAP-Seite gibt es die IS-U-Lokalisierung **IDEX-AT**, die Partner wie DSC betreuen. Die Strecke zu EDA läuft typischerweise über Ponton-Messenger-Instanzen, die z. B. in eine SAP-PI/PO-Landschaft eingebunden sind.

### Cited Findings
- EDA: standardisierter, verschlüsselter Datenaustausch mit 15 Gesellschaftern, privatem Netz, Hosting in Österreich, Anbindung in unter 20 Tagen. Zugangsarten: GEA, CCM, EEG, BEG. Anbindung über Anwenderportal, E-Mail-Gateway oder KEP. Stand 28.02.2023: 139 Netzbetreiber, 305 Lieferanten/BGV, 290 EEG. — [Klimafonds EDA](https://www.klimafonds.gv.at/wp-content/uploads/sites/16/10_Leo-Kammerdiener_EDA.pdf)
- EDA wird von der EDA GmbH im Auftrag der Netzbetreiber betrieben. SoMa MaKo V2.1 gilt seit 23.12.2025 und regelt EDA (Kommunikationsplattform) und ebUtilities (Informationsplattform). Rechtsgrundlage ist ElWG §17, Aufsicht E-Control. Diskutiert wird ein zentraler Data Hub statt Punkt-zu-Punkt. — [TU Graz EnInnov 02/2026](https://www.tugraz.at/fileadmin/user_upload/Events/Eninnov/EnInnov2026/files/pr/233_PR_Eichberger.pdf)
- Technik: AS4 mit ebMS3, dateibasiert mit verschlüsselten XML-Dateien, ohne API. Die Prozesse sind auf ebUtilities dokumentiert, z. B. CM_REQ_ONL, CCMO, ConsumptionRecord. Anbindung über den Ponton X/P Messenger per Java-API. — [FH Hagenberg EDDIE](https://eddie-web.projekte.fh-hagenberg.at/architecture/eddie_framework/building_block_view/Regional_Connectors/Austria/Austria.html)
- Laut Firmenprofil wurde die EDA Energiewirtschaftlicher Datenaustausch GmbH 2021 gegründet und hat ihren Sitz in 1100 Wien. — [karriere.at](https://www.karriere.at/f/eda-energiewirtschaftlicher-datenaustausch)
- Wer in Österreich teilnimmt, muss sich bei ebUtilities registrieren und erhält eine ID wie EP100005. — [FH Hagenberg EDA](https://eddie-web.projekte.fh-hagenberg.at/architecture/appendix/prerequisites/access-to-historical-data/austria-eda/austria-eda.html)
- Ponton: ebMS 2.0 läuft in EDA seit 2012, AS4 folgt. Über 99 % der Prozesse, auch der Lieferantenwechsel, laufen in unter einer Minute vollautomatisch. Grundsatz: ein Format, ein Prozess, ein Protokoll. Das Jahr der AS4-Umstellung nennt der Artikel nicht. — [energate](https://www.energate-messenger.com/news/220936/over-99-per-cent-of-the-processes-are-fully-automated-in-less-than-a-minute)
- Ponton-Website: Energie AG OÖ würdigt das EDA-Projekt, Ponton X/P liegt in Version 5.0 vor. — [Ponton](https://www.ponton.de/)
- DSC Österreich (seit 2007) nennt ausdrücklich Know-how in „sämtlichen IDEX-AT-Modulen“. — [DSC Österreich](https://www.dsc-gmbh.com/dsc-oesterreich/)
- Projektausschreibung in Wien für SAP PI/PO mit Betreuung der Ponton-Messenger-Instanzen für EDA. — [freelancermap.at](https://www.freelancermap.at/projekt/sap-po-pi-bpm-brm-consultant)
- MaCo Cloud nur für Deutschland. — [SAP Learning](https://learning.sap.com/learning-journeys/transitioning-to-sap-s-4hana-for-utilities/analyzing-and-applying-sap-market-communication-architecture-for-utilities)
- SAP-Roadmap: 2024 Konzept zur Internationalisierung der Marktkommunikation, 2025 „Enabling International Market Communication“. — [SAP-Blog Roadmap 2024/2025](https://blogs.sap.com/t5/enterprise-resource-planning-blogs-by-sap/sap-utilities-roadmap-2024-and-2025/ba-p/13580314)

### Inferences
- [Ableitung] Typische Kette bei SAP-Kunden in Österreich: IS-U bzw. S/4HANA Utilities mit IDEX-AT (ggf. künftig APE) ↔ Middleware (SAP PI/PO, künftig Integration Suite) ↔ Ponton X/P ↔ EDA. Mit dem PI/PO-Ende (int: pipo) rückt diese Strecke bei S/4-Projekten mit in den Scope.
- [Ableitung] Ob IDEX-AT in S/4HANA als eigenes Paket oder über APE weitergeführt wird, ist offen. Das sollte man bei SAP oder DSC klären.

### Gaps
- Keine SAP-Primärquelle zu IDEX-AT (Umfang, Freigabe für S/4HANA, Wartung)
- Kein belegtes AS4-Umstellungsjahr für EDA, kein Inhalt von ebutilities.at abrufbar

---

## 6. S/4HANA Utilities Roadmap 2025/2026, Wartung, Conversion

### Takeaway
IS-U auf ECC: Mainstream-Wartung bis 31.12.2027, Extended Maintenance bis 2030, Transition Option 2031–2033 nur in Private Edition. Das Release 2025 brachte Market Process Management und Prepayment in den Kern, Business Events für sechs technische Objekte, Key-User-Erweiterungen für Zählpunkt und BPEM sowie UPIL-Preisgarantien. KI kommt zuerst als Agenten für Abrechnungsausnahmen, ergänzt um BDC-Datenprodukte. Im Feld sind alle Conversion-Wege vertreten: Brownfield mit SUM/DMO (Uniper Wärme), selektiv mit großen Datenmengen (ENGIE: 40 TB, unter 40 h Downtime) und Greenfield-Plattformen (Arvato AEP.EnerS4).

### Cited Findings
- Wartungsfristen: Ende 2027 läuft die Mainstream-Wartung aus, gegen Aufpreis gibt es Extended Maintenance bis Ende 2030. Erste ML-Funktionen kamen mit 1909. — [Gambit Wiki](https://www.gambit-group.com/at/en/wiki/sap-is-u-utilities/)
- Transition Option 2031–2033, wenn bis Ende 2030 auf ERP Private Edition auf HANA umgestellt ist. Innovationszusage für S/4HANA bis 2040. — [innobu Clean Core](https://www.innobu.com/en/articles/s4hana-utilities-clean-core-2026.html)
- Innovationen 2025:
  - Market Process Management im Kern; die APE übernimmt die Kommunikation mit Smart Metern und Marktpartnern, Prozesse sind versioniert
  - Prepayment im Kern
  - Sales Integration Interface
  - UPIL mit Preisgarantien
  - Key-User-Erweiterbarkeit für PoD und BPEM
  - Business Events für Premise, Anschlussobjekt, Geräteplatz, Anlage, Gerät und PoD
  - Datasphere/SAC-Integration
  - — [ASUG 2025](https://www.asug.com/insights/breaking-down-saps-latest-s-4hana-utilities-innovations-for-2025)
- APE ist der Nachfolger von MPM ab S/4HANA 2208. Sie bringt Fiori-Monitoring für TDOC, PDOC und Ausnahmen, Fiori-Konfiguration, RAP/OData und ein eingebautes Test-Framework. Die Linie geht von IDE (ECC) über IDEX (/IDXPF/) und MPM (/IDXGC/) zur APE. — [SAP Community APE](https://groups.community.sap.com/t5/sap-for-utilities-blogs/introducing-application-process-engine-ape-latest-sap-solution-for-choice/ba-p/13548853)
- KI-Bausteine:
  - BPEM-Agent (Joule Studio, CAP auf BTP, S/4HANA On-Premise mit Utilities und BPEM, Leitfaden v1.0 vom 13.04.2026) — [api.sap.com BPEM Agent](https://api.sap.com/odata/1.0/catalog.svc/Files('SAP_BPEM_Agent_Configuration_guide')/$value)
  - KI-Funktion „Resolution of Outsorted Billing Documents“ (Joule Base, Private Edition) — [sap.com](https://www.sap.com/australia/products/erp/s4hana-cloud-private-edition-resolution-of-outsorted-billing-documents.html)
- SAP Utilities Core: angekündigt am 18.01.2022 als Cloud-Nachfolger von IS-U. SAP gründete dafür eine Enablement Community mit vier Partnern. — [Natuvion 04/2022](https://natuvion.com/newsroom/digital-energy-transition-sap-utilities-core)
- Utilities Core for Germany läuft auf RISE und BTP und umfasst APE-Prozessvorlagen und ein Front Office. — [Natuvion](https://natuvion.com/sap-s-4hana-utilities)
- Utilities Core (for Germany) ist ein kommerzielles Bündel, die Ausprägung for Germany enthält zusätzlich die Cloud-MaKo. — [SAP Learning](https://learning.sap.com/courses/discovering-business-processes-in-sap-s-4hana-utilities/understanding-the-core-concepts-of-s-4hana-utilities)
- Kunden und Projekte:
  - SachsenEnergie: Utilities Core, Abschluss bis Anfang 2027 — [SAP News 05/2024](https://news.sap.com/germany/2024/05/sachsenenergie-sap-utilities-core-sap-s-4hana/)
  - N-Ergie: Go-live Lieferant am 10.04.2025 nach zwei Jahren, mit über 200 Schnittstellen und über 2.600 bestandenen Testfällen — [ZfK](https://www.zfk.de/digitalisierung/it/n-ergie-geht-mit-sap-s-4hana-utilities-fuer-die-marktrolle-lieferant-live)
  - Uniper Wärme: Brownfield mit SUM DMO — [IntelligentCIO 10/2024](https://www.intelligentcio.com/eu/?p=116674)
  - ENGIE: selektive Migration, 40 TB, eine Tabelle mit über 7 Mrd. Einträgen, unter 40 h Downtime — [Natuvion ENGIE](https://www.natuvion.com/successful-sap-s4hana-utilities-migration)
  - Arvato AEP.EnerS4: zentrales S/4HANA-Utilities-Mastersystem für Abrechnung und MaKo, ENNI bis 10/2027 — [SAP News 08/2026](https://news.sap.com/germany/2026/08/arvato-systems-umstieg-mit-sap-plattformgeschaeft-energieversorger/)
- Studien:
  - Energie und Wasser: 53 % in Umsetzung, 20 % fertig, 63 % halten die Kosten für zu hoch (valantic/techconsult). — [ZfK 05/2026](https://www.zfk.de/digitalisierung/it/sap-migration-wird-fuer-versorger-zur-kostenfrage)
  - 70 Befragte aus EVU, 37 % melden Verzögerungen (PwC). Die Pressemitteilung datiert den 24-h-Wechsel auf „seit Januar 2026“, was dem BNetzA-Termin 6.6.2025 widerspricht (die EU-Frist war der 1.1.2026). — [PwC 04/2026](https://www.pwc.de/de/pressemitteilungen/2026/pwc-studie-paradigmenwechsel-bei-erp-systemen-in-der-energiewirtschaft.html)

### Inferences
- [Ableitung] Für Testmanager ist die APE wichtig. Sie bringt ein eigenes Test-Framework für Marktprozesse mit, das man mit Cloud-ALM-Testplänen verzahnen sollte.

### Gaps
- Die offizielle SAP Utilities Roadmap 2026 (Roadmap Explorer, Community-Blog) war nicht lesbar
- Keine Belege zu den Utilities-Simplification-Items, zu FI-CA-Besonderheiten bei der Conversion und zum CVI-Vorgehen speziell für IS-U

---

## 7. Grid-Asset-Management, GIS, Investitionsprojekte

### Takeaway
Die Netzanlagen liegen in S/4HANA EAM, dazu kommen APM (Zustand, Risiko, RCM/FMEA, IoT, visuelle KI-Inspektion) und SAP Asset Manager mobil. Für GIS gibt es **SAP S/4HANA for spatial asset management**: Geo-Framework plus lineare Anlagen, HANA-Spatial-Speicher, REST-Feature-Services und vorkonfigurierte Esri-ArcGIS-Anbindung, lizenziert pro Nutzer, für On-Premise und Private Cloud. Esri unterstützt HANA Cloud als Geodatenbank. Partner wie VertiGIS und Geonexus synchronisieren GIS und EAM. Zu Investitionsprojekten wurde nichts Utilities-Spezifisches gefunden, hier gilt eppm.

### Cited Findings
- APM-Funktionen: Asset Health (Regeln auf IoT-Batch- und Streamingdaten, automatische Meldungen in EAM), Risiko und Kritikalität, RCM nach SAE JA1012, FMEA, visuelle KI-Inspektion (Kamera, Drohne), Standardintegration mit SAP EAM. — [sap.com APM Features](https://www.sap.com/products/scm/apm/features.html)
- APM-Preise: USD 72 pro Monat und 100 Objekte (Equipment und technische Plätze), mindestens 125 Blöcke, 1 Produktiv- und 2 Test-Tenants, Laufzeit 3–60 Monate, Add-on „Advanced capabilities“ nach Kapazitätseinheiten. — [sap.com APM Pricing](https://www.sap.com/products/scm/apm/pricing.html)
- EAM-Architektur: S/4HANA Maintenance, APM mit Predictive Asset Insights, Asset Manager; Partner sind LiveEO, Future Grid und EY. GIS und Investitionsmanagement behandelt der Kurs nicht. — [SAP Learning EAM](https://learning.sap.com/courses/transitioning-to-sap-s-4hana-for-utilities/explaining-asset-management-eam-architecture)
- SAP S/4HANA for spatial asset management: Geo-Framework und lineare Anlagen, Spatial Explorer und Editor, Feature Services, Esri vorkonfiguriert, pro Nutzer, Basis-Plan S/4HANA Cloud Private Edition. — [sap.com Spatial Asset Management](https://www.sap.com/products/scm/spatial-asset-management.html)
- GEF verknüpft Equipment, technische Plätze, Meldungen und Aufträge mit Geodaten, die Esri-Anbindung ist vorkonfiguriert. — [valantic GEF](https://www.valantic.com/en/blog/sap-geo-framework-data-in-maintenance/)
- Esri ArcGIS Enterprise unterstützt SAP HANA Cloud (04/2021), Beispiel Open Grid Europe. — [Geospatial World](https://geospatialworld.net/news/esri-and-sap-advance-integration-of-business-technology-and-gis-platforms)
- Referenzarchitektur „HANA Cloud als Esri-Geodatenbank“ (archiviert, Stand 25.03.2025). — [SAP Architecture Center](https://architecture.learning.sap.com/docs/ref-arch/e4f25a)
- Geonexus synchronisiert ArcGIS mit PM, Service and Asset Manager und Geo Framework. — [SAP Store Geonexus](https://www.sap.com/products/scm/partners/geonexus-technologies-llc-geonexus-integration-platform.html)
- VertiGIS nennt Beispiele für GIS-SAP-Integration bei Versorgern. — [VertiGIS](https://www.vertigis.com/vertigis_blog/how-utilities-can-harness-the-benefits-of-gis-sap-integration/)

### Gaps
- Keine Belege zu Investitionsprogrammen für Netzausbau (IM/PS/PPM), zu Netzleittechnik-Integration und zu ArcGIS Utility Network

---

## 8. E-Rechnung Energiewirtschaft (Ergänzung zu drc)

### Cited Findings
- BDEW und VKU (09/2026) wollen Rechtssicherheit, dass EDI@Energy INVOIC über den 31.12.2027 hinaus als E-Rechnung gilt. Ihre Mapping-Übersicht zeigt INVOIC als interoperabel mit EN 16931. Offene Punkte:
  - Abschlagspläne als zusammengefasste Vorausrechnungen, vorerst als Freitext oder Anhang
  - Rechnungsartcodes 380/386 und 389 bei Gutschrift
  - Rückmeldung des BMF bis etwa Ende Oktober 2026 erbeten
  - — [BDEW E-Rechnung](https://www.bdew.de/service/umsetzungsfragen-zur-obligatorischen-e-rechnung-im-b2b-bereich/), [BDEW/VKU Stellungnahme](https://www.bdew.de/media/documents/2026_09_21_BDEW_VKU_Stellungnahme_E-Rechnung.pdf)

### Gaps
- Wie FI-CA und IS-U-Massenrechnungen an DRC/eDocument angebunden werden, ist weiter unbelegt
