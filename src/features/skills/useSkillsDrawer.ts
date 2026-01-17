import { useCallback, useState } from 'react'
import type { CategoryId } from '@/content/skills'

export interface SkillsDrawerState {
  selectedCategoryId: CategoryId | null
  isOpen: boolean
  openCategory: (categoryId: CategoryId) => void
  close: () => void
}

export function useSkillsDrawer(): SkillsDrawerState {
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const openCategory = useCallback((categoryId: CategoryId) => {
    setSelectedCategoryId(categoryId)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setSelectedCategoryId(null)
  }, [])

  return {
    selectedCategoryId,
    isOpen,
    openCategory,
    close,
  }
}
