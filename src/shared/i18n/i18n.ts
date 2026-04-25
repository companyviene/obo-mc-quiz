import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import fr from './locales/fr';

export type SupportedLocale = 'fr' | 'en';

export const DEFAULT_LOCALE: SupportedLocale = 'fr';
export const SUPPORTED_LOCALES: readonly SupportedLocale[] = ['fr', 'en'] as const;

void i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: {
    // React already handles XSS escaping.
    escapeValue: false,
  },
});

export default i18n;
