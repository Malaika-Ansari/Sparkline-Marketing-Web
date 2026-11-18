/**
 * SPARKLINE MARKETING — AI STRATEGY SERVICE
 * Client-side persistence and API communication layer for Phase 07.
 */

import { MarketingProject } from '@/types/project';
import {
  GeneratedMarketingStrategy,
  StrategyApproachType,
} from '@/types/strategy';
import { ApiClient } from './api-client';

const STORAGE_KEY = 'sparkline_marketing_strategies';

export interface AiStatusResponse {
  isConfigured: boolean;
  provider: string;
  model: string;
  message?: string;
}

// Pre-seeded high-fidelity demonstration strategies
const DEMO_STRATEGIES: GeneratedMarketingStrategy[] = [
  {
    id: 'strat-vitamin-c-001',
    projectId: 'proj-vitamin-c',
    projectName: 'GlowBiome Organics',
    version: 1,
    createdAt: '2026-11-12T14:30:00.000Z',
    modelIdentifier: 'Reference Blueprint (Verified Schema)',
    status: 'Completed',
    executiveSummary:
      'GlowBiome Organics holds a strong unit-economic position with a 71% gross margin on its flagship Organic Vitamin C Glow Serum ($58 retail vs. $16.80 COGS). The brand’s primary strategic imperative is customer acquisition cost (CAC) containment in a crowded direct-to-consumer skincare market. By anchoring messaging around clinical 20% potency stabilized with ferulic acid—overcoming consumer skepticism regarding oxidation and synthetic fillers—the brand can capture high-intent buyers via Google Search while deploying short-form educational creative on Meta and TikTok to build problem-aware consideration.',
    businessAnalysis: {
      businessModel: 'Direct-to-Consumer (D2C) E-Commerce',
      industryContext:
        'Beauty & Personal Care / Clean Cosmeceuticals ($14B global market expanding at 9.2% CAGR)',
      stageAnalysis: 'Growing / Scaling initial validation to repeatable acquisition',
      strengths: [
        'Robust 71% gross margin offering healthy CAC buffer',
        'Stabilized active formulation (ferulic acid) solving category oxidation complaints',
        'Direct customer relationship and first-party margin control',
      ],
      limitations: [
        'High competitive noise from luxury legacy brands and budget conglomerates',
        'Customer trust friction regarding clinical efficacy claims in clean beauty',
        'Rising ad auction CPMs across Meta platforms',
      ],
      featuresVsBenefits: [
        {
          feature: '20% active L-Ascorbic Acid stabilized with 0.5% Ferulic Acid',
          customerBenefit:
            'Delivers rapid clinical dark spot fading without oxidization or turning yellow on the skin',
        },
        {
          feature: 'Certified organic botanical base with prebiotic oat extract',
          customerBenefit:
            'Calms sensitive skin barriers and eliminates burning or stinging common in conventional serums',
        },
        {
          feature: 'Airtight amber glass dropper bottle with nitrogen flush sealing',
          customerBenefit:
            'Guarantees potency and freshness for 12 months rather than degrading in 30 days',
        },
      ],
      uniqueSellingProposition:
        'Clinical 20% stabilized active potency at an accessible direct-to-consumer price point without synthetic fillers or fragrance.',
      pricingAssessment:
        '$58 retail sits squarely between mass drugstore ($15-$25) and prestige dermatological brands ($120-$185), representing an optimal value proposition.',
      productMarketFitConsiderations:
        'Strong resonance among ingredient-conscious millennials; requires visual before-and-after proof to shorten purchase deliberation.',
    },
    audienceAnalysis: {
      userProvidedFacts: [
        'Primary demographic: Ingredient-conscious skincare buyers aged 25-45',
        'Geographic footprint: United States, Canada, and United Kingdom',
        'Purchasing behavior: Research-heavy, reads label ingredient lists carefully',
        'Stated friction points: Serum oxidization, artificial fragrances that sting, luxury brand markup',
      ],
      aiHypotheses: [
        'Buyers frequently experience "skincare routine fatigue" from 8-step regimens and seek a single reliable morning active',
        'High willingness to repurchase on 60-day auto-refill schedules if initial 30-day glow is noticeable',
        'Micro-influencer dermatologist / aesthetician recommendations outweigh celebrity endorsements for this segment',
      ],
      primarySegments: [
        'Clean Cosmeceutical Researchers (Ages 28-42, reads INCI lists)',
        'Hyperpigmentation & Sun Damage Solvers (Ages 30-50, results-driven)',
        'Routine Streamliners (Ages 25-35, professional women wanting simple, effective daily care)',
      ],
      customerNeeds: [
        'Visible brightening of uneven tone and sun spots',
        'Gentle formulation that does not cause redness or stinging',
        'Confidence that active ingredients remain stable through the bottom of the bottle',
      ],
      painPoints: [
        'Frustration with serums turning dark orange/brown after 3 weeks',
        'Allergic flare-ups from synthetic fragrances and essential oils',
        'Disillusionment with $150+ luxury department store pricing',
      ],
      purchaseMotivations: [
        'Achieving makeup-free skin confidence ("clean girl" aesthetic)',
        'Preventative antioxidant protection against environmental pollution and UV damage',
        'Direct relationship with transparent, lab-tested indie brands',
      ],
      buyingBehavior:
        'Research-heavy. Prospects visit 2-4 times, read customer reviews with photos, inspect return policies, and look for ingredient concentrations before checking out.',
      customerObjections: [
        'Will this break me out or cause irritation on sensitive skin?',
        'How do I know this will actually stay fresh longer than my last Vitamin C?',
        'Is the return policy simple if it does not work for my skin type?',
      ],
      communicationApproach:
        'Transparent, educational, and empathetic. Emphasize dermatological evidence, transparent lab tests, and a no-hassle 30-day empty bottle guarantee.',
    },
    messaging: {
      brandPositioning:
        'The clean dermatological alternative that matches $160 department store clinical potency for $58.',
      coreMessage:
        'Clinical 20% Vitamin C that stays fresh to the last drop—formulated for real results without the irritation or luxury markup.',
      valueProposition:
        'Potent, stable antioxidant protection that visibly brightens hyperpigmentation and restores youthful bounce using certified organic botanicals.',
      supportingAngles: [
        {
          angle: 'Stability & Potency Guarantee',
          headline: 'Your Vitamin C Should Not Expire Before You Finish The Bottle',
          hook: 'Most Vitamin C serums oxidize into useless brown liquid within 30 days. GlowBiome stays potent to drop 30.',
          targetPainPoint: 'Oxidation waste and degraded ingredient efficacy',
        },
        {
          angle: 'Clean Clinical Results Without Stinging',
          headline: '20% Strength. 0% Stinging. 100% Glow.',
          hook: 'High potency does not have to mean red, irritated skin. Prebiotic oat calms your skin barrier while pure L-ascorbic acid brightens.',
          targetPainPoint: 'Skin barrier damage and facial stinging',
        },
        {
          angle: 'Fair Luxury Pricing',
          headline: 'Why Pay $160 For department store branding?',
          hook: 'Same active clinical percentage. Cleaner botanical ingredients. Direct to your door for $58.',
          targetPainPoint: 'Excessive department store cosmetic markups',
        },
      ],
      callToActionExamples: [
        'Claim Your 30-Day Fresh Glow Bottle',
        'Shop The 20% Clinical Serum ($58)',
        'Take The 60-Second Skin Diagnostic',
      ],
      brandCommunicationTone:
        'Authoritative yet approachable, transparent, science-backed, and devoid of cosmetic buzzwords.',
    },
    approaches: {
      conservative: {
        approachType: 'conservative',
        name: 'Validated Demand & Search Intent Focus',
        tagline: 'Controlled spend capturing bottom-funnel problem searchers',
        riskLevel: 'Low',
        budgetAllocation: '65% Google Search Ads, 20% Email & SMS retention, 15% SEO content',
        focusAreas: [
          'Capture high-intent queries: "best stable vitamin c serum", "gentle vitamin c 20 percent"',
          'Build automated 5-step post-purchase onboarding flow to drive 60-day re-orders',
          'Publish 10 authoritative INCI ingredient breakdown guides to build compounding organic rank',
        ],
        tradeOffs:
          'Safeguards capital and guarantees lower CAC, but limits top-of-funnel reach and brand recognition speed.',
        projectedTimeline: '90-day demand validation cycle',
      },
      balanced: {
        approachType: 'balanced',
        name: 'Sustainable Multi-Channel Flywheel (Recommended)',
        tagline: 'Blended high-intent capture and visual problem-solution social proof',
        riskLevel: 'Moderate',
        budgetAllocation:
          '40% Meta & TikTok Paid Social, 35% Google Search Ads, 15% Email/SMS Retention, 10% Micro-Creator Seeding',
        focusAreas: [
          'Short-form visual video hooks contrasting oxidized serums vs. GlowBiome clarity',
          'Google Search brand defense and competitor alternative comparison campaigns',
          'Klaviyo retention engine driving 60-day replenishment subscriptions with 15% discount',
          'Gifting 40 aesthetician micro-creators per month for genuine before-and-after reviews',
        ],
        tradeOffs:
          'Requires steady weekly creative testing cadence and active email segment management.',
        projectedTimeline: '180-day growth playbook to $45,000 monthly revenue milestone',
      },
      aggressive: {
        approachType: 'aggressive',
        name: 'Category Dominance & Rapid Scale Sprint',
        tagline: 'Aggressive ad auction expansion across Meta, TikTok, and YouTube Shorts',
        riskLevel: 'High',
        budgetAllocation:
          '65% Meta & TikTok performance ads, 20% Google Performance Max & YouTube, 15% Creator whitelisting',
        focusAreas: [
          'High-volume creative production (8-12 new UGC iterations weekly)',
          'Whitelisting creator accounts for Spark Ads and Dark Posts',
          'Aggressive bundle offerings ($98 duo with daily sunscreen) to lift AOV above $85',
        ],
        tradeOffs:
          'Higher risk of creative fatigue and auction CPM spikes if ad hooks fail to convert.',
        projectedTimeline: '60-day rapid scale sprint',
      },
    },
    recommendedChannels: [
      {
        channelId: 'google_search_ads',
        channelName: 'Google Search Ads',
        priority: 'High',
        suitabilityReason:
          'Directly intercepts consumers with active purchasing intent searching for Vitamin C serum solutions and clean dermatological alternatives.',
        targetAudienceReached: 'Problem-aware buyers comparing specific formulations',
        funnelStage: 'Consideration',
        advantages: [
          'Immediate commercial intent with 3-5x ROAS potential on exact-match queries',
          'Predictable conversion rates on dedicated product landing pages',
          'Clear attribution and fast feedback loops for ad copy optimization',
        ],
        risksAndLimitations: [
          'Competitive CPCs ($2.50 - $4.80) in skincare keywords require tight negative keyword lists',
          'Requires disciplined bid caps to prevent budget drain on generic terms',
        ],
        resourceRequirements: 'Medium',
        suggestedKpis: ['Cost Per Acquisition (CPA <= $24)', 'Impression Share (> 60%)', 'Conversion Rate (CVR >= 3.8%)'],
        estimatedBudgetShare: '35%',
      },
      {
        channelId: 'meta_ads',
        channelName: 'Meta Ads (Instagram & Facebook)',
        priority: 'High',
        suitabilityReason:
          'Essential visual platform for demonstrating serum texture, amber packaging, oxidation comparisons, and aesthetician proof.',
        targetAudienceReached: 'Ingredient-conscious females aged 25-45 in target regions',
        funnelStage: 'Awareness',
        advantages: [
          'Advanced demographic and algorithmic audience interest matching',
          'Rich dynamic creative formats (Reels, Carousel comparisons, UGC testimonial mashups)',
          'High retargeting efficiency for site visitors and cart abandoners',
        ],
        risksAndLimitations: [
          'Ad creative fatigue occurs every 2-3 weeks, necessitating continuous fresh video assets',
          'Volatile auction CPMs during major retail holidays (Q4 peak)',
        ],
        resourceRequirements: 'High',
        suggestedKpis: ['Click-Through Rate (CTR >= 1.8%)', 'Blended ROAS (>= 3.0x)', 'Cost Per Add-to-Cart'],
        estimatedBudgetShare: '40%',
      },
      {
        channelId: 'email_sms_retention',
        channelName: 'Email & SMS Lifecycle Marketing',
        priority: 'High',
        suitabilityReason:
          'With a 71% gross margin and a 60-day replenishment cycle, customer lifetime value (LTV) is maximized through automated post-purchase flows.',
        targetAudienceReached: 'Existing customers and warm email newsletter subscribers',
        funnelStage: 'Retention',
        advantages: [
          'Virtually zero incremental ad spend per message sent',
          'Builds durable first-party customer relationships shielded from ad auction inflation',
          'Drives 25-35% of total store revenue at 60%+ net margin',
        ],
        risksAndLimitations: [
          'Requires sophisticated segmentation to avoid list unsubscribes and spam complaints',
          'SMS requires strict opt-in compliance and respectful timing',
        ],
        resourceRequirements: 'Low',
        suggestedKpis: ['Repeat Purchase Rate (>= 32% within 90 days)', 'Revenue Per Recipient', 'Flow Open Rate (>= 48%)'],
        estimatedBudgetShare: '15%',
      },
      {
        channelId: 'content_seo',
        channelName: 'SEO & Ingredient Intelligence Guides',
        priority: 'Medium',
        suitabilityReason:
          'Research-heavy audience searches for ingredient interactions (e.g., "Can I use Vitamin C with Niacinamide?").',
        targetAudienceReached: 'Top-of-funnel information seekers seeking skincare advice',
        funnelStage: 'Interest',
        advantages: [
          'Compounding evergreen organic traffic that reduces reliance on paid media over time',
          'Establishes deep topical authority and consumer trust',
        ],
        risksAndLimitations: [
          'Search rank gains typically require 3-6 months to mature',
          'Requires high editorial rigor and compliance with health claim guidelines',
        ],
        resourceRequirements: 'Medium',
        suggestedKpis: ['Organic Non-Brand Impressions', 'Assisted Conversions', 'Keyword Rankings Top 5'],
        estimatedBudgetShare: '10%',
      },
    ],
    funnelStrategy: [
      {
        stage: 'Awareness',
        objective: 'Educate prospects on active oxidation risks and introduce GlowBiome’s stabilized formula.',
        recommendedActivities: [
          'Hook-driven short video ads highlighting oxidized brown serums vs. clear active formulation',
          'Micro-influencer aesthetician partnership unboxings and formulation reviews',
          'High-contrast social infographics displaying 20% active concentration data',
        ],
        keyMetrics: ['Hook Rate (3-second views / impressions >= 30%)', 'Video Completion Rate', 'CPM'],
      },
      {
        stage: 'Interest',
        objective: 'Engage research-heavy consumers evaluating ingredients and benefits.',
        recommendedActivities: [
          'Interactive "Find Your Ideal Morning Routine" 60-second skincare quiz',
          'Side-by-side INCI comparison guide versus leading $160 department store benchmark',
          'Third-party dermatological lab certification reports embedded on product landing page',
        ],
        keyMetrics: ['Quiz Completion Rate (>= 65%)', 'Email Capture Rate (>= 8%)', 'Time on Product Page'],
      },
      {
        stage: 'Consideration',
        objective: 'Neutralize primary friction points: sensitivity stinging and oxidation risk.',
        recommendedActivities: [
          'Dedicated video testimonials from users with sensitive skin and rosacea',
          'Prominent display of 30-Day Empty Bottle Money-Back Guarantee badge',
          'Retargeting ads featuring customer before-and-after photo galleries',
        ],
        keyMetrics: ['Add-to-Cart Rate (>= 7%)', 'Checkout Initiate Rate', 'Return on Ad Spend (ROAS)'],
      },
      {
        stage: 'Conversion',
        objective: 'Facilitate low-friction initial checkout with average order value optimization.',
        recommendedActivities: [
          'One-click mobile checkout (Shop Pay, Apple Pay, Google Pay) to minimize form drop-off',
          'Post-checkout upsell offer for gentle sunscreen complement (+ $28 at 20% bundle discount)',
          'Automated 3-tier cart abandonment SMS and email trigger within 1 hour',
        ],
        keyMetrics: ['Store Conversion Rate (>= 3.5%)', 'Blended CAC (<= $22)', 'Average Order Value (>= $65)'],
      },
      {
        stage: 'Retention',
        objective: 'Drive automated replenishment subscriptions and repeat 60-day purchasing.',
        recommendedActivities: [
          'Day 3, 14, and 28 post-delivery automated check-in emails with dermatological routine tips',
          'Replenishment reminder trigger at Day 45 with one-click "Subscribe & Save 15%" link',
          'VIP early access to new seasonal product batches and limited formulations',
        ],
        keyMetrics: ['60-Day Repeat Order Rate (>= 28%)', 'Subscription Active Churn (< 6%)', 'Customer LTV (6-Month)'],
      },
      {
        stage: 'Advocacy',
        objective: 'Mobilize thrilled customers into vocal brand evangelists and UGC contributors.',
        recommendedActivities: [
          'Post-review incentive flow awarding $10 store credit for verified photo/video reviews',
          'Give $15, Get $15 customer referral program integrated into account portal',
          'Quarterly "Community Formulator" spotlight sharing customer skin transformation stories',
        ],
        keyMetrics: ['Net Promoter Score (NPS >= 68)', 'Referral Order Percentage', 'UGC Submissions per Month'],
      },
    ],
    campaignRecommendations: [
      {
        campaignName: 'The "Never Settle for Oxidized" Launch Campaign',
        objective: 'Establish definitive product differentiation around active formulation stability.',
        channel: 'Meta & TikTok Video Ads',
        targetAudience: 'Skincare enthusiasts who have abandoned previous Vitamin C serums',
        creativeConcept:
          'Split-screen comparison: Competitor serum turning dark brown after 30 days vs. GlowBiome crystal clear dropper on day 30.',
        duration: 'Initial 60-day testing flight',
      },
      {
        campaignName: 'Prestige Clinical Alternative Search Capture',
        objective: 'Capture high-intent searches looking for premium Vitamin C solutions.',
        channel: 'Google Search Ads',
        targetAudience: 'Shoppers searching for high-end dermatologist brands and alternatives',
        creativeConcept:
          'Ad Copy: "Clinical 20% Potency Without The $160 Tag. 30-Day Guarantee. Free Fast Shipping."',
        duration: 'Continuous evergreen flight',
      },
      {
        campaignName: '60-Day Glow Replenishment Automation',
        objective: 'Lock in recurring customer revenue through automated lifecycle retention.',
        channel: 'Klaviyo Email & SMS',
        targetAudience: 'First-time serum purchasers approaching Day 45 of product usage',
        creativeConcept:
          'Personalized reminder: "Your 60-day bottle is running low. Lock in 15% off with auto-delivery."',
        duration: 'Automated ongoing lifecycle flow',
      },
    ],
    budgetConsiderations: {
      recommendedMonthlyBudget: 12000,
      currency: 'USD',
      allocationBreakdown: [
        {
          channel: 'Meta Paid Ads (Instagram / Facebook)',
          percentage: 40,
          amount: 4800,
          purpose: 'Visual creative testing, awareness hooks, and retargeting cart abandoners.',
        },
        {
          channel: 'Google Search Ads',
          percentage: 35,
          amount: 4200,
          purpose: 'High-intent search keyword capture and competitor brand comparison queries.',
        },
        {
          channel: 'Email & SMS Lifecycle Infrastructure',
          percentage: 15,
          amount: 1800,
          purpose: 'Klaviyo automation, SMS platform credits, and post-purchase onboarding.',
        },
        {
          channel: 'Micro-Creator Gifting & UGC Asset Seeding',
          percentage: 10,
          amount: 1200,
          purpose: 'Sending product units to aesthetician creators for organic photo/video review rights.',
        },
      ],
      rationale:
        'With $12,000 monthly spend, prioritizing high-intent search and visual social proofs enables immediate revenue generation while seeding the lifecycle engine that delivers compounding high-margin repeat sales.',
    },
    measurementFramework: {
      primaryMetric: 'Blended ROAS (Target: >= 3.2x) & Customer Acquisition Cost (CAC <= $22.00)',
      secondaryMetrics: [
        'eCommerce Conversion Rate (Target: >= 3.6%)',
        'Average Order Value (AOV Target: >= $65.00 via bundle upsells)',
        '30-Day Cart Abandonment Recovery Rate (Target: >= 14%)',
        '60-Day Repeat Order Velocity (Target: >= 28%)',
      ],
      suggestedTimeHorizon: '3-6 months scale trajectory',
      measurementMethods: [
        'Shopify first-party analytics paired with Google Analytics 4 eCommerce tracking',
        'Meta Conversions API (CAPI) server-side gateway to mitigate iOS signal loss',
        'Post-purchase zero-party survey ("How did you first hear about us?") to calibrate blended CAC',
      ],
      reportingCadence: 'Weekly performance sprint reviews and monthly cohort retention audits',
    },
    risksAndLimitations: {
      potentialOpportunities: [
        'Expanding product line into complementary mineral sunscreen and prebiotic barrier creams',
        'Launching wholesale distribution with clean beauty retailers (e.g., Credo, Detox Market)',
        'Introducing 100ml Jumbo Value size to lift AOV above $95',
      ],
      marketingChallenges: [
        'Rising ad auction CPMs across beauty niches require relentless weekly creative asset refresh',
        'Strict regulatory scrutiny regarding cosmetic medical claims (avoiding "cure" terminology)',
      ],
      competitiveRisks: [
        'Legacy pharmaceutical skincare conglomerates possess multi-million dollar ad budgets',
        'Ultra-budget brands ($12-$18) competing aggressively on sheer price rather than stability',
      ],
      operationalLimitations: [
        'Airtight nitrogen flush packaging requires minimum batch sizes and 6-week supplier lead times',
        'Customer support responsiveness must maintain < 2 hour response time on ingredient inquiries',
      ],
      areasRequiringExternalResearch: [
        'Empirical customer price elasticity testing before considering price adjustments above $58',
        'Live competitor ad copy monitoring via Meta Ad Library to identify emergent creative trends',
        'Dermatologist clinical trial validation to legally substantiate numerical percentage claims',
      ],
    },
    nextSteps: [
      {
        id: 'step-1',
        title: 'Deploy Server-Side Tracking & Attribution Foundation',
        description:
          'Set up Meta Conversions API and Google Tag Manager server container to ensure 100% conversion tracking accuracy.',
        reasoning:
          'Without reliable conversion signal data, ad auction machine learning algorithms cannot accurately locate high-value buyers.',
        expectedPurpose: 'Attribution integrity and algorithmic bid optimization',
        priority: 'High',
        estimatedEffort: 'Low',
        suggestedTimeline: 'Days 1-5',
        successMetric: 'Event Match Quality score of >= 8.2 on Meta Events Manager',
      },
      {
        id: 'step-2',
        title: 'Produce 5 Core Creative Concepts for Paid Social',
        description:
          'Script and edit 5 distinct UGC video concepts contrasting oxidation, showing texture, and explaining the 20% formulation.',
        reasoning:
          'Ad creative is the #1 lever for lowering CAC in social auctions; winning hooks dramatically improve CTR and conversion.',
        expectedPurpose: 'Validate messaging angles and lower initial CPMs',
        priority: 'High',
        estimatedEffort: 'Medium',
        suggestedTimeline: 'Days 6-15',
        successMetric: 'At least 2 ad concepts achieving >= 2.0% outbound click-through rate',
      },
      {
        id: 'step-3',
        title: 'Launch Google Search Exact-Match Commercial Intent Campaigns',
        description:
          'Build tightly themed ad groups around high-intent Vitamin C searches with negative keyword exclusions.',
        reasoning:
          'High-intent search traffic delivers immediate cash-flow positive orders during initial launch sprints.',
        expectedPurpose: 'Capture active demand and calibrate baseline conversion rate',
        priority: 'High',
        estimatedEffort: 'Medium',
        suggestedTimeline: 'Days 16-25',
        successMetric: 'Achieve initial ROAS >= 2.8x on search ad spend',
      },
      {
        id: 'step-4',
        title: 'Configure Klaviyo Post-Purchase Education & Replenishment Engine',
        description:
          'Author and schedule a 5-step email onboarding journey teaching customers proper storage and application cadence.',
        reasoning:
          'Educated customers experience better skin outcomes, report higher satisfaction, and repurchase on 60-day cycles.',
        expectedPurpose: 'Drive customer retention and lift 6-month LTV above $120',
        priority: 'Medium',
        estimatedEffort: 'Medium',
        suggestedTimeline: 'Days 26-35',
        successMetric: 'Lifecycle email revenue contributing >= 20% of total store sales',
      },
    ],
    assumptions: [
      'The 71% gross margin remains stable with packaging and ingredient suppliers at current order volumes.',
      'Average order value can be maintained at or above $58.00 through bundle packaging.',
      'Mobile website checkout delivers a baseline conversion rate of at least 3.0% on qualified paid traffic.',
      'Product fulfillment and shipping maintain an average 2-3 business day delivery window within the US.',
    ],
    inputSnapshot: {
      brandName: 'GlowBiome Organics',
      businessType: 'D2C',
      industry: 'Fashion and Beauty',
      budget: 12000,
      currency: 'USD',
      primaryObjective: 'Increase sales',
      productCount: 1,
    },
  },
  {
    id: 'strat-apex-cloud-001',
    projectId: 'proj-apex-cloud',
    projectName: 'ApexSec Cloud Intelligence',
    version: 1,
    createdAt: '2026-11-12T15:15:00.000Z',
    modelIdentifier: 'Reference Blueprint (Verified Schema)',
    status: 'Completed',
    executiveSummary:
      'ApexSec Cloud Intelligence operates with an 85% SaaS gross margin ($2,400/mo ACV per enterprise node). With an established product-market fit among mid-market infrastructure and DevOps leads, the strategic objective is accelerating enterprise sales pipeline velocity while reducing the current 90-day sales cycle. Strategy focuses on high-intent LinkedIn account-based marketing (ABM), technical search capture for cloud compliance frameworks (SOC2, ISO 27001), and interactive agentic remediation teardowns.',
    businessAnalysis: {
      businessModel: 'B2B Enterprise SaaS',
      industryContext: 'Cloud Native Security & Autonomous Compliance Automation',
      stageAnalysis: 'Growing / Scaling ARR from $2M to $8M',
      strengths: [
        'Exceptional 85% software gross margin enabling aggressive CAC investment',
        'Autonomous agentic remediation resolving misconfigurations in seconds vs. hours',
        'Low friction 15-minute read-only cloud account setup',
      ],
      limitations: [
        'Prolonged enterprise security committee review processes (60-90 day sales cycle)',
        'High competitive presence from legacy incumbent vendors (Palo Alto, Wiz)',
        'Requires technical proof of concept (POC) engagement before closing',
      ],
      featuresVsBenefits: [
        {
          feature: 'Agentless multi-cloud posture scanning across AWS, Azure, and GCP',
          customerBenefit:
            'Gives CISOs complete visibility over cloud vulnerabilities in 15 minutes without installing invasive host agents',
        },
        {
          feature: 'Automated 1-click infrastructure-as-code (Terraform) pull request remediation',
          customerBenefit:
            'Eliminates developer alert fatigue by auto-fixing misconfigurations instead of producing endless PDF alert tickets',
        },
      ],
      uniqueSellingProposition:
        'The only autonomous cloud security platform that generates verified Terraform pull requests to remediate vulnerabilities instantly, saving SecOps teams 20+ engineering hours weekly.',
      pricingAssessment:
        'Starting at $2,400/mo ($28,800 ACV) representing exceptional value against legacy SIEM tools that cost $90,000+ annually.',
      productMarketFitConsiderations:
        'High retention once integrated into CI/CD pipelines; sales velocity hinges on frictionless security questionnaire completion and live POC demos.',
    },
    audienceAnalysis: {
      userProvidedFacts: [
        'Target buyers: CISOs, VP of Engineering, Directors of DevOps, and Cloud Security Architects',
        'Customer Type: B2B Technology Enterprises (50 to 2,000 employees)',
        'Locations: North America, Western Europe',
        'Pain points: Overwhelming alert fatigue, friction between security teams and software developers',
      ],
      aiHypotheses: [
        'DevOps leaders resist security tools that create manual Jira tickets without providing the exact code fix',
        'Compliance deadlines (upcoming SOC 2 or FedRAMP audits) serve as the primary immediate purchase trigger',
        'Customer champions are frequently Senior Cloud Engineers who recommend ApexSec upward to the CISO',
      ],
      primarySegments: [
        'Scale-Up Technology CISOs (Need audit compliance in < 30 days)',
        'Platform Engineering & DevOps Directors (Want automated code fixes, not tickets)',
        'Security Operations Leads (Drowning in 10,000+ daily cloud alerts)',
      ],
      customerNeeds: [
        'Pass annual compliance audits with zero findings',
        'Prevent public S3 bucket and IAM credential leaks',
        'Shorten mean-time-to-remediate (MTTR) cloud vulnerabilities',
      ],
      painPoints: [
        'Security engineers spend 40% of their week copying alerts into Jira for developers',
        'Developers ignore alerts because they lack context on how to fix them in Terraform',
        'Legacy scanning software takes 3 days to index enterprise cloud estates',
      ],
      purchaseMotivations: [
        'Board-level demand for verified SOC 2 and ISO 27001 compliance',
        'Risk mitigation against costly data breach headlines',
        'Freeing scarce senior engineering headcount for revenue-generating features',
      ],
      buyingBehavior:
        'Consensus-driven enterprise buying committee (Security, Engineering, Procurement, Legal). Requires technical whitepaper, SOC 2 Type II report, and hands-on sandbox evaluation.',
      customerObjections: [
        'Does your scanner require write access or agent permissions inside our production VPC?',
        'How does this integrate with our existing GitHub Enterprise pull request workflow?',
        'Can we test this on a non-production AWS account first?',
      ],
      communicationApproach:
        'Technically rigorous, direct, developer-centric, and devoid of marketing fluff. Speak the language of infrastructure-as-code and zero-trust architecture.',
    },
    messaging: {
      brandPositioning:
        'The autonomous cloud security platform that fixes infrastructure vulnerabilities in code before attackers find them.',
      coreMessage:
        'Stop generating alerts your developers ignore. ApexSec auto-remediates cloud misconfigurations with verified Terraform PRs.',
      valueProposition:
        'Autonomous multi-cloud security that delivers complete CISO visibility in 15 minutes and automatically generates production-ready pull requests to resolve security findings instantly.',
      supportingAngles: [
        {
          angle: 'Remediation Over Alert Fatigue',
          headline: 'Your Developers Don’t Need More Tickets. They Need Code.',
          hook: 'Most cloud scanners generate 50-page PDF reports that sit in Jira forever. ApexSec opens the exact GitHub pull request with the fix.',
          targetPainPoint: 'Developer friction and endless manual alert backlog',
        },
        {
          angle: 'Speed to Value',
          headline: 'Complete Multi-Cloud Posture In 15 Minutes. Zero Agents.',
          hook: 'Connect your AWS, Azure, or GCP environment via read-only IAM role and see your exact compliance score before your coffee gets cold.',
          targetPainPoint: 'Painful month-long enterprise software deployment cycles',
        },
        {
          angle: 'Audit Readiness',
          headline: 'Pass Your SOC 2 Audit Without The 80-Hour Engineering Sprint',
          hook: 'Continuous automated compliance tracking mapped directly to SOC 2, HIPAA, and ISO 27001 security controls.',
          targetPainPoint: 'Stressful compliance audit prep and manual evidence gathering',
        },
      ],
      callToActionExamples: [
        'Start 14-Day Free Sandbox Scan',
        'Book 20-Minute Technical Architecture Demo',
        'Calculate Your MTTR Savings',
      ],
      brandCommunicationTone:
        'Authoritative, engineering-led, precise, security-focused, and transparent.',
    },
    approaches: {
      conservative: {
        approachType: 'conservative',
        name: 'Technical Search & Compliance Inbound Capture',
        tagline: 'Capturing active compliance evaluation and CISO intent',
        riskLevel: 'Low',
        budgetAllocation: '50% Google Search (Compliance keywords), 30% Technical SEO & Whitepapers, 20% Retargeting',
        focusAreas: [
          'High-intent search terms: "AWS SOC2 compliance automation", "Terraform security scanner"',
          'Deep architectural whitepapers comparing agentless vs. agent-based cloud security architectures',
          'Account-based IP retargeting showing engineering proof to visitors',
        ],
        tradeOffs: 'Delivers high-quality SQLs with lower CAC, but limits brand awareness in competitive accounts.',
        projectedTimeline: '90-day pipeline validation cycle',
      },
      balanced: {
        approachType: 'balanced',
        name: 'Account-Based Marketing & Inbound Synergy (Recommended)',
        tagline: 'Precision ABM to ICP accounts blended with developer thought leadership',
        riskLevel: 'Moderate',
        budgetAllocation:
          '45% LinkedIn ABM & Sponsored Technical Content, 30% Google Search, 15% Podcast / Newsletter Sponsorships, 10% Sandbox Experience',
        focusAreas: [
          'Targeting named list of 1,200 mid-market engineering teams on LinkedIn with job titles (CISO, DevOps Lead)',
          'High-conversion interactive demo sandbox environment allowing self-guided product tours',
          'Sponsoring premier DevOps and Cloud Security newsletters (e.g., CloudSecList, TL;DR Sec)',
        ],
        tradeOffs:
          'Requires tight coordination between marketing attribution and SDR outbound follow-up within 15 minutes of demo request.',
        projectedTimeline: '180-day ARR acceleration playbook',
      },
      aggressive: {
        approachType: 'aggressive',
        name: 'Enterprise Category Creation & High-Velocity Field Marketing',
        tagline: 'Dominate CISO mindshare through aggressive multichannel ABM and event presence',
        riskLevel: 'High',
        budgetAllocation:
          '50% LinkedIn & Programmatic Enterprise ABM, 25% RSA / AWS re:Invent Dinner & VIP Events, 25% Dedicated SDR Headcount Acceleration',
        focusAreas: [
          'Direct mail executive gifting campaigns to 300 tier-1 CISOs ($250 custom kit triggered on intent surge)',
          'Exclusive CISO private roundtable dinners in San Francisco, New York, and London',
          'Aggressive competitor takeout campaigns bidding on legacy competitor brand terms',
        ],
        tradeOffs: 'Substantial upfront cash commitment and longer sales payback window.',
        projectedTimeline: '120-day enterprise pipeline expansion',
      },
    },
    recommendedChannels: [
      {
        channelId: 'linkedin_ads',
        channelName: 'LinkedIn Account-Based Marketing (ABM)',
        priority: 'High',
        suitabilityReason:
          'Unequaled precision targeting by job title, company size, cloud tech stack (AWS/GCP), and seniority level.',
        targetAudienceReached: 'CISOs, VP of Engineering, Directors of DevOps at 50-2,000 employee tech firms',
        funnelStage: 'Awareness',
        advantages: [
          'Zero wasted impressions on unqualified consumer audiences',
          'Native document ads for sharing technical security architecture whitepapers',
          'Direct integration with CRM systems (HubSpot, Salesforce) for instant sales routing',
        ],
        risksAndLimitations: [
          'High CPMs ($45 - $90) and CPCs ($8 - $16) require compelling technical hooks to maintain cost efficiency',
        ],
        resourceRequirements: 'Medium',
        suggestedKpis: ['Cost Per Qualified Lead (CPQL <= $220)', 'Account Engagement Score', 'Demo Request Conversion Rate'],
        estimatedBudgetShare: '45%',
      },
      {
        channelId: 'google_search_ads',
        channelName: 'Google Search Ads (High-Intent Technical Keywords)',
        priority: 'High',
        suitabilityReason:
          'Captures enterprise buyers actively searching for cloud compliance automation and Terraform security tools.',
        targetAudienceReached: 'Engineers tasked with finding a solution for upcoming security audits',
        funnelStage: 'Consideration',
        advantages: [
          'High conversion rate to product demo requests',
          'Attracts buyers with active budget allocations looking for immediate purchase',
        ],
        risksAndLimitations: [
          'Aggressive competition from legacy security vendors bids up CPCs on generic terms',
        ],
        resourceRequirements: 'Low',
        suggestedKpis: ['Demo Request Cost Per Acquisition (CPA <= $350)', 'Pipeline Value Generated'],
        estimatedBudgetShare: '30%',
      },
      {
        channelId: 'technical_content_seo',
        channelName: 'Technical Architecture & Compliance Guides',
        priority: 'Medium',
        suitabilityReason:
          'Engineers do not trust surface-level marketing; in-depth Terraform code tutorials and SOC 2 checklists attract organic authority.',
        targetAudienceReached: 'DevOps engineers and Cloud Architects evaluating code implementation',
        funnelStage: 'Interest',
        advantages: [
          'Builds immense credibility within technical developer communities',
          'Compounding organic pipeline that permanently lowers blended CAC',
        ],
        risksAndLimitations: [
          'Requires high-level engineering time to produce authentic, working code samples and tutorials',
        ],
        resourceRequirements: 'High',
        suggestedKpis: ['Organic Technical Search Traffic', 'Whitepaper Downloads', 'Newsletter Signups'],
        estimatedBudgetShare: '15%',
      },
      {
        channelId: 'developer_sponsorships',
        channelName: 'Developer & Cloud Security Newsletter Sponsorships',
        priority: 'Medium',
        suitabilityReason:
          'Reaches 80,000+ verified cloud engineers in high-trust niche media (e.g. CloudSecList, Last Week in AWS).',
        targetAudienceReached: 'Practicing cloud security engineers and architects',
        funnelStage: 'Awareness',
        advantages: [
          'High reader trust and bypasses typical display ad blindness',
          'Drives instant surges of qualified engineering sandbox traffic',
        ],
        risksAndLimitations: [
          'Newsletter slots book out months in advance and require precise tracking links',
        ],
        resourceRequirements: 'Low',
        suggestedKpis: ['Click-Through Rate (>= 3.2%)', 'Sandbox Scan Starts', 'Cost Per Registration'],
        estimatedBudgetShare: '10%',
      },
    ],
    funnelStrategy: [
      {
        stage: 'Awareness',
        objective: 'Educate technical leadership on autonomous remediation versus traditional ticket alert fatigue.',
        recommendedActivities: [
          'LinkedIn Sponsored Content showcasing animated GIFs of automated Terraform PR generation',
          'Newsletter sponsorships in top cloud engineering publications',
          'Sponsoring local DevOpsDays and Cloud Native meetup groups',
        ],
        keyMetrics: ['Target Account Reach Rate', 'Document Read Rate', 'Website Engaged Visits'],
      },
      {
        stage: 'Interest',
        objective: 'Engage security architects evaluating compliance and remediation mechanics.',
        recommendedActivities: [
          'Interactive self-guided product sandbox tour (Navattic / Arcade)',
          'Comprehensive "2026 Cloud Security Benchmark Report" download',
          'On-demand 15-minute technical architecture walkthrough webinar',
        ],
        keyMetrics: ['Sandbox Interaction Rate (>= 40%)', 'Lead Magnet Conversion Rate', 'Account Intent Score'],
      },
      {
        stage: 'Consideration',
        objective: 'Facilitate low-risk technical proof-of-concept (POC) on non-production cloud accounts.',
        recommendedActivities: [
          'Read-only cloud account scan generating instant executive compliance scorecard',
          'Dedicated Slack / Teams connect channel with ApexSec security architects during POC',
          'Security & compliance trust center package (SOC 2 report, penetration test summary)',
        ],
        keyMetrics: ['POC Start-to-Completion Rate (>= 75%)', 'Security Review Approval Velocity', 'Sales Cycle Days (< 45)'],
      },
      {
        stage: 'Conversion',
        objective: 'Accelerate contract execution and multi-year commitment.',
        recommendedActivities: [
          'Tiered annual pricing with 20% discount on 2-year commit',
          'Standardized pre-approved enterprise legal terms and DPA agreements',
          'Executive sponsor alignment call between ApexSec CEO and customer CISO',
        ],
        keyMetrics: ['Sales Win Rate (>= 32%)', 'Average Contract Value (ACV >= $28,800)', 'Sales Cycle Duration'],
      },
      {
        stage: 'Retention',
        objective: 'Deepen adoption across engineering teams to achieve negative net revenue churn.',
        recommendedActivities: [
          'Dedicated Customer Success Engineer assigned to quarterly posture review',
          'Automated weekly executive reporting email showing total engineering hours saved',
          'Integration expansion across all enterprise AWS, Azure, and GCP accounts',
        ],
        keyMetrics: ['Gross Retention Rate (>= 96%)', 'Net Revenue Retention (>= 128%)', 'Active Daily User Logins'],
      },
      {
        stage: 'Advocacy',
        objective: 'Turn enterprise CISOs into peer references and conference co-speakers.',
        recommendedActivities: [
          'Co-authored technical case studies detailing 70% MTTR reduction',
          'Private CISO Advisory Board membership with product roadmap input',
          'Invitation to speak on ApexSec keynote panels at RSA and AWS re:Invent',
        ],
        keyMetrics: ['Referenceable Customer Percentage (>= 40%)', 'Customer Case Study Delivery', 'NPS (>= 72)'],
      },
    ],
    campaignRecommendations: [
      {
        campaignName: 'The "Code Over Tickets" CISO ABM Blitz',
        objective: 'Engage 1,200 named mid-market tech accounts struggling with developer security friction.',
        channel: 'LinkedIn Sponsored Content & Account Matching',
        targetAudience: 'CISOs and VPs of Engineering at companies with 100-1,500 employees',
        creativeConcept:
          'Animated screenshot comparing a 400-item Jira backlog vs. an automated ApexSec Terraform PR that fixes 18 issues at once.',
        duration: '90-day targeted flight',
      },
      {
        campaignName: 'Zero-Friction 15-Minute Sandbox Tour',
        objective: 'Lower the barrier for skeptical engineers to test the scanning engine without talking to sales.',
        channel: 'Interactive Product Demo & Search Ads',
        targetAudience: 'DevOps and Cloud Engineers searching for infrastructure posture tools',
        creativeConcept:
          '"Experience autonomous remediation live. No sales call, no credit card, 100% interactive sandbox."',
        duration: 'Evergreen ongoing',
      },
      {
        campaignName: 'Audit Countdown Rapid Compliance Push',
        objective: 'Capture accounts facing urgent SOC 2 or ISO 27001 audit deadlines within 60 days.',
        channel: 'Google Search Ads & Retargeting',
        targetAudience: 'Companies actively preparing for SOC 2 compliance verification',
        creativeConcept:
          '"Audit in 30 Days? Pass Cloud Security Controls Automatically. Get Scored Today."',
        duration: 'Quarterly compliance sprint cycles',
      },
    ],
    budgetConsiderations: {
      recommendedMonthlyBudget: 28000,
      currency: 'USD',
      allocationBreakdown: [
        {
          channel: 'LinkedIn Enterprise ABM Campaign',
          percentage: 45,
          amount: 12600,
          purpose: 'High-precision job title and company account targeting for tier-1 ICP prospects.',
        },
        {
          channel: 'Google Search High-Intent Compliance Ads',
          percentage: 30,
          amount: 8400,
          purpose: 'Capturing active commercial evaluations and competitor alternative searches.',
        },
        {
          channel: 'Technical Content & Sandbox Interactive Platform',
          percentage: 15,
          amount: 4200,
          purpose: 'Developing interactive sandbox environments, compliance whitepapers, and code tutorials.',
        },
        {
          channel: 'Developer Media & Newsletter Sponsorships',
          percentage: 10,
          amount: 2800,
          purpose: 'Placing technical sponsorships in trusted cloud security email publications.',
        },
      ],
      rationale:
        'With an $28,800 ACV and 85% gross margin, a $28,000 monthly marketing envelope requires generating just 2 new closed-won enterprise logos per month to achieve a healthy 4-month payback period.',
    },
    measurementFramework: {
      primaryMetric: 'Marketing Qualified Pipeline Generated (Target: >= $450,000 / month) & Sales Velocity',
      secondaryMetrics: [
        'Cost Per Demo Request (Target: <= $320)',
        'Demo-to-POC Conversion Rate (Target: >= 65%)',
        'POC-to-Closed-Won Win Rate (Target: >= 30%)',
        'Sales Cycle Duration (Target: <= 55 days)',
      ],
      suggestedTimeHorizon: '6-12 months enterprise acceleration flight',
      measurementMethods: [
        'HubSpot / Salesforce multi-touch revenue attribution modeling (W-shaped model)',
        'Clearbit IP reveal software to track anonymous enterprise account traffic spikes',
        'Lead forensics scoring based on sandbox interaction depth and whitepaper consumption',
      ],
      reportingCadence: 'Bi-weekly marketing-sales alignment pipeline reviews and monthly board metrics',
    },
    risksAndLimitations: {
      potentialOpportunities: [
        'Expanding native integrations to include Kubernetes runtime posture and GitHub Advanced Security',
        'Partnering with top cyber insurance underwriters to offer rate discounts for ApexSec customers',
        'Launching AWS Marketplace co-sell listing to consume customer pre-committed EDP cloud budgets',
      ],
      marketingChallenges: [
        'High LinkedIn CPMs necessitate strict negative account filtering to avoid wasting budget',
        'B2B sales cycles require sustained 6-month marketing persistence before enterprise deals close',
      ],
      competitiveRisks: [
        'Venture-backed incumbents (Wiz, Orca) have massive advertising spend and field marketing armies',
        'Cloud hyperscalers (AWS Security Hub) provide free native basic posture scoring',
      ],
      operationalLimitations: [
        'Solutions Architect bandwidth limits concurrent POC capacity to 15 active enterprise evaluations',
        'Security questionnaire completion requires specialized technical compliance resources',
      ],
      areasRequiringExternalResearch: [
        'Annual CISO budget allocation survey for autonomous remediation tools',
        'Analysis of competitor AWS Marketplace pricing tiers to optimize gross margin capture',
        'Verification of regional GDPR data sovereignty restrictions for European cloud scans',
      ],
    },
    nextSteps: [
      {
        id: 'step-1',
        title: 'Build Tier-1 Enterprise Account List (1,200 ICP Companies)',
        description:
          'Filter LinkedIn Sales Navigator for North American tech companies with 50-1,500 staff using AWS/GCP.',
        reasoning:
          'ABM efficiency depends 100% on target list hygiene. Narrowing focus guarantees budget is spent exclusively on qualified buyers.',
        expectedPurpose: 'Establish foundational target audience for all paid and SDR campaigns',
        priority: 'High',
        estimatedEffort: 'Low',
        suggestedTimeline: 'Days 1-5',
        successMetric: 'Verified list of 1,200 accounts with at least 3 mapped buying personas each',
      },
      {
        id: 'step-2',
        title: 'Deploy Interactive Self-Guided Product Sandbox',
        description:
          'Create a 3-minute interactive browser sandbox showing how ApexSec detects an S3 leak and auto-generates a Terraform fix.',
        reasoning:
          'Engineers strongly prefer evaluating software interactively before committing to a 30-minute sales demonstration.',
        expectedPurpose: 'Double website visitor demo conversion rate',
        priority: 'High',
        estimatedEffort: 'Medium',
        suggestedTimeline: 'Days 6-18',
        successMetric: '>= 35% completion rate of interactive sandbox walkthrough',
      },
      {
        id: 'step-3',
        title: 'Launch Targeted LinkedIn ABM Campaign Matrix',
        description:
          'Roll out 4 distinct message variations (Remediation vs. Alerts, Speed to Value, Audit Readiness, ROI) to the 1,200 ICP list.',
        reasoning:
          'Builds multi-threaded awareness across the security, engineering, and C-level buying committee simultaneously.',
        expectedPurpose: 'Drive qualified enterprise demo requests and inbound pipeline',
        priority: 'High',
        estimatedEffort: 'Medium',
        suggestedTimeline: 'Days 19-35',
        successMetric: 'Generate at least 15 qualified enterprise demo requests in Month 1',
      },
      {
        id: 'step-4',
        title: 'Launch AWS Marketplace One-Click Procurement Listing',
        description:
          'Finalize AWS Marketplace seller agreement allowing enterprise clients to purchase ApexSec using existing AWS commit credits.',
        reasoning:
          'Bypasses lengthy enterprise procurement hurdles and accelerates contract signing from weeks to days.',
        expectedPurpose: 'Shorten enterprise sales cycles by 30%',
        priority: 'Medium',
        estimatedEffort: 'High',
        suggestedTimeline: 'Days 36-60',
        successMetric: 'First enterprise closed-won transaction executed via AWS Marketplace',
      },
    ],
    assumptions: [
      'Customer lifetime value assumes an average contract value (ACV) of $28,800 with < 5% annual churn.',
      'Average sales cycle duration can be compressed to 45-60 days with interactive sandbox enablement.',
      'Read-only cloud role permission architecture meets standard enterprise security review criteria.',
    ],
    inputSnapshot: {
      brandName: 'ApexSec Cloud Intelligence',
      businessType: 'SaaS',
      industry: 'Technology / Cloud Security',
      budget: 28000,
      currency: 'USD',
      primaryObjective: 'Generate leads',
      productCount: 1,
    },
  },
];

