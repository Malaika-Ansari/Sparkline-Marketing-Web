import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/components/common/Feedback';
import { projectService } from '@/services/project.service';
import { strategyService, AiStatusResponse } from '@/services/strategy.service';
import { marketResearchService } from '@/services/market-research.service';
import { MarketingProject, Competitor } from '@/types/project';
import {
  MarketResearchReport,
  MarketResearchInput,
  ResearchDepth,
  ImpactLevel,
  ResearchAssistantMessage,
} from '@/types/market-research';
import {
  Compass,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BarChart2,
  Target,
  ShieldAlert,
  Globe,
  Building2,
  ExternalLink,
  Copy,
  Printer,
  Edit3,
  Trash2,
  Layers,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  RefreshCw,
  FileText,
  Scale,
  ArrowUpRight,
  Calendar,
  Search,
  BookOpen,
  HelpCircle,
  Columns,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const MarketResearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialProjectId = searchParams.get('project');
  const { addToast } = useToast();

  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [reports, setReports] = useState<MarketResearchReport[]>([]);
  const [currentReport, setCurrentReport] = useState<MarketResearchReport | null>(null);

  // AI Connection State
  const [aiStatus, setAiStatus] = useState<AiStatusResponse>({
    isConfigured: false,
    provider: 'Google Gemini',
    model: 'gemini-1.5-flash',
  });
  const [checkingAi, setCheckingAi] = useState(true);

  // Form & Generation State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [generationState, setGenerationState] = useState<
    'idle' | 'preparing' | 'analyzing' | 'generating' | 'saving' | 'completed' | 'failed'
  >('idle');
  const [generationError, setGenerationError] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'industry-demand' | 'opportunities' | 'pestle' | 'trends-challenges' | 'sources' | 'assistant'
  >('industry-demand');

  // Filters
  const [opportunityPriorityFilter, setOpportunityPriorityFilter] = useState<string>('All');
  const [opportunityCategoryFilter, setOpportunityCategoryFilter] = useState<string>('All');
  const [pestleTypeFilter, setPestleTypeFilter] = useState<string>('All');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>('All');

  // Input Form State
  const [industry, setIndustry] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [geographicLocation, setGeographicLocation] = useState('');
  const [targetCustomerSegment, setTargetCustomerSegment] = useState('');
  const [mainCompetitors, setMainCompetitors] = useState('');
  const [productPriceRange, setProductPriceRange] = useState('');
  const [businessObjectives, setBusinessObjectives] = useState('');
  const [researchTopic, setResearchTopic] = useState('');
  const [researchPeriod, setResearchPeriod] = useState('Last 12-24 Months (Current Outlook)');
  const [researchDepth, setResearchDepth] = useState<ResearchDepth>('standard');
  const [specificQuestions, setSpecificQuestions] = useState('');
  const [keywords, setKeywords] = useState('');

  // Interactive Assistant State
  const [assistantInput, setAssistantInput] = useState('');
  const [isAskingAssistant, setIsAskingAssistant] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Modals
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [newReportTitle, setNewReportTitle] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareTargetReportId, setCompareTargetReportId] = useState<string>('');

  // Load initial data
  useEffect(() => {
    const loadedProjects = projectService.getProjects();
    setProjects(loadedProjects);

    if (loadedProjects.length > 0) {
      if (initialProjectId && loadedProjects.some((p: MarketingProject) => p.id === initialProjectId)) {
        setSelectedProjectId(initialProjectId);
      } else {
        const first = loadedProjects[0];
        if (first) {
          setSelectedProjectId(first.id);
        }
      }
    }

    // Check Gemini AI status
    const checkAi = async () => {
      try {
        const status = await strategyService.checkAiStatus();
        setAiStatus(status);
      } catch {
        setAiStatus({
          isConfigured: false,
          provider: 'Google Gemini',
          model: 'gemini-1.5-flash',
          message: 'AI proxy unreachable.',
        });
      } finally {
        setCheckingAi(false);
      }
    };
    checkAi();
  }, [initialProjectId]);

  // When selected project changes, load its reports and sync default form values
  useEffect(() => {
    if (!selectedProjectId) {
      setReports([]);
      setCurrentReport(null);
      return;
    }

    const projectReports = marketResearchService.getReports(selectedProjectId);
    setReports(projectReports);

    if (projectReports.length > 0) {
      setCurrentReport(projectReports[0] || null);
    } else {
      setCurrentReport(null);
    }

    // Sync input fields from project data
    const activeProj = projects.find((p) => p.id === selectedProjectId);
    if (activeProj) {
      setIndustry(activeProj.business.industry || '');
      setProductCategory(activeProj.products[0]?.category || '');
      setTargetMarket(activeProj.business.regionsServed || activeProj.business.location || '');
      setGeographicLocation(activeProj.business.location || '');
      setTargetCustomerSegment(activeProj.audience?.customerType || '');
      setMainCompetitors(
        activeProj.competitors && activeProj.competitors.length > 0
          ? activeProj.competitors.map((c: Competitor) => c.name).join(', ')
          : ''
      );
      setProductPriceRange(
        activeProj.products[0]
          ? `$${activeProj.products[0].sellingPrice} ${activeProj.products[0].currency}`
          : '$50 USD'
      );
      setBusinessObjectives(
        activeProj.marketing.primaryObjective || 'Analyze market demand and validate growth opportunities'
      );
      setResearchTopic(`Market Intelligence & Growth Vectors for ${activeProj.business.brandName}`);
      setResearchPeriod('Last 12-24 Months (Current Outlook)');
      setResearchDepth('standard');
      setSpecificQuestions(
        'What are the primary customer buying triggers, demand barriers, and competitive moats in this space?'
      );
      setKeywords(
        activeProj.products[0]?.features?.slice(0, 3).join(', ') || 'market demand, customer acquisition'
      );
    }
  }, [selectedProjectId, projects]);

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (activeTab === 'assistant' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentReport?.assistantChatHistory, activeTab]);

  // Handle Start Research
  const handleStartResearch = async () => {
    if (!selectedProject) {
      addToast({
        title: 'Project Required',
        message: 'Please select or create a marketing project first.',
        type: 'warning',
      });
      return;
    }

    setGenerationError('');
    setGenerationState('preparing');

    const inputData: MarketResearchInput = {
      projectId: selectedProject.id,
      industry: industry || selectedProject.business.industry,
      productCategory: productCategory || selectedProject.products[0]?.category || '',
      targetMarket: targetMarket || selectedProject.business.regionsServed || '',
      geographicLocation: geographicLocation || selectedProject.business.location || '',
      targetCustomerSegment: targetCustomerSegment || selectedProject.audience?.customerType || '',
      mainCompetitors: mainCompetitors || '',
      productPriceRange: productPriceRange || '',
      businessObjectives: businessObjectives || '',
      researchTopic: researchTopic || `Market Intelligence for ${selectedProject.business.brandName}`,
      researchPeriod: researchPeriod || 'Last 12-24 Months',
      researchDepth,
      specificQuestions: specificQuestions || '',
      keywords: keywords || '',
    };

    try {
      setTimeout(() => setGenerationState('analyzing'), 800);
      setTimeout(() => setGenerationState('generating'), 2200);

      const generated = await marketResearchService.generateMarketResearch(selectedProject, inputData);

      setGenerationState('saving');
      const updatedReports = marketResearchService.getReports(selectedProject.id);
      setReports(updatedReports);
      setCurrentReport(generated);
      setGenerationState('completed');

      addToast({
        title: 'Market Research Generated',
        message: `Successfully analyzed industry dynamics for ${selectedProject.business.brandName}.`,
        type: 'success',
      });

      // Collapse form after generation
      setIsFormOpen(false);
    } catch (err: unknown) {
      setGenerationState('failed');
      const msg = err instanceof Error ? err.message : 'Market research generation encountered an unexpected issue.';
      setGenerationError(msg);
      addToast({
        title: 'Research Analysis Failed',
        message: msg,
        type: 'error',
      });
    }
  };

  // Handle Ask Research Assistant
  const handleAskAssistant = async (questionText?: string) => {
    const text = (questionText || assistantInput).trim();
    if (!text || !currentReport) return;

    const userMessage: ResearchAssistantMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...(currentReport.assistantChatHistory || []), userMessage];
    const updatedReport = { ...currentReport, assistantChatHistory: updatedHistory };
    setCurrentReport(updatedReport);
    marketResearchService.saveReport(updatedReport);

    setAssistantInput('');
    setIsAskingAssistant(true);

    try {
      const res = await marketResearchService.askResearchAssistant(
        currentReport,
        text,
        updatedHistory
      );

      const assistantMessage: ResearchAssistantMessage = {
        id: `msg-asst-${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        timestamp: new Date().toISOString(),
        citedSourceIds: res.citedSourceIds,
        isStrategicReasoning: res.citedSourceIds?.length === 0,
      };

      const finalHistory = [...updatedHistory, assistantMessage];
      const finalReport = { ...currentReport, assistantChatHistory: finalHistory };
      setCurrentReport(finalReport);
      marketResearchService.saveReport(finalReport);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Assistant query failed.';
      addToast({
        title: 'Assistant Error',
        message: errorMsg,
        type: 'error',
      });
    } finally {
      setIsAskingAssistant(false);
    }
  };

  // Copy Key Findings to Clipboard
  const handleCopyFindings = () => {
    if (!currentReport) return;

    const text = `SPARKLINE MARKET INTELLIGENCE REPORT
Project: ${currentReport.projectName}
Title: ${currentReport.reportTitle}
Date: ${new Date(currentReport.createdAt).toLocaleDateString()}
Depth: ${currentReport.researchDepth.toUpperCase()}

EXECUTIVE SUMMARY:
${currentReport.executiveSummary}

KEY DEMAND INDICATORS:
${currentReport.marketDemand.demandIndicators.map((d) => `• ${d}`).join('\n')}

TOP OPPORTUNITIES:
${currentReport.opportunities
  .slice(0, 3)
  .map((o) => `• [${o.priority} Priority] ${o.title}: ${o.explanation}`)
  .join('\n')}

PESTLE HIGHLIGHTS:
${currentReport.pestle
  .slice(0, 4)
  .map((p) => `• [${p.category} - ${p.type}] ${p.factorTitle}: ${p.description}`)
  .join('\n')}

STRATEGIC RECOMMENDATIONS:
${currentReport.strategicRecommendations
  .map((s) => `• [${s.priority}] ${s.title}: ${s.description} (Timeline: ${s.timeline})`)
  .join('\n')}
`;

    navigator.clipboard.writeText(text);
    addToast({
      title: 'Findings Copied',
      message: 'Key research insights copied to clipboard formatted for email or slack.',
      type: 'success',
    });
  };

  // Handle Rename
  const handleRenameReport = () => {
    if (!currentReport || !newReportTitle.trim()) return;
    marketResearchService.updateReportTitle(currentReport.id, newReportTitle.trim());
    const updated = { ...currentReport, reportTitle: newReportTitle.trim() };
    setCurrentReport(updated);
    setReports((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
    setRenameModalOpen(false);
    addToast({
      title: 'Report Renamed',
      message: `Report renamed to "${newReportTitle.trim()}".`,
      type: 'success',
    });
  };

  // Handle Delete
  const handleDeleteReport = () => {
    if (!currentReport) return;
    marketResearchService.deleteReport(currentReport.id);
    const remaining = reports.filter((r) => r.id !== currentReport.id);
    setReports(remaining);
    setCurrentReport(remaining.length > 0 ? remaining[0] || null : null);
    setDeleteModalOpen(false);
    addToast({
      title: 'Report Deleted',
      message: 'The research report has been removed.',
      type: 'info',
    });
  };

  // Helper for Priority Badges
  const getImpactBadgeVariant = (
    level: ImpactLevel
  ): 'magenta' | 'orange' | 'blue' | 'slate' => {
    switch (level) {
      case 'High':
        return 'magenta';
      case 'Medium':
        return 'orange';
      case 'Low':
        return 'blue';
      default:
        return 'slate';
    }
  };

  // Filtered Opportunities
  const filteredOpportunities = useMemo(() => {
    if (!currentReport) return [];
    return currentReport.opportunities.filter((opp) => {
      const matchPriority =
        opportunityPriorityFilter === 'All' || opp.priority === opportunityPriorityFilter;
      const matchCategory =
        opportunityCategoryFilter === 'All' || opp.category === opportunityCategoryFilter;
      return matchPriority && matchCategory;
    });
  }, [currentReport, opportunityPriorityFilter, opportunityCategoryFilter]);

  // Filtered PESTLE Factors
  const filteredPestle = useMemo(() => {
    if (!currentReport) return [];
    return currentReport.pestle.filter((factor) => {
      if (pestleTypeFilter === 'All') return true;
      return factor.type === pestleTypeFilter;
    });
  }, [currentReport, pestleTypeFilter]);

  // Filtered Sources
  const filteredSources = useMemo(() => {
    if (!currentReport) return [];
    return currentReport.sources.filter((src) => {
      if (sourceTypeFilter === 'All') return true;
      return src.sourceType === sourceTypeFilter;
    });
  }, [currentReport, sourceTypeFilter]);

  // Starter questions for assistant
  const starterQuestions = [
    'What is the biggest barrier to entry in this market?',
    'How does competitor pricing pressure affect our unit economics?',
    'Which PESTLE factor represents the greatest commercial threat?',
    'What low-effort opportunity should we prioritize first?',
  ];

  return (
    <div className="space-y-8 pb-16">
      <SEO
        title="Market Research & Industry Intelligence | Sparkline Marketing"
        description="Discover industry conditions, identify opportunities, understand market demand, and make more informed marketing decisions."
      />

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sparkline-blue/10 text-sparkline-blue border border-sparkline-blue/20">
              <Compass className="w-3.5 h-3.5" />
              Market Intelligence Engine
            </span>
            <Badge variant="cyan" size="sm">
              Phase 09
            </Badge>
            {!checkingAi && (
              <Badge variant={aiStatus.isConfigured ? 'blue' : 'orange'} size="sm">
                {aiStatus.isConfigured ? 'Gemini 1.5 Flash Connected' : 'Demo Synthesis Mode'}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight">
            Understand Your Market Before You Invest.
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Discover industry conditions, identify opportunities, understand market demand, and make more informed marketing decisions.
          </p>
        </div>

        {/* Global Page Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {currentReport && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyFindings}
                className="gap-1.5 text-xs font-medium"
                title="Copy structured findings to clipboard"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Findings</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5 text-xs font-medium"
                title="Print or save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </Button>
            </>
          )}
          {selectedProject && (
            <Link to={`/dashboard/projects/${selectedProject.id}`}>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <span>View Project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 2. NO PROJECTS GUARD */}
      {projects.length === 0 ? (
        <Card className="text-center py-12 px-6 bg-gradient-to-b from-white to-slate-50/50">
          <div className="w-16 h-16 rounded-2xl bg-sparkline-blue/10 text-sparkline-blue flex items-center justify-center mx-auto mb-4 border border-sparkline-blue/20">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-sparkline-midnight mb-2">
            No Marketing Projects Found
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            To generate tailored market research and industry intelligence, first create a business profile with your products, audience, and goals.
          </p>
          <Link to="/dashboard/projects/new">
            <Button variant="primary" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Create Your First Project</span>
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          {/* 3. TOP COMMAND CENTER: PROJECT SELECTOR & RESEARCH BAR */}
          <Card className="bg-white border-slate-200/80 shadow-sm p-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Project Selector */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sparkline-blue/30 focus:border-sparkline-blue transition-colors"
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.business.brandName} ({proj.business.industry})
                    </option>
                  ))}
                </select>
              </div>

              {/* Research Topic */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Research Topic or Angle
                </label>
                <input
                  type="text"
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                  placeholder="e.g. Clean Skincare Demand & Competitive Dynamics"
                  className="w-full h-10 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sparkline-blue/30 focus:border-sparkline-blue transition-colors"
                />
              </div>

              {/* Research Depth Selector */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Research Depth
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  {(['quick', 'standard', 'deep'] as ResearchDepth[]).map((depth) => (
                    <button
                      key={depth}
                      type="button"
                      onClick={() => setResearchDepth(depth)}
                      className={cn(
                        'py-1.5 text-[11px] font-semibold rounded-md capitalize transition-all',
                        researchDepth === depth
                          ? 'bg-white text-sparkline-midnight shadow-sm border border-slate-200/80 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      )}
                    >
                      {depth === 'quick' ? 'Quick' : depth === 'standard' ? 'Standard' : 'Deep'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Research Action & Tune Toggle */}
              <div className="md:col-span-3 flex items-center gap-2">
                <Button
                  variant="primary"
                  onClick={handleStartResearch}
                  disabled={generationState !== 'idle' && generationState !== 'completed' && generationState !== 'failed'}
                  className="flex-1 h-10 gap-2 text-xs font-semibold shadow-md bg-gradient-to-r from-sparkline-blue to-sparkline-purple hover:brightness-105"
                >
                  {generationState !== 'idle' && generationState !== 'completed' && generationState !== 'failed' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Start Research</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className={cn(
                    'h-10 px-3 text-xs gap-1 border-slate-200',
                    isFormOpen && 'bg-slate-100 text-sparkline-blue border-sparkline-blue/30'
                  )}
                  title="Tune research parameters"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{isFormOpen ? 'Close' : 'Tune'}</span>
                </Button>
              </div>
            </div>

            {/* Saved Reports Dropdown Bar if multiple reports exist */}
            {reports.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Saved Reports ({reports.length}):
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {reports.map((rep) => (
                      <button
                        key={rep.id}
                        onClick={() => setCurrentReport(rep)}
                        className={cn(
                          'px-2.5 py-1 rounded-md text-xs transition-all flex items-center gap-1.5',
                          currentReport?.id === rep.id
                            ? 'bg-sparkline-blue/10 text-sparkline-blue font-bold border border-sparkline-blue/30'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        )}
                      >
                        <span>{rep.reportTitle}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">
                          (v{rep.version})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {currentReport && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>Generated {new Date(currentReport.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => {
                        setNewReportTitle(currentReport.reportTitle);
                        setRenameModalOpen(true);
                      }}
                      className="p-1 hover:text-sparkline-blue text-slate-400 transition-colors"
                      title="Rename Report"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {reports.length > 1 && (
                      <button
                        onClick={() => {
                          const other = reports.find((r) => r.id !== currentReport.id);
                          if (other) setCompareTargetReportId(other.id);
                          setCompareModalOpen(true);
                        }}
                        className="p-1 hover:text-sparkline-purple text-slate-400 transition-colors"
                        title="Compare with another version"
                      >
                        <Columns className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteModalOpen(true)}
                      className="p-1 hover:text-rose-600 text-slate-400 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* 4. COLLAPSIBLE INPUT TUNING DRAWER */}
          {isFormOpen && (
            <Card className="bg-slate-50/70 border-slate-200/90 shadow-sm p-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-5">
                <div>
                  <h3 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-sparkline-blue" />
                    Tune Market Research Parameters
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize industry nuances, competitor lists, pricing assumptions, and research queries.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFormOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Clean Cosmetics, Cloud Security"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Macro category classification
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Category</label>
                  <input
                    type="text"
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    placeholder="e.g. Vitamin C Serums, CSPM Platform"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Specific sub-category or niche
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Geographic Market</label>
                  <input
                    type="text"
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    placeholder="e.g. United States, United Kingdom, EU"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Primary geographical focus
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Customer Segment</label>
                  <input
                    type="text"
                    value={targetCustomerSegment}
                    onChange={(e) => setTargetCustomerSegment(e.target.value)}
                    placeholder="e.g. Skincare Enthusiasts, DevSecOps Engineers"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Core audience persona archetype
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Main Competitors</label>
                  <input
                    type="text"
                    value={mainCompetitors}
                    onChange={(e) => setMainCompetitors(e.target.value)}
                    placeholder="e.g. SkinCeuticals, Drunk Elephant, Sunday Riley"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Direct or indirect market alternatives
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price Range / Unit Tier</label>
                  <input
                    type="text"
                    value={productPriceRange}
                    onChange={(e) => setProductPriceRange(e.target.value)}
                    placeholder="e.g. $45 - $60 USD"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Pricing baseline for competitive anchoring
                  </span>
                </div>

                <div className="md:col-span-3">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Specific Strategic Questions to Solve
                  </label>
                  <input
                    type="text"
                    value={specificQuestions}
                    onChange={(e) => setSpecificQuestions(e.target.value)}
                    placeholder="e.g. What are the key drivers of churn? Where are incumbent brands losing customer trust?"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    The AI engine will prioritize answering these specific commercial uncertainties.
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Reset to project defaults
                    if (selectedProject) {
                      setIndustry(selectedProject.business.industry);
                      setProductCategory(selectedProject.products[0]?.category || '');
                      setTargetMarket(selectedProject.business.regionsServed || '');
                      setMainCompetitors(selectedProject.competitors.map((c: Competitor) => c.name).join(', '));
                    }
                  }}
                  className="text-xs text-slate-600"
                >
                  Reset Defaults
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleStartResearch}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Analysis With Custom Parameters</span>
                </Button>
              </div>
            </Card>
          )}

          {/* 5. GENERATION PROGRESS OVERLAY */}
          {generationState !== 'idle' && generationState !== 'completed' && generationState !== 'failed' && (
            <Card className="bg-gradient-to-r from-sparkline-midnight via-sparkline-slate to-sparkline-midnight text-white p-8 shadow-xl text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full border-3 border-sparkline-blue/30 border-t-sparkline-cyan animate-spin mx-auto" />
                <h3 className="text-lg font-bold">Synthesizing Market Intelligence</h3>
                <p className="text-xs text-slate-300">
                  {generationState === 'preparing' && 'Structuring market parameters and product unit economics...'}
                  {generationState === 'analyzing' && 'Evaluating industry conditions, demand indicators, and PESTLE forces...'}
                  {generationState === 'generating' && 'Synthesizing market opportunities, trends, and risk mitigations...'}
                  {generationState === 'saving' && 'Persisting report to local intelligence vault...'}
                </p>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={cn(
                      'h-full bg-gradient-to-r from-sparkline-cyan to-sparkline-blue transition-all duration-700',
                      generationState === 'preparing' && 'w-1/4',
                      generationState === 'analyzing' && 'w-2/4',
                      generationState === 'generating' && 'w-3/4',
                      generationState === 'saving' && 'w-full'
                    )}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* 6. GENERATION ERROR ALERT */}
          {generationState === 'failed' && generationError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                  Research Generation Issue
                </h4>
                <p className="text-xs mt-1 text-rose-700">{generationError}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartResearch}
                className="shrink-0 text-xs border-rose-300 hover:bg-rose-100"
              >
                Retry Analysis
              </Button>
            </div>
          )}

          {/* 7. RESEARCH RESULTS DASHBOARD */}
          {currentReport ? (
            <div className="space-y-6">
              {/* Epistemic Grounding & Source Transparency Banner */}
              <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 border border-blue-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-sparkline-blue animate-pulse" />
                  <span className="font-semibold text-sparkline-midnight">
                    Sparkline Epistemic Grounding:
                  </span>
                  <span className="text-slate-600">
                    Real-time search API unconfigured. Findings synthesized from verified industry frameworks, macroeconomic benchmarks, and strategic deduction. No synthetic search volume numbers have been generated.
                  </span>
                </div>
                <Badge variant="cyan" size="sm" className="shrink-0 font-mono">
                  TRANSPARENT METHODOLOGY
                </Badge>
              </div>

              {/* Executive Summary Card & Metrics Row */}
              <Card className="bg-white border-slate-200/90 shadow-sm p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="blue" size="sm">
                        {currentReport.projectName}
                      </Badge>
                      <Badge variant="slate" size="sm">
                        Version {currentReport.version}
                      </Badge>
                      <Badge variant="purple" size="sm" className="capitalize">
                        {currentReport.researchDepth} Depth
                      </Badge>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(currentReport.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-sparkline-midnight tracking-tight">
                      {currentReport.reportTitle}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('assistant')}
                      className="gap-1.5 text-xs text-sparkline-blue border-sparkline-blue/30 hover:bg-sparkline-blue/10"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask AI Assistant</span>
                    </Button>
                  </div>
                </div>

                {/* Narrative Summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-sparkline-blue" />
                    Executive Summary & Commercial Diagnosis
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentReport.executiveSummary}
                  </p>
                </div>

                {/* Quantitative Metric Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                    <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">
                      Prioritized Opportunities
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl font-black text-sparkline-midnight">
                        {currentReport.opportunities.length}
                      </span>
                      <span className="text-xs text-emerald-600 font-semibold">
                        ({currentReport.opportunities.filter((o) => o.priority === 'High').length} High Priority)
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
                    <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider block">
                      PESTLE Balance
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl font-black text-sparkline-midnight">
                        {currentReport.pestle.filter((p) => p.type === 'Opportunity').length} Opps
                      </span>
                      <span className="text-xs text-rose-600 font-semibold">
                        / {currentReport.pestle.filter((p) => p.type === 'Threat').length} Threats
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-cyan-50/50 border border-cyan-100">
                    <span className="text-[11px] font-semibold text-cyan-800 uppercase tracking-wider block">
                      Verified Citations
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl font-black text-sparkline-midnight">
                        {currentReport.sources.length}
                      </span>
                      <span className="text-xs text-slate-500">
                        {currentReport.sources.filter((s) => s.isVerified).length} Verified
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                      Methodology Status
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-base font-bold text-emerald-700">
                        Rigorous Synthesis
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 8. INTERACTIVE DASHBOARD TABS NAVIGATION */}
              <div className="border-b border-slate-200">
                <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto pb-px" aria-label="Tabs">
                  {[
                    { id: 'industry-demand', label: 'Industry & Demand', icon: BarChart2 },
                    { id: 'opportunities', label: 'Market Opportunities', icon: Target, badge: currentReport.opportunities.length },
                    { id: 'pestle', label: 'PESTLE Framework', icon: Scale, badge: currentReport.pestle.length },
                    { id: 'trends-challenges', label: 'Trends & Challenges', icon: TrendingUp },
                    { id: 'sources', label: 'Source Verification', icon: BookOpen, badge: currentReport.sources.length },
                    { id: 'assistant', label: 'AI Research Assistant', icon: MessageSquare },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          'py-3 px-3 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap',
                          isActive
                            ? 'border-sparkline-blue text-sparkline-blue font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                        {tab.badge !== undefined && (
                          <span
                            className={cn(
                              'px-1.5 py-0.5 text-[10px] rounded-full font-bold',
                              isActive
                                ? 'bg-sparkline-blue/10 text-sparkline-blue'
                                : 'bg-slate-100 text-slate-600'
                            )}
                          >
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* TAB 1: INDUSTRY & DEMAND SIGNALS */}
              {activeTab === 'industry-demand' && (
                <div className="space-y-6">
                  {/* Industry Overview Card */}
                  <Card className="bg-white border-slate-200/80 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-sparkline-midnight flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-sparkline-blue" />
                        Industry Overview & Structural Dynamics
                      </h3>
                      <Badge variant="blue" size="sm">
                        {currentReport.inputSnapshot?.industry || 'Category Analysis'}
                      </Badge>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {currentReport.industryOverview.description}
                    </p>

                    {/* Characteristics Grid */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                        Dominant Category Characteristics
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {currentReport.industryOverview.characteristics.map((char, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-2.5 text-xs text-slate-700"
                          >
                            <CheckCircle2 className="w-4 h-4 text-sparkline-blue shrink-0 mt-0.5" />
                            <span>{char}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Main Categories & Developments Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-sparkline-purple" />
                          Key Product & Service Categories
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {currentReport.industryOverview.mainCategories.map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-sparkline-cyan" />
                          Important Industry Developments
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-700">
                          {currentReport.industryOverview.importantDevelopments.map((dev, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-sparkline-cyan shrink-0 mt-1.5" />
                              <span>{dev}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>

                  {/* Market Demand Signals Card */}
                  <Card className="bg-white border-slate-200/80 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-sparkline-midnight flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-sparkline-purple" />
                        Market Demand & Search Behavior Signals
                      </h3>
                      <Badge variant="cyan" size="sm">
                        Qualitative Demand Mapping
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Demand Indicators */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-sparkline-blue" />
                          Observed Demand Indicators
                        </h4>
                        <div className="space-y-2">
                          {currentReport.marketDemand.demandIndicators.map((ind, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-blue-50/40 border border-blue-100 text-xs text-slate-800 leading-relaxed"
                            >
                              {ind}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Search Interest Signals */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5 text-sparkline-purple" />
                          Search Intent & Query Signals
                        </h4>
                        <div className="space-y-2">
                          {currentReport.marketDemand.searchInterestSignals.map((sig, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-purple-50/40 border border-purple-100 text-xs text-slate-800 leading-relaxed"
                            >
                              {sig}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Customer Needs & Buying Motivations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                          Customer Needs Summary
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-700">
                          {currentReport.marketDemand.customerNeedsSummary.map((need, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-sparkline-blue shrink-0 mt-1.5" />
                              <span>{need}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                          Primary Buying Motivations
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-700">
                          {currentReport.marketDemand.primaryBuyingMotivations.map((mot, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-sparkline-purple shrink-0 mt-1.5" />
                              <span>{mot}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Seasonality & Regional Differences */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60">
                        <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          Seasonal Demand Patterns
                        </h5>
                        <p className="text-xs text-amber-950 leading-relaxed">
                          {currentReport.marketDemand.seasonalDemandPatterns}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/60">
                        <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                          Geographic Variance
                        </h5>
                        <p className="text-xs text-blue-950 leading-relaxed">
                          {currentReport.marketDemand.geographicDemandDifferences}
                        </p>
                      </div>
                    </div>

                    {/* Methodological Disclosure */}
                    <div className="p-3 rounded-lg bg-slate-100 text-slate-600 text-[11px] leading-relaxed border border-slate-200 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Methodological Note:</strong> {currentReport.marketDemand.demandLimitations}
                      </span>
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB 2: MARKET OPPORTUNITIES & PRIORITIZATION */}
              {activeTab === 'opportunities' && (
                <div className="space-y-6">
                  {/* Filters Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600">Priority:</span>
                        <select
                          value={opportunityPriorityFilter}
                          onChange={(e) => setOpportunityPriorityFilter(e.target.value)}
                          className="h-8 px-2.5 text-xs bg-white border border-slate-300 rounded-md font-medium text-slate-800"
                        >
                          <option value="All">All Priorities</option>
                          <option value="High">High Priority Only</option>
                          <option value="Medium">Medium Priority</option>
                          <option value="Low">Low Priority</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600">Category:</span>
                        <select
                          value={opportunityCategoryFilter}
                          onChange={(e) => setOpportunityCategoryFilter(e.target.value)}
                          className="h-8 px-2.5 text-xs bg-white border border-slate-300 rounded-md font-medium text-slate-800"
                        >
                          <option value="All">All Categories</option>
                          <option value="Underserved Need">Underserved Need</option>
                          <option value="New Segment">New Segment</option>
                          <option value="Product Differentiation">Product Differentiation</option>
                          <option value="Geographic Expansion">Geographic Expansion</option>
                          <option value="Strategic Partnership">Strategic Partnership</option>
                          <option value="Channel Innovation">Channel Innovation</option>
                        </select>
                      </div>
                    </div>

                    <span className="text-xs text-slate-500 font-medium">
                      Showing {filteredOpportunities.length} of {currentReport.opportunities.length} opportunities
                    </span>
                  </div>

                  {/* Opportunities Cards Grid */}
                  <div className="grid grid-cols-1 gap-6">
                    {filteredOpportunities.map((opp) => (
                      <Card
                        key={opp.id}
                        className="bg-white border-slate-200/90 shadow-sm hover:border-sparkline-blue/30 transition-all p-6 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <Badge variant={getImpactBadgeVariant(opp.priority)} size="sm">
                                {opp.priority} Priority
                              </Badge>
                              <Badge variant="slate" size="sm">
                                {opp.category}
                              </Badge>
                              {opp.evidenceStrength === 'Insufficient Evidence' && (
                                <Badge variant="orange" size="sm">
                                  Insufficient Evidence
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-base font-bold text-sparkline-midnight">
                              {opp.title}
                            </h3>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: {opp.id}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {opp.explanation}
                        </p>

                        {/* Multi-Dimensional Scoring Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-center">
                          <div className="p-2">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Customer Fit
                            </span>
                            <span className="text-xs font-bold text-sparkline-midnight mt-0.5 block truncate" title={opp.customerRelevance}>
                              {opp.customerRelevance}
                            </span>
                          </div>

                          <div className="p-2">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Business Fit
                            </span>
                            <span className="text-xs font-bold text-sparkline-midnight mt-0.5 block truncate" title={opp.businessFit}>
                              {opp.businessFit}
                            </span>
                          </div>

                          <div className="p-2">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Evidence
                            </span>
                            <span
                              className={cn(
                                'text-xs font-bold mt-0.5 block',
                                opp.evidenceStrength === 'Insufficient Evidence'
                                  ? 'text-amber-600'
                                  : 'text-sparkline-blue'
                              )}
                            >
                              {opp.evidenceStrength}
                            </span>
                          </div>

                          <div className="p-2">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Effort
                            </span>
                            <span className="text-xs font-bold text-slate-700 mt-0.5 block">
                              {opp.implementationEffort}
                            </span>
                          </div>

                          <div className="p-2">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Strategic Value
                            </span>
                            <span className="text-xs font-bold text-sparkline-purple mt-0.5 block">
                              {opp.strategicValue}
                            </span>
                          </div>

                          <div className="p-2">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Risk Level
                            </span>
                            <span
                              className={cn(
                                'text-xs font-bold mt-0.5 block',
                                opp.riskLevel === 'High' ? 'text-rose-600' : 'text-slate-700'
                              )}
                            >
                              {opp.riskLevel}
                            </span>
                          </div>
                        </div>

                        {/* Suggested Next Action */}
                        <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200/70 flex items-start gap-2.5">
                          <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <span className="font-bold text-emerald-900 block mb-0.5">
                              Recommended Next Step:
                            </span>
                            <span className="text-emerald-950">
                              {opp.suggestedNextAction}
                            </span>
                          </div>
                        </div>

                        {/* Supporting Evidence Footnote */}
                        {opp.supportingEvidence && (
                          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Evidence basis: {opp.supportingEvidence}</span>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PESTLE ANALYSIS */}
              {activeTab === 'pestle' && (
                <div className="space-y-6">
                  {/* Top Header & Filter */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <h3 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                        <Scale className="w-4 h-4 text-sparkline-blue" />
                        Macroeconomic & External Environmental Analysis (PESTLE)
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        6 pillars evaluating regulatory, economic, and technological forces.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">Filter:</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        {['All', 'Opportunity', 'Threat'].map((type) => (
                          <button
                            key={type}
                            onClick={() => setPestleTypeFilter(type)}
                            className={cn(
                              'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors',
                              pestleTypeFilter === type
                                ? 'bg-sparkline-midnight text-white'
                                : 'text-slate-600 hover:text-slate-900'
                            )}
                          >
                            {type === 'All' ? 'All Factors' : `${type}s Only`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 6-Pillar Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredPestle.map((factor) => {
                      const isOpportunity = factor.type === 'Opportunity';
                      return (
                        <Card
                          key={factor.id}
                          className={cn(
                            'border transition-all flex flex-col justify-between p-5 space-y-4',
                            isOpportunity
                              ? 'bg-gradient-to-b from-white to-emerald-50/20 border-emerald-200/80'
                              : 'bg-gradient-to-b from-white to-rose-50/20 border-rose-200/80'
                          )}
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <Badge variant="blue" size="sm">
                                {factor.category}
                              </Badge>
                              <Badge
                                variant={isOpportunity ? 'cyan' : 'magenta'}
                                size="sm"
                                className="font-semibold"
                              >
                                {factor.type}
                              </Badge>
                            </div>

                            <h4 className="text-sm font-bold text-sparkline-midnight">
                              {factor.factorTitle}
                            </h4>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {factor.description}
                            </p>
                          </div>

                          <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Commercial Relevance:
                              </span>
                              <span className="text-slate-700 leading-relaxed block">
                                {factor.businessRelevance}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-1 text-[11px]">
                              <span className="text-slate-500">
                                Impact: <strong>{factor.potentialImpact}</strong>
                              </span>
                              <span className="text-slate-500 font-mono">
                                Conf: {factor.confidenceLevel}
                              </span>
                            </div>

                            {factor.evidenceOrSource && (
                              <div className="text-[10px] text-slate-400 font-mono truncate" title={factor.evidenceOrSource}>
                                Ref: {factor.evidenceOrSource}
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: TRENDS & CHALLENGES */}
              {activeTab === 'trends-challenges' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Emerging Market Trends */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-sparkline-midnight flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-sparkline-cyan" />
                        Emerging Market Trends
                      </h3>
                      <Badge variant="cyan" size="sm">
                        {currentReport.trends.length} Identified
                      </Badge>
                    </div>

                    <div className="space-y-3.5">
                      {currentReport.trends.map((trend) => (
                        <Card
                          key={trend.id}
                          className="bg-white border-slate-200/90 shadow-sm p-5 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <Badge variant="purple" size="sm">
                              {trend.category}
                            </Badge>
                            {trend.publicationDate && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                {trend.publicationDate}
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-sparkline-midnight">
                            {trend.trendTitle}
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {trend.description}
                          </p>

                          {trend.sourceTitle && (
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                              <span className="truncate max-w-[240px]">
                                Source: {trend.sourceTitle}
                              </span>
                              {trend.isExternalSourceVerified && (
                                <Badge variant="blue" size="sm" className="text-[10px]">
                                  Verified
                                </Badge>
                              )}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Market Challenges & Risks */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-sparkline-midnight flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        Market Challenges & Risk Mitigations
                      </h3>
                      <Badge variant="magenta" size="sm">
                        {currentReport.challenges.length} Risk Factors
                      </Badge>
                    </div>

                    <div className="space-y-3.5">
                      {currentReport.challenges.map((chal) => (
                        <Card
                          key={chal.id}
                          className="bg-white border-slate-200/90 shadow-sm p-5 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <Badge variant="orange" size="sm">
                              {chal.category}
                            </Badge>
                            <Badge variant={getImpactBadgeVariant(chal.severity)} size="sm">
                              {chal.severity} Severity
                            </Badge>
                          </div>

                          <h4 className="text-sm font-bold text-sparkline-midnight">
                            {chal.title}
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {chal.description}
                          </p>

                          {/* Mitigation Box */}
                          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                            <span className="font-bold text-slate-800 block mb-0.5">
                              Mitigation Action:
                            </span>
                            <span className="text-slate-600 leading-relaxed">
                              {chal.mitigationRecommendation}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SOURCE VERIFICATION & RESEARCH TRANSPARENCY */}
              {activeTab === 'sources' && (
                <div className="space-y-6">
                  {/* Top Explainer */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-sparkline-blue" />
                        Authoritative Sources & Verified Citations
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Authoritative publications, peer-reviewed industry benchmarks, and regulatory registries.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">Type:</span>
                      <select
                        value={sourceTypeFilter}
                        onChange={(e) => setSourceTypeFilter(e.target.value)}
                        className="h-8 px-2.5 text-xs bg-white border border-slate-300 rounded-md font-medium text-slate-800"
                      >
                        <option value="All">All Types</option>
                        <option value="Primary Research">Primary Research</option>
                        <option value="Industry Publication">Industry Publication</option>
                        <option value="Regulatory Document">Regulatory Document</option>
                        <option value="Analytical Commentary">Analytical Commentary</option>
                      </select>
                    </div>
                  </div>

                  {/* Sources List */}
                  <div className="grid grid-cols-1 gap-4">
                    {filteredSources.map((source) => (
                      <Card
                        key={source.id}
                        className="bg-white border-slate-200/90 shadow-sm p-5 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="blue" size="sm">
                                {source.sourceType}
                              </Badge>
                              <Badge variant="slate" size="sm">
                                {source.researchCategory}
                              </Badge>
                              {source.isVerified && (
                                <Badge variant="cyan" size="sm">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-sparkline-midnight">
                              {source.sourceTitle}
                            </h4>
                            <span className="text-xs text-slate-500 font-medium">
                              Publisher: {source.publisherOrWebsite}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {source.sourceUrl && (
                              <a
                                href={source.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-sparkline-blue hover:underline font-semibold"
                              >
                                <span>Inspect Citation</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Verified Claim */}
                        <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-xs text-slate-700 leading-relaxed">
                          <span className="font-bold text-slate-800 block mb-0.5">
                            Substantiated Claim:
                          </span>
                          "{source.relevantClaim}"
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                          <span>Publication Date: {source.publicationDate || 'Recent'}</span>
                          <span>Retrieved: {source.accessDate}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: INTERACTIVE AI RESEARCH ASSISTANT */}
              {activeTab === 'assistant' && (
                <div className="space-y-6">
                  <Card className="bg-white border-slate-200/90 shadow-sm p-6 flex flex-col h-[650px]">
                    {/* Assistant Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sparkline-blue/10 text-sparkline-blue flex items-center justify-center font-bold">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-sparkline-midnight flex items-center gap-1.5">
                            Sparkline Market Intelligence Assistant
                            <Badge variant="cyan" size="sm">
                              Grounded in Report
                            </Badge>
                          </h3>
                          <p className="text-xs text-slate-500">
                            Ask anything regarding customer demand, PESTLE forces, competitor weaknesses, or opportunity sizing.
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!currentReport) return;
                          const resetReport = {
                            ...currentReport,
                            assistantChatHistory: [
                              {
                                id: `msg-welcome-${Date.now()}`,
                                role: 'assistant' as const,
                                content: `Assistant history cleared. What else would you like to explore regarding **${currentReport.projectName}**?`,
                                timestamp: new Date().toISOString(),
                                isStrategicReasoning: true,
                              },
                            ],
                          };
                          setCurrentReport(resetReport);
                          marketResearchService.saveReport(resetReport);
                        }}
                        className="text-xs text-slate-400 hover:text-slate-700"
                      >
                        Clear Chat
                      </Button>
                    </div>

                    {/* Chat Message Scroll Area */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                      {currentReport.assistantChatHistory?.map((msg) => {
                        const isUser = msg.role === 'user';
                        return (
                          <div
                            key={msg.id}
                            className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}
                          >
                            <div
                              className={cn(
                                'max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed',
                                isUser
                                  ? 'bg-sparkline-midnight text-white rounded-br-none'
                                  : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200/80'
                              )}
                            >
                              <div className="whitespace-pre-wrap">{msg.content}</div>

                              {/* Cited Sources Footer */}
                              {msg.citedSourceIds && msg.citedSourceIds.length > 0 && (
                                <div className="mt-3 pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5 text-[11px]">
                                  <span className="text-slate-500 font-semibold flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    Cited Sources:
                                  </span>
                                  {msg.citedSourceIds.map((sid) => {
                                    const srcObj = currentReport.sources.find((s) => s.id === sid);
                                    return (
                                      <span
                                        key={sid}
                                        className="px-2 py-0.5 rounded bg-white text-sparkline-blue border border-slate-200 font-mono font-medium"
                                        title={srcObj?.sourceTitle || sid}
                                      >
                                        {srcObj?.publisherOrWebsite || sid}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}

                              {!isUser && msg.isStrategicReasoning && (
                                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                                  ⚡ Sparkline Strategic Reasoning
                                </div>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        );
                      })}

                      {isAskingAssistant && (
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl w-48 text-xs text-slate-500 border border-slate-200">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-sparkline-blue" />
                          <span>Consulting research vault...</span>
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Starter Prompts Bar */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 shrink-0">
                      {starterQuestions.map((sq, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAskAssistant(sq)}
                          disabled={isAskingAssistant}
                          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 font-medium transition-colors text-left"
                        >
                          "{sq}"
                        </button>
                      ))}
                    </div>

                    {/* Chat Input Bar */}
                    <div className="pt-3 flex items-center gap-2 shrink-0">
                      <input
                        type="text"
                        value={assistantInput}
                        onChange={(e) => setAssistantInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAskAssistant();
                          }
                        }}
                        placeholder="Ask about competitor weaknesses, price sensitivity, PESTLE threats..."
                        disabled={isAskingAssistant}
                        className="flex-1 h-11 px-4 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sparkline-blue/30 focus:border-sparkline-blue transition-colors"
                      />
                      <Button
                        variant="primary"
                        onClick={() => handleAskAssistant()}
                        disabled={!assistantInput.trim() || isAskingAssistant}
                        className="h-11 px-4 gap-1.5 text-xs font-semibold shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            /* 9. EMPTY REPORT STATE */
            <Card className="text-center py-16 px-6 bg-gradient-to-b from-white to-slate-50/50 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-sparkline-blue/10 text-sparkline-blue flex items-center justify-center mx-auto border border-sparkline-blue/20">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-sparkline-midnight">
                Ready to Investigate Market Conditions
              </h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                No market intelligence report has been generated for <strong>{selectedProject?.business.brandName}</strong> yet. Select your desired depth above and click <strong>Start Research</strong> to synthesize an authoritative category report.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={handleStartResearch}
                  className="gap-2 shadow-md bg-gradient-to-r from-sparkline-blue to-sparkline-purple"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Market Research</span>
                </Button>
              </div>
            </Card>
          )}
        </>
      )}

      {/* RENAME MODAL */}
      {renameModalOpen && (
        <div className="fixed inset-0 z-50 bg-sparkline-midnight/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="bg-white max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-sparkline-midnight">Rename Research Report</h3>
            <input
              type="text"
              value={newReportTitle}
              onChange={(e) => setNewReportTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              placeholder="Report Title"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setRenameModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleRenameReport}>
                Save Title
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-sparkline-midnight/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="bg-white max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-sparkline-midnight">Delete Report?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong>{currentReport?.reportTitle}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleDeleteReport} className="bg-rose-600 hover:bg-rose-700">
                Delete Report
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* COMPARE REPORTS MODAL */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 bg-sparkline-midnight/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="bg-white max-w-3xl w-full p-6 space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-sparkline-midnight flex items-center gap-2">
                <Columns className="w-4 h-4 text-sparkline-blue" />
                Compare Research Reports Side by Side
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setCompareModalOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Active Report (Left)
                </span>
                <span className="text-xs font-semibold text-sparkline-midnight">
                  {currentReport?.reportTitle} (v{currentReport?.version})
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Comparison Report (Right)
                </span>
                <select
                  value={compareTargetReportId}
                  onChange={(e) => setCompareTargetReportId(e.target.value)}
                  className="w-full text-xs p-1.5 border border-slate-300 rounded"
                >
                  {reports
                    .filter((r) => r.id !== currentReport?.id)
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.reportTitle} (v{r.version})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {(() => {
              const target = reports.find((r) => r.id === compareTargetReportId);
              if (!currentReport || !target) return null;

              return (
                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3 bg-slate-50 rounded-lg space-y-3">
                    <h5 className="font-bold text-slate-800">Executive Summary</h5>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {currentReport.executiveSummary.slice(0, 300)}...
                    </p>
                    <h5 className="font-bold text-slate-800 pt-2">Top Opportunities</h5>
                    <ul className="space-y-1 text-[11px] text-slate-700">
                      {currentReport.opportunities.slice(0, 3).map((o) => (
                        <li key={o.id}>• {o.title} ({o.priority})</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg space-y-3">
                    <h5 className="font-bold text-slate-800">Executive Summary</h5>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {target.executiveSummary.slice(0, 300)}...
                    </p>
                    <h5 className="font-bold text-slate-800 pt-2">Top Opportunities</h5>
                    <ul className="space-y-1 text-[11px] text-slate-700">
                      {target.opportunities.slice(0, 3).map((o) => (
                        <li key={o.id}>• {o.title} ({o.priority})</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </Card>
        </div>
      )}
    </div>
  );
};
