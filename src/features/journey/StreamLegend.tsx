'use client'

import { cn } from '@/lib/utils'
import type { JourneyLane } from './types'

interface LegendItem {
  lane: JourneyLane
  label: string
  icon: string
}

interface StreamLegendProps {
  items: LegendItem[]
  /** Additional className */
  className?: string
}

const colorMap: Record<JourneyLane, string> = {
  education: 'bg-blue-500',
  work: 'bg-emerald-500',
  project: 'bg-violet-500',
  achievement: 'bg-amber-500',
}

const textColorMap: Record<JourneyLane, string> = {
  education: 'text-blue-400',
  work: 'text-emerald-400',
  project: 'text-violet-400',
  achievement: 'text-amber-400',
}

/**
 * StreamLegend - Visual key explaining lane colors
 * Compact pill-style design
 */
export function StreamLegend({ items, className }: StreamLegendProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-3 sm:gap-4',
        className
      )}
      role="list"
      aria-label="Timeline legend"
    >
      {items.map((item) => (
        <div
          key={item.lane}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full',
            'bg-[var(--card)]/60 ring-1 ring-[var(--border)]/30',
            'text-xs font-medium'
          )}
          role="listitem"
        >
          {/* Color dot */}
          <span
            className={cn('w-2 h-2 rounded-full', colorMap[item.lane])}
            aria-hidden="true"
          />
          {/* Label */}
          <span className={textColorMap[item.lane]}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
