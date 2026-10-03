// src/components/LanguageSelector.tsx
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Check } from 'lucide-react';
import { LanguageCode } from '../types';

export const LanguageSelector: React.FC<{ variant?: 'badge' | 'full' }> = ({ variant = 'badge' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: LanguageCode; name: string; local: string; flag: string }[] = [
    { code: 'en', name: 'English', local: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', local: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', local: 'मराठी', flag: '🚩' },
  ];

  const current = languages.find((l) => l.code === language) || languages[0];

  if (variant === 'full') {
    return (
      <div className="grid grid-cols-3 gap-2">
        {languages.map((l) => {
          const isSelected = language === l.code;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-xl mb-1">{l.flag}</span>
              <span className="text-xs font-semibold">{l.local}</span>
              <span className="text-[10px] text-gray-400">{l.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition cursor-pointer shrink-0"
        aria-label="Select language"
      >
        <Globe size={12} className="text-gray-500 hidden sm:inline" />
        <span className="text-xs">{current.flag}</span>
        <span className="hidden sm:inline font-semibold">{current.local}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLanguage(l.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-emerald-50 transition cursor-pointer ${
                  language === l.code ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{l.flag}</span>
                  <span>{l.local}</span>
                </span>
                {language === l.code && <Check size={12} className="text-emerald-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
