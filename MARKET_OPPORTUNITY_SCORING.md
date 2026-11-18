# Sparkline Market Opportunity Scoring Methodology
## Transparent Multi-Dimensional Prioritization Matrix for Growth Vectors

> **"Prioritize With Proof, Not Gimmicky Percentages."**  
> Technical documentation for opportunity scoring and ranking in Sparkline Marketing.

---

## 1. Why Multi-Dimensional Scoring Over Arbitrary Percentages?

Many marketing tools present arbitrary "opportunity scores" such as *"Opportunity Score: 87%"* without explaining what the number means, what data generated it, or what assumptions were made. Such opaque numbers are useless for serious capital allocation.

Sparkline Marketing replaces black-box percentages with a **Transparent Multi-Dimensional Scoring Grid** that evaluates every commercial opportunity across six explicit, verifiable criteria:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   MULTI-DIMENSIONAL OPPORTUNITY SCORING                     │
├──────────────────────┬──────────────────────┬───────────────────────────────┤
│ Customer Relevance   │ Business Fit         │ Evidence Strength             │
│ (Depth of resonance) │ (Product alignment)  │ (High / Med / Insufficient)   │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ Implementation Effort│ Strategic Value      │ Risk Level                    │
│ (Low / Med / High)   │ (Low / Med / High)   │ (Low / Med / High)            │
└──────────────────────┴──────────────────────┴───────────────────────────────┘
```

---

## 2. The Six Scoring Dimensions

### 2.1 Customer Relevance
- **Definition**: The degree to which the opportunity solves a burning, underserved customer pain point or unfulfilled desire.
- **Evaluation**: High customer resonance indicates that prospects actively search for this solution and encounter frustration with current alternatives.

### 2.2 Business Fit
- **Definition**: Alignment with the company's existing product capabilities, supply chain, core competencies, and brand ethos.
- **Evaluation**: High fit means minimal pivot required; low fit signals severe operational friction or channel mismatch.

### 2.3 Evidence Strength
- **Definition**: The empirical basis supporting the commercial existence of this opportunity.
- **Allowed Values**:
  - `High`: Verified by peer-reviewed research, industry publications, or audited financial data.
  - `Medium`: Supported by observed competitor traction, customer inquiry trends, or related category benchmarks.
  - `Low`: Early directional signal; limited sample size.
  - `Insufficient Evidence`: **Crucial Sparkline Guarantee**. When empirical evidence is lacking, the platform explicitly assigns this status rather than inventing a score.

### 2.4 Implementation Effort
- **Definition**: The engineering, creative, marketing, and operational bandwidth required to launch and validate the opportunity.
- **Allowed Values**: `Low` (1-2 weeks, existing assets) | `Medium` (2-6 weeks) | `High` (multidisciplinary overhaul).

### 2.5 Strategic Value
- **Definition**: The potential long-term commercial upside: lifetime value expansion, margin improvement, or customer lock-in.
- **Allowed Values**: `High` (fundamental growth inflection) | `Medium` (incremental revenue) | `Low` (minor tactical gain).

### 2.6 Risk Level
- **Definition**: Downside risk of execution failure, regulatory exposure, brand dilution, or wasted capital.
- **Allowed Values**: `Low` (safe to test) | `Medium` (requires bounded testing) | `High` (requires pre-launch legal or compliance clearance).

---

## 3. Opportunity Prioritization Matrix

Opportunities are synthesized into three actionable priority tiers based on the interaction between **Strategic Value**, **Effort**, and **Evidence**:

```
                       STRATEGIC VALUE
                  Low        Medium        High
              ┌───────────┬───────────┬───────────┐
         Low  │ Tactical  │  Quick    │ ⭐ PRIORITY│
              │  Punt     │   Win     │     1     │
EFFORT        ├───────────┼───────────┼───────────┤
         Med  │  Deprior- │ Balanced  │ ⭐ PRIORITY│
              │   itize   │   Sprint  │     2     │
              ├───────────┼───────────┼───────────┤
         High │  Avoid    │ Long-term │ Strategic │
              │           │   Bet     │ Execution │
              └───────────┴───────────┴───────────┘
```

1. **High Priority (Quick Wins & Flagship Opportunities)**:
   - High Strategic Value + Low to Medium Implementation Effort + High/Medium Evidence Strength.
   - Recommended for immediate sprint execution.
2. **Medium Priority (Balanced Bets)**:
   - Medium Strategic Value or High Effort requiring structured cross-team planning.
3. **Low Priority (Exploratory / Deferred)**:
   - Low Value or High Risk / Insufficient Evidence. Should be held in discovery backlog until further market validation.

---

## 4. Mandatory "Suggested Next Action" Requirement

Sparkline mandates that no opportunity can exist as mere theoretical commentary. Every scored opportunity must include an actionable, concrete **Suggested Next Action**:

```typescript
export interface MarketOpportunity {
  id: string;
  title: string;
  explanation: string;
  category: OpportunityCategory;
  customerRelevance: string;
  businessFit: string;
  evidenceStrength: ConfidenceLevel;
  implementationEffort: ImpactLevel;
  strategicValue: ImpactLevel;
  riskLevel: ImpactLevel;
  priority: ImpactLevel;
  suggestedNextAction: string;     // Must be a specific, testable commercial next step
  supportingEvidence: string;      // Empirical benchmark or citation
}
```

*Example Action*:
> *"Produce a 3-part educational video ad campaign showing active Vitamin C oxidation tests against a legacy dropper brand, driving traffic to an interactive formulation breakdown landing page."*

---

## 5. UI Integration & User Controls

In `/dashboard/market-research`, marketers can:
- Filter opportunities by **Priority** (`High`, `Medium`, `Low`).
- Filter opportunities by **Category** (`Underserved Need`, `New Segment`, `Product Differentiation`, `Geographic Expansion`, `Strategic Partnership`, `Channel Innovation`).
- Inspect the full 6-criteria scoring grid for any opportunity card.
- View clear alert badges when evidence is classified as `Insufficient Evidence`.

