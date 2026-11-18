import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'purple' | 'magenta' | 'cyan' | 'orange' | 'slate' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'blue',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    blue: 'bg-blue-50 text-sparkline-blue border-blue-200/60',
    purple: 'bg-purple-50 text-sparkline-purple border-purple-200/60',
    magenta: 'bg-pink-50 text-sparkline-magenta border-pink-200/60',
    cyan: 'bg-cyan-50 text-sparkline-cyan border-cyan-200/60',
    orange: 'bg-orange-50 text-sparkline-orange border-orange-200/60',
    slate: 'bg-sparkline-slate/10 text-sparkline-slate border-sparkline-slate/20',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border select-none transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

