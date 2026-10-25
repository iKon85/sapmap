# SAP BTP (now positioned under "SAP Business AI Platform") and S/4HANA Extensibility / Clean Core – status October 2026

Research note: this pass made about 45 search and fetch calls, and the shared web-search budget ran out before the end. help.sap.com blocks automated fetching (robots), so I could not verify Help Portal pages directly. The facts below come from SAP News, sap.com product pages, learning.sap.com, SAP Community pages, developers.sap.com and secondary press. Items I could not verify this session are listed under "Gaps", with background knowledge clearly marked as unverified.

Neighbouring topics (covered by other researchers, only mentioned here): SAP Integration Suite (incl. Event Mesh / Advanced Event Mesh, API Management, Graph, MCP Gateway), SAP Business Data Cloud / Datasphere / SAP Analytics Cloud, SAP AI Core / generative AI hub.

---

## 1. BTP structure: global account, subaccounts, regions, hyperscalers, environments, cockpit, entitlements (and the 2026 platform naming)

### Takeaway
BTP is organised top-down as global account (= the contract) → optional directories → subaccounts. Each subaccount sits in exactly one region and therefore on one infrastructure provider (SAP, AWS, Azure, GCP, Alibaba). Environments (Cloud Foundry, Kyma, ABAP; legacy Neo) are enabled per subaccount, and entitlements/quotas are handed down from the global account. At Sapphire 2026 (May 2026) SAP folded BTP, Business Data Cloud and Business AI into the "SAP Business AI Platform". Sources disagree on whether this is a rename of BTP or an umbrella over it. Existing BTP constructs carry forward and no migration is forced.

