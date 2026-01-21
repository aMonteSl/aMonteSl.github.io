'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseImageRotationOptions {
  /** Array of image paths to rotate through */
  images: string[]
  /** Interval in milliseconds between rotations. Default: 3000 */
  interval?: number
  /** Whether rotation is paused (e.g., on hover). Default: false */
  paused?: boolean
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
}

/**
 * Hook for rotating through an array of images with automatic transitions
 */
export function useImageRotation({
  images,
  interval = 3000,
  paused = false,
}: UseImageRotationOptions): UseImageRotationReturn {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Ensure we have at least one image
  const safeImages = images.length > 0 ? images : ['/projects/placeholder.svg']
  
  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % safeImages.length)
  }, [safeImages.length])
  
  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
  }, [safeImages.length])
  
  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < safeImages.length) {
      setCurrentIndex(index)
    }
  }, [safeImages.length])
  
  // Auto-rotate when not paused and more than one image
  useEffect(() => {
    if (paused || safeImages.length <= 1) return
    
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [paused, interval, next, safeImages.length])
  
  return {
    currentImage: safeImages[currentIndex],
    currentIndex,
    totalImages: safeImages.length,
    next,
    prev,
    goTo,
  }
}
