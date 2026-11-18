/**
 * Advertising Campaign Studio Service
 * Sparkline Marketing Intelligence Platform — Phase 16
 */

import {
  AdvertisingCampaign,
  CampaignTemplate,
  CampaignCopyVariation,
  CampaignCreativeBrief,
  CampaignPerformance,
  CampaignOptimization,
  AICampaignPlanResult,
  CampaignPlatform,
  CampaignObjective,
  CampaignStatus,
} from '@/types/campaign';
import { MarketingProject } from '@/types/project';
import { projectService } from './project.service';
import { securityService } from './security.service';
import { auditService } from './audit.service';

const STORAGE_KEY = 'sparkline_marketing_campaigns';

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: 'tpl_product_launch',
    name: 'New Product Launch Accelerator',
    category: 'Product Go-To-Market',
    objective: 'Sales and Conversions',
    recommendedPlatforms: ['Meta Ads', 'Google Ads', 'TikTok Ads'],
    description:
      'A multi-phased launch campaign designed to build anticipation, capture early-adopter sales, and scale social proof.',
    suggestedAudience: 'Early adopters, high-intent category enthusiasts, and lookalikes of email VIPs.',
    suggestedBudgetType: '40% Video Awareness, 40% Direct Conversion, 20% Dynamic Retargeting',
    suggestedDuration: '30-45 Days',
    structureSummary: 'Campaign → 3 Ad Sets (Cold Lookalikes, Interest Intersect, Warm Retargeting) → 6 Creative Variations',
    sampleHeadline: 'Meet The Future of Your Daily Workflow',
    samplePrimaryText:
      'Engineered from the ground up for modern teams. Experience unmatched speed and seamless intelligence. Limited launch offer inside.',
    sampleCta: 'Shop Now',
  },
  {
    id: 'tpl_ecommerce_conversion',
    name: 'E-commerce DTC Conversion Machine',
    category: 'Direct-to-Consumer',
    objective: 'Sales and Conversions',
    recommendedPlatforms: ['Meta Ads', 'TikTok Ads', 'Pinterest Ads'],
    description:
      'High-converting product catalog and short-form video framework optimized for purchases, ROAS, and customer acquisition.',
    suggestedAudience: 'In-market shoppers, engaged social video viewers, and previous website visitors.',
    suggestedBudgetType: '70% Prospecting (Broad/Advantage+), 30% Dynamic Product Retargeting',
    suggestedDuration: 'Ongoing / Evergreen',
    structureSummary: 'Prospecting Ad Set + Cart Abandoner Retargeting Ad Set + Customer Retention Loop',
    sampleHeadline: 'Elevate Your Everyday Standard',
    samplePrimaryText:
      'Over 10,000 customers have made the switch. Enjoy premium craft, guaranteed satisfaction, and complimentary expedited shipping.',
    sampleCta: 'Order Today',
  },
  {
    id: 'tpl_b2b_lead_gen',
    name: 'B2B Enterprise Lead Engine',
    category: 'B2B & SaaS',
    objective: 'Lead Generation',
    recommendedPlatforms: ['LinkedIn Ads', 'Google Ads'],
    description:
      'Account-targeted lead generation framework using high-intent Google Search and LinkedIn Sponsored Content to capture executive leads.',
    suggestedAudience: 'Job Titles: Director, VP, Head of Marketing, Founders in target headcount tiers (50-500 employees).',
    suggestedBudgetType: '60% Google Search (High-Intent PPC), 40% LinkedIn Lead Gen Forms',
    suggestedDuration: 'Quarterly (90 Days)',
    structureSummary: 'Search Intent Ad Groups (Brand, Solution, Competitor Alternative) + LinkedIn In-Feed Lead Gen Form',
    sampleHeadline: 'Scale Smarter. Automate Your Marketing Operations.',
    samplePrimaryText:
      'Stop losing hours to fragmented reporting. See how leading enterprise teams consolidate workflows and cut acquisition friction. Read the executive guide.',
    sampleCta: 'Download Whitepaper',
  },
  {
    id: 'tpl_brand_reach',
    name: 'Omni-Channel Brand Awareness & Reach',
    category: 'Brand Equity',
    objective: 'Brand Awareness',
    recommendedPlatforms: ['YouTube Ads', 'Meta Ads', 'TikTok Ads'],
    description:
      'Broad category distribution using high-impact video storytelling and sequential messaging to maximize brand recall.',
    suggestedAudience: 'Broad category demographic (Ages 21-55), mass reach with affinity topic inclusions.',
    suggestedBudgetType: '50% Non-Skippable & In-Stream YouTube, 50% Meta Reels & Feed Video Views',
    suggestedDuration: '30-60 Days',
    structureSummary: 'Top of Funnel Video Storytelling Ad Group → 15s Hook Variations + 6s Bumper Ads',
    sampleHeadline: 'Built For Those Who Demand Better',
    samplePrimaryText:
      'Innovation is not an accident—it is a commitment to superior craft. Discover what sets us apart.',
    sampleCta: 'Learn More',
  },
  {
    id: 'tpl_high_intent_traffic',
    name: 'High-Intent Search Traffic Capture',
    category: 'Search Marketing',
    objective: 'Website Traffic',
    recommendedPlatforms: ['Google Ads', 'Pinterest Ads'],
    description:
      'Capture prospective buyers actively searching for your solutions and relevant product categories.',
    suggestedAudience: 'High commercial intent search queries, in-market audiences, and search remarketing lists.',
    suggestedBudgetType: '85% Search Click PPC, 15% Search Remarketing Buffer',
    suggestedDuration: 'Ongoing / Evergreen',
    structureSummary: 'Exact Match Intent Ad Groups + Broad Match with Automated Smart Bidding',
    sampleHeadline: 'Top-Rated Marketing Intelligence Platform',
    samplePrimaryText:
      'Compare features, explore live metrics, and see why top brands choose Sparkline. Free onboarding session included.',
    sampleCta: 'Visit Website',
  },
  {
    id: 'tpl_local_business',
    name: 'Local Foot Traffic & Geo-Targeted Promo',
    category: 'Local & Regional',
    objective: 'Reach',
    recommendedPlatforms: ['Meta Ads', 'Google Ads'],
    description:
      'Radius-bounded advertising designed to drive regional visits, foot traffic, local store bookings, or calls.',
    suggestedAudience: 'Within 10-25 mile radius of physical location, interest in local lifestyle and dining.',
    suggestedBudgetType: '70% Local Meta Ads with Map / Call Extensions, 30% Google Local Pack Search',
    suggestedDuration: 'Ongoing Monthly Pacing',
    structureSummary: 'Radius Ad Set with Store Address Pins + Click-to-Call Ad Creative',
    sampleHeadline: 'Your New Favorite Local Destination',
    samplePrimaryText:
      'Visit us today in downtown and enjoy exclusive in-person perks. Tap below for directions and opening hours.',
    sampleCta: 'Get Directions',
  },
  {
    id: 'tpl_seasonal_sale',
    name: 'Seasonal Flash Sale & Holiday Push',
    category: 'Promotion',
    objective: 'Sales and Conversions',
    recommendedPlatforms: ['Meta Ads', 'TikTok Ads', 'Google Ads'],
    description:
      'High-urgency promotional campaign structured for holiday weekends, Black Friday / Cyber Monday, or seasonal clearances.',
    suggestedAudience: 'All past purchasers, email subscribers, and engaged social followers from the past 90 days.',
    suggestedBudgetType: '20% Pre-Sale Teaser, 70% 72-Hour Flash Sale Blitz, 10% Last-Chance Recovery',
    suggestedDuration: '7-14 Days',
    structureSummary: 'Teaser Phase → Live Sale Urgency Ad Set → Countdown Last Hours Ad Set',
    sampleHeadline: 'Limited Time: Up to 35% Off Everything',
    samplePrimaryText:
      'Our biggest event of the season is officially live. Stock is strictly limited and moves fast. Claim your savings before midnight.',
    sampleCta: 'Shop Sale',
  },
  {
    id: 'tpl_retargeting_recovery',
    name: 'Abandoned Cart & High-Intent Retargeting',
    category: 'Retention & Conversion',
    objective: 'Sales and Conversions',
    recommendedPlatforms: ['Meta Ads', 'Google Ads'],
    description:
      'Laser-focused remarketing funnel targeting high-intent visitors who added items to cart or visited pricing without buying.',
    suggestedAudience: 'ViewContent 14-day, AddToCart 7-day, InitiateCheckout 3-day (excluding recent purchasers).',
    suggestedBudgetType: '100% Retargeting Auction Priority',
    suggestedDuration: 'Ongoing / Evergreen',
    structureSummary: 'Day 1-3 Objection Handler Ad Set → Day 4-7 Social Proof Ad Set → Day 8-14 Urgency Ad Set',
    sampleHeadline: 'Still Thinking About It? We Saved Your Order.',
    samplePrimaryText:
      'Your cart is waiting. Complete your purchase in under 60 seconds with complimentary express delivery and easy returns.',
    sampleCta: 'Complete Order',
  },
];

