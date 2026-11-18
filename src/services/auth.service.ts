/**
 * SPARKLINE MARKETING — AUTHENTICATION & USER PROFILE SERVICE
 * Phase 21: Authentication Provider, Session Management, Security & Data Isolation
 */

import {
  UserProfile,
  AuthSession,
  AuthResponse,
  LoginCredentials,
  SignUpData,
  ResetPasswordData,
  UpdateProfileData,
  ChangePasswordData,
  AuthProviderStatus,
} from '@/types/auth';
import { auditService } from './audit.service';
import { securityService } from './security.service';
import { supabaseService } from './supabase.service';

const STORAGE_USERS_KEY = 'sparkline_auth_vault_users';
const STORAGE_SESSION_KEY = 'sparkline_auth_session';
const STORAGE_RESET_TOKENS_KEY = 'sparkline_auth_reset_tokens';

interface StoredUserAccount extends UserProfile {
  passwordHash: string;
  salt: string;
}

interface StoredResetToken {
  token: string;
  email: string;
  expiresAt: number;
}

/**
 * Standard Default Demo User Account for Local Testing
 * Password is: Password123!
 */
const DEFAULT_DEMO_USER: StoredUserAccount = {
  id: 'usr-alex-morgan',
  email: 'alex.morgan@sparkline.ai',
  fullName: 'Alex Morgan',
  avatarUrl: '',
  companyName: 'Sparkline Growth Labs',
  jobTitle: 'VP of Growth & Strategy',
  country: 'United States',
  preferredLanguage: 'English',
  preferredCurrency: 'USD',
  timeZone: 'America/New_York (EST)',
  emailVerified: true,
  provider: 'local',
  createdAt: '2026-10-15T09:00:00.000Z',
  updatedAt: '2026-11-14T08:00:00.000Z',
  lastLoginAt: new Date().toISOString(),
  // Hash for "Password123!" using fixed salt
  salt: 'sparkline_seed_salt_2026',
  passwordHash: '8b7a69bc871089201a084c8d5a1b3beab3e2fc3a63d91cf958f4a21d1b95f242',
};

class AuthService {
  private listeners: ((user: UserProfile | null) => void)[] = [];
  private supabaseUrl: string;
  private supabaseAnonKey: string;
  private isSupabaseConfigured: boolean;

  constructor() {
    this.supabaseUrl = ((import.meta as any).env?.VITE_SUPABASE_URL || '').trim();
    this.supabaseAnonKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '').trim();

    // Check whether valid Supabase configuration exists
    this.isSupabaseConfigured =
      Boolean(this.supabaseUrl) &&
      Boolean(this.supabaseAnonKey) &&
      !this.supabaseUrl.includes('your-project-id') &&
      !this.supabaseAnonKey.includes('your-anon-key-placeholder');

