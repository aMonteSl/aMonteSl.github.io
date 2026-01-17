'use client'

import { motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { cn } from '@/lib/utils'

export interface CarouselNavArrowsProps {
  onPrev?: () => void
  onNext?: () => void
  prevLabel?: string
  nextLabel?: string
  disabled?: boolean
  className?: string
}

export function CarouselNavArrows({
  onPrev,
  onNext,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  disabled = false,
  className,
}: CarouselNavArrowsProps) {
  return (
    <div
      className={cn('absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4', className)}
      aria-hidden="true"
    >
      <motion.button
        onClick={onPrev}
        disabled={disabled}
        className={cn(
          'relative flex items-center justify-center rounded-full',
          'w-10 h-10 md:w-12 md:h-12',
          'border border-white/20 bg-white/5 backdrop-blur-sm',
          'text-white/70 hover:text-white hover:bg-white/10 hover:border-white/40',
          'transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
          disabled && 'opacity-30 cursor-not-allowed'
        )}
        whileHover={!disabled ? { scale: 1.1 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        aria-label={prevLabel}
        title={prevLabel}
      >
        <FaChevronLeft className="w-5 h-5" />
      </motion.button>

      <motion.button
        onClick={onNext}
        disabled={disabled}
        className={cn(
          'relative flex items-center justify-center rounded-full',
          'w-10 h-10 md:w-12 md:h-12',
          'border border-white/20 bg-white/5 backdrop-blur-sm',
          'text-white/70 hover:text-white hover:bg-white/10 hover:border-white/40',
          'transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
          disabled && 'opacity-30 cursor-not-allowed'
        )}
        whileHover={!disabled ? { scale: 1.1 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        aria-label={nextLabel}
        title={nextLabel}
      >
        <FaChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  )
}
