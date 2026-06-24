'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { shouldAnimate } from '@/lib/motion'
import { Badge } from '@/components/ui'
import type { JourneyLane } from './types'

interface StreamCardProps {
  /** Lane type for accent color */
  lane: JourneyLane
  /** Main title (role/achievement) */
  title: string
  /** Organization/context */
  organization: string
  /** Time period display string */
  period: string
  /** Description text */
  description: string
  /** Nested highlights */
  highlights?: Array<{ id: string; label: string; year: number; date?: string }>
  /** Highlight currently selected from the timeline */
  activeHighlight?: { id: string; label: string; date: string; lane: JourneyLane } | null
  /** Label for the selected highlight block */
  activeHighlightLabel?: string
  /** Tech/skill tags */
  tags?: string[]
  /** Optional external link */
  link?: string
  /** Is this entry ongoing? */
  isOngoing?: boolean
  /** Localized ongoing status label */
  ongoingLabel?: string
  /** Localized external link label */
  moreLabel?: string
  /** Additional className */
  className?: string
}

const accentMap: Record<JourneyLane, string> = {
  education: 'from-blue-500/20 via-blue-500/5',
  work: 'from-emerald-500/20 via-emerald-500/5',
  project: 'from-violet-500/20 via-violet-500/5',
  achievement: 'from-amber-500/20 via-amber-500/5',
  learning: 'from-pink-500/20 via-pink-500/5',
}

const dotMap: Record<JourneyLane, string> = {
  education: 'bg-blue-500',
  work: 'bg-emerald-500',
  project: 'bg-violet-500',
  achievement: 'bg-amber-500',
  learning: 'bg-pink-500',
}

const glowMap: Record<JourneyLane, string> = {
  education: 'hover:shadow-blue-500/20',
  work: 'hover:shadow-emerald-500/20',
  project: 'hover:shadow-violet-500/20',
  achievement: 'hover:shadow-amber-500/20',
  learning: 'hover:shadow-pink-500/20',
}

const selectedHighlightMap: Record<JourneyLane, string> = {
  education: 'border-blue-300/45 bg-blue-500/10 text-blue-100',
  work: 'border-emerald-300/45 bg-emerald-500/10 text-emerald-100',
  project: 'border-violet-300/50 bg-violet-500/12 text-violet-100',
  achievement: 'border-amber-300/55 bg-amber-500/12 text-amber-100',
  learning: 'border-pink-300/50 bg-pink-500/12 text-pink-100',
}

/**
 * StreamCard - Fixed height detail card for journey entries
 * Clean design with accent border and subtle gradients
 */
export function StreamCard({
  lane,
  title,
  organization,
  period,
  description,
  highlights = [],
  activeHighlight = null,
  activeHighlightLabel = 'Selected milestone',
  tags = [],
  link,
  isOngoing = false,
  ongoingLabel = 'Active',
  moreLabel = 'View more',
  className,
}: StreamCardProps) {
  const animate = shouldAnimate()

  const Wrapper = link ? 'a' : 'div'
  const wrapperProps = link
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  const content = (
    <div
      className={cn(
        'relative h-full overflow-hidden rounded-xl',
        'bg-gradient-to-r to-transparent',
        accentMap[lane],
        'ring-1 ring-[var(--border)]/30',
        'backdrop-blur-sm',
        'transition-all duration-300',
        link && ['cursor-pointer hover:ring-[var(--border)]/50 hover:shadow-xl', glowMap[lane]],
        className
      )}
    >
      {/* Left accent border */}
      <div className={cn('absolute left-0 top-0 bottom-0 w-1 rounded-l-xl', dotMap[lane])} />

      <div className="h-full p-5 pl-6 flex flex-col">
        {/* Header row */}
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h4 className="text-base sm:text-lg font-semibold text-[var(--fg)] leading-tight mb-0.5 truncate">
              {title}
            </h4>
            {/* Organization */}
            <p className="text-sm text-[var(--fg-muted)] truncate">
              {organization}
            </p>
          </div>

          {/* Period badge */}
          <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-medium',
              'bg-[var(--bg)]/50 text-[var(--fg-muted)] ring-1 ring-[var(--border)]/30'
            )}>
              {period}
            </span>
            {isOngoing && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium">
                <motion.span 
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                {ongoingLabel}
              </span>
            )}
          </div>
        </div>

        {/* Description - limited to 2 lines */}
        <p className="text-sm text-[var(--fg-muted)] leading-relaxed line-clamp-2 mb-3 flex-shrink-0">
          {description}
        </p>

        {activeHighlight && (
          <div
            className={cn(
              'mb-3 rounded-lg border px-3 py-2',
              selectedHighlightMap[activeHighlight.lane]
            )}
          >
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] opacity-70">
              {activeHighlightLabel}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold leading-snug">
                {activeHighlight.label}
              </span>
              <span className="rounded-full bg-[var(--bg)]/55 px-2 py-0.5 text-[0.68rem] font-medium text-[var(--fg-muted)] ring-1 ring-[var(--border)]/35">
                {activeHighlight.date}
              </span>
            </div>
          </div>
        )}

        {/* Bottom row: highlights, tags, link */}
        <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {/* Highlights (matrículas) */}
            {highlights.length > 0 && (
              <>
                {highlights.slice(0, 4).map((h) => (
                  <span
                    key={h.id}
                    className={cn(
                      'inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium leading-snug ring-1',
                      activeHighlight?.id === h.id
                        ? 'bg-amber-500/18 text-amber-100 ring-amber-200/55 shadow-[0_0_14px_rgba(251,191,36,0.18)]'
                        : 'bg-amber-500/10 text-amber-300 ring-amber-300/20'
                    )}
                    title={h.date ? `${h.label} - ${h.date}` : h.label}
                  >
                    <span className="min-w-0 truncate">{h.label}</span>
                    {h.date && activeHighlight?.id === h.id && (
                      <span className="shrink-0 text-[0.62rem] opacity-75">{h.date}</span>
                    )}
                  </span>
                ))}
              </>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <>
                {tags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="default" className="text-xs px-2 py-0.5 whitespace-nowrap">
                    {tag}
                  </Badge>
                ))}
                {tags.length > 5 && (
                  <span className="text-xs text-[var(--fg-muted)]/50 self-center">
                    +{tags.length - 5}
                  </span>
                )}
              </>
            )}
          </div>

          {link && (
            <motion.span 
              className="flex flex-shrink-0 items-center gap-1 self-end whitespace-nowrap text-xs font-medium text-[var(--accent)]"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
            >
              <span>{moreLabel}</span>
              <span aria-hidden="true">&rarr;</span>
            </motion.span>
          )}
        </div>
      </div>
    </div>
  )

  if (!animate) {
    return (
      <Wrapper {...wrapperProps} className="block h-full">
        {content}
      </Wrapper>
    )
  }

  return (
    <Wrapper {...wrapperProps} className="block h-full">
      {content}
    </Wrapper>
  )
}
