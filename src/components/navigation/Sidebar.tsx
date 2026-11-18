import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { sidebarNavGroups } from '@/config/navigation';
import {
  LayoutDashboard,
  Brain,
  Search,
  Users,
  Target,
  Compass,
  Calculator,
  Megaphone,
  Calendar,
  Share2,
  Sparkles,
  Globe,
  Coins,
  DollarSign,
  BarChart3,
  TrendingUp,
  FolderKanban,
  FileText,
  Boxes,
  Settings,
  ShieldCheck,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkle,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Brain,
  Search,
  Users,
  Target,
  Compass,
  Calculator,
  Megaphone,
  Calendar,
  Share2,
  Sparkles,
  Globe,
  Coins,
  DollarSign,
  BarChart3,
  TrendingUp,
  FolderKanban,
  FileText,
  Boxes,
  Settings,
  ShieldCheck,
  HelpCircle,
};

export const DashboardSidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  // Track open state for expandable groups
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Prevent background scrolling when mobile sidebar drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-sparkline-midnight/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 bg-sparkline-midnight border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out select-none',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'lg:w-20' : 'lg:w-72',
          'w-72'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 sm:h-20 px-4 sm:px-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <Logo variant="dark" to="/dashboard" collapsed={isCollapsed} />
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-sparkline-slate focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
            aria-label="Close sidebar navigation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Groups Scrollable Container */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
          {sidebarNavGroups.map((group) => {
            const isGroupCollapsed = !!collapsedGroups[group.id];

            return (
              <div key={group.id} className="space-y-1">
                {/* Group Header */}
                {!isCollapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
                    aria-expanded={!isGroupCollapsed}
                  >
                    <span>{group.title}</span>
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 text-slate-500 transition-transform duration-200',
                        isGroupCollapsed && '-rotate-90'
                      )}
                    />
                  </button>
                ) : (
                  <div className="w-8 h-px bg-white/10 mx-auto my-2" />
                )}

                {/* Group Items */}
                {(!isGroupCollapsed || isCollapsed) && (
                  <nav className="space-y-0.5">
                    {group.items.map((item) => {
                      const IconComponent = iconMap[item.icon] || Sparkle;

                      return (
                        <div key={item.id} className="relative group">
                          <NavLink
                            to={item.href}
                            end={item.href === '/dashboard'}
                            onClick={onClose}
                            className={({ isActive }) =>
                              cn(
                                'flex items-center rounded-xl text-xs font-medium transition-all group select-none relative',
                                isCollapsed
                                  ? 'justify-center p-3'
                                  : 'justify-between px-3 py-2',
                                isActive
                                  ? 'bg-sparkline-blue text-white shadow-sm font-semibold'
                                  : 'text-slate-400 hover:text-white hover:bg-sparkline-slate/60'
                              )
                            }
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <IconComponent className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                              {!isCollapsed && (
                                <span className="truncate">{item.title}</span>
                              )}
                            </div>

                            {!isCollapsed && item.badge && (
                              <span
                                className={cn(
                                  'text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-md uppercase shrink-0',
                                  item.badge === 'AI Core'
                                    ? 'bg-sparkline-magenta/20 text-pink-300 border border-sparkline-magenta/40'
                                    : 'bg-sparkline-cyan/20 text-cyan-300 border border-sparkline-cyan/30'
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                          </NavLink>

                          {/* Collapsed Rail Tooltip */}
                          {isCollapsed && (
                            <div className="hidden lg:group-hover:flex absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 items-center gap-2 px-3 py-1.5 rounded-xl bg-sparkline-slate text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-white/10 pointer-events-none animate-in fade-in-50 zoom-in-95 duration-150">
                              <span>{item.title}</span>
                              {item.badge && (
                                <span className="text-[10px] px-1 py-0.2 rounded bg-sparkline-magenta/30 text-pink-200">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </nav>
                )}
              </div>
            );
          })}
        </div>

        {/* Small Upgrade Plan Banner (Without Payment Execution) */}
        {!isCollapsed ? (
          <div className="p-3 mx-3 mb-2 rounded-2xl bg-gradient-to-br from-sparkline-slate to-sparkline-midnight border border-white/10 shrink-0">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sparkline-blue/20 text-sparkline-cyan flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Sparkline Pro</span>
                  <span className="text-[10px] font-semibold text-sparkline-orange uppercase tracking-wider">
                    Upgrade
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                  Unlock unlimited AI strategies, multi-currency models & live integrations.
                </p>
                <Link
                  to="/pricing"
                  onClick={onClose}
                  className="mt-2 inline-flex items-center justify-center w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-sparkline-blue text-white hover:bg-blue-600 transition-colors shadow-sm"
                >
                  View Plan Options
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2 mb-2 flex justify-center shrink-0">
            <Link
              to="/pricing"
              className="group relative p-2.5 rounded-xl bg-sparkline-blue/20 text-sparkline-cyan hover:bg-sparkline-blue hover:text-white transition-colors"
              aria-label="Upgrade to Pro"
            >
              <Zap className="w-4 h-4" />
              <div className="hidden lg:group-hover:flex absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 items-center px-3 py-1.5 rounded-xl bg-sparkline-slate text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-white/10 pointer-events-none">
                Upgrade to Pro
              </div>
            </Link>
          </div>
        )}

        {/* Desktop Collapse / Expand Toggle Control */}
        <div className="p-3 border-t border-white/10 bg-sparkline-slate/30 shrink-0 flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 text-[11px] text-slate-400 px-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-sparkline-cyan animate-pulse" />
              <span>Prompt 04 Ready</span>
            </div>
          ) : (
            <div className="mx-auto">
              <span className="w-2 h-2 rounded-full bg-sparkline-cyan inline-block animate-pulse" />
            </div>
          )}

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={cn(
                'hidden lg:flex p-2 rounded-xl text-slate-400 hover:text-white hover:bg-sparkline-slate transition-colors focus:outline-none focus:ring-2 focus:ring-sparkline-blue',
                isCollapsed && 'mx-auto'
              )}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export const Sidebar = DashboardSidebar;
