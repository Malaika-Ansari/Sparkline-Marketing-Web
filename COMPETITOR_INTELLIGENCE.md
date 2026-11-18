# Competitor Intelligence & Benchmarking Engine Architecture
## Sparkline Marketing — Phase 10 Technical Blueprint

> **"Know Your Competition. Find Your Advantage."**  
> Technical documentation for the Competitor Intelligence, SWOT & Competitive Analysis Engine in Sparkline Marketing.

---

## 1. Architectural Overview

The **Competitor Intelligence Engine** is a core capability of Sparkline Marketing located at `/dashboard/competitors`. It enables growth marketers, agencies, and founders to systematically map their competitive landscape, manage competitor profiles, compare market positioning, run multi-entity SWOT analyses, visualize 2x2 positioning maps, uncover actionable competitive gaps, and interact with a grounded **Competitive Intelligence AI Assistant**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT BROWSER                                       │
│                                                                                        │
│   ┌──────────────────────────────────┐       ┌─────────────────────────────────────┐   │
│   │  CompetitorIntelligencePage.tsx  │ <───> │     CompetitorService               │   │
│   │  (Comparison, SWOT, 2x2 Map, QA) │       │     (LocalStorage & Vault Sync)     │   │
│   └────────────────┬─────────────────┘       └──────────────────┬──────────────────┘   │
└────────────────────┼────────────────────────────────────────────┼──────────────────────┘
                     │ HTTPS POST /api/generate-competitor-analysis
                     │ HTTPS POST /api/competitor-assistant
                     │ HTTPS POST /api/discover-competitors
┌────────────────────▼────────────────────────────────────────────▼──────────────────────┐
│                                 SERVER PROXY LAYER                                     │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │  ai-proxy-middleware.ts (Node.js / Vite Server Middleware)                     │   │
│   │  - Sliding Window IP Rate Limiting (10 req / 5 min)                            │   │
│   │  - Strict Zero-Leakage Credential Boundary (process.env.GEMINI_API_KEY)        │   │
│   │  - Payload Validation & Sanitization                                           │   │
│   │  - Epistemic Integrity Enforcer (No Fake Names, No Private Analytics Claims)   │   │
│   └────────────────────────────────────────┬───────────────────────────────────────┘   │
└────────────────────────────────────────────┼───────────────────────────────────────────┘
                                             │ Secure HTTPS (JSON Mode)
┌────────────────────────────────────────────▼───────────────────────────────────────────┐
│                           EXTERNAL LLM PROVIDER (GEMINI)                               │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │  Google Gemini 1.5 Flash                                                       │   │
│   │  - Structured Side-by-Side Competitor Comparison Matrix                        │   │
│   │  - Multi-Entity SWOT Analyses (User Business + Competitors)                    │   │
│   │  - 8-Dimension Positioning Analysis & 2x2 Spatial Coordinates                  │   │
│   │  - Asymmetric Opportunity Scoring & Actionable Counter-Positioning             │   │
│   │  - Grounded Competitor Q&A Assistant                                           │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Capabilities & Page Routing

### 2.1 Route & Entry Point
- **Route**: `/dashboard/competitors`
- **Component**: `src/pages/dashboard/CompetitorIntelligencePage.tsx`
- **Page Heading**: `Know Your Competition. Find Your Advantage.`
- **Supporting Description**: *"Understand competing businesses, compare market positioning, identify weaknesses, and uncover opportunities to stand out."*

### 2.2 Deep Linking & Project Switching
The page reads the query parameter `?project=:projectId` on mount. Switching projects automatically synchronizes:
1. Associated competitor profiles stored under `sparkline_marketing_project_competitors`.
2. Historical competitor reports stored under `sparkline_marketing_competitor_reports`.
3. Business profile and unit economics defaults.

---

## 3. Data Models & TypeScript Contracts

All competitor intelligence models are strictly defined in [`src/types/competitor.ts`](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/src/types/competitor.ts):

