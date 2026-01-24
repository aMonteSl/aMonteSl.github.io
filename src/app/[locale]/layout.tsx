import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { locales, Locale } from '@/i18n/config'
import { ReactNode } from 'react'

// Import messages statically
import enMessages from '@/i18n/messages/en.json'
import esMessages from '@/i18n/messages/es.json'

const messages = {
  en: enMessages,
  es: esMessages
}

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params
  
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const localeMessages = messages[locale as Locale]

  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
      {children}
    </NextIntlClientProvider>
  )
}
