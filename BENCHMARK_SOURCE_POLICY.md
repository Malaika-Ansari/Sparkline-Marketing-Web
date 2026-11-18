# Benchmark Source Policy & Industry Evidence Standards

**Sparkline Marketing Platform — Data Integrity & Research Governance**  
*Document Version: 1.0.0 • Phase 14 Architecture*

---

## 1. Grounding Principles & Anti-Hallucination Policy

A fundamental failure mode in marketing software is quoting unsourced or fabricated "industry averages" (e.g., claiming "the average B2B conversion rate is 12%" without context). Marketing conditions vary drastically by geography, industry vertical, seasonality, price point, and audience intent.

Sparkline enforces a strict **Benchmark Grounding Policy**:

1. **No Fabricated Benchmarks**: Every industry benchmark presented in the platform must cite a reputable, verifiable research institution or data provider.
2. **Transparent Reporting Periods**: All cited benchmarks must state their publication or measurement year (e.g., *LocaliQ 2024 Search Ads Benchmark Report*).
3. **Explicit Scope & Context**: Figures must state whether they apply to cross-industry medians, specific channels (Google Ads Search vs. Meta Ads vs. LinkedIn Ads), or specific campaign formats.
4. **Honest Integration Disclosure**: If the user's workspace does not have direct, connected API integrations with their advertising platforms, Sparkline transparently informs the user that benchmarks are external reference points, and that their own historical baseline should guide primary decisions.

---

## 2. Verified Industry Benchmark Registry

The platform currently incorporates verified reference benchmarks across key performance indicators:

### 2.1 Google Search Ads (LocaliQ / WordStream)
- **Metric**: Click-Through Rate (CTR)
  - **Cross-Industry Average**: $6.11\%$
  - **Top Performing Quartile**: $>8.50\%$
  - **Bottom Quartile**: $<3.50\%$
- **Metric**: Cost Per Click (CPC)
  - **Cross-Industry Average**: $\$4.22$
  - **Top Performing Quartile**: $<\$2.50$
  - **Bottom Quartile**: $>\$7.00$
- **Metric**: Conversion Rate (CVR)
  - **Cross-Industry Average**: $7.04\%$
  - **Top Performing Quartile**: $>10.00\%$
  - **Bottom Quartile**: $<3.50\%$
- **Source**: *LocaliQ Search Advertising Benchmarks 2024* (analyzing over 17,000 active campaigns across North America).
- **Source URL**: `https://localiq.com/blog/search-advertising-benchmarks/`
- **Methodology**: Analyzed millions of search impressions and clicks across 23 vertical industries. Excludes branded navigation campaigns to prevent artificial skewing.

---

### 2.2 Paid Social Advertising (Meta & Gupta Media)
- **Metric**: Cost Per Mille (CPM)
  - **Cross-Industry Average**: $\$11.50$
  - **Top Performing Quartile**: $<\$7.00$
  - **Bottom Quartile**: $>\$18.00$
- **Metric**: Return on Ad Spend (ROAS)
  - **Cross-Industry Average**: $2.80\text{x}$
  - **Top Performing Quartile**: $>4.00\text{x}$
  - **Bottom Quartile**: $<1.80\text{x}$
- **Source**: *Gupta Media Social Media Ad Rates Tracker (2024)* & *Meta Business Marketing Insights*.
- **Source URL**: `https://www.guptamedia.com/cpm/`
- **Methodology**: Aggregated programmatic and social feed auction clears across North America and Europe, normalizing for holiday Q4 bid inflation.

---

### 2.3 Email Marketing (Mailchimp)
- **Metric**: Email Open Rate
  - **Cross-Industry Average**: $21.33\%$
  - **Top Performing Quartile**: $>28.00\%$
  - **Bottom Quartile**: $<15.00\%$
- **Metric**: Email Click Rate (Click-to-Delivered)
  - **Cross-Industry Average**: $2.62\%$
  - **Top Performing Quartile**: $>4.00\%$
  - **Bottom Quartile**: $<1.20\%$
- **Source**: *Mailchimp Email Marketing Benchmarks 2024*.
- **Source URL**: `https://mailchimp.com/resources/email-marketing-benchmarks/`
- **Telemetry Caveat**: Measured post-Apple Mail Privacy Protection (iOS 15+). Mailchimp methodology notes that automated machine opens contribute to cross-industry open rate inflation, highlighting Click-to-Delivered as the definitive engagement indicator.

---

### 2.4 E-commerce & Direct-to-Consumer (Shopify)
- **Metric**: Website Conversion Rate (CVR)
  - **Cross-Industry Average**: $2.10\%$
  - **Top Performing Quartile**: $>3.80\%$
  - **Bottom Quartile**: $<1.00\%$
- **Metric**: Customer Lifetime Value to CAC Ratio ($\text{LTV}:\text{CAC}$)
  - **Healthy Target**: $\ge 3.00\text{x}$
  - **Optimal Target**: $3.00\text{x} - 4.50\text{x}$
  - **Capital Destructive**: $<1.00\text{x}$
- **Source**: *Shopify Commerce Intelligence Report (2024)*.
- **Source URL**: `https://www.shopify.com/blog/ecommerce-conversion-rate`
- **Methodology**: Median conversion rate calculated across millions of online storefront transactions worldwide.

---

## 3. Live Account Disclaimers & Workspace User Guidance

In the platform UI at `/dashboard/metrics`, when viewing the **Verified Benchmarks** tab, Sparkline presents the following mandatory grounding banner:

> **Benchmark Data Grounding Notice**  
> *Industry averages vary significantly by seasonal ad auction density, creative quality, audience purchasing power, and regional economic conditions. Sparkline displays published third-party reference data with verified source citations. If your live advertising and analytics accounts are not connected, treat these figures as external reference boundaries and use your own project historical performance as your primary operational benchmark.*

### 3.1 Future Live Telemetry Roadmap
When advertising API connectors (Google Ads API, Meta Marketing API, LinkedIn Marketing API, GA4 Data API) are activated in future releases, benchmark comparisons will automatically split into:
1. **Live Account Baseline**: Your actual trailing 30-day average.
2. **Industry Cohort**: Anonymized peers in your specific vertical and spend tier.
3. **Verified Third-Party Index**: Published external research.

