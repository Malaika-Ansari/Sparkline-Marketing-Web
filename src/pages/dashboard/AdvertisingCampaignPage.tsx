/**
 * Advertising Campaign Studio Workspace
 * Sparkline Marketing Intelligence Platform — Phase 16
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/components/common/Feedback';
import { projectService } from '@/services/project.service';
import {
  campaignService,
  CAMPAIGN_TEMPLATES,
} from '@/services/campaign.service';
import {
  AdvertisingCampaign,
  CampaignStatus,
  CampaignObjective,
  CampaignPlatform,
  CreativeFormat,
  CampaignCopyVariation,
  CampaignPerformance,
} from '@/types/campaign';
import { MarketingProject } from '@/types/project';
import {
  Megaphone,
  Plus,
  Search,
  Calendar,
  Layers,
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  Trash2,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Target,
  DollarSign,
  BarChart3,
  Clock,
  Sliders,
  Zap,
} from 'lucide-react';

const OBJECTIVES: CampaignObjective[] = [
  'Sales and Conversions',
  'Lead Generation',
  'Website Traffic',
  'Brand Awareness',
  'Reach',
  'Engagement',
  'App Promotion',
  'Customer Retention',
];

const PLATFORMS: CampaignPlatform[] = [
  'Meta Ads',
  'Google Ads',
  'TikTok Ads',
  'LinkedIn Ads',
  'YouTube Ads',
  'Pinterest Ads',
];

const STATUSES: CampaignStatus[] = [
  'Draft',
  'Planned',
  'Ready for Review',
  'Active',
  'Paused',
  'Completed',
  'Archived',
];

const FORMATS: CreativeFormat[] = [
  'Single Image',
  'Video',
  'Carousel',
  'Story / Vertical Video',
  'Collection / Product Catalog',
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'PKR', 'INR', 'AED', 'SAR'];

export const AdvertisingCampaignPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  // Active Workspace Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'campaigns' | 'calendar' | 'copy' | 'brief' | 'templates' | 'performance'
  >('campaigns');

  // Project Context
  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('All');

  // Campaigns State
  const [campaigns, setCampaigns] = useState<AdvertisingCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<AdvertisingCampaign | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPlatform, setFilterPlatform] = useState<string>('All');
  const [filterObjective, setFilterObjective] = useState<string>('All');

  // Wizard Modal State
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardCampaign, setWizardCampaign] = useState<AdvertisingCampaign>(() =>
    campaignService.createBlankCampaign()
  );

  // Copy Tool State
  const [copyPlatform, setCopyPlatform] = useState<CampaignPlatform>('Meta Ads');
  const [copyProduct, setCopyProduct] = useState<string>('SaaS Marketing Platform');
  const [copyBrand, setCopyBrand] = useState<string>('Sparkline');
  const [copyObjective, setCopyObjective] = useState<string>('Sales and Conversions');
  const [generatedCopyList, setGeneratedCopyList] = useState<CampaignCopyVariation[]>([]);

  // Performance Log Modal State
  const [isPerfModalOpen, setIsPerfModalOpen] = useState<boolean>(false);
  const [perfCampaignTarget, setPerfCampaignTarget] = useState<AdvertisingCampaign | null>(null);
  const [perfForm, setPerfForm] = useState<Partial<CampaignPerformance>>({
    impressions: 50000,
    reach: 32000,
    clicks: 1250,
    spend: 1500,
    leads: 85,
    conversions: 35,
    revenue: 5250,
    dataSource: 'manual_entry',
  });

  // AI Strategy Generation
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load Initial Data
  useEffect(() => {
    const pList = projectService.getProjects();
    setProjects(pList);
    const paramProj = searchParams.get('projectId');
    if (paramProj && pList.some((p) => p.id === paramProj)) {
      setSelectedProjectId(paramProj);
    }

    const cList = campaignService.getCampaigns();
    setCampaigns(cList);
    if (cList.length > 0) {
      setSelectedCampaign(cList[0] || null);
    }

    // Default copy generator list
    setGeneratedCopyList(
      campaignService.generateDefaultCopyVariations('Meta Ads', 'Intelligence Suite', 'Sparkline', 'Conversions')
    );
  }, [searchParams]);

  // Filtered Campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchProj = selectedProjectId === 'All' || c.projectId === selectedProjectId;
      const matchStatus = filterStatus === 'All' || c.status === filterStatus;
      const matchPlatform =
        filterPlatform === 'All' || c.platforms.includes(filterPlatform as CampaignPlatform);
      const matchObjective = filterObjective === 'All' || c.objective === filterObjective;
      const matchSearch =
        !searchQuery.trim() ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.productService.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchProj && matchStatus && matchPlatform && matchObjective && matchSearch;
    });
  }, [campaigns, selectedProjectId, filterStatus, filterPlatform, filterObjective, searchQuery]);

  // Overview Counts
  const stats = useMemo(() => {
    return {
      total: campaigns.length,
      active: campaigns.filter((c) => c.status === 'Active').length,
      planned: campaigns.filter((c) => c.status === 'Planned' || c.status === 'Ready for Review')
        .length,
      draft: campaigns.filter((c) => c.status === 'Draft').length,
      totalBudget: campaigns.reduce((acc, c) => acc + (c.budget?.totalBudget || 0), 0),
    };
  }, [campaigns]);

  // Open Wizard with Blank or Template
  const handleStartWizard = (templateId?: string) => {
    const proj = projects.find((p) => p.id === selectedProjectId) || projects[0] || null;
    const blank = campaignService.createBlankCampaign(proj, templateId);
    setWizardCampaign(blank);
    setWizardStep(1);
    setIsWizardOpen(true);
  };

  // Save from Wizard
  const handleSaveWizardCampaign = () => {
    campaignService.saveCampaign(wizardCampaign);
    const updated = campaignService.getCampaigns();
    setCampaigns(updated);
    setSelectedCampaign(wizardCampaign);
    setIsWizardOpen(false);
    addToast({
      type: 'success',
      title: 'Campaign Saved',
      message: `"${wizardCampaign.name}" has been created and organized in your workspace.`,
    });
  };

  // Duplicate Campaign
  const handleDuplicate = (id: string) => {
    const dup = campaignService.duplicateCampaign(id);
    if (dup) {
      setCampaigns(campaignService.getCampaigns());
      setSelectedCampaign(dup);
      addToast({
        type: 'success',
        title: 'Campaign Duplicated',
        message: `Created clone "${dup.name}".`,
      });
    }
  };

  // Delete Campaign
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      campaignService.deleteCampaign(id);
      const list = campaignService.getCampaigns();
      setCampaigns(list);
      if (selectedCampaign?.id === id) {
        setSelectedCampaign(list[0] || null);
      }
      addToast({
        type: 'info',
        title: 'Campaign Deleted',
        message: 'Campaign record removed.',
      });
    }
  };

  // Update Status
  const handleStatusChange = (id: string, newStatus: CampaignStatus) => {
    campaignService.updateCampaignStatus(id, newStatus);
    setCampaigns(campaignService.getCampaigns());
    addToast({
      type: 'info',
      title: 'Status Updated',
      message: `Campaign marked as ${newStatus}.`,
    });
  };

  // Export CSV
  const handleExportCsv = (c: AdvertisingCampaign) => {
    const csv = campaignService.exportCampaignCsv(c);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sparkline-campaign-${c.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: 'Campaign structure downloaded.',
    });
  };

  // Generate Ad Copy
  const handleGenerateCopy = () => {
    const list = campaignService.generateDefaultCopyVariations(
      copyPlatform,
      copyProduct,
      copyBrand,
      copyObjective
    );
    setGeneratedCopyList(list);
    addToast({
      type: 'success',
      title: 'Ad Copy Angles Generated',
      message: '6 diverse messaging angles produced with character validation.',
    });
  };

  // Copy Text Handler
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    addToast({
      type: 'success',
      title: 'Copied',
      message: 'Ad copy copied to clipboard.',
    });
  };

  // Save Performance Data
  const handleSavePerformance = () => {
    if (!perfCampaignTarget) return;

    const calculated = campaignService.calculatePerformance(
      perfForm,
      perfForm.dataSource || 'manual_entry'
    );
    const optimizations = campaignService.evaluateOptimizations(calculated, perfCampaignTarget.budget);

    const updated: AdvertisingCampaign = {
      ...perfCampaignTarget,
      performance: calculated,
      optimizations,
    };

    campaignService.saveCampaign(updated);
    setCampaigns(campaignService.getCampaigns());
    setSelectedCampaign(updated);
    setIsPerfModalOpen(false);

    addToast({
      type: 'success',
      title: 'Performance Logged',
      message: `Recorded ${calculated.clicks.toLocaleString()} clicks and evaluated ${optimizations.length} optimization insights.`,
    });
  };

  // Generate AI Plan
  const handleGenerateAiPlan = async (c: AdvertisingCampaign) => {
    setIsAiGenerating(true);
    addToast({
      type: 'info',
      title: 'AI Campaign Assistant Active',
      message: 'Synthesizing 13-point performance strategy plan...',
    });

    try {
      const plan = await campaignService.generateAICampaignPlan(c);
      const updated = { ...c, aiStrategyPlan: plan };
      campaignService.saveCampaign(updated);
      setCampaigns(campaignService.getCampaigns());
      setSelectedCampaign(updated);
      addToast({
        type: 'success',
        title: 'Strategy Plan Ready',
        message: '13-point structured campaign roadmap attached.',
      });
    } catch {
      addToast({
        type: 'warning',
        title: 'Standard Strategy Attached',
        message: 'Deterministic expert rules deployed.',
      });
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <>
      <SEO
        title="Advertising Campaign Studio — Sparkline Marketing"
        description="Plan multi-platform advertising campaigns, generate high-converting ad copy, create creative briefs, and track campaign performance."
      />

      <div className="space-y-8 pb-16">
        {/* ========================================================================= */}
        {/* TOP COMMAND HEADER */}
        {/* ========================================================================= */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="blue" className="px-2.5 py-0.5">
                <Megaphone className="w-3 h-3 mr-1" />
                Advertising Hub Core
              </Badge>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Multi-Platform • 6-Step Wizard • Creative Studio
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight font-display">
              Advertising Campaign Studio
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Plan smarter campaigns, create compelling advertising strategies and organize every
              stage of execution.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Project Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <Target className="w-4 h-4 text-sparkline-blue shrink-0" />
              <select
                aria-label="Filter by Project"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-sparkline-midnight focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="All">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.business.brandName}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('templates')}
              className="gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">Templates</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStartWizard()}
              className="gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* METRICS STATS BAR */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Total Campaigns
              </span>
              <p className="text-xl font-extrabold text-sparkline-midnight font-mono mt-0.5">
                {stats.total}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-sparkline-blue flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Active Flight</span>
              <p className="text-xl font-extrabold text-emerald-600 font-mono mt-0.5">
                {stats.active}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">In Planning</span>
              <p className="text-xl font-extrabold text-blue-600 font-mono mt-0.5">
                {stats.planned}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Drafts</span>
              <p className="text-xl font-extrabold text-slate-600 font-mono mt-0.5">
                {stats.draft}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between col-span-2 lg:col-span-1">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Allocated Budget
              </span>
              <p className="text-xl font-extrabold text-sparkline-blue font-mono mt-0.5">
                ${stats.totalBudget.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-sparkline-blue flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN NAVIGATION TABS */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'campaigns'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Campaigns Library ({filteredCampaigns.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Flight Calendar & Schedule</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('copy')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'copy'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Ad Copy Generator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('brief')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'brief'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Creative Brief Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'templates'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Starter Templates (8)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'performance'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Tracking & Optimization</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: CAMPAIGNS LIST & DETAILS */}
        {/* ========================================================================= */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search campaigns by name, product..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-sparkline-midnight focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                {/* Status Filter */}
                <select
                  aria-label="Status Filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {/* Platform Filter */}
                <select
                  aria-label="Platform Filter"
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="All">All Platforms</option>
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                {/* Objective Filter */}
                <select
                  aria-label="Objective Filter"
                  value={filterObjective}
                  onChange={(e) => setFilterObjective(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="All">All Objectives</option>
                  {OBJECTIVES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Campaign Cards Grid */}
            {filteredCampaigns.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-sparkline-blue flex items-center justify-center mx-auto">
                  <Megaphone className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-sparkline-midnight">
                  No Campaigns Found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {campaigns.length === 0
                    ? 'Start planning your first multi-platform campaign or pick from 8 starter templates.'
                    : 'No campaigns match your active search filters.'}
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStartWizard()}
                    className="gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Campaign</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((c) => (
                  <div
                    key={c.id}
                    className={`bg-white rounded-2xl border p-6 shadow-card flex flex-col justify-between space-y-5 transition-all hover:border-sparkline-blue ${
                      selectedCampaign?.id === c.id ? 'ring-2 ring-sparkline-blue' : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            c.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : c.status === 'Planned'
                              ? 'bg-blue-50 text-blue-700'
                              : c.status === 'Ready for Review'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {c.status}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDuplicate(c.id)}
                            title="Duplicate campaign"
                            className="p-1 rounded text-slate-400 hover:text-slate-600"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(c.id)}
                            title="Delete campaign"
                            className="p-1 rounded text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-sparkline-midnight leading-snug">
                          {c.name}
                        </h3>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          {c.productService} • {c.industry}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>

                      {/* Platforms Badge Row */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {c.platforms.map((p) => (
                          <span
                            key={p}
                            className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md"
                          >
                            {p}
                          </span>
                        ))}
                      </div>

                      {/* Budget & Flight Info */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">
                            Total Budget
                          </span>
                          <span className="font-mono font-bold text-sparkline-midnight">
                            {c.budget.currency} {c.budget.totalBudget.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
                          <span className="font-mono font-bold text-slate-700">
                            {c.schedule.durationDays} Days
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCampaign(c);
                            setActiveTab('performance');
                          }}
                          className="flex-1 text-xs justify-center gap-1"
                        >
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>Track Results</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportCsv(c)}
                          className="px-2 text-xs"
                          title="Export CSV"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleGenerateAiPlan(c)}
                        disabled={isAiGenerating}
                        className="w-full text-xs justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Strategy Plan</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Campaign Detailed Hierarchy Drawer / Preview */}
            {selectedCampaign && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sparkline-blue bg-blue-50 px-2.5 py-0.5 rounded-full">
                        {selectedCampaign.objective}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Flight: {selectedCampaign.schedule.startDate} to{' '}
                        {selectedCampaign.schedule.endDate}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-sparkline-midnight mt-1">
                      {selectedCampaign.name} — Structure & Hierarchy
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      aria-label="Change Status"
                      value={selectedCampaign.status}
                      onChange={(e) =>
                        handleStatusChange(selectedCampaign.id, e.target.value as CampaignStatus)
                      }
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-sparkline-midnight focus:outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          Status: {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Ad Groups / Ad Sets Grid */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-sparkline-midnight uppercase tracking-wider">
                    Configured Ad Groups / Ad Sets ({selectedCampaign.structure.adGroups.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCampaign.structure.adGroups.map((group) => (
                      <div
                        key={group.id}
                        className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{group.name}</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-sparkline-blue">
                            {selectedCampaign.budget.currency} {group.budgetAllocation.toLocaleString()}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500">
                          <strong>Targeting:</strong> {group.targetAudienceSummary}
                        </p>

                        <div className="space-y-2 pt-2 border-t border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">
                            Ads Inside ({group.ads.length})
                          </span>
                          {group.ads.map((ad) => (
                            <div
                              key={ad.id}
                              className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sparkline-midnight">{ad.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {ad.format}
                                </span>
                              </div>
                              <p className="text-slate-600 italic">
                                &quot;{ad.headline}&quot;
                              </p>
                              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                                <span>CTA: {ad.callToAction}</span>
                                <a
                                  href={ad.destinationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sparkline-blue flex items-center gap-0.5 hover:underline"
                                >
                                  <span>Landing Page</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Plan Attachment if Present */}
                {selectedCampaign.aiStrategyPlan && (
                  <div className="p-6 rounded-xl bg-purple-50/60 border border-purple-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        AI Strategic Campaign Recommendations
                      </span>
                      <span className="text-[10px] text-purple-600 font-mono">
                        {new Date(selectedCampaign.aiStrategyPlan.generatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-purple-950 leading-relaxed">
                      {selectedCampaign.aiStrategyPlan.campaignObjectiveRationale}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-white p-4 rounded-xl border border-purple-100 space-y-1.5">
                        <span className="font-bold text-slate-800 block">Creative & Messaging Strategy</span>
                        <p className="text-slate-600 leading-relaxed">
                          {selectedCampaign.aiStrategyPlan.creativeDirection}
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-purple-100 space-y-1.5">
                        <span className="font-bold text-slate-800 block">Budget & Testing Protocol</span>
                        <p className="text-slate-600 leading-relaxed">
                          {selectedCampaign.aiStrategyPlan.budgetAllocationAdvice}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FLIGHT CALENDAR & SCHEDULE */}
        {/* ========================================================================= */}
        {activeTab === 'calendar' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight">
                  Campaign Flight Calendar & Key Milestones
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual timeline of active campaigns, creative deadlines, testing periods, and reporting dates.
                </p>
              </div>

              {campaigns.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  No active or planned campaigns scheduled.
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((c) => (
                    <div
                      key={c.id}
                      className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 hover:border-sparkline-blue transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-sparkline-midnight">
                            {c.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            {c.platforms.join(', ')} • {c.budget.currency}{' '}
                            {c.budget.totalBudget.toLocaleString()}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider self-start sm:self-auto ${
                            c.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>

                      {/* Flight Milestone Badges */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <span className="text-[10px] text-slate-400 block uppercase">Flight Dates</span>
                          <span className="font-mono font-bold text-slate-700">
                            {c.schedule.startDate} → {c.schedule.endDate}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
                          <span className="font-mono font-bold text-slate-700">
                            {c.schedule.durationDays} Days
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <span className="text-[10px] text-slate-400 block uppercase">Creative Deadline</span>
                          <span className="font-mono font-bold text-slate-700">
                            {c.schedule.creativeDeadlines || 'Day 5'}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <span className="text-[10px] text-slate-400 block uppercase">Testing Phase</span>
                          <span className="font-mono font-bold text-sparkline-blue">
                            {c.schedule.testingPeriod || 'Days 1-7'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AD COPY GENERATOR */}
        {/* ========================================================================= */}
        {activeTab === 'copy' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Generator Controls */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight">
                  Ad Copy Generator & Multi-Angle Testing Studio
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generate benefit-driven, problem-solution, and emotional copy variations tailored to platform character limits.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Advertising Platform</label>
                  <select
                    value={copyPlatform}
                    onChange={(e) => setCopyPlatform(e.target.value as CampaignPlatform)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campaign Objective</label>
                  <select
                    value={copyObjective}
                    onChange={(e) => setCopyObjective(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none"
                  >
                    {OBJECTIVES.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={copyBrand}
                    onChange={(e) => setCopyBrand(e.target.value)}
                    placeholder="e.g. Sparkline"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product / Offering</label>
                  <input
                    type="text"
                    value={copyProduct}
                    onChange={(e) => setCopyProduct(e.target.value)}
                    placeholder="e.g. Analytics Platform"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleGenerateCopy}
                    className="w-full h-[38px] gap-1.5 justify-center"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate 6 Angles</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Generated Copy Variations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedCopyList.map((cp) => (
                <div
                  key={cp.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between space-y-4 hover:border-sparkline-blue transition-all"
                >
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-sparkline-blue uppercase">
                        {cp.angle}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {cp.characterCount.headline} / 40 chars
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Headline</span>
                      <h4 className="text-sm font-bold text-sparkline-midnight">
                        {cp.headline}
                      </h4>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Text</span>
                      <p className="text-slate-600 leading-relaxed">
                        {cp.primaryText}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">CTA: <strong>{cp.callToAction}</strong></span>
                      <span className="text-slate-400 italic">{cp.description}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleCopyText(
                        cp.id,
                        `Headline: ${cp.headline}\nPrimary Text: ${cp.primaryText}\nCTA: ${cp.callToAction}`
                      )
                    }
                    className="w-full gap-1.5 justify-center text-xs"
                  >
                    {copiedId === cp.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === cp.id ? 'Copied' : 'Copy Ad Text'}</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CREATIVE BRIEF STUDIO */}
        {/* ========================================================================= */}
        {activeTab === 'brief' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-sparkline-midnight">
                    Advertising Creative Brief Studio
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Clear visual specs, copy directions, asset dimensions, and testing hooks for designers and editors.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedCampaign?.creativeBrief) {
                      const text = `# CREATIVE BRIEF: ${selectedCampaign.creativeBrief.campaignName}
Objective: ${selectedCampaign.creativeBrief.objective}
Target Audience: ${selectedCampaign.creativeBrief.targetAudience}
Main Message: ${selectedCampaign.creativeBrief.mainMessage}
Concept: ${selectedCampaign.creativeBrief.creativeConcept}
Visual Direction: ${selectedCampaign.creativeBrief.visualDirection}
Brand Colors: ${selectedCampaign.creativeBrief.brandColors.join(', ')}
Required Assets:
${selectedCampaign.creativeBrief.requiredAssets.map((a) => `- ${a}`).join('\n')}
Specifications:
${selectedCampaign.creativeBrief.creativeSpecifications.map((s) => `- ${s}`).join('\n')}`;
                      handleCopyText('brief_md', text);
                    }
                  }}
                  className="gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Markdown Brief</span>
                </Button>
              </div>

              {selectedCampaign?.creativeBrief ? (
                <div className="space-y-6 text-xs text-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <span className="font-bold text-sparkline-midnight text-sm block">
                        Core Concept & Hook Narrative
                      </span>
                      <p className="leading-relaxed text-slate-600">
                        {selectedCampaign.creativeBrief.creativeConcept}
                      </p>
                      <div>
                        <strong>Main Customer Message:</strong>
                        <p className="text-slate-600 mt-0.5">
                          {selectedCampaign.creativeBrief.mainMessage}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <span className="font-bold text-sparkline-midnight text-sm block">
                        Visual Direction & Palette
                      </span>
                      <p className="leading-relaxed text-slate-600">
                        {selectedCampaign.creativeBrief.visualDirection}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedCampaign.creativeBrief.brandColors.map((color) => (
                          <span
                            key={color}
                            className="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px]"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Required Asset Specifications */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sparkline-midnight uppercase tracking-wider">
                      Required Deliverable Dimensions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {selectedCampaign.creativeBrief.requiredAssets.map((asset, i) => (
                        <div
                          key={i}
                          className="p-3 bg-white border border-slate-200 rounded-xl space-y-1"
                        >
                          <span className="font-bold text-sparkline-blue block">{asset}</span>
                          <span className="text-[10px] text-slate-400">Production ready</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Guidelines */}
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1.5">
                    <span className="font-bold text-sparkline-blue flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Editor Delivery Guidelines
                    </span>
                    <ul className="space-y-1 text-slate-600 pl-4 list-disc">
                      {selectedCampaign.creativeBrief.creativeSpecifications.map((spec, i) => (
                        <li key={i}>{spec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 text-xs">
                  Select a campaign in the Campaigns tab to view its creative brief.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: STARTER TEMPLATES (8) */}
        {/* ========================================================================= */}
        {activeTab === 'templates' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card">
              <h2 className="text-lg font-bold text-sparkline-midnight">
                8 Proven Advertising Campaign Starter Templates
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pre-configured campaign structures, recommended platform splits, sample copy, and audience targeting foundations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CAMPAIGN_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between space-y-4 hover:border-sparkline-blue transition-all"
                >
                  <div className="space-y-3 text-xs">
                    <span className="text-[10px] font-bold text-sparkline-blue bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                      {tpl.category}
                    </span>

                    <h3 className="text-base font-bold text-sparkline-midnight leading-snug">
                      {tpl.name}
                    </h3>

                    <p className="text-slate-600 line-clamp-3 leading-relaxed">
                      {tpl.description}
                    </p>

                    <div className="space-y-1 pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase">
                        Recommended Platforms
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {tpl.recommendedPlatforms.map((p) => (
                          <span
                            key={p}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block uppercase">
                        Sample Headline
                      </span>
                      <p className="italic text-slate-700 font-semibold">
                        &quot;{tpl.sampleHeadline}&quot;
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStartWizard(tpl.id)}
                    className="w-full gap-1.5 justify-center text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Use Template</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: PERFORMANCE TRACKING & OPTIMIZATION */}
        {/* ========================================================================= */}
        {activeTab === 'performance' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-sparkline-midnight">
                    Campaign Performance Tracking & Optimization Diagnostics
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Log completed flight numbers or connect live reports to calculate CTR, CPC, CPA, ROAS, and receive rule-based optimizations.
                  </p>
                </div>

                {selectedCampaign && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setPerfCampaignTarget(selectedCampaign);
                      if (selectedCampaign.performance?.hasActualData) {
                        setPerfForm({ ...selectedCampaign.performance });
                      }
                      setIsPerfModalOpen(true);
                    }}
                    className="gap-1.5 self-start sm:self-auto"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Log Performance Data</span>
                  </Button>
                )}
              </div>

              {selectedCampaign?.performance?.hasActualData ? (
                <div className="space-y-6">
                  {/* KPI Cards Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-xs text-slate-500 uppercase font-semibold">
                        Total Spend
                      </span>
                      <p className="text-2xl font-black text-sparkline-midnight font-mono">
                        ${selectedCampaign.performance.spend.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {selectedCampaign.performance.impressions.toLocaleString()} Impressions
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-xs text-slate-500 uppercase font-semibold">
                        Click-Through Rate (CTR)
                      </span>
                      <p className="text-2xl font-black text-sparkline-blue font-mono">
                        {selectedCampaign.performance.ctr}%
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {selectedCampaign.performance.clicks.toLocaleString()} Clicks
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-xs text-slate-500 uppercase font-semibold">
                        Cost Per Click (CPC)
                      </span>
                      <p className="text-2xl font-black text-slate-800 font-mono">
                        ${selectedCampaign.performance.cpc}
                      </p>
                      <span className="text-[10px] text-slate-400">Auction cleared</span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-xs text-slate-500 uppercase font-semibold">
                        Return on Ad Spend (ROAS)
                      </span>
                      <p className="text-2xl font-black text-emerald-600 font-mono">
                        {selectedCampaign.performance.roas}x
                      </p>
                      <span className="text-[10px] text-slate-400">
                        ${selectedCampaign.performance.revenue.toLocaleString()} Revenue
                      </span>
                    </div>
                  </div>

                  {/* Optimizations Diagnostics List */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-sparkline-midnight uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Automated Diagnostic Optimizations ({selectedCampaign.optimizations.length})</span>
                    </h3>

                    {selectedCampaign.optimizations.length === 0 ? (
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>All metrics are operating within healthy benchmark boundaries!</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedCampaign.optimizations.map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-4 rounded-xl border space-y-2 text-xs ${
                              opt.severity === 'High'
                                ? 'bg-rose-50/50 border-rose-200'
                                : opt.severity === 'Medium'
                                ? 'bg-amber-50/50 border-amber-200'
                                : 'bg-blue-50/50 border-blue-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                                {opt.area}: {opt.observation}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono bg-white border">
                                {opt.severity} Priority
                              </span>
                            </div>

                            <p className="text-slate-600">{opt.whyItMatters}</p>

                            <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1">
                              <span className="font-bold text-sparkline-blue block">Suggested Action</span>
                              <p className="text-slate-700">{opt.suggestedAction}</p>
                              <span className="text-[10px] text-slate-400 block pt-1">
                                Monitor: {opt.metricToMonitor} • Review Period: {opt.suggestedReviewPeriod}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    No Actual Performance Logged Yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Log completed flight numbers to calculate CPC, CPA, and ROAS and trigger automated health optimizations.
                  </p>
                  {selectedCampaign && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setPerfCampaignTarget(selectedCampaign);
                        setIsPerfModalOpen(true);
                      }}
                      className="gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Log Flight Data</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6-STEP CAMPAIGN CREATION WIZARD MODAL */}
        {/* ========================================================================= */}
        {isWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
              {/* Wizard Header & Progress */}
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-sparkline-blue uppercase tracking-wider block">
                    Step {wizardStep} of 6
                  </span>
                  <h2 className="text-xl font-bold text-sparkline-midnight">
                    {wizardStep === 1 && 'Step 1: Campaign Basics & Objective'}
                    {wizardStep === 2 && 'Step 2: Advertising Platforms Selection'}
                    {wizardStep === 3 && 'Step 3: Audience Targeting & Personas'}
                    {wizardStep === 4 && 'Step 4: Budget & Flight Schedule'}
                    {wizardStep === 5 && 'Step 5: Ad Creative & Messaging'}
                    {wizardStep === 6 && 'Step 6: Review & Finalize'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-2 text-base"
                >
                  ✕
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sparkline-blue h-full transition-all duration-300"
                  style={{ width: `${(wizardStep / 6) * 100}%` }}
                />
              </div>

              {/* STEP 1: CAMPAIGN BASICS */}
              {wizardStep === 1 && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Campaign Name</label>
                    <input
                      type="text"
                      value={wizardCampaign.name}
                      onChange={(e) =>
                        setWizardCampaign((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-sparkline-midnight focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Product / Offering
                      </label>
                      <input
                        type="text"
                        value={wizardCampaign.productService}
                        onChange={(e) =>
                          setWizardCampaign((prev) => ({
                            ...prev,
                            productService: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Industry</label>
                      <input
                        type="text"
                        value={wizardCampaign.industry}
                        onChange={(e) =>
                          setWizardCampaign((prev) => ({ ...prev, industry: e.target.value }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Campaign Objective</label>
                    <select
                      value={wizardCampaign.objective}
                      onChange={(e) =>
                        setWizardCampaign((prev) => ({
                          ...prev,
                          objective: e.target.value as CampaignObjective,
                        }))
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none"
                    >
                      {OBJECTIVES.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Campaign Description & Rationale
                    </label>
                    <textarea
                      rows={3}
                      value={wizardCampaign.description}
                      onChange={(e) =>
                        setWizardCampaign((prev) => ({ ...prev, description: e.target.value }))
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: PLATFORMS */}
              {wizardStep === 2 && (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-600">
                    Select the advertising channels you will use. Each platform supports specialized formats and bidding dynamics:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PLATFORMS.map((p) => {
                      const isSelected = wizardCampaign.platforms.includes(p);
                      return (
                        <div
                          key={p}
                          onClick={() => {
                            const next = isSelected
                              ? wizardCampaign.platforms.filter((x) => x !== p)
                              : [...wizardCampaign.platforms, p];
                            setWizardCampaign((prev) => ({
                              ...prev,
                              platforms: next.length > 0 ? next : [p],
                            }));
                          }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                            isSelected
                              ? 'bg-blue-50/50 border-sparkline-blue shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-sparkline-midnight block">{p}</span>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">
                              {p === 'Meta Ads' && 'Feed, Stories, Reels (CBO / Advantage+)'}
                              {p === 'Google Ads' && 'High-Intent Search, PMax & Shopping'}
                              {p === 'TikTok Ads' && 'In-Feed Video, Spark Ads & TopView'}
                              {p === 'LinkedIn Ads' && 'Sponsored Content, InMail & Lead Gen'}
                              {p === 'YouTube Ads' && 'In-Stream Skippable & 6s Bumpers'}
                              {p === 'Pinterest Ads' && 'Standard Pins & Shopping Collections'}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="rounded text-sparkline-blue focus:ring-sparkline-blue"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
                    <strong>Notice:</strong> Sparkline Campaign Studio operates in strategic planning and export mode. Campaigns are not published directly to platform ad managers until verified API credentials are connected.
                  </div>
                </div>
              )}

              {/* STEP 3: AUDIENCE TARGETING */}
              {wizardStep === 3 && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Target Locations</label>
                      <input
                        type="text"
                        value={wizardCampaign.audience.targetLocation}
                        onChange={(e) =>
                          setWizardCampaign((prev) => ({
                            ...prev,
                            audience: { ...prev.audience, targetLocation: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Age Range</label>
                      <input
                        type="text"
                        value={wizardCampaign.audience.ageRange}
                        onChange={(e) =>
                          setWizardCampaign((prev) => ({
                            ...prev,
                            audience: { ...prev.audience, ageRange: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Audience Needs & Friction Points
                    </label>
                    <textarea
                      rows={2}
                      value={wizardCampaign.audience.audienceNeeds}
                      onChange={(e) =>
                        setWizardCampaign((prev) => ({
                          ...prev,
                          audience: { ...prev.audience, audienceNeeds: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Custom Audience Notes</label>
                    <textarea
                      rows={2}
                      value={wizardCampaign.audience.customAudienceNotes}
                      onChange={(e) =>
                        setWizardCampaign((prev) => ({
                          ...prev,
                          audience: { ...prev.audience, customAudienceNotes: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: BUDGET & SCHEDULE */}
              {wizardStep === 4 && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-sparkline-blue mb-1">
                        Total Campaign Budget
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={wizardCampaign.budget.totalBudget}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value) || 0);
                          setWizardCampaign((prev) => ({
                            ...prev,
                            budget: {
                              ...prev.budget,
                              totalBudget: val,
                              adSpend: Math.round(val * 0.75),
                            },
                          }));
                        }}
                        className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-xl font-mono font-bold text-sm text-sparkline-blue focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Direct Media Ad Spend
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={wizardCampaign.budget.adSpend}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value) || 0);
                          setWizardCampaign((prev) => ({
                            ...prev,
                            budget: { ...prev.budget, adSpend: val },
                          }));
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Currency</label>
                      <select
                        value={wizardCampaign.budget.currency}
                        onChange={(e) =>
                          setWizardCampaign((prev) => ({
                            ...prev,
                            budget: { ...prev.budget, currency: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={wizardCampaign.schedule.startDate}
                        onChange={(e) =>
                          setWizardCampaign((prev) => ({
                            ...prev,
                            schedule: { ...prev.schedule, startDate: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={wizardCampaign.schedule.endDate}
                        onChange={(e) =>
                          setWizardCampaign((prev) => ({
                            ...prev,
                            schedule: { ...prev.schedule, endDate: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: CREATIVE & MESSAGING */}
              {wizardStep === 5 && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Creative Format</label>
                    <select
                      value={wizardCampaign.structure.adGroups[0]?.ads[0]?.format || 'Single Image'}
                      onChange={(e) => {
                        const val = e.target.value as CreativeFormat;
                        setWizardCampaign((prev) => {
                          const copy = { ...prev };
                          if (copy.structure.adGroups[0]?.ads[0]) {
                            copy.structure.adGroups[0].ads[0].format = val;
                          }
                          return copy;
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                    >
                      {FORMATS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Ad Headline</label>
                    <input
                      type="text"
                      value={wizardCampaign.structure.adGroups[0]?.ads[0]?.headline || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setWizardCampaign((prev) => {
                          const copy = { ...prev };
                          if (copy.structure.adGroups[0]?.ads[0]) {
                            copy.structure.adGroups[0].ads[0].headline = val;
                          }
                          return copy;
                        });
                      }}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Primary Ad Text</label>
                    <textarea
                      rows={3}
                      value={wizardCampaign.structure.adGroups[0]?.ads[0]?.primaryText || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setWizardCampaign((prev) => {
                          const copy = { ...prev };
                          if (copy.structure.adGroups[0]?.ads[0]) {
                            copy.structure.adGroups[0].ads[0].primaryText = val;
                          }
                          return copy;
                        });
                      }}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Call-To-Action (CTA)
                      </label>
                      <input
                        type="text"
                        value={wizardCampaign.structure.adGroups[0]?.ads[0]?.callToAction || 'Shop Now'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWizardCampaign((prev) => {
                            const copy = { ...prev };
                            if (copy.structure.adGroups[0]?.ads[0]) {
                              copy.structure.adGroups[0].ads[0].callToAction = val;
                            }
                            return copy;
                          });
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Landing Page URL</label>
                      <input
                        type="url"
                        value={wizardCampaign.structure.adGroups[0]?.ads[0]?.destinationUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWizardCampaign((prev) => {
                            const copy = { ...prev };
                            if (copy.structure.adGroups[0]?.ads[0]) {
                              copy.structure.adGroups[0].ads[0].destinationUrl = val;
                            }
                            return copy;
                          });
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: REVIEW & SAVE */}
              {wizardStep === 6 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-sparkline-midnight block text-sm">
                      Campaign Summary & Validation Check
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div>
                        <strong>Name:</strong> {wizardCampaign.name}
                      </div>
                      <div>
                        <strong>Objective:</strong> {wizardCampaign.objective}
                      </div>
                      <div>
                        <strong>Platforms:</strong> {wizardCampaign.platforms.join(', ')}
                      </div>
                      <div>
                        <strong>Total Budget:</strong> {wizardCampaign.budget.currency}{' '}
                        {wizardCampaign.budget.totalBudget.toLocaleString()}
                      </div>
                      <div>
                        <strong>Duration:</strong> {wizardCampaign.schedule.durationDays} Days
                      </div>
                      <div>
                        <strong>Location:</strong> {wizardCampaign.audience.targetLocation}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-sparkline-midnight">
                    Ready to save! Your campaign will be persisted and accessible across the Calendar, Creative Brief, and Tracking tabs.
                  </div>
                </div>
              )}

              {/* Wizard Footer Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {wizardStep > 1 ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setWizardStep(wizardStep - 1)}
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {wizardStep < 6 ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setWizardStep(wizardStep + 1)}
                    className="gap-1"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveWizardCampaign}
                    className="gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save & Deploy Plan</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LOG PERFORMANCE DATA MODAL */}
        {/* ========================================================================= */}
        {isPerfModalOpen && perfCampaignTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Log Actual Campaign Performance
                  </h3>
                  <span className="text-xs text-slate-400">
                    {perfCampaignTarget.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPerfModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Impressions</label>
                  <input
                    type="number"
                    min="0"
                    value={perfForm.impressions || 0}
                    onChange={(e) =>
                      setPerfForm((prev) => ({
                        ...prev,
                        impressions: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Unique Reach</label>
                  <input
                    type="number"
                    min="0"
                    value={perfForm.reach || 0}
                    onChange={(e) =>
                      setPerfForm((prev) => ({
                        ...prev,
                        reach: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Clicks</label>
                  <input
                    type="number"
                    min="0"
                    value={perfForm.clicks || 0}
                    onChange={(e) =>
                      setPerfForm((prev) => ({
                        ...prev,
                        clicks: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Actual Spend (${perfCampaignTarget.budget.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={perfForm.spend || 0}
                    onChange={(e) =>
                      setPerfForm((prev) => ({
                        ...prev,
                        spend: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Conversions / Sales</label>
                  <input
                    type="number"
                    min="0"
                    value={perfForm.conversions || 0}
                    onChange={(e) =>
                      setPerfForm((prev) => ({
                        ...prev,
                        conversions: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Attributed Revenue (${perfCampaignTarget.budget.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={perfForm.revenue || 0}
                    onChange={(e) =>
                      setPerfForm((prev) => ({
                        ...prev,
                        revenue: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPerfModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSavePerformance}
                  className="gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Compute & Save Metrics</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
