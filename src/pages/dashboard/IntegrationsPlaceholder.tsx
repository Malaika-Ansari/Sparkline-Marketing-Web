import React from 'react';
import { DashboardModulePlaceholder } from '@/components/dashboard/DashboardModulePlaceholder';
import { Boxes } from 'lucide-react';

export const IntegrationsPlaceholder: React.FC = () => {
  return (
    <DashboardModulePlaceholder
      title="Integrations & Data Connectors"
      category="Management"
      icon={<Boxes className="w-8 h-8" />}
      scheduledPhase="Scheduled for Phase 15"
      description="Connect your advertising channels, web analytics platforms, and e-commerce stores to feed real-time performance metrics into the Sparkline intelligence engine."
      plannedFeatures={[
        'Google Ads & Google Analytics 4 (GA4) automated sync',
        'Meta Ads Manager (Facebook & Instagram) API connector',
        'Shopify, WooCommerce, and Stripe transaction webhook feeds',
        'HubSpot and Salesforce CRM lead-to-opportunity attribution',
        'Custom webhooks and secure REST API tokens for enterprise data warehouses',
      ]}
      securityNote="All integration credentials will be stored in encrypted Supabase Vault instances using AES-256 GCM encryption with strict Row-Level Security."
    />
  );
};

