/**
 * Sparkline Marketing — Project & Business Intelligence Data Model
 * Types for Prompt 06 multi-step product and business onboarding
 */

export type BusinessType =
  | 'B2B'
  | 'B2C'
  | 'D2C'
  | 'Marketplace'
  | 'Local Business'
  | 'SaaS'
  | 'Other';

export type OperatingStatus =
  | 'New'
  | 'Growing'
  | 'Established'
  | 'Rebranding';

export type BusinessSize =
  | 'Solo'
  | 'Small Business'
  | 'Medium Business'
  | 'Enterprise';

export type ProductAvailability =
  | 'In Stock'
  | 'Pre-order'
  | 'Limited Availability'
  | 'Continuous Service'
  | 'Discontinued';

export type CustomerType = 'Individuals' | 'Businesses' | 'Both';

export type PurchasingBehavior =
  | 'Impulse'
  | 'Research-heavy'
  | 'Value-driven'
  | 'Luxury/Premium'
  | 'Subscription';

export type MarketPositionType =
  | 'Challenger'
  | 'Niche Leader'
  | 'New Entrant'
  | 'Cost Leader'
  | 'Premium Brand'
  | 'Undifferentiated';

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

export interface BusinessProfile {
  brandName: string;
  websiteUrl?: string;
  description: string;
  industry: string;
  customIndustry?: string;
  businessType: BusinessType;
  location: string;
  regionsServed: string;
  operatingStatus: OperatingStatus;
  businessSize: BusinessSize;
}

export interface ProductOrService {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[]; // What the product has or does
  benefits: string[]; // Why the customer cares / emotional & commercial outcomes
  usp: string; // Unique Selling Proposition
  sellingPrice: number;
  currency: string;
  costOfGoods?: number;
  availability: ProductAvailability;
  images?: string[];
  pageUrl?: string;
}

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

export interface Competitor {
  id: string;
  name: string;
  websiteUrl?: string;
  socialLinks?: string;
  alternativeOfferings?: string;
}

export interface MarketPosition {
  currentPosition: MarketPositionType;
  whatMakesYouDifferent: string;
  competitiveAdvantages: string[];
  knownMarketChallenges: string[];
}

export interface MarketingPreferences {
  selectedGoals: string[];
  primaryObjective: string;
  currentChannels: string[];
  existingCampaignStatus: CampaignStatusType;
  monthlyBudget: number;
  budgetCurrency: string;
  preferredAdPlatforms: string[];
  campaignDuration: CampaignDurationType;
  expectedOutcome: string;
}

export type ProjectStatus =
  | 'Draft'
  | 'Active'
  | 'Ready for Strategy'
  | 'In Strategy'
  | 'Active Flight'
  | 'On Hold'
  | 'Completed'
  | 'Archived';

export interface ProjectMember {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  role: 'Owner' | 'Editor' | 'Viewer';
  addedAt: string;
}

export interface ProjectActivity {
  id: string;
  projectId: string;
  userId?: string;
  action: string;
  module?: string;
  details: string;
  timestamp: string;
}

export interface ProjectProgressSummary {
  overallPercentage: number;
  completedModulesCount: number;
  totalModulesCount: number;
  moduleStatuses: Record<string, boolean>;
}

export interface MarketingProject {
  id: string;
  userId?: string; // Owner user ID for multi-tenant data isolation
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
  business: BusinessProfile;
  products: ProductOrService[];
  audience: TargetAudience;
  competitors: Competitor[];
  marketPosition: MarketPosition;
  marketing: MarketingPreferences;
  collaborators?: ProjectMember[];
  isDraft?: boolean;
}

