import { MeshProps, Object3DNode } from '@react-three/fiber'
import { Mesh, PlaneGeometry, ShaderMaterial } from 'three'

declare module '@react-three/fiber' {
  interface ThreeElements {
    mesh: Object3DNode<Mesh, typeof Mesh>
    planeGeometry: Object3DNode<PlaneGeometry, typeof PlaneGeometry>
    shaderMaterial: Object3DNode<ShaderMaterial, typeof ShaderMaterial>
  }
}
