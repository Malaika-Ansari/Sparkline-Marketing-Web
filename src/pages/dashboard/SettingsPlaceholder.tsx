import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { Settings } from 'lucide-react';

export const SettingsPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="Platform Settings & Preferences"
      category="System & Configuration"
      icon={<Settings className="w-8 h-8" />}
      scheduledPhase="Scheduled for Phase 02"
      description="Configure workspace defaults, user profiles, team member invitations, default reporting currency, notification cadences, and subscription plan parameters."
      plannedFeatures={[
        'User profile and credential management',
        'Workspace team roles (Owner, Strategist, Viewer)',
        'Default currency and fiscal calendar configurations',
        'Custom brand color and logo uploads for reporting',
        'Notification digest and strategy alert preferences',
      ]}
    />
  );
};

