/**
 * SPARKLINE MARKETING — MARKETING BUDGET ALLOCATION DOMAIN TYPES
 * Phase 12: Marketing Budget Allocation Planner, Risk Scenarios & Mathematical Controls
 */

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

export interface BudgetAllocation {
  id: string;
  category: string;
  group: BudgetGroup;
  amount: number; // In major currency units (e.g. 2400.00)
  percentage: number; // e.g. 30.0 (0 to 100)
  purpose: string;
  reasonForAllocation: string;
  expectedActivity: string;
  primaryKpi: string;
  measurementMethod: string;
  reviewFrequency: string;
  performanceStatus: 'Planned' | 'Active' | 'Paused' | 'Under Review';
  riskOrLimitation: string;
  isCustom?: boolean;
}

export interface BudgetGroupSummary {
  group: BudgetGroup;
  amount: number;
  percentage: number;
  itemCount: number;
}

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

export interface BudgetTimelineMonth {
  month: string;
  amount: number;
  advertising: number;
  creative: number;
  operations: number;
  services: number;
  testing: number;
}

export interface BudgetInputSnapshot {
  projectId: string;
  totalBudget: number;
  currency: string;
  frequency: BudgetFrequency;
  campaignDuration: string;
  startDate: string;
  endDate: string;
  businessStage: string;
  primaryObjective: string;
  targetAudience: string;
  targetMarket: string;
  productOrService: string;
  averageProductPrice: number;
  availableResources: string;
  preferredChannels: string[];
  existingChannels: string[];
  organicVsPaidPreference: 'Organic-Heavy' | 'Balanced Mix' | 'Paid-Heavy';
  riskPreference: BudgetRiskPreference;
  minTestingBudgetPercentage: number;
}

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

