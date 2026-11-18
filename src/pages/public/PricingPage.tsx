import React from 'react';
import { SEO } from '@/components/common/SEO';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Accordion } from '@/components/common/Accordion';
import { Check, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Starter Strategist',
      price: '$49',
      period: '/month',
      description: 'Ideal for freelance marketers and early-stage founders.',
      features: [
        '5 Full AI Marketing Strategies / mo',
        'Basic Competitor Landscape Scan',
        'Dynamic Budget Planner & Currency Matrix',
        'Standard Marketing Metrics Hub',
        'Community Academy Access',
      ],
      ctaText: 'Start Free Trial',
      highlight: false,
    },
    {
      name: 'Growth Intelligence',
      price: '$149',
      period: '/month',
      description: 'Built for scaling direct-to-consumer and B2B growth teams.',
      features: [
        'Unlimited AI Strategy Blueprint Generation',
        'Deep Competitor Intelligence & Ad Angles',
        'Predictive Performance Forecasting',
        'Multi-Channel Spend Allocation Engine',
        'Executive PDF Report Generator',
        'Priority Academy Masterclasses',
      ],
      ctaText: 'Get Started with Growth',
      highlight: true,
      badge: 'Most Popular',
    },
    {
      name: 'Agency & Enterprise',
      price: '$399',
      period: '/month',
      description: 'Designed for agencies managing multiple client brands.',
      features: [
        'Unlimited Client Workspaces & Tenant Isolation',
        'Custom White-Label Strategy Reports',
        'Multi-Currency Global Pacing Models',
        'Dedicated Strategy Review Sessions',
        'Custom Integrations & Webhooks Support',
        'SLA & Dedicated Account Lead',
      ],
      ctaText: 'Contact Enterprise',
      highlight: false,
    },
  ];

  const pricingFaqs = [
    {
      question: 'Can I change or cancel my subscription plan at any time?',
      answer:
        'Yes. You can upgrade, downgrade, or cancel your subscription at any time directly from your Account Settings. If you cancel, your access continues through the end of your prepaid billing period with zero unexpected renewal fees.',
    },
    {
      question: 'How is proprietary marketing and project data protected?',
      answer:
        'Your business profiles, competitor dossiers, financial budgets, and campaign strategies are strictly isolated using PostgreSQL Row-Level Security (RLS). We never train public AI models on confidential user inputs or marketing assets.',
    },
    {
      question: 'Which ad platforms and marketing channels can I plan and track?',
      answer:
        'Sparkline natively models campaigns across Meta Ads (Facebook & Instagram), Google Ads (Search & Performance Max), TikTok Ads, LinkedIn Ads, YouTube, organic SEO, and email marketing. You can also import external CSV datasets for custom tracking.',
    },
    {
      question: 'How does multi-currency conversion work for global campaigns?',
      answer:
        'Sparkline includes a built-in institutional exchange rate engine supporting 15 global marketing currencies (including USD, EUR, GBP, CAD, AUD, PKR, SAR, AED, INR). Budgets, CPCs, and ROAS curves can be converted instantly without modifying original baseline records.',
    },
  ];

  const pricingJsonLd = [
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
          name: 'Pricing',
          item: 'https://sparklinemarketing.com/pricing',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pricingFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-sparkline-cloud">
      <SEO
        title="Transparent Pricing Plans — Sparkline Marketing"
        description="Simple, transparent plans for digital marketers, growing startups, and marketing agencies. Forecast ROI and plan budgets without hidden fees."
        canonical="https://sparklinemarketing.com/pricing"
        jsonLd={pricingJsonLd}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="blue" className="mb-3">
            Predictable Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-sparkline-midnight tracking-tight">
            Invest in High-Probability Growth
          </h1>
          <p className="mt-4 text-slate-600 text-base leading-relaxed">
            Eliminate wasted ad spend. Select the plan that matches your campaign scale.
            No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-8 flex flex-col justify-between ${
                plan.highlight
                  ? 'border-2 border-sparkline-blue shadow-premium relative'
                  : 'border border-slate-200/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-sparkline-midnight">
                    {plan.name}
                  </h2>
                  {plan.badge && (
                    <Badge variant="blue" size="sm">
                      {plan.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">{plan.description}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-sparkline-midnight font-display">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-500">{plan.period}</span>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Included Capabilities
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-sparkline-blue shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6">
                <Button
                  to="/signup"
                  variant={plan.highlight ? 'gradient' : 'outline'}
                  size="md"
                  className="w-full justify-center font-semibold"
                >
                  {plan.ctaText}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Pricing FAQ Section with Accessible Accordions */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Badge variant="neutral" size="sm" className="mb-2">
              <HelpCircle className="w-3.5 h-3.5 mr-1 text-sparkline-blue" />
              Frequently Asked Questions
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-sparkline-midnight">
              Questions About Sparkline Pricing
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Everything you need to know about billing, security, and workspace features.
            </p>
          </div>

          <Accordion
            items={pricingFaqs.map((faq, index) => ({
              id: `faq-${index}`,
              question: faq.question,
              answer: faq.answer,
            }))}
            className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-card"
          />

          {/* Internal links strip */}
          <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
            <span>Explore further:</span>
            <Link to="/features" className="text-sparkline-blue hover:underline inline-flex items-center gap-1">
              Platform Features <ArrowRight className="w-3 h-3" />
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/tools" className="text-sparkline-blue hover:underline inline-flex items-center gap-1">
              Marketing Tools Catalog <ArrowRight className="w-3 h-3" />
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/contact" className="text-sparkline-blue hover:underline inline-flex items-center gap-1">
              Contact Sales <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
