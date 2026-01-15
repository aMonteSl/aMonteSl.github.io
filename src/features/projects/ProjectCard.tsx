'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Badge, Button } from '@/components/ui'
import { shouldAnimate, fadeInUp } from '@/lib/motion'
import { useTranslations } from '@/i18n'

export interface ProjectCardProps {
  slug: string
  title: string
  summary: string
  tags: string[]
  index?: number
}

export function ProjectCard({
  slug,
  title,
  summary,
  tags,
  index = 0,
}: ProjectCardProps) {
  const animate = shouldAnimate()
  const t = useTranslations('projects')

  return (
    <motion.article
      {...(animate ? fadeInUp(0.1 + index * 0.08) : {})}
      className="group relative flex flex-col h-full rounded-2xl bg-[var(--card)]/50 ring-1 ring-[var(--border)]/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:ring-[var(--accent)]/30 hover:shadow-lg hover:shadow-black/10"
    >
      {/* Image placeholder */}
      <div className="aspect-video bg-gradient-to-br from-[var(--accent)]/10 to-[var(--card)] flex items-center justify-center">
        <span className="text-4xl opacity-50">🚀</span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[var(--fg)] mb-2 group-hover:text-[var(--accent)] transition-colors">
          {title}
        </h3>

        <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-4 flex-1 line-clamp-3">
          {summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="default" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* CTA */}
        <Button asChild variant="ghost" size="sm" className="self-start">
          <Link href={`/projects/${slug}`}>
            {t('ctaAll')} →
          </Link>
        </Button>
      </div>
    </motion.article>
  )
}
