/**
 * Reset Password Page
 * Sparkline Marketing Intelligence Platform — Phase 21
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Button } from '@/components/common/Button';
import { TextInput } from '@/components/common/Form';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/common/Feedback';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const { addToast } = useToast();

  const tokenParam = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [tokenParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token.trim()) {
      setErrorMessage('Please provide a valid password reset token.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setIsSuccess(true);
        addToast({
          title: 'Password Updated!',
          message: 'Your account password has been successfully reset.',
          type: 'success',
        });
      } else {
        setErrorMessage(res.error || 'Failed to reset password. The link or token may be expired.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO
        title="Set New Password | Sparkline Marketing"
        description="Choose a new secure password for your account."
        noIndex={true}
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-block mb-4">
          <Logo />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight">
          Set New Password
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
          Choose a strong, unique password to secure your marketing intelligence assets.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-card border border-slate-200/80 rounded-2xl sm:px-10">
          {errorMessage && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <TextInput
                  label="Reset Token"
                  type="text"
                  placeholder="rst_..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <div>
                <div className="relative">
                  <TextInput
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <TextInput
                  label="Confirm New Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  autoComplete="new-password"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gradient"
                  size="md"
                  className="w-full justify-center"
                  disabled={isLoading}
                  rightIcon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}
                >
                  {isLoading ? 'Updating Password...' : 'Save New Password'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-sparkline-midnight">Password Successfully Reset</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your new password has been applied. You can now sign in to your marketing workspace.
              </p>
              <div className="pt-4">
                <Button
                  to="/login"
                  variant="gradient"
                  size="md"
                  className="w-full justify-center"
                >
                  Sign In with New Password
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
