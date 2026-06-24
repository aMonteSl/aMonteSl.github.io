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
  linkType?: 'internal' | 'external'
  badge?: string // Badge image URL
  tags?: string[]
  status: 'completed' | 'in-progress' | 'planned'
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'telematics-degree',
    name: 'telematicsDegree',
    issuer: 'telematicsDegreeIssuer',
    date: '2026-01-15',
    tags: ['URJC', 'Telematics Engineering'],
    status: 'completed',
  },
  {
    id: 'code-xr-award',
    name: 'codeXrAward',
    issuer: 'codeXrAwardIssuer',
    date: '2025-09-07',
    link: '/documents/distinghuished_artifact_award.pdf',
    linkType: 'external',
    tags: ['Code-XR', 'VISSOFT', 'ICSME 2025'],
    status: 'completed',
  },
  {
    id: 'greenhouse-high-distinction',
    name: 'greenhouseHighDistinction',
    issuer: 'greenhouseHighDistinctionIssuer',
    date: '2024-05',
    link: '/projects/honor-course-1',
    linkType: 'internal',
    tags: ['C++', 'OOP', 'UMLET', 'Doxygen'],
    status: 'completed',
  },
  {
    id: 'stepbystep-high-distinction',
    name: 'stepByStepHighDistinction',
    issuer: 'stepByStepHighDistinctionIssuer',
    date: '2025-05',
    link: '/projects/honor-course-2',
    linkType: 'internal',
    tags: ['Kotlin', 'Android', 'Maps', 'GPX'],
    status: 'completed',
  },
  {
    id: 'cambridge-c1',
    name: 'cambridgeC1',
    issuer: 'Cambridge University',
    date: '2026-Q2',
    tags: ['English', 'Professional Development'],
    status: 'in-progress',
  },
  {
    id: 'master-telecom-upm',
    name: 'masterTelecomUPM',
    issuer: 'masterTelecomUPMIssuer',
    date: '2026-09',
    tags: ['Telecommunications', 'UPM', 'Systems'],
    status: 'planned',
  },
]
