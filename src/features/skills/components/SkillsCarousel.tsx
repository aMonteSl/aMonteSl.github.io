'use client'

import { AnimatePresence, motion, type MotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SkillSlide, type SkillSlideData } from './SkillSlide'
import { AutoplayProgressBar } from './AutoplayProgressBar'

export interface SkillsCarouselProps {
  items: SkillSlideData[]
  activeIndex: number
  onNext: () => void
  onPrev: () => void
  onGoTo: (index: number) => void
  onNavigate: (href: string) => void
  reduceMotion?: boolean
  progress: MotionValue<number>
  onPause: () => void
  onResume: () => void
  nextLabel: string
  prevLabel: string
  goToLabel: (index: number) => string
}

export function SkillsCarousel({
  items,
  activeIndex,
  onNext,
  onPrev,
  onGoTo,
  onNavigate,
  reduceMotion = false,
  progress,
  onPause,
  onResume,
  nextLabel,
  prevLabel,
  goToLabel,
}: SkillsCarouselProps) {
  const current = items[activeIndex]

  if (!current) return null

  return (
    <div
      className="space-y-4"
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocusCapture={onPause}
      onBlurCapture={(event) => {
        const related = event.relatedTarget as Node | null
        if (!event.currentTarget.contains(related)) {
          onResume()
        }
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onPrev}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)]/60 text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] hover:border-[var(--accent)]/40"
          aria-label={prevLabel}
        >
          <span aria-hidden="true">←</span>
        </button>
        <span className="text-xs text-[var(--fg-muted)]">
          {activeIndex + 1} / {items.length}
        </span>
        <button
          onClick={onNext}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)]/60 text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] hover:border-[var(--accent)]/40"
          aria-label={nextLabel}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <AutoplayProgressBar progress={progress} />

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            drag={!reduceMotion ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (reduceMotion) return
              if (info.offset.x > 80) {
                onPrev()
              } else if (info.offset.x < -80) {
                onNext()
              }
            }}
          >
            <SkillSlide skill={current} onNavigate={onNavigate} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onGoTo(index)}
            className={cn(
              'h-2 w-6 rounded-full transition-colors',
              index === activeIndex
                ? 'bg-[var(--accent)]/70'
                : 'bg-[var(--border)]/70 hover:bg-[var(--accent)]/40'
            )}
            aria-label={goToLabel(index)}
          />
        ))}
      </div>
    </div>
  )
}
