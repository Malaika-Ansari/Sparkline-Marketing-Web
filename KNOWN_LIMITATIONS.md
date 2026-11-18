# Known Limitations & Graceful Degradation Guide
**Sparkline Marketing — AI-Powered Marketing Intelligence & Strategy Platform**  
*Document Version: 1.0.0 | Production Readiness Phase (Prompt 25 of 25)*

---

## 1. Executive Summary

Sparkline Marketing is engineered with a **resilient, defense-in-depth architecture** designed to operate smoothly across a wide variety of hosting environments, infrastructure tiers, and connectivity states. When an external service, database tier, or third-party API is temporarily unconfigured or unavailable, the platform avoids crashing or throwing unhandled exceptions. Instead, it transitions gracefully to local storage, sandbox simulations, cached data, or contextual user warnings.

This document transparently outlines all **known architectural constraints, technical limitations, third-party dependencies, browser boundaries, and their corresponding workarounds and graceful degradation paths**.

---

## 2. Matrix of Known Limitations & Fallback Behaviors

| Subsystem / Feature | Dependency / Constraint | Known Limitation | Graceful Degradation / Workaround | Recommended Long-Term Remedy |
| :--- | :--- | :--- | :--- | :--- |
| **Local Vault vs. Cloud Supabase** | Network, Supabase Project Credentials | Without valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, data is persisted only in browser `localStorage`. Data is device- and browser-bound. | The platform activates **Local Vault Mode**. Full CRUD for projects, forecasts, campaigns, and reports functions seamlessly. Users can export/import project archives via JSON. | Connect a managed Supabase PostgreSQL instance using the migrations in `supabase/migrations/`. |
| **Browser Storage Capacity** | Browser `localStorage` quota | Browsers enforce a standard ~5MB limit per origin for `localStorage`. Heavy generation of campaigns, reports, and personas can approach this limit over time. | Storage utility logs warnings when approaching quota; auto-prunes ephemeral preview caches while preserving core project records. | Use Supabase PostgreSQL and Supabase Storage bucket for multi-megabyte media and document persistence. |
| **Google Gemini AI Generation** | Google AI Studio / Vertex AI API Quota | Gemini 1.5 Flash API keys on the free tier are subject to strict RPM/TPM limits (15 RPM / 1M TPM). API quotas can be temporarily exhausted during burst usage. | Exponential backoff retry handler (`retryWithBackoff`) retries transient 429 errors. If quota is completely exhausted, the system provides detailed deterministic templates and fallback strategic models with a warning banner. | Upgrade Gemini API key to a Google Cloud paid billing project with tiered quotas; configure multi-model redundancy. |
| **Live Third-Party Ad & Analytics Sync** | Platform OAuth APIs (Meta, Google, LinkedIn, TikTok, GA4) | Live synchronizations require production OAuth App verification and client secrets (`GOOGLE_ADS_CLIENT_SECRET`, `META_APP_SECRET`, etc.). In unauthenticated states, live tokens cannot be refreshed. | The platform switches to **Sandbox Data Mode**, delivering high-fidelity realistic synthetic telemetry, KPIs, and demographic distributions marked clearly with a "Simulated / Sandbox" provenance badge. | Complete platform developer app verification with Google, Meta, TikTok, and LinkedIn; store secrets securely in server-side environment variables. |
| **Live SEO Web Crawler** | CORS / Browser Sandbox Boundaries | Web browsers strictly forbid cross-origin client-side HTML scraping due to CORS and mixed-content security policies. Single Page Applications cannot directly scrape external URLs from the browser window. | The system utilizes a dual-path approach: when running alongside the Node.js backend proxy (`src/server/ai-proxy-middleware.ts`), URLs are crawled server-side; when standalone client-side, the SEO audit uses rich algorithmic heuristics, meta tag analysis, and structural audits based on standard search engine benchmarks. | Run the Node.js backend proxy in containerized production with outbound HTTP egress enabled; integrate a specialized headless browser service (e.g., Puppeteer, Playwright) for heavy JS sites. |
| **PDF & Report Exporting** | Browser Print Engine & Pop-up Blockers | Direct-to-file PDF generation in pure client-side SPA environments relies on the browser's native print-to-PDF rendering (`window.print()`) or virtual iframe capture. Pop-up blockers may block print dialogs. | The platform detects blocked pop-ups and provides an on-screen modal with an embedded print trigger, direct HTML printable preview, and instantaneous JSON/CSV data export alternatives. | Deploy a serverless PDF rendering microservice utilizing headless Chromium with `@sparticuz/chromium` for deterministic server-rendered vector PDFs. |
| **Live Currency Conversion Rates** | European Central Bank / Open Exchange Rates API | Network connectivity interruptions or external rate API outages prevent real-time FX updates. | The platform bundles an immutable fallback table of baseline global exchange rates (USD, EUR, GBP, CAD, AUD, JPY, INR, SGD) refreshed periodically. Active conversions continue without disruption, displaying a "Cached Rate" indicator. | Configure a server-side Redis cron worker to cache hourly FX rates from Open Exchange Rates or Fixer.io. |
| **Formula & CSV Export Escaping** | Spreadsheet Software (Excel, LibreOffice, Sheets) | Malicious user input starting with `=`, `+`, `-`, or `@` can trigger Dynamic Data Exchange (DDE) or formula execution in desktop spreadsheet tools (Formula Injection / CWE-1237). | All exported CSV and tabular fields are automatically sanitized via `sanitizeCsvField()`, prefixing dangerous leading characters with a single quote (`'`) to neutralize executable expressions. | Maintained permanently as a core security control. |
| **SSRF (Server-Side Request Forgery)** | User-Provided URLs in SEO and Web Audits | Users can submit internal IP addresses (`127.0.0.1`, `10.0.0.0/8`, `169.254.169.254`, `localhost`) to probe internal networks or cloud metadata endpoints. | The server-side proxy validates every target hostname against a strict SSRF denylist (`validateTargetUrl()`), rejecting loopback, RFC 1918 private subnets, link-local, and AWS/GCP metadata endpoints (`169.254.169.254`). | Maintained permanently as a core security control. |
| **Multi-Factor Authentication (MFA)** | TOTP Authenticator / SMS Gateway | Basic Supabase Auth email/password and OAuth (Google, GitHub) are fully supported, but SMS-based MFA requires a configured Twilio/Vonage integration. | Email-based magic link verification, password resets, and session revocations provide baseline security; users are encouraged to use Google OAuth with hardware security keys (WebAuthn). | Enable Supabase Native TOTP MFA in the Supabase Dashboard under `Authentication -> Multi-Factor`. |

