/**
 * SPARKLINE MARKETING — UNIFIED MARKETING STRATEGY RECOMMENDATION ENGINE TYPES
 * Phase 11: Unified Strategy Recommendation Engine, Action Plans & KPI Framework
 */

import type { ConfidenceLevel } from './market-research';
import type { ImpactPriority } from './competitor';

export type StrategyModeType = 'lean' | 'balanced' | 'accelerated';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold';
export type TaskPeriod = 'immediate' | 'short_term' | 'medium_term' | 'long_term';

export interface DataCompletenessAudit {
  overallScore: number; // 0 to 100 percentage
  modules: {
    businessProfile: boolean;
    productAnalysis: boolean;
    audienceIntelligence: boolean;
    marketResearch: boolean;
    competitorAnalysis: boolean;
    budgetSpecified: boolean;
  };
  contributingModules: string[];
  missingModules: string[];
  conflictingSignals: string[];
  unverifiedAssumptions: string[];
}

export interface StrategyExecutiveSummary {
  businessSituation: string;
  mainMarketingObjective: string;
  biggestOpportunity: string;
  mainChallenge: string;
  recommendedStrategicDirection: string;
}

export interface StrategyBrandPositioning {
  recommendedPositioning: string;
  uniqueSellingProposition: string;
  coreBrandMessage: string;
  competitiveDifferentiation: string;
  brandPersonality: string[];
  toneOfVoice: string;
}

export interface StrategyTargetAudience {
  primarySegment: string;
  secondarySegments: string[];
  customerPainPoints: string[];
  purchaseMotivations: string[];
  recommendedMessaging: string[];
  audiencePriorities: string[];
}

export interface StrategyChannelItem {
  channelName: string;
  isPrioritized: boolean;
  strategicPurpose: string;
  targetAudience: string;
  recommendedActivity: string;
  funnelStage: 'TOFU' | 'MOFU' | 'BOFU' | 'Retention' | 'Full-Funnel';
  requiredResources: string;
  suggestedKpis: string[];
  potentialLimitations: string;
}

export interface StrategyContentPlan {
  contentPillars: string[];
  educationalContent: string[];
  promotionalContent: string[];
  engagementContent: string[];
  trustBuildingContent: string[];
  contentFormats: string[];
  messagingAngles: string[];
  recommendedPublishingApproach: string;
}

export interface StrategyCustomerAcquisition {
  leadGenerationOpportunities: string[];
  conversionImprovements: string[];
  landingPageRecommendations: string[];
  offerStrategy: string;
  retargetingOpportunities: string[];
  acquisitionConsiderations: string;
}

export interface StrategyCustomerRetention {
  customerRelationshipActivities: string[];
  emailOrMessagingOpportunities: string[];
  loyaltyInitiatives: string[];
  repeatPurchaseOpportunities: string[];
  customerFeedbackStrategy: string;
}

export interface StrategyGrowthOpportunities {
  newAudienceSegments: string[];
  productPositioningOpportunities: string[];
  geographicExpansionPossibilities: string[];
  partnershipOpportunities: string[];
  channelExpansion: string[];
  competitiveDifferentiation: string[];
}

export interface StrategyModePlan {
  mode: StrategyModeType;
  name: string;
  tagline: string;
  mainObjective: string;
  recommendedChannels: string[];
  resourceRequirements: string;
  budgetConsiderations: string;
  mainAdvantages: string[];
  mainRisks: string[];
  successCriteria: string[];
}

export interface MarketingActionTask {
  id: string;
  title: string;
  description: string;
  reasonForRecommendation: string;
  priority: ImpactPriority;
  estimatedEffort: 'Low' | 'Medium' | 'High';
  period: TaskPeriod;
  suggestedStartPeriod: string;
  suggestedCompletionPeriod: string;
  requiredResources: string;
  responsibleRole: string;
  successMetric: string;
  dependencyOnOtherTasks: string;
  status: TaskStatus;
}

export interface StrategyKPI {
  id: string;
  metricName: string;
  category: 'Awareness' | 'Engagement' | 'Acquisition' | 'Retention' | 'Revenue';
  definition: string;
  formula: string;
  whyItMatters: string;
  whichObjectiveItSupports: string;
  dataRequired: string;
  recommendedMeasurementFrequency: string;
  benchmarkRange: string;
}

export interface StrategyRisk {
  id: string;
  risk: string;
  severity: ImpactPriority;
  likelihood: ImpactPriority;
  mitigation: string;
}

export interface StrategyEvidenceItem {
  sourceModule: string;
  findingSummary: string;
  confidence: ConfidenceLevel;
}

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
