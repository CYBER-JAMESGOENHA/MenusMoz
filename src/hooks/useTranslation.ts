import { useMemo } from 'react';
import { translations, TranslationSchema } from '../translations';

export const useTranslation = (lang: string) => {
  const currentLang = (lang === 'en' || lang === 'pt' ? lang : 'pt') as 'en' | 'pt';
  
  const t = useMemo((): TranslationSchema => {
    return translations[currentLang] || translations.pt;
  }, [currentLang]);

  return t;
};

export default useTranslation;
