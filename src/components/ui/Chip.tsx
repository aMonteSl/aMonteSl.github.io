import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ChipProps {
  label: string
  icon?: ReactNode
  size?: 'sm' | 'md'
  variant?: 'default' | 'subtle'
  className?: string
}

export function Chip({ label, icon, size = 'md', variant = 'default', className }: ChipProps) {
  const sizes = {
    sm: 'h-7 px-2.5 text-[11px] sm:text-xs',
    md: 'h-8 px-3 text-xs sm:text-sm'
  }

  const variants = {
    default: 'bg-[var(--card)]/50 border-[var(--border)]/80 text-[var(--fg)]/90',
    subtle: 'bg-[var(--card)]/30 border-[var(--border)]/60 text-[var(--fg)]/75'
  }

  return (
    <span
      className={cn(
        'group inline-flex items-center gap-2 rounded-full border shadow-sm leading-none transition-all duration-200 ease-out',
        'hover:border-[var(--accent)]/40 hover:bg-[var(--card)]/70 hover:shadow-[0_0_0_1px_rgba(220,162,147,0.18)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
        sizes[size],
        variants[variant],
        className
      )}
    >
      {icon && (
        <span className="text-[var(--fg)]/70 transition-colors duration-200 group-hover:text-[var(--fg)]">
          {icon}
        </span>
      )}
      <span className="whitespace-nowrap">{label}</span>
    </span>
  )
}
