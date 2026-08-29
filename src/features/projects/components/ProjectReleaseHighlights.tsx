'use client'

import { useCallback, useEffect, useState } from 'react'
import { CloseIcon, ExternalLinkIcon } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { LocalizedProjectRelease, LocalizedProjectReleaseFeature } from '../detail'

interface ProjectReleaseHighlightsProps {
  release: LocalizedProjectRelease
  watchLabel: string
  tutorialLabel: string
  closeLabel: string
  youtubeLabel: string
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.72-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14z" />
    </svg>
  )
}

/** youtu.be/<id> and youtube.com/watch?v=<id> both reduce to the embeddable id. */
function getYoutubeId(url: string): string | null {
  const match = /(?:youtu\.be\/|[?&]v=|\/embed\/)([A-Za-z0-9_-]{6,})/.exec(url)
  return match?.[1] ?? null
}

interface ReleaseFeatureCardProps {
  feature: LocalizedProjectReleaseFeature
  isFlipped: boolean
  onFlip: (id: string) => void
  onClose: () => void
  watchLabel: string
  closeLabel: string
  youtubeLabel: string
}

function ReleaseFeatureCard({
  feature,
  isFlipped,
  onFlip,
  onClose,
  watchLabel,
  closeLabel,
  youtubeLabel,
}: ReleaseFeatureCardProps) {
  const videoId = feature.videoUrl ? getYoutubeId(feature.videoUrl) : null

  // Clicking the card body flips it too, but never while the reader is
  // selecting text inside it.
  const handleCardClick = useCallback(() => {
    if (!videoId) return
    if (typeof window !== 'undefined' && window.getSelection()?.toString()) return
    onFlip(feature.id)
  }, [feature.id, onFlip, videoId])

  return (
    <div className={cn('min-h-[19rem]', videoId && '[perspective:1400px]')}>
      <div
        className={cn(
          'relative h-full transition-transform duration-500 ease-out [transform-style:preserve-3d] motion-reduce:transition-none',
          isFlipped && '[transform:rotateY(180deg)]'
        )}
      >
        <article
          onClick={videoId ? handleCardClick : undefined}
          className={cn(
            'flex h-full min-w-0 flex-col rounded-xl border border-[var(--border)]/55 bg-black/14 p-4 [backface-visibility:hidden]',
            videoId &&
              'group cursor-pointer transition-colors duration-200 hover:border-[var(--accent)]/45 hover:bg-black/24'
          )}
          inert={isFlipped}
        >
          <h3 className="text-sm font-semibold leading-snug text-[var(--fg)]">{feature.title}</h3>

          <p className="mt-2 text-xs leading-relaxed text-[var(--fg-muted)]">{feature.description}</p>

          {feature.bullets.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {feature.bullets.map((bullet) => (
                <li key={bullet} className="relative pl-4 text-xs leading-relaxed text-[var(--fg-muted)]">
                  <span
                    className="absolute left-0 top-[0.5em] h-1.5 w-1.5 rounded-full bg-[var(--accent)]/70"
                    aria-hidden
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {videoId && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onFlip(feature.id)
              }}
              aria-label={`${watchLabel}: ${feature.title}`}
              className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-[var(--accent)]/24 bg-black/16 px-3 py-1.5 text-xs font-medium text-[var(--fg-muted)] transition-colors duration-200 group-hover:border-[var(--accent)]/50 group-hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60"
            >
              <PlayIcon className="h-3 w-3 text-[var(--accent)]" />
              {watchLabel}
            </button>
          )}
        </article>

        {videoId && (
          <div
            className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-[var(--accent)]/40 bg-black/45 p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]"
            inert={!isFlipped}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 truncate text-[11px] font-medium text-[var(--fg-muted)]">{feature.title}</p>
              <button
                type="button"
                onClick={onClose}
                aria-label={closeLabel}
                className="-mt-0.5 shrink-0 rounded-full p-1 text-[var(--fg-muted)] transition-colors hover:bg-white/10 hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* The player keeps its own 16:9 box and sits centred in whatever
                height the card has, instead of stretching into black bars. */}
            <div className="mt-2 flex flex-1 items-center justify-center">
              <div className="relative aspect-video max-h-full w-full overflow-hidden rounded-lg bg-black">
                {/* Mounted only while flipped: keeps YouTube off the page until
                    asked for, and stops playback the moment the card flips back. */}
                {isFlipped && (
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={feature.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                )}
              </div>
            </div>

            <a
              href={feature.videoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-flex w-fit items-center gap-1.5 text-[11px] font-medium text-[var(--fg-muted)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60"
            >
              <ExternalLinkIcon className="h-3 w-3" />
              {youtubeLabel}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export function ProjectReleaseHighlights({
  release,
  watchLabel,
  tutorialLabel,
  closeLabel,
  youtubeLabel,
}: ProjectReleaseHighlightsProps) {
  // One card open at a time: four YouTube players at once is not a reading experience.
  const [flippedId, setFlippedId] = useState<string | null>(null)

  const handleFlip = useCallback((id: string) => {
    setFlippedId((current) => (current === id ? null : id))
  }, [])

  const handleClose = useCallback(() => setFlippedId(null), [])

  useEffect(() => {
    if (!flippedId) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFlippedId(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [flippedId])

  if (release.features.length === 0) {
    return null
  }

  return (
    <section className="rounded-2xl border border-[var(--border)]/70 bg-[var(--surface)]/45 p-5 backdrop-blur-sm sm:p-6 lg:p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{release.title}</p>
        <span className="rounded-full border border-[var(--accent)]/24 bg-black/16 px-2.5 py-1 font-mono text-[11px] text-[var(--fg)]">
          v{release.version}
        </span>
        <span className="text-xs font-medium text-[var(--fg-muted)]">{release.date}</span>
      </div>

      {release.codename && (
        <p className="mt-3 text-lg font-semibold text-[var(--fg)] sm:text-xl">{release.codename}</p>
      )}

      <p className="mt-2 max-w-4xl text-sm leading-relaxed text-[var(--fg-muted)] lg:text-[13px] lg:leading-[1.62]">
        {release.intro}
      </p>

      {release.tutorialUrl && (
        <a
          href={release.tutorialUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/24 bg-black/16 px-3 py-1.5 text-xs font-medium text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/45 hover:text-[var(--fg)]"
        >
          <ExternalLinkIcon className="h-3.5 w-3.5" />
          {tutorialLabel}
        </a>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {release.features.map((feature) => (
          <ReleaseFeatureCard
            key={feature.id}
            feature={feature}
            isFlipped={flippedId === feature.id}
            onFlip={handleFlip}
            onClose={handleClose}
            watchLabel={watchLabel}
            closeLabel={closeLabel}
            youtubeLabel={youtubeLabel}
          />
        ))}
      </div>
    </section>
  )
}
