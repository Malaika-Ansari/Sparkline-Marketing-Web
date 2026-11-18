/**
 * SPARKLINE MARKETING — PRODUCTION RESILIENT ERROR BOUNDARY
 * Phase A — Task 4: Production Monitoring and Reliability
 *
 * Catches JavaScript errors anywhere in the React component tree,
 * logs the diagnostic context safely without secrets, and displays a
 * user-friendly fallback UI with clear recovery actions.
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Sanitize error message to prevent accidental secret or path disclosure
    const cleanMessage = error.message
      ?.replace(/AIza[A-Za-z0-9_-]{33}/g, '[REDACTED_KEY]')
      ?.replace(/[A-Za-z0-9_-]{35,}/g, '[REDACTED_TOKEN]')
      ?.replace(/[C-Z]:\\[\w.-]+(?:\\[\w.-]+)+/gi, '[REDACTED_PATH]');

    console.error('React ErrorBoundary caught an unhandled rendering error:', {
      message: cleanMessage,
      componentStack: errorInfo.componentStack?.slice(0, 500),
      timestamp: new Date().toISOString(),
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              Application Recovery Mode
            </span>

            <h1 className="text-xl font-bold text-slate-900 mb-2">
              Something unexpected happened
            </h1>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              We encountered an issue rendering this section. Your account, marketing projects, and session data remain safe and uncorrupted.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
              >
                <Home className="w-4 h-4" />
                Return to Dashboard
              </button>

              <button
                onClick={this.handleReload}
                className="text-xs text-slate-400 hover:text-slate-600 underline pt-2 block mx-auto transition-colors"
              >
                Reload entire application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
