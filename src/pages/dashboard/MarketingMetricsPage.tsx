import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/components/common/Feedback';
import { projectService } from '@/services/project.service';
import {
  metricsService,
  METRIC_CATEGORIES,
  CalculationOutcome,
} from '@/services/metrics.service';
import {
  MetricId,
  MetricCalculationRecord,
  MetricKnowledgeArticle,
  EngagementDenominator,
  ConversionDenominator,
  CpaCostScope,
} from '@/types/metrics';
import { MarketingProject } from '@/types/project';
import {
  BarChart3,
  Search,
  Calculator,
  BookOpen,
  Scale,
  Calendar,
  Copy,
  Check,
  RotateCcw,
  Download,
  Trash2,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';

export const MarketingMetricsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  // Navigation tab: 'calculators' | 'knowledge' | 'benchmarks' | 'history'
  const [activeMainTab, setActiveMainTab] = useState<
    'calculators' | 'knowledge' | 'benchmarks' | 'history'
  >('calculators');

  // Projects State
  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Metrics Category Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchMetricQuery, setSearchMetricQuery] = useState<string>('');

  // Active Calculator State
  const [activeMetricId, setActiveMetricId] = useState<MetricId>('roas');
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  // Metric-Specific Form Inputs State
  // CTR
  const [ctrClicks, setCtrClicks] = useState<number>(1250);
  const [ctrImpressions, setCtrImpressions] = useState<number>(50000);
  // CPC
  const [cpcSpend, setCpcSpend] = useState<number>(2400);
  const [cpcClicks, setCpcClicks] = useState<number>(600);
  // CPM
  const [cpmSpend, setCpmSpend] = useState<number>(3500);
  const [cpmImpressions, setCpmImpressions] = useState<number>(250000);
  // CPA
  const [cpaCost, setCpaCost] = useState<number>(8000);
  const [cpaConversions, setCpaConversions] = useState<number>(200);
  const [cpaScope, setCpaScope] = useState<CpaCostScope>('total_campaign_cost');
  // Frequency
  const [freqImpressions, setFreqImpressions] = useState<number>(180000);
  const [freqReach, setFreqReach] = useState<number>(60000);
  // Engagement Rate
  const [engInteractions, setEngInteractions] = useState<number>(720);
  const [engDenominatorVal, setEngDenominatorVal] = useState<number>(18000);
  const [engDenominatorType, setEngDenominatorType] =
    useState<EngagementDenominator>('reach');
  // Video Completion
  const [videoStarts, setVideoStarts] = useState<number>(15000);
  const [videoCompletions, setVideoCompletions] = useState<number>(6300);
  // CPL
  const [cplCost, setCplCost] = useState<number>(5000);
  const [cplLeads, setCplLeads] = useState<number>(250);
  // Conversion Rate
  const [cvrConversions, setCvrConversions] = useState<number>(180);
  const [cvrDenominatorVal, setCvrDenominatorVal] = useState<number>(6000);
  const [cvrDenominatorType, setCvrDenominatorType] =
    useState<ConversionDenominator>('sessions');
  // ROAS
  const [roasRevenue, setRoasRevenue] = useState<number>(18000);
  const [roasSpend, setRoasSpend] = useState<number>(4000);
  // ROI
  const [roiReturn, setRoiReturn] = useState<number>(36000);
  const [roiInvestment, setRoiInvestment] = useState<number>(15000);
  // CAC
  const [cacCosts, setCacCosts] = useState<number>(45000);
  const [cacCustomers, setCacCustomers] = useState<number>(150);
  // LTV
  const [ltvAov, setLtvAov] = useState<number>(40);
  const [ltvFreq, setLtvFreq] = useState<number>(8);
  const [ltvLifespan, setLtvLifespan] = useState<number>(2.5);
  const [ltvMargin, setLtvMargin] = useState<number>(70);
  // Bounce Rate
  const [bounceNonEngaged, setBounceNonEngaged] = useState<number>(3200);
  const [bounceTotal, setBounceTotal] = useState<number>(10000);
  // Email Open Rate
  const [emailOpens, setEmailOpens] = useState<number>(8400);
  const [emailDelivered, setEmailDelivered] = useState<number>(24000);
  // Email Click Rate
  const [emailClicks, setEmailClicks] = useState<number>(800);
  const [emailClickDelivered, setEmailClickDelivered] = useState<number>(20000);

  // Calculation History State
  const [savedHistory, setSavedHistory] = useState<MetricCalculationRecord[]>([]);
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');
  const [copiedResultId, setCopiedResultId] = useState<string | null>(null);

  // Knowledge Center State
  const [knowledgeSearchQuery, setKnowledgeSearchQuery] = useState<string>('');
  const [knowledgeCategory, setKnowledgeCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<MetricKnowledgeArticle | null>(null);

  // Benchmarks State
  const [benchmarkFilterMetric, setBenchmarkFilterMetric] = useState<string>('All');

  // Load initial data
  useEffect(() => {
    const list = projectService.getProjects();
    setProjects(list);
    const paramProj = searchParams.get('projectId');
    const defaultId =
      paramProj && list.some((p) => p.id === paramProj) ? paramProj : list[0]?.id || '';
    setSelectedProjectId(defaultId);

    setSavedHistory(metricsService.getSavedCalculations());

    const metricParam = searchParams.get('metric');
    if (metricParam && metricsService.getMetricDefinition(metricParam as MetricId)) {
      setActiveMetricId(metricParam as MetricId);
    }
  }, []);

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  const activeDefinition = useMemo(() => {
    return (
      metricsService.getMetricDefinition(activeMetricId) ||
      metricsService.getMetricDefinition('roas')!
    );
  }, [activeMetricId]);

  // Execute active calculation
  const activeCalculationOutcome: CalculationOutcome = useMemo(() => {
    switch (activeMetricId) {
      case 'ctr':
        return metricsService.calculateCTR(ctrClicks, ctrImpressions);
      case 'cpc':
        return metricsService.calculateCPC(cpcSpend, cpcClicks, currencySymbol);
      case 'cpm':
        return metricsService.calculateCPM(cpmSpend, cpmImpressions, currencySymbol);
      case 'cpa':
        return metricsService.calculateCPA(cpaCost, cpaConversions, cpaScope, currencySymbol);
      case 'frequency':
        return metricsService.calculateFrequency(freqImpressions, freqReach);
      case 'engagement_rate':
        return metricsService.calculateEngagementRate(
          engInteractions,
          engDenominatorVal,
          engDenominatorType
        );
      case 'video_completion':
        return metricsService.calculateVideoCompletionRate(videoStarts, videoCompletions);
      case 'cpl':
        return metricsService.calculateCPL(cplCost, cplLeads, currencySymbol);
      case 'conversion_rate':
        return metricsService.calculateConversionRate(
          cvrConversions,
          cvrDenominatorVal,
          cvrDenominatorType
        );
      case 'roas':
        return metricsService.calculateROAS(roasRevenue, roasSpend);
      case 'roi':
        return metricsService.calculateROI(roiReturn, roiInvestment);
      case 'cac':
        return metricsService.calculateCAC(cacCosts, cacCustomers, currencySymbol);
      case 'clv_ltv':
        return metricsService.calculateLTV(
          ltvAov,
          ltvFreq,
          ltvLifespan,
          ltvMargin,
          currencySymbol
        );
      case 'bounce_rate':
        return metricsService.calculateBounceRate(bounceNonEngaged, bounceTotal);
      case 'email_open_rate':
        return metricsService.calculateEmailOpenRate(emailOpens, emailDelivered);
      case 'email_click_rate':
        return metricsService.calculateEmailClickRate(emailClicks, emailClickDelivered);
      default:
        return metricsService.calculateROAS(roasRevenue, roasSpend);
    }
  }, [
    activeMetricId,
    currencySymbol,
    ctrClicks,
    ctrImpressions,
    cpcSpend,
    cpcClicks,
    cpmSpend,
    cpmImpressions,
    cpaCost,
    cpaConversions,
    cpaScope,
    freqImpressions,
    freqReach,
    engInteractions,
    engDenominatorVal,
    engDenominatorType,
    videoStarts,
    videoCompletions,
    cplCost,
    cplLeads,
    cvrConversions,
    cvrDenominatorVal,
    cvrDenominatorType,
    roasRevenue,
    roasSpend,
    roiReturn,
    roiInvestment,
    cacCosts,
    cacCustomers,
    ltvAov,
    ltvFreq,
    ltvLifespan,
    ltvMargin,
    bounceNonEngaged,
    bounceTotal,
    emailOpens,
    emailDelivered,
    emailClicks,
    emailClickDelivered,
  ]);

  // Filtered metrics list for catalog
  const filteredMetrics = useMemo(() => {
    let list = metricsService.getAllMetricDefinitions();

    if (selectedCategory !== 'All') {
      list = list.filter((m) => m.category === selectedCategory);
    }

    if (searchMetricQuery.trim()) {
      const q = searchMetricQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.shortName.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.formulaString.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCategory, searchMetricQuery]);

  // Handle Save Current Calculation
  const handleSaveCalculation = () => {
    const outcome = activeCalculationOutcome;
    let inputsObj: Record<string, number | string> = {};

    switch (activeMetricId) {
      case 'roas':
        inputsObj = { 'Attributed Revenue': roasRevenue, 'Ad Spend': roasSpend };
        break;
      case 'cpc':
        inputsObj = { 'Ad Spend': cpcSpend, Clicks: cpcClicks };
        break;
      case 'ctr':
        inputsObj = { Clicks: ctrClicks, Impressions: ctrImpressions };
        break;
      case 'cpa':
        inputsObj = { Cost: cpaCost, Conversions: cpaConversions, Scope: cpaScope };
        break;
      case 'cac':
        inputsObj = { 'Total Costs': cacCosts, 'New Customers': cacCustomers };
        break;
      case 'clv_ltv':
        inputsObj = { AOV: ltvAov, Frequency: ltvFreq, Lifespan: ltvLifespan, Margin: ltvMargin };
        break;
      case 'conversion_rate':
        inputsObj = {
          Conversions: cvrConversions,
          Denominator: cvrDenominatorVal,
          Type: cvrDenominatorType,
        };
        break;
      default:
        inputsObj = { 'Calculated Metric': activeDefinition.shortName };
    }

    metricsService.saveCalculation({
      metricId: activeMetricId,
      metricName: activeDefinition.name,
      category: activeDefinition.category,
      inputs: inputsObj,
      resultValue: outcome.value,
      formattedResult: outcome.formatted,
      unit: outcome.unit,
      currency: currencySymbol,
      projectId: activeProject?.id,
      projectName: activeProject?.business?.brandName || activeProject?.id,
      isZeroDenominator: outcome.isZeroDenominator,
      status: outcome.status,
      notes: `Saved calculation for ${activeDefinition.shortName}`,
    });

    setSavedHistory(metricsService.getSavedCalculations());
    addToast({
      type: 'success',
      title: 'Calculation Saved',
      message: `${activeDefinition.shortName} (${outcome.formatted}) saved to project audit trail.`,
    });
  };

  // Copy Result
  const handleCopyResult = () => {
    navigator.clipboard.writeText(
      `${activeDefinition.name}: ${activeCalculationOutcome.formatted}`
    );
    setCopiedResultId('active');
    setTimeout(() => setCopiedResultId(null), 2500);
    addToast({
      type: 'success',
      title: 'Copied',
      message: `${activeDefinition.shortName} result copied to clipboard.`,
    });
  };

  // Reset active inputs
  const handleResetInputs = () => {
    switch (activeMetricId) {
      case 'ctr':
        setCtrClicks(100);
        setCtrImpressions(5000);
        break;
      case 'cpc':
        setCpcSpend(500);
        setCpcClicks(250);
        break;
      case 'cpm':
        setCpmSpend(1000);
        setCpmImpressions(50000);
        break;
      case 'cpa':
        setCpaCost(2000);
        setCpaConversions(50);
        break;
      case 'roas':
        setRoasRevenue(10000);
        setRoasSpend(2500);
        break;
      case 'roi':
        setRoiReturn(20000);
        setRoiInvestment(10000);
        break;
      case 'cac':
        setCacCosts(15000);
        setCacCustomers(50);
        break;
      case 'clv_ltv':
        setLtvAov(50);
        setLtvFreq(4);
        setLtvLifespan(2);
        setLtvMargin(65);
        break;
      case 'bounce_rate':
        setBounceNonEngaged(1500);
        setBounceTotal(5000);
        break;
      default:
        break;
    }
    addToast({
      type: 'info',
      title: 'Calculator Reset',
      message: `Inputs for ${activeDefinition.shortName} reset to default template.`,
    });
  };

  // Delete saved calculation
  const handleDeleteCalculation = (id: string) => {
    metricsService.deleteCalculation(id);
    setSavedHistory(metricsService.getSavedCalculations());
    addToast({
      type: 'info',
      title: 'Record Deleted',
      message: 'Calculation record removed from history.',
    });
  };

  // Clear all history
  const handleClearAllHistory = () => {
    if (confirm('Are you sure you want to clear your calculation history?')) {
      metricsService.clearAllCalculations();
      setSavedHistory([]);
      addToast({
        type: 'info',
        title: 'History Cleared',
        message: 'All calculation records deleted.',
      });
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const csv = metricsService.exportCalculationsCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sparkline-metrics-history-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: 'Calculation history downloaded.',
    });
  };

  // Filtered Articles for Knowledge Center
  const filteredArticles = useMemo(() => {
    return metricsService.getKnowledgeArticles(knowledgeSearchQuery, knowledgeCategory);
  }, [knowledgeSearchQuery, knowledgeCategory]);

  // Filtered Calculation History
  const filteredHistory = useMemo(() => {
    if (!historySearchQuery.trim()) return savedHistory;
    const q = historySearchQuery.toLowerCase().trim();
    return savedHistory.filter(
      (h) =>
        h.metricName.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q) ||
        (h.projectName && h.projectName.toLowerCase().includes(q)) ||
        h.formattedResult.toLowerCase().includes(q)
    );
  }, [savedHistory, historySearchQuery]);

  // Filtered Benchmarks
  const filteredBenchmarks = useMemo(() => {
    if (benchmarkFilterMetric === 'All') {
      return metricsService.getVerifiedBenchmarks();
    }
    return metricsService.getVerifiedBenchmarks(benchmarkFilterMetric as MetricId);
  }, [benchmarkFilterMetric]);

  return (
    <>
      <SEO
        title="Marketing Metrics & Intelligence Center — Sparkline Marketing"
        description="Calculate, evaluate, and benchmark essential advertising, social, revenue, and website performance metrics with mathematical precision."
      />

      <div className="space-y-8 pb-16">
        {/* ========================================================================= */}
        {/* TOP COMMAND HEADER */}
        {/* ========================================================================= */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="blue" className="px-2.5 py-0.5">
                <BarChart3 className="w-3 h-3 mr-1" />
                Performance Measurement Core
              </Badge>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                16 Verified Calculators • GA4 Compliant
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight font-display">
              Marketing Metrics & Intelligence
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Understand your unit economics, evaluate campaign efficiency, and eliminate
              wasted spend with verified mathematical formulas.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Active Project Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <span className="text-xs font-semibold text-slate-500">Project:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-transparent text-xs font-bold text-sparkline-midnight focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.business?.brandName || p.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <span className="text-xs font-semibold text-slate-500">Currency:</span>
              <select
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="bg-transparent text-xs font-bold text-sparkline-midnight focus:outline-none"
              >
                <option value="$">$ (USD/CAD/AUD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
                <option value="Rs">Rs (PKR/INR)</option>
                <option value="AED">AED</option>
                <option value="SAR">SAR</option>
                <option value="¥">¥ (JPY/CNY)</option>
              </select>
            </div>

            <Link to="/dashboard/currency">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                <span>Multi-FX</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              disabled={savedHistory.length === 0}
              className="gap-1.5 text-xs"
              title="Export saved calculation history as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN NAVIGATION TABS */}
        {/* ========================================================================= */}
        <div className="border-b border-slate-200 flex flex-wrap gap-2 text-sm">
          <button
            type="button"
            onClick={() => setActiveMainTab('calculators')}
            className={`pb-3 px-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeMainTab === 'calculators'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Interactive Calculators (16)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('knowledge')}
            className={`pb-3 px-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeMainTab === 'knowledge'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Knowledge Center</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('benchmarks')}
            className={`pb-3 px-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeMainTab === 'benchmarks'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Verified Benchmarks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('history')}
            className={`pb-3 px-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeMainTab === 'history'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calculation Audit Trail ({savedHistory.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: INTERACTIVE CALCULATORS & CATALOG */}
        {/* ========================================================================= */}
        {activeMainTab === 'calculators' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick Calculator Shortcut Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                Popular Shortcuts:
              </span>
              {[
                { id: 'roas', label: 'ROAS (Return on Ad Spend)' },
                { id: 'cac', label: 'CAC (Customer Acquisition Cost)' },
                { id: 'ctr', label: 'CTR (Click-Through Rate)' },
                { id: 'cpc', label: 'CPC (Cost Per Click)' },
                { id: 'clv_ltv', label: 'LTV (Lifetime Value)' },
                { id: 'cpa', label: 'CPA (Cost Per Acquisition)' },
                { id: 'conversion_rate', label: 'CVR (Conversion Rate)' },
                { id: 'bounce_rate', label: 'GA4 Bounce Rate' },
              ].map((shortcut) => (
                <button
                  key={shortcut.id}
                  type="button"
                  onClick={() => setActiveMetricId(shortcut.id as MetricId)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    activeMetricId === shortcut.id
                      ? 'bg-sparkline-blue text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {shortcut.label}
                </button>
              ))}
            </div>

            {/* Active Calculator Workspace Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Calculator Inputs */}
              <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sparkline-blue">
                      {activeDefinition.category}
                    </span>
                    <h2 className="text-lg font-bold text-sparkline-midnight">
                      {activeDefinition.name}
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                    {activeDefinition.formulaString}
                  </span>
                </div>

                {/* Input Fields specific to active metric */}
                <div className="space-y-4">
                  {/* CTR Inputs */}
                  {activeMetricId === 'ctr' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Ad Clicks
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={ctrClicks}
                          onChange={(e) => setCtrClicks(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Ad Impressions
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={ctrImpressions}
                          onChange={(e) => setCtrImpressions(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                    </>
                  )}

                  {/* CPC Inputs */}
                  {activeMetricId === 'cpc' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Advertising Spend ({currencySymbol})
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cpcSpend}
                          onChange={(e) => setCpcSpend(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Ad Clicks
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cpcClicks}
                          onChange={(e) => setCpcClicks(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                    </>
                  )}

                  {/* CPM Inputs */}
                  {activeMetricId === 'cpm' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Advertising Spend ({currencySymbol})
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cpmSpend}
                          onChange={(e) => setCpmSpend(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Total Impressions
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cpmImpressions}
                          onChange={(e) => setCpmImpressions(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                    </>
                  )}

                  {/* CPA Inputs */}
                  {activeMetricId === 'cpa' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Cost Basis Scope
                        </label>
                        <select
                          value={cpaScope}
                          onChange={(e) => setCpaScope(e.target.value as CpaCostScope)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-sparkline-midnight"
                        >
                          <option value="total_campaign_cost">
                            Total Campaign Cost (Media + Creative + Tools)
                          </option>
                          <option value="ad_spend_only">Advertising Media Spend Only</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          {cpaScope === 'ad_spend_only'
                            ? 'Direct Media Ad Spend'
                            : 'Total Campaign Cost'}{' '}
                          ({currencySymbol})
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cpaCost}
                          onChange={(e) => setCpaCost(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Target Acquisitions / Paying Customers
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cpaConversions}
                          onChange={(e) => setCpaConversions(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                    </>
                  )}

                  {/* Frequency Inputs */}
                  {activeMetricId === 'frequency' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Total Ad Impressions (All View Events)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={freqImpressions}
                          onChange={(e) => setFreqImpressions(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Unique Reach (Individual Humans Reached)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={freqReach}
                          onChange={(e) => setFreqReach(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div className="p-3 bg-blue-50/60 rounded-xl text-xs text-slate-600 leading-relaxed">
                        <strong>Reach vs. Impressions:</strong> <em>Reach</em> counts unique people
                        once. <em>Impressions</em> count every display. Frequency shows how many
                        times on average one person was exposed to your ad.
                      </div>
                    </>
                  )}

                  {/* Engagement Rate Inputs */}
                  {activeMetricId === 'engagement_rate' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Calculation Denominator Basis
                        </label>
                        <select
                          value={engDenominatorType}
                          onChange={(e) =>
                            setEngDenominatorType(e.target.value as EngagementDenominator)
                          }
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-sparkline-midnight"
                        >
                          <option value="reach">Engagement by Reach (Recommended)</option>
                          <option value="followers">Engagement by Total Followers</option>
                          <option value="impressions">Engagement by Total Impressions</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Total Interactions (Likes + Comments + Shares + Saves)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={engInteractions}
                          onChange={(e) => setEngInteractions(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Selected Denominator Count ({engDenominatorType})
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={engDenominatorVal}
                          onChange={(e) => setEngDenominatorVal(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                    </>
                  )}

                  {/* Video Completion Inputs */}
                  {activeMetricId === 'video_completion' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Total Video Starts
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={videoStarts}
                          onChange={(e) => setVideoStarts(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Completed Video Views (100% Watched)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={videoCompletions}
                          onChange={(e) => setVideoCompletions(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                    </>
                  )}

                  {/* CPL Inputs */}
                  {activeMetricId === 'cpl' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Total Marketing Lead Generation Cost ({currencySymbol})
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cplCost}
                          onChange={(e) => setCplCost(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Total Leads Captured
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cplLeads}
                          onChange={(e) => setCplLeads(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                    </>
                  )}

                  {/* Conversion Rate Inputs */}
                  {activeMetricId === 'conversion_rate' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Traffic Denominator Type
                        </label>
                        <select
                          value={cvrDenominatorType}
                          onChange={(e) =>
                            setCvrDenominatorType(e.target.value as ConversionDenominator)
                          }
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-sparkline-midnight"
                        >
                          <option value="sessions">Total Website Sessions (Recommended)</option>
                          <option value="visitors">Unique Visitors</option>
                          <option value="clicks">Ad Clicks</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Completed Conversions (Orders / Leads)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cvrConversions}
                          onChange={(e) => setCvrConversions(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Total {cvrDenominatorType}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cvrDenominatorVal}
                          onChange={(e) => setCvrDenominatorVal(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                    </>
                  )}

                  {/* ROAS Inputs */}
                  {activeMetricId === 'roas' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Attributed Ad Revenue ({currencySymbol})
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={roasRevenue}
                          onChange={(e) => setRoasRevenue(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Direct Advertising Media Spend ({currencySymbol})
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={roasSpend}
                          onChange={(e) => setRoasSpend(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                    </>
                  )}

                  {/* ROI Inputs */}
                  {activeMetricId === 'roi' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Total Net Commercial Return / Revenue ({currencySymbol})
                        </label>
                        <input
                          type="number"
                          value={roiReturn}
                          onChange={(e) => setRoiReturn(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Total Marketing Capital Invested ({currencySymbol})
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={roiInvestment}
                          onChange={(e) => setRoiInvestment(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                    </>
                  )}

                  {/* CAC Inputs */}
                  {activeMetricId === 'cac' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Total Acquisition Spend (Media, Sales Team, Agency, Tools) (
                          {currencySymbol})
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cacCosts}
                          onChange={(e) => setCacCosts(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          New Paying Customers Acquired
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cacCustomers}
                          onChange={(e) => setCacCustomers(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                    </>
                  )}

                  {/* LTV Inputs */}
                  {activeMetricId === 'clv_ltv' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Average Order Value ({currencySymbol})
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={ltvAov}
                            onChange={(e) => setLtvAov(Number(e.target.value))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Purchase Frequency / Year
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={ltvFreq}
                            onChange={(e) => setLtvFreq(Number(e.target.value))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold font-mono"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Customer Lifespan (Years)
                          </label>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            value={ltvLifespan}
                            onChange={(e) => setLtvLifespan(Number(e.target.value))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Gross Margin % (Optional)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={ltvMargin}
                            onChange={(e) => setLtvMargin(Number(e.target.value))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold font-mono"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Bounce Rate Inputs */}
                  {activeMetricId === 'bounce_rate' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Non-Engaged Sessions (GA4)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={bounceNonEngaged}
                          onChange={(e) => setBounceNonEngaged(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Total Website Sessions
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={bounceTotal}
                          onChange={(e) => setBounceTotal(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                        <strong>GA4 Compliance:</strong> In GA4, an engaged session lasted 10+
                        seconds, had 2+ page views, or had a conversion event. Bounce rate is simply
                        the percentage of sessions that were <em>not</em> engaged.
                      </div>
                    </>
                  )}

                  {/* Email Open Rate Inputs */}
                  {activeMetricId === 'email_open_rate' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Unique Opens
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={emailOpens}
                          onChange={(e) => setEmailOpens(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Delivered Messages
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={emailDelivered}
                          onChange={(e) => setEmailDelivered(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div className="p-3 bg-blue-50/70 rounded-xl text-xs text-slate-600 leading-relaxed">
                        <strong>Privacy Notice:</strong> Apple Mail Privacy Protection (MPP) caches
                        images and inflates open rates. Always review Click-to-Delivered rates
                        alongside opens.
                      </div>
                    </>
                  )}

                  {/* Email Click Rate Inputs */}
                  {activeMetricId === 'email_click_rate' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Unique Clicks
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={emailClicks}
                          onChange={(e) => setEmailClicks(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Delivered Messages
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={emailClickDelivered}
                          onChange={(e) => setEmailClickDelivered(Number(e.target.value))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Calculator Control Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveCalculation}
                      disabled={activeCalculationOutcome.status !== 'valid'}
                      className="gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Save Calculation</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyResult}
                      disabled={activeCalculationOutcome.status !== 'valid'}
                      className="gap-1.5"
                    >
                      {copiedResultId === 'active' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-500" />
                      )}
                      <span>Copy</span>
                    </Button>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetInputs}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Prominent Result & Interpretation */}
              <div className="lg:col-span-6 flex flex-col justify-between bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Calculation Result
                    </span>
                    <Badge variant="blue" className="text-xs">
                      {activeDefinition.shortName}
                    </Badge>
                  </div>

                  {/* Result Display Box */}
                  <div className="my-6">
                    {activeCalculationOutcome.status !== 'valid' ? (
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-sm">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span>{activeCalculationOutcome.formatted}</span>
                        </div>
                        <p className="text-xs text-amber-800 leading-relaxed">
                          {activeCalculationOutcome.errorReason}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-semibold uppercase">
                          Computed Metric
                        </span>
                        <div className="text-4xl sm:text-5xl font-extrabold font-mono text-sparkline-midnight tracking-tight">
                          {activeCalculationOutcome.formatted}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pt-1">
                          {activeCalculationOutcome.interpretation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Step-by-Step Worked Example */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                    <div className="font-bold text-sparkline-midnight flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-sparkline-blue" />
                        <span>Worked Example Scenario</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Reference Blueprint
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed italic">
                      &quot;{activeDefinition.workedExample.scenario}&quot;
                    </p>
                    <div className="space-y-1 pt-1 font-mono text-[11px] text-slate-700">
                      {activeDefinition.workedExample.calculationSteps.map((step, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-sparkline-blue font-bold">Step {i + 1}:</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                      <strong>Benchmark Takeaway:</strong>{' '}
                      {activeDefinition.workedExample.interpretation}
                    </div>
                  </div>
                </div>

                {/* Practical Improvement Advice */}
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700 space-y-2">
                  <div className="font-bold text-sparkline-blue flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>How to Improve This Metric</span>
                  </div>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    {activeDefinition.improvementTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Metrics Directory / Catalog Grid */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-sparkline-midnight">
                    Searchable Metrics Library (16 Calculators)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Browse all verified marketing metrics or filter by operational category.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchMetricQuery}
                    onChange={(e) => setSearchMetricQuery(e.target.value)}
                    placeholder="Search by name, formula, or KPI..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-sparkline-midnight focus:outline-none focus:ring-1 focus:ring-sparkline-blue"
                  />
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {['All', ...METRIC_CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-sparkline-midnight text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {filteredMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    onClick={() => {
                      setActiveMetricId(metric.id);
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      activeMetricId === metric.id
                        ? 'bg-blue-50/70 border-sparkline-blue shadow-sm ring-1 ring-sparkline-blue/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-card'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-sparkline-midnight">
                          {metric.shortName}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                          {metric.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-sparkline-midnight line-clamp-1">
                        {metric.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {metric.description}
                      </p>
                      <div className="text-[11px] font-mono text-sparkline-blue bg-white p-1.5 rounded border border-slate-100 truncate">
                        {metric.formulaString}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sparkline-blue">
                      <span>Open Calculator</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: KNOWLEDGE CENTER & ARTICLES */}
        {/* ========================================================================= */}
        {activeMainTab === 'knowledge' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight">
                  Marketing Knowledge & Measurement Playbooks
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Educational guides covering paid advertising, social media metrics, GA4
                  measurement, and e-commerce unit economics.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={knowledgeSearchQuery}
                  onChange={(e) => setKnowledgeSearchQuery(e.target.value)}
                  placeholder="Search marketing articles..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-sparkline-midnight focus:outline-none"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {[
                'All',
                'Marketing Fundamentals',
                'Paid Advertising',
                'Social Media',
                'SEO',
                'Email Marketing',
                'E-commerce',
                'Marketing Analytics',
                'Conversion Optimization',
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setKnowledgeCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    knowledgeCategory === cat
                      ? 'bg-sparkline-midnight text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-sparkline-blue'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card flex flex-col justify-between space-y-4 hover:border-sparkline-blue transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-sparkline-blue bg-blue-50 px-2 py-0.5 rounded-full text-[10px]">
                        {art.category}
                      </span>
                      <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                        <Clock className="w-3 h-3" />
                        <span>{art.readTimeMinutes} min read</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-sparkline-midnight leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {art.shortDescription}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {art.relatedCalculators.map((calcId) => (
                        <button
                          key={calcId}
                          type="button"
                          onClick={() => {
                            setActiveMetricId(calcId);
                            setActiveMainTab('calculators');
                          }}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 hover:bg-sparkline-blue hover:text-white transition-colors text-slate-600"
                        >
                          calc: {calcId.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedArticle(art)}
                    className="w-full gap-1.5 justify-center text-xs"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Article Reader Modal */}
            {selectedArticle && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-sparkline-blue uppercase tracking-wider">
                        {selectedArticle.category} • {selectedArticle.difficulty} •{' '}
                        {selectedArticle.readTimeMinutes} min read
                      </span>
                      <h2 className="text-xl font-bold text-sparkline-midnight">
                        {selectedArticle.title}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedArticle(null)}
                      className="text-slate-400 hover:text-slate-600 p-2"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Article Markdown-like text */}
                  <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
                    {selectedArticle.content}
                  </div>

                  {/* Practical Tips Box */}
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
                    <div className="font-bold text-sparkline-blue flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Actionable Tips for Your Campaigns</span>
                    </div>
                    <ul className="space-y-1 text-slate-600">
                      {selectedArticle.practicalTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="font-bold text-sparkline-blue">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedArticle(null)}
                    >
                      Done Reading
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: VERIFIED BENCHMARKS */}
        {/* ========================================================================= */}
        {activeMainTab === 'benchmarks' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight">
                  Verified Industry Reference Benchmarks
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Published multi-industry reference standards. All figures cite exact research
                  methodologies, sample sizes, and publication dates.
                </p>
              </div>

              {/* Metric Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Filter Metric:</span>
                <select
                  value={benchmarkFilterMetric}
                  onChange={(e) => setBenchmarkFilterMetric(e.target.value)}
                  className="text-xs font-semibold text-sparkline-midnight bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                >
                  <option value="All">All Metrics</option>
                  <option value="cpc">CPC (Cost Per Click)</option>
                  <option value="ctr">CTR (Click-Through Rate)</option>
                  <option value="cpm">CPM (Cost Per Mille)</option>
                  <option value="conversion_rate">Conversion Rate</option>
                  <option value="email_open_rate">Email Open Rate</option>
                </select>
              </div>
            </div>

            {/* Benchmarks Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBenchmarks.map((bench) => (
                <div
                  key={bench.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sparkline-blue">
                        {bench.platform} • {bench.region}
                      </span>
                      <h3 className="text-base font-bold text-sparkline-midnight">
                        {bench.metricName} ({bench.industry})
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold bg-blue-50 text-sparkline-blue px-2.5 py-1 rounded-full">
                      Avg: {bench.averageValue}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Typical Low Range
                      </span>
                      <span className="text-sm font-bold font-mono text-sparkline-midnight">
                        {bench.rangeLow}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        High Competitive Range
                      </span>
                      <span className="text-sm font-bold font-mono text-sparkline-midnight">
                        {bench.rangeHigh}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="leading-relaxed">
                      <strong>Methodology:</strong> {bench.methodology}
                    </p>
                    <p className="leading-relaxed text-[11px] text-slate-500">
                      <strong>Contextual Note:</strong> {bench.notes}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Source: {bench.source}</span>
                    <a
                      href={bench.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sparkline-blue font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Study Citation</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Benchmark Source Policy Disclaimer */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-1.5">
              <span className="font-bold text-sparkline-midnight flex items-center gap-1.5">
                <Info className="w-4 h-4 text-sparkline-blue" />
                <span>Benchmark Data Grounding Notice</span>
              </span>
              <p>
                Industry averages vary significantly by seasonal ad auction density, creative
                quality, and geographic purchasing power. Sparkline displays published third-party
                reference data with verified sources. If your ad account is not connected, use your
                own historical project data as the primary benchmark.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CALCULATION AUDIT TRAIL & HISTORY */}
        {/* ========================================================================= */}
        {activeMainTab === 'history' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight">
                  Calculation Audit Trail & Saved Records
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Saved calculations associated with your marketing projects, preserving exact
                  inputs, timestamps, and currency standards.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder="Search history records..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-sparkline-midnight focus:outline-none"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  disabled={savedHistory.length === 0}
                  className="gap-1.5"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Export CSV</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAllHistory}
                  disabled={savedHistory.length === 0}
                  className="gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </Button>
              </div>
            </div>

            {savedHistory.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-sparkline-midnight">
                  No Saved Calculations Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Perform any metric calculation in the Calculators tab and click &quot;Save
                  Calculation&quot; to log it to your project audit trail.
                </p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-2">
                <p className="text-sm font-semibold text-sparkline-midnight">No matching calculation records</p>
                <p className="text-xs text-slate-500">Try modifying your search query &quot;{historySearchQuery}&quot;.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <th className="px-5 py-3.5">Timestamp</th>
                        <th className="px-5 py-3.5">Metric & Category</th>
                        <th className="px-5 py-3.5">Result</th>
                        <th className="px-5 py-3.5">Project Scope</th>
                        <th className="px-5 py-3.5">Input Parameters</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                            {new Date(item.timestamp).toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-sparkline-midnight block">
                              {item.metricName}
                            </span>
                            <span className="text-[10px] text-slate-400">{item.category}</span>
                          </td>
                          <td className="px-5 py-3.5 font-mono font-bold text-sparkline-blue text-sm">
                            {item.formattedResult}
                          </td>
                          <td className="px-5 py-3.5 font-medium text-slate-700">
                            {item.projectName || 'General Workspace'}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500 max-w-xs truncate">
                            {JSON.stringify(item.inputs).replace(/[{}"]/g, ' ')}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteCalculation(item.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
