export interface SkillCategory {
  name: string
  skills: Skill[]
}

export interface Skill {
  name: string
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  years?: number
  description?: string
}

export const skillCategories: SkillCategory[] = [
  {
    name: 'Programming Languages',
    skills: [
      { name: 'TypeScript', level: 'advanced', years: 2, description: 'Primary language for web development and VS Code extensions' },
      { name: 'JavaScript', level: 'advanced', years: 3, description: 'Frontend and full-stack web development' },
      { name: 'Python', level: 'intermediate', years: 2, description: 'Data analysis, automation, and backend development' },
      { name: 'C++', level: 'intermediate', years: 2, description: 'System programming and performance-critical applications' },
      { name: 'Kotlin', level: 'intermediate', years: 1, description: 'Android app development and mobile programming' },
      { name: 'C', level: 'intermediate', years: 2, description: 'Low-level programming and embedded systems' },
      { name: 'SQL', level: 'intermediate', years: 2, description: 'Database design and query optimization' },
      { name: 'HTML/CSS', level: 'advanced', years: 3, description: 'Modern web standards and responsive design' },
      { name: 'Pascal', level: 'beginner', years: 1, description: 'Academic programming fundamentals' },
      { name: 'RISC-V Assembly', level: 'beginner', years: 1, description: 'Computer architecture and low-level programming' },
      { name: 'MATLAB', level: 'beginner', years: 1, description: 'Mathematical computing and signal processing' }
    ]
  },
  {
    name: 'Frameworks & Libraries',
    skills: [
      { name: 'React', level: 'advanced', years: 2, description: 'Component-based UI development and state management' },
      { name: 'A-Frame', level: 'intermediate', years: 1, description: 'WebXR and VR/AR web experiences' },
      { name: 'WebXR', level: 'intermediate', years: 1, description: 'Cross-platform XR web applications' },
      { name: 'Django', level: 'intermediate', years: 1, description: 'Python web framework for backend development' },
      { name: 'Bootstrap', level: 'intermediate', years: 2, description: 'Responsive CSS framework' },
      { name: 'Tailwind CSS', level: 'advanced', years: 1, description: 'Utility-first CSS framework' },
      { name: 'ROS 2', level: 'beginner', years: 1, description: 'Robotics middleware and system integration' }
    ]
  },
  {
    name: 'Tools & Technologies',
    skills: [
      { name: 'VS Code', level: 'expert', years: 3, description: 'Extension development and advanced IDE usage' },
      { name: 'Git', level: 'advanced', years: 3, description: 'Version control and collaborative development' },
      { name: 'Linux', level: 'advanced', years: 3, description: 'System administration and command-line proficiency' },
      { name: 'PostgreSQL', level: 'intermediate', years: 1, description: 'Relational database management' },
      { name: 'Android Studio', level: 'intermediate', years: 1, description: 'Android app development and debugging' },
      { name: 'Wireshark', level: 'intermediate', years: 1, description: 'Network protocol analysis' },
      { name: 'nmap', level: 'intermediate', years: 1, description: 'Network discovery and security auditing' },
      { name: 'OpenSSL/GPG', level: 'intermediate', years: 1, description: 'Cryptography and security tools' },
      { name: 'iptables/UFW', level: 'intermediate', years: 1, description: 'Firewall configuration and network security' }
    ]
  },
  {
    name: 'Specialized Skills',
    skills: [
      { name: 'VS Code Extension Development', level: 'expert', years: 1, description: 'Created and published Code-XR extension' },
      { name: '3D Visualization', level: 'intermediate', years: 1, description: 'Web-based 3D graphics and XR experiences' },
      { name: 'Code Metrics Analysis', level: 'advanced', years: 1, description: 'Static analysis and software quality measurement' },
      { name: 'Prompt Engineering', level: 'intermediate', years: 1, description: 'Generative AI integration and optimization' },
      { name: 'Network Programming', level: 'intermediate', years: 2, description: 'Socket programming and communication protocols' },
      { name: 'Mobile UI Design', level: 'intermediate', years: 1, description: 'Android Material Design principles' },
      { name: 'Academic Research', level: 'intermediate', years: 1, description: 'Scientific writing and peer review process' }
    ]
  }
]
