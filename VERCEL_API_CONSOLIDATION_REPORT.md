# Vercel Hobby Plan — API Function Consolidation Report

**Project:** Sparkline Marketing Web Application  
**Target Environment:** Vercel Hobby Tier  
**Execution Date:** November 2026  
**Status:** **SUCCESSFUL & FULLY VERIFIED (198/198 Tests Passed, Build 100% Clean)**

---

## 1. Executive Summary

The Vercel Hobby deployment tier enforces a strict limit of **12 Serverless Functions** per deployment. Prior to consolidation, the Sparkline Marketing project maintained **22 separate `.ts` files** in the root `/api/` directory (one per endpoint), exceeding the Hobby tier limit by 10 functions and blocking automated Vercel deployments.

To resolve this limitation without breaking frontend contracts or compromising functionality, the serverless architecture was restructured around a **Centralized Serverless API Router** pattern utilizing Vercel's native catch-all dynamic route (`api/[...path].ts`) and root handler (`api/index.ts`).

### Key Consolidation Outcomes:
- **Serverless Function Count:** Reduced from **22 functions to 2 functions** (**91% reduction**, leaving 10 functions of headroom below the 12-function ceiling).
- **Zero Frontend Breaking Changes:** All 20 API endpoints continue to resolve at `/api/*` exactly as before. Frontend services (`src/services/*.ts`) and `fetch('/api/...')` calls required zero code modifications.
- **Unified Runtime Parity:** The centralized dispatcher `handleApiRequest()` in `src/server/ai-proxy-middleware.ts` serves as the single source of truth across all runtimes: Vite development server, standalone Node.js server, and Vercel serverless production.
- **Full Security & Operational Preservation:** Gemini API key isolation, Supabase Service Role confidentiality, SSRF defense, 25-second AI execution timeouts, in-flight request deduplication, rate-limiting, and sanitized logging were preserved 100%.
- **Verification:** All 11 automated test suites passed (`198/198 tests, 100%`), TypeScript compiled cleanly (`0 errors`), and `npm run build` completed in 22.4 seconds with zero warnings.

---

## 2. Serverless Function Count Comparison

| Metric | Before Consolidation | After Consolidation | Delta | Vercel Hobby Limit | Compliance Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Deployed Functions** | 22 | **2** | -20 (-91%) | $\le 12$ | **COMPLIANT (10 slots free)** |
| **Root API Handler** | 1 (`api/index.ts`) | **1 (`api/index.ts`)** | Preserved | N/A | Preserved |
| **Dynamic Subpath Router** | 0 | **1 (`api/[...path].ts`)** | +1 | N/A | Active catch-all |
| **Standalone Endpoint Files**| 21 | **0** | -21 | N/A | Consolidated |
| **Supported API Endpoints** | 20 | **20** | 0 (100% parity) | N/A | Fully Preserved |

---

## 3. Architecture & Router Design

### 3.1 Centralized Catch-All Routing Pattern

Vercel Serverless automatically maps `api/[...path].ts` to any request matching `/api/*`. During execution, Vercel populates `(req as any).query.path` as an array or string containing the subpath segments.

To provide seamless runtime parity across local Vite development, Node.js servers, and Vercel serverless executions, `handleApiRequest` was updated with resilient path normalization:

```typescript
// Resilient Path Normalization in src/server/ai-proxy-middleware.ts
const rawUrl = req.url || '';
const urlPath = rawUrl.split('?')[0] || '';

// Handle Vercel catch-all query parameter: (req as any).query?.path
const queryPath = (req as any).query?.path;
let normalizedPath: string;

if (Array.isArray(queryPath)) {
  normalizedPath = '/' + queryPath.join('/');
} else if (typeof queryPath === 'string') {
  normalizedPath = queryPath.startsWith('/') ? queryPath : `/${queryPath}`;
} else {
  // Strip '/api' prefix if present from raw URL
  normalizedPath = urlPath.startsWith('/api') 
    ? urlPath.slice(4) || '/' 
    : urlPath;
}

// Ensure leading slash and remove trailing slashes for exact route matching
if (!normalizedPath.startsWith('/')) {
  normalizedPath = `/${normalizedPath}`;
}
normalizedPath = normalizedPath.replace(/\/+$/, '') || '/';
```

### 3.2 SPA Routing Rewrite Coordination (`vercel.json`)

