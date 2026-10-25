# SAP Integration Landscape around S/4HANA (as of October 2026), incl. the PI/PO successor

Research note for the report writer. Research date: 2026-10-24. The web search budget for this session ran out before every item could be checked, so some items rest only on the training-data background of the researcher (cutoff mid-2026). Those are kept apart in the "Inferences" subsections and marked **[unverified background]**. Anything under "Cited Findings" has a source.

Many SAP Community and SAP Help Portal pages could not be fetched (robots_disallowed): the help.sap.com "What's New for SAP Integration Suite", the Q1/2026 product highlights blog, the SAP Data Intelligence transition blog and the Data Services statement of direction. Where it matters, the gap is noted.

---

## 1. SAP Integration Suite and its capabilities (incl. 2025/2026 additions)

### Takeaway
SAP Integration Suite (iPaaS on SAP BTP, multi-cloud/Cloud Foundry) is SAP's strategic integration platform and the official successor to SAP PI/PO. It bundles these capabilities: Cloud Integration (formerly HCI / SAP Cloud Platform Integration / CPI), API Management, Integration Advisor, Trading Partner Management, Open Connectors, Integration Assessment, Migration Assessment, Graph, Event Mesh, Edge Integration Cell (hybrid runtime) and data space integration. Since 2025/2026 it has added AI-generated integration flows from natural-language prompts, AI-based anomaly detection and MCP/agentic positioning. Gartner named it a Leader in the 2026 iPaaS Magic Quadrant (sixth year in a row).

### Cited Findings

