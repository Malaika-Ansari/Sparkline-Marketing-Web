import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Brain,
  Calculator,
  Target,
  BarChart3,
  Megaphone,
  FileText,
  Sparkles,
  Users,
  Compass,
  Calendar,
  Share2,
  Globe,
  TrendingUp,
  FolderKanban,
  Boxes,
  Settings,
  ShieldCheck,
  HelpCircle,
  X,
  CornerDownLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GlobalSearchItem {
  title: string;
  category: string;
  route: string;
  description: string;
  icon: React.ReactNode;
}

export const GlobalSearch: React.FC<{ className?: string }> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for Cmd+K or Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const searchItems: GlobalSearchItem[] = [
    {
      title: 'Advanced Analytics',
      category: 'Overview',
      route: '/dashboard/analytics',
      description: 'Multi-channel performance metrics, 7-stage conversion funnels, and AI insights',
      icon: <BarChart3 className="w-4 h-4 text-sparkline-blue" />,
    },
    {
      title: 'AI Marketing Strategist',
      category: 'Intelligence',
      route: '/dashboard/strategist',
      description: 'Generate comprehensive multi-channel marketing blueprints',
      icon: <Brain className="w-4 h-4 text-sparkline-blue" />,
    },
    {
      title: 'Market Research',
      category: 'Intelligence',
      route: '/dashboard/market-research',
      description: 'Discover market trends, segment dynamics and demand signals',
      icon: <Search className="w-4 h-4 text-sparkline-cyan" />,
    },
    {
      title: 'Audience Intelligence',
      category: 'Intelligence',
      route: '/dashboard/audience',
      description: 'Map buyer personas, pain points, and demographic profiles',
      icon: <Users className="w-4 h-4 text-sparkline-purple" />,
    },
    {
      title: 'Competitor Analysis',
      category: 'Intelligence',
      route: '/dashboard/competitors',
      description: 'Benchmark competitor positioning, ad copy, and market gaps',
      icon: <Target className="w-4 h-4 text-sparkline-magenta" />,
    },
    {
      title: 'Marketing Strategy',
      category: 'Planning',
      route: '/dashboard/strategy',
      description: 'Design strategic roadmaps, value props, and positioning',
      icon: <Compass className="w-4 h-4 text-sparkline-blue" />,
    },
    {
      title: 'Budget Planner & Forecaster',
      category: 'Planning',
      route: '/dashboard/budget',
      description: 'Model cross-channel spend pacing and currency allocations',
      icon: <Calculator className="w-4 h-4 text-sparkline-orange" />,
    },
    {
      title: 'Campaign Planner',
      category: 'Planning',
      route: '/dashboard/campaigns',
      description: 'Plan flight dates, channel deliverables, and asset schedules',
      icon: <Megaphone className="w-4 h-4 text-sparkline-blue" />,
    },
    {
      title: 'Marketing Calendar',
      category: 'Planning',
      route: '/dashboard/calendar',
      description: 'Track launch milestones, content drops, and seasonal sprints',
      icon: <Calendar className="w-4 h-4 text-sparkline-cyan" />,
    },
    {
      title: 'Social Media Studio',
      category: 'Marketing Tools',
      route: '/dashboard/social-studio',
      description: 'Craft viral hooks, platform formats, and distribution plans',
      icon: <Share2 className="w-4 h-4 text-sparkline-magenta" />,
    },
    {
      title: 'Content Studio',
      category: 'Marketing Tools',
      route: '/dashboard/content-studio',
      description: 'AI-assisted copywriting, editorial briefs, and headline scoring',
      icon: <Sparkles className="w-4 h-4 text-sparkline-purple" />,
    },
    {
      title: 'SEO Intelligence',
      category: 'Marketing Tools',
      route: '/dashboard/seo',
      description: 'Keyword opportunity scoring, search intent, and SERP benchmarks',
      icon: <Globe className="w-4 h-4 text-emerald-500" />,
    },
    {
      title: 'Marketing Metrics Hub',
      category: 'Marketing Tools',
      route: '/dashboard/metrics',
      description: 'Calculate CAC, LTV, blended ROAS, and core efficiency formulas',
      icon: <BarChart3 className="w-4 h-4 text-sparkline-cyan" />,
    },
    {
      title: 'ROI & ROAS Calculator',
      category: 'Marketing Tools',
      route: '/dashboard/roi-calculator',
      description: 'Evaluate return on ad spend, break-even thresholds, and margins',
      icon: <TrendingUp className="w-4 h-4 text-sparkline-orange" />,
    },
    {
      title: 'My Projects',
      category: 'Management',
      route: '/dashboard/projects',
      description: 'Organize and monitor all business marketing workspaces',
      icon: <FolderKanban className="w-4 h-4 text-slate-500" />,
    },
    {
      title: 'Executive Reports',
      category: 'Management',
      route: '/dashboard/reports',
      description: 'Generate polished PDF presentations and KPI executive summaries',
      icon: <FileText className="w-4 h-4 text-slate-500" />,
    },
    {
      title: 'Integrations & APIs',
      category: 'Management',
      route: '/dashboard/integrations',
      description: 'Connect Google Ads, Meta Ads, GA4, Shopify, and CRM platforms',
      icon: <Boxes className="w-4 h-4 text-sparkline-blue" />,
    },
    {
      title: 'Workspace Settings',
      category: 'Account',
      route: '/dashboard/settings',
      description: 'Manage profile preferences, currencies, and team access',
      icon: <Settings className="w-4 h-4 text-slate-500" />,
    },
    {
      title: 'Security Center',
      category: 'Account',
      route: '/dashboard/security',
      description: 'Review tenant isolation protocols, Supabase RLS, and encryption',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
    },
    {
      title: 'Help & Support Hub',
      category: 'Account',
      route: '/dashboard/help',
      description: 'Access troubleshooting documentation, playbooks, and support',
      icon: <HelpCircle className="w-4 h-4 text-sparkline-purple" />,
    },
  ];

  const filteredItems = query.trim()
    ? searchItems.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.category.toLowerCase().includes(query.toLowerCase()) ||
          i.description.toLowerCase().includes(query.toLowerCase())
      )
    : searchItems;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (route: string) => {
    navigate(route);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex].route);
      }
    }
  };

  return (
    <>
      {/* Trigger Bar */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={cn(
          'relative flex items-center justify-between w-full max-w-sm sm:max-w-md bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-sparkline-blue',
          className
        )}
        aria-label="Open global search command palette (Ctrl+K)"
      >
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">Search tools, intelligence, roadmaps...</span>
        </div>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white border border-slate-200 rounded-md shadow-sm shrink-0">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Search Modal / Command Palette */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-sparkline-midnight/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-modal border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Input Header */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-100 shrink-0">
              <Search className="w-5 h-5 text-sparkline-blue shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a module name, KPI, or marketing task..."
                className="w-full bg-transparent text-sm text-sparkline-midnight placeholder-slate-400 focus:outline-none font-medium"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg mr-1"
                  aria-label="Clear query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Marketing Intelligence Jump</span>
                <span>{filteredItems.length} results</span>
              </div>

              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No matching platform modules found for "{query}".
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.route}
                      type="button"
                      onClick={() => handleSelect(item.route)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left group',
                        isSelected
                          ? 'bg-blue-50/70 border border-blue-200/60'
                          : 'hover:bg-slate-50 border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            'p-2 rounded-lg shrink-0 transition-all',
                            isSelected
                              ? 'bg-white shadow-subtle text-sparkline-blue'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-white'
                          )}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div
                            className={cn(
                              'text-xs font-semibold truncate',
                              isSelected ? 'text-sparkline-blue' : 'text-sparkline-midnight'
                            )}
                          >
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {item.description}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        {isSelected && (
                          <CornerDownLeft className="w-3.5 h-3.5 text-sparkline-blue shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Tip */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0">
              <span className="flex items-center gap-2">
                <span>↑↓ Navigate</span>
                <span>•</span>
                <span>↵ Open</span>
              </span>
              <span>Sparkline Command Center</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
