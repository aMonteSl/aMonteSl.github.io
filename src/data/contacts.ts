export interface ContactInfo {
  type: 'email' | 'phone' | 'linkedin' | 'github' | 'website'
  label: string
  value: string
  href: string
  icon?: string
  primary?: boolean
}

export const contacts: ContactInfo[] = [
  {
    type: 'email',
    label: 'Email',
    value: 'adrian.adyra@gmail.com',
    href: 'mailto:adrian.adyra@gmail.com',
    primary: true
  },
  {
    type: 'phone',
    label: 'Phone',
    value: '+34 637 682 361',
    href: 'tel:+34637682361'
  },
  {
    type: 'linkedin',
    label: 'LinkedIn',
    value: 'adrianmonteslinares',
    href: 'https://linkedin.com/in/adrianmonteslinares',
    primary: true
  },
  {
    type: 'github',
    label: 'GitHub',
    value: 'aMonteSl',
    href: 'https://github.com/aMonteSl',
    primary: true
  }
]
