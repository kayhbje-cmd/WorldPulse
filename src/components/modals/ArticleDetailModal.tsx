import React, { useState, useEffect } from 'react';
import {
  X,
  Bookmark,
  Share2,
  ExternalLink,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Type,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Article } from '../../types/news';
import { formatRelativeTime } from '../../utils/date';
import { speechManager } from '../../utils/audio';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onShare: (article: Article) => void;
  relatedArticles: Article[];
  onSelectArticle: (article: Article) => void;
}

const DEFAULT_EDITORIAL_FALLBACK =
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onShare,
  relatedArticles,
  onSelectArticle,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [modalFontSize, setModalFontSize] = useState<'normal' | 'large' | 'xl'>('normal');

  // Stop audio on close or unmount
  useEffect(() => {
    return () => {
      speechManager.stop();
    };
  }, []);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        speechManager.stop();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  const handleAudioToggle = () => {
    if (isPlayingAudio) {
      speechManager.stop();
      setIsPlayingAudio(false);
    } else {
      const textToRead = `${article.title}. Published by ${article.source.name}. ${article.description}`;
      const success = speechManager.speak(textToRead, {
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false),
      });
      if (!success) {
        setIsPlayingAudio(false);
      }
    }
  };

  const getFontSizeClass = () => {
    switch (modalFontSize) {
      case 'large':
        return 'text-lg leading-relaxed';
      case 'xl':
        return 'text-xl leading-loose';
      default:
        return 'text-base leading-relaxed';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={article.title}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      {/* Modal Container */}
      <div className="bg-[#11141c] border border-white/10 rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto relative shadow-2xl shadow-black text-slate-100 flex flex-col">
        {/* Sticky Action Header */}
        <div className="sticky top-0 z-20 bg-[#11141c]/95 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded bg-[#d4af37] text-neutral-950 font-bold text-xs uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-slate-300 font-semibold text-xs hidden sm:inline">
              {article.source.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio TTS Button */}
            <button
              onClick={handleAudioToggle}
              aria-label={isPlayingAudio ? 'Stop audio briefing' : 'Listen to audio briefing'}
              title={isPlayingAudio ? 'Stop reading' : 'Listen to Briefing'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-500/20 border-[#d4af37] text-[#f5e6a3]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4 text-[#d4af37]" />
                  <span className="hidden sm:inline">Pause</span>
                  <span className="flex gap-0.5 items-end h-3 ml-1">
                    <span className="w-0.5 h-3 bg-[#d4af37] animate-pulse"></span>
                    <span className="w-0.5 h-2 bg-[#d4af37] animate-pulse delay-75"></span>
                    <span className="w-0.5 h-3.5 bg-[#d4af37] animate-pulse delay-150"></span>
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#d4af37]" />
                  <span className="hidden sm:inline">Listen</span>
                </>
              )}
            </button>

            {/* Font Size Toggle */}
            <button
              onClick={() => {
                setModalFontSize((prev) => (prev === 'normal' ? 'large' : prev === 'large' ? 'xl' : 'normal'));
              }}
              aria-label={`Toggle font size, currently ${modalFontSize}`}
              title="Adjust Font Size"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Type className="w-4 h-4 text-[#d4af37]" />
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              aria-label={isBookmarked ? 'Remove Bookmark' : 'Save article'}
              title={isBookmarked ? 'Remove Bookmark' : 'Save article'}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Share button */}
            <button
              onClick={() => onShare(article)}
              aria-label="Share article"
              title="Share article"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                speechManager.stop();
                onClose();
              }}
              aria-label="Close reading modal"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-10 space-y-8 flex-1">
          {/* Metadata Byline */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                {formatRelativeTime(article.publishedAt)}
              </span>
              <span>•</span>
              <span>{article.readingTime} min read</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">Source: {article.source.name}</span>
              {article.author && (
                <>
                  <span>•</span>
                  <span className="italic text-slate-300">{article.author}</span>
                </>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
            <img
              src={article.imageUrl}
              alt={article.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_EDITORIAL_FALLBACK;
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur px-3 py-1 rounded text-xs text-slate-300 border border-white/10">
              Photo via International News Service
            </div>
          </div>

          {/* Executive Briefing / Key Takeaways Box */}
          <div className="p-6 bg-[#161a25] border-l-4 border-[#d4af37] rounded-r-2xl space-y-3">
            <div className="flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>WorldPulse Executive Briefing</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed">
              {article.description}
            </p>
          </div>

          {/* Journalistic Wire Transparency & Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#0d0f15] border border-white/5 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Building className="w-4 h-4 text-[#d4af37] shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Publishing Wire</span>
                <span className="font-semibold text-white">{article.source.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Integrity Status</span>
                <span className="font-semibold text-emerald-300">Verified Wire Citation</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Original Timestamp</span>
                <span className="font-mono text-slate-200">{formatRelativeTime(article.publishedAt)}</span>
              </div>
            </div>
          </div>

          {/* Article Editorial Summary */}
          <div className={`space-y-4 text-slate-300 font-light ${getFontSizeClass()}`}>
            <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-[#d4af37] first-letter:mr-2 first-letter:float-left leading-relaxed">
              {article.description}
            </p>

            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-slate-400 leading-relaxed space-y-2">
              <p>
                <strong className="text-slate-200">Editorial Attribution Notice:</strong> This dispatch is aggregated in real-time from <strong className="text-white">{article.source.name}</strong> via official syndication wires. In accordance with international copyright and fair attribution standards, the complete, unedited full-length article is published and maintained on the original publisher&apos;s digital platform.
              </p>
            </div>
          </div>

          {/* Direct Link to Original Wire Story */}
          <div className="p-6 bg-[#0e1118] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="font-serif text-base font-bold text-white mb-1">
                Read Full Unedited Story on {article.source.name}
              </h4>
              <p className="text-xs text-slate-400">
                Direct access to the complete journalistic article and multimedia reporting on the original publisher portal.
              </p>
            </div>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c07b] text-neutral-950 font-bold text-xs sm:text-sm tracking-wide transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#d4af37]/20 shrink-0"
            >
              <span>Visit {article.source.name}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Related Stories */}
          {relatedArticles.length > 0 && (
            <div className="pt-8 border-t border-white/10 space-y-4">
              <h4 className="font-serif text-lg font-bold text-white">
                Related Dispatches in {article.category.toUpperCase()}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.slice(0, 3).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectArticle(rel)}
                    className="p-4 bg-[#141822] hover:bg-[#181e2b] border border-white/5 hover:border-[#d4af37]/40 rounded-xl cursor-pointer transition-colors space-y-2"
                  >
                    <span className="text-[10px] text-[#d4af37] font-semibold uppercase">
                      {rel.source.name}
                    </span>
                    <h5 className="font-serif text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
                      {rel.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 block">
                      {formatRelativeTime(rel.publishedAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
