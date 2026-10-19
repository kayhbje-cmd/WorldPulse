import React from 'react';
import { Compass, Cpu, ArrowRight } from 'lucide-react';
import { Article } from '../../types/news';
import { formatRelativeTime } from '../../utils/date';

interface CategorySpotlightProps {
  indiaArticles: Article[];
  techArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onExploreCategory: (category: 'india' | 'tech') => void;
}

const DEFAULT_EDITORIAL_FALLBACK =
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';

export const CategorySpotlight: React.FC<CategorySpotlightProps> = ({
  indiaArticles,
  techArticles,
  onSelectArticle,
  onExploreCategory,
}) => {
  const topIndia = indiaArticles[0];
  const topTech = techArticles[0];

  if (!topIndia && !topTech) return null;

  return (
    <section className="my-10 sm:my-14" aria-label="Regional and Technology Spotlights">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] pulse-gold shrink-0" />
          <h2 className="text-xs uppercase font-bold tracking-[0.22em] text-[#d4af37]">
            Special Focus &bull; Regional & Technology Frontiers
          </h2>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 hidden sm:inline">
          In-Depth Desks
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch auto-rows-fr">
        {/* Spotlight 1: India in Focus */}
        {topIndia && (
          <div className="bg-[#11141c] border border-white/10 rounded-2xl overflow-hidden p-4 sm:p-6 md:p-7 flex flex-col justify-between group hover:border-[#d4af37]/45 transition-all duration-300 shadow-xl shadow-black/40 h-full">
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-[#d4af37]">
                  <Compass className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-wider">India in Focus</span>
                </div>
                <button
                  onClick={() => onExploreCategory('india')}
                  aria-label="Explore all India wire articles"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors group/btn"
                >
                  <span>Explore India Wire</span>
                  <ArrowRight className="w-3 h-3 text-[#d4af37] group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div
                className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 cursor-pointer bg-[#181d28] shrink-0"
                onClick={() => onSelectArticle(topIndia)}
              >
                <img
                  src={topIndia.imageUrl}
                  alt={topIndia.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_EDITORIAL_FALLBACK;
                  }}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-xs text-white border border-white/10 font-medium">
                  {topIndia.source.name}
                </span>
              </div>

              <h3
                onClick={() => onSelectArticle(topIndia)}
                className="font-serif text-lg sm:text-2xl font-bold text-white group-hover:text-[#f5e6a3] transition-colors leading-snug cursor-pointer mb-2.5 min-h-0 sm:min-h-[3.5rem] line-clamp-2 break-words"
              >
                {topIndia.title}
              </h3>

              <p className="text-slate-300/90 text-xs sm:text-sm font-light leading-relaxed line-clamp-3 mb-4 flex-1">
                {topIndia.description}
              </p>
            </div>

            <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">{formatRelativeTime(topIndia.publishedAt)}</span>
              <button
                onClick={() => onSelectArticle(topIndia)}
                className="text-[#d4af37] font-semibold flex items-center gap-1 hover:text-[#f5e6a3] cursor-pointer transition-colors"
              >
                <span>Read Coverage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Spotlight 2: The Technology Frontier */}
        {topTech && (
          <div className="bg-[#11141c] border border-white/10 rounded-2xl overflow-hidden p-4 sm:p-6 md:p-7 flex flex-col justify-between group hover:border-[#d4af37]/45 transition-all duration-300 shadow-xl shadow-black/40 h-full">
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-[#d4af37]">
                  <Cpu className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-wider">The Silicon Frontier</span>
                </div>
                <button
                  onClick={() => onExploreCategory('tech')}
                  aria-label="Explore all technology wire articles"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors group/btn"
                >
                  <span>Explore Tech Wire</span>
                  <ArrowRight className="w-3 h-3 text-[#d4af37] group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div
                className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 cursor-pointer bg-[#181d28] shrink-0"
                onClick={() => onSelectArticle(topTech)}
              >
                <img
                  src={topTech.imageUrl}
                  alt={topTech.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_EDITORIAL_FALLBACK;
                  }}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-xs text-white border border-white/10 font-medium">
                  {topTech.source.name}
                </span>
              </div>

              <h3
                onClick={() => onSelectArticle(topTech)}
                className="font-serif text-lg sm:text-2xl font-bold text-white group-hover:text-[#f5e6a3] transition-colors leading-snug cursor-pointer mb-2.5 min-h-0 sm:min-h-[3.5rem] line-clamp-2 break-words"
              >
                {topTech.title}
              </h3>

              <p className="text-slate-300/90 text-xs sm:text-sm font-light leading-relaxed line-clamp-3 mb-4 flex-1">
                {topTech.description}
              </p>
            </div>

            <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">{formatRelativeTime(topTech.publishedAt)}</span>
              <button
                onClick={() => onSelectArticle(topTech)}
                className="text-[#d4af37] font-semibold flex items-center gap-1 hover:text-[#f5e6a3] cursor-pointer transition-colors"
              >
                <span>Read Coverage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
