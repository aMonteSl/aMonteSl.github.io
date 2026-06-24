'use client'

import { useEffect } from 'react'
import { useLocale, localizePath, type Locale } from '@/i18n'

export const PREFERRED_LOCALE_STORAGE_KEY = 'preferred-locale'

function isRootPath(pathname: string): boolean {
  return pathname === '/' || pathname === '/index.html'
}

function getPreferredBrowserLocale(): Locale {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language]
  const primaryLanguage = languages.find(Boolean)?.toLowerCase() ?? ''

  return primaryLanguage.startsWith('es') ? 'es' : 'en'
}

export function LocalePreferenceGate() {
  const { locale } = useLocale()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const storedLocale = window.localStorage.getItem(PREFERRED_LOCALE_STORAGE_KEY)
    if (storedLocale) {
      return
    }

    if (!isRootPath(window.location.pathname)) {
      return
    }

    const preferredLocale = getPreferredBrowserLocale()
    if (preferredLocale === locale) {
      return
    }

    window.localStorage.setItem(PREFERRED_LOCALE_STORAGE_KEY, preferredLocale)
    window.location.replace(localizePath('/', preferredLocale))
  }, [locale])

  return null
}
