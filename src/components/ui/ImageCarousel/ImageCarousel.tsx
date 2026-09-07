'use client'

import Image from 'next/image'
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from '@/i18n'
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

/** Touch-friendly sizes first; the compact size only applies to fine pointers. */
const arrowSizeClasses = {
  sm: 'size-8 pointer-coarse:size-10',
  md: 'size-10 pointer-coarse:size-11',
} as const

const arrowIconClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
} as const

/**
 * Tailwind v4 wraps every hover: rule in @media (hover: hover), so the arrows
 * would never appear on touch devices without the any-pointer-coarse fallback.
 */
const ARROW_VISIBILITY_CLASSES =
  'opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100 group-focus-within/carousel:opacity-100 focus-visible:opacity-100 any-pointer-coarse:opacity-100'

/** Distance (px) before a drag commits to an axis. */
const SWIPE_AXIS_LOCK_PX = 10
/** Horizontal distance (px) required to count as a swipe. */
const SWIPE_THRESHOLD_PX = 40
/** Downward distance (px) required for a swipe-down to close the lightbox. */
const SWIPE_DOWN_CLOSE_PX = 80
/** Maximum number of pagination dots rendered at once. */
const MAX_VISIBLE_DOTS = 7

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Pointer-initiated focus (a tap or click on the root or on a button inside it)
 * does not match :focus-visible; keyboard focus does. Only the latter should
 * pause autoplay, otherwise a touch tap parks the carousel until the next blur.
 */
function isKeyboardFocus(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  try {
    return target.matches(':focus-visible')
  } catch {
    // Selector unsupported: keep the previous behaviour and treat it as keyboard focus.
    return true
  }
}

