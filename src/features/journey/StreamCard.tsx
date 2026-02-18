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
        <div className="flex items-start justify-between gap-4 mb-2">
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
          <div className="flex items-center gap-2 flex-shrink-0">
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
                En curso
              </span>
            )}
          </div>
        </div>

        {/* Description - limited to 2 lines */}
        <p className="text-sm text-[var(--fg-muted)] leading-relaxed line-clamp-2 mb-3 flex-shrink-0">
          {description}
        </p>

        {/* Bottom row: highlights, tags, link */}
        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
            {/* Highlights (matrículas) */}
            {highlights.length > 0 && (
              <div className="flex gap-1.5 flex-shrink-0">
                {highlights.slice(0, 2).map((h) => (
                  <span
                    key={h.label}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-medium"
                    title={h.label}
                  >
                    <span className="truncate max-w-[100px]">{h.label}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex gap-1 flex-shrink overflow-hidden">
                {tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="default" className="text-xs px-2 py-0.5 whitespace-nowrap">
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <span className="text-xs text-[var(--fg-muted)]/50 self-center">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {link && (
            <motion.span 
              className="flex items-center gap-1 text-xs text-[var(--accent)] font-medium whitespace-nowrap flex-shrink-0"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
            >
              <span>Ver más</span>
              <span>→</span>
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
