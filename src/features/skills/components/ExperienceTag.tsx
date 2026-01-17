'use client'

import { cn } from '@/lib/utils'

export interface ExperienceTagProps {
  label: string
  className?: string
}

export function ExperienceTag({ label, className }: ExperienceTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-[var(--border)]/60 bg-[var(--card)]/35 px-2.5 py-1 text-[11px] sm:text-xs text-[var(--fg)]/80',
        className
      )}
    >
      {label}
    </span>
  )
}
