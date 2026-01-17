'use client'

import { useState } from 'react'

export interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero'
  className?: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
  alt?: string
}

export function Avatar({
  size = 'sm',
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto',
  alt = 'Portrait of Adrián Montes'
}: AvatarProps) {
  const [imageError, setImageError] = useState(false)

  // Image configuration based on size
  // Responsive sizes for hero: mobile 7rem, sm 8rem, md 10rem, lg 12rem, xl 14rem, 2xl 15rem
  const config = {
    sm: {
      baseName: 'avatar-40',
      width: 40,
      height: 40,
      containerClasses: 'w-10 h-10',
      textSize: 'text-sm'
    },
    md: {
      baseName: 'avatar-40',
      width: 40,
      height: 40,
      containerClasses: 'w-12 h-12',
      textSize: 'text-base'
    },
    lg: {
      baseName: 'hero-196',
      width: 196,
      height: 196,
      containerClasses: 'w-32 h-32 md:w-40 md:h-40',
      textSize: 'text-3xl md:text-4xl'
    },
    xl: {
      baseName: 'hero-256',
      width: 256,
      height: 256,
      containerClasses: 'w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56',
      textSize: 'text-4xl md:text-5xl'
    },
    hero: {
      baseName: 'hero-320',
      width: 320,
      height: 320,
      // Responsive: mobile 7rem, sm 8rem, md 10rem, lg 12rem, xl 14rem, 2xl 15rem (capped)
      containerClasses: 'w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 2xl:w-60 2xl:h-60',
      textSize: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
    }
  }

  const { baseName, width, height, containerClasses, textSize } = config[size]
  const baseClasses = `${containerClasses} rounded-full ring-2 ring-[var(--accent)]/40 shadow-sm overflow-hidden ${className}`

  if (imageError) {
    return (
      <div
        className={`${baseClasses} bg-gradient-to-br from-[var(--accent)] to-[#c8956b] flex items-center justify-center ${textSize} font-bold text-white`}
        aria-label="Profile placeholder - Adrián Montes"
      >
        AM
      </div>
    )
  }

  return (
    <div className={baseClasses}>
      <picture>
        <source
          type="image/avif"
          srcSet={`/images/profile/${baseName}.avif 1x, /images/profile/${baseName}@2x.avif 2x`}
        />
        <source
          type="image/webp"
          srcSet={`/images/profile/${baseName}.webp 1x, /images/profile/${baseName}@2x.webp 2x`}
        />
        <img
          src={`/images/profile/${baseName}.jpg`}
          srcSet={`/images/profile/${baseName}.jpg 1x, /images/profile/${baseName}@2x.jpg 2x`}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
          decoding="async"
        />
      </picture>
    </div>
  )
}
