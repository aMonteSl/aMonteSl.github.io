'use client'

import type { LocalizedProjectMilestone } from '../types'

interface ProjectMilestonesProps {
  title: string
  milestones: LocalizedProjectMilestone[]
}

export function ProjectMilestones({ title, milestones }: ProjectMilestonesProps) {
  if (milestones.length === 0) {
    return null
  }

  return (
    <section className="min-h-0 rounded-2xl border border-[var(--border)]/70 bg-[var(--surface)]/45 p-5 backdrop-blur-sm lg:p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{title}</p>
      <div className="mt-4 space-y-3 lg:mt-3 lg:space-y-2">
        {milestones.map((milestone) => (
          <article key={milestone.version} className="relative border-l border-[var(--border)]/70 pl-4 lg:pl-3">
            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[var(--accent)]/24 bg-black/16 px-2.5 py-1 font-mono text-[11px] text-[var(--fg)] lg:px-2 lg:py-0.5 lg:text-[10px]">
                v{milestone.version}
              </span>
              <span className="text-xs font-medium text-[var(--fg-muted)] lg:text-[11px]">{milestone.date}</span>
            </div>
            <h3 className="mt-1.5 text-sm font-semibold text-[var(--fg)] lg:text-[12px] lg:leading-snug">{milestone.title}</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--fg-muted)] lg:text-[10px] lg:leading-[1.35]">{milestone.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
