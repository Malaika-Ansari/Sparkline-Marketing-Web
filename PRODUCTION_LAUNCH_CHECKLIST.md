# Sparkline Marketing — Production Launch Checklist

## 1. Pre-Launch Code & Build Verification
- [x] **TypeScript Strict Check**: `npx tsc --noEmit` exits with **0 errors**.
- [x] **Production Bundle Build**: `npm run build` succeeds in under 20 seconds.
- [x] **Automated Test Suites**: All 98 tests pass across Security, Analytics, Calculations, SEO, E2E, and Production Gate (`npm test`).
- [x] **Zero Hardcoded Secrets**: Scanned `dist/assets/*.js` to ensure zero API keys or secrets are baked into client bundles.
- [x] **Environment Template**: Updated `.env.example` with comprehensive documentation and placeholders.
- [x] **Deployment Configurations**: `vercel.json`, `Dockerfile`, `.dockerignore`, and `nginx.conf` present and verified.

---

## 2. Infrastructure & Hosting Setup
- [ ] **Hosting Account**: Provision production project on [Vercel](https://vercel.com) (or Google Cloud Run).
- [ ] **Environment Variables**: Populate production secrets in hosting provider's secure secret manager:
  - `VITE_APP_ENV="production"`
  - `VITE_APP_URL="https://sparklinemarketing.com"`
  - `VITE_SUPABASE_URL="https://<project-id>.supabase.co"`
  - `VITE_SUPABASE_ANON_KEY="<public-anon-key>"`
  - `GEMINI_API_KEY="<google-ai-studio-gemini-key>"`
  - `TOKEN_ENCRYPTION_SECRET="<32-byte-hex-secret>"`
- [ ] **Database Migrations (Supabase)**: Execute the 3 migration files in Supabase SQL editor:
  1. `supabase/migrations/20261114_auth_and_projects.sql`
  2. `supabase/migrations/20261114_advanced_database_and_security.sql`
  3. `supabase/migrations/20261114_analytics_and_integrations.sql`
- [ ] **RLS Verification**: Verify that Row-Level Security is toggled to **ON** across all 35 tables in the Supabase Table Editor.

---

## 3. Domain, DNS & SSL Configuration
- [ ] **Apex Domain Record**: Configure DNS `A` record pointing `@` to `76.76.21.21` (or your cloud IP).
- [ ] **Subdomain Record**: Configure DNS `CNAME` record pointing `www` to `cname.vercel-dns.com`.
- [ ] **Canonical Redirection**: Enforce `www.sparklinemarketing.com` &rarr; `https://sparklinemarketing.com` (301 Permanent).
- [ ] **SSL / TLS Certificate**: Verify automated Let's Encrypt SSL issuance and HTTPS padlock in browser.
- [ ] **Security Headers**: Verify `X-Content-Type-Options: nosniff` and `X-Frame-Options: SAMEORIGIN` via `curl -I https://sparklinemarketing.com`.

---

## 4. Search Engine & SEO Setup
- [x] **Robots.txt**: Verified `public/robots.txt` disallows `/dashboard/*`, `/login`, `/signup`, `/api/`.
- [x] **XML Sitemap**: Verified `public/sitemap.xml` contains all 9 canonical public URLs with zero private routes.
- [x] **Structured Data**: Schema.org JSON-LD verified on Homepage, Pricing, Tools, Academy, and Contact.
- [ ] **Google Search Console**:
  1. Add property `https://sparklinemarketing.com`.
  2. Complete DNS verification via TXT record.
  3. Submit sitemap URL: `https://sparklinemarketing.com/sitemap.xml`.
  4. Request indexing for Homepage (`/`).

---

## 5. Post-Launch Verification Probes (Day 1)
- [ ] **Homepage & Public Pages**: Verify all 9 public marketing pages load with zero visual glitches.
- [ ] **User Registration**: Register a real test account; verify password creation and session login.
- [ ] **Project Creation**: Create a live project; add business details, products, and budget.
- [ ] **AI Strategist**: Generate an AI strategy blueprint; verify structured response renders cleanly.
- [ ] **Budget & Currency**: Perform currency conversions; verify minor-unit balance checks.
- [ ] **Report & PDF Export**: Generate an executive dossier; test both print-to-PDF and pure TS PDF download.
- [ ] **Analytics & Funnel**: Ingest sample CSV; verify compound deduplication and 7-stage conversion funnel calculations.
- [ ] **Health Check Probe**: Verify `https://sparklinemarketing.com/api/health` returns `200 OK {"status":"healthy"}`.

