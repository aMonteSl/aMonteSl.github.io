'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations, locales, localeNames, localizePath, Locale } from '@/i18n'
import { cn } from '@/lib/utils'
import { GB, ES } from 'country-flag-icons/react/3x2'
import type { ReactElement } from 'react'
import { PREFERRED_LOCALE_STORAGE_KEY } from './LocalePreferenceGate'

// Map locales to their flag components
const FlagComponents: Record<Locale, () => ReactElement> = {
  en: () => <GB className="w-6 h-4 rounded-sm" />,
  es: () => <ES className="w-6 h-4 rounded-sm" />,
}

export function LanguageSwitcher() {
  const { locale } = useLocale()
  const pathname = usePathname()
  const t = useTranslations('language')

  return (
    <div
      className="flex items-center gap-0.5 rounded-full bg-[var(--card)]/50 p-0.5 backdrop-blur-sm"
      role="group"
      aria-label={t('selection')}
    >
      {locales.map((loc) => {
        const isActive = locale === loc
        const FlagIcon = FlagComponents[loc]
        return (
          <Link
            key={loc}
            href={localizePath(pathname, loc)}
            onClick={() => {
              window.localStorage.setItem(PREFERRED_LOCALE_STORAGE_KEY, loc)
            }}
            aria-label={t('switchTo', { language: localeNames[loc] })}
            aria-pressed={isActive}
            title={localeNames[loc]}
            className={cn(
              'relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-2.5 py-1.5',
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
              <span className="sr-only">{t('current')}</span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
