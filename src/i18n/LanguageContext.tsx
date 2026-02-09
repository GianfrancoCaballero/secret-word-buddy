import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type Language, type Translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem('app-language');
    if (saved === 'es' || saved === 'en') return saved;
    // Detect browser language
    const browserLang = navigator.language.slice(0, 2);
    return browserLang === 'en' ? 'en' : 'es';
  } catch {
    return 'es';
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('app-language', lang);
    } catch {}
    document.documentElement.lang = lang;
  }, []);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
