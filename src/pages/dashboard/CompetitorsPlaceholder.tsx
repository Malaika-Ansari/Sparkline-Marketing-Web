import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { Target } from 'lucide-react';

export const CompetitorsPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="Competitor Intelligence"
      category="Intelligence Core"
      icon={<Target className="w-8 h-8" />}
      scheduledPhase="Scheduled for Phase 05"
      description="The Competitor Intelligence module tracks market rivals, analyzes ad angles, extracts value proposition positioning matrices, and reveals untapped market whitespace."
      plannedFeatures={[
        'Competitor positioning 2x2 matrix visualizer',
        'Direct and indirect rival differentiation scoring',
        'Share of voice and keyword footprint comparison',
        'Creative ad copy angle decoding and counter-positioning playbooks',
        'Asymmetric advantage detection engine',
      ]}
    />
  );
};

