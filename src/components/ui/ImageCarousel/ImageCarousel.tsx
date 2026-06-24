'use client'

import Image from 'next/image'
import { useState, useRef, useEffect, useCallback, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'
import { CAROUSEL_ROTATION_INTERVAL_MS } from '@/lib/timing'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@/components/ui/icons'
import { useImageRotation } from './useImageRotation'

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
  /** Rotation interval in ms. Default: shared carousel duration */
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
  /** CSS object-fit for images. Default: 'cover' */
  objectFit?: 'cover' | 'contain'
  /** Whether clicking the image opens a full-screen gallery. Default: false */
  enableLightbox?: boolean
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
  interval = CAROUSEL_ROTATION_INTERVAL_MS,
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
  objectFit = 'cover',
  enableLightbox = false,
}: ImageCarouselProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [controlsOnLight, setControlsOnLight] = useState(false)
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

  useEffect(() => {
    let cancelled = false

    const image = new window.Image()
    image.crossOrigin = 'anonymous'
    image.src = currentImage

    image.onload = () => {
      if (cancelled) return

      const canvas = document.createElement('canvas')
      const width = 48
      const height = 18
      canvas.width = width
      canvas.height = height

      const context = canvas.getContext('2d', { willReadFrequently: true })
      if (!context) return

      const sampleWidth = Math.max(1, image.naturalWidth * 0.28)
      const sampleHeight = Math.max(1, image.naturalHeight * 0.12)
      const sampleX = Math.max(0, (image.naturalWidth - sampleWidth) / 2)
      const sampleY = Math.max(0, image.naturalHeight * 0.82)

      try {
        context.drawImage(
          image,
          sampleX,
          sampleY,
          sampleWidth,
          sampleHeight,
          0,
          0,
          width,
          height
        )

        const pixels = context.getImageData(0, 0, width, height).data
        let luminance = 0

        for (let index = 0; index < pixels.length; index += 4) {
          luminance += (0.2126 * pixels[index] + 0.7152 * pixels[index + 1] + 0.0722 * pixels[index + 2]) / 255
        }

        setControlsOnLight(luminance / (pixels.length / 4) > 0.62)
      } catch {
        setControlsOnLight(false)
      }
    }

    image.onerror = () => {
      if (!cancelled) {
        setControlsOnLight(false)
      }
    }

    return () => {
      cancelled = true
    }
  }, [currentImage])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false)
  }, [])

  const openLightbox = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (!enableLightbox) return
    event.preventDefault()
    event.stopPropagation()
    setIsLightboxOpen(true)
  }, [enableLightbox])

  useEffect(() => {
    if (!isLightboxOpen) return

    const handleLightboxKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox()
      } else if (event.key === 'ArrowLeft' && hasMultipleImages) {
        prev()
      } else if (event.key === 'ArrowRight' && hasMultipleImages) {
        next()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleLightboxKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleLightboxKeyDown)
    }
  }, [closeLightbox, hasMultipleImages, isLightboxOpen, next, prev])
  
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
        <Image
          src={PLACEHOLDER_IMAGE}
          alt="Placeholder"
          fill
          sizes="100vw"
          unoptimized
          className="w-full h-full object-contain p-8 opacity-60"
        />
      </div>
    )
  }
  
  return (
    <>
    <div
      ref={containerRef}
      className={cn(
        'group/carousel relative overflow-hidden bg-black/70',
        aspectClass,
        rounded && 'rounded-2xl',
        keyboardNavigation && 'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2',
        enableLightbox && 'cursor-zoom-in',
        className
      )}
      onClick={openLightbox}
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
        <motion.div
          key={currentImage}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeInOut' }}
        >
          <Image
            src={currentImage}
            alt={hasMultipleImages ? `${alt} - ${currentIndex + 1} of ${totalImages}` : alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            unoptimized
            loading="eager"
            draggable={false}
            className={cn('photo-render', objectFit === 'contain' ? 'object-contain' : 'object-cover')}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              if (!target.src.endsWith(PLACEHOLDER_IMAGE)) {
                target.src = PLACEHOLDER_IMAGE
              }
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Image counter badge - top right */}
      {hasMultipleImages && showCounter && (
        <div
          className={cn(
            'absolute top-3 right-3 z-10 rounded-full px-2 py-1 text-xs font-medium backdrop-blur-sm',
            controlsOnLight
              ? 'bg-black/68 text-white shadow-sm shadow-black/25'
              : 'bg-black/50 text-white'
          )}
        >
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
        <div
          className={cn(
            'absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full px-2 py-1.5 transition-colors duration-300',
            controlsOnLight && 'bg-white/18 backdrop-blur-[2px]'
          )}
        >
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
                controlsOnLight ? 'focus:outline-none focus:ring-2 focus:ring-black/45' : 'focus:outline-none focus:ring-2 focus:ring-white/50',
                idx === currentIndex
                  ? controlsOnLight
                    ? 'bg-neutral-950 w-6'
                    : 'bg-white w-6'
                  : controlsOnLight
                    ? 'bg-neutral-950/45 w-2 hover:bg-neutral-950/70'
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
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 z-10 h-1',
            controlsOnLight ? 'bg-black/12' : 'bg-black/20'
          )}
        >
          <div
            className={cn(
              'h-full origin-left transition-colors duration-300',
              isAutoPlaying
                ? controlsOnLight
                  ? 'bg-neutral-950'
                  : 'bg-[var(--accent)]'
                : 'bg-red-500'
            )}
            style={{
              transform: `scaleX(${progress})`,
            }}
          />
        </div>
      )}
    </div>
    {isMounted && createPortal(
      <AnimatePresence>
        {enableLightbox && isLightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/72 p-4 backdrop-blur-xl sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} expanded gallery`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            onClick={closeLightbox}
          >
          <motion.div
            className="relative flex w-full max-w-[min(92vw,82rem)] flex-col gap-3"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14, scale: prefersReducedMotion ? 1 : 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 10, scale: prefersReducedMotion ? 1 : 0.985 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(event) => event.stopPropagation()}
          >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white/90">{alt}</p>
                  {hasMultipleImages && (
                    <p className="mt-0.5 text-xs text-white/55">
                      {currentIndex + 1} / {totalImages}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/18 bg-black/55 text-white/82 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close image gallery"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-white/14 bg-black/78 shadow-2xl shadow-black/60">
                <div className="relative h-[min(72dvh,46rem)] w-full">
                  <Image
                    src={currentImage}
                    alt={hasMultipleImages ? `${alt} - ${currentIndex + 1} of ${totalImages}` : alt}
                    fill
                    sizes="92vw"
                    unoptimized
                    draggable={false}
                    className="object-contain"
                  />
                </div>

              {hasMultipleImages && (
                <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        prev()
                      }}
                      className="absolute left-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/58 text-white/82 transition-colors hover:bg-white/10 hover:text-white sm:left-4 sm:h-11 sm:w-11"
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        next()
                      }}
                      className="absolute right-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/58 text-white/82 transition-colors hover:bg-white/10 hover:text-white sm:right-4 sm:h-11 sm:w-11"
                      aria-label="Next image"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>

                  <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/12 bg-black/58 px-3 py-2 backdrop-blur-sm">
                    {Array.from({ length: totalImages }).map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            goTo(idx)
                          }}
                          className={cn(
                            'h-2 rounded-full transition-all',
                            idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/45 hover:bg-white/75'
                          )}
                          aria-label={`Go to image ${idx + 1}`}
                          aria-current={idx === currentIndex ? 'true' : undefined}
                      />
                    ))}
                  </div>

                  {showProgress && (
                    <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-black/35">
                      <div
                        className={cn(
                          'h-full origin-left transition-colors duration-300',
                          isAutoPlaying ? 'bg-[var(--accent)]' : 'bg-red-500'
                        )}
                        style={{ transform: `scaleX(${progress})` }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  )
}
