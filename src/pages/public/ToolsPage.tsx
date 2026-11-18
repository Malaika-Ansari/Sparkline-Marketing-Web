import React, { useState } from 'react';
import { SEO } from '@/components/common/SEO';
import { Badge } from '@/components/common/Badge';
import { marketingService } from '@/services/marketing.service';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const ToolsPage: React.FC = () => {
  const allTools = marketingService.getAllTools();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Strategy', 'Research', 'Finance', 'Execution', 'Reporting'];

  const filteredTools =
    selectedCategory === 'All'
      ? allTools
      : allTools.filter((t) => t.category === selectedCategory);

  const toolsJsonLd = [
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
          name: 'Marketing Tools',
          item: 'https://sparklinemarketing.com/tools',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Sparkline Marketing Intelligence Tools & Calculators',
      itemListElement: allTools.map((tool, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: tool.title,
        description: tool.description,
        url: `https://sparklinemarketing.com${tool.route}`,
      })),
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-sparkline-cloud">
      <SEO
        title="Marketing Tools Directory & Calculators — Sparkline Marketing"
        description="Browse our suite of AI marketing tools, ROI calculators, budget planners, SEO toolkits, and competitive intelligence matrices."
        canonical="https://sparklinemarketing.com/tools"
        jsonLd={toolsJsonLd}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="cyan" className="mb-3">
            Toolkit Catalog
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-sparkline-midnight tracking-tight">
            Marketing Intelligence Tools
          </h1>
          <p className="mt-4 text-slate-600 text-base leading-relaxed">
            Every tool is engineered to deliver structured insights and eliminate guesswork.
            Select a tool to explore its configuration and capabilities.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-semibold transition-all select-none',
                selectedCategory === category
                  ? 'bg-sparkline-midnight text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-sparkline-blue/40'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card hover:border-sparkline-blue/50 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-sparkline-blue flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="neutral" size="sm">
                      {tool.category}
                    </Badge>
                    {tool.badge && (
                      <Badge variant="blue" size="sm">
                        {tool.badge}
                      </Badge>
                    )}
                  </div>
                </div>

                <h2 className="text-base font-bold text-sparkline-midnight">
                  {tool.title}
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono uppercase">
                  {tool.status}
                </span>
                <Link
                  to={tool.route}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sparkline-blue hover:text-blue-700 transition-colors"
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Informational Guidance & Internal Links */}
        <div className="mt-16 text-center border-t border-slate-200/80 pt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
          <span>Need structured frameworks?</span>
          <Link to="/marketing-academy" className="text-sparkline-blue hover:underline inline-flex items-center gap-1">
            Browse Academy Masterclasses <ArrowRight className="w-3 h-3" />
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
