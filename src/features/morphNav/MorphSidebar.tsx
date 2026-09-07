'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useMorphNav } from '@/features/morphNav/MorphNavProvider'
import { SIDEBAR_WIDTH_CLASS } from '@/features/morphNav/layout'
import { SidebarPanel } from '@/features/morphNav/SidebarPanel'
import { MorphDrawer } from '@/features/morphNav/MorphDrawer'
import { cn } from '@/lib/utils'

/**
 * The morphing sidebar that appears as user scrolls past the hero (from `xl`).
 * Below `xl` the same content lives in the drawer rendered by `MorphDrawer`.
 */
export function MorphSidebar() {
  const { isMorphed, prefersReducedMotion } = useMorphNav()

  // Use Framer Motion's useScroll for smooth scroll-based animations
  const { scrollY, scrollYProgress } = useScroll()

  // Transform scroll position to sidebar reveal values
  // Sidebar starts appearing at 120px and is fully visible at 520px
  const sidebarOpacity = useTransform(scrollY, [120, 520], [0, 1])
  const sidebarX = useTransform(scrollY, [120, 520], [-24, 0])
  const pageProgressScale = useTransform(scrollYProgress, [0, 1], [0.02, 1])

  return (
    <>
      {/* Desktop sidebar - uses scroll-based transforms for smooth reveal */}
      <motion.aside
        style={{
          opacity: prefersReducedMotion ? (isMorphed ? 1 : 0) : sidebarOpacity,
          x: prefersReducedMotion ? 0 : sidebarX,
          pointerEvents: isMorphed ? 'auto' : 'none',
        }}
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden flex-col xl:flex',
          SIDEBAR_WIDTH_CLASS,
          'border-r border-[var(--border)]/70 bg-[var(--bg)]/92 backdrop-blur-xl',
          'pt-16'
        )}
        aria-hidden={!isMorphed}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-[-1px] top-0 w-px bg-[var(--border)]/35"
        >
          <motion.div
            className="h-full w-px origin-top bg-[var(--accent)] shadow-[0_0_18px_rgba(220,162,147,0.45)]"
            style={{ scaleY: prefersReducedMotion ? 1 : pageProgressScale }}
          />
        </div>
        <SidebarPanel />
      </motion.aside>

      {/* Floating button + drawer below xl */}
      <MorphDrawer />
    </>
  )
}