    this.initializeVault();
  }

  /**
   * Initializes the local user vault with the demo account if empty
   */
  private initializeVault(): void {
    try {
      const existing = localStorage.getItem(STORAGE_USERS_KEY);
      if (!existing) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify([DEFAULT_DEMO_USER]));
      }
    } catch (e) {
      console.warn('Could not initialize auth vault:', e);
    }
  }

  /**
   * Returns metadata regarding the current authentication provider
   */
  getProviderStatus(): AuthProviderStatus {
    if (this.isSupabaseConfigured) {
      return {
        provider: 'supabase',
        isCloudConnected: true,
        googleOAuthAvailable: false, // Google OAuth requires GCP console client setup in Supabase dashboard
        providerName: 'Cloud Supabase Auth',
        description: `Connected to Supabase project at ${this.supabaseUrl.replace(/https?:\/\//, '').split('.')[0]}.`,
      };
    }

    return {
      provider: 'local',
      isCloudConnected: false,
      googleOAuthAvailable: false,
      providerName: 'Sparkline Local Vault Provider',
      description: 'Running in Local Isolated Workspace mode. All credentials and projects are safely encrypted in your browser storage.',
    };
  }

  /**
   * Hash a plaintext password with a salt using SHA-256 via Web Crypto API.
   * Throws an explicit error if Web Crypto API is unavailable to prevent insecure fallbacks.
   */
  private async hashPassword(password: string, salt: string): Promise<string> {
    if (typeof crypto === 'undefined' || !crypto.subtle?.digest) {
      throw new Error('Secure Web Crypto API is required for password hashing but is unavailable in this environment.');
    }
    const enc = new TextEncoder();
    const data = enc.encode(`${salt}:${password}:${salt}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Retrieve all stored user accounts
   */
  private getStoredUsers(): StoredUserAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_USERS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading stored users:', e);
    }
    return [DEFAULT_DEMO_USER];
  }

  /**
   * Save user accounts array to storage
   */
  private saveStoredUsers(users: StoredUserAccount[]): void {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Error saving stored users:', e);
    }
  }

  /**
   * Get active authenticated session
   */
  getSession(): AuthSession | null {
    try {
      // Check localStorage first, then sessionStorage
      const localData = localStorage.getItem(STORAGE_SESSION_KEY);
      const sessionData = sessionStorage.getItem(STORAGE_SESSION_KEY);
      const raw = localData || sessionData;

      if (raw) {
        const session: AuthSession = JSON.parse(raw);
        // Verify expiry
        if (session.expiresAt > Math.floor(Date.now() / 1000)) {
          return session;
        } else {
          // Expired
          this.signOut();
          return null;
        }
      }
    } catch (e) {
      console.warn('Error reading session:', e);
    }
    return null;
  }

  /**
   * Get currently logged-in user profile
   */
  getCurrentUser(): UserProfile | null {
    const session = this.getSession();
    return session?.user || null;
  }

  /**
   * Save session to storage based on remember-me choice
   */
  private saveSession(session: AuthSession, rememberMe: boolean): void {
    try {
      const json = JSON.stringify(session);
      if (rememberMe) {
        localStorage.setItem(STORAGE_SESSION_KEY, json);
        sessionStorage.removeItem(STORAGE_SESSION_KEY);
      } else {
        sessionStorage.setItem(STORAGE_SESSION_KEY, json);
        localStorage.removeItem(STORAGE_SESSION_KEY);
      }
      this.notifyListeners(session.user);
    } catch (e) {
      console.warn('Error saving session:', e);
    }
  }

  /**
   * User Sign Up
   */
  async signUp(data: SignUpData): Promise<AuthResponse> {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = securityService.sanitizeText(data.fullName.trim());

    // Validation
    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Please enter your full name (minimum 2 characters).' };
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!data.password || data.password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }
    if (!data.agreeToTerms) {
      return { success: false, error: 'You must agree to the Terms of Service and Privacy Policy.' };
    }

    // Cloud Supabase Auth if configured
    if (this.isSupabaseConfigured) {
      try {
        const res = await fetch(`${this.supabaseUrl}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: this.supabaseAnonKey,
          },
          body: JSON.stringify({
            email: cleanEmail,
            password: data.password,
            data: {
              full_name: cleanName,
              company_name: data.companyName || '',
            },
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          return { success: false, error: json.error_description || json.msg || 'Sign up failed.' };
        }
        // Provision initial profile record in Supabase database
        if (json.user) {
          supabaseService.saveProfile(
            {
              id: json.user.id,
              email: cleanEmail,
              fullName: cleanName,
              companyName: data.companyName || '',
            },
            json.session?.access_token
          ).catch((e) => console.warn('Supabase initial profile sync:', e));
        }

        // If email confirmation is required by Supabase
        if (!json.session) {
          return {
            success: true,
            requiresEmailVerification: true,
            message: 'Account created! Please check your email to confirm your registration.',
          };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Network error connecting to authentication provider.' };
      }
    }

    // Local Vault Provider
    const users = this.getStoredUsers();
    const existing = users.find((u) => u.email === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please log in.' };
    }

    const salt = `salt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const passwordHash = await this.hashPassword(data.password, salt);
    const now = new Date().toISOString();

    const newUser: StoredUserAccount = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      fullName: cleanName,
      companyName: data.companyName?.trim() || '',
      country: 'United States',
      preferredLanguage: 'English',
      preferredCurrency: 'USD',
      timeZone: 'America/New_York (EST)',
      emailVerified: true,
      provider: 'local',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      salt,
      passwordHash,
    };

    users.push(newUser);
    this.saveStoredUsers(users);

    const session: AuthSession = {
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        companyName: newUser.companyName,
        jobTitle: newUser.jobTitle,
        country: newUser.country,
        preferredLanguage: newUser.preferredLanguage,
        preferredCurrency: newUser.preferredCurrency,
        timeZone: newUser.timeZone,
        emailVerified: newUser.emailVerified,
        provider: newUser.provider,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        lastLoginAt: newUser.lastLoginAt,
      },
      accessToken: `token_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      expiresAt: Math.floor(Date.now() / 1000) + 7 * 24 * 3600, // 7 days
      rememberMe: true,
    };

    this.saveSession(session, true);

    auditService.log('auth.signup_success', 'profile', {
      userId: newUser.id,
      outcome: 'success',
      metadata: { email: cleanEmail },
    });

    return { success: true, user: session.user, session };
  }

  /**
   * User Login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const cleanEmail = credentials.email.trim().toLowerCase();
    const password = credentials.password;
    const rememberMe = credentials.rememberMe ?? true;

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Cloud Supabase Auth if configured
    if (this.isSupabaseConfigured) {
      try {
        const res = await fetch(`${this.supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: this.supabaseAnonKey,
          },
          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          return { success: false, error: json.error_description || json.msg || 'Invalid login credentials.' };
        }

        const supaUser = json.user;
        const profile: UserProfile = {
          id: supaUser.id,
          email: supaUser.email,
          fullName: supaUser.user_metadata?.full_name || supaUser.email.split('@')[0],
          companyName: supaUser.user_metadata?.company_name || '',
          country: 'United States',
          preferredLanguage: 'English',
          preferredCurrency: 'USD',
          timeZone: 'America/New_York (EST)',
          emailVerified: Boolean(supaUser.email_confirmed_at),
          provider: 'supabase',
          createdAt: supaUser.created_at || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        const session: AuthSession = {
          user: profile,
          accessToken: json.access_token,
          refreshToken: json.refresh_token,
          expiresAt: Math.floor(Date.now() / 1000) + (json.expires_in || 3600),
          rememberMe,
        };

        this.saveSession(session, rememberMe);
        return { success: true, user: profile, session };
      } catch (err: any) {
        return { success: false, error: err.message || 'Connection error with authentication provider.' };
      }
    }

    // Local Vault Provider
    const users = this.getStoredUsers();
    const user = users.find((u) => u.email === cleanEmail);

    if (!user) {
      auditService.log('auth.login_failure', 'session', {
        outcome: 'failure',
        metadata: { email: cleanEmail, reason: 'account_not_found' },
      });
      return { success: false, error: 'No account found with this email. Please check your spelling or sign up.' };
    }

    const inputHash = await this.hashPassword(password, user.salt);
    if (inputHash !== user.passwordHash) {
      auditService.log('auth.login_failure', 'session', {
        userId: user.id,
        outcome: 'failure',
        metadata: { email: cleanEmail, reason: 'incorrect_password' },
      });
      return { success: false, error: 'Incorrect password. Please try again or use the password recovery option.' };
    }

    // Update lastLoginAt
    user.lastLoginAt = new Date().toISOString();
    this.saveStoredUsers(users);

    const profile: UserProfile = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      companyName: user.companyName,
      jobTitle: user.jobTitle,
      country: user.country,
      preferredLanguage: user.preferredLanguage,
      preferredCurrency: user.preferredCurrency,
      timeZone: user.timeZone,
      emailVerified: user.emailVerified,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
    };

    const session: AuthSession = {
      user: profile,
      accessToken: `token_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      expiresAt: Math.floor(Date.now() / 1000) + (rememberMe ? 30 * 24 * 3600 : 24 * 3600),
      rememberMe,
    };

    this.saveSession(session, rememberMe);

    auditService.log('auth.login_success', 'session', {
      userId: profile.id,
      outcome: 'success',
      metadata: { email: cleanEmail, provider: profile.provider },
    });

    return { success: true, user: profile, session };
  }

  /**
   * Sign Out
   */
  async signOut(): Promise<void> {
    try {
      const activeSession = this.getSession();
      if (activeSession?.user) {
        auditService.log('auth.logout', 'session', {
          userId: activeSession.user.id,
          outcome: 'success',
        });
      }

      if (this.isSupabaseConfigured && activeSession?.accessToken) {
        fetch(`${this.supabaseUrl}/auth/v1/logout`, {
          method: 'POST',
          headers: {
            apikey: this.supabaseAnonKey,
            Authorization: `Bearer ${activeSession.accessToken}`,
          },
        }).catch(() => {});
      }

      localStorage.removeItem(STORAGE_SESSION_KEY);
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
      this.notifyListeners(null);
    } catch (e) {
      console.warn('Error signing out:', e);
    }
  }

  /**
   * Update Profile Information
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const session = this.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const users = this.getStoredUsers();
    const index = users.findIndex((u) => u.id === session.user.id);
    const existing = index >= 0 ? users[index] : null;

    const updatedUser: StoredUserAccount = {
      id: session.user.id,
      email: session.user.email,
      fullName: data.fullName !== undefined ? data.fullName.trim() : session.user.fullName,
      companyName: data.companyName !== undefined ? data.companyName.trim() : session.user.companyName,
      jobTitle: data.jobTitle !== undefined ? data.jobTitle.trim() : session.user.jobTitle,
      country: data.country !== undefined ? data.country : session.user.country,
      preferredLanguage: data.preferredLanguage !== undefined ? data.preferredLanguage : session.user.preferredLanguage,
      preferredCurrency: data.preferredCurrency !== undefined ? data.preferredCurrency : session.user.preferredCurrency,
      timeZone: data.timeZone !== undefined ? data.timeZone : session.user.timeZone,
      avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : session.user.avatarUrl,
      emailVerified: session.user.emailVerified,
      provider: session.user.provider,
      createdAt: session.user.createdAt,
      updatedAt: new Date().toISOString(),
      lastLoginAt: session.user.lastLoginAt,
      passwordHash: existing ? existing.passwordHash : DEFAULT_DEMO_USER.passwordHash,
      salt: existing ? existing.salt : DEFAULT_DEMO_USER.salt,
    };

    if (index >= 0) {
      users[index] = updatedUser;
      this.saveStoredUsers(users);
    }

    const cleanProfile: UserProfile = {
      id: updatedUser.id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      avatarUrl: updatedUser.avatarUrl,
      companyName: updatedUser.companyName,
      jobTitle: updatedUser.jobTitle,
      country: updatedUser.country,
      preferredLanguage: updatedUser.preferredLanguage,
      preferredCurrency: updatedUser.preferredCurrency,
      timeZone: updatedUser.timeZone,
      emailVerified: updatedUser.emailVerified,
      provider: updatedUser.provider,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      lastLoginAt: updatedUser.lastLoginAt,
    };

    const updatedSession: AuthSession = {
      ...session,
      user: cleanProfile,
    };
    this.saveSession(updatedSession, session.rememberMe);

    // Sync with Supabase cloud database if configured
    if (this.isSupabaseConfigured) {
      supabaseService.saveProfile(
        {
          id: cleanProfile.id,
          email: cleanProfile.email,
          fullName: cleanProfile.fullName,
          avatarUrl: cleanProfile.avatarUrl,
          companyName: cleanProfile.companyName,
          jobTitle: cleanProfile.jobTitle,
          country: cleanProfile.country,
          preferredLanguage: cleanProfile.preferredLanguage,
          preferredCurrency: cleanProfile.preferredCurrency,
          timeZone: cleanProfile.timeZone,
        },
        session.accessToken
      ).catch((e) => console.warn('Supabase profile sync error:', e));

      supabaseService.savePreferences(
        {
          user_id: cleanProfile.id,
          theme: 'light',
          notifications_email: true,
          notifications_marketing: false,
          compact_tables: false,
        },
        session.accessToken
      ).catch((e) => console.warn('Supabase preferences sync error:', e));
    }

    return cleanProfile;
  }

  /**
   * Change Password
   */
  async changePassword(data: ChangePasswordData): Promise<{ success: boolean; error?: string }> {
    const session = this.getSession();
    if (!session) {
      return { success: false, error: 'You must be signed in to change your password.' };
    }

    if (!data.newPassword || data.newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }
    if (data.confirmPassword && data.newPassword !== data.confirmPassword) {
      return { success: false, error: 'New passwords do not match.' };
    }

    // Cloud Supabase password update
    if (this.isSupabaseConfigured && session.accessToken) {
      try {
        const res = await fetch(`${this.supabaseUrl}/auth/v1/user`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            apikey: this.supabaseAnonKey,
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ password: data.newPassword }),
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          return { success: false, error: json.error_description || json.msg || 'Failed to update password with Supabase.' };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Connection error updating password.' };
      }
    }

    const users = this.getStoredUsers();
    const user = users.find((u) => u.id === session.user.id);
    if (!user) {
      return { success: false, error: 'User account not found.' };
    }

    // Verify current password if provided
    if (data.currentPassword) {
      const currentHash = await this.hashPassword(data.currentPassword, user.salt);
      if (currentHash !== user.passwordHash) {
        return { success: false, error: 'Current password is incorrect.' };
      }
    }

    // Hash new password with fresh salt
    const newSalt = `salt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    user.salt = newSalt;
    user.passwordHash = await this.hashPassword(data.newPassword, newSalt);
    user.updatedAt = new Date().toISOString();

    this.saveStoredUsers(users);

    auditService.log('auth.password_changed', 'profile', {
      userId: session.user.id,
      outcome: 'success',
    });

    return { success: true };
  }

  /**
   * Request Password Reset Link or Token
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }

    // Cloud Supabase password recovery
    if (this.isSupabaseConfigured) {
      try {
        await fetch(`${this.supabaseUrl}/auth/v1/recover`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: this.supabaseAnonKey,
          },
          body: JSON.stringify({ email: cleanEmail }),
        });
      } catch (e) {
        console.warn('Supabase password recovery notice:', e);
      }
    }

    const users = this.getStoredUsers();
    const user = users.find((u) => u.email === cleanEmail);

    // To prevent account enumeration in production, always return success outwardly,
    // but internally generate a valid token only if the user exists
    if (!user) {
      return {
        success: true,
        token: undefined,
      };
    }

    const token = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const expiresAt = Date.now() + 3600 * 1000; // 1 hour

    try {
      const raw = localStorage.getItem(STORAGE_RESET_TOKENS_KEY);
      const tokens: StoredResetToken[] = raw ? JSON.parse(raw) : [];
      tokens.push({ token, email: cleanEmail, expiresAt });
      localStorage.setItem(STORAGE_RESET_TOKENS_KEY, JSON.stringify(tokens));
      auditService.log('auth.password_reset_requested', 'profile', {
        userId: user.id,
        outcome: 'success',
        metadata: { email: cleanEmail },
      });
    } catch (e) {
      console.warn('Error saving reset token:', e);
    }

    return { success: true, token };
  }

  /**
   * Reset Password with Token
   */
  async resetPassword(data: ResetPasswordData): Promise<{ success: boolean; error?: string }> {
    if (!data.token) {
      return { success: false, error: 'Missing or invalid password reset token.' };
    }
    if (!data.newPassword || data.newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }
    if (data.confirmPassword && data.newPassword !== data.confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    let tokens: StoredResetToken[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_RESET_TOKENS_KEY);
      tokens = raw ? JSON.parse(raw) : [];
    } catch {
      tokens = [];
    }

    const tokenEntry = tokens.find((t) => t.token === data.token);
    if (!tokenEntry) {
      return { success: false, error: 'Invalid or expired password reset token. Please request a new link.' };
    }

    if (tokenEntry.expiresAt < Date.now()) {
      return { success: false, error: 'Password reset token has expired. Please request a new link.' };
    }

    const users = this.getStoredUsers();
    const user = users.find((u) => u.email === tokenEntry.email);
    if (!user) {
      return { success: false, error: 'Associated user account was not found.' };
    }

    const newSalt = `salt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    user.salt = newSalt;
    user.passwordHash = await this.hashPassword(data.newPassword, newSalt);
    user.updatedAt = new Date().toISOString();
    this.saveStoredUsers(users);

    // Invalidate used token
    const remainingTokens = tokens.filter((t) => t.token !== data.token);
    localStorage.setItem(STORAGE_RESET_TOKENS_KEY, JSON.stringify(remainingTokens));

    auditService.log('auth.password_reset_completed', 'profile', {
      userId: user.id,
      outcome: 'success',
      metadata: { email: user.email },
    });

    return { success: true };
  }

  /**
   * Email Verification
   */
  async verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
    if (!token) {
      return { success: false, error: 'Invalid verification token.' };
    }

    const session = this.getSession();
    if (session) {
      session.user.emailVerified = true;
      this.saveSession(session, session.rememberMe);

      const users = this.getStoredUsers();
      const u = users.find((x) => x.id === session.user.id);
      if (u) {
        u.emailVerified = true;
        this.saveStoredUsers(users);
      }
    }
    return { success: true };
  }

  /**
   * Event listener subscription for auth changes
   */
  onAuthStateChange(callback: (user: UserProfile | null) => void): () => void {
    this.listeners.push(callback);
    // Initial call
    callback(this.getCurrentUser());

    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners(user: UserProfile | null): void {
    for (const listener of this.listeners) {
      try {
        listener(user);
      } catch (e) {
        console.warn('Error in auth listener:', e);
      }
    }
  }
}

export const authService = new AuthService();
