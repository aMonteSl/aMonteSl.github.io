'use client'

import { cn } from '@/lib/utils'

export interface ProficiencyBadgeProps {
  label: string
  level: 'basic' | 'intermediate' | 'advanced'
  className?: string
}

const DOTS: Record<ProficiencyBadgeProps['level'], number> = {
  basic: 1,
  intermediate: 2,
  advanced: 3,
}

export function ProficiencyBadge({ label, level, className }: ProficiencyBadgeProps) {
  const activeDots = DOTS[level]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-[var(--border)]/60 bg-[var(--card)]/35 px-2.5 py-1 text-[11px] sm:text-xs text-[var(--fg)]/80',
        className
      )}
    >
      <span className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={cn(
              'size-1.5 rounded-full',
              index < activeDots ? 'bg-[var(--accent)]/80' : 'bg-[var(--border)]/60'
            )}
          />
        ))}
      </span>
      <span>{label}</span>
    </span>
  )
}
