/**
 * Advanced Analytics Domain Types
 * Sparkline Marketing Intelligence Platform — Phase 23
 */

export type DataProvenanceSource =
  | 'user-entered'
  | 'imported'
  | 'connected-platform'
  | 'calculated'
  | 'ai-interpretation'
  | 'estimate';

export type DataQualityStatus =
  | 'verified'
  | 'unverified'
  | 'anomalous'
  | 'estimated'
  | 'demo';

export type DateRangePreset =
  | '7d'
  | '14d'
  | '30d'
  | '90d'
  | 'ytd'
  | 'all'
  | 'custom';

export type ComparePeriodOption = 'none' | 'previous-period' | 'previous-year';

export type AnalyticsChannel =
  | 'all'
  | 'meta'
  | 'google'
  | 'tiktok'
  | 'linkedin'
  | 'organic_search'
  | 'social_media'
  | 'email';

export interface AnalyticsDateFilter {
  preset: DateRangePreset;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  comparePeriod: ComparePeriodOption;
}

export interface AnalyticsDataPoint {
  id: string;
  projectId: string;
  date: string; // YYYY-MM-DD
  platform: string; // Meta Ads, Google Ads, TikTok Ads, LinkedIn Ads, Organic Search, etc.
  channel: string;
  campaignId?: string;
  campaignName?: string;
  adGroupId?: string;
  adId?: string;
  currency: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  leads: number;
  conversions: number;
  revenue: number;
  ctr: number; // percentage (0-100)
  cpc: number;
  cpm: number;
  cpa: number;
  roas: number;
  roi?: number;
  cac?: number;
  conversionRate: number; // percentage (0-100)
  attributionWindow: string; // e.g. "7d_click_1d_view", "last_non_direct"
  dataSource: DataProvenanceSource;
  sourceId?: string;
  dataQuality: DataQualityStatus;
  syncedAt?: string;
}

export interface MetricCardValue {
  value: number;
  changePct?: number; // relative change vs compare period
  isUnavailable?: boolean;
  unavailableReason?: string;
  provenance: DataProvenanceSource;
  unit: 'currency' | 'number' | 'percent';
}

export interface AnalyticsKPISummary {
  totalSpend: MetricCardValue;
  totalImpressions: MetricCardValue;
  totalReach: MetricCardValue;
  totalClicks: MetricCardValue;
  ctr: MetricCardValue;
  cpc: MetricCardValue;
  cpm: MetricCardValue;
  leads: MetricCardValue;
  conversions: MetricCardValue;
  conversionRate: MetricCardValue;
  cpa: MetricCardValue;
  revenue: MetricCardValue;
  roas: MetricCardValue;
  roi: MetricCardValue;
  cac: MetricCardValue;
}

export interface MarketingFunnelStage {
  id: string;
  name: string;
  count: number;
  value?: number;
  conversionRateFromPrevious: number; // percentage 0-100
  dropOffRate: number; // percentage 0-100
  isBottleneck: boolean;
  isConfigured: boolean;
  isEstimated: boolean;
  notes?: string;
}

export interface MarketingFunnel {
  stages: MarketingFunnelStage[];
  overallConversionRate: number;
  totalRevenue: number;
  bottleneckStageName?: string;
  configuredStagesCount: number;
}

export interface AnalyticsInsight {
  id: string;
  type:
    | 'positive-trend'
    | 'negative-trend'
    | 'problem'
    | 'budget-efficiency'
    | 'opportunity'
    | 'experiment'
    | 'next-action';
  classification:
    | 'measured-observation'
    | 'calculated-finding'
    | 'ai-interpretation'
    | 'recommendation'
    | 'hypothesis';
  title: string;
  description: string;
  supportingMetric: string;
  evidence: string;
  confidence: 'high' | 'medium' | 'preliminary';
  action: string;
}

export interface PerformanceComparisonItem {
  id: string;
  dimension: 'campaign' | 'platform' | 'channel' | 'period' | 'project';
  name: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  leads: number;
  conversions: number;
  cpa: number;
  revenue: number;
  roas: number;
  roi: number;
  attributionNote: string;
  provenance: DataProvenanceSource;
  currency: string;
}

export interface AnalyticsExportPayload {
  projectId: string;
  projectName: string;
  currency: string;
  generatedAt: string;
  dateRange: string;
  kpis: Record<string, number | string>;
  comparisons: PerformanceComparisonItem[];
  insights: AnalyticsInsight[];
}

