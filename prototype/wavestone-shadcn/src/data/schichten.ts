// PROTOTYP: Platzierung im Schichtenmodell, 1:1 aus renderStack() (Objekt cfg) in src/landkarte.html.
// Ein Eintrag ist [id, Kurzlabel] für einen Baustein oder ein String für einen reinen Text-Kasten.
export type Item = [id: string, label?: string] | string
export type BoxColor =
  | "ui"
  | "saas"
  | "btp"
  | "ai"
  | "bdc"
  | "non"
  | "bus"
  | "s4"
  | "cc"
  | "in"
  | "quer"
  | "lc"
export interface BoxCfg {
  cls: BoxColor
  t?: string
  tid?: string
  items?: Array<Item>
  sub?: Array<Omit<BoxCfg, "cls"> & { cls?: BoxColor }>
}

export const SPALTEN = ["saas", "btp", "bdc", "non"] as const

export const UI: Array<BoxCfg> = [
  { cls: "ui", items: ["Oberflächen der SaaS-Apps"] },
  {
    cls: "ui",
    items: [
      ["fiori", "Fiori Launchpad"],
      ["work-zone", "Build Work Zone"],
      ["joule", "Joule"],
      ["joule-work", "Joule Work"],
    ],
  },
  {
    cls: "ui",
    items: [
      ["sac", "SAP Analytics Cloud"],
      ["businessobjects", "BusinessObjects"],
    ],
  },
  { cls: "ui", items: ["Partner- und Lieferantenportale"] },
]

export const APP: Array<BoxCfg> = [
  {
    cls: "saas",
    t: "SAP-Cloud-Apps (SaaS)",
    items: [
      ["successfactors", "SuccessFactors"],
      ["ecp", "EC Payroll"],
      ["ariba", "Ariba"],
      ["concur", "Concur"],
      ["fieldglass", "Fieldglass"],
      ["sales-service-cloud", "Sales & Service Cloud"],
      ["commerce-emarsys", "Commerce, Emarsys, CPQ"],
      ["fsm", "Field Service Mgmt"],
      ["ibp", "IBP"],
      ["dmc", "Digital Manufacturing"],
      ["apm", "Asset Performance Mgmt"],
      ["taulia-cashapp", "Taulia, Cash App"],
      ["drc", "E-Rechnung (DRC)"],
      ["sustainability", "Green Ledger, SFM"],
      ["prm", "Project & Resource Mgmt"],
      ["cloud-for-energy", "Cloud for Energy"],
      ["der", "Distributed Energy Res."],
      ["maco-cloud", "MaCo Cloud (MaKo)"],
      ["business-network", "Business Network"],
      ["bn-logistics", "BN for Logistics"],
    ],
  },
  {
    cls: "btp",
    t: "SAP BTP · Business AI Platform",
    tid: "btp",
    sub: [
      {
        t: "Eigene Apps & Prozesse (Side-by-Side)",
        items: [
          ["build-code", "Build Code"],
          ["cap", "CAP"],
          ["build-pa", "Build Process Automation"],
          ["task-center", "Task Center"],
          ["build-apps", "Build Apps"],
        ],
      },
      {
        t: "KI & Agenten",
        cls: "ai",
        items: [
          ["joule-studio", "Joule Studio"],
          ["autonomous-suite", "Joule Agents"],
          ["ai-agent-hub", "AI Agent Hub"],
          ["joule-dev", "Joule for Developers"],
          ["rpt-1", "SAP-RPT-1"],
        ],
      },
      {
        t: "Laufzeiten & Dienste",
        items: [
          ["cf-runtime", "Cloud Foundry"],
          ["kyma", "Kyma"],
          ["abap-env", "ABAP Environment"],
          ["ai-core", "AI Core, Gen AI Hub"],
          ["hana-cloud", "HANA Cloud"],
          ["ctms", "Transport Mgmt, CI/CD"],
          ["neo", "Neo (endet 2028)"],
        ],
      },
    ],
  },
  {
    cls: "bdc",
    t: "SAP Business Data Cloud",
    tid: "bdc",
    items: [
      "Data Products (SAP-verwaltet)",
      ["datasphere", "Datasphere"],
      ["bw", "BW PCE, BW/4HANA"],
      ["sap-databricks", "SAP Databricks"],
      ["bdc-connect", "BDC Connect"],
      ["dremio", "Dremio (Lakehouse)"],
      ["hana-cloud", "HANA Cloud, Data Lake"],
    ],
  },
  {
    cls: "non",
    t: "Nicht-SAP & Partner",
    items: [
      "Fremdsysteme (CRM, MES, GIS)",
      "Banken, Zahlungsverkehr",
      "Marktpartner (EDIFACT, AS4)",
      ["eda-at", "EDA Österreich (Ponton)"],
      ["redispatch", "Redispatch 2.0 (Partner)"],
      "Behörden (Peppol)",
      "Hyperscaler-Dienste",
    ],
  },
]

