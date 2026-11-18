# Sparkline Marketing — AI Security & Data Protection Specification

This document details the security architecture, credential protection mechanisms, data privacy policies, and rate-limiting controls implemented for the **AI Marketing Strategist Engine** (Phase 07).

---

## 1. Threat Model & Security Objectives

| Threat Vector | Mitigation Strategy | Status |
| :--- | :--- | :--- |
| **API Key Exposure in Client Bundle** | API keys are kept strictly in server Node.js process (`process.env.GEMINI_API_KEY`); client only calls `/api/generate-strategy` | ✅ Implemented |
| **API Key Leakage via Client Storage** | Keys are never written to `localStorage`, `sessionStorage`, or cookies | ✅ Implemented |
| **Denial of Service / Quota Burn** | In-memory sliding window rate limiter (max 10 requests / 5 min per IP) | ✅ Implemented |
| **Oversized Payload Exhaustion** | Body parser enforces strict 2MB limit on incoming requests | ✅ Implemented |
| **Prompt Injection via Project Inputs** | Inputs are strictly delimited into structured data sections; model is constrained to pure JSON output | ✅ Implemented |
| **PII Data Leakage** | Explicit non-PII onboarding warning; customer data models prohibit PII storage | ✅ Implemented |

---

## 2. Server-Side Secret Isolation Architecture

The frontend communicates with Google Gemini exclusively through the protected server proxy:

```
[Browser Client]
       |
       |  POST /api/generate-strategy (Project Payload Only)
       v
[Vite Server Middleware]
       |  - Validates request payload & rate limit
       |  - Reads process.env.GEMINI_API_KEY (Server memory only)
       |  - Dispatches HTTPS request to Google Gemini API
       v
[Google Gemini API]
```

### Critical Rules Enforced:
1. **Never use `VITE_` prefix for secrets**: Vite automatically exposes any environment variable prefixed with `VITE_` to client-side code via `import.meta.env`. The Gemini key is configured as `GEMINI_API_KEY` (without `VITE_`), ensuring Vite will never bundle it.
2. **Setup State Transparency**: If `GEMINI_API_KEY` is not present, the proxy returns `HTTP 401 Unauthorized` with `{ ok: false, error: 'API_KEY_NOT_CONFIGURED' }`. The application renders an unconfigured setup state banner and does not fabricate a simulated real response.

---

## 3. Rate Limiting Specification

The proxy in `src/server/ai-proxy-middleware.ts` implements a sliding-window rate limiter:
- **Window Size**: 300,000 milliseconds (5 minutes).
- **Max Invocations**: 10 requests per window per IP.
- **Header Inspection**: Inspects `x-forwarded-for` and socket remote addresses.
- **HTTP Response on Breach**: `HTTP 429 Too Many Requests` with `{ error: 'RATE_LIMIT_EXCEEDED' }`.

---

## 4. Privacy & Non-PII Safeguards

Sparkline Marketing analyzes business concepts, audience segments, and unit economics:
- **No Individual PII**: The platform does not collect individual customer names, emails, credit cards, or phone numbers in project profiles.
- **Non-PII Notice**: Step 3 of the onboarding wizard explicitly informs users to submit demographic cohorts, not personally identifiable customer records.

