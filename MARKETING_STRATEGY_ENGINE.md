# Marketing Strategy Recommendation Engine Architecture
## Sparkline Marketing — Phase 11 Technical Blueprint

> **"Your Business Deserves a Smarter Marketing Strategy."**  
> *Combine business insights, audience intelligence, and market research into one prioritized marketing action plan.*

---

## 1. Architectural Overview

The **Marketing Strategy Recommendation Engine** is the central synthesis command center of Sparkline Marketing located at `/dashboard/strategy`. It synthesizes data across five upstream intelligence engines into one cohesive, prioritized, commercially grounded marketing action plan.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT BROWSER                                       │
│                                                                                        │
│   ┌──────────────────────────────────┐       ┌─────────────────────────────────────┐   │
│   │   MarketingStrategyPage.tsx      │ <───> │     UnifiedStrategyService          │   │
│   │   (Roadmap, Modes, Matrix, KPIs) │       │     (LocalStorage & Synthesis Sync) │   │
│   └────────────────┬─────────────────┘       └──────────────────┬──────────────────┘   │
└────────────────────┼────────────────────────────────────────────┼──────────────────────┘
                     │ HTTPS POST /api/generate-unified-strategy
                     │
┌────────────────────▼───────────────────────────────────────────────────────────────────┐
│                                 SERVER PROXY LAYER                                     │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │  ai-proxy-middleware.ts (Node.js / Vite Server Middleware)                     │   │
│   │  - Sliding Window IP Rate Limiting (10 req / 5 min)                            │   │
│   │  - Strict Zero-Leakage Credential Boundary (process.env.GEMINI_API_KEY)        │   │
│   │  - Multi-Engine Context Aggregation & Prompt Synthesis                         │   │
│   │  - Prudence Enforcer: Zero fabricated numbers, zero guaranteed ROI/ROAS        │   │
│   └────────────────────────────────────────┬───────────────────────────────────────┘   │
└────────────────────────────────────────────┼───────────────────────────────────────────┘
                                             │ Secure HTTPS (JSON Mode)
┌────────────────────────────────────────────▼───────────────────────────────────────────┐
│                           EXTERNAL LLM PROVIDER (GEMINI)                               │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │  Google Gemini 1.5 Flash                                                       │   │
│   │  - Full Multi-Channel Strategy Synthesis                                       │   │
│   │  - Three Strategic Growth Horizons (Lean, Balanced, Accelerated)               │   │
│   │  - Time-Bound Action Plan Tasks (Immediate, Short, Medium, Long)               │   │
│   │  - Mathematical KPI Framework with Measurement Formulas                        │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Five-Engine Multi-Source Synthesis

Rather than generating isolated, generic marketing advice, the engine synthesizes findings across five specialized platform sources:

1. **Business Profile & Economics (`projectService`)**:
   - Brand name, industry classification, business model (B2B, B2C, D2C).
   - Product pricing, unit economics, cost of goods, and margin thresholds.
   - Stated monthly marketing budget and high-level commercial objectives.

2. **Audience Intelligence & Personas (`audienceService`)**:
   - Primary and secondary target customer cohorts.
   - Acute customer pain points, buying objections, and purchase motivations.
   - Segment priority rankings and recommended messaging angles.

3. **Market Research & PESTLE Intelligence (`marketResearchService`)**:
   - Macro market demand indicators and verified industry growth trends.
   - Six-pillar PESTLE environmental and regulatory forces.
   - Category headwinds, CAC inflation dynamics, and verified academic/trade citations.

4. **Competitor Intelligence & Benchmarking (`competitorService`)**:
   - Direct and indirect competitor positioning matrix.
   - Incumbent weaknesses, pricing vacuums, and feature gaps.
   - 2x2 competitive positioning maps and multi-entity SWOT analyses.

5. **Strategic Horizons & Growth Modes**:
   - Alignment across Lean Growth, Balanced Growth, and Accelerated Growth modes.

