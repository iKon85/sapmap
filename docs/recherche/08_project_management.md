# Project Management in the SAP S/4HANA World (as of October 2026)

Scope: (A) how an S/4HANA implementation project is managed: SAP Activate / RISE with SAP Methodology, the project management functions of SAP Cloud ALM, the planning role of SAP Signavio and SAP LeanIX, and Jira/ADO. (B) project management as a business capability in S/4HANA: PS, EPPM, PPM, CPM, Investment Management, Enterprise Projects / Project Control, SAP Project and Resource Management, MRS, capital projects, and Joule.
Research date: 2026-10-24. The search budget was limited and several sap.com and SAP Help pages blocked fetching. Statements marked **[BACKGROUND – unverified]** come from prior knowledge and were not confirmed by a source in this session.

---

## A1. SAP Activate methodology and the RISE with SAP Methodology

### Takeaway
SAP Activate is still SAP's implementation framework, with six phases: Discover, Prepare, Explore, Realize, Deploy, Run. Since 2024/2025 SAP positions it as the "standardized framework" inside a wider **RISE with SAP Methodology**. That methodology adds an integrated toolchain (SAP Cloud ALM, SAP Signavio, SAP LeanIX, WalkMe, SAP Build/BTP), a **clean core success plan**, structured **quality gates (Q-Gates)** run in Cloud ALM and evaluated by the SAP Enterprise Support back office, and Joule assistance. Joule in the SAP Activate Roadmap Viewer became GA in July 2025. SAP's materials now describe the target as "SAP Business Suite" and "SAP Cloud ERP Private".

