import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/components/common/Feedback';
import { projectService } from '@/services/project.service';
import { unifiedStrategyService } from '@/services/unified-strategy.service';
import { MarketingProject } from '@/types/project';
import {
  UnifiedMarketingStrategy,
  StrategyModeType,
  TaskStatus,
  TaskPeriod,
  StrategyKPI,
} from '@/types/unified-strategy';
import {
  Sparkles,
  TrendingUp,
  BarChart2,
  Target,
  ShieldAlert,
  Globe,
  Building2,
  Copy,
  Printer,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Calendar,
  CheckSquare,
  Layers,
  Compass,
  Zap,
  Users,
  Award,
  DollarSign,
  ChevronRight,
  HelpCircle,
  Info,
  Check,
} from 'lucide-react';

export const MarketingStrategyPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedStrategy, setSelectedStrategy] = useState<UnifiedMarketingStrategy | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<StrategyModeType>('balanced');
  const [activeMainTab, setActiveMainTab] = useState<
    'action_plan' | 'executive_brand' | 'channels_content' | 'kpis' | 'risks_evidence'
  >('action_plan');

  // Action plan filters
  const [periodFilter, setPeriodFilter] = useState<'all' | TaskPeriod>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // KPI category filter
  const [kpiCategoryFilter, setKpiCategoryFilter] = useState<string>('all');

  // Editable title state
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>('');

  // Load projects on mount
  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);

    const paramProjId = searchParams.get('projectId');
    if (paramProjId && list.some((p) => p.id === paramProjId)) {
      setSelectedProjectId(paramProjId);
    } else if (list.length > 0 && list[0]) {
      setSelectedProjectId(list[0].id);
    }
  }, [searchParams]);

  // Load strategy when selected project changes
  useEffect(() => {
    if (!selectedProjectId) {
      setSelectedStrategy(null);
      return;
    }

    const latest = unifiedStrategyService.getLatestStrategy(selectedProjectId);
    if (latest) {
      setSelectedStrategy(latest);
      setEditedTitle(latest.strategyTitle);
    } else {
      setSelectedStrategy(null);
    }
  }, [selectedProjectId]);

  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  // Recalculate audit for current project
  const currentAudit = useMemo(() => {
    if (!currentProject) return null;
    return unifiedStrategyService.calculateCompletenessAudit(currentProject);
  }, [currentProject]);

  // Strategy version history
  const projectStrategies = useMemo(() => {
    if (!selectedProjectId) return [];
    return unifiedStrategyService.getStrategies(selectedProjectId);
  }, [selectedProjectId, selectedStrategy]);

  // Handle switching project
  const handleProjectChange = (newProjectId: string) => {
    setSelectedProjectId(newProjectId);
    setSearchParams({ projectId: newProjectId });
  };

  // Handle generating / regenerating strategy
  const handleGenerateStrategy = async () => {
    if (!currentProject) {
      addToast({
        type: 'warning',
        title: 'Project Required',
        message: 'Please select a valid marketing project to generate a strategy.',
      });
      return;
    }

    setIsGenerating(true);
    addToast({
      type: 'info',
      title: 'Synthesizing Strategy',
      message: 'Synthesizing audience, market research, and competitor data into an action plan...',
    });

    try {
      const generated = await unifiedStrategyService.generateUnifiedStrategy(
        currentProject,
        { focusMode: activeMode }
      );
      setSelectedStrategy(generated);
      setEditedTitle(generated.strategyTitle);
      addToast({
        type: 'success',
        title: 'Strategy Generated',
        message: `Marketing strategy created successfully for ${currentProject.business?.brandName || 'your business'}.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: err instanceof Error ? err.message : 'Failed to generate strategy.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle updating task status
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    if (!selectedStrategy) return;

    unifiedStrategyService.updateTaskStatus(selectedStrategy.id, taskId, newStatus);
    const updated = unifiedStrategyService.getStrategyById(selectedStrategy.id);
    if (updated) {
      setSelectedStrategy({ ...updated });
    }

    addToast({
      type: 'success',
      title: 'Task Status Updated',
      message: `Task status marked as ${newStatus.replace('_', ' ')}.`,
    });
  };

  // Handle saving edited title
  const handleSaveTitle = () => {
    if (!selectedStrategy || !editedTitle.trim()) return;
    unifiedStrategyService.updateStrategyTitle(selectedStrategy.id, editedTitle.trim());
    setSelectedStrategy((prev) => (prev ? { ...prev, strategyTitle: editedTitle.trim() } : null));
    setIsEditingTitle(false);
    addToast({
      type: 'success',
      title: 'Strategy Renamed',
      message: 'Strategy title updated successfully.',
    });
  };

  // Handle deleting strategy
  const handleDeleteStrategy = () => {
    if (!selectedStrategy) return;
    if (window.confirm('Are you sure you want to delete this marketing strategy version?')) {
      unifiedStrategyService.deleteStrategy(selectedStrategy.id);
      const remaining = unifiedStrategyService.getStrategies(selectedProjectId);
      const first = remaining[0];
      if (first) {
        setSelectedStrategy(first);
        setEditedTitle(first.strategyTitle);
      } else {
        setSelectedStrategy(null);
      }
      addToast({
        type: 'info',
        title: 'Strategy Deleted',
        message: 'Strategy version removed.',
      });
    }
  };

  // Copy summary to clipboard
  const handleCopySummary = () => {
    if (!selectedStrategy) return;
    const text = `SPARKLINE MARKETING STRATEGY
Project: ${selectedStrategy.projectName}
Title: ${selectedStrategy.strategyTitle}
Version: ${selectedStrategy.version}

EXECUTIVE SUMMARY:
- Situation: ${selectedStrategy.executiveSummary.businessSituation}
- Objective: ${selectedStrategy.executiveSummary.mainMarketingObjective}
- Biggest Opportunity: ${selectedStrategy.executiveSummary.biggestOpportunity}
- Main Challenge: ${selectedStrategy.executiveSummary.mainChallenge}
- Direction: ${selectedStrategy.executiveSummary.recommendedStrategicDirection}

BRAND POSITIONING:
- Positioning: ${selectedStrategy.brandPositioning.recommendedPositioning}
- USP: ${selectedStrategy.brandPositioning.uniqueSellingProposition}
- Core Message: "${selectedStrategy.brandPositioning.coreBrandMessage}"

ACTION PLAN (${selectedStrategy.actionPlan.length} Tasks):
${selectedStrategy.actionPlan
  .map(
    (t, i) =>
      `${i + 1}. [${t.status.toUpperCase()}] ${t.title} (${t.period}, Priority: ${t.priority}) - Role: ${t.responsibleRole}`
  )
  .join('\n')}
`;
    navigator.clipboard.writeText(text);
    addToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'Strategy summary and action plan copied to clipboard.',
    });
  };

  // Print strategy
  const handlePrint = () => {
    window.print();
    addToast({
      type: 'info',
      title: 'Print View Opened',
      message: 'Ready to print or save as PDF.',
    });
  };

  // Task metrics calculation
  const taskProgress = useMemo(() => {
    if (!selectedStrategy?.actionPlan?.length) return { completed: 0, total: 0, pct: 0 };
    const total = selectedStrategy.actionPlan.length;
    const completed = selectedStrategy.actionPlan.filter((t) => t.status === 'completed').length;
    return {
      completed,
      total,
      pct: Math.round((completed / total) * 100),
    };
  }, [selectedStrategy]);

  // Filtered action plan tasks
  const filteredTasks = useMemo(() => {
    if (!selectedStrategy?.actionPlan) return [];
    return selectedStrategy.actionPlan.filter((task) => {
      if (periodFilter !== 'all' && task.period !== periodFilter) return false;
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      return true;
    });
  }, [selectedStrategy, periodFilter, priorityFilter, statusFilter]);

  // Filtered KPIs
  const filteredKPIs = useMemo(() => {
    if (!selectedStrategy?.kpiFramework) return [];
    if (kpiCategoryFilter === 'all') return selectedStrategy.kpiFramework;
    return selectedStrategy.kpiFramework.filter((k) => k.category === kpiCategoryFilter);
  }, [selectedStrategy, kpiCategoryFilter]);

  const activeModePlan = useMemo(() => {
    if (!selectedStrategy?.modes) return null;
    return selectedStrategy.modes[activeMode];
  }, [selectedStrategy, activeMode]);

  return (
    <>
      <SEO
        title="Marketing Strategy Recommendation Engine | Sparkline Marketing"
        description="Combine business insights, audience intelligence, and market research into one prioritized marketing action plan."
      />

      <div className="space-y-8 pb-16 print:p-0 print:space-y-4">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-200 dark:border-navy-700/60 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="blue" size="sm" className="font-semibold">
                Phase 11 Unified Strategy Engine
              </Badge>
              {selectedStrategy && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Last updated {new Date(selectedStrategy.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              Your Business Deserves a Smarter Marketing Strategy.
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl">
              Combine business insights, audience intelligence, and market research into one prioritized marketing action plan.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 print:hidden">
            {selectedStrategy && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopySummary}
                  leftIcon={<Copy className="w-4 h-4" />}
                >
                  Copy Summary
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  leftIcon={<Printer className="w-4 h-4" />}
                >
                  Print / PDF
                </Button>
              </>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerateStrategy}
              disabled={isGenerating || !currentProject}
              leftIcon={
                isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )
              }
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20"
            >
              {isGenerating
                ? 'Synthesizing...'
                : selectedStrategy
                ? 'Regenerate Strategy'
                : 'Generate Strategy'}
            </Button>
          </div>
        </div>

        {/* Project Selector & Strategy Meta Bar */}
        <Card className="p-4 sm:p-5 border-gray-200 dark:border-navy-700/80 bg-white dark:bg-navy-800/90 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-full sm:w-64">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Active Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-900 border border-gray-300 dark:border-navy-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {projects.length === 0 ? (
                    <option value="">No projects available</option>
                  ) : (
                    projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.business?.brandName || 'Untitled Project'} ({p.business?.industry || 'General'})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {currentProject && (
                <div className="flex flex-wrap items-center gap-2 pt-5 sm:pt-0">
                  <Badge variant="neutral" size="sm" className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    <span>{currentProject.business?.industry || 'Commercial Market'}</span>
                  </Badge>
                  <Badge variant="neutral" size="sm" className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                    <span>{currentProject.business?.businessType || 'DTC / B2B'}</span>
                  </Badge>
                  <Badge variant="neutral" size="sm" className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {currentProject.marketing?.monthlyBudget
                        ? `$${currentProject.marketing.monthlyBudget.toLocaleString()}/mo Budget`
                        : 'Budget: Unspecified'}
                    </span>
                  </Badge>
                </div>
              )}
            </div>

            {selectedStrategy && (
              <div className="flex items-center gap-3 self-end lg:self-center">
                {projectStrategies.length > 1 && (
                  <div className="text-right">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Version
                    </label>
                    <select
                      value={selectedStrategy.id}
                      onChange={(e) => {
                        const strat = projectStrategies.find((s) => s.id === e.target.value);
                        if (strat) {
                          setSelectedStrategy(strat);
                          setEditedTitle(strat.strategyTitle);
                        }
                      }}
                      className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-navy-900 border border-gray-300 dark:border-navy-700 rounded-lg text-gray-900 dark:text-white"
                    >
                      {projectStrategies.map((s) => (
                        <option key={s.id} value={s.id}>
                          v{s.version} — {new Date(s.createdAt).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={handleDeleteStrategy}
                  title="Delete this strategy version"
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors print:hidden"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Title editor */}
          {selectedStrategy && (
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-navy-700/60 flex items-center justify-between">
              {isEditingTitle ? (
                <div className="flex items-center gap-2 w-full max-w-xl">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm bg-gray-50 dark:bg-navy-900 border border-blue-500 rounded-lg text-navy-900 dark:text-white focus:outline-none"
                    placeholder="Enter strategy title..."
                  />
                  <Button size="sm" variant="primary" onClick={handleSaveTitle}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditedTitle(selectedStrategy.strategyTitle);
                      setIsEditingTitle(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-navy-900 dark:text-white">
                    {selectedStrategy.strategyTitle}
                  </h2>
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="p-1 text-gray-400 hover:text-blue-500 rounded transition-colors print:hidden"
                    title="Rename strategy"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono hidden sm:inline-block">
                Engine: {selectedStrategy.modelIdentifier}
              </span>
            </div>
          )}
        </Card>

        {/* Data Completeness & Module Contribution Audit Card */}
        {currentAudit && (
          <Card className="p-5 border-gray-200 dark:border-navy-700/80 bg-white dark:bg-navy-800/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    currentAudit.overallScore >= 80
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {currentAudit.overallScore}%
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2">
                    <span>Data Completeness & Module Synthesis Audit</span>
                    <Badge
                      variant={currentAudit.overallScore >= 80 ? 'cyan' : 'orange'}
                      size="sm"
                    >
                      {currentAudit.overallScore >= 80 ? 'Robust Evidence' : 'Partial Evidence'}
                    </Badge>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Transparent evaluation of contributing modules. No false certainty is generated from missing data.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                    currentAudit.modules.businessProfile
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-navy-900 dark:text-gray-400'
                  }`}
                >
                  {currentAudit.modules.businessProfile ? '✓ Business Profile' : '○ Business Profile'}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                    currentAudit.modules.productAnalysis
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-navy-900 dark:text-gray-400'
                  }`}
                >
                  {currentAudit.modules.productAnalysis ? '✓ Products' : '○ Products'}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                    currentAudit.modules.audienceIntelligence
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-navy-900 dark:text-gray-400'
                  }`}
                >
                  {currentAudit.modules.audienceIntelligence ? '✓ Audience' : '○ Audience'}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                    currentAudit.modules.marketResearch
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-navy-900 dark:text-gray-400'
                  }`}
                >
                  {currentAudit.modules.marketResearch ? '✓ Market Research' : '○ Market Research'}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                    currentAudit.modules.competitorAnalysis
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-navy-900 dark:text-gray-400'
                  }`}
                >
                  {currentAudit.modules.competitorAnalysis ? '✓ Competitors' : '○ Competitors'}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                    currentAudit.modules.budgetSpecified
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-navy-900 dark:text-gray-400'
                  }`}
                >
                  {currentAudit.modules.budgetSpecified ? '✓ Budget' : '○ Budget'}
                </span>
              </div>
            </div>

            {/* Contributing & Missing Modules details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-gray-100 dark:border-navy-700/60">
              <div className="space-y-1.5">
                <span className="font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Contributing Modules:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentAudit.contributingModules.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-emerald-50/70 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 font-medium"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {currentAudit.missingModules.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Missing or Incomplete Data:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentAudit.missingModules.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-amber-50/80 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300 font-medium"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Unverified assumptions alert */}
            {currentAudit.unverifiedAssumptions.length > 0 && (
              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-navy-900/60 border border-gray-200 dark:border-navy-700/60 text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-navy-900 dark:text-white">
                    Operational Assumptions & Limitations:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {currentAudit.unverifiedAssumptions.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* If no strategy exists yet */}
        {!selectedStrategy && (
          <Card className="p-12 text-center border-dashed border-2 border-gray-300 dark:border-navy-700 bg-white/50 dark:bg-navy-800/50 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-navy-900 dark:text-white">
                No Marketing Strategy Generated Yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click below to synthesize business information, audience segments, and competitor research into a unified marketing action plan.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleGenerateStrategy}
              disabled={isGenerating || !currentProject}
              leftIcon={
                isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )
              }
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20"
            >
              {isGenerating ? 'Synthesizing Strategic Blueprint...' : 'Generate Marketing Strategy'}
            </Button>
          </Card>
        )}

        {/* Active Strategy Presentation */}
        {selectedStrategy && (
          <div className="space-y-8">
            {/* Growth Mode Selector Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-blue-500" />
                    <span>Select Growth Mode & Risk Appetite</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Switch between three resource and pacing scenarios to align with current runway and capital constraints.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['lean', 'balanced', 'accelerated'] as StrategyModeType[]).map((modeKey) => {
                  const mode = selectedStrategy.modes[modeKey];
                  const isActive = activeMode === modeKey;

                  return (
                    <button
                      key={modeKey}
                      type="button"
                      onClick={() => setActiveMode(modeKey)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        isActive
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/20 shadow-sm'
                          : 'border-gray-200 dark:border-navy-700/80 bg-white dark:bg-navy-800 hover:border-gray-300 dark:hover:border-navy-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={
                            modeKey === 'lean'
                              ? 'slate'
                              : modeKey === 'balanced'
                              ? 'blue'
                              : 'orange'
                          }
                          size="sm"
                          className="font-bold uppercase tracking-wider"
                        >
                          {mode.name}
                        </Badge>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {mode.budgetConsiderations.includes('$')
                            ? mode.budgetConsiderations.split(';')[0]
                            : modeKey === 'lean'
                            ? '$2.5k - $3.5k/mo'
                            : modeKey === 'balanced'
                            ? '$8k - $12k/mo'
                            : '$25k+/mo'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-navy-900 dark:text-white mb-1">
                        {mode.tagline}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                        {mode.mainObjective}
                      </p>

                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-navy-700/60 flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          {mode.recommendedChannels.length} Channels
                        </span>
                        <span
                          className={`font-semibold flex items-center gap-1 ${
                            isActive
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {isActive ? 'Active Plan' : 'Select'}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Mode Deep Dive Card */}
              {activeModePlan && (
                <Card className="p-5 border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-navy-800/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 dark:border-navy-700/60 pb-3">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Active Strategic Mode Deep-Dive
                      </span>
                      <h3 className="text-base font-bold text-navy-900 dark:text-white">
                        {activeModePlan.name}: {activeModePlan.tagline}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {activeModePlan.recommendedChannels.map((ch, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-xs font-medium rounded-full bg-white dark:bg-navy-900 border border-blue-200 dark:border-navy-700 text-navy-800 dark:text-blue-200"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {activeModePlan.mainObjective}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                    <div className="p-3 rounded-lg bg-white dark:bg-navy-900/80 border border-gray-200 dark:border-navy-700/80 space-y-1.5">
                      <span className="font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-500" />
                        Key Advantages
                      </span>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                        {activeModePlan.mainAdvantages.map((adv, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-emerald-500">•</span>
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-white dark:bg-navy-900/80 border border-gray-200 dark:border-navy-700/80 space-y-1.5">
                      <span className="font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Primary Risks & Tradeoffs
                      </span>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                        {activeModePlan.mainRisks.map((risk, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-amber-500">•</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-white dark:bg-navy-900/80 border border-gray-200 dark:border-navy-700/80 space-y-1.5">
                      <span className="font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-blue-500" />
                        Success Milestones
                      </span>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                        {activeModePlan.successCriteria.map((crit, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-blue-500">•</span>
                            <span>{crit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Navigation Tabs for Strategy Core Sections */}
            <div className="border-b border-gray-200 dark:border-navy-700/80 print:hidden">
              <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-px" aria-label="Strategy Navigation">
                <button
                  type="button"
                  onClick={() => setActiveMainTab('action_plan')}
                  className={`py-3 px-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeMainTab === 'action_plan'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Prioritized Action Plan</span>
                  <Badge variant="blue" size="sm" className="ml-1">
                    {taskProgress.completed}/{taskProgress.total}
                  </Badge>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMainTab('executive_brand')}
                  className={`py-3 px-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeMainTab === 'executive_brand'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>Executive & Brand Positioning</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMainTab('channels_content')}
                  className={`py-3 px-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeMainTab === 'channels_content'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Channels, Content & Acquisition</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMainTab('kpis')}
                  className={`py-3 px-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeMainTab === 'kpis'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>KPI Measurement Framework</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMainTab('risks_evidence')}
                  className={`py-3 px-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeMainTab === 'risks_evidence'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Risks & Cross-Engine Evidence</span>
                </button>
              </nav>
            </div>

            {/* TAB 1: ACTION PLAN (Interactive Execution Matrix) */}
            {activeMainTab === 'action_plan' && (
              <div className="space-y-6">
                {/* Progress banner */}
                <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/40 dark:from-navy-800 dark:to-navy-900 border-blue-200/80 dark:border-navy-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Execution Velocity
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        • {taskProgress.completed} of {taskProgress.total} Tasks Completed ({taskProgress.pct}%)
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-navy-900 dark:text-white">
                      Prioritized Implementation Roadmap
                    </h3>
                  </div>

                  <div className="w-full sm:w-64 space-y-1.5">
                    <div className="w-full bg-gray-200 dark:bg-navy-950 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${taskProgress.pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                      <span>Kickoff</span>
                      <span>{taskProgress.pct}% Done</span>
                    </div>
                  </div>
                </Card>

                {/* Filter controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-navy-800 p-3 rounded-xl border border-gray-200 dark:border-navy-700/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Period:
                    </span>
                    {(
                      [
                        ['all', 'All Periods'],
                        ['immediate', 'Immediate (Weeks 1-2)'],
                        ['short_term', 'Short-Term (Weeks 3-6)'],
                        ['medium_term', 'Medium-Term (Months 2-3)'],
                        ['long_term', 'Long-Term (Months 4-6)'],
                      ] as [string, string][]
                    ).map(([pKey, pLabel]) => (
                      <button
                        key={pKey}
                        onClick={() => setPeriodFilter(pKey as any)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                          periodFilter === pKey
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-navy-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {pLabel}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="px-2.5 py-1 text-xs bg-gray-50 dark:bg-navy-900 border border-gray-300 dark:border-navy-700 rounded-lg text-gray-800 dark:text-gray-200"
                    >
                      <option value="all">All Priorities</option>
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-2.5 py-1 text-xs bg-gray-50 dark:bg-navy-900 border border-gray-300 dark:border-navy-700 rounded-lg text-gray-800 dark:text-gray-200"
                    >
                      <option value="all">All Statuses</option>
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                  </div>
                </div>

                {/* Tasks list */}
                <div className="space-y-3">
                  {filteredTasks.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700">
                      No marketing tasks match the current filter criteria.
                    </div>
                  ) : (
                    filteredTasks.map((task) => {
                      const isCompleted = task.status === 'completed';

                      return (
                        <div
                          key={task.id}
                          className={`p-4 sm:p-5 rounded-xl border transition-all ${
                            isCompleted
                              ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40 opacity-80'
                              : 'bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700/80 shadow-sm'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                  variant={
                                    task.priority === 'High'
                                      ? 'magenta'
                                      : task.priority === 'Medium'
                                      ? 'orange'
                                      : 'slate'
                                  }
                                  size="sm"
                                  className="font-bold uppercase tracking-wider"
                                >
                                  {task.priority} Priority
                                </Badge>

                                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-navy-900 font-medium text-gray-600 dark:text-gray-300">
                                  {task.period === 'immediate'
                                    ? 'Weeks 1–2'
                                    : task.period === 'short_term'
                                    ? 'Weeks 3–6'
                                    : task.period === 'medium_term'
                                    ? 'Months 2–3'
                                    : 'Months 4–6'}
                                </span>

                                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-navy-900 text-gray-500 dark:text-gray-400">
                                  Effort: {task.estimatedEffort}
                                </span>

                                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                  Role: {task.responsibleRole}
                                </span>
                              </div>

                              <h4
                                className={`text-base font-bold ${
                                  isCompleted
                                    ? 'line-through text-gray-500 dark:text-gray-400'
                                    : 'text-navy-900 dark:text-white'
                                }`}
                              >
                                {task.title}
                              </h4>

                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                {task.description}
                              </p>

                              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-navy-900/60 text-xs text-gray-600 dark:text-gray-300 space-y-1">
                                <div className="flex items-start gap-1.5">
                                  <span className="font-semibold text-navy-900 dark:text-white shrink-0">
                                    Strategic Rationale:
                                  </span>
                                  <span>{task.reasonForRecommendation}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-gray-500 dark:text-gray-400">
                                  <span>
                                    <strong>Target Metric:</strong> {task.successMetric}
                                  </span>
                                  <span>
                                    <strong>Prerequisite:</strong> {task.dependencyOnOtherTasks}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Status toggle selector */}
                            <div className="shrink-0 flex flex-col gap-1.5 pt-2 lg:pt-0">
                              <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 text-right hidden lg:block">
                                Status
                              </span>
                              <div className="flex items-center gap-1 bg-gray-100 dark:bg-navy-900 p-1 rounded-lg">
                                {(
                                  [
                                    ['not_started', 'Not Started'],
                                    ['in_progress', 'In Progress'],
                                    ['completed', 'Done'],
                                    ['on_hold', 'On Hold'],
                                  ] as [TaskStatus, string][]
                                ).map(([stKey, stLabel]) => (
                                  <button
                                    key={stKey}
                                    type="button"
                                    onClick={() => handleUpdateTaskStatus(task.id, stKey)}
                                    className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                                      task.status === stKey
                                        ? stKey === 'completed'
                                          ? 'bg-emerald-600 text-white shadow-sm'
                                          : stKey === 'in_progress'
                                          ? 'bg-blue-600 text-white shadow-sm'
                                          : stKey === 'on_hold'
                                          ? 'bg-amber-600 text-white shadow-sm'
                                          : 'bg-gray-700 text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-navy-900 dark:hover:text-white'
                                    }`}
                                  >
                                    {stLabel}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: EXECUTIVE & BRAND POSITIONING */}
            {activeMainTab === 'executive_brand' && (
              <div className="space-y-6">
                {/* Executive Summary Cards */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>Executive Summary & Situation Diagnosis</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700/80 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Commercial Situation
                      </span>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {selectedStrategy.executiveSummary.businessSituation}
                      </p>
                    </Card>

                    <Card className="p-4 bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700/80 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Primary Marketing Objective
                      </span>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {selectedStrategy.executiveSummary.mainMarketingObjective}
                      </p>
                    </Card>

                    <Card className="p-4 bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Highest Leverage Opportunity
                      </span>
                      <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                        {selectedStrategy.executiveSummary.biggestOpportunity}
                      </p>
                    </Card>

                    <Card className="p-4 bg-amber-50/30 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" /> Primary Obstacle / Challenge
                      </span>
                      <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                        {selectedStrategy.executiveSummary.mainChallenge}
                      </p>
                    </Card>
                  </div>

                  <Card className="p-4 bg-blue-50/20 dark:bg-navy-800 border-blue-200 dark:border-blue-900/50 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Recommended Strategic Direction
                    </span>
                    <p className="text-sm font-medium text-navy-900 dark:text-white leading-relaxed">
                      {selectedStrategy.executiveSummary.recommendedStrategicDirection}
                    </p>
                  </Card>
                </div>

                {/* Brand Positioning */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-navy-700/80">
                  <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span>Brand Positioning & Market Differentiation</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700/80 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Recommended Positioning
                      </span>
                      <p className="text-sm font-semibold text-navy-900 dark:text-white leading-relaxed">
                        {selectedStrategy.brandPositioning.recommendedPositioning}
                      </p>
                    </Card>

                    <Card className="p-4 bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700/80 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Unique Selling Proposition (USP)
                      </span>
                      <p className="text-sm font-semibold text-navy-900 dark:text-white leading-relaxed">
                        {selectedStrategy.brandPositioning.uniqueSellingProposition}
                      </p>
                    </Card>

                    <Card className="p-4 bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700/80 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Core Brand Hook & Message
                      </span>
                      <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 italic">
                        "{selectedStrategy.brandPositioning.coreBrandMessage}"
                      </p>
                    </Card>

                    <Card className="p-4 bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700/80 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Competitive Differentiation
                      </span>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {selectedStrategy.brandPositioning.competitiveDifferentiation}
                      </p>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Brand Personality Traits
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedStrategy.brandPositioning.brandPersonality.map((trait, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 text-navy-900 dark:text-white"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Tone of Voice
                      </span>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        {selectedStrategy.brandPositioning.toneOfVoice}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Target Audience Strategy */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-navy-700/80">
                  <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>Target Audience & Segment Priorities</span>
                  </h3>

                  <Card className="p-4 bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700/80 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Primary Target Segment
                    </span>
                    <p className="text-sm font-bold text-navy-900 dark:text-white">
                      {selectedStrategy.targetAudienceStrategy.primarySegment}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedStrategy.targetAudienceStrategy.secondarySegments.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-navy-900 text-gray-600 dark:text-gray-300"
                        >
                          Secondary: {s}
                        </span>
                      ))}
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 space-y-2">
                      <span className="font-bold text-navy-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 text-red-600 dark:text-red-400">
                        Acute Customer Pain Points
                      </span>
                      <ul className="space-y-1.5 text-gray-600 dark:text-gray-300">
                        {selectedStrategy.targetAudienceStrategy.customerPainPoints.map((p, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-red-500">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 space-y-2">
                      <span className="font-bold text-navy-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        Purchasing Motivations
                      </span>
                      <ul className="space-y-1.5 text-gray-600 dark:text-gray-300">
                        {selectedStrategy.targetAudienceStrategy.purchaseMotivations.map((m, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500">•</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 space-y-2">
                      <span className="font-bold text-navy-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                        Recommended Messaging Angles
                      </span>
                      <ul className="space-y-1.5 text-gray-600 dark:text-gray-300">
                        {selectedStrategy.targetAudienceStrategy.recommendedMessaging.map((msg, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-blue-500">•</span>
                            <span>{msg}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CHANNELS, CONTENT & ACQUISITION */}
            {activeMainTab === 'channels_content' && (
              <div className="space-y-6">
                {/* Marketing Channels */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-500" />
                        <span>Prioritized Marketing Channels</span>
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Channels are rigorously prioritized based on target audience alignment and funnel role.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedStrategy.channels.map((ch, idx) => (
                      <Card
                        key={idx}
                        className="p-4 sm:p-5 bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700/80 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-navy-900 dark:text-white">
                              {ch.channelName}
                            </h4>
                            {ch.isPrioritized && (
                              <Badge variant="blue" size="sm">
                                Core
                              </Badge>
                            )}
                          </div>
                          <Badge variant="neutral" size="sm">
                            {ch.funnelStage}
                          </Badge>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          <strong>Strategic Role:</strong> {ch.strategicPurpose}
                        </p>

                        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-navy-900/60 text-xs space-y-1 text-gray-600 dark:text-gray-300">
                          <div>
                            <strong>Recommended Activity:</strong> {ch.recommendedActivity}
                          </div>
                          <div>
                            <strong>Primary KPI:</strong> {ch.suggestedKpis.join(', ')}
                          </div>
                          <div>
                            <strong>Required Resources:</strong> {ch.requiredResources}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-[11px] pt-1">
                            <em>Limitation:</em> {ch.potentialLimitations}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Content Strategy */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-navy-700/80">
                  <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-blue-500" />
                    <span>Content Strategy & Editorial Pillars</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    {selectedStrategy.contentStrategy.contentPillars.map((pillar, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 space-y-1"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          Pillar {i + 1}
                        </span>
                        <h5 className="font-bold text-navy-900 dark:text-white">{pillar}</h5>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 space-y-2">
                      <span className="font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                        Educational Themes
                      </span>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                        {selectedStrategy.contentStrategy.educationalContent.map((item, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-blue-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 space-y-2">
                      <span className="font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                        Trust-Building Proof
                      </span>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                        {selectedStrategy.contentStrategy.trustBuildingContent.map((item, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-emerald-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 space-y-2">
                      <span className="font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                        Publishing Cadence & Formats
                      </span>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        {selectedStrategy.contentStrategy.recommendedPublishingApproach}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {selectedStrategy.contentStrategy.contentFormats.map((f, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-[11px] rounded bg-gray-100 dark:bg-navy-900 text-gray-600 dark:text-gray-300"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Acquisition & Retention */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-navy-700/80">
                  <Card className="p-5 bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700/80 space-y-3">
                    <h3 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Customer Acquisition & Conversion Strategy</span>
                    </h3>
                    <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                      <div>
                        <strong>Offer Strategy:</strong> {selectedStrategy.customerAcquisition.offerStrategy}
                      </div>
                      <div>
                        <strong>Conversion Focus:</strong>{' '}
                        {selectedStrategy.customerAcquisition.conversionImprovements.join('; ')}
                      </div>
                      <div>
                        <strong>Landing Page Priorities:</strong>{' '}
                        {selectedStrategy.customerAcquisition.landingPageRecommendations.join('; ')}
                      </div>
                      <div>
                        <strong>Retargeting Approach:</strong>{' '}
                        {selectedStrategy.customerAcquisition.retargetingOpportunities.join('; ')}
                      </div>
                    </div>
                  </Card>

                  <Card className="p-5 bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700/80 space-y-3">
                    <h3 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-emerald-500" />
                      <span>Customer Retention & Lifetime Value</span>
                    </h3>
                    <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                      <div>
                        <strong>Retention Priorities:</strong>{' '}
                        {selectedStrategy.customerRetention.customerRelationshipActivities.join('; ')}
                      </div>
                      <div>
                        <strong>Email Automation Flows:</strong>{' '}
                        {selectedStrategy.customerRetention.emailOrMessagingOpportunities.join('; ')}
                      </div>
                      <div>
                        <strong>Repeat Purchase & Loyalty:</strong>{' '}
                        {selectedStrategy.customerRetention.repeatPurchaseOpportunities.join('; ')}
                      </div>
                      <div>
                        <strong>Feedback Strategy:</strong>{' '}
                        {selectedStrategy.customerRetention.customerFeedbackStrategy}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* TAB 4: KPI MEASUREMENT FRAMEWORK */}
            {activeMainTab === 'kpis' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-blue-500" />
                      <span>Marketing KPI Measurement Framework</span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Each KPI includes standard mathematical formula, strategic rationale, and data sources.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {(['all', 'Acquisition', 'Revenue', 'Retention', 'Awareness'] as string[]).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setKpiCategoryFilter(cat)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                          kpiCategoryFilter === cat
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-navy-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {cat === 'all' ? 'All Metrics' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredKPIs.map((kpi: StrategyKPI) => (
                    <Card
                      key={kpi.id}
                      className="p-4 sm:p-5 bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-navy-900 dark:text-white">
                          {kpi.metricName}
                        </h4>
                        <Badge variant="blue" size="sm">
                          {kpi.category}
                        </Badge>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-300">{kpi.definition}</p>

                      <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 block">
                          Formula
                        </span>
                        <code className="text-xs font-mono text-blue-600 dark:text-blue-400 block font-semibold">
                          {kpi.formula}
                        </code>
                      </div>

                      <div className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
                        <div>
                          <strong>Why it matters:</strong> {kpi.whyItMatters}
                        </div>
                        <div>
                          <strong>Cadence:</strong> {kpi.recommendedMeasurementFrequency} •{' '}
                          <strong>Data:</strong> {kpi.dataRequired}
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                          Benchmark / Target: {kpi.benchmarkRange}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: RISKS & CROSS-ENGINE EVIDENCE */}
            {activeMainTab === 'risks_evidence' && (
              <div className="space-y-6">
                {/* Strategic Risks & Mitigations */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    <span>Strategic Vulnerabilities & Mitigation Plans</span>
                  </h3>

                  <div className="space-y-3">
                    {selectedStrategy.risksAndAssumptions.risks.map((risk) => (
                      <Card
                        key={risk.id}
                        className="p-4 bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={risk.severity === 'High' ? 'magenta' : 'orange'}
                              size="sm"
                            >
                              Severity: {risk.severity}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              Likelihood: {risk.likelihood}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-navy-900 dark:text-white">
                            {risk.risk}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            <strong>Mitigation:</strong> {risk.mitigation}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Assumptions and Limitations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-navy-700/80">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-navy-900 dark:text-white flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-blue-500" /> Key Commercial Assumptions
                    </span>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                      {selectedStrategy.risksAndAssumptions.assumptions.map((a, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-500">•</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-navy-900 dark:text-white flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Methodological Limitations
                    </span>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                      {selectedStrategy.risksAndAssumptions.limitations.map((l, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500">•</span>
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Supporting Cross-Engine Evidence References */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-navy-700/80">
                  <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>Supporting Research & Cross-Engine Synthesis Evidence</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Recommendations are synthesized from real findings across your Audience, Market Research, and Competitor engines.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {selectedStrategy.supportingResearchReferences.map((ref, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {ref.sourceModule}
                          </span>
                          <Badge variant="cyan" size="sm">
                            Confidence: {ref.confidence}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{ref.findingSummary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
