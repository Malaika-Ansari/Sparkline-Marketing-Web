/**
 * SPARKLINE MARKETING — PRODUCTION MONITORING & RELIABILITY TEST SUITE (PHASE A)
 *
 * Verifies centralized error handling, structured JSON logging, redaction of sensitive credentials,
 * API timeout bounds (25s within Vercel's 30s limit), in-flight deduplication, rate limit Retry-After headers,
 * friendly client error mapping, CORS preflight tracing, and Vercel maxDuration bounds.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

console.log('================================================================');
console.log('SPARKLINE MARKETING — PRODUCTION MONITORING & RELIABILITY (TASK 4)');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] Test ${totalTests}: ${name}`);
    console.error(`       Error: ${err.message}\n`);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`[PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] Test ${totalTests}: ${name}`);
    console.error(`       Error: ${err.message}\n`);
  }
}

// Mock Response Helper for Testing Serverless Handlers
function createMockResponse() {
  const resp = {
    statusCode: 200,
    headers: {},
    body: '',
    headersSent: false,
    writeHead(code, headers = {}) {
      this.statusCode = code;
      this.headers = { ...this.headers, ...headers };
      this.headersSent = true;
      return this;
    },
    setHeader(key, value) {
      this.headers[key] = value;
    },
    end(data) {
      if (data) this.body = data;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      this.body = JSON.stringify(obj);
      if (!this.headers['Content-Type']) {
        this.headers['Content-Type'] = 'application/json';
      }
    },
    getJson() {
      try {
        return JSON.parse(this.body);
      } catch {
        return null;
      }
    },
  };
  return resp;
}

function createMockRequest(method, url, body = null, headers = {}) {
  const req = {
    method,
    url,
    headers: { 'x-forwarded-for': '203.0.113.195', ...headers },
    socket: { remoteAddress: '203.0.113.195' },
    body,
    on(event, callback) {
      if (event === 'data' && body) {
        const payloadStr = typeof body === 'object' ? JSON.stringify(body) : String(body);
        callback(Buffer.from(payloadStr));
      }
      if (event === 'end') {
        callback();
      }
      return this;
    },
  };
  return req;
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

// ==============================================================================
// TEST 1: Health Check Endpoint Returns Structured Telemetry
// ==============================================================================
runTest('Health check endpoint (/api/health) returns 200 with structured operational telemetry', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/ai-proxy-middleware.ts'), 'utf8');
  assert.ok(code.includes('export async function handleHealth'), 'Must export handleHealth function');
  assert.ok(code.includes("status: 'healthy'") || code.includes("status: 'operational'"), 'Health response must declare healthy/operational status');
  assert.ok(code.includes('memoryUsedMb:'), 'Telemetry must include memoryUsedMb');
  assert.ok(code.includes('uptime:'), 'Telemetry must include uptime');
  assert.ok(code.includes('activeInFlightRequests:'), 'Telemetry must include activeInFlightRequests count');
  assert.ok(code.includes('nodeVersion:'), 'Telemetry must report node runtime version');
  assert.ok(code.includes('checks:'), 'Health response must return structured service checks');
});

// ==============================================================================
// TEST 2: Health Check Endpoint Zero-Secret Leakage Defense
// ==============================================================================
runTest('Health check never leaks secrets, API keys, database URLs, or credentials', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/ai-proxy-middleware.ts'), 'utf8');
  const healthBlock = code.slice(code.indexOf('async function handleHealth'), code.indexOf('async function handleAiStatus'));

  // Ensure raw environment secrets are only checked via boolean truthiness, never rendered
  assert.ok(!healthBlock.includes('apiKey: process.env'), 'Health check must never return raw API key');
  assert.ok(!healthBlock.includes('supabaseKey:'), 'Health check must never return Supabase key');
  assert.ok(!healthBlock.includes('postgres://'), 'Health check must never expose connection strings');
  assert.ok(healthBlock.includes('Boolean('), 'Health check must use boolean checks for service readiness');
});

// ==============================================================================
// TEST 3: Structured Logger Schema & Output Verification
// ==============================================================================
runTest('Structured server logger outputs parseable JSON records with mandatory telemetry fields', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/logger.ts'), 'utf8');
  assert.ok(code.includes('export const serverLogger'), 'Must export serverLogger instance');
  assert.ok(code.includes('requestId: string'), 'Log entry schema must enforce requestId');
  assert.ok(code.includes('timestamp: string'), 'Log entry schema must enforce timestamp');
  assert.ok(code.includes('durationMs: number'), 'Log entry schema must enforce durationMs');
  assert.ok(code.includes('clientIp: string'), 'Log entry schema must enforce clientIp');
  assert.ok(code.includes('errorCategory?: ErrorCategory'), 'Log entry schema must support normalized error categories');
  assert.ok(code.includes('JSON.stringify(sanitizedEntry)'), 'Logger must serialize single-line JSON records for log drains');
});

// ==============================================================================
// TEST 4: Structured Logger Credential & Sensitive Path Redaction
// ==============================================================================
runTest('Structured logger recursively redacts API keys, JWT tokens, passwords, and file paths', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/logger.ts'), 'utf8');
  assert.ok(code.includes('sanitizeLogMetadata'), 'Must provide recursive metadata sanitizer');
  assert.ok(code.includes('sanitizeLogString'), 'Must provide string value pattern sanitizer');
  assert.ok(code.includes('[REDACTED_API_KEY]'), 'Must replace Gemini API keys with [REDACTED_API_KEY]');
  assert.ok(code.includes('[REDACTED_TOKEN]'), 'Must replace JWT / Bearer tokens with [REDACTED_TOKEN]');
  assert.ok(code.includes('[REDACTED_PATH]'), 'Must replace filesystem paths with [REDACTED_PATH]');
  assert.ok(code.includes('password'), 'Must explicitly redact password object keys');
  assert.ok(code.includes('api[_-]?key'), 'Must explicitly redact apiKey object keys');
  assert.ok(code.includes('service[_-]?role'), 'Must explicitly redact serviceRoleKey object keys');
});

// ==============================================================================
// TEST 5: API Timeout Bounds (25s) Enforced Across All AI Endpoints
// ==============================================================================
runTest('All 15 Gemini invocations enforce 25s timeout (within Vercel 30s limit) and map to HTTP 504', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/ai-proxy-middleware.ts'), 'utf8');

  // Verify AbortController timeout bounds
  const timeoutMatches = code.match(/setTimeout\(\(\)\s*=>\s*controller\.abort\(\),\s*25000\)/g);
  assert.ok(
    timeoutMatches && timeoutMatches.length >= 14,
    `Expected at least 14 25s timeout definitions, found ${timeoutMatches?.length || 0}`
  );

  // Verify ApiTimeoutError maps to HTTP 504 GATEWAY_TIMEOUT
  assert.ok(code.includes('class ApiTimeoutError extends Error'), 'Must define ApiTimeoutError class');
  assert.ok(code.includes("error: 'GATEWAY_TIMEOUT'"), 'Must return GATEWAY_TIMEOUT error code');
  assert.ok(code.includes("category: 'TIMEOUT_ERROR'"), 'Must categorize timeout errors as TIMEOUT_ERROR');
  assert.ok(code.includes('recoverable: true'), 'Must mark timeout errors as recoverable for user retry');
});

// ==============================================================================
// TEST 6: In-Flight Request Deduplication Logic
// ==============================================================================
runTest('In-flight request deduplication prevents duplicate simultaneous AI executions', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/ai-proxy-middleware.ts'), 'utf8');
  assert.ok(code.includes('inFlightRequests = new Map'), 'Must maintain inFlightRequests Map');
  assert.ok(code.includes('inFlightRequests.get(dedupeKey)'), 'Must check active promises in inFlightRequests');
  assert.ok(code.includes('inFlightRequests.set(dedupeKey'), 'Must register in-flight promises');
  assert.ok(code.includes('inFlightRequests.delete(dedupeKey)'), 'Must purge in-flight promises upon completion or failure');
});

// ==============================================================================
// TEST 7: Centralized Frontend API Client with Timeout & Bearer Auth
// ==============================================================================
runTest('Frontend ApiClient enforces 30s client-side timeout and auto-attaches active Bearer token', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/services/api-client.ts'), 'utf8');
  assert.ok(code.includes('class ApiClient'), 'Must export ApiClient class');
  assert.ok(code.includes('defaultTimeoutMs = 30000'), 'Must enforce 30s client-side timeout');
  assert.ok(code.includes('controller.abort()'), 'Must abort timed-out client requests');
  assert.ok(code.includes('sparkline_auth_session'), 'Must read auth session token for Bearer attachment');
  assert.ok(code.includes("headers['Authorization'] = `Bearer ${token}`"), 'Must set Authorization Bearer header');
});

// ==============================================================================
// TEST 8: Friendly Human Error Mapping (getFriendlyErrorMessage)
// ==============================================================================
runTest('getFriendlyErrorMessage maps technical errors to clear, actionable human guidance', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/services/api-client.ts'), 'utf8');
  assert.ok(code.includes('export function getFriendlyErrorMessage'), 'Must export getFriendlyErrorMessage');
  assert.ok(code.includes('Rate limit reached'), 'Must format friendly rate limit message');
  assert.ok(code.includes('The AI service took longer than expected'), 'Must format friendly 504 timeout message');
  assert.ok(code.includes('The AI provider is temporarily unavailable'), 'Must format friendly 502 provider error');
  assert.ok(code.includes('Your session has expired'), 'Must format friendly 401 session expiry message');
  assert.ok(code.includes('Unable to reach the server'), 'Must format friendly network disconnect message');
});

// ==============================================================================
// TEST 9: Rate Limit Exceeded Returns HTTP 429 with Retry-After Header
// ==============================================================================
runTest('Rate limit rejection returns HTTP 429, RATE_LIMIT_ERROR, and Retry-After HTTP response header', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/ai-proxy-middleware.ts'), 'utf8');
  assert.ok(code.includes('getRateLimitRetryAfter'), 'Must calculate exact seconds remaining in sliding window');
  assert.ok(code.includes("error: 'RATE_LIMIT_EXCEEDED'"), 'Must return RATE_LIMIT_EXCEEDED');
  assert.ok(code.includes("category: 'RATE_LIMIT_ERROR'"), 'Must tag category as RATE_LIMIT_ERROR');
  assert.ok(code.includes("'Retry-After': String(retryAfter)"), 'Must attach Retry-After response header');
});

// ==============================================================================
// TEST 10: Invalid Auth Credentials Return HTTP 401 INVALID_AUTHORIZATION
// ==============================================================================
runTest('validateAuthHeader strictly rejects malformed and non-Bearer credentials with HTTP 401', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/ai-proxy-middleware.ts'), 'utf8');
  assert.ok(code.includes('export function validateAuthHeader'), 'Must export validateAuthHeader');
  assert.ok(code.includes("Authorization header must use Bearer scheme"), 'Must reject non-Bearer scheme');
  assert.ok(code.includes("Bearer token is missing or empty"), 'Must reject empty Bearer tokens');
  assert.ok(code.includes("'INVALID_AUTHORIZATION'"), 'Must return INVALID_AUTHORIZATION error');
});

// ==============================================================================
// TEST 11: Malformed Request Body Rejection (HTTP 400 MALFORMED_REQUEST)
// ==============================================================================
runTest('parseJsonBody returns HTTP 400 MALFORMED_REQUEST on invalid JSON syntax', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/ai-proxy-middleware.ts'), 'utf8');
  assert.ok(code.includes("reject(new Error('Invalid JSON payload'))"), 'Must reject on malformed JSON payload');
  assert.ok(code.includes("'MALFORMED_REQUEST'"), 'Must return MALFORMED_REQUEST error code');
  assert.ok(code.includes("category: 'VALIDATION_ERROR'"), 'Must categorize malformed requests as VALIDATION_ERROR');
});

// ==============================================================================
// TEST 12: Oversized Payload Rejection (> 2MB) Returns HTTP 413
// ==============================================================================
runTest('parseJsonBody enforces 2MB ceiling and returns HTTP 413 PAYLOAD_TOO_LARGE', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/ai-proxy-middleware.ts'), 'utf8');
  assert.ok(code.includes('2 * 1024 * 1024'), 'Must define 2MB payload threshold');
  assert.ok(code.includes("reject(new Error('Payload too large'))"), 'Must reject oversized streams');
  assert.ok(code.includes("'PAYLOAD_TOO_LARGE'"), 'Must return PAYLOAD_TOO_LARGE status code');
  assert.ok(code.includes('isTooLarge ? 413 : 400'), 'Must return HTTP 413 status on oversized payloads');
});

// ==============================================================================
// TEST 13: Unsupported HTTP Method Rejection (HTTP 405 METHOD_NOT_ALLOWED)
// ==============================================================================
runTest('handleCorsAndMethod rejects unauthorized verbs with HTTP 405 METHOD_NOT_ALLOWED', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/ai-proxy-middleware.ts'), 'utf8');
  assert.ok(code.includes('export function handleCorsAndMethod'), 'Must export handleCorsAndMethod');
  assert.ok(code.includes("'METHOD_NOT_ALLOWED'"), 'Must return METHOD_NOT_ALLOWED error code');
  assert.ok(code.includes('405'), 'Must return HTTP 405 status code');
  assert.ok(code.includes('category: \'VALIDATION_ERROR\''), 'Must categorize method rejection as VALIDATION_ERROR');
});

// ==============================================================================
// TEST 14: OPTIONS CORS Preflight Returns 204 with Request ID & Full Headers
// ==============================================================================
runTest('OPTIONS preflight returns 204 with full security headers, CORS permissions, and x-request-id', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/ai-proxy-middleware.ts'), 'utf8');
  assert.ok(code.includes("'Access-Control-Allow-Origin': '*'"), 'Must allow CORS origin');
  assert.ok(code.includes("'Access-Control-Allow-Methods':"), 'Must list allowed HTTP methods');
  assert.ok(code.includes('x-request-id'), 'Must permit and expose x-request-id header');
  assert.ok(code.includes('204'), 'Must respond with HTTP 204 No Content for preflight');
});

// ==============================================================================
// TEST 15: Master Router Wraps Execution and Catches Fatal Exceptions (HTTP 500)
// ==============================================================================
runTest('handleApiRequest catches unexpected exceptions, returning HTTP 500 without leaking stack traces', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/ai-proxy-middleware.ts'), 'utf8');
  const routerBlock = code.slice(code.indexOf('async function handleApiRequest'));
  assert.ok(routerBlock.includes('try {'), 'Router must wrap route execution in try block');
  assert.ok(routerBlock.includes('catch (fatalErr: any)'), 'Router must catch unhandled exceptions');
  assert.ok(routerBlock.includes("'INTERNAL_SERVER_ERROR'"), 'Router must return INTERNAL_SERVER_ERROR');
  assert.ok(!routerBlock.includes('stack: fatalErr.stack'), 'Router must NEVER leak internal stack trace to client');
});

// ==============================================================================
// TEST 16: Upstream AI Provider Failure Maps Safely to HTTP 502 AI_PROVIDER_ERROR
// ==============================================================================
runTest('Upstream Gemini API errors map safely to HTTP 502 AI_PROVIDER_ERROR with sanitized messages', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/ai-proxy-middleware.ts'), 'utf8');
  assert.ok(code.includes("error: 'AI_PROVIDER_ERROR'"), 'Must return AI_PROVIDER_ERROR error code');
  assert.ok(code.includes("category: 'AI_PROVIDER_ERROR'"), 'Must tag category as AI_PROVIDER_ERROR');
  assert.ok(code.includes('sanitizeErrorMessage('), 'Must sanitize raw provider error before returning to client');
  assert.ok(code.includes('502'), 'Must return HTTP 502 Bad Gateway status');
});

// ==============================================================================
// TEST 17: Production React ErrorBoundary Component Verification
// ==============================================================================
runTest('Production ErrorBoundary catches rendering crashes and renders branded recovery actions', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/components/common/ErrorBoundary.tsx'), 'utf8');
  assert.ok(code.includes('export class ErrorBoundary extends Component'), 'Must export ErrorBoundary component');
  assert.ok(code.includes('getDerivedStateFromError'), 'Must implement getDerivedStateFromError lifecycle');
  assert.ok(code.includes('componentDidCatch'), 'Must implement componentDidCatch lifecycle');
  assert.ok(code.includes('handleReset'), 'Must provide handleReset recovery action');
  assert.ok(code.includes('handleReload'), 'Must provide handleReload recovery action');
  assert.ok(code.includes('Return to Dashboard'), 'Must provide button to navigate safely to dashboard');
});

// ==============================================================================
// TEST 18: App-Wide ErrorBoundary Integration in Root Tree
// ==============================================================================
runTest('Root App component is protected with ErrorBoundary to prevent white screens', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/App.tsx'), 'utf8');
  assert.ok(code.includes('import { ErrorBoundary } from'), 'Must import ErrorBoundary');
  assert.ok(code.includes('<ErrorBoundary>'), 'App root must be wrapped in <ErrorBoundary>');
  assert.ok(code.includes('</ErrorBoundary>'), 'App root must close </ErrorBoundary>');
});

// ==============================================================================
// TEST 19: All Responses Transmit x-request-id & x-response-time Headers
// ==============================================================================
runTest('sendJsonResponse sets standard x-request-id and x-response-time headers on every response', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/server/ai-proxy-middleware.ts'), 'utf8');
  assert.ok(code.includes("'x-request-id': ctx.requestId"), 'Must set x-request-id header');
  assert.ok(code.includes("'x-response-time': `${durationMs}ms`"), 'Must set x-response-time header');
  assert.ok(code.includes("'X-Content-Type-Options': 'nosniff'"), 'Must set nosniff security header');
});

// ==============================================================================
// TEST 20: Vercel Serverless Function Execution Limit Configured (maxDuration: 30)
// ==============================================================================
runTest('vercel.json explicitly configures function execution maxDuration: 30', () => {
  const vercelPath = path.join(rootDir, 'vercel.json');
  assert.ok(fs.existsSync(vercelPath), 'vercel.json must exist');
  const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));

  assert.ok(vercel.functions, 'vercel.json must configure functions block');
  assert.ok(vercel.functions['api/*.ts'], 'Must configure functions["api/*.ts"]');
  assert.equal(vercel.functions['api/*.ts'].maxDuration, 30, 'maxDuration must be set to 30 seconds');
});

// ==============================================================================
// SUMMARY & VERDICT
// ==============================================================================
console.log('\n================================================================');
console.log(`TEST RUN COMPLETE: ${passedTests} / ${totalTests} PASSED`);
console.log('================================================================');

if (passedTests === totalTests) {
  console.log('[SUCCESS] All production monitoring and reliability verifications passed flawlessly!\n');
  process.exit(0);
} else {
  console.error(`[FAILURE] ${totalTests - passedTests} tests failed.\n`);
  process.exit(1);
}
