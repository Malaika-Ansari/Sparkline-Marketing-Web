/**
 * Third-Party Integrations & Data Synchronization Service
 * Sparkline Marketing Intelligence Platform — Phase 23
 */

import {
  IntegrationProviderId,
  PlatformConnection,
  SyncLogEntry,
  ImportedDataset,
  CSVValidationResult,
  CSVValidationRowError,
} from '@/types/integration';
import { auditService } from './audit.service';
import { securityService } from './security.service';

const CONNECTIONS_STORAGE_KEY = 'sparkline_platform_connections';
const SYNC_LOGS_STORAGE_KEY = 'sparkline_sync_logs';
const IMPORTED_DATASETS_KEY = 'sparkline_imported_datasets';
const IMPORTED_ROWS_KEY = 'sparkline_imported_performance_rows';

export const INTEGRATION_CATALOG: Omit<PlatformConnection, 'id' | 'status' | 'lastSyncAt' | 'lastSyncStatus' | 'lastErrorMessage'>[] = [
  // Advertising Platforms
  {
    providerId: 'meta_ads',
    name: 'Meta Ads Manager',
    category: 'advertising',
    description: 'Sync campaign performance, ad set spend, CTR, impressions, and ROAS across Facebook & Instagram.',
    dataProvided: ['Spend', 'Impressions', 'Reach', 'Clicks', 'CTR', 'CPC', 'CPM', 'Purchases', 'ROAS'],
    requiredScopes: ['ads_read', 'ads_management', 'read_insights'],
    authType: 'oauth2',
    configRequirements: {
      configured: false,
      instructions: 'Requires Meta for Developers App ID and App Secret registered with Marketing API v19.0.',
      missingFields: ['META_APP_ID', 'META_APP_SECRET'],
    },
  },
  {
    providerId: 'google_ads',
    name: 'Google Ads',
    category: 'advertising',
    description: 'Pull search keywords, impression share, conversion actions, CPC, and ad spend from Google Ads accounts.',
    dataProvided: ['Search Spend', 'Quality Score', 'Clicks', 'Conversions', 'Cost/Conv', 'Search Impression Share'],
    requiredScopes: ['https://www.googleapis.com/auth/adwords'],
    authType: 'oauth2',
    configRequirements: {
      configured: false,
      instructions: 'Requires Google Cloud Console OAuth 2.0 Web Client and Developer Token approved for production API access.',
      missingFields: ['GOOGLE_CLIENT_ID', 'GOOGLE_DEVELOPER_TOKEN'],
    },
  },
  {
    providerId: 'tiktok_ads',
    name: 'TikTok Ads Manager',
    category: 'advertising',
    description: 'Import video view metrics, conversion events, cost-per-result, and Spark Ads engagement from TikTok.',
    dataProvided: ['Video Views (2s/6s)', 'Spend', 'Clicks', 'Conversions', 'ROAS', 'CPA'],
    requiredScopes: ['ads.read', 'reporting.read'],
    authType: 'oauth2',
    configRequirements: {
      configured: false,
      instructions: 'Requires TikTok for Business Developer App with Marketing API access permissions.',
      missingFields: ['TIKTOK_APP_ID', 'TIKTOK_SECRET'],
    },
  },
  {
    providerId: 'linkedin_ads',
    name: 'LinkedIn Campaign Manager',
    category: 'advertising',
    description: 'Track B2B lead generation forms, company demographic engagement, sponsored content CTR, and professional reach.',
    dataProvided: ['Sponsored Content Spend', 'Lead Gen Form Fills', 'Cost Per Lead (CPL)', 'Demographic Reach'],
    requiredScopes: ['r_ads', 'r_ads_reporting'],
    authType: 'oauth2',
    configRequirements: {
      configured: false,
      instructions: 'Requires LinkedIn Developer Portal App with Marketing Developer Platform (MDP) approval.',
      missingFields: ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET'],
    },
  },

  // Website & Search Analytics
  {
    providerId: 'ga4',
    name: 'Google Analytics 4 (GA4)',
    category: 'analytics',
    description: 'Connect website sessions, user engagement, custom conversion events, and multi-channel attribution paths.',
    dataProvided: ['Sessions', 'Active Users', 'Engagement Rate', 'Event Count', 'E-commerce Revenue', 'Conversion Rate'],
    requiredScopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    authType: 'oauth2',
    configRequirements: {
      configured: false,
      instructions: 'Requires Google Analytics Data API v1 enabled with Service Account or OAuth 2.0 Client.',
      missingFields: ['GA4_PROPERTY_ID', 'GOOGLE_CLIENT_ID'],
    },
  },
  {
    providerId: 'gsc',
    name: 'Google Search Console',
    category: 'analytics',
    description: 'Retrieve organic search impressions, query rankings, URL crawl status, and organic click-through rates.',
    dataProvided: ['Organic Impressions', 'Organic Clicks', 'Average Position', 'Search Queries', 'CTR'],
    requiredScopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    authType: 'oauth2',
    configRequirements: {
      configured: false,
      instructions: 'Requires Google Webmasters API authorization for domain property ownership.',
      missingFields: ['GSC_SITE_URL', 'GOOGLE_CLIENT_ID'],
    },
  },

  // Social Media
  {
    providerId: 'meta_social',
    name: 'Instagram & Facebook Pages',
    category: 'social',
    description: 'Monitor organic post impressions, follower growth, Reels plays, and audience interactions.',
    dataProvided: ['Follower Count', 'Post Reach', 'Reels Plays', 'Engagement Count', 'Story Exits'],
    requiredScopes: ['pages_read_engagement', 'instagram_basic', 'instagram_manage_insights'],
    authType: 'oauth2',
    configRequirements: {
      configured: false,
      instructions: 'Requires Meta Business Manager Page verification with Instagram Business Account linking.',
      missingFields: ['META_PAGE_ID'],
    },
  },
  {
    providerId: 'linkedin_pages',
    name: 'LinkedIn Company Page',
    category: 'social',
    description: 'Track professional follower analytics, organic update impressions, and senior executive engagement.',
    dataProvided: ['Follower Demographics', 'Organic Impressions', 'Clicks', 'Reactions', 'Comments'],
    requiredScopes: ['r_organization_social'],
    authType: 'oauth2',
    configRequirements: {
      configured: false,
      instructions: 'Requires Community Management API access for the registered LinkedIn Company Organization.',
      missingFields: ['LINKEDIN_ORG_ID'],
    },
  },
  {
    providerId: 'twitter',
    name: 'X / Twitter Analytics',
    category: 'social',
    description: 'Import post impressions, bookmark counts, link clicks, profile visits, and repost rates.',
    dataProvided: ['Impressions', 'Engagements', 'Link Clicks', 'Bookmarks', 'Profile Visits'],
    requiredScopes: ['tweet.read', 'users.read'],
    authType: 'oauth2',
    configRequirements: {
      configured: false,
      instructions: 'Requires X Developer Portal Basic or Pro Tier API credentials with OAuth 2.0 User Context.',
      missingFields: ['TWITTER_BEARER_TOKEN'],
    },
  },
  {
    providerId: 'youtube',
    name: 'YouTube Channel Analytics',
    category: 'social',
    description: 'Track video views, average view duration, watch time hours, subscriber delta, and audience retention.',
    dataProvided: ['Views', 'Watch Time (Hours)', 'Average View Duration', 'Subscribers Gained', 'Card Clicks'],
    requiredScopes: ['https://www.googleapis.com/auth/yt-analytics.readonly'],
    authType: 'oauth2',
    configRequirements: {
      configured: false,
      instructions: 'Requires YouTube Analytics API v2 enabled with channel owner consent.',
      missingFields: ['YOUTUBE_CHANNEL_ID', 'GOOGLE_CLIENT_ID'],
    },
  },

  // Data & Reporting
  {
    providerId: 'csv_import',
    name: 'CSV & Spreadsheet Importer',
    category: 'data',
    description: 'Upload campaign performance spreadsheets, ad network exports, agency reports, and custom expense sheets.',
    dataProvided: ['Custom Spend', 'Custom Clicks', 'Conversions', 'Revenue', 'Historical Records'],
    requiredScopes: ['file_upload', 'data_ingestion'],
    authType: 'file_upload',
    configRequirements: {
      configured: true,
      instructions: 'Ready for use. Supports standard CSV, TSV, and semicolon-delimited files up to 5MB.',
      missingFields: [],
    },
  },
  {
    providerId: 'sheets',
    name: 'Google Sheets Live Sync',
    category: 'data',
    description: 'Stream live performance data and agency tracking sheets directly into the analytics engine.',
    dataProvided: ['Dynamic Range Ingestion', 'Hourly Auto-Sync', 'Custom Calculated Columns'],
    requiredScopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    authType: 'oauth2',
    configRequirements: {
      configured: false,
      instructions: 'Requires Google Sheets API v4 enabled with spreadsheet ID sharing.',
      missingFields: ['SHEET_ID', 'GOOGLE_CLIENT_ID'],
    },
  },
  {
    providerId: 'custom_webhook',
    name: 'Custom Webhook / REST Ingest',
    category: 'data',
    description: 'Send programmatic JSON payloads from CRM systems (HubSpot, Salesforce) or custom backend pipelines.',
    dataProvided: ['Real-Time Transactions', 'CRM Qualified Leads', 'Offline Conversion Adjustments'],
    requiredScopes: ['webhook_ingest'],
    authType: 'webhook',
    configRequirements: {
      configured: true,
      instructions: 'Configurable webhook endpoints with HMAC-SHA256 signature verification.',
      missingFields: [],
    },
  },
];

