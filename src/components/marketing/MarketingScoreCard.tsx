import React from 'react';
import { Card } from '@/components/common/Card';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MarketingScoreCardProps {
  score: number; // 0 to 100
  evaluationCategory: string;
  explanation: string;
  improvementSuggestions: string[];
  benchmarkComparison?: string;
  className?: string;
}

export const MarketingScoreCard: React.FC<MarketingScoreCardProps> = ({
  score,
  evaluationCategory,
  explanation,
  improvementSuggestions,
  benchmarkComparison,
  className,
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-600 border-emerald-500 bg-emerald-50';
    if (val >= 60) return 'text-sparkline-blue border-sparkline-blue bg-blue-50';
    if (val >= 40) return 'text-sparkline-orange border-sparkline-orange bg-orange-50';
    return 'text-rose-600 border-rose-500 bg-rose-50';
  };

  return (
    <Card className={cn('p-6 border-slate-200/90 bg-white', className)}>
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Health Evaluation
          </span>
          <h4 className="text-base font-bold text-sparkline-midnight mt-0.5">
            {evaluationCategory}
          </h4>
          {benchmarkComparison && (
            <span className="text-xs text-slate-500 mt-0.5 block">
              {benchmarkComparison}
            </span>
          )}
        </div>

        {/* Circular Score Badge */}
        <div
          className={cn(
            'w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 shadow-subtle',
            getScoreColor(score)
          )}
        >
          <span className="text-2xl font-black font-display tracking-tight leading-none">
            {score}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">
            / 100
          </span>
        </div>
      </div>

      <div className="py-4">
        <p className="text-xs text-slate-600 leading-relaxed">{explanation}</p>

        {improvementSuggestions.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-sparkline-midnight uppercase tracking-wider block mb-2">
              Optimization Steps:
            </span>
            <ul className="space-y-2">
              {improvementSuggestions.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-sparkline-blue shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};
