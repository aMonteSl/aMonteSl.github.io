'use client'

import { useState } from 'react'

export interface AvatarProps {
  size?: 'sm' | 'lg'
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
  const config = {
    sm: {
      baseName: 'avatar-40',
      width: 40,
      height: 40,
      containerClasses: 'w-10 h-10 md:w-11 md:h-11',
      textSize: 'text-sm md:text-base'
    },
    lg: {
      baseName: 'hero-196',
      width: 196,
      height: 196,
      containerClasses: 'w-40 h-40 md:w-49 md:h-49',
      textSize: 'text-4xl md:text-5xl'
    }
  }

  const { baseName, width, height, containerClasses, textSize } = config[size]
  const baseClasses = `${containerClasses} rounded-full ring-2 ring-[#DCA293] shadow-sm overflow-hidden ${className}`

  if (imageError) {
    return (
      <div
        className={`${baseClasses} bg-gradient-to-br from-[#DCA293] to-[#c8956b] flex items-center justify-center ${textSize} font-bold text-white`}
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
