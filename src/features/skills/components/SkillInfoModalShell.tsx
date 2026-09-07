'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, type ReactNode } from 'react'
import type { IconType } from 'react-icons'
import { CloseIcon } from '@/components/ui'
import type { ProficiencyLevel } from '@/content/skills'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import { getProficiencyTone } from '../proficiency'

interface SkillInfoModalShellProps {
  open: boolean
  title: string
  subtitle?: string
  icon?: IconType
  level: ProficiencyLevel
  summary?: string
  highlights?: string[]
  children?: ReactNode
  titleId: string
  onClose: () => void
}

const proficiencyWidth: Record<ProficiencyLevel, string> = {
  basic: 'w-1/3',
  intermediate: 'w-2/3',
  advanced: 'w-full',
}

export function SkillInfoModalShell({
  open,
  title,
  subtitle,
  icon: Icon,
  level,
  summary,
  highlights = [],
  children,
  titleId,
  onClose,
}: SkillInfoModalShellProps) {
  const t = useTranslations('skills')
  const tone = getProficiencyTone(level)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!open) return

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, handleKeyDown])

  // Lock the page behind the dialog and hand back whatever overflow value was there before
  // (another overlay may own the body while this one is open).
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className={cn(
                'relative flex max-h-[88dvh] w-full max-w-lg flex-col overflow-hidden',
                'rounded-2xl border bg-[var(--card)]/95 backdrop-blur-xl',
                'shadow-2xl shadow-black/30',
                tone.border
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              {/* Header stays put; only the body below scrolls, so the close button is always reachable. */}
              <div className="flex shrink-0 items-start gap-4 border-b border-[var(--border)]/40 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
                {Icon && (
                  <div className={cn('shrink-0 self-center rounded-xl border p-3', tone.bg, tone.border)}>
                    <Icon className={cn('h-8 w-8', tone.text)} aria-hidden="true" />
                  </div>
                )}
                <div className="min-w-0 flex-1 self-center">
                  <h2 id={titleId} className="text-xl font-semibold text-[var(--fg)]">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="mt-1 text-sm text-[var(--fg-muted)]">
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="-mr-2 -mt-2 inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-[var(--fg-muted)] transition-colors hover:bg-[var(--border)]/30 hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60"
                  aria-label={t('actions.close')}
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-xs text-[var(--fg-muted)]">{t('proficiencyLabel')}</span>
                    <span className={cn('text-xs font-medium', tone.text)}>
                      {t(`proficiency.${level}`)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--border)]/50">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        tone.bar,
                        proficiencyWidth[level]
                      )}
                    />
                  </div>
                </div>

                {summary && (
                  <p className="mb-6 text-sm leading-relaxed text-[var(--fg-muted)]">
                    {summary}
                  </p>
                )}

                {highlights.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-3 text-sm font-medium text-[var(--fg)]">
                      {t('highlights')}
                    </h3>
                    <ul className="space-y-2">
                      {highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-[var(--fg-muted)]">
                          <span className={cn('mt-2 h-1.5 w-1.5 shrink-0 rounded-full', tone.dot)} aria-hidden="true" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
