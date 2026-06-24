import projectsData from '@/content/projects.json'
import type { Locale } from '@/i18n'
import type { Project } from './types'
import {
  getLocalizedProject as localizeProject,
  getProjectHeroPath,
  getProjectImagePaths,
} from './types'

export function getProjects(): Project[] {
  return projectsData as Project[]
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug)
}

export function getLocalizedProject(project: Project, locale: Locale) {
  return localizeProject(project, locale)
}

export function getLocalizedProjects(locale: Locale) {
  return getProjects().map((project) => ({
    ...getLocalizedProject(project, locale),
    imagePaths: getProjectImagePaths(project),
  }))
}

export function getProjectSeoImage(project: Project): string {
  return getProjectHeroPath(project)
}
