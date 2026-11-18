# Sparkline Marketing — Project Architecture (Phases 1 & 2)

## Executive Summary
Sparkline Marketing is an AI-powered marketing intelligence and predictive growth strategy SaaS platform. This document defines the engineering, frontend, and systems architecture established during Phase 1 (Project Initialization & Architecture) and Phase 2 (Complete Brand Design System & Reusable UI Component Library).

---

## 1. Directory Structure

```
Sparkline Marketing Website/
├── .env.example              # Public template of environment variables
├── .gitignore                # Production git exclusion patterns
├── index.html                # Application root template with SEO baseline
├── package.json              # Managed dependencies & build scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Exact brand palette & styling tokens
├── tsconfig.json             # Strict TypeScript compiler options
├── tsconfig.node.json        # Node configuration for Vite
├── vite.config.ts            # Vite bundler config with path aliasing & manual chunking
├── COMPONENT_LIBRARY.md      # API reference for reusable UI components
├── DESIGN_SYSTEM.md          # Comprehensive design tokens, palette & guidelines
├── DEVELOPMENT_ROADMAP.md    # 25-Phase structured progression guide
├── PROJECT_ARCHITECTURE.md   # System architecture & technology reference
├── README.md                 # Project overview & developer guide
├── SECURITY.md               # Security architecture & boundary specifications
├── SEO_GUIDELINES.md         # Technical SEO, content & metadata specifications
├── public/
│   ├── icons/                # Vector brand assets & favicons
│   │   └── sparkline-icon.svg
│   ├── images/               # High-fidelity marketing screenshots / diagrams
│   ├── robots.txt            # Search engine crawling rules
│   └── sitemap.xml           # Semantic XML sitemap
├── src/
│   ├── assets/               # Local static assets & SVGs
│   ├── components/
│   │   ├── charts/           # Interactive analytics, Recharts suites & ChartContainer
│   │   │   ├── ChartContainer.tsx
│   │   │   ├── SparklineChart.tsx
│   │   │   └── SparklineCharts.tsx
│   │   ├── common/           # Reusable atomic UI
│   │   │   ├── Badge.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── DataViz.tsx
│   │   │   ├── Feedback.tsx
│   │   │   ├── Form.tsx
│   │   │   ├── Logo.tsx
│   │   │   └── SEO.tsx
│   │   ├── dashboard/        # Dashboard layout components & module placeholders
│   │   │   ├── DashboardModulePlaceholder.tsx
│   │   │   ├── DemonstrationCard.tsx
│   │   │   └── OpportunityCard.tsx
│   │   ├── marketing/        # Marketing-specific UI components
│   │   │   ├── AIAnalysisPanel.tsx
│   │   │   ├── BudgetAllocationCard.tsx
│   │   │   ├── CampaignStatusCard.tsx
│   │   │   ├── MarketingKPIBadge.tsx
│   │   │   ├── MarketingMetricCard.tsx
│   │   │   ├── MarketingRecommendationCard.tsx
│   │   │   └── MarketingScoreCard.tsx
│   │   └── navigation/       # Navigation suite
│   │       ├── Footer.tsx
│   │       ├── GlobalSearch.tsx
│   │       ├── HelpMenu.tsx
│   │       ├── MobileNavigation.tsx
│   │       ├── Navbar.tsx
│   │       ├── NotificationMenu.tsx
│   │       ├── Sidebar.tsx
│   │       ├── TopBar.tsx
│   │       └── UserProfileMenu.tsx
│   │       └── UserProfileMenu.tsx
│   ├── config/               # Site-wide constants, navigation schemas, metadata
│   ├── hooks/                # Custom React hooks (useSEO, useToast)
│   ├── layouts/              # PublicLayout, DashboardLayout
│   ├── lib/                  # Utilities (cn, formatting, validation helpers)
│   ├── pages/
│   │   ├── public/           # Public pages & /design-system showcase
│   │   └── dashboard/        # Authenticated workspace pages & placeholders
│   ├── routes/               # Declarative React Router route definitions
│   ├── services/             # API layer, AI abstraction, mock data providers
│   ├── styles/               # Global CSS, Tailwind directives, tokens.ts
│   ├── types/                # Strict TypeScript domain interfaces
│   ├── App.tsx               # App entry and provider wrapper (ToastProvider)
│   └── main.tsx              # DOM mounting point
```

---

## 2. Technology Stack & Design Decisions

### Frontend Framework
- **React 18 (TypeScript 5.5+)**: Strict component typing, zero implicit any, modern functional paradigms.
- **Vite 5**: Next-generation frontend tooling providing lightning-fast HMR and optimized Rollup production builds.
- **Tailwind CSS 3.4**: Custom-extended theme implementing the Sparkline color palette and SaaS typography.
- **React Router 6**: Declarative client-side routing with clean layout separation and dynamic code-splitting.
- **Lucide React**: Crisp, modern stroke icons for SaaS navigation and tool identification.
- **Recharts 2.12**: Responsive SVG-based charting library for marketing performance and sparkline trend curves.

### Brand Design Tokens
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Midnight Navy** | `#071329` | Primary dark surface, dashboard sidebar background |
| **Deep Slate** | `#152238` | Secondary dark surface, dark card borders, sub-elements |
| **Electric Blue** | `#0C65F4` | Primary brand accent, primary CTA, active states |
| **Royal Purple** | `#593090` | Strategic gradient mid-tone, intelligence markers |
| **Magenta** | `#C52B85` | High-impact accent, conversion spark, peak gradients |
| **Sky Cyan** | `#2292D9` | Supporting highlight, metric indicators, tech cues |
| **Growth Orange** | `#E37C33` | Growth highlight, high-priority opportunities, warnings |
| **Cloud White** | `#F5F7FC` | Primary light background, clean dashboard workspace |

---

## 3. Design System & Component Library (Phase 2)
See [DESIGN_SYSTEM.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/DESIGN_SYSTEM.md) and [COMPONENT_LIBRARY.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/COMPONENT_LIBRARY.md) for detailed token architectures and API references for all components.
An interactive demonstration of all components is live at `/design-system`.

---

## 4. Product Information & Business Analysis Engine (Phase 06)

See [PROJECT_DATA_MODEL.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/PROJECT_DATA_MODEL.md) for the exhaustive specification of data models, validation constraints, persistence mechanics, and future relational mapping.

### Key Capabilities
- **Multi-Step Onboarding Architecture**: 6-step guided wizard at `/dashboard/projects/new` capturing:
  1. Business profile & industry classification.
  2. Products/services, multi-item catalog, and unit economics (selling price, COGS, gross margin, USP).
  3. Target audience intelligence (locations, age ranges, pain points, purchasing psychology).
  4. Competitors & market positioning (direct rivals, differentiators, competitive advantages).
  5. Marketing goals & budget allocation (10 multi-select goals, primary objective, ad spend, channels, horizons).
  6. Comprehensive review, inline step edits, and project compilation.
- **Client-Side Persistence Layer (`ProjectService`)**:
  - `localStorage` key `sparkline_marketing_projects` with seed fixtures (`proj-vitamin-c` DTC Skincare and `proj-apex-cloud` B2B SaaS).
  - Real-time draft autosave (`sparkline_marketing_new_project_draft`).
- **Interactive Project Repository**:
  - `/dashboard/projects` repository listing active marketing intelligence projects with budget, channel, and margin badges.
  - `/dashboard/projects/:id` project detail workspace displaying all 5 business pillars and quick navigation to AI strategy tools.

---

## 5. AI Marketing Strategist Engine (Phase 07)

See [AI_STRATEGIST_ARCHITECTURE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/AI_STRATEGIST_ARCHITECTURE.md), [AI_STRATEGY_FRAMEWORK.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/AI_STRATEGY_FRAMEWORK.md), [AI_PROMPT_DESIGN.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/AI_PROMPT_DESIGN.md), and [AI_SECURITY.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/AI_SECURITY.md) for complete technical references.

### Key Capabilities
- **Secure Server-Side AI Proxy**: Vite middleware plugin (`sparklineAiApiPlugin` in `src/server/ai-proxy-middleware.ts`) handling `GET /api/ai-status` and `POST /api/generate-strategy`.
- **Credential Protection**: Server-side access to `GEMINI_API_KEY` from `process.env`. Zero exposure to client-side bundles or `localStorage`.
- **8-Dimensional Strategy Synthesis**: Generates Executive Summary, Business Understanding, Product Analysis (Features vs. Benefits), Target Audience Insights (separating verified facts from AI hypotheses), Positioning & 3 Messaging Angles, Prioritized Channels, 6-Stage Funnel, Budget Breakdown, Measurement Framework, and Sequenced Action Items.
- **3 Strategic Approaches**: Conservative (low risk demand validation), Balanced (sustainable organic/paid mix), and Aggressive Growth (rapid scale sprint).
- **Strategy Persistence & History**: Local persistence under `sparkline_marketing_strategies` with multi-version tracking and pre-seeded reference blueprints for demonstration projects.

