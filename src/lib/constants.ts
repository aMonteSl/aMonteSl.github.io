// Centralized constants for the portfolio

// External links
export const LINKS = {
  github: 'https://github.com/aMonteSl',
  linkedin: 'https://linkedin.com/in/adrian-montes-linares',
  email: 'mailto:adrian.monteslinares@gmail.com',
  whatsapp: 'https://wa.me/34600000000', // Update with actual number
  cv: '/cv/AdrianMontesLinares_CV.pdf',
  website: 'https://amontesl.github.io',
} as const

// Navigation items
export const NAV_ITEMS = [
  { key: 'home', href: '#home' },
  { key: 'projects', href: '#projects' },
] as const

// Social links for footer/contact
export const SOCIAL_LINKS = [
  { key: 'github', href: LINKS.github, icon: 'github' },
  { key: 'linkedin', href: LINKS.linkedin, icon: 'linkedin' },
  { key: 'email', href: LINKS.email, icon: 'email' },
] as const

// Site metadata
export const SITE = {
  name: 'Adrián Montes Portfolio',
  author: 'Adrián Montes Linares',
  url: LINKS.website,
} as const
