import React from 'react'
import { cn } from '@/lib/utils'

interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  className?: string
}

interface ButtonAsButton extends BaseButtonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  as?: 'button'
  href?: never
  children: React.ReactNode
}

interface ButtonAsLink extends BaseButtonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  as: 'a'
  href: string
  children: React.ReactNode
}

interface ButtonAsRouterLink extends BaseButtonProps {
  as: typeof import('react-router-dom').Link
  to: string
  children: React.ReactNode
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsRouterLink

export function Button({ 
  variant = 'primary',
  size = 'md',
  className,
  children,
  loading = false,
  fullWidth = false,
  as = 'button',
  ...props 
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-accent text-bg hover:bg-accent/90 focus:ring-accent',
    secondary: 'bg-surface-1 text-ink border border-surface-2 hover:bg-surface-2 focus:ring-accent',
    ghost: 'text-muted hover:text-ink hover:bg-surface-1 focus:ring-accent',
    outline: 'border border-surface-2 text-ink hover:bg-surface-1 focus:ring-accent'
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  }

  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 gap-2',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  )

  const content = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </>
  )

  if (as === 'a') {
    const linkProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a className={baseClasses} {...linkProps}>
        {content}
      </a>
    )
  }

  if (as !== 'button') {
    const Component = as
    const linkProps = props as any
    return (
      <Component className={baseClasses} {...linkProps}>
        {content}
      </Component>
    )
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button
      className={baseClasses}
      disabled={buttonProps.disabled || loading}
      {...buttonProps}
    >
      {content}
    </button>
  )
}
