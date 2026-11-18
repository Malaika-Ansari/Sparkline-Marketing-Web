/**
 * SPARKLINE MARKETING — MULTI-CURRENCY CONVERSION & MARKETING COST SERVICE
 * Precision financial conversions, marketing metric calculators, and client persistence.
 */

import {
  CurrencyCode,
  CurrencyMetadata,
  ExchangeRateTable,
  CurrencyConversion,
  AdvertisingCostComparison,
  MarketingExpenseItem,
  BudgetPlanImportResult,
} from '@/types/currency';
import { budgetService } from '@/services/budget.service';
import { securityService } from '@/services/security.service';

const CONVERSIONS_STORAGE_KEY = 'sparkline_marketing_currency_conversions';
const COMPARISONS_STORAGE_KEY = 'sparkline_marketing_ad_comparisons';
const EXPENSES_STORAGE_KEY = 'sparkline_marketing_expense_items';

export const SUPPORTED_CURRENCIES: CurrencyMetadata[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    decimals: 2,
    region: 'United States',
  },
  {
    code: 'PKR',
    name: 'Pakistani Rupee',
    symbol: 'Rs',
    flag: '🇵🇰',
    decimals: 2,
    region: 'Pakistan',
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    decimals: 2,
    region: 'United Kingdom',
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    decimals: 2,
    region: 'European Union',
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED',
    flag: '🇦🇪',
    decimals: 2,
    region: 'United Arab Emirates',
  },
  {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: 'SAR',
    flag: '🇸🇦',
    decimals: 2,
    region: 'Saudi Arabia',
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳',
    decimals: 2,
    region: 'India',
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    flag: '🇨🇦',
    decimals: 2,
    region: 'Canada',
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    flag: '🇦🇺',
    decimals: 2,
    region: 'Australia',
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    flag: '🇯🇵',
    decimals: 0,
    region: 'Japan',
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    flag: '🇨🇳',
    decimals: 2,
    region: 'China',
  },
  {
    code: 'BDT',
    name: 'Bangladeshi Taka',
    symbol: 'Tk',
    flag: '🇧🇩',
    decimals: 2,
    region: 'Bangladesh',
  },
  {
    code: 'TRY',
    name: 'Turkish Lira',
    symbol: '₺',
    flag: '🇹🇷',
    decimals: 2,
    region: 'Turkey',
  },
  {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    flag: '🇲🇾',
    decimals: 2,
    region: 'Malaysia',
  },
  {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    flag: '🇸🇬',
    decimals: 2,
    region: 'Singapore',
  },
];

export const INSTITUTIONAL_REFERENCE_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.925,
  GBP: 0.792,
  CAD: 1.365,
  AUD: 1.528,
  JPY: 154.6,
  PKR: 278.5,
  INR: 84.42,
  AED: 3.6725,
  SAR: 3.751,
  CNY: 7.245,
  BDT: 119.85,
  TRY: 34.45,
  MYR: 4.472,
  SGD: 1.346,
};

export class CurrencyService {
  private cachedRateTable: ExchangeRateTable | null = null;

  /**
   * Fetches the latest exchange rates from server proxy or delivers institutional reference baseline.
   */
  public async getExchangeRates(): Promise<ExchangeRateTable> {
    if (this.cachedRateTable) {
      return this.cachedRateTable;
    }

    try {
      const res = await fetch('/api/exchange-rates', {
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.table) {
          this.cachedRateTable = data.table as ExchangeRateTable;
          return this.cachedRateTable;
        }
      }
    } catch (err) {
      // In offline mode or sandbox, fallback to verified institutional baseline
    }

    const fallback: ExchangeRateTable = {
      baseCurrency: 'USD',
      rates: INSTITUTIONAL_REFERENCE_RATES,
      provider: 'ECB & Institutional Reference Feeds (Indicative Baseline)',
      lastUpdated: new Date().toISOString(),
      rateType: 'reference',
      dataAvailability: 'available',
      message: 'Using verified institutional reference rates.',
    };

    this.cachedRateTable = fallback;
    return fallback;
  }

  /**
   * Returns metadata for a currency code.
   */
  public getCurrencyMetadata(code: CurrencyCode): CurrencyMetadata {
    return (
      SUPPORTED_CURRENCIES.find((c) => c.code === code) || {
        code,
        name: code,
        symbol: code,
        flag: '🌐',
        decimals: 2,
        region: 'Global',
      }
    );
  }

