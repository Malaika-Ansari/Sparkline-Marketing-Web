# Forecast Data Quality & Epistemic Honesty Policy

**Sparkline Marketing Platform — Anti-Hallucination & Governance Standards**  
*Document Version: 1.0.0 • Phase 15 Architecture*

---

## 1. Principles of Predictive Grounding

Marketing forecasting tools frequently suffer from epistemic dishonesty: they present synthetic, decorative, or fabricated numbers as "AI predictions," leading businesses into catastrophic capital misallocations.

Sparkline enforces five mandatory **Predictive Governance Rules**:

1. **No Invented Performance Data**: The platform never creates fake benchmark statistics, simulated click histories, or synthetic conversion numbers.
2. **Explicit Provenance Tagging**: Every input parameter must be tagged with its authentic origin:
   - `actual`: Real performance logged in the platform or connected analytics.
   - `historical`: User-entered past performance records.
   - `benchmark`: Published research from authoritative institutions (e.g. LocaliQ, Mailchimp, Shopify).
   - `assumption`: Hypotheses provided by the user.
3. **No Decorative Charts**: All visualizations (Recharts) render the actual calculated scenario values. Charts with decorative or fake hardcoded animations are strictly prohibited.
4. **Deterministic Calculation Integrity**: Mathematical operations (multiplications, divisions, break-even thresholds) are executed strictly in deterministic TypeScript code (`forecast.service.ts`). Large Language Models (AI) are utilized exclusively for narrative interpretation, risk diagnostics, and strategic recommendations—never as the source of arithmetic.
5. **Clear Epistemic Disclaimers**: Every forecast report explicitly states that scenario outcomes are modeled estimates based on assumptions, not contractual or guaranteed financial returns.

---

## 2. Incomplete Data Protocol

When a user attempts to generate a forecast without essential commercial inputs:
1. **No Silent Defaults**: The system does not silently invent missing budgets or selling prices.
2. **Missing Fields Identification**: Identifies the exact missing fields in the Data Quality panel (e.g., *"Gross Margin % is required to calculate net profit ROI and true break-even thresholds"*).
3. **Graceful Degradation**: Where partial calculations are safe (e.g., calculating impressions and clicks without revenue), those metrics are displayed while dependent metrics (such as ROAS, Net Profit, and Break-Even) are explicitly marked as `N/A` or disabled with actionable instructions.

---

## 3. Data Quality Scoring Methodology

The platform calculates a transparent **Quality Score**:

- **High Quality**:
  - Contains verified actual or historical campaign baselines.
  - Zero missing critical inputs (Budget, Ad Spend, AOV, Gross Margin, Flight Dates provided).
  - Maximum of 1 user assumption.
- **Medium Quality**:
  - Uses published industry benchmarks (e.g., LocaliQ search CTR, Meta CPM).
  - Essential financial inputs present.
  - Incorporates 2–3 user assumptions.
- **Low Quality**:
  - Contains $\ge 4$ unverified user assumptions.
  - Or lacks gross margin / unit pricing details.
  - Accompanied by prominent warning banners advising small-scale pilot testing before capital deployment.

---

## 4. Historical Actuals Comparison Integrity

When users navigate to the **Saved Forecasts & History** tab:
- If no historical campaign actuals exist in the workspace, the system displays an honest empty state with a direct link to log results in `/dashboard/metrics`.
- The system never populates empty comparison tables with fabricated campaign results or synthetic competitor logs.

