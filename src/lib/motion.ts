// Animation utilities for Framer Motion
// Consistent easing and timing across the app

// Easing curves
export const EASING = [0.22, 1, 0.36, 1] as const
export const EASING_OUT = [0.16, 1, 0.3, 1] as const

// Duration tokens
export const DURATION = {
  fast: 0.18,
  base: 0.24,
  slow: 0.32,
  /** Scroll-in entrances: long enough to read as a glide, short enough to never block reading */
  enter: 0.55,
} as const

// Common animation variants
// Reduced motion is handled globally by <MotionConfig reducedMotion="user"> (LocalizedShell),
// so these props are always passed and the server and client render the same markup.
export const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: DURATION.enter, ease: EASING_OUT, delay },
  viewport: { once: true, margin: '0px 0px -8% 0px' }
})

// Respect reduced motion preference
export const shouldAnimate = (): boolean => {
  if (typeof window === 'undefined') return true
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
