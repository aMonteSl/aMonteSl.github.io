'use client'

import type { SkillDetail } from '@/content/skills'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import { getSkillIcon } from './skillIconMap'
import { ExperienceTag } from './ExperienceTag'

export interface SkillDetailCardProps {
  skill: SkillDetail
  onNavigate: (href: string) => void
}

export function SkillDetailCard({ skill, onNavigate }: SkillDetailCardProps) {
  const t = useTranslations('skills')
  const Icon = getSkillIcon(skill.iconKey)

  return (
    <article className="rounded-2xl border border-[var(--border)]/70 bg-[var(--card)]/40 p-4 sm:p-5 shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-9 items-center justify-center rounded-xl border border-[var(--border)]/60 bg-[var(--card)]/60 text-[var(--fg)]/80">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-[var(--fg)]">
              {t(skill.labelKey)}
            </h4>
            <p className="text-xs sm:text-sm text-[var(--fg-muted)]">
              {t(skill.summaryKey)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {skill.experienceTags.map((tag) => (
            <ExperienceTag key={tag} tag={tag} />
          ))}
        </div>
      </header>

      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {skill.usedIn.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.href)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border border-[var(--border)]/70 bg-[var(--card)]/30 px-2.5 py-1 text-[11px] sm:text-xs text-[var(--fg)]/80',
                'transition-all duration-200 ease-out hover:border-[var(--accent)]/40 hover:text-[var(--fg)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]'
              )}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </div>

        <ul className="space-y-1 text-xs sm:text-sm text-[var(--fg-muted)]">
          {skill.highlightsKeys.map((key) => (
            <li key={key} className="flex items-start gap-2">
              <span className="mt-1 size-1.5 rounded-full bg-[var(--accent)]/70" aria-hidden="true" />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
