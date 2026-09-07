'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { CAROUSEL_ROTATION_INTERVAL_MS } from '@/lib/timing'

const ROTATION_INTERVAL_MS = CAROUSEL_ROTATION_INTERVAL_MS

export function useFeaturedRotation<T>(items: readonly T[]) {
  const [activeIndex, setActiveIndex] = useState(0)
  // Hover/focus/tab-visibility pauses are transient; the user toggle sticks until pressed again.
  const [isHoverPaused, setIsHoverPaused] = useState(false)
  const [isUserPaused, setIsUserPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const elapsedRef = useRef(0)
  const startTimeRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)
  const isPaused = isHoverPaused || isUserPaused

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const resetClock = useCallback((time = performance.now()) => {
    elapsedRef.current = 0
    startTimeRef.current = time
    setProgress(0)
  }, [])

  const goToIndex = useCallback((index: number) => {
    resetClock()
    setActiveIndex(index)
  }, [resetClock])

  const pause = useCallback(() => {
    setIsHoverPaused(true)
  }, [])

  const resume = useCallback(() => {
    setIsHoverPaused(false)
  }, [])

  const togglePause = useCallback(() => {
    if (isUserPaused) {
      // Resuming must always resume: drop any transient pause that may be lingering (focus left inside the card,
      // a synthesized mouseenter on touch) instead of leaving the bar red and frozen until the user taps elsewhere.
      setIsHoverPaused(false)
      setIsUserPaused(false)
      return
    }
    setIsUserPaused(true)
  }, [isUserPaused])

  // Handle autoplay and progress from the same clock so the bar matches rotation.
  useEffect(() => {
    if (prefersReducedMotion || items.length <= 1) {
      setProgress(0)
      return
    }

    if (isPaused) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      return
    }

    startTimeRef.current = performance.now() - elapsedRef.current

    const animate = (time: number) => {
      const elapsed = time - startTimeRef.current
      elapsedRef.current = elapsed

      if (elapsed >= ROTATION_INTERVAL_MS) {
        resetClock(time)
        setActiveIndex((prev) => (prev + 1) % items.length)
        setProgress(0)
        rafIdRef.current = requestAnimationFrame(animate)
        return
      }

      setProgress(elapsed / ROTATION_INTERVAL_MS)
      rafIdRef.current = requestAnimationFrame(animate)
    }

    rafIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [isPaused, items.length, prefersReducedMotion, resetClock])

  // Handle visibility change - pause when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pause()
      } else {
        resume()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pause, resume])

  return {
    activeIndex,
    activeItem: items[activeIndex],
    goToIndex,
    pause,
    resume,
    togglePause,
    isPaused,
    isUserPaused,
    progress,
    intervalMs: ROTATION_INTERVAL_MS,
    total: items.length,
  }
}
