# SAP Data, Analytics and AI products around S/4HANA (state: October 2026)

Research note: the shared web-search budget ran out after about 25 searches and 30 fetches. Some details, especially Datasphere internals, HANA Cloud data lake, SAP Data Intelligence end dates and the full generative AI hub model list, could not be verified this round. They are listed under Gaps or marked as "prior knowledge, unverified" under Inferences. Third-party sources (SAPinsider, Trail/Nanonets, BARC, Constellation) are marked as such. Where they conflict, the conflict is noted.

---

## 1. SAP Business Data Cloud (BDC): contents, data product provisioning, partnerships, 2026 status

### Takeaway
SAP Business Data Cloud is a SaaS umbrella announced on 13 Feb 2025. It bundles SAP Datasphere, SAP Analytics Cloud, SAP BW (private cloud edition), SAP Databricks and SAP HANA Cloud, billed in a single pool of Capacity Units. It is built on SAP-managed "data products" that SAP replicates from S/4HANA and other systems into an object store (HANA Cloud / data lake files) and then shares zero-copy, via Delta Sharing, with Databricks, Snowflake, Google BigQuery and Microsoft Fabric. By October 2026, BDC Connect for Databricks (Oct 2025) and BDC Connect for BigQuery (Jul/Aug 2026) are GA. Snowflake was planned for Q1/H1 2026. With the planned Dremio acquisition, SAP is turning BDC into an Apache Iceberg-native lakehouse. Since Sapphire 2026, BDC has been positioned as one pillar of the new "SAP Business AI Platform".

