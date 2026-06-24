'use client'

import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  Badge,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@/components/ui'
import { localizeHash, localizePath, useLocale, useTranslations } from '@/i18n'
import { getProjects } from './data'
import {
  buildProjectDetailLinks,
  getAdjacentProjects,
  getLocalizedProjectDetail,
  getProjectDoi,
  getTypeBadgeVariant,
} from './detail'
import { ProjectDetailHero } from './components/ProjectDetailHero'
import { ProjectDetailLayout } from './components/ProjectDetailLayout'
import { ProjectDetailSummary } from './components/ProjectDetailSummary'
import { ProjectDetailFooter } from './components/ProjectDetailFooter'
import { ProjectMilestones } from './components/ProjectMilestones'
import { ProjectTechRail } from './components/ProjectTechRail'
import type { Project } from './types'
import { getLocalizedProjectTitle, getProjectImagePaths } from './types'

interface ProjectPageClientProps {
  project: Project
}

export function ProjectPageClient({ project }: ProjectPageClientProps) {
  const t = useTranslations('projects')
  const { locale } = useLocale()
  const router = useRouter()
  const projects = useMemo(() => getProjects(), [])
  const { prev, next } = getAdjacentProjects(project.slug, projects)
  const content = getLocalizedProjectDetail(project, locale)
  const title = getLocalizedProjectTitle(project, locale)
  const galleryImages = getProjectImagePaths(project)
  const detailLinks = buildProjectDetailLinks(project, {
    repo: t('links.repo'),
    web: t('links.web'),
    marketplace: t('links.marketplace'),
    doi: t('links.doi'),
    ieee: t('links.ieee'),
    award: t('links.award'),
    certificate: t('links.certificate'),
  })
  const doi = getProjectDoi(project)
  const typeLabel = project.type ? t(`types.${project.type}`) : undefined

  useEffect(() => {
    router.prefetch(localizePath('/', locale))
    projects.forEach((item) => {
      if (item.slug !== project.slug) {
        router.prefetch(localizePath(`/projects/${item.slug}`, locale))
      }
    })
  }, [locale, project.slug, projects, router])

  const nav = (
    <nav className="sticky top-0 z-30 border-b border-[var(--border)]/55 bg-[var(--bg)]/82 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-3 py-2.5 sm:px-5 lg:px-8">
        <Link
          href={localizeHash('#projects', locale)}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-transparent px-2.5 text-sm font-medium text-[var(--fg-muted)] transition-colors hover:border-[var(--border)]/70 hover:bg-[var(--surface)]/55 hover:text-[var(--fg)]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{t('back')}</span>
        </Link>

        {prev && (
          <Link
            href={localizePath(`/projects/${prev.slug}`, locale)}
            className="hidden min-h-10 max-w-44 items-center gap-1.5 rounded-xl px-2.5 text-xs font-medium text-[var(--fg-muted)] transition-colors hover:bg-[var(--surface)]/55 hover:text-[var(--fg)] md:inline-flex"
            aria-label={t('navigation.prev')}
          >
            <ChevronLeftIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{getLocalizedProjectTitle(prev, locale)}</span>
          </Link>
        )}

        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-semibold text-[var(--fg)]">{title}</p>
          <div className="mt-1 hidden items-center justify-center gap-2 sm:flex">
            {typeLabel && (
              <Badge variant={getTypeBadgeVariant(project.type)} className="px-2 py-0.5 text-[10px]">
                {typeLabel}
              </Badge>
            )}
            <span className="truncate text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--fg-muted)]/70">
              {content.status ?? project.period}
            </span>
          </div>
        </div>

        {next && (
          <Link
            href={localizePath(`/projects/${next.slug}`, locale)}
            className="hidden min-h-10 max-w-44 items-center gap-1.5 rounded-xl px-2.5 text-xs font-medium text-[var(--fg-muted)] transition-colors hover:bg-[var(--surface)]/55 hover:text-[var(--fg)] md:inline-flex"
            aria-label={t('navigation.next')}
          >
            <span className="truncate">{getLocalizedProjectTitle(next, locale)}</span>
            <ChevronRightIcon className="h-3.5 w-3.5 shrink-0" />
          </Link>
        )}

      </div>
    </nav>
  )

  return (
    <>
      <ProjectDetailBackground />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.28 }}>
        <ProjectDetailLayout
          nav={nav}
          hero={
            <ProjectDetailHero
              title={title}
              summary={content.summary}
              images={galleryImages}
              typeLabel={typeLabel}
              status={content.status}
              badges={content.badges}
              period={project.period}
              links={detailLinks}
              doi={doi}
            />
          }
          summary={
            <ProjectDetailSummary
              title={t('detail.summaryTitle')}
              body={content.detailSummary}
              roleTitle={t('role')}
              role={content.role}
            />
          }
          milestones={<ProjectMilestones title={t('detail.milestones')} milestones={content.milestones} />}
          tech={<ProjectTechRail title={t('tech')} tech={project.tech} />}
          footer={<ProjectDetailFooter />}
        />
      </motion.div>
    </>
  )
}

function ProjectDetailBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
      style={{
        background: `
          radial-gradient(circle at 18% 22%, rgba(220, 162, 147, 0.035) 0%, transparent 48%),
          radial-gradient(circle at 82% 72%, rgba(210, 182, 161, 0.025) 0%, transparent 52%),
          var(--bg)
        `,
      }}
    />
  )
}
