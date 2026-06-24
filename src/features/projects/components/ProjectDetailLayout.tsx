'use client'

import type { ReactNode } from 'react'

interface ProjectDetailLayoutProps {
  nav: ReactNode
  hero: ReactNode
  summary: ReactNode
  milestones?: ReactNode
  tech: ReactNode
  footer: ReactNode
}

export function ProjectDetailLayout({ nav, hero, summary, milestones, tech, footer }: ProjectDetailLayoutProps) {
  return (
    <div className="relative min-h-dvh">
      {nav}
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:gap-5 lg:px-6 lg:py-6 xl:px-8">
        {hero}
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,0.4fr)] xl:grid-cols-[minmax(0,1fr)_minmax(21rem,0.38fr)]">
          <div className="min-w-0">{summary}</div>
          <div className="flex min-w-0 flex-col gap-5">
            {milestones}
            {tech}
          </div>
        </div>
        {footer}
      </main>
    </div>
  )
}
