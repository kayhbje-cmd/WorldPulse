// src/components/Navbar.tsx - Responsive Navigation Header

import React, { useState } from 'react';
import { 
  MapPin, 
  PlusCircle, 
  Menu, 
  X, 
  Flame,
  Settings
} from 'lucide-react';

interface NavbarProps {
  onOpenSubmitModal: () => void;
  onOpenAdminModal: () => void;
  totalListingsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSubmitModal,
  onOpenAdminModal,
  totalListingsCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-orange-100/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & City Badge */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <a href="#" className="flex items-center space-x-2.5 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
                <Flame className="w-6 h-6 fill-amber-100 text-amber-100" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-2xl tracking-tight text-[#291809] font-['Outfit']">
                    Bhandara<span className="text-orange-600">Finder</span>
                  </span>
                  <span className="text-[11px] font-semibold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full border border-orange-200 hidden sm:inline-block">
                    भंडारा & महाप्रसाद
                  </span>
                </div>
                <span className="text-[11px] font-medium text-stone-500 tracking-wide">
                  Find & Upload Bhandara Locations
                </span>
              </div>
            </a>

            {/* City Locality Tag */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 bg-amber-50/80 rounded-full border border-amber-200/80 text-amber-900 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Amravati & Nearby</span>
            </div>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Manage Listings Button */}
            <button
              onClick={onOpenAdminModal}
              title="Manage and edit your listed Bhandaras"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:text-orange-700 hover:bg-orange-50/80 border border-stone-200/80 transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-stone-500" />
              <span>Manage Listings</span>
            </button>

            {/* Primary CTA: Upload Bhandara Location */}
            <button
              onClick={onOpenSubmitModal}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md shadow-orange-600/25 hover:shadow-lg hover:shadow-orange-600/35 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Upload Bhandara Location</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={onOpenSubmitModal}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Upload Location</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-orange-50 border border-stone-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-orange-100 space-y-3 bg-[#FDFBF7] animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between px-2 text-xs text-stone-600">
              <span className="flex items-center space-x-1 font-semibold text-amber-900">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span>Amravati & Surrounding Localities</span>
              </span>
              <span className="text-[11px] bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                {totalListingsCount} active {totalListingsCount === 1 ? 'listing' : 'listings'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSubmitModal();
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload Bhandara Location Now</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminModal();
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 border border-stone-200"
              >
                <Settings className="w-4 h-4 text-stone-500" />
                <span>Manage & Edit Listings</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
