import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/components/common/Feedback';
import { projectService } from '@/services/project.service';
import { budgetService } from '@/services/budget.service';
import { formatCurrency } from '@/lib/utils';
import { MarketingProject } from '@/types/project';
import {
  MarketingBudgetPlan,
  BudgetGroup,
  BudgetPlanApproach,
  BudgetFrequency,
  BudgetRiskPreference,
  BudgetInputSnapshot,
} from '@/types/budget';
import {
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Sliders,
  Plus,
  Trash2,
  Copy,
  Printer,
  RotateCcw,
  Save,
  ShieldAlert,
  Check,
  Zap,
  Target,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

const GROUP_COLORS: Record<BudgetGroup, string> = {
  'Advertising Spend': '#2563EB', // Sparkline Blue
  'Content and Creative': '#7C3AED', // Sparkline Purple
  'Marketing Operations': '#06B6D4', // Sparkline Cyan
  'External Services': '#D946EF', // Sparkline Magenta
  'Testing and Reserve': '#F97316', // Sparkline Orange
};

const CATEGORY_PALETTE = [
  '#2563EB',
  '#7C3AED',
  '#06B6D4',
  '#D946EF',
  '#F97316',
  '#10B981',
  '#6366F1',
  '#EC4899',
  '#14B8A6',
  '#8B5CF6',
  '#F59E0B',
  '#3B82F6',
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)' },
];

const FREQUENCIES: BudgetFrequency[] = [
  'Monthly',
  'Quarterly',
  'Campaign',
  'Weekly',
  'Daily',
];

