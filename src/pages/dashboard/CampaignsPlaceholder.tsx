import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { Megaphone } from 'lucide-react';

export const CampaignsPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="Campaign Studio"
      category="Execution & Planning"
      icon={<Megaphone className="w-8 h-8" />}
      scheduledPhase="Scheduled for Phase 08"
      description="The Campaign Studio orchestrates multi-platform ad schedules, flight dates, budget splits, impression projections, and ad group architectures across Google, Meta, LinkedIn, and TikTok."
      plannedFeatures={[
        'Interactive campaign timeline and flight Gantt view',
        'Ad group structure generator with keyword match type recommendations',
        'Multi-channel creative flight calendar',
        'Expected conversion volume forecaster by platform',
        'Campaign checklist and launch compliance validator',
      ]}
    />
  );
};

