import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { Sparkles } from 'lucide-react';

export const ContentStudioPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="Content Studio"
      category="Execution & Planning"
      icon={<Sparkles className="w-8 h-8" />}
      scheduledPhase="Scheduled for Phase 09"
      description="The Content Studio generates structured SEO topic clusters, editorial content calendars, high-impact copywriting angles, and social distribution schedules."
      plannedFeatures={[
        'Pillar-cluster SEO content hierarchy architect',
        'Editorial calendar with publishing cadences across channels',
        'High-converting headline and hook generator with score analysis',
        'Repurposing engine (turn 1 core whitepaper into 10 multi-format posts)',
        'Content format ROI benchmark tracker',
      ]}
    />
  );
};

