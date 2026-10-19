import React from 'react';
import {
  Code2,
  Globe,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Layers,
  Palette,
  Compass,
  Rocket,
  ShieldCheck,
  Utensils,
  Briefcase,
  User,
  ArrowRight,
  Smartphone,
  Gauge,
  Clock,
  Terminal,
} from 'lucide-react';

interface PortfolioPageProps {
  onBackToNews: () => void;
  onNavigateToContact: () => void;
}

interface ServiceCard {
  icon: React.ElementType;
  title: string;
  badge: string;
  description: string;
  deliverables: string[];
}

interface ProjectConcept {
  title: string;
  badge: string;
  category: string;
  description: string;
  plannedFeatures: string[];
  techStack: string[];
}

const SERVICES: ServiceCard[] = [
  {
    icon: Briefcase,
    title: 'Business Websites',
    badge: 'Core Service',
    description:
      'Professional, high-trust websites built for small businesses, contractors, and service providers looking to build credibility and convert visitors into client inquiries.',
    deliverables: [
      'Clean hero section with clear value proposition',
      'Services & offerings breakdown with clear pricing/packages',
      'Integrated inquiry & lead capture form',
      'Google Maps, business hours & contact details',
      '100% mobile-responsive layout across all screen sizes',
      'Fast loading speeds with zero layout shifts',
    ],
  },
  {
    icon: Utensils,
    title: 'Restaurant & Cafe Websites',
    badge: 'Popular',
    description:
      'Appetizing, mobile-first websites designed for restaurants, cafes, and bakeries so customers can easily view menus, find opening hours, and get directions on their phones.',
    deliverables: [
      'Mobile-friendly digital food & drink menus',
      'Opening hours, location maps & click-to-call actions',
      'Dietary & allergen badge indicators (Vegan, GF, etc.)',
      'Photo gallery showcasing dishes and dining ambiance',
      'Direct table reservation or booking inquiry button',
      'Easy-to-update menu items and seasonal specials',
    ],
  },
  {
    icon: User,
    title: 'Personal & Portfolio Websites',
    badge: 'Tailored',
    description:
      'Distinctive, editorial digital portfolios for freelancers, photographers, designers, and professionals who want to highlight their work, experience, and story.',
    deliverables: [
      'Interactive project showcases with live links',
      'Structured biography, career timeline & skills section',
      'Downloadable resume / CV integration',
      'Custom editorial styling matching your personal brand',
      'Direct contact CTA to receive commissions or inquiries',
      'Optimized performance and seamless mobile browsing',
    ],
  },
];

