'use client'

import type { ReactNode } from 'react'
import { Footer } from '@/components/common/Footer'
import { I18nProvider, useTranslations, type Locale } from '@/i18n'
import { BrowserTranslateHint, LocalePreferenceGate } from '@/features/language'

export interface LocalizedShellProps {
  children: ReactNode
  locale: Locale
  showFooter?: boolean
  /** Extra classes for the footer, e.g. the sidebar offset on the home page. */
  footerClassName?: string
}

function SkipToContentLink() {
  const t = useTranslations('language')

  return (
    <a href="#main-content" className="skip-to-content">
      {t('skipToContent')}
    </a>
  )
}

export function LocalizedShell({
  children,
  locale,
  showFooter = true,
  footerClassName,
}: LocalizedShellProps) {
  return (
    <I18nProvider locale={locale}>
      <LocalePreferenceGate />
      <SkipToContentLink />
      <main id="main-content">
        {children}
      </main>
      {showFooter && <Footer className={footerClassName} />}
      <BrowserTranslateHint />
    </I18nProvider>
  )
}
