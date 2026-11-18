/**
 * Professional Marketing Reports & PDF Export Domain Models
 * Sparkline Marketing Intelligence Platform — Phase 20
 */

export type ReportStatus = 'Draft' | 'Generating' | 'Ready' | 'Failed' | 'Archived';

export type ReportDetailLevel = 'Brief' | 'Standard' | 'Comprehensive';

export type DataProvenanceType =
  | 'User-provided information'
  | 'Imported data'
  | 'Connected-platform data'
  | 'Calculated result'
  | 'AI-generated interpretation'
  | 'AI recommendation'
  | 'Estimate'
  | 'Assumption'
  | 'Verified external benchmark'
  | 'Unverified observation';

export type ReportSectionId =
  | 'cover'
  | 'executive_summary'
  | 'business_overview'
  | 'marketing_objectives'
  | 'target_audience'
  | 'market_research'
  | 'industry_trends'
  | 'competitor_analysis'
  | 'swot_analysis'
  | 'pestle_analysis'
  | 'marketing_strategy'
  | 'recommended_channels'
  | 'budget_allocation'
  | 'currency_conversions'
  | 'marketing_metrics'
  | 'forecast_scenarios'
  | 'advertising_campaigns'
  | 'social_media_strategy'
  | 'content_plan'
  | 'seo_audit'
  | 'marketing_calendar'
  | 'task_progress'
  | 'risks_recommendations'
  | 'sources_references'
  | 'appendix';

export interface ReportSectionMeta {
  id: ReportSectionId;
  title: string;
  category: 'Foundation' | 'Intelligence' | 'Strategy' | 'Financials' | 'Execution' | 'Governance';
  description: string;
  defaultIncluded: boolean;
  isSupportedByData: boolean;
  dataState: 'complete' | 'partial' | 'missing';
  missingDataNote?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  purpose: string;
  intendedAudience: string[];
  includedSections: ReportSectionId[];
  requiredData: string[];
  optionalData: string[];
  recommendedCharts: string[];
  defaultDetailLevel: ReportDetailLevel;
  badge?: string;
}

export interface ReportSourceCitation {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  publicationDate?: string;
  retrievalDate: string;
  claimOrObservation: string;
  provenance: DataProvenanceType;
}

export interface ReportSectionContent {
  sectionId: ReportSectionId;
  title: string;
  summary: string;
  narrativeBlocks: string[];
  kpis?: Array<{
    label: string;
    value: string;
    subtext?: string;
    provenance: DataProvenanceType;
    change?: string;
  }>;
  tables?: Array<{
    title: string;
    headers: string[];
    rows: string[][];
    provenance?: DataProvenanceType;
    footnote?: string;
  }>;
  charts?: Array<{
    id: string;
    type: 'bar' | 'line' | 'pie' | 'kpi';
    title: string;
    data: Array<Record<string, unknown>>;
  }>;
  recommendations?: string[];
  assumptions?: string[];
  limitations?: string[];
  sources?: ReportSourceCitation[];
  provenance: DataProvenanceType;
  isMissingData?: boolean;
}

export interface ReportBranding {
  brandName: string;
  tagline?: string;
  logoUrl?: string;
  primaryColor: string; // e.g. #0C65F4
  accentColor: string; // e.g. #071329
  preparedBy: string;
  preparedFor: string;
}

export interface ReportConfiguration {
  projectId: string;
  templateId: string;
  title: string;
  subtitle: string;
  reportingPeriod: string;
  reportDate: string;
  detailLevel: ReportDetailLevel;
  includedSections: ReportSectionId[];
  includeCoverPage: boolean;
  includeTableOfContents: boolean;
  includeCharts: boolean;
  includeSources: boolean;
  branding: ReportBranding;
}

export interface MarketingReport {
  id: string;
  userId?: string;
  projectId: string;
  projectName: string;
  templateId: string;
  templateName: string;
  title: string;
  subtitle: string;
  status: ReportStatus;
  version: number;
  configuration: ReportConfiguration;
  sections: ReportSectionContent[];
  executiveSummary: string;
  pageCountEstimate: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  lastGeneratedAt?: string;
  downloadCount: number;
}

