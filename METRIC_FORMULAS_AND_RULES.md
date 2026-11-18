# Marketing Metric Formulas, Calculation Rules & Boundary Protections

**Sparkline Marketing Platform — Technical Calculation Standards**  
*Document Version: 1.0.0 • Phase 14 Architecture*

---

## 1. Core Principles of Calculation Integrity

Marketing decisions often involve thousands or millions of dollars in capital allocation. Calculators that emit `NaN`, `Infinity`, or silent mathematical absurdities mislead founders and growth teams. The Sparkline calculation engine enforces strict mathematical integrity:

1. **Zero Silent Failures**: No calculation ever returns raw `NaN`, `Infinity`, or unhandled JavaScript exceptions.
2. **Explicit Zero-Denominator Explanations**: When denominators are zero, the system displays explanatory feedback clarifying why the metric cannot be computed and what action is required.
3. **Strict Boundary Validation**: Physically impossible combinations (e.g., clicks exceeding impressions, video completions exceeding starts, non-engaged sessions exceeding total sessions) trigger boundary warnings.
4. **Scope-Aware Accounting**: Distinguishes direct media spend from fully loaded campaign expenditure to prevent false profitability readings.
5. **Privacy and Telemetry Compliance**: Reflects platform changes such as Google Analytics 4 (GA4) session engagement models and Apple Mail Privacy Protection (MPP).

---

## 2. Mathematical Rule Specifications

### 2.1 Click-Through Rate (CTR)
- **Formula**:
  $$\text{CTR} = \frac{\text{Clicks}}{\text{Impressions}} \times 100$$
- **Rules & Bounds**:
  - Requires $\text{Impressions} > 0$. If $\text{Impressions} = 0$: Returns `isZeroDenominator: true` with message *"Zero impressions recorded. An ad must be served at least once before a click-through rate can be calculated."*
  - Requires $\text{Clicks} \le \text{Impressions}$. If $\text{Clicks} > \text{Impressions}$: Sets status to `warning` with message *"Clicks cannot exceed impressions. Please verify your tracking numbers."*
- **Precision**: 2 decimal places with `%` suffix.

### 2.2 Cost Per Click (CPC)
- **Formula**:
  $$\text{CPC} = \frac{\text{Ad Spend}}{\text{Clicks}}$$
- **Rules & Bounds**:
  - Requires $\text{Clicks} > 0$. If $\text{Clicks} = 0$: Returns message *"Zero clicks recorded. CPC cannot be calculated until at least one click is generated."*
  - Requires $\text{Ad Spend} \ge 0$.
- **Precision**: 2 decimal places with active currency prefix.

### 2.3 Cost Per Mille (CPM)
- **Formula**:
  $$\text{CPM} = \frac{\text{Ad Spend}}{\text{Impressions}} \times 1,000$$
- **Rules & Bounds**:
  - Requires $\text{Impressions} > 0$. If $\text{Impressions} = 0$: Returns zero-denominator message explaining that at least 1 impression is required.
  - Requires $\text{Ad Spend} \ge 0$.
- **Precision**: 2 decimal places with active currency prefix.

### 2.4 Cost Per Acquisition (CPA)
- **Formula**:
  $$\text{CPA} = \frac{\text{Cost}}{\text{Conversions}}$$
- **Scope Distinction**:
  - `ad_spend_only`: Evaluates cost against direct auction ad spend. Useful for bidding algorithm checks.
  - `total_campaign_cost`: Evaluates cost against all campaign costs including creative, agency, software, and media. Required for true operational accounting.
- **Rules & Bounds**:
  - Requires $\text{Conversions} > 0$. If $\text{Conversions} = 0$: Returns zero-denominator warning.
- **Precision**: 2 decimal places with active currency prefix.

### 2.5 Ad Frequency
- **Formula**:
  $$\text{Frequency} = \frac{\text{Impressions}}{\text{Unique Reach}}$$
