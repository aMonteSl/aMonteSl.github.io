'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Icons
function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

interface ProjectImageCarouselProps {
  /** Base path for images (e.g., /projects/code-xr) */
  basePath: string
  /** Array of image filenames */
  images: string[]
  /** Base alt text for accessibility */
  altBase: string
  /** Autoplay interval in ms. Default: 7000 */
  autoplayMs?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * Premium image carousel with crossfade transitions, arrows, dots, and autoplay.
 * Respects prefers-reduced-motion.
 */
export function ProjectImageCarousel({
  basePath,
  images,
  altBase,
  autoplayMs = 7000,
  className,
}: ProjectImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Build full image paths
  const imagePaths = images.length > 0 
    ? images.map(img => `${basePath}/${img}`)
    : ['/projects/placeholder.svg']

  const totalImages = imagePaths.length
  const hasMultipleImages = totalImages > 1

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalImages)
  }, [totalImages])

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages)
  }, [totalImages])

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < totalImages) {
      setCurrentIndex(index)
    }
  }, [totalImages])

  // Autoplay (disabled if reduced motion or paused)
  useEffect(() => {
    if (!hasMultipleImages || isPaused || prefersReducedMotion) return
    
    const timer = setInterval(next, autoplayMs)
    return () => clearInterval(timer)
  }, [hasMultipleImages, isPaused, prefersReducedMotion, next, autoplayMs])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    }
  }, [prev, next])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--accent)]/10 to-[var(--card)] ring-1 ring-[var(--border)]/50',
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${altBase} gallery`}
    >
      {/* Image container with crossfade */}
      <AnimatePresence mode="wait">
        <motion.img
          key={imagePaths[currentIndex]}
          src={imagePaths[currentIndex]}
          alt={`${altBase} - ${currentIndex + 1} of ${totalImages}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/projects/placeholder.svg'
          }}
        />
      </AnimatePresence>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

      {/* Navigation arrows (only if multiple images) */}
      {hasMultipleImages && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
            style={{ opacity: isPaused ? 1 : 0 }}
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
            style={{ opacity: isPaused ? 1 : 0 }}
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {hasMultipleImages && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {imagePaths.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); goTo(idx) }}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                idx === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 w-2 hover:bg-white/75'
              )}
              aria-label={`Go to image ${idx + 1}`}
              aria-current={idx === currentIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}

      {/* Image counter badge */}
      {hasMultipleImages && (
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-xs font-medium z-10">
          {currentIndex + 1} / {totalImages}
        </div>
      )}
    </div>
  )
}
