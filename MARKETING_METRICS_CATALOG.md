# Marketing Metrics Catalog & Reference Guide

**Sparkline Marketing Platform — Intelligence & Performance Measurement Core**  
*Document Version: 1.0.0 • Phase 14 Architecture*

---

## 1. Overview & Objective

The **Sparkline Marketing Metrics Catalog** defines the 16 core marketing efficiency, financial, and digital performance metrics implemented within the platform at `/dashboard/metrics`. Each metric is backed by verified mathematical formulas, strict boundary-validation safeguards, zero-denominator protections, and structured context guidance.

Metrics are grouped into five strategic pillars:
1. **Advertising & Campaigns**: Efficiency of paid distribution across ad platforms.
2. **Social Media**: Audience interaction depth and video content retention.
3. **Lead Generation**: Acquisition efficiency and pipeline conversion flow.
4. **Revenue & Profitability**: Top-line return, net business gain, and customer enterprise value.
5. **Website & Email**: Digital touchpoint engagement (GA4 compliant) and lifecycle deliverability.

---

## 2. Master Catalog Table

| Metric ID | Display Name | Category | Primary Unit | Canonical Formula | Key Boundary Constraints |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ctr` | Click-Through Rate | Advertising & Campaigns | `%` | `(Clicks / Impressions) * 100` | $0 \le \text{Clicks} \le \text{Impressions}$ |
| `cpc` | Cost Per Click | Advertising & Campaigns | Currency | `Ad Spend / Clicks` | $\text{Spend} \ge 0, \text{Clicks} > 0$ |
| `cpm` | Cost Per Mille | Advertising & Campaigns | Currency | `(Ad Spend / Impressions) * 1,000` | $\text{Spend} \ge 0, \text{Impressions} > 0$ |
| `cpa` | Cost Per Acquisition | Advertising & Campaigns | Currency | `Campaign Cost / Conversions` | Supports Ad Spend vs. Total Cost |
| `frequency` | Ad Frequency | Advertising & Campaigns | Ratio (`x`) | `Impressions / Reach` | $\text{Impressions} \ge \text{Reach} > 0$ |
| `engagement_rate` | Engagement Rate | Social Media | `%` | `(Interactions / Denominator) * 100` | Denominator: Followers, Reach, or Impr. |
| `video_completion_rate` | Video Completion Rate | Social Media | `%` | `(Completions / Starts) * 100` | $0 \le \text{Completions} \le \text{Starts}$ |
| `cpl` | Cost Per Lead | Lead Generation | Currency | `Total Cost / Leads Generated` | $\text{Cost} \ge 0, \text{Leads} > 0$ |
| `conversion_rate` | Conversion Rate (CVR) | Lead Generation | `%` | `(Conversions / Denominator) * 100` | Denominator: Clicks, Sessions, or Users |
| `roas` | Return on Ad Spend | Revenue & Profitability | Ratio (`x`) | `Attributed Revenue / Ad Spend` | Denominator strictly media ad spend |
| `roi` | Return on Investment | Revenue & Profitability | `%` | `((Net Profit - Invest.) / Invest.) * 100` | Denominator is fully loaded investment |
| `cac` | Customer Acquisition Cost | Revenue & Profitability | Currency | `Total Acquisition Costs / New Customers` | Includes software, creative, agency fees |
| `clv_ltv` | Customer Lifetime Value | Revenue & Profitability | Currency | `AOV * Frequency * Lifespan * Margin %` | Supports Revenue or Margin-based modes |
| `bounce_rate` | GA4 Bounce Rate | Website & Email | `%` | `(Non-Engaged Sessions / Sessions) * 100` | Complies with GA4 (100% - Engagement Rate) |
| `email_open_rate` | Email Open Rate | Website & Email | `%` | `(Unique Opens / Delivered Emails) * 100` | Caveat: Apple MPP inflation |
| `email_click_rate` | Email Click Rate | Website & Email | `%` | `(Unique Clicks / Delivered Emails) * 100` | Click-to-Delivered standard |

---

## 3. Deep-Dive Metric Specifications

### 3.1 Advertising & Campaigns

#### 1. Click-Through Rate (CTR)
- **Definition**: The percentage of ad impressions that resulted in an active click.
- **Formula**:
  $$\text{CTR} = \left(\frac{\text{Clicks}}{\text{Impressions}}\right) \times 100$$
- **Business Use Case**: Gauges ad creative resonance, audience relevance, and hook strength. Low CTR usually indicates weak hooks, poor thumbnail creative, or mismatched audience targeting.
- **Input Types**: Non-negative integers.
- **Validation**:
  - If $\text{Impressions} = 0$: Returns zero-denominator error with explicit guidance.
  - If $\text{Clicks} > \text{Impressions}$: Triggers boundary warning (clicks cannot mathematically exceed total impressions).

#### 2. Cost Per Click (CPC)
- **Definition**: The average financial expense incurred for each click driven to your destination.
- **Formula**:
  $$\text{CPC} = \frac{\text{Ad Spend}}{\text{Clicks}}$$
- **Business Use Case**: Primary bidding efficiency indicator on search (Google Ads) and paid social auctions (Meta, LinkedIn, TikTok).
- **Validation**: Requires $\text{Clicks} > 0$. If $\text{Clicks} = 0$, returns safe warning without NaN/Infinity.

#### 3. Cost Per Mille (CPM)
- **Definition**: The advertising expense to deliver 1,000 ad impressions.
- **Formula**:
  $$\text{CPM} = \left(\frac{\text{Ad Spend}}{\text{Impressions}}\right) \times 1,000$$
- **Business Use Case**: Core metric for programmatic displays, awareness campaigns, and competitive auction density benchmarking.
- **Validation**: Requires $\text{Impressions} > 0$.

#### 4. Cost Per Acquisition / Action (CPA)
- **Definition**: The cost incurred to generate a single conversion action (sale, trial signup, demo booking).
- **Formula**:
  $$\text{CPA} = \frac{\text{Campaign Cost}}{\text{Attributed Conversions}}$$
- **Scope Options**:
  - `ad_spend_only`: Considers only direct media auction ad spend.
  - `total_campaign_cost`: Fully loaded to include media spend + agency fees + creative production + tooling expenses.
- **Validation**: Requires $\text{Conversions} > 0$.

#### 5. Ad Frequency
- **Definition**: The average number of times an individual unique user has been served an ad impression.
- **Formula**:
  $$\text{Frequency} = \frac{\text{Total Impressions}}{\text{Unique Reach}}$$
- **Business Use Case**: Monitoring ad fatigue, creative burn-out, and brand recall thresholds.
- **Validation**: Requires $\text{Unique Reach} > 0$. If $\text{Impressions} < \text{Reach}$, flags boundary notice.

---

### 3.2 Social Media Metrics

#### 6. Social Media Engagement Rate
- **Definition**: Measures how actively your audience interacts with your social content relative to audience size or distribution.
- **Formula**:
  $$\text{Engagement Rate} = \left(\frac{\text{Total Interactions}}{\text{Selected Denominator}}\right) \times 100$$
- **Denominators Supported**:
  - `followers`: Total account followers (standard public metric).
  - `reach`: Unique accounts that viewed the content (algorithm-neutral).
  - `impressions`: Total content displays (common for paid promotions).
- **Interactions Included**: Likes, comments, shares, retweets, saves, bookmarking.

#### 7. Video Completion Rate (VCR)
- **Definition**: The percentage of viewers who watched a video through to 100% completion.
- **Formula**:
  $$\text{VCR} = \left(\frac{\text{Video Completions}}{\text{Video Starts}}\right) \times 100$$
- **Validation**: $0 \le \text{Completions} \le \text{Starts}$. If $\text{Completions} > \text{Starts}$, boundary error is surfaced.

---

### 3.3 Lead Generation & Pipeline

#### 8. Cost Per Lead (CPL)
- **Definition**: The average marketing cost required to capture a prospective customer's contact details.
- **Formula**:
  $$\text{CPL} = \frac{\text{Total Lead Gen Spend}}{\text{Total Qualified Leads Captured}}$$
- **Business Use Case**: Standard unit economics metric for B2B, SaaS, consulting, and service firms.

#### 9. Conversion Rate (CVR)
- **Definition**: The proportion of audience members who completed a desired action relative to the total inbound pool.
- **Formula**:
  $$\text{CVR} = \left(\frac{\text{Conversions}}{\text{Selected Baseline Denominator}}\right) \times 100$$
- **Denominator Modes**:
  - `clicks`: Ad clicks to landing page form completion.
  - `sessions`: Web visits to checkout/lead completion.
  - `visitors`: Unique individuals to converted customers.

---

### 3.4 Revenue & Profitability

#### 10. Return on Ad Spend (ROAS)
- **Definition**: Gross revenue generated per monetary unit spent directly on advertising.
- **Formula**:
  $$\text{ROAS} = \frac{\text{Attributed Revenue}}{\text{Media Ad Spend}}$$
- **Standard Notation**: Stated as a ratio multiplier (e.g., `4.00x`), **distinct from percentage ROI**.
- **Important Rule**: Denominator strictly represents paid media ad spend. It does not include agency retainers or software fees.

#### 11. Return on Investment (ROI)
- **Definition**: The net financial profitability of a marketing initiative relative to its total investment cost.
- **Formula**:
  $$\text{ROI} = \left(\frac{\text{Net Revenue / Profit} - \text{Total Cost of Investment}}{\text{Total Cost of Investment}}\right) \times 100$$
- **Distinction from ROAS**: Stated as a percentage (`%`). Factors in all costs (production, software, labor) and expresses net gain or loss, where $0\%$ represents break-even.

#### 12. Customer Acquisition Cost (CAC)
- **Definition**: Fully loaded total sales and marketing expenditure required to win one new paying customer.
- **Formula**:
  $$\text{CAC} = \frac{\text{Total Sales \& Marketing Expenses}}{\text{Number of New Customers Acquired}}$$
- **Standard Scope**: Media spend, creative fees, agency retainers, marketing automation software licenses, and direct sales team compensation.

#### 13. Customer Lifetime Value (CLV / LTV)
- **Definition**: The projected total net value or revenue an individual customer contributes across their entire relationship with your company.
- **Formula**:
  $$\text{LTV} = \text{Average Order Value} \times \text{Purchase Frequency per Year} \times \text{Customer Lifespan (Years)} \times \text{Gross Margin } \%$$
- **Modes**:
  - **Revenue-based LTV**: Margin set to 100% (tracks top-line customer volume).
  - **Gross Profit-based LTV**: Multiplied by gross margin % (the only mathematically sound basis for calculating LTV:CAC payback ratios).

---

### 3.5 Website & Email Intelligence

#### 14. GA4 Bounce Rate
- **Definition**: The percentage of website visits that were **not engaged sessions** according to Google Analytics 4 standards.
- **Mathematical Specification**:
  $$\text{GA4 Bounce Rate} = \left(\frac{\text{Non-Engaged Sessions}}{\text{Total Sessions}}\right) \times 100 = 100\% - \text{GA4 Engagement Rate}$$
- **GA4 Engaged Session Criteria**: A session that lasted longer than 10 seconds, or resulted in 1 or more conversion events, or had 2 or more page views.
- **Legacy Warning**: Distinct from legacy Universal Analytics (UA), which classified any single-page visit as a bounce regardless of dwell time or user consumption.

#### 15. Email Open Rate
- **Definition**: The percentage of successfully delivered emails that registered an open event.
- **Formula**:
  $$\text{Open Rate} = \left(\frac{\text{Unique Opens}}{\text{Delivered Emails}}\right) \times 100$$
- **Apple MPP Disclosure**: Apple Mail Privacy Protection (iOS 15+) automatically pre-fetches email images via proxy servers, causing artificial inflation of open counts. Sparkline explicitly guides marketers to pair open rate analysis with click-to-delivered metrics.

#### 16. Email Click Rate (Click-to-Delivered)
- **Definition**: The percentage of all delivered email recipients who clicked at least one link inside your email.
- **Formula**:
  $$\text{Email Click Rate} = \left(\frac{\text{Unique Clicks}}{\text{Delivered Emails}}\right) \times 100$$
- **Industry Standard**: Preferred over Click-to-Open Rate (CTOR) when assessing overall campaign list reach and revenue yield in privacy-first email ecosystems.

---

## 4. Cross-Module Integration

The Marketing Metrics Center seamlessly interacts with the rest of the Sparkline Marketing suite:
- **Project Selection**: Associating calculations with active projects automatically stamps company name and brand context into the audit trail.
- **Currency Sync**: Connects with `/dashboard/currency` exchange rates, allowing instant multi-currency evaluation for CPC, CPM, CPA, CAC, and LTV.
- **Budget Alignment**: Feeds unit economics back into `/dashboard/budget` to calculate required campaign spend for target customer acquisition goals.
- **Strategy Validation**: Verifies that performance KPIs proposed in `/dashboard/strategy` align with industry realities.

