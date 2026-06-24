'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, SectionShell } from '@/components/ui'
import { useTranslations, useLocale } from '@/i18n'
import { getLocalizedProjects } from './data'
import { EASING } from '@/lib/motion'
import { FeaturedProjectCard } from './components/FeaturedProjectCard'
import { SecondaryProjectCard } from './components/SecondaryProjectCard'
import { SecondaryProjectsGrid } from './components/SecondaryProjectsGrid'

export function FeaturedProjectsSection() {
  const t = useTranslations('projects')
  const { locale } = useLocale()

  const projects = useMemo(() => {
    return getLocalizedProjects(locale)
  }, [locale])

  const [featuredProject, ...secondaryProjects] = projects

  return (
    <SectionShell id="projects">
      <SectionHeader
        align="left"
        kicker={t('kicker')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className="mx-auto max-w-6xl">
        {featuredProject && (
          <FeaturedProjectCard
            slug={featuredProject.slug}
            title={featuredProject.title}
            summary={featuredProject.summary}
            tags={featuredProject.tags}
            images={featuredProject.imagePaths}
            period={featuredProject.period}
            status={featuredProject.status}
            badges={featuredProject.badges}
            typeLabel={featuredProject.type ? t(`types.${featuredProject.type}`) : undefined}
          />
        )}

        <SecondaryProjectsGrid className="mt-5 sm:mt-6">
          {secondaryProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.35, ease: EASING, delay: index * 0.04 }}
            >
              <SecondaryProjectCard
                slug={project.slug}
                title={project.title}
                summary={project.summary}
                tags={project.tags}
                images={project.imagePaths}
                period={project.period}
                status={project.status}
                badges={project.badges}
                typeLabel={project.type ? t(`types.${project.type}`) : undefined}
                repoUrl={project.repoUrl}
                demoUrl={project.demoUrl}
                index={index + 1}
              />
            </motion.div>
          ))}
        </SecondaryProjectsGrid>
      </div>
    </SectionShell>
  )
}
