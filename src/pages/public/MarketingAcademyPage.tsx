import React from 'react';
import { SEO } from '@/components/common/SEO';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MarketingAcademyPage: React.FC = () => {
  const courses = [
    {
      id: 'course-1',
      title: 'Full-Funnel Unit Economics & Payback Modeling',
      description:
        'Master the relationship between CAC, LTV, payback timelines, and sustainable cash flow for high-growth campaigns.',
      duration: '45 mins',
      level: 'Advanced',
      category: 'Financial Strategy',
    },
    {
      id: 'course-2',
      title: 'Competitive Whitespace & Asymmetric Positioning',
      description:
        'How to identify competitor messaging blindspots and exploit underpriced audience segments on search and social.',
      duration: '35 mins',
      level: 'Intermediate',
      category: 'Market Research',
    },
    {
      id: 'course-3',
      title: 'Algorithmic Creative Strategy & Ad Fatigue Prevention',
      description:
        'Systematic frameworks for generating and cycling performance ad variations before audience CTR collapses.',
      duration: '50 mins',
      level: 'All Levels',
      category: 'Creative Intelligence',
    },
    {
      id: 'course-4',
      title: 'B2B Search Intent Arbitrage & Pipeline Velocity',
      description:
        'Capturing high buyer-intent searches with high-converting landing page architectures and offer structuring.',
      duration: '40 mins',
      level: 'Advanced',
      category: 'Search & SEO',
    },
  ];

  const academyJsonLd = [
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
          name: 'Marketing Academy',
          item: 'https://sparklinemarketing.com/marketing-academy',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Sparkline Marketing Academy Growth Masterclasses',
      itemListElement: courses.map((course, idx) => ({
        '@type': 'Course',
        position: idx + 1,
        name: course.title,
        description: course.description,
        provider: {
          '@type': 'Organization',
          name: 'Sparkline Marketing',
          sameAs: 'https://sparklinemarketing.com',
        },
      })),
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-sparkline-cloud">
      <SEO
        title="Marketing Academy & Growth Knowledge Center — Sparkline Marketing"
        description="Learn data-driven marketing frameworks, unit economics modeling, and competitive intelligence playbooks taught by growth experts."
        canonical="https://sparklinemarketing.com/marketing-academy"
        jsonLd={academyJsonLd}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="purple" className="mb-3">
            Growth Masterclasses
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-sparkline-midnight tracking-tight">
            Sparkline Marketing Academy
          </h1>
          <p className="mt-4 text-slate-600 text-base leading-relaxed">
            Elevate your strategic thinking with structured playbooks, tactical frameworks,
            and data modeling blueprints taught by veteran growth marketers.
          </p>
        </div>

        {/* Masterclass Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-card hover:border-sparkline-purple/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="purple" size="sm">
                    {course.category}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">
                    {course.level}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-sparkline-midnight">
                  {course.title}
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.duration}</span>
                </div>
                <Button
                  to="/dashboard/strategist"
                  variant="outline"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Apply Framework
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Cross-Links to Marketing Workspace & Calculators */}
        <div className="mt-16 text-center border-t border-slate-200/80 pt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
          <span>Apply what you learn in our live workspace:</span>
          <Link to="/tools" className="text-sparkline-blue hover:underline inline-flex items-center gap-1">
            Marketing Calculators & Tools <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/features" className="text-sparkline-blue hover:underline inline-flex items-center gap-1">
            Platform Capabilities <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/pricing" className="text-sparkline-blue hover:underline inline-flex items-center gap-1">
            View Pricing Plans <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
