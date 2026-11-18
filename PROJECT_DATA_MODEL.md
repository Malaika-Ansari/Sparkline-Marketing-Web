# Sparkline Marketing — Project Data Model & Business Profiling Architecture

This document specifies the data architecture, domain models, validation constraints, and storage mechanics for Sparkline Marketing's **Business Information & Product Analysis Engine** (Phase 06).

---

## 1. Architectural Philosophy & Strategy

Generic AI marketing tools produce generic advice because they lack structured context regarding unit economics, audience psychology, competitive friction, and commercial constraints. Sparkline Marketing solves this through an exhaustive 6-step business onboarding architecture.

```
+-----------------------------------------------------------------------------------+
|                        6-STEP BUSINESS ONBOARDING WORKFLOW                        |
+-----------------------------------------------------------------------------------+
|  Step 1: Business Profile       --> Core brand identity, industry, reach, scale   |
|  Step 2: Products & Economics   --> Features vs. benefits, pricing, COGS, USP     |
|  Step 3: Target Audience        --> Demographics, pain points, purchasing psyche  |
|  Step 4: Competitors & Position --> Alternatives, differentiation, advantages     |
|  Step 5: Goals & Budget         --> Objectives, ad channels, budget, milestones   |
|  Step 6: Review & Initialize    --> Completeness audit, storage, routing          |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                         CLIENT DATA LAYER (PROJECT SERVICE)                       |
+-----------------------------------------------------------------------------------+
|  - localStorage persistence (`sparkline_marketing_projects`)                      |
|  - Real-time autosave drafts (`sparkline_marketing_new_project_draft`)            |
|  - Seed demonstration projects (DTC E-commerce & B2B SaaS)                        |
|  - Type-safe domain models & defensive JSON parsing                               |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                       DOWNSTREAM AI STRATEGY ENGINE (PHASE 07)                    |
+-----------------------------------------------------------------------------------+
|  - Unit-economic grounded ROAS & CAC calculations                                 |
|  - Channel-specific copy & creative angles based on pain points                   |
|  - Tactical battlecards against named competitors                                 |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Domain Data Models

All interfaces are strictly defined in `src/types/project.ts` and re-exported from `src/types/index.ts`.

### 2.1 Types and Enumerations

```typescript
export type BusinessType =
  | 'B2B'
  | 'B2C'
  | 'D2C'
  | 'Marketplace'
  | 'Local Business'
  | 'SaaS'
  | 'Other';

export type OperatingStatus =
  | 'New (Pre-launch or Just Launched)'
  | 'Growing (Scaling Initial Traction)'
  | 'Established (Consistent Operations)'
  | 'Rebranding (Repositioning / Pivot)';

export type BusinessSize =
  | 'Solo (1 person)'
  | 'Small Business (2-10 team members)'
  | 'Medium Business (11-50 team members)'
  | 'Enterprise (50+ team members)';

export type ProductAvailability =
  | 'In Stock'
  | 'Pre-order'
  | 'Made to Order'
  | 'Digital Delivery'
  | 'Consultation / Custom';

export type CustomerType =
  | 'Individuals'
  | 'Businesses'
  | 'Both Individuals & Businesses';

export type PurchasingBehavior =
  | 'Impulse'
  | 'Research-heavy'
  | 'Value-driven'
  | 'Luxury/Premium'
  | 'Subscription';

export type MarketPositionType =
  | 'Market Leader'
  | 'Challenger'
  | 'Niche Specialist'
  | 'Budget Alternative'
  | 'Premium / Luxury'
  | 'Disruptor / Innovator';

export type CampaignStatusType =
  | 'Not running ads yet'
  | 'Running with mixed results'
  | 'Scaling profitably'
  | 'Paused';

export type CampaignDurationType =
  | '1-3 months'
  | '3-6 months'
  | '6-12 months'
  | 'Ongoing';
