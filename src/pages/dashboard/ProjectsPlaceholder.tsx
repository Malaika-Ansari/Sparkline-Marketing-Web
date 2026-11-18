import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { FolderKanban } from 'lucide-react';

export const ProjectsPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="My Projects & Workspaces"
      category="Workspace Core"
      icon={<FolderKanban className="w-8 h-8" />}
      scheduledPhase="Scheduled for Phase 13"
      description="Manage multiple brands, products, or client accounts from a unified workspace switcher with isolated strategy archives and independent budgets."
      plannedFeatures={[
        'Fast multi-brand and client workspace switching',
        'Project-level access permissions and role assignments',
        'Independent product catalog and positioning archives',
        'Workspace cloning and template reuse for agency workflows',
        'Historical strategy version timelines and milestone tracking',
      ]}
    />
  );
};

