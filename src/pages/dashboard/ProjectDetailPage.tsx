/**
 * Project Details Command Center Workspace
 * Sparkline Marketing Intelligence Platform — Phase 21
 */

import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { projectService } from '@/services/project.service';
import { budgetService } from '@/services/budget.service';
import { campaignService } from '@/services/campaign.service';
import { contentService } from '@/services/content.service';
import { reportService } from '@/services/report.service';
import { unifiedStrategyService } from '@/services/unified-strategy.service';
import { useToast } from '@/components/common/Feedback';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  Package,
  Users,
  TrendingUp,
  Brain,
  Calculator,
  Sparkles,
  Info,
  Trash2,
  Edit3,
  Archive,
  RotateCcw,
  Megaphone,
  Share2,
  Search,
  FileText,
  AlertTriangle,
  ArrowRight,
  Plus,
} from 'lucide-react';

type TabKey =
  | 'overview'
  | 'business'
  | 'audience'
  | 'strategy'
  | 'budget'
  | 'campaigns'
  | 'content'
  | 'seo'
  | 'forecast'
  | 'reports';

export const ProjectDetailPage: React.FC = () => {
  const { id, projectId } = useParams<{ id?: string; projectId?: string }>();
  const targetId = projectId || id;
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const project = targetId ? projectService.getProjectById(targetId, user?.id) : undefined;

  // Real connected module records
  const strategy = useMemo(() => {
    return targetId ? unifiedStrategyService.getLatestStrategy(targetId) : null;
  }, [targetId]);

  const budgetPlan = useMemo(() => {
    return targetId ? budgetService.getPlans(targetId)[0] || null : null;
  }, [targetId]);

  const campaigns = useMemo(() => {
    return targetId ? campaignService.getCampaigns().filter((c) => c.projectId === targetId) : [];
  }, [targetId]);

  const posts = useMemo(() => {
    return targetId ? contentService.getPosts(targetId) : [];
  }, [targetId]);

  const reports = useMemo(() => {
    return targetId ? reportService.getReports().filter((r) => r.projectId === targetId) : [];
  }, [targetId]);

  const progress = useMemo(() => {
    return project ? projectService.computeProjectProgress(project) : null;
  }, [project]);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
          <Info className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-sparkline-midnight">
          Marketing Project Not Located
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          The requested project workspace ID ({targetId}) could not be retrieved from your active tenant storage.
        </p>
        <div className="pt-2">
          <Button to="/dashboard/projects" variant="primary" size="sm">
            Back to All Projects
          </Button>
        </div>
      </div>
    );
  }

  const { business, products, audience, competitors, marketPosition, marketing } = project;

  const handleArchiveToggle = () => {
    if (project.status === 'Archived') {
      projectService.restoreProject(project.id);
      addToast({
        title: 'Project Restored',
        message: `Restored ${business.brandName} to active status.`,
        type: 'success',
      });
    } else {
      projectService.archiveProject(project.id);
      addToast({
        title: 'Project Archived',
        message: `Archived ${business.brandName}.`,
        type: 'info',
      });
    }
    navigate('/dashboard/projects');
  };

  const handleConfirmDelete = () => {
    projectService.deleteProject(project.id, user?.id);
    addToast({
      title: 'Project Deleted',
      message: `${business.brandName} was removed from your workspace.`,
      type: 'info',
    });
    setDeleteModalOpen(false);
    navigate('/dashboard/projects');
  };

  const TABS: { key: TabKey; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: 'overview', label: 'Overview', icon: Building2 },
    { key: 'business', label: 'Products & Portfolio', icon: Package, badge: products?.length },
    { key: 'audience', label: 'Audience & Personas', icon: Users },
    { key: 'strategy', label: 'Marketing Strategy', icon: Brain, badge: strategy ? 1 : undefined },
    { key: 'budget', label: 'Budget & Financials', icon: Calculator, badge: budgetPlan ? 1 : undefined },
    { key: 'campaigns', label: 'Ad Campaigns', icon: Megaphone, badge: campaigns.length },
    { key: 'content', label: 'Content Studio', icon: Share2, badge: posts.length },
    { key: 'seo', label: 'SEO Intelligence', icon: Search },
    { key: 'forecast', label: 'ROI Forecast', icon: TrendingUp },
    { key: 'reports', label: 'Executive Reports', icon: FileText, badge: reports.length },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <SEO
        title={`${business.brandName} | Marketing Project Command`}
        description={`Full marketing intelligence overview and strategic profile for ${business.brandName}.`}
        noIndex={true}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/dashboard" className="hover:text-sparkline-blue font-medium">
          Dashboard
        </Link>
        <span>/</span>
        <Link to="/dashboard/projects" className="hover:text-sparkline-blue font-medium">
          Projects
        </Link>
        <span>/</span>
        <span className="font-semibold text-sparkline-midnight truncate max-w-[200px]">
          {business.brandName}
        </span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="blue" size="sm">
                {business.industry}
              </Badge>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-sparkline-blue border border-blue-200">
                {project.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {project.id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight">
              {business.brandName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {business.description}
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Button
              to={`/dashboard/projects/new?edit=${project.id}`}
              variant="outline"
              size="sm"
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Edit Parameters
            </Button>
            <Button
              to={`/dashboard/reports`}
              variant="gradient"
              size="sm"
              leftIcon={<FileText className="w-3.5 h-3.5" />}
            >
              Generate Report
            </Button>
            <button
              type="button"
              onClick={handleArchiveToggle}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200"
              title={project.status === 'Archived' ? 'Restore project' : 'Archive project'}
            >
              {project.status === 'Archived' ? <RotateCcw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setDeleteModalOpen(true);
                setDeleteInput('');
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Milestone Readiness Bar */}
        {progress && (
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <span className="font-semibold text-slate-700 shrink-0">Strategic Readiness:</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sparkline-blue to-indigo-600 rounded-full"
                  style={{ width: `${progress.overallPercentage}%` }}
                />
              </div>
              <span className="font-bold text-sparkline-blue shrink-0">{progress.overallPercentage}%</span>
            </div>
            <span className="text-[11px] text-slate-400">
              {progress.completedModulesCount} of {progress.totalModulesCount} core modules configured
            </span>
          </div>
        )}
      </div>

      {/* Workspace Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sparkline-midnight text-white shadow-sm'
                    : 'text-slate-600 hover:text-sparkline-midnight hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sparkline-blue' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panes */}
      <div className="space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Monthly Ad Investment
                </span>
                <span className="text-xl font-extrabold text-sparkline-midnight mt-1 block">
                  ${marketing?.monthlyBudget ? marketing.monthlyBudget.toLocaleString() : '0'} {marketing?.budgetCurrency || 'USD'}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">{marketing?.primaryObjective || 'Growth'}</span>
              </Card>

              <Card className="p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Product Offerings
                </span>
                <span className="text-xl font-extrabold text-sparkline-midnight mt-1 block">
                  {products?.length || 0} Products
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">{business.businessType || 'D2C'} Structure</span>
              </Card>

              <Card className="p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Competitor Matrix
                </span>
                <span className="text-xl font-extrabold text-sparkline-midnight mt-1 block">
                  {competitors?.length || 0} Direct Rivals
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">{marketPosition?.currentPosition || 'Challenger'}</span>
              </Card>

              <Card className="p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Ad Flights
                </span>
                <span className="text-xl font-extrabold text-sparkline-midnight mt-1 block">
                  {campaigns.length} Campaigns
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">{posts.length} Content Posts</span>
              </Card>
            </div>

            {/* Direct Module Shortcuts Grid */}
            <Card className="p-6">
              <h2 className="text-sm font-bold text-sparkline-midnight mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sparkline-blue" />
                <span>Jump Directly into Marketing Workspaces</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <Link
                  to="/dashboard/strategy"
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="font-bold text-sparkline-midnight group-hover:text-sparkline-blue flex items-center justify-between">
                    <span>AI Marketing Strategy</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sparkline-blue" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Multi-engine prioritized action plan.</p>
                </Link>

                <Link
                  to="/dashboard/budget"
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="font-bold text-sparkline-midnight group-hover:text-sparkline-blue flex items-center justify-between">
                    <span>Budget Planner</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sparkline-blue" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Minor-unit balanced channel spend.</p>
                </Link>

                <Link
                  to="/dashboard/campaigns"
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="font-bold text-sparkline-midnight group-hover:text-sparkline-blue flex items-center justify-between">
                    <span>Ad Campaign Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sparkline-blue" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Multi-platform ad flights & angles.</p>
                </Link>

                <Link
                  to="/dashboard/reports"
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="font-bold text-sparkline-midnight group-hover:text-sparkline-blue flex items-center justify-between">
                    <span>Executive Reports</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sparkline-blue" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Vector PDF and tabular CSV export.</p>
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: PRODUCTS & SERVICES */}
        {activeTab === 'business' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                <Package className="w-4 h-4 text-sparkline-blue" />
                <span>Product & Service Portfolio ({products?.length || 0})</span>
              </h2>
              <Button
                to={`/dashboard/projects/new?edit=${project.id}`}
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add or Edit Products
              </Button>
            </div>

            <div className="space-y-4">
              {products && products.length > 0 ? (
                products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-sparkline-midnight text-sm">{prod.name}</h3>
                        <span className="text-[11px] text-slate-500">{prod.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-slate-900 block">
                          ${prod.sellingPrice} {prod.currency}
                        </span>
                        {prod.costOfGoods && (
                          <span className="text-[10px] text-slate-400">
                            COGS: ${prod.costOfGoods} (Margin: {Math.round(((prod.sellingPrice - prod.costOfGoods) / prod.sellingPrice) * 100)}%)
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{prod.description}</p>

                    {prod.usp && (
                      <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
                        <strong className="block text-[10px] uppercase font-bold text-sparkline-blue">USP:</strong>
                        {prod.usp}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  No products added yet. Click above to add your primary offering.
                </div>
              )}
            </div>
          </Card>
        )}

        {/* TAB 3: AUDIENCE */}
        {activeTab === 'audience' && (
          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
              <Users className="w-4 h-4 text-sparkline-blue" />
              <span>Target Buyer Personas & Pain Points</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Geographic Targeting</span>
                <p className="font-medium text-slate-800">{audience?.targetLocations?.join(', ') || 'Global'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Classification</span>
                <p className="font-medium text-slate-800">{audience?.customerType || 'B2B / B2C'}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Audience Pain Points</span>
              <p className="text-slate-700 leading-relaxed">
                {audience?.mainPainPoints?.join('; ') || audience?.needsAndProblems || 'None defined yet.'}
              </p>
            </div>
          </Card>
        )}

        {/* TAB 4: STRATEGY */}
        {activeTab === 'strategy' && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                <Brain className="w-4 h-4 text-sparkline-blue" />
                <span>Unified Strategy Action Plan</span>
              </h2>
              <Button to="/dashboard/strategy" variant="outline" size="sm">
                Open Strategy Hub
              </Button>
            </div>

            {strategy ? (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-1">
                  <span className="text-[10px] font-bold text-purple-700 uppercase">Positioning Directive</span>
                  <p className="font-semibold text-slate-900">{strategy.brandPositioning?.recommendedPositioning}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Content Pillars</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    {strategy.contentStrategy?.contentPillars?.map((pil, idx) => (
                      <li key={idx}>{pil}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 space-y-2">
                <p>No unified strategy generated yet for this project.</p>
                <Button to="/dashboard/strategy" variant="gradient" size="sm">
                  Generate Action Plan
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* TAB 5: BUDGET */}
        {activeTab === 'budget' && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                <Calculator className="w-4 h-4 text-sparkline-blue" />
                <span>Marketing Budget Allocation</span>
              </h2>
              <Button to="/dashboard/budget" variant="outline" size="sm">
                Open Budget Planner
              </Button>
            </div>

            {budgetPlan ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex justify-between items-center">
                  <span className="font-medium text-slate-700">Total Monthly Investment:</span>
                  <span className="text-base font-extrabold text-sparkline-blue">
                    ${budgetPlan.totalBudget.toLocaleString()} {budgetPlan.currency}
                  </span>
                </div>
                {budgetPlan.activePlan?.allocations && (
                  <div className="space-y-2">
                    {budgetPlan.activePlan.allocations.map((a) => (
                      <div
                        key={a.id}
                        className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-800">{a.category}</span>
                        <span className="font-mono text-slate-700">
                          ${a.amount.toLocaleString()} ({a.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 space-y-2">
                <p>No budget plan generated yet for this project.</p>
                <Button to="/dashboard/budget" variant="gradient" size="sm">
                  Create Budget Model
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* TAB 6: CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-sparkline-blue" />
                <span>Advertising Flights ({campaigns.length})</span>
              </h2>
              <Button to="/dashboard/campaigns" variant="outline" size="sm">
                Open Campaign Studio
              </Button>
            </div>

            {campaigns.length > 0 ? (
              <div className="space-y-2">
                {campaigns.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{c.name}</span>
                      <span className="text-[11px] text-slate-500">
                        {c.platforms?.join(', ')} • {c.objective}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800 block">${c.budget.totalBudget.toLocaleString()}</span>
                      <Badge variant="blue" size="sm">{c.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 space-y-2">
                <p>No campaigns configured yet for this project.</p>
                <Button to="/dashboard/campaigns" variant="gradient" size="sm">
                  Launch Campaign
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* TAB 7: CONTENT */}
        {activeTab === 'content' && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                <Share2 className="w-4 h-4 text-sparkline-blue" />
                <span>Content & Social Media Strategy ({posts.length})</span>
              </h2>
              <Button to="/dashboard/content-studio" variant="outline" size="sm">
                Open Content Studio
              </Button>
            </div>

            {posts.length > 0 ? (
              <div className="space-y-2">
                {posts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{p.title || p.openingHook || 'Content Post'}</span>
                      <span className="text-[11px] text-slate-500 capitalize">{p.platform} • {p.format}</span>
                    </div>
                    <Badge variant="purple" size="sm">{p.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 space-y-2">
                <p>No content posts scheduled yet for this project.</p>
                <Button to="/dashboard/content-studio" variant="gradient" size="sm">
                  Create First Post
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* TAB 8: SEO */}
        {activeTab === 'seo' && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                <Search className="w-4 h-4 text-sparkline-blue" />
                <span>SEO Intelligence & Optimization</span>
              </h2>
              <Button to="/dashboard/seo" variant="outline" size="sm">
                Open SEO Toolkit
              </Button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analyze on-page technical health, keyword clustering, and meta structure for {business.brandName}.
            </p>
            <div className="pt-2">
              <Button to="/dashboard/seo" variant="gradient" size="sm">
                Run Technical SEO Audit
              </Button>
            </div>
          </Card>
        )}

        {/* TAB 9: FORECAST */}
        {activeTab === 'forecast' && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sparkline-blue" />
                <span>ROI & ROAS Forecasting Models</span>
              </h2>
              <Button to="/dashboard/forecast" variant="outline" size="sm">
                Open Forecast Engine
              </Button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore 3-scenario performance simulations (Conservative, Balanced, Optimistic) and break-even acquisition horizons.
            </p>
            <div className="pt-2">
              <Button to="/dashboard/forecast" variant="gradient" size="sm">
                Model Financial Forecast
              </Button>
            </div>
          </Card>
        )}

        {/* TAB 10: REPORTS */}
        {activeTab === 'reports' && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                <FileText className="w-4 h-4 text-sparkline-blue" />
                <span>Generated Executive Dossiers ({reports.length})</span>
              </h2>
              <Button to="/dashboard/reports" variant="outline" size="sm">
                Reports Command Center
              </Button>
            </div>

            {reports.length > 0 ? (
              <div className="space-y-2">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{rep.configuration.title}</span>
                      <span className="text-[11px] text-slate-500">{rep.templateName} • v{rep.version}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => reportService.printReportToPdf(rep)}
                        className="text-xs"
                      >
                        Print PDF
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => reportService.exportReportToPdfFile(rep)}
                        className="text-xs"
                      >
                        Download PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 space-y-2">
                <p>No reports generated yet for this project.</p>
                <Button to="/dashboard/reports" variant="gradient" size="sm">
                  Build Report Dossier
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-dropdown border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 pb-3 border-b border-slate-100">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sparkline-midnight text-sm">Delete Marketing Workspace</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This action will permanently delete <strong className="text-slate-900">{business.brandName}</strong>. 
              All saved data and configurations will be removed.
            </p>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              To confirm deletion, type <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-rose-200 select-all">{business.brandName}</strong> below:
            </div>

            <input
              type="text"
              placeholder="Type brand name here to confirm..."
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              autoFocus
            />

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 text-white"
                onClick={handleConfirmDelete}
                disabled={deleteInput.trim() !== business.brandName.trim()}
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
