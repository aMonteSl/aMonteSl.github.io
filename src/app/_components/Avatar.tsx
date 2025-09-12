'use client'

import { useState } from 'react'

interface AvatarProps {
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
  alt = "Portrait of Adrián Montes"
}: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  
  // Image configuration based on size
  const config = {
    sm: {
      // Avatar variants (header): 40px (1x) and 80px (2x)
      baseName: 'avatar-40',
      width: 40,
      height: 40,
      containerClasses: 'w-10 h-10 md:w-11 md:h-11',
      textSize: 'text-sm md:text-base'
    },
    lg: {
      // Hero variants (main photo): 196px (1x) and 392px (2x)
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
    // Placeholder with initials if image fails to load
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
        {/* AVIF sources (best compression) */}
        <source 
          type="image/avif" 
          srcSet={`/images/profile/${baseName}.avif 1x, /images/profile/${baseName}@2x.avif 2x`}
        />
        
        {/* WebP sources (modern fallback) */}
        <source 
          type="image/webp" 
          srcSet={`/images/profile/${baseName}.webp 1x, /images/profile/${baseName}@2x.webp 2x`}
        />
        
        {/* JPEG fallback with srcSet for retina */}
        <img
          src={`/images/profile/${baseName}.jpg`}
          srcSet={`/images/profile/${baseName}.jpg 1x, /images/profile/${baseName}@2x.jpg 2x`}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </picture>
    </div>
  )
}
