'use client'

import { getSkillIcon } from '@/features/skills/skillIconMap'
import { ExperienceTag } from './ExperienceTag'
import { UsedInChip } from './UsedInChip'
import { ProficiencyBadge } from './ProficiencyBadge'
import type { SkillIconKey } from '@/content/skills'

export interface SkillSlideUsedIn {
  id: string
  label: string
  href: string
}

export interface SkillSlideData {
  id: string
  label: string
  summary: string
  purpose: string
  purposeTag: string
  proficiencyLabel: string
  proficiencyLevel: 'basic' | 'intermediate' | 'advanced'
  highlights: string[]
  tags: string[]
  usedIn: SkillSlideUsedIn[]
  iconKey?: SkillIconKey
}

export interface SkillSlideProps {
  skill: SkillSlideData
  onNavigate: (href: string) => void
}

export function SkillSlide({ skill, onNavigate }: SkillSlideProps) {
  const Icon = getSkillIcon(skill.iconKey)

  return (
    <article className="rounded-2xl border border-[var(--border)]/70 bg-[var(--card)]/45 p-5 sm:p-6 shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-xl border border-[var(--border)]/60 bg-[var(--card)]/60 text-[var(--fg)]/80">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-[var(--fg)]">
              {skill.label}
            </h4>
            <p className="text-xs sm:text-sm text-[var(--fg-muted)] max-w-lg">
              {skill.summary}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExperienceTag label={skill.purposeTag} />
          <ProficiencyBadge label={skill.proficiencyLabel} level={skill.proficiencyLevel} />
          {skill.tags.map((tag) => (
            <ExperienceTag key={tag} label={tag} />
          ))}
        </div>
      </header>

      <div className="mt-5 space-y-4">
        <p className="text-xs sm:text-sm text-[var(--fg-muted)]">
          {skill.purpose}
        </p>
        <div className="flex flex-wrap gap-2">
          {skill.usedIn.map((item) => (
            <UsedInChip
              key={item.id}
              label={item.label}
              onClick={() => onNavigate(item.href)}
            />
          ))}
        </div>

        <ul className="space-y-1 text-xs sm:text-sm text-[var(--fg-muted)]">
          {skill.highlights.map((highlight, index) => (
            <li key={`${skill.id}-h-${index}`} className="flex items-start gap-2">
              <span className="mt-1 size-1.5 rounded-full bg-[var(--accent)]/70" aria-hidden="true" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
