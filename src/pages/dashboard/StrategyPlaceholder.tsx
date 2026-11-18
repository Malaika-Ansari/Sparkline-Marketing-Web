import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { Compass } from 'lucide-react';

export const StrategyPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="Marketing Strategy"
      category="Planning"
      icon={<Compass className="w-8 h-8" />}
      scheduledPhase="Scheduled for Phase 05"
      description="Synthesize high-level business goals into actionable multi-channel marketing strategies, value propositions, and positioning frameworks with clear operational roadmaps."
      plannedFeatures={[
        'Full-funnel strategy blueprints (TOFU, MOFU, BOFU)',
        'Unique Selling Proposition (USP) scoring and validation',
        'Multi-channel flight roadmap with risk scoring',
        'Competitive differentiation and positioning radar',
        'Quarterly growth sprint goals with KPI benchmarks',
      ]}
    />
  );
};

