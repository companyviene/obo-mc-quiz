import { useTranslation } from 'react-i18next';
import { type SupportedLocale, SUPPORTED_LOCALES } from './i18n';

interface LocaleControls {
  locale: SupportedLocale;
  toggleLocale: () => void;
}

export function useLocale(): LocaleControls {
  const { i18n } = useTranslation();

  const locale = (
    SUPPORTED_LOCALES.includes(i18n.language as SupportedLocale)
      ? i18n.language
      : 'fr'
  ) as SupportedLocale;

  function toggleLocale(): void {
    const next: SupportedLocale = locale === 'fr' ? 'en' : 'fr';
    void i18n.changeLanguage(next);
  }

  return { locale, toggleLocale };
}
