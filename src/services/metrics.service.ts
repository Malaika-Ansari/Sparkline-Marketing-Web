/**
 * SPARKLINE MARKETING — MARKETING METRICS & KNOWLEDGE CENTER SERVICE
 * Unified calculation engines, metric definitions, knowledge articles, and persistence.
 */

import {
  MetricId,
  MetricCategory,
  MetricDefinition,
  MetricCalculationRecord,
  MetricKnowledgeArticle,
  MetricBenchmark,
  EngagementDenominator,
  ConversionDenominator,
  CpaCostScope,
} from '@/types/metrics';
import { securityService } from './security.service';

const CALCULATIONS_STORAGE_KEY = 'sparkline_marketing_metric_calculations';

export interface CalculationOutcome {
  value: number | null;
  formatted: string;
  unit: string;
  isZeroDenominator: boolean;
  errorReason?: string;
  status: 'valid' | 'zero_denominator' | 'boundary_error';
  interpretation: string;
}

export const METRIC_CATEGORIES: MetricCategory[] = [
  'Advertising & Campaigns',
  'Social Media',
  'Lead Generation',
  'Revenue & Profitability',
  'Website & Email',
];

export const METRIC_DEFINITIONS: Record<MetricId, MetricDefinition> = {
  ctr: {
    id: 'ctr',
    name: 'Click-Through Rate (CTR)',
    shortName: 'CTR',
    category: 'Advertising & Campaigns',
    formulaString: '(Clicks / Impressions) × 100',
    unit: '%',
    description:
      'The percentage of impressions that resulted in a click on an ad, link, or call to action.',
    whyMarketersUseIt:
      'Gauges creative appeal, headline relevance, and audience resonance in competitive feeds.',
    howToInterpret:
      'A higher CTR indicates that ad copy, visual assets, and offer hooks are attracting attention.',
    commonMistakes: [
      'Confusing high CTR with commercial success; clickbait copy can produce high clicks with zero purchases.',
      'Comparing CTR across dissimilar ad formats (e.g. Google Search CTR is typically much higher than Meta Display CTR).',
    ],
    improvementTips: [
      'Test high-contrast visual first 3-second video hooks.',
      'Ensure the headline directly addresses the specific search intent or pain point.',
      'Refine audience exclusions to stop showing ads to irrelevant demographic slices.',
    ],
    relatedMetrics: ['cpc', 'conversion_rate', 'cpm'],
    workedExample: {
      scenario: 'A direct-to-consumer skincare ad receives 1,250 clicks from 50,000 impressions.',
      inputs: { Clicks: 1250, Impressions: 50000 },
      calculationSteps: [
        'Divide clicks by impressions: 1,250 / 50,000 = 0.025',
        'Multiply by 100 to get percentage: 0.025 × 100 = 2.50%',
      ],
      result: '2.50%',
      interpretation:
        '2.5 out of every 100 people who saw the ad clicked through, performing above the typical e-commerce feed average of 1.2%–1.8%.',
    },
  },

  cpc: {
    id: 'cpc',
    name: 'Cost Per Click (CPC)',
    shortName: 'CPC',
    category: 'Advertising & Campaigns',
    formulaString: 'Advertising Spend / Clicks',
    unit: '$',
    description:
      'The average financial amount spent to acquire a single click on an advertisement.',
    whyMarketersUseIt:
      'Monitors bid competitiveness, keyword auction inflation, and media efficiency.',
    howToInterpret:
      'Lower CPC means more traffic can be acquired for the same budget, but traffic quality must be monitored through down-funnel conversion rate.',
    commonMistakes: [
      'Optimizing strictly for lowest CPC, which often diverts budget to low-intent bots or accidental clicks.',
      'Ignoring platform quality scores or ad relevance diagnostics that directly discount CPC.',
    ],
    improvementTips: [
      'Improve Ad Relevance diagnostics (Meta Quality Ranking / Google Quality Score).',
      'Use negative keywords in search campaigns to eliminate irrelevant impressions.',
      'Expand remarketing audiences with higher engagement history.',
    ],
    relatedMetrics: ['ctr', 'cpm', 'conversion_rate'],
    workedExample: {
      scenario: 'A B2B SaaS Google Search campaign spends $2,400 and captures 600 clicks.',
      inputs: { 'Advertising Spend': '$2,400', Clicks: 600 },
      calculationSteps: ['Divide spend by clicks: $2,400 / 600 = $4.00'],
      result: '$4.00',
      interpretation:
        'Each search visitor cost an average of $4.00 to drive to the demo landing page.',
    },
  },

  cpm: {
    id: 'cpm',
    name: 'Cost Per Thousand Impressions (CPM)',
    shortName: 'CPM',
    category: 'Advertising & Campaigns',
    formulaString: '(Advertising Spend / Impressions) × 1,000',
    unit: '$',
    description:
      'The cost to deliver 1,000 impressions of an advertisement across a chosen placement.',
    whyMarketersUseIt:
      'Evaluates wholesale inventory pricing in auction platforms and monitors seasonal competition.',
    howToInterpret:
      'CPM rises during high-competition shopping quarters (Q4 BFCM) and for highly targeted, wealthy demographics.',
    commonMistakes: [
      'Assuming lower CPM is always better; ultra-cheap CPMs often represent low-viewability audience network banner placements.',
      'Failing to account for creative fatigue, which triggers ad auction penalties and spikes CPM.',
    ],
    improvementTips: [
      'Refresh creative assets every 2–3 weeks to maintain favorable auction relevance scores.',
      'Broaden targeting parameters if ad sets are stuck in narrow audience auction bottlenecks.',
      'Schedule campaigns outside peak bidding surges when feasible.',
    ],
    relatedMetrics: ['cpc', 'reach', 'frequency'],
    workedExample: {
      scenario: 'A brand awareness video campaign spends $3,500 and serves 250,000 impressions.',
      inputs: { 'Advertising Spend': '$3,500', Impressions: 250000 },
      calculationSteps: [
        'Divide spend by impressions: $3,500 / 250,000 = $0.014',
        'Multiply by 1,000: $0.014 × 1,000 = $14.00',
      ],
      result: '$14.00',
      interpretation:
        'The advertiser pays $14.00 for every thousand visual impressions delivered.',
    },
  },

  cpa: {
    id: 'cpa',
    name: 'Cost Per Acquisition (CPA)',
    shortName: 'CPA',
    category: 'Advertising & Campaigns',
    formulaString: 'Campaign Cost / Conversions',
    unit: '$',
    description:
      'The cost required to generate a specific target conversion, such as a paying customer, sale, or subscription.',
    whyMarketersUseIt:
      'Determines whether customer acquisition is economically viable compared to product gross margins.',
    howToInterpret:
      'CPA must remain sustainably below Average Order Value (for immediate payback) or Customer Lifetime Value (for subscription models).',
    commonMistakes: [
      'Calculating CPA using ad spend only while omitting creative production, copywriting, and software tool costs.',
      'Treating micro-conversions (e.g. newsletter signups) as commercial acquisitions in blended reporting.',
    ],
    improvementTips: [
      'Optimize landing page conversion rate through structured A/B headline and social proof testing.',
      'Implement post-click personalized quiz funnels to lift conversion velocity.',
      'Introduce clear payment installments (Klarna, Affirm) for higher-ticket orders.',
    ],
    relatedMetrics: ['cac', 'roas', 'conversion_rate'],
    workedExample: {
      scenario: 'An e-commerce brand spends $8,000 on ads and production, generating 200 orders.',
      inputs: { 'Campaign Cost': '$8,000', Conversions: 200, 'Cost Scope': 'Total Campaign Cost' },
      calculationSteps: ['Divide total cost by conversions: $8,000 / 200 = $40.00'],
      result: '$40.00',
      interpretation:
        'The brand spends $40.00 to acquire each paying customer. If product price is $80 with 65% margin ($52 gross profit), this acquisition is profitable.',
    },
  },

  frequency: {
    id: 'frequency',
    name: 'Reach, Impressions & Frequency',
    shortName: 'Frequency',
    category: 'Advertising & Campaigns',
    formulaString: 'Impressions / Reach',
    unit: 'views/user',
    description:
      'The average number of times an individual unique person sees an advertisement over a reporting timeframe.',
    whyMarketersUseIt:
      'Prevents ad fatigue, audience saturation, and negative brand annoyance while ensuring adequate message reinforcement.',
    howToInterpret:
      'Frequency between 2.0 and 4.0 is typical for cold prospecting. Frequencies above 6.0 in a short window frequently correlate with declining CTR and rising CPA.',
    commonMistakes: [
      'Confusing Reach (unique people) with Impressions (total view events).',
      'Ignoring frequency caps on retargeting campaigns, causing prospective buyers to feel stalked.',
    ],
    improvementTips: [
      'Set automated frequency capping rules on programmatic and social ad platforms.',
      'Rotate 3–4 dynamic creative variations within the same ad set.',
      'Expand the underlying audience pool or exclude recent purchasers.',
    ],
    relatedMetrics: ['cpm', 'ctr'],
    workedExample: {
      scenario: 'An ad delivers 180,000 impressions across a unique audience of 60,000 individuals.',
      inputs: { Impressions: 180000, 'Unique Reach': 60000 },
      calculationSteps: ['Divide total impressions by unique reach: 180,000 / 60,000 = 3.00'],
      result: '3.00 views/user',
      interpretation:
        'Each prospective customer in the target audience saw the advertisement an average of 3 times.',
    },
  },

  engagement_rate: {
    id: 'engagement_rate',
    name: 'Social Media Engagement Rate',
    shortName: 'Engagement Rate',
    category: 'Social Media',
    formulaString: '(Total Engagements / Denominator) × 100',
    unit: '%',
    description:
      'The percentage of an audience that interacts with published content through likes, comments, shares, and saves.',
    whyMarketersUseIt:
      'Assesses content resonance, community loyalty, and algorithmic distribution favorability.',
    howToInterpret:
      'Benchmarks vary significantly by denominator: Engagement by Reach is generally higher than Engagement by Follower Count.',
    commonMistakes: [
      'Comparing engagement rates calculated against followers with rates calculated against reach without normalization.',
      'Valuing passive likes equally with high-intent saves and shares.',
    ],
    improvementTips: [
      'Ask open-ended discussion questions in captions to provoke meaningful replies.',
      'Design shareable educational infographics or relatable industry humor.',
      'Use native platform stickers (polls, sliders, quizzes) in ephemeral story formats.',
    ],
    relatedMetrics: ['video_completion', 'ctr'],
    workedExample: {
      scenario: 'An Instagram post receives 450 likes, 60 comments, 90 shares, and 120 saves (720 total) across 18,000 account reach.',
      inputs: { 'Total Engagements': 720, 'Selected Denominator (Reach)': 18000 },
      calculationSteps: [
        'Sum interactions: 450 + 60 + 90 + 120 = 720',
        'Divide by reach: 720 / 18,000 = 0.04',
        'Multiply by 100: 0.04 × 100 = 4.00%',
      ],
      result: '4.00%',
      interpretation:
        '4.00% of unique viewers interacted with the post, representing strong organic resonance.',
    },
  },

  video_completion: {
    id: 'video_completion',
    name: 'Video Completion Rate (VCR)',
    shortName: 'VCR',
    category: 'Social Media',
    formulaString: '(Video Completions / Video Starts) × 100',
    unit: '%',
    description:
      'The percentage of viewers who watched an entire video asset from start to finish.',
    whyMarketersUseIt:
      'Indicates narrative pacing, storytelling retention, and viewer interest in educational or commercial videos.',
    howToInterpret:
      'Short-form videos (15–30s) typically target 40%–60% VCR, while long-form content (3m+) achieves 15%–25%.',
    commonMistakes: [
      'Focusing exclusively on total views while ignoring viewer drop-off within the first 3 seconds.',
      'Failing to deliver key value propositions before the median drop-off point.',
    ],
    improvementTips: [
      'Eliminate long introductory logos or slow preamble; start in medias res.',
      'Introduce pattern interrupts (visual B-roll cuts, sound effects) every 4 seconds.',
      'Front-load the core problem within the opening 3 seconds.',
    ],
    relatedMetrics: ['engagement_rate', 'ctr'],
    workedExample: {
      scenario: 'A product demonstration video gets 15,000 video starts and 6,300 full completions.',
      inputs: { 'Video Starts': 15000, 'Video Completions': 6300 },
      calculationSteps: [
        'Divide completions by starts: 6,300 / 15,000 = 0.42',
        'Multiply by 100: 0.42 × 100 = 42.00%',
      ],
      result: '42.00%',
      interpretation:
        '42% of viewers who began watching stayed until the end of the video, showing healthy retention.',
    },
  },

  cpl: {
    id: 'cpl',
    name: 'Cost Per Lead (CPL)',
    shortName: 'CPL',
    category: 'Lead Generation',
    formulaString: 'Total Marketing Cost / Leads',
    unit: '$',
    description:
      'The average marketing expenditure required to capture a prospective lead contact.',
    whyMarketersUseIt:
      'Monitors top-of-funnel capture efficiency in high-consideration B2B, real estate, education, and service funnels.',
    howToInterpret:
      'Must be evaluated alongside lead quality; ultra-low CPL often signals unverified phone numbers or low buying power.',
    commonMistakes: [
      'Optimizing for raw volume of cheap leads that sales teams subsequently disqualify.',
      'Failing to track Lead-to-Opportunity and Lead-to-Closed-Won downstream conversion rates.',
    ],
    improvementTips: [
      'Add 1–2 qualifying filter questions to lead capture forms.',
      'Use platform native instant lead forms with auto-filled verified contact information.',
      'Improve the lead magnet value proposition with immediate utility tools.',
    ],
    relatedMetrics: ['cpa', 'conversion_rate', 'cac'],
    workedExample: {
      scenario: 'A B2B marketing campaign spends $5,000 and generates 250 verified email/phone leads.',
      inputs: { 'Marketing Cost': '$5,000', Leads: 250 },
      calculationSteps: ['Divide marketing cost by leads: $5,000 / 250 = $20.00'],
      result: '$20.00',
      interpretation:
        'The company pays an average of $20.00 per qualified lead captured.',
    },
  },

  conversion_rate: {
    id: 'conversion_rate',
    name: 'Conversion Rate (CVR)',
    shortName: 'Conversion Rate',
    category: 'Lead Generation',
    formulaString: '(Conversions / Denominator) × 100',
    unit: '%',
    description:
      'The percentage of traffic or interactions that complete a specified target action.',
    whyMarketersUseIt:
      'Measures funnel efficiency, landing page design, copywriting clarity, and offer strength.',
    howToInterpret:
      'E-commerce transaction CVR typically spans 1.5%–3.5%. Lead magnet opt-in CVR often spans 10%–25%.',
    commonMistakes: [
      'Comparing conversion rates without specifying the denominator (Clicks vs. Unique Visitors vs. Total Sessions).',
      'Over-optimizing page elements before establishing statistically significant traffic volume.',
    ],
    improvementTips: [
      'Simplify form fields to minimize user typing friction.',
      'Display prominent trust badges, unedited customer reviews, and money-back guarantees.',
      'Ensure mobile page load speed completes within 2.5 seconds.',
    ],
    relatedMetrics: ['ctr', 'cpa', 'bounce_rate'],
    workedExample: {
      scenario: 'An e-commerce checkout page records 180 completed orders from 6,000 landing page sessions.',
      inputs: { Conversions: 180, 'Selected Denominator (Sessions)': 6000 },
      calculationSteps: [
        'Divide conversions by sessions: 180 / 6,000 = 0.03',
        'Multiply by 100: 0.03 × 100 = 3.00%',
      ],
      result: '3.00%',
      interpretation:
        '3 out of every 100 sessions convert into a completed order, performing solidly within standard DTC e-commerce benchmarks.',
    },
  },

  roas: {
    id: 'roas',
    name: 'Return On Ad Spend (ROAS)',
    shortName: 'ROAS',
    category: 'Revenue & Profitability',
    formulaString: 'Attributed Ad Revenue / Ad Spend',
    unit: 'x',
    description:
      'The gross revenue generated for every currency unit spent directly on paid advertising.',
    whyMarketersUseIt:
      'Immediate real-time media efficiency metric used by media buyers to scale or trim ad set budgets.',
    howToInterpret:
      'A 4.0x ROAS means $4.00 in gross revenue was attributed for every $1.00 of ad spend. It is NOT net profit.',
    commonMistakes: [
      'Confusing ROAS with profitability; ignoring product COGS, shipping, payment processing fees, and overhead.',
      'Relying blindly on ad platform default attribution windows (e.g. 7-day click / 1-day view) without checking merchant backend bank deposits.',
    ],
    improvementTips: [
      'Increase Average Order Value (AOV) through post-purchase one-click upsells and bundle tiers.',
      'Shift budget to high-intent bottom-of-funnel search terms and tested retargeting audiences.',
      'Implement strict stop-loss rules on creative sets failing to hit minimum break-even ROAS.',
    ],
    relatedMetrics: ['roi', 'cpa', 'cpc'],
    workedExample: {
      scenario: 'A Meta Ads campaign spends $4,000 and generates $18,000 in attributed Shopify revenue.',
      inputs: { 'Attributed Revenue': '$18,000', 'Ad Spend': '$4,000' },
      calculationSteps: ['Divide revenue by ad spend: $18,000 / $4,000 = 4.50'],
      result: '4.50x',
      interpretation:
        'The campaign generated $4.50 in top-line revenue for every $1.00 spent on paid advertising.',
    },
  },

  roi: {
    id: 'roi',
    name: 'Return On Investment (ROI)',
    shortName: 'ROI',
    category: 'Revenue & Profitability',
    formulaString: '((Net Return − Investment) / Investment) × 100',
    unit: '%',
    description:
      'The net percentage profitability of a marketing initiative relative to all capital invested.',
    whyMarketersUseIt:
      'Evaluates true commercial viability by incorporating all overhead, creative production, software, and agency retainers.',
    howToInterpret:
      'A positive ROI indicates true financial expansion. A negative ROI means the initiative burned capital.',
    commonMistakes: [
      'Equating ROAS directly with ROI. A high ROAS can easily produce a negative ROI if product costs and agency retainers exceed margins.',
      'Omitting internal team hours and software subscriptions from the investment denominator.',
    ],
    improvementTips: [
      'Improve product gross margins through supplier negotiations and supply chain streamlining.',
      'Build recurring subscription revenue loops to maximize customer value without repeated media spend.',
      'Cut bloated SaaS tools and unprofitable acquisition channels.',
    ],
    relatedMetrics: ['roas', 'cac', 'clv_ltv'],
    workedExample: {
      scenario: 'A total marketing campaign investment of $15,000 (media, creative, tools) yields $36,000 in net commercial return.',
      inputs: { 'Net Commercial Return': '$36,000', 'Total Investment': '$15,000' },
      calculationSteps: [
        'Calculate net gain: $36,000 − $15,000 = $21,000',
        'Divide by investment: $21,000 / $15,000 = 1.40',
        'Multiply by 100: 1.40 × 100 = 140.00%',
      ],
      result: '140.00%',
      interpretation:
        'The marketing campaign delivered a 140% net financial return on all capital invested, generating $2.40 back for every $1.00 deployed.',
    },
  },

  cac: {
    id: 'cac',
    name: 'Customer Acquisition Cost (CAC)',
    shortName: 'CAC',
    category: 'Revenue & Profitability',
    formulaString: 'Total Acquisition Costs / New Customers Acquired',
    unit: '$',
    description:
      'The fully loaded cost to win a single new customer across all sales and marketing expenditures.',
    whyMarketersUseIt:
      'Foundational unit economics metric for SaaS, subscription brands, and growth-stage companies.',
    howToInterpret:
      'Must be evaluated against Customer Lifetime Value (LTV). A healthy business model typically targets an LTV:CAC ratio of 3:1 or higher.',
    commonMistakes: [
      'Excluding sales salaries, onboarding commissions, and marketing software subscriptions from acquisition costs.',
      'Failing to specify reporting time horizons (e.g. 30-day cohort vs. 12-month cohort).',
    ],
    improvementTips: [
      'Build organic viral referral loops and affiliate advocate programs.',
      'Improve sales pipeline velocity and conversion from sales-qualified lead (SQL) to closed-won.',
      'Focus media spend on audiences with the shortest sales cycles.',
    ],
    relatedMetrics: ['clv_ltv', 'cpa', 'roi'],
    workedExample: {
      scenario: 'A SaaS company spends $45,000 in monthly marketing, sales headcount, and tools, acquiring 150 new enterprise clients.',
      inputs: { 'Total Acquisition Costs': '$45,000', 'New Customers Acquired': 150 },
      calculationSteps: ['Divide total cost by new customers: $45,000 / 150 = $300.00'],
      result: '$300.00',
      interpretation:
        'The company incurs $300.00 to acquire each new paying customer across its sales and marketing engine.',
    },
  },

  clv_ltv: {
    id: 'clv_ltv',
    name: 'Customer Lifetime Value (LTV)',
    shortName: 'CLV / LTV',
    category: 'Revenue & Profitability',
    formulaString: 'Avg Purchase Value × Purchase Frequency × Customer Lifespan',
    unit: '$',
    description:
      'The estimated total revenue or gross profit a customer will generate throughout their commercial relationship.',
    whyMarketersUseIt:
      'Sets allowable acquisition budgets and informs customer retention and loyalty investments.',
    howToInterpret:
      'Gross-profit-based LTV provides the truest upper limit on allowable CAC for sustainable growth.',
    commonMistakes: [
      'Treating historical LTV as guaranteed future cash flow.',
      'Confusing top-line revenue LTV with gross-profit LTV.',
    ],
    improvementTips: [
      'Implement proactive customer success and onboarding sequences to curb early churn.',
      'Introduce tiered loyalty reward programs that incentivize repeat orders.',
      'Develop complementary cross-sell product lines.',
    ],
    relatedMetrics: ['cac', 'roi', 'cpa'],
    workedExample: {
      scenario: 'An organic coffee subscription customer spends $40 per order, orders 8 times per year, and stays active for 2.5 years with a 70% gross margin.',
      inputs: {
        'Average Order Value': '$40',
        'Purchase Frequency': '8 / year',
        'Customer Lifespan': '2.5 years',
        'Gross Margin %': '70%',
      },
      calculationSteps: [
        'Revenue LTV: $40 × 8 × 2.5 = $800.00',
        'Gross Profit LTV: $800 × 70% = $560.00',
      ],
      result: '$560.00 (Gross Profit) / $800.00 (Revenue)',
      interpretation:
        'Each customer generates $800 in total revenue and $560 in cumulative gross profit over their lifetime, supporting a maximum allowable CAC up to $180 (for a 3:1 ratio).',
    },
  },

  bounce_rate: {
    id: 'bounce_rate',
    name: 'GA4 Bounce Rate (Non-Engaged Sessions)',
    shortName: 'Bounce Rate',
    category: 'Website & Email',
    formulaString: '(Non-engaged Sessions / Total Sessions) × 100',
    unit: '%',
    description:
      'In Google Analytics 4, the percentage of sessions that were NOT engaged sessions (an engaged session lasts 10+ seconds, has 2+ page views, or records a conversion event).',
    whyMarketersUseIt:
      'Measures landing page relevance, site speed, and immediate visitor friction.',
    howToInterpret:
      'GA4 Bounce Rate is the exact inverse of Engagement Rate (Bounce Rate = 100% − Engagement Rate). It reflects visitors who left without engaging meaningfully.',
    commonMistakes: [
      'Applying the old Universal Analytics definition (which counted a visitor who spent 10 minutes reading a blog post without clicking as a bounce). In GA4, that is an engaged session.',
      'Assuming all bounces are negative; a user finding a local store phone number in 5 seconds got what they needed.',
    ],
    improvementTips: [
      'Ensure above-the-fold content loads in under 1.5 seconds on mobile 4G connections.',
      'Clarify value proposition and remove intrusive popups that trigger immediate exits.',
      'Include clear, interactive internal links and scroll cues.',
    ],
    relatedMetrics: ['conversion_rate', 'ctr'],
    workedExample: {
      scenario: 'A website receives 10,000 total sessions in GA4, of which 3,200 were non-engaged sessions.',
      inputs: { 'Non-Engaged Sessions': 3200, 'Total Sessions': 10000 },
      calculationSteps: [
        'Divide non-engaged sessions by total sessions: 3,200 / 10,000 = 0.32',
        'Multiply by 100: 0.32 × 100 = 32.00%',
      ],
      result: '32.00%',
      interpretation:
        '32% of sessions were non-engaged, meaning 68% of visitors engaged meaningfully (10+ seconds, 2+ views, or converted).',
    },
  },

  email_open_rate: {
    id: 'email_open_rate',
    name: 'Email Open Rate',
    shortName: 'Open Rate',
    category: 'Website & Email',
    formulaString: '(Unique Opens / Delivered Emails) × 100',
    unit: '%',
    description:
      'The percentage of successfully delivered emails opened by recipients.',
    whyMarketersUseIt:
      'Evaluates sender reputation, subject line effectiveness, and inbox placement.',
    howToInterpret:
      'Must be evaluated with privacy caveats: Apple Mail Privacy Protection (MPP) pre-fetches images, inflating measured open rates across iOS users.',
    commonMistakes: [
      'Treating open rates as an absolute metric; Apple MPP and email firewalls make open rates indicative rather than exact.',
      'Writing clickbait subject lines that lift opens but crater click-through rates and cause spam complaints.',
    ],
    improvementTips: [
      'Authenticate domain records with strict SPF, DKIM, and DMARC protocols.',
      'A/B test curiosity vs. direct benefit subject lines.',
      'Regularly purge unengaged contacts who have not opened or clicked in 90+ days.',
    ],
    relatedMetrics: ['email_click_rate', 'conversion_rate'],
    workedExample: {
      scenario: 'A newsletter sends 25,000 emails, delivering 24,000, and records 8,400 unique opens.',
      inputs: { 'Unique Opens': 8400, 'Delivered Emails': 24000 },
      calculationSteps: [
        'Divide unique opens by delivered emails: 8,400 / 24,000 = 0.35',
        'Multiply by 100: 0.35 × 100 = 35.00%',
      ],
      result: '35.00%',
      interpretation:
        '35% of delivered subscribers opened the email, reflecting strong sender trust and compelling subject line targeting.',
    },
  },

  email_click_rate: {
    id: 'email_click_rate',
    name: 'Email Click Rate (Click-to-Delivered)',
    shortName: 'Email Click Rate',
    category: 'Website & Email',
    formulaString: '(Unique Clicks / Delivered Emails) × 100',
    unit: '%',
    description:
      'The percentage of delivered emails that generated at least one click on an internal link.',
    whyMarketersUseIt:
      'The single most reliable engagement metric in email marketing unaffected by privacy image pre-fetching.',
    howToInterpret:
      'A 2.5%–4.0% email click rate represents strong engagement for newsletters and promotional broadcasts.',
    commonMistakes: [
      'Confusing Email Click Rate (clicks / delivered) with Click-to-Open Rate / CTOR (clicks / opens).',
      'Cluttering emails with 10 competing call-to-actions rather than focusing on a single primary objective.',
    ],
    improvementTips: [
      'Use high-contrast button CTAs above the email fold.',
      'Keep email copy focused on a single compelling offer or story.',
      'Segment subscriber lists based on past purchase behavior and expressed interests.',
    ],
    relatedMetrics: ['email_open_rate', 'conversion_rate'],
    workedExample: {
      scenario: 'An email broadcast delivers 20,000 emails and records 800 unique link clicks.',
      inputs: { 'Unique Clicks': 800, 'Delivered Emails': 20000 },
      calculationSteps: [
        'Divide unique clicks by delivered emails: 800 / 20,000 = 0.04',
        'Multiply by 100: 0.04 × 100 = 4.00%',
      ],
      result: '4.00%',
      interpretation:
        '4.00% of all delivered subscribers clicked through to the destination page, demonstrating high message relevance.',
    },
  },
};

