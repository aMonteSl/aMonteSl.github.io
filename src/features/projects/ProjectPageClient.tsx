'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from '@/i18n'
import { Badge, Button } from '@/components/ui'
import { AnimatedBackground } from '@/features/landing'
import { ProjectImageCarousel } from './components/ProjectImageCarousel'
import type { Project, ProjectType } from './types'
import projectsData from '@/content/projects.json'

// Icons
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

interface ProjectPageClientProps {
  project: Project
}

// Helper to get adjacent projects
function getAdjacentProjects(currentSlug: string): { prev: Project | null; next: Project | null } {
  const projects = projectsData as Project[]
  const currentIndex = projects.findIndex(p => p.slug === currentSlug)
  
  return {
    prev: currentIndex > 0 ? projects[currentIndex - 1] : null,
    next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null,
  }
}

// Type badge color mapping
function getTypeBadgeVariant(type?: ProjectType): 'default' | 'outline' {
  switch (type) {
    case 'openSource':
    case 'personal':
      return 'default'
    default:
      return 'outline'
  }
}

export function ProjectPageClient({ project }: ProjectPageClientProps) {
  const t = useTranslations('projects')
  const { locale } = useLocale()

  const highlights = locale === 'es' ? project.highlights_es : project.highlights_en
  const role = locale === 'es' ? project.role_es : project.role_en
  const summary = locale === 'es' ? project.summary_es : project.summary_en
  const { prev, next } = getAdjacentProjects(project.slug)

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen">
        {/* Top navigation bar */}
        <nav className="sticky top-0 z-20 backdrop-blur-md bg-[var(--bg)]/70 border-b border-[var(--border)]/50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Back button */}
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{t('back')}</span>
              </Link>

              {/* Right side: type badge + links */}
              <div className="flex items-center gap-3">
                {/* Project type badge */}
                {project.type && (
                  <Badge variant={getTypeBadgeVariant(project.type)} className="text-xs">
                    {t(`types.${project.type}`)}
                  </Badge>
                )}

                {/* Quick links */}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card)] transition-all"
                    title={t('links.repo')}
                  >
                    <GithubIcon className="w-5 h-5" />
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card)] transition-all"
                    title={t('links.demo')}
                  >
                    <ExternalLinkIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto">
            {/* Project title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--fg)] mb-3">
                {project.title}
              </h1>
              <p className="text-lg text-[var(--fg-muted)]">
                {project.period}
              </p>
            </motion.div>

            {/* Image carousel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-12"
            >
              <ProjectImageCarousel
                basePath={project.imageDir}
                images={project.images}
                altBase={project.title}
                autoplayMs={7000}
                className="shadow-2xl"
              />
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Main content column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Overview */}
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-[var(--fg)] mb-4">
                    {t('overview')}
                  </h2>
                  <p className="text-lg text-[var(--fg-muted)] leading-relaxed">
                    {summary}
                  </p>
                </motion.section>

                {/* Highlights */}
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-[var(--fg)] mb-6">
                    {t('highlights')}
                  </h2>
                  <ul className="space-y-4">
                    {highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[var(--accent)] mt-2.5 flex-shrink-0" />
                        <p className="text-[var(--fg-muted)] leading-relaxed">
                          {highlight}
                        </p>
                      </li>
                    ))}
                  </ul>
                </motion.section>

                {/* Role */}
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-[var(--fg)] mb-4">
                    {t('role')}
                  </h2>
                  <p className="text-[var(--fg-muted)] leading-relaxed">
                    {role}
                  </p>
                </motion.section>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-6"
                >
                  {/* Quick facts card */}
                  <div className="bg-[var(--card)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--border)] space-y-4">
                    <h3 className="text-lg font-semibold text-[var(--fg)]">
                      {t('quickFacts.title')}
                    </h3>
                    <dl className="space-y-3 text-sm">
                      {project.type && (
                        <div className="flex justify-between">
                          <dt className="text-[var(--fg-muted)]">{t('quickFacts.type')}</dt>
                          <dd className="text-[var(--fg)] font-medium">{t(`types.${project.type}`)}</dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-[var(--fg-muted)]">{t('quickFacts.period')}</dt>
                        <dd className="text-[var(--fg)] font-medium">{project.period}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Tech stack card */}
                  <div className="bg-[var(--card)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--border)]">
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">
                      {t('tech')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Links card (if any) */}
                  {(project.repoUrl || project.demoUrl) && (
                    <div className="bg-[var(--card)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--border)]">
                      <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">
                        Links
                      </h3>
                      <div className="flex flex-col gap-3">
                        {project.repoUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start gap-2"
                            onClick={() => window.open(project.repoUrl, '_blank')}
                          >
                            <GithubIcon className="w-4 h-4" />
                            {t('links.repo')}
                          </Button>
                        )}
                        {project.demoUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start gap-2"
                            onClick={() => window.open(project.demoUrl, '_blank')}
                          >
                            <ExternalLinkIcon className="w-4 h-4" />
                            {t('links.demo')}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Prev/Next navigation */}
            {(prev || next) && (
              <motion.nav
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-16 pt-8 border-t border-[var(--border)]"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Previous project */}
                  <div>
                    {prev && (
                      <Link
                        href={`/projects/${prev.slug}`}
                        className="group flex flex-col p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--card)]/50 transition-all"
                      >
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--fg-muted)] mb-1">
                          <ChevronLeftIcon className="w-3 h-3" />
                          {t('navigation.prev')}
                        </span>
                        <span className="text-sm font-medium text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                          {prev.title}
                        </span>
                      </Link>
                    )}
                  </div>

                  {/* Next project */}
                  <div className="flex justify-end">
                    {next && (
                      <Link
                        href={`/projects/${next.slug}`}
                        className="group flex flex-col items-end p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--card)]/50 transition-all"
                      >
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--fg-muted)] mb-1">
                          {t('navigation.next')}
                          <ChevronRightIcon className="w-3 h-3" />
                        </span>
                        <span className="text-sm font-medium text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                          {next.title}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.nav>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
