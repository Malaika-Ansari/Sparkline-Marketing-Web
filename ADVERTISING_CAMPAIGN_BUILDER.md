# Advertising Campaign Builder & Studio

The **Advertising Campaign Studio** (`/dashboard/campaigns`) in Sparkline Marketing is an end-to-end multi-platform campaign planning, ad creation, strategy generation, and performance optimization workspace. It equips growth marketers, agencies, and founders with structured workflows to design, validate, and measure multi-channel advertising campaigns across **Meta Ads**, **Google Ads**, **TikTok Ads**, **LinkedIn Ads**, **YouTube Ads**, and **Pinterest Ads**.

---

## 1. Core Architecture & Capabilities

```
+----------------------------------------------------------------------------------------------------+
|                                    Advertising Campaign Studio                                     |
|                                       (/dashboard/campaigns)                                       |
+----------------------------------------------------------------------------------------------------+
       |                     |                     |                     |                     |
       v                     v                     v                     v                     v
[ Campaigns Library ] [ Flight Calendar ] [ Copy Generator ] [ Brief Studio ]  [ Optimization Center ]
  - Filter & Search     - Timeline View     - 6 Angles         - Creative Specs   - Manual Metric Log
  - AI Strategy Plan    - Flight Dates      - Char Validation  - Deliverable Grid - Diagnostic Engine
  - Platform Hierarchy  - Phase Deadlines   - Multi-Platform   - Export Markdown  - 6 Rule-Based Checks
  - CSV / JSON Export
```

### Key Pillars
1. **Multi-Platform Hierarchy Awareness**:
   - Accurately models the structural differences of major advertising networks:
     - **Meta Ads**: `Campaign` &rarr; `Ad Set` &rarr; `Ad`
     - **Google Ads & TikTok Ads**: `Campaign` &rarr; `Ad Group` &rarr; `Ad`
     - **LinkedIn Ads**: `Campaign Group` &rarr; `Campaign` &rarr; `Ad Creative`
2. **6-Step Interactive Creation Wizard**:
   - Guided flow with live validation, currency handling, platform format selection, audience targeting, and budget division.
3. **AI Campaign Strategy Assistant**:
   - Server-side Gemini proxy (`/api/generate-campaign-plan`) generating a structured 13-point strategic plan with objective rationale, platform mix, target audience nuances, creative direction, testing hooks, and risk mitigation.
4. **Ad Copy Generation Engine**:
   - Produces 6 distinct messaging angles: *Benefit-Focused*, *Problem-Solution*, *Emotional*, *Promotional*, *Educational*, and *Trust-Building*, with platform-specific character limit enforcement.
5. **Creative Brief Studio**:
   - Generates production-ready creative briefs detailing asset dimensions, aspect ratios, visual hooks, copy, and brand guidelines for designers and video editors.
6. **Performance & Diagnostic Center**:
   - Computes deterministic marketing formulas (CTR, CPC, CPM, CPA, CPL, CVR, ROAS, ROI) and triggers rule-based optimization warnings for high CPC, low CTR, creative fatigue, and funnel drop-off.
7. **Starter Campaign Templates**:
   - 8 curated, battle-tested templates pre-configured for product launches, DTC conversions, B2B lead generation, omnichannel reach, high-intent search, local traffic, seasonal flash sales, and retargeting.

---

## 2. 6-Step Interactive Campaign Wizard

The wizard provides an intuitive modal flow to construct robust campaigns from scratch or from templates:

### Step 1: Campaign Basics
- **Fields**: Campaign Name, Associated Marketing Project, Product/Service Name, Description, Industry, Geographic Location, Primary Objective (across 8 standard objectives), Target Start/End Dates, Initial Status (*Draft*, *Planned*, *Active*, *Paused*, *Completed*).
- **Validation**: Requires campaign name, product/service name, and project linkage.

### Step 2: Advertising Platforms
- **Supported Platforms**: Meta Ads, Google Ads, TikTok Ads, LinkedIn Ads, YouTube Ads, Pinterest Ads.
- **Guidance Notice**: Visual badges and platform architecture highlights. Explains format suitability (e.g., Short-form video for TikTok, search intent for Google, B2B seniority filters for LinkedIn).
- **Integration Policy**: Explicitly informs the user that Sparkline operates as an offline campaign planner and strategy studio; live campaign publishing requires authenticated network API credentials.

### Step 3: Audience Targeting
- **Fields**: Target Country/Region, Age Range (Min/Max), Customer Type (*B2B*, *B2C*, *D2C*), Interests & Behaviors, Audience Needs, Key Pain Points, Language, Exclusions, and Custom Notes.
- **Data Integrity**: Clearly labels AI suggestions versus user-verified audience records.

### Step 4: Budget & Schedule
- **Financial Controls**: Total Budget, Direct Ad Spend, Testing Budget, Creative Production Budget, Currency Selection (USD, EUR, GBP, CAD, AUD, PKR, INR, AED, SAR).
- **Pacing**: Daily vs. Lifetime budget pacing, duration in days, and per-platform budget allocations.
- **Safety Checks**: Visual validation alerts if the sum of platform allocations or auxiliary budgets exceeds the total budget ceiling.

