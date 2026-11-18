# Social Media & Content Creation Studio

The **Social Media & Content Creation Studio** (`/dashboard/content-studio`) in Sparkline Marketing is an end-to-end multi-platform content workspace designed to generate, repurpose, schedule, and optimize strategic brand content across **Instagram**, **Facebook**, **LinkedIn**, **TikTok**, **YouTube**, **Pinterest**, and **X**.

---

## 1. Core Architecture & Workspaces

```
+--------------------------------------------------------------------------------------------------------+
|                                    Social Media & Content Studio                                       |
|                                     (/dashboard/content-studio)                                        |
+--------------------------------------------------------------------------------------------------------+
       |                  |                  |                  |                  |                  |
       v                  v                  v                  v                  v                  v
[ Post Generator ] [ Content Cal ]   [ Idea Engine ]   [ Copy Assistant ] [ Hashtags Hub ]  [ Repurposing ]
  - 3 AI Variations  - Month / List    - 7 Categories    - Polish/Rewrite   - 5 Clusters      - Multi-Format
  - Format Limits    - Drag/Reschedule - Hook & Visual   - Hook Optimizer   - AI Suggestions  - 1-to-4 Adapt
  - Visual Direct    - Safe Planning   - Convert to Post - Urdu / Roman FX  - Copy Sets       - Tone Shield
```

### Key Pillars
1. **Strategic Content Setup**: Grounded in active marketing project data (brand identity, product economics, target audience psychology, and commercial milestones).
2. **AI Social Media Post Generator**: Produces 3 platform-tailored variations with opening hooks, body copy, CTAs, hashtags, character counters, and visual direction.
3. **Interactive Content Calendar**: Monthly grid and list view for scheduling, drafting, approving, and organizing content by campaign.
4. **Content Idea Generator**: 7-category brainstorming matrix (Educational, Promotional, Entertaining, Inspirational, Conversational, Authority Building, Community Building) with one-click conversion to post drafts.
5. **Caption & Copywriting Assistant**: Dual-pane editor with 10 instant transformations: Rewrite, Shorten, Expand, Improve Hook, Change Tone, Add CTA, Translate to Urdu, Translate to Roman Urdu, Translate to English, and Improve Readability.
6. **Hashtag Research Workspace**: Categorizes tags across Broad Topic, Niche, Product, Audience, and Campaign clusters with transparent AI disclosures.
7. **Omni-Channel Repurposing Engine**: Converts a single source asset (Blog, Webinar notes, Product description, Long video) into platform-native adaptations for LinkedIn, Instagram, TikTok, and X.
8. **Video Script & Carousel Studio**: Scene-by-scene script builder with spoken dialogue and on-screen text, paired with a multi-slide carousel builder and live slide previewer.
9. **Brand Voice Calibration**: Reusable project guidelines governing tone, preferred vocabulary, phrases to avoid, and communication preferences.
10. **Content Performance Center**: Empirical logging of reach, impressions, likes, comments, shares, saves, clicks, and conversions, calculating Engagement Rate, CTR, and CVR with zero fabricated stats.

---

## 2. Platform Optimization Specifications

| Platform | Primary Formats | Optimal Caption Length | Visual Format | Hashtag Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Instagram** | Carousel, Reels, Single Post, Stories | 125–250 characters (Fold at 125) | 1:1 Square, 4:5 Portrait, 9:16 Reel | 3–5 targeted niche hashtags |
| **Facebook** | Community Discussions, Video, Links | 80–150 characters | 1.91:1 Horizontal, 1:1 Square | 0–2 broad tags |
| **LinkedIn** | Thought Leadership, Case Studies | 150–300 words (Fold at 150 chars) | Document Carousels, 1.91:1, Text-only | 3–5 professional industry tags |
| **TikTok** | Fast-Hook Short Video (15–30s) | 60–100 characters | 9:16 Vertical Fullscreen | 3–5 trend/niche tags |
| **YouTube** | Long-form Tutorials, Shorts | Titles $\le 60$ chars, Desc $\ge 250$ words | 16:9 Thumbnail, 9:16 Shorts | 3 primary tags in description |
| **Pinterest** | Infographics, Idea Pins, How-To Pins | Titles $\le 100$ chars, Desc $\le 500$ chars | 2:3 Vertical (1000x1500) | 2–5 search-intent keyword tags |
| **X (Twitter)**| Single Posts, Tactical Breakdown Threads | 280 characters per tweet | 16:9 Image, Video, Thread Cards | 1–2 focused campaign tags |

---

## 3. Data Integrity & Persistence Architecture

- **Post Library**: Persisted under `sparkline_content_posts` in browser LocalStorage.
- **Content Ideas**: Persisted under `sparkline_content_ideas`.
- **Brand Voices**: Persisted under `sparkline_brand_voices` keyed by project ID.
- **Export Standards**: One-click CSV export formats full metadata, flight dates, hooks, copy, and performance metrics.
- **Safe Sandbox Mode**: Clearly states that Sparkline functions as a strategic planning studio and does not initiate automated live platform publishing without authenticated API credentials.

