# Sparkline Competitor Research & Epistemic Boundary Policy
## Standards for Competitive Observation, Public Data Boundaries, and Integrity

> **"Ethical Observation. Verifiable Signals. Zero Fictional Intelligence."**  
> Operational boundaries and ethical standards governing competitor research in Sparkline Marketing.

---

## 1. Ethical Observation & Data Boundaries

Competitive intelligence is only valuable when grounded in verifiable facts. Fabricating competitor pricing, pretending to possess private analytics, or hacking competitor accounts undermines strategic credibility and violates regulatory standards.

Sparkline Marketing enforces four inviolable boundaries:

1. **Strict Public Data Scope**:
   - The platform analyzes **only** publicly accessible competitor information:
     - Public website positioning and messaging.
     - Public product lines, features, and specs.
     - Public pricing tiers and subscription options.
     - Publicly visible content strategies and blogs.
     - Public social media channels and customer community reviews.
     - Public promotions, guarantees, and offers.

2. **Prohibition of Private Data Claims**:
   - The platform **never** claims access to private competitor advertising accounts, Meta Ad Manager spend, internal sales dashboards, Google Analytics sessions, conversion rates, or customer CRM databases.
   - Any reference to competitor ad budgets or market share must be clearly labeled as an **analytical category estimate** based on industry benchmarks.

3. **No Circumvention of Access Controls**:
   - The engine never bypasses website paywalls, terms of service restrictions, login credentials, or CAPTCHAs.

4. **Never Invent Competitors**:
   - When competitor discovery is requested, the system discovers **only real, verifiable commercial entities** operating in that market. The platform never creates fictional competitor brands.

---

## 2. Distinguishing User-Entered vs. Externally Researched Data

Every competitor data element in Sparkline Marketing carries an explicit origin classification:

| Data Type | Visual Representation | Description |
| :--- | :--- | :--- |
| **User-Entered** | `User Entered` (Slate Badge) | Data directly supplied by the business owner (internal notes, direct interactions, historical pricing observations). |
| **Externally Researched** | `Researched` (Cyan Badge) | Data observed from public websites, regulatory filings, or established consumer review repositories. |
| **AI Strategic Hypothesis** | `AI Hypothesis` (Purple Badge) | Analytical inferences, positioning deductions, and counter-positioning opportunities synthesized by the Sparkline model. |

---

## 3. Handling Missing or Incomplete Information

When public evidence for a competitor dimension (e.g. enterprise pricing, discount cadence) is unavailable:
- The platform **never** invents an arbitrary placeholder number.
- The comparison table explicitly displays **"Unknown"** or **"Not researched"**.
- This transparent acknowledgment preserves user trust and signals areas requiring manual customer interviews or direct sales inquiries.

---

## 4. Citation Requirements for Competitor Observations

Every observation in the report bibliography must include:
```typescript
export interface CompetitorSource {
  id: string;                      // e.g. "src-comp-1"
  competitorId?: string;           // Associated competitor ID
  competitorName?: string;         // Rival brand name
  sourceTitle: string;             // Exact title of webpage or review page
  publisherOrWebsite: string;      // Domain or publication entity
  sourceUrl: string;               // Direct canonical URL
  publicationDate?: string;        // Date of observation / article
  accessDate: string;              // Retrieval date
  relevantObservation: string;     // Exact public fact validated
  sourceCategory: ObservationType; // Pricing | Positioning | Reviews | Messaging
  isVerified: boolean;             // Verification flag
}
```

---

## 5. Security & Prompt Injection Defense

Competitor website copy and public reviews represent **untrusted external data**:
- All competitor inputs are sanitized and escaped before injection into LLM prompts.
- Prompts enforce strict delimiters (`=== COMPETITORS TO BENCHMARK ===`) preventing external text from overriding system safety instructions.
- Secrets (`GEMINI_API_KEY`) remain strictly isolated on the Node server and are never delivered to the client.