export const KNOWLEDGE_ARTICLES: MetricKnowledgeArticle[] = [
  {
    id: 'art-fundamentals-1',
    slug: 'fundamentals-of-marketing-measurement',
    title: 'The Fundamentals of Marketing Measurement: Actionable Metrics vs. Vanity KPIs',
    category: 'Marketing Fundamentals',
    difficulty: 'Beginner',
    readTimeMinutes: 5,
    shortDescription:
      'Learn how to distinguish actionable financial metrics from vanity numbers, and build a decision-driven marketing scorecard.',
    content: `Effective marketing measurement is not about tracking every data point available in ad dashboards. It is about isolating the critical variables that govern customer acquisition cost, customer retention, and net profit.

### The Vanity Metric Trap
Vanity metrics are numbers that look impressive on a slide deck but provide zero indication of business viability:
- Raw impressions without click velocity
- Page views without engaged session duration
- Social followers who never visit your store or purchase

### Actionable Financial Metrics
Actionable metrics inform immediate operational decisions:
- **Customer Acquisition Cost (CAC)**: Directly answers how much capital must be invested to win a customer.
- **Conversion Rate (CVR)**: Signals where friction exists in your sales narrative or checkout funnel.
- **LTV:CAC Ratio**: Establishes whether your unit economics can withstand market competition and rising ad inflation.

### The Golden Rule of Measurement
If a metric increases or drops by 30% and does not alter what you do tomorrow, it is an informational metric, not a governing KPI.`,
    examples: [
      'Tracking social followers grew by 5,000 but monthly revenue remained flat: A classic vanity signal.',
      'Monitoring conversion rate dropped from 2.8% to 1.4% after a checkout redesign: An actionable friction signal.',
    ],
    relatedCalculators: ['cpa', 'cac', 'conversion_rate', 'roi'],
    practicalTips: [
      'Consolidate your weekly reporting dashboard down to 5 core metrics.',
      'Always tie media spend directly to commercial bank deposits, not platform-attributed guesses.',
    ],
    relatedArticleSlugs: ['ecommerce-unit-economics-cac-ltv'],
  },
  {
    id: 'art-paid-ads-1',
    slug: 'paid-auction-dynamics-cpc-cpm',
    title: 'Understanding Paid Auction Dynamics: CPC, CPM, and Algorithm Quality Scores',
    category: 'Paid Advertising',
    difficulty: 'Intermediate',
    readTimeMinutes: 7,
    shortDescription:
      'A deep dive into how Meta, Google, and TikTok price ad inventory and how creative relevance discounts your media costs.',
    content: `Ad networks operate on real-time generalized second-price auctions. Your bids do not compete solely on monetary spend; they compete on **Total Value**:

$$\\text{Total Value} = \\text{Bid Amount} \\times \\text{Estimated Action Rate} + \\text{User Ad Quality}$$

### Why CPMs Fluctuate
CPM (Cost Per Thousand Impressions) is the wholesale clearing price of user attention. It rises when:
1. **Auction Density Spikes**: Q4 holiday shopping creates seasonal inventory scarcity.
2. **Audience Targeting is Excessively Narrow**: Restricting algorithms to a 50,000-person lookalike forces bids against aggressive enterprise advertisers.
3. **Creative Fatigue Sets In**: When users repeatedly hide or skip your ad, the algorithm applies an ad quality penalty, increasing your CPM.

### How to Discount Your CPC
To lower your Cost Per Click without slashing bids:
- **Improve Creative CTR**: Ads with high relevance scores receive priority distribution in the auction.
- **Broaden Audience Horizons**: Modern machine-learning algorithms (e.g. Advantage+, Performance Max) optimize best when given wide targeting parameters.`,
    examples: [
      'Refreshing video creative hooks lowered an advertiser CPM from $28 to $16 within 10 days.',
      'Narrowing an audience to 3 specific interest keywords spiked CPC from $1.40 to $4.20.',
    ],
    relatedCalculators: ['cpc', 'cpm', 'ctr', 'roas'],
    practicalTips: [
      'Audit your ad frequency weekly; when frequency exceeds 3.5, prepare creative refreshes.',
      'Check Meta Quality Ranking diagnostics inside Ads Manager before adjusting budget caps.',
    ],
    relatedArticleSlugs: ['statistical-significance-cro'],
  },
  {
    id: 'art-social-1',
    slug: 'authentic-social-engagement-reach-impressions',
    title: 'Calculating Authentic Social Media Engagement Across Reach and Impressions',
    category: 'Social Media Marketing',
    difficulty: 'Beginner',
    readTimeMinutes: 6,
    shortDescription:
      'Demystifying social media engagement rates, choosing the right denominator, and weighting high-intent interactions.',
    content: `Calculating social media engagement is frequently distorted because marketers inconsistently switch between follower count, impressions, and unique reach.

### Three Ways to Calculate Engagement Rate
1. **Engagement by Followers**:
   $$\\text{Rate} = \\frac{\\text{Interactions}}{\\text{Total Followers}} \\times 100$$
   *Limitation*: Fails to account for inactive or ghost followers, and penalizes large accounts that organic algorithms under-index.
2. **Engagement by Impressions**:
   $$\\text{Rate} = \\frac{\\text{Interactions}}{\\text{Total Impressions}} \\times 100$$
   *Best For*: Paid social ads where you pay directly per impression view.
3. **Engagement by Reach (Recommended for Organic Content)**:
   $$\\text{Rate} = \\frac{\\text{Interactions}}{\\text{Unique Reach}} \\times 100$$
   *Best For*: Evaluating how well content resonated with the actual humans who saw it.

### Weighting High-Intent Interactions
A "like" requires minimal cognitive effort. A "save" or "share" indicates high utility. Modern growth teams assign higher strategic weight to saves and shares when analyzing creative performance.`,
    examples: [
      'A post seen by 10,000 people with 500 likes and 200 saves has a 7.0% Engagement by Reach.',
      'An account with 100,000 followers getting 500 likes has a 0.5% Engagement by Followers.',
    ],
    relatedCalculators: ['engagement_rate', 'video_completion', 'ctr'],
    practicalTips: [
      'Design carousels with reference checklists to maximize saves.',
      'Always specify which denominator was used in internal executive reports.',
    ],
    relatedArticleSlugs: ['fundamentals-of-marketing-measurement'],
  },
  {
    id: 'art-seo-1',
    slug: 'measuring-organic-search-efficiency-beyond-rankings',
    title: 'Measuring Organic Search Efficiency Beyond Raw Keyword Rankings',
    category: 'SEO',
    difficulty: 'Intermediate',
    readTimeMinutes: 7,
    shortDescription:
      'Why ranking #1 for vanity keywords does not equal revenue, and how to track commercial search intent and organic assisted conversions.',
    content: `Traditional SEO reporting focused heavily on average keyword rank. In modern search environments dominated by AI overviews, rich snippets, and local map packs, position rankings alone fail to reflect revenue impact.

### Evaluating Commercial Search Intent
Search queries fall into four discrete buckets:
1. **Informational**: "How to exfoliate skin" (High volume, low immediate purchase intent).
2. **Navigational**: "GlowBiome login" (Brand search).
3. **Commercial Investigation**: "Best vitamin C serum for sensitive skin" (High buying intent, comparison stage).
4. **Transactional**: "Buy 20% vitamin C serum online free shipping" (Immediate purchase intent).

### Meaningful SEO Metrics
- **Organic Click-Through Rate by Search Query**: Identifying pages with high impressions in Search Console but low CTR to optimize title tags and meta descriptions.
- **Organic Assisted Conversions**: Tracking Multi-Channel Funnel reports in GA4 to measure how many organic search visits eventually converted through email or paid retargeting.`,
    examples: [
      'Ranking #1 for a 50,000-volume broad query yielded 12 orders, while ranking #3 for a 2,000-volume transactional query yielded 94 orders.',
    ],
    relatedCalculators: ['ctr', 'conversion_rate', 'cpl'],
    practicalTips: [
      'Target high-intent comparison search modifiers ("alternative to", "vs", "review").',
      'Audit search query click-through curves in Google Search Console monthly.',
    ],
    relatedArticleSlugs: ['ga4-engagement-rate-vs-ua-bounce-rate'],
  },
  {
    id: 'art-email-1',
    slug: 'modern-email-analytics-apple-privacy-protection',
    title: 'Modern Email Marketing Analytics in the Era of Apple Mail Privacy Protection',
    category: 'Email Marketing',
    difficulty: 'Intermediate',
    readTimeMinutes: 6,
    shortDescription:
      'How Apple MPP pre-fetching distorted open rates, and why Click-to-Delivered and Attributed Revenue are the true email north stars.',
    content: `In 2021, Apple released Mail Privacy Protection (MPP) for iOS and macOS. This privacy feature caches and pre-fetches remote images (including tracking pixels) through proxy servers before the user opens the email.

### The Consequences for Email Marketers
1. **Artificial Open Rate Inflation**: Automated server pre-fetching logs an open event even if the recipient never touches or sees the message.
2. **Distorted Automated Flows**: Re-send campaigns triggered strictly by "Unopened after 48 hours" are no longer statistically reliable on iOS segments.

### The New Email Metric Standard
- **Email Click Rate (Click-to-Delivered)**:
  $$\\text{Click Rate} = \\frac{\\text{Unique Clicks}}{\\text{Delivered Emails}} \\times 100$$
  A verified click represents undeniable human engagement unaffected by proxy pre-fetching.
- **Revenue Per Recipient (RPR)**:
  $$\\text{RPR} = \\frac{\\text{Attributed Email Campaign Revenue}}{\\text{Delivered Emails}}$$
  Measures commercial monetization efficiency across list segments.`,
    examples: [
      'A campaign reporting a 48% open rate on Apple devices had a true human engagement rate of 22%.',
    ],
    relatedCalculators: ['email_open_rate', 'email_click_rate', 'conversion_rate'],
    practicalTips: [
      'Rely on link clicks and purchase events to trigger lifecycle nurture steps.',
      'Clean unengaged contacts who have not clicked a link in 90 days.',
    ],
    relatedArticleSlugs: ['fundamentals-of-marketing-measurement'],
  },
  {
    id: 'art-ecommerce-1',
    slug: 'ecommerce-unit-economics-cac-ltv',
    title: 'The Unit Economics of E-Commerce: CAC, LTV, and the Payback Period',
    category: 'E-commerce Marketing',
    difficulty: 'Advanced',
    readTimeMinutes: 8,
    shortDescription:
      'How to build durable unit economics, balance acquisition burn against repeat orders, and calculate your true allowable CAC.',
    content: `Many venture-backed and bootstrapped e-commerce brands fail not from lack of sales volume, but from broken unit economics where customer acquisition costs swallow all gross margin.

### The Anatomy of an E-Commerce Order
Every dollar of top-line revenue must absorb:
- Product Cost of Goods Sold (COGS): Typically 20%–35%
- Merchant Processing Fees: 2.9% + $0.30
- Pick, Pack & Shipping: 10%–15%
- Blended Customer Acquisition Cost (CAC): 25%–45%
- Net Operating Profit: The remaining sliver

### LTV:CAC and Payback Period
- **LTV:CAC Ratio**: Target a minimum of 3:1 on a gross profit basis. If your LTV is $150 in gross margin, your CAC should not exceed $50.
- **Payback Period**: How many days or repeat orders are required to recoup CAC. Brands with payback periods exceeding 90 days suffer severe cash flow strain unless backed by substantial working capital.`,
    examples: [
      'A DTC brand with a $60 AOV, 60% gross margin ($36), and $42 CAC loses $6 on the first order, requiring a second order within 60 days to break even.',
    ],
    relatedCalculators: ['cac', 'clv_ltv', 'cpa', 'roi', 'roas'],
    practicalTips: [
      'Calculate LTV strictly using Gross Profit, never top-line revenue.',
      'Deploy post-purchase email onboarding sequences to accelerate repeat order velocity within the first 30 days.',
    ],
    relatedArticleSlugs: ['fundamentals-of-marketing-measurement'],
  },
  {
    id: 'art-analytics-1',
    slug: 'ga4-engagement-rate-vs-ua-bounce-rate',
    title: 'GA4 Engagement Rate vs. Universal Analytics Bounce Rate: The Structural Shift',
    category: 'Marketing Analytics',
    difficulty: 'Intermediate',
    readTimeMinutes: 7,
    shortDescription:
      'Understanding Google Analytics 4 event-based measurement model and how engaged sessions replaced legacy bounce rate.',
    content: `When Google retired Universal Analytics (UA) in favor of Google Analytics 4 (GA4), it fundamentally overhauled how visitor engagement is measured.

### The Flaw in Legacy Universal Analytics Bounce Rate
In Universal Analytics, a bounce occurred whenever a visitor triggered only one hit (pageview) in a session, regardless of how long they stayed. If a visitor spent 15 minutes reading a complete article and left satisfied, UA counted it as a 100% bounce.

### The GA4 Engaged Session Model
In GA4, a session is classified as an **Engaged Session** if it meets at least one of these criteria:
1. Lasts 10 seconds or longer.
2. Contains 2 or more page views or screen views.
3. Contains at least 1 conversion event.

### GA4 Bounce Rate Defined
In GA4, Bounce Rate is mathematically the inverse of Engagement Rate:
$$\\text{Bounce Rate (GA4)} = (100 - \\text{Engagement Rate})\\%$$
$$\\text{Bounce Rate} = \\left(\\frac{\\text{Non-Engaged Sessions}}{\\text{Total Sessions}}\\right) \\times 100$$
This metric now accurately represents visitors who arrived and left without interacting meaningfully.`,
    examples: [
      'A blog post with a 75% bounce rate in UA might show a 25% bounce rate (75% engagement rate) in GA4 because readers spent 2 minutes consuming the text.',
    ],
    relatedCalculators: ['bounce_rate', 'conversion_rate', 'ctr'],
    practicalTips: [
      'Customize the GA4 session engagement timer threshold up to 30 seconds if your articles require deeper reading.',
      'Track custom scroll depth events (50%, 75%, 90%) to diagnose exact drop-off locations.',
    ],
    relatedArticleSlugs: ['measuring-organic-search-efficiency-beyond-rankings'],
  },
  {
    id: 'art-cro-1',
    slug: 'statistical-significance-cro',
    title: 'Conversion Rate Optimization (CRO): Statistical Significance and High-Leverage Tests',
    category: 'Conversion Rate Optimization',
    difficulty: 'Advanced',
    readTimeMinutes: 8,
    shortDescription:
      'How to run valid A/B tests, avoid premature victory declarations, and focus on high-impact offer changes over trivial button colors.',
    content: `Conversion Rate Optimization (CRO) is frequently ruined by premature test termination and trivial changes (e.g. testing orange vs. green buttons on low-traffic sites).

### The Math of Statistical Significance
To know whether Variation B genuinely outperformed Variation A, you must achieve a 95% statistical confidence level ($p < 0.05$). This requires:
1. Adequate sample size (typically hundreds of conversions per variant, not 12 conversions).
2. Complete business cycle testing (running for full 7-day or 14-day cycles to capture weekend vs. weekday variations).

### High-Leverage vs. Low-Leverage Testing
- **Low-Leverage**: Changing button radius from 4px to 8px, minor font weight tweaks.
- **High-Leverage**:
  - Overhauling the core value proposition headline.
  - Adding unedited user testimonial videos directly beside the checkout CTA.
  - Introducing risk-reversal guarantees (e.g. 60-day unconditional refund).
  - Streamlining checkout from 4 pages to a single page with Apple Pay.`,
    examples: [
      'A test declaring variant B a winner after 40 clicks reverted to baseline after 1,000 visitors: Sample size error.',
    ],
    relatedCalculators: ['conversion_rate', 'cpa', 'ctr'],
    practicalTips: [
      'Never terminate an A/B test before it has run for at least two full calendar weeks.',
      'Use a sample size calculator before launching any split test to determine required traffic.',
    ],
    relatedArticleSlugs: ['fundamentals-of-marketing-measurement'],
  },
];

