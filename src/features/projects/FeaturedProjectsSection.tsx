'use client'

import { Container } from '@/components/ui'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProjectCard } from './ProjectCard'
import { useTranslations, useLocale } from '@/i18n'
import { getLocalizedProject, getProjectImagePaths } from './types'
import projectsData from '@/content/projects.json'
import type { Project } from './types'

export function FeaturedProjectsSection() {
  const t = useTranslations('projects')
  const { locale } = useLocale()

  // Filter featured projects and get localized content
  const featuredProjects = (projectsData as Project[])
    .filter((project) => project.featured)
    .map((project) => ({
      ...getLocalizedProject(project, locale),
      imagePaths: getProjectImagePaths(project),
    }))

  return (
    <section id="projects" className="py-16 sm:py-20 md:py-24 lg:py-32">
      <Container size="xl">
        <SectionHeading
          title={t('title')}
          subtitle={t('subtitle')}
        />

        {/* Projects grid - 2x2 on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              title={project.title}
              summary={project.summary}
              tags={project.tags}
              images={project.imagePaths}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