Vercel's SPA routing configuration in `vercel.json` was updated with a strict negative lookahead to prevent requests destined for `/api` or `/api/*` from being intercepted and redirected to `/index.html`:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "trailingSlash": false,
  "functions": {
    "api/*.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/((?!api/|api$|assets/|icons/|robots.txt|sitemap.xml|favicon.ico).*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 4. Full Inventory of All 20 Preserved API Endpoints

All 20 endpoints are active, tested, and routed through the consolidated serverless functions:

| # | Endpoint Route | HTTP Method | Functionality | Auth / Security Constraints |
| :---: | :--- | :---: | :--- | :--- |
| 1 | `/api/health` | `GET` | System health check, uptime, memory, version | Public, operational telemetry |
| 2 | `/api/ai-status` | `GET` | Gemini API connectivity & latency check | Public, rate-limited |
| 3 | `/api/generate-strategy` | `POST` | AI multi-channel marketing strategy synthesis | Rate-limited, 25s timeout, 2MB max |
| 4 | `/api/generate-unified-strategy` | `POST` | Unified marketing, budget & channel planning | Rate-limited, 25s timeout, 2MB max |
| 5 | `/api/generate-audience` | `POST` | Audience segmentation & customer persona builder | Rate-limited, 25s timeout, 2MB max |
| 6 | `/api/assist-content-copy` | `POST` | Ad copy, landing page & email copy enhancement | Rate-limited, 25s timeout, 2MB max |
| 7 | `/api/generate-seo-content` | `POST` | SEO title, description & keyword optimization | Rate-limited, 25s timeout, 2MB max |
| 8 | `/api/generate-campaign-plan` | `POST` | Marketing campaign flight planning & budget split | Rate-limited, 25s timeout, 2MB max |
| 9 | `/api/generate-social-post` | `POST` | Social media multi-format copy & hashtag generator | Rate-limited, 25s timeout, 2MB max |
| 10 | `/api/generate-content-ideas` | `POST` | Marketing editorial calendar & content ideation | Rate-limited, 25s timeout, 2MB max |
| 11 | `/api/generate-budget-plan` | `POST` | Marketing budget allocation & ROI forecast | Rate-limited, 25s timeout, 2MB max |
| 12 | `/api/generate-forecast-explanation` | `POST` | Quantitative predictive forecast rationales | Rate-limited, 25s timeout, 2MB max |
| 13 | `/api/discover-competitors` | `POST` | Automated competitive market analysis | Rate-limited, 25s timeout, 2MB max |
| 14 | `/api/generate-competitor-analysis` | `POST` | Competitor benchmarking & SWOT breakdown | Rate-limited, 25s timeout, 2MB max |
| 15 | `/api/generate-market-research` | `POST` | Industry macro trends & TAM/SAM analysis | Rate-limited, 25s timeout, 2MB max |
| 16 | `/api/competitor-assistant` | `POST` | Interactive conversational competitor chat | Rate-limited, 25s timeout, 2MB max |
| 17 | `/api/research-assistant` | `POST` | Interactive conversational market research chat | Rate-limited, 25s timeout, 2MB max |
| 18 | `/api/audit-website-seo` | `POST` | Automated website SEO crawling & technical audit | SSRF IP validation, 10s fetch guard |
| 19 | `/api/exchange-rates` | `GET` | Multi-currency FX exchange rates with fallback | Cached in-memory, public |
| 20 | `/api/user-account` | `DELETE` | GDPR-compliant user account & data deletion | Bearer Token Auth, Tenant isolation |

---

## 5. Files Modified, Created, and Removed

### Created / Retained in `/api/`:
- `api/index.ts`: Dedicated root serverless function handling requests directly to `/api` or `/api/` (dispatches to `handleApiRequest`).
- `api/[...path].ts`: Catch-all dynamic serverless function handling all subpaths `/api/*` (dispatches to `handleApiRequest`).

### Removed from `/api/` (20 Redundant Files):
- `api/ai-status.ts`
- `api/assist-content-copy.ts`
- `api/audit-website-seo.ts`
- `api/competitor-assistant.ts`
- `api/discover-competitors.ts`
- `api/exchange-rates.ts`
- `api/generate-audience.ts`
- `api/generate-budget-plan.ts`
- `api/generate-campaign-plan.ts`
- `api/generate-competitor-analysis.ts`
- `api/generate-content-ideas.ts`
- `api/generate-forecast-explanation.ts`
- `api/generate-market-research.ts`
- `api/generate-seo-content.ts`
- `api/generate-social-post.ts`
- `api/generate-strategy.ts`
- `api/generate-unified-strategy.ts`
- `api/health.ts`
- `api/research-assistant.ts`
- `api/user-account.ts`

### Modified Project Configuration & Source Files:
- `src/server/ai-proxy-middleware.ts`: Enhanced `handleApiRequest()` with catch-all query path support and `/api` root routing.
- `vercel.json`: Updated SPA rewrite regex to permit `/api` and `/api/*` requests to pass directly to Serverless functions.
- `src/test/run-ai-backend-suite.mjs`: Updated Test 1 to verify that `/api` contains $\le 12$ functions (asserts 2 functions) and validates router handler exports.

---

## 6. Preserved Security Controls

1. **API Key & Secret Isolation:**
   - `GEMINI_API_KEY` and Supabase Service Role keys remain exclusively in serverless memory environment variables (`process.env`).
   - Neither the build output (`dist/`) nor client bundles contain any secret references.
2. **SSRF Defense (`/api/audit-website-seo`):**
   - Strictly blocks internal IP ranges (RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopback addresses (`127.0.0.0/8`, `::1`), link-local addresses (`169.254.0.0/16`), and AWS/GCP cloud metadata endpoints (`169.254.169.254`, `metadata.google.internal`).
3. **Strict Request Rate Limiting:**
   - In-memory sliding window rate limiter protects all endpoints against volumetric abuse. Requests exceeding thresholds return HTTP `429 Too Many Requests` with a `Retry-After` header.
4. **AI Execution Timeouts & Deduplication:**
   - Invocations enforce a strict 25-second execution timeout via `AbortController`, preventing hung connections and fitting safely within Vercel's 30-second ceiling.
   - Concurrent identical AI requests are deduplicated using SHA-256 hashed prompt signatures to prevent redundant credit consumption.
5. **Payload Boundaries & Validation:**
   - Enforces a 2MB maximum request payload limit via `parseJsonBody`, preventing memory exhaustion attacks (HTTP `413 Payload Too Large`).
   - Strictly rejects invalid JSON syntax with HTTP `400 Bad Request`.
6. **Authentication & Authorization Guardrails:**
   - User account deletion (`DELETE /api/user-account`) mandates a valid Supabase JWT Bearer token in the `Authorization` header.
7. **Sanitized Production Logging:**
   - Structured JSON server logging recursively redacts bearer tokens, API keys, passwords, and sensitive system parameters before logging.

---

## 7. Verification & Test Results

### 7.1 Static Type Checking & Linting
- **TypeScript Compiler (`tsc -b`):** 0 Errors, 0 Warnings
- **Lint Check (`npm run lint`):** 0 Errors, 0 Warnings

### 7.2 Automated Test Suites (`npm test`)
Every test across all 11 test suites passed with 100% success:

| Test Suite | File | Tests Run | Result |
| :--- | :--- | :---: | :---: |
| 1. Advanced Security Suite | `run-security-suite.mjs` | 20 / 20 | **PASS** |
| 2. Advanced Analytics Suite | `run-analytics-suite.mjs` | 22 / 22 | **PASS** |
| 3. Calculation Accuracy Suite | `run-calculations-suite.mjs` | 20 / 20 | **PASS** |
| 4. Technical SEO Suite | `run-seo-suite.mjs` | 18 / 18 | **PASS** |
| 5. E2E Regression Suite | `run-e2e-regression-suite.mjs` | 18 / 18 | **PASS** |
| 6. Production Gate Suite | `run-production-gate-suite.mjs` | 10 / 10 | **PASS** |
| 7. AI Backend Suite (Consolidated Router) | `run-ai-backend-suite.mjs` | 20 / 20 | **PASS** |
| 8. Supabase Security Suite | `run-supabase-security-suite.mjs` | 10 / 10 | **PASS** |
| 9. Security Hardening Suite | `run-security-hardening-suite.mjs` | 20 / 20 | **PASS** |
| 10. Production Monitoring & Reliability | `run-reliability-suite.mjs` | 20 / 20 | **PASS** |
| 11. Performance, SEO & Accessibility | `run-phase-b-suite.mjs` | 20 / 20 | **PASS** |
| **Total** | **11 Suites** | **198 / 198** | **100% SUCCESS** |

### 7.3 Production Build Output (`npm run build`)
```
✓ 2266 modules transformed.
dist/index.html                                         5.57 kB │ gzip:   1.71 kB
dist/assets/index-BfF8LIsu.css                         86.87 kB │ gzip:  14.12 kB
dist/assets/vendor-react-CfUo9VHN.js                  207.06 kB │ gzip:  67.55 kB
dist/assets/vendor-charts-ClS34VaO.js                 435.29 kB │ gzip: 115.65 kB
dist/assets/index-ELsn5lWr.js                         576.51 kB │ gzip: 174.33 kB
✓ built in 22.43s
```
All assets successfully generated under the configured 600 kB chunk threshold.

---

## 8. Vercel Hobby Deployment Instructions

1. **Verify Environment Variables on Vercel Dashboard:**
   Configure the following under **Project Settings > Environment Variables**:
   - `GEMINI_API_KEY`: Server-side Gemini API key (Production, Preview, Development)
   - `VITE_SUPABASE_URL`: Supabase project URL (`https://<project-ref>.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY`: Supabase client anonymous public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase server-side service role key (for account deletion)

2. **Deploy to Vercel:**
   Push your commits to your Git provider (GitHub / GitLab / Bitbucket) or trigger a deployment via Vercel CLI:
   ```bash
   vercel --prod
   ```

3. **Post-Deployment Verification:**
   Verify operational health by requesting the consolidated endpoints:
   - Root catalog: `https://<your-domain>.vercel.app/api`
   - Health check: `https://<your-domain>.vercel.app/api/health`
   - AI status check: `https://<your-domain>.vercel.app/api/ai-status`
