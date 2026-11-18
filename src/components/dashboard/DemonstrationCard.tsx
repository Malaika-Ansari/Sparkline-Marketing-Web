import React from 'react';
import { Card } from '@/components/common/Card';
import { MiniSparkline } from '@/components/charts/SparklineChart';
import { MetricCardData } from '@/types';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemonstrationCardProps {
  data: MetricCardData;
}

export const DemonstrationCard: React.FC<DemonstrationCardProps> = ({ data }) => {
  return (
    <Card className="p-5 flex flex-col justify-between border-slate-200/90 hover:border-sparkline-blue/30 transition-all duration-300">
      {/* Demonstration Header Label */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {data.title}
        </span>
        <div
          className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-200/70"
          title="This is demonstration data for illustrative purposes only"
        >
          <Info className="w-3 h-3 text-amber-600" />
          <span>Demo Data</span>
        </div>
      </div>

      {/* Main Metric Value & Trend Sparkline */}
      <div className="flex items-baseline justify-between mt-3">
        <div>
          <div className="text-2xl font-bold font-display text-sparkline-midnight tracking-tight">
            {data.value}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className={cn(
                'inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded',
                data.isPositive
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-rose-700 bg-rose-50'
              )}
            >
              {data.isPositive ? (
                <TrendingUp className="w-3 h-3 mr-0.5 inline" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-0.5 inline" />
              )}
              {data.change > 0 ? `+${data.change}%` : `${data.change}%`}
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              {data.period}
            </span>
          </div>
        </div>

        {/* Mini Micro-chart */}
        <div className="shrink-0 pl-2">
          <MiniSparkline
            data={data.chartData}
            isPositive={data.isPositive}
          />
        </div>
      </div>
    </Card>
  );
};

