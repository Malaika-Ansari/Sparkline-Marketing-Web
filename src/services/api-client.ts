/**
 * SPARKLINE MARKETING — PRODUCTION RESILIENT API CLIENT
 * Phase A — Task 4: Production Monitoring and Reliability
 *
 * Provides centralized HTTP client with:
 * 1. Automatic 30-second client timeout via AbortController (never leaves UI permanently stuck).
 * 2. Automatic Authorization Bearer token attachment from active user session.
 * 3. Standardized error normalization (ApiClientError) with friendly human messages.
 * 4. Request ID tracing across client and serverless functions.
 * 5. Safe handling of non-JSON and HTML error responses (502/504 gateway responses).
 * 6. Session expiry detection and recovery guidance.
 */

export interface ApiClientErrorDetails {
  message: string;
  code: string;
  statusCode: number;
  requestId?: string;
  category?: string;
  recoverable: boolean;
  retryAfter?: number;
}

export class ApiClientError extends Error {
  public code: string;
  public statusCode: number;
  public requestId?: string;
  public category?: string;
  public recoverable: boolean;
  public retryAfter?: number;

  constructor(details: ApiClientErrorDetails) {
    super(details.message);
    this.name = 'ApiClientError';
    this.code = details.code;
    this.statusCode = details.statusCode;
    this.requestId = details.requestId;
    this.category = details.category;
    this.recoverable = details.recoverable;
    this.retryAfter = details.retryAfter;
  }
}

/**
 * Maps raw server and network errors to friendly, actionable human messages
 */
export function getFriendlyErrorMessage(err: unknown): string {
  if (err instanceof ApiClientError) {
    if (err.statusCode === 429) {
      return `Rate limit reached. Please wait ${err.retryAfter || 30} seconds before making another request.`;
    }
    if (err.statusCode === 504 || err.code === 'GATEWAY_TIMEOUT') {
      return 'The AI service took longer than expected to respond. Please try again in a few moments.';
    }
    if (err.statusCode === 502) {
      return 'The AI provider is temporarily unavailable or returned an unparseable response. Please retry.';
    }
    if (err.statusCode === 401) {
      return 'Your session has expired or authentication failed. Please sign in again.';
    }
    if (err.code === 'API_KEY_NOT_CONFIGURED') {
      return 'AI services are currently offline because the server environment key is missing.';
    }
    return err.message;
  }

  if (err instanceof Error) {
    if (err.name === 'AbortError' || err.message.includes('timeout')) {
      return 'The request timed out. Please check your connection and try again.';
    }
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      return 'Unable to reach the server. Please check your internet connection and try again.';
    }
    return err.message;
  }

  return 'An unexpected error occurred. Your work has been preserved — please try again.';
}

export class ApiClient {
  private static defaultTimeoutMs = 30000; // 30 seconds

  /**
   * Retrieves the active auth token from local/session storage if available
   */
  private static getActiveToken(): string | null {
    try {
      const raw = localStorage.getItem('sparkline_auth_session') || sessionStorage.getItem('sparkline_auth_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.accessToken || null;
      }
    } catch {
      // Storage unavailable or invalid JSON
    }
    return null;
  }

  /**
   * Executes a robust, timed fetch with standardized error parsing
   */
  public static async fetch<T = any>(
    url: string,
    options: RequestInit = {},
    timeoutMs: number = this.defaultTimeoutMs
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Attach active Bearer token if not already explicitly provided
    const token = this.getActiveToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const requestId = response.headers.get('x-request-id') || undefined;

      // Read response content safely (handling HTML error pages gracefully)
      const rawText = await response.text();
      let data: any = null;
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        // Fallback when serverless proxy returns HTML 502/504 page
        data = {
          ok: false,
          error: response.status >= 500 ? 'GATEWAY_ERROR' : 'HTTP_ERROR',
          message: `Server returned non-JSON response (HTTP ${response.status}).`,
        };
      }

      if (!response.ok || data?.ok === false) {
        const retryAfterHeader = response.headers.get('Retry-After');
        const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : data?.retryAfter;

        throw new ApiClientError({
          message: data?.message || `Request failed with HTTP status ${response.status}`,
          code: data?.error || `HTTP_${response.status}`,
          statusCode: response.status,
          requestId: data?.requestId || requestId,
          category: data?.category,
          recoverable: data?.recoverable ?? (response.status >= 500 || response.status === 429),
          retryAfter,
        });
      }

      return data as T;
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err instanceof ApiClientError) {
        throw err;
      }

      const isAbort = err?.name === 'AbortError' || controller.signal.aborted;
      if (isAbort) {
        throw new ApiClientError({
          message: `Request timed out after ${Math.round(timeoutMs / 1000)} seconds.`,
          code: 'CLIENT_TIMEOUT',
          statusCode: 408,
          recoverable: true,
        });
      }

      throw new ApiClientError({
        message: err instanceof Error ? err.message : 'Network error connecting to API.',
        code: 'NETWORK_ERROR',
        statusCode: 0,
        recoverable: true,
      });
    }
  }

  /**
   * Convenience POST helper
   */
  public static async post<T = any>(
    url: string,
    body: Record<string, unknown>,
    options: RequestInit = {}
  ): Promise<T> {
    return this.fetch<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      },
      body: JSON.stringify(body),
    });
  }

  /**
   * Convenience GET helper
   */
  public static async get<T = any>(url: string, options: RequestInit = {}): Promise<T> {
    return this.fetch<T>(url, {
      ...options,
      method: 'GET',
    });
  }
}
