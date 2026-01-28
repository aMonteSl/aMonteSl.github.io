'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useCallback } from 'react'
import { SKILLS, type SkillId } from '@/content/skills'
import { useTranslations } from '@/i18n'
import { getSkillIcon } from '../skillIconMap'
import { cn } from '@/lib/utils'

interface SkillDetailModalProps {
  skillId: SkillId | null
  onClose: () => void
}

export function SkillDetailModal({ skillId, onClose }: SkillDetailModalProps) {
  const t = useTranslations('skills')
  const skill = skillId ? SKILLS[skillId] : null
  const Icon = skill ? getSkillIcon(skill.iconKey) : null

  // Handle ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (skillId) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [skillId, handleKeyDown])

  const proficiencyLabel = {
    basic: t('proficiency.basic'),
    intermediate: t('proficiency.intermediate'),
    advanced: t('proficiency.advanced'),
  }

  const proficiencyWidth = {
    basic: 'w-1/3',
    intermediate: 'w-2/3',
    advanced: 'w-full',
  }

  return (
    <AnimatePresence>
      {skill && Icon && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className={cn(
                'relative w-full max-w-md',
                'bg-[var(--card)]/95 backdrop-blur-xl',
                'rounded-2xl border border-[var(--border)]',
                'shadow-2xl shadow-black/30',
                'p-6'
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby="skill-modal-title"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--border)]/30 transition-colors"
                aria-label={t('actions.close')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                  <Icon className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <div>
                  <h2 id="skill-modal-title" className="text-xl font-semibold text-[var(--fg)]">
                    {t(skill.labelKey)}
                  </h2>
                  <p className="text-sm text-[var(--fg-muted)]">
                    {t(skill.purposeKey)}
                  </p>
                </div>
              </div>

              {/* Proficiency bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-[var(--fg-muted)]">{t('proficiencyLabel')}</span>
                  <span className="text-xs font-medium text-[var(--accent)]">
                    {proficiencyLabel[skill.proficiency]}
                  </span>
                </div>
                <div className="h-2 bg-[var(--border)]/50 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/70 rounded-full',
                      'transition-all duration-500',
                      proficiencyWidth[skill.proficiency]
                    )}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                  {t(skill.summaryKey)}
                </p>
              </div>

              {/* Highlights */}
              {skill.highlightsKeys.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--fg)] mb-3">
                    {t('highlights')}
                  </h3>
                  <ul className="space-y-2">
                    {skill.highlightsKeys.map((key, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--fg-muted)]">
                        <span className="text-[var(--accent)] mt-0.5">•</span>
                        <span>{t(key)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
