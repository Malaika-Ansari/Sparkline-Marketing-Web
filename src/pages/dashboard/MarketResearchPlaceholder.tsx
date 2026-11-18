import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { Search } from 'lucide-react';

export const MarketResearchPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="Market Research Suite"
      category="Intelligence Core"
      icon={<Search className="w-8 h-8" />}
      scheduledPhase="Scheduled for Phase 04"
      description="The Market Research Suite analyzes buyer personas, market size (TAM, SAM, SOM), and industry growth patterns to pinpoint where customer acquisition friction is lowest."
      plannedFeatures={[
        'Interactive ICP (Ideal Customer Profile) builder',
        'Market sizing calculators (TAM, SAM, SOM) with confidence scoring',
        'Demographic and psychographic segmentation matrices',
        'Emerging market search trends and consumer sentiment analysis',
        'Customer friction and purchase trigger mapping',
      ]}
    />
  );
};

