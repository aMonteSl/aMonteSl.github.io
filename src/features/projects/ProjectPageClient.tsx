'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from '@/i18n'
import { Badge, ImageCarousel } from '@/components/ui'
import { AnimatedBackground } from '@/features/landing'
import { TechTag } from './components/TechTag'
import { BentoCard } from './components/BentoCard'
import { HighlightCard } from './components/HighlightCard'
import { ProjectFactsPanel } from './components/ProjectFactsPanel'
import { ProjectLinksPanel } from './components/ProjectLinksPanel'
import type { ProjectLink, PublicationInfo } from './components/ProjectLinksPanel'
import type { Project, ProjectType } from './types'
import { getProjectImagePaths } from './types'
import projectsData from '@/content/projects.json'
import { LINKS } from '@/lib/constants'

// ─── Icons ──────────────────────────────────────────────────────────────────

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface ProjectPageClientProps {
  project: Project
}

function getAdjacentProjects(currentSlug: string): { prev: Project | null; next: Project | null } {
  const projects = projectsData as Project[]
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug)
  return {
    prev: currentIndex > 0 ? projects[currentIndex - 1] : null,
    next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null,
  }
}

function getTypeBadgeVariant(type?: ProjectType): 'default' | 'outline' {
  return type === 'openSource' || type === 'personal' ? 'default' : 'outline'
}

/**
 * Build the ordered list of links for ProjectLinksPanel.
 * All project-type-specific logic lives here, keeping sub-components dumb.
 */
function buildProjectLinks(
  project: Project,
  t: ReturnType<typeof useTranslations>,
): ProjectLink[] {
  const links: ProjectLink[] = []

  if (project.repoUrl) {
    links.push({ label: t('links.repo'), url: project.repoUrl, icon: 'github' })
  }
  if (project.demoUrl) {
    links.push({ label: t('links.web'), url: project.demoUrl, icon: 'external' })
  }

  // ── Code-XR extra links ──
  // Add new project-specific blocks here as the portfolio grows.
  if (project.slug === 'code-xr') {
    links.push({ label: t('links.marketplace'), url: LINKS.codeXrMarketplace, icon: 'external' })
    links.push({ label: t('links.doi'), url: LINKS.codeXrDoi, icon: 'external' })
    links.push({ label: t('links.ieee'), url: LINKS.codeXrIeee, icon: 'external' })
  }

  return links
}

/**
 * Build optional publication metadata. Returns undefined for projects
 * without academic publications.
 */
