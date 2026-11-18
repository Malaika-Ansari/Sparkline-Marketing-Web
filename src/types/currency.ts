/**
 * SPARKLINE MARKETING — MULTI-CURRENCY CONVERSION & MARKETING COST DOMAIN TYPES
 * Phase 13: Multi-Currency Converter, Marketing Cost Metrics & Expense Calculator
 */

export type CurrencyCode =
  | 'USD'
  | 'PKR'
  | 'GBP'
  | 'EUR'
  | 'AED'
  | 'SAR'
  | 'INR'
  | 'CAD'
  | 'AUD'
  | 'JPY'
  | 'CNY'
  | 'BDT'
  | 'TRY'
  | 'MYR'
  | 'SGD';

export interface CurrencyMetadata {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  decimals: number;
  region: string;
}

export type RateType = 'live' | 'reference' | 'indicative';
export type DataAvailability = 'available' | 'unavailable' | 'stale';

export interface ExchangeRateTable {
  baseCurrency: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  provider: string;
  lastUpdated: string;
  rateType: RateType;
  dataAvailability: DataAvailability;
  message?: string;
}

export interface CurrencyConversion {
  id: string;
  timestamp: string;
  sourceAmount: number;
  sourceCurrency: CurrencyCode;
  targetAmount: number;
  targetCurrency: CurrencyCode;
  exchangeRate: number;
  provider: string;
  rateType: RateType;
  label?: string;
}

export type MarketingMetricType =
  | 'CPC'
  | 'CPM'
  | 'CPA'
  | 'CPL'
  | 'CTR'
  | 'CVR'
  | 'ROAS'
  | 'ROI';

export interface MarketingCostCalculation {
  id: string;
  metric: MarketingMetricType;
  name: string;
  formula: string;
  inputs: Record<string, number>;
  result: number | null;
  formattedResult: string;
  unit: string;
  currency?: CurrencyCode;
  explanation: string;
  limitations: string;
  isZeroDenominator: boolean;
  timestamp: string;
}

export interface AdvertisingCostComparison {
  id: string;
  platformOrMarket: string;
  currency: CurrencyCode;
  targetCurrency: CurrencyCode;
  cpc: number;
  cpm: number;
  cpa: number;
  budget: number;
  convertedCpc: number;
  convertedCpm: number;
  convertedCpa: number;
  convertedBudget: number;
  rateUsed: number;
  timePeriod: string;
  timestamp: string;
  notes?: string;
}

export type MarketingExpenseCategory =
  | 'Advertising Spend'
  | 'Creative Production'
  | 'Graphic Design'
  | 'Video Editing'
  | 'Content Writing'
  | 'Influencer Collaborations'
  | 'Software Subscriptions'
  | 'Agency Fees'
  | 'Freelancer Costs'
  | 'Other Marketing Expenses';

export interface MarketingExpenseItem {
  id: string;
  name: string;
  category: MarketingExpenseCategory;
  currency: CurrencyCode;
  estimatedAmount: number;
  actualAmount?: number;
  convertedEstimate: number;
  convertedActual?: number;
  frequency: 'Monthly' | 'Campaign' | 'One-Time';
  notes?: string;
}

export interface ConvertedBudgetAllocation {
  category: string;
  group: string;
  originalAmount: number;
  convertedAmount: number;
  percentage: number;
  primaryKpi: string;
}

export interface BudgetPlanImportResult {
  planId: string;
  planTitle: string;
  projectName: string;
  originalCurrency: string;
  targetCurrency: CurrencyCode;
  rateUsed: number;
  originalTotal: number;
  convertedTotal: number;
  allocations: ConvertedBudgetAllocation[];
  timestamp: string;
}

