/**
 * SPARKLINE MARKETING — MARKETING METRICS & KNOWLEDGE CENTER DOMAIN TYPES
 * Phase 14: Comprehensive Marketing Metrics Hub, Calculators, Knowledge Base & Benchmarks
 */

export type MetricCategory =
  | 'Advertising & Campaigns'
  | 'Social Media'
  | 'Lead Generation'
  | 'Revenue & Profitability'
  | 'Website & Email';

export type MetricId =
  | 'ctr'
  | 'cpc'
  | 'cpm'
  | 'cpa'
  | 'frequency'
  | 'engagement_rate'
  | 'video_completion'
  | 'cpl'
  | 'conversion_rate'
  | 'roas'
  | 'roi'
  | 'cac'
  | 'clv_ltv'
  | 'bounce_rate'
  | 'email_open_rate'
  | 'email_click_rate';

export type EngagementDenominator = 'followers' | 'reach' | 'impressions';

export type ConversionDenominator = 'clicks' | 'sessions' | 'visitors';

export type CpaCostScope = 'ad_spend_only' | 'total_campaign_cost';

export type LtvCalculationType = 'revenue_based' | 'gross_profit_based';

export interface MetricDefinition {
  id: MetricId;
  name: string;
  shortName: string;
  category: MetricCategory;
  formulaString: string;
  unit: string;
  description: string;
  whyMarketersUseIt: string;
  howToInterpret: string;
  commonMistakes: string[];
  improvementTips: string[];
  relatedMetrics: string[];
  workedExample: {
    scenario: string;
    inputs: Record<string, number | string>;
    calculationSteps: string[];
    result: string;
    interpretation: string;
  };
}

export interface MetricCalculationRecord {
  id: string;
  metricId: MetricId;
  metricName: string;
  category: MetricCategory;
  timestamp: string;
  inputs: Record<string, number | string>;
  resultValue: number | null;
  formattedResult: string;
  unit: string;
  currency?: string;
  methodNotes?: string;
  projectId?: string;
  projectName?: string;
  isZeroDenominator: boolean;
  status: 'valid' | 'zero_denominator' | 'boundary_error';
  notes?: string;
}

export type KnowledgeCategory =
  | 'Marketing Fundamentals'
  | 'Paid Advertising'
  | 'Social Media Marketing'
  | 'SEO'
  | 'Email Marketing'
  | 'E-commerce Marketing'
  | 'Marketing Analytics'
  | 'Conversion Rate Optimization';

export interface MetricKnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  category: KnowledgeCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTimeMinutes: number;
  shortDescription: string;
  content: string;
  examples: string[];
  relatedCalculators: MetricId[];
  practicalTips: string[];
  relatedArticleSlugs: string[];
}

export interface MetricBenchmark {
  id: string;
  metricId: MetricId;
  metricName: string;
  industry: string;
  region: string;
  platform: string;
  averageValue: string;
  rangeLow: string;
  rangeHigh: string;
  methodology: string;
  source: string;
  sourceUrl: string;
  publishedDate: string;
  reportingPeriod: string;
  notes: string;
}

