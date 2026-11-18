/**
 * SPARKLINE MARKETING — UNIFIED MARKETING STRATEGY SERVICE
 * Client persistence, cross-module synthesis, and API management layer for Phase 11.
 */

import { MarketingProject } from '@/types/project';
import {
  UnifiedMarketingStrategy,
  TaskStatus,
  DataCompletenessAudit,
} from '@/types/unified-strategy';
import { audienceService } from './audience.service';
import { marketResearchService } from './market-research.service';
import { competitorService } from './competitor.service';

const STORAGE_KEY = 'sparkline_marketing_unified_strategies';

// Pre-seeded high-fidelity reference blueprint strategies
const DEMO_UNIFIED_STRATEGIES: UnifiedMarketingStrategy[] = [
  {
    id: 'strat-vitamin-c-001',
    projectId: 'proj-vitamin-c',
    projectName: 'GlowBiome Organics',
    strategyTitle: 'Full-Funnel DTC Cosmeceutical Growth Strategy (2026-2027)',
    version: 1,
    createdAt: '2026-11-13T10:00:00.000Z',
    updatedAt: '2026-11-13T12:00:00.000Z',
    modelIdentifier: 'Reference Blueprint (Multi-Engine Synthesis Architecture)',
    completenessAudit: {
      overallScore: 100,
      modules: {
        businessProfile: true,
        productAnalysis: true,
        audienceIntelligence: true,
        marketResearch: true,
        competitorAnalysis: true,
        budgetSpecified: true,
      },
      contributingModules: [
        'Business Profile & Positioning Goals',
        'Product Specifications & Margins',
        'Audience Intelligence (3 Identified Segments)',
        'Market Research (Clean Cosmeceutical Trends)',
        'Competitor Analysis (SkinCeuticals & The Ordinary)',
        'Stated Marketing Budget ($8,000/mo)',
      ],
      missingModules: [],
      conflictingSignals: [],
      unverifiedAssumptions: [
        'Assumes standard 45-day replenishment repurchase velocity based on 30ml daily morning serum application.',
        'Assumes average Meta CPMs remain within $16.50–$22.00 range for female beauty demographics.',
      ],
    },
    executiveSummary: {
      businessSituation:
        'GlowBiome Organics holds a formidable biochemical formulation advantage with its stabilized 20% active L-Ascorbic Acid + Prebiotic Oat complex packaged in nitrogen-flushed amber glass, priced accessibly at $58 compared to $185 luxury dermatologist benchmarks.',
      mainMarketingObjective:
        'Establish GlowBiome as the verified authority in non-oxidizing active serums, scaling monthly revenue past $50k while maintaining blended ROAS > 3.2x and driving 38%+ 60-day customer retention.',
      biggestOpportunity:
        'Directly exploiting consumer fatigue and complaints regarding rapidly oxidizing $160+ luxury serums through transparent time-lapse stability tests, dermatologist proof, and educational comparisons.',
      mainChallenge:
        'Rising digital ad auction inflation across Meta and TikTok combined with heightened consumer skepticism around direct-to-consumer skincare efficacy claims.',
      recommendedStrategicDirection:
        'Implement a hybrid "Proof-First" acquisition engine: lead with clinical active stability comparisons on Meta and TikTok, capture high-intent search traffic on Google, and drive high-margin lifetime value through an automated 45-day auto-replenishment subscription program.',
    },
    brandPositioning: {
      recommendedPositioning:
        'Clinical active potency meets barrier preservation: dermatological-grade results without skin irritation or rapid oxidation.',
      uniqueSellingProposition:
        'Nitrogen-flushed 20% L-Ascorbic Acid + Prebiotic Oat: clinical potency that stays clear and potent for 12 months.',
      coreBrandMessage:
        'Active Results Without Active Irritation. Fresh to the Last Drop.',
      competitiveDifferentiation:
        'Unlike SkinCeuticals ($185), GlowBiome delivers clinical stability at $58; unlike mass-market brands ($12–$25), GlowBiome provides stabilized fresh actives with prebiotic barrier protection.',
      brandPersonality: [
        'Scientifically Rigorous',
        'Radically Transparent',
        'Barrier-Conscious',
        'Empowering',
      ],
      toneOfVoice:
        'Authoritative yet accessible; clinical yet warm; educational without technical jargon overload.',
    },
    targetAudienceStrategy: {
      primarySegment:
        'Ingredient-Conscious Skincare Researchers (Ages 26–44, Urban/Suburban, skincare enthusiasts who read INCI ingredient decks)',
      secondarySegments: [
        'Hyperpigmentation & Sun Spot Solvers (Ages 30–55)',
        'Routine Minimalists seeking single-bottle morning efficacy',
      ],
      customerPainPoints: [
        'Expensive serums turning brown and useless before 50% used',
        'High-potency Vitamin C causing redness, stinging, or breakouts',
        'Confusing marketing claims with hidden synthetic fragrances',
      ],
      purchaseMotivations: [
        'Preventative photoaging protection against UV and environmental stress',
        'Visible fading of stubborn dark spots and post-inflammatory erythema',
        'Confidence wearing minimal makeup with natural skin glow',
      ],
      recommendedMessaging: [
        'See why nitrogen-flushed amber glass keeps your Vitamin C active 3x longer',
        '20% Clinical L-Ascorbic Acid stabilized with soothing prebiotic oat',
        '60-Day Freshness Guarantee: If it oxidizes before you finish the bottle, we replace it free',
      ],
      audiencePriorities: [
        'Educate on oxidation causes before pitching product features',
        'Provide clinical dermatologist credibility upfront to overcome DTC skepticism',
        'Offer flexible subscription replenishment with 1-click SMS controls',
      ],
    },
    channels: [
      {
        channelName: 'Meta Ads (Instagram & Facebook Reels)',
        isPrioritized: true,
        strategicPurpose:
          'Scalable customer acquisition showcasing visual stability tests and dermatologist reactions',
        targetAudience:
          'High concentration of skincare researchers and beauty consumers actively consuming routine videos',
        recommendedActivity:
          'Run 5 creative angles: Time-lapse oxidation vs. competitor, Dermatologist reaction, Unretouched 30-day glow journey, Ingredient breakdown, and The $58 vs $185 price teardown.',
        funnelStage: 'TOFU',
        requiredResources:
          'High: Requires 4-6 fresh UGC and creator video assets per month',
        suggestedKpis: ['Customer Acquisition Cost (CAC) < $32', 'Initial ROAS > 2.8x', 'Reel 3-second hook rate > 38%'],
        potentialLimitations:
          'Ad fatigue accelerates after 3 weeks on winning creatives; requires constant creative pipeline.',
      },
      {
        channelName: 'Google Search & Shopping (High Intent)',
        isPrioritized: true,
        strategicPurpose:
          'Capture high-intent shoppers actively searching for stabilized Vitamin C and dermatologist alternatives',
        targetAudience:
          'Captures consumers at the precise moment of purchase intent with acute problem awareness',
        recommendedActivity:
          'Exact and phrase match campaigns on "best vitamin c serum for sensitive skin", "non oxidizing vitamin c", "skinceuticals alternative".',
        funnelStage: 'BOFU',
        requiredResources:
          'Medium: Regular keyword negative list maintenance and bid adjustments',
        suggestedKpis: ['Search ROAS > 3.8x', 'Conversion Rate > 3.6%', 'Impression Share > 60%'],
        potentialLimitations:
          'Search volume for specific niche phrases is finite; cannot drive mass brand awareness alone.',
      },
      {
        channelName: 'TikTok Organic & Spark Ads',
        isPrioritized: true,
        strategicPurpose:
          'Demystify cosmetic chemistry and virally expose greenwashing in luxury skincare',
        targetAudience:
          'Highly engaged Gen Z and Millennial buyers seeking cosmetic chemist explanations',
        recommendedActivity:
          'Founder & chemist breakdowns answering user comments; Spark ads boosting high-retention videos.',
        funnelStage: 'TOFU',
        requiredResources:
          'Medium: Fast-turnaround authentic mobile video shooting and community management',
        suggestedKpis: ['Cost Per Video View (CPV) < $0.02', 'Click-Through Rate > 1.8%', 'Engagement Rate > 5.5%'],
        potentialLimitations:
          'Impulsive low-AOV traffic requires strong mobile checkout optimization.',
      },
      {
        channelName: 'Klaviyo Retention & Lifecycle Flows',
        isPrioritized: true,
        strategicPurpose:
          'Maximize Customer Lifetime Value (LTV) and convert first-time buyers into 45-day auto-subscribers',
        targetAudience:
          'Existing purchasers and quiz leads who opted in for skincare guidance',
        recommendedActivity:
          '5-part post-purchase education sequence, replenishment reminder at Day 38, VIP tier announcements.',
        funnelStage: 'Retention',
        requiredResources:
          'Low to Medium: Front-loaded setup with ongoing monthly newsletter curation',
        suggestedKpis: ['Email Revenue Share > 28%', '60-Day Repeat Rate > 35%', 'Welcome Flow CVR > 8.5%'],
        potentialLimitations:
          'Deliverability risks if list hygiene is neglected; requires segmented sending.',
      },
      {
        channelName: 'Organic Search & Ingredient Editorial Hub',
        isPrioritized: false,
        strategicPurpose:
          'Build long-term zero-CAC organic compounding traffic on active ingredient science',
        targetAudience:
          'Educated consumers researching active percentages, pH efficacy, and serum stability',
        recommendedActivity:
          'Publish 12 in-depth guides (e.g. "L-Ascorbic Acid vs Sodium Ascorbyl Phosphate", "Why Vitamin C Turns Brown").',
        funnelStage: 'MOFU',
        requiredResources:
          'Medium: Requires medically reviewed content writing and technical SEO hygiene',
        suggestedKpis: ['Organic Traffic Growth > 25% MoM', 'Top-3 Google Rankings for 30+ keywords'],
        potentialLimitations:
          'Long payback horizon (3–6 months before meaningful organic indexation compounds).',
      },
      {
        channelName: 'Dermatologist & Aesthetician Seeding',
        isPrioritized: false,
        strategicPurpose:
          'Establish unquestioned medical and professional credibility through expert endorsements',
        targetAudience:
          'Consumers who trust medical practitioners far more than traditional beauty influencers',
        recommendedActivity:
          'Seed 60 board-certified dermatologists and licensed aestheticians with custom laboratory kits.',
        funnelStage: 'MOFU',
        requiredResources:
          'High: Intensive manual outreach and relationship management',
        suggestedKpis: ['15+ Verified Medical Video Endorsements', 'Referral Sales > $12,000/quarter'],
        potentialLimitations:
          'Doctors will not endorse products that do not have third-party stability and safety assays.',
      },
    ],
    contentStrategy: {
      contentPillars: [
        'Formulation Stability & Laboratory Science',
        'Dermatological Routine Integration & Barrier Protection',
        'Real Skin Transformations & Unretouched Logs',
        'Value & Cosmeceutical Industry Transparency',
      ],
      educationalContent: [
        'Apple oxidation experiment: Why ordinary Vitamin C fails the 14-day test',
        'Inside our cleanroom: Why nitrogen flushing matters before crimping',
        'The optimal pH window for L-Ascorbic Acid absorption (2.8 to 3.2)',
        'Can you use Vitamin C with Niacinamide? Debunking the 1960s myth',
      ],
      promotionalContent: [
        'Introductory Starter Kit with complimentary travel barrier balm',
        'Subscribe & save 15% with guaranteed fresh batch delivery',
        'Seasonal routine bundles (Morning Defense Duo)',
      ],
      engagementContent: [
        'Interactive Skin Barrier & Vitamin C Match Quiz',
        'Weekly live Q&A with cosmetic chemists answering formulation questions',
        'Customer unboxing reactions comparing amber glass dropper to conventional plastic',
      ],
      trustBuildingContent: [
        'Independent laboratory stability certificates showing 95%+ potency at 12 months',
        'Dermatologist clinical evaluation quotes and unretouched 60-day UV scanner photos',
        '60-Day empty-bottle freshness guarantee promise',
      ],
      contentFormats: [
        'Short-form vertical video (15-30s Reels/TikTok)',
        'Interactive Skincare Routine Quiz',
        'Long-form scientific blog articles',
        'High-resolution split before/after photo carousels',
      ],
      messagingAngles: [
        'Fresh to the last drop: The death of brown oxidized serums',
        'Clinical active strength without compromising the barrier',
        'Luxury dermatologist efficacy at an accessible direct price',
      ],
      recommendedPublishingApproach:
        'Publish 3x weekly short-form video reels, 2x weekly educational email drops, and 2x monthly in-depth SEO articles.',
    },
    customerAcquisition: {
      leadGenerationOpportunities: [
        'Interactive "Skin Barrier & Vitamin C Match Quiz" capturing email & phone before delivering personalized routine and 10% voucher',
        'Downloadable "Active Ingredient Compatibility Guide" PDF for ingredient researchers',
      ],
      conversionImprovements: [
        'High-contrast 60-day freshness guarantee badge prominently displayed above the fold',
        'Third-party dermatologist clinical evaluation quotes right above checkout button',
        'Interactive unretouched before/after photo slider comparing dark spot fading over 60 days',
      ],
      landingPageRecommendations: [
        'Dedicated "Oxidation Teardown" lander comparing active shelf-life against brown degraded competitor serums',
        'Clinical proof lander with downloadable independent laboratory assay certificates',
      ],
      offerStrategy:
        'Introductory Starter Kit: $58 Serum + complimentary 15ml Barrier Calming Balm sample + free express shipping with 60-day guarantee.',
      retargetingOpportunities: [
        'Day 1–3: Customer video testimonials highlighting irritation-free results',
        'Day 4–7: Formulation stability FAQ addressing bottle longevity',
        'Day 8–14: Limited-time 10% welcome voucher incentive',
      ],
      acquisitionConsiderations:
        'Acquisition efficiency is directly tied to overcoming skepticism regarding active stinging and oxidation before bottle completion.',
    },
    customerRetention: {
      customerRelationshipActivities: [
        'Personalized post-purchase email onboarding addressing usage guidelines and patch testing',
        'VIP customer advisory group testing upcoming batch formulations',
        'Automated 30-day CSAT survey check-in',
      ],
      emailOrMessagingOpportunities: [
        'Day 1: How to properly store and patch-test your serum',
        'Day 7: What to expect in week 1 (skin cell renewal cycle)',
        'Day 21: Mid-bottle check-in and barrier protection check',
        'Day 38: Replenishment reminder before active runs out',
        'Day 60: Loyalty rewards tier unlock and review submission invitation',
      ],
      loyaltyInitiatives: [
        'GlowBiome Insiders: Earn points on every order, redeem for full-size barrier products',
        'Exclusive early access to quarterly fresh batch drops',
      ],
      repeatPurchaseOpportunities: [
        '15% discount on auto-replenishment subscriptions',
        'Bundle & save with evening prebiotic night cream',
        'Quarterly refill multi-packs at 20% bundle savings',
      ],
      customerFeedbackStrategy:
        'Automated CSAT email at Day 30 post-delivery, followed by quarterly customer advisory council surveys with $25 gift card rewards.',
    },
    growthOpportunities: {
      newAudienceSegments: [
        'Men skincare buyers seeking a straightforward anti-fatigue morning serum',
        'Post-procedure aesthetic clinic patients needing gentle antioxidant protection',
      ],
      productPositioningOpportunities: [
        'Morning Defense System: Positioning serum paired with clean SPF 50',
        'Clean Cosmeceuticals Bridge: Capturing customers migrating away from both clean beauty and harsh prescription retinoids',
      ],
      geographicExpansionPossibilities: [
        'Localized direct-to-consumer fulfillment in Canada and United Kingdom',
        'European Union compliance registration for clean cosmeceutical distribution',
      ],
      partnershipOpportunities: [
        'Co-branded education series with board-certified dermatologists and aesthetic clinics',
        'Cross-promotion with clean mineral sunscreen brands for morning routine bundles',
      ],
      channelExpansion: [
        'Targeted clean beauty wholesale pilot (Credo Beauty, Clean Sephora)',
        'Amazon Brand Storefront with strict temperature-controlled FBA fulfillment',
      ],
      competitiveDifferentiation: [
        'Batch Freshness Transparency QR code on every bottle revealing exact packaging date and active assay potency',
        'Patented amber glass nitrogen purge sealing process',
      ],
    },
    modes: {
      lean: {
        mode: 'lean',
        name: 'Lean Growth',
        tagline: 'Organic & Creator-First Customer Acquisition',
        mainObjective:
          'Build authentic organic social education, micro-creator seeding, and referral loops with minimal paid advertising risk.',
        recommendedChannels: [
          'TikTok Organic',
          'Instagram Reels',
          'Micro-Influencer Gifting',
          'Lifecycle Email',
        ],
        resourceRequirements:
          'Low cash requirement ($2,500–$3,500/mo); High internal founder and creative team time commitment.',
        budgetConsiderations:
          'Focus budget on PR sample mailer boxes, laboratory assays, and creator seeding rather than paid media ad auctions.',
        mainAdvantages: [
          'Low financial overhead and minimal cash burn exposure',
          'Authentic community trust built through educational transparency',
          'Zero dependency on fluctuating paid ad algorithms',
        ],
        mainRisks: [
          'Slower customer acquisition ramp and less predictable monthly volume',
          'Heavily dependent on organic algorithmic reach and creator responsiveness',
        ],
        successCriteria: [
          'Reach 2,500 qualified email subscribers within 60 days',
          'Achieve 50+ organic monthly purchases with zero ad spend',
          'Maintain customer review rating above 4.8 / 5.0 stars',
        ],
      },
      balanced: {
        mode: 'balanced',
        name: 'Balanced Growth',
        tagline: 'Integrated Multi-Channel Paid & Retention Engine',
        mainObjective:
          'Scale predictable paid acquisition in harmony with automated retention flows and compounding organic SEO foundations.',
        recommendedChannels: [
          'Meta Video Ads',
          'Google High-Intent Search',
          'Klaviyo Retention Flows',
          'SEO Editorial Hub',
        ],
        resourceRequirements:
          'Moderate capital ($8,000–$12,000/mo); Dedicated performance marketing specialist and graphic designer.',
        budgetConsiderations:
          'Allocate 60% of budget to Meta Ads, 25% to Google Search, and 15% to retention tools, creator content, and CRO.',
        mainAdvantages: [
          'Predictable month-over-month customer acquisition velocity',
          'High blended ROAS (>3.2x) with balanced acquisition and retention',
          'Establishes proprietary email asset generating 28%+ of revenue',
        ],
        mainRisks: [
          'Ad fatigue requires 3-4 fresh creative video hooks weekly',
          'Competitor bidding wars on branded search keywords',
        ],
        successCriteria: [
          'Achieve $45,000 monthly gross revenue within 90 days',
          'Maintain 38%+ 60-day repeat purchase rate',
          'Keep blended Customer Acquisition Cost below $32.00',
        ],
      },
      accelerated: {
        mode: 'accelerated',
        name: 'Accelerated Growth',
        tagline: 'High-Velocity Multi-Channel Category Scale',
        mainObjective:
          'Capture category leadership through aggressive multi-channel paid acquisition, celebrity dermatologist endorsements, and PR blitz.',
        recommendedChannels: [
          'Meta Scale Ads',
          'TikTok Spark Ads',
          'Top-Tier Podcast Host Reads',
          'Google Shopping / PMax',
          'Affiliate PR Networks',
        ],
        resourceRequirements:
          'High capital investment ($25,000–$40,000/mo); Full growth agency or in-house team across paid, creative, and lifecycle.',
        budgetConsiderations:
          'Requires substantial working capital buffer to finance large inventory runs and front-loaded advertising spend.',
        mainAdvantages: [
          'Rapid category dominance and massive brand awareness across demographic cohorts',
          'Strong wholesale pull demand from clean beauty retail chains',
          'Fast statistical feedback loops for creative and product optimization',
        ],
        mainRisks: [
          'Higher blended CAC during rapid scale phases',
          'Inventory stockout vulnerability if production does not keep pace with demand',
        ],
        successCriteria: [
          'Cross $150,000 monthly revenue run rate within 120 days',
          'Secure retail buyer meeting with premier clean beauty chain',
          'Achieve top-3 brand recognition in clean cosmeceutical serum space',
        ],
      },
    },
    actionPlan: [
      {
        id: 'task-1',
        title: 'Deploy Formulation Stability Landing Page & Time-Lapse Comparison',
        description:
          'Build a dedicated high-converting product page featuring side-by-side time-lapse oxidation comparison against conventional $160+ serums, independent stability charts, and unretouched 30-day customer photo logs.',
        reasonForRecommendation:
          'Directly neutralizes the primary customer objection (rapid serum degradation) identified in audience research.',
        priority: 'High',
        estimatedEffort: 'Medium',
        period: 'immediate',
        suggestedStartPeriod: 'Week 1',
        suggestedCompletionPeriod: 'Week 2',
        requiredResources: 'Design mockups, high-resolution lab assets, Shopify landing page builder',
        responsibleRole: 'Growth Marketer & Frontend Designer',
        successMetric: 'eCommerce conversion rate > 3.4% on direct paid traffic',
        dependencyOnOtherTasks: 'Product lab photography completed',
        status: 'completed',
      },
      {
        id: 'task-2',
        title: 'Configure 5-Step Klaviyo Post-Purchase Customer Onboarding Series',
        description:
          'Set up automated email flow triggered on order delivery: Day 1 (Patch testing guide), Day 7 (Week 1 cell renewal expectations), Day 21 (Barrier check), Day 38 (Replenishment reminder), and Day 60 (VIP loyalty invite).',
        reasonForRecommendation:
          'Prevents post-purchase tingling panic and drives 45-day auto-replenishment subscriptions.',
        priority: 'High',
        estimatedEffort: 'Low',
        period: 'immediate',
        suggestedStartPeriod: 'Week 1',
        suggestedCompletionPeriod: 'Week 2',
        requiredResources: 'Email copywriter, Klaviyo account integration, branded email templates',
        responsibleRole: 'Lifecycle Email Specialist',
        successMetric:
          'Email open rate > 45%, replenishment repeat purchase rate > 35%',
        dependencyOnOtherTasks: 'Email copy and branding templates approved',
        status: 'completed',
      },
      {
        id: 'task-3',
        title: 'Launch High-Intent Google Search Campaign for Vitamin C Keywords',
        description:
          'Structure exact-match search ad groups targeting commercial keywords: "stabilized vitamin c serum", "vitamin c for sensitive skin", "non oxidizing antioxidant serum", and competitor conquest terms.',
        reasonForRecommendation:
          'Captures active in-market buyers searching for solutions to serum degradation.',
        priority: 'High',
        estimatedEffort: 'Medium',
        period: 'immediate',
        suggestedStartPeriod: 'Week 2',
        suggestedCompletionPeriod: 'Week 3',
        requiredResources: 'Google Ads account, keyword research data, conversion tracking tags',
        responsibleRole: 'PPC Specialist',
        successMetric: 'Search ROAS > 3.8x, Search Impression Share > 60%',
        dependencyOnOtherTasks: 'Landing page live and conversion tracking verified',
        status: 'in_progress',
      },
      {
        id: 'task-4',
        title: 'Seed 50 Cosmetic Chemists & Board-Certified Dermatologists',
        description:
          'Ship professional laboratory mailer kits with fresh amber glass serum, formulation whitepaper, and lab testing notes to 50 credentialed skincare experts with zero contractual posting demands.',
        reasonForRecommendation:
          'Medical credentials overcome DTC skepticism and provide authoritative social proof for ads.',
        priority: 'High',
        estimatedEffort: 'High',
        period: 'short_term',
        suggestedStartPeriod: 'Week 3',
        suggestedCompletionPeriod: 'Week 5',
        requiredResources: '50 custom PR lab mailer boxes, product units, influencer tracking sheet',
        responsibleRole: 'Influencer Coordinator',
        successMetric:
          '15+ organic video reviews, quotes, and medical endorsements',
        dependencyOnOtherTasks: 'PR packaging mailer boxes delivered',
        status: 'in_progress',
      },
      {
        id: 'task-5',
        title: 'Implement Skin Barrier & Vitamin C Match Quiz for Lead Generation',
        description:
          'Design and deploy a 6-question interactive routine finder quiz capturing skin type, primary concern, active sensitivity history, and contact info to deliver custom morning/evening routines.',
        reasonForRecommendation:
          'Builds proprietary first-party zero-CAC email and SMS marketing subscriber list.',
        priority: 'Medium',
        estimatedEffort: 'Medium',
        period: 'short_term',
        suggestedStartPeriod: 'Week 4',
        suggestedCompletionPeriod: 'Week 6',
        requiredResources: 'Typeform or Octane AI subscription, quiz logic flowchart, discount codes',
        responsibleRole: 'CRO & Full-Stack Engineer',
        successMetric:
          'Quiz completion rate > 60%, email lead capture rate > 40%',
        dependencyOnOtherTasks: 'Octane AI / Typeform integration configured',
        status: 'not_started',
      },
      {
        id: 'task-6',
        title: 'Publish 8 Dermatologist-Reviewed SEO Guides on Cosmeceutical Actives',
        description:
          'Author and publish comprehensive educational articles targeting high-intent informational queries: "Why does Vitamin C oxidize brown?", "L-Ascorbic Acid vs Sodium Ascorbyl Phosphate", and "How to combine Ferulic Acid and Vitamin C".',
        reasonForRecommendation:
          'Compounds long-term zero-CAC organic search traffic and strengthens Google E-E-A-T signals.',
        priority: 'Medium',
        estimatedEffort: 'High',
        period: 'short_term',
        suggestedStartPeriod: 'Week 4',
        suggestedCompletionPeriod: 'Week 8',
        requiredResources: 'Skincare medical writer, clinical board reviewer, technical SEO specialist',
        responsibleRole: 'Content Strategist & Medical Reviewer',
        successMetric:
          'Rank in top 5 for 20+ long-tail educational skincare queries within 90 days',
        dependencyOnOtherTasks: 'Medical reviewer sign-off',
        status: 'not_started',
      },
      {
        id: 'task-7',
        title: 'Deploy VIP Replenishment Auto-Ship Subscription Program',
        description:
          'Integrate Shopify Subscriptions offering 15% recurring savings, free shipping, and flexible 30/45/60-day delivery cycles with SMS-based skip/pause controls.',
        reasonForRecommendation:
          'Locks in high customer lifetime value and creates predictable monthly recurring revenue.',
        priority: 'High',
        estimatedEffort: 'Medium',
        period: 'medium_term',
        suggestedStartPeriod: 'Month 2',
        suggestedCompletionPeriod: 'Month 3',
        requiredResources: 'Recharge or Shopify Subscriptions app, notification copy, checkout flow testing',
        responsibleRole: 'eCommerce Operations Lead',
        successMetric:
          'Subscription penetration > 28% of total monthly orders',
        dependencyOnOtherTasks: 'Subscription gateway configured and tested',
        status: 'not_started',
      },
      {
        id: 'task-8',
        title: 'Implement Dynamic Creative Optimization for Meta Ad Retargeting',
        description:
          'Set up sequenced retargeting for website visitors who viewed product but did not purchase: Day 1-3 (Social proof video), Day 4-7 (Dermatologist stability chart), Day 8-14 (Starter Kit incentive).',
        reasonForRecommendation:
          'Recovers high-intent drop-off traffic at significantly lower CAC than top-of-funnel prospecting.',
        priority: 'Medium',
        estimatedEffort: 'Medium',
        period: 'medium_term',
        suggestedStartPeriod: 'Month 2',
        suggestedCompletionPeriod: 'Month 3',
        requiredResources: 'Meta catalog sync, retargeting ad variations, custom audience segmentation',
        responsibleRole: 'Performance Creative Lead',
        successMetric: 'Retargeting ROAS > 5.0x, Blended Retargeting CPA < $18',
        dependencyOnOtherTasks: 'Meta Pixel catalog events verified',
        status: 'not_started',
      },
      {
        id: 'task-9',
        title: 'Initiate Independent Clinical Assay for 12-Month Potency Certification',
        description:
          'Contract with accredited cosmetic testing laboratory to conduct accelerated stability testing, confirming active L-Ascorbic Acid retention > 95% at 12 months under ambient conditions.',
        reasonForRecommendation:
          'Provides peer-reviewed empirical proof to silence competitor counter-claims.',
        priority: 'High',
        estimatedEffort: 'High',
        period: 'medium_term',
        suggestedStartPeriod: 'Month 3',
        suggestedCompletionPeriod: 'Month 4',
        requiredResources: 'Testing budget ($4,500), production batch samples, accredited analytical laboratory',
        responsibleRole: 'R&D Director & CMO',
        successMetric:
          'Published peer-reviewed stability certificate usable in all marketing collateral',
        dependencyOnOtherTasks: 'Testing protocol agreement finalized',
        status: 'not_started',
      },
      {
        id: 'task-10',
        title: 'Prepare Clean Retail Wholesale Pitch Deck for Credo / Sephora',
        description:
          'Compile 6-month commercial velocity data, customer retention metrics, clinical stability assays, and DTC brand search volume into a professional retail buyer presentation.',
        reasonForRecommendation:
          'Diversifies revenue away from pure direct-to-consumer digital ad reliance into omni-channel retail.',
        priority: 'Medium',
        estimatedEffort: 'High',
        period: 'long_term',
        suggestedStartPeriod: 'Month 5',
        suggestedCompletionPeriod: 'Month 6',
        requiredResources: 'Verified sales history data, wholesale packaging mockups, retail line sheet',
        responsibleRole: 'Head of Wholesale & Founder',
        successMetric:
          'Buyer meeting secured with premier clean beauty retail chain',
        dependencyOnOtherTasks: '6 months of verified commercial sales history',
        status: 'not_started',
      },
    ],
    kpiFramework: [
      {
        id: 'kpi-cac',
        metricName: 'Blended Customer Acquisition Cost (CAC)',
        category: 'Acquisition',
        definition: 'Total sales and marketing expenditure divided by the number of new paying customers acquired.',
        formula: 'Total Marketing Spend / Total New Customers Acquired',
        whyItMatters: 'Guarantees scalable unit economics as paid ad channels expand across Meta and Google.',
        whichObjectiveItSupports: 'Scaling revenue while maintaining healthy contribution margins.',
        dataRequired: 'Ad platform spend (Meta, Google) + Shopify new customer orders',
        recommendedMeasurementFrequency: 'Weekly',
        benchmarkRange: 'Target: < $32.00 for $58 AOV product (Gross margin buffer > 70%)',
      },
      {
        id: 'kpi-roas',
        metricName: 'Blended Return on Ad Spend (Blended ROAS / MER)',
        category: 'Revenue',
        definition: 'Total store net revenue divided by total paid advertising investment across all channels.',
        formula: 'Total Store Net Revenue / Total Advertising Spend',
        whyItMatters: 'Measures the aggregate commercial efficiency of top-of-funnel paid media investments.',
        whichObjectiveItSupports: 'Maintaining profitable media efficiency ratio.',
        dataRequired: 'Total net eCommerce revenue divided by total paid media ad spend',
        recommendedMeasurementFrequency: 'Weekly',
        benchmarkRange: 'Target: > 3.2x blended ROAS during balanced growth phase',
      },
      {
        id: 'kpi-retention',
        metricName: '60-Day Repeat Purchase Rate',
        category: 'Retention',
        definition: 'Percentage of first-time purchasers who complete a second order within 60 calendar days.',
        formula: '(Customers with >= 2 Orders within 60 Days / Total First-Time Customers) * 100',
        whyItMatters: 'In skincare, long-term enterprise profitability requires consistent repurchase cycles.',
        whichObjectiveItSupports: 'Maximizing Customer Lifetime Value (LTV).',
        dataRequired: 'Shopify customer cohort data (Cohort 60-day window)',
        recommendedMeasurementFrequency: 'Monthly',
        benchmarkRange: 'Target: > 38% repeat purchase rate within 60 days',
      },
      {
        id: 'kpi-sub-rate',
        metricName: 'Active Auto-Replenishment Subscription Share',
        category: 'Retention',
        definition: 'Proportion of total active customer base enrolled in automatic recurring delivery.',
        formula: '(Active Subscribers / Total Active Customer Base) * 100',
        whyItMatters: 'Creates predictable monthly recurring revenue (MRR) and dramatically extends LTV.',
        whichObjectiveItSupports: 'Building sustainable predictable cash flow.',
        dataRequired: 'Recharge / Shopify Subscriptions active subscriber count',
        recommendedMeasurementFrequency: 'Monthly',
        benchmarkRange: 'Target: > 28% of total active customer base',
      },
      {
        id: 'kpi-email-rev',
        metricName: 'Email & SMS Revenue Contribution',
        category: 'Revenue',
        definition: 'Percentage of total monthly revenue directly attributed to owned email and SMS marketing channels.',
        formula: '(Revenue Attributed to Email & SMS / Total Store Revenue) * 100',
        whyItMatters: 'High email revenue contribution cushions against paid media volatility and ad price inflation.',
        whichObjectiveItSupports: 'Diversifying away from external ad platform dependency.',
        dataRequired: 'Klaviyo attributed revenue reporting (last-click attribution)',
        recommendedMeasurementFrequency: 'Monthly',
        benchmarkRange: 'Target: 25% – 32% of total monthly store revenue',
      },
      {
        id: 'kpi-cvr',
        metricName: 'eCommerce Storefront Conversion Rate',
        category: 'Acquisition',
        definition: 'Percentage of unique website sessions that culminate in a completed transaction.',
        formula: '(Total Completed Purchases / Total Unique Website Sessions) * 100',
        whyItMatters: 'Directly influences paid acquisition efficiency; higher conversion lowers blended CAC.',
        whichObjectiveItSupports: 'Maximizing efficiency of all inbound traffic sources.',
        dataRequired: 'Google Analytics 4 / Shopify Analytics session and checkout data',
        recommendedMeasurementFrequency: 'Weekly',
        benchmarkRange: 'Target: > 3.2% for desktop, > 2.6% for mobile devices',
      },
    ],
    risksAndAssumptions: {
      risks: [
        {
          id: 'risk-ad-inflation',
          risk: 'Meta & TikTok CPM inflation during Q4 peak holiday season',
          severity: 'High',
          likelihood: 'High',
          mitigation:
            'Front-load customer acquisition during Q2 and Q3; rely on email/SMS retention during Q4 auction surges.',
        },
        {
          id: 'risk-sensory',
          risk: 'First-time users misinterpreting initial active tingling as allergic irritation',
          severity: 'Medium',
          likelihood: 'Medium',
          mitigation:
            'Include prominent patch-testing guide and Day 1 onboarding email explicitly explaining the mild tingling sensation of 20% active L-Ascorbic Acid.',
        },
        {
          id: 'risk-copycats',
          risk: 'Competitor brands mimicking amber glass dropper and nitrogen flush messaging',
          severity: 'Medium',
          likelihood: 'Low',
          mitigation:
            'Anchor brand equity in proprietary Prebiotic Oat soothing complex and independent laboratory potency assay verification.',
        },
      ],
      assumptions: [
        'Gross product margin remains above 72% allowing sufficient CAC buffer.',
        'Supply chain partners maintain certified pharmaceutical-grade amber glass droppers with hermetic nitrogen seals.',
        'Independent clinical lab assay confirms >95% active ingredient potency retention over 12 months.',
      ],
      limitations: [
        'Paid media algorithms require 2–3 weeks of initial conversion volume to optimize CPA effectively.',
        'Organic search engine indexation and SEO keyword ranking require 3–6 months to compound meaningfully.',
      ],
    },
    supportingResearchReferences: [
      {
        sourceModule: 'Audience Intelligence Engine',
        findingSummary:
          'Identified "Ingredient-Conscious Skincare Researchers" as the highest-converting segment with acute sensitivity to serum oxidation.',
        confidence: 'High',
      },
      {
        sourceModule: 'Market Research & Industry Intelligence',
        findingSummary:
          'Verified global clean cosmeceuticals growth at 8.4% CAGR with structural shift toward verified barrier preservation.',
        confidence: 'High',
      },
      {
        sourceModule: 'Competitor Intelligence & Benchmarking',
        findingSummary:
          'SkinCeuticals ($185) creates massive price opening; mass brands lack stabilized formulations and prebiotic buffers.',
        confidence: 'High',
      },
      {
        sourceModule: 'SWOT Analysis Matrix',
        findingSummary:
          'Primary brand weakness is lack of legacy dermatological heritage, directly mitigated by independent clinical stability assays.',
        confidence: 'High',
      },
    ],
  },
  {
    id: 'strat-apex-cloud-001',
    projectId: 'proj-apex-cloud',
    projectName: 'ApexSec Cloud Intelligence',
    strategyTitle: 'Enterprise Multi-Cloud Security Go-To-Market Plan (2026)',
    version: 1,
    createdAt: '2026-11-13T11:00:00.000Z',
    updatedAt: '2026-11-13T11:00:00.000Z',
    modelIdentifier: 'Reference Blueprint (Multi-Engine Synthesis Architecture)',
    completenessAudit: {
      overallScore: 83,
      modules: {
        businessProfile: true,
        productAnalysis: true,
        audienceIntelligence: true,
        marketResearch: true,
        competitorAnalysis: true,
        budgetSpecified: false,
      },
      contributingModules: [
        'Business Profile (B2B SaaS / Cybersecurity)',
        'Product Specifications (Agentless Cloud Security Platform)',
        'Audience Intelligence (CISOs & DevSecOps Leaders)',
        'Market Research (Cloud Security Posture Management)',
        'Competitor Analysis (Wiz, Palo Alto Networks, Orca)',
      ],
      missingModules: ['Explicit Monthly Marketing Budget'],
      conflictingSignals: [],
      unverifiedAssumptions: [
        'Enterprise sales cycle estimated at 60–90 days based on standard SOC2/ISO compliance review windows.',
        'Assumes access to qualified B2B sales development representatives for outbound pipeline follow-up.',
      ],
    },
    executiveSummary: {
      businessSituation:
        'ApexSec Cloud Intelligence provides enterprise multi-cloud security graph intelligence with agentless deployment in under 15 minutes, addressing a $14B market dominated by high-friction legacy enterprise vendors.',
      mainMarketingObjective:
        'Generate 40+ sales-accepted pipeline opportunities per quarter from Mid-Market and Enterprise security teams while establishing ApexSec as the authority on cloud attack-path graph modeling.',
      biggestOpportunity:
        'Positioning against bloated enterprise suites by offering a 14-day zero-friction "Cloud Threat Discovery Scan" revealing real misconfigurations before contract signing.',
      mainChallenge:
        'Overcoming enterprise vendor fatigue and entrenched relationships with legacy cybersecurity conglomerates.',
      recommendedStrategicDirection:
        'Deploy an Account-Based Marketing (ABM) motion combined with high-value technical benchmark reports and interactive threat simulator tools targeting CISOs and Cloud Security Architects.',
    },
    brandPositioning: {
      recommendedPositioning:
        'Agentless multi-cloud graph security: instant context without agents or alert fatigue.',
      uniqueSellingProposition:
        'Unified attack path graph modeling that connects IAM misconfigurations, CVEs, and network exposure in real time.',
      coreBrandMessage:
        'See your actual attack paths in 15 minutes. Eliminate alert noise before attackers exploit it.',
      competitiveDifferentiation:
        '100% agentless setup with zero host performance impact; eliminates 85% of false-positive compliance noise.',
      brandPersonality: ['Vigilant', 'Decisive', 'Technically Sophisticated', 'Transparent'],
      toneOfVoice:
        'Authoritative, objective, engineer-friendly, and free from cybersecurity fear-mongering.',
    },
    targetAudienceStrategy: {
      primarySegment:
        'Chief Information Security Officers (CISOs) & VP of Security at Cloud-Native Mid-Market & Enterprise companies (500–5,000 employees)',
      secondarySegments: [
        'DevSecOps & Cloud Platform Engineering Leads',
        'Compliance & Risk Officers navigating SOC2 / ISO27001 audits',
      ],
      customerPainPoints: [
        'Drowning in 10,000+ daily disconnected security alerts without priority context',
        'Complex agent deployments breaking production Kubernetes clusters',
        'Multi-cloud visibility gaps across AWS, Azure, and Google Cloud environments',
      ],
      purchaseMotivations: [
        'Accelerating compliance audits with automated proof',
        'Reducing mean time to remediate (MTTR) critical exposure points',
        'Eliminating costly manual cloud infrastructure audits',
      ],
      recommendedMessaging: [
        'Map your full cloud attack surface in under 15 minutes without installing a single agent',
        'Prioritize the 1% of vulnerabilities that have an actual verified path to internet exposure',
        'Trusted by cloud-first engineering teams to stop alert fatigue',
      ],
      audiencePriorities: [
        'Demonstrate zero host agent impact and read-only credential architecture',
        'Provide instant sample attack path graph simulation before requesting a sales call',
        'Focus on MTTR reduction and audit automation proof',
      ],
    },
    channels: [
      {
        channelName: 'LinkedIn Account-Based Marketing (ABM)',
        isPrioritized: true,
        strategicPurpose:
          'Precision-targeted sponsored content reaching verified CISOs and Security Directors at target accounts',
        targetAudience:
          'Exact job title and company size targeting enables zero-waste B2B enterprise audience focus',
        recommendedActivity:
          'Run sponsored carousel ads highlighting "The 2026 Cloud Attack Path Benchmark Report" and direct peer roundtable invitations.',
        funnelStage: 'TOFU',
        requiredResources: 'High: Dedicated ABM budget and targeted account tiering list',
        suggestedKpis: ['Cost Per Qualified Lead (MQL) < $180', 'Account Engagement Rate > 45%'],
        potentialLimitations: 'High CPM costs; requires strong landing page value proposition to convert.',
      },
      {
        channelName: 'Technical Whitepapers & Security Research',
        isPrioritized: true,
        strategicPurpose:
          'Build technical authority and inbound pipeline among Cloud Architects and DevSecOps practitioners',
        targetAudience:
          'Security engineers require deep technical teardowns rather than high-level sales decks',
        recommendedActivity:
          'Publish monthly deep-dive threat research analyzing real CVE exploitation graphs and Terraform templates.',
        funnelStage: 'MOFU',
        requiredResources: 'High: Requires security researchers and technical writers',
        suggestedKpis: ['Whitepaper Download Velocity > 200/mo', 'Sales Accepted Pipeline > $400k/quarter'],
        potentialLimitations: 'Long research cycles to produce novel threat analysis.',
      },
      {
        channelName: 'Interactive Cloud Threat Discovery Tool',
        isPrioritized: true,
        strategicPurpose:
          'Product-led growth entry point allowing prospective accounts to connect read-only AWS/GCP and view attack graphs',
        targetAudience:
          'Engineers prefer testing software directly rather than sitting through 45-minute sales pitches',
        recommendedActivity:
          'Promote "15-Minute Read-Only Cloud Risk Assessment" across technical communities with automated report.',
        funnelStage: 'BOFU',
        requiredResources: 'Medium: Smooth onboarding engineering and automated security reporting',
        suggestedKpis: ['Free Scan to Qualified Demo Conversion Rate > 34%'],
        potentialLimitations: 'Security teams require extensive approval before granting read-only cloud permissions.',
      },
    ],
    contentStrategy: {
      contentPillars: [
        'Attack Path Analysis & Exploitation Research',
        'Executive Cybersecurity Governance & Board Reporting',
        'Agentless Multi-Cloud Security Architecture',
      ],
      educationalContent: [
        'How a single IAM misconfiguration led to complete Kubernetes cluster takeover',
        'Context vs. Noise: Why 92% of CVEs pose zero exploitable danger in practice',
        'Graph theory applied to cloud infrastructure defense',
      ],
      promotionalContent: [
        'Complimentary 14-Day Cloud Threat Assessment',
        'Personalized CISO Executive Security Briefing',
      ],
      engagementContent: [
        'Interactive Threat Graph Browser Sandbox',
        'Quarterly CISO peer roundtable dinner series',
      ],
      trustBuildingContent: [
        'SOC 2 Type II and ISO 27001 certifications',
        'Zero-credential read-only architecture proof whitepaper',
        'Customer case studies from publicly traded cloud-first tech companies',
      ],
      contentFormats: [
        'Technical Research Whitepapers',
        'Interactive Threat Graph Demos',
        'Executive CISO Roundtable Dinners',
        'On-demand Security Engineering Webinars',
      ],
      messagingAngles: [
        'Eliminate 85% of false-positive compliance noise',
        'Graph-powered attack path visualization in 15 minutes',
        'Zero agents, zero performance overhead, 100% visibility',
      ],
      recommendedPublishingApproach:
        'Bi-weekly technical research release, monthly executive webinar, continuous ABM ad rotation.',
    },
    customerAcquisition: {
      leadGenerationOpportunities: [
        'Free 15-Minute Read-Only Cloud Threat Discovery Scan generating an instant Executive Risk Report',
        'Gated access to the annual Cloud Attack Path Benchmark Report',
      ],
      conversionImprovements: [
        'Instant verification that ApexSec never reads customer data or requires persistent host agents',
        'Live interactive sandbox mode allowing prospects to explore graph visualizations without connecting accounts',
      ],
      landingPageRecommendations: [
        'Interactive attack path graph simulation showing sample AWS/Azure environment',
        'Security & Architecture FAQ addressing SOC 2 and data residency concerns',
      ],
      offerStrategy:
        'Complimentary Multi-Cloud Risk Assessment with dedicated Security Architect debrief call.',
      retargetingOpportunities: [
        'Retarget website visitors with customer case studies showing 85% alert reduction',
        'Executive peer quotes on LinkedIn from prominent tech CISOs',
      ],
      acquisitionConsiderations:
        'Enterprise sales require clear multi-stakeholder consensus across Security, DevOps, and Compliance teams.',
    },
    customerRetention: {
      customerRelationshipActivities: [
        'Dedicated Named Customer Success Architect assigned to all accounts above $30k ARR',
        'Quarterly Business Review (QBR) meetings evaluating reduced risk metrics and ROI',
      ],
      emailOrMessagingOpportunities: [
        'Weekly Cloud Posture Digest highlighting newly mitigated risk paths',
        'Automated executive quarterly business review (QBR) deck generation',
      ],
      loyaltyInitiatives: [
        'ApexSec CISO Advisory Council membership',
        'Early access to private threat intelligence feeds',
      ],
      repeatPurchaseOpportunities: [
        'Multi-year enterprise commitment discounts (20% for 3-year agreement)',
        'Departmental tier expansion packages for DevOps engineering teams',
      ],
      customerFeedbackStrategy:
        'Monthly product roadmap review with top 20 enterprise accounts and dedicated Slack/Teams shared channels.',
    },
    growthOpportunities: {
      newAudienceSegments: [
        'Fintech and digital banking startups requiring accelerated SOC 2 Type II certification',
        'Healthcare cloud systems managing HIPAA compliant patient data pipelines',
      ],
      productPositioningOpportunities: [
        'Consolidated Cloud Risk Engine: Replacing separate CSPM, CIEM, and CWPP tools with a single unified graph',
      ],
      geographicExpansionPossibilities: [
        'European expansion targeting GDPR-compliant enterprise accounts',
        'Asia-Pacific financial hub penetration (Singapore, Sydney)',
      ],
      partnershipOpportunities: [
        'Technology partnerships with HashiCorp (Terraform) and GitLab/GitHub CI/CD pipelines',
        'Global System Integrator (GSI) partner network for managed security services',
      ],
      channelExpansion: [
        'AWS and Google Cloud Marketplace listing enabling frictionless drawdown of enterprise cloud commitments',
      ],
      competitiveDifferentiation: [
        'Open-source cloud IAM risk mapping utility on GitHub to capture engineer mindshare',
      ],
    },
    modes: {
      lean: {
        mode: 'lean',
        name: 'Lean Growth',
        tagline: 'Inbound Research & Community-Driven Pipeline',
        mainObjective:
          'Drive organic engineer adoption through open-source tooling, technical research, and founder-led sales.',
        recommendedChannels: [
          'GitHub Open Source Tools',
          'Technical Research Blog',
          'Organic LinkedIn Founder Content',
        ],
        resourceRequirements: 'Low spend ($5,000–$8,000/mo); High founder and engineering time.',
        budgetConsiderations: 'Allocate budget primarily to technical content creation and open-source tooling maintenance.',
        mainAdvantages: ['High brand credibility', 'Low cash burn', 'Sticky engineer advocacy'],
        mainRisks: ['Slower pipeline velocity', 'Sales dependent on founder availability'],
        successCriteria: [
          '1,000 GitHub stars on open-source IAM tool',
          '10 enterprise demo requests per month',
        ],
      },
      balanced: {
        mode: 'balanced',
        name: 'Balanced Growth',
        tagline: 'Targeted ABM & Paid Demand Generation',
        mainObjective:
          'Orchestrated ABM campaigns combined with paid search intent and dedicated SDR outbound prospecting.',
        recommendedChannels: [
          'LinkedIn ABM',
          'Google Search PPC',
          'SDR Email Sequences',
          'Industry Webinars',
        ],
        resourceRequirements: 'Moderate spend ($18,000–$25,000/mo); Dedicated SDR and demand gen lead.',
        budgetConsiderations: 'Allocate 50% to LinkedIn ABM, 25% to search intent, and 25% to SDR enablement.',
        mainAdvantages: [
          'Predictable qualified pipeline generation',
          'Direct access to enterprise decision-makers',
        ],
        mainRisks: ['Requires continuous SDR coaching and account list hygiene'],
        successCriteria: [
          '40+ Sales-Accepted Opportunities (SAOs) per quarter',
          'Average contract value (ACV) > $45,000',
        ],
      },
      accelerated: {
        mode: 'accelerated',
        name: 'Accelerated Growth',
        tagline: 'Enterprise Blitzscaling & Marketplace Co-Selling',
        mainObjective:
          'Aggressive multi-tier ABM, major cybersecurity conference presence (RSA / Black Hat), and AWS Marketplace co-selling.',
        recommendedChannels: [
          'Flagship Event Sponsorships',
          'AWS/Azure Marketplace Co-Sell',
          'High-Touch Executive Dinners',
          'Analyst Relations (Gartner/Forrester)',
        ],
        resourceRequirements: 'High spend ($60,000+/mo); Full enterprise marketing department.',
        budgetConsiderations: 'Requires enterprise event sponsorships and dedicated partner alliance team.',
        mainAdvantages: [
          'Category leadership establishment',
          'Inclusion in Gartner Magic Quadrant / Forrester Wave',
        ],
        mainRisks: ['High cash burn if enterprise deals stall in procurement'],
        successCriteria: [
          'Surpass $5M ARR run rate',
          'Establish 5 Tier-1 GSI implementation partnerships',
        ],
      },
    },
    actionPlan: [
      {
        id: 'task-apex-1',
        title: 'Launch Interactive Cloud Threat Discovery Scan Landing Page',
        description:
          'Deploy dedicated landing page enabling security teams to test a 15-minute read-only cloud risk scan, featuring architecture trust badges and instant sample graph reports.',
        reasonForRecommendation:
          'Provides product-led entry point that demonstrates instant graph value before procurement friction.',
        priority: 'High',
        estimatedEffort: 'High',
        period: 'immediate',
        suggestedStartPeriod: 'Week 1',
        suggestedCompletionPeriod: 'Week 3',
        requiredResources: 'Sandbox cloud environment, frontend dev, security whitepaper',
        responsibleRole: 'Full-Stack Growth Engineer & Product Lead',
        successMetric: 'Visitor-to-scan completion rate > 12%',
        dependencyOnOtherTasks: 'Sandbox cloud tenant environment configured',
        status: 'in_progress',
      },
      {
        id: 'task-apex-2',
        title: 'Build Tier-1 Target Account List for LinkedIn ABM Campaign',
        description:
          'Curate list of 300 cloud-native companies (500–5,000 employees) on AWS/GCP, mapping CISOs, VP Security, and Cloud Architects.',
        reasonForRecommendation:
          'Focuses paid spend exclusively on high-propensity enterprise accounts.',
        priority: 'High',
        estimatedEffort: 'Medium',
        period: 'immediate',
        suggestedStartPeriod: 'Week 1',
        suggestedCompletionPeriod: 'Week 2',
        requiredResources: 'Sales Navigator, ZoomInfo, CRM database',
        responsibleRole: 'Demand Generation Lead & Sales Operations',
        successMetric: '300 fully mapped accounts with verified decision-maker contacts',
        dependencyOnOtherTasks: 'ZoomInfo / Sales Navigator subscription active',
        status: 'completed',
      },
      {
        id: 'task-apex-3',
        title: 'Publish "2026 Multi-Cloud Attack Path Benchmark Report"',
        description:
          'Author and design a comprehensive 24-page research report analyzing 500,000 anonymized cloud assets, highlighting common lateral movement paths.',
        reasonForRecommendation:
          'Positions ApexSec as an authoritative research institution rather than just another vendor.',
        priority: 'High',
        estimatedEffort: 'High',
        period: 'short_term',
        suggestedStartPeriod: 'Week 3',
        suggestedCompletionPeriod: 'Week 6',
        requiredResources: 'Data anonymization script, graphic designer, security researcher',
        responsibleRole: 'Principal Security Researcher & Designer',
        successMetric: '350+ gated whitepaper downloads in first 45 days',
        dependencyOnOtherTasks: 'Data anonymization and legal review complete',
        status: 'not_started',
      },
      {
        id: 'task-apex-4',
        title: 'Execute AWS Marketplace Co-Sell Registration and Listing',
        description:
          'Complete AWS Marketplace Seller registration to enable enterprise prospects to purchase ApexSec using pre-committed AWS Enterprise Discount Program (EDP) funds.',
        reasonForRecommendation:
          'Bypasses enterprise procurement friction and shortens deal cycles by 40+ days.',
        priority: 'High',
        estimatedEffort: 'Medium',
        period: 'medium_term',
        suggestedStartPeriod: 'Month 2',
        suggestedCompletionPeriod: 'Month 3',
        requiredResources: 'AWS partner portal access, pricing schedule, legal agreement',
        responsibleRole: 'Alliances & Channels Director',
        successMetric: 'Live AWS Marketplace listing with 1-click contract procurement',
        dependencyOnOtherTasks: 'AWS Partner Network Tier-2 status verified',
        status: 'not_started',
      },
      {
        id: 'task-apex-5',
        title: 'Host Exclusive 15-Person CISO Private Roundtable Dinner',
        description:
          'Organize an intimate peer-to-peer dinner for enterprise security leaders during Black Hat conference discussing multi-cloud posture challenges without sales pitches.',
        reasonForRecommendation:
          'Builds high-trust executive relationships with senior buyers who disregard cold outreach.',
        priority: 'Medium',
        estimatedEffort: 'High',
        period: 'long_term',
        suggestedStartPeriod: 'Month 4',
        suggestedCompletionPeriod: 'Month 6',
        requiredResources: 'Event budget, private dining venue, guest curation',
        responsibleRole: 'Field Marketing Director & Founder',
        successMetric: '12+ enterprise CISOs in attendance; 5 follow-up pipeline demos',
        dependencyOnOtherTasks: 'Venue booked and executive speaker confirmed',
        status: 'not_started',
      },
    ],
    kpiFramework: [
      {
        id: 'kpi-sao',
        metricName: 'Sales Accepted Opportunities (SAOs)',
        category: 'Acquisition',
        definition: 'Count of prospective enterprise accounts passing strict MEDDPICC qualification criteria.',
        formula: 'Count of Discovery Calls meeting BANT / MEDDPICC Qualification Criteria',
        whyItMatters: 'The ultimate leading indicator of enterprise go-to-market revenue velocity.',
        whichObjectiveItSupports: 'Scaling predictable enterprise pipeline.',
        dataRequired: 'CRM pipeline stage 2 qualification tracking',
        recommendedMeasurementFrequency: 'Monthly',
        benchmarkRange: 'Target: > 14 SAOs per month during balanced growth phase',
      },
      {
        id: 'kpi-cac-payback',
        metricName: 'CAC Payback Period (Months)',
        category: 'Revenue',
        definition: 'Number of months required for gross margin from a customer to recover customer acquisition cost.',
        formula: '(Blended Sales & Marketing Spend / (New ARR * Gross Margin)) * 12',
        whyItMatters: 'Critical metric for B2B SaaS capital efficiency and runway preservation.',
        whichObjectiveItSupports: 'Maintaining efficient enterprise growth.',
        dataRequired: 'Total GTM spend divided by gross-margin adjusted new ARR',
        recommendedMeasurementFrequency: 'Quarterly',
        benchmarkRange: 'Target: < 14 months for mid-market enterprise SaaS',
      },
      {
        id: 'kpi-nrr',
        metricName: 'Net Revenue Retention (NRR)',
        category: 'Retention',
        definition: 'Percentage of recurring revenue retained from existing customers including expansion, contraction, and churn.',
        formula: '((Starting ARR + Expansion - Contraction - Churn) / Starting ARR) * 100',
        whyItMatters: 'Measures compound enterprise value creation and expansion across multi-cloud accounts.',
        whichObjectiveItSupports: 'Building sustainable enterprise valuation.',
        dataRequired: 'Subscription cohort renewal and expansion ARR data',
        recommendedMeasurementFrequency: 'Quarterly',
        benchmarkRange: 'Target: > 120% NRR for top-quartile enterprise cybersecurity',
      },
    ],
    risksAndAssumptions: {
      risks: [
        {
          id: 'risk-procurement',
          risk: 'Enterprise procurement cycles extending beyond 120 days',
          severity: 'High',
          likelihood: 'Medium',
          mitigation:
            'Enable procurement via AWS Marketplace to bypass lengthy custom legal terms.',
        },
        {
          id: 'risk-incumbent-bundling',
          risk: 'Large enterprise suites (Palo Alto, Microsoft) offering free baseline CSPM',
          severity: 'High',
          likelihood: 'High',
          mitigation:
            'Focus marketing messaging on graph attack paths and true breach prevention rather than static compliance checklists.',
        },
      ],
      assumptions: [
        'Average Enterprise Contract Value (ACV) remains above $42,000.',
        'Market transition toward agentless security continues as primary enterprise standard.',
      ],
      limitations: [
        'Requires certified SOC 2 Type II reports to close deals above $50k ACV.',
      ],
    },
    supportingResearchReferences: [
      {
        sourceModule: 'Market Research & Industry Intelligence',
        findingSummary:
          'Cloud Security Posture Management growing at 16.8% CAGR with 73% of enterprises using multi-cloud architectures.',
        confidence: 'High',
      },
      {
        sourceModule: 'Competitor Intelligence & Benchmarking',
        findingSummary:
          'Wiz dominates top-of-market with high pricing ($80k+ minimums); creates fertile mid-market opening for accessible modern alternative.',
        confidence: 'High',
      },
    ],
  },
];

