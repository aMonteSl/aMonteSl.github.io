'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Tooltip } from './Tooltip'

export interface GroupDotsIndicatorProps {
  total: number
  activeIndex: number
  labels?: string[]
  onDotClick?: (index: number) => void
  className?: string
}

export function GroupDotsIndicator({
  total,
  activeIndex,
  labels,
  onDotClick,
  className,
}: GroupDotsIndicatorProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {Array.from({ length: total }).map((_, index) => {
        const label = labels?.[index] ?? `Category ${index + 1}`
        const dot = (
          <motion.button
            key={index}
            onClick={() => onDotClick?.(index)}
            className={cn(
              'rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
              index === activeIndex
                ? 'w-3 h-3 bg-white shadow-lg shadow-white/40'
                : 'w-2 h-2 bg-white/30 hover:bg-white/50'
            )}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={label}
            aria-current={index === activeIndex ? 'page' : undefined}
          />
        )

        return (
          <Tooltip key={`tooltip-${index}`} content={label} side="bottom">
            {dot}
          </Tooltip>
        )
      })}
    </div>
  )
}
