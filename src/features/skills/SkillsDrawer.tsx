'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n'
import type { SkillCategory, SkillDetail } from '@/content/skills'
import { SkillDetailCard } from './SkillDetailCard'

export interface SkillsDrawerProps {
  isOpen: boolean
  category: SkillCategory | null
  skills: SkillDetail[]
  onClose: () => void
}

export function SkillsDrawer({ isOpen, category, skills, onClose }: SkillsDrawerProps) {
  const t = useTranslations('skills')
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen && panelRef.current) {
      const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }

      document.addEventListener('keydown', handleTabKey)
      firstElement?.focus()

      return () => document.removeEventListener('keydown', handleTabKey)
    }
  }, [isOpen])

  const panelVariants = useMemo(() => {
    if (shouldReduceMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    }

    return isMobile
      ? {
          hidden: { opacity: 0, y: 60 },
          visible: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 60 },
        }
      : {
          hidden: { opacity: 0, x: 60 },
          visible: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 60 },
        }
  }, [isMobile, shouldReduceMotion])

  const handleNavigate = (href: string) => {
    onClose()

    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' })
      return
    }

    router.push(href)
  }

  return (
    <AnimatePresence>
      {isOpen && category && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            ref={panelRef}
            id="skills-drawer"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label={t('drawer.title')}
            className={cn(
              'fixed z-50 w-full max-w-lg overflow-hidden border border-[var(--border)]/70 bg-[var(--card)]/70 backdrop-blur-xl',
              'shadow-[0_24px_80px_rgba(0,0,0,0.55)]',
              'before:absolute before:inset-0 before:pointer-events-none before:content-[""]',
              'before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]',
              'before:bg-[size:24px_24px]',
              'after:absolute after:inset-0 after:pointer-events-none after:content-[""] after:shadow-[inset_0_0_0_1px_rgba(220,162,147,0.08)]',
              isMobile
                ? 'left-0 right-0 bottom-0 top-auto rounded-t-3xl max-h-[85vh]'
                : 'right-0 top-0 bottom-0 rounded-l-3xl'
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative flex h-full flex-col px-5 pb-6 pt-6 sm:px-6">
              <header className="flex items-start justify-between gap-4 border-b border-[var(--border)]/60 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)]">
                    {t('drawer.title')}
                  </p>
                  <h3 className="text-lg sm:text-xl font-semibold text-[var(--fg)]">
                    {t(category.titleKey)}
                  </h3>
                  {category.descriptionKey && (
                    <p className="mt-2 text-xs sm:text-sm text-[var(--fg-muted)] max-w-xs">
                      {t(category.descriptionKey)}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)]/60 text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] hover:border-[var(--accent)]/40"
                >
                  <span className="sr-only">{t('actions.close')}</span>
                  <span aria-hidden="true">×</span>
                </button>
              </header>

              <div className="mt-5 flex-1 space-y-4 overflow-y-auto pr-1">
                {skills.map((skill) => (
                  <SkillDetailCard
                    key={skill.id}
                    skill={skill}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>

              <div className="mt-6 border-t border-[var(--border)]/50 pt-4">
                <button
                  onClick={onClose}
                  className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  {t('actions.back')}
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
