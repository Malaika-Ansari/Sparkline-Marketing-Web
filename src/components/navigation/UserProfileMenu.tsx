import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Check,
  HelpCircle,
  FolderKanban,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/common/Feedback';
import { useAuth } from '@/context/AuthContext';

export interface UserProfileMenuProps {
  userName?: string;
  userEmail?: string;
  workspaceName?: string;
  avatarInitials?: string;
  className?: string;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user, signOut, providerStatus } = useAuth();

  const displayName = user?.fullName || 'Alex Morgan';
  const displayEmail = user?.email || 'alex.morgan@sparkline.ai';
  const displayWorkspace = user?.companyName || 'Sparkline Growth Labs';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Close when clicked outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    addToast({
      title: 'Signed Out',
      message: 'You have been safely signed out of your account.',
      type: 'info',
    });
    navigate('/login');
  };

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account menu"
      >
        <div className="w-8 h-8 rounded-full bg-sparkline-midnight text-white flex items-center justify-center font-bold text-xs shadow-inner">
          {initials}
        </div>
        <div className="hidden lg:block text-left">
          <div className="text-xs font-semibold text-sparkline-midnight leading-tight">
            {displayName}
          </div>
          <div className="text-[10px] text-slate-400 font-medium truncate max-w-[130px]">
            {displayWorkspace}
          </div>
        </div>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-slate-400 transition-transform duration-200 hidden sm:block',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-64 max-w-xs rounded-2xl bg-white border border-slate-200 shadow-dropdown py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header Info */}
          <div className="px-4 py-2.5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sparkline-midnight">{displayName}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                {providerStatus.isCloudConnected ? 'Cloud' : 'Local'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 truncate mt-0.5">{displayEmail}</div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-sparkline-midnight bg-slate-100 px-2 py-1 rounded-lg">
              <Check className="w-3 h-3 text-sparkline-blue" />
              <span className="truncate">{displayWorkspace}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="py-1">
            <Link
              to="/dashboard/settings/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-sparkline-blue transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Account Profile & Settings</span>
            </Link>

            <Link
              to="/dashboard/projects"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-sparkline-blue transition-colors"
            >
              <FolderKanban className="w-4 h-4 text-slate-400" />
              <span>Marketing Workspaces</span>
            </Link>

            <Link
              to="/dashboard/settings/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-sparkline-blue transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Security & Password</span>
            </Link>

            <Link
              to="/dashboard/help"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-sparkline-blue transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-purple-500" />
              <span>Support & Academy</span>
            </Link>
          </div>

          {/* Sign Out Button */}
          <div className="pt-1 mt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
