# Market Research & Industry Intelligence Engine Architecture
## Sparkline Marketing — Phase 09 Technical Blueprint

> **"Understand Your Market Before You Invest."**  
> Technical documentation for the Market Research & Industry Intelligence Engine powering Sparkline Marketing.

---

## 1. Architectural Overview

The **Market Research & Industry Intelligence Engine** is a core analytical capability of Sparkline Marketing. Located at `/dashboard/market-research`, it equips marketers, agencies, and entrepreneurs with structured, commercially grounded category intelligence before committing capital to marketing campaigns, product development, or channel expansion.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT BROWSER                                       │
│                                                                                        │
│   ┌────────────────────────────────┐         ┌─────────────────────────────────────┐   │
│   │   MarketResearchPage.tsx       │ <─────> │    MarketResearchService            │   │
│   │   (Input Tuning & Dashboard)   │         │    (LocalStorage & Vault Sync)      │   │
│   └──────────────┬─────────────────┘         └──────────────────┬──────────────────┘   │
└──────────────────┼──────────────────────────────────────────────┼──────────────────────┘
                   │ HTTPS POST /api/generate-market-research     │
                   │ HTTPS POST /api/research-assistant           │
┌──────────────────▼──────────────────────────────────────────────▼──────────────────────┐
│                                 SERVER PROXY LAYER                                     │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │  ai-proxy-middleware.ts (Node.js / Vite Server Middleware)                     │   │
│   │  - Sliding Window IP Rate Limiting (10 req / 5 min)                            │   │
│   │  - Payload Validation & Sanitization                                           │   │
│   │  - Strict Zero-Leakage Credential Boundary (process.env.GEMINI_API_KEY)        │   │
│   │  - Epistemic Integrity Enforcer (No Fake Search Volumes)                       │   │
│   └────────────────────────────────────────┬───────────────────────────────────────┘   │
└────────────────────────────────────────────┼───────────────────────────────────────────┘
                                             │ Secure HTTPS (JSON Mode)
┌────────────────────────────────────────────▼───────────────────────────────────────────┐
│                           EXTERNAL LLM PROVIDER (GEMINI)                               │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │  Google Gemini 1.5 Flash (temperature 0.3 for research, 0.2 for assistant)     │   │
│   │  - Industry Overview & Qualitative Demand Signals                              │   │
│   │  - 6-Pillar PESTLE Factor Modeling                                             │   │
│   │  - Multi-Dimensional Opportunity Scoring                                       │   │
│   │  - Verified Source Grounding & Interactive Q&A Assistant                       │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Capabilities & Page Routing

### 2.1 Route & Entry Point
- **Route**: `/dashboard/market-research`
- **Component**: `src/pages/dashboard/MarketResearchPage.tsx`
- **Page Heading**: `Understand Your Market Before You Invest.`
- **Supporting Description**: *"Discover industry conditions, identify opportunities, understand market demand, and make more informed marketing decisions."*

### 2.2 Deep Linking & Project Switching
The page reads the query parameter `?project=:projectId` on mount. Switching projects immediately re-binds:
1. Available historical reports stored under `sparkline_marketing_research_reports`.
2. Default market inputs (Industry, Product Category, Regions Served, Price Range, Target Segment, Competitors).

---

## 3. Data Models & TypeScript Contracts

