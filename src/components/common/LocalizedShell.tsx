'use client'

import type { ReactNode } from 'react'
import { Footer } from '@/components/common/Footer'
import { I18nProvider, type Locale } from '@/i18n'
import { LocalePreferenceGate } from '@/features/language'

export interface LocalizedShellProps {
  children: ReactNode
  locale: Locale
  showFooter?: boolean
}

export function LocalizedShell({ children, locale, showFooter = true }: LocalizedShellProps) {
  return (
    <I18nProvider locale={locale}>
      <LocalePreferenceGate />
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <main id="main-content">
        {children}
      </main>
      {showFooter && <Footer />}
    </I18nProvider>
  )
}
