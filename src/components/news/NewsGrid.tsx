import React, { useState } from 'react';
import {
  LayoutGrid,
  Rows,
  List,
  ChevronDown,
  ArrowDownCircle,
  X,
} from 'lucide-react';
import { Article, CategoryId, ViewMode, SortOption } from '../../types/news';
import { CATEGORIES } from '../../data/categories';
import { NewsCard } from './NewsCard';
import { NewsCardSkeleton } from '../ui/SkeletonCard';
import { EmptyState } from '../ui/EmptyState';

interface NewsGridProps {
  articles: Article[];
  category: CategoryId;
  isLoading: boolean;
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  onShare: (article: Article) => void;
  searchQuery?: string;
  onResetSearch: () => void;
}

export const NewsGrid: React.FC<NewsGridProps> = ({
  articles,
  category,
  isLoading,
  onSelectArticle,
  onToggleBookmark,
  isBookmarked,
  onShare,
  searchQuery,
  onResetSearch,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [visibleCount, setVisibleCount] = useState(12);

  const currentCategoryObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  // Sort articles
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortOption === 'trending') {
      return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    }
    if (sortOption === 'reading_time') {
      return a.readingTime - b.readingTime;
    }
    // Latest default
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const displayedArticles = sortedArticles.slice(0, visibleCount);
  const hasMore = visibleCount < sortedArticles.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  return (
    <section className="space-y-6" aria-label="International News Feed">
      {/* Category Header & Filter Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {searchQuery ? `Search Results: "${searchQuery}"` : currentCategoryObj.name}
            </h2>

            {searchQuery && (
              <button
                onClick={onResetSearch}
                aria-label="Clear active search filter"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs border border-white/10 transition-colors cursor-pointer"
              >
                <span>Clear search</span>
                <X className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-light max-w-xl">
            {searchQuery
              ? `Displaying all international wire stories matching your inquiry.`
              : currentCategoryObj.description}
          </p>
        </div>

        {/* View Switcher & Sorting Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-start md:self-auto">
          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              aria-label="Sort news articles"
              className="appearance-none bg-[#141822] hover:bg-[#191f2c] border border-white/10 text-slate-300 text-xs rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value="latest">Sort: Latest First</option>
              <option value="trending">Sort: Most Trending</option>
              <option value="reading_time">Sort: Quick Reads (&lt; 3m)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#141822] border border-white/10" role="group" aria-label="Layout view mode">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid layout view"
              title="Grid View"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#d4af37] text-neutral-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('magazine')}
              aria-label="Magazine layout view"
              title="Magazine View"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'magazine' ? 'bg-[#d4af37] text-neutral-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Rows className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('compact')}
              aria-label="Compact list layout view"
              title="Compact List View"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'compact' ? 'bg-[#d4af37] text-neutral-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch auto-rows-fr">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <EmptyState
          searchQuery={searchQuery}
          categoryName={currentCategoryObj.name}
          onReset={onResetSearch}
        />
      ) : (
        <>
          {/* Render Articles by Selected View Mode */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch auto-rows-fr">
              {displayedArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  viewMode="grid"
                  onSelect={onSelectArticle}
                  onToggleBookmark={onToggleBookmark}
                  isBookmarked={isBookmarked(article.id)}
                  onShare={onShare}
                />
              ))}
            </div>
          )}

          {viewMode === 'magazine' && (
            <div className="space-y-6">
              {displayedArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  viewMode="magazine"
                  onSelect={onSelectArticle}
                  onToggleBookmark={onToggleBookmark}
                  isBookmarked={isBookmarked(article.id)}
                  onShare={onShare}
                />
              ))}
            </div>
          )}

          {viewMode === 'compact' && (
            <div className="space-y-3">
              {displayedArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  viewMode="compact"
                  onSelect={onSelectArticle}
                  onToggleBookmark={onToggleBookmark}
                  isBookmarked={isBookmarked(article.id)}
                  onShare={onShare}
                />
              ))}
            </div>
          )}

          {/* Load More Dispatches Button */}
          {hasMore && (
            <div className="pt-8 text-center">
              <button
                onClick={handleLoadMore}
                aria-label="Load more dispatches"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl bg-[#141824] hover:bg-[#1a2030] text-slate-100 font-semibold text-xs sm:text-sm border border-white/10 hover:border-[#d4af37]/50 transition-all active:scale-95 cursor-pointer shadow-xl shadow-black/50 group min-h-[44px]"
              >
                <ArrowDownCircle className="w-4 h-4 text-[#d4af37] group-hover:translate-y-0.5 transition-transform" />
                <span>Load More Dispatches ({sortedArticles.length - visibleCount} remaining)</span>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
