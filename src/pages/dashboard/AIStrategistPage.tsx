import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/components/common/Feedback';
import { projectService } from '@/services/project.service';
import { strategyService, AiStatusResponse } from '@/services/strategy.service';
import { getFriendlyErrorMessage } from '@/services/api-client';
import { MarketingProject } from '@/types/project';
import {
  GeneratedMarketingStrategy,
  StrategyApproachType,
  GenerationState,
  FunnelStage,
} from '@/types/strategy';
import {
  Brain,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Users,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Printer,
  ChevronDown,
  Layers,
  HelpCircle,
  Clock,
  ShieldAlert,
  Zap,
  Key,
  Flame,
  Plus,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const AIStrategistPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialProjectId = searchParams.get('project');
  const { addToast } = useToast();

  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [strategies, setStrategies] = useState<GeneratedMarketingStrategy[]>([]);
  const [currentStrategy, setCurrentStrategy] = useState<GeneratedMarketingStrategy | null>(null);

  const [aiStatus, setAiStatus] = useState<AiStatusResponse>({
    isConfigured: false,
    provider: 'Google Gemini',
    model: 'gemini-1.5-flash',
  });
  const [checkingAi, setCheckingAi] = useState(true);

  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [generationError, setGenerationError] = useState<string>('');
  const [activeApproach, setActiveApproach] = useState<StrategyApproachType>('balanced');
  const [activeFunnelStage, setActiveFunnelStage] = useState<FunnelStage>('Awareness');
  const [activeTab, setActiveTab] = useState<'overview' | 'approaches' | 'channels' | 'funnel' | 'action_plan' | 'risks'>('overview');

  // Load projects & check AI status
  useEffect(() => {
    const loadedProjects = projectService.getProjects();
    setProjects(loadedProjects);

    if (loadedProjects.length > 0) {
      if (initialProjectId && loadedProjects.some((p) => p.id === initialProjectId)) {
        setSelectedProjectId(initialProjectId);
      } else {
        const first = loadedProjects[0];
        if (first) {
          setSelectedProjectId(first.id);
        }
      }
    }

    strategyService
      .checkAiStatus()
      .then((status) => {
        setAiStatus(status);
        setCheckingAi(false);
      })
      .catch(() => {
        setCheckingAi(false);
      });
  }, [initialProjectId]);

  // Load strategies whenever selected project changes
  useEffect(() => {
    if (!selectedProjectId) {
      setStrategies([]);
      setCurrentStrategy(null);
      return;
    }

    const projectStrategies = strategyService.getStrategies(selectedProjectId);
    setStrategies(projectStrategies);

    if (projectStrategies.length > 0) {
      const latest = projectStrategies.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      setCurrentStrategy(latest ?? null);
    } else {
      setCurrentStrategy(null);
    }
  }, [selectedProjectId]);

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  // Project information readiness verification
  const readinessAudit = useMemo(() => {
    if (!selectedProject) return { isReady: false, missing: [] };

    const missing: string[] = [];
    if (!selectedProject.business.brandName?.trim()) missing.push('Brand or business name');
    if (!selectedProject.business.description || selectedProject.business.description.length < 10) {
      missing.push('Comprehensive business description (at least 10 characters)');
    }
    if (!selectedProject.products || selectedProject.products.length === 0) {
      missing.push('At least one configured product or service');
    } else {
      const p = selectedProject.products[0];
      if (!p || !p.usp?.trim()) missing.push('Product Unique Selling Proposition (USP)');
      if (!p || p.sellingPrice <= 0) missing.push('Product selling price');
    }
    if (!selectedProject.audience.needsAndProblems?.trim()) {
      missing.push('Target audience core needs or commercial problems');
    }
    if (!selectedProject.marketing.primaryObjective) {
      missing.push('Primary marketing objective');
    }

    return {
      isReady: missing.length === 0,
      missing,
    };
  }, [selectedProject]);

  // Handle live AI strategy generation
  const handleGenerateStrategy = async () => {
    if (!selectedProject) return;

    // Guard against duplicate in-flight submissions
    if (
      generationState === 'preparing' ||
      generationState === 'analyzing' ||
      generationState === 'generating' ||
      generationState === 'saving'
    ) {
      return;
    }

    if (!readinessAudit.isReady) {
      addToast({
        title: 'Incomplete Project Information',
        message: 'Please complete the required project fields before generating an AI strategy.',
        type: 'warning',
      });
      return;
    }

    // Meaningful states progression
    setGenerationError('');
    setGenerationState('preparing');

    // Small sequential transition to reflect real preparation before dispatch
    setTimeout(async () => {
      setGenerationState('analyzing');

      try {
        const strategy = await strategyService.generateAiStrategy(selectedProject, activeApproach);
        setGenerationState('saving');

        setTimeout(() => {
          setGenerationState('completed');
          setCurrentStrategy(strategy);
          setStrategies(strategyService.getStrategies(selectedProject.id));

          addToast({
            title: 'Strategy Generated Successfully',
            message: `New strategy version created for ${selectedProject.business.brandName}.`,
            type: 'success',
          });
        }, 500);
      } catch (err: unknown) {
        setGenerationState('failed');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorCode = (err as any)?.code;
        const errorMessage = getFriendlyErrorMessage(err);

        setGenerationError(errorMessage);

        if (errorCode === 'API_KEY_NOT_CONFIGURED') {
          addToast({
            title: 'Gemini API Key Required',
            message: 'Please set GEMINI_API_KEY in your environment to enable live AI generation.',
            type: 'warning',
          });
        } else {
          addToast({
            title: 'Strategy Generation Failed',
            message: errorMessage,
            type: 'error',
          });
        }
      }
    }, 400);
  };

  const handleCopyStrategy = () => {
    if (!currentStrategy) return;

    const markdownText = `# ${currentStrategy.projectName} — Marketing Strategy (v${currentStrategy.version})
Model: ${currentStrategy.modelIdentifier} | Date: ${new Date(currentStrategy.createdAt).toLocaleDateString()}

## Executive Summary
${currentStrategy.executiveSummary}

## Brand Positioning
${currentStrategy.messaging.brandPositioning}
Core Message: ${currentStrategy.messaging.coreMessage}

## Recommended Channels
${currentStrategy.recommendedChannels
  .map(
    (ch) => `### ${ch.channelName} (${ch.priority} Priority)
- Suitability: ${ch.suitabilityReason}
- Budget Share: ${ch.estimatedBudgetShare}
- Suggested KPIs: ${ch.suggestedKpis.join(', ')}`
  )
  .join('\n\n')}

## Immediate Next Steps
${currentStrategy.nextSteps
  .map((ns, i) => `${i + 1}. [${ns.priority} Priority] ${ns.title}: ${ns.description} (${ns.suggestedTimeline})`)
  .join('\n')}
`;

    navigator.clipboard.writeText(markdownText).then(() => {
      addToast({
        title: 'Strategy Copied to Clipboard',
        message: 'Structured strategy summary copied in markdown format.',
        type: 'success',
      });
    });
  };

  const handleCopyRecommendation = (title: string, desc: string) => {
    navigator.clipboard.writeText(`${title}: ${desc}`).then(() => {
      addToast({
        title: 'Recommendation Copied',
        message: `"${title}" copied to clipboard.`,
        type: 'success',
      });
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <SEO
        title="AI Marketing Strategist — Sparkline Marketing"
        description="Turn your business information into an actionable marketing strategy backed by structured analysis, clear assumptions, and measurable objectives."
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-purple-100 text-sparkline-purple">
              Intelligence Engine
            </span>
            <Badge variant="blue" size="sm">
              Phase 07
            </Badge>

            {/* AI Provider Status Pill */}
            {!checkingAi && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                  aiStatus.isConfigured
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                )}
                title={aiStatus.message}
              >
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    aiStatus.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  )}
                />
                {aiStatus.isConfigured ? 'Gemini 1.5 Flash Connected' : 'Gemini Key Setup Required'}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight">
            Your AI Marketing Strategist
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Turn your business information into an actionable marketing strategy backed by structured analysis,
            clear assumptions, and measurable objectives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/dashboard/projects/new">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </Button>
          </Link>

          {currentStrategy && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-2 hidden sm:flex"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export</span>
            </Button>
          )}
        </div>
      </div>

      {/* No Projects Empty State */}
      {projects.length === 0 ? (
        <Card className="p-12 text-center bg-white border-slate-200 shadow-card max-w-2xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-sparkline-blue flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-sparkline-midnight">
              No Marketing Projects Found
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Sparkline Marketing builds personalized, unit-economic grounded strategies based on your specific
              business profile, products, target audience, and competitive positioning.
            </p>
          </div>
          <Link to="/dashboard/projects/new" className="inline-block">
            <Button variant="primary" size="md" className="gap-2">
              <Plus className="w-4 h-4" />
              <span>Build Your Business Profile</span>
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          {/* Project Selector Bar */}
          <Card className="p-4 bg-white border-slate-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label
                  htmlFor="project-select"
                  className="text-xs font-bold text-sparkline-midnight uppercase tracking-wider shrink-0"
                >
                  Active Project:
                </label>
                <div className="relative min-w-[280px]">
                  <select
                    id="project-select"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue/20 focus:border-sparkline-blue appearance-none pr-8 cursor-pointer"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.business.brandName} ({p.business.businessType} · {p.business.industry})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {selectedProject && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="cyan" size="sm">
                      ${selectedProject.marketing.monthlyBudget.toLocaleString()}{' '}
                      {selectedProject.marketing.budgetCurrency}/mo
                    </Badge>
                    <Badge variant="slate" size="sm">
                      {selectedProject.products.length} Product
                      {selectedProject.products.length === 1 ? '' : 's'}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Version History Selector */}
              {strategies.length > 0 && (
                <div className="flex items-center gap-2 self-start lg:self-auto">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Version:</span>
                  </span>
                  <select
                    value={currentStrategy?.id || ''}
                    onChange={(e) => {
                      const found = strategies.find((s) => s.id === e.target.value);
                      if (found) setCurrentStrategy(found);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {strategies.map((strat) => (
                      <option key={strat.id} value={strat.id}>
                        v{strat.version} — {new Date(strat.createdAt).toLocaleDateString()} (
                        {strat.modelIdentifier.includes('Reference') ? 'Blueprint' : 'Gemini'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Selected Project Overview Pill Bar */}
            {selectedProject && (
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Primary Goal
                  </span>
                  <span className="font-semibold text-sparkline-midnight truncate block">
                    {selectedProject.marketing.primaryObjective}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Stage & Scale
                  </span>
                  <span className="font-semibold text-sparkline-midnight truncate block">
                    {selectedProject.business.operatingStatus}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Location & Reach
                  </span>
                  <span className="font-semibold text-sparkline-midnight truncate block">
                    {selectedProject.business.location}
                  </span>
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    to={`/dashboard/projects/${selectedProject.id}`}
                    className="text-sparkline-blue hover:underline text-[11px] font-semibold flex items-center gap-1"
                  >
                    <span>View Full Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </Card>

          {/* Unconfigured Gemini API Key Setup Banner */}
          {!aiStatus.isConfigured && (
            <Card className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Key className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      Live Gemini API Key Required for Real-Time Generation
                    </h3>
                    <p className="text-xs text-amber-800 leading-relaxed max-w-2xl">
                      To run live AI strategy syntheses with Google Gemini 1.5 Flash, add{' '}
                      <code className="px-1.5 py-0.5 rounded bg-amber-200/80 font-mono text-[11px] font-bold">
                        GEMINI_API_KEY=&quot;your_key&quot;
                      </code>{' '}
                      to your <code className="font-mono text-[11px]">.env</code> file. Pre-generated reference
                      blueprints are currently loaded below for evaluation.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://aistudio.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-900 text-white hover:bg-amber-950 transition-colors"
                  >
                    Get Free Gemini Key
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCheckingAi(true);
                      strategyService.checkAiStatus().then((s) => {
                        setAiStatus(s);
                        setCheckingAi(false);
                        addToast({
                          title: 'Connection Check',
                          message: s.isConfigured
                            ? 'Gemini API is connected successfully!'
                            : 'GEMINI_API_KEY not detected yet in .env',
                          type: s.isConfigured ? 'success' : 'info',
                        });
                      });
                    }}
                  >
                    Test Status
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Incomplete Project Information Notice */}
          {selectedProject && !readinessAudit.isReady && (
            <Card className="p-5 bg-rose-50 border-rose-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                    Project Lacks Required Information for AI Synthesis
                  </h3>
                  <p className="text-xs text-rose-700">
                    Sparkline AI requires accurate foundational parameters to compute unit economics, target
                    audiences, and channel fit. The following items are incomplete:
                  </p>
                  <ul className="list-disc list-inside text-xs text-rose-800 space-y-1 font-medium">
                    {readinessAudit.missing.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <div className="pt-1">
                    <Link to={`/dashboard/projects/${selectedProject.id}`}>
                      <Button variant="outline" size="sm" className="bg-white">
                        Edit Project Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Generation Control Card / Status Monitor */}
          <Card className="p-6 bg-gradient-to-br from-sparkline-midnight via-sparkline-slate to-sparkline-midnight text-white border-0 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sparkline-blue/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-sparkline-purple/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sparkline-blue/20 border border-sparkline-blue/30 flex items-center justify-center text-sparkline-blue">
                    <Brain className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-sparkline-cyan">
                    Synthesis Engine · Gemini 1.5 Flash
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {selectedProject ? selectedProject.business.brandName : 'Select a Project'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Synthesize your unit economics, audience motivations, and budget envelope into a complete
                  multi-channel marketing playbook with tactical campaign recommendations.
                </p>

                {/* Real Generation State Explanations */}
                {generationState !== 'idle' && (
                  <div className="pt-2 flex items-center gap-2.5">
                    <div className="w-4 h-4 border-2 border-sparkline-cyan border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="text-xs font-medium text-sparkline-cyan animate-pulse">
                      {generationState === 'preparing' && 'Preparing business context & sanitizing inputs...'}
                      {generationState === 'analyzing' &&
                        'Analyzing unit economics, audience psychology & competitive positioning...'}
                      {generationState === 'generating' &&
                        'Structuring channel playbooks, budget splits & funnel strategy...'}
                      {generationState === 'saving' && 'Validating output schema and saving strategy version...'}
                    </span>
                  </div>
                )}

                {/* Error Banner */}
                {generationState === 'failed' && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>Generation Error</span>
                    </div>
                    <p className="text-slate-300">{generationError}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <Button
                  variant="primary"
                  size="lg"
                  disabled={
                    !readinessAudit.isReady ||
                    generationState === 'preparing' ||
                    generationState === 'analyzing' ||
                    generationState === 'generating' ||
                    generationState === 'saving'
                  }
                  onClick={handleGenerateStrategy}
                  className="bg-sparkline-blue hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/25 gap-2 min-h-[48px]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {generationState === 'idle' || generationState === 'completed'
                      ? 'Generate Strategy with AI'
                      : 'Synthesizing Strategy...'}
                  </span>
                </Button>

                {currentStrategy && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCopyStrategy}
                    className="border-slate-600 text-white hover:bg-white/10 gap-2 min-h-[48px]"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Strategy</span>
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Strategy Presentation Workspace */}
          {currentStrategy && (
            <div className="space-y-6">
              {/* Navigation Tabs for Strategy */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200">
                {[
                  { id: 'overview', label: 'Executive Summary', icon: Brain },
                  { id: 'approaches', label: '3 Strategic Approaches', icon: Zap },
                  { id: 'channels', label: 'Channel Recommendations', icon: Target },
                  { id: 'funnel', label: 'Marketing Funnel (6 Stages)', icon: Layers },
                  { id: 'action_plan', label: 'Immediate Next Steps', icon: TrendingUp },
                  { id: 'risks', label: 'Assumptions & Risks', icon: ShieldAlert },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[42px]',
                        isActive
                          ? 'bg-sparkline-midnight text-white shadow-sm'
                          : 'text-slate-600 hover:text-sparkline-midnight hover:bg-slate-100'
                      )}
                    >
                      <Icon className={cn('w-4 h-4', isActive ? 'text-sparkline-cyan' : 'text-slate-400')} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: EXECUTIVE SUMMARY & POSITIONING */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Executive Summary Card */}
                  <Card className="p-6 bg-white border-slate-200 shadow-card space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sparkline-blue" />
                        <h2 className="text-sm font-bold text-sparkline-midnight uppercase tracking-wider">
                          Strategic Executive Summary
                        </h2>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        Synthesized for {currentStrategy.projectName}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed">
                      {currentStrategy.executiveSummary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-sparkline-blue tracking-wider block">
                          Brand Positioning
                        </span>
                        <p className="text-xs font-semibold text-sparkline-midnight leading-snug">
                          {currentStrategy.messaging.brandPositioning}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-sparkline-purple tracking-wider block">
                          Core Marketing Message
                        </span>
                        <p className="text-xs font-semibold text-sparkline-midnight leading-snug">
                          {currentStrategy.messaging.coreMessage}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
                          Recommended Monthly Budget
                        </span>
                        <p className="text-sm font-mono font-bold text-sparkline-midnight">
                          ${currentStrategy.budgetConsiderations.recommendedMonthlyBudget.toLocaleString()}{' '}
                          {currentStrategy.budgetConsiderations.currency}
                        </p>
                        <span className="text-[11px] text-slate-500">
                          {currentStrategy.measurementFramework.suggestedTimeHorizon}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Features vs. Benefits Separation */}
                  <Card className="p-6 bg-white border-slate-200 shadow-card space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sparkline-blue" />
                        <span>Product Analysis: Features vs. Customer Benefits</span>
                      </h2>
                      <span className="text-xs text-slate-400">
                        Separating technical specifications from commercial outcomes
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentStrategy.businessAnalysis.featuresVsBenefits.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                        >
                          <div className="flex items-start gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] uppercase font-bold shrink-0">
                              Feature
                            </span>
                            <span className="font-semibold text-slate-700">{item.feature}</span>
                          </div>
                          <div className="flex items-start gap-2 pt-1 border-t border-slate-200/70">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] uppercase font-bold shrink-0">
                              Benefit
                            </span>
                            <span className="font-bold text-sparkline-midnight leading-snug">
                              {item.customerBenefit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Target Audience Insights: Facts vs. AI Hypotheses */}
                  <Card className="p-6 bg-white border-slate-200 shadow-card space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                        <Users className="w-4 h-4 text-sparkline-purple" />
                        <span>Audience Intelligence: Verified Facts vs. AI Hypotheses</span>
                      </h2>
                      <Badge variant="purple" size="sm">
                        Transparency Framework
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* User Provided Facts */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-1 border-b border-blue-100">
                          <span className="w-2 h-2 rounded-full bg-sparkline-blue" />
                          <h3 className="text-xs font-bold text-sparkline-midnight uppercase tracking-wider">
                            User-Provided Information (Baseline Facts)
                          </h3>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-700">
                          {currentStrategy.audienceAnalysis.userProvidedFacts.map((fact, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-sparkline-blue mt-1.5 shrink-0" />
                              <span>{fact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* AI Inferred Hypotheses */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-1 border-b border-purple-100">
                          <span className="w-2 h-2 rounded-full bg-sparkline-purple" />
                          <h3 className="text-xs font-bold text-sparkline-purple uppercase tracking-wider">
                            AI Strategic Hypotheses (To Be Validated)
                          </h3>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-700">
                          {currentStrategy.audienceAnalysis.aiHypotheses.map((hyp, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-sparkline-purple mt-1.5 shrink-0" />
                              <span>{hyp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Customer Objections & Communication Approach */}
                    <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
                        <span className="font-bold text-rose-800 uppercase text-[10px] tracking-wider block">
                          Primary Customer Objections
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-slate-700">
                          {currentStrategy.audienceAnalysis.customerObjections.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                          Recommended Communication Approach
                        </span>
                        <p className="text-slate-600 leading-relaxed">
                          {currentStrategy.audienceAnalysis.communicationApproach}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Messaging Angles & Hooks */}
                  <Card className="p-6 bg-white border-slate-200 shadow-card space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-sparkline-magenta" />
                        <span>3 Differentiated Creative Messaging Angles</span>
                      </h2>
                      <span className="text-xs text-slate-400">Tested against user pain points</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currentStrategy.messaging.supportingAngles.map((angle, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 space-y-2 text-xs flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-sparkline-purple border border-purple-200">
                              Angle {idx + 1}: {angle.angle}
                            </span>
                            <h3 className="font-bold text-sparkline-midnight text-sm leading-snug">
                              &ldquo;{angle.headline}&rdquo;
                            </h3>
                            <p className="text-slate-600 italic leading-relaxed">
                              &ldquo;{angle.hook}&rdquo;
                            </p>
                          </div>
                          <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-500">
                            <span className="font-semibold text-slate-700">Targets:</span> {angle.targetPainPoint}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB 2: THREE STRATEGIC APPROACHES */}
              {activeTab === 'approaches' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-sparkline-midnight">
                        Select Strategic Horizon
                      </h2>
                      <p className="text-xs text-slate-500">
                        Choose an execution strategy aligned with your cash flow risk tolerance and operational capacity.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {(['conservative', 'balanced', 'aggressive'] as StrategyApproachType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setActiveApproach(type)}
                          className={cn(
                            'px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border min-h-[38px]',
                            activeApproach === type
                              ? 'bg-sparkline-midnight text-white border-sparkline-midnight shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3 Approach Cards Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Conservative */}
                    <Card
                      className={cn(
                        'p-6 space-y-4 transition-all border-2',
                        activeApproach === 'conservative'
                          ? 'border-sparkline-blue bg-blue-50/20 shadow-md ring-2 ring-sparkline-blue/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      )}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          <h3 className="text-sm font-bold text-sparkline-midnight">
                            {currentStrategy.approaches.conservative.name}
                          </h3>
                        </div>
                        <Badge variant="blue" size="sm">
                          Low Risk
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 italic">
                        &ldquo;{currentStrategy.approaches.conservative.tagline}&rdquo;
                      </p>

                      <div className="space-y-2 text-xs">
                        <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">
                          Budget Split & Cadence
                        </span>
                        <p className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                          {currentStrategy.approaches.conservative.budgetAllocation}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs">
                        <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">
                          Key Focus Areas
                        </span>
                        <ul className="space-y-1.5 text-slate-600">
                          {currentStrategy.approaches.conservative.focusAreas.map((area, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-slate-100 text-xs space-y-1">
                        <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                          Trade-Offs & Limitations
                        </span>
                        <p className="text-slate-500 leading-snug">
                          {currentStrategy.approaches.conservative.tradeOffs}
                        </p>
                      </div>
                    </Card>

                    {/* Balanced (Recommended) */}
                    <Card
                      className={cn(
                        'p-6 space-y-4 transition-all border-2 relative',
                        activeApproach === 'balanced'
                          ? 'border-sparkline-purple bg-purple-50/20 shadow-md ring-2 ring-sparkline-purple/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      )}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sparkline-purple text-white shadow-sm">
                        Recommended
                      </div>

                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                          <h3 className="text-sm font-bold text-sparkline-midnight">
                            {currentStrategy.approaches.balanced.name}
                          </h3>
                        </div>
                        <Badge variant="purple" size="sm">
                          Moderate Risk
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 italic">
                        &ldquo;{currentStrategy.approaches.balanced.tagline}&rdquo;
                      </p>

                      <div className="space-y-2 text-xs">
                        <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">
                          Budget Split & Cadence
                        </span>
                        <p className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                          {currentStrategy.approaches.balanced.budgetAllocation}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs">
                        <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">
                          Key Focus Areas
                        </span>
                        <ul className="space-y-1.5 text-slate-600">
                          {currentStrategy.approaches.balanced.focusAreas.map((area, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-slate-100 text-xs space-y-1">
                        <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                          Trade-Offs & Limitations
                        </span>
                        <p className="text-slate-500 leading-snug">
                          {currentStrategy.approaches.balanced.tradeOffs}
                        </p>
                      </div>
                    </Card>

                    {/* Aggressive Growth */}
                    <Card
                      className={cn(
                        'p-6 space-y-4 transition-all border-2',
                        activeApproach === 'aggressive'
                          ? 'border-sparkline-orange bg-orange-50/20 shadow-md ring-2 ring-sparkline-orange/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      )}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-sparkline-orange" />
                          <h3 className="text-sm font-bold text-sparkline-midnight">
                            {currentStrategy.approaches.aggressive.name}
                          </h3>
                        </div>
                        <Badge variant="orange" size="sm">
                          High Risk
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 italic">
                        &ldquo;{currentStrategy.approaches.aggressive.tagline}&rdquo;
                      </p>

                      <div className="space-y-2 text-xs">
                        <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">
                          Budget Split & Cadence
                        </span>
                        <p className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                          {currentStrategy.approaches.aggressive.budgetAllocation}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs">
                        <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">
                          Key Focus Areas
                        </span>
                        <ul className="space-y-1.5 text-slate-600">
                          {currentStrategy.approaches.aggressive.focusAreas.map((area, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-slate-100 text-xs space-y-1">
                        <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                          Trade-Offs & Limitations
                        </span>
                        <p className="text-slate-500 leading-snug">
                          {currentStrategy.approaches.aggressive.tradeOffs}
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* TAB 3: CHANNEL RECOMMENDATIONS */}
              {activeTab === 'channels' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-sparkline-midnight">
                      Prioritized Channel Matrix
                    </h2>
                    <p className="text-xs text-slate-500">
                      Evaluated based on audience demographics, margin buffer, and budget limits.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentStrategy.recommendedChannels.map((ch) => (
                      <Card
                        key={ch.channelId}
                        className="p-6 bg-white border-slate-200 shadow-card space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                              <h3 className="text-sm font-bold text-sparkline-midnight">
                                {ch.channelName}
                              </h3>
                              <span className="text-[11px] text-slate-400 font-medium">
                                Funnel Role: {ch.funnelStage} · Share: {ch.estimatedBudgetShare}
                              </span>
                            </div>
                            <Badge
                              variant={
                                ch.priority === 'High'
                                  ? 'blue'
                                  : ch.priority === 'Medium'
                                    ? 'cyan'
                                    : 'slate'
                              }
                              size="sm"
                            >
                              {ch.priority} Priority
                            </Badge>
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed">
                            {ch.suitabilityReason}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                            <div className="space-y-1.5 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                              <span className="font-bold text-emerald-800 uppercase text-[10px] tracking-wider block">
                                Key Advantages
                              </span>
                              <ul className="space-y-1 text-slate-700">
                                {ch.advantages.map((adv, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-emerald-600 font-bold">✓</span>
                                    <span>{adv}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-1.5 p-3 rounded-lg bg-rose-50/50 border border-rose-100">
                              <span className="font-bold text-rose-800 uppercase text-[10px] tracking-wider block">
                                Limitations & Risks
                              </span>
                              <ul className="space-y-1 text-slate-700">
                                {ch.risksAndLimitations.map((risk, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-rose-600 font-bold">✕</span>
                                    <span>{risk}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span>
                            Effort: <strong className="text-slate-700">{ch.resourceRequirements}</strong>
                          </span>
                          <span className="truncate max-w-[200px]" title={ch.suggestedKpis.join(', ')}>
                            KPIs: <strong className="text-slate-700">{ch.suggestedKpis[0]}</strong>
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Budget Allocation Breakdown */}
                  <Card className="p-6 bg-white border-slate-200 shadow-card space-y-4">
                    <h3 className="text-sm font-bold text-sparkline-midnight">
                      Monthly Budget Allocation Strategy
                    </h3>
                    <p className="text-xs text-slate-600">
                      {currentStrategy.budgetConsiderations.rationale}
                    </p>

                    <div className="space-y-3 pt-2">
                      {currentStrategy.budgetConsiderations.allocationBreakdown.map((alloc, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sparkline-midnight">
                              {alloc.channel} ({alloc.percentage}%)
                            </span>
                            <span className="font-mono font-bold text-sparkline-blue">
                              ${alloc.amount.toLocaleString()} {currentStrategy.budgetConsiderations.currency}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sparkline-blue rounded-full"
                              style={{ width: `${alloc.percentage}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-400">{alloc.purpose}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB 4: MARKETING FUNNEL */}
              {activeTab === 'funnel' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-sparkline-midnight">
                      6-Stage Full Funnel Architecture
                    </h2>
                    <p className="text-xs text-slate-500">
                      Coordinated objectives, tactical actions, and KPIs across the buyer journey.
                    </p>
                  </div>

                  {/* Funnel Stage Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {currentStrategy.funnelStrategy.map((f, idx) => {
                      const isSelected = activeFunnelStage === f.stage;
                      return (
                        <button
                          key={f.stage}
                          type="button"
                          onClick={() => setActiveFunnelStage(f.stage)}
                          className={cn(
                            'p-3 rounded-xl border text-left transition-all min-h-[56px]',
                            isSelected
                              ? 'bg-sparkline-midnight text-white border-sparkline-midnight shadow-md'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          )}
                        >
                          <span className="text-[10px] block font-mono uppercase text-slate-400">
                            Stage 0{idx + 1}
                          </span>
                          <span className="text-xs font-bold truncate block">{f.stage}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Funnel Stage Detail Card */}
                  {(() => {
                    const stageData = currentStrategy.funnelStrategy.find(
                      (s) => s.stage === activeFunnelStage
                    );
                    if (!stageData) return null;

                    return (
                      <Card className="p-6 bg-white border-slate-200 shadow-card space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <span className="text-xs uppercase font-bold text-sparkline-blue tracking-wider block">
                              Active Stage Plan
                            </span>
                            <h3 className="text-base font-extrabold text-sparkline-midnight">
                              {stageData.stage}: {stageData.objective}
                            </h3>
                          </div>
                          <Badge variant="blue" size="md">
                            Funnel Stage
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                              Recommended Marketing Activities
                            </h4>
                            <ul className="space-y-2 text-xs text-slate-700">
                              {stageData.recommendedActivities.map((act, i) => (
                                <li key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{act}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                              Key Evaluation Metrics
                            </h4>
                            <ul className="space-y-2 text-xs text-slate-700">
                              {stageData.keyMetrics.map((metric, i) => (
                                <li key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
                                  <Target className="w-4 h-4 text-sparkline-blue shrink-0 mt-0.5" />
                                  <span className="font-semibold text-sparkline-midnight">{metric}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    );
                  })()}
                </div>
              )}

              {/* TAB 5: ACTION PLAN (NEXT STEPS) */}
              {activeTab === 'action_plan' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-sparkline-midnight">
                        Prioritized Implementation Roadmap
                      </h2>
                      <p className="text-xs text-slate-500">
                        Sequenced tactical action items calibrated by priority and estimated effort.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {currentStrategy.nextSteps.map((step, idx) => (
                      <Card
                        key={step.id || idx}
                        className="p-5 bg-white border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <h3 className="text-sm font-bold text-sparkline-midnight">
                              {step.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                step.priority === 'High'
                                  ? 'magenta'
                                  : step.priority === 'Medium'
                                    ? 'orange'
                                    : 'slate'
                              }
                              size="sm"
                            >
                              {step.priority} Priority
                            </Badge>
                            <Badge variant="cyan" size="sm">
                              {step.suggestedTimeline}
                            </Badge>
                            <button
                              type="button"
                              onClick={() => handleCopyRecommendation(step.title, step.description)}
                              className="p-1 rounded text-slate-400 hover:text-sparkline-blue"
                              title="Copy action item"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed">
                          {step.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-500">
                          <div>
                            <span className="font-semibold text-slate-700 block">Strategic Purpose:</span>
                            <span>{step.expectedPurpose}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700 block">Effort Required:</span>
                            <span>{step.estimatedEffort} Effort</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700 block">Success Metric:</span>
                            <span className="font-bold text-emerald-600">{step.successMetric}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: ASSUMPTIONS, RISKS & UNCERTAINTIES */}
              {activeTab === 'risks' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-sparkline-midnight">
                      Assumptions, Limitations & Empirical Research Needs
                    </h2>
                    <p className="text-xs text-slate-500">
                      Transparent delineation of underlying model assumptions and external research prerequisites.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Explicit Model Assumptions */}
                    <Card className="p-6 bg-white border-slate-200 shadow-card space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <HelpCircle className="w-4 h-4 text-sparkline-blue" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight">
                          Model Assumptions
                        </h3>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {currentStrategy.assumptions.map((assump, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-sparkline-blue mt-1.5 shrink-0" />
                            <span>{assump}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    {/* Areas Requiring External Research */}
                    <Card className="p-6 bg-white border-slate-200 shadow-card space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <ShieldAlert className="w-4 h-4 text-sparkline-orange" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight">
                          Areas Requiring External Market Research
                        </h3>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {currentStrategy.risksAndLimitations.areasRequiringExternalResearch.map(
                          (item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-sparkline-orange mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </Card>

                    {/* Operational Limitations */}
                    <Card className="p-6 bg-white border-slate-200 shadow-card space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight">
                          Operational & Execution Constraints
                        </h3>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {currentStrategy.risksAndLimitations.operationalLimitations.map((lim, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                            <span>{lim}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    {/* Measurement & Reporting Governance */}
                    <Card className="p-6 bg-white border-slate-200 shadow-card space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <Target className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight">
                          Measurement Governance & Attribution
                        </h3>
                      </div>
                      <div className="space-y-2 text-xs text-slate-700">
                        <p>
                          <strong className="text-slate-900">Primary North Star:</strong>{' '}
                          {currentStrategy.measurementFramework.primaryMetric}
                        </p>
                        <p>
                          <strong className="text-slate-900">Reporting Cadence:</strong>{' '}
                          {currentStrategy.measurementFramework.reportingCadence}
                        </p>
                        <span className="font-bold text-slate-900 block pt-1">
                          Tracking Infrastructure:
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-slate-600">
                          {currentStrategy.measurementFramework.measurementMethods.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  </div>

                  {/* Commercial Reality Disclaimer */}
                  <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed">
                    <strong>Commercial Disclaimer:</strong> Sparkline AI synthesizes marketing hypotheses
                    based on submitted business inputs. All performance metrics, ROAS benchmarks, and
                    conversion rates are indicative planning estimates and must be tested in live ad auctions
                    before scaling capital commitments.
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
