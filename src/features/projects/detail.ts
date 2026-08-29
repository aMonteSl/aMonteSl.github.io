import { LINKS } from '@/lib/constants'
import type { Locale } from '@/i18n'
import type { Project, ProjectMilestone, ProjectType } from './types'

export interface ProjectDetailLink {
  label: string
  url: string
  kind?: 'repo' | 'web' | 'marketplace' | 'doi' | 'ieee' | 'award' | 'certificate'
}

export interface LocalizedProjectReleaseFeature {
  id: string
  title: string
  description: string
  bullets: string[]
  videoUrl?: string
}

export interface LocalizedProjectRelease {
  version: string
  date: string
  title: string
  codename?: string
  intro: string
  tutorialUrl?: string
  features: LocalizedProjectReleaseFeature[]
}

export interface LocalizedProjectDetail {
  summary: string
  detailSummary: string
  role: string
  status?: string
  badges?: string[]
  milestones: Array<{
    version: string
    date: string
    title: string
    description: string
    status?: ProjectMilestone['status']
  }>
  release?: LocalizedProjectRelease
}

export function getAdjacentProjects(currentSlug: string, projects: Project[]): { prev: Project | null; next: Project | null } {
  const currentIndex = projects.findIndex((project) => project.slug === currentSlug)

  return {
    prev: currentIndex > 0 ? projects[currentIndex - 1] : null,
    next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null,
  }
}

export function getTypeBadgeVariant(type?: ProjectType): 'default' | 'outline' {
  return type === 'openSource' || type === 'personal' ? 'default' : 'outline'
}

export function getLocalizedProjectDetail(project: Project, locale: Locale): LocalizedProjectDetail {
  const isSpanish = locale === 'es'

  return {
    summary: isSpanish ? project.summary_es : project.summary_en,
    detailSummary: (isSpanish ? project.detailSummary_es : project.detailSummary_en) ?? (isSpanish ? project.summary_es : project.summary_en),
    role: isSpanish ? project.role_es : project.role_en,
    status: isSpanish ? project.status_es : project.status_en,
    badges: isSpanish ? project.badges_es : project.badges_en,
    milestones: project.milestones?.map((milestone) => ({
      version: milestone.version,
      date: isSpanish ? milestone.date_es : milestone.date_en,
      title: isSpanish ? milestone.title_es : milestone.title_en,
      description: isSpanish ? milestone.description_es : milestone.description_en,
      status: milestone.status,
    })) ?? [],
    release: project.release && {
      version: project.release.version,
      date: isSpanish ? project.release.date_es : project.release.date_en,
      title: isSpanish ? project.release.title_es : project.release.title_en,
      codename: isSpanish ? project.release.codename_es : project.release.codename_en,
      intro: isSpanish ? project.release.intro_es : project.release.intro_en,
      tutorialUrl: project.release.tutorialUrl,
      features: project.release.features.map((feature) => ({
        id: feature.id,
        title: isSpanish ? feature.title_es : feature.title_en,
        description: isSpanish ? feature.description_es : feature.description_en,
        bullets: (isSpanish ? feature.bullets_es : feature.bullets_en) ?? [],
        videoUrl: feature.videoUrl,
      })),
    },
  }
}

export function buildProjectDetailLinks(
  project: Project,
  labels: {
    repo: string
    web: string
    marketplace: string
    doi: string
    ieee: string
    award: string
    certificate: string
  }
): ProjectDetailLink[] {
  const links: ProjectDetailLink[] = []

  if (project.repoUrl) {
    links.push({ label: labels.repo, url: project.repoUrl, kind: 'repo' })
  }

  if (project.demoUrl) {
    links.push({ label: labels.web, url: project.demoUrl, kind: 'web' })
  }

  if (project.slug === 'code-xr') {
    links.push({ label: labels.marketplace, url: LINKS.codeXrMarketplace, kind: 'marketplace' })
    links.push({ label: labels.doi, url: LINKS.codeXrDoi, kind: 'doi' })
    links.push({ label: labels.ieee, url: LINKS.codeXrIeee, kind: 'ieee' })
    links.push({ label: labels.award, url: LINKS.codeXrAward, kind: 'award' })
    links.push({ label: labels.certificate, url: LINKS.codeXrAwardCertificate, kind: 'certificate' })
  }

  return links
}

export function getProjectDoi(project: Project) {
  if (project.slug !== 'code-xr') {
    return null
  }

  return {
    code: '10.1109/VISSOFT67405.2025.00034',
    url: LINKS.codeXrDoi,
    venue: 'VISSOFT @ ICSME 2025 (IEEE)',
  }
}
