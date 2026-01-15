'use client'

import { motion } from 'framer-motion'
import { shouldAnimate, fadeInUp } from '@/lib/motion'

export interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  className = '',
}: SectionHeadingProps) {
  const animate = shouldAnimate()

  return (
    <div className={`mb-10 sm:mb-12 lg:mb-16 ${centered ? 'text-center' : ''} ${className}`}>
      <motion.h2
        {...(animate ? fadeInUp(0) : {})}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--fg)] mb-3 sm:mb-4"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          {...(animate ? fadeInUp(0.05) : {})}
          className="text-sm sm:text-base md:text-lg text-[var(--fg-muted)] max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