### Step 5: Ad Creative & Messaging
- **Format Options**: Single Image, Video, Carousel, Story / Vertical Video, Collection / Product Catalog.
- **Creative Elements**: Primary Ad Headline, Primary Ad Text, Description, Call-to-Action (CTA), Destination Landing Page URL, Brand Tone, Unique Selling Proposition (USP), and Key Proof Points.
- **Character Guidance**: Real-time counter and indicator against network limits (e.g., Meta 40-char headline, Google 30-char headline).

### Step 6: Review & Finalize
- **Validation Summary**: Displays all configuration parameters, budget splits, and audience selections with inline jump links to edit any step.
- **Unique Identifier**: Generates an immutable, traceable ID (`camp-[timestamp]-[random]`).
- **Persistence**: Persists immediately to browser LocalStorage under `sparkline_marketing_campaigns`.

---

## 3. Platform Hierarchy Comparison

| Platform | Tier 1 (Account / Group) | Tier 2 (Targeting / Set) | Tier 3 (Asset / Creative) | Primary Bidding Focus |
| :--- | :--- | :--- | :--- | :--- |
| **Meta Ads** | Campaign | Ad Set | Ad | Lowest Cost, Bid Cap, Cost Cap |
| **Google Ads** | Campaign | Ad Group | Ad | Maximize Conversions, Target CPA, Target ROAS |
| **TikTok Ads** | Campaign | Ad Group | Ad | Lowest Cost, Cost Cap, Max Conversion |
| **LinkedIn Ads** | Campaign Group | Campaign | Ad Creative | Maximum Delivery, Target Cost, Manual CPC |
| **YouTube Ads** | Google Ads Campaign | Ad Group | Video Ad | Target CPV, Target CPM, Maximize Conversions |
| **Pinterest Ads** | Campaign | Ad Group | Pin (Ad) | Automatic Bid, Maximize Clicks |

---

## 4. 8 Starter Campaign Templates

Marketers can launch pre-structured campaigns with a single click:

1. **New Product Launch**: High-impact multi-channel awareness and conversion blitz combining Meta, YouTube, and Google Ads.
2. **E-commerce DTC Conversion**: Full-funnel DTC conversion engine featuring single image ads, dynamic carousel catalogs, and retargeting hooks.
3. **B2B Enterprise Lead Engine**: High-intent LinkedIn sponsored content and Google search ads targeting decision-makers, VPs, and Directors.
4. **Omni-Channel Brand Reach**: Scaled multi-platform brand visibility campaign across Meta, TikTok, and YouTube.
5. **High-Intent Search Traffic**: Precision Google Ads search campaign focusing on bottom-of-funnel commercial keywords.
6. **Local Foot Traffic & Retail**: Geofenced Meta and Google Local Ads driving in-store visits and proximity footfall.
7. **Seasonal Flash Sale**: Time-sensitive urgency promotion for Black Friday, Cyber Week, or holiday clearance.
8. **Retargeting & Abandoned Cart Recovery**: High-margin conversion recovery sequence targeting warm visitors and abandoned carts.

---

## 5. Performance Tracking & Diagnostic Engine

The Performance Center computes critical advertising metrics deterministically:

$$\text{CTR} = \left(\frac{\text{Clicks}}{\text{Impressions}}\right) \times 100$$

$$\text{CPC} = \frac{\text{Spend}}{\text{Clicks}}$$

$$\text{CPM} = \left(\frac{\text{Spend}}{\text{Impressions}}\right) \times 1000$$

$$\text{CVR} = \left(\frac{\text{Conversions}}{\text{Clicks}}\right) \times 100$$

$$\text{CPA} = \frac{\text{Spend}}{\text{Conversions}}$$

$$\text{ROAS} = \frac{\text{Revenue}}{\text{Spend}}$$

$$\text{ROI} = \left(\frac{\text{Revenue} - \text{Spend}}{\text{Spend}}\right) \times 100$$

### Rule-Based Diagnostic System
- **High Cost Per Click (CPC)**: Flags if CPC exceeds benchmark (\$3.50); recommends narrowing keyword match types or testing higher-CTR creative.
- **Low Click-Through Rate (CTR)**: Flags if CTR falls below 1.0%; triggers advice to overhaul hook visual and headline.
- **High Cost Per Acquisition (CPA)**: Flags if CPA exceeds target (\$65.00); recommends landing page conversion rate optimization and offer auditing.
- **Low Conversion Rate (CVR)**: Flags if CVR falls below 2.0%; highlights disconnect between ad promise and landing page experience.
- **Creative Fatigue**: Detects high impression-to-conversion ratios; advises refreshing ad creative assets.
- **Budget Imbalance**: Warns when media ad spend exceeds planned budget limits.

