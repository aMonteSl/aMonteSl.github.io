'use client'

import { SKILLS, type SkillId } from '@/content/skills'
import { useTranslations } from '@/i18n'
import { getSkillIcon } from '../skillIconMap'
import { SkillInfoModalShell } from './SkillInfoModalShell'

interface SkillDetailModalProps {
  skillId: SkillId | null
  onClose: () => void
}

export function SkillDetailModal({ skillId, onClose }: SkillDetailModalProps) {
  const t = useTranslations('skills')
  const skill = skillId ? SKILLS[skillId] : null
  const Icon = skill ? getSkillIcon(skill.iconKey) : null

  if (!skill || !Icon) return null

  return (
    <SkillInfoModalShell
      open={Boolean(skill)}
      title={t(skill.labelKey)}
      subtitle={t(skill.purposeKey)}
      icon={Icon}
      level={skill.proficiency}
      summary={t(skill.summaryKey)}
      highlights={skill.highlightsKeys.map((key) => t(key))}
      titleId="skill-modal-title"
      onClose={onClose}
    />
  )
}