| Interface | Description | Key Attributes |
| :--- | :--- | :--- |
| `CompetitorProfile` | Individual rival profile | `id`, `projectId`, `name`, `websiteUrl`, `industry`, `locationOrMarket`, `relationship` (`Direct` \| `Indirect`), `productDescription`, `pricingInfo`, `mainSellingPoints`, `knownStrengths`, `knownWeaknesses`, `notes`, `isUserEntered`, `researchStatus` |
| `CompetitorComparisonRow` | Comparison matrix row | `competitorId`, `competitorName`, `relationship`, `productCategory`, `targetAudience`, `pricingPosition`, `mainValueProposition`, `brandPositioning`, `marketingChannels`, `publiclyObservedStrengths`, `publiclyObservedWeaknesses`, `differentiationOpportunities` |
| `SWOTAnalysis` | Comprehensive SWOT entity | `entityId`, `entityName`, `isUserBusiness`, `strengths`, `weaknesses`, `opportunities`, `threats`, `strategicTakeaway` |
| `SWOTPoint` | Specific SWOT factor | `id`, `point`, `explanation`, `isVerified` (boolean), `confidenceLevel`, `sourceCitation` |
| `PositioningAnalysis` | Multi-dimensional analysis | `dimensions` (8 criteria), `positioningMap` (2x2 spatial coordinates: 0-100 on X and Y axes), `descriptiveNarrative` |
| `CompetitiveOpportunity` | Actionable commercial opening | `id`, `title`, `category`, `description`, `supportingEvidence`, `businessRelevance`, `potentialValue`, `implementationEffort`, `priority`, `confidence`, `suggestedNextAction` |
| `CompetitorSource` | Verifiable bibliography reference | `id`, `competitorName`, `sourceTitle`, `publisherOrWebsite`, `sourceUrl`, `publicationDate`, `accessDate`, `relevantObservation`, `sourceCategory`, `isVerified` |
| `CompetitorAssistantMessage` | Grounded Q&A conversation node | `id`, `role`, `content`, `timestamp`, `citedSourceIds`, `isStrategicReasoning` |
| `CompetitorAnalysisReport` | Root persistent benchmark report | Full assembled report containing comparison rows, SWOTs, positioning map, opportunities, sources, and assistant chat history. |

---

## 4. Server-Side Proxy Endpoints

The server middleware in `src/server/ai-proxy-middleware.ts` exposes three dedicated endpoints:

### 4.1 `POST /api/generate-competitor-analysis`
- **Payload**: `{ project: MarketingProject, competitors: CompetitorProfile[], customInputs?: Record<string, any> }`
- **Rate Limit**: 10 requests per 5-minute sliding window per IP.
- **Timeout**: 45-second `AbortController`.
- **System Instructions**:
  - Grounded strictly in real-world public positioning and product attributes.
  - Generates comparison rows across all rivals + user business.
  - Builds separate SWOT analyses for user business + each competitor.
  - Computes 8-dimension positioning breakdown and 2x2 positioning map.
  - Scores competitive opportunities with concrete next actions.
- **Response**: `{ ok: true, report: CompetitorAnalysisReport, model: 'gemini-1.5-flash' }`

### 4.2 `POST /api/competitor-assistant`
- **Payload**: `{ report: CompetitorAnalysisReport, question: string, history?: CompetitorAssistantMessage[] }`
- **Grounding**: Injects active report's comparison rows, SWOT points, positioning narrative, and verified sources into context.
- **Response**: `{ ok: true, answer: string, citedSourceIds: string[] }`

### 4.3 `POST /api/discover-competitors`
- **Payload**: `{ project: MarketingProject, industry: string, market: string }`
- **Integrity Rule**: Never invents fake companies. Discovers 3-4 real, verifiable market rivals.
- **Response**: `{ ok: true, competitors: CompetitorProfile[] }`

---

## 5. Client Persistence & Demonstration Blueprints

Data is stored locally under:
- `sparkline_marketing_project_competitors`: Configured competitor profiles.
- `sparkline_marketing_competitor_reports`: Synthesized competitive intelligence reports.

Two pre-seeded reference reports demonstrate complete benchmark depth:
1. **`proj-vitamin-c` (GlowBiome Organics — Clean Skincare)**:
   - Direct rivals: SkinCeuticals ($182 C E Ferulic) and Drunk Elephant ($79 C-Firma Fresh); Indirect rival: Sunday Riley ($85 C.E.O.).
   - Full 4-quadrant SWOT for all 4 entities.
   - 2x2 Positioning Map plotting Price Tier vs. Active Stability/Barrier Protection.
   - 3 Scored Competitive Opportunities (Dropper oxidation video ads, $58 anchor search landing page, hassle-free pump messaging).
2. **`proj-apex-cloud` (ApexSec Cloud Intelligence — Cloud Security SaaS)**:
   - Direct rivals: Wiz ($60k-$200k/yr CSPM) and Palo Alto Networks Prisma Cloud; Indirect rival: Snyk.
   - Full SWOT analysis, 8-dimension positioning matrix, and automated remediation differentiation playbooks.

---

## 6. Verification & Type Safety

- **TypeScript Strict Mode**: 100% type-checked with `npx tsc --noEmit` (zero errors).
- **Production Build**: Bundled cleanly into `dist/assets/CompetitorIntelligencePage-*.js` (91.97 kB / 23.23 kB gzipped).
- **In-Process Proxy Test Suite**: Verified via `test-inprocess.cjs` confirming rate limiting, API key validation, error codes, and response schemas.

