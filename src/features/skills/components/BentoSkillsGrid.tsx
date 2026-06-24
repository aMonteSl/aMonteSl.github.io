'use client'

import { useState } from 'react'
import { SKILL_CATEGORIES, type CategoryId, type SkillId } from '@/content/skills'
import { BentoCategoryCard } from './BentoCategoryCard'
import { CategoryDetailModal } from './CategoryDetailModal'
import { SkillDetailModal } from './SkillDetailModal'

const CATEGORY_SIZES: Record<string, 'large' | 'wide' | 'medium' | 'small'> = {
  languages: 'large',
  tools: 'large',
  frontend: 'medium',
  databasesCloud: 'medium',
  backend: 'small',
  xrRobotics: 'small',
  methodologies: 'wide',
  other: 'wide',
}

export function BentoSkillsGrid() {
  const [selectedSkill, setSelectedSkill] = useState<SkillId | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null)

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {orderedCategories.map((category, index) => (
          <BentoCategoryCard
            key={category.id}
            categoryId={category.id}
            titleKey={category.titleKey}
            descriptionKey={category.descriptionKey}
            skills={category.skills}
            size={CATEGORY_SIZES[category.id] || 'small'}
            onSkillClick={setSelectedSkill}
            onCategoryClick={setSelectedCategory}
            index={index}
          />
        ))}
      </div>

      <SkillDetailModal
        skillId={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />
      <CategoryDetailModal
        categoryId={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </>
  )
}
