'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, ImageCarousel } from '@/components/ui'
import { shouldAnimate, fadeInUp } from '@/lib/motion'
import { useTranslations } from '@/i18n'
import { LINKS } from '@/lib/constants'
import { TechTag } from './components/TechTag'

export interface ProjectCardProps {
  slug: string
  title: string
  summary: string
  tags: string[]
  /** Array of full image paths for rotating thumbnail */
  images: string[]
  repoUrl?: string
  demoUrl?: string
  index?: number
}

export function ProjectCard({
  slug,
  title,
  summary,
  tags,
  images,
  repoUrl,
  demoUrl,
  index = 0,
}: ProjectCardProps) {
  const router = useRouter()
  const animate = shouldAnimate()
  const t = useTranslations('projects')
  const isCodeXr = slug === 'code-xr'
  const repoLink = isCodeXr ? LINKS.codeXrRepo : repoUrl
  const docsLink = isCodeXr ? LINKS.codeXrDocs : demoUrl
  const doiLink = isCodeXr ? LINKS.codeXrDoi : null
  const marketplaceLink = isCodeXr ? LINKS.codeXrMarketplace : null

  const handleCardClick = () => {
    router.push(`/projects/${slug}`)
  }

  return (
    <motion.article
      {...(animate ? fadeInUp(0.1 + index * 0.08) : {})}
      onClick={handleCardClick}
      className="group relative flex flex-col h-full rounded-2xl bg-[var(--card)]/50 ring-1 ring-[var(--border)]/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:ring-[var(--accent)]/30 hover:shadow-lg hover:shadow-black/10 cursor-pointer"
    >
      {/* Image carousel thumbnail */}
      <ImageCarousel
        images={images}
        alt={title}
        interval={10000 + index * 500}
        aspectRatio="video"
        showProgress={true}
        showCounter={true}
        showDots={images.length > 1}
        showArrows={images.length > 1}
        arrowSize="sm"
        rounded={false}
        className="rounded-t-2xl"
      />

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[var(--fg)] mb-2 group-hover:text-[var(--accent)] transition-colors">
          {title}
        </h3>

        <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-4 flex-1 line-clamp-3">
          {summary}
        </p>

        {/* Tech Tags with Icons */}
        <div className="flex flex-wrap gap-1.5 mb-4 items-center">
          {tags.slice(0, 5).map((tag) => (
            <TechTag key={tag} tech={tag} />
          ))}
          {tags.length > 5 && (
            <span className="text-xs text-[var(--accent)]/70 font-medium px-2 py-1 rounded-lg bg-[var(--border)]/20 group-hover:bg-[var(--border)]/40 transition-colors">
              +{tags.length - 5} more
            </span>
          )}
        </div>

        {/* Footer links */}
        <div className="mt-auto pt-4 border-t border-[var(--border)]/60">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 px-0 text-[var(--fg)] hover:text-[var(--fg)]"
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={`/projects/${slug}`} className="flex items-center gap-1">
                  <span>{t('ctaAll')}</span>
                  <span aria-hidden>→</span>
                </Link>
              </Button>

              {doiLink && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs gap-1 rounded-lg border border-[var(--border)]/60 bg-[var(--card)]/60 text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={doiLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    title={t('publication')}
                    aria-label={`${t('links.doi')} — ${t('publication')}`}
                  >
                    <span>{t('links.doi')}</span>
                    <span aria-hidden>↗</span>
                  </a>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              {repoLink && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs gap-1 text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a href={repoLink} target="_blank" rel="noreferrer noopener">
                    <span>{t('links.repo')}</span>
                    <span aria-hidden>↗</span>
                  </a>
                </Button>
              )}

              {docsLink && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs gap-1 text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a href={docsLink} target="_blank" rel="noreferrer noopener">
                    <span>{t('links.web')}</span>
                    <span aria-hidden>↗</span>
                  </a>
                </Button>
              )}

              {marketplaceLink && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs gap-1 text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a href={marketplaceLink} target="_blank" rel="noreferrer noopener">
                    <span>{t('links.marketplace')}</span>
                    <span aria-hidden>↗</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
