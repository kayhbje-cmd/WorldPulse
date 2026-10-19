import React from 'react';
import { AlertTriangle, RefreshCw, Archive } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
  onUseFallback?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, onUseFallback }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-[#151922] border border-amber-500/20 rounded-2xl my-8">
      <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 text-[#d4af37]">
        <AlertTriangle className="w-7 h-7 text-[#d4af37]" />
      </div>

      <h3 className="text-xl font-serif text-white mb-2">Live News Wire Connectivity Disrupted</h3>

      <p className="text-slate-300 max-w-lg text-sm mb-6 leading-relaxed">
        {message ||
          'Unable to establish a secure link to international news feeds. This may occur during network interruptions or upstream rate restrictions.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#d4af37] hover:bg-[#e5c07b] text-neutral-950 font-semibold rounded-lg text-sm transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#d4af37]/10"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>

        {onUseFallback && (
          <button
            onClick={onUseFallback}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-lg text-sm transition-all active:scale-95 cursor-pointer"
          >
            <Archive className="w-4 h-4 text-[#d4af37]" />
            <span>Load Verified Offline Archive</span>
          </button>
        )}
      </div>
    </div>
  );
};
