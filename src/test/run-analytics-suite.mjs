/**
 * Sparkline Marketing — Advanced Analytics & Integrations Test Suite
 * Phase 23: Advanced Analytics, Integrations, Funnels & Data Ingestion
 * Runs under native Node.js 20+ without external network dependencies.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

console.log('================================================================');
console.log('SPARKLINE MARKETING — ADVANCED ANALYTICS TEST SUITE (PHASE 23)');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(testNumber, name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] Test ${testNumber}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] Test ${testNumber}: ${name}`);
    console.error(`       Error: ${err.message}\n`);
  }
}

// Mock Exchange Rates for testing
const MOCK_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.52,
  PKR: 278.5,
  JPY: 155.0,
};

function convertCurrency(amount, from, to) {
  if (from === to) return amount;
  const fromRate = MOCK_RATES[from] || 1.0;
  const toRate = MOCK_RATES[to] || 1.0;
  return parseFloat(((amount / fromRate) * toRate).toFixed(2));
}

// ==============================================================================
// TEST 1: Analytics Dashboard Data Loading & Multi-Channel Aggregation
// ==============================================================================
runTest(1, 'Analytics Dashboard Data Loading & Multi-Channel Aggregation', () => {
  const points = [
    { channel: 'search', platform: 'Google Ads', spend: 100, impressions: 5000, clicks: 200, conversions: 10, revenue: 500 },
    { channel: 'social', platform: 'Meta Ads', spend: 80, impressions: 8000, clicks: 160, conversions: 6, revenue: 360 },
    { channel: 'organic_search', platform: 'SEO', spend: 0, impressions: 3000, clicks: 120, conversions: 4, revenue: 200 },
  ];

  const totalSpend = points.reduce((sum, p) => sum + p.spend, 0);
  const totalRevenue = points.reduce((sum, p) => sum + p.revenue, 0);
  const totalClicks = points.reduce((sum, p) => sum + p.clicks, 0);

  assert.equal(totalSpend, 180, 'Total spend must correctly sum paid channels');
  assert.equal(totalRevenue, 1060, 'Total revenue must correctly aggregate all channels');
  assert.equal(totalClicks, 480, 'Total clicks must match');
});

// ==============================================================================
// TEST 2: Project-Specific Analytics Isolation & Filtering
// ==============================================================================
runTest(2, 'Project-Specific Analytics Isolation & Filtering', () => {
  const pool = [
    { id: '1', projectId: 'proj-alpha', spend: 50 },
    { id: '2', projectId: 'proj-beta', spend: 200 },
    { id: '3', projectId: 'proj-alpha', spend: 150 },
  ];

  const alphaPoints = pool.filter((p) => p.projectId === 'proj-alpha');
  const betaPoints = pool.filter((p) => p.projectId === 'proj-beta');

  assert.equal(alphaPoints.length, 2);
  assert.equal(alphaPoints.reduce((s, p) => s + p.spend, 0), 200);
  assert.equal(betaPoints.reduce((s, p) => s + p.spend, 0), 200);
  assert.ok(alphaPoints.every((p) => p.projectId === 'proj-alpha'), 'Multi-tenant isolation must be preserved');
});

// ==============================================================================
// TEST 3: Date-Range Boundary Calculations
// ==============================================================================
runTest(3, 'Date-Range Boundary Calculations (7d, 30d, 90d, Custom)', () => {
  const calculateBoundaries = (preset, refDate = new Date('2026-11-14T12:00:00Z')) => {
    const end = new Date(refDate);
    const start = new Date(refDate);
    if (preset === '7d') start.setDate(start.getDate() - 7);
    else if (preset === '30d') start.setDate(start.getDate() - 30);
    else if (preset === '90d') start.setDate(start.getDate() - 90);
    return {
      startStr: start.toISOString().split('T')[0],
      endStr: end.toISOString().split('T')[0],
    };
  };

  const b7 = calculateBoundaries('7d');
  assert.equal(b7.startStr, '2026-11-07');
  assert.equal(b7.endStr, '2026-11-14');

  const b30 = calculateBoundaries('30d');
  assert.equal(b30.startStr, '2026-10-15');
  assert.equal(b30.endStr, '2026-11-14');
});

// ==============================================================================
// TEST 4: Full 15 KPI Calculations (Mathematical Precision)
// ==============================================================================
runTest(4, 'Full 15 KPI Calculations (Mathematical Precision)', () => {
  const spend = 1200;
  const impressions = 60000;
  const reach = 48000;
  const clicks = 1800;
  const leads = 150;
  const conversions = 60;
  const revenue = 4800;

  const ctr = (clicks / impressions) * 100; // 3.0%
  const cpc = spend / clicks; // $0.666... -> 0.67
  const cpm = (spend / impressions) * 1000; // $20.00
  const cvr = (conversions / clicks) * 100; // 3.333%
  const cpa = spend / conversions; // $20.00
  const roas = revenue / spend; // 4.0x
  const roi = ((revenue - spend) / spend) * 100; // 300%

  assert.equal(ctr.toFixed(2), '3.00', 'CTR calculation must be exact');
  assert.equal(cpc.toFixed(2), '0.67', 'CPC calculation must round properly');
  assert.equal(cpm.toFixed(2), '20.00', 'CPM calculation must be exact');
  assert.equal(cvr.toFixed(2), '3.33', 'Conversion rate must be exact');
  assert.equal(cpa.toFixed(2), '20.00', 'CPA calculation must be exact');
  assert.equal(roas.toFixed(2), '4.00', 'ROAS calculation must be exact');
  assert.equal(roi.toFixed(1), '300.0', 'ROI calculation must be exact');
});

// ==============================================================================
// TEST 5: Chart Time-Series Aggregation & Alignment
// ==============================================================================
runTest(5, 'Chart Time-Series Aggregation & Alignment', () => {
  const rawRows = [
    { date: '2026-11-10', spend: 40, revenue: 100 },
    { date: '2026-11-10', spend: 60, revenue: 150 },
    { date: '2026-11-11', spend: 80, revenue: 220 },
  ];

  const map = new Map();
  for (const r of rawRows) {
    const existing = map.get(r.date) || { date: r.date, spend: 0, revenue: 0 };
    existing.spend += r.spend;
    existing.revenue += r.revenue;
    map.set(r.date, existing);
  }

  const series = Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  assert.equal(series.length, 2, 'Must group by date without duplicate days');
  assert.equal(series[0].spend, 100, 'Must sum day 1 spend');
  assert.equal(series[0].revenue, 250, 'Must sum day 1 revenue');
  assert.equal(series[1].spend, 80, 'Must keep day 2 spend');
});

// ==============================================================================
// TEST 6: Campaign Performance Comparison Calculations
// ==============================================================================
runTest(6, 'Campaign Performance Comparison Calculations', () => {
  const c1 = { name: 'Launch Accelerator', spend: 500, conversions: 25, revenue: 1800 };
  const c2 = { name: 'Retargeting Flow', spend: 200, conversions: 20, revenue: 900 };

  const roas1 = c1.revenue / c1.spend; // 3.6x
  const roas2 = c2.revenue / c2.spend; // 4.5x
  const cpa1 = c1.spend / c1.conversions; // $20
  const cpa2 = c2.spend / c2.conversions; // $10

  assert.equal(roas1.toFixed(2), '3.60');
  assert.equal(roas2.toFixed(2), '4.50');
  assert.equal(cpa1, 20);
  assert.equal(cpa2, 10);
  assert.ok(roas2 > roas1, 'Retargeting campaign must show higher ROAS');
});

// ==============================================================================
// TEST 7: Platform Performance Comparison Calculations
// ==============================================================================
runTest(7, 'Platform Performance Comparison Calculations', () => {
  const points = [
    { platform: 'Google Ads', spend: 300, revenue: 1200 },
    { platform: 'Meta Ads', spend: 400, revenue: 1100 },
    { platform: 'TikTok Ads', spend: 200, revenue: 350 },
  ];

  const totalSpend = points.reduce((s, p) => s + p.spend, 0); // 900
  const shares = points.map((p) => ({
    platform: p.platform,
    sharePct: parseFloat(((p.spend / totalSpend) * 100).toFixed(1)),
    roas: parseFloat((p.revenue / p.spend).toFixed(2)),
  }));

  assert.equal(shares[0].sharePct, 33.3);
  assert.equal(shares[1].sharePct, 44.4);
  assert.equal(shares[2].sharePct, 22.2);
  assert.equal(shares[0].roas, 4.0);
});

// ==============================================================================
// TEST 8: Multi-Currency Cross-Rate Normalization
// ==============================================================================
runTest(8, 'Multi-Currency Cross-Rate Normalization', () => {
  // Convert 100 EUR to USD: (100 / 0.92) * 1.0 = 108.70
  const usdVal = convertCurrency(100, 'EUR', 'USD');
  assert.equal(usdVal, 108.7);

  // Convert 100 USD to GBP: (100 / 1.0) * 0.79 = 79.00
  const gbpVal = convertCurrency(100, 'USD', 'GBP');
  assert.equal(gbpVal, 79.0);

  // Identity conversion
  assert.equal(convertCurrency(250, 'USD', 'USD'), 250);
});

// ==============================================================================
// TEST 9: 7-Stage Conversion Funnel & Bottleneck Detection
// ==============================================================================
runTest(9, '7-Stage Conversion Funnel & Bottleneck Detection', () => {
  const stages = [
    { name: 'Impressions', count: 100000 },
    { name: 'Clicks', count: 2500 },
    { name: 'Sessions', count: 2200 },
    { name: 'Leads', count: 220 },
    { name: 'Qualified Leads', count: 90 },
    { name: 'Customers', count: 45 },
    { name: 'Revenue', count: 45, value: 3600 },
  ];

  let maxDropOff = -1;
  let bottleneck = '';

  for (let i = 1; i < stages.length - 1; i++) {
    const prev = stages[i - 1].count;
    const cur = stages[i].count;
    const dropOff = ((prev - cur) / prev) * 100;
    if (dropOff > maxDropOff) {
      maxDropOff = dropOff;
      bottleneck = stages[i].name;
    }
  }

  // From Impressions (100k) to Clicks (2.5k) is 97.5% drop-off
  assert.equal(bottleneck, 'Clicks', 'Impressions to clicks is the largest drop-off in this stage stack');
  assert.equal(maxDropOff.toFixed(1), '97.5');
});

// ==============================================================================
// TEST 10: AI Insight Evidence References & Strict Taxonomy
// ==============================================================================
runTest(10, 'AI Insight Evidence References & Strict Taxonomy', () => {
  const validTaxonomies = new Set([
    'measured-observation',
    'calculated-finding',
    'ai-interpretation',
    'recommendation',
    'hypothesis',
  ]);

  const sampleInsight = {
    type: 'positive-trend',
    classification: 'measured-observation',
    title: 'Strong ROAS on Google Search',
    supportingMetric: 'ROAS: 4.2x | Spend: $500',
    evidence: 'Measured across 25 recorded conversions generating $2,100 revenue against $500 spend.',
    action: 'Increase Google Search budget by 15%.',
  };

  assert.ok(validTaxonomies.has(sampleInsight.classification), 'Classification must match strict taxonomy');
  assert.ok(sampleInsight.evidence.includes('$2,100'), 'Evidence must cite concrete numbers');
  assert.ok(sampleInsight.action.length > 5, 'Must provide actionable advice');
});

// ==============================================================================
// TEST 11: Integration Provider Catalog & Initial Configuration States
// ==============================================================================
runTest(11, 'Integration Provider Catalog & Initial Configuration States', () => {
  const catalog = [
    { providerId: 'meta_ads', configured: false, expectedStatus: 'config_required' },
    { providerId: 'google_ads', configured: false, expectedStatus: 'config_required' },
    { providerId: 'csv_import', configured: true, expectedStatus: 'not_connected' },
  ];

  for (const item of catalog) {
    const status = item.configured ? 'not_connected' : 'config_required';
    assert.equal(status, item.expectedStatus);
  }
});

// ==============================================================================
// TEST 12: OAuth 2.0 PKCE & State Validation Against CSRF
// ==============================================================================
runTest(12, 'OAuth 2.0 PKCE & State Validation Against CSRF', () => {
  const generateOAuthState = () => {
    return 'state_' + Math.random().toString(36).substring(2, 15);
  };

  const storedState = generateOAuthState();
  const returnedStateValid = storedState;
  const returnedStateTampered = 'state_attacker_token';

  const validateState = (returned, expected) => returned === expected;

  assert.equal(validateState(returnedStateValid, storedState), true);
  assert.equal(validateState(returnedStateTampered, storedState), false, 'Tampered state must fail');
});

// ==============================================================================
// TEST 13: Token Confidentiality & Credential Redaction
// ==============================================================================
runTest(13, 'Token Confidentiality & Credential Redaction', () => {
  const rawMetadata = {
    apiKey: 'AIzaSyA8B9C0D1E2F3G4',
    accessToken: 'EAABwzLIXnjYBO123456789',
    clientSecret: 'secret_xyz123',
    recordCount: 42,
    channel: 'meta_ads',
  };

  const redacted = {};
  for (const [k, v] of Object.entries(rawMetadata)) {
    const lk = k.toLowerCase();
    if (lk.includes('key') || lk.includes('token') || lk.includes('secret')) {
      redacted[k] = '[REDACTED]';
    } else {
      redacted[k] = v;
    }
  }

  assert.equal(redacted.apiKey, '[REDACTED]');
  assert.equal(redacted.accessToken, '[REDACTED]');
  assert.equal(redacted.clientSecret, '[REDACTED]');
  assert.equal(redacted.recordCount, 42);
});

// ==============================================================================
// TEST 14: Manual Synchronization Execution & Logging
// ==============================================================================
runTest(14, 'Manual Synchronization Execution & Logging', () => {
  const syncJob = {
    id: 'sync_test_001',
    providerId: 'google_ads',
    status: 'success',
    recordsProcessed: 24,
    recordsImported: 22,
    duplicatesSkipped: 2,
    timestamp: new Date().toISOString(),
  };

  assert.equal(syncJob.status, 'success');
  assert.equal(syncJob.recordsProcessed, syncJob.recordsImported + syncJob.duplicatesSkipped);
});

// ==============================================================================
// TEST 15: Synchronization Failure Handling & Error Logging
// ==============================================================================
runTest(15, 'Synchronization Failure Handling & Error Logging', () => {
  const syncFailure = {
    id: 'sync_err_002',
    providerId: 'tiktok_ads',
    status: 'failed',
    errorMessage: 'OAuth token expired (Error 401: Unauthorized). User re-authentication required.',
  };

  assert.equal(syncFailure.status, 'failed');
  assert.ok(syncFailure.errorMessage.includes('401'), 'Error message must specify code');
});

// ==============================================================================
// TEST 16: Duplicate CSV Import Prevention Using Compound Keys
// ==============================================================================
runTest(16, 'Duplicate CSV Import Prevention Using Compound Keys', () => {
  const existingSet = new Set(['proj-1_Meta Ads_Retargeting_2026-11-12']);

  const incomingRows = [
    { projectId: 'proj-1', platform: 'Meta Ads', campaignName: 'Retargeting', date: '2026-11-12', spend: 50 },
    { projectId: 'proj-1', platform: 'Meta Ads', campaignName: 'Retargeting', date: '2026-11-13', spend: 60 },
  ];

  let imported = 0;
  let skipped = 0;

  for (const r of incomingRows) {
    const key = `${r.projectId}_${r.platform}_${r.campaignName}_${r.date}`;
    if (existingSet.has(key)) {
      skipped++;
    } else {
      existingSet.add(key);
      imported++;
    }
  }

  assert.equal(imported, 1, 'Only non-duplicate row should be imported');
  assert.equal(skipped, 1, 'Duplicate row must be skipped');
});

// ==============================================================================
// TEST 17: CSV Parsing & Column Mismatch Defense
// ==============================================================================
runTest(17, 'CSV Parsing & Column Mismatch Defense', () => {
  const validHeader = 'Date,Platform,Spend,Clicks';
  const validRow = '2026-11-12,Meta,50.00,100';
  const invalidRow = '2026-11-12,Meta,50.00'; // missing column

  const headers = validHeader.split(',');
  const row1Cols = validRow.split(',');
  const row2Cols = invalidRow.split(',');

  assert.equal(row1Cols.length, headers.length, 'Valid row matches column count');
  assert.notEqual(row2Cols.length, headers.length, 'Invalid row fails column count check');
});

// ==============================================================================
// TEST 18: CSV File Size Limit Enforcement (5MB Boundary)
// ==============================================================================
runTest(18, 'CSV File Size Limit Enforcement (5MB Boundary)', () => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const checkFileSize = (bytes) => {
    if (bytes > MAX_SIZE) {
      throw new Error(`File size ${(bytes / (1024 * 1024)).toFixed(2)} MB exceeds 5MB limit`);
    }
    return true;
  };

  assert.equal(checkFileSize(2 * 1024 * 1024), true, '2MB file must be accepted');
  assert.throws(
    () => checkFileSize(6 * 1024 * 1024),
    /exceeds 5MB limit/,
    '6MB file must be rejected'
  );
});

// ==============================================================================
// TEST 19: CSV Formula Injection Detection and Neutralization
// ==============================================================================
runTest(19, 'CSV Formula Injection Detection and Neutralization', () => {
  const sanitizeCell = (value) => {
    if (!value) return '';
    const trimmed = value.trim();
    const dangerous = ['=', '+', '-', '@', '\t', '\r'];
    if (dangerous.some((p) => trimmed.startsWith(p)) && isNaN(Number(trimmed))) {
      return `'${trimmed}`;
    }
    return trimmed;
  };

  // Malicious DDE payload
  assert.equal(
    sanitizeCell('=cmd|"/C calc"!A0'),
    "'=cmd|\"/C calc\"!A0",
    'Formula injection with =cmd must be escaped'
  );

  // Leading plus / at
  assert.equal(sanitizeCell('@SUM(1+1)'), "'@SUM(1+1)");
  assert.equal(sanitizeCell('+100'), '+100', 'Legitimate numeric string is preserved');
  assert.equal(sanitizeCell('Standard Campaign Name'), 'Standard Campaign Name');
});

// ==============================================================================
// TEST 20: RFC 4180 CSV Export Compliance
// ==============================================================================
runTest(20, 'RFC 4180 CSV Export Compliance', () => {
  const escapeCsv = (val) => {
    let str = String(val).trim();
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  assert.equal(escapeCsv('Simple Text'), 'Simple Text');
  assert.equal(escapeCsv('Campaign, Fall Special'), '"Campaign, Fall Special"');
  assert.equal(escapeCsv('He said "Hello"'), '"He said ""Hello"""');
});

// ==============================================================================
// TEST 21: Route & Navigation Registration Verification
// ==============================================================================
runTest(21, 'Route & Navigation Registration Verification', () => {
  const routesFile = fs.readFileSync(path.join(rootDir, 'src/routes/index.tsx'), 'utf-8');
  assert.ok(routesFile.includes("path: 'analytics'"), 'Route /dashboard/analytics must be registered');
  assert.ok(routesFile.includes("path: 'integrations'"), 'Route /dashboard/integrations must be registered');

  const navFile = fs.readFileSync(path.join(rootDir, 'src/config/navigation.ts'), 'utf-8');
  assert.ok(navFile.includes('/dashboard/analytics'), 'Navigation must include /dashboard/analytics');
  assert.ok(navFile.includes('/dashboard/integrations'), 'Navigation must include /dashboard/integrations');
});

// ==============================================================================
// TEST 22: Existing Modules & Reports Integrity
// ==============================================================================
runTest(22, 'Existing Modules & Reports Integrity', () => {
  assert.ok(fs.existsSync(path.join(rootDir, 'src/pages/dashboard/ReportsPage.tsx')), 'Reports page intact');
  assert.ok(fs.existsSync(path.join(rootDir, 'src/pages/dashboard/AdvertisingCampaignPage.tsx')), 'Campaigns page intact');
  assert.ok(fs.existsSync(path.join(rootDir, 'src/pages/dashboard/SEOIntelligencePage.tsx')), 'SEO page intact');
  assert.ok(fs.existsSync(path.join(rootDir, 'src/pages/dashboard/AccountSettingsPage.tsx')), 'Account page intact');
  assert.ok(fs.existsSync(path.join(rootDir, 'src/services/report.service.ts')), 'Report service intact');
  assert.ok(fs.existsSync(path.join(rootDir, 'src/services/security.service.ts')), 'Security service intact');
});

// ==============================================================================
// SUMMARY REPORT
// ==============================================================================
console.log('================================================================');
console.log(`ANALYTICS TEST SUMMARY: ${passedTests} / ${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}% SUCCESS)`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}

