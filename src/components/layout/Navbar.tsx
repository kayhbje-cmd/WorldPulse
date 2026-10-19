import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bookmark,
  Globe,
  Clock,
  Menu,
  X,
  Type,
  ChevronDown,
  Layers,
  Info,
  Mail,
  Home,
} from 'lucide-react';
import { EditionType, CategoryId, ActiveView } from '../../types/news';
import { CATEGORIES } from '../../data/categories';
import { formatFullDate, WORLD_CLOCKS, getFormattedCityTime } from '../../utils/date';

interface NavbarProps {
  currentEdition: EditionType;
  onSelectEdition: (edition: EditionType) => void;
  bookmarkCount: number;
  onOpenBookmarks: () => void;
  onOpenSearch: () => void;
  fontSize: 'normal' | 'large' | 'xl';
  onToggleFontSize: () => void;
  onSelectCategory?: (id: CategoryId) => void;
  currentView?: ActiveView;
  onNavigateView?: (view: ActiveView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentEdition,
  onSelectEdition,
  bookmarkCount,
  onOpenBookmarks,
  onOpenSearch,
  fontSize,
  onToggleFontSize,
  onSelectCategory,
  currentView = 'home',
  onNavigateView,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editionDropdownOpen, setEditionDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeClockIndex, setActiveClockIndex] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotate featured world city every 8 seconds
  useEffect(() => {
    const clockRotator = setInterval(() => {
      setActiveClockIndex((prev) => (prev + 1) % WORLD_CLOCKS.length);
    }, 8000);
    return () => clearInterval(clockRotator);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setEditionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentClock = WORLD_CLOCKS[activeClockIndex];

  const editions: { id: EditionType; label: string; region: string }[] = [
    { id: 'global', label: 'International', region: 'Global Wire' },
    { id: 'india', label: 'India Edition', region: 'New Delhi Focus' },
    { id: 'us', label: 'US Edition', region: 'Washington & NY' },
    { id: 'uk', label: 'UK & Europe', region: 'London & Brussels' },
  ];

  return (
    <header className="bg-[#090a0f] border-b border-white/10 text-slate-100">
      {/* Top Editorial Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 border-b border-white/5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          {/* Formatted Date */}
          <span className="font-serif tracking-wide text-slate-300 hidden sm:inline">
            {formatFullDate(currentTime)}
          </span>

          <span className="text-white/20 hidden sm:inline">|</span>

          {/* Rotating World Clock */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-semibold text-slate-200">{currentClock.city}:</span>
            <span className="font-mono text-[11px] text-[#f5e6a3]">
              {getFormattedCityTime(currentClock.timeZone, currentTime)} {currentClock.code}
            </span>
          </div>
        </div>

        {/* Edition Selector & Reading Tools */}
        <div className="flex items-center gap-3">
          {/* Edition Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setEditionDropdownOpen((prev) => !prev)}
              aria-label="Select news edition"
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="font-medium capitalize">{editions.find((e) => e.id === currentEdition)?.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {editionDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-[#11141c] border border-white/10 rounded-lg shadow-2xl py-1.5 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-1 text-[10px] uppercase font-semibold text-[#d4af37] tracking-wider border-b border-white/5">
                  Select Regional Wire
                </div>
                {editions.map((ed) => (
                  <button
                    key={ed.id}
                    onClick={() => {
                      onSelectEdition(ed.id);
                      setEditionDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-white/5 transition-colors cursor-pointer ${
                      currentEdition === ed.id ? 'text-[#d4af37] font-semibold bg-white/[0.03]' : 'text-slate-300'
                    }`}
                  >
                    <span>{ed.label}</span>
                    <span className="text-[10px] text-slate-500">{ed.region}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size Adjuster */}
          <button
            onClick={onToggleFontSize}
            aria-label={`Toggle font size, currently ${fontSize}`}
            title={`Font Size: ${fontSize.toUpperCase()} (Click to change)`}
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <Type className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[11px] uppercase font-mono">{fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}</span>
          </button>
        </div>
      </div>

      {/* Main Masthead / Logo Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Center: Luxury Editorial Brand Logo */}
        <div className="flex-1 md:flex-initial text-center md:text-left">
          <button
            onClick={() => {
              onNavigateView?.('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] text-left cursor-pointer"
          >
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gradient-to-br from-[#d4af37] to-[#997b2f] flex items-center justify-center text-neutral-950 font-serif font-black text-base sm:text-lg shadow-lg shadow-[#d4af37]/20">
                W
              </div>
              <h1 className="font-brand text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wider text-white">
                WORLD<span className="text-[#d4af37] group-hover:text-[#f5e6a3] transition-colors">PULSE</span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] font-serif tracking-[0.25em] text-[#d4af37]/80 uppercase mt-1 text-center md:text-left">
              The Pulse of Global Affairs &bull; International Intelligence
            </p>
          </button>
        </div>

        {/* Right: View Navigation, Search & Bookmarks */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Editorial Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 mr-1" aria-label="Main Editorial Views">
            <button
              onClick={() => onNavigateView?.('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === 'home'
                  ? 'text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              Live Wire
            </button>
            <button
              onClick={() => onNavigateView?.('about')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === 'about'
                  ? 'text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              About
            </button>
            <button
              onClick={() => onNavigateView?.('contact')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === 'contact'
                  ? 'text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            aria-label="Search news wire"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#141824] hover:bg-[#1a2030] text-slate-300 hover:text-white border border-white/10 hover:border-[#d4af37]/40 transition-all text-xs cursor-pointer shadow-sm group"
          >
            <Search className="w-4 h-4 text-[#d4af37] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Search Wire...</span>
            <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-black/40 border border-white/10 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Bookmarks Button */}
          <button
            onClick={onOpenBookmarks}
            aria-label={`View saved articles, ${bookmarkCount} saved`}
            title="Saved Reading List"
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141824] hover:bg-[#1a2030] text-slate-300 hover:text-white border border-white/10 hover:border-[#d4af37]/40 transition-all text-xs cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-[#d4af37]" />
            <span className="hidden md:inline font-medium">Saved</span>
            {bookmarkCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 bg-[#d4af37] text-neutral-950 font-bold rounded-full text-[10px] min-w-4">
                {bookmarkCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0d0f15] px-4 py-5 space-y-5 animate-in slide-in-from-top duration-200">
          {/* Mobile View Navigation */}
          <div className="grid grid-cols-3 gap-2 pb-2 border-b border-white/10">
            <button
              onClick={() => {
                onNavigateView?.('home');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                currentView === 'home'
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f5e6a3]'
                  : 'bg-white/5 border-white/10 text-slate-300'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Live Wire</span>
            </button>
            <button
              onClick={() => {
                onNavigateView?.('about');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                currentView === 'about'
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f5e6a3]'
                  : 'bg-white/5 border-white/10 text-slate-300'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>About</span>
            </button>
            <button
              onClick={() => {
                onNavigateView?.('contact');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                currentView === 'contact'
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f5e6a3]'
                  : 'bg-white/5 border-white/10 text-slate-300'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Contact</span>
            </button>
          </div>

          {/* Mobile Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 hover:bg-white/10 cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#d4af37]" />
              <span>Search Wire</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookmarks();
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 hover:bg-white/10 cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-[#d4af37]" />
              <span>Saved ({bookmarkCount})</span>
            </button>
          </div>

          {/* Category Navigation in Mobile Drawer */}
          {onSelectCategory && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider px-1 py-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Sections &amp; Desks</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-2.5 py-1.5 rounded text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors truncate"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Edition Selection */}
          <div className="space-y-1 pt-2 border-t border-white/10">
            <div className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider px-1 py-1">
              Select Regional Wire Edition
            </div>
            <div className="grid grid-cols-2 gap-2">
              {editions.map((ed) => (
                <button
                  key={ed.id}
                  onClick={() => {
                    onSelectEdition(ed.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded text-xs text-left border cursor-pointer ${
                    currentEdition === ed.id
                      ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f5e6a3] font-semibold'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  <div>{ed.label}</div>
                  <div className="text-[10px] text-slate-500">{ed.region}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Font display size */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Font Size Preference:</span>
            <button
              onClick={onToggleFontSize}
              aria-label={`Current font size ${fontSize}`}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded text-slate-200 uppercase font-mono cursor-pointer"
            >
              {fontSize}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
