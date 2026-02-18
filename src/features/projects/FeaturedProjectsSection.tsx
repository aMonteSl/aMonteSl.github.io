'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/ui'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProjectCard } from './ProjectCard'
import { useTranslations, useLocale } from '@/i18n'
import { getLocalizedProject, getProjectImagePaths } from './types'
import projectsData from '@/content/projects.json'
import type { Project, ProjectType } from './types'
import { EASING } from '@/lib/motion'

const PROJECT_TYPES: Array<ProjectType | 'all'> = ['all', 'openSource', 'personal', 'academic', 'internal']

export function FeaturedProjectsSection() {
  const t = useTranslations('projects')
  const tf = useTranslations('projectFilters')
  const { locale } = useLocale()
  const [activeFilter, setActiveFilter] = useState<ProjectType | 'all'>('all')

  // All projects localized
  const allProjects = useMemo(() => {
    return (projectsData as Project[]).map((project) => ({
      ...getLocalizedProject(project, locale),
      imagePaths: getProjectImagePaths(project),
    }))
  }, [locale])

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return allProjects
    return allProjects.filter((p) => p.type === activeFilter)
  }, [allProjects, activeFilter])

  // Only show filter buttons for types that have projects
  const availableTypes = useMemo(() => {
    const typesWithProjects = new Set(allProjects.map(p => p.type).filter(Boolean))
    return PROJECT_TYPES.filter(t => t === 'all' || typesWithProjects.has(t))
  }, [allProjects])

  return (
    <section id="projects" className="py-16 sm:py-20 md:py-24 lg:py-32">
      <Container size="xl">
        <SectionHeading
          title={t('title')}
          subtitle={t('subtitle')}
        />

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10">
          {availableTypes.map((type) => (
            <motion.button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                activeFilter === type
                  ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]'
                  : 'bg-[var(--card)] text-[var(--fg-muted)] border-[var(--border)] hover:border-[var(--accent)]/40 hover:text-[var(--fg)]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tf(type)}
            </motion.button>
          ))}
        </div>

        {/* Result count */}
        <p className="text-center text-xs text-[var(--fg-muted)]/60 mb-6">
          {tf('showing', { count: filteredProjects.length })}
        </p>

        {/* Projects grid - 2x2 on large screens */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: EASING }}
              >
                <ProjectCard
                  slug={project.slug}
                  title={project.title}
                  summary={project.summary}
                  tags={project.tags}
                  images={project.imagePaths}
                  repoUrl={project.repoUrl}
                  demoUrl={project.demoUrl}
                  index={index}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  )
}
