'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { locales } from '../i18n/request'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  return (
    <div className="relative inline-block text-left">
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc === 'da' ? 'Dansk' : loc === 'en' ? 'English' : loc}
          </option>
        ))}
      </select>
    </div>
  )
} 