function buildPublication(project: Project): PublicationInfo | undefined {
  if (project.slug === 'code-xr') {
    return {
      venue: 'VISSOFT @ ICSME 2025 (IEEE)',
      doi: '10.1109/VISSOFT67405.2025.00034',
      doiUrl: LINKS.codeXrDoi,
    }
  }
  return undefined
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProjectPageClient({ project }: ProjectPageClientProps) {
  const t = useTranslations('projects')
  const { locale } = useLocale()

  const highlights = locale === 'es' ? project.highlights_es : project.highlights_en
  const role      = locale === 'es' ? project.role_es      : project.role_en
  const summary   = locale === 'es' ? project.summary_es   : project.summary_en

  const { prev, next } = getAdjacentProjects(project.slug)
  const galleryImages  = getProjectImagePaths(project)
  const projectLinks   = buildProjectLinks(project, t)
  const publication    = buildPublication(project)
  const hasLinks       = projectLinks.length > 0 || !!publication

  return (
    <>
      <AnimatedBackground />

      {/*
       * PAGE WRAPPER
       * lg+: fills exactly the viewport height (no page scroll).
       * < lg: natural flex-col with page scroll.
       */}
      <div className="flex flex-col lg:h-dvh">

        {/* ── Navigation bar ──────────────────────────────────────────────── */}
        <nav className="sticky top-0 z-20 flex-shrink-0 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--border)]/50">
          <div className="px-3 py-2">
            <div className="flex items-center gap-2">

              {/* Left zone: back + previous */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link
                  href="/#projects"
                  className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card)] transition-all"
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('back')}</span>
                </Link>

                {prev && (
                  <>
                    <span className="text-[var(--border)] select-none">·</span>
                    <Link
                      href={`/projects/${prev.slug}`}
                      className="hidden md:inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card)] transition-all max-w-[140px]"
                    >
                      <ChevronLeftIcon className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{prev.title}</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Center zone: title + period */}
              <div className="flex-1 min-w-0 text-center px-2">
                <p className="text-sm font-semibold text-[var(--fg)] truncate leading-tight">
                  {project.title}
                </p>
                <p className="text-[10px] text-[var(--fg-muted)] hidden sm:block">
                  {project.period}
                </p>
              </div>

              {/* Right zone: next + badge + action icons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {next && (
                  <>
                    <Link
                      href={`/projects/${next.slug}`}
                      className="hidden md:inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card)] transition-all max-w-[140px]"
                    >
                      <span className="truncate">{next.title}</span>
                      <ChevronRightIcon className="w-3 h-3 flex-shrink-0" />
                    </Link>
                    <span className="hidden md:block text-[var(--border)] select-none">·</span>
                  </>
                )}

                {project.type && (
                  <Badge
                    variant={getTypeBadgeVariant(project.type)}
                    className="text-[10px] px-2 py-0.5 hidden sm:inline-flex"
                  >
                    {t(`types.${project.type}`)}
                  </Badge>
                )}

                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card)] transition-all"
                    title={t('links.repo')}
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card)] transition-all"
                    title={t('links.web')}
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* ── Bento grid ──────────────────────────────────────────────────── */}
        {/*
         * DESKTOP (lg+):
         *   3 columns  →  [5fr carousel | 4fr text | 3fr sidebar]
         *   4 rows     →  [1fr overview/facts | 1fr role/links | auto highlights | auto tech]
         *   All cells fill the remaining viewport height (flex-1 + min-h-0).
         *
         * MOBILE (< lg):
         *   Plain vertical flex, page scrolls naturally.
         */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={[
            /* shared */
            'flex-1 min-h-0 p-3 gap-2.5',
            /* mobile: vertical stack */
            'flex flex-col',
            /* desktop: bento grid */
            'lg:grid lg:grid-cols-[5fr_4fr_3fr]',
            'lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]',
          ].join(' ')}
        >

          {/* ── Carousel ── col 1, rows 1-2 ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className={[
              'rounded-xl overflow-hidden',
              'h-52 sm:h-64',                   // mobile fixed height
              'lg:h-auto',                       // desktop: fills grid rows
              'lg:col-start-1 lg:col-end-2',
              'lg:row-start-1 lg:row-end-3',
            ].join(' ')}
          >
            <ImageCarousel
              images={galleryImages}
              alt={project.title}
              interval={7000}
              aspectRatio=""
              objectFit="contain"
              showProgress
              showCounter
              showDots={galleryImages.length > 1}
              showArrows={galleryImages.length > 1}
              keyboardNavigation
              rounded={false}
              className="h-full w-full"
            />
          </motion.div>

          {/* ── Overview ── col 2, row 1 ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className={`${
              !hasLinks
                ? 'lg:col-start-2 lg:col-end-4'  // Expand to 2 cols when no links
                : 'lg:col-start-2 lg:col-end-3'  // Normal 1 col
            } lg:row-start-1 lg:row-end-2 min-h-0`}
          >
            <BentoCard label={t('overview')} scrollable className="h-full">
              {/* Meta chips: type + period */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.type && (
                  <Badge
                    variant={getTypeBadgeVariant(project.type)}
                    className="text-[10px] px-2 py-0.5"
                  >
                    {t(`types.${project.type}`)}
                  </Badge>
                )}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--border)]/40 text-[10px] text-[var(--fg-muted)] font-medium">
                  {project.period}
                </span>
              </div>
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{summary}</p>
            </BentoCard>
          </motion.div>

          {/* ── Role ── col 2, row 2 ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className={`${
              !hasLinks
                ? 'lg:col-start-2 lg:col-end-4'  // Expand to 2 cols when no links
                : 'lg:col-start-2 lg:col-end-3'  // Normal 1 col
            } lg:row-start-2 lg:row-end-3 min-h-0`}
          >
            <BentoCard label={t('role')} scrollable className="h-full">
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{role}</p>
              {project.supervisorName && project.supervisorUrl && (
                <p className="text-xs text-[var(--fg-muted)]/60 mt-3 pt-2.5 border-t border-[var(--border)]/40">
                  Supervisor:{' '}
                  <a
                    href={project.supervisorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)]/70 hover:text-[var(--accent)] hover:underline underline-offset-2 transition-colors"
                  >
                    {project.supervisorName}
                  </a>
                </p>
              )}
            </BentoCard>
          </motion.div>

          {/* ── Links + Publication ── col 3, rows 1-2 (full right column) ── */}
          {hasLinks && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-3 min-h-0"
            >
              <BentoCard label={t('linksTitle')} scrollable className="h-full">
                <ProjectLinksPanel links={projectLinks} publication={publication} />
              </BentoCard>
            </motion.div>
          )}

          {/* ── Highlights ── cols 1-3, row 3 ───────────────────────────── */}
          {highlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              className={[
                'flex flex-col gap-2 sm:flex-row',
                'lg:col-start-1 lg:col-end-4 lg:row-start-3 lg:row-end-4',
              ].join(' ')}
            >
              {highlights.map((h, i) => (
                <HighlightCard key={i} highlight={h} index={i} />
              ))}
            </motion.div>
          )}

          {/* ── Tech strip ── cols 1-3, row 4 ───────────────────────────── */}
          {project.tech.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.35 }}
              className={[
                'lg:col-start-1 lg:col-end-4 lg:row-start-4 lg:row-end-5',
              ].join(' ')}
            >
              <BentoCard label={t('tech')} noPadding className="py-3">
                <div className="px-4 flex flex-wrap gap-2 lg:flex-nowrap lg:overflow-x-auto lg:gap-1.5 pb-0.5">
                  {project.tech.map((tech) => (
                    <TechTag key={tech} tech={tech} />
                  ))}
                </div>
              </BentoCard>
            </motion.div>
          )}

        </motion.main>
      </div>
    </>
  )
}
