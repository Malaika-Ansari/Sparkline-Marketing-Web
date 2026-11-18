/**
 * Advertising Campaign Studio Domain Types
 * Sparkline Marketing Intelligence Platform — Phase 16
 */

export type CampaignStatus =
  | 'Draft'
  | 'Planned'
  | 'Ready for Review'
  | 'Active'
  | 'Paused'
  | 'Completed'
  | 'Archived';

export type CampaignObjective =
  | 'Brand Awareness'
  | 'Reach'
  | 'Website Traffic'
  | 'Engagement'
  | 'Lead Generation'
  | 'Sales and Conversions'
  | 'App Promotion'
  | 'Customer Retention';

export type CampaignPlatform =
  | 'Meta Ads'
  | 'Google Ads'
  | 'TikTok Ads'
  | 'LinkedIn Ads'
  | 'YouTube Ads'
  | 'Pinterest Ads';

export type CreativeFormat =
  | 'Single Image'
  | 'Video'
  | 'Carousel'
  | 'Story / Vertical Video'
  | 'Collection / Product Catalog';

export type CopyMessagingAngle =
  | 'Benefit-focused'
  | 'Problem-solution'
  | 'Emotional'
  | 'Promotional'
  | 'Educational'
  | 'Trust-building';

export interface CampaignAudience {
  targetLocation: string;
  ageRange: string;
  customerType: string;
  interests: string[];
  behaviors: string[];
  audienceNeeds: string;
  painPoints: string[];
  languages: string[];
  exclusions: string[];
  customAudienceNotes: string;
  isAiSuggested?: boolean;
}

export interface CampaignBudget {
  totalBudget: number;
  adSpend: number;
  creativeBudget: number;
  testingBudget: number;
  currency: string;
  pacePreference: 'Daily' | 'Lifetime';
  platformAllocations: Partial<Record<CampaignPlatform, number>>;
}

export interface CampaignCreative {
  id: string;
  name: string;
  format: CreativeFormat;
  headline: string;
  primaryText: string;
  description: string;
  callToAction: string;
  destinationUrl: string;
  assetUrl?: string;
  aspectRatio?: string;
  keySellingPoints: string[];
  brandTone: string;
}

export interface CampaignAd {
  id: string;
  name: string;
  format: CreativeFormat;
  headline: string;
  primaryText: string;
  description: string;
  callToAction: string;
  destinationUrl: string;
  status: 'Draft' | 'Planned' | 'Active' | 'Paused';
  notes?: string;
}

export interface CampaignAdGroup {
  id: string;
  name: string;
  platform: CampaignPlatform;
  platformTerminology: 'Ad Set' | 'Ad Group' | 'Campaign Group';
  objective: CampaignObjective;
  budgetAllocation: number;
  targetAudienceSummary: string;
  ads: CampaignAd[];
  status: 'Draft' | 'Planned' | 'Active' | 'Paused';
}

export interface CampaignStructure {
  hierarchyName: string;
  adGroups: CampaignAdGroup[];
}

export interface CampaignSchedule {
  startDate: string;
  endDate: string;
  durationDays: number;
  creativeDeadlines?: string;
  reviewDate?: string;
  testingPeriod?: string;
  reportingDate?: string;
}

export interface CampaignPerformance {
  hasActualData: boolean;
  impressions: number;
  reach: number;
  clicks: number;
  spend: number;
  leads: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpm: number;
  cpa: number;
  cpl: number;
  conversionRate: number;
  roas: number;
  roi?: number;
  dataSource: 'manual_entry' | 'csv_import' | 'connected_api';
  reportingDate: string;
  notes?: string;
}

export interface CampaignOptimization {
  id: string;
  area:
    | 'High CPC'
    | 'Low CTR'
    | 'High CPA'
    | 'Low Conversion Rate'
    | 'Budget Imbalance'
    | 'Creative Fatigue'
    | 'Weak Landing Page'
    | 'Tracking Configuration';
  severity: 'High' | 'Medium' | 'Low';
  observation: string;
  supportingData: string;
  whyItMatters: string;
  suggestedAction: string;
  metricToMonitor: string;
  suggestedReviewPeriod: string;
}

export interface CampaignCopyVariation {
  id: string;
  angle: CopyMessagingAngle;
  headline: string;
  primaryText: string;
  description: string;
  callToAction: string;
  intendedAudience: string;
  messagingAngleDescription: string;
  characterCount: {
    headline: number;
    primaryText: number;
  };
}

export interface CampaignCreativeBrief {
  id: string;
  campaignName: string;
  objective: CampaignObjective;
  targetAudience: string;
  mainMessage: string;
  creativeConcept: string;
  visualDirection: string;
  brandColors: string[];
  suggestedImagery: string[];
  headlineDirection: string;
  callToAction: string;
  requiredAssets: string[];
  creativeSpecifications: string[];
  testingVariations: string[];
}

export interface CampaignTemplate {
  id: string;
  name: string;
  category: string;
  objective: CampaignObjective;
  recommendedPlatforms: CampaignPlatform[];
  description: string;
  suggestedAudience: string;
  suggestedBudgetType: string;
  suggestedDuration: string;
  structureSummary: string;
  sampleHeadline: string;
  samplePrimaryText: string;
  sampleCta: string;
}

export interface AICampaignPlanResult {
  campaignObjectiveRationale: string;
  recommendedPlatformsRationale: string;
  suggestedStructure: {
    groupName: string;
    platform: CampaignPlatform;
    targetSegment: string;
    adFormats: string[];
  }[];
  audienceTargetingAdvice: string[];
  creativeDirection: string;
  messagingStrategy: string;
  suggestedCtas: string[];
  budgetAllocationAdvice: string;
  testingRecommendations: string[];
  trackingAndMeasurement: string[];
  potentialRisks: string[];
  optimizationRecommendations: string[];
  isAiGenerated: boolean;
  generatedAt: string;
}

export interface AdvertisingCampaign {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  projectId?: string;
  projectName?: string;
  userId?: string;
  productService: string;
  industry: string;
  targetLocation: string;
  description: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  platforms: CampaignPlatform[];
  audience: CampaignAudience;
  budget: CampaignBudget;
  schedule: CampaignSchedule;
  structure: CampaignStructure;
  creativeBrief?: CampaignCreativeBrief;
  copyVariations: CampaignCopyVariation[];
  performance?: CampaignPerformance;
  optimizations: CampaignOptimization[];
  aiStrategyPlan?: AICampaignPlanResult;
  isDraft?: boolean;
}
