# Social Media Publishing & Integration Policy

This document establishes Sparkline Marketing's security standards, API compliance protocols, and transparent disclosures regarding third-party social media platform integrations.

---

## 1. Safe Offline Planning Standard

Sparkline Marketing operates strictly as an **advanced strategy, creative generation, and editorial planning studio**.

- **No Phantom Publishing**: The platform will never falsely indicate that a post has been published to a live social network (Instagram, Facebook, LinkedIn, TikTok, YouTube, Pinterest, X) when the record has only been saved locally inside Sparkline.
- **Explicit Connection Badges**: All platform statuses are clearly labeled as `Planned Sandbox` or `Disconnected` until authenticated OAuth 2.0 credentials are affirmatively supplied.
- **Manual Execution Workflow**: Marketers and agencies can export structured CSVs, copy formatted captions, and download creative briefs for native execution without operational ambiguity.

---

## 2. API Scope Requirements (Future Live Connectors)

When direct social publishing connectors are enabled:

| Platform | Official API Endpoint | Required Scopes | Security Level |
| :--- | :--- | :--- | :--- |
| **Meta (Instagram & Facebook)** | Graph API v19.0 | `instagram_basic`, `instagram_content_publish`, `pages_manage_posts` | User-authorized PKCE OAuth 2.0 |
| **LinkedIn** | Community Management API | `w_member_social`, `w_organization_social` | Enterprise Token Encryption |
| **TikTok** | Content Posting API | `video.upload`, `video.publish` | Scoped App Verification |
| **YouTube** | YouTube Data API v3 | `https://www.googleapis.com/auth/youtube.upload` | Google Cloud Service Principal |
| **Pinterest** | Pinterest API v5 | `pins:write`, `boards:read` | Scoped App Auth |
| **X (Twitter)** | X API v2 | `tweet.write`, `users.read` | User Context OAuth 2.0 |

---

## 3. Privacy & Secret Isolation

- **Zero Client-Side Token Exposure**: API keys, OAuth refresh tokens, and secret client credentials will be managed strictly in isolated server-side environments (Node.js middleware / process environment).
- **No PII Leaks**: Social media post prompts and captions transmitted to the Gemini AI proxy strip personal customer names and email addresses.

