/**
 * Verify Email Page
 * Sparkline Marketing Intelligence Platform — Phase 21
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import {
  MailCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { verifyEmail, user } = useAuth();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'pending'>(
    token ? 'verifying' : 'pending'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .then((res) => {
          if (res.success) {
            setStatus('success');
          } else {
            setStatus('error');
            setErrorMessage(res.error || 'Verification link expired or invalid.');
          }
        })
        .catch((err) => {
          setStatus('error');
          setErrorMessage(err.message || 'Verification failed.');
        });
    }
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO
        title="Verify Email | Sparkline Marketing"
        description="Verify your email address to access your marketing workspace."
        noIndex={true}
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-block mb-4">
          <Logo />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight">
          Email Verification
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-card border border-slate-200/80 rounded-2xl sm:px-10 text-center">
          {status === 'verifying' && (
            <div className="space-y-4 py-4">
              <div className="w-10 h-10 border-2 border-slate-200 border-t-sparkline-blue rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-500">
                Confirming your registration credentials...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-sparkline-midnight">Email Address Verified!</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your email has been confirmed. You now have full access to create projects, generate strategies, and export reports.
              </p>
              <div className="pt-4">
                <Button
                  to="/dashboard"
                  variant="gradient"
                  size="md"
                  className="w-full justify-center"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Enter Workspace Dashboard
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-sparkline-midnight">Verification Failed</h2>
              <p className="text-xs text-rose-700 leading-relaxed">
                {errorMessage || 'The verification link has expired or is invalid.'}
              </p>
              <div className="pt-4 space-y-2">
                <Button
                  to="/login"
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                >
                  Return to Sign In
                </Button>
              </div>
            </div>
          )}

          {status === 'pending' && (
            <div className="space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-sparkline-blue flex items-center justify-center mx-auto">
                <MailCheck className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-sparkline-midnight">Verification Message Sent</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Please check your inbox ({user?.email || 'your registered address'}) and click the confirmation link to complete registration.
              </p>
              <div className="pt-4">
                <Button
                  to="/dashboard"
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                >
                  Continue to Workspace
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
