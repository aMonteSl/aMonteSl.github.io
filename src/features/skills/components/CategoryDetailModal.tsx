'use client'

import { SKILL_CATEGORIES, SKILLS, type CategoryId } from '@/content/skills'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import { getSkillIcon } from '../skillIconMap'
import { getCategoryLevelDistribution, getCategoryProficiency, getProficiencyTone } from '../proficiency'
import { SkillInfoModalShell } from './SkillInfoModalShell'

interface CategoryDetailModalProps {
  categoryId: CategoryId | null
  onClose: () => void
}

export function CategoryDetailModal({ categoryId, onClose }: CategoryDetailModalProps) {
  const t = useTranslations('skills')
  const category = categoryId ? SKILL_CATEGORIES.find((item) => item.id === categoryId) : null

  if (!category) return null

  const level = getCategoryProficiency(category.skills)
  const distribution = getCategoryLevelDistribution(category.skills)
  const tone = getProficiencyTone(level)

  return (
    <SkillInfoModalShell
      open={Boolean(category)}
      title={t(category.titleKey)}
      subtitle={category.descriptionKey ? t(category.descriptionKey) : undefined}
      level={level}
      summary={t(`categoryDetails.${category.id}.summary`)}
      highlights={[
        t(`categoryDetails.${category.id}.h1`),
        t(`categoryDetails.${category.id}.h2`),
      ]}
      titleId="skill-category-modal-title"
      onClose={onClose}
    >
      <div className="mb-6 rounded-xl border border-[var(--border)]/60 bg-black/15 p-4">
        <h3 className="mb-3 text-sm font-medium text-[var(--fg)]">
          {t('categoryModal.distribution')}
        </h3>
        {/* Below xs a tile cell is ~50px wide, too narrow for a 10px uppercase "Intermediate", so the tiles
            become count + label rows; from xs they are the three-up tiles again, compact until sm. */}
        <div className="grid grid-cols-1 gap-2 xs:grid-cols-3">
          {distribution.map(({ level: distributionLevel, count }) => {
            const distributionTone = getProficiencyTone(distributionLevel)
            return (
              <div
                key={distributionLevel}
                className={cn(
                  'flex items-center gap-3 rounded-lg border px-3 py-2 xs:block xs:p-2 xs:text-center sm:p-3',
                  distributionTone.border,
                  distributionTone.bg
                )}
              >
                <div className={cn('text-lg font-semibold', distributionTone.text)}>{count}</div>
                <div className="min-w-0 break-words text-[10px] uppercase tracking-[0.06em] text-[var(--fg-muted)] hyphens-auto xs:mt-1 sm:tracking-[0.14em]">
                  {t(`proficiency.${distributionLevel}`)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-[var(--fg)]">
          {t('categoryModal.skills')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skillId) => {
            const skill = SKILLS[skillId]
            const Icon = getSkillIcon(skill.iconKey)
            const skillTone = getProficiencyTone(skill.proficiency)

            return (
              <span
                key={skillId}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs',
                  'bg-black/20 text-[var(--fg-muted)]',
                  skillTone.border
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', skillTone.text)} aria-hidden="true" />
                {t(skill.labelKey)}
              </span>
            )
          })}
        </div>
      </div>

      <div className={cn('mt-6 h-px w-full', tone.bar)} aria-hidden="true" />
    </SkillInfoModalShell>
  )
}
