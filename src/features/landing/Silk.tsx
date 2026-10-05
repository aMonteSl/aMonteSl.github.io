'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  forwardRef,
  useEffect,
  useRef,
  useMemo,
  useLayoutEffect,
} from 'react'
import { Color, Mesh, PlaneGeometry, ShaderMaterial } from 'three'

/** The silk is a soft, slow, low-frequency pattern: 30fps is indistinguishable from 60 and halves the GPU work. */
const FRAME_INTERVAL_MS = 1000 / 30
/** Slack so a 60Hz display (16.7ms frames) renders every second frame instead of every third. */
const FRAME_INTERVAL_SLACK_MS = 2
/** Longest step the shader clock may take; a longer gap (tab switch, hitch) must not jump the pattern. */
const MAX_FRAME_DELTA_S = 0.1

const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  hex = hex.replace('#', '')
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255
  ]
}

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2 r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale;
  float tOffset = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 + 0.4 * sin(5.0 * (tex.x + tex.y +
    cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * tOffset) +
    sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 0.15;
  gl_FragColor = col;
}
`

interface SilkUniforms {
  [key: string]: { value: number | Color }
  uSpeed: { value: number }
  uScale: { value: number }
  uNoiseIntensity: { value: number }
  uColor: { value: Color }
  uRotation: { value: number }
  uTime: { value: number }
}

interface SilkPlaneProps {
  uniforms: SilkUniforms
}

type SilkMesh = Mesh<PlaneGeometry, ShaderMaterial>

const SilkPlane = forwardRef<SilkMesh, SilkPlaneProps>(function SilkPlane({ uniforms }, ref) {
  const { viewport } = useThree()

  useLayoutEffect(() => {
    if (ref && typeof ref === 'object' && 'current' in ref && ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1)
    }
  }, [ref, viewport])

  // Time advances by real elapsed time, so the motion keeps the same speed at any frame rate.
  useFrame((_, delta) => {
    if (ref && typeof ref === 'object' && 'current' in ref && ref.current) {
      ref.current.material.uniforms.uTime.value += 0.1 * Math.min(delta, MAX_FRAME_DELTA_S)
    }
  })

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  )
})

SilkPlane.displayName = 'SilkPlane'

/**
 * Drives the on-demand frameloop at ~30fps. requestAnimationFrame stops while the tab is hidden,
 * so nothing renders in the background.
 */
function FrameRateLimiter() {
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    let rafId = 0
    let lastFrameTime = -Infinity

    const tick = (time: number) => {
      if (time - lastFrameTime >= FRAME_INTERVAL_MS - FRAME_INTERVAL_SLACK_MS) {
        lastFrameTime = time
        invalidate()
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [invalidate])

  return null
}

interface SilkProps {
  speed?: number
  scale?: number
  color?: string
  noiseIntensity?: number
  rotation?: number
}

const Silk = ({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0
}: SilkProps) => {
  const meshRef = useRef<SilkMesh>(null)

  const uniforms = useMemo<SilkUniforms>(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 }
    }),
    [speed, scale, noiseIntensity, color, rotation]
  )

  return (
    // inset-x-0 rather than 100vw keeps the canvas off the desktop scrollbar. The height stays 100vh (the large
    // viewport on mobile) because a bottom-anchored fixed box follows the toolbars, and every canvas resize
    // reallocates the drawing buffer.
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[-1] h-screen" aria-hidden="true">
      <Canvas
        // A soft, 15%-alpha pattern seen through blurred surfaces gains nothing from retina resolution or MSAA.
        // R3F merges `gl` over its defaults, so alpha stays true and the body gradient keeps showing through.
        dpr={1}
        gl={{ antialias: false, powerPreference: 'low-power' }}
        frameloop="demand"
        style={{ width: '100%', height: '100%' }}
      >
        <FrameRateLimiter />
        <SilkPlane ref={meshRef} uniforms={uniforms} />
      </Canvas>
    </div>
  )
}

export default Silk
