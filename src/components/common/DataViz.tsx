import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, ArrowUpDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { Button } from '@/components/common/Button';

// 1. MetricDisplay
export interface MetricDisplayProps {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  subtext?: string;
  trend?: {
    value: number;
    isPositive?: boolean;
    period?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  label,
  value,
  prefix,
  suffix,
  subtext,
  trend,
  size = 'md',
  className,
}) => {
  const valueSizes = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-baseline gap-1 mt-1">
        {prefix && (
          <span className="text-lg font-bold text-slate-500">{prefix}</span>
        )}
        <span
          className={cn(
            'font-bold font-display text-sparkline-midnight tracking-tight',
            valueSizes[size]
          )}
        >
          {value}
        </span>
        {suffix && (
          <span className="text-sm font-semibold text-slate-500">{suffix}</span>
        )}
      </div>

      {(trend || subtext) && (
        <div className="flex items-center gap-2 mt-1.5 text-xs">
          {trend && (
            <TrendIndicator
              value={trend.value}
              isPositive={trend.isPositive}
              period={trend.period}
            />
          )}
          {subtext && <span className="text-slate-400">{subtext}</span>}
        </div>
      )}
    </div>
  );
};

// 2. TrendIndicator
export interface TrendIndicatorProps {
  value: number;
  isPositive?: boolean;
  period?: string;
  showIcon?: boolean;
  className?: string;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  isPositive = true,
  period,
  showIcon = true,
  className,
}) => {
  const isNeutral = value === 0;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full select-none',
        isNeutral
          ? 'bg-slate-100 text-slate-600'
          : isPositive
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
          : 'bg-rose-50 text-rose-700 border border-rose-200/60',
        className
      )}
    >
      {showIcon && (
        <>
          {isNeutral ? (
            <Minus className="w-3 h-3" />
          ) : isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
        </>
      )}
      <span>{value > 0 ? `+${value}%` : `${value}%`}</span>
      {period && <span className="font-normal text-slate-400 ml-0.5">{period}</span>}
    </span>
  );
};

// 3. ProgressBar
export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'purple' | 'magenta' | 'cyan' | 'orange' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'blue',
  size = 'md',
  className,
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const colors = {
    blue: 'bg-sparkline-blue',
    purple: 'bg-sparkline-purple',
    magenta: 'bg-sparkline-magenta',
    cyan: 'bg-sparkline-cyan',
    orange: 'bg-sparkline-orange',
    emerald: 'bg-emerald-500',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          {label && <span className="text-slate-600">{label}</span>}
          {showPercentage && (
            <span className="text-sparkline-midnight font-bold font-mono">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[color])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

// 4. StatusBadge
export type StatusType =
  | 'active'
  | 'paused'
  | 'draft'
  | 'completed'
  | 'warning'
  | 'failed';

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className }) => {
  const configs: Record<StatusType, { bg: string; text: string; dot: string; defaultLabel: string }> = {
    active: {
      bg: 'bg-emerald-50 border-emerald-200/70',
      text: 'text-emerald-800',
      dot: 'bg-emerald-500',
      defaultLabel: 'Active',
    },
    paused: {
      bg: 'bg-amber-50 border-amber-200/70',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      defaultLabel: 'Paused',
    },
    draft: {
      bg: 'bg-slate-100 border-slate-200',
      text: 'text-slate-700',
      dot: 'bg-slate-400',
      defaultLabel: 'Draft',
    },
    completed: {
      bg: 'bg-blue-50 border-blue-200/70',
      text: 'text-sparkline-blue',
      dot: 'bg-sparkline-blue',
      defaultLabel: 'Completed',
    },
    warning: {
      bg: 'bg-orange-50 border-orange-200/70',
      text: 'text-orange-800',
      dot: 'bg-sparkline-orange',
      defaultLabel: 'Action Needed',
    },
    failed: {
      bg: 'bg-rose-50 border-rose-200/70',
      text: 'text-rose-800',
      dot: 'bg-rose-500',
      defaultLabel: 'Failed',
    },
  };

  const config = configs[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} />
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};

// 5. DataTable
export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  pageSize?: number;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  pageSize = 5,
  emptyMessage = 'No records found',
  className,
}: DataTableProps<T>): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className={cn('w-full overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-card', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {columns.map((col, idx) => (
                <th key={idx} className={cn('px-5 py-3.5', col.className)}>
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-sparkline-midnight">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-8 text-center text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={keyExtractor(row, rowIdx)}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {columns.map((col, colIdx) => {
                    const content =
                      typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : (row[col.accessor] as unknown as React.ReactNode);
                    return (
                      <td key={colIdx} className={cn('px-5 py-3.5', col.className)}>
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {currentPage} of {totalPages} ({data.length} total entries)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 6. EmptyState
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-10 text-center flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/60',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-bold text-sparkline-midnight">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <div className="mt-5">
          <Button onClick={onAction} variant="outline" size="sm">
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

