'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from '@/i18n'
import type { FeaturedProject } from '@/content/featuredProjects'

// Icon components
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

interface FeaturedProjectCardProps {
  project: FeaturedProject
  activeIndex: number
  total: number
  onDotClick: (index: number) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function FeaturedProjectCard({
  project,
  activeIndex,
  total,
  onDotClick,
  onMouseEnter,
  onMouseLeave,
}: FeaturedProjectCardProps) {
  const t = useTranslations('hero')

  const hasLinks = project.links && (project.links.github || project.links.docs)
  const isCodeXr = project.id === 'codeXr'

  return (
    <div className="relative w-full">
      {/* Featured badge - bookmark style */}
      <div className="absolute -top-3 right-4 z-10">
        <div className="relative">
          {/* Badge container with card-matching border and blur */}
          <div className="px-3 py-1 rounded-t-md border border-white/10 border-b-0 bg-white/5 backdrop-blur-md ring-1 ring-white/10 ring-b-0">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--accent)]">
              {t('featuredProject.badge')}
            </span>
          </div>
          {/* Bottom notch for bookmark effect */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5" />
        </div>
      </div>

      {/* Card container */}
      <div
        className="relative w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg ring-1 ring-white/10"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onMouseEnter}
        onBlur={onMouseLeave}
      >

      {/* Fixed height content area */}
      <div className="p-4 sm:p-5 pt-5 sm:pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title — fixed height 28px */}
            <div className="h-7">
              <h4 className="text-lg font-semibold text-[var(--fg)] truncate leading-7">
                {t(`featuredProject.${project.i18nKey}.title`)}
              </h4>
            </div>

            {/* Description — fixed height 40px (2 lines) */}
            <div className="h-10 mt-1">
              <p className="text-sm text-[var(--fg-muted)] leading-5 line-clamp-2">
                {t(`featuredProject.${project.i18nKey}.subtitle`)}
              </p>
            </div>

            {/* VISSOFT row — fixed height 20px */}
            <div className="h-5 mt-2">
              {isCodeXr && (
                <p className="text-xs text-[var(--accent)] truncate leading-5">
                  {t(`featuredProject.${project.i18nKey}.vissoft`)}
                </p>
              )}
            </div>

            {/* Footer — fixed height 20px */}
            <div className="h-5 mt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-[var(--accent)] font-medium truncate">
                {t(`featuredProject.${project.i18nKey}.metric`)}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                {hasLinks ? (
                  <>
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        {t('featuredProject.github')}
                      </a>
                    )}
                    {project.links?.github && project.links?.docs && (
                      <span className="text-white/20">·</span>
                    )}
                    {project.links?.docs && (
                      <a
                        href={project.links.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                      >
                        <ExternalLinkIcon className="w-3.5 h-3.5" />
                        {t('featuredProject.docs')}
                      </a>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-[var(--fg-muted)]/60 italic">
                    {t('featuredProject.internal')}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation dots — separate fixed section */}
      {total > 1 && (
        <div className="h-10 flex items-center justify-center gap-1.5 border-t border-white/10">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => onDotClick(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === activeIndex
                  ? 'bg-[var(--accent)] scale-110'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  </div>
  )
}
