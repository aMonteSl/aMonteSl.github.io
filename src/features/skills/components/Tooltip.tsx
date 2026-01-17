'use client'

import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface TooltipProps {
  content: string
  children: ReactNode
  side?: 'top' | 'bottom'
  className?: string
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              'absolute left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-medium text-white',
              'bg-white/20 backdrop-blur-sm border border-white/30 whitespace-nowrap',
              'pointer-events-none',
              side === 'top' && '-top-8 mb-1',
              side === 'bottom' && 'top-full mt-1',
              className
            )}
            initial={{ opacity: 0, y: side === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: side === 'top' ? 4 : -4 }}
            transition={{ duration: 0.15 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