---

## 6. Target Audience & Customer Persona Analyzer (Phase 08)

See [AUDIENCE_INTELLIGENCE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/AUDIENCE_INTELLIGENCE.md), [CUSTOMER_PERSONA_FRAMEWORK.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/CUSTOMER_PERSONA_FRAMEWORK.md), [AUDIENCE_AI_PROMPTS.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/AUDIENCE_AI_PROMPTS.md), and [AUDIENCE_DATA_MODELS.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/AUDIENCE_DATA_MODELS.md) for complete technical references.

### Key Capabilities
- **Audience Intelligence Command Center**: Interactive analysis page at `/dashboard/audience` ("Know Your Audience. Market With Precision.").
- **Audience Research Input Form**: Form for fine-tuning market scope, customer model (`B2B`, `B2C`, `Both`), needs, pain points, interests, objections, and commercial parameters.
- **AI Audience Segmentation Engine**: Generates up to 5 strategic cohorts with prioritized needs, pain points, motivations, objections, product relevance, channels, and CTAs (explicitly labeled with `isHypothesis: true`).
- **Structured Customer Personas**: Fictional archetype representations with explicit age range assumptions, psychological drivers, marketing behavior, and tactical recommendations with global bookmarking support.
- **6-Stage Customer Decision Journey**: Complete lifecycle mapping (Awareness &rarr; Interest &rarr; Consideration &rarr; Purchase &rarr; Retention &rarr; Advocacy) detailing mindset, main question, obstacles, activities, formats, channels, and KPIs.
- **Segment Messaging Generator**: Multi-angle copy generator providing Main Message, Pain-Point-Focused, Benefit-Focused, Emotional, and Educational angles with CTAs and recommended tone.
- **Server-Side AI Proxy Endpoint**: Secured endpoint `POST /api/generate-audience` in `src/server/ai-proxy-middleware.ts` with rate limiting, error sanitization, and 45s timeout.
- **Client Persistence Layer**: Local storage under `sparkline_marketing_audience_analyses` and `sparkline_marketing_saved_personas` with pre-seeded reference blueprints for demonstration projects.

---

## 7. Market Research & Industry Intelligence Engine (Phase 09)

See [MARKET_RESEARCH_ARCHITECTURE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/MARKET_RESEARCH_ARCHITECTURE.md), [RESEARCH_SOURCE_POLICY.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/RESEARCH_SOURCE_POLICY.md), [PESTLE_FRAMEWORK.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/PESTLE_FRAMEWORK.md), and [MARKET_OPPORTUNITY_SCORING.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/MARKET_OPPORTUNITY_SCORING.md) for complete technical references.

### Key Capabilities
- **Market Research Command Center**: Located at `/dashboard/market-research` (*"Understand Your Market Before You Invest."*) with project selector, research topic, research depth (`Quick Overview`, `Standard Research`, `Deep Research`), and previous reports switcher.
- **Market Research Input System**: Collapsible drawer enabling parameter tuning across industry sector, product subcategory, target market, customer segment, main competitors, unit price range, business objectives, and specific research questions.
- **Comprehensive Intelligence Framework**:
  - **Industry Overview**: Detailed structural characteristics, margin velocities, developments, and demand drivers.
  - **Market Demand Signals**: Qualitative demand indicators and search intent behavior (zero synthetic search volume numbers or fake percentages).
  - **Market Trends**: Categorized category shifts across customer behavior, technology, product innovation, channel shifts, and regulation with dates and source citations.
  - **Market Opportunities**: Prioritized commercial growth vectors with multi-dimensional scoring (Customer Relevance, Business Fit, Evidence Strength, Implementation Effort, Strategic Value, Risk Level) and actionable next steps. Displays "Insufficient Evidence" when empirical data is lacking.
  - **Market Challenges & Risks**: Identifies authentic category friction (CAC inflation, platform dependency, pricing pressure) with practical mitigations.
  - **6-Pillar PESTLE Analysis**: Evaluates Political, Economic, Social, Technological, Legal, and Environmental external forces with Impact, Business Relevance, Opportunity/Threat classification, and confidence ratings.
- **Source Verification & Epistemic Honesty**:
  - Authoritative citations with source titles, publishers, URLs, publication dates, and specific claims validated.
  - Prominent epistemic grounding disclosure clarifying the boundary between verified facts and qualitative strategic reasoning.
- **Interactive AI Research Assistant**:
  - Grounded chat interface dedicated to the active report context with starter prompts, cited source pills, and strategic reasoning disclosures.
- **Report Management**:
  - Local persistence under `sparkline_marketing_research_reports`, report renaming, version comparison modal, deletion, print/PDF export, and clipboard findings copy.
- **Secure Server-Side AI Endpoints**:
  - Secured `POST /api/generate-market-research` and `POST /api/research-assistant` in `src/server/ai-proxy-middleware.ts` with IP rate limiting and 45s abort timeout.

---

## 8. Competitor Intelligence & Benchmarking Engine (Phase 10)

See [COMPETITOR_INTELLIGENCE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/COMPETITOR_INTELLIGENCE.md), [COMPETITOR_RESEARCH_POLICY.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/COMPETITOR_RESEARCH_POLICY.md), [SWOT_ANALYSIS_FRAMEWORK.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/SWOT_ANALYSIS_FRAMEWORK.md), and [COMPETITIVE_POSITIONING.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/COMPETITIVE_POSITIONING.md) for complete technical references.

### Key Capabilities
- **Competitor Intelligence Command Center**: Interactive page at `/dashboard/competitors` (*"Know Your Competition. Find Your Advantage."*).
- **Competitor Information Management**: Add, edit, delete, and classify competitors as `Direct` or `Indirect` with custom notes, pricing information, main selling points, strengths, weaknesses, and social media links.
- **Competitor Discovery Engine**: Automated discovery of real, authentic commercial competitors without ever fabricating synthetic brand names.
- **Side-by-Side Comparison Matrix**: Horizontally scrollable comparison table benchmarking pricing position, value proposition, target audience, brand positioning, observed strengths, observed weaknesses, and differentiation opportunities.
- **Multi-Entity SWOT Analysis**: Comprehensive SWOT models generated separately for the user's business and for each benchmarked competitor with verified vs. AI hypothesis labeling and confidence ratings.
- **8-Dimension Positioning Analysis & 2x2 Spatial Map**: Evaluates price positioning, product differentiation, customer experience, value proposition, messaging, audience, channels, and content, complete with an interactive 2x2 Positioning Map plotting price vs. specialization.
- **Asymmetric Opportunities & Gaps**: Actionable growth vectors prioritized across value, effort, priority, and confidence with mandatory suggested next actions (zero revenue guarantees).
- **Public Evidence Grounding**: Strict public scope, prohibiting claims of private competitor data access.
- **Interactive Competitor AI Assistant**: Grounded Q&A assistant referencing the active report's SWOT, comparison, and source findings.
- **Client Persistence Layer**: Local storage under `sparkline_marketing_project_competitors` and `sparkline_marketing_competitor_reports` with pre-seeded reference blueprints for demonstration projects.

---

## 9. Marketing Strategy Recommendation Engine (Phase 11)

See [MARKETING_STRATEGY_ENGINE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/MARKETING_STRATEGY_ENGINE.md), [STRATEGY_RECOMMENDATION_FRAMEWORK.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/STRATEGY_RECOMMENDATION_FRAMEWORK.md), [MARKETING_ACTION_PLAN.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/MARKETING_ACTION_PLAN.md), and [STRATEGY_KPI_FRAMEWORK.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/STRATEGY_KPI_FRAMEWORK.md) for complete technical references.

### Key Capabilities
- **Unified Strategy Command Center**: Dedicated route at `/dashboard/strategy` (*"Your Business Deserves a Smarter Marketing Strategy."*).
- **Five-Engine Multi-Source Synthesis**: Blends Business Profile & Unit Economics, Audience Intelligence & Personas, Market Research & PESTLE, Competitor Intelligence & SWOT, and Strategic Horizons into one cohesive blueprint.
- **Data Completeness & Module Synthesis Audit**: Real-time evaluation of contributing modules (Business Profile, Products, Audience, Market Research, Competitors, Budget) with missing module alerts, conflicting signal warnings, and assumption disclosures.
- **Three Strategic Growth Modes (Strategic Horizons)**:
  - **Lean Growth**: Low capital, organic-first motion, creator seeding, and referral loops.
  - **Balanced Growth**: Sustainable blend of paid acquisition and retention balancing velocity and capital efficiency.
  - **Accelerated Growth**: High-velocity multi-channel scaling across paid media, influencer partnerships, and PR.
