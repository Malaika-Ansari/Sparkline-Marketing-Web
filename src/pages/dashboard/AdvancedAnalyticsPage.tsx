/**
 * Advanced Analytics & Performance Intelligence Workspace
 * Sparkline Marketing Platform — Phase 23
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  RefreshCw,
  FileText,
  Boxes,
  DollarSign,
  Target,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Layers,
  Percent,
  ShieldAlert,
} from 'lucide-react';
import { projectService } from '@/services/project.service';
import { AnalyticsService } from '@/services/analytics.service';
import { currencyService } from '@/services/currency.service';
import { campaignService } from '@/services/campaign.service';
import {
  AnalyticsDateFilter,
  DateRangePreset,
  ComparePeriodOption,
  AnalyticsKPISummary,
  MarketingFunnel,
  AnalyticsInsight,
  DataProvenanceSource,
} from '@/types/analytics';
import { MarketingProject } from '@/types/project';
import {
  SparklineAreaChart,
  SparklineLineChart,
  SparklineBarChart,
  SparklineDonutChart,
  chartColors,
} from '@/components/charts/SparklineCharts';

export const AdvancedAnalyticsPage: React.FC = () => {
  // Project state
  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [activeProject, setActiveProject] = useState<MarketingProject | null>(null);

  // Filters state
  const [datePreset, setDatePreset] = useState<DateRangePreset>('30d');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [comparePeriod, setComparePeriod] = useState<ComparePeriodOption>('previous-period');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [targetCurrency, setTargetCurrency] = useState<string>('USD');

  // Active view tab
  const [activeTab, setActiveTab] = useState<'trends' | 'platforms' | 'funnel' | 'matrix'>('trends');

  // Loading & export states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Load Projects on mount
  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);
    if (list.length > 0) {
      setActiveProjectId(list[0]?.id || '');
    }
  }, []);

  // Update active project instance & default currency
  useEffect(() => {
    if (!activeProjectId) return;
    const proj = projectService.getProjectById(activeProjectId);
    setActiveProject(proj || null);
    if (proj?.products?.[0]?.currency) {
      setTargetCurrency(proj.products[0].currency);
    }
  }, [activeProjectId]);

  // Construct current date filter
  const dateFilter: AnalyticsDateFilter = useMemo(
    () => ({
      preset: datePreset,
      startDate: customStart,
      endDate: customEnd,
      comparePeriod,
    }),
    [datePreset, customStart, customEnd, comparePeriod]
  );

  // Query performance data
  const { currentData, previousData, isDemoData } = useMemo(() => {
    if (!activeProjectId) {
      return { currentData: [], previousData: [], isDemoData: false };
    }
    const res = AnalyticsService.getAnalyticsDataPoints(
      activeProjectId,
      dateFilter,
      channelFilter,
      campaignFilter,
      targetCurrency
    );
    return {
      currentData: res.current,
      previousData: res.previous,
      isDemoData: res.isDemoData,
    };
  }, [activeProjectId, dateFilter, channelFilter, campaignFilter, targetCurrency]);

  // Available campaigns for active project filter dropdown
  const availableCampaigns = useMemo(() => {
    if (!activeProjectId) return [];
    return campaignService.getCampaigns().filter((c: any) => !c.projectId || c.projectId === activeProjectId);
  }, [activeProjectId]);

  // Derived KPIs
  const kpis: AnalyticsKPISummary = useMemo(() => {
    const provenance: DataProvenanceSource = isDemoData ? 'estimate' : 'calculated';
    return AnalyticsService.getKPISummary(currentData, previousData, provenance);
  }, [currentData, previousData, isDemoData]);

  // Conversion Funnel
  const funnel: MarketingFunnel = useMemo(() => {
    return AnalyticsService.getFunnelData(currentData);
  }, [currentData]);

  // Platform & Campaign Comparisons
  const { byPlatform, byCampaign } = useMemo(() => {
    return AnalyticsService.getPerformanceComparisons(currentData);
  }, [currentData]);

  // Currency symbol
  const currSymbol = currencyService.getCurrencyMetadata(targetCurrency as any).symbol;

  // AI-Assisted Analytics Insights
  const insights: AnalyticsInsight[] = useMemo(() => {
    return AnalyticsService.getAIAnalyticsInsights(kpis, funnel, byPlatform, currSymbol);
  }, [kpis, funnel, byPlatform, currSymbol]);

  // Handle Manual Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((res) => setTimeout(res, 600));
    setIsRefreshing(false);
  };

  // Handle CSV Export
  const handleExportCSV = () => {
    const projectName = activeProject?.business?.brandName || 'Project';
    const csvContent = AnalyticsService.exportAnalyticsToCSV(projectName, currentData, targetCurrency);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${projectName.toLowerCase().replace(/\s+/g, '_')}_analytics_${datePreset}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Performance CSV exported successfully!');
    setTimeout(() => setExportNotice(null), 3500);
  };

  // Prepare Chart Time Series Data
  const timeSeriesData = useMemo(() => {
    const map = new Map<string, { date: string; spend: number; revenue: number; clicks: number; impressions: number; conversions: number }>();
    for (const p of currentData) {
      const existing = map.get(p.date) || {
        date: p.date.slice(5), // MM-DD
        spend: 0,
        revenue: 0,
        clicks: 0,
        impressions: 0,
        conversions: 0,
      };
      existing.spend += p.spend;
      existing.revenue += p.revenue;
      existing.clicks += p.clicks;
      existing.impressions += p.impressions;
      existing.conversions += p.conversions;
      map.set(p.date, existing);
    }
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [currentData]);

  // Platform Distribution Donut Data
  const platformDonutData = useMemo(() => {
    const colors: string[] = [chartColors.blue, chartColors.purple, chartColors.magenta, chartColors.cyan, chartColors.orange, chartColors.emerald];
    return byPlatform.map((p, idx) => ({
      name: p.name,
      value: p.spend,
      color: colors[idx % colors.length] || chartColors.blue,
    }));
  }, [byPlatform]);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-sparkline-midnight text-white px-4 py-3 rounded-xl shadow-premium border border-emerald-500/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{exportNotice}</span>
        </div>
      )}

      {/* Top Header & Context Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-sparkline-midnight">
              Marketing Analytics & Multi-Channel Intelligence
            </h1>
            {isDemoData ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                Demonstration Baseline Data
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Verified Ingested Data
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time performance metrics, 7-stage conversion funnels, and AI insights across advertising campaigns, organic search, and social media.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Updating...' : 'Sync'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/dashboard/reports"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sparkline-blue hover:bg-sparkline-blue-hover rounded-lg transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Executive Report</span>
          </Link>

          <Link
            to="/dashboard/integrations"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Boxes className="w-3.5 h-3.5 text-slate-500" />
            <span>Connect Sources</span>
          </Link>
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Project Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Project
          </label>
          <select
            value={activeProjectId}
            onChange={(e) => setActiveProjectId(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-sparkline-blue focus:bg-white"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.business?.brandName || p.id}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Preset */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Date Range
          </label>
          <select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value as DateRangePreset)}
            className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-sparkline-blue focus:bg-white"
          >
            <option value="7d">Last 7 Days</option>
            <option value="14d">Last 14 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="ytd">Year to Date</option>
            <option value="all">All Available</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Compare Period */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Compare With
          </label>
          <select
            value={comparePeriod}
            onChange={(e) => setComparePeriod(e.target.value as ComparePeriodOption)}
            className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-sparkline-blue focus:bg-white"
          >
            <option value="previous-period">Previous Period</option>
            <option value="previous-year">Previous Year</option>
            <option value="none">No Comparison</option>
          </select>
        </div>

        {/* Channel Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Channel
          </label>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-sparkline-blue focus:bg-white"
          >
            <option value="all">All Channels</option>
            <option value="search">Paid Search (Google)</option>
            <option value="social">Paid Social (Meta/TikTok/LinkedIn)</option>
            <option value="organic_search">Organic Search (SEO)</option>
            <option value="social_media">Social Media</option>
          </select>
        </div>

        {/* Campaign Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Campaign
          </label>
          <select
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-sparkline-blue focus:bg-white"
          >
            <option value="all">All Campaigns</option>
            {availableCampaigns.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Currency Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Display Currency
          </label>
          <select
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-sparkline-blue focus:bg-white"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD ($)</option>
            <option value="AUD">AUD ($)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
      </div>

      {/* Custom Date Range Pickers (if 'custom' selected) */}
      {datePreset === 'custom' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-4 text-xs font-medium text-slate-700">
          <div className="flex items-center gap-2">
            <span>Start Date:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>End Date:</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1"
            />
          </div>
        </div>
      )}

      {/* 4 Primary Highlight KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Ad Spend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Ad Spend</span>
            <span className="p-2 bg-blue-50 text-sparkline-blue rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold font-display text-sparkline-midnight">
              {currSymbol}
              {kpis.totalSpend.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {comparePeriod !== 'none' && kpis.totalSpend.changePct !== undefined && (
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                {kpis.totalSpend.changePct >= 0 ? (
                  <span className="flex items-center text-slate-600 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5 text-blue-500" />
                    +{kpis.totalSpend.changePct}%
                  </span>
                ) : (
                  <span className="flex items-center text-slate-600 font-semibold">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5 text-emerald-500" />
                    {kpis.totalSpend.changePct}%
                  </span>
                )}
                <span className="text-slate-400">vs {comparePeriod === 'previous-year' ? 'prior year' : 'prior period'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Realized Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Attributed Revenue</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold font-display text-sparkline-midnight">
              {currSymbol}
              {kpis.revenue.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {comparePeriod !== 'none' && kpis.revenue.changePct !== undefined && (
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                {kpis.revenue.changePct >= 0 ? (
                  <span className="flex items-center text-emerald-600 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                    +{kpis.revenue.changePct}%
                  </span>
                ) : (
                  <span className="flex items-center text-rose-600 font-semibold">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                    {kpis.revenue.changePct}%
                  </span>
                )}
                <span className="text-slate-400">vs {comparePeriod === 'previous-year' ? 'prior year' : 'prior period'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Blended ROAS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Blended ROAS</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold font-display text-sparkline-midnight">
              {kpis.roas.value.toFixed(2)}x
            </div>
            {comparePeriod !== 'none' && kpis.roas.changePct !== undefined && (
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                {kpis.roas.changePct >= 0 ? (
                  <span className="flex items-center text-emerald-600 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                    +{kpis.roas.changePct}%
                  </span>
                ) : (
                  <span className="flex items-center text-rose-600 font-semibold">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                    {kpis.roas.changePct}%
                  </span>
                )}
                <span className="text-slate-400">vs prior period</span>
              </div>
            )}
          </div>
        </div>

        {/* Orders / Conversions */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Conversions / Orders</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold font-display text-sparkline-midnight">
              {kpis.conversions.value.toLocaleString()}
            </div>
            {comparePeriod !== 'none' && kpis.conversions.changePct !== undefined && (
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                {kpis.conversions.changePct >= 0 ? (
                  <span className="flex items-center text-emerald-600 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                    +{kpis.conversions.changePct}%
                  </span>
                ) : (
                  <span className="flex items-center text-rose-600 font-semibold">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                    {kpis.conversions.changePct}%
                  </span>
                )}
                <span className="text-slate-400">vs prior period</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 11 Secondary Detailed KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Impressions */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Impressions</div>
          <div className="text-lg font-bold text-sparkline-midnight mt-1">
            {kpis.totalImpressions.value.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Total views served</div>
        </div>

        {/* Total Reach */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Total Reach</div>
          <div className="text-lg font-bold text-sparkline-midnight mt-1">
            {kpis.totalReach.value.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Unique individuals</div>
        </div>

        {/* Total Clicks */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Total Clicks</div>
          <div className="text-lg font-bold text-sparkline-midnight mt-1">
            {kpis.totalClicks.value.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Outbound interactions</div>
        </div>

        {/* Click-Through Rate (CTR) */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">CTR (%)</div>
          <div className="text-lg font-bold text-sparkline-midnight mt-1">
            {kpis.ctr.value.toFixed(2)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Clicks / Impressions</div>
        </div>

        {/* Cost Per Click (CPC) */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Average CPC</div>
          <div className="text-lg font-bold text-sparkline-midnight mt-1">
            {currSymbol}{kpis.cpc.value.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Spend / Clicks</div>
        </div>

        {/* Cost Per Mille (CPM) */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Average CPM</div>
          <div className="text-lg font-bold text-sparkline-midnight mt-1">
            {currSymbol}{kpis.cpm.value.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Cost per 1k views</div>
        </div>

        {/* Inbound Leads */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Inbound Leads</div>
          <div className="text-lg font-bold text-sparkline-midnight mt-1">
            {kpis.leads.value.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Form captures & opt-ins</div>
        </div>

        {/* Conversion Rate (CVR) */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Conv. Rate (%)</div>
          <div className="text-lg font-bold text-sparkline-midnight mt-1">
            {kpis.conversionRate.value.toFixed(2)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Orders / Clicks</div>
        </div>

        {/* Cost Per Acquisition (CPA) */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Average CPA</div>
          <div className="text-lg font-bold text-sparkline-midnight mt-1">
            {currSymbol}{kpis.cpa.value.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Spend / Conversions</div>
        </div>

        {/* Return On Investment (ROI) */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Net Ad ROI</div>
          <div className={`text-lg font-bold mt-1 ${kpis.roi.value >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {kpis.roi.value >= 0 ? `+${kpis.roi.value.toFixed(1)}%` : `${kpis.roi.value.toFixed(1)}%`}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">(Rev - Spend) / Spend</div>
        </div>

        {/* CAC (Customer Acquisition Cost) */}
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Blended CAC</span>
            <span title="Unavailable: requires non-advertising sales overhead">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            </span>
          </div>
          <div className="text-sm font-semibold text-slate-500 mt-1">
            Unavailable
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Needs blended overhead</div>
        </div>
      </div>

      {/* Visualizations & Exploration Suite */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 pt-3 bg-slate-50/50 overflow-x-auto gap-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('trends')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'trends'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Spend, Revenue & Efficiency Trends</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('platforms')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'platforms'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Platform & Channel Distribution</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('funnel')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'funnel'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>7-Stage Conversion Funnel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Performance Comparison Matrix</span>
          </button>
        </div>

        {/* Tab 1: Trends & Cost Curves */}
        {activeTab === 'trends' && (
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spend vs Revenue Area Chart */}
              <div className="border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-sparkline-midnight">Daily Spend & Attributed Revenue</h3>
                    <p className="text-xs text-slate-400">Comparing realized media investment against conversion value</p>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {currSymbol} Normalized
                  </span>
                </div>
                <div className="h-64">
                  <SparklineAreaChart
                    data={timeSeriesData}
                    xKey="date"
                    series={[
                      { dataKey: 'revenue', name: `Revenue (${currSymbol})`, color: chartColors.emerald },
                      { dataKey: 'spend', name: `Spend (${currSymbol})`, color: chartColors.blue },
                    ]}
                    yTickFormatter={(val) => `${currSymbol}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                </div>
              </div>

              {/* Impressions & Clicks Volume Trend */}
              <div className="border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-sparkline-midnight">Audience Clicks & Impressions</h3>
                    <p className="text-xs text-slate-400">Traffic velocity across all connected acquisition channels</p>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Daily Volume
                  </span>
                </div>
                <div className="h-64">
                  <SparklineAreaChart
                    data={timeSeriesData}
                    xKey="date"
                    series={[
                      { dataKey: 'impressions', name: 'Impressions', color: chartColors.purple },
                      { dataKey: 'clicks', name: 'Clicks', color: chartColors.cyan },
                    ]}
                    yTickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`)}
                  />
                </div>
              </div>
            </div>

            {/* Cost Efficiency Evolution: CPC & CPM */}
            <div className="border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-sparkline-midnight">Cost Efficiency Evolution (CPC & CPM)</h3>
                  <p className="text-xs text-slate-400">Monitoring bidding volatility and audience pricing changes</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Average CPC: {currSymbol}{kpis.cpc.value.toFixed(2)}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Average CPM: {currSymbol}{kpis.cpm.value.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="h-64">
                <SparklineLineChart
                  data={timeSeriesData.map((d) => ({
                    ...d,
                    cpc: d.clicks > 0 ? parseFloat((d.spend / d.clicks).toFixed(2)) : 0,
                    cpm: d.impressions > 0 ? parseFloat(((d.spend / d.impressions) * 1000).toFixed(2)) : 0,
                  }))}
                  xKey="date"
                  series={[
                    { dataKey: 'cpc', name: `CPC (${currSymbol})`, color: chartColors.blue },
                    { dataKey: 'cpm', name: `CPM (${currSymbol})`, color: chartColors.purple },
                  ]}
                  yTickFormatter={(val) => `${currSymbol}${val}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Platforms & Distribution */}
        {activeTab === 'platforms' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Donut Chart: Spend Share */}
              <div className="border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-sparkline-midnight">Media Spend by Platform</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Capital distribution across active advertising networks</p>
                </div>
                <div className="h-64 my-2">
                  <SparklineDonutChart
                    data={platformDonutData}
                    centerLabel="Total Spend"
                    centerValue={`${currSymbol}${Math.round(kpis.totalSpend.value).toLocaleString()}`}
                  />
                </div>
                <div className="text-[11px] text-slate-400 text-center">
                  Values normalized to {targetCurrency} using live rates
                </div>
              </div>

              {/* Campaign Performance Bar Chart */}
              <div className="lg:col-span-2 border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-sparkline-midnight">Spend vs. Revenue by Platform</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Direct comparative return across all media channels</p>
                </div>
                <div className="h-64 my-2">
                  <SparklineBarChart
                    data={byPlatform.map((p) => ({
                      name: p.name.replace(' Ads', ''),
                      spend: p.spend,
                      revenue: p.revenue,
                    }))}
                    xKey="name"
                    series={[
                      { dataKey: 'spend', name: `Spend (${currSymbol})`, color: chartColors.blue },
                      { dataKey: 'revenue', name: `Revenue (${currSymbol})`, color: chartColors.emerald },
                    ]}
                    yTickFormatter={(val) => `${currSymbol}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Top Performing Channel: {byPlatform[0]?.name || 'None'}</span>
                  <span>Highest ROAS: {byPlatform.reduce((max, p) => (p.roas > max ? p.roas : max), 0).toFixed(2)}x</span>
                </div>
              </div>
            </div>

            {/* Campaign Breakdown Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Campaign Return & Efficiency Breakdown
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Campaign Name</th>
                      <th className="py-2.5 px-4">Spend ({currSymbol})</th>
                      <th className="py-2.5 px-4">Clicks</th>
                      <th className="py-2.5 px-4">CTR</th>
                      <th className="py-2.5 px-4">CPC</th>
                      <th className="py-2.5 px-4">Orders</th>
                      <th className="py-2.5 px-4">CPA</th>
                      <th className="py-2.5 px-4">Revenue ({currSymbol})</th>
                      <th className="py-2.5 px-4">ROAS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {byCampaign.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-sparkline-midnight">{c.name}</td>
                        <td className="py-3 px-4 font-mono font-medium">{currSymbol}{c.spend.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4 font-mono">{c.clicks.toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono">{c.ctr.toFixed(2)}%</td>
                        <td className="py-3 px-4 font-mono">{currSymbol}{c.cpc.toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{c.conversions.toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono">{currSymbol}{c.cpa.toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">{currSymbol}{c.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4 font-mono">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                            c.roas >= 2.5 ? 'bg-emerald-50 text-emerald-700' : c.roas >= 1.5 ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {c.roas.toFixed(2)}x
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 7-Stage Conversion Funnel */}
        {activeTab === 'funnel' && (
          <div className="p-6 space-y-6">
            <div className="border border-slate-200 rounded-xl p-5 bg-gradient-to-r from-slate-50 via-white to-blue-50/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-sparkline-midnight">Complete 7-Stage Marketing Conversion Funnel</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Traces user journey from top-of-funnel impressions down to realized transaction value.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-medium">Funnel Completion Rate</div>
                    <div className="text-lg font-bold font-mono text-sparkline-midnight">
                      {funnel.overallConversionRate}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Funnel Stack */}
            <div className="space-y-3">
              {funnel.stages.map((stage, idx) => (
                <div
                  key={stage.id}
                  className={`border rounded-xl p-4 transition-all shadow-sm ${
                    stage.isBottleneck
                      ? 'border-rose-300 bg-rose-50/40'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-sparkline-midnight text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-sparkline-midnight">{stage.name}</span>
                          {stage.isEstimated && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                              Estimated Benchmark
                            </span>
                          )}
                          {stage.isBottleneck && (
                            <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3 text-rose-600" /> Primary Bottleneck
                            </span>
                          )}
                        </div>
                        {stage.notes && <div className="text-[11px] text-slate-400 mt-0.5">{stage.notes}</div>}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-auto">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Total Count</div>
                        <div className="text-sm font-bold font-mono text-sparkline-midnight">
                          {stage.count.toLocaleString()}
                          {stage.value !== undefined && (
                            <span className="text-emerald-600 ml-1.5">
                              ({currSymbol}{stage.value.toLocaleString()})
                            </span>
                          )}
                        </div>
                      </div>

                      {idx > 0 && (
                        <div className="text-right min-w-[90px]">
                          <div className="text-xs text-slate-400">Progression</div>
                          <div className="text-sm font-bold font-mono text-emerald-600">
                            {stage.conversionRateFromPrevious}%
                          </div>
                        </div>
                      )}

                      {idx > 0 && (
                        <div className="text-right min-w-[80px]">
                          <div className="text-xs text-slate-400">Drop-off</div>
                          <div className={`text-sm font-bold font-mono ${stage.dropOffRate > 70 ? 'text-rose-600' : 'text-slate-600'}`}>
                            {stage.dropOffRate}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Relative Width Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stage.isBottleneck ? 'bg-rose-500' : 'bg-sparkline-blue'
                      }`}
                      style={{
                        width: `${Math.max(4, Math.min(100, (stage.count / (funnel.stages[0]?.count || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Performance Comparison Matrix */}
        {activeTab === 'matrix' && (
          <div className="p-6 space-y-6">
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Cross-Platform Normalized Comparison
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    All metrics standardized into {targetCurrency}. Comparing paid search, paid social, and organic search.
                  </p>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  Rates updated today
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Platform</th>
                      <th className="py-2.5 px-4">Spend ({currSymbol})</th>
                      <th className="py-2.5 px-4">Impressions</th>
                      <th className="py-2.5 px-4">Clicks</th>
                      <th className="py-2.5 px-4">CTR</th>
                      <th className="py-2.5 px-4">CPC</th>
                      <th className="py-2.5 px-4">Conversions</th>
                      <th className="py-2.5 px-4">CPA</th>
                      <th className="py-2.5 px-4">Revenue</th>
                      <th className="py-2.5 px-4">ROAS</th>
                      <th className="py-2.5 px-4">Attribution Window</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {byPlatform.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-sparkline-midnight">{p.name}</td>
                        <td className="py-3 px-4 font-mono font-medium">{currSymbol}{p.spend.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4 font-mono">{p.impressions.toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono">{p.clicks.toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono">{p.ctr.toFixed(2)}%</td>
                        <td className="py-3 px-4 font-mono">{currSymbol}{p.cpc.toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.conversions.toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono">{currSymbol}{p.cpa.toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">{currSymbol}{p.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4 font-mono">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                            p.roas >= 2.5 ? 'bg-emerald-50 text-emerald-700' : p.roas >= 1.5 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {p.roas.toFixed(2)}x
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{p.attributionNote}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attribution Transparency Notice */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-700">Measurement & Attribution Disclaimer: </span>
                Advertising platforms utilize distinct native attribution models (Meta uses 7-day click/1-day view; Google Ads uses data-driven attribution; GA4 uses last non-direct click). Sparkline normalizes reporting currencies and comparative ratios without falsely claiming one channel is superior based on incomparable attribution windows.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI-Assisted Analytics Insights & Strategic Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-sparkline-blue/10 text-sparkline-blue rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold font-display text-sparkline-midnight">
              AI-Assisted Strategic Analytics Insights & Next Actions
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Backed by mathematical evidence and verified project data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((ins) => {
            const badgeStyles = {
              'measured-observation': 'bg-emerald-50 text-emerald-700 border-emerald-200',
              'calculated-finding': 'bg-blue-50 text-blue-700 border-blue-200',
              'ai-interpretation': 'bg-purple-50 text-purple-700 border-purple-200',
              recommendation: 'bg-amber-50 text-amber-700 border-amber-200',
              hypothesis: 'bg-slate-100 text-slate-700 border-slate-200',
            }[ins.classification];

            const typeIcon = {
              'positive-trend': <TrendingUp className="w-4 h-4 text-emerald-500" />,
              'negative-trend': <TrendingDown className="w-4 h-4 text-rose-500" />,
              problem: <AlertCircle className="w-4 h-4 text-rose-500" />,
              'budget-efficiency': <DollarSign className="w-4 h-4 text-purple-500" />,
              opportunity: <Target className="w-4 h-4 text-blue-500" />,
              experiment: <Sparkles className="w-4 h-4 text-amber-500" />,
              'next-action': <ArrowRight className="w-4 h-4 text-sparkline-blue" />,
            }[ins.type];

            return (
              <div
                key={ins.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="flex items-center gap-1.5">{typeIcon}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badgeStyles}`}>
                      {ins.classification.replace('-', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-sparkline-midnight mb-1.5">{ins.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{ins.description}</p>

                  <div className="bg-slate-50 rounded-lg p-2.5 mt-3 text-[11px] text-slate-500 border border-slate-100">
                    <div className="font-semibold text-slate-700 mb-0.5">Supporting Evidence:</div>
                    <div className="leading-snug">{ins.evidence}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Recommended Action:
                  </div>
                  <p className="text-xs font-semibold text-sparkline-blue leading-snug">
                    {ins.action}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
