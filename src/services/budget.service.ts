/**
 * SPARKLINE MARKETING — BUDGET ALLOCATION PLANNER SERVICE
 * Client persistence, mathematical validation, and API management layer for Phase 12.
 */

import { MarketingProject } from '@/types/project';
import {
  MarketingBudgetPlan,
  BudgetAllocation,
  BudgetGroup,
  BudgetGroupSummary,
  BudgetPlanApproach,
  BudgetPlanVariant,
  BudgetWarning,
  BudgetInputSnapshot,
} from '@/types/budget';

const STORAGE_KEY = 'sparkline_marketing_budget_plans';

const BUDGET_GROUPS: BudgetGroup[] = [
  'Advertising Spend',
  'Content and Creative',
  'Marketing Operations',
  'External Services',
  'Testing and Reserve',
];

/**
 * Decimal-safe financial conversion utilities
 */
export const toMinorUnits = (amount: number): number => Math.round(amount * 100);
export const fromMinorUnits = (minor: number): number => minor / 100;

export const recalculateGroupBreakdowns = (
  allocations: BudgetAllocation[],
  _totalBudget?: number
): Record<BudgetGroup, BudgetGroupSummary> => {
  const result: Record<BudgetGroup, BudgetGroupSummary> = {} as any;

  BUDGET_GROUPS.forEach((group) => {
    const items = allocations.filter((a) => a.group === group);
    const amountMinor = items.reduce((sum, a) => sum + toMinorUnits(a.amount), 0);
    const pct = items.reduce((sum, a) => sum + a.percentage, 0);

    result[group] = {
      group,
      amount: fromMinorUnits(amountMinor),
      percentage: Number(pct.toFixed(1)),
      itemCount: items.length,
    };
  });

  return result;
};

export const validateAllocations = (
  allocations: BudgetAllocation[],
  totalBudget: number
): {
  totalPercentage: number;
  totalAmount: number;
  unallocatedAmount: number;
  unallocatedPercentage: number;
  isBalanced100Percent: boolean;
  warnings: BudgetWarning[];
} => {
  const totalPct = Number(
    allocations.reduce((sum, a) => sum + (Number(a.percentage) || 0), 0).toFixed(1)
  );
  const totalAmountMinor = allocations.reduce(
    (sum, a) => sum + toMinorUnits(Number(a.amount) || 0),
    0
  );
  const totalAmount = fromMinorUnits(totalAmountMinor);

  const totalBudgetMinor = toMinorUnits(totalBudget);
  const unallocatedAmountMinor = Math.max(0, totalBudgetMinor - totalAmountMinor);
  const unallocatedAmount = fromMinorUnits(unallocatedAmountMinor);
  const unallocatedPercentage = Math.max(0, Number((100 - totalPct).toFixed(1)));
  const isBalanced100Percent = Math.abs(totalPct - 100) < 0.1;

  const warnings: BudgetWarning[] = [];

  // 1. Concentration risk: single category > 50%
  const concentrated = allocations.find((a) => a.percentage > 50);
  if (concentrated) {
    warnings.push({
      id: 'warn-concentration',
      type: 'concentration',
      severity: 'High',
      title: 'High Channel Concentration Risk',
      message: `${concentrated.category} represents ${concentrated.percentage}% of your total budget.`,
      explanation:
        'Concentrating over 50% of your budget in a single channel makes your acquisition pipeline highly vulnerable to ad auction spikes, algorithm shifts, or account policy issues.',
      howToResolve:
        'Consider redistributing 10%–15% into secondary intent channels or owned retention flows to hedge risk.',
    });
  }

  // 2. Insufficient testing reserve (< 5%)
  const testingGroup = allocations.filter((a) => a.group === 'Testing and Reserve');
  const testingPct = testingGroup.reduce((sum, a) => sum + a.percentage, 0);
  if (testingPct < 5) {
    warnings.push({
      id: 'warn-insufficient-testing',
      type: 'insufficient_testing',
      severity: 'Medium',
      title: 'Insufficient Testing & Experimentation Reserve',
      message: `Only ${testingPct.toFixed(1)}% of budget is reserved for testing and experiments.`,
      explanation:
        'Without dedicated testing funds (5%–15%), campaigns cannot validate new creative hooks, test emerging platforms, or discover lower-CAC customer cohorts.',
      howToResolve:
        'Allocate at least 5%–10% of total budget to a designated testing and creative experimentation reserve.',
    });
  }

  // 3. Channel dilution: allocation under $300/mo or too many channels for low budget
  const underfunded = allocations.filter((a) => a.amount < 300 && a.group === 'Advertising Spend');
  if (underfunded.length > 0) {
    warnings.push({
      id: 'warn-channel-dilution',
      type: 'channel_dilution',
      severity: 'Medium',
      title: 'Budget Dilution Across Too Many Paid Channels',
      message: `${underfunded.length} paid ad channel(s) are allocated less than $300, which may be insufficient to exit the learning phase.`,
      explanation:
        'Major ad algorithms (Meta, Google, TikTok) require sufficient weekly conversion events to optimize delivery. Spreading a modest budget across too many channels starves each platform of data.',
      howToResolve:
        'Consolidate spend into your top 1–2 highest-leverage channels until conversion volume justifies expansion.',
    });
  }

  // 4. Missing creative production costs ($0 in Content and Creative with > 40% in Advertising)
  const adSpendPct = allocations
    .filter((a) => a.group === 'Advertising Spend')
    .reduce((sum, a) => sum + a.percentage, 0);
  const creativePct = allocations
    .filter((a) => a.group === 'Content and Creative')
    .reduce((sum, a) => sum + a.percentage, 0);

  if (adSpendPct > 40 && creativePct < 5) {
    warnings.push({
      id: 'warn-missing-creative',
      type: 'missing_creative',
      severity: 'High',
      title: 'Creative Production Budget Deficit',
      message: `Paid ads account for ${adSpendPct.toFixed(1)}% of spend, but creative production is under 5%.`,
      explanation:
        'Paid media performance is primarily constrained by creative fatigue. Spending heavily on ad distribution without budget for fresh video hooks and design guarantees CPA inflation.',
      howToResolve:
        'Allocate at least 12%–20% of your budget to ongoing graphic design, UGC video editing, and copywriting.',
    });
  }

  // 5. Excessive operating expenses (> 35%)
  const opsPct = allocations
    .filter((a) => a.group === 'Marketing Operations')
    .reduce((sum, a) => sum + a.percentage, 0);
  if (opsPct > 35) {
    warnings.push({
      id: 'warn-excessive-ops',
      type: 'excessive_operations',
      severity: 'Medium',
      title: 'Excessive Tool & Software Overhead',
      message: `Software and marketing operations represent ${opsPct.toFixed(1)}% of your total budget.`,
      explanation:
        'Spending over one-third of your budget on software subscriptions leaves insufficient capital for direct market acquisition and creative assets.',
      howToResolve:
        'Audit your SaaS stack, consolidate overlapping tools, and shift funds toward revenue-producing channels.',
    });
  }

  // 6. Unallocated budget
  if (unallocatedPercentage > 0.5) {
    warnings.push({
      id: 'warn-unallocated',
      type: 'unallocated',
      severity: 'Low',
      title: 'Unallocated Budget Remaining',
      message: `$${unallocatedAmount.toLocaleString()} (${unallocatedPercentage}%) remains unallocated.`,
      explanation:
        'To ensure full planning precision, all funds should be explicitly allocated to channels or reserved in testing.',
      howToResolve:
        'Assign remaining funds to high-leverage channels or allocate to Testing & Experimentation Reserve.',
    });
  }

  return {
    totalPercentage: totalPct,
    totalAmount,
    unallocatedAmount,
    unallocatedPercentage,
    isBalanced100Percent,
    warnings,
  };
};

