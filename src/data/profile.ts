export interface Profile {
  name: string
  title: string
  location: string
  email: string
  phone: string
  linkedin: string
  github: string
  summary: string
  interests: string[]
}

export const profile: Profile = {
  name: 'Adrián Montes',
  title: 'Telematics Engineering Student & Software Developer',
  location: 'Madrid, Spain',
  email: 'adrian.adyra@gmail.com',
  phone: '+34 637 682 361',
  linkedin: 'linkedin.com/in/adrianmonteslinares',
  github: 'github.com/aMonteSl',
  summary: 'Telematics Engineering student at URJC with a passion for modern software development. Creator of Code-XR, an innovative VS Code extension that visualizes code metrics in real-time with XR integration. Seeking internship opportunities to contribute to meaningful projects while advancing technical expertise.',
  interests: [
    'Learning new technologies',
    'XR/Web development',
    'Backend development',
    'Generative AI',
    'Exploring cultures/travel'
  ]
}
