import React from 'react';
import { RefreshCw, Radio, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatRelativeTime } from '../../utils/date';
import { NewsFeedStatus } from '../../types/news';

interface StatusBadgeProps {
  status: NewsFeedStatus;
  isLoading: boolean;
  onRefresh: () => void;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isLoading, onRefresh }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[#11141c]/90 border border-white/10 rounded-lg text-xs backdrop-blur-md">
      <div className="flex items-center gap-2">
        {status.isLive ? (
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        ) : (
          <span className="relative flex h-2.5 w-2.5">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d4af37]"></span>
          </span>
        )}

        <div className="flex items-center gap-1.5 font-medium">
          <span className={status.isLive ? 'text-emerald-400' : 'text-[#e5c07b]'}>
            {status.isLive ? 'LIVE WIRE' : 'AUTHENTICATED ARCHIVE'}
          </span>
          <span className="text-white/30">•</span>
          <span className="text-slate-300 hidden sm:inline">{status.sourceLabel}</span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-slate-400">
            {isLoading ? 'Synchronizing...' : `Updated ${formatRelativeTime(status.lastUpdated.toISOString())}`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-slate-400 hidden md:inline">
          <strong className="text-white font-semibold">{status.itemCount}</strong> dispatches loaded
        </span>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh latest news wire"
          className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 active:scale-95 text-slate-200 hover:text-white border border-white/10 hover:border-[#d4af37]/40 rounded transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#d4af37] ${isLoading ? 'animate-spin' : ''}`} />
          <span className="font-medium text-[11px] tracking-wider uppercase">Refresh</span>
        </button>
      </div>
    </div>
  );
};
