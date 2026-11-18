import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { TrendingUp } from 'lucide-react';

export const ROICalculatorPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="ROI & ROAS Calculator"
      category="Marketing Tools"
      icon={<TrendingUp className="w-8 h-8" />}
      scheduledPhase="Scheduled for Phase 10"
      description="Simulate return on marketing investment, calculate break-even ROAS thresholds, and forecast net profitability across diverse ad networks and margin structures."
      plannedFeatures={[
        'Interactive Break-Even ROAS calculator factoring COGS and fulfillment',
        'Customer Lifetime Value (LTV) to CAC ratio modeling',
        'Blended MER (Marketing Efficiency Ratio) forecasting',
        'Payback window sensitivity across monthly cash flow cycles',
        'Exportable scenario comparisons for executive budget approval',
      ]}
    />
  );
};

