# Sparkline Budget Calculation & Mathematical Rules

## Financial Integrity Standards

In financial and marketing budget management, floating-point inaccuracies (e.g. `0.1 + 0.2 = 0.30000000000000004`) lead to broken user interfaces, rounding drift, and distorted balance totals. Sparkline Marketing enforces deterministic integer minor-unit arithmetic throughout the budget engine.

---

## 1. Minor-Unit Conversions

All monetary sums are converted to integer minor units (e.g., cents for USD/EUR/GBP) before performing arithmetic calculations:

```typescript
// Convert major currency unit (e.g., $8,000.00) to minor units (800,000 cents)
export const toMinorUnits = (amount: number): number => Math.round(amount * 100);

// Convert minor units back to major floating currency
export const fromMinorUnits = (minor: number): number => minor / 100;
```

### Proportional Budget Calculation
When the user edits the total budget ($T$), each allocation item amount ($A_i$) is recalculated based on its assigned percentage ($P_i$):

$$A_i = \text{fromMinorUnits}\left(\left\lfloor \frac{\text{toMinorUnits}(T) \times P_i}{100} + 0.5 \right\rfloor\right)$$

---

## 2. Percentage Clamping & Recalculation

When a user adjusts an allocation's percentage or currency amount directly:
1. **Percentage Input**:
   - Clamped between $0.0\%$ and $100.0\%$.
   - Formatted to 1 decimal place: `Number(pct.toFixed(1))`.
   - Direct amount is updated via:
     $$\text{Amount} = \frac{\text{Total Budget} \times \text{Percentage}}{100}$$
2. **Direct Amount Input**:
   - Clamped between $0$ and $\text{Total Budget}$.
   - Percentage is updated via:
     $$\text{Percentage} = \text{Number}\left(\left(\frac{\text{Amount}}{\text{Total Budget}} \times 100\right).\text{toFixed}(1)\right)$$

---

## 3. Balance & Validation Logic

The active budget is validated against the following conditions on every keystroke:

```typescript
const totalPct = Number(
  allocations.reduce((sum, a) => sum + (Number(a.percentage) || 0), 0).toFixed(1)
);

const isBalanced100Percent = Math.abs(totalPct - 100) < 0.1;
const unallocatedPct = Number(Math.max(0, 100 - totalPct).toFixed(1));
const unallocatedAmount = fromMinorUnits(
  Math.max(0, toMinorUnits(totalBudget) - totalAllocatedMinor)
);
```

### Balance States:
- **Balanced (Green)**: $\text{Total} = 100.0\% \pm 0.1\%$.
- **Under-Allocated (Amber)**: $\text{Total} < 99.9\%$. Remainder can be automatically swept to *Testing & Reserve*.
- **Over-Allocated (Rose)**: $\text{Total} > 100.1\%$. Warns the user of budget deficit.

---

## 4. Rule-Based Allocation Auditing

The system evaluates active allocations against 6 programmatic rules:

| Rule Code | Trigger Condition | Severity | Actionable Recommendation |
|:---|:---|:---|:---|
| `concentration` | $\exists \text{ allocation } P_i > 50\%$ | **High** | Diversify spend into at least one complementary channel |
| `insufficient_testing` | $\sum P_{\text{Testing}} < 5\%$ | **Medium** | Reallocate at least 5%–10% into Testing & Reserve |
| `channel_dilution` | Paid ad channel allocated $< \$300/\text{mo}$ | **Medium** | Consolidate budget into top 1–2 channels to exit ad learning phases |
| `missing_creative` | $\sum P_{\text{Ad}} > 40\% \land \sum P_{\text{Creative}} < 5\%$ | **High** | Allocate 12%–20% to creative production to prevent ad fatigue |
| `excessive_operations` | $\sum P_{\text{Ops}} > 35\%$ | **Medium** | Audit SaaS stack and eliminate redundant software tools |
| `unallocated` | $\text{Unallocated \%} > 0.5\%$ | **Low** | Assign remaining funds or sweep to testing reserve |

