import React, { useState, useEffect } from 'react';
import { SEO } from '@/components/common/SEO';
import { SparklinePerformanceChart } from '@/components/charts/SparklineChart';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Feedback';
import { useToast } from '@/components/common/Feedback';
import {
  Sparkles,
  Info,
  Brain,
  Calculator,
  Target,
  Users,
  ArrowRight,
  Plus,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Circle,
  RotateCcw,
  ExternalLink,
  FolderKanban,
  Megaphone,
  Share2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { projectService } from '@/services/project.service';

interface Project {
  id: string;
  name: string;
  industry: string;
  lastUpdated: string;
  status: 'In Strategy' | 'Active Flight' | 'Budget Planning' | 'Completed';
  route: string;
}

const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Organic Vitamin C Serum',
    industry: 'Direct-to-Consumer / Skincare',
    lastUpdated: '2 hours ago',
    status: 'In Strategy',
    route: '/dashboard/strategist',
  },
  {
    id: 'proj-2',
    name: 'Apex Cloud Security Suite',
    industry: 'B2B Enterprise SaaS',
    lastUpdated: 'Yesterday',
    status: 'Active Flight',
    route: '/dashboard/campaigns',
  },
  {
    id: 'proj-3',
    name: 'FitPulse Smart Wearable',
    industry: 'Consumer Electronics & IoT',
    lastUpdated: '3 days ago',
    status: 'Budget Planning',
    route: '/dashboard/budget',
  },
  {
    id: 'proj-4',
    name: 'FinFlow Global Remittances',
    industry: 'FinTech / Payments',
    lastUpdated: '5 days ago',
    status: 'Completed',
    route: '/dashboard/reports',
  },
];

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  targetRoute: string;
}

const defaultChecklist: ChecklistItem[] = [
  {
    id: 'step-1',
    label: 'Create your first project',
    description: 'Set up an active workspace container for your product or brand.',
    completed: true,
    targetRoute: '/dashboard/projects',
  },
  {
    id: 'step-2',
    label: 'Add product or business information',
    description: 'Define your price points, value proposition, and customer friction.',
    completed: true,
    targetRoute: '/dashboard/strategist',
  },
  {
    id: 'step-3',
    label: 'Analyze your target audience',
    description: 'Map demographic profiles, high-intent channels, and buyer pain points.',
    completed: false,
    targetRoute: '/dashboard/audience',
  },
  {
    id: 'step-4',
    label: 'Generate a marketing strategy',
    description: 'Run the AI engine to generate your multi-channel GTM blueprint.',
    completed: false,
    targetRoute: '/dashboard/strategist',
  },
  {
    id: 'step-5',
    label: 'Create a marketing plan',
    description: 'Establish spend pacing, flight dates, and core conversion targets.',
    completed: false,
    targetRoute: '/dashboard/campaigns',
  },
];

