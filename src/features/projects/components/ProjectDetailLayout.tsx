'use client'

import type { ReactNode } from 'react'

interface ProjectDetailLayoutProps {
  nav: ReactNode
  hero: ReactNode
  release?: ReactNode
  summary: ReactNode
  milestones?: ReactNode
  tech: ReactNode
  footer: ReactNode
}

/**
 * LocalizedShell already renders `main#main-content`, so this is a plain div.
 *
 * Below `lg` the grid wrapper is `display: contents`, which lets its children
 * join the outer flex column and take an explicit reading order:
 * hero -> summary -> release highlights -> milestones + tech -> footer.
 * From `lg` up the wrapper becomes the real two-column grid and every
 * `order-*` is reset, so the desktop layout is the source order.
 */
export function ProjectDetailLayout({ nav, hero, release, summary, milestones, tech, footer }: ProjectDetailLayoutProps) {
  return (
    <div className="relative min-h-dvh">
      {nav}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:gap-5 lg:px-6 lg:py-6 xl:px-8">
        {hero}
        <div className="contents lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,0.4fr)] lg:items-start lg:gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(21rem,0.38fr)]">
          <div className="order-1 min-w-0 lg:order-none">{summary}</div>
          <div className="order-3 flex min-w-0 flex-col gap-5 lg:order-none">
            {milestones}
            {tech}
          </div>
        </div>
        {release && <div className="order-2 min-w-0 lg:order-none">{release}</div>}
        <div className="order-4 min-w-0 lg:order-none">{footer}</div>
      </div>
    </div>
  )
}