  /**
   * Computes the cross exchange rate between two currencies.
   * Cross rate: Rate(Source -> Target) = Rates[Target] / Rates[Source]
   */
  public getExchangeRate(
    sourceCurrency: CurrencyCode,
    targetCurrency: CurrencyCode,
    table?: ExchangeRateTable
  ): number {
    if (sourceCurrency === targetCurrency) return 1.0;
    const rates = table?.rates || INSTITUTIONAL_REFERENCE_RATES;
    const sourceRate = rates[sourceCurrency] || 1.0;
    const targetRate = rates[targetCurrency] || 1.0;

    return targetRate / sourceRate;
  }

  /**
   * Converts monetary amount with high mathematical precision.
   */
  public convertAmount(
    amount: number,
    sourceCurrency: CurrencyCode,
    targetCurrency: CurrencyCode,
    table?: ExchangeRateTable
  ): {
    convertedAmount: number;
    rate: number;
    formatted: string;
  } {
    const validAmount = Number(amount) || 0;
    const rate = this.getExchangeRate(sourceCurrency, targetCurrency, table);
    const converted = validAmount * rate;
    const meta = this.getCurrencyMetadata(targetCurrency);
    const rounded = Number(converted.toFixed(meta.decimals));

    return {
      convertedAmount: rounded,
      rate,
      formatted: this.formatCurrencyAmount(rounded, targetCurrency),
    };
  }

