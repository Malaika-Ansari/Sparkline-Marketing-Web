import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MarketingRecommendationCardProps {
  title: string;
  explanation: string;
  expectedBenefit: string;
  priority: 'High' | 'Medium' | 'Low';
  suggestedAction: string;
  channel?: string;
  onExecute?: () => void;
  className?: string;
}

export const MarketingRecommendationCard: React.FC<MarketingRecommendationCardProps> = ({
  title,
  explanation,
  expectedBenefit,
  priority,
  suggestedAction,
  channel,
  onExecute,
  className,
}) => {
  const priorityVariants = {
    High: 'orange' as const,
    Medium: 'blue' as const,
    Low: 'neutral' as const,
  };

  return (
    <Card className={cn('p-5 border-slate-200/90 hover:border-sparkline-blue/40 transition-all bg-white', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-50 text-sparkline-blue">
            <Sparkles className="w-4 h-4" />
          </span>
          {channel && (
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {channel}
            </span>
          )}
        </div>
        <Badge variant={priorityVariants[priority]} size="sm">
          {priority} Priority
        </Badge>
      </div>

      <h4 className="text-sm font-bold text-sparkline-midnight mt-3 leading-snug">
        {title}
      </h4>

      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
        {explanation}
      </p>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <span className="text-slate-500">
          Expected Benefit:{' '}
          <strong className="text-emerald-700 font-semibold">{expectedBenefit}</strong>
        </span>
        <Button
          onClick={onExecute}
          variant="outline"
          size="sm"
          rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
        >
          {suggestedAction}
        </Button>
      </div>
    </Card>
  );
};

