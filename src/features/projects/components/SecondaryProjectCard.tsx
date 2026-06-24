'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ImageCarousel } from '@/components/ui'
import { fadeInUp, shouldAnimate } from '@/lib/motion'
import { localizePath, useLocale, useTranslations } from '@/i18n'
import { TechTag } from './TechTag'
import { ProjectCardLinks, type ProjectCardLink } from './ProjectCardLinks'
import { ProjectCardMeta } from './ProjectCardMeta'

interface SecondaryProjectCardProps {
  slug: string
  title: string
  summary: string
  tags: string[]
  images: string[]
  period?: string
  status?: string
  badges?: string[]
  typeLabel?: string
  repoUrl?: string
  demoUrl?: string
  index: number
}

function hasRealProjectImage(images: string[]) {
  return images.some((image) => !image.includes('/projects/placeholder.svg'))
}

export function SecondaryProjectCard({
  slug,
  title,
  summary,
  tags,
  images,
  period,
  status,
  badges,
  typeLabel,
  repoUrl,
  demoUrl,
  index,
}: SecondaryProjectCardProps) {
  const router = useRouter()
  const animate = shouldAnimate()
  const t = useTranslations('projects')
  const { locale } = useLocale()
  const detailHref = localizePath(`/projects/${slug}`, locale)
  const hasImage = hasRealProjectImage(images)

  useEffect(() => {
    router.prefetch(detailHref)
  }, [detailHref, router])

  const links: ProjectCardLink[] = [
    { href: detailHref, label: t('ctaAll'), primary: true },
    ...(repoUrl ? [{ href: repoUrl, label: t('links.repo'), external: true }] : []),
    ...(demoUrl ? [{ href: demoUrl, label: t('links.web'), external: true }] : []),
  ]

  return (
    <motion.article
      {...(animate ? fadeInUp(0.12 + index * 0.05) : {})}
      onClick={() => router.push(detailHref)}
      onPointerEnter={() => router.prefetch(detailHref)}
      onFocus={() => router.prefetch(detailHref)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--border)]/70 bg-[var(--surface)]/48 backdrop-blur-sm transition-colors duration-300 hover:border-[var(--accent)]/35 hover:bg-[var(--surface-strong)]/60"
    >
      <div className="border-b border-[var(--border)]/55">
        {hasImage ? (
          <ImageCarousel
            images={images}
            alt={title}
            interval={10500}
            aspectRatio="aspect-[16/8]"
            showProgress={images.length > 1}
            showCounter={false}
            showDots={images.length > 1}
            showArrows={images.length > 1}
            arrowSize="sm"
            rounded={false}
            objectFit="cover"
            enableLightbox
          />
        ) : (
          <div className="relative flex aspect-[16/8] items-center justify-center overflow-hidden bg-black/18">
            <div className="absolute inset-x-6 top-1/2 h-px bg-[linear-gradient(90deg,transparent,var(--accent),transparent)] opacity-30" />
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]/72">
                {typeLabel ?? t('types.academic')}
              </p>
              <p className="mt-2 text-xs text-[var(--fg-muted)]/68">{period}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5">
        <ProjectCardMeta period={period} status={status} badges={badges} typeLabel={typeLabel} index={index} />

        <h3 className="mt-4 text-lg font-semibold tracking-normal text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
          {title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--fg-muted)]">
          {summary}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {tags.slice(0, 4).map((tag) => (
            <TechTag key={tag} tech={tag} />
          ))}
          {tags.length > 4 && (
            <span className="rounded-lg bg-[var(--border)]/20 px-2 py-1 text-xs font-medium text-[var(--accent)]/70">
              +{tags.length - 4}
            </span>
          )}
        </div>

        <div className="mt-auto border-t border-[var(--border)]/55 pt-4">
          <ProjectCardLinks links={links} />
        </div>
      </div>
    </motion.article>
  )
}
