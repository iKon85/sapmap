# Datenmodell

`data/steckbriefe.json` ist ein JSON-Array. Ein Objekt pro Baustein:

```json
{
  "id": "eindeutige-kurze-id",
  "layer": "Bereich, siehe unten",
  "parent": "optional: ID des Dach-Steckbriefs (Portfolio)",
  "name": "aktueller offizieller Name, so wie SAP ihn schreibt",
  "aka": ["frühere oder alternative Namen"],
  "kurz": "ein Satz, max. 110 Zeichen",
  "was": "was die Lösung fachlich leistet",
  "wie": "wie sie technisch funktioniert",
  "s4": "Bezug zu / Anbindung an S/4HANA",
  "wann": "wann man sie einsetzt, Abgrenzung zu Alternativen",
  "test": "was das für Test und Qualität bedeutet (Testperspektive)",
  "lizenz": "Lizenz und Paketierung",
  "status": "aktiv | neu | umbenannt | auslaufend | abgekuendigt",
  "statusText": "kurze Erläuterung zum Status",
  "daten": [{"datum": "YYYY, YYYY-MM oder YYYY-MM-DD", "text": "Ereignis"}],
  "verwandt": ["2 bis 5 IDs"],
  "quellen": [{"titel": "kurzer Titel", "url": "https://..."}],
  "belegt": "ja | teilweise | nein",
  "hinweis": "Widersprüche zwischen Quellen, Unsicherheiten"
}
```

Quartalsangaben als Jahr eintragen und das Quartal an den Anfang von `text` setzen (z. B. `"Q3 2026: …"`).

`data/toolchain-flows.json`: Array von `{"von", "nach", "was", "richtung": "einseitig|beidseitig", "quelle"}`.

## Bereiche und aktuelle IDs

### `core`: S/4HANA-Kern & Deployment (inkl. Projektmanagement als Fachfunktion)

- `s4-cloud-erp`: SAP Cloud ERP
- `s4-private`: SAP Cloud ERP Private
- `s4-onprem`: SAP S/4HANA
- `business-suite`: SAP Business Suite
- `rise-grow`: RISE with SAP & SAP GROW
- `hana-db`: SAP HANA
- `fiori`: SAP Fiori
- `embedded-analytics`: SAP S/4HANA Embedded Analytics
- `ewm`: SAP Extended Warehouse Management
- `tm`: SAP Transportation Management
- `ppds-aatp`: PP/DS & Advanced ATP
- `group-reporting`: SAP S/4HANA Finance for Group Reporting
- `central-finance`: SAP Central Finance
- `mdg`: SAP Master Data Governance
- `gts`: SAP Global Trade Services, edition for SAP HANA
- `business-partner`: SAP Business Partner (CVI)
- `is-u`: SAP S/4HANA Utilities
- `h4s4`: SAP HCM for SAP S/4HANA
- `ide-ape`: Intercompany Data Exchange / Application Process Engine (IDE, IDEX, APE)
- `eppm`: SAP Enterprise Portfolio and Project Management (PS, PPM, IM)
- `cpm`: SAP Commercial Project Management
- `public-projects`: Enterprise Projects & Professional Services (SAP Cloud ERP)

### `ext`: Clean Core & Erweiterbarkeit

- `clean-core`: Clean Core
- `key-user-ext`: Key-User-Erweiterbarkeit (In-App)
- `abap-cloud`: ABAP Cloud
- `atc`: ABAP Test Cockpit & Clean-Core-Dashboard

### `btp`: SAP BTP / Business AI Platform

- `btp`: SAP Business Technology Platform (SAP BTP) / SAP Business AI Platform
- `cf-runtime`: SAP BTP, Cloud Foundry Environment
- `kyma`: SAP BTP, Kyma Runtime
- `abap-env`: SAP BTP ABAP Environment
- `cap`: SAP Cloud Application Programming Model (CAP)
- `build-code`: SAP Build Code
- `build-pa`: SAP Build Process Automation
- `work-zone`: SAP Build Work Zone (standard edition / advanced edition)
- `build-apps`: SAP Build Apps
- `hana-cloud`: SAP HANA Cloud
- `cloud-connector`: SAP Cloud Connector, Connectivity Service & Destination Service
- `task-center`: SAP Task Center
- `ctms`: SAP Cloud Transport Management & SAP Continuous Integration and Delivery
- `neo`: SAP BTP, Neo Environment

