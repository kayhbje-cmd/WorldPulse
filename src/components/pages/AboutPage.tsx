import React from 'react';
import {
  Globe2,
  ShieldCheck,
  Zap,
  Target,
  Users,
  Award,
  Layers,
  ArrowLeft,
  ExternalLink,
  Code2,
  CheckCircle2,
} from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { CategoryId } from '../../types/news';

interface AboutPageProps {
  onBackToNews: () => void;
  onSelectCategory: (cat: CategoryId) => void;
  onNavigateToContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBackToNews,
  onSelectCategory,
  onNavigateToContact,
}) => {
  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      {/* Breadcrumb & Navigation Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <button
          onClick={onBackToNews}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-[#d4af37] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Live News Wire</span>
        </button>

        <span className="text-xs text-[#d4af37] uppercase tracking-widest font-mono font-semibold">
          Editorial Dossier &bull; Volume 1
        </span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121622] via-[#0d1017] to-[#090a0f] border border-white/10 p-8 sm:p-14 text-center sm:text-left shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest">
            <Globe2 className="w-3.5 h-3.5" />
            <span>The WorldPulse Editorial Charter</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Illuminating Global Affairs with Precision, Speed, and Integrity.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
            WorldPulse was established to bridge fragmented geopolitical developments, financial market volatility, scientific breakthroughs, and societal shifts into one unified, distraction-free intelligence platform.
          </p>
        </div>
      </div>

      {/* Core Editorial Pillars */}
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <div className="text-[11px] uppercase tracking-widest font-bold text-[#d4af37] mb-1">
            Our Foundation
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Core Editorial &amp; Technological Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-[#11141c] border border-white/10 space-y-4 hover:border-[#d4af37]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              Zero-Fabrication &amp; Strict Attribution
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              We never fabricate headlines, quotes, summaries, or dates. Every single story is ingested via authorized public news syndication wires and prominently attributes the original publisher (including Reuters, BBC, The Hindu, AP, and Bloomberg).
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#11141c] border border-white/10 space-y-4 hover:border-[#d4af37]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              Real-Time Edge Distribution
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              WorldPulse operates a globally distributed serverless architecture on Vercel and Netlify edge networks. Upstream RSS feeds are parsed and edge-cached with intelligent 120-second cache-control to ensure sub-second response times worldwide.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#11141c] border border-white/10 space-y-4 hover:border-[#d4af37]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              Reader-First Editorial Aesthetics
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Crafted in dark charcoal luxury editorial design with warm gold accents, high-contrast typography, customizable reading scales, text-to-speech audio dispatches, and zero intrusive pop-ups or clickbait banners.
            </p>
          </div>
        </div>
      </div>

      {/* Coverage Desks */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#0e1118] border border-white/10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#d4af37] block mb-1">
              Global Desks
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              10 Specialized International News Desks
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Click any desk to filter live wire reporting across diplomatic, commercial, scientific, and cultural corridors.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                onBackToNews();
              }}
              className="p-4 rounded-xl bg-[#141824] hover:bg-[#1a2030] border border-white/5 hover:border-[#d4af37]/40 transition-all text-left cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-[#d4af37] transition-colors mb-1 truncate">
                {cat.name}
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                {cat.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Architecture & Verification Disclosure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="p-8 rounded-2xl bg-[#11141c] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-serif font-bold text-lg">
            <Code2 className="w-5 h-5 text-[#d4af37]" />
            <h3>Modern Technology Stack</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
            Engineered with modern frontend and serverless principles for enterprise reliability and speed:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Frontend:</strong> React 18, TypeScript, Tailwind CSS, Lucide Icons</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Build Tool:</strong> Vite 8 with optimized chunks &amp; CSS compression</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Backend Services:</strong> Serverless Edge Handlers (Node.js &amp; fast-xml-parser)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Deployment Targets:</strong> Vercel &amp; Netlify with automated SPA fallbacks</span>
            </li>
          </ul>
        </div>

        <div className="p-8 rounded-2xl bg-[#11141c] border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-serif font-bold text-lg">
              <Award className="w-5 h-5 text-[#d4af37]" />
              <h3>Publisher Attribution Notice</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
              WorldPulse operates as an international index and news briefing portal. All original articles, editorial reporting, photographs, and investigative work belong exclusively to the original publishing news agencies. We provide clear back-links so readers can support original journalism directly.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={onNavigateToContact}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c07b] text-neutral-950 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#d4af37]/20"
            >
              <span>Contact Editorial Desk</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] text-slate-500 font-mono">
              Bureaus: NY &bull; LDN &bull; DEL &bull; TKY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