class StrategyService {
  private getStoredStrategies(): GeneratedMarketingStrategy[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Initialize storage with demo strategies
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_STRATEGIES));
        return DEMO_STRATEGIES;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_STRATEGIES));
      return DEMO_STRATEGIES;
    } catch {
      return DEMO_STRATEGIES;
    }
  }

  public getStrategies(projectId?: string): GeneratedMarketingStrategy[] {
    const list = this.getStoredStrategies();
    if (!projectId) return list;
    return list.filter((s) => s.projectId === projectId);
  }

  public getStrategyById(id: string): GeneratedMarketingStrategy | undefined {
    return this.getStoredStrategies().find((s) => s.id === id);
  }

  public getLatestStrategy(
    projectId: string
  ): GeneratedMarketingStrategy | undefined {
    const list = this.getStrategies(projectId);
    if (list.length === 0) return undefined;
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }

  public saveStrategy(strategy: GeneratedMarketingStrategy): void {
    const current = this.getStoredStrategies();
    const existingIndex = current.findIndex((s) => s.id === strategy.id);
    let next: GeneratedMarketingStrategy[];

    if (existingIndex >= 0) {
      next = [...current];
      next[existingIndex] = strategy;
    } else {
      next = [strategy, ...current];
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Could not persist strategy to localStorage:', err);
    }
  }

  public deleteStrategy(id: string): void {
    const current = this.getStoredStrategies();
    const next = current.filter((s) => s.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Could not update localStorage after delete:', err);
    }
  }

  /**
   * Probes the server-side proxy to check if Gemini API credentials are ready.
   */
  public async checkAiStatus(): Promise<AiStatusResponse> {
    try {
      const res = await fetch('/api/ai-status', {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        return {
          isConfigured: false,
          provider: 'Google Gemini',
          model: 'gemini-1.5-flash',
          message: 'Server proxy did not return ok.',
        };
      }
      const data = await res.json();
      return {
        isConfigured: Boolean(data.isConfigured),
        provider: data.provider || 'Google Gemini',
        model: data.model || 'gemini-1.5-flash',
        message: data.message,
      };
    } catch {
      return {
        isConfigured: false,
        provider: 'Google Gemini',
        model: 'gemini-1.5-flash',
        message: 'Could not connect to /api/ai-status.',
      };
    }
  }

  /**
   * Invokes the server-side AI proxy to generate a fresh strategy with robust timeout and error handling.
   */
  public async generateAiStrategy(
    project: MarketingProject,
    _approachPreference?: StrategyApproachType
  ): Promise<GeneratedMarketingStrategy> {
    const data = await ApiClient.post<{ ok: boolean; strategy: GeneratedMarketingStrategy }>(
      '/api/generate-strategy',
      { project }
    );

    const generated = data.strategy as GeneratedMarketingStrategy;
    // Calculate new version based on project history
    const existing = this.getStrategies(project.id);
    generated.version = existing.length + 1;

    this.saveStrategy(generated);
    return generated;
  }
}

export const strategyService = new StrategyService();

