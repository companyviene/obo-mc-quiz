import type { TranslationSchema } from './locales/schema';

// Augments i18next so t() calls are fully typed against the schema.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: TranslationSchema;
    };
  }
}
