import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { Article } from '../../types/news';

interface ShareModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ article, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && article) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [article, onClose]);

  if (!article) return null;

  const shareUrl = article.url && article.url !== '#' ? article.url : window.location.href;
  const shareTitle = article.title;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareTitle} - Read on WorldPulse: ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOptions = [
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'WhatsApp',
      icon: 'WA',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} - ${shareUrl}`)}`,
    },
    {
      name: 'Telegram',
      icon: 'TG',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share article dialog"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-[#11141c] border border-white/10 rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl shadow-black text-slate-100 space-y-5 sm:space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-white">Share Dispatch</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close share dialog"
            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <span className="text-[10px] text-[#d4af37] uppercase font-bold">{article.category}</span>
          <h4 className="font-serif text-xs sm:text-sm font-semibold text-white line-clamp-2 mt-1">
            {article.title}
          </h4>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400">Direct Article Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              aria-label="Article share URL"
              className="w-full bg-[#0b0d13] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none min-h-[38px]"
            />
            <button
              onClick={handleCopy}
              aria-label={copied ? 'URL copied to clipboard' : 'Copy URL to clipboard'}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 min-h-[38px] ${
                copied
                  ? 'bg-emerald-500 text-neutral-950 font-bold'
                  : 'bg-[#d4af37] hover:bg-[#e5c07b] text-neutral-950'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-1 sm:pt-2">
          {shareOptions.map((opt) => (
            <a
              key={opt.name}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${opt.name}`}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-200 hover:text-white transition-colors cursor-pointer min-h-[42px]"
            >
              <span className="font-bold text-[#d4af37] font-mono">{opt.icon}</span>
              <span>{opt.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
