# Sparkline Financial Calculation & Currency Rules

## Mathematical Precision & Currency Integrity

Cross-border marketing and multi-currency budgeting require strict arithmetic discipline to eliminate floating-point drift, preserve historical audit records, and ensure locale compliance.

---

## 1. Currency Precision Matrix

Each supported currency adheres to international ISO 4217 standard fractional unit rules:

```typescript
export const CURRENCY_PRECISION_RULES: Record<CurrencyCode, number> = {
  USD: 2, // Cent
  PKR: 2, // Paisa
  GBP: 2, // Penny
  EUR: 2, // Cent
  AED: 2, // Fils
  SAR: 2, // Halalah
  INR: 2, // Paisa
  CAD: 2, // Cent
  AUD: 2, // Cent
  JPY: 0, // No fractional sub-unit (Integer Yen)
  CNY: 2, // Fen
  BDT: 2, // Poisha
  TRY: 2, // Kurus
  MYR: 2, // Sen
  SGD: 2, // Cent
};
```

---

## 2. Cross-Rate Conversion Architecture

To prevent intermediate rounding compounding, all cross-rate calculations compute conversion factors at double-precision floating point (`64-bit IEEE 754`) before applying the final currency precision formatting:

$$\text{Direct Factor} = \frac{\text{Rates}[\text{Target}]}{\text{Rates}[\text{Source}]}$$

$$\text{Raw Converted} = \text{Amount} \times \text{Direct Factor}$$

$$\text{Final Result} = \text{Number}\left(\text{Raw Converted}.\text{toFixed}(\text{Target Decimals})\right)$$

### Currency Formatting Logic:
Formatting employs the standard `Intl.NumberFormat` with strict locale binding:
```typescript
new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: currencyCode,
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals,
}).format(amount);
```

---

## 3. Historical Conversion Immutability

When a currency conversion is saved by the user:
1. The conversion snapshot is stored with:
   - `timestamp`: Exact ISO 8601 creation string.
   - `exchangeRate`: The exact conversion multiplier used at the moment of calculation.
   - `sourceAmount` & `targetAmount`.
   - `provider`: Institutional or live feed name.
2. **Strict Rule**: Historical records are never updated or recalculated when today's exchange rates change. This ensures that past financial reports, invoices, and budget approvals remain 100% reproducible for accounting audits.

---

## 4. Division by Zero & Boundary Protections

All marketing metric formulas execute boundary checks:
```typescript
if (denominator <= 0) {
  return {
    result: null,
    isZeroDenominator: true,
    errorReason: 'Division by zero is undefined. Denominator must be greater than zero.',
  };
}
```
Inputs with negative values or invalid strings are coerced to 0 or clamped to valid ranges with user-friendly warnings.

---

## 5. Budget Plan Integration Safety

When importing a marketing budget plan from Prompt 12:
1. The original plan in `budgetService` is treated as strictly **read-only**.
2. Converted values are computed in memory for presentation and cross-border analysis.
3. No mutation is dispatched to `sparkline_marketing_budget_plans`, preventing accidental budget destruction.

