import React, { useEffect } from 'react';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { Article } from '../../types/news';
import { formatRelativeTime } from '../../utils/date';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onSelectArticle,
  onRemoveBookmark,
  onClearAll,
}) => {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Saved Articles Drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#11141c] border-l border-white/10 text-slate-100 flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-serif text-lg font-bold text-white">Saved Reading List</h3>
              <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f5e6a3] text-xs font-mono font-bold">
                {savedArticles.length}
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close saved articles drawer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {savedArticles.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#d4af37]">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-base font-bold text-white">No Saved Articles</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Click the bookmark icon on any headline or story card to build your private reading registry.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedArticles.map((article) => (
                  <div
                    key={article.id}
                    className="p-4 bg-[#141822] hover:bg-[#181e2b] border border-white/5 hover:border-[#d4af37]/30 rounded-xl transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-[#d4af37] uppercase">{article.category}</span>
                      <span>{formatRelativeTime(article.publishedAt)}</span>
                    </div>

                    <h4
                      onClick={() => {
                        onSelectArticle(article);
                        onClose();
                      }}
                      className="font-serif text-sm font-bold text-white hover:text-[#f5e6a3] cursor-pointer line-clamp-2 leading-snug"
                    >
                      {article.title}
                    </h4>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                      <span className="text-slate-400 text-[11px] truncate">{article.source.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onSelectArticle(article);
                            onClose();
                          }}
                          className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Read</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onRemoveBookmark(article.id)}
                          aria-label={`Remove ${article.title} from bookmarks`}
                          title="Remove bookmark"
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {savedArticles.length > 0 && (
            <div className="p-4 border-t border-white/10 bg-[#0d0f15] flex items-center justify-between">
              <button
                onClick={onClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
              >
                Clear All Saved
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
