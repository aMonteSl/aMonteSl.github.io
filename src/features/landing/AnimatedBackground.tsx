'use client'

import { useEffect, useState, ComponentType } from 'react'
import dynamic from 'next/dynamic'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'

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
 * Detects if WebGL is available in the current browser.
 * The probe context is released straight away so it does not count against the browser's context limit.
 */
const isWebGLAvailable = (): boolean => {
  try {
    if (!window.WebGLRenderingContext) return false
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')
    if (!(gl instanceof WebGLRenderingContext)) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

/**
 * Static fallback: two faint tints over the body's own gradient (see globals.css `body`).
 * It must stay transparent, otherwise it hides that gradient and the page visibly changes once Silk mounts.
 */
const StaticBackground = () => (
  <div
    className="pointer-events-none fixed inset-0 -z-10"
    aria-hidden="true"
    style={{
      background: `
        radial-gradient(circle at 20% 30%, rgba(220, 162, 147, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(210, 182, 161, 0.02) 0%, transparent 50%)
      `,
    }}
  />
)

/**
 * AnimatedBackground - Adaptive background component
 *
 * Renders either:
 * - Animated WebGL silk effect if WebGL is available and user doesn't prefer reduced motion
 * - Static gradient fallback otherwise (also on the server and before the client checks run)
 */
export function AnimatedBackground() {
  // Starts as `true` so the server and first client render agree on the static fallback; follows OS changes live.
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', true)
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)

  // Probe WebGL only once animation is actually wanted, and only once.
  useEffect(() => {
    if (prefersReducedMotion || webglSupported !== null) return
    setWebglSupported(isWebGLAvailable())
  }, [prefersReducedMotion, webglSupported])

  if (prefersReducedMotion || !webglSupported) {
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
