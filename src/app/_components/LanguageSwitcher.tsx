'use client'

import { useI18n } from '../_i18n/I18nProvider'

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  const handleLanguageChange = (newLocale: 'en' | 'es') => {
    setLocale(newLocale)
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language selection">
      {/* English Button */}
      <button
        onClick={() => handleLanguageChange('en')}
        aria-label="Change language to English"
        aria-pressed={locale === 'en'}
        title="English"
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
          locale === 'en'
            ? 'ring-2 ring-[#DCA293] bg-[#DCA293]/10 text-gray-900 dark:text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <span className="text-lg" role="img" aria-label="British flag">🇬🇧</span>
      </button>
      
      {/* Spanish Button */}
      <button
        onClick={() => handleLanguageChange('es')}
        aria-label="Change language to Spanish"
        aria-pressed={locale === 'es'}
        title="Español"
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
          locale === 'es'
            ? 'ring-2 ring-[#DCA293] bg-[#DCA293]/10 text-gray-900 dark:text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <span className="text-lg" role="img" aria-label="Spanish flag">🇪🇸</span>
      </button>
    </div>
  )
}
