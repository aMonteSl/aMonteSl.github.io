// Centralized constants for the portfolio

// Placeholder image for carousels/galleries when no image is available
export const PLACEHOLDER_IMAGE = '/projects/placeholder.svg'

// External links - Single source of truth for all URLs
export const LINKS = {
  // Personal
  github: 'https://github.com/aMonteSl',
  linkedin: 'https://linkedin.com/in/adrian-montes-linares',
  email: 'mailto:adrian.adyra@gmail.com',
  website: 'https://amontesl.github.io',

  // Projects - Code-XR
  codeXrRepo: 'https://github.com/aMonteSl/CodeXR',
  codeXrDocs: 'https://amontesl.github.io/code-xr-docs/',
  codeXrMarketplace:
    'https://marketplace.visualstudio.com/items?itemName=aMonteSl.code-xr',
  codeXrDoi: 'https://doi.org/10.1109/VISSOFT67405.2025.00034',
  codeXrIeee: 'https://ieeexplore.ieee.org/document/11175653',

  // Publications
  vissoftPaper: 'https://doi.org/10.1109/VISSOFT67405.2025.00034',
} as const

// CV files per locale
export const CV_FILES = {
  en: '/cv/CV_Color_Adrian_Montes_Linares_ENG.pdf',
  es: '/cv/CV_Color_Adrian_Montes_Linares.pdf',
} as const

/** Helper to get the CV URL for a given locale */
export function getCvUrl(locale: string): string {
  return locale === 'es' ? CV_FILES.es : CV_FILES.en
}

// Credentials / chips for hero section
export const CREDENTIALS = [
  { key: 'vissoft', label: 'VISSOFT 2025' },
  { key: 'codeXr', label: 'Code-XR (Open Source)' },
  { key: 'techStack', label: 'TypeScript · Next.js · Tailwind' },
] as const

// Navigation items
export const NAV_ITEMS = [
  { key: 'home', href: '#home' },
  { key: 'profile', href: '#profile' },
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
