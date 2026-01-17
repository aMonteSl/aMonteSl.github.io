'use client'

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAnimationFrame, useMotionValue, useReducedMotion } from 'framer-motion'
import { useTranslations } from '@/i18n'
import { SKILL_CATEGORIES, SKILLS } from '@/content/skills'
import type { CategoryId } from '@/content/skills'
import { SkillsDetailsModal } from './components/SkillsDetailsModal'
import { SkillsCarousel } from './components/SkillsCarousel'
import type { SkillSlideData } from './components/SkillSlide'

export interface SkillsDetailsModalControllerRenderProps {
  onViewDetails: (categoryId: CategoryId, initialSkillId?: string) => void
  selectedCategoryId: CategoryId | null
}

export interface SkillsDetailsModalControllerProps {
  children: (props: SkillsDetailsModalControllerRenderProps) => ReactNode
}

export function SkillsDetailsModalController({ children }: SkillsDetailsModalControllerProps) {
  const t = useTranslations('skills')
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTabVisible, setIsTabVisible] = useState(true)
  const progress = useMotionValue(1)
  const lastFrame = useRef<number | null>(null)
  const autoplayDuration = 15000

  const selectedCategory = useMemo(
    () => SKILL_CATEGORIES.find((category) => category.id === selectedCategoryId) ?? null,
    [selectedCategoryId]
  )

  const slides: SkillSlideData[] = useMemo(() => {
    if (!selectedCategory) return []

    return selectedCategory.skills.map((skillId) => {
      const skill = SKILLS[skillId]
      return {
        id: skill.id,
        label: t(skill.labelKey),
        summary: t(skill.summaryKey),
        purpose: t(skill.purposeKey),
        purposeTag: t(`purposeTags.${skill.purposeTag}`),
        proficiencyLabel: t(`proficiency.${skill.proficiency}`),
        proficiencyLevel: skill.proficiency,
        highlights: skill.highlightsKeys.map((key) => t(key)),
        tags: skill.experienceTags.map((tag) => t(`tags.${tag}`)),
        usedIn: skill.usedIn.map((item) => ({
          id: item.id,
          label: t(item.labelKey),
          href: item.href,
        })),
        iconKey: skill.iconKey,
      }
    })
  }, [selectedCategory, t])

  const resetProgress = useCallback(() => {
    progress.set(1)
    lastFrame.current = null
  }, [progress])

  const openCategory = useCallback((categoryId: CategoryId, initialSkillId?: string) => {
    setSelectedCategoryId(categoryId)
    
    // Find the index of the initial skill if provided
    let initialIndex = 0
    if (initialSkillId) {
      const category = SKILL_CATEGORIES.find((cat) => cat.id === categoryId)
      if (category) {
        const skillIndex = category.skills.findIndex((skillId) => skillId === initialSkillId)
        if (skillIndex >= 0) {
          initialIndex = skillIndex
        }
      }
    }
    
    setActiveIndex(initialIndex)
    setIsOpen(true)
    setIsPaused(false)
    resetProgress()
  }, [resetProgress])

  const close = useCallback(() => {
    setIsOpen(false)
    setSelectedCategoryId(null)
    setIsPaused(false)
    resetProgress()
  }, [resetProgress])

  const next = useCallback(() => {
    setActiveIndex((prev) => (slides.length === 0 ? 0 : (prev + 1) % slides.length))
    resetProgress()
  }, [resetProgress, slides.length])

  const prev = useCallback(() => {
    setActiveIndex((prev) => (slides.length === 0 ? 0 : (prev - 1 + slides.length) % slides.length))
    resetProgress()
  }, [resetProgress, slides.length])

  const goTo = useCallback((index: number) => {
    setActiveIndex(index)
    resetProgress()
  }, [resetProgress])

  const handleNavigate = useCallback(
    (href: string) => {
      close()

      if (href.startsWith('#')) {
        const element = document.querySelector(href)
        element?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
        return
      }

      router.push(href)
    },
    [close, reduceMotion, router]
  )

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        next()
      }
      if (event.key === 'ArrowLeft') {
        prev()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, next, prev])

  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible')
    }

    handleVisibility()
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const shouldAutoplay =
    isOpen &&
    !isPaused &&
    isTabVisible &&
    !reduceMotion &&
    slides.length > 1

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
    const nextValue = Math.max(0, progress.get() - delta / autoplayDuration)
    progress.set(nextValue)

    if (nextValue <= 0) {
      next()
      progress.set(1)
      lastFrame.current = time
      return
    }

    lastFrame.current = time
  })

  const pause = useCallback(() => {
    setIsPaused(true)
    lastFrame.current = null
  }, [])

  const resume = useCallback(() => {
    setIsPaused(false)
    lastFrame.current = null
  }, [])

  return (
    <>
      {children({
        onViewDetails: openCategory,
        selectedCategoryId,
      })}

      <SkillsDetailsModal
        isOpen={isOpen}
        title={selectedCategory ? t(selectedCategory.titleKey) : ''}
        subtitle={selectedCategory?.descriptionKey ? t(selectedCategory.descriptionKey) : undefined}
        onClose={close}
        closeLabel={t('actions.close')}
        headingLabel={t('drawer.title')}
        onPause={pause}
        onResume={resume}
      >
        <SkillsCarousel
          items={slides}
          activeIndex={activeIndex}
          onNext={next}
          onPrev={prev}
          onGoTo={goTo}
          onNavigate={handleNavigate}
          reduceMotion={Boolean(reduceMotion)}
          progress={progress}
          onPause={pause}
          onResume={resume}
          nextLabel={t('actions.next')}
          prevLabel={t('actions.prev')}
          goToLabel={(index) => t('carousel.goTo', { index: index + 1 })}
        />
      </SkillsDetailsModal>
    </>
  )
}
