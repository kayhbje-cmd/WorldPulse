import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid corporate or personal email address.');
      return;
    }

    setError('');
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#d4af37', '#f5e6a3', '#ffffff'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <section className="my-10 sm:my-16 bg-gradient-to-br from-[#141824] via-[#10131b] to-[#0a0c12] border border-[#d4af37]/30 rounded-3xl p-5 sm:p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-black/70">
      {/* Background radial gold glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#f5e6a3] text-xs uppercase tracking-widest font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          Executive Intelligence
        </div>

        <h3 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3 sm:mb-4 leading-tight">
          The WorldPulse Morning Dispatch
        </h3>

        <p className="text-slate-300 text-xs sm:text-base font-light leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto">
          Delivered every morning at 06:00 UTC. An uncompromised briefing on global markets, diplomatic shifts, Indian economic corridors, and critical technological breakthroughs.
        </p>

        {isSubmitted ? (
          <div className="p-4 sm:p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-center gap-3 text-emerald-300 animate-in fade-in duration-300">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-left">
              <h4 className="font-semibold text-white text-sm">Welcome to the WorldPulse Executive Registry</h4>
              <p className="text-xs text-emerald-300/80">Your morning dispatch will commence with the upcoming global news cycle.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                aria-label="Email address for morning dispatch"
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 bg-[#0d0f15] border border-white/15 focus:border-[#d4af37] rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#c59e2b] hover:from-[#e5c07b] hover:to-[#d4af37] text-neutral-950 font-bold rounded-xl text-sm transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#d4af37]/25 flex items-center justify-center gap-2 shrink-0 min-h-[44px]"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {error && <p className="text-rose-400 text-xs mt-3">{error}</p>}

        <p className="text-[11px] text-slate-500 mt-5">
          Zero advertising spam. Immediate one-click cancellation. Strictly editorial news intelligence.
        </p>
      </div>
    </section>
  );
};
