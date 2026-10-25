# SAP LoB cloud applications and industry solutions around S/4HANA (state: October 2026)

Research note, 24 Oct 2026. Method note for the report writer: the session's shared web-search budget ran out partway through. Several primary SAP pages (SAP Community, help.sap.com, the SAP Connect 2026 news guide, SAP News Germany utilities article of Feb 2026, and the learning.sap.com Business Suite packages course) could not be fetched (robots or server errors). Items marked **[background, not verified this session]** come from the researcher's prior knowledge (to June 2026). They are plausible but have no citation and must be checked before they are stated as fact. Everything else has an inline source.

Naming conventions (cross-cutting):
- SAP S/4HANA Cloud has been renamed **SAP Cloud ERP** (Public Edition) and **SAP Cloud ERP Private** — [SAP PRESS blog](https://blog.sap-press.com/whats-the-new-sap-business-suite); [Cognitus](https://cognitus.com/resources/blog/a-beginners-guide-to-sap-business-suite)
- Ariba Network is now **SAP Business Network** ("formerly Ariba Network") — [sap.com Spend Management](https://www.sap.com/products/spend-management.html)
- At Sapphire 2026 the SaaS application portfolio was renamed and repositioned as the **SAP Autonomous Suite**, with five domains: Autonomous Finance, Autonomous Spend (Spend Management), Autonomous Supply Chain Management, Autonomous HCM, and Autonomous CX — [SAP News, Sapphire 2026 keynote](https://news.sap.com/2026/05/sap-sapphire-keynote-business-ai-platform-power-autonomous-enterprise/)

---

## 1. SAP Business Suite packaging (2025) and SAP Autonomous Suite (2026): how LoB apps are bundled

### Takeaway
SAP Business Suite launched in February 2025 as Cloud ERP plus LoB apps plus SAP Business Data Cloud plus Business AI on BTP. At Sapphire (May 2025) SAP announced five LoB packages: Finance, Supply Chain Management, HCM, Strategic Procurement, and Customer Experience. Finance and SCM come in Base and Premium tiers, and some LoB SaaS entitlements are bundled into them (for example Concur Expense in Finance Premium, and Taulia in the Cloud ERP Private package). At Sapphire 2026 (May 11–13, Orlando) SAP renamed the SaaS portfolio the "SAP Autonomous Suite" across five domains, with 200+ agents and 50+ Joule Assistants. The articles found do not say that the package SKUs changed with this rename.

### Cited Findings
- SAP Business Suite rests on three pillars: applications (SAP and non-SAP), unified data (SAP Business Data Cloud), and a Business AI layer (Joule, agents). BTP is the connecting layer (integration, SAP Build, AI). — [SAP PRESS blog](https://blog.sap-press.com/whats-the-new-sap-business-suite)
- SAP Business Suite launched in February 2025, with core modules becoming GA in phased waves in 2025–2026. — [Cognitus](https://cognitus.com/resources/blog/a-beginners-guide-to-sap-business-suite); launch in Feb 2025 also stated in [SAP News, May 2025 SCM](https://news.sap.com/2025/05/ai-powered-innovations-network-centric-supply-chain-management/)
- Sapphire 2025 (20 May 2025) announced five LoB packages, all cloud and "available now":
  - **Finance**: lead-to-cash, procure-to-pay, record-to-report, and working capital management, including SAP Taulia
  - **Supply Chain Management**
  - **Human Capital Management**: core HR, payroll, time tracking
  - **Strategic Procurement**: SAP Ariba sourcing, contract management, and supplier lifecycle and performance
  - **Customer Experience**: sales, service, commerce, marketing automation, customer data management, and SFA
  - Each package includes Cloud ERP, business apps, BDC, and Business AI on BTP, plus SAP Build and SAP Enterprise Service Management.
  - Packages target new customers, but existing customers can map their current entitlements, and standalone components can still be bought.
  - — [CIO.com](https://www.cio.com/article/3990475/sap-revamps-its-cloud-erp-application-packages.html)
- **SAP Finance Base** is the foundation package. **SAP Finance Premium** is a superset that adds lead-to-cash with CRM and subscription billing, enhanced procurement, working capital management, project and resource management, and expense management. — [SAP Learning, Concur with Business Suite](https://learning.sap.com/courses/discovering-travel-expense-solutions/maximizing-the-value-of-sap-concur-solutions-with-sap-business-suite)
- Finance Premium includes a **Concur Expense Professional** entitlement:
  - 100 submitted expense reports per month per customer, plus the mobile app and native integration (ICS) with S/4HANA Cloud Public Edition
  - Excludes ExpenseIt OCR and Concur Travel
  - Limited to net-new Concur Expense customers and one country or entity
  - Requires a separate Concur contract and implementation services (SAP Concur Services quoted at USD 10,000)
  - — [SAP Learning](https://learning.sap.com/courses/discovering-travel-expense-solutions/maximizing-the-value-of-sap-concur-solutions-with-sap-business-suite)
- SAP finance deck: Finance Base is the entry tier. Finance Premium adds "smart consolidation, treasury and assurance management".
  - "Finance Add-on Modular Cloud" solutions need their own license and project. **SAP Cash Application** is listed there.
  - On S/4HANA Private Cloud, core Enterprise Finance Management solutions come without extra licenses beyond the ERP FUE subscription.
  - Joule is metered via Joule Base and AI units.
  - — [SAP Connect Days NA finance deck (PDF)](https://assets.dm.ux.sap.com/noam-sap-connect-days-na-chicago/1_Finance_Transforming%20Finance-Led%20ERP%20and%20Beyond_Laser%20Focused%20Innovations%20Unveiled.pdf)
- SAP Taulia comes with the "SAP Cloud ERP Private package" at no extra cost. — [SAP asset, Dec 2025](https://www.sap.com/assetdetail/2025/12/cc99ab57-307f-0010-bca6-c68f7e60039b.html)
- Partner summary (secondary source, treat with caution):
  - Finance Base: core accounting, GL, cash management
  - Finance Premium: project billing, Concur integration, Ariba, Sales Cloud, Joule, Build
  - SCM Base: manufacturing, ATP, inventory, engineering
  - SCM Premium: EHS and more
  - Licensing moves from FUE to LoB-based packages; new SKUs from May–August 2025
  - — [SAPVista](https://www.sapvista.com/guide-to-sap-cloud-erp)
- RISE with SAP is the path to Business Suite for existing ERP customers. GROW with SAP is for net-new customers (PUPM pricing). — [SAP PRESS blog](https://blog.sap-press.com/whats-the-new-sap-business-suite)
- Sapphire 2026 announcements:
  - **SAP Business AI Platform**: BTP, BDC, and AI Foundation, with a context layer (knowledge graphs, SAP Domain Models, BDC), a build layer (Joule Studio), and a governance layer (SAP AI Agent Hub, built on SAP LeanIX, GA Q3 2026)
  - **SAP Autonomous Suite**: five domains, 200+ agents, 50+ Joule Assistants
  - **Joule Work**: Joule spaces, Joule Studio 2.0, MCP and A2A support
  - RISE contracts commit to activating three Joule Assistants in year one. GROW offers 20+ assistants from day one.
  - — [SAP News, Sapphire 2026 keynote](https://news.sap.com/2026/05/sap-sapphire-keynote-business-ai-platform-power-autonomous-enterprise/)
- An October 2026 SAP News piece calls "Autonomous Spend Management" "a domain within the SAP Autonomous Suite". It does not describe new packaging SKUs. — [SAP News, Oct 2026 spend](https://news.sap.com/2026/10/next-chapter-spend-management-ai-innovations-sap-ariba-sap-fieldglass-sap-concur/)
- Event dates: Sapphire Orlando May 11–13, 2026; Madrid May 19–21, 2026. — [Altivate](https://www.altivate.com/blog/sap-sapphire-2026-key-announcements/)

### Inferences
- "SAP Autonomous Suite" appears to be a brand and positioning layer over the existing LoB SaaS products (SuccessFactors, Ariba, Concur, Fieldglass, Sales/Service Cloud, and so on). The individual product names remain in use, as the Oct 2026 news on "SAP Ariba", "SAP Fieldglass" and "SAP Concur" shows. The Business Suite package SKUs (Finance/SCM Base/Premium and so on) appear to remain the commercial vehicle.
- For a consulting reader: LoB apps are licensed either standalone (classic subscription) or as entitlements within Business Suite packages. Bundled entitlements are often capped (for example 100 Concur reports per month) and limited to net-new customers.

### Gaps
- The official SAP list of package contents (exactly which SuccessFactors, Ariba, IBP, Sales/Service Cloud modules sit in which tier) could not be retrieved. The learning.sap.com "Positioning and Selling SAP Business Suite Packages" course returned an error.
- Whether HCM, CX and Strategic Procurement packages have Base/Premium tiers is unverified.
- Whether packaging changed after the Autonomous Suite rebrand is unknown. The SAP Connect 2026 innovation news guide (Oct 2026) could not be fetched.

---

## 2. HR: SAP SuccessFactors, Employee Central Payroll, SAP HCM for SAP S/4HANA (H4S4)

### Takeaway
SAP SuccessFactors (with Employee Central as core HR) is SAP's strategic cloud HCM. SAP SuccessFactors Employee Central Payroll (ECP) is the innovation focus for payroll. **SAP HCM for SAP S/4HANA (H4S4)** is a continuation of the classic HCM code line inside S/4HANA 2022+, maintained to 2040. It is the on-prem and private cloud bridge, because the HCM Compatibility Pack in S/4HANA expired at the end of 2025.

### Cited Findings
**SAP SuccessFactors Employee Central Payroll (ECP)**
- Current payroll innovation focus: about 1,800+ customers and 52 local versions; partners can build their own localizations. — [EPI-USE Labs, 2025 payroll options](https://www.epiuselabs.com/lets-talk-hcm/2025-payroll-options-for-sap-successfactors)
- Delivered as private cloud but sold within the SuccessFactors public cloud offering. It is a new implementation, though most on-prem configuration can be carried over. It offers full SAP Payroll functionality with reduced customization. — [EPI-USE Labs visual (PDF)](https://www.epiuselabs.com/hubfs/03-Landing-Pages/680582-PRISM-for-HCM/EPI-USE-Labs-Whats-Next-for-SAP_HCM-Payroll-Your-Migration-Options-Visualized.pdf?hsLang=en)
- Employee Central is a prerequisite for ECP. SAP discussed moving ECP from MaxDB to HANA (SuccessConnect 2023), with no published timeline. — [EPI-USE Labs, ECP and S/4HANA](https://epiuselabs.com/lets-talk-hcm/will-sap-successfactors-employee-central-payroll-be-moved-to-s/4hana?hsLang=en)

**SAP HCM for SAP S/4HANA (H4S4), on-premise**
- Shipped with S/4HANA 2022 (planned Q4 2022, delivered on schedule). It is not a new solution but a continuation of the HCM code line, with scope largely equal to the Compatibility Pack minus deprecated functions (for example PA-CM is phased out in favor of PA-EC).
- New material codes cover Core HR, Time Management, Payroll, BSI, LSO, and E-Recruiting. All local payroll versions are supported.
- Maintenance runs until 2040, in line with SAP's S/4HANA innovation commitment to the end of 2040.
- — [EPI-USE Labs, bridge options H4S4](https://www.epiuselabs.com/lets-talk-hcm/bridge-options-sap-successfactors-what-is-h4s4-sap-hcm-for-s4hana-on-premise)
- H4S4 can run inside an S/4HANA system or standalone. It keeps on-prem talent solutions (learning, recruiting) subject to licensing, and is not available to net-new clients. — [EPI-USE Labs, 2025 payroll options](https://www.epiuselabs.com/lets-talk-hcm/2025-payroll-options-for-sap-successfactors)

**HCM on S/4HANA Private Cloud Edition (RISE)**
- Lets customers keep HR, Payroll, Time, and Benefits by moving them into an S/4HANA PCE subscription hosted by SAP or on a hyperscaler (Azure, GCP, AWS). On-prem HCM licenses are converted. — [EPI-USE Labs](https://www.epiuselabs.com/lets-talk-hcm/2025-payroll-options-for-sap-successfactors)
- H4S4 is included in PCE. Lift-and-shift takes about 2–4 months. Standalone options apply only above 25k employees. — [EPI-USE Labs visual (PDF)](https://www.epiuselabs.com/hubfs/03-Landing-Pages/680582-PRISM-for-HCM/EPI-USE-Labs-Whats-Next-for-SAP_HCM-Payroll-Your-Migration-Options-Visualized.pdf?hsLang=en)

**Compatibility Pack**
- Usage rights for most compatibility packs, including HCM (CP IDs 414–424), expired on 31 Dec 2025; continued use is non-compliant from 1 Jan 2026.
- From release 2025 SAP planned to make expired CP functionality technically unavailable, with the "H4S4" switch activated by default and no downports.
- The named HCM successors are H4S4, SuccessFactors for E-Recruiting and Learning in private cloud, and Fiori or WDA ESS/MSS.
- — [SAP user group deck, Compatibility Packs Way Forward (PDF, May 2024)](https://assets.dm.ux.sap.com/sap-user-groups/pdfs/sap_compatibility_packs_way_forward_240507.pdf)
- The same deck lists the 2030 exceptions (Customer Service CS, LE-TRA Transport, PP-PI) and the successors for other expiring packs:
  - Classic Travel & Expense → SAP Concur
  - EC-CS → Group Reporting
  - S&OP → IBP
  - LE-WM → EWM
  - — [same](https://assets.dm.ux.sap.com/sap-user-groups/pdfs/sap_compatibility_packs_way_forward_240507.pdf)

**ECC timeline relevant to HCM**
- Business Suite 7 mainstream maintenance ends 2027; extended maintenance runs 2028–2030 at +2%.
- The "SAP ERP, private edition, transition option" (announced 4 Feb 2025) allows use 2031–2033 for large ECC customers who migrate to ERP private edition by the end of 2030.
- — [EPI-USE Labs](https://www.epiuselabs.com/lets-talk-hcm/2025-payroll-options-for-sap-successfactors)

**SuccessFactors at Sapphire 2026**
- H&M was cited as a SuccessFactors customer. HCM is one of the five Autonomous Suite domains. — [SAP News, Sapphire 2026](https://news.sap.com/2026/05/sap-sapphire-keynote-business-ai-platform-power-autonomous-enterprise/)

### Inferences
- **When to use what:**
  - SuccessFactors Employee Central and ECP is the default target for net-new and cloud-first customers.
  - H4S4, on-prem or inside RISE PCE, suits customers who must keep complex on-prem payroll (for example the German public-sector or utility collective agreements typical in DACH) or who want an "as-is" ECC-to-S/4 move.
  - SuccessFactors Talent modules (Recruiting, Learning, Performance & Goals and so on) combine with either core.
- [background, not verified this session] Integration between SuccessFactors Employee Central and S/4HANA (cost centers, employee/business-partner replication, ECP) runs over SAP Integration Suite (previously Dell Boomi or Cloud Platform Integration) using standard packages on SAP Business Accelerator Hub. SAP Master Data Integration (MDI) / SAP One Domain Model is used for workforce data replication to S/4HANA and other LoBs.
- [background, not verified this session] SAP SuccessFactors modules include Employee Central, Employee Central Payroll, Time Tracking, Recruiting, Onboarding, Learning, Performance & Goals, Compensation, Succession & Development, Opportunity Marketplace, and SAP SuccessFactors Work Zone. "SAP SuccessFactors Incentive Management" was formerly SAP Commissions (named on G2 search result: [G2](https://g2.com/sellers/sap)).

### Gaps
- No official SAP source fetched for the H4S4 private cloud edition dates or for exact SuccessFactors module packaging in the Business Suite HCM package.
- Germany-specific ECP localization facts were not found.

---

## 3. Procurement and spend: SAP Ariba, SAP Business Network, SAP Concur, SAP Fieldglass, Central Procurement

### Takeaway
SAP Ariba (source-to-pay: Buying, Sourcing, Contracts, Supplier Lifecycle and Performance, Spend Analysis) and SAP Business Network (formerly Ariba Network) remain SAP's strategic procurement cloud. SAP Concur covers travel and expense, and SAP Fieldglass covers contingent workforce and services procurement. In 2026 they are marketed as the "Autonomous Spend Management" domain of the SAP Autonomous Suite.

### Cited Findings
- SAP Ariba is positioned as SAP's source-to-pay application suite. The SAP Business Network is "formerly Ariba Network" and is where suppliers handle RFPs and invoices. SAP Fieldglass and SAP Concur are listed in the same spend portfolio. — [sap.com Spend Management](https://www.sap.com/products/spend-management.html)
- The Strategic Procurement package (2025) covers SAP Ariba sourcing, contract management, and supplier lifecycle and performance. — [CIO.com](https://www.cio.com/article/3990475/sap-revamps-its-cloud-erp-application-packages.html)
- October 2026 spend innovations:
  - **SAP Ariba Spend Analysis and Insights**: available Sept 2026; combines spend data from Ariba, Fieldglass, Concur, SAP Cloud ERP and others
  - **Spend Analytics Assistant**: GA Q1 2027
  - **Contingent Workforce Assistant**: GA Q4 2026
  - **Moody's supplier risk** embedded in **SAP Ariba Supplier Lifecycle and Performance**: GA Q4 2026
  - **SAP Ariba Procurement Orchestration by ORO Labs**: intake and orchestration solution extension, GA Nov 2026
  - **SAP Concur micro-apps** in SAP Micro-App Hub: Q4 2026
  - — [SAP News, Oct 2026](https://news.sap.com/2026/10/next-chapter-spend-management-ai-innovations-sap-ariba-sap-fieldglass-sap-concur/)
- SAP Business Network Commerce Automation and Supply Chain Collaboration became available in Europe and KSA with data federation (end Q3 and end Q4 2025 respectively). — [SAP News, May 2025](https://news.sap.com/2025/05/ai-powered-innovations-network-centric-supply-chain-management/)
- SAP Concur integrates natively (ICS) with S/4HANA Cloud Public Edition, covering near-real-time expense postings, payroll, exchange rates, and cash advances. Concur Expense is bundled in Finance Premium. — [SAP Learning](https://learning.sap.com/courses/discovering-travel-expense-solutions/maximizing-the-value-of-sap-concur-solutions-with-sap-business-suite)
- Classic ECC Travel & Expense (CP 425) expired with the 2025 Compatibility Pack deadline; the successor is SAP Concur (minimum release for Concur integration: 2022). — [Compatibility Packs deck (PDF)](https://assets.dm.ux.sap.com/sap-user-groups/pdfs/sap_compatibility_packs_way_forward_240507.pdf)
- Third-party intake and orchestration tools are listed on sap.com for "SAP ERP, S/4HANA, Ariba, Fieldglass, and Concur" (Tonkean, ORO Labs), and there is a partner activation service for "SAP Ariba Intake Management". — [sap.com partner listing Tonkean](https://www.sap.com/norway/products/spend-management/partners/tonkean-inc-tonkean.html); [sap.com Kyyte for SAP Ariba Intake Management](https://www.sap.com/mena-ar/products/spend-management/partners/s3g-integrators-inc-dba-kyyte-activation-service-for-sap-ariba-intake-management.html)

### Inferences
- **When Ariba versus S/4 procurement:** S/4HANA MM and Central Procurement cover operational procurement within ERP. Ariba is used for strategic sourcing, contract management, supplier management and risk, guided buying, and network-based supplier collaboration (PO/invoice exchange via Business Network).
- [background, not verified this session] **SAP S/4HANA for central procurement** is a hub-and-spoke scenario: a central S/4HANA hub connects to several back-end ERPs (S/4 or ECC) for central requisitioning, central purchase contracts, and central sourcing. It can be combined with Ariba Sourcing and Business Network.
- [background, not verified this session] Integration of S/4HANA with Ariba uses SAP Integration Suite with standard "SAP Ariba Integration with SAP S/4HANA" packages, or the older Cloud Integration Gateway (CIG) and its successor managed gateway. Fieldglass integrates via standard S/4 integration for services POs and timesheets.
- [background, not verified this session] SAP Ariba Buying and Invoicing is the operational P2P product; SAP Ariba Guided Buying is the user-facing UI.

### Gaps
- Status of the Ariba "next-generation" platform (Ariba built on BTP/HANA) and of SAP Ariba Intake Management as an SAP product versus partner extensions were not verified from primary sources.
- Exact current Central Procurement scope for S/4HANA 2025 / Cloud ERP was not fetched.

---

## 4. Customer experience (SAP CX)

### Takeaway
SAP Sales Cloud Version 2 and SAP Service Cloud Version 2 are the strategic CRM front office: cloud-native microservices, API-first, with standard lead-to-cash integration to S/4HANA. Since the 2405 certification cycle, "SAP Sales and Service Cloud version 1" (the former SAP Cloud for Customer, C4C) is no longer covered. SAP Marketing Cloud is deprecated in favor of SAP Emarsys. Customer data is covered by SAP Customer Data Cloud (identity, consent) and SAP Customer Data Platform.

### Cited Findings
**SAP Sales Cloud Version 2 / SAP Service Cloud Version 2**
- "Truly cloud-native", microservice architecture ("near zero downtime"), open stack, API-first, with embedded AI (Joule, agents).
- Standard lead-to-cash integration with S/4HANA, integrated master data, and "No cost for integration maintenance". Customer 360 shows S/4 orders, contracts, and overdue invoices.
- — [SAP, Moving to SSCV2](https://www.sap.com/engage/sscv2.html)
- Functional spec:
  - Sales Cloud V2 has service and field-sales add-ons; Service Cloud V2 has sales and **utilities add-ons**.
  - The utilities add-on covers contract accounts, premise management, installment plans, move management, consumption graph, and payments, with S/4HANA master data and process integration.
  - Both include S/4HANA and ECC master data integration. AI content generation requires SAP AI Units.
  - — [SAP functional specs V2 (PDF, 2025)](https://assets.cdn.sap.com/agreements/product-policy/css/service-specifications/sap-sales-cloud-and-sap-service-cloud-version-2-functional-specs-english-v6-2025.pdf)
- SAP CX Solution Architect stay-certified 2405 "does not include SAP Sales and Service Cloud version 1 anymore". SAP Marketing Cloud content is deprecated, and Emarsys now stands alone. Portfolio areas listed: SAP Commerce Cloud, SAP Customer Data Solutions (SAP Customer Data Cloud plus SAP Customer Data Platform), Sales/Service Cloud V2, SAP Emarsys, SAP CX AI Toolkit. — [SAP Learning](https://learning.sap.com/courses/solution-architect-for-customer-experience/showcasing-changes-and-new-features_a9be027e-a9b2-4af4-8926-7b8315344ec1)

**SAP Emarsys (SAP Emarsys Customer Engagement)**
- AI-driven omnichannel engagement with personalized promotional and transactional messaging. Related solution: SAP Customer Data Platform. — [sap.com Emarsys](https://www.sap.com/products/crm/emarsys.html)
- Vision: "best-of-suite and AI-first", business data activation. — [SAP Emarsys roadmap asset, Oct 2025](https://www.sap.com/assetdetail/2025/10/4eab0ce2-247f-0010-bca6-c68f7e60039b.html)

**Customer Experience package (2025)**
- Covers sales and service, commerce, marketing automation, customer data management, and SFA. — [CIO.com](https://www.cio.com/article/3990475/sap-revamps-its-cloud-erp-application-packages.html)

**SAP Commerce Cloud**
- Named at Sapphire 2026 (H&M). — [SAP News](https://news.sap.com/2026/05/sap-sapphire-keynote-business-ai-platform-power-autonomous-enterprise/)

### Inferences
- **When CX cloud versus S/4:** S/4HANA SD and S/4HANA Service cover order-to-cash and service execution in the back end. Sales/Service Cloud V2 covers front-office SFA, case and ticket management, and omnichannel. For utilities, the Service Cloud V2 utilities add-on is the cloud front office on top of S/4HANA Utilities (successor to C4C for Utilities / "C4U", see section 6).
- [background, not verified this session] Former names:
  - SAP Commerce Cloud = formerly SAP Hybris Commerce
  - SAP Customer Data Cloud = formerly Gigya; consent and identity
  - SAP Customer Data Platform = formerly Customer Data Platform from the Qualtrics/Gigya lineage
  - SAP CPQ = formerly CallidusCloud CPQ
  - SAP Field Service Management = formerly Coresystems
  - SAP Sales/Service Cloud V1 = SAP Cloud for Customer (C4C), formerly SAP Hybris Cloud for Customer
  - "SAP C/4HANA" and "SAP Hybris" are superseded umbrella brands.
- [background, not verified this session] SAP Field Service Management integrates with S/4HANA Service and Plant Maintenance via standard Integration Suite packages for dispatching and mobile technicians. It is relevant for utilities field crews, alongside SAP Asset Manager (mobile EAM).

### Gaps
- No official SAP end-of-maintenance date for Sales/Service Cloud V1 (C4C) was found (searched; partner pages gave no date).
- SAP CPQ, SAP Field Service Management, and SAP Customer Data Cloud current naming and status were not verified from primary sources this session (search budget exhausted).

---

## 5. Supply chain: IBP, Digital Manufacturing, APM, Business Network for Logistics, EWM, Responsible Design and Production

### Takeaway
The SCM LoB cloud apps are:
- **SAP Integrated Business Planning (IBP)**: planning, the successor to APO and S&OP
- **SAP Digital Manufacturing**: cloud MES
- **SAP Asset Performance Management (APM)**: successor to the Intelligent Asset Management suite
- **SAP Business Network for Logistics**: formerly SAP Logistics Business Network
- **SAP Responsible Design and Production**: EPR and plastics

Sapphire 2025 positioned them as "network-centric" and AI-enabled under the SAP Business Suite package for SAP Supply Chain Management.

### Cited Findings
- 2025 SCM innovations:
  - **SAP Integrated Business Planning**: Joule helps planners interpret supply plans (by end of 2025).
  - **SAP Digital Manufacturing**: smart guided execution and a new electronic batch record for regulated industries; service orders integrated.
  - **SAP Asset Performance Management**: advanced asset health monitoring, time-series data management, IoT via a Cumulocity partnership; targets utilities, transportation, and energy.
  - Agents (Maintenance Planner, Shopfloor Supervisor, Field Service Dispatcher): GA Q4 2025.
  - — [SAP News, May 2025](https://news.sap.com/2025/05/ai-powered-innovations-network-centric-supply-chain-management/)
- The package is named "SAP Business Suite package for SAP Supply Chain Management", an AI-driven, network-enabled cloud package. — [same](https://news.sap.com/2025/05/ai-powered-innovations-network-centric-supply-chain-management/)
- **SAP Asset Performance Management**:
  - SaaS, browser-based, sold in blocks of 100 objects per year
  - Risk and criticality assessment, reliability methods, AI predictive maintenance, IoT sensor analytics
  - — [sap.com APM](https://www.sap.com/products/scm/apm.html)
- APM integrates with S/4HANA Maintenance Management to close the strategy-to-execution loop.
  - ASPM covers RCM, FMEA, and criticality. "APM for Utilities" covers power plant and grid assets, and SAP Predictive Asset Insights includes transformer analysis (Duval triangles).
  - SAP Asset Manager is the mobile app integrated with S/4 maintenance and APM.
  - Partner apps: Future Grid Platform (smart meter data for grid reliability), LiveEO, EY Transformer Health.
  - — [SAP Learning, EAM architecture for utilities](https://learning.sap.com/courses/transitioning-to-sap-s-4hana-for-utilities/explaining-asset-management-eam-architecture)
- Former components of the "SAP Intelligent Asset Management Suite": Asset Central, Asset Strategy and Performance Management, Predictive Maintenance and Service, Asset Intelligence Network. — [Rizing](https://rizing.com/news/sap4utilities_san_diego/)
- **SAP Business Network for Logistics (BN4L)**, formerly SAP Logistics Business Network (LBN):
  - Components: Freight Collaboration (shipper–carrier order exchange directly from SAP TM in S/4HANA without middleware), Global Track & Trace, Material Traceability
  - — [IGZ](https://www.igz.com/en/sap-transportation/sap-modules/sap-bn4l/)
- 2025 logistics network features: GHG tracking from actual transport data, and ocean freight tendering and dispute handling. — [SAP News, May 2025](https://news.sap.com/2025/05/ai-powered-innovations-network-centric-supply-chain-management/)
- **SAP Responsible Design and Production**: plastic packaging, polymer tracking, EPR and plastic tax calculation and payment. — [ASUG chapter deck (PDF, Mar 2024)](https://blog.asug.com/hubfs/Chapter%20Events/ASUG%20Upstate%20NY%20Chapter%20Event.pdf)
- Compatibility-pack successors: S&OP → IBP; LE-WM → EWM (basic warehousing via stockroom management); LE-TRA Transport is extended to 2030. — [Compatibility Packs deck (PDF)](https://assets.dm.ux.sap.com/sap-user-groups/pdfs/sap_compatibility_packs_way_forward_240507.pdf)

### Inferences
- **When cloud LoB versus S/4:** S/4HANA has embedded EWM, embedded TM, PP/DS, and MRP Live. Use IBP for multi-level demand, supply, inventory, and S&OP planning across ERPs. Use Digital Manufacturing for plant-floor MES across plants. Use APM for reliability and predictive maintenance on top of S/4 EAM.
- [background, not verified this session] IBP integrates with S/4HANA via SAP Cloud Integration for data services (CI-DS) and real-time integration (RTI) for order-based planning. Digital Manufacturing integrates via standard S/4 interfaces (production orders, goods movements). APM consumes S/4 equipment and functional locations, also via Master Data Integration / SAP Asset Central foundation in BTP.
- [background, not verified this session] "SAP Extended Warehouse Management, cloud edition" (2024/2025) is a public cloud SaaS EWM, as opposed to embedded/decentral EWM on S/4HANA. Not verified this session.

### Gaps
- No primary source fetched on EWM cloud edition status, or on whether "SAP Business Network for Logistics" has since been folded into "SAP Business Network" naming. SAP News May 2025 describes logistics features under "SAP Business Network" without the BN4L name.
- No primary source on current SAP Responsible Design and Production status in 2026.

---

## 6. Finance and other LoB: Cash Application, Taulia, Document and Reporting Compliance, PaPM, EPPM, Sustainability, Group Reporting

### Takeaway
- SAP Document and Reporting Compliance (DRC) is the key e-invoicing tool for the German B2B mandate (receive from 2025, send from 2027/2028). Its cloud edition on BTP supports Peppol (XRechnung) and email (ZUGFeRD/CII).
- SAP Taulia (working capital) is bundled in the Cloud ERP Private package.
- SAP Cash Application is a Finance add-on modular cloud solution.
- SAP Profitability and Performance Management (PaPM Cloud) is the high-volume costing and allocation engine.
- Group Reporting is native S/4HANA consolidation.
- Sustainability is split across SAP Green Ledger, SAP Sustainability Footprint Management, and SAP Sustainability Control Tower.

### Cited Findings
**SAP Document and Reporting Compliance (DRC) and German e-invoicing**
- Timeline (Wachstumschancengesetz):
  - From 1 Jan 2025 all German businesses must be able to receive e-invoices.
  - From 1 Jan 2027 sending is mandatory for revenue ≥ €800k.
  - From 1 Jan 2028 sending is mandatory for all businesses.
  - Format: EN 16931. XRechnung is UBL 2.1 or CII; ZUGFeRD 2.x / Factur-X is hybrid PDF/A-3 plus CII XML.
  - Channels: Peppol, email, EDI.
  - Exceptions: invoices under €250 and travel tickets.
  - — [PIKON (DE)](https://www.pikon.com/de/blog/e-invoicing-in-deutschland-status-und-ueberblick/)
- SAP options available:
  - Outbound by email (CII/ZUGFeRD) and via Peppol (XRechnung) for B2B and B2G
  - Inbound by email (CII/ZUGFeRD) and via Peppol (XRechnung) for B2B
  - Requires the "SAP Document and Reporting Compliance, Cloud Edition" license
  - — [PIKON (DE)](https://www.pikon.com/de/blog/e-invoicing-in-deutschland-status-und-ueberblick/)
- DRC is a BTP-based cloud solution to create, validate, transmit, and monitor e-documents. Basic functionality is included in SAP S/4HANA Cloud Public Edition at 10,000 documents per year, with more billed in 10k blocks. It supports Peppol in Germany and 90+ countries. — [consolut](https://consolut.com/en/insights/e-rechnungspflicht-2027-sap-drc-fuer-den-rechnungsausgang/)
- SAP KBA 3781831 (Germany, receiving supplier e-invoices by email) applies to "SAP Document and Reporting Compliance, cloud edition" and S/4HANA Cloud Public Edition. Keywords: eDocument Cockpit, XRechnung, ZUGFeRD, Peppol, UBL. — [SAP KBA 3781831](https://userapps.support.sap.com/sap/support/knowledge/en/3781831)
- B2G e-invoicing has been mandatory in Germany since Nov 2020. — [abat whitepaper](https://www.abat.de/en/knowledge/whitepaper/detail/e-invoicing-with-sap)
- SAP ran a June 2026 webinar, "Comply and automate customer and supplier invoices in Germany with SAP Document and Reporting Compliance". — [sap.com event](https://www.sap.com/germany/events/2026-06-26-online-comply-and-automate-customer-and-supplier-invoices-in-germany-with-document-and-reporting-compliance0.html)

**SAP Taulia**
- Included in the Finance package (working capital management). — [CIO.com](https://www.cio.com/article/3990475/sap-revamps-its-cloud-erp-application-packages.html)
- Included at no extra cost with the SAP Cloud ERP Private package. — [SAP asset](https://www.sap.com/assetdetail/2025/12/cc99ab57-307f-0010-bca6-c68f7e60039b.html)

**SAP Cash Application**
- Listed as a "Finance Add-on Modular Cloud" solution needing its own license. — [SAP finance deck (PDF)](https://assets.dm.ux.sap.com/noam-sap-connect-days-na-chicago/1_Finance_Transforming%20Finance-Led%20ERP%20and%20Beyond_Laser%20Focused%20Innovations%20Unveiled.pdf)

**SAP Profitability and Performance Management (Cloud)**
- High-speed calculation engine for complex profitability and allocation scenarios beyond standard ERP.
- Features Cloud ERP integration and posting creation, simulation, and BDC integration.
- — [SAP Learning, EPM key products](https://learning.sap.com/courses/discovering-enterprise-performance-management/summarizing-key-products-of-epm)

**Group Reporting**
- Native on S/4HANA: Universal Journal integration, FS item framework, rule-based eliminations, data collection. — [SAP Learning EPM](https://learning.sap.com/courses/discovering-enterprise-performance-management/summarizing-key-products-of-epm)
- EC-CS consolidation compatibility pack → SAP S/4HANA Finance for Group Reporting. EC-CS is temporarily included in the Group Reporting license until end of 2027. — [Compatibility Packs deck (PDF)](https://assets.dm.ux.sap.com/sap-user-groups/pdfs/sap_compatibility_packs_way_forward_240507.pdf)
- SAP Analytics Cloud for Planning now sits within SAP Business Data Cloud. — [SAP Learning EPM](https://learning.sap.com/courses/discovering-enterprise-performance-management/summarizing-key-products-of-epm)

**SAP Enterprise Portfolio and Project Management**
- Official name confirmed. Covers portfolio and project management, resource management, commercial project management, project financial planning integrated with accounting, issue/change, and risk. — [sap.com EPPM features](https://www.sap.com/products/scm/project-portfolio-management/features.html)

**Sustainability**
- **SAP Green Ledger**:
  - Unveiled at Sapphire 2023; initial components in S/4HANA Cloud, included in RISE and GROW — [TechTarget](https://www.techtarget.com/searchsap/news/366538315/SAPs-new-sustainability-ledger-tracks-carbon-emissions)
  - Described as running on BTP with its own persistence for green ledger journal entries — [ASUG deck (PDF)](https://blog.asug.com/hubfs/Chapter%20Events/ASUG%20Upstate%20NY%20Chapter%20Event.pdf)
  - A 2026 consultancy states it "is not a standalone SAP ledger" and sits outside the Universal Journal — [Rödl, Jul 2026](https://www.roedl.com/insights/nachhaltigkeit-braucht-gute-daten-wie-sap-gestuetztes-esg-datenmanagement-zum-strategischen-vorteil-werden-kann/)
  - Sources are partly inconsistent on the technical placement.
- **SAP Sustainability Footprint Management** (formerly SAP Product Footprint Management) calculates product and corporate carbon footprints from S/4 data. — [TechTarget](https://www.techtarget.com/searchsap/news/366538315/SAPs-new-sustainability-ledger-tracks-carbon-emissions); [Rödl](https://www.roedl.com/insights/nachhaltigkeit-braucht-gute-daten-wie-sap-gestuetztes-esg-datenmanagement-zum-strategischen-vorteil-werden-kann/)
- **SAP Sustainability Data Exchange** shares footprint data with suppliers. — [TechTarget](https://www.techtarget.com/searchsap/news/366538315/SAPs-new-sustainability-ledger-tracks-carbon-emissions)
- **SAP Sustainability Control Tower** is an ESG KPI and CSRD reporting hub on BTP. — [Rödl](https://www.roedl.com/insights/nachhaltigkeit-braucht-gute-daten-wie-sap-gestuetztes-esg-datenmanagement-zum-strategischen-vorteil-werden-kann/); [ASUG deck](https://blog.asug.com/hubfs/Chapter%20Events/ASUG%20Upstate%20NY%20Chapter%20Event.pdf)
- The SAP PRESS overview lists Sustainability Management as a sixth Business Suite area. — [SAP PRESS](https://blog.sap-press.com/whats-the-new-sap-business-suite)

### Inferences
- For German utilities on S/4HANA private or on-prem, DRC means the eDocument framework in S/4 plus the DRC cloud edition on BTP for Peppol access (SAP acting as or connecting to a Peppol access point) and ZUGFeRD mail output. The cloud-edition license is needed for Peppol B2B. Inbound processing still needs OCR or invoice management (for example SAP Document AI or partner VIM/OpenText) for non-structured channels.
- [background, not verified this session] SAP Taulia covers dynamic discounting, supply chain finance, and virtual cards. SAP acquired Taulia in 2022. Integration with S/4 runs via standard connectors.

### Gaps
- No official help.sap.com DRC Germany scope page was retrievable (robots). Exact S/4HANA on-prem/private minimum releases and SAP notes are not captured.
- Current status of SAP Sustainability Control Tower and SAP Green Ledger in 2026 (GA scope, possible merger into a "SAP Sustainability" suite or BDC) was not verified.
- "Group Reporting cloud" as a separate offering (for example Group Reporting Data Collection on BTP) is not confirmed.

---

## 7. Utilities and energy industry solutions (focus: German and Austrian utilities)

### Takeaway
The SAP utilities stack in 2026 consists of these parts:
- **Core**: SAP S/4HANA Utilities, the successor to IS-U, covering meter-to-cash (Device Management, Billing, Invoicing, Contract Accounting, Customer Engagement, EDM, AMI).
- **Meter data in the cloud**: SAP Cloud for Energy, a public cloud non-S/4 SaaS for metering data validation and estimation.
- **German market communication**: SAP Market Communication for Utilities ("MaCo Cloud"), a Germany-only cloud service.
- **Customer front office**: S/4HANA Customer Engagement, or SAP Service Cloud V2 with the utilities add-on.
- **Grid assets**: S/4HANA EAM plus SAP Asset Performance Management and SAP Asset Manager.
- **Commercial bundle**: "SAP Utilities Core" and "SAP Utilities Core for Germany".

IS-U on ECC follows the ECC clock: mainstream maintenance ends 2027, extended maintenance ends 2030.

### Cited Findings
**SAP S/4HANA Utilities (core)**
- Components:
  - Device Management
  - Billing
  - Invoicing
  - Contract Accounting
  - Customer Engagement (CE): interaction center, move-in/out, bill correction
  - Master Data (business partner, point of delivery)
  - Meter Reading
  - Energy Data Management (EDM): time series upload, validation, estimation, settlement
  - Advanced Metering Infrastructure (AMI): integration with MDM/head-end systems
  - Market communication via the Market Process Management framework for deregulated markets
  - Related: Measurement Concept Management (MCM), Convergent Invoicing, Utilities Product Integration Layer (UPIL), SAC reporting
  - — [SAP Learning, core concepts S/4HANA Utilities](https://learning.sap.com/courses/discovering-business-processes-in-sap-s-4hana-utilities/understanding-the-core-concepts-of-s-4hana-utilities)
- **SAP Utilities Core** is a commercial bundle of products, infrastructure, and transformation services from metering to payment. **SAP Utilities Core for Germany** adds German-specific processes and cloud-based market communication. MCM underpins the Utilities Core industry cloud offering. — [same](https://learning.sap.com/courses/discovering-business-processes-in-sap-s-4hana-utilities/understanding-the-core-concepts-of-s-4hana-utilities)
- Fiori is the UX, with roles such as Utilities Metering Specialist and Utilities Billing Specialist. The cloud edition is Fiori-only; on-prem keeps SAP GUI. — [same](https://learning.sap.com/courses/discovering-business-processes-in-sap-s-4hana-utilities/understanding-the-core-concepts-of-s-4hana-utilities)
- Deployment can be on-prem, cloud, or hybrid, including an "SAP S/4HANA Utilities private cloud" via RISE. BTP connects the core with cloud solutions such as SAP Cloud for Energy. — [Natuvion](https://natuvion.com/sap-s-4hana-utilities)
- Timeline:
  - IS-U follows Business Suite 7: mainstream maintenance ends 31 Dec 2027; extended maintenance runs 2028–2030 (+2 points).
  - The transition option for 2031–2033 requires a move to ERP private edition on HANA by end of 2030.
  - The S/4HANA innovation commitment runs to 2040.
  - Customer service moves to "Customer Management (formerly S4CM) or SAP C4U".
  - — [innobu, Oct 2026](https://www.innobu.com/en/articles/s4hana-utilities-clean-core-2026.html)
- German market context:
  - About half of German municipal utilities had not started their SAP transformation by mid-2024 (source of the figure not given).
  - Non-SAP alternatives: Schleupen, SIV kVASy, Wilken, Powercloud.
  - The roadmap ties to the ECC deadlines (2027/2030), the MaKo 2026 releases, and §14a EnWG.
  - — [innobu](https://www.innobu.com/en/articles/s4hana-utilities-clean-core-2026.html)

**SAP Market Communication for Utilities (MaCo Cloud)**
- A cloud-based solution for German energy market communication processes.
- Key users monitor processes and messages, and SAP maintains market partner data.
- It handles regulatory format changes proactively and connects directly to S/4HANA Utilities. Germany only.
- — [sap.com Market Communication for Utilities](https://www.sap.com/products/scm/market-communication-for-utilities.html); also called "SAP MaCo Cloud" — [Natuvion](https://natuvion.com/sap-s-4hana-utilities)

**SAP Cloud for Energy (meter and energy data management)**
- Public cloud, "non S/4HANA", Big Data-enabled energy and water data management.
- Features: monitoring of meter reading quality, automated validation and estimation with custom rules, device master data synchronization with S/4HANA Utilities, time series views.
- Commercials: subscription of 12–60 months, priced in blocks of 1,000 objects, with two productive tenants and one test tenant.
- Works with S/4HANA Utilities and SAP Subscription Billing.
- — [sap.com Cloud for Energy](https://www.sap.com/uk/products/scm/cloud-for-energy.html)
- Gartner Peer Insights files SAP Cloud for Energy in the Meter Data Management Systems market. — [Gartner](https://www.gartner.com/reviews/market/meter-data-management-systems/compare/product/sap-cloud-for-energy-vs-utilities-meter-data-management)

**Customer engagement for utilities**
- SAP Service Cloud Version 2 has a **utilities add-on**: contract accounts, premises, installment plans, move management, consumption graph, payments, and S/4HANA Utilities master data and process integration. — [SAP V2 functional specs (PDF)](https://assets.cdn.sap.com/agreements/product-policy/css/service-specifications/sap-sales-cloud-and-sap-service-cloud-version-2-functional-specs-english-v6-2025.pdf)
- A "Utilities Customer Self-Service Agent" (AI agent, released early 2026) offers 24/7 end-customer support with context on contracts, tariffs, and consumption, and integrates with S/4HANA Utilities. — [sap.com event, Feb 2026](https://www.sap.com/germany/events/2026-02-19-online-smarter-service-for-utilities-introducing-the-utilities-customer-self-service.html)

**Grid and asset management**
- S/4HANA EAM plus SAP APM (APM for Utilities covers power plant and grid assets, with transformer analytics) plus SAP Asset Manager (mobile).
- Partner solutions: Future Grid (smart meter data for grid reliability), LiveEO (satellite monitoring), EY Transformer Health.
- — [SAP Learning, EAM architecture](https://learning.sap.com/courses/transitioning-to-sap-s-4hana-for-utilities/explaining-asset-management-eam-architecture)
- APM 2025 innovations explicitly target utilities, adding IoT via Cumulocity. — [SAP News, May 2025](https://news.sap.com/2025/05/ai-powered-innovations-network-centric-supply-chain-management/)

**Industry AI and other industries**
- Sapphire 2026 announced industry AI across 26 industries (for example Autonomous Regulated Manufacturing). — [SAP News, Sapphire 2026](https://news.sap.com/2026/05/sap-sapphire-keynote-business-ai-platform-power-autonomous-enterprise/)

### Inferences
- **"SAP Cloud for Utilities" / "C4U"** most likely refers to the former SAP Cloud for Customer (C4C) utilities solution. Its strategic successor is the Service Cloud V2 utilities add-on. The innobu source still names "SAP C4U" as one front-office option. Treat "C4U on C4C v1" as superseded.
- **SAP Meter Data Management**: SAP's current cloud MDM-like offering is SAP Cloud for Energy. The legacy "SAP MDUS" (Meter Data Unification and Synchronization) is the AMI integration layer within IS-U / S/4HANA Utilities (AMI component above). Third-party MDMs (for example Itron or Oracle) connect via the AMI interfaces. The MDUS label is the researcher's inference and is not confirmed by a fetched source.
- **German MaKo / AS4 / Redispatch 2.0** (inferred; not sourced):
  - MaKo (EDIFACT formats such as UTILMD, MSCONS, INVOIC; APIs from MaKo 2026 releases) is handled in S/4HANA Utilities via IDE / Market Process Management plus either SAP Market Communication for Utilities or partner EDM/MaKo solutions. Partners commonly used in DACH include, for example, the SAP-certified offerings of rku.it, Robotron, Natuvion, SIV, or Seeburger and Gambit for AS4 gateways.
  - Since April 2024 AS4 is the mandatory transport protocol for German electricity MaKo.
  - Redispatch 2.0 (Connect+ / data provider processes) is typically covered by partner add-ons or BTP-based solutions, not SAP standard.
  - All of these specifics are unverified this session and need confirmation.
- **Austria**: market communication runs via EDA / ebUtilities (Energiewirtschaftlicher Datenaustausch). No SAP standard cloud service was identified for Austria, and SAP Market Communication for Utilities is Germany-only per sap.com. Austrian utilities (for example Wiener Netze) therefore rely on S/4HANA Utilities IDE plus partner or customer-specific EDA integration (inference).
- [background, not verified this session] Other SAP industry clouds and solutions:
  - SAP S/4HANA for oil & gas, public sector (SAP S/4HANA for Public Sector, PSCD), retail, banking (SAP Fioneer), insurance (SAP Fioneer), and Professional Services
  - SAP Cloud for Real Estate, SAP Subscription Billing, SAP Entitlement Management, SAP Field Service Management
  - SAP Fioneer is a spin-off for banking and insurance

### Gaps
- The SAP Community "SAP Utilities Roadmap 2026 Onwards" blog and SAP News Germany (Feb 2026) "Zukunftssicheres ERP für Energieversorger" could not be fetched (robots or server error). These are the most authoritative 2026 roadmap sources and should be read manually.
- No sourced facts on Redispatch 2.0, AS4, the APIs of MaKo 2026, or Austrian EDA support in SAP.
- No sourced confirmation of whether "SAP Cloud for Utilities" exists as a current product name.
- No sourced list of standard Fiori apps for Utilities beyond role examples.
- Grid-specific SAP products (for example GIS integration, SAP Geographical Enablement Framework) were not covered.