// Pre-seeded high-fidelity reference blueprint plans
const DEMO_BUDGET_PLANS: MarketingBudgetPlan[] = [
  {
    id: 'budget-vitamin-c-001',
    projectId: 'proj-vitamin-c',
    projectName: 'GlowBiome Organics',
    planTitle: 'Full-Funnel DTC Cosmeceutical Budget Plan (2026-2027)',
    version: 1,
    createdAt: '2026-11-13T10:00:00.000Z',
    updatedAt: '2026-11-13T12:00:00.000Z',
    modelIdentifier: 'Reference Blueprint (Multi-Engine Budget Architecture)',
    currency: 'USD',
    totalBudget: 8000,
    frequency: 'Monthly',
    inputSnapshot: {
      projectId: 'proj-vitamin-c',
      totalBudget: 8000,
      currency: 'USD',
      frequency: 'Monthly',
      campaignDuration: '6 months',
      startDate: '2026-11-01',
      endDate: '2027-04-30',
      businessStage: 'Growing',
      primaryObjective: 'Lower customer acquisition cost & scale subscription retention',
      targetAudience: 'Ingredient-Conscious Skincare Researchers (Ages 26-44)',
      targetMarket: 'United States, Canada, United Kingdom',
      productOrService: 'Organic Vitamin C Glow Serum ($58)',
      averageProductPrice: 58,
      availableResources: 'Growth Marketer, Lifecycle Email Specialist, Freelance Video Editor',
      preferredChannels: ['Meta Ads', 'Google Search', 'Klaviyo Email', 'TikTok Organic'],
      existingChannels: ['Meta Ads', 'Klaviyo Email'],
      organicVsPaidPreference: 'Balanced Mix',
      riskPreference: 'Balanced',
      minTestingBudgetPercentage: 10,
    },
    selectedApproach: 'balanced',
    plans: {
      conservative: {
        approach: 'conservative',
        name: 'Conservative Budget',
        tagline: 'Capital-Preserving Organic & Controlled Validation',
        description:
          'Minimizes paid advertising risk by focusing on high-intent search capture, customer onboarding email flows, and micro-creator product seeding.',
        totalBudget: 8000,
        currency: 'USD',
        allocations: [
          {
            id: 'alloc-c-meta',
            category: 'Meta Ads (Retargeting & Lookalikes)',
            group: 'Advertising Spend',
            amount: 2240,
            percentage: 28.0,
            purpose: 'Convert warm site traffic and lookalike audiences using unretouched stability proof',
            reasonForAllocation: 'High conversion intent with minimal ad waste',
            expectedActivity: 'Run 2 tested video hooks to site visitors and email subscribers',
            primaryKpi: 'Blended CAC < $28.00',
            measurementMethod: 'Shopify new customer tracking + Meta CAPI',
            reviewFrequency: 'Weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Audience size is bounded by site traffic volume',
          },
          {
            id: 'alloc-c-google',
            category: 'Google Search & Shopping (High Intent)',
            group: 'Advertising Spend',
            amount: 1760,
            percentage: 22.0,
            purpose: 'Capture shoppers searching for non-oxidizing Vitamin C serums',
            reasonForAllocation: 'Direct commercial purchase intent',
            expectedActivity: 'Target exact-match keyword clusters and Google Shopping feed',
            primaryKpi: 'Search ROAS > 3.8x',
            measurementMethod: 'Google Ads conversion tracking',
            reviewFrequency: 'Weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Niche search volume is finite',
          },
          {
            id: 'alloc-c-content',
            category: 'Content & UGC Video Production',
            group: 'Content and Creative',
            amount: 1600,
            percentage: 20.0,
            purpose: 'Produce 4 fresh short-form video creative assets monthly',
            reasonForAllocation: 'Prevents creative fatigue on paid channels',
            expectedActivity: 'Commission 2 cosmetic chemist breakdowns and 2 customer reaction videos',
            primaryKpi: 'Creative Hook Retention Rate > 35%',
            measurementMethod: 'Meta Ads Video Analytics',
            reviewFrequency: 'Bi-weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Turnaround time requires 10-14 day production cycles',
          },
          {
            id: 'alloc-c-ops',
            category: 'Klaviyo Email & Shopify Subscriptions',
            group: 'Marketing Operations',
            amount: 640,
            percentage: 8.0,
            purpose: 'Lifecycle email automation and 45-day auto-ship recurring billing',
            reasonForAllocation: 'Automates customer lifetime value expansion',
            expectedActivity: 'Maintain 5-step post-purchase onboarding flow and replenishment triggers',
            primaryKpi: 'Email Revenue Share > 28%',
            measurementMethod: 'Klaviyo Attributed Revenue',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Fixed monthly software cost regardless of volume',
          },
          {
            id: 'alloc-c-seeding',
            category: 'Dermatologist & Aesthetician Seeding',
            group: 'External Services',
            amount: 960,
            percentage: 12.0,
            purpose: 'Ship 40 laboratory mailers with fresh amber glass serum to credentialed experts',
            reasonForAllocation: 'Builds medical authority with zero paid influencer fees',
            expectedActivity: 'Pack and ship laboratory mailers with product whitepapers',
            primaryKpi: '10+ Verified Medical Endorsements',
            measurementMethod: 'Social listening and referral tag tracking',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Uncontracted posting depends entirely on product resonance',
          },
          {
            id: 'alloc-c-test',
            category: 'Testing & Creative Reserve',
            group: 'Testing and Reserve',
            amount: 800,
            percentage: 10.0,
            purpose: 'A/B test new landing page headlines and emergency cash buffer',
            reasonForAllocation: 'Guarantees disciplined experimentation without compromising core budget',
            expectedActivity: 'Run 2 landing page headline split tests and test 1 TikTok ad concept',
            primaryKpi: 'Landing Page CVR Lift > 15%',
            measurementMethod: 'Shopify theme split test analytics',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Unspent testing funds roll over to reserve',
          },
        ],
        groupBreakdowns: {} as any,
        unallocatedAmount: 0,
        unallocatedPercentage: 0,
        isBalanced100Percent: true,
        keyAdvantages: [
          'Minimal financial downside with low blended CAC',
          'Builds durable owned assets (retention email list & clinical credibility)',
          'Zero expensive external agency retainer costs',
        ],
        keyRisks: [
          'Slower top-line revenue velocity',
          'Relies on high internal founder and team execution bandwidth',
        ],
        strategicRecommendations: [
          'Front-load post-purchase email onboarding before launching search ads',
          'Use customer reviews from seeding to populate landing page proof sliders',
        ],
      },
      balanced: {
        approach: 'balanced',
        name: 'Balanced Budget',
        tagline: 'Integrated Multi-Channel Acquisition & Retention',
        description:
          'Blends scalable paid acquisition on Meta and Google with strong creative production, automated retention flows, and dedicated experimentation.',
        totalBudget: 8000,
        currency: 'USD',
        allocations: [
          {
            id: 'alloc-b-meta',
            category: 'Meta Ads (Video Reels & Stories)',
            group: 'Advertising Spend',
            amount: 2560,
            percentage: 32.0,
            purpose: 'Scalable customer acquisition showcasing visual oxidation teardown and doctor reactions',
            reasonForAllocation: 'Largest concentrated addressable market of ingredient researchers',
            expectedActivity: 'Run 4 creative hooks targeting broad female beauty demographics',
            primaryKpi: 'Blended CAC < $32.00',
            measurementMethod: 'Shopify new customer tracking + Meta CAPI',
            reviewFrequency: 'Weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'CPM auction surges during peak Q4 shopping windows',
          },
          {
            id: 'alloc-b-google',
            category: 'Google Search & Shopping (High Intent)',
            group: 'Advertising Spend',
            amount: 1600,
            percentage: 20.0,
            purpose: 'Capture high-intent queries: "best stabilized vitamin c", "skinceuticals alternative"',
            reasonForAllocation: 'Converts in-market buyers at the bottom of the funnel',
            expectedActivity: 'Maintain exact-match keyword bidding and optimized shopping feed',
            primaryKpi: 'Search ROAS > 3.8x',
            measurementMethod: 'Google Ads conversion tracking',
            reviewFrequency: 'Weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Competitor bidding wars on branded keywords',
          },
          {
            id: 'alloc-b-tiktok',
            category: 'TikTok Creator Spark Ads',
            group: 'Advertising Spend',
            amount: 960,
            percentage: 12.0,
            purpose: 'Boost top-performing organic cosmetic chemist review videos to Gen Z & Millennial buyers',
            reasonForAllocation: 'Low cost per video view and authentic creator discovery',
            expectedActivity: 'Spark-boost 2 organic creator videos that achieve >15% watch-through rates',
            primaryKpi: 'Cost Per Video View < $0.02',
            measurementMethod: 'TikTok Ads Manager conversion pixel',
            reviewFrequency: 'Weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Lower initial average order value on mobile traffic',
          },
          {
            id: 'alloc-b-creative',
            category: 'Creative Studio & Video Production',
            group: 'Content and Creative',
            amount: 1120,
            percentage: 14.0,
            purpose: 'Produce 6 high-contrast video ads, 3D bottle animations, and unretouched before/after photos',
            reasonForAllocation: 'Direct driver of lower CAC and higher click-through rates',
            expectedActivity: 'Contract with specialized beauty creative studio for monthly asset pack',
            primaryKpi: 'Thumbstop Rate > 38%',
            measurementMethod: 'Paid social creative diagnostics',
            reviewFrequency: 'Bi-weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Requires clear creative briefs to maintain brand visual standards',
          },
          {
            id: 'alloc-b-ops',
            category: 'Klaviyo, Recharge & Analytics Software',
            group: 'Marketing Operations',
            amount: 640,
            percentage: 8.0,
            purpose: 'Powers email/SMS flows, auto-ship subscriptions, and attribution reporting',
            reasonForAllocation: 'Essential infrastructure for customer retention and lifetime value',
            expectedActivity: 'Automate 45-day replenishment reminders and VIP loyalty tier perks',
            primaryKpi: '60-Day Repeat Purchase Rate > 38%',
            measurementMethod: 'Shopify customer cohort analytics',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Usage-based pricing tiers scale with list size',
          },
          {
            id: 'alloc-b-pr',
            category: 'Dermatologist Seeding & Community PR',
            group: 'External Services',
            amount: 320,
            percentage: 4.0,
            purpose: 'Send fresh batch sample kits to 25 board-certified dermatologists and aesthetic clinics',
            reasonForAllocation: 'Supplies medical endorsements for storefront landing pages',
            expectedActivity: 'Ship curated PR lab mailers with assay certificates',
            primaryKpi: '5+ Medical Video Endorsements',
            measurementMethod: 'PR tracking sheet and quote approvals',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Low financial spend requires personalized manual founder outreach',
          },
          {
            id: 'alloc-b-test',
            category: 'Testing & Experimentation Reserve',
            group: 'Testing and Reserve',
            amount: 800,
            percentage: 10.0,
            purpose: 'A/B test routine match quiz, explore Pinterest ads, and trial new landing page layouts',
            reasonForAllocation: 'Guarantees continuous statistical learning and protects core revenue drivers',
            expectedActivity: 'Deploy 1 new acquisition channel experiment and 2 CRO landing page tests',
            primaryKpi: 'Storefront CVR Lift > 18%',
            measurementMethod: 'Google Analytics 4 conversion funnels',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Experimental concepts may fail without immediate ROAS yield',
          },
        ],
        groupBreakdowns: {} as any,
        unallocatedAmount: 0,
        unallocatedPercentage: 0,
        isBalanced100Percent: true,
        keyAdvantages: [
          'Optimal balance between top-of-funnel velocity and compounding retention',
          'High blended ROAS (>3.2x) with sustainable gross margin buffers',
          'Strong creative production pipeline prevents ad fatigue',
        ],
        keyRisks: [
          'Requires disciplined weekly CPA monitoring across 3 active ad platforms',
          'Ad auction inflation requires strict bid capping',
        ],
        strategicRecommendations: [
          'Audit ad creative fatigue weekly and swap losing hooks after 500 impressions',
          'Ensure 1-click subscription opt-in is prominent on the checkout confirmation page',
        ],
      },
      growth: {
        approach: 'growth',
        name: 'Growth-Focused Budget',
        tagline: 'Aggressive Multi-Channel Scale & Expanded Testing',
        description:
          'Maximizes acquisition velocity across paid social, search, creator spark ads, and affiliate PR with an expanded 15% testing and experimentation buffer.',
        totalBudget: 8000,
        currency: 'USD',
        allocations: [
          {
            id: 'alloc-g-meta',
            category: 'Meta Scale Ads (Advantage+ & Reels)',
            group: 'Advertising Spend',
            amount: 3040,
            percentage: 38.0,
            purpose: 'Rapid customer volume capture across broad national lookalike audiences',
            reasonForAllocation: 'Highest liquidity and immediate scaling capacity',
            expectedActivity: 'Run 8 creative variations simultaneously with Advantage+ budget optimization',
            primaryKpi: 'New Customer Order Volume > 90/mo',
            measurementMethod: 'Shopify new orders + Meta Ads Manager',
            reviewFrequency: 'Daily',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Higher blended CAC during rapid horizontal scaling',
          },
          {
            id: 'alloc-g-google',
            category: 'Google Search & Performance Max',
            group: 'Advertising Spend',
            amount: 1760,
            percentage: 22.0,
            purpose: 'Capture full search impression share for Vitamin C and clean active serums',
            reasonForAllocation: 'Maximizes high-intent search coverage',
            expectedActivity: 'Run Performance Max campaigns paired with branded exact match search',
            primaryKpi: 'Search Impression Share > 75%',
            measurementMethod: 'Google Ads impression share reporting',
            reviewFrequency: 'Weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'PMax algorithmic drift requires strict negative keyword lists',
          },
          {
            id: 'alloc-g-tiktok',
            category: 'TikTok Ads & Creator Sparks',
            group: 'Advertising Spend',
            amount: 1200,
            percentage: 15.0,
            purpose: 'Drive high-volume viral video reach and trend awareness',
            reasonForAllocation: 'Expands brand discoverability beyond Meta platforms',
            expectedActivity: 'Whitelisted creator Spark ads targeting skincare interest clusters',
            primaryKpi: 'Click-Through Rate > 2.0%',
            measurementMethod: 'TikTok Ads Manager',
            reviewFrequency: 'Weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Creative asset fatigue occurs faster on TikTok (7–10 days)',
          },
          {
            id: 'alloc-g-creative',
            category: 'Rapid Creative Asset Studio',
            group: 'Content and Creative',
            amount: 800,
            percentage: 10.0,
            purpose: 'Continuous weekly asset variations and hook testing',
            reasonForAllocation: 'Fuel for high-velocity ad spend scaling',
            expectedActivity: 'Produce 8 new video iterations per month from existing footage',
            primaryKpi: 'Asset Iteration Velocity (2/week)',
            measurementMethod: 'Creative delivery tracker',
            reviewFrequency: 'Weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Lower per-unit creative budget requires template-driven workflow',
          },
          {
            id: 'alloc-g-ops',
            category: 'Lifecycle Automation & Retention SaaS',
            group: 'Marketing Operations',
            amount: 400,
            percentage: 5.0,
            purpose: 'Essential email and subscription platforms',
            reasonForAllocation: 'Lean operations to maximize working media budget',
            expectedActivity: 'Streamlined Klaviyo and Shopify Subscriptions operations',
            primaryKpi: 'Email Open Rate > 42%',
            measurementMethod: 'Klaviyo reporting',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Minimal tooling buffer',
          },
          {
            id: 'alloc-g-test',
            category: 'High-Velocity Testing Reserve',
            group: 'Testing and Reserve',
            amount: 800,
            percentage: 10.0,
            purpose: 'Rapid micro-experiments: Pinterest Ads, YouTube Shorts, and landing page variants',
            reasonForAllocation: 'Identifies breakthrough asymmetric acquisition channels',
            expectedActivity: 'Run 2 multi-variant tests monthly with dedicated statistical budgets',
            primaryKpi: 'Discovered Channel CAC < $30',
            measurementMethod: 'Blended cohort analytics',
            reviewFrequency: 'Bi-weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'High variance in return on experimental dollars',
          },
        ],
        groupBreakdowns: {} as any,
        unallocatedAmount: 0,
        unallocatedPercentage: 0,
        isBalanced100Percent: true,
        keyAdvantages: [
          'Maximizes customer acquisition velocity and brand visibility',
          'Fast statistical learning cycles to identify winning creative hooks',
          'Broad multi-platform diversification (Meta, Google, TikTok)',
        ],
        keyRisks: [
          'Higher cash burn and elevated blended CAC during aggressive scale',
          'Requires tight inventory forecasting to prevent stockouts',
        ],
        strategicRecommendations: [
          'Establish a strict blended CPA stop-loss: pause ad groups exceeding $40 CAC',
          'Ensure fulfillment team has 60 days of forward inventory on hand',
        ],
      },
    },
    activePlan: {} as any, // populated on init
    warnings: [],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Maintain 14%+ Creative Budget to Counter Ad Fatigue',
        description:
          'In cosmeceuticals, video ad performance degrades after 3 weeks on Meta. Allocating at least $1,120/mo to ongoing video iterations protects your $4,160 paid media investment.',
        suggestedAction: 'Keep creative studio budget funded before expanding media spend.',
        impact: 'High',
      },
      {
        id: 'rec-2',
        title: 'Protect 10% Testing Reserve for Routine Quiz Experiments',
        description:
          'Interactive routine finder quizzes can lower email acquisition cost by 40%. Dedicating $800 to testing allows continuous optimization without touching core search ad campaigns.',
        suggestedAction: 'Deploy the 6-question skin barrier quiz using testing allocation.',
        impact: 'Medium',
      },
    ],
    timelineMonthlySpend: [
      {
        month: 'Month 1',
        amount: 8000,
        advertising: 5120,
        creative: 1120,
        operations: 640,
        services: 320,
        testing: 800,
      },
      {
        month: 'Month 2',
        amount: 8000,
        advertising: 5120,
        creative: 1120,
        operations: 640,
        services: 320,
        testing: 800,
      },
      {
        month: 'Month 3',
        amount: 8000,
        advertising: 5200,
        creative: 1040,
        operations: 640,
        services: 320,
        testing: 800,
      },
      {
        month: 'Month 4',
        amount: 8000,
        advertising: 5280,
        creative: 960,
        operations: 640,
        services: 320,
        testing: 800,
      },
      {
        month: 'Month 5',
        amount: 8000,
        advertising: 5360,
        creative: 880,
        operations: 640,
        services: 320,
        testing: 800,
      },
      {
        month: 'Month 6',
        amount: 8000,
        advertising: 5440,
        creative: 800,
        operations: 640,
        services: 320,
        testing: 800,
      },
    ],
  },
  {
    id: 'budget-apex-cloud-001',
    projectId: 'proj-apex-cloud',
    projectName: 'ApexSec Cloud Intelligence',
    planTitle: 'Enterprise Multi-Cloud GTM Budget Plan (2026)',
    version: 1,
    createdAt: '2026-11-13T11:00:00.000Z',
    updatedAt: '2026-11-13T11:00:00.000Z',
    modelIdentifier: 'Reference Blueprint (Multi-Engine Budget Architecture)',
    currency: 'USD',
    totalBudget: 25000,
    frequency: 'Monthly',
    inputSnapshot: {
      projectId: 'proj-apex-cloud',
      totalBudget: 25000,
      currency: 'USD',
      frequency: 'Monthly',
      campaignDuration: '6 months',
      startDate: '2026-11-01',
      endDate: '2027-04-30',
      businessStage: 'Growing',
      primaryObjective: 'Generate 40+ sales-accepted enterprise opportunities per quarter',
      targetAudience: 'CISOs & DevSecOps Leaders at Cloud-Native Companies (500-5,000 employees)',
      targetMarket: 'North America & Western Europe',
      productOrService: 'Agentless Multi-Cloud Security Graph ($45,000 ACV)',
      averageProductPrice: 45000,
      availableResources: 'Demand Gen Lead, SDR Team, Principal Security Researcher',
      preferredChannels: ['LinkedIn ABM', 'Google Search PPC', 'Technical Whitepapers', 'CISO Dinners'],
      existingChannels: ['LinkedIn ABM', 'Google Search PPC'],
      organicVsPaidPreference: 'Balanced Mix',
      riskPreference: 'Balanced',
      minTestingBudgetPercentage: 10,
    },
    selectedApproach: 'balanced',
    plans: {
      conservative: {
        approach: 'conservative',
        name: 'Conservative Budget',
        tagline: 'Research-Led Inbound & Highly-Targeted ABM',
        description: 'Focuses budget on high-value threat benchmark whitepapers and precision ABM targeting top 150 accounts.',
        totalBudget: 25000,
        currency: 'USD',
        allocations: [
          {
            id: 'alloc-c-li',
            category: 'LinkedIn Account-Based Marketing (ABM)',
            group: 'Advertising Spend',
            amount: 7500,
            percentage: 30.0,
            purpose: 'Reaching mapped CISOs at top 150 target enterprises',
            reasonForAllocation: 'Zero-waste precision job title targeting',
            expectedActivity: 'Sponsored content featuring attack path benchmark findings',
            primaryKpi: 'Cost Per MQL < $180',
            measurementMethod: 'LinkedIn Campaign Manager + CRM',
            reviewFrequency: 'Weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'High platform CPMs require strong gated content',
          },
          {
            id: 'alloc-c-google',
            category: 'Google Intent Search PPC',
            group: 'Advertising Spend',
            amount: 5000,
            percentage: 20.0,
            purpose: 'Target high-intent keywords: "agentless cloud security", "CSPM alternatives"',
            reasonForAllocation: 'In-market evaluation intent',
            expectedActivity: 'Exact match search campaigns',
            primaryKpi: 'Search Demo CVR > 4.2%',
            measurementMethod: 'Google Ads conversion tracking',
            reviewFrequency: 'Weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'High CPCs ($35-$65 per click in cybersecurity)',
          },
          {
            id: 'alloc-c-whitepaper',
            category: 'Technical Threat Research & Whitepapers',
            group: 'Content and Creative',
            amount: 4500,
            percentage: 18.0,
            purpose: 'Contract specialized cybersecurity technical writer and designer for 24-page report',
            reasonForAllocation: 'Engineers demand deep technical rigor over marketing fluff',
            expectedActivity: 'Author and design "2026 Cloud Attack Path Benchmark Report"',
            primaryKpi: '350+ Whitepaper Downloads',
            measurementMethod: 'HubSpot gated form analytics',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Requires security researcher time for data anonymization',
          },
          {
            id: 'alloc-c-tooling',
            category: 'HubSpot, ZoomInfo & Sandbox Hosting',
            group: 'Marketing Operations',
            amount: 3500,
            percentage: 14.0,
            purpose: 'CRM automation, B2B account enrichment data, and cloud risk scanner sandbox hosting',
            reasonForAllocation: 'Operational backbone for lead routing and enrichment',
            expectedActivity: 'Maintain SDR sequencing and cloud demo infrastructure',
            primaryKpi: 'Lead Routing SLA < 15 mins',
            measurementMethod: 'HubSpot workflow reports',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Fixed software seat licenses',
          },
          {
            id: 'alloc-c-events',
            category: 'CISO Private Roundtable Dinners',
            group: 'External Services',
            amount: 2000,
            percentage: 8.0,
            purpose: 'Host 1 intimate 12-person dinner during Black Hat conference',
            reasonForAllocation: 'Builds executive relationships inaccessible via cold email',
            expectedActivity: 'Private dining room rental and curated guest outreach',
            primaryKpi: '5+ Follow-up Pipeline Opportunities',
            measurementMethod: 'CRM opportunity tracking',
            reviewFrequency: 'Quarterly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Requires 6 weeks advance guest recruitment',
          },
          {
            id: 'alloc-c-test',
            category: 'Testing & Outbound SDR Experimentation',
            group: 'Testing and Reserve',
            amount: 2500,
            percentage: 10.0,
            purpose: 'Test personalized video prospecting tools and trial GitHub sponsor program',
            reasonForAllocation: 'Discovers new product-led B2B acquisition hooks',
            expectedActivity: 'Run 2 SDR sequence experiments and test 1 community sponsorship',
            primaryKpi: 'SDR Reply Rate > 8%',
            measurementMethod: 'Outreach / Salesloft tracking',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Experimental B2B tests require 30-day response cycles',
          },
        ],
        groupBreakdowns: {} as any,
        unallocatedAmount: 0,
        unallocatedPercentage: 0,
        isBalanced100Percent: true,
        keyAdvantages: [
          'High brand authority among technical security evaluators',
          'Zero-waste targeting focused strictly on high-propensity accounts',
        ],
        keyRisks: [
          'Longer sales cycles (60–90 days) require disciplined pipeline tracking',
        ],
        strategicRecommendations: [
          'Ensure SDRs follow up with whitepaper downloaders within 2 hours',
        ],
      },
      balanced: {
        approach: 'balanced',
        name: 'Balanced Budget',
        tagline: 'Orchestrated ABM & Demand Capture',
        description: 'Orchestrates paid LinkedIn ABM, high-intent Google Search, technical research, and executive field events.',
        totalBudget: 25000,
        currency: 'USD',
        allocations: [
          {
            id: 'alloc-b-li',
            category: 'LinkedIn Account-Based Marketing (ABM)',
            group: 'Advertising Spend',
            amount: 8750,
            percentage: 35.0,
            purpose: 'Targeted account list campaigns reaching CISOs, VP Security, and Cloud Architects',
            reasonForAllocation: 'Direct access to verified enterprise buyers',
            expectedActivity: 'Carousel ads, Thought Leadership Ads, and Lead Gen forms',
            primaryKpi: 'Cost Per MQL < $165',
            measurementMethod: 'LinkedIn Campaign Manager + Salesforce',
            reviewFrequency: 'Weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Requires fresh case study creative every 3 weeks',
          },
          {
            id: 'alloc-b-google',
            category: 'Google Intent Search PPC',
            group: 'Advertising Spend',
            amount: 5000,
            percentage: 20.0,
            purpose: 'Capture active problem-aware searches for cloud security posture management',
            reasonForAllocation: 'High-intent demo request velocity',
            expectedActivity: 'Target exact and phrase match commercial terms',
            primaryKpi: 'Search Cost Per Demo < $320',
            measurementMethod: 'Google Ads conversion tracking',
            reviewFrequency: 'Weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'High competitive bidding from legacy vendors',
          },
          {
            id: 'alloc-b-whitepaper',
            category: 'Technical Whitepapers & Research Studio',
            group: 'Content and Creative',
            amount: 3750,
            percentage: 15.0,
            purpose: 'Continuous publication of monthly threat research and interactive graph visualizations',
            reasonForAllocation: 'Critical proof assets required for multi-stakeholder consensus',
            expectedActivity: 'Publish monthly threat breakdown and interactive attack simulator',
            primaryKpi: 'Content-Assisted Pipeline > $500k/quarter',
            measurementMethod: 'Multi-touch CRM attribution',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'High internal engineering time requirement',
          },
          {
            id: 'alloc-b-tooling',
            category: 'Enterprise Marketing Operations & Data',
            group: 'Marketing Operations',
            amount: 2000,
            percentage: 8.0,
            purpose: 'Account enrichment data, IP de-anonymization, and demo sandbox infrastructure',
            reasonForAllocation: 'Identifies accounts visiting website before form submission',
            expectedActivity: 'Automate high-intent account alerts directly to SDR Slack channels',
            primaryKpi: 'De-anonymized Account Match Rate > 65%',
            measurementMethod: 'Clearbit / 6sense analytics',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Requires SDR compliance with real-time alert follow-ups',
          },
          {
            id: 'alloc-b-events',
            category: 'Executive CISO Dinners & Field Events',
            group: 'External Services',
            amount: 3000,
            percentage: 12.0,
            purpose: 'Intimate peer roundtables fostering trusted founder-to-CISO relationships',
            reasonForAllocation: 'Generates high-contract-value enterprise pipeline ($50k+ ACV)',
            expectedActivity: 'Host 1 curated 15-person private dinner per quarter in major metro tech hub',
            primaryKpi: '8+ Enterprise Demos Generated per event',
            measurementMethod: 'CRM event attribution',
            reviewFrequency: 'Quarterly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Travel logistics and venue cancellation policies',
          },
          {
            id: 'alloc-b-test',
            category: 'Testing & Innovation Reserve',
            group: 'Testing and Reserve',
            amount: 2500,
            percentage: 10.0,
            purpose: 'Open-source GitHub tooling, technical podcast host reads, and newsletter sponsorships',
            reasonForAllocation: 'Tests asymmetric awareness channels beyond traditional LinkedIn ads',
            expectedActivity: 'Sponsor 2 popular security engineering newsletters and test 1 podcast read',
            primaryKpi: 'Direct Brand Search Volume Growth > 25%',
            measurementMethod: 'Google Search Console branded impressions',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Harder to measure with direct last-click attribution',
          },
        ],
        groupBreakdowns: {} as any,
        unallocatedAmount: 0,
        unallocatedPercentage: 0,
        isBalanced100Percent: true,
        keyAdvantages: [
          'Strongest pipeline velocity balancing inbound intent and outbound account targeting',
          'High Average Contract Value ($45k–$75k) justifies targeted media spend',
        ],
        keyRisks: [
          'Enterprise deal slippage across quarterly procurement boundaries',
        ],
        strategicRecommendations: [
          'Enable AWS Marketplace co-sell to allow enterprise buyers to use committed cloud credits',
        ],
      },
      growth: {
        approach: 'growth',
        name: 'Growth-Focused Budget',
        tagline: 'Enterprise Blitzscale & Flagship Conference Co-Sell',
        description: 'Accelerates pipeline through major conference presence, aggressive LinkedIn ABM, and partner co-selling.',
        totalBudget: 25000,
        currency: 'USD',
        allocations: [
          {
            id: 'alloc-g-li',
            category: 'LinkedIn Scale ABM',
            group: 'Advertising Spend',
            amount: 10000,
            percentage: 40.0,
            purpose: 'Broad multi-tier ABM across 500 enterprise accounts in US and EMEA',
            reasonForAllocation: 'Maximum reach across entire security buying committees',
            expectedActivity: 'Multi-variant ad campaigns targeting CISOs, DevOps, and Compliance',
            primaryKpi: 'Target Account Engagement > 55%',
            measurementMethod: 'LinkedIn ABM Reporting',
            reviewFrequency: 'Weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Requires massive creative asset library to prevent audience burnout',
          },
          {
            id: 'alloc-g-google',
            category: 'Google Intent Search PPC',
            group: 'Advertising Spend',
            amount: 5000,
            percentage: 20.0,
            purpose: 'Dominate competitive conquesting and high-intent commercial keywords',
            reasonForAllocation: 'Captures active competitor evaluation traffic',
            expectedActivity: 'Aggressive bidding on competitor alternative queries',
            primaryKpi: 'Search ROAS / Pipeline Yield > 4.0x',
            measurementMethod: 'Google Ads + CRM',
            reviewFrequency: 'Weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Competitor legal retaliation or bidding wars',
          },
          {
            id: 'alloc-g-whitepaper',
            category: 'Content & Rapid Threat Research',
            group: 'Content and Creative',
            amount: 3000,
            percentage: 12.0,
            purpose: 'Bi-weekly vulnerability teardowns and video demo assets',
            reasonForAllocation: 'Fuel for technical ad campaigns',
            expectedActivity: 'Publish 2 technical CVE threat research papers per month',
            primaryKpi: 'Organic Backlinks & Downloads',
            measurementMethod: 'Ahrefs + HubSpot',
            reviewFrequency: 'Bi-weekly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'High research pressure on technical team',
          },
          {
            id: 'alloc-g-tooling',
            category: 'Marketing Operations & Infrastructure',
            group: 'Marketing Operations',
            amount: 2000,
            percentage: 8.0,
            purpose: 'Data enrichment, intent signals, and CRM routing',
            reasonForAllocation: 'Data infrastructure to handle high lead volume',
            expectedActivity: 'Automate intent scoring across website visitors',
            primaryKpi: 'SDR Qualified Lead Acceptance > 85%',
            measurementMethod: 'CRM pipeline reports',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Annual contract commitments',
          },
          {
            id: 'alloc-g-events',
            category: 'Conference Sponsorships & Executive Roundtables',
            group: 'External Services',
            amount: 2500,
            percentage: 10.0,
            purpose: 'Booth presence at regional security conferences and executive networking',
            reasonForAllocation: 'High concentration of in-person enterprise decision-makers',
            expectedActivity: 'Sponsor regional cybersecurity summits and private dinners',
            primaryKpi: '20+ Qualified Enterprise Leads per summit',
            measurementMethod: 'Lead scanner + CRM sync',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'High fixed event sponsorship costs',
          },
          {
            id: 'alloc-g-test',
            category: 'Testing & Channel Innovation Reserve',
            group: 'Testing and Reserve',
            amount: 2500,
            percentage: 10.0,
            purpose: 'Trial interactive sandbox advertising and test developer community sponsorships',
            reasonForAllocation: 'Discovers new inbound levers before competitors enter',
            expectedActivity: 'Deploy 2 creative experimentation pilots monthly',
            primaryKpi: 'Testing Pipeline Contribution > $150k',
            measurementMethod: 'CRM source attribution',
            reviewFrequency: 'Monthly',
            performanceStatus: 'Planned',
            riskOrLimitation: 'Higher variance in CAC during experimental phase',
          },
        ],
        groupBreakdowns: {} as any,
        unallocatedAmount: 0,
        unallocatedPercentage: 0,
        isBalanced100Percent: true,
        keyAdvantages: [
          'Maximizes pipeline velocity to hit ambitious enterprise ARR targets',
          'Broad brand dominance across key cybersecurity conferences and platforms',
        ],
        keyRisks: [
          'High cash burn requires reliable sales conversion from SDR to closed-won',
        ],
        strategicRecommendations: [
          'Implement daily SDR follow-up SLAs to ensure high media spend is not wasted',
        ],
      },
    },
    activePlan: {} as any,
    warnings: [],
    recommendations: [
      {
        id: 'rec-apex-1',
        title: 'Combine LinkedIn ABM with AWS Marketplace Procurement',
        description:
          'Enterprise prospects frequently face 90-day procurement delays. Promoting your 1-click AWS Marketplace listing reduces deal cycle length by over 35 days.',
        suggestedAction: 'Include AWS Marketplace badge on all ABM landing pages.',
        impact: 'High',
      },
    ],
    timelineMonthlySpend: [
      {
        month: 'Month 1',
        amount: 25000,
        advertising: 13750,
        creative: 3750,
        operations: 2000,
        services: 3000,
        testing: 2500,
      },
      {
        month: 'Month 2',
        amount: 25000,
        advertising: 13750,
        creative: 3750,
        operations: 2000,
        services: 3000,
        testing: 2500,
      },
      {
        month: 'Month 3',
        amount: 25000,
        advertising: 14000,
        creative: 3500,
        operations: 2000,
        services: 3000,
        testing: 2500,
      },
    ],
  },
];

