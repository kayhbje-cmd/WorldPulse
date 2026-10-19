import React from 'react';
import { CATEGORIES } from '../../data/categories';
import { CategoryId } from '../../types/news';
import { ArrowUp, Globe2, ShieldCheck, Radio, ExternalLink } from 'lucide-react';
import { WORLD_CLOCKS, getFormattedCityTime } from '../../utils/date';

interface FooterProps {
  onSelectCategory: (id: CategoryId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#06070a] border-t border-white/10 text-slate-400 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Masthead & Back-to-Top Row */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-10 border-b border-white/10 gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-[#d4af37] to-[#997b2f] flex items-center justify-center text-neutral-950 font-serif font-black text-sm">
                W
              </div>
              <span className="font-brand text-2xl font-black tracking-widest text-white">
                WORLD<span className="text-[#d4af37]">PULSE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md font-serif italic">
              "The Pulse of Global Affairs" &bull; Continuous real-time journalism and verified international news dispatches.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <span>Top of Page</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#d4af37]" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="py-10 border-b border-white/10">
          <div className="text-[11px] uppercase tracking-widest font-bold text-[#d4af37] mb-4">
            International News Desks &amp; Sections
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  scrollToTop();
                }}
                className="text-left text-slate-300 hover:text-[#d4af37] transition-colors py-1 cursor-pointer truncate"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Global Bureaus & Clocks */}
        <div className="py-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Globe2 className="w-4 h-4 text-[#d4af37]" />
            <span>Global Bureaus &amp; Synchronized Exchange Hours:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            {WORLD_CLOCKS.map((clock) => (
              <div key={clock.city} className="flex items-center gap-1.5 bg-[#11141c] px-2.5 py-1 rounded border border-white/5">
                <span className="text-slate-400">{clock.city}:</span>
                <span className="font-mono text-[#f5e6a3]">
                  {getFormattedCityTime(clock.timeZone)} {clock.code}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Legal, Attribution & RSS Disclosure */}
        <div className="pt-8 text-xs text-slate-500 space-y-4 leading-relaxed font-light">
          <div className="p-4 bg-[#0e1118] border border-white/5 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-400">
              <strong className="text-slate-200">Wire Attribution &amp; Free Service Disclosure:</strong> WorldPulse connects to legitimate, publicly permissible news syndication feeds (Google News RSS and BBC World Wire). All original journalism, headlines, and reporting are the sole intellectual property of respective publishers (including Reuters, The Hindu, NBC, AP, Bloomberg, BBC, and affiliated correspondents). Content is cited with transparent original source attribution links.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>
              &copy; {new Date().getFullYear()} WorldPulse Editorial Network. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Charter</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Code of Ethics</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Syndication API</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Dispatch</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
