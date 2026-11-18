import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCheck,
  Trash2,
  Inbox,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'strategy' | 'growth' | 'warning';
}

const sampleNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'ROAS Milestone Exceeded',
    description: 'Blended ROAS reached 4.85x on Google Search campaigns.',
    time: '12m ago',
    read: false,
    type: 'growth',
  },
  {
    id: 'n-2',
    title: 'Ad Frequency Warning',
    description: 'Meta vertical video set reached 3.8x frequency threshold.',
    time: '2h ago',
    read: false,
    type: 'warning',
  },
  {
    id: 'n-3',
    title: 'Competitor Intelligence Updated',
    description: 'New keyword bid opportunities detected in B2B MarTech.',
    time: '5h ago',
    read: true,
    type: 'strategy',
  },
];

export const NotificationMenu: React.FC<{ className?: string }> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(sampleNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayedNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetNotifications = () => {
    setNotifications(sampleNotifications);
  };

  const icons = {
    growth: <TrendingUp className="w-4 h-4 text-emerald-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-sparkline-orange" />,
    strategy: <Sparkles className="w-4 h-4 text-sparkline-blue" />,
  };

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-sparkline-midnight hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sparkline-blue"
        aria-label={`View notifications, ${unreadCount} unread`}
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-sparkline-orange border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Notifications Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm rounded-2xl bg-white border border-slate-200 shadow-dropdown py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sparkline-midnight">Notifications</span>
              {unreadCount > 0 ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-400">All caught up</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-sparkline-blue hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-md"
                  title="Clear all notifications"
                  aria-label="Clear all notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-medium transition-colors text-[11px]',
                  filter === 'all'
                    ? 'bg-slate-100 text-sparkline-midnight font-bold'
                    : 'text-slate-500 hover:text-sparkline-midnight'
                )}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-medium transition-colors text-[11px]',
                  filter === 'unread'
                    ? 'bg-blue-50 text-sparkline-blue font-bold'
                    : 'text-slate-500 hover:text-sparkline-midnight'
                )}
              >
                Unread ({unreadCount})
              </button>
            </div>
          )}

          {/* Notifications List or Empty State */}
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {displayedNotifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                  <Inbox className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-sparkline-midnight">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 max-w-[200px]">
                  {filter === 'unread'
                    ? 'All alerts have been reviewed.'
                    : 'You have cleared all alerts and intelligence updates.'}
                </p>
                {notifications.length === 0 && (
                  <button
                    type="button"
                    onClick={resetNotifications}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-sparkline-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Restore Sample Notifications</span>
                  </button>
                )}
              </div>
            ) : (
              displayedNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={cn(
                    'p-3.5 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors',
                    !item.read && 'bg-blue-50/30'
                  )}
                >
                  <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                    {icons[item.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-xs font-bold text-sparkline-midnight truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-sparkline-blue shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
