import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ShieldCheck, Lock, Database, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SecurityPlaceholder: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/dashboard" className="hover:text-sparkline-blue flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        <span>/</span>
        <span className="text-sparkline-midnight font-semibold">Security Center</span>
      </div>

      {/* Main Header Card */}
      <Card className="p-8 border-slate-200/90 shadow-card bg-white">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="blue" size="sm">
                Security Architecture
              </Badge>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Phase 1 Active Baseline
              </span>
            </div>
            <h1 className="text-2xl font-bold text-sparkline-midnight mt-1">
              Security Center & Privacy Guarantees
            </h1>
          </div>
        </div>

        <div className="py-6 space-y-6">
          <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
            Sparkline Marketing implements a security-first engineering methodology.
            We protect your confidential product margins, acquisition costs, and strategic plans
            through cryptographic tenant isolation and zero-exposure API architectures.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-sparkline-midnight font-bold text-sm">
                <Lock className="w-4 h-4 text-sparkline-blue" />
                <span>Zero Client-Side Secrets</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Frontend bundles contain zero API keys, database secrets, or third-party credentials.
                All AI and analytics calls route through authenticated serverless gateways.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-sparkline-midnight font-bold text-sm">
                <Database className="w-4 h-4 text-sparkline-purple" />
                <span>Tenant Row-Level Security</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                PostgreSQL Row Level Security (RLS) ensures that every database query is strictly
                restricted to the authenticated user ID. Cross-tenant leakage is prevented at the database engine level.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-sparkline-midnight font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-sparkline-magenta" />
                <span>Zero AI Training Policy</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your strategy inputs, product unit economics, and competitive analyses are never
                used to train foundation models. Enterprise data privacy agreements are strictly maintained.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-sparkline-midnight font-bold text-sm">
                <KeyRound className="w-4 h-4 text-sparkline-orange" />
                <span>Input Boundary Validation</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict input sanitization filters user submissions at application entry points,
                preventing cross-site scripting (XSS), script injection, and query corruption.
              </p>
            </div>
          </div>
        </div>

        {/* Security Principles Checklist */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Architectural Guarantees
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Strict TypeScript compiler mode (no implicit any)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>No unverified certificates or false compliance badges</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>No persistent sensitive data stored in localStorage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Isolated layout routing between public and dashboard contexts</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

