'use client'

import { ImageCarousel, StatusPill } from '@/components/ui'
import type { ProjectDetailLink } from '../detail'
import { ProjectDetailLinks } from './ProjectDetailLinks'

interface ProjectDetailHeroProps {
  title: string
  summary: string
  images: string[]
  typeLabel?: string
  status?: string
  badges?: string[]
  period: string
  links: ProjectDetailLink[]
  doi?: {
    code: string
    url: string
    venue: string
  } | null
}

export function ProjectDetailHero({ title, summary, images, typeLabel, status, badges = [], period, links, doi }: ProjectDetailHeroProps) {
  return (
    <section className="grid overflow-hidden rounded-2xl border border-[var(--border)]/70 bg-[var(--surface)]/50 backdrop-blur-sm lg:grid-cols-[minmax(0,1.06fr)_minmax(22rem,0.78fr)]">
      <div className="min-w-0 border-b border-[var(--border)]/55 p-3 sm:p-4 lg:border-b-0 lg:border-r">
        <ImageCarousel
          images={images}
          alt={title}
          interval={8000}
          aspectRatio="aspect-[16/10]"
          objectFit="contain"
          showProgress
          showCounter
          showDots={images.length > 1}
          showArrows={images.length > 1}
          rounded
          enableLightbox
          className="border border-[var(--border)]/45 bg-black/42"
        />
      </div>

      <div className="flex min-w-0 flex-col p-5 sm:p-6 lg:p-7">
        <div className="flex flex-wrap gap-2">
          {typeLabel && <StatusPill tone="xr">{typeLabel}</StatusPill>}
          {status && <StatusPill tone="success">{status}</StatusPill>}
          {badges.map((badge) => (
            <StatusPill key={badge} tone="xr">
              {badge}
            </StatusPill>
          ))}
          {!status && (
            <span className="inline-flex min-h-7 items-center rounded-full border border-[var(--border)]/75 bg-black/14 px-3 py-1 text-xs font-medium text-[var(--fg-muted)]">
              {period}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-normal text-[var(--fg)] sm:text-4xl lg:text-3xl">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base lg:text-sm">
          {summary}
        </p>

        {doi && (
          <a
            href={doi.url}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-flex w-fit rounded-full border border-[var(--accent)]/24 bg-black/16 px-3 py-1.5 font-mono text-[11px] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/45 hover:text-[var(--fg)]"
          >
            DOI {doi.code}
          </a>
        )}

        <ProjectDetailLinks links={links} className="mt-4" />
      </div>
    </section>
  )
}
