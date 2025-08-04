import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'da'] as const;
export const defaultLocale = 'da' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  console.log('🌐 i18n getRequestConfig called with locale:', locale);
  console.log('🌐 Available locales:', locales);
  console.log('🌐 Default locale:', defaultLocale);
  
  // If locale is undefined or invalid, use the default locale
  if (!locale || !locales.includes(locale as any)) {
    console.log('❌ Invalid locale, using default:', locale);
    locale = defaultLocale;
  }

  try {
    const messages = (await import(`../messages/${locale}.json`)).default;
    return {
      locale: locale as string,
      messages
    };
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    notFound();
  }
});