- **Comprehensive Strategy Synthesis**:
  - **Executive Summary**: Commercial situation diagnosis, core objective, highest-leverage opportunity, and main challenge.
  - **Brand Positioning**: Positioning statement, USP, core brand message, differentiation, brand personality traits, and tone of voice.
  - **Target Audience Strategy**: Primary/secondary segments, acute pain points, motivations, messaging angles, and audience priorities.
  - **Prioritized Marketing Channels**: Evaluates funnel stage (TOFU, MOFU, BOFU, Retention), strategic purpose, audience match, recommended activities, suggested KPIs, resources, and limitations.
  - **Content Strategy**: Core content pillars, educational/promotional/engagement/trust-building themes, formats, and publishing cadence.
  - **Customer Acquisition & Retention**: Lead generation mechanisms, CRO priorities, offer strategy, retargeting architecture, lifecycle email automation flows, and loyalty initiatives.
  - **Growth Opportunities**: New audience segments, product positioning vectors, geographic expansion, and strategic partnerships.
- **Interactive Prioritized Marketing Action Plan**:
  - Tasks sequenced across Immediate (Weeks 1–2), Short-Term (Weeks 3–6), Medium-Term (Months 2–3), and Long-Term (Months 4–6).
  - Filterable by period, priority (High, Medium, Low), and execution status.
  - Interactive status toggles (`not_started`, `in_progress`, `completed`, `on_hold`) with real-time LocalStorage synchronization, visual progress bar, and toast feedback.
- **Mathematical KPI Measurement Framework**:
  - Categorized across Acquisition, Revenue, Retention, Awareness, and Engagement.
  - Explicit mathematical formulas, definitions, strategic rationales, data required, measurement frequencies, and target benchmark ranges.
- **Supporting Cross-Engine Evidence References**:
  - Explicit citations cross-referencing findings from upstream engines with confidence level ratings (`High`, `Medium`, `Low`).
- **Client Persistence Layer**: Local storage under `sparkline_marketing_unified_strategies` with pre-seeded reference blueprints for `proj-vitamin-c` (*GlowBiome Organics*) and `proj-apex-cloud` (*ApexSec Cloud Intelligence*).
- **Secure Server-Side AI Proxy**: Secured `POST /api/generate-unified-strategy` in `src/server/ai-proxy-middleware.ts` with IP rate limiting and 45s timeout.

---

## 10. Marketing Budget Allocation Planner (Phase 12)

See [MARKETING_BUDGET_PLANNER.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/MARKETING_BUDGET_PLANNER.md), [BUDGET_ALLOCATION_FRAMEWORK.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/BUDGET_ALLOCATION_FRAMEWORK.md), [BUDGET_CALCULATION_RULES.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/BUDGET_CALCULATION_RULES.md), and [BUDGET_DATA_MODELS.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/BUDGET_DATA_MODELS.md) for complete technical references.

### Key Capabilities
- **Budget Command Center**: Interactive page at `/dashboard/budget` (*"Make Every Marketing Dollar Work Smarter."*).
- **Global Currency & Horizon Controls**:
  - Direct conversion and display across 6 global currencies (`USD`, `EUR`, `GBP`, `CAD`, `AUD`, `JPY`).
  - Flexible planning periods (`Daily`, `Weekly`, `Monthly`, `Quarterly`, `Campaign`).
  - Proportional recalculation: Modifying total budget dynamically updates category amounts while preserving percentage distribution.
- **Three Strategic Allocation Variants**:
  - **Conservative Budget**: High-intent search, email lifecycle, creator seeding, and capital preservation.
  - **Balanced Budget**: Scaled multi-channel customer acquisition and retention with a protected 10% experimentation buffer.
  - **Growth-Focused Budget**: Aggressive scaling across channels with rapid testing (15%+), accompanied by explicit risk disclosures.
- **5-Pillar Budget Breakdown**:
  - `Advertising Spend`, `Content and Creative`, `Marketing Operations`, `External Services`, `Testing and Reserve`.
- **Interactive Budget Allocation Editor**:
  - Slider and numeric inputs for percentages and direct monetary amounts with bidirectional synchronization.
  - Custom category builder with group categorization, strategic purpose, and primary KPI assignment.
  - Dynamic removal of unnecessary categories.
  - One-click restore to original algorithm recommendations.
- **Strict Mathematical Validation**:
  - Integer minor-unit arithmetic preventing floating-point rounding errors.
  - Real-time 100% allocation check and unallocated cash tracking.
  - Quick "Assign Remainder to Testing" auto-balancing helper.
- **Visual Analytics Suite (Recharts)**:
  - Budget distribution donut chart with total readout in center.
  - 5-Pillar horizontal bar chart showing category percentages.
  - 3-Plan comparative scenario bar chart across pillars.
  - 6-Month stacked area monthly spending timeline.
- **KPI Governance & Real-Time Risk Auditing**:
  - Channel-to-KPI mapping table with review frequencies and live execution statuses (zero fabricated forecasts).
  - 6 programmatic warnings: Concentration risk (>50%), testing deficit (<5%), channel dilution (<$300/mo), creative deficit (<5% creative with >40% ad spend), excessive operations (>35%), and unallocated funds.
- **Persistence & Exporting**:
  - LocalStorage under `sparkline_marketing_budget_plans` with version branching and plan duplication.
  - Markdown table clipboard copying and print/PDF export styling.
- **Server-Side AI Proxy**:
  - Secured `POST /api/generate-budget-plan` with sliding-window rate limiting, input sanitization, and 45s abort timeout.

---

## 11. Multi-Currency Conversion & Marketing Cost Calculator (Phase 13)

See [CURRENCY_CONVERTER.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/CURRENCY_CONVERTER.md), [EXCHANGE_RATE_INTEGRATION.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/EXCHANGE_RATE_INTEGRATION.md), [MARKETING_COST_FORMULAS.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/MARKETING_COST_FORMULAS.md), and [FINANCIAL_CALCULATION_RULES.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/FINANCIAL_CALCULATION_RULES.md) for complete technical references.

### Key Capabilities
- **Dedicated Currency & Cost Command Center**: Interactive page at `/dashboard/currency` (*"Understand Your Marketing Costs in Any Currency."*).
- **15 Supported Marketing Currencies**: `USD`, `PKR`, `GBP`, `EUR`, `AED`, `SAR`, `INR`, `CAD`, `AUD`, `JPY`, `CNY`, `BDT`, `TRY`, `MYR`, `SGD` with exact ISO currency sub-unit precision.
- **Multi-Currency Converter**:
  - Instant conversion calculations, one-click currency swap, clipboard copying, rapid test increment chips ($100 to $50k), and a 14-currency cross matrix.
  - Transparent rate metadata: Provider name, last updated timestamp, rate classification (`live` vs. `reference`), and data availability status.
  - Zero synthetic rate fabrication: Automatically provides institutional reference baselines (ECB/IMF) when live network feeds are unavailable.
- **8 Marketing Cost Calculators**:
  - Dedicated formula engines for **CPC**, **CPM**, **CPA**, **CPL**, **CTR**, **Conversion Rate (CVR)**, **ROAS**, and **ROI**.
  - Division-by-zero protection prevents application errors and delivers actionable guidance.
  - Clear financial distinction separating direct advertising media spend from comprehensive campaign investment, and distinguishing ad ROAS multipliers from true net ROI.
- **Advertising Cost Benchmark Comparison**:
  - Benchmarks costs across networks (Meta, Google, TikTok, LinkedIn) and countries (US, UK, Pakistan, UAE, etc.) normalized into a common currency.
  - Adheres strictly to parity disclaimers without biased or unverified claims.
- **Marketing Expense Estimator & Actual Tracker**:
  - 10 standardized categories: Advertising, Creative, Graphic Design, Video Editing, Copywriting, Influencer Seeding, Software SaaS, Agency Retainers, Freelancers, and Other.
  - Compares estimated vs. actual incurred expenses with live variance calculations and currency normalization.
- **Budget Planner Integration (Prompt 12 Sync)**:
  - Imports saved marketing budget plans from `budgetService.getPlans()`.
  - Converts total budget and individual channel allocations without mutating or overwriting the original saved plan.
