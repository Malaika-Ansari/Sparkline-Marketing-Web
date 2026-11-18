import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { Calculator } from 'lucide-react';

export const BudgetPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="Dynamic Budget Planner"
      category="Execution & Planning"
      icon={<Calculator className="w-8 h-8" />}
      scheduledPhase="Scheduled for Phase 07"
      description="The Budget Planner allocates marketing spend across search, paid social, influencers, content, and events with real-time multi-currency support and risk-adjusted cash pacing."
      plannedFeatures={[
        'Channel spend allocation sliders with constraint bounds',
        'Live multi-currency exchange rate conversions (USD, EUR, GBP, AUD, CAD, JPY)',
        'Burn rate and runway sensitivity modeling',
        'Spend pacing schedule with milestone trigger guards',
        'Seasonal spend volatility adjustments',
      ]}
    />
  );
};

