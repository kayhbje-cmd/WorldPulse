import React from 'react';
import {
  ShieldCheck,
  Lock,
  Database,
  ExternalLink,
  EyeOff,
  ArrowLeft,
  AlertTriangle,
  FileText,
  Trash2,
} from 'lucide-react';

interface PrivacyPageProps {
  onBackToNews: () => void;
  onClearBookmarks?: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBackToNews, onClearBookmarks }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Top navigation */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <button
          onClick={onBackToNews}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-[#d4af37] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Live News Wire</span>
        </button>

        <span className="text-xs text-[#d4af37] uppercase tracking-widest font-mono font-semibold">
          Transparency &bull; Privacy Charter
        </span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Data Governance &amp; Reader Privacy</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-black text-white leading-tight">
          WorldPulse Privacy &amp; Data Charter
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm font-mono">
          Last Updated: October 2026 &bull; Scope: Client &amp; Production Serverless Deployments
        </p>
      </div>

      {/* Explicit Legal Compliance Disclaimer */}
      <div className="p-5 rounded-2xl bg-[#161a25] border border-amber-500/30 flex items-start gap-3.5 text-xs text-slate-300">
        <AlertTriangle className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white block font-semibold">
            Technical Transparency &amp; Non-Representation Notice
          </strong>
          <p className="text-slate-400 leading-relaxed font-light">
            This document accurately details the actual data collection, browser storage, and network behavior of the WorldPulse codebase. We do not make unsubstantiated claims of formal regulatory compliance (such as GDPR, CCPA, or HIPAA certification) without a certified legal audit by the entity deploying the application.
          </p>
        </div>
      </div>

      {/* Section 1: What We Do NOT Collect */}
      <div className="p-8 rounded-2xl bg-[#11141c] border border-white/10 space-y-4">
        <div className="flex items-center gap-2.5 text-white font-serif font-bold text-lg">
          <EyeOff className="w-5 h-5 text-emerald-400" />
          <h2>1. Data We Do Not Collect</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          WorldPulse is designed from the ground up as an open, accessible international news reader:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
          <li className="p-3 bg-[#090a0f] rounded-xl border border-white/5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span>No user accounts or password databases</span>
          </li>
          <li className="p-3 bg-[#090a0f] rounded-xl border border-white/5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span>No cross-site advertising tracker pixels</span>
          </li>
          <li className="p-3 bg-[#090a0f] rounded-xl border border-white/5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span>No credit card or payment data processing</span>
          </li>
          <li className="p-3 bg-[#090a0f] rounded-xl border border-white/5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span>No commercial sale of reader behavioral data</span>
          </li>
        </ul>
      </div>

      {/* Section 2: Browser LocalStorage Usage */}
      <div className="p-8 rounded-2xl bg-[#11141c] border border-white/10 space-y-4">
        <div className="flex items-center gap-2.5 text-white font-serif font-bold text-lg">
          <Database className="w-5 h-5 text-[#d4af37]" />
          <h2>2. Local Storage on Your Device (Browser LocalStorage)</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          To provide personalization without requiring an account or server database, WorldPulse stores the following non-sensitive preferences directly in your web browser:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-white/10 rounded-xl overflow-hidden">
            <thead className="bg-[#161a25] text-slate-300 font-semibold border-b border-white/10">
              <tr>
                <th className="p-3">Storage Key</th>
                <th className="p-3">Purpose</th>
                <th className="p-3">Transmission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-400">
              <tr>
                <td className="p-3 font-mono text-[#f5e6a3]">worldpulse_saved_articles_v1</td>
                <td className="p-3">Stores the IDs of articles you choose to bookmark</td>
                <td className="p-3 text-emerald-400">Never transmitted (Device only)</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-[#f5e6a3]">worldpulse_news_edition</td>
                <td className="p-3">Remembers your chosen regional wire focus (Global, India, US, UK)</td>
                <td className="p-3 text-emerald-400">Never transmitted (Device only)</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-[#f5e6a3]">worldpulse_font_size</td>
                <td className="p-3">Remembers your preferred reading font scale (Normal, Large, XL)</td>
                <td className="p-3 text-emerald-400">Never transmitted (Device only)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed font-light pt-2">
          You can delete this data at any time by clearing your browser cache or clicking "Clear All" in the Saved Articles drawer.
        </p>
      </div>

      {/* Section 3: Serverless Edge API & Caching */}
      <div className="p-8 rounded-2xl bg-[#11141c] border border-white/10 space-y-4">
        <div className="flex items-center gap-2.5 text-white font-serif font-bold text-lg">
          <Lock className="w-5 h-5 text-blue-400" />
          <h2>3. Serverless API Routing &amp; Feed Caching</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          When you request news updates, our serverless function (<code className="text-[#d4af37] font-mono">/api/news</code>) proxies public RSS feeds (Google News and BBC World Service) to prevent cross-origin browser blocking. 
        </p>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
          Responses are cached at the CDN edge (<code className="text-[#d4af37] font-mono">s-maxage=120, stale-while-revalidate=300</code>) to minimize server load. Serverless function logs are temporary operational traces provided by the hosting provider (Vercel/Netlify) and are not used by WorldPulse to profile visitors.
        </p>
      </div>

      {/* Section 4: External Publishers */}
      <div className="p-8 rounded-2xl bg-[#11141c] border border-white/10 space-y-4">
        <div className="flex items-center gap-2.5 text-white font-serif font-bold text-lg">
          <ExternalLink className="w-5 h-5 text-[#d4af37]" />
          <h2>4. External Publisher Links &amp; Third Parties</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          WorldPulse provides direct links to original publishing sources (such as Reuters, BBC, The Hindu, AP, Bloomberg). Once you click an external link to read the full story on an external publisher's domain, you are subject to that publisher's own independent privacy policy, cookies, and terms of service.
        </p>
      </div>

      {/* Section 5: Newsletter Demonstration Form */}
      <div className="p-8 rounded-2xl bg-[#11141c] border border-white/10 space-y-4">
        <div className="flex items-center gap-2.5 text-white font-serif font-bold text-lg">
          <FileText className="w-5 h-5 text-purple-400" />
          <h2>5. Newsletter Signups &amp; Contact Inquiries</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          The email newsletter signup box and the editorial contact form operate in frontend demonstration mode. Submitted inputs are not forwarded to commercial email distributors or marketing agencies unless an enterprise deployment explicitly configures an email provider.
        </p>
      </div>

      {/* Back button at bottom */}
      <div className="pt-6 border-t border-white/10 text-center">
        <button
          onClick={onBackToNews}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c07b] text-neutral-950 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#d4af37]/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to WorldPulse Front Page</span>
        </button>
      </div>
    </div>
  );
};
