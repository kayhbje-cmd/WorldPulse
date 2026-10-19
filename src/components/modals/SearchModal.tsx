import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { Article } from '../../types/news';
import { formatRelativeTime } from '../../utils/date';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchSubmit: (query: string) => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

const POPULAR_SEARCHES = [
  'Artificial Intelligence',
  'India Economy',
  'Central Banks & Inflation',
  'Space Exploration',
  'Semiconductors',
  'Global Diplomacy',
  'Renewable Energy',
  'Cricket Championship',
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSearchSubmit,
  articles,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase()) ||
          a.source.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectQuery = (term: string) => {
    setQuery(term);
    onSearchSubmit(term);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query.trim());
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search WorldPulse news wire"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20 animate-in fade-in duration-200"
    >
      <div className="bg-[#11141c] border border-white/10 rounded-2xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl shadow-black text-slate-100">
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 bg-[#151924]">
          <Search className="w-5 h-5 text-[#d4af37] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search headlines, topics, countries, or sources..."
            aria-label="Search input"
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search input"
              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search modal"
            className="px-2.5 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded text-slate-300 cursor-pointer"
          >
            Esc
          </button>
        </form>

        {/* Content Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {query.trim() ? (
            <div>
              <div className="text-xs uppercase font-bold text-[#d4af37] tracking-wider mb-3 flex items-center justify-between">
                <span>Matching Dispatches ({filtered.length})</span>
                <button
                  onClick={handleSubmit}
                  className="text-[11px] text-[#f5e6a3] hover:underline cursor-pointer"
                >
                  Apply Filter to Grid &rarr;
                </button>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No headlines match &quot;{query}&quot;. Press Enter to query the live international wire.
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.slice(0, 6).map((art) => (
                    <div
                      key={art.id}
                      onClick={() => {
                        onSelectArticle(art);
                        onClose();
                      }}
                      className="p-3 bg-[#141822] hover:bg-[#181e2b] border border-white/5 hover:border-[#d4af37]/30 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                        <span className="text-[#d4af37] font-semibold uppercase">{art.category}</span>
                        <span>•</span>
                        <span className="text-slate-300">{art.source.name}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(art.publishedAt)}</span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-white line-clamp-1">{art.title}</h4>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="text-xs uppercase font-bold text-[#d4af37] tracking-wider mb-3 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trending Global Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelectQuery(term)}
                    className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
