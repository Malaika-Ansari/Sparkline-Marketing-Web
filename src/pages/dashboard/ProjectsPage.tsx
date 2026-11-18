/**
 * Projects Command Center & Workspace Manager
 * Sparkline Marketing Intelligence Platform — Phase 21
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { projectService } from '@/services/project.service';
import { MarketingProject, ProjectStatus, ProjectProgressSummary } from '@/types/project';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/common/Feedback';
import {
  FolderKanban,
  Plus,
  ArrowRight,
  TrendingUp,
  Search,
  LayoutGrid,
  List,
  Copy,
  Edit3,
  Archive,
  RotateCcw,
  Trash2,
  AlertTriangle,
  Clock,
  X,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [industryFilter, setIndustryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'updated_desc' | 'created_desc' | 'name_asc' | 'budget_desc'>('updated_desc');

  // Modals state
  const [duplicateModalProject, setDuplicateModalProject] = useState<MarketingProject | null>(null);
  const [duplicateName, setDuplicateName] = useState('');
  const [deleteModalProject, setDeleteModalProject] = useState<MarketingProject | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');

  const loadProjects = () => {
    const list = projectService.getProjects(user?.id);
    setProjects(list);
  };

  useEffect(() => {
    loadProjects();
  }, [user?.id]);

  // Compute progress summaries for all projects
  const progressMap = useMemo(() => {
    const map: Record<string, ProjectProgressSummary> = {};
    for (const p of projects) {
      map[p.id] = projectService.computeProjectProgress(p);
    }
    return map;
  }, [projects]);

  // Unique industries
  const availableIndustries = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.business?.industry) set.add(p.business.industry);
    });
    return Array.from(set);
  }, [projects]);

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          searchQuery === '' ||
          p.business?.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.business?.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.business?.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === 'ALL' ||
          (statusFilter === 'Archived' ? p.status === 'Archived' : p.status === statusFilter);

        const matchesIndustry =
          industryFilter === 'ALL' || p.business?.industry === industryFilter;

        return matchesSearch && matchesStatus && matchesIndustry;
      })
      .sort((a, b) => {
        if (sortBy === 'updated_desc') {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        if (sortBy === 'created_desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'name_asc') {
          return a.business.brandName.localeCompare(b.business.brandName);
        }
        if (sortBy === 'budget_desc') {
          return (b.marketing?.monthlyBudget || 0) - (a.marketing?.monthlyBudget || 0);
        }
        return 0;
      });
  }, [projects, searchQuery, statusFilter, industryFilter, sortBy]);

  // Overview KPIs
  const totalCount = projects.length;
  const activeCount = projects.filter(
    (p) => p.status === 'Active' || p.status === 'In Strategy' || p.status === 'Active Flight'
  ).length;
  const draftCount = projects.filter((p) => p.status === 'Draft' || p.isDraft).length;
  const archivedCount = projects.filter((p) => p.status === 'Archived').length;

  // Actions
  const handleOpenDuplicateModal = (project: MarketingProject) => {
    setDuplicateModalProject(project);
    setDuplicateName(`${project.business.brandName} (Copy)`);
  };

  const handleConfirmDuplicate = () => {
    if (!duplicateModalProject) return;
    const duplicated = projectService.duplicateProject(
      duplicateModalProject.id,
      { newName: duplicateName },
      user?.id
    );
    if (duplicated) {
      addToast({
        title: 'Project Duplicated',
        message: `Created copy "${duplicated.business.brandName}" successfully.`,
        type: 'success',
      });
      loadProjects();
    }
    setDuplicateModalProject(null);
  };

  const handleArchive = (project: MarketingProject) => {
    if (project.status === 'Archived') {
      projectService.restoreProject(project.id);
      addToast({
        title: 'Project Restored',
        message: `Restored "${project.business.brandName}" to active status.`,
        type: 'success',
      });
    } else {
      projectService.archiveProject(project.id);
      addToast({
        title: 'Project Archived',
        message: `Archived "${project.business.brandName}". You can restore it anytime.`,
        type: 'info',
      });
    }
    loadProjects();
  };

  const handleConfirmDelete = () => {
    if (!deleteModalProject) return;
    projectService.deleteProject(deleteModalProject.id, user?.id);
    addToast({
      title: 'Project Permanently Deleted',
      message: `The project "${deleteModalProject.business.brandName}" and its local associations were removed.`,
      type: 'info',
    });
    setDeleteModalProject(null);
    setDeleteConfirmationInput('');
    loadProjects();
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Active':
      case 'Active Flight':
        return <Badge variant="cyan" size="sm">Active Flight</Badge>;
      case 'In Strategy':
      case 'Ready for Strategy':
        return <Badge variant="blue" size="sm">In Strategy</Badge>;
      case 'Draft':
        return <Badge variant="neutral" size="sm">Draft</Badge>;
      case 'On Hold':
        return <Badge variant="orange" size="sm">On Hold</Badge>;
      case 'Completed':
        return <Badge variant="purple" size="sm">Completed</Badge>;
      case 'Archived':
        return <Badge variant="slate" size="sm">Archived</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <SEO
        title="Marketing Projects Command Center | Sparkline Marketing"
        description="Manage your business marketing workspaces, product catalogs, strategy action plans, and budgets."
        noIndex={true}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/dashboard" className="hover:text-sparkline-blue font-medium">
          Dashboard
        </Link>
        <span>/</span>
        <span className="font-semibold text-sparkline-midnight">Projects Workspace</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-sparkline-blue text-xs font-bold mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Multi-Tenant Workspace Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight tracking-tight">
            Marketing Projects & Brand Workspaces
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Organize business profiles, target buyer personas, financial budget allocations, and performance forecasts across your client and company accounts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            to="/dashboard/projects/new"
            variant="gradient"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Project
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Workspaces
            </span>
            <FolderKanban className="w-4 h-4 text-sparkline-blue" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-sparkline-midnight mt-2">
            {totalCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active across tenant</span>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Flights
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
            {activeCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Running strategy or ads</span>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Drafts in Setup
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">
            {draftCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Pending full onboarding</span>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Archived Dossiers
            </span>
            <Archive className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-700 mt-2">
            {archivedCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Preserved cold storage</span>
        </Card>
      </div>

      {/* Control Bar: Search, Filters & View Toggle */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects by brand name, industry, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sparkline-blue focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sparkline-blue cursor-pointer"
            >
              <option value="ALL">All Statuses ({totalCount})</option>
              <option value="Active">Active</option>
              <option value="In Strategy">In Strategy</option>
              <option value="Active Flight">Active Flight</option>
              <option value="Draft">Draft</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived ({archivedCount})</option>
            </select>

            {/* Industry Filter */}
            {availableIndustries.length > 0 && (
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sparkline-blue cursor-pointer"
              >
                <option value="ALL">All Industries</option>
                {availableIndustries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            )}

            {/* Sort Control */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sparkline-blue cursor-pointer"
            >
              <option value="updated_desc">Sort: Recently Updated</option>
              <option value="created_desc">Sort: Newest Created</option>
              <option value="name_asc">Sort: Name (A-Z)</option>
              <option value="budget_desc">Sort: Monthly Budget</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-sparkline-midnight shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                aria-label="Grid card view"
                title="Grid card view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-sparkline-midnight shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                aria-label="Dense table view"
                title="Dense table view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Area */}
      {filteredProjects.length === 0 ? (
        /* Empty State */
        <Card className="p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-sparkline-blue flex items-center justify-center mx-auto mb-4 shadow-sm">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-sparkline-midnight">
            {projects.length === 0 ? 'No Marketing Projects Found' : 'No Matching Workspaces'}
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {projects.length === 0
              ? 'Get started by creating your first product or business workspace container. You can add pricing, competitors, and generate unified marketing strategies.'
              : 'Try clearing your search query or selecting a different status filter to view other projects.'}
          </p>
          <div className="pt-6 flex justify-center gap-3">
            {projects.length === 0 ? (
              <Button
                to="/dashboard/projects/new"
                variant="gradient"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create Your First Project
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setIndustryFilter('ALL');
                }}
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const progress = progressMap[project.id] || { overallPercentage: 0, completedModulesCount: 0, totalModulesCount: 12 };
            return (
              <Card
                key={project.id}
                className="p-5 flex flex-col justify-between hover:shadow-card-hover hover:border-blue-200 transition-all duration-200 relative group"
              >
                <div>
                  {/* Top Row: Industry & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate max-w-[150px]">
                      {project.business.industry}
                    </span>
                    {getStatusBadge(project.status)}
                  </div>

                  {/* Brand Title */}
                  <Link
                    to={`/dashboard/projects/${project.id}`}
                    className="block text-base font-bold text-sparkline-midnight hover:text-sparkline-blue transition-colors line-clamp-1"
                  >
                    {project.business.brandName}
                  </Link>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {project.business.description || 'No description provided.'}
                  </p>

                  {/* Progress Milestone Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 text-[11px]">Milestone Readiness</span>
                      <span className="font-bold text-slate-800">{progress.overallPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sparkline-blue to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${progress.overallPercentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {progress.completedModulesCount} of {progress.totalModulesCount} strategic modules completed
                    </span>
                  </div>

                  {/* Metadata Chips */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monthly Budget</span>
                      <span className="font-bold text-slate-800">
                        {project.marketing?.monthlyBudget
                          ? `$${project.marketing.monthlyBudget.toLocaleString()}`
                          : '$0'}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Offerings</span>
                      <span className="font-bold text-slate-800">
                        {project.products?.length || 0} Products/Services
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Quick Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenDuplicateModal(project)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Duplicate project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      to={`/dashboard/projects/new?edit=${project.id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Edit project parameters"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleArchive(project)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title={project.status === 'Archived' ? 'Restore project' : 'Archive project'}
                    >
                      {project.status === 'Archived' ? (
                        <RotateCcw className="w-3.5 h-3.5" />
                      ) : (
                        <Archive className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteModalProject(project);
                        setDeleteConfirmationInput('');
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      to={`/dashboard/projects/${project.id}`}
                      className="inline-flex items-center gap-1 pl-2 font-bold text-sparkline-blue hover:text-blue-800 transition-colors"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Dense Table View */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Brand Workspace</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Milestone Readiness</th>
                  <th className="py-3 px-4">Monthly Budget</th>
                  <th className="py-3 px-4">Products</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProjects.map((project) => {
                  const progress = progressMap[project.id] || { overallPercentage: 0, completedModulesCount: 0, totalModulesCount: 12 };
                  return (
                    <tr key={project.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          to={`/dashboard/projects/${project.id}`}
                          className="font-bold text-sparkline-midnight hover:text-sparkline-blue block"
                        >
                          {project.business.brandName}
                        </Link>
                        <span className="text-[11px] text-slate-400">{project.business.industry}</span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(project.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 max-w-[140px]">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sparkline-blue rounded-full"
                              style={{ width: `${progress.overallPercentage}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-700">
                            {progress.overallPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {project.marketing?.monthlyBudget
                          ? `$${project.marketing.monthlyBudget.toLocaleString()}`
                          : '$0'}
                      </td>
                      <td className="py-3 px-4">{project.products?.length || 0} Offerings</td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenDuplicateModal(project)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            to={`/dashboard/projects/new?edit=${project.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleArchive(project)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title={project.status === 'Archived' ? 'Restore' : 'Archive'}
                          >
                            {project.status === 'Archived' ? (
                              <RotateCcw className="w-3.5 h-3.5" />
                            ) : (
                              <Archive className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteModalProject(project);
                              setDeleteConfirmationInput('');
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <Button
                            to={`/dashboard/projects/${project.id}`}
                            variant="ghost"
                            size="sm"
                            className="text-sparkline-blue text-xs font-bold"
                          >
                            Open
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Duplicate Project Modal */}
      {duplicateModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-dropdown border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-sparkline-blue" />
                <h3 className="font-bold text-sparkline-midnight text-sm">Duplicate Workspace</h3>
              </div>
              <button
                type="button"
                onClick={() => setDuplicateModalProject(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Create an isolated copy of <strong className="text-slate-900">{duplicateModalProject.business.brandName}</strong>. 
              The new workspace will copy products, audience parameters, and budget structures with a clean status of <strong>Draft</strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Workspace Name
              </label>
              <input
                type="text"
                value={duplicateName}
                onChange={(e) => setDuplicateName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
                autoFocus
              />
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
              <span className="font-semibold block mb-0.5">Data Isolation Policy:</span>
              Historical live ad flight credentials, uploaded tokens, and telemetry will not be copied to maintain tenant safety.
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDuplicateModalProject(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="gradient"
                size="sm"
                onClick={handleConfirmDuplicate}
                disabled={!duplicateName.trim()}
              >
                Confirm Duplication
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Defensive Delete Confirmation Modal */}
      {deleteModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-dropdown border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 pb-3 border-b border-slate-100">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sparkline-midnight text-sm">Delete Marketing Workspace</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This action will permanently delete <strong className="text-slate-900">{deleteModalProject.business.brandName}</strong> and remove all associated local configurations.
            </p>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              <p className="font-semibold mb-1">Confirmation Required:</p>
              To confirm deletion, please type <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-rose-200 select-all">{deleteModalProject.business.brandName}</strong> below:
            </div>

            <input
              type="text"
              placeholder="Type brand name here to confirm..."
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              autoFocus
            />

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteModalProject(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 text-white"
                onClick={handleConfirmDelete}
                disabled={deleteConfirmationInput.trim() !== deleteModalProject.business.brandName.trim()}
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