```

---

### 2.2 Pillar Interfaces

#### Pillar 1: Business Profile
```typescript
export interface BusinessProfile {
  brandName: string;
  websiteUrl?: string;
  description: string;
  industry: string;
  customIndustry?: string;
  businessType: BusinessType;
  location: string;
  regionsServed: string[];
  operatingStatus: OperatingStatus;
  businessSize: BusinessSize;
}
```

#### Pillar 2: Product or Service (Multi-Item Supported)
A key architectural standard is the explicit separation between **technical features** (what the product is) and **customer benefits** (what the product achieves for the buyer):
```typescript
export interface ProductOrService {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];      // Technical capabilities
  benefits: string[];      // Emotional or commercial outcomes
  usp: string;             // Single most compelling differentiator
  sellingPrice: number;    // Retail/contract price
  currency: string;        // ISO currency code
  costOfGoods?: number;    // COGS or delivery cost for margin calculations
  availability: ProductAvailability;
  pageUrl?: string;        // Dedicated landing page or product link
}
```

#### Pillar 3: Target Audience Intelligence
```typescript
export interface TargetAudience {
  targetLocations: string[];
  ageRanges: string[];
  customerType: CustomerType;
  interests: string[];
  needsAndProblems: string;
  mainPainPoints: string[];
  preferredLanguages: string[];
  purchasingBehavior: PurchasingBehavior;
  existingCustomerSegments?: string;
}
```

#### Pillar 4: Competitor Intelligence & Market Position
```typescript
export interface Competitor {
  id: string;
  name: string;
  websiteUrl?: string;
  alternativeOfferings?: string;
}

export interface MarketPosition {
  noCompetitorsYet: boolean;
  competitors: Competitor[];
  currentPosition: MarketPositionType;
  whatMakesYouDifferent: string;
  competitiveAdvantages: string[];
  knownMarketChallenges: string[];
}
```

#### Pillar 5: Marketing Goals, Preferences & Budget
```typescript
export interface MarketingPreferences {
  selectedGoals: string[];
  primaryObjective: string;
  currentChannels: string[];
  existingCampaignStatus: CampaignStatusType;
  monthlyBudget: number;
  budgetCurrency: string;
  preferredAdPlatforms: string[];
  campaignDuration: CampaignDurationType;
  expectedOutcome?: string;
}
```

#### Aggregate Root: Marketing Project
```typescript
export interface MarketingProject {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'Draft' | 'Active' | 'Archived';
  business: BusinessProfile;
  products: ProductOrService[];
  audience: TargetAudience;
  marketPosition: MarketPosition;
  marketing: MarketingPreferences;
}
```

---

## 3. Storage Layer & Demonstration Fixtures

Sparkline Marketing provides immediate, persistent project creation without requiring backend infrastructure during client-side demonstration:

1. **Active Repository Key**: `sparkline_marketing_projects`
   - Stores serialized array of `MarketingProject` entities.
   - Automatically pre-seeds two realistic industry projects upon first load:
     - `proj-vitamin-c`: *GlowBiome Organics* (DTC Clean Skincare, $12,000/mo ad spend).
     - `proj-apex-cloud`: *ApexSec Cloud Intelligence* (B2B SaaS Cloud Security, $28,000/mo ad spend).
2. **Draft Persistence Key**: `sparkline_marketing_new_project_draft`
   - Automatically preserves partially completed forms when users click "Save Draft" or reload the window.
3. **Data Integrity & Quota Defense**:
   - `try / catch` wraps around `localStorage.setItem` to detect private browsing or storage quota exhaustion.
   - Fallback memory storage maintains volatile session state if `localStorage` is disabled.

---

## 4. Future PostgreSQL & Supabase Relational Mapping

When migrating to a persistent cloud database, the normalized relational schema will map directly to the domain models:

```sql
-- Projects Root Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(32) NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Business Profile (1:1 with Project)
CREATE TABLE business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  brand_name VARCHAR(255) NOT NULL,
  website_url TEXT,
  description TEXT NOT NULL,
  industry VARCHAR(128) NOT NULL,
  custom_industry VARCHAR(128),
  business_type VARCHAR(64) NOT NULL,
  location VARCHAR(255) NOT NULL,
  regions_served TEXT[] NOT NULL DEFAULT '{}',
  operating_status VARCHAR(64) NOT NULL,
  business_size VARCHAR(64) NOT NULL
);

