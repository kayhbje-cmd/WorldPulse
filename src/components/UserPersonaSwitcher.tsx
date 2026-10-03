// src/components/UserPersonaSwitcher.tsx
import React, { useState } from 'react';
import { useAuth, PERSON_1_USER, PERSON_2_USER } from '../contexts/AuthContext';
import { Users, KeyRound, ArrowRightLeft, ShieldCheck, Check } from 'lucide-react';
import { OtpLoginModal } from './OtpLoginModal';

export const UserPersonaSwitcher: React.FC = () => {
  const { user, isOfficer, currentPersona, switchPersona } = useAuth();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const togglePersona = () => {
    if (currentPersona === 'person1') {
      switchPersona('person2');
    } else {
      switchPersona('person1');
    }
  };

  return (
    <>
      <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-100/90 rounded-xl p-0.5 border border-gray-200/70 shadow-2xs shrink-0">
        <button
          type="button"
          onClick={togglePersona}
          title="1-Tap Toggle between Person 1 (Citizen) and Person 2 (Officer)"
          className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
            isOfficer
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-emerald-600 text-white shadow-xs'
          }`}
        >
          <ArrowRightLeft size={10} className="shrink-0" />
          <span className="inline sm:hidden">
            {isOfficer ? '👮 Rajesh' : '👤 Avinash'}
          </span>
          <span className="hidden sm:inline">
            {isOfficer ? '👮 Person 2: Officer Rajesh' : '👤 Person 1: Avinash'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsOtpModalOpen(true)}
          className="px-1.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold text-gray-700 hover:text-emerald-700 hover:bg-white transition cursor-pointer flex items-center gap-0.5 sm:gap-1 shrink-0 whitespace-nowrap"
          title="Login with OTP (1234)"
        >
          <KeyRound size={11} className="text-emerald-600 shrink-0" />
          <span>OTP</span>
        </button>
      </div>

      <OtpLoginModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
      />
    </>
  );
};