### `ai`: Business AI & Joule

- `joule`: Joule
- `autonomous-suite`: SAP Autonomous Suite (Joule Agents & Joule Assistants)
- `joule-work`: Joule Work
- `joule-studio`: Joule Studio
- `ai-core`: SAP AI Core & Generative AI Hub
- `rpt-1`: SAP-RPT-1
- `ai-agent-hub`: SAP AI Agent Hub
- `joule-dev`: SAP Joule for Developers (ABAP AI) & SAP MCP-Server

### `int`: Integration

- `integration-suite`: SAP Integration Suite
- `cloud-integration`: Cloud Integration (Capability der SAP Integration Suite)
- `api-mgmt`: API Management (Capability der SAP Integration Suite)
- `integration-advisor-tpm`: Integration Advisor & Trading Partner Management
- `open-connectors`: Open Connectors (Capability der SAP Integration Suite)
- `sap-graph`: Graph in SAP Integration Suite
- `integration-assessment`: Integration Assessment & SAP Integration Solution Advisory Methodology (ISA-M)
- `migration-assessment`: Migration Assessment & Migration Tool (PI/PO → Integration Suite)
- `eic`: Edge Integration Cell
- `event-mesh`: SAP Event Mesh
- `aem`: SAP Integration Suite, advanced event mesh
- `event-hub`: SAP Cloud Application Event Hub
- `s4-business-events`: SAP S/4HANA Business Events & Event Add-on
- `s4-apis`: S/4HANA-Schnittstellen (OData, SOAP, IDoc, RFC, Communication Arrangements)
- `mdi`: SAP Master Data Integration & SAP One Domain Model
- `slt`: SAP Landscape Transformation Replication Server
- `data-services`: SAP Data Services
- `data-intelligence`: SAP Data Intelligence
- `pipo`: SAP Process Integration / Process Orchestration 7.5
- `accelerator-hub`: SAP Business Accelerator Hub

### `data`: Daten & Analytics

- `bdc`: SAP Business Data Cloud
- `datasphere`: SAP Datasphere
- `sac`: SAP Analytics Cloud
- `bw`: SAP BW/4HANA & SAP BW, private cloud edition
- `sap-databricks`: SAP Databricks
- `bdc-connect`: SAP Business Data Cloud Connect
- `dremio`: Dremio-Übernahme & BDC-Lakehouse
- `businessobjects`: SAP BusinessObjects Business Intelligence

### `lob`: LoB-Cloud-Apps & Branchen

- `successfactors`: SAP SuccessFactors
- `ecp`: SAP SuccessFactors Employee Central Payroll
- `ariba`: SAP Ariba
- `business-network`: SAP Business Network
- `concur`: SAP Concur
- `fieldglass`: SAP Fieldglass
- `sales-service-cloud`: SAP Sales Cloud und SAP Service Cloud Version 2
- `commerce-emarsys`: SAP Commerce Cloud, SAP Emarsys, SAP Customer Data Solutions, SAP CPQ
- `fsm`: SAP Field Service Management
- `ibp`: SAP Integrated Business Planning for Supply Chain
- `dmc`: SAP Digital Manufacturing
- `apm`: SAP Asset Performance Management
- `bn-logistics`: SAP Business Network for Logistics
- `taulia-cashapp`: SAP Taulia und SAP Cash Application
- `drc`: SAP Document and Reporting Compliance
- `sustainability`: SAP Green Ledger und SAP Sustainability Footprint Management
- `cloud-for-energy`: SAP Cloud for Energy
- `maco-cloud`: SAP Market Communication for Utilities
- `redispatch`: Redispatch 2.0, §14a EnWG und iMSys-Prozesse (Netzbetreiber-Bausteine)
- `eda-at`: EDA – Energiewirtschaftlicher Datenaustausch (Österreich) mit ebUtilities
- `der`: SAP Distributed Energy Resources
- `prm`: SAP Project and Resource Management

### `tool`: Toolchain, ALM & Test

