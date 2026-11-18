import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { HelpCircle } from 'lucide-react';

export const HelpPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="Help & Support Center"
      category="Account"
      icon={<HelpCircle className="w-8 h-8" />}
      scheduledPhase="Operational Preview"
      description="Access platform walkthroughs, mathematical calculation definitions, troubleshooting guides, and direct priority support from growth strategists."
      plannedFeatures={[
        'Interactive feature onboarding tours and video guides',
        'Mathematical formulas and calculation methodology documentation',
        'Direct ticket submission with priority queue for Pro and Agency subscribers',
        'Community discussion board and tactical marketing templates',
        'API documentation and integration developer guides',
      ]}
      securityNote="Support personnel cannot view raw customer data without explicit temporary authorization."
    />
  );
};