export const BUS: BoxCfg = {
  cls: "bus",
  t: "Integration & Events · läuft auf SAP BTP",
  tid: "integration-suite",
  items: [
    ["cloud-integration", "Cloud Integration"],
    ["api-mgmt", "API Management"],
    ["integration-advisor-tpm", "Integration Advisor, TPM"],
    ["open-connectors", "Open Connectors"],
    ["sap-graph", "Graph"],
    ["event-mesh", "Event Mesh"],
    ["aem", "Advanced Event Mesh"],
    ["event-hub", "Cloud Application Event Hub"],
    ["mdi", "Master Data Integration"],
    ["eic", "Edge Integration Cell"],
    ["integration-assessment", "Integration Assessment (ISA-M)"],
    ["migration-assessment", "PI/PO-Migration Assessment"],
    ["accelerator-hub", "Business Accelerator Hub"],
    ["slt", "SLT (Replikation)"],
    ["data-services", "Data Services"],
    ["data-intelligence", "Data Intelligence"],
    ["pipo", "PI/PO (endet 2027)"],
  ],
}

export const S4: BoxCfg = {
  cls: "s4",
  t: "SAP S/4HANA",
  tid: "s4-private",
  items: [
    ["s4-private", "Cloud ERP Private (RISE)"],
    ["s4-cloud-erp", "Cloud ERP (Public)"],
    ["s4-onprem", "On-Premise"],
    ["rise-grow", "RISE, GROW"],
    ["business-suite", "Business Suite"],
  ],
  sub: [
    {
      t: "Schnittstellen nach außen · Clean-Core-Grenze",
      tid: "clean-core",
      cls: "cc",
      items: [
        ["s4-apis", "Released APIs (OData, SOAP, IDoc, RFC)"],
        ["s4-business-events", "Business Events"],
        ["embedded-analytics", "CDS-Views, VDM, Embedded Analytics"],
      ],
    },
    {
      t: "Erweiterungen im System (On-Stack)",
      items: [
        ["key-user-ext", "Key-User-Erweiterungen"],
        ["abap-cloud", "ABAP Cloud, RAP"],
        ["atc", "ABAP Test Cockpit"],
      ],
    },
    {
      t: "Anwendungskern",
      items: [
        ["business-partner", "Business Partner, CVI"],
        ["central-finance", "Central Finance"],
        ["group-reporting", "Group Reporting"],
        ["ewm", "EWM"],
        ["tm", "TM"],
        ["ppds-aatp", "PP/DS, aATP"],
        ["mdg", "MDG"],
        ["gts", "GTS"],
        ["is-u", "S/4HANA Utilities"],
        ["ide-ape", "IDE, APE (MaKo-Prozesse)"],
        ["h4s4", "HCM for S/4HANA"],
        ["eppm", "PS, PPM, Invest. Mgmt"],
        ["cpm", "Commercial Project Mgmt"],
        ["public-projects", "Enterprise Projects"],
      ],
    },
  ],
}

export const DB: BoxCfg = {
  cls: "s4",
  t: "Datenbank",
  items: [["hana-db", "SAP HANA (In-Memory-Datenbank unter S/4HANA)"]],
}

