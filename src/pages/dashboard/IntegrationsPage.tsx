/**
 * Integrations & Marketing Data Connectors Workspace
 * Sparkline Marketing Intelligence Platform — Phase 23
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  PowerOff,
  Upload,
  FileSpreadsheet,
  ShieldCheck,
  Clock,
  ArrowRight,
  Info,
  Check,
  X,
} from 'lucide-react';
import { IntegrationService } from '@/services/integration.service';
import { projectService } from '@/services/project.service';
import {
  PlatformConnection,
  IntegrationProviderId,
  IntegrationCategory,
  SyncLogEntry,
  CSVValidationResult,
  ImportedDataset,
} from '@/types/integration';
import { MarketingProject } from '@/types/project';

export const IntegrationsPage: React.FC = () => {
  // State
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory | 'all'>('all');
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([]);
  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Modals & Panels
  const [setupModalProvider, setSetupModalProvider] = useState<PlatformConnection | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'csv' | 'logs'>('catalog');

  // CSV Import State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvValidation, setCsvValidation] = useState<CSVValidationResult | null>(null);
  const [csvRawText, setCsvRawText] = useState<string>('');
  const [fieldMapping, setFieldMapping] = useState<{
    date: string;
    platform: string;
    campaignName: string;
    spend: string;
    impressions: string;
    clicks: string;
    conversions: string;
    revenue: string;
  }>({
    date: '',
    platform: '',
    campaignName: '',
    spend: '',
    impressions: '',
    clicks: '',
    conversions: '',
    revenue: '',
  });
  const [importResult, setImportResult] = useState<{
    dataset: ImportedDataset;
    importedCount: number;
    duplicateCount: number;
  } | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);

  // Syncing state tracker
  const [syncingProviders, setSyncingProviders] = useState<Set<string>>(new Set());
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    refreshData();
    const projs = projectService.getProjects();
    setProjects(projs);
    if (projs.length > 0) {
      setSelectedProjectId(projs[0]?.id || '');
    }
  }, []);

  const refreshData = () => {
    setConnections(IntegrationService.getConnections());
    setSyncLogs(IntegrationService.getSyncLogs(20));
  };

  // Show notice
  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Connect in Sandbox Mode
  const handleConnectSandbox = (providerId: IntegrationProviderId, name: string) => {
    IntegrationService.connectSandbox(providerId, `${name} Sandbox Account`);
    refreshData();
    triggerNotice(`Connected test sandbox account for ${name}.`);
  };

  // Disconnect Provider
  const handleDisconnect = (providerId: IntegrationProviderId, name: string) => {
    IntegrationService.disconnect(providerId);
    refreshData();
    triggerNotice(`Disconnected ${name} and purged session credentials.`);
  };

  // Trigger Manual Synchronization
  const handleTriggerSync = async (providerId: IntegrationProviderId, name: string) => {
    setSyncingProviders((prev) => new Set(prev).add(providerId));
    try {
      const log = await IntegrationService.triggerSync(providerId);
      refreshData();
      triggerNotice(`Successfully synchronized ${log.recordsImported} records from ${name}.`);
    } catch {
      triggerNotice(`Synchronization failed for ${name}. Check connection permissions.`);
    } finally {
      setSyncingProviders((prev) => {
        const next = new Set(prev);
        next.delete(providerId);
        return next;
      });
    }
  };

  // Filter connections by category
  const filteredConnections = connections.filter((conn) => {
    if (selectedCategory === 'all') return true;
    return conn.category === selectedCategory;
  });

  // Handle CSV file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null);
    setImportResult(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setCsvError('Please upload a valid .csv file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setCsvError('File exceeds 5MB size limit.');
      return;
    }

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvRawText(content);
      try {
        const result = IntegrationService.validateAndParseCSV(content, file.name);
        setCsvValidation(result);

        // Auto-match common header names
        const autoMap = { ...fieldMapping };
        result.headers.forEach((h) => {
          const lower = h.toLowerCase();
          if (lower.includes('date') || lower.includes('day')) autoMap.date = h;
          if (lower.includes('platform') || lower.includes('source') || lower.includes('channel')) autoMap.platform = h;
          if (lower.includes('campaign') || lower.includes('ad_name')) autoMap.campaignName = h;
          if (lower.includes('spend') || lower.includes('cost') || lower.includes('amount')) autoMap.spend = h;
          if (lower.includes('impression') || lower.includes('views')) autoMap.impressions = h;
          if (lower.includes('click')) autoMap.clicks = h;
          if (lower.includes('conversion') || lower.includes('order') || lower.includes('purchase')) autoMap.conversions = h;
          if (lower.includes('revenue') || lower.includes('sales') || lower.includes('value')) autoMap.revenue = h;
        });
        setFieldMapping(autoMap);
      } catch (err: any) {
        setCsvError(err.message || 'Failed to parse CSV file.');
      }
    };
    reader.readAsText(file);
  };

  // Commit CSV Import
  const handleCommitImport = () => {
    if (!csvValidation || !selectedProjectId) {
      setCsvError('Please select a destination project and map the required fields.');
      return;
    }

    // Require at least date and spend or impressions
    if (!fieldMapping.date) {
      setCsvError('Please map at least the Date column.');
      return;
    }

    try {
      const parsed = IntegrationService.validateAndParseCSV(csvRawText, csvFile?.name || 'import.csv');
      const lines = csvRawText.split(/\r?\n/).filter((l) => l.trim().length > 0);
      const headers = parsed.headers;
      const dataRows: Record<string, string>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i] || '';
        if (!line.trim()) continue;
        const parts = line.split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
        const obj: Record<string, string> = {};
        headers.forEach((h, idx) => {
          obj[h] = parts[idx] || '';
        });
        dataRows.push(obj);
      }

      const res = IntegrationService.commitCsvImport(
        selectedProjectId,
        csvFile?.name || 'performance.csv',
        'campaign_performance',
        dataRows,
        fieldMapping
      );

      setImportResult(res);
      triggerNotice(`Successfully imported ${res.importedCount} performance records!`);
    } catch (err: any) {
      setCsvError(err.message || 'Failed to commit CSV import.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-sparkline-midnight text-white px-4 py-3 rounded-xl shadow-premium border border-emerald-500/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{actionNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-sparkline-midnight">
              Integrations & Data Connectors
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-sparkline-blue border border-blue-200">
              <Boxes className="w-3.5 h-3.5" />
              13 Connectors
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Connect your advertising channels, analytics tracking, social profiles, and CSV datasets to fuel unified performance intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/analytics"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sparkline-blue hover:bg-sparkline-blue-hover rounded-lg transition-colors shadow-sm"
          >
            <span>View Unified Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'border-sparkline-blue text-sparkline-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Platform Connectors ({connections.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('csv')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'csv'
              ? 'border-sparkline-blue text-sparkline-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>CSV & Spreadsheet Ingest</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'border-sparkline-blue text-sparkline-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Synchronization Audit History ({syncLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Platform Connectors Catalog */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-sparkline-midnight text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Integrations ({connections.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('advertising')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === 'advertising'
                  ? 'bg-sparkline-midnight text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Advertising Platforms (4)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === 'analytics'
                  ? 'bg-sparkline-midnight text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Website & Search Analytics (2)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('social')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === 'social'
                  ? 'bg-sparkline-midnight text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Social Media (4)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('data')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === 'data'
                  ? 'bg-sparkline-midnight text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Data & Ingestion (3)
            </button>
          </div>

          {/* Connectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredConnections.map((conn) => {
              const isSyncing = syncingProviders.has(conn.providerId);

              // Status styles
              const statusStyles = {
                connected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                connecting: 'bg-blue-50 text-blue-700 border-blue-200',
                syncing: 'bg-blue-50 text-sparkline-blue border-blue-200',
                sync_failed: 'bg-rose-50 text-rose-700 border-rose-200',
                disconnected: 'bg-slate-100 text-slate-700 border-slate-200',
                not_connected: 'bg-slate-100 text-slate-600 border-slate-200',
                config_required: 'bg-amber-50 text-amber-700 border-amber-200',
              }[conn.status];

              const statusLabel = {
                connected: 'Connected',
                connecting: 'Connecting...',
                syncing: 'Syncing...',
                sync_failed: 'Sync Failed',
                disconnected: 'Disconnected',
                not_connected: 'Not Connected',
                config_required: 'Setup Required',
              }[conn.status];

              return (
                <div
                  key={conn.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-sparkline-midnight text-sm">
                          {conn.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-sparkline-midnight leading-tight">
                            {conn.name}
                          </h3>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {conn.category}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${statusStyles}`}>
                        {statusLabel}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {conn.description}
                    </p>

                    {/* Data Provided */}
                    <div className="mb-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Data Synchronized:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {conn.dataProvided.map((d, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Account Info if Connected */}
                    {conn.status === 'connected' && conn.accountName && (
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5 mb-4 text-xs">
                        <div className="flex items-center justify-between text-emerald-800 font-medium">
                          <span>Account: {conn.accountName}</span>
                          <span className="font-mono text-[11px] text-emerald-600">{conn.accountId}</span>
                        </div>
                        {conn.lastSyncAt && (
                          <div className="text-[10px] text-emerald-700 mt-1">
                            Last Synced: {new Date(conn.lastSyncAt).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    {conn.status === 'connected' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleTriggerSync(conn.providerId, conn.name)}
                          disabled={isSyncing}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sparkline-blue hover:bg-sparkline-blue-hover rounded-lg transition-colors shadow-sm disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDisconnect(conn.providerId, conn.name)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <PowerOff className="w-3.5 h-3.5" />
                          <span>Disconnect</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleConnectSandbox(conn.providerId, conn.name)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sparkline-midnight hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Connect Sandbox</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSetupModalProvider(conn)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Setup Guide</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: CSV & Spreadsheet Data Ingest */}
      {activeTab === 'csv' && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-sparkline-midnight">
                Upload Campaign Performance Spreadsheet
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload historical campaign performance, third-party network exports, or agency media expenses. Supports standard CSV up to 5MB. All values are automatically sanitized against spreadsheet formula injection.
              </p>
            </div>

            {/* Destination Project Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Destination Marketing Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full sm:w-80 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sparkline-blue focus:bg-white"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.business?.brandName || p.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="border-2 border-dashed border-slate-300 hover:border-sparkline-blue rounded-xl p-8 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="p-3 bg-white border border-slate-200 rounded-full shadow-sm text-sparkline-blue">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-700">
                  {csvFile ? csvFile.name : 'Click to browse or drag and drop your CSV file here'}
                </div>
                <div className="text-[11px] text-slate-400">
                  Maximum file size: 5MB • Headers will be parsed automatically
                </div>
              </div>
            </div>

            {/* Error Message */}
            {csvError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{csvError}</span>
              </div>
            )}

            {/* Validation & Mapping Section */}
            {csvValidation && (
              <div className="space-y-5 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Validated {csvValidation.totalRows} data rows and {csvValidation.headers.length} columns</span>
                  </div>
                  {csvValidation.injectedFormulaCount > 0 && (
                    <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                      Neutralized {csvValidation.injectedFormulaCount} dangerous formula cells
                    </span>
                  )}
                </div>

                {/* Column Mapping Grid */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                    Map Columns to Sparkline Schema
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { key: 'date', label: 'Date Column (Required)' },
                      { key: 'platform', label: 'Platform / Channel' },
                      { key: 'campaignName', label: 'Campaign Name' },
                      { key: 'spend', label: 'Spend Amount' },
                      { key: 'impressions', label: 'Impressions' },
                      { key: 'clicks', label: 'Clicks' },
                      { key: 'conversions', label: 'Orders / Conversions' },
                      { key: 'revenue', label: 'Attributed Revenue' },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          {field.label}
                        </label>
                        <select
                          value={(fieldMapping as any)[field.key]}
                          onChange={(e) =>
                            setFieldMapping({ ...fieldMapping, [field.key]: e.target.value })
                          }
                          className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                        >
                          <option value="">-- Ignore / Unmapped --</option>
                          {csvValidation.headers.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Sample Data Preview (First 5 Rows)
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                          {csvValidation.headers.map((h) => (
                            <th key={h} className="py-2 px-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                        {csvValidation.previewRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            {csvValidation.headers.map((h) => (
                              <td key={h} className="py-2 px-3">{row[h] || '-'}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Commit Action Button */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCommitImport}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-sparkline-blue hover:bg-sparkline-blue-hover rounded-lg transition-colors shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm & Ingest Performance Data</span>
                  </button>
                </div>

                {/* Import Result Feedback */}
                {importResult && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-800 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Dataset Ingested Successfully
                    </div>
                    <div>
                      Imported <strong>{importResult.importedCount}</strong> records into project dataset.
                      {importResult.duplicateCount > 0 && (
                        <span> Skipped <strong>{importResult.duplicateCount}</strong> duplicate historical rows.</span>
                      )}
                    </div>
                    <div className="pt-2">
                      <Link
                        to="/dashboard/analytics"
                        className="font-bold underline text-emerald-900 hover:text-emerald-950"
                      >
                        Open Unified Analytics to view charts &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Synchronization Audit History */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Recent Synchronization Jobs & Ingestion Runs
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                Showing last {syncLogs.length} events
              </span>
            </div>

            {syncLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No synchronization activity recorded yet. Connect a platform connector or trigger a sync to see audit logs.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Timestamp</th>
                      <th className="py-2.5 px-4">Provider</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Processed</th>
                      <th className="py-2.5 px-4">Imported</th>
                      <th className="py-2.5 px-4">Duplicates Skipped</th>
                      <th className="py-2.5 px-4">Job ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    {syncLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-sans text-slate-600">
                          {new Date(log.startedAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-sans font-bold text-sparkline-midnight">
                          {log.providerId}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                            log.status === 'success'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {log.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">{log.recordsProcessed}</td>
                        <td className="py-3 px-4 font-bold text-emerald-700">+{log.recordsImported}</td>
                        <td className="py-3 px-4 text-slate-400">{log.duplicatesSkipped}</td>
                        <td className="py-3 px-4 text-slate-400 text-[11px]">{log.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Setup Guide Modal */}
      {setupModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sparkline-midnight/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-premium space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-sparkline-midnight">
                  Connect {setupModalProvider.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Production OAuth 2.0 & API Configuration Guide
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSetupModalProvider(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800">Prerequisites & Setup:</div>
                <p>{setupModalProvider.configRequirements.instructions}</p>
                {setupModalProvider.configRequirements.missingFields.length > 0 && (
                  <div className="pt-2">
                    <span className="font-semibold text-slate-700">Required Environment Keys:</span>
                    <ul className="list-disc list-inside mt-1 font-mono text-[11px] text-slate-800">
                      {setupModalProvider.configRequirements.missingFields.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <div className="font-bold text-slate-800 mb-1">Required OAuth Scopes:</div>
                <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                  {setupModalProvider.requiredScopes.map((s) => (
                    <span key={s} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-800 mb-1">Authorized Redirect URI:</div>
                <div className="bg-slate-100 font-mono text-[11px] text-slate-800 p-2 rounded border border-slate-200 break-all select-all">
                  https://app.sparklinemarketing.com/api/auth/callback
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-slate-700 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-sparkline-blue shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Tokens are encrypted at rest using AES-256 GCM in Supabase Vault. Sparkline never sends raw tokens to the client browser.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  handleConnectSandbox(setupModalProvider.providerId, setupModalProvider.name);
                  setSetupModalProvider(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sparkline-midnight hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
              >
                <span>Launch Sandbox Connector</span>
              </button>

              <button
                type="button"
                onClick={() => setSetupModalProvider(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
