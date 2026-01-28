'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'
import { useImageRotation } from './useImageRotation'

// Arrow icons
function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

/** Aspect ratio presets */
export type AspectRatioPreset = 'video' | 'portrait' | 'square'

/** Map preset names to Tailwind aspect ratio classes */
const aspectRatioClasses: Record<AspectRatioPreset, string> = {
  video: 'aspect-video',      // 16:9
  portrait: 'aspect-[4/5]',   // 4:5
  square: 'aspect-square',    // 1:1
}

export interface ImageCarouselProps {
  /** Array of image paths OR filenames (if basePath is provided) */
  images: string[]
  /** Optional base path to prepend to each image filename */
  basePath?: string
  /** Alt text for the images */
  alt: string
  /** Rotation interval in ms. Default: 5000 */
  interval?: number
  /** Additional CSS classes for container */
  className?: string
  
  // Feature toggles
  /** Whether to show navigation dots. Default: true */
  showDots?: boolean
  /** Whether to show navigation arrows. Default: true */
  showArrows?: boolean
  /** Whether to show progress bar. Default: true */
  showProgress?: boolean
  /** Whether to show image counter badge (e.g., "2/5"). Default: true */
  showCounter?: boolean
  /** Whether to pause on hover. Default: true */
  pauseOnHover?: boolean
  /** Whether to enable keyboard navigation. Default: true */
  keyboardNavigation?: boolean
  /** Whether to respect prefers-reduced-motion. Default: true */
  respectReducedMotion?: boolean
  
  // Visual customization
  /** Aspect ratio preset or custom Tailwind class. Default: 'video' */
  aspectRatio?: AspectRatioPreset | string
  /** Arrow button size. Default: 'md' */
  arrowSize?: 'sm' | 'md'
  /** Whether to show rounded corners. Default: true */
  rounded?: boolean
}

/**
 * Unified ImageCarousel component with crossfade transitions.
 * 
 * Features:
 * - Smooth crossfade transitions between images
 * - Progress bar showing time until next image
 * - Hover pause functionality
 * - Image counter badge (X/Y)
 * - Navigation dots
 * - Arrow navigation
 * - Keyboard navigation (arrow keys)
 * - Placeholder fallback on error or empty images
 * - Visibility detection (pauses when off-screen)
 * - Respects prefers-reduced-motion
 */
export function ImageCarousel({
  images,
  basePath,
  alt,
  interval = 5000,
  className,
  showDots = true,
  showArrows = true,
  showProgress = true,
  showCounter = true,
  pauseOnHover = true,
  keyboardNavigation = true,
  respectReducedMotion = true,
  aspectRatio = 'video',
  arrowSize = 'md',
  rounded = true,
}: ImageCarouselProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Build full image paths if basePath is provided
  const imagePaths = basePath
    ? images.map(img => `${basePath}/${img}`)
    : images
  
  // Intersection Observer for visibility detection
  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )
    
    observer.observe(element)
    
    return () => {
      observer.disconnect()
    }
  }, [])
  
  const {
    currentImage,
    currentIndex,
    totalImages,
    goTo,
    next,
    prev,
    progress,
    isAutoPlaying,
    prefersReducedMotion,
  } = useImageRotation({
    images: imagePaths,
    interval,
    paused: pauseOnHover && isHovered,
    isVisible,
    respectReducedMotion,
  })
  
  const hasMultipleImages = totalImages > 1
  
  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!keyboardNavigation || !hasMultipleImages) return
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    }
  }, [keyboardNavigation, hasMultipleImages, prev, next])
  
  // Determine aspect ratio class
  const aspectClass = aspectRatio in aspectRatioClasses
    ? aspectRatioClasses[aspectRatio as AspectRatioPreset]
    : aspectRatio // Allow custom Tailwind class like 'aspect-[3/2]'
  
  // Arrow size classes
  const arrowSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
  }
  
  const arrowIconClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  }
  
  // Empty state
  if (imagePaths.length === 0) {
    return (
      <div
        className={cn(
          'relative overflow-hidden bg-gradient-to-br from-[var(--accent)]/20 to-[var(--card)] flex items-center justify-center',
          aspectClass,
          rounded && 'rounded-2xl',
          className
        )}
      >
        <img 
          src={PLACEHOLDER_IMAGE} 
          alt="Placeholder"
          className="w-full h-full object-contain p-8 opacity-60"
        />
      </div>
    )
  }
  
  return (
    <div
      ref={containerRef}
      className={cn(
        'group/carousel relative overflow-hidden bg-[var(--card)]',
        aspectClass,
        rounded && 'rounded-2xl',
        keyboardNavigation && 'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => keyboardNavigation && setIsHovered(true)}
      onBlur={() => keyboardNavigation && setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={keyboardNavigation ? 0 : undefined}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${alt} gallery`}
    >
      {/* Image crossfade container */}
      <AnimatePresence initial={false}>
        <motion.img
          key={currentImage}
          src={currentImage}
          alt={hasMultipleImages ? `${alt} - ${currentIndex + 1} of ${totalImages}` : alt}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeInOut' }}
          loading="eager"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = PLACEHOLDER_IMAGE
          }}
        />
      </AnimatePresence>

      {/* Image counter badge - top right */}
      {hasMultipleImages && showCounter && (
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/50 text-white text-xs font-medium z-10">
          {currentIndex + 1} / {totalImages}
        </div>
      )}

      {/* Navigation arrows */}
      {hasMultipleImages && showArrows && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              prev()
            }}
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 z-10',
              arrowSizeClasses[arrowSize],
              'rounded-full bg-black/50',
              'flex items-center justify-center',
              'text-white/80 hover:text-white hover:bg-black/70',
              'opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200',
              'focus:outline-none focus:ring-2 focus:ring-white/50 focus:opacity-100'
            )}
            aria-label="Previous image"
          >
            <ChevronLeftIcon className={arrowIconClasses[arrowSize]} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              next()
            }}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 z-10',
              arrowSizeClasses[arrowSize],
              'rounded-full bg-black/50',
              'flex items-center justify-center',
              'text-white/80 hover:text-white hover:bg-black/70',
              'opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200',
              'focus:outline-none focus:ring-2 focus:ring-white/50 focus:opacity-100'
            )}
            aria-label="Next image"
          >
            <ChevronRightIcon className={arrowIconClasses[arrowSize]} />
          </button>
        </>
      )}

      {/* Navigation dots - bottom center */}
      {hasMultipleImages && showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {Array.from({ length: totalImages }).map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                goTo(idx)
              }}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-white/50',
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

      {/* Progress bar - bottom edge */}
      {hasMultipleImages && showProgress && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-10">
          <div
            className={cn(
              'h-full origin-left transition-colors duration-300',
              isAutoPlaying ? 'bg-[var(--accent)]' : 'bg-red-500'
            )}
            style={{
              transform: `scaleX(${progress})`,
            }}
          />
        </div>
      )}
    </div>
  )
}
