'use client'

import { motion } from 'framer-motion'
import { ExternalLinkIcon, GitHubIcon, PauseIcon, PlayIcon } from '@/components/ui'
import { useLocale, useTranslations } from '@/i18n'
import type { FeaturedProject } from '@/content/featuredProjects'
import { marketplaceStats } from '@/content/marketplaceStats.generated'
import { cn } from '@/lib/utils'

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
  projects: readonly FeaturedProject[]
  activeIndex: number
  progress: number
  isPaused: boolean
  isUserPaused: boolean
  onDotClick: (index: number) => void
  onTogglePause: () => void
  /** Transient pause while the pointer hovers the card or keyboard focus is inside it. */
  onPause: () => void
  onResume: () => void
}

/**
 * Keyboard focus inside the card pauses the rotation; focus that a tap or click leaves behind must not,
 * otherwise the pause sticks on touch (the toggle would then never resume).
 */
function isKeyboardFocus(target: EventTarget): boolean {
  if (!(target instanceof Element)) return false
  try {
    return target.matches(':focus-visible')
  } catch {
    // Browsers without :focus-visible (Safari < 15.4): keep the previous behaviour and pause on any focus.
    return true
  }
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
      // The pseudo-element grows the 16px line box to a 40px hit area without changing the visual size of the link.
      // Its 12px vertical overhang must stay <= the row gap of the links group so it never covers a neighbouring link's text.
      className="relative inline-flex items-center gap-1.5 text-xs font-medium text-[var(--fg-muted)] transition-colors before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[''] hover:text-[var(--fg)]"
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

interface FeaturedProjectPanelProps {
  project: FeaturedProject
  isActive: boolean
  /** Horizontal offset (px) the panel rests at while inactive, so it slides in from that side. */
  restingOffset: number
}

function FeaturedProjectPanel({ project, isActive, restingOffset }: FeaturedProjectPanelProps) {
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
    <motion.div
      className={cn('col-start-1 row-start-1 flex min-w-0 flex-col', !isActive && 'pointer-events-none')}
      initial={false}
      animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : restingOffset }}
      transition={{ duration: 0.3 }}
      inert={!isActive}
      aria-hidden={isActive ? undefined : true}
    >
      <h4 className="truncate text-lg font-semibold leading-7 text-[var(--fg)]">
        {t(`featuredProject.${project.i18nKey}.title`)}
      </h4>

      <p className="mt-1 line-clamp-4 text-sm leading-5 text-[var(--fg-muted)] sm:line-clamp-3">
        {t(`featuredProject.${project.i18nKey}.subtitle`)}
      </p>

      {isCodeXr && (
        <p className="mt-2 truncate text-xs leading-5 text-[var(--accent)]">
          {t(`featuredProject.${project.i18nKey}.vissoft`)}
        </p>
      )}

      {/* 12px gaps match the links' hit-area overhang, so a wrapped link never claims the text above or below it. */}
      <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <span className="max-w-full truncate text-xs font-medium text-[var(--accent)]">
          {metric}
        </span>

        {links.length > 0 ? (
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-3 sm:justify-end">
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
  )
}

export function FeaturedProjectCard({
  projects,
  activeIndex,
  progress,
  isPaused,
  isUserPaused,
  onDotClick,
  onTogglePause,
  onPause,
  onResume,
}: FeaturedProjectCardProps) {
  const t = useTranslations('hero')
  const total = projects.length
  const pauseLabel = isUserPaused ? t('featuredProject.resumeRotation') : t('featuredProject.pauseRotation')

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
        className="relative flex min-h-[15.75rem] w-full flex-col rounded-xl border border-white/10 bg-white/5 shadow-lg ring-1 ring-white/10"
        // Real hover only: taps synthesize mouseenter without a matching mouseleave, which would leave the card paused.
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') onPause()
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') onResume()
        }}
        onFocus={(event) => {
          if (isKeyboardFocus(event.target)) onPause()
        }}
        onBlur={onResume}
      >
        {/* Stacked grid: every project shares the same cell, so the card is as tall as the tallest one at any width. */}
        <div className="grid min-h-0 flex-1 grid-cols-1 p-4 pt-5 sm:p-5 sm:pt-6">
          {projects.map((project, index) => (
            <FeaturedProjectPanel
              key={project.id}
              project={project}
              isActive={index === activeIndex}
              restingOffset={index < activeIndex ? -10 : 10}
            />
          ))}
        </div>

        {total > 1 && (
          <div className="relative flex h-11 shrink-0 items-center justify-center border-t border-white/10">
            <div className="absolute left-0 right-0 top-0 h-0.5 overflow-hidden bg-black/20" aria-hidden>
              <div
                className={cn(
                  'h-full origin-left transition-colors duration-200',
                  isPaused ? 'bg-red-500' : 'bg-[var(--accent)]'
                )}
                style={{ transform: `scaleX(${Math.min(1, Math.max(0, progress))})` }}
              />
            </div>

            <div className="flex items-center justify-center">
              {projects.map((project, index) => {
                const isActive = index === activeIndex
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => onDotClick(index)}
                    className="group flex h-11 w-7 items-center justify-center"
                    aria-label={t('featuredProject.goTo', { index: index + 1 })}
                    aria-current={isActive || undefined}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'h-2 w-2 rounded-full transition-all duration-200',
                        isActive ? 'scale-110 bg-[var(--accent)]' : 'bg-white/20 group-hover:bg-white/40'
                      )}
                    />
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={onTogglePause}
              // Tabbing onto the toggle itself is not a reason to pause: the toggle is the control for that.
              onFocus={(event) => event.stopPropagation()}
              aria-pressed={isUserPaused}
              aria-label={pauseLabel}
              title={pauseLabel}
              className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              {isUserPaused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
