/**
 * Forgot Password Request Page
 * Sparkline Marketing Intelligence Platform — Phase 21
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Button } from '@/components/common/Button';
import { TextInput } from '@/components/common/Form';
import { useAuth } from '@/context/AuthContext';
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowRight,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useToast } from '@/components/common/Feedback';

export const ForgotPasswordPage: React.FC = () => {
  const { requestPasswordReset } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestPasswordReset(email);
      if (res.success) {
        setIsSubmitted(true);
        if (res.token) {
          setGeneratedToken(res.token);
        }
      } else {
        setErrorMessage(res.error || 'Failed to dispatch password recovery request.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while requesting password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      addToast({
        title: 'Token Copied',
        message: 'Password reset token copied to clipboard.',
        type: 'info',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO
        title="Reset Password | Sparkline Marketing"
        description="Recover access to your Sparkline Marketing workspace."
        noIndex={true}
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-block mb-4">
          <Logo />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight">
          Password Recovery
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
          Enter your registered email address and we'll dispatch instructions to reset your account password.
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

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <TextInput
                  label="Email Address"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  autoComplete="email"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gradient"
                  size="md"
                  className="w-full justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? 'Dispatching Reset Link...' : 'Send Recovery Instructions'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-sparkline-midnight">Recovery Instructions Dispatched</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an account exists for <strong className="text-slate-900">{email}</strong>, recovery instructions have been prepared.
              </p>

              {/* Local Development Vault Direct Reset Helper */}
              {generatedToken && (
                <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-sparkline-blue uppercase tracking-wider">
                      Local Vault Token Generated
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className="text-xs text-sparkline-blue hover:text-blue-800 flex items-center gap-1 font-semibold"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="font-mono text-[11px] bg-white p-2 rounded border border-blue-100 text-slate-700 break-all select-all">
                    {generatedToken}
                  </div>
                  <Link
                    to={`/reset-password?token=${generatedToken}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sparkline-blue hover:underline pt-1"
                  >
                    <span>Proceed to Reset Password</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-sparkline-midnight transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
