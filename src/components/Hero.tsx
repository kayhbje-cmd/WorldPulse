// src/components/Hero.tsx - Hero section with search, location trigger, and direct upload callout

import React from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  X, 
  Sparkles, 
  AlertCircle, 
  PlusCircle,
  CheckCircle2
} from 'lucide-react';
import { UserLocation } from '../types';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userLocation: UserLocation;
  onRequestLocation: () => void;
  onClearLocation: () => void;
  onOpenSubmitModal: () => void;
  totalApprovedEvents: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  userLocation,
  onRequestLocation,
  onClearLocation,
  onOpenSubmitModal,
  totalApprovedEvents,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 bg-gradient-to-b from-orange-50/70 via-[#FDFBF7] to-[#FDFBF7]">
      {/* Subtle traditional dot matrix background motif */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* Seva Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 border border-orange-200/80 text-orange-950 text-xs sm:text-sm font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
            <span className="text-orange-900 font-bold">अन्न हे पूर्णब्रह्म</span>
            <span className="text-orange-400">•</span>
            <span className="text-orange-800">Find & Share Bhandara Locations</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#291809] tracking-tight leading-[1.15] font-['Outfit']">
            Where is a <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700">Bhandara</span> Near You?
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Discover active and upcoming Bhandaras, Mahaprasad feasts, and Annadan community meals. Anyone can view live listings and upload a Bhandara location!
          </p>

          {/* Search Bar & Geolocation Controls */}
          <div className="pt-3 max-w-2xl mx-auto">
            <div className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl shadow-xl shadow-orange-950/5 border border-orange-200/70 flex flex-col sm:flex-row gap-2 transition-all focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10">
              {/* Text Search Input */}
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-stone-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search by area, temple, locality (e.g. Rajapeth, Badnera), or menu..."
                  className="w-full pl-11 pr-9 py-3 text-sm text-[#291809] placeholder-stone-400 bg-transparent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Geolocation Button */}
              <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-stone-200 sm:pl-2 pt-2 sm:pt-0">
                {userLocation.latitude !== null ? (
                  <div className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>GPS Active</span>
                    <button
                      onClick={onClearLocation}
                      className="ml-1 p-0.5 rounded hover:bg-emerald-200/50 text-emerald-700 cursor-pointer"
                      title="Clear location filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onRequestLocation}
                    disabled={userLocation.isLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-orange-950 bg-orange-100/80 hover:bg-orange-200/80 border border-orange-200 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Navigation className={`w-4 h-4 text-orange-600 ${userLocation.isLoading ? 'animate-spin' : ''}`} />
                    <span>{userLocation.isLoading ? 'Locating...' : 'Near Me (GPS)'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Location feedback error message if user denied or error */}
            {userLocation.error && (
              <div className="mt-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{userLocation.error}</span>
              </div>
            )}
          </div>

          {/* Quick upload invitation card */}
          <div className="pt-3 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200/80 rounded-2xl p-3.5 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start space-x-2.5 text-xs text-orange-950">
                <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Know of a Bhandara happening today or soon?</strong> Upload the venue and timings so devotees can find it on the map!
                </span>
              </div>

              <button
                onClick={onOpenSubmitModal}
                className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                + List a Bhandara
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
