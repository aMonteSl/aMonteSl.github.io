'use client'

import { useEffect, useState, ComponentType } from 'react'
import dynamic from 'next/dynamic'

interface SilkProps {
  speed?: number
  scale?: number
  color?: string
  noiseIntensity?: number
  rotation?: number
}

// Dynamic import of Silk component with SSR disabled
const Silk = dynamic<SilkProps>(
  () => import('./Silk').then((mod) => mod.default as ComponentType<SilkProps>),
  {
    ssr: false,
    loading: () => null
  }
)

/**
 * Detects if WebGL is available in the current browser
 */
const isWebGLAvailable = (): boolean => {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

/**
 * Detects if user prefers reduced motion
 */
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Static fallback background with subtle gradient
 */
const StaticBackground = () => (
  <div
    className="fixed inset-0 -z-10 pointer-events-none"
    aria-hidden="true"
    style={{
      background: `
        radial-gradient(circle at 20% 30%, rgba(220, 162, 147, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(210, 182, 161, 0.02) 0%, transparent 50%),
        var(--bg)
      `,
    }}
  />
)

/**
 * AnimatedBackground - Adaptive background component
 *
 * Renders either:
 * - Animated WebGL silk effect if WebGL is available and user doesn't prefer reduced motion
 * - Static gradient fallback otherwise
 */
export function AnimatedBackground() {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const webglSupported = isWebGLAvailable()
    const reducedMotion = prefersReducedMotion()

    setShouldAnimate(webglSupported && !reducedMotion)
  }, [])

  if (!isClient || !shouldAnimate) {
    return <StaticBackground />
  }

  return (
    <Silk
      speed={4}
      scale={1}
      color="#DCA293"
      noiseIntensity={1.25}
      rotation={0}
    />
  )
}
