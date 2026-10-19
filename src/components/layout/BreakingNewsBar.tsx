import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Article } from '../../types/news';

interface BreakingNewsBarProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const BreakingNewsBar: React.FC<BreakingNewsBarProps> = ({ articles, onSelectArticle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const breakingList = articles.slice(0, 6);

  useEffect(() => {
    if (!isPlaying || breakingList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingList.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPlaying, breakingList.length]);

  if (breakingList.length === 0) return null;

  const current = breakingList[currentIndex] || breakingList[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + breakingList.length) % breakingList.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % breakingList.length);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying((prev) => !prev);
  };

  return (
    <div
      role="region"
      aria-label="Breaking News Alert"
      className="bg-[#11141d] border-b border-[#d4af37]/20 py-2 px-3 sm:px-6 flex items-center justify-between text-xs transition-colors"
    >
      <div
        className="flex items-center gap-3 overflow-hidden flex-1 cursor-pointer"
        onClick={() => onSelectArticle(current)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onSelectArticle(current);
          }
        }}
        aria-label={`Breaking News: ${current.title}`}
      >
        {/* Urgent Badge with Pulsing Beacon */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5e6a3] shrink-0 font-semibold tracking-wider text-[10px] uppercase">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] pulse-gold"></span>
          <span>FLASH</span>
        </div>

        {/* Source Badge */}
        <span className="hidden md:inline px-2 py-0.5 rounded bg-white/5 text-slate-300 font-medium text-[11px] border border-white/5 shrink-0">
          {current.source.name}
        </span>

        {/* Headline */}
        <div className="overflow-hidden text-ellipsis whitespace-nowrap flex-1">
          <span className="text-slate-100 hover:text-[#d4af37] transition-colors font-medium text-xs sm:text-sm">
            {current.title}
          </span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-2 sm:ml-3 pl-2 sm:pl-3 border-l border-white/10">
        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline mr-1">
          {currentIndex + 1}/{breakingList.length}
        </span>

        <button
          onClick={handlePrev}
          aria-label="Previous breaking headline"
          title="Previous dispatch"
          className="p-1 min-w-[28px] min-h-[28px] flex items-center justify-center hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause breaking news ticker' : 'Resume breaking news ticker'}
          title={isPlaying ? 'Pause ticker' : 'Resume ticker'}
          className="p-1 min-w-[28px] min-h-[28px] flex items-center justify-center hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={handleNext}
          aria-label="Next breaking headline"
          title="Next dispatch"
          className="p-1 min-w-[28px] min-h-[28px] flex items-center justify-center hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
