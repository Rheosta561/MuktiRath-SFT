// context/TranslationContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translateText } from '@/utils/translate';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
}

const TranslationContext = createContext<TranslationContextType>({
  language: 'en',
  setLanguage: () => {},
  translate: async (text) => text,
});

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');

  const translate = async (text: string) => {
    if (language === 'en') return text;
    try {
      return await translateText(text, language);
    } catch {
      return text;
    }
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
