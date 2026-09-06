'use client'

import { useEffect } from 'react'
import { useLocale, localizePath } from '@/i18n'
import { getBrowserLanguages, negotiateLocale } from './negotiate'

export const PREFERRED_LOCALE_STORAGE_KEY = 'preferred-locale'

function isRootPath(pathname: string): boolean {
  return pathname === '/' || pathname === '/index.html'
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

    const preferredLocale = negotiateLocale(getBrowserLanguages())
    if (preferredLocale === locale) {
      return
    }

    window.localStorage.setItem(PREFERRED_LOCALE_STORAGE_KEY, preferredLocale)
    window.location.replace(localizePath('/', preferredLocale))
  }, [locale])

  return null
}
