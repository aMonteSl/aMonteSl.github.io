'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { Locale, defaultLocale } from './config'

// Import messages statically
import enMessages from './messages/en.json'
import esMessages from './messages/es.json'

const messages: Record<Locale, typeof enMessages> = {
  en: enMessages,
  es: esMessages
}

interface LocaleContextType {
  locale: Locale
}

const LocaleContext = createContext<LocaleContextType | null>(null)

interface I18nProviderProps {
  children: ReactNode
  locale?: Locale
}

export function I18nProvider({ children, locale = defaultLocale }: I18nProviderProps) {
  const currentLocale = locale
  const currentMessages = messages[currentLocale]

  useEffect(() => {
    document.documentElement.lang = currentLocale
  }, [currentLocale])

  return (
    <LocaleContext.Provider value={{ locale: currentLocale }}>
      <NextIntlClientProvider
        locale={currentLocale}
        messages={currentMessages}
        timeZone="Europe/Madrid"
      >
        {children}
      </NextIntlClientProvider>
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
