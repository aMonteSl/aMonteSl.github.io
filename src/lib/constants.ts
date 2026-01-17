// Centralized constants for the portfolio

// External links - Single source of truth for all URLs
export const LINKS = {
  // Personal
  github: 'https://github.com/aMonteSl',
  linkedin: 'https://linkedin.com/in/adrian-montes-linares',
  email: 'mailto:adrian.monteslinares@gmail.com',
  website: 'https://amontesl.github.io',
  cv: '/cv/AdrianMontesLinares_CV.pdf',

  // Projects
  codeXrRepo: 'https://github.com/aMonteSl/CodeXR',
  codeXrDemo: 'https://amontesl.github.io/CodeXR',
  codeXrMarketplace:
    'https://marketplace.visualstudio.com/items?itemName=aMonteSl.codexr',

  // Publications
  vissoftPaper: 'https://doi.org/PLACEHOLDER', // Update when available
} as const

// Credentials / chips for hero section
export const CREDENTIALS = [
  { key: 'vissoft', label: 'VISSOFT 2025' },
  { key: 'codeXr', label: 'Code-XR (Open Source)' },
  { key: 'techStack', label: 'TypeScript · Next.js · Tailwind' },
] as const

// Navigation items
export const NAV_ITEMS = [
  { key: 'home', href: '#home' },
  { key: 'projects', href: '#projects' },
  { key: 'skills', href: '#skills' },
  { key: 'journey', href: '#journey' },
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
