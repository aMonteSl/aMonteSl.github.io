/**
 * Certifications and Badges
 * Professional certifications, awards, and achievements
 */

export interface Certification {
  id: string
  name: string // i18n key for name
  issuer: string // i18n key or plain text
  date: string // ISO date or "In Progress"
  link?: string // URL to verification
  badge?: string // Badge image URL
  tags?: string[]
  status: 'completed' | 'in-progress' | 'planned'
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'vissoft-2025',
    name: 'VISSOFT @ ICSME 2025',
    issuer: 'IEEE VISSOFT',
    date: '2025-09-07',
    link: 'https://vissoft.info',
    tags: ['Conference', 'Publication', 'Research'],
    status: 'completed',
  },
  {
    id: 'code-xr-marketplace',
    name: 'Code-XR - VS Code Marketplace',
    issuer: 'Microsoft',
    date: '2024-Q4',
    link: 'https://marketplace.visualstudio.com/items?itemName=aMonteSl.code-xr',
    tags: ['Open Source', 'VS Code Extension', '300+ Downloads'],
    status: 'completed',
  },
  {
    id: 'cambridge-c1',
    name: 'certificates.cambridgeC1',
    issuer: 'Cambridge University',
    date: '2026-Q2',
    tags: ['English', 'Professional Development'],
    status: 'in-progress',
  },
  {
    id: 'master-ai',
    name: 'certificates.masterAI',
    issuer: 'certificates.masterAIIssuer',
    date: '2028-06',
    tags: ['AI', 'Deep Learning', 'NLP'],
    status: 'planned',
  },
]