export const VERIFIED_BENCHMARKS: MetricBenchmark[] = [
  {
    id: 'bench-google-search-cpc',
    metricId: 'cpc',
    metricName: 'Cost Per Click (CPC)',
    industry: 'Cross-Industry Average',
    region: 'United States',
    platform: 'Google Search Ads',
    averageValue: '$4.22',
    rangeLow: '$1.40 (E-Commerce)',
    rangeHigh: '$9.21 (Legal / B2B SaaS)',
    methodology: 'Search ad auction spend divided by clicks across 17,000+ active US campaigns.',
    source: 'LocaliQ / WordStream Search Advertising Benchmarks',
    sourceUrl: 'https://localiq.com/blog/google-ads-benchmarks/',
    publishedDate: '2025-2026',
    reportingPeriod: 'Full Year Multi-Industry Benchmark',
    notes: 'Legal, B2B SaaS, and Financial Services record highest CPCs; apparel and consumer goods lowest.',
  },
  {
    id: 'bench-meta-ctr',
    metricId: 'ctr',
    metricName: 'Click-Through Rate (CTR)',
    industry: 'E-commerce & Retail',
    region: 'North America',
    platform: 'Meta Ads (Facebook & Instagram Feed)',
    averageValue: '1.42%',
    rangeLow: '0.80%',
    rangeHigh: '2.50%',
    methodology: 'Link clicks divided by ad impressions across retail feed placements.',
    source: 'WordStream Facebook Ad Benchmarks',
    sourceUrl: 'https://www.wordstream.com/blog/ws/2021/07/12/facebook-ad-benchmarks',
    publishedDate: '2025',
    reportingPeriod: 'Annual Performance Review',
    notes: 'Video Reels and unboxing carousels consistently outperform static image single-ads.',
  },
  {
    id: 'bench-email-open-rate',
    metricId: 'email_open_rate',
    metricName: 'Email Open Rate',
    industry: 'Consumer Brands & E-commerce',
    region: 'Global',
    platform: 'Klaviyo / ESP Ecosystem',
    averageValue: '38.5%',
    rangeLow: '28.0%',
    rangeHigh: '48.0%',
    methodology: 'Unique open events divided by delivered messages. Note: Inflated by Apple MPP caching.',
    source: 'Klaviyo Email Marketing Benchmarks Report',
    sourceUrl: 'https://www.klaviyo.com/marketing-resources/email-benchmarks',
    publishedDate: '2025-2026',
    reportingPeriod: 'H2 Reporting Cohort',
    notes: 'Post-Apple MPP rates reflect machine proxy caching; marketers should prioritize click rates.',
  },
  {
    id: 'bench-ecommerce-cvr',
    metricId: 'conversion_rate',
    metricName: 'E-Commerce Conversion Rate',
    industry: 'Direct-to-Consumer (DTC)',
    region: 'United States & Europe',
    platform: 'Shopify Storefronts',
    averageValue: '2.40%',
    rangeLow: '1.20%',
    rangeHigh: '3.80%',
    methodology: 'Completed purchases divided by total unique visitor sessions.',
    source: 'Shopify Commerce Analytics Report',
    sourceUrl: 'https://www.shopify.com/blog/conversion-rate-benchmarks',
    publishedDate: '2025',
    reportingPeriod: 'Annual Global Merchant Benchmark',
    notes: 'Conversion rate varies heavily by traffic temperature: remarketing converts at 5%+, cold social at 1.2%.',
  },
  {
    id: 'bench-meta-cpm',
    metricId: 'cpm',
    metricName: 'Cost Per Thousand Impressions (CPM)',
    industry: 'Consumer Goods & Retail',
    region: 'United States',
    platform: 'Meta Ads (Advantage+ Audience)',
    averageValue: '$18.50',
    rangeLow: '$12.00 (Q1 Post-Holiday)',
    rangeHigh: '$34.00 (Q4 BFCM Peak)',
    methodology: 'Total spend divided by thousand ad displays across Meta ad ecosystem.',
    source: 'Gupta Media Ad Rate Tracker',
    sourceUrl: 'https://www.guptamedia.com/facebook-cpm-tracker/',
    publishedDate: '2025-2026',
    reportingPeriod: 'Quarterly Seasonal Tracker',
    notes: 'CPMs spike heavily between November 15 and December 24 due to retail bidding density.',
  },
];

