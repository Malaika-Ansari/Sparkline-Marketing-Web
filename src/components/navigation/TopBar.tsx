import React from 'react';
import { Menu, PanelLeftClose, PanelLeftOpen, ExternalLink, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { GlobalSearch } from '@/components/navigation/GlobalSearch';
import { NotificationMenu } from '@/components/navigation/NotificationMenu';
import { UserProfileMenu } from '@/components/navigation/UserProfileMenu';
import { HelpMenu } from '@/components/navigation/HelpMenu';
import { Breadcrumbs, BreadcrumbItem } from '@/components/common/Breadcrumbs';
import { sidebarNavGroups } from '@/config/navigation';

interface TopBarProps {
  onMenuClick?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onMenuClick,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Compute dynamic breadcrumbs from current route path
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (currentPath === '/dashboard') {
      return [{ label: 'Overview' }];
    }

    for (const group of sidebarNavGroups) {
      for (const item of group.items) {
        if (item.href === currentPath) {
          return [
            { label: group.title.charAt(0) + group.title.slice(1).toLowerCase() },
            { label: item.title, href: item.href },
          ];
        }
      }
    }

    // Default fallback based on segment
    const segments = currentPath.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (segments.length > 1 && lastSegment) {
      const cleanName = lastSegment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return [{ label: cleanName }];
    }

    return [{ label: 'Overview' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
      {/* Left Area: Sidebar Toggles & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-sparkline-slate hover:text-sparkline-midnight hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 rounded-xl text-slate-400 hover:text-sparkline-midnight hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Dynamic Route Breadcrumbs */}
        <div className="hidden md:flex items-center">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {/* Center Area: Global Search Command Palette */}
      <div className="flex-1 max-w-xs sm:max-w-md lg:max-w-lg mx-1 sm:mx-4">
        <GlobalSearch />
      </div>

      {/* Right Area: Actions, Notifications, Help & Profile */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Public Website Preview Link */}
        <Link
          to="/"
          className="hidden xl:inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-sparkline-blue font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          title="Open Public Marketing Site"
        >
          <span>Website</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* Quick Strategy Action Button */}
        <Link
          to="/dashboard/strategist"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sparkline-blue text-white hover:bg-blue-600 shadow-sm transition-all select-none focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Strategy</span>
        </Link>

        {/* Help & Support Menu Popover */}
        <HelpMenu />

        {/* Reusable Notification Popover Menu */}
        <NotificationMenu />

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* User Profile Dropdown Menu */}
        <UserProfileMenu />
      </div>
    </header>
  );
};
