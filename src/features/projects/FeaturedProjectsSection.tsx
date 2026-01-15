'use client'

import { Container } from '@/components/ui'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProjectCard } from './ProjectCard'
import { useTranslations, useLocale } from '@/i18n'
import projectsData from '@/content/projects.json'

export function FeaturedProjectsSection() {
  const t = useTranslations('projects')
  const { locale } = useLocale()

  // Get localized summaries
  const projects = projectsData.map((project) => ({
    ...project,
    summary: locale === 'es' ? project.summary_es : project.summary_en,
  }))

  return (
    <section id="projects" className="py-16 sm:py-20 md:py-24 lg:py-32">
      <Container size="xl">
        <SectionHeading
          title={t('title')}
          subtitle={t('subtitle')}
        />

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              title={project.title}
              summary={project.summary}
              tags={project.tags}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
