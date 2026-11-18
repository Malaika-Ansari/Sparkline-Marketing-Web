/**
 * SPARKLINE MARKETING — COMPETITOR INTELLIGENCE & BENCHMARKING DOMAIN TYPES
 * Phase 10: Competitor Intelligence, SWOT & Competitive Analysis
 */

import type { ConfidenceLevel } from './market-research';

export type CompetitorRelationship = 'Direct' | 'Indirect';
export type ObservationType =
  | 'Website Positioning'
  | 'Product & Offerings'
  | 'Public Pricing'
  | 'Website Messaging'
  | 'Content Strategy'
  | 'Social Media Activity'
  | 'Customer Reviews'
  | 'Search Visibility'
  | 'Promotions & Offers';

export type ImpactPriority = 'High' | 'Medium' | 'Low';

/**
 * Reusable Competitor profile entity with full commercial attributes
 */
export interface CompetitorProfile {
  id: string;
  projectId: string;
  name: string;
  websiteUrl?: string;
  industry: string;
  locationOrMarket: string;
  relationship: CompetitorRelationship;
  productDescription: string;
  pricingInfo?: string;
  mainSellingPoints: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    other?: string;
  };
  knownStrengths: string[];
  knownWeaknesses: string[];
  notes?: string;
  isUserEntered: boolean;
  researchStatus: 'Pending' | 'Researched' | 'Manual';
  createdAt: string;
  updatedAt: string;
}

/**
 * Publicly observed finding or evidence item
 */
export interface CompetitorObservation {
  id: string;
  competitorId: string;
  competitorName: string;
  observationType: ObservationType;
  sourceUrl: string;
  sourceName: string;
  retrievalDate: string;
  observation: string;
  confidenceLevel: ConfidenceLevel;
  isVerified: boolean;
}

/**
 * Structured comparison row for the side-by-side comparison dashboard
 */
export interface CompetitorComparisonRow {
  competitorId: string;
  competitorName: string;
  relationship: CompetitorRelationship;
  productCategory: string;
  targetAudience: string;
  pricingPosition: string; // e.g., "$160 Premium / Luxury" or "Free Tier + $49/mo" or "Unknown"
  mainValueProposition: string;
  brandPositioning: string;
  marketingChannels: string[];
  publiclyObservedStrengths: string[];
  publiclyObservedWeaknesses: string[];
  differentiationOpportunities: string[];
  evidenceLevel: ConfidenceLevel;
}

/**
 * Single item inside a SWOT matrix
 */
export interface SWOTPoint {
  id: string;
  point: string;
  explanation: string;
  isVerified: boolean; // true = backed by evidence, false = AI hypothesis
  confidenceLevel: ConfidenceLevel;
  sourceCitation?: string;
}

/**
 * SWOT Analysis entity for a specific company (user business or competitor)
 */
export interface SWOTAnalysis {
  entityId: string; // "user-business" or competitorId
  entityName: string;
  isUserBusiness: boolean;
  strengths: SWOTPoint[];
  weaknesses: SWOTPoint[];
  opportunities: SWOTPoint[];
  threats: SWOTPoint[];
  strategicTakeaway: string;
}

/**
 * Positioning dimension comparison
 */
export interface PositioningDimension {
  dimension: string; // e.g. "Price Positioning", "Product Differentiation", "Customer Experience"
  userPosition: string;
  competitorAssessments: {
    competitorId: string;
    competitorName: string;
    assessment: string;
    relativeStanding: 'Leader' | 'Parity' | 'Laggard' | 'Differentiated';
  }[];
  strategicImplication: string;
}

/**
 * 2x2 Positioning Map Coordinate (for evidence-based visual mapping)
 */
export interface PositioningMapPoint {
  entityId: string;
  entityName: string;
  isUserBusiness: boolean;
  xAxisValue: number; // 0 to 100
  yAxisValue: number; // 0 to 100
  xAxisLabel: string;
  yAxisLabel: string;
  evidenceBasis: string;
}

/**
 * Complete Positioning Analysis
 */
export interface PositioningAnalysis {
  dimensions: PositioningDimension[];
  positioningMap?: {
    xAxisName: string; // e.g. "Price Point (Accessible → Luxury)"
    yAxisName: string; // e.g. "Formulation Focus / Automation (Basic → Clinical/Advanced)"
    points: PositioningMapPoint[];
    hasSufficientEvidence: boolean;
  };
  descriptiveNarrative: string;
}

/**
 * Actionable Competitive Opportunity / Gap
 */
export interface CompetitiveOpportunity {
  id: string;
  title: string;
  category:
    | 'Underserved Need'
    | 'Messaging Standout'
    | 'Pricing Differentiation'
    | 'Feature Moat'
    | 'Channel Whitespace'
    | 'Customer Segment Gap';
  description: string;
  supportingEvidence: string;
  businessRelevance: string;
  potentialValue: ImpactPriority;
  implementationEffort: ImpactPriority;
  priority: ImpactPriority;
  confidence: ConfidenceLevel;
  suggestedNextAction: string;
}

/**
 * Authoritative citation for competitor intelligence
 */
export interface CompetitorSource {
  id: string;
  competitorId?: string;
  competitorName?: string;
  sourceTitle: string;
  publisherOrWebsite: string;
  sourceUrl: string;
  publicationDate?: string;
  accessDate: string;
  relevantObservation: string;
  sourceCategory: ObservationType;
  isVerified: boolean;
}

/**
 * Interactive Q&A Assistant message
 */
export interface CompetitorAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citedSourceIds?: string[];
  isStrategicReasoning?: boolean;
}

/**
 * Root Competitor Intelligence Report entity
 */
export interface CompetitorAnalysisReport {
  id: string;
  projectId: string;
  projectName: string;
  reportTitle: string;
  version: number;
  createdAt: string;
  modelIdentifier: string;
  status: 'Completed' | 'Draft';
  isLiveResearchConfigured: boolean;
  executiveSummary: string;
  competitorsAnalyzed: CompetitorProfile[];
  comparisonRows: CompetitorComparisonRow[];
  swotAnalyses: SWOTAnalysis[]; // includes user business + competitors
  positioningAnalysis: PositioningAnalysis;
  competitiveOpportunities: CompetitiveOpportunity[];
  observedStrengthsSummary: string[];
  differentiationAnglesSummary: string[];
  competitiveRisksToMonitor: string[];
  sources: CompetitorSource[];
  limitationsAndMissingData: string[];
  assistantChatHistory?: CompetitorAssistantMessage[];
}

/**
 * Request payload for Competitor AI Generation
 */
export interface GenerateCompetitorAnalysisInput {
  projectId: string;
  competitors: CompetitorProfile[];
  researchAngle?: string;
  focusAreas?: string[];
  allowDiscoveryIfEmpty?: boolean;
}
