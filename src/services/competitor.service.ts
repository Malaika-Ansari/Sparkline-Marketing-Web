/**
 * SPARKLINE MARKETING — COMPETITOR INTELLIGENCE SERVICE
 * Phase 10: Competitor Intelligence, SWOT & Competitive Analysis
 */

import { MarketingProject } from '@/types/project';
import {
  CompetitorProfile,
  CompetitorAnalysisReport,
  CompetitorAssistantMessage,
} from '@/types/competitor';

const COMPETITORS_STORAGE_KEY = 'sparkline_marketing_project_competitors';
const REPORTS_STORAGE_KEY = 'sparkline_marketing_competitor_reports';

/**
 * Pre-seeded Demonstration Competitor Profiles
 */
export const DEMO_COMPETITOR_PROFILES: CompetitorProfile[] = [
  // 1. GlowBiome Organics Competitors
  {
    id: 'comp-skinceuticals',
    projectId: 'proj-vitamin-c',
    name: 'SkinCeuticals',
    websiteUrl: 'https://www.skinceuticals.com',
    industry: 'Clinical Dermatology & Clean Beauty',
    locationOrMarket: 'United States, Global',
    relationship: 'Direct',
    productDescription:
      'Gold standard C E Ferulic patented 15% pure L-ascorbic acid, 1% alpha tocopherol, and 0.5% ferulic acid antioxidant serum.',
    pricingInfo: '$182.00 for 1.0 fl oz / 30ml ($182/oz)',
    mainSellingPoints: [
      'Original patented Duke University antioxidant formula parameter',
      'Recommended by 8,500+ board-certified dermatologists and plastic surgeons',
      'Documented 8x environmental skin photoaging defense',
    ],
    socialLinks: {
      instagram: 'https://instagram.com/skinceuticals',
      linkedin: 'https://linkedin.com/company/skinceuticals',
    },
    knownStrengths: [
      'Decades of clinical published trials and peer-reviewed dermatology backing',
      'Unsurpassed brand prestige and clinic distribution footprint',
      'High brand retention among affluent demographic buyers',
    ],
    knownWeaknesses: [
      'Prohibitive $182 price point creates significant friction for younger millennials/Gen-Z',
      'Traditional amber glass dropper allows oxygen ingress, turning serum dark amber within 45-60 days',
      'Pungent, metallic barbecue/hot-dog water smell widely criticized in consumer reviews',
      'Not certified vegan or cruelty-free; relies on animal-tested supplier data',
    ],
    notes:
      'Direct pricing anchor. GlowBiome can highlight identical clinical potency ($58 vs $182) in nitrogen-sealed pump packaging.',
    isUserEntered: false,
    researchStatus: 'Researched',
    createdAt: '2026-11-12T10:00:00.000Z',
    updatedAt: '2026-11-12T10:00:00.000Z',
  },
  {
    id: 'comp-drunk-elephant',
    projectId: 'proj-vitamin-c',
    name: 'Drunk Elephant',
    websiteUrl: 'https://www.drunkelephant.com',
    industry: 'Clean-Compatible Skincare',
    locationOrMarket: 'United States, UK, Europe, Australia',
    relationship: 'Direct',
    productDescription:
      'C-Firma Fresh Day Serum featuring 15% L-Ascorbic Acid designed to be mixed by the customer prior to first use.',
    pricingInfo: '$79.00 for 0.94 fl oz / 28ml ($84/oz)',
    mainSellingPoints: [
      'Customer-mixed liquid-and-powder format guarantees formula freshness on day one',
      'Clean-compatible formulation free of the "Suspicious 6" ingredients',
      'Vibrant shelf presence and Sephora endcap prominence',
    ],
    socialLinks: {
      instagram: 'https://instagram.com/drunkelephant',
      twitter: 'https://x.com/drunkelephant',
    },
    knownStrengths: [
      'Massive social proof and viral TikTok reach across beauty enthusiasts',
      'High Sephora retail foot traffic and prominent shelf placement',
      'Customer mixing novelty validates freshness awareness',
    ],
    knownWeaknesses: [
      'Customer mixing process is clumsy, prone to clumping, and frustrating for users',
      'Heavy, tacky post-application residue that pills under mineral sunscreen',
      'Acquisition by Shiseido led to consumer skepticism regarding ingredient purity',
    ],
    notes:
      'Strong direct competitor. GlowBiome wins on hassle-free pre-sealed airless delivery and non-tacky microbiome hydration.',
    isUserEntered: false,
    researchStatus: 'Researched',
    createdAt: '2026-11-12T10:00:00.000Z',
    updatedAt: '2026-11-12T10:00:00.000Z',
  },
  {
    id: 'comp-sunday-riley',
    projectId: 'proj-vitamin-c',
    name: 'Sunday Riley',
    websiteUrl: 'https://www.sundayriley.com',
    industry: 'Luxury Botanical Skincare',
    locationOrMarket: 'North America, United Kingdom, EU',
    relationship: 'Indirect',
    productDescription:
      'C.E.O. 15% Vitamin C Brightening Serum using Tetrahexyldecyl (THD) Ascorbate in a hydrating cream emulsion.',
    pricingInfo: '$85.00 for 1.0 fl oz / 30ml ($85/oz)',
    mainSellingPoints: [
      'Lipid-soluble THD Ascorbate is gentler on sensitive skin than pure acid',
      'Rich moisturizing lotion texture with natural citrus aroma',
      'Rapid absorption without sticky aftermath',
    ],
    socialLinks: {
      instagram: 'https://instagram.com/sundayriley',
    },
    knownStrengths: [
      'Pleasant sensory experience and luxurious citrus fragrance',
      'High satisfaction among dry and mature skin demographics',
    ],
    knownWeaknesses: [
      'THD Ascorbate has less clinical backing for deep hyperpigmentation than pure L-Ascorbic acid',
      'Contains fragrance and essential oils that trigger contact dermatitis in rosacea patients',
      'Heavy lotion vehicle can clog pores for acne-prone skin types',
    ],
    notes:
      'Indirect alternative. Appeals to fragrance lovers, but fails for sensitive rosacea-prone customers that GlowBiome targets.',
    isUserEntered: false,
    researchStatus: 'Researched',
    createdAt: '2026-11-12T10:00:00.000Z',
    updatedAt: '2026-11-12T10:00:00.000Z',
  },

  // 2. ApexSec Cloud Intelligence Competitors
  {
    id: 'comp-wiz',
    projectId: 'proj-apex-cloud',
    name: 'Wiz',
    websiteUrl: 'https://www.wiz.io',
    industry: 'Cloud Security & Posture Management (CSPM)',
    locationOrMarket: 'Global Enterprise',
    relationship: 'Direct',
    productDescription:
      'Agentless cloud security platform analyzing compute, network, identity, and secrets across multi-cloud environments via graph correlation.',
    pricingInfo: 'Enterprise negotiated contracts: typically $60,000 to $250,000+ ARR',
    mainSellingPoints: [
      'Rapid 15-minute API agentless connector onboarding',
      'Security Graph correlates misconfigurations, toxic combinations, and exposure paths',
      'Trusted by 40% of the Fortune 100 enterprise organizations',
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/wiz-sec',
      twitter: 'https://x.com/wiz_io',
    },
    knownStrengths: [
      'Dominant brand prestige, hyper-growth momentum, and elite investor backing',
      'Comprehensive agentless scanner covering AWS, Azure, GCP, and Kubernetes',
      'Executive-level CISO reporting and audit compliance dashboards',
    ],
    knownWeaknesses: [
      'Massive enterprise alert volume without automated code-level remediation',
      'High pricing floor alienates mid-market engineering teams ($1M-$50M ARR)',
      'Security-first perspective creates friction with DevOps teams tired of Jira tickets',
    ],
    notes:
      'Primary direct rival. ApexSec differentiates with "Code, Not Tickets" automated Terraform PR fixes and mid-market friendly tiers.',
    isUserEntered: false,
    researchStatus: 'Researched',
    createdAt: '2026-11-12T10:00:00.000Z',
    updatedAt: '2026-11-12T10:00:00.000Z',
  },
  {
    id: 'comp-prisma-cloud',
    projectId: 'proj-apex-cloud',
    name: 'Palo Alto Networks (Prisma Cloud)',
    websiteUrl: 'https://www.paloaltonetworks.com/prisma/cloud',
    industry: 'Enterprise Cyber Security Suite',
    locationOrMarket: 'Global Enterprise & Public Sector',
    relationship: 'Direct',
    productDescription:
      'Comprehensive Cloud Native Application Protection Platform (CNAPP) spanning code security, CSPM, CWPP, and web application firewalls.',
    pricingInfo: 'Credit-based enterprise licensing; typically $80,000+ minimum spend',
    mainSellingPoints: [
      'End-to-end CNAPP covering code to runtime defenses',
      'Single vendor consolidation under Palo Alto enterprise agreements',
      'Extensive regulatory compliance reporting (FedRAMP, HIPAA, PCI-DSS)',
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/palo-alto-networks',
    },
    knownStrengths: [
      'Entrenched procurement relationships in Fortune 500 enterprise accounts',
      'Broad feature footprint spanning network, container, and cloud infrastructure',
    ],
    knownWeaknesses: [
      'Notoriously clunky, fragmented console acquired through multiple disparate acquisitions',
      'Heavy administrative overhead requiring dedicated full-time security engineers',
      'Slow remediation cycle times (average MTTR exceeding 18 days)',
    ],
    notes:
      'Incumbent conglomerate. ApexSec wins on modern developer experience, instant onboarding, and focused remediation speed.',
    isUserEntered: false,
    researchStatus: 'Researched',
    createdAt: '2026-11-12T10:00:00.000Z',
    updatedAt: '2026-11-12T10:00:00.000Z',
  },
  {
    id: 'comp-snyk',
    projectId: 'proj-apex-cloud',
    name: 'Snyk',
    websiteUrl: 'https://snyk.io',
    industry: 'Developer Security Platform',
    locationOrMarket: 'Global DevSecOps',
    relationship: 'Indirect',
    productDescription:
      'Developer-first security tooling scanning open-source software dependencies, containers, and infrastructure-as-code scripts.',
    pricingInfo: 'Freemium tier + Team plans from $98/mo/dev to custom Enterprise contracts',
    mainSellingPoints: [
      'Native developer IDE plugins and automated pull request generation',
      'Deep open-source vulnerability database (Snyk Intel)',
      'High brand loyalty among software developers and DevOps engineers',
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/snyk',
      twitter: 'https://x.com/snyksec',
    },
    knownStrengths: [
      'Seamless developer workflow integration and automated fix PRs',
      'Bottom-up developer adoption model',
    ],
    knownWeaknesses: [
      'Limited real-time cloud runtime posture and live infrastructure visibility',
      'Does not correlate IAM misconfigurations with live attack paths in production',
    ],
    notes:
      'Indirect competitor. Snyk owns code dependencies, while ApexSec bridges live cloud runtime misconfigurations back to IaC code.',
    isUserEntered: false,
    researchStatus: 'Researched',
    createdAt: '2026-11-12T10:00:00.000Z',
    updatedAt: '2026-11-12T10:00:00.000Z',
  },
];

