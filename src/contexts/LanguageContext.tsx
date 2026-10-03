// src/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translationService, Language } from '../services/translation.service';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  getCategoryName: (catId: string) => string;
  getStatusLabel: (statusKey: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('preferred_language') as Language;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred_language', lang);
  };

  const t = (key: string, fallback?: string): string => {
    return translationService.translate(key, language) || fallback || key;
  };

  const getCategoryName = (catId: string): string => {
    return translationService.getCategoryName(catId, language);
  };

  const getStatusLabel = (statusKey: string): string => {
    return translationService.getStatusLabel(statusKey, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getCategoryName, getStatusLabel }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