/** Keeps Tab / Shift+Tab cycling inside a modal container. */
function trapTabWithin(container: HTMLElement, event: KeyboardEvent) {
  const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement
  const focusIsInside = container.contains(active)

  if (event.shiftKey) {
    if (active === first || !focusIsInside) {
      event.preventDefault()
      last.focus()
    }
  } else if (active === last || !focusIsInside) {
    event.preventDefault()
    first.focus()
  }
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

interface DotWindow {
  /** First index rendered (inclusive) */
  start: number
  /** Last index rendered (exclusive) */
  end: number
}

/**
 * Sliding window of pagination dots centred on the current index.
 * Pure helper: with 14 images and a 7-dot window the strip stays ~180px wide.
 */
function getDotWindow(total: number, current: number, max = MAX_VISIBLE_DOTS): DotWindow {
  if (total <= max) {
    return { start: 0, end: total }
  }

  const half = Math.floor(max / 2)
  const start = Math.min(Math.max(current - half, 0), total - max)

  return { start, end: start + max }
}

interface CarouselDotsProps {
  total: number
  current: number
  onSelect: (index: number) => void
  /** Whether the controls sit on a light image region */
  onLight?: boolean
  className?: string
}

/**
 * Pagination dots shared by the inline strip and the lightbox.
 * Each dot keeps its 8px visual but is wrapped in a 24px-wide button whose
 * hit area is stretched to 40px tall with a pseudo-element.
 */
function CarouselDots({ total, current, onSelect, onLight = false, className }: CarouselDotsProps) {
  const t = useTranslations('carousel')
  const { start, end } = getDotWindow(total, current)
  const hasMoreBefore = start > 0
  const hasMoreAfter = end < total
  const indices = Array.from({ length: end - start }, (_, offset) => start + offset)

  return (
    <div className={cn('flex items-center', className)}>
      {indices.map((index) => {
        const isActive = index === current
        const isEdge =
          !isActive && ((hasMoreBefore && index === start) || (hasMoreAfter && index === end - 1))

        return (
          <button
            key={index}
            type="button"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onSelect(index)
            }}
            className={cn(
              'group/dot relative flex h-6 min-w-6 items-center justify-center rounded-full px-1',
              "before:absolute before:inset-x-0 before:-inset-y-2 before:content-['']",
              'focus:outline-none focus-visible:ring-2',
              onLight ? 'focus-visible:ring-black/45' : 'focus-visible:ring-white/50'
            )}
            aria-label={t('goTo', { index: index + 1 })}
            aria-current={isActive ? 'true' : undefined}
          >
            <span
              aria-hidden="true"
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                isActive ? 'w-6' : 'w-2',
                isEdge && 'scale-75 opacity-60',
                isActive
                  ? onLight
                    ? 'bg-neutral-950'
                    : 'bg-white'
                  : onLight
                    ? 'bg-neutral-950/45 group-hover/dot:bg-neutral-950/70'
                    : 'bg-white/50 group-hover/dot:bg-white/75'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

/**
 * Pauses autoplay for one interval after a manual interaction so the image the
 * user just picked is not swapped away immediately.
 */
function useInteractionPause(interval: number): [boolean, () => void] {
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const markInteraction = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setIsPaused(true)
    timerRef.current = setTimeout(() => {
      setIsPaused(false)
      timerRef.current = null
    }, interval)
  }, [interval])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return [isPaused, markInteraction]
}

interface SwipeGesture {
  id: number
  pointerType: string
  startX: number
  startY: number
  axis: 'x' | 'y' | null
}

interface UseSwipeNavigationOptions {
  /** Whether horizontal swipes navigate (false for a single image) */
  enabled: boolean
  /** Finger moved left -> show the next image */
  onSwipeLeft: () => void
  /** Finger moved right -> show the previous image */
  onSwipeRight: () => void
  /**
   * Finger (touch/pen only) moved down past SWIPE_DOWN_CLOSE_PX -> e.g. close the lightbox.
   * When omitted, vertical intent releases the gesture so the page can scroll.
   */
  onSwipeDown?: () => void
  /** Set for one tick after a swipe so the trailing click is ignored */
  suppressClickRef: RefObject<boolean>
}

interface SwipeHandlers {
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerCancel: (event: ReactPointerEvent<HTMLDivElement>) => void
}

/**
 * Swipe detection built on pointer events.
 * Horizontal intent captures the pointer so the swipe completes even if it leaves
 * the element. Vertical intent releases the gesture so the page keeps scrolling,
 * unless `onSwipeDown` is provided (lightbox), in which case a touch/pen drag down
 * is tracked and a long enough one closes.
 */
function useSwipeNavigation({
  enabled,
  onSwipeLeft,
  onSwipeRight,
  onSwipeDown,
  suppressClickRef,
}: UseSwipeNavigationOptions): SwipeHandlers {
  const gestureRef = useRef<SwipeGesture | null>(null)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if ((!enabled && !onSwipeDown) || !event.isPrimary || event.button !== 0) return
    // Arrows and dots handle their own taps.
    if (event.target instanceof Element && event.target.closest('button')) return

    gestureRef.current = {
      id: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      startY: event.clientY,
      axis: null,
    }
  }, [enabled, onSwipeDown])

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || gesture.id !== event.pointerId || gesture.axis !== null) return

    const dx = event.clientX - gesture.startX
    const dy = event.clientY - gesture.startY
    if (Math.abs(dx) < SWIPE_AXIS_LOCK_PX && Math.abs(dy) < SWIPE_AXIS_LOCK_PX) return

    if (Math.abs(dy) >= Math.abs(dx)) {
      // Vertical intent: track it only when a swipe-down handler exists (touch/pen);
      // otherwise hand the gesture back to the page so it can scroll.
      if (!onSwipeDown || gesture.pointerType === 'mouse') {
        gestureRef.current = null
        return
      }
      gesture.axis = 'y'
    } else if (!enabled) {
      // Single image: nothing to navigate to.
      gestureRef.current = null
      return
    } else {
      gesture.axis = 'x'
    }

    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Capture is best-effort; the pointer may already be gone.
    }
  }, [enabled, onSwipeDown])

  const onPointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || gesture.id !== event.pointerId) return

    gestureRef.current = null
    if (gesture.axis === null) return

    const dx = event.clientX - gesture.startX
    const dy = event.clientY - gesture.startY

    if (gesture.axis === 'y') {
      if (!onSwipeDown || dy < SWIPE_DOWN_CLOSE_PX || dy <= Math.abs(dx)) return
      onSwipeDown()
    } else {
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) <= Math.abs(dy)) return
      if (dx < 0) {
        onSwipeLeft()
      } else {
        onSwipeRight()
      }
    }

    // The browser may still fire a click for this pointer; ignore it.
    suppressClickRef.current = true
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current)
    }
    resetTimerRef.current = setTimeout(() => {
      suppressClickRef.current = false
      resetTimerRef.current = null
    }, 0)
  }, [onSwipeLeft, onSwipeRight, onSwipeDown, suppressClickRef])

  const onPointerCancel = useCallback(() => {
    gestureRef.current = null
  }, [])

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel }
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
 * - Swipe navigation on touch devices
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
  const t = useTranslations('carousel')
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [controlsOnLight, setControlsOnLight] = useState(false)
  const [interactionPaused, markInteraction] = useInteractionPause(interval)
  const containerRef = useRef<HTMLDivElement>(null)
  const lightboxPanelRef = useRef<HTMLDivElement>(null)
  const lightboxCloseRef = useRef<HTMLButtonElement>(null)
  const suppressClickRef = useRef(false)

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
    paused: (pauseOnHover && isHovered) || isLightboxOpen || interactionPaused,
    isVisible,
    respectReducedMotion,
  })

  const hasMultipleImages = totalImages > 1

  // Manual navigation pauses autoplay for one interval
  const manualNext = useCallback(() => {
    next()
    markInteraction()
  }, [next, markInteraction])

  const manualPrev = useCallback(() => {
    prev()
    markInteraction()
  }, [prev, markInteraction])

  const manualGoTo = useCallback((index: number) => {
    goTo(index)
    markInteraction()
  }, [goTo, markInteraction])

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false)
  }, [])

  // Inline carousel: horizontal swipes only, vertical drags keep scrolling the page.
  const swipeHandlers = useSwipeNavigation({
    enabled: hasMultipleImages,
    onSwipeLeft: manualNext,
    onSwipeRight: manualPrev,
    suppressClickRef,
  })

  // Lightbox frame: the page cannot scroll, so a swipe down closes instead.
  const lightboxSwipeHandlers = useSwipeNavigation({
    enabled: hasMultipleImages,
    onSwipeLeft: manualNext,
    onSwipeRight: manualPrev,
    onSwipeDown: closeLightbox,
    suppressClickRef,
  })

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

  const handleRootClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    // A swipe must neither open the lightbox nor bubble to the parent card.
    if (suppressClickRef.current) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    if (!enableLightbox) return
    event.preventDefault()
    event.stopPropagation()
    setIsLightboxOpen(true)
  }, [enableLightbox])

  // Only real mouse hover pauses; touch taps emit synthetic mouse events that would stick.
  const handleHoverStart = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') {
      setIsHovered(true)
    }
  }, [])

  const handleHoverEnd = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') {
      setIsHovered(false)
    }
  }, [])

  useEffect(() => {
    if (!isLightboxOpen) return

    const handleLightboxKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox()
      } else if (event.key === 'ArrowLeft' && hasMultipleImages) {
        manualPrev()
      } else if (event.key === 'ArrowRight' && hasMultipleImages) {
        manualNext()
      } else if (event.key === 'Tab' && lightboxPanelRef.current) {
        trapTabWithin(lightboxPanelRef.current, event)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleLightboxKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleLightboxKeyDown)
    }
  }, [closeLightbox, hasMultipleImages, isLightboxOpen, manualNext, manualPrev])

  // Move focus into the dialog on open and hand it back on close. Keyed on the open
  // flag alone so navigating inside the lightbox never yanks focus around.
  useEffect(() => {
    if (!isLightboxOpen) return

    const rootElement = containerRef.current
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const frame = window.requestAnimationFrame(() => lightboxCloseRef.current?.focus())

    return () => {
      window.cancelAnimationFrame(frame)
      const restoreTarget =
        previouslyFocused && previouslyFocused !== document.body && previouslyFocused.isConnected
          ? previouslyFocused
          : rootElement
      restoreTarget?.focus({ preventScroll: true })
    }
  }, [isLightboxOpen])

  // Keyboard navigation handler. While the lightbox is open the document listener
  // owns the arrow keys; handling them here too would advance two images per press.
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!keyboardNavigation || !hasMultipleImages || isLightboxOpen) return

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      manualPrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      manualNext()
    }
  }, [keyboardNavigation, hasMultipleImages, isLightboxOpen, manualPrev, manualNext])

  // Only keyboard focus pauses autoplay; a tap on the root or on an inner button also
  // focuses it (Chrome Android, iOS) and must not mask the one-interval resume.
  const handleRootFocus = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (keyboardNavigation && isKeyboardFocus(event.target)) {
      setIsHovered(true)
    }
  }, [keyboardNavigation])

  // Determine aspect ratio class
  const aspectClass = aspectRatio in aspectRatioClasses
    ? aspectRatioClasses[aspectRatio as AspectRatioPreset]
    : aspectRatio // Allow custom Tailwind class like 'aspect-[3/2]'

  const imageAlt = hasMultipleImages
    ? t('imageOf', { title: alt, current: currentIndex + 1, total: totalImages })
    : alt

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
          alt={t('placeholderAlt')}
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
        'group/carousel relative overflow-hidden bg-black/70 touch-pan-y touch-pinch-zoom select-none [-webkit-tap-highlight-color:transparent]',
        aspectClass,
        rounded && 'rounded-2xl',
        keyboardNavigation && 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
        enableLightbox && 'cursor-zoom-in',
        className
      )}
      onClick={handleRootClick}
      onPointerEnter={handleHoverStart}
      onPointerLeave={handleHoverEnd}
      onPointerDown={swipeHandlers.onPointerDown}
      onPointerMove={swipeHandlers.onPointerMove}
      onPointerUp={swipeHandlers.onPointerUp}
      onPointerCancel={swipeHandlers.onPointerCancel}
      onFocus={handleRootFocus}
      onBlur={() => keyboardNavigation && setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={keyboardNavigation ? 0 : undefined}
      role="region"
      aria-roledescription="carousel"
      aria-label={t('gallery', { title: alt })}
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
            alt={imageAlt}
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
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              manualPrev()
            }}
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 z-10',
              arrowSizeClasses[arrowSize],
              'rounded-full bg-black/50',
              'flex items-center justify-center',
              'text-white/80 hover:text-white hover:bg-black/70',
              ARROW_VISIBILITY_CLASSES,
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
            )}
            aria-label={t('previous')}
          >
            <ChevronLeftIcon className={arrowIconClasses[arrowSize]} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              manualNext()
            }}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 z-10',
              arrowSizeClasses[arrowSize],
              'rounded-full bg-black/50',
              'flex items-center justify-center',
              'text-white/80 hover:text-white hover:bg-black/70',
              ARROW_VISIBILITY_CLASSES,
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
            )}
            aria-label={t('next')}
          >
            <ChevronRightIcon className={arrowIconClasses[arrowSize]} />
          </button>
        </>
      )}

      {/* Navigation dots - bottom center */}
      {hasMultipleImages && showDots && (
        <CarouselDots
          total={totalImages}
          current={currentIndex}
          onSelect={manualGoTo}
          onLight={controlsOnLight}
          className={cn(
            'absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full px-1 py-0.5 transition-colors duration-300',
            controlsOnLight && 'bg-white/18 backdrop-blur-[2px]'
          )}
        />
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
            className="fixed inset-0 z-[1000] flex items-center justify-center overscroll-contain bg-black/72 p-3 backdrop-blur-xl sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-label={t('expandedGallery', { title: alt })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            onClick={(event) => {
              // The portal bubbles React events to the parent card; a backdrop tap must only close.
              event.stopPropagation()
              closeLightbox()
            }}
          >
          <motion.div
            ref={lightboxPanelRef}
            className="relative flex w-full max-w-[min(92vw,82rem)] flex-col gap-3 pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14, scale: prefersReducedMotion ? 1 : 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 10, scale: prefersReducedMotion ? 1 : 0.985 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
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
                  ref={lightboxCloseRef}
                  type="button"
                  onClick={closeLightbox}
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/18 bg-black/55 text-white/82 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  aria-label={t('close')}
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <div
                className="relative touch-none select-none overflow-hidden rounded-2xl border border-white/14 bg-black/78 shadow-2xl shadow-black/60"
                onPointerDown={lightboxSwipeHandlers.onPointerDown}
                onPointerMove={lightboxSwipeHandlers.onPointerMove}
                onPointerUp={lightboxSwipeHandlers.onPointerUp}
                onPointerCancel={lightboxSwipeHandlers.onPointerCancel}
              >
                {/* max-lg (not max-md): phones in landscape are 667-932px wide, iPad landscape starts at 1024 */}
                <div className="relative h-[min(70dvh,46rem)] w-full landscape:max-lg:h-[min(62dvh,46rem)]">
                  <Image
                    src={currentImage}
                    alt={imageAlt}
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
                        manualPrev()
                      }}
                      className="absolute left-3 top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/58 text-white/82 transition-colors hover:bg-white/10 hover:text-white sm:left-4"
                      aria-label={t('previous')}
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        manualNext()
                      }}
                      className="absolute right-3 top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/58 text-white/82 transition-colors hover:bg-white/10 hover:text-white sm:right-4"
                      aria-label={t('next')}
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>

                  <CarouselDots
                    total={totalImages}
                    current={currentIndex}
                    onSelect={manualGoTo}
                    className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/12 bg-black/58 px-2 py-1 backdrop-blur-sm"
                  />

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
