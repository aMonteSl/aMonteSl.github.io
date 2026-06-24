'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SecondaryProjectsGridProps {
  children: ReactNode
  className?: string
}

export function SecondaryProjectsGrid({ children, className }: SecondaryProjectsGridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-5 md:grid-cols-3 xl:gap-6', className)}>
      {children}
    </div>
  )
}
