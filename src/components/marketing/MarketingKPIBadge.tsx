import React from 'react';
import { cn } from '@/lib/utils';

export type KPIStatus = 'optimal' | 'at-risk' | 'exceeding' | 'underperforming' | 'neutral';

export interface MarketingKPIBadgeProps {
  kpiName: string;
  status: KPIStatus;
  statusText?: string;
  className?: string;
}

export const MarketingKPIBadge: React.FC<MarketingKPIBadgeProps> = ({
  kpiName,
  status,
  statusText,
  className,
}) => {
  const configs: Record<KPIStatus, { bg: string; text: string; dot: string; defaultLabel: string }> = {
    optimal: {
      bg: 'bg-emerald-50 border-emerald-200/80',
      text: 'text-emerald-800',
      dot: 'bg-emerald-500',
      defaultLabel: 'Optimal',
    },
    exceeding: {
      bg: 'bg-blue-50 border-blue-200/80',
      text: 'text-sparkline-blue',
      dot: 'bg-sparkline-blue',
      defaultLabel: 'Exceeding Target',
    },
    'at-risk': {
      bg: 'bg-amber-50 border-amber-200/80',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      defaultLabel: 'At Risk',
    },
    underperforming: {
      bg: 'bg-rose-50 border-rose-200/80',
      text: 'text-rose-800',
      dot: 'bg-rose-500',
      defaultLabel: 'Underperforming',
    },
    neutral: {
      bg: 'bg-slate-100 border-slate-200',
      text: 'text-slate-700',
      dot: 'bg-slate-400',
      defaultLabel: 'Monitoring',
    },
  };

  const config = configs[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-medium border select-none',
        config.bg,
        className
      )}
    >
      <span className="font-bold text-sparkline-midnight">{kpiName}</span>
      <span className="w-1 h-1 rounded-full bg-slate-300" />
      <span className={cn('flex items-center gap-1.5 font-semibold', config.text)}>
        <span className={cn('w-2 h-2 rounded-full', config.dot)} />
        <span>{statusText || config.defaultLabel}</span>
      </span>
    </div>
  );
};

