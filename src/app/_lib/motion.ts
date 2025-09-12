// Animation utilities for framer-motion
// Consistent easing and timing across the app

// Easing curves
export const EASING = [0.22, 1, 0.36, 1] as const; // smooth
export const EASING_OUT = [0.16, 1, 0.3, 1] as const; // bounce out

// Duration tokens  
export const DURATION = {
  fast: 0.18,
  base: 0.24,
  slow: 0.32,
} as const

// Common animation variants
export const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: DURATION.base, ease: EASING, delay },
  viewport: { once: true, margin: "0px 0px -10% 0px" }
})

export const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { duration: DURATION.base, ease: EASING, delay },
  viewport: { once: true, margin: "0px 0px -10% 0px" }
})

// Hover interactions
export const hoverLift = {
  whileHover: { 
    y: -2, 
    transition: { duration: DURATION.fast, ease: EASING_OUT } 
  },
  whileTap: { 
    scale: 0.98, 
    transition: { duration: DURATION.fast, ease: EASING } 
  }
}

export const hoverScale = {
  whileHover: { 
    scale: 1.03, 
    transition: { duration: DURATION.fast, ease: EASING_OUT } 
  },
  whileTap: { 
    scale: 0.98, 
    transition: { duration: DURATION.fast, ease: EASING } 
  }
}

export const hoverRotate = (degrees = 2) => ({
  whileHover: { 
    rotateZ: degrees, 
    y: -1,
    transition: { duration: DURATION.fast, ease: EASING_OUT } 
  }
})

// Avatar specific animations
export const avatarHover = {
  whileHover: { 
    y: -2, 
    scale: 1.02, 
    rotateZ: -0.5,
    transition: { duration: DURATION.base, ease: EASING }
  },
  whileFocus: { 
    y: -2, 
    scale: 1.02, 
    rotateZ: -0.5,
    transition: { duration: DURATION.base, ease: EASING }
  }
}

// Respect reduced motion preference
export const shouldAnimate = () => {
  if (typeof window === 'undefined') return true
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
