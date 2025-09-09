export interface GalleryItem {
  id: string
  src: string
  width: number
  height: number
  alt: string
  caption?: string
  sources?: { src: string; type: string; width: number }[]
  category?: string
}

export const gallery: GalleryItem[] = [
  {
    id: 'code-xr-showcase',
    src: '/src/assets/gallery/code-xr-showcase.jpg',
    width: 600,
    height: 400,
    alt: 'Code-XR VS Code extension interface showing real-time code metrics visualization',
    caption: 'Code-XR Extension — Real-time code metrics visualization with VR/AR integration',
    category: 'Projects'
  },
  {
    id: 'university-projects',
    src: '/src/assets/gallery/university-projects.jpg',
    width: 600,
    height: 400,
    alt: 'University telematics engineering projects and coursework',
    caption: 'University Projects — Telematics Engineering coursework and academic achievements',
    category: 'Education'
  },
  {
    id: 'research',
    src: '/src/assets/gallery/research.jpg',
    width: 600,
    height: 400,
    alt: 'Research and development in software visualization and XR technologies',
    caption: 'Research & Development — Academic publications and software visualization research',
    category: 'Research'
  },
  {
    id: 'web-development',
    src: '/src/assets/gallery/web-development.jpg',
    width: 600,
    height: 400,
    alt: 'Modern web development projects using React, TypeScript, and other technologies',
    caption: 'Web Development — Modern full-stack development with React and TypeScript',
    category: 'Development'
  }
]
