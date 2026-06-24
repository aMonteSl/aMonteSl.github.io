'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLinkIcon, GitHubIcon } from '@/components/ui'
import { useLocale, useTranslations } from '@/i18n'
import type { FeaturedProject } from '@/content/featuredProjects'
import { marketplaceStats } from '@/content/marketplaceStats.generated'

function DoiIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
      <path d="M18 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
      <path d="M12 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
      <path d="M12 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
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

interface FeaturedLinkProps {
  href: string
  label: string
  icon: 'github' | 'external' | 'doi'
  title?: string
}

function FeaturedSeparator() {
  return <span className="h-3 w-px bg-white/15" aria-hidden />
}

function FeaturedLink({ href, label, icon, title }: FeaturedLinkProps) {
  const Icon = icon === 'github' ? GitHubIcon : icon === 'doi' ? DoiIcon : ExternalLinkIcon

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
      title={title}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </a>
  )
}

function formatDownloadMetric(locale: string) {
  const displayValue = marketplaceStats.codeXr.displayDownloads.replace('+', '')
  return locale === 'es' ? `+${displayValue} descargas` : `${displayValue}+ downloads`
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
  const { locale } = useLocale()
  const isCodeXr = project.id === 'codeXr'
  const metric = isCodeXr ? formatDownloadMetric(locale) : t(`featuredProject.${project.i18nKey}.metric`)
  const links = [
    project.links?.github && {
      href: project.links.github,
      label: t('featuredProject.github'),
      icon: 'github' as const,
    },
    project.links?.marketplace && {
      href: project.links.marketplace,
      label: t('featuredProject.marketplace'),
      icon: 'external' as const,
    },
    project.links?.doi && {
      href: project.links.doi,
      label: t('links.doi'),
      icon: 'doi' as const,
      title: t('publication'),
    },
    project.links?.docs && {
      href: project.links.docs,
      label: t('featuredProject.docs'),
      icon: 'external' as const,
    },
  ].filter(Boolean) as FeaturedLinkProps[]

  return (
    <div className="relative w-full">
      <div className="absolute -top-3 right-4 z-10">
        <div className="relative">
          <div className="rounded-t-md border border-b-0 border-white/10 bg-white/5 px-3 py-1 ring-1 ring-white/10 backdrop-blur-md">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
              {t('featuredProject.badge')}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />
        </div>
      </div>

      <div
        className="relative flex h-[15.75rem] w-full flex-col rounded-xl border border-white/10 bg-white/5 shadow-lg ring-1 ring-white/10"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onMouseEnter}
        onBlur={onMouseLeave}
      >
        <div className="flex min-h-0 flex-1 p-4 pt-5 sm:p-5 sm:pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={project.id}
              className="flex min-h-0 w-full flex-col"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-7">
                <h4 className="truncate text-lg font-semibold leading-7 text-[var(--fg)]">
                  {t(`featuredProject.${project.i18nKey}.title`)}
                </h4>
              </div>

              <div className="mt-1 h-10">
                <p className="line-clamp-2 text-sm leading-5 text-[var(--fg-muted)]">
                  {t(`featuredProject.${project.i18nKey}.subtitle`)}
                </p>
              </div>

              <div className="mt-2 h-5">
                {isCodeXr && (
                  <p className="truncate text-xs leading-5 text-[var(--accent)]">
                    {t(`featuredProject.${project.i18nKey}.vissoft`)}
                  </p>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="truncate text-xs font-medium text-[var(--accent)]">
                  {metric}
                </span>

                {links.length > 0 ? (
                  <div className="flex min-w-0 shrink-0 flex-wrap items-center justify-end gap-2">
                    {links.map((link, index) => (
                      <span key={link.href} className="inline-flex items-center gap-2">
                        {index > 0 && <FeaturedSeparator />}
                        <FeaturedLink {...link} />
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs italic text-[var(--fg-muted)]/60">
                    {t('featuredProject.internal')}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {total > 1 && (
          <div className="flex h-10 shrink-0 items-center justify-center gap-1.5 border-t border-white/10">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => onDotClick(i)}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  i === activeIndex ? 'scale-110 bg-[var(--accent)]' : 'bg-white/20 hover:bg-white/40'
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