- **Historical Conversion Audit Trail**:
  - Persists conversions with exact rate and timestamp snapshots under `sparkline_marketing_currency_conversions` so past results remain reproducible.
  - One-click CSV, JSON, and Markdown exporting.
- **Server-Side API Proxy**:
  - Secured `GET /api/exchange-rates` with live API retrieval and resilient institutional fallback.

---

## 12. Marketing Metrics Calculator & Knowledge Center (Phase 14)

See [MARKETING_METRICS_CATALOG.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/MARKETING_METRICS_CATALOG.md), [METRIC_FORMULAS_AND_RULES.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/METRIC_FORMULAS_AND_RULES.md), [MARKETING_KNOWLEDGE_CENTER.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/MARKETING_KNOWLEDGE_CENTER.md), and [BENCHMARK_SOURCE_POLICY.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/BENCHMARK_SOURCE_POLICY.md) for complete technical references.

### Key Capabilities
- **Dedicated Metrics Hub**: Interactive command center at `/dashboard/metrics` (*"Marketing Metrics & Intelligence"*).
- **16 Precision Metric Calculators across 5 Core Pillars**:
  - *Advertising & Campaigns*: Click-Through Rate (CTR), Cost Per Click (CPC), Cost Per Mille (CPM), Cost Per Acquisition (CPA with ad spend vs. total campaign cost scope selector), Ad Frequency (with impressions $\ge$ reach boundary enforcement).
  - *Social Media*: Engagement Rate (with Followers, Reach, or Impressions denominator selector), Video Completion Rate (VCR with starts vs. completions validation).
  - *Lead Generation*: Cost Per Lead (CPL), Conversion Rate (CVR with Clicks, Sessions, or Visitors denominator selector).
  - *Revenue & Profitability*: Return on Ad Spend (ROAS expressed strictly as ratio, e.g. 4.00x), Return on Investment (ROI net gain % relative to total investment), Customer Acquisition Cost (CAC fully loaded), Customer Lifetime Value (CLV/LTV revenue-based or margin-based).
  - *Website & Email*: GA4 Bounce Rate (non-engaged sessions vs. total sessions, explicitly distinguishing GA4 from legacy Universal Analytics), Email Open Rate (with Apple Mail Privacy Protection disclaimer), Email Click Rate (click-to-delivered standard).
- **Division-by-Zero & Mathematical Boundary Safety**:
  - Zero silent failures: Prevents `NaN` or `Infinity`.
  - Explanatory zero-denominator messages providing actionable guidance when inputs are 0.
  - Strict boundary validations (clicks $\le$ impressions, video completions $\le$ starts, conversions $\le$ clicks).
- **Searchable Knowledge Center**:
  - 8 core marketing disciplines: Marketing Fundamentals, Paid Advertising, Social Media, SEO, Email Marketing, E-commerce Growth, Marketing Analytics, and Conversion Rate Optimization (CRO).
  - Categorized guides with reading times, difficulty levels, practical tips, and direct shortcut buttons linking into relevant calculators.
- **Verified Industry Benchmarks**:
  - Curated research benchmarks from WordStream / LocaliQ (2024 Search Ads), Mailchimp (2024 Email), Shopify (2024 E-commerce), and Gupta Media (2024 CPM Tracker).
  - Prominent ground-truth disclaimer explicitly disclosing that benchmarks are external reference data and encouraging local baseline tracking until ad account APIs are connected.
- **LocalStorage Audit Trail & History Management**:
  - Persistence under `sparkline_marketing_metric_calculations` storing exact calculation parameters, timestamp, active project context, and currency standard.
  - Instant result copying, individual record deletion, history clearing, and one-click CSV export.

---

## 13. Results Prediction, ROI & ROAS Forecasting Engine (Phase 15)

See [MARKETING_FORECASTING_ENGINE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/MARKETING_FORECASTING_ENGINE.md), [FORECAST_FORMULAS_AND_ASSUMPTIONS.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/FORECAST_FORMULAS_AND_ASSUMPTIONS.md), [ROI_ROAS_AND_BREAK_EVEN.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/ROI_ROAS_AND_BREAK_EVEN.md), and [FORECAST_DATA_QUALITY_POLICY.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/FORECAST_DATA_QUALITY_POLICY.md) for complete technical references.

### Key Capabilities
- **Dedicated Forecasting Workspace**: Interactive command center at `/dashboard/forecast` (*"Marketing Results Predictor"*) with `/dashboard/roi-calculator` integration.
- **Three Distinct Scenario Models**:
  - *Conservative Scenario*: Downside boundary modeling auction bid inflation (+20% CPM), lower click response (-25% CTR), and landing page friction (-30% CVR).
  - *Balanced Scenario*: Primary planning target grounded in verified category benchmarks and sustainable organic/paid channels.
  - *Optimistic Scenario*: Upper-quartile ceiling (+25% CTR, +25% CVR, -15% delivery efficiency); explicitly labeled as an aspirational estimate.
- **Strict Financial Accounting**:
  - Separates direct advertising media auction spend from total campaign investment (creative production, agency retainers, software licenses).
  - Calculates ROAS (strictly attributed revenue / ad spend ratio multiplier, e.g. `3.50x`) and Net ROI (net return / total investment percentage, e.g. `+45.0%`).
  - Supports both Revenue-based ROI and Gross Profit Contribution Margin-based ROI.
- **Unit Economic Break-Even Analysis**:
  - Determines break-even revenue, required customers, minimum break-even ROAS ($1 / \text{Gross Margin } \%$), maximum allowable CPA, and required conversion rates.
  - Clarifies calculation basis between gross profit contribution and top-line cash expenditure.
- **Interactive Sensitivity & Impact Modeling**:
  - Evaluates mathematical impact of varying key assumptions (+/- 10%, 20%) across Budget, CPM, CTR, CVR, and AOV.
  - Ranks variables by strategic leverage, identifying Conversion Rate and AOV as highest return drivers.
- **Transparent Data Quality & Source Provenance**:
  - Every input tagged with its authentic source (`actual`, `historical`, `benchmark`, `assumption`).
  - Strict anti-hallucination governance: zero fabricated benchmark numbers or fake historical records.
  - Comprehensive methodology and operational limitations disclosures.
- **AI Strategic Explanation & Risk Diagnostics**:
  - Secured server-side AI proxy `POST /api/generate-forecast-explanation` in `src/server/ai-proxy-middleware.ts` explaining scenario meanings, failure modes, and metrics to monitor without mutating arithmetic.
- **Saved Models & Historical Comparison**:
  - LocalStorage persistence under `sparkline_marketing_forecasts` with version cloning, CSV export, and print/PDF formatting.
  - Compares forecast models against saved verified actual logs from the Marketing Metrics Center.

---

## 14. Advertising Campaign Builder & Studio (Phase 16)

See [ADVERTISING_CAMPAIGN_BUILDER.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/ADVERTISING_CAMPAIGN_BUILDER.md), [CAMPAIGN_PLATFORM_GUIDE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/CAMPAIGN_PLATFORM_GUIDE.md), [AD_COPY_GENERATION_FRAMEWORK.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/AD_COPY_GENERATION_FRAMEWORK.md), [CAMPAIGN_TRACKING_AND_OPTIMIZATION.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/CAMPAIGN_TRACKING_AND_OPTIMIZATION.md), and [AD_PLATFORM_INTEGRATION_POLICY.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/AD_PLATFORM_INTEGRATION_POLICY.md) for technical specifications and policies.

### Key Capabilities
- **Dedicated Advertising Campaign Workspace**:
  - Live at `/dashboard/campaigns` (*"Advertising Campaign Studio"*).
  - 6 integrated operational views: Campaigns Library, Flight Calendar, Ad Copy Generator, Creative Brief Studio, Starter Templates, and Tracking & Optimization.
- **Platform-Aware Hierarchy**:
  - Accurately models the structural differences of major advertising networks:
    - **Meta Ads**: `Campaign` &rarr; `Ad Set` &rarr; `Ad`
    - **Google Ads & TikTok Ads**: `Campaign` &rarr; `Ad Group` &rarr; `Ad`
    - **LinkedIn Ads**: `Campaign Group` &rarr; `Campaign` &rarr; `Ad Creative`
- **6-Step Interactive Campaign Creation Wizard**:
  - Guided step-by-step creation flow with live input validation, currency selection (USD, EUR, GBP, CAD, AUD, PKR, INR, AED, SAR), multi-platform allocation checks, and ad format guidance.
  - Generates immutable unique campaign identifiers (`camp-[timestamp]-[random]`).
