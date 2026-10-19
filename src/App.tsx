import React, { useState, useEffect, useCallback } from 'react';
import { Article, CategoryId, EditionType, NewsFeedStatus } from './types/news';
import { newsService } from './services/newsService';
import { storageService } from './services/storageService';
import { CACHED_VERIFIED_NEWS } from './data/cachedLiveNews';

import { Navbar } from './components/layout/Navbar';
import { MarketTicker } from './components/layout/MarketTicker';
import { BreakingNewsBar } from './components/layout/BreakingNewsBar';
import { CategoryBar } from './components/layout/CategoryBar';
import { Footer } from './components/layout/Footer';

import { StatusBadge } from './components/ui/StatusBadge';
import { ErrorState } from './components/ui/ErrorState';
import { HeroSkeleton } from './components/ui/SkeletonCard';

import { HeroFeatured } from './components/news/HeroFeatured';
import { NewsGrid } from './components/news/NewsGrid';
import { TrendingSidebar } from './components/news/TrendingSidebar';
import { CategorySpotlight } from './components/news/CategorySpotlight';
import { NewsletterSection } from './components/news/NewsletterSection';

import { ArticleDetailModal } from './components/modals/ArticleDetailModal';
import { SearchModal } from './components/modals/SearchModal';
import { BookmarksDrawer } from './components/modals/BookmarksDrawer';
import { ShareModal } from './components/modals/ShareModal';