-- Products & Services (1:N with Project)
CREATE TABLE products_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(128) NOT NULL,
  description TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  usp TEXT NOT NULL,
  selling_price NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  cost_of_goods NUMERIC(12, 2),
  availability VARCHAR(64) NOT NULL,
  page_url TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- Target Audience (1:1 with Project)
CREATE TABLE target_audiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  target_locations TEXT[] NOT NULL DEFAULT '{}',
  age_ranges TEXT[] NOT NULL DEFAULT '{}',
  customer_type VARCHAR(64) NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  needs_and_problems TEXT NOT NULL,
  main_pain_points TEXT[] NOT NULL DEFAULT '{}',
  preferred_languages TEXT[] NOT NULL DEFAULT '{}',
  purchasing_behavior VARCHAR(64) NOT NULL,
  existing_customer_segments TEXT
);

-- Competitors (1:N with Project)
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  website_url TEXT,
  alternative_offerings TEXT
);

-- Market Position & Differentiation (1:1 with Project)
CREATE TABLE market_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  no_competitors_yet BOOLEAN NOT NULL DEFAULT FALSE,
  current_position VARCHAR(64) NOT NULL,
  what_makes_you_different TEXT NOT NULL,
  competitive_advantages TEXT[] NOT NULL DEFAULT '{}',
  known_market_challenges TEXT[] NOT NULL DEFAULT '{}'
);

-- Marketing Goals & Budget (1:1 with Project)
CREATE TABLE marketing_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  selected_goals TEXT[] NOT NULL DEFAULT '{}',
  primary_objective VARCHAR(128) NOT NULL,
  current_channels TEXT[] NOT NULL DEFAULT '{}',
  existing_campaign_status VARCHAR(64) NOT NULL,
  monthly_budget NUMERIC(12, 2) NOT NULL,
  budget_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  preferred_ad_platforms TEXT[] NOT NULL DEFAULT '{}',
  campaign_duration VARCHAR(64) NOT NULL,
  expected_outcome TEXT
);
```

---

## 5. Downstream AI Prompt Context Serialization (Phase 07)

In Phase 07, these structured attributes will feed directly into the **AI Strategy Synthesis Engine**. The prompt context builder compiles these fields into structured markdown injection blocks:

```markdown
### BRAND PROFILE
- **Brand**: {{project.business.brandName}} ({{project.business.businessType}} / {{project.business.industry}})
- **Maturity & Scale**: {{project.business.operatingStatus}} | {{project.business.businessSize}}
- **Geography**: {{project.business.location}} (Serves: {{project.business.regionsServed.join(', ')}})

### UNIT ECONOMICS
{{#each project.products}}
- **{{this.name}}**: Sells at ${{this.sellingPrice}} (COGS: ${{this.costOfGoods}} -> Margin: ~{{margin}}%)
  - **USP**: {{this.usp}}
  - **Customer Benefit**: {{this.benefits.join('; ')}}
{{/each}}

### AUDIENCE PSYCHOLOGY
- **Target Segments**: {{project.audience.existingCustomerSegments}}
- **Core Frustrations**: {{project.audience.needsAndProblems}}
- **Friction Points & Objections**: {{project.audience.mainPainPoints.join('; ')}}
- **Decision Behavior**: {{project.audience.purchasingBehavior}}

### COMPETITIVE POSITION
- **Status**: {{project.marketPosition.currentPosition}}
- **Differentiator**: {{project.marketPosition.whatMakesYouDifferent}}
- **Named Rivals**: {{project.marketPosition.competitors.map(c => c.name).join(', ')}}

### STRATEGY OBJECTIVES & RESOURCE ENVELOPE
- **Primary North Star**: {{project.marketing.primaryObjective}}
- **Monthly Spend**: ${{project.marketing.monthlyBudget}} {{project.marketing.budgetCurrency}}
- **Target Horizon**: {{project.marketing.campaignDuration}}
```

This guarantees that AI-generated marketing strategies are computationally grounded, financially viable, and commercially differentiated.