export const DashboardOverviewPage: React.FC = () => {
  const { addToast } = useToast();
  const { user } = useAuth();

  // User Profile State
  const userName = user?.fullName || 'Alex Morgan';

  // Real Projects State from projectService
  const [savedProjects, setSavedProjects] = useState(() => projectService.getProjects(user?.id));

  useEffect(() => {
    setSavedProjects(projectService.getProjects(user?.id));
  }, [user?.id]);

  // Checklist State with LocalStorage Persistence
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem('sparkline_dashboard_checklist');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore localStorage errors
    }
    return defaultChecklist;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sparkline_dashboard_checklist', JSON.stringify(checklist));
    } catch {
      // Ignore localStorage errors
    }
  }, [checklist]);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const resetChecklist = () => {
    setChecklist(defaultChecklist);
    addToast({
      title: 'Checklist Reset',
      message: 'Onboarding checklist restored to default sample state.',
      type: 'info',
    });
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  // Projects State
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectIndustry, setNewProjectIndustry] = useState('');
  const [newProjectBudget, setNewProjectBudget] = useState('$10,000');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: newProjectName.trim(),
      industry: newProjectIndustry.trim() || 'General Business',
      lastUpdated: 'Just now',
      status: 'In Strategy',
      route: '/dashboard/strategist',
    };

    setProjects([newProj, ...projects]);
    setIsNewProjectModalOpen(false);
    setNewProjectName('');
    setNewProjectIndustry('');

    addToast({
      title: 'Marketing Project Created',
      message: `"${newProj.name}" has been initialized in your demonstration workspace.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-8 pb-12">
      <SEO
        title="Dashboard Overview | Sparkline Marketing"
        description="Marketing Intelligence & Strategy Platform workspace overview, performance forecasting, and campaign orchestration."
        noIndex={true}
      />

      {/* Demonstration Notice Strip */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5 sm:mt-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900 flex items-center gap-2">
              <span>DEMONSTRATION WORKSPACE</span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-amber-200/60 text-amber-900">
                Phase 04 Verified
              </span>
            </div>
            <p className="text-xs text-amber-800/90 mt-0.5">
              All metrics, models, and project outputs are illustrative demonstration representations. Fictional numbers are never passed as verified live account returns.
            </p>
          </div>
        </div>
        <Link
          to="/dashboard/security"
          className="text-xs font-semibold text-amber-900 hover:text-amber-950 underline underline-offset-2 shrink-0"
        >
          View Privacy Protocols
        </Link>
      </div>

      {/* 1. Welcome Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-sparkline-blue text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Marketing Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight">
            Welcome back, {userName}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Sparkline Marketing helps you analyze your market, discover competitor whitespace, allocate campaign budgets mathematically, and forecast growth before spending ad capital.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsNewProjectModalOpen(true)}
            className="w-full sm:w-auto justify-center"
          >
            Create New Marketing Project
          </Button>
          <Button
            to="/tools"
            variant="outline"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto justify-center"
          >
            Explore Marketing Tools
          </Button>
        </div>
      </div>

      {/* 2. Quick Action Cards */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-sparkline-midnight">
            Strategic Quick Actions
          </h2>
          <p className="text-xs text-slate-500">
            Launch high-priority marketing workflows and intelligence analyses
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1 */}
          <Link
            to="/dashboard/strategist"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:border-sparkline-blue/50 hover:shadow-card transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-sparkline-blue flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-sparkline-midnight group-hover:text-sparkline-blue transition-colors">
                Build Marketing Strategy
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Generate tailored multi-channel launch roadmaps and value messaging.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sparkline-blue">
              <span>Launch Strategist</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Action 2 */}
          <Link
            to="/dashboard/competitors"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:border-sparkline-purple/50 hover:shadow-card transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-sparkline-purple flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-sparkline-midnight group-hover:text-sparkline-purple transition-colors">
                Analyze Competitors
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Benchmark competitor positioning, ad angles, and search keywords.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sparkline-purple">
              <span>View Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Action 3 */}
          <Link
            to="/dashboard/audience"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:border-sparkline-cyan/50 hover:shadow-card transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-sparkline-cyan flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-sparkline-midnight group-hover:text-sparkline-cyan transition-colors">
                Research Target Audience
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Map customer personas, decision triggers, and channel affinities.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sparkline-cyan">
              <span>Audience Insights</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Action 4 */}
          <Link
            to="/dashboard/budget"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:border-sparkline-orange/50 hover:shadow-card transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-sparkline-orange flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-sparkline-midnight group-hover:text-sparkline-orange transition-colors">
                Plan Marketing Budget
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Model spend pacing across search, social, and multi-currency scenarios.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sparkline-orange">
              <span>Allocate Budget</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 3. Key Marketing Metrics (Explicit Demonstration Data) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-sparkline-midnight">
              Marketing Intelligence Pulse
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated demonstration benchmarks for the active workspace
            </p>
          </div>
          <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
            DEMONSTRATION VALUES
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Projects</span>
              <FolderKanban className="w-4 h-4 text-sparkline-blue" />
            </div>
            <div className="text-2xl font-extrabold text-sparkline-midnight">
              {projects.length}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+1 created this month</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Demo Workspace Scope
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Campaigns</span>
              <Megaphone className="w-4 h-4 text-sparkline-purple" />
            </div>
            <div className="text-2xl font-extrabold text-sparkline-midnight">
              12
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-sparkline-cyan font-semibold">
              <span>Across 3 ad channels</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Search • Social • Display
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Estimated Budget</span>
              <Calculator className="w-4 h-4 text-sparkline-orange" />
            </div>
            <div className="text-2xl font-extrabold text-sparkline-midnight">
              $24,500
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <span>USD monthly spend pace</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Currency: USD ($)
            </div>
          </div>

          {/* Metric 4 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Average ROAS</span>
              <BarChart3 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600">
              4.62x
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs industry baseline</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Sample Model Simulation
            </div>
          </div>
        </div>
      </div>

      {/* Illustrative Performance Chart & Getting Started Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-sparkline-midnight">
                    Predictive Ad Spend & Revenue Curve
                  </h3>
                  <Badge variant="blue" size="sm">
                    Simulation Model
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Illustrative 60-day pacing scenario for demo product portfolio
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-sparkline-blue font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-sparkline-blue" />
                  Projected Revenue
                </span>
                <span className="flex items-center gap-1 text-sparkline-orange font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-sparkline-orange" />
                  Ad Spend
                </span>
              </div>
            </div>

            <div className="pt-4">
              <SparklinePerformanceChart height={260} />
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Model confidence: 92% based on e-commerce benchmarks</span>
            <Link
              to="/dashboard/metrics"
              className="text-sparkline-blue font-semibold hover:underline flex items-center gap-1"
            >
              <span>Explore Metrics</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 6. Getting Started Checklist Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-sparkline-midnight">
                  Getting Started Checklist
                </h3>
                <p className="text-xs text-slate-500">
                  {completedCount} of {checklist.length} completed ({progressPercent}%)
                </p>
              </div>
              <button
                type="button"
                onClick={resetChecklist}
                className="p-1.5 text-slate-400 hover:text-sparkline-midnight rounded-lg hover:bg-slate-100 transition-colors"
                title="Reset checklist to default demo state"
                aria-label="Reset checklist"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sparkline-blue to-sparkline-cyan rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div className="mt-4 space-y-2.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    item.completed
                      ? 'bg-emerald-50/40 border-emerald-200/60'
                      : 'bg-slate-50 border-slate-200/70'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleChecklistItem(item.id)}
                    className="flex items-start gap-2.5 text-left flex-1"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div
                        className={`text-xs font-bold leading-tight ${
                          item.completed
                            ? 'text-emerald-950 line-through opacity-80'
                            : 'text-sparkline-midnight'
                        }`}
                      >
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {item.description}
                      </div>
                    </div>
                  </button>

                  <Link
                    to={item.targetRoute}
                    className="text-[10px] font-semibold text-sparkline-blue hover:underline shrink-0 mt-0.5 flex items-center gap-0.5"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
            * Progress state persisted in local browser storage.
          </div>
        </div>
      </div>

      {/* 4. Recent Projects Section */}
      <Card className="p-6 border-slate-200/80 shadow-card bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-sparkline-midnight">
                Recent Marketing Workspaces
              </h2>
              <span className="text-xs text-slate-400 font-mono">({savedProjects.length})</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Active brand roadmaps, product positioning portfolios, and campaigns
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              to="/dashboard/projects"
              variant="outline"
              size="sm"
            >
              View All Workspaces
            </Button>
            <Button
              to="/dashboard/projects/new"
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              New Project
            </Button>
          </div>
        </div>

        {savedProjects.length === 0 ? (
          /* Empty State */
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-sparkline-blue flex items-center justify-center mb-3">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-sparkline-midnight">
              No marketing projects found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Start by creating your first marketing project to run competitor analyses, market research, and multi-channel strategies.
            </p>
            <Button
              to="/dashboard/projects/new"
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="mt-4"
            >
              Create First Project
            </Button>
          </div>
        ) : (
          /* Projects Table */
          <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-xs min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">Industry / Category</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {savedProjects.slice(0, 5).map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-3 px-4 font-bold text-sparkline-midnight flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-50 text-sparkline-blue flex items-center justify-center shrink-0">
                        <FolderKanban className="w-3.5 h-3.5" />
                      </div>
                      <span>{project.business.brandName}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{project.business.industry}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-sparkline-blue border border-blue-200">
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/dashboard/projects/${project.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sparkline-blue hover:text-blue-700 group-hover:underline"
                      >
                        <span>Open Project</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* 5. Recommended Tools Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-sparkline-midnight">
              Recommended Marketing Tools
            </h2>
            <p className="text-xs text-slate-500">
              Hand-picked decision-making engines to accelerate your campaign performance
            </p>
          </div>
          <Link
            to="/tools"
            className="text-xs font-semibold text-sparkline-blue hover:underline flex items-center gap-1"
          >
            <span>All Tools Catalog</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/dashboard/strategist"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:border-sparkline-blue/40 hover:shadow-card transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-sparkline-blue flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <Badge variant="blue" size="sm">
                AI Engine
              </Badge>
            </div>
            <h3 className="text-sm font-bold text-sparkline-midnight mt-3 group-hover:text-sparkline-blue transition-colors">
              AI Marketing Strategist
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Generate full go-to-market roadmaps with tailored channel allocations, value propositions, and positioning angles.
            </p>
          </Link>

          <Link
            to="/dashboard/budget"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:border-sparkline-orange/40 hover:shadow-card transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-sparkline-orange flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <Badge variant="orange" size="sm">
                Finance
              </Badge>
            </div>
            <h3 className="text-sm font-bold text-sparkline-midnight mt-3 group-hover:text-sparkline-orange transition-colors">
              Dynamic Budget Planner
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Calculate spend splits across search, social, and display with real-time multi-currency conversions and burn pacing.
            </p>
          </Link>

          <Link
            to="/dashboard/competitors"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:border-sparkline-purple/40 hover:shadow-card transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-sparkline-purple flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <Badge variant="purple" size="sm">
                Intelligence
              </Badge>
            </div>
            <h3 className="text-sm font-bold text-sparkline-midnight mt-3 group-hover:text-sparkline-purple transition-colors">
              Competitor Intelligence Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Benchmark competitor hooks, ad formats, and price positioning to pinpoint untapped customer demand whitespace.
            </p>
          </Link>

          <Link
            to="/dashboard/metrics"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:border-sparkline-cyan/40 hover:shadow-card transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-sparkline-cyan flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <Badge variant="cyan" size="sm">
                Analytics
              </Badge>
            </div>
            <h3 className="text-sm font-bold text-sparkline-midnight mt-3 group-hover:text-sparkline-cyan transition-colors">
              Marketing Metrics Hub
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Evaluate CAC, LTV ratios, payback periods, and blended ROAS formulas with step-by-step mathematical transparency.
            </p>
          </Link>

          <Link
            to="/dashboard/roi-calculator"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:border-emerald-500/40 hover:shadow-card transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <Badge variant="cyan" size="sm">
                Calculator
              </Badge>
            </div>
            <h3 className="text-sm font-bold text-sparkline-midnight mt-3 group-hover:text-emerald-600 transition-colors">
              ROI & ROAS Calculator
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Model conversion thresholds, break-even ad spend, and net campaign profitability before deploying media dollars.
            </p>
          </Link>

          <Link
            to="/dashboard/social-studio"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:border-sparkline-magenta/40 hover:shadow-card transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-sparkline-magenta flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <Badge variant="magenta" size="sm">
                Creative
              </Badge>
            </div>
            <h3 className="text-sm font-bold text-sparkline-midnight mt-3 group-hover:text-sparkline-magenta transition-colors">
              Social Media Studio
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Build high-converting organic and paid social content calendars with cross-platform hook frameworks and briefs.
            </p>
          </Link>
        </div>
      </div>

      {/* Modal: Create New Marketing Project */}
      <Modal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        title="Create New Marketing Project"
        description="Initialize a dedicated marketing workspace for your product, brand, or client campaign."
      >
        <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
          <div>
            <label htmlFor="new-project-name" className="block text-xs font-bold text-sparkline-midnight mb-1">
              Project / Brand Name *
            </label>
            <input
              id="new-project-name"
              type="text"
              required
              placeholder="e.g. Acme Cloud ERP or Radiant Botanicals"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
            />
          </div>

          <div>
            <label htmlFor="new-project-industry" className="block text-xs font-bold text-sparkline-midnight mb-1">
              Industry or Market Segment
            </label>
            <input
              id="new-project-industry"
              type="text"
              placeholder="e.g. B2B Enterprise SaaS, D2C Apparel, Healthcare"
              value={newProjectIndustry}
              onChange={(e) => setNewProjectIndustry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
            />
          </div>

          <div>
            <label htmlFor="new-project-budget" className="block text-xs font-bold text-sparkline-midnight mb-1">
              Estimated Monthly Marketing Budget
            </label>
            <input
              id="new-project-budget"
              type="text"
              value={newProjectBudget}
              onChange={(e) => setNewProjectBudget(e.target.value)}
              placeholder="e.g. $10,000 USD"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewProjectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Initialize Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
