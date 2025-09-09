export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  tags: string[]
  links: {
    github?: string
    website?: string
    demo?: string
  }
  featured: boolean
  year: number
  status: 'completed' | 'in-progress' | 'planned'
  highlights: string[]
}

export const projects: Project[] = [
  {
    id: 'code-xr',
    title: 'Code-XR',
    description: 'Open-source VS Code plugin that visualizes code metrics in real time with VR/AR (A-Frame/WebXR) integration.',
    longDescription: 'Code-XR is an innovative VS Code extension that revolutionizes how developers understand their code quality through immersive visualization. The plugin provides real-time metrics analysis with both traditional panel views and cutting-edge XR experiences, making code review and optimization more intuitive and engaging.',
    tags: ['TypeScript', 'VS Code API', 'A-Frame', 'WebXR', 'Python', 'Lizard', '3D Visualization'],
    links: {
      github: 'https://github.com/aMonteSl/code-xr',
      website: 'https://amontesl.github.io/code-xr-docs/'
    },
    featured: true,
    year: 2025,
    status: 'completed',
    highlights: [
      'VS Code extension with 500+ downloads',
      'Real-time code metrics visualization',
      'VR/AR modes for immersive code exploration',
      'Live metrics panel with JSON persistence',
      'Integration with Python Lizard for code analysis',
      'WebXR compatibility for cross-platform XR support'
    ]
  },
  {
    id: 'vissoft-paper',
    title: 'Scientific Article - VISSOFT/ICSME 2025',
    description: 'Academic research paper accepted at VISSOFT/ICSME 2025 conference, presenting innovative approaches to code visualization.',
    tags: ['Research', 'Academic Writing', 'Code Visualization', 'XR', 'Software Engineering'],
    links: {},
    featured: true,
    year: 2025,
    status: 'completed',
    highlights: [
      'Accepted at prestigious VISSOFT/ICSME 2025 conference',
      'First-author publication in software visualization',
      'Peer-reviewed research contribution',
      'Focus on XR applications in software engineering'
    ]
  }
]