---

## 3. Data Completeness & Module Contribution Audit

To ensure full epistemic transparency and avoid "hallucinated certainty" from sparse inputs, the engine performs a pre-generation completeness audit:

$$\text{Completeness Score} = \left(\frac{\sum_{i=1}^{6} M_i}{6}\right) \times 100$$

Where $M_i \in \{0, 1\}$ represents the presence of verified data across:
1. `businessProfile`
2. `productAnalysis`
3. `audienceIntelligence`
4. `marketResearch`
5. `competitorAnalysis`
6. `budgetSpecified`

The audit explicitly flags:
- **Contributing Modules**: Exactly which platform tools contributed verified intelligence.
- **Missing Modules**: Uncompleted modules with direct links to run those analyses.
- **Conflicting Signals**: E.g., B2B enterprise sales models paired with impulse TikTok channels without employee advocacy.
- **Unverified Assumptions**: Transparently discloses operational assumptions made in the absence of verified analytics.

---

## 4. Domain Data Model (`src/types/unified-strategy.ts`)

```typescript
export type StrategyModeType = 'lean' | 'balanced' | 'accelerated';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold';
export type TaskPeriod = 'immediate' | 'short_term' | 'medium_term' | 'long_term';

export interface UnifiedMarketingStrategy {
  id: string;
  projectId: string;
  projectName: string;
  strategyTitle: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  modelIdentifier: string;
  completenessAudit: DataCompletenessAudit;
  executiveSummary: StrategyExecutiveSummary;
  brandPositioning: StrategyBrandPositioning;
  targetAudienceStrategy: StrategyTargetAudience;
  channels: StrategyChannelItem[];
  contentStrategy: StrategyContentPlan;
  customerAcquisition: StrategyCustomerAcquisition;
  customerRetention: StrategyCustomerRetention;
  growthOpportunities: StrategyGrowthOpportunities;
  modes: {
    lean: StrategyModePlan;
    balanced: StrategyModePlan;
    accelerated: StrategyModePlan;
  };
  actionPlan: MarketingActionTask[];
  kpiFramework: StrategyKPI[];
  risksAndAssumptions: {
    risks: StrategyRisk[];
    assumptions: string[];
    limitations: string[];
  };
  supportingResearchReferences: StrategyEvidenceItem[];
}
```

---

## 5. Client Persistence Layer (`src/services/unified-strategy.service.ts`)

The service provides comprehensive LocalStorage persistence under key `sparkline_marketing_unified_strategies`:

- **Pre-Seeded Demonstration Strategies**:
  - `proj-vitamin-c` (*GlowBiome Organics*): Full-Funnel DTC Cosmeceutical Growth Strategy (2026–2027), 100% data audit, 6 prioritized channels, 10-task implementation roadmap, 6-metric KPI framework.
  - `proj-apex-cloud` (*ApexSec Cloud Intelligence*): Enterprise Multi-Cloud Security Go-To-Market Plan (2026), 83% audit, ABM motion, whitepaper funnel, CISO roundtable program.
- **Interactive Task Mutation**: `updateTaskStatus(strategyId, taskId, newStatus)` enables real-time checkbox status updates with LocalStorage sync and UI reactivity.
- **Graceful Offline Fallback**: In the absence of server credentials or network connectivity, a deterministic multi-engine synthesizer generates structured plans without runtime failure.

---

## 6. Server Proxy Middleware (`src/server/ai-proxy-middleware.ts`)

- **Route**: `POST /api/generate-unified-strategy`
- **Security**: Strict sliding-window rate limiting (10 req/5 min per IP), server-side environment credential isolation (`process.env.GEMINI_API_KEY`).
- **Prompt Engineering**: Enforces senior Chief Marketing Officer persona, strict JSON schema output, and zero tolerance for fabricated sales guarantees or ungrounded statistics.

