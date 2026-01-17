'use client'

import { useLocale, locales, localeNames, Locale } from '@/i18n'
import { cn } from '@/lib/utils'
import { GB, ES } from 'country-flag-icons/react/3x2'
import type { ReactElement } from 'react'

// Map locales to their flag components
const FlagComponents: Record<Locale, () => ReactElement> = {
  en: () => <GB className="w-6 h-4 rounded-sm" />,
  es: () => <ES className="w-6 h-4 rounded-sm" />,
}

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
        const FlagIcon = FlagComponents[loc]
        return (
          <button
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            aria-label={`Switch to ${localeNames[loc]}`}
            aria-pressed={isActive}
            title={localeNames[loc]}
            className={cn(
              'relative inline-flex items-center justify-center rounded-full px-2.5 py-1.5',
              'transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
              isActive
                ? 'bg-[var(--accent)]/15 shadow-sm'
                : 'opacity-60 hover:opacity-100 hover:bg-[var(--card)]'
            )}
          >
            <span aria-hidden="true">
              <FlagIcon />
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
