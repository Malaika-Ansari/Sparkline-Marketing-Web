# Sparkline Marketing — Audience & Customer Persona Data Models

This document defines the TypeScript interfaces, field constraints, and persistence architecture for the **Target Audience & Customer Persona Analyzer** (Phase 08).

---

## 1. Domain Model Hierarchy

```
AudienceAnalysis (Aggregate Root)
├── inputSnapshot (AudienceAnalysisInput)
├── segments[] (AudienceSegment)
├── personas[] (CustomerPersona)
│   ├── characteristics (PersonaCharacteristics)
│   ├── psychology (PersonaPsychology)
│   ├── marketingBehavior (PersonaMarketingBehavior)
│   └── recommendations (PersonaMarketingRecommendations)
├── customerJourney[] (CustomerJourneyStage, 6 Stages)
├── messaging[] (AudienceMessage)
│   └── alternativeAngles (AudienceMessageAngles)
├── channels[] (AudienceChannelRecommendation)
├── unverifiedAssumptions[] (string)
└── limitationsAndMissingData[] (string)
```

---

## 2. Core Interfaces & Type Listings

All interfaces are strictly defined in `src/types/audience.ts` and exported via `src/types/index.ts`.

### 2.1 Enumerations
```typescript
export type MarketType = 'Local' | 'National' | 'International';
export type CustomerModelType = 'B2B' | 'B2C' | 'Both';
export type SegmentPriority = 'High' | 'Medium' | 'Low';
export type JourneyStageName =
  | 'Awareness'
  | 'Interest'
  | 'Consideration'
  | 'Purchase'
  | 'Retention'
  | 'Advocacy';
```

### 2.2 AudienceSegment
```typescript
export interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  mainCustomerNeed: string;
  painPoints: string[];
  purchaseMotivation: string;
  buyingBehavior: string;
  potentialObjections: string[];
  productRelevance: string;
  recommendedMessaging: string;
  suitableChannels: string[];
  contentPreferences: string[];
  suggestedCta: string;
  strategicPriority: SegmentPriority;
  isHypothesis: boolean; // Always true for AI-generated segments
}
```

### 2.3 CustomerPersona
```typescript
export interface CustomerPersona {
  id: string;
  segmentId: string;
  personaName: string; // Fictional persona archetype name
  segmentName: string;
  tagline: string;
  avatarColor: string;
  isFictional: boolean; // Confirms persona is a fictional composite
  characteristics: PersonaCharacteristics;
  psychology: PersonaPsychology;
  marketingBehavior: PersonaMarketingBehavior;
  recommendations: PersonaMarketingRecommendations;
}
```

### 2.4 CustomerJourneyStage
```typescript
export interface CustomerJourneyStage {
  stage: JourneyStageName;
  stageNumber: number; // 1 to 6
  customerMindset: string;
  mainQuestion: string;
  possibleObstacle: string;
  recommendedMarketingActivity: string;
  suitableContentFormat: string;
  recommendedChannel: string;
  relevantKpi: string;
}
```

### 2.5 AudienceMessage
```typescript
export interface AudienceMessage {
  segmentId: string;
  segmentName: string;
  mainMessage: string;
  alternativeAngles: {
    painPointFocused: string;
    benefitFocused: string;
    emotionalAngle: string;
    educationalAngle: string;
  };
  callToActionExamples: string[];
  recommendedToneOfVoice: string;
}
```

---

## 3. Storage Keys & Future Database Schema

1. **Current LocalStorage Keys**:
   - `sparkline_marketing_audience_analyses`: Stores array of `AudienceAnalysis` records.
   - `sparkline_marketing_saved_personas`: Stores user-bookmarked `CustomerPersona` records.
2. **Future Relational Cloud Schema (PostgreSQL / Supabase)**:
   - `audience_analyses` (foreign key to `projects(id)`)
   - `audience_segments` (foreign key to `audience_analyses(id)`)
   - `customer_personas` (foreign key to `audience_segments(id)`)
   - `customer_journeys` (foreign key to `audience_analyses(id)`)
   - `audience_messages` (foreign key to `audience_segments(id)`)

