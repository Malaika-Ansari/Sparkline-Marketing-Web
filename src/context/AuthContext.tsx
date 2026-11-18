/**
 * SPARKLINE MARKETING — AUTHENTICATION CONTEXT & PROVIDER
 * Phase 21: React Context State, Authentication Hooks & Session Management
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: UserProfile | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  providerStatus: AuthProviderStatus;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signUp: (data: SignUpData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<UserProfile>;
  changePassword: (data: ChangePasswordData) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; token?: string; error?: string }>;
  resetPassword: (data: ResetPasswordData) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [session, setSession] = useState<AuthSession | null>(() => authService.getSession());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [providerStatus, setProviderStatus] = useState<AuthProviderStatus>(() =>
    authService.getProviderStatus()
  );

  const refreshUser = useCallback(() => {
    const current = authService.getCurrentUser();
    const currSession = authService.getSession();
    setUser(current);
    setSession(currSession);
  }, []);

  useEffect(() => {
    // Subscribe to auth state updates
    const unsubscribe = authService.onAuthStateChange((updatedUser) => {
      setUser(updatedUser);
      setSession(authService.getSession());
      setIsLoading(false);
    });

    setProviderStatus(authService.getProviderStatus());

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await authService.login(credentials);
    if (res.success && res.user && res.session) {
      setUser(res.user);
      setSession(res.session);
    }
    return res;
  };

  const signUp = async (data: SignUpData): Promise<AuthResponse> => {
    const res = await authService.signUp(data);
    if (res.success && res.user && res.session) {
      setUser(res.user);
      setSession(res.session);
    }
    return res;
  };

  const signOut = async (): Promise<void> => {
    await authService.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (data: UpdateProfileData): Promise<UserProfile> => {
    const updated = await authService.updateProfile(data);
    setUser(updated);
    setSession(authService.getSession());
    return updated;
  };

  const changePassword = async (
    data: ChangePasswordData
  ): Promise<{ success: boolean; error?: string }> => {
    return authService.changePassword(data);
  };

  const requestPasswordReset = async (
    email: string
  ): Promise<{ success: boolean; token?: string; error?: string }> => {
    return authService.requestPasswordReset(email);
  };

  const resetPassword = async (
    data: ResetPasswordData
  ): Promise<{ success: boolean; error?: string }> => {
    return authService.resetPassword(data);
  };

  const verifyEmail = async (token: string): Promise<{ success: boolean; error?: string }> => {
    return authService.verifyEmail(token);
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: Boolean(user),
    providerStatus,
    login,
    signUp,
    signOut,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

