/**
 * Results Prediction, ROI & ROAS Forecasting Service
 * Sparkline Marketing Intelligence Platform — Phase 15
 */

import {
  Forecast,
  ForecastInput,
  ForecastScenario,
  BreakEvenAnalysis,
  SensitivityAnalysis,
  SensitivityVariable,
  ForecastAIExplanation,
  ForecastDataQuality,
  ForecastListItem,
  ForecastSource,
} from '@/types/forecast';
import { MarketingProject } from '@/types/project';
import { securityService } from './security.service';

const STORAGE_KEY = 'sparkline_marketing_forecasts';

export class ForecastService {
  /**
   * Generates default baseline forecast inputs for a project or blank state
   */
  getDefaultInputs(project?: MarketingProject | null): ForecastInput {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 30);

    const formatDt = (d: Date): string => d.toISOString().split('T')[0] || '';

    const prod = project?.products?.[0];
    const defaultAov = prod?.sellingPrice || 75;
    const defaultCost = prod?.costOfGoods || Math.round(defaultAov * 0.35);
    const calculatedMargin =
      defaultAov > 0 ? Math.round(((defaultAov - defaultCost) / defaultAov) * 100) : 65;
    const defaultMargin = Math.max(0, Math.min(100, calculatedMargin));
    const brand = project?.business?.brandName || 'My Business';
    const industry = project?.business?.industry || 'Technology & Software';
    const location =
      project?.audience?.targetLocations?.join(', ') ||
      project?.business?.location ||
      'North America & Europe';
    const audienceDesc =
      project?.audience?.needsAndProblems ||
      project?.audience?.interests?.join(', ') ||
      'Core Digital Demographics';

