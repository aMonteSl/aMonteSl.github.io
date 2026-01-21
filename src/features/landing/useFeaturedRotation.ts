'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const ROTATION_INTERVAL_MS = 12000 // 12 seconds

export function useFeaturedRotation<T>(items: readonly T[]) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const nextItem = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const goToIndex = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const pause = useCallback(() => {
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    setIsPaused(false)
  }, [])

  // Handle autoplay
  useEffect(() => {
    // Don't autoplay if reduced motion is preferred or only one item
    if (prefersReducedMotion || items.length <= 1) {
      return
    }

    if (!isPaused) {
      intervalRef.current = setInterval(nextItem, ROTATION_INTERVAL_MS)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPaused, nextItem, prefersReducedMotion, items.length])

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
    total: items.length,
  }
}
