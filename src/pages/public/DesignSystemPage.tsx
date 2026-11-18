import React, { useState } from 'react';
import { SEO } from '@/components/common/SEO';
import { Badge } from '@/components/common/Badge';
import {
  Button,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton,
  GradientButton,
  IconButton,
} from '@/components/common/Button';
import {
  Card,
  BaseCard,
  FeatureCard,
  MetricCard,
  AIInsightCard,
  RecommendationCard,
  AnalyticsCard,
  PricingCard,
} from '@/components/common/Card';
import {
  TextInput,
  TextArea,
  SelectInput,
  SearchInput,
  CurrencyInput,
  NumberInput,
  Checkbox,
  RadioGroup,
  DateInput,
} from '@/components/common/Form';
import {
  MetricDisplay,
  TrendIndicator,
  ProgressBar,
  StatusBadge,
  DataTable,
  EmptyState,
} from '@/components/common/DataViz';
import {
  Modal,
  ConfirmationDialog,
  Tooltip,
  LoadingSpinner,
  SkeletonLoader,
  ErrorState,
  useToast,
} from '@/components/common/Feedback';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { MarketingMetricCard } from '@/components/marketing/MarketingMetricCard';
import { MarketingKPIBadge } from '@/components/marketing/MarketingKPIBadge';
import { MarketingRecommendationCard } from '@/components/marketing/MarketingRecommendationCard';
import { BudgetAllocationCard } from '@/components/marketing/BudgetAllocationCard';
import { CampaignStatusCard } from '@/components/marketing/CampaignStatusCard';
import { AIAnalysisPanel } from '@/components/marketing/AIAnalysisPanel';
import { MarketingScoreCard } from '@/components/marketing/MarketingScoreCard';
import { ChartContainer } from '@/components/charts/ChartContainer';
import {
  SparklineAreaChart,
  SparklineLineChart,
  SparklineBarChart,
  SparklineDonutChart,
  chartColors,
} from '@/components/charts/SparklineCharts';
import { MiniSparkline } from '@/components/charts/SparklineChart';
import {
  Sparkles,
  Palette,
  MousePointerClick,
  LayoutGrid,
  FileText,
  BarChart2,
  BellRing,
  HelpCircle,
  Brain,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const DesignSystemPage: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<
    'tokens' | 'buttons' | 'cards' | 'forms' | 'dataviz' | 'marketing' | 'feedback'
  >('tokens');

  // Interactive Form States
  const [textVal, setTextVal] = useState('Acme Marketing Campaign');
  const [textError, setTextError] = useState('');
  const [textAreaVal, setTextAreaVal] = useState(
    'Target high-intent B2B search keywords with direct problem-solving value propositions.'
  );
  const [searchVal, setSearchVal] = useState('CAC optimization');
  const [selectVal, setSelectVal] = useState('search');
  const [currencyVal, setCurrencyVal] = useState(15000);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [numberVal, setNumberVal] = useState(4);
  const [chkVal, setChkVal] = useState(true);
  const [radioVal, setRadioVal] = useState('aggressive');
  const [dateVal, setDateVal] = useState('2026-11-15');

  // Interactive Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Sample Table Data
  const sampleTableData = [
    { id: 1, channel: 'Google Search Ads', spend: '$14,200', roas: '4.8x', status: 'active' as const },
    { id: 2, channel: 'Meta Instagram Story', spend: '$8,500', roas: '3.9x', status: 'active' as const },
    { id: 3, channel: 'LinkedIn ABM Lead Gen', spend: '$12,400', roas: '5.2x', status: 'active' as const },
    { id: 4, channel: 'YouTube Pre-Roll Video', spend: '$6,100', roas: '2.8x', status: 'paused' as const },
    { id: 5, channel: 'TikTok Creative Flight', spend: '$4,800', roas: '2.1x', status: 'warning' as const },
    { id: 6, channel: 'Newsletter Sponsorships', spend: '$3,200', roas: '6.4x', status: 'active' as const },
  ];

  // Sample Chart Data
  const monthlyPerformanceData = [
    { month: 'Jun', spend: 2800, revenue: 10200, roas: 3.6 },
    { month: 'Jul', spend: 3400, revenue: 13900, roas: 4.1 },
    { month: 'Aug', spend: 3100, revenue: 14200, roas: 4.6 },
    { month: 'Sep', spend: 4200, revenue: 19800, roas: 4.7 },
    { month: 'Oct', spend: 4900, revenue: 24500, roas: 5.0 },
    { month: 'Nov', spend: 5400, revenue: 29800, roas: 5.5 },
  ];

  const channelBreakdownData = [
    { name: 'Google Search', value: 45, color: chartColors.blue },
    { name: 'Meta & Instagram', value: 25, color: chartColors.magenta },
    { name: 'LinkedIn ABM', value: 20, color: chartColors.purple },
    { name: 'Content & SEO', value: 10, color: chartColors.cyan },
  ];

  return (
    <div className="py-10 bg-sparkline-cloud min-h-screen">
      <SEO
        title="Design System & Component Library"
        description="Official Sparkline Marketing design system, tokens, brand palette, and reusable UI components."
        noIndex={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'System Documentation', href: '/design-system' },
            { label: 'Component Library Showcase' },
          ]}
        />

        {/* Hero Header */}
        <div className="bg-sparkline-midnight rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden border border-sparkline-slate shadow-premium">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-sparkline-blue/20 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sparkline-cyan text-xs font-semibold mb-4 border border-white/5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 02 Component Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Sparkline Marketing Design System
            </h1>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Centralized design tokens, accessible color scales, typography rules,
              and enterprise-grade SaaS components engineered for the remaining 23 development phases.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: 'tokens', label: '1. Tokens & Colors', icon: <Palette className="w-4 h-4" /> },
            { id: 'buttons', label: '2. Buttons & Actions', icon: <MousePointerClick className="w-4 h-4" /> },
            { id: 'cards', label: '3. Cards & Containers', icon: <LayoutGrid className="w-4 h-4" /> },
            { id: 'forms', label: '4. Form Controls', icon: <FileText className="w-4 h-4" /> },
            { id: 'dataviz', label: '5. Charts & Data Viz', icon: <BarChart2 className="w-4 h-4" /> },
            { id: 'marketing', label: '6. Marketing Components', icon: <Brain className="w-4 h-4" /> },
            { id: 'feedback', label: '7. Feedback & Modals', icon: <BellRing className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none',
                activeTab === tab.id
                  ? 'bg-sparkline-midnight text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-sparkline-blue/40'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: TOKENS & COLORS */}
        {activeTab === 'tokens' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Official Brand Palette */}
            <Card className="p-6 bg-white border-slate-200">
              <h2 className="text-lg font-bold text-sparkline-midnight mb-2">
                Official Brand Color Palette
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                The exact palette derived from Sparkline Marketing branding and assets.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'Midnight Navy', hex: '#071329', usage: 'Sidebar & dark surfaces', darkText: false },
                  { name: 'Deep Slate', hex: '#152238', usage: 'Dark cards & borders', darkText: false },
                  { name: 'Electric Blue', hex: '#0C65F4', usage: 'Primary action & brand accent', darkText: false },
                  { name: 'Royal Purple', hex: '#593090', usage: 'AI features & intelligence', darkText: false },
                  { name: 'Magenta', hex: '#C52B85', usage: 'Creative marketing highlights', darkText: false },
                  { name: 'Sky Cyan', hex: '#2292D9', usage: 'Analytics & data elements', darkText: false },
                  { name: 'Growth Orange', hex: '#E37C33', usage: 'Warnings & growth highlights', darkText: false },
                  { name: 'Cloud White', hex: '#F5F7FC', usage: 'Workspace background', darkText: true },
                ].map((color) => (
                  <div
                    key={color.name}
                    className="p-4 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col justify-between h-36"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className={cn(
                          'text-xs font-bold',
                          color.darkText ? 'text-sparkline-midnight' : 'text-white'
                        )}
                      >
                        {color.name}
                      </span>
                    </div>
                    <div>
                      <span
                        className={cn(
                          'font-mono text-xs font-bold block',
                          color.darkText ? 'text-slate-800' : 'text-white'
                        )}
                      >
                        {color.hex}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] mt-0.5 block',
                          color.darkText ? 'text-slate-500' : 'text-white/80'
                        )}
                      >
                        {color.usage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Badges Token Preview */}
            <Card className="p-6 bg-white border-slate-200">
              <h2 className="text-lg font-bold text-sparkline-midnight mb-2">
                Badge Variants & Sizes
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="blue">Electric Blue</Badge>
                <Badge variant="purple">Royal Purple</Badge>
                <Badge variant="magenta">Creative Magenta</Badge>
                <Badge variant="cyan">Analytics Cyan</Badge>
                <Badge variant="orange">Growth Orange</Badge>
                <Badge variant="slate">Deep Slate</Badge>
                <Badge variant="neutral">Neutral Gray</Badge>
              </div>
            </Card>

            {/* Typography Tokens */}
            <Card className="p-6 bg-white border-slate-200">
              <h2 className="text-lg font-bold text-sparkline-midnight mb-2">
                Typography System
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Headings: <strong>Plus Jakarta Sans</strong> • Body & UI: <strong>Inter</strong>
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Display Heading (3.75rem / 60px / Bold 800)
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-sparkline-midnight">
                      Think Strategy. Predict Growth.
                    </h1>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Page Title / H1 (2.5rem / 40px / Bold 700)
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-sparkline-midnight">
                      Marketing Intelligence Overview
                    </h2>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Section Heading / H2 (1.875rem / 30px / SemiBold 600)
                    </span>
                    <h3 className="text-xl font-bold text-sparkline-midnight">
                      Algorithmic Acquisition Blueprint
                    </h3>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Body Regular & Description (1rem / 16px / Regular 400)
                    </span>
                    <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                      Transform your product information into intelligent marketing strategies,
                      data-driven decisions and measurable growth opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: BUTTONS */}
        {activeTab === 'buttons' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <Card className="p-6 bg-white border-slate-200">
              <h2 className="text-lg font-bold text-sparkline-midnight mb-2">
                Button Component Variants
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                All buttons feature interactive focus rings, hover transitions, and keyboard semantics.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <PrimaryButton onClick={() => addToast({ type: 'success', title: 'Primary clicked' })}>
                  Primary Button
                </PrimaryButton>
                <SecondaryButton onClick={() => addToast({ type: 'info', title: 'Secondary clicked' })}>
                  Secondary Button
                </SecondaryButton>
                <GradientButton onClick={() => addToast({ type: 'info', title: 'AI Strategy initialized' })}>
                  Gradient Button
                </GradientButton>
                <OutlineButton onClick={() => addToast({ type: 'info', title: 'Outline clicked' })}>
                  Outline Button
                </OutlineButton>
                <GhostButton onClick={() => addToast({ type: 'info', title: 'Ghost clicked' })}>
                  Ghost Button
                </GhostButton>
                <IconButton
                  aria-label="Search action"
                  onClick={() => addToast({ type: 'info', title: 'Icon Button clicked' })}
                >
                  <Search className="w-4 h-4" />
                </IconButton>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-sparkline-midnight mb-3">
                  Button Sizes & States
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small (sm)</Button>
                  <Button size="md">Medium (md)</Button>
                  <Button size="lg">Large (lg)</Button>
                  <Button isLoading>Processing...</Button>
                  <Button disabled>Disabled State</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: CARDS */}
        {activeTab === 'cards' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* BaseCard */}
              <BaseCard>
                <h4 className="text-sm font-bold text-sparkline-midnight mb-1">BaseCard Container</h4>
                <p className="text-xs text-slate-600">Standard clean card with subtle border and shadow.</p>
              </BaseCard>

              {/* FeatureCard */}
              <FeatureCard
                icon={<Brain className="w-6 h-6" />}
                title="AI Marketing Strategist"
                description="Translates product economics into targeted customer acquisition channels."
                badge="Intelligence Core"
                to="/dashboard/strategist"
              />

              {/* MetricCard */}
              <MetricCard
                title="Average ROAS"
                value="4.85x"
                change={18.5}
                period="vs predicted baseline"
                tooltipText="Return on ad spend across all active campaigns"
                chartComponent={<MiniSparkline data={[3.4, 3.8, 4.1, 4.5, 4.85]} isPositive={true} />}
              />

              {/* AIInsightCard */}
              <AIInsightCard
                title="Search Intent Arbitrage Detected"
                insight="B2B MarTech CPC is $1.80 vs $4.20 industry average. Immediate allocation window."
                confidenceScore={94}
                recommendedAction="Increase Google Search budget by 25%"
                actionUrl="/dashboard/budget"
              />

              {/* RecommendationCard */}
              <RecommendationCard
                title="Refresh Top Ad Set Creative"
                description="Frequency exceeded 3.8x. Rotate with 3 dynamic product benefit angles."
                impact="High"
                expectedBenefit="+24% CTR recovery"
              />

              {/* AnalyticsCard */}
              <AnalyticsCard title="Campaign Overview" subtitle="Real-time conversion summary">
                <div className="text-xs text-slate-600">Analytics container ready for chart or table insertion.</div>
              </AnalyticsCard>
            </div>

            {/* PricingCard Demonstration */}
            <div className="max-w-md">
              <PricingCard
                name="Growth Intelligence"
                price="$149"
                period="/month"
                description="Engineered for high-velocity performance marketing teams."
                features={[
                  'Unlimited AI Strategy Generation',
                  'Competitor Intelligence & Ad Angles',
                  'Predictive Performance Forecasting',
                  'Multi-Currency Budget Allocation',
                ]}
                highlight={true}
                badge="Most Popular"
              />
            </div>
          </div>
        )}

        {/* TAB 4: FORMS */}
        {activeTab === 'forms' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <Card className="p-6 bg-white border-slate-200">
              <h2 className="text-lg font-bold text-sparkline-midnight mb-2">
                Accessible Form Controls
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                All inputs support accessible labels, helper text, error handling, and visual focus states.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  label="Campaign Project Name"
                  value={textVal}
                  onChange={(e) => {
                    setTextVal(e.target.value);
                    if (!e.target.value) setTextError('Campaign name cannot be empty.');
                    else setTextError('');
                  }}
                  error={textError}
                  helperText="Enter a recognizable project or product campaign name."
                  required
                />

                <SearchInput
                  label="Search Market Keywords"
                  value={searchVal}
                  onChange={setSearchVal}
                  placeholder="e.g. B2B SaaS onboarding..."
                />

                <SelectInput
                  label="Primary Acquisition Channel"
                  value={selectVal}
                  onChange={(e) => setSelectVal(e.target.value)}
                  options={[
                    { label: 'Google Search Ads', value: 'search' },
                    { label: 'Meta & Instagram Ads', value: 'meta' },
                    { label: 'LinkedIn ABM', value: 'linkedin' },
                    { label: 'Organic SEO Topic Clusters', value: 'seo' },
                  ]}
                  helperText="Select channel for initial budget simulation."
                />

                <CurrencyInput
                  label="Monthly Ad Spend Budget"
                  value={currencyVal}
                  currency={selectedCurrency}
                  onChange={(val, cur) => {
                    setCurrencyVal(val);
                    setSelectedCurrency(cur);
                  }}
                  helperText="Supports live multi-currency modeling."
                />

                <NumberInput
                  label="Target ROAS Multiple (x)"
                  value={numberVal}
                  min={1}
                  max={20}
                  step={0.5}
                  unit="x"
                  onChange={setNumberVal}
                  helperText="Minimum return on ad spend acceptable for scaling."
                />

                <div className="md:col-span-2">
                  <TextArea
                    label="Product Value Proposition & Core Angle"
                    value={textAreaVal}
                    maxLength={300}
                    onChange={(e) => setTextAreaVal(e.target.value)}
                    helperText="Dissected by the AI engine to match customer objections."
                    required
                  />
                </div>

                <DateInput
                  label="Campaign Launch Flight Date"
                  value={dateVal}
                  onChange={(e) => setDateVal(e.target.value)}
                  helperText="Primary start date for multi-channel spend pacing."
                />

                <div className="flex flex-col justify-center">
                  <Checkbox
                    label="Enforce Break-Even Ad Spend Guardrail"
                    checked={chkVal}
                    onChange={() => setChkVal(!chkVal)}
                    helperText="Automatically alerts if ROAS drops below break-even threshold."
                  />
                </div>

                <div className="md:col-span-2">
                  <RadioGroup
                    name="growthStrategy"
                    label="Risk Tolerance & Scaling Pace"
                    value={radioVal}
                    onChange={setRadioVal}
                    direction="horizontal"
                    options={[
                      {
                        label: 'Conservative',
                        value: 'conservative',
                        description: 'Maximize cash flow and maintain > 5.0x ROAS margin floor.',
                      },
                      {
                        label: 'Aggressive Scale',
                        value: 'aggressive',
                        description: 'Maximize top-line volume with break-even margin tolerance.',
                      },
                      {
                        label: 'Experimental Sprints',
                        value: 'sprint',
                        description: 'Allocate 20% testing budget to emerging channel hooks.',
                      },
                    ]}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 5: DATA VISUALIZATION & CHARTS */}
        {activeTab === 'dataviz' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Status Badges & Progress */}
            <Card className="p-6 bg-white border-slate-200">
              <h2 className="text-lg font-bold text-sparkline-midnight mb-2">
                Status Indicators & Metric Displays
              </h2>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <StatusBadge status="active" />
                <StatusBadge status="paused" />
                <StatusBadge status="completed" />
                <StatusBadge status="warning" />
                <StatusBadge status="failed" />
                <StatusBadge status="draft" />
                <span className="w-px h-6 bg-slate-200 mx-1" />
                <TrendIndicator value={18.5} isPositive={true} />
                <TrendIndicator value={-6.4} isPositive={false} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                <MetricDisplay
                  label="Customer Acquisition Cost"
                  value="$42.50"
                  trend={{ value: -12.4, isPositive: true, period: 'vs last month' }}
                />
                <MetricDisplay
                  label="Monthly Conversions"
                  value="3,842"
                  trend={{ value: 22.8, isPositive: true }}
                />
                <MetricDisplay
                  label="Blended Payback Timeline"
                  value="42"
                  suffix="Days"
                  subtext="Target: < 60 days"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProgressBar value={78} label="Campaign Budget Pacing" color="blue" />
                <ProgressBar value={92} label="Conversion Readiness Score" color="purple" />
              </div>
            </Card>

            {/* Recharts Area & Donut Demonstrations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <ChartContainer
                  title="Predictive Revenue vs. Spend Trajectory"
                  subtitle="Demonstration dataset modeling monthly return curve"
                  isDemonstration={true}
                  height={280}
                >
                  <SparklineAreaChart
                    data={monthlyPerformanceData}
                    xKey="month"
                    series={[
                      { dataKey: 'revenue', name: 'Projected Revenue', color: chartColors.blue },
                      { dataKey: 'spend', name: 'Ad Spend', color: chartColors.orange },
                    ]}
                    yTickFormatter={(val) => `$${val / 1000}k`}
                  />
                </ChartContainer>
              </div>

              <div className="lg:col-span-4">
                <ChartContainer
                  title="Spend Distribution"
                  subtitle="Active channel weighting"
                  isDemonstration={true}
                  height={280}
                >
                  <SparklineDonutChart
                    data={channelBreakdownData}
                    centerLabel="Total Budget"
                    centerValue="$48.2k"
                  />
                </ChartContainer>
              </div>
            </div>

            {/* Recharts Line & Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer
                title="ROAS Trajectory Trend"
                subtitle="Weekly effective return on ad spend multiple"
                isDemonstration={true}
                height={260}
              >
                <SparklineLineChart
                  data={monthlyPerformanceData}
                  xKey="month"
                  series={[{ dataKey: 'roas', name: 'ROAS Multiple', color: chartColors.purple }]}
                  yTickFormatter={(val) => `${val}x`}
                />
              </ChartContainer>

              <ChartContainer
                title="Channel Conversion Performance"
                subtitle="Comparison of expected conversion volumes by platform"
                isDemonstration={true}
                height={260}
              >
                <SparklineBarChart
                  data={[
                    { channel: 'Google', conversions: 1840 },
                    { channel: 'Meta', conversions: 1120 },
                    { channel: 'LinkedIn', conversions: 650 },
                    { channel: 'TikTok', conversions: 430 },
                    { channel: 'SEO', conversions: 890 },
                  ]}
                  xKey="channel"
                  series={[{ dataKey: 'conversions', name: 'Conversions', color: chartColors.blue }]}
                />
              </ChartContainer>
            </div>

            {/* DataTable */}
            <div>
              <h3 className="text-base font-bold text-sparkline-midnight mb-3">
                Responsive Data Table Component
              </h3>
              <DataTable
                data={sampleTableData}
                columns={[
                  { header: 'Channel', accessor: 'channel' },
                  { header: 'Ad Spend', accessor: 'spend' },
                  { header: 'ROAS', accessor: 'roas', sortable: true },
                  {
                    header: 'Status',
                    accessor: (row) => <StatusBadge status={row.status} />,
                  },
                ]}
                keyExtractor={(item) => item.id}
                pageSize={4}
              />
            </div>

            {/* Empty State Demonstration */}
            <div>
              <h3 className="text-base font-bold text-sparkline-midnight mb-3">
                Empty State Component
              </h3>
              <EmptyState
                title="No Ad Platform Connected"
                description="Connect your Google Ads or Meta account in Phase 14 to import live historical attribution data."
                actionText="Explore Mock Workspace"
                onAction={() => addToast({ type: 'info', title: 'Switched to demonstration data workspace' })}
              />
            </div>
          </div>
        )}

        {/* TAB 6: MARKETING-SPECIFIC COMPONENTS */}
        {activeTab === 'marketing' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* KPI Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <MarketingKPIBadge kpiName="Blended CAC" status="optimal" />
              <MarketingKPIBadge kpiName="Conversion Rate" status="exceeding" />
              <MarketingKPIBadge kpiName="Ad Frequency" status="at-risk" />
              <MarketingKPIBadge kpiName="Email Deliverability" status="underperforming" />
            </div>

            {/* MarketingMetricCard & MarketingRecommendationCard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MarketingMetricCard
                name="Blended CAC"
                value="$38.40"
                change={-14.2}
                isPositive={true}
                tooltipExplanation="Customer acquisition cost blended across all paid and organic channels"
              />

              <MarketingRecommendationCard
                title="Expand B2B Search Budget"
                explanation="High-intent keyword cluster identified with low competitive bid pressure ($1.80 CPC vs $4.20 industry average)."
                expectedBenefit="+35% high-intent conversions"
                priority="High"
                suggestedAction="Reallocate Spend"
                channel="Google Search"
                onExecute={() => addToast({ type: 'success', title: 'Spend Reallocated' })}
              />
            </div>

            {/* AI Analysis Panel */}
            <AIAnalysisPanel
              insight="Audience frequency on top Meta creative reached 3.8x. Shift 20% budget to Google Search."
              supportingExplanation="Performance data indicates creative exhaustion on lookalike audiences. High-intent search terms currently possess uncaptured volume with low competitive bids."
              assumptions={[
                'Search conversion rate maintains 3.8% historical average',
                'Meta creative refresh turnaround is under 5 business days',
              ]}
              confidence={92}
              recommendedNextAction="Reallocate $5,000 to Google Search campaigns"
              onExecuteAction={() => addToast({ type: 'success', title: 'Action Dispatched', message: 'Reallocation scheduled.' })}
            />

            {/* Budget Allocation & Campaign Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BudgetAllocationCard
                channel="Google Search Advertising"
                allocatedBudget={24500}
                totalBudget={50000}
                targetRoas={5.2}
                color="blue"
              />

              <CampaignStatusCard
                campaignName="Q4 Product Launch - Demand Generation"
                platform="Google"
                status="active"
                performance={{
                  impressions: 245000,
                  clicks: 8940,
                  conversions: 1420,
                  spend: 18200,
                  roas: 4.85,
                }}
              />
            </div>

            {/* Marketing Score Card */}
            <div className="max-w-xl">
              <MarketingScoreCard
                score={88}
                evaluationCategory="Conversion Readiness & Unit Economics"
                benchmarkComparison="Top 12% among B2B SaaS platforms"
                explanation="Your product margin structure comfortably supports higher CPC thresholds while maintaining payback within 45 days."
                improvementSuggestions={[
                  'Deploy dedicated landing page for high-intent search keywords',
                  'Activate exit-intent lead magnet to capture top-funnel research traffic',
                ]}
              />
            </div>
          </div>
        )}

        {/* TAB 7: FEEDBACK & MODALS */}
        {activeTab === 'feedback' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <Card className="p-6 bg-white border-slate-200">
              <h2 className="text-lg font-bold text-sparkline-midnight mb-2">
                Toast Notification Triggers
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Click below to trigger live toast messages in the viewport.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    addToast({
                      type: 'success',
                      title: 'Strategy Saved',
                      message: 'The strategy blueprint has been saved to your workspace.',
                    })
                  }
                >
                  Trigger Success Toast
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    addToast({
                      type: 'warning',
                      title: 'Budget Limit Approaching',
                      message: 'Google Ads budget is at 88% of monthly limit.',
                    })
                  }
                >
                  Trigger Warning Toast
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    addToast({
                      type: 'error',
                      title: 'Export Failed',
                      message: 'PDF generator encountered a server timeout.',
                    })
                  }
                >
                  Trigger Error Toast
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    addToast({
                      type: 'info',
                      title: 'Market Data Sync',
                      message: 'Competitor keyword updates finished syncing.',
                    })
                  }
                >
                  Trigger Info Toast
                </Button>
              </div>
            </Card>

            {/* Modals & Tooltips */}
            <Card className="p-6 bg-white border-slate-200">
              <h2 className="text-lg font-bold text-sparkline-midnight mb-4">
                Interactive Modals & Dialogs
              </h2>

              <div className="flex flex-wrap items-center gap-4">
                <Button onClick={() => setIsModalOpen(true)}>
                  Open Standard Modal
                </Button>
                <Button variant="outline" onClick={() => setIsConfirmOpen(true)}>
                  Open Confirmation Dialog
                </Button>

                <Tooltip content="Tooltip showing helpful context on hover & focus">
                  <span className="inline-flex items-center gap-1 text-xs text-sparkline-blue font-semibold cursor-help border border-blue-200 bg-blue-50 px-3 py-2 rounded-xl">
                    <HelpCircle className="w-4 h-4" />
                    <span>Hover or Focus for Tooltip</span>
                  </span>
                </Tooltip>
              </div>

              {/* Standard Modal */}
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Run Campaign Optimization"
                description="Adjust target parameters for automated scenario modeling"
                footer={
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsModalOpen(false);
                        addToast({ type: 'success', title: 'Optimization Launched' });
                      }}
                    >
                      Start Analysis
                    </Button>
                  </>
                }
              >
                <p className="leading-relaxed">
                  The optimizer will evaluate spend across search, paid social, and newsletter channels
                  based on historical conversion rates and target payback windows.
                </p>
              </Modal>

              {/* Confirmation Dialog */}
              <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() =>
                  addToast({ type: 'info', title: 'Action confirmed successfully.' })
                }
                title="Archive Campaign Record?"
                message="Are you sure you want to archive this campaign strategy? It will be moved to cold storage."
                isDestructive={true}
                confirmText="Archive Campaign"
              />
            </Card>

            {/* Spinners & Skeletons */}
            <Card className="p-6 bg-white border-slate-200">
              <h2 className="text-lg font-bold text-sparkline-midnight mb-4">
                Loading & Error States
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="p-4 rounded-xl bg-slate-50 text-center">
                  <span className="text-xs text-slate-500 block mb-3 font-semibold">
                    Spinners (sm, md, lg)
                  </span>
                  <div className="flex items-center justify-center gap-4">
                    <LoadingSpinner size="sm" />
                    <LoadingSpinner size="md" />
                    <LoadingSpinner size="lg" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50">
                  <span className="text-xs text-slate-500 block mb-3 font-semibold">
                    Skeleton Placeholder
                  </span>
                  <div className="space-y-2">
                    <SkeletonLoader variant="text" />
                    <SkeletonLoader variant="text" className="w-2/3" />
                  </div>
                </div>

                <div>
                  <ErrorState
                    title="Simulation Timeout"
                    message="Model was unable to compute within 5 seconds."
                    onRetry={() => addToast({ type: 'info', title: 'Retrying calculation...' })}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
