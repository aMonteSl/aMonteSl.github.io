'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useImageRotation } from '../hooks/useImageRotation'
import { cn } from '@/lib/utils'

interface RotatingThumbnailProps {
  /** Array of image paths to rotate through */
  images: string[]
  /** Alt text for the images */
  alt: string
  /** Rotation interval in ms. Default: 3500 */
  interval?: number
  /** Additional CSS classes for container */
  className?: string
  /** Whether to show navigation dots. Default: true */
  showDots?: boolean
  /** Whether to pause on hover. Default: true */
  pauseOnHover?: boolean
}

/**
 * Rotating thumbnail component with crossfade animation
 * Displays multiple images in rotation with optional dots indicator
 */
export function RotatingThumbnail({
  images,
  alt,
  interval = 3500,
  className,
  showDots = true,
  pauseOnHover = true,
}: RotatingThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const { currentImage, currentIndex, totalImages, goTo } = useImageRotation({
    images,
    interval,
    paused: pauseOnHover && isHovered,
  })
  
  return (
    <div
      className={cn(
        'relative aspect-video overflow-hidden bg-gradient-to-br from-[var(--accent)]/10 to-[var(--card)]',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image crossfade container */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage}
          src={currentImage}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onError={(e) => {
            // Fallback to placeholder on error
            const target = e.target as HTMLImageElement
            target.src = '/projects/placeholder.svg'
          }}
        />
      </AnimatePresence>
      
      {/* Gradient overlay for better text readability if needed */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      
      {/* Navigation dots */}
      {showDots && totalImages > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {Array.from({ length: totalImages }).map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                goTo(idx)
              }}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-300',
                idx === currentIndex
                  ? 'bg-white w-4'
                  : 'bg-white/50 hover:bg-white/75'
              )}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
