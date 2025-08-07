import { useTranslations } from 'next-intl';

export const locales = ['en', 'da'] as const;
export const defaultLocale = 'da' as const;

export type Locale = (typeof locales)[number];

export function useI18n() {
  return useTranslations();
}