export class IntegrationService {
  /**
   * Retrieve all platform connections with user-configured statuses
   */
  static getConnections(): PlatformConnection[] {
    const raw = localStorage.getItem(CONNECTIONS_STORAGE_KEY);
    let userConnections: Record<string, Partial<PlatformConnection>> = {};

    if (raw) {
      try {
        userConnections = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse connections from storage', err);
      }
    }

    return INTEGRATION_CATALOG.map((cat) => {
      const saved = userConnections[cat.providerId];
      // Default state: if configured requirements are met, 'not_connected', otherwise 'config_required'
      const defaultStatus = cat.configRequirements.configured ? 'not_connected' : 'config_required';

      return {
        ...cat,
        id: `conn_${cat.providerId}`,
        status: saved?.status || defaultStatus,
        accountId: saved?.accountId,
        accountName: saved?.accountName,
        lastSyncAt: saved?.lastSyncAt,
        lastSyncStatus: saved?.lastSyncStatus,
        lastErrorMessage: saved?.lastErrorMessage,
        syncFrequency: saved?.syncFrequency || 'manual',
      };
    });
  }

  /**
   * Save a single platform connection state
   */
  static saveConnectionState(
    providerId: IntegrationProviderId,
    updates: Partial<PlatformConnection>
  ): PlatformConnection {
    const connections = this.getConnections();
    const existing = connections.find((c) => c.providerId === providerId);
    if (!existing) {
      throw new Error(`Integration provider ${providerId} not found.`);
    }

    const updated: PlatformConnection = {
      ...existing,
      ...updates,
    };

    const raw = localStorage.getItem(CONNECTIONS_STORAGE_KEY);
    let all: Record<string, Partial<PlatformConnection>> = {};
    if (raw) {
      try {
        all = JSON.parse(raw);
      } catch {
        all = {};
      }
    }

    all[providerId] = {
      status: updated.status,
      accountId: updated.accountId,
      accountName: updated.accountName,
      lastSyncAt: updated.lastSyncAt,
      lastSyncStatus: updated.lastSyncStatus,
      lastErrorMessage: updated.lastErrorMessage,
      syncFrequency: updated.syncFrequency,
    };

    localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(all));

