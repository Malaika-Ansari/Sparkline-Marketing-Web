/**
 * Results Prediction, ROI & ROAS Forecasting Types
 * Sparkline Marketing Intelligence Platform — Phase 15
 */

export type ForecastSource = 'actual' | 'historical' | 'benchmark' | 'assumption';

export type ForecastObjective =
  | 'lead_generation'
  | 'ecommerce_sales'
  | 'brand_awareness'
  | 'customer_acquisition'
  | 'app_installs'
  | 'other';

export type ForecastPlatform =
  | 'google_search'
  | 'google_pmax'
  | 'meta_ads'
  | 'linkedin_ads'
  | 'tiktok_ads'
  | 'youtube_ads'
  | 'multi_channel'
  | 'email'
  | 'other';

export type ForecastScenarioType = 'conservative' | 'balanced' | 'optimistic';

export interface ForecastAssumption {
  id: string;
  metric: string;
  name: string;
  value: number;
  unit: string;
  source: ForecastSource;
  notes?: string;
}

export interface ForecastInput {
  // Business and campaign information
  projectId?: string;
  projectName?: string;
  productService: string;
  industry: string;
  businessModel: string;
  targetRegion: string;
  targetAudience: string;
  campaignObjective: ForecastObjective;
  platform: ForecastPlatform;
  startDate: string;
  endDate: string;
  durationDays: number;

  // Financial information
  totalBudget: number;           // Total investment across all categories
  adSpend: number;               // Direct media advertising spend
  creativeCosts: number;         // Creative, video, design production
  agencyCosts: number;           // Agency or freelancer retainer fees
  softwareCosts: number;         // Tooling, SaaS, operational expenses
  sellingPriceAov: number;       // Average Order Value (AOV) or price per customer
  productCost?: number;          // Cost of goods sold (COGS) per unit
  grossMarginPercent?: number;   // Gross profit margin percentage (0 - 100)
  currency: string;              // ISO Currency code (USD, EUR, GBP, PKR, etc.)

  // Performance benchmark / historical / assumption values
  cpm: number;
  cpmSource: ForecastSource;
  ctr: number;
  ctrSource: ForecastSource;
  leadCvr?: number;              // Clicks to Leads % (optional)
  leadCvrSource?: ForecastSource;
  customerCvr: number;           // Clicks/Leads to Customers %
  customerCvrSource: ForecastSource;
  aovSource: ForecastSource;

  // Operational notes
  notes?: string;
}

export interface ForecastScenario {
  type: ForecastScenarioType;
  name: string;
  description: string;
  riskLevel: 'low' | 'moderate' | 'high';
  multiplierContext: {
    cpmMultiplier: number;
    ctrMultiplier: number;
    cvrMultiplier: number;
  };
  effectiveCPM: number;
  effectiveCTR: number;
  effectiveCVR: number;
  impressions: number;
  clicks: number;
  leads: number;
  customers: number;
  revenue: number;
  grossProfit?: number;
  adSpend: number;
  totalInvestment: number;
  cpc: number;
  cpm: number;
  cpa: number;                   // Direct media CPA (Ad Spend / Customers)
  fullyLoadedCPA: number;        // Total campaign cost / Customers
  conversionRate: number;
  roas: number;                  // Ratio multiplier, e.g. 3.25x
  roiRevenue: number;            // Percentage ((Revenue - Total Investment) / Total Investment) * 100
  roiProfit?: number;            // Percentage ((Gross Profit - Total Investment) / Total Investment) * 100
  netReturn: number;             // Revenue or Gross Profit - Total Investment
  assumptionsSummary: string[];
  keyRisks: string[];
}

export interface BreakEvenAnalysis {
  isCalculable: boolean;
  breakEvenRevenue: number;
  breakEvenCustomers: number;
  breakEvenROAS: number;          // Minimum ROAS to break even on ad spend
  maxAllowableCPA: number;        // Maximum customer acquisition cost to break even on total investment
  maxAllowableMediaCPA: number;   // Maximum customer acquisition cost on ad spend alone
  requiredConversionRate: number; // Conversion rate needed at current traffic to break even
  requiredAov?: number;           // AOV needed if customer count stays constant
  calculationBasis: 'gross_profit' | 'revenue';
  explanation: string;
  limitations: string[];
}

export interface SensitivityAdjustment {
  deltaPercent: number;           // e.g. -20, -10, +10, +20
  adjustedValue: number;
  revenue: number;
  roas: number;
  roi: number;
  customers: number;
}

export interface SensitivityVariable {
  variable: 'budget' | 'cpm' | 'ctr' | 'cvr' | 'aov';
  name: string;
  baseValue: number;
  unit: string;
  adjustments: SensitivityAdjustment[];
  impactRank: number;
  sensitivityTier: 'High' | 'Medium' | 'Low';
  insight: string;
}

export interface SensitivityAnalysis {
  variables: SensitivityVariable[];
  highestImpactFactor: string;
  recommendation: string;
}

export interface ForecastAIExplanation {
  summary: string;
  scenarioInterpretations: {
    conservative: string;
    balanced: string;
    optimistic: string;
  };
  keySensitivities: string[];
  financialRisks: string[];
  metricsToWatch: string[];
  efficiencyOpportunities: string[];
  suggestedNextSteps: string[];
  missingDataAlerts: string[];
  generatedAt: string;
  isAiGenerated: boolean;
}

export interface ForecastDataQuality {
  hasActualData: boolean;
  assumptionsCount: number;
  benchmarkCount: number;
  missingFields: string[];
  qualityScore: 'High' | 'Medium' | 'Low';
  limitations: string[];
}

export interface HistoricalCampaignRecord {
  campaignId: string;
  campaignName: string;
  date: string;
  channel: string;
  actualSpend: number;
  actualRevenue: number;
  actualCustomers: number;
  actualRoas: number;
  actualCpa: number;
  actualCpc: number;
  actualCtr: number;
  currency: string;
}

export interface Forecast {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  projectName?: string;
  strategyId?: string;
  budgetPlanId?: string;
  inputs: ForecastInput;
  scenarios: {
    conservative: ForecastScenario;
    balanced: ForecastScenario;
    optimistic: ForecastScenario;
  };
  breakEven: BreakEvenAnalysis;
  sensitivity: SensitivityAnalysis;
  aiExplanation?: ForecastAIExplanation;
  dataQuality: ForecastDataQuality;
  historicalComparison?: {
    benchmarkCampaignId?: string;
    benchmarkCampaignName?: string;
    actualSpend?: number;
    actualRevenue?: number;
    actualRoas?: number;
    actualCpa?: number;
    varianceNotes?: string;
  };
}

export interface ForecastListItem {
  id: string;
  title: string;
  createdAt: string;
  projectName?: string;
  totalBudget: number;
  adSpend: number;
  currency: string;
  balancedRevenue: number;
  balancedRoas: number;
  balancedRoi: number;
  qualityScore: 'High' | 'Medium' | 'Low';
}

