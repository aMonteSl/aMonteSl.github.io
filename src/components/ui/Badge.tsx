import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'accent' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium transition-all duration-200'

  const variants = {
    default: 'border border-[var(--border)] bg-[var(--card)] text-[var(--fg-muted)]',
    accent: 'border border-[var(--accent)]/30 bg-[var(--accent)]/20 text-[var(--accent)]',
    outline: 'border border-[var(--border)] bg-transparent text-[var(--fg-muted)] hover:border-[var(--accent)]/50'
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs rounded-lg',
    md: 'px-3 py-1.5 text-sm rounded-xl'
  }

  return (
    <span className={cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  )
}
