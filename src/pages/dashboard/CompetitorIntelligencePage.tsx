import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/components/common/Feedback';
import { projectService } from '@/services/project.service';
import { strategyService, AiStatusResponse } from '@/services/strategy.service';
import { competitorService } from '@/services/competitor.service';
import { MarketingProject } from '@/types/project';
import {
  CompetitorProfile,
  CompetitorAnalysisReport,
  CompetitorRelationship,
  CompetitorAssistantMessage,
  ImpactPriority,
} from '@/types/competitor';
import {
  Target,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Building2,
  ExternalLink,
  Copy,
  Printer,
  Edit3,
  Trash2,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  RefreshCw,
  FileText,
  Scale,
  ArrowUpRight,
  BookOpen,
  Columns,
  X,
  Plus,
  Crosshair,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const CompetitorIntelligencePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialProjectId = searchParams.get('project');
  const { addToast } = useToast();

  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [competitors, setCompetitors] = useState<CompetitorProfile[]>([]);
  const [reports, setReports] = useState<CompetitorAnalysisReport[]>([]);
  const [currentReport, setCurrentReport] = useState<CompetitorAnalysisReport | null>(null);

  // AI Connection State
  const [aiStatus, setAiStatus] = useState<AiStatusResponse>({
    isConfigured: false,
    provider: 'Google Gemini',
    model: 'gemini-1.5-flash',
  });
  const [checkingAi, setCheckingAi] = useState(true);

  // Form & Generation State
  const [generationState, setGenerationState] = useState<
    'idle' | 'preparing' | 'analyzing' | 'generating' | 'saving' | 'completed' | 'failed'
  >('idle');
  const [generationError, setGenerationError] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'comparison' | 'swot' | 'positioning' | 'opportunities' | 'sources' | 'assistant'
  >('comparison');

  // SWOT Selected Entity
  const [selectedSwotEntityId, setSelectedSwotEntityId] = useState<string>('user-business');

  // Filters
  const [comparisonFilter, setComparisonFilter] = useState<string>('All');
  const [opportunityPriorityFilter, setOpportunityPriorityFilter] = useState<string>('All');
  const [opportunityCategoryFilter, setOpportunityCategoryFilter] = useState<string>('All');

  // Assistant State
  const [assistantInput, setAssistantInput] = useState('');
  const [isAskingAssistant, setIsAskingAssistant] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Modals
  const [competitorModalOpen, setCompetitorModalOpen] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState<CompetitorProfile | null>(null);
  const [discoveryModalOpen, setDiscoveryModalOpen] = useState(false);
  const [discoveryIndustry, setDiscoveryIndustry] = useState('');
  const [discoveryMarket, setDiscoveryMarket] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [newReportTitle, setNewReportTitle] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareTargetReportId, setCompareTargetReportId] = useState<string>('');

  // Competitor Form Inputs
  const [compName, setCompName] = useState('');
  const [compWebsite, setCompWebsite] = useState('');
  const [compIndustry, setCompIndustry] = useState('');
  const [compLocation, setCompLocation] = useState('');
  const [compRelationship, setCompRelationship] = useState<CompetitorRelationship>('Direct');
  const [compDescription, setCompDescription] = useState('');
  const [compPricing, setCompPricing] = useState('');
  const [compSellingPoints, setCompSellingPoints] = useState('');
  const [compStrengths, setCompStrengths] = useState('');
  const [compWeaknesses, setCompWeaknesses] = useState('');
  const [compNotes, setCompNotes] = useState('');
  const [compLinkedin, setCompLinkedin] = useState('');
  const [compTwitter, setCompTwitter] = useState('');
  const [compInstagram, setCompInstagram] = useState('');

  // Load initial data
  useEffect(() => {
    const loadedProjects = projectService.getProjects();
    setProjects(loadedProjects);

    if (loadedProjects.length > 0) {
      if (initialProjectId && loadedProjects.some((p: MarketingProject) => p.id === initialProjectId)) {
        setSelectedProjectId(initialProjectId);
      } else {
        const first = loadedProjects[0];
        if (first) setSelectedProjectId(first.id);
      }
    }

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

  // When selected project changes, sync competitors & reports
  useEffect(() => {
    if (!selectedProjectId) {
      setCompetitors([]);
      setReports([]);
      setCurrentReport(null);
      return;
    }

    const projectCompetitors = competitorService.getCompetitors(selectedProjectId);
    setCompetitors(projectCompetitors);

    const projectReports = competitorService.getReports(selectedProjectId);
    setReports(projectReports);

    if (projectReports.length > 0) {
      setCurrentReport(projectReports[0] || null);
    } else {
      setCurrentReport(null);
    }

    // Default discovery fields
    const activeProj = projects.find((p) => p.id === selectedProjectId);
    if (activeProj) {
      setDiscoveryIndustry(activeProj.business.industry || '');
      setDiscoveryMarket(activeProj.business.regionsServed || activeProj.business.location || '');
    }
  }, [selectedProjectId, projects]);

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  // Scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'assistant' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentReport?.assistantChatHistory, activeTab]);

  // Open Competitor Modal for Create or Edit
  const handleOpenCompetitorModal = (comp?: CompetitorProfile) => {
    if (comp) {
      setEditingCompetitor(comp);
      setCompName(comp.name);
      setCompWebsite(comp.websiteUrl || '');
      setCompIndustry(comp.industry);
      setCompLocation(comp.locationOrMarket);
      setCompRelationship(comp.relationship);
      setCompDescription(comp.productDescription);
      setCompPricing(comp.pricingInfo || '');
      setCompSellingPoints(comp.mainSellingPoints.join(', '));
      setCompStrengths(comp.knownStrengths.join(', '));
      setCompWeaknesses(comp.knownWeaknesses.join(', '));
      setCompNotes(comp.notes || '');
      setCompLinkedin(comp.socialLinks?.linkedin || '');
      setCompTwitter(comp.socialLinks?.twitter || '');
      setCompInstagram(comp.socialLinks?.instagram || '');
    } else {
      setEditingCompetitor(null);
      setCompName('');
      setCompWebsite('');
      setCompIndustry(selectedProject?.business.industry || '');
      setCompLocation(selectedProject?.business.regionsServed || '');
      setCompRelationship('Direct');
      setCompDescription('');
      setCompPricing('');
      setCompSellingPoints('');
      setCompStrengths('');
      setCompWeaknesses('');
      setCompNotes('');
      setCompLinkedin('');
      setCompTwitter('');
      setCompInstagram('');
    }
    setCompetitorModalOpen(true);
  };

  // Save Competitor Profile
  const handleSaveCompetitor = () => {
    if (!selectedProject || !compName.trim()) {
      addToast({
        title: 'Competitor Name Required',
        message: 'Please provide a valid competitor brand name.',
        type: 'warning',
      });
      return;
    }

    const now = new Date().toISOString();
    const newProfile: CompetitorProfile = {
      id: editingCompetitor ? editingCompetitor.id : `comp-${Date.now()}`,
      projectId: selectedProject.id,
      name: compName.trim(),
      websiteUrl: compWebsite.trim() || undefined,
      industry: compIndustry.trim() || selectedProject.business.industry,
      locationOrMarket: compLocation.trim() || selectedProject.business.location,
      relationship: compRelationship,
      productDescription: compDescription.trim() || 'Competitor product or service offering.',
      pricingInfo: compPricing.trim() || 'Unknown',
      mainSellingPoints: compSellingPoints
        ? compSellingPoints.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      knownStrengths: compStrengths
        ? compStrengths.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      knownWeaknesses: compWeaknesses
        ? compWeaknesses.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      notes: compNotes.trim() || undefined,
      socialLinks: {
        linkedin: compLinkedin.trim() || undefined,
        twitter: compTwitter.trim() || undefined,
        instagram: compInstagram.trim() || undefined,
      },
      isUserEntered: true,
      researchStatus: 'Manual',
      createdAt: editingCompetitor ? editingCompetitor.createdAt : now,
      updatedAt: now,
    };

    competitorService.saveCompetitor(newProfile);
    const updated = competitorService.getCompetitors(selectedProject.id);
    setCompetitors(updated);
    setCompetitorModalOpen(false);

    addToast({
      title: editingCompetitor ? 'Competitor Updated' : 'Competitor Added',
      message: `${newProfile.name} profile has been saved.`,
      type: 'success',
    });
  };

  // Delete Competitor Profile
  const handleDeleteCompetitor = (id: string) => {
    if (!selectedProject) return;
    competitorService.deleteCompetitor(id);
    const updated = competitorService.getCompetitors(selectedProject.id);
    setCompetitors(updated);
    addToast({
      title: 'Competitor Removed',
      message: 'Competitor profile has been deleted.',
      type: 'info',
    });
  };

  // Handle Competitor Discovery
  const handleDiscoverCompetitors = async () => {
    if (!selectedProject) return;
    setIsDiscovering(true);

    try {
      const discovered = await competitorService.discoverCompetitors(
        selectedProject,
        discoveryIndustry || selectedProject.business.industry,
        discoveryMarket || selectedProject.business.regionsServed || 'Global'
      );

      const updated = competitorService.getCompetitors(selectedProject.id);
      setCompetitors(updated);
      setDiscoveryModalOpen(false);

      addToast({
        title: 'Competitors Discovered',
        message: `Identified ${discovered.length} real commercial competitors in ${discoveryIndustry}.`,
        type: 'success',
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Discovery failed.';
      addToast({
        title: 'Discovery Failed',
        message: msg,
        type: 'error',
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  // Handle Generate Competitor Analysis
  const handleGenerateAnalysis = async () => {
    if (!selectedProject) {
      addToast({
        title: 'Project Required',
        message: 'Please select a marketing project first.',
        type: 'warning',
      });
      return;
    }

    setGenerationError('');
    setGenerationState('preparing');

    try {
      setTimeout(() => setGenerationState('analyzing'), 800);
      setTimeout(() => setGenerationState('generating'), 2400);

      const generated = await competitorService.generateCompetitorAnalysis(
        selectedProject,
        competitors
      );

      setGenerationState('saving');
      const updatedReports = competitorService.getReports(selectedProject.id);
      setReports(updatedReports);
      setCurrentReport(generated);
      setGenerationState('completed');

      addToast({
        title: 'Competitor Analysis Complete',
        message: `Successfully synthesized benchmark for ${selectedProject.business.brandName}.`,
        type: 'success',
      });
    } catch (err: unknown) {
      setGenerationState('failed');
      const msg =
        err instanceof Error ? err.message : 'Competitor intelligence generation failed.';
      setGenerationError(msg);
      addToast({
        title: 'Analysis Failed',
        message: msg,
        type: 'error',
      });
    }
  };

  // Handle Ask Assistant
  const handleAskAssistant = async (questionText?: string) => {
    const text = (questionText || assistantInput).trim();
    if (!text || !currentReport) return;

    const userMessage: CompetitorAssistantMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...(currentReport.assistantChatHistory || []), userMessage];
    const updatedReport = { ...currentReport, assistantChatHistory: updatedHistory };
    setCurrentReport(updatedReport);
    competitorService.saveReport(updatedReport);

    setAssistantInput('');
    setIsAskingAssistant(true);

    try {
      const res = await competitorService.askCompetitorAssistant(
        currentReport,
        text,
        updatedHistory
      );

      const assistantMessage: CompetitorAssistantMessage = {
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
      competitorService.saveReport(finalReport);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Assistant query failed.';
      addToast({
        title: 'Assistant Error',
        message: msg,
        type: 'error',
      });
    } finally {
      setIsAskingAssistant(false);
    }
  };

  // Copy Key Findings to Clipboard
  const handleCopyFindings = () => {
    if (!currentReport) return;

    const text = `SPARKLINE COMPETITIVE INTELLIGENCE REPORT
Project: ${currentReport.projectName}
Title: ${currentReport.reportTitle}
Date: ${new Date(currentReport.createdAt).toLocaleDateString()}

EXECUTIVE SUMMARY:
${currentReport.executiveSummary}

COMPETITOR COMPARISON BENCHMARK:
${currentReport.comparisonRows
  .map(
    (c) =>
      `• ${c.competitorName} (${c.relationship}): Pricing: ${c.pricingPosition} | USP: ${c.mainValueProposition}`
  )
  .join('\n')}

TOP COMPETITIVE OPPORTUNITIES:
${currentReport.competitiveOpportunities
  .slice(0, 3)
  .map((o) => `• [${o.priority} Priority] ${o.title}: ${o.suggestedNextAction}`)
  .join('\n')}

KEY RISKS TO MONITOR:
${currentReport.competitiveRisksToMonitor.map((r) => `• ${r}`).join('\n')}
`;

    navigator.clipboard.writeText(text);
    addToast({
      title: 'Findings Copied',
      message: 'Competitor intelligence copied to clipboard.',
      type: 'success',
    });
  };

  // Handle Rename
  const handleRenameReport = () => {
    if (!currentReport || !newReportTitle.trim()) return;
    competitorService.updateReportTitle(currentReport.id, newReportTitle.trim());
    const updated = { ...currentReport, reportTitle: newReportTitle.trim() };
    setCurrentReport(updated);
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setRenameModalOpen(false);
    addToast({
      title: 'Report Renamed',
      message: `Report renamed to "${newReportTitle.trim()}".`,
      type: 'success',
    });
  };

  // Handle Delete Report
  const handleDeleteReport = () => {
    if (!currentReport) return;
    competitorService.deleteReport(currentReport.id);
    const remaining = reports.filter((r) => r.id !== currentReport.id);
    setReports(remaining);
    setCurrentReport(remaining.length > 0 ? remaining[0] || null : null);
    setDeleteModalOpen(false);
    addToast({
      title: 'Report Deleted',
      message: 'The competitor report has been removed.',
      type: 'info',
    });
  };

  // Filtered Comparison Rows
  const filteredComparisonRows = useMemo(() => {
    if (!currentReport) return [];
    return currentReport.comparisonRows.filter((r) => {
      if (comparisonFilter === 'All') return true;
      return r.relationship === comparisonFilter;
    });
  }, [currentReport, comparisonFilter]);

  // Filtered Opportunities
  const filteredOpportunities = useMemo(() => {
    if (!currentReport) return [];
    return currentReport.competitiveOpportunities.filter((opp) => {
      const matchPriority =
        opportunityPriorityFilter === 'All' || opp.priority === opportunityPriorityFilter;
      const matchCategory =
        opportunityCategoryFilter === 'All' || opp.category === opportunityCategoryFilter;
      return matchPriority && matchCategory;
    });
  }, [currentReport, opportunityPriorityFilter, opportunityCategoryFilter]);

  // Selected SWOT Entity Analysis
  const activeSwot = useMemo(() => {
    if (!currentReport) return null;
    return (
      currentReport.swotAnalyses.find((s) => s.entityId === selectedSwotEntityId) ||
      currentReport.swotAnalyses[0] ||
      null
    );
  }, [currentReport, selectedSwotEntityId]);

  // Helper for Priority Badges
  const getImpactBadgeVariant = (
    level: ImpactPriority
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

  // Starter assistant queries
  const starterQuestions = [
    'Who is my strongest direct competitor?',
    'How can my product stand out?',
    'What are the major positioning differences?',
    'Which competitor weaknesses are supported by evidence?',
    'What customer needs appear underserved?',
    'How should I differentiate my pricing?',
    'What should I monitor over the next three months?',
  ];

  return (
    <div className="space-y-8 pb-16">
      <SEO
        title="Competitor Intelligence & SWOT Analysis | Sparkline Marketing"
        description="Understand competing businesses, compare market positioning, identify weaknesses, and uncover opportunities to stand out."
      />

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sparkline-blue/10 text-sparkline-blue border border-sparkline-blue/20">
              <Crosshair className="w-3.5 h-3.5" />
              Competitor Intelligence
            </span>
            <Badge variant="cyan" size="sm">
              Phase 10
            </Badge>
            {!checkingAi && (
              <Badge variant={aiStatus.isConfigured ? 'blue' : 'orange'} size="sm">
                {aiStatus.isConfigured ? 'Gemini 1.5 Flash Connected' : 'Manual Benchmark Mode'}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight">
            Know Your Competition. Find Your Advantage.
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Understand competing businesses, compare market positioning, identify weaknesses, and uncover opportunities to stand out.
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
            To compare competitive positioning and perform SWOT benchmarks, first create a business profile with your products, audience, and goals.
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
          {/* 3. TOP COMMAND BAR: PROJECT SELECTOR & COMPETITOR ACTIONS */}
          <Card className="bg-white border-slate-200/80 shadow-sm p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Project Selector */}
              <div className="md:col-span-4">
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

              {/* Competitor Management Pill */}
              <div className="md:col-span-4 flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleOpenCompetitorModal()}
                  className="flex-1 h-10 gap-1.5 text-xs font-semibold border-slate-200"
                >
                  <Plus className="w-4 h-4 text-sparkline-blue" />
                  <span>Add Competitor ({competitors.length})</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setDiscoveryModalOpen(true)}
                  className="h-10 px-3 text-xs gap-1 border-slate-200 text-slate-600 hover:text-sparkline-blue"
                  title="Discover real market rivals"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Discover</span>
                </Button>
              </div>

              {/* Start Analysis Button */}
              <div className="md:col-span-4 flex items-center gap-2">
                <Button
                  variant="primary"
                  onClick={handleGenerateAnalysis}
                  disabled={
                    generationState !== 'idle' &&
                    generationState !== 'completed' &&
                    generationState !== 'failed'
                  }
                  className="w-full h-10 gap-2 text-xs font-semibold shadow-md bg-gradient-to-r from-sparkline-blue to-sparkline-purple hover:brightness-105"
                >
                  {generationState !== 'idle' &&
                  generationState !== 'completed' &&
                  generationState !== 'failed' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Benchmarking...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze Competitors</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Business Snapshot Strip */}
            {selectedProject && (
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-sparkline-midnight">
                    <Building2 className="w-3.5 h-3.5 text-sparkline-blue" />
                    {selectedProject.business.brandName}
                  </span>
                  <span>• Industry: <strong>{selectedProject.business.industry}</strong></span>
                  <span>• USP: <em>"{selectedProject.marketPosition.whatMakesYouDifferent || selectedProject.products[0]?.usp || 'Specialized Quality'}"</em></span>
                  <span>• Price: <strong>${selectedProject.products[0]?.sellingPrice || 50} {selectedProject.products[0]?.currency || 'USD'}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="slate" size="sm">
                    {competitors.filter((c) => c.relationship === 'Direct').length} Direct /{' '}
                    {competitors.filter((c) => c.relationship === 'Indirect').length} Indirect
                  </Badge>
                </div>
              </div>
            )}

            {/* Saved Reports Dropdown Bar if multiple reports exist */}
            {reports.length > 0 && (
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
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

          {/* 4. ACTIVE COMPETITOR ROSTER STRIP */}
          {competitors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-semibold uppercase tracking-wider">
                  Configured Competitors ({competitors.length})
                </span>
                <span>Click a rival to edit details or inspect research</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {competitors.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-sm hover:border-sparkline-blue/40 transition-all flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <Badge
                          variant={comp.relationship === 'Direct' ? 'blue' : 'purple'}
                          size="sm"
                        >
                          {comp.relationship} Rival
                        </Badge>
                        <Badge
                          variant={comp.isUserEntered ? 'slate' : 'cyan'}
                          size="sm"
                          className="text-[10px]"
                        >
                          {comp.isUserEntered ? 'User Entered' : 'Researched'}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-bold text-sparkline-midnight truncate">
                        {comp.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {comp.productDescription}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700 truncate max-w-[150px]">
                        {comp.pricingInfo || 'Unknown Price'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenCompetitorModal(comp)}
                          className="p-1 text-slate-400 hover:text-sparkline-blue transition-colors"
                          title="Edit Competitor"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCompetitor(comp.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Competitor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. GENERATION PROGRESS OVERLAY */}
          {generationState !== 'idle' &&
            generationState !== 'completed' &&
            generationState !== 'failed' && (
              <Card className="bg-gradient-to-r from-sparkline-midnight via-sparkline-slate to-sparkline-midnight text-white p-8 shadow-xl text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-full border-3 border-sparkline-blue/30 border-t-sparkline-cyan animate-spin mx-auto" />
                  <h3 className="text-lg font-bold">Synthesizing Competitor Intelligence</h3>
                  <p className="text-xs text-slate-300">
                    {generationState === 'preparing' &&
                      'Structuring rival profiles, value propositions, and price anchors...'}
                    {generationState === 'analyzing' &&
                      'Evaluating SWOT quadrants, positioning dimensions, and public reviews...'}
                    {generationState === 'generating' &&
                      'Synthesizing asymmetric competitive openings and differentiation moats...'}
                    {generationState === 'saving' && 'Persisting report to intelligence vault...'}
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
                  Benchmarking Issue
                </h4>
                <p className="text-xs mt-1 text-rose-700">{generationError}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateAnalysis}
                className="shrink-0 text-xs border-rose-300 hover:bg-rose-100"
              >
                Retry Analysis
              </Button>
            </div>
          )}

          {/* 7. RESULTS DASHBOARD */}
          {currentReport ? (
            <div className="space-y-6">
              {/* Epistemic Grounding & Source Transparency Banner */}
              <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 border border-blue-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-sparkline-blue animate-pulse" />
                  <span className="font-semibold text-sparkline-midnight">
                    Public Evidence Grounding:
                  </span>
                  <span className="text-slate-600">
                    Analysis based strictly on publicly observable positioning, pricing, customer reviews, and verified messaging. No claims of access to private competitor accounts or proprietary analytics.
                  </span>
                </div>
                <Badge variant="cyan" size="sm" className="shrink-0 font-mono">
                  ZERO FABRICATIONS
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
                    <Target className="w-3.5 h-3.5 text-sparkline-blue" />
                    Executive Summary & Asymmetric Advantage
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentReport.executiveSummary}
                  </p>
                </div>

                {/* Quantitative Metric Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                    <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">
                      Rivals Analyzed
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl font-black text-sparkline-midnight">
                        {currentReport.comparisonRows.length - 1}
                      </span>
                      <span className="text-xs text-slate-500">
                        (+ Our Business)
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
                    <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider block">
                      Competitive Openings
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl font-black text-sparkline-midnight">
                        {currentReport.competitiveOpportunities.length}
                      </span>
                      <span className="text-xs text-emerald-600 font-semibold">
                        ({currentReport.competitiveOpportunities.filter((o) => o.priority === 'High').length} High Priority)
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-cyan-50/50 border border-cyan-100">
                    <span className="text-[11px] font-semibold text-cyan-800 uppercase tracking-wider block">
                      SWOT Profiles
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl font-black text-sparkline-midnight">
                        {currentReport.swotAnalyses.length}
                      </span>
                      <span className="text-xs text-slate-500">
                        Entities Modeled
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                      Public Citations
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl font-black text-sparkline-midnight">
                        {currentReport.sources.length}
                      </span>
                      <span className="text-xs text-slate-500">Verified</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 8. INTERACTIVE DASHBOARD TABS NAVIGATION */}
              <div className="border-b border-slate-200">
                <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto pb-px" aria-label="Tabs">
                  {[
                    { id: 'comparison', label: 'Comparison Matrix', icon: Columns },
                    { id: 'swot', label: 'SWOT Analysis', icon: Scale, badge: currentReport.swotAnalyses.length },
                    { id: 'positioning', label: 'Positioning & 2x2 Map', icon: Crosshair },
                    { id: 'opportunities', label: 'Gaps & Opportunities', icon: Target, badge: currentReport.competitiveOpportunities.length },
                    { id: 'sources', label: 'Verified Citations', icon: BookOpen, badge: currentReport.sources.length },
                    { id: 'assistant', label: 'AI Competitor Assistant', icon: MessageSquare },
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

              {/* TAB 1: COMPETITOR COMPARISON MATRIX */}
              {activeTab === 'comparison' && (
                <div className="space-y-6">
                  {/* Filters Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">Rival Relationship:</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        {['All', 'Direct', 'Indirect'].map((type) => (
                          <button
                            key={type}
                            onClick={() => setComparisonFilter(type)}
                            className={cn(
                              'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors',
                              comparisonFilter === type
                                ? 'bg-sparkline-midnight text-white'
                                : 'text-slate-600 hover:text-slate-900'
                            )}
                          >
                            {type === 'All' ? 'All Rivals' : `${type} Only`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <span className="text-xs text-slate-500">
                      Comparing {filteredComparisonRows.length} entities side-by-side
                    </span>
                  </div>

                  {/* Horizontal Scroll Comparison Table */}
                  <Card className="bg-white border-slate-200/90 shadow-sm p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[900px] text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                            <th className="p-4 w-48">Company / Brand</th>
                            <th className="p-4 w-44">Pricing Position</th>
                            <th className="p-4 w-60">Value Proposition & USP</th>
                            <th className="p-4 w-52">Target Audience</th>
                            <th className="p-4 w-60">Observed Strengths</th>
                            <th className="p-4 w-60">Observed Weaknesses</th>
                            <th className="p-4 w-60">Differentiation Opening</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredComparisonRows.map((row) => {
                            const isUs = row.competitorId === 'user-business';
                            return (
                              <tr
                                key={row.competitorId}
                                className={cn(
                                  'hover:bg-slate-50/70 transition-colors',
                                  isUs && 'bg-blue-50/30 font-medium'
                                )}
                              >
                                <td className="p-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-sparkline-midnight text-sm">
                                        {row.competitorName}
                                      </span>
                                    </div>
                                    <Badge
                                      variant={isUs ? 'cyan' : row.relationship === 'Direct' ? 'blue' : 'purple'}
                                      size="sm"
                                      className="text-[10px]"
                                    >
                                      {isUs ? 'Our Brand' : `${row.relationship} Rival`}
                                    </Badge>
                                    <div className="text-[10px] text-slate-400 font-mono">
                                      {row.productCategory}
                                    </div>
                                  </div>
                                </td>

                                <td className="p-4">
                                  <span className="font-semibold text-slate-800 block">
                                    {row.pricingPosition}
                                  </span>
                                </td>

                                <td className="p-4 leading-relaxed text-slate-700">
                                  {row.mainValueProposition}
                                </td>

                                <td className="p-4 text-slate-600">
                                  {row.targetAudience}
                                </td>

                                <td className="p-4">
                                  <ul className="space-y-1 text-emerald-800">
                                    {row.publiclyObservedStrengths.map((s, idx) => (
                                      <li key={idx} className="flex items-start gap-1">
                                        <span className="text-emerald-600 font-bold">•</span>
                                        <span>{s}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </td>

                                <td className="p-4">
                                  <ul className="space-y-1 text-rose-800">
                                    {row.publiclyObservedWeaknesses.map((w, idx) => (
                                      <li key={idx} className="flex items-start gap-1">
                                        <span className="text-rose-600 font-bold">•</span>
                                        <span>{w}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </td>

                                <td className="p-4 text-sparkline-blue font-medium">
                                  <ul className="space-y-1">
                                    {row.differentiationOpportunities.map((d, idx) => (
                                      <li key={idx} className="flex items-start gap-1">
                                        <span>⚡</span>
                                        <span>{d}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB 2: SWOT ANALYSIS PANELS */}
              {activeTab === 'swot' && (
                <div className="space-y-6">
                  {/* Entity Switcher Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">Select Entity:</span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {currentReport.swotAnalyses.map((swot) => (
                          <button
                            key={swot.entityId}
                            onClick={() => setSelectedSwotEntityId(swot.entityId)}
                            className={cn(
                              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5',
                              selectedSwotEntityId === swot.entityId
                                ? 'bg-sparkline-midnight text-white shadow-sm'
                                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                            )}
                          >
                            <span>{swot.entityName}</span>
                            {swot.isUserBusiness && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sparkline-blue text-white font-mono">
                                US
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {activeSwot && (
                      <span className="text-xs text-slate-500 font-medium">
                        Strategic Takeaway for {activeSwot.entityName}
                      </span>
                    )}
                  </div>

                  {/* Strategic Takeaway Banner */}
                  {activeSwot && activeSwot.strategicTakeaway && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs sm:text-sm text-slate-800 flex items-start gap-3">
                      <Scale className="w-5 h-5 text-sparkline-blue shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-sparkline-midnight font-bold mb-0.5">
                          Strategic Diagnosis ({activeSwot.entityName}):
                        </strong>
                        <p className="leading-relaxed text-slate-700">
                          {activeSwot.strategicTakeaway}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 4 Quadrants Grid */}
                  {activeSwot && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Strengths */}
                      <Card className="bg-emerald-50/30 border-emerald-200/80 p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
                          <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Strengths (Internal Advantages)
                          </h4>
                          <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                            {activeSwot.strengths.length} Factors
                          </span>
                        </div>
                        <div className="space-y-3">
                          {activeSwot.strengths.map((s) => (
                            <div
                              key={s.id}
                              className="p-3 rounded-lg bg-white border border-emerald-100 space-y-1 text-xs"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-slate-900">{s.point}</span>
                                <Badge
                                  variant={s.isVerified ? 'cyan' : 'purple'}
                                  size="sm"
                                  className="text-[10px]"
                                >
                                  {s.isVerified ? 'Verified' : 'AI Hypothesis'}
                                </Badge>
                              </div>
                              <p className="text-slate-600 leading-relaxed">{s.explanation}</p>
                              {s.sourceCitation && (
                                <div className="text-[10px] text-slate-400 font-mono pt-1">
                                  Source: {s.sourceCitation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Weaknesses */}
                      <Card className="bg-rose-50/30 border-rose-200/80 p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-rose-100 pb-2.5">
                          <h4 className="text-sm font-bold text-rose-950 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            Weaknesses (Vulnerabilities)
                          </h4>
                          <span className="text-[11px] font-mono text-rose-700 font-semibold">
                            {activeSwot.weaknesses.length} Factors
                          </span>
                        </div>
                        <div className="space-y-3">
                          {activeSwot.weaknesses.map((w) => (
                            <div
                              key={w.id}
                              className="p-3 rounded-lg bg-white border border-rose-100 space-y-1 text-xs"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-slate-900">{w.point}</span>
                                <Badge
                                  variant={w.isVerified ? 'cyan' : 'purple'}
                                  size="sm"
                                  className="text-[10px]"
                                >
                                  {w.isVerified ? 'Verified' : 'AI Hypothesis'}
                                </Badge>
                              </div>
                              <p className="text-slate-600 leading-relaxed">{w.explanation}</p>
                              {w.sourceCitation && (
                                <div className="text-[10px] text-slate-400 font-mono pt-1">
                                  Source: {w.sourceCitation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Opportunities */}
                      <Card className="bg-blue-50/30 border-blue-200/80 p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-blue-100 pb-2.5">
                          <h4 className="text-sm font-bold text-blue-950 flex items-center gap-1.5">
                            <Target className="w-4 h-4 text-sparkline-blue" />
                            Opportunities (Growth Tailwinds)
                          </h4>
                          <span className="text-[11px] font-mono text-blue-700 font-semibold">
                            {activeSwot.opportunities.length} Factors
                          </span>
                        </div>
                        <div className="space-y-3">
                          {activeSwot.opportunities.map((o) => (
                            <div
                              key={o.id}
                              className="p-3 rounded-lg bg-white border border-blue-100 space-y-1 text-xs"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-slate-900">{o.point}</span>
                                <Badge
                                  variant={o.isVerified ? 'cyan' : 'purple'}
                                  size="sm"
                                  className="text-[10px]"
                                >
                                  {o.isVerified ? 'Verified' : 'AI Hypothesis'}
                                </Badge>
                              </div>
                              <p className="text-slate-600 leading-relaxed">{o.explanation}</p>
                              {o.sourceCitation && (
                                <div className="text-[10px] text-slate-400 font-mono pt-1">
                                  Source: {o.sourceCitation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Threats */}
                      <Card className="bg-amber-50/30 border-amber-200/80 p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
                          <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4 text-amber-600" />
                            Threats (External Headwinds)
                          </h4>
                          <span className="text-[11px] font-mono text-amber-700 font-semibold">
                            {activeSwot.threats.length} Factors
                          </span>
                        </div>
                        <div className="space-y-3">
                          {activeSwot.threats.map((t) => (
                            <div
                              key={t.id}
                              className="p-3 rounded-lg bg-white border border-amber-100 space-y-1 text-xs"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-slate-900">{t.point}</span>
                                <Badge
                                  variant={t.isVerified ? 'cyan' : 'purple'}
                                  size="sm"
                                  className="text-[10px]"
                                >
                                  {t.isVerified ? 'Verified' : 'AI Hypothesis'}
                                </Badge>
                              </div>
                              <p className="text-slate-600 leading-relaxed">{t.explanation}</p>
                              {t.sourceCitation && (
                                <div className="text-[10px] text-slate-400 font-mono pt-1">
                                  Source: {t.sourceCitation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: POSITIONING ANALYSIS & 2x2 MAP */}
              {activeTab === 'positioning' && (
                <div className="space-y-6">
                  {/* Visual 2x2 Positioning Map */}
                  {currentReport.positioningAnalysis.positioningMap && (
                    <Card className="bg-white border-slate-200/90 shadow-sm p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="text-base font-bold text-sparkline-midnight flex items-center gap-2">
                            <Crosshair className="w-4 h-4 text-sparkline-blue" />
                            Competitive 2x2 Positioning Map
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Evidence-based spatial distribution of market rivals across core competitive axes.
                          </p>
                        </div>
                        <Badge variant="cyan" size="sm">
                          Evidence Grounded
                        </Badge>
                      </div>

                      {/* Map Container */}
                      <div className="relative w-full h-[400px] bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between overflow-hidden">
                        {/* Background Axis Crosshairs */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-full border-t border-dashed border-slate-300" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="h-full border-l border-dashed border-slate-300" />
                        </div>

                        {/* Axis Labels */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] font-bold text-slate-600 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-sm z-10">
                          ▲ {currentReport.positioningAnalysis.positioningMap.yAxisName}
                        </div>
                        <div className="absolute bottom-2 right-4 text-[11px] font-bold text-slate-600 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-sm z-10">
                          {currentReport.positioningAnalysis.positioningMap.xAxisName} ▶
                        </div>

                        {/* Plotted Points */}
                        {currentReport.positioningAnalysis.positioningMap.points.map((pt) => {
                          const isUs = pt.isUserBusiness;
                          return (
                            <div
                              key={pt.entityId}
                              style={{
                                left: `${Math.min(Math.max(pt.xAxisValue, 8), 90)}%`,
                                top: `${Math.min(Math.max(100 - pt.yAxisValue, 8), 88)}%`,
                              }}
                              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                            >
                              <div
                                className={cn(
                                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition-transform group-hover:scale-110 select-none',
                                  isUs
                                    ? 'bg-sparkline-blue text-white ring-4 ring-sparkline-blue/20'
                                    : 'bg-white text-sparkline-midnight border border-slate-300'
                                )}
                              >
                                <span>{pt.entityName}</span>
                                {isUs && (
                                  <span className="w-2 h-2 rounded-full bg-sparkline-cyan animate-pulse" />
                                )}
                              </div>

                              {/* Tooltip on Hover */}
                              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-sparkline-midnight text-white text-[11px] rounded-lg shadow-xl z-30 pointer-events-none">
                                <div className="font-bold">{pt.entityName}</div>
                                <div className="text-slate-300 text-[10px] mt-0.5">
                                  X: {pt.xAxisLabel}
                                </div>
                                <div className="text-slate-300 text-[10px]">
                                  Y: {pt.yAxisLabel}
                                </div>
                                <div className="text-cyan-400 text-[10px] mt-1 pt-1 border-t border-white/10">
                                  Basis: {pt.evidenceBasis}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <p className="text-xs text-slate-600 italic">
                        {currentReport.positioningAnalysis.descriptiveNarrative}
                      </p>
                    </Card>
                  )}

                  {/* 8 Positioning Dimensions Breakdown */}
                  <Card className="bg-white border-slate-200/90 shadow-sm p-6 space-y-4">
                    <h3 className="text-base font-bold text-sparkline-midnight flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-sparkline-purple" />
                      Eight-Dimensional Competitive Breakdown
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      {currentReport.positioningAnalysis.dimensions.map((dim, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-sparkline-midnight">
                              {dim.dimension}
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-sparkline-blue block mb-0.5">
                                Our Position
                              </span>
                              <span className="text-slate-800 font-semibold">{dim.userPosition}</span>
                            </div>

                            <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                                Competitor Landscape
                              </span>
                              {dim.competitorAssessments.map((ca, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="flex items-center justify-between text-[11px] pt-0.5"
                                >
                                  <span className="text-slate-700">
                                    <strong>{ca.competitorName}:</strong> {ca.assessment}
                                  </span>
                                  <Badge
                                    variant={
                                      ca.relativeStanding === 'Leader'
                                        ? 'magenta'
                                        : ca.relativeStanding === 'Laggard'
                                        ? 'orange'
                                        : 'blue'
                                    }
                                    size="sm"
                                    className="text-[10px]"
                                  >
                                    {ca.relativeStanding}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 text-slate-600 flex items-start gap-1.5 text-[11px]">
                            <span className="font-bold text-slate-700 shrink-0">
                              Strategic Implication:
                            </span>
                            <span>{dim.strategicImplication}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB 4: GAPS & OPPORTUNITIES */}
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
                          <option value="Messaging Standout">Messaging Standout</option>
                          <option value="Pricing Differentiation">Pricing Differentiation</option>
                          <option value="Feature Moat">Feature Moat</option>
                          <option value="Underserved Need">Underserved Need</option>
                          <option value="Channel Whitespace">Channel Whitespace</option>
                        </select>
                      </div>
                    </div>

                    <span className="text-xs text-slate-500 font-medium">
                      Showing {filteredOpportunities.length} of{' '}
                      {currentReport.competitiveOpportunities.length} opportunities
                    </span>
                  </div>

                  {/* Opportunity Cards */}
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
                              <Badge variant="cyan" size="sm">
                                {opp.confidence} Confidence
                              </Badge>
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
                          {opp.description}
                        </p>

                        {/* Multi-Dimensional Scoring Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-center">
                          <div className="p-2">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Potential Value
                            </span>
                            <span className="text-xs font-bold text-sparkline-midnight mt-0.5 block">
                              {opp.potentialValue}
                            </span>
                          </div>

                          <div className="p-2">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Implementation Effort
                            </span>
                            <span className="text-xs font-bold text-slate-700 mt-0.5 block">
                              {opp.implementationEffort}
                            </span>
                          </div>

                          <div className="p-2">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Commercial Priority
                            </span>
                            <span className="text-xs font-bold text-sparkline-purple mt-0.5 block">
                              {opp.priority}
                            </span>
                          </div>

                          <div className="p-2">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                              Evidence Strength
                            </span>
                            <span className="text-xs font-bold text-sparkline-blue mt-0.5 block">
                              {opp.confidence}
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

              {/* TAB 5: VERIFIED SOURCES & CITATIONS */}
              {activeTab === 'sources' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="text-sm font-bold text-sparkline-midnight flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-sparkline-blue" />
                      Authoritative Competitor Citations & Evidence
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Publicly accessible product pages, patents, pricing sheets, and customer review repositories.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {currentReport.sources.map((src) => (
                      <Card
                        key={src.id}
                        className="bg-white border-slate-200/90 shadow-sm p-5 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="blue" size="sm">
                                {src.sourceCategory}
                              </Badge>
                              {src.competitorName && (
                                <Badge variant="slate" size="sm">
                                  {src.competitorName}
                                </Badge>
                              )}
                              {src.isVerified && (
                                <Badge variant="cyan" size="sm">
                                  Verified Observation
                                </Badge>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-sparkline-midnight">
                              {src.sourceTitle}
                            </h4>
                            <span className="text-xs text-slate-500 font-medium">
                              Publisher: {src.publisherOrWebsite}
                            </span>
                          </div>

                          <div className="shrink-0">
                            {src.sourceUrl && (
                              <a
                                href={src.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-sparkline-blue hover:underline font-semibold"
                              >
                                <span>Inspect Source</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-xs text-slate-700 leading-relaxed">
                          <span className="font-bold text-slate-800 block mb-0.5">
                            Observed Finding:
                          </span>
                          "{src.relevantObservation}"
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                          <span>Publication Date: {src.publicationDate || 'Recent'}</span>
                          <span>Retrieved: {src.accessDate}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: AI COMPETITOR ASSISTANT */}
              {activeTab === 'assistant' && (
                <div className="space-y-6">
                  <Card className="bg-white border-slate-200/90 shadow-sm p-6 flex flex-col h-[650px]">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sparkline-blue/10 text-sparkline-blue flex items-center justify-center font-bold">
                          <Crosshair className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-sparkline-midnight flex items-center gap-1.5">
                            Competitive Intelligence Assistant
                            <Badge variant="cyan" size="sm">
                              Grounded in Report
                            </Badge>
                          </h3>
                          <p className="text-xs text-slate-500">
                            Ask anything regarding competitor weaknesses, pricing positioning, or counter-messaging tactics.
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
                                content: `Assistant history cleared. What else would you like to explore regarding competitors for **${currentReport.projectName}**?`,
                                timestamp: new Date().toISOString(),
                                isStrategicReasoning: true,
                              },
                            ],
                          };
                          setCurrentReport(resetReport);
                          competitorService.saveReport(resetReport);
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

                              {msg.citedSourceIds && msg.citedSourceIds.length > 0 && (
                                <div className="mt-3 pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5 text-[11px]">
                                  <span className="text-slate-500 font-semibold flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    Cited Sources:
                                  </span>
                                  {msg.citedSourceIds.map((sid) => (
                                    <span
                                      key={sid}
                                      className="px-2 py-0.5 rounded bg-white text-sparkline-blue border border-slate-200 font-mono font-medium"
                                    >
                                      {sid}
                                    </span>
                                  ))}
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
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl w-52 text-xs text-slate-500 border border-slate-200">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-sparkline-blue" />
                          <span>Consulting competitor vault...</span>
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
                        placeholder="Ask about competitor pricing, weaknesses, or positioning..."
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
                <Crosshair className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-sparkline-midnight">
                Ready to Benchmark Competitors
              </h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                No competitor intelligence report has been synthesized for{' '}
                <strong>{selectedProject?.business.brandName}</strong> yet. Click{' '}
                <strong>Analyze Competitors</strong> to generate an evidence-backed benchmark across SWOT, 2x2 positioning, and differentiation openings.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={handleGenerateAnalysis}
                  className="gap-2 shadow-md bg-gradient-to-r from-sparkline-blue to-sparkline-purple"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Competitors</span>
                </Button>
              </div>
            </Card>
          )}
        </>
      )}

      {/* ADD / EDIT COMPETITOR MODAL */}
      {competitorModalOpen && (
        <div className="fixed inset-0 z-50 bg-sparkline-midnight/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="bg-white max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-sparkline-midnight flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-sparkline-blue" />
                {editingCompetitor ? 'Edit Competitor Profile' : 'Add Competitor Profile'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCompetitorModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Competitor Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  placeholder="e.g. SkinCeuticals, Wiz, Monday.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
                <input
                  type="text"
                  value={compWebsite}
                  onChange={(e) => setCompWebsite(e.target.value)}
                  placeholder="https://www.example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relationship</label>
                <select
                  value={compRelationship}
                  onChange={(e) => setCompRelationship(e.target.value as CompetitorRelationship)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="Direct">Direct Rival (Same Product, Same Audience)</option>
                  <option value="Indirect">Indirect Rival (Alternative Solution)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pricing Information</label>
                <input
                  type="text"
                  value={compPricing}
                  onChange={(e) => setCompPricing(e.target.value)}
                  placeholder="e.g. $182/oz, or $99/mo, or 'Unknown'"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Product Description</label>
                <input
                  type="text"
                  value={compDescription}
                  onChange={(e) => setCompDescription(e.target.value)}
                  placeholder="Brief summary of their main product or service..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Main Selling Points (Comma Separated)
                </label>
                <input
                  type="text"
                  value={compSellingPoints}
                  onChange={(e) => setCompSellingPoints(e.target.value)}
                  placeholder="Duke patent, Dermatologist recommended, 8x protection"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Known Strengths (Comma Separated)
                </label>
                <input
                  type="text"
                  value={compStrengths}
                  onChange={(e) => setCompStrengths(e.target.value)}
                  placeholder="Brand prestige, Clinic network, Patent protection"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Known Weaknesses (Comma Separated)
                </label>
                <input
                  type="text"
                  value={compWeaknesses}
                  onChange={(e) => setCompWeaknesses(e.target.value)}
                  placeholder="Dropper oxidizes formula, $182 price barrier, unpleasant scent"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Strategic Notes</label>
                <textarea
                  rows={2}
                  value={compNotes}
                  onChange={(e) => setCompNotes(e.target.value)}
                  placeholder="Custom observations, customer complaints to counter-position against..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setCompetitorModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveCompetitor}>
                Save Competitor
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* DISCOVER REAL COMPETITORS MODAL */}
      {discoveryModalOpen && (
        <div className="fixed inset-0 z-50 bg-sparkline-midnight/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="bg-white max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-sparkline-midnight flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-sparkline-blue" />
                Discover Real Market Rivals
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDiscoveryModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Sparkline will identify 3-4 real, verifiable commercial companies that compete in your industry. (Zero fake or synthetic brand names).
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={discoveryIndustry}
                  onChange={(e) => setDiscoveryIndustry(e.target.value)}
                  placeholder="e.g. Clean Cosmetics, Cloud Security"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Market</label>
                <input
                  type="text"
                  value={discoveryMarket}
                  onChange={(e) => setDiscoveryMarket(e.target.value)}
                  placeholder="e.g. United States, Global Enterprise"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setDiscoveryModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDiscoverCompetitors}
                disabled={isDiscovering}
                className="gap-1.5"
              >
                {isDiscovering ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Discovering...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Discover Competitors</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* RENAME MODAL */}
      {renameModalOpen && (
        <div className="fixed inset-0 z-50 bg-sparkline-midnight/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="bg-white max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-sparkline-midnight">Rename Report</h3>
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
                Compare Competitor Benchmarks Side by Side
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
                      {currentReport.competitiveOpportunities.slice(0, 3).map((o) => (
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
                      {target.competitiveOpportunities.slice(0, 3).map((o) => (
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
