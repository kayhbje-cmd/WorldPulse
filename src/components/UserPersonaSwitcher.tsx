// src/components/UserPersonaSwitcher.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { KeyRound, Check, Sparkles } from 'lucide-react';
import { OtpLoginModal } from './OtpLoginModal';

interface Props {
  variant?: 'row' | 'compact';
}

export const UserPersonaSwitcher: React.FC<Props> = ({ variant = 'row' }) => {
  const { currentPersona, switchPersona } = useAuth();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-slate-900 border-t sm:border-t-0 border-b border-slate-800 text-white px-2.5 sm:px-4 py-1.5 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5">
          {/* Persona quick buttons */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 shrink min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles size={11} className="text-emerald-400" />
              <span className="hidden xs:inline">User:</span>
            </span>

            {/* Person 1: Citizen Avinash */}
            <button
              type="button"
              onClick={() => switchPersona('person1')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                currentPersona === 'person1'
                  ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60"
                alt="Avinash"
                className="w-4 h-4 rounded-full object-cover shrink-0"
              />
              <span>Avinash (Citizen)</span>
              {currentPersona === 'person1' && <Check size={11} className="text-white" />}
            </button>

            {/* Person 2: Officer Rajesh */}
            <button
              type="button"
              onClick={() => switchPersona('person2')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                currentPersona === 'person2'
                  ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60"
                alt="Rajesh"
                className="w-4 h-4 rounded-full object-cover shrink-0"
              />
              <span>Er. Rajesh (Officer)</span>
              {currentPersona === 'person2' && <Check size={11} className="text-white" />}
            </button>
          </div>

          {/* OTP Login Modal button */}
          <button
            type="button"
            onClick={() => setIsOtpModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold border border-emerald-500/40 transition whitespace-nowrap cursor-pointer shrink-0 ml-1"
            title="Open OTP Login dialog (Test OTP 1234)"
          >
            <KeyRound size={11} />
            <span>OTP (1234)</span>
          </button>
        </div>
      </div>

      <OtpLoginModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
      />
    </>
  );
};
