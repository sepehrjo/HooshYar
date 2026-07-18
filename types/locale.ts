export const locales = ['en', 'fa'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fa';

export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  fa: 'rtl'
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
