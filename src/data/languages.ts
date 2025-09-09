export interface Language {
  name: string
  level: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'beginner'
  certification?: string
  description?: string
}

export const languages: Language[] = [
  {
    name: 'Spanish',
    level: 'native',
    description: 'Native speaker with excellent written and verbal communication skills'
  },
  {
    name: 'English',
    level: 'intermediate',
    certification: 'TOEIC 2022 - B2 Level',
    description: 'Strong technical English proficiency, comfortable with documentation and international collaboration'
  }
]
