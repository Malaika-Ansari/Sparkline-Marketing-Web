# Sparkline Marketing — AI Strategist Architecture

This document specifies the technical architecture, execution pipeline, and backend proxy integration for the **AI Marketing Strategist Engine** (Phase 07).

---

## 1. System Overview

The AI Marketing Strategist Engine translates structured business profiles, unit economics, audience psychology, and commercial constraints into a multi-channel growth playbook.

```
+-----------------------------------------------------------------------------------------+
|                                    CLIENT APPLICATION                                   |
+-----------------------------------------------------------------------------------------+
|  1. Project Context Selector (`projectService.getProjects()`)                          |
|  2. Information Readiness Audit (validates brand, products, USP, audience, budget)      |
|  3. Strategy Generation Trigger & Real States (idle -> preparing -> analyzing -> saving)|
|  4. Strategy Persistence Layer (`strategyService` / `localStorage`)                     |
|  5. Multi-View Results Presentation (Approaches, Channels, Funnel, Actions, Risks)      |
+-----------------------------------------------------------------------------------------+
                                          |
                              HTTP POST /api/generate-strategy
                              HTTP GET  /api/ai-status
                                          v
+-----------------------------------------------------------------------------------------+
|                         SERVER-SIDE AI PROXY MIDDLEWARE                                 |
|                         (`src/server/ai-proxy-middleware.ts`)                           |
+-----------------------------------------------------------------------------------------+
|  - Rate Limiting: 10 requests / 5 minutes per IP window                                |
|  - Payload Validation & Sanitization (defensive size & schema guard <= 2MB)             |
|  - Secret Isolation: Reads `GEMINI_API_KEY` from Node `process.env`                     |
|  - Setup State Handling: Returns 401 `API_KEY_NOT_CONFIGURED` if key is missing         |
|  - Prompt Orchestration & JSON Schema Injection                                         |
+-----------------------------------------------------------------------------------------+
                                          |
                              HTTPS (TLS 1.3) with 45s Timeout
                                          v
+-----------------------------------------------------------------------------------------+
|                                 GOOGLE GEMINI API                                       |
|                  (`models/gemini-1.5-flash:generateContent`)                           |
+-----------------------------------------------------------------------------------------+
|  - Response Mime Type: `application/json`                                               |
|  - Low Temperature (0.3) for deterministic, grounded outputs                            |
|  - Structured multi-pillar strategy generation                                          |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Server-Side Proxy Design

### 2.1 Security & Credential Isolation
- **No Client Exposure**: The Gemini API key (`GEMINI_API_KEY`) is never injected into `import.meta.env`, never bundled into client JavaScript, never written to `localStorage`, and never logged in console outputs.
- **Node.js Environment Only**: The key is accessed strictly on the server in `src/server/ai-proxy-middleware.ts`.
- **Protected Endpoints**:
  1. `GET /api/ai-status`: Probes key presence without returning the secret itself. Returns `{ ok: true, isConfigured: boolean, provider: "Google Gemini", model: "gemini-1.5-flash" }`.
  2. `POST /api/generate-strategy`: Accepts sanitized project payloads, validates input schema, enforces rate limits, queries Gemini, validates response schema, and returns a type-safe `GeneratedMarketingStrategy`.

### 2.2 Rate Limiting & Denial-of-Service Defense
- In-memory sliding window bucket tracker per remote IP address (`RATE_LIMIT_WINDOW_MS = 300,000` / 5 minutes).
- Maximum 10 generation requests allowed per window.
- Payloads exceeding 2 megabytes are rejected with `HTTP 413 Payload Too Large`.

---

## 3. Client-Side State Machine

The strategist UI strictly avoids simulated progress bars or fake percent counters. It implements real sequential state transitions:

```
  +--------------+
  |     IDLE     | <-------------------------------------+
  +--------------+                                       |
         | (User clicks "Generate Strategy with AI")     |
         v                                               |
  +--------------+                                       |
  |  PREPARING   | (Serializes project parameters)       |
  +--------------+                                       |
         |                                               |
         v                                               |
  +--------------+                                       |
  |  ANALYZING   | (Awaiting Gemini API response)        |
  +--------------+                                       |
         |                                               |
         +-----------------------------+                 |
         |                             |                 |
     (Success)                      (Error)              |
         v                             v                 |
  +--------------+              +--------------+         |
  |    SAVING    |              |    FAILED    | --------+ (Retry)
  +--------------+              +--------------+
         |                       (Shows error reason &
         v                        actionable fix)
  +--------------+
  |  COMPLETED   |
  +--------------+
  (Renders strategy & saves version to history)
```

---

## 4. Unconfigured Credentials & Setup State

When `GEMINI_API_KEY` is not present in `.env`:
1. The server responds with `HTTP 401 Unauthorized` and error code `API_KEY_NOT_CONFIGURED`.
2. The user interface displays a clearly labeled setup state card:
   - Direct instructions on setting `GEMINI_API_KEY="your_key"` in `.env`.
   - Direct link to obtain a free key at [Google AI Studio](https://aistudio.google.com).
   - "Test Status" action button.
3. Pre-seeded reference blueprint strategies remain available in the version dropdown so developers and evaluators can explore the full results interface without waiting for an API key.

---

## 5. Storage & Versioning Mechanics

Generated strategies are stored in `localStorage` under `sparkline_marketing_strategies`:
- Key: `sparkline_marketing_strategies`
- Format: Array of `GeneratedMarketingStrategy` objects.
- Multiple strategies per project are supported with auto-incrementing `version` integers (`v1`, `v2`, etc.).
- Pre-seeded with two verified reference blueprints:
  - `strat-vitamin-c-001` for `proj-vitamin-c` (*GlowBiome Organics*)
  - `strat-apex-cloud-001` for `proj-apex-cloud` (*ApexSec Cloud Intelligence*)

