'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, type ReactNode } from 'react'
import type { IconType } from 'react-icons'
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
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

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
                'relative max-h-[88dvh] w-full max-w-lg overflow-y-auto',
                'rounded-2xl border bg-[var(--card)]/95 p-6 backdrop-blur-xl',
                'shadow-2xl shadow-black/30',
                tone.border
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg p-2 text-[var(--fg-muted)] transition-colors hover:bg-[var(--border)]/30 hover:text-[var(--fg)]"
                aria-label={t('actions.close')}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-6 flex items-center gap-4 pr-10">
                {Icon && (
                  <div className={cn('rounded-xl border p-3', tone.bg, tone.border)}>
                    <Icon className={cn('h-8 w-8', tone.text)} aria-hidden="true" />
                  </div>
                )}
                <div className="min-w-0">
                  <h2 id={titleId} className="text-xl font-semibold text-[var(--fg)]">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="mt-1 text-sm text-[var(--fg-muted)]">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