// Initialize pre-seeded plans with balanced variant & breakdowns
DEMO_BUDGET_PLANS.forEach((p) => {
  ['conservative', 'balanced', 'growth'].forEach((k) => {
    const v = p.plans[k as BudgetPlanApproach];
    v.groupBreakdowns = recalculateGroupBreakdowns(v.allocations, v.totalBudget);
    const valid = validateAllocations(v.allocations, v.totalBudget);
    v.unallocatedAmount = valid.unallocatedAmount;
    v.unallocatedPercentage = valid.unallocatedPercentage;
    v.isBalanced100Percent = valid.isBalanced100Percent;
  });
  p.activePlan = JSON.parse(JSON.stringify(p.plans[p.selectedApproach]));
  p.warnings = validateAllocations(p.activePlan.allocations, p.totalBudget).warnings;
});

export class BudgetService {
  /**
   * Retrieves all saved budget plans, optionally filtered by projectId.
   */
  public getPlans(projectId?: string): MarketingBudgetPlan[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let list: MarketingBudgetPlan[] = raw ? JSON.parse(raw) : DEMO_BUDGET_PLANS;

      if (!list || list.length === 0) {
        list = DEMO_BUDGET_PLANS;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }

      if (projectId) {
        return list.filter((p) => p.projectId === projectId);
      }
      return list;
    } catch {
      if (projectId) {
        return DEMO_BUDGET_PLANS.filter((p) => p.projectId === projectId);
      }
      return DEMO_BUDGET_PLANS;
    }
  }

  /**
   * Retrieves a single budget plan by ID.
   */
  public getPlanById(id: string): MarketingBudgetPlan | undefined {
    return this.getPlans().find((p) => p.id === id);
  }

  /**
   * Retrieves the latest plan for a given project.
   */
  public getLatestPlan(projectId: string): MarketingBudgetPlan | undefined {
    const list = this.getPlans(projectId);
    if (!list || list.length === 0) return undefined;
    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }

  /**
   * Saves or updates a budget plan.
   */
  public savePlan(plan: MarketingBudgetPlan): void {
    try {
      const current = this.getPlans();
      const existingIdx = current.findIndex((p) => p.id === plan.id);
      let updated: MarketingBudgetPlan[];

      plan.updatedAt = new Date().toISOString();

      // Recalculate validations and breakdowns before saving
      plan.activePlan.groupBreakdowns = recalculateGroupBreakdowns(
        plan.activePlan.allocations,
        plan.totalBudget
      );
      const val = validateAllocations(plan.activePlan.allocations, plan.totalBudget);
      plan.activePlan.unallocatedAmount = val.unallocatedAmount;
      plan.activePlan.unallocatedPercentage = val.unallocatedPercentage;
      plan.activePlan.isBalanced100Percent = val.isBalanced100Percent;
      plan.warnings = val.warnings;

      if (existingIdx >= 0) {
        updated = [...current];
        updated[existingIdx] = plan;
      } else {
        updated = [plan, ...current];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Unable to persist budget plan to localStorage:', err);
    }
  }

  /**
   * Duplicates an existing budget plan as a new version.
   */
  public duplicatePlan(planId: string): MarketingBudgetPlan | undefined {
    const source = this.getPlanById(planId);
    if (!source) return undefined;

    const existingForProject = this.getPlans(source.projectId);
    const now = new Date().toISOString();

    const clone: MarketingBudgetPlan = JSON.parse(JSON.stringify(source));
    clone.id = `budget-${Date.now()}`;
    clone.planTitle = `${source.planTitle} (Copy)`;
    clone.version = existingForProject.length + 1;
    clone.createdAt = now;
    clone.updatedAt = now;

    this.savePlan(clone);
    return clone;
  }

  /**
   * Deletes a budget plan by ID.
   */
  public deletePlan(planId: string): void {
    try {
      const current = this.getPlans();
      const filtered = current.filter((p) => p.id !== planId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.warn('Unable to delete budget plan from localStorage:', err);
    }
  }

  /**
   * Mutates an allocation's percentage in the active plan and updates amounts accurately.
   */
  public updateAllocationPercentage(
    plan: MarketingBudgetPlan,
    allocationId: string,
    newPercentage: number
  ): MarketingBudgetPlan {
    const clampedPct = Math.max(0, Math.min(100, Number(newPercentage) || 0));
    const alloc = plan.activePlan.allocations.find((a) => a.id === allocationId);
    if (!alloc) return plan;

    alloc.percentage = Number(clampedPct.toFixed(1));
    const calculatedAmountMinor = Math.round(
      (toMinorUnits(plan.totalBudget) * clampedPct) / 100
    );
    alloc.amount = fromMinorUnits(calculatedAmountMinor);

    const val = validateAllocations(plan.activePlan.allocations, plan.totalBudget);
    plan.activePlan.unallocatedAmount = val.unallocatedAmount;
    plan.activePlan.unallocatedPercentage = val.unallocatedPercentage;
    plan.activePlan.isBalanced100Percent = val.isBalanced100Percent;
    plan.activePlan.groupBreakdowns = recalculateGroupBreakdowns(
      plan.activePlan.allocations,
      plan.totalBudget
    );
    plan.warnings = val.warnings;

    return { ...plan };
  }

  /**
   * Mutates an allocation's direct amount in the active plan and updates percentages accurately.
   */
  public updateAllocationAmount(
    plan: MarketingBudgetPlan,
    allocationId: string,
    newAmount: number
  ): MarketingBudgetPlan {
    const clampedAmount = Math.max(0, Math.min(plan.totalBudget, Number(newAmount) || 0));
    const alloc = plan.activePlan.allocations.find((a) => a.id === allocationId);
    if (!alloc) return plan;

    alloc.amount = Number(clampedAmount.toFixed(2));
    const calculatedPct =
      plan.totalBudget > 0 ? (clampedAmount / plan.totalBudget) * 100 : 0;
    alloc.percentage = Number(calculatedPct.toFixed(1));

    const val = validateAllocations(plan.activePlan.allocations, plan.totalBudget);
    plan.activePlan.unallocatedAmount = val.unallocatedAmount;
    plan.activePlan.unallocatedPercentage = val.unallocatedPercentage;
    plan.activePlan.isBalanced100Percent = val.isBalanced100Percent;
    plan.activePlan.groupBreakdowns = recalculateGroupBreakdowns(
      plan.activePlan.allocations,
      plan.totalBudget
    );
    plan.warnings = val.warnings;

    return { ...plan };
  }

  /**
   * Adds a custom budget category to the active plan.
   */
  public addCustomCategory(
    plan: MarketingBudgetPlan,
    data: {
      category: string;
      group: BudgetGroup;
      amount?: number;
      percentage?: number;
      purpose?: string;
      primaryKpi?: string;
    }
  ): MarketingBudgetPlan {
    const totalBudget = plan.totalBudget;
    let pct = data.percentage ?? 5.0;
    let amt = data.amount ?? fromMinorUnits(Math.round((toMinorUnits(totalBudget) * pct) / 100));

    if (data.amount !== undefined && data.percentage === undefined && totalBudget > 0) {
      amt = data.amount;
      pct = Number(((amt / totalBudget) * 100).toFixed(1));
    }

    const newAlloc: BudgetAllocation = {
      id: `alloc-custom-${Date.now()}`,
      category: data.category.trim() || 'Custom Channel',
      group: data.group || 'Advertising Spend',
      amount: amt,
      percentage: pct,
      purpose: data.purpose || 'Custom marketing initiative',
      reasonForAllocation: 'User-specified strategic investment',
      expectedActivity: 'Managed custom activity',
      primaryKpi: data.primaryKpi || 'Blended CAC',
      measurementMethod: 'Custom Analytics',
      reviewFrequency: 'Weekly',
      performanceStatus: 'Planned',
      riskOrLimitation: 'Requires manual verification',
      isCustom: true,
    };

    plan.activePlan.allocations.push(newAlloc);

    const val = validateAllocations(plan.activePlan.allocations, plan.totalBudget);
    plan.activePlan.unallocatedAmount = val.unallocatedAmount;
    plan.activePlan.unallocatedPercentage = val.unallocatedPercentage;
    plan.activePlan.isBalanced100Percent = val.isBalanced100Percent;
    plan.activePlan.groupBreakdowns = recalculateGroupBreakdowns(
      plan.activePlan.allocations,
      plan.totalBudget
    );
    plan.warnings = val.warnings;

    return { ...plan };
  }

  /**
   * Removes a category from the active plan.
   */
  public removeCategory(
    plan: MarketingBudgetPlan,
    allocationId: string
  ): MarketingBudgetPlan {
    plan.activePlan.allocations = plan.activePlan.allocations.filter(
      (a) => a.id !== allocationId
    );

    const val = validateAllocations(plan.activePlan.allocations, plan.totalBudget);
    plan.activePlan.unallocatedAmount = val.unallocatedAmount;
    plan.activePlan.unallocatedPercentage = val.unallocatedPercentage;
    plan.activePlan.isBalanced100Percent = val.isBalanced100Percent;
    plan.activePlan.groupBreakdowns = recalculateGroupBreakdowns(
      plan.activePlan.allocations,
      plan.totalBudget
    );
    plan.warnings = val.warnings;

    return { ...plan };
  }

  /**
   * Updates total budget for the plan, proportionally recalculating amounts.
   */
  public updateTotalBudget(
    plan: MarketingBudgetPlan,
    newTotal: number
  ): MarketingBudgetPlan {
    const total = Math.max(100, Number(newTotal) || 0);
    plan.totalBudget = total;
    plan.activePlan.totalBudget = total;

    // Recalculate amounts based on existing percentages
    plan.activePlan.allocations.forEach((a) => {
      a.amount = fromMinorUnits(
        Math.round((toMinorUnits(total) * a.percentage) / 100)
      );
    });

    const val = validateAllocations(plan.activePlan.allocations, total);
    plan.activePlan.unallocatedAmount = val.unallocatedAmount;
    plan.activePlan.unallocatedPercentage = val.unallocatedPercentage;
    plan.activePlan.isBalanced100Percent = val.isBalanced100Percent;
    plan.activePlan.groupBreakdowns = recalculateGroupBreakdowns(
      plan.activePlan.allocations,
      total
    );
    plan.warnings = val.warnings;

    return { ...plan };
  }

  /**
   * Restores the active plan to the recommended approach variant.
   */
  public restoreRecommendedPlan(
    plan: MarketingBudgetPlan,
    approach: BudgetPlanApproach
  ): MarketingBudgetPlan {
    const variant = plan.plans[approach];
    if (!variant) return plan;

    plan.selectedApproach = approach;
    plan.activePlan = JSON.parse(JSON.stringify(variant));

    const val = validateAllocations(plan.activePlan.allocations, plan.totalBudget);
    plan.activePlan.unallocatedAmount = val.unallocatedAmount;
    plan.activePlan.unallocatedPercentage = val.unallocatedPercentage;
    plan.activePlan.isBalanced100Percent = val.isBalanced100Percent;
    plan.activePlan.groupBreakdowns = recalculateGroupBreakdowns(
      plan.activePlan.allocations,
      plan.totalBudget
    );
    plan.warnings = val.warnings;

    return { ...plan };
  }

  /**
   * Invokes server-side AI proxy to generate a tailored budget plan.
   * Gracefully falls back to deterministic synthesis when offline or unconfigured.
   */
  public async generateBudgetPlan(
    project: MarketingProject,
    input: BudgetInputSnapshot
  ): Promise<MarketingBudgetPlan> {
    try {
      const res = await fetch('/api/generate-budget-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ project, input }),
      });

      const data = await res.json();
      if (res.ok && data.ok && data.budgetPlan) {
        const generated = data.budgetPlan as MarketingBudgetPlan;
        const existing = this.getPlans(project.id);
        generated.version = existing.length + 1;
        this.savePlan(generated);
        return generated;
      }
    } catch (err) {
      console.info('Server AI budget generation offline, falling back to deterministic synthesizer:', err);
    }

    return this.generateOfflineFallbackPlan(project, input);
  }

  /**
   * Deterministic client-side synthesis when AI server proxy is not reachable.
   */
  private generateOfflineFallbackPlan(
    project: MarketingProject,
    input: BudgetInputSnapshot
  ): MarketingBudgetPlan {
    const now = new Date().toISOString();
    const existing = this.getPlans(project.id);
    const brand = project.business?.brandName || 'Brand';
    const total = input.totalBudget || 8000;
    const currency = input.currency || 'USD';

    const conservativeAllocations: BudgetAllocation[] = [
      {
        id: 'alloc-c-search',
        category: 'High-Intent Search PPC',
        group: 'Advertising Spend',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.30)),
        percentage: 30.0,
        purpose: 'Capture in-market search buyers',
        reasonForAllocation: 'Direct commercial purchase intent',
        expectedActivity: 'Target exact-match transactional search terms',
        primaryKpi: 'Search ROAS > 3.5x',
        measurementMethod: 'Google Ads Conversion Pixel',
        reviewFrequency: 'Weekly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Search demand is bounded by monthly search volume',
      },
      {
        id: 'alloc-c-content',
        category: 'Content Marketing & SEO Hub',
        group: 'Content and Creative',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.25)),
        percentage: 25.0,
        purpose: 'Build compounding zero-CAC organic search assets',
        reasonForAllocation: 'High-leverage long-term distribution',
        expectedActivity: 'Publish 4 in-depth buyer guides and educational articles monthly',
        primaryKpi: 'Organic Traffic MoM > 20%',
        measurementMethod: 'Google Search Console',
        reviewFrequency: 'Monthly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'SEO compounding requires 3–6 months lead time',
      },
      {
        id: 'alloc-c-email',
        category: 'Lifecycle Email & SMS Retention',
        group: 'Marketing Operations',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.15)),
        percentage: 15.0,
        purpose: 'Automate post-purchase onboarding and replenishment reminders',
        reasonForAllocation: 'Maximizes customer lifetime value',
        expectedActivity: 'Set up welcome flows, cart abandonment, and repeat purchase triggers',
        primaryKpi: 'Repeat Purchase Rate > 30%',
        measurementMethod: 'eCommerce Analytics',
        reviewFrequency: 'Monthly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Dependent on subscriber opt-in velocity',
      },
      {
        id: 'alloc-c-referral',
        category: 'Customer Advocacy & Partner Seeding',
        group: 'External Services',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.15)),
        percentage: 15.0,
        purpose: 'Seed products to credible micro-creators and launch customer referral incentives',
        reasonForAllocation: 'Low-cost high-trust social proof',
        expectedActivity: 'Ship sample kits and offer 10% referral credits',
        primaryKpi: 'Referral Order Share > 12%',
        measurementMethod: 'Referral software dashboard',
        reviewFrequency: 'Monthly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Creator posting velocity is uncontracted',
      },
      {
        id: 'alloc-c-test',
        category: 'Testing & Emergency Cash Buffer',
        group: 'Testing and Reserve',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.15)),
        percentage: 15.0,
        purpose: 'Reserved for landing page headline testing and channel experiments',
        reasonForAllocation: 'Disciplined capital protection',
        expectedActivity: 'Run 2 CRO split tests and test 1 emerging channel',
        primaryKpi: 'Storefront Conversion Rate Lift > 15%',
        measurementMethod: 'Analytics Funnel',
        reviewFrequency: 'Monthly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Unspent testing funds roll over to reserve',
      },
    ];

    const balancedAllocations: BudgetAllocation[] = [
      {
        id: 'alloc-b-social',
        category: 'Paid Social (Meta Ads & Reels)',
        group: 'Advertising Spend',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.35)),
        percentage: 35.0,
        purpose: 'Top-of-funnel customer acquisition through visual product demonstrations',
        reasonForAllocation: 'Highest liquidity and audience reach',
        expectedActivity: 'Test 3 video creative angles with automated Advantage+ distribution',
        primaryKpi: 'Blended CAC < $35',
        measurementMethod: 'Ad Manager + Storefront Attribution',
        reviewFrequency: 'Weekly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Creative fatigue requires fresh hooks every 3 weeks',
      },
      {
        id: 'alloc-b-search',
        category: 'High-Intent Search PPC',
        group: 'Advertising Spend',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.20)),
        percentage: 20.0,
        purpose: 'Capture high-intent in-market prospective buyers',
        reasonForAllocation: 'Bottom-of-funnel conversion efficiency',
        expectedActivity: 'Target commercial transactional search terms',
        primaryKpi: 'Search ROAS > 3.5x',
        measurementMethod: 'Search Ads conversion tracking',
        reviewFrequency: 'Weekly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Competitor bidding competition',
      },
      {
        id: 'alloc-b-creative',
        category: 'Creative Production & Video Editing',
        group: 'Content and Creative',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.18)),
        percentage: 18.0,
        purpose: 'Produce high-converting video creative assets, photo carousels, and design banners',
        reasonForAllocation: 'Direct driver of lower CAC and higher conversion rates',
        expectedActivity: 'Deliver 4 fresh video ad iterations monthly',
        primaryKpi: 'Ad CTR > 2.0%',
        measurementMethod: 'Ad Creative Diagnostics',
        reviewFrequency: 'Bi-weekly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Production turnaround requires clear creative briefs',
      },
      {
        id: 'alloc-b-ops',
        category: 'Email Automation & Analytics Platforms',
        group: 'Marketing Operations',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.10)),
        percentage: 10.0,
        purpose: 'Powers lifecycle email sequences, SMS alerts, and subscription tools',
        reasonForAllocation: 'Crucial infrastructure for customer retention',
        expectedActivity: 'Maintain post-purchase flows and repeat order automation',
        primaryKpi: 'Email Revenue Contribution > 25%',
        measurementMethod: 'Email platform attributed revenue',
        reviewFrequency: 'Monthly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Fixed monthly software cost',
      },
      {
        id: 'alloc-b-services',
        category: 'Influencer Seeding & Outreach',
        group: 'External Services',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.07)),
        percentage: 7.0,
        purpose: 'Product sample gifting to 25 relevant creators and industry experts',
        reasonForAllocation: 'Supplies authentic user endorsements for ads and landing pages',
        expectedActivity: 'Curate PR mailers and manage outreach relationships',
        primaryKpi: '8+ Verified Creator Endorsements',
        measurementMethod: 'Social mentions and affiliate tracking',
        reviewFrequency: 'Monthly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Uncontracted creators may post on variable timelines',
      },
      {
        id: 'alloc-b-test',
        category: 'Testing & Experimentation Reserve',
        group: 'Testing and Reserve',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.10)),
        percentage: 10.0,
        purpose: 'Dedicated capital for A/B testing landing pages and trial ad channels',
        reasonForAllocation: 'Protects core campaigns while enabling innovation',
        expectedActivity: 'Run 2 CRO tests and 1 emerging channel exploration',
        primaryKpi: 'Conversion Rate Lift > 15%',
        measurementMethod: 'Funnel analytics',
        reviewFrequency: 'Monthly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Experiments may not yield immediate positive ROAS',
      },
    ];

    const growthAllocations: BudgetAllocation[] = [
      {
        id: 'alloc-g-social',
        category: 'Paid Social Scale (Meta & TikTok Ads)',
        group: 'Advertising Spend',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.45)),
        percentage: 45.0,
        purpose: 'Rapid customer volume capture across broad lookalike audiences',
        reasonForAllocation: 'Maximum audience scaling liquidity',
        expectedActivity: 'Run 6 creative hooks simultaneously with automated budget scaling',
        primaryKpi: 'New Customer Volume',
        measurementMethod: 'Storefront new orders',
        reviewFrequency: 'Daily',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Higher blended CAC during rapid horizontal scaling',
      },
      {
        id: 'alloc-g-search',
        category: 'Search PPC & Shopping Conquesting',
        group: 'Advertising Spend',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.20)),
        percentage: 20.0,
        purpose: 'Dominate category search and competitor alternative queries',
        reasonForAllocation: 'High commercial intent capture',
        expectedActivity: 'Aggressive keyword bidding and Performance Max campaigns',
        primaryKpi: 'Search Impression Share > 70%',
        measurementMethod: 'Search Ads Reporting',
        reviewFrequency: 'Weekly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Auction inflation requires strict CPA caps',
      },
      {
        id: 'alloc-g-creative',
        category: 'Rapid Creative Asset Studio',
        group: 'Content and Creative',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.15)),
        percentage: 15.0,
        purpose: 'High-volume video iteration and thumbnail testing',
        reasonForAllocation: 'Essential fuel for high-velocity ad spending',
        expectedActivity: 'Deliver 6 video ad variations monthly',
        primaryKpi: 'Ad Hook Stop Rate > 35%',
        measurementMethod: 'Ad Manager Creative Diagnostics',
        reviewFrequency: 'Weekly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Requires fast-paced creative coordination',
      },
      {
        id: 'alloc-g-ops',
        category: 'Marketing Tools & Automation',
        group: 'Marketing Operations',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.08)),
        percentage: 8.0,
        purpose: 'Data enrichment, email automation, and conversion tracking',
        reasonForAllocation: 'Infrastructure to handle increased customer traffic',
        expectedActivity: 'Maintain CRM workflows and retention flows',
        primaryKpi: 'Email Open Rate > 40%',
        measurementMethod: 'Email Analytics',
        reviewFrequency: 'Monthly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Fixed software subscriptions',
      },
      {
        id: 'alloc-g-test',
        category: 'Aggressive Testing Reserve',
        group: 'Testing and Reserve',
        amount: fromMinorUnits(Math.round(toMinorUnits(total) * 0.12)),
        percentage: 12.0,
        purpose: 'Rapid micro-experiments: influencer sponsorships, podcast reads, and quiz funnels',
        reasonForAllocation: 'Identifies breakthrough asymmetric customer channels',
        expectedActivity: 'Run 2 experimentation pilots monthly with dedicated budgets',
        primaryKpi: 'Discovered Channel CAC < $35',
        measurementMethod: 'Blended Cohort Analytics',
        reviewFrequency: 'Bi-weekly',
        performanceStatus: 'Planned',
        riskOrLimitation: 'Higher variance in ROI during testing',
      },
    ];

    const formatVariant = (
      approach: BudgetPlanApproach,
      name: string,
      tagline: string,
      description: string,
      allocations: BudgetAllocation[],
      advantages: string[],
      risks: string[]
    ): BudgetPlanVariant => {
      const breakdowns = recalculateGroupBreakdowns(allocations, total);
      const val = validateAllocations(allocations, total);

      return {
        approach,
        name,
        tagline,
        description,
        totalBudget: total,
        currency,
        allocations,
        groupBreakdowns: breakdowns,
        unallocatedAmount: val.unallocatedAmount,
        unallocatedPercentage: val.unallocatedPercentage,
        isBalanced100Percent: val.isBalanced100Percent,
        keyAdvantages: advantages,
        keyRisks: risks,
        strategicRecommendations: ['Audit performance weekly', 'Enforce strict CPA thresholds'],
      };
    };

    const conservative = formatVariant(
      'conservative',
      'Conservative Budget',
      'Capital-Preserving Organic & Controlled Validation',
      'Limits financial exposure by anchoring in high-leverage organic channels and essential tools.',
      conservativeAllocations,
      ['Low financial downside', 'Builds long-term owned assets', 'Zero agency fees'],
      ['Slower customer acquisition velocity', 'Requires high team execution time']
    );

    const balanced = formatVariant(
      'balanced',
      'Balanced Budget',
      'Integrated Multi-Channel Acquisition & Retention',
      'Blends top-of-funnel paid media with lifecycle retention, creative production, and testing.',
      balancedAllocations,
      ['Predictable customer acquisition velocity', 'Balanced acquisition and retention', 'Continuous creative refresh'],
      ['Requires disciplined CPA monitoring', 'Ad spend inflation requires bid caps']
    );

    const growth = formatVariant(
      'growth',
      'Growth-Focused Budget',
      'Aggressive Category Scale & Expanded Experimentation',
      'Maximizes acquisition velocity across multiple channels with higher testing buffer.',
      growthAllocations,
      ['Rapid market share capture', 'Fast statistical feedback loops'],
      ['Higher cash burn if conversion rates decline', 'Requires strict stop-loss caps']
    );

    const fallback: MarketingBudgetPlan = {
      id: `budget-${Date.now()}`,
      projectId: project.id,
      projectName: brand,
      planTitle: `Marketing Budget Plan — ${brand}`,
      version: existing.length + 1,
      createdAt: now,
      updatedAt: now,
      modelIdentifier: 'Sparkline Deterministic Budget Engine (Offline Synthesizer)',
      currency,
      totalBudget: total,
      frequency: input.frequency || 'Monthly',
      inputSnapshot: input,
      selectedApproach: 'balanced',
      plans: {
        conservative,
        balanced,
        growth,
      },
      activePlan: JSON.parse(JSON.stringify(balanced)),
      warnings: validateAllocations(balanced.allocations, total).warnings,
      recommendations: [
        {
          id: 'rec-fall-1',
          title: 'Maintain Minimum 15% in Creative & Testing',
          description:
            'Allocating sufficient resources to video ad production and testing prevents ad fatigue and lowers blended CAC.',
          suggestedAction: 'Keep creative production and testing funded before expanding paid media spend.',
          impact: 'High',
        },
      ],
      timelineMonthlySpend: [
        {
          month: 'Month 1',
          amount: total,
          advertising: Math.round(total * 0.55),
          creative: Math.round(total * 0.18),
          operations: Math.round(total * 0.10),
          services: Math.round(total * 0.07),
          testing: Math.round(total * 0.10),
        },
        {
          month: 'Month 2',
          amount: total,
          advertising: Math.round(total * 0.55),
          creative: Math.round(total * 0.18),
          operations: Math.round(total * 0.10),
          services: Math.round(total * 0.07),
          testing: Math.round(total * 0.10),
        },
        {
          month: 'Month 3',
          amount: total,
          advertising: Math.round(total * 0.58),
          creative: Math.round(total * 0.15),
          operations: Math.round(total * 0.10),
          services: Math.round(total * 0.07),
          testing: Math.round(total * 0.10),
        },
      ],
    };

    this.savePlan(fallback);
    return fallback;
  }
}

export const budgetService = new BudgetService();
