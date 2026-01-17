'use client'

import { useTranslations } from '@/i18n'
import type { ProficiencyLevel } from '@/content/skills'
import { cn } from '@/lib/utils'

export interface ProficiencyDotsProps {
  level: ProficiencyLevel
  className?: string
  showLabel?: boolean
  hideLabel?: boolean
}

export function ProficiencyDots({ level, className, showLabel, hideLabel }: ProficiencyDotsProps) {
  const t = useTranslations('skills')

  const getProficiencyLabel = (lvl: ProficiencyLevel) => t(`proficiency.${lvl}`)
  const getDotsArray = (lvl: ProficiencyLevel) => {
    switch (lvl) {
      case 'basic':
        return [true, false, false]
      case 'intermediate':
        return [true, true, false]
      case 'advanced':
        return [true, true, true]
    }
  }

  const dots = getDotsArray(level)
  const label = getProficiencyLabel(level)

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      title={label}
      aria-label={`Proficiency: ${label}`}
    >
      {dots.map((filled, idx) => (
        <div
          key={idx}
          className={cn(
            'w-1.5 h-1.5 rounded-full transition-opacity',
            filled ? 'bg-white/80' : 'bg-white/20'
          )}
        />
      ))}
      {!hideLabel && showLabel && <span className="text-xs text-white/60 ml-1">{label}</span>}
    </div>
  )
}
