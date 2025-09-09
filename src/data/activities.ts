export interface Activity {
  id: string
  title: string
  description: string
  date: string
  type: 'hackathon' | 'conference' | 'workshop' | 'talk' | 'course'
  role?: string
  organization?: string
  location?: string
  skills?: string[]
  achievements?: string[]
}

export const activities: Activity[] = [
  {
    id: 'urjc-hackathon-2024',
    title: 'URJC Hackathon 2024',
    description: 'Participated in university hackathon focused on circular economy solutions and sustainable technology development.',
    date: '2024',
    type: 'hackathon',
    role: 'Team Member - Ideation, Prototyping, and Pitch Presentation',
    organization: 'Universidad Rey Juan Carlos',
    location: 'Madrid, Spain',
    skills: ['Team collaboration', 'Rapid prototyping', 'Pitch presentation', 'Sustainable technology'],
    achievements: [
      'Developed innovative circular economy solution',
      'Collaborated in multidisciplinary team',
      'Presented solution to panel of judges',
      'Enhanced problem-solving under time constraints'
    ]
  },
  {
    id: 'tech-talks-attendance',
    title: 'Tech Talks & Workshops Attendance',
    description: 'Regular participant in technology conferences, workshops, and educational events focusing on web development, XR technologies, backend systems, and generative AI.',
    date: '2023 - Present',
    type: 'conference',
    role: 'Attendee and Active Learner',
    skills: ['Continuous learning', 'Technology trends', 'Networking', 'Knowledge sharing'],
    achievements: [
      'Stayed current with emerging technologies',
      'Built professional network in tech community',
      'Applied learnings to personal projects',
      'Developed expertise in cutting-edge fields'
    ]
  },
  {
    id: 'web-xr-workshops',
    title: 'Web & XR Development Workshops',
    description: 'Specialized workshops on web technologies and extended reality development, contributing to the technical foundation for Code-XR project.',
    date: '2023 - 2024',
    type: 'workshop',
    skills: ['WebXR', 'A-Frame', 'Three.js', 'Web development', 'VR/AR development'],
    achievements: [
      'Mastered WebXR technologies',
      'Gained practical XR development experience',
      'Applied knowledge to Code-XR project',
      'Built foundation for research publication'
    ]
  },
  {
    id: 'backend-ai-sessions',
    title: 'Backend & Generative AI Sessions',
    description: 'Attended specialized sessions on backend architecture patterns, microservices, and generative AI applications in software development.',
    date: '2023 - Present',
    type: 'talk',
    skills: ['Backend architecture', 'Microservices', 'Generative AI', 'Prompt engineering'],
    achievements: [
      'Developed backend development expertise',
      'Learned prompt engineering techniques',
      'Understanding of AI integration in development',
      'Enhanced system design capabilities'
    ]
  }
]