- **Rules & Bounds**:
  - Requires $\text{Reach} > 0$. If $\text{Reach} = 0$: Returns zero-denominator notice.
  - Requires $\text{Impressions} \ge \text{Reach}$. If $\text{Impressions} < \text{Reach}$: Warns that unique reach cannot mathematically exceed impressions.
- **Precision**: 2 decimal places with `x` suffix.

### 2.6 Social Media Engagement Rate
- **Formula**:
  $$\text{Engagement Rate} = \frac{\text{Total Interactions}}{\text{Denominator}} \times 100$$
- **Denominator Rules**:
  - `followers`: Suitable for external public account benchmarking. Sensitive to inactive/ghost followers.
  - `reach`: Industry best practice for organic content performance (measures interaction among users who actually saw the post).
  - `impressions`: Standard for paid sponsored posts where impressions are guaranteed.
- **Rules & Bounds**:
  - Requires $\text{Denominator} > 0$.
- **Precision**: 2 decimal places with `%` suffix.

### 2.7 Video Completion Rate (VCR)
- **Formula**:
  $$\text{VCR} = \frac{\text{Video Completions}}{\text{Video Starts}} \times 100$$
- **Rules & Bounds**:
  - Requires $\text{Video Starts} > 0$.
  - Requires $\text{Video Completions} \le \text{Video Starts}$. If completions exceed starts, flags tracking error.
- **Precision**: 2 decimal places with `%` suffix.

### 2.8 Cost Per Lead (CPL)
- **Formula**:
  $$\text{CPL} = \frac{\text{Total Cost}}{\text{Leads Captured}}$$
- **Rules & Bounds**:
  - Requires $\text{Leads Captured} > 0$. If zero leads, returns zero-denominator explanation.
- **Precision**: 2 decimal places with active currency prefix.

### 2.9 Conversion Rate (CVR)
- **Formula**:
  $$\text{CVR} = \frac{\text{Conversions}}{\text{Denominator}} \times 100$$
- **Supported Denominators**:
  - `clicks`: Landing page click-to-lead efficiency.
  - `sessions`: Session-level conversion rate (ecommerce standard).
  - `visitors`: Unique user conversion rate (de-duplicating repeat visits).
- **Rules & Bounds**:
  - Requires $\text{Conversions} \le \text{Denominator}$.
  - Requires $\text{Denominator} > 0$.
- **Precision**: 2 decimal places with `%` suffix.

### 2.10 Return on Ad Spend (ROAS)
- **Formula**:
  $$\text{ROAS} = \frac{\text{Attributed Revenue}}{\text{Ad Spend}}$$
- **Critical Accounting Rules**:
  - Output is strictly a **ratio multiplier** (`x`), e.g., `4.50x`. It must never be presented as a net percentage like ROI.
  - Denominator is strictly **media ad spend**. It does not include creative production, software, or labor.
- **Rules & Bounds**:
  - Requires $\text{Ad Spend} > 0$.
  - Status classification:
    - $\text{ROAS} \ge 4.0\text{x}$: Excellent / high capital efficiency.
    - $2.5\text{x} \le \text{ROAS} < 4.0\text{x}$: Healthy / typical target for ecommerce.
    - $1.0\text{x} \le \text{ROAS} < 2.5\text{x}$: Marginal / requires low COGS to remain profitable.
    - $\text{ROAS} < 1.0\text{x}$: Unprofitable on ad spend alone.

### 2.11 Return on Investment (ROI)
- **Formula**:
  $$\text{ROI} = \left(\frac{\text{Gross Return / Net Revenue} - \text{Total Investment}}{\text{Total Investment}}\right) \times 100$$
- **Critical Accounting Rules**:
  - Output is expressed as a **percentage** (`%`).
  - $0\%$ represents exact break-even (return equals cost).
  - Negative percentages reflect net financial capital loss.
  - Denominator represents **total investment** (media + software + agency + creative + overhead).
