import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { Globe } from 'lucide-react';

export const SEOPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="SEO Intelligence"
      category="Marketing Tools"
      icon={<Globe className="w-8 h-8" />}
      scheduledPhase="Scheduled for Phase 13"
      description="Identify high-intent organic search opportunities, analyze competitor keyword positions, and optimize on-page content structures for qualified search demand."
      plannedFeatures={[
        'High-intent keyword discovery with search intent classification',
        'Competitor SERP content gap and backlink opportunity analysis',
        'Content brief generator with semantic entity recommendations',
        'Technical SEO health audit and structured data checklists',
        'Google Search Console API performance synchronization',
      ]}
    />
  );
};

