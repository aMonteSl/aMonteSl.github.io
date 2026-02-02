'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { JourneyLane } from './types'

interface LegendItem {
  lane: JourneyLane
  label: string
  icon?: string // Optional - no longer used
}

interface StreamLegendProps {
  items: LegendItem[]
  /** Visible lanes for filtering */
  visibleLanes?: Set<JourneyLane>
  /** Callback when lane visibility changes */
  onToggleLane?: (lane: JourneyLane) => void
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
 * Compact pill-style design with interactive filtering
 */
export function StreamLegend({ items, visibleLanes, onToggleLane, className }: StreamLegendProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-3 sm:gap-4',
        className
      )}
      role="list"
      aria-label="Timeline legend"
    >
      {items.map((item) => {
        const isVisible = !visibleLanes || visibleLanes.has(item.lane)
        return (
          <motion.button
            key={item.lane}
            onClick={() => onToggleLane?.(item.lane)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full',
              'transition-all duration-300 cursor-pointer',
              isVisible
                ? 'bg-[var(--card)]/60 ring-1 ring-[var(--border)]/30 hover:ring-[var(--border)]/60'
                : 'bg-[var(--card)]/30 ring-1 ring-[var(--border)]/10 opacity-50',
              'text-xs font-medium'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            role="listitem"
            title={isVisible ? `Click to hide ${item.label}` : `Click to show ${item.label}`}
          >
            {/* Color dot */}
            <motion.span
              className={cn('w-2 h-2 rounded-full', colorMap[item.lane])}
              animate={{ opacity: isVisible ? 1 : 0.3 }}
              aria-hidden="true"
            />
            {/* Label */}
            <span className={cn(textColorMap[item.lane], isVisible ? '' : 'opacity-50')}>
              {item.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