### Cited Findings
**Announcement and components**
- Announced 13 Feb 2025 (New York). Components named: data engineering and business analytics capabilities, natively embedded Databricks, fully managed SAP data products (finance, spend and supply chain from SAP S/4HANA and SAP Ariba; learning and talent from SAP SuccessFactors), "Insight apps" (data products and AI models for analytics and planning), SAP Knowledge Graph, and Joule agents. No GA date or pricing was given at announcement. — [SAP News, Feb 2025](https://news.sap.com/2025/02/sap-business-data-cloud-databricks-turbocharge-business-ai/)
- "Insight apps" were later renamed "Intelligent Applications". SAP Learning describes them as SAP-managed SaaS applications for analytics, prediction and forecasting, with SAP BTP-based apps planned beyond SAC content. — [SAP Learning: Architecture of BDC](https://learning.sap.com/courses/sap-analytics-cloud/exploring-the-architecture-of-sap-business-data-cloud-1)

**Architecture (SAP Learning)**
- Source systems (e.g. SAP S/4HANA Cloud Private Edition, SAP SuccessFactors, non-SAP): SAP bundles tables and views into business scenarios (e.g. working capital), which are **replicated** to BDC. — [SAP Learning](https://learning.sap.com/courses/sap-analytics-cloud/exploring-the-architecture-of-sap-business-data-cloud-1)
- "Foundation Services" (object store): replicated data is harmonized, transformed and enriched into data products that reside on SAP HANA Cloud and data lake files in a hyperscaler environment. These steps are "fully managed by SAP". — [SAP Learning](https://learning.sap.com/courses/sap-analytics-cloud/exploring-the-architecture-of-sap-business-data-cloud-1)
- SAP Datasphere defines the data model on top of data products, including predelivered Intelligent Application scenarios and custom models, and manages analytical roles and data access control. — [SAP Learning](https://learning.sap.com/courses/sap-analytics-cloud/exploring-the-architecture-of-sap-business-data-cloud-1)
- SAP Databricks is an SAP-tailored Databricks environment for AI/ML and pro-code engineering. Data products are shared from the catalog to Databricks and can be shared back. — [SAP Learning](https://learning.sap.com/courses/sap-analytics-cloud/exploring-the-architecture-of-sap-business-data-cloud-1)
- SAP BW integration runs via "SAP BW NetWeaver Cloud" or "SAP BW/4HANA Cloud, private edition", so legacy BW objects can be onboarded as data products. SAP BW is supported until 2030, and SAP recommends moving to BW/4HANA "as soon as possible". — [SAP Learning](https://learning.sap.com/courses/sap-analytics-cloud/exploring-the-architecture-of-sap-business-data-cloud-1)
- The BDC cockpit is used to browse data products and Intelligent Applications, install apps, and share data products with SAP Databricks. — [SAP Learning](https://learning.sap.com/courses/sap-analytics-cloud/exploring-the-architecture-of-sap-business-data-cloud-1)

**Data products: provisioning model**
- **Primary data products** carry data from a single source app (e.g. S/4HANA Private Cloud Edition). **Derived data products** combine sources. SAP manages both, in the hidden "Foundation Services" layer (acquisition, transformation, curation, storage, delta handling, adaptation to structural change). Standard SAP-managed products are read-only. To extend them (e.g. with Z-fields), customers copy them into a customer-managed Datasphere space. Products are published in the BDC Cockpit catalog and described via the Open Resource Discovery (ORD) protocol. (Third-party blog, Dec 2025) — [Medium, M. Defelipe](https://medium.com/@mario.defelipe/what-we-know-about-sap-derived-data-products-and-data-product-studio-9f2c1d7bef4d)
- Intelligent Applications have three layers: (1) data products (curated datasets with metadata and API, published in the catalog), (2) domain content (Datasphere semantic models that power SAC stories and planning models), and (3) pro-code apps that turn insights into recommended actions linked to SAP transactional systems. — [SAP News, Oct 2025](https://news.sap.com/2025/10/intelligent-applications-data-driven-decision-making/)
- **Data Product Studio**: a central tool for creating and managing (derived and custom) data products within BDC, without needing full Datasphere or Databricks. It was planned for GA in H1 2026 (BARC). SAP ran a dedicated webinar on 19 Mar 2026. — [BARC 2026](https://barc.com/sap-data-analytics-2026/); [Medium](https://medium.com/@mario.defelipe/what-we-know-about-sap-derived-data-products-and-data-product-studio-9f2c1d7bef4d); [SAP event page](https://www.sap.com/germany/events/2026-03-19-online-data-product-studio.html)

**Intelligent Applications: status**
- As of Oct 2025: Finance Intelligence, People Intelligence and Cloud ERP Intelligence Private were available. Spend Intelligence, Supply Chain Intelligence and Revenue Intelligence were in restricted public preview. — [SAP News, Oct 2025](https://news.sap.com/2025/10/intelligent-applications-data-driven-decision-making/)
- At Sapphire 2025, partner Intelligent Applications were announced by IBM, Accenture, Capgemini, EY, KPMG, Moody's, PwC, Thomson Reuters, Deloitte, Adobe and Palantir (mostly Q3/Q4 2025). BDC was to be available on AWS, Google Cloud and Azure by Q4 2025. — [SAP Sapphire innovation guide, BDC](https://www.sap.com/events/sapphire/innovation-guide/data-cloud.html)

**Partnerships / BDC Connect (zero-copy)**
- **Databricks**: *SAP Databricks* is an OEM Databricks embedded inside BDC. *BDC Connect for (Enterprise) Databricks* links an existing customer Databricks via a one-time provisioning. Sharing uses the **Delta Share protocol**, "zero-copy, bi-directional". Databricks-enriched data products can be shared back and become discoverable in Datasphere. — [SAP Learning: Integrating BDC with Databricks](https://learning.sap.com/courses/mastering-sap-data-architecture/integrating-sap-business-data-cloud-with-databricks)
- BDC Connect for Databricks has been available since October 2025. BigQuery and Snowflake were planned for H1 2026, and Microsoft Fabric for Q3 (BARC). — [BARC 2026](https://barc.com/sap-data-analytics-2026/)
- **Snowflake** (announced 4 Nov 2025): *SAP Snowflake* is an SAP solution extension for BDC, a compute/storage option inside BDC, planned GA Q1 2026. *SAP Business Data Cloud Connect for Snowflake* provides bidirectional zero-copy sharing for existing Snowflake customers, planned GA H1 2026. — [SAP News, Nov 2025](https://news.sap.com/2025/11/sap-snowflake-data-enterprise-ai-business-data-fabric/); [Constellation Research](https://www.constellationr.com/insights/news/snowflake-takes-snowflake-intelligence-ga-launches-developer-tools-integrates-sap-bdc)
- **Google BigQuery**: *SAP BDC Connect for BigQuery* was announced GA on 27 Jul 2026 (Google blog; SAPinsider article dated 12 Aug 2026). It offers zero-copy, bidirectional access to SAP tables, metadata and semantics in BigQuery and Knowledge Catalog (formerly Dataplex), with no data-sharing fees. It supports BDC instances on Google Cloud and AWS, with Azure "coming soon". — [Google Cloud blog](https://cloud.google.com/blog/products/sap-google-cloud/sap-and-google-cloud-launch-bdc-connect-for-bigquery/); [SAPinsider](https://sapinsider.org/articles/announcing-general-availability-of-sap-business-data-cloud-connect-for-bigquery/)
- **Microsoft Fabric**: *SAP BDC Connect for Microsoft Fabric* was announced 24 Nov 2025. It provides zero-copy access to SAP data in OneLake, usable in Fabric, Power BI and Microsoft AI Foundry, with data flowing back bidirectionally. No GA date was stated in the source. — [SAPinsider](https://sapinsider.org/sap-microsoft-advance-joint-data-fabric-to-unlock-greater-enterprise-ai-value/)
- **Palantir**: a partnership connecting Palantir Foundry/AIP with BDC (Sapphire 2025). — [SAP Sapphire innovation guide](https://www.sap.com/events/sapphire/innovation-guide/data-cloud.html)

**2026 developments**
- **Dremio acquisition**, announced 4 May 2026: extends BDC to combine SAP and non-SAP data. SAP says it makes BDC an "Iceberg-native lakehouse" (Apache Iceberg, Apache Polaris, Apache Arrow). The planned open catalog uses Polaris and the Iceberg REST Catalog API, and the Dremio-powered catalog will underpin the SAP Knowledge Graph. Terms were not disclosed. — [Constellation Research](https://constellationr.com/insights/news/sap-acquires-dremio-prior-labs-it-builds-out-its-data-platform-plan). Closing was expected in Q3 2026 — [Trail/Nanonets breakdown (3rd party)](https://trailhq.com/blog/sap-sapphire-2026-the-complete-breakdown); [Börse Express](https://www.boerse-express.com/news/articles/sap-aktie-dremio-deal-fuer-q3-2026-geplant-906377)
- **Reltio** (MDM) acquisition is reported as closed. — [Trail (3rd party)](https://trailhq.com/blog/sap-sapphire-2026-the-complete-breakdown)
- At Sapphire 2026, MCP was embedded in BDC so that third-party agents can connect to SAP's data layer. — [Trail (3rd party)](https://trailhq.com/blog/sap-sapphire-2026-the-complete-breakdown)
- BDC is expanding from 8 to 13 Azure data centers by end of 2026. — [SAPinsider](https://sapinsider.org/articles/sapphire-2026-your-sap-erp-just-got-an-ai-brain-now-what-seven-questions-every-leader-must-answer/)
- BDC regions on Google Cloud: Sydney, São Paulo, Mumbai, Tel Aviv, Frankfurt, Osaka, Dammam and Iowa. — [Google Cloud blog](https://cloud.google.com/blog/products/sap-google-cloud/sap-and-google-cloud-launch-bdc-connect-for-bigquery/)
- BARC frames 2026 as "the year of practical testing": it is still open which BDC scenarios are production-ready, and some will start as PoCs. BTP integration is at an early stage (initial SAP Build integrations embedding data products). — [BARC 2026](https://barc.com/sap-data-analytics-2026/)
- SAP published "SAP Business Data Cloud: Innovation road map for data and AI" (asset dated May 2026). — [sap.com asset](https://www.sap.com/assetdetail/2026/05/cc7534ec-4f7f-0010-bca6-c68f7e60039b.html)

**Licensing**
- The metric is the **Capacity Unit**, sold in blocks of 1 per month for terms of 3 to 36 months with auto-renewal. Price is on request, and a BDC Estimator is available. The core capacity can enable: SAP Datasphere, SAP Analytics Cloud, "SAP Business Warehouse Cloud", SAP Databricks, SAP BDC Connect, SAP HANA Cloud, SAP S/4HANA Cloud for Master Data Governance, and an "extra stack". **Intelligent Packages** (curated data products) are sold separately. — [SAP BDC pricing (DE)](https://www.sap.com/germany/products/data-cloud/pricing.html)

### Inferences
- The S/4HANA → BDC data path is managed replication (SAP Foundation Services pulls the data, typically from CDS-based extraction, into HANA Cloud data lake files / object store), followed by zero-copy Delta Sharing outward. "Zero-copy" applies to the BDC ↔ partner leg, not to the S/4 → BDC leg.
- The sources name S/4HANA Cloud Private Edition as the reference source. Whether SAP-managed data products also work for on-premise S/4HANA could not be verified (see Gaps).
- Dremio and Iceberg point to BDC moving from Delta Lake / Databricks-centric sharing toward open table formats with multiple engines.

### Gaps
- Exact technical extraction mechanism for S/4HANA data products (CDS views / Data Provisioning via ODP / "data packages") and supported S/4 deployment types (on-prem vs. PCE vs. Public Cloud): not confirmed by a primary source.
- Actual GA date of SAP Snowflake and BDC Connect for Snowflake, and of BDC Connect for Microsoft Fabric: no confirmation found by October 2026.
- Confirmed GA of Data Product Studio in H1 2026: no primary source found.
- Whether the Dremio deal closed in Q3 2026: not verified.

---

## 2. SAP Datasphere

### Takeaway
SAP Datasphere is the renamed SAP Data Warehouse Cloud (since 8 March 2023). It is the HANA Cloud-based data warehousing, modeling and integration layer and, since 2025, the modeling and governance layer inside BDC. It offers federation (remote tables) and replication (replication flows, real-time remote table replication), ETL/ELT flows, an Analytic Model, a catalog, and SAP BW Bridge for reusing BW models. It is also the storage layer for SAC "Seamless Planning".

### Cited Findings
- Datasphere is "the next generation of SAP Data Warehouse Cloud". Existing tenants transitioned automatically on 8 Mar 2023 and kept their subscription or CPEA arrangements. — [SAP Community Datasphere FAQ](https://pages.community.sap.com/topics/datasphere/faq)
- The Analytic Model supports multidimensional modeling with calculated and restricted measures, exception aggregation, and attribute/measure pruning. Data cataloging is a core capability. — [SAP Datasphere FAQ](https://pages.community.sap.com/topics/datasphere/faq)
- SAP BW Bridge is included in Datasphere and lets BW customers reuse existing models and transformations. — [SAP Datasphere FAQ](https://pages.community.sap.com/topics/datasphere/faq)
- Integration options:
  - **Remote tables**: remote (federated) access, snapshot or scheduled replication, and real-time replication.
  - **Data flows**: ETL.
  - **Replication flows**: ELT ("extracted and loaded first, then transformed").
  - **Transformation flows**: transformations on already-loaded data.
  - **Connectivity**: SDI/dpAgent for remote tables, SDA + Cloud Connector for on-prem HANA. The Cloud Connector is required for data flows, replication flows and some BW/4HANA model transfers.
  - **Import Entities wizard**: imports semantically rich objects (recommended for CDS views) from S/4HANA (Cloud and on-prem), BW/4HANA, BW Bridge and HANA Cloud.
  - **HDI container exchange**, and an **Open SQL Schema** (read/write SQL endpoint usable by ML and Jupyter).
  — [SAP Learning: Outlining Integration Options](https://learning.sap.com/courses/exploring-sap-datasphere/outlining-integration-options)
- Relation to SAP Data Intelligence Cloud: some of its features are already in Datasphere and more will follow. Mainstream maintenance continues until a date set in an SAP Note, and customers "will transition workloads from SAP Data Intelligence Cloud to SAP Datasphere over time". — [SAP Datasphere FAQ](https://pages.community.sap.com/topics/datasphere/faq)
- In BDC, Datasphere defines models over data products, holds the copies of SAP-managed products that customers extend, and receives BW data via the Data Product Generator into its object store (HANA Data Lake Files). — [SAP Learning](https://learning.sap.com/courses/sap-analytics-cloud/exploring-the-architecture-of-sap-business-data-cloud-1); [SAP Learning: Data Product Generator](https://learning.sap.com/courses/transforming-sap-bw-with-sap-business-data-cloud/introducing-the-data-product-generator)
- Datasphere is the storage layer for Seamless Planning (GA Q1 2025). An end-2025 update allows Datasphere facts to be used directly in planning models. — [BARC 2026](https://barc.com/sap-data-analytics-2026/)
- An expanded knowledge graph that reads and maps metadata from Datasphere and linked sources was announced for Q3 2025. "Joule for SAP Business Data Cloud" (metadata Q&A) was GA. — [SAP Sapphire innovation guide](https://www.sap.com/events/sapphire/innovation-guide/data-cloud.html)

### Inferences
- From prior knowledge, unverified this round: Datasphere is organized in **spaces** (isolated storage/compute and authorization units). The "business layer" (business entities, fact models, consumption models) has largely been superseded by the Analytic Model in the Data Builder. "Premium outbound integration" (replication flows to non-SAP targets) is billed separately. Treat these as background, not as verified 2026 facts.
- Under the BDC branding, Datasphere is no longer marketed as a standalone strategic product but as a BDC "capacity service". SAP also continues to sell it standalone; check current SAP pricing.

### Gaps
- Exact end-of-maintenance date for SAP Data Intelligence Cloud: the FAQ refers to an SAP Note without stating the date, and the search budget was exhausted before it could be verified.
- Current status of the "business layer" in 2026 (deprecated or not): not verified.

---

## 3. SAP Analytics Cloud (SAC): BI, planning, predictive; relation to S/4HANA embedded analytics

### Takeaway
SAC is SAP's strategic SaaS front end for BI, planning and predictive analytics and a component of BDC. Its planning increasingly persists data in Datasphere ("Seamless Planning", GA Q1 2025) instead of its own storage. In S/4HANA, SAC runs behind the scenes via live connection to power embedded analytical apps over the CDS-based Virtual Data Model. Embedded analytics (VDM/CDS, analytical queries) remains the in-system operational reporting layer.

### Cited Findings
- SAC is integrated into BDC and positioned as the strategic front end for planning and analytics. It currently keeps its own storage, with a gradual shift to Datasphere planned. — [BARC 2026](https://barc.com/sap-data-analytics-2026/)
- In Seamless Planning, SAC planning models (fact and master data) are stored and processed in Datasphere and accessed live from SAC ("Data resides once in SAP Datasphere"). SAC objects appear in Datasphere as read-only local tables. No separate BDC license is required (3rd-party blog, Feb 2026). — [YASH blog](https://www.yash.com/blog/sap-business-data-cloud-seamless-planning-in-sap-analytics-cloud-a-deep-dive/)
- SAC planning includes predictive forecasts via predictive analytics/ML and top-influencer discovery. Finance and Supply Chain content packages use S/4HANA with "live connectivity between plans and actuals". — [sap.com SAC Planning (DE)](https://sap.com/germany/products/technology-platform/cloud-analytics/features/planning.html)
- In BDC, SAC provides dashboards and planning for Intelligent Applications plus ad-hoc analysis, AI-driven chat and suggestions. — [SAP Learning](https://learning.sap.com/courses/sap-analytics-cloud/exploring-the-architecture-of-sap-business-data-cloud-1)
- **S/4HANA embedded analytics**:
  - Data sits in HANA, the Virtual Data Model (CDS views) forms the middle layer, and Fiori analytical apps sit on top.
  - SAC runs "behind the scenes" via live connection to power several analytical apps.
  - Apps include View Browser, Custom CDS Views, Query Browser, Custom Analytical Queries, Multidimensional Reports, Data Analyzer, Review Booklets, and Manage KPIs and Reports.
  - SAC stories in S/4 require an SAC-S/4 connection.
  - ML via Intelligent Scenario Lifecycle Management (ISLM): embedded scenarios use HANA APL/PAL, and side-by-side scenarios use a BTP service with additional license.
  — [SAP Learning: Embedded Analytics (S/4HANA Cloud PE)](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-private-edition/describing-embedded-analytics_d536b335-62e2-402f-a2d3-c30bdc6a3a76)
- **SAP BusinessObjects (neighbour, legacy)**:
  - SAPinsider: BI 2025 was planned for release in Q4 2024. BI 4.3 mainstream maintenance ends Dec 2025, with priority-1 support until Dec 2027. BI 2025 mainstream maintenance runs at least to end of 2029, with priority-1 support to 2031. Lumira and Crystal Reports for Enterprise are deprecated in 4.3. — [SAPinsider: BI 2025](https://sapinsider.org/articles/saps-strategic-direction-for-analytics-businessobjects-bi-2025/)
  - BARC: Web Intelligence is the priority (now with offline mode). Maintenance is "extended through end of 2027", with the next major release planned for 2027. **Possible conflict with SAPinsider's 2029 date.** The BARC statement may refer to BI 4.3 priority-1 support. — [BARC 2026](https://barc.com/sap-data-analytics-2026/)

### Inferences
- From prior knowledge, unverified: "SAP Analytics Cloud for planning, edition for S/4HANA" / embedded planning scenarios and the "Just Ask" (natural-language query, now Joule-based) feature exist. Their 2026 status was not verified.
- Architecture rule of thumb for S/4 projects: operational reporting goes to embedded analytics (CDS); cross-system analytics and planning go to SAC on Datasphere/BDC; BusinessObjects is a legacy on-prem path with a finite maintenance horizon.

### Gaps
- 2026-specific SAC roadmap items (e.g. Joule in SAC, Compass, new planning features) were not retrieved.
- The exact current status of "Planning for S/4HANA" offerings was not verified.

---

## 4. SAP BW/4HANA and BW on HANA: maintenance dates, BW Private Cloud Edition, migration path

### Takeaway
SAP BW 7.5 (incl. BW on HANA) mainstream maintenance ends in 2027. Customers who lift BW 7.5 into **SAP BW, private cloud edition (BW PCE) inside BDC** get support until 2030. SAP BW/4HANA (on-prem and PCE) is maintained until 2040. The strategic path is: BW 7.5 → BW PCE in BDC (temporary) or conversion to BW/4HANA; then expose BW data to BDC via the **Data Product Generator** and gradually rebuild in Datasphere/BDC.

### Cited Findings
- Deployment options: SAP BW 7.5 on-prem; SAP BW/4HANA on-prem; SAP BW, private cloud edition (any BW 7.5 on HANA release); SAP BW/4HANA, private cloud edition (SAP or a hyperscaler manages infrastructure and application management). BDC integration is optional. — [SAP Learning: Comparing BW deployment options](https://learning.sap.com/courses/modernizing-sap-bw-with-sap-business-data-cloud/comparing-sap-bw-deployment-options)
- Maintenance end dates:
  - BW 7.5 on-prem: **2027**.
  - BW 7.5 PCE: 2027, "as part of SAP BDC 2030", meaning support until **2030** within BDC.
  - BW/4HANA (on-prem and PCE): **2040**.
  — [SAP Learning](https://learning.sap.com/courses/modernizing-sap-bw-with-sap-business-data-cloud/comparing-sap-bw-deployment-options)
- Migration paths: BW 7.x customers must lift to BW PCE within BDC to keep support until 2030, or convert to BW/4HANA. A BW 7.5 PCE can later be converted to BW/4HANA. On-prem BW/4HANA can stay or move to BW/4HANA PCE (recommended). — [SAP Learning](https://learning.sap.com/courses/modernizing-sap-bw-with-sap-business-data-cloud/comparing-sap-bw-deployment-options)
- **Data Product Generator**:
  - Replicates data from BW InfoProviders to the object store (SAP HANA Data Lake Files) of a Datasphere tenant in BDC.
  - Works through subscriptions that create local tables in a Datasphere space, with inbound buffer and merge into a delta table.
  - Supports full/delta modes, projections and filters, and process chain integration.
  - Sources: InfoObjects (no hierarchies yet), (advanced) DSOs, InfoCubes, CompositeProviders, MultiProviders and queries as InfoProviders. NLS data is supported, but ADK-archived data is not.
  — [SAP Learning: Data Product Generator](https://learning.sap.com/courses/transforming-sap-bw-with-sap-business-data-cloud/introducing-the-data-product-generator)
- The Data Product Generator has been available since early 2025 and aims to move BW models into BDC while preserving business logic. SAP intends to move on-prem BW to the cloud and manage future development within BDC. — [BARC 2026](https://barc.com/sap-data-analytics-2026/)
- SAP has published a guide titled "Configuring the Data Product Generator and Query Template Generator for SAP Business Data Cloud" (June 2026). — [sap.com document](https://www.sap.com/documents/2026/06/a289a708-597f-0010-bca6-c68f7e60039b.html)
- Hybrid planning with BW PCE is mentioned as a direction. — [YASH](https://www.yash.com/blog/sap-business-data-cloud-seamless-planning-in-sap-analytics-cloud-a-deep-dive/)

### Inferences
- In BDC pricing, BW PCE appears as the capacity service "SAP Business Warehouse Cloud" ([pricing page](https://www.sap.com/germany/products/data-cloud/pricing.html)). In SAP Learning, it appears as "SAP BW NetWeaver Cloud". Naming is not yet consistent across SAP material.
- The BW 7.5 2027 date is aligned with the NetWeaver 7.5 maintenance strategy. Extended maintenance options for BW 7.5 beyond 2027 outside BDC were not confirmed.

### Gaps
- Whether SAP offers extended maintenance for BW 7.5 on-prem (2027–2030) outside BDC: not verified.
- Technical prerequisites (BW SP levels) for the Data Product Generator: not retrieved.

---

## 5. SAP HANA Cloud (incl. data lake, vector engine, knowledge graph engine)

### Takeaway
SAP HANA Cloud is the multi-model DBaaS underneath Datasphere and BDC. It combines relational, vector, graph/knowledge graph (RDF/SPARQL), text and spatial engines and supports GraphRAG, VectorRAG and HybridRAG for generative AI. HANA Cloud data lake files form the BDC object store. Since Sapphire 2026 it also hosts long-term agent memory for Joule Studio runtimes.

### Cited Findings
- HANA Cloud is "a single, multi-model platform" with vector, graph, text, spatial and relational data. The vector engine provides semantic/similarity search. The knowledge graph engine models explicit relationships. SPARQL can be embedded in SQL (SPARQL_EXECUTE, SPARQL table), and SQL, SPARQL and vector search can run in one query. GraphRAG, VectorRAG and HybridRAG are supported. — [SAP News, Jul 2025](https://news.sap.com/2025/07/unifying-ai-workloads-sap-hana-cloud-one-database/)
- BDC data products reside on SAP HANA Cloud and data lake files. — [SAP Learning](https://learning.sap.com/courses/sap-analytics-cloud/exploring-the-architecture-of-sap-business-data-cloud-1)
- HANA Cloud is a capacity service within BDC licensing. — [SAP BDC pricing](https://www.sap.com/germany/products/data-cloud/pricing.html)
- The generative AI hub uses the HANA Cloud vector engine for RAG. — [SAP generative AI hub trial page](https://www.sap.com/cz/products/artificial-intelligence/generative-ai-hub-trial.html)
- Joule Studio runtimes will use HANA Cloud-based long-term agent memory (Sapphire 2026). — [Channel Insider](https://www.channelinsider.com/ai/sap-sapphire-2026-business-ai-joule-agents/)
- BARC (2026) says the knowledge graph in HANA Cloud is "still under development" as part of the end-to-end vision. — [BARC 2026](https://barc.com/sap-data-analytics-2026/)
- SAP presented "DA201 – Accelerating your AI strategy with SAP HANA Cloud" at TechEd (Nov 2025). — [sap.com asset](https://www.sap.com/assetdetail/2025/11/e49f37b8-2a7f-0010-bca6-c68f7e60039b.html)

### Inferences
- From prior knowledge, unverified this round: the vector engine went GA in Q1 2024 (announced at SAP Data Unleashed, Mar 2024; see the [SAP News Mar 2024](https://news.sap.com/2024/03/latest-sap-data-and-analytics-innovations-sap-data-unleashed/) search hit) and the knowledge graph engine in Q1 2025. HANA Cloud data lake comes in two flavors, "data lake relational engine" (former IQ) and "data lake files".

### Gaps
- Confirmed GA dates for vector engine and knowledge graph engine, and the 2026 status of data lake relational engine: not verified (search budget exhausted).

---

## 6. SAP Business AI: Joule, agents, Joule Studio, AI Core / AI Launchpad / generative AI hub, Knowledge Graph, SAP-RPT-1, AI Units, embedded S/4 AI, Sapphire 2026

### Takeaway
At Sapphire 2026 (Orlando, 12 May 2026), SAP reframed its AI story as the "Autonomous Enterprise". There are three layers:
1. **SAP Business AI Platform**: BTP, BDC and AI Foundation, plus LeanIX and Signavio.
2. **SAP Autonomous Suite**: about 200+ Joule Agents and 50+ Joule Assistants.
3. **Joule Work**: a new unified user experience.

Anthropic's Claude was named the "primary reasoning and agentic capability" across Joule. Other announcements: Joule Studio 2.0 (free through end of 2026), SAP AI Agent Hub (on LeanIX, GA Q3 2026), the SAP Knowledge Graph, SAP-RPT-1 (tabular model, Nov 2025), and the Prior Labs investment. Commercially, Joule Base is included with cloud subscriptions, while Premium Joule/agents are paid in AI Units. AI access is tied to RISE/GROW (cloud).

### Cited Findings
**Sapphire 2026: platform and suite**
- SAP and Anthropic (12 May 2026, SAP News by CTO Philipp Herzig): Claude is to be the "primary reasoning and agentic capability" across SAP's AI portfolio, powered by Joule and Joule agents, and connected to the newly announced SAP Business AI Platform. Claude agents will coordinate across S/4HANA, SuccessFactors, Ariba and other systems via **MCP**. SAP and Anthropic plan custom agents for public sector, healthcare, education, life sciences and utilities. No GA dates or model versions were given. — [SAP News, May 2026](https://news.sap.com/2026/05/sap-anthropic-to-bring-claude-sap-business-ai-platform/)
- Three-layer architecture (SAPinsider, 3rd party):
  - SAP Business AI Platform consolidates BTP, BDC and "SAP's AI Foundation".
  - Autonomous Suite: **224 agents and 51 Joule Assistants**.
  - Joule Work: desktop, mobile, web, Teams and Slack.
  - Other AI partners: AWS, Google Cloud, Microsoft, NVIDIA, Mistral AI, Cohere; Palantir is named a cornerstone partner.
  — [SAPinsider](https://sapinsider.org/articles/decoding-the-autonomous-enterprise-how-sap-anthropic-and-joule-are-rewriting-enterprise-architecture/)
- SAP's own blog lists: a reimagined Joule experience, **Joule Work** (one workspace where assistants guide and agents act), **SAP Autonomous Suite** (finance, supply chain, procurement, HR, CX), Industry AI, **SAP Business AI Platform**, and agent-led transformation (Joule Agents/Assistants for system analysis, data preparation and testing). No dates were given. — [SAP blog: Top 5 Sapphire 2026 AI announcements](https://www.sap.com/blogs/top-5-sapphire-2026-ai-announcements)
- Counts reported elsewhere: "50+ Joule Assistants orchestrating 200+ agents", and the "Autonomous Close Assistant". AI Agent Hub is reportedly used by 150 companies managing more than 100,000 agents. NVIDIA OpenShell serves as the runtime security layer. Microsoft 365 Copilot and Joule integrate agent-to-agent. — [Channel Insider](https://www.channelinsider.com/ai/sap-sapphire-2026-business-ai-joule-agents/). **Note:** agent counts differ between sources (200+/50+ vs. 224/51).
- **BTP rename, conflicting reports**:
  - united-vars (partner) says BTP is being renamed "SAP Business AI Platform (SAP BAIP)", with the partner competency renamed effective 30 Jun 2026. — [united-vars](https://www.united-vars.com/en/beyond/from-sap-btp-to-sap-baip-why-sap-renamed-the-platform-and-what-changed)
  - SAPinsider quotes SAP's Sylvie Sollod that it is "an evolution of bringing all of the platform capabilities together", not a rename/replacement. It unifies BTP, BDC, SAP AI, LeanIX and Signavio, with pillars Build / Contextualize & Reason / Govern. — [SAPinsider, Jul 2026](https://sapinsider.org/map/sap-business-ai-platform-btp-foundation-sapphire-2026/)
- **SAP AI Agent Hub**: governance/monitoring control plane for SAP and non-SAP agents, prompts and MCP servers, built on SAP LeanIX. GA targeted Q3 2026, included in the Business AI Platform at no extra charge. Cloud ALM provides audit trails for AI actions. — [SAPinsider](https://sapinsider.org/articles/decoding-the-autonomous-enterprise-how-sap-anthropic-and-joule-are-rewriting-enterprise-architecture/); [united-vars](https://www.united-vars.com/en/beyond/from-sap-btp-to-sap-baip-why-sap-renamed-the-platform-and-what-changed)
- Dates (SAPinsider): Autonomous Suite key components GA Q3 2026 and beyond; Joule Work and full A2A late 2026. Trail lists A2A with Google Cloud/Microsoft as GA Q4 2026. — [SAPinsider](https://sapinsider.org/articles/decoding-the-autonomous-enterprise-how-sap-anthropic-and-joule-are-rewriting-enterprise-architecture/); [Trail](https://trailhq.com/blog/sap-sapphire-2026-the-complete-breakdown)

**Joule Studio**
- GA since Q2 2025. Agent Builder available Q4 2025. Announced for 2026: system-triggered agents, A2A, and custom pre/post-processing for existing Joule agents. — [BARC 2026](https://barc.com/sap-data-analytics-2026/)
- **Joule Studio 2.0** (Sapphire 2026):
  - Fully managed environment for agents, workflows and apps; no-code and pro-code (LangChain, LlamaIndex); integrations with VS Code, Cursor, n8n and Vercel. — [Channel Insider](https://www.channelinsider.com/ai/sap-sapphire-2026-business-ai-joule-agents/)
  - n8n orchestration embedded; free design-time access through 31 Dec 2026. — [Trail](https://trailhq.com/blog/sap-sapphire-2026-the-complete-breakdown)
  - Joule Agent Runtime free through 31 Dec 2026; post-2026 pricing undisclosed. — [SAPinsider](https://sapinsider.org/articles/sapphire-2026-your-sap-erp-just-got-an-ai-brain-now-what-seven-questions-every-leader-must-answer/)
  - Rollout planned from June 2026. — [united-vars](https://www.united-vars.com/en/beyond/from-sap-btp-to-sap-baip-why-sap-renamed-the-platform-and-what-changed)

**SAP AI Core / AI Launchpad / generative AI hub**
- The generative AI hub provides programmatic access to multiple models. The trial page names Anthropic (Claude Sonnet 4), Google (Gemini 2.5 Pro) and OpenAI (GPT-5) and points to the Help Portal for the full list. SAP AI Launchpad is the UI for prompt design/management. RAG runs via the HANA Cloud vector engine. A playground and a 30-day trial are available. Licensing is BTP Pay-As-You-Go or an Enterprise Agreement. — [SAP generative AI hub trial](https://www.sap.com/cz/products/artificial-intelligence/generative-ai-hub-trial.html)
- The generative AI hub orchestration service is accessible via the SAP Cloud SDK for AI and third-party LiteLLM. — [SAP Cloud SDK for AI docs](https://help.sap.com/doc/generative-ai-hub-sdk/CLOUD/en-US/_reference/README_sphynx.html); [LiteLLM](https://docs.litellm.ai/docs/providers/sap)
- AI Core and AI Launchpad costs are separate from Joule, and specific AI use cases require separate negotiation. — [SAPinsider](https://sapinsider.org/articles/decoding-the-autonomous-enterprise-how-sap-anthropic-and-joule-are-rewriting-enterprise-architecture/)
- Mistral AI and Cohere are offered as "sovereign options". — [SAPinsider](https://sapinsider.org/articles/sapphire-2026-your-sap-erp-just-got-an-ai-brain-now-what-seven-questions-every-leader-must-answer/)

**SAP Knowledge Graph**
- Part of BDC at announcement (Feb 2025). — [SAP News Feb 2025](https://news.sap.com/2025/02/sap-business-data-cloud-databricks-turbocharge-business-ai/)
- Structured representation of business entities, relationships, process logic, authorizations and approval hierarchies. SAP Domain Models are trained on SAP's codebase/process data. — [SAPinsider](https://sapinsider.org/articles/decoding-the-autonomous-enterprise-how-sap-anthropic-and-joule-are-rewriting-enterprise-architecture/)
- Covers 452,000 tables and 7.3M fields in machine-readable form (Sapphire 2026). — [Trail](https://trailhq.com/blog/sap-sapphire-2026-the-complete-breakdown)
- Underpinned in future by the Dremio-powered catalog. — [Constellation](https://constellationr.com/insights/news/sap-acquires-dremio-prior-labs-it-builds-out-its-data-platform-plan)

**SAP-RPT-1 (tabular foundation model)**
- Announced 4 Nov 2025 at TechEd Berlin. "Relational pre-trained transformer", described as "the first enterprise relational foundation model". Research predecessor: ConTextTab. Works via in-context learning (no fine-tuning) for classification and regression on tables via an API call. Variants: small and large on the SAP platform, plus open weights `SAP/sap-rpt-1-oss` on Hugging Face. Free playground at rpt.cloud.sap. Use cases: maintenance, payment risk, churn. — [The New Stack (SAP-sponsored)](https://thenewstack.io/rpt-1-sap-launches-a-relational-foundation-model-for-the-enterprise/)
- Variant details (arXiv preprint, Feb 2026, Microsoft author): oss is Apache 2.0, up to 8,192 context rows; small is about 2,000 rows, low latency; large is up to 65,536 rows / 256 columns. Commercial variants are available via SAP AI Core / generative AI hub. On synthetic SAP data, it is competitive with XGBoost on classification but behind on regression. — [arXiv 2602.19237](https://www.arxiv.org/pdf/2602.19237)
- **Prior Labs** (announced around May 2026): SAP invests €1bn over four years. Prior Labs stays independent and will accelerate SAP's TFM work. — [Constellation](https://constellationr.com/insights/news/sap-acquires-dremio-prior-labs-it-builds-out-its-data-platform-plan). Trail mentions "SAP-RPT-1.5" at Sapphire 2026. — [Trail](https://trailhq.com/blog/sap-sapphire-2026-the-complete-breakdown)

**Licensing (Joule / AI Units)**
- **Base AI**: included in standard cloud subscriptions without limits or extra cost (navigational, SAP Help/RISE content, simple transactional tasks, document grounding). **Premium**: priced in **AI Units**, which are prepaid, consumption-based, valid across SAP solutions, bought annually and expire after 12 months; usage is tracked in SAP for Me. Joule Premium packages exist for financial management, spend, supply chain, HCM and CX, plus "SAP Joule for Consultants" and "Joule for Developers". Document Grounding costs 0.005 AI Units per record. — [SAP Business AI pricing](https://www.sap.com/products/artificial-intelligence/pricing.html)
- "All currently released SAP SuccessFactors and SAP S/4HANA Private Cloud Edition Joule Skills are categorized as Base." Premium covers advanced capabilities and Joule Agent actions. Overage is 2 AI Units per 1,000 requests. — [SAP Learning: Joule commercial model](https://learning.sap.com/courses/introducing-joule/understanding-the-commercial-model)
- RISE customers receive 2,500 Joule messages per FUE per contract year (SAPinsider). Joule is exclusive to RISE/GROW customers as of Q1 2026, with no native Joule for classic on-prem S/4HANA. — [SAPinsider](https://sapinsider.org/articles/decoding-the-autonomous-enterprise-how-sap-anthropic-and-joule-are-rewriting-enterprise-architecture/)
- RISE includes 3 Joule Assistants in year one, and GROW includes 20+. AI access requires RISE or at least 50% of maintenance spend moved to cloud (Trail). — [Trail](https://trailhq.com/blog/sap-sapphire-2026-the-complete-breakdown); [SAPinsider](https://sapinsider.org/articles/sapphire-2026-your-sap-erp-just-got-an-ai-brain-now-what-seven-questions-every-leader-must-answer/)
- "Most tools will be enabled on-premises for customers already committed to transformation". ECC customers with a committed RISE path get select AI scenarios. — [SAPinsider](https://sapinsider.org/articles/sapphire-2026-your-sap-erp-just-got-an-ai-brain-now-what-seven-questions-every-leader-must-answer/)

**Embedded AI in S/4HANA**
- S/4HANA embedded ML runs via ISLM (HANA PAL/APL embedded; side-by-side on BTP with extra license). — [SAP Learning](https://learning.sap.com/courses/implementing-sap-s-4hana-cloud-private-edition/describing-embedded-analytics_d536b335-62e2-402f-a2d3-c30bdc6a3a76)
- Sapphire 2026 examples: Autonomous Finance Close, AP exception management assistant, Joule for Developers, an ABAP code-conversion agent, and Palantir-powered migration tooling (claimed >35% migration-effort reduction, Accenture as global SI partner). — [SAPinsider](https://sapinsider.org/articles/sapphire-2026-your-sap-erp-just-got-an-ai-brain-now-what-seven-questions-every-leader-must-answer/); [Trail](https://trailhq.com/blog/sap-sapphire-2026-the-complete-breakdown); [SAPinsider](https://sapinsider.org/articles/decoding-the-autonomous-enterprise-how-sap-anthropic-and-joule-are-rewriting-enterprise-architecture/)
- For test managers: SAP explicitly lists "supporting testing" as an agent-led transformation use case. — [SAP blog](https://www.sap.com/blogs/top-5-sapphire-2026-ai-announcements)

### Inferences
- "AI Foundation" is SAP's umbrella name for AI Core, generative AI hub, AI Launchpad and related services. The pricing page says AI Foundation is "accessible through SAP BTP" ([pricing](https://www.sap.com/products/artificial-intelligence/pricing.html)). With the Business AI Platform, these are being folded into one platform brand. Product names like "SAP AI Core" and "generative AI hub" appear to persist in documentation.
- Many Sapphire 2026 items are announced plans with Q3/Q4 2026 targets. As of October 2026, treat AI Agent Hub (Q3 2026) as likely just GA and Joule Work and full A2A as not yet broadly GA. This could not be verified.

### Gaps
- Official GA confirmation (Sep/Oct 2026) of AI Agent Hub, Joule Work, Autonomous Suite components and Claude-in-Joule: not found.
- Full, current generative AI hub model catalog (e.g. Claude model versions, Mistral, Llama, Amazon Nova, SAP models): not retrieved; the Help Portal is the authoritative source.
- Primary-source confirmation of "2,500 Joule messages per FUE" and of the RISE/50%-maintenance rule (both from third-party sources).
- Primary detail on SAP-RPT-1.5 and the Prior Labs deal structure (acquisition vs. investment: Constellation's headline says "acquires" but the body says it operates independently).

---

## 7. Superseded / legacy products and neighbours (brief)

### Takeaway
SAP Data Warehouse Cloud was renamed SAP Datasphere (Mar 2023). SAP Data Intelligence Cloud is being phased out in favour of Datasphere. SAP BW 7.5 reaches end of maintenance in 2027 (2030 inside BDC). BusinessObjects continues as a legacy on-prem stack (BI 2025) with deprecated tools. "Insight apps" became "Intelligent Applications". SAP Signavio Process Intelligence is now part of the Business AI Platform umbrella (covered by another researcher).

### Cited Findings
- Data Warehouse Cloud → Datasphere, 8 Mar 2023. — [SAP Datasphere FAQ](https://pages.community.sap.com/topics/datasphere/faq)
- Data Intelligence Cloud → workloads transition to Datasphere over time; the maintenance end date is in an SAP Note. — [SAP Datasphere FAQ](https://pages.community.sap.com/topics/datasphere/faq)
- SAP Data Services / Information Steward have their own statement of direction (Nov 2023; not fetched). — [SAP Community](https://blogs.sap.com/t5/technology-blogs-by-sap/statement-of-direction-sap-data-services-and-sap-information-steward-as-of/ba-p/13577148)
- BusinessObjects: BI 4.3 mainstream maintenance ends end of 2025, priority-1 support to end of 2027. BI 2025 mainstream maintenance runs to at least end of 2029. Lumira and CR4E are deprecated. — [SAPinsider](https://sapinsider.org/articles/saps-strategic-direction-for-analytics-businessobjects-bi-2025/)
- Signavio is unified into the SAP Business AI Platform alongside LeanIX. — [SAPinsider](https://sapinsider.org/map/sap-business-ai-platform-btp-foundation-sapphire-2026/)

### Inferences
- SAP Predictive Analytics was already out of maintenance before 2026 (search hit for the [SAP Predictive Analytics maintenance policy](https://blogs.sap.com/2020/01/27/sap-predictive-analytics-maintenance-policy/), not fetched). Its successors are SAC Smart Predict, HANA PAL/APL and SAP AI Core.

### Gaps
- Exact Data Intelligence Cloud end-of-maintenance date and the current Data Services roadmap: not verified.
