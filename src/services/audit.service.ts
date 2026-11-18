/**
 * Sparkline Marketing — Security & Operational Audit Logging Service
 * Phase 22: Database Architecture, Permissions & Advanced Security
 */

export type AuditAction =
  | 'auth.login_success'
  | 'auth.login_failure'
  | 'auth.logout'
  | 'auth.signup_success'
  | 'auth.password_changed'
  | 'auth.password_reset_requested'
  | 'auth.password_reset_completed'
  | 'project.created'
  | 'project.updated'
  | 'project.duplicated'
  | 'project.archived'
  | 'project.restored'
  | 'project.deleted'
  | 'report.generated'
  | 'report.exported'
  | 'report.deleted'
  | 'integration.connected'
  | 'integration.disconnected'
  | 'data.export_requested'
  | 'account.deletion_requested'
  | 'security.access_denied'
  | 'security.rate_limit_exceeded';

export type AuditResourceType =
  | 'session'
  | 'profile'
  | 'marketing_project'
  | 'report'
  | 'integration'
  | 'campaign'
  | 'security_event';

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: string;
  outcome: 'success' | 'failure' | 'denied';
  timestamp: string;
  metadata: Record<string, unknown>;
}

const STORAGE_AUDIT_LOGS_KEY = 'sparkline_audit_logs';
const MAX_LOCAL_LOGS = 500;

class AuditService {
  /**
   * Record a security or operational event to the audit ledger
   */
  log(
    action: AuditAction,
    resourceType: AuditResourceType,
    options: {
      userId?: string | null;
      resourceId?: string;
      details?: string;
      outcome?: 'success' | 'failure' | 'denied';
      metadata?: Record<string, unknown>;
    } = {}
  ): AuditLogEntry {
    // Sanitize metadata: strictly purge sensitive fields (passwords, tokens, keys)
    const sanitizedMetadata: Record<string, unknown> = {};
    if (options.details) {
      sanitizedMetadata.details = options.details;
    }
    if (options.metadata) {
      for (const [key, value] of Object.entries(options.metadata)) {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes('password') ||
          lowerKey.includes('token') ||
          lowerKey.includes('secret') ||
          lowerKey.includes('key') ||
          lowerKey.includes('hash') ||
          lowerKey.includes('credential')
        ) {
          sanitizedMetadata[key] = '[REDACTED]';
        } else {
          sanitizedMetadata[key] = value;
        }
      }
    }

    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: options.userId !== undefined ? options.userId : null,
      action,
      resourceType,
      resourceId: options.resourceId,
      outcome: options.outcome || 'success',
      timestamp: new Date().toISOString(),
      metadata: sanitizedMetadata,
    };

    try {
      const logs = this.getAllLogs();
      logs.unshift(entry); // newest first

      // Maintain storage bounded limit
      if (logs.length > MAX_LOCAL_LOGS) {
        logs.length = MAX_LOCAL_LOGS;
      }

      localStorage.setItem(STORAGE_AUDIT_LOGS_KEY, JSON.stringify(logs));
    } catch (e) {
      console.warn('Failed to persist audit log entry:', e);
    }

    return entry;
  }

  /**
   * Retrieve all audit logs from storage
   */
  getAllLogs(): AuditLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_AUDIT_LOGS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to parse audit logs:', e);
    }
    return [];
  }

  /**
   * Retrieve logs filtered by user, action, or date
   */
  getLogs(filter: {
    userId?: string;
    action?: AuditAction;
    resourceType?: AuditResourceType;
    limit?: number;
  }): AuditLogEntry[] {
    let logs = this.getAllLogs();

    if (filter.userId) {
      logs = logs.filter((l) => l.userId === filter.userId);
    }
    if (filter.action) {
      logs = logs.filter((l) => l.action === filter.action);
    }
    if (filter.resourceType) {
      logs = logs.filter((l) => l.resourceType === filter.resourceType);
    }
    if (filter.limit && filter.limit > 0) {
      logs = logs.slice(0, filter.limit);
    }

    return logs;
  }

  /**
   * Export audit trail as formatted JSON
   */
  exportLogsJson(userId?: string): string {
    const logs = userId ? this.getLogs({ userId }) : this.getAllLogs();
    return JSON.stringify(logs, null, 2);
  }
}

export const auditService = new AuditService();

