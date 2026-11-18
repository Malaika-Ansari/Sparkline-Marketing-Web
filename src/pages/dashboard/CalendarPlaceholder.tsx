import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { Calendar } from 'lucide-react';

export const CalendarPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="Marketing Calendar"
      category="Planning"
      icon={<Calendar className="w-8 h-8" />}
      scheduledPhase="Scheduled for Phase 08"
      description="Orchestrate campaign flight schedules, creative delivery deadlines, seasonal promo spikes, and content publication calendars in one unified marketing timeline."
      plannedFeatures={[
        'Interactive Gantt and monthly calendar view with drag-and-drop',
        'Seasonal retail and B2B holiday calendar templates',
        'Cross-channel dependency tracking and approval workflows',
        'Spend milestone triggers synced with the Budget Planner',
        'Google Calendar and Outlook ICS calendar synchronization',
      ]}
    />
  );
};