const FUTURE_CONCEPTS: ProjectConcept[] = [
  {
    title: 'Modern Restaurant & Dining Showcase',
    badge: 'Concept / In Development',
    category: 'Culinary & Hospitality',
    description:
      'A dedicated restaurant template featuring categorized digital menus, quick-call buttons, location directions, and customer reservation inquiries.',
    plannedFeatures: [
      'Interactive menu tabs (Appetizers, Mains, Drinks)',
      'Direct click-to-call and Google Maps routing',
      'Seasonal special highlights banner',
    ],
    techStack: ['React', 'Tailwind CSS', 'Mobile First', 'Fast Load'],
  },
  {
    title: 'Boutique Corporate & Professional Practice',
    badge: 'Concept / In Development',
    category: 'Business & Agency',
    description:
      'A streamlined corporate landing page designed for consultancies, law practices, and local service providers with structured lead generation.',
    plannedFeatures: [
      'Service tier breakdowns with transparent deliverables',
      'Client inquiry modal with input validation',
      'Trust badges & professional credential showcases',
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Accessible'],
  },
  {
    title: 'Editorial Creator & Journalist Portfolio',
    badge: 'Concept / In Development',
    category: 'Creative & Editorial',
    description:
      'A clean, typography-focused showcase designed for independent writers, journalists, or photographers seeking a distraction-free portfolio.',
    plannedFeatures: [
      'Article / photo essay archive with reading times',
      'Minimalist dark/light editorial typography',
      'Direct syndication or commission contact channel',
    ],
    techStack: ['React', 'Vite', 'Editorial Fonts', 'Responsive'],
  },
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Discovery & Planning',
    icon: Compass,
    description:
      'We discuss your business needs, goals, preferred style, target audience, and required pages. We outline the structure and gather your content.',
  },
  {
    step: '02',
    title: 'Design & Wireframing',
    icon: Palette,
    description:
      'We craft a clean, intuitive layout with modern typography, cohesive colors, and mobile responsiveness tailored to your specific industry.',
  },
  {
    step: '03',
    title: 'Clean Development',
    icon: Code2,
    description:
      'We build your site with modern standards using React and Tailwind CSS, focusing on semantic accessibility, fast load times, and cross-browser testing.',
  },
  {
    step: '04',
    title: 'Launch & Handoff',
    icon: Rocket,
    description:
      'We deploy your website to high-speed cloud hosting (Vercel or Netlify), connect your custom domain, and ensure everything runs smoothly.',
  },
];

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onBackToNews,
  onNavigateToContact,
}) => {
  return (
    <div className="space-y-16 sm:space-y-20 animate-in fade-in duration-300">
      {/* 1. Breadcrumb & Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
        <button
          onClick={onBackToNews}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer group min-h-[38px]"
        >
          <ArrowLeft className="w-4 h-4 text-[#d4af37] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Live News Wire</span>
        </button>

        <span className="text-xs text-[#d4af37] uppercase tracking-widest font-mono font-semibold flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Web Development &bull; Engineering Dossier</span>
        </span>
      </div>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121622] via-[#0d1017] to-[#090a0f] border border-white/10 p-6 sm:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Web Development Services</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Modern, High-Performance Websites Built for Growing Businesses.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
            Hello, I am a dedicated web developer focused on crafting clean, responsive, and
            reliable websites for businesses, restaurants, and independent professionals. I believe
            websites should be fast, easy to navigate, visually refined, and built with maintainable
            code.
          </p>

          {/* Core Strengths Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left">
              <Smartphone className="w-4 h-4 text-[#d4af37] mb-1.5" />
              <div className="text-xs font-semibold text-white">Mobile-First</div>
              <div className="text-[11px] text-slate-400">Flawless on all phones</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left">
              <Gauge className="w-4 h-4 text-emerald-400 mb-1.5" />
              <div className="text-xs font-semibold text-white">Fast Speeds</div>
              <div className="text-[11px] text-slate-400">Lightweight &amp; snappy</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left">
              <Code2 className="w-4 h-4 text-sky-400 mb-1.5" />
              <div className="text-xs font-semibold text-white">Clean Code</div>
              <div className="text-[11px] text-slate-400">Easy to maintain</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left">
              <ShieldCheck className="w-4 h-4 text-amber-400 mb-1.5" />
              <div className="text-xs font-semibold text-white">Transparent</div>
              <div className="text-[11px] text-slate-400">Honest collaboration</div>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c07b] text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-[#d4af37]/20 min-h-[44px]"
            >
              <span>Explore Live Project</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onNavigateToContact}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer min-h-[44px]"
            >
              <span>Discuss Your Website</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Featured Live Project: WorldPulse */}
      <section id="projects" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-[#d4af37] mb-1">
              Production Showcase
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Featured Live Web Application
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Fully functioning production deployment
          </span>
        </div>

        <div className="rounded-3xl bg-[#11141c] border border-white/10 overflow-hidden hover:border-[#d4af37]/40 transition-colors shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Project Details (7 cols) */}
            <div className="p-6 sm:p-10 lg:col-span-7 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Production Project
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-mono">
                    Full-Stack SPA
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                  WorldPulse &bull; International News &amp; Intelligence Wire
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                  A high-performance news wire website delivering real-time geopolitical, financial,
                  and technological journalism from verified international sources. Designed with a
                  luxury editorial dark aesthetic, instant search, and zero-layout-shift responsive
                  formatting.
                </p>

                {/* Key Architectural Highlights */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                    Key Features Built:
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>Live multi-region RSS parsing across 10 desks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>Zero-layout-shift responsive design on all devices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>Fast client-side full-text search with ⌘K modal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>Offline local storage bookmark drawer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>Serverless edge endpoints on Vercel &amp; Netlify</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>Live rotating international clocks &amp; market ticker</span>
                    </li>
                  </ul>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['React 19', 'TypeScript', 'Tailwind CSS v4', 'Vite 8', 'Lucide Icons', 'Zod', 'Serverless Edge'].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
                <a
                  href="https://worldpulse-news-dun.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c07b] text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-[#d4af37]/20 min-h-[40px]"
                >
                  <span>Open Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={onBackToNews}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer min-h-[40px]"
                >
                  <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Browse Wire Locally</span>
                </button>
              </div>
            </div>

            {/* Visual Preview / Tech Spec Column (5 cols) */}
            <div className="bg-[#090a0f] border-t lg:border-t-0 lg:border-l border-white/10 p-6 sm:p-10 lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] font-mono">
                  Live Technical Metrics
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Hosting &amp; Edge</span>
                    <span className="text-xs font-mono text-white font-semibold">Vercel &amp; Netlify</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Production Build</span>
                    <span className="text-xs font-mono text-emerald-400 font-semibold">&lt; 1.5s Optimized</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Automated Unit Tests</span>
                    <span className="text-xs font-mono text-emerald-400 font-semibold">16 / 16 Passing</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Responsive Breakpoints</span>
                    <span className="text-xs font-mono text-white font-semibold">320px to 1440px+</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-slate-400">External Dependencies</span>
                    <span className="text-xs font-mono text-white font-semibold">100% Free &amp; Open Source</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141824] border border-[#d4af37]/20 space-y-2 text-xs">
                <div className="text-[#d4af37] font-semibold flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Looking for similar architecture?</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  I can build custom data-driven websites, landing pages, or multi-section portals
                  incorporating live APIs, responsive styling, and fast deployment for your company.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Future Projects & Concept Architecture */}
      <section className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <div className="text-[11px] uppercase tracking-widest font-bold text-[#d4af37] mb-1">
            Pipeline &bull; Honest Concept Cards
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Upcoming Project Concepts
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Clearly labeled concept prototypes currently being designed and developed. No
            fabricated clients, fake reviews, or invented case studies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FUTURE_CONCEPTS.map((concept) => (
            <div
              key={concept.title}
              className="p-6 rounded-2xl bg-[#11141c] border border-white/10 space-y-4 hover:border-[#d4af37]/40 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-mono font-bold uppercase tracking-wider">
                    {concept.badge}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">{concept.category}</span>
                </div>

                <h3 className="font-serif text-lg font-bold text-white leading-snug">
                  {concept.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {concept.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="text-[10px] uppercase font-mono font-semibold text-slate-400">
                    Planned Focus:
                  </div>
                  {concept.plannedFeatures.map((feat) => (
                    <div key={feat} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                {concept.techStack.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Services Section */}
      <section className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <div className="text-[11px] uppercase tracking-widest font-bold text-[#d4af37] mb-1">
            What I Can Build For You
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Web Development Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Specialized website creation for small businesses, restaurants, and independent
            professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.title}
                className="p-6 sm:p-8 rounded-2xl bg-[#11141c] border border-white/10 space-y-5 hover:border-[#d4af37]/40 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white">{srv.title}</h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                    {srv.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="text-[11px] uppercase font-mono font-semibold text-slate-300">
                      What's Included:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      {srv.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={onNavigateToContact}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/40 text-xs font-semibold text-slate-200 hover:text-[#f5e6a3] transition-all cursor-pointer min-h-[40px]"
                  >
                    <span>Request Details for {srv.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Development Process Section */}
      <section className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <div className="text-[11px] uppercase tracking-widest font-bold text-[#d4af37] mb-1">
            How We Work Together
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            A Straightforward 4-Step Process
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Transparent collaboration from your initial idea to live launch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="p-6 rounded-2xl bg-[#11141c] border border-white/10 space-y-4 hover:border-[#d4af37]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-black text-[#d4af37]/60">
                    {step.step}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-serif text-base font-bold text-white">{step.title}</h3>

                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Skills & Philosophy Section */}
      <section className="p-6 sm:p-10 rounded-3xl bg-[#11141c] border border-white/10 space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="text-[11px] uppercase tracking-widest font-bold text-[#d4af37]">
            Core Philosophy &amp; Stack
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Built with Modern Standards, Not Heavy Bloat
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
            I build websites using fast, modern technologies that are reliable and free to host on
            modern platforms. No hidden lock-in, no complicated subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'React 19', tag: 'UI Library' },
            { name: 'TypeScript', tag: 'Type Safety' },
            { name: 'Tailwind CSS', tag: 'Modern Styling' },
            { name: 'Vite 8', tag: 'Fast Bundling' },
            { name: 'Vercel / Netlify', tag: 'Global Hosting' },
            { name: 'Git & GitHub', tag: 'Version Control' },
          ].map((item) => (
            <div
              key={item.name}
              className="p-3 rounded-xl bg-white/5 border border-white/5 text-center space-y-1"
            >
              <div className="text-xs font-semibold text-white truncate">{item.name}</div>
              <div className="text-[10px] text-slate-500 font-mono">{item.tag}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Call to Action / Contact Notice */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#141824] via-[#0d1017] to-[#090a0f] border border-[#d4af37]/30 p-6 sm:p-12 text-center space-y-6 shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start a Project</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            Have a website project you would like to discuss?
          </h2>

          <p className="text-xs sm:text-base text-slate-300 font-light leading-relaxed">
            Whether you are launching a business, opening a restaurant, or refreshing your personal
            portfolio, I would be glad to discuss your project requirements.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateToContact}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c07b] text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-[#d4af37]/20 min-h-[44px] cursor-pointer"
            >
              <span>Submit Project Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBackToNews}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer min-h-[44px]"
            >
              <span>Return to News Wire</span>
            </button>
          </div>

          {/* Honest transparency notice regarding contact form */}
          <p className="text-[11px] text-slate-400 font-mono pt-4 border-t border-white/10 max-w-lg mx-auto">
            * Note: Inquiries link to our Communications Desk. Direct communication channel active;
            automated email delivery is not claimed.
          </p>
        </div>
      </section>
    </div>
  );
};