### Cited Findings
**Name and category**
- Category: implementation methodology / framework. SAP describes SAP Activate as "the framework within" the RISE with SAP Methodology, giving best-practice recommendations, guidelines and checkpoints across six phases. The RISE with SAP Methodology itself consists of "a standardized framework, an integrated toolchain, and expert guidance" for the cloud transition — [SAP Activate product page](https://www.sap.com/products/erp/activate-methodology.html)
- The six phases as SAP defines them today:
  - **Discover**: understand solution options, define scope at a high level.
  - **Prepare**: finalize the project plan, set up the environment, align the team.
  - **Explore**: run fit-to-standard workshops, confirm the solution design.
  - **Realize**: configure, build, test, validate.
  - **Deploy**: cut over, move to production.
  - **Run**: operate, support, optimize continuously.
  - Source: [SAP Activate product page](https://www.sap.com/products/erp/activate-methodology.html)
- The framework "builds on" **fit-to-standard and clean core** principles. The page mentions agile implementation cycles and test sprints — [SAP Activate product page](https://www.sap.com/products/erp/activate-methodology.html)
- SAP Activate covers deployment of SAP S/4HANA, SAP BTP and SAP SuccessFactors in cloud, on-premise or hybrid mode — [SAP Learning: Implementing with SAP Cloud ALM – Managing Projects with Distributed Teams](https://learning.sap.com/courses/implementing-with-sap-cloud-alm/managing-projects-with-distributed-teams)

**RISE with SAP Methodology (2024/2025 onward)**
- It combines "an enriched SAP Activate, a new onboarding offering, and enhancements to SAP Cloud ALM".
- It has its own high-level phases: **Discover and Evaluate, Prepare and Plan, Move and Deploy, Run and Innovate**. These are aligned with the milestones of an SAP Activate-based ERP deployment.
- Every RISE customer gets an **onboarding advisor** as the first human contact after signing.
- It applies to customers who signed the RISE contract "after April 1st". The year is not stated on the page; likely 2024 [BACKGROUND – unverified].
- Source for all four points: [SAP Learning: Introducing the RISE with SAP Methodology](https://learning.sap.com/learning-journeys/applying-the-rise-with-sap-methodology/introducing-the-rise-with-sap-methodology_e92c0a43-08e2-4f1f-a4c6-e7179ab4007b)
- Another SAP Learning course labels the framework phases "discover and onboard", "modernize and run" and "continuously innovate". It describes the methodology as the path from on-premise SAP ERP to **SAP Business Suite**, with the transformation tools in the **SAP Cloud ERP Private** package. Inconsistency: SAP sources label the high-level phases differently, but the six Activate phases are the same everywhere — [SAP Learning: Exploring the RISE with SAP Methodology](https://learning.sap.com/courses/introducing-the-rise-with-sap-methodology-for-sap-partners-and-customers/exploring-the-sap-business-suite-methodology-and-sap-cloud-erp-private)
- The standardized framework consists of "guardrails and clear steps" based on **enhanced SAP Activate road maps tailored for RISE with SAP**, with task descriptors, accelerators, a clean core success plan and quality gates (SAP document dated 2025/02) — [SAP: The RISE with SAP Methodology standardized framework](https://www.sap.com/documents/2025/02/3445d699-f67e-0010-bca6-c68f7e60039b.html)
- "The methodology is built on a clean core strategy." "SAP Joule and AI are integral components of the RISE with SAP Methodology." Joule for Consultants and Joule for Developers support it, and the Digital Discovery Assessment supports the Discover phase — [SAP Learning: Exploring the RISE with SAP Methodology](https://learning.sap.com/courses/introducing-the-rise-with-sap-methodology-for-sap-partners-and-customers/exploring-the-sap-business-suite-methodology-and-sap-cloud-erp-private)

**Clean core success plan and quality gates (Q-Gates)**
- The clean core success plan lists tasks across the SAP Activate phases and is tracked digitally in SAP Cloud ALM. Task and milestone status appears in the **"Clean Core Run book"** on the Cloud ALM overview tab, and customers can add recommendations to it as tasks.
- A Q-Gate is a task at the end of each SAP Activate phase and is executed in SAP Cloud ALM.
- Once completed, the Q-Gate goes to the **SAP Enterprise Support Backoffice**. The back office produces a report with two parts: recommendations based on the questionnaire answers, and fact-based recommendations drawn from **system telemetry**. Reports are delivered into the customer's Cloud ALM "services" function and generated via the internal tool **XALM**.
- Source for the three points above: [SAP Learning: Introducing the RISE with SAP Methodology](https://learning.sap.com/learning-journeys/applying-the-rise-with-sap-methodology/introducing-the-rise-with-sap-methodology_e92c0a43-08e2-4f1f-a4c6-e7179ab4007b)
- "Onboarding and the clean core success plan have been enhanced with structured quality gate execution" — [SAP Learning: Exploring the RISE with SAP Methodology](https://learning.sap.com/courses/introducing-the-rise-with-sap-methodology-for-sap-partners-and-customers/exploring-the-sap-business-suite-methodology-and-sap-cloud-erp-private)
- Clean core governance in projects uses **tag groups**. Tags are assigned to processes, requirements, user stories and features to separate clean from non-clean elements, and they are monitored in traceability dashboards and project analytics — [SAP Learning: Managing Projects and Clean Core Success Plan with SAP Cloud ALM](https://learning.sap.com/courses/validating-business-transformations-leveraging-integrated-transformation-tools-solutions/managing-projects-and-clean-core-success-plan-with-sap-cloud-alm)

**SAP Activate Roadmap Viewer**
- Lives in SAP for Me at https://me.sap.com/roadmapviewer. It provides roadmaps with phases, deliverables, tasks, workstreams and accelerators. Roadmaps are grouped into four types: Cloud Specific Methodology, On-Premise Specific Methodology, Upgrade Methodology, and General.
- **Joule in the Roadmap Viewer** answers natural-language questions on Activate guidance and has been **GA for all SAP for Me users since July 2025**. It currently supports the roadmaps for **SAP Cloud ERP Private Edition** and **SAP S/4HANA Cloud Public Edition (3-system landscape)**.
- Joule prerequisites: SAP Universal ID, SAP for Me access, Identity Authentication, an SAP BTP enterprise global account, and Cloud Identity Services entitlements.
- Source for the three points above: [SAP Learning: Accessing Content (Discovering SAP Activate)](https://learning.sap.com/courses/discovering-sap-activate-implementation-tools-and-methodology/accessing-content)
- Related tools named by SAP: SAP Cloud ALM (task content, accelerators, quality gates per phase), the Digital Discovery Assessment, the SAP Signavio Process Navigator (process models, scope item fact sheets, test scripts) and SAP Learning Journeys — [SAP Activate product page](https://www.sap.com/products/erp/activate-methodology.html); [SAP Learning: Accessing Content](https://learning.sap.com/courses/discovering-sap-activate-implementation-tools-and-methodology/accessing-content)

**SAP Joule for Consultants (AI-assisted Activate / implementation)**
- Category: AI assistant for SAP consultants and implementers, grounded in SAP knowledge. SAP cites "9+ TB of SAP knowledge, 100+ certifications, 3M+ non-public documents" and an ABAP model trained on 250M lines of ABAP and 30M lines of CDS.
- Features: **Expert Workspace** (persistent context, custom instructions), **Custom Knowledge Grounding** (a firm's own methodology content via SAP AI Core grounding), a grounding benchmark, and code comprehension.
- Licensing: sold only as part of the "SAP Joule for Consultants package". Subscription, flat-fee metric, consumption-based pricing in **AI Units**. Product page valid from 2025-11-18.
- Source for the three points above: [SAP Joule for Consultants product page](https://www.sap.com/products/technology-platform/joule-for-consultants.html)
- Q1 2026 additions: a citations panel, upload of up to 10 documents into a chat, and optional web search with source attribution — [SAPinsider: Joule expands from copilot to cross-suite execution engine](https://sapinsider.org/articles/joule-expands-from-copilot-to-cross-suite-execution-engine/)
- An activation guide was published in 2026/03 — [SAP Joule for Consultants Activation guide](https://www.sap.com/documents/2026/03/3a07bbdb-437f-0010-bca6-c68f7e60039b.html)
- Example: ABeam Consulting uses it on 19+ use cases across implementation and AMS. ABeam self-reports 77% operational efficiency gains, and document upload lets consultants add customer specs (SAP News, 2026-08-12) — [SAP News: ABeam accelerates project delivery with SAP Joule for Consultants](https://news.sap.com/sea/2026/08/abeam-consulting-accelerates-project-delivery-with-sap-joule-for-consultants/)

### Inferences
- For a new S/4HANA Cloud Private / RISE project in 2026, the practical setup is: SAP Activate roadmap (RISE-tailored) imported into SAP Cloud ALM, the clean core success plan, and Q-Gates at each phase end that SAP's Enterprise Support back office evaluates with telemetry. The test manager should expect Q-Gate checklist items on test readiness, such as Realize-to-Deploy.
- SAP has not renamed SAP Activate. Rather, "RISE with SAP Methodology" is the umbrella name, and "SAP Business Suite methodology" wording is starting to appear in SAP Learning content.

### Gaps
- No official list of "clean core KPIs" was found. SAP's clean core dimensions (processes, extensions, data, integrations, operations) and the "clean core level" A–D model are **[BACKGROUND – unverified]** here.
- No official 2026 SAP Activate release notes were retrievable (the SAP Community blog was blocked by robots).
- No standalone SAP feature called "AI-assisted Activate" was found beyond Joule in the Roadmap Viewer and Joule for Consultants.

---

## A2. SAP Cloud ALM – project management functions (Implementation)

### Takeaway
SAP Cloud ALM for Implementation covers the full project management backbone of an SAP project: projects and programs, roles, timeboxes (phases, sprints, milestones), tasks with list, Gantt and Kanban views, deliverables, quality gates, the SAP Activate roadmap import, risks, release and deployment plans, and an analytics layer (Overview page, burn-up, cross-project timeline). It is free for RISE and Enterprise Support customers and offers public APIs (Projects, Tasks, Documents, Analytics) for integrating third-party tools.

### Cited Findings
- **Positioning**: Cloud ALM is project and task management software with "core features of modern tools, such as Asana, Trello, and Jira", has "no additional license fees", and has built-in integration with SAP Activate and the SAP landscape — [SAP Learning: Managing Projects with Distributed Teams](https://learning.sap.com/courses/implementing-with-sap-cloud-alm/managing-projects-with-distributed-teams)
- **Roadmap import**: "Choose your Roadmap" brings SAP Activate content into a project in one step: tasks, deliverables, roles, quality gates, accelerators and best-practice processes — [SAP Learning: Managing Projects with Distributed Teams](https://learning.sap.com/courses/implementing-with-sap-cloud-alm/managing-projects-with-distributed-teams)
- **Tasks**: list, Gantt (timeline and dependencies) and Kanban views, with saved perspectives. Tasks are grouped by deliverable by default. Personal to-do lists and notifications are included. The task list combines SAP guidance tasks with user-created tasks, for example tasks derived from requirements — [SAP Learning: Managing Projects with Distributed Teams](https://learning.sap.com/courses/implementing-with-sap-cloud-alm/managing-projects-with-distributed-teams)
- **Agile objects**: sprints, user stories and story points. Implementation tasks are generated automatically according to the customer's scope. Requirements break down into user stories and tasks, which split into subtasks. Release and deployment planning works through deployment plans and releases — [SAP Support: SAP Cloud ALM for Implementation](https://support.sap.com/en/alm/sap-cloud-alm/implementation.html)
- **Timeboxes**:
  - Phases: the SAP Activate phases Prepare, Explore, Realize, Deploy and Run come pre-delivered, each with start and end dates. Custom phases can be added. Phases can be deactivated, except Prepare. Templates with only two phases auto-deactivate the others.
  - Sprints: sprint schedules set due dates for tasks and user stories, and past sprints move to the "Past" section.
  - Milestones: **Kickoff, Planned Go-Live and Actual Go-Live** are predefined and cannot be deleted.
  - Source: [SAP Cloud ALM Implementation Expert Portal – Timeboxing](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal/timeboxing.html)
- **Quality gates**: checkpoints that ensure deliverables meet their criteria before the next phase. They appear on the project overview and the Gantt timeline, are managed in the "Quality Gates" app with a checklist per gate, and custom gates can be added — [SAP Learning: Managing Projects with Distributed Teams](https://learning.sap.com/courses/implementing-with-sap-cloud-alm/managing-projects-with-distributed-teams); [SAP Learning: Managing Projects and Clean Core Success Plan](https://learning.sap.com/courses/validating-business-transformations-leveraging-integrated-transformation-tools-solutions/managing-projects-and-clean-core-success-plan-with-sap-cloud-alm)
- **Other PM objects on the Expert Portal**: Programs (multi-project), project and authorization roles, a "Requirement Approver" role, release and deployment plans, "How to execute clean core in projects", risk management for projects, task types and sources, task relationships, and AI-assisted requirement generation and document summarization — [SAP Cloud ALM for Implementation – Expert Portal](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal.html)
- **Project status analytics**:
  - Three analytics entry points: Overview Page, Analytics Overview, and Cross Project Analytics (at program or release level).
  - Overview cards: Project, Today (criticalities), Upcoming Events, Recommendations, Upcoming Tasks (top 5).
  - Progress views: Project Progress by Task Completion (overall and by phase), Project Progress Reporting (by phase or deliverable, and by tasks or story points for sprints), Task Distribution (by tags, workstreams, assignees, scope or teams), Task Trend Analysis (with a timebox filter), and a Burn Up Chart (story points per sprint or phase).
  - Cross Project Analysis has a Gantt Timeline tab across projects and can assess release readiness.
  - Traceability views: process, requirement, feature and user story traceability.
  - Source: [SAP Cloud ALM Implementation Expert Portal – Analytics](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal/analytics.html)
- **APIs**: open APIs for Projects, Tasks, Documents, Analytics and Test Automation, documented on SAP Business Accelerator Hub, "to integrate third party tools" — [SAP Support: SAP Cloud ALM for Implementation](https://support.sap.com/en/alm/sap-cloud-alm/implementation.html)
- **Licensing**:
  - RISE customers get their own Cloud ALM tenant "without additional license or subscription fee" through SAP Enterprise Support, cloud editions. Enterprise Support and Product Support for Large Enterprises customers are also entitled. Standard Support is not planned to be entitled.
  - One tenant per customer number, with a paid option for extra tenants planned. AMS partners cannot run multi-customer tenants.
  - Source: [SAP ALM FAQ](https://support.sap.com/en/alm/faq.html)
- **SAP Solution Manager 7.2 context** (it is the on-premise predecessor for project management too): mainstream maintenance ends at the end of 2027, and optional extended maintenance runs to the end of 2030 for selected functions only. RISE alone does not include Solution Manager usage rights — [SAP ALM FAQ](https://support.sap.com/en/alm/faq.html)
- **Quarterly "What's New" cadence**: Implementation webinars on 2026-02-04 (Q4/2025), 2026-04-22 (Q1/2026) and 2026-07-08 (Q2/2026). The next ones are 2026-11-11 (Q3/2026) and 2027-02-03 (Q4/2026) — [SAP ALM quarterly update webinars](https://support.sap.com/en/alm/alm-whats-new-calls/webinar-content-sap-cloud-alm-quarterly-updates.html)
- **Joule and AI in Cloud ALM**: SAP's strategy session ST106 (2025/11) covers "autonomous ALM" with AI agents through Joule, focused on detecting and fixing operations problems. No project management specifics were given — [SAP ST106 – Strategy for SAP Cloud ALM with autonomous ALM and Joule](https://www.sap.com/assetdetail/2025/11/ee7a06f6-297f-0010-bca6-c68f7e60039b.html). An "SAP Cloud ALM, Joule" product page exists, but it could not be fetched — [sap.com/products/technology-platform/cloud-alm-joule.html](https://www.sap.com/products/technology-platform/cloud-alm-joule.html)

### Inferences
- For a test manager, the most relevant project management hooks are:
  - timeboxes (sprints and phases) that drive due dates of test-related tasks and user stories;
  - the Q-Gate checklists at Realize and Deploy;
  - the Overview, Traceability and Burn-up analytics, which combine task, requirement and test execution status;
  - the predefined Go-Live milestones that anchor test cycles.

### Gaps
- The Q4/2025–Q2/2026 "What's New" PDFs could not be retrieved (fetch blocked). Specific 2026 project management features (for example new Joule capabilities in tasks or status reports) are therefore **unverified**.
- No official SAP statement was found on project management-specific Joule features in Cloud ALM, such as generated status reports.

---

## A3. SAP Signavio and SAP LeanIX – planning and scoping only

### Takeaway
In the RISE toolchain, SAP Signavio is the process layer (analyze, model, scope, Process Navigator content) and SAP LeanIX is the architecture layer (current and target architecture, impact assessment). Both feed Cloud ALM: Signavio diagrams sync into Cloud ALM processes and scope, and LeanIX discovers the SAP landscape from Cloud ALM.

### Cited Findings
- **Roles in the toolchain**:
  - SAP Cloud ALM: "lifecycle orchestration, including implementation tracking, quality gates, and a success plan".
  - SAP Signavio: analyze, model, simulate and optimize processes.
  - SAP LeanIX: map current and future architectures and assess transformation impacts.
  - WalkMe and SAP Enable Now: adoption.
  - Tricentis and Syniti: partner tools for test automation and data migration.
  - Source: [SAP Learning: Leveraging the Integrated Toolchain in RISE with SAP](https://learning.sap.com/courses/sap-activate-agile-implementation/leveraging-the-integrated-toolchain-in-rise-with-sap)
- **Integrations**:
  - Signavio and Cloud ALM: sync process diagrams early, including drafts for testing and requirements.
  - LeanIX and Cloud ALM: SAP landscape discovery detects SAP applications and IT components from Cloud ALM.
  - LeanIX and Signavio: integrate once both repositories are aligned to the meta model.
  - Source: [SAP Learning: Leveraging the Integrated Toolchain in RISE with SAP](https://learning.sap.com/courses/sap-activate-agile-implementation/leveraging-the-integrated-toolchain-in-rise-with-sap)
- The Digital Discovery Assessment matches requirements to SAP Cloud ERP capabilities in the Discover phase. The SAP Signavio Process Navigator provides scope item fact sheets, process flows and test scripts — [SAP Activate product page](https://www.sap.com/products/erp/activate-methodology.html); [SAP Learning: Accessing Content](https://learning.sap.com/courses/discovering-sap-activate-implementation-tools-and-methodology/accessing-content)
- The tools are included in the **SAP Cloud ERP Private** package's transformation tools and services — [SAP Learning: Exploring the RISE with SAP Methodology](https://learning.sap.com/courses/introducing-the-rise-with-sap-methodology-for-sap-partners-and-customers/exploring-the-sap-business-suite-methodology-and-sap-cloud-erp-private)

### Inferences
- The scope agreed in Explore (Signavio and Process Navigator scope items synced to Cloud ALM) becomes the baseline for requirements, tasks and test cases. Project planning and test planning therefore share one source.

### Gaps
- The exact entitlement scope of Signavio and LeanIX inside RISE / Cloud ERP Private (for example "starter" editions) is not verified here; it is covered by another researcher.

---

## A4. Third-party project management tools (Jira, Azure DevOps) with Cloud ALM

### Takeaway
SAP sells no turnkey Cloud ALM–Jira or Cloud ALM–Azure DevOps connector. Integration runs either through the Cloud ALM public APIs plus SAP Integration Suite (Open Connectors, or a Jira adapter) or through partner connectors on the Atlassian Marketplace and similar channels. In practice, Cloud ALM usually holds SAP scope, requirements, Activate tasks, tests and Q-Gates, while development teams keep their backlog in Jira or ADO.

### Cited Findings
- Pattern from an SAP blog:
  - Middleware: SAP Open Connectors, part of SAP Integration Suite, with a custom REST connector on the Cloud ALM **Tasks API**.
  - Authentication: OAuth client credentials with the scopes `calm-api.tasks.read` and `calm-api.tasks.write`.
  - Cloud ALM to Jira: a scheduled import of open tasks.
  - Jira to Cloud ALM: status updates through a Jira webhook (`issue_updated`) and a status mapping table.
  - Only tasks are synced.
  - Source: [SAP Community: Integrate SAP Cloud ALM with Jira](https://groups.community.sap.com/t5/technology-blogs-by-sap/integrate-sap-cloud-alm-with-jira/bc-p/13653653)
- SAP Integration Suite offers a **Jira receiver adapter** in Cloud Integration (SAP document 2025/04) — [SAP: Support Jira integration using SAP Integration Suite](https://www.sap.com/documents/2025/04/26f04d78-037f-0010-bca6-c68f7e60039b.html)
- Partner connectors include:
  - "CoreALM Connector for Jira and SAP Cloud ALM" — [Atlassian Marketplace](https://marketplace.atlassian.com/apps/1235148/corealm-connector-for-jira-and-sap-cloud-alm)
  - "crossconnector to SAP Cloud ALM features" — [Atlassian Marketplace](https://marketplace.atlassian.com/apps/3680528276/crossconnector-to-sap-cloud-alm-features-c-f-for-jira)
  - Canarys "SAP Cloud ALM to Azure DevOps Integrator" — [Canarys](https://canarysdevopsolutions.ecanarys.com/sapCloudAlm-ado)
  - SNP Kyano ALM Integrator — [SNP](https://snpgroup.com/en/platform/software-and-components/snp-alm-integrator/)
  - conigma connect (Galileo Group) for Cloud ALM, Signavio and Tricentis — [SAP Store: conigma connect](https://www.sap.com/uk/products/technology-platform/partners/galileo-group-ag-conigma-connect.html)
- "SAP ALM Template for Jira Cloud" (ALPEIN Software, free, v1 dated 2026-08-27) targets Jira-based SAP change and release management together with CTS/TMS, not Cloud ALM — [Atlassian Marketplace](https://marketplace.atlassian.com/apps/2087907533/sap-alm-template-for-jira-cloud)

### Inferences
- Before Realize, decide which tool is the system of record for user stories and defects. A split defect process between Cloud ALM and Jira or ADO is a common source of test reporting gaps.

### Gaps
- No SAP-standard, SAP-supported Cloud ALM–ADO integration was found. Whether SAP shipped native Jira sync in 2026 Cloud ALM releases is **unverified**.

---

## B1. S/4HANA Project System (PS), EPPM, SAP Portfolio and Project Management (PPM) for SAP S/4HANA, Commercial Project Management (CPM), Investment Management (IM)

### Takeaway
"SAP Enterprise Portfolio and Project Management (EPPM)" is the umbrella name for project and portfolio functions in SAP S/4HANA. It includes:
- Project System (PS), the operational and financial WBS and network backbone, which is **not** deprecated;
- SAP Portfolio and Project Management for SAP S/4HANA (PPM: portfolio, project management, resource planning);
- SAP Commercial Project Management (CPM), embedded in the S/4HANA core since 1709;
- Investment Management (IM), which is not part of the compatibility scope.

PS itself remains core. Only specific PS features were in the compatibility scope, and most were modernized into the perpetual scope by 2022/2023 (Fiori Project Schedule, Project Network Graph, and so on). Compatibility scope usage rights ended 2025-12-31, with a few non-PS exceptions to 2030. In private cloud, EPPM is licensed as "SAP S/4HANA Cloud, Enterprise Portfolio and Project Management, private edition" in professional and standard editions, priced per Active User.

### Cited Findings
- **Umbrella and components**:
  - EPPM covers all project and portfolio management products in S/4HANA.
  - PPM handles project and portfolio planning plus detailed cost and resource planning.
  - PS handles cost-project-level planning through "SAP Financial Project Control in SAP Project System".
  - Portfolio management uses buckets and items.
  - EPPM runs in any S/4HANA deployment, including Cloud Public and Private Edition, with different scope per deployment.
  - Source: [SAP Learning: Understanding Project Management in SAP S/4HANA](https://learning.sap.com/courses/discovering-the-basics-of-sap-s-4hana-portfolio-and-project-management/understanding-project-management-in-sap-s-4hana_e1bb3bc1-070e-4b52-9ef0-c61ba57ef133)
- **Compatibility scope status of PS and PPM**: many former compatibility items were modernized into the perpetual scope. Customers must be on the release that delivered each modernization before the compatibility licence expires.
  - Date planning: moved to the Fiori apps Project Schedule and Project Network Graph (2022 FPS2).
  - Planning board, Gantt and network graphic: Project Schedule (2021) and Project Network Graph (2020 FPS1).
  - Project Builder enhancements: perpetual since 2022 FPS1.
  - Claim Management: API and Project Claim Overview app (2022).
  - Project Cash Management: on the Universal Journal (2023).
  - Forecasting: Fiori app (2023).
  - Workforce Planning: Responsibility Management teams (2023).
  - PS reporting: Report Painter/Writer stays perpetual, and hierarchy and line item reports moved to Fiori (2022 FPS1).
  - Remaining compatibility items with no planned alternative: Production Resources and Tools (PRT) in PS, the Project Hierarchy Graphic, CJSA/CJSB, CNPRG, the Forecast Workbench, access control lists, and statistical key figures, among others.
  - Remaining items with alternatives: CJI3 → CJI3N; change documents → CN60; NWTM → Progress Tracking; PS-specific archiving → SARA.
  - Reference: SAP Note 2269324.
  - Source: [SAP Community: An update on the compatibility scope for EPPM](https://blogs.sap.com/t5/enterprise-resource-planning-blogs-by-sap/an-update-on-the-compatibility-scope-for-enterprise-portfolio-and-project/ba-p/13577186)
- **Compatibility scope dates**: usage rights expire **2025-12-31**. Only LE-TRA, CS and selected PP-PI items are extended to **2030-12-31**. Investment Management and Funds Management are **not** in the compatibility scope (author reply). PS details are in the "Way Forward" spreadsheet attached to SAP Note 2269324 — [SAP Community: Compatibility Scope – What happens after 2025/2030](https://blogs.sap.com/2022/08/09/compatibility-scope-what-happens-after-2025-2030/)
  - Newer DSAG/SAP user group material (2026-02-04) repeats that the 2030 usage rights apply to LE-TRA, CS and PP-PI in S/4HANA under a cloud subscription. "After the defined end date, the USE RIGHT to the solution expires (not only the maintenance!)". Other compatibility items had to be stopped by **31 May 2026**. This is likely a grace date; the source gives no reason. Check usage with the report from SAP Note 2399707. Additional options may apply for on-premise customers — [SAP User Groups: Compatibility packs extension (2026-02-04)](https://assets.dm.ux.sap.com/sap-user-groups/pdfs/260204_compatibility_packs_extension.pdf)
- **EPPM in S/4HANA 2023 / Private Edition 2023**:
  - The release "finalizes the modernization of selected compatibility scope items": Interest Calculation, Project Cash Management, Status Combination Codes, Project Cost Forecast and Workforce Planning.
  - Portfolio import of plan values from ACDOCP.
  - CPM Quick Financial Plan.
  - OData APIs for project, WBS, network and activity.
  - Source: [SAP Community: EPPM in SAP S/4HANA Cloud Private Edition 2023](https://blogs.sap.com/t5/enterprise-resource-planning-blogs-by-sap/enterprise-portfolio-and-project-management-in-sap-s-4hana-cloud-private/ba-p/13577343)
- **CPM**: an add-on with its own software components in 1610. From **1709 it is embedded in S/4HANA core (S4CORE)**. It needs business function OPS_PS_CI_1 for PS projects, can include PPM projects without RFC extractors, and offers Fiori overview apps — [SAP Community: CPM in SAP S/4HANA – what's in, what's out](https://blogs.sap.com/2018/05/30/cpm-in-sap-s4hana-whats-in-whats-out-and-whats-needed/); [SAP Community: CPM now embedded in SAP S/4HANA 1709](https://blogs.sap.com/2017/10/20/sap-commercial-project-management-now-embedded-in-sap-s4hana-1709/)
- **Investment Management with PS**:
  - Budget flow: proposal from measures → IM budgeting → distribution to measures (the level-1 WBS of an investment project) → distribution in PS to lower WBS levels.
  - Investment programs are hierarchical and have an approval year.
  - Source: [SAP Learning: Integrating Investment Management with SAP S/4HANA Project Systems](https://learning.sap.com/learning-journeys/exploring-investment-projects-in-sap-s-4hana/integrating-investment-management-with-sap-s-4hana-project-systems)
- **Licensing (private cloud)**: "SAP S/4HANA Cloud, Enterprise Portfolio and Project Management, private edition", in a **professional** edition for project, portfolio and resource managers and project controllers, and a **standard** edition for casual users. Metric: Active User, blocks of 1, price on request — [SAP pricing page: EPPM private edition](https://www.sap.com/products/financial-management/project-portfolio-management/pricing.html)
- **Current release evidence**: an SAP demo script exists for "SAP S/4HANA 2025 FPS01 Fully-Activated Appliance: Portfolio & Project Management" (EPM1, dated 2026/05), which confirms PPM is shipped in the 2025 on-premise / private release — [SAP: EPM1 Demo Script S/4HANA 2025 FPS01](https://www.sap.com/documents/2026/05/2c5da24b-4f7f-0010-bca6-c68f7e60039b.html)
- **S/4HANA long-term commitment**: SAP committed to support S/4HANA "at least through 2040". SAP Business Suite 7 (ERP 6.0) mainstream maintenance ends 2027, with extended maintenance to 2030 (article from 2020) — [CIO: SAP promises to support S/4HANA through 2040](https://www.cio.com/article/3519410/sap-promises-to-support-s4hana-through-2040.html)

### Inferences
- For a new S/4HANA (Private / on-premise 2023/2025) implementation, PS, PPM, CPM and IM are all current core functionality. No successor product is needed. Testers must use the Fiori successors (Project Schedule, Project Network Graph, CJI3N, and so on) instead of compatibility-scope transactions, and regression test packs from ECC need to be adapted.
- PPM as embedded in S/4HANA follows the S/4HANA release maintenance; it is not a separate product lifecycle.

### Gaps
- **[BACKGROUND – unverified]**:
  - The standalone SAP Portfolio and Project Management 6.x (NetWeaver add-on for ECC) follows Business Suite 7 maintenance (2027/2030).
  - Per-release maintenance of S/4HANA 2023/2025 is 7 years mainstream (2023 → end of 2030, 2025 → end of 2032), with SAP extending the 2027 release to 2033+ under "SAP Business Suite" messaging.
  - Neither was verified in this session.
- No source found on DSAG positions specific to PS/PPM in 2026.

---

## B2. SAP S/4HANA Cloud Public Edition (SAP Cloud ERP) – Enterprise Projects, Professional Services, Project Control

### Takeaway
In the public cloud, project management is split into **enterprise projects** (flexible multi-level WBS, budgets, investment and revenue project profiles, AuC settlement) and **professional services (customer) projects** (two-level WBS, demand-based planning, project billing requests). Both are steered through **Project Control** and the EPPM Fiori apps. SAP now markets an "SAP Cloud ERP for Professional Services" bundle and Joule features such as the **Project Setup Agent** (Q1 2026) and a "Project Services" AI feature included with Joule Base.

### Cited Findings
- **Two project types (2308)**:
  - Professional services projects: higher automation, system-calculated planned costs from demands, billing elements and work packages (2 WBS levels), project billing requests.
  - Enterprise projects: flexible across industries (can be a simple cost collector), more than 2 WBS levels, per-element status, budget documents with availability control. The "Investment project" profile creates AuC and settles to a fixed asset. The "Project with revenue" profile supports fixed-price billing from a billing document (no T&M). Supports project and sales order stock.
  - Both use event-based revenue recognition and integrate time recording, purchasing and finance.
  - Source: [SAP Community: The two project control possibilities in SAP S/4HANA Cloud](https://blogs.sap.com/t5/enterprise-resource-planning-blogs-by-sap/the-two-project-control-possibilities-in-sap-s-4hana-cloud-enterprise/ba-p/13577297)
- SAP Learning offers "Implementing Project Control in SAP S/4HANA Cloud Public Edition", where Project Control is positioned as part of S/4HANA R&D / Engineering — [SAP Learning: Introducing Project Control](https://learning.sap.com/courses/implementing-project-control-in-sap-s-4hana-cloud-public-edition/introducing-project-control_c7b6d878-56cc-4723-a0a3-d3961842ef91)
- **EPPM public cloud releases**:
  - 2408: reserving material via project demand, copying projects via API, public APIs for project plan collaboration — [SAP Community topic: S/4HANA Cloud EPPM](https://pages.community.sap.com/topics/s4hana-cloud-portfolio-project-management)
  - 2508 (HY2 2025): project scheduling with SAP Project and Resource Management, collaborative projects, project financial booklets, WBS elements across company codes for revenue projects — [SAP Learning: EPPM 2508 Early Release Series](https://learning.sap.com/live-sessions/enterprise-portfolio-and-project-management-2508-early-release-series)
- **Professional services packaging**: SAP published "SAP Cloud ERP for Professional Services" and "SAP Cloud ERP: Setup and Staff" assets in 2026/04 — [SAP: SAP Cloud ERP for Professional Services](https://www.sap.com/assetdetail/2026/04/be5da25e-4a7f-0010-bca6-c68f7e60039b.html); [SAP: SAP Cloud ERP: Setup and Staff](https://www.sap.com/assetdetail/2026/04/be6eb35a-4a7f-0010-bca6-c68f7e60039b.html). Content not retrieved.
- **Joule – "SAP S/4HANA Cloud Public Edition, Project Services" AI feature**: manages project tasks conversationally, monitors timesheet compliance, summarizes project changes, and offers self-service project insights. SAP claims 60% less project admin effort. It is **included with Joule Base at no additional cost** but requires a Joule Base subscription and the base product — [SAP: S/4HANA Cloud Public Edition Project Services (AI feature)](https://www.sap.com/india/products/erp/s4hana-cloud-public-edition-project-services.html)
- **Joule Project Setup Agent** (S/4HANA Cloud Public Edition, Q1 2026 Joule expansion): creates new projects from data of similar past projects, allocates resources and applies templates. Early results: ~10% less project creation time, 16% faster resource allocation, 30% less template rework — [SAPinsider: Joule expands from copilot to cross-suite execution engine](https://sapinsider.org/articles/joule-expands-from-copilot-to-cross-suite-execution-engine/)

### Inferences
- These are relevant only if the new implementation is public cloud (or if professional services processes are in scope). In Private Edition, classic PS/PPM/CPM apply.

### Gaps
- The precise GA date and licensing of the Project Setup Agent are not verified.
- The "SAP S/4HANA Cloud for projects" name for Enterprise Projects (older SAP marketing) is not verified as current.

---

## B3. SAP Project and Resource Management (formerly SAP Project Intelligence Network → SAP S/4HANA Cloud for projects) and SAP Multi-Resource Scheduling

### Takeaway
**SAP Project Intelligence Network (PIN)** was not discontinued but renamed several times and is now **SAP Project and Resource Management**: "SAP Project Intelligence Network" → "SAP S/4HANA Cloud for projects, project collaboration" → "SAP S/4HANA Cloud for Projects – Collaborative Project Management" → "SAP Project and Resource Management". It is a cloud service for cross-company project collaboration (a common data environment) and skills-based resource management, integrated with S/4HANA PS. **SAP Multi-Resource Scheduling (MRS)** is a legacy scheduling add-on whose functional successors are S/4HANA Asset Management **Resource Scheduling (RSH)** and **SAP Field Service Management**.

### Cited Findings
- **Rename chain** (SAP integration package "Project Management Capability in SAP Project and Resource Management Integration with SAP S/4HANA", iFlow "Import Project Plan from Project System"):
  - v1.0.1: renamed from "SAP Project Intelligence Network" to "SAP S/4HANA Cloud for projects, project collaboration" (component PPM-CLD-COL).
  - v1.0.2: "SAP S/4HANA Cloud for Projects – Collaborative Project Management".
  - v1.0.3: "SAP Project and Resource Management".
  - No dates in the document.
  - Source: [SAP Business Accelerator Hub: integration package release notes](https://api.sap.com/odata/1.0/catalog.svc/Files('a701b92f98d64caabb92dc41f6a51dba')/$value)
- **Capabilities**:
  - Main project schedule integrating work packages from SAP and third-party sources.
  - Tasks, deliverables, issues and punch lists across companies.
  - Partner invitation through a global business partner repository.
  - Skills- and availability-based resource matching with real-time capacity.
  - Digital twin connection and a single project repository.
  - Source: [SAP product page: SAP Project and Resource Management](https://www.sap.com/products/scm/project-resource-management.html)
- **Licensing**: cloud service, metric **FUE**, blocks of 1 FUE at a listed USD 96 per month. Terms of 6–60 months with auto-renewal. Storage add-on in 100 GB blocks. Test/demo tenant for partners — [SAP product page: SAP Project and Resource Management](https://www.sap.com/products/scm/project-resource-management.html)
- "SAP S/4HANA Cloud for Projects" was presented in June 2024 as "a new application that integrates with SAP S/4HANA Public edition as well as S/4HANA Private edition backends" — [ASUG webcast: Enhance your EPPM in SAP S/4HANA with cloud-based collaboration and AI](https://www.asug.com/events/enhance-your-enterprise-portfolio-and-project-management-in-sap-s-4hana-with-cloud-based-collaboration-and-ai-capabilities)
- The 2508 public cloud release includes "project scheduling with SAP Project and Resource Management" — [SAP Learning: EPPM 2508 Early Release Series](https://learning.sap.com/live-sessions/enterprise-portfolio-and-project-management-2508-early-release-series)
- **MRS**: SAP names S/4HANA Asset Management for Resource Scheduling (RSH, part of the S/4HANA core, for in-plant maintenance and PM orders, with simulation versions) and SAP Field Service Management (cloud, supports CS/PS/PM orders) as "successor[s] of SAP Multi Resource Scheduling" — [SAP Community: SAP Maintenance and Service Scheduling – which solution is right](https://answers.sap.com/t5/enterprise-resource-planning-blogs-by-sap/sap-maintenance-and-service-scheduling-which-solution-is-right-for-your/ba-p/13561168)

### Inferences
- For utilities and capital projects with many external contractors, SAP Project and Resource Management is SAP's current answer for collaboration and scheduling on top of PS. Primavera P6 integration (often through partners) remains common.

### Gaps
- The MRS end-of-maintenance date was not found **[BACKGROUND – unverified]**: MRS is an add-on following the S/4HANA / ERP maintenance of its host release.
- No exact date for the PIN rename was found.

---

## B4. Capital projects for utilities

### Takeaway
SAP's capital projects story for utilities in 2025 is **EPPM in SAP S/4HANA** (portfolio and stage-gate, PS scheduling and cost planning, forecasting with EAC/ETC/POC, change management, collaboration) plus IM for investment programs, with Primavera P6 integration via an endorsed partner app. No separate current product named "SAP S/4HANA for Capital Projects" was confirmed.

### Cited Findings
- **SAP for Utilities presentation** (Feb 2025), "Managing capital projects with S/4HANA":
  - Project proposal: requests, stage/gate templates, scoring.
  - Planning: phases, tasks, milestones, plan version simulation.
  - Cost planning: internal and external, multiple versions, controlled transfer to FI/CO, forecasting on actuals, EAC, ETC, POC or output.
  - Issue, risk and change management, with approved changes updating the cost plan.
  - External collaboration, including BIM 3D models.
  - Portfolio roll-ups.
  - Partner app "Rizing Carbon for Project Integration" (SAP Endorsed App) syncs PS and PM with Primavera P6.
  - A 30-day EPPM trial is offered on SAP CAL.
  - Wien Energie (Head of PMO) reports 30% shorter lead time for investment decisions.
  - Source: [SAP for Utilities NL: Managing capital projects with S/4HANA (2025)](https://assets.dm.ux.sap.com/nl-sap-for-utilities/pdfs/managing_capital_projects_s4hana.pdf)
- Enterprise projects with the "Investment project" profile in public cloud generate AuC and settle to fixed assets — [SAP Community: The two project control possibilities](https://blogs.sap.com/t5/enterprise-resource-planning-blogs-by-sap/the-two-project-control-possibilities-in-sap-s-4hana-cloud-enterprise/ba-p/13577297)

### Inferences
- For a utility client, the test scope should cover: IM program → appropriation/measure → PS WBS budget distribution → PS/PM orders → AuC settlement, plus any P6 or SAP Project and Resource Management interfaces.

### Gaps
- "SAP S/4HANA for Capital Projects" as a distinct SKU could not be verified. It may be marketing wording for EPPM in the utilities context.
- PIN is not dead: see B3, where it was renamed into SAP Project and Resource Management.

---

## B5. Joule and AI project management assistants announced 2025/2026 (summary)

### Takeaway
The relevant AI items are:
- Joule in the SAP Activate Roadmap Viewer (GA July 2025);
- SAP Joule for Consultants (product page Nov 2025; Q1 2026 enhancements; AI Units licensing);
- the Joule **Project Setup Agent** for S/4HANA Cloud Public Edition (Q1 2026);
- the "S/4HANA Cloud Public Edition, Project Services" Joule feature (included in Joule Base);
- Cloud ALM AI features (AI-assisted requirement generation, document summarization) and the "autonomous ALM" strategy, which is operations-focused.

### Cited Findings
- Joule in the Roadmap Viewer: GA July 2025 — [SAP Learning: Accessing Content](https://learning.sap.com/courses/discovering-sap-activate-implementation-tools-and-methodology/accessing-content)
- Joule for Consultants: [SAP product page](https://www.sap.com/products/technology-platform/joule-for-consultants.html); Q1 2026 enhancements — [SAPinsider](https://sapinsider.org/articles/joule-expands-from-copilot-to-cross-suite-execution-engine/)
- Project Setup Agent: Q1 2026 — [SAPinsider](https://sapinsider.org/articles/joule-expands-from-copilot-to-cross-suite-execution-engine/)
- The Q1 2026 Joule update is described as Joule "live in 35 SAP solutions" with about 40 new agents — [SAPinsider](https://sapinsider.org/articles/joule-expands-from-copilot-to-cross-suite-execution-engine/); secondary: [completeaitraining.com](https://completeaitraining.com/news/sap-expands-joule-ai-assistant-to-35-solutions-and-adds-40/)
- Project Services AI feature: [SAP product page](https://www.sap.com/india/products/erp/s4hana-cloud-public-edition-project-services.html)
- Cloud ALM AI-assisted requirement generation and document summarization: [Cloud ALM Implementation Expert Portal](https://support.sap.com/en/alm/sap-cloud-alm/implementation/sap-cloud-alm-implementation-expert-portal.html); autonomous ALM: [SAP ST106](https://www.sap.com/assetdetail/2025/11/ee7a06f6-297f-0010-bca6-c68f7e60039b.html)

### Inferences
- No SAP-announced "Joule project manager agent" for running implementation projects (status reports, Q-Gate preparation) was found. Implementation project management AI is currently knowledge assistance (Joule for Consultants, Roadmap Viewer Joule) plus Cloud ALM artifact generation.

### Gaps
- No verified SAP source was found for AI features in private cloud or on-premise PS/PPM (for example Joule for project controllers in S/4HANA Private Edition).
- SAP Sapphire 2026 and TechEd 2026 announcements were not researched because of the search budget.
