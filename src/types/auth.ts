/**
 * SPARKLINE MARKETING — AUTHENTICATION & USER PROFILE DOMAIN TYPES
 * Phase 21: User Authentication, Session Management, Profile Governance & Data Isolation
 */

export type AuthProviderType = 'local' | 'supabase' | 'google';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  companyName?: string;
  jobTitle?: string;
  country: string;
  preferredLanguage: string;
  preferredCurrency: string;
  timeZone: string;
  emailVerified: boolean;
  provider: AuthProviderType;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  marketingEmails: boolean;
  defaultDetailLevel: 'Brief' | 'Standard' | 'Comprehensive';
  compactView: boolean;
}

export interface AuthSession {
  user: UserProfile;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // Unix epoch in seconds
  rememberMe: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  session?: AuthSession;
  error?: string;
  requiresEmailVerification?: boolean;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  companyName?: string;
  agreeToTerms: boolean;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface UpdateProfileData {
  fullName?: string;
  companyName?: string;
  jobTitle?: string;
  country?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  timeZone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface AuthProviderStatus {
  provider: AuthProviderType;
  isCloudConnected: boolean;
  googleOAuthAvailable: boolean;
  providerName: string;
  description: string;
}