export const INFRA: BoxCfg = {
  cls: "quer",
  t: "Infrastruktur & Betrieb",
  items: [
    ["rise-ecs", "RISE-Betrieb (ECS), DR"],
    ["sovereign-cloud", "Hyperscaler, Sovereign Cloud, STACKIT"],
    ["focused-run", "Focused Run"],
    ["cloud-alm-ops", "Cloud ALM for Operations"],
    ["lama", "LaMa (endet 2027)"],
  ],
}

export const SEC: BoxCfg = {
  cls: "quer",
  t: "Security & Identity",
  items: [
    ["cloud-identity", "Cloud Identity Services"],
    ["iag", "Identity Access Gov."],
    ["grc", "SAP GRC"],
    ["etd", "Threat Detection"],
    ["uidp", "UI Data Protection"],
    ["data-privacy", "ILM, Data Privacy"],
    ["idm", "IdM (endet 2027)"],
  ],
}

export const LC: BoxCfg = {
  cls: "lc",
  t: "Projekt & Lebenszyklus",
  sub: [
    {
      t: "Einführung steuern",
      items: [
        ["activate", "SAP Activate"],
        ["calm-pm", "Cloud ALM Projekte"],
        ["joule-consultants", "Joule for Consultants"],
        ["jira-ado", "Jira / Azure DevOps"],
        ["agent-led-toolchain", "Agent-led Toolchain"],
        ["signavio", "SAP Signavio"],
        ["process-navigator", "Process Navigator"],
        ["leanix", "SAP LeanIX"],
      ],
    },
    {
      t: "Bauen & testen",
      items: [
        ["cloud-alm", "SAP Cloud ALM"],
        ["calm-test", "Cloud ALM Test Mgmt"],
        ["calm-test-automation", "Cloud ALM Testautom."],
        ["calm-test-api", "Test-Schnittstelle"],
        ["tricentis-ect", "Tricentis ECT"],
        ["tricentis-cia", "Tricentis LiveCompare"],
        ["tricentis-perf-data", "Tricentis Perf./Daten"],
        ["walkme", "WalkMe, Enable Now"],
      ],
    },
    {
      t: "Überführen",
      items: [
        ["readiness-check", "Readiness Check"],
        ["maintenance-planner", "Maintenance Planner"],
        ["migration-cockpit", "Migration Cockpit"],
        ["syniti-admm", "Syniti ADMM"],
        ["sum-dmo", "SUM / DMO"],
        ["custom-code-migration", "Custom Code Migration"],
        ["btc", "Transformation Center"],
        ["sdt", "Selektive Datenübern."],
        ["dmlt", "DMLT"],
        ["snp-kyano", "SNP Kyano"],
        ["tdms", "Testdaten (TDMS)"],
        ["data-services", "Data Services"],
        ["slt", "SLT"],
        ["transition-option", "ERP Transition Option"],
      ],
    },
    {
      t: "Wird abgelöst",
      items: [
        ["solman", "Solution Manager → Cloud ALM"],
        ["tdms", "TDMS (kein Nachfolger)"],
      ],
    },
  ],
}

// Die Pfeile der alten SVG-Grafik, hier als beschriftete Verbindungen zwischen den Schichten.
export type Richtung = "beide" | "hoch" | "runter"
export const VERB_APP_BUS: Array<{ text: string; dir: Richtung; col: number }> =
  [
    { text: "Standard-Integrationspakete", dir: "beide", col: 0 },
    { text: "APIs, Events", dir: "beide", col: 1 },
    { text: "Data Products aus S/4HANA", dir: "hoch", col: 2 },
    { text: "Adapter, EDI, AS4", dir: "beide", col: 3 },
  ]
export const VERB_BUS_S4: Array<{ text: string; dir: Richtung }> = [
  { text: "Fiori-Apps über OData", dir: "runter" },
  { text: "OData, SOAP, IDoc, RFC", dir: "beide" },
  { text: "Business Events", dir: "hoch" },
]
