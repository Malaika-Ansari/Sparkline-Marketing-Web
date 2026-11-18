# Report Data Provenance & Source Transparency

**Sparkline Marketing — AI-Powered Marketing Intelligence & Strategy Platform**  
*Document Version: 1.0.0 — Phase 20 (Reports & Insights Command Center)*

---

## 1. The Imperative of Source Transparency

In an era of generative AI proliferation, executive and institutional trust is frequently undermined by unsourced claims, opaque algorithms, and synthetic "hallucinated" numbers. 

Sparkline Marketing solves this through a rigorous **Data Provenance Architecture**. Every metric, narrative recommendation, table cell, and forecast scenario generated within the reporting engine is permanently tagged with a verifiable provenance classification and linked back to its upstream origin in the platform.

---

## 2. The 10 Data Provenance Classifications

Every data element within a report is categorized into one of ten explicit provenance types (`DataProvenanceType`):

```
+----------------------------------------------------------------------------------------------------+
|                                    10 DATA PROVENANCE TYPES                                        |
+------------------------------------+---------------------------------------------------------------+
| Provenance Classification          | Exact Definition & System Origin                              |
+------------------------------------+---------------------------------------------------------------+
| 1. User-provided information       | Explicit facts input directly by the user (e.g. brand name,   |
|                                    | products catalog, product selling price, baseline budget).     |
| 2. Imported business data          | Data imported via CSV/JSON integrations or enterprise CRM.    |
| 3. Connected-platform metrics      | Live API performance telemetry from connected platforms        |
|                                    | (e.g. Google Ads, Meta Ads, Search Console, GA4).             |
| 4. Calculated result               | Deterministic mathematical formulas with zero AI subjectivity  |
|                                    | (e.g. CAC = Spend / Customers; ROAS = Revenue / Ad Spend).    |
| 5. AI-generated interpretation    | Contextual synthesis and qualitative insights produced by the  |
|                                    | AI Strategist and LLM recommendation engines.                 |
| 6. AI recommendation               | Actionable strategic guidance prioritizing high-ROI actions.   |
| 7. Estimate                        | Statistical projections derived from econometric modeling      |
|                                    | (e.g. 12-month balanced revenue forecast).                    |
| 8. Assumption                      | Baseline operational constants (e.g. 30-day conversion cycle, |
|                                    | 75% gross profit margin threshold).                           |
| 9. Verified external benchmark     | Empirical market data validated against published industry     |
|                                    | studies (e.g. eMarketer, Statista, B2B SaaS benchmarks).      |
| 10. Unverified observation         | Qualitative signals or competitive claims that have not yet    |
|                                    | been validated by independent statistical telemetry.          |
+------------------------------------+---------------------------------------------------------------+
```

---

## 3. Visual Provenance Tagging in Reports

In both the on-screen report reader and the exported print/PDF documents, provenance classifications are presented as standardized visual tags:

- **Calculated Results** (`Calculated result`): Marked with a blue formula badge to signal deterministic arithmetic integrity.
- **AI Recommendations** (`AI recommendation`): Highlighted in purple to clearly indicate machine-generated strategic advice that requires human review.
- **Verified External Benchmarks** (`Verified external benchmark`): Displayed with a green verification shield and corresponding citation index.
- **User-Provided Information** (`User-provided information`): Labeled in neutral slate to indicate baseline corporate parameters.
- **Modeled Estimates** (`Estimate`): Clearly designated with amber warning badges to denote sensitivity and probabilistic variation.

---

## 4. Citation Index & Appendix Sources

Reports generated with the `appendix_sources` section include an exhaustive citation registry detailing:
1. **Source Title & Origin**: Full name of the data source, research report, or platform API.
2. **Consulted URL or Data Reference**: Direct link or reference identifier to the original data document.
3. **Verification Date**: Timestamp of when the data was extracted or verified.
4. **Verification Status**:
   - `Verified`: Formally checked against published data or direct platform API.
   - `Estimated`: Modeled using predictive algorithms.
   - `User-Supplied`: Direct customer input.
5. **Applied Notes & Context**: Explanatory context detailing how the source informs specific report findings.

---

## 5. Audit & Governance Benefits

- **Boardroom Defensibility**: Executives can present Sparkline Marketing reports to audit committees and investors with full confidence, demonstrating the exact origin of every financial forecast.
- **Regulatory Compliance**: Meets corporate compliance requirements for transparency in AI-assisted decision making.
- **Error Isolation**: If an upstream metric changes (e.g. a modified product price or budget adjustment), the report regeneration engine immediately cascades the correction through all dependent calculations while maintaining historical version snapshots.

