# ALM, Transformation Toolchain, Migration and Testing Tools around SAP S/4HANA (as of October 2026)

Research note: compiled 24 Oct 2026. The web search budget ran out partway through; the remaining facts come from fetching URLs already found. Several primary SAP pages (help.sap.com, SAP Community blogs, api.sap.com, parts of support.sap.com) block automated fetching. Where only secondary sources were available, this is marked. Items from background knowledge that could not be verified in this session are kept separate under "Gaps" or are labelled "(unverified)".

---

## 1. SAP's toolchain for RISE / Cloud ERP transformations ("Integrated Toolchain", now "Agent-led toolchain") and SAP Business Transformation Management

### Takeaway
SAP has stopped using "Integrated Toolchain" as the official term. At SAP Sapphire 2026 (May 2026) it became the **"Agent-led toolchain"**, a pillar of the RISE with SAP Methodology. The tools are the same, but AI agents (Joule agents, Tricentis agents) now drive the handoffs between them.
- Core tools: SAP Signavio (processes), SAP LeanIX (enterprise architecture), SAP Cloud ALM (implementation, test, deploy, operations backbone), Tricentis (QA, as SAP Solution Extensions), WalkMe (adoption) and Syniti/SAP ADMM (data).
- Platform add-ons: SAP Build, SAP Integration Suite and OpenText archiving.
- "SAP Business Transformation Management" (BTM) is the commercial portfolio name for **SAP Signavio + SAP LeanIX + WalkMe** only. It is a different thing from **SAP Business Transformation Center** (BTC), which is a Cloud ALM-based data transformation tool.

### Cited Findings

