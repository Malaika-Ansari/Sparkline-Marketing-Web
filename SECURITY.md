# Sparkline Marketing — Security Architecture & Guidelines

## 1. Core Principles
Sparkline Marketing is built with a security-first engineering mindset. Every layer of the platform is designed to protect user business intelligence, marketing budgets, and proprietary product strategies.

> **Honesty & Verification Rule**: Sparkline Marketing never displays unverified security badges, false compliance logos, or unsubstantiated certification claims. All security guarantees documented herein reflect actual architectural controls.

---

## 2. Phase 1 Security Baseline

### 2.1 Credential & Secret Management
- **Zero Secrets in Client Bundles**: No sensitive API keys (including Gemini API keys or database service role keys) are embedded in the frontend bundle.
- **Environment Isolation**: The repository includes `.env.example` with non-secret dummy templates. Local variables are placed in `.gitignore` files (`.env.local`).
- **Git Hygiene**: Strict `.gitignore` rules prevent accidental commits of secrets, logs, and temporary caches.

### 2.2 Client-Side Code Hygiene
- **Strict TypeScript (`tsconfig.json`)**: Configured with `strict: true`, `noImplicitAny: true`, and `noUncheckedIndexedAccess: true` to prevent type-coercion bugs and runtime exceptions.
- **Safe Rendering**: Complete prohibition of `dangerouslySetInnerHTML`. User-facing text is rendered through React's native JSX escaping mechanism.
- **Input Validation**: Dedicated sanitization helper utilities (`src/lib/validation.ts`) to validate user inputs at application boundaries.
- **No Sensitive Data in LocalStorage**: Authentication tokens, sensitive tenant data, and API payloads will never be stored in persistent unencrypted client storage.

### 2.3 Route & Layout Isolation
- Public marketing routes and authenticated dashboard routes are separated by layout boundaries (`PublicLayout` vs `DashboardLayout`).
- Placeholder dashboard pages provide immediate visual context while preventing unauthorized command dispatching.

---

## 3. Future Security Architecture (Phase 2+)

### 3.1 Supabase Row Level Security (RLS)
Every database table will enforce tenant-level RLS policies:
```sql
-- Architectural standard for all multi-tenant tables
CREATE POLICY tenant_isolation_policy ON user_campaigns
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 3.2 Secure Server-Side AI Integration (Gemini API)
- AI calls will route through authenticated serverless edge endpoints.
- Server endpoints will enforce:
  1. User session token verification (JWT).
  2. Input rate limiting per tenant tier.
  3. Strict prompt sanitization to prevent prompt injection.
  4. Response schema validation before client delivery.

### 3.3 HTTP Headers & Content Security Policy (CSP)
Production deployments will enforce:
- `Content-Security-Policy: default-src 'self'; script-src 'self'; connect-src 'self' https://*.supabase.co https://api.sparklinemarketing.com;`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 4. Reporting Security Vulnerabilities
If you discover a security vulnerability within Sparkline Marketing, please submit a responsible disclosure report to `security@sparklinemarketing.com`.

