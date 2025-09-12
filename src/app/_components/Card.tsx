import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div className={cn(
      "bg-card border border-border rounded-2xl p-6 transition-all duration-200",
      hover && "hover:border-accent/30 hover:shadow-soft hover:-translate-y-1",
      className
    )}>
      {children}
    </div>
  )
}