**Naming and timeline**
- SAP renamed the Integrated Toolchain to the "Agent-led toolchain" at SAP Sapphire 2026, as part of its "Autonomous Enterprise" vision. The tools stay the same, but "AI agents now actively drive workflows and connect across the chain, reducing manual handoffs" — [Tricentis blog, 29 Jun 2026](https://www.tricentis.com/blog/sap-agent-led-toolchain-explained)
- Tricentis lists six applications in the Agent-led toolchain:
  - SAP Signavio (process modeling)
  - SAP Cloud ALM (implementation governance and test planning)
  - LeanIX (EA)
  - WalkMe (user enablement)
  - Syniti (data management)
  - Tricentis (QA)

  Source: [Tricentis blog](https://www.tricentis.com/blog/sap-agent-led-toolchain-explained)
- SAP's BTM product page describes an "agent-led toolchain" that supports a faster, lower-risk path to the cloud as part of the RISE with SAP Methodology. The BTM pillars are See, Align and Govern (governing AI agents) — [SAP BTM product page](https://www.sap.com/sea/products/business-transformation-management.html)
- SAP Help Portal documentation set: "SAP ERP Transformation with Agent-led Toolchain". The doc path still uses "erp-transformation-with-itc", and older titles read "SAP ERP Transformation with Integrated Toolchain" — [SAP Help (title per search result; page blocks fetch)](https://help.sap.com/docs/erp-transformation-with-itc/buildable-map/sap-erp-transformation-with-integrated-toolchain?locale=en-US); [Saptix, 27 Aug 2026](https://saptix.com/2026/08/27/integrated-toolchain-blogs-and-learning-paths/)
- SAP job postings use titles such as "Solution Advisor Expert – Agent-led Toolchain, Business Transformation Management" and "Integrated Toolchain Solution Expert – Business Transformation Management". This shows the toolchain is sold by the BTM organisation — [SAP Jobs](https://jobs.sap.com/job/Vancouver-Integrated-Toolchain-Solution-Expert-Business-Transformation-Management-Brit-V6B-1A9/1287768701); [flexa listing](https://flexa.careers/in/jobs/sap-solution-advisor-expert-agent-led-toolchain-business-transformation-management-6a32bd8b3769157cd2d502c3)
- SAP collateral from January 2026 still used "integrated toolchain": "Keep your transformation on track with an integrated toolchain" and "Accelerate business transformation with the integrated toolchain" — [SAP doc 2026/01](https://www.sap.com/documents/2026/01/bcdd17d0-3a7f-0010-bca6-c68f7e60039b.html); [SAP asset 2026/01](https://www.sap.com/assetdetail/2026/01/648f0ea1-377f-0010-bca6-c68f7e60039b.html)

**Toolchain components (SAP Learning)**

SAP Learning ("Understanding the SAP Integrated Toolchain") lists the components by function:

| Function | Tool |
|---|---|
| Business process optimization | SAP Signavio |
| Enterprise architecture management | SAP LeanIX |
| Project and quality management | SAP Cloud ALM |
| Extensions (apps, automations, AI agents) | SAP Build |
| Connecting SAP and third-party systems (iPaaS) | SAP Integration Suite |
| Automated testing | Tricentis, delivered as SAP Solution Extensions |
| Clean, business-ready data | SAP Advanced Data Migration and Management (SAP ADMM) by Syniti |
| User adoption and learning | WalkMe |

Source: [SAP Learning](https://learning.sap.com/courses/discovering-sap-activate-implementation-tools-and-methodology/understanding-the-sap-integrated-toolchain_ce528715-8830-4aff-94b1-f31ab143421c)

- The ASUG BTM community deck (Jan 2026) lists the components as SAP LeanIX, SAP Cloud ALM, SAP Signavio, WalkMe, SAP Build, SAP Integration Suite, Syniti data migration, OpenText archiving and Tricentis QA, all "enabled by SAP Business AI". It also calls the toolchain "a core pillar of the RISE with SAP methodology" — [ASUG BTM deck 27 Jan 2026](https://blog.asug.com/hubfs/Communities/SAPBusinessTransformationManagement/Decks%20to%20Download/BTM%20Slide%20Deck%2001.27.26%20(3).pdf)

**Harmonized meta model and leading systems**
- Each tool keeps its own meta model, linked through a harmonized meta model. Each tool is the leading system for its own objects:
  - LeanIX: architectural objects (Fact Sheets)
  - Signavio: process models and dictionary elements
  - Cloud ALM: projects, scopes, processes, business requirements and implementation artifacts

  Updates from the leading system are pushed automatically to the other tools — [SAP Learning](https://learning.sap.com/courses/discovering-sap-activate-implementation-tools-and-methodology/understanding-the-sap-integrated-toolchain_ce528715-8830-4aff-94b1-f31ab143421c)

**Integrations between the tools**

| Integration | What syncs | Direction / leading system |
|---|---|---|
| LeanIX → Signavio | Applications; app-to-process relationships, most commonly at L4. Signavio also consumes capabilities and application data from LeanIX | — |
| Signavio → LeanIX and Cloud ALM | Process content and process hierarchy | Signavio publishes |
| LeanIX ↔ Signavio | — | Bidirectional. Signavio leads for processes, LeanIX for all other objects |
| LeanIX ↔ Cloud ALM (projects) | Initiatives/projects | Linking works both ways; later updates flow one way, Cloud ALM → LeanIX |
| Cloud ALM → LeanIX (landscape/interface discovery) | Landscape and interfaces | One-way |
| Cloud ALM → Signavio | ALM data | One-way |

Sources: [SAP Learning (toolchain)](https://learning.sap.com/courses/discovering-sap-activate-implementation-tools-and-methodology/understanding-the-sap-integrated-toolchain_ce528715-8830-4aff-94b1-f31ab143421c); [SAP Learning – Synchronizing data models](https://learning.sap.com/courses/sap-activate-project-manager/synchronizing-data-models-across-sap-leanix-sap-signavio-and-sap-cloud-alm)

- LeanIX ↔ Cloud ALM detail: Cloud ALM pushes lifecycle (active/endOfLife), milestones, execution status (On Track / Needs Attention / Critical) and execution progress % to LeanIX. Sync runs every X hours or manually. Cloud ALM projects can be created from a LeanIX Initiative fact sheet — [SAP Learning – Solution integration](https://learning.sap.com/courses/exploring-business-transformation-tools-and-methodology/describing-solution-integration-within-business-transformation)
- Signavio → Cloud ALM: SAP first offered a custom integration through an SAP Cloud Integration iFlow template. The standard integration was planned for Q4/2024 — [SAP Learning](https://learning.sap.com/courses/exploring-business-transformation-tools-and-methodology/describing-solution-integration-within-business-transformation). It is now a standard integration (Cloud ALM Expert Portal: "Standard Signavio integration (Dec 2024)") — [SAP Cloud ALM Implementation Expert Portal](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal.html)
- Signavio–Cloud ALM "near real-time mapping of ALM data into processes" became GA in Q4 2025. Signavio–Solution Manager sync improvements were also GA in Q4 2025 — [SAP Sapphire innovation guide BTM](https://www.sap.com/events/sapphire/innovation-guide/business-transformation-management.html)
- LeanIX integration GA dates:
  - Signavio process hierarchy and variants: Q2 2025
  - WalkMe SaaS discovery and usage insights: Q3 2025
  - Cloud ALM interface discovery: Q3 2025
  - SAP BTP extension/service discovery: Q3 2025

  Source: [SAP innovation guide BTM](https://www.sap.com/events/sapphire/innovation-guide/business-transformation-management.html)
- Cloud ALM ↔ Tricentis: Tricentis integrates with Cloud ALM for test planning and preparation. Test case authoring and test data services sit in Tricentis, and test cases can be linked to processes and individual process steps in Cloud ALM — [SAP Learning](https://learning.sap.com/courses/discovering-sap-activate-implementation-tools-and-methodology/understanding-the-sap-integrated-toolchain_ce528715-8830-4aff-94b1-f31ab143421c)
- Signavio–WalkMe: there was "no technical integration yet", although the two can be used together — [SAP Learning](https://learning.sap.com/courses/discovering-sap-activate-implementation-tools-and-methodology/understanding-the-sap-integrated-toolchain_ce528715-8830-4aff-94b1-f31ab143421c). A later reading guide lists a "WalkMe–Signavio" integration guide in the SAP Help toolchain documentation, plus SSO for all tools through SAP Identity Authentication Service — [Saptix, Aug 2026](https://saptix.com/2026/08/27/integrated-toolchain-blogs-and-learning-paths/). This conflict is probably a matter of timing, with the integration added later.
- Agentic flow as described by Tricentis (2026): a process designed in Signavio syncs to Cloud ALM, where it becomes the basis for test planning. "Those test cases are provisioned in SAP Enterprise Continuous Testing by Tricentis (ECT)." There, the business flow designer creates variants, which are "published back to Cloud ALM for execution tracking, traceability reporting, and release readiness assessment" — [Tricentis blog](https://www.tricentis.com/blog/sap-agent-led-toolchain-explained)
- Joule Studio (new version, announced 13 May 2026) uses the SAP Signavio Process Consultant Agent, SAP Knowledge Graph, SAP Domain Models and SAP LeanIX for business and landscape context. It generates PRD, technical specs, code scaffolding and "test artifacts". BTM solutions and SAP Cloud ALM are named for monitoring agent usage, costs and business impact. Free design-time access runs until end of 2026 — [SAP News, 13 May 2026](https://news.sap.com/2026/05/new-joule-studio-enterprise-scale-agentic-development/)

**Tool mapping to SAP Activate / RISE phases**

| Phase | Tools and activities |
|---|---|
| Discover | Signavio (process visibility, KPIs); LeanIX analyses the landscape, fed by the Cloud ALM API |
| Prepare | LeanIX initiative fact sheets sync to Cloud ALM projects with Activate roadmap phases, milestones and quality gates |
| Explore | Signavio models to-be processes, synced to Cloud ALM; Signavio is the "source of truth" for process design |
| Realize | Cloud ALM is the hub (requirements, user stories, testing, deployments); Tricentis for testing; SAP BTP for extensions |
| Enablement | Enable Now / WalkMe |
| Run | Cloud ALM operations |

The SAP Learning matrix uses five swim lanes: Business Processes, Enterprise Architecture, Validation/Adoption/Enablement, Build and Monitor, Digital Backbone — [SAP Learning – Working with the integrated toolchain](https://learning.sap.com/courses/introducing-the-rise-with-sap-methodology-for-sap-partners-and-customers/working-with-the-integrated-toolchain)

Tricentis maps its own tools as LiveCompare → Discover and Run, Test Automation for SAP → Explore, ECT and Tosca → Realize — [Tricentis ShiftSync](https://shiftsync.tricentis.com/testing-development-methodologies-69/integrated-toolchain-in-rise-with-sap-a-deep-dive-into-tricentis-role-2139)

**Licensing (what RISE includes)**
- Included for all customers with Enterprise Support, cloud editions:
  - SAP Cloud ALM
  - Tricentis Test Automation for SAP
- SAP S/4HANA Cloud Private Edition customers also get:
  - limited SAP Build Apps / Build Process Automation licences
  - CPEA credits
  - AI Units
- SAP Build Work Zone (for SAP Mobile Start) is available to all customers.
- **Additional cost:** SAP LeanIX, SAP Signavio (except Process Insights), SAP Enable Now and WalkMe. SAP Signavio Process Insights, discovery edition, offers a free one-time data load.

Source: [SAP Learning – Working with the integrated toolchain](https://learning.sap.com/courses/introducing-the-rise-with-sap-methodology-for-sap-partners-and-customers/working-with-the-integrated-toolchain)
- The toolchain is "primarily designed for SAP Cloud ERP Private customers", but SAP Cloud ERP (Public) customers can also benefit — [SAP Learning](https://learning.sap.com/courses/discovering-sap-activate-implementation-tools-and-methodology/understanding-the-sap-integrated-toolchain_ce528715-8830-4aff-94b1-f31ab143421c)
- Sapphire 2026 brought no immediate licensing changes. Value is consumed through the existing AI Unit construct. SAP added "AI-led transformation" to RISE, with AI migration agents and tooling for ECC customers — [SAPinsider, 12 May 2026](https://sapinsider.org/articles/sap-sapphire-2026-ai-agents-industry-workflows-cloud-migration/)

**SAP Business Transformation Management (portfolio)**
- BTM is SAP's portfolio for process intelligence, enterprise architecture and digital adoption: SAP LeanIX (including AI Agent Hub, GA), SAP Signavio (including Joule Agents) and WalkMe. Cloud ALM and Tricentis are not listed as part of BTM — [SAP BTM page](https://www.sap.com/sea/products/business-transformation-management.html)
- SAP Transformation Excellence Summit, The Hague, early Nov 2025: LeanIX, Signavio and WalkMe "form SAP's Business Transformation Management portfolio and an integrated toolchain". 2026 summits were held in Atlanta (22–24 Sep 2026) and Berlin (13–15 Oct 2026) — [SAP News, 11 Nov 2025](https://news.sap.com/2025/11/leanix-signavio-walkme-sap-transformation-excellence-summit/); [LeanIX product update Jan 2026](https://updates.leanix.net/announcements/ann_ZMxatUaA13X19)

### Inferences
- For deliverables, "Agent-led toolchain" is the current SAP term from Sapphire 2026 onward. "Integrated Toolchain" survives in older SAP Learning courses, Help paths and partner material. Expect both terms in customer conversations.
- No product called "SAP Business Transformation Management" exists as a single tool. BTM is a portfolio/line of business (Signavio + LeanIX + WalkMe) that also sells the toolchain story. Cloud ALM remains a Support/ALM product included with maintenance.
- For a test manager, the operative chain is Signavio (process model) → Cloud ALM (scope, solution process, requirements, test preparation, test plans, defects) → Tricentis (automation authoring/execution, risk-based scoping through LiveCompare / Change Impact Analysis) → results back to Cloud ALM (traceability, quality gates).

### Gaps
- No official SAP press release text was found that confirms the exact Sapphire 2026 wording of the "Agent-led toolchain" rename. The rename is confirmed through Tricentis (SAP partner), SAP's BTM product page and SAP job titles.
- The RISE package entitlements for Signavio/LeanIX "starter" scopes in the 2026 RISE Premium / Premium Plus bundles were not verified. Older RISE contracts bundled SAP Signavio Process Insights discovery edition and Business Process Intelligence starter packs (background knowledge, unverified for 2026).
- GROW with SAP inclusion of toolchain tools was not found. Tricentis' SAP page lists "GROW with SAP" only as a solution area — [Tricentis SAP page](https://www.tricentis.com/sap)

---

## 2. SAP Cloud ALM (implementation, operations, APIs, clean core) and the SAP Solution Manager 7.2 end of maintenance

### Takeaway
SAP Cloud ALM is SAP's cloud ALM platform, running on SAP BTP. It is free with Enterprise Support, cloud editions and RISE (one tenant per customer number). It covers three areas:
- **Implementation**: programs/projects, Activate roadmap tasks, process hierarchy/Signavio sync, requirements, features, user stories, test preparation/execution, defects, quality gates, release and deployment with CTS/cTMS/ATO, retrofit.
- **Operations**: business process, integration & exception, job & automation, health, real user and synthetic monitoring, alerting/IEP, operation automation, business service management.
- **Service**: Issues and Actions Management, Innovation Adoption.

Cloud ALM also hosts the RISE with SAP Methodology dashboards (System View / Clean Core, Operations View) and SAP Business Transformation Center. Joule in Cloud ALM is GA for all customers, with an agent for requirements and user stories (Week 40/2026).

SAP Solution Manager 7.2 mainstream maintenance ends **31 Dec 2027**. Optional extended maintenance runs to **end of 2030** for selected functions (requirements, project and process management, test suite, change control, ITSM, landscape management). It comes at no extra cost for customers on Business Suite 7 extended maintenance.

### Cited Findings

**Licensing and tenants**
- No licence or subscription fee. Usage rights are included in SAP Cloud Service subscriptions with Enterprise Support, cloud editions, in SAP Enterprise Support, and in Product Support for Large Enterprises. One tenant per customer number is free; the customer picks the data centre — [SAP Support – Cloud ALM](https://support.sap.com/en/alm/sap-cloud-alm.html)
- RISE with SAP includes "an entitlement to request and use an SAP Cloud ALM tenant without additional license or subscription fee". Standard Support customers get no usage rights. SAP Solution Manager is not included in RISE; it needs an on-premise maintenance contract or the "SAP Solution Manager, private cloud edition" subscription. SAP Focused Run must always be licensed separately. SAP planned a commercial offering for additional tenants from H2 2024 — [SAP ALM FAQ](https://support.sap.com/en/alm/faq.html)
- Cloud ALM supports all implementation and change project types, including ECC → S/4HANA Cloud Private Edition conversions. Its operations side also monitors custom BTP apps — [SAP Support – Cloud ALM](https://support.sap.com/en/alm/sap-cloud-alm.html)

**Implementation capabilities (SAP Cloud ALM Implementation Expert Portal, dated resources)**
- Projects and programs: Programs were introduced Nov 2025 — [Expert Portal](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal.html); [blue.works Week 44/2025](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-44/)
- Process management:
  - end-to-end process management guide (Dec 2025)
  - standard Signavio integration (Dec 2024)
  - fit-to-standard workshops (Nov 2025)

  Source: [Expert Portal](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal.html)
- Requirements:
  - requirement and approval statuses (May 2025)
  - Requirement Approver role (Sep 2025)
  - moving requirements between projects (Dec 2025)
  - AI-assisted requirement generation (Dec 2025)

  Source: [Expert Portal](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal.html)
- Tasks and risks:
  - task types (Oct 2025)
  - risk management for projects (Sep 2025)
  - "Executing clean core in projects" (Oct 2024)

  Source: [Expert Portal](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal.html)
- Documents:
  - AI-powered summarization (May 2026)
  - document versioning (Apr 2026)
  - external workflows (Jan 2026)
  - BTP Document Management Service integration

  Source: [Expert Portal](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal.html). AI-assisted document summary was listed as GA in SAP Business AI Q2 2026 highlights — [SAP News, Jul 2026](https://news.sap.com/2026/07/sap-business-ai-release-highlights-q2-2026/)
- Signavio → Cloud ALM process levels: solution process ("My Diagram"), solution process flow ("Default Flow"), solution activity ("My Task"). Requirements, features, user stories and test cases can attach at each level. SAP advises documenting at diagram level so later Signavio re-syncs keep attachments, and syncing early. Process modeling should happen only in Signavio — [SAP Learning – Synchronizing Signavio with Cloud ALM](https://learning.sap.com/courses/sap-activate-project-manager/synchronizing-sap-signavio-with-sap-cloud-alm)

**Test management (detail for the test manager)**

*Test cases*
- Mass upload of manual test cases
- Upload of SAP Best Practices test cases
- References such as data sheets and sample files
- Assignment to applications and interfaces
- Test cases with results cannot be deleted
- Scope, solution process and diagram assignments can be changed without duplicating test cases

Source: [SAP Community – What's New in Cloud ALM Test Management 2025](https://community.sap.com/t5/technology-blog-posts-by-sap/what-s-new-in-sap-cloud-alm-test-management-updates-for-2025/ba-p/14285726)

*Test plans*
- Copy test plans
- Test Plan Status filter
- Defects reported per test plan, with a defect trend/blocker view
- Features can be created or assigned from defects

Source: [SAP Community 2025](https://community.sap.com/t5/technology-blog-posts-by-sap/what-s-new-in-sap-cloud-alm-test-management-updates-for-2025/ba-p/14285726)

*Execution*
- Simple test sequences (execution order and dependencies)
- "Reset test" for clean re-execution
- Test cases assigned to the process hierarchy so status shows in process context

Source: [SAP Community 2025](https://community.sap.com/t5/technology-blog-posts-by-sap/what-s-new-in-sap-cloud-alm-test-management-updates-for-2025/ba-p/14285726)

*Test preparation (Expert Portal resources)*
- Tags in test plans (Aug 2025)
- Importing manual test cases (Apr 2025)
- Reassigning scope and solution process (Sep 2025)
- Manual testing PoC guide (updated Mar 2026)
- Orchestrating end-to-end tests (Sep 2024)
- Post-upgrade/regression testing (Oct 2023)
- From Solution Manager: selective test-step data transfer (Jul 2025) and a transition video (Nov 2025)

Source: [Expert Portal](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal.html)

*Release-by-release additions*
- Week 44/2025: the Processes app lets users create automated test cases for solution processes and manual test cases for process flow diagrams without switching to Test Preparation — [blue.works W44](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-44/)
- Week 28–30/2026: defect reporting gains a "By Solution Process" view; User Story Traceability gets new columns — [blue.works W28/30, 24 Jul 2026](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-28-and-30/)
- Week 34/2026: Feature Traceability adds Test Preparation and Test Execution columns; Test Execution Analysis uses a responsive table with Excel download; quality gate reporting opens selected gates in the Quality Gates app; test cases can be assigned to features in In Specification / In Implementation / In Testing; the Tester role (imp_cdm_Tester) needs only Project Viewer to set a feature to "Successfully Tested" — [blue.works W34, 21 Aug 2026](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-34-2/)
- Week 38/2026: "Select All" for importing up to 100 automated test cases. Week 40/2026: predefined Tester role, a Joule agent for requirements and user stories, retrofit status in Transport Analysis, owners for process hierarchy nodes. Week 42/2026: requirement approvers, advanced quality gate checklists with spreadsheet mass edit, automated assessments for two SAP Activate roadmaps, ATO transport deployment, deployment schedule tags — [blue.works tag page (week posts Aug–Oct 2026)](https://www.blue.works/en/tag/sap-cloud-alm/)

**Test automation options in and around Cloud ALM**

*Tricentis Test Automation for SAP (included)*
- Announced 2023: "available for all SAP customers with SAP Enterprise Support at no extra cost".
- Limits: up to 5 users and 5 agents; browser-based SAP apps (Fiori, Ariba, SuccessFactors). SAP GUI, API testing and TDM were "not yet supported" at launch.
- Hosted by SAP; it uses Tosca cloud public APIs as the engine.
- Activated from a tile in Cloud ALM Administration, followed by a four-step provisioning of a Tricentis tenant with SSO.

Source: [Tricentis blog, 6 Sep 2023](https://www.tricentis.com/blog/sap-selects-tricentis-as-test-automation-engine-sap-cloud-alm). In 2026 a competitor still describes the built-in edition as "limited to 5 users, 5 agents, and web-based SAP apps only" — [PerfecTwin blog (vendor, competitor)](https://blog.perfectwin.ai/sap-test-automation-tools-comparison-2026-guide)

*Upgrade path*
- SAP Test Automation by Tricentis: SaaS Solution Extension launched 7 Mar 2024. It "extends the Tricentis test automation already included in SAP Cloud ALM", is paid, and is "tested, validated, approved, marketed, sold and supported" by SAP — [Tricentis press release, 7 Mar 2024](https://www.tricentis.com/news/tricentis-launches-new-test-automation-solution-sap-solution-extension)
- Next step: SAP Enterprise Continuous Testing by Tricentis (see section 4).

*Other automation tools*
- SAP S/4HANA Cloud Test Automation Tool (Public Cloud), integrated with Cloud ALM (resources Apr 2024; 2023 how-tos on test plans, test data and test processes) — [Expert Portal](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal.html). An SAP Community blog covers the tool in release CE2602 (blocked from fetch) — [SAP Community CE2602](https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-sap/sap-s-4hana-cloud-test-automation-tool-in-sap-s-4hana-public-cloud-edition/ba-p/14301071)
- Third-party tools via the Cloud ALM test automation API:
  - UiPath Test Manager: bidirectional create/sync/execute of automated test cases; execution can start from Cloud ALM and results are viewable — [UiPath docs](https://docs.uipath.com/test-manager/automation-cloud/latest/user-guide/sap-cloud-alm)
  - SmartBear Reflect: embedded in Cloud ALM; results flow back to Test Management (11 Nov 2025, ALMathon winner) — [SmartBear](https://smartbear.com/blog/cloud-first-ai-powered-test-automation-in-sap-cloud-alm)
  - Worksoft Certify: Cloud ALM integration, per a competitor's blog — [PerfecTwin](https://blog.perfectwin.ai/sap-test-automation-tools-comparison-2026-guide)

*CBTA*
- CBTA (Solution Manager) is "fully dependent on SolMan", and Cloud ALM includes no CBTA successor (competitor blog) — [PerfecTwin](https://blog.perfectwin.ai/sap-test-automation-tools-comparison-2026-guide)

*AI-generated test scope*
- "Test Management Assistant": SAP event (21 Jul 2026) on Joule-orchestrated migration and modernization assistants that define a risk-based test scope, generate test cases for SAP Cloud ALM and create test data, for ECC → SAP Cloud ERP migrations — [SAP event page](https://www.sap.com/germany/events/2026-07-21-online-fast-track-migrations-with-test-management-assistant.html); [SAP asset "Orchestrate end-to-end tests with SAP Cloud ALM", 2026/05](https://www.sap.com/assetdetail/2026/05/548e7ad3-547f-0010-bca6-c68f7e60039b.html)

**Joule in Cloud ALM**
- An SAP Community post is titled "Joule with SAP Cloud ALM available to all SAP Cloud ALM customers" (content blocked from fetch) — [SAP Community](https://community.sap.com/t5/technology-blog-posts-by-sap/joule-with-sap-cloud-alm-available-to-all-sap-cloud-alm-customers/ba-p/14446406)
- Joule with SAP Cloud ALM must be activated through SAP for Me. Week 34/2026 added Joule summaries and filtering for Issues & Actions — [blue.works W34](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-34-2/)
- Week 36/2026: Joule can help with project setup. Week 40/2026: Joule agent for requirements and user stories. Week 42/2026: Joule-based Monitoring Configuration Agent (Early Adopter Care only) — [blue.works tag page](https://www.blue.works/en/tag/sap-cloud-alm/)

**Release and deployment management (change and deployment; cTMS)**

*Features app*
- Statuses: Not Planned → In Specification → In Implementation → In Testing → Successfully Tested → Ready for Production → Deployed.
- Releases are defined in deployment plans, which can be assigned to several projects.
- Several features can be mass-deployed to production.

*Transport handling*
- CTS, cTMS (SAP Cloud Transport Management) or ATO transports are assigned to a feature, one feature per transport.
- CTS transports can be released, and Transports of Copies can be created.
- CTS and cTMS transports deploy to target tenants, furthest-from-production first.
- "Deployment to Production is only possible in Feature status 'Ready for Production'."
- Cloud Integration Automation Service provides guided setup.

Source: [SAP Support – Release and Deployment Management](https://support.sap.com/ja/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal/change-deployment-mangement.html)

*Hybrid landscapes*
- cTMS covers BTP Cloud Foundry/Neo, Integration Suite Cloud Integration and API Management.
- On-prem S/4HANA and cTMS for Cloud Integration need the SAP Cloud ALM API service key.
- For S/4HANA on-prem / Private Cloud: transports are created inside a feature (Customizing or Workbench), the export tenant comes from the project's system group, and the fallback technical user comes from /SDF/ALM_SETUP.
- Deployment to QAS is synchronized first; PRD deployment can be scheduled.
- A Traceability View covers a three-tier landscape.

Source: [SAP Learning – Managing the hybrid deployment](https://learning.sap.com/courses/implementing-with-sap-cloud-alm/managing-the-hybrid-deployment-1)

*Retrofit and the ChaRM gap*
- Retrofit is built on a Cross System Object Lock (CSOL) foundation, with automatic retrofit planned for Q4 2025. Many customers still use SolMan ChaRM because functionality was missing in Cloud ALM — [Rev-Trac, ALM Summit APAC, Aug 2025](https://rev-trac.com/articles/inside-the-sap-alm-summit-apac-key-takeaways-and-summit-highlights/)
- Week 34/2026: sequence-dependent automatic retrofit for multiple source transports (SAP Note 3778082; ST-PI 740 SP33–35 or ST-PI 758 SP01/02). Week 28–30/2026: retrofit Display Conflicts and related fixes — [blue.works W34](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-34-2/); [blue.works W28/30](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-28-and-30/)

**Operations capabilities**

| Capability | What it does |
|---|---|
| Business Process Monitoring | Business KPIs, anomaly detection |
| Integration & Exception Monitoring | Correlates single messages into end-to-end flows, peer-to-peer and orchestrated |
| Job & Automation Monitoring | Status, start delay, runtime |
| Health Monitoring | SaaS health checks, BTP metrics, lightweight ABAP monitoring |
| Real User Monitoring | Front end and server side |
| Synthetic User Monitoring | Selenium-based scripts |
| Alert Management + Notification Management | Use-case-specific alert inboxes |
| Intelligent Event Processing | Central event router |
| Operations Automation | Triggers SAP Build Process Automation / SAP Automation Pilot |
| Business Service Management | Service Level Management, Event Calendar, SAP for Me events |
| Configuration & Security Analysis | Configuration and Change Database |

Source: [SAP Learning – Cloud ALM for Operations in a Nutshell](https://learning.sap.com/courses/operating-with-sap-cloud-alm/explaining-sap-cloud-alm-for-operations-in-a-nutshell)

*Release-by-release additions*
- 2025/2026 examples:
  - RUM changepoint detection (W44/2025)
  - Event Mesh metrics in Health Monitoring (W44/2025)
  - Dynamic Thresholds and AI-recommended KPI thresholds (W38/2026)
  - Product Package Solution monitoring (W34/2026)
  - Security score with the highest weight in the Operations Score (W32/2026)
  - standardized operations roles (W40/2026)

  Sources: [blue.works W44](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-44/); [blue.works tag](https://www.blue.works/en/tag/sap-cloud-alm/)

**APIs and openness**
- Example: the Dynatrace extension uses the SAP Cloud ALM **Analytics API** (about 20 analytics data providers, including health, jobs, integration, RUM/synthetic, SLA/SLO, and implementation data such as defects, tasks and tests). It also uses the **Raw Data Outbound APIs** for logs (exceptions, integration, events, jobs) and traces (RUM → distributed tracing, OTel). Prerequisite: a BTP service instance for the Cloud ALM APIs with scopes — [Dynatrace Hub](https://www.dynatrace.com/hub/detail/sap-cloud-alm)
- SAP lists "APIs for data transfer and third-party integration" as part of the SolMan transition offering — [SAP Support – Cloud ALM](https://support.sap.com/en/alm/sap-cloud-alm.html)

**Clean core measurement: RISE with SAP Methodology dashboards in Cloud ALM**
- The System View Dashboard ("Clean Core Dashboard") draws on:
  - SAP EarlyWatch Alert
  - Online Collectors (auto-update)
  - ABAP Call Monitor (SCMON, 7-day retention) with SUSG aggregation; 6–18 months of usage data is recommended
  - SAP Readiness Check, used alongside it

  Users need the role template `rdp_dashboard_ccSystemViewer`. Executive, Project and Landscape views are planned — [SAP Learning – RISE with SAP Methodology Dashboard](https://learning.sap.com/courses/introducing-the-rise-with-sap-methodology-for-sap-partners-and-customers/exploring-the-rise-with-sap-methodology-dashboard-1)
- Week 44/2025: the Extensibility section moved to **Clean Core Levels A–D**, replacing the 3-tier model. New KPI cards: Technical Debt Score, Execution of Customer Objects, Business Modifications, Unused Customer Objects, Clean Core Share, Level overview A–D — [blue.works W44](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-44/)
- Week 28–30/2026:
  - Business Modifications dashboard (reads SMODILOG)
  - Customer Objects "Unique Findings" view consolidating ATC results
  - AI-assisted Operations View analysis
  - "AI Assistance for Innovation Adoption" with Clean Core Integration and Data Quality

  Week 36/2026 harmonized the clean core object classifications, which can change extensibility KPI values — [blue.works W28/30](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-28-and-30/); [blue.works tag](https://www.blue.works/en/tag/sap-cloud-alm/)
- SAP open-source "Project Kernseife" (GitHub, May 2025): a customized ATC run based on SAP Clean Core tests plus a classification matrix for ABAP objects, aimed at measuring and governing clean core — [E3 Magazine, Sep 2026](https://e3mag.com/en/?p=166348)

**SAP Solution Manager 7.2: maintenance dates and transition**
- Mainstream maintenance ends end of 2027, including Focused Build and Focused Insights.
- Optional extended maintenance runs to 2030 for requirements, project and process management, test suite, change control, ITSM and landscape management. It costs nothing extra for customers on Business Suite 7 optional extended maintenance.
- After that, customer-specific maintenance with restrictions; perpetual licences remain.
- ABAP 7.40 mainstream maintenance ends 31 Dec 2027.

Source: [SAP ALM FAQ](https://support.sap.com/en/alm/faq.html); [SAP Solution Manager page](https://support.sap.com/solution-manager)
- SAP Note 3255311 (SolMan 7.2 extended maintenance details); SAP Note 52505 (support after end of maintenance) — [SAP Support – Transition to Cloud ALM](https://support.sap.com/en/alm/sap-cloud-alm/transition-to-sap-cloud-alm.html)
- SAP Focused Run's maintenance is independent of SolMan and stays in mainstream maintenance beyond 2027 — [SAP Solution Manager page](https://support.sap.com/solution-manager)

*Transition steps*
- Readiness Check for SAP Cloud ALM (analyses SolMan usage)
- SAP Activate roadmap "Transition to SAP Cloud ALM"
- Paid services
- Recommended order: (1) service and operations now; (2) implementation at your own pace; (3) optionally Focused Run

Source: [SAP Support – Transition](https://support.sap.com/en/alm/sap-cloud-alm/transition-to-sap-cloud-alm.html)
- Tools for transferring solution documentation and test cases were still marked "planned" on SAP's Cloud ALM page — [SAP Support – Cloud ALM](https://support.sap.com/en/alm/sap-cloud-alm.html). A selective test-step data transfer resource from SolMan exists (Jul 2025) — [Expert Portal](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal.html)
- Process Management can be extended with SAP Signavio Process Manager (separate licence). Test Management can use Tricentis integration, with the full Tricentis suite as a separately licensed extension — [SAP Support – Transition](https://support.sap.com/en/alm/sap-cloud-alm/transition-to-sap-cloud-alm.html)
- ALM Summit APAC (Aug 2025): SAP advised against a big-bang migration. Run Cloud ALM and SolMan in parallel, and keep SolMan for RISE implementations that still need advanced change and release management — [Rev-Trac](https://rev-trac.com/articles/inside-the-sap-alm-summit-apac-key-takeaways-and-summit-highlights/)

**Related deadlines: ECC / SAP ERP, private edition, transition option**
- Announced Feb 2025 for 2031–2033. It needs an ECC system on SAP HANA moved into the SAP ERP, private edition framework before end of 2030, with a second move to S/4HANA Cloud Private Edition before end of 2033. It is not purchasable before 2028.

  Source: [SAPinsider, 12 Feb 2025](https://sapinsider.org/analyst-insights/sap-provides-details-on-erp-transition-option/); conditions also reported by [Redress Compliance (secondary)](https://redresscompliance.com/sap-erp-private-edition-transition-option-extending-ecc-to-2033-and-what-it-means.html)

### Inferences
- For test managers, the hard deadline is end of 2027. Test-suite usage of SolMan (Test Suite, CBTA, test workbench) can run to 2030 only under extended maintenance. CBTA has no direct successor in Cloud ALM; automation moves to the Tricentis Test Automation tier, the S/4HANA Cloud Test Automation Tool (public cloud) or third-party tools through the Cloud ALM test automation API.
- Cloud ALM's 2026 releases close typical test-management gaps: feature-level test readiness, test sequences, quality gate checklists, defect-by-solution-process views and tester roles. Native defect workflow and test-data management remain thin compared with SolMan, Tricentis qTest or Jira.
- The SolMan → Cloud ALM transfer tooling for solution documentation and test cases is still only partly available. Plan manual or partner-tool migration (e.g. SNP is listed as a SolMan Transition Service Partner — [SNP](https://snpgroup.com/en/about-snp/partner/partnership-with-sap)).

### Gaps
- The official Cloud ALM API catalogue on the SAP Business Accelerator Hub could not be fetched (robots blocked). From background knowledge (unverified): APIs exist for projects, tasks, requirements, features, documents, process hierarchy, test management (manual test cases, test automation API for external tools), analytics and raw data outbound.
- The exact feature list of Joule in Cloud ALM (e.g. AI test case generation) could not be confirmed from the primary blog, which was blocked.
- No source was found on whether SAP extended SolMan maintenance beyond 2030 or tied it to the 2031–2033 ERP transition option.
- No Cloud ALM-native test data management capability was found.

---

## 3. SAP Signavio portfolio, SAP Process Navigator, SAP Best Practices / Activate Roadmap Viewer

### Takeaway
SAP Signavio (acquired 2021) is sold as the Process Transformation Suite:
- **Process Manager**: modeling, the successor of Process Modeler
- **Process Intelligence**: process mining
- **Process Insights**: ST-PI/ST-A/PI-based KPI benchmarking via Cloud ALM; a discovery edition is included in RISE
- **Process Collaboration Hub**: publishing
- **Journey Modeler**: customer journeys
- **Process Governance**: workflows
- **Process Transformation Manager**: value/transformation management
- Process Explorer / Process AI

SAP Signavio Process Navigator is the free successor of the SAP Best Practices content library in SAP for Me. It holds solution scenarios, processes, test scripts and setup instructions. Joule Agents for Signavio became GA in Q1 2026.

### Cited Findings
- The suite lists: SAP Signavio Process Manager, Process Intelligence, Process Insights, Journey Modeler, Process Collaboration Hub, Process Transformation Manager, Process Governance, Process Explorer, and "Process AI for SAP Signavio solutions" — [Signavio release notes](https://signavio.com/release-notes)
- Renamed 18 Oct 2021:
  - SAP Process Modeler by Signavio → SAP Signavio Process Modeler (now marketed as Process Manager)
  - SAP Process Intelligence by Signavio → SAP Signavio Process Intelligence
  - SAP Workflow Accelerator by Signavio → SAP Signavio Process Governance
  - SAP Journey Modeler by Signavio → SAP Signavio Journey Modeler
  - SAP Process Collaboration Hub by Signavio → SAP Signavio Process Collaboration Hub

  Source: [Signavio news](https://www.signavio.com/news/sap-signavio-products-new-names-same-great-experience)

**SAP Signavio Process Insights**
- Cloud solution on SAP BTP. ST-PI and ST-A/PI plug-ins in SAP ERP / S/4HANA collect performance data, which goes to a data sink over an OData API through an HTTP connection set up in the **SAP Cloud ALM framework**. No Cloud Connector is used.
- More than 1,000 built-in metrics, industry benchmarking, daily updates. Use cases can be handed to Process Intelligence for deeper, cross-system analysis. It can support the S/4HANA business case.

Source: [SAP PRESS blog](https://blog.sap-press.com/what-are-the-benefits-of-sap-signavio-process-insights)
- The discovery edition offers a free one-time data load, and Process Insights is the only Signavio component outside the additional-cost list — [SAP Learning](https://learning.sap.com/courses/introducing-the-rise-with-sap-methodology-for-sap-partners-and-customers/working-with-the-integrated-toolchain)

**SAP Signavio Process Navigator**
- Free service in SAP for Me (Services & Support → ALM tab).
- Content: solution scenarios (e.g. Lead to Cash), solution processes, flow diagrams, solution activities, test scripts, setup instructions, applications and integrations. Structured on SAP's EA methodology.

Source: [SAP Community – Process Navigator what's new](https://community.sap.com:443/t5/technology-blogs-by-sap/sap-signavio-process-navigator-what-s-new/ba-p/13573884)
- Signavio Process Navigator is "the process library" with high-level diagrams for Cloud ALM, with the Cloud ALM Implementation Expert Portal alongside it — [SAP Learning – Leveraging best practices for Cloud ALM](https://learning.sap.com/courses/transition-from-sap-solution-manager-to-sap-cloud-alm/leveraging-best-practices-for-sap-cloud-alm)
- Tricentis Test Automation for SAP uses process designs from SAP Signavio Process Navigator to generate tests in the Explore phase — [Tricentis ShiftSync](https://shiftsync.tricentis.com/testing-development-methodologies-69/integrated-toolchain-in-rise-with-sap-a-deep-dive-into-tricentis-role-2139)

**2025–2026 Signavio innovations**
- GA Q4 2025:
  - AI-assisted transformation advisor
  - AI-assisted process conformance check (works on unstructured sources)
  - process context analyzer
  - AI-assisted process analyzer (natural-language process mining)
  - Cloud ALM integration (near real-time mapping)
  - SolMan sync improvements
- GA Q2 2025: automated root cause analysis; value analysis extended to Process Transformation Manager and Process Insights

Source: [SAP innovation guide BTM](https://www.sap.com/events/sapphire/innovation-guide/business-transformation-management.html)
- Joule Agents, GA Q1 2026: Screen Guide Agent, Value Case Creation Agent, Dashboard Analyzer Agent, Process Content Recommender Agent, Workspace Administration Agent. The AI transformation advisor connects to Process Insights — [SAP News, 11 Nov 2025](https://news.sap.com/2025/11/leanix-signavio-walkme-sap-transformation-excellence-summit/)
- Q2 2026 GA: AI-assisted context analyzer, text-to-event matching and sentiment analysis — [SAP News, Jul 2026](https://news.sap.com/2026/07/sap-business-ai-release-highlights-q2-2026/)
- SAP Signavio Process Consultant Agent is used by Joule Studio for business context (May 2026) — [SAP News](https://news.sap.com/2026/05/new-joule-studio-enterprise-scale-agentic-development/)

**SAP Activate roadmaps in Cloud ALM**
- Cloud ALM Week 42/2026 added automated assessments for two SAP Activate roadmaps, and Cloud ALM projects carry Activate roadmap phases, milestones and quality gates — [blue.works tag](https://www.blue.works/en/tag/sap-cloud-alm/); [SAP Learning](https://learning.sap.com/courses/introducing-the-rise-with-sap-methodology-for-sap-partners-and-customers/working-with-the-integrated-toolchain)

### Inferences
- In a typical RISE project, Process Navigator content (Best Practices) gets imported into Signavio Process Manager (where licensed) or directly into Cloud ALM scope. It then becomes the basis for fit-to-standard, requirements and test case derivation, including SAP Best Practices test scripts uploadable into Cloud ALM test cases.

### Gaps
- Current status of SAP Activate Roadmap Viewer and SAP Best Practices Explorer (retired or redirected to Process Navigator) was not verified in this session. Background knowledge (unverified): Best Practices Explorer content moved to SAP Signavio Process Navigator (2023), while Roadmap Viewer remains available, with roadmaps also importable into Cloud ALM.
- No 2026 Signavio release notes were retrievable; the public release-notes page showed only 2023 entries.
- The former name of Signavio Process Insights ("SAP Process Insights", rebranded around 2022) is background knowledge, unverified here.

---

## 4. SAP LeanIX (EAM) and its integration with Signavio and Cloud ALM; AI agents and MCP

### Takeaway
SAP LeanIX (acquired 2023) is SAP's enterprise architecture management SaaS: fact-sheet meta model, application portfolio, TCO, technology risk. In the toolchain it:
- syncs initiatives with Cloud ALM projects (Cloud ALM leads)
- discovers interfaces and systems from Cloud ALM
- exchanges applications and processes with Signavio (Signavio leads processes)

Its 2025–2026 AI stack:
- **AI Agent Hub** (agent inventory/governance, GA)
- **EA Assistant** (bulk updates, NL search, web research)
- **MCP server** (GA Nov 2025; write access to fact sheets from 1 Oct 2026)
- Enterprise Content Research Agent (GA Q2 2026)
- AI-assisted architecture guidance

No primary source was found for a distinct product called "Architecture AI".

### Cited Findings
- LeanIX has a standard meta model with 12 fact sheet types. Its integrations with Signavio and Cloud ALM are configured separately, each one-way or bidirectional — [SAP Learning – data models](https://learning.sap.com/courses/sap-activate-project-manager/synchronizing-data-models-across-sap-leanix-sap-signavio-and-sap-cloud-alm)
- SAP acquired LeanIX in Oct 2023 for about €1.2bn (secondary source) — [SAVIC (partner blog)](https://www.savictech.com/insights/sap-leanix-enterprise-architecture-ai-autonomous-enterprise-2026/); see also [TechTarget](https://www.techtarget.com/searchsap/news/366551416/SAP-acquires-enterprise-architecture-vendor-LeanIX)
- AI Agent Hub: GA, manages AI agents across their lifecycle — [SAP BTM page](https://www.sap.com/sea/products/business-transformation-management.html). It discovers custom, Joule and third-party agents, with an agent radar report and adoption dashboards — [SAP News Nov 2025](https://news.sap.com/2025/11/leanix-signavio-walkme-sap-transformation-excellence-summit/)
- MCP server: GA (post 4 Nov 2025) for all LeanIX customers, documented at help.sap.com/docs/leanix/ea/mcp-server. Supports Copilot Studio, Cline, Claude Desktop and custom LLMs — [LeanIX blog](https://www.leanix.net/en/blog/mcp-server-for-sap-leanix-solutions)
- MCP write capabilities for transformations, initiatives and milestones were planned for end of Q1 2026. AI agent/MCP discovery sources now include AWS Bedrock Agents/AgentCore and Azure API Center MCP servers. The LeanIX Academy moved to SAP Learning (offline 28 Feb 2026), and certifications became fee-based with 12-month renewal — [LeanIX product update Jan 2026](https://updates.leanix.net/announcements/ann_ZMxatUaA13X19)
- August 2026:
  - EA Assistant bulk updates, natural-language search and web research with citations
  - MCP progressive tool discovery (at least 40% fewer initial tokens)
  - from 1 Oct 2026, AI agents can create, update and delete fact sheets through the MCP server
  - Poll API deprecated Mar 2027; Documents API v1 deprecated Jul 2027

  Source: [LeanIX product update Aug 2026](https://updates.leanix.net/announcements/ann_YpELBYEkEEMTG)
- Q2 2026 GA: Enterprise Content Research Agent (LeanIX, Confluence, SharePoint), AI-assisted EA decision management, AI-assisted fact sheet calculations, AI-assisted automation creation — [SAP News Q2 2026](https://news.sap.com/2026/07/sap-business-ai-release-highlights-q2-2026/)
- AI-assisted architecture guidance: GA Q3 2025 per the innovation guide — [SAP innovation guide](https://www.sap.com/events/sapphire/innovation-guide/business-transformation-management.html). The Jan 2026 product update says it was "technically ready", with release depending on data management issues — [LeanIX update Jan 2026](https://updates.leanix.net/announcements/ann_ZMxatUaA13X19). These two sources conflict on timing.
- Application TCO features (cost KPIs, configurable calculations), GA Q3 2025; self-build software discovery from GitHub — [SAP innovation guide](https://www.sap.com/events/sapphire/innovation-guide/business-transformation-management.html); [SAP News Nov 2025](https://news.sap.com/2025/11/leanix-signavio-walkme-sap-transformation-excellence-summit/)
- A partner blog claims "Custom Code Intelligence" imports S/4HANA Readiness Check results into LeanIX (secondary, unverified with SAP) — [SAVIC](https://www.savictech.com/insights/sap-leanix-enterprise-architecture-ai-autonomous-enterprise-2026/)

### Inferences
- In Discover/Prepare, LeanIX is the entry tool for application rationalisation and initiative planning. The Cloud ALM project created from a LeanIX initiative becomes the execution container, so test managers see LeanIX mainly as the source of interface and application inventories that feed integration test scope.

### Gaps
- No SAP primary source confirms a product named "LeanIX AI agent" or "Architecture AI" in 2026. The closest primary names are AI Agent Hub, EA Assistant, AI-assisted architecture guidance and the MCP server.

---

## 5. WalkMe (digital adoption) and SAP Enable Now status

### Takeaway
SAP completed the WalkMe acquisition on **12 Sep 2024** (about US$1.5bn, US$14/share). WalkMe is the BTM digital adoption platform, with AI features and SAP integrations (SuccessFactors, Ariba, Cloud ERP) and a learning product, **WalkMe Learning Arc** (GA 8 Dec 2025). **SAP Enable Now** (formerly SAP Workforce Performance Builder) is being phased out:
- "evolves into WalkMe's AI-first learning solution"
- last renewal 30 Apr 2027 (secondary sources)
- support at the latest until 30 Nov 2030 (secondary sources)

### Cited Findings
- SAP completed the acquisition on 12 Sep 2024 at US$14.00/share, an equity value of about US$1.5bn. WalkMe AI is planned to enhance Joule — [WalkMe press release](https://www.walkme.com/news-releases/sap-completes-acquisition-of-walkme/)
- SAP product page: "SAP Enable Now evolves into WalkMe's AI-first learning solution". SAP Workforce Performance Builder was the earlier name — [SAP Enable Now page](https://www.sap.com/uk/products/hcm/enable-now.html)
- Enable Now Cloud subscriptions cannot be renewed or extended from 30 Apr 2027. Existing contracts stay supported until their end date, at the latest until 30 Nov 2030. This comes from a WalkMe partner and cites no SAP Note — [McCoy & Partners](https://mccoy-partners.com/en/updates/sap-enable-now-is-being-phased-out-what-does-this-mean-for-your-organization)
- Also reported:
  - WalkMe Learning Arc GA 8 Dec 2025
  - the original renewal deadline of 30 Mar 2026 was pushed to 30 Apr 2027
  - SAP Companion removed, and the product renamed "SAP Enable Now, Digital Learning Edition"
  - no new development, only fixes
  - Enable Now simulations can be imported into WalkMe, with the Producer bridge
  - Learning Arc expected near parity around Q4 2026 (author's estimate)

  Source: [enablenowexpert.com (independent consultant blog)](https://enablenowexpert.com/?p=2943)
- WalkMe roadmap: cross-app intelligence GA Q4 2025; AI digital learning platform by end of 2025; SuccessFactors and Ariba integrations GA; SAP Cloud ERP integration expected GA Q4 2025 — [SAP innovation guide](https://www.sap.com/events/sapphire/innovation-guide/business-transformation-management.html)
- Q2 2026 GA: AI knowledge indexing, AI knowledge referencing, Pinned AI. On-demand AI is in Early Adopter Care — [SAP News Q2 2026](https://news.sap.com/2026/07/sap-business-ai-release-highlights-q2-2026/)
- WalkMe and Enable Now are additional-cost items, not included in RISE — [SAP Learning](https://learning.sap.com/courses/introducing-the-rise-with-sap-methodology-for-sap-partners-and-customers/working-with-the-integrated-toolchain)

### Inferences
- Projects starting in 2026 should not plan new Enable Now content for go-lives after 2027. End-user training and test documentation (simulations) should target WalkMe or Learning Arc.

### Gaps
- No official SAP Note or announcement text for the Enable Now dates was retrieved; both date sources are secondary.

---

## 6. Testing: Tricentis portfolio (SAP Solution Extensions), LiveCompare / Change Impact Analysis, Cloud ALM test automation, eCATT, test data management, agentic testing 2025/2026

### Takeaway
Tricentis tools sold by SAP as Solution Extensions:

| Product | Based on / function |
|---|---|
| SAP Enterprise Continuous Testing by Tricentis (ECT) | Tosca-based, cloud-native; codeless, model-based; agentic test generation via SAP AI Units since May 2026 |
| SAP Change Impact Analysis by Tricentis | LiveCompare + SeaLights for ABAP |
| SAP Enterprise Performance Testing by Tricentis | NeoLoad |
| SAP Enterprise Data Integrity Testing by Tricentis | Data validation |

The earlier SAP Test Automation by Tricentis (Mar 2024) sits between the free Cloud ALM-embedded tier and ECT. In March 2026 Tricentis launched an Agentic Quality Engineering Platform (AI Workspace; Agentic Test Automation for Tosca, with SAP GUI and Fiori support) and in July 2026 it acquired Tabnine.

### Cited Findings

**Product lineup and SAP channel**
- Tricentis SAP page lists:
  - SAP (Enterprise) Continuous Testing: codeless, model-based, AI-assisted execution across SAP and connected apps
  - SAP Change Impact Analysis: what changed, what it affects, which tests matter
  - SAP Enterprise Data Integrity Testing: validates data across migrations, integrations and reports
  - SAP Enterprise Performance Testing: simulates user load

  Platform products named: Tosca (E2E testing), qTest (test management), LiveCompare (change analytics for SAP), NeoLoad (performance), SeaLights (quality analytics) — [Tricentis SAP page](https://www.tricentis.com/sap)
- SAP ECT store page: SaaS, testing across SAP and third-party systems, model-based codeless automation, risk-based test plans driven by change impact analysis and test data, business-user recording, one production tenant. Licensed "in blocks of 1 Connections", 1–5 year terms — [SAP ECT product page](https://www.sap.com/products/technology-platform/enterprise-continuous-testing.html)
- SAP Change Impact Analysis by Tricentis store page: SaaS that compares the current SAP system with proposed custom or standard updates, flags risks with AI, prioritises tests, auto-creates test execution lists, and lets developers drill into code differences. Integrates with ECT. Licensed in 1 GB increments, one production tenant — [SAP Change Impact Analysis page](https://www.sap.com/swiss/products/technology-platform/change-impact-analysis.html)
- LiveCompare:
  - maps each transport to the tests that validate it
  - traces dependencies across objects, custom code, integrations and processes
  - auto-generates execution lists per transport bundle
  - reports test gaps
  - S/4HANA migration risk assessment aligned to SAP Activate
  - handles transports, ChaRM IDs, conversions and consolidations
  - integrates with Jira, Azure DevOps, ServiceNow, qTest and Tosca (logos show SolMan and Cloud ALM)

  LiveCompare together with SeaLights for ABAP is included in SAP Change Impact Analysis by Tricentis — [Tricentis LiveCompare](https://www.tricentis.com/products/impact-analysis-livecompare)
- LiveCompare's Smart Impact app flags high-risk objects. Release Assurance and Test Audit apps support post-go-live testing. It identifies customizations to refactor for clean core — [Tricentis ShiftSync](https://shiftsync.tricentis.com/testing-development-methodologies-69/integrated-toolchain-in-rise-with-sap-a-deep-dive-into-tricentis-role-2139)

**Timeline of SAP-Tricentis announcements**
- 2023: Tricentis Test Automation for SAP embedded in Cloud ALM, free with Enterprise Support, 5 users / 5 agents, browser apps — [Tricentis blog 2023](https://www.tricentis.com/blog/sap-selects-tricentis-as-test-automation-engine-sap-cloud-alm)
- 7 Mar 2024: SAP Test Automation by Tricentis, a paid SaaS Solution Extension extending the Cloud ALM-embedded automation — [Tricentis PR](https://www.tricentis.com/news/tricentis-launches-new-test-automation-solution-sap-solution-extension)
- 9 May 2025 (ahead of Sapphire 2025): SAP ECT rebuilt on a cloud-native architecture and integrated with SAP Cloud ALM. Added zero-footprint execution, cloud test data, a new Business Flow Designer, and planned Tosca Copilot for SAP Fiori and autonomous test creation during process design. SAP Enterprise Performance Testing and SAP Change Impact Analysis were named — [BusinessWire, May 2025](https://www.businesswire.com/news/home/20250509956136/en/Tricentis-Expands-Capability-for-Integrated-Toolchain-Within-RISE-with-SAP-to-Accelerate-Cloud-and-AI-driven-Transformation/)
- 18 Feb 2026 (Tosca 2612): Agentic Test Automation for Tosca, with custom agents for enterprise apps including SAP; it reuses and merges existing modules. Requires Tosca cloud or hybrid deployment; customers get a limited number of prompts — [Tricentis ShiftSync](https://shiftsync.tricentis.com/product-updates/new-agentic-test-automation-capabilities-for-tosca-2612)
- March 2026: Agentic Quality Engineering Platform (AI Workspace) announced:
  - Agentic Test Automation (Tosca) is sold as ECT on SolEx; generates SAP tests from plain-language requirements with "intelligent reuse"; supports SAP GUI and Fiori on Tosca's engine
  - Agentic Performance Testing (NeoLoad) is sold as SAP Enterprise Performance Testing
  - Agentic Quality Intelligence (SeaLights) is upcoming
  - Early-adopter claims: 8x faster test creation (about 40 to 5 min)

  Source: [Tricentis blog, 31 Mar 2026](https://www.tricentis.com/blog/agentic-ai-sap-testing-tricentis)
- 19 May 2026 (Sapphire Orlando/Madrid): "Tricentis Releases Agentic AI Testing for SAP Business Transformation". Agentic AI is brought into ECT as "part of SAP's Agent-led toolchain" through the SAP Solution Extension: natural-language E2E test generation, QA agents, self-healing tests, consumption of **SAP AI Units**. Enhanced toolchain integration reuses Signavio process models through Cloud ALM. No GA date was stated — [Tricentis news, 19 May 2026](https://www.tricentis.com/news/tricentis-releases-agentic-ai-testing-sap-business-transformation); [DevOps Digest](https://devopsdigest.com/tricentis-releases-sap-enterprise-continuous-testing)
- Sapphire 2026 customer claims (vendor-published): IBM RISE for 275,000 users with 60,000+ automated tests; Siemens Healthineers with testing integrated with Cloud ALM — [Tricentis Sapphire recap](https://www.tricentis.com/conference-highlights/sapphire-recap)
- 30 Jul 2026: Tricentis acquired Tabnine (price not disclosed). Its Enterprise Context Engine (knowledge graph) goes into the Agentic QE Platform, deployable on-prem, VPC or air-gapped. Agentic Test Automation supports SAP GUI, with early deployments reporting up to 60% of regression grids automated (vendor claims) — [SAPinsider](https://sapinsider.org/blogs/tricentis-tabnine-acquisition-agentic-sap-testing/)

**Other testing tools**
- Custom code ABAP AI: the "SAP S/4HANA custom code migration agent" (Joule for Developers, ABAP AI) is GA per Q2 2026. It runs readiness checks, auto-applies high-confidence fixes and adds lower-confidence proposals as comments — [SAP News Q2 2026](https://news.sap.com/2026/07/sap-business-ai-release-highlights-q2-2026/). SAP claimed the Q1 2026 ABAP AI release cuts "25% in testing effort" — [SAPinsider](https://sapinsider.org/articles/joule-expands-from-copilot-to-cross-suite-execution-engine/)
- Competing or complementary tools named with Cloud ALM connectivity: Worksoft Certify (Cloud ALM integration; v14.5 test data provisioning), Panaya (impact analysis), UiPath Test Manager, SmartBear Reflect. OpenText UFT One has no Cloud ALM integration, per a competitor — [PerfecTwin](https://blog.perfectwin.ai/sap-test-automation-tools-comparison-2026-guide); [UiPath](https://docs.uipath.com/test-manager/automation-cloud/latest/user-guide/sap-cloud-alm); [SmartBear](https://smartbear.com/blog/cloud-first-ai-powered-test-automation-in-sap-cloud-alm)
- SNP Kyano "Manage" includes Validate, ALM Integrator and **Test Data Organizer**, relevant to test data and SolMan → Cloud ALM transition — [SNP](https://snpgroup.com/en/about-snp/partner/partnership-with-sap)

### Inferences

Tiered test-automation ladder for S/4HANA programs in 2026:

| Tier | Tool | Scope / licensing |
|---|---|---|
| 0 | Cloud ALM manual testing | Free |
| 1 | Tricentis Test Automation for SAP in Cloud ALM | Free; 5 users / 5 agents, browser-based |
| 1b | SAP S/4HANA Cloud Test Automation Tool | Public Cloud only |
| 2 | SAP Test Automation by Tricentis / SAP ECT | Paid SolEx; SAP GUI, Fiori, non-SAP, agentic generation using AI Units |
| — | SAP Change Impact Analysis by Tricentis (LiveCompare) | Risk-based scoping for conversions and continuous transports |
| — | SAP Enterprise Performance Testing (NeoLoad); SAP Enterprise Data Integrity Testing | Load and data testing |

Buying through SAP (Solution Extension) means SAP paper, SAP support and use of AI Units.

### Gaps
- **eCATT**: no 2026 source found on its status. Background knowledge (unverified): eCATT remains part of SAP NetWeaver/ABAP Platform and runs in S/4HANA on-prem/Private Cloud, but it is legacy, with no Cloud ALM integration, and is unsuitable for Fiori UI.
- **SAP Test Data Migration Server (TDMS)**: the SAP product page could not be fetched, and searches ran out before results came back. Background knowledge (unverified): TDMS 4.0 supports ECC and S/4HANA for time-/company-code-sliced client copies and scrambling, delivered through SAP DMLT services. Its exact maintenance end date and any successor were NOT verified. Tricentis ECT "cloud-based test data" and SNP Test Data Organizer are alternatives.
- **CBTA end of life** is tied to SolMan (end 2027 / 2030 EM), per a competitor blog only. No SAP primary source was found.
- GA date for ECT agentic generation, and AI Unit consumption rates for test generation, were not found.

---

## 7. Migration and readiness tools

### Takeaway
The standard S/4HANA move toolset:
- **SAP Readiness Check**: simplification items, custom code, add-ons, sizing, data volume, interfaces; also scenarios for Cloud ALM transition, ERP usage and data profiling, BW/4HANA etc.
- **Simplification Item Catalog / SI-Check**
- **Custom Code Migration app + ABAP Test Cockpit (ATC)**: now joined by the GA Joule "custom code migration agent"
- **Maintenance Planner + Software Update Manager (SUM 2.0 SP19)** with DMO and downtime-optimized conversion
- **RISE with SAP system transition workbench**: guided technical transition in RISE, at no extra cost
- **SAP S/4HANA Migration Cockpit**: "Migrate Your Data" app; staging tables via local or remote HANA schema, or direct transfer via RFC; included at no extra cost
- **SAP Business Transformation Center**: SaaS on SAP Cloud ALM/BTP; Digital Blueprint plus Lean Selective Data Transition; included in RISE / Enterprise Support; ECC source only; not for Public Cloud
- **Selective Data Transition Engagement** partners: cbs, Natuvion, SNP with SAP (DMLT)
- **SAP ADMM by Syniti**: data migration/quality SolEx in the toolchain
- **Joule for Consultants**: AI assistant, 35 AI Units per user per month

### Cited Findings

**SAP Readiness Check**
- Scenarios: S/4HANA conversion and upgrades, BW/4HANA conversion, Datasphere/BW Bridge, CX, SAP ERP usage and data profiling, SuccessFactors, SAP Cloud ALM, Supply Chain.
- Check areas: compatibility, custom code impact, simplification items, add-on compatibility, data volume management.
- Findings can be linked into Cloud ALM project/task management.

Source: [ASUG](https://www.asug.com/insights/your-sap-investment-unleashed-preparing-for-the-future-how-sap-readiness-check-simplifies-s-4hana-transition)
- Readiness Check 2.0 added effort ranking, interface analysis and business-partner data-quality counts — [SAP K4U deck, Jun 2020](https://assets.dm.ux.sap.com/webinars/sap-user-groups-k4u/pdfs/s4movetools.pdf)
- Readiness Check usage data profiling (UDP) is the prerequisite for the BTC Digital Blueprint. SAP Notes 3112362 (basis) and 3275056 (UDP enhancements) apply — [SAP Support – BTC](https://support.sap.com/ja/alm/sap-cloud-alm/transformation/btc.html). Since W28/30 2026, Maintenance Readiness Check analysis files can be uploaded as ZIP to BTC scoping — [blue.works W28/30](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-28-and-30/)

**Custom Code Migration app / ATC**
- The Custom Code Migration app (Fiori) uses ABAP Call Monitor usage data, prepares deletion transports and analyses the custom code still to adapt. A SaaS version on SAP Cloud Platform (Aug 2019) runs remote analysis against on-prem ERP — [SAP K4U deck 2020](https://assets.dm.ux.sap.com/webinars/sap-user-groups-k4u/pdfs/s4movetools.pdf)
- Joule "S/4HANA custom code migration agent" (ABAP AI): GA, Q2 2026 highlights — [SAP News](https://news.sap.com/2026/07/sap-business-ai-release-highlights-q2-2026/)
- ATC results are consolidated in the Cloud ALM "Customer Objects – Unique Findings" view (2026) — [blue.works W28/30](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-28-and-30/)

**SUM / DMO / conversion**
- SUM 2.0 SP19 covers AS ABAP targets ≥ 7.50; SUM 1.1 SP02 covers older targets. DMO combines update and migration to HANA. A "Downtime-optimized Conversion approach using SUM 2.0" exists for ECC → S/4HANA — [SAP SL Tools](https://support.sap.com/en/tools/software-logistics-tools.html)
- DMO-based downtime-optimized conversion moves work into uptime with delta replay (SAP Note 2293733). Example: a 17.7 TB Oracle system converted with about 24 h of technical downtime — [SAP K4U deck 2020](https://assets.dm.ux.sap.com/webinars/sap-user-groups-k4u/pdfs/s4movetools.pdf)
- RISE with SAP system transition workbench: step-by-step guided ERP transition into RISE ("golden path", uptime/downtime phases), encapsulating SL tools, with health and quality checks. Also used for lift and shift and HANA tenant copy. Included in RISE at no additional cost. Related items: Transformation Approach Finder, Digital Blueprint, Data Transition Validation — [SAP Support – STW](https://support.sap.com/en/alm/sap-cloud-alm/transformation/btc/stw.html)

**SAP S/4HANA Migration Cockpit**
- Fiori app "Migrate Your Data". Available on-prem, Private Cloud and Public Cloud, with deployment-specific migration objects; no extra cost. Uses the same APIs and validations as standard applications.
- Methods: (1) staging tables, either a local schema (XML/CSV templates) or a remote SAP HANA schema (ETL / SAP Data Services); (2) direct transfer from an SAP system via RFC, converting to the S/4 data model on load.

Source: [SAP Learning – Migration Cockpit](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-public-edition/introducing-the-sap-s-4hana-migration-cockpit_ca4ff972-d855-448b-a69a-42b2501d6ea7)
- Direct transfer has been available since 1909, on-prem staging since 1709 FPS01 — [SAP K4U deck 2020](https://assets.dm.ux.sap.com/webinars/sap-user-groups-k4u/pdfs/s4movetools.pdf)

**SAP Business Transformation Center**
- SaaS "focal point for all data transformation requirements": analysis, data scoping workshops, execution, post-transition testing.
- Targets ECC → S/4HANA on-prem and S/4HANA Cloud Private Edition; no plan for Public Edition. Only ECC can be the source. Does not replace SUM.
- First increment: Digital Blueprint (data specification document). Then Lean Selective Data Transition by company code.
- Included in SAP Cloud Service subscriptions, SAP Enterprise Support and RISE contracts.

Source: [SAP Support – BTC](https://support.sap.com/ja/alm/sap-cloud-alm/transformation/btc.html)
- Deployed on SAP Cloud ALM atop BTP. Lean Selective Data Transition was announced at Sapphire 2024 (ERP 6.0 → S/4HANA Cloud Private Edition). It removes obsolete legal entities and customer-specific data and covers ETL plus validation. BMW Group is a reference — [SAP News, 22 Jul 2024](https://news.sap.com/2024/07/serving-customers-better-lean-selective-data-transition/)
- 2026 BTC enhancements, all inside Cloud ALM:
  - Week 32: Chart of Accounts solution pattern for renaming/merging G/L accounts during SDT, Manage Value Mappings apps, Relevancy & Retention check, simulation mode for corrections
  - Week 34: Manage Cycles as the central control; Finance data quality error distribution
  - Week 36: Data Management Assistant with AI agents (Early Adopter Care)
  - Week 40: data preparation moved to uptime
  - Week 42: copy data assessment runs and related improvements
  - Weeks 28–30: Correction Approval Flow

  Sources: [blue.works tag](https://www.blue.works/en/tag/sap-cloud-alm/); [blue.works W34](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-34-2/); [blue.works W28/30](https://www.blue.works/en/sap-cloud-alm-whats-new-in-week-28-and-30/)
- The ASUG BTM deck notes that the Business Transformation Center offers a five-step transformation methodology — [ASUG deck Jan 2026](https://blog.asug.com/hubfs/Communities/SAPBusinessTransformationManagement/Decks%20to%20Download/BTM%20Slide%20Deck%2001.27.26%20(3).pdf)

**Selective Data Transition (partners)**
- The SAP Selective Data Transition Engagement was formed in 2020 with cbs, Natuvion, SAP and SNP. Partners use their own tools. SAP does not certify or endorse partner solutions, and runs Q-Gates only where SAP delivers. Example: a shell conversion with CoA harmonisation — [SAP Support – SDT Engagement](https://support.sap.com/en/offerings-programs/support-services/data-management-landscape-transformation/selective-data-transition-engagement.html)
- SNP: Kyano platform (Move: CrystalBridge, Crossway, Glue; Manage: Datafridge, Validate, ALM Integrator, Test Data Organizer, Outboard) and the BLUEFIELD approach. SAP Gold Partner and SolMan Transition Service Partner — [SNP](https://snpgroup.com/en/about-snp/partner/partnership-with-sap)

**SAP ADMM by Syniti**
- SaaS for connecting, preparing and validating data before load; ML and automation; waves, process areas and migration objects; project dashboard — [SAP ADMM page](https://www.sap.com/products/data-cloud/advanced-data-migration-software.html)
- Positioned as the migration/data component of the toolchain, with SAP Premium Certified Solution Extension status on the Syniti Knowledge Platform, and said to work with Signavio, LeanIX and Cloud ALM data (Aug 2026) — [SAPinsider](https://sapinsider.org/syniti-sap-admm-migration-data-governance/)

**Joule for Consultants**
- AI assistant grounded in SAP knowledge ("9+ TB", 3M+ non-public documents) plus customer content via SAP AI Core Grounding. Includes an ABAP expert model (250M lines of ABAP, 30M lines of CDS) and Expert Workspace. Flat-fee subscription sized in AI Units — [SAP Joule for Consultants page](https://www.sap.com/products/technology-platform/joule-for-consultants.html)
- Per user per month, 35 AI Units. 8 languages, 2-week content refresh. Agentic support for the RISE Methodology was planned (FAQ updated Jun 2025) — [SAPinsider FAQ](https://sapinsider.org/industry-insights/sap-joule-for-consultants-frequently-asked-questions)
- Q1 2026: citations panel, up to 10 document uploads, optional web search — [SAPinsider, Apr 2026](https://sapinsider.org/articles/joule-expands-from-copilot-to-cross-suite-execution-engine/)

**Sapphire 2026 migration agents**
- SAP added AI-led transformation to RISE, with AI migration agents and tooling for ECC / complex on-prem landscapes, positioned alongside Signavio and LeanIX. Executives discussed future project health monitoring, real-time views of agent usage and AI unit consumption, and ROI (partly directional) — [SAPinsider, May 2026](https://sapinsider.org/articles/sap-sapphire-2026-ai-agents-industry-workflows-cloud-migration/)

### Inferences
- From a test-management view:
  - Readiness Check / Simplification Items determine the functional regression scope of a conversion.
  - Custom Code Migration / ATC (and now the Joule agent) determine the custom code retest scope.
  - LiveCompare / Change Impact Analysis can turn both into a risk-based execution list.
  - BTC/SDT projects add data reconciliation testing (BTC has built-in validation and "post-transition testing").
  - Migration Cockpit loads need per-object validation and mock-load test cycles.

### Gaps
- Simplification Item Catalog (me.sap.com/sic) returned empty content, so details are background knowledge only (unverified): a searchable catalog of simplification items per target release, checked in the system by the Simplification Item Check framework (/SDF/RC_START_CHECK, SAP Note 2399707).
- Maintenance Planner, the Migration Object Modeler (LTMOM) and the deprecation of LTMC (replaced by the "Migrate Your Data" Fiori app from 2020) were not verified in this session.
- SAP DMLT's role versus BTC, and Natuvion / cbs tool names (e.g. Natuvion DCS, cbs ET Enterprise Transformer), were not verified.
- A GA date for SAP Joule for Consultants was not found. The product page metadata suggests late 2025, but that is not labelled GA.
