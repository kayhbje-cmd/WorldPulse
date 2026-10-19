import React, { useState } from 'react';
import {
  Mail,
  Send,
  Building,
  MapPin,
  Clock,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { WORLD_CLOCKS, getFormattedCityTime } from '../../utils/date';

interface ContactPageProps {
  onBackToNews: () => void;
}

interface ContactFormState {
  fullName: string;
  email: string;
  organization: string;
  inquiryType: string;
  subject: string;
  message: string;
}

const INITIAL_FORM: ContactFormState = {
  fullName: '',
  email: '',
  organization: '',
  inquiryType: 'editorial',
  subject: '',
  message: '',
};

export const ContactPage: React.FC<ContactPageProps> = ({ onBackToNews }) => {
  const [formData, setFormData] = useState<ContactFormState>(INITIAL_FORM);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, a valid email address, and your message.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage('Please enter a valid email address format (e.g. name@organization.com).');
      return;
    }

    // Submit state triggers the honest disclosure notice
    setFormSubmitted(true);
  };

  const handleCopyDraft = () => {
    const draftText = `WORLD PULSE INQUIRY DRAFT
From: ${formData.fullName} (${formData.email})
Organization: ${formData.organization || 'Independent'}
Topic: ${formData.inquiryType}
Subject: ${formData.subject || 'Editorial Inquiry'}
---
Message:
${formData.message}
`;
    navigator.clipboard.writeText(draftText).then(() => {
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 3000);
    });
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM);
    setFormSubmitted(false);
    setCopiedDraft(false);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Back button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
        <button
          onClick={onBackToNews}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer group min-h-[38px]"
        >
          <ArrowLeft className="w-4 h-4 text-[#d4af37] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Live News Wire</span>
        </button>

        <span className="text-xs text-[#d4af37] uppercase tracking-widest font-mono font-semibold">
          Communications &bull; Editorial Liaison
        </span>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121622] via-[#0d1017] to-[#090a0f] border border-white/10 p-5 sm:p-12 shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest">
            <Mail className="w-3.5 h-3.5" />
            <span>Editorial Bureau &amp; Public Inquiries</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            Connect with WorldPulse
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
            We welcome corrections, syndicated press releases, editorial suggestions, and technology inquiries. Please review our transmission channels below.
          </p>
        </div>
      </div>

      {/* Main Grid: Form + Bureau Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form Container (7 cols) */}
        <div className="lg:col-span-7 bg-[#11141c] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-2xl space-y-6">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
              Dispatch an Editorial Inquiry
            </h2>
            <p className="text-xs text-slate-400">
              Provide your details and inquiry topic for routing to the appropriate news desk.
            </p>
          </div>

          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Honest Submission Feedback State */}
          {formSubmitted ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1118] border border-[#d4af37]/40 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 text-[#d4af37]">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Demonstration Mode Notice
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Live Email Gateway Status: Not Configured
                  </span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 font-light">
                <p>
                  Thank you, <strong className="text-white">{formData.fullName}</strong>. Your inquiry regarding <strong className="text-[#f5e6a3]">{formData.subject || formData.inquiryType}</strong> has been structured.
                </p>
                <p className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-slate-400">
                  <strong className="text-slate-200">System Disclosure:</strong> This project is running as a demonstration and client presentation build. In accordance with strict development integrity, we do not invent a fictitious email address or pretend emails are sent when no live SMTP provider (such as SendGrid or Resend) is connected.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
                >
                  {copiedDraft ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Draft Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#d4af37]" />
                      <span>Copy Inquiry Draft</span>
                    </>
                  )}
                </button>

                <a
                  href="https://github.com/kayhbje-cmd/WorldPulse/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c07b] text-neutral-950 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-[#d4af37]/20"
                >
                  <span>Open Inquiry on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer ml-auto"
                >
                  Reset Form
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name <span className="text-[#d4af37]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Jane Doe"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/10 text-slate-100 placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address <span className="text-[#d4af37]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@organization.com"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/10 text-slate-100 placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Organization / Affiliation (Optional)
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="e.g. Financial Times, Independent Reader"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/10 text-slate-100 placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Inquiry Desk <span className="text-[#d4af37]">*</span>
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-[#d4af37] transition-colors cursor-pointer"
                  >
                    <option value="editorial">Editorial Desk &amp; News Tips</option>
                    <option value="corrections">Corrections &amp; Fact-Checking</option>
                    <option value="syndication">Wire Syndication &amp; API Integration</option>
                    <option value="commercial">Commercial Inquiries &amp; Partnerships</option>
                    <option value="client-demo">Client Demo Feedback &amp; Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Summary of your inquiry or feedback"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090a0f] border border-white/10 text-slate-100 placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Message / Dispatch Content <span className="text-[#d4af37]">*</span>
                </label>
                <textarea
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message, news tip, or technical question here..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#090a0f] border border-white/10 text-slate-100 placeholder:text-slate-600 text-xs focus:outline-none focus:border-[#d4af37] transition-colors resize-y leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Protected by WorldPulse Privacy Charter
                </span>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c07b] text-neutral-950 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#d4af37]/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Editorial Dispatch</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Global Bureaus & Technical Verification (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Synchronized Exchange Bureaus */}
          <div className="bg-[#11141c] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-slate-200 font-serif font-bold text-lg">
              <Building className="w-5 h-5 text-[#d4af37]" />
              <h3>Synchronized Editorial Bureaus</h3>
            </div>

            <p className="text-xs text-slate-400 font-light leading-relaxed">
              WorldPulse monitors international press releases and regulatory wires 24 hours a day across key timezones:
            </p>

            <div className="space-y-3">
              {WORLD_CLOCKS.map((clock) => (
                <div
                  key={clock.city}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#090a0f] border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span className="font-semibold text-slate-200">{clock.city} Bureau</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-[#f5e6a3]">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{getFormattedCityTime(clock.timeZone)} {clock.code}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Codebase & Repository Access */}
          <div className="bg-[#0e1118] border border-white/10 rounded-2xl p-6 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white">
              Official Project Repository
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              For code contributions, security vulnerability reports, or pull requests, please use the official GitHub repository:
            </p>
            <a
              href="https://github.com/kayhbje-cmd/WorldPulse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#d4af37] hover:text-[#f5e6a3] transition-colors"
            >
              <span>github.com/kayhbje-cmd/WorldPulse</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
