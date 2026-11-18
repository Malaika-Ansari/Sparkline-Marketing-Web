import React from 'react';
import { Card } from '@/components/common/Card';
import { TrendIndicator } from '@/components/common/DataViz';
import { Tooltip } from '@/components/common/Feedback';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MarketingMetricCardProps {
  name: string;
  value: string | number;
  change?: number;
  comparisonPeriod?: string;
  isPositive?: boolean;
  tooltipExplanation?: string;
  badge?: string;
  sparkline?: React.ReactNode;
  className?: string;
}

export const MarketingMetricCard: React.FC<MarketingMetricCardProps> = ({
  name,
  value,
  change,
  comparisonPeriod = 'vs previous 30 days',
  isPositive = true,
  tooltipExplanation,
  badge,
  sparkline,
  className,
}) => {
  return (
    <Card className={cn('p-5 flex flex-col justify-between border-slate-200/90', className)}>
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {name}
          </span>
          {tooltipExplanation && (
            <Tooltip content={tooltipExplanation}>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={`Explanation of ${name}`}
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
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
            <div className="flex items-center gap-2 mt-1.5">
              <TrendIndicator value={change} isPositive={isPositive} />
              <span className="text-[11px] text-slate-400 font-normal">
                {comparisonPeriod}
              </span>
            </div>
          )}
        </div>

        {sparkline && <div className="shrink-0 pl-2">{sparkline}</div>}
      </div>
    </Card>
  );
};

