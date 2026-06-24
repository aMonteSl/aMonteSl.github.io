'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { CAROUSEL_ROTATION_INTERVAL_MS } from '@/lib/timing'

const ROTATION_INTERVAL_MS = CAROUSEL_ROTATION_INTERVAL_MS

export function useFeaturedRotation<T>(items: readonly T[]) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const elapsedRef = useRef(0)
  const startTimeRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const nextItem = useCallback(() => {
    elapsedRef.current = 0
    startTimeRef.current = performance.now()
    setProgress(0)
    setActiveIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const goToIndex = useCallback((index: number) => {
    elapsedRef.current = 0
    startTimeRef.current = performance.now()
    setProgress(0)
    setActiveIndex(index)
  }, [])

  const pause = useCallback(() => {
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    setIsPaused(false)
  }, [])

  // Handle autoplay and progress from the same clock so the bar matches rotation.
  useEffect(() => {
    if (prefersReducedMotion || items.length <= 1) {
      setProgress(0)
      return
    }

    if (isPaused) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      return
    }

    startTimeRef.current = performance.now() - elapsedRef.current

    const animate = (time: number) => {
      const elapsed = time - startTimeRef.current
      elapsedRef.current = elapsed

      if (elapsed >= ROTATION_INTERVAL_MS) {
        nextItem()
        return
      }

      setProgress(elapsed / ROTATION_INTERVAL_MS)
      rafIdRef.current = requestAnimationFrame(animate)
    }

    rafIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [isPaused, items.length, nextItem, prefersReducedMotion])

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
    isPaused,
    progress,
    intervalMs: ROTATION_INTERVAL_MS,
    total: items.length,
  }
}
