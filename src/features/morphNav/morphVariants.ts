// Framer Motion variants for the morph navigation system

import { EASING, EASING_OUT } from '@/lib/motion'

/**
 * Header variants - fades up and out as progress increases
 */
export const headerVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: EASING_OUT,
    },
  },
  hidden: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.25,
      ease: EASING,
    },
  },
}

/**
 * Sidebar variants - slides in from left as progress increases
 */
export const sidebarVariants = {
  hidden: {
    opacity: 0,
    x: -40,
    transition: {
      duration: 0.25,
      ease: EASING,
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: EASING_OUT,
    },
  },
}

/**
 * Sidebar item variants for staggered entrance
 */
export const sidebarItemVariants = {
  hidden: {
    opacity: 0,
    x: -16,
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.25,
      ease: EASING_OUT,
    },
  }),
}

/**
 * Mobile floating button variants
 */
export const floatingButtonVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: EASING,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: EASING_OUT,
    },
  },
}

/**
 * Mobile drawer variants
 */
export const drawerVariants = {
  closed: {
    x: '-100%',
    transition: {
      duration: 0.3,
      ease: EASING,
    },
  },
  open: {
    x: 0,
    transition: {
      duration: 0.35,
      ease: EASING_OUT,
    },
  },
}

/**
 * Backdrop overlay for mobile drawer
 */
export const backdropVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.25,
    },
  },
}