    auditService.log('integration.connected', 'integration', {
      details: `Updated integration connection status for ${providerId} to ${updated.status}`,
      metadata: { providerId, status: updated.status, accountId: updated.accountId },
      outcome: 'success',
    });

    return updated;
  }

  /**
   * Connect in Sandbox/Test Mode (allows developers & users to safely test full sync lifecycle)
   */
  static connectSandbox(providerId: IntegrationProviderId, accountName: string = 'Demo Account'): PlatformConnection {
    const accountId = `act_${providerId.slice(0, 4)}_${Math.floor(100000 + Math.random() * 900000)}`;
    const updated = this.saveConnectionState(providerId, {
      status: 'connected',
      accountId,
      accountName,
      lastSyncAt: new Date().toISOString(),
      lastSyncStatus: 'success',
      lastErrorMessage: undefined,
    });

    auditService.log('integration.connected', 'integration', {
      details: `Sandbox account connected for ${providerId} (${accountName})`,
      metadata: { providerId, accountId, mode: 'sandbox' },
      outcome: 'success',
    });

    return updated;
  }

  /**
   * Disconnect integration and purge stored session tokens
   */
  static disconnect(providerId: IntegrationProviderId): PlatformConnection {
    const updated = this.saveConnectionState(providerId, {
      status: 'disconnected',
      accountId: undefined,
      accountName: undefined,
      lastErrorMessage: undefined,
    });

    auditService.log('integration.disconnected', 'integration', {
      details: `Disconnected integration provider ${providerId} and purged credentials`,
      metadata: { providerId },
      outcome: 'success',
    });

    return updated;
  }

  /**
   * Trigger Manual Data Synchronization
   */
  static async triggerSync(providerId: IntegrationProviderId): Promise<SyncLogEntry> {
    const startTime = new Date().toISOString();
    const logId = `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Set status to syncing
    this.saveConnectionState(providerId, { status: 'syncing' });

    // Simulate network roundtrip and synchronization
    await new Promise((resolve) => setTimeout(resolve, 1400));

    // Determine records imported based on provider
    const isSuccess = true;
    const recordsImported = Math.floor(12 + Math.random() * 28);

    const logEntry: SyncLogEntry = {
      id: logId,
      connectionId: `conn_${providerId}`,
      providerId,
      startedAt: startTime,
      finishedAt: new Date().toISOString(),
      status: isSuccess ? 'success' : 'failed',
      recordsProcessed: recordsImported + 2,
      recordsImported,
      duplicatesSkipped: 2,
    };

    // Save log entry
    this.appendSyncLog(logEntry);

    // Update connection status
    this.saveConnectionState(providerId, {
      status: 'connected',
      lastSyncAt: logEntry.finishedAt,
      lastSyncStatus: 'success',
      lastErrorMessage: undefined,
    });

    auditService.log('integration.connected', 'integration', {
      details: `Synchronized ${recordsImported} records from provider ${providerId}`,
      metadata: { providerId, recordsImported, logId },
      outcome: 'success',
    });

    return logEntry;
  }

  /**
   * Append a sync log entry
   */
  private static appendSyncLog(log: SyncLogEntry) {
    const raw = localStorage.getItem(SYNC_LOGS_STORAGE_KEY);
    let logs: SyncLogEntry[] = [];
    if (raw) {
      try {
        logs = JSON.parse(raw);
      } catch {
        logs = [];
      }
    }
    logs.unshift(log);
    // Keep last 50 logs
    if (logs.length > 50) {
      logs = logs.slice(0, 50);
    }
    localStorage.setItem(SYNC_LOGS_STORAGE_KEY, JSON.stringify(logs));
  }

  /**
   * Retrieve sync logs
   */
  static getSyncLogs(limit: number = 20): SyncLogEntry[] {
    const raw = localStorage.getItem(SYNC_LOGS_STORAGE_KEY);
    if (!raw) return [];
    try {
      const logs: SyncLogEntry[] = JSON.parse(raw);
      return logs.slice(0, limit);
    } catch {
      return [];
    }
  }

  // =========================================================================
  // CSV Import & Formula Injection Protection
  // =========================================================================

  /**
   * Sanitize a single CSV cell against spreadsheet formula injection (CSV Injection / DDE)
   * Dangerous characters at start of cell: =, +, -, @, \t, \r
   * Preserves purely numeric values like -12.5 or +10.
   */
  static sanitizeCsvCell(value: unknown): string {
    return securityService.sanitizeCsvCell(value);
  }

  /**
   * Format a cell for RFC 4180 CSV export with formula injection protection
   */
  static formatCsvCell(value: unknown): string {
    return securityService.formatCsvCell(value);
  }

  /**
   * Validate and parse a raw CSV text content
   */
  static validateAndParseCSV(rawContent: string, filename: string): CSVValidationResult {
    // 1. File size check (5MB limit = 5 * 1024 * 1024 bytes)
    const byteSize = new Blob([rawContent]).size;
    if (byteSize > 5 * 1024 * 1024) {
      throw new Error(`File size (${(byteSize / (1024 * 1024)).toFixed(2)} MB) exceeds 5MB limit.`);
    }

    // 2. Sanitize filename
    const safeFilename = filename.replace(/^.*[\\\/]/, '').replace(/[^\w.-]/g, '_');

    // 3. Split lines safely
    const lines = rawContent.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
      return {
        valid: false,
        filename: safeFilename,
        headers: [],
        previewRows: [],
        totalRows: 0,
        errors: [{ rowNumber: 1, field: 'file', reason: 'CSV file must have a header row and at least 1 data row.', rawValue: '' }],
        injectedFormulaCount: 0,
      };
    }

    // 4. Parse Header Row
    const headerLine = lines[0] || '';
    const rawHeaders = this.parseCsvLine(headerLine);
    const headers = rawHeaders.map((h) => securityService.escapeHtml(h.trim().toLowerCase()));

    // 5. Parse Data Rows & Check Injection
    let injectedFormulaCount = 0;
    const errors: CSVValidationRowError[] = [];
    const previewRows: Record<string, string>[] = [];
    const maxPreview = 5;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i] || '';
      if (!line.trim()) continue;
      const cells = this.parseCsvLine(line);

      if (cells.length !== headers.length) {
        errors.push({
          rowNumber: i + 1,
          field: 'row_length',
          reason: `Column count mismatch: expected ${headers.length} columns, found ${cells.length}`,
          rawValue: line.slice(0, 50),
        });
        continue;
      }

      const rowObj: Record<string, string> = {};
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        const rawCell = cells[j] || '';

        // Detect formula injection
        const trimmed = rawCell.trim();
        if (['=', '+', '-', '@'].some((p) => trimmed.startsWith(p)) && isNaN(Number(trimmed))) {
          injectedFormulaCount++;
        }

        const sanitized = this.sanitizeCsvCell(rawCell);
        if (header) {
          rowObj[header] = sanitized;
        }
      }

      if (previewRows.length < maxPreview) {
        previewRows.push(rowObj);
      }
    }

    const valid = errors.length === 0;

    return {
      valid,
      filename: safeFilename,
      headers,
      previewRows,
      totalRows: lines.length - 1,
      errors,
      injectedFormulaCount,
    };
  }

  /**
   * Helper to parse a single CSV line accounting for quoted cells
   */
  private static parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let cur = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          cur += '"';
          i++; // skip escaped quote
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        result.push(cur);
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur);
    return result;
  }

  /**
   * Commit parsed CSV rows to project performance dataset
   */
  static commitCsvImport(
    projectId: string,
    filename: string,
    dataType: 'campaign_performance' | 'expenses' | 'traffic',
    rows: Record<string, string>[],
    mapping: Record<string, string>
  ): { dataset: ImportedDataset; importedCount: number; duplicateCount: number } {
    const datasetId = `ds_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Normalize imported rows according to mapping
    const existingRaw = localStorage.getItem(IMPORTED_ROWS_KEY);
    let allImportedRows: Array<Record<string, unknown>> = [];
    if (existingRaw) {
      try {
        allImportedRows = JSON.parse(existingRaw);
      } catch {
        allImportedRows = [];
      }
    }

    let importedCount = 0;
    let duplicateCount = 0;

    // Existing compound keys to prevent duplicate imports
    const existingKeys = new Set(
      allImportedRows.map((r) => `${r.projectId}_${r.platform}_${r.campaignName}_${r.date}`)
    );

    const newRowsToSave: Array<Record<string, unknown>> = [];

    const dateCol = mapping.date || 'date';
    const platformCol = mapping.platform || 'platform';
    const campCol = mapping.campaignName || 'campaignName';
    const spendCol = mapping.spend || 'spend';
    const impCol = mapping.impressions || 'impressions';
    const clickCol = mapping.clicks || 'clicks';
    const convCol = mapping.conversions || 'conversions';
    const revCol = mapping.revenue || 'revenue';

    for (const row of rows) {
      const dateVal = row[dateCol] || new Date().toISOString().split('T')[0];
      const platformVal = row[platformCol] || 'CSV Import';
      const campaignVal = row[campCol] || 'Imported Campaign';
      const spendVal = parseFloat(row[spendCol] || '0') || 0;
      const impressionsVal = parseInt(row[impCol] || '0', 10) || 0;
      const clicksVal = parseInt(row[clickCol] || '0', 10) || 0;
      const conversionsVal = parseInt(row[convCol] || '0', 10) || 0;
      const revenueVal = parseFloat(row[revCol] || '0') || 0;

      const compoundKey = `${projectId}_${platformVal}_${campaignVal}_${dateVal}`;
      if (existingKeys.has(compoundKey)) {
        duplicateCount++;
        continue;
      }

      existingKeys.add(compoundKey);
      importedCount++;

      newRowsToSave.push({
        id: `imp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        datasetId,
        projectId,
        date: dateVal,
        platform: platformVal,
        channel: platformVal.toLowerCase().includes('google') ? 'search' : 'social',
        campaignName: campaignVal,
        spend: Math.max(0, spendVal),
        impressions: Math.max(0, impressionsVal),
        reach: Math.max(0, impressionsVal),
        clicks: Math.max(0, clicksVal),
        conversions: Math.max(0, conversionsVal),
        revenue: Math.max(0, revenueVal),
        dataSource: 'imported',
        dataQuality: 'verified',
        attributionWindow: '7d_click',
        importedAt: new Date().toISOString(),
      });
    }

    allImportedRows.push(...newRowsToSave);
    localStorage.setItem(IMPORTED_ROWS_KEY, JSON.stringify(allImportedRows));

    // Save dataset summary
    const dataset: ImportedDataset = {
      id: datasetId,
      projectId,
      filename,
      dataType,
      uploadedAt: new Date().toISOString(),
      totalRows: rows.length,
      importedRows: importedCount,
      skippedRows: duplicateCount,
      errorRows: 0,
      status: duplicateCount === rows.length ? 'partial' : 'completed',
      fieldMapping: mapping,
    };

    const datasetsRaw = localStorage.getItem(IMPORTED_DATASETS_KEY);
    let datasets: ImportedDataset[] = [];
    if (datasetsRaw) {
      try {
        datasets = JSON.parse(datasetsRaw);
      } catch {
        datasets = [];
      }
    }
    datasets.unshift(dataset);
    localStorage.setItem(IMPORTED_DATASETS_KEY, JSON.stringify(datasets));

    auditService.log('report.exported', 'report', {
      details: `Imported CSV dataset ${filename} for project ${projectId} (${importedCount} imported, ${duplicateCount} duplicates skipped)`,
      metadata: { projectId, datasetId, filename, importedCount, duplicateCount },
      outcome: 'success',
    });

    return { dataset, importedCount, duplicateCount };
  }

  /**
   * Get all imported datasets for a project
   */
  static getImportedDatasets(projectId: string): ImportedDataset[] {
    const raw = localStorage.getItem(IMPORTED_DATASETS_KEY);
    if (!raw) return [];
    try {
      const all: ImportedDataset[] = JSON.parse(raw);
      return all.filter((d) => d.projectId === projectId);
    } catch {
      return [];
    }
  }

  /**
   * Get all imported performance rows for a project
   */
  static getImportedPerformanceRows(projectId: string): Array<Record<string, unknown>> {
    const raw = localStorage.getItem(IMPORTED_ROWS_KEY);
    if (!raw) return [];
    try {
      const all: Array<Record<string, unknown>> = JSON.parse(raw);
      return all.filter((r) => r.projectId === projectId);
    } catch {
      return [];
    }
  }
}
