# Advertising Campaign Multi-Platform Guide

This guide details the ad format requirements, bidding strategies, hierarchy definitions, and operational nuances for the 6 advertising platforms supported in Sparkline Marketing's Advertising Campaign Studio.

---

## 1. Multi-Platform Specifications & Dimensions

| Platform | Primary Ad Formats | Recommended Dimensions | Max File Size | Video Duration |
| :--- | :--- | :--- | :--- | :--- |
| **Meta Ads** (Facebook & Instagram) | Single Image, Video, Carousel, Stories/Reels | 1080x1080 (1:1), 1080x1920 (9:16), 1200x628 (1.91:1) | 30 MB (Img), 4 GB (Vid) | 1 sec – 240 mins (15–60s rec.) |
| **Google Ads** (Search, Display, Performance Max) | Responsive Search, Responsive Display, PMax Assets | 1200x628 (1.91:1), 1200x1200 (1:1), 960x1200 (4:5) | 5 MB (Img) | N/A (Search), 10s–3 mins (Vid) |
| **TikTok Ads** | In-Feed Video, Spark Ads, Carousel Images | 1080x1920 (9:16 vertical required) | 500 MB (Vid) | 5 sec – 60 sec (9–15s rec.) |
| **LinkedIn Ads** | Sponsored Content, Message Ad, Carousel, Lead Gen | 1200x627 (1.91:1), 1080x1080 (1:1) | 5 MB (Img), 200 MB (Vid) | 3 sec – 30 mins (15–30s rec.) |
| **YouTube Ads** | In-Stream Skippable, Non-Skippable, Shorts Ads | 1920x1080 (16:9), 1080x1920 (9:16 Shorts) | Hosted on YouTube | Skippable: any; Non-skip: 15–20s; Shorts: 15–60s |
| **Pinterest Ads** | Standard Pin, Video Pin, Carousel Pin, Idea Pin | 1000x1500 (2:3 aspect ratio recommended) | 20 MB (Img), 2 GB (Vid) | 4 sec – 15 mins (6–15s rec.) |

---

## 2. Platform Hierarchy Architecture

In Sparkline Marketing, campaigns are modeled to respect the structural terminology and grouping paradigms of each ad network:

### Meta Ads (Facebook / Instagram)
- **Level 1 — Campaign**: Sets the business objective (Sales, Leads, Traffic, Awareness) and overall budget (Advantage Campaign Budget / CBO).
- **Level 2 — Ad Set**: Governs targeting (custom audiences, lookalikes, interest/behavior clusters), placements (Instagram Feed, Stories, Facebook Reels, Messenger), schedule, and bid control.
- **Level 3 — Ad**: Contains creative media (image/video), headline, primary copy, and CTA button.

### Google Ads
- **Level 1 — Campaign**: Defines campaign type (Search, Performance Max, Display, Video), target countries/languages, daily budget, and bidding strategy (tCPA, tROAS).
- **Level 2 — Ad Group**: Aggregates themed keywords (exact, phrase, broad) or audience segments.
- **Level 3 — Ad**: Responsive Search Ads (up to 15 headlines, 4 descriptions) or Responsive Display Ads with dynamic image assets.

### TikTok Ads
- **Level 1 — Campaign**: Designates conversion objective (Conversions, Lead Generation, App Install, Traffic) and campaign budget optimization.
- **Level 2 — Ad Group**: Specifies target demographics (operating system, age, device, creator interactions), placements (TikTok feed, Pangle), daily pacing, and frequency cap.
- **Level 3 — Ad**: Vertical 9:16 video creative, sound track, caption (up to 100 characters), and interactive add-ons.

### LinkedIn Ads
- **Level 1 — Campaign Group**: High-level organizational folder to group multiple campaigns and set overall group budgets.
- **Level 2 — Campaign**: Houses B2B targeting filters (Job Function, Seniority, Company Industry, Company Headcount, Skills), objective (Lead Gen Form, Website Visits), and bidding strategy.
- **Level 3 — Ad Creative**: Sponsored single image, video post, carousel card, or conversational message ad.

### YouTube Ads (via Google Ads)
- **Level 1 — Campaign**: Video objective (Awareness, Consideration, Action) and bidding (Target CPM, Target CPV, Maximize Conversions).
- **Level 2 — Ad Group**: Topic targeting, channel placements, affinity audiences, or customer match lists.
- **Level 3 — Video Ad**: YouTube-hosted video URL, companion banner, headline (15 chars), call-to-action (10 chars).

### Pinterest Ads
- **Level 1 — Campaign**: Objective (Brand Awareness, Consideration, Conversions, Catalog Sales).
- **Level 2 — Ad Group**: Keyword search intent, interest graph targeting, placement (Browse vs. Search), and daily bid.
- **Level 3 — Pin**: Creative pin image/video, pin title (100 chars), pin description (500 chars), and destination link.

---

## 3. Platform Bidding Strategy Guide

```
+-------------------+-------------------------------------------------------------+------------------------------------+
| Platform          | Bidding Model                                               | Optimal Use Case                   |
+-------------------+-------------------------------------------------------------+------------------------------------+
| Meta Ads          | Lowest Cost (Auto Bid)                                      | Max volume during testing          |
| Meta Ads          | Cost Cap / Bid Cap                                          | Tight unit economics, scaling      |
| Google Ads        | Maximize Conversions                                        | Starting search campaigns          |
| Google Ads        | Target CPA (tCPA) / Target ROAS (tROAS)                     | Predictable ROI after 30+ convs    |
| TikTok Ads        | Lowest Cost / Max Conversion                                | Algorithmic creative exploration   |
| TikTok Ads        | Cost Cap                                                    | High spend stability               |
| LinkedIn Ads      | Maximum Delivery (Automated)                                | Brand awareness & impressions      |
| LinkedIn Ads      | Manual CPC Bidding                                          | High-intent B2B clicks             |
| YouTube Ads       | Target CPV (Cost Per View)                                  | In-depth video engagement          |
| YouTube Ads       | Maximize Conversions (Action Campaigns)                     | Lead generation & sales            |
| Pinterest Ads     | Automatic Bidding                                           | Fast discovery & audience learning |
| Pinterest Ads     | Custom Maximum Bid                                          | Profitable catalog shopping        |
+-------------------+-------------------------------------------------------------+------------------------------------+
```

---

## 4. Platform Creative Testing Methodology

To prevent ad fatigue and identify winning creative assets systematically, Sparkline recommends the **3x3 Testing Matrix**:

1. **3 Visual Concepts**: Product-in-Action Demo, Customer Testimonial / UGC, Bold Typography / Offer Callout.
2. **3 Messaging Angles**: Benefit-Focused, Problem-Solution, and Social Proof / Educational.
3. **Execution**:
   - Launch in an isolated testing Ad Set / Ad Group with 15–20% of total campaign budget.
   - Run for a minimum of 4–7 days or until each variant receives $\ge 1,000$ impressions and 50 clicks.
   - Graduate winning creative combinations to the core scaling campaign.

