import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  BookOpen,
  Headphones,
  ShieldCheck,
  Command,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HelpMenuProps {
  className?: string;
}

export const HelpMenu: React.FC<HelpMenuProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-slate-500 hover:text-sparkline-midnight hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
        aria-label="Help and resources menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* Help Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-80 max-w-sm rounded-2xl bg-white border border-slate-200 shadow-dropdown py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-sparkline-midnight block">
                Platform Help & Guides
              </span>
              <span className="text-[10px] text-slate-500">Sparkline Intelligence Suite</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Operational</span>
            </div>
          </div>

          {/* Quick Resource Links */}
          <div className="py-2 px-2 space-y-1">
            <Link
              to="/marketing-academy"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 hover:text-sparkline-blue transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-sparkline-blue flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sparkline-midnight group-hover:text-sparkline-blue">
                    Marketing Academy
                  </div>
                  <div className="text-[10px] text-slate-500">10 disciplines & frameworks</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sparkline-blue" />
            </Link>

            <Link
              to="/dashboard/help"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 hover:text-sparkline-blue transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-sparkline-purple flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sparkline-midnight group-hover:text-sparkline-blue">
                    Help & Support Hub
                  </div>
                  <div className="text-[10px] text-slate-500">Guides, FAQs & ticket support</div>
                </div>
              </div>
            </Link>

            <Link
              to="/dashboard/security"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 hover:text-sparkline-blue transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sparkline-midnight group-hover:text-sparkline-blue">
                    Security Center
                  </div>
                  <div className="text-[10px] text-slate-500">Privacy & tenant isolation</div>
                </div>
              </div>
            </Link>
          </div>

          {/* Keyboard Shortcuts Section */}
          <div className="mx-3 mt-1 pt-2.5 border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <Command className="w-3 h-3" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>Open Global Search</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono">
                  ⌘K / Ctrl+K
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Close Popovers / Modals</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono">
                  Esc
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

