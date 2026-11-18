import React from 'react';
import { Card } from '@/components/common/Card';
import { StatusBadge, StatusType } from '@/components/common/DataViz';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface CampaignPerformanceSummary {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  roas: number;
}

export interface CampaignStatusCardProps {
  campaignName: string;
  platform: 'Google' | 'Meta' | 'LinkedIn' | 'TikTok' | 'Email' | 'Organic';
  status: StatusType;
  performance: CampaignPerformanceSummary;
  currency?: string;
  className?: string;
}

export const CampaignStatusCard: React.FC<CampaignStatusCardProps> = ({
  campaignName,
  platform,
  status,
  performance,
  currency = 'USD',
  className,
}) => {
  const platformColors: Record<string, string> = {
    Google: 'bg-blue-50 text-blue-700 border-blue-200',
    Meta: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    LinkedIn: 'bg-sky-50 text-sky-700 border-sky-200',
    TikTok: 'bg-pink-50 text-pink-700 border-pink-200',
    Email: 'bg-amber-50 text-amber-700 border-amber-200',
    Organic: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <Card className={cn('p-5 border-slate-200/90 bg-white hover:border-sparkline-blue/40 transition-all', className)}>
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border',
                platformColors[platform] || 'bg-slate-100 text-slate-700 border-slate-200'
              )}
            >
              {platform}
            </span>
            <StatusBadge status={status} />
          </div>
          <h4 className="text-sm font-bold text-sparkline-midnight mt-1.5 truncate max-w-xs">
            {campaignName}
          </h4>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Ad Spend
          </span>
          <span className="text-sm font-bold font-mono text-sparkline-midnight">
            {formatCurrency(performance.spend, currency)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 pt-3 text-center">
        <div className="p-2 rounded-xl bg-slate-50">
          <span className="text-[10px] text-slate-400 block font-medium">Impressions</span>
          <span className="text-xs font-bold text-sparkline-midnight">
            {formatNumber(performance.impressions)}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-50">
          <span className="text-[10px] text-slate-400 block font-medium">Clicks</span>
          <span className="text-xs font-bold text-sparkline-midnight">
            {formatNumber(performance.clicks)}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-50">
          <span className="text-[10px] text-slate-400 block font-medium">Conversions</span>
          <span className="text-xs font-bold text-sparkline-midnight">
            {formatNumber(performance.conversions)}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100">
          <span className="text-[10px] text-sparkline-blue block font-semibold">ROAS</span>
          <span className="text-xs font-bold text-emerald-700">
            {performance.roas.toFixed(2)}x
          </span>
        </div>
      </div>
    </Card>
  );
};

