'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui'
import { shouldAnimate, fadeInUp } from '@/lib/motion'

export interface TimelineEntry {
  id: string
  title: string
  organization: string
  period: string
  description: string
  type: 'work' | 'education' | 'achievement'
  tags?: string[]
}

export interface TimelineItemProps extends TimelineEntry {
  index: number
  isLast?: boolean
}

export function TimelineItem({
  title,
  organization,
  period,
  description,
  type,
  tags = [],
  index,
  isLast = false,
}: TimelineItemProps) {
  const animate = shouldAnimate()

  const typeIcons: Record<string, string> = {
    work: '💼',
    education: '🎓',
    achievement: '🏆',
  }

  return (
    <motion.div
      {...(animate ? fadeInUp(0.1 + index * 0.1) : {})}
      className="relative pl-8 sm:pl-10 pb-10 sm:pb-12 last:pb-0"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] sm:left-[15px] top-8 bottom-0 w-px bg-gradient-to-b from-[var(--accent)]/40 to-[var(--border)]/20" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-0 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[var(--card)] ring-2 ring-[var(--accent)]/40 flex items-center justify-center text-sm sm:text-base">
        {typeIcons[type]}
      </div>

      {/* Content card */}
      <div className="group rounded-xl bg-[var(--card)]/50 ring-1 ring-[var(--border)]/50 backdrop-blur-sm p-4 sm:p-5 md:p-6 transition-all duration-300 hover:ring-[var(--accent)]/30 hover:shadow-lg hover:shadow-black/10">
        {/* Period badge */}
        <span className="inline-block text-xs sm:text-sm text-[var(--accent)] font-medium mb-2">
          {period}
        </span>

        {/* Title */}
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[var(--fg)] mb-1 group-hover:text-[var(--accent)] transition-colors">
          {title}
        </h3>

        {/* Organization */}
        <p className="text-sm text-[var(--fg-muted)] font-medium mb-3">
          {organization}
        </p>

        {/* Description */}
        <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-4">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="default" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
