/**
 * SPARKLINE MARKETING — AUDIENCE & PERSONA SERVICE
 * Client persistence and API management layer for Phase 08.
 */

import { MarketingProject } from '@/types/project';
import {
  AudienceAnalysis,
  AudienceAnalysisInput,
  CustomerPersona,
} from '@/types/audience';
import { ApiClient } from './api-client';

const STORAGE_KEY = 'sparkline_marketing_audience_analyses';
const SAVED_PERSONAS_KEY = 'sparkline_marketing_saved_personas';

// Pre-seeded high-fidelity reference blueprint audience analyses
const DEMO_AUDIENCE_ANALYSES: AudienceAnalysis[] = [
  {
    id: 'aud-vitamin-c-001',
    projectId: 'proj-vitamin-c',
    projectName: 'GlowBiome Organics',
    version: 1,
    createdAt: '2026-11-12T16:00:00.000Z',
    modelIdentifier: 'Reference Blueprint (Verified Research Architecture)',
    status: 'Completed',
    executiveSummary:
      'GlowBiome Organics addresses an audience characterized by high ingredient literacy and pronounced skepticism toward conventional beauty marketing. Our analysis identifies 3 high-leverage segments: Clean Cosmeceutical Researchers, Hyperpigmentation & Sun Spot Solvers, and Routine Streamliners. Rather than broad demographic targeting, conversion efficiency relies on addressing the acute pain point of serum oxidation and formulation degradation before bottle completion.',
    inputSnapshot: {
      targetCountry: 'United States, Canada, United Kingdom',
      cityOrRegion: 'Urban & Suburban Metros',
      geographicMarketType: 'International',
      preferredLanguage: 'English',
      industry: 'Fashion and Beauty / Clean Cosmeceuticals',
      customerType: 'B2C',
      ageRange: '25-45 (Assumption based on buying power)',
      customerNeeds:
        'Visibly fade hyperpigmentation, brighten dull complexion, maintain healthy barrier without stinging.',
      customerPainPoints:
        'Serums oxidizing brown within 30 days, stinging on sensitive skin, $150+ department store markups.',
      interests: 'Clean beauty, dermatology, skincare routines, wellness, sustainability.',
      purchasingMotivations:
        'Achieving makeup-free skin confidence; preventative antioxidant protection against photoaging.',
      commonObjections:
        'Will this turn orange or spoil quickly? Will it break me out? Is 20% too strong for sensitive skin?',
      preferredChannels: ['Instagram', 'TikTok', 'Google Search', 'Email Marketing'],
      purchasingBehavior: 'Research-heavy; reads ingredient labels, inspects photos, seeks return guarantee.',
      productName: 'Organic Vitamin C Glow Serum',
      productPrice: 58,
      currency: 'USD',
      mainBenefits:
        'Stabilized 20% active potency with ferulic acid; prebiotic oat base calms redness; fresh for 12 months.',
      existingCustomerInfo: 'Millennial women seeking clinical-grade indie skincare with transparent testing.',
      marketingGoals: 'Increase sales, Lower customer acquisition cost, Maximize ROAS',
    },
    segments: [
      {
        id: 'seg-clean-researchers',
        name: 'Clean Cosmeceutical Researchers',
        description:
          'Highly educated, label-conscious consumers who prioritize active ingredient concentrations and non-toxic stabilizing agents over celebrity marketing.',
        mainCustomerNeed:
          'A clinical-strength 20% Vitamin C that remains chemically stable and does not trigger barrier flare-ups.',
        painPoints: [
          'Frustration with serums that oxidize brown after 3 weeks',
          'Skepticism toward "clean beauty" brands that lack active clinical potency',
          'Tired of paying $160 for department store heritage branding',
        ],
        purchaseMotivation:
          'Validation of efficacy through transparent lab reports and ingredient stability verification.',
        buyingBehavior:
          'Inspects INCI lists, checks dermatological reviews on Reddit and YouTube, compares price per active milliliter.',
        potentialObjections: [
          'How is this stabilized without synthetic parabens or BHT?',
          'Is the pH level optimized for actual cutaneous absorption?',
        ],
        productRelevance:
          'Matches their analytical desire for 20% L-Ascorbic Acid + 0.5% Ferulic Acid at a fair $58 price point.',
        recommendedMessaging:
          'The clinical active strength you demand. Stabilized naturally to the very last drop.',
        suitableChannels: ['Google Search', 'YouTube In-Depth Reviews', 'Reddit Skincare Communities', 'Email Newsletter'],
        contentPreferences: ['INCI ingredient breakdowns', 'Oxidation time-lapse tests', 'Formulator lab interviews'],
        suggestedCta: 'Inspect The Formulation & Lab Tests',
        strategicPriority: 'High',
        isHypothesis: true,
      },
      {
        id: 'seg-sun-spot-solvers',
        name: 'Hyperpigmentation & Sun Spot Solvers',
        description:
          'Results-oriented buyers dealing with stubborn melasma, post-inflammatory dark spots, or UV sun damage.',
        mainCustomerNeed:
          'Visibly brighter, more even skin tone within 30 to 45 days with verifiable proof.',
        painPoints: [
          'Wasted hundreds of dollars on low-potency drugstore serums that yielded zero visible lightening',
          'Self-consciousness when going out without heavy foundation or concealer',
          'Fear that strong acids will cause stinging, redness, or peeling',
        ],
        purchaseMotivation:
          'Restoring youthful radiance and waking up with skin that looks healthy and even without makeup.',
        buyingBehavior:
          'Visually driven. Responds strongly to authentic before-and-after photography and verified customer testimonials.',
        potentialObjections: [
          'How long until I see real results?',
          'What happens if it does not work for my skin tone?',
        ],
        productRelevance:
          'High 20% concentration delivers targeted lightening while prebiotic oat prevents hyper-reactive stinging.',
        recommendedMessaging:
          'Real dark spot fading in 30 days—backed by our Empty Bottle Money-Back Guarantee.',
        suitableChannels: ['Instagram Reels', 'TikTok UGC', 'Meta Retargeting Ads', 'Google Shopping'],
        contentPreferences: ['Before-and-after transformations', 'Customer video testimonials', 'Dermatologist application tips'],
        suggestedCta: 'Claim Your 30-Day Fresh Glow Bottle',
        strategicPriority: 'High',
        isHypothesis: true,
      },
      {
        id: 'seg-routine-streamliners',
        name: 'Mindful Routine Streamliners',
        description:
          'Busy working professionals who want an uncomplicated, high-impact morning regimen without 10 complicated steps.',
        mainCustomerNeed:
          'A single dependable daily antioxidant serum that hydrates, protects, and gives instant glow under sunscreen.',
        painPoints: [
          'Overwhelmed by complicated 8-step Korean skincare regimens',
          'Products that pill under makeup or leave sticky residue on the skin',
          'Lack of time to research dozens of competing skincare products',
        ],
        purchaseMotivation:
          'Simplicity, efficiency, and feeling polished with minimal morning effort.',
        buyingBehavior:
          'Seeks convenience, fast shipping, frictionless Apple Pay checkout, and auto-replenishment subscriptions.',
        potentialObjections: [
          'Does this absorb quickly so I can apply sunscreen right away?',
          'Will it feel heavy or greasy in humid weather?',
        ],
        productRelevance:
          'Fast-absorbing water-light texture that layers cleanly under daily SPF.',
        recommendedMessaging:
          'One potent morning step for all-day antioxidant defense and natural glow.',
        suitableChannels: ['Meta Mobile Feed', 'Instagram Stories', 'Pinterest Routine Pins', 'SMS VIP Alerts'],
        contentPreferences: ['30-second "Get Ready With Me" videos', 'Texture and absorption demos', 'Simple routine infographics'],
        suggestedCta: 'Simplify Your Morning Routine',
        strategicPriority: 'Medium',
        isHypothesis: true,
      },
    ],
    personas: [
      {
        id: 'per-elena-researcher',
        segmentId: 'seg-clean-researchers',
        personaName: 'Elena Ramos (The Ingredient Skeptic)',
        segmentName: 'Clean Cosmeceutical Researchers',
        tagline: 'Refuses to buy marketing hype; demands clinical ingredient concentrations and lab transparency.',
        avatarColor: 'bg-blue-600',
        isFictional: true,
        characteristics: {
          ageRangeAssumption: '31 - 38 years old (Estimated assumption based on discretionary spend)',
          geographicContext: 'Chicago, IL (Metropolitan professional)',
          occupationRole: 'Senior UX Researcher at a software company',
          lifestyleOrBusinessContext: 'Works hybrid schedule, practices mindful consumerism, shops clean markets.',
          interests: ['Functional medicine', 'Pilates', 'INCI decoder apps', 'Independent dermatological podcasts'],
        },
        psychology: {
          goals: [
            'Maintain a radiant, youthful skin barrier into her late thirties without invasive cosmetic procedures',
            'Find a sustainable, honest skincare brand she can purchase repeatedly for years',
          ],
          needs: [
            'Evidence that active ingredients remain biochemically stable after unsealing',
            'A fragrance-free formula that does not disrupt her sensitive microbiome',
          ],
          frustrations: [
            'Opening an expensive bottle only to find it has already oxidized into a dark brown liquid',
            'Greenwashing brands that charge $90 for products filled with 90% water and lavender oil',
          ],
          painPoints: [
            'Wasting money on cosmetic promises that fail to perform',
            'Developing contact dermatitis from synthetic fragrance stabilizers',
          ],
          motivations: [
            'Intellectual satisfaction of understanding how ingredients work together',
            'Supporting independent formulators who challenge legacy cosmetic markups',
          ],
          buyingObjections: [
            'Is the 20% concentration verified by third-party chromatographic testing?',
            'How is the serum protected from light and air exposure during shipping?',
          ],
          decisionFactors: [
            'Transparency of full ingredient list (no hidden "fragrance" umbrella terms)',
            'Packaging integrity (nitrogen flush, amber glass)',
            'Fair price-to-volume ratio ($58 / 30ml)',
          ],
        },
        marketingBehavior: {
          preferredPlatforms: ['Google Search', 'Substack Skincare Newsletters', 'Reddit r/SkincareAddiction', 'Instagram'],
          contentPreferences: ['Detailed text ingredient reviews', 'Side-by-side pH test demonstrations', 'Long-form founder interviews'],
          purchaseTriggers: ['Discovering a transparent independent review confirming formulation stability'],
          buyingJourneyOverview:
            'Visits site 3-4 times over 10 days, reads third-party reviews, checks the return policy, and purchases during a quiet evening.',
          communicationStyle: 'Direct, scientific, calm, and transparent; avoids exclamation points and hype.',
        },
        recommendations: {
          bestMessagingAngle:
            'Your Vitamin C shouldn’t expire before you finish the bottle. Stabilized with Ferulic Acid at a clinical 20% active potency.',
          recommendedContentFormats: ['Ingredient comparison charts', 'Airtight packaging demonstration videos', 'Dermatologist lab analysis'],
          suitableChannels: ['Google Search Exact Match', 'Klaviyo Educational Email Sequence', 'Reddit Community Threads'],
          suggestedCta: 'Inspect Full Clinical Formulation',
          relevantProductBenefits: ['20% active L-Ascorbic Acid', 'Nitrogen flush amber bottle', 'Certified organic base'],
        },
      },
      {
        id: 'per-sarah-sun-spots',
        segmentId: 'seg-sun-spot-solvers',
        personaName: 'Sarah Jenkins (The Results-Driven Transformer)',
        segmentName: 'Hyperpigmentation & Sun Spot Solvers',
        tagline: 'Looking for a verified, gentle solution to fade stubborn sun damage after years of outdoor living.',
        avatarColor: 'bg-purple-600',
        isFictional: true,
        characteristics: {
          ageRangeAssumption: '38 - 46 years old (Estimated assumption based on sun damage awareness)',
          geographicContext: 'Austin, TX (Sunbelt suburb)',
          occupationRole: 'Marketing Director and Mother of two',
          lifestyleOrBusinessContext: 'Active outdoor lifestyle (tennis, running), balancing busy executive schedule.',
          interests: ['Outdoor fitness', 'Clean eating', 'Dermatology blogs', 'Morning skincare rituals'],
        },
        psychology: {
          goals: [
            'Visibly fade sun spots on her cheekbones and forehead so she can wear tinted moisturizer instead of heavy foundation',
            'Protect skin from ongoing solar UV photoaging',
          ],
          needs: [
            'A potent antioxidant that works reliably without causing red, irritated blotches on her skin',
            'Confidence that the brand stands behind their claims with an ironclad guarantee',
          ],
          frustrations: [
            'Drugstore serums that felt nice but made zero visible difference after 8 weeks',
            'High-end dermatological serums that cost $180 and stung upon application',
          ],
          painPoints: [
            'Feeling like makeup is required just to step outside to run errands',
            'Sensitive skin that reacts negatively to harsh chemical exfoliants',
          ],
          motivations: [
            'Compliments from friends and family on her natural, makeup-free radiance',
            'Reclaiming self-assurance in professional Zoom video meetings',
          ],
          buyingObjections: [
            'What if this irritates my rosacea or causes a breakout?',
            'Is it going to take 6 months to see any real change?',
          ],
          decisionFactors: [
            'Real, unretouched before-and-after photo galleries from women in their 40s',
            '30-Day Empty Bottle Money-Back Guarantee',
            'Prebiotic oat ingredient that soothes sensitive skin',
          ],
        },
        marketingBehavior: {
          preferredPlatforms: ['Instagram Reels', 'Facebook Video Feed', 'TikTok', 'Google Shopping'],
          contentPreferences: ['Authentic before-and-after video testimonials', 'Application texture close-ups', 'Simple 3-step morning routines'],
          purchaseTriggers: ['Watching an unretouched video of a woman with similar skin tone sharing her 4-week transformation'],
          buyingJourneyOverview:
            'Sees an Instagram Reel ad, clicks through to the landing page, reads 5-10 customer reviews, and purchases via Apple Pay within 15 minutes.',
          communicationStyle: 'Empathetic, encouraging, results-oriented, and reassuring.',
        },
        recommendations: {
          bestMessagingAngle:
            'Visible radiance without the sting. See dark spots fade in 30 days or receive a 100% refund—even on an empty bottle.',
          recommendedContentFormats: ['Split-screen before/after photos', 'Customer video testimonials', 'One-click mobile checkout'],
          suitableChannels: ['Meta Paid Social Ads', 'Instagram Retargeting', 'Google Shopping'],
          suggestedCta: 'Claim Your 30-Day Glow Bottle',
          relevantProductBenefits: ['Prebiotic oat soothing base', '30-day money-back guarantee', 'Fast-absorbing texture'],
        },
      },
    ],
    customerJourney: [
      {
        stage: 'Awareness',
        stageNumber: 1,
        customerMindset:
          'Notices skin looking dull or discovers that their current Vitamin C has turned dark yellow and stopped working.',
        mainQuestion: 'Why does every Vitamin C serum I buy turn brown after a few weeks?',
        possibleObstacle:
          'Assumes all Vitamin C serums are fundamentally unstable and that buying another one is a waste of money.',
        recommendedMarketingActivity:
          'Run problem-centric video ads demonstrating how oxygen breaks down unstabilized formulas vs. GlowBiome clarity.',
        suitableContentFormat: 'Short-form educational Reels & TikTok video demonstrations (15-30 seconds)',
        recommendedChannel: 'Meta Ads & TikTok Paid Social',
        relevantKpi: 'Video 3-Second Hook Rate (>= 32%) & Outbound Click-Through Rate',
      },
      {
        stage: 'Interest',
        stageNumber: 2,
        customerMindset:
          'Actively curious about whether ferulic acid and nitrogen flush packaging genuinely prevent active oxidization.',
        mainQuestion: 'What makes GlowBiome’s 20% formula different from the $160 department store alternative?',
        possibleObstacle:
          'Information overload from competing cosmetic brands all claiming to have the "best" formula.',
        recommendedMarketingActivity:
          'Provide a transparent side-by-side INCI comparison guide and an interactive 60-second routine assessment quiz.',
        suitableContentFormat: 'Interactive formulation comparison landing page and skin quiz',
        recommendedChannel: 'Google Search Ads & Instagram Story Quiz Links',
        relevantKpi: 'Landing Page Average Time on Page (> 2m 15s) & Email Quiz Capture Rate',
      },
      {
        stage: 'Consideration',
        stageNumber: 3,
        customerMindset:
          'Convinced the science is sound, but evaluating personal skin sensitivity and payment risk.',
        mainQuestion: 'Will 20% strength cause stinging on my sensitive skin, and can I get a refund if it does?',
        possibleObstacle:
          'Fear of facial irritation or tedious customer support return processes.',
        recommendedMarketingActivity:
          'Prominently display the 30-Day Empty Bottle Money-Back Guarantee and feature sensitive skin dermatological testimonials.',
        suitableContentFormat: 'Customer video review gallery & guarantee badge trust architecture',
        recommendedChannel: 'Meta Dynamic Retargeting & Google Brand Search',
        relevantKpi: 'Add-to-Cart Rate (>= 6.5%) & Cart Abandonment Rate',
      },
      {
        stage: 'Purchase',
        stageNumber: 4,
        customerMindset:
          'Ready to commit to a 30-day trial and expecting a frictionless checkout experience.',
        mainQuestion: 'How quickly will this arrive, and can I pay with Apple Pay or Shop Pay?',
        possibleObstacle:
          'Lengthy checkout forms, unexpected shipping fees, or slow delivery estimates.',
        recommendedMarketingActivity:
          'Offer free shipping on single bottle orders, enable 1-click accelerated wallets, and present an optional discounted sunscreen bundle.',
        suitableContentFormat: 'Frictionless 1-page checkout with delivery date countdown',
        recommendedChannel: 'Shopify / eCommerce Storefront Checkout Flow',
        relevantKpi: 'Store Checkout Conversion Rate (>= 3.8%) & Average Order Value (>= $65.00)',
      },
      {
        stage: 'Retention',
        stageNumber: 5,
        customerMindset:
          'Receives the bottle, applies it daily, and watches for initial brightness and skin tolerance over the first month.',
        mainQuestion: 'Am I applying this correctly with my sunscreen, and when should I order my next bottle?',
        possibleObstacle:
          'Inconsistent usage, improper storage in direct sunlight, or forgetting to replenish before running empty.',
        recommendedMarketingActivity:
          'Automated 3-part post-purchase onboarding emails (Day 2 routine tips, Day 14 check-in, Day 45 replenishment trigger with 15% discount).',
        suitableContentFormat: 'Personalized email onboarding series & SMS delivery updates',
        recommendedChannel: 'Klaviyo Email & Postscript SMS Automation',
        relevantKpi: '60-Day Repeat Order Velocity (>= 28%) & Email Flow Open Rate (>= 48%)',
      },
      {
        stage: 'Advocacy',
        stageNumber: 6,
        customerMindset:
          'Thrilled with visible dark spot fading; receives compliments from friends on her radiant skin.',
        mainQuestion: 'How can I share this with my friends and get rewarded for my recommendation?',
        possibleObstacle:
          'Lack of an intuitive referral link or forgetting to leave a photo review.',
        recommendedMarketingActivity:
          'Send a Day 35 post-delivery review incentive awarding $10 store credit for verified photos, plus a Give $15, Get $15 referral code.',
        suitableContentFormat: 'Automated photo review request and customer referral portal',
        recommendedChannel: 'Post-purchase review automation & Account Portal',
        relevantKpi: 'Net Promoter Score (NPS >= 68) & Referral Revenue Share (>= 8%)',
      },
    ],
    messaging: [
      {
        segmentId: 'seg-clean-researchers',
        segmentName: 'Clean Cosmeceutical Researchers',
        mainMessage:
          'Clinical 20% active potency stabilized with ferulic acid—potent to the last drop without synthetic fillers.',
        alternativeAngles: {
          painPointFocused:
            'Stop buying Vitamin C serums that oxidize brown before you finish them. GlowBiome stays fresh for 12 months.',
          benefitFocused:
            'Achieve dermatological brightness and antioxidant defense at an accessible direct-to-consumer $58 price.',
          emotionalAngle:
            'Invest in your skin with a brand that respects your intelligence and displays every active percentage with pride.',
          educationalAngle:
            'Why does Vitamin C need Ferulic Acid? Because without stabilization, active ascorbic acid degrades in weeks.',
        },
        callToActionExamples: [
          'Inspect The Full Formulation',
          'Read The 20% Stability Report',
          'Shop The Ferulic Acid Serum ($58)',
        ],
        recommendedToneOfVoice: 'Authoritative, transparent, scientific, and understated.',
      },
      {
        segmentId: 'seg-sun-spot-solvers',
        segmentName: 'Hyperpigmentation & Sun Spot Solvers',
        mainMessage:
          'Visibly fade sun spots and restore natural radiance in 30 days—calmed by organic prebiotic oat.',
        alternativeAngles: {
          painPointFocused:
            'Tired of covering up dark spots with heavy foundation? Clear them at the source without facial stinging.',
          benefitFocused:
            'Wake up with glowing, even-toned skin backed by our 30-Day Empty Bottle Money-Back Guarantee.',
          emotionalAngle:
            'Rediscover the joy of makeup-free skin confidence every single morning.',
          educationalAngle:
            'How 20% L-Ascorbic Acid gently interrupts melanin synthesis to lighten existing UV damage.',
        },
        callToActionExamples: [
          'Claim Your 30-Day Glow Bottle',
          'See Verified 30-Day Results',
          'Try Risk-Free For 30 Days',
        ],
        recommendedToneOfVoice: 'Reassuring, empathetic, encouraging, and results-focused.',
      },
    ],
    channels: [
      {
        channelName: 'Meta Ads (Instagram & Facebook)',
        suitabilityReason:
          'Visual format allows immediate demonstrations of serum clarity, packaging, and real customer before-and-after results.',
        targetAudienceBehavior:
          'Browses Instagram during morning and evening downtime; highly responsive to unboxing videos and routine tips.',
        effectiveContent: 'High-contrast oxidation comparisons, UGC customer video reviews, split-screen transformations.',
        funnelStageSupported: 'Awareness',
        advantages: ['Scalable algorithmic reach', 'Rich visual creative formats', 'Strong retargeting dynamic ads'],
        limitations: ['Ad creative fatigue requires weekly new video assets', 'Rising Q4 auction CPMs'],
        recommendedKpis: ['Click-Through Rate (CTR >= 1.8%)', 'Cost Per Acquisition (CPA <= $24)', 'ROAS (>= 3.0x)'],
        isAssumption: false,
      },
      {
        channelName: 'Google Search Ads (High-Intent Keywords)',
        suitabilityReason:
          'Captures research-heavy consumers who are actively searching for "best stable vitamin c serum" or comparing brands.',
        targetAudienceBehavior:
          'Uses search when an existing serum has turned brown or when actively seeking to treat a new dark spot.',
        effectiveContent: 'Specific headline copy highlighting "20% Clinical Strength", "$58", and "30-Day Guarantee".',
        funnelStageSupported: 'Consideration',
        advantages: ['Immediate commercial buying intent', 'Predictable conversion rates on landing pages'],
        limitations: ['Competitive CPCs ($2.50 - $4.50) require disciplined negative keyword management'],
        recommendedKpis: ['Conversion Rate (CVR >= 3.8%)', 'Impression Share (> 60%)', 'Cost Per Conversion'],
        isAssumption: false,
      },
      {
        channelName: 'Email & SMS Lifecycle Marketing',
        suitabilityReason:
          'With a 60-day product lifespan, automated replenishment emails drive high-margin repeat revenue with zero ad cost.',
        targetAudienceBehavior:
          'Checks email daily for shipping notifications and skincare advice; prefers SMS for simple replenishment prompts.',
        effectiveContent: 'Application routine guides, 60-day auto-delivery reminders, exclusive early batch access.',
        funnelStageSupported: 'Retention',
        advantages: ['Shielded from ad platform auction inflation', 'Produces 25-35% of total store revenue at 65%+ net margin'],
        limitations: ['Requires strict segmentation to avoid unsubscribes and spam penalties'],
        recommendedKpis: ['Repeat Order Rate (>= 28% in 60 days)', 'Email Open Rate (>= 45%)', 'Revenue Per Recipient'],
        isAssumption: false,
      },
    ],
    unverifiedAssumptions: [
      'Assumes target customer age demographic clusters primarily between 25 and 45 based on cosmetic purchasing trends.',
      'Assumes customers have high familiarity with the term "Vitamin C serum" and understand basic daily application.',
      'Assumes that oxidation and stability are primary category purchase objections rather than raw price alone.',
    ],
    limitationsAndMissingData: [
      'Empirical qualitative customer surveys should be conducted after initial 100 orders to validate whether prebiotic oat was a decisive factor.',
      'Live customer retention cohorts require 60-90 days of live operational data to establish verified repeat purchase rates.',
    ],
  },
  {
    id: 'aud-apex-cloud-001',
    projectId: 'proj-apex-cloud',
    projectName: 'ApexSec Cloud Intelligence',
    version: 1,
    createdAt: '2026-11-12T16:30:00.000Z',
    modelIdentifier: 'Reference Blueprint (Verified Research Architecture)',
    status: 'Completed',
    executiveSummary:
      'ApexSec Cloud Intelligence targets enterprise technology buying committees navigating cloud compliance mandates and developer friction. Our segmentation reveals 3 distinct technical personas: Cloud Platform & DevOps Leads (who demand automated Terraform PRs), Compliance & Risk Officers (facing imminent audit deadlines), and Mid-Market CISOs (struggling with limited security headcount). Positioning should emphasize autonomous code remediation over legacy ticket generation.',
    inputSnapshot: {
      targetCountry: 'United States, United Kingdom, Germany',
      cityOrRegion: 'Major Technology Hubs',
      geographicMarketType: 'International',
      preferredLanguage: 'English',
      industry: 'Technology / Cloud Security',
      customerType: 'B2B',
      ageRange: '30-55 (Assumption based on technical leadership seniority)',
      customerNeeds:
        'Pass SOC 2 and ISO 27001 audits, eliminate 10,000+ daily alert tickets, prevent production cloud misconfigurations.',
      customerPainPoints:
        'Developers ignoring security Jira tickets, legacy scanners taking days to deploy, alert fatigue overwhelming scarce security staff.',
      interests: 'Cloud security, Terraform, AWS architecture, Kubernetes, compliance frameworks, zero trust.',
      purchasingMotivations:
        'Board-level audit compliance, avoiding public security breach headlines, reclaiming engineering hours.',
      commonObjections:
        'Does your scanner require write access to production VPCs? How does it integrate with GitHub Enterprise?',
      preferredChannels: ['LinkedIn', 'Google Search', 'Technical Newsletters', 'GitHub'],
      purchasingBehavior: 'Committee-driven enterprise buying cycle (Security, DevOps, Legal, Procurement).',
      productName: 'ApexSec Cloud Intelligence Suite',
      productPrice: 2400,
      currency: 'USD',
      mainBenefits:
        'Autonomous agentless scanner connects in 15 minutes and auto-generates verified Terraform PRs to fix security issues.',
      existingCustomerInfo: 'Mid-market technology enterprises with 50 to 2,000 employees running AWS/Azure.',
      marketingGoals: 'Generate leads, Lower customer acquisition cost, Build brand awareness',
    },
    segments: [
      {
        id: 'seg-platform-devops',
        name: 'Platform Engineering & DevOps Directors',
        description:
          'Engineering leaders who own cloud infrastructure and are frustrated by security tools that create endless manual tickets without code solutions.',
        mainCustomerNeed:
          'Security tooling that speaks code (Terraform / OpenTofu) and seamlessly opens pull requests rather than Jira tickets.',
        painPoints: [
          'Security teams dumping 200-page vulnerability PDF reports into engineering sprints',
          'Developers wasting 15+ hours weekly manually diagnosing cloud misconfigurations',
          'Friction and finger-pointing between SecOps and product engineering',
        ],
        purchaseMotivation:
          'Automating compliance remediation so senior engineers can focus on shipping revenue-generating features.',
        buyingBehavior:
          'Technical and hands-on. Demands a live interactive sandbox tour and tests Terraform syntax before approving POC.',
        potentialObjections: [
          'Will your auto-generated pull requests break our existing production CI/CD pipelines?',
          'Can we configure custom linting rules to match our internal coding standards?',
        ],
        productRelevance:
          'ApexSec’s automated Terraform pull request generation solves their exact developer friction problem.',
        recommendedMessaging:
          'Stop generating alerts your developers ignore. Auto-remediate cloud misconfigurations with verified Terraform PRs.',
        suitableChannels: ['LinkedIn Engineering Feeds', 'Developer Podcasts', 'GitHub Technical Content', 'CloudSecList'],
        contentPreferences: ['Terraform code walkthroughs', 'Architecture diagrams', 'Interactive browser sandbox tours'],
        suggestedCta: 'Test The Interactive Code Sandbox',
        strategicPriority: 'High',
        isHypothesis: true,
      },
      {
        id: 'seg-compliance-officers',
        name: 'Urgent Audit Compliance Officers',
        description:
          'Leaders facing tight board or enterprise customer deadlines to achieve SOC 2 Type II, ISO 27001, or HIPAA compliance.',
        mainCustomerNeed:
          'Immediate, continuous compliance scoring across multi-cloud estates with automated evidence collection.',
        painPoints: [
          'Impending enterprise sales deals stalled because the prospect demands a clean SOC 2 report in 30 days',
          'Manual screenshot gathering and spreadsheets consuming weeks of administrative effort',
        ],
        purchaseMotivation:
          'Passing annual compliance audits with zero findings and unlocking enterprise deal velocity.',
        buyingBehavior:
          'Urgent and budget-approved. Seeks rapid deployment, SOC 2 mapping checklists, and pre-approved vendor terms.',
        potentialObjections: [
          'Can this scan our accounts in under 1 hour?',
          'Are these controls mapped directly to the 2026 AICPA Trust Services Criteria?',
        ],
        productRelevance:
          'Agentless 15-minute setup generates an instant CISO compliance scorecard mapped to top frameworks.',
        recommendedMessaging:
          'Pass your cloud security audit without the 80-hour engineering sprint. 15-minute setup.',
        suitableChannels: ['Google Search Ads (Compliance keywords)', 'LinkedIn CISO Targeting', 'Audit Firm Co-Marketing'],
        contentPreferences: ['Audit readiness checklists', 'Executive compliance scorecards', 'Case study teardowns'],
        suggestedCta: 'Generate Your Free Cloud Audit Scorecard',
        strategicPriority: 'High',
        isHypothesis: true,
      },
    ],
    personas: [
      {
        id: 'per-marcus-devops',
        segmentId: 'seg-platform-devops',
        personaName: 'Marcus Vance (The Frustrated Platform Architect)',
        segmentName: 'Platform Engineering & DevOps Directors',
        tagline: 'Refuses to look at more security alert dashboards; wants working code and automated pull requests.',
        avatarColor: 'bg-emerald-600',
        isFictional: true,
        characteristics: {
          ageRangeAssumption: '34 - 44 years old (Estimated assumption based on platform engineering career track)',
          geographicContext: 'Seattle, WA (Cloud infrastructure hub)',
          occupationRole: 'VP of Platform Engineering at a Series C SaaS startup',
          lifestyleOrBusinessContext: 'Manages a team of 18 DevOps engineers responsible for 400+ AWS microservices.',
          interests: ['Terraform', 'Kubernetes', 'Site Reliability Engineering', 'Open source dev tools'],
        },
        psychology: {
          goals: [
            'Maintain 99.99% cloud uptime while passing security controls automatically',
            'Eliminate developer interruptions and reduce vulnerability mean-time-to-remediate (MTTR) below 2 hours',
          ],
          needs: [
            'Security scanners that fit into existing Git workflows without requiring custom UI training',
            'Zero agent overhead on production Kubernetes clusters',
          ],
          frustrations: [
            'Security analysts sending Slack messages asking developers to fix S3 bucket permissions manually',
            'Security tools that demand broad administrative write privileges to scan infrastructure',
          ],
          painPoints: [
            'Developer morale drain from constant context switching to fix compliance tickets',
            'Invasive agents causing CPU spikes or kernel crashes on production EC2 nodes',
          ],
          motivations: [
            'Building a clean, self-healing cloud platform that scales effortlessly',
            'Being recognized as an engineering leader who bridges security and developer velocity',
          ],
          buyingObjections: [
            'Does your scanner require an agent running in our private subnets?',
            'Can we preview the Terraform changes in a sandbox before anything merges?',
          ],
          decisionFactors: [
            'Read-only IAM role architecture',
            'Quality and syntactic cleanliness of generated Terraform code',
            'Seamless GitHub Enterprise pull request integration',
          ],
        },
        marketingBehavior: {
          preferredPlatforms: ['LinkedIn', 'Hacker News', 'CloudSecList Newsletter', 'GitHub'],
          contentPreferences: ['Interactive code sandboxes', 'Technical Terraform tutorials', 'Architecture blueprints'],
          purchaseTriggers: ['Testing an interactive sandbox that generates an immaculate Terraform pull request in 5 seconds'],
          buyingJourneyOverview:
            'Plays with interactive sandbox on desktop, shares link with his Lead Security Architect on Slack, schedules a 20-minute technical POC call within 48 hours.',
          communicationStyle: 'Engineering-led, concise, precise, and devoid of marketing buzzwords.',
        },
        recommendations: {
          bestMessagingAngle:
            'Your developers don’t need more tickets. They need code. ApexSec auto-generates production-ready Terraform PRs in seconds.',
          recommendedContentFormats: ['Interactive 3-minute browser sandbox', 'Technical Terraform remediation teardowns', 'Architecture overview'],
          suitableChannels: ['LinkedIn Technical ABM', 'Developer Newsletters', 'Google Search Intent'],
          suggestedCta: 'Test The Interactive Remediation Sandbox',
          relevantProductBenefits: ['Agentless 15-minute setup', 'Verified Terraform pull requests', 'Zero Kubernetes overhead'],
        },
      },
    ],
    customerJourney: [
      {
        stage: 'Awareness',
        stageNumber: 1,
        customerMindset:
          'Drowning in thousands of daily security alerts across AWS and GCP; developers are openly ignoring Jira tickets.',
        mainQuestion: 'Why does every cloud security tool only tell us what is broken without fixing it?',
        possibleObstacle:
          'Belief that all security scanners are identical alert generators that just create more work.',
        recommendedMarketingActivity:
          'Deploy LinkedIn sponsored GIFs contrasting a 400-item Jira backlog vs. an automated ApexSec Terraform PR.',
        suitableContentFormat: 'High-impact technical animation & architecture diagrams',
        recommendedChannel: 'LinkedIn Sponsored Content (ABM Filtered to DevOps & CISOs)',
        relevantKpi: 'Target Account Engagement Rate (>= 42%) & Document Click-Through Rate',
      },
      {
        stage: 'Interest',
        stageNumber: 2,
        customerMindset:
          'Intrigued by autonomous pull request remediation, but skeptical about code quality and permissions.',
        mainQuestion: 'How does ApexSec generate the code fix without write access to our production environment?',
        possibleObstacle:
          'Security team reluctance to book a sales demo with an aggressive SDR.',
        recommendedMarketingActivity:
          'Provide a frictionless, self-guided 3-minute interactive browser sandbox that lets engineers test remediation live.',
        suitableContentFormat: 'Interactive product tour sandbox (Navattic / Arcade)',
        recommendedChannel: 'Interactive Sandbox Landing Page & Technical Whitepapers',
        relevantKpi: 'Interactive Sandbox Walkthrough Completion Rate (>= 40%)',
      },
      {
        stage: 'Consideration',
        stageNumber: 3,
        customerMindset:
          'Ready to test the scanner on a non-production cloud account to verify findings and evaluate accuracy.',
        mainQuestion: 'Can we run a read-only trial on our staging AWS environment with zero risk?',
        possibleObstacle:
          'Security questionnaire delays and legal reviews regarding data handling.',
        recommendedMarketingActivity:
          'Offer a 14-day read-only sandbox scan generating an instant executive posture scorecard, backed by a pre-completed SOC 2 trust package.',
        suitableContentFormat: 'Instant read-only cloud setup guide & Trust Center package',
        recommendedChannel: 'Direct Solutions Architect POC & Dedicated Slack Connect Channel',
        relevantKpi: 'POC Start-to-Completion Rate (>= 75%) & Mean Days to POC Completion (< 12 days)',
      },
      {
        stage: 'Purchase',
        stageNumber: 4,
        customerMindset:
          'POC successfully demonstrated 18 hours of weekly developer savings; moving through procurement.',
        mainQuestion: 'Can we purchase via AWS Marketplace to consume existing pre-committed cloud spend?',
        possibleObstacle:
          'Prolonged enterprise legal negotiation over standard vendor terms.',
        recommendedMarketingActivity:
          'Enable 1-click AWS Marketplace procurement and offer standardized enterprise terms with a 20% discount on multi-year commitments.',
        suitableContentFormat: 'AWS Marketplace listing & simplified enterprise order form',
        recommendedChannel: 'AWS Marketplace & Executive Sponsor Call',
        relevantKpi: 'Sales Cycle Velocity (< 45 days) & Average Contract Value (ACV >= $28,800)',
      },
      {
        stage: 'Retention',
        stageNumber: 5,
        customerMindset:
          'Onboards all development squads; monitors automated pull request merge rates across production repositories.',
        mainQuestion: 'How can we expand coverage to our newly acquired GCP workloads and Kubernetes clusters?',
        possibleObstacle:
          'New development squads failing to adopt the GitHub pull request integration.',
        recommendedMarketingActivity:
          'Deliver automated weekly executive summary emails showing total engineering hours saved and posture score improvements.',
        suitableContentFormat: 'Weekly CISO executive email digest & quarterly engineering business review',
        recommendedChannel: 'In-app notifications & Customer Success Slack Channel',
        relevantKpi: 'Net Revenue Retention (>= 128%) & Monthly Active Developer Pull Request Merges',
      },
      {
        stage: 'Advocacy',
        stageNumber: 6,
        customerMindset:
          'Considers ApexSec an indispensable competitive differentiator that solved developer security friction.',
        mainQuestion: 'Can our CISO present our MTTR reduction metrics at an industry conference panel?',
        possibleObstacle:
          'Corporate PR restrictions against publicly naming security software vendors.',
        recommendedMarketingActivity:
          'Publish anonymized or co-branded technical case studies, and invite the CISO to join the private ApexSec Customer Advisory Board.',
        suitableContentFormat: 'Peer case study whitepapers & private CISO roundtable dinners',
        recommendedChannel: 'Industry Conference Keynotes & Private Executive Dinners',
        relevantKpi: 'Customer Reference Willingness (>= 45%) & Customer NPS (>= 74)',
      },
    ],
    messaging: [
      {
        segmentId: 'seg-platform-devops',
        segmentName: 'Platform Engineering & DevOps Directors',
        mainMessage:
          'Stop generating alerts your developers ignore. Auto-remediate cloud misconfigurations with verified Terraform PRs.',
        alternativeAngles: {
          painPointFocused:
            'Your developers are wasting 15 hours a week copying security tickets into Jira. ApexSec opens the PR with the fix.',
          benefitFocused:
            'Reduce cloud vulnerability mean-time-to-remediate from 14 days to 15 minutes with zero agents.',
          emotionalAngle:
            'End the eternal friction between security and engineering. Give your developers solutions, not complaints.',
          educationalAngle:
            'Why agentless scanning plus automated infrastructure-as-code remediation represents the future of DevSecOps.',
        },
        callToActionExamples: [
          'Test The Interactive Code Sandbox',
          'Book 20-Minute Technical Demo',
          'Calculate Your MTTR Savings',
        ],
        recommendedToneOfVoice: 'Precise, engineering-led, authoritative, and direct.',
      },
    ],
    channels: [
      {
        channelName: 'LinkedIn Account-Based Marketing (ABM)',
        suitabilityReason:
          'Enables laser targeting of VP of Engineering, Directors of DevOps, and CISOs at companies with 50-2,000 employees.',
        targetAudienceBehavior:
          'Visits LinkedIn for industry news, peer discussions, and tech architecture insights.',
        effectiveContent: 'Animated GIFs of automated Terraform PR generation and CISO benchmark reports.',
        funnelStageSupported: 'Awareness',
        advantages: ['Zero wasted consumer impressions', 'Native document and carousel ads', 'Precise job title filters'],
        limitations: ['High CPMs ($50 - $90) require strong technical hooks to maintain cost efficiency'],
        recommendedKpis: ['Cost Per Qualified Lead (CPQL <= $220)', 'Account Engagement Rate', 'Demo Request Rate'],
        isAssumption: false,
      },
      {
        channelName: 'Google Search Ads (Technical Compliance Keywords)',
        suitabilityReason:
          'Captures engineers under urgent audit pressure searching for "AWS SOC 2 automation" or "Terraform security scanner".',
        targetAudienceBehavior:
          'Turns to Google when faced with an urgent compliance audit finding or cloud security mandate.',
        effectiveContent: 'Ad copy emphasizing "15-Minute Agentless Setup", "Verified Terraform PRs", and "SOC 2 Ready".',
        funnelStageSupported: 'Consideration',
        advantages: ['High commercial purchase intent', 'Fast conversion to technical demo requests'],
        limitations: ['Aggressive bidding from legacy vendors drives up competitive CPCs'],
        recommendedKpis: ['Demo Request Cost Per Acquisition (CPA <= $350)', 'Pipeline Value Generated'],
        isAssumption: false,
      },
    ],
    unverifiedAssumptions: [
      'Assumes that target enterprises primarily use Terraform or OpenTofu for infrastructure-as-code management.',
      'Assumes enterprise buying committees have allocated annual cloud security budgets exceeding $25,000.',
      'Assumes target accounts operate multi-cloud or AWS-heavy environments with at least 50 engineers.',
    ],
    limitationsAndMissingData: [
      'Customer acquisition cost per enterprise logo must be validated through live LinkedIn ABM campaign flights.',
      'Regional compliance variance (e.g. EU NIS2 vs. US FedRAMP) requires targeted legal research per territory.',
    ],
  },
];

