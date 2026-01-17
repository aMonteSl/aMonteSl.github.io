'use client'

import { motion } from 'framer-motion'
import { useTranslations, useLocale } from '@/i18n'
import { Badge, Button } from '@/components/ui'
import type { Project } from './types'

interface ProjectPageClientProps {
  project: Project
}

export function ProjectPageClient({ project }: ProjectPageClientProps) {
  const t = useTranslations('projects')
  const { locale } = useLocale()

  const highlights = locale === 'es' ? project.highlights_es : project.highlights_en
  const role = locale === 'es' ? project.role_es : project.role_en
  const summary = locale === 'es' ? project.summary_es : project.summary_en

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header with back button */}
      <header className="relative z-10 border-b border-[var(--border)] backdrop-blur-sm bg-[var(--bg)]/80">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="mb-4"
            >
              <span className="mr-2">←</span>
              {t('back')}
            </Button>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--fg)] mb-4"
            >
              {project.title}
            </motion.h1>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Project image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.images.hero}
              alt={project.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-xl"
            />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-[var(--fg)] mb-4">
                  {t('overview')}
                </h2>
                <p className="text-lg text-[var(--fg-muted)] leading-relaxed">
                  {summary}
                </p>
              </motion.section>

              {/* Key highlights */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-[var(--fg)] mb-6">
                  {t('highlights')}
                </h2>
                <ul className="space-y-3">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] mt-2 mr-3 flex-shrink-0" />
                      <p className="text-[var(--fg-muted)]">
                        {highlight}
                      </p>
                    </li>
                  ))}
                </ul>
              </motion.section>

              {/* Role and contributions */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-[var(--fg)] mb-4">
                  {t('role')}
                </h2>
                <p className="text-[var(--fg-muted)]">
                  {role}
                </p>
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-[var(--card)] backdrop-blur-sm rounded-2xl p-6 border border-[var(--border)] sticky top-6"
              >
                {/* Tech stack */}
                <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">
                  {t('tech')}
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Links */}
                {(project.repoUrl || project.demoUrl) && (
                  <>
                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-4">
                      Links
                    </h3>
                    <div className="space-y-3">
                      {project.repoUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => window.open(project.repoUrl, '_blank')}
                        >
                          <span className="mr-2">🔗</span>
                          {t('links.repo')}
                        </Button>
                      )}
                      {project.demoUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => window.open(project.demoUrl, '_blank')}
                        >
                          <span className="mr-2">🚀</span>
                          {t('links.demo')}
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
