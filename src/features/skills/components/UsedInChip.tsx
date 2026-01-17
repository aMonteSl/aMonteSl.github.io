'use client'

import { cn } from '@/lib/utils'

export interface UsedInChipProps {
  label: string
  onClick: () => void
  className?: string
}

export function UsedInChip({ label, onClick, className }: UsedInChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-[var(--border)]/70 bg-[var(--card)]/30 px-2.5 py-1 text-[11px] sm:text-xs text-[var(--fg)]/80',
        'transition-all duration-200 ease-out hover:border-[var(--accent)]/40 hover:text-[var(--fg)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
        className
      )}
    >
      {label}
    </button>
  )
}
