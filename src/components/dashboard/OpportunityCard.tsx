import React from 'react';
import { OpportunityInsight } from '@/types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OpportunityCard: React.FC<{ opportunity: OpportunityInsight }> = ({
  opportunity,
}) => {
  const impactVariants = {
    High: 'orange' as const,
    Medium: 'blue' as const,
    Low: 'neutral' as const,
  };

  return (
    <Card className="p-4 border-slate-200/80 hover:border-sparkline-blue/40 transition-all duration-200 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-50 text-sparkline-blue">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {opportunity.channel}
            </span>
          </div>
        </div>
        <Badge variant={impactVariants[opportunity.impact]} size="sm">
          {opportunity.impact} Impact
        </Badge>
      </div>

      <h4 className="text-sm font-semibold text-sparkline-midnight mt-2.5 line-clamp-1">
        {opportunity.title}
      </h4>

      <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
        {opportunity.description}
      </p>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
        <span className="text-slate-500">
          Target ROAS:{' '}
          <strong className="text-sparkline-midnight font-bold">
            {opportunity.projectedRoas}x
          </strong>
        </span>
        <Link
          to="/dashboard/strategist"
          className="text-sparkline-blue hover:text-blue-700 font-medium inline-flex items-center gap-0.5"
        >
          <span>Act Now</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
};

