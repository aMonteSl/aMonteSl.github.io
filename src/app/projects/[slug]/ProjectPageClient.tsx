'use client'

import { motion } from 'framer-motion'
import { useI18n } from '../../_i18n/I18nProvider'
import { Badge } from '../../_components/Badge'
import { Button } from '../../_components/Button'

interface Project {
  id: number
  slug: string
  title: string
  summary_en: string
  summary_es: string
  description_en: string
  description_es: string
  image: string
  tech: string[]
  highlights_en: string[]
  highlights_es: string[]
  role_en: string
  role_es: string
  links?: {
    github?: string
    demo?: string
    live?: string
  }
}

interface ProjectPageClientProps {
  project: Project
}

export default function ProjectPageClient({ project }: ProjectPageClientProps) {
  const { locale, t } = useI18n()
  
  const description = locale === 'es' ? project.description_es : project.description_en
  const highlights = locale === 'es' ? project.highlights_es : project.highlights_en
  const role = locale === 'es' ? project.role_es : project.role_en

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header with back button */}
      <header className="relative z-10 border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
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
              className="mb-4 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="mr-2">←</span>
              {t('projects.back')}
            </Button>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4"
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
              src={project.image}
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  {t('projects.overview')}
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    {description}
                  </p>
                </div>
              </motion.section>

              {/* Key highlights */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                  {t('projects.highlights')}
                </h2>
                <ul className="space-y-3">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0" />
                      <p className="text-slate-600 dark:text-slate-300">
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  {t('projects.role')}
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300">
                    {role}
                  </p>
                </div>
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 sticky top-6"
              >
                {/* Tech stack */}
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  {t('projects.tech')}
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Links */}
                {project.links && (
                  <>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                      {t('projects.links')}
                    </h3>
                    <div className="space-y-3">
                      {project.links.github && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => window.open(project.links!.github, '_blank')}
                        >
                          <span className="mr-2">🔗</span>
                          GitHub
                        </Button>
                      )}
                      {project.links.demo && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => window.open(project.links!.demo, '_blank')}
                        >
                          <span className="mr-2">🚀</span>
                          Demo
                        </Button>
                      )}
                      {project.links.live && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => window.open(project.links!.live, '_blank')}
                        >
                          <span className="mr-2">🌐</span>
                          Live Site
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
