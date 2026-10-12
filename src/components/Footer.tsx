// src/components/Footer.tsx - Community footer with guidelines and legal links

import React from 'react';
import { Flame, Heart, MapPin, ShieldCheck, PlusCircle, ExternalLink } from 'lucide-react';
import { AMRAVATI_LOCALITIES } from '../utils/geo';

interface FooterProps {
  onOpenSubmitModal: () => void;
  onOpenAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSubmitModal,
  onOpenAdminModal,
}) => {
  return (
    <footer className="bg-[#211306] text-stone-300 pt-14 pb-10 border-t border-amber-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/30">
                <Flame className="w-5 h-5 fill-amber-100 text-amber-100" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-['Outfit']">
                Bhandara<span className="text-orange-500">Finder</span>
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              A sacred community initiative dedicated to helping devotees, students, and citizens discover verified Bhandara, J1 community meals, Annadan Seva, and temple Mahaprasad across Amravati, Maharashtra.
            </p>

            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400 bg-amber-950/50 border border-amber-800/60 px-3 py-1.5 rounded-full">
              <span className="text-orange-400">अन्न हे पूर्णब्रह्म</span>
              <span>•</span>
              <span>Dedicated to the spirit of Annadan</span>
            </div>
          </div>

          {/* Key Localities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">
              Amravati Localities
            </h4>
            <ul className="text-xs space-y-1.5 text-stone-400">
              <li>Ambadevi & Gandhi Chowk</li>
              <li>Rajapeth & Badnera Road</li>
              <li>Gadge Nagar & Panchavati</li>
              <li>VMV Road & Shegaon Naka</li>
              <li>Sai Nagar & Irwin Square</li>
              <li>Badnera Railway Colony</li>
            </ul>
          </div>

          {/* Quick Actions & Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">
              Community Seva
            </h4>
            <div className="flex flex-col space-y-2 text-xs">
              <button
                onClick={onOpenSubmitModal}
                className="text-left text-orange-400 hover:text-orange-300 font-semibold inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit a Bhandara</span>
              </button>
              <button
                onClick={onOpenAdminModal}
                className="text-left text-stone-400 hover:text-white inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                <span>Admin Moderation Desk</span>
              </button>
              <a href="#about" className="text-stone-400 hover:text-white">
                About Annadan Seva
              </a>
              <a href="#guidelines" className="text-stone-400 hover:text-white">
                Verification Guidelines
              </a>
              <a href="#privacy" className="text-stone-400 hover:text-white">
                Privacy & Data Consent
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer & Devotee Courtesy Note */}
        <div className="bg-[#180d04] border border-amber-950/70 p-4 rounded-2xl text-[11px] text-stone-400 space-y-1 leading-relaxed">
          <span className="font-bold text-amber-400 block">Devotee Courtesy & Community Disclaimer:</span>
          <p>
            Bhandara Finder is an independent voluntary community discovery platform. Timings, menus, and venue details are submitted by organizers, mandals, and citizens, and verified by our volunteer moderation desk. Devotees are kindly requested to maintain queue discipline, avoid littering or single-use plastic, and respect temple premises. Food waste is strictly discouraged.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <span>&copy; {new Date().getFullYear()} Bhandara Finder (Amravati, Maharashtra). Non-profit community service platform.</span>
          <span className="flex items-center space-x-1">
            <span>Built with devotion & care</span>
            <Heart className="w-3 h-3 text-orange-600 fill-orange-600" />
            <span>for Amravati</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
