'use client'

import { useLocale, locales, localeFlags, Locale } from '@/i18n'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale)
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language selection">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLanguageChange(loc)}
          aria-label={`Change language to ${loc === 'en' ? 'English' : 'Spanish'}`}
          aria-pressed={locale === loc}
          title={loc === 'en' ? 'English' : 'Español'}
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] ${
            locale === loc
              ? 'ring-2 ring-[var(--accent)] bg-[var(--accent)]/10 text-[var(--fg)]'
              : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card)]'
          }`}
        >
          <span className="text-lg" role="img" aria-label={loc === 'en' ? 'British flag' : 'Spanish flag'}>
            {localeFlags[loc]}
          </span>
        </button>
      ))}
    </div>
  )
}
