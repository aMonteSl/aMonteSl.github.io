import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export function Card({ 
  children, 
  className, 
  hover = false, 
  padding = 'md',
  ...props 
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-2xl transition-all duration-200',
        paddingClasses[padding],
        hover && 'hover:border-border-hover hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