- **AI Campaign Strategy Assistant**:
  - Secured server-side AI proxy `POST /api/generate-campaign-plan` in `src/server/ai-proxy-middleware.ts` with rate limiting, input sanitization, and 45s timeout.
  - Generates a structured 13-point strategic plan (objective rationale, platform mix, target audience nuances, creative direction, testing hooks, tracking, and risk mitigation) explaining why each recommendation is suitable.
- **Ad Copy Generation Engine**:
  - Produces 6 distinct messaging angles: *Benefit-Focused*, *Problem-Solution*, *Emotional*, *Promotional*, *Educational*, and *Trust-Building*.
  - Enforces network-specific character limitations (Meta 40-char headline, Google 30-char headline, LinkedIn 70-char headline) with real-time character counters.
- **Creative Brief Studio**:
  - Generates production-ready creative briefs detailing asset dimensions, aspect ratios, visual hooks, copy, and brand guidelines for designers and video editors.
  - Exportable to Markdown and formatted for client presentation.
- **Performance & Optimization Center**:
  - Deterministic metric computation: CTR, CPC, CPM, CPA, CPL, CVR, ROAS, and ROI with zero-denominator protections.
  - 6 rule-based diagnostic triggers: High CPC, Low CTR, High CPA, Low CVR, Creative Fatigue, and Budget Imbalance with actionable operational recommendations.
- **8 Curated Starter Templates**:
  - Pre-configured blueprints for New Product Launch, E-commerce DTC Conversion, B2B Enterprise Lead Engine, Omni-Channel Reach, High-Intent Search, Local Foot Traffic, Seasonal Flash Sale, and Retargeting Recovery.
- **Platform Execution & Integration Policy**:
  - Strict disclosure that Sparkline operates as an offline campaign planner and strategy studio; live campaign publishing requires authenticated network API credentials.
- **Client-Side Persistence & Portability**:
  - LocalStorage persistence under `sparkline_marketing_campaigns`.
  - Full campaign cloning, status management, and one-click CSV export.

---

## 15. Social Media & Content Creation Studio (Phase 17)

See [SOCIAL_MEDIA_CONTENT_STUDIO.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/SOCIAL_MEDIA_CONTENT_STUDIO.md), [CONTENT_GENERATION_FRAMEWORK.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/CONTENT_GENERATION_FRAMEWORK.md), [BRAND_VOICE_GUIDELINES.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/BRAND_VOICE_GUIDELINES.md), [CONTENT_CALENDAR_ARCHITECTURE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/CONTENT_CALENDAR_ARCHITECTURE.md), and [SOCIAL_PUBLISHING_INTEGRATION_POLICY.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/SOCIAL_PUBLISHING_INTEGRATION_POLICY.md) for full technical references and integration policies.

### Key Capabilities
- **Dedicated Content Workspace**:
  - Accessible at `/dashboard/content-studio` (*"Social Media & Content Studio"*), seamlessly integrated with `/dashboard/social-studio`.
  - 10 unified tabs: Post Generator, Content Calendar, Idea Generator, Copywriting Assistant, Hashtag Research, Repurposing Studio, Video & Carousels, Templates Library, Saved Posts & Tracking, and Brand Voice.
- **7 Supported Platforms & 11 Content Formats**:
  - Platforms: Instagram, Facebook, LinkedIn, TikTok, YouTube, Pinterest, and X.
  - Formats: Educational, Promotional, Informational, Storytelling, Problem-Solution, Product Showcase, Behind-the-Scenes, Customer Education, Brand Awareness, Engagement, and Announcement.
- **Multi-Angle AI Content Generation**:
  - Generates 3 platform-tailored variations with scroll-stopping hooks, body copy, CTAs, hashtags, character counters vs. platform limits, and visual direction for creators.
  - Multilingual support: English, Urdu (Nastaliq script), and Roman Urdu.
- **Interactive Content Calendar**:
  - Monthly 7x5 day grid and list views with date navigation, click-to-schedule modals, and drag-and-drop workflow.
  - 7 lifecycle statuses: `Idea`, `Draft`, `Ready for Review`, `Approved`, `Scheduled`, `Published`, and `Archived`.
- **Strategic Content Idea Generator**:
  - 7 strategic categories: Educational, Promotional, Entertaining, Inspirational, Conversational, Authority Building, and Community Building.
  - Provides hooks, takeaways, visual ideas, and "Convert to Post" workflow.
- **Caption & Copywriting Assistant**:
  - Dual-pane editor with 10 instant actions: Rewrite, Shorten, Expand, Improve Hook, Change Tone, Add CTA, Translate to Urdu, Translate to Roman Urdu, Translate to English, and Improve Readability.
- **Hashtag Research Workspace**:
  - Groups hashtags into Broad, Niche, Product, Audience, and Campaign clusters. Labeled clearly as AI-generated suggestions without fabricated reach numbers.
- **Omni-Channel Content Repurposing**:
  - Transforms blogs, webinar notes, or video transcripts into native adaptations for LinkedIn, Instagram, TikTok, and X.
- **Video Script Generator & Carousel Builder**:
  - Video scripts with scene-by-scene timing, dialogue, visual direction, and on-screen text.
  - Carousel builder with live slide preview strip (cover, numbered body slides, and final CTA).
- **Brand Voice Calibration**:
  - Project-level voice profiles defining tone, preferred vocabulary, blacklisted phrases, and guidelines.
- **Content Performance Tracking**:
  - Deterministic calculations for Engagement Rate, CTR, CVR, and total interactions from verified logs. Zero fabricated statistics.
- **Server-Side AI Proxy & API Security**:
  - Secure Node middleware endpoints: `POST /api/generate-social-post`, `POST /api/generate-content-ideas`, and `POST /api/assist-content-copy` with rate limiting and timeout safeguards.
- **Platform Publishing Integration Architecture**:
  - Transparent connection state display (`Planned Sandbox` vs. `Connected`). Clear policy prohibiting false claims of automated publishing without authenticated OAuth credentials.
- **LocalStorage Persistence**:
  - Persisted under `sparkline_content_posts`, `sparkline_content_ideas`, `sparkline_brand_voices` with one-click CSV export.

---

## 16. SEO Analysis & Optimization Toolkit (Phase 18)

See [SEO_TOOLKIT_ARCHITECTURE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/SEO_TOOLKIT_ARCHITECTURE.md), [KEYWORD_RESEARCH_FRAMEWORK.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/KEYWORD_RESEARCH_FRAMEWORK.md), [ON_PAGE_SEO_GUIDELINES.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/ON_PAGE_SEO_GUIDELINES.md), [TECHNICAL_SEO_CHECKLIST.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/TECHNICAL_SEO_CHECKLIST.md), [SEO_DATA_SOURCE_POLICY.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/SEO_DATA_SOURCE_POLICY.md), and [SEO_SECURITY_POLICY.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/SEO_SECURITY_POLICY.md) for full architectural specifications and policies.

### Key Capabilities
- **Dedicated SEO Intelligence Workspace**:
  - Live at `/dashboard/seo` (*"SEO Intelligence & Optimization"*).
  - 10 unified workspaces: Website Audit, Keyword Research, Topic Clusters, On-Page Checker, AI Content Assistant, Technical SEO Checklist, Competitor SEO, Backlink Analysis, Content Planner, and Learning & Performance.
