import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ArrowRight, Sparkles, TrendingUp, TrendingDown, Info, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'dark' | 'interactive' | 'bordered';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  hoverEffect = false,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-slate-200/80 shadow-card text-sparkline-midnight',
    subtle: 'bg-slate-50/70 border border-slate-200/60 shadow-subtle text-sparkline-midnight',
    dark: 'bg-sparkline-slate border border-white/10 shadow-premium text-white',
    bordered: 'bg-white border-2 border-slate-200 shadow-none text-sparkline-midnight',
    interactive:
      'bg-white border border-slate-200/80 shadow-card hover:border-sparkline-blue/40 hover:shadow-card-hover transition-all duration-300 text-sparkline-midnight cursor-pointer',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-6 relative overflow-hidden',
        variants[variant],
        hoverEffect &&
          'hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const BaseCard = Card;

// 1. FeatureCard Component
export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  to?: string;
  linkText?: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  badge,
  to,
  linkText = 'Learn More',
  className,
}) => {
  return (
    <Card hoverEffect className={cn('flex flex-col justify-between group', className)}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-sparkline-blue flex items-center justify-center group-hover:bg-sparkline-blue group-hover:text-white transition-colors duration-200">
            {icon}
          </div>
          {badge && <Badge variant="blue" size="sm">{badge}</Badge>}
        </div>
        <h3 className="text-base font-bold text-sparkline-midnight group-hover:text-sparkline-blue transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          {description}
        </p>
      </div>

      {to && (
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sparkline-blue">
          <Link to={to} className="flex items-center gap-1 hover:underline">
            <span>{linkText}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </Card>
  );
};

// 2. MetricCard Component
export interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  period?: string;
  isPositive?: boolean;
  tooltipText?: string;
  badge?: string;
  chartComponent?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  period,
  isPositive = true,
  tooltipText,
  badge,
  chartComponent,
  className,
}) => {
  return (
    <Card className={cn('p-5 flex flex-col justify-between border-slate-200/90', className)}>
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          {tooltipText && (
            <span title={tooltipText} className="cursor-help text-slate-400 hover:text-slate-600">
              <Info className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
        {badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-3">
        <div>
          <div className="text-2xl font-bold font-display text-sparkline-midnight tracking-tight">
            {value}
          </div>
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span
                className={cn(
                  'inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded',
                  isPositive
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-rose-700 bg-rose-50'
                )}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                )}
                {change > 0 ? `+${change}%` : `${change}%`}
              </span>
              {period && (
                <span className="text-[11px] text-slate-400 font-normal">
                  {period}
                </span>
              )}
            </div>
          )}
        </div>

        {chartComponent && <div className="shrink-0 pl-2">{chartComponent}</div>}
      </div>
    </Card>
  );
};

// 3. AIInsightCard Component
export interface AIInsightCardProps {
  title: string;
  insight: string;
  category?: string;
  confidenceScore?: number;
  recommendedAction?: string;
  actionUrl?: string;
  className?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  title,
  insight,
  category = 'Growth Angle',
  confidenceScore = 92,
  recommendedAction,
  actionUrl,
  className,
}) => {
  return (
    <Card
      className={cn(
        'p-5 border-sparkline-purple/30 bg-gradient-to-br from-white via-purple-50/20 to-purple-50/40 relative overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between pb-3 border-b border-purple-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sparkline-purple text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold text-sparkline-purple uppercase tracking-wider">
            AI Intelligence Insight • {category}
          </span>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-sparkline-purple">
          {confidenceScore}% CONFIDENCE
        </span>
      </div>

      <h4 className="text-sm font-bold text-sparkline-midnight mt-3">
        {title}
      </h4>

      <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
        {insight}
      </p>

      {recommendedAction && (
        <div className="mt-4 pt-3 border-t border-purple-100/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Action:{' '}
            <strong className="text-sparkline-midnight font-semibold">
              {recommendedAction}
            </strong>
          </span>
          {actionUrl && (
            <Link
              to={actionUrl}
              className="text-sparkline-purple hover:text-purple-800 font-semibold inline-flex items-center gap-1"
            >
              <span>Execute</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}
    </Card>
  );
};

// 4. RecommendationCard Component
export interface RecommendationCardProps {
  title: string;
  description: string;
  impact?: 'High' | 'Medium' | 'Low';
  channel?: string;
  expectedBenefit?: string;
  ctaText?: string;
  onAction?: () => void;
  to?: string;
  className?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  description,
  impact = 'High',
  channel,
  expectedBenefit,
  ctaText = 'Apply Strategy',
  onAction,
  to,
  className,
}) => {
  const impactVariants = {
    High: 'orange' as const,
    Medium: 'blue' as const,
    Low: 'neutral' as const,
  };

  return (
    <Card className={cn('p-5 border-slate-200/90 hover:border-sparkline-blue/40 transition-all', className)}>
      <div className="flex items-start justify-between gap-3">
        {channel && (
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {channel}
          </span>
        )}
        <Badge variant={impactVariants[impact]} size="sm">
          {impact} Priority
        </Badge>
      </div>

      <h4 className="text-sm font-bold text-sparkline-midnight mt-2">
        {title}
      </h4>

      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
        {expectedBenefit && (
          <span className="text-slate-500">
            Projected Impact: <strong className="text-emerald-700 font-semibold">{expectedBenefit}</strong>
          </span>
        )}
        {to ? (
          <Button to={to} variant="outline" size="sm">
            {ctaText}
          </Button>
        ) : onAction ? (
          <Button onClick={onAction} variant="outline" size="sm">
            {ctaText}
          </Button>
        ) : null}
      </div>
    </Card>
  );
};

// 5. AnalyticsCard Component
export interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  actionElement?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  subtitle,
  actionElement,
  children,
  className,
}) => {
  return (
    <Card className={cn('p-6 border-slate-200/90 bg-white', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-sparkline-midnight tracking-tight">
            {title}
          </h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {actionElement && <div className="shrink-0">{actionElement}</div>}
      </div>
      <div>{children}</div>
    </Card>
  );
};

// 6. PricingCard Component
export interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaText?: string;
  highlight?: boolean;
  badge?: string;
  onSelect?: () => void;
  to?: string;
  className?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  period = '/month',
  description,
  features,
  ctaText = 'Get Started',
  highlight = false,
  badge,
  onSelect,
  to = '/dashboard',
  className,
}) => {
  return (
    <Card
      className={cn(
        'p-8 flex flex-col justify-between',
        highlight
          ? 'border-2 border-sparkline-blue shadow-premium relative'
          : 'border border-slate-200/90',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-sparkline-midnight">{name}</h3>
          {badge && <Badge variant="blue" size="sm">{badge}</Badge>}
        </div>
        <p className="text-xs text-slate-500 mt-2">{description}</p>

        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-sparkline-midnight font-display">
            {price}
          </span>
          <span className="text-xs text-slate-500">{period}</span>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Included Capabilities
          </div>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-xs text-slate-700">
                <Check className="w-4 h-4 text-sparkline-blue shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6">
        <Button
          to={to}
          onClick={onSelect}
          variant={highlight ? 'gradient' : 'outline'}
          size="md"
          className="w-full justify-center"
        >
          {ctaText}
        </Button>
      </div>
    </Card>
  );
};
