/**
 * Sparkline Marketing Intelligence Platform
 * Supabase Relational Database & Authentication Client Service
 *
 * Implements high-performance, typed PostgREST and Auth operations
 * with dual-mode cloud database integration and offline Local Vault fallback.
 */

import { UserProfile } from '@/types/auth';
import { MarketingProject } from '@/types/project';
import { MarketingReport } from '@/types/report';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export interface PostgrestResponse<T> {
  data: T | null;
  error: {
    message: string;
    code?: string;
    status?: number;
  } | null;
  count?: number | null;
}

export interface UserPreferencesRecord {
  id?: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  notifications_email: boolean;
  notifications_marketing: boolean;
  compact_tables: boolean;
  created_at?: string;
  updated_at?: string;
}

class SupabaseService {
  private config: SupabaseConfig;

  constructor() {
    this.config = this.resolveConfig();
  }

  /**
   * Resolves configuration across browser and serverless runtimes
   */
  private resolveConfig(): SupabaseConfig {
    let url = '';
    let anonKey = '';

    // 1. Browser runtime (Vite import.meta.env)
    try {
      if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        url = ((import.meta as any).env.VITE_SUPABASE_URL || '').trim();
        anonKey = ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || '').trim();
      }
    } catch {
      // Ignore
    }

    // 2. Server runtime fallback (Node.js / Vercel process.env)
    try {
      if (typeof process !== 'undefined' && process.env) {
        if (!url) url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
        if (!anonKey) anonKey = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();
      }
    } catch {
      // Ignore
    }

    const isConfigured =
      Boolean(url) &&
      Boolean(anonKey) &&
      !url.includes('your-project-id') &&
      !anonKey.includes('your-anon-key-placeholder');

    return {
      url: url.replace(/\/+$/, ''), // strip trailing slash
      anonKey,
      isConfigured,
    };
  }

  /**
   * Returns true if valid production Supabase credentials are configured
   */
  isConfigured(): boolean {
    return this.config.isConfigured;
  }

  /**
   * Returns current endpoint URL (sanitized)
   */
  getUrl(): string {
    return this.config.url;
  }

  /**
   * Returns public anon key
   */
  getAnonKey(): string {
    return this.config.anonKey;
  }

  /**
   * Safely formats and sanitizes database errors to prevent internal Postgres leakage
   */
  private sanitizeError(err: any, fallbackMessage: string): { message: string; code?: string; status?: number } {
    if (!err) return { message: fallbackMessage };

    // Standard sanitized error codes
    const status = err.status || 500;
    let message = fallbackMessage;

    if (status === 401 || status === 403) {
      message = 'Authorization failed: You do not have permission to access or modify this record.';
    } else if (status === 404) {
      message = 'The requested resource was not found.';
    } else if (status === 409) {
      message = 'A conflicting record already exists.';
    } else if (typeof err.message === 'string' && !err.message.includes('password') && !err.message.includes('secret')) {
      // Clean generic error message
      message = err.message.replace(/relation "[^"]+" does not exist/gi, 'Database schema not initialized.');
    }

    return {
      message,
      code: err.code || 'DATABASE_ERROR',
      status,
    };
  }

  // ============================================================================
  // POSTGREST REST CORE CLIENT
  // ============================================================================

  /**
   * Execute authenticated or public PostgREST request
   */
  async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      headers?: Record<string, string>;
      body?: any;
      authToken?: string;
    } = {}
  ): Promise<PostgrestResponse<T>> {
    if (!this.config.isConfigured) {
      return {
        data: null,
        error: { message: 'Supabase is running in Local Vault mode (unconfigured cloud endpoint).' },
      };
    }

    const method = options.method || 'GET';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      apikey: this.config.anonKey,
      ...options.headers,
    };

    if (options.authToken) {
      headers['Authorization'] = `Bearer ${options.authToken}`;
    }

    try {
      const response = await fetch(`${this.config.url}${endpoint}`, {
        method,
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({ message: response.statusText }));
        return {
          data: null,
          error: this.sanitizeError({ ...errorJson, status: response.status }, 'Database query failed.'),
        };
      }

      if (response.status === 204) {
        return { data: null, error: null };
      }

      const data = await response.json().catch(() => null);
      return { data, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: this.sanitizeError(err, 'Network connection to Supabase database failed.'),
      };
    }
  }

  // ============================================================================
  // DOMAIN ENTITY SYNCHRONIZATION HELPERS
  // ============================================================================

  // --- 1. USER PROFILES & PREFERENCES ---

  async getProfile(userId: string, authToken?: string): Promise<UserProfile | null> {
    if (!this.config.isConfigured || !userId) return null;
    const res = await this.request<UserProfile[]>(`/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=*`, {
      method: 'GET',
      authToken,
    });
    if (res.data && res.data.length > 0) {
      const row: any = res.data[0];
      return {
        id: row.id,
        email: row.email,
        fullName: row.full_name || '',
        avatarUrl: row.avatar_url || '',
        companyName: row.company_name || '',
        jobTitle: row.job_title || '',
        country: row.country || 'United States',
        preferredLanguage: row.preferred_language || 'English',
        preferredCurrency: row.preferred_currency || 'USD',
        timeZone: row.time_zone || 'America/New_York (EST)',
        emailVerified: true,
        provider: 'supabase',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    }
    return null;
  }

  async saveProfile(profile: Partial<UserProfile> & { id: string }, authToken?: string): Promise<boolean> {
    if (!this.config.isConfigured || !profile.id) return false;
    const payload = {
      id: profile.id,
      email: profile.email,
      full_name: profile.fullName,
      avatar_url: profile.avatarUrl || '',
      company_name: profile.companyName || '',
      job_title: profile.jobTitle || '',
      country: profile.country || 'United States',
      preferred_language: profile.preferredLanguage || 'English',
      preferred_currency: profile.preferredCurrency || 'USD',
      time_zone: profile.timeZone || 'America/New_York (EST)',
      updated_at: new Date().toISOString(),
    };

    const res = await this.request('/rest/v1/profiles', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: payload,
      authToken,
    });
    return !res.error;
  }

  async getPreferences(userId: string, authToken?: string): Promise<UserPreferencesRecord | null> {
    if (!this.config.isConfigured || !userId) return null;
    const res = await this.request<UserPreferencesRecord[]>(
      `/rest/v1/user_preferences?user_id=eq.${encodeURIComponent(userId)}&select=*`,
      { method: 'GET', authToken }
    );
    return res.data && res.data.length > 0 && res.data[0] ? res.data[0] : null;
  }

  async savePreferences(preferences: Partial<UserPreferencesRecord> & { user_id: string }, authToken?: string): Promise<boolean> {
    if (!this.config.isConfigured || !preferences.user_id) return false;
    const res = await this.request('/rest/v1/user_preferences', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: {
        ...preferences,
        updated_at: new Date().toISOString(),
      },
      authToken,
    });
    return !res.error;
  }

  // --- 2. MARKETING PROJECTS ---

  async getProjects(userId: string, authToken?: string): Promise<MarketingProject[]> {
    if (!this.config.isConfigured || !userId) return [];
    const res = await this.request<any[]>(
      `/rest/v1/marketing_projects?user_id=eq.${encodeURIComponent(userId)}&select=*&order=updated_at.desc`,
      { method: 'GET', authToken }
    );
    if (!res.data) return [];
    return res.data.map((row) => ({
      id: row.id,
      userId: row.user_id,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      ...row.project_data,
      business: {
        ...(row.project_data?.business || {}),
        brandName: row.brand_name || row.project_data?.business?.brandName || 'Untitled Project',
        industry: row.industry || row.project_data?.business?.industry || 'General',
      },
    }));
  }

  async getProjectById(projectId: string, authToken?: string): Promise<MarketingProject | null> {
    if (!this.config.isConfigured || !projectId) return null;
    const res = await this.request<any[]>(
      `/rest/v1/marketing_projects?id=eq.${encodeURIComponent(projectId)}&select=*`,
      { method: 'GET', authToken }
    );
    if (!res.data || res.data.length === 0) return null;
    const row = res.data[0];
    return {
      id: row.id,
      userId: row.user_id,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      ...row.project_data,
      business: {
        ...(row.project_data?.business || {}),
        brandName: row.brand_name,
        industry: row.industry,
      },
    };
  }

  async saveProject(project: MarketingProject, userId: string, authToken?: string): Promise<boolean> {
    if (!this.config.isConfigured || !project.id || !userId) return false;
    const payload = {
      id: project.id,
      user_id: userId,
      brand_name: project.business?.brandName || 'Untitled Project',
      industry: project.business?.industry || 'General',
      status: project.status || 'Draft',
      project_data: project,
      updated_at: new Date().toISOString(),
    };

    const res = await this.request('/rest/v1/marketing_projects', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: payload,
      authToken,
    });
    return !res.error;
  }

  async deleteProject(projectId: string, userId: string, authToken?: string): Promise<boolean> {
    if (!this.config.isConfigured || !projectId || !userId) return false;
    const res = await this.request(
      `/rest/v1/marketing_projects?id=eq.${encodeURIComponent(projectId)}&user_id=eq.${encodeURIComponent(userId)}`,
      { method: 'DELETE', authToken }
    );
    return !res.error;
  }

  // --- 3. EXECUTIVE MARKETING REPORTS ---

  async getReports(userId: string, authToken?: string): Promise<MarketingReport[]> {
    if (!this.config.isConfigured || !userId) return [];
    const res = await this.request<any[]>(
      `/rest/v1/reports?select=*&order=updated_at.desc`,
      { method: 'GET', authToken }
    );
    if (!res.data) return [];
    return res.data
      .filter((r) => !r.user_id || r.user_id === userId)
      .map((row) => ({
        id: row.id,
        userId: row.user_id || userId,
        projectId: row.project_id,
        projectName: row.configuration?.branding?.brandName || 'Project Report',
        templateId: row.configuration?.templateId || 'executive_summary',
        templateName: row.template_name || 'Executive Summary',
        title: row.configuration?.title || 'Marketing Intelligence Report',
        subtitle: row.configuration?.subtitle || '',
        status: row.status || 'Ready',
        version: row.version || 1,
        configuration: row.configuration,
        sections: row.sections || [],
        executiveSummary: row.configuration?.executiveSummary || '',
        pageCountEstimate: (row.sections || []).length * 2,
        isArchived: row.status === 'Archived',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        downloadCount: 0,
      }));
  }

  async saveReport(report: MarketingReport, userId: string, authToken?: string): Promise<boolean> {
    if (!this.config.isConfigured || !report.id || !report.projectId) return false;
    const payload = {
      id: report.id,
      project_id: report.projectId,
      user_id: userId,
      template_name: report.templateName || 'Executive Summary',
      version: report.version || 1,
      status: report.status || 'Ready',
      configuration: report.configuration || {},
      sections: report.sections || [],
      data_provenance: report.sections?.flatMap((s) => s.sources || []) || [],
      updated_at: new Date().toISOString(),
    };

    const res = await this.request('/rest/v1/reports', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: payload,
      authToken,
    });
    return !res.error;
  }

  async deleteReport(reportId: string, userId: string, authToken?: string): Promise<boolean> {
    if (!this.config.isConfigured || !reportId) return false;
    const query = userId
      ? `/rest/v1/reports?id=eq.${encodeURIComponent(reportId)}&user_id=eq.${encodeURIComponent(userId)}`
      : `/rest/v1/reports?id=eq.${encodeURIComponent(reportId)}`;
    const res = await this.request(query, { method: 'DELETE', authToken });
    return !res.error;
  }
}

export const supabaseService = new SupabaseService();
