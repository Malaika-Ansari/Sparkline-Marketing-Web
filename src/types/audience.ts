/**
 * SPARKLINE MARKETING — TARGET AUDIENCE & CUSTOMER PERSONA DOMAIN TYPES
 * Phase 08: Target Audience & Customer Persona Analyzer
 */

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
  isHypothesis: boolean; // Always true for AI-generated segments until verified
}

export interface PersonaCharacteristics {
  ageRangeAssumption: string;
  geographicContext: string;
  occupationRole: string;
  lifestyleOrBusinessContext: string;
  interests: string[];
}

export interface PersonaPsychology {
  goals: string[];
  needs: string[];
  frustrations: string[];
  painPoints: string[];
  motivations: string[];
  buyingObjections: string[];
  decisionFactors: string[];
}

export interface PersonaMarketingBehavior {
  preferredPlatforms: string[];
  contentPreferences: string[];
  purchaseTriggers: string[];
  buyingJourneyOverview: string;
  communicationStyle: string;
}

export interface PersonaMarketingRecommendations {
  bestMessagingAngle: string;
  recommendedContentFormats: string[];
  suitableChannels: string[];
  suggestedCta: string;
  relevantProductBenefits: string[];
}

export interface CustomerPersona {
  id: string;
  segmentId: string;
  personaName: string; // Fictional persona archetype name
  segmentName: string;
  tagline: string;
  avatarColor: string;
  isFictional: boolean; // Explicit flag confirming persona is a fictional composite
  characteristics: PersonaCharacteristics;
  psychology: PersonaPsychology;
  marketingBehavior: PersonaMarketingBehavior;
  recommendations: PersonaMarketingRecommendations;
}

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

export interface AudienceMessageAngles {
  painPointFocused: string;
  benefitFocused: string;
  emotionalAngle: string;
  educationalAngle: string;
}

export interface AudienceMessage {
  segmentId: string;
  segmentName: string;
  mainMessage: string;
  alternativeAngles: AudienceMessageAngles;
  callToActionExamples: string[];
  recommendedToneOfVoice: string;
}

export interface AudienceChannelRecommendation {
  channelName: string;
  suitabilityReason: string;
  targetAudienceBehavior: string;
  effectiveContent: string;
  funnelStageSupported: JourneyStageName;
  advantages: string[];
  limitations: string[];
  recommendedKpis: string[];
  isAssumption: boolean; // Flags unverified channel usage assumptions
}

export interface AudienceAnalysisInput {
  targetCountry: string;
  cityOrRegion: string;
  geographicMarketType: MarketType;
  preferredLanguage: string;
  industry: string;
  customerType: CustomerModelType;
  ageRange?: string;
  customerNeeds: string;
  customerPainPoints: string;
  interests: string;
  purchasingMotivations: string;
  commonObjections: string;
  preferredChannels: string[];
  purchasingBehavior: string;
  productName: string;
  productPrice: number;
  currency: string;
  mainBenefits: string;
  existingCustomerInfo?: string;
  marketingGoals: string;
}

export interface AudienceAnalysis {
  id: string;
  projectId: string;
  projectName: string;
  version: number;
  createdAt: string;
  modelIdentifier: string;
  status: 'Completed' | 'Draft';
  executiveSummary: string;
  inputSnapshot: AudienceAnalysisInput;
  segments: AudienceSegment[];
  personas: CustomerPersona[];
  customerJourney: CustomerJourneyStage[];
  messaging: AudienceMessage[];
  channels: AudienceChannelRecommendation[];
  unverifiedAssumptions: string[];
  limitationsAndMissingData: string[];
}

