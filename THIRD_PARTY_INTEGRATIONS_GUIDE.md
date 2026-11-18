# Third-Party Integrations & Data Connectors Guide

> **Sparkline Marketing Intelligence & Strategy Platform — Phase 23**

---

## 1. Directory of Supported Connectors

Sparkline Marketing features 13 purpose-built integration connectors categorized into four operational suites:

```
├── 1. Advertising Platforms (4)
│   ├── Meta Ads Manager (Facebook & Instagram)
│   ├── Google Ads
│   ├── TikTok Ads Manager
│   └── LinkedIn Campaign Manager
├── 2. Website & Search Analytics (2)
│   ├── Google Analytics 4 (GA4)
│   └── Google Search Console (GSC)
├── 3. Social Media Channels (4)
│   ├── Instagram & Facebook Pages
│   ├── LinkedIn Company Pages
│   ├── X / Twitter Analytics
│   └── YouTube Channel Analytics
└── 4. Data & Ingestion Connectors (3)
    ├── CSV & Spreadsheet Batch Importer
    ├── Google Sheets Live Sync
    └── Custom Webhook / REST JSON Ingestion
```

---

## 2. Connector Specifications & Permissions Matrix

| Platform Connector | Category | Data Synchronized | Required OAuth Scopes | Auth Flow |
| :--- | :--- | :--- | :--- | :--- |
| **Meta Ads Manager** | Advertising | Spend, Impressions, Reach, Clicks, CTR, CPC, CPM, Purchases, ROAS | `ads_read`, `ads_management`, `read_insights` | OAuth 2.0 PKCE |
| **Google Ads** | Advertising | Search Spend, Quality Score, Clicks, Conversions, Cost/Conv, Impression Share | `https://www.googleapis.com/auth/adwords` | OAuth 2.0 Web Client |
| **TikTok Ads** | Advertising | Video Views (2s/6s), Spend, Clicks, Conversions, ROAS, CPA | `ads.read`, `reporting.read` | OAuth 2.0 Authorization Code |
| **LinkedIn Ads** | Advertising | Lead Gen Form Fills, CPL, Demographic Reach, Sponsored Updates | `r_ads`, `r_ads_reporting` | OAuth 2.0 Authorization Code |
| **Google Analytics 4** | Analytics | Sessions, Active Users, Engagement Rate, Events, E-commerce Revenue | `https://www.googleapis.com/auth/analytics.readonly` | OAuth 2.0 / Service Account |
| **Google Search Console**| Analytics | Search Queries, Organic Impressions, Organic Clicks, Average Position | `https://www.googleapis.com/auth/webmasters.readonly` | OAuth 2.0 Web Client |
| **Meta Social Pages** | Social | Post Reach, Reels Plays, Engagement Count, Follower Delta | `pages_read_engagement`, `instagram_basic`, `instagram_manage_insights` | OAuth 2.0 User Token |
| **LinkedIn Pages** | Social | Corporate Follower Demographics, Impressions, Engagement Rate | `r_organization_social` | OAuth 2.0 Enterprise Token |
| **X / Twitter** | Social | Post Impressions, Bookmarks, Link Clicks, Retweet Frequency | `tweet.read`, `users.read` | OAuth 2.0 Bearer Token |
| **YouTube Analytics** | Social | Video Views, Watch Time (Hours), Avg Duration, Subscriber Delta | `https://www.googleapis.com/auth/yt-analytics.readonly` | OAuth 2.0 Channel Token |
| **CSV / Spreadsheet** | Data | Custom Spend, Historical Traffic, Conversions, Third-party Invoices | `file_upload`, `data_ingestion` | File Upload & Schema Map |
| **Google Sheets** | Data | Dynamic Sheet Ingestion, Hourly Auto-Sync, Custom Formulas | `https://www.googleapis.com/auth/spreadsheets.readonly` | OAuth 2.0 Service Account |
| **Custom Webhook** | Data | Real-time CRM Leads (HubSpot/Salesforce), Offline Order Events | `webhook_ingest` | HMAC-SHA256 Secret Header |

---

## 3. Connection Status Lifecycle

Every connector maintains a deterministic connection state displayed on its card:

```
[Not Connected] ────→ [Connecting] ────→ [Connected] ────→ [Syncing] ────→ [Connected]
       │                                     │                 │
       │ (Missing API Keys)                  │ (Manual Disconnect)  └──→ [Sync Failed]
       ↓                                     ↓
[Setup Required]                      [Disconnected]
```

- **Not Connected**: Connector is available, prerequisites are met, but no user account is linked.
- **Setup Required (`config_required`)**: Displayed when required external credentials (e.g. `VITE_META_APP_ID`, `VITE_GOOGLE_CLIENT_ID`) are missing from `.env`. Honest and transparent.
- **Connecting**: Authorization handshake in progress with third-party OAuth server.
- **Connected**: Validated access token stored in encrypted backend vault. Account ID and name displayed.
- **Syncing**: Active background ingestion worker running.
- **Sync Failed**: API rate limit, expired token, or permission error encountered. Preserves historical data and logs descriptive error.
- **Disconnected**: User revoked access. Session credentials permanently wiped from storage.

---

## 4. Sandbox Testing Mode

To allow developers and agency evaluators to test synchronization, data ingestion, and error handling without requiring live enterprise developer accounts, every connector provides a **Connect Sandbox** capability:

1. Generates an authentic mock account ID (e.g. `act_meta_819402`).
2. Synthesizes 30 days of realistic multi-channel performance data.
3. Allows testing of manual "Sync Now" workflows, duration tracking, and log inspection.
4. Allows testing of disconnection and token purge behaviors.

