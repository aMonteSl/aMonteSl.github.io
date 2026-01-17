'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface GroupCarouselHeaderProps {
  title: string
  description?: string
  position: number // current index
  total: number
  progressBar: ReactNode
}

export function GroupCarouselHeader({
  title,
  description,
  position,
  total,
  progressBar,
}: GroupCarouselHeaderProps) {
  return (
    <div className="space-y-3">
      <motion.div
        key={title}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className="space-y-1"
      >
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-semibold text-white md:text-xl">{title}</h3>
          <span className="text-sm text-white/60">
            {position + 1}/{total}
          </span>
        </div>
        {description && <p className="text-sm text-white/70">{description}</p>}
      </motion.div>
      <div>{progressBar}</div>
    </div>
  )
}
