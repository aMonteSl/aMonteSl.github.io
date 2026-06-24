import { SKILLS, type ProficiencyLevel, type SkillId } from '@/content/skills'

export const PROFICIENCY_LEVELS: ProficiencyLevel[] = ['basic', 'intermediate', 'advanced']

export const PROFICIENCY_SCORE: Record<ProficiencyLevel, number> = {
  basic: 1,
  intermediate: 2,
  advanced: 3,
}

export const PROFICIENCY_TONES: Record<
  ProficiencyLevel,
  {
    dot: string
    border: string
    borderHover: string
    bg: string
    text: string
    ring: string
    bar: string
  }
> = {
  basic: {
    dot: 'bg-[#9b8574]',
    border: 'border-[#9b8574]/55',
    borderHover: 'hover:border-[#9b8574]/90',
    bg: 'bg-[#9b8574]/10',
    text: 'text-[#d1b9a7]',
    ring: 'focus-visible:ring-[#9b8574]/55',
    bar: 'bg-[#9b8574]',
  },
  intermediate: {
    dot: 'bg-[#8fc8ff]',
    border: 'border-[#8fc8ff]/60',
    borderHover: 'hover:border-[#8fc8ff]/95',
    bg: 'bg-[#8fc8ff]/10',
    text: 'text-[#acd8ff]',
    ring: 'focus-visible:ring-[#8fc8ff]/55',
    bar: 'bg-[#8fc8ff]',
  },
  advanced: {
    dot: 'bg-[#7ec7a2]',
    border: 'border-[#7ec7a2]/60',
    borderHover: 'hover:border-[#7ec7a2]/95',
    bg: 'bg-[#7ec7a2]/10',
    text: 'text-[#9edbbd]',
    ring: 'focus-visible:ring-[#7ec7a2]/55',
    bar: 'bg-[#7ec7a2]',
  },
}

export function getProficiencyTone(level: ProficiencyLevel) {
  return PROFICIENCY_TONES[level]
}

export function getCategoryProficiency(skillIds: SkillId[]): ProficiencyLevel {
  if (skillIds.length === 0) return 'basic'

  const average =
    skillIds.reduce((total, skillId) => total + PROFICIENCY_SCORE[SKILLS[skillId].proficiency], 0) /
    skillIds.length

  if (average >= 2.5) return 'advanced'
  if (average >= 1.5) return 'intermediate'
  return 'basic'
}

export function getCategoryLevelDistribution(skillIds: SkillId[]) {
  return PROFICIENCY_LEVELS.map((level) => ({
    level,
    count: skillIds.filter((skillId) => SKILLS[skillId].proficiency === level).length,
  }))
}
