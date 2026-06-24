// Dynamic image manifest (generated at build time)
import projectImagesManifest from '@/content/projectImages.json'

// Type for the manifest
interface ProjectImagesEntry {
  images: string[]
  heroImage: string | null
}

type ProjectImagesManifest = Record<string, ProjectImagesEntry>

const imageManifest = projectImagesManifest as ProjectImagesManifest

// Placeholder image path
const PLACEHOLDER_IMAGE = '/projects/placeholder.svg'

// Project type definition
export type ProjectType = 'openSource' | 'academic' | 'personal' | 'internal'

export interface Project {
  slug: string
  title: string
  title_en?: string
  title_es?: string
  period: string
  status_en?: string
  status_es?: string
  badges_en?: string[]
  badges_es?: string[]
  featured?: boolean
  type?: ProjectType
  summary_en: string
  summary_es: string
  detailSummary_en?: string
  detailSummary_es?: string
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
  supervisorName?: string
  supervisorUrl?: string
  tech: string[]
  milestones?: ProjectMilestone[]
}

export interface ProjectMilestone {
  version: string
  date_en: string
  date_es: string
  title_en: string
  title_es: string
  description_en: string
  description_es: string
  status?: 'released' | 'awarded' | 'presented' | 'active'
}

// Localized project for display
export interface LocalizedProject extends Omit<Project, 'title_en' | 'title_es' | 'summary_en' | 'summary_es' | 'detailSummary_en' | 'detailSummary_es' | 'highlights_en' | 'highlights_es' | 'role_en' | 'role_es' | 'status_en' | 'status_es' | 'badges_en' | 'badges_es' | 'milestones'> {
  summary: string
  detailSummary?: string
  highlights: string[]
  role: string
  status?: string
  badges?: string[]
  milestones?: LocalizedProjectMilestone[]
}

export interface LocalizedProjectMilestone {
  version: string
  date: string
  title: string
  description: string
  status?: ProjectMilestone['status']
}

export function getLocalizedProjectTitle(project: Project, locale: string): string {
  return (locale === 'es' ? project.title_es : project.title_en) ?? project.title
}

// Get localized content from project
export function getLocalizedProject(project: Project, locale: string): LocalizedProject {
  return {
    slug: project.slug,
    title: getLocalizedProjectTitle(project, locale),
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
    status: locale === 'es' ? project.status_es : project.status_en,
    badges: locale === 'es' ? project.badges_es : project.badges_en,
    summary: locale === 'es' ? project.summary_es : project.summary_en,
    detailSummary: locale === 'es' ? project.detailSummary_es : project.detailSummary_en,
    highlights: locale === 'es' ? project.highlights_es : project.highlights_en,
    role: locale === 'es' ? project.role_es : project.role_en,
    milestones: project.milestones?.map((milestone) => ({
      version: milestone.version,
      date: locale === 'es' ? milestone.date_es : milestone.date_en,
      title: locale === 'es' ? milestone.title_es : milestone.title_en,
      description: locale === 'es' ? milestone.description_es : milestone.description_en,
      status: milestone.status,
    })),
  }
}

// Get full image paths for a project (dynamically from manifest)
export function getProjectImagePaths(project: Project): string[] {
  const manifestEntry = imageManifest[project.slug]
  
  // If no manifest entry or no images, return placeholder
  if (!manifestEntry || manifestEntry.images.length === 0) {
    return [PLACEHOLDER_IMAGE]
  }
  
  // Build full paths from manifest
  return manifestEntry.images.map(img => `${project.imageDir}/${img}`)
}

// Get hero image path from the generated manifest, else first image, else placeholder.
export function getProjectHeroPath(project: Project): string {
  const manifestEntry = imageManifest[project.slug]
  
  if (!manifestEntry) {
    return PLACEHOLDER_IMAGE
  }
  
  // Use the declared hero image when available.
  if (manifestEntry.heroImage) {
    return `${project.imageDir}/${manifestEntry.heroImage}`
  }
  
  // Fallback to first image in the list
  if (manifestEntry.images.length > 0) {
    return `${project.imageDir}/${manifestEntry.images[0]}`
  }
  
  return PLACEHOLDER_IMAGE
}

// Check if project has real images (not just placeholder)
export function projectHasImages(project: Project): boolean {
  const manifestEntry = imageManifest[project.slug]
  return !!manifestEntry && manifestEntry.images.length > 0
}
