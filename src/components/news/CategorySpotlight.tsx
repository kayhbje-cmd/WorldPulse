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
    <section className="my-12" aria-label="Regional and Technology Spotlights">
      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/10">
        <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
        <h2 className="text-xs uppercase font-bold tracking-[0.2em] text-[#d4af37]">
          Special Focus &bull; Regional & Technology Frontiers
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Spotlight 1: India in Focus */}
        {topIndia && (
          <div className="bg-[#11141c] border border-white/10 rounded-2xl overflow-hidden p-6 flex flex-col justify-between group hover:border-[#d4af37]/40 transition-all shadow-xl shadow-black/40">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-[#d4af37]">
                  <Compass className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-wider">India in Focus</span>
                </div>
                <button
                  onClick={() => onExploreCategory('india')}
                  aria-label="Explore all India wire articles"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Explore India Wire</span>
                  <ArrowRight className="w-3 h-3 text-[#d4af37]" />
                </button>
              </div>

              <div
                className="relative aspect-video rounded-xl overflow-hidden mb-4 cursor-pointer bg-[#181d28]"
                onClick={() => onSelectArticle(topIndia)}
              >
                <img
                  src={topIndia.imageUrl}
                  alt={topIndia.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_EDITORIAL_FALLBACK;
                  }}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded text-xs text-white border border-white/10">
                  {topIndia.source.name}
                </span>
              </div>

              <h3
                onClick={() => onSelectArticle(topIndia)}
                className="font-serif text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors leading-snug cursor-pointer mb-2"
              >
                {topIndia.title}
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-2">
                {topIndia.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>{formatRelativeTime(topIndia.publishedAt)}</span>
              <button
                onClick={() => onSelectArticle(topIndia)}
                className="text-[#d4af37] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Read Coverage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Spotlight 2: The Technology Frontier */}
        {topTech && (
          <div className="bg-[#11141c] border border-white/10 rounded-2xl overflow-hidden p-6 flex flex-col justify-between group hover:border-[#d4af37]/40 transition-all shadow-xl shadow-black/40">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-[#d4af37]">
                  <Cpu className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-wider">The Silicon Frontier</span>
                </div>
                <button
                  onClick={() => onExploreCategory('tech')}
                  aria-label="Explore all technology wire articles"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Explore Tech Wire</span>
                  <ArrowRight className="w-3 h-3 text-[#d4af37]" />
                </button>
              </div>

              <div
                className="relative aspect-video rounded-xl overflow-hidden mb-4 cursor-pointer bg-[#181d28]"
                onClick={() => onSelectArticle(topTech)}
              >
                <img
                  src={topTech.imageUrl}
                  alt={topTech.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_EDITORIAL_FALLBACK;
                  }}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded text-xs text-white border border-white/10">
                  {topTech.source.name}
                </span>
              </div>

              <h3
                onClick={() => onSelectArticle(topTech)}
                className="font-serif text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors leading-snug cursor-pointer mb-2"
              >
                {topTech.title}
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-2">
                {topTech.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>{formatRelativeTime(topTech.publishedAt)}</span>
              <button
                onClick={() => onSelectArticle(topTech)}
                className="text-[#d4af37] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
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
