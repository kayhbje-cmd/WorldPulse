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
    <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 px-3 sm:px-5 py-2.5 bg-[#11141c]/95 border border-white/10 rounded-xl text-xs backdrop-blur-md shadow-lg shadow-black/40">
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        {status.isLive ? (
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        ) : (
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d4af37]"></span>
          </span>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 font-medium min-w-0">
          <span
            className={`font-bold tracking-wider text-[10px] sm:text-[11px] uppercase shrink-0 ${
              status.isLive ? 'text-emerald-400' : 'text-[#f5e6a3]'
            }`}
          >
            {status.isLive ? 'LIVE WIRE' : 'ARCHIVE SNAPSHOT'}
          </span>
          <span className="text-white/20 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline truncate max-w-xs">{status.sourceLabel}</span>
          <span className="text-white/20">•</span>
          <span className="text-slate-400 font-mono text-[10px] sm:text-[11px] truncate">
            {isLoading ? 'Synchronizing wire...' : `Synced ${formatRelativeTime(status.lastUpdated.toISOString())}`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-auto sm:ml-0">
        <span className="text-slate-400 hidden md:inline text-[11px]">
          <strong className="text-white font-semibold">{status.itemCount}</strong> active dispatches
        </span>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Refresh latest news wire"
          title="Refresh latest news wire"
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 active:scale-95 text-slate-200 hover:text-white border border-white/10 hover:border-[#d4af37]/45 rounded-lg transition-all cursor-pointer disabled:opacity-50 text-[11px] font-semibold tracking-wider uppercase min-h-[34px]"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#d4af37] ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};