---

## 3. Detailed Subsystem Analysis

### 3.1 Local Vault Mode (Zero-Cloud Degradation)
- **Design Philosophy**: Sparkline Marketing is designed so that a user without any backend or database infrastructure can clone the repository, run `npm run dev`, and immediately experience the full suite of marketing calculators, AI prompt generators, budget planners, and report designers.
- **Data Persistence**: Project data is serialized as JSON in `localStorage` under namespaced keys (e.g., `sparkline_projects`, `sparkline_vault_*`).
- **Boundaries**:
  - Clearing browser cookies/cache or opening an incognito window isolates the user from their previously saved records.
  - Multi-device collaboration is not supported in Local Vault mode.
- **Safety Mechanism**: The Settings page features a one-click **Export Project Vault (JSON)** feature allowing users to back up their entire workspace to a local encrypted file, which can be imported into any browser instance or migrated directly into Supabase.

### 3.2 AI Integration & Token Rate Limits
- **Model**: Google Gemini 1.5 Flash (`models/gemini-1.5-flash`).
- **Quota Tiers**:
  - **Free Tier**: 15 requests per minute, 1,000,000 tokens per minute, 1,500 requests per day.
  - **Pay-as-you-go Tier**: Up to 1,000 requests per minute with high concurrency limits.
- **Edge Case**: During automated stress testing or multiple users submitting simultaneous comprehensive campaign requests, rate limits can be triggered.
- **Handling**:
  1. Requests employ exponential backoff with jitter (initial delay: 1,000ms; max delay: 8,000ms; max attempts: 3).
  2. If the API returns HTTP 429 or HTTP 503 after all retries, the UI displays a dismissible toast notification with the specific error and populates the output area with a pre-validated, high-quality strategic fallback template tailored to the user's project parameters.
  3. No application state is corrupted; users can re-trigger generation with a single click once rate limits reset.

### 3.3 Third-Party Integrations Sandbox
- **Platforms Covered**: Google Ads, Meta Ads Manager, LinkedIn Campaign Manager, TikTok Ads Manager, Google Analytics 4 (GA4).
- **Security Requirement**: Live API tokens must be encrypted with AES-256-GCM using `TOKEN_ENCRYPTION_SECRET`.
- **Limitation**: Without active developer credentials registered in the respective developer consoles (e.g., Google Cloud Console, Meta Developers), live API calls cannot be authorized.
- **Behavior**:
  - When an integration is toggled on in the UI without valid credentials, the system automatically marks the integration status as `Connected (Sandbox Mode)`.
  - Realistic time-series data, audience distributions, and conversion events are dynamically synthesized so that charts, graphs, and performance heatmaps display live-like visualizations.
  - All charts and report exports carry a clear provenance tag: `[Sandbox / Demo Data]` to prevent confusion with real financial metrics.

