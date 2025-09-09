import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'error'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Badge({ 
  variant = 'default', 
  size = 'md',
  className,
  children,
  ...props 
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-surface-1 text-muted border-surface-2',
    primary: 'bg-accent/20 text-accent border-accent/30',
    secondary: 'bg-accent-2/20 text-accent-2 border-accent-2/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