export class MetricsService {
  /**
   * Retrieves metric definition by ID.
   */
  public getMetricDefinition(id: MetricId): MetricDefinition | undefined {
    return METRIC_DEFINITIONS[id];
  }

  /**
   * Retrieves all metric definitions.
   */
  public getAllMetricDefinitions(): MetricDefinition[] {
    return Object.values(METRIC_DEFINITIONS);
  }

  /**
   * Retrieves metrics filtered by category.
   */
  public getMetricsByCategory(category: MetricCategory): MetricDefinition[] {
    return Object.values(METRIC_DEFINITIONS).filter((m) => m.category === category);
  }

  // =========================================================================
  // CALCULATOR ENGINES WITH ZERO-DENOMINATOR & BOUNDARY PROTECTION
  // =========================================================================

  public calculateCTR(clicks: number, impressions: number): CalculationOutcome {
    if (clicks < 0 || impressions < 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: '%',
        isZeroDenominator: false,
        errorReason: 'Clicks and impressions cannot be negative.',
        status: 'boundary_error',
        interpretation: 'Please enter valid non-negative values.',
      };
    }
    if (impressions === 0) {
      return {
        value: null,
        formatted: 'Undefined (0 Impressions)',
        unit: '%',
        isZeroDenominator: true,
        errorReason: 'Division by zero is undefined. Ad impressions must be greater than zero.',
        status: 'zero_denominator',
        interpretation: 'CTR cannot be calculated without verified ad impressions.',
      };
    }
    if (clicks > impressions) {
      return {
        value: null,
        formatted: 'Boundary Error',
        unit: '%',
        isZeroDenominator: false,
        errorReason: 'Ad clicks cannot exceed total impressions.',
        status: 'boundary_error',
        interpretation: 'Total clicks cannot be greater than the number of times the ad was displayed.',
      };
    }