export class CampaignService {
  /**
   * Generates a fully populated initial campaign for a project or blank canvas
   */
  createBlankCampaign(project?: MarketingProject | null, templateId?: string): AdvertisingCampaign {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 30);
    const formatDt = (d: Date): string => d.toISOString().split('T')[0] || '';

    const tpl = templateId ? CAMPAIGN_TEMPLATES.find((t) => t.id === templateId) : null;
    const prod = project?.products?.[0];
    const brand = project?.business?.brandName || 'My Brand';
    const prodName = prod?.name || `${brand} Core Product`;
    const industry = project?.business?.industry || 'Technology & Software';
    const location =
      project?.audience?.targetLocations?.join(', ') ||
      project?.business?.location ||
      'United States, Canada, United Kingdom';

    const defaultCurrency = prod?.currency || 'USD';
    const totalBudget = project?.marketing?.monthlyBudget || 4000;
    const adSpend = Math.round(totalBudget * 0.75);

    const platforms: CampaignPlatform[] = tpl?.recommendedPlatforms || ['Meta Ads', 'Google Ads'];
    const objective: CampaignObjective = tpl?.objective || 'Sales and Conversions';

    const platformAllocations: Partial<Record<CampaignPlatform, number>> = {};
    const splitAmount = Math.round(adSpend / platforms.length);
    platforms.forEach((p) => {
      platformAllocations[p] = splitAmount;
    });

