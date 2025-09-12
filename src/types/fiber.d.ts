declare module '@react-three/fiber' {
  import { ReactNode } from 'react'
  
  export interface CanvasProps {
    children?: ReactNode
    dpr?: number | [number, number]
    frameloop?: 'always' | 'demand' | 'never'
    style?: React.CSSProperties
  }
  
  export function Canvas(props: CanvasProps): JSX.Element
  
  export function useFrame(callback: (state: any, delta: number) => void): void
  
  export function useThree(): {
    viewport: {
      width: number
      height: number
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any
      planeGeometry: any
      shaderMaterial: any
    }
  }
}
