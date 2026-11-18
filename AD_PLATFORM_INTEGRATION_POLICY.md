# Advertising Platform Integration & Execution Policy

This policy outlines Sparkline Marketing's security, privacy, and architectural guidelines regarding third-party advertising network integrations and campaign execution.

---

## 1. Principles of Platform Integrity

Sparkline Marketing operates as an advanced **Campaign Strategy, Creative Planning, and Intelligence Studio**. To maintain absolute transparency and protect users from inadvertent media spend, Sparkline strictly adheres to the following principles:

1. **No Phantom Live Publishing**:
   - The platform will **never claim** to publish, modify, or launch live advertising campaigns on third-party networks (e.g., Meta Ads Manager, Google Ads, TikTok Ads Manager, LinkedIn Campaign Manager) without user-authorized, verified OAuth 2.0 access tokens and explicit user confirmation.
2. **Offline-First Campaign Architecture**:
   - All campaigns created within the Campaign Studio are initially stored in secure local storage and offline project registries. Marketers can plan, iterate, review, and test their structures without risk of unintended spend.
3. **Structured Export Over Black-Box Automation**:
   - Sparkline empowers marketers with standardized CSV export, JSON campaign schemas, and copy/creative briefs formatted for seamless copy-pasting or bulk importation into native ad managers.

---

## 2. API Scope & Token Requirements (Future Live Connectors)

When direct platform sync or reporting connectors are enabled in future phases:

| Network | Required Permissions / Scopes | Security Level | Purpose |
| :--- | :--- | :--- | :--- |
| **Meta Ads API** | `ads_read`, `ads_management`, `pages_read_engagement` | Encrypted at Rest | Read performance insights, validate ad sets |
| **Google Ads API** | `https://www.googleapis.com/auth/adwords` | OAuth 2.0 PKCE | Query keyword volume, read campaign stats |
| **TikTok Ads API** | `advertiser.ad.read`, `advertiser.ad.write` | Sandbox Audited | In-feed video performance monitoring |
| **LinkedIn Marketing** | `r_ads`, `r_ads_reporting`, `rw_ads` | Enterprise Scope | Sponsored content reporting & lead retrieval |

---

## 3. Data Privacy & Sandboxing

- **No Credential Interception**: Sparkline does not store user passwords or raw API keys in plain text.
- **Client-Side Isolation**: All campaign drafts, copy variants, and audience specifications remain within the user's controlled browser environment until deliberately exported or saved to their workspace project.
- **AI Proxy Safety**: All generative requests sent to the AI proxy endpoint (`/api/generate-campaign-plan`) strip personally identifiable information (PII) and only transmit sanitized product and campaign objective metadata.

