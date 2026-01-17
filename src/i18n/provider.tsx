'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { IntlProvider } from 'next-intl'
import { Locale, defaultLocale, locales } from './config'

// Import messages statically
import enMessages from './messages/en.json'
import esMessages from './messages/es.json'

const messages: Record<Locale, typeof enMessages> = {
  en: enMessages,
  es: esMessages
}

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType | null>(null)

const LOCALE_STORAGE_KEY = 'portfolio-locale'

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored && locales.includes(stored as Locale)) {
    return stored as Locale
  }
  return defaultLocale
}

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  // Initialize locale from localStorage on mount
  useEffect(() => {
    setLocaleState(getStoredLocale())
    setMounted(true)
  }, [])

  // Update document lang attribute when locale changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale
    }
  }, [locale, mounted])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
  }, [])

  // Prevent hydration mismatch by using default locale until mounted
  const currentLocale = mounted ? locale : defaultLocale
  const currentMessages = messages[currentLocale]

  return (
    <LocaleContext.Provider value={{ locale: currentLocale, setLocale }}>
      <IntlProvider
        locale={currentLocale}
        messages={currentMessages}
        timeZone="Europe/Madrid"
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within an I18nProvider')
  }
  return context
}

// Re-export useTranslations from next-intl for convenience
export { useTranslations } from 'next-intl'
