import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'accent' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium transition-all duration-200"
  
  const variants = {
    default: "bg-card text-fg-muted border border-border",
    accent: "bg-accent/20 text-accent border border-accent/30",
    outline: "bg-transparent text-fg-muted border border-border hover:border-accent/50"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs rounded-lg",
    md: "px-3 py-1.5 text-sm rounded-xl"
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
