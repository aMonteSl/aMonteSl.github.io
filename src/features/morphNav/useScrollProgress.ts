'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface ScrollProgressOptions {
  /** Scroll position where morph starts (px) */
  start?: number
  /** Scroll position where morph completes (px) */
  end?: number
}

interface ScrollProgressResult {
  /** Normalized progress from 0 to 1 */
  progress: number
  /** Raw scroll position */
  scrollY: number
  /** Whether morph has started (progress > 0) */
  isMorphing: boolean
  /** Whether morph is complete (progress >= 1) */
  isMorphed: boolean
  /** User prefers reduced motion */
  prefersReducedMotion: boolean
}

/**
 * Hook to compute normalized scroll progress for the morph transition.
 * 
 * @param options - Scroll thresholds for the morph
 * @returns Scroll progress state
 * 
 * @example
 * ```tsx
 * const { progress, isMorphed } = useScrollProgress({ start: 100, end: 400 })
 * // progress = 0 at scrollY <= 100
 * // progress = 0.5 at scrollY = 250
 * // progress = 1 at scrollY >= 400
 * ```
 */
export function useScrollProgress(options: ScrollProgressOptions = {}): ScrollProgressResult {
  const { start = 100, end = 400 } = options
  const prefersReducedMotion = useReducedMotion() ?? false

  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    // Get initial scroll position
    setScrollY(window.scrollY)

    const handleScroll = () => {
      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(() => {
        setScrollY(window.scrollY)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate normalized progress (0 to 1)
  const range = end - start
  const rawProgress = range > 0 ? (scrollY - start) / range : 0
  const progress = Math.max(0, Math.min(1, rawProgress))

  // For reduced motion: snap to 0 or 1 based on threshold
  const effectiveProgress = prefersReducedMotion
    ? progress >= 0.5 ? 1 : 0
    : progress

  return {
    progress: effectiveProgress,
    scrollY,
    isMorphing: effectiveProgress > 0 && effectiveProgress < 1,
    isMorphed: effectiveProgress >= 1,
    prefersReducedMotion,
  }
}
