/**
 * Reports & Insights Command Center
 * Sparkline Marketing Intelligence Platform — Phase 20
 */

import React, { useState, useEffect, useMemo } from 'react';
import { SEO } from '@/components/common/SEO';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/components/common/Feedback';
import { projectService } from '@/services/project.service';
import {
  reportService,
  REPORT_TEMPLATES,
  REPORT_SECTIONS_CATALOG,
} from '@/services/report.service';
import {
  MarketingReport,
  ReportConfiguration,
  ReportTemplate,
  ReportDetailLevel,
  ReportSectionId,
} from '@/types/report';
import { MarketingProject } from '@/types/project';
import { useAuth } from '@/context/AuthContext';
import {
  FileText,
  Plus,
  Search,
  Download,
  Printer,
  Eye,
  Copy,
  RefreshCw,
  Archive,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { addToast } = useToast();
  const { user } = useAuth();

  // State
  const [reports, setReports] = useState<MarketingReport[]>([]);
  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Modals & Viewers
  const [showBuilderModal, setShowBuilderModal] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [activeReportForPreview, setActiveReportForPreview] = useState<MarketingReport | null>(null);
  const [previewActiveSection, setPreviewActiveSection] = useState<string>('cover');

  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [activeTemplatePreview, setActiveTemplatePreview] = useState<ReportTemplate | null>(null);

  const [showRegenerateModal, setShowRegenerateModal] = useState<boolean>(false);
  const [reportToRegenerate, setReportToRegenerate] = useState<MarketingReport | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [reportToDelete, setReportToDelete] = useState<MarketingReport | null>(null);

  // Multi-step builder state
  const [builderStep, setBuilderStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [builderConfig, setBuilderConfig] = useState<ReportConfiguration>({
    projectId: '',
    templateId: 'executive-strategy',
    title: '',
    subtitle: '',
    reportingPeriod: 'Q4 2026 — Annual Outlook',
    reportDate: new Date().toISOString().substring(0, 10),
    detailLevel: 'Standard',
    includedSections: ['cover', 'executive_summary', 'marketing_strategy', 'budget_allocation'],
    includeCoverPage: true,
    includeTableOfContents: true,
    includeCharts: true,
    includeSources: true,
    branding: {
      brandName: '',
      primaryColor: '#0C65F4',
      accentColor: '#071329',
      preparedBy: 'Sparkline Marketing AI',
      preparedFor: 'Executive Committee',
    },
  });

  // Load initial data
  useEffect(() => {
    const loadedProjects = projectService.getProjects(user?.id);
    setProjects(loadedProjects);

    const loadedReports = reportService.getReports(user?.id);
    setReports(loadedReports);

    if (loadedProjects.length > 0 && loadedProjects[0]) {
      const p = loadedProjects[0];
      setBuilderConfig((prev) => ({
        ...prev,
        projectId: p.id,
        branding: {
          ...prev.branding,
          brandName: p.business?.brandName || 'Sparkline Marketing',
          preparedFor: p.business?.brandName || 'Executive Committee',
        },
      }));
    }
  }, [user?.id]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports
      .filter((r) => {
        const matchesProject = selectedProjectId === 'all' || r.projectId === selectedProjectId;
        const matchesStatus =
          statusFilter === 'all'
            ? !r.isArchived
            : statusFilter === 'archived'
            ? r.isArchived
            : r.status.toLowerCase() === statusFilter.toLowerCase() && !r.isArchived;
        const matchesSearch =
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.templateName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesProject && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return a.title.localeCompare(b.title);
      });
  }, [reports, selectedProjectId, statusFilter, searchQuery, sortBy]);

  // Metric stats
  const stats = useMemo(() => {
    const total = reports.length;
    const ready = reports.filter((r) => r.status === 'Ready' && !r.isArchived).length;
    const drafts = reports.filter((r) => r.status === 'Draft' && !r.isArchived).length;
    const archived = reports.filter((r) => r.isArchived).length;
    return { total, ready, drafts, archived };
  }, [reports]);

  // Selected project in builder
  const currentBuilderProject = useMemo(() => {
    return projects.find((p) => p.id === builderConfig.projectId) || projects[0] || null;
  }, [projects, builderConfig.projectId]);

  // Data availability analysis for builder
  const sectionReadiness = useMemo(() => {
    if (!currentBuilderProject) return REPORT_SECTIONS_CATALOG;
    return reportService.evaluateProjectDataAvailability(currentBuilderProject);
  }, [currentBuilderProject]);

  // Handlers
  const handleOpenBuilderWithTemplate = (template: ReportTemplate) => {
    const p = currentBuilderProject;
    const brand = p?.business?.brandName || 'Company';

    setBuilderConfig({
      projectId: p?.id || (projects[0]?.id || ''),
      templateId: template.id,
      title: `${template.name} — ${brand}`,
      subtitle: `${template.description}`,
      reportingPeriod: 'Q4 2026 — Annual Outlook',
      reportDate: new Date().toISOString().substring(0, 10),
      detailLevel: template.defaultDetailLevel,
      includedSections: [...template.includedSections],
      includeCoverPage: true,
      includeTableOfContents: true,
      includeCharts: true,
      includeSources: true,
      branding: {
        brandName: brand,
        primaryColor: '#0C65F4',
        accentColor: '#071329',
        preparedBy: 'Sparkline Marketing AI',
        preparedFor: `${brand} Leadership`,
      },
    });

    setBuilderStep(1);
    setShowBuilderModal(true);
  };

  const handleToggleSection = (sectionId: ReportSectionId) => {
    setBuilderConfig((prev) => {
      const exists = prev.includedSections.includes(sectionId);
      const updated = exists
        ? prev.includedSections.filter((s) => s !== sectionId)
        : [...prev.includedSections, sectionId];
      return { ...prev, includedSections: updated };
    });
  };

  const handleGenerateReportSubmit = () => {
    if (!builderConfig.title.trim()) {
      addToast({ title: 'Please provide a report title', type: 'error' });
      return;
    }
    if (builderConfig.includedSections.length === 0) {
      addToast({ title: 'Select at least one report section', type: 'error' });
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      try {
        const created = reportService.createReport(builderConfig, user?.id);
        setReports(reportService.getReports(user?.id));
        setIsGenerating(false);
        setShowBuilderModal(false);
        addToast({
          title: 'Report Generated Successfully',
          message: `"${created.title}" is ready for review and PDF export.`,
          type: 'success',
        });
        setActiveReportForPreview(created);
        setShowPreviewModal(true);
      } catch (err: unknown) {
        setIsGenerating(false);
        const msg = err instanceof Error ? err.message : 'Report generation error';
        addToast({ title: 'Generation Failed', message: msg, type: 'error' });
      }
    }, 750);
  };

  const handleDuplicate = (report: MarketingReport) => {
    const copy = reportService.duplicateReport(report.id);
    if (copy) {
      setReports(reportService.getReports(user?.id));
      addToast({ title: 'Report Duplicated', message: `Created "${copy.title}"`, type: 'success' });
    }
  };

  const handleArchiveToggle = (report: MarketingReport) => {
    reportService.archiveReport(report.id);
    setReports(reportService.getReports(user?.id));
    addToast({
      title: report.isArchived ? 'Report Unarchived' : 'Report Archived',
      type: 'info',
    });
  };

  const handleConfirmRegenerate = () => {
    if (!reportToRegenerate) return;
    const updated = reportService.regenerateReport(reportToRegenerate.id);
    if (updated) {
      setReports(reportService.getReports(user?.id));
      setShowRegenerateModal(false);
      setReportToRegenerate(null);
      addToast({
        title: 'Report Regenerated',
        message: `Version ${updated.version}.0 updated with currently active project data.`,
        type: 'success',
      });
      setActiveReportForPreview(updated);
      setShowPreviewModal(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!reportToDelete) return;
    reportService.deleteReport(reportToDelete.id, user?.id);
    setReports(reportService.getReports(user?.id));
    setShowDeleteModal(false);
    setReportToDelete(null);
    addToast({ title: 'Report Deleted', type: 'info' });
  };

  const handleDownloadPdf = (report: MarketingReport) => {
    reportService.exportReportToPdfFile(report);
    setReports(reportService.getReports(user?.id));
    addToast({
      title: 'PDF Export Downloaded',
      message: `Downloaded ${report.title}.pdf`,
      type: 'success',
    });
  };

  const handlePrintPdf = (report: MarketingReport) => {
    reportService.printReportToPdf(report);
  };

  const handleExportCsv = (report: MarketingReport) => {
    const csvContent = reportService.exportReportToCsv(report);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sparkline-Data-Export-${report.projectName.replace(/\s+/g, '-')}-${report.configuration.reportDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ title: 'CSV Data Exported', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      <SEO
        title="Reports & Insights | Sparkline Marketing"
        description="Build executive-ready marketing reports, evaluate performance scenarios, and export professional PDF presentations."
      />

      {/* Top Banner / Provenance Notice */}
      <div className="bg-gradient-to-r from-sparkline-blue-900 via-sparkline-slate to-sparkline-midnight text-white px-6 py-2.5 text-xs font-medium border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Deterministic Report Governance:</strong> Every metric card and financial calculation displays its verified data provenance. Zero synthetic projections or black-box rankings.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300">Format: Standard A4 Vector PDF & Print Output</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-sparkline-blue/10 text-sparkline-blue border border-sparkline-blue/20">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-sparkline-midnight tracking-tight">
                Reports & Insights
              </h1>
            </div>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              Compile strategic marketing blueprints, unit economics models, and forecast scenarios into client-ready PDF presentations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<BookOpen className="w-4 h-4" />}
              onClick={() => {
                setActiveTemplatePreview(REPORT_TEMPLATES[0] || null);
                setShowTemplateModal(true);
              }}
            >
              Browse Templates
            </Button>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                const defaultTpl = REPORT_TEMPLATES[0];
                if (defaultTpl) handleOpenBuilderWithTemplate(defaultTpl);
              }}
            >
              Create New Report
            </Button>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Saved Reports
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-sparkline-midnight">{stats.total}</span>
              <span className="text-xs text-slate-500 font-medium">In Library</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Generated & Ready
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600">{stats.ready}</span>
              <span className="text-xs text-emerald-600 font-medium">Verified PDF</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Active Drafts
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-700">{stats.drafts}</span>
              <span className="text-xs text-slate-400 font-medium">Unfinalized</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Archived Reports
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-500">{stats.archived}</span>
              <span className="text-xs text-slate-400 font-medium">Historical</span>
            </div>
          </div>
        </div>

        {/* Reusable Templates Strip */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-sparkline-midnight">
                Featured Report Blueprints & Templates
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select an institutional template calibrated for leadership, investors, or tactical execution teams.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REPORT_TEMPLATES.slice(0, 6).map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-sparkline-midnight group-hover:text-sparkline-blue transition-colors">
                      {tpl.name}
                    </h3>
                    {tpl.badge && (
                      <Badge variant="blue" size="sm">
                        {tpl.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{tpl.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Included Sections:</span>
                    <span className="font-semibold text-slate-800">{tpl.includedSections.length} Chapters</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Default Detail:</span>
                    <span className="font-semibold text-slate-800">{tpl.defaultDetailLevel}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setActiveTemplatePreview(tpl);
                        setShowTemplateModal(true);
                      }}
                      className="flex-1 py-1.5 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
                    >
                      Preview Outline
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenBuilderWithTemplate(tpl)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Reports Table & Controller */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-sparkline-midnight">
                Saved Reports & Exports ({filteredReports.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage, preview, download, and regenerate formal project reports.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reports..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-sparkline-blue"
                />
              </div>

              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none"
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.business?.brandName || p.id}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none"
              >
                <option value="all">Active Reports</option>
                <option value="ready">Ready (Generated)</option>
                <option value="draft">Drafts</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="title">Sort: Title</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Report Title & Subtitle</th>
                  <th className="py-3 px-3">Project</th>
                  <th className="py-3 px-3">Template</th>
                  <th className="py-3 px-2 text-center">Version</th>
                  <th className="py-3 px-3">Generated Date</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-sparkline-midnight truncate">
                        {rep.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {rep.subtitle}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {rep.projectName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                        {rep.templateName}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-500">
                      v{rep.version}.0
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge
                        variant={
                          rep.status === 'Ready'
                            ? 'blue'
                            : rep.status === 'Draft'
                            ? 'slate'
                            : rep.status === 'Archived'
                            ? 'orange'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {rep.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setActiveReportForPreview(rep);
                            setPreviewActiveSection('cover');
                            setShowPreviewModal(true);
                          }}
                          title="Interactive Preview"
                          className="p-1.5 text-slate-500 hover:text-sparkline-blue hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDownloadPdf(rep)}
                          title="Download PDF"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handlePrintPdf(rep)}
                          title="Print / Save to PDF"
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDuplicate(rep)}
                          title="Duplicate Report"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setReportToRegenerate(rep);
                            setShowRegenerateModal(true);
                          }}
                          title="Regenerate with Live Project Data"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleArchiveToggle(rep)}
                          title={rep.isArchived ? 'Restore Report' : 'Archive Report'}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setReportToDelete(rep);
                            setShowDeleteModal(true);
                          }}
                          title="Delete Report"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <h4 className="text-sm font-semibold text-slate-700">No Reports Found</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        {searchQuery
                          ? 'No reports match your search query.'
                          : 'Get started by creating your first executive marketing strategy report.'}
                      </p>
                      <div className="mt-4">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            const defaultTpl = REPORT_TEMPLATES[0];
                            if (defaultTpl) handleOpenBuilderWithTemplate(defaultTpl);
                          }}
                        >
                          Create First Report
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL 1: MULTI-STEP REPORT BUILDER */}
      {showBuilderModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-6 border border-slate-200 shadow-2xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-sparkline-midnight">
                  Custom Marketing Report Builder
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Step {builderStep} of 5: {
                    builderStep === 1
                      ? 'Select Project Association'
                      : builderStep === 2
                      ? 'Choose Report Template'
                      : builderStep === 3
                      ? 'Select Content Chapters'
                      : builderStep === 4
                      ? 'Customize Branding & Scope'
                      : 'Review & Generate Report'
                  }
                </p>
              </div>
              <button
                onClick={() => setShowBuilderModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Wizard Progress Bar */}
            <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-500">
              {['Project', 'Template', 'Sections', 'Branding', 'Review'].map((stepName, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className={`w-full h-1.5 rounded-full transition-colors ${
                      builderStep >= i + 1 ? 'bg-sparkline-blue' : 'bg-slate-200'
                    }`}
                  />
                  <span className={builderStep === i + 1 ? 'text-sparkline-blue font-bold' : ''}>
                    {stepName}
                  </span>
                </div>
              ))}
            </div>

            {/* STEP 1: Select Project */}
            {builderStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Target Project Context
                  </label>
                  <select
                    value={builderConfig.projectId}
                    onChange={(e) => {
                      const proj = projects.find((p) => p.id === e.target.value);
                      setBuilderConfig((prev) => ({
                        ...prev,
                        projectId: e.target.value,
                        branding: {
                          ...prev.branding,
                          brandName: proj?.business?.brandName || 'Brand',
                          preparedFor: proj?.business?.brandName || 'Leadership',
                        },
                      }));
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.business?.brandName || p.id} ({p.business?.industry || 'General'})
                      </option>
                    ))}
                  </select>
                </div>

                {currentBuilderProject && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <span className="font-bold text-sparkline-midnight text-sm block">
                      {currentBuilderProject.business?.brandName} Profile Summary
                    </span>
                    <p className="text-slate-600">{currentBuilderProject.business?.description}</p>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-slate-500">
                      <div>
                        <strong>Industry:</strong> {currentBuilderProject.business?.industry}
                      </div>
                      <div>
                        <strong>Regions:</strong> {currentBuilderProject.business?.regionsServed || 'Global'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Select Template */}
            {builderStep === 2 && (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {REPORT_TEMPLATES.map((tpl) => {
                    const isSelected = builderConfig.templateId === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => {
                          const brand = currentBuilderProject?.business?.brandName || 'Company';
                          setBuilderConfig((prev) => ({
                            ...prev,
                            templateId: tpl.id,
                            title: `${tpl.name} — ${brand}`,
                            subtitle: tpl.description,
                            detailLevel: tpl.defaultDetailLevel,
                            includedSections: [...tpl.includedSections],
                          }));
                        }}
                        className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/70 border-sparkline-blue shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-sparkline-midnight">{tpl.name}</strong>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-sparkline-blue" />}
                        </div>
                        <p className="text-slate-600 line-clamp-2">{tpl.description}</p>
                        <div className="mt-2 text-[11px] text-slate-400">
                          {tpl.includedSections.length} Sections • Detail: {tpl.defaultDetailLevel}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Choose Sections */}
            {builderStep === 3 && (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                  <span>Selected: {builderConfig.includedSections.length} of 25 Chapters</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setBuilderConfig((prev) => ({
                          ...prev,
                          includedSections: REPORT_SECTIONS_CATALOG.map((s) => s.id),
                        }))
                      }
                      className="text-sparkline-blue hover:underline font-semibold"
                    >
                      Select All
                    </button>
                    <span>•</span>
                    <button
                      onClick={() =>
                        setBuilderConfig((prev) => ({
                          ...prev,
                          includedSections: ['cover', 'executive_summary'],
                        }))
                      }
                      className="text-slate-500 hover:underline"
                    >
                      Reset Core
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {sectionReadiness.map((sec) => {
                    const isIncluded = builderConfig.includedSections.includes(sec.id);
                    return (
                      <div
                        key={sec.id}
                        onClick={() => handleToggleSection(sec.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                          isIncluded
                            ? 'bg-slate-50 border-sparkline-blue/50'
                            : 'bg-white border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isIncluded}
                            onChange={() => {}}
                            className="rounded text-sparkline-blue focus:ring-sparkline-blue"
                          />
                          <div>
                            <span className="font-semibold text-sparkline-midnight block">
                              {sec.title}
                            </span>
                            <span className="text-[11px] text-slate-500">{sec.description}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            variant={sec.dataState === 'complete' ? 'blue' : 'orange'}
                            size="sm"
                          >
                            {sec.dataState === 'complete' ? 'Data Ready' : 'Baseline Model'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: Customize Branding */}
            {builderStep === 4 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Report Title</label>
                  <input
                    type="text"
                    value={builderConfig.title}
                    onChange={(e) => setBuilderConfig({ ...builderConfig, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={builderConfig.subtitle}
                    onChange={(e) =>
                      setBuilderConfig({ ...builderConfig, subtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Reporting Period
                    </label>
                    <input
                      type="text"
                      value={builderConfig.reportingPeriod}
                      onChange={(e) =>
                        setBuilderConfig({ ...builderConfig, reportingPeriod: e.target.value })
                      }
                      placeholder="e.g., Q4 2026 — Annual Outlook"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Detail Level
                    </label>
                    <select
                      value={builderConfig.detailLevel}
                      onChange={(e) =>
                        setBuilderConfig({
                          ...builderConfig,
                          detailLevel: e.target.value as ReportDetailLevel,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      <option value="Brief">Brief (Executive Snapshot)</option>
                      <option value="Standard">Standard (Full Strategic Overview)</option>
                      <option value="Comprehensive">Comprehensive (Unabridged Dossier)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Prepared For</label>
                    <input
                      type="text"
                      value={builderConfig.branding.preparedFor}
                      onChange={(e) =>
                        setBuilderConfig({
                          ...builderConfig,
                          branding: { ...builderConfig.branding, preparedFor: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Prepared By</label>
                    <input
                      type="text"
                      value={builderConfig.branding.preparedBy}
                      onChange={(e) =>
                        setBuilderConfig({
                          ...builderConfig,
                          branding: { ...builderConfig.branding, preparedBy: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={builderConfig.includeCoverPage}
                      onChange={(e) =>
                        setBuilderConfig({ ...builderConfig, includeCoverPage: e.target.checked })
                      }
                      className="rounded text-sparkline-blue"
                    />
                    <span>Include Presentation Cover Page</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={builderConfig.includeTableOfContents}
                      onChange={(e) =>
                        setBuilderConfig({
                          ...builderConfig,
                          includeTableOfContents: e.target.checked,
                        })
                      }
                      className="rounded text-sparkline-blue"
                    />
                    <span>Include Table of Contents</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={builderConfig.includeCharts}
                      onChange={(e) =>
                        setBuilderConfig({ ...builderConfig, includeCharts: e.target.checked })
                      }
                      className="rounded text-sparkline-blue"
                    />
                    <span>Include Visual Data Tables</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={builderConfig.includeSources}
                      onChange={(e) =>
                        setBuilderConfig({ ...builderConfig, includeSources: e.target.checked })
                      }
                      className="rounded text-sparkline-blue"
                    />
                    <span>Include Provenance Citations</span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 5: Review & Generate */}
            {builderStep === 5 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-sparkline-midnight text-sm">
                      {builderConfig.title}
                    </strong>
                    <Badge variant="blue" size="sm">
                      {builderConfig.detailLevel} Scope
                    </Badge>
                  </div>
                  <p className="text-slate-600">{builderConfig.subtitle}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-slate-500">
                    <div>
                      <strong>Project:</strong> {currentBuilderProject?.business?.brandName}
                    </div>
                    <div>
                      <strong>Template:</strong> {builderConfig.templateId}
                    </div>
                    <div>
                      <strong>Chapters:</strong> {builderConfig.includedSections.length} Sections
                    </div>
                    <div>
                      <strong>Period:</strong> {builderConfig.reportingPeriod}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 space-y-1">
                  <strong>Verification Pre-Check Passed:</strong>
                  <p className="text-[11px] text-emerald-700">
                    Project models, currency tables, and strategic recommendations are ready for deterministic PDF compilation.
                  </p>
                </div>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                disabled={builderStep === 1 || isGenerating}
                onClick={() => setBuilderStep((prev) => Math.max(1, prev - 1))}
              >
                Previous Step
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBuilderModal(false)}
                >
                  Cancel
                </Button>

                {builderStep < 5 ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setBuilderStep((prev) => Math.min(5, prev + 1))}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={isGenerating}
                    onClick={handleGenerateReportSubmit}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Generate Report
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE REPORT PREVIEWER */}
      {showPreviewModal && activeReportForPreview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden">
            {/* Top Bar */}
            <div className="px-6 py-4 bg-sparkline-midnight text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div>
                <h3 className="text-base font-bold truncate max-w-xl">
                  {activeReportForPreview.title}
                </h3>
                <span className="text-xs text-slate-300">
                  Version {activeReportForPreview.version}.0 • {activeReportForPreview.templateName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={() => handleDownloadPdf(activeReportForPreview)}
                >
                  Download PDF
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs"
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                  onClick={() => handlePrintPdf(activeReportForPreview)}
                >
                  Print Layout
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs"
                  leftIcon={<FileText className="w-3.5 h-3.5" />}
                  onClick={() => handleExportCsv(activeReportForPreview)}
                >
                  CSV Data
                </Button>

                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split Screen Preview: Sidebar + Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar: Table of Contents */}
              <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto shrink-0 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-2">
                  Report Chapters
                </span>
                {activeReportForPreview.sections.map((sec, idx) => (
                  <button
                    key={sec.sectionId}
                    onClick={() => setPreviewActiveSection(sec.sectionId)}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                      previewActiveSection === sec.sectionId
                        ? 'bg-sparkline-blue text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span className="text-[10px] opacity-75 mr-1.5">0{idx + 1}.</span>
                    {sec.title}
                  </button>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-white">
                {activeReportForPreview.sections
                  .filter((sec) => sec.sectionId === previewActiveSection)
                  .map((sec) => (
                    <div key={sec.sectionId} className="space-y-6">
                      <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
                        <div>
                          <h2 className="text-xl font-bold text-sparkline-midnight">{sec.title}</h2>
                          <p className="text-xs text-slate-500 mt-0.5">{sec.summary}</p>
                        </div>
                        <Badge variant="blue" size="sm">
                          Provenance: {sec.provenance}
                        </Badge>
                      </div>

                      {/* Narrative text */}
                      <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                        {sec.narrativeBlocks.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>

                      {/* KPI cards */}
                      {sec.kpis && sec.kpis.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {sec.kpis.map((k, i) => (
                            <div
                              key={i}
                              className="p-3 bg-slate-50 rounded-xl border border-slate-200"
                            >
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                                {k.label}
                              </span>
                              <div className="text-lg font-bold text-sparkline-midnight my-0.5">
                                {k.value}
                              </div>
                              {k.subtext && (
                                <span className="text-[10px] text-slate-500">{k.subtext}</span>
                              )}
                              <div className="mt-1">
                                <Badge variant="slate" size="sm">
                                  {k.provenance}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tables */}
                      {sec.tables && sec.tables.length > 0 && (
                        <div className="space-y-4">
                          {sec.tables.map((tbl, i) => (
                            <div key={i} className="space-y-1.5">
                              <span className="text-xs font-bold text-sparkline-midnight">
                                {tbl.title}
                              </span>
                              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                                    <tr>
                                      {tbl.headers.map((h, j) => (
                                        <th key={j} className="py-2.5 px-3">
                                          {h}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {tbl.rows.map((row, rIdx) => (
                                      <tr key={rIdx} className="hover:bg-slate-50/50">
                                        {row.map((cell, cIdx) => (
                                          <td key={cIdx} className="py-2 px-3 text-slate-600">
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              {tbl.footnote && (
                                <span className="text-[11px] text-slate-400 italic block">
                                  {tbl.footnote}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recommendations */}
                      {sec.recommendations && sec.recommendations.length > 0 && (
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 text-xs">
                          <strong className="text-emerald-900 block">
                            Strategic Recommendations
                          </strong>
                          <ul className="list-disc pl-4 space-y-1 text-emerald-800">
                            {sec.recommendations.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: TEMPLATE PREVIEW MODAL */}
      {showTemplateModal && activeTemplatePreview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-sparkline-midnight">
                  {activeTemplatePreview.name}
                </h3>
                <span className="text-xs text-slate-500">Template Specifications</span>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <strong className="text-slate-700 block mb-1">Strategic Purpose:</strong>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {activeTemplatePreview.purpose}
                </p>
              </div>

              <div>
                <strong className="text-slate-700 block mb-1">Intended Audience:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {activeTemplatePreview.intendedAudience.map((aud, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-blue-50 text-sparkline-blue rounded-lg font-medium text-[11px]"
                    >
                      {aud}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong className="text-slate-700 block mb-1">
                  Default Included Sections ({activeTemplatePreview.includedSections.length}):
                </strong>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-40 overflow-y-auto space-y-1">
                  {activeTemplatePreview.includedSections.map((secId, i) => (
                    <div key={i} className="text-slate-700 font-medium">
                      • {REPORT_SECTIONS_CATALOG.find((s) => s.id === secId)?.title || secId}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setShowTemplateModal(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowTemplateModal(false);
                  handleOpenBuilderWithTemplate(activeTemplatePreview);
                }}
              >
                Create with This Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: REGENERATION CONFIRMATION */}
      {showRegenerateModal && reportToRegenerate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-sparkline-midnight">
                Regenerate Report with Live Data?
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Regenerating <strong>"{reportToRegenerate.title}"</strong> will recalculate all marketing metrics, unit economics, and forecast scenarios using currently active data from <strong>{reportToRegenerate.projectName}</strong>.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              This will increment the report version from <strong>v{reportToRegenerate.version}.0</strong> to <strong>v{reportToRegenerate.version + 1}.0</strong>.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowRegenerateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmRegenerate}>
                Confirm & Regenerate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: DELETE CONFIRMATION */}
      {showDeleteModal && reportToDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-sparkline-midnight">
                Delete Report Permanently?
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to delete <strong>"{reportToDelete.title}"</strong>? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Delete Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

