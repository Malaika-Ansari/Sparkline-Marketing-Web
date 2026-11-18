# Sparkline Marketing Intelligence Platform
## AI Model Integration Security & Prompt Defense Architecture
**Phase: Prompt 22 of 25 — Database Architecture, Permissions & Advanced Security**

---

### 1. Architectural Overview

Sparkline Marketing integrates Google Gemini (`gemini-1.5-flash`) for automated marketing strategy synthesis, audience persona generation, competitor intelligence, and SEO content optimization.

Because AI models are vulnerable to prompt injection, data poisoning, and unauthorized key extraction, all AI operations are mediated through a **secure server-side gateway** (`src/server/ai-proxy-middleware.ts`).

```
[Client Browser]
       |
       | POST /api/generate-strategy (Project Parameters)
       v
+-------------------------------------------------------------+
|               Sparkline AI Proxy Gateway                    |
|  - Validates user input structure                           |
|  - Sanitizes against adversarial prompt injection           |
|  - Injects GEMINI_API_KEY from server environment only       |
|  - Enforces 5-minute sliding rate limits                    |
+-------------------------------------------------------------+
       |
       | HTTPS POST to Google Gemini API (api.generativeai.google)
       v
+-------------------------------------------------------------+
|              Google Gemini 1.5 Flash Model                  |
|  - Processes sanitized prompt with strict schema constraints|
+-------------------------------------------------------------+
       |
       | Structured JSON Response
       v
+-------------------------------------------------------------+
|               Schema & Output Sanitization                  |
|  - Verifies JSON structure against TypeScript domain models |
|  - Tags output as 'AI recommendation' data provenance       |
+-------------------------------------------------------------+
       |
       v
[Client Application Receives Verified Strategy Plan]
```

---

### 2. Core Security Requirements

#### 2.1 Server-Side Execution & Key Confidentiality
- `GEMINI_API_KEY` is loaded strictly via Node.js `process.env.GEMINI_API_KEY`.
- The key is **never bundled** into the client-side JavaScript artifact or exposed via `VITE_` prefixed variables.
- The endpoint `/api/ai-status` returns only a boolean `isConfigured: true/false`, never returning partial key fragments or secret lengths.

#### 2.2 Adversarial Prompt Injection Neutralization
External research content, imported competitor copy, and user freeform notes are treated as **untrusted data**. Before string interpolation into the model prompt, inputs pass through `sanitizePromptInput()`:
```typescript
function sanitizePromptInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/(?:ignore|disregard|forget|override)\s+(?:all\s+)?(?:previous|prior|system)\s+(?:instructions|prompts|rules)/gi, '[REDACTED_PROMPT_INJECTION]')
    .replace(/(?:you are now|act as)\s+(?:a|an)?\s*(?:unrestricted|jailbroken|dan|developer mode)/gi, '[REDACTED_PROMPT_INJECTION]')
    .trim();
}
```
This prevents malicious third-party content (e.g. competitor website meta tags containing jailbreak payloads) from overriding the system instructions.

#### 2.3 Strict Separation of AI Recommendations from Verified Data
In accordance with Sparkline's Data Provenance Framework (Prompt 20):
- AI outputs are tagged strictly with provenance `AI recommendation` or `AI interpretation`.
- Core financial calculations (ROAS, break-even points, budget balancing) are executed deterministically in pure TypeScript calculations and are **never delegated to LLM hallucination**.
- In PDF reports, AI recommendations are visually styled with distinct badges and explicit confidence disclaimers.

#### 2.4 Structured Output Schema Validation
- All Gemini API prompts mandate strict JSON outputs using system prompt directives.
- When the model returns a response, the proxy cleans markdown fences (```json ... ```) and executes JSON parsing with fallback validation before transmitting payload to the client.
- Malformed model responses return a clean HTTP 422 error, preventing application crash loops.

#### 2.5 Resilient Fallback Architecture
- If `GEMINI_API_KEY` is unconfigured, rate-limited, or unavailable:
  - The platform does not break.
  - The system transitions to **Deterministic Strategic Rule Sets** (developed in Prompts 06–16), providing users with mathematically sound action plans without cloud model dependency.

