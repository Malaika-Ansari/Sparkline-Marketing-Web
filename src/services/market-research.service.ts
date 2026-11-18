/**
 * SPARKLINE MARKETING — MARKET RESEARCH & INDUSTRY INTELLIGENCE SERVICE
 * Client persistence and API management layer for Phase 09.
 */

import { MarketingProject } from '@/types/project';
import {
  MarketResearchReport,
  MarketResearchInput,
  ResearchAssistantMessage,
} from '@/types/market-research';

const STORAGE_KEY = 'sparkline_marketing_research_reports';

// Pre-seeded high-fidelity reference blueprint market research reports
const DEMO_RESEARCH_REPORTS: MarketResearchReport[] = [
  {
    id: 'report-vitamin-c-001',
    projectId: 'proj-vitamin-c',
    projectName: 'GlowBiome Organics',
    reportTitle: 'Global Clean Cosmeceuticals & Active Skincare Intelligence (2026)',
    version: 1,
    createdAt: '2026-11-12T18:00:00.000Z',
    modelIdentifier: 'Reference Blueprint (Verified Research Architecture)',
    researchDepth: 'deep',
    status: 'Completed',
    isLiveWebSearchConfigured: false,
    executiveSummary:
      'The global cosmeceuticals category is undergoing a major structural evolution from surface-level "clean marketing" toward verified biochemical stability and barrier preservation. Consumer skepticism regarding rapidly oxidizing Vitamin C formulations has created a high-value market opening for brands offering stabilized actives at accessible direct-to-consumer price points. Incumbent luxury conglomerates continue to price clinical serums at $160-$185, while mass brands sacrifice stability and percentage strength. GlowBiome holds an exceptional strategic wedge by pairing 20% active L-Ascorbic Acid with Ferulic Acid and prebiotic oat in nitrogen-flushed amber glass.',
    inputSnapshot: {
      projectId: 'proj-vitamin-c',
      industry: 'Fashion and Beauty',
      productCategory: 'Clean Cosmeceuticals / Dermatological Serums',
      targetMarket: 'United States, Canada, United Kingdom',
      geographicLocation: 'Urban and Suburban Metro Hubs',
      targetCustomerSegment: 'Ingredient-Conscious Skincare Researchers (Ages 25-45)',
      mainCompetitors: 'SkinCeuticals C E Ferulic, Drunk Elephant C-Firma, The Ordinary',
      productPriceRange: '$50 - $70 (DTC accessible premium tier)',
      businessObjectives: 'Increase sales, Lower customer acquisition cost, Maximize ROAS',
      researchTopic: 'Active formulation stability, consumer oxidation complaints, and clinical pricing elasticity',
      researchPeriod: '2025 - 2026 Analysis Horizon',
      researchDepth: 'deep',
      specificQuestions:
        'What are the primary reasons consumers abandon Vitamin C serums? How sensitive are buyers to prices above $50? Which marketing channels yield the highest conversion for dermatological proof?',
      keywords: 'vitamin c serum stability, ferulic acid, oxidation, sensitive skin barrier, cosmeceuticals market trends',
    },
    industryOverview: {
      description:
        'The global cosmeceutical skincare market represents a high-growth segment bridging mass cosmetics and prescription dermatology, characterized by demand for clinically proven bio-actives and ingredient transparency.',
      characteristics: [
        'High gross margins (65% to 78%) allowing substantial customer acquisition buffers',
        'Strong replenishment repurchase cycles (45 to 60-day replacement velocity)',
        'Rapid shift from synthetic fragrance to microbiome-friendly prebiotic formulations',
        'Rising scrutiny from regulatory bodies regarding clinical claims and packaging claims',
      ],
      mainCategories: [
        'Antioxidant Serums (L-Ascorbic Acid, Ferulic Acid, Resveratrol)',
        'Barrier Repair & Microbiome Creams (Prebiotics, Ceramides, Peptides)',
        'Chemical Exfoliants & Peels (AHA/BHA/PHA)',
        'Mineral Broad-Spectrum UV Protectants',
      ],
      importantDevelopments: [
        'Nitrogen flush filling and amber glass dropper packaging adopted to eliminate active oxidation before unsealing',
        'Enactment of the Modernization of Cosmetics Regulation Act (MoCRA) in the United States mandating adverse event tracking and substantiated safety testing',
        'Direct-to-consumer buyers rejecting multi-step regimens in favor of concentrated single-active morning serums',
      ],
      industryChallenges: [
        'Digital ad auction inflation across Meta and TikTok raising blended customer acquisition costs',
        'Consumer fatigue surrounding unsubstantiated "clean beauty" greenwashing claims',
        'Active L-Ascorbic acid degradation under UV and oxygen exposure requiring strict manufacturing controls',
      ],
      factorsAffectingDemand: [
        'Consumer awareness of environmental photoaging, pollution, and blue light exposure',
        'Discretionary spend reallocation from department stores to transparent independent eCommerce brands',
        'Dermatologist social media influencers educating audiences on active percentage concentrations',
      ],
    },
    marketDemand: {
      demandIndicators: [
        'Elevated consumer inquiry volume regarding serum discoloration, shelf life, and smell',
        'Increased preference for airless pumps and UV-blocking amber glass packaging in beauty reviews',
        'Surge in searches comparing 15% vs. 20% active Vitamin C concentrations for hyperpigmentation',
      ],
      searchInterestSignals: [
        'Persistent non-brand search volume for "best stable vitamin c serum for sensitive skin"',
        'Commercial comparison intent around department store formulations vs. indie clinical alternatives',
        'High engagement on Reddit communities (r/SkincareAddiction, r/30PlusSkinCare) regarding oxidation tests',
      ],
      customerNeedsSummary: [
        'Fast-acting fading of sun spots and post-inflammatory acne marks',
        'Antioxidant protection that does not sting, trigger contact dermatitis, or pill under sunscreen',
        'Confidence that the active formula will remain potent through the bottom of the bottle',
      ],
      primaryBuyingMotivations: [
        'Achieving makeup-free skin confidence and natural morning glow',
        'Preventative anti-aging investment to avoid expensive in-office laser treatments',
        'Value perception of securing $160-grade clinical efficacy for $58',
      ],
      seasonalDemandPatterns:
        'High seasonal surges occur in Spring/Summer (April through August) driven by sun damage prevention, followed by a secondary Q4 holiday gift set peak.',
      geographicDemandDifferences:
        'Strongest demand index in sunny coastal metros (California, Florida, Texas, Southeast US) and urban centers with elevated pollution index (New York, London, Toronto).',
      demandLimitations:
        'Qualitative demand signals reflect high interest, but conversion velocity depends on clear proof of formulation stability and low-friction risk reversal (money-back guarantee).',
    },
    trends: [
      {
        id: 'trend-1',
        trendTitle: 'Transition from "Clean Aesthetic" to Verifiable Clinical Efficacy',
        description:
          'Consumers are abandoning ambiguous clean beauty buzzwords and demanding published third-party laboratory assay reports showing exact active percentages and pH stability.',
        category: 'Customer Behavior',
        publicationDate: '2025-10-14',
        sourceTitle: 'Journal of Cosmetic Dermatology — Consumer Perception of Active Cosmeceuticals',
        sourceUrl: 'https://onlinelibrary.wiley.com/journal/14732165',
        isExternalSourceVerified: true,
      },
      {
        id: 'trend-2',
        trendTitle: 'Microbiome-First Formulation & Prebiotic Oat Integration',
        description:
          'Formulations pairing high-potency acids with soothing prebiotic oat extracts to protect delicate skin barriers and eliminate stinging are outpacing conventional irritating serums.',
        category: 'Product Innovation',
        publicationDate: '2025-11-02',
        sourceTitle: 'International Journal of Cosmetic Science — Prebiotics in Barrier Repair',
        sourceUrl: 'https://onlinelibrary.wiley.com/journal/14682494',
        isExternalSourceVerified: true,
      },
      {
        id: 'trend-3',
        trendTitle: 'Airtight Nitrogen Packaging & UV Shielding as a Trust Marker',
        description:
          'Packaging has evolved from a passive container into an active proof point. Brands showcasing amber glass, nitrogen flushing, and airtight dropper seals experience lower return rates.',
        category: 'Technology',
        publicationDate: '2025-08-19',
        sourceTitle: 'Cosmetic Packaging & Formulation Review',
        sourceUrl: 'https://www.cosmeticsandtoiletries.com',
        isExternalSourceVerified: true,
      },
      {
        id: 'trend-4',
        trendTitle: 'Rise of Aesthetician Micro-Creator UGC over Celebrity Endorsements',
        description:
          'Shoppers trust licensed aesthetician unboxings and formulation reviews over paid celebrity ambassadors by a wide margin when evaluating active skincare.',
        category: 'Channel Shift',
        publicationDate: '2025-09-28',
        sourceTitle: 'Beauty Independent — 2026 Creator Marketing Benchmark',
        sourceUrl: 'https://www.beautyindependent.com',
        isExternalSourceVerified: true,
      },
    ],
    opportunities: [
      {
        id: 'opp-1',
        title: 'The "Never Settle for Oxidized" Freshness Guarantee',
        explanation:
          'Position GlowBiome as the only indie brand providing a 30-day freshness guarantee backed by nitrogen flush packaging, turning the #1 customer complaint into a powerful conversion hook.',
        category: 'Product Differentiation',
        customerRelevance: 'Directly neutralizes the primary reason consumers abandon previous Vitamin C purchases.',
        businessFit: 'Directly supported by GlowBiome’s airtight amber packaging and 71% gross margin.',
        evidenceStrength: 'High',
        implementationEffort: 'Low',
        strategicValue: 'High',
        riskLevel: 'Low',
        priority: 'High',
        suggestedNextAction: 'Incorporate freshness comparison graphics and badge onto product landing page above the fold.',
        supportingEvidence: 'Consumer reviews across category rivals cite oxidation within 30 days as the dominant negative review driver.',
      },
      {
        id: 'opp-2',
        title: 'Sensitive Skin Barrier Positioning with Prebiotic Oat',
        explanation:
          'Capture the underserved segment of customers who want 20% active strength but have experienced stinging or redness from conventional acidic serums.',
        category: 'Underserved Need',
        customerRelevance: 'Over 40% of skincare consumers describe their skin as reactive or sensitive.',
        businessFit: 'GlowBiome formulation already integrates certified organic prebiotic oat base.',
        evidenceStrength: 'High',
        implementationEffort: 'Low',
        strategicValue: 'High',
        riskLevel: 'Low',
        priority: 'High',
        suggestedNextAction: 'Deploy ad creative specifically targeting "Vitamin C without stinging or redness".',
        supportingEvidence: 'Microbiome skincare searches have grown consistently over 3 consecutive years.',
      },
      {
        id: 'opp-3',
        title: 'AM Routine Duo Bundle with Mineral Daily Sunscreen',
        explanation:
          'Bundle the Vitamin C serum with a complementary daily SPF 50 sunscreen to raise Average Order Value (AOV) from $58 to $86, improving ad auction bid headroom.',
        category: 'Channel Innovation',
        customerRelevance: 'Antioxidants and sunscreen are clinically synergistic when applied together every morning.',
        businessFit: 'Requires secondary product manufacturing or co-packing partnership.',
        evidenceStrength: 'Medium',
        implementationEffort: 'Medium',
        strategicValue: 'High',
        riskLevel: 'Medium',
        priority: 'Medium',
        suggestedNextAction: 'Source clean mineral SPF partner or formulate complementary daily sunscreen.',
        supportingEvidence: 'DTC skincare stores with multi-item morning bundles report 25%+ higher customer lifetime value.',
      },
    ],
    pestle: [
      {
        id: 'pestle-1',
        category: 'Political',
        factorTitle: 'International Cosmetic Trade Tariffs & Ingredient Import Regulations',
        description:
          'Trade policies and import duties on active pharmaceutical ingredients (L-Ascorbic Acid) sourced from certified international suppliers affect raw material landing costs.',
        potentialImpact: 'Medium',
        businessRelevance: 'Direct impact on packaging and active ingredient supply chain resilience.',
        type: 'Threat',
        confidenceLevel: 'High',
        evidenceOrSource: 'US International Trade Commission (USITC) Chemical Tariff Schedules',
      },
      {
        id: 'pestle-2',
        category: 'Economic',
        factorTitle: 'Inflationary Consumer Shift from Prestige Luxury to High-Value DTC',
        description:
          'Macroeconomic cost-of-living pressures are prompting consumers to trade down from $160+ department store luxury brands to $50-$65 clinical direct-to-consumer alternatives.',
        potentialImpact: 'High',
        businessRelevance: 'Primary tailwind driving GlowBiome’s $58 pricing proposition.',
        type: 'Opportunity',
        confidenceLevel: 'High',
        evidenceOrSource: 'Consumer Discretionary Spending & Beauty Index (2025/2026)',
      },
      {
        id: 'pestle-3',
        category: 'Social',
        factorTitle: 'Democratization of Skincare Ingredient Literacy',
        description:
          'Consumers actively research INCI labels, percentages, and clinical delivery systems, reducing the power of legacy brand heritage and rewarding authentic formulation.',
        potentialImpact: 'High',
        businessRelevance: 'Enables GlowBiome to out-convert legacy incumbents through transparent lab data.',
        type: 'Opportunity',
        confidenceLevel: 'High',
        evidenceOrSource: 'Independent Dermatologist Creator Analysis & Reddit Skincare Trends',
      },
      {
        id: 'pestle-4',
        category: 'Technological',
        factorTitle: 'Advancements in Stabilization & Controlled Nitrogen Packaging',
        description:
          'Modern manufacturing equipment allows nitrogen flushing of amber glass droppers at scale, preventing premature oxidation during warehousing and transport.',
        potentialImpact: 'Medium',
        businessRelevance: 'Enables 12-month shelf life without synthetic chemical preservatives.',
        type: 'Opportunity',
        confidenceLevel: 'High',
        evidenceOrSource: 'Cosmetic Packaging Technology Review',
      },
      {
        id: 'pestle-5',
        category: 'Legal',
        factorTitle: 'FDA Modernization of Cosmetics Regulation Act (MoCRA) Enforcement',
        description:
          'Strict federal requirements for product safety substantiation, adverse event reporting, and professional facility registration enforced by the FDA.',
        potentialImpact: 'High',
        businessRelevance: 'Requires rigorous batch recordkeeping and third-party laboratory verification.',
        type: 'Threat',
        confidenceLevel: 'High',
        evidenceOrSource: 'FDA MoCRA Official Implementation Guidance (21 U.S.C. 364)',
      },
      {
        id: 'pestle-6',
        category: 'Environmental',
        factorTitle: 'Consumer Demand for Recyclable Amber Glass & Clean Supply Chains',
        description:
          'Growing rejection of single-use plastic droppers and synthetic petrochemical packaging among clean beauty buyers.',
        potentialImpact: 'Medium',
        businessRelevance: 'GlowBiome’s 100% recyclable amber glass aligns perfectly with sustainability values.',
        type: 'Opportunity',
        confidenceLevel: 'High',
        evidenceOrSource: 'Sustainable Packaging Coalition Report',
      },
    ],
    challenges: [
      {
        id: 'chal-1',
        title: 'Ad Auction CPM Volatility and High Cost Per Click',
        category: 'CAC Inflation',
        description:
          'Skincare keywords and Meta ad auctions experience intense competition from multi-billion dollar beauty conglomerates, bidding up traffic costs.',
        severity: 'High',
        verificationNeeded: false,
        mitigationRecommendation:
          'Prioritize long-tail high-intent search terms ("stable vitamin c serum with ferulic acid") and scale email/SMS replenishment automation.',
      },
      {
        id: 'chal-2',
        title: 'Consumer Greenwashing Skepticism',
        category: 'Consumer Trust',
        description:
          'Widespread consumer fatigue regarding clean beauty claims can cause prospects to doubt whether a $58 serum is genuinely clinical grade.',
        severity: 'Medium',
        verificationNeeded: true,
        mitigationRecommendation:
          'Publish third-party lab assay reports and offer an unconditional 30-Day Empty Bottle Money-Back Guarantee.',
      },
      {
        id: 'chal-3',
        title: 'Packaging Supplier Minimum Order Quantities (MOQs)',
        category: 'Barriers to Entry',
        description:
          'Custom nitrogen-flushed amber glass bottles require 6-8 week supplier lead times and upfront capital inventory commitments.',
        severity: 'Medium',
        verificationNeeded: true,
        mitigationRecommendation:
          'Establish rolling 90-day inventory forecasts and maintain secondary domestic packaging partner relationships.',
      },
    ],
    strategicRecommendations: [
      {
        title: 'Anchor All Marketing Around the "Freshness & Potency Guarantee"',
        description:
          'Differentiate from oxidization-prone competitors by prominently displaying the nitrogen-flush amber glass proof across all landing pages and social hooks.',
        priority: 'High',
        timeline: 'Immediate (Weeks 1-2)',
        riskFactor: 'Must ensure packaging supplier maintains verified airtight seal standards.',
      },
      {
        title: 'Deploy High-Intent Search Keyword Campaigns with Exact-Match Negative Lists',
        description:
          'Capture bottom-funnel commercial intent on Google Search for terms comparing legacy $160 serums, directing traffic to side-by-side comparison landing pages.',
        priority: 'High',
        timeline: 'Month 1',
        riskFactor: 'Competitive bidding can cause budget drain if negative keyword lists are not curated daily.',
      },
      {
        title: 'Partner with 30 Licensed Aesthetician Micro-Creators for Formulation Reviews',
        description:
          'Seed product units to credentialed skincare professionals to generate unretouched video reviews demonstrating serum clarity and barrier comfort.',
        priority: 'Medium',
        timeline: 'Months 2-3',
        riskFactor: 'Requires dedicated outreach and product gifting coordination.',
      },
    ],
    limitationsAndMissingData: [
      'Current market size and growth figures are derived from aggregated industry reports and represent category estimations.',
      'Search interest signals reflect directional intent trends rather than exact proprietary platform search queries.',
      'Primary customer willingness-to-pay elasticity should be verified through live price-testing on landing pages.',
    ],
    sources: [
      {
        id: 'src-1',
        sourceTitle: 'Modernization of Cosmetics Regulation Act of 2022 (MoCRA) Guidance',
        publisherOrWebsite: 'U.S. Food and Drug Administration (FDA)',
        sourceUrl: 'https://www.fda.gov/cosmetics/cosmetics-laws-regulations/modernization-cosmetics-regulation-act-2022',
        publicationDate: '2024-03-15',
        accessDate: '2026-11-12',
        relevantClaim: 'Mandates product safety substantiation and facility registration for all commercial cosmetic brands.',
        researchCategory: 'Regulatory Compliance',
        sourceType: 'Regulatory Document',
        isVerified: true,
      },
      {
        id: 'src-2',
        sourceTitle: 'Stabilization of Ascorbic Acid with Ferulic Acid in Topical Dermatological Formulations',
        publisherOrWebsite: 'Journal of Investigative Dermatology',
        sourceUrl: 'https://www.sciencedirect.com/journal/journal-of-investigative-dermatology',
        publicationDate: '2023-06-11',
        accessDate: '2026-11-12',
        relevantClaim: 'Confirms that combining 15-20% L-ascorbic acid with 0.5% ferulic acid octuples photochemical stability.',
        researchCategory: 'Biochemical Efficacy',
        sourceType: 'Primary Research',
        isVerified: true,
      },
      {
        id: 'src-3',
        sourceTitle: 'Global Cosmeceuticals Market Analysis & Growth Trajectory',
        publisherOrWebsite: 'Statista Consumer Market Insights',
        sourceUrl: 'https://www.statista.com/outlook/cmo/beauty-personal-care/skin-care/worldwide',
        publicationDate: '2025-01-20',
        accessDate: '2026-11-12',
        relevantClaim: 'Projects active cosmeceuticals market expansion at 9.2% CAGR through 2030.',
        researchCategory: 'Market Demand',
        sourceType: 'Industry Publication',
        isVerified: true,
      },
      {
        id: 'src-4',
        sourceTitle: 'The Prebiotic Revolution in Dermal Barrier Repair',
        publisherOrWebsite: 'International Journal of Cosmetic Science',
        sourceUrl: 'https://onlinelibrary.wiley.com/journal/14682494',
        publicationDate: '2024-09-18',
        accessDate: '2026-11-12',
        relevantClaim: 'Colloidal and extract oat prebiotics significantly reduce stinging and erythema caused by low pH actives.',
        researchCategory: 'Formulation Innovation',
        sourceType: 'Primary Research',
        isVerified: true,
      },
    ],
    assistantChatHistory: [
      {
        id: 'msg-seed-1',
        role: 'assistant',
        content:
          'Welcome to the Market Intelligence Assistant for GlowBiome Organics. You can ask me any question about industry conditions, PESTLE dynamics, competitive risks, or market opportunity prioritization based on this report.',
        timestamp: '2026-11-12T18:05:00.000Z',
        isStrategicReasoning: true,
      },
    ],
  },
  {
    id: 'report-apex-cloud-001',
    projectId: 'proj-apex-cloud',
    projectName: 'ApexSec Cloud Intelligence',
    reportTitle: 'Cloud Security Posture Management & Autonomous Remediation Intelligence (2026)',
    version: 1,
    createdAt: '2026-11-12T18:30:00.000Z',
    modelIdentifier: 'Reference Blueprint (Verified Research Architecture)',
    researchDepth: 'deep',
    status: 'Completed',
    isLiveWebSearchConfigured: false,
    executiveSummary:
      'The Cloud Security Posture Management (CSPM) and DevSecOps market is undergoing an inflection point. Traditional vulnerability scanners that flood engineering teams with tens of thousands of static alert tickets are experiencing severe customer backlash. Market demand has pivoted sharply toward autonomous remediation engines that auto-generate verified infrastructure-as-code (Terraform/OpenTofu) pull requests. ApexSec operates with an 85% SaaS gross margin and a 15-minute agentless deployment advantage, perfectly matching enterprise demands for shorter MTTR without adding developer friction.',
    inputSnapshot: {
      projectId: 'proj-apex-cloud',
      industry: 'Technology / Cloud Security',
      productCategory: 'Autonomous Cloud Security & Compliance Automation',
      targetMarket: 'North America, United Kingdom, European Union',
      geographicLocation: 'Global Technology Hubs',
      targetCustomerSegment: 'Platform Engineering, DevOps Leads, and CISOs at 50-2,000 employee tech firms',
      mainCompetitors: 'Wiz, Palo Alto Networks Prisma Cloud, Orca Security, Snyk',
      productPriceRange: '$2,400/mo ($28,800 ACV tier)',
      businessObjectives: 'Generate leads, Lower customer acquisition cost, Build brand awareness',
      researchTopic: 'Autonomous IaC remediation vs alert fatigue, SOC 2 compliance demand, and CISO purchasing cycles',
      researchPeriod: '2025 - 2026 Analysis Horizon',
      researchDepth: 'deep',
      specificQuestions:
        'What are the primary factors causing cloud security vendor churn? How are enterprise buying committees shifting budget toward AWS Marketplace? What compliance deadlines drive immediate purchases?',
      keywords: 'cloud security posture, autonomous remediation, terraform pull request, soc2 audit compliance, devsecops mttr',
    },
    industryOverview: {
      description:
        'The Cloud Native Application Protection Platform (CNAPP) and CSPM sector represents an $8.6B market driven by multi-cloud infrastructure adoption and escalating regulatory scrutiny.',
      characteristics: [
        'High software gross margins (82% to 88%) and multi-year annual recurring revenue (ARR) contracts',
        'Consolidation trend: CISOs seeking single-pane platforms that combine posture, compliance, and code fixes',
        'Developer-led adoption: Security tools that alienate DevOps squads face high churn at contract renewal',
        'Cloud hyperscaler marketplace procurement (AWS/Azure commitments) driving 40%+ of enterprise software transactions',
      ],
      mainCategories: [
        'Cloud Security Posture Management (CSPM)',
        'Infrastructure-as-Code (IaC) Security & Remediation',
        'Cloud Workload Protection Platforms (CWPP)',
        'Continuous Compliance & Audit Automation (SOC 2, ISO 27001, HIPAA)',
      ],
      importantDevelopments: [
        'Transition from invasive host-level agents to read-only cloud API IAM scanning',
        'Generative code intelligence applied to automatically author syntactic Terraform pull requests',
        'SEC incident disclosure requirements mandating 4-day material cyber incident disclosures',
      ],
      industryChallenges: [
        'Venture-backed incumbents (Wiz, Palo Alto) deploying hundreds of millions in marketing and aggressive enterprise sales armies',
        'Prolonged enterprise security review and vendor risk assessment cycles (60 to 90 days)',
        'Hyperscalers (AWS Security Hub, Google Security Command Center) offering free native baseline posture tools',
      ],
      factorsAffectingDemand: [
        'Shortage of qualified cloud security engineering talent forcing automation adoption',
        'Impending SOC 2 and ISO 27001 audit deadlines required to unlock enterprise revenue',
        'Alarming alert fatigue: Average enterprise security teams receive over 10,000 cloud alerts daily',
      ],
    },
    marketDemand: {
      demandIndicators: [
        'Engineering leadership demanding automated pull requests rather than static vulnerability PDF reports',
        'Surge in enterprise requests for 15-minute read-only sandbox trials without sales calls',
        'Procurement teams actively seeking vendors listed on AWS Marketplace to consume pre-committed cloud budget',
      ],
      searchInterestSignals: [
        'Rising intent for "Terraform security compliance scanner" and "automated cloud remediation"',
        'Commercial search spikes around "SOC 2 automation AWS" and "agentless multi-cloud posture"',
      ],
      customerNeedsSummary: [
        'Zero-overhead agentless visibility across AWS, Azure, and GCP in under 30 minutes',
        'Automated pull requests that software developers can review and merge in seconds',
        'Continuous audit evidence gathering to pass annual security reviews without engineering crunch',
      ],
      primaryBuyingMotivations: [
        'Preventing public S3 bucket or API key leak headlines that jeopardize company valuation',
        'Freeing scarce senior DevOps engineers from spending 20+ hours weekly on manual Jira tickets',
        'Unlocking enterprise customer sales deals that require verified SOC 2 Type II compliance',
      ],
      seasonalDemandPatterns:
        'Demand surges sharply in Q3 and Q4 as enterprise CISOs face calendar-year compliance deadlines and sprint to consume remaining annual security budgets.',
      geographicDemandDifferences:
        'US and UK lead adoption velocity; European Union enterprises demand strict GDPR data sovereignty guarantees and EU cloud hosting.',
      demandLimitations:
        'While CISO interest is high, conversion velocity depends on frictionless technical sandbox evaluations and pre-approved SOC 2 Type II trust packages.',
    },
    trends: [
      {
        id: 'trend-apex-1',
        trendTitle: 'Remediation Over Detection: The Death of Static Alert Ticket Tools',
        description:
          'Security tooling that merely identifies problems without providing the exact code fix is being actively deprecated by engineering-led organizations.',
        category: 'Technology',
        publicationDate: '2025-11-18',
        sourceTitle: 'Gartner Hype Cycle for Cloud Security — Autonomous Remediation',
        sourceUrl: 'https://www.gartner.com',
        isExternalSourceVerified: true,
      },
      {
        id: 'trend-apex-2',
        trendTitle: 'Cloud Marketplace Enterprise Procurement Dominance',
        description:
          'Enterprise IT buyers increasingly mandate software procurement through AWS and Azure Marketplaces to draw down pre-committed enterprise discount program (EDP) balances.',
        category: 'Channel Shift',
        publicationDate: '2025-10-04',
        sourceTitle: 'Bessemer Venture Partners — State of the Cloud 2025',
        sourceUrl: 'https://www.bvp.com/atlas/state-of-the-cloud-2025',
        isExternalSourceVerified: true,
      },
    ],
    opportunities: [
      {
        id: 'opp-apex-1',
        title: 'Autonomous Terraform Pull Request Differentiation',
        explanation:
          'Position ApexSec as the only platform that eliminates developer friction by automatically authoring verified Terraform/OpenTofu PRs instead of generating Jira tickets.',
        category: 'Product Differentiation',
        customerRelevance: 'Solves the #1 friction point between security teams and platform engineers.',
        businessFit: 'Directly powers ApexSec’s core architectural capability.',
        evidenceStrength: 'High',
        implementationEffort: 'Low',
        strategicValue: 'High',
        riskLevel: 'Low',
        priority: 'High',
        suggestedNextAction: 'Deploy interactive browser sandbox allowing prospects to test Terraform PR generation in 3 minutes.',
        supportingEvidence: 'Over 70% of DevOps leaders report ignoring security tickets due to lack of code context.',
      },
      {
        id: 'opp-apex-2',
        title: 'AWS Marketplace Co-Sell & 1-Click Procurement',
        explanation:
          'List ApexSec on AWS Marketplace to bypass enterprise legal hurdles and allow CISOs to purchase using existing cloud commit credits.',
        category: 'Channel Innovation',
        customerRelevance: 'Shortens procurement cycle from 90 days to under 14 days.',
        businessFit: 'Software gross margin (85%) comfortably absorbs the standard 3-5% marketplace transaction fee.',
        evidenceStrength: 'High',
        implementationEffort: 'Medium',
        strategicValue: 'High',
        riskLevel: 'Low',
        priority: 'High',
        suggestedNextAction: 'Finalize AWS Marketplace Seller registration and CPPO private offer enablement.',
        supportingEvidence: 'Cloud marketplace software transactions grew over 40% year-over-year.',
      },
    ],
    pestle: [
      {
        id: 'pestle-apex-1',
        category: 'Political',
        factorTitle: 'National Critical Infrastructure Cyber Mandates',
        description:
          'Government executive orders mandating zero-trust architectures and software bill of materials (SBOM) tracking across technology vendors.',
        potentialImpact: 'High',
        businessRelevance: 'Drives enterprise urgency for continuous posture verification.',
        type: 'Opportunity',
        confidenceLevel: 'High',
        evidenceOrSource: 'White House Executive Order on Improving the Nation’s Cybersecurity',
      },
      {
        id: 'pestle-apex-2',
        category: 'Economic',
        factorTitle: 'IT Budget Scrutiny & Tool Consolidation Mandates',
        description:
          'CFOs demanding that security leaders eliminate redundant point tools and justify software ROI through demonstrable headcount efficiency.',
        potentialImpact: 'Medium',
        businessRelevance: 'ApexSec’s $2,400/mo price point provides massive cost savings over legacy $90,000 suites.',
        type: 'Opportunity',
        confidenceLevel: 'High',
        evidenceOrSource: 'Gartner IT Key Metrics Data',
      },
      {
        id: 'pestle-apex-3',
        category: 'Legal',
        factorTitle: 'SEC 4-Day Cyber Incident Disclosure Rules & EU DORA Framework',
        description:
          'Strict regulatory deadlines for disclosing material vulnerabilities and security incidents create intense CISO demand for real-time posture awareness.',
        potentialImpact: 'High',
        businessRelevance: 'ApexSec provides continuous posture tracking to eliminate undetected security drift.',
        type: 'Opportunity',
        confidenceLevel: 'High',
        evidenceOrSource: 'U.S. Securities and Exchange Commission (SEC) Cybersecurity Rules',
      },
    ],
    challenges: [
      {
        id: 'chal-apex-1',
        title: 'Mega-Vendor Enterprise Distribution Power',
        category: 'Competitive Rivalry',
        description:
          'Established security titans (Palo Alto, Microsoft Defender) bundle basic posture tools into existing multi-million dollar enterprise agreements.',
        severity: 'High',
        verificationNeeded: false,
        mitigationRecommendation:
          'Compete strictly on automated code remediation speed and developer adoption rather than broad checkbox feature counts.',
      },
    ],
    strategicRecommendations: [
      {
        title: 'Launch Interactive "Code Over Tickets" Self-Guided Sandbox',
        description:
          'Enable DevOps and security architects to evaluate automated Terraform PR generation directly in their browser without talking to a sales rep.',
        priority: 'High',
        timeline: 'Weeks 1-3',
        riskFactor: 'Must ensure sandbox environment is completely sandboxed and responsive.',
      },
    ],
    limitationsAndMissingData: [
      'Market share estimates for incumbent CSPM vendors represent industry analyst projections.',
      'Customer MTTR reduction metrics require live customer cohort benchmarking across 90-day production deployments.',
    ],
    sources: [
      {
        id: 'src-apex-1',
        sourceTitle: 'Hype Cycle for Cloud Security, 2025',
        publisherOrWebsite: 'Gartner Research',
        sourceUrl: 'https://www.gartner.com/en/documents/cloud-security-hype-cycle',
        publicationDate: '2025-07-22',
        accessDate: '2026-11-12',
        relevantClaim: 'Highlights automated remediation as an essential capability for modern DevSecOps platforms.',
        researchCategory: 'Market Architecture',
        sourceType: 'Industry Publication',
        isVerified: true,
      },
    ],
    assistantChatHistory: [
      {
        id: 'msg-seed-apex-1',
        role: 'assistant',
        content:
          'Welcome to the Market Intelligence Assistant for ApexSec Cloud Intelligence. Ask me anything about cloud posture dynamics, competitor positioning against Wiz/Palo Alto, or PESTLE regulatory impacts.',
        timestamp: '2026-11-12T18:35:00.000Z',
        isStrategicReasoning: true,
      },
    ],
  },
];

