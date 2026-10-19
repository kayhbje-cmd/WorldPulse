import React from 'react';
import { Bookmark, Share2, Clock, ExternalLink, ArrowRight } from 'lucide-react';
import { Article, ViewMode } from '../../types/news';
import { formatRelativeTime } from '../../utils/date';

interface NewsCardProps {
  article: Article;
  viewMode?: ViewMode;
  onSelect: (article: Article) => void;
  onToggleBookmark: (id: string) => void;
  isBookmarked: boolean;
  onShare: (article: Article) => void;
}

const DEFAULT_EDITORIAL_FALLBACK =
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  viewMode = 'grid',
  onSelect,
  onToggleBookmark,
  isBookmarked,
  onShare,
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = DEFAULT_EDITORIAL_FALLBACK;
  };

  // COMPACT VIEW MODE
  if (viewMode === 'compact') {
    return (
      <article
        onClick={() => onSelect(article)}
        className="group flex items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 bg-[#11141c] hover:bg-[#161a24] border border-white/5 hover:border-[#d4af37]/30 rounded-xl transition-all duration-200 cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400 mb-1">
            <span className="font-semibold text-[#d4af37] uppercase">{article.category}</span>
            <span>•</span>
            <span className="text-slate-300 font-medium truncate max-w-[100px] xs:max-w-none">{article.source.name}</span>
            <span className="hidden xs:inline">•</span>
            <span className="hidden xs:inline">{formatRelativeTime(article.publishedAt)}</span>
          </div>

          <h3 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-[#d4af37] transition-colors truncate">
            {article.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {article.url && article.url !== '#' && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open original article on ${article.source.name}`}
              title="Open original wire"
              className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-[#d4af37] hover:bg-white/5 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={() => onToggleBookmark(article.id)}
            aria-label={isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
            className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isBookmarked ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            onClick={() => onShare(article)}
            aria-label="Share article"
            title="Share article"
            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </article>
    );
  }

  // MAGAZINE VIEW MODE (Horizontal split)
  if (viewMode === 'magazine') {
    return (
      <article
        onClick={() => onSelect(article)}
        className="group grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 bg-[#11141c] hover:bg-[#161a24] border border-white/5 hover:border-[#d4af37]/40 rounded-2xl p-4 sm:p-6 transition-all duration-300 cursor-pointer shadow-lg shadow-black/40"
      >
        <div className="md:col-span-5 relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-900">
          <img
            src={article.imageUrl}
            alt={article.title}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-0.5 rounded bg-[#d4af37] text-neutral-950 font-bold text-[10px] uppercase tracking-wider shadow">
              {article.category}
            </span>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400 mb-2">
              <span className="text-slate-200 font-semibold">{article.source.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#d4af37]" />
                {formatRelativeTime(article.publishedAt)}
              </span>
              <span>•</span>
              <span>{article.readingTime} min read</span>
            </div>

            <h3 className="font-serif text-lg sm:text-2xl font-bold text-white group-hover:text-[#f5e6a3] transition-colors leading-snug mb-2.5 sm:mb-3 break-words">
              {article.title}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3 font-light mb-4">
              {article.description}
            </p>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => onSelect(article)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4af37] hover:text-[#f5e6a3] transition-colors cursor-pointer"
              >
                <span>Read Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {article.url && article.url !== '#' && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <span>Original Wire</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onToggleBookmark(article.id)}
                aria-label={isBookmarked ? 'Remove Bookmark' : 'Save article'}
                className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={() => onShare(article)}
                aria-label="Share article"
                className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // STANDARD EDITORIAL GRID VIEW (Default)
  return (
    <article
      onClick={() => onSelect(article)}
      className="editorial-card group bg-[#11141c] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer h-full hover:border-[#d4af37]/45 transition-all duration-300 shadow-xl shadow-black/40"
    >
      <div className="flex-1 flex flex-col">
        {/* Thumbnail with uniform aspect ratio & overlay badge */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#181d28] shrink-0">
          <img
            src={article.imageUrl}
            alt={article.title}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11141c] via-transparent to-transparent opacity-85 pointer-events-none" />

          {/* Category Pill */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
            <span className="px-2.5 py-1 rounded-md bg-[#d4af37] text-neutral-950 font-bold text-[10px] uppercase tracking-wider shadow-md shadow-black/50">
              {article.category}
            </span>
          </div>

          {/* Bottom Bar on Thumbnail */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 z-10">
            <span className="font-semibold text-white bg-black/75 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-[10px]">
              {article.source.name}
            </span>
            <span className="bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-slate-300 font-mono text-[10px] border border-white/5">
              {formatRelativeTime(article.publishedAt)}
            </span>
          </div>
        </div>

        {/* Card Body with Consistent Baseline Alignment */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5">
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3 h-3 text-[#d4af37]" />
                {article.readingTime} min read
              </span>
              {article.author && (
                <>
                  <span className="text-white/20">•</span>
                  <span className="truncate italic text-slate-400 max-w-[140px]">{article.author}</span>
                </>
              )}
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#f5e6a3] transition-colors leading-snug line-clamp-2 mb-2.5 min-h-0 sm:min-h-[3.5rem] break-words">
              {article.title}
            </h3>

            <p className="text-slate-300/90 text-xs sm:text-sm leading-relaxed line-clamp-3 font-light">
              {article.description}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions Aligned to Bottom */}
      <div
        className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-white/5 bg-[#141822]/50 flex items-center justify-between mt-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelect(article)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4af37] hover:text-[#f5e6a3] transition-colors cursor-pointer"
          >
            <span>Read More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {article.url && article.url !== '#' && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open original article on ${article.source.name}`}
              title="Open source wire"
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onToggleBookmark(article.id)}
            aria-label={isBookmarked ? 'Remove Bookmark' : 'Save article'}
            title={isBookmarked ? 'Remove Bookmark' : 'Save for later'}
            className={`p-2 sm:p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={() => onShare(article)}
            aria-label="Share article"
            title="Share dispatch"
            className="p-2 sm:p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