    const val = Number(((clicks / impressions) * 100).toFixed(2));
    return {
      value: val,
      formatted: `${val.toFixed(2)}%`,
      unit: '%',
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `${val}% of people who viewed the ad clicked through.`,
    };
  }

  public calculateCPC(adSpend: number, clicks: number, currency: string = '$'): CalculationOutcome {
    if (adSpend < 0 || clicks < 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: currency,
        isZeroDenominator: false,
        errorReason: 'Spend and clicks cannot be negative.',
        status: 'boundary_error',
        interpretation: 'Please enter valid positive values.',
      };
    }
    if (clicks === 0) {
      return {
        value: null,
        formatted: 'Undefined (0 Clicks)',
        unit: currency,
        isZeroDenominator: true,
        errorReason: 'Division by zero is undefined. Ad clicks must be greater than zero.',
        status: 'zero_denominator',
        interpretation: 'Cost per click is undefined until the first ad click is registered.',
      };
    }

    const val = Number((adSpend / clicks).toFixed(2));
    return {
      value: val,
      formatted: `${currency}${val.toFixed(2)}`,
      unit: currency,
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `You pay an average of ${currency}${val.toFixed(2)} for every visitor who clicks your ad.`,
    };
  }

  public calculateCPM(adSpend: number, impressions: number, currency: string = '$'): CalculationOutcome {
    if (adSpend < 0 || impressions < 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: currency,
        isZeroDenominator: false,
        errorReason: 'Spend and impressions cannot be negative.',
        status: 'boundary_error',
        interpretation: 'Please enter non-negative values.',
      };
    }
    if (impressions === 0) {
      return {
        value: null,
        formatted: 'Undefined (0 Impressions)',
        unit: currency,
        isZeroDenominator: true,
        errorReason: 'Division by zero is undefined. Impressions must be greater than zero.',
        status: 'zero_denominator',
        interpretation: 'CPM requires at least one impression to calculate.',
      };
    }

    const val = Number(((adSpend / impressions) * 1000).toFixed(2));
    return {
      value: val,
      formatted: `${currency}${val.toFixed(2)}`,
      unit: currency,
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `It costs ${currency}${val.toFixed(2)} to secure 1,000 ad impressions in this placement.`,
    };
  }

  public calculateCPA(
    cost: number,
    conversions: number,
    scope: CpaCostScope,
    currency: string = '$'
  ): CalculationOutcome {
    if (cost < 0 || conversions < 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: currency,
        isZeroDenominator: false,
        errorReason: 'Cost and conversions cannot be negative.',
        status: 'boundary_error',
        interpretation: 'Please enter valid non-negative numbers.',
      };
    }
    if (conversions === 0) {
      return {
        value: null,
        formatted: 'Undefined (0 Conversions)',
        unit: currency,
        isZeroDenominator: true,
        errorReason: 'Division by zero is undefined. Conversions must be greater than zero.',
        status: 'zero_denominator',
        interpretation: 'CPA is undefined until at least one target action occurs.',
      };
    }

    const val = Number((cost / conversions).toFixed(2));
    const scopeLabel = scope === 'ad_spend_only' ? 'Direct Ad Spend' : 'Total Campaign Cost';
    return {
      value: val,
      formatted: `${currency}${val.toFixed(2)}`,
      unit: currency,
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `Based on ${scopeLabel}, each target acquisition costs ${currency}${val.toFixed(2)}.`,
    };
  }

  public calculateFrequency(impressions: number, reach: number): CalculationOutcome {
    if (impressions < 0 || reach < 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: 'views/user',
        isZeroDenominator: false,
        errorReason: 'Impressions and reach cannot be negative.',
        status: 'boundary_error',
        interpretation: 'Please enter valid non-negative reach and impression counts.',
      };
    }
    if (reach === 0) {
      return {
        value: null,
        formatted: 'Undefined (0 Reach)',
        unit: 'views/user',
        isZeroDenominator: true,
        errorReason: 'Division by zero is undefined. Unique reach must be greater than zero.',
        status: 'zero_denominator',
        interpretation: 'Frequency requires a non-zero unique reach count.',
      };
    }
    if (impressions < reach) {
      return {
        value: null,
        formatted: 'Boundary Error',
        unit: 'views/user',
        isZeroDenominator: false,
        errorReason: 'Impressions cannot be fewer than unique reach (each person seen at least once).',
        status: 'boundary_error',
        interpretation: 'Total impressions must be greater than or equal to unique reach.',
      };
    }

    const val = Number((impressions / reach).toFixed(2));
    return {
      value: val,
      formatted: `${val.toFixed(2)} views/user`,
      unit: 'views/user',
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `Each unique individual saw your ad an average of ${val} times.`,
    };
  }

  public calculateEngagementRate(
    engagements: number,
    denominatorValue: number,
    denominatorType: EngagementDenominator
  ): CalculationOutcome {
    if (engagements < 0 || denominatorValue < 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: '%',
        isZeroDenominator: false,
        errorReason: 'Engagements and audience size cannot be negative.',
        status: 'boundary_error',
        interpretation: 'Please enter valid positive counts.',
      };
    }
    if (denominatorValue === 0) {
      return {
        value: null,
        formatted: `Undefined (0 ${denominatorType})`,
        unit: '%',
        isZeroDenominator: true,
        errorReason: `Division by zero is undefined. Selected denominator (${denominatorType}) must be greater than zero.`,
        status: 'zero_denominator',
        interpretation: `Engagement rate requires a non-zero ${denominatorType} denominator.`,
      };
    }

    const val = Number(((engagements / denominatorValue) * 100).toFixed(2));
    return {
      value: val,
      formatted: `${val.toFixed(2)}%`,
      unit: '%',
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `Engagement rate is ${val}% based on total ${denominatorType}.`,
    };
  }

  public calculateVideoCompletionRate(starts: number, completions: number): CalculationOutcome {
    if (starts < 0 || completions < 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: '%',
        isZeroDenominator: false,
        errorReason: 'Starts and completions cannot be negative.',
        status: 'boundary_error',
        interpretation: 'Please enter non-negative video counts.',
      };
    }
    if (starts === 0) {
      return {
        value: null,
        formatted: 'Undefined (0 Starts)',
        unit: '%',
        isZeroDenominator: true,
        errorReason: 'Division by zero is undefined. Video starts must be greater than zero.',
        status: 'zero_denominator',
        interpretation: 'Completion rate cannot be calculated without video starts.',
      };
    }
    if (completions > starts) {
      return {
        value: null,
        formatted: 'Boundary Error',
        unit: '%',
        isZeroDenominator: false,
        errorReason: 'Completions cannot exceed total video starts.',
        status: 'boundary_error',
        interpretation: 'The number of people finishing a video cannot exceed those who began.',
      };
    }

    const val = Number(((completions / starts) * 100).toFixed(2));
    return {
      value: val,
      formatted: `${val.toFixed(2)}%`,
      unit: '%',
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `${val}% of viewers who started the video watched it to completion.`,
    };
  }

  public calculateCPL(cost: number, leads: number, currency: string = '$'): CalculationOutcome {
    if (cost < 0 || leads < 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: currency,
        isZeroDenominator: false,
        errorReason: 'Cost and leads cannot be negative.',
        status: 'boundary_error',
        interpretation: 'Please enter positive numbers.',
      };
    }
    if (leads === 0) {
      return {
        value: null,
        formatted: 'Undefined (0 Leads)',
        unit: currency,
        isZeroDenominator: true,
        errorReason: 'Division by zero is undefined. Number of leads must be greater than zero.',
        status: 'zero_denominator',
        interpretation: 'CPL is undefined until at least one lead has been acquired.',
      };
    }

    const val = Number((cost / leads).toFixed(2));
    return {
      value: val,
      formatted: `${currency}${val.toFixed(2)}`,
      unit: currency,
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `You pay an average of ${currency}${val.toFixed(2)} to capture one qualified lead.`,
    };
  }

  public calculateConversionRate(
    conversions: number,
    denominatorValue: number,
    denominatorType: ConversionDenominator
  ): CalculationOutcome {
    if (conversions < 0 || denominatorValue < 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: '%',
        isZeroDenominator: false,
        errorReason: 'Conversions and traffic volume cannot be negative.',
        status: 'boundary_error',
        interpretation: 'Please enter positive values.',
      };
    }
    if (denominatorValue === 0) {
      return {
        value: null,
        formatted: `Undefined (0 ${denominatorType})`,
        unit: '%',
        isZeroDenominator: true,
        errorReason: `Division by zero is undefined. ${denominatorType} must be greater than zero.`,
        status: 'zero_denominator',
        interpretation: `Conversion rate requires at least one ${denominatorType.slice(0, -1)} to measure.`,
      };
    }
    if (conversions > denominatorValue) {
      return {
        value: null,
        formatted: 'Boundary Error',
        unit: '%',
        isZeroDenominator: false,
        errorReason: `Conversions cannot exceed total ${denominatorType}.`,
        status: 'boundary_error',
        interpretation: 'Converted actions cannot outnumber total incoming traffic volume.',
      };
    }

    const val = Number(((conversions / denominatorValue) * 100).toFixed(2));
    return {
      value: val,
      formatted: `${val.toFixed(2)}%`,
      unit: '%',
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `${val}% of ${denominatorType} completed the target conversion action.`,
    };
  }

  public calculateROAS(revenue: number, adSpend: number): CalculationOutcome {
    if (revenue < 0 || adSpend < 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: 'x',
        isZeroDenominator: false,
        errorReason: 'Revenue and ad spend cannot be negative.',
        status: 'boundary_error',
        interpretation: 'Please enter non-negative revenue and spend amounts.',
      };
    }
    if (adSpend === 0) {
      return {
        value: null,
        formatted: 'Undefined (0 Ad Spend)',
        unit: 'x',
        isZeroDenominator: true,
        errorReason: 'Division by zero is undefined. Paid ad spend must be greater than zero.',
        status: 'zero_denominator',
        interpretation: 'ROAS cannot be calculated for organic traffic without paid advertising expenditure.',
      };
    }

    const val = Number((revenue / adSpend).toFixed(2));
    return {
      value: val,
      formatted: `${val.toFixed(2)}x`,
      unit: 'x',
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `Every $1.00 spent on advertising generated $${val.toFixed(2)} in gross attributed revenue.`,
    };
  }

  public calculateROI(revenueReturn: number, totalInvestment: number): CalculationOutcome {
    if (totalInvestment <= 0) {
      return {
        value: null,
        formatted: 'Undefined (0 Investment)',
        unit: '%',
        isZeroDenominator: true,
        errorReason: 'Total Investment cannot be zero or negative.',
        status: 'zero_denominator',
        interpretation: 'ROI requires deployed capital to measure financial return.',
      };
    }

    const val = Number((((revenueReturn - totalInvestment) / totalInvestment) * 100).toFixed(2));
    return {
      value: val,
      formatted: `${val > 0 ? '+' : ''}${val.toFixed(2)}%`,
      unit: '%',
      isZeroDenominator: false,
      status: 'valid',
      interpretation:
        val >= 0
          ? `Net return on investment is positive (+${val}%). Capital has grown.`
          : `Net return on investment is negative (${val}%). Campaign lost capital after accounting for all expenses.`,
    };
  }

  public calculateCAC(totalCosts: number, newCustomers: number, currency: string = '$'): CalculationOutcome {
    if (totalCosts < 0 || newCustomers < 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: currency,
        isZeroDenominator: false,
        errorReason: 'Acquisition costs and customer count cannot be negative.',
        status: 'boundary_error',
        interpretation: 'Please enter positive numbers.',
      };
    }
    if (newCustomers === 0) {
      return {
        value: null,
        formatted: 'Undefined (0 Customers)',
        unit: currency,
        isZeroDenominator: true,
        errorReason: 'Division by zero is undefined. New customers acquired must be greater than zero.',
        status: 'zero_denominator',
        interpretation: 'CAC is undefined until at least one customer is acquired.',
      };
    }

    const val = Number((totalCosts / newCustomers).toFixed(2));
    return {
      value: val,
      formatted: `${currency}${val.toFixed(2)}`,
      unit: currency,
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `It costs an average of ${currency}${val.toFixed(2)} across all sales and marketing efforts to acquire one new paying customer.`,
    };
  }

  public calculateLTV(
    aov: number,
    purchaseFrequencyYear: number,
    lifespanYears: number,
    grossMarginPct?: number,
    currency: string = '$'
  ): CalculationOutcome {
    if (aov <= 0 || purchaseFrequencyYear <= 0 || lifespanYears <= 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: currency,
        isZeroDenominator: false,
        errorReason: 'AOV, purchase frequency, and customer lifespan must be greater than zero.',
        status: 'boundary_error',
        interpretation: 'Please enter positive numbers for all customer lifetime parameters.',
      };
    }

    const revenueLtv = aov * purchaseFrequencyYear * lifespanYears;
    let finalVal = revenueLtv;
    let label = 'Revenue-Based LTV';

    if (grossMarginPct !== undefined && grossMarginPct > 0) {
      finalVal = revenueLtv * (grossMarginPct / 100);
      label = 'Gross-Profit-Based LTV';
    }

    const val = Number(finalVal.toFixed(2));
    return {
      value: val,
      formatted: `${currency}${val.toFixed(2)}`,
      unit: currency,
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `${label} is estimated at ${currency}${val.toFixed(2)} per customer over ${lifespanYears} years.`,
    };
  }

  public calculateBounceRate(nonEngagedSessions: number, totalSessions: number): CalculationOutcome {
    if (nonEngagedSessions < 0 || totalSessions < 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: '%',
        isZeroDenominator: false,
        errorReason: 'Session counts cannot be negative.',
        status: 'boundary_error',
        interpretation: 'Please enter valid non-negative session numbers.',
      };
    }
    if (totalSessions === 0) {
      return {
        value: null,
        formatted: 'Undefined (0 Sessions)',
        unit: '%',
        isZeroDenominator: true,
        errorReason: 'Division by zero is undefined. Total sessions must be greater than zero.',
        status: 'zero_denominator',
        interpretation: 'Bounce rate requires traffic sessions to measure.',
      };
    }
    if (nonEngagedSessions > totalSessions) {
      return {
        value: null,
        formatted: 'Boundary Error',
        unit: '%',
        isZeroDenominator: false,
        errorReason: 'Non-engaged sessions cannot exceed total sessions.',
        status: 'boundary_error',
        interpretation: 'Non-engaged sessions must be less than or equal to total sessions.',
      };
    }

    const val = Number(((nonEngagedSessions / totalSessions) * 100).toFixed(2));
    const engagementRate = (100 - val).toFixed(2);
    return {
      value: val,
      formatted: `${val.toFixed(2)}%`,
      unit: '%',
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `GA4 Bounce Rate is ${val}%. The remaining ${engagementRate}% of sessions were Engaged Sessions (10+ seconds, 2+ views, or converted).`,
    };
  }

  public calculateEmailOpenRate(uniqueOpens: number, deliveredEmails: number): CalculationOutcome {
    if (uniqueOpens < 0 || deliveredEmails < 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: '%',
        isZeroDenominator: false,
        errorReason: 'Opens and delivered emails cannot be negative.',
        status: 'boundary_error',
        interpretation: 'Please enter non-negative email counts.',
      };
    }
    if (deliveredEmails === 0) {
      return {
        value: null,
        formatted: 'Undefined (0 Delivered)',
        unit: '%',
        isZeroDenominator: true,
        errorReason: 'Division by zero is undefined. Delivered emails must be greater than zero.',
        status: 'zero_denominator',
        interpretation: 'Open rate cannot be calculated without delivered emails.',
      };
    }
    if (uniqueOpens > deliveredEmails) {
      return {
        value: null,
        formatted: 'Boundary Error',
        unit: '%',
        isZeroDenominator: false,
        errorReason: 'Unique opens cannot exceed delivered emails.',
        status: 'boundary_error',
        interpretation: 'Unique opens cannot be greater than the count of delivered messages.',
      };
    }

    const val = Number(((uniqueOpens / deliveredEmails) * 100).toFixed(2));
    return {
      value: val,
      formatted: `${val.toFixed(2)}%`,
      unit: '%',
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `${val}% of delivered subscribers opened this message (subject to Apple MPP caching caveats).`,
    };
  }

  public calculateEmailClickRate(uniqueClicks: number, deliveredEmails: number): CalculationOutcome {
    if (uniqueClicks < 0 || deliveredEmails < 0) {
      return {
        value: null,
        formatted: 'Invalid Input',
        unit: '%',
        isZeroDenominator: false,
        errorReason: 'Clicks and delivered emails cannot be negative.',
        status: 'boundary_error',
        interpretation: 'Please enter non-negative email counts.',
      };
    }
    if (deliveredEmails === 0) {
      return {
        value: null,
        formatted: 'Undefined (0 Delivered)',
        unit: '%',
        isZeroDenominator: true,
        errorReason: 'Division by zero is undefined. Delivered emails must be greater than zero.',
        status: 'zero_denominator',
        interpretation: 'Email click rate requires delivered emails to calculate.',
      };
    }
    if (uniqueClicks > deliveredEmails) {
      return {
        value: null,
        formatted: 'Boundary Error',
        unit: '%',
        isZeroDenominator: false,
        errorReason: 'Unique clicks cannot exceed delivered emails.',
        status: 'boundary_error',
        interpretation: 'Unique clicking subscribers cannot exceed delivered recipients.',
      };
    }

    const val = Number(((uniqueClicks / deliveredEmails) * 100).toFixed(2));
    return {
      value: val,
      formatted: `${val.toFixed(2)}%`,
      unit: '%',
      isZeroDenominator: false,
      status: 'valid',
      interpretation: `${val}% of all delivered recipients clicked at least one link inside this email.`,
    };
  }

  // =========================================================================
  // PERSISTENCE & HISTORY
  // =========================================================================

  public getSavedCalculations(): MetricCalculationRecord[] {
    try {
      const raw = localStorage.getItem(CALCULATIONS_STORAGE_KEY);
      if (!raw) return this.getDefaultSavedCalculations();
      return JSON.parse(raw);
    } catch (e) {
      return this.getDefaultSavedCalculations();
    }
  }

  public saveCalculation(record: Omit<MetricCalculationRecord, 'id' | 'timestamp'>): MetricCalculationRecord {
    const list = this.getSavedCalculations();
    const newRecord: MetricCalculationRecord = {
      ...record,
      id: `calc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };

    const updated = [newRecord, ...list];
    localStorage.setItem(CALCULATIONS_STORAGE_KEY, JSON.stringify(updated));
    return newRecord;
  }

  public deleteCalculation(id: string): void {
    const list = this.getSavedCalculations().filter((c) => c.id !== id);
    localStorage.setItem(CALCULATIONS_STORAGE_KEY, JSON.stringify(list));
  }

  public clearAllCalculations(): void {
    localStorage.removeItem(CALCULATIONS_STORAGE_KEY);
  }

  /**
   * Export saved metric calculations to CSV with formula injection defense
   */
  public exportCalculationsCsv(): string {
    const list = this.getSavedCalculations();
    const headers = [
      'ID',
      'Timestamp',
      'Metric Name',
      'Category',
      'Result',
      'Unit',
      'Currency',
      'Project',
      'Status',
      'Inputs',
    ];

    const rows = list.map((c) => [
      securityService.formatCsvCell(c.id),
      securityService.formatCsvCell(c.timestamp),
      securityService.formatCsvCell(c.metricName),
      securityService.formatCsvCell(c.category),
      securityService.formatCsvCell(c.resultValue ?? 'N/A'),
      securityService.formatCsvCell(c.unit),
      securityService.formatCsvCell(c.currency || 'N/A'),
      securityService.formatCsvCell(c.projectName || 'General'),
      securityService.formatCsvCell(c.status),
      securityService.formatCsvCell(JSON.stringify(c.inputs)),
    ]);

    return [headers.map((h) => securityService.formatCsvCell(h)).join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public exportCalculationsJson(): string {
    return JSON.stringify(this.getSavedCalculations(), null, 2);
  }

  private getDefaultSavedCalculations(): MetricCalculationRecord[] {
    return [
      {
        id: 'calc-ref-1',
        metricId: 'roas',
        metricName: 'Return On Ad Spend (ROAS)',
        category: 'Revenue & Profitability',
        timestamp: '2026-11-13T09:30:00.000Z',
        inputs: { 'Attributed Revenue': 18500, 'Ad Spend': 4200 },
        resultValue: 4.4,
        formattedResult: '4.40x',
        unit: 'x',
        currency: 'USD',
        projectId: 'proj-vitamin-c',
        projectName: 'GlowBiome Organics',
        isZeroDenominator: false,
        status: 'valid',
        notes: 'Meta Advantage+ campaign Q4 baseline test.',
      },
      {
        id: 'calc-ref-2',
        metricId: 'cpc',
        metricName: 'Cost Per Click (CPC)',
        category: 'Advertising & Campaigns',
        timestamp: '2026-11-13T10:15:00.000Z',
        inputs: { 'Advertising Spend': 2400, Clicks: 1350 },
        resultValue: 1.78,
        formattedResult: '$1.78',
        unit: '$',
        currency: 'USD',
        projectId: 'proj-vitamin-c',
        projectName: 'GlowBiome Organics',
        isZeroDenominator: false,
        status: 'valid',
        notes: 'Google Search exact match keyword cluster.',
      },
      {
        id: 'calc-ref-3',
        metricId: 'conversion_rate',
        metricName: 'Conversion Rate (CVR)',
        category: 'Lead Generation',
        timestamp: '2026-11-13T11:00:00.000Z',
        inputs: { Conversions: 120, 'Selected Denominator (Sessions)': 3800 },
        resultValue: 3.16,
        formattedResult: '3.16%',
        unit: '%',
        currency: 'USD',
        projectId: 'proj-vitamin-c',
        projectName: 'GlowBiome Organics',
        isZeroDenominator: false,
        status: 'valid',
        notes: 'DTC landing page checkout funnel.',
      },
    ];
  }

  // =========================================================================
  // KNOWLEDGE CENTER & BENCHMARK RETRIEVAL
  // =========================================================================

  public getKnowledgeArticles(searchQuery?: string, category?: string): MetricKnowledgeArticle[] {
    let list = KNOWLEDGE_ARTICLES;

    if (category && category !== 'All') {
      list = list.filter((a) => a.category === category);
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.shortDescription.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public getArticleBySlug(slug: string): MetricKnowledgeArticle | undefined {
    return KNOWLEDGE_ARTICLES.find((a) => a.slug === slug);
  }

  public getVerifiedBenchmarks(metricId?: MetricId): MetricBenchmark[] {
    if (!metricId) return VERIFIED_BENCHMARKS;
    return VERIFIED_BENCHMARKS.filter((b) => b.metricId === metricId);
  }
}

export const metricsService = new MetricsService();
