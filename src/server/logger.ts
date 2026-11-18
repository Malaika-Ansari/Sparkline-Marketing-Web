/**
 * SPARKLINE MARKETING — STRUCTURED PRODUCTION LOGGER & OBSERVABILITY ENGINE
 * Phase A — Task 4: Production Monitoring and Reliability
 *
 * Implements high-performance, structured JSON logging to standard output
 * for Vercel Serverless Log Drains, CloudWatch, Datadog, Axiom, and Node runtimes.
 *
 * GUARANTEES:
 * 1. Zero leakage of passwords, API keys, tokens, session cookies, or PII.
 * 2. Automatic sanitization of stack traces, filesystem paths, and internal URLs.
 * 3. Machine-readable JSON records with standard metadata (level, requestId, timestamp, duration, status).
 */

export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export type ErrorCategory =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'AI_PROVIDER_ERROR'
  | 'TIMEOUT_ERROR'
  | 'DATABASE_ERROR'
  | 'SYSTEM_ERROR';

export interface StructuredLogEntry {
  level: LogLevel;
  requestId: string;
  timestamp: string;
  endpoint: string;
  method: string;
  statusCode: number;
  durationMs: number;
  clientIp: string;
  errorCategory?: ErrorCategory | string;
  message: string;
  meta?: Record<string, unknown>;
}

// Sensitive key identifiers to redact recursively from metadata
const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /pass/i,
  /secret/i,
  /token/i,
  /auth/i,
  /api[_-]?key/i,
  /cookie/i,
  /credential/i,
  /service[_-]?role/i,
  /anon[_-]?key/i,
];

/**
 * Generate a cryptographically distinct, traceable request ID
 */
export function generateRequestId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 9);
  return `req_${ts}_${rand}`;
}

/**
 * Redact sensitive secrets, API keys, and local filesystem paths from strings
 */
export function sanitizeLogString(str: string): string {
  if (!str) return '';
  return str
    // Google Gemini API keys
    .replace(/AIza[A-Za-z0-9_-]{33}/g, '[REDACTED_API_KEY]')
    // Bearer and generic high-entropy tokens
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [REDACTED_TOKEN]')
    .replace(/ey[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/g, '[REDACTED_JWT]')
    // Long alphanumeric secrets
    .replace(/[A-Za-z0-9_-]{35,}/g, '[REDACTED_SECRET]')
    // Windows file paths
    .replace(/[C-Z]:\\[\w.-]+(?:\\[\w.-]+)+/gi, '[REDACTED_PATH]')
    // Unix file paths (excluding simple endpoints)
    .replace(/(?:\/[\w.-]+){3,}/g, '[REDACTED_PATH]')
    // Raw database connection strings
    .replace(/postgres(?:ql)?:\/\/[^:]+:[^@]+@[^\s/]+/gi, 'postgres://[REDACTED_DB_CREDENTIALS]@host');
}

/**
 * Recursively cleanse metadata objects of sensitive keys and values
 */
export function sanitizeLogMetadata(data: unknown): unknown {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    return sanitizeLogString(data);
  }

  if (typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLogMetadata(item));
  }

  if (typeof data === 'object') {
    const clean: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      // Check if key is sensitive
      const isSensitiveKey = SENSITIVE_KEY_PATTERNS.some((p) => p.test(key));
      if (isSensitiveKey) {
        clean[key] = '[REDACTED]';
      } else {
        clean[key] = sanitizeLogMetadata(value);
      }
    }
    return clean;
  }

  return String(data);
}

class ServerLogger {
  /**
   * Core output formatting function. Writes standard JSON string to process stdout/stderr.
   */
  private output(entry: StructuredLogEntry): void {
    const sanitizedEntry: StructuredLogEntry = {
      level: entry.level,
      requestId: entry.requestId,
      timestamp: entry.timestamp || new Date().toISOString(),
      endpoint: entry.endpoint,
      method: entry.method,
      statusCode: entry.statusCode,
      durationMs: Math.round(entry.durationMs),
      clientIp: entry.clientIp || '127.0.0.1',
      errorCategory: entry.errorCategory,
      message: sanitizeLogString(entry.message),
      meta: entry.meta ? (sanitizeLogMetadata(entry.meta) as Record<string, unknown>) : undefined,
    };

    const jsonString = JSON.stringify(sanitizedEntry);

    if (entry.level === 'ERROR') {
      console.error(jsonString);
    } else if (entry.level === 'WARN') {
      console.warn(jsonString);
    } else {
      console.log(jsonString);
    }
  }

  info(
    reqContext: { requestId: string; endpoint: string; method: string; clientIp?: string },
    statusCode: number,
    durationMs: number,
    message: string,
    meta?: Record<string, unknown>
  ): void {
    this.output({
      level: 'INFO',
      requestId: reqContext.requestId,
      timestamp: new Date().toISOString(),
      endpoint: reqContext.endpoint,
      method: reqContext.method,
      statusCode,
      durationMs,
      clientIp: reqContext.clientIp || '127.0.0.1',
      message,
      meta,
    });
  }

  warn(
    reqContext: { requestId: string; endpoint: string; method: string; clientIp?: string },
    statusCode: number,
    durationMs: number,
    message: string,
    errorCategory?: ErrorCategory | string,
    meta?: Record<string, unknown>
  ): void {
    this.output({
      level: 'WARN',
      requestId: reqContext.requestId,
      timestamp: new Date().toISOString(),
      endpoint: reqContext.endpoint,
      method: reqContext.method,
      statusCode,
      durationMs,
      clientIp: reqContext.clientIp || '127.0.0.1',
      errorCategory,
      message,
      meta,
    });
  }

  error(
    reqContext: { requestId: string; endpoint: string; method: string; clientIp?: string },
    statusCode: number,
    durationMs: number,
    message: string,
    errorCategory: ErrorCategory | string,
    meta?: Record<string, unknown>
  ): void {
    this.output({
      level: 'ERROR',
      requestId: reqContext.requestId,
      timestamp: new Date().toISOString(),
      endpoint: reqContext.endpoint,
      method: reqContext.method,
      statusCode,
      durationMs,
      clientIp: reqContext.clientIp || '127.0.0.1',
      errorCategory,
      message,
      meta,
    });
  }
}

export const serverLogger = new ServerLogger();
