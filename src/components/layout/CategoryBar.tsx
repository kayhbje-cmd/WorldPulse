import React from 'react';
import { CATEGORIES } from '../../data/categories';
import { CategoryId } from '../../types/news';
import {
  Flame,
  Globe2,
  Compass,
  Cpu,
  Building2,
  TrendingUp,
  Atom,
  Trophy,
  Film,
  HeartPulse,
  Landmark,
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Flame: <Flame className="w-3.5 h-3.5" />,
  Globe2: <Globe2 className="w-3.5 h-3.5" />,
  Compass: <Compass className="w-3.5 h-3.5" />,
  Cpu: <Cpu className="w-3.5 h-3.5" />,
  Building2: <Building2 className="w-3.5 h-3.5" />,
  TrendingUp: <TrendingUp className="w-3.5 h-3.5" />,
  Atom: <Atom className="w-3.5 h-3.5" />,
  Trophy: <Trophy className="w-3.5 h-3.5" />,
  Film: <Film className="w-3.5 h-3.5" />,
  HeartPulse: <HeartPulse className="w-3.5 h-3.5" />,
  Landmark: <Landmark className="w-3.5 h-3.5" />,
};

export const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="sticky top-0 z-30 bg-[#090a0f]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2.5" aria-label="News categories">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] ${
                  isActive
                    ? 'bg-[#d4af37] text-neutral-950 font-semibold shadow-md shadow-[#d4af37]/20 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 active:scale-95'
                }`}
              >
                <span className={isActive ? 'text-neutral-950' : 'text-[#d4af37]'}>
                  {ICON_MAP[cat.iconName] || null}
                </span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
