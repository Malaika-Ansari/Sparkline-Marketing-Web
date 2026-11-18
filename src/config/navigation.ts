import { NavItem } from '@/types';

export const publicNavItems: NavItem[] = [
  {
    title: 'Features',
    href: '/features',
    description: 'Explore the full intelligence suite and decision-making engine.',
  },
  {
    title: 'Marketing Tools',
    href: '/tools',
    description: 'Precision calculators, AI planners, and competitive intelligence tools.',
    children: [
      {
        title: 'AI Marketing Strategist',
        href: '/dashboard/strategist',
        description: 'Generate customized multi-channel go-to-market roadmaps.',
      },
      {
        title: 'Budget Planner & Forecaster',
        href: '/dashboard/budget',
        description: 'Model spend scenarios and currency exchange allocations.',
      },
      {
        title: 'Competitor Intelligence',
        href: '/dashboard/competitors',
        description: 'Map competitor positioning and discover market gaps.',
      },
      {
        title: 'Marketing Metrics Hub',
        href: '/dashboard/metrics',
        description: 'Calculate CAC, LTV, blended ROAS and key ratios.',
      },
      {
        title: 'All Tools Directory',
        href: '/tools',
        description: 'Browse the entire catalog of marketing utilities.',
      },
    ],
  },
  {
    title: 'Marketing Academy',
    href: '/marketing-academy',
    description: 'Master data-driven marketing playbooks and growth frameworks.',
  },
  {
    title: 'Pricing',
    href: '/pricing',
    description: 'Transparent plans for freelancers, growing brands, and agencies.',
  },
];

export interface SidebarNavItem {
  id: string;
  title: string;
  href: string;
  icon: string;
  badge?: string;
  description?: string;
}

export interface SidebarNavGroup {
  id: string;
  title: string;
  items: SidebarNavItem[];
}

export const sidebarNavGroups: SidebarNavGroup[] = [
  {
    id: 'overview',
    title: 'OVERVIEW',
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        href: '/dashboard',
        icon: 'LayoutDashboard',
      },
      {
        id: 'analytics',
        title: 'Advanced Analytics',
        href: '/dashboard/analytics',
        icon: 'BarChart3',
        badge: 'Live',
      },
    ],
  },
  {
    id: 'intelligence',
    title: 'INTELLIGENCE',
    items: [
      {
        id: 'strategist',
        title: 'AI Marketing Strategist',
        href: '/dashboard/strategist',
        icon: 'Brain',
        badge: 'AI Core',
      },
      {
        id: 'market-research',
        title: 'Market Research',
        href: '/dashboard/market-research',
        icon: 'Search',
      },
      {
        id: 'audience',
        title: 'Audience Intelligence',
        href: '/dashboard/audience',
        icon: 'Users',
      },
      {
        id: 'competitor-analysis',
        title: 'Competitor Analysis',
        href: '/dashboard/competitors',
        icon: 'Target',
      },
    ],
  },
  {
    id: 'planning',
    title: 'PLANNING',
    items: [
      {
        id: 'strategy',
        title: 'Marketing Strategy',
        href: '/dashboard/strategy',
        icon: 'Compass',
      },
      {
        id: 'budget-planner',
        title: 'Budget Planner',
        href: '/dashboard/budget',
        icon: 'Calculator',
      },
      {
        id: 'currency-calculator',
        title: 'Currency & Costs',
        href: '/dashboard/currency',
        icon: 'Coins',
        badge: 'Multi-FX',
      },
      {
        id: 'campaign-planner',
        title: 'Campaign Planner',
        href: '/dashboard/campaigns',
        icon: 'Megaphone',
      },
      {
        id: 'calendar',
        title: 'Marketing Calendar',
        href: '/dashboard/calendar',
        icon: 'Calendar',
      },
    ],
  },
  {
    id: 'marketing-tools',
    title: 'MARKETING TOOLS',
    items: [
      {
        id: 'social-studio',
        title: 'Social Media Studio',
        href: '/dashboard/social-studio',
        icon: 'Share2',
      },
      {
        id: 'content-studio',
        title: 'Content Studio',
        href: '/dashboard/content-studio',
        icon: 'Sparkles',
      },
      {
        id: 'seo',
        title: 'SEO Intelligence',
        href: '/dashboard/seo',
        icon: 'Globe',
      },
      {
        id: 'forecast',
        title: 'Results Predictor',
        href: '/dashboard/forecast',
        icon: 'TrendingUp',
        badge: 'Predictor',
      },
      {
        id: 'metrics',
        title: 'Marketing Metrics',
        href: '/dashboard/metrics',
        icon: 'BarChart3',
      },
      {
        id: 'roi-calculator',
        title: 'ROI & ROAS Calculator',
        href: '/dashboard/roi-calculator',
        icon: 'TrendingUp',
      },
    ],
  },
  {
    id: 'management',
    title: 'MANAGEMENT',
    items: [
      {
        id: 'projects',
        title: 'My Projects',
        href: '/dashboard/projects',
        icon: 'FolderKanban',
      },
      {
        id: 'reports',
        title: 'Reports',
        href: '/dashboard/reports',
        icon: 'FileText',
      },
      {
        id: 'integrations',
        title: 'Integrations',
        href: '/dashboard/integrations',
        icon: 'Boxes',
      },
    ],
  },
  {
    id: 'account',
    title: 'ACCOUNT',
    items: [
      {
        id: 'settings',
        title: 'Account Settings',
        href: '/dashboard/settings/account',
        icon: 'User',
      },
      {
        id: 'security',
        title: 'Security Center',
        href: '/dashboard/security',
        icon: 'ShieldCheck',
        badge: 'Protected',
      },
      {
        id: 'help',
        title: 'Help & Support',
        href: '/dashboard/help',
        icon: 'HelpCircle',
      },
    ],
  },
];

export const sidebarNavItems = sidebarNavGroups.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    category: group.id as 'core' | 'intelligence' | 'execution' | 'system',
  }))
);

