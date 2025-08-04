import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';

export default createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: 'always'
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: [
    '/',
    '/(da|en)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)' 
  ]
};