import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Container({ children, className, size = 'lg' }: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl'
  }

  return (
    <div className={cn(
      'w-full mx-auto px-4 sm:px-6 lg:px-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  )
}
