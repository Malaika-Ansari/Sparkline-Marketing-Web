/**
 * Core domain types for Sparkline Marketing Intelligence Platform
 */
export interface NavItem {
    title: string;
    href: string;
    description?: string;
    iconName?: string;
    badge?: string;
    isExternal?: boolean;
    children?: NavItem[];
}
export interface MetricCardData {
    id: string;
    title: string;
    value: string;
    change: number;
    period: string;
    isPositive: boolean;
    chartData: number[];
    category: 'campaigns' | 'spend' | 'conversions' | 'roas';
    isDemonstration: boolean;
}
export interface OpportunityInsight {
    id: string;
    title: string;
    description: string;
    channel: string;
    impact: 'High' | 'Medium' | 'Low';
    projectedRoas: number;
    category: string;
}
export interface MarketingTool {
    id: string;
    title: string;
    slug: string;
    category: 'Strategy' | 'Research' | 'Finance' | 'Execution' | 'Reporting';
    description: string;
    icon: string;
    status: 'available' | 'in-development' | 'preview';
    badge?: string;
    route: string;
}
export interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    ogType?: 'website' | 'article';
    ogImage?: string;
    noIndex?: boolean;
}
export * from './project';
export * from './strategy';
