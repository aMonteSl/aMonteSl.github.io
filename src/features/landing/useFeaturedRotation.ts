'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useMotionValue } from 'framer-motion'
import { CAROUSEL_ROTATION_INTERVAL_MS } from '@/lib/timing'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'

const ROTATION_INTERVAL_MS = CAROUSEL_ROTATION_INTERVAL_MS

/**
 * Why a transient pause was requested:
 * - `interaction`: pointer hover or keyboard focus inside the card. Shown as paused (bar turns warning).
 * - `offscreen`: the card is scrolled out of view. Silent: the clock just waits, the bar keeps its colour.
 */
export type RotationPauseSource = 'interaction' | 'offscreen'

export function useFeaturedRotation<T>(items: readonly T[]) {
  const total = items.length
  const [activeIndex, setActiveIndex] = useState(0)
  // Interaction/off-screen/tab-visibility pauses are transient; the user toggle sticks until pressed again.
  const [isInteractionPaused, setIsInteractionPaused] = useState(false)
  const [isUserPaused, setIsUserPaused] = useState(false)
  const [isOffscreen, setIsOffscreen] = useState(false)
  const [isTabHidden, setIsTabHidden] = useState(false)
  // Reactive: the rotation stops (and restarts) as soon as the OS setting changes.
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  // The bar's 0-1 progress lives in a motion value so it animates without re-rendering the Hero every frame.
  const progress = useMotionValue(0)
  const elapsedRef = useRef(0)
  const startTimeRef = useRef(0)

  const isPaused = isInteractionPaused || isUserPaused
  const isRunning = !isPaused && !isOffscreen && !isTabHidden && !prefersReducedMotion && total > 1

  const goToIndex = useCallback(
    (index: number) => {
      elapsedRef.current = 0
      startTimeRef.current = performance.now()
      progress.set(0)
      setActiveIndex(index)
    },
    [progress]
  )

  const pause = useCallback((source: RotationPauseSource = 'interaction') => {
    if (source === 'offscreen') setIsOffscreen(true)
    else setIsInteractionPaused(true)
  }, [])

  const resume = useCallback((source: RotationPauseSource = 'interaction') => {
    if (source === 'offscreen') setIsOffscreen(false)
    else setIsInteractionPaused(false)
  }, [])

  const togglePause = useCallback(() => {
    if (isUserPaused) {
      // Resuming must always resume: drop any transient pause that may be lingering (focus left inside the card,
      // a synthesized mouseenter on touch) instead of leaving the bar paused and frozen until the user taps elsewhere.
      setIsInteractionPaused(false)
      setIsUserPaused(false)
      return
    }
    setIsUserPaused(true)
  }, [isUserPaused])

  // Autoplay and progress share one clock so the bar matches the rotation. Only the slide change touches React state.
  useEffect(() => {
    if (!isRunning) return

    let rafId = 0
    startTimeRef.current = performance.now() - elapsedRef.current

    const tick = (time: number) => {
      const elapsed = Math.max(0, time - startTimeRef.current)

      if (elapsed >= ROTATION_INTERVAL_MS) {
        elapsedRef.current = 0
        startTimeRef.current = time
        progress.set(0)
        setActiveIndex((prev) => (prev + 1) % total)
      } else {
        elapsedRef.current = elapsed
        progress.set(elapsed / ROTATION_INTERVAL_MS)
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isRunning, total, progress])

  // Without autoplay the bar has nothing to count down.
  useEffect(() => {
    if (prefersReducedMotion || total <= 1) {
      elapsedRef.current = 0
      progress.set(0)
    }
  }, [prefersReducedMotion, total, progress])

  // Hold the clock while the tab is hidden so returning to it does not skip a slide.
  useEffect(() => {
    const handleVisibilityChange = () => setIsTabHidden(document.hidden)

    handleVisibilityChange()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

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
    total,
  }
}
