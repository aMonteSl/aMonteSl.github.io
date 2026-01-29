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
  highlights?: Array<{ label: string; year: number }>
  /** Tech/skill tags */
  tags?: string[]
  /** Optional external link */
  link?: string
  /** Is this entry ongoing? */
  isOngoing?: boolean
  /** Additional className */
  className?: string
}

const accentMap: Record<JourneyLane, string> = {
  education: 'from-blue-500/20 via-blue-500/5',
  work: 'from-emerald-500/20 via-emerald-500/5',
  project: 'from-violet-500/20 via-violet-500/5',
  achievement: 'from-amber-500/20 via-amber-500/5',
}

const borderMap: Record<JourneyLane, string> = {
  education: 'border-blue-500/40',
  work: 'border-emerald-500/40',
  project: 'border-violet-500/40',
  achievement: 'border-amber-500/40',
}

const dotMap: Record<JourneyLane, string> = {
  education: 'bg-blue-500',
  work: 'bg-emerald-500',
  project: 'bg-violet-500',
  achievement: 'bg-amber-500',
}

/**
 * StreamCard - Displays detailed info for a journey entry
 * Polished glassmorphism design
 */
export function StreamCard({
  lane,
  title,
  organization,
  period,
  description,
  highlights = [],
  tags = [],
  link,
  isOngoing = false,
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
        'relative overflow-hidden rounded-xl',
        'bg-gradient-to-r to-transparent',
        accentMap[lane],
        'ring-1 ring-[var(--border)]/30',
        'backdrop-blur-sm',
        'transition-all duration-300',
        link && 'cursor-pointer hover:ring-[var(--border)]/60 hover:shadow-lg hover:shadow-black/20',
        className
      )}
    >
      {/* Left accent border */}
      <div className={cn('absolute left-0 top-0 bottom-0 w-1 rounded-l-xl', dotMap[lane])} />

      <div className="p-5 pl-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h4 className="text-base sm:text-lg font-semibold text-[var(--fg)] leading-tight mb-1">
              {title}
            </h4>
            {/* Organization */}
            <p className="text-sm text-[var(--fg-muted)]">
              {organization}
            </p>
          </div>

          {/* Period badge */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-medium',
              'bg-[var(--bg)]/50 text-[var(--fg-muted)] ring-1 ring-[var(--border)]/30'
            )}>
              {period}
            </span>
            {isOngoing && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En curso
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-4">
          {description}
        </p>

        {/* Highlights (matrículas) */}
        {highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {highlights.map((h) => (
              <span
                key={h.label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-medium"
              >
                <span>🏆</span>
                <span>{h.label}</span>
              </span>
            ))}
          </div>
        )}

        {/* Tags + Link */}
        <div className="flex items-center justify-between gap-4">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="default" className="text-xs px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {link && (
            <span className="flex items-center gap-1 text-xs text-[var(--accent)] font-medium whitespace-nowrap">
              <span>Ver más</span>
              <span>→</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )

  if (!animate) {
    return <Wrapper {...wrapperProps}>{content}</Wrapper>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Wrapper {...wrapperProps}>{content}</Wrapper>
    </motion.div>
  )
}