All market research models are strictly typed in [`src/types/market-research.ts`](file:///c:/Users/IIS/OneDrive/Desktop/Sparkline%20Marketing%20Website/src/types/market-research.ts):

| Interface | Description | Key Attributes |
| :--- | :--- | :--- |
| `MarketResearchReport` | Root persistent intelligence entity | `id`, `projectId`, `reportTitle`, `version`, `researchDepth`, `industryOverview`, `marketDemand`, `trends`, `opportunities`, `pestle`, `challenges`, `sources`, `assistantChatHistory` |
| `PestleFactor` | Environmental & macro factor | `category` (6 pillars), `factorTitle`, `potentialImpact`, `businessRelevance`, `type` (`Opportunity` \| `Threat`), `confidenceLevel`, `evidenceOrSource` |
| `MarketOpportunity` | Commercial growth vector | `title`, `category`, `customerRelevance`, `businessFit`, `evidenceStrength`, `implementationEffort`, `strategicValue`, `riskLevel`, `priority`, `suggestedNextAction` |
| `MarketDemandSignals` | Qualitative & intent indicators | `demandIndicators`, `searchInterestSignals`, `customerNeedsSummary`, `primaryBuyingMotivations`, `seasonalDemandPatterns`, `geographicDemandDifferences` |
| `MarketTrendItem` | Verified emerging category shifts | `trendTitle`, `category`, `publicationDate`, `sourceTitle`, `sourceUrl`, `isExternalSourceVerified` |
| `MarketChallengeItem` | Known barrier or category friction | `title`, `category`, `severity`, `verificationNeeded`, `mitigationRecommendation` |
| `ResearchSourceReference` | Verifiable bibliography reference | `sourceTitle`, `publisherOrWebsite`, `sourceUrl`, `publicationDate`, `accessDate`, `relevantClaim`, `researchCategory`, `sourceType`, `isVerified` |
| `ResearchAssistantMessage` | Grounded Q&A conversation node | `id`, `role`, `content`, `timestamp`, `citedSourceIds`, `isStrategicReasoning` |

---

## 4. Server-Side Proxy Endpoints

The server middleware in `src/server/ai-proxy-middleware.ts` exposes two dedicated endpoints:

### 4.1 `POST /api/generate-market-research`
- **Payload**: `{ project: MarketingProject, customInputs: MarketResearchInput }`
- **Rate Limit**: 10 requests per 5-minute sliding window per IP.
- **Timeout**: 45-second `AbortController`.
- **System Instructions**:
  - Enforces qualitative demand indicators over synthetic metrics.
  - Generates full 6-pillar PESTLE factors.
  - Scores market opportunities across 6 transparent dimensions.
  - Populates source bibliography references.
- **Response**: `{ ok: true, report: MarketResearchReport, model: 'gemini-1.5-flash' }`

### 4.2 `POST /api/research-assistant`
- **Payload**: `{ report: MarketResearchReport, question: string, history?: ResearchAssistantMessage[] }`
- **Grounding**: Compresses the active report's executive summary, demand indicators, trends, PESTLE factors, opportunities, and sources into the prompt context.
- **Epistemic Discipline**: Distinguishes sourced facts from strategic inference; returns array of `citedSourceIds`.
- **Response**: `{ ok: true, answer: string, citedSourceIds: string[] }`

---

## 5. Client Persistence & Demo Blueprints

All generated and pre-seeded reports are saved under `sparkline_marketing_research_reports` in `localStorage`. Two pre-seeded demonstration reports illustrate complete analytical depth:
1. **`proj-vitamin-c` (GlowBiome Organics — Clean Skincare)**:
   - 4 Industry Characteristics (65-78% gross margins, 45-60 day repurchase cycles).
   - 5 Scored Opportunities (Microbiome-friendly formulations, Nitrogen flush packaging).
   - Complete 6-Pillar PESTLE Analysis (MoCRA compliance, eco-glass packaging).
   - Authoritative citations (FDA MoCRA Registry, Vogue Business, Statista).
2. **`proj-apex-cloud` (ApexSec Cloud Intelligence — Cloud Security SaaS)**:
   - Cloud security posture management (CSPM) and automated remediation dynamics.
   - PESTLE analysis covering EU NIS2 Directive, SEC cyber disclosure rules, and multi-cloud sprawl.
   - Authoritative citations (Gartner Hype Cycle, CISA Cloud Security Guidelines, IDC Research).

---

## 6. Verification & Type Safety

- **TypeScript Strict Mode**: 100% type-checked with `npx tsc --noEmit` (zero errors).
- **Production Bundle**: Bundled cleanly into `dist/assets/MarketResearchPage-*.js` (87.71 kB / 23.40 kB gzipped).
- **In-Process Proxy Test Suite**: Verified via `test-inprocess.cjs` confirming rate limiting, API key validation, error codes, and response schemas.

