'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface GlowState {
  /** Get the glow intensity for a specific entry (0-1) */
  getIntensity: (id: string) => number
}

/**
 * useGlowAnimation
 * Creates smooth crossfading glow effects on journey entries
 * One fades out while another fades in for organic feel
 */
export function useGlowAnimation(
  entryIds: string[],
  options: {
    /** Duration of fade in/out (ms) */
    fadeDuration?: number
    /** How long an entry stays fully lit (ms) */
    holdDuration?: number
    /** Whether animation is enabled */
    enabled?: boolean
  } = {}
): GlowState {
  const {
    fadeDuration = 1500,
    holdDuration = 2000,
    enabled = true,
  } = options

  const [intensities, setIntensities] = useState<Map<string, number>>(new Map())
  const animationFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const currentIndexRef = useRef<number>(0)
  const phaseRef = useRef<'fadeIn' | 'hold' | 'fadeOut'>('fadeIn')
  const phaseStartRef = useRef<number>(0)

  const updateGlow = useCallback((timestamp: number) => {
    if (!enabled || entryIds.length === 0) {
      animationFrameRef.current = requestAnimationFrame(updateGlow)
      return
    }

    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp
      phaseStartRef.current = timestamp
    }

    const currentId = entryIds[currentIndexRef.current]
    const nextIndex = (currentIndexRef.current + 1) % entryIds.length
    const nextId = entryIds[nextIndex]
    const elapsed = timestamp - phaseStartRef.current

    setIntensities(prev => {
      const next = new Map(prev)
      
      if (phaseRef.current === 'fadeIn') {
        // Current entry fades in
        const progress = Math.min(elapsed / fadeDuration, 1)
        const eased = easeInOutCubic(progress)
        next.set(currentId, eased)
        
        if (progress >= 1) {
          phaseRef.current = 'hold'
          phaseStartRef.current = timestamp
        }
      } else if (phaseRef.current === 'hold') {
        // Stay fully lit
        next.set(currentId, 1)
        
        if (elapsed >= holdDuration) {
          phaseRef.current = 'fadeOut'
          phaseStartRef.current = timestamp
        }
      } else if (phaseRef.current === 'fadeOut') {
        // Current fades out while next fades in
        const progress = Math.min(elapsed / fadeDuration, 1)
        const eased = easeInOutCubic(progress)
        
        next.set(currentId, 1 - eased)
        next.set(nextId, eased)
        
        if (progress >= 1) {
          next.delete(currentId)
          currentIndexRef.current = nextIndex
          phaseRef.current = 'hold'
          phaseStartRef.current = timestamp
        }
      }
      
      return next
    })

    animationFrameRef.current = requestAnimationFrame(updateGlow)
  }, [enabled, entryIds, fadeDuration, holdDuration])

  useEffect(() => {
    if (enabled && entryIds.length > 0) {
      // Reset state
      lastTimeRef.current = 0
      currentIndexRef.current = Math.floor(Math.random() * entryIds.length)
      phaseRef.current = 'fadeIn'
      
      animationFrameRef.current = requestAnimationFrame(updateGlow)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [enabled, entryIds, updateGlow])

  const getIntensity = useCallback(
    (id: string) => intensities.get(id) ?? 0,
    [intensities]
  )

  return { getIntensity }
}

/** Cubic easing for smooth transitions */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
