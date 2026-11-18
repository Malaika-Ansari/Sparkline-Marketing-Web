# Sparkline Multi-Currency Converter & Marketing Cost Engine

## Architecture & System Overview

The **Sparkline Multi-Currency Conversion & Marketing Cost Engine** is an institutional-grade financial utility designed specifically for modern growth marketers, agencies, and cross-border businesses.

Located at `/dashboard/currency`, the system enables marketers to:
1. Convert budgets and campaign expenditures seamlessly across **15 primary marketing currencies**.
2. Calculate foundational marketing performance metrics (CPC, CPM, CPA, CPL, CTR, CVR, ROAS, ROI) with zero-denominator safety and clear governance definitions.
3. Benchmark cross-border advertising costs normalized to a common currency without biased or unverified claims.
4. Estimate and audit marketing expenses across 10 structured categories.
5. Import saved marketing budget plans from Prompt 12 without mutating the original currency or plan values.
6. Retain a fully reproducible conversion history that stores the historical exchange rate and timestamp used for every conversion.

---

## Supported Currencies Matrix

The platform supports 15 major marketing, e-commerce, and SaaS currencies:

| Code | Currency Name | Symbol | Flag | Precision | Primary Market Region |
|:---|:---|:---|:---:|:---:|:---|
| **USD** | US Dollar | `$` | 🇺🇸 | 2 Decimals | United States & Global Base |
| **PKR** | Pakistani Rupee | `Rs` | 🇵🇰 | 2 Decimals | Pakistan & South Asia |
| **GBP** | British Pound | `£` | 🇬🇧 | 2 Decimals | United Kingdom |
| **EUR** | Euro | `€` | 🇪🇺 | 2 Decimals | European Union |
| **AED** | UAE Dirham | `AED` | 🇦🇪 | 2 Decimals | United Arab Emirates & GCC |
| **SAR** | Saudi Riyal | `SAR` | 🇸🇦 | 2 Decimals | Saudi Arabia & Middle East |
| **INR** | Indian Rupee | `₹` | 🇮🇳 | 2 Decimals | India |
| **CAD** | Canadian Dollar | `CA$` | 🇨🇦 | 2 Decimals | Canada |
| **AUD** | Australian Dollar | `A$` | 🇦🇺 | 2 Decimals | Australia |
| **JPY** | Japanese Yen | `¥` | 🇯🇵 | 0 Decimals | Japan |
| **CNY** | Chinese Yuan | `¥` | 🇨🇳 | 2 Decimals | China |
| **BDT** | Bangladeshi Taka | `Tk` | 🇧🇩 | 2 Decimals | Bangladesh |
| **TRY** | Turkish Lira | `₺` | 🇹🇷 | 2 Decimals | Turkey |
| **MYR** | Malaysian Ringgit | `RM` | 🇲🇾 | 2 Decimals | Malaysia & ASEAN |
| **SGD** | Singapore Dollar | `S$` | 🇸🇬 | 2 Decimals | Singapore & APAC Hub |

---

## Key Capabilities & User Flows

### 1. Instant Currency Converter
- **Bidirectional Conversion**: Convert from any of the 15 currencies to any other using direct cross-rates:
  $$\text{Target Amount} = \text{Amount} \times \left(\frac{\text{Rate}_{\text{target}}}{\text{Rate}_{\text{source}}}\right)$$
- **One-Click Currency Swap**: Swap source and target currencies instantly.
- **Precision Rounding**: Enforces currency-specific precision (e.g. 0 decimals for JPY, 2 decimals for all others).
- **Clipboard Integration**: Copy converted values with instant toast feedback.
- **Quick Conversion Chips**: Rapid test increments ($100, $500, $1k, $5k, $10k, $50k).
- **Cross-Currency Matrix**: Visual grid converting the active amount into all 14 other currencies simultaneously.

### 2. Marketing Cost Calculators (8 Metrics)
- **CPC**: Direct media auction fee per verified click.
- **CPM**: Cost efficiency per thousand ad views.
- **CPA**: Customer acquisition cost relative to total campaign investment.
- **CPL**: Lead generation cost efficiency.
- **CTR**: Ad creative relevance and hook efficiency percentage.
- **Conversion Rate (CVR)**: Landing page and checkout efficiency percentage.
- **ROAS**: Gross revenue multiplier directly generated from ad media spend.
- **ROI**: Comprehensive bottom-line financial percentage return accounting for all capital invested.

### 3. Cross-Platform & Regional Ad Cost Comparison
- Benchmarks CPC, CPM, and CPA figures across different ad networks (Meta, Google, TikTok, LinkedIn) and countries.
- Normalizes all costs into a user-selected target currency for apples-to-apples comparison.
- Strict parity disclaimer ensures no unverified claims of platform or country superiority.

### 4. Marketing Expense Estimator & Actual Tracker
- Organizes line items across 10 standardized categories:
  1. Advertising spend
  2. Creative production
  3. Graphic design
  4. Video editing
  5. Content writing
  6. Influencer collaborations
  7. Software subscriptions
  8. Agency fees
  9. Freelancer costs
  10. Other marketing expenses
- Tracks **Estimated Spend vs. Actual Incurred** with variance calculation (`Actual - Estimated`).
- Currency conversion toggle lets teams view multinational expense sheets in any target currency.

### 5. Budget Planner Integration (Prompt 12 Sync)
- Imports saved marketing budget plans from `budgetService.getPlans()`.
- Converts the entire plan total and all individual channel allocations to a selected foreign currency.
- **Immutability Guarantee**: Does not mutate or overwrite the stored Prompt 12 budget plan.

### 6. Historical Conversion Audit Trail
- Saves conversions with the exact exchange rate and timestamp used.
- Ensures historical conversions remain reproducible even when exchange rates fluctuate in the future.
- Exports complete conversion history to CSV, JSON, or Markdown.

