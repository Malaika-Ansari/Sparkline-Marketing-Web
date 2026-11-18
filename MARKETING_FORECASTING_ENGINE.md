# Marketing Forecasting & Results Prediction Engine

**Sparkline Marketing Platform — Performance Intelligence Architecture**  
*Document Version: 1.0.0 • Phase 15 Architecture*

---

## 1. Executive Overview & Purpose

The **Marketing Results Predictor** (`/dashboard/forecast`) is an advanced planning and financial modeling engine that enables founders, CMOs, and performance marketers to evaluate campaign feasibility, project multi-tier revenue outcomes, and quantify capital risk before spending budget in live advertising auctions.

Unlike traditional tools that either present single-point forecasts (which create false certainty) or invent arbitrary growth percentages, Sparkline delivers:
1. **Three Scenario Models**: Conservative (downside protection), Balanced (core planning standard), and Optimistic (upper-quartile ceiling).
2. **Transparent Accounting**: Strict separation between direct media advertising spend and total fully loaded campaign investment (creative, agency, software).
3. **Unit-Economic Grounding**: Direct integration with Average Order Value (AOV), Gross Margin %, Cost Per Mille (CPM), Click-Through Rate (CTR), and on-site Conversion Rate (CVR).
4. **Break-Even Analysis**: Mathematical thresholds for break-even revenue, required customers, minimum ROAS, and maximum allowable Customer Acquisition Cost (CPA).
5. **Sensitivity Modeling**: Controlled variance analysis illustrating which operational metrics have the highest financial leverage.

---

## 2. Architectural Blueprint

The forecasting engine follows a unidirectional deterministic data flow:

```
+-------------------------------------------------------------+
|                     Forecast Inputs                         |
|  - Campaign Metadata (Platform, Flight Dates, Objective)   |
|  - Financial Allocations (Ad Spend vs. Total Budget)       |
|  - Commercial Unit Economics (AOV, Gross Margin %, Currency)|
|  - Performance Baselines (CPM, CTR, CVR + Source Tags)     |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|              Deterministic Calculation Service              |
|              (src/services/forecast.service.ts)             |
|  - Mathematical Multiplier Context                          |
|  - Impressions, Clicks, Leads, Customers                    |
|  - Revenue, Gross Profit, CPC, CPM, CPA                     |
|  - ROAS (Ratio Multiplier) & ROI (% Net Return)             |
+-------------------------------------------------------------+
        |                      |                      |
        v                      v                      v
+----------------+     +----------------+     +----------------+
|  Conservative  |     | Balanced Case  |     |   Optimistic   |
|  - Downside    |     | - Core Target  |     | - Top Quartile |
|  - +20% CPM    |     | - Benchmark    |     | - -15% CPM     |
|  - -25% CTR    |     | - Balanced Mix |     | - +25% CTR     |
|  - -30% CVR    |     | - 1.0x Baseline|     | - +25% CVR     |
+----------------+     +----------------+     +----------------+
                               |
        +----------------------+----------------------+
        |                      |                      |
        v                      v                      v
+----------------+     +----------------+     +----------------+
|   Break-Even   |     |  Sensitivity   |     |  AI Strategic  |
|    Analysis    |     |    Analysis    |     |  Explainer API |
+----------------+     +----------------+     +----------------+
```

---

## 3. The Three Distinct Scenarios

Every marketing initiative operates in uncertain auction and customer behavior dynamics. The platform models three distinct scenarios:

### 3.1 Conservative Scenario (Downside Boundary)
- **Objective**: Protect capital reserves against negative surprises, creative fatigue, and competitive auction density.
- **Mathematical Assumptions**:
  - `CPM Multiplier = 1.20` (+20% auction cost inflation)
  - `CTR Multiplier = 0.75` (-25% creative resonance)
  - `CVR Multiplier = 0.70` (-30% on-page conversion friction)
- **Strategic Utility**: Determines whether the business can survive initial learning phases without fatal cash depletion.

### 3.2 Balanced Scenario (Primary Planning Target)
- **Objective**: Establish the core operational baseline for budget authorization, inventory purchasing, and staffing.
- **Mathematical Assumptions**:
  - `CPM Multiplier = 1.00` (Grounded in verified benchmarks or verified historical averages)
  - `CTR Multiplier = 1.00`
  - `CVR Multiplier = 1.00`
- **Strategic Utility**: Serves as the primary Key Performance Indicator (KPI) benchmark for weekly media pacing and ad account optimization.

### 3.3 Optimistic Scenario (Upper Quartile Ceiling)
- **Objective**: Illustrate the commercial potential when creative hooks resonate strongly and checkout friction is eliminated.
- **Mathematical Assumptions**:
  - `CPM Multiplier = 0.85` (-15% delivery efficiency via high ad engagement scores)
  - `CTR Multiplier = 1.25` (+25% hook retention)
  - `CVR Multiplier = 1.25` (+25% checkout conversion lift)
- **Strategic Utility**: Highlights upside capacity for inventory planning, while the UI strictly cautions against using this scenario as the sole capital commitment basis.

---

## 4. Financial Clarity: Ad Spend vs. Total Campaign Investment

A frequent cause of startup capital failure is confusing **Ad Spend** with **Total Campaign Cost**:

| Cost Component | In Ad Spend? | In Total Investment? | Accounting Impact |
| :--- | :---: | :---: | :--- |
| **Media Auction Spend** | Yes | Yes | Directly drives platform impressions and clicks. |
| **Creative & Video Production** | No | Yes | One-time or retainer cost; amortized over campaign flight. |
| **Agency / Freelancer Fees** | No | Yes | Fixed retainer or management percentage. |
| **Software, Tooling & Analytics** | No | Yes | SaaS licenses (Shopify, Klaviyo, GA4, Unbounce). |

- **ROAS Formula**: Attributed Revenue / **Ad Spend** (evaluates channel bidding efficiency).
- **Net ROI Formula**: ((Net Return - **Total Investment**) / **Total Investment**) $\times 100$ (evaluates business profitability).
- **Direct CPA**: Ad Spend / Customers.
- **Fully Loaded CPA**: Total Investment / Customers.

---

## 5. Reusable Component & Module Integrations

The forecasting workspace integrates bidirectionally with completed platform modules:
- `/dashboard/projects`: Auto-populates brand name, industry, product price, target audience, and operating regions.
- `/dashboard/budget`: Seamless "Import Budget" feature pulling configured total investment, currency, and channel allocations from saved plans.
- `/dashboard/currency`: Uses active ISO currency standards (`USD`, `EUR`, `GBP`, `CAD`, `AUD`, `PKR`, `INR`, `AED`, `SAR`, `JPY`).
- `/dashboard/metrics`: Pulls saved historical calculations for automated variance benchmarking against forecast models.
- `/dashboard/strategy`: Aligns target objectives (`Lead Generation`, `E-commerce Sales`, `Brand Awareness`) with strategic action plans.

