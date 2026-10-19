import React from 'react';
import { Flame, TrendingUp, ShieldCheck, ArrowRight, Award } from 'lucide-react';
import { Article } from '../../types/news';
import { formatRelativeTime } from '../../utils/date';

interface TrendingSidebarProps {
  trendingArticles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const TrendingSidebar: React.FC<TrendingSidebarProps> = ({ trendingArticles, onSelectArticle }) => {
  const topFive = trendingArticles.slice(0, 5);

  return (
    <aside className="space-y-8">
      {/* Trending / Most Read Panel */}
      <div className="bg-[#11141c] border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#d4af37]" />
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">Most Read Dispatches</h3>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider px-2 py-0.5 rounded bg-[#d4af37]/10 border border-[#d4af37]/20">
            Top 5
          </span>
        </div>

        <div className="divide-y divide-white/5 space-y-4">
          {topFive.map((article, index) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group flex gap-4 pt-4 first:pt-0 cursor-pointer"
            >
              {/* Number ranking */}
              <div className="font-serif font-black text-2xl text-[#d4af37]/60 group-hover:text-[#d4af37] transition-colors w-8 shrink-0 text-center">
                0{index + 1}
              </div>

              {/* Title & metadata */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                  <span className="font-semibold text-slate-300 uppercase">{article.source.name}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(article.publishedAt)}</span>
                </div>

                <h4 className="font-serif text-sm font-semibold text-slate-100 group-hover:text-[#f5e6a3] transition-colors leading-snug line-clamp-2">
                  {article.title}
                </h4>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Editorial Assurance Card */}
      <div className="bg-gradient-to-br from-[#161a25] to-[#11141c] border border-[#d4af37]/30 rounded-2xl p-6 shadow-lg shadow-black/50 text-slate-200">
        <div className="flex items-center gap-2 text-[#d4af37] mb-3">
          <Award className="w-5 h-5" />
          <span className="font-bold tracking-wider text-xs uppercase">Editorial Standard</span>
        </div>

        <h4 className="font-serif text-lg font-bold text-white mb-2 leading-tight">
          Independent International Journalism
        </h4>

        <p className="text-xs text-slate-300 leading-relaxed font-light mb-4">
          WorldPulse aggregates verified dispatches directly from global news wires without algorithmic bias. Every headline is cross-checked against original publications.
        </p>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#f5e6a3]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Unaltered Citations
          </span>
          <span className="font-mono">Est. 2026</span>
        </div>
      </div>
    </aside>
  );
};