**Platform and positioning**
- The SAP product page lists: prebuilt integrations, APIs and events; ready-to-use connectors for SAP and third parties (Salesforce, Workday, AWS, ServiceNow); "AI-generated integration flows that turn natural-language prompts into ready-to-edit integrations"; AI-based anomaly detection; cloud, on-premise and hybrid deployment; asynchronous and synchronous connectivity; and "support for agentic AI at scale". Its "Cloud Migration" section is aimed at customers moving from SAP Process Orchestration. The page does not mention Joule by name. — [SAP Integration Suite product page](https://www.sap.com/products/technology-platform/integration-suite.html)
- Gartner's 2026 Magic Quadrant for iPaaS (16 March 2026) named SAP Integration Suite a Leader for the sixth consecutive year. Joule-generated iFlows are described as generally available. A partner blog (SAVIC, 29 April 2026) reports that SAP internal benchmarks show 30–40% shorter timelines; those figures are not verified. — [SAVIC Tech insight, Apr 2026](https://www.savictech.com/insights/sap-integration-suite-2026-gartner-leader-mcp-agentic-ai/)
- The same partner source reports more than 2,000 prebuilt packages, and 15+ new third-party adapters in Q1 2026 (Adobe Sign, Google Workspace, Oracle ERP, Salesforce Service Cloud and Marketing Cloud, Oracle Eloqua, OFTP2). It also describes AI governance features (API anomaly detection, API traffic prediction). Treat this as a secondary source. — [SAVIC Tech](https://www.savictech.com/insights/sap-integration-suite-2026-gartner-leader-mcp-agentic-ai/)
- The SAP Learning course "SAP Integration Suite" includes units on "SAP Business AI Platform" and "Joule Studio", which shows the AI/agent tie-in in the official curriculum. — [SAP Learning – Analyzing the Updates of SAP Integration Suite](https://learning.sap.com/courses/sap-integration-suite/analyzing-the-updates-of-sap-integration-suite_dac3e104-c5fc-4e38-9224-292370643e2c)

**Capability descriptions** (SAP PRESS overview, first published Aug 2021, updated Sept 2025)
- **Cloud Integration**: central middleware as a cloud service for hybrid cloud and on-premise landscapes.
- **API Management**: governs, manages and meters APIs, with policies, product catalogs, a developer portal and rate plans for monetization.
- **Integration Advisor**: accelerates interface and mapping development, including EDI mappings, with content for S/4HANA and EDI standards.
- **Trading Partner Management**: B2B data exchange with trading partners.
- **Open Connectors**: third-party connectors behind one normalized REST API layer.
- **Integration Assessment**: implements ISA-M to document integrations and policies.
- **Migration Assessment**: connects to an SAP PO system and evaluates its interfaces.
- **Graph**: described there as a sub-capability of API Management.
- **Event Mesh**: event broker.
- **Data Space Integration**: was in beta at the time of writing.
- The same overview also says SAP Data Intelligence (a further development of SAP Data Hub) "has since been folded into SAP Datasphere and SAP AI Foundation".
- [SAP PRESS blog – What tools make up SAP Integration Suite](https://blog.sap-press.com/what-tools-make-up-sap-integration-suite)

**Graph**
- "Graph in SAP Integration Suite" is described as generally available as a core capability, not deprecated. It offers a unified API over a Business Data Graph that you can query with GraphQL and OData v4, plus Graph Navigator and an extensible data model. Regional availability is in SAP Note 3338820. (Community blog, apparently early 2026.) — [SAP Community – Graph on Integration Suite](https://community.sap.com/t5/integration-blog-posts/graph-on-integration-suite-simplifying-multi-api-data-retrieval-with/ba-p/14302711)
- An earlier history (SAP Graph as a standalone beta) is shown by the archived SAP sample repo. — [GitHub SAP-archive/cloud-extension-graph-sample](https://github.com/SAP-archive/cloud-extension-graph-sample/blob/main/documentation/Set%20Up%20SAP%20Graph/README.md)

**Editions and licensing** (sap.com pricing page, fetched Oct 2026)

| Edition | Price per month | Messages | Included / key capabilities |
|---|---|---|---|
| **Starter** | USD 1,735 per tenant | 50,000 per month | 10 custom iFlows per global account; adapters HTTP(S), SOAP, OData V2/V4, SFTP, ProcessDirect, Mail, XI (without JMS), IDoc, RFC; prebuilt packs; Business Accelerator Hub access |
| **Standard** | USD 5,361 per tenant | Not stated | Full API lifecycle, B2B libraries, 160+ third-party SaaS connectors, async message queues, business events |
| **Premium** | USD 29,459 per entitlements package | 10 million per month | 4 Integration Suite tenants plus 4 Edge Integration Cell tenants; includes Alert Notification and Cloud Transport Management |

  Add-ons: data space integration package USD 75/month; additional messages USD 7.03 per 10,000; additional Edge Integration Cell tenant USD 3,470/month. — [SAP Integration Suite pricing](https://www.sap.com/products/technology-platform/integration-suite/pricing.html)
- Messages over 250 KB are billed as one extra message per 250 KB or part of it. The suite is also available under BTPEA/CPEA (consumption) and PAYG, and has a free trial. — [Automation Atlas, Jul 2026 (secondary)](https://automationatlas.io/answers/sap-integration-suite-pricing-explained-2026/)

**Edge Integration Cell (EIC)** – hybrid runtime
- Announced GA around SAP TechEd 2023. Design, configuration and monitoring happen in the cloud tenant; execution happens in the customer's own Kubernetes cluster (the blog names Azure AKS, Amazon EKS and SUSE Rancher). Components:
  - Edge Lifecycle Management
  - a built-in Cloud Connector tunnel
  - Istio
  - external PostgreSQL and Redis, required for production

  The runtime keeps running through temporary connectivity loss, and one cloud tenant can manage several EICs. It needs an Integration Suite license (Standard, Premium, CPEA or PAYG). Each tenant includes one EIC entitlement. Only 50% of the messages processed on EIC are chargeable. — [SAP Community – Next-gen hybrid integration with EIC](https://blogs.sap.com/2023/11/16/next-gen-hybrid-integration-with-sap-integration-suite-edge-integration-cell-introduction-setup)
- The SAP Architecture Center adds GCP GKE and on-premise Kubernetes clusters. It describes EIC as the vehicle for a phased PI/PO modernization with local execution and data locality. Its RISE example deploys EIC in the same data center as RISE S/4HANA when SAP BTP is not available in that region. The page notes that SAP's emergency recovery does not restore Message Service persistent volumes, so JMS messages can be lost. Caveat: the page is flagged "archived / retired approach", last updated 9 Oct 2026. — [SAP Architecture Center ref-arch 0a229d](https://architecture.learning.sap.com/docs/ref-arch/0a229d)
- A partner source also lists OpenShift as a supported Kubernetes platform. — [SAVIC Tech](https://www.savictech.com/insights/sap-integration-suite-2026-gartner-leader-mcp-agentic-ai/)
- E3 Magazine (Jul 2025) recommends EIC for sensitive data that may not go to the cloud, sites with weak networks, and non-internet-capable legacy systems. — [E3 Magazine – Sundown for SAP PI/PO](https://e3mag.com/en/sundown-for-sap-pi-po-setting-the-course-for-integration/)

**Neo sunset** (affects old CPI tenants)
- SAP BTP Neo reaches end of life on **31 December 2028**. New innovations ship only on multi-cloud. — [SAP event page, Jul 2026](https://www.sap.com/germany/events/2026-07-22-online-neo-to-multi-cloud-migrate-smarter-scale-faster-with-integration-suite.html)
- CPI tenants on Neo must be moved to Cloud Foundry by the customer, and SAP offers no automatic migration. Certificates, authorizations and Cloud Connector configuration may need changes. — [VASS – Neo is dead](https://vasscompany.com/en/insights/blogs-articles/neo-is-dead/)
- SAP runs webinars on moving "SAP Cloud Platform Integration (CPI) … on Neo" to SAP Integration Suite. — [SAP event Oct 2025](https://www.sap.com/australia/events/2025-10-28-online-preparing-for-the-btp-neo-sunset.html)

### Inferences
- **Naming history** [unverified background]:
  - SAP HANA Cloud Integration (HCI) → SAP Cloud Platform Integration (CPI) → "Cloud Integration" capability of SAP Integration Suite (since around 2020/21). "SAP Cloud Platform Integration Suite" became "SAP Integration Suite".
  - SAP Cloud Platform Enterprise Messaging → SAP Event Mesh (2020/21).
  - SAP API Business Hub → SAP Business Accelerator Hub (renamed 2023).
  - "SAP Cloud Platform API Management" → API Management capability.
  - "Graph" was formerly "SAP Graph".
  - "Edge Integration Cell" was referred to as "integration cell" during planning.
- **Cloud Integration technically** [unverified background]: Apache Camel-based iFlows that run in a multi-tenant Java runtime on BTP Cloud Foundry (AWS, Azure, GCP and other hyperscalers). It reaches on-premise systems (including S/4HANA on-premise and Private Cloud) through SAP Cloud Connector, via HTTP/RFC/IDoc over the tunnel. Adapters include SOAP, IDoc, RFC, OData, HTTP, XI, AS2/AS4, SFTP, JMS, Kafka, AMQP, Mail and SuccessFactors/Ariba, plus Open Connectors for third-party SaaS.
- **AI features**: SAP's own page confirms AI-generated iFlows from natural language and AI-based anomaly detection. The "Joule" branding appears in partner sources and SAP Learning. Other 2025 announcements [unverified background] include:
  - generative-AI mapping proposals in Integration Advisor
  - AI-assisted API documentation and policy generation in API Management
  - Joule in the Integration Suite UI
- **Data space integration** [unverified background]: a connector based on Eclipse Dataspace Components (Catena-X / Gaia-X / IDSA), exposed as an add-on to Integration Suite. The sap.com price list confirms it is a separately priced add-on.
- Graph is GA as of early 2026 per the community source, but strategic momentum has shifted towards data products and BDC. Its future roadmap is not confirmed.

### Gaps
- The official help.sap.com "What's New" list for 2025–2026 (exact AI features, release months, deprecations) could not be fetched.
- Whether Open Connectors or Graph has a formal end-of-sale date: no evidence of deprecation was found, and no source confirms that their roadmap continues.
- Official naming of the AI features (e.g. "Joule for Integration Suite", "generative AI-based integration flow generation") and their exact GA dates, which a partner blog asserts. No SAP primary source was fetched.
- Detailed scope of the "SAP Integration Suite, advanced edition / Enhanced Edition" mentioned by a partner blog. Not on sap.com, so it may not be a real SAP SKU name. Do not use it without verification.

---

## 2. SAP Process Integration / Process Orchestration 7.5: maintenance, successor, migration tooling

### Takeaway
SAP PO 7.5 is built on SAP NetWeaver 7.5 Java. Mainstream maintenance ends **31 Dec 2027**. Optional extended maintenance runs to **31 Dec 2030** at an extra fee of two percentage points. The official successor is SAP Integration Suite, with Edge Integration Cell for workloads that must run on-premise. SAP provides the **Migration Assessment** capability (effort estimation) and the **Migration tool** in Cloud Integration (semi-automatic ICO → iFlow conversion). Status: **PI/PO is deprecated in the strategic sense.** No further development is planned, and it is in its final maintenance phase.

### Cited Findings
- SAP NetWeaver 7.5: mainstream maintenance until the end of 2027. Extended maintenance runs until the end of 2030 on an opt-in basis and costs two percentage points on top of the maintenance rate (same model as Business Suite 7). — [SAP News Center, Aug 2020](https://news.sap.com/2020/08/aligned-extended-maintenance-commitments/?amp=1); [SAP Community – NW 7.5 maintenance strategy](https://blogs.sap.com/t5/technology-blogs-by-sap/maintenance-strategy-for-sap-netweaver-7-5-fully-aligned-with-sap-business/ba-p/13456253)
- SAP PO 7.5: "mainstream maintenance ends on 31 December 2027", "optional extended-maintenance period through 31 December 2030", and no further extension currently planned. (LeverX, 25 Aug 2026, a secondary source.) — [LeverX UK blog](https://leverx.com/en-gb/blog/sap-pi-po-to-integration-suite-migration-uk)
- E3 Magazine summarizes PI/PO support as "until 2027 or, optionally, until 2030 at the latest" and calls SAP Integration Suite the successor. — [E3 Magazine, Jul 2025](https://e3mag.com/en/sundown-for-sap-pi-po-setting-the-course-for-integration/)
- SAP PRESS states that SAP has stopped further development on PO and that its maintenance ends in 2030. — [SAP PRESS](https://blog.sap-press.com/what-tools-make-up-sap-integration-suite)
- An SAP asset promotes "Future-proof your SAP PI/PO investments with SAP Integration Suite" with a hybrid approach. It names the Migration Assessment capability, a "migration accelerator" and the Edge Integration Cell runtime. — [SAP asset, Oct 2024](https://www.sap.com/assetdetail/2024/10/44b2231c-dc7e-0010-bca6-c68f7e60039b.html)
- **Migration tool** (Cloud Integration):
  - Introduced in the January 2023 release (6.35.x). It semi-automatically creates iFlows from PO design-time objects.
  - It supports only **Integration Configuration Objects (ICOs)**. Each ICO maps to a pattern template: point-to-point async, async/sync bridge, content-based routing, recipient list, attachments and CSV. If no template matches, a default point-to-point iFlow is created that copies the mappings but not the channels.
  - Supported source: PO 7.5 SP06 and higher (support for 7.3x/7.4x is noted as a roadmap item, and the page is inconsistent on this).
  - It requires the role collection PI_Integration_Developer and is available in all editions except Basic and SFSF.
  - An OData adapter was added in Nov 2023 (6.45.x).
  - Only ICOs assessed as "Ready to migrate" or "Adjustment required" can be migrated.
  - [SAP Community – Migration tool in Cloud Integration](https://blogs.sap.com/2023/01/27/migration-tool-in-cloud-integration-capability-of-sap-integration-suite/)
- **Migration Assessment**: connects to the PO system and evaluates its interfaces. Its three ratings are Evaluation required, Adjustment required and Ready to migrate. — [SAP Community – Migration tool](https://blogs.sap.com/2023/01/27/migration-tool-in-cloud-integration-capability-of-sap-integration-suite/); [SAP PRESS](https://blog.sap-press.com/what-tools-make-up-sap-integration-suite)
- An iterative, wave-based migration after a full interface analysis is recommended. — [E3 Magazine](https://e3mag.com/en/sundown-for-sap-pi-po-setting-the-course-for-integration/)

### Inferences
- [unverified background] The PO 7.5 maintenance dates come from NetWeaver 7.5 (PO 7.5 runs on AS Java 7.5). That is why the SAP News source does not name PO explicitly.
- [unverified background] Other points not checked in this session:
  - Migration Assessment reads the PO system's ESR/ID metadata over a BTP destination, via Cloud Connector, and produces a scenario evaluation and effort estimate (T-shirt sizes / days).
  - The SAP note on PI/PO support for 7.5 is often cited as SAP Note 1648480; its content was not checked.
  - Typical alternatives for PO-specific features:
    - ccBPM/BPM → SAP Build Process Automation
    - B2B Add-on → Trading Partner Management with Integration Advisor
    - Java Proxies / AAE adapters → Cloud Integration adapters
  - Licensing conversion programs (e.g. "PO to Integration Suite" credit offers or RISE BTP credits) exist in the market, but this session found no official source for them.
- Recommendation logic: use cloud-native Cloud Integration as the default. Use EIC where latency, data residency or no-internet constraints apply. Use the third-party iPaaS only where a company standard already exists.

### Gaps
- No primary SAP note or maintenance-strategy page that explicitly names "SAP Process Orchestration 7.5" with these dates was fetched. The dates are confirmed via NetWeaver 7.5 (SAP News) and secondary sources.
- The current (2026) scope of the migration tool (newer pattern templates, BPM support) was not confirmed.

---

## 3. Eventing: SAP Event Mesh, Event Mesh in Integration Suite, advanced event mesh, SAP Cloud Application Event Hub, S/4HANA business events, Event Add-on, CloudEvents

### Takeaway
SAP has four eventing offerings:

| Offering | What it is | Notes |
|---|---|---|
| **SAP Event Mesh** | Standalone BTP service, formerly SAP Cloud Platform Enterprise Messaging | Cloud-only; CPEA-only since 2024 |
| **Event Mesh capability in SAP Integration Suite** ("EMIS") | Event broker inside Integration Suite | — |
| **SAP Integration Suite, advanced event mesh** (AEM) | Solace PubSub+ based, managed brokers on AWS/Azure/GCP, mesh of brokers | Enterprise-scale; e.g. 30 MB messages, JMS/SMF/WebSocket |
| **SAP Cloud Application Event Hub** | SAP-to-SAP cloud event distribution, configured via System Landscape formations | — |

S/4HANA emits business events in CloudEvents format. These are notification-only by default, and full-state events need the Event Add-on (ASAPIO-based for ECC/S/4 on-premise in the AEM price list).

### Cited Findings
- SAP officially lists three Event Mesh offerings: the Event Mesh capability within SAP Integration Suite, SAP Event Mesh as a standalone service, and SAP Integration Suite, advanced event mesh. All three interact with S/4HANA business events. — [SAP Learning – Integration Suite course](https://learning.sap.com/courses/sap-integration-suite/analyzing-the-updates-of-sap-integration-suite_dac3e104-c5fc-4e38-9224-292370643e2c)
- Standalone SAP Event Mesh is a managed BTP service. It supports publish/subscribe and point-to-point (queues), integrates with S/4HANA, BTP and Integration Suite, and runs on AWS, Azure and GCP. — [SAP Learning – Discussing SAP Event Mesh Standalone](https://learning.sap.com/courses/sap-integration-suite/discussing-sap-event-mesh-standalone)
- **Advanced event mesh** (sap.com):
  - A managed EDA service for hybrid, multi-cloud and edge. An event mesh is formed by several cooperating event brokers, and the service offers dynamic filtering, tracing, and event stream lifecycle management.
  - Data centers: AWS (Sydney, São Paulo, Frankfurt, Tokyo, US East), Azure (Sydney, Netherlands, US West), GCP (Frankfurt, Mumbai, US Central).
  - Plans range from tier 100 to 100K. Add-ons: spooling at USD 1,000/month per 500 GB, and the **ERP event add-on (ASAPIO connector)** at USD 2,378/month per connection. The add-on generates events from transactions in SAP ECC or S/4HANA.
  - [SAP – advanced event mesh](https://www.sap.com/products/technology-platform/integration-suite/advanced-event-mesh.html)
- Comparison of SAP Event Mesh and AEM (from a 2026 aggregator, verified 1 Mar 2026; secondary, it cites community sources):

| | SAP Event Mesh (Default Plan) | Advanced event mesh (AEM) |
|---|---|---|
| History | Formerly Enterprise Messaging (2018); GA 2020 | Solace PubSub+; GA 2022 |
| Max message size | 1 MB | 10–30 MB, by tier and firmware |
| Storage | 10 GB | 25 GB – 1 TB spool |
| Connections | 50 | 100 – 100,000 by tier (enterprise connections capped at 30,000) |
| Consumers per queue | 3 | Not stated |
| Protocols | AMQP 1.0, MQTT 3.1.1, HTTP REST, plus webhooks | AMQP 1.0, MQTT 3.1.1, HTTP REST, plus JMS, Solace SMF, WebSocket |
| Deployment / licensing | Cloud-only; CPEA-only since 2024 | Cloud, on-premise, hybrid |

  Cloud Application Event Hub reached GA in 2024 and is included with BTP licenses (up to 75 million transactions). S/4HANA business events are notification-only by default, full-state events need the Event Add-On, and S/4HANA Cloud has 600+ business events. — [knowledgelib.io – SAP Event Mesh & AEM capabilities 2026](https://knowledgelib.io/business/erp-integration/sap-event-mesh-capabilities/2026)
- **SAP Cloud Application Event Hub**:
  - A BTP service that distributes business events between SAP cloud apps. It is configured in the BTP System Landscape through an "Eventing Between SAP Cloud Systems" formation and subscriptions, so topics and queues are abstracted away.
  - Supported producers/consumers include S/4HANA Cloud (Public and Private editions), SuccessFactors, Subscription Billing, Cloud Integration, AEM, CAP apps, SAP Build Process Automation and Commerce Cloud.
  - Requires CloudEvents (attributes id, source, specversion, type, datacontenttype; extension e.g. sappassport).
  - Listed as "Requires Customer/Partner License", which conflicts with the aggregator's "included".
  - [SAP Developers tutorial – Event Hub basic concepts](https://developers.sap.com/tutorials/eh-basic-concepts.html)
- S/4HANA integrates with SAP Event Mesh and SAP Cloud Application Event Hub. Events follow CloudEvents, and event definitions are on SAP Business Accelerator Hub (Event Reference / schema). Example type: `sap.s4.beh.businesspartner.v1.BusinessPartner.Changed.v1`. The S/4HANA system needs a channel configuration to a specific Event Mesh or Event Hub instance. — [CAP docs – Receiving events from SAP S/4HANA](https://cap.js.org/guides/events/s4)
- The "SAP NetWeaver Add-on for Event Enablement" was also released for S/4HANA in 2021. — [SAP Community, Jun 2021](https://blogs.sap.com/2021/06/01/sap-netweaver-addon-for-event-enablement-now-also-released-for-s-4hana/)
- RAP business events let custom events be exposed in ABAP Cloud (tutorial). — [SAP Developers – RAP business events](https://developers.sap.com/tutorials/abap-environment-expose-rap-business-events)

### Inferences
- [unverified background] On the S/4HANA side (on-premise and Private Cloud), the "Enterprise Event Enablement" framework is configured via `/IWXBE/CONFIG` (channel to Event Mesh or AEM) and the topic binding via `/IWXBE/OUTBOUND_CFG`. In S/4HANA Cloud Public Edition this is done through communication arrangement SAP_COM_0092 (Enterprise Eventing Integration). Not verified in this session.
- Positioning:

| Offering | Use when |
|---|---|
| Cloud Application Event Hub | SAP-to-SAP cloud eventing |
| EMIS / Event Mesh | Moderate volumes, BTP-centric |
| AEM | High volume, multi-region, on-premise brokers, non-SAP streaming (Kafka bridges), "event mesh" across hyperscalers |

- The standalone SAP Event Mesh service looks to be in retreat (trial retired 2023, CPEA-only). The aggregator gives no formal deprecation timeline.

### Gaps
- No official SAP statement was found on a sunset of standalone SAP Event Mesh in favor of EMIS or AEM.
- Exact licensing of Cloud Application Event Hub (included vs. license required) conflicts between the sources.
- AEM self-managed / software broker deployment terms were not on the sap.com page.

---

## 4. Integration methodology and governance: ISA-M, integration styles, SAP Business Accelerator Hub, Cloud Integration Automation service

### Takeaway
SAP Integration Solution Advisory Methodology (ISA-M) is technology-agnostic. It has four phases and five integration styles (process, data, analytics, user, thing integration), refined by use case patterns plus cross patterns (API-managed, event-based). It is implemented as the **Integration Assessment** capability of Integration Suite. Prepackaged content is published on the SAP Business Accelerator Hub (formerly SAP API Business Hub).

### Cited Findings
- ISA-M is "technology-agnostic", with a community of about 2,500 participants. Its four phases:
  1. Assess integration strategy
  2. Design hybrid integration platform
  3. Define integration best practices
  4. Enable a practice of empowerment
- Integration domains are the entry point (As-Is / To-Be). The five core integration styles are process, data, analytics, user and thing integration (the page also once says "four"). Cross-use-case patterns include API-Managed Integration and Event-Based Integration.
- Use case patterns are mapped to technology categories (SAP or third-party), not one-to-one. The methodology includes sample mappings to the BTP portfolio, plus personas (Enterprise/Integration Architect, Developer, Administrator, Citizen Integrator, API Developer), an Integration Center of Excellence, and governance policies.
- [SAP Learning – Understanding ISA-M](https://learning.sap.com/courses/sap-process-orchestration-to-sap-integration-suite-migration/understanding-the-sap-integration-solution-advisory-methodology-isa-m-)
- SAP Learning has a unit "Integration Assessment Overview" (ISA-M in Integration Suite). — [SAP Learning – Integration Assessment Overview](https://learning.sap.com/courses/bt-int-suite/isam-intro)
- Integration Assessment lets users view, update and examine a company's integrations, implementations and policies. — [SAP PRESS](https://blog.sap-press.com/what-tools-make-up-sap-integration-suite)
- ISA-M has existed since 2019, with template updates in 2020. — [SAP Community 2019](https://blogs.sap.com/2019/02/24/integration-solution-advisory-methodology-isa-m-define-integration-guidelines-for-your-organization); [SAP Community 2020 template](https://blogs.sap.com/2020/05/14/new-version-of-the-sap-integration-solution-advisory-methodology-template-released/); [SAPinsider – ISA-M (Allgaier)](https://sapinsider.org/articles/saps-integration-solution-advisory-methodology-isa-m-for-the-intelligent-enterprise/)
- The Starter edition includes prebuilt integration packs and SAP Business Accelerator Hub access. — [SAP pricing](https://www.sap.com/products/technology-platform/integration-suite/pricing.html)
- The Business Accelerator Hub hosts S/4HANA event definitions and schemas. — [CAP docs](https://cap.js.org/guides/events/s4)

### Inferences
- [unverified background] SAP Business Accelerator Hub (api.sap.com) was renamed from SAP API Business Hub in 2023. It lists APIs (OData/SOAP/REST), events, CDS views, integration packages for Cloud Integration, and sandbox endpoints.
- [unverified background] Cloud Integration Automation service (CIAS) is a BTP service that generates guided, role-based workflows to set up standard SAP-to-SAP integration scenarios (e.g. S/4HANA ↔ SuccessFactors, Ariba). It creates communication arrangements and destinations and assigns tasks to administrators. It is often used with the SAP Discovery Center mission catalog. Not verified in this session.
- The ISA-M style determines the tool. For S/4HANA:

| ISA-M style | Typical tools |
|---|---|
| Process integration | Cloud Integration, APIs, events |
| Data integration | MDI, DRF, SLT, Datasphere replication flows |
| Analytics | CDS extraction → Datasphere/BDC |
| User | SAP Build Work Zone |
| Thing | IoT/EIC |

### Gaps
- No official 2026 SAP page on Cloud Integration Automation service status was fetched.
- No primary source was fetched for the Business Accelerator Hub rename date.

---

## 5. S/4HANA-side interface technologies

### Takeaway
S/4HANA exposes OData V2/V4 (RAP/CDS-based), SOAP, IDoc, BAPI/RFC, business events, and CDS-based extraction (ODP/CDC for Datasphere replication flows). In S/4HANA Cloud Public Edition only **released APIs** may be used, activated through **Communication Scenarios → Communication Arrangements** (with communication systems and users). This session found little primary-source material for this area, so most points are background.

### Cited Findings
- The Integration Suite Starter edition already includes adapters for SOAP, OData V2/V4, IDoc, RFC and XI, which are the typical S/4HANA protocols. — [SAP pricing](https://www.sap.com/products/technology-platform/integration-suite/pricing.html)
- S/4HANA business events use CloudEvents, and their catalog is on the Business Accelerator Hub. — [CAP docs](https://cap.js.org/guides/events/s4)
- Datasphere replication from S/4HANA via CDS views with change data capture (including custom CDS). — [SAP Community – Datasphere replication with CDC on custom S/4 CDS](https://blogs.sap.com/t5/technology-blogs-by-sap/sap-datasphere-replication-with-change-data-capture-on-a-custom-sap-s4-cds/ba-p/13599587); [Google Cloud docs – Datasphere CDS replication to BigQuery](https://docs.cloud.google.com/sap/docs/sap-datasphere-cds-replication-bigquery); [SAP Community – Replication Flow blog series part 1](https://blogs.sap.com/t5/technology-blogs-by-sap/replication-flow-blog-series-part-1-overview/ba-p/13581472)

### Inferences
[unverified background] All of the following, to be checked against SAP Help "Integration and APIs for SAP S/4HANA" and the S/4HANA Cloud API policy:
- **OData V2** comes from SEGW / CDS-based (BOPF/SADL) services. **OData V4** comes from RAP service bindings and is preferred for new APIs. Both are activated through `/IWFND/MAINT_SERVICE` (V2) and `/IWFND/V4_ADMIN` (V4) on-premise, and through Communication Arrangements in the cloud.
- **SOAP** is used for enterprise services and is still common for A2A/B2B (e.g. Business Partner replication SOAP services used by MDG/DRF and MDI).
- **IDoc** is the classic ALE interface, configured via WE20/BD64 on-premise and still supported. In the Public Cloud only selected IDocs are released, with SOAP/OData preferred.
- **BAPI/RFC**: synchronous function modules. They are used via the RFC adapter or the Cloud Connector, and are not released for external use in Public Cloud.
- **Released APIs**: under the ABAP Cloud / clean core concept, SAP tags APIs as "released" (C1 contracts). Only these may be used in Public Cloud, and they are recommended for Private Cloud and on-premise. SAP Business Accelerator Hub lists them.
- **CDS-based extraction**: CDS views with `@Analytics.dataExtraction.enabled` and delta via `@Analytics.dataExtraction.delta.changeDataCapture`, consumed via ODP by BW/4HANA, Datasphere replication flows, BDC and third-party tools. In the Public Cloud this uses communication scenario SAP_COM_0532 (data extraction) for Datasphere.
- **Communication Management (Public Cloud)**: Communication Systems, Communication Users, Communication Arrangements (instances of SAP-defined Communication Scenarios, SAP_COM_xxxx) and custom communication scenarios for custom APIs.
- **Private Cloud / on-premise** connect to BTP through Cloud Connector, or through the SAP-managed connectivity in RISE.

### Gaps
- This session obtained no primary SAP Help citations for the communication arrangements / released-API policy, the SAP_COM numbers, or the OData V4 recommendation. The report writer should flag these as "commonly documented" or check them separately.

---

## 6. Data replication / master data integration: MDI and One Domain Model, SLT, SAP Data Services, SAP Data Intelligence (status), DRF, MDG

### Takeaway
SAP Master Data Integration (MDI) is the BTP master-data hub for the SAP cloud suite. It is based on the SAP One Domain Model and covers integration only, not governance. Governance comes from SAP Master Data Governance (MDG, including cloud edition). Business Data Orchestration configures distribution models. In S/4HANA, the Data Replication Framework (DRF) distributes master data via SOAP/IDoc. SLT does trigger-based real-time replication. SAP Data Services is a classic ETL tool in maintenance mode. **SAP Data Intelligence is a discontinued product, being phased out.** SAP's direction is SAP Datasphere and SAP Business Data Cloud (BDC), but exact end-of-maintenance dates could not be verified.

### Cited Findings
- **MDI**:
  - A central master-data hub, typically one tenant per landscape. Initial load plus delta, control over which data goes to which app, monitoring, DPP compliance.
  - Consolidation, data quality and central governance are explicitly **not in scope**. Only One Domain Model objects are supported.
  - APIs: a REST API, a REST Events API (initial and delta loads), and SOAP APIs for business partner and BP relationships. Cloud Integration connects non-SAP and on-premise systems.
  - ABAP systems such as S/4HANA can act as distribution providers via an ABAP library.
  - Example objects for Ariba: BP (supplier), company code, cost center, exchange rate, plant, product, product group, project controlling object, purchasing org. Fieldglass additionally gets workforce person, job classification and more.
  - **Business Data Orchestration** defines distribution models (One Domain Model object and version, provider → consumer, object-selection and data-scope filters, push or pull mode).
  - MDG, cloud edition handles consolidation, quality and governance and integrates with MDI.
  - [SAP Learning – Implementing SAP MDI and Orchestrating Distribution](https://learning.sap.com/courses/sap-btp-fundamentals-level-3-advanced-services-integration-enterprise-architecture/implementing-sap-master-data-integration-and-orchestrating-distribution)
- MDI for SuccessFactors (2020) and SAP Cloud Platform MDI (2020) are the history of the MDI naming. — [SAP Community 2020 – MDI for SuccessFactors](https://blogs.sap.com/2020/05/26/the-new-master-data-integration-service-for-sap-successfactors/); [SAP Community 2020 – SAP Cloud Platform MDI](https://blogs.sap.com/2020/07/21/sap-cloud-platform-master-data-integration-sharing-and-synchronizing-master-data-in-the-integrated-intelligent-suite)
- MDG pricing: MDG, cloud edition is sold under the "data-cloud" product family on sap.com. — [SAP MDG pricing](https://www.sap.com/products/data-cloud/master-data-governance/pricing.html)
- **SLT**: mainstream maintenance of SAP LT Replication Server 2.0 (DMIS 2011) was extended to the end of 2025. Later details are in the SLT Product Availability Matrix. — [SAP Community, Jun 2017](https://blogs.sap.com/2017/06/21/end-of-mainstream-maintenence-of-sap-lt-replication-server-extended-to-31th-december-2025/)
- **SAP Data Intelligence**:
  - A further development of SAP Data Hub, "has since been folded into SAP Datasphere and SAP AI Foundation". — [SAP PRESS](https://blog.sap-press.com/what-tools-make-up-sap-integration-suite)
  - An SAP Community blog titled "Safeguarding the Transition from SAP Data Intelligence to SAP Business Data Cloud and SAP Datasphere" exists (ID 14485235, 2025/26), which shows that SAP has an official transition path. Its content could not be fetched. — [SAP Community](https://community.sap.com/t5/technology-blog-posts-by-sap/safeguarding-the-transition-from-sap-data-intelligence-to-sap-business-data/ba-p/14485235)
  - An earlier SAP blog, "SAP Datasphere and SAP Data Intelligence Cloud – what does this mean for me now?" (2024), positions Datasphere as the successor. Its content could not be fetched. — [SAP Community](https://community.sap.com/t5/technology-blog-posts-by-sap/sap-datasphere-and-sap-data-intelligence-cloud-what-does-this-mean-for-me/ba-p/13603947)
- **SAP Business Data Cloud**: combines Datasphere, SAP Analytics Cloud and BW. It provides SAP-managed data products and Insight Apps, embeds SAP Databricks, and favors zero-copy sharing. Existing Datasphere tenants can be rewired into BDC. BW 7.5 on HANA is maintained until 2030. (Wavestone insight, Jul 2025, modified Feb 2026.) — [Wavestone – How SAP BDC transforms your data intelligence strategy](https://www.wavestone.com/en/insight/how-sap-business-data-cloud-transforms-data-intelligence/)
- **SAP Data Services**: SAP published statements of direction in 2022, Nov 2023 and Jul 2024. Their content could not be fetched. — [SoD 2022](https://blogs.sap.com/2022/09/09/statement-of-direction-sap-data-services-and-sap-information-steward/); [SoD Nov 2023](https://blogs.sap.com/t5/technology-blogs-by-sap/statement-of-direction-sap-data-services-and-sap-information-steward-as-of/ba-p/13577148); [SoD Jul 2024](https://community.sap.com/t5/technology-blog-posts-by-sap/statement-of-direction-sap-data-services-as-of-july-2024/ba-p/13762644)

### Inferences
- **SLT** [unverified background]: trigger-based real-time replication via the DMIS add-on. It can run standalone or embedded in S/4HANA. Targets include HANA, BW, Datasphere, Kafka and hyperscalers via Replication Flow / SLT connectors. SLT maintenance on newer DMIS releases follows SAP's S/4HANA lifecycle beyond 2025, but this was not verified.
- **Data Services** [unverified background]: the 2024 SoD reportedly commits to maintenance of Data Services 4.3 until at least 2030 (aligned with BW/BusinessObjects), with no new major release, and positions Datasphere for cloud scenarios. Not verified.
- **Data Intelligence** [unverified background]: SAP stopped new sales of Data Intelligence Cloud around 2023/24. Customers are directed to Datasphere replication flows and transformation flows, and BDC. The exact end-of-maintenance date is unconfirmed; some community statements mention customer contracts running out by 2028. **Mark as deprecated/phase-out.**
- **DRF** [unverified background]: the S/4HANA-internal Data Replication Framework (DRFOUT, DRFIMG). It is used with MDG hub or co-deployed to distribute BP, material, finance objects and more via SOAP/IDoc to S/4HANA, ECC, MDI and third-party systems. In MDI scenarios, S/4HANA connects through DRF with the SOAP-based One Domain Model APIs.
- **MDG integration**: MDG on S/4HANA (hub or co-deployed) uses DRF. MDG, cloud edition integrates with MDI as described above. A federated MDG scenario combines both.

### Gaps
- Exact end-of-maintenance dates for SAP Data Intelligence Cloud and on-premise (3.x). The key pages were robots-blocked and none of the sources I could fetch states a date. The writer should say "phase-out, successor Datasphere/BDC, dates to be verified".
- The current SLT/DMIS maintenance horizon (post-2025) and the 2024 Data Services statement-of-direction dates.
- Current MDI object list for S/4HANA ↔ SuccessFactors (workforce person, cost center) was not in the fetched source.

---

## 7. Standard pre-built integrations between S/4HANA and SAP cloud apps; SAP Business Network

### Takeaway
SAP delivers prepackaged integration content on the Business Accelerator Hub, deployed via Cloud Integration (and sometimes through direct connectivity, MDI or Cloud Application Event Hub):
- S/4HANA ↔ SuccessFactors: employee/org data, cost centers via MDI
- S/4HANA ↔ Ariba / SAP Business Network: procurement, supplier and invoice documents, partly via the Ariba Cloud Integration Gateway
- S/4HANA ↔ Concur: expense posting
- S/4HANA ↔ SAP CX (Sales/Service Cloud, Commerce)

This session found little primary-source material for this section.

### Cited Findings
- MDI distributes master data to Ariba, Ariba Invoicing and Fieldglass (objects listed in section 6). — [SAP Learning – MDI](https://learning.sap.com/courses/sap-btp-fundamentals-level-3-advanced-services-integration-enterprise-architecture/implementing-sap-master-data-integration-and-orchestrating-distribution)
- Cloud Application Event Hub connects S/4HANA Cloud with SuccessFactors, Subscription Billing, Commerce Cloud and Build Process Automation through events. — [SAP Developers – Event Hub](https://developers.sap.com/tutorials/eh-basic-concepts.html)
- The Integration Suite Starter includes "prebuilt integration packs" and B2G integration. Standard adds 160+ third-party SaaS connectors and B2B libraries. — [SAP pricing](https://www.sap.com/products/technology-platform/integration-suite/pricing.html)
- SAP Business Network for Logistics announced a new integration platform (SAP Community, 2024). Content not fetched. — [SAP Community – new integration platform in SAP Business Network for Logistics](https://blogs.sap.com/t5/supply-chain-management-blogs-by-sap/announcement-new-integration-platform-in-sap-business-network-for-logistics/ba-p/13672379)

### Inferences
[unverified background] All of the following:
- **SuccessFactors Employee Central ↔ S/4HANA**: standard packages for employee master data and org assignment replication (SOAP via Cloud Integration), cost center replication (via MDI or Cloud Integration), and the "Integration of SAP SuccessFactors with S/4HANA" content.
- **Ariba ↔ S/4HANA**: SAP Ariba Cloud Integration Gateway (CIG), which runs on SAP Integration Suite technology, plus the S/4HANA Ariba Network Integration add-on / built-in integration (cXML). SAP Business Network integration with S/4HANA uses either direct connectivity or Integration Suite-managed CIG.
- **Concur ↔ S/4HANA**: SAP Concur Connector / financial posting integration via Cloud Integration packages and the Concur Integration Add-On / built-in integration (cost objects, employee master, expense posting).
- **SAP CX** (Sales Cloud V2, Service Cloud V2, Commerce Cloud) ↔ S/4HANA: prepackaged iFlows for BP, product, pricing and orders; Commerce Cloud integration via Integration Suite.
- Many of these integrations are configured through Cloud Integration Automation service guided workflows.

### Gaps
- No official 2026 SAP sources were fetched for the current SuccessFactors, Ariba, Concur or CX ↔ S/4HANA integration content packages, or for the current architecture of the SAP Business Network integration (CIG status).

---

## 8. Third-party alternatives (brief)

### Takeaway
Third-party iPaaS options (MuleSoft, Boomi, Azure Integration Services, Informatica and others) compete with SAP Integration Suite in the Gartner iPaaS MQ, where SAP is a Leader in 2026. Typically they make sense where they are already the company standard. SAP-specific prebuilt content, event enablement and the PI/PO migration tooling favor Integration Suite.

### Cited Findings
- SAP Integration Suite was named a Leader in Gartner's 2026 iPaaS MQ for the sixth year in a row. — [SAVIC Tech](https://www.savictech.com/insights/sap-integration-suite-2026-gartner-leader-mcp-agentic-ai/)

### Inferences
[unverified background]
- **MuleSoft Anypoint** (Salesforce): API-led connectivity. It offers an SAP connector (JCo/IDoc/RFC) and an S/4HANA OData connector, and can run in CloudHub or on-premise.
- **Boomi**: low-code iPaaS with an SAP connector.
- **Azure Integration Services** (Logic Apps, API Management, Service Bus, Event Grid): an SAP connector via an on-premise data gateway with NCo, and an OData/SAP built-in connector.

Typical trade-offs:

| Factor | Favors third-party iPaaS | Favors SAP Integration Suite |
|---|---|---|
| Strategy | Non-SAP-centric enterprise integration strategy | — |
| Existing estate | Existing Azure/Salesforce estate | — |
| Content and tooling | — | SAP prebuilt content |
| Commercials and support | — | RISE/BTP credits and SAP support for SAP-to-SAP scenarios |

### Gaps
- No 2026 primary sources were fetched for the third-party products.
