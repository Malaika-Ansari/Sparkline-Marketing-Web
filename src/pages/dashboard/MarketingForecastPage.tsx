/**
 * Marketing Results Predictor, ROI & ROAS Forecasting Command Center
 * Sparkline Marketing Intelligence Platform — Phase 15
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { SEO } from '@/components/common/SEO';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/components/common/Feedback';
import { projectService } from '@/services/project.service';
import { budgetService } from '@/services/budget.service';
import { metricsService } from '@/services/metrics.service';
import { forecastService } from '@/services/forecast.service';
import {
  Forecast,
  ForecastInput,
  ForecastSource,
  ForecastObjective,
  ForecastPlatform,
} from '@/types/forecast';
import { MarketingProject } from '@/types/project';
import {
  TrendingUp,
  BarChart3,
  Calculator,
  Brain,
  Target,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Info,
  Calendar,
  Download,
  Copy,
  Check,
  ShieldAlert,
  Layers,
  Sparkles,
  Sliders,
  ChevronDown,
  Trash2,
  Clock,
  Printer,
  Scale,
} from 'lucide-react';

const OBJECTIVES: { id: ForecastObjective; label: string }[] = [
  { id: 'ecommerce_sales', label: 'E-commerce & Direct Sales' },
  { id: 'lead_generation', label: 'B2B Lead Generation & Consultations' },
  { id: 'customer_acquisition', label: 'Subscription & SaaS Acquisition' },
  { id: 'brand_awareness', label: 'Brand Reach & Category Awareness' },
  { id: 'app_installs', label: 'Mobile App Installs & Signups' },
  { id: 'other', label: 'Custom Strategic Objective' },
];

const PLATFORMS: { id: ForecastPlatform; label: string }[] = [
  { id: 'meta_ads', label: 'Meta Ads (Facebook & Instagram Feed/Reels)' },
  { id: 'google_search', label: 'Google Search Ads (High-Intent Keyword PPC)' },
  { id: 'google_pmax', label: 'Google Performance Max (Multi-Surface)' },
  { id: 'linkedin_ads', label: 'LinkedIn Ads (B2B Sponsored Content & InMail)' },
  { id: 'tiktok_ads', label: 'TikTok Ads (In-Feed Short Video Auctions)' },
  { id: 'youtube_ads', label: 'YouTube Video Action & In-Stream' },
  { id: 'multi_channel', label: 'Integrated Multi-Channel Paid Campaign' },
  { id: 'email', label: 'Email Marketing & Retention Sequences' },
  { id: 'other', label: 'Other Ad Platform / Custom Channel' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export const MarketingForecastPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  // Projects & Navigation Context
  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Primary Workspace Tabs
  const [activeTab, setActiveTab] = useState<
    'scenarios' | 'breakEven' | 'sensitivity' | 'quality' | 'history'
  >('scenarios');

  // Visualization Mode
  const [chartMode, setChartMode] = useState<'financial' | 'funnel' | 'efficiency'>(
    'financial'
  );

  // Forecast State
  const [inputs, setInputs] = useState<ForecastInput>(() =>
    forecastService.getDefaultInputs()
  );
  const [forecastTitle, setForecastTitle] = useState<string>(
    'New Campaign Results Prediction'
  );
  const [activeForecast, setActiveForecast] = useState<Forecast | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(true);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [savedForecasts, setSavedForecasts] = useState<Forecast[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load Initial Data
  useEffect(() => {
    const projectList = projectService.getProjects();
    setProjects(projectList);

    const paramProj = searchParams.get('projectId');
    const matchedProj =
      paramProj && projectList.find((p) => p.id === paramProj)
        ? projectList.find((p) => p.id === paramProj)
        : projectList[0];

    if (matchedProj) {
      setSelectedProjectId(matchedProj.id);
      const defaults = forecastService.getDefaultInputs(matchedProj);
      setInputs(defaults);
      setForecastTitle(`${matchedProj.business.brandName} Campaign Forecast`);
    }

    setSavedForecasts(forecastService.getSavedForecasts());
  }, [searchParams]);

  // Handle Project Selection Change
  const handleProjectChange = (projId: string) => {
    setSelectedProjectId(projId);
    const proj = projects.find((p) => p.id === projId);
    if (proj) {
      const updated = forecastService.getDefaultInputs(proj);
      setInputs(updated);
      setForecastTitle(`${proj.business.brandName} Campaign Forecast`);
      addToast({
        type: 'info',
        title: 'Project Data Applied',
        message: `Applied business profile, pricing, and audience settings from ${proj.business.brandName}.`,
      });
    }
  };

  // Import Budget from Budget Planner (Prompt 12 Sync)
  const handleImportSavedBudget = () => {
    const plans = budgetService.getPlans();
    const relevantPlan = selectedProjectId
      ? plans.find((p) => p.projectId === selectedProjectId) || plans[0]
      : plans[0];

    if (!relevantPlan) {
      addToast({
        type: 'warning',
        title: 'No Saved Budget Found',
        message: 'Create and save a budget in the Budget Planner to import.',
      });
      return;
    }

    setInputs((prev) => ({
      ...prev,
      totalBudget: relevantPlan.totalBudget,
      adSpend: Math.round(relevantPlan.totalBudget * 0.7),
      creativeCosts: Math.round(relevantPlan.totalBudget * 0.15),
      agencyCosts: Math.round(relevantPlan.totalBudget * 0.1),
      softwareCosts: Math.round(relevantPlan.totalBudget * 0.05),
      currency: relevantPlan.currency,
    }));

    addToast({
      type: 'success',
      title: 'Budget Plan Imported',
      message: `Imported ${relevantPlan.currency} ${relevantPlan.totalBudget.toLocaleString()} total allocation from "${relevantPlan.planTitle}".`,
    });
  };

  // Re-generate Calculations when inputs change
  const currentScenarios = useMemo(() => {
    return forecastService.generateAllScenarios(inputs);
  }, [inputs]);

  const currentBreakEven = useMemo(() => {
    return forecastService.calculateBreakEven(inputs, currentScenarios.balanced);
  }, [inputs, currentScenarios]);

  const currentSensitivity = useMemo(() => {
    return forecastService.calculateSensitivity(inputs, currentScenarios.balanced);
  }, [inputs, currentScenarios]);

  const currentDataQuality = useMemo(() => {
    return forecastService.assessDataQuality(inputs);
  }, [inputs]);

  // Assemble Active Forecast Object
  useEffect(() => {
    const fc: Forecast = {
      id: activeForecast?.id || `forecast_${Date.now()}`,
      title: forecastTitle,
      createdAt: activeForecast?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: selectedProjectId,
      projectName:
        projects.find((p) => p.id === selectedProjectId)?.business?.brandName ||
        inputs.projectName,
      inputs,
      scenarios: currentScenarios,
      breakEven: currentBreakEven,
      sensitivity: currentSensitivity,
      dataQuality: currentDataQuality,
      aiExplanation: activeForecast?.aiExplanation,
    };
    setActiveForecast(fc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, currentScenarios, currentBreakEven, currentSensitivity, currentDataQuality]);

  // Request or refresh AI Explanation
  const handleGenerateAiExplanation = async () => {
    if (!activeForecast) return;
    setIsAiGenerating(true);
    addToast({
      type: 'info',
      title: 'Synthesizing Strategic Explanation',
      message: 'Analyzing scenarios, calculating risk thresholds, and extracting growth levers...',
    });

    try {
      const explanation = await forecastService.generateAIExplanation(activeForecast);
      setActiveForecast((prev) => (prev ? { ...prev, aiExplanation: explanation } : null));
      addToast({
        type: 'success',
        title: 'Strategic Analysis Ready',
        message: 'Scenario interpretation and risk diagnostics updated.',
      });
    } catch {
      addToast({
        type: 'warning',
        title: 'Standard Interpretation Applied',
        message: 'Deterministic mathematical analysis deployed.',
      });
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Save Active Forecast
  const handleSaveForecast = () => {
    if (!activeForecast) return;
    forecastService.saveForecast(activeForecast);
    setSavedForecasts(forecastService.getSavedForecasts());
    addToast({
      type: 'success',
      title: 'Forecast Saved',
      message: `"${activeForecast.title}" saved to your workspace audit history.`,
    });
  };

  // Load a Saved Forecast
  const handleLoadSavedForecast = (f: Forecast) => {
    setActiveForecast(f);
    setInputs(f.inputs);
    setForecastTitle(f.title);
    if (f.projectId) setSelectedProjectId(f.projectId);
    setActiveTab('scenarios');
    addToast({
      type: 'info',
      title: 'Forecast Loaded',
      message: `Loaded "${f.title}" (${new Date(f.createdAt).toLocaleDateString()}).`,
    });
  };

  // Duplicate a Forecast
  const handleDuplicate = (id: string) => {
    const dup = forecastService.duplicateForecast(id);
    if (dup) {
      setSavedForecasts(forecastService.getSavedForecasts());
      addToast({
        type: 'success',
        title: 'Forecast Duplicated',
        message: `Created experimental copy "${dup.title}".`,
      });
    }
  };

  // Delete a Forecast
  const handleDelete = (id: string) => {
    forecastService.deleteForecast(id);
    setSavedForecasts(forecastService.getSavedForecasts());
    addToast({
      type: 'info',
      title: 'Forecast Removed',
      message: 'Record removed from saved history.',
    });
  };

  // Export CSV
  const handleExportCsv = () => {
    if (!activeForecast) return;
    const csv = forecastService.exportForecastCsv(activeForecast);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sparkline-forecast-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: 'Scenario comparison table downloaded.',
    });
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  // Copy Summary to Clipboard
  const handleCopySummary = () => {
    if (!activeForecast) return;
    const b = activeForecast.scenarios.balanced;
    const c = activeForecast.scenarios.conservative;
    const o = activeForecast.scenarios.optimistic;
    const curr = activeForecast.inputs.currency;

    const summaryText = `SPARKLINE MARKETING RESULTS FORECAST: ${activeForecast.title}
Total Budget: ${curr} ${activeForecast.inputs.totalBudget.toLocaleString()} (Ad Spend: ${curr} ${activeForecast.inputs.adSpend.toLocaleString()})
Flight Duration: ${activeForecast.inputs.durationDays} Days

1. CONSERVATIVE SCENARIO:
   - Estimated Revenue: ${curr} ${c.revenue.toLocaleString()}
   - Estimated Customers: ${c.customers}
   - Estimated ROAS: ${c.roas}x | ROI: ${c.roiRevenue}%
   - Direct CPA: ${curr} ${c.cpa}

2. BALANCED SCENARIO (Target):
   - Estimated Revenue: ${curr} ${b.revenue.toLocaleString()}
   - Estimated Customers: ${b.customers}
   - Estimated ROAS: ${b.roas}x | ROI: ${b.roiRevenue}%
   - Direct CPA: ${curr} ${b.cpa}

3. OPTIMISTIC SCENARIO:
   - Estimated Revenue: ${curr} ${o.revenue.toLocaleString()}
   - Estimated Customers: ${o.customers}
   - Estimated ROAS: ${o.roas}x | ROI: ${o.roiRevenue}%

BREAK-EVEN ANALYSIS:
   - Break-Even Revenue: ${curr} ${activeForecast.breakEven.breakEvenRevenue.toLocaleString()}
   - Required Customers: ${activeForecast.breakEven.breakEvenCustomers}
   - Required ROAS: ${activeForecast.breakEven.breakEvenROAS}x

Note: Modeled scenario estimates based on input assumptions. Not guaranteed performance.`;

    navigator.clipboard.writeText(summaryText);
    setCopiedId('summary');
    setTimeout(() => setCopiedId(null), 2500);
    addToast({
      type: 'success',
      title: 'Summary Copied',
      message: 'Forecast numbers copied to clipboard.',
    });
  };

  // Chart Data Preparation
  const chartData = useMemo(() => {
    const c = currentScenarios.conservative;
    const b = currentScenarios.balanced;
    const o = currentScenarios.optimistic;

    if (chartMode === 'financial') {
      return [
        {
          scenario: 'Conservative',
          Revenue: c.revenue,
          'Gross Profit': c.grossProfit || 0,
          'Total Investment': c.totalInvestment,
          'Ad Spend': c.adSpend,
        },
        {
          scenario: 'Balanced (Target)',
          Revenue: b.revenue,
          'Gross Profit': b.grossProfit || 0,
          'Total Investment': b.totalInvestment,
          'Ad Spend': b.adSpend,
        },
        {
          scenario: 'Optimistic',
          Revenue: o.revenue,
          'Gross Profit': o.grossProfit || 0,
          'Total Investment': o.totalInvestment,
          'Ad Spend': o.adSpend,
        },
      ];
    } else if (chartMode === 'funnel') {
      return [
        {
          scenario: 'Conservative',
          Clicks: c.clicks,
          Leads: c.leads,
          Customers: c.customers,
        },
        {
          scenario: 'Balanced (Target)',
          Clicks: b.clicks,
          Leads: b.leads,
          Customers: b.customers,
        },
        {
          scenario: 'Optimistic',
          Clicks: o.clicks,
          Leads: o.leads,
          Customers: o.customers,
        },
      ];
    } else {
      return [
        {
          scenario: 'Conservative',
          'ROAS (x)': c.roas,
          'ROI (%)': c.roiRevenue,
          'CPA ($)': c.cpa,
        },
        {
          scenario: 'Balanced (Target)',
          'ROAS (x)': b.roas,
          'ROI (%)': b.roiRevenue,
          'CPA ($)': b.cpa,
        },
        {
          scenario: 'Optimistic',
          'ROAS (x)': o.roas,
          'ROI (%)': o.roiRevenue,
          'CPA ($)': o.cpa,
        },
      ];
    }
  }, [currentScenarios, chartMode]);

  // Actual Historical Calculations for Comparison (from metricsService)
  const savedCalculations = useMemo(() => {
    return metricsService.getSavedCalculations();
  }, []);

  return (
    <>
      <SEO
        title="Marketing Results Predictor & ROI Forecaster — Sparkline Marketing"
        description="Explore campaign outcomes, predict ROI and ROAS, model risk scenarios, and perform unit-economic break-even analysis."
      />

      <div ref={printRef} className="space-y-8 pb-16 print:p-0 print:space-y-4">
        {/* ========================================================================= */}
        {/* HEADER & TOP COMMAND TOOLBAR */}
        {/* ========================================================================= */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card print:border-none print:shadow-none print:p-0">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="blue" className="px-2.5 py-0.5">
                <TrendingUp className="w-3 h-3 mr-1" />
                Performance Modeling Engine
              </Badge>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                3 Scenarios • Unit Economics • Break-Even Math
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight font-display">
              Marketing Results Predictor
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore possible campaign outcomes, understand your financial expectations,
              and make smarter marketing investment decisions.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 print:hidden">
            {/* Project Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <Target className="w-4 h-4 text-sparkline-blue shrink-0" />
              <select
                aria-label="Active Project"
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-sparkline-midnight focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.business.brandName}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportSavedBudget}
              className="gap-1.5"
              title="Import numbers from saved budget plan"
            >
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Import Budget</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySummary}
              className="gap-1.5"
            >
              {copiedId === 'summary' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-slate-500" />
              )}
              <span className="hidden sm:inline">Copy</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="gap-1.5"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">CSV</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Print / PDF</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveForecast}
              className="gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Forecast</span>
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLLAPSIBLE CONFIGURATION PANEL */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden print:hidden transition-all">
          <div
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="flex items-center justify-between p-5 sm:p-6 cursor-pointer hover:bg-slate-50/70 border-b border-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-sparkline-blue flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-sparkline-midnight">
                  Forecast Input Configuration & Assumptions
                </h2>
                <p className="text-xs text-slate-500">
                  Configure budget, flight dates, channel metrics, unit economics, and source tags.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg hidden sm:inline">
                Total Budget: {inputs.currency} {inputs.totalBudget.toLocaleString()}
              </span>
              <button
                type="button"
                className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-transform duration-200 ${
                  isConfigOpen ? 'rotate-180' : ''
                }`}
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isConfigOpen && (
            <div className="p-6 sm:p-8 space-y-8 bg-slate-50/40">
              {/* Forecast Title Input */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div className="flex-1 max-w-xl">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Forecast Plan Title
                  </label>
                  <input
                    type="text"
                    value={forecastTitle}
                    onChange={(e) => setForecastTitle(e.target.value)}
                    placeholder="e.g. Q4 Meta Ads Scale Plan"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue/20 focus:border-sparkline-blue"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Currency:</span>
                  <select
                    aria-label="Currency"
                    value={inputs.currency}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, currency: e.target.value }))
                    }
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-sparkline-midnight focus:outline-none"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.symbol}) — {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3-COLUMN INPUT GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* COLUMN 1: CAMPAIGN & FLIGHT */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Target className="w-4 h-4 text-sparkline-blue" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight">
                      1. Campaign & Channel
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-medium text-slate-600 mb-1">
                        Product / Offering Name
                      </label>
                      <input
                        type="text"
                        value={inputs.productService}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            productService: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-600 mb-1">
                        Campaign Objective
                      </label>
                      <select
                        value={inputs.campaignObjective}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            campaignObjective: e.target.value as ForecastObjective,
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none"
                      >
                        {OBJECTIVES.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-600 mb-1">
                        Primary Marketing Platform
                      </label>
                      <select
                        value={inputs.platform}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            platform: e.target.value as ForecastPlatform,
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none"
                      >
                        {PLATFORMS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="block font-medium text-slate-600 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={inputs.startDate}
                          onChange={(e) =>
                            setInputs((prev) => ({ ...prev, startDate: e.target.value }))
                          }
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-600 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={inputs.endDate}
                          onChange={(e) =>
                            setInputs((prev) => ({ ...prev, endDate: e.target.value }))
                          }
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-600 mb-1">
                        Duration (Days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={inputs.durationDays}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            durationDays: Math.max(1, Number(e.target.value) || 1),
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: FINANCIAL BREAKDOWN */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight">
                        2. Financial Investments
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-400">Distinguishes ad spend</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-sparkline-blue">
                          Direct Media Ad Spend ({inputs.currency})
                        </label>
                        <span className="text-[10px] text-slate-400">Auction cleared</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={inputs.adSpend}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value) || 0);
                          setInputs((prev) => ({
                            ...prev,
                            adSpend: val,
                            totalBudget:
                              val +
                              prev.creativeCosts +
                              prev.agencyCosts +
                              prev.softwareCosts,
                          }));
                        }}
                        className="w-full px-3 py-1.5 bg-blue-50/50 border border-blue-200 rounded-lg font-mono font-bold text-sparkline-blue focus:outline-none text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block font-medium text-slate-600 mb-1">
                          Creative ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={inputs.creativeCosts}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value) || 0);
                            setInputs((prev) => ({
                              ...prev,
                              creativeCosts: val,
                              totalBudget:
                                prev.adSpend + val + prev.agencyCosts + prev.softwareCosts,
                            }));
                          }}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-600 mb-1">
                          Agency ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={inputs.agencyCosts}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value) || 0);
                            setInputs((prev) => ({
                              ...prev,
                              agencyCosts: val,
                              totalBudget:
                                prev.adSpend +
                                prev.creativeCosts +
                                val +
                                prev.softwareCosts,
                            }));
                          }}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-600 mb-1">
                          Tools ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={inputs.softwareCosts}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value) || 0);
                            setInputs((prev) => ({
                              ...prev,
                              softwareCosts: val,
                              totalBudget:
                                prev.adSpend +
                                prev.creativeCosts +
                                prev.agencyCosts +
                                val,
                            }));
                          }}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-100 flex items-center justify-between text-xs font-semibold text-sparkline-midnight">
                      <span>Total Campaign Investment:</span>
                      <span className="font-mono text-sparkline-blue font-bold">
                        {inputs.currency} {inputs.totalBudget.toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-medium text-slate-600 mb-1">
                          Selling Price / AOV
                        </label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.01"
                          value={inputs.sellingPriceAov}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              sellingPriceAov: Math.max(0.1, Number(e.target.value) || 1),
                            }))
                          }
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold text-slate-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-600 mb-1">
                          Gross Margin %
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={inputs.grossMarginPercent || ''}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              grossMarginPercent: Math.max(
                                0,
                                Math.min(100, Number(e.target.value) || 0)
                              ),
                            }))
                          }
                          placeholder="e.g. 65"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: PERFORMANCE INPUTS & SOURCE TAGS */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-sparkline-blue" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-sparkline-midnight">
                        3. Baseline Metrics & Sources
                      </h3>
                    </div>
                    <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                      Transparent Attribution
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* CPM */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-medium text-slate-700">CPM ({inputs.currency})</label>
                        <select
                          aria-label="CPM Source Tag"
                          value={inputs.cpmSource}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              cpmSource: e.target.value as ForecastSource,
                            }))
                          }
                          className="text-[10px] font-semibold bg-slate-100 text-slate-600 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                        >
                          <option value="benchmark">Verified Benchmark</option>
                          <option value="historical">User Historical</option>
                          <option value="actual">Actual Campaign</option>
                          <option value="assumption">User Assumption</option>
                        </select>
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={inputs.cpm}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            cpm: Math.max(0.1, Number(e.target.value) || 1),
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    {/* CTR */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-medium text-slate-700">Click-Through Rate (%)</label>
                        <select
                          aria-label="CTR Source Tag"
                          value={inputs.ctrSource}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              ctrSource: e.target.value as ForecastSource,
                            }))
                          }
                          className="text-[10px] font-semibold bg-slate-100 text-slate-600 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                        >
                          <option value="benchmark">Verified Benchmark</option>
                          <option value="historical">User Historical</option>
                          <option value="actual">Actual Campaign</option>
                          <option value="assumption">User Assumption</option>
                        </select>
                      </div>
                      <input
                        type="number"
                        step="0.05"
                        min="0.01"
                        value={inputs.ctr}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            ctr: Math.max(0.01, Number(e.target.value) || 0.1),
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    {/* Customer CVR */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-medium text-slate-700">Conversion Rate (%)</label>
                        <select
                          aria-label="CVR Source Tag"
                          value={inputs.customerCvrSource}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              customerCvrSource: e.target.value as ForecastSource,
                            }))
                          }
                          className="text-[10px] font-semibold bg-slate-100 text-slate-600 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                        >
                          <option value="benchmark">Verified Benchmark</option>
                          <option value="historical">User Historical</option>
                          <option value="actual">Actual Campaign</option>
                          <option value="assumption">User Assumption</option>
                        </select>
                      </div>
                      <input
                        type="number"
                        step="0.05"
                        min="0.01"
                        value={inputs.customerCvr}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            customerCvr: Math.max(0.01, Number(e.target.value) || 0.1),
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    {/* Notes */}
                    <div className="pt-1">
                      <label className="block font-medium text-slate-600 mb-1">
                        Operational / Testing Notes
                      </label>
                      <textarea
                        rows={2}
                        value={inputs.notes || ''}
                        onChange={(e) =>
                          setInputs((prev) => ({ ...prev, notes: e.target.value }))
                        }
                        placeholder="Context on creative variations, landing page changes..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-[11px] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* MAIN NAVIGATION TABS */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-thin print:hidden">
          <button
            type="button"
            onClick={() => setActiveTab('scenarios')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'scenarios'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Scenario Projections (3-Tier)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('breakEven')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'breakEven'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Break-Even Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sensitivity')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'sensitivity'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Sensitivity & Impact</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quality')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'quality'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Data Quality & Assumptions</span>
            {currentDataQuality.assumptionsCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                {currentDataQuality.assumptionsCount} assumptions
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Saved Forecasts ({savedForecasts.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 3-SCENARIO PROJECTIONS & COMPARISON DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'scenarios' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 3-COLUMN SCENARIO SUMMARY CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 1. CONSERVATIVE CARD */}
              <div className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-card p-6 flex flex-col justify-between space-y-6 hover:border-slate-300 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Conservative Case
                    </span>
                    <span className="text-xs font-mono text-slate-500">Defensive Model</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-sparkline-midnight">
                    {inputs.currency} {currentScenarios.conservative.revenue.toLocaleString()}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {currentScenarios.conservative.description}
                  </p>
                </div>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase">Est. Customers</span>
                    <span className="text-sm font-bold text-sparkline-midnight font-mono">
                      {currentScenarios.conservative.customers.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase">ROAS (Ad Spend)</span>
                    <span className="text-sm font-bold text-sparkline-blue font-mono">
                      {currentScenarios.conservative.roas}x
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase">Direct CPA</span>
                    <span className="text-sm font-bold text-slate-700 font-mono">
                      {inputs.currency} {currentScenarios.conservative.cpa}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase">Net Return</span>
                    <span
                      className={`text-sm font-bold font-mono ${
                        currentScenarios.conservative.netReturn >= 0
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {currentScenarios.conservative.netReturn >= 0 ? '+' : ''}
                      {inputs.currency}{' '}
                      {currentScenarios.conservative.netReturn.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1 text-xs text-amber-900">
                  <span className="font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Downside Protections
                  </span>
                  <p className="text-[11px] text-amber-800">
                    Prepares your cash reserves against bid spikes (+20% CPM) and initial creative fatigue (-25% CTR).
                  </p>
                </div>
              </div>

              {/* 2. BALANCED CARD (PRIMARY HIGHLIGHT) */}
              <div className="bg-white rounded-2xl border-2 border-sparkline-blue shadow-xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-sparkline-blue text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                  Primary Planning Target
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sparkline-blue bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Balanced Scenario
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-sparkline-midnight">
                    {inputs.currency} {currentScenarios.balanced.revenue.toLocaleString()}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentScenarios.balanced.description}
                  </p>
                </div>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                    <span className="text-[10px] text-sparkline-blue block uppercase font-bold">
                      Est. Customers
                    </span>
                    <span className="text-base font-extrabold text-sparkline-midnight font-mono">
                      {currentScenarios.balanced.customers.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                    <span className="text-[10px] text-sparkline-blue block uppercase font-bold">
                      Target ROAS
                    </span>
                    <span className="text-base font-extrabold text-sparkline-blue font-mono">
                      {currentScenarios.balanced.roas}x
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase">Direct CPA</span>
                    <span className="text-sm font-bold text-slate-700 font-mono">
                      {inputs.currency} {currentScenarios.balanced.cpa}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase">Net Return</span>
                    <span
                      className={`text-sm font-bold font-mono ${
                        currentScenarios.balanced.netReturn >= 0
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {currentScenarios.balanced.netReturn >= 0 ? '+' : ''}
                      {inputs.currency} {currentScenarios.balanced.netReturn.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs text-sparkline-midnight">
                  <span className="font-bold flex items-center gap-1 text-sparkline-blue">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Reasonable Baseline Expectation
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Supported by current channel benchmark standards. Use this target for media buying budgets and inventory pacing.
                  </p>
                </div>
              </div>

              {/* 3. OPTIMISTIC CARD */}
              <div className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-card p-6 flex flex-col justify-between space-y-6 hover:border-slate-300 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Optimistic Case
                    </span>
                    <span className="text-xs font-mono text-emerald-600">Aspirational Ceil</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-sparkline-midnight">
                    {inputs.currency} {currentScenarios.optimistic.revenue.toLocaleString()}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {currentScenarios.optimistic.description}
                  </p>
                </div>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase">Est. Customers</span>
                    <span className="text-sm font-bold text-sparkline-midnight font-mono">
                      {currentScenarios.optimistic.customers.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase">Upper ROAS</span>
                    <span className="text-sm font-bold text-emerald-600 font-mono">
                      {currentScenarios.optimistic.roas}x
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase">Direct CPA</span>
                    <span className="text-sm font-bold text-slate-700 font-mono">
                      {inputs.currency} {currentScenarios.optimistic.cpa}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase">Net Return</span>
                    <span className="text-sm font-bold font-mono text-emerald-600">
                      +{inputs.currency}{' '}
                      {currentScenarios.optimistic.netReturn.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs text-slate-600">
                  <span className="font-bold flex items-center gap-1 text-slate-700">
                    <Info className="w-3.5 h-3.5 text-sparkline-blue" />
                    Fulfillment & Scale Caution
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Requires top-decile creative resonance (+25% CTR) and flawless checkout conversion. Do not commit non-refundable capital based on this alone.
                  </p>
                </div>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* VISUAL ANALYTICS COMPARISON CHART */}
            {/* ===================================================================== */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Multi-Scenario Visual Comparison
                  </h3>
                  <p className="text-xs text-slate-500">
                    Evaluating financial variance, customer volume, and campaign capital efficiency.
                  </p>
                </div>

                {/* Metric Mode Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setChartMode('financial')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      chartMode === 'financial'
                        ? 'bg-white text-sparkline-midnight shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Financials ({inputs.currency})
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMode('funnel')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      chartMode === 'funnel'
                        ? 'bg-white text-sparkline-midnight shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Funnel Volume
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMode('efficiency')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      chartMode === 'efficiency'
                        ? 'bg-white text-sparkline-midnight shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Efficiency Metrics
                  </button>
                </div>
              </div>

              {/* Recharts Container */}
              <div className="h-72 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="scenario"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                    {chartMode === 'financial' && (
                      <>
                        <Bar dataKey="Revenue" fill="#0052FF" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Gross Profit" fill="#10b981" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Total Investment" fill="#64748b" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Ad Spend" fill="#93c5fd" radius={[6, 6, 0, 0]} />
                      </>
                    )}

                    {chartMode === 'funnel' && (
                      <>
                        <Bar dataKey="Clicks" fill="#0052FF" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Leads" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Customers" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </>
                    )}

                    {chartMode === 'efficiency' && (
                      <>
                        <Bar dataKey="ROAS (x)" fill="#0052FF" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="ROI (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="CPA ($)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center justify-between">
                <span>
                  Charts reflect deterministic mathematical projections modeled on your specific input parameters.
                </span>
                <span className="font-semibold text-slate-700">
                  Total Flight: {inputs.durationDays} Days
                </span>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* COMPLETE 16-METRIC DETAILED COMPARISON TABLE */}
            {/* ===================================================================== */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden space-y-4 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Granular Performance Metrics Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">
                    Side-by-side comparison across audience delivery, unit costs, and profit accounting.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  className="gap-1.5 self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full CSV</span>
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th className="px-4 py-3">Metric</th>
                      <th className="px-4 py-3">Formula / Logic</th>
                      <th className="px-4 py-3">Conservative</th>
                      <th className="px-4 py-3 bg-blue-50/50 text-sparkline-blue">
                        Balanced (Target)
                      </th>
                      <th className="px-4 py-3">Optimistic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">Effective CPM</td>
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                        Base CPM × Multiplier
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {inputs.currency} {currentScenarios.conservative.effectiveCPM}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-sparkline-blue bg-blue-50/30">
                        {inputs.currency} {currentScenarios.balanced.effectiveCPM}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {inputs.currency} {currentScenarios.optimistic.effectiveCPM}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">Effective CTR</td>
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                        Base CTR × Multiplier
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {currentScenarios.conservative.effectiveCTR}%
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-sparkline-blue bg-blue-50/30">
                        {currentScenarios.balanced.effectiveCTR}%
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {currentScenarios.optimistic.effectiveCTR}%
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        Effective Conversion Rate (CVR)
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                        Base CVR × Multiplier
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {currentScenarios.conservative.effectiveCVR}%
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-sparkline-blue bg-blue-50/30">
                        {currentScenarios.balanced.effectiveCVR}%
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {currentScenarios.optimistic.effectiveCVR}%
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">Estimated Impressions</td>
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                        (Ad Spend / CPM) × 1,000
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {currentScenarios.conservative.impressions.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-sparkline-blue bg-blue-50/30">
                        {currentScenarios.balanced.impressions.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {currentScenarios.optimistic.impressions.toLocaleString()}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">Estimated Clicks</td>
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                        Impressions × (CTR / 100)
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {currentScenarios.conservative.clicks.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-sparkline-blue bg-blue-50/30">
                        {currentScenarios.balanced.clicks.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {currentScenarios.optimistic.clicks.toLocaleString()}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">Estimated CPC</td>
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                        Ad Spend / Clicks
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {inputs.currency} {currentScenarios.conservative.cpc}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-sparkline-blue bg-blue-50/30">
                        {inputs.currency} {currentScenarios.balanced.cpc}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {inputs.currency} {currentScenarios.optimistic.cpc}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        Estimated Customers / Buyers
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                        Clicks × (CVR / 100)
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">
                        {currentScenarios.conservative.customers.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-sparkline-blue bg-blue-50/30">
                        {currentScenarios.balanced.customers.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">
                        {currentScenarios.optimistic.customers.toLocaleString()}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        Direct CPA (Media Ad Spend Only)
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                        Ad Spend / Customers
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {inputs.currency} {currentScenarios.conservative.cpa}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-sparkline-blue bg-blue-50/30">
                        {inputs.currency} {currentScenarios.balanced.cpa}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {inputs.currency} {currentScenarios.optimistic.cpa}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        Fully Loaded CPA (All Campaign Costs)
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                        Total Investment / Customers
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {inputs.currency} {currentScenarios.conservative.fullyLoadedCPA}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-sparkline-blue bg-blue-50/30">
                        {inputs.currency} {currentScenarios.balanced.fullyLoadedCPA}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {inputs.currency} {currentScenarios.optimistic.fullyLoadedCPA}
                      </td>
                    </tr>

                    <tr className="bg-slate-50/60 font-semibold">
                      <td className="px-4 py-3 text-sparkline-midnight">Attributed Revenue</td>
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                        Customers × AOV
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-800">
                        {inputs.currency} {currentScenarios.conservative.revenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono font-black text-sparkline-blue bg-blue-50/50">
                        {inputs.currency} {currentScenarios.balanced.revenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-800">
                        {inputs.currency} {currentScenarios.optimistic.revenue.toLocaleString()}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        Gross Profit (Contribution Margin)
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                        Revenue × Margin %
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {currentScenarios.conservative.grossProfit !== undefined
                          ? `${inputs.currency} ${currentScenarios.conservative.grossProfit.toLocaleString()}`
                          : 'N/A'}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-sparkline-blue bg-blue-50/30">
                        {currentScenarios.balanced.grossProfit !== undefined
                          ? `${inputs.currency} ${currentScenarios.balanced.grossProfit.toLocaleString()}`
                          : 'N/A'}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {currentScenarios.optimistic.grossProfit !== undefined
                          ? `${inputs.currency} ${currentScenarios.optimistic.grossProfit.toLocaleString()}`
                          : 'N/A'}
                      </td>
                    </tr>

                    <tr className="bg-blue-50/30 font-bold">
                      <td className="px-4 py-3 text-sparkline-blue">Return on Ad Spend (ROAS)</td>
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                        Attributed Revenue / Ad Spend
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {currentScenarios.conservative.roas}x
                      </td>
                      <td className="px-4 py-3 font-mono font-black text-sparkline-blue bg-blue-50">
                        {currentScenarios.balanced.roas}x
                      </td>
                      <td className="px-4 py-3 font-mono text-emerald-600">
                        {currentScenarios.optimistic.roas}x
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        Net ROI (Total Investment Basis)
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                        ((Net Return) / Total Invest.) × 100
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {currentScenarios.conservative.roiRevenue}%
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-sparkline-blue bg-blue-50/30">
                        {currentScenarios.balanced.roiRevenue}%
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {currentScenarios.optimistic.roiRevenue}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* AI STRATEGIC EXPLANATION & RISK DIAGNOSTICS */}
            {/* ===================================================================== */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-sparkline-midnight">
                      AI Forecast Explanation & Commercial Diagnostics
                    </h3>
                    <p className="text-xs text-slate-500">
                      Grounded interpretation of what the numbers mean, key sensitivities, and execution risks.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAiExplanation}
                  disabled={isAiGenerating}
                  className="gap-1.5 self-start sm:self-auto text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>{isAiGenerating ? 'Analyzing...' : 'Refresh AI Analysis'}</span>
                </Button>
              </div>

              {activeForecast?.aiExplanation ? (
                <div className="space-y-6">
                  {/* Executive Summary */}
                  <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200/80 text-xs sm:text-sm text-purple-950 leading-relaxed space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-purple-900">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Executive Commercial Synthesis
                    </span>
                    <p>{activeForecast.aiExplanation.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-slate-500" />
                        Downside Risk Analysis
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        {activeForecast.aiExplanation.scenarioInterpretations.conservative}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
                      <span className="font-bold text-sparkline-blue flex items-center gap-1">
                        <Target className="w-3.5 h-3.5" />
                        Target Case Rationale
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        {activeForecast.aiExplanation.scenarioInterpretations.balanced}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Upper Bound Discipline
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        {activeForecast.aiExplanation.scenarioInterpretations.optimistic}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Financial Risks */}
                    <div className="space-y-2 text-xs">
                      <span className="font-bold text-rose-700 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        Critical Vulnerabilities & Margin Risks
                      </span>
                      <ul className="space-y-1.5 text-slate-600">
                        {activeForecast.aiExplanation.financialRisks.map((risk, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Next Steps */}
                    <div className="space-y-2 text-xs">
                      <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Actionable Testing Protocol
                      </span>
                      <ul className="space-y-1.5 text-slate-600">
                        {activeForecast.aiExplanation.suggestedNextSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-sparkline-midnight">
                    Generate Strategic AI Interpretation
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Receive a full narrative analysis explaining scenario implications, financial risk points, and recommended testing protocols.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleGenerateAiExplanation}
                    disabled={isAiGenerating}
                    className="gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Interpretation</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BREAK-EVEN CALCULATOR */}
        {/* ========================================================================= */}
        {activeTab === 'breakEven' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="blue" className="px-2.5 py-0.5">
                    <Scale className="w-3 h-3 mr-1" />
                    Unit Economics Safety Thresholds
                  </Badge>
                  <span className="text-xs font-mono text-slate-500">
                    Basis: {currentBreakEven.calculationBasis === 'gross_profit' ? 'Gross Profit Contribution' : 'Top-Line Revenue'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-sparkline-midnight mt-2">
                  Campaign Break-Even Analysis
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  {currentBreakEven.explanation}
                </p>
              </div>

              {/* 4 Break-Even Key KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-slate-500 block">
                    Break-Even Revenue
                  </span>
                  <span className="text-2xl font-black text-sparkline-midnight font-mono">
                    {inputs.currency} {currentBreakEven.breakEvenRevenue.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Minimum revenue to avoid cash loss
                  </span>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-slate-500 block">
                    Required Customers
                  </span>
                  <span className="text-2xl font-black text-sparkline-blue font-mono">
                    {currentBreakEven.breakEvenCustomers}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    At {inputs.currency} {inputs.sellingPriceAov} AOV
                  </span>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-slate-500 block">
                    Break-Even ROAS
                  </span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">
                    {currentBreakEven.breakEvenROAS}x
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Required multiplier on ad spend
                  </span>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs font-semibold text-slate-500 block">
                    Max Allowable CPA
                  </span>
                  <span className="text-2xl font-black text-rose-600 font-mono">
                    {inputs.currency} {currentBreakEven.maxAllowableCPA}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Absolute cap per acquired buyer
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown Box */}
              <div className="p-6 rounded-xl bg-blue-50/40 border border-blue-200/80 space-y-3 text-xs text-slate-700">
                <span className="font-bold text-sparkline-blue flex items-center gap-1.5 text-sm">
                  <Calculator className="w-4 h-4" />
                  Break-Even Mathematical Equations
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1 bg-white p-3 rounded-lg border border-blue-100">
                    <span className="font-bold text-slate-800 block">Gross Profit Break-Even Formula</span>
                    <p className="font-mono text-[11px] text-slate-600">
                      BreakEven Revenue = Total Investment / (Gross Margin % / 100)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {inputs.currency} {inputs.totalBudget.toLocaleString()} / ({(inputs.grossMarginPercent || 100) / 100}) = {inputs.currency} {currentBreakEven.breakEvenRevenue.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-1 bg-white p-3 rounded-lg border border-blue-100">
                    <span className="font-bold text-slate-800 block">Allowable Acquisition Ceiling</span>
                    <p className="font-mono text-[11px] text-slate-600">
                      Max CPA = Selling Price × (Gross Margin % / 100)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      If your customer acquisition cost exceeds {inputs.currency} {currentBreakEven.maxAllowableCPA}, each additional customer acquired will produce a net margin loss.
                    </p>
                  </div>
                </div>
              </div>

              {/* Limitations Notice */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs text-slate-600">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-sparkline-blue" />
                  Assumptions & Calculation Boundaries
                </span>
                <ul className="space-y-1 pl-4 list-disc text-slate-500">
                  {currentBreakEven.limitations.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SENSITIVITY & IMPACT ANALYSIS */}
        {/* ========================================================================= */}
        {activeTab === 'sensitivity' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
              <div>
                <Badge variant="blue" className="px-2.5 py-0.5">
                  <Sliders className="w-3 h-3 mr-1" />
                  Controlled Variable Adjustments
                </Badge>
                <h2 className="text-xl font-bold text-sparkline-midnight mt-2">
                  Budget & Metric Sensitivity Analysis
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Evaluate how variance in key campaign assumptions influences total customer volume, revenue, and capital efficiency.
                </p>
              </div>

              {/* Recommendation Banner */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Highest Strategic Leverage: {currentSensitivity.highestImpactFactor}
                </span>
                <p>{currentSensitivity.recommendation}</p>
              </div>

              {/* Variable Sensitivity Cards */}
              <div className="space-y-6">
                {currentSensitivity.variables.map((v) => (
                  <div
                    key={v.variable}
                    className="p-5 rounded-xl border border-slate-200 bg-white space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-xs">
                          {v.impactRank}
                        </span>
                        <h4 className="text-sm font-bold text-sparkline-midnight">{v.name}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            v.sensitivityTier === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : v.sensitivityTier === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {v.sensitivityTier} Sensitivity
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-500">
                        Base Value: {v.baseValue} {v.unit}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{v.insight}</p>

                    {/* Variance Table */}
                    <div className="overflow-x-auto pt-1">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                            <th className="px-3 py-2">Delta</th>
                            <th className="px-3 py-2">Adjusted Value</th>
                            <th className="px-3 py-2">Est. Customers</th>
                            <th className="px-3 py-2">Est. Revenue ({inputs.currency})</th>
                            <th className="px-3 py-2">ROAS</th>
                            <th className="px-3 py-2">ROI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {v.adjustments.map((adj) => (
                            <tr
                              key={adj.deltaPercent}
                              className={adj.deltaPercent === 0 ? 'bg-blue-50/40 font-bold' : ''}
                            >
                              <td className="px-3 py-2 font-semibold">
                                {adj.deltaPercent > 0 ? `+${adj.deltaPercent}%` : `${adj.deltaPercent}%`}
                              </td>
                              <td className="px-3 py-2 text-slate-700">
                                {adj.adjustedValue} {v.unit}
                              </td>
                              <td className="px-3 py-2 text-sparkline-midnight">
                                {adj.customers.toLocaleString()}
                              </td>
                              <td className="px-3 py-2 font-bold text-sparkline-blue">
                                {adj.revenue.toLocaleString()}
                              </td>
                              <td className="px-3 py-2">{adj.roas}x</td>
                              <td
                                className={`px-3 py-2 font-bold ${
                                  adj.roi >= 0 ? 'text-emerald-600' : 'text-rose-600'
                                }`}
                              >
                                {adj.roi}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DATA QUALITY & ASSUMPTIONS AUDIT */}
        {/* ========================================================================= */}
        {activeTab === 'quality' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
              <div>
                <Badge variant="blue" className="px-2.5 py-0.5">
                  <ShieldAlert className="w-3 h-3 mr-1" />
                  Anti-Hallucination & Epistemic Honesty
                </Badge>
                <h2 className="text-xl font-bold text-sparkline-midnight mt-2">
                  Forecast Assumptions & Data Source Audit
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Every forecast input is tagged with its origin. The platform never treats unverified assumptions as actual results.
                </p>
              </div>

              {/* Source Distribution Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 font-semibold block">Quality Grade</span>
                  <span
                    className={`text-2xl font-black ${
                      currentDataQuality.qualityScore === 'High'
                        ? 'text-emerald-600'
                        : currentDataQuality.qualityScore === 'Medium'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {currentDataQuality.qualityScore}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Based on input completeness & sources
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 font-semibold block">Verified Benchmarks</span>
                  <span className="text-2xl font-black text-sparkline-blue font-mono">
                    {currentDataQuality.benchmarkCount} Inputs
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Grounded in industry auction data
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 font-semibold block">User Assumptions</span>
                  <span className="text-2xl font-black text-amber-600 font-mono">
                    {currentDataQuality.assumptionsCount} Inputs
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Unverified hypotheses to validate
                  </span>
                </div>
              </div>

              {/* Inputs Audit Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                      <th className="px-4 py-3">Parameter</th>
                      <th className="px-4 py-3">Configured Value</th>
                      <th className="px-4 py-3">Source Tag</th>
                      <th className="px-4 py-3">Audit Implications</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">Cost Per Mille (CPM)</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">
                        {inputs.currency} {inputs.cpm}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-sparkline-blue uppercase">
                          {inputs.cpmSource}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        Determines impression delivery volume for allocated ad spend.
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">Click-Through Rate (CTR)</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">{inputs.ctr}%</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-sparkline-blue uppercase">
                          {inputs.ctrSource}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        Reflects creative hook relevance and audience resonance.
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">Conversion Rate (CVR)</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">
                        {inputs.customerCvr}%
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-sparkline-blue uppercase">
                          {inputs.customerCvrSource}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        Converts site traffic into paying customers. Primary revenue driver.
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        Average Order Value (AOV)
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">
                        {inputs.currency} {inputs.sellingPriceAov}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                          {inputs.aovSource}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        Direct multiplier on customer revenue and allowable acquisition cost.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Missing Fields Warning */}
              {currentDataQuality.missingFields.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Recommended Data Completeness Enhancements
                  </span>
                  <p className="text-amber-800">
                    For optimal projection fidelity, provide: {currentDataQuality.missingFields.join(', ')}.
                  </p>
                </div>
              )}

              {/* Legal Limitations Notice */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
                <span className="font-bold text-sparkline-midnight flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-sparkline-blue" />
                  Methodological Limitations Notice
                </span>
                <ul className="space-y-1 pl-4 list-disc text-slate-500">
                  {currentDataQuality.limitations.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SAVED FORECASTS & HISTORICAL COMPARISON */}
        {/* ========================================================================= */}
        {activeTab === 'history' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-sparkline-midnight">
                    Saved Campaign Forecasts ({savedForecasts.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Reopen previous forecast models, duplicate for experimentation, or compare with historical actuals.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveForecast}
                  className="gap-1.5 self-start sm:self-auto"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Current Model</span>
                </Button>
              </div>

              {savedForecasts.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    No Saved Forecasts Yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Click &quot;Save Forecast&quot; at the top to save your current scenario setup and reopen it anytime.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                        <th className="px-4 py-3">Title & Project</th>
                        <th className="px-4 py-3">Budget</th>
                        <th className="px-4 py-3">Target Revenue</th>
                        <th className="px-4 py-3">ROAS</th>
                        <th className="px-4 py-3">Quality</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {savedForecasts.map((f) => (
                        <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-bold text-sparkline-midnight block">
                              {f.title}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {f.projectName || 'General Workspace'}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-700">
                            {f.inputs.currency} {f.inputs.totalBudget.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-sparkline-blue">
                            {f.inputs.currency}{' '}
                            {f.scenarios.balanced.revenue.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-emerald-600">
                            {f.scenarios.balanced.roas}x
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                f.dataQuality.qualityScore === 'High'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {f.dataQuality.qualityScore}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-[11px] font-mono">
                            {new Date(f.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleLoadSavedForecast(f)}
                                className="px-2.5 py-1 rounded bg-blue-50 text-sparkline-blue hover:bg-sparkline-blue hover:text-white transition-colors text-[11px] font-bold"
                              >
                                Load
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDuplicate(f.id)}
                                title="Duplicate forecast"
                                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(f.id)}
                                title="Delete forecast"
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Historical Actuals Comparison Section */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="blue" className="px-2.5 py-0.5">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Historical Actuals Grounding
                </Badge>
              </div>
              <h3 className="text-base font-bold text-sparkline-midnight">
                Comparison With Verified Historical Calculations
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Compare current scenario models against saved actual records logged in your Marketing Metrics Hub.
              </p>

              {savedCalculations.length === 0 ? (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2 text-xs">
                  <p className="font-semibold text-slate-700">No Historical Metric Logs Found</p>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Log completed campaigns in the{' '}
                    <Link to="/dashboard/metrics" className="text-sparkline-blue font-bold hover:underline">
                      Marketing Metrics Center
                    </Link>{' '}
                    to enable automated variance benchmarking.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                        <th className="px-4 py-2.5">Date</th>
                        <th className="px-4 py-2.5">Logged Metric</th>
                        <th className="px-4 py-2.5">Actual Recorded Value</th>
                        <th className="px-4 py-2.5">Forecast Target (Balanced)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {savedCalculations.slice(0, 5).map((calc) => (
                        <tr key={calc.id}>
                          <td className="px-4 py-2.5 font-mono text-slate-400 text-[11px]">
                            {new Date(calc.timestamp).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2.5 font-bold text-slate-800">{calc.metricName}</td>
                          <td className="px-4 py-2.5 font-mono font-bold text-emerald-600">
                            {calc.formattedResult}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-sparkline-blue">
                            {calc.metricId === 'roas'
                              ? `${currentScenarios.balanced.roas}x`
                              : calc.metricId === 'cpc'
                              ? `${inputs.currency} ${currentScenarios.balanced.cpc}`
                              : calc.metricId === 'cpa'
                              ? `${inputs.currency} ${currentScenarios.balanced.cpa}`
                              : 'Modeled Baseline'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
