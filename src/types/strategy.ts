/**
 * SPARKLINE MARKETING — AI STRATEGY DOMAIN TYPES
 * Phase 07: AI Marketing Strategist Engine
 */

export type StrategyApproachType = 'conservative' | 'balanced' | 'aggressive';
export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type EffortLevel = 'Low' | 'Medium' | 'High';
export type FunnelStage =
  | 'Awareness'
  | 'Interest'
  | 'Consideration'
  | 'Conversion'
  | 'Retention'
  | 'Advocacy';

export interface StrategicApproach {
  approachType: StrategyApproachType;
  name: string;
  tagline: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  budgetAllocation: string;
  focusAreas: string[];
  tradeOffs: string;
  projectedTimeline: string;
}

export interface ChannelRecommendation {
  channelId: string;
  channelName: string;
  priority: PriorityLevel;
  suitabilityReason: string;
  targetAudienceReached: string;
  funnelStage: FunnelStage;
  advantages: string[];
  risksAndLimitations: string[];
  resourceRequirements: EffortLevel;
  suggestedKpis: string[];
  estimatedBudgetShare: string;
}

export interface FunnelStagePlan {
  stage: FunnelStage;
  objective: string;
  recommendedActivities: string[];
  keyMetrics: string[];
}

export interface StrategicRecommendationItem {
  id: string;
  title: string;
  description: string;
  reasoning: string;
  expectedPurpose: string;
  priority: PriorityLevel;
  estimatedEffort: EffortLevel;
  suggestedTimeline: string;
  successMetric: string;
}

export interface MessagingAngle {
  angle: string;
  headline: string;
  hook: string;
  targetPainPoint: string;
}

export interface MessagingArchitecture {
  brandPositioning: string;
  coreMessage: string;
  valueProposition: string;
  supportingAngles: MessagingAngle[];
  callToActionExamples: string[];
  brandCommunicationTone: string;
}

export interface AudienceAnalysisSynthesis {
  userProvidedFacts: string[];
  aiHypotheses: string[];
  primarySegments: string[];
  customerNeeds: string[];
  painPoints: string[];
  purchaseMotivations: string[];
  buyingBehavior: string;
  customerObjections: string[];
  communicationApproach: string;
}

export interface FeatureVsBenefit {
  feature: string;
  customerBenefit: string;
}

export interface BusinessProductSynthesis {
  businessModel: string;
  industryContext: string;
  stageAnalysis: string;
  strengths: string[];
  limitations: string[];
  featuresVsBenefits: FeatureVsBenefit[];
  uniqueSellingProposition: string;
  pricingAssessment: string;
  productMarketFitConsiderations: string;
}

export interface StrategicRisks {
  potentialOpportunities: string[];
  marketingChallenges: string[];
  competitiveRisks: string[];
  operationalLimitations: string[];
  areasRequiringExternalResearch: string[];
}

export interface MeasurementFramework {
  primaryMetric: string;
  secondaryMetrics: string[];
  suggestedTimeHorizon: string;
  measurementMethods: string[];
  reportingCadence: string;
}

export interface CampaignRecommendation {
  campaignName: string;
  objective: string;
  channel: string;
  targetAudience: string;
  creativeConcept: string;
  duration: string;
}

export interface BudgetAllocationItem {
  channel: string;
  percentage: number;
  amount: number;
  purpose: string;
}

export interface BudgetConsiderations {
  recommendedMonthlyBudget: number;
  currency: string;
  allocationBreakdown: BudgetAllocationItem[];
  rationale: string;
}

export interface StrategyInputSnapshot {
  brandName: string;
  businessType: string;
  industry: string;
  budget: number;
  currency: string;
  primaryObjective: string;
  productCount: number;
}

export interface GeneratedMarketingStrategy {
  id: string;
  projectId: string;
  projectName: string;
  version: number;
  createdAt: string;
  modelIdentifier: string;
  status: 'Completed' | 'Draft' | 'Archived';
  executiveSummary: string;
  businessAnalysis: BusinessProductSynthesis;
  audienceAnalysis: AudienceAnalysisSynthesis;
  messaging: MessagingArchitecture;
  approaches: {
    conservative: StrategicApproach;
    balanced: StrategicApproach;
    aggressive: StrategicApproach;
  };
  recommendedChannels: ChannelRecommendation[];
  funnelStrategy: FunnelStagePlan[];
  campaignRecommendations: CampaignRecommendation[];
  budgetConsiderations: BudgetConsiderations;
  measurementFramework: MeasurementFramework;
  risksAndLimitations: StrategicRisks;
  nextSteps: StrategicRecommendationItem[];
  assumptions: string[];
  inputSnapshot: StrategyInputSnapshot;
}

export type GenerationState =
  | 'idle'
  | 'preparing'
  | 'analyzing'
  | 'generating'
  | 'saving'
  | 'completed'
  | 'failed'
  | 'setup_required';