/**
 * Pre-seeded Demonstration Competitor Intelligence Reports
 */
export const DEMO_COMPETITOR_REPORTS: CompetitorAnalysisReport[] = [
  {
    id: 'comp-report-glowbiome',
    projectId: 'proj-vitamin-c',
    projectName: 'GlowBiome Organics',
    reportTitle: 'Clinical Clean Skincare — Competitive Intelligence & SWOT Benchmark',
    version: 1,
    createdAt: '2026-11-13T10:30:00.000Z',
    modelIdentifier: 'gemini-1.5-flash',
    status: 'Completed',
    isLiveResearchConfigured: false,
    executiveSummary:
      'A thorough competitive benchmark of the premium Vitamin C skincare landscape reveals a polarized market: legacy clinical incumbents (SkinCeuticals) charge prohibitive $180+ luxury markups while suffering from rapid active oxidation in open droppers, while mass clean brands (Drunk Elephant, Sunday Riley) compromise on stability or require inconvenient consumer mixing. GlowBiome Organics occupies a distinct asymmetric wedge: offering identical 15% L-Ascorbic clinical efficacy stabilized in nitrogen-flushed airless pumps with prebiotics for $58. Differentiating around "Active Potency to the Final Pump" directly exploits the oxidation and price vulnerabilities of market incumbents.',
    competitorsAnalyzed: DEMO_COMPETITOR_PROFILES.filter(
      (c) => c.projectId === 'proj-vitamin-c'
    ),
    comparisonRows: [
      {
        competitorId: 'user-business',
        competitorName: 'GlowBiome Organics (Our Brand)',
        relationship: 'Direct',
        productCategory: 'Microbiome Clinical Serum',
        targetAudience: 'Skincare enthusiasts with sensitive or barrier-compromised skin',
        pricingPosition: '$58.00 / 30ml (Accessible Clinical Value)',
        mainValueProposition:
          '15% L-Ascorbic Acid + prebiotic microbiome complex in nitrogen-sealed airless packaging that never oxidizes.',
        brandPositioning: 'Empirical Clean & Dermatological Transparency',
        marketingChannels: ['TikTok Organic & Paid', 'Meta Problem-Solution', 'Email Lifecycle'],
        publiclyObservedStrengths: [
          'High gross margin (72%) supporting acquisition spend',
          'Nitrogen-sealed airless pump prevents oxidation degradation',
          'Prebiotic balance prevents contact dermatitis and stinging',
        ],
        publiclyObservedWeaknesses: [
          'Early-stage brand awareness vs legacy conglomerates',
          'Limited clinical published trial repository compared to 20-year incumbents',
        ],
        differentiationOpportunities: [
          'Position against $180 dropper oxidation waste with side-by-side color tests',
          'Lead with 90-day empty bottle potency guarantee',
        ],
        evidenceLevel: 'High',
      },
      {
        competitorId: 'comp-skinceuticals',
        competitorName: 'SkinCeuticals',
        relationship: 'Direct',
        productCategory: 'Patented Dermatological Antioxidant',
        targetAudience: 'Affluent clinic patients, dermatologists, high-disposable income buyers',
        pricingPosition: '$182.00 / 30ml (Ultra-Luxury Clinical Anchor)',
        mainValueProposition:
          'Patented Duke antioxidant parameter delivering 8x natural skin photoprotection.',
        brandPositioning: 'The In-Office Dermatologist Gold Standard',
        marketingChannels: ['Medical Spa Distribution', 'Search Brand Capture', 'Dermatologist PR'],
        publiclyObservedStrengths: [
          'Deepest peer-reviewed clinical research body in the industry',
          'Enormous clinical loyalty among medical dermatologists',
        ],
        publiclyObservedWeaknesses: [
          'Traditional dropper causes formula to turn dark brown before bottle is finished',
          'Severe pricing barrier ($182) alienates mainstream D2C buyers',
          'Unpleasant metallic smell frequently highlighted in negative reviews',
        ],
        differentiationOpportunities: [
          'Anchor $58 price against $182 to highlight 3x value ratio',
          'Highlight airless pump eliminating dropper oxidation entirely',
        ],
        evidenceLevel: 'High',
      },
      {
        competitorId: 'comp-drunk-elephant',
        competitorName: 'Drunk Elephant',
        relationship: 'Direct',
        productCategory: 'Clean-Compatible Day Serum',
        targetAudience: 'Clean beauty shoppers, Sephora retail patrons, millennial/Gen-Z demographic',
        pricingPosition: '$79.00 / 28ml (Prestige Retail Clean)',
        mainValueProposition:
          'Freshly customer-mixed liquid and powder serum free of the Suspicious 6 ingredients.',
        brandPositioning: 'Playful Prestige Clean Routine',
        marketingChannels: ['Sephora In-Store', 'TikTok Viral Creator Marketing', 'Instagram Lifestyle'],
        publiclyObservedStrengths: [
          'Incredible shelf visibility in Sephora worldwide',
          'Strong social brand recognition and creative packaging aesthetic',
        ],
        publiclyObservedWeaknesses: [
          'Two-part manual mixing process is frustrating and causes powder clumping',
          'Tacky residue leaves skin sticky and pills under makeup/sunscreen',
        ],
        differentiationOpportunities: [
          'Emphasize pre-stabilized, ready-to-use airless pump with zero mixing hassle',
          'Showcase weightless, fast-absorbing water-gel texture',
        ],
        evidenceLevel: 'High',
      },
      {
        competitorId: 'comp-sunday-riley',
        competitorName: 'Sunday Riley',
        relationship: 'Indirect',
        productCategory: 'Botanical Brightening Serum',
        targetAudience: 'Luxury department store shoppers seeking glowing, fragrant skin',
        pricingPosition: '$85.00 / 30ml (Prestige Department Store)',
        mainValueProposition:
          '15% THD Ascorbate ester in a nourishing, citrus-scented hydrating lotion base.',
        brandPositioning: 'Luxury Botanical Radiance',
        marketingChannels: ['Ulta Beauty', 'Nordstrom / Bloomingdales', 'Influencer Gifting'],
        publiclyObservedStrengths: [
          'Pleasant fragrance and moisturizing lotion feel appealing to dry mature skin',
          'Gentler on skin than pure acid formulations',
        ],
        publiclyObservedWeaknesses: [
          'Fragrance and essential oils irritate rosacea and acne-prone skin',
          'THD Ascorbate is slower-acting for deep sun spots than pure L-Ascorbic acid',
        ],
        differentiationOpportunities: [
          'Capture fragrance-sensitive customers seeking pure clinical anti-aging without pore clogs',
        ],
        evidenceLevel: 'Medium',
      },
    ],
    swotAnalyses: [
      {
        entityId: 'user-business',
        entityName: 'GlowBiome Organics (Our Business)',
        isUserBusiness: true,
        strengths: [
          {
            id: 'swot-gb-s1',
            point: 'Patented Airless Nitrogen Packaging',
            explanation:
              'Zero oxygen exposure ensures active L-Ascorbic acid remains clear and potent for 12 months, solving the #1 consumer pain point of brown oxidized serums.',
            isVerified: true,
            confidenceLevel: 'High',
            sourceCitation: 'Manufacturer Stability Study & Packaging Audit',
          },
          {
            id: 'swot-gb-s2',
            point: 'Prebiotic Barrier Protection Synergy',
            explanation:
              'Combining active vitamin C with prebiotics minimizes micro-tears and contact dermatitis on sensitive skin types.',
            isVerified: true,
            confidenceLevel: 'High',
          },
          {
            id: 'swot-gb-s3',
            point: '72% Direct Gross Margin Buffer',
            explanation:
              'Allows substantial customer acquisition allowance across digital paid social channels while maintaining healthy unit contribution.',
            isVerified: true,
            confidenceLevel: 'High',
          },
        ],
        weaknesses: [
          {
            id: 'swot-gb-w1',
            point: 'Zero Physical Retail Distribution',
            explanation:
              'Unlike Drunk Elephant in Sephora or SkinCeuticals in dermatologist clinics, GlowBiome is currently 100% reliant on direct digital acquisition.',
            isVerified: true,
            confidenceLevel: 'High',
          },
          {
            id: 'swot-gb-w2',
            point: 'Early Brand Search Volume',
            explanation:
              'Organic brand keyword search volume is nascent; requires upfront paid traffic to build awareness.',
            isVerified: false,
            confidenceLevel: 'Medium',
          },
        ],
        opportunities: [
          {
            id: 'swot-gb-o1',
            point: 'Capture Disillusioned SkinCeuticals Dropper Buyers',
            explanation:
              'Meta video ad campaigns targeting users searching for "SkinCeuticals oxidized / turned brown" can convert price-sensitive clinical shoppers to our $58 pump.',
            isVerified: true,
            confidenceLevel: 'High',
            sourceCitation: 'Reddit SkincareAddiction & Derm Review Sentiment',
          },
          {
            id: 'swot-gb-o2',
            point: '60-Day Automated Replenishment Subscriptions',
            explanation:
              'Offering 15% recurring subscription discounts locks in high customer lifetime value (LTV) and offsets rising ad auction CAC.',
            isVerified: true,
            confidenceLevel: 'High',
          },
        ],
        threats: [
          {
            id: 'swot-gb-t1',
            point: 'Ad Auction Inflation Across Meta & TikTok',
            explanation:
              'Beauty CPMs rising 18-24% year-over-year threaten blended customer acquisition costs if conversion rates dip below 2.5%.',
            isVerified: true,
            confidenceLevel: 'High',
            sourceCitation: 'Digital Ad Benchmark Index 2025-2026',
          },
          {
            id: 'swot-gb-t2',
            point: 'Private Label Dupes on Amazon & TikTok Shop',
            explanation:
              'Cheap white-label $15 Vitamin C serums with unstable formulas confuse novice consumers regarding price/quality expectations.',
            isVerified: false,
            confidenceLevel: 'Medium',
          },
        ],
        strategicTakeaway:
          'GlowBiome holds a decisive technical and pricing advantage over incumbents. Focus all top-of-funnel creative on visible packaging proof (no oxidation, no sticky residue, no $182 price gouging).',
      },
      {
        entityId: 'comp-skinceuticals',
        entityName: 'SkinCeuticals (Rival)',
        isUserBusiness: false,
        strengths: [
          {
            id: 'swot-sc-s1',
            point: 'Unassailable In-Clinic Medical Authority',
            explanation: 'Dermatologists receive lucrative professional margins, making them active brand evangelists.',
            isVerified: true,
            confidenceLevel: 'High',
            sourceCitation: 'Aesthetic Dermatology Journal',
          },
          {
            id: 'swot-sc-s2',
            point: 'Duke Patent Intellectual Property',
            explanation: 'Protected the optimal pH 2.5-3.0 and ratio parameters for decades.',
            isVerified: true,
            confidenceLevel: 'High',
          },
        ],
        weaknesses: [
          {
            id: 'swot-sc-w1',
            point: 'Active Oxidation Degradation',
            explanation: 'Pipette dropper allows ambient oxygen to spoil the formula into brown dehydroascorbic acid.',
            isVerified: true,
            confidenceLevel: 'High',
            sourceCitation: 'Consumer Product Safety & Stability Testing',
          },
          {
            id: 'swot-sc-w2',
            point: 'Excessive Pricing Anchor ($182)',
            explanation: 'Drives younger consumers to seek clinical alternatives.',
            isVerified: true,
            confidenceLevel: 'High',
          },
        ],
        opportunities: [
          {
            id: 'swot-sc-o1',
            point: 'Reformulate into Airless Delivery Packaging',
            explanation: 'Incumbent could modernize packaging, neutralizing our primary hardware differentiator.',
            isVerified: false,
            confidenceLevel: 'Medium',
          },
        ],
        threats: [
          {
            id: 'swot-sc-t1',
            point: 'Loss of Millennial Demographic to D2C Clinicals',
            explanation: 'Younger cohorts reject traditional luxury markup in favor of transparent D2C brands.',
            isVerified: true,
            confidenceLevel: 'High',
          },
        ],
        strategicTakeaway:
          'Vulnerable to visual comparison marketing. Do not attack their clinical science; attack their packaging oxidation and $182 retail price.',
      },
    ],
    positioningAnalysis: {
      dimensions: [
        {
          dimension: 'Price vs Value Anchoring',
          userPosition: '$58 direct clinical value (Accessible Luxury)',
          competitorAssessments: [
            {
              competitorId: 'comp-skinceuticals',
              competitorName: 'SkinCeuticals',
              assessment: '$182 luxury medical clinic anchor',
              relativeStanding: 'Leader',
            },
            {
              competitorId: 'comp-drunk-elephant',
              competitorName: 'Drunk Elephant',
              assessment: '$79 prestige retail Sephora anchor',
              relativeStanding: 'Parity',
            },
            {
              competitorId: 'comp-sunday-riley',
              competitorName: 'Sunday Riley',
              assessment: '$85 department store luxury tier',
              relativeStanding: 'Parity',
            },
          ],
          strategicImplication:
            'GlowBiome undercuts all three prestige incumbents by 26% to 68% while preserving a 72% gross margin.',
        },
        {
          dimension: 'Active Formula Stability & Packaging',
          userPosition: 'Nitrogen-sealed vacuum airless pump (Zero oxidation exposure)',
          competitorAssessments: [
            {
              competitorId: 'comp-skinceuticals',
              competitorName: 'SkinCeuticals',
              assessment: 'Open dropper bottle; oxidizes within 6-8 weeks',
              relativeStanding: 'Laggard',
            },
            {
              competitorId: 'comp-drunk-elephant',
              competitorName: 'Drunk Elephant',
              assessment: 'Customer-mixed powder/liquid; inconvenient',
              relativeStanding: 'Parity',
            },
          ],
          strategicImplication:
            'The core hardware moat. Highlight that 100% of the active potency reaches the skin rather than oxidizing on the shelf.',
        },
        {
          dimension: 'Skin Barrier Friendliness & Texture',
          userPosition: 'Prebiotic microbiome complex; lightweight non-tacky water gel',
          competitorAssessments: [
            {
              competitorId: 'comp-drunk-elephant',
              competitorName: 'Drunk Elephant',
              assessment: 'Sticky post-application finish; prone to pilling',
              relativeStanding: 'Laggard',
            },
            {
              competitorId: 'comp-sunday-riley',
              competitorName: 'Sunday Riley',
              assessment: 'Heavier cream lotion with fragrance irritants',
              relativeStanding: 'Differentiated',
            },
          ],
          strategicImplication:
            'Wins on sensitive skin tolerance, makeup wearability, and morning speed.',
        },
      ],
      positioningMap: {
        xAxisName: 'Price Tier ($30 Value → $190 Ultra-Luxury)',
        yAxisName: 'Formulation Stability & Sensitivity Defense (Low → Clinical Airless)',
        hasSufficientEvidence: true,
        points: [
          {
            entityId: 'user-business',
            entityName: 'GlowBiome Organics (Us)',
            isUserBusiness: true,
            xAxisValue: 35, // Accessible price
            yAxisValue: 90, // Highest stability & barrier defense
            xAxisLabel: '$58 Accessible Clinical',
            yAxisLabel: 'Nitrogen Airless + Prebiotics',
            evidenceBasis: 'Lab packaging audit and formula spec',
          },
          {
            entityId: 'comp-skinceuticals',
            entityName: 'SkinCeuticals',
            isUserBusiness: false,
            xAxisValue: 95, // Ultra-high price
            yAxisValue: 55, // High clinical efficacy but high oxidation vulnerability
            xAxisLabel: '$182 Medical Clinic',
            yAxisLabel: 'Patented Duke Formula / Open Dropper',
            evidenceBasis: 'MSRP & public dropper stability studies',
          },
          {
            entityId: 'comp-drunk-elephant',
            entityName: 'Drunk Elephant',
            isUserBusiness: false,
            xAxisValue: 50,
            yAxisValue: 65,
            xAxisLabel: '$79 Sephora Prestige',
            yAxisLabel: 'Clean-Compatible / Customer Mixing',
            evidenceBasis: 'Retail MSRP and packaging review data',
          },
          {
            entityId: 'comp-sunday-riley',
            entityName: 'Sunday Riley',
            isUserBusiness: false,
            xAxisValue: 55,
            yAxisValue: 40,
            xAxisLabel: '$85 Department Store',
            yAxisLabel: 'Fragrant Lotion Base / THD Ester',
            evidenceBasis: 'Product label & formulation review',
          },
        ],
      },
      descriptiveNarrative:
        'The competitive positioning matrix demonstrates that GlowBiome Organics occupies the highly lucrative "Accessible Clinical Precision" quadrant: high technological stability with zero luxury price inflation.',
    },
    competitiveOpportunities: [
      {
        id: 'opp-comp-1',
        title: 'Launch "The Final Drop" Side-by-Side Oxidation Video Ad',
        category: 'Messaging Standout',
        description:
          'Create high-contrast side-by-side video ad creative comparing SkinCeuticals dropper serum turning dark brown at Day 45 versus GlowBiome remaining crystal clear in our airless nitrogen pump.',
        supportingEvidence:
          'Consistently #1 search query on Reddit r/SkincareAddiction regarding C E Ferulic longevity.',
        businessRelevance:
          'Directly exploits the greatest weakness of the category leader to justify choosing GlowBiome.',
        potentialValue: 'High',
        implementationEffort: 'Low',
        priority: 'High',
        confidence: 'High',
        suggestedNextAction:
          'Produce 3 versions of 15-second visual hook showing dropper oxidation vs airless pump clarity for Meta Ads.',
      },
      {
        id: 'opp-comp-2',
        title: 'Target "Price Barrier" Search Keywords with $58 Anchor Landing Page',
        category: 'Pricing Differentiation',
        description:
          'Deploy search capture ads for commercial keywords such as "SkinCeuticals C E Ferulic dupe", "best alternative to C E Ferulic", and "affordable stable vitamin c serum".',
        supportingEvidence:
          'High buyer search intent; category benchmark CPCs for alternative keywords are 40% cheaper than direct brand keywords.',
        businessRelevance:
          'Captures high-intent buyers who are already pre-sold on the benefits of 15% vitamin C but balk at $182.',
        potentialValue: 'High',
        implementationEffort: 'Medium',
        priority: 'High',
        confidence: 'High',
        suggestedNextAction:
          'Build a dedicated comparison landing page displaying a transparent ingredient-by-ingredient matrix ($182 vs $58).',
      },
      {
        id: 'opp-comp-3',
        title: 'Offer "Hassle-Free Freshness" Against Drunk Elephant Customer Mixing',
        category: 'Feature Moat',
        description:
          'Highlight that consumers should not have to act as amateur chemists mixing powder and liquid in their bathroom sink.',
        supportingEvidence:
          'Verified customer reviews on Sephora citing powder clumping and spilled serum during initial mixing.',
        businessRelevance:
          'Appeals to busy professionals who want immediate morning application without mess.',
        potentialValue: 'Medium',
        implementationEffort: 'Low',
        priority: 'Medium',
        confidence: 'High',
        suggestedNextAction:
          'Feature customer testimonials praising the smooth, single-press morning pump application.',
      },
    ],
    observedStrengthsSummary: [
      'Incumbents possess deep clinical brand recognition and retail department store distribution.',
      'Category price tolerance remains extraordinarily high, validating consumer willingness to invest in facial antioxidants.',
    ],
    differentiationAnglesSummary: [
      'Packaging Superiority: Nitrogen-flushed airless pump prevents discoloration and oxidation.',
      'Formula Gentleness: Prebiotic microbiome defense eliminates acidic stinging.',
      'Commercial Value: 100% clinical efficacy at $58 vs $182 incumbent markup.',
    ],
    competitiveRisksToMonitor: [
      'SkinCeuticals or L\'Oréal patenting airless pump packaging for future product iterations.',
      'Sephora launching private-label clean clinical alternatives at $25-$35 price tiers.',
      'Digital ad auction inflation across Meta and TikTok raising customer acquisition cost.',
    ],
    sources: [
      {
        id: 'src-comp-1',
        competitorId: 'comp-skinceuticals',
        competitorName: 'SkinCeuticals',
        sourceTitle: 'C E Ferulic Product Specifications & Patent 7,179,841',
        publisherOrWebsite: 'SkinCeuticals / L\'Oréal Clinical Archives',
        sourceUrl: 'https://www.skinceuticals.com/skincare/vitamin-c-serums/c-e-ferulic/S17.html',
        publicationDate: '2025-01-10',
        accessDate: '2026-11-13',
        relevantObservation: 'Confirms 15% L-Ascorbic Acid concentration and $182 MSRP.',
        sourceCategory: 'Public Pricing',
        isVerified: true,
      },
      {
        id: 'src-comp-2',
        competitorId: 'comp-drunk-elephant',
        competitorName: 'Drunk Elephant',
        sourceTitle: 'C-Firma Fresh Day Serum Mixing Instructions & User Reviews',
        publisherOrWebsite: 'Sephora US Online Store',
        sourceUrl: 'https://www.sephora.com/product/drunk-elephant-c-firma-fresh-day-serum-P476483',
        publicationDate: '2025-06-18',
        accessDate: '2026-11-13',
        relevantObservation:
          'Customer reviews confirm frequent powder clumping and post-application tackiness.',
        sourceCategory: 'Customer Reviews',
        isVerified: true,
      },
    ],
    limitationsAndMissingData: [
      'Private competitor ad spend budgets on Meta and Google Ads represent algorithmic estimates; exact spend figures are proprietary to rival entities.',
      'Competitor customer retention rates are inferred from category repeat purchase benchmarks.',
    ],
    assistantChatHistory: [
      {
        id: 'msg-seed-1',
        role: 'assistant',
        content:
          'Welcome to the Competitive Intelligence Assistant for **GlowBiome Organics**. I can help you evaluate competitor weaknesses (like SkinCeuticals dropper oxidation), compare pricing strategies, explore positioning maps, or craft counter-positioning ad copy. How can I assist you?',
        timestamp: '2026-11-13T10:35:00.000Z',
        isStrategicReasoning: true,
      },
    ],
  },
];

