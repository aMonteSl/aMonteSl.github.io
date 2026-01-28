'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'

interface UseImageRotationOptions {
  /** Array of image paths to rotate through */
  images: string[]
  /** Interval in milliseconds between rotations. Default: 5000 */
  interval?: number
  /** Whether rotation is paused (e.g., on hover). Default: false */
  paused?: boolean
  /** Whether the element is visible in the viewport. Default: true */
  isVisible?: boolean
  /** Whether to respect reduced motion preference. Default: true */
  respectReducedMotion?: boolean
}

interface UseImageRotationReturn {
  /** Currently displayed image path */
  currentImage: string
  /** Index of current image */
  currentIndex: number
  /** Total number of images */
  totalImages: number
  /** Manually go to next image */
  next: () => void
  /** Manually go to previous image */
  prev: () => void
  /** Jump to specific index */
  goTo: (index: number) => void
  /** Progress 0-1 representing time until next auto-switch */
  progress: number
  /** Whether autoplay is active (multiple images and not paused) */
  isAutoPlaying: boolean
  /** Reset to first image */
  reset: () => void
  /** Whether user prefers reduced motion */
  prefersReducedMotion: boolean
}

/**
 * Hook for rotating through an array of images with automatic transitions
 * Includes smooth progress animation using requestAnimationFrame
 */
export function useImageRotation({
  images,
  interval = 5000,
  paused = false,
  isVisible = true,
  respectReducedMotion = true,
}: UseImageRotationOptions): UseImageRotationReturn {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const startTimeRef = useRef<number>(0)
  const rafIdRef = useRef<number>(0)
  const accumulatedRef = useRef<number>(0)
  
  // Ensure we have at least one image (placeholder fallback)
  const safeImages = images.length > 0 ? images : [PLACEHOLDER_IMAGE]
  
  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined' || !respectReducedMotion) return
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [respectReducedMotion])
  
  const resetProgress = useCallback(() => {
    setProgress(0)
    accumulatedRef.current = 0
    startTimeRef.current = performance.now()
  }, [])
  
  const reset = useCallback(() => {
    setCurrentIndex(0)
    resetProgress()
  }, [resetProgress])
  
  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % safeImages.length)
    resetProgress()
  }, [safeImages.length, resetProgress])
  
  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
    resetProgress()
  }, [safeImages.length, resetProgress])
  
  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < safeImages.length) {
      setCurrentIndex(index)
      resetProgress()
    }
  }, [safeImages.length, resetProgress])
  
  // Determine if autoplay should be active
  const isAutoPlaying = !paused && isVisible && safeImages.length > 1 && !prefersReducedMotion
  
  // Reset to first image when becoming invisible
  useEffect(() => {
    if (!isVisible) {
      reset()
    }
  }, [isVisible, reset])
  
  // Smooth progress animation using requestAnimationFrame
  useEffect(() => {
    if (safeImages.length <= 1) {
      setProgress(0)
      return
    }
    
    if (!isAutoPlaying) {
      // Cancel any running animation when paused
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      return
    }
    
    // Reset start time when resuming
    startTimeRef.current = performance.now() - accumulatedRef.current
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current
      accumulatedRef.current = elapsed
      const newProgress = Math.min(elapsed / interval, 1)
      setProgress(newProgress)
      
      if (elapsed >= interval) {
        setCurrentIndex((prev) => (prev + 1) % safeImages.length)
        startTimeRef.current = currentTime
        accumulatedRef.current = 0
        setProgress(0)
      }
      
      rafIdRef.current = requestAnimationFrame(animate)
    }
    
    rafIdRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [isAutoPlaying, interval, safeImages.length])
  
  return {
    currentImage: safeImages[currentIndex],
    currentIndex,
    totalImages: safeImages.length,
    next,
    prev,
    goTo,
    progress,
    isAutoPlaying,
    reset,
    prefersReducedMotion,
  }
}
