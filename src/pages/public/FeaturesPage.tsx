import React from 'react';
import { SEO } from '@/components/common/SEO';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturesPage: React.FC = () => {
  const featuresJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://sparklinemarketing.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Features',
          item: 'https://sparklinemarketing.com/features',
        },
      ],
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-sparkline-cloud">
      <SEO
        title="Features & Intelligence Capabilities — Sparkline Marketing"
        description="Explore the full suite of AI marketing intelligence, growth curves, competitor benchmarking, dynamic budget allocation, and multi-channel attribution."
        canonical="https://sparklinemarketing.com/features"
        jsonLd={featuresJsonLd}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="blue" className="mb-3">
            Platform Capabilities
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-sparkline-midnight tracking-tight">
            Engineered for Precision Growth
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Sparkline Marketing bridges the gap between raw data and marketing action.
            Discover how our specialized modules power smarter campaigns.
          </p>
        </div>

        {/* Feature Blocks */}
        <div className="space-y-12">
          {/* Feature 1 */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge variant="blue">Strategic Core</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-sparkline-midnight">
                AI Marketing Strategist
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Input your product details, pricing, and growth goals to receive an end-to-end
                marketing blueprint. Sparkline identifies high-probability acquisition channels,
                angles, and messaging hooks without boilerplate fluff.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sparkline-blue" />
                  Unit-economics-driven channel allocation.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sparkline-blue" />
                  Target audience psychographic and friction profiling.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sparkline-blue" />
                  Tactical 90-day execution milestones.
                </li>
              </ul>
              <div className="pt-2">
                <Button to="/dashboard/strategist" variant="gradient" size="sm">
                  Launch Strategist
                </Button>
              </div>
            </div>
            <div className="bg-sparkline-midnight rounded-2xl p-6 text-white border border-sparkline-slate">
              <div className="flex items-center justify-between pb-3 border-b border-sparkline-slate text-xs font-mono text-sparkline-cyan">
                <span>STRATEGY_OUTPUT_PREVIEW</span>
                <span>CONFIDENCE: 94%</span>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-sparkline-slate">
                  <div className="font-semibold text-white">Recommended Primary Angle</div>
                  <div className="text-slate-300 mt-1">
                    "Predictable Growth Curve vs. Uncalculated Ad Spend Trial"
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-sparkline-slate">
                  <div className="font-semibold text-white">Channel Weighting</div>
                  <div className="text-slate-300 mt-1">
                    Google Search (45%) • LinkedIn ABM (35%) • Newsletter Sponsorships (20%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1 bg-sparkline-midnight rounded-2xl p-6 text-white border border-sparkline-slate">
              <div className="flex items-center justify-between pb-3 border-b border-sparkline-slate text-xs font-mono text-sparkline-orange">
                <span>BUDGET_SIMULATION</span>
                <span>ALLOCATION: $25,000 / MO</span>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-sparkline-slate">
                  <span className="text-slate-300">Target Blended ROAS</span>
                  <span className="font-bold text-emerald-400">4.6x</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-sparkline-slate">
                  <span className="text-slate-300">Expected Conversion Volume</span>
                  <span className="font-bold text-white">1,850 Leads</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-sparkline-slate">
                  <span className="text-slate-300">Payback Timeline</span>
                  <span className="font-bold text-sparkline-cyan">42 Days</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-4">
              <Badge variant="orange">Financial Rigor</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-sparkline-midnight">
                Dynamic Budget Planner & Currency Matrix
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Take the risk out of ad spend allocation. Model diverse scenarios, convert
                budgets across global currencies, and pace campaign deployments safely based
                on actual payback timelines.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sparkline-orange" />
                  Real-time multi-currency allocation matrices.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sparkline-orange" />
                  Risk-adjusted spend pacing recommendations.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sparkline-orange" />
                  Integrated CAC & LTV break-even calculators.
                </li>
              </ul>
              <div className="pt-2">
                <Button to="/dashboard/budget" variant="outline" size="sm">
                  Explore Budget Planner
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Cross-Links */}
        <div className="mt-16 text-center border-t border-slate-200/80 pt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
          <span>Explore platform details:</span>
          <Link to="/tools" className="text-sparkline-blue hover:underline inline-flex items-center gap-1">
            Browse All Marketing Tools <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/pricing" className="text-sparkline-blue hover:underline inline-flex items-center gap-1">
            Pricing Plans <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/marketing-academy" className="text-sparkline-blue hover:underline inline-flex items-center gap-1">
            Marketing Academy <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
