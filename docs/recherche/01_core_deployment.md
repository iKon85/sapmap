# SAP S/4HANA Core, Deployment Options and In-Core Components (as of October 2026)

Research note: compiled 2026-10-24. The session web-search budget ran out (shared limit) before every component could be researched separately. Components marked **[background, unverified]** come from the researcher's prior knowledge (cutoff mid-2026) and were NOT checked against a source in this session. The report writer should label them that way or leave them out.

---

## 1. Deployment variants and naming (SAP Cloud ERP, SAP Cloud ERP Private, on-premise, SAP Business Suite)

### Takeaway
In spring 2025 SAP renamed its cloud ERP for marketing purposes. S/4HANA Cloud Public Edition became **SAP Cloud ERP**, S/4HANA Cloud Private Edition became **SAP Cloud ERP Private**, and GROW with SAP became **SAP GROW**. The contractual/licensed product names (SAP S/4HANA Cloud Public/Private Edition) stay the same in contracts and backend systems. All of them now sit under the **SAP Business Suite** umbrella, introduced in February 2025. The on-premise product is still SAP S/4HANA (release 2025), and it shares its code line with Private.

### Cited Findings
- Renaming: S/4HANA Cloud, public edition → **SAP Cloud ERP**; S/4HANA Cloud, private edition → **SAP Cloud ERP Private**; GROW with SAP → **SAP GROW**. Announced "in spring 2025". This is a marketing/sales change: "both licensed product names remain the same in contracts and backend systems". The products sit under the SAP Business Suite umbrella. — [TIMETOACT](https://www.timetoact-group.com/content-share/wca/blog/sap-simplifies-the-naming-of-its-cloud-erp-offering-144257)
- Status of "RISE with SAP": sources disagree. TIMETOACT keeps "RISE with SAP" as the name. — [TIMETOACT](https://www.timetoact-group.com/content-share/wca/blog/sap-simplifies-the-naming-of-its-cloud-erp-offering-144257). Anglepoint says RISE with SAP Premium is replaced by the package SAP Cloud ERP Private, and RISE is now "the methodology, not a commercial product". — [Anglepoint](https://www.anglepoint.com/blog/articles/sap-cloud-erp-key-changes-and-how-to-respond/). SAP itself still uses "RISE with SAP" in 2025/2026 material: "RISE with SAP Methodology dashboard", and at Sapphire 2026 "Migration and modernization assistants in RISE with SAP". — [SAP News Aug 2025](https://news.sap.com/2025/08/extend-sap-s4hana-cloud-right-way-clean-clear/), [SAPinsider Sapphire 2026](https://sapinsider.org/articles/sap-sapphire-2026-autonomous-enterprise-erp-business-ai/)
- **SAP Business Suite** was introduced in February 2025. It combines cloud ERP, business applications, SAP Business Data Cloud and SAP Business AI on SAP Business Technology Platform. — [SAP Sapphire Innovation Guide ERP](https://www.sap.com/events/sapphire/innovation-guide/erp.html)
- SAP Business Suite packages ("now available"): **Finance** (lead-to-cash, procure-to-pay, record-to-report, incl. SAP Taulia working capital), **Supply Chain Management**, **Human Capital Management Core**, **Strategic Procurement** (SAP Ariba), **Customer Experience**. All packages include SAP Build, so customers can extend while keeping a clean core. — [SAP Sapphire Innovation Guide ERP](https://www.sap.com/events/sapphire/innovation-guide/erp.html)
- Edition characteristics: Public Edition is multi-tenant SaaS, fully managed by SAP, with standardized processes, limited customization and mandatory updates. Private Edition is single-tenant, aligned with on-premise S/4HANA, and hosted on SAP-managed infrastructure or a hyperscaler (AWS, Azure, ...). — [Rimini Street (third party)](https://www.riministreet.com/blog/sap-s4hana-2602-decoded-what-the-release-reveals-about-sap-innovation/)
- The public cloud release 2602 (February 2026) is "delivered exclusively to SAP Cloud ERP Public Edition customers". It is a cloud-only code line. On-premise and Private get only selected backported enhancements. Latest Private release: 2025. — [Rimini Street](https://www.riministreet.com/blog/sap-s4hana-2602-decoded-what-the-release-reveals-about-sap-innovation/) (third-party support vendor with an interest in the topic; the facts are consistent with SAP's model)
- Sapphire 2025 innovation items reference "SAP Cloud ERP Private" and "SAP Cloud ERP" as product names (e.g. B2B Self-Service Portal integrated with SAP Cloud ERP; planned ITAR compliance for SAP Cloud ERP Private via SAP NS2 + Google Cloud). — [SAP Sapphire Innovation Guide ERP](https://www.sap.com/events/sapphire/innovation-guide/erp.html)
- SAP News uses the title "SAP Cloud ERP Private 2025 release" (13 Oct 2025, Uma Rani T M, President and CPO Private Cloud ERP). — [SAP News](https://news.sap.com/2025/10/sap-cloud-erp-private-2025-release-innovation-impact/)

### Inferences
- For a test manager, contracts, SAP for Me, SAP Notes and system components will keep showing "SAP S/4HANA Cloud Private Edition" / "SAP S/4HANA" (S4CORE). Marketing, roadmaps and SAP News say "SAP Cloud ERP (Private)". Both terms should be treated as synonyms in project documents.
- On-premise S/4HANA (customer-operated, licensed) and SAP Cloud ERP Private share one code line (release 2025). SAP Cloud ERP (public) runs its own code line (YYMM releases: 2602, 2608).

### Gaps
- No primary SAP press release on the renaming was retrieved. The timing ("spring 2025", likely Sapphire 2025) and the exact SAP wording should be checked on news.sap.com.
- Whether "SAP Cloud ERP" is also used as an umbrella for both editions (Rimini Street says "SAP Cloud ERP ... has Public and Private Editions") or only for public is used inconsistently across sources.

---

## 2. RISE with SAP / SAP Cloud ERP Private packaging and SAP GROW: what is bundled

### Takeaway
The original RISE bundle (2021) contained the S/4HANA subscription, managed infrastructure and services, BTP credits, starter packs for SAP Signavio and SAP Business Network, and transformation tooling. From October 2023 the options were Base, Premium and Premium Plus. In 2025 SAP repackaged: Premium became the "SAP Cloud ERP Private" package, Premium Plus was discontinued, LeanIX was added, and Datasphere and AI units were unbundled. The exact 2025/2026 inclusions come only from secondary licensing advisors and need confirming against SAP's price list.

### Cited Findings
- Classic RISE bundle: S/4HANA subscription, managed infrastructure and service, BTP starter credits, "starter packages for Signavio and SAP Business Network". Excludes SuccessFactors, Concur, Ariba beyond the basic Business Network starter, Commerce Cloud, etc. Digital access is outside the FUE subscription and charged per document. — [Redress Compliance](https://redresscompliance.com/rise-with-sap-tiers-and-july-2025-premium-packaging-changes)
- Packaging from October 2023 (RISE with SAP S/4HANA Cloud, private edition):
  - **Base**: S/4HANA Cloud PE, SAP Build Work Zone, Group Reporting; SAP data centers only.
  - **Premium**: Base plus SAP Signavio Process Insights, Process Manager, Collaboration Hub; CPEA credits for SAP BTP; SAP Build Process Automation and SAP Build Apps.
  - **Premium Plus**: Premium plus Cash Management, Receivables Management, Group Reporting Data Collection, SAC Planning, SAP Procurement Network Supplier Portal, Sustainability Footprint Management and Sustainability Control Tower, Joule, SAP Datasphere.
  — [SAPinsider, Dec 2023](https://sapinsider.org/analyst-insights/rise-with-sap-now-has-multiple-packaging-options/) **(superseded by 2025 repackaging)**
- 2025 repackaging: RISE with SAP Premium renamed to Cloud ERP Private (Edition). **Premium Plus discontinued**. **LeanIX added**. **SAP Datasphere no longer bundled**. AI units (previously in Premium Plus) are now a separate, consumption-priced add-on. FUE volume tiers and per-FUE price revised in 2025. — [Embee (reseller blog, Aug 2026)](https://embee.co.in/blog/rise-with-sap-rebrand-cloud-erp-private/)
- Similar claims: the Base/Premium/Premium Plus tiers merged into one offering with about twice as many modules as old RISE Premium. Datasphere and sustainability tools are now separate. Premium Joule/AI is consumed via BTP and AI Units, while base Joule stays included with a modest cap. — [Redress Compliance](https://redresscompliance.com/sap-rise-2026-what-changed.html) (consultancy marketing; figures unsourced)
- SAP Cloud ERP Private bundles S/4HANA Cloud Private Edition with Signavio and LeanIX plus managed infrastructure and operations. Package options: Comprehensive, Limited, Base, Tailored. Pricing tiers rose from 9 to 14. — [Anglepoint](https://www.anglepoint.com/blog/articles/sap-cloud-erp-key-changes-and-how-to-respond/) (only this source names these options; unverified)
- Joule with S/4HANA Cloud Private Edition is sold as a plan "SAP S/4HANA Cloud Private Edition, Joule". "AI Units are currently required to use this AI offering". Activation is via "Activate with AI Units". — [SAP product page](https://www.sap.com/products/erp/joule-with-sap-s4hana-cloud-private-edition.html)
- Sapphire 2026: RISE customers get contractual activation of three Joule Assistants in the first year. — [SAPinsider](https://sapinsider.org/articles/sapphire-2026-your-sap-erp-just-got-an-ai-brain-now-what-seven-questions-every-leader-must-answer/)
- RISE methodology runs on SAP Cloud ALM: the "RISE with SAP Methodology dashboard" is hosted on SAP Cloud ALM. — [SAP Learning](https://learning.sap.com/courses/managing-clean-core-for-sap-cloud-erp/describing-the-clean-core-measurement-framework)
- RISE path is for modernizing ECC or S/4HANA legacy systems. GROW is for new cloud ERP customers. — [Anglepoint](https://www.anglepoint.com/blog/articles/sap-cloud-erp-key-changes-and-how-to-respond/)

### Inferences
- For testing: SAP Cloud ALM (included in cloud subscriptions as part of Enterprise Support, cloud editions **[background, unverified]**) is the de facto ALM/test management tool in RISE/GROW projects, because the RISE methodology dashboard and clean core KPIs live there.
- Signavio (Process Insights/Manager) and LeanIX in the bundle give the test manager process models and architecture inventories to derive test scope from.

### Gaps
- No primary SAP document (price list or SAP news) on the 2025 "SAP Cloud ERP Private" package contents was retrieved. The "July 2025 premium packaging changes" referenced in a Redress URL could not be verified.
- **SAP GROW** package contents (SAP Cloud ERP plus BTP credits, SAP Learning Hub, Signavio?, Cloud ALM, SAP Build) were not verified. The search budget was exhausted.
- Whether the Business Network starter pack is still part of the 2025+ package is not confirmed.
- **Max Success Plan** (commercial deal at Sapphire 2026, see section 7): exact contents unknown.

---

## 3. Release strategy and maintenance (S/4HANA 2023/2025/2027, 2033/2040, ECC)

### Takeaway
From release 2023 on, S/4HANA (on-premise and Cloud ERP Private) has a **two-year major release cycle** and **7 years of mainstream maintenance** per release. Feature Pack Stacks (FPS) arrive every six months, and the predecessor release gets corrections-only SPS. Current release: **S/4HANA 2025 / SAP Cloud ERP Private 2025** (FPS0 October 2025, FPS01 9 March 2026). The next release is expected in 2027 (inferred from the cadence, not confirmed). SAP commits to S/4HANA support until at least **2040**. ECC 6.0 mainstream maintenance ends **31 Dec 2027**, and extended maintenance ends **31 Dec 2030**. The **SAP ERP, private edition, transition option** extends ECC on RISE to the end of 2033.

### Cited Findings
- Two-year major release cycle after 2023, with FPS every six months and 7 years of maintenance per release. S/4HANA 2023 was released 11 Oct 2023. — [Constellation Research, Sep 2023](https://www.constellationr.com/insights/news/sap-launches-joule-generative-ai-copilot-goes-2-year-s4hana-cloud-major-release-cycle)
- SAP Learning (Private Edition): two-year base release cycle after 2023, mainstream maintenance of 7 years per base release, FPS every 6 months until the next base release. After a new base release the previous one gets SPS (corrections only) every 6 months until mainstream maintenance ends. RISE obligation: at least one upgrade every seven years to stay in mainstream maintenance. Customers can request one upgrade per year. SAP performs the technical upgrade, and **planning, preparation and testing fall to the customer/partner**. — [SAP Learning](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-private-edition/navigating-release-upgrades_ae2d796c-bafd-4e04-8b41-562ebda9eb49)
- Release history: 1511 (S4CORE 100) ... 2020 (105), 2021 (106), 2022 (107), 2023 (S4CORE 108, Oct 2023). Releases from October 2023 get 7 years of mainstream maintenance. — [Wikipedia](https://en.wikipedia.org/wiki/SAP_S/4HANA)
- S/4HANA 2025 released October 2025. FPS01 released **9 March 2026**. SAVIC says "on a quarterly cadence", which contradicts SAP Learning's six-monthly FPS. SAVIC gives mainstream maintenance end for 2025 as "December 2030", which **contradicts the 7-year rule** (7 years from 2025 = end 2032). — [SAVIC](https://www.savictech.com/insights/sap-s4hana-2025-fps01-ai-embedded-erp-2026/). FPS01 date also confirmed by [SAPinsider](https://sapinsider.org/articles/sap-cloud-erp-private-provides-continuous-innovation-with-fps01/)
- SAP Cloud ERP Private 2025 release (SAP News, 13 Oct 2025): "fully compatible with previous scopes, eliminating multi-step upgrades", near-zero-downtime upgrades. Universal parallel accounting, value chain analysis, enhanced Advanced ATP, multistage intercompany sales and stock transfer, more than 200 pre-delivered data products via SAP Business Data Cloud, "Cloud ERP Intelligence Private" in development. Joule Agents: Accounts Receivable Agent, Dispute Management Agent, Maintenance Planner Agent. — [SAP News](https://news.sap.com/2025/10/sap-cloud-erp-private-2025-release-innovation-impact/)
- FPS01 (Mar 2026): Joule conversational shortcuts, multistage intercompany extended to two-entity transfers, Change Record Management Agent (R&D), industry data products (retail, asset management). — [SAPinsider](https://sapinsider.org/articles/sap-cloud-erp-private-provides-continuous-innovation-with-fps01/)
- S/4HANA support "at least through 2040". Business Suite 7 (ERP 6.0, CRM, SCM, SRM core apps): mainstream maintenance ends end of 2027, extended maintenance until end of 2030 (+2% on top of the 20% maintenance fee). After 2030 only customer-specific maintenance. Announced Feb 2020. — [CIO.com](https://www.cio.com/article/3519410/sap-promises-to-support-s4hana-through-2040.html)
- **SAP ERP, private edition, transition option** (announced 13 Feb 2025): requires a RISE with SAP contract. All systems on HANA by 31 Dec 2031 at the latest. Subscription from 2031 at the latest until end of 2033. Move to S/4HANA private cloud by 31 Dec 2033. HANA is the only supported DB. Higher fees 2031–2033. Scope is SAP ECC only, not full Business Suite 7. Contracts not before 2028. **Does not extend maintenance for existing on-prem ECC** (still 2027/2030). — [Consilio](https://www.consilio-gmbh.de/en/trendblog/extension-of-the-s-4hana-migration-deadline-to-2033-with-sap-erp-private-edition-transition-option)
- SAP Cloud ERP (public) release 2602 = February 2026. — [Rimini Street](https://www.riministreet.com/blog/sap-s4hana-2602-decoded-what-the-release-reveals-about-sap-innovation/). SAP Learning runs "2608 Early Release Series" live sessions, so release 2608 = August 2026. — [SAP Learning](https://learning.sap.com/live-sessions/artificial-intelligence-2608-early-release-series)

### Inferences
- Derived from the 7-year rule: S/4HANA 2023 → mainstream maintenance to end of 2030. S/4HANA 2025 → end of 2032. A 2027 release would run to about 2034. **These must be confirmed against SAP Note / SAP release strategy page.** The SAVIC claim (2025 → Dec 2030) is most likely wrong.
- S/4HANA 2022 and older follow the old 5-year rule. 2022 → end of 2027 **[background, unverified]**. New projects should go live on 2025 (FPS01/02).
- SAP Cloud ERP (public): two releases a year (YYMM, Feb/Aug) plus hotfix collections. The test manager must plan regression testing twice a year, and SAP Cloud ALM test automation helps with this **[background, unverified]**.
- In RISE the customer owns upgrade testing (per SAP Learning). Regression test packs are a core deliverable.

### Gaps
- No official SAP release-strategy page or SAP Note with per-release end dates (2023/2025) was retrieved.
- Next release "S/4HANA 2027" is not confirmed in any source. It is only implied by the two-year cadence.
- FPS02 date for 2025 (expected around autumn 2026) is not verified.

---

## 4. Clean Core: definition, levels A–D, ABAP Cloud, measurement

### Takeaway
In August 2025 SAP replaced the three-tier extensibility model with a four-level **clean core** maturity model (A–D) that grades every extension by upgrade stability. A = released APIs / ABAP Cloud / BTP. B = classic APIs. C = access to internal objects. D = modifications and other non-recommended techniques. Compliance is measured with the ABAP test cockpit (ATC) at code level, and with the Clean Core Measurement Framework KPIs in the **RISE with SAP Methodology dashboard hosted on SAP Cloud ALM**.

### Cited Findings
- SAP News, 12 Aug 2025 (Rudolf Hois, Priyadarsana Panda, Steffen Pietsch):
  - **Level A, "Extend with SAP Build"**: fully compliant; "publicly released and stable SAP interfaces, backed by formal stability contracts"; side-by-side on BTP or on-stack via ABAP Cloud with public APIs.
  - **Level B, "Leverage classic APIs"**: Level A plus SAP's classic APIs and technologies (documented, generally upgrade-stable).
  - **Level C, "Accesses internal objects"**: partially compliant, adds upgrade risk. SAP **plans** a changelog for SAP objects so customers can spot changes early.
  - **Level D, "Not recommended extensions"**: not clean; modifications, write access to SAP tables, implicit enhancements; highest risk.
  - ABAP Cloud is part of SAP Build and enforces clean principles via syntax checks. The ABAP test cockpit is the key tool for code-level governance. The RISE with SAP Methodology dashboard gives real-time insight into clean core adoption.
  — [SAP News](https://news.sap.com/2025/08/extend-sap-s4hana-cloud-right-way-clean-clear/)
- The level concept replaces the previous three-tier model as an "enhanced maturity model". Level C is called "conditional clean core". Level D includes "noAPI objects". Remediation should be prioritized. — [ASUG](https://www.asug.com/insights/sap-updates-clean-core-guidance-to-help-customers-clarify-extensibility-criteria)
- Clean Core Measurement Framework: KPIs measure adherence to clean core principles across project phases and operations, derived from system data. A current clean core score and target score are set per principle and practice. Criteria are to be built into future Q-Gates of the RISE with SAP Methodology. The **RISE with SAP Methodology dashboard (hosted on SAP Cloud ALM)** monitors clean core KPIs for production and non-production S/4HANA Cloud systems. SAP plans to automate more KPIs. — [SAP Learning](https://learning.sap.com/courses/managing-clean-core-for-sap-cloud-erp/describing-the-clean-core-measurement-framework)
- SAP Cloud ALM supports the "Clean Core Success Plan". — [SAP Learning course title](https://learning.sap.com/courses/validating-business-transformations-leveraging-integrated-transformation-tools-solutions/managing-projects-and-clean-core-success-plan-with-sap-cloud-alm)
- All SAP Business Suite packages include SAP Build to extend while keeping a clean core. — [SAP Sapphire Innovation Guide](https://www.sap.com/events/sapphire/innovation-guide/erp.html)
- Clean core principles cover more than code. SAP's info page: [sap.com clean core](https://www.sap.com/products/erp/rise/methodology/clean-core.html) (linked from SAP News; not fetched)

### Inferences
- The five clean core dimensions (processes, extensibility, data, integration, operations) **[background, unverified]** are commonly used in SAP material. The fetched page did not list them.
- Test impact: Level C/D objects are prime candidates for regression tests on every FPS/upgrade. The planned SAP changelog for internal objects would support impact analysis.
- The old 3-tier model (Tier 1 ABAP Cloud, Tier 2 cloud API enablement/wrappers, Tier 3 classic) is **superseded** and should not be used in new concepts.

### Gaps
- Concrete ATC check variants for levels A–D (e.g. new "clean core" ATC check variant, Cloudification Repository) are not verified in this session.
- Status of the SAP changelog for internal objects (planned in Aug 2025) as of Oct 2026 is unknown.
- No dedicated "Cloud ALM clean core dashboard" product name was found apart from the RISE methodology dashboard.

---

## 5. Components in / on the core (fact sheets)

### Takeaway
Most logistics and finance components that used to be standalone (EWM, TM, PP/DS, aATP, Group Reporting, MDG) now run **embedded** in S/4HANA, often in a basic version included in the S/4 license and an advanced version licensed separately. Decentralized/standalone deployments still exist for EWM, TM, MDG (hub) and GTS (edition for SAP HANA, a separate system). Only a few components could be verified in this session. The rest are flagged as background.

### Cited Findings
**SAP Extended Warehouse Management (EWM)**
- Embedded EWM uses the same data as ERP. Quality management stays in ERP, and goods receipts, transfers and confirmations post in one system without interfaces. The **Basic variant is included in the S/4HANA license**. Advanced features (e.g. material flow control) need an **Advanced license**. In very high-volume scenarios shared system load may cause delays, so a load simulation is recommended. Decentralized EWM runs on its own instance with master data synchronization, interfaces and an Advanced license. — [consolut](https://consolut.com/en/insights/ewm-dezentral-oder-embedded-welcher-ewm-ansatz-ist-der-richtige/)
- 2025 FPS01: Predictive Labor Demand Planning extended to RF staging. QM integration blocks goods issue if inspection is incomplete or failed. Warehouse KPI Fiori app with AI labor recommendations. Joule in EWM outbound. — [SAVIC](https://www.savictech.com/insights/sap-s4hana-2025-fps01-ai-embedded-erp-2026/)

**SAP Transportation Management (TM)**
- 2025 FPS01: AI-assisted document processing extended to Bordero documents (auto-creates freight orders). — [SAVIC](https://www.savictech.com/insights/sap-s4hana-2025-fps01-ai-embedded-erp-2026/)
- Business Network Transportation Management: actual carrier emissions, ocean freight tendering and dispute handling (by end of 2025). — [SAP Sapphire Innovation Guide](https://www.sap.com/events/sapphire/innovation-guide/erp.html)

**Advanced ATP (aATP)**
- 2025 release: "Enhanced advanced available-to-promise (ATP) links order promising with logistics execution". — [SAP News](https://news.sap.com/2025/10/sap-cloud-erp-private-2025-release-innovation-impact/)

**Finance (Universal Journal, Group Reporting)**
- 2025 release: universal parallel accounting, value chain analysis, intercompany automation. — [SAP News](https://news.sap.com/2025/10/sap-cloud-erp-private-2025-release-innovation-impact/)
- FPS01: redesigned month-end cockpit, automated reconciliation checks in the Universal Journal. — [SAVIC](https://www.savictech.com/insights/sap-s4hana-2025-fps01-ai-embedded-erp-2026/)
- Group Reporting was part of the RISE Base package (2023) and Group Reporting Data Collection was part of Premium Plus. — [SAPinsider](https://sapinsider.org/analyst-insights/rise-with-sap-now-has-multiple-packaging-options/)

**SAP Master Data Governance (MDG)**
- Deployment: **hub** (central system, replication to S/4 and others) or **co-deployment** (on S/4HANA itself, no replication latency). — [SAP Learning](https://learning.sap.com/courses/introducing-sap-master-data-governance/describing-deployment-options-and-landscapes)
- **Classic mode** vs **cloud-ready mode**: cloud-ready is Fiori-only, key-user configurable, currently supports only the business partner domain, and can be activated in MDG on S/4HANA from release 2023, coexisting with classic. Adds federated MDG and integration with SAP Build Process Automation, Document Management service and Data Quality Management microservices. MDG cloud edition (BTP) = cloud-ready only. For PE/on-prem 2023, "cloud-ready is recommended". For the public edition it is planned (cloud-ready only). — [SAP Learning](https://learning.sap.com/courses/introducing-sap-master-data-governance/describing-deployment-options-and-landscapes)

**SAP Global Trade Services (GTS)**
- SAP GTS 11.0 support ended **31 Dec 2025**. The forward path is **SAP GTS, edition for SAP HANA**, and the move "is fundamentally a re-implementation". Integrations with S/4HANA must be reconfigured. — [SAPinsider](https://sapinsider.org/case-studies/sap-gts-11-0-support-has-ended-heres-how-to-move-forward-without-risk/)

**SAP Fiori**
- The Horizon theme is the default UI in S/4HANA 2025. — [SAVIC](https://www.savictech.com/insights/sap-s4hana-2025-fps01-ai-embedded-erp-2026/)

**Joule in S/4HANA (Private Edition)**
- Capabilities: natural-language navigation to apps (finance, sales, procurement, service, master data), answers from Help Portal documentation, business object insights (PO, PR, outbound delivery, sales order, BP) without opening apps. Licensed as "SAP S/4HANA Cloud Private Edition, Joule". **AI Units required**. — [SAP product page](https://www.sap.com/products/erp/joule-with-sap-s4hana-cloud-private-edition.html)
- Joule Agents in the 2025 release: Accounts Receivable Agent, Dispute Management Agent, Maintenance Planner Agent. — [SAP News](https://news.sap.com/2025/10/sap-cloud-erp-private-2025-release-innovation-impact/)
- Joule for Developers / ABAP AI capabilities offered as a product for S/4HANA Cloud Private Edition. — [SAP product page (listing)](https://www.sap.com/cz/products/financial-management/s4hana-cloud-private-edition-sap-joule-for-developers-abap-ai-capabilities.html)

**SAP Business Data Cloud (BDC) and S/4**
- BDC launched February 2025 and is part of SAP Business Suite. — [SAP Users / UKISUG](https://www.sapusers.org/resource/sap-sapphire-2026-the-key-announcements.html), [SAP Innovation Guide](https://www.sap.com/events/sapphire/innovation-guide/erp.html)
- More than 200 pre-delivered data products for Cloud ERP Private via BDC. "Cloud ERP Intelligence Private" is in development. — [SAP News](https://news.sap.com/2025/10/sap-cloud-erp-private-2025-release-innovation-impact/)

### Inferences — component fact sheets from background knowledge **[background, unverified in this session]**
- **SAP HANA** (database): S/4HANA runs only on SAP HANA (in-memory, columnar). On-prem and PE run on SAP HANA 2.0 (SPS07/SPS08 current). SAP HANA Cloud is the DBaaS on BTP and is not the S/4 primary DB. HANA 2.0 maintenance is aligned with S/4 (SAP has said through 2040 **[unverified]**).
- **SAP Fiori / SAPUI5 / SAP Fiori launchpad**: role-based UX. Front-end server embedded (default since 2020) or hub deployment. The launchpad is increasingly reached through SAP Build Work Zone / SAP Start. SAP GUI is still available on-prem/PE but not in the public edition.
- **Embedded Analytics**: virtual data model (VDM) built from ABAP CDS views. Analytical queries run in Fiori/Analysis apps directly on live HANA data. Complemented by SAP Analytics Cloud and BDC data products.
- **SAP TM**: embedded "Basic Shipping" is in the S/4 license, and advanced TM is a separate license. Embedded or decentralized (side-by-side S/4HANA instance).
- **PP/DS** (Production Planning and Detailed Scheduling): embedded in S/4HANA (formerly APO PP/DS). Basic functions in the license, advanced PP/DS licensed separately. It uses a liveCache that runs in HANA.
- **aATP**: successor to Global ATP/APO GATP. Product availability check, BOP (backorder processing), product allocation, alternative-based confirmation. Embedded in S/4.
- **Group Reporting**: S/4HANA consolidation (successor to SEM-BCS/BPC consolidation), working on ACDOCU. Group Reporting Data Collection and Group Reporting Preparation Ledger are options.
- **Central Finance**: S/4HANA instance that receives FI/CO postings in real time via SAP Landscape Transformation (SLT) from ECC/S/4 sources (AIF error handling, MDG mapping). A common interim architecture during ECC-to-S/4 migrations.
- **Business Partner model**: CVI (Customer-Vendor Integration) is mandatory. Customer/vendor master data is maintained via BP (transaction BP). In conversions, CVI is a prerequisite test topic.
- **GTS edition for SAP HANA**: a separate system on the S/4HANA foundation (not embedded in S/4 core). Releases 2020/2023. Cloud direction: "SAP Advanced Compliance" / "SAP Global Trade Services, cloud" **[unclear naming, not verified]**.
- **MDG**: as above. Also SAP Master Data Governance, cloud edition on BTP.

### Gaps
- No dedicated research on HANA 2.0 SPS roadmap, Fiori launchpad changes, Embedded Analytics, TM, PP/DS, Central Finance, Business Partner or GTS cloud successors (search budget exhausted). These are background only and must be verified via SAP Help Portal / Roadmap Explorer.
- Licensing of advanced EWM/TM/PP-DS in the 2025 SAP Cloud ERP Private package was not verified.

---

## 6. SAP Business AI / Joule in the core and Sapphire 2026 / TechEd 2025 news

### Takeaway
TechEd 2025 (Berlin, Nov 2025) focused on agentic development: Joule Studio custom agents GA in December 2025, ABAP AI in Joule for Developers, new ABAP LLMs planned for 2026, SAP Build MCP servers and ABAP Development Tools for VS Code. Sapphire 2026 (Orlando, May 2026) introduced the **"Autonomous Enterprise"**, **SAP Autonomous Suite** (50+ Joule Assistants, 200+ agents), **Joule Work**, **SAP Business AI Platform** (BTP + BDC + Business AI + SAP Knowledge Graph), Anthropic Claude as primary reasoning model, and a **U-turn bringing most Joule assistants and agents to on-prem S/4HANA and ECC** for customers committed to the cloud journey.

### Cited Findings
**TechEd 2025 (5 Nov 2025, Berlin)**
- ABAP AI-assisted development in SAP Cloud ERP Private (Joule for Developers enhancement). AI-driven custom code migration. New ABAP LLMs trained on ABAP code slated for 2026. Custom agent building in Joule Studio **GA December 2025** (A2A and MCP support, extensibility of SAP-delivered Joule Agents). Local MCP servers for SAP Build (Cursor, Claude Code, OpenAI Codex). SAP Build extension pack for VS Code. HANA Cloud MCP support. SAP-RPT-1 relational foundation model. — [SAP News](https://news.sap.com/2025/11/new-agentic-capabilities-sap-btp-supercharge-developers/)
- ABAP Development Tools for VS Code: early adopter release, ABAP Cloud only (RAP UI services), about 12 object types. Backend support down to NetWeaver 7.3. Joule for Developers planned in VS Code. Open source MCP servers for CAP, UI5, Fiori. — [SAP Developer News, 13 Nov 2025](https://community.sap.com/t5/developer-news/sap-developer-news-13th-november-2025/ba-p/14268215)

**Sapphire 2026 (May 2026)**
- Autonomous Enterprise concept. **SAP Autonomous Suite** (50+ Joule Assistants, 200 agentic AI tools). **Joule Work** (natural-language, outcome-based UI orchestrating SAP and non-SAP). **Business AI Platform** (BTP + SAP Business AI, underpinned by SAP Knowledge Graph). BDC additions. Partnerships: Anthropic powers SAP AI, AWS for data integration, Palantir and Accenture for data migration. — [SAP Users (UKISUG), 21 May 2026](https://www.sapusers.org/resource/sap-sapphire-2026-the-key-announcements.html)
- Business AI Platform = BTP + Business Data Cloud + AI Foundation; HANA Cloud as AI database layer. Joule Studio 2.0 (free, model-agnostic). Joule Agent Runtime free through **31 Dec 2026**. SAP AI Agent Hub GA Q3 2026. Anthropic Claude as primary reasoning model, with Mistral and Cohere as sovereign options. RISE customers get three Joule Assistants activated in year 1. Agent-led migration tooling claimed to cut ERP migration effort by 35%+. Post-2026 agent runtime pricing undisclosed. — [SAPinsider](https://sapinsider.org/articles/sapphire-2026-your-sap-erp-just-got-an-ai-brain-now-what-seven-questions-every-leader-must-answer/)
- Joule Work "broader general availability planned later in 2026". **Migration and modernization assistants in RISE with SAP: GA planned from Q3 2026**. Autonomous Close Assistant. Seven autonomous industry solutions. EUR 100m partner fund. — [SAPinsider](https://sapinsider.org/articles/sap-sapphire-2026-autonomous-enterprise-erp-business-ai/)
- **On-prem U-turn**: a majority of Joule assistants and agents will be available on-prem on ECC and S/4HANA as an "interim solution" (Christian Klein). Hybrid support via Muhammad Alam. Eligibility: customers committed to the cloud journey or modernizing on RISE. Part of a services bundle under Business AI Platform. Requires the **Max Success Plan**. GA planned May 2026. Reverses SAP's 2023 position that innovations would be cloud-only. — [The Register, 13 May 2026](https://www.theregister.com/ai-ml/2026/05/13/sap-u-turn-brings-ai-features-to-ecc-and-on-prem-s/4hana/5239040)
- SAP COO Sebastian Steinhaeuser: "Joule assistants and agents are designed for the cloud. That's where they will run." — [SAPinsider](https://sapinsider.org/articles/sapphire-2026-your-sap-erp-just-got-an-ai-brain-now-what-seven-questions-every-leader-must-answer/)

### Inferences
- The on-prem U-turn and the Steinhaeuser quote fit together: agents run in the cloud (BTP/Business AI Platform) and connect to on-prem S/4 and ECC. They do not run inside the on-prem stack.
- Test impact: Joule agents and assistants bring non-deterministic behaviour into ERP processes. Test strategies need acceptance criteria for AI outputs and regression after model or agent updates, which arrive independently of S/4 FPS cycles.
- Joule Agent Runtime pricing from 2027 is a budget risk (flagged by Forrester per SAPinsider).

### Gaps
- No primary SAP News article on Sapphire 2026 was fetched. Facts rely on SAPinsider, UKISUG and The Register.
- TechEd 2026 (expected Oct/Nov 2026) news is not covered. It had not been researched or may not have taken place yet as of 24 Oct 2026.
- Which specific Joule agents are available in on-prem S/4HANA 2025 under the Max Success Plan is not known.
