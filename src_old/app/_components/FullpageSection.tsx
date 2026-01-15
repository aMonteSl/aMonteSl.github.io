'use client'

import { motion } from 'framer-motion'
import { PropsWithChildren, useEffect, useState } from 'react'

interface FullpageSectionProps {
  id: string
}

export default function FullpageSection({ 
  id, 
  children 
}: PropsWithChildren<FullpageSectionProps>) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const animationVariants = prefersReducedMotion 
    ? {
        initial: { opacity: 1, y: 0 },
        whileInView: { opacity: 1, y: 0 }
      }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 }
      }

  return (
    <section id={id} data-snap className="relative">
      <motion.div
        initial={animationVariants.initial}
        whileInView={animationVariants.whileInView}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ 
          duration: prefersReducedMotion ? 0 : 0.28, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="h-full"
      >
        {children}
      </motion.div>
    </section>
  )
}
