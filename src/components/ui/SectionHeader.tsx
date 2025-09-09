import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  className?: string
  centered?: boolean
}

export function SectionHeader({ 
  title, 
  subtitle, 
  description, 
  className,
  centered = false 
}: SectionHeaderProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div 
      className={cn(
        'space-y-4 relative',
        centered && 'text-center',
        className
      )}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
    >
      {/* Gradient accent line */}
      <div className="w-16 h-0.5 bg-gradient-to-r from-accent via-accent-3 to-accent-2 mx-auto mb-6" />
      
      {subtitle && (
        <p className="text-accent font-medium text-sm uppercase tracking-wider">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink">
        <span className="bg-gradient-to-r from-ink via-accent-3 to-accent bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      {description && (
        <p className="text-muted text-lg leading-relaxed max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  )
}
