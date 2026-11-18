# Campaign Tracking & Optimization Engine

Sparkline Marketing's **Tracking & Optimization Center** provides empirical measurement and algorithmic diagnostics for advertising campaigns. This document outlines the mathematical formulas, threshold benchmarks, and automated diagnostic workflows implemented across the platform.

---

## 1. Mathematical Calculation Engine

All metrics in Sparkline are computed deterministically with safeguards against division-by-zero errors:

### 1. Click-Through Rate (CTR)
$$\text{CTR} = \begin{cases} \left(\frac{\text{Clicks}}{\text{Impressions}}\right) \times 100, & \text{Impressions} > 0 \\ 0, & \text{Impressions} = 0 \end{cases}$$
- **Industry Benchmark**: 1.0% – 2.5% across paid social; 3.0% – 6.0% for paid search.

### 2. Cost Per Click (CPC)
$$\text{CPC} = \begin{cases} \frac{\text{Spend}}{\text{Clicks}}, & \text{Clicks} > 0 \\ 0, & \text{Clicks} = 0 \end{cases}$$
- **Industry Benchmark**: \$0.80 – \$2.50 on Meta; \$2.00 – \$6.00 on Google Search; \$5.00 – \$12.00 on LinkedIn.

### 3. Cost Per Mille (CPM — Cost Per 1,000 Impressions)
$$\text{CPM} = \begin{cases} \left(\frac{\text{Spend}}{\text{Impressions}}\right) \times 1000, & \text{Impressions} > 0 \\ 0, & \text{Impressions} = 0 \end{cases}$$
- **Industry Benchmark**: \$12.00 – \$25.00 on Meta; \$25.00 – \$60.00 on LinkedIn.

### 4. Conversion Rate (CVR)
$$\text{CVR} = \begin{cases} \left(\frac{\text{Conversions}}{\text{Clicks}}\right) \times 100, & \text{Clicks} > 0 \\ 0, & \text{Clicks} = 0 \end{cases}$$
- **Industry Benchmark**: 2.0% – 4.5% for e-commerce; 5.0% – 12.0% for B2B lead capture.

### 5. Cost Per Acquisition (CPA)
$$\text{CPA} = \begin{cases} \frac{\text{Spend}}{\text{Conversions}}, & \text{Conversions} > 0 \\ 0, & \text{Conversions} = 0 \end{cases}$$

### 6. Return on Ad Spend (ROAS)
$$\text{ROAS} = \begin{cases} \frac{\text{Revenue}}{\text{Spend}}, & \text{Spend} > 0 \\ 0, & \text{Spend} = 0 \end{cases}$$
- **Interpretation**: A ROAS of 3.50 means \$3.50 in revenue generated for every \$1.00 spent on advertising.

### 7. Return on Investment (ROI)
$$\text{ROI} = \begin{cases} \left(\frac{\text{Revenue} - \text{Spend}}{\text{Spend}}\right) \times 100, & \text{Spend} > 0 \\ 0, & \text{Spend} = 0 \end{cases}$$

---

## 2. Rule-Based Diagnostic Optimization Matrix

When performance logs are updated, Sparkline's rule engine evaluates the metrics against heuristic thresholds and generates targeted operational recommendations:

```
+-------------------+-----------------------------+------------------------------------+---------------------------------------------------+
| Diagnostic Issue  | Trigger Condition           | Severity                           | Recommended Action                                |
+-------------------+-----------------------------+------------------------------------+---------------------------------------------------+
| High CPC          | CPC > $3.50                 | Warning                            | Narrow audience overlap; switch to broader        |
|                   |                             |                                    | interest cluster; test high-contrast thumbnail    |
+-------------------+-----------------------------+------------------------------------+---------------------------------------------------+
| Low CTR           | CTR < 1.0%                  | High                               | Overhaul the first 3 seconds (video hook); test   |
|                   |                             |                                    | new benefit-focused headline; check relevance score|
+-------------------+-----------------------------+------------------------------------+---------------------------------------------------+
| High CPA          | CPA > $65.00                | High                               | Audit post-click landing page friction; shorten   |
|                   |                             |                                    | lead forms; add social proof badges above fold     |
+-------------------+-----------------------------+------------------------------------+---------------------------------------------------+
| Low CVR           | CVR < 2.0% (Clicks >= 50)   | Medium                             | Align ad promise with landing page headline; check|
|                   |                             |                                    | page load speed on mobile devices                 |
+-------------------+-----------------------------+------------------------------------+---------------------------------------------------+
| Creative Fatigue  | Impressions > 50,000 AND    | Medium                             | Refresh visual assets; rotate in UGC or carousel; |
|                   | Conversions < 10            |                                    | expand lookalike targeting from 1% to 3%          |
+-------------------+-----------------------------+------------------------------------+---------------------------------------------------+
| Budget Imbalance  | Spent > Total Ad Budget     | Critical                           | Pause non-performing ad groups; reallocate daily   |
|                   |                             |                                    | caps to highest ROAS platform                     |
+-------------------+-----------------------------+------------------------------------+---------------------------------------------------+
```

---

## 3. Data Integrity & Verification Standard

1. **Manual Log Transparency**: Every performance entry explicitly displays its data source (`manual_entry` vs `verified_api_sync`).
2. **Deterministic Computations**: No placeholder or random calculations. All metrics correspond directly to user-entered or synced values.
3. **Audit History**: Historical performance logs are date-stamped and attached to the unique campaign record in LocalStorage.