- `agent-led-toolchain`: Agent-led toolchain (RISE with SAP Methodology)
- `signavio`: SAP Signavio Process Transformation Suite
- `signavio-pm`: SAP Signavio Process Manager (Teil von `signavio`)
- `signavio-pi`: SAP Signavio Process Intelligence (Teil von `signavio`)
- `signavio-pins`: SAP Signavio Process Insights (Teil von `signavio`)
- `signavio-hub`: SAP Signavio Process Collaboration Hub (Teil von `signavio`)
- `signavio-governance`: SAP Signavio Process Governance (Teil von `signavio`)
- `signavio-ptm`: SAP Signavio Process Transformation Manager (Teil von `signavio`)
- `process-navigator`: SAP Signavio Process Navigator
- `leanix`: SAP LeanIX
- `leanix-apm`: SAP LeanIX Application Portfolio Management (Teil von `leanix`)
- `leanix-arp`: SAP LeanIX Architecture and Road Map Planning (Teil von `leanix`)
- `leanix-trc`: SAP LeanIX Technology Risk and Compliance (Teil von `leanix`)
- `cloud-alm`: SAP Cloud ALM
- `cloud-alm-ops`: SAP Cloud ALM for Operations
- `tricentis-ect`: SAP Enterprise Continuous Testing by Tricentis
- `tricentis-cia`: SAP Change Impact Analysis by Tricentis
- `tricentis-perf-data`: SAP Solution Extensions by Tricentis für Performance- und Datentests
- `tricentis-perf-data-ept`: SAP Enterprise Performance Testing by Tricentis (Teil von `tricentis-perf-data`)
- `tricentis-perf-data-dit`: SAP Enterprise Data Integrity Testing by Tricentis (Teil von `tricentis-perf-data`)
- `walkme`: WalkMe
- `walkme-dap`: WalkMe Digital Adoption Platform (Teil von `walkme`)
- `walkme-learning-arc`: WalkMe Learning Arc (Teil von `walkme`)
- `walkme-haiku`: Haiku by WalkMe (Teil von `walkme`)
- `walkme-enable-now`: SAP Enable Now (Teil von `walkme`)
- `solman`: SAP Solution Manager 7.2
- `calm-test`: SAP Cloud ALM – Test Management
- `calm-test-automation`: Testautomatisierung in SAP Cloud ALM (Test Automation Tool & Tricentis Test Automation for SAP)
- `calm-test-api`: Test-Automation-Schnittstelle und Test-APIs von SAP Cloud ALM

### `mig`: Migration & Transformation

- `readiness-check`: SAP Readiness Check
- `migration-cockpit`: SAP S/4HANA Migration Cockpit
- `sum-dmo`: Software Update Manager & Database Migration Option
- `custom-code-migration`: Custom Code Migration & Simplification Items
- `btc`: SAP Business Transformation Center
- `sdt`: Selective Data Transition
- `transition-option`: SAP ERP, private edition, transition option
- `syniti-admm`: SAP Advanced Data Migration and Management by Syniti
- `tdms`: SAP Test Data Migration Server (TDMS)
- `maintenance-planner`: Maintenance Planner & Simplification Item Check
- `dmlt`: SAP Data Management and Landscape Transformation (DMLT)
- `snp-kyano`: SNP Kyano (Partnerlösung)

### `pm`: Einführungsprojekt steuern (Activate, Cloud-ALM-Projekte)

- `activate`: SAP Activate & RISE with SAP Methodology
- `calm-pm`: Projektmanagement in SAP Cloud ALM
- `joule-consultants`: SAP Joule for Consultants
- `jira-ado`: Anbindung Jira / Azure DevOps an SAP Cloud ALM

### `sec`: Security, Identity & GRC

- `cloud-identity`: SAP Cloud Identity Services
- `iag`: SAP Cloud Identity Access Governance
- `idm`: SAP Identity Management 8.0
- `grc`: SAP GRC (Access Control, Process Control, Risk Management)
- `etd`: SAP Enterprise Threat Detection
- `uidp`: UI Data Protection (Masking und Logging)
- `data-privacy`: SAP Information Lifecycle Management und SAP Data Privacy Integration

### `ops`: Betrieb & Infrastruktur

- `rise-ecs`: RISE-Betrieb durch SAP Enterprise Cloud Services
- `sovereign-cloud`: SAP Sovereign Cloud
- `focused-run`: SAP Focused Run
- `lama`: SAP Landscape Management 3.0