export class UnifiedStrategyService {
  /**
   * Evaluates project data across all modules and calculates a transparent Data Completeness Audit.
   */
  public calculateCompletenessAudit(project: MarketingProject): DataCompletenessAudit {
    const hasBusiness = Boolean(
      project.business &&
        project.business.brandName &&
        project.business.industry &&
        project.business.businessType
    );

    const hasProducts = Boolean(
      project.products &&
        project.products.length > 0 &&
        project.products.some((p) => p.name && p.sellingPrice !== undefined)
    );

    // Cross-check audience intelligence module
    const latestAudience = audienceService.getLatestAnalysis(project.id);
    const hasAudience = Boolean(
      latestAudience ||
        (project.audience &&
          project.audience.needsAndProblems &&
          project.audience.mainPainPoints?.length)
    );

    // Cross-check market research module
    const latestResearch = marketResearchService.getLatestReport(project.id);
    const hasMarketResearch = Boolean(latestResearch);

    // Cross-check competitor analysis module
    const competitorReports = competitorService.getReports(project.id);
    const competitorList = competitorService.getCompetitors(project.id);
    const hasCompetitors = Boolean(
      (competitorReports && competitorReports.length > 0) ||
      (competitorList && competitorList.length > 0)
    );

    const hasBudget = Boolean(
      project.marketing?.monthlyBudget && project.marketing.monthlyBudget > 0
    );

    const modules = {
      businessProfile: hasBusiness,
      productAnalysis: hasProducts,
      audienceIntelligence: hasAudience,
      marketResearch: hasMarketResearch,
      competitorAnalysis: hasCompetitors,
      budgetSpecified: hasBudget,
    };

    const contributingModules: string[] = [];
    const missingModules: string[] = [];

    if (hasBusiness) contributingModules.push('Business Profile');
    else missingModules.push('Business Profile & Industry Details');

    if (hasProducts) contributingModules.push('Product Portfolio & Unit Economics');
    else missingModules.push('Product Pricing & Feature Details');

    if (hasAudience) contributingModules.push('Audience Intelligence & Personas');
    else missingModules.push('Audience Research (Run Audience Analyzer)');

    if (hasMarketResearch) contributingModules.push('Market Research & PESTLE Intelligence');
    else missingModules.push('Market Research Report (Run Market Research Engine)');

    if (hasCompetitors) contributingModules.push('Competitor Benchmarking & SWOT');
    else missingModules.push('Competitor Analysis (Run Competitor Engine)');

    if (hasBudget) contributingModules.push('Specified Monthly Budget');
    else missingModules.push('Marketing Budget (Enter budget in Project Details)');

    const countTrue = Object.values(modules).filter(Boolean).length;
    const overallScore = Math.round((countTrue / 6) * 100);

    const conflictingSignals: string[] = [];
    if (
      project.business?.businessType === 'B2B' &&
      project.marketing?.currentChannels?.includes('TikTok')
    ) {
      conflictingSignals.push(
        'B2B enterprise model selected alongside TikTok as a primary channel without employee advocacy motion.'
      );
    }

    const unverifiedAssumptions: string[] = [];
    if (!hasBudget) {
      unverifiedAssumptions.push(
        'No marketing budget specified; recommendations provide baseline lean and scaled resource scenarios.'
      );
    }
    if (!hasMarketResearch) {
      unverifiedAssumptions.push(
        'Market demand signals are estimated from industry averages rather than custom research analysis.'
      );
    }
    if (!hasCompetitors) {
      unverifiedAssumptions.push(
        'Competitive differentiation is generalized without verified competitor pricing or feature benchmarks.'
      );
    }

    return {
      overallScore,
      modules,
      contributingModules,
      missingModules,
      conflictingSignals,
      unverifiedAssumptions,
    };
  }

