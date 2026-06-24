'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ImageCarousel } from '@/components/ui'
import { LINKS } from '@/lib/constants'
import { fadeInUp, shouldAnimate } from '@/lib/motion'
import { localizePath, useLocale, useTranslations } from '@/i18n'
import { TechTag } from './TechTag'
import { ProjectCardLinks, type ProjectCardLink } from './ProjectCardLinks'
import { ProjectCardMeta } from './ProjectCardMeta'

interface FeaturedProjectCardProps {
  slug: string
  title: string
  summary: string
  tags: string[]
  images: string[]
  period?: string
  status?: string
  badges?: string[]
  typeLabel?: string
}

export function FeaturedProjectCard({
  slug,
  title,
  summary,
  tags,
  images,
  period,
  status,
  badges,
  typeLabel,
}: FeaturedProjectCardProps) {
  const router = useRouter()
  const animate = shouldAnimate()
  const t = useTranslations('projects')
  const { locale } = useLocale()
  const detailHref = localizePath(`/projects/${slug}`, locale)

  useEffect(() => {
    router.prefetch(detailHref)
  }, [detailHref, router])

  const links: ProjectCardLink[] = [
    { href: detailHref, label: t('ctaAll'), primary: true },
    { href: LINKS.codeXrRepo, label: t('links.repo'), external: true },
    { href: LINKS.codeXrMarketplace, label: t('links.marketplace'), external: true },
    { href: LINKS.codeXrDoi, label: t('links.doi'), external: true },
    { href: LINKS.codeXrAward, label: t('links.award'), external: true },
    { href: LINKS.codeXrAwardCertificate, label: t('links.certificate'), external: true },
    { href: LINKS.codeXrDocs, label: t('links.web'), external: true },
  ]

  return (
    <motion.article
      {...(animate ? fadeInUp(0.1) : {})}
      onClick={() => router.push(detailHref)}
      onPointerEnter={() => router.prefetch(detailHref)}
      onFocus={() => router.prefetch(detailHref)}
      className="group isolate grid cursor-pointer overflow-hidden rounded-2xl border border-[var(--border)]/75 bg-[var(--surface)]/55 backdrop-blur-sm transition-colors duration-300 hover:border-[var(--accent)]/35 hover:bg-[var(--surface-strong)]/64 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.82fr)]"
    >
      <div className="min-w-0 border-b border-[var(--border)]/55 p-3 sm:p-4 lg:flex lg:items-center lg:border-b-0 lg:border-r">
        <ImageCarousel
          images={images}
          alt={title}
          interval={10500}
          aspectRatio="aspect-[16/10] lg:aspect-[16/9]"
          showProgress
          showCounter
          showDots={images.length > 1}
          showArrows={images.length > 1}
          arrowSize="sm"
          rounded={false}
          objectFit="cover"
          enableLightbox
          className="w-full overflow-hidden rounded-xl border border-[var(--border)]/45 bg-black/35"
        />
      </div>

      <div className="flex min-w-0 flex-col p-5 sm:p-6 lg:p-7">
        <ProjectCardMeta period={status ? undefined : period} status={status} badges={badges} typeLabel={typeLabel} index={0} featured />

        <h3 className="mt-5 text-2xl font-semibold tracking-normal text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
          {title}
        </h3>

        <a
          href={LINKS.codeXrDoi}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-3 inline-flex w-fit items-center rounded-full border border-[var(--accent)]/24 bg-black/16 px-3 py-1 text-[11px] font-mono text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/45 hover:text-[var(--fg)]"
          onClick={(event) => event.stopPropagation()}
        >
          DOI 10.1109/VISSOFT67405.2025.00034
        </a>

        <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)] lg:line-clamp-5">
          {summary}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {tags.slice(0, 6).map((tag) => (
            <TechTag key={tag} tech={tag} />
          ))}
        </div>

        <div className="mt-5 border-t border-[var(--border)]/60 pt-4 lg:mt-auto">
          <ProjectCardLinks links={links} />
        </div>
      </div>
    </motion.article>
  )
}
