# Prioritized Marketing Action Plan Framework
## Sparkline Marketing — Phase 11 Operational Guide

> **"A strategy without execution is just an expensive hallucination."**  
> *How Sparkline Marketing structures, sequences, and tracks marketing execution across four implementation horizons.*

---

## 1. Time-Bound Implementation Horizons

Every marketing strategy generated in Sparkline distributes tasks across four distinct temporal phases:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              STRATEGIC EXECUTION TIMELINE                              │
│                                                                                        │
│   Weeks 1–2               Weeks 3–6               Months 2–3              Months 4–6   │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐        ┌───────────┐ │
│  │  IMMEDIATE   │ ─────> │  SHORT-TERM  │ ─────> │ MEDIUM-TERM  │ ─────> │ LONG-TERM │ │
│  │ Foundation & │        │ Acquisition  │        │ Retention &  │        │ Scale &   │ │
│  │ Conversion   │        │ Launchpad    │        │ Optimization │        │ Expansion │ │
│  └──────────────┘        └──────────────┘        └──────────────┘        └───────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Phase 1: Immediate Tasks (Weeks 1–2)
- **Objective**: Establish foundational conversion architecture, tracking integrity, and post-purchase retention flows before capital is risked.
- **Typical Tasks**:
  - Landing page value proposition teardown and headline testing.
  - Automated post-purchase welcome sequence (Days 1, 7, 21).
  - High-intent exact-match PPC campaign setup.
  - Analytics event verification (GA4 purchase tracking, Meta CAPI).

### Phase 2: Short-Term Tasks (Weeks 3–6)
- **Objective**: Launch primary customer acquisition channels and generate initial qualified conversion velocity.
- **Typical Tasks**:
  - Creator and dermatologist product seeding program.
  - Interactive lead generation quiz deployment.
  - Publication of initial high-intent SEO educational guides.
  - Broad creative angle testing on paid social channels.

### Phase 3: Medium-Term Tasks (Months 2–3)
- **Objective**: Maximize Customer Lifetime Value (LTV), automate replenishment cycles, and deploy advanced retargeting.
- **Typical Tasks**:
  - VIP replenishment auto-ship subscription program deployment.
  - Dynamic Creative Optimization (DCO) for catalog retargeting.
  - Commissioning independent laboratory assays or third-party audit certificates.
  - Customer review collection and referral program launch.

### Phase 4: Long-Term Tasks (Months 4–6)
- **Objective**: Expand market boundaries, unlock omni-channel distribution, and launch product line extensions.
- **Typical Tasks**:
  - Retail wholesale pitch deck preparation (Credo, Sephora, Target).
  - International direct-to-consumer localization (UK, EU, Canada).
  - High-touch executive roundtable dinners or industry conference sponsorships.
  - Complementary product line or enterprise tier launches.

---

## 2. Anatomy of a Marketing Action Task

Every task object in the `actionPlan` schema contains twelve structured attributes:

```typescript
export interface MarketingActionTask {
  id: string;                         // Unique task identifier (e.g., 'task-1')
  title: string;                      // Clear, imperative task headline
  description: string;                // Detailed explanation of execution requirements
  reasonForRecommendation: string;    // Strategic rationale linking to audit/research
  priority: ImpactPriority;           // 'High' | 'Medium' | 'Low'
  estimatedEffort: 'Low' | 'Medium' | 'High'; // Resource and engineering bandwidth
  period: TaskPeriod;                 // 'immediate' | 'short_term' | 'medium_term' | 'long_term'
  suggestedStartPeriod: string;       // e.g., 'Week 1'
  suggestedCompletionPeriod: string;  // e.g., 'Week 2'
  requiredResources: string;          // Tools, assets, and third-party integrations needed
  responsibleRole: string;            // Primary owner (e.g., 'Growth Marketer', 'PPC Lead')
  successMetric: string;              // Concrete, measurable definition of done
  dependencyOnOtherTasks: string;     // Prerequisite task or 'None'
  status: TaskStatus;                 // 'not_started' | 'in_progress' | 'completed' | 'on_hold'
}
```

---

## 3. Interactive Task State Machine

Users interact with task states directly inside the `/dashboard/strategy` interface. State mutations immediately update LocalStorage:

```
┌──────────────┐      Start Task      ┌──────────────┐      Complete Task      ┌───────────────┐
│ NOT STARTED  │ ───────────────────> │ IN PROGRESS  │ ──────────────────────> │   COMPLETED   │
└──────────────┘                      └──────────────┘                         └───────────────┘
       │                                     │                                         │
       │                                     ▼                                         │
       │                              ┌──────────────┐                                 │
       └────────────────────────────> │   ON HOLD    │ <───────────────────────────────┘
                                      └──────────────┘
```

- **Not Started**: Default state upon strategy generation.
- **In Progress**: Active execution; shows blue indicator badge.
- **Completed**: Strike-through headline, emerald background, updates progress bar.
- **On Hold**: Paused pending external dependency or resource availability.

