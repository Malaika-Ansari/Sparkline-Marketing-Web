# Report Generation Architecture

**Sparkline Marketing — AI-Powered Marketing Intelligence & Strategy Platform**  
*Document Version: 1.0.0 — Phase 20 (Reports & Insights Command Center)*

---

## 1. Executive Overview

The **Sparkline Marketing Report Generation Architecture** is an enterprise-grade reporting engine that synthesizes intelligence across the platform's multi-discipline marketing modules into executive-ready dossiers. The system compiles qualitative strategic analysis, quantitative econometric models, market benchmarks, SEO technical audits, advertising flights, and multi-currency budgets into board-level presentations, downloadable PDF documents, and audit-ready data exports.

A core tenet of the architecture is **zero synthetic data**: the reporting engine strictly accesses persisted state across user-configured projects, unified strategies, financial models, and research stores. All claims, metrics, and forecasts are tagged with cryptographic-like data provenance classifications to maintain unwavering trust with executive decision-makers, auditors, and institutional stakeholders.

```
+----------------------------------------------------------------------------------------------------+
|                                    SPARKLINE MARKETING ECOSYSTEM                                   |
|                                                                                                    |
|  [Project Profiles]   [AI Strategy Engine]    [Audience Personas]    [Competitor Intelligence]      |
|  [Market Research]    [Budget Allocation]     [Currency Converter]   [Metrics Calculator]          |
|  [ROI Forecasting]    [Campaign Studio]       [Content Creation]     [SEO Intelligence Hub]        |
+----------------------------------------------------------------------------------------------------+
                                                 |
                                                 v
+----------------------------------------------------------------------------------------------------+
|                                   REPORT SYNTHESIS PIPELINE                                        |
|                                                                                                    |
|  1. Project Context Resolution   --> Evaluates data availability across all 19 domain services     |
|  2. Template & Section Mapping   --> Configures 25 modular sections based on 11 standard blueprints|
|  3. Data Provenance Tagging      --> Assigns 10 verifiable provenance classifications to all rows  |
|  4. Detail-Level Filtering       --> Dynamically expands or condenses narrative and KPI density    |
|  5. Multi-Channel Export Engine  --> Generates Vector PDF (Print), Binary PDF 1.4, and CSV tabular |
+----------------------------------------------------------------------------------------------------+
                                                 |
                                                 v
+----------------------------------------------------------------------------------------------------+
|                                       PRESENTATION TIER                                            |
|                                                                                                    |
|  - Reports Dashboard (/dashboard/reports): KPI metrics, template gallery, search, filter, actions  |
|  - 5-Step Custom Builder Wizard: Project -> Template -> Modular Sections -> Branding -> Validation|
|  - Interactive In-App Dossier Viewer: Modal reader with section bookmarks and provenance badges    |
|  - Browser Print-to-PDF Window: Isolated DOM with A4 vector CSS, running headers, and page breaks  |
|  - Client-Side Binary PDF Exporter: Zero-dependency PDF 1.4 binary stream builder                  |
|  - Tabular Data CSV Exporter: Structured RFC 4180 export for BI systems & spreadsheet modeling     |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Ingestion & Data Source Map

The Report Service (`src/services/report.service.ts`) interfaces with the complete suite of domain services across Prompts 01–19 to extract verified project artifacts:

| Domain Service | Ingested Data Models | Utilized in Sections |
|:---|:---|:---|
| **Project Service** (`projectService`) | Business profile, industry, location, target markets, products/services catalog, pricing tiers, COGS. | Cover, Company Overview, Target Audience, Brand Positioning. |
| **Unified Strategy Service** (`unifiedStrategyService`) | Executive summary, positioning statements, core pillars, action plans, conversion improvements. | Executive Summary, Marketing Strategy, Strategic Action Plan. |
| **Audience Service** (`audienceService`) | Personas, demographics, psychographics, pain points, objection frameworks, customer journeys. | Target Audience, Personas & Behavioral Profiles. |
| **Market Research Service** (`marketResearchService`) | TAM / SAM / SOM estimates, market growth rates (CAGR), consumer trends, demand velocity. | Market Research & Industry Demand. |
| **Competitor Service** (`competitorService`) | Competitor matrix, direct/indirect competitors, feature comparisons, pricing indices, differentiation. | Competitor Benchmarking Matrix, Differentiation Strategy. |
| **SWOT & PESTLE Service** | Strengths, Weaknesses, Opportunities, Threats, Political, Economic, Social, Tech, Legal, Environmental. | SWOT Strategic Matrix, PESTLE Macro Environment. |
| **Budget Service** (`budgetService`) | Total monthly spend, channel allocations, operational expenses, testing buffers, risk profiles. | Marketing Budget Allocation, Budget Timeline. |
| **Currency Service** (`currencyService`) | Baseline FX rates (USD, EUR, GBP, CAD, AUD, JPY), purchasing power parity (PPP) ad spend factors. | Multi-Currency Financial Conversions. |
| **Metrics Service** (`metricsService`) | Blended CAC, LTV, LTV:CAC, payback periods, ROAS thresholds, conversion rate baselines. | Marketing Economics & CAC, Conversion Optimization. |
| **Forecast Service** (`forecastService`) | Conservative / Balanced / Growth scenarios, 12-month projections, break-even customer volume. | ROI & Performance Forecast, Risk & Sensitivity. |
| **Campaign Studio Service** (`campaignService`) | Flight rosters, platform splits (Meta, Google, LinkedIn), creative formats, ad copy angles. | Paid Advertising Campaigns, Creative Asset Specifications. |
| **Content Studio Service** (`contentService`) | Editorial calendars, content pillars, publishing cadence, distribution channels, hook formats. | Content Marketing Strategy, Social Media Strategy. |
| **SEO Intelligence Service** (`seoService`) | Technical audits, crawl health scores, Core Web Vitals, keyword universe, backlink profiles. | SEO Intelligence & Audit, Keyword Strategy. |

---

## 3. The 25 Modular Report Sections

The reporting architecture organizes insights into 25 reusable, composable sections (`ReportSectionId`). Each section defines its data prerequisites, estimated page weight, category, and provenance requirements:

1. **`cover`**: Executive Presentation Cover with whitelabeled company branding, report title, subtitle, confidentiality classifications, and author metadata.
2. **`executive_summary`**: High-level strategic briefing synthesizing growth opportunities, macro objectives, core KPI targets, and executive directives.
3. **`company_overview`**: Business background, operating model, products/services catalog, pricing models, and regional reach.
4. **`marketing_objectives`**: Explicit quarterly growth OKRs, acquisition targets, CAC ceilings, and measurable milestone targets.
5. **`target_audience`**: Psychographic profiles, core buyer personas, pain points, purchasing behavior, and objections.
6. **`market_research`**: Total addressable market (TAM), serviceable addressable market (SAM), compound annual growth rates, and structural industry trends.
7. **`competitor_analysis`**: Competitive landscape, market positioning matrix, competitor vulnerabilities, and share-of-voice estimates.
8. **`swot_analysis`**: Four-quadrant matrix evaluating internal Strengths & Weaknesses against external Opportunities & Threats.
9. **`pestle_analysis`**: Macro-environmental audit covering Political, Economic, Social, Technological, Legal, and Environmental forces.
10. **`marketing_strategy`**: Multi-pillar strategic framework detailing acquisition, authority building, and full-funnel conversion mechanics.
11. **`brand_positioning`**: Value proposition, messaging pillars, brand voice guidelines, and perceptual differentiation maps.
12. **`budget_allocation`**: Mathematical capital distribution across paid media, content, creative production, operations, and testing reserves.
13. **`currency_conversions`**: Institutional multi-currency financial models evaluating marketing expenses across global trading currencies.
14. **`marketing_metrics`**: Unit economics breakdown covering customer acquisition cost (CAC), lifetime value (LTV), and churn rates.
15. **`performance_forecast`**: Scenario-modeled 12-month projections (Conservative, Balanced, Optimistic) detailing revenue, orders, and ROAS.
16. **`advertising_campaigns`**: Paid media flight schedules, platform structures (Google, Meta, LinkedIn), and daily budget caps.
17. **`creative_specs`**: Asset production guidelines, copy angles, messaging hooks, and visual layout parameters.
18. **`content_marketing`**: Content pillar architecture, editorial workflows, pillar-cluster structures, and distribution frequencies.
19. **`social_media_strategy`**: Platform-specific engagement roadmaps, community management protocols, and influencer criteria.
20. **`seo_audit`**: Technical domain health, Core Web Vitals compliance, indexing status, and site speed benchmarks.
21. **`keyword_strategy`**: High-intent transactional, commercial, and informational search term targeting portfolios.
22. **`conversion_optimization`**: Conversion rate optimization (CRO) opportunities, landing page requirements, and friction reduction.
23. **`risk_assessment`**: Sensitivity analysis, platform dependency risks, regulatory considerations, and mitigation protocols.
24. **`implementation_roadmap`**: Phased 30/60/90/180-day operational milestone timeline with resource ownership.
25. **`appendix_sources`**: Comprehensive evidence trail detailing all data sources, verified benchmarks, and provenance classifications.

---

## 4. Multi-Step Report Builder Pipeline

The builder wizard (`ReportsPage.tsx`) implements a deterministic 5-step workflow:

```
[ Step A: Select Project ]
       |
       v
