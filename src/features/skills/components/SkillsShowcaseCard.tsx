'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CarouselNavArrows } from './CarouselNavArrows'

export interface SkillsShowcaseCardProps {
  header: ReactNode
  chips: ReactNode
  legend?: ReactNode
  footer: ReactNode
  onPrev?: () => void
  onNext?: () => void
  onKeyDown?: (key: 'ArrowLeft' | 'ArrowRight') => void
  onPause?: () => void
  onResume?: () => void
  prevLabel?: string
  nextLabel?: string
  className?: string
}

export function SkillsShowcaseCard({
  header,
  chips,
  legend,
  footer,
  onPrev,
  onNext,
  onKeyDown,
  onPause,
  onResume,
  prevLabel,
  nextLabel,
  className,
}: SkillsShowcaseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onKeyDown?.('ArrowLeft')
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        onKeyDown?.('ArrowRight')
      }
    }

    const card = cardRef.current
    card.addEventListener('keydown', handleKeyDown)
    return () => card.removeEventListener('keydown', handleKeyDown)
  }, [onKeyDown])

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      className={cn(
        'relative overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-md',
        'shadow-lg ring-1 ring-white/20',
        'h-[380px] md:h-[400px]',
        'flex flex-col',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
        className
      )}
      tabIndex={0}
      role="region"
      aria-label="Skills showcase"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navigation arrows */}
      <CarouselNavArrows
        onPrev={onPrev}
        onNext={onNext}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
      />

      {/* Header section with category title, description, position and progress (full width) */}
      <div className="px-6 md:px-8 pt-6 md:pt-8">
        {header}
      </div>

      {/* Chips section - centered vertically with flex-1 */}
      <div className="flex-1 px-14 flex flex-col items-center justify-center overflow-y-auto">
        {chips}
      </div>

      {/* Legend section - minimal proficiency indicator explanation */}
      {legend && <div className="mb-2">{legend}</div>}

      {/* Footer with navigation and CTA (fixed height) */}
      <div className="px-6 md:px-8 h-12 flex items-center justify-between gap-4 pt-2 border-t border-white/10 flex-shrink-0">
        {footer}
      </div>
    </motion.div>
  )
}
