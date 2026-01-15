import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children,
  asChild = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50 will-change-transform"
  
  const variants = {
    primary: "bg-[var(--accent)] text-[var(--bg)] hover:translate-y-[-1px] hover:scale-[1.02] hover:shadow-lg hover:ring-1 hover:ring-[var(--accent)]/40 active:translate-y-[0px] active:scale-[0.99] active:shadow-md",
    ghost: "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card)]/50 relative overflow-hidden after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[var(--accent)] after:transform after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100",
    outline: "border border-[var(--border)] text-[var(--fg)] hover:translate-y-[-1px] hover:scale-[1.02] hover:bg-[var(--card)] hover:border-[var(--accent)]/50 hover:shadow-lg hover:ring-1 hover:ring-[var(--accent)]/40 active:translate-y-[0px] active:scale-[0.99] active:shadow-md"
  }
  
  const sizes = {
    sm: "h-8 px-3 text-sm rounded-lg",
    md: "h-10 px-4 py-2 text-sm rounded-xl",
    lg: "h-12 px-6 py-3 text-base rounded-xl"
  }

  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  )

  if (asChild) {
    return (
      <span className={classes}>
        {children}
      </span>
    )
  }
  
  return (
    <button
      className={classes}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"
