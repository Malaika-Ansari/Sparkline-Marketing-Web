# Third-Party Marketing Platform API Limitations & Quotas

> **Sparkline Marketing Intelligence & Strategy Platform — Phase 23**

---

## 1. Overview

Each connected advertising and analytics platform imposes distinct rate limits, quota tiers, attribution windows, and developer portal verification requirements. This document details the exact technical constraints governing each supported connector.

---

## 2. Platform API Constraints & Quota Matrix

| Provider & API Version | Rate Limits & Quotas | Native Attribution Window | Developer Verification Tier |
| :--- | :--- | :--- | :--- |
| **Meta Marketing API (v19.0)** | Standard Tier: 200 calls/hour per ad account. Call volume throttled dynamically based on app CPU/time metrics. | 7-day click, 1-day view (Default). 28-day click deprecated. | Requires Business Verification and App Review for `ads_read` and `read_insights`. |
| **Google Ads API (v16)** | Standard Access: 15,000 operations/day. Test Accounts: 15,000 ops/day. Production requires Standard Token. | Data-driven attribution (DDA) or Last Click across search paths. | Requires Google Cloud Project, OAuth Consent Screen, and approved Developer Token. |
| **TikTok Marketing API** | 10 requests per second (RPS) per developer application. Max 10,000 calls per 24 hours. | 7-day click, 1-day view. | Requires TikTok for Business Developer account approval. |
| **LinkedIn Marketing Platform** | 500 requests per minute per developer app. Lead Sync API throttled at 100 req/min. | 30-day click, 1-day view (Default). | Requires Marketing Developer Platform (MDP) application review. |
| **Google Analytics 4 (Data API v1)** | 10,000 tokens per hour per property. Max 10 concurrent requests. | Last non-direct click across cross-channel sessions. | Requires Google Cloud OAuth 2.0 Web Client with `analytics.readonly` scope. |
| **Google Search Console API** | 1,200 QPM (queries per minute) per project. Max 50,000 rows per query. | SERP-level organic impression and click recording. | Requires verified domain property ownership in Search Console. |
| **X / Twitter API (v2)** | Basic Tier: 10,000 tweets read/month. Pro Tier: 1,000,000 tweets/month. | Native post interaction tracking (24-hour cycle). | Requires X Developer Portal App with elevated user context. |
| **YouTube Analytics API (v2)** | 10,000 units per day quota allocation. Analytics reports consume 1-5 units per call. | Lifetime channel and video watch metrics. | Requires Google Cloud Project and YouTube Channel Owner authorization. |

---

## 3. Rate Limit Handling & Exponential Backoff

To prevent API bans and service disruptions when synchronizing multiple accounts, Sparkline's ingestion worker implements truncated binary exponential backoff with jitter:

$$T_{\text{wait}} = \min(T_{\max}, 2^{\text{attempt}} \times 1000\text{ms}) \pm \text{RandomJitter}(0, 500\text{ms})$$

When an HTTP 429 (`Too Many Requests`) is received:
1. The request immediately halts.
2. The retry header (`Retry-After`) is inspected if returned by the platform.
3. If no header is provided, the worker backs off exponentially for up to 3 attempts.
4. If limits persist, the sync job terminates with status `sync_failed` and records the next retry timestamp.

---

## 4. Attribution Discrepancies Between Platforms

It is standard in digital marketing for the sum of platform-reported conversions to exceed total actual orders. For example:
- A user clicks a Google Ad on Monday and a Meta Ad on Wednesday before purchasing.
- Both Meta (7-day click) and Google (last touch/DDA) will claim credit for the sale.
- Sparkline displays platform metrics alongside their **Attribution Definition** and calculates an unduplicated **Blended ROAS** to prevent double-counting.

