'use client'

import { useLocale, locales, localeFlags, localeNames, Locale } from '@/i18n'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale)
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full bg-[var(--card)]/50 p-0.5 backdrop-blur-sm"
      role="group"
      aria-label="Language selection"
    >
      {locales.map((loc) => {
        const isActive = locale === loc
        return (
          <button
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            aria-label={`Switch to ${localeNames[loc]}`}
            aria-pressed={isActive}
            title={localeNames[loc]}
            className={cn(
              'relative inline-flex items-center justify-center rounded-full px-2.5 py-1.5',
              'text-xl transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
              isActive
                ? 'bg-[var(--accent)]/15 shadow-sm'
                : 'opacity-60 hover:opacity-100 hover:bg-[var(--card)]'
            )}
          >
            <span role="img" aria-hidden="true">
              {localeFlags[loc]}
            </span>
            {isActive && (
              <span className="sr-only">(current language)</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