class CompetitorService {
  /**
   * Retrieves all competitor profiles for a given project from localStorage.
   */
  public getCompetitors(projectId: string): CompetitorProfile[] {
    try {
      const raw = localStorage.getItem(COMPETITORS_STORAGE_KEY);
      let list: CompetitorProfile[] = [];
      if (raw) {
        list = JSON.parse(raw);
      } else {
        list = DEMO_COMPETITOR_PROFILES;
        localStorage.setItem(COMPETITORS_STORAGE_KEY, JSON.stringify(list));
      }
      return list.filter((c) => c.projectId === projectId);
    } catch {
      return DEMO_COMPETITOR_PROFILES.filter((c) => c.projectId === projectId);
    }
  }

  /**
   * Retrieves single competitor profile by ID.
   */
  public getCompetitorById(id: string): CompetitorProfile | undefined {
    try {
      const raw = localStorage.getItem(COMPETITORS_STORAGE_KEY);
      const list: CompetitorProfile[] = raw ? JSON.parse(raw) : DEMO_COMPETITOR_PROFILES;
      return list.find((c) => c.id === id);
    } catch {
      return DEMO_COMPETITOR_PROFILES.find((c) => c.id === id);
    }
  }

  /**
   * Saves or updates a competitor profile.
   */
  public saveCompetitor(competitor: CompetitorProfile): void {
    try {
      const raw = localStorage.getItem(COMPETITORS_STORAGE_KEY);
      const list: CompetitorProfile[] = raw ? JSON.parse(raw) : DEMO_COMPETITOR_PROFILES;
      const idx = list.findIndex((c) => c.id === competitor.id);
      let updated: CompetitorProfile[];
      if (idx >= 0) {
        updated = [...list];
        updated[idx] = { ...competitor, updatedAt: new Date().toISOString() };
      } else {
        updated = [{ ...competitor, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...list];
      }
      localStorage.setItem(COMPETITORS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not save competitor profile to localStorage:', err);
    }
  }

  /**
   * Deletes a competitor profile.
   */
  public deleteCompetitor(id: string): void {
    try {
      const raw = localStorage.getItem(COMPETITORS_STORAGE_KEY);
      const list: CompetitorProfile[] = raw ? JSON.parse(raw) : DEMO_COMPETITOR_PROFILES;
      const updated = list.filter((c) => c.id !== id);
      localStorage.setItem(COMPETITORS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not delete competitor profile from localStorage:', err);
    }
  }

  /**
   * Retrieves saved competitor analysis reports.
   */
  public getReports(projectId?: string): CompetitorAnalysisReport[] {
    try {
      const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
      let list: CompetitorAnalysisReport[] = [];
      if (raw) {
        list = JSON.parse(raw);
      } else {
        list = DEMO_COMPETITOR_REPORTS;
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(list));
      }
      if (!projectId) return list;
      return list.filter((r) => r.projectId === projectId);
    } catch {
      return projectId
        ? DEMO_COMPETITOR_REPORTS.filter((r) => r.projectId === projectId)
        : DEMO_COMPETITOR_REPORTS;
    }
  }

  /**
   * Retrieves single competitor report by ID.
   */
  public getReportById(id: string): CompetitorAnalysisReport | undefined {
    return this.getReports().find((r) => r.id === id);
  }

  /**
   * Saves or updates a competitor analysis report.
   */
  public saveReport(report: CompetitorAnalysisReport): void {
    try {
      const current = this.getReports();
      const existingIdx = current.findIndex((r) => r.id === report.id);
      let next: CompetitorAnalysisReport[];
      if (existingIdx >= 0) {
        next = [...current];
        next[existingIdx] = report;
      } else {
        next = [report, ...current];
      }
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Could not persist competitor report to localStorage:', err);
    }
  }

  /**
   * Updates report title.
   */
  public updateReportTitle(id: string, newTitle: string): void {
    const report = this.getReportById(id);
    if (!report) return;
    report.reportTitle = newTitle;
    this.saveReport(report);
  }

  /**
   * Deletes competitor analysis report.
   */
  public deleteReport(id: string): void {
    try {
      const current = this.getReports();
      const next = current.filter((r) => r.id !== id);
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Could not update localStorage after report delete:', err);
    }
  }

  /**
   * Server-side AI Proxy call to generate comprehensive Competitor Analysis Report.
   */
  public async generateCompetitorAnalysis(
    project: MarketingProject,
    competitors: CompetitorProfile[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customInputs?: Record<string, any>
  ): Promise<CompetitorAnalysisReport> {
    const res = await fetch('/api/generate-competitor-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ project, competitors, customInputs }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      const errCode = data.error || 'ANALYSIS_FAILED';
      const errMsg =
        data.message || `Competitor analysis generation failed (HTTP ${res.status}).`;
      const err = new Error(errMsg);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err as any).code = errCode;
      throw err;
    }

    const generated = data.report as CompetitorAnalysisReport;
    const existing = this.getReports(project.id);
    generated.version = existing.length + 1;

    this.saveReport(generated);
    return generated;
  }

  /**
   * Server-side AI Proxy call for competitor discovery if no competitors provided.
   */
  public async discoverCompetitors(
    project: MarketingProject,
    industry: string,
    market: string
  ): Promise<CompetitorProfile[]> {
    const res = await fetch('/api/discover-competitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ project, industry, market }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      throw new Error(data.message || 'Competitor discovery failed.');
    }

    const discovered = data.competitors as CompetitorProfile[];
    // Persist discovered competitors
    discovered.forEach((c) => this.saveCompetitor(c));
    return discovered;
  }

  /**
   * Interactive Q&A Assistant query referencing competitor report.
   */
  public async askCompetitorAssistant(
    report: CompetitorAnalysisReport,
    question: string,
    history?: CompetitorAssistantMessage[]
  ): Promise<{ answer: string; citedSourceIds?: string[] }> {
    const res = await fetch('/api/competitor-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ report, question, history }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      throw new Error(data.message || 'Failed to query competitive intelligence assistant.');
    }

    return {
      answer: data.answer,
      citedSourceIds: data.citedSourceIds,
    };
  }
}

export const competitorService = new CompetitorService();

