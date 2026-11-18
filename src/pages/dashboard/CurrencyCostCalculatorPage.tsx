import React, { useState, useEffect, useMemo } from 'react';
import { SEO } from '@/components/common/SEO';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/components/common/Feedback';
import {
  currencyService,
  SUPPORTED_CURRENCIES,
  INSTITUTIONAL_REFERENCE_RATES,
} from '@/services/currency.service';
import { budgetService } from '@/services/budget.service';
import {
  CurrencyCode,
  ExchangeRateTable,
  CurrencyConversion,
  AdvertisingCostComparison,
  MarketingExpenseItem,
  MarketingExpenseCategory,
  MarketingMetricType,
  BudgetPlanImportResult,
} from '@/types/currency';
import { MarketingBudgetPlan } from '@/types/budget';
import {
  ArrowLeftRight,
  Copy,
  Check,
  Download,
  Trash2,
  Plus,
  Calculator,
  Globe,
  Layers,
  AlertCircle,
  Calendar,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Scale,
  Receipt,
} from 'lucide-react';

const EXPENSE_CATEGORIES: MarketingExpenseCategory[] = [
  'Advertising Spend',
  'Creative Production',
  'Graphic Design',
  'Video Editing',
  'Content Writing',
  'Influencer Collaborations',
  'Software Subscriptions',
  'Agency Fees',
  'Freelancer Costs',
  'Other Marketing Expenses',
];

