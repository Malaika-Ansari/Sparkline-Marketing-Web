import React from 'react';
import { SEO } from '@/components/common/SEO';
import { Badge } from '@/components/common/Badge';
import { siteConfig } from '@/config/site';

export const PrivacyPolicyPage: React.FC = () => {
  const privacyJsonLd = [
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
          name: 'Privacy Policy',
          item: 'https://sparklinemarketing.com/privacy-policy',
        },
      ],
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-sparkline-cloud">
      <SEO
        title="Privacy Policy — Data Isolation & Integrity"
        description="Review how Sparkline Marketing protects your proprietary strategy inputs and ensures zero model training on confidential assets."
        canonical="https://sparklinemarketing.com/privacy-policy"
        jsonLd={privacyJsonLd}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="blue" className="mb-3">
            Legal & Privacy
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-sparkline-midnight tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-slate-500">Last updated: November 2026</p>
        </div>

        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/80 shadow-card space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-sparkline-midnight">
              1. Our Data Commitment
            </h2>
            <p>
              At Sparkline Marketing, we recognize that marketing strategies, target margins,
              ad spend budgets, and customer definitions represent proprietary intellectual property.
              We treat user submissions with institutional-grade security.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-sparkline-midnight">
              2. Zero AI Model Training Policy
            </h2>
            <p>
              Inputs provided into the AI Marketing Strategist or related intelligence tools are
              <strong> never</strong> utilized to train, retrain, or fine-tune public or
              third-party foundational AI models. Your product matrices remain isolated within
              your tenant workspace.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-sparkline-midnight">
              3. Data Collection and Usage
            </h2>
            <p>
              We collect information strictly necessary to provide the platform services:
              account credentials, workspace profile attributes, and explicit campaign parameters.
              We do not sell user data to advertising exchanges or data brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-sparkline-midnight">
              4. Data Retention & Erasure
            </h2>
            <p>
              Users may request full deletion of their account records, strategy archives,
              and workspace documents at any time by contacting{' '}
              <a
                href={siteConfig.contact.emailMailto}
                className="text-sparkline-blue hover:underline"
              >
                {siteConfig.contact.email}
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