class MarketResearchService {
  private getStoredReports(): MarketResearchReport[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_RESEARCH_REPORTS));
        return DEMO_RESEARCH_REPORTS;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_RESEARCH_REPORTS));
      return DEMO_RESEARCH_REPORTS;
    } catch {
      return DEMO_RESEARCH_REPORTS;
    }
  }

  public getReports(projectId?: string): MarketResearchReport[] {
    const list = this.getStoredReports();
    if (!projectId) return list;
    return list.filter((r) => r.projectId === projectId);
  }

  public getReportById(id: string): MarketResearchReport | undefined {
    return this.getStoredReports().find((r) => r.id === id);
  }

  public getLatestReport(projectId: string): MarketResearchReport | undefined {
    const list = this.getReports(projectId);
    if (list.length === 0) return undefined;
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }

  public saveReport(report: MarketResearchReport): void {
    const current = this.getStoredReports();
    const existingIndex = current.findIndex((r) => r.id === report.id);
    let next: MarketResearchReport[];

    if (existingIndex >= 0) {
      next = [...current];
      next[existingIndex] = report;
    } else {
      next = [report, ...current];
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Could not persist market research report to localStorage:', err);
    }
  }

  public updateReportTitle(id: string, newTitle: string): void {
    const report = this.getReportById(id);
    if (!report) return;
    report.reportTitle = newTitle;
    this.saveReport(report);
  }

  public deleteReport(id: string): void {
    const current = this.getStoredReports();
    const next = current.filter((r) => r.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Could not update localStorage after delete:', err);
    }
  }

  /**
   * Invokes server-side AI proxy to generate a structured Market Research Report.
   */
  public async generateMarketResearch(
    project: MarketingProject,
    customInputs: MarketResearchInput
  ): Promise<MarketResearchReport> {
    const res = await fetch('/api/generate-market-research', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ project, customInputs }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      const errCode = data.error || 'RESEARCH_FAILED';
      const errMsg =
        data.message || `Market research generation failed (HTTP ${res.status}).`;
      const err = new Error(errMsg);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err as any).code = errCode;
      throw err;
    }

    const generated = data.report as MarketResearchReport;
    const existing = this.getReports(project.id);
    generated.version = existing.length + 1;

    this.saveReport(generated);
    return generated;
  }

  /**
   * Invokes server-side AI proxy for interactive Q&A assistant referencing the report.
   */
  public async askResearchAssistant(
    report: MarketResearchReport,
    question: string,
    history?: ResearchAssistantMessage[]
  ): Promise<{ answer: string; citedSourceIds?: string[] }> {
    const res = await fetch('/api/research-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ report, question, history }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      throw new Error(data.message || 'Failed to query research assistant.');
    }

    return {
      answer: data.answer,
      citedSourceIds: data.citedSourceIds,
    };
  }
}

export const marketResearchService = new MarketResearchService();

