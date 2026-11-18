/**
 * SPARKLINE MARKETING — MARKET RESEARCH & INDUSTRY INTELLIGENCE DOMAIN TYPES
 * Phase 09: Market Research & Industry Intelligence Engine
 */

export type ResearchDepth = 'quick' | 'standard' | 'deep';
export type ImpactLevel = 'High' | 'Medium' | 'Low';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'Insufficient Evidence';
export type FactorType = 'Opportunity' | 'Threat';
export type PestleCategory =
  | 'Political'
  | 'Economic'
  | 'Social'
  | 'Technological'
  | 'Legal'
  | 'Environmental';

export type OpportunityCategory =
  | 'Underserved Need'
  | 'New Segment'
  | 'Product Differentiation'
  | 'Geographic Expansion'
  | 'Content Marketing'
  | 'Strategic Partnership'
  | 'Channel Innovation';

export type ChallengeCategory =
  | 'Competitive Rivalry'
  | 'Pricing Pressure'
  | 'CAC Inflation'
  | 'Barriers to Entry'
  | 'Consumer Trust'
  | 'Regulatory Barrier'
  | 'Macroeconomic'
  | 'Platform Dependency';

export type SourceType =
  | 'Primary Research'
  | 'Industry Publication'
  | 'Regulatory Document'
  | 'Analytical Commentary';

export interface PestleFactor {
  id: string;
  category: PestleCategory;
  factorTitle: string;
  description: string;
  potentialImpact: ImpactLevel;
  businessRelevance: string;
  type: FactorType;
  confidenceLevel: ConfidenceLevel;
  evidenceOrSource?: string;
}

export interface MarketOpportunity {
  id: string;
  title: string;
  explanation: string;
  category: OpportunityCategory;
  customerRelevance: string;
  businessFit: string;
  evidenceStrength: ConfidenceLevel;
  implementationEffort: ImpactLevel;
  strategicValue: ImpactLevel;
  riskLevel: ImpactLevel;
  priority: ImpactLevel;
  suggestedNextAction: string;
  supportingEvidence: string;
}

export interface MarketDemandSignals {
  demandIndicators: string[];
  searchInterestSignals: string[];
  customerNeedsSummary: string[];
  primaryBuyingMotivations: string[];
  seasonalDemandPatterns: string;
  geographicDemandDifferences: string;
  demandLimitations: string;
}

export interface MarketTrendItem {
  id: string;
  trendTitle: string;
  description: string;
  category:
    | 'Customer Behavior'
    | 'Technology'
    | 'Product Innovation'
    | 'Channel Shift'
    | 'Regulatory/Economic';
  publicationDate?: string;
  sourceTitle?: string;
  sourceUrl?: string;
  isExternalSourceVerified: boolean;
}

export interface MarketChallengeItem {
  id: string;
  title: string;
  category: ChallengeCategory;
  description: string;
  severity: ImpactLevel;
  verificationNeeded: boolean;
  mitigationRecommendation: string;
}

export interface ResearchSourceReference {
  id: string;
  sourceTitle: string;
  publisherOrWebsite: string;
  sourceUrl: string;
  publicationDate?: string;
  accessDate: string;
  relevantClaim: string;
  researchCategory: string;
  sourceType: SourceType;
  isVerified: boolean;
}

export interface MarketResearchInput {
  projectId: string;
  industry: string;
  productCategory: string;
  targetMarket: string;
  geographicLocation: string;
  targetCustomerSegment: string;
  mainCompetitors: string;
  productPriceRange: string;
  businessObjectives: string;
  researchTopic: string;
  researchPeriod: string;
  researchDepth: ResearchDepth;
  specificQuestions: string;
  keywords: string;
}

export interface StrategicRecommendation {
  title: string;
  description: string;
  priority: ImpactLevel;
  timeline: string;
  riskFactor: string;
}

export interface ResearchAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citedSourceIds?: string[];
  isStrategicReasoning?: boolean;
}

export interface MarketResearchReport {
  id: string;
  projectId: string;
  projectName: string;
  reportTitle: string;
  version: number;
  createdAt: string;
  modelIdentifier: string;
  researchDepth: ResearchDepth;
  status: 'Completed' | 'Draft';
  isLiveWebSearchConfigured: boolean;
  executiveSummary: string;
  industryOverview: {
    description: string;
    characteristics: string[];
    mainCategories: string[];
    importantDevelopments: string[];
    industryChallenges: string[];
    factorsAffectingDemand: string[];
  };
  marketDemand: MarketDemandSignals;
  trends: MarketTrendItem[];
  opportunities: MarketOpportunity[];
  pestle: PestleFactor[];
  challenges: MarketChallengeItem[];
  strategicRecommendations: StrategicRecommendation[];
  limitationsAndMissingData: string[];
  sources: ResearchSourceReference[];
  assistantChatHistory?: ResearchAssistantMessage[];
  inputSnapshot: MarketResearchInput;
}

