'use client'

import { useState } from 'react'
import { SKILL_CATEGORIES, type SkillId } from '@/content/skills'
import { BentoCategoryCard } from './BentoCategoryCard'
import { SkillDetailModal } from './SkillDetailModal'

// Define sizes for asymmetric bento layout
const CATEGORY_SIZES: Record<string, 'large' | 'medium' | 'small'> = {
  languages: 'large',       // 10 skills - spans 2 columns
  tools: 'large',           // 10 skills - spans 2 columns
  frontend: 'medium',       // 4 skills
  databasesCloud: 'medium', // 4 skills
  backend: 'small',         // 2 skills
  xrRobotics: 'small',      // 3 skills
  methodologies: 'small',   // new category
  other: 'small',           // 3 skills
}

export function BentoSkillsGrid() {
  const [selectedSkill, setSelectedSkill] = useState<SkillId | null>(null)

  // Reorder categories for better visual layout
  const orderedCategories = [
    SKILL_CATEGORIES.find(c => c.id === 'languages')!,
    SKILL_CATEGORIES.find(c => c.id === 'frontend')!,
    SKILL_CATEGORIES.find(c => c.id === 'backend')!,
    SKILL_CATEGORIES.find(c => c.id === 'xrRobotics')!,
    SKILL_CATEGORIES.find(c => c.id === 'databasesCloud')!,
    SKILL_CATEGORIES.find(c => c.id === 'tools')!,
    SKILL_CATEGORIES.find(c => c.id === 'methodologies')!,
    SKILL_CATEGORIES.find(c => c.id === 'other')!,
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {orderedCategories.map((category, index) => (
          <BentoCategoryCard
            key={category.id}
            titleKey={category.titleKey}
            descriptionKey={category.descriptionKey}
            skills={category.skills}
            size={CATEGORY_SIZES[category.id] || 'small'}
            onSkillClick={setSelectedSkill}
            index={index}
          />
        ))}
      </div>

      <SkillDetailModal
        skillId={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />
    </>
  )
}