    return {
      projectId: project?.id || '',
      projectName: brand,
      productService: prod?.name || `${brand} Core Offering`,
      industry: industry,
      businessModel: (project?.business?.businessType as string) || 'B2C / Direct-to-Consumer',
      targetRegion: location,
      targetAudience: audienceDesc,
      campaignObjective: 'ecommerce_sales',
      platform: 'meta_ads',
      startDate: formatDt(today),
      endDate: formatDt(future),
      durationDays: 30,

      // Financials
      totalBudget: 5000,
      adSpend: 4000,
      creativeCosts: 500,
      agencyCosts: 300,
      softwareCosts: 200,
      sellingPriceAov: defaultAov,
      productCost: defaultCost,
      grossMarginPercent: defaultMargin,
      currency: prod?.currency || 'USD',

      // Assumptions & Benchmarks
      cpm: 12.5,
      cpmSource: 'benchmark' as ForecastSource,
      ctr: 1.85,
      ctrSource: 'benchmark' as ForecastSource,
      leadCvr: 8.5,
      leadCvrSource: 'assumption' as ForecastSource,
      customerCvr: 2.75,
      customerCvrSource: 'benchmark' as ForecastSource,
      aovSource: prod ? 'actual' : 'assumption',

      notes: 'Initial marketing forecast modeled with verified digital advertising benchmarks.',
    };
  }

  /**
   * Calculates a single scenario given input values and efficiency multipliers
   */
  calculateScenario(
    inputs: ForecastInput,
    type: 'conservative' | 'balanced' | 'optimistic',
    multipliers: { cpm: number; ctr: number; cvr: number }
  ): ForecastScenario {
    const adSpend = Math.max(0, inputs.adSpend || 0);
    const creative = Math.max(0, inputs.creativeCosts || 0);
    const agency = Math.max(0, inputs.agencyCosts || 0);
    const software = Math.max(0, inputs.softwareCosts || 0);

    // Total campaign investment
    const calculatedTotalInvestment = adSpend + creative + agency + software;
    const totalInvestment =
      inputs.totalBudget > 0 ? inputs.totalBudget : calculatedTotalInvestment;

    const baseCpm = Math.max(0.01, inputs.cpm || 10);
    const baseCtr = Math.max(0.001, inputs.ctr || 1);
    const baseCvr = Math.max(0.001, inputs.customerCvr || 1);
    const aov = Math.max(0.01, inputs.sellingPriceAov || 1);
    const marginPct =
      inputs.grossMarginPercent !== undefined && inputs.grossMarginPercent >= 0
        ? Math.min(100, inputs.grossMarginPercent)
        : 100;

    // Apply scenario multipliers
    const effectiveCPM = Math.max(0.1, baseCpm * multipliers.cpm);
    const effectiveCTR = Math.max(0.01, baseCtr * multipliers.ctr);
    const effectiveCVR = Math.max(0.01, baseCvr * multipliers.cvr);

    // Impressions = (Ad Spend / CPM) * 1,000
    const rawImpressions = adSpend > 0 ? (adSpend / effectiveCPM) * 1000 : 0;
    const impressions = Math.round(rawImpressions);

    // Clicks = Impressions * (CTR / 100)
    const rawClicks = (impressions * effectiveCTR) / 100;
    const clicks = Math.round(rawClicks);

    // Leads (if lead CVR is configured)
    const baseLeadCvr = inputs.leadCvr ? inputs.leadCvr * multipliers.cvr : 0;
    const rawLeads = baseLeadCvr > 0 ? (clicks * baseLeadCvr) / 100 : 0;
    const leads = Math.round(rawLeads);

    // Customers = Clicks * (Customer CVR / 100)
    const rawCustomers = (clicks * effectiveCVR) / 100;
    const customers = Math.round(rawCustomers);

    // Revenue = Customers * AOV
    const revenue = Math.round(customers * aov * 100) / 100;

    // Gross Profit = Revenue * (Gross Margin % / 100)
    const grossProfit = Math.round(revenue * (marginPct / 100) * 100) / 100;

    // Unit economics
    const cpc = clicks > 0 ? Math.round((adSpend / clicks) * 100) / 100 : 0;
    const cpm = impressions > 0 ? Math.round(((adSpend / impressions) * 1000) * 100) / 100 : effectiveCPM;
    const cpa = customers > 0 ? Math.round((adSpend / customers) * 100) / 100 : 0;
    const fullyLoadedCPA =
      customers > 0 ? Math.round((totalInvestment / customers) * 100) / 100 : 0;

    const conversionRate =
      clicks > 0 ? Math.round((customers / clicks) * 10000) / 100 : effectiveCVR;

    // ROAS = Attributed Revenue / Ad Spend
    const roas = adSpend > 0 ? Math.round((revenue / adSpend) * 100) / 100 : 0;

    // ROI Revenue = ((Revenue - Total Investment) / Total Investment) * 100
    const roiRevenue =
      totalInvestment > 0
        ? Math.round(((revenue - totalInvestment) / totalInvestment) * 10000) / 100
        : 0;

    // ROI Profit = ((Gross Profit - Total Investment) / Total Investment) * 100
    const roiProfit =
      totalInvestment > 0 && inputs.grossMarginPercent !== undefined
        ? Math.round(((grossProfit - totalInvestment) / totalInvestment) * 10000) / 100
        : undefined;

    // Net financial return
    const netReturn =
      inputs.grossMarginPercent !== undefined
        ? Math.round((grossProfit - totalInvestment) * 100) / 100
        : Math.round((revenue - totalInvestment) * 100) / 100;

    let scenarioName = 'Balanced Scenario';
    let scenarioDescription =
      'Realistic baseline expectation grounded in verified industry benchmarks or provided historical baselines.';
    let riskLevel: 'low' | 'moderate' | 'high' = 'moderate';
    const assumptionsSummary: string[] = [];
    const keyRisks: string[] = [];

    if (type === 'conservative') {
      scenarioName = 'Conservative Scenario';
      scenarioDescription =
        'Defensive planning model assuming auction bid inflation (+20% CPM), lower initial click-through (-25% CTR), and conservative on-site conversion (-30% CVR).';
      riskLevel = 'low';
      assumptionsSummary.push(
        `Auction CPM elevated by 20% to ${effectiveCPM.toFixed(2)} due to competitive auction pressure`,
        `Creative response dampened by 25% to ${effectiveCTR.toFixed(2)}% CTR`,
        `On-page conversion rate dampened by 30% to ${effectiveCVR.toFixed(2)}% CVR`
      );
      keyRisks.push(
        'Creative fatigue or weak value proposition causing poor initial click engagement',
        'Higher auction competition driving up CPM above standard category baselines',
        'Landing page friction or checkout barriers depressing baseline conversions'
      );
    } else if (type === 'optimistic') {
      scenarioName = 'Optimistic Scenario';
      scenarioDescription =
        'High-performance outcome assuming resonance in creative hooks (-15% CPM efficiency), elevated engagement (+25% CTR), and streamlined conversion (+25% CVR). Not guaranteed.';
      riskLevel = 'high';
      assumptionsSummary.push(
        `Auction CPM discounted by 15% to ${effectiveCPM.toFixed(2)} through high ad quality scores`,
        `Ad creative outperforming average benchmarks by +25% reaching ${effectiveCTR.toFixed(2)}% CTR`,
        `High-intent traffic yielding +25% on-page conversion reaching ${effectiveCVR.toFixed(2)}% CVR`
      );
      keyRisks.push(
        'Requires continuous creative iteration to maintain high click-through rates',
        'Scalability limits: marginal returns may diminish as daily spend scales beyond initial core audience',
        'Must not be used as the sole capital commitment basis without contingency reserves'
      );
    } else {
      assumptionsSummary.push(
        `Base CPM of ${effectiveCPM.toFixed(2)} reflecting benchmark auction rates`,
        `Expected CTR of ${effectiveCTR.toFixed(2)}% aligned with channel averages`,
        `Expected conversion rate of ${effectiveCVR.toFixed(2)}% based on product category`
      );
      keyRisks.push(
        'Audience saturation if audience sizing is narrower than budget velocity',
        'Tracking discrepancies between platform analytics and backend payments'
      );
    }

    return {
      type,
      name: scenarioName,
      description: scenarioDescription,
      riskLevel,
      multiplierContext: {
        cpmMultiplier: multipliers.cpm,
        ctrMultiplier: multipliers.ctr,
        cvrMultiplier: multipliers.cvr,
      },
      effectiveCPM: Math.round(effectiveCPM * 100) / 100,
      effectiveCTR: Math.round(effectiveCTR * 100) / 100,
      effectiveCVR: Math.round(effectiveCVR * 100) / 100,
      impressions,
      clicks,
      leads,
      customers,
      revenue,
      grossProfit,
      adSpend,
      totalInvestment,
      cpc,
      cpm,
      cpa,
      fullyLoadedCPA,
      conversionRate,
      roas,
      roiRevenue,
      roiProfit,
      netReturn,
      assumptionsSummary,
      keyRisks,
    };
  }

  /**
   * Generates all three distinct forecast scenarios: Conservative, Balanced, and Optimistic
   */
  generateAllScenarios(inputs: ForecastInput): {
    conservative: ForecastScenario;
    balanced: ForecastScenario;
    optimistic: ForecastScenario;
  } {
    return {
      conservative: this.calculateScenario(inputs, 'conservative', {
        cpm: 1.2, // +20% CPM
        ctr: 0.75, // -25% CTR
        cvr: 0.7, // -30% CVR
      }),
      balanced: this.calculateScenario(inputs, 'balanced', {
        cpm: 1.0,
        ctr: 1.0,
        cvr: 1.0,
      }),
      optimistic: this.calculateScenario(inputs, 'optimistic', {
        cpm: 0.85, // -15% CPM (better delivery)
        ctr: 1.25, // +25% CTR
        cvr: 1.25, // +25% CVR
      }),
    };
  }

  /**
   * Calculates comprehensive Break-Even Analysis
   */
  calculateBreakEven(
    inputs: ForecastInput,
    balancedScenario: ForecastScenario
  ): BreakEvenAnalysis {
    const totalInvestment = Math.max(0, balancedScenario.totalInvestment);
    const adSpend = Math.max(0, balancedScenario.adSpend);
    const aov = Math.max(0.01, inputs.sellingPriceAov);
    const marginPct =
      inputs.grossMarginPercent !== undefined && inputs.grossMarginPercent > 0
        ? Math.min(100, inputs.grossMarginPercent)
        : undefined;

    if (totalInvestment <= 0 || aov <= 0) {
      return {
        isCalculable: false,
        breakEvenRevenue: 0,
        breakEvenCustomers: 0,
        breakEvenROAS: 0,
        maxAllowableCPA: 0,
        maxAllowableMediaCPA: 0,
        requiredConversionRate: 0,
        calculationBasis: 'revenue',
        explanation:
          'Insufficient financial inputs. Please provide positive campaign budget and average order value (AOV).',
        limitations: ['Zero investment or zero product value prevents meaningful break-even calculation.'],
      };
    }

    let breakEvenRevenue: number;
    let breakEvenCustomers: number;
    let maxAllowableCPA: number;
    let calculationBasis: 'gross_profit' | 'revenue';

    if (marginPct && marginPct > 0) {
      calculationBasis = 'gross_profit';
      // Total Investment = BreakEven Revenue * (Margin % / 100)
      // BreakEven Revenue = Total Investment / (Margin % / 100)
      const marginDecimal = marginPct / 100;
      breakEvenRevenue = Math.round((totalInvestment / marginDecimal) * 100) / 100;
      breakEvenCustomers = Math.ceil(breakEvenRevenue / aov);
      maxAllowableCPA = Math.round(aov * marginDecimal * 100) / 100;
    } else {
      calculationBasis = 'revenue';
      breakEvenRevenue = totalInvestment;
      breakEvenCustomers = Math.ceil(totalInvestment / aov);
      maxAllowableCPA = aov;
    }

    // Required ROAS on media spend alone
    const breakEvenROAS =
      adSpend > 0 ? Math.round((breakEvenRevenue / adSpend) * 100) / 100 : 0;

    // Max Allowable Media CPA (allocating just ad spend across break-even customers)
    const maxAllowableMediaCPA =
      breakEvenCustomers > 0
        ? Math.round((adSpend / breakEvenCustomers) * 100) / 100
        : 0;

    // Required conversion rate on estimated balanced clicks
    const requiredConversionRate =
      balancedScenario.clicks > 0
        ? Math.round((breakEvenCustomers / balancedScenario.clicks) * 10000) / 100
        : 0;

    const explanation =
      calculationBasis === 'gross_profit'
        ? `With a ${marginPct}% gross profit margin, your campaign requires ${inputs.currency} ${breakEvenRevenue.toLocaleString()} in attributed revenue (${breakEvenCustomers} customers at ${inputs.currency} ${aov} AOV) to cover the total investment of ${inputs.currency} ${totalInvestment.toLocaleString()}.`
        : `Without gross margin specified, top-line break-even requires ${inputs.currency} ${breakEvenRevenue.toLocaleString()} in attributed revenue (${breakEvenCustomers} customers at ${inputs.currency} ${aov} AOV) to match the total investment of ${inputs.currency} ${totalInvestment.toLocaleString()}.`;

    const limitations = [
      'Does not account for customer return/refund rates or chargebacks.',
      'Assumes constant average order value without discounting or product mix changes.',
      calculationBasis === 'revenue'
        ? 'Gross margin was not provided; this break-even calculation only covers top-line expenditure, not cost of goods.'
        : `Uses a fixed ${marginPct}% gross margin model. Variable fulfillment or merchant processing fees may shift actual thresholds.`,
    ];

    return {
      isCalculable: true,
      breakEvenRevenue,
      breakEvenCustomers,
      breakEvenROAS,
      maxAllowableCPA,
      maxAllowableMediaCPA,
      requiredConversionRate,
      requiredAov: aov,
      calculationBasis,
      explanation,
      limitations,
    };
  }

  /**
   * Computes sensitivity analysis showing mathematical impact of varying key inputs (+/- 10%, 20%)
   */
  calculateSensitivity(
    inputs: ForecastInput,
    _balancedScenario?: ForecastScenario
  ): SensitivityAnalysis {
    const deltas = [-20, -10, 10, 20];
    const baseBudget = Math.max(1, inputs.adSpend);
    const baseCpm = Math.max(0.1, inputs.cpm);
    const baseCtr = Math.max(0.01, inputs.ctr);
    const baseCvr = Math.max(0.01, inputs.customerCvr);
    const baseAov = Math.max(0.1, inputs.sellingPriceAov);

    // 1. Budget Sensitivity
    const budgetAdjustments = deltas.map((delta) => {
      const adjustedAdSpend = Math.max(1, baseBudget * (1 + delta / 100));
      const adjustedInputs = { ...inputs, adSpend: adjustedAdSpend };
      const scen = this.calculateScenario(adjustedInputs, 'balanced', { cpm: 1, ctr: 1, cvr: 1 });
      return {
        deltaPercent: delta,
        adjustedValue: Math.round(adjustedAdSpend),
        revenue: scen.revenue,
        roas: scen.roas,
        roi: scen.roiRevenue,
        customers: scen.customers,
      };
    });

    // 2. CPM Sensitivity
    const cpmAdjustments = deltas.map((delta) => {
      const adjustedCpm = Math.max(0.1, baseCpm * (1 + delta / 100));
      const adjustedInputs = { ...inputs, cpm: adjustedCpm };
      const scen = this.calculateScenario(adjustedInputs, 'balanced', { cpm: 1, ctr: 1, cvr: 1 });
      return {
        deltaPercent: delta,
        adjustedValue: Math.round(adjustedCpm * 100) / 100,
        revenue: scen.revenue,
        roas: scen.roas,
        roi: scen.roiRevenue,
        customers: scen.customers,
      };
    });

    // 3. CTR Sensitivity
    const ctrAdjustments = deltas.map((delta) => {
      const adjustedCtr = Math.max(0.01, baseCtr * (1 + delta / 100));
      const adjustedInputs = { ...inputs, ctr: adjustedCtr };
      const scen = this.calculateScenario(adjustedInputs, 'balanced', { cpm: 1, ctr: 1, cvr: 1 });
      return {
        deltaPercent: delta,
        adjustedValue: Math.round(adjustedCtr * 100) / 100,
        revenue: scen.revenue,
        roas: scen.roas,
        roi: scen.roiRevenue,
        customers: scen.customers,
      };
    });

    // 4. CVR Sensitivity
    const cvrAdjustments = deltas.map((delta) => {
      const adjustedCvr = Math.max(0.01, baseCvr * (1 + delta / 100));
      const adjustedInputs = { ...inputs, customerCvr: adjustedCvr };
      const scen = this.calculateScenario(adjustedInputs, 'balanced', { cpm: 1, ctr: 1, cvr: 1 });
      return {
        deltaPercent: delta,
        adjustedValue: Math.round(adjustedCvr * 100) / 100,
        revenue: scen.revenue,
        roas: scen.roas,
        roi: scen.roiRevenue,
        customers: scen.customers,
      };
    });

    // 5. AOV Sensitivity
    const aovAdjustments = deltas.map((delta) => {
      const adjustedAov = Math.max(0.1, baseAov * (1 + delta / 100));
      const adjustedInputs = { ...inputs, sellingPriceAov: adjustedAov };
      const scen = this.calculateScenario(adjustedInputs, 'balanced', { cpm: 1, ctr: 1, cvr: 1 });
      return {
        deltaPercent: delta,
        adjustedValue: Math.round(adjustedAov * 100) / 100,
        revenue: scen.revenue,
        roas: scen.roas,
        roi: scen.roiRevenue,
        customers: scen.customers,
      };
    });

    const variables: SensitivityVariable[] = [
      {
        variable: 'cvr',
        name: 'Conversion Rate (CVR)',
        baseValue: baseCvr,
        unit: '%',
        adjustments: cvrAdjustments,
        impactRank: 1,
        sensitivityTier: 'High',
        insight:
          'Direct multiplier on customer volume. A +20% improvement in CVR yields a proportional +20% increase in customer acquisition with zero additional ad spend.',
      },
      {
        variable: 'aov',
        name: 'Average Order Value (AOV)',
        baseValue: baseAov,
        unit: inputs.currency,
        adjustments: aovAdjustments,
        impactRank: 2,
        sensitivityTier: 'High',
        insight:
          'Direct multiplier on top-line revenue and gross profit. Expanding cart value through bundles or upsells directly lifts ROAS without increasing acquisition friction.',
      },
      {
        variable: 'ctr',
        name: 'Click-Through Rate (CTR)',
        baseValue: baseCtr,
        unit: '%',
        adjustments: ctrAdjustments,
        impactRank: 3,
        sensitivityTier: 'Medium',
        insight:
          'Drives traffic volume for a fixed impression pool. Strong creative resonance reduces CPC and feeds more prospective buyers to your site.',
      },
      {
        variable: 'cpm',
        name: 'Cost Per Mille (CPM)',
        baseValue: baseCpm,
        unit: inputs.currency,
        adjustments: cpmAdjustments,
        impactRank: 4,
        sensitivityTier: 'Medium',
        insight:
          'Inverse cost leverage. Lower CPM delivers more impressions per dollar, buffering against auction inflation.',
      },
      {
        variable: 'budget',
        name: 'Advertising Budget',
        baseValue: baseBudget,
        unit: inputs.currency,
        adjustments: budgetAdjustments,
        impactRank: 5,
        sensitivityTier: 'Low',
        insight:
          'Scales absolute customer and revenue volume linearly in this model. Note that in real auctions, aggressive budget scaling often induces audience saturation.',
      },
    ];

    return {
      variables,
      highestImpactFactor: 'Conversion Rate (CVR) & Average Order Value (AOV)',
      recommendation:
        'Prioritize on-site funnel optimization and bundle pricing. Improving conversion rate and basket size generates higher ROI leverage than attempting to lower ad CPMs in competitive auctions.',
    };
  }

  /**
   * Assesses data quality, identifies missing inputs and counts assumptions
   */
  assessDataQuality(inputs: ForecastInput): ForecastDataQuality {
    let assumptionsCount = 0;
    let benchmarkCount = 0;
    let hasActualData = false;
    const missingFields: string[] = [];

    const checkSource = (src: ForecastSource) => {
      if (src === 'actual') hasActualData = true;
      if (src === 'assumption') assumptionsCount++;
      if (src === 'benchmark') benchmarkCount++;
    };

    checkSource(inputs.cpmSource);
    checkSource(inputs.ctrSource);
    checkSource(inputs.customerCvrSource);
    checkSource(inputs.aovSource);
    if (inputs.leadCvrSource) checkSource(inputs.leadCvrSource);

    if (!inputs.totalBudget || inputs.totalBudget <= 0) missingFields.push('Total Campaign Budget');
    if (!inputs.adSpend || inputs.adSpend <= 0) missingFields.push('Advertising Spend');
    if (!inputs.sellingPriceAov || inputs.sellingPriceAov <= 0)
      missingFields.push('Average Order Value (AOV)');
    if (inputs.grossMarginPercent === undefined)
      missingFields.push('Gross Margin % (Required for net profit ROI)');
    if (!inputs.startDate || !inputs.endDate) missingFields.push('Campaign Flight Dates');

    let qualityScore: 'High' | 'Medium' | 'Low' = 'Medium';
    if (hasActualData && missingFields.length === 0) {
      qualityScore = 'High';
    } else if (assumptionsCount >= 3 || missingFields.length >= 2) {
      qualityScore = 'Low';
    }

    const limitations: string[] = [
      'Forecasts represent mathematical scenario modeling, not guaranteed contractual returns.',
      assumptionsCount > 0
        ? `This forecast incorporates ${assumptionsCount} user assumptions. Verifying these with small live tests is strongly advised.`
        : 'Based on verified benchmark baselines.',
      'Does not model seasonal auction clearing rate spikes (e.g. Q4 Black Friday / Cyber Monday bid inflation).',
      'Assumes linear traffic distribution across the selected campaign flight duration.',
    ];

    return {
      hasActualData,
      assumptionsCount,
      benchmarkCount,
      missingFields,
      qualityScore,
      limitations,
    };
  }

  /**
   * Generates or retrieves AI Explanation for the forecast
   */
  async generateAIExplanation(
    forecast: Omit<Forecast, 'aiExplanation'>
  ): Promise<ForecastAIExplanation> {
    try {
      const response = await fetch('/api/generate-forecast-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: forecast.inputs,
          scenarios: forecast.scenarios,
          breakEven: forecast.breakEven,
          sensitivity: forecast.sensitivity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.ok && data.explanation) {
          return {
            ...data.explanation,
            generatedAt: new Date().toISOString(),
            isAiGenerated: true,
          };
        }
      }
    } catch {
      // Gracefully fall back to deterministic expert synthesis if API not reachable
    }

    // High quality deterministic rule-based interpretation
    const b = forecast.scenarios.balanced;
    const c = forecast.scenarios.conservative;
    const o = forecast.scenarios.optimistic;
    const curr = forecast.inputs.currency;

    return {
      summary: `At an allocated budget of ${curr} ${forecast.inputs.totalBudget.toLocaleString()} (${curr} ${forecast.inputs.adSpend.toLocaleString()} ad spend), the Balanced scenario projects ${curr} ${b.revenue.toLocaleString()} in revenue across ${b.customers} customers (${b.roas}x ROAS). Performance ranges from ${curr} ${c.revenue.toLocaleString()} (${c.roas}x ROAS) in defensive conditions to ${curr} ${o.revenue.toLocaleString()} (${o.roas}x ROAS) in high-resonance conditions.`,
      scenarioInterpretations: {
        conservative: `The conservative case produces ${c.customers} customers with a fully loaded CPA of ${curr} ${c.fullyLoadedCPA}. With higher auction CPMs (${curr} ${c.effectiveCPM}) and lower CTR (${c.effectiveCTR}%), the campaign yields ${c.netReturn >= 0 ? 'a modest gain' : 'a deficit'} of ${curr} ${Math.abs(c.netReturn)}.`,
        balanced: `The balanced scenario represents our core expectation: ${b.clicks.toLocaleString()} clicks converting at ${b.effectiveCVR}% into ${b.customers} buyers at a ${curr} ${b.cpa} direct CPA. Net return is projected at ${curr} ${b.netReturn.toLocaleString()}.`,
        optimistic: `The optimistic model demonstrates upper-quartile potential: ${o.customers} buyers and ${o.roas}x ROAS. This requires top-tier creative hooks and zero checkout friction; treat it as an aspirational ceiling rather than baseline capital commitment.`,
      },
      keySensitivities: [
        `Conversion Rate (CVR) and AOV hold the highest mathematical leverage. Lifting CVR from ${b.effectiveCVR}% to ${(b.effectiveCVR * 1.2).toFixed(2)}% adds ${Math.round(b.customers * 0.2)} buyers without paying for extra clicks.`,
        `Ad Frequency and CPM: If competition increases CPM beyond ${curr} ${c.effectiveCPM}, impression volume will fall proportionally.`,
      ],
      financialRisks: [
        forecast.breakEven.isCalculable
          ? `Break-even threshold: The campaign requires at least ${forecast.breakEven.breakEvenCustomers} customers (${curr} ${forecast.breakEven.breakEvenRevenue.toLocaleString()} revenue) to avoid capital loss.`
          : 'Break-even could not be fully calculated due to missing unit economics.',
        forecast.inputs.grossMarginPercent && forecast.inputs.grossMarginPercent < 40
          ? 'Low gross margin (<40%) creates vulnerability to media auction bid spikes.'
          : 'High ad concentration: Allocate at least 15% of budget toward testing fresh creative variants.',
      ],
      metricsToWatch: [
        'Day 3-7 Initial CTR: If CTR falls below 1.2%, pause and refresh ad copy/creative immediately.',
        'Cost Per Click (CPC): Monitor for bid creep during weekend auction peaks.',
        'Add-to-Cart to Purchase Drop-Off: Ensure landing page mobile load speed is under 2.5 seconds.',
      ],
      efficiencyOpportunities: [
        'Implement post-purchase upsells or bundle packages to increase AOV by 15-25%.',
        'Deploy email retargeting on abandoned carts to reclaim high-intent visitors at near-zero ad spend.',
        'A/B test the primary headline and social proof badges above the mobile fold.',
      ],
      suggestedNextSteps: [
        `Begin with a phased 7-day test allocation of 20% (${curr} ${(forecast.inputs.adSpend * 0.2).toFixed(0)}) to validate initial CTR and CVR baselines.`,
        'Verify conversion tracking tags and event deduplication before scaling spend.',
        'Compare actual 7-day CAC with the maximum allowable CPA benchmark.',
      ],
      missingDataAlerts: forecast.dataQuality.missingFields,
      generatedAt: new Date().toISOString(),
      isAiGenerated: false,
    };
  }

  /**
   * Builds a complete, verified Forecast object
   */
  async createForecast(inputs: ForecastInput, title?: string): Promise<Forecast> {
    const id = `forecast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const scenarios = this.generateAllScenarios(inputs);
    const breakEven = this.calculateBreakEven(inputs, scenarios.balanced);
    const sensitivity = this.calculateSensitivity(inputs, scenarios.balanced);
    const dataQuality = this.assessDataQuality(inputs);

    const draftForecast: Omit<Forecast, 'aiExplanation'> = {
      id,
      title: title || `${inputs.projectName || 'Marketing'} Campaign Forecast`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: inputs.projectId,
      projectName: inputs.projectName,
      inputs,
      scenarios,
      breakEven,
      sensitivity,
      dataQuality,
    };

    const aiExplanation = await this.generateAIExplanation(draftForecast);

    const fullForecast: Forecast = {
      ...draftForecast,
      aiExplanation,
    };

    return fullForecast;
  }

  /**
   * Persists a forecast to localStorage
   */
  saveForecast(forecast: Forecast): void {
    try {
      const list = this.getSavedForecasts();
      const existingIdx = list.findIndex((f) => f.id === forecast.id);

      if (existingIdx >= 0) {
        list[existingIdx] = { ...forecast, updatedAt: new Date().toISOString() };
      } else {
        list.unshift(forecast);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Failed to save forecast to localStorage:', err);
    }
  }

  /**
   * Retrieves all saved forecasts
   */
  getSavedForecasts(): Forecast[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /**
   * Retrieves a single forecast by ID
   */
  getForecastById(id: string): Forecast | null {
    const list = this.getSavedForecasts();
    return list.find((f) => f.id === id) || null;
  }

  /**
   * Deletes a forecast
   */
  deleteForecast(id: string): void {
    try {
      const list = this.getSavedForecasts().filter((f) => f.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Failed to delete forecast:', err);
    }
  }

  /**
   * Duplicates an existing forecast for experimentation
   */
  duplicateForecast(id: string): Forecast | null {
    const original = this.getForecastById(id);
    if (!original) return null;

    const cloned: Forecast = {
      ...original,
      id: `forecast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveForecast(cloned);
    return cloned;
  }

  /**
   * Summarizes saved forecasts for quick list view
   */
  getForecastListItems(): ForecastListItem[] {
    return this.getSavedForecasts().map((f) => ({
      id: f.id,
      title: f.title,
      createdAt: f.createdAt,
      projectName: f.projectName,
      totalBudget: f.inputs.totalBudget,
      adSpend: f.inputs.adSpend,
      currency: f.inputs.currency,
      balancedRevenue: f.scenarios.balanced.revenue,
      balancedRoas: f.scenarios.balanced.roas,
      balancedRoi: f.scenarios.balanced.roiRevenue,
      qualityScore: f.dataQuality.qualityScore,
    }));
  }

  /**
   * Exports forecast scenario comparison to CSV with formula injection defense
   */
  exportForecastCsv(forecast: Forecast): string {
    const c = forecast.scenarios.conservative;
    const b = forecast.scenarios.balanced;
    const o = forecast.scenarios.optimistic;
    const curr = forecast.inputs.currency;

    const rows: (string | number)[][] = [
      ['Sparkline Marketing Results Predictor — Scenario Export'],
      ['Forecast Title', forecast.title],
      ['Project', forecast.projectName || 'N/A'],
      ['Created At', forecast.createdAt],
      ['Currency', curr],
      ['Total Investment', `${curr} ${forecast.inputs.totalBudget}`],
      ['Advertising Spend', `${curr} ${forecast.inputs.adSpend}`],
      ['Flight Duration', `${forecast.inputs.durationDays} days`],
      ['AOV / Unit Price', `${curr} ${forecast.inputs.sellingPriceAov}`],
      ['Gross Margin %', `${forecast.inputs.grossMarginPercent || 100}%`],
      [],
      ['Metric', 'Conservative Scenario', 'Balanced Scenario', 'Optimistic Scenario'],
      ['Effective CPM', `${curr} ${c.effectiveCPM}`, `${curr} ${b.effectiveCPM}`, `${curr} ${o.effectiveCPM}`],
      ['Effective CTR', `${c.effectiveCTR}%`, `${b.effectiveCTR}%`, `${o.effectiveCTR}%`],
      ['Effective CVR', `${c.effectiveCVR}%`, `${b.effectiveCVR}%`, `${o.effectiveCVR}%`],
      ['Estimated Impressions', c.impressions, b.impressions, o.impressions],
      ['Estimated Clicks', c.clicks, b.clicks, o.clicks],
      ['Estimated Leads', c.leads, b.leads, o.leads],
      ['Estimated Customers', c.customers, b.customers, o.customers],
      ['Attributed Revenue', `${curr} ${c.revenue}`, `${curr} ${b.revenue}`, `${curr} ${o.revenue}`],
      [
        'Gross Profit',
        c.grossProfit !== undefined ? `${curr} ${c.grossProfit}` : 'N/A',
        b.grossProfit !== undefined ? `${curr} ${b.grossProfit}` : 'N/A',
        o.grossProfit !== undefined ? `${curr} ${o.grossProfit}` : 'N/A',
      ],
      ['Estimated CPC', `${curr} ${c.cpc}`, `${curr} ${b.cpc}`, `${curr} ${o.cpc}`],
      ['Estimated CPA (Ad Spend Only)', `${curr} ${c.cpa}`, `${curr} ${b.cpa}`, `${curr} ${o.cpa}`],
      ['Fully Loaded CPA', `${curr} ${c.fullyLoadedCPA}`, `${curr} ${b.fullyLoadedCPA}`, `${curr} ${o.fullyLoadedCPA}`],
      ['Return on Ad Spend (ROAS)', `${c.roas}x`, `${b.roas}x`, `${o.roas}x`],
      ['Net ROI (Revenue Basis)', `${c.roiRevenue}%`, `${b.roiRevenue}%`, `${o.roiRevenue}%`],
      [
        'Net ROI (Profit Basis)',
        c.roiProfit !== undefined ? `${c.roiProfit}%` : 'N/A',
        b.roiProfit !== undefined ? `${b.roiProfit}%` : 'N/A',
        o.roiProfit !== undefined ? `${o.roiProfit}%` : 'N/A',
      ],
      ['Net Return', `${curr} ${c.netReturn}`, `${curr} ${b.netReturn}`, `${curr} ${o.netReturn}`],
      [],
      ['Break-Even Analysis'],
      ['Calculable', forecast.breakEven.isCalculable ? 'Yes' : 'No'],
      ['Break-Even Revenue', `${curr} ${forecast.breakEven.breakEvenRevenue}`],
      ['Break-Even Customers', forecast.breakEven.breakEvenCustomers],
      ['Required ROAS on Ad Spend', `${forecast.breakEven.breakEvenROAS}x`],
      ['Max Allowable CPA', `${curr} ${forecast.breakEven.maxAllowableCPA}`],
      ['Required Conversion Rate', `${forecast.breakEven.requiredConversionRate}%`],
      [],
      ['Notice: All forecast figures are scenario estimates and do not represent guaranteed financial results.'],
    ];

    return rows.map((r) => r.map((cell) => securityService.formatCsvCell(cell)).join(',')).join('\n');
  }
}

export const forecastService = new ForecastService();
