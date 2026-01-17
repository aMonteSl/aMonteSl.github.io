'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n'
import type { ExperienceTagId } from '@/content/skills'

export interface ExperienceTagProps {
  tag: ExperienceTagId
  className?: string
}

export function ExperienceTag({ tag, className }: ExperienceTagProps) {
  const t = useTranslations('skills')

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-[var(--border)]/60 bg-[var(--card)]/35 px-2.5 py-1 text-[11px] sm:text-xs text-[var(--fg)]/80',
        className
      )}
    >
      {t(`tags.${tag}`)}
    </span>
  )
}