export const MarketingBudgetPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [currentPlan, setCurrentPlan] = useState<MarketingBudgetPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTabApproach, setActiveTabApproach] = useState<BudgetPlanApproach>('balanced');
  const [showTuningDrawer, setShowTuningDrawer] = useState<boolean>(false);
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  const [filterGroup, setFilterGroup] = useState<string>('All');
  const [copiedBreakdown, setCopiedBreakdown] = useState<boolean>(false);

  // New Category Form State
  const [customCategoryName, setCustomCategoryName] = useState<string>('');
  const [customCategoryGroup, setCustomCategoryGroup] = useState<BudgetGroup>('Advertising Spend');
  const [customCategoryPercentage, setCustomCategoryPercentage] = useState<number>(5);
  const [customCategoryPurpose, setCustomCategoryPurpose] = useState<string>('');
  const [customCategoryKpi, setCustomCategoryKpi] = useState<string>('Target CPA / CAC');

  // Input snapshot tuning state
  const [tuningBudget, setTuningBudget] = useState<number>(8000);
  const [tuningCurrency, setTuningCurrency] = useState<string>('USD');
  const [tuningFrequency, setTuningFrequency] = useState<BudgetFrequency>('Monthly');
  const [tuningBusinessStage, setTuningBusinessStage] = useState<string>('Growing');
  const [tuningObjective, setTuningObjective] = useState<string>(
    'Lower customer acquisition cost & scale retention'
  );
  const [tuningOrganicPaid, setTuningOrganicPaid] = useState<
    'Organic-Heavy' | 'Balanced Mix' | 'Paid-Heavy'
  >('Balanced Mix');
  const [tuningRiskPref, setTuningRiskPref] = useState<BudgetRiskPreference>('Balanced');
  const [tuningMinTesting, setTuningMinTesting] = useState<number>(10);
  const [tuningStartDate, setTuningStartDate] = useState<string>('2026-11-01');
  const [tuningEndDate, setTuningEndDate] = useState<string>('2027-04-30');

  // Load projects on mount
  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);

    const paramProj = searchParams.get('projectId');
    const defaultId =
      paramProj && list.some((p) => p.id === paramProj)
        ? paramProj
        : list[0]?.id || '';

    setSelectedProjectId(defaultId);
  }, []);

  // When project changes, load latest plan or synthesize fallback
  useEffect(() => {
    if (!selectedProjectId) return;

    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('projectId', selectedProjectId);
      return p;
    });

    const existingPlans = budgetService.getPlans(selectedProjectId);
    if (existingPlans && existingPlans.length > 0 && existingPlans[0]) {
      const latest = existingPlans[0];
      setCurrentPlan(latest);
      syncTuningFromPlan(latest);
    } else {
      // Seed initial plan for project
      const project = projectService.getProjectById(selectedProjectId);
      if (project) {
        initDefaultPlanForProject(project);
      }
    }
  }, [selectedProjectId]);

  const syncTuningFromPlan = (plan: MarketingBudgetPlan) => {
    setTuningBudget(plan.totalBudget);
    setTuningCurrency(plan.currency || 'USD');
    setTuningFrequency(plan.frequency || 'Monthly');
    setActiveTabApproach(plan.selectedApproach || 'balanced');
    if (plan.inputSnapshot) {
      setTuningBusinessStage(plan.inputSnapshot.businessStage || 'Growing');
      setTuningObjective(
        plan.inputSnapshot.primaryObjective || 'Lower CAC & drive profitable conversions'
      );
      setTuningOrganicPaid(plan.inputSnapshot.organicVsPaidPreference || 'Balanced Mix');
      setTuningRiskPref(plan.inputSnapshot.riskPreference || 'Balanced');
      setTuningMinTesting(plan.inputSnapshot.minTestingBudgetPercentage || 10);
      setTuningStartDate(plan.inputSnapshot.startDate || '2026-11-01');
      setTuningEndDate(plan.inputSnapshot.endDate || '2027-04-30');
    }
  };

  const initDefaultPlanForProject = async (project: MarketingProject) => {
    const input: BudgetInputSnapshot = {
      projectId: project.id,
      totalBudget: project.marketing?.monthlyBudget || 8000,
      currency: project.marketing?.budgetCurrency || 'USD',
      frequency: 'Monthly',
      campaignDuration: project.marketing?.campaignDuration || '3-6 months',
      startDate: '2026-11-01',
      endDate: '2027-04-30',
      businessStage: project.business?.operatingStatus || 'Growing',
      primaryObjective:
        project.marketing?.primaryObjective || 'Lower CAC & drive profitable conversions',
      targetAudience: project.audience?.needsAndProblems || 'Core target audience',
      targetMarket: project.audience?.targetLocations?.join(', ') || 'Primary market',
      productOrService: project.products?.[0]?.name || project.business?.brandName || 'Product',
      averageProductPrice: project.products?.[0]?.sellingPrice || 60,
      availableResources: 'In-house team and growth marketing contributors',
      preferredChannels: project.marketing?.currentChannels || ['Meta Ads', 'Google Search'],
      existingChannels: project.marketing?.currentChannels || ['Meta Ads'],
      organicVsPaidPreference: 'Balanced Mix',
      riskPreference: 'Balanced',
      minTestingBudgetPercentage: 10,
    };

    setIsGenerating(true);
    try {
      const plan = await budgetService.generateBudgetPlan(project, input);
      setCurrentPlan(plan);
      syncTuningFromPlan(plan);
    } catch (err) {
      console.error('Failed to init budget plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  const existingProjectPlans = useMemo(() => {
    return selectedProjectId ? budgetService.getPlans(selectedProjectId) : [];
  }, [selectedProjectId, currentPlan]);

  // Handle Generate Budget Plan
  const handleGenerateBudget = async () => {
    if (!activeProject) {
      addToast({
        type: 'warning',
        title: 'Project Required',
        message: 'Please select a project first.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const inputSnapshot: BudgetInputSnapshot = {
        projectId: activeProject.id,
        totalBudget: tuningBudget,
        currency: tuningCurrency,
        frequency: tuningFrequency,
        campaignDuration: activeProject.marketing?.campaignDuration || '6 months',
        startDate: tuningStartDate,
        endDate: tuningEndDate,
        businessStage: tuningBusinessStage,
        primaryObjective: tuningObjective,
        targetAudience: activeProject.audience?.needsAndProblems || 'Core target audience',
        targetMarket: activeProject.audience?.targetLocations?.join(', ') || 'Primary market',
        productOrService:
          activeProject.products?.[0]?.name || activeProject.business?.brandName || 'Product',
        averageProductPrice: activeProject.products?.[0]?.sellingPrice || 60,
        availableResources: 'Hybrid growth marketing resources',
        preferredChannels: activeProject.marketing?.currentChannels || ['Meta Ads', 'Google Search'],
        existingChannels: activeProject.marketing?.currentChannels || ['Meta Ads'],
        organicVsPaidPreference: tuningOrganicPaid,
        riskPreference: tuningRiskPref,
        minTestingBudgetPercentage: tuningMinTesting,
      };

      const newPlan = await budgetService.generateBudgetPlan(activeProject, inputSnapshot);
      setCurrentPlan(newPlan);
      syncTuningFromPlan(newPlan);
      addToast({
        type: 'success',
        title: 'Plan Generated',
        message: 'New Marketing Budget Plan generated successfully.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: 'Failed to generate budget plan. Default plan restored.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Percentage slider change
  const handlePercentageChange = (allocId: string, val: number) => {
    if (!currentPlan) return;
    const updated = budgetService.updateAllocationPercentage(currentPlan, allocId, val);
    setCurrentPlan({ ...updated });
  };

  // Amount direct change
  const handleAmountChange = (allocId: string, val: number) => {
    if (!currentPlan) return;
    const updated = budgetService.updateAllocationAmount(currentPlan, allocId, val);
    setCurrentPlan({ ...updated });
  };

  // Total budget update with proportional allocation
  const handleTotalBudgetChange = (newTotal: number) => {
    setTuningBudget(newTotal);
    if (!currentPlan) return;
    const updated = budgetService.updateTotalBudget(currentPlan, newTotal);
    setCurrentPlan({ ...updated });
  };

  // Remove category
  const handleRemoveCategory = (allocId: string) => {
    if (!currentPlan) return;
    const updated = budgetService.removeCategory(currentPlan, allocId);
    setCurrentPlan({ ...updated });
    addToast({
      type: 'info',
      title: 'Category Removed',
      message: 'Budget category removed.',
    });
  };

  // Restore recommended plan approach
  const handleRestoreApproach = (approach: BudgetPlanApproach) => {
    if (!currentPlan) return;
    const updated = budgetService.restoreRecommendedPlan(currentPlan, approach);
    setCurrentPlan({ ...updated });
    setActiveTabApproach(approach);
    addToast({
      type: 'success',
      title: 'Approach Restored',
      message: `Restored ${updated.plans[approach].name} baseline.`,
    });
  };

  // Apply approach variant to active plan
  const handleApplyVariant = (approach: BudgetPlanApproach) => {
    if (!currentPlan) return;
    const updated = budgetService.restoreRecommendedPlan(currentPlan, approach);
    setCurrentPlan({ ...updated });
    setActiveTabApproach(approach);
    addToast({
      type: 'success',
      title: 'Active Plan Changed',
      message: `Switched active plan to ${updated.plans[approach].name}.`,
    });
  };

  // Save current plan
  const handleSavePlan = () => {
    if (!currentPlan) return;
    currentPlan.updatedAt = new Date().toISOString();
    budgetService.savePlan(currentPlan);
    addToast({
      type: 'success',
      title: 'Plan Saved',
      message: `Budget Plan "${currentPlan.planTitle}" saved.`,
    });
  };

  // Duplicate plan
  const handleDuplicatePlan = () => {
    if (!currentPlan) return;
    const clone = budgetService.duplicatePlan(currentPlan.id);
    if (clone) {
      setCurrentPlan(clone);
      addToast({
        type: 'success',
        title: 'Plan Duplicated',
        message: `Plan duplicated as "${clone.planTitle}".`,
      });
    }
  };

  // Delete plan
  const handleDeletePlan = () => {
    if (!currentPlan) return;
    if (confirm(`Are you sure you want to delete "${currentPlan.planTitle}"?`)) {
      budgetService.deletePlan(currentPlan.id);
      addToast({
        type: 'info',
        title: 'Plan Deleted',
        message: 'Budget plan deleted.',
      });
      const remaining = budgetService.getPlans(selectedProjectId);
      if (remaining.length > 0 && remaining[0]) {
        setCurrentPlan(remaining[0]);
        syncTuningFromPlan(remaining[0]);
      } else if (activeProject) {
        initDefaultPlanForProject(activeProject);
      }
    }
  };

  // Add Custom Category Form Submit
  const handleAddCustomCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPlan) return;
    if (!customCategoryName.trim()) {
      addToast({
        type: 'warning',
        title: 'Missing Name',
        message: 'Please enter a category name.',
      });
      return;
    }

    const updated = budgetService.addCustomCategory(currentPlan, {
      category: customCategoryName.trim(),
      group: customCategoryGroup,
      percentage: customCategoryPercentage,
      purpose: customCategoryPurpose || 'Custom marketing initiative',
      primaryKpi: customCategoryKpi || 'Target CPA / CAC',
    });

    setCurrentPlan({ ...updated });
    setShowAddCustomModal(false);
    setCustomCategoryName('');
    setCustomCategoryPurpose('');
    addToast({
      type: 'success',
      title: 'Category Added',
      message: `Added custom category "${customCategoryName}".`,
    });
  };

  // Distribute unallocated remainder to Testing & Reserve
  const handleAutoBalanceToTesting = () => {
    if (!currentPlan) return;
    const unallocatedPct = currentPlan.activePlan.unallocatedPercentage;
    if (unallocatedPct <= 0.05) return;

    let testAlloc = currentPlan.activePlan.allocations.find(
      (a) => a.group === 'Testing and Reserve'
    );
    if (testAlloc) {
      const newPct = Number((testAlloc.percentage + unallocatedPct).toFixed(1));
      const updated = budgetService.updateAllocationPercentage(
        currentPlan,
        testAlloc.id,
        newPct
      );
      setCurrentPlan({ ...updated });
    } else {
      const updated = budgetService.addCustomCategory(currentPlan, {
        category: 'Testing & Experimentation Reserve',
        group: 'Testing and Reserve',
        percentage: unallocatedPct,
        purpose: 'Reserve capital dedicated to systematic experimentation',
        primaryKpi: 'Experiment ROI & Conversion Lift',
      });
      setCurrentPlan({ ...updated });
    }

    addToast({
      type: 'success',
      title: 'Testing Allocated',
      message: `Allocated remaining ${unallocatedPct}% to Testing & Reserve.`,
    });
  };

  // Copy breakdown to clipboard
  const handleCopyBreakdown = () => {
    if (!currentPlan) return;
    const lines: string[] = [];
    lines.push(`# Sparkline Marketing Budget Plan: ${currentPlan.planTitle}`);
    lines.push(`**Project**: ${currentPlan.projectName}`);
    lines.push(
      `**Total Budget**: ${formatCurrency(currentPlan.totalBudget, currentPlan.currency)} (${currentPlan.frequency})`
    );
    lines.push(`**Approach**: ${currentPlan.activePlan.name}`);
    lines.push('');
    lines.push('| Category | Group | Amount | Allocation % | Primary KPI | Review | Status |');
    lines.push('|:---|:---|:---|:---|:---|:---|:---|');

    currentPlan.activePlan.allocations.forEach((a) => {
      lines.push(
        `| ${a.category} | ${a.group} | ${formatCurrency(a.amount, currentPlan.currency)} | ${a.percentage}% | ${a.primaryKpi} | ${a.reviewFrequency} | ${a.performanceStatus} |`
      );
    });

    lines.push('');
    lines.push('### Group Subtotals:');
    Object.values(currentPlan.activePlan.groupBreakdowns).forEach((g) => {
      lines.push(
        `- **${g.group}**: ${formatCurrency(g.amount, currentPlan.currency)} (${g.percentage}%, ${g.itemCount} items)`
      );
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedBreakdown(true);
    setTimeout(() => setCopiedBreakdown(false), 2500);
    addToast({
      type: 'success',
      title: 'Copied',
      message: 'Budget breakdown copied to clipboard.',
    });
  };

  // Print / PDF export
  const handlePrint = () => {
    window.print();
  };

  // Filtered allocations for active plan
  const filteredAllocations = useMemo(() => {
    if (!currentPlan) return [];
    if (filterGroup === 'All') return currentPlan.activePlan.allocations;
    return currentPlan.activePlan.allocations.filter((a) => a.group === filterGroup);
  }, [currentPlan, filterGroup]);

  // Donut chart category data
  const categoryChartData = useMemo(() => {
    if (!currentPlan) return [];
    return currentPlan.activePlan.allocations.map((a, idx) => ({
      name: a.category,
      value: a.amount,
      percentage: a.percentage,
      group: a.group,
      color: CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length],
    }));
  }, [currentPlan]);

  // Group breakdown bar chart data
  const groupChartData = useMemo(() => {
    if (!currentPlan) return [];
    return Object.values(currentPlan.activePlan.groupBreakdowns).map((g) => ({
      name: g.group.replace('Spend', '').replace('and', '&'),
      fullName: g.group,
      amount: g.amount,
      percentage: g.percentage,
      color: GROUP_COLORS[g.group],
    }));
  }, [currentPlan]);

  // 3-Plan Comparative Chart Data
  const comparativeChartData = useMemo(() => {
    if (!currentPlan) return [];
    const groups: BudgetGroup[] = [
      'Advertising Spend',
      'Content and Creative',
      'Marketing Operations',
      'External Services',
      'Testing and Reserve',
    ];

    return groups.map((g) => {
      const c = currentPlan.plans.conservative?.groupBreakdowns[g]?.percentage || 0;
      const b = currentPlan.plans.balanced?.groupBreakdowns[g]?.percentage || 0;
      const gr = currentPlan.plans.growth?.groupBreakdowns[g]?.percentage || 0;
      return {
        group: g.replace('Spend', '').replace('and', '&'),
        Conservative: c,
        Balanced: b,
        Growth: gr,
      };
    });
  }, [currentPlan]);

  const activeVariant = currentPlan?.activePlan;
  const is100Percent = activeVariant?.isBalanced100Percent ?? false;
  const totalAllocatedPct = Number(
    (
      currentPlan?.activePlan.allocations.reduce(
        (sum, a) => sum + (Number(a.percentage) || 0),
        0
      ) || 0
    ).toFixed(1)
  );

  return (
    <>
      <SEO
        title="Marketing Budget Allocation Planner — Sparkline Marketing"
        description="Plan your marketing investment, distribute your budget intelligently, and understand where your resources should go."
      />

      <div className="space-y-8 pb-16">
        {/* ========================================================================= */}
        {/* TOP COMMAND HEADER */}
        {/* ========================================================================= */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="blue" className="px-2.5 py-0.5">
                <DollarSign className="w-3 h-3 mr-1" />
                Budget Intelligence Engine
              </Badge>
              {currentPlan && (
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  v{currentPlan.version} • {currentPlan.activePlan.name}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight font-display">
              Make Every Marketing Dollar Work Smarter.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Plan your marketing investment, distribute your budget intelligently, and
              understand where your resources should go.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTuningDrawer(!showTuningDrawer)}
              className="gap-1.5"
            >
              <Sliders className="w-4 h-4 text-slate-600" />
              <span>Tune Parameters</span>
              {showTuningDrawer ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyBreakdown}
              className="gap-1.5"
            >
              {copiedBreakdown ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-slate-600" />
              )}
              <span>{copiedBreakdown ? 'Copied' : 'Copy'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5"
              title="Print or export PDF report"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print / PDF</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicatePlan}
              className="gap-1.5"
              title="Duplicate plan as a new version"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Duplicate</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSavePlan}
              className="gap-1.5 border-sparkline-blue/40 text-sparkline-blue hover:bg-sparkline-blue/5"
            >
              <Save className="w-4 h-4" />
              <span>Save Plan</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerateBudget}
              disabled={isGenerating}
              className="gap-1.5 bg-gradient-to-r from-sparkline-blue to-sparkline-purple shadow-sm"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Budget Plan'}</span>
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PROJECT & CORE CONTROLS STRIP */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Project Selector */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Active Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full text-sm font-semibold text-sparkline-midnight bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-sparkline-blue focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.business?.brandName || p.id} ({p.business?.operatingStatus || 'Project'})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Total Budget Input */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Budget
              </label>
              <span className="text-[10px] font-mono text-slate-400">Proportional</span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 font-bold text-sm">
                {CURRENCIES.find((c) => c.code === (currentPlan?.currency || 'USD'))
                  ?.symbol || '$'}
              </span>
              <input
                type="number"
                min="100"
                step="100"
                value={tuningBudget}
                onChange={(e) => handleTotalBudgetChange(Number(e.target.value))}
                className="w-full text-sm font-bold text-sparkline-midnight bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 focus:ring-2 focus:ring-sparkline-blue focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Currency Selector */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Currency
            </label>
            <select
              value={tuningCurrency}
              onChange={(e) => {
                setTuningCurrency(e.target.value);
                if (currentPlan) {
                  currentPlan.currency = e.target.value;
                  currentPlan.activePlan.currency = e.target.value;
                  setCurrentPlan({ ...currentPlan });
                }
              }}
              className="w-full text-sm font-semibold text-sparkline-midnight bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-sparkline-blue focus:outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol}) — {c.name.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Planning Frequency */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Planning Period
            </label>
            <select
              value={tuningFrequency}
              onChange={(e) => {
                const f = e.target.value as BudgetFrequency;
                setTuningFrequency(f);
                if (currentPlan) {
                  currentPlan.frequency = f;
                  setCurrentPlan({ ...currentPlan });
                }
              }}
              className="w-full text-sm font-semibold text-sparkline-midnight bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-sparkline-blue focus:outline-none"
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f} Budget
                </option>
              ))}
            </select>
          </div>

          {/* 5. Version History & Delete */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Plan Versions
              </label>
              {existingProjectPlans.length > 1 && (
                <button
                  type="button"
                  onClick={handleDeletePlan}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete this version"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <select
              value={currentPlan?.id || ''}
              onChange={(e) => {
                const found = existingProjectPlans.find((p) => p.id === e.target.value);
                if (found) {
                  setCurrentPlan(found);
                  syncTuningFromPlan(found);
                }
              }}
              className="w-full text-xs font-semibold text-sparkline-midnight bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-sparkline-blue focus:outline-none truncate"
            >
              {existingProjectPlans.map((p) => (
                <option key={p.id} value={p.id}>
                  v{p.version}: {p.planTitle} ({new Date(p.updatedAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TUNING DRAWER (COLLAPSIBLE STRATEGIC PARAMETERS) */}
        {/* ========================================================================= */}
        {showTuningDrawer && (
          <div className="bg-gradient-to-br from-slate-900 to-sparkline-midnight text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl transition-all animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-sparkline-cyan" />
                <h3 className="text-lg font-bold">
                  Strategic Budget Parameters & Constraints
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTuningDrawer(false)}
                className="text-slate-400 hover:text-white border-slate-700 hover:bg-slate-800"
              >
                Close Drawer
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Business Stage
                </label>
                <select
                  value={tuningBusinessStage}
                  onChange={(e) => setTuningBusinessStage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-sparkline-cyan"
                >
                  <option value="Pre-Launch / MVP">Pre-Launch / MVP Validation</option>
                  <option value="Early-Stage">Early-Stage / First 100 Customers</option>
                  <option value="Growing">Growing / Product-Market Fit Found</option>
                  <option value="Scale-Up">Scale-Up / Multi-Channel Expansion</option>
                  <option value="Established">Established / Market Leader</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Organic vs. Paid Preference
                </label>
                <select
                  value={tuningOrganicPaid}
                  onChange={(e) => setTuningOrganicPaid(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-sparkline-cyan"
                >
                  <option value="Organic-Heavy">Organic-Heavy (Content, SEO, Community)</option>
                  <option value="Balanced Mix">Balanced Mix (Paid Media + Lifecycle + Content)</option>
                  <option value="Paid-Heavy">Paid-Heavy (Rapid Paid Scale & Direct Ads)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Risk & Experimentation Profile
                </label>
                <select
                  value={tuningRiskPref}
                  onChange={(e) => setTuningRiskPref(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-sparkline-cyan"
                >
                  <option value="Conservative">Conservative (Capital preservation & low burn)</option>
                  <option value="Balanced">Balanced (Steady acquisition with safe buffer)</option>
                  <option value="Growth-Focused">Growth-Focused (Aggressive scale & high testing)</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Primary Marketing Objective
                </label>
                <input
                  type="text"
                  value={tuningObjective}
                  onChange={(e) => setTuningObjective(e.target.value)}
                  placeholder="e.g. Lower customer acquisition cost and build 3-month retention loop"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-sparkline-cyan"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Minimum Testing Buffer: {tuningMinTesting}%
                  </label>
                  <span className="text-xs text-sparkline-cyan font-mono">
                    {formatCurrency(
                      (tuningBudget * tuningMinTesting) / 100,
                      tuningCurrency
                    )}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={tuningMinTesting}
                  onChange={(e) => setTuningMinTesting(Number(e.target.value))}
                  className="w-full accent-sparkline-cyan cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>5% (Core focus)</span>
                  <span>10% (Recommended)</span>
                  <span>25% (R&D mode)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerateBudget}
                disabled={isGenerating}
                className="gap-2 bg-sparkline-blue hover:bg-blue-600 text-white"
              >
                <Sparkles className="w-4 h-4" />
                Apply Parameters & Regenerate Plans
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* REAL-TIME MATHEMATICAL VALIDATION BAR */}
        {/* ========================================================================= */}
        {currentPlan && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              is100Percent
                ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
                : totalAllocatedPct > 100
                ? 'bg-rose-50/70 border-rose-200/80 text-rose-900'
                : 'bg-amber-50/70 border-amber-200/80 text-amber-900'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    is100Percent
                      ? 'bg-emerald-500 text-white'
                      : totalAllocatedPct > 100
                      ? 'bg-rose-500 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {is100Percent ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base">
                      {is100Percent
                        ? '100.0% Fully Allocated'
                        : totalAllocatedPct > 100
                        ? `Over-Allocated by ${(totalAllocatedPct - 100).toFixed(1)}%`
                        : `Under-Allocated by ${(100 - totalAllocatedPct).toFixed(1)}%`}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-white/80 border border-current">
                      Total: {formatCurrency(currentPlan.totalBudget, currentPlan.currency)}
                    </span>
                  </div>
                  <p className="text-xs opacity-90 mt-0.5">
                    {is100Percent
                      ? 'Every dollar has a specified channel and primary KPI. Mathematical distribution validated.'
                      : totalAllocatedPct > 100
                      ? `Allocated: ${formatCurrency(
                          currentPlan.activePlan.allocations.reduce(
                            (s, a) => s + a.amount,
                            0
                          ),
                          currentPlan.currency
                        )} (${totalAllocatedPct}%). Reduce allocations to match 100%.`
                      : `Unallocated: ${formatCurrency(
                          activeVariant?.unallocatedAmount || 0,
                          currentPlan.currency
                        )} (${activeVariant?.unallocatedPercentage}%). You have unassigned budget funds.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {!is100Percent && totalAllocatedPct < 100 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAutoBalanceToTesting}
                    className="gap-1.5 bg-white border-amber-300 text-amber-900 hover:bg-amber-100"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Assign Remainder to Testing</span>
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestoreApproach(activeTabApproach)}
                  className="gap-1.5 bg-white text-slate-700 hover:bg-slate-100"
                  title="Revert custom adjustments to original algorithm recommendation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Recommended</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* THREE BUDGET ALLOCATION PLANS (TABS & VARIANT CARDS) */}
        {/* ========================================================================= */}
        {currentPlan && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl font-bold text-sparkline-midnight font-display">
                  Strategic Allocation Scenarios
                </h2>
                <p className="text-xs text-slate-500">
                  Select an allocation profile to preview or adopt as your active working plan.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                Active: <span className="text-sparkline-blue font-bold">{currentPlan.activePlan.name}</span>
              </span>
            </div>

            {/* Approach Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['conservative', 'balanced', 'growth'] as BudgetPlanApproach[]).map(
                (approachKey) => {
                  const variant = currentPlan.plans[approachKey];
                  if (!variant) return null;
                  const isSelected = activeTabApproach === approachKey;
                  const isActive = currentPlan.selectedApproach === approachKey;

                  return (
                    <div
                      key={approachKey}
                      onClick={() => setActiveTabApproach(approachKey)}
                      className={`cursor-pointer rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white border-sparkline-blue shadow-md ring-2 ring-sparkline-blue/20'
                          : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              approachKey === 'conservative'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : approachKey === 'balanced'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {variant.name}
                          </span>
                          {isActive && (
                            <Badge variant="blue" className="text-[10px]">
                              Current Active Plan
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-sparkline-midnight">
                          {variant.tagline}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {variant.description}
                        </p>

                        <div className="pt-2 border-t border-slate-100 space-y-1">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Key Strengths:
                          </span>
                          <ul className="text-xs text-slate-600 space-y-0.5">
                            {variant.keyAdvantages.slice(0, 2).map((adv, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{adv}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">
                          {variant.allocations.length} Channels
                        </span>
                        {!isActive ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyVariant(approachKey);
                            }}
                            className="text-xs py-1 px-2.5 h-7"
                          >
                            Set as Active Plan
                          </Button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Applied
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BUDGET VISUALIZATIONS SECTION (RECHARTS) */}
        {/* ========================================================================= */}
        {currentPlan && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 1. Category Distribution Donut Chart */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-sparkline-blue" />
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Allocation by Category
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {formatCurrency(currentPlan.totalBudget, currentPlan.currency)}
                </span>
              </div>

              <div className="h-64 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val: number) => [
                        formatCurrency(val, currentPlan.currency),
                        'Budget',
                      ]}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        color: '#FFF',
                        fontSize: '12px',
                        border: 'none',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[11px] font-semibold uppercase text-slate-400">
                    Total Budget
                  </span>
                  <span className="text-lg font-extrabold font-display text-sparkline-midnight">
                    {formatCurrency(currentPlan.totalBudget, currentPlan.currency)}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {currentPlan.frequency}
                  </span>
                </div>
              </div>

              {/* Chart Legend / Chips */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {categoryChartData.map((cat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-md"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate max-w-[140px] font-medium">{cat.name}</span>
                    <span className="font-mono text-slate-400">({cat.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Group Breakdown Bar Chart */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-sparkline-purple" />
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    5-Pillar Budget Breakdown
                  </h3>
                </div>
                <span className="text-xs text-slate-500">Percentages across groups</span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={groupChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tickFormatter={(val) => `${val}%`}
                      stroke="#94A3B8"
                      fontSize={11}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#475569"
                      fontSize={11}
                      tickLine={false}
                    />
                    <RechartsTooltip
                      formatter={(val: number) => [`${val}%`, 'Allocation']}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        color: '#FFF',
                        fontSize: '12px',
                        border: 'none',
                      }}
                    />
                    <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                      {groupChartData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Group Summary Cards */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.values(currentPlan.activePlan.groupBreakdowns).map((g) => (
                  <div
                    key={g.group}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col"
                  >
                    <span className="text-[10px] font-semibold text-slate-500 truncate">
                      {g.group.replace('Spend', '').replace('and', '&')}
                    </span>
                    <span className="text-xs font-bold text-sparkline-midnight mt-0.5">
                      {formatCurrency(g.amount, currentPlan.currency)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {g.percentage}% ({g.itemCount})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 3-Plan Comparative Scenario Bar Chart */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sparkline-cyan" />
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Scenario Comparison (3 Approaches)
                  </h3>
                </div>
                <span className="text-xs text-slate-500">% per Pillar</span>
              </div>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparativeChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="group" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickFormatter={(v) => `${v}%`} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        color: '#FFF',
                        fontSize: '12px',
                        border: 'none',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="Conservative" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Balanced" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Growth" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4. Timeline Monthly Spend Projection */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sparkline-orange" />
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Monthly Spending Timeline
                  </h3>
                </div>
                <span className="text-xs text-slate-500">6-Month Phased Rollout</span>
              </div>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={currentPlan.timelineMonthlySpend}
                    margin={{ top: 10, right: 10, left: -5, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
                    />
                    <RechartsTooltip
                      formatter={(val: number) => [
                        formatCurrency(val, currentPlan.currency),
                        'Spend',
                      ]}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        color: '#FFF',
                        fontSize: '12px',
                        border: 'none',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area
                      type="monotone"
                      dataKey="advertising"
                      name="Advertising"
                      stackId="1"
                      stroke="#2563EB"
                      fill="#2563EB"
                    />
                    <Area
                      type="monotone"
                      dataKey="creative"
                      name="Creative"
                      stackId="1"
                      stroke="#7C3AED"
                      fill="#7C3AED"
                    />
                    <Area
                      type="monotone"
                      dataKey="testing"
                      name="Testing"
                      stackId="1"
                      stroke="#F97316"
                      fill="#F97316"
                    />
                    <Area
                      type="monotone"
                      dataKey="operations"
                      name="Operations"
                      stackId="1"
                      stroke="#06B6D4"
                      fill="#06B6D4"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* INTERACTIVE ALLOCATION CATEGORIES TABLE / EDITOR */}
        {/* ========================================================================= */}
        {currentPlan && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
            <div className="p-6 border-b border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-sparkline-blue" />
                  <h3 className="text-lg font-bold text-sparkline-midnight">
                    Interactive Budget Allocation Editor
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust sliders or monetary amounts. Total proportions and KPI benchmarks
                  recalculate in real time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Filter by Group */}
                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                >
                  <option value="All">All 5 Groups</option>
                  <option value="Advertising Spend">Advertising Spend</option>
                  <option value="Content and Creative">Content and Creative</option>
                  <option value="Marketing Operations">Marketing Operations</option>
                  <option value="External Services">External Services</option>
                  <option value="Testing and Reserve">Testing and Reserve</option>
                </select>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddCustomModal(true)}
                  className="gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Custom Category</span>
                </Button>
              </div>
            </div>

            {/* Allocation Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="px-5 py-3.5">Category & Group</th>
                    <th className="px-5 py-3.5 w-64">Allocation Slider & %</th>
                    <th className="px-5 py-3.5 w-36">Amount</th>
                    <th className="px-5 py-3.5">Strategic Purpose & KPIs</th>
                    <th className="px-5 py-3.5">Review</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAllocations.map((alloc) => {
                    const groupColor = GROUP_COLORS[alloc.group] || '#64748B';

                    return (
                      <tr
                        key={alloc.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* 1. Category & Group */}
                        <td className="px-5 py-4 align-top">
                          <div className="font-bold text-sparkline-midnight text-sm">
                            {alloc.category}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: groupColor }}
                            />
                            <span className="text-[11px] font-semibold text-slate-500">
                              {alloc.group}
                            </span>
                            {alloc.isCustom && (
                              <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded font-mono">
                                Custom
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 2. Slider & Percentage Input */}
                        <td className="px-5 py-4 align-top">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-bold text-sparkline-midnight">
                                {alloc.percentage.toFixed(1)}%
                              </span>
                              <span className="text-[11px] text-slate-400">0 - 100%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="0.5"
                              value={alloc.percentage}
                              onChange={(e) =>
                                handlePercentageChange(alloc.id, Number(e.target.value))
                              }
                              className="w-full accent-sparkline-blue cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                            />
                          </div>
                        </td>

                        {/* 3. Amount Input */}
                        <td className="px-5 py-4 align-top">
                          <div className="relative">
                            <span className="absolute left-2.5 top-2 text-slate-400 font-bold text-xs">
                              {CURRENCIES.find(
                                (c) => c.code === (currentPlan?.currency || 'USD')
                              )?.symbol || '$'}
                            </span>
                            <input
                              type="number"
                              min="0"
                              max={currentPlan.totalBudget}
                              step="50"
                              value={alloc.amount}
                              onChange={(e) =>
                                handleAmountChange(alloc.id, Number(e.target.value))
                              }
                              className="w-full pl-6 pr-2 py-1.5 text-xs font-bold font-mono text-sparkline-midnight bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sparkline-blue"
                            />
                          </div>
                        </td>

                        {/* 4. Strategic Purpose & KPIs */}
                        <td className="px-5 py-4 align-top max-w-xs space-y-1">
                          <p className="text-slate-600 line-clamp-2 leading-relaxed">
                            {alloc.purpose}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className="font-semibold text-sparkline-blue bg-blue-50 px-1.5 py-0.5 rounded">
                              KPI: {alloc.primaryKpi}
                            </span>
                            <span className="text-slate-400">
                              via {alloc.measurementMethod}
                            </span>
                          </div>
                          {alloc.riskOrLimitation && (
                            <div className="text-[10px] text-amber-700 bg-amber-50/60 p-1 rounded flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{alloc.riskOrLimitation}</span>
                            </div>
                          )}
                        </td>

                        {/* 5. Review Frequency */}
                        <td className="px-5 py-4 align-top">
                          <span className="inline-block px-2 py-1 rounded bg-slate-100 text-[11px] font-semibold text-slate-600">
                            {alloc.reviewFrequency}
                          </span>
                        </td>

                        {/* 6. Performance Status */}
                        <td className="px-5 py-4 align-top">
                          <select
                            value={alloc.performanceStatus}
                            onChange={(e) => {
                              alloc.performanceStatus = e.target.value as any;
                              setCurrentPlan({ ...currentPlan });
                            }}
                            className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 focus:outline-none"
                          >
                            <option value="Planned">Planned</option>
                            <option value="Active">Active</option>
                            <option value="Paused">Paused</option>
                            <option value="Under Review">Under Review</option>
                          </select>
                        </td>

                        {/* 7. Actions */}
                        <td className="px-5 py-4 align-top text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(alloc.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Remove category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Subtotals */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-3">
              <div className="flex items-center gap-4">
                <span>
                  Showing <strong>{filteredAllocations.length}</strong> categories
                </span>
                <span>
                  Total Active Budget:{' '}
                  <strong className="text-sparkline-midnight">
                    {formatCurrency(currentPlan.totalBudget, currentPlan.currency)}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span>
                  Allocated: <strong>{totalAllocatedPct}%</strong>
                </span>
                <span>
                  Remaining:{' '}
                  <strong
                    className={
                      activeVariant?.unallocatedPercentage === 0
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }
                  >
                    {activeVariant?.unallocatedPercentage}% (
                    {formatCurrency(
                      activeVariant?.unallocatedAmount || 0,
                      currentPlan.currency
                    )}
                    )
                  </strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BUDGET RECOMMENDATIONS & REAL-TIME WARNINGS PANEL */}
        {/* ========================================================================= */}
        {currentPlan && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Real-Time Warnings Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Allocation Warnings & Risk Checks
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {currentPlan.warnings.length} Active Notice
                  {currentPlan.warnings.length === 1 ? '' : 's'}
                </span>
              </div>

              {currentPlan.warnings.length === 0 ? (
                <div className="p-6 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <div className="text-xs">
                    <span className="font-bold">All Risk Checks Clear.</span> No channel
                    concentration, dilution, or testing deficits detected.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentPlan.warnings.map((warn) => (
                    <div
                      key={warn.id}
                      className={`p-4 rounded-xl border space-y-1.5 ${
                        warn.severity === 'High'
                          ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                          : warn.severity === 'Medium'
                          ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                          : 'bg-blue-50/70 border-blue-200 text-blue-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle
                            className={`w-4 h-4 shrink-0 ${
                              warn.severity === 'High'
                                ? 'text-rose-600'
                                : warn.severity === 'Medium'
                                ? 'text-amber-600'
                                : 'text-blue-600'
                            }`}
                          />
                          <span className="font-bold text-xs">{warn.title}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            warn.severity === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : warn.severity === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {warn.severity}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed opacity-90">
                        {warn.explanation}
                      </p>
                      <div className="text-[11px] pt-1.5 border-t border-current/10 font-medium">
                        <strong>Resolution:</strong> {warn.howToResolve}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Strategic Recommendations */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sparkline-purple" />
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Strategic Recommendations
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  AI Optimization Engine
                </span>
              </div>

              <div className="space-y-3">
                {currentPlan.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-sparkline-midnight">
                        {rec.title}
                      </h4>
                      <Badge
                        variant={rec.impact === 'High' ? 'purple' : 'blue'}
                        className="text-[10px]"
                      >
                        {rec.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rec.description}
                    </p>
                    <div className="text-[11px] pt-1.5 border-t border-slate-200/80 text-sparkline-blue font-medium flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" />
                      <span>{rec.suggestedAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* KPI PERFORMANCE PLANNING TABLE (GOVERNANCE BENCHMARKS) */}
        {/* ========================================================================= */}
        {currentPlan && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-sparkline-blue" />
                <h3 className="text-base font-bold text-sparkline-midnight">
                  Performance Planning & KPI Governance
                </h3>
              </div>
              <span className="text-xs text-slate-400 italic">
                Target thresholds for weekly review • No fabricated forecasts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="px-4 py-3">Channel / Pillar</th>
                    <th className="px-4 py-3">Budget Allocated</th>
                    <th className="px-4 py-3">Primary KPI Target</th>
                    <th className="px-4 py-3">Measurement Method</th>
                    <th className="px-4 py-3">Review Frequency</th>
                    <th className="px-4 py-3">Execution Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentPlan.activePlan.allocations.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-semibold text-sparkline-midnight">
                        {a.category}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold">
                        {formatCurrency(a.amount, currentPlan.currency)} ({a.percentage}%)
                      </td>
                      <td className="px-4 py-3 font-medium text-sparkline-blue">
                        {a.primaryKpi}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {a.measurementMethod}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {a.reviewFrequency}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            a.performanceStatus === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : a.performanceStatus === 'Under Review'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : a.performanceStatus === 'Paused'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {a.performanceStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADD CUSTOM CATEGORY MODAL */}
        {/* ========================================================================= */}
        {showAddCustomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-sparkline-blue" />
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Add Custom Budget Category
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCustomCategorySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    placeholder="e.g. YouTube Shorts Creator Sponsorships"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Budget Group *
                  </label>
                  <select
                    value={customCategoryGroup}
                    onChange={(e) => setCustomCategoryGroup(e.target.value as BudgetGroup)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                  >
                    <option value="Advertising Spend">Advertising Spend</option>
                    <option value="Content and Creative">Content and Creative</option>
                    <option value="Marketing Operations">Marketing Operations</option>
                    <option value="External Services">External Services</option>
                    <option value="Testing and Reserve">Testing and Reserve</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      max="100"
                      step="0.5"
                      value={customCategoryPercentage}
                      onChange={(e) =>
                        setCustomCategoryPercentage(Number(e.target.value))
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Calculated Amount
                    </label>
                    <div className="p-2.5 bg-slate-100 rounded-lg font-bold font-mono text-sm text-slate-600">
                      {formatCurrency(
                        ((currentPlan?.totalBudget || 8000) *
                          customCategoryPercentage) /
                          100,
                        currentPlan?.currency || 'USD'
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Strategic Purpose
                  </label>
                  <input
                    type="text"
                    value={customCategoryPurpose}
                    onChange={(e) => setCustomCategoryPurpose(e.target.value)}
                    placeholder="e.g. Partner with 5 niche creators to test video conversions"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Primary KPI Target
                  </label>
                  <input
                    type="text"
                    value={customCategoryKpi}
                    onChange={(e) => setCustomCategoryKpi(e.target.value)}
                    placeholder="e.g. Creator CPA < $35"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddCustomModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Add Category
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
