/**
 * Third-Party Integrations & Data Sync Domain Types
 * Sparkline Marketing Intelligence Platform — Phase 23
 */

export type IntegrationProviderId =
  | 'meta_ads'
  | 'google_ads'
  | 'tiktok_ads'
  | 'linkedin_ads'
  | 'ga4'
  | 'gsc'
  | 'twitter'
  | 'linkedin_pages'
  | 'meta_social'
  | 'youtube'
  | 'csv_import'
  | 'sheets'
  | 'custom_webhook';

export type IntegrationCategory =
  | 'advertising'
  | 'analytics'
  | 'social'
  | 'data';

export type IntegrationStatus =
  | 'not_connected'
  | 'connecting'
  | 'connected'
  | 'syncing'
  | 'sync_failed'
  | 'disconnected'
  | 'config_required';

export interface PlatformConnection {
  id: string;
  providerId: IntegrationProviderId;
  name: string;
  category: IntegrationCategory;
  description: string;
  dataProvided: string[];
  requiredScopes: string[];
  status: IntegrationStatus;
  authType: 'oauth2' | 'service_account' | 'api_key' | 'file_upload' | 'webhook';
  accountId?: string;
  accountName?: string;
  lastSyncAt?: string;
  lastSyncStatus?: 'success' | 'failed' | 'in_progress';
  lastErrorMessage?: string;
  syncFrequency?: 'manual' | 'hourly' | 'daily';
  configRequirements: {
    configured: boolean;
    instructions: string;
    missingFields: string[];
  };
}

export interface SyncLogEntry {
  id: string;
  connectionId: string;
  providerId: IntegrationProviderId;
  startedAt: string;
  finishedAt?: string;
  status: 'running' | 'success' | 'failed';
  recordsProcessed: number;
  recordsImported: number;
  duplicatesSkipped: number;
  errorMessage?: string;
}

export interface ImportedDataset {
  id: string;
  projectId: string;
  filename: string;
  dataType: 'campaign_performance' | 'expenses' | 'traffic';
  uploadedAt: string;
  totalRows: number;
  importedRows: number;
  skippedRows: number;
  errorRows: number;
  status: 'completed' | 'partial' | 'failed';
  fieldMapping: Record<string, string>;
}

export interface CSVValidationRowError {
  rowNumber: number;
  field: string;
  reason: string;
  rawValue: string;
}

export interface CSVValidationResult {
  valid: boolean;
  filename: string;
  headers: string[];
  previewRows: Record<string, string>[];
  totalRows: number;
  errors: CSVValidationRowError[];
  injectedFormulaCount: number;
}

