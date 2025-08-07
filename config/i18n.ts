export const locales = ['da'] as const;
export const defaultLocale = 'da' as const;

export type Locale = (typeof locales)[number];
