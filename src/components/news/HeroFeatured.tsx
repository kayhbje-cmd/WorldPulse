import React from 'react';
import { Bookmark, Share2, Clock, ArrowUpRight, Flame } from 'lucide-react';
import { Article } from '../../types/news';
import { formatRelativeTime } from '../../utils/date';

interface HeroFeaturedProps {
  leadStory?: Article;
  secondaryStories: Article[];
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  onShare: (article: Article) => void;
}

const DEFAULT_EDITORIAL_FALLBACK =
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  leadStory,
  secondaryStories,
  onSelectArticle,
  onToggleBookmark,
  isBookmarked,
  onShare,
}) => {
  if (!leadStory) return null;

  const leadSaved = isBookmarked(leadStory.id);

  return (
    <section className="mb-10 sm:mb-14" aria-label="Lead Story and Front Page Highlights">
      {/* Front Page Headline Label */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] pulse-gold shrink-0" />
          <h2 className="text-xs uppercase font-bold tracking-[0.16em] sm:tracking-[0.22em] text-[#d4af37]">
            Lead International Dispatch &bull; Front Page Edition
          </h2>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 hidden sm:inline">
          Verified Wire Intelligence
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Main Lead Story (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-[#11141c] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#d4af37]/45 transition-all duration-300 shadow-2xl shadow-black/60">
          <div
            className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden cursor-pointer bg-[#181d28]"
            onClick={() => onSelectArticle(leadStory)}
          >
            <img
              src={leadStory.imageUrl}
              alt={leadStory.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_EDITORIAL_FALLBACK;
              }}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11141c] via-[#11141c]/45 to-transparent pointer-events-none" />

            {/* Badges on top of image */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap items-center gap-2 z-10">
              <span className="px-2.5 py-1 sm:px-3 rounded-md bg-[#d4af37] text-neutral-950 font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-lg shadow-black/40">
                {leadStory.category}
              </span>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[11px] sm:text-xs border border-white/10 font-medium">
                {leadStory.source.name}
              </span>
              {leadStory.isBreaking && (
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-rose-600/90 text-white font-semibold text-[10px] sm:text-[11px] tracking-wider uppercase flex items-center gap-1 shadow">
                  <Flame className="w-3.5 h-3.5" /> Breaking
                </span>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-7 md:p-9 flex-1 flex flex-col justify-between">
            <div>
              {/* Kicker & Meta Row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400 mb-3 sm:mb-3.5">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  {formatRelativeTime(leadStory.publishedAt)}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-slate-300">{leadStory.readingTime} min read</span>
                {leadStory.author && (
                  <>
                    <span className="text-white/20">•</span>
                    <span className="text-slate-300 italic truncate max-w-xs">{leadStory.author}</span>
                  </>
                )}
              </div>

              {/* Authoritative Featured Headline */}
              <h1
                onClick={() => onSelectArticle(leadStory)}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-serif font-black text-white group-hover:text-[#f5e6a3] transition-colors leading-[1.14] mb-3 sm:mb-4 cursor-pointer tracking-tight break-words"
              >
                {leadStory.title}
              </h1>

              {/* Excerpt */}
              <p className="text-slate-200/90 text-sm sm:text-base md:text-lg leading-relaxed line-clamp-3 mb-5 sm:mb-6 font-light">
                {leadStory.description}
              </p>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 sm:pt-5 border-t border-white/10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
              <button
                onClick={() => onSelectArticle(leadStory)}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59e2b] hover:from-[#e5c07b] hover:to-[#d4af37] text-neutral-950 font-bold text-xs sm:text-sm tracking-wide transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#d4af37]/25 flex-1 sm:flex-initial"
              >
                <span>Read Full Coverage</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onToggleBookmark(leadStory.id)}
                  aria-label={leadSaved ? 'Remove from Saved Articles' : 'Save article for later'}
                  title={leadSaved ? 'Remove from Saved' : 'Save for later'}
                  className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer min-w-[42px] min-h-[42px] flex items-center justify-center ${
                    leadSaved
                      ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onShare(leadStory)}
                  aria-label="Share lead story"
                  title="Share dispatch"
                  className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-w-[42px] min-h-[42px] flex items-center justify-center"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Editorial Spotlight (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-[#11141c] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/50 h-full flex flex-col">
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-200">
                Key Global Developments
              </span>
              <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider px-2 py-0.5 rounded bg-[#d4af37]/10 border border-[#d4af37]/20">
                Curated
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {secondaryStories.slice(0, 5).map((story, index) => {
                const saved = isBookmarked(story.id);
                return (
                  <article
                    key={story.id}
                    className="group cursor-pointer py-3 first:pt-0 last:pb-0"
                    onClick={() => onSelectArticle(story)}
                  >
                    <div className="flex items-start gap-3 sm:gap-3.5">
                      {/* Number ranking 01-05 */}
                      <div className="font-serif font-black text-sm sm:text-base text-[#d4af37]/70 group-hover:text-[#f5e6a3] transition-colors w-5 shrink-0 text-center tracking-tight pt-0.5">
                        0{index + 1}
                      </div>

                      {story.imageUrl && (
                        <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden shrink-0 bg-[#181d28] border border-white/5">
                          <img
                            src={story.imageUrl}
                            alt={story.title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_EDITORIAL_FALLBACK;
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                            <span className="text-[#d4af37] font-semibold uppercase tracking-wider text-[10px]">
                              {story.category}
                            </span>
                            <span className="text-slate-400 text-[10px]">{formatRelativeTime(story.publishedAt)}</span>
                          </div>

                          <h3 className="font-serif text-xs sm:text-sm font-bold text-slate-100 group-hover:text-[#f5e6a3] transition-colors leading-snug line-clamp-2 mb-1.5 break-words">
                            {story.title}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-medium text-slate-300 text-[11px] truncate max-w-[120px] xs:max-w-none">{story.source.name}</span>
                          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => onToggleBookmark(story.id)}
                              aria-label={`Bookmark ${story.title}`}
                              className={`p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-md hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer ${
                                saved ? 'text-[#d4af37]' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onShare(story)}
                              aria-label={`Share ${story.title}`}
                              className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-md hover:bg-white/10 active:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
