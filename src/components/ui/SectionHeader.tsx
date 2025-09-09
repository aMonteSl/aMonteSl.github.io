import React from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  className?: string
  centered?: boolean
}

export function SectionHeader({ 
  title, 
  subtitle, 
  description, 
  className,
  centered = false 
}: SectionHeaderProps) {
  return (
    <div className={cn(
      'space-y-4',
      centered && 'text-center',
      className
    )}>
      {subtitle && (
        <p className="text-primary font-medium text-sm uppercase tracking-wider">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
        {title}
      </h2>
      {description && (
        <p className="text-text-muted text-lg leading-relaxed max-w-3xl">
          {description}
        </p>
      )}
    </div>
  )
}