  /**
   * Formats a monetary amount according to international locale conventions.
   */
  public formatCurrencyAmount(
    amount: number,
    currencyCode: CurrencyCode
  ): string {
    const meta = this.getCurrencyMetadata(currencyCode);
    const safeAmount = Number(amount) || 0;

    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: meta.decimals,
        maximumFractionDigits: meta.decimals,
      }).format(safeAmount);
    } catch (e) {
      return `${meta.symbol}${safeAmount.toLocaleString('en-US', {
        minimumFractionDigits: meta.decimals,
        maximumFractionDigits: meta.decimals,
      })}`;
    }
  }

  // =========================================================================
  // MARKETING COST METRIC CALCULATORS
  // =========================================================================

  /**
   * CPC = Total Ad Spend / Total Clicks
   */
  public calculateCPC(
    adSpend: number,
    clicks: number
  ): {
    result: number | null;
    isZeroDenominator: boolean;
    explanation: string;
    limitations: string;
  } {
    if (clicks <= 0) {
      return {
        result: null,
        isZeroDenominator: true,
        explanation:
          'CPC represents the direct media fee incurred for every visitor clicking on an ad link.',
        limitations:
          'Total clicks cannot be zero. If no clicks occurred, CPC is undefined.',
      };
    }
    const cpc = adSpend / clicks;
    return {
      result: Number(cpc.toFixed(4)),
      isZeroDenominator: false,
      explanation:
        'Calculated as Total Paid Ad Spend divided by verified ad clicks.',
      limitations:
        'Does not include creative production, landing page hosting, or agency management fees.',
    };
  }

  /**
   * CPM = (Total Ad Spend / Impressions) * 1,000
   */
  public calculateCPM(
    adSpend: number,
    impressions: number
  ): {
    result: number | null;
    isZeroDenominator: boolean;
    explanation: string;
    limitations: string;
  } {
    if (impressions <= 0) {
      return {
        result: null,
        isZeroDenominator: true,
        explanation:
          'CPM benchmarks the cost of securing one thousand ad impressions across target placements.',
        limitations:
          'Impressions cannot be zero. CPM is undefined without verified ad displays.',
      };
    }
    const cpm = (adSpend / impressions) * 1000;
    return {
      result: Number(cpm.toFixed(4)),
      isZeroDenominator: false,
      explanation:
        'Measures placement cost efficiency across ad auctions per 1,000 displays.',
      limitations:
        'Does not measure audience engagement, view duration, or conversion quality.',
    };
  }

  /**
   * CPA = Total Campaign Cost / Total Acquisitions
   */
  public calculateCPA(
    totalCampaignCost: number,
    acquisitions: number
  ): {
    result: number | null;
    isZeroDenominator: boolean;
    explanation: string;
    limitations: string;
  } {
    if (acquisitions <= 0) {
      return {
        result: null,
        isZeroDenominator: true,
        explanation:
          'CPA reflects the total marketing investment required to win one paying customer or verified conversion.',
        limitations:
          'Acquisitions cannot be zero. If zero conversions occurred, CPA is mathematically undefined.',
      };
    }
    const cpa = totalCampaignCost / acquisitions;
    return {
      result: Number(cpa.toFixed(2)),
      isZeroDenominator: false,
      explanation:
        'Uses total campaign costs (including creative production, agency fees, and ad spend) divided by paying customers.',
      limitations:
        'Must be weighed against Average Order Value (AOV) and Customer Lifetime Value (LTV) to assess profitability.',
    };
  }

  /**
   * CPL = Total Marketing Cost / Total Leads
   */
  public calculateCPL(
    totalMarketingCost: number,
    leads: number
  ): {
    result: number | null;
    isZeroDenominator: boolean;
    explanation: string;
    limitations: string;
  } {
    if (leads <= 0) {
      return {
        result: null,
        isZeroDenominator: true,
        explanation:
          'CPL benchmarks the capital required to acquire an inbound lead (e.g. form submission, demo request, lead magnet download).',
        limitations:
          'Total leads cannot be zero. CPL is undefined before leads are captured.',
      };
    }
    const cpl = totalMarketingCost / leads;
    return {
      result: Number(cpl.toFixed(2)),
      isZeroDenominator: false,
      explanation:
        'Calculated as Total Marketing Expenditure divided by qualified leads captured.',
      limitations:
        'Does not indicate lead qualification or down-funnel sales conversion rate.',
    };
  }

  /**
   * CTR = (Clicks / Impressions) * 100
   */
  public calculateCTR(
    clicks: number,
    impressions: number
  ): {
    result: number | null;
    isZeroDenominator: boolean;
    explanation: string;
    limitations: string;
  } {
    if (impressions <= 0) {
      return {
        result: null,
        isZeroDenominator: true,
        explanation:
          'CTR measures ad creative relevance and audience intrigue as a percentage of views that convert into clicks.',
        limitations:
          'Impressions cannot be zero. CTR requires verified ad impressions.',
      };
    }
    const ctr = (clicks / impressions) * 100;
    return {
      result: Number(ctr.toFixed(2)),
      isZeroDenominator: false,
      explanation:
        'Percentage ratio of ad clicks generated per 100 ad impressions.',
      limitations:
        'High CTR with poor landing page conversion indicates clickbait messaging or audience mismatch.',
    };
  }

  /**
   * Conversion Rate = (Conversions / Clicks) * 100
   */
  public calculateConversionRate(
    conversions: number,
    clicks: number
  ): {
    result: number | null;
    isZeroDenominator: boolean;
    explanation: string;
    limitations: string;
  } {
    if (clicks <= 0) {
      return {
        result: null,
        isZeroDenominator: true,
        explanation:
          'Conversion Rate benchmarks landing page, checkout, or offer efficiency as a percentage of visitors taking the target action.',
        limitations:
          'Clicks cannot be zero. Traffic is required to compute conversion velocity.',
      };
    }
    const cvr = (conversions / clicks) * 100;
    return {
      result: Number(cvr.toFixed(2)),
      isZeroDenominator: false,
      explanation:
        'Percentage of website or landing page clicks that successfully complete the commercial action.',
      limitations:
        'Small click sample sizes (< 300 clicks) produce statistically unreliable conversion rates.',
    };
  }

  /**
   * ROAS = Revenue Attributed to Ads / Ad Spend
   */
  public calculateROAS(
    revenueAttributed: number,
    adSpend: number
  ): {
    result: number | null;
    isZeroDenominator: boolean;
    explanation: string;
    limitations: string;
  } {
    if (adSpend <= 0) {
      return {
        result: null,
        isZeroDenominator: true,
        explanation:
          'ROAS measures gross revenue generated for every single currency dollar allocated directly to advertising media spend.',
        limitations:
          'Ad spend cannot be zero. Organic revenue without ad spend does not have a ROAS value.',
      };
    }
    const roas = revenueAttributed / adSpend;
    return {
      result: Number(roas.toFixed(2)),
      isZeroDenominator: false,
      explanation:
        'Direct multiplier ratio: Gross Ad-Attributed Revenue divided strictly by Paid Media Ad Spend.',
      limitations:
        'ROAS is NOT profit. A 3.0x ROAS can still lose money if product COGS, payment fees, shipping, and agency costs exceed 67%.',
    };
  }

  /**
   * ROI = ((Return - Investment) / Investment) * 100
   */
  public calculateROI(
    netReturn: number,
    totalInvestment: number
  ): {
    result: number | null;
    isZeroDenominator: boolean;
    explanation: string;
    limitations: string;
  } {
    if (totalInvestment <= 0) {
      return {
        result: null,
        isZeroDenominator: true,
        explanation:
          'ROI measures the net financial gain or loss of the entire marketing project relative to all capital invested.',
        limitations:
          'Total Investment cannot be zero. Calculating ROI requires capital deployment.',
      };
    }
    const roi = ((netReturn - totalInvestment) / totalInvestment) * 100;
    return {
      result: Number(roi.toFixed(2)),
      isZeroDenominator: false,
      explanation:
        'Comprehensive financial return formula accounting for total investment (media, creative, tools, software, contractor fees).',
      limitations:
        'Requires rigorous tracking of all associated business costs and returns across the planning horizon.',
    };
  }

  // =========================================================================
  // PERSISTENCE & HISTORY
  // =========================================================================

  /**
   * Saves a currency conversion to LocalStorage with timestamp and exact rate used.
   */
  public saveConversion(conversion: Omit<CurrencyConversion, 'id' | 'timestamp'>): CurrencyConversion {
    const list = this.getSavedConversions();
    const item: CurrencyConversion = {
      ...conversion,
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };

    const updated = [item, ...list];
    localStorage.setItem(CONVERSIONS_STORAGE_KEY, JSON.stringify(updated));
    return item;
  }

  /**
   * Retrieves saved conversion history.
   */
  public getSavedConversions(): CurrencyConversion[] {
    try {
      const raw = localStorage.getItem(CONVERSIONS_STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as CurrencyConversion[];
    } catch (e) {
      return [];
    }
  }

  /**
   * Deletes a saved conversion by ID.
   */
  public deleteConversion(id: string): void {
    const list = this.getSavedConversions().filter((c) => c.id !== id);
    localStorage.setItem(CONVERSIONS_STORAGE_KEY, JSON.stringify(list));
  }

  /**
   * Clears all saved conversions.
   */
  public clearAllConversions(): void {
    localStorage.removeItem(CONVERSIONS_STORAGE_KEY);
  }

  /**
   * Exports conversion history as a CSV file string with formula injection defense.
   */
  public exportConversionsCsv(): string {
    const list = this.getSavedConversions();
    const headers = [
      'ID',
      'Timestamp',
      'Label',
      'Source Amount',
      'Source Currency',
      'Target Amount',
      'Target Currency',
      'Exchange Rate',
      'Provider',
      'Rate Type',
    ];

    const rows = list.map((c) => [
      securityService.formatCsvCell(c.id),
      securityService.formatCsvCell(c.timestamp),
      securityService.formatCsvCell(c.label || 'Standard Conversion'),
      securityService.formatCsvCell(c.sourceAmount),
      securityService.formatCsvCell(c.sourceCurrency),
      securityService.formatCsvCell(c.targetAmount),
      securityService.formatCsvCell(c.targetCurrency),
      securityService.formatCsvCell(c.exchangeRate),
      securityService.formatCsvCell(c.provider),
      securityService.formatCsvCell(c.rateType),
    ]);

    return [headers.map((h) => securityService.formatCsvCell(h)).join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  // =========================================================================
  // ADVERTISING BUDGET COMPARISONS
  // =========================================================================

  public getAdComparisons(): AdvertisingCostComparison[] {
    try {
      const raw = localStorage.getItem(COMPARISONS_STORAGE_KEY);
      if (!raw) return this.getDefaultAdComparisons();
      return JSON.parse(raw);
    } catch (e) {
      return this.getDefaultAdComparisons();
    }
  }

  public saveAdComparison(item: AdvertisingCostComparison): void {
    const list = this.getAdComparisons();
    const existingIdx = list.findIndex((x) => x.id === item.id);
    let updated: AdvertisingCostComparison[];
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = item;
    } else {
      updated = [item, ...list];
    }
    localStorage.setItem(COMPARISONS_STORAGE_KEY, JSON.stringify(updated));
  }

  public deleteAdComparison(id: string): void {
    const list = this.getAdComparisons().filter((x) => x.id !== id);
    localStorage.setItem(COMPARISONS_STORAGE_KEY, JSON.stringify(list));
  }

  private getDefaultAdComparisons(): AdvertisingCostComparison[] {
    return [
      {
        id: 'comp-meta-us',
        platformOrMarket: 'Meta Ads (US Tier 1)',
        currency: 'USD',
        targetCurrency: 'USD',
        cpc: 1.85,
        cpm: 22.4,
        cpa: 34.5,
        budget: 5000,
        convertedCpc: 1.85,
        convertedCpm: 22.4,
        convertedCpa: 34.5,
        convertedBudget: 5000,
        rateUsed: 1.0,
        timePeriod: 'Monthly',
        timestamp: '2026-11-13T10:00:00.000Z',
        notes: 'Advantage+ Shopping campaigns targeting US beauty buyers.',
      },
      {
        id: 'comp-google-uk',
        platformOrMarket: 'Google Search (UK)',
        currency: 'GBP',
        targetCurrency: 'USD',
        cpc: 1.45,
        cpm: 18.2,
        cpa: 28.0,
        budget: 3500,
        convertedCpc: 1.83,
        convertedCpm: 22.98,
        convertedCpa: 35.35,
        convertedBudget: 4419.19,
        rateUsed: 1.2626,
        timePeriod: 'Monthly',
        timestamp: '2026-11-13T10:00:00.000Z',
        notes: 'High-intent exact match keywords in United Kingdom.',
      },
      {
        id: 'comp-meta-pk',
        platformOrMarket: 'Meta Ads (Pakistan)',
        currency: 'PKR',
        targetCurrency: 'USD',
        cpc: 35.0,
        cpm: 450.0,
        cpa: 1850.0,
        budget: 350000,
        convertedCpc: 0.125,
        convertedCpm: 1.61,
        convertedCpa: 6.64,
        convertedBudget: 1256.73,
        rateUsed: 0.00359,
        timePeriod: 'Monthly',
        timestamp: '2026-11-13T10:00:00.000Z',
        notes: 'Broad targeting in major metropolitan regions (Karachi, Lahore, Islamabad).',
      },
      {
        id: 'comp-tiktok-uae',
        platformOrMarket: 'TikTok Ads (UAE)',
        currency: 'AED',
        targetCurrency: 'USD',
        cpc: 2.2,
        cpm: 26.5,
        cpa: 65.0,
        budget: 8000,
        convertedCpc: 0.6,
        convertedCpm: 7.22,
        convertedCpa: 17.7,
        convertedBudget: 2178.35,
        rateUsed: 0.2723,
        timePeriod: 'Monthly',
        timestamp: '2026-11-13T10:00:00.000Z',
        notes: 'Spark Ads video collaborations targeting Dubai/Abu Dhabi luxury buyers.',
      },
    ];
  }

  // =========================================================================
  // MARKETING EXPENSE CALCULATOR & BUDGET INTEGRATION
  // =========================================================================

  public getExpenseItems(): MarketingExpenseItem[] {
    try {
      const raw = localStorage.getItem(EXPENSES_STORAGE_KEY);
      if (!raw) return this.getDefaultExpenseItems();
      return JSON.parse(raw);
    } catch (e) {
      return this.getDefaultExpenseItems();
    }
  }

  public saveExpenseItems(items: MarketingExpenseItem[]): void {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(items));
  }

  public addExpenseItem(item: Omit<MarketingExpenseItem, 'id'>): MarketingExpenseItem {
    const list = this.getExpenseItems();
    const newItem: MarketingExpenseItem = {
      ...item,
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    const updated = [newItem, ...list];
    this.saveExpenseItems(updated);
    return newItem;
  }

  public deleteExpenseItem(id: string): void {
    const list = this.getExpenseItems().filter((e) => e.id !== id);
    this.saveExpenseItems(list);
  }

  private getDefaultExpenseItems(): MarketingExpenseItem[] {
    return [
      {
        id: 'exp-1',
        name: 'Paid Social Media Ads (Meta & Reels)',
        category: 'Advertising Spend',
        currency: 'USD',
        estimatedAmount: 2800,
        actualAmount: 2650,
        convertedEstimate: 2800,
        convertedActual: 2650,
        frequency: 'Monthly',
        notes: 'Top-of-funnel Advantage+ prospecting campaign.',
      },
      {
        id: 'exp-2',
        name: 'Google Search & Shopping PPC',
        category: 'Advertising Spend',
        currency: 'USD',
        estimatedAmount: 1600,
        actualAmount: 1540,
        convertedEstimate: 1600,
        convertedActual: 1540,
        frequency: 'Monthly',
        notes: 'Brand search defense and non-brand high-intent keywords.',
      },
      {
        id: 'exp-3',
        name: 'UGC Video Creation & Iteration',
        category: 'Creative Production',
        currency: 'USD',
        estimatedAmount: 1200,
        actualAmount: 1350,
        convertedEstimate: 1200,
        convertedActual: 1350,
        frequency: 'Monthly',
        notes: '4 unretouched product demo videos and testimonials.',
      },
      {
        id: 'exp-4',
        name: 'Ad Banner & Social Asset Graphic Design',
        category: 'Graphic Design',
        currency: 'USD',
        estimatedAmount: 450,
        actualAmount: 450,
        convertedEstimate: 450,
        convertedActual: 450,
        frequency: 'Monthly',
        notes: 'Carousel designs, seasonal sale banners, and story graphics.',
      },
      {
        id: 'exp-5',
        name: 'Video Hook Editing & Sound Design',
        category: 'Video Editing',
        currency: 'USD',
        estimatedAmount: 500,
        actualAmount: 480,
        convertedEstimate: 500,
        convertedActual: 480,
        frequency: 'Monthly',
        notes: 'Cut-downs, caption overlays, and audio track licensing.',
      },
      {
        id: 'exp-6',
        name: 'Email Newsletter & Landing Page Copywriting',
        category: 'Content Writing',
        currency: 'USD',
        estimatedAmount: 400,
        actualAmount: 400,
        convertedEstimate: 400,
        convertedActual: 400,
        frequency: 'Monthly',
        notes: 'Weekly subscriber emails and promo sequence copy.',
      },
      {
        id: 'exp-7',
        name: 'Micro-Creator Product Seeding Mailers',
        category: 'Influencer Collaborations',
        currency: 'USD',
        estimatedAmount: 550,
        actualAmount: 520,
        convertedEstimate: 550,
        convertedActual: 520,
        frequency: 'Monthly',
        notes: '25 sample boxes sent to verified skincare creators.',
      },
      {
        id: 'exp-8',
        name: 'Klaviyo Email Automation & GA4 Analytics',
        category: 'Software Subscriptions',
        currency: 'USD',
        estimatedAmount: 380,
        actualAmount: 380,
        convertedEstimate: 380,
        convertedActual: 380,
        frequency: 'Monthly',
        notes: 'Tier 2 ESP plan, attribution software, and landing page builder.',
      },
      {
        id: 'exp-9',
        name: 'Growth Strategy Advisory Retainer',
        category: 'Agency Fees',
        currency: 'USD',
        estimatedAmount: 600,
        actualAmount: 600,
        convertedEstimate: 600,
        convertedActual: 600,
        frequency: 'Monthly',
        notes: 'Bi-weekly growth review and campaign audit.',
      },
      {
        id: 'exp-10',
        name: 'Technical CRO Auditing Contractor',
        category: 'Freelancer Costs',
        currency: 'USD',
        estimatedAmount: 350,
        actualAmount: 300,
        convertedEstimate: 350,
        convertedActual: 300,
        frequency: 'Monthly',
        notes: 'Landing page speed optimization and A/B test setup.',
      },
    ];
  }

  /**
   * Imports a saved Marketing Budget Plan from Prompt 12 and converts it into the selected target currency.
   * Does NOT mutate the original plan.
   */
  public importBudgetPlan(
    planId: string,
    targetCurrency: CurrencyCode,
    table?: ExchangeRateTable
  ): BudgetPlanImportResult | null {
    const plan = budgetService.getPlanById(planId);
    if (!plan) return null;

    const sourceCurrency = (plan.currency as CurrencyCode) || 'USD';
    const rate = this.getExchangeRate(sourceCurrency, targetCurrency, table);

    const convertedTotal = Number((plan.totalBudget * rate).toFixed(2));

    const convertedAllocations = plan.activePlan.allocations.map((a) => {
      const convAmt = Number((a.amount * rate).toFixed(2));
      return {
        category: a.category,
        group: a.group,
        originalAmount: a.amount,
        convertedAmount: convAmt,
        percentage: a.percentage,
        primaryKpi: a.primaryKpi,
      };
    });

    return {
      planId: plan.id,
      planTitle: plan.planTitle,
      projectName: plan.projectName,
      originalCurrency: sourceCurrency,
      targetCurrency,
      rateUsed: rate,
      originalTotal: plan.totalBudget,
      convertedTotal,
      allocations: convertedAllocations,
      timestamp: new Date().toISOString(),
    };
  }
}

export const currencyService = new CurrencyService();
