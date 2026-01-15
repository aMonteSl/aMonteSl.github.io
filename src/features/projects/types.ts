// Project type definition
export interface Project {
  slug: string
  title: string
  period: string
  summary_en: string
  summary_es: string
  tags: string[]
  repoUrl: string
  demoUrl: string
  images: {
    thumb: string
    hero: string
  }
  highlights_en: string[]
  highlights_es: string[]
  role_en: string
  role_es: string
  tech: string[]
}

// Get localized content from project
export function getLocalizedProject(project: Project, locale: string) {
  return {
    ...project,
    summary: locale === 'es' ? project.summary_es : project.summary_en,
    highlights: locale === 'es' ? project.highlights_es : project.highlights_en,
    role: locale === 'es' ? project.role_es : project.role_en,
  }
}
