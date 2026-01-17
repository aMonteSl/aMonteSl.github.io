'use client'

import { ReactNode } from 'react'
import { Modal } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface SkillsDetailsModalProps {
  isOpen: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  closeLabel: string
  headingLabel: string
  onPause?: () => void
  onResume?: () => void
}

export function SkillsDetailsModal({
  isOpen,
  title,
  subtitle,
  onClose,
  children,
  closeLabel,
  headingLabel,
  onPause,
  onResume,
}: SkillsDetailsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-5xl w-full"
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-[var(--border)]/70',
          'bg-[var(--card)]/70 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.55)]',
          'before:absolute before:inset-0 before:pointer-events-none before:content-[""]',
          'before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]',
          'before:bg-[size:24px_24px]',
          'after:absolute after:inset-0 after:pointer-events-none after:content-[""] after:shadow-[inset_0_0_0_1px_rgba(220,162,147,0.08)]'
        )}
      >
        <div
          className="relative max-h-[85vh] overflow-hidden px-6 pb-7 pt-6 sm:px-8 lg:px-10"
          onFocusCapture={() => onPause?.()}
          onBlurCapture={(event) => {
            const related = event.relatedTarget as Node | null
            if (!event.currentTarget.contains(related)) {
              onResume?.()
            }
          }}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)]/60 text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] hover:border-[var(--accent)]/40"
          >
            <span className="sr-only">{closeLabel}</span>
            <span aria-hidden="true">×</span>
          </button>

          <div className="pr-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)]">{headingLabel}</p>
            <h3 className="text-lg sm:text-2xl font-semibold text-[var(--fg)]">{title}</h3>
            {subtitle && (
              <p className="mt-2 text-xs sm:text-sm text-[var(--fg-muted)] max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          <div className="mt-6 max-h-[65vh] overflow-y-auto pr-1">{children}</div>
        </div>
      </div>
    </Modal>
  )
}
