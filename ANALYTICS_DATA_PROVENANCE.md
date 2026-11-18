# Analytics Data Provenance & Epistemic Standards

> **Sparkline Marketing Intelligence & Strategy Platform — Phase 23**

---

## 1. Provenance Policy & Epistemic Honesty

Sparkline Marketing enforces strict data provenance tagging across every analytics card, chart, and exportable report. Marketing decisions require absolute clarity between directly measured observations and synthetic estimates.

The platform strictly prohibits:
- Fabricating simulated connection statuses (e.g. marking an integration "Connected" without authenticated tokens).
- Falsely claiming estimated numbers are "Verified Results".
- Hiding attribution window differences when comparing competing advertising platforms.
- Obscuring demo/seed baseline data.

---

## 2. The 6 Data Provenance Classifications

Every metric, data point, and recommendation in the analytics workspace carries an explicit `dataSource` classification:

| Provenance Classification | Badge Appearance | Definition & Operational Origin | Examples in Platform |
| :--- | :--- | :--- | :--- |
| **`connected-platform`** | Emerald Badge | Directly extracted from an authenticated third-party API over TLS. | Meta Ads Manager spend, GA4 sessions, GSC query clicks. |
| **`imported`** | Blue Badge | Ingested via validated user CSV upload or spreadsheet connector. | Third-party network export, agency media invoice sheet. |
| **`user-entered`** | Slate Badge | Manually keyed into form inputs or project settings by the user. | Monthly planned budget, target CPA goal, product selling price. |
| **`calculated`** | Cyan Badge | Pure mathematical derivation from two or more valid base metrics. | CTR, CPC, CPM, CPA, ROAS, ROI, Funnel Drop-off %. |
| **`ai-interpretation`** | Purple Badge | Strategic evaluation, bottleneck diagnostic, or recommendation. | "Spend re-allocation opportunity: Google ROAS exceeds Meta by 42%". |
| **`estimate`** | Amber Badge | Heuristic or industry benchmark approximation when data is missing. | Website arrival rate (88%), Lead qualification rate (45%), Demo Seed Data. |

---

## 3. Data Quality Status Matrix

In addition to source origin, records are evaluated for statistical integrity:

- **`verified`**: Passed schema validation, non-negative bounds, and verified source timestamps.
- **`unverified`**: Imported from external files without verified platform cryptographic signatures.
- **`anomalous`**: Outlier detected (e.g. sudden 10x CPC spike or zero conversion tracking discontinuity).
- **`estimated`**: Calculated based on empirical industry conversion benchmarks.
- **`demo`**: Pre-seeded demonstration baseline used when a project has not yet connected live media accounts. Explicitly disclosed in top workspace banner.

---

## 4. Actual vs. Forecasted Separation Standards

To avoid confusing past performance with predicted future outcomes:
1. `/dashboard/analytics` exclusively reports **actual recorded performance** (historical spend, realized revenue, live conversions).
2. `/dashboard/forecast` models **probabilistic future scenarios** (conservative, expected, aggressive projections).
3. Analytics reports connecting both modules explicitly separate sections under "Historical Realized Performance" vs. "Predictive Forward Forecasting".

