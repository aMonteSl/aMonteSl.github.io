'use client'

import type { ProficiencyLevel } from '@/content/skills'
import { cn } from '@/lib/utils'
import { getProficiencyTone } from '../proficiency'

interface SkillLevelBadgeProps {
  level: ProficiencyLevel
  label: string
  className?: string
}

export function SkillLevelBadge({ level, label, className }: SkillLevelBadgeProps) {
  const tone = getProficiencyTone(level)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1',
        'bg-black/20 text-[11px] font-semibold',
        tone.border,
        tone.text,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', tone.dot)} aria-hidden="true" />
      {label}
    </span>
  )
}
