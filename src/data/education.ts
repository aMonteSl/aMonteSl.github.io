export interface Education {
  id: string
  institution: string
  degree: string
  location: string
  startDate: string
  endDate?: string
  description?: string
  gpa?: string
  honors?: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  type: 'academic' | 'professional' | 'certification'
  details?: string[]
}

export const education: Education[] = [
  {
    id: 'urjc-telematics',
    institution: 'Universidad Rey Juan Carlos (URJC)',
    degree: 'Bachelor of Science in Telematics Engineering',
    location: 'Madrid, Spain',
    startDate: '2020',
    endDate: 'Present',
    description: 'Comprehensive program covering telecommunications, computer networks, software engineering, and system administration with focus on modern technology integration.',
  }
]

export const achievements: Achievement[] = [
  {
    id: 'honor-lsmu',
    title: 'Matrícula de Honor — LSMU',
    description: 'Android app development with Kotlin - Highest academic distinction',
    date: '2025',
    type: 'academic',
    details: [
      'UI design principles and best practices',
      'Android activity lifecycle management',
      'Advanced UI components and custom views',
      'Material Design implementation',
      'Performance optimization techniques'
    ]
  },
  {
    id: 'honor-ast',
    title: 'Matrícula de Honor — AST',
    description: 'Telematics applications in C++ - Highest academic distinction',
    date: '2024',
    type: 'academic',
    details: [
      'Object-oriented programming in C++',
      'Advanced software design patterns',
      'Network programming and communications',
      'System-level programming',
      'Performance-critical application development'
    ]
  },
  {
    id: 'vissoft-acceptance',
    title: 'VISSOFT/ICSME 2025 Paper Acceptance',
    description: 'Scientific article accepted at prestigious software visualization conference',
    date: '2025',
    type: 'professional',
    details: [
      'First-author research publication',
      'Peer-reviewed acceptance at top-tier conference',
      'Contribution to software visualization research',
      'Focus on XR applications in software engineering'
    ]
  },
  {
    id: 'recommendation-letter',
    title: 'Faculty Recommendation',
    description: 'Letter of recommendation from Prof. David Moreno Lumbreras, URJC',
    date: '2025',
    type: 'professional',
    details: [
      'Available upon request',
      'Recognition of academic excellence',
      'Endorsement of technical capabilities',
      'Professional character reference'
    ]
  }
]
