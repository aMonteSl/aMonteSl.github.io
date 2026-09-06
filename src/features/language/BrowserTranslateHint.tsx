'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from '@/i18n'
import { getBrowserLanguages, hasSupportedLanguage } from './negotiate'

export const BROWSER_TRANSLATE_HINT_DISMISSED_KEY = 'browser-translate-hint-dismissed'

/**
 * One-line note for visitors whose browser languages include neither English nor Spanish:
 * the site is written in those two languages and their browser can translate it.
 * Rendered only after mount, so server and client markup never differ.
 */
export function BrowserTranslateHint() {
  const t = useTranslations('language')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (window.localStorage.getItem(BROWSER_TRANSLATE_HINT_DISMISSED_KEY)) {
        return
      }
    } catch {
      // Storage unavailable: still show the hint once for this page view.
    }

    const languages = getBrowserLanguages()
    if (languages.length === 0 || hasSupportedLanguage(languages)) {
      return
    }

    setVisible(true)
  }, [])

  if (!visible) {
    return null
  }

  const dismiss = () => {
    setVisible(false)
    try {
      window.localStorage.setItem(BROWSER_TRANSLATE_HINT_DISMISSED_KEY, '1')
    } catch {
      // Ignore: the note simply reappears on the next visit.
    }
  }

  return (
    <div
      role="note"
      className="fixed bottom-4 left-4 right-4 z-40 flex items-start gap-3 rounded-xl border border-[var(--accent)]/35 bg-[var(--surface)]/95 px-4 py-3 text-[13px] leading-snug text-[var(--fg-muted)] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-md sm:left-auto sm:right-6 sm:max-w-sm"
    >
      <p className="min-w-0 flex-1">{t('browserHint')}</p>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t('dismiss')}
        className="-mr-1 -mt-1 shrink-0 rounded-md px-2 py-1 text-base leading-none text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  )
}
