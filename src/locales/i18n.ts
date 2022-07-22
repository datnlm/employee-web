import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
//
import enLocales from './en.json';
import vnLocales from './vn.json';

// ----------------------------------------------------------------------

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vn: { translations: vnLocales },
      en: { translations: enLocales }
    },
    lng: localStorage.getItem('i18nextLng') || 'vn',
    fallbackLng: 'vn',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;