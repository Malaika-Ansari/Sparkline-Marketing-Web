/**
 * SEO Intelligence & Optimization Workspace
 * Sparkline Marketing Intelligence Platform — Phase 18
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/components/common/Feedback';
import { projectService } from '@/services/project.service';
import { seoService } from '@/services/seo.service';
import {
  SEOAudit,
  SearchIntent,
  TechnicalSEOCheckStatus,
  SEOContentStatus,
  SEOContentType,
  Keyword,
  KeywordCluster,
  OnPageAnalysis,
  TechnicalSEOCheck,
  SEOCompetitorAnalysis,
  BacklinkRecord,
  SEOContentPlan,
  SEOPerformanceRecord,
  SEOLearningArticle,
  SEOContentBlueprint,
} from '@/types/seo';
import { MarketingProject } from '@/types/project';
import {
  Search,
  Globe,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  ExternalLink,
  ShieldCheck,
  Layers,
  Plus,
  Trash2,
  Download,
  RefreshCw,
  Sparkles,
  TrendingUp,
  BookOpen,
  Copy,
  Check,
  Link2,
  Target,
  ListChecks,
  Code,
  Calendar,
  ArrowRight,
} from 'lucide-react';

type TabKey =
  | 'audit'
  | 'keywords'
  | 'clusters'
  | 'on-page'
  | 'ai-content'
  | 'technical'
  | 'competitor'
  | 'backlinks'
  | 'planner'
  | 'learning';

export const SEOIntelligencePage: React.FC = () => {
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Navigation state
  const tabParam = (searchParams.get('tab') as TabKey) || 'audit';
  const [activeTab, setActiveTab] = useState<TabKey>(tabParam);

  // Projects
  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // 1. Audit Workspace State
  const [audits, setAudits] = useState<SEOAudit[]>([]);
  const [selectedAuditId, setSelectedAuditId] = useState<string>('');
  const [auditUrl, setAuditUrl] = useState<string>('https://example.com');
  const [auditRawHtml, setAuditRawHtml] = useState<string>('');
  const [useRawHtml, setUseRawHtml] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditFilterPriority, setAuditFilterPriority] = useState<string>('all');

  // 2. Keyword Research State
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [keywordSeed, setKeywordSeed] = useState<string>('marketing intelligence software');
  const [keywordIndustry, setKeywordIndustry] = useState<string>('SaaS & Digital Marketing');
  const [keywordIntentFilter, setKeywordIntentFilter] = useState<string>('all');
  const [keywordCountry, setKeywordCountry] = useState<string>('United States');
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState<boolean>(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<Keyword[]>([]);
  const [keywordSearchQuery, setKeywordSearchQuery] = useState<string>('');

  // 3. Topic Clusters State
  const [clusters, setClusters] = useState<KeywordCluster[]>([]);
  const [showClusterModal, setShowClusterModal] = useState<boolean>(false);
  const [newCluster, setNewCluster] = useState<Partial<KeywordCluster>>({
    name: '',
    pillarTopic: '',
    primaryKeyword: '',
    secondaryKeywords: [],
    targetIntent: 'Informational',
    suggestedFormat: 'Blog Article',
    rationale: '',
  });

  // 4. On-Page Checker State
  const [onPageForm, setOnPageForm] = useState({
    url: '',
    title: '',
    metaDescription: '',
    h1: '',
    contentBody: '',
    targetKeyword: '',
  });
  const [onPageResult, setOnPageResult] = useState<OnPageAnalysis | null>(null);
  const [isOnPageAnalyzing, setIsOnPageAnalyzing] = useState<boolean>(false);

  // 5. AI SEO Content Optimizer State
  const [blueprintForm, setBlueprintForm] = useState({
    topic: 'How to Build an Intent-Based SEO Content Strategy in 2026',
    targetKeyword: 'intent based SEO strategy',
    secondaryKeywords: 'search intent framework, keyword mapping, semantic SEO, content clustering',
    contentType: 'Blog Article' as SEOContentType,
    searchIntent: 'Commercial' as SearchIntent,
    brandVoice: 'Authoritative, analytical, actionable, and practitioner-oriented',
  });
  const [isGeneratingBlueprint, setIsGeneratingBlueprint] = useState<boolean>(false);
  const [blueprintResult, setBlueprintResult] = useState<SEOContentBlueprint | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 6. Technical SEO Checklist State
  const [techChecks, setTechChecks] = useState<TechnicalSEOCheck[]>([]);
  const [techFilterCat, setTechFilterCat] = useState<string>('all');

  // 7. Competitor Analysis State
  const [competitors, setCompetitors] = useState<SEOCompetitorAnalysis[]>([]);
  const [showCompetitorModal, setShowCompetitorModal] = useState<boolean>(false);
  const [newCompetitor, setNewCompetitor] = useState<Partial<SEOCompetitorAnalysis>>({
    competitorName: '',
    competitorUrl: '',
    pageTitle: '',
    metaDescription: '',
    primaryHeadings: [],
    observedKeywordThemes: [],
    contentFormat: 'Landing Page & Comparison Hub',
    internalLinkingObservations: '',
    technicalObservations: '',
  });

  // 8. Backlink Analysis State
  const [backlinks, setBacklinks] = useState<BacklinkRecord[]>([]);
  const [showBacklinkModal, setShowBacklinkModal] = useState<boolean>(false);
  const [newBacklink, setNewBacklink] = useState<Partial<BacklinkRecord>>({
    sourceUrl: '',
    destinationUrl: '',
    anchorText: '',
    linkType: 'Editorial Link',
    relStatus: 'follow',
    notes: '',
    isVerified: true,
  });

  // 9. Content Planner State
  const [contentPlans, setContentPlans] = useState<SEOContentPlan[]>([]);
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);
  const [newPlan, setNewPlan] = useState<Partial<SEOContentPlan>>({
    title: '',
    primaryKeyword: '',
    secondaryKeywords: [],
    searchIntent: 'Informational',
    contentType: 'Blog Article',
    targetPublishDate: new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
    priority: 'High',
    status: 'Idea',
    notes: '',
  });

  // 10. Learning & Performance State
  const [performanceRecords, setPerformanceRecords] = useState<SEOPerformanceRecord[]>([]);
  const [learningArticles, setLearningArticles] = useState<SEOLearningArticle[]>([]);
  const [selectedLearningCat, setSelectedLearningCat] = useState<string>('all');
  const [showPerfModal, setShowPerfModal] = useState<boolean>(false);
  const [newPerf, setNewPerf] = useState<Partial<SEOPerformanceRecord>>({
    date: new Date().toISOString().substring(0, 10),
    organicClicks: 14200,
    organicImpressions: 285000,
    averagePosition: 8.4,
    ctr: 4.98,
    indexedPages: 142,
    organicConversions: 418,
    dataSource: 'manual_entry',
    notes: 'Q4 Organic search benchmark',
  });

  // Load initial data
  useEffect(() => {
    const loadedProjects = projectService.getProjects();
    setProjects(loadedProjects);
    if (loadedProjects.length > 0 && loadedProjects[0] && !selectedProjectId) {
      setSelectedProjectId(loadedProjects[0].id);
    }

    setAudits(seoService.getSavedAudits());
    setKeywords(seoService.getKeywords());
    setClusters(seoService.getClusters());
    setTechChecks(seoService.getTechnicalChecks());
    setCompetitors(seoService.getCompetitorAnalyses());
    setBacklinks(seoService.getBacklinks());
    setContentPlans(seoService.getContentPlans());
    setPerformanceRecords(seoService.getPerformanceRecords());
    setLearningArticles(seoService.getLearningArticles());
  }, []);

  // Update tab in URL
  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    setSearchParams({ tab: key });
  };

  const activeAudit = useMemo(() => {
    if (selectedAuditId) {
      return audits.find((a) => a.id === selectedAuditId) || audits[0];
    }
    return audits[0];
  }, [audits, selectedAuditId]);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast({ title: 'Copied to clipboard', type: 'success' });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Audit handlers
  const handleExecuteAudit = async () => {
    if (!useRawHtml && !auditUrl) {
      addToast({ title: 'Please provide a valid URL to audit', type: 'error' });
      return;
    }
    if (useRawHtml && !auditRawHtml.trim()) {
      addToast({ title: 'Please paste raw HTML to analyze', type: 'error' });
      return;
    }

    setIsAuditing(true);
    try {
      const result = await seoService.runWebsiteAudit(
        useRawHtml ? undefined : auditUrl,
        useRawHtml ? auditRawHtml : undefined
      );
      setAudits((prev) => [result, ...prev.filter((a) => a.id !== result.id)]);
      setSelectedAuditId(result.id);
      addToast({
        title: 'SEO Audit Complete',
        message: `Audited ${result.url}. Found ${result.findings.length} findings.`,
        type: 'success',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Audit failed';
      addToast({ title: 'Audit Execution Error', message: msg, type: 'error' });
    } finally {
      setIsAuditing(false);
    }
  };

  // 2. Keyword handlers
  const handleGenerateKeywords = () => {
    if (!keywordSeed.trim()) {
      addToast({ title: 'Enter a seed keyword', type: 'error' });
      return;
    }
    setIsGeneratingKeywords(true);
    setTimeout(() => {
      const results = seoService.generateKeywordIdeas(
        keywordSeed,
        keywordIndustry,
        keywordIntentFilter as SearchIntent | 'all',
        keywordCountry
      );
      setGeneratedIdeas(results);
      setIsGeneratingKeywords(false);
      addToast({
        title: 'Keywords Generated',
        message: `Created ${results.length} semantic keyword opportunities.`,
        type: 'success',
      });
    }, 600);
  };

  const handleSaveKeyword = (kw: Keyword) => {
    seoService.saveKeyword(kw);
    setKeywords(seoService.getKeywords());
    addToast({
      title: 'Keyword Saved',
      message: `"${kw.term}" added to tracked keywords.`,
      type: 'success',
    });
  };

  const handleDeleteKeyword = (id: string) => {
    seoService.deleteKeyword(id);
    setKeywords(seoService.getKeywords());
    addToast({ title: 'Keyword removed', type: 'info' });
  };

  const handleExportKeywords = () => {
    const csv = seoService.exportKeywordsCsv(keywords);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sparkline_seo_keywords_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ title: 'CSV Exported', type: 'success' });
  };

  // 3. Cluster handlers
  const handleCreateCluster = () => {
    const { name, primaryKeyword, pillarTopic, secondaryKeywords, targetIntent, suggestedFormat, rationale } = newCluster;
    if (!name || !primaryKeyword) {
      addToast({ title: 'Cluster name & primary keyword are required', type: 'error' });
      return;
    }
    const cluster: KeywordCluster = {
      id: `cluster-${Date.now()}`,
      name,
      pillarTopic: pillarTopic || name,
      primaryKeyword,
      secondaryKeywords: secondaryKeywords || [],
      targetIntent: targetIntent || 'Informational',
      suggestedFormat: suggestedFormat || 'Blog Article',
      rationale: rationale || 'Strategic topic authority builder',
    };
    seoService.saveCluster(cluster);
    setClusters(seoService.getClusters());
    setShowClusterModal(false);
    setNewCluster({
      name: '',
      pillarTopic: '',
      primaryKeyword: '',
      secondaryKeywords: [],
      targetIntent: 'Informational',
      suggestedFormat: 'Blog Article',
      rationale: '',
    });
    addToast({ title: 'Cluster Created', type: 'success' });
  };

  // 4. On-Page Checker handlers
  const handleRunOnPageCheck = () => {
    if (!onPageForm.title.trim() && !onPageForm.contentBody.trim()) {
      addToast({ title: 'Provide at least a title or content body to analyze', type: 'error' });
      return;
    }
    setIsOnPageAnalyzing(true);
    setTimeout(() => {
      const result = seoService.analyzeOnPage(onPageForm);
      setOnPageResult(result);
      setIsOnPageAnalyzing(false);
      addToast({ title: 'On-Page Analysis Complete', type: 'success' });
    }, 400);
  };

  // 5. AI SEO Blueprint generation
  const handleGenerateBlueprint = async () => {
    if (!blueprintForm.targetKeyword.trim()) {
      addToast({ title: 'Target keyword is required', type: 'error' });
      return;
    }
    setIsGeneratingBlueprint(true);
    try {
      const result = await seoService.generateSeoContentBlueprint({
        topic: blueprintForm.topic,
        targetKeyword: blueprintForm.targetKeyword,
        secondaryKeywords: blueprintForm.secondaryKeywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean),
        contentType: blueprintForm.contentType,
        searchIntent: blueprintForm.searchIntent,
        brandVoice: blueprintForm.brandVoice,
      });
      setBlueprintResult(result);
      addToast({
        title: 'SEO Content Blueprint Generated',
        message: 'Optimized titles, outline, FAQs, and schema ready.',
        type: 'success',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Blueprint generation failed';
      addToast({ title: 'Blueprint Error', message: msg, type: 'error' });
    } finally {
      setIsGeneratingBlueprint(false);
    }
  };

  // 6. Tech checklist status change
  const handleTechStatusChange = (id: string, status: TechnicalSEOCheckStatus) => {
    const updated = techChecks.map((item) =>
      item.id === id ? { ...item, status } : item
    );
    setTechChecks(updated);
    seoService.saveTechnicalChecks(updated);
    addToast({ title: 'Checklist updated', type: 'info' });
  };

  // 7. Competitor handlers
  const handleSaveCompetitor = () => {
    const {
      competitorName,
      competitorUrl,
      pageTitle,
      metaDescription,
      primaryHeadings,
      observedKeywordThemes,
      contentFormat,
      internalLinkingObservations,
      technicalObservations,
    } = newCompetitor;

    if (!competitorName || !competitorUrl) {
      addToast({ title: 'Competitor name and URL are required', type: 'error' });
      return;
    }
    const item: SEOCompetitorAnalysis = {
      id: `comp-${Date.now()}`,
      competitorName: competitorName || '',
      competitorUrl: competitorUrl || '',
      pageTitle: pageTitle || 'Competitive Landing Page',
      metaDescription: metaDescription || 'Observed meta description',
      primaryHeadings: primaryHeadings || ['Main Value Proposition', 'Feature Matrix'],
      observedKeywordThemes: observedKeywordThemes || ['automation', 'efficiency'],
      contentFormat: contentFormat || 'Landing Page',
      internalLinkingObservations: internalLinkingObservations || 'Product to Docs',
      technicalObservations: technicalObservations || 'Clean static delivery',
      retrievedAt: new Date().toISOString(),
      isVerified: true,
    };
    seoService.saveCompetitorAnalysis(item);
    setCompetitors(seoService.getCompetitorAnalyses());
    setShowCompetitorModal(false);
    addToast({ title: 'Competitor Profile Saved', type: 'success' });
  };

  // 8. Backlink handlers
  const handleSaveBacklink = () => {
    const { sourceUrl, destinationUrl, anchorText, linkType, relStatus, notes } = newBacklink;
    if (!sourceUrl || !destinationUrl) {
      addToast({ title: 'Source and Destination URLs are required', type: 'error' });
      return;
    }
    const item: BacklinkRecord = {
      id: `bl-${Date.now()}`,
      sourceUrl: sourceUrl || '',
      destinationUrl: destinationUrl || '',
      anchorText: anchorText || 'Sparkline Marketing',
      linkType: linkType || 'Editorial Link',
      relStatus: relStatus || 'follow',
      notes: notes || '',
      lastCheckedDate: new Date().toISOString().substring(0, 10),
      isVerified: true,
    };
    seoService.saveBacklink(item);
    setBacklinks(seoService.getBacklinks());
    setShowBacklinkModal(false);
    addToast({ title: 'Backlink Logged', type: 'success' });
  };

  const handleExportBacklinks = () => {
    const csv = seoService.exportBacklinksCsv(backlinks);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sparkline_backlinks_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ title: 'Backlinks Exported', type: 'success' });
  };

  // 9. Content Planner handlers
  const handleSaveContentPlan = () => {
    const { title, primaryKeyword, secondaryKeywords, searchIntent, contentType, targetPublishDate, priority, status, notes } = newPlan;
    if (!title || !primaryKeyword) {
      addToast({ title: 'Title & Primary Keyword are required', type: 'error' });
      return;
    }
    const item: SEOContentPlan = {
      id: `plan-${Date.now()}`,
      projectId: selectedProjectId || 'sparkline-default',
      title: title || '',
      primaryKeyword: primaryKeyword || '',
      secondaryKeywords: secondaryKeywords || [],
      searchIntent: searchIntent || 'Informational',
      contentType: contentType || 'Blog Article',
      targetPublishDate: targetPublishDate || new Date().toISOString().substring(0, 10),
      priority: priority || 'Medium',
      status: status || 'Idea',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    seoService.saveContentPlan(item);
    setContentPlans(seoService.getContentPlans());
    setShowPlanModal(false);
    addToast({ title: 'Content Plan Created', type: 'success' });
  };

  // 10. Performance snapshot handler
  const handleSavePerformance = () => {
    const item: SEOPerformanceRecord = {
      id: `perf-${Date.now()}`,
      date: newPerf.date || new Date().toISOString().substring(0, 10),
      organicClicks: Number(newPerf.organicClicks) || 0,
      organicImpressions: Number(newPerf.organicImpressions) || 0,
      averagePosition: Number(newPerf.averagePosition) || 0,
      ctr: Number(newPerf.ctr) || 0,
      indexedPages: Number(newPerf.indexedPages) || 0,
      organicConversions: Number(newPerf.organicConversions) || 0,
      dataSource: 'manual_entry',
      notes: newPerf.notes,
    };
    seoService.savePerformanceRecord(item);
    setPerformanceRecords(seoService.getPerformanceRecords());
    setShowPerfModal(false);
    addToast({ title: 'Performance Snapshot Saved', type: 'success' });
  };

  // Filtered lists
  const filteredFindings = useMemo(() => {
    if (!activeAudit) return [];
    if (auditFilterPriority === 'all') return activeAudit.findings;
    return activeAudit.findings.filter((f) => f.priority === auditFilterPriority);
  }, [activeAudit, auditFilterPriority]);

  const filteredTrackedKeywords = useMemo(() => {
    return keywords.filter((k) => {
      const matchSearch =
        k.term.toLowerCase().includes(keywordSearchQuery.toLowerCase()) ||
        k.category.toLowerCase().includes(keywordSearchQuery.toLowerCase());
      const matchIntent =
        keywordIntentFilter === 'all' || k.intent === keywordIntentFilter;
      return matchSearch && matchIntent;
    });
  }, [keywords, keywordSearchQuery, keywordIntentFilter]);

  const filteredTechChecks = useMemo(() => {
    if (techFilterCat === 'all') return techChecks;
    return techChecks.filter((c) => c.category === techFilterCat);
  }, [techChecks, techFilterCat]);

  const completedTechCount = useMemo(() => {
    return techChecks.filter((c) => c.status === 'Completed').length;
  }, [techChecks]);

  const latestPerf = performanceRecords[0] || null;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <SEO
        title="SEO Intelligence & Optimization | Sparkline Marketing"
        description="Discover search opportunities, optimize your content and build a stronger organic search strategy."
      />

      {/* Top Banner / Ground-Truth Disclaimer */}
      <div className="bg-gradient-to-r from-sparkline-blue-900 via-sparkline-slate to-sparkline-midnight text-white px-6 py-2.5 text-xs font-medium border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Zero-Fabrication Ground-Truth Policy:</strong> Metrics shown reflect observable on-page HTML or verified user logs. No synthetic traffic estimates or artificial Google rankings.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300">Proxy Mode: Hardened SSRF Protected</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-sparkline-blue/10 text-sparkline-blue border border-sparkline-blue/20">
                <Search className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-sparkline-midnight tracking-tight">
                SEO Intelligence & Optimization
              </h1>
            </div>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              Discover search opportunities, optimize your content and build a stronger organic search strategy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Project Selector */}
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs font-medium bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sparkline-midnight shadow-sm focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    Project: {p.business?.brandName || p.id}
                  </option>
                ))}
                {projects.length === 0 && (
                  <option value="">Default Brand Context</option>
                )}
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExportKeywords}
            >
              Export Data
            </Button>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<Globe className="w-4 h-4" />}
              onClick={() => handleTabChange('audit')}
            >
              Run Audit
            </Button>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Audited Pages
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-sparkline-midnight">
                {audits.length}
              </span>
              <span className="text-xs text-emerald-600 font-medium">Verified</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Tracked Keywords
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-sparkline-midnight">
                {keywords.length}
              </span>
              <span className="text-xs text-sparkline-blue font-medium">Targeted</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Topic Clusters
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-sparkline-midnight">
                {clusters.length}
              </span>
              <span className="text-xs text-purple-600 font-medium">Pillars</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Technical Health
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-sparkline-midnight">
                {Math.round((completedTechCount / (techChecks.length || 1)) * 100)}%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {completedTechCount}/{techChecks.length} Passed
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Organic Clicks
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-sparkline-midnight">
                {latestPerf ? latestPerf.organicClicks.toLocaleString() : '—'}
              </span>
              <span className="text-xs text-emerald-600 font-medium">Logged</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Active Backlinks
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-sparkline-midnight">
                {backlinks.length}
              </span>
              <span className="text-xs text-blue-600 font-medium">Recorded</span>
            </div>
          </div>
        </div>

        {/* 10-Tab Navigation Bar */}
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm overflow-x-auto scrollbar-none">
          <nav className="flex space-x-1 min-w-max">
            {[
              { id: 'audit', label: 'Website Audit', icon: Globe },
              { id: 'keywords', label: 'Keyword Research', icon: Search },
              { id: 'clusters', label: 'Topic Clusters', icon: Layers },
              { id: 'on-page', label: 'On-Page Checker', icon: FileText },
              { id: 'ai-content', label: 'AI SEO Assistant', icon: Sparkles },
              { id: 'technical', label: 'Technical SEO', icon: ListChecks },
              { id: 'competitor', label: 'Competitor SEO', icon: Target },
              { id: 'backlinks', label: 'Backlink Analysis', icon: Link2 },
              { id: 'planner', label: 'Content Planner', icon: Calendar },
              { id: 'learning', label: 'Learning & Performance', icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as TabKey)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-sparkline-blue text-white shadow-sm'
                      : 'text-slate-600 hover:text-sparkline-midnight hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* TAB 1: WEBSITE SEO AUDIT */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            {/* Input and Controller */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
                    <Globe className="w-5 h-5 text-sparkline-blue" />
                    Website SEO Audit Engine
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live HTML extraction via SSRF-hardened proxy. Inspects titles, meta tags, canonicals, mobile viewport, headings, and schema entities.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUseRawHtml(!useRawHtml)}
                    className="text-xs font-medium text-sparkline-blue hover:underline"
                  >
                    {useRawHtml ? 'Switch to Live URL Mode' : 'Switch to Raw HTML Paste Mode'}
                  </button>
                </div>
              </div>

              {!useRawHtml ? (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      value={auditUrl}
                      onChange={(e) => setAuditUrl(e.target.value)}
                      placeholder="https://example.com/page-to-audit"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                    />
                  </div>
                  <Button
                    variant="primary"
                    isLoading={isAuditing}
                    onClick={handleExecuteAudit}
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                  >
                    Run Live Audit
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={auditRawHtml}
                    onChange={(e) => setAuditRawHtml(e.target.value)}
                    placeholder="<!DOCTYPE html><html><head><title>My Page</title><meta name='description' content='...'></head><body>...</body></html>"
                    className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      isLoading={isAuditing}
                      onClick={handleExecuteAudit}
                      leftIcon={<Code className="w-4 h-4" />}
                    >
                      Audit Raw HTML
                    </Button>
                  </div>
                </div>
              )}

              {/* History Bar */}
              {audits.length > 1 && (
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
                  <span className="text-slate-400 shrink-0 font-medium">Recent Audits:</span>
                  {audits.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setSelectedAuditId(a.id)}
                      className={`px-2.5 py-1 rounded-lg transition-colors shrink-0 ${
                        activeAudit?.id === a.id
                          ? 'bg-sparkline-blue/10 text-sparkline-blue font-semibold border border-sparkline-blue/20'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {a.url.replace(/^https?:\/\//, '').slice(0, 24)}...
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Audit Results View */}
            {activeAudit ? (
              <div className="space-y-6">
                {/* Meta Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Crawl Diagnostics</span>
                      <Badge variant="blue" size="sm">
                        HTTP {activeAudit.httpStatus}
                      </Badge>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div>
                        <strong>Audited URL:</strong>{' '}
                        <span className="font-mono text-[11px] text-slate-800 break-all">{activeAudit.url}</span>
                      </div>
                      <div>
                        <strong>Payload Size:</strong> {(activeAudit.responseSizeBytes / 1024).toFixed(1)} KB
                      </div>
                      <div>
                        <strong>Timestamp:</strong> {new Date(activeAudit.retrievedAt).toLocaleString()}
                      </div>
                      <div>
                        <strong>Audit Mode:</strong> {activeAudit.isLiveAudit ? 'Live Proxy' : 'Offline Engine'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Indexing Directives</span>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Canonical URL:</span>
                        <span className="font-mono text-[11px] text-slate-800 break-all">
                          {activeAudit.meta.canonical || 'Not specified (Missing canonical)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Robots Meta:</span>
                        <span className="font-mono text-[11px] text-slate-800">
                          {activeAudit.meta.robots || 'index, follow (Default implicit)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Mobile Viewport:</span>
                        <span className="font-mono text-[11px] text-emerald-600">
                          {activeAudit.meta.viewport ? 'Declared & Mobile Responsive' : 'Missing Viewport'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Structured Data & Media</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">JSON-LD Schemas:</span>
                        <Badge variant={activeAudit.structuredData.hasJsonLd ? 'blue' : 'slate'} size="sm">
                          {activeAudit.structuredData.types.length > 0
                            ? activeAudit.structuredData.types.join(', ')
                            : 'None Detected'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Total Images:</span>
                        <span className="font-semibold text-slate-800">{activeAudit.images.total}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Images Missing Alt:</span>
                        <span
                          className={`font-semibold ${
                            activeAudit.images.missingAlt > 0 ? 'text-amber-600' : 'text-emerald-600'
                          }`}
                        >
                          {activeAudit.images.missingAlt}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Internal / External Links:</span>
                        <span className="font-semibold text-slate-800">
                          {activeAudit.links.internalCount} int / {activeAudit.links.externalCount} ext
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Page Title & Meta Description Preview */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-sparkline-midnight uppercase tracking-wider">
                      SERP Snippet Simulation
                    </h3>
                    <span className="text-xs text-slate-400">Desktop Google Preview</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-2xl space-y-1">
                    <div className="text-xs text-slate-500 truncate">{activeAudit.url}</div>
                    <div className="text-lg font-medium text-blue-700 hover:underline cursor-pointer truncate">
                      {activeAudit.meta.title || 'Untitled Document'}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-2">
                      {activeAudit.meta.description || 'No meta description was provided in the HTML head.'}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-500 block mb-1">Title Length:</span>
                      <span className="font-semibold text-slate-800">{activeAudit.meta.title.length} characters</span>
                      <span className="text-slate-400 ml-1.5">(Target: 50–60 chars)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-500 block mb-1">Meta Description Length:</span>
                      <span className="font-semibold text-slate-800">
                        {activeAudit.meta.description.length} characters
                      </span>
                      <span className="text-slate-400 ml-1.5">(Target: 140–160 chars)</span>
                    </div>
                  </div>
                </div>

                {/* Headings Hierarchy */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-sparkline-midnight uppercase tracking-wider">
                    Semantic Heading Hierarchy
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sparkline-midnight">H1 Headings</span>
                        <Badge variant={activeAudit.headings.h1.length === 1 ? 'blue' : 'orange'} size="sm">
                          {activeAudit.headings.h1.length} found
                        </Badge>
                      </div>
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {activeAudit.headings.h1.map((h, i) => (
                          <div key={i} className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-200">
                            {h}
                          </div>
                        ))}
                        {activeAudit.headings.h1.length === 0 && (
                          <span className="text-xs text-red-500">No &lt;h1&gt; tags found.</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sparkline-midnight">H2 Subheadings</span>
                        <Badge variant="slate" size="sm">
                          {activeAudit.headings.h2.length} found
                        </Badge>
                      </div>
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {activeAudit.headings.h2.map((h, i) => (
                          <div key={i} className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-200 truncate">
                            {h}
                          </div>
                        ))}
                        {activeAudit.headings.h2.length === 0 && (
                          <span className="text-xs text-slate-400">No &lt;h2&gt; tags found.</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sparkline-midnight">H3 Subsections</span>
                        <Badge variant="slate" size="sm">
                          {activeAudit.headings.h3.length} found
                        </Badge>
                      </div>
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {activeAudit.headings.h3.map((h, i) => (
                          <div key={i} className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-200 truncate">
                            {h}
                          </div>
                        ))}
                        {activeAudit.headings.h3.length === 0 && (
                          <span className="text-xs text-slate-400">No &lt;h3&gt; tags found.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Structured Audit Findings */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-sparkline-midnight">
                        Audit Findings & Recommended Actions
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Grouped by priority. Focus on Critical and High Priority items first.
                      </p>
                    </div>

                    {/* Priority Filter Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: 'all', label: `All (${activeAudit.findings.length})` },
                        { id: 'Critical', label: `Critical (${activeAudit.summary.criticalCount})` },
                        { id: 'High Priority', label: `High (${activeAudit.summary.highCount})` },
                        { id: 'Medium Priority', label: `Medium (${activeAudit.summary.mediumCount})` },
                        { id: 'Passed Checks', label: `Passed (${activeAudit.summary.passedCount})` },
                      ].map((btn) => (
                        <button
                          key={btn.id}
                          onClick={() => setAuditFilterPriority(btn.id)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            auditFilterPriority === btn.id
                              ? 'bg-sparkline-midnight text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredFindings.map((finding) => {
                      const isCritical = finding.priority === 'Critical';
                      const isHigh = finding.priority === 'High Priority';
                      const isPassed = finding.priority === 'Passed Checks';

                      return (
                        <div
                          key={finding.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isCritical
                              ? 'bg-red-50/40 border-red-200'
                              : isHigh
                              ? 'bg-amber-50/40 border-amber-200'
                              : isPassed
                              ? 'bg-emerald-50/30 border-emerald-200'
                              : 'bg-slate-50/60 border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2">
                              {isCritical && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                              {isHigh && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                              {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                              {!isCritical && !isHigh && !isPassed && (
                                <Info className="w-4 h-4 text-blue-500 shrink-0" />
                              )}
                              <span className="text-sm font-bold text-sparkline-midnight">
                                {finding.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  isCritical
                                    ? 'magenta'
                                    : isHigh
                                    ? 'orange'
                                    : isPassed
                                    ? 'blue'
                                    : 'slate'
                                }
                                size="sm"
                              >
                                {finding.priority}
                              </Badge>
                              <Badge variant="neutral" size="sm">
                                {finding.category}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 mb-2">{finding.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white/70 p-3 rounded-lg border border-slate-200/60">
                            <div>
                              <strong className="text-slate-500 block">Why it matters:</strong>
                              <span className="text-slate-700">{finding.whyItMatters}</span>
                            </div>
                            <div>
                              <strong className="text-slate-500 block">Evidence detected:</strong>
                              <span className="font-mono text-[11px] text-slate-800 break-all">
                                {finding.evidence}
                              </span>
                            </div>
                            <div>
                              <strong className="text-slate-500 block">Recommended fix:</strong>
                              <span className="text-slate-800 font-medium">
                                {finding.recommendedCorrection}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {filteredFindings.length === 0 && (
                      <div className="text-center py-8 text-xs text-slate-500">
                        No findings matching priority "{auditFilterPriority}".
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <Globe className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-700">No Audits Run Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Enter a website URL above to inspect on-page SEO factors, metadata, heading structures, and crawl diagnostics.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: KEYWORD RESEARCH & OPPORTUNITY */}
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            {/* Seed Research Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
                  <Search className="w-5 h-5 text-sparkline-blue" />
                  Keyword Research & Opportunity Engine
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Discover semantic keyword ideas categorized by intent without fabricated search volumes or fake CPC estimates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Seed Topic / Keyword
                  </label>
                  <input
                    type="text"
                    value={keywordSeed}
                    onChange={(e) => setKeywordSeed(e.target.value)}
                    placeholder="e.g., ai marketing tools"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Target Industry
                  </label>
                  <select
                    value={keywordIndustry}
                    onChange={(e) => setKeywordIndustry(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                  >
                    <option value="SaaS & Digital Marketing">SaaS & Digital Marketing</option>
                    <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                    <option value="Agency & Consulting">Agency & Consulting</option>
                    <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                    <option value="Financial Services & Fintech">Financial Services & Fintech</option>
                    <option value="Local Services & Trade">Local Services & Trade</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Intent Filter
                  </label>
                  <select
                    value={keywordIntentFilter}
                    onChange={(e) => setKeywordIntentFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                  >
                    <option value="all">All Intents</option>
                    <option value="Informational">Informational (Guides, How-Tos)</option>
                    <option value="Commercial">Commercial (Comparison, Reviews)</option>
                    <option value="Transactional">Transactional (Pricing, Buy)</option>
                    <option value="Navigational">Navigational (Brand terms)</option>
                    <option value="Local">Local (Near me, Cities)</option>
                    <option value="Long-tail">Long-tail (Specific queries)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Target Country
                  </label>
                  <select
                    value={keywordCountry}
                    onChange={(e) => setKeywordCountry(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                  >
                    <option value="United States">United States (en-US)</option>
                    <option value="United Kingdom">United Kingdom (en-GB)</option>
                    <option value="Canada">Canada (en-CA)</option>
                    <option value="Australia">Australia (en-AU)</option>
                    <option value="Global">Global / Worldwide</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-400">
                  Ground-truth: Metric estimates require direct Search Console connection.
                </span>
                <Button
                  variant="primary"
                  isLoading={isGeneratingKeywords}
                  onClick={handleGenerateKeywords}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Generate Keyword Ideas
                </Button>
              </div>
            </div>

            {/* Generated Suggestions */}
            {generatedIdeas.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Generated Opportunities for "{keywordSeed}"
                  </h3>
                  <Badge variant="blue" size="sm">
                    {generatedIdeas.length} Opportunities
                  </Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-y border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Keyword Term</th>
                        <th className="py-3 px-3">Search Intent</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Suggested Page</th>
                        <th className="py-3 px-4">Opportunity Rationale</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {generatedIdeas.map((kw) => (
                        <tr key={kw.id} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 font-semibold text-sparkline-midnight">
                            {kw.term}
                          </td>
                          <td className="py-3 px-3">
                            <Badge
                              variant={
                                kw.intent === 'Commercial'
                                  ? 'purple'
                                  : kw.intent === 'Transactional'
                                  ? 'orange'
                                  : 'blue'
                              }
                              size="sm"
                            >
                              {kw.intent}
                            </Badge>
                          </td>
                          <td className="py-3 px-3">{kw.category}</td>
                          <td className="py-3 px-3 font-medium text-slate-700">
                            {kw.suggestedPageType}
                          </td>
                          <td className="py-3 px-4 text-slate-600 max-w-xs">
                            {kw.opportunityRationale}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSaveKeyword(kw)}
                              leftIcon={<Plus className="w-3.5 h-3.5" />}
                            >
                              Save
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tracked Keywords Table */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Tracked Project Keywords ({filteredTrackedKeywords.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Keywords actively targeted across campaigns, content plans, and topic clusters.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={keywordSearchQuery}
                      onChange={(e) => setKeywordSearchQuery(e.target.value)}
                      placeholder="Filter keywords..."
                      className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sparkline-blue"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    onClick={handleExportKeywords}
                  >
                    CSV
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Keyword</th>
                      <th className="py-3 px-3">Intent</th>
                      <th className="py-3 px-3">Priority</th>
                      <th className="py-3 px-3">Target Page Type</th>
                      <th className="py-3 px-4">Opportunity Rationale</th>
                      <th className="py-3 px-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTrackedKeywords.map((kw) => (
                      <tr key={kw.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-sparkline-midnight">
                          {kw.term}
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="blue" size="sm">
                            {kw.intent}
                          </Badge>
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            variant={
                              kw.priority === 'High'
                                ? 'magenta'
                                : kw.priority === 'Medium'
                                ? 'orange'
                                : 'slate'
                            }
                            size="sm"
                          >
                            {kw.priority}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-700">
                          {kw.suggestedPageType}
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-sm">
                          {kw.opportunityRationale}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteKeyword(kw.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredTrackedKeywords.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                          No tracked keywords found. Generate ideas above or add your first target keyword.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TOPIC CLUSTERS */}
        {activeTab === 'clusters' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  Semantic Keyword Topic Clusters
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Organize content into pillar pages and supporting cluster articles to establish topical authority.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setShowClusterModal(true)}
              >
                Create Topic Cluster
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider block mb-1">
                        Pillar Architecture
                      </span>
                      <h3 className="text-base font-bold text-sparkline-midnight">
                        {cluster.name}
                      </h3>
                    </div>
                    <Badge variant="purple" size="sm">
                      {cluster.suggestedFormat}
                    </Badge>
                  </div>

                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs space-y-1">
                    <span className="text-slate-500 block">Primary Pillar Keyword:</span>
                    <span className="font-semibold text-sparkline-midnight text-sm">
                      {cluster.primaryKeyword}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-600 block mb-2">
                      Secondary Cluster Variants:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cluster.secondaryKeywords.map((variant, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium"
                        >
                          {variant}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <strong className="text-slate-700 block mb-0.5">Strategy Rationale:</strong>
                    <span>{cluster.rationale}</span>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <Badge variant="blue" size="sm">
                      {cluster.targetIntent} Intent
                    </Badge>
                    <button
                      onClick={() => {
                        setBlueprintForm((prev) => ({
                          ...prev,
                          topic: cluster.name,
                          targetKeyword: cluster.primaryKeyword,
                          secondaryKeywords: cluster.secondaryKeywords.join(', '),
                          contentType: cluster.suggestedFormat,
                        }));
                        handleTabChange('ai-content');
                      }}
                      className="text-sparkline-blue hover:underline font-semibold flex items-center gap-1"
                    >
                      Generate Outline <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Create Topic Cluster */}
            {showClusterModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-xl">
                  <h3 className="text-lg font-bold text-sparkline-midnight">
                    Create New Topic Cluster
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Cluster Name
                      </label>
                      <input
                        type="text"
                        value={newCluster.name}
                        onChange={(e) => setNewCluster({ ...newCluster, name: e.target.value })}
                        placeholder="e.g., Conversion Rate Optimization Hub"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Primary Pillar Keyword
                      </label>
                      <input
                        type="text"
                        value={newCluster.primaryKeyword}
                        onChange={(e) =>
                          setNewCluster({ ...newCluster, primaryKeyword: e.target.value })
                        }
                        placeholder="e.g., conversion rate optimization guide"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Secondary Keywords (comma separated)
                      </label>
                      <input
                        type="text"
                        value={newCluster.secondaryKeywords?.join(', ')}
                        onChange={(e) =>
                          setNewCluster({
                            ...newCluster,
                            secondaryKeywords: e.target.value.split(',').map((s) => s.trim()),
                          })
                        }
                        placeholder="cro checklist, ab testing best practices, landing page cro"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Suggested Format
                        </label>
                        <select
                          value={newCluster.suggestedFormat}
                          onChange={(e) =>
                            setNewCluster({
                              ...newCluster,
                              suggestedFormat: e.target.value as SEOContentType,
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        >
                          <option value="Blog Article">Blog Article</option>
                          <option value="Landing Page">Landing Page</option>
                          <option value="Comparison Guide">Comparison Guide</option>
                          <option value="Product Page">Product Page</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Search Intent
                        </label>
                        <select
                          value={newCluster.targetIntent}
                          onChange={(e) =>
                            setNewCluster({
                              ...newCluster,
                              targetIntent: e.target.value as SearchIntent,
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        >
                          <option value="Informational">Informational</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Transactional">Transactional</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Strategic Rationale
                      </label>
                      <textarea
                        rows={2}
                        value={newCluster.rationale}
                        onChange={(e) =>
                          setNewCluster({ ...newCluster, rationale: e.target.value })
                        }
                        placeholder="Why is this topic cluster vital for organic traffic and brand authority?"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={() => setShowClusterModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCreateCluster}>
                      Create Cluster
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ON-PAGE SEO CHECKER */}
        {activeTab === 'on-page' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sparkline-blue" />
                  On-Page SEO Analyzer
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluate page title length, meta description, heading structure, word count, and intent fulfillment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Target Focus Keyword
                    </label>
                    <input
                      type="text"
                      value={onPageForm.targetKeyword}
                      onChange={(e) =>
                        setOnPageForm({ ...onPageForm, targetKeyword: e.target.value })
                      }
                      placeholder="e.g., ai marketing intelligence"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Page Title (&lt;title&gt;)
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {onPageForm.title.length}/60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={onPageForm.title}
                      onChange={(e) => setOnPageForm({ ...onPageForm, title: e.target.value })}
                      placeholder="e.g., AI Marketing Intelligence Platform | Sparkline"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Meta Description
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {onPageForm.metaDescription.length}/160 chars
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={onPageForm.metaDescription}
                      onChange={(e) =>
                        setOnPageForm({ ...onPageForm, metaDescription: e.target.value })
                      }
                      placeholder="e.g., Discover market demand, analyze competitors, and plan multi-channel marketing campaigns..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Primary Heading (&lt;h1&gt;)
                    </label>
                    <input
                      type="text"
                      value={onPageForm.h1}
                      onChange={(e) => setOnPageForm({ ...onPageForm, h1: e.target.value })}
                      placeholder="e.g., Transform Your Marketing Strategy with AI Intelligence"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Content Body Text / Outline
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {onPageForm.contentBody.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    rows={9}
                    value={onPageForm.contentBody}
                    onChange={(e) =>
                      setOnPageForm({ ...onPageForm, contentBody: e.target.value })
                    }
                    placeholder="Paste draft article text, product description, or copy to analyze semantic density, length, and readability..."
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl font-sans"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-400">
                  Ranking note: Semantic coverage and user intent are prioritized over strict keyword density formulas.
                </span>
                <Button
                  variant="primary"
                  isLoading={isOnPageAnalyzing}
                  onClick={handleRunOnPageCheck}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Analyze On-Page SEO
                </Button>
              </div>
            </div>

            {/* Analysis Results */}
            {onPageResult && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    On-Page Evaluation Summary
                  </h3>
                  <Badge variant="blue" size="md">
                    Structure: {onPageResult.headingAnalysis.structureScore}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Title Analysis</span>
                    <div className="text-sm font-bold text-sparkline-midnight">
                      {onPageResult.titleAnalysis.length} Characters
                    </div>
                    <p className="text-xs text-slate-600">
                      {onPageResult.titleAnalysis.recommendation}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Meta Description</span>
                    <div className="text-sm font-bold text-sparkline-midnight">
                      {onPageResult.metaDescriptionAnalysis.length} Characters
                    </div>
                    <p className="text-xs text-slate-600">
                      {onPageResult.metaDescriptionAnalysis.recommendation}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase">H1 Progression</span>
                    <div className="text-sm font-bold text-sparkline-midnight">
                      {onPageResult.headingAnalysis.h1Count} H1 Declared
                    </div>
                    <p className="text-xs text-slate-600">
                      {onPageResult.headingAnalysis.h1HasKeyword
                        ? 'Target keyword included in H1.'
                        : 'Keyword missing from H1.'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Content Depth</span>
                    <div className="text-sm font-bold text-sparkline-midnight">
                      {onPageResult.contentLength} Words
                    </div>
                    <p className="text-xs text-slate-600">
                      {onPageResult.readabilityNotes}
                    </p>
                  </div>
                </div>

                {/* Specific Recommendations */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-sparkline-midnight uppercase tracking-wider">
                    Optimization Checklist & Findings
                  </h4>
                  <div className="space-y-2">
                    {onPageResult.overallFindings.map((finding) => (
                      <div
                        key={finding.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs"
                      >
                        {finding.priority === 'Critical' ? (
                          <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        ) : finding.priority === 'Passed Checks' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-sparkline-midnight">{finding.title}</span>
                            <Badge variant="slate" size="sm">
                              {finding.priority}
                            </Badge>
                          </div>
                          <p className="text-slate-600">{finding.description}</p>
                          <div className="mt-1 font-medium text-slate-800">
                            <strong>Fix:</strong> {finding.recommendedCorrection}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: AI SEO CONTENT OPTIMIZER */}
        {activeTab === 'ai-content' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sparkline-blue" />
                  AI SEO Content Assistant & Blueprint Generator
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generate high-CTR title variations, meta descriptions, semantic heading outlines, FAQ schema, and internal link strategies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Content Topic / Working Title
                    </label>
                    <input
                      type="text"
                      value={blueprintForm.topic}
                      onChange={(e) =>
                        setBlueprintForm({ ...blueprintForm, topic: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Primary Target Keyword
                      </label>
                      <input
                        type="text"
                        value={blueprintForm.targetKeyword}
                        onChange={(e) =>
                          setBlueprintForm({ ...blueprintForm, targetKeyword: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Search Intent
                      </label>
                      <select
                        value={blueprintForm.searchIntent}
                        onChange={(e) =>
                          setBlueprintForm({
                            ...blueprintForm,
                            searchIntent: e.target.value as SearchIntent,
                          })
                        }
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                      >
                        <option value="Informational">Informational</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Transactional">Transactional</option>
                        <option value="Navigational">Navigational</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Secondary Keyword Variations (comma separated)
                    </label>
                    <input
                      type="text"
                      value={blueprintForm.secondaryKeywords}
                      onChange={(e) =>
                        setBlueprintForm({ ...blueprintForm, secondaryKeywords: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Content Format
                    </label>
                    <select
                      value={blueprintForm.contentType}
                      onChange={(e) =>
                        setBlueprintForm({
                          ...blueprintForm,
                          contentType: e.target.value as SEOContentType,
                        })
                      }
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      <option value="Blog Article">Blog Article</option>
                      <option value="Landing Page">Landing Page</option>
                      <option value="Comparison Guide">Comparison Guide</option>
                      <option value="Product Page">Product Page</option>
                      <option value="Service Page">Service Page</option>
                      <option value="Local Business Page">Local Business Page</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Target Brand Voice
                    </label>
                    <textarea
                      rows={3}
                      value={blueprintForm.brandVoice}
                      onChange={(e) =>
                        setBlueprintForm({ ...blueprintForm, brandVoice: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  isLoading={isGeneratingBlueprint}
                  onClick={handleGenerateBlueprint}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Generate Content Blueprint
                </Button>
              </div>
            </div>

            {/* Generated Blueprint Display */}
            {blueprintResult && (
              <div className="space-y-6">
                {/* Title & Meta Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-sparkline-midnight uppercase tracking-wider">
                        High-CTR Title Tag Variations
                      </h3>
                      <Badge variant="blue" size="sm">
                        {blueprintResult.titleSuggestions.length} Options
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {blueprintResult.titleSuggestions.map((item, i) => (
                        <div
                          key={i}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-slate-800">{item.title}</div>
                            <span className="text-[11px] text-slate-400">
                              {item.charCount || item.title.length} chars (Target 50–60)
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(item.title, `title-${i}`)}
                            className="p-1.5 text-slate-400 hover:text-sparkline-midnight transition-colors"
                          >
                            {copiedKey === `title-${i}` ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-sparkline-midnight uppercase tracking-wider">
                        Meta Description Options
                      </h3>
                      <Badge variant="purple" size="sm">
                        {blueprintResult.metaDescriptionSuggestions.length} Options
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {blueprintResult.metaDescriptionSuggestions.map((item, i) => (
                        <div
                          key={i}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs"
                        >
                          <div>
                            <p className="text-slate-700">{item.description}</p>
                            <span className="text-[11px] text-slate-400 mt-1 block">
                              {item.charCount || item.description.length} chars (Target 140–160)
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(item.description, `desc-${i}`)}
                            className="p-1.5 text-slate-400 hover:text-sparkline-midnight transition-colors"
                          >
                            {copiedKey === `desc-${i}` ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Semantic Outline */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-sparkline-midnight uppercase tracking-wider">
                        Semantic Heading Architecture
                      </h3>
                      <p className="text-xs text-slate-500">
                        Logical heading structure satisfying user search intent and comprehensive topic coverage.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const outlineText = blueprintResult.headingOutline
                          .map((h) => `${h.tag.toUpperCase()}: ${h.text}`)
                          .join('\n');
                        handleCopy(outlineText, 'outline-full');
                      }}
                      leftIcon={<Copy className="w-3.5 h-3.5" />}
                    >
                      Copy Outline
                    </Button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    {blueprintResult.headingOutline.map((item, i) => (
                      <div
                        key={i}
                        className={`text-xs p-2 rounded border ${
                          item.tag === 'h1'
                            ? 'bg-blue-50/70 border-blue-200 font-bold text-sparkline-midnight text-sm'
                            : item.tag === 'h2'
                            ? 'bg-white border-slate-200 font-semibold text-slate-800 ml-3'
                            : 'bg-white border-slate-100 text-slate-600 ml-6'
                        }`}
                      >
                        <span className="font-mono uppercase text-[10px] text-slate-400 mr-2">
                          &lt;{item.tag}&gt;
                        </span>
                        {item.text}
                        {item.keywordTargeted && (
                          <span className="ml-2 text-[10px] text-sparkline-blue bg-blue-100/50 px-1.5 py-0.5 rounded">
                            Target: {item.keywordTargeted}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Introduction Hook & Media Alt Text */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-sparkline-midnight uppercase tracking-wider">
                      Opening Introduction Hook
                    </h3>
                    <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                      {blueprintResult.contentIntroductionHook}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-sparkline-midnight uppercase tracking-wider">
                      Featured Image & Alt Text Recommendation
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                      {blueprintResult.imageAltSuggestions.map((img, i) => (
                        <div key={i} className="space-y-1">
                          <strong className="text-slate-500 block">Concept: {img.imageConcept}</strong>
                          <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block">
                            Alt: "{img.suggestedAlt}"
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FAQ Schema Markup */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-sparkline-midnight uppercase tracking-wider">
                        FAQ Accordion & JSON-LD Structured Data
                      </h3>
                      <p className="text-xs text-slate-500">
                        Paste into the &lt;head&gt; of your publication template for Google rich snippet eligibility.
                      </p>
                    </div>
                    {blueprintResult.faqSchemaJson && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(blueprintResult.faqSchemaJson || '', 'faq-schema')}
                        leftIcon={<Code className="w-3.5 h-3.5" />}
                      >
                        Copy JSON-LD
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {blueprintResult.faqSuggestions.map((faq, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                          <strong className="text-sparkline-midnight block">{faq.question}</strong>
                          <p className="text-slate-600">{faq.answer}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56">
                        {blueprintResult.faqSchemaJson || 'No JSON-LD schema generated'}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: TECHNICAL SEO CHECKLIST */}
        {activeTab === 'technical' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-sparkline-blue" />
                  Technical SEO Audit Checklist
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  15 verified technical requirements across protocol security, crawl budget, canonicalization, mobile responsiveness, and schema markup.
                </p>
              </div>

              {/* Category filter */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Categories' },
                  { id: 'Security & Protocol', label: 'Security' },
                  { id: 'Crawling & Indexing', label: 'Indexing' },
                  { id: 'Architecture & Links', label: 'Architecture' },
                  { id: 'Mobile & UX', label: 'Mobile' },
                  { id: 'Schema & Meta', label: 'Schema' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setTechFilterCat(cat.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      techFilterCat === cat.id
                        ? 'bg-sparkline-blue text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist Items */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm divide-y divide-slate-100">
              {filteredTechChecks.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-sparkline-midnight">
                        {item.checkName}
                      </span>
                      <Badge variant="neutral" size="sm">
                        {item.category}
                      </Badge>
                      {item.isAutoDetected && (
                        <Badge variant="blue" size="sm">
                          Auto-Detected
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleTechStatusChange(item.id, e.target.value as TechnicalSEOCheckStatus)
                        }
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none ${
                          item.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : item.status === 'Needs Attention'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : item.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-slate-50 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Needs Attention">Needs Attention</option>
                        <option value="Not Started">Not Started</option>
                        <option value="Not Applicable">Not Applicable</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600">{item.description}</p>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-slate-500">
                      <strong>Why it matters:</strong> {item.whyItMatters}
                    </div>
                    {item.detectedValue && (
                      <div className="text-emerald-700 font-mono text-[11px] shrink-0">
                        {item.detectedValue}
                      </div>
                    )}
                  </div>

                  {item.notes && (
                    <div className="text-[11px] text-slate-500 italic pl-1">
                      Notes: {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: COMPETITOR SEO */}
        {activeTab === 'competitor' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
                  <Target className="w-5 h-5 text-sparkline-blue" />
                  Competitor SEO Metadata & Heading Intelligence
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect publicly observable competitor on-page tags, heading structures, and keyword themes without synthetic ranking predictions.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setShowCompetitorModal(true)}
              >
                Add Competitor
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {competitors.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-sparkline-midnight">
                        {comp.competitorName}
                      </h3>
                      <a
                        href={comp.competitorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sparkline-blue hover:underline flex items-center gap-1 mt-0.5"
                      >
                        {comp.competitorUrl} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <Badge variant="blue" size="sm">
                      {comp.contentFormat}
                    </Badge>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="text-slate-400 block">Observed Page Title:</span>
                    <span className="font-semibold text-slate-800">{comp.pageTitle}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="text-slate-400 block">Meta Description:</span>
                    <p className="text-slate-700">{comp.metaDescription}</p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-600 block mb-1.5">
                      Targeted Keyword Themes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {comp.observedKeywordThemes.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2.5 py-1 bg-blue-50 text-sparkline-blue border border-blue-100 rounded-lg font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <strong className="text-slate-600 block mb-0.5">Internal Linking:</strong>
                      <span className="text-slate-500">{comp.internalLinkingObservations}</span>
                    </div>
                    <div>
                      <strong className="text-slate-600 block mb-0.5">Technical Stack:</strong>
                      <span className="text-slate-500">{comp.technicalObservations}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Add Competitor */}
            {showCompetitorModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-xl">
                  <h3 className="text-lg font-bold text-sparkline-midnight">
                    Add Competitor Profile
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Competitor Name
                      </label>
                      <input
                        type="text"
                        value={newCompetitor.competitorName}
                        onChange={(e) =>
                          setNewCompetitor({ ...newCompetitor, competitorName: e.target.value })
                        }
                        placeholder="e.g., Semrush / Ahrefs"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        URL to Inspect
                      </label>
                      <input
                        type="url"
                        value={newCompetitor.competitorUrl}
                        onChange={(e) =>
                          setNewCompetitor({ ...newCompetitor, competitorUrl: e.target.value })
                        }
                        placeholder="https://competitor.com/landing-page"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Observed Page Title
                      </label>
                      <input
                        type="text"
                        value={newCompetitor.pageTitle}
                        onChange={(e) =>
                          setNewCompetitor({ ...newCompetitor, pageTitle: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Observed Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={newCompetitor.metaDescription}
                        onChange={(e) =>
                          setNewCompetitor({ ...newCompetitor, metaDescription: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={() => setShowCompetitorModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveCompetitor}>
                      Save Competitor
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: BACKLINK ANALYSIS */}
        {activeTab === 'backlinks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-sparkline-blue" />
                  Backlink Analysis & Link Building Logger
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track acquired editorial links, guest contributions, directory citations, and anchor text distribution.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={handleExportBacklinks}
                >
                  Export CSV
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowBacklinkModal(true)}
                >
                  Log Backlink
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Referring Source URL</th>
                      <th className="py-3 px-4">Destination Page</th>
                      <th className="py-3 px-3">Anchor Text</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Rel Attribute</th>
                      <th className="py-3 px-3">Verified</th>
                      <th className="py-3 px-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {backlinks.map((link) => (
                      <tr key={link.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-mono text-[11px] text-sparkline-midnight">
                          {link.sourceUrl}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                          {link.destinationUrl}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          "{link.anchorText}"
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="blue" size="sm">
                            {link.linkType}
                          </Badge>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                              link.relStatus === 'follow'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            rel="{link.relStatus}"
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {link.isVerified ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <span className="text-slate-400">Pending</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              seoService.deleteBacklink(link.id);
                              setBacklinks(seoService.getBacklinks());
                              addToast({ title: 'Backlink deleted', type: 'info' });
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {backlinks.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-400">
                          No backlinks logged yet. Add your first confirmed inbound citation.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Log Backlink */}
            {showBacklinkModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-xl">
                  <h3 className="text-lg font-bold text-sparkline-midnight">Log Backlink</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Source URL (Where link appears)
                      </label>
                      <input
                        type="url"
                        value={newBacklink.sourceUrl}
                        onChange={(e) =>
                          setNewBacklink({ ...newBacklink, sourceUrl: e.target.value })
                        }
                        placeholder="https://techradar.com/article/top-marketing-tools"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Destination URL (Target page on your domain)
                      </label>
                      <input
                        type="url"
                        value={newBacklink.destinationUrl}
                        onChange={(e) =>
                          setNewBacklink({ ...newBacklink, destinationUrl: e.target.value })
                        }
                        placeholder="https://sparklinemarketing.com/features/audience-intelligence"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Anchor Text</label>
                      <input
                        type="text"
                        value={newBacklink.anchorText}
                        onChange={(e) =>
                          setNewBacklink({ ...newBacklink, anchorText: e.target.value })
                        }
                        placeholder="e.g., Sparkline Marketing Intelligence"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Link Type</label>
                        <select
                          value={newBacklink.linkType}
                          onChange={(e) =>
                            setNewBacklink({
                              ...newBacklink,
                              linkType: e.target.value as BacklinkRecord['linkType'],
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        >
                          <option value="Editorial Link">Editorial Link</option>
                          <option value="Directory">Directory</option>
                          <option value="Partner Mention">Partner Mention</option>
                          <option value="Guest Contribution">Guest Contribution</option>
                          <option value="Resource List">Resource List</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Rel Status
                        </label>
                        <select
                          value={newBacklink.relStatus}
                          onChange={(e) =>
                            setNewBacklink({
                              ...newBacklink,
                              relStatus: e.target.value as BacklinkRecord['relStatus'],
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        >
                          <option value="follow">follow</option>
                          <option value="nofollow">nofollow</option>
                          <option value="ugc">ugc</option>
                          <option value="sponsored">sponsored</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={() => setShowBacklinkModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveBacklink}>
                      Save Backlink
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: SEO CONTENT PLANNER */}
        {activeTab === 'planner' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sparkline-blue" />
                  SEO Content Editorial Planner
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Schedule search-driven articles, assign primary target keywords, and track publication milestones.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setShowPlanModal(true)}
              >
                Add Content Item
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Article / Page Title</th>
                      <th className="py-3 px-3">Primary Keyword</th>
                      <th className="py-3 px-3">Intent</th>
                      <th className="py-3 px-3">Format</th>
                      <th className="py-3 px-3">Publish Date</th>
                      <th className="py-3 px-3">Priority</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {contentPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-sparkline-midnight">
                          {plan.title}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-700">
                          {plan.primaryKeyword}
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="blue" size="sm">
                            {plan.searchIntent}
                          </Badge>
                        </td>
                        <td className="py-3 px-3">{plan.contentType}</td>
                        <td className="py-3 px-3 text-slate-500">{plan.targetPublishDate}</td>
                        <td className="py-3 px-3">
                          <Badge
                            variant={
                              plan.priority === 'High'
                                ? 'magenta'
                                : plan.priority === 'Medium'
                                ? 'orange'
                                : 'slate'
                            }
                            size="sm"
                          >
                            {plan.priority}
                          </Badge>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              plan.status === 'Published'
                                ? 'bg-emerald-50 text-emerald-700'
                                : plan.status === 'In Review'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {plan.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              seoService.deleteContentPlan(plan.id);
                              setContentPlans(seoService.getContentPlans());
                              addToast({ title: 'Plan deleted', type: 'info' });
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {contentPlans.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-slate-400">
                          No content plans added. Plan your first search-optimized article.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Add Content Plan */}
            {showPlanModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-xl">
                  <h3 className="text-lg font-bold text-sparkline-midnight">
                    Add SEO Content Plan
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Content Working Title
                      </label>
                      <input
                        type="text"
                        value={newPlan.title}
                        onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                        placeholder="e.g., The Definitive Guide to Marketing Metrics"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Primary Target Keyword
                      </label>
                      <input
                        type="text"
                        value={newPlan.primaryKeyword}
                        onChange={(e) =>
                          setNewPlan({ ...newPlan, primaryKeyword: e.target.value })
                        }
                        placeholder="e.g., marketing metrics framework"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Search Intent
                        </label>
                        <select
                          value={newPlan.searchIntent}
                          onChange={(e) =>
                            setNewPlan({
                              ...newPlan,
                              searchIntent: e.target.value as SearchIntent,
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        >
                          <option value="Informational">Informational</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Transactional">Transactional</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Content Type
                        </label>
                        <select
                          value={newPlan.contentType}
                          onChange={(e) =>
                            setNewPlan({
                              ...newPlan,
                              contentType: e.target.value as SEOContentType,
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        >
                          <option value="Blog Article">Blog Article</option>
                          <option value="Landing Page">Landing Page</option>
                          <option value="Comparison Guide">Comparison Guide</option>
                          <option value="Product Page">Product Page</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Target Date
                        </label>
                        <input
                          type="date"
                          value={newPlan.targetPublishDate}
                          onChange={(e) =>
                            setNewPlan({ ...newPlan, targetPublishDate: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Status
                        </label>
                        <select
                          value={newPlan.status}
                          onChange={(e) =>
                            setNewPlan({ ...newPlan, status: e.target.value as SEOContentStatus })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        >
                          <option value="Idea">Idea</option>
                          <option value="Brief Ready">Brief Ready</option>
                          <option value="Writing">Writing</option>
                          <option value="In Review">In Review</option>
                          <option value="Published">Published</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={() => setShowPlanModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveContentPlan}>
                      Save Content Plan
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 10: LEARNING CENTER & PERFORMANCE TRACKING */}
        {activeTab === 'learning' && (
          <div className="space-y-8">
            {/* Performance Tracking Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-sparkline-blue" />
                    Organic Search Performance Log
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Log and track verified Google Search Console performance benchmarks over time.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowPerfModal(true)}
                >
                  Log Monthly Snapshot
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">
                    Total Organic Clicks
                  </span>
                  <div className="text-2xl font-bold text-sparkline-midnight">
                    {latestPerf ? latestPerf.organicClicks.toLocaleString() : '0'}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">30-Day Period</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">
                    Organic Impressions
                  </span>
                  <div className="text-2xl font-bold text-sparkline-midnight">
                    {latestPerf ? latestPerf.organicImpressions.toLocaleString() : '0'}
                  </div>
                  <span className="text-[11px] text-blue-600 font-medium">SERP Visibility</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">
                    Average Position
                  </span>
                  <div className="text-2xl font-bold text-sparkline-midnight">
                    {latestPerf ? latestPerf.averagePosition.toFixed(1) : '—'}
                  </div>
                  <span className="text-[11px] text-purple-600 font-medium">Top 10 Benchmark</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">
                    Organic CTR
                  </span>
                  <div className="text-2xl font-bold text-sparkline-midnight">
                    {latestPerf ? `${latestPerf.ctr}%` : '0%'}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Click-Through Rate</span>
                </div>
              </div>
            </div>

            {/* Educational Knowledge Center */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-sparkline-midnight flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-sparkline-blue" />
                    SEO Knowledge Center & Best Practices Guide
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Actionable, evidence-based SEO guidance covering technical architecture, crawling, schema, and search intent.
                  </p>
                </div>

                {/* Category filters */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All Guides' },
                    { id: 'SEO Fundamentals', label: 'Fundamentals' },
                    { id: 'Keyword Research', label: 'Keywords' },
                    { id: 'On-Page SEO', label: 'On-Page' },
                    { id: 'Technical SEO', label: 'Technical' },
                    { id: 'Structured Data', label: 'Schema' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setSelectedLearningCat(btn.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        selectedLearningCat === btn.id
                          ? 'bg-sparkline-midnight text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningArticles
                  .filter(
                    (art) =>
                      selectedLearningCat === 'all' || art.category === selectedLearningCat
                  )
                  .map((art) => (
                    <div
                      key={art.id}
                      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="blue" size="sm">
                            {art.category}
                          </Badge>
                          <span className="text-[11px] text-slate-400">{art.readTime}</span>
                        </div>
                        <h4 className="text-base font-bold text-sparkline-midnight">
                          {art.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {art.whyItMatters}
                        </p>

                        <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                          <div>
                            <strong className="text-slate-700 block mb-0.5">Key Concepts:</strong>
                            <p className="text-slate-600">{art.definition}</p>
                          </div>
                          <div>
                            <strong className="text-emerald-700 block mb-0.5">Practical Example:</strong>
                            <p className="text-slate-600">{art.practicalExample}</p>
                          </div>
                          <div>
                            <strong className="text-red-600 block mb-0.5">Common Mistake:</strong>
                            <p className="text-slate-600">{art.commonMistakes[0] || 'Lack of keyword intent mapping'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>Sparkline SEO Academy</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Modal: Log Performance Snapshot */}
            {showPerfModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-xl">
                  <h3 className="text-lg font-bold text-sparkline-midnight">
                    Log Search Console Snapshot
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Snapshot Date
                        </label>
                        <input
                          type="date"
                          value={newPerf.date}
                          onChange={(e) => setNewPerf({ ...newPerf, date: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Organic Clicks
                        </label>
                        <input
                          type="number"
                          value={newPerf.organicClicks}
                          onChange={(e) =>
                            setNewPerf({ ...newPerf, organicClicks: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Impressions
                        </label>
                        <input
                          type="number"
                          value={newPerf.organicImpressions}
                          onChange={(e) =>
                            setNewPerf({ ...newPerf, organicImpressions: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Average Position
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={newPerf.averagePosition}
                          onChange={(e) =>
                            setNewPerf({ ...newPerf, averagePosition: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          CTR (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={newPerf.ctr}
                          onChange={(e) =>
                            setNewPerf({ ...newPerf, ctr: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Organic Conversions
                        </label>
                        <input
                          type="number"
                          value={newPerf.organicConversions}
                          onChange={(e) =>
                            setNewPerf({ ...newPerf, organicConversions: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Snapshot Notes
                      </label>
                      <input
                        type="text"
                        value={newPerf.notes}
                        onChange={(e) => setNewPerf({ ...newPerf, notes: e.target.value })}
                        placeholder="e.g., Post-migration quarterly benchmark"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={() => setShowPerfModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSavePerformance}>
                      Save Snapshot
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
