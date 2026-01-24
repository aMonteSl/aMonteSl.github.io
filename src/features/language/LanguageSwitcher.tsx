'use client'

import { useLocale } from 'next-intl'
import { usePathname } from '@/i18n'
import { Link } from '@/i18n'
import { locales, localeNames, Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'
import { GB, ES } from 'country-flag-icons/react/3x2'
import type { ReactElement } from 'react'

// Map locales to their flag components
const FlagComponents: Record<Locale, () => ReactElement> = {
  en: () => <GB className="w-6 h-4 rounded-sm" />,
  es: () => <ES className="w-6 h-4 rounded-sm" />,
}

export function LanguageSwitcher() {
  const currentLocale = useLocale()
  const pathname = usePathname()

  return (
    <div
      className="flex items-center gap-0.5 rounded-full bg-[var(--card)]/50 p-0.5 backdrop-blur-sm"
      role="group"
      aria-label="Language selection"
    >
      {locales.map((locale) => {
        const isActive = currentLocale === locale
        const FlagIcon = FlagComponents[locale]
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            aria-label={`Switch to ${localeNames[locale]}`}
            aria-current={isActive ? 'true' : undefined}
            title={localeNames[locale]}
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
          </Link>
        )
      })}
    </div>
  )
}
