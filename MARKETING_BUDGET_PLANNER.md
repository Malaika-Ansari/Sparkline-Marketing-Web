# Sparkline Marketing Budget Allocation Planner

## Overview & Architecture

The **Sparkline Marketing Budget Allocation Planner** is an intelligent, mathematically verified resource distribution system built to empower founders, CMOs, and growth operators to plan, allocate, and monitor their marketing investments with precision.

Located at `/dashboard/budget`, the system bridges strategic business analysis, competitor intelligence, and market conditions with strict budget controls across five distinct allocation groups, eliminating wasted ad spend, budget dilution, and premature cash burn.

---

## Key Capabilities

### 1. Interactive Budget Command Center
- **Project Selection**: Seamlessly binds to any created marketing project (e.g., *GlowBiome Organics*, *ApexSec Cloud Intelligence*), inheriting price points, target audiences, target markets, and business goals.
- **Dynamic Currency Support**: Fully supports `USD`, `EUR`, `GBP`, `CAD`, `AUD`, and `JPY` with real-time formatting across inputs, tables, and visualization charts.
- **Planning Frequencies**: Configurable for `Daily`, `Weekly`, `Monthly`, `Quarterly`, and `Campaign` budget horizons.
- **Proportional Recalculation**: Adjusting the total budget dynamically recalculates direct currency amounts across all active categories while preserving exact percentage ratios.

### 2. Three Deterministic & AI-Driven Allocation Variants
Every budget plan synthesizes three distinct strategic profiles:
1. **Conservative Budget**:
   - Focus: Capital preservation, high-intent search capture, lifecycle customer onboarding, micro-creator seeding, and low risk exposure.
   - Recommended For: Pre-launch validation, self-funded startups, or testing newly launched product lines.
2. **Balanced Budget**:
   - Focus: Integrated multi-channel customer acquisition (paid search + paid social), lifecycle retention flows, continuous creative refreshes, and a dedicated 10% experimentation buffer.
   - Recommended For: Growing businesses with proven unit economics looking for sustainable scale.
3. **Growth-Focused Budget**:
   - Focus: Aggressive top-of-funnel customer acquisition, accelerated creator partnerships, expanded A/B testing capacity (15%+), and rapid statistical feedback loops.
   - Recommended For: Well-funded businesses with high customer LTV pursuing rapid category market share.

---

## The 5 Budget Allocation Groups

All marketing expenditures are partitioned into five standardized categories to maintain financial hygiene:

| Group Name | Primary Role | Standard Channels / Items | Target Allocation Range |
|:---|:---|:---|:---|
| **Advertising Spend** | Direct market acquisition & retargeting | Meta Ads, Google Search/Shopping, TikTok, LinkedIn PPC | 35% – 60% |
| **Content & Creative** | Ad creative assets, video hooks, landing page design | UGC video editing, copywriting, graphic design, photography | 15% – 25% |
| **Marketing Operations** | Software, CRM, automation, and analytics | Email/SMS platforms (Klaviyo), GA4/Mixpanel, attribution tools | 8% – 15% |
| **External Services** | Specialised execution & partner outreach | Influencer gifting, SEO technical audits, PR distribution | 5% – 12% |
| **Testing & Reserve** | CRO, new channel exploration, emergency buffer | Landing page A/B tests, experimental ad networks, buffer | 8% – 15% |

---

## Mathematical Validation & Integrity Controls

The planner enforces strict financial computing rules:
1. **Integer Minor Unit Math**: All monetary amounts are internally computed in integer cents (`Math.round(amount * 100)`) to eliminate floating-point rounding errors (e.g., prevents `$7999.999999999999`).
2. **Exact 100% Allocation Validation**: Real-time balance detection notifies the user if allocations exceed 100% or leave unallocated funds.
3. **One-Click Auto-Balance**: An automated helper allows one-click assignment of leftover capital to the *Testing & Reserve* pool.
4. **No Synthetic Guarantees**: Sparkline strictly adheres to governance benchmarks (target CPA, minimum CTR, target ROAS) and never manufactures fake impressions or fabricated revenue forecasts.

---

## Visual Intelligence & Analytics (Recharts)

- **Distribution Donut Chart**: Visualizes category distribution with inner total budget readout and custom tooltip.
- **5-Pillar Bar Chart**: Horizontal breakdown comparing spending percentages across the 5 core budget groups.
- **3-Plan Comparative Scenario Chart**: Multi-bar comparison illustrating how Conservative, Balanced, and Growth approaches distribute capital across each pillar.
- **6-Month Phased Rollout Timeline**: Stacked area projection showing monthly expenditure progression across Advertising, Creative, Operations, and Testing.

---

## Governance & Performance Planning

Each line item connects directly to an actionable tracking framework:
- **Primary KPI Benchmark**: (e.g., `Blended CAC < $28.00`, `Ad CTR > 2.0%`, `Search ROAS > 3.8x`).
- **Measurement Methodology**: Specified measurement source (Shopify Admin, Meta CAPI, Google Analytics 4, Klaviyo Attributed Revenue).
- **Review Frequency**: Enforced review cycles (`Weekly`, `Bi-weekly`, `Monthly`, `Quarterly`).
- **Performance Status**: Live operational states (`Planned`, `Active`, `Paused`, `Under Review`).

---

## Real-Time Risk & Allocation Warnings

The system actively audits custom allocations and highlights potential vulnerabilities:
- **Concentration Risk**: Warns when any single channel exceeds 50% of total budget.
- **Testing Deficit**: Alerts when experimentation reserve drops below 5%.
- **Channel Dilution**: Identifies paid channels allocated under $300/mo where algorithm learning phases will stall.
- **Creative Production Deficit**: Warns when ad spend exceeds 40% but creative production is under 5%.
- **Excessive SaaS Overhead**: Flags tool and operating subscriptions exceeding 35% of total budget.
- **Unallocated Budget**: Detects unassigned funds and provides automated balancing.

---

## Versioning & Portability

- **Local Storage Persistence**: Managed under `sparkline_marketing_budget_plans`.
- **Version Branching**: Duplicate any plan to branch a new version for quarterly re-forecasting.
- **Markdown Export**: "Copy Breakdown" copies clean markdown summary tables to the clipboard for reports or email updates.
- **Print & PDF Support**: Integrated print styling ensures clean reports on standard 8.5x11 paper or PDF export.