### 3.4 SEO Web Scraping & CORS Constraints
- **Constraint**: Client-side single page applications cannot issue `fetch()` or `XMLHttpRequest` directly to external company domains (e.g., `https://example.com`) due to cross-origin resource sharing (CORS) protections enforced by browsers.
- **Architecture**:
  - In a standard production deployment with the included Node.js middleware (`src/server/ai-proxy-middleware.ts`), the request is routed through `POST /api/proxy/seo-crawl`.
  - The proxy performs strict URL parsing, validates against the SSRF denylist, issues a sanitized server-side HTTP request with a standard user-agent, parses OpenGraph, meta tags, heading structures, and schema markup, and returns the structured audit to the client.
  - If deployed purely as a static SPA on a CDN without the Node middleware, the SEO Analyzer detects the absence of the proxy and activates an intelligent heuristic mode that guides the user to input specific competitor URLs or enter page content manually for analysis.

### 3.5 PDF Exporting & Visual Rendering
- **Mechanisms**:
  - Dynamic HTML canvas capture and vector printing via `window.print()` with `@media print` CSS style rules.
  - Native print stylesheets hide navigation sidebars, action buttons, filter bars, and notifications, formatting the document with clean page breaks, brand headers, and formal legal footers.
- **Limitations**:
  - Highly customized user operating system print dialogs (e.g., margins set to "None" or headers/footers forced on by the browser) may alter paper margins.
  - Mobile browsers (Safari on iOS, Chrome on Android) occasionally truncate multi-page print previews if memory constraints are hit.
- **Mitigation**:
  - Print CSS rules specify `@page { size: A4; margin: 15mm; }` to normalize browser rendering engines.
  - A prominent "Download CSV / Data Export" button accompanies every report, ensuring complete numerical fidelity regardless of client print capabilities.

---

## 4. Edge Cases & Boundary Conditions

### 4.1 High-Volume Mathematical Precision
- JavaScript IEEE 754 floating-point arithmetic can introduce rounding anomalies (e.g., `0.1 + 0.2 = 0.30000000000000004`).
- **Mitigation**: All financial calculations (ROAS, CPA, CAC, CLV, Net Profit, Break-Even Volume) are encapsulated in dedicated calculation utilities with explicit rounding to two decimal places (`Math.round(val * 100) / 100`) or standard financial precision wrappers.

### 4.2 Large Data Sets in Analytics
- Rendering 50,000+ individual daily click records on a single SVG chart can degrade browser frame rates.
- **Mitigation**: The analytics aggregation layer automatically buckets time-series data into daily, weekly, or monthly aggregations when the query range exceeds 90 days, maintaining smooth 60fps rendering.

### 4.3 Concurrent Multi-Tab Operations
- If a user opens the application in two tabs and updates the same project in both tabs under Local Vault mode, the last tab to write to `localStorage` will overwrite changes from the other.
- **Mitigation**: With Supabase configured, Row Level Security and PostgreSQL record timestamps manage concurrency. In Local Vault mode, storage event listeners detect external writes and notify the user to refresh the workspace.

---

## 5. Security & Isolation Invariants

The following security properties are guaranteed across **all** operating modes (Local Vault, Sandbox, and Cloud Production):
1. **Zero Secret Leakage**: No server-side API keys (`GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `TOKEN_ENCRYPTION_SECRET`) are ever exposed in client-side JavaScript bundles.
2. **Formula Injection Immunity**: All user-controlled text fields exported to CSV/Excel are sanitized against spreadsheet injection.
3. **Cross-Tenant Isolation**: PostgreSQL Row Level Security enforces strict tenant isolation at the database level.
4. **SSRF Blocking**: The server proxy strictly prohibits requests targeting private networks, loopbacks, and cloud metadata endpoints.
5. **XSS Defense**: React's JSX auto-escaping, combined with DOMPurify sanitization on rich text inputs, neutralizes cross-site scripting vectors.

---

## 6. Summary of Recommendations for Enterprise Production

For organizations requiring enterprise-scale SLAs, the following infrastructure additions are recommended:
1. **Dedicated Gemini Enterprise Quota**: Provision Google Cloud Vertex AI with a dedicated TPM quota allocation.
2. **Dedicated Headless Browser Service**: Deploy a containerized Puppeteer service (e.g., Browserless.io) for high-scale deep JS scraping.
3. **Server-Side Chromium PDF Service**: Provision an AWS Lambda or Google Cloud Run microservice using Puppeteer to render pixel-perfect server-side PDF exports.
4. **Redis Cache Layer**: Introduce Redis for high-frequency caching of live currency exchange rates and third-party API responses.
5. **Automated Continuous Backup**: Enable Supabase Point-in-Time Recovery (PITR) with daily off-site encrypted S3 backups.

---

*Sparkline Marketing Engineering Team | Production Readiness Certification Complete*

