import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { Accordion } from '@/components/common/Accordion';
import { siteConfig } from '@/config/site';
import {
  Brain,
  Search,
  Target,
  Calculator,
  BarChart3,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  BookOpen,
  LineChart,
  Megaphone,
  Check,
  Lock,
  Database,
  KeyRound,
  FileText,
  AlertCircle,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const HomePage: React.FC = () => {
  const [selectedToolsCategory, setSelectedToolsCategory] = useState<'strategy' | 'analytics' | 'planning'>('strategy');

  const jsonLdData = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Sparkline Marketing',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web-based',
      url: 'https://sparklinemarketing.com',
      description:
        'Transform your product information into intelligent marketing strategies, data-driven decisions and measurable growth opportunities. Think Strategy. Predict Growth. Market Smarter.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/icons/sparkline-icon.svg`,
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteConfig.business.city,
        addressCountry: siteConfig.business.country,
      },
      sameAs: [
        siteConfig.links.github,
        siteConfig.links.linkedin,
        siteConfig.links.facebook,
        siteConfig.links.twitter,
      ],
    },
  ];

  // 10 Core Features
  const coreFeatures = [
    {
      title: 'AI Marketing Strategist',
      description:
        'Synthesizes product UVPs, pricing margins, and buyer psychographics into a structured 90-day multi-channel roadmap.',
      icon: <Brain className="w-5 h-5 text-sparkline-blue" />,
      accent: 'blue',
      route: '/dashboard/strategist',
    },
    {
      title: 'Market Research Suite',
      description:
        'Quantifies total addressable market (TAM, SAM, SOM) and synthesizes emerging vertical trends without manual research lag.',
      icon: <Search className="w-5 h-5 text-sparkline-cyan" />,
      accent: 'cyan',
      route: '/dashboard/market-research',
    },
    {
      title: 'Target Audience Intelligence',
      description:
        'Constructs data-backed buyer personas, friction maps, and high-probability conversion triggers across channels.',
      icon: <Compass className="w-5 h-5 text-sparkline-purple" />,
      accent: 'purple',
      route: '/dashboard/market-research',
    },
    {
      title: 'Competitor Intelligence',
      description:
        'Decodes competitor positioning matrices, creative ad hooks, and keyword battlegrounds to identify market whitespace.',
      icon: <Target className="w-5 h-5 text-sparkline-magenta" />,
      accent: 'magenta',
      route: '/dashboard/competitors',
    },
    {
      title: 'Marketing Budget Planner',
      description:
        'Dynamically allocates spend across paid channels with currency conversion and cash flow burn-rate pacing.',
      icon: <Calculator className="w-5 h-5 text-sparkline-orange" />,
      accent: 'orange',
      route: '/dashboard/budget',
    },
    {
      title: 'Results & ROI Predictor',
      description:
        'Forecasts conversion volumes and blended ROAS curves prior to ad spend commitment using algorithmic models.',
      icon: <TrendingUp className="w-5 h-5 text-sparkline-blue" />,
      accent: 'blue',
      route: '/dashboard/metrics',
    },
    {
      title: 'Marketing Metrics Center',
      description:
        'Interactive modeling for CAC, LTV, Payback Periods, and blended Marketing Efficiency Ratios (MER).',
      icon: <BarChart3 className="w-5 h-5 text-sparkline-cyan" />,
      accent: 'cyan',
      route: '/dashboard/metrics',
    },
    {
      title: 'Campaign Studio',
      description:
        'Plans multi-platform ad flight schedules, impression benchmarks, and messaging frameworks across Google, Meta, and LinkedIn.',
      icon: <Megaphone className="w-5 h-5 text-sparkline-purple" />,
      accent: 'purple',
      route: '/dashboard/campaigns',
    },
    {
      title: 'Content Studio',
      description:
        'Builds topic clusters, publishing cadences, and high-converting copy angles designed to capture buyer search intent.',
      icon: <Sparkles className="w-5 h-5 text-sparkline-magenta" />,
      accent: 'magenta',
      route: '/dashboard/content-studio',
    },
    {
      title: 'SEO Intelligence',
      description:
        'Maps buyer search intent clusters, keyword competition gaps, and content pillar hierarchies for organic authority.',
      icon: <LineChart className="w-5 h-5 text-sparkline-orange" />,
      accent: 'orange',
      route: '/dashboard/content-studio',
    },
  ];

  // 8 Core Metrics
  const coreMetrics = [
    {
      code: 'CTR',
      name: 'Click-Through Rate',
      formula: '(Total Clicks / Total Impressions) × 100',
      definition: 'The percentage of people who see your ad or search result and click through.',
      whyItMatters: 'Measures creative hook strength and audience relevance before any money is spent on landing pages.',
    },
    {
      code: 'CPC',
      name: 'Cost Per Click',
      formula: 'Total Ad Spend / Total Clicks',
      definition: 'The average amount billed by an ad platform for a single visitor visit.',
      whyItMatters: 'Directly impacts unit acquisition economics and reveals competitive bid pressure.',
    },
    {
      code: 'CPM',
      name: 'Cost Per Mille (1,000 Impressions)',
      formula: '(Total Ad Spend / Total Impressions) × 1,000',
      definition: 'The cost to display an advertisement one thousand times to an audience.',
      whyItMatters: 'Indicates platform audience liquidity and ad inventory competition.',
    },
    {
      code: 'CPA',
      name: 'Cost Per Acquisition',
      formula: 'Total Ad Spend / Total Attributed Conversions',
      definition: 'The advertising cost required to generate one specific customer action or lead.',
      whyItMatters: 'Determines whether paid media is generating profitable transactional volume.',
    },
    {
      code: 'ROAS',
      name: 'Return On Ad Spend',
      formula: 'Gross Revenue Generated from Ads / Total Ad Spend',
      definition: 'The gross revenue generated for every single dollar allocated to paid ads.',
      whyItMatters: 'The universal benchmark for direct-response media efficiency (e.g. 4.0x = $4 back per $1 spend).',
    },
    {
      code: 'ROI',
      name: 'Marketing Return On Investment',
      formula: '((Gross Profit - Total Marketing Costs) / Total Marketing Costs) × 100',
      definition: 'The net profitability of your entire marketing investment including creative and software.',
      whyItMatters: 'Prevents vanity ROAS metrics from masking negative operational bottom lines.',
    },
    {
      code: 'CAC',
      name: 'Customer Acquisition Cost',
      formula: '(Marketing Costs + Sales Costs) / New Customers Acquired',
      definition: 'The total commercial spend necessary to convert one paying customer.',
      whyItMatters: 'Must be measured against Customer Lifetime Value (LTV) to maintain a healthy 3:1+ ratio.',
    },
    {
      code: 'CVR',
      name: 'Conversion Rate',
      formula: '(Total Conversions / Total Unique Visitors) × 100',
      definition: 'The percentage of page visitors who complete your primary commercial goal.',
      whyItMatters: 'Doubling conversion rate cuts your effective customer acquisition cost in half.',
    },
  ];

  // Categorized Tools
  const categorizedTools = {
    strategy: [
      { name: 'AI Marketing Strategy Generator', desc: 'Synthesizes product data into an execution plan.', badge: 'Core' },
      { name: 'Target Audience Analyzer', desc: 'Maps buyer personas, friction, and intent triggers.', badge: 'Audience' },
      { name: 'Competitor Strategy Analyzer', desc: 'Uncovers rival ad angles and market whitespace.', badge: 'Competitive' },
      { name: 'Strategic SWOT Analyzer', desc: 'Identifies internal strengths and asymmetric advantages.', badge: 'Strategy' },
      { name: 'Market Opportunity Scanner', desc: 'Detects under-served search and social niches.', badge: 'Research' },
    ],
    analytics: [
      { name: 'Marketing Metrics Hub', desc: 'Calculates CAC, LTV, and Payback Periods.', badge: 'Economics' },
      { name: 'Marketing ROI Calculator', desc: 'Simulates net profit returns across campaign budgets.', badge: 'Finance' },
      { name: 'Target ROAS Calculator', desc: 'Defines minimum break-even ROAS based on gross margins.', badge: 'Media' },
      { name: 'Blended CAC Calculator', desc: 'Blends paid media spend with organic traffic cohorts.', badge: 'Analytics' },
      { name: 'Funnel Conversion Rate Calculator', desc: 'Pinpoints conversion leakage at each customer touchpoint.', badge: 'Optimization' },
    ],
    planning: [
      { name: 'Dynamic Budget Allocator', desc: 'Distributes budget with multi-currency risk pacing.', badge: 'Budget' },
      { name: 'Campaign Studio & Flight Planner', desc: 'Builds flight schedules, impression projections, and milestones.', badge: 'Media' },
      { name: 'Editorial Content Calendar', desc: 'Organizes multi-channel content around intent themes.', badge: 'Content' },
      { name: 'SEO Keyword Pillar Planner', desc: 'Structures topical cluster hierarchies for domain authority.', badge: 'Organic' },
      { name: 'Executive Marketing Report Generator', desc: 'Compiles strategy presentations and forecast curves.', badge: 'Reports' },
    ],
  };

  // 10 FAQ Questions & Transparent Answers
  const faqItems = [
    {
      id: 'faq-1',
      question: 'What is Sparkline Marketing?',
      answer:
        'Sparkline Marketing is an AI-powered marketing intelligence and strategy platform. Rather than generating generic AI copy, Sparkline analyzes product economics, target audience friction, and competitive dynamics to deliver structured go-to-market plans, budget allocations, and performance forecasts.',
    },
    {
      id: 'faq-2',
      question: 'Who can use the platform?',
      answer:
        'Sparkline is built for digital marketing practitioners, performance media buyers, marketing agencies, SaaS founders, e-commerce brand owners, and freelancers who need structured, data-informed strategy without hiring an expensive consulting firm.',
    },
    {
      id: 'faq-3',
      question: 'How does the AI Marketing Strategist work?',
      answer:
        'You enter your product details, price point, gross margin structure, and growth objective. Our intelligence pipeline evaluates your product economics against market data, suggests optimal acquisition channels, models budget distribution, and generates a phased 90-day execution roadmap.',
    },
    {
      id: 'faq-4',
      question: 'Can beginners use Sparkline?',
      answer:
        'Yes. Every metric, calculation, and strategy card includes clear explanations, mathematical formulas, and practical takeaways. Additionally, Sparkline Marketing Academy provides step-by-step masterclasses on marketing fundamentals and performance media buying.',
    },
    {
      id: 'faq-5',
      question: 'How accurate are marketing predictions?',
      answer:
        'All forecasts and predictions generated by Sparkline represent algorithmic projections based on mathematical models, historical benchmarks, and user-provided assumptions. They do not constitute financial guarantees or promises of ad platform results. Campaign outcomes depend on live market execution, creative quality, and external auction conditions.',
    },
    {
      id: 'faq-6',
      question: 'Can I calculate budgets in different currencies?',
      answer:
        'Yes. The Dynamic Budget Planner includes support for major global currencies including USD, EUR, GBP, CAD, AUD, and JPY, allowing international teams and agencies to model spend without currency conversion confusion.',
    },
    {
      id: 'faq-7',
      question: 'Does Sparkline provide competitor research?',
      answer:
        'Yes. The Competitor Intelligence module helps you map rival value propositions, identify messaging blindspots, evaluate share-of-voice, and uncover asymmetric positioning angles in your category.',
    },
    {
      id: 'faq-8',
      question: 'Can I export marketing reports?',
      answer:
        'Yes. Sparkline includes an executive report generation architecture that compiles your strategy, budget allocations, and forecast curves into clean stakeholder presentations and shareable dashboards.',
    },
    {
      id: 'faq-9',
      question: 'Is my business information protected?',
      answer:
        'Yes. We enforce a strict security-first architecture: zero client-side credentials, strict tenant isolation at the database level, and an absolute zero-training policy—meaning your proprietary product data, unit margins, and strategies are never used to train foundational AI models.',
    },
    {
      id: 'faq-10',
      question: 'Is there a free plan?',
      answer:
        'Yes. Sparkline provides a free tier that gives users access to core marketing tools, basic strategy generation, and essential marketing calculators to test the intelligence engine without a credit card.',
    },
  ];

  return (
    <>
      <SEO
        title="Sparkline Marketing | AI-Powered Marketing Intelligence & Strategy Platform"
        description="Turn marketing decisions into measurable growth. Discover product-specific strategies, competitor intelligence, dynamic budget planning, and predictive performance curves."
        canonical="https://sparklinemarketing.com"
        jsonLd={jsonLdData}
      />

      {/* SECTION 4 — HERO SECTION (Dark Navy & Gradient Composition) */}
      <section className="relative overflow-hidden bg-sparkline-midnight text-white pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-sparkline-slate">
        {/* Background Ambient Glow & Grid Mesh */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-sparkline-blue/20 via-sparkline-purple/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#152238_1px,transparent_1px),linear-gradient(to_bottom,#152238_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Category Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-sparkline-cyan text-xs font-semibold border border-white/10 shadow-subtle">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Powered Marketing Intelligence Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
                Turn Marketing Decisions Into{' '}
                <span className="text-gradient-brand">Measurable Growth.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover smarter strategies, understand your market, optimize your budget and make
                confident marketing decisions with AI-powered intelligence.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button
                  to="/dashboard/strategist"
                  variant="gradient"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto shadow-md"
                >
                  Build My Marketing Strategy
                </Button>
                <Button
                  to="/tools"
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                >
                  Explore Marketing Tools
                </Button>
              </div>

              {/* Supporting Points */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                {[
                  'Product-specific strategies',
                  'Data-informed insights',
                  'Smarter budget planning',
                  'Performance forecasting',
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-sparkline-cyan shrink-0" />
                    <span className="leading-tight">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Original Marketing Intelligence Visual Composition */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-3 bg-gradient-to-b from-white/15 to-white/5 border border-white/10 shadow-premium backdrop-blur-md">
                <div className="rounded-2xl bg-sparkline-slate p-5 space-y-4 border border-white/5 text-white">
                  {/* Console Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-sparkline-cyan font-semibold">
                        INTELLIGENCE_ENGINE_V1
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sparkline-blue/20 text-sparkline-cyan border border-sparkline-blue/30">
                      Live Simulation
                    </span>
                  </div>

                  {/* Growth Sparkline Curve Illustration */}
                  <div className="bg-sparkline-midnight/80 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] text-slate-400 font-semibold uppercase">
                        Predicted Revenue vs Ad Spend
                      </span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        4.85x ROAS
                      </span>
                    </div>

                    <div className="h-28 w-full">
                      <svg viewBox="0 0 400 110" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="heroCurveGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0C65F4" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#0C65F4" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 95 Q 90 85 160 65 T 280 35 T 400 15 L 400 110 L 0 110 Z"
                          fill="url(#heroCurveGrad)"
                        />
                        <path
                          d="M 0 95 Q 90 85 160 65 T 280 35 T 400 15"
                          fill="none"
                          stroke="#0C65F4"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 0 100 Q 90 95 160 85 T 280 70 T 400 60"
                          fill="none"
                          stroke="#E37C33"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                        <circle cx="160" cy="65" r="3.5" fill="#593090" />
                        <circle cx="280" cy="35" r="3.5" fill="#C52B85" />
                        <circle cx="400" cy="15" r="5" fill="#E37C33" stroke="#FFF" strokeWidth="1.5" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                      <span>M1: Testing</span>
                      <span>M2: Validation</span>
                      <span className="text-emerald-400 font-semibold">M3: Scale (+285%)</span>
                    </div>
                  </div>

                  {/* AI Strategy Mini Card */}
                  <div className="p-3.5 rounded-xl bg-sparkline-midnight/60 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-white">
                        <Sparkles className="w-3.5 h-3.5 text-sparkline-purple" />
                        <span>AI Strategy Blueprint</span>
                      </span>
                      <span className="text-[10px] font-mono text-sparkline-purple bg-purple-500/20 px-2 py-0.5 rounded">
                        94% Confidence
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Focus 45% of initial ad allocation on high buyer-intent search clusters to establish cash flow before expanding into programmatic channels.
                    </p>
                  </div>

                  {/* Micro Metrics Strip */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-sparkline-midnight/50 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Forecast CAC</span>
                      <span className="font-bold text-sparkline-cyan">$38.40</span>
                    </div>
                    <div className="p-2 rounded-lg bg-sparkline-midnight/50 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Target Payback</span>
                      <span className="font-bold text-white">42 Days</span>
                    </div>
                    <div className="p-2 rounded-lg bg-sparkline-midnight/50 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Primary Net</span>
                      <span className="font-bold text-emerald-400">Google Ads</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — TRUST AND VALUE STRIP */}
      <section className="bg-white border-b border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-sparkline-blue flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-sparkline-midnight">
                  Strategy Built Around Your Product
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tailored to your margins, price point, and audience.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-sparkline-orange flex items-center justify-center shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-sparkline-midnight">
                  Budget Planning Backed by Calculations
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Dynamic spend allocation with cash flow protection.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-sparkline-cyan flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-sparkline-midnight">
                  Marketing Metrics Made Understandable
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Clear formulas for CAC, LTV, ROAS, and ROI.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-sparkline-purple flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-sparkline-midnight">
                  Actionable Recommendations
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Everything organized in one intelligence workspace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — PROBLEM AND SOLUTION SECTION */}
      <section className="py-20 sm:py-28 bg-sparkline-cloud border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="orange" className="mb-3">
              The Strategic Shift
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-sparkline-midnight tracking-tight">
              Stop Guessing. Start Marketing With a Clear Strategy.
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              Most marketing campaigns fail not because of poor ad tools, but because of fragmented decisions made without structured unit economics or competitor intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                problem: 'Unclear Target Audiences',
                probDesc: 'Broad, unfocused targeting that wastes budget on low-intent clicks.',
                solution: 'Target Audience Intelligence',
                solDesc: 'Algorithmic demographic, psychographic, and buying trigger maps.',
              },
              {
                problem: 'Random Advertising Decisions',
                probDesc: 'Trial-and-error campaign launches with no defined payback timeline.',
                solution: 'Algorithmic Channel Matching',
                solDesc: 'Identifies channels with the highest probability of payback based on unit margins.',
              },
              {
                problem: 'Poor Budget Allocation',
                probDesc: 'Premature budget exhaustion on unproven channels before validating CAC.',
                solution: 'Dynamic Budget Planner',
                solDesc: 'Paced allocation matrices with multi-currency risk management.',
              },
              {
                problem: 'Confusion Over Marketing Metrics',
                probDesc: 'Vanity impressions masking unprofitable cost-per-acquisition metrics.',
                solution: 'Marketing Metrics Hub',
                solDesc: 'Transparent formula breakdowns for CAC, LTV, ROAS, and MER.',
              },
              {
                problem: 'Weak Competitor Research',
                probDesc: 'Copying competitor ad hooks blindly without understanding positioning whitespace.',
                solution: 'Competitor Intelligence Matrix',
                solDesc: 'Reveals competitor messaging gaps and underpriced audience niches.',
              },
              {
                problem: 'Inconsistent Campaign Planning',
                probDesc: 'Scattered spreadsheets and disconnected ad flight calendars.',
                solution: 'Unified Campaign Studio',
                solDesc: 'Consolidated flight dates, target impressions, and conversion milestones.',
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 bg-white border-slate-200/90 shadow-card flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Problem Callout */}
                  <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/60">
                    <div className="flex items-center gap-2 text-rose-800 text-xs font-bold mb-1">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>The Challenge: {item.problem}</span>
                    </div>
                    <p className="text-xs text-rose-700/90 leading-relaxed">
                      {item.probDesc}
                    </p>
                  </div>

                  {/* Sparkline Solution */}
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/60">
                    <div className="flex items-center gap-2 text-sparkline-blue text-xs font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-sparkline-blue" />
                      <span>The Sparkline Solution: {item.solution}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {item.solDesc}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — CORE PLATFORM FEATURES (10 Dedicated Cards) */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="blue" className="mb-3">
              Comprehensive Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-sparkline-midnight tracking-tight">
              A Complete Intelligence Architecture
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              Every specialized capability needed to analyze your product, research your market, model ad budgets, and forecast growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {coreFeatures.map((feat) => (
              <Link
                key={feat.title}
                to={feat.route}
                className="group block p-5 rounded-2xl bg-sparkline-cloud border border-slate-200/80 hover:border-sparkline-blue/40 hover:bg-white hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:bg-sparkline-blue group-hover:text-white transition-colors duration-200">
                    {feat.icon}
                  </div>
                  <h3 className="text-sm font-bold text-sparkline-midnight group-hover:text-sparkline-blue transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-sparkline-blue">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — HOW IT WORKS (4-Step Visual Process) */}
      <section className="py-20 sm:py-28 bg-sparkline-cloud border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="purple" className="mb-3">
              Strategic Workflow
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-sparkline-midnight tracking-tight">
              How Sparkline Works in 4 Steps
            </h2>
            <p className="mt-4 text-slate-600 text-sm leading-relaxed">
              From raw product details to a calculated, multi-channel marketing campaign.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Enter Product Information',
                desc: 'Input your product name, core UVP, price point, gross margins, and growth objectives.',
                icon: <FileText className="w-5 h-5 text-sparkline-blue" />,
              },
              {
                step: '02',
                title: 'Analyze Your Market',
                desc: 'Our engine evaluates search volume, competitor ad angles, audience friction, and unit economics.',
                icon: <Search className="w-5 h-5 text-sparkline-purple" />,
              },
              {
                step: '03',
                title: 'Generate Your Strategy',
                desc: 'Receive channel weightings, budget allocations, 90-day flight schedules, and messaging hooks.',
                icon: <Brain className="w-5 h-5 text-sparkline-magenta" />,
              },
              {
                step: '04',
                title: 'Plan, Execute & Measure',
                desc: 'Deploy campaigns confidently, track actual vs. predicted ROAS, and optimize with machine precision.',
                icon: <TrendingUp className="w-5 h-5 text-sparkline-cyan" />,
              },
            ].map((stepItem) => (
              <div
                key={stepItem.step}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card flex flex-col justify-between relative group hover:border-sparkline-blue/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-display text-slate-300 group-hover:text-sparkline-blue transition-colors">
                      {stepItem.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                      {stepItem.icon}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    {stepItem.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {stepItem.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] uppercase font-mono font-bold text-slate-400">
                  STEP_{stepItem.step}_COMPLETE
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — MARKETING INTELLIGENCE PREVIEW (8 Key Metrics) */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <Badge variant="cyan" className="mb-3">
                Marketing Intelligence Preview
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-sparkline-midnight tracking-tight">
                Demystifying Critical Marketing Metrics
              </h2>
              <p className="mt-3 text-slate-600 text-sm max-w-xl leading-relaxed">
                Clear definitions and mathematically verified formulas so you always understand where your ad spend creates real value.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Button to="/dashboard/metrics" variant="outline" size="md">
                Explore Marketing Metrics
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreMetrics.map((metric) => (
              <Card key={metric.code} className="p-5 bg-sparkline-cloud border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-black font-display text-sparkline-blue">
                      {metric.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      {metric.name}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-sparkline-midnight mb-3">
                    {metric.formula}
                  </div>

                  <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                    {metric.definition}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/70 text-[11px] text-slate-500">
                  <strong className="text-sparkline-midnight font-semibold">Why it matters: </strong>
                  {metric.whyItMatters}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — AI MARKETING STRATEGIST PREVIEW (Organic Vitamin C Serum Demonstration) */}
      <section className="py-20 sm:py-28 bg-sparkline-cloud border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="purple" className="mb-3">
              Live Product Simulation
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-sparkline-midnight tracking-tight">
              See the AI Marketing Strategist in Action
            </h2>
            <p className="mt-4 text-slate-600 text-sm leading-relaxed">
              Watch how Sparkline transforms product information into actionable intelligence. Below is a real demonstration scenario.
            </p>
          </div>

          {/* Interactive Simulation Console */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-premium">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Product Input Card */}
              <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">
                    Demonstration Product
                  </span>
                  <Badge variant="blue" size="sm">
                    Sample Ingestion
                  </Badge>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Product Name</label>
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Organic Vitamin C Glow Serum
                  </h3>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Category & Specs</label>
                  <p className="text-xs text-slate-700">
                    Clean Skincare • 20% L-Ascorbic Acid • Cruelty-free • 30ml
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block">Retail Price</span>
                    <span className="text-sm font-bold text-sparkline-midnight">$38.00</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block">Gross Margin</span>
                    <span className="text-sm font-bold text-emerald-700">72%</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 leading-relaxed">
                  <strong className="block font-bold">Illustrative Demonstration Notice:</strong>
                  The recommendations and allocations shown are sample demonstration scenarios to illustrate platform capabilities. Actual results depend on live auction dynamics.
                </div>
              </div>

              {/* Generated Recommendations Panel */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                  <span className="font-bold text-sparkline-midnight flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sparkline-purple" />
                    <span>Synthesized Intelligence Blueprint</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-sparkline-purple bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    STATUS: READY
                  </span>
                </div>

                {/* Target Audience */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[11px] font-bold text-sparkline-blue uppercase tracking-wide block mb-1">
                    1. Target Audience Segmentation
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Working professionals (aged 26–45) experiencing early dullness and hyper-pigmentation. Values clean beauty certifications and dermatologist-backed clinical studies.
                  </p>
                </div>

                {/* Recommended Channels & Budget Allocation */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[11px] font-bold text-sparkline-purple uppercase tracking-wide block mb-2">
                    2. Recommended Channel Mix & Budget Allocation ($12,500/mo)
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Google High-Intent Shopping & Search</span>
                      <span className="font-bold font-mono text-sparkline-midnight">40% ($5,000)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Meta & Instagram User-Generated Hooks</span>
                      <span className="font-bold font-mono text-sparkline-midnight">35% ($4,375)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Micro-Influencer Gifting & Affiliate Seedings</span>
                      <span className="font-bold font-mono text-sparkline-midnight">25% ($3,125)</span>
                    </div>
                  </div>
                </div>

                {/* Marketing Experiment */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[11px] font-bold text-sparkline-orange uppercase tracking-wide block mb-1">
                    3. Recommended High-Impact Experiment
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    A/B test "Dermatologist-Formulated Radiance" against "7-Day Dark Spot Guarantee" hooks. High gross margins (72%) support a $20 CAC target with a 30-day payback period.
                  </p>
                </div>

                {/* CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Ready to run your own product intelligence analysis?
                  </span>
                  <Button
                    to="/dashboard/strategist"
                    variant="gradient"
                    size="md"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Create Your Marketing Strategy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11 — MARKETING TOOLS SHOWCASE (Categorized Discovery) */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="blue" className="mb-3">
              Precision Utilities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-sparkline-midnight tracking-tight">
              Marketing Tools Discovery
            </h2>
            <p className="mt-4 text-slate-600 text-sm leading-relaxed">
              Explore our categorized catalog of marketing intelligence tools, financial calculators, and campaign studios.
            </p>
          </div>

          {/* Category Tabs */}
          <div
            role="tablist"
            aria-label="Marketing tools categories"
            className="flex flex-wrap justify-center gap-2 mb-10 px-2"
          >
            {[
              { id: 'strategy', label: 'Strategy & Research' },
              { id: 'analytics', label: 'Analytics & Calculations' },
              { id: 'planning', label: 'Planning & Execution' },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={selectedToolsCategory === tab.id}
                type="button"
                onClick={() => setSelectedToolsCategory(tab.id as any)}
                className={cn(
                  'px-4 py-2.5 rounded-xl text-xs font-semibold transition-all select-none min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sparkline-blue',
                  selectedToolsCategory === tab.id
                    ? 'bg-sparkline-midnight text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {categorizedTools[selectedToolsCategory].map((tool) => (
              <div
                key={tool.name}
                className="p-5 rounded-2xl bg-sparkline-cloud border border-slate-200/80 shadow-subtle hover:border-sparkline-blue/40 hover:bg-white hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {tool.badge}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-sparkline-blue" />
                  </div>
                  <h3 className="text-xs font-bold text-sparkline-midnight">
                    {tool.name}
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-slate-200/60">
                  <Link
                    to="/tools"
                    className="text-[11px] font-semibold text-sparkline-blue hover:underline flex items-center justify-between"
                  >
                    <span>View Tool</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12 — MARKETING KNOWLEDGE SECTION (Marketing Academy) */}
      <section className="py-20 sm:py-28 bg-sparkline-cloud border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <Badge variant="purple" className="mb-3">
                Knowledge Center
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-sparkline-midnight tracking-tight">
                Sparkline Marketing Academy
              </h2>
              <p className="mt-3 text-slate-600 text-sm max-w-xl leading-relaxed">
                Master modern performance marketing, unit economics modeling, and channel playbooks with structured curriculum.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Button to="/marketing-academy" variant="primary" size="md" leftIcon={<BookOpen className="w-4 h-4" />}>
                Explore Marketing Academy
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: 'Digital Marketing Fundamentals', level: 'Beginner' },
              { title: 'Performance Marketing', level: 'Advanced' },
              { title: 'Social Media Marketing', level: 'Intermediate' },
              { title: 'Search Engine Optimization (SEO)', level: 'All Levels' },
              { title: 'Google Ads Strategy', level: 'Advanced' },
              { title: 'Meta Ads Mastery', level: 'Intermediate' },
              { title: 'Content Marketing & Pillars', level: 'Intermediate' },
              { title: 'Email Marketing & Retention', level: 'Intermediate' },
              { title: 'Marketing Analytics & Attribution', level: 'Advanced' },
              { title: 'Conversion Rate Optimization (CRO)', level: 'Advanced' },
            ].map((course) => (
              <Link
                key={course.title}
                to="/marketing-academy"
                className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-subtle hover:border-sparkline-purple/40 hover:shadow-card transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block mb-1">
                    {course.level}
                  </span>
                  <h3 className="text-xs font-bold text-sparkline-midnight group-hover:text-sparkline-purple transition-colors leading-snug">
                    {course.title}
                  </h3>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-sparkline-purple">
                  <span>Start Guide</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 13 — SECURITY AND PRIVACY SECTION */}
      <section className="py-20 sm:py-28 bg-sparkline-midnight text-white border-b border-sparkline-slate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sparkline-cyan text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Security-First Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Enterprise Data Protection for Strategic Intelligence
            </h2>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              We know your product margins, acquisition costs, and strategic plans are confidential assets. Sparkline guarantees cryptographic isolation with zero data exploitation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-sparkline-slate border border-white/10 space-y-3">
              <Lock className="w-6 h-6 text-sparkline-blue" />
              <h3 className="text-sm font-bold text-white">
                Zero Client-Side Secrets (Verified)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero API keys exist on the client side. All strategy generation and AI interactions execute strictly within server-side proxy environments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-sparkline-slate border border-white/10 space-y-3">
              <ShieldCheck className="w-6 h-6 text-sparkline-magenta" />
              <h3 className="text-sm font-bold text-white">
                Zero AI Training on Proprietary Data (Verified)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your strategy inputs, margins, and proprietary campaign assets are never used to train public or third-party AI models.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-sparkline-slate border border-white/10 space-y-3">
              <KeyRound className="w-6 h-6 text-sparkline-orange" />
              <h3 className="text-sm font-bold text-white">
                Input Boundary Sanitization (Verified)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Application boundary sanitization filters prevent cross-site scripting (XSS), script injection, and query corruption.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-sparkline-slate border border-white/10 space-y-3">
              <Database className="w-6 h-6 text-sparkline-purple" />
              <h3 className="text-sm font-bold text-white">
                Row-Level Database Isolation (Planned Phase 04)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                PostgreSQL Row Level Security (RLS) ensures that every query is strictly restricted to the authenticated tenant workspace ID.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-sparkline-slate border border-white/10 space-y-3">
              <Lock className="w-6 h-6 text-sparkline-cyan" />
              <h3 className="text-sm font-bold text-white">
                Role-Based Access Control (Planned Phase 04)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Granular workspace roles (Owner, Strategist, Viewer) will restrict access to client ad spend budgets and executive exports.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-sparkline-slate border border-white/10 space-y-3">
              <FileText className="w-6 h-6 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Encrypted Report Storage (Planned Phase 12)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generated PDF presentations will utilize AES-256 encrypted storage buckets with expiring signed access tokens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 14 — PRELIMINARY PRICING PREVIEW */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="blue" className="mb-3">
              Preliminary Pricing Preview
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-sparkline-midnight tracking-tight">
              Predictable Plans for Every Stage of Growth
            </h2>
            <p className="mt-4 text-slate-600 text-sm leading-relaxed">
              Transparent preliminary tiers. No payments are processed in this phase—all preview accounts have instant access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl p-8 border border-slate-200/90 bg-white flex flex-col justify-between shadow-subtle">
              <div>
                <h3 className="text-lg font-bold text-sparkline-midnight">Free</h3>
                <p className="text-xs text-slate-500 mt-1">For freelancers exploring marketing tools.</p>
                <div className="mt-5 text-3xl font-extrabold text-sparkline-midnight font-display">$0</div>
                <ul className="mt-6 space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sparkline-blue shrink-0" />
                    <span>Basic marketing tools access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sparkline-blue shrink-0" />
                    <span>Limited strategy generation (3 / mo)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sparkline-blue shrink-0" />
                    <span>Basic marketing metrics calculators</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Button to="/dashboard" variant="outline" size="md" className="w-full justify-center">
                  Get Started Free
                </Button>
              </div>
            </div>

            {/* Pro */}
            <div className="rounded-2xl p-8 border-2 border-sparkline-blue bg-white flex flex-col justify-between shadow-premium relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-sparkline-blue text-white text-[10px] font-bold tracking-wider uppercase">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-sparkline-midnight">Pro</h3>
                <p className="text-xs text-slate-500 mt-1">For scaling growth marketers and founders.</p>
                <div className="mt-5 text-3xl font-extrabold text-sparkline-midnight font-display">
                  $49 <span className="text-xs font-normal text-slate-500">/mo (Preliminary)</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sparkline-blue shrink-0" />
                    <span>Advanced AI marketing strategy blueprints</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sparkline-blue shrink-0" />
                    <span>Expanded competitor & audience research</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sparkline-blue shrink-0" />
                    <span>Predictive ROAS performance curves</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sparkline-blue shrink-0" />
                    <span>Executive marketing PDF report exports</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Button to="/dashboard/strategist" variant="gradient" size="md" className="w-full justify-center">
                  Start Pro Strategy
                </Button>
              </div>
            </div>

            {/* Agency */}
            <div className="rounded-2xl p-8 border border-slate-200/90 bg-white flex flex-col justify-between shadow-subtle">
              <div>
                <h3 className="text-lg font-bold text-sparkline-midnight">Agency</h3>
                <p className="text-xs text-slate-500 mt-1">For agencies managing multiple brand accounts.</p>
                <div className="mt-5 text-3xl font-extrabold text-sparkline-midnight font-display">
                  $149 <span className="text-xs font-normal text-slate-500">/mo (Preliminary)</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sparkline-blue shrink-0" />
                    <span>Multiple client workspaces & isolation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sparkline-blue shrink-0" />
                    <span>White-label agency report customizations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sparkline-blue shrink-0" />
                    <span>Team collaboration & approval workflows</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sparkline-blue shrink-0" />
                    <span>Multi-currency budget pacing matrix</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Button to="/contact" variant="outline" size="md" className="w-full justify-center">
                  Contact Agency Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 15 — FAQ ACCORDION SECTION */}
      <section className="py-20 sm:py-28 bg-sparkline-cloud border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="blue" className="mb-3">
              Frequently Asked Questions
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-sparkline-midnight tracking-tight">
              Got Questions? We Have Answers.
            </h2>
            <p className="mt-3 text-slate-600 text-sm leading-relaxed">
              Transparent, honest explanations of how Sparkline works and what to expect.
            </p>
          </div>

          <Accordion items={faqItems} />
        </div>
      </section>

      {/* SECTION 16 — FINAL CONVERSION SECTION */}
      <section className="py-20 sm:py-28 bg-sparkline-midnight text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-sparkline-blue/20 via-sparkline-purple/10 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Badge variant="blue" className="mb-4 bg-white/10 text-sparkline-cyan border-white/10">
            Start Your Growth Journey
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Your Next Marketing Decision Should Be an Informed One.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Bring your product, audience and budget together in one intelligent marketing workspace.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              to="/dashboard/strategist"
              variant="gradient"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shadow-md"
            >
              Start Building Your Strategy
            </Button>
            <Button
              to="/dashboard"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Explore the Platform
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
