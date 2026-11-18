import React from 'react';
import { SEO } from '@/components/common/SEO';
import { Badge } from '@/components/common/Badge';

export const TermsPage: React.FC = () => {
  const termsJsonLd = [
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
          name: 'Terms and Conditions',
          item: 'https://sparklinemarketing.com/terms',
        },
      ],
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-sparkline-cloud">
      <SEO
        title="Terms and Conditions of Service — Sparkline Marketing"
        description="Terms of service, user agreements, acceptable use policies, and platform disclaimers for Sparkline Marketing."
        canonical="https://sparklinemarketing.com/terms"
        jsonLd={termsJsonLd}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="blue" className="mb-3">
            Terms of Service
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-sparkline-midnight tracking-tight">
            Terms and Conditions
          </h1>
          <p className="mt-2 text-xs text-slate-500">Effective Date: November 2026</p>
        </div>

        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/80 shadow-card space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-sparkline-midnight">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Sparkline Marketing website, software, or APIs,
              you agree to be bound by these Terms and Conditions. If you do not agree to these
              terms, do not access or use the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-sparkline-midnight">
              2. Nature of Marketing Predictions & Disclaimers
            </h2>
            <p>
              Sparkline Marketing delivers algorithmic recommendations, market intelligence estimates,
              and predictive performance curves based on user input and market models.
              These forecasts do not constitute a guarantee of ad platform results, sales conversion rates,
              or specific financial returns. Users maintain full operational responsibility
              for their commercial ad spend commitments.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-sparkline-midnight">
              3. Intellectual Property Rights
            </h2>
            <p>
              All software interfaces, branding, graphic design, proprietary algorithms, and
              curated educational modules remain the intellectual property of Sparkline Marketing.
              You retain all proprietary ownership of your custom business data and strategy outputs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-sparkline-midnight">
              4. Termination & Fair Usage
            </h2>
            <p>
              We reserve the right to suspend accounts that engage in abusive scraping, automated
              prompt-injection attacks, or violations of acceptable use policies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

