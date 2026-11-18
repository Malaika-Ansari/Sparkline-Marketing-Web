# Sparkline Marketing — Production Environment Setup Guide

## 1. Environment Variable Architecture & Security Rules

Sparkline Marketing distinguishes strictly between **Client-Side Build Variables** and **Server-Side Protected Secrets**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ENVIRONMENT VARIABLES                           │
├───────────────────────────────────┬────────────────────────────────────┤
│     CLIENT-SIDE BUNDLE (VITE_)    │         SERVER-SIDE SECRETS        │
│   (Embedded into JS at build time)│   (Kept in Node / Cloud Provider)  │
├───────────────────────────────────┼────────────────────────────────────┤
│ • VITE_APP_NAME                   │ • GEMINI_API_KEY                   │
│ • VITE_APP_ENV                    │ • SUPABASE_SERVICE_ROLE_KEY        │
│ • VITE_APP_URL                    │ • TOKEN_ENCRYPTION_SECRET          │
│ • VITE_SUPABASE_URL               │ • META_CLIENT_SECRET               │
│ • VITE_SUPABASE_ANON_KEY          │ • GOOGLE_CLIENT_SECRET             │
│                                   │ • TIKTOK_CLIENT_SECRET             │
│                                   │ • LINKEDIN_CLIENT_SECRET           │
└───────────────────────────────────┴────────────────────────────────────┘
```

> [!CAUTION]
> **Zero Secret Leakage Rule**: Any variable starting with `VITE_` is baked directly into the static distribution JavaScript chunks and is visible to anyone inspecting browser network traffic. **NEVER** prefix API private keys, master database passwords, or OAuth client secrets with `VITE_`.

---

## 2. Complete Environment Variable Reference

### A. Client-Side Build Variables

| Variable Name | Required? | Example Value | Purpose & Notes |
| :--- | :--- | :--- | :--- |
| `VITE_APP_NAME` | Yes | `Sparkline Marketing` | Brand name displayed across title tags and document metadata. |
| `VITE_APP_ENV` | Yes | `production` | Environment indicator (`development`, `staging`, `production`). |
| `VITE_APP_URL` | Yes | `https://sparklinemarketing.com` | Base URL used for canonical link generation and Open Graph tags. |
| `VITE_APP_VERSION` | Yes | `0.1.0` | Application release version string. |
| `VITE_SUPABASE_URL` | Optional | `https://xyzcompany.supabase.co` | Cloud database URL. When omitted, Sparkline operates in zero-config Local Vault mode. |
| `VITE_SUPABASE_ANON_KEY` | Optional | `eyJhbGciOi...` | Public client JWT anon key used for Row-Level Security authenticated queries. |

### B. Server-Side Protected Secrets

| Variable Name | Required? | Description & Acquisition Source |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Recommended | Google Gemini API key used by `/api/generate-strategy` and `/api/audit-website-seo`. Obtain free from [Google AI Studio](https://aistudio.google.com). |
| `TOKEN_ENCRYPTION_SECRET` | Recommended | 32-byte hex-encoded master key used for AES-256-GCM encryption of OAuth tokens at rest. Generate via `openssl rand -hex 32`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Administrative database key for backend server tasks. Must NEVER be exposed to client. |
| `EXCHANGE_RATE_API_KEY` | Optional | API key for live currency exchange feeds. If unconfigured, the platform uses built-in institutional rates. |
| `META_CLIENT_ID` | Optional | Meta for Developers App ID for Facebook & Instagram Ads connector. |
| `META_CLIENT_SECRET` | Optional | Meta App Secret for server-side OAuth 2.0 token exchange. |
| `GOOGLE_CLIENT_ID` | Optional | Google Cloud Console OAuth 2.0 Client ID for Google Ads, GA4, and GSC connectors. |
| `GOOGLE_CLIENT_SECRET` | Optional | Google Cloud Console OAuth Client Secret. |
| `TIKTOK_CLIENT_ID` | Optional | TikTok for Business Developer App ID. |
| `TIKTOK_CLIENT_SECRET` | Optional | TikTok Developer App Secret. |
| `LINKEDIN_CLIENT_ID` | Optional | LinkedIn Developer Portal Client ID. |
| `LINKEDIN_CLIENT_SECRET` | Optional | LinkedIn Developer Portal Client Secret. |
| `ALLOWED_ORIGINS` | Recommended | Comma-delimited list of permitted CORS origins (e.g. `https://sparklinemarketing.com`). |

---

## 3. Cryptographic Secret Key Generation

To generate a secure 256-bit hexadecimal encryption secret for `TOKEN_ENCRYPTION_SECRET`:

### On macOS / Linux:
```bash
openssl rand -hex 32
# Output example: 4a9f8b2c1d0e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a
```

### On Windows PowerShell:
```powershell
-join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Minimum 0 -Maximum 256) })
```

---

## 4. Setting Variables on Production Hosting Providers

### Setting Secrets in Vercel
1. Navigate to **Project Dashboard &rarr; Settings &rarr; Environment Variables**.
2. Select **Production** and **Preview** environments.
3. Paste variable names and values; click **Save**.
4. Trigger a project redeployment to apply variables to new builds.

### Setting Secrets in Google Cloud Run
```bash
gcloud run services update sparkline-marketing \
  --set-env-vars VITE_APP_ENV=production,VITE_APP_URL=https://sparklinemarketing.com \
  --set-secrets GEMINI_API_KEY=gemini-secret:latest,TOKEN_ENCRYPTION_SECRET=token-secret:latest
```

---

## 5. Security Checklist
* `.env` and `.env.local` are included in `.gitignore` and `.dockerignore`.
* Production build outputs verified: `dist/assets/*.js` contains zero API keys or secrets.
* Fallback behavior verified: Application operates smoothly with helpful configuration notices when optional credentials are not configured.

