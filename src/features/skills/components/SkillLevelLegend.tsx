'use client'

import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import { PROFICIENCY_LEVELS, getProficiencyTone } from '../proficiency'

interface SkillLevelLegendProps {
  className?: string
}

export function SkillLevelLegend({ className }: SkillLevelLegendProps) {
  const t = useTranslations('skills')

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 sm:gap-3',
        'text-xs text-[var(--fg-muted)]',
        className
      )}
      aria-label={t('legend.label')}
    >
      <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]/65">
        {t('legend.label')}
      </span>
      {PROFICIENCY_LEVELS.map((level) => {
        const tone = getProficiencyTone(level)
        return (
          <span
            key={level}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1.5',
              'bg-black/15 backdrop-blur-sm',
              tone.border,
              tone.text
            )}
          >
            <span className={cn('h-2 w-2 rounded-full', tone.dot)} aria-hidden="true" />
            {t(`proficiency.${level}`)}
          </span>
        )
      })}
    </div>
  )
}
