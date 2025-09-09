import React from 'react'
import { cn } from '@/lib/utils'

interface TimelineItem {
  id: string
  title: string
  subtitle?: string
  date: string
  description?: string
  details?: string[]
  type?: 'default' | 'highlight'
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
      
      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={item.id} className="relative flex items-start space-x-6">
            {/* Timeline marker */}
            <div className={cn(
              'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2',
              item.type === 'highlight' 
                ? 'bg-primary border-primary' 
                : 'bg-surface border-border'
            )}>
              <div className={cn(
                'w-2 h-2 rounded-full',
                item.type === 'highlight' ? 'bg-background' : 'bg-text-muted'
              )} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h3 className="text-lg font-semibold text-text-primary">
                  {item.title}
                </h3>
                <time className="text-sm text-text-muted font-medium">
                  {item.date}
                </time>
              </div>
              
              {item.subtitle && (
                <p className="text-text-muted font-medium mb-2">
                  {item.subtitle}
                </p>
              )}
              
              {item.description && (
                <p className="text-text-muted leading-relaxed mb-3">
                  {item.description}
                </p>
              )}
              
              {item.details && item.details.length > 0 && (
                <ul className="space-y-1">
                  {item.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="text-text-muted text-sm flex items-start">
                      <span className="text-primary mr-2 mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
