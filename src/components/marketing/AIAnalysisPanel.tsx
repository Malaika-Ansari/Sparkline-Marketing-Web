import React from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Sparkles, Brain, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AIAnalysisPanelProps {
  insight: string;
  supportingExplanation: string;
  assumptions: string[];
  confidence: number; // 0 to 100
  recommendedNextAction: string;
  onExecuteAction?: () => void;
  className?: string;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  insight,
  supportingExplanation,
  assumptions,
  confidence,
  recommendedNextAction,
  onExecuteAction,
  className,
}) => {
  return (
    <Card
      className={cn(
        'p-6 sm:p-7 border-sparkline-purple/30 bg-gradient-to-br from-white via-purple-50/20 to-purple-50/40 relative overflow-hidden',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sparkline-purple text-white flex items-center justify-center shadow-sm">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-sparkline-midnight">
              AI Algorithmic Strategy Analysis
            </h4>
            <span className="text-[11px] text-slate-500">
              Multi-factor competitive & unit economics evaluation
            </span>
          </div>
        </div>

        {/* Confidence Indicator Meter */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Confidence
            </span>
            <span className="text-xs font-bold font-mono text-sparkline-purple">
              {confidence}%
            </span>
          </div>
          <div className="w-16 h-2 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-sparkline-purple rounded-full transition-all duration-500"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Core Insight Callout */}
      <div className="my-5 p-4 rounded-xl bg-white border border-purple-100/80 shadow-subtle">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-sparkline-purple shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-sparkline-midnight leading-relaxed">
            "{insight}"
          </p>
        </div>
      </div>

      {/* Supporting Explanation */}
      <div className="space-y-3">
        <h5 className="text-xs font-bold text-sparkline-midnight uppercase tracking-wider text-slate-500">
          Supporting Strategic Rationale
        </h5>
        <p className="text-xs text-slate-600 leading-relaxed">
          {supportingExplanation}
        </p>

        {/* Assumptions List */}
        {assumptions.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-500 block mb-2">
              Model Assumptions & Guardrails:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {assumptions.map((assump, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-lg bg-white/80 border border-slate-100 text-[11px] text-slate-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{assump}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs">
          <span className="text-slate-500">Recommended Action: </span>
          <strong className="text-sparkline-midnight font-bold">
            {recommendedNextAction}
          </strong>
        </div>
        <Button
          onClick={onExecuteAction}
          variant="gradient"
          size="sm"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Execute Strategy
        </Button>
      </div>
    </Card>
  );
};

