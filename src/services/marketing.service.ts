import { MetricCardData, OpportunityInsight, MarketingTool } from '@/types';

/**
 * Service providing structured demonstration intelligence data.
 * All demonstration metrics are explicitly flagged to avoid misleading users.
 */
export const marketingService = {
  getDemonstrationMetrics(): MetricCardData[] {
    return [
      {
        id: 'metric-campaigns',
        title: 'Total Campaigns',
        value: '24',
        change: 14.2,
        period: 'vs previous 30 days',
        isPositive: true,
        chartData: [12, 14, 15, 18, 19, 22, 24],
        category: 'campaigns',
        isDemonstration: true,
      },
      {
        id: 'metric-spend',
        title: 'Advertising Spend',
        value: '$48,250',
        change: -6.4,
        period: 'budget efficiency gain',
        isPositive: true,
        chartData: [52000, 51000, 49500, 49000, 48250],
        category: 'spend',
        isDemonstration: true,
      },
      {
        id: 'metric-conversions',
        title: 'Conversions',
        value: '3,842',
        change: 22.8,
        period: 'vs previous 30 days',
        isPositive: true,
        chartData: [2600, 2800, 3100, 3400, 3842],
        category: 'conversions',
        isDemonstration: true,
      },
      {
        id: 'metric-roas',
        title: 'Average ROAS',
        value: '4.85x',
        change: 18.5,
        period: 'predicted baseline: 3.8x',
        isPositive: true,
        chartData: [3.4, 3.8, 4.1, 4.5, 4.85],
        category: 'roas',
        isDemonstration: true,
      },
    ];
  },

  getDemonstrationOpportunities(): OpportunityInsight[] {
    return [
      {
        id: 'opp-1',
        title: 'Search Intent Arbitrage in B2B MarTech',
        description:
          'High buyer-intent keyword cluster identified with low competitive bid pressure ($1.80 CPC vs $4.20 industry average).',
        channel: 'Google Search Ads',
        impact: 'High',
        projectedRoas: 5.2,
        category: 'SEO & Search',
      },
      {
        id: 'opp-2',
        title: 'Vertical Video Creative Fatigue Reset',
        description:
          'Audience frequency exceeded 3.8x on top Meta ad set. Generating 3 dynamic product hook variants will restore 20%+ CTR.',
        channel: 'Meta & Instagram',
        impact: 'Medium',
        projectedRoas: 4.1,
        category: 'Creative Intelligence',
      },
      {
        id: 'opp-3',
        title: 'Executive Thought Leadership Gap',
        description:
          'Competitor share-of-voice decreased by 35% on LinkedIn organic articles. Prime window to capture category authority.',
        channel: 'LinkedIn Content',
        impact: 'High',
        projectedRoas: 6.0,
        category: 'Organic Growth',
      },
    ];
  },

  getAllTools(): MarketingTool[] {
    return [
      {
        id: 'tool-strategist',
        title: 'AI Marketing Strategist',
        slug: 'ai-marketing-strategist',
        category: 'Strategy',
        description: 'Transforms your product UVP into tailored, actionable marketing execution blueprints.',
        icon: 'Brain',
        status: 'preview',
        badge: 'Core Engine',
        route: '/dashboard/strategist',
      },
      {
        id: 'tool-research',
        title: 'Market Research Suite',
        slug: 'market-research-suite',
        category: 'Research',
        description: 'Analyzes target demographics, buyer personas, and addressable market size (TAM/SAM).',
        icon: 'Search',
        status: 'preview',
        route: '/dashboard/market-research',
      },
      {
        id: 'tool-competitor',
        title: 'Competitor Intelligence',
        slug: 'competitor-intelligence',
        category: 'Research',
        description: 'Decodes competitor positioning, ad angles, keyword targeting, and market share.',
        icon: 'Target',
        status: 'preview',
        badge: 'Popular',
        route: '/dashboard/competitors',
      },
      {
        id: 'tool-budget',
        title: 'Dynamic Budget Planner',
        slug: 'dynamic-budget-planner',
        category: 'Finance',
        description: 'Allocates ad spend across channels with multi-currency conversion and cash pacing.',
        icon: 'Calculator',
        status: 'preview',
        route: '/dashboard/budget',
      },
      {
        id: 'tool-metrics',
        title: 'Marketing Metrics Hub',
        slug: 'marketing-metrics-hub',
        category: 'Finance',
        description: 'Calculates CAC, Customer Lifetime Value (LTV), Payback Period, and blended ROAS.',
        icon: 'BarChart3',
        status: 'preview',
        route: '/dashboard/metrics',
      },
      {
        id: 'tool-campaigns',
        title: 'Campaign Studio',
        slug: 'campaign-studio',
        category: 'Execution',
        description: 'Plans multi-channel flight schedules, impression projections, and messaging frameworks.',
        icon: 'Megaphone',
        status: 'in-development',
        route: '/dashboard/campaigns',
      },
      {
        id: 'tool-content',
        title: 'Content Studio',
        slug: 'content-studio',
        category: 'Execution',
        description: 'Generates SEO topic clusters, editorial calendars, and content angle recommendations.',
        icon: 'Sparkles',
        status: 'in-development',
        route: '/dashboard/content-studio',
      },
      {
        id: 'tool-reports',
        title: 'Executive Report Generator',
        slug: 'executive-report-generator',
        category: 'Reporting',
        description: 'Exports comprehensive stakeholder presentations with growth curves and KPI dashboards.',
        icon: 'FileText',
        status: 'in-development',
        route: '/dashboard/reports',
      },
    ];
  },
};