    const campaignId = `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return {
      id: campaignId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: tpl ? `${brand} — ${tpl.name}` : `${brand} — ${objective} Campaign`,
      projectId: project?.id || '',
      projectName: brand,
      productService: prodName,
      industry: industry,
      targetLocation: location,
      description:
        tpl?.description ||
        `High-impact advertising campaign focused on driving ${objective.toLowerCase()} across ${platforms.join(' and ')}.`,
      objective,
      status: 'Planned',
      platforms,
      audience: {
        targetLocation: location,
        ageRange: project?.audience?.ageRanges?.join(', ') || '25-54',
        customerType: (project?.audience?.customerType as string) || 'Both',
        interests: project?.audience?.interests || [
          'Technology',
          'Online Shopping',
          'Productivity',
        ],
        behaviors: ['Engaged Shoppers', 'Digital Early Adopters'],
        audienceNeeds:
          project?.audience?.needsAndProblems ||
          'Seeking streamlined, verified, high-performance solutions.',
        painPoints: project?.audience?.mainPainPoints || [
          'High acquisition costs',
          'Wasted ad spend',
          'Lack of clear performance tracking',
        ],
        languages: project?.audience?.preferredLanguages || ['English'],
        exclusions: ['Existing Customers (Past 30 Days)'],
        customAudienceNotes:
          'Build lookalike audiences (1-2%) from verified customers and high-intent website visitors.',
        isAiSuggested: false,
      },
      budget: {
        totalBudget,
        adSpend,
        creativeBudget: Math.round(totalBudget * 0.15),
        testingBudget: Math.round(totalBudget * 0.1),
        currency: defaultCurrency,
        pacePreference: 'Daily',
        platformAllocations,
      },
      schedule: {
        startDate: formatDt(today),
        endDate: formatDt(future),
        durationDays: 30,
        creativeDeadlines: formatDt(new Date(Date.now() + 5 * 86400000)),
        reviewDate: formatDt(new Date(Date.now() + 7 * 86400000)),
        testingPeriod: 'Days 1-7 (Creative & Hook Validation)',
        reportingDate: formatDt(new Date(Date.now() + 14 * 86400000)),
      },
      structure: {
        hierarchyName: 'Platform-Aware Hierarchy (Campaign → Ad Groups / Ad Sets → Individual Ads)',
        adGroups: [
          {
            id: `grp_${Date.now()}_1`,
            name: `${platforms[0] || 'Meta Ads'} — Broad Prospecting Ad Set`,
            platform: platforms[0] || 'Meta Ads',
            platformTerminology: platforms[0] === 'Meta Ads' ? 'Ad Set' : 'Ad Group',
            objective,
            budgetAllocation: Math.round(adSpend * 0.6),
            targetAudienceSummary: 'Lookalike 1% + High Interest Overlap (Cold Audience)',
            ads: [
              {
                id: `ad_${Date.now()}_1`,
                name: 'Ad 01 — Benefit Hook (Single Image)',
                format: 'Single Image',
                headline: tpl?.sampleHeadline || `Experience Superior ${prodName}`,
                primaryText:
                  tpl?.samplePrimaryText ||
                  `Engineered for discerning modern teams. Upgrade your workflow with ${brand}. Limited introductory offer.`,
                description: 'Free Shipping & 30-Day Money-Back Guarantee.',
                callToAction: tpl?.sampleCta || 'Learn More',
                destinationUrl: project?.business?.websiteUrl || 'https://example.com/landing',
                status: 'Planned',
              },
              {
                id: `ad_${Date.now()}_2`,
                name: 'Ad 02 — Problem-Solution (Short Video)',
                format: 'Video',
                headline: `Frustrated With Slow Results? Meet ${brand}`,
                primaryText:
                  'Tired of complicated setups and high wasted costs? Discover how our streamlined system cuts friction in half.',
                description: 'See the 60-Second Walkthrough.',
                callToAction: 'Watch More',
                destinationUrl: project?.business?.websiteUrl || 'https://example.com/demo',
                status: 'Planned',
              },
            ],
            status: 'Planned',
          },
          {
            id: `grp_${Date.now()}_2`,
            name: `${platforms[1] || platforms[0] || 'Google Ads'} — Warm Intent Retargeting`,
            platform: platforms[1] || platforms[0] || 'Google Ads',
            platformTerminology:
              (platforms[1] || platforms[0]) === 'Meta Ads' ? 'Ad Set' : 'Ad Group',
            objective,
            budgetAllocation: Math.round(adSpend * 0.4),
            targetAudienceSummary: 'Website Visitors (14 Days) & Add to Cart Abandoners',
            ads: [
              {
                id: `ad_${Date.now()}_3`,
                name: 'Ad 03 — Social Proof & Review Carousel',
                format: 'Carousel',
                headline: 'Rated 4.9/5 by Industry Leaders',
                primaryText:
                  'Still deciding? Join thousands of high-performing teams who rely on Sparkline every single day.',
                description: 'Claim Your Special Welcome Offer.',
                callToAction: 'Get Offer',
                destinationUrl: project?.business?.websiteUrl || 'https://example.com/offer',
                status: 'Planned',
              },
            ],
            status: 'Planned',
          },
        ],
      },
      creativeBrief: this.generateCreativeBriefForTemplate(brand, prodName, objective),
      copyVariations: this.generateDefaultCopyVariations(
        platforms[0] || 'Meta Ads',
        prodName,
        brand,
        objective
      ),
      optimizations: [],
    };
  }

  /**
   * Generates 6 diverse ad copy variations across key messaging angles
   */
  generateDefaultCopyVariations(
    platform: CampaignPlatform,
    product: string,
    brand: string,
    objective: string
  ): CampaignCopyVariation[] {
    const isGoogle = platform === 'Google Ads';
    const isLinkedIn = platform === 'LinkedIn Ads';

    return [
      {
        id: 'cp_benefit',
        angle: 'Benefit-focused',
        headline: isGoogle
          ? `Top-Rated ${product} | Start Free`
          : `Unlock Unmatched Efficiency With ${product}`,
        primaryText: isLinkedIn
          ? `Streamline enterprise operations, eliminate manual bottlenecks, and elevate team performance with ${brand}'s verified intelligence suite.`
          : `Discover the smarter way to achieve your ${objective.toLowerCase()} goals. Engineered with precision to give you superior results in half the time.`,
        description: 'Backed by our 100% satisfaction guarantee.',
        callToAction: isLinkedIn ? 'Request Demo' : 'Shop Now',
        intendedAudience: 'Results-oriented decision makers focused on direct ROI.',
        messagingAngleDescription:
          'Emphasizes tangible commercial outcomes, time savings, and productivity gains.',
        characterCount: { headline: 42, primaryText: 138 },
      },
      {
        id: 'cp_problem_solution',
        angle: 'Problem-solution',
        headline: isGoogle ? `Tired of High Ad Spend? | ${brand}` : `Stop Wasting Budget on Guesswork`,
        primaryText:
          'Most campaigns struggle with rising acquisition costs and unclear metrics. Our verified platform eliminates wasted spend and clarifies your next best move.',
        description: 'See the mathematical difference today.',
        callToAction: 'Learn More',
        intendedAudience: 'Marketers and founders frustrated with declining ROAS.',
        messagingAngleDescription:
          'Directly calls out acute industry pain points and presents your offering as the immediate cure.',
        characterCount: { headline: 36, primaryText: 145 },
      },
      {
        id: 'cp_emotional',
        angle: 'Emotional',
        headline: `Confidence in Every Decision`,
        primaryText:
          'Imagine knowing exactly where every marketing dollar goes and sleeping soundly knowing your growth engine is backed by verified data.',
        description: 'Peace of mind for ambitious teams.',
        callToAction: 'Join Today',
        intendedAudience: 'Founders carrying the burden of marketing capital risk.',
        messagingAngleDescription:
          'Connects with the emotional relief of control, certainty, and freedom from anxiety.',
        characterCount: { headline: 31, primaryText: 142 },
      },
      {
        id: 'cp_promotional',
        angle: 'Promotional',
        headline: `Limited Launch Offer: 20% Off`,
        primaryText:
          'For a limited time, get full access to our premium suite with dedicated onboarding support included at no extra charge. Offer ends this week.',
        description: 'Use code LAUNCH20 at checkout.',
        callToAction: 'Claim Offer',
        intendedAudience: 'Price-conscious shoppers seeking immediate incentive.',
        messagingAngleDescription:
          'Creates commercial urgency and high perceived value through temporary price advantages.',
        characterCount: { headline: 34, primaryText: 148 },
      },
      {
        id: 'cp_educational',
        angle: 'Educational',
        headline: `The 3 Rules of Modern Scale`,
        primaryText:
          'Why do 80% of ad campaigns fail to achieve break-even ROAS? It comes down to unit economics and creative hook velocity. Read our complete breakdown.',
        description: 'Free 5-minute growth guide.',
        callToAction: 'Read Guide',
        intendedAudience: 'Analytical researchers wanting actionable insights before buying.',
        messagingAngleDescription:
          'Establishes deep category authority and trust by teaching rather than hard-selling.',
        characterCount: { headline: 28, primaryText: 147 },
      },
      {
        id: 'cp_trust',
        angle: 'Trust-building',
        headline: `Trusted by Over 500+ High-Growth Brands`,
        primaryText:
          'Rated 4.9 stars across verified reviews. See why top marketing leaders choose Sparkline to safeguard and scale their marketing investments.',
        description: 'Enterprise security & SOC2 ready.',
        callToAction: 'See Case Studies',
        intendedAudience: 'Risk-averse buyers who require social validation and security proof.',
        messagingAngleDescription:
          'Deploys social proof, third-party ratings, and institutional credentials to remove perceived risk.',
        characterCount: { headline: 41, primaryText: 149 },
      },
    ];
  }

  /**
   * Generates a structured creative brief
   */
  generateCreativeBriefForTemplate(
    brand: string,
    product: string,
    objective: CampaignObjective
  ): CampaignCreativeBrief {
    return {
      id: `brf_${Date.now()}`,
      campaignName: `${brand} — ${product} Campaign`,
      objective,
      targetAudience:
        'Forward-thinking decision makers, modern consumers, and high-intent buyers aged 25-54 seeking high quality and clear value.',
      mainMessage: `${product} by ${brand} provides the modern standard of performance, intelligence, and reliability.`,
      creativeConcept:
        'Clarity in Motion: Juxtapose chaotic, inefficient workflows against the calm, structured precision of our offering.',
      visualDirection:
        'Clean high-contrast minimalism, rich typography, smooth cinematic UI animations, and authentic human interaction.',
      brandColors: ['#0052FF (Sparkline Blue)', '#0A2540 (Midnight)', '#F4F7FB (Cloud Slate)'],
      suggestedImagery: [
        'Clean hero product mockups on elevated pedestals',
        'Human hands interacting seamlessly with clean interfaces',
        'Before/after split-screens showcasing time and stress saved',
      ],
      headlineDirection:
        'Punchy, declarative, action-oriented. Avoid vague buzzwords. Focus on speed, clarity, and verified results.',
      callToAction: 'Explore Now / Claim Exclusive Offer',
      requiredAssets: [
        '1:1 Square Feed Assets (1080x1080px)',
        '9:16 Vertical Video / Story Reels (1080x1920px)',
        '16:9 Landscape Video Thumbnails (1920x1080px)',
        '4:5 Mobile Feed Portraits (1080x1350px)',
      ],
      creativeSpecifications: [
        'Max video file size: 250MB (MP4 or MOV, H.264 encoding)',
        'First 3 seconds must introduce the core hook or pain point before viewer drop-off',
        'All video creatives must include clear open captions for sound-off consumption',
        'Logo mark must be clearly legible throughout the final 5 seconds',
      ],
      testingVariations: [
        'Hook A (Problem Callout) vs Hook B (Curiosity Stat)',
        'Static High-Contrast Product Photography vs Lifestyle Action Video',
        'White Background Studio Render vs In-Context Real World Environment',
      ],
    };
  }

  /**
   * Calculates actual campaign performance metrics using shared formulas
   */
  calculatePerformance(
    input: Partial<CampaignPerformance>,
    dataSource: 'manual_entry' | 'csv_import' | 'connected_api' = 'manual_entry'
  ): CampaignPerformance {
    const impressions = Math.max(0, input.impressions || 0);
    const reach = Math.max(0, input.reach || 0);
    const clicks = Math.max(0, input.clicks || 0);
    const spend = Math.max(0, input.spend || 0);
    const leads = Math.max(0, input.leads || 0);
    const conversions = Math.max(0, input.conversions || 0);
    const revenue = Math.max(0, input.revenue || 0);

    const ctr = impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0;
    const cpc = clicks > 0 ? Math.round((spend / clicks) * 100) / 100 : 0;
    const cpm = impressions > 0 ? Math.round(((spend / impressions) * 1000) * 100) / 100 : 0;
    const cpa = conversions > 0 ? Math.round((spend / conversions) * 100) / 100 : 0;
    const cpl = leads > 0 ? Math.round((spend / leads) * 100) / 100 : 0;
    const conversionRate =
      clicks > 0 ? Math.round((conversions / clicks) * 10000) / 100 : 0;
    const roas = spend > 0 ? Math.round((revenue / spend) * 100) / 100 : 0;
    const roi =
      spend > 0 ? Math.round(((revenue - spend) / spend) * 10000) / 100 : undefined;

    const hasActualData = impressions > 0 || clicks > 0 || spend > 0;

    return {
      hasActualData,
      impressions,
      reach,
      clicks,
      spend,
      leads,
      conversions,
      revenue,
      ctr,
      cpc,
      cpm,
      cpa,
      cpl,
      conversionRate,
      roas,
      roi,
      dataSource,
      reportingDate: input.reportingDate || new Date().toISOString().split('T')[0] || '',
      notes: input.notes || '',
    };
  }

  /**
   * Diagnostic engine evaluating campaign health and generating actionable optimizations
   */
  evaluateOptimizations(
    performance?: CampaignPerformance | null,
    budget?: { totalBudget: number; adSpend: number; currency: string }
  ): CampaignOptimization[] {
    const list: CampaignOptimization[] = [];
    if (!performance || !performance.hasActualData) return list;

    const curr = budget?.currency || '$';

    // 1. High CPC Check
    if (performance.cpc > 5.0 && performance.clicks >= 20) {
      list.push({
        id: 'opt_cpc',
        area: 'High CPC',
        severity: 'High',
        observation: `Average Cost Per Click is elevated at ${curr} ${performance.cpc.toFixed(2)}.`,
        supportingData: `${performance.clicks} clicks recorded against ${curr} ${performance.spend.toLocaleString()} total ad spend.`,
        whyItMatters:
          'High click costs deplete campaign budgets rapidly, leaving fewer impressions to test creative angles and generate conversions.',
        suggestedAction:
          'Test broader audience targeting to reduce auction bid competition, and refresh ad headlines to improve expected CTR quality scores.',
        metricToMonitor: 'Daily CPC trend & Ad Auction Relevance Score',
        suggestedReviewPeriod: '3 to 5 Days',
      });
    }

    // 2. Low CTR Check
    if (performance.ctr < 1.0 && performance.impressions >= 1000) {
      list.push({
        id: 'opt_ctr',
        area: 'Low CTR',
        severity: 'High',
        observation: `Click-Through Rate is currently low at ${performance.ctr.toFixed(2)}% (under 1.0% benchmark).`,
        supportingData: `${performance.impressions.toLocaleString()} impressions produced only ${performance.clicks} clicks.`,
        whyItMatters:
          'Low CTR indicates audience fatigue or an uncompelling hook that fails to stop the scroll.',
        suggestedAction:
          'Replace the initial 3-second video hook or static hero image with a high-contrast visual and a direct, benefit-focused headline.',
        metricToMonitor: 'Thumb-stop rate & Click-Through Rate (CTR)',
        suggestedReviewPeriod: '48 Hours',
      });
    }

    // 3. High CPA / Zero Conversion Warning
    if (performance.conversions === 0 && performance.spend > 300) {
      list.push({
        id: 'opt_zero_conv',
        area: 'High CPA',
        severity: 'High',
        observation: `Zero conversions recorded after spending ${curr} ${performance.spend.toLocaleString()}.`,
        supportingData: `${performance.clicks} visitors driven with 0 completed conversion events.`,
        whyItMatters:
          'Continuing spend without conversions risks total budget exhaustion. The landing page offer or tracking pixel may be broken.',
        suggestedAction:
          'Test conversion tracking tags immediately via Google Tag Assistant or Meta Pixel Helper. Audit mobile checkout for hidden shipping fees or form friction.',
        metricToMonitor: 'Landing page conversion rate & Add-to-cart rate',
        suggestedReviewPeriod: 'Immediate (Pause ads until verified)',
      });
    }

    // 4. Creative Fatigue Warning (High Frequency Proxy)
    if (
      performance.reach > 0 &&
      performance.impressions / performance.reach > 3.8 &&
      performance.ctr < 1.4
    ) {
      const freq = (performance.impressions / performance.reach).toFixed(1);
      list.push({
        id: 'opt_fatigue',
        area: 'Creative Fatigue',
        severity: 'Medium',
        observation: `Ad frequency has reached ${freq}x while CTR is declining.`,
        supportingData: `${performance.impressions.toLocaleString()} impressions delivered to ${performance.reach.toLocaleString()} unique accounts.`,
        whyItMatters:
          'When users see the same ad creative 4+ times without clicking, negative sentiment rises and CPMs increase due to delivery fatigue.',
        suggestedAction:
          'Introduce 2-3 fresh creative variations with completely different visual concepts and expand audience lookalike sizing.',
        metricToMonitor: 'Daily frequency & Unsubscribe / Hide Ad reports',
        suggestedReviewPeriod: 'Next Weekly Cycle',
      });
    }

    // 5. Positive Scaling Opportunity (High ROAS)
    if (performance.roas >= 3.5 && performance.spend >= 500) {
      list.push({
        id: 'opt_scale',
        area: 'Budget Imbalance',
        severity: 'Low',
        observation: `Strong commercial efficiency: Campaign is delivering ${performance.roas}x ROAS.`,
        supportingData: `${curr} ${performance.revenue.toLocaleString()} revenue on ${curr} ${performance.spend.toLocaleString()} spend.`,
        whyItMatters:
          'Performance is exceeding break-even benchmarks. Controlled budget increases can capture incremental profit before audience saturation.',
        suggestedAction:
          'Scale daily ad budget by 15-20% every 3 days. Avoid sudden doubling of budget which resets platform algorithmic learning.',
        metricToMonitor: 'Marginal CPA and blended ROAS',
        suggestedReviewPeriod: 'Every 72 Hours during scale',
      });
    }

    return list;
  }

  /**
   * Calls server-side AI Strategy Plan generation or falls back to deterministic expert synthesis
   */
  async generateAICampaignPlan(campaign: AdvertisingCampaign): Promise<AICampaignPlanResult> {
    try {
      const response = await fetch('/api/generate-campaign-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaign }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.ok && data.plan) {
          return {
            ...data.plan,
            isAiGenerated: true,
            generatedAt: new Date().toISOString(),
          };
        }
      }
    } catch {
      // Gracefully fall back to deterministic expert plan
    }

    // High quality deterministic rule-based campaign plan
    return {
      campaignObjectiveRationale: `Focusing on "${campaign.objective}" aligns directly with your commercial goals for ${campaign.productService}. This builds measurable conversion momentum while preserving clear unit-economic accountability.`,
      recommendedPlatformsRationale: `Allocating across ${campaign.platforms.join(' and ')} captures high-intent demand while generating affordable top-of-funnel discovery.`,
      suggestedStructure: campaign.platforms.map((p) => ({
        groupName: `${p} — Core Target Prospecting`,
        platform: p,
        targetSegment: campaign.audience.customerType + ' | ' + campaign.audience.targetLocation,
        adFormats: p === 'Google Ads' ? ['Responsive Search Ads'] : ['Single Image Feed', 'Vertical Reels / TikTok Video'],
      })),
      audienceTargetingAdvice: [
        `Exclude customers who converted in the past 30 days to avoid paying for redundant impressions.`,
        `Layer high-intent interest keywords with lookalikes (1-2%) derived from email subscribers.`,
        `Maintain open age targeting (${campaign.audience.ageRange}) and let platform algorithms optimize towards demonstrated checkout actions.`,
      ],
      creativeDirection:
        'Focus on clear, high-contrast product demonstrations. The first 3 seconds must showcase the core customer benefit or immediate pain point relief.',
      messagingStrategy:
        'Pair transparent product differentiation with undeniable social proof and risk-reversal guarantees (e.g., 30-day trial or money-back guarantee).',
      suggestedCtas: ['Shop Now', 'Claim Limited Offer', 'Book Consultation', 'Learn More'],
      budgetAllocationAdvice: `Dedicate 70% of spend to prospecting cold audiences, 20% to dynamic retargeting of cart abandoners, and 10% to an isolated creative testing sandbox.`,
      testingRecommendations: [
        'A/B test 2 contrasting visual hooks (UGC video vs studio product render).',
        'Test 2 distinct headline angles: Problem-Solution vs Direct Percentage Discount.',
        'Evaluate performance every 72 hours; pause bottom-quartile ad variations without mercy.',
      ],
      trackingAndMeasurement: [
        'Ensure Meta Conversions API (CAPI) and Google Enhanced Conversions are verified before launch.',
        'Use strict UTM naming conventions (utm_source, utm_medium, utm_campaign, utm_content).',
        'Reconcile ad platform reported revenue with your internal payment ledger to monitor attribution overlap.',
      ],
      potentialRisks: [
        'Creative fatigue if running fewer than 3 ad variations with high daily spend.',
        'Seasonal auction clearing rate inflation driving up CPMs during peak commercial holidays.',
      ],
      optimizationRecommendations: [
        'If CPC exceeds target by >30% after 20 clicks, pause creative and test new thumbnail/headline.',
        'Scale winning ad sets gradually (+15-20% every 3 days) to preserve machine learning stability.',
      ],
      isAiGenerated: false,
      generatedAt: new Date().toISOString(),
    };
  }

  // =========================================================================
  // PERSISTENCE (LOCALSTORAGE) WITH STRICT IDOR & MULTI-TENANT DEFENSE
  // =========================================================================

  getCampaigns(requestingUserId?: string): AdvertisingCampaign[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const list: AdvertisingCampaign[] = Array.isArray(parsed) ? parsed : [];
      if (!requestingUserId) return list;
      return list.filter((c) => {
        if (!c.userId) return true; // public/seed templates
        return c.userId === requestingUserId;
      });
    } catch {
      return [];
    }
  }

  getCampaignById(id: string, requestingUserId?: string): AdvertisingCampaign | null {
    const list = this.getCampaigns();
    const target = list.find((c) => c.id === id);
    if (!target) return null;

    // Strict IDOR ownership defense:
    if (target.userId && requestingUserId && target.userId !== requestingUserId) {
      auditService.log('security.access_denied', 'campaign', {
        userId: requestingUserId,
        resourceId: id,
        outcome: 'denied',
        metadata: { attemptedAction: 'get_campaign', ownerId: target.userId },
      });
      return null;
    }

    // Verify parent project ownership if associated
    if (target.projectId && requestingUserId) {
      const proj = projectService.getProjectById(target.projectId, requestingUserId);
      if (!proj) {
        return null;
      }
    }

    return target;
  }

  saveCampaign(campaign: AdvertisingCampaign, requestingUserId?: string): void {
    try {
      const list = this.getCampaigns();
      const idx = list.findIndex((c) => c.id === campaign.id);
      const existing = idx >= 0 ? list[idx] : null;

      if (existing && existing.userId && requestingUserId && existing.userId !== requestingUserId) {
        auditService.log('security.access_denied', 'campaign', {
          userId: requestingUserId,
          resourceId: campaign.id,
          outcome: 'denied',
          metadata: { attemptedAction: 'save_campaign', ownerId: existing.userId },
        });
        throw new Error('Access denied: You do not have permission to modify this private campaign.');
      }

      const campaignToSave: AdvertisingCampaign = {
        ...campaign,
        name: securityService.sanitizeText(campaign.name),
        description: securityService.sanitizeText(campaign.description || ''),
        userId: existing?.userId || campaign.userId || requestingUserId,
        updatedAt: new Date().toISOString(),
      };

      if (idx >= 0) {
        list[idx] = campaignToSave;
      } else {
        list.unshift(campaignToSave);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Failed to save campaign to localStorage:', err);
      throw err;
    }
  }

  deleteCampaign(id: string, requestingUserId?: string): boolean {
    try {
      const list = this.getCampaigns();
      const target = list.find((c) => c.id === id);
      if (!target) return false;

      if (target.userId && requestingUserId && target.userId !== requestingUserId) {
        auditService.log('security.access_denied', 'campaign', {
          userId: requestingUserId,
          resourceId: id,
          outcome: 'denied',
          metadata: { attemptedAction: 'delete_campaign', ownerId: target.userId },
        });
        return false;
      }

      const filtered = list.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (err) {
      console.error('Failed to delete campaign:', err);
      return false;
    }
  }

  duplicateCampaign(id: string, requestingUserId?: string): AdvertisingCampaign | null {
    const original = this.getCampaignById(id, requestingUserId);
    if (!original) return null;

    const copy: AdvertisingCampaign = {
      ...original,
      id: `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: `${original.name} (Copy)`,
      userId: requestingUserId || original.userId,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      performance: undefined,
      optimizations: [],
    };

    this.saveCampaign(copy, requestingUserId);
    return copy;
  }

  updateCampaignStatus(id: string, status: CampaignStatus, requestingUserId?: string): void {
    const cmp = this.getCampaignById(id, requestingUserId);
    if (cmp) {
      cmp.status = status;
      this.saveCampaign(cmp, requestingUserId);
    }
  }

  /**
   * Export campaign data to CSV with strict formula injection defense and IDOR check
   */
  exportCampaignCsv(campaign: AdvertisingCampaign, requestingUserId?: string): string {
    if (campaign.userId && requestingUserId && campaign.userId !== requestingUserId) {
      auditService.log('security.access_denied', 'campaign', {
        userId: requestingUserId,
        resourceId: campaign.id,
        outcome: 'denied',
        metadata: { attemptedAction: 'export_csv', ownerId: campaign.userId },
      });
      throw new Error('Access denied: You do not have permission to export this private campaign.');
    }

    const rows: (string | number)[][] = [
      ['Sparkline Marketing — Campaign Export'],
      ['Campaign Name', campaign.name],
      ['ID', campaign.id],
      ['Status', campaign.status],
      ['Objective', campaign.objective],
      ['Platforms', campaign.platforms.join('; ')],
      ['Total Budget', `${campaign.budget.currency} ${campaign.budget.totalBudget}`],
      ['Ad Spend', `${campaign.budget.currency} ${campaign.budget.adSpend}`],
      ['Start Date', campaign.schedule.startDate],
      ['End Date', campaign.schedule.endDate],
      ['Duration', `${campaign.schedule.durationDays} Days`],
      ['Location', campaign.targetLocation],
      [],
      ['Structure & Ad Groups'],
      ['Group Name', 'Platform', 'Budget', 'Audience', 'Ad Count'],
      ...campaign.structure.adGroups.map((g) => [
        g.name,
        g.platform,
        `${campaign.budget.currency} ${g.budgetAllocation}`,
        g.targetAudienceSummary,
        g.ads.length,
      ]),
      [],
      ['Ads & Messaging'],
      ['Ad Name', 'Format', 'Headline', 'CTA', 'Landing Page URL'],
      ...campaign.structure.adGroups.flatMap((g) =>
        g.ads.map((a) => [a.name, a.format, a.headline, a.callToAction, a.destinationUrl])
      ),
    ];

    return rows.map((r) => r.map((cell) => securityService.formatCsvCell(cell)).join(',')).join('\n');
  }
}

export const campaignService = new CampaignService();

