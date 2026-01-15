import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  id?: string
  title?: string
  children: ReactNode
  className?: string
}

export function Section({ id, title, children, className }: SectionProps) {
  return (
    <section 
      id={id} 
      className={cn("section", className)}
      aria-labelledby={title ? `${id}-heading` : undefined}
    >
      <div className="container">
        {title && (
          <h2 
            id={`${id}-heading`}
            className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-fg animate-fade-in-up"
          >
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  )
}
