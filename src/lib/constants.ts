// Centralized constants for the portfolio.

export const PLACEHOLDER_IMAGE = '/projects/placeholder.svg'

export const LINKS = {
  github: 'https://github.com/aMonteSl',
  linkedin: 'https://www.linkedin.com/in/adrianmonteslinares/',
  email: 'mailto:adrian.adyra@gmail.com',
  website: 'https://amontesl.github.io',

  codeXrRepo: 'https://github.com/aMonteSl/CodeXR',
  codeXrDocs: 'https://amontesl.github.io/code-xr-docs/',
  codeXrMarketplace:
    'https://marketplace.visualstudio.com/items?itemName=aMonteSl.code-xr',
  codeXrDoi: 'https://doi.org/10.1109/VISSOFT67405.2025.00034',
  codeXrIeee: 'https://ieeexplore.ieee.org/document/11175653',
  codeXrAward: 'https://conf.researchr.org/info/icsme-2025/icsme-2025-awards',
  codeXrAwardCertificate: '/documents/distinghuished_artifact_award.pdf',

  vissoftPaper: 'https://doi.org/10.1109/VISSOFT67405.2025.00034',
} as const

export const CV_FILES = {
  en: '/cv/CV_Color_Adrian_Montes_Linares_ENG.pdf',
  es: '/cv/CV_Color_Adrian_Montes_Linares.pdf',
} as const

export function getCvUrl(locale: string): string {
  return locale === 'es' ? CV_FILES.es : CV_FILES.en
}

export const CREDENTIALS = [
  { key: 'vissoft', label: 'VISSOFT 2025' },
  { key: 'codeXr', label: 'Code-XR (Open Source)' },
  { key: 'techStack', label: 'TypeScript - Next.js - Tailwind' },
] as const

export const NAV_ITEMS = [
  { key: 'home', href: '#home' },
  { key: 'profile', href: '#profile' },
  { key: 'projects', href: '#projects' },
  { key: 'skills', href: '#skills' },
  { key: 'journey', href: '#journey' },
  { key: 'testimonials', href: '#testimonials' },
  { key: 'certifications', href: '#certifications' },
  { key: 'contact', href: '#contact' },
] as const

export const SOCIAL_LINKS = [
  { key: 'github', href: LINKS.github, icon: 'github' },
  { key: 'linkedin', href: LINKS.linkedin, icon: 'linkedin' },
  { key: 'email', href: LINKS.email, icon: 'email' },
] as const

export const SITE = {
  name: 'Adri\u00e1n Montes Portfolio',
  author: 'Adri\u00e1n Montes Linares',
  url: LINKS.website,
} as const