export const CurrencyCostCalculatorPage: React.FC = () => {
  const { addToast } = useToast();

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'converter' | 'metrics' | 'ad_comparison' | 'expenses' | 'budget_integration' | 'history'
  >('converter');

  // Rate table state
  const [rateTable, setRateTable] = useState<ExchangeRateTable>({
    baseCurrency: 'USD',
    rates: INSTITUTIONAL_REFERENCE_RATES,
    provider: 'ECB & Institutional Reference Baseline',
    lastUpdated: new Date().toISOString(),
    rateType: 'reference',
    dataAvailability: 'available',
  });
  const [isRefreshingRates, setIsRefreshingRates] = useState<boolean>(false);

  // Currency Converter State
  const [converterAmount, setConverterAmount] = useState<number>(1000);
  const [sourceCurrency, setSourceCurrency] = useState<CurrencyCode>('USD');
  const [targetCurrency, setTargetCurrency] = useState<CurrencyCode>('PKR');
  const [converterLabel, setConverterLabel] = useState<string>('');
  const [copiedConverted, setCopiedConverted] = useState<boolean>(false);

  // History State
  const [savedConversions, setSavedConversions] = useState<CurrencyConversion[]>([]);

  // Metric Calculators State
  const [activeMetric, setActiveMetric] = useState<MarketingMetricType>('CPC');
  const [metricCurrency, setMetricCurrency] = useState<CurrencyCode>('USD');
  // Metric Inputs
  const [cpcSpend, setCpcSpend] = useState<number>(1500);
  const [cpcClicks, setCpcClicks] = useState<number>(850);
  const [cpmSpend, setCpmSpend] = useState<number>(2000);
  const [cpmImpressions, setCpmImpressions] = useState<number>(125000);
  const [cpaCost, setCpaCost] = useState<number>(4500);
  const [cpaAcquisitions, setCpaAcquisitions] = useState<number>(120);
  const [cplCost, setCplCost] = useState<number>(3200);
  const [cplLeads, setCplLeads] = useState<number>(160);
  const [ctrClicks, setCtrClicks] = useState<number>(1200);
  const [ctrImpressions, setCtrImpressions] = useState<number>(48000);
  const [cvrConversions, setCvrConversions] = useState<number>(85);
  const [cvrClicks, setCvrClicks] = useState<number>(2500);
  const [roasRevenue, setRoasRevenue] = useState<number>(18500);
  const [roasSpend, setRoasSpend] = useState<number>(4200);
  const [roiReturn, setRoiReturn] = useState<number>(28000);
  const [roiInvestment, setRoiInvestment] = useState<number>(12000);

  // Advertising Comparison State
  const [adComparisons, setAdComparisons] = useState<AdvertisingCostComparison[]>([]);
  const [comparisonTargetCurrency, setComparisonTargetCurrency] = useState<CurrencyCode>('USD');
  const [showAddComparisonModal, setShowAddComparisonModal] = useState<boolean>(false);
  const [newCompMarket, setNewCompMarket] = useState<string>('');
  const [newCompCurrency, setNewCompCurrency] = useState<CurrencyCode>('USD');
  const [newCompCpc, setNewCompCpc] = useState<number>(1.5);
  const [newCompCpm, setNewCompCpm] = useState<number>(18.0);
  const [newCompCpa, setNewCompCpa] = useState<number>(30.0);
  const [newCompBudget, setNewCompBudget] = useState<number>(2500);
  const [newCompPeriod, setNewCompPeriod] = useState<string>('Monthly');

  // Expense Calculator State
  const [expenseItems, setExpenseItems] = useState<MarketingExpenseItem[]>([]);
  const [expenseDisplayCurrency, setExpenseDisplayCurrency] = useState<CurrencyCode>('USD');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false);
  const [newExpName, setNewExpName] = useState<string>('');
  const [newExpCategory, setNewExpCategory] = useState<MarketingExpenseCategory>('Advertising Spend');
  const [newExpCurrency, setNewExpCurrency] = useState<CurrencyCode>('USD');
  const [newExpEstimated, setNewExpEstimated] = useState<number>(500);
  const [newExpActual, setNewExpActual] = useState<number>(480);
  const [newExpFreq, setNewExpFreq] = useState<'Monthly' | 'Campaign' | 'One-Time'>('Monthly');

  // Budget Planner Integration State
  const [budgetPlans, setBudgetPlans] = useState<MarketingBudgetPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [budgetIntegrationTargetCurrency, setBudgetIntegrationTargetCurrency] =
    useState<CurrencyCode>('EUR');
  const [importedBudgetResult, setImportedBudgetResult] =
    useState<BudgetPlanImportResult | null>(null);

  // Initialize data on mount
  useEffect(() => {
    loadExchangeRates();
    setSavedConversions(currencyService.getSavedConversions());
    setAdComparisons(currencyService.getAdComparisons());
    setExpenseItems(currencyService.getExpenseItems());

    const plans = budgetService.getPlans();
    setBudgetPlans(plans);
    if (plans.length > 0 && plans[0]) {
      setSelectedPlanId(plans[0].id);
    }
  }, []);

  // Update budget import when plan or target currency changes
  useEffect(() => {
    if (selectedPlanId) {
      const result = currencyService.importBudgetPlan(
        selectedPlanId,
        budgetIntegrationTargetCurrency,
        rateTable
      );
      setImportedBudgetResult(result);
    }
  }, [selectedPlanId, budgetIntegrationTargetCurrency, rateTable]);

  // Load exchange rates
  const loadExchangeRates = async () => {
    setIsRefreshingRates(true);
    try {
      const table = await currencyService.getExchangeRates();
      setRateTable(table);
    } catch (e) {
      // Fallback already handled inside currencyService
    } finally {
      setIsRefreshingRates(false);
    }
  };

  const handleRefreshRates = async () => {
    await loadExchangeRates();
    addToast({
      type: 'success',
      title: 'Rates Updated',
      message: `Exchange rates refreshed from ${rateTable.provider}.`,
    });
  };

  // Currency Converter calculation
  const convertedInfo = useMemo(() => {
    return currencyService.convertAmount(
      converterAmount,
      sourceCurrency,
      targetCurrency,
      rateTable
    );
  }, [converterAmount, sourceCurrency, targetCurrency, rateTable]);

  const inverseRate = useMemo(() => {
    return currencyService.getExchangeRate(targetCurrency, sourceCurrency, rateTable);
  }, [sourceCurrency, targetCurrency, rateTable]);

  const sourceMeta = useMemo(() => {
    return currencyService.getCurrencyMetadata(sourceCurrency);
  }, [sourceCurrency]);

  const targetMeta = useMemo(() => {
    return currencyService.getCurrencyMetadata(targetCurrency);
  }, [targetCurrency]);

  // Swap currencies
  const handleSwapCurrencies = () => {
    const prevSource = sourceCurrency;
    setSourceCurrency(targetCurrency);
    setTargetCurrency(prevSource);
  };

  // Copy converted amount
  const handleCopyConverted = () => {
    navigator.clipboard.writeText(convertedInfo.formatted);
    setCopiedConverted(true);
    setTimeout(() => setCopiedConverted(false), 2500);
    addToast({
      type: 'success',
      title: 'Copied',
      message: `${convertedInfo.formatted} copied to clipboard.`,
    });
  };

  // Save current conversion
  const handleSaveConversion = () => {
    currencyService.saveConversion({
      sourceAmount: converterAmount,
      sourceCurrency,
      targetAmount: convertedInfo.convertedAmount,
      targetCurrency,
      exchangeRate: convertedInfo.rate,
      provider: rateTable.provider,
      rateType: rateTable.rateType,
      label: converterLabel.trim() || undefined,
    });

    setSavedConversions(currencyService.getSavedConversions());
    setConverterLabel('');
    addToast({
      type: 'success',
      title: 'Conversion Saved',
      message: `Saved ${sourceMeta.symbol}${converterAmount} -> ${targetMeta.symbol}${convertedInfo.convertedAmount} to history.`,
    });
  };

  // Delete saved conversion
  const handleDeleteConversion = (id: string) => {
    currencyService.deleteConversion(id);
    setSavedConversions(currencyService.getSavedConversions());
    addToast({
      type: 'info',
      title: 'Record Removed',
      message: 'Conversion record deleted from history.',
    });
  };

  // Clear all conversions
  const handleClearAllConversions = () => {
    if (confirm('Are you sure you want to clear your entire conversion history?')) {
      currencyService.clearAllConversions();
      setSavedConversions([]);
      addToast({
        type: 'info',
        title: 'History Cleared',
        message: 'All conversion history has been cleared.',
      });
    }
  };

  // Export conversions
  const handleExportCsv = () => {
    const csvContent = currencyService.exportConversionsCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sparkline-currency-history-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: 'Currency conversion history exported as CSV.',
    });
  };

  // Add Ad Comparison
  const handleAddComparisonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompMarket.trim()) {
      addToast({
        type: 'warning',
        title: 'Missing Market',
        message: 'Please provide a platform or country market name.',
      });
      return;
    }

    const rate = currencyService.getExchangeRate(
      newCompCurrency,
      comparisonTargetCurrency,
      rateTable
    );

    const newItem: AdvertisingCostComparison = {
      id: `comp-${Date.now()}`,
      platformOrMarket: newCompMarket.trim(),
      currency: newCompCurrency,
      targetCurrency: comparisonTargetCurrency,
      cpc: newCompCpc,
      cpm: newCompCpm,
      cpa: newCompCpa,
      budget: newCompBudget,
      convertedCpc: Number((newCompCpc * rate).toFixed(2)),
      convertedCpm: Number((newCompCpm * rate).toFixed(2)),
      convertedCpa: Number((newCompCpa * rate).toFixed(2)),
      convertedBudget: Number((newCompBudget * rate).toFixed(2)),
      rateUsed: rate,
      timePeriod: newCompPeriod,
      timestamp: new Date().toISOString(),
    };

    currencyService.saveAdComparison(newItem);
    setAdComparisons(currencyService.getAdComparisons());
    setShowAddComparisonModal(false);
    setNewCompMarket('');
    addToast({
      type: 'success',
      title: 'Comparison Added',
      message: `Added benchmark entry for ${newItem.platformOrMarket}.`,
    });
  };

  // Delete Ad Comparison
  const handleDeleteComparison = (id: string) => {
    currencyService.deleteAdComparison(id);
    setAdComparisons(currencyService.getAdComparisons());
    addToast({
      type: 'info',
      title: 'Comparison Deleted',
      message: 'Ad comparison entry removed.',
    });
  };

  // Add Expense Item
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpName.trim()) {
      addToast({
        type: 'warning',
        title: 'Name Required',
        message: 'Please provide an expense line item description.',
      });
      return;
    }

    const rate = currencyService.getExchangeRate(
      newExpCurrency,
      expenseDisplayCurrency,
      rateTable
    );

    const item = currencyService.addExpenseItem({
      name: newExpName.trim(),
      category: newExpCategory,
      currency: newExpCurrency,
      estimatedAmount: newExpEstimated,
      actualAmount: newExpActual > 0 ? newExpActual : undefined,
      convertedEstimate: Number((newExpEstimated * rate).toFixed(2)),
      convertedActual: newExpActual > 0 ? Number((newExpActual * rate).toFixed(2)) : undefined,
      frequency: newExpFreq,
    });

    setExpenseItems(currencyService.getExpenseItems());
    setShowAddExpenseModal(false);
    setNewExpName('');
    addToast({
      type: 'success',
      title: 'Expense Added',
      message: `Added "${item.name}" to marketing expenses.`,
    });
  };

  // Delete Expense Item
  const handleDeleteExpense = (id: string) => {
    currencyService.deleteExpenseItem(id);
    setExpenseItems(currencyService.getExpenseItems());
    addToast({
      type: 'info',
      title: 'Expense Removed',
      message: 'Marketing expense item deleted.',
    });
  };

  // Total expense sums
  const expenseTotals = useMemo(() => {
    let totalEstimatedConverted = 0;
    let totalActualConverted = 0;

    expenseItems.forEach((item) => {
      const rate = currencyService.getExchangeRate(
        item.currency,
        expenseDisplayCurrency,
        rateTable
      );
      totalEstimatedConverted += item.estimatedAmount * rate;
      if (item.actualAmount !== undefined) {
        totalActualConverted += item.actualAmount * rate;
      }
    });

    return {
      estimated: Number(totalEstimatedConverted.toFixed(2)),
      actual: Number(totalActualConverted.toFixed(2)),
      variance: Number((totalActualConverted - totalEstimatedConverted).toFixed(2)),
    };
  }, [expenseItems, expenseDisplayCurrency, rateTable]);

  // Metric Calculation active result
  const metricCalculations = useMemo(() => {
    const cpc = currencyService.calculateCPC(cpcSpend, cpcClicks);
    const cpm = currencyService.calculateCPM(cpmSpend, cpmImpressions);
    const cpa = currencyService.calculateCPA(cpaCost, cpaAcquisitions);
    const cpl = currencyService.calculateCPL(cplCost, cplLeads);
    const ctr = currencyService.calculateCTR(ctrClicks, ctrImpressions);
    const cvr = currencyService.calculateConversionRate(cvrConversions, cvrClicks);
    const roas = currencyService.calculateROAS(roasRevenue, roasSpend);
    const roi = currencyService.calculateROI(roiReturn, roiInvestment);

    return { cpc, cpm, cpa, cpl, ctr, cvr, roas, roi };
  }, [
    cpcSpend,
    cpcClicks,
    cpmSpend,
    cpmImpressions,
    cpaCost,
    cpaAcquisitions,
    cplCost,
    cplLeads,
    ctrClicks,
    ctrImpressions,
    cvrConversions,
    cvrClicks,
    roasRevenue,
    roasSpend,
    roiReturn,
    roiInvestment,
  ]);

  return (
    <>
      <SEO
        title="Multi-Currency Conversion & Marketing Cost Calculator — Sparkline Marketing"
        description="Convert budgets, calculate advertising expenses, and compare marketing costs across different currencies."
      />

      <div className="space-y-8 pb-16">
        {/* ========================================================================= */}
        {/* TOP COMMAND HEADER */}
        {/* ========================================================================= */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="blue" className="px-2.5 py-0.5">
                <Globe className="w-3 h-3 mr-1" />
                Global Marketing Finance
              </Badge>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold flex items-center gap-1.5 ${
                  rateTable.rateType === 'live'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    rateTable.rateType === 'live' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                />
                {rateTable.rateType === 'live'
                  ? 'Live Market Feed'
                  : 'Institutional Reference Feed'}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {new Date(rateTable.lastUpdated).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight font-display">
              Understand Your Marketing Costs in Any Currency.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Convert budgets, calculate advertising expenses, and compare marketing costs
              across different currencies.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshRates}
              disabled={isRefreshingRates}
              className="gap-1.5"
              title="Refresh current exchange rates from secure API"
            >
              <RefreshCw
                className={`w-4 h-4 text-slate-600 ${
                  isRefreshingRates ? 'animate-spin' : ''
                }`}
              />
              <span>{isRefreshingRates ? 'Updating...' : 'Refresh Rates'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              disabled={savedConversions.length === 0}
              className="gap-1.5"
              title="Export conversion history as CSV"
            >
              <Download className="w-4 h-4 text-slate-600" />
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
            onClick={() => setActiveTab('converter')}
            className={`pb-3 px-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'converter'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Currency Converter</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('metrics')}
            className={`pb-3 px-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'metrics'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Marketing Cost Calculators (8)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ad_comparison')}
            className={`pb-3 px-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'ad_comparison'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Ad Budget Comparison</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('expenses')}
            className={`pb-3 px-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'expenses'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Expense Breakdown</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('budget_integration')}
            className={`pb-3 px-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'budget_integration'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Budget Plan Integration</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-sparkline-blue text-sparkline-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Saved History ({savedConversions.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: CURRENCY CONVERTER & MULTI-CURRENCY MATRIX */}
        {/* ========================================================================= */}
        {activeTab === 'converter' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Interactive Converter Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-sparkline-blue" />
                    <h2 className="text-lg font-bold text-sparkline-midnight">
                      Instant Currency Converter
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    15 Global Currencies Supported
                  </span>
                </div>

                {/* Amount Input with Quick Chips */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Amount to Convert
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-400 font-bold text-lg">
                      {sourceMeta.symbol}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={converterAmount}
                      onChange={(e) => setConverterAmount(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xl font-bold font-mono text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                    />
                  </div>

                  {/* Quick Shortcut Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400 font-medium">Quick:</span>
                    {[100, 500, 1000, 5000, 10000, 50000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setConverterAmount(amt)}
                        className={`text-xs px-2.5 py-1 rounded-md font-mono transition-colors ${
                          converterAmount === amt
                            ? 'bg-sparkline-blue text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {sourceMeta.symbol}
                        {amt >= 1000 ? `${amt / 1000}k` : amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency Pickers + Swap */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      From (Source)
                    </label>
                    <select
                      value={sourceCurrency}
                      onChange={(e) => setSourceCurrency(e.target.value as CurrencyCode)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                    >
                      {SUPPORTED_CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} — {c.name} ({c.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Swap Button */}
                  <div className="sm:col-span-1 flex justify-center pt-4">
                    <button
                      type="button"
                      onClick={handleSwapCurrencies}
                      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-sparkline-blue hover:text-white text-slate-600 flex items-center justify-center transition-all shadow-sm"
                      title="Swap Source and Target Currencies"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      To (Target)
                    </label>
                    <select
                      value={targetCurrency}
                      onChange={(e) => setTargetCurrency(e.target.value as CurrencyCode)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-sparkline-midnight focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                    >
                      {SUPPORTED_CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} — {c.name} ({c.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Note / Label */}
                <div className="pt-2">
                  <input
                    type="text"
                    value={converterLabel}
                    onChange={(e) => setConverterLabel(e.target.value)}
                    placeholder="Optional memo (e.g. Q4 Meta Ads Budget, Influencer Gifting, Software Spend)"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-sparkline-blue"
                  />
                </div>

                {/* Conversion Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveConversion}
                    className="gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Save Conversion to History</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyConverted}
                    className="gap-1.5"
                  >
                    {copiedConverted ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-600" />
                    )}
                    <span>{copiedConverted ? 'Copied' : 'Copy Converted Amount'}</span>
                  </Button>
                </div>
              </div>

              {/* Conversion Result Display Box */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-sparkline-midnight text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-sparkline-cyan uppercase tracking-wider">
                      Converted Result
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Precision: {targetMeta.decimals} Decimals
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-slate-400">
                      {sourceMeta.flag} {converterAmount.toLocaleString()} {sourceCurrency} =
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight flex items-baseline gap-2">
                      <span>{convertedInfo.formatted}</span>
                    </div>
                  </div>

                  {/* Exchange Rate Formula Strip */}
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Direct Rate:</span>
                      <span className="font-mono font-bold text-white">
                        1 {sourceCurrency} = {convertedInfo.rate.toFixed(4)} {targetCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Inverse Rate:</span>
                      <span className="font-mono">
                        1 {targetCurrency} = {inverseRate.toFixed(4)} {sourceCurrency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metadata & Audit Footer */}
                <div className="pt-6 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span className="text-slate-200 font-medium truncate max-w-[200px]">
                      {rateTable.provider}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate Classification:</span>
                    <span className="text-sparkline-cyan uppercase font-bold">
                      {rateTable.rateType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-mono">
                      {new Date(rateTable.lastUpdated).toLocaleTimeString()} (
                      {new Date(rateTable.lastUpdated).toLocaleDateString()})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Multi-Currency Matrix */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-sparkline-blue" />
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Multi-Currency Cross Matrix
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  Converting{' '}
                  <strong className="text-sparkline-midnight">
                    {sourceMeta.symbol}
                    {converterAmount.toLocaleString()} {sourceCurrency}
                  </strong>{' '}
                  into all 14 other currencies
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {SUPPORTED_CURRENCIES.filter((c) => c.code !== sourceCurrency).map((curr) => {
                  const res = currencyService.convertAmount(
                    converterAmount,
                    sourceCurrency,
                    curr.code,
                    rateTable
                  );

                  return (
                    <div
                      key={curr.code}
                      onClick={() => setTargetCurrency(curr.code)}
                      className={`cursor-pointer p-3 rounded-xl border transition-all ${
                        targetCurrency === curr.code
                          ? 'bg-blue-50/70 border-sparkline-blue ring-1 ring-sparkline-blue/20'
                          : 'bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-sparkline-midnight">
                          {curr.flag} {curr.code}
                        </span>
                        <span className="font-mono text-[10px]">
                          1 {sourceCurrency} = {res.rate.toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-1.5 text-sm font-bold font-mono text-sparkline-midnight truncate">
                        {res.formatted}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MARKETING COST CALCULATORS (8 FORMULAS) */}
        {/* ========================================================================= */}
        {activeTab === 'metrics' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight">
                  Marketing Cost & Efficiency Metric Calculators
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Safe mathematical calculations with division-by-zero protection and clear
                  cost distinctions.
                </p>
              </div>

              {/* Currency Selector for Metrics */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-slate-500">Display Currency:</span>
                <select
                  value={metricCurrency}
                  onChange={(e) => setMetricCurrency(e.target.value as CurrencyCode)}
                  className="text-xs font-semibold text-sparkline-midnight bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Metric Pills Selector */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'CPC', name: 'CPC — Cost Per Click' },
                { id: 'CPM', name: 'CPM — Cost Per Mille' },
                { id: 'CPA', name: 'CPA — Cost Per Acquisition' },
                { id: 'CPL', name: 'CPL — Cost Per Lead' },
                { id: 'CTR', name: 'CTR — Click-Through Rate' },
                { id: 'CVR', name: 'CVR — Conversion Rate' },
                { id: 'ROAS', name: 'ROAS — Return On Ad Spend' },
                { id: 'ROI', name: 'ROI — Return On Investment' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveMetric(m.id as MarketingMetricType)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeMetric === m.id
                      ? 'bg-sparkline-blue text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            {/* Active Calculator Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Calculator Inputs */}
              <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
                {activeMetric === 'CPC' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold uppercase text-sparkline-blue">
                        Cost Per Click (CPC)
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Formula: Total Ad Spend / Clicks
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Total Direct Ad Spend ({metricCurrency})
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
                        Total Verified Ad Clicks
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={cpcClicks}
                        onChange={(e) => setCpcClicks(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                      />
                    </div>
                  </div>
                )}

                {activeMetric === 'CPM' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold uppercase text-sparkline-blue">
                        Cost Per Thousand Impressions (CPM)
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Formula: (Ad Spend / Impressions) × 1,000
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Total Direct Ad Spend ({metricCurrency})
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
                        Total Verified Impressions
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={cpmImpressions}
                        onChange={(e) => setCpmImpressions(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                      />
                    </div>
                  </div>
                )}

                {activeMetric === 'CPA' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold uppercase text-sparkline-blue">
                        Cost Per Acquisition (CPA)
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Formula: Total Campaign Cost / Acquisitions
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Total Campaign Investment (Media + Creative + Tools) ({metricCurrency})
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
                        Total Paying Customers / Acquisitions
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={cpaAcquisitions}
                        onChange={(e) => setCpaAcquisitions(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                      />
                    </div>
                  </div>
                )}

                {activeMetric === 'CPL' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold uppercase text-sparkline-blue">
                        Cost Per Lead (CPL)
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Formula: Total Marketing Cost / Leads
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Total Lead Generation Cost ({metricCurrency})
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
                        Total Qualified Leads Captured
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={cplLeads}
                        onChange={(e) => setCplLeads(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                      />
                    </div>
                  </div>
                )}

                {activeMetric === 'CTR' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold uppercase text-sparkline-blue">
                        Click-Through Rate (CTR)
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Formula: (Clicks / Impressions) × 100
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Total Ad Clicks
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
                        Total Ad Impressions
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={ctrImpressions}
                        onChange={(e) => setCtrImpressions(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                      />
                    </div>
                  </div>
                )}

                {activeMetric === 'CVR' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold uppercase text-sparkline-blue">
                        Conversion Rate (CVR)
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Formula: (Conversions / Clicks) × 100
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Total Conversions
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
                        Total Landing Page Clicks / Visitors
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={cvrClicks}
                        onChange={(e) => setCvrClicks(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                      />
                    </div>
                  </div>
                )}

                {activeMetric === 'ROAS' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold uppercase text-sparkline-blue">
                        Return On Ad Spend (ROAS)
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Formula: Ad Revenue / Ad Spend
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Gross Revenue Attributed to Ads ({metricCurrency})
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
                        Total Direct Ad Spend ({metricCurrency})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={roasSpend}
                        onChange={(e) => setRoasSpend(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                      />
                    </div>
                  </div>
                )}

                {activeMetric === 'ROI' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold uppercase text-sparkline-blue">
                        Return On Investment (ROI)
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Formula: ((Return − Investment) / Investment) × 100
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Total Net Commercial Return / Revenue ({metricCurrency})
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
                        Total Marketing Investment (All Capital Deployed) ({metricCurrency})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={roiInvestment}
                        onChange={(e) => setRoiInvestment(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono text-sparkline-midnight"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Result Card & Guidance */}
              <div className="lg:col-span-6 flex flex-col justify-between bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Calculation Outcome
                    </span>
                    <Badge variant="blue" className="text-xs">
                      {activeMetric}
                    </Badge>
                  </div>

                  <div className="my-6">
                    {(() => {
                      const calc =
                        metricCalculations[
                          activeMetric.toLowerCase() as keyof typeof metricCalculations
                        ];

                      if (calc.isZeroDenominator) {
                        return (
                          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-sm">
                              <AlertCircle className="w-4 h-4 text-amber-600" />
                              <span>Division By Zero Undefined</span>
                            </div>
                            <p className="text-xs text-amber-800 leading-relaxed">
                              {calc.limitations}
                            </p>
                          </div>
                        );
                      }

                      let displayVal = `${calc.result}`;
                      if (activeMetric === 'CPC' || activeMetric === 'CPM' || activeMetric === 'CPA' || activeMetric === 'CPL') {
                        displayVal = `${currencyService.getCurrencyMetadata(metricCurrency).symbol}${calc.result?.toFixed(2)}`;
                      } else if (activeMetric === 'CTR' || activeMetric === 'CVR' || activeMetric === 'ROI') {
                        displayVal = `${calc.result}%`;
                      } else if (activeMetric === 'ROAS') {
                        displayVal = `${calc.result}x`;
                      }

                      return (
                        <div className="space-y-1">
                          <span className="text-xs text-slate-400 font-semibold uppercase">
                            Resulting Benchmark
                          </span>
                          <div className="text-4xl font-extrabold font-mono text-sparkline-midnight">
                            {displayVal}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Strategic Explanation */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                    <div className="font-bold text-sparkline-midnight flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-sparkline-blue" />
                      <span>Formula Interpretation</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {
                        metricCalculations[
                          activeMetric.toLowerCase() as keyof typeof metricCalculations
                        ].explanation
                      }
                    </p>
                    <div className="pt-2 border-t border-slate-200 text-slate-500 text-[11px]">
                      <strong>Governance Limitation:</strong>{' '}
                      {
                        metricCalculations[
                          activeMetric.toLowerCase() as keyof typeof metricCalculations
                        ].limitations
                      }
                    </div>
                  </div>
                </div>

                {/* Clarification Strip (ROAS vs ROI, Ad Spend vs Campaign) */}
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-sparkline-blue block">
                    Strategic Financial Notice:
                  </span>
                  <p className="leading-relaxed">
                    <strong>Ad Spend</strong> refers strictly to media distribution fees paid to
                    platforms (Meta, Google). <strong>Total Investment</strong> must incorporate
                    creative assets, copy, video editing, tracking software, and agency costs. Never
                    confuse <em>ROAS</em> (ad multiplier) with true <em>ROI</em> (net bottom-line profit).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ADVERTISING BUDGET COMPARISON ACROSS MARKETS & PLATFORMS */}
        {/* ========================================================================= */}
        {activeTab === 'ad_comparison' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight">
                  Cross-Platform & Regional Cost Benchmarking
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compare CPC, CPM, and CPA across channels and geographic regions in a
                  standardized common currency.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Normalize To:</span>
                  <select
                    value={comparisonTargetCurrency}
                    onChange={(e) =>
                      setComparisonTargetCurrency(e.target.value as CurrencyCode)
                    }
                    className="text-xs font-semibold text-sparkline-midnight bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddComparisonModal(true)}
                  className="gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Benchmark</span>
                </Button>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th className="px-5 py-3.5">Platform / Market</th>
                      <th className="px-5 py-3.5">Local Currency Cost</th>
                      <th className="px-5 py-3.5">
                        Normalized ({comparisonTargetCurrency})
                      </th>
                      <th className="px-5 py-3.5">Exchange Rate Used</th>
                      <th className="px-5 py-3.5">Campaign Budget</th>
                      <th className="px-5 py-3.5">Context & Notes</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adComparisons.map((item) => {
                      const rate = currencyService.getExchangeRate(
                        item.currency,
                        comparisonTargetCurrency,
                        rateTable
                      );
                      const normCpc = (item.cpc * rate).toFixed(2);
                      const normCpm = (item.cpm * rate).toFixed(2);
                      const normCpa = (item.cpa * rate).toFixed(2);
                      const normBudget = (item.budget * rate).toFixed(2);
                      const targetSymbol =
                        currencyService.getCurrencyMetadata(comparisonTargetCurrency).symbol;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-4 font-bold text-sparkline-midnight text-sm">
                            {item.platformOrMarket}
                          </td>
                          <td className="px-5 py-4 font-mono space-y-0.5">
                            <div>
                              CPC:{' '}
                              <strong>
                                {currencyService.getCurrencyMetadata(item.currency).symbol}
                                {item.cpc.toFixed(2)}
                              </strong>
                            </div>
                            <div className="text-slate-400">
                              CPM: {currencyService.getCurrencyMetadata(item.currency).symbol}
                              {item.cpm.toFixed(2)} | CPA:{' '}
                              {currencyService.getCurrencyMetadata(item.currency).symbol}
                              {item.cpa.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-5 py-4 font-mono space-y-0.5 text-sparkline-blue">
                            <div>
                              CPC: <strong>{targetSymbol}{normCpc}</strong>
                            </div>
                            <div className="text-slate-500">
                              CPM: {targetSymbol}{normCpm} | CPA: {targetSymbol}{normCpa}
                            </div>
                          </td>
                          <td className="px-5 py-4 font-mono text-slate-500">
                            1 {item.currency} = {rate.toFixed(4)} {comparisonTargetCurrency}
                          </td>
                          <td className="px-5 py-4 font-mono">
                            <span className="font-bold text-sparkline-midnight">
                              {targetSymbol}{normBudget}
                            </span>
                            <div className="text-[10px] text-slate-400">
                              ({currencyService.getCurrencyMetadata(item.currency).symbol}
                              {item.budget.toLocaleString()} {item.currency})
                            </div>
                          </td>
                          <td className="px-5 py-4 max-w-xs text-slate-600 line-clamp-2">
                            {item.notes || '—'}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteComparison(item.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Delete entry"
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

              {/* Disclaimer Notice */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 leading-relaxed">
                <strong>Market Parity Disclaimer:</strong> Cost comparisons reflect mathematical
                currency normalization based on live/reference exchange rates. Advertising auction
                dynamics vary based on local purchasing power, targeting specificity, ad creative
                quality, and seasonal demand. No unverified claim of regional cost superiority is
                implied.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MARKETING EXPENSE CALCULATOR & ESTIMATOR */}
        {/* ========================================================================= */}
        {activeTab === 'expenses' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight">
                  Marketing Expense Estimator & Actual Tracker
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Organize expenses across 10 essential marketing categories with estimated vs.
                  actual cost tracking.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">View In:</span>
                  <select
                    value={expenseDisplayCurrency}
                    onChange={(e) =>
                      setExpenseDisplayCurrency(e.target.value as CurrencyCode)
                    }
                    className="text-xs font-semibold text-sparkline-midnight bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddExpenseModal(true)}
                  className="gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Line Item</span>
                </Button>
              </div>
            </div>

            {/* Total Expense KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Estimated Expenses
                </span>
                <div className="text-2xl font-extrabold font-mono text-sparkline-midnight">
                  {currencyService.getCurrencyMetadata(expenseDisplayCurrency).symbol}
                  {expenseTotals.estimated.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <span className="text-[11px] text-slate-400">
                  Across {expenseItems.length} planned initiatives
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Actual Incurred
                </span>
                <div className="text-2xl font-extrabold font-mono text-sparkline-midnight">
                  {currencyService.getCurrencyMetadata(expenseDisplayCurrency).symbol}
                  {expenseTotals.actual.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-slate-400">
                  Verified invoices and receipts
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Variance (Actual − Estimate)
                </span>
                <div
                  className={`text-2xl font-extrabold font-mono ${
                    expenseTotals.variance > 0
                      ? 'text-rose-600'
                      : expenseTotals.variance < 0
                      ? 'text-emerald-600'
                      : 'text-slate-600'
                  }`}
                >
                  {expenseTotals.variance > 0 ? '+' : ''}
                  {currencyService.getCurrencyMetadata(expenseDisplayCurrency).symbol}
                  {expenseTotals.variance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <span className="text-[11px] text-slate-400">
                  {expenseTotals.variance > 0
                    ? 'Budget overrun'
                    : expenseTotals.variance < 0
                    ? 'Under budget savings'
                    : 'Exact on target'}
                </span>
              </div>
            </div>

            {/* Expenses Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th className="px-5 py-3.5">Expense Item</th>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">Estimated</th>
                      <th className="px-5 py-3.5">Actual Incurred</th>
                      <th className="px-5 py-3.5">
                        Converted ({expenseDisplayCurrency})
                      </th>
                      <th className="px-5 py-3.5">Frequency</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expenseItems.map((item) => {
                      const rate = currencyService.getExchangeRate(
                        item.currency,
                        expenseDisplayCurrency,
                        rateTable
                      );
                      const convEst = (item.estimatedAmount * rate).toFixed(2);
                      const convAct =
                        item.actualAmount !== undefined
                          ? (item.actualAmount * rate).toFixed(2)
                          : '—';

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="font-bold text-sparkline-midnight">
                              {item.name}
                            </div>
                            {item.notes && (
                              <div className="text-[11px] text-slate-400">{item.notes}</div>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-mono">
                            {currencyService.getCurrencyMetadata(item.currency).symbol}
                            {item.estimatedAmount.toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 font-mono">
                            {item.actualAmount !== undefined ? (
                              <span>
                                {currencyService.getCurrencyMetadata(item.currency).symbol}
                                {item.actualAmount.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Pending</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 font-mono font-bold text-sparkline-midnight">
                            {
                              currencyService.getCurrencyMetadata(expenseDisplayCurrency)
                                .symbol
                            }
                            {convEst}
                            {item.actualAmount !== undefined && (
                              <span className="text-[10px] text-slate-400 block font-normal">
                                Act:{' '}
                                {
                                  currencyService.getCurrencyMetadata(
                                    expenseDisplayCurrency
                                  ).symbol
                                }
                                {convAct}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-slate-600">{item.frequency}</td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteExpense(item.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Delete item"
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
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: BUDGET PLANNER INTEGRATION (PROMPT 12 SYNC) */}
        {/* ========================================================================= */}
        {activeTab === 'budget_integration' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight">
                  Marketing Budget Plan Cross-Currency Conversion
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Import any saved budget plan from Prompt 12 and preview line-item allocations
                  converted to foreign currencies without mutating original data.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Select Saved Plan */}
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="text-xs font-semibold text-sparkline-midnight bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                >
                  {budgetPlans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.projectName} — {p.planTitle} ({p.currency} {p.totalBudget})
                    </option>
                  ))}
                </select>

                {/* Target Currency */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500">Convert To:</span>
                  <select
                    value={budgetIntegrationTargetCurrency}
                    onChange={(e) =>
                      setBudgetIntegrationTargetCurrency(e.target.value as CurrencyCode)
                    }
                    className="text-xs font-semibold text-sparkline-midnight bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {importedBudgetResult ? (
              <div className="space-y-6">
                {/* Side-by-Side Comparison Header Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Original Plan Total
                    </span>
                    <div className="text-2xl font-extrabold font-mono text-sparkline-midnight">
                      {importedBudgetResult.originalCurrency}{' '}
                      {importedBudgetResult.originalTotal.toLocaleString()}
                    </div>
                    <span className="text-xs text-slate-400">
                      Project: {importedBudgetResult.projectName}
                    </span>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-sparkline-blue shadow-sm space-y-1">
                    <span className="text-xs font-semibold text-sparkline-blue uppercase tracking-wider">
                      Converted Budget Total
                    </span>
                    <div className="text-2xl font-extrabold font-mono text-sparkline-blue">
                      {currencyService.getCurrencyMetadata(budgetIntegrationTargetCurrency).symbol}
                      {importedBudgetResult.convertedTotal.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}{' '}
                      {budgetIntegrationTargetCurrency}
                    </div>
                    <span className="text-xs text-slate-400">
                      Rate: 1 {importedBudgetResult.originalCurrency} ={' '}
                      {importedBudgetResult.rateUsed.toFixed(4)}{' '}
                      {budgetIntegrationTargetCurrency}
                    </span>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Immutability Guarantee
                    </span>
                    <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 mt-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Original Budget Preserved</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                      No changes made to the stored Prompt 12 budget plan. All conversions are
                      computed in real time.
                    </p>
                  </div>
                </div>

                {/* Converted Allocations Table */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
                    <span className="font-bold text-sparkline-midnight">
                      Converted Channel Allocations ({importedBudgetResult.allocations.length}{' '}
                      Items)
                    </span>
                    <span className="font-mono text-slate-500">
                      Rate Provider: {rateTable.provider}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                          <th className="px-5 py-3">Category</th>
                          <th className="px-5 py-3">Group</th>
                          <th className="px-5 py-3">Allocation %</th>
                          <th className="px-5 py-3">
                            Original ({importedBudgetResult.originalCurrency})
                          </th>
                          <th className="px-5 py-3">
                            Converted ({budgetIntegrationTargetCurrency})
                          </th>
                          <th className="px-5 py-3">Primary KPI Target</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {importedBudgetResult.allocations.map((a, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70">
                            <td className="px-5 py-3.5 font-bold text-sparkline-midnight">
                              {a.category}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                                {a.group}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 font-mono">{a.percentage}%</td>
                            <td className="px-5 py-3.5 font-mono font-bold text-slate-700">
                              {importedBudgetResult.originalCurrency}{' '}
                              {a.originalAmount.toLocaleString()}
                            </td>
                            <td className="px-5 py-3.5 font-mono font-bold text-sparkline-blue">
                              {
                                currencyService.getCurrencyMetadata(
                                  budgetIntegrationTargetCurrency
                                ).symbol
                              }
                              {a.convertedAmount.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-5 py-3.5 text-slate-600">{a.primaryKpi}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200/90 text-center text-slate-500">
                No active budget plan found to import. Create a plan in the Budget Planner first.
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: CONVERSION HISTORY & SAVED RECORDS */}
        {/* ========================================================================= */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <div>
                <h2 className="text-lg font-bold text-sparkline-midnight">
                  Saved Currency Conversions & Audit Trail
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Historical conversions store the exact exchange rate and timestamp used so results
                  remain reproducible without historical recalculation.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  disabled={savedConversions.length === 0}
                  className="gap-1.5"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Export CSV</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAllConversions}
                  disabled={savedConversions.length === 0}
                  className="gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear History</span>
                </Button>
              </div>
            </div>

            {savedConversions.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-sparkline-midnight">
                  No Saved Conversions Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Perform a currency conversion in the converter tab and click &quot;Save
                  Conversion to History&quot; to build your financial audit trail.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <th className="px-5 py-3.5">Timestamp</th>
                        <th className="px-5 py-3.5">Memo / Description</th>
                        <th className="px-5 py-3.5">Source Amount</th>
                        <th className="px-5 py-3.5">Converted Target</th>
                        <th className="px-5 py-3.5">Historical Rate Used</th>
                        <th className="px-5 py-3.5">Rate Source</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {savedConversions.map((conv) => (
                        <tr key={conv.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                            {new Date(conv.timestamp).toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-sparkline-midnight">
                            {conv.label || 'Standard Conversion'}
                          </td>
                          <td className="px-5 py-3.5 font-mono font-bold text-slate-700">
                            {currencyService.getCurrencyMetadata(conv.sourceCurrency).symbol}
                            {conv.sourceAmount.toLocaleString()} {conv.sourceCurrency}
                          </td>
                          <td className="px-5 py-3.5 font-mono font-bold text-sparkline-blue">
                            {currencyService.getCurrencyMetadata(conv.targetCurrency).symbol}
                            {conv.targetAmount.toLocaleString()} {conv.targetCurrency}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-slate-600">
                            1 {conv.sourceCurrency} = {conv.exchangeRate.toFixed(4)}{' '}
                            {conv.targetCurrency}
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 text-[11px] truncate max-w-[160px]">
                            {conv.provider}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteConversion(conv.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Delete conversion record"
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

        {/* ========================================================================= */}
        {/* ADD AD COMPARISON MODAL */}
        {/* ========================================================================= */}
        {showAddComparisonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-sparkline-blue" />
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Add Ad Cost Benchmark Entry
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddComparisonModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddComparisonSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Platform or Regional Market Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompMarket}
                    onChange={(e) => setNewCompMarket(e.target.value)}
                    placeholder="e.g. Meta Ads (Germany), TikTok (Canada), LinkedIn (B2B SaaS)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-sparkline-midnight"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Local Currency *
                    </label>
                    <select
                      value={newCompCurrency}
                      onChange={(e) => setNewCompCurrency(e.target.value as CurrencyCode)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold"
                    >
                      {SUPPORTED_CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Campaign Budget
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newCompBudget}
                      onChange={(e) => setNewCompBudget(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">CPC</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={newCompCpc}
                      onChange={(e) => setNewCompCpc(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">CPM</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={newCompCpm}
                      onChange={(e) => setNewCompCpm(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">CPA</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={newCompCpa}
                      onChange={(e) => setNewCompCpa(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Measurement Period
                  </label>
                  <select
                    value={newCompPeriod}
                    onChange={(e) => setNewCompPeriod(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Campaign">Campaign</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddComparisonModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Add Benchmark
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADD EXPENSE LINE ITEM MODAL */}
        {/* ========================================================================= */}
        {showAddExpenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-sparkline-blue" />
                  <h3 className="text-base font-bold text-sparkline-midnight">
                    Add Marketing Expense Item
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddExpenseSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Expense Line Item Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={newExpName}
                    onChange={(e) => setNewExpName(e.target.value)}
                    placeholder="e.g. Meta Reels Hook Editor Retainer"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-sparkline-midnight"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={newExpCategory}
                      onChange={(e) =>
                        setNewExpCategory(e.target.value as MarketingExpenseCategory)
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Billing Currency *
                    </label>
                    <select
                      value={newExpCurrency}
                      onChange={(e) => setNewExpCurrency(e.target.value as CurrencyCode)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      {SUPPORTED_CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Estimated Spend
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newExpEstimated}
                      onChange={(e) => setNewExpEstimated(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Actual Incurred (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newExpActual}
                      onChange={(e) => setNewExpActual(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Frequency</label>
                  <select
                    value={newExpFreq}
                    onChange={(e) => setNewExpFreq(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Campaign">Campaign</option>
                    <option value="One-Time">One-Time</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddExpenseModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Add Expense
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
