'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useI18n } from '../_i18n/I18nProvider'
import { Badge } from './Badge'
import { shouldAnimate, fadeInUp } from '../_lib/motion'
import projectsData from '../_content/projects.json'

interface Project {
  slug: string
  title: string
  period: string
  summary_en: string
  summary_es: string
  tags: string[]
  repoUrl: string
  demoUrl: string
  images: {
    thumb: string
    hero: string
  }
  highlights_en: string[]
  highlights_es: string[]
  role_en: string
  role_es: string
  tech: string[]
}

export function Projects() {
  const { t, locale } = useI18n()
  const animate = shouldAnimate()
  const projects = projectsData as Project[]

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-fg-muted">{t('projects.empty')}</p>
      </div>
    )
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-3 4xl:grid-cols-4 gap-6 3xl:gap-7 4xl:gap-8"
      style={{ contentVisibility: 'auto' }}
    >
      {projects.map((project, index) => {
        const summary = locale === 'es' ? project.summary_es : project.summary_en
        
        return (
          <motion.div
            key={project.slug}
            {...(animate ? fadeInUp(index * 0.1) : {})}
            className="group"
          >
            <Link 
              href={`/projects/${project.slug}`}
              className="block rounded-2xl bg-[var(--card)] ring-1 ring-[var(--border)] overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg hover:ring-[var(--accent)]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] will-change-transform"
              aria-label={`${t('projects.ctaAll')}: ${project.title}`}
            >
              {/* Project Image */}
              <div className="aspect-[3/2] bg-[var(--border)] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.images.thumb}
                  alt={`${project.title} thumbnail`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              {/* Project Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-fluid-xl font-semibold text-fg line-clamp-2">
                    {project.title}
                  </h3>
                  <span className="text-sm text-fg-muted whitespace-nowrap ml-3">
                    {project.period}
                  </span>
                </div>
                
                {/* Summary */}
                <p className="text-fg-muted mb-4 leading-relaxed line-clamp-3">
                  {summary}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} size="sm" variant="default">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 4 && (
                    <Badge size="sm" variant="outline">
                      +{project.tags.length - 4}
                    </Badge>
                  )}
                </div>
                
                {/* CTA */}
                <div className="flex items-center text-accent text-sm font-medium">
                  {t('projects.ctaAll')}
                  <svg 
                    className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
