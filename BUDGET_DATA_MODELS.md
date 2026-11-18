# Sparkline Marketing Budget Data Models

## TypeScript Domain Specifications

All types and interfaces governing the Marketing Budget Planner are defined in `src/types/budget.ts` and exported via `src/types/index.ts`.

---

## Core Types & Enums

```typescript
export type BudgetFrequency =
  | 'Daily'
  | 'Weekly'
  | 'Monthly'
  | 'Quarterly'
  | 'Campaign';

export type BudgetRiskPreference =
  | 'Conservative'
  | 'Balanced'
  | 'Growth-Focused';

export type BudgetPlanApproach = 'conservative' | 'balanced' | 'growth';

export type BudgetGroup =
  | 'Advertising Spend'
  | 'Content and Creative'
  | 'Marketing Operations'
  | 'External Services'
  | 'Testing and Reserve';

export type BudgetWarningType =
  | 'concentration'
  | 'insufficient_testing'
  | 'channel_dilution'
  | 'missing_creative'
  | 'excessive_operations'
  | 'unallocated'
  | 'duration_inconsistent';

export type WarningSeverity = 'High' | 'Medium' | 'Low';
```

---

## Entity Schemas

### 1. `BudgetAllocation`
Represents an individual channel or line item inside a budget plan.
```typescript
export interface BudgetAllocation {
  id: string;
  category: string;
  group: BudgetGroup;
  amount: number;             // Major currency units (e.g., 2800.00)
  percentage: number;         // e.g., 35.0 (0 to 100)
  purpose: string;            // Strategic objective
  reasonForAllocation: string;
  expectedActivity: string;   // Deliverables and executions
  primaryKpi: string;         // e.g. "Blended CAC < $28.00"
  measurementMethod: string;  // e.g. "Shopify CAPI + GA4"
  reviewFrequency: string;    // "Weekly", "Monthly", etc.
  performanceStatus: 'Planned' | 'Active' | 'Paused' | 'Under Review';
  riskOrLimitation: string;
  isCustom?: boolean;
}
```

### 2. `BudgetGroupSummary`
Aggregated subtotal metrics for one of the 5 budget pillars.
```typescript
export interface BudgetGroupSummary {
  group: BudgetGroup;
  amount: number;
  percentage: number;
  itemCount: number;
}
```

### 3. `BudgetPlanVariant`
A complete allocation approach (Conservative, Balanced, or Growth).
```typescript
export interface BudgetPlanVariant {
  approach: BudgetPlanApproach;
  name: string;
  tagline: string;
  description: string;
  totalBudget: number;
  currency: string;
  allocations: BudgetAllocation[];
  groupBreakdowns: Record<BudgetGroup, BudgetGroupSummary>;
  unallocatedAmount: number;
  unallocatedPercentage: number;
  isBalanced100Percent: boolean;
  keyAdvantages: string[];
  keyRisks: string[];
  strategicRecommendations: string[];
}
```

### 4. `BudgetWarning` & `BudgetRecommendation`
Real-time risk warnings and AI optimization recommendations.
```typescript
export interface BudgetWarning {
  id: string;
  type: BudgetWarningType;
  severity: WarningSeverity;
  title: string;
  message: string;
  explanation: string;
  howToResolve: string;
}

export interface BudgetRecommendation {
  id: string;
  title: string;
  description: string;
  suggestedAction: string;
  impact: 'High' | 'Medium' | 'Low';
}
```

### 5. `MarketingBudgetPlan` (Root Aggregation Model)
Root persistence object stored in LocalStorage (`sparkline_marketing_budget_plans`).
```typescript
export interface MarketingBudgetPlan {
  id: string;
  projectId: string;
  projectName: string;
  planTitle: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  modelIdentifier: string;
  currency: string;
  totalBudget: number;
  frequency: BudgetFrequency;
  inputSnapshot: BudgetInputSnapshot;
  selectedApproach: BudgetPlanApproach;
  plans: {
    conservative: BudgetPlanVariant;
    balanced: BudgetPlanVariant;
    growth: BudgetPlanVariant;
  };
  activePlan: BudgetPlanVariant;
  warnings: BudgetWarning[];
  recommendations: BudgetRecommendation[];
  timelineMonthlySpend: BudgetTimelineMonth[];
}
```

