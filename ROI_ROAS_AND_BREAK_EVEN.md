# ROI, ROAS & Break-Even Economics Guide

**Sparkline Marketing Platform — Financial Measurement & Capital Protection**  
*Document Version: 1.0.0 • Phase 15 Architecture*

---

## 1. The Critical Distinction: ROAS vs. ROI

A frequent cause of financial failure in digital marketing is confusing **Return on Ad Spend (ROAS)** with **Return on Investment (ROI)**. 

### Why Confusing ROAS and ROI Destroys Capital

Consider a campaign with:
- **Total Campaign Investment**: $\$10,000$ (Ad Spend: $\$8,000$; Creative & Agency: $\$2,000$)
- **Gross Revenue Generated**: $\$24,000$
- **Product Gross Margin**: $30\%$ (Cost of Goods Sold = $70\%$)

#### The Misleading "ROAS" View:
$$\text{ROAS} = \frac{\$24,000}{\$8,000} = 3.00\text{x}$$
An inexperienced marketer sees a "3x ROAS" and assumes the campaign was highly profitable.

#### The True Financial "ROI" View:
1. Gross Revenue: $\$24,000$
2. Cost of Goods Sold ($70\%$): $-\$16,800$
3. Gross Profit Contribution: $\$7,200$
4. Total Campaign Investment: $-\$10,000$
5. **Net Financial Result**: $-\$2,800$ (Capital Loss)
6. **Profit-Based ROI**:
   $$\text{ROI}_{\text{profit}} = \left(\frac{\$7,200 - \$10,000}{\$10,000}\right) \times 100 = -28.00\%$$

**Conclusion**: Despite a "3x ROAS", the company lost $\$2,800$. Sparkline eliminates this trap by calculating both metrics explicitly and enforcing profit-based break-even economics.

---

## 2. Mathematical Comparison Matrix

| Property | Return on Ad Spend (ROAS) | Return on Investment (ROI) |
| :--- | :--- | :--- |
| **Output Format** | Ratio Multiplier (`4.00x`) | Percentage (`+45.0%` or `-20.0%`) |
| **Denominator** | Strictly Paid Media Ad Spend | Total Campaign Investment (Media + Tools + Agency + Creative) |
| **Numerator** | Gross Attributed Revenue | Net Return (Gross Profit or Revenue minus Investment) |
| **Break-Even Standard** | Depends on gross product margin | Always $0.0\%$ |
| **Primary Use Case** | Channel bidding efficiency & auction pacing | Enterprise financial accounting & board reporting |

---

## 3. Break-Even Analysis Engine

The break-even calculator in `/dashboard/forecast` determines the exact operational thresholds required to avoid cash loss:

### 3.1 Break-Even Revenue ($\text{Rev}_{\text{be}}$)
When gross margin is provided:
$$\text{Rev}_{\text{be}} = \frac{\text{Total Campaign Investment}}{\frac{\text{Gross Margin } \%}{100}}$$
When gross margin is omitted:
$$\text{Rev}_{\text{be}} = \text{Total Campaign Investment}$$

### 3.2 Break-Even Number of Customers ($N_{\text{be}}$)
$$N_{\text{be}} = \left\lceil \frac{\text{Rev}_{\text{be}}}{\text{AOV}} \right\rceil$$

### 3.3 Break-Even ROAS on Media Spend ($\text{ROAS}_{\text{be}}$)
$$\text{ROAS}_{\text{be}} = \frac{\text{Rev}_{\text{be}}}{\text{Ad Spend}}$$
If ad spend equals total investment and gross margin is $M\%$, this simplifies to the canonical threshold:
$$\text{ROAS}_{\text{be}} = \frac{1}{\frac{M}{100}}$$
- *Example*: At a $50\%$ gross margin, break-even ROAS is $1 / 0.50 = 2.00\text{x}$. At a $20\%$ gross margin, break-even ROAS is $1 / 0.20 = 5.00\text{x}$.

### 3.4 Maximum Allowable CPA ($\text{CPA}_{\text{max}}$)
$$\text{CPA}_{\text{max}} = \text{AOV} \times \left(\frac{\text{Gross Margin } \%}{100}\right)$$
- If your fully loaded customer acquisition cost exceeds this figure, you are losing money on the initial transaction.

### 3.5 Required Conversion Rate ($\text{CVR}_{\text{req}}$)
$$\text{CVR}_{\text{req}} = \left(\frac{N_{\text{be}}}{\text{Estimated Clicks}}\right) \times 100$$
- If the required conversion rate exceeds realistic industry benchmarks (e.g., needing a $15\%$ conversion rate in competitive e-commerce), the campaign configuration is structurally unviable and requires either a higher AOV or lower traffic acquisition costs.

