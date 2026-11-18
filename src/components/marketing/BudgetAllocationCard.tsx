import React from 'react';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/DataViz';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface BudgetAllocationCardProps {
  channel: string;
  allocatedBudget: number;
  totalBudget: number;
  currency?: string;
  color?: 'blue' | 'purple' | 'magenta' | 'cyan' | 'orange' | 'emerald';
  targetRoas?: number;
  className?: string;
}

export const BudgetAllocationCard: React.FC<BudgetAllocationCardProps> = ({
  channel,
  allocatedBudget,
  totalBudget,
  currency = 'USD',
  color = 'blue',
  targetRoas,
  className,
}) => {
  const percentage = totalBudget > 0 ? (allocatedBudget / totalBudget) * 100 : 0;

  return (
    <Card className={cn('p-5 border-slate-200/90 bg-white', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-sparkline-midnight">{channel}</span>
        <span className="text-xs font-mono font-bold text-sparkline-midnight">
          {formatCurrency(allocatedBudget, currency)}
        </span>
      </div>

      <ProgressBar
        value={percentage}
        max={100}
        color={color}
        size="md"
        showPercentage={true}
      />

      <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2.5 border-t border-slate-100">
        <span>Share of Spend</span>
        {targetRoas && (
          <span>
            Target ROAS: <strong className="text-sparkline-midnight">{targetRoas}x</strong>
          </span>
        )}
      </div>
    </Card>
  );
};