export function App() {
  // Navigation & Filter States
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentEdition, setCurrentEdition] = useState<EditionType>(() => storageService.getEdition());
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>(() => storageService.getFontSize());

  // News Data States
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<NewsFeedStatus>({
    isLive: true,
    sourceLabel: 'Connecting to International Wire...',
    lastUpdated: new Date(),
    itemCount: 0,
    isFallback: false,
  });

  // Spotlight sub-caches for front-page sections
  const [indiaArticles, setIndiaArticles] = useState<Article[]>([]);
  const [techArticles, setTechArticles] = useState<Article[]>([]);

  // User saved bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => storageService.getBookmarks());

  // Modal States
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [shareArticle, setShareArticle] = useState<Article | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);

  // Fetch news data
  const loadNews = useCallback(
    async (forceRefresh = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await newsService.getNews({
          category: selectedCategory,
          searchQuery,
          edition: currentEdition,
          forceRefresh,
        });

        setArticles(result.articles);
        setStatus(result.status);

        // Also fetch spotlight stories if on 'all'
        if (selectedCategory === 'all' && !searchQuery) {
          newsService.getNews({ category: 'india', edition: 'india' }).then((res) => {
            setIndiaArticles(res.articles);
          });
          newsService.getNews({ category: 'tech' }).then((res) => {
            setTechArticles(res.articles);
          });
        }
      } catch (err: any) {
        setError(err.message || 'Error communicating with global wire service');
        setStatus((prev) => ({
          ...prev,
          isLive: false,
          isFallback: true,
          error: 'Connection error. Switch to authenticated offline archive.',
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory, searchQuery, currentEdition]
  );

  useEffect(() => {
    loadNews(false);
  }, [loadNews]);

  // Global Keyboard Shortcuts (Ctrl+K or Cmd+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for bookmarks
  const handleToggleBookmark = (id: string) => {
    storageService.toggleBookmark(id);
    setBookmarkedIds(storageService.getBookmarks());
  };

  const isBookmarked = (id: string) => bookmarkedIds.includes(id);

  const handleClearAllBookmarks = () => {
    storageService.clearAllBookmarks();
    setBookmarkedIds([]);
  };

  // Handlers for Edition and Font Size
  const handleSelectEdition = (ed: EditionType) => {
    setCurrentEdition(ed);
    storageService.setEdition(ed);
  };

  const handleToggleFontSize = () => {
    const nextSize = fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xl' : 'normal';
    setFontSize(nextSize);
    storageService.setFontSize(nextSize);
  };

  // Handlers for search
  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  // Handlers for category selection
  const handleSelectCategory = (cat: CategoryId) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lead and secondary stories
  const leadStory = articles.find((a) => a.isFeatured) || articles[0];
  const secondaryStories = articles.filter((a) => a.id !== leadStory?.id).slice(0, 3);
  const remainingArticles = articles.filter(
    (a) => a.id !== leadStory?.id && !secondaryStories.some((s) => s.id === a.id)
  );

  // Saved articles object array
  const allKnownArticles = [...articles, ...indiaArticles, ...techArticles, ...CACHED_VERIFIED_NEWS];
  const savedArticlesList = bookmarkedIds
    .map((id) => allKnownArticles.find((a) => a.id === id))
    .filter((a): a is Article => a !== undefined);

  // Related articles for modal
  const modalRelated = selectedArticle
    ? articles.filter((a) => a.id !== selectedArticle.id && a.category === selectedArticle.category).slice(0, 3)
    : [];

  const shouldShowHero = !searchQuery && !error && articles.length > 0;

  return (
    <div
      className={`min-h-screen bg-[#090a0f] text-slate-100 flex flex-col ${
        fontSize === 'large' ? 'text-base' : fontSize === 'xl' ? 'text-lg' : 'text-sm'
      }`}
    >
      {/* 1. Header Navigation */}
      <Navbar
        currentEdition={currentEdition}
        onSelectEdition={handleSelectEdition}
        bookmarkCount={bookmarkedIds.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        fontSize={fontSize}
        onToggleFontSize={handleToggleFontSize}
        onSelectCategory={handleSelectCategory}
      />

      {/* 2. Real-Time Market Ticker */}
      <MarketTicker />

      {/* 3. Real-Time Breaking News Alert Bar */}
      <BreakingNewsBar articles={articles} onSelectArticle={(art) => setSelectedArticle(art)} />

      {/* 4. Category Bar Navigation */}
      <CategoryBar selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />

      {/* 5. Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-8">
        {/* Live Status Badge with manual refresh button */}
        <StatusBadge
          status={status}
          isLoading={isLoading}
          onRefresh={() => loadNews(true)}
        />

        {/* Error Handling State with Retry & Fallback option */}
        {error && (
          <ErrorState
            message={error}
            onRetry={() => loadNews(true)}
            onUseFallback={() => {
              setArticles(CACHED_VERIFIED_NEWS);
              setStatus({
                isLive: false,
                sourceLabel: 'Authenticated Editorial Snapshot (Verified Data)',
                lastUpdated: new Date(),
                itemCount: CACHED_VERIFIED_NEWS.length,
                isFallback: true,
              });
              setError(null);
            }}
          />
        )}

        {/* Lead Hero Editorial Layout */}
        {shouldShowHero && (
          <>
            {isLoading ? (
              <HeroSkeleton />
            ) : (
              leadStory && (
                <HeroFeatured
                  leadStory={leadStory}
                  secondaryStories={secondaryStories}
                  onSelectArticle={(art) => setSelectedArticle(art)}
                  onToggleBookmark={handleToggleBookmark}
                  isBookmarked={isBookmarked}
                  onShare={(art) => setShareArticle(art)}
                />
              )
            )}
          </>
        )}

        {/* Main Feed Grid & Trending Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Articles Feed (8 cols on desktop) */}
          <div className="lg:col-span-8">
            <NewsGrid
              articles={shouldShowHero ? remainingArticles : articles}
              category={selectedCategory}
              isLoading={isLoading}
              onSelectArticle={(art) => setSelectedArticle(art)}
              onToggleBookmark={handleToggleBookmark}
              isBookmarked={isBookmarked}
              onShare={(art) => setShareArticle(art)}
              searchQuery={searchQuery}
              onResetSearch={handleResetSearch}
            />
          </div>

          {/* Trending / Top 5 Sidebar (4 cols on desktop) */}
          <div className="lg:col-span-4 sticky top-16">
            <TrendingSidebar
              trendingArticles={articles.filter((a) => a.isTrending || a.isBreaking)}
              onSelectArticle={(art) => setSelectedArticle(art)}
            />
          </div>
        </div>

        {/* Category Spotlights: India in Focus & Silicon Frontier (on 'all' category) */}
        {selectedCategory === 'all' && !searchQuery && !error && (
          <CategorySpotlight
            indiaArticles={indiaArticles}
            techArticles={techArticles}
            onSelectArticle={(art) => setSelectedArticle(art)}
            onExploreCategory={(cat) => handleSelectCategory(cat)}
          />
        )}

        {/* Morning Dispatch Newsletter Signup */}
        <NewsletterSection />
      </main>

      {/* 6. Professional International Footer */}
      <Footer onSelectCategory={handleSelectCategory} />

      {/* 7. Interactive Modals */}
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isBookmarked={selectedArticle ? isBookmarked(selectedArticle.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onShare={(art) => setShareArticle(art)}
        relatedArticles={modalRelated}
        onSelectArticle={(art) => setSelectedArticle(art)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearchSubmit={handleSearchSubmit}
        articles={allKnownArticles}
        onSelectArticle={(art) => setSelectedArticle(art)}
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        savedArticles={savedArticlesList}
        onSelectArticle={(art) => setSelectedArticle(art)}
        onRemoveBookmark={handleToggleBookmark}
        onClearAll={handleClearAllBookmarks}
      />

      <ShareModal
        article={shareArticle}
        onClose={() => setShareArticle(null)}
      />
    </div>
  );
}
export default App;
