'use client'

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAnimationFrame, useMotionValue, useReducedMotion, type MotionValue } from 'framer-motion'
import { SKILL_CATEGORIES } from '@/content/skills'
import type { CategoryId, SkillId } from '@/content/skills'

export interface SkillsShowcaseControllerRenderProps {
  activeCategoryId: CategoryId
  onViewMore: () => void
  onChipClick: (skillId: SkillId) => void
  onOpenModalAtSkill: (categoryId: CategoryId, skillId: SkillId) => void
  onNextGroup: () => void
  onPrevGroup: () => void
  progress: MotionValue<number>
  isPaused: boolean
  onPause: () => void
  onResume: () => void
}

export interface SkillsShowcaseControllerProps {
  children: (props: SkillsShowcaseControllerRenderProps) => ReactNode
  onOpenModal: (categoryId: CategoryId, initialSkillId?: string) => void
}

export function SkillsShowcaseController({ children, onOpenModal }: SkillsShowcaseControllerProps) {
  const reduceMotion = useReducedMotion()
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTabVisible, setIsTabVisible] = useState(true)
  const progressMotionValue = useMotionValue(1)
  const lastFrame = useRef<number | null>(null)
  const autoplayDuration = 15000

  const activeCategoryId = useMemo(
    () => SKILL_CATEGORIES[activeCategoryIndex]?.id ?? SKILL_CATEGORIES[0].id,
    [activeCategoryIndex]
  )

  const resetProgress = useCallback(() => {
    progressMotionValue.set(1)
    lastFrame.current = null
  }, [progressMotionValue])

  const nextGroup = useCallback(() => {
    setActiveCategoryIndex((prev) => (prev + 1) % SKILL_CATEGORIES.length)
    resetProgress()
  }, [resetProgress])

  const prevGroup = useCallback(() => {
    setActiveCategoryIndex((prev) => (prev - 1 + SKILL_CATEGORIES.length) % SKILL_CATEGORIES.length)
    resetProgress()
  }, [resetProgress])

  const handleViewMore = useCallback(() => {
    onOpenModal(activeCategoryId)
  }, [activeCategoryId, onOpenModal])

  const handleChipClick = useCallback(
    (skillId: SkillId) => {
      onOpenModal(activeCategoryId, skillId)
    },
    [activeCategoryId, onOpenModal]
  )

  const pause = useCallback(() => {
    setIsPaused(true)
    lastFrame.current = null
  }, [])

  const resume = useCallback(() => {
    setIsPaused(false)
    lastFrame.current = null
  }, [])

  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible')
    }

    handleVisibility()
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const shouldAutoplay = !isPaused && isTabVisible && !reduceMotion

  useAnimationFrame((time) => {
    if (!shouldAutoplay) {
      lastFrame.current = null
      return
    }

    if (lastFrame.current === null) {
      lastFrame.current = time
      return
    }

    const delta = time - lastFrame.current
    const nextValue = Math.max(0, progressMotionValue.get() - delta / autoplayDuration)
    progressMotionValue.set(nextValue)

    if (nextValue <= 0) {
      nextGroup()
      progressMotionValue.set(1)
      lastFrame.current = time
      return
    }

    lastFrame.current = time
  })

  return children({
    activeCategoryId,
    onViewMore: handleViewMore,
    onChipClick: handleChipClick,
    onOpenModalAtSkill: (categoryId: CategoryId, skillId: SkillId) => {
      onOpenModal(categoryId, skillId)
    },
    onNextGroup: nextGroup,
    onPrevGroup: prevGroup,
    progress: progressMotionValue,
    isPaused,
    onPause: pause,
    onResume: resume,
  })
}
