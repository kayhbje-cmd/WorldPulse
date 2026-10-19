import React from 'react';
import { Newspaper, Search, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  searchQuery?: string;
  categoryName?: string;
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, categoryName, onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#11141c] border border-white/5 rounded-2xl my-8">
      <div className="w-16 h-16 rounded-full bg-[#181d28] flex items-center justify-center mb-4 border border-white/10 text-[#d4af37]">
        {searchQuery ? <Search className="w-8 h-8" /> : <Newspaper className="w-8 h-8" />}
      </div>

      <h3 className="text-xl font-serif text-white mb-2">
        {searchQuery ? `No dispatches found for "${searchQuery}"` : `No articles available in ${categoryName || 'this section'}`}
      </h3>

      <p className="text-slate-400 max-w-md text-sm mb-6 leading-relaxed">
        {searchQuery
          ? 'Check your spelling or try broader search terms such as "economy", "technology", "diplomacy", or "space".'
          : 'Our international wire monitors have not received dispatches for this specific category in the current cycle.'}
      </p>

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#d4af37] hover:bg-[#e5c07b] text-neutral-950 font-semibold rounded-lg text-sm transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#d4af37]/10"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Return to Top Stories</span>
      </button>
    </div>
  );
};
