'use client'

import type { MouseEvent } from 'react'
import type { IconType } from 'react-icons'
import type { ProficiencyLevel } from '@/content/skills'
import { cn } from '@/lib/utils'
import { getProficiencyTone } from '../proficiency'

interface SkillChipProps {
  label: string
  icon: IconType
  proficiency: ProficiencyLevel
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  className?: string
}

/**
 * Skill chip with icon above + text below
 * Uses accent color for icons, integrated with site theme
 */
export function SkillChip({
  label,
  icon: Icon,
  proficiency,
  onClick,
  className,
}: SkillChipProps) {
  const tone = getProficiencyTone(proficiency)

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: view details`}
      className={cn(
        'group relative flex min-w-0 flex-col items-center gap-1.5 px-3 py-2',
        'rounded-xl bg-[var(--card)]/50',
        'border',
        'transition-all duration-200',
        'hover:bg-[var(--card)]/75',
        'hover:scale-105 hover:shadow-lg hover:shadow-black/20',
        'focus-visible:outline-none focus-visible:ring-2',
        tone.border,
        tone.borderHover,
        tone.ring,
        className
      )}
    >
      <span
        className={cn(
          'absolute left-2 top-2 h-1.5 w-1.5 rounded-full opacity-80 transition-opacity group-hover:opacity-100',
          tone.dot
        )}
        aria-hidden="true"
      />
      <Icon
        className={cn(
          'w-5 h-5 transition-all duration-200',
          'group-hover:scale-110',
          tone.text
        )}
        aria-hidden="true"
      />
      <span className="max-w-28 text-center text-[11px] leading-tight text-[var(--fg-muted)] transition-colors group-hover:text-[var(--fg)]">
        {label}
      </span>
    </button>
  )
}
