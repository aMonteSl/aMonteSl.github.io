'use client'

import { motion, type MotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface AutoplayProgressBarProps {
  progress: MotionValue<number>
  className?: string
}

export function AutoplayProgressBar({ progress, className }: AutoplayProgressBarProps) {
  return (
    <div className={cn('h-1 w-full rounded-full bg-white/10 overflow-hidden', className)}>
      <motion.div
        className="h-full w-full origin-left bg-white/80"
        style={{ scaleX: progress }}
      />
    </div>
  )
}
