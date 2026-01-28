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

// Get hero image path (logo.png if exists, else first image, else placeholder)
export function getProjectHeroPath(project: Project): string {
  const manifestEntry = imageManifest[project.slug]
  
  if (!manifestEntry) {
    return PLACEHOLDER_IMAGE
  }
  
  // Use logo.png (heroImage) if available
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