- **Rules & Bounds**:
  - Requires $\text{Total Investment} > 0$.

### 2.12 Customer Acquisition Cost (CAC)
- **Formula**:
  $$\text{CAC} = \frac{\text{Total Acquisition Costs}}{\text{New Customers Acquired}}$$
- **Critical Accounting Rules**:
  - Must include all direct acquisition expenses incurred during the reporting window: ad spend, marketing tools, agency fees, and sales team commissions.
  - Requires $\text{New Customers Acquired} > 0$.

### 2.13 Customer Lifetime Value (CLV / LTV)
- **Formula**:
  $$\text{LTV} = \text{Average Order Value} \times \text{Purchase Frequency} \times \text{Customer Lifespan} \times \left(\frac{\text{Gross Margin } \%}{100}\right)$$
- **Critical Accounting Rules**:
  - When comparing LTV to CAC ($\text{LTV}:\text{CAC}$ ratio), **gross margin must be included**. Using top-line revenue for LTV:CAC creates false confidence in business sustainability because cost of goods sold (COGS) is ignored.
  - Healthy target: $\text{LTV} \ge 3 \times \text{CAC}$.

### 2.14 Google Analytics 4 (GA4) Bounce Rate
- **Formula**:
  $$\text{GA4 Bounce Rate} = \frac{\text{Non-Engaged Sessions}}{\text{Total Sessions}} \times 100$$
  $$\text{GA4 Bounce Rate} = 100\% - \text{GA4 Engagement Rate}$$
- **Architectural Rules**:
  - In GA4, an **engaged session** is defined as lasting 10+ seconds, generating 2+ page views, or triggering 1+ conversion events.
  - Therefore, any session that does not fulfill one of these conditions is non-engaged.
  - Requires $\text{Non-Engaged Sessions} \le \text{Total Sessions}$.

### 2.15 Email Open Rate & Apple MPP Caveat
- **Formula**:
  $$\text{Open Rate} = \frac{\text{Unique Opens}}{\text{Delivered Emails}} \times 100$$
- **Telemetry Caveat**:
  - Apple Mail Privacy Protection (MPP) caches and loads tracking pixels on behalf of users in Apple Mail regardless of whether the user viewed the email.
  - As a result, open rates on lists with high Apple user concentrations are artificially inflated by 15–30%.
  - Open rates should be interpreted as directional indicators of deliverability and subject line momentum rather than literal readership.

### 2.16 Email Click Rate (Click-to-Delivered)
- **Formula**:
  $$\text{Email Click Rate} = \frac{\text{Unique Clicks}}{\text{Delivered Emails}} \times 100$$
- **Rules & Bounds**:
  - Measures total audience action against delivered inbox volume.
  - Requires $\text{Delivered Emails} > 0$.
  - Requires $\text{Unique Clicks} \le \text{Delivered Emails}$.

---

## 3. Data Persistence & Audit Trail Schema

All metric calculations saved to the platform audit trail are persisted to localStorage under `sparkline_marketing_metric_calculations` adhering to the following structure:

```typescript
interface MetricCalculationRecord {
  id: string;               // UUID
  metricId: MetricId;       // Canonical ID
  metricName: string;       // Formatted Name
  category: MetricCategory; // Category classification
  inputs: Record<string, number | string>; // Exact parameter snapshot
  resultValue: number;      // Raw numeric output
  formattedResult: string;  // Formatted string (e.g. "$45.20", "3.25%", "4.00x")
  unit: string;             // Unit symbol
  currency: string;         // Active currency standard ($ / € / £ / ¥ / etc.)
  timestamp: string;        // ISO 8601 string
  projectId?: string;       // Associated project
  projectName?: string;     // Business / brand identifier
  isZeroDenominator?: boolean; // Audit safety flag
  status?: 'optimal' | 'acceptable' | 'warning' | 'critical';
  notes?: string;           // Optional user or audit annotation
}
```