[ Step B: Select Report Template ]  (11 pre-architected templates or Custom)
       |
       v
[ Step C: Modular Section Selector ] (Select from 25 sections with live data readiness badges)
       |
       v
[ Step D: Customization & Branding ] (Titles, prepared for/by, period, detail level, toggles)
       |
       v
[ Step E: Review, Validation & Generation ] (Live preview, provenance audit, instant compilation)
```

### Data Readiness Evaluation
Before generation, `reportService.evaluateProjectDataAvailability(projectId)` queries all local services to compute a data readiness score (0–100%) for each modular section:
- **`Ready`** (Green): All underlying domain models (e.g. Budget plans, SEO audits, Campaigns) exist and contain valid records.
- **`Partial`** (Amber): Core project metadata exists, but specialized module records (e.g. specific competitor profiles) have not yet been generated.
- **`Unavailable`** (Slate): Project has not yet run analysis for this specific domain.

The builder warns the user if selected sections lack primary data, preventing hollow or incomplete reports.

---

## 5. Persistence, State & Storage Architecture

Reports are persisted locally in the browser via `localStorage` under the key:
`sparkline_marketing_reports`

### Data Schema (`MarketingReport`)
```typescript
interface MarketingReport {
  id: string;                         // UUID primary key (e.g. 'rep-vitamin-c-exec')
  projectId: string;                  // Associated MarketingProject ID
  projectName: string;                // Cached project display name
  templateId: string;                 // Source template identifier
  templateName: string;               // Human-readable template title
  status: ReportStatus;               // 'Draft' | 'Generating' | 'Ready' | 'Archived'
  version: number;                    // Incremental version counter (v1, v2...)
  configuration: ReportConfiguration; // Title, date, period, branding, detail level, sections
  sections: ReportSectionContent[];   // Rendered content blocks, KPIs, tables, recommendations
  sources: ReportSourceCitation[];    // Comprehensive bibliography of consulted sources
  completenessScore: number;          // 0-100 percentage based on filled section data
  createdAt: string;                  // ISO 8601 creation timestamp
  updatedAt: string;                  // ISO 8601 update timestamp
  downloadCount: number;              // Export usage counter
}
```

### Immutable Versioning & Lifecycle
- **Generate**: Compiles a fresh snapshot of the project's current state. Status transitions from `Generating` to `Ready` once compilation finishes.
- **Regenerate**: Increments the report's version number (`version: report.version + 1`), pulls the latest live data from domain stores, and updates `updatedAt`.
- **Duplicate**: Clones the complete configuration into a new `Draft` report with an incremented copy title (`"Report (Copy)"`).
- **Archive / Restore**: Toggles the report between active dashboard listings and archived cold storage.
- **Delete**: Soft and hard removal with defensive modal confirmation.

---

## 6. Export Engines & Generation Modalities

The platform provides three independent, enterprise-grade export mechanisms:

### 1. Dedicated Browser Print-to-PDF Window (`printReportToPdf`)
- Creates an isolated popup browser context loaded with an A4 print-optimized stylesheet.
- Implements strict CSS page rules:
  ```css
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
  }
  @media print {
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .page-break { page-break-before: always; break-before: page; }
    .avoid-break { break-inside: avoid; page-break-inside: avoid; }
  }
  ```
- Renders running headers, confidentiality classification bars, numbered pagination, high-contrast tables, and full-fidelity typography.
- Triggers native `window.print()` for crisp, infinite-resolution vector rendering directly to printer or system PDF file.

### 2. Pure TypeScript Binary PDF 1.4 Exporter (`exportReportToPdfFile`)
- Zero-dependency client-side PDF 1.4 engine implemented in pure TypeScript.
- Conforms to Adobe `%PDF-1.4` specification with catalog object tree, fonts table, page dictionaries, and compressed text streams.
- Direct output to binary `Uint8Array`, converted to `Blob` and auto-downloaded as `.pdf`.
- Works 100% offline with zero external network roundtrips or third-party npm packages.

### 3. Structured CSV Tabular Exporter (`exportReportToCsv`)
- Formats all report tables, KPI metrics, and provenance metadata into RFC 4180-compliant CSV files.
- Ideal for exporting quantitative models directly into Microsoft Excel, Google Sheets, or corporate BI dashboards (PowerBI, Tableau).

---

## 7. Quality & Verification Standards

1. **Zero Mock Hallucinations**: When project records are missing, the report explicitly marks the baseline as an industry reference benchmark or indicates that module data is pending.
2. **Precision Number Formatting**: Currencies, percentages, multipliers, and ratios are formatted using standard international decimal notation.
3. **Responsive Visual Rendering**: Interactive report viewer and preview modals render seamlessly across mobile, tablet, and ultra-wide desktop viewports.

