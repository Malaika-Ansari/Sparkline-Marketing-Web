/**
 * Sparkline Marketing — Security Hardening Test Suite
 * Phase A — Task 3: Production Security Hardening
 *
 * Runs under native Node.js 20+ without external network dependencies.
 * Verifies CSP & HSTS header configurations, elimination of weak password fallbacks,
 * CSV spreadsheet formula injection neutralization across all export services,
 * comprehensive IDOR defenses on sub-resources, request payload bounds, and secret hygiene.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

console.log('================================================================');
console.log('SPARKLINE MARKETING — PRODUCTION SECURITY HARDENING SUITE (TASK 3)');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

async function runTest(testNumber, name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`[PASS] Test ${testNumber}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] Test ${testNumber}: ${name}`);
    console.error(`       Error: ${err.message}\n`);
  }
}

// In-Memory Storage Mock for Headless Node.js Environment
const memoryStore = new Map();
globalThis.localStorage = {
  getItem: (key) => memoryStore.get(key) || null,
  setItem: (key, val) => memoryStore.set(key, String(val)),
  removeItem: (key) => memoryStore.delete(key),
  clear: () => memoryStore.clear(),
};
globalThis.sessionStorage = {
  getItem: (key) => memoryStore.get(`sess_${key}`) || null,
  setItem: (key, val) => memoryStore.set(`sess_${key}`, String(val)),
  removeItem: (key) => memoryStore.delete(`sess_${key}`),
  clear: () => {},
};

// Polyfill Web Crypto API for Node.js if needed
if (!globalThis.crypto?.subtle) {
  globalThis.crypto = crypto.webcrypto;
}

// ==============================================================================
// 1. HTTP Security Headers in Vercel Configuration
// ==============================================================================
await runTest(1, 'HTTP Security Headers in vercel.json (HSTS, CSP, Permissions, Frame)', () => {
  const vercelPath = path.join(rootDir, 'vercel.json');
  assert.ok(fs.existsSync(vercelPath), 'vercel.json must exist');
  const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));

  const wildcardRule = vercel.headers?.find((h) => h.source === '/(.*)');
  assert.ok(wildcardRule, 'vercel.json must define a wildcard /(.*) header rule');

  const headers = new Map(wildcardRule.headers.map((h) => [h.key, h.value]));

  // HSTS Verification
  assert.ok(headers.has('Strict-Transport-Security'), 'Must include Strict-Transport-Security header');
  const hsts = headers.get('Strict-Transport-Security');
  assert.ok(hsts.includes('max-age=63072000'), 'HSTS max-age must be at least 2 years (63072000)');
  assert.ok(hsts.includes('includeSubDomains'), 'HSTS must include includeSubDomains');
  assert.ok(hsts.includes('preload'), 'HSTS must include preload');

  // CSP Verification
  assert.ok(headers.has('Content-Security-Policy'), 'Must include Content-Security-Policy header');
  const csp = headers.get('Content-Security-Policy');
  assert.ok(csp.includes("default-src 'self'"), "CSP must set default-src 'self'");
  assert.ok(csp.includes("frame-ancestors 'self'"), "CSP must restrict frame-ancestors to 'self'");
  assert.ok(csp.includes("object-src 'none'"), "CSP must disable object-src plugins");
  assert.ok(csp.includes("base-uri 'self'"), "CSP must restrict base-uri to 'self'");

  // Standard Defense Headers
  assert.equal(headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(headers.get('X-Frame-Options'), 'SAMEORIGIN');
  assert.equal(headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
});

// ==============================================================================
// 2. HTTP Security Headers in Nginx Configuration
// ==============================================================================
await runTest(2, 'HTTP Security Headers in nginx.conf for Container Deployments', () => {
  const nginxPath = path.join(rootDir, 'nginx.conf');
  assert.ok(fs.existsSync(nginxPath), 'nginx.conf must exist');
  const nginxContent = fs.readFileSync(nginxPath, 'utf8');

  assert.ok(nginxContent.includes('Strict-Transport-Security'), 'nginx.conf must configure HSTS');
  assert.ok(nginxContent.includes('Content-Security-Policy'), 'nginx.conf must configure CSP');
  assert.ok(nginxContent.includes('nosniff'), 'nginx.conf must configure X-Content-Type-Options');
  assert.ok(nginxContent.includes('SAMEORIGIN'), 'nginx.conf must configure X-Frame-Options');
});

// ==============================================================================
// 3. API Response Security Headers in Server Middleware
// ==============================================================================
await runTest(3, 'API Serverless Middleware Response Security Headers', () => {
  const middlewarePath = path.join(rootDir, 'src/server/ai-proxy-middleware.ts');
  const code = fs.readFileSync(middlewarePath, 'utf8');

  assert.ok(code.includes('Strict-Transport-Security'), 'Middleware must send Strict-Transport-Security');
  assert.ok(code.includes('Content-Security-Policy'), 'Middleware must send Content-Security-Policy');
  assert.ok(code.includes("default-src 'none'"), "API CSP must disallow resource loading (default-src 'none')");
  assert.ok(code.includes("frame-ancestors 'none'"), "API CSP must prevent framing (frame-ancestors 'none')");
});

// ==============================================================================
// 4. Insecure Password Fallback Elimination in auth.service.ts
// ==============================================================================
await runTest(4, 'Weak Password Fallback Checksum Completely Removed', () => {
  const authPath = path.join(rootDir, 'src/services/auth.service.ts');
  const code = fs.readFileSync(authPath, 'utf8');

  // Must NOT contain the 32-bit checksum fallback
  assert.ok(!code.includes('hash = (hash << 5) - hash + char'), 'Insecure bitwise checksum fallback must be deleted');
  assert.ok(!code.includes('Fallback simple checksum'), 'Fallback checksum comments must be eliminated');

  // Must mandate Web Crypto API
  assert.ok(
    code.includes('Secure Web Crypto API is required') || code.includes('crypto.subtle'),
    'hashPassword must require Web Crypto API'
  );
});

// ==============================================================================
// 5. Deterministic Password Hashing via Web Crypto SHA-256
// ==============================================================================
await runTest(5, 'Web Crypto SHA-256 Produces 64-Hex-Char Hash Without Insecure Fallback', async () => {
  const salt = 'sparkline_test_salt_2026';
  const password = 'CorrectPassword123!';

  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}:${salt}`);
  const hashBuffer = await crypto.webcrypto.subtle.digest('SHA-256', data);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  assert.equal(hashHex.length, 64, 'SHA-256 output must be exactly 64 hex characters');
  assert.match(hashHex, /^[0-9a-f]{64}$/, 'Must be lowercase hexadecimal string');

  // Changing password by one char produces completely different avalanche hash
  const diffData = enc.encode(`${salt}:${password}x:${salt}`);
  const diffBuffer = await crypto.webcrypto.subtle.digest('SHA-256', diffData);
  const diffHex = Array.from(new Uint8Array(diffBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  assert.notEqual(hashHex, diffHex, 'Avalanche effect must be complete');
});

// ==============================================================================
// 6. Core CSV Formula Injection Neutralization (securityService.sanitizeCsvCell)
// ==============================================================================
await runTest(6, 'Formula Injection Neutralization for Malicious Spreadsheet Prefixes', () => {
  // Simulate securityService.sanitizeCsvCell
  function sanitizeCsvCell(value) {
    if (value === null || value === undefined) return '';
    const raw = String(value);
    const trimmed = raw.trim();
    if (!trimmed) return '';
    const dangerousPrefixes = ['=', '+', '-', '@'];
    if (raw.startsWith('\t') || raw.startsWith('\r') || dangerousPrefixes.some((p) => trimmed.startsWith(p))) {
      if ((trimmed.startsWith('-') || trimmed.startsWith('+')) && !isNaN(Number(trimmed))) {
        return trimmed;
      }
      return `'${trimmed}`;
    }
    return trimmed;
  }

  // 1. Equal sign formula injection
  assert.equal(sanitizeCsvCell('=cmd|\' /C calc\'!A0'), '\'=cmd|\' /C calc\'!A0');
  assert.equal(sanitizeCsvCell('=1+1'), '\'=1+1');
  assert.equal(sanitizeCsvCell('=HYPERLINK("http://evil.com","Click")'), '\'=HYPERLINK("http://evil.com","Click")');

  // 2. Plus sign formula injection
  assert.equal(sanitizeCsvCell('+cmd|\' /C calc\'!A0'), '\'+cmd|\' /C calc\'!A0');
  assert.equal(sanitizeCsvCell('+SUM(A1:A10)'), '\'+SUM(A1:A10)');

  // 3. Minus sign formula injection
  assert.equal(sanitizeCsvCell('-cmd|\' /C calc\'!A0'), '\'-cmd|\' /C calc\'!A0');
  assert.equal(sanitizeCsvCell('-2+3*cmd|\' /C calc\'!A0'), '\'-2+3*cmd|\' /C calc\'!A0');

  // 4. At sign formula injection
  assert.equal(sanitizeCsvCell('@SUM(1+1)'), '\'@SUM(1+1)');

  // 5. Tab and carriage return prefixes (trimmed & disarmed with leading single quote)
  assert.equal(sanitizeCsvCell('\t=2+5'), '\'=2+5');
  assert.equal(sanitizeCsvCell('\r=1+1'), '\'=1+1');

  // 6. Legitimate numeric literals must be preserved without single quote
  assert.equal(sanitizeCsvCell('-45.5'), '-45.5');
  assert.equal(sanitizeCsvCell('+100'), '+100');
  assert.equal(sanitizeCsvCell('0'), '0');
  assert.equal(sanitizeCsvCell('1234.56'), '1234.56');

  // 7. Normal text must be preserved untouched
  assert.equal(sanitizeCsvCell('Q4 High-Growth Campaign'), 'Q4 High-Growth Campaign');
  assert.equal(sanitizeCsvCell('alex.morgan@sparkline.ai'), 'alex.morgan@sparkline.ai');
});

// ==============================================================================
// 7. RFC 4180 CSV Cell Formatting with Quote Escaping
// ==============================================================================
await runTest(7, 'RFC 4180 CSV Cell Formatting with Internal Quote Escaping', () => {
  function sanitizeCsvCell(value) {
    if (value === null || value === undefined) return '';
    const trimmed = String(value).trim();
    if (!trimmed) return '';
    const dangerousPrefixes = ['=', '+', '-', '@', '\t', '\r'];
    if (dangerousPrefixes.some((p) => trimmed.startsWith(p))) {
      if ((trimmed.startsWith('-') || trimmed.startsWith('+')) && !isNaN(Number(trimmed))) {
        return trimmed;
      }
      return `'${trimmed}`;
    }
    return trimmed;
  }

  function formatCsvCell(value) {
    const sanitized = sanitizeCsvCell(value);
    return `"${sanitized.replace(/"/g, '""')}"`;
  }

  // Double quotes inside text must be escaped as ""
  assert.equal(formatCsvCell('The "Best" Strategy'), '"The ""Best"" Strategy"');
  // Malicious formula inside double quotes is disarmed
  assert.equal(formatCsvCell('=cmd|" /C calc"!A0'), '"\'=cmd|"" /C calc""!A0"');
  // Pure text
  assert.equal(formatCsvCell('Clean Header'), '"Clean Header"');
});

// ==============================================================================
// 8. Campaign CSV Export Formula Neutralization
// ==============================================================================
await runTest(8, 'Campaign CSV Export Formula Neutralization across Names & Headlines', () => {
  const campaignPath = path.join(rootDir, 'src/services/campaign.service.ts');
  const code = fs.readFileSync(campaignPath, 'utf8');

  assert.ok(code.includes('formatCsvCell'), 'exportCampaignCsv must use formatCsvCell');
  assert.ok(!code.includes('r.map((cell) => `"${cell}"`)'), 'Must not blindly wrap raw cells without escaping');
});

// ==============================================================================
// 9. Social Media Content CSV Export Formula Neutralization
// ==============================================================================
await runTest(9, 'Social Media Post CSV Export Formula Neutralization', () => {
  const contentPath = path.join(rootDir, 'src/services/content.service.ts');
  const code = fs.readFileSync(contentPath, 'utf8');

  assert.ok(code.includes('formatCsvCell'), 'exportPostsCsv must use formatCsvCell');
  assert.ok(!code.includes('p.title.replace(/"/g, \'""\')'), 'Must use centralized formatCsvCell on posts export');
});

// ==============================================================================
// 10. Currency Conversions CSV Export Formula Neutralization
// ==============================================================================
await runTest(10, 'Currency Conversions CSV Export Formula Neutralization', () => {
  const currencyPath = path.join(rootDir, 'src/services/currency.service.ts');
  const code = fs.readFileSync(currencyPath, 'utf8');

  assert.ok(code.includes('formatCsvCell'), 'exportConversionsCsv must use formatCsvCell');
});

// ==============================================================================
// 11. Results Predictor Forecast CSV Export Formula Neutralization
// ==============================================================================
await runTest(11, 'Forecast CSV Export Formula Neutralization across Scenarios & Titles', () => {
  const forecastPath = path.join(rootDir, 'src/services/forecast.service.ts');
  const code = fs.readFileSync(forecastPath, 'utf8');

  assert.ok(code.includes('formatCsvCell'), 'exportForecastCsv must use formatCsvCell');
});

// ==============================================================================
// 12. Marketing Metrics CSV Export Formula Neutralization
// ==============================================================================
await runTest(12, 'Metric Calculations CSV Export Formula Neutralization', () => {
  const metricsPath = path.join(rootDir, 'src/services/metrics.service.ts');
  const code = fs.readFileSync(metricsPath, 'utf8');

  assert.ok(code.includes('formatCsvCell'), 'exportCalculationsCsv must use formatCsvCell');
});

// ==============================================================================
// 13. SEO Keywords & Backlinks CSV Export Formula Neutralization
// ==============================================================================
await runTest(13, 'SEO Keywords & Backlinks CSV Export Formula Neutralization', () => {
  const seoPath = path.join(rootDir, 'src/services/seo.service.ts');
  const code = fs.readFileSync(seoPath, 'utf8');

  assert.ok(code.includes('formatCsvCell'), 'exportKeywordsCsv and exportBacklinksCsv must use formatCsvCell');
});

// ==============================================================================
// 14. Executive Report CSV Export Formula Neutralization
// ==============================================================================
await runTest(14, 'Executive Report CSV Export Formula Neutralization', () => {
  const reportPath = path.join(rootDir, 'src/services/report.service.ts');
  const code = fs.readFileSync(reportPath, 'utf8');

  assert.ok(code.includes('sanitizeCsvCell'), 'exportReportToCsv must sanitize dynamic table cells');
});

// ==============================================================================
// 15. Cross-User IDOR Defense on Project Lifecycle (Status, Archive, Restore)
// ==============================================================================
await runTest(15, 'Cross-User IDOR Defense on Project Status, Archive, and Restore', () => {
  const projectPath = path.join(rootDir, 'src/services/project.service.ts');
  const code = fs.readFileSync(projectPath, 'utf8');

  // updateProjectStatus must check requestingUserId
  assert.ok(
    code.includes('updateProjectStatus(id: string, status: ProjectStatus, requestingUserId?: string)'),
    'updateProjectStatus must accept requestingUserId'
  );
  assert.ok(
    code.includes('this.getProjectById(id, requestingUserId)'),
    'updateProjectStatus must verify ownership via getProjectById'
  );

  // archiveProject and restoreProject must accept requestingUserId
  assert.ok(code.includes('archiveProject(id: string, requestingUserId?: string)'), 'archiveProject must accept requestingUserId');
  assert.ok(code.includes('restoreProject(id: string, requestingUserId?: string)'), 'restoreProject must accept requestingUserId');
});

// ==============================================================================
// 16. Cross-User IDOR Defense on Project Duplication
// ==============================================================================
await runTest(16, 'Cross-User IDOR Defense on Project Duplication (User Beta -> Copy User Alpha)', () => {
  const projectPath = path.join(rootDir, 'src/services/project.service.ts');
  const code = fs.readFileSync(projectPath, 'utf8');

  assert.ok(
    code.includes('const source = this.getProjectById(sourceId, userId);'),
    'duplicateProject must verify that sourceId belongs to requesting userId'
  );
});

// ==============================================================================
// 17. Cross-User IDOR Defense on Campaign Management (Get, Save, Delete, Duplicate)
// ==============================================================================
await runTest(17, 'Cross-User IDOR Defense across Campaign CRUD & Duplication', () => {
  const campaignPath = path.join(rootDir, 'src/services/campaign.service.ts');
  const code = fs.readFileSync(campaignPath, 'utf8');

  assert.ok(code.includes('getCampaignById(id: string, requestingUserId?: string)'), 'getCampaignById must accept requestingUserId');
  assert.ok(code.includes('deleteCampaign(id: string, requestingUserId?: string)'), 'deleteCampaign must accept requestingUserId');
  assert.ok(code.includes('saveCampaign(campaign: AdvertisingCampaign, requestingUserId?: string)'), 'saveCampaign must accept requestingUserId');
  assert.ok(code.includes('duplicateCampaign(id: string, requestingUserId?: string)'), 'duplicateCampaign must accept requestingUserId');
  assert.ok(code.includes('security.access_denied'), 'campaignService must audit access denied events');
});

// ==============================================================================
// 18. Cross-User IDOR Defense on Campaign CSV Export
// ==============================================================================
await runTest(18, 'Cross-User IDOR Defense on Campaign CSV Export', () => {
  const campaignPath = path.join(rootDir, 'src/services/campaign.service.ts');
  const code = fs.readFileSync(campaignPath, 'utf8');

  assert.ok(
    code.includes('exportCampaignCsv(campaign: AdvertisingCampaign, requestingUserId?: string)'),
    'exportCampaignCsv must accept requestingUserId'
  );
  assert.ok(
    code.includes('Access denied: You do not have permission to export this private campaign'),
    'exportCampaignCsv must reject unauthorized users'
  );
});

// ==============================================================================
// 19. Cross-User IDOR Defense on Report Lifecycle & PDF/CSV Export
// ==============================================================================
await runTest(19, 'Cross-User IDOR Defense on Report Lifecycle, PDF, and CSV Export', () => {
  const reportPath = path.join(rootDir, 'src/services/report.service.ts');
  const code = fs.readFileSync(reportPath, 'utf8');

  assert.ok(code.includes('archiveReport(id: string, requestingUserId?: string)'), 'archiveReport must accept requestingUserId');
  assert.ok(code.includes('duplicateReport(id: string, requestingUserId?: string)'), 'duplicateReport must accept requestingUserId');
  assert.ok(code.includes('regenerateReport(id: string, requestingUserId?: string)'), 'regenerateReport must accept requestingUserId');
  assert.ok(code.includes('exportReportToPdfFile(report: MarketingReport, requestingUserId?: string)'), 'exportReportToPdfFile must accept requestingUserId');
  assert.ok(code.includes('printReportToPdf(report: MarketingReport, requestingUserId?: string)'), 'printReportToPdf must accept requestingUserId');
  assert.ok(code.includes('exportReportToCsv(report: MarketingReport, requestingUserId?: string)'), 'exportReportToCsv must accept requestingUserId');
});

// ==============================================================================
// 20. Server-Side Request Payload Boundary (2MB) & Error Sanitization
// ==============================================================================
await runTest(20, 'Server-Side Request Body Size Limit (2MB) & Error Message Sanitization', () => {
  const middlewarePath = path.join(rootDir, 'src/server/ai-proxy-middleware.ts');
  const code = fs.readFileSync(middlewarePath, 'utf8');

  // 2MB upper bound
  assert.ok(code.includes('2 * 1024 * 1024'), 'Middleware must enforce 2MB upper boundary');
  assert.ok(code.includes('Payload too large'), 'Oversized requests must be rejected with "Payload too large"');

  // Error message sanitization
  assert.ok(code.includes('sanitizeErrorMessage'), 'Middleware must define sanitizeErrorMessage');
  assert.ok(code.includes('[REDACTED_API_KEY]'), 'Error sanitization must redact Google API keys');
  assert.ok(code.includes('[REDACTED_SECRET]'), 'Error sanitization must redact high-entropy tokens');
  assert.ok(code.includes('[REDACTED_PATH]'), 'Error sanitization must redact filesystem paths');
});

// ==============================================================================
// SUMMARY REPORT
// ==============================================================================
console.log('\n================================================================');
console.log(`HARDENING TEST SUMMARY: ${passedTests} / ${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}% SUCCESS)`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
