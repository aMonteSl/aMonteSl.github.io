// Project type definition
export type ProjectType = 'openSource' | 'academic' | 'personal' | 'internal'

export interface Project {
  slug: string
  title: string
  period: string
  featured?: boolean
  type?: ProjectType
  summary_en: string
  summary_es: string
  tags: string[]
  repoUrl: string
  demoUrl: string
  imageDir: string
  images: string[]
  heroImage: string
  highlights_en: string[]
  highlights_es: string[]
  role_en: string
  role_es: string
  tech: string[]
}

// Localized project for display
export interface LocalizedProject extends Omit<Project, 'summary_en' | 'summary_es' | 'highlights_en' | 'highlights_es' | 'role_en' | 'role_es'> {
  summary: string
  highlights: string[]
  role: string
}

// Get localized content from project
export function getLocalizedProject(project: Project, locale: string): LocalizedProject {
  return {
    slug: project.slug,
    title: project.title,
    period: project.period,
    featured: project.featured,
    type: project.type,
    tags: project.tags,
    repoUrl: project.repoUrl,
    demoUrl: project.demoUrl,
    imageDir: project.imageDir,
    images: project.images,
    heroImage: project.heroImage,
    tech: project.tech,
    summary: locale === 'es' ? project.summary_es : project.summary_en,
    highlights: locale === 'es' ? project.highlights_es : project.highlights_en,
    role: locale === 'es' ? project.role_es : project.role_en,
  }
}

// Get full image paths for a project
export function getProjectImagePaths(project: Project): string[] {
  return project.images.map(img => `${project.imageDir}/${img}`)
}

// Get hero image path
export function getProjectHeroPath(project: Project): string {
  return `${project.imageDir}/${project.heroImage}`
}
