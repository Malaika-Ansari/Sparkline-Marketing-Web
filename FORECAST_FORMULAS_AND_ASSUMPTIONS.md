# Forecast Formulas, Mathematical Derivations & Assumptions Policy

**Sparkline Marketing Platform — Technical Calculation Specifications**  
*Document Version: 1.0.0 • Phase 15 Architecture*

---

## 1. Funnel Calculation Chain

The calculation engine evaluates digital campaign funnels sequentially. Each downstream variable is computed deterministically from verified upstream parameters:

### Step 1: Estimated Impressions
$$\text{Impressions} = \left(\frac{\text{Ad Spend}}{\text{Effective CPM}}\right) \times 1,000$$
- **Zero Safeguard**: If $\text{Ad Spend} = 0$, $\text{Impressions} = 0$.
- **CPM Safeguard**: $\text{Effective CPM} \ge 0.10$ to prevent division by zero.

### Step 2: Estimated Clicks
$$\text{Clicks} = \text{Impressions} \times \left(\frac{\text{Effective CTR}}{100}\right)$$
- **Boundary Safeguard**: $0 \le \text{Clicks} \le \text{Impressions}$.

### Step 3: Estimated Leads (Optional Intermediate Funnel Stage)
$$\text{Leads} = \text{Clicks} \times \left(\frac{\text{Effective Lead CVR}}{100}\right)$$
- Only calculated when a distinct lead conversion stage is configured.

### Step 4: Estimated Customers / Buyers
$$\text{Customers} = \text{Clicks} \times \left(\frac{\text{Effective Customer CVR}}{100}\right)$$
- If a two-stage funnel is configured with leads as the qualifying gate:
  $$\text{Customers} = \text{Leads} \times \left(\frac{\text{Lead-to-Customer CVR}}{100}\right)$$
- **Boundary Safeguard**: $0 \le \text{Customers} \le \text{Clicks}$.

### Step 5: Attributed Revenue
$$\text{Revenue} = \text{Customers} \times \text{Average Order Value (AOV)}$$

### Step 6: Gross Profit (Contribution Margin)
$$\text{Gross Profit} = \text{Revenue} \times \left(\frac{\text{Gross Margin } \%}{100}\right)$$
- When gross margin % is unspecified, top-line revenue is reported and profit-based metrics indicate `N/A`.

---

## 2. Efficiency & Capital Return Formulas

### 2.1 Cost Per Click (CPC)
$$\text{CPC} = \frac{\text{Ad Spend}}{\text{Clicks}}$$
- If $\text{Clicks} = 0$, $\text{CPC} = 0$.

### 2.2 Cost Per Mille (CPM)
$$\text{CPM} = \left(\frac{\text{Ad Spend}}{\text{Impressions}}\right) \times 1,000$$

### 2.3 Direct Cost Per Acquisition (Direct CPA)
$$\text{Direct CPA} = \frac{\text{Ad Spend}}{\text{Customers}}$$
- Measures auction media efficiency alone.

### 2.4 Fully Loaded Cost Per Acquisition (Fully Loaded CPA)
$$\text{Fully Loaded CPA} = \frac{\text{Total Campaign Investment}}{\text{Customers}}$$
- Includes media spend + creative production + agency fees + software tools. Represents true operational cost to acquire a paying customer.

### 2.5 Return on Ad Spend (ROAS)
$$\text{ROAS} = \frac{\text{Attributed Revenue}}{\text{Ad Spend}}$$
- Stated strictly as a **ratio multiplier** (e.g., `3.50x`), never as a percentage.
- Denominator is strictly **media ad spend**.

### 2.6 Return on Investment — Revenue Basis ($\text{ROI}_{\text{rev}}$)
$$\text{ROI}_{\text{rev}} = \left(\frac{\text{Attributed Revenue} - \text{Total Campaign Investment}}{\text{Total Campaign Investment}}\right) \times 100$$
- Expressed as a **percentage** (`%`).
- $0\%$ represents top-line cash break-even.

### 2.7 Return on Investment — Profit Basis ($\text{ROI}_{\text{profit}}$)
$$\text{ROI}_{\text{profit}} = \left(\frac{\text{Gross Profit} - \text{Total Campaign Investment}}{\text{Total Campaign Investment}}\right) \times 100$$
- The definitive metric for true enterprise value creation. Factors in product Cost of Goods Sold (COGS).

### 2.8 Net Financial Return
$$\text{Net Return} = \begin{cases} 
\text{Gross Profit} - \text{Total Campaign Investment} & \text{if Gross Margin is provided} \\
\text{Revenue} - \text{Total Campaign Investment} & \text{if Gross Margin is omitted}
\end{cases}$$

---

## 3. Multiplier Matrix for Scenarios

The platform applies mathematical multipliers across three operational tiers:

| Parameter | Conservative Multiplier | Balanced Multiplier | Optimistic Multiplier | Strategic Rationale |
| :--- | :---: | :---: | :---: | :--- |
| **CPM** | `× 1.20` (+20%) | `× 1.00` (Base) | `× 0.85` (-15%) | Reflects competitive bid auction density and algorithmic delivery penalties. |
| **CTR** | `× 0.75` (-25%) | `× 1.00` (Base) | `× 1.25` (+25%) | Reflects ad creative hook strength, fatigue, and copy relevance. |
| **CVR** | `× 0.70` (-30%) | `× 1.00` (Base) | `× 1.25` (+25%) | Reflects landing page speed, checkout friction, and offer resonance. |

---

## 4. Assumption Source Categorization

To maintain data transparency, every performance parameter must be tagged with one of four explicit sources:
1. `actual`: Directly recorded data from connected or verified live campaign history.
2. `historical`: Past performance data manually entered from previous campaign records.
3. `benchmark`: Published, verified industry benchmarks (e.g., LocaliQ, Mailchimp, Shopify).
4. `assumption`: User-estimated hypothesis requiring live validation.

