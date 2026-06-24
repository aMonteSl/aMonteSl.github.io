'use client'

import { motion } from 'framer-motion'
import { SKILLS, type CategoryId, type SkillId } from '@/content/skills'
import { useTranslations } from '@/i18n'
import { getSkillIcon } from '../skillIconMap'
import { SkillChip } from './SkillChip'
import { cn } from '@/lib/utils'
import { getCategoryProficiency, getProficiencyTone } from '../proficiency'
import { SkillLevelBadge } from './SkillLevelBadge'

interface BentoCategoryCardProps {
  categoryId: CategoryId
  titleKey: string
  descriptionKey?: string
  skills: SkillId[]
  /** Grid span: 'large' = 2 cols, 'wide' = 2 cols on xl only, 'medium/small' = 1 col */
  size?: 'large' | 'wide' | 'medium' | 'small'
  onSkillClick?: (skillId: SkillId) => void
  onCategoryClick?: (categoryId: CategoryId) => void
  index?: number
}

export function BentoCategoryCard({
  categoryId,
  titleKey,
  descriptionKey,
  skills,
  size = 'small',
  onSkillClick,
  onCategoryClick,
  index = 0,
}: BentoCategoryCardProps) {
  const t = useTranslations('skills')
  const categoryLevel = getCategoryProficiency(skills)
  const categoryTone = getProficiencyTone(categoryLevel)

  const sizeClasses = {
    large: 'md:col-span-2 xl:col-span-2',
    wide: 'md:col-span-1 xl:col-span-2',
    medium: 'md:col-span-1 xl:col-span-1',
    small: 'md:col-span-1 xl:col-span-1',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        'group relative cursor-pointer rounded-2xl p-5',
        'bg-[var(--surface)]/50 backdrop-blur-md',
        'border',
        'hover:bg-[var(--surface-strong)]/55',
        'transition-all duration-300',
        'shadow-lg shadow-black/10',
        'focus-visible:outline-none focus-visible:ring-2',
        categoryTone.border,
        categoryTone.borderHover,
        categoryTone.ring,
        sizeClasses[size]
      )}
      role="button"
      tabIndex={0}
      aria-label={`${t(titleKey)}: ${t('actions.viewCategory')}`}
      onClick={() => onCategoryClick?.(categoryId)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onCategoryClick?.(categoryId)
        }
      }}
    >
      <div 
        className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
          <h3 className="mb-1 text-base font-semibold text-[var(--fg)]">
            {t(titleKey)}
          </h3>
          {descriptionKey && (
            <p className="text-xs text-[var(--fg-muted)]/70 line-clamp-2">
              {t(descriptionKey)}
            </p>
          )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="rounded-full border border-[var(--border)]/80 bg-black/18 px-2 py-1 text-[10px] font-semibold text-[var(--fg-muted)]/65">
              {skills.length}
            </span>
            <SkillLevelBadge level={categoryLevel} label={t(`proficiency.${categoryLevel}`)} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skillId) => {
            const skill = SKILLS[skillId]
            const Icon = getSkillIcon(skill.iconKey)
            return (
              <SkillChip
                key={skillId}
                label={t(skill.labelKey)}
                icon={Icon}
                proficiency={skill.proficiency}
                onClick={(event) => {
                  event.stopPropagation()
                  onSkillClick?.(skillId)
                }}
              />
            )
          })}
        </div>

        <div className="mt-4 border-t border-[var(--border)]/35 pt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--fg-muted)]/60 transition-colors group-hover:text-[var(--accent)]">
          {t('actions.viewCategory')}
        </div>
      </div>
    </motion.div>
  )
}
