import React, { useEffect } from 'react';
import { Logo } from '@/components/common/Logo';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  variant?: 'light' | 'dark';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  title,
  variant = 'light',
  children,
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] lg:hidden animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-sparkline-midnight/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 w-full max-w-xs shadow-modal flex flex-col z-10 transition-transform duration-300 animate-in slide-in-from-left duration-200',
          variant === 'dark' ? 'bg-sparkline-midnight text-white' : 'bg-white text-sparkline-midnight'
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'h-20 px-6 flex items-center justify-between border-b shrink-0',
            variant === 'dark' ? 'border-white/10' : 'border-slate-100'
          )}
        >
          {title ? (
            <span className="font-bold text-sm tracking-tight">{title}</span>
          ) : (
            <Logo variant={variant} />
          )}
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-2 rounded-xl transition-colors',
              variant === 'dark'
                ? 'text-slate-400 hover:text-white hover:bg-sparkline-slate'
                : 'text-slate-500 hover:text-sparkline-midnight hover:bg-slate-100'
            )}
            aria-label="Close navigation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={cn(
              'p-4 border-t shrink-0',
              variant === 'dark' ? 'border-white/10 bg-sparkline-slate/30' : 'border-slate-100 bg-slate-50'
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