- **SSRF-Hardened Website Audit Engine**:
  - Live crawling proxy `POST /api/audit-website-seo` with strict IP blacklist blocking private IPv4 (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`), cloud link-local metadata (`169.254.169.254`), IPv6 private ranges, and internal domains.
  - Redirect destination re-validation, 10s timeout, and 2MB payload cap.
  - Raw HTML Paste Mode fallback for staging and intranet environments.
  - Safe regex extraction of titles, descriptions, canonicals, robots directives, OpenGraph cards, viewport tags, H1-H3 headings, image alt tags, links, and JSON-LD schema.
- **Categorized Audit Findings & Remediation**:
  - Grouped into *Critical*, *High Priority*, *Medium Priority*, *Low Priority*, and *Passed Checks*.
  - Every finding details title, category, why it matters, evidence detected, recommended fix, and verification status. No arbitrary synthetic scores.
- **Keyword Research & Opportunity Engine**:
  - 6 search intent classes: *Informational*, *Navigational*, *Commercial*, *Transactional*, *Local*, and *Long-tail*.
  - Zero fabricated search volumes or fake CPCs. Tracked keywords repository with CSV export.
- **Semantic Topic Clusters**:
  - Hub-and-spoke pillar model linking primary keywords, secondary variants, suggested formats, and strategic rationales.
- **On-Page SEO Analyzer**:
  - Evaluates title length (40–60 chars) and meta description length (120–160 chars) against SERP truncation limits.
  - Single H1 check, content depth analysis, and intent fulfillment scoring. Explicit disclaimer that keyword density alone does not dictate rankings.
- **AI Content Blueprint Generator**:
  - Proxied Gemini 1.5 Flash assistant generating 3 title variations, 2 meta descriptions, semantic heading outline, intro hook, FAQ schema markup (`schema.org/FAQPage` JSON-LD), internal linking suggestions, and image concept with descriptive alt text.
- **Technical SEO Checklist**:
  - 15 checks across Protocol Security, Crawling & Indexing, Architecture & Links, Mobile & UX, and Schema & Meta with auto-detected audit values and interactive status toggles.
- **Competitor SEO Analysis**:
  - Compares publicly observable titles, descriptions, headings, keyword themes, and content formats without fabricated traffic or synthetic domain authority scores.
- **Backlink Analysis Workspace**:
  - Inbound citation logger tracking source, destination, anchor text, link type, and rel attribute (`follow`, `nofollow`, `ugc`, `sponsored`) with CSV export.
- **SEO Content Planner**:
  - Search-driven editorial calendar assigning primary target keywords, search intents, formats, and publication milestones.
- **SEO Learning Center & Performance Tracking**:
  - Verified Google Search Console performance logger (clicks, impressions, average position, CTR, indexed pages, organic conversions) and 9 comprehensive educational academy guides.
- **LocalStorage Persistence**:
  - Persisted under `sparkline_seo_audits`, `sparkline_seo_keywords`, `sparkline_seo_clusters`, `sparkline_seo_tech_checks`, `sparkline_seo_competitors`, `sparkline_seo_backlinks`, `sparkline_seo_content_plans`, `sparkline_seo_performance`.

---

## 17. Professional Marketing Reports & PDF Export (Phase 20)

See [REPORT_GENERATION_ARCHITECTURE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/REPORT_GENERATION_ARCHITECTURE.md), [REPORT_TEMPLATES_GUIDE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/REPORT_TEMPLATES_GUIDE.md), [PDF_EXPORT_SPECIFICATION.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/PDF_EXPORT_SPECIFICATION.md), [REPORT_DATA_PROVENANCE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/REPORT_DATA_PROVENANCE.md), and [REPORT_SECURITY_AND_PRIVACY.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/REPORT_SECURITY_AND_PRIVACY.md) for full architectural specifications.

### Key Capabilities
- **Dedicated Reports & Insights Command Center**:
  - Live at `/dashboard/reports` (*"Reports & Insights"*).
  - Overview KPI Cards: Saved Reports, Generated Ready, Drafts in Progress, and Archived Dossiers.
  - Search, status filtering (`All`, `Ready`, `Draft`, `Archived`), project filtering, and column sorting.
- **11 Pre-Architected Strategic Report Templates**:
  1. *Executive Marketing Strategy*: Board/C-suite focus on high-level objectives, CAC guardrails, budget allocation, and balanced forecast.
  2. *Complete Marketing Plan*: End-to-end tactical operating manual for marketing teams and agencies.
  3. *Market Research Report*: TAM/SAM addressability, PESTLE forces, and industry demand velocity.
  4. *Competitor Analysis Report*: Feature comparison matrices, pricing indices, and differentiation roadmaps.
  5. *SWOT & PESTLE Strategic Synthesis*: Governance audit evaluating internal quadrant leverage and macro external forces.
  6. *Marketing Budget & Financial Report*: Mathematical spend allocation, minor-unit financial balancing, and multi-currency models.
  7. *Advertising Campaign Report*: Paid media flight rosters, platform splits (Meta, Google, LinkedIn), and creative format specs.
  8. *SEO Audit Report*: Technical crawl health, indexing status, Core Web Vitals, and keyword portfolios.
  9. *Social Media & Content Strategy*: Content pillar architecture, publishing cadence, and brand voice calibration.
  10. *Marketing Forecast & ROI Report*: 3-scenario performance projections (Conservative, Balanced, Growth) and break-even milestones.
  11. *Complete Marketing Project Report*: Encyclopedic dossier executing all 25 modular sections in strict logical hierarchy.
- **5-Step Custom Report Builder Wizard**:
  - Step A: Select Project with live data completeness scoring across 19 prior modules.
  - Step B: Select Report Type (11 built-in templates or custom composition).
  - Step C: Modular Section Selector across all 25 sections with live data readiness badges (`Ready`, `Partial`, `Unavailable`).
  - Step D: Whitelabel Customization & Branding (Title, Subtitle, Prepared For, Prepared By, Report Date, Detail Level [Brief, Standard, Comprehensive], Confidentiality Classification, Accent Color).
  - Step E: Review, Validation & Instant Generation with interactive preview and provenance checks.
- **25 Composable Modular Sections**:
  - `cover`, `executive_summary`, `company_overview`, `marketing_objectives`, `target_audience`, `market_research`, `competitor_analysis`, `swot_analysis`, `pestle_analysis`, `marketing_strategy`, `brand_positioning`, `budget_allocation`, `currency_conversions`, `marketing_metrics`, `performance_forecast`, `advertising_campaigns`, `creative_specs`, `content_marketing`, `social_media_strategy`, `seo_audit`, `keyword_strategy`, `conversion_optimization`, `risk_assessment`, `implementation_roadmap`, and `appendix_sources`.
- **Data Provenance & Source Transparency**:
  - Every metric, table cell, and narrative claim is tagged with one of 10 verifiable provenance classifications (*User-provided*, *Imported*, *Connected-platform*, *Calculated result*, *AI interpretation*, *AI recommendation*, *Estimate*, *Assumption*, *Verified external benchmark*, *Unverified observation*).
- **Dual-Engine PDF Export & Data Extraction**:
  - *Browser Print-to-PDF Engine*: Isolated DOM window context with `@page { size: A4; margin: 18mm; }`, print-specific CSS, running headers/footers, and native `window.print()` integration for infinite-resolution vector output.
  - *Pure TypeScript PDF 1.4 Binary Exporter*: Zero-dependency client-side serializer compiling standard `%PDF-1.4` binary streams with fonts, text operators, and byte-offset cross-reference tables.
  - *RFC 4180 CSV Exporter*: Formatted tabular output for Microsoft Excel, Google Sheets, or enterprise BI dashboards.
- **Lifecycle & Governance Controls**:
  - Interactive on-screen dossier reader modal with section jump-links, template structure inspection modal, duplicate report, rename, regenerate with live data, archive, and hard deletion with confirmation.
- **LocalStorage Persistence**:
  - Persisted under `sparkline_marketing_reports` with immutable version tracking.

---

## 18. User Authentication & Project Management (Phase 21)

See [AUTHENTICATION_ARCHITECTURE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/AUTHENTICATION_ARCHITECTURE.md), [USER_PROFILE_MANAGEMENT.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/USER_PROFILE_MANAGEMENT.md), [PROJECT_MANAGEMENT_GUIDE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/PROJECT_MANAGEMENT_GUIDE.md), [DATABASE_ACCESS_POLICIES.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/DATABASE_ACCESS_POLICIES.md), and [AUTHENTICATION_SETUP.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/AUTHENTICATION_SETUP.md) for full architectural specifications.

### Key Capabilities
- **Dual-Provider Authentication Architecture**:
  - `AuthService` (`src/services/auth.service.ts`) supports both Cloud Supabase Auth and the zero-configuration Sparkline Local Vault Provider.
  - Native Web Crypto API `SHA-256` password salting and hashing with isolated user account stores.
  - Session lifecycle management supporting `localStorage` (persistent / Remember Me) and `sessionStorage` (ephemeral).
  - Routes: `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`.
  - Route guards: `ProtectedRoute` protecting `/dashboard/*` and `PublicOnlyRoute` redirecting authenticated users away from auth gates.
- **User Profile & Account Settings (`/dashboard/settings/account`)**:
  - Full corporate identity management (Full Name, Email, Organization, Job Title, Country, Language, Preferred Currency, Timezone).
  - Dynamic currency synchronization updating global defaults across budgets, calculators, and reports.
  - Secure credential rotation with current password verification and complexity enforcement.
- **Projects Command Center (`/dashboard/projects`)**:
  - Comprehensive multi-project manager with KPI overview cards (Total, Active, Draft, Archived).
  - Search, status filtering, industry filtering, multi-field sorting, and view toggle (Responsive Grid Cards vs. Dense Tabular View).
  - Real Milestone Progress Bar (0–100%) dynamically calculated across actual module records (profile, products, competitors, strategy, budget, campaigns, content, SEO, forecast, reports).
  - Quick project actions: Create, View command center, Edit parameters, Clone/Duplicate, Archive/Restore, and defensive Delete with modal confirmation requiring brand name typing.
- **10-Tab Project Details Command Center (`/dashboard/projects/:projectId` and `:id`)**:
  - Unifies all 10 platform modules into a single command center with direct operational shortcuts.
  - Tabs: Overview, Business Profile, Product Offering, Competitor Matrix, AI Marketing Strategy, Budget Allocation, Ad Campaigns, Content Studio, SEO Intelligence, and Executive Reports.
- **Database Architecture & Row Level Security (RLS)**:
  - PostgreSQL migration `supabase/migrations/20261114_auth_and_projects.sql` with tables `profiles`, `user_preferences`, `marketing_projects`, `project_members`, foreign keys, performance indexes, and strict RLS tenant isolation policies.
  - Automatic user provisioning trigger on `auth.users` insert.

---

## 19. Database Architecture, Permissions & Advanced Security (Phase 22)

See [DATABASE_ARCHITECTURE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/DATABASE_ARCHITECTURE.md), [DATABASE_SECURITY_AUDIT.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/DATABASE_SECURITY_AUDIT.md), [ROW_LEVEL_SECURITY_POLICIES.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/ROW_LEVEL_SECURITY_POLICIES.md), [API_SECURITY_GUIDELINES.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/API_SECURITY_GUIDELINES.md), [FILE_STORAGE_SECURITY.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/FILE_STORAGE_SECURITY.md), [AI_INTEGRATION_SECURITY.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/AI_INTEGRATION_SECURITY.md), [BACKUP_AND_RECOVERY.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/BACKUP_AND_RECOVERY.md), [PRIVACY_AND_DATA_RETENTION.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/PRIVACY_AND_DATA_RETENTION.md), and [SECURITY_TEST_REPORT.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/SECURITY_TEST_REPORT.md) for full architectural specifications.

### Key Capabilities
- **Complete 32-Table Relational Schema Architecture**:
  - Implemented in `supabase/migrations/20261114_advanced_database_and_security.sql`.
  - Covers user profiles, preferences, marketing projects, project members, business profiles, products/services, target audiences, customer personas, market research, sources, competitors, SWOT/PESTLE, strategies, recommendations, budgets, allocations, currency conversions, historical exchange rates, marketing metrics, forecasts, campaigns, campaign performance, social posts, content calendars, SEO audits, keywords, tasks, reports, report exports, integrations, notifications, and audit logs.
- **Strict Row-Level Security (RLS) & Non-Recursive Permission Checks**:
  - `ENABLE ROW LEVEL SECURITY` enforced across all 32 tables.
  - Security definer function `public.has_project_access()` eliminates circular joins while enforcing role-based permissions (`owner`, `editor`, `viewer`).
  - Immutable append-only ledgers for `exchange_rate_history` and `audit_logs` preventing historical tampering.
- **Centralized Security Audit Logging Service (`auditService`)**:
  - Client-side and database-ready audit logging across 22 critical security and operational event types.
  - Automatic redaction of sensitive credentials (`[REDACTED]`).
- **Comprehensive Defense Engine (`securityService`)**:
  - Input sanitization against XSS, HTML injection, and prompt overrides.
  - SSRF protection blocking loopback (`127.0.0.1`), private networks (`10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`), link-local/cloud metadata (`169.254.169.254`), and non-HTTP protocols.
  - File upload validator enforcing MIME whitelisting, 10MB limits, dangerous extension blocking, and path traversal elimination.
  - Client-side sliding rate limiting.
- **Privacy & GDPR Controls**:
  - 1-click JSON export of complete account intelligence archive.
  - Defensive account deletion requiring explicit `DELETE MY ACCOUNT` confirmation with cascading cleanup.
- **Server-Side API Defense (`src/server/ai-proxy-middleware.ts`)**:
  - Hardened security headers (CSP, nosniff, sameorigin, permissions-policy).
  - 2MB max payload limits protecting against heap exhaustion.
  - Prompt injection neutralization against jailbreak overrides in external research data.
- **Automated Security Test Suite**:
  - Standalone Node.js test suite (`src/test/run-security-suite.mjs`) verifying all 20 required security scenarios with 100% pass rate.

---

## 20. Advanced Analytics & Third-Party Integrations (Phase 23)

See [ADVANCED_ANALYTICS_ARCHITECTURE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/ADVANCED_ANALYTICS_ARCHITECTURE.md), [THIRD_PARTY_INTEGRATIONS_GUIDE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/THIRD_PARTY_INTEGRATIONS_GUIDE.md), [OAUTH_SECURITY_GUIDE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/OAUTH_SECURITY_GUIDE.md), [DATA_SYNCHRONIZATION_ARCHITECTURE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/DATA_SYNCHRONIZATION_ARCHITECTURE.md), [ANALYTICS_DATA_PROVENANCE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/ANALYTICS_DATA_PROVENANCE.md), [CSV_IMPORT_SPECIFICATION.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/CSV_IMPORT_SPECIFICATION.md), and [PLATFORM_API_LIMITATIONS.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/PLATFORM_API_LIMITATIONS.md) for full architectural specifications.

### Key Capabilities
- **Advanced Analytics Workspace (`/dashboard/analytics`)**:
  - Unified marketing analytics command center combining direct campaign performance, organic search metrics, social media engagement, and ingested CSV data.
  - Multi-dimensional filtering: Project selector, reporting date range presets (7d, 14d, 30d, 90d, YTD, All, Custom), compare-period options (Previous Period, Previous Year, None), channel/platform filter, campaign filter, and currency selector.
- **15 Core Marketing KPI Engine**:
  - Precise mathematical computation of Total Spend, Total Impressions, Total Reach, Total Clicks, Click-Through Rate (CTR), Cost Per Click (CPC), Cost Per Mille (CPM), Inbound Leads, Conversions, Conversion Rate (CVR), Cost Per Acquisition (CPA), Attributed Revenue, Return on Ad Spend (ROAS), Return on Investment (ROI), and Customer Acquisition Cost (CAC).
  - CAC is honestly classified as `unavailable` with a configuration prompt when non-advertising overhead expenses are unconfigured, preventing misleading metric fabrication.
- **4 Multi-Dimensional Visual Analytics Tabs (11 Recharts Visualizations)**:
  - *Trends*: Ad Spend Over Time, Revenue & Conversions Over Time, Impressions/Clicks/CTR Traffic Trends, and CPC/CPM Cost Efficiency Curves.
  - *Platforms & Channels*: Platform Distribution Donut, Paid vs. Organic Performance Split, SEO vs. Social Performance Comparison, and Budget Allocation vs. Actual Spend.
  - *Conversion Funnel*: 7-stage marketing conversion pipeline (Impressions → Clicks → Website Sessions → Inbound Leads → Qualified Leads → Customers → Realized Revenue) with absolute counts, stage progression rates, drop-off rates, and automated bottleneck identification with strategic remedies.
  - *Performance Matrix*: Normalized campaign and platform performance comparison matrix with explicit attribution window documentation (Meta 7d click/1d view, Google Ads DDA, GA4 last non-direct, TikTok 7d click/1d view, LinkedIn 30d click/1d view).
- **AI-Assisted Strategic Insights**:
  - Categorized insights following strict empirical taxonomy: `[Measured Observation]`, `[Calculated Finding]`, `[AI Interpretation]`, `[Recommendation]`, `[Hypothesis]` citing explicit numerical evidence.
- **Third-Party Integrations Hub (`/dashboard/integrations`)**:
  - 13 Platform Connectors across Advertising (Meta, Google, TikTok, LinkedIn), Analytics (GA4, GSC), Social Media (Instagram/Facebook, LinkedIn Pages, X/Twitter, YouTube), and Ingestion (CSV / Spreadsheet Importer, Google Sheets Live Sync, Custom Webhooks).
  - Deterministic connection lifecycle: `Not Connected`, `Connecting`, `Connected`, `Syncing`, `Sync Failed`, `Disconnected`, and `Configuration Required`. Zero fake connections when credentials are unconfigured in `.env`.
  - Interactive Sandbox Connector mode for safe end-to-end testing of OAuth connection, synchronization, error handling, and disconnection states.
  - Manual synchronization trigger with real-time audit logging and detailed history inspector.
- **Secure CSV Ingestion & Formula Injection Defense**:
  - 5MB file upload limit, MIME-type and extension validation.
  - Interactive column mapping interface for Platform, Campaign, Date, Spend, Impressions, Clicks, and Conversions.
  - Spreadsheet Formula Injection (CSV/DDE injection) defense escaping dangerous leading characters (`=`, `+`, `-`, `@`, `\t`, `\r`) with single quotes.
  - Compound-key deduplication (`${projectId}_${platform}_${campaignName}_${date}`) preventing duplicate records across repeated uploads.
- **Enterprise OAuth 2.0 Security Architecture**:
  - PKCE code verifier and SHA-256 challenge generation.
  - Cryptographically secure CSRF state validation with single-use verification.
  - Server-side token exchange and AES-256-GCM encryption at rest.
  - Zero token leakage to client-side storage or frontend logs.
- **PostgreSQL Database Schema & Universal RLS**:
  - Implemented in `supabase/migrations/20261114_analytics_and_integrations.sql` creating `imported_datasets`, `sync_logs`, and `analytics_snapshots` with foreign keys, check constraints, composite indexes, and universal RLS policies.
- **Automated Analytics Test Suite**:
  - Standalone Node.js test suite (`src/test/run-analytics-suite.mjs`) verifying all 22 required analytics and integration scenarios with 100% pass rate.

---

## 21. Complete Application Testing, SEO Audit & Performance Optimization (Phase 24)

See [COMPLETE_QA_REPORT.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/COMPLETE_QA_REPORT.md), [SEO_AUDIT_REPORT.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/SEO_AUDIT_REPORT.md), [PERFORMANCE_AUDIT_REPORT.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/PERFORMANCE_AUDIT_REPORT.md), [ACCESSIBILITY_AUDIT_REPORT.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/ACCESSIBILITY_AUDIT_REPORT.md), [RESPONSIVE_TEST_REPORT.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/RESPONSIVE_TEST_REPORT.md), [BROWSER_COMPATIBILITY_REPORT.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/BROWSER_COMPATIBILITY_REPORT.md), [MARKETING_CALCULATION_TEST_REPORT.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/MARKETING_CALCULATION_TEST_REPORT.md), and [REGRESSION_TEST_REPORT.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/REGRESSION_TEST_REPORT.md) for full architectural specifications.

### Key Capabilities
- **Multi-Pillar Automated Test Infrastructure (90 / 90 Tests Passing)**:
  - Security Suite (`src/test/run-security-suite.mjs`): 20 tests verifying RLS tenant isolation, SSRF defense, file upload security, and XSS sanitization.
  - Advanced Analytics Suite (`src/test/run-analytics-suite.mjs`): 22 tests verifying multi-channel data layer, 15 KPIs, 7-stage funnels, compound deduplication, and formula injection escaping.
  - Marketing Calculation Accuracy Suite (`src/test/run-calculations-suite.mjs`): 20 tests verifying CPC, CPM, CTR, CPA, CPL, CVR, Engagement Rate, VCR, ROAS, ROI, CLV, GA4 Bounce Rate, budget minor-unit arithmetic, cross-rates, and break-even modeling.
  - Technical SEO Suite (`src/test/run-seo-suite.mjs`): 12 tests verifying robots.txt, sitemap.xml, canonical tags, Open Graph, Twitter cards, JSON-LD schemas, and noindex shielding on auth pages.
  - End-to-End Critical Workflows Regression Suite (`src/test/run-e2e-regression-suite.mjs`): 16 tests verifying all 16 critical user journeys across Prompts 01–23.
- **Search Engine Privacy & Technical SEO Architecture**:
  - `public/robots.txt` disallows private authenticated dashboards (`/dashboard/*`), auth routes (`/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`), design system showcases (`/design-system`), and backend proxy endpoints (`/api/`).
  - `public/sitemap.xml` catalogues all 9 public marketing pages with fresh `2026-11-14` timestamps.
  - Pre-rendered static JSON-LD in `index.html` with `SoftwareApplication`, `Organization`, and `WebSite` graph.
  - Page-specific JSON-LD across public pages: `BreadcrumbList`, `FAQPage`, `ItemList`, `Course`, and `ContactPage`.
- **Performance Optimization & Core Web Vitals**:
  - Isolated Rollup vendor chunks (`vendor-react`, `vendor-charts`, `vendor-icons`).
  - Asynchronous font loading strategy eliminating layout shift.
  - Route-level code splitting producing fast, lightweight page chunks under 90 kB raw.
- **Universal Accessibility (WCAG 2.2 AA)**:
  - 14.2:1 body text contrast ratio, visible focus states (`focus-visible:ring-2`), persistent skip links on all layout shells, and accessible ARIA attributes across navigation, accordions, and dialog modals.
- **Responsive Adaptability Across 5 Breakpoint Ranges**:
  - Tested from Mobile 320px up to Large Desktop >1440px with horizontal scroll wrappers (`overflow-x-auto`) across all data tables and matrices.

---

## 22. Final Security Audit, Production Deployment & Launch Readiness (Phase 25)

See [FINAL_PROJECT_DOCUMENTATION.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/FINAL_PROJECT_DOCUMENTATION.md), [PRODUCTION_DEPLOYMENT_GUIDE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/PRODUCTION_DEPLOYMENT_GUIDE.md), [PRODUCTION_ENVIRONMENT_SETUP.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/PRODUCTION_ENVIRONMENT_SETUP.md), [FINAL_SECURITY_AUDIT.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/FINAL_SECURITY_AUDIT.md), [FINAL_QA_AND_TEST_REPORT.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/FINAL_QA_AND_TEST_REPORT.md), [PRODUCTION_LAUNCH_CHECKLIST.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/PRODUCTION_LAUNCH_CHECKLIST.md), [MAINTENANCE_AND_BACKUP_GUIDE.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/MAINTENANCE_AND_BACKUP_GUIDE.md), and [KNOWN_LIMITATIONS.md](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/KNOWN_LIMITATIONS.md) for full architectural specifications and launch runbooks.

### Key Capabilities
- **OWASP Top 10 Security Architecture & Multi-Tenant Isolation**:
  - *A01: Broken Access Control*: Enforced non-recursive Row Level Security (RLS) across all 35 PostgreSQL database tables across 3 migration suites. Enforced strict tenant isolation (`auth.uid() = user_id`).
  - *A02: Cryptographic Failures*: Server-side AES-256-GCM encryption for stored third-party OAuth access and refresh tokens. Client storage (`localStorage`) restricted to Local Vault mode without private keys.
  - *A03: Injection*: Parameterized queries across all database calls; server-side URL validation (`validateTargetUrl()`) blocking SSRF targeting private IP ranges, loopbacks, and cloud metadata (`169.254.169.254`); spreadsheet formula injection protection prefixing risky characters (`=`, `+`, `-`, `@`) with single quotes.
  - *A05: Security Misconfiguration*: Strict production HTTP security headers implemented in both `vercel.json` and `nginx.conf`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
  - *A07: Identification and Authentication Failures*: Supabase Auth integration with PKCE OAuth flow, timing-safe credential verification, and automated session revocation.
- **Production Deployment Configuration**:
  - `vercel.json`: Edge/serverless deployment specification with clean URLs, SPA routing rewrites (`/*` -> `/index.html`), 1-year immutable caching on static assets (`/assets/*`), and production HTTP security headers.
  - `Dockerfile`: Production multi-stage container build utilizing `node:20-alpine` builder and `nginx:alpine` runtime with automated health check probe (`/healthz`).
  - `nginx.conf`: Production web server configuration with gzip compression, SPA fallback routing (`try_files $uri $uri/ /index.html`), cache headers, and `/healthz` probe.
  - `.dockerignore`: Prevents local node modules, environment files, git metadata, and build artifacts from leaking into container images.
  - Container & Load Balancer Health Probe: Implemented `GET /api/health` in `src/server/ai-proxy-middleware.ts` returning system uptime, version, and dependency status.
- **Environment & Secret Hygiene**:
  - Completely documented `.env.example` defining all client (`VITE_`) and server-side secret placeholders with security instructions.
  - Verified zero real production secrets in git history or client bundles.
- **Automated Production Readiness Quality Gate (98 / 98 Tests Passing)**:
  - Production Readiness Gate Suite (`src/test/run-production-gate-suite.mjs`): 8 validation scenarios testing client secret cleanliness, production build artifacts, Vercel/Docker/Nginx configs, RLS coverage across all 3 migrations, health probe endpoints, and documentation integrity.
  - Total automated test suite: 98 passing tests across 6 dedicated runner files (100% pass rate).
- **Formal Status Certification**:
  - Accurately classified as **Ready for Deployment**. Hosted DNS, custom domain SSL, and production secrets are cleanly architected and ready for activation upon cloud provider deployment.
