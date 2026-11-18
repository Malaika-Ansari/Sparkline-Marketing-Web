import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { publicNavItems } from '@/config/navigation';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDropdownToggle = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo variant="light" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={cn(
                'px-3.5 py-2 text-sm font-medium rounded-lg transition-colors',
                location.pathname === '/'
                  ? 'text-sparkline-blue bg-blue-50/60 font-semibold'
                  : 'text-sparkline-slate hover:text-sparkline-midnight hover:bg-slate-50'
              )}
            >
              Home
            </Link>

            {publicNavItems.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isActive = location.pathname.startsWith(item.href);

              if (hasChildren) {
                return (
                  <div
                    key={item.title}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.title)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      type="button"
                      onClick={() => handleDropdownToggle(item.title)}
                      className={cn(
                        'flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors',
                        isActive
                          ? 'text-sparkline-blue bg-blue-50/60 font-semibold'
                          : 'text-sparkline-slate hover:text-sparkline-midnight hover:bg-slate-50'
                      )}
                      aria-expanded={activeDropdown === item.title}
                    >
                      <span>{item.title}</span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          activeDropdown === item.title && 'rotate-180 text-sparkline-blue'
                        )}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === item.title && (
                      <div className="absolute left-0 mt-1 w-72 rounded-2xl bg-white border border-slate-200/90 shadow-premium p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {item.children?.map((child) => (
                          <Link
                            key={child.title}
                            to={child.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                          >
                            <div className="text-sm font-semibold text-sparkline-midnight group-hover:text-sparkline-blue transition-colors">
                              {child.title}
                            </div>
                            {child.description && (
                              <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                {child.description}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className={cn(
                    'px-3.5 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'text-sparkline-blue bg-blue-50/60 font-semibold'
                      : 'text-sparkline-slate hover:text-sparkline-midnight hover:bg-slate-50'
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Button
                  to="/dashboard"
                  variant="outline"
                  size="sm"
                  className="font-semibold text-sparkline-midnight"
                >
                  Dashboard
                </Button>
                <Button
                  to="/dashboard/projects"
                  variant="gradient"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  My Workspaces
                </Button>
              </>
            ) : (
              <>
                <Button
                  to="/login"
                  variant="ghost"
                  size="sm"
                  className="text-sparkline-slate font-medium"
                >
                  Log In
                </Button>
                <Button
                  to="/signup"
                  variant="gradient"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Get Started Free
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-sparkline-slate hover:text-sparkline-midnight hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="public-mobile-nav"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="public-mobile-nav"
          className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg"
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-sparkline-midnight hover:bg-slate-50"
          >
            Home
          </Link>
          {publicNavItems.map((item) => (
            <div key={item.title} className="py-1">
              <Link
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-sparkline-midnight hover:bg-slate-50"
              >
                {item.title}
              </Link>
              {item.children && (
                <div className="pl-4 mt-1 space-y-1">
                  {item.children.map((sub) => (
                    <Link
                      key={sub.title}
                      to={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-1.5 text-sm text-slate-600 hover:text-sparkline-blue"
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  to="/dashboard"
                  variant="outline"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Button>
                <Button
                  to="/dashboard/projects"
                  variant="gradient"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Workspaces
                </Button>
              </>
            ) : (
              <>
                <Button
                  to="/login"
                  variant="outline"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Button>
                <Button
                  to="/signup"
                  variant="gradient"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started Free
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

