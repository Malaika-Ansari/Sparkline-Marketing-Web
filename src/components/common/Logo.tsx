import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  collapsed?: boolean;
  to?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  variant = 'light',
  collapsed = false,
  to = '/',
}) => {
  const content = (
    <div className={cn('flex items-center gap-2.5 select-none group', className)}>
      {/* Sparkline Mark */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-sparkline-midnight border border-sparkline-slate shadow-subtle group-hover:border-sparkline-blue/40 transition-all duration-300">
        <svg
          viewBox="0 0 40 40"
          className="w-6 h-6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="logoSparkGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#0C65F4" />
              <stop offset="50%" stop-color="#593090" />
              <stop offset="100%" stop-color="#C52B85" />
            </linearGradient>
            <linearGradient id="logoAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0C65F4" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#0C65F4" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 6 28 L 14 20 L 20 24 L 28 12 L 34 8 L 34 32 L 6 32 Z"
            fill="url(#logoAreaGrad)"
          />
          <path
            d="M 6 28 L 14 20 L 20 24 L 28 12 L 34 8"
            stroke="url(#logoSparkGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6" cy="28" r="1.5" fill="#2292D9" />
          <circle cx="14" cy="20" r="1.5" fill="#0C65F4" />
          <circle cx="20" cy="24" r="1.5" fill="#593090" />
          <circle cx="28" cy="12" r="1.5" fill="#C52B85" />
          <circle cx="34" cy="8" r="2" fill="#E37C33" stroke="#FFFFFF" strokeWidth="0.8" />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <span
            className={cn(
              'font-display font-bold text-lg tracking-tight leading-none',
              variant === 'light' ? 'text-sparkline-midnight' : 'text-white'
            )}
          >
            Sparkline
          </span>
          <span
            className={cn(
              'text-[10px] uppercase font-semibold tracking-widest mt-0.5',
              variant === 'light' ? 'text-sparkline-slate/70' : 'text-sparkline-cyan'
            )}
          >
            Marketing
          </span>
        </div>
      )}
    </div>
  );

  return <Link to={to} className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-sparkline-blue rounded-lg">{content}</Link>;
};

