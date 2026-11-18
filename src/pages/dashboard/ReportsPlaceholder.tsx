import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { FileText } from 'lucide-react';

export const ReportsPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="Executive Reports & Export Center"
      category="Execution & Planning"
      icon={<FileText className="w-8 h-8" />}
      scheduledPhase="Scheduled for Phase 12"
      description="The Reports module compiles strategic blueprints, unit economics models, and performance forecast curves into professional, client-ready PDF presentations and interactive executive dashboards."
      plannedFeatures={[
        'One-click PDF marketing plan generation with brand styling',
        'Executive summaries tailored for leadership and investors',
        'Password-protected shareable client presentation links',
        'Automated monthly marketing intelligence digest exports',
        'White-label agency report customization options (Phase 18+)',
      ]}
    />
  );
};

