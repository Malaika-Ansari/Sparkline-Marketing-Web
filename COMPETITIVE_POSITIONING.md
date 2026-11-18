# Sparkline Competitive Positioning & 2x2 Mapping Framework
## Multi-Dimensional Strategic Differentiation and Spatial Cartography

> **"Positioning Is Not What You Do to a Product. It Is What You Do to the Mind of the Prospect."**  
> Technical documentation for positioning analysis and 2x2 map visualization in Sparkline Marketing.

---

## 1. The Eight Positioning Dimensions

Sparkline Marketing evaluates competitive positioning across eight distinct commercial dimensions:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       EIGHT POSITIONING DIMENSIONS                          │
├──────────────────────┬──────────────────────┬───────────────────────────────┤
│ 1. Price Positioning │ 2. Product Moat      │ 3. Customer Experience        │
│    (Value vs Luxury) │    (Active Stability)│    (Onboarding friction)      │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ 4. Value Proposition │ 5. Brand Messaging   │ 6. Target Audience            │
│    (Core promise)    │    (Tone & angle)    │    (Demographic / Psychographic)
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ 7. Marketing Channels│ 8. Content Approach  │ ⭐ Strategic Implication       │
│    (Distribution)    │    (Editorial style) │    (Actionable commercial plan│
└──────────────────────┴──────────────────────┴───────────────────────────────┘
```

For each dimension, the system classifies each competitor's standing relative to the user business:
- **Leader**: Dominant player setting the category standard.
- **Parity**: Standard industry performance; no distinct differentiation.
- **Laggard**: Underperforming on customer satisfaction, speed, or packaging.
- **Differentiated**: Possessing a distinct, alternative positioning angle.

---

## 2. Evidence-Based 2x2 Positioning Map

When sufficient evidence exists, Sparkline Marketing generates an interactive **2x2 Positioning Map**.

### 2.1 Spatial Coordinate Mapping
- **X-Axis**: Represents the pricing spectrum (e.g. Accessible / Value Tier $\to$ Ultra-Luxury / Enterprise Custom).
- **Y-Axis**: Represents technological specialization, active formula stability, or workflow automation (Standard $\to$ Advanced / Clinical).
- **Coordinate System**: Normalized between 0 and 100 on both axes.

```
                  Advanced / Clinical Stability (Y = 100)
                                 │
           QUADRANT II           │           QUADRANT I
     ⭐ ACCESSIBLE CLINICAL      │         PRESTIGE CLINICAL
     (GlowBiome Organics: 35,90) │        (SkinCeuticals: 95,55)
                                 │
 ─── Accessible (X = 0) ─────────┼────────── Luxury / Enterprise (X = 100)
                                 │
           QUADRANT III          │           QUADRANT IV
          MASS MARKET            │         LIFESTYLE LUXURY
          (Dupes / Generic)      │        (Drunk Elephant: 50,65)
                                 │        (Sunday Riley: 55,40)
                                 ▼
                   Basic / Standard Packaging (Y = 0)
```

### 2.2 Epistemic Safeguards on 2x2 Mapping
- **`hasSufficientEvidence: true`**: Coordinates are plotted only when based on concrete public attributes (e.g. actual MSRP, lab stability audits, API connectors).
- **Tooltips on Points**: Hovering over any point displays:
  - Exact X and Y conceptual values.
  - The empirical evidence basis supporting the placement.
- **Descriptive Fallback**: If data is incomplete, the UI renders a descriptive qualitative breakdown rather than inventing arbitrary coordinates.

---

## 3. Asymmetric Opportunity Identification

Positioning maps serve to identify **Asymmetric Whitespace**:
- Areas of high customer desire with zero or weak incumbent presence.
- *Example*: Offering 15% pure L-Ascorbic clinical efficacy stabilized in nitrogen-flushed airless pumps at $58 directly attacks the $182 luxury incumbent while outperforming the unstable droppers of clean mass brands.

