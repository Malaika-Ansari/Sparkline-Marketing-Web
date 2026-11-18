import React from 'react';
import { Card } from '@/components/common/Card';
import { SkeletonLoader } from '@/components/common/Feedback';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

export interface ChartContainerProps {
  title: string;
  subtitle?: string;
  isDemonstration?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  timeFilterElement?: React.ReactNode;
  height?: number | string;
  children: React.ReactNode;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  isDemonstration = true,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'No performance data available for the selected period.',
  timeFilterElement,
  height = 300,
  children,
  className,
}) => {
  return (
    <Card className={cn('p-6 border-slate-200/90 bg-white flex flex-col justify-between', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-sparkline-midnight tracking-tight">
              {title}
            </h3>
            {isDemonstration && (
              <span
                className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-200/70"
                title="Illustrative demonstration data"
              >
                <Info className="w-3 h-3 text-amber-600" />
                <span>Demo Data</span>
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {timeFilterElement && <div className="shrink-0">{timeFilterElement}</div>}
      </div>

      {/* Chart Body */}
      <div className="w-full relative" style={{ height }}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <SkeletonLoader variant="chart" className="h-full" />
          </div>
        ) : isEmpty ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
};