class AudienceService {
  private getStoredAnalyses(): AudienceAnalysis[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_AUDIENCE_ANALYSES));
        return DEMO_AUDIENCE_ANALYSES;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_AUDIENCE_ANALYSES));
      return DEMO_AUDIENCE_ANALYSES;
    } catch {
      return DEMO_AUDIENCE_ANALYSES;
    }
  }

  public getAnalyses(projectId?: string): AudienceAnalysis[] {
    const list = this.getStoredAnalyses();
    if (!projectId) return list;
    return list.filter((a) => a.projectId === projectId);
  }

  public getAnalysisById(id: string): AudienceAnalysis | undefined {
    return this.getStoredAnalyses().find((a) => a.id === id);
  }

  public getLatestAnalysis(projectId: string): AudienceAnalysis | undefined {
    const list = this.getAnalyses(projectId);
    if (list.length === 0) return undefined;
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }

  public saveAnalysis(analysis: AudienceAnalysis): void {
    const current = this.getStoredAnalyses();
    const existingIndex = current.findIndex((a) => a.id === analysis.id);
    let next: AudienceAnalysis[];

    if (existingIndex >= 0) {
      next = [...current];
      next[existingIndex] = analysis;
    } else {
      next = [analysis, ...current];
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Could not persist audience analysis to localStorage:', err);
    }
  }

  public deleteAnalysis(id: string): void {
    const current = this.getStoredAnalyses();
    const next = current.filter((a) => a.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Could not update localStorage after delete:', err);
    }
  }

  // Saved personas collection management
  public getSavedPersonas(): CustomerPersona[] {
    try {
      const raw = localStorage.getItem(SAVED_PERSONAS_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public savePersona(persona: CustomerPersona): void {
    const current = this.getSavedPersonas();
    const existingIndex = current.findIndex((p) => p.id === persona.id);
    let next: CustomerPersona[];

    if (existingIndex >= 0) {
      next = [...current];
      next[existingIndex] = persona;
    } else {
      next = [persona, ...current];
    }

    try {
      localStorage.setItem(SAVED_PERSONAS_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Could not save persona to localStorage:', err);
    }
  }

  public deleteSavedPersona(id: string): void {
    const current = this.getSavedPersonas();
    const next = current.filter((p) => p.id !== id);
    try {
      localStorage.setItem(SAVED_PERSONAS_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Could not delete saved persona:', err);
    }
  }

  /**
   * Dispatches server-side AI request to generate a structured Audience Analysis with robust timeout and error handling.
   */
  public async generateAudienceAnalysis(
    project: MarketingProject,
    customInputs?: Partial<AudienceAnalysisInput>
  ): Promise<AudienceAnalysis> {
    const data = await ApiClient.post<{ ok: boolean; analysis: AudienceAnalysis }>(
      '/api/generate-audience',
      { project, customInputs }
    );

    const generated = data.analysis as AudienceAnalysis;
    const existing = this.getAnalyses(project.id);
    generated.version = existing.length + 1;

    this.saveAnalysis(generated);
    return generated;
  }
}

export const audienceService = new AudienceService();

