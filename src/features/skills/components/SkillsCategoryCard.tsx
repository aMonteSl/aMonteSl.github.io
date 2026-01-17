'use client'

import { Button, Chip } from '@/components/ui'
import { cn } from '@/lib/utils'
import { getSkillIcon } from '@/features/skills/skillIconMap'
import type { SkillIconKey } from '@/content/skills'

export interface SkillsCategoryChip {
  id: string
  label: string
  iconKey?: SkillIconKey
}

export interface SkillsCategoryCardProps {
  title: string
  description?: string
  skills: SkillsCategoryChip[]
  isActive?: boolean
  onViewDetails: () => void
  viewDetailsLabel: string
}

export function SkillsCategoryCard({
  title,
  description,
  skills,
  isActive = false,
  onViewDetails,
  viewDetailsLabel,
}: SkillsCategoryCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-[var(--border)]/70',
        'bg-gradient-to-br from-[var(--card)]/60 via-[var(--card)]/40 to-[var(--bg)]/30',
        'backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.35)]',
        'p-5 sm:p-6 min-h-[200px] h-full',
        'transition-all duration-200 ease-out motion-reduce:transition-none',
        'hover:-translate-y-1 motion-reduce:hover:translate-y-0',
        'hover:border-[var(--accent)]/40 hover:shadow-[0_25px_70px_rgba(0,0,0,0.45)]',
        "before:absolute before:inset-0 before:rounded-2xl before:content-['']",
        'before:bg-[radial-gradient(140px_at_15%_15%,rgba(220,162,147,0.12),transparent_60%)]',
        'before:opacity-0 before:transition-opacity before:duration-200 before:pointer-events-none',
        'hover:before:opacity-100',
        isActive && 'border-[var(--accent)]/60 shadow-[0_25px_70px_rgba(0,0,0,0.45)]'
      )}
    >
      <h3 className="text-sm sm:text-base font-semibold tracking-wide text-[var(--fg)] mb-3">
        {title}
      </h3>
      {description && (
        <p className="text-xs sm:text-sm text-[var(--fg-muted)] mb-4">
          {description}
        </p>
      )}
      <div className="flex flex-wrap gap-2 mb-5">
        {skills.map((skill) => {
          const Icon = getSkillIcon(skill.iconKey)
          return (
            <Chip
              key={skill.id}
              label={skill.label}
              icon={<Icon className="size-4" aria-hidden="true" />}
            />
          )
        })}
      </div>
      <Button
        size="sm"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={onViewDetails}
      >
        {viewDetailsLabel}
      </Button>
    </div>
  )
}
