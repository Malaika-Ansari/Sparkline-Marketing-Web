/**
 * SEO Intelligence & Optimization Domain Models
 * Sparkline Marketing Intelligence Platform - Phase 18
 */

export type SEOAuditFindingPriority =
  | 'Critical'
  | 'High Priority'
  | 'Medium Priority'
  | 'Low Priority'
  | 'Passed Checks';

export type SEOAuditCategory =
  | 'Technical SEO'
  | 'On-Page SEO'
  | 'Content Quality'
  | 'Metadata'
  | 'Images'
  | 'Links'
  | 'Mobile';

export type SearchIntent =
  | 'Informational'
  | 'Navigational'
  | 'Commercial'
  | 'Transactional'
  | 'Local'
  | 'Long-tail';

export type TechnicalSEOCheckStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Completed'
  | 'Needs Attention'
  | 'Not Applicable';

export type SEOContentStatus =
  | 'Idea'
  | 'Researching'
  | 'Brief Ready'
  | 'Writing'
  | 'In Review'
  | 'Published'
  | 'Needs Update';

export type SEOContentType =
  | 'Blog Article'
  | 'Product Page'
  | 'Category Page'
  | 'Landing Page'
  | 'Service Page'
  | 'Local Business Page'
  | 'Comparison Guide';

/**
 * Individual SEO Audit Finding with Grounding and Verification State
 */
export interface SEOAuditFinding {
  id: string;
  category: SEOAuditCategory;
  priority: SEOAuditFindingPriority;
  title: string;
  description: string;
  whyItMatters: string;
  evidence: string;
  recommendedCorrection: string;
  isVerified: boolean;
}

/**
 * Complete Structured Website SEO Audit Result
 */
export interface SEOAudit {
  id: string;
  url: string;
  retrievedAt: string;
  httpStatus: number;
  responseSizeBytes: number;
  meta: {
    title: string;
    description: string;
    canonical: string;
    robots: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    viewport?: string;
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  images: {
    total: number;
    missingAlt: number;
    sampleImages: Array<{ src: string; alt: string; missingAlt: boolean }>;
  };
  links: {
    internalCount: number;
    externalCount: number;
    sampleInternal: string[];
    sampleExternal: string[];
  };
  structuredData: {
    hasJsonLd: boolean;
    types: string[];
  };
  findings: SEOAuditFinding[];
  summary: {
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    passedCount: number;
  };
  isLiveAudit: boolean;
  manualHtmlInputUsed?: boolean;
}

/**
 * Keyword Record with Categorization and Opportunity Rationale
 */
export interface Keyword {
  id: string;
  term: string;
  intent: SearchIntent;
  category: string;
  clusterName?: string;
  priority: 'High' | 'Medium' | 'Low';
  suggestedPageType: string;
  recommendedAngle: string;
  opportunityRationale: string;
  isAiGenerated: boolean;
  verifiedMetrics?: {
    searchVolume?: number;
    cpc?: number;
    difficulty?: number;
    providerName: string;
    retrievedDate: string;
  };
  assignedPageUrl?: string;
  notes?: string;
  createdAt: string;
}

/**
 * Keyword Topic Cluster
 */
export interface KeywordCluster {
  id: string;
  name: string;
  pillarTopic: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  targetIntent: SearchIntent;
  suggestedFormat: SEOContentType;
  rationale: string;
}

/**
 * Detailed On-Page SEO Analysis
 */
export interface OnPageAnalysis {
  id: string;
  urlOrTitle: string;
  targetKeyword: string;
  titleAnalysis: {
    length: number;
    hasKeyword: boolean;
    recommendation: string;
  };
  metaDescriptionAnalysis: {
    length: number;
    hasKeyword: boolean;
    recommendation: string;
  };
  headingAnalysis: {
    h1Count: number;
    h1HasKeyword: boolean;
    structureScore: string;
    recommendations: string[];
  };
  contentLength: number;
  readabilityNotes: string;
  intentAlignment: string;
  internalLinkingSuggestions: string[];
  imageAltNotes: string;
  schemaRecommendations: string[];
  overallFindings: SEOAuditFinding[];
  analyzedAt: string;
}

/**
 * Technical SEO Checklist Item
 */
export interface TechnicalSEOCheck {
  id: string;
  category:
    | 'Security & Protocol'
    | 'Crawling & Indexing'
    | 'Architecture & Links'
    | 'Mobile & UX'
    | 'Schema & Meta';
  checkName: string;
  description: string;
  whyItMatters: string;
  status: TechnicalSEOCheckStatus;
  isAutoDetected: boolean;
  detectedValue?: string;
  notes?: string;
}

/**
 * Competitor SEO Analysis Profile
 */
export interface SEOCompetitorAnalysis {
  id: string;
  competitorName: string;
  competitorUrl: string;
  pageTitle: string;
  metaDescription: string;
  primaryHeadings: string[];
  observedKeywordThemes: string[];
  contentFormat: string;
  internalLinkingObservations: string;
  technicalObservations: string;
  retrievedAt: string;
  isVerified: boolean;
}

/**
 * Backlink Record for Link Building Management
 */
export interface BacklinkRecord {
  id: string;
  sourceUrl: string;
  destinationUrl: string;
  anchorText: string;
  linkType:
    | 'Editorial Link'
    | 'Directory'
    | 'Partner Mention'
    | 'Guest Contribution'
    | 'Resource List'
    | 'Other';
  relStatus: 'follow' | 'nofollow' | 'ugc' | 'sponsored' | 'unknown';
  notes?: string;
  lastCheckedDate: string;
  isVerified: boolean;
}

/**
 * SEO Editorial Content Plan
 */
export interface SEOContentPlan {
  id: string;
  projectId: string;
  title: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntent;
  contentType: SEOContentType;
  targetPublishDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: SEOContentStatus;
  linkedContentStudioId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Verified or Logged Organic Search Performance
 */
export interface SEOPerformanceRecord {
  id: string;
  date: string;
  organicClicks: number;
  organicImpressions: number;
  averagePosition: number;
  ctr: number;
  indexedPages: number;
  organicConversions: number;
  dataSource: 'manual_entry' | 'google_search_console_sync';
  notes?: string;
}

/**
 * SEO Learning Center Article
 */
export interface SEOLearningArticle {
  id: string;
  category:
    | 'SEO Fundamentals'
    | 'Keyword Research'
    | 'On-Page SEO'
    | 'Technical SEO'
    | 'Off-Page SEO'
    | 'Local SEO'
    | 'E-commerce SEO'
    | 'Content Optimization'
    | 'SEO Analytics';
  title: string;
  readTime: string;
  definition: string;
  whyItMatters: string;
  practicalExample: string;
  stepByStepGuidance: string[];
  commonMistakes: string[];
  recommendedTools: string[];
  relatedFeature: string;
}

/**
 * AI-Generated or Structured SEO Content Blueprint
 */
export interface SEOContentBlueprint {
  titleSuggestions: Array<{ title: string; charCount: number }>;
  metaDescriptionSuggestions: Array<{ description: string; charCount: number }>;
  headingOutline: Array<{ tag: string; text: string; keywordTargeted?: string }>;
  contentIntroductionHook: string;
  faqSuggestions: Array<{ question: string; answer: string }>;
  internalLinkingOpportunities: Array<{
    anchorText: string;
    targetPageType: string;
    rationale: string;
  }>;
  imageAltSuggestions: Array<{
    imageConcept: string;
    suggestedAlt: string;
  }>;
  contentRecommendations?: string[];
  faqSchemaJson?: string;
}

