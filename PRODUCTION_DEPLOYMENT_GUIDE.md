# Sparkline Marketing — Production Deployment Guide

## 1. Production Architecture Overview

Sparkline Marketing is engineered to support two industry-standard production deployment architectures:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SPARKLINE MARKETING                             │
├───────────────────────────────────┬────────────────────────────────────┤
│   OPTION A: VERCEL / SERVERLESS   │    OPTION B: DOCKER / CLOUD RUN    │
│   (Recommended for Rapid Scale)   │    (Recommended for Containers)    │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Static Assets: Vercel Edge CDN  │ • Web Server: Nginx Alpine (HTTP)  │
│ • Routing: vercel.json SPA rewrites│ • Health Probe: /healthz          │
│ • SSL: Automated Let's Encrypt    │ • Container: Multi-stage Dockerfile│
│ • Serverless Functions: /api/*    │ • Scale: 0-to-N auto-scaling       │
└───────────────────────────────────┴────────────────────────────────────┘
                                     │
                                     ▼
                  ┌──────────────────────────────────────┐
                  │          SUPABASE POSTGRESQL         │
                  │   35 Relational Tables with RLS      │
                  │   GoTrue Auth + Storage Buckets      │
                  └──────────────────────────────────────┘
```

---

## 2. Option A: Deployment to Vercel (Recommended)

### Step 1: Connect Git Repository
1. Import the project repository into your [Vercel Dashboard](https://vercel.com/new).
2. Framework Preset: **Vite**.
3. Root Directory: `./`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.

### Step 2: Configure Environment Variables
In **Project Settings &rarr; Environment Variables**, add:
* `VITE_APP_NAME`: `Sparkline Marketing`
* `VITE_APP_ENV`: `production`
* `VITE_APP_URL`: `https://sparklinemarketing.com` (or your production domain)
* `VITE_SUPABASE_URL`: `https://<your-project-id>.supabase.co`
* `VITE_SUPABASE_ANON_KEY`: `<your-supabase-public-anon-key>`
* `GEMINI_API_KEY`: `<your-google-ai-studio-gemini-key>`
* `TOKEN_ENCRYPTION_SECRET`: `<32-byte-hex-secret>`

### Step 3: Routing & Headers
`vercel.json` is already pre-configured in the repository:
* Immutable 1-year cache headers for `/assets/*`.
* Strict security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`).
* SPA routing fallback to `/index.html` for clean client-side navigation.

### Step 4: Trigger Deployment
Click **Deploy**. Build completes in approximately 20 seconds.

---

## 3. Option B: Deployment to Google Cloud Run / Docker

### Step 1: Build the Container Image
The repository includes a production multi-stage `Dockerfile`:
```bash
docker build -t sparkline-marketing:latest .
```

### Step 2: Run and Verify Locally
```bash
docker run -d -p 8080:80 --name sparkline sparkline-marketing:latest
```
Test health check:
```bash
curl http://localhost:8080/healthz
# Expected: {"status":"healthy","service":"sparkline-nginx"}
```

### Step 3: Deploy to Google Cloud Run
```bash
# Tag container for Google Artifact Registry
docker tag sparkline-marketing:latest gcr.io/<PROJECT_ID>/sparkline-marketing:latest

# Push image
docker push gcr.io/<PROJECT_ID>/sparkline-marketing:latest

# Deploy with managed HTTPS
gcloud run deploy sparkline-marketing \
  --image gcr.io/<PROJECT_ID>/sparkline-marketing:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80
```

---

## 4. Production Database Setup (Supabase)

Execute the 3 production migration files in sequence in the [Supabase SQL Editor](https://app.supabase.com):

1. `supabase/migrations/20261114_auth_and_projects.sql`
   * Creates `profiles`, `user_preferences`, `marketing_projects`, `project_members`.
   * Enables Row-Level Security (RLS) on all 4 tables.
2. `supabase/migrations/20261114_advanced_database_and_security.sql`
   * Creates 28 normalized domain tables covering products, audiences, research, competitors, SWOT, strategies, budgets, campaigns, content, SEO, reports, and audit logs.
   * Defines non-recursive security definer function `public.has_project_access()`.
   * Enforces immutable append-only constraints on `audit_logs` and `exchange_rate_history`.
3. `supabase/migrations/20261114_analytics_and_integrations.sql`
   * Creates `imported_datasets`, `sync_logs`, and `analytics_snapshots`.
   * Establishes composite performance indexes for multi-channel queries.

---

## 5. Domain, DNS & SSL Configuration

### Recommended DNS Configuration for Custom Domain (`sparklinemarketing.com`)

| Record Type | Host / Name | Target / Value | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (apex) | `76.76.21.21` (Vercel IP) | Automatic (300s) | Apex domain routing |
| **CNAME** | `www` | `cname.vercel-dns.com` | Automatic (300s) | Subdomain routing |
| **TXT** | `_google-site-verification` | `<google-verification-code>` | 3600s | Google Search Console ownership |

### Canonical Redirection
* Configure **Redirect `www.sparklinemarketing.com` &rarr; `https://sparklinemarketing.com`** (301 Permanent Redirect) in your DNS or hosting settings.
* Automated SSL/TLS certificates will be issued via Let's Encrypt / DigiCert within 5 minutes of DNS propagation.

---

## 6. Post-Deployment Verification Checklist

Verify these 6 live probes immediately following production deployment:
1. `GET /`: Returns HTTP 200 with `<meta name="theme-color" content="#0A2540" />` and pre-rendered Schema.org JSON-LD.
2. `GET /robots.txt`: Returns HTTP 200 with explicit disallows for `/dashboard/`, `/login`, and `/api/`.
3. `GET /sitemap.xml`: Returns HTTP 200 containing 9 valid public URLs and zero private dashboard links.
4. `GET /pricing`: Returns HTTP 200 with interactive FAQ accordions and valid `FAQPage` JSON-LD.
5. `GET /healthz` (or `/api/health`): Returns HTTP 200 `{"status":"healthy"}`.
6. Open `/signup` & `/login`: Verify Web Crypto salted hashing works cleanly in user browser.

