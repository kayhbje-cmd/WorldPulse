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
    <section className="mb-12" aria-label="Lead Story and Front Page Highlights">
      {/* Front Page Headline Label */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
        <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
        <h2 className="text-xs uppercase font-bold tracking-[0.2em] text-[#d4af37]">
          Lead International Coverage &bull; Front Page Edition
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Main Lead Story (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-[#11141c] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#d4af37]/40 transition-all duration-300 shadow-xl shadow-black/50">
          <div
            className="relative aspect-video sm:aspect-[21/9] overflow-hidden cursor-pointer bg-[#181d28]"
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#11141c] via-[#11141c]/40 to-transparent pointer-events-none" />

            {/* Badges on top of image */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded bg-[#d4af37] text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-md">
                {leadStory.category}
              </span>
              <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-white text-xs border border-white/10">
                {leadStory.source.name}
              </span>
              {leadStory.isBreaking && (
                <span className="px-2 py-0.5 rounded bg-rose-600/90 text-white font-semibold text-[10px] tracking-wider uppercase flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Breaking
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  {formatRelativeTime(leadStory.publishedAt)}
                </span>
                <span>•</span>
                <span>{leadStory.readingTime} min read</span>
                {leadStory.author && (
                  <>
                    <span>•</span>
                    <span className="text-slate-300 italic">{leadStory.author}</span>
                  </>
                )}
              </div>

              <h1
                onClick={() => onSelectArticle(leadStory)}
                className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white group-hover:text-[#f5e6a3] transition-colors leading-tight mb-4 cursor-pointer"
              >
                {leadStory.title}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6 font-light">
                {leadStory.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => onSelectArticle(leadStory)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#d4af37] hover:bg-[#e5c07b] text-neutral-950 font-semibold text-xs sm:text-sm tracking-wide transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#d4af37]/20"
              >
                <span>Read Full Coverage</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleBookmark(leadStory.id)}
                  aria-label={leadSaved ? 'Remove from Saved Articles' : 'Save article for later'}
                  title={leadSaved ? 'Remove from Saved' : 'Save for later'}
                  className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
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
                  className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Editorial Spotlight (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-[#11141c] border border-white/10 rounded-2xl p-5 sm:p-6 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-200">
                Key Global Developments
              </span>
              <span className="text-[10px] font-mono text-[#d4af37] uppercase">Curated</span>
            </div>

            <div className="space-y-5 flex-1 flex flex-col justify-around">
              {secondaryStories.slice(0, 3).map((story) => {
                const saved = isBookmarked(story.id);
                return (
                  <article
                    key={story.id}
                    className="group cursor-pointer pb-4 border-b border-white/5 last:border-b-0 last:pb-0"
                    onClick={() => onSelectArticle(story)}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <span className="text-[#d4af37] font-semibold uppercase tracking-wider text-[10px]">
                        {story.category}
                      </span>
                      <span>{formatRelativeTime(story.publishedAt)}</span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100 group-hover:text-[#d4af37] transition-colors leading-snug line-clamp-2 mb-2">
                      {story.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-medium text-slate-300">{story.source.name}</span>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onToggleBookmark(story.id)}
                          aria-label={`Bookmark ${story.title}`}
                          className={`p-1 hover:text-[#d4af37] transition-colors ${
                            saved ? 'text-[#d4af37]' : 'text-slate-500'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onShare(story)}
                          aria-label={`Share ${story.title}`}
                          className="p-1 hover:text-[#d4af37] text-slate-500 transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
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
