import React from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ModulePlaceholderProps {
  title: string;
  category: string;
  icon: React.ReactNode;
  scheduledPhase: string;
  description: string;
  plannedFeatures: string[];
  securityNote?: string;
}

export const DashboardModulePlaceholder: React.FC<ModulePlaceholderProps> = ({
  title,
  category,
  icon,
  scheduledPhase,
  description,
  plannedFeatures,
  securityNote = 'All module operations will enforce strict tenant isolation and server-side authorization once activated.',
}) => {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/dashboard" className="hover:text-sparkline-blue flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        <span>/</span>
        <span className="text-sparkline-midnight font-semibold">{title}</span>
      </div>

      {/* Main Module Card */}
      <Card className="p-8 border-slate-200/90 shadow-card bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-sparkline-blue flex items-center justify-center shrink-0">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="blue" size="sm">
                  {category}
                </Badge>
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>{scheduledPhase}</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-sparkline-midnight mt-1">
                {title}
              </h1>
            </div>
          </div>

          <Button to="/dashboard" variant="outline" size="sm">
            Back to Overview
          </Button>
        </div>

        {/* Description & Value Proposition */}
        <div className="py-6 space-y-4">
          <h2 className="text-sm font-bold text-sparkline-midnight uppercase tracking-wider text-slate-400">
            Module Architecture & Scope
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
            {description}
          </p>

          <div className="pt-2">
            <h3 className="text-xs font-bold text-sparkline-midnight uppercase tracking-wider text-slate-400 mb-3">
              Scheduled Capabilities:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plannedFeatures.map((feat) => (
                <div
                  key={feat}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-sparkline-blue shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Architectural Guarantee */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-3 bg-blue-50/40 p-4 rounded-xl border border-blue-100">
          <ShieldCheck className="w-5 h-5 text-sparkline-blue shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600">
            <strong className="text-sparkline-midnight font-semibold block">
              Architectural Security Protocol
            </strong>
            {securityNote}
          </div>
        </div>
      </Card>
    </div>
  );
};