  /**
   * Retrieves all saved strategies, optionally filtered by projectId.
   */
  public getStrategies(projectId?: string): UnifiedMarketingStrategy[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let list: UnifiedMarketingStrategy[] = raw
        ? JSON.parse(raw)
        : DEMO_UNIFIED_STRATEGIES;

      if (!list || list.length === 0) {
        list = DEMO_UNIFIED_STRATEGIES;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }

      if (projectId) {
        return list.filter((s) => s.projectId === projectId);
      }
      return list;
    } catch {
      if (projectId) {
        return DEMO_UNIFIED_STRATEGIES.filter((s) => s.projectId === projectId);
      }
      return DEMO_UNIFIED_STRATEGIES;
    }
  }

  /**
   * Retrieves a single strategy by its ID.
   */
  public getStrategyById(id: string): UnifiedMarketingStrategy | undefined {
    const list = this.getStrategies();
    return list.find((s) => s.id === id);
  }

  /**
   * Retrieves the latest strategy for a given project.
   */
  public getLatestStrategy(projectId: string): UnifiedMarketingStrategy | undefined {
    const list = this.getStrategies(projectId);
    if (!list || list.length === 0) return undefined;
    return [...list].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }

  /**
   * Persists or updates a strategy.
   */
  public saveStrategy(strategy: UnifiedMarketingStrategy): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: UnifiedMarketingStrategy[] = raw
        ? JSON.parse(raw)
        : [...DEMO_UNIFIED_STRATEGIES];

      const idx = list.findIndex((s) => s.id === strategy.id);
      let updated: UnifiedMarketingStrategy[];
      if (idx >= 0) {
        updated = [...list];
        updated[idx] = { ...strategy, updatedAt: new Date().toISOString() };
      } else {
        updated = [strategy, ...list];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Unable to persist strategy to LocalStorage:', err);
    }
  }

  /**
   * Updates an individual task status in an existing strategy and persists the change.
   */
  public updateTaskStatus(
    strategyId: string,
    taskId: string,
    newStatus: TaskStatus
  ): void {
    const strategy = this.getStrategyById(strategyId);
    if (!strategy) return;

    const taskIndex = strategy.actionPlan.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    const task = strategy.actionPlan[taskIndex];
    if (task) {
      task.status = newStatus;
      strategy.updatedAt = new Date().toISOString();
      this.saveStrategy(strategy);
    }
  }

  /**
   * Renames a strategy title.
   */
  public updateStrategyTitle(id: string, newTitle: string): void {
    const strategy = this.getStrategyById(id);
    if (!strategy) return;
    strategy.strategyTitle = newTitle.trim();
    this.saveStrategy(strategy);
  }

  /**
   * Deletes a strategy by ID.
   */
  public deleteStrategy(id: string): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: UnifiedMarketingStrategy[] = raw
        ? JSON.parse(raw)
        : [...DEMO_UNIFIED_STRATEGIES];

      const filtered = list.filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.warn('Unable to delete strategy from LocalStorage:', err);
    }
  }

  /**
   * Generates a new Unified Marketing Strategy via server-side Gemini AI proxy,
   * falling back to local deterministic synthesis if offline or unconfigured.
   */
  public async generateUnifiedStrategy(
    project: MarketingProject,
    options?: {
      focusMode?: 'lean' | 'balanced' | 'accelerated';
      timeframe?: string;
      specificQuestions?: string;
    }
  ): Promise<UnifiedMarketingStrategy> {
    const completenessAudit = this.calculateCompletenessAudit(project);

    try {
      const res = await fetch('/api/generate-unified-strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ project, options }),
      });

      const data = await res.json();

      if (res.ok && data.ok && data.strategy) {
        const generated = data.strategy as UnifiedMarketingStrategy;
        const existing = this.getStrategies(project.id);
        generated.version = existing.length + 1;
        generated.completenessAudit = completenessAudit;
        this.saveStrategy(generated);
        return generated;
      }
    } catch (err) {
      console.info('Server AI generation unavailable, synthesizing offline plan:', err);
    }

    // Deterministic offline fallback synthesis
    return this.generateOfflineFallbackStrategy(project, completenessAudit, options);
  }

  /**
   * Deterministic client-side synthesis when AI server proxy is not reachable.
   */
  private generateOfflineFallbackStrategy(
    project: MarketingProject,
    audit: DataCompletenessAudit,
    options?: {
      focusMode?: 'lean' | 'balanced' | 'accelerated';
      timeframe?: string;
      specificQuestions?: string;
    }
  ): UnifiedMarketingStrategy {
    const now = new Date().toISOString();
    const existing = this.getStrategies(project.id);
    const brand = project.business?.brandName || 'Brand';
    const industry = project.business?.industry || 'Commercial Market';
    const primaryProduct = project.products?.[0];
    const priceStr = primaryProduct?.sellingPrice ? `$${primaryProduct.sellingPrice}` : 'competitive value';

    const fallback: UnifiedMarketingStrategy = {
      id: `strat-${Date.now()}`,
      projectId: project.id,
      projectName: brand,
      strategyTitle: `Comprehensive Marketing Action Plan — ${brand}`,
      version: existing.length + 1,
      createdAt: now,
      updatedAt: now,
      modelIdentifier: 'Sparkline Deterministic Strategy Engine (Offline Synthesizer)',
      completenessAudit: audit,
      executiveSummary: {
        businessSituation: `${brand} operates within the ${industry} space with a product offering priced at ${priceStr}. Commercial success depends on building a clear acquisition funnel with transparent differentiation.`,
        mainMarketingObjective: `Establish a profitable customer acquisition flywheel for ${brand} while maintaining sustainable unit economics.`,
        biggestOpportunity: `Capitalize on high-intent search and targeted social proof to capture buyers seeking dependable alternatives.`,
        mainChallenge: `Mitigating digital ad auction inflation and building credibility against established incumbents.`,
        recommendedStrategicDirection: `Prioritize high-leverage organic and intent-driven channels first, pairing transparent educational content with high-converting landing pages.`,
      },
      brandPositioning: {
        recommendedPositioning: `The trusted, transparent choice in ${industry}: verified outcomes with zero hidden compromise.`,
        uniqueSellingProposition: primaryProduct?.usp
          ? primaryProduct.usp
          : primaryProduct?.features?.[0]
          ? `${primaryProduct.features[0]} tailored specifically for discerning buyers.`
          : `Engineered for superior reliability, transparency, and customer satisfaction.`,
        coreBrandMessage: `Better Results. Transparent Value. Built for You.`,
        competitiveDifferentiation: `Direct customer focus, accessible pricing, and rigorous proof compared to legacy conglomerate alternatives.`,
        brandPersonality: ['Insightful', 'Pragmatic', 'Transparent', 'Results-Driven'],
        toneOfVoice: 'Clear, grounded, professional, and free from misleading marketing jargon.',
      },
      targetAudienceStrategy: {
        primarySegment:
          project.audience?.needsAndProblems ||
          `Value-and-Quality Conscious Buyers in ${industry}`,
        secondarySegments: [
          'Emerging Explorers seeking specialized alternatives',
          'Efficiency Maximizers focused on measurable outcomes',
        ],
        customerPainPoints: project.audience?.mainPainPoints?.length
          ? project.audience.mainPainPoints
          : ['High prices with low quality', 'Lack of product transparency', 'Unreliable customer support'],
        purchaseMotivations: ['Verified performance', 'Cost-effective quality', 'Peace of mind'],
        recommendedMessaging: [
          `Discover how ${brand} delivers superior value without compromise`,
          `Transparent quality backed by customer satisfaction guarantees`,
          `Smarter outcomes built for modern needs`,
        ],
        audiencePriorities: [
          'Highlight transparent pricing and verified customer feedback',
          'Provide clear product specifications and risk-free trial guarantee',
        ],
      },
      channels: [
        {
          channelName: 'High-Intent Search & SEO',
          isPrioritized: true,
          strategicPurpose: 'Capture active problem-aware buyers searching for specific solutions',
          targetAudience: 'Reaches customers at the exact moment of commercial purchase intent',
          recommendedActivity:
            'Target high-intent transactional search keywords and publish comparison guides addressing alternatives.',
          funnelStage: 'BOFU',
          requiredResources: 'Medium: Keyword research, copywriting, and bid management',
          suggestedKpis: ['Search ROAS > 3.0x', 'Conversion Rate > 3.0%'],
          potentialLimitations: 'Finite search volume requires complementary awareness channels',
        },
        {
          channelName: 'Paid Social & Creative Video',
          isPrioritized: true,
          strategicPurpose: 'Generate category demand through visual demonstrations and customer testimonials',
          targetAudience: 'Reaches broad demographic cohorts during passive discovery',
          recommendedActivity:
            'Test 3-4 video creative angles highlighting unique product differentiators.',
          funnelStage: 'TOFU',
          requiredResources: 'High: Creative production and regular asset refreshes',
          suggestedKpis: ['Blended CAC < $40', 'CTR > 1.8%'],
          potentialLimitations: 'Creative fatigue requires ongoing production pipeline',
        },
        {
          channelName: 'Lifecycle Email & Customer Retention',
          isPrioritized: true,
          strategicPurpose: 'Drive repeat purchases, referrals, and maximize lifetime customer value',
          targetAudience: 'Engages verified buyers and warm leads who opted in for updates',
          recommendedActivity:
            'Deploy automated welcome series and post-purchase onboarding sequence.',
          funnelStage: 'Retention',
          requiredResources: 'Low to Medium: Initial flow setup and monthly campaign planning',
          suggestedKpis: ['Email Revenue Share > 25%', 'Repeat Order Rate > 30%'],
          potentialLimitations: 'Dependent on quality and consent of email subscriber base',
        },
      ],
      contentStrategy: {
        contentPillars: [
          'Educational Authority & Buyer Guides',
          'Customer Proof & Case Studies',
          'Product Comparison & Value Teardowns',
        ],
        educationalContent: [
          `How to evaluate quality in ${industry}`,
          `5 common mistakes when choosing an alternative`,
          `The definitive guide to getting the most from your investment`,
        ],
        promotionalContent: [
          'First-order introductory discount incentive',
          'Bundle savings and seasonal offers',
        ],
        engagementContent: [
          'Customer poll on upcoming feature priorities',
          'Interactive routine and product match assessment',
        ],
        trustBuildingContent: [
          'Satisfaction guarantees and warranty documentation',
          'Customer testimonial interviews and case study reviews',
        ],
        contentFormats: ['How-to Guides', 'Short-form Social Videos', 'Case Studies', 'Interactive Assessments'],
        messagingAngles: [
          'Direct value without intermediary markup',
          'Engineered for verifiable performance',
        ],
        recommendedPublishingApproach:
          '2x weekly social posts, 1x weekly email newsletter, 2x monthly long-form articles',
      },
      customerAcquisition: {
        leadGenerationOpportunities: [
          'Direct lead capture via interactive assessment quiz or free consultation offer',
          'Downloadable industry checklist or buying guide',
        ],
        conversionImprovements: [
          'Clear value proposition and prominent satisfaction guarantee badges above fold',
          'Fast-loading checkout with digital wallet support',
        ],
        landingPageRecommendations: [
          'Dedicated product comparison lander answering top 5 buyer objections',
          'Mobile-optimized product page with real customer reviews',
        ],
        offerStrategy: 'Risk-free introductory trial or starter bundle with satisfaction guarantee.',
        retargetingOpportunities: [
          'Sequenced retargeting focusing on customer testimonials and risk-free guarantees',
        ],
        acquisitionConsiderations:
          'Focus on lowering initial conversion barriers and building immediate trust.',
      },
      customerRetention: {
        customerRelationshipActivities: [
          'Dedicated onboarding email flow ensuring proper product setup',
          'CSAT customer satisfaction survey sent 14 days after purchase',
        ],
        emailOrMessagingOpportunities: [
          'Post-Purchase Onboarding Series (Days 1, 7, 21)',
          'Replenishment / Subscription Reminder Flow',
          'Customer Feedback & Review Request Flow',
        ],
        loyaltyInitiatives: [
          'VIP customer referral rewards program',
          'Exclusive early access to new releases or feature updates',
        ],
        repeatPurchaseOpportunities: [
          'Subscription discount for recurring automatic delivery',
          'Cross-sell complementary products with one-click post-purchase offer',
        ],
        customerFeedbackStrategy:
          'Automated CSAT survey sent 14 days after product delivery, with direct reply to founder.',
      },
      growthOpportunities: {
        newAudienceSegments: [
          'Adjacent demographic cohorts seeking simplified alternatives',
          'Regional expansion into secondary geographic markets',
        ],
        productPositioningOpportunities: [
          'Premium Value Tier: Emphasizing superior quality at accessible direct-to-consumer pricing',
        ],
        geographicExpansionPossibilities: [
          'Expand to national coverage and explore cross-border English-speaking markets',
        ],
        partnershipOpportunities: [
          'Affiliate and co-marketing partnerships with non-competing industry brands',
        ],
        channelExpansion: [
          'Wholesale partner trials and marketplace storefronts',
        ],
        competitiveDifferentiation: [
          '100% transparent pricing and direct-from-manufacturer quality assurance',
        ],
      },
      modes: {
        lean: {
          mode: 'lean',
          name: 'Lean Growth',
          tagline: 'Organic & Creator-First Customer Acquisition',
          mainObjective: 'Cost-efficient organic and creator-first motion with minimal capital risk.',
          recommendedChannels: ['Content SEO', 'Organic Social Media', 'Referrals', 'Lifecycle Email'],
          resourceRequirements: 'Low spend ($1,500–$3,000/mo); High internal founder time.',
          budgetConsiderations: 'Allocate budget to content production and customer gifting.',
          mainAdvantages: ['Minimal financial risk', 'Builds long-term organic assets'],
          mainRisks: ['Slower initial velocity', 'Requires intensive internal founder time'],
          successCriteria: ['First 100 organic customers', 'Consistently positive customer reviews'],
        },
        balanced: {
          mode: 'balanced',
          name: 'Balanced Growth',
          tagline: 'Integrated Multi-Channel Paid & Retention Engine',
          mainObjective: 'Sustainable blend of paid acquisition and retention balancing velocity and capital efficiency.',
          recommendedChannels: ['Paid Search', 'Targeted Social Ads', 'Content Hub', 'Klaviyo Email'],
          resourceRequirements: 'Moderate spend ($5,000–$10,000/mo); Dedicated growth marketer.',
          budgetConsiderations: 'Allocate 60% to paid media, 20% to retention, 20% to creative assets.',
          mainAdvantages: ['Predictable customer acquisition velocity', 'Compound retention value'],
          mainRisks: ['Ad spend inflation requires rigorous CPA discipline'],
          successCriteria: ['Consistent month-over-month revenue growth', 'Blended ROAS > 3.0x'],
        },
        accelerated: {
          mode: 'accelerated',
          name: 'Accelerated Growth',
          tagline: 'High-Velocity Multi-Channel Category Scale',
          mainObjective: 'High-velocity multi-channel scaling across paid media, influencer partnerships, and PR.',
          recommendedChannels: ['Paid Search', 'Paid Social Blitz', 'Influencer Sponsorships', 'Affiliate Network'],
          resourceRequirements: 'High spend ($20,000+/mo); Full agency or marketing team.',
          budgetConsiderations: 'Requires substantial working capital buffer.',
          mainAdvantages: ['Rapid category market share capture', 'Fast statistical feedback loops'],
          mainRisks: ['High cash burn if conversion rates decline'],
          successCriteria: ['Category leadership recognition', 'Scalable acquisition engine'],
        },
      },
      actionPlan: [
        {
          id: 'task-fall-1',
          title: 'Deploy High-Converting Product Landing Page',
          description: `Build a dedicated landing page for ${primaryProduct?.name || 'core product'} with clear value propositions, customer reviews, and risk-free guarantees.`,
          reasonForRecommendation: 'Establishes high-converting baseline for all marketing traffic.',
          priority: 'High',
          estimatedEffort: 'Medium',
          period: 'immediate',
          suggestedStartPeriod: 'Week 1',
          suggestedCompletionPeriod: 'Week 2',
          requiredResources: 'Landing page builder, product imagery, copywriting',
          responsibleRole: 'Growth Marketer',
          successMetric: 'Conversion rate > 3.0% on direct traffic',
          dependencyOnOtherTasks: 'Product imagery and copy approved',
          status: 'not_started',
        },
        {
          id: 'task-fall-2',
          title: 'Configure Automated Post-Purchase Customer Onboarding Series',
          description: 'Set up automated email sequence ensuring buyers understand how to get optimal value from their purchase.',
          reasonForRecommendation: 'Ensures initial customer satisfaction and lowers refund rates.',
          priority: 'High',
          estimatedEffort: 'Low',
          period: 'immediate',
          suggestedStartPeriod: 'Week 1',
          suggestedCompletionPeriod: 'Week 2',
          requiredResources: 'Email platform account, copy templates',
          responsibleRole: 'Email Specialist',
          successMetric: 'Email open rate > 45%, Customer satisfaction > 90%',
          dependencyOnOtherTasks: 'Email platform connected',
          status: 'not_started',
        },
        {
          id: 'task-fall-3',
          title: 'Launch High-Intent Search Campaign',
          description: 'Target exact-match search terms where prospective buyers have demonstrated direct purchase intent.',
          reasonForRecommendation: 'Generates immediate qualified customer acquisitions.',
          priority: 'High',
          estimatedEffort: 'Medium',
          period: 'short_term',
          suggestedStartPeriod: 'Week 3',
          suggestedCompletionPeriod: 'Week 4',
          requiredResources: 'Google Ads account, keyword research list',
          responsibleRole: 'PPC Specialist',
          successMetric: 'ROAS > 3.0x on targeted search queries',
          dependencyOnOtherTasks: 'Landing page live',
          status: 'not_started',
        },
        {
          id: 'task-fall-4',
          title: 'Publish 4 In-Depth Educational Guides for SEO',
          description: 'Create authoritative educational resources addressing the most common questions buyers ask before purchasing.',
          reasonForRecommendation: 'Compounds long-term zero-CAC organic traffic.',
          priority: 'Medium',
          estimatedEffort: 'Medium',
          period: 'short_term',
          suggestedStartPeriod: 'Week 4',
          suggestedCompletionPeriod: 'Week 6',
          requiredResources: 'Content writer, SEO keyword list',
          responsibleRole: 'Content Writer',
          successMetric: 'Organic search traffic growth > 20% MoM',
          dependencyOnOtherTasks: 'Content outline approved',
          status: 'not_started',
        },
        {
          id: 'task-fall-5',
          title: 'Implement Customer Loyalty & Referral Incentives',
          description: 'Provide an easy mechanism for delighted customers to refer friends and earn rewards on future purchases.',
          reasonForRecommendation: 'Turns happy customers into an organic acquisition channel.',
          priority: 'Medium',
          estimatedEffort: 'Medium',
          period: 'medium_term',
          suggestedStartPeriod: 'Month 2',
          suggestedCompletionPeriod: 'Month 3',
          requiredResources: 'Referral software setup, reward codes',
          responsibleRole: 'Operations Lead',
          successMetric: 'Referrals account for > 10% of new monthly orders',
          dependencyOnOtherTasks: 'Referral program software setup',
          status: 'not_started',
        },
      ],
      kpiFramework: [
        {
          id: 'kpi-cac-fall',
          metricName: 'Customer Acquisition Cost (CAC)',
          category: 'Acquisition',
          definition: 'Total sales and marketing expenditure divided by the number of new paying customers acquired.',
          formula: 'Total Marketing Spend / Total New Customers',
          whyItMatters: 'Guarantees profitable unit economics as ad spend scales.',
          whichObjectiveItSupports: 'Maintaining profitable acquisition.',
          dataRequired: 'Advertising spend and new customer count',
          recommendedMeasurementFrequency: 'Weekly',
          benchmarkRange: 'Target: Keep CAC under 40% of first-order AOV',
        },
        {
          id: 'kpi-roas-fall',
          metricName: 'Return on Ad Spend (ROAS)',
          category: 'Revenue',
          definition: 'Total revenue generated from advertising divided by total advertising spend.',
          formula: 'Total Revenue from Ads / Total Ad Spend',
          whyItMatters: 'Measures direct revenue yield of advertising investments.',
          whichObjectiveItSupports: 'Ensuring profitable media spending.',
          dataRequired: 'Ad platform conversion tracking and revenue data',
          recommendedMeasurementFrequency: 'Weekly',
          benchmarkRange: 'Target: > 3.0x blended ROAS',
        },
        {
          id: 'kpi-cvr-fall',
          metricName: 'Storefront Conversion Rate',
          category: 'Acquisition',
          definition: 'Percentage of unique website sessions that result in a completed transaction.',
          formula: '(Total Transactions / Total Sessions) * 100',
          whyItMatters: 'High conversion rate maximizes return on all traffic sources.',
          whichObjectiveItSupports: 'Maximizing website efficiency.',
          dataRequired: 'Analytics sessions and order transactions',
          recommendedMeasurementFrequency: 'Weekly',
          benchmarkRange: 'Target: > 2.5% to 3.5%',
        },
      ],
      risksAndAssumptions: {
        risks: [
          {
            id: 'risk-cpa',
            risk: 'Digital ad platform price volatility',
            severity: 'Medium',
            likelihood: 'High',
            mitigation: 'Diversify traffic across organic search, email retention, and referral partnerships.',
          },
        ],
        assumptions: [
          'Product gross margin provides sufficient buffer for advertising acquisition costs.',
          'Customer service responds to inquiries within 24 hours to preserve brand trust.',
        ],
        limitations: [
          'Calculations are based on industry benchmarks in the absence of historic brand analytics.',
        ],
      },
      supportingResearchReferences: [
        {
          sourceModule: 'Business Profile Analysis',
          findingSummary: `Targeting ${industry} with focus on customer-centric value positioning.`,
          confidence: 'High',
        },
      ],
    };

    if (options?.focusMode && fallback.modes[options.focusMode]) {
      fallback.executiveSummary.recommendedStrategicDirection = fallback.modes[options.focusMode].mainObjective;
    }

    this.saveStrategy(fallback);
    return fallback;
  }
}

export const unifiedStrategyService = new UnifiedStrategyService();
