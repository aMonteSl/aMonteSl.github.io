// Featured projects configuration
// Each project has i18n keys and optional links

import { LINKS } from '@/lib/constants'

export interface FeaturedProject {
  id: string
  i18nKey: string // Key under hero.featuredProject
  links?: {
    github?: string
    docs?: string
  }
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'codeXr',
    i18nKey: 'codeXr',
    links: {
      github: LINKS.codeXrRepo,
      docs: LINKS.codeXrDocs,
    },
  },
  {
    id: 'obt',
    i18nKey: 'obt',
    // No links - internal project
  },
] as const
