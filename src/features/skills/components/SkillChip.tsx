'use client'

import type { IconType } from 'react-icons'
import type { ProficiencyLevel } from '@/content/skills'
import { cn } from '@/lib/utils'

interface SkillChipProps {
  label: string
  icon: IconType
  proficiency: ProficiencyLevel
  onClick?: () => void
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
  // Proficiency affects opacity: basic = 60%, intermediate = 80%, advanced = 100%
  const opacityClass = {
    basic: 'opacity-60',
    intermediate: 'opacity-80',
    advanced: 'opacity-100',
  }[proficiency]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex flex-col items-center gap-1.5 px-3 py-2',
        'rounded-xl bg-[var(--card)]/50',
        'border border-[var(--border)]/40',
        'transition-all duration-200',
        'hover:border-[var(--accent)]/50 hover:bg-[var(--card)]/70',
        'hover:scale-105 hover:shadow-lg hover:shadow-black/20',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50',
        className
      )}
    >
      <Icon
        className={cn(
          'w-5 h-5 text-[var(--accent)] transition-all duration-200',
          'group-hover:scale-110',
          opacityClass
        )}
        aria-hidden="true"
      />
      <span className="text-[11px] text-[var(--fg-muted)] leading-tight whitespace-nowrap group-hover:text-[var(--fg)] transition-colors">
        {label}
      </span>
    </button>
  )
}
