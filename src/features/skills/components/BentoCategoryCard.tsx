'use client'

import { motion } from 'framer-motion'
import { SKILLS, type SkillId } from '@/content/skills'
import { useTranslations } from '@/i18n'
import { getSkillIcon } from '../skillIconMap'
import { SkillChip } from './SkillChip'
import { cn } from '@/lib/utils'

interface BentoCategoryCardProps {
  titleKey: string
  descriptionKey?: string
  skills: SkillId[]
  /** Grid span: 'large' = 2 cols, 'medium' = 1 col tall, 'small' = 1 col */
  size?: 'large' | 'medium' | 'small'
  onSkillClick?: (skillId: SkillId) => void
  index?: number
}

export function BentoCategoryCard({
  titleKey,
  descriptionKey,
  skills,
  size = 'small',
  onSkillClick,
  index = 0,
}: BentoCategoryCardProps) {
  const t = useTranslations('skills')

  const sizeClasses = {
    large: 'md:col-span-2 md:row-span-1',
    medium: 'md:col-span-1 md:row-span-2',
    small: 'md:col-span-1 md:row-span-1',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        'group relative rounded-2xl p-5',
        'bg-[var(--card)]/40 backdrop-blur-md',
        'border border-[var(--border)]/50',
        'hover:border-[var(--accent)]/30 hover:bg-[var(--card)]/60',
        'transition-all duration-300',
        'shadow-lg shadow-black/10',
        sizeClasses[size]
      )}
    >
      {/* Subtle grid overlay */}
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

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-[var(--fg)] mb-1">
            {t(titleKey)}
          </h3>
          {descriptionKey && (
            <p className="text-xs text-[var(--fg-muted)]/70 line-clamp-2">
              {t(descriptionKey)}
            </p>
          )}
        </div>

        {/* Skills grid */}
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
                onClick={() => onSkillClick?.(skillId)}
              />
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
