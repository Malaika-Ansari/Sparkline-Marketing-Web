import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { BarChart3 } from 'lucide-react';

export const MetricsPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="Marketing Metrics Hub"
      category="Intelligence Core"
      icon={<BarChart3 className="w-8 h-8" />}
      scheduledPhase="Scheduled for Phase 06"
      description="The Marketing Metrics Hub provides interactive KPI modeling for Customer Acquisition Cost (CAC), Lifetime Value (LTV), Payback Period, and blended Return on Ad Spend (ROAS)."
      plannedFeatures={[
        'Full-funnel conversion rate benchmark comparisons',
        'Dynamic CAC & LTV ratio stress testing models',
        'Customer payback period curve projections',
        'Blended vs. paid-only marketing efficiency ratios (MER)',
        'Cohort retention and churn impact analyzers',
      ]}
    />
  );
};

