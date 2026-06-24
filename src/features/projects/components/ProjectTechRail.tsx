'use client'

import { TechTag } from './TechTag'

interface ProjectTechRailProps {
  title: string
  tech: string[]
}

export function ProjectTechRail({ title, tech }: ProjectTechRailProps) {
  if (tech.length === 0) {
    return null
  }

  return (
    <section className="rounded-2xl border border-[var(--border)]/70 bg-[var(--surface)]/45 p-5 backdrop-blur-sm lg:p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{title}</p>
      <div className="mt-4 flex flex-wrap gap-2 lg:mt-3 lg:gap-1.5">
        {tech.map((item) => (
          <TechTag key={item} tech={item} />
        ))}
      </div>
    </section>
  )
}