### Cited Findings
**Account model**
- The global account represents the customer's contract with SAP. It manages directories, subaccounts, members, entitlements and quotas, and runs in a region — [SAP Learning: Illustrating the Architecture of SAP BTP](https://learning.sap.com/courses/exploring-sap-business-technology-platform/illustrating-the-architecture-of-sap-btp_dece8e77-4191-4452-8595-171fa1a4aae7)
- Directories are optional folders that group subaccounts or other directories. A path can be up to 7 levels deep, which allows up to 5 directory levels — [SAP Learning: Architecture of SAP BTP](https://learning.sap.com/courses/exploring-sap-business-technology-platform/illustrating-the-architecture-of-sap-btp_dece8e77-4191-4452-8595-171fa1a4aae7)
- Subaccounts are where apps are deployed, services used and subscriptions managed. Each is independent for security, member management and data — [SAP Learning: Architecture of SAP BTP](https://learning.sap.com/courses/exploring-sap-business-technology-platform/illustrating-the-architecture-of-sap-btp_dece8e77-4191-4452-8595-171fa1a4aae7)
- Role collections are managed separately at each level and do not carry over between global account and subaccounts — [SAP Learning: Explaining SAP BTP Accounts](https://learning.sap.com/courses/introducing-sap-cloud-identity-services/explaining-global-accounts-and-subaccounts)
- Entitlements are the right to provision and use a resource (the booked service plans). Quotas cap numeric consumption. Both are assigned from the global account to subaccounts. Service plans are cost/benefit variants of a service (e.g. database "T-shirt sizes") — [SAP Learning: Architecture of SAP BTP](https://learning.sap.com/courses/exploring-sap-business-technology-platform/illustrating-the-architecture-of-sap-btp_dece8e77-4191-4452-8595-171fa1a4aae7)

**Regions and hyperscalers**
- Each subaccount gets exactly one region. Choosing the region also determines the infrastructure provider: SAP itself, AWS, Microsoft Azure, Google Cloud Platform or Alibaba Cloud — [SAP Learning: Architecture of SAP BTP](https://learning.sap.com/courses/exploring-sap-business-technology-platform/illustrating-the-architecture-of-sap-btp_dece8e77-4191-4452-8595-171fa1a4aae7)
- The BTP cockpit is reached through a region-specific URL — [SAP Learning: Architecture of SAP BTP](https://learning.sap.com/courses/exploring-sap-business-technology-platform/illustrating-the-architecture-of-sap-btp_dece8e77-4191-4452-8595-171fa1a4aae7)

**Environments**
- Cloud Foundry: polyglot PaaS with Java, Node.js and Python buildpacks, managed through the CF CLI. Enabling CF creates an org automatically, and you then create spaces in it. Org roles: Org Manager/Auditor. Space roles: Space Manager/Developer/Auditor/Supporter — [SAP Learning: Architecture](https://learning.sap.com/courses/exploring-sap-business-technology-platform/illustrating-the-architecture-of-sap-btp_dece8e77-4191-4452-8595-171fa1a4aae7); [SAP Learning: BTP Accounts](https://learning.sap.com/courses/introducing-sap-cloud-identity-services/explaining-global-accounts-and-subaccounts)
- Kyma: managed Kubernetes runtime for containers, serverless functions and microservices — [SAP Learning: Architecture](https://learning.sap.com/courses/exploring-sap-business-technology-platform/illustrating-the-architecture-of-sap-btp_dece8e77-4191-4452-8595-171fa1a4aae7)
- ABAP environment: for extensions of ABAP-based products such as S/4HANA Cloud. It runs inside the CF or Kyma environment and supports RAP, SAP Fiori and CDS — [SAP Learning: Architecture](https://learning.sap.com/courses/exploring-sap-business-technology-platform/illustrating-the-architecture-of-sap-btp_dece8e77-4191-4452-8595-171fa1a4aae7)
- A multi-environment subaccount lets several environments share one set of users, authorizations and entitlements — [SAP Learning: Architecture](https://learning.sap.com/courses/exploring-sap-business-technology-platform/illustrating-the-architecture-of-sap-btp_dece8e77-4191-4452-8595-171fa1a4aae7)
- **Neo (RETIRING):** the original BTP environment (HTML5, Java, HANA XS). End of life is **31 December 2028**, and SAP will not approve renewals beyond end of 2028. Until then Neo receives only security, availability and compliance updates. New features (Integration Suite, SAP Build, Datasphere) go only to the multi-cloud foundation, and SAP offers a free migration assessment for partners — [SAPinsider: SAP Announces Sunset of Neo](https://sapinsider.org/blogs/sap-announces-sunset-of-neo-cloud-environment/); [SAP Community: Farewell Neo (June 2023)](https://blogs.sap.com/2023/06/14/farewell-neo-sap-btp-multi-cloud-environment-the-deployment-environment-of-choice/)
- SAP still runs Neo migration webinars in 2025/2026, e.g. "Neo to Multi-Cloud" on 22 July 2026 (Integration Suite focus) — [sap.com event](https://www.sap.com/germany/events/2026-07-22-online-neo-to-multi-cloud-migrate-smarter-scale-faster-with-integration-suite.html); [sap.com event Oct 2025](https://www.sap.com/australia/events/2025-10-28-online-preparing-for-the-btp-neo-sunset.html)

**Name history**
- 2012 SAP NetWeaver Cloud → 2013 SAP HANA Cloud Platform → 2017 SAP Cloud Platform → January 2021 SAP Business Technology Platform. SAP reported more than 27,000 customers and over 2,800 partners as of October 2024 — [Wikipedia: SAP BTP](https://en.wikipedia.org/wiki/SAP_BTP)

**2026: SAP Business AI Platform**
- At Sapphire 2026 SAP introduced the "SAP Business AI Platform", which unifies BTP, Business Data Cloud and Business AI into one governed environment — [SiliconANGLE, 12 May 2026](https://siliconangle.com/2026/05/12/sap-recasts-joule-front-door-autonomous-enterprise-ai)
- SAP's Sylvie Sollod (GVP Platform Product Marketing, SAP BTP) calls it "an evolution of bringing all of the platform capabilities together under one unified Business AI Platform", not a teardown. It also includes LeanIX and Signavio. Existing BTP skills, integrations and extensions "carry forward" — [SAPinsider, July 2026](https://sapinsider.org/map/sap-business-ai-platform-btp-foundation-sapphire-2026/)
- A partner-oriented source describes it explicitly as a rename BTP → SAP Business AI Platform (BAIP). It says the BTP partner competency was renamed the BAIP competency effective 30 June 2026, and that Integration Suite, Extension Suite, Business Application Studio and SAC remain part of the platform with no forced migration — [United VARs](https://www.united-vars.com/en/beyond/from-sap-btp-to-sap-baip-why-sap-renamed-the-platform-and-what-changed)
- SAP Learning courses now use "SAP Business AI Platform" as the platform name throughout, while still saying "SAP BTP ABAP Environment" and "SAP BTPEA" — [SAP Learning: Exploring SAP Business AI Platform Architecture – Development Tools](https://learning.sap.com/courses/exploring-sap-business-ai-platform-architecture/exploring-development-tools_d34f92af-d33e-4cc0-92a3-3d4122dc1b5a)
- Platform pillars: Build (Joule Studio, SAP Build), Contextualize and reason (SAP Knowledge Graph, Business Data Cloud, SAP Domain Models), Govern (SAP AI Agent Hub, managed Joule runtime, Signavio, LeanIX) — [SAP News, 13 May 2026](https://news.sap.com/2026/05/new-joule-studio-enterprise-scale-agentic-development/)

**Commercial models (structure-level)**
- Trial: 90 days, non-commercial. PAYG: no commitment, published Cloud Credit rates, 90+ services have free tiers. BTPEA: annual credit commitment, about 20–40% below PAYG, overage billed at PAYG rates, and unused credits typically forfeited at period end. (Third-party licensing advisor, updated April 2026; figures are its estimates, not SAP list prices) — [Redress Compliance](https://redresscompliance.com/sap-btp-licensing-guide.html)
- Free tier: a productive global account (PAYG or CPEA) in which using only free plans costs nothing and has no time limit, with upgrade to paid plans without losing data. It differs from the trial, a separate environment for individual learning. The current list of free-tier services is in SAP Discovery Center. The Cloud Foundry Runtime "Free" plan is not available in cf-eu10 (Frankfurt, AWS) — [SAP Developers tutorial: BTP free tier account](https://developers.sap.com/tutorials/btp-free-tier-account.html)
- New AI services (Joule, AI Core, GenAI) are being added as credit-consuming BTP services through 2026–2027 — [Redress Compliance](https://redresscompliance.com/sap-btp-licensing-guide.html)

### Inferences
- For S/4 projects, the common landscape pattern is one global account per customer contract, directories per business unit or programme, and subaccounts per stage (DEV/QAS/PRD), each pinned to a region that is ideally co-located with the S/4HANA (RISE) hyperscaler region. This follows from the "one region per subaccount" rule and from latency guidance.
- The "Business AI Platform" is best treated in a report as the new umbrella and marketing name that contains BTP. The technical account model (global account, subaccount, CF/Kyma/ABAP, cockpit, entitlements) is unchanged per all sources, but SAP's own wording is not consistent.

### Gaps
- Could not verify on help.sap.com: BTP CLI (`btp`), the Kyma namespace model, the exact current region list, CPEA vs BTPEA distinctions in 2026 contracts, and whether "CPEA" is still sold to new customers. Background knowledge (unverified): BTPEA is the newer credit-based enterprise agreement that largely replaced CPEA for new contracts. Both draw on cloud credits and both allow free-tier plans.
- No source found for an SAP-official "new BTP pricing" announcement in 2025/2026, beyond SAP News saying in May 2025 that SAP Build got "new simplified pricing and packaging" (see section 5).
- Whether the BTP cockpit has been rebranded in the UI after the BAIP announcement was not found.

---

## 2. Extensibility models and the clean core levels A–D

### Takeaway
SAP's extensibility model for S/4HANA has three styles: key user (in-app), on-stack developer extensibility (ABAP Cloud / "embedded Steampunk"), and side-by-side on BTP (CAP, ABAP environment, SAP Build). In August 2025 SAP replaced the original 3-tier model with four clean core levels (A–D). An extension's level is set by the lowest-rated technology it uses. Level A = released APIs only (ABAP Cloud on-stack, or BTP side-by-side). Level B = classic APIs (BAPIs, BAdIs, etc.). Level C = internal objects. Level D = modifications, write access to SAP tables, implicit enhancements.

### Cited Findings
**Clean core levels (SAP, August 2025)**
- **Level A – "Extend with SAP Build":** fully compliant extensions that use only publicly released, stable SAP interfaces with formal stability contracts. Side-by-side on BTP (pro-code or low-code), or on-stack with the ABAP Cloud model and released APIs — [SAP News, 12 Aug 2025: Extend SAP S/4HANA Cloud the right way](https://news.sap.com/2025/08/extend-sap-s4hana-cloud-right-way-clean-clear/)
- **Level B – "Leverage classic APIs":** meets Level A criteria and additionally uses SAP classic APIs/technologies, which are documented and generally upgrade-stable — [SAP News, Aug 2025](https://news.sap.com/2025/08/extend-sap-s4hana-cloud-right-way-clean-clear/)
- **Level C – "Accesses internal objects":** partially compliant, for legacy scenarios. SAP plans a changelog of SAP objects so teams can see changes early — [SAP News, Aug 2025](https://news.sap.com/2025/08/extend-sap-s4hana-cloud-right-way-clean-clear/). ASUG calls Level C "conditional clean core", manageable with governance and documentation — [ASUG](https://www.asug.com/insights/sap-updates-clean-core-guidance-to-help-customers-clarify-extensibility-criteria)
- **Level D – "Not recommended":** modifications, write access to SAP tables, implicit enhancements and "noAPI" objects in the Cloudification Repository. Highest risk, significant technical debt, remediate first — [SAP News, Aug 2025](https://news.sap.com/2025/08/extend-sap-s4hana-cloud-right-way-clean-clear/); [ASUG](https://www.asug.com/insights/sap-updates-clean-core-guidance-to-help-customers-clarify-extensibility-criteria)
- The four levels evolve SAP's "original three-tier model". The ABAP test cockpit (ATC) is the key code-governance tool, and ABAP Cloud enforces clean principles through syntax checks — [SAP News, Aug 2025](https://news.sap.com/2025/08/extend-sap-s4hana-cloud-right-way-clean-clear/)
- The 3-tier model is described as "now sunset", but code built under it (incl. Tier 2 wrappers) does not necessarily need migration. Extensions are rated by "the lowest-ranked technology used within them". Classic API examples: BAPIs, user exits, BAdIs, CL_GUI_ALV_GRID. Automated ATC checks are part of the SAP objects changelog to detect incompatible changes — [SAP Learning: Exploring Clean Core Extensibility Best Practices](https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/explaining-extensibility-model-best-practices_e290f382-800e-40ef-a203-85a13115f487)
- Released APIs are found in the SAP Business Accelerator Hub, the Cloudification Repository and the system itself — [SAP Learning: Clean Core Best Practices](https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/explaining-extensibility-model-best-practices_e290f382-800e-40ef-a203-85a13115f487)

**Former 3-tier model (still relevant for existing code in Private Edition / on-prem)**
- Tier 1: pure ABAP Cloud, only released APIs, language version "ABAP for Cloud Development", enforced by syntax and runtime checks. Tier 2 ("Cloud API enablement"): classic ABAP wrappers around classic APIs, released for Tier 1 use, governed by ATC exemptions. Tier 3: classic ABAP — [SAP Community: Classic APIs for Tier 2 ABAP Cloud development](https://blogs.sap.com/t5/technology-blogs-by-sap/classic-apis-for-tier-2-abap-cloud-development-in-sap-s-4hana-cloud-private/ba-p/13620329)
- SAP publishes a classic API list for Tier 2 on GitHub (SAP/abap-atc-cr-cv-s4hc; objectClassifications.json for ATC, which requires SAP Note 3449860). Classifications: TI2 (wrap and release), SUB (substituted), NA (not consumable). Browsable via the Cloudification Repository Viewer. Example tutorial: wrapping BAPI_PR_CREATE — [SAP Community: Classic APIs for Tier 2](https://blogs.sap.com/t5/technology-blogs-by-sap/classic-apis-for-tier-2-abap-cloud-development-in-sap-s-4hana-cloud-private/ba-p/13620329)
- Tier 3 (classic ABAP) is described as "legacy", a last resort — [SAP Learning: Clean Core Best Practices](https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/explaining-extensibility-model-best-practices_e290f382-800e-40ef-a203-85a13115f487)

**ABAP Cloud / on-stack developer extensibility ("embedded Steampunk")**
- ABAP Cloud is the cloud-ready ABAP development model. It is not a synonym for Steampunk: it was introduced with Steampunk (SAP BTP ABAP Environment) and is now in S/4HANA. Availability: BTP ABAP Environment (mandatory), S/4HANA Cloud Public Edition since 2208 (mandatory for new customers), Private Edition and on-prem since 2022 (recommended). No downport before 2022 — [SAP Community: ABAP Cloud FAQ](https://pages.community.sap.com/topics/abap/abap-cloud-faq)
- "Embedded Steampunk" (developer extensibility) builds tightly coupled, upgrade-stable extensions on the S/4 stack using RAP and released objects. It is not an embedded BTP ABAP instance, but it uses the same ABAP Cloud model and kernel. Side-by-side Steampunk suits decoupled extensions, separate user groups, multi-ERP or multitenancy — [ABAP Cloud FAQ](https://pages.community.sap.com/topics/abap/abap-cloud-faq)
- Key user extensibility uses its own packages with language version "ABAP for Key Users" or Standard. Developer extensibility uses "ABAP for Cloud Development". RAP is mandatory in Tier 1, with SAP Fiori as the standard UI. New OData APIs default to OData V4 on RAP — [ABAP Cloud FAQ](https://pages.community.sap.com/topics/abap/abap-cloud-faq)
- ABAP Cloud in S/4HANA (public, private, on-prem) is covered by existing developer licenses. Update cycles: BTP ABAP quarterly, Public Edition half-yearly, Private/on-prem yearly (bi-yearly from 2023) — [ABAP Cloud FAQ](https://pages.community.sap.com/topics/abap/abap-cloud-faq)
- ABAP Development Tools (ADT) projects target either an S/4HANA system (developer extensibility) or an SAP BTP ABAP Environment (side-by-side) — [SAP Learning: Business AI Platform Development Tools](https://learning.sap.com/courses/exploring-sap-business-ai-platform-architecture/exploring-development-tools_d34f92af-d33e-4cc0-92a3-3d4122dc1b5a)

**Side-by-side**
- Side-by-side extensions "decouple business logic from the core system" and are more likely to be public-cloud compatible — [SAP Learning: Clean Core Best Practices](https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/explaining-extensibility-model-best-practices_e290f382-800e-40ef-a203-85a13115f487)
- An extensibility wizard gives direct access to SAP Build from S/4HANA Cloud Public Edition (announced October 2024) — [CO/AI, via InfoWorld](https://getcoai.com/news/sap-build-is-being-reimagined-to-enable-faster-enterprise-software-and-ai-agents). As of May 2025 it was available in Public Edition and "later this year" for Private Edition — [SAP News, 22 May 2025](https://news.sap.com/?p=233953)

### Inferences
- Practical mapping for a report (my synthesis, not an official SAP table):
  - Key user extensibility, ABAP Cloud on-stack with released APIs, and BTP side-by-side via released OData/SOAP/event APIs → Level A.
  - Classic ABAP using classic APIs (BAPI/BAdI/user exits), and former Tier 2 wrappers that wrap TI2 classic APIs → typically Level B.
  - Classic code reading unreleased internal objects → Level C.
  - Modifications, implicit enhancements, direct table writes → Level D.
- In a test-management context, the level classification matters for upgrade regression scope. Levels C/D code is where SAP's planned changelog and ATC checks point to regression-test hotspots.

### Gaps
- No official SAP table mapping Tier 1/2/3 to Levels A–D was found. Sources only say the levels "evolve" the tiers.
- Not verified: the specific ATC check variant names for clean core levels, and the SAP Cloud ALM clean core / custom code dashboards (Cloud ALM is covered elsewhere).
- Release contracts (C0/C1/C2 for key user, cloud development and remote API use) were not confirmed by any fetched source. Background knowledge (unverified): C1 = released for use in key user apps / cloud development, C2 = released as remote API, C0 = extension-point stability.

---

## 3. Programming models and tools – fact sheets

### Takeaway
On the SAP side, pro-code means ABAP Cloud/RAP (in ADT for Eclipse) and CAP (Node.js/Java) in SAP Build Code, which is built on SAP Business Application Studio. Low-code/automation means SAP Build Process Automation and SAP Build Work Zone. SAP Build Apps is being deprecated as a standalone product (2026). The agent and AI layer moved from "Joule Studio in SAP Build" (2025, now called "Joule Studio Classic") to a new, SAP-managed "Joule Studio" (Sapphire May 2026) with its own runtime. Design time is free through end of 2026.

### Cited Findings

**SAP Build (umbrella)**
- Name: SAP Build, a unified no-, low- and pro-code suite covering apps, process automation and agents, designed around clean core — [SAP Learning: Development Tools](https://learning.sap.com/courses/exploring-sap-business-ai-platform-architecture/exploring-development-tools_d34f92af-d33e-4cc0-92a3-3d4122dc1b5a)
- The sap.com portfolio page lists low-code (SAP Build Apps, SAP Build Process Automation, SAP Build Work Zone), pro-code (SAP Build Code, SAP BTP ABAP environment, SAP S/4HANA ABAP Cloud environment), Joule Studio and Joule for developers. SAP Build is "included as part of SAP Business Suite", and entitlements are confirmed in the BTP cockpit — [sap.com: SAP Build](https://www.sap.com/products/technology-platform/build.html)
- At TechEd 2025: an SAP Build extension for VS Code (Open VSX "soon"), and local SAP MCP servers so Claude Code, Cline, Windsurf and Cursor can use SAP Build frameworks — [The New Stack, 5 Nov 2025](https://thenewstack.io/sap-expands-its-ai-stack-for-developers/); [Constellation Research](https://www.constellationr.com/insights/news/sap-rolls-out-developer-tools-joule-ecosystem-connections)

**SAP Build Lobby**
- Central project list of an SAP Build instance. "Create" offers: Application (SAP Build Apps or SAP Build Code), Automated Process (SAP Build Process Automation), Joule Agent and Skill (Joule Studio), Business Site (SAP Build Work Zone). Project types show "Not Subscribed" if the service is not subscribed in the BTP subaccount. Projects have editable/released/deployed/published versions — [SAP Developers: Joule Studio CodeJam 1 – Build Lobby (Jan 2026)](https://developers.sap.com/tutorials/joule-studio-codejam-1-build-lobby.html)

**SAP Build Code / SAP Business Application Studio (BAS)**
- SAP Build Code (pro-code) is built on CAP. It supports extensions, SAPUI5/Fiori UIs, mobile apps, HANA-based apps and multitenant SaaS, with built-in CI/CD and Joule for Developers — [SAP Learning: Development Tools](https://learning.sap.com/courses/exploring-sap-business-ai-platform-architecture/exploring-development-tools_d34f92af-d33e-4cc0-92a3-3d4122dc1b5a)
- BAS customers can upgrade the subscription to the "build-code" plan (BTP cockpit → Instances and Subscriptions → Update), then open via SAP Build Lobby. Existing BAS dev spaces remain accessible via Dev Space Manager. SAP Build Code became GA on 27 March (2024 per context) — [SAP Community: Upgrade SAP Business Application Studio to SAP Build Code](https://blogs.sap.com/t5/technology-blogs-by-sap/upgrade-sap-business-application-studio-to-sap-build-code/ba-p/13661500)
- BAS still carries forward as a developer toolset under the Business AI Platform — [United VARs](https://www.united-vars.com/en/beyond/from-sap-btp-to-sap-baip-why-sap-renamed-the-platform-and-what-changed). (Note: one SAP Learning page summary referred to "SAP Build Application Studio" as a separate service integrated in SAP Build Code. This could be a new spelling or a summarisation artefact. Verify before using.)
- CAP in SAP Build can consume SAP Business Data Cloud data products. Discovery in SAP Build was planned for 2H 2025 — [SAP News, 22 May 2025](https://news.sap.com/?p=233953)

**ABAP Cloud / RAP / ADT** – see section 2. Additional: TechEd 2025 announced an ABAP-based MCP server exposing ABAP Cloud and ABAP AI features to coding agents (no date given), and ABAP LLMs trained on ABAP code for 2026 — [The New Stack](https://thenewstack.io/sap-expands-its-ai-stack-for-developers/)

**Joule for developers / ABAP AI capabilities**
- Joule for developers offers GenAI support for ABAP, Java, JavaScript and visual tools, including debugging and understanding legacy code — [SAP News, May 2025](https://news.sap.com/?p=233953)
- Announced in March 2025 with purpose-built LLMs (ABAP LLM), a limited-time free trial in SAP Build Code and a free offer of ABAP AI capabilities — [Mastering SAP, 19 Mar 2025](https://masteringsap.com/blogs/sap-announces-joule-for-developers/)
- For S/4HANA Cloud Private Edition, "SAP Joule for Developers, ABAP AI capabilities" is a separately activated offering ("Activate with AI Units"), integrated in ADT for Eclipse. It provides code generation/prediction respecting the ABAP language version, end-to-end ABAP Cloud scenario generation and code explanations — [sap.com product page](https://www.sap.com/products/erp/s4hana-cloud-private-edition-joule-for-developers-abap-ai-features.html)
- At Sapphire 2026, an ABAP code conversion agent reached GA, with a cited 40% efficiency target (secondary source) — [TrailHQ/Nanonets Sapphire 2026 breakdown](https://trailhq.com/blog/sap-sapphire-2026-the-complete-breakdown)

**Joule Studio (2025 "in SAP Build" → 2026 new managed Joule Studio)**
- 2025: Joule Studio was a capability in SAP Build for Joule skills (rule-based) and AI agents. Announced as GA June 2025 — [SAP News, 22 May 2025](https://news.sap.com/?p=233953). The sap.com page says the skill builder has been GA since July 2025 and the agent builder was scheduled GA December 2025, with free runtime of custom agents for SAP Build customers during Q1 2026 — [sap.com: What is Joule Studio](https://www.sap.com/mena/products/artificial-intelligence/joule-studio.html). TechEd 2025 confirms agent builder GA December 2025, adding system-triggered agents, monitoring and A2A support — [The New Stack](https://thenewstack.io/sap-expands-its-ai-stack-for-developers/)
- 13 May 2026 (Sapphire): the new Joule Studio is a "fully managed offering" for the full lifecycle of agents, apps and workflows, and the engine of the SAP Business AI Platform. It supports intent-based development (natural language → PRD, tech spec, code scaffolding, tests, live preview), works with VS Code, Cursor and other agentic IDEs, supports LangChain, Pydantic AI and LlamaIndex, and embeds a managed n8n environment and Vercel (Next.js frontends). Its managed runtime uses NVIDIA OpenShell sandboxes, monitoring via Signavio, LeanIX and SAP Cloud ALM, and HANA Cloud-backed long-term memory. "Joule Work" is the new end-user engagement layer. **Free design-time access through end of 2026 (fair use)** — [SAP News, 13 May 2026](https://news.sap.com/2026/05/new-joule-studio-enterprise-scale-agentic-development/)
- Joule Studio 2.0 is announced for rollout from June 2026, with regional availability to be confirmed — [United VARs](https://www.united-vars.com/en/beyond/from-sap-btp-to-sap-baip-why-sap-renamed-the-platform-and-what-changed). A secondary source says it reached GA at Sapphire — [TrailHQ](https://trailhq.com/blog/sap-sapphire-2026-the-complete-breakdown). These two sources conflict on the GA timing.
- SAP Learning distinguishes "Joule Studio Classic" (part of SAP Build, low-code agents and skills) from the new SAP-managed "Joule Studio", which generates CAP applications and integrates Signavio, LeanIX, AI Agent Hub, Domain Models and Knowledge Graph. Runtimes: CF and Kyma for SAP Build, plus an SAP-managed Joule (Studio) runtime. The "Business Agent Framework" is SAP-managed and multitenant — [SAP Learning: Development Tools](https://learning.sap.com/courses/exploring-sap-business-ai-platform-architecture/exploring-development-tools_d34f92af-d33e-4cc0-92a3-3d4122dc1b5a)
- Developers can use Python, TypeScript, Claude Code or Cursor, deploying into a managed space — [SiliconANGLE](https://siliconangle.com/2026/05/12/sap-recasts-joule-front-door-autonomous-enterprise-ai)

**SAP Build Apps (DEPRECATED as standalone)**
- "SAP Build Apps is being deprecated as a standalone product" as part of simplifying SAP Build. Existing BTPEA, PAYG, CPEA and subscription customers keep full access for their current contract term. The SAP AppGyver community edition remains — [sap.com: SAP Build Apps](https://www.sap.com/products/technology-platform/low-code-app-builder.html)
- Retired as a standalone product as of **23 March 2026** — [SAP Learning: Development Tools](https://learning.sap.com/courses/exploring-sap-business-ai-platform-architecture/exploring-development-tools_d34f92af-d33e-4cc0-92a3-3d4122dc1b5a). (The sap.com page gives no date.)
- Former name: SAP AppGyver (community edition still named so) — [sap.com: SAP Build Apps](https://www.sap.com/products/technology-platform/low-code-app-builder.html)

**SAP Build Process Automation**
- The evolution of the former SAP Workflow Management and SAP Intelligent Robotic Process Automation. It covers workflows, RPA bots and document-heavy processes — [SAP Learning: Development Tools](https://learning.sap.com/courses/exploring-sap-business-ai-platform-architecture/exploring-development-tools_d34f92af-d33e-4cc0-92a3-3d4122dc1b5a)
- TechEd 2025 session AD819 covered "What's new for process automation, Joule skills, and agents in SAP Build" (updated September 2026) — [sap.com asset](https://www.sap.com/assetdetail/2025/11/b25304bb-297f-0010-bca6-c68f7e60039b.html)
- It is a task provider for SAP Task Center — [SAP Task Center FAQ](https://pages.community.sap.com/topics/task-center/faq)

**SAP Build Work Zone (standard / advanced)**
- Former names: SAP Launchpad service → SAP Build Work Zone, standard edition; SAP Work Zone → SAP Build Work Zone, advanced edition. Renamed at TechEd 2022, in cockpit/UI from January 2023, with no functional or commercial change — [SAP Community: Work Zone FAQ](https://pages.community.sap.com/topics/work-zone/faq)
- Standard: central entry point to multiple SAP cloud/on-prem systems incl. S/4HANA, branding, shell plug-ins, enterprise search into S/4 data, Task Center integration. Pages are admin-created. Advanced: business-user content, workspaces, more widgets, templates, MS Teams integration, and a bi-directional Task Center provider since Q3 2023 — [Work Zone FAQ](https://pages.community.sap.com/topics/work-zone/faq)
- Licensing: standard has subscription or consumption options and is in the free tier and trial (CPEA, PAYG, subscription). Advanced is consumption-based (monthly active users or connections), via CPEA/PAYG, not in free tier or trial — [Work Zone FAQ](https://pages.community.sap.com/topics/work-zone/faq)

**SAP Task Center**
- A single inbox federating tasks from providers via a unified REST interface and task cache. Runs in BTP Cloud Foundry. Providers: S/4HANA (from 1809, incl. Cloud and Private Edition), SuccessFactors, SAP Build Process Automation, Fieldglass, Ariba, Concur and others. Not ECC (use Fiori My Inbox) and not SAP Workflow Management. UIs: Task Center web app, SAP Mobile Start, Work Zone — [SAP Task Center FAQ](https://pages.community.sap.com/topics/task-center/faq); [sap.com: Task Center](https://www.sap.com/products/technology-platform/task-center.html)
- Licensing: requires a consumption-based global account (CPEA/PAYG). Cloud-provider usage is free, while on-prem S/4HANA integration is charged per task. Subscription accounts are not supported — [Task Center FAQ](https://pages.community.sap.com/topics/task-center/faq). sap.com says PAYG or BTPEA, price on request — [sap.com: Task Center](https://www.sap.com/products/technology-platform/task-center.html)

**CAP (Cloud Application Programming Model)** – sourced only indirectly: SAP Build Code is built on CAP, and Joule Studio (2026) generates CAP applications — [SAP Learning: Development Tools](https://learning.sap.com/courses/exploring-sap-business-ai-platform-architecture/exploring-development-tools_d34f92af-d33e-4cc0-92a3-3d4122dc1b5a)

### Inferences
- For S/4 projects in late 2026: on-stack work happens in ADT plus ABAP Cloud/RAP (with Joule for developers / ABAP AI via AI Units). Side-by-side pro-code uses CAP in SAP Build Code/BAS or in agentic IDEs via SAP MCP servers and the VS Code extension. Workflow and approvals use SAP Build Process Automation plus Task Center. The entry point is SAP Build Work Zone standard. New agentic or AI extensions go to Joule Studio. Avoid new SAP Build Apps investments.
- The Joule Studio naming is in flux ("Joule Studio in SAP Build" → "Joule Studio Classic"; new "Joule Studio" / "Joule Studio 2.0"). A report should quote the date with each name.

### Gaps
- Not verified this session: SAP Mobile Services (formerly SAP Cloud Platform Mobile Services; MDK / SAP BTP SDK for iOS/Android). No 2026 status found. Background (unverified): still offered on CF and used for SAP Service and Asset Manager and MDK apps, and needs Cloud Connector for on-prem S/4 OData.
- CAP technical details (CDS models, Node.js/Java runtimes, cds-plugin ecosystem, CAP-based remote service consumption of S/4 OData via destinations) are background knowledge only.
- Pricing of the new Joule Studio runtime (post-2026) was not found.
- Whether SAP Build Code and BAS are formally renamed or merged into Joule Studio in 2026 was not confirmed.

---

## 4. Core platform services and how they connect to S/4HANA

### Takeaway
On-prem and RISE/private S/4HANA systems connect to BTP through the SAP Cloud Connector. This is an outbound-only, reverse-invoke agent in the customer network that supports HTTP and RFC, principal propagation and HA. BTP apps reach it through destinations (Destination service) and the Connectivity service. Released OData/RAP APIs and events are found in the SAP Business Accelerator Hub. Many supporting services (Audit Log, Alert Notification, Credential Store, Feature Flags, Cloud Transport Management, CI/CD) could not be re-verified this session.

### Cited Findings
- **SAP Cloud Connector:** an SAP agent in the customer's on-prem network acting as a "reverse invoke proxy" to BTP or S/4HANA Cloud. Because the connection is initiated from inside, no inbound firewall ports or DMZ reverse proxy are needed. Supports HTTP and RFC, fine-grained access control with virtual host/port mapping, principal propagation of cloud user identity, HA setup (multiple connectors per subaccount), auto-reconnect and audit logging — [SAP Learning: Explaining the SAP Cloud Connector](https://learning.sap.com/courses/implementing-sap-service-and-asset-manager/explaining-the-sap-cloud-connector)
- Principal propagation setup with S/4HANA is part of SAP's Work Zone standard / Mobile Start learning journey — [SAP Learning: Setting Up SAP S/4HANA for Principal Propagation](https://learning.sap.com/learning-journeys/Setting-Up-SAP-Build-Work-Zone-standard-edition-and-SAP-Mobile-Start-with-SAP-S-4HANA/setting-up-sap-s-4hana-for-principal-propagation)
- **SAP Cloud Identity Services:** Identity Authentication (SSO, SAML 2.0, 2FA, risk-based auth, SCIM API, can proxy to corporate IdP) and Identity Provisioning (user/group lifecycle across cloud and on-prem). SAP recommends a custom IAS tenant as IdP for platform and business users, connected to the corporate IdP — [SAP Learning: Explaining SAP BTP Accounts](https://learning.sap.com/courses/introducing-sap-cloud-identity-services/explaining-global-accounts-and-subaccounts)
- SAP Customer Identity and Access Management became part of BTP (via BTPEA) in May 2025 — [SAP News, 22 May 2025](https://news.sap.com/?p=233953)
- **SAP HANA Cloud:** gained MCP support and serves as long-term agent memory (TechEd 2025) — [The New Stack](https://thenewstack.io/sap-expands-its-ai-stack-for-developers/). It backs persistent memory of Joule Studio runtime agents — [SAP News, 13 May 2026](https://news.sap.com/2026/05/new-joule-studio-enterprise-scale-agentic-development/). Knowledge-graph generation capability announced at TechEd 2025 — [Constellation Research](https://www.constellationr.com/insights/news/sap-rolls-out-developer-tools-joule-ecosystem-connections)
- **SAP Business Accelerator Hub** (catalog): one of the places to find released APIs, alongside the Cloudification Repository and the system itself — [SAP Learning: Clean Core Best Practices](https://learning.sap.com/courses/practicing-clean-core-extensibility-for-sap-s-4hana-cloud/explaining-extensibility-model-best-practices_e290f382-800e-40ef-a203-85a13115f487). ASUG refers to it as the "SAP API Hub" — [ASUG](https://www.asug.com/insights/sap-updates-clean-core-guidance-to-help-customers-clarify-extensibility-criteria)
- **SAP Cloud Transport Management / SAP Continuous Integration and Delivery:** SAP has a DevOps reference architecture and learning content ("Reflecting your delivery landscape in Transport Management") and a CAP + TMS tutorial, but the fetched pages returned no content — [SAP Architecture Center: DevOps with SAP BTP](https://architecture.learning.sap.com/docs/ref-arch/1c5706feb5); [SAP Learning: Exploring DevOps with SAP BTP](https://learning.sap.com/courses/exploring-devops-with-sap-btp/reflecting-your-delivery-landscape-in-transport-management_f4bd6490-5642-41a9-aa4f-3289d95a056b); [SAP Developers: BTP Transport Management with CAP](https://developers.sap.com/tutorials/btp-transport-management-cap..html)
- **Graph (formerly "SAP Graph"):** now a capability of API Management in SAP Integration Suite ("Graph in SAP Integration Suite"). It is a unified API over SAP-managed data, forwards calls to source systems and does not store data. No retirement notice on the FAQ page — [SAP Community: Graph in SAP Integration Suite FAQ](https://pages.community.sap.com/topics/graph/faq). (Neighbour topic: Integration Suite.)

### Inferences
- Standard S/4 side-by-side wiring: S/4 (on-prem/Private) ↔ Cloud Connector (location ID per subaccount) ↔ Connectivity service ↔ Destination (OAuth/SAML/principal propagation) ↔ CAP or Build app consuming released OData V2/V4 (RAP) APIs. For Public Edition, direct HTTPS destinations are used with communication arrangements. Events go via SAP Event Mesh / Advanced Event Mesh (Integration Suite neighbour). This is background synthesis consistent with the cited Cloud Connector facts.

### Gaps (not verified this session – background knowledge, mark as unverified in the report)
- **Destination service / Connectivity service:** BTP services storing target URL, auth type (BasicAuthentication, OAuth2SAMLBearerAssertion, PrincipalPropagation, OAuth2ClientCredentials), proxy type (Internet / OnPremise) and location ID. Consumed by CAP, SAP Build, Work Zone, Process Automation and Task Center. Not re-verified.
- **SAP Audit Log service, SAP Alert Notification service, SAP Credential Store, SAP Feature Flags service, SAP Automation Pilot:** no 2025/2026 status found. No retirement notices surfaced, though the absence of evidence is not proof of continued availability. Feature Flags specifically: only a 2018 SAP blog was found.
- **SAP Cloud Transport Management** (TMS: transport nodes and routes for MTA/BTP content, integrable with CTS+ and SAP Cloud ALM) and **SAP Continuous Integration and Delivery** (pipeline service for CAP/Fiori/ABAP environment, based on Project "Piper"): current status and any Cloud ALM consolidation were not verified.
- **SAP Graph** standalone retirement: no explicit end-of-service notice found. The current state is "Graph in SAP Integration Suite".
- Cloud Connector current version, location IDs and TCP/LDAP protocol support: not verified.

---

## 5. What changed in 2025/2026

### Takeaway
Between 2025 and 2026, SAP replaced the 3-tier model with clean core Levels A–D (August 2025). It made Joule Studio GA inside SAP Build (skills mid-2025, agents December 2025), and at TechEd 2025 opened SAP Build to agentic IDEs (VS Code extension, MCP servers, ABAP MCP server, ABAP LLMs for 2026). It began deprecating SAP Build Apps as standalone (March 2026). At Sapphire (May 2026) it launched the SAP Business AI Platform umbrella and a new fully managed Joule Studio with its own runtime, free design time through end of 2026. Neo's end of life at 31 December 2028 remains in place.

### Cited Findings (chronological)
- **Mar 2025:** Joule for developers announced with an ABAP LLM, a free trial in SAP Build Code and a free ABAP AI offer — [Mastering SAP](https://masteringsap.com/blogs/sap-announces-joule-for-developers/)
- **May 2025 (Sapphire 2025):** Joule Studio in SAP Build (GA June 2025). SAP Build gets "new simplified pricing and packaging". Extensibility wizard live for Public Edition, with Private Edition later in 2025. CAP connects to BDC data products. SAP Customer Identity and Access Management added to BTP — [SAP News, 22 May 2025](https://news.sap.com/?p=233953)
- **Jul 2025:** Joule Studio skill builder GA — [sap.com: Joule Studio](https://www.sap.com/mena/products/artificial-intelligence/joule-studio.html)
- **Aug 2025:** clean core levels A–D replace the 3-tier model — [SAP News, 12 Aug 2025](https://news.sap.com/2025/08/extend-sap-s4hana-cloud-right-way-clean-clear/); [ASUG](https://www.asug.com/insights/sap-updates-clean-core-guidance-to-help-customers-clarify-extensibility-criteria)
- **Nov 2025 (TechEd Berlin):** SAP Build VS Code extension. Local SAP MCP servers for Claude Code, Cline, Windsurf and Cursor. ABAP MCP server. ABAP LLMs in 2026. Joule Studio agent builder GA December 2025 with A2A and system-triggered agents. MCP Gateway in Integration Suite. BTP support for CrewAI and LangGraph. n8n partnership. HANA Cloud as agent memory — [The New Stack](https://thenewstack.io/sap-expands-its-ai-stack-for-developers/); [Constellation Research](https://www.constellationr.com/insights/news/sap-rolls-out-developer-tools-joule-ecosystem-connections)
- **Q1 2026:** promotion letting SAP Build customers run custom Joule agents at no cost — [sap.com: Joule Studio](https://www.sap.com/mena/products/artificial-intelligence/joule-studio.html)
- **23 Mar 2026:** SAP Build Apps retired as a standalone product, with existing contracts honoured — [SAP Learning](https://learning.sap.com/courses/exploring-sap-business-ai-platform-architecture/exploring-development-tools_d34f92af-d33e-4cc0-92a3-3d4122dc1b5a); [sap.com: SAP Build Apps](https://www.sap.com/products/technology-platform/low-code-app-builder.html)
- **12–13 May 2026 (Sapphire Orlando):** SAP Business AI Platform (BTP + BDC + Business AI, plus LeanIX and Signavio). New fully managed Joule Studio with Joule runtime, n8n, Vercel, NVIDIA OpenShell and free design time through 31 December 2026. Joule Work. SAP AI Agent Hub (governance, built on LeanIX). SAP Knowledge Graph. 50+ Joule Assistants — [SAP News](https://news.sap.com/2026/05/new-joule-studio-enterprise-scale-agentic-development/); [SiliconANGLE](https://siliconangle.com/2026/05/12/sap-recasts-joule-front-door-autonomous-enterprise-ai); [SAPinsider](https://sapinsider.org/map/sap-business-ai-platform-btp-foundation-sapphire-2026/)
- Secondary-source claims from Sapphire 2026 (verify before use): AI Agent Hub GA Q3 2026; A2A with Google Cloud and Microsoft GA Q4 2026; ABAP code conversion agent GA; Anthropic Claude as a primary reasoning model across Joule; RISE contracts include 3 Joule Assistants in year 1; new AI features require RISE or moving at least 50% of maintenance to cloud — [TrailHQ/Nanonets](https://trailhq.com/blog/sap-sapphire-2026-the-complete-breakdown)
- **30 Jun 2026:** BTP partner competency renamed to BAIP competency — [United VARs](https://www.united-vars.com/en/beyond/from-sap-btp-to-sap-baip-why-sap-renamed-the-platform-and-what-changed)
- **Neo:** end of life 31 December 2028, unchanged — [SAPinsider](https://sapinsider.org/blogs/sap-announces-sunset-of-neo-cloud-environment/)

### Inferences
- The shift for S/4 projects: "keep the core clean" is now measured by Levels A–D rather than tiers. BTP side-by-side development is increasingly AI-assisted (Joule Studio, MCP into IDEs), and governance moves to AI Agent Hub, LeanIX and Cloud ALM.
- For test management, agentic extensions add a new test object class (agents and skills with non-deterministic behaviour). Joule Studio's built-in test artifacts and Cloud ALM monitoring hooks are relevant, but no source describes formal test tooling for agents.

### Gaps
- SAP's official "new BTP pricing" for 2026 (if any) was not found. Only third-party commentary is available.
- Confirmation of the Joule Studio 2.0 GA date and regional availability: sources conflict (GA at Sapphire vs. rollout from June 2026).
- Whether SAP Build Process Automation, Work Zone or Task Center are being folded into Joule Studio or Joule Work was not found. "Joule Work" is new and its relation to Work Zone is unclear.
- Retirement status of the SAP Graph standalone service, SAP Workflow Management (superseded by SAP Build Process Automation per SAP Learning) and SAP Intelligent RPA (superseded): end-of-service dates not found.
