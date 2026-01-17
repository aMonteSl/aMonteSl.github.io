'use client'

import { Container, Chip, Button } from '@/components/ui'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SKILL_CATEGORIES, SKILLS } from '@/content/skills'
import { useTranslations } from '@/i18n'
import { getSkillIcon } from './skillIconMap'
import { SkillsDetailsModalController } from './SkillsDetailsModalController'
import { SkillsShowcaseController } from './SkillsShowcaseController'
import { SkillsShowcaseCard } from './components/SkillsShowcaseCard'
import { GroupCarouselHeader } from './components/GroupCarouselHeader'
import { ShowcaseSkillChip } from './components/ShowcaseSkillChip'
import { GroupDotsIndicator } from './components/GroupDotsIndicator'
import { AutoplayProgressBar } from './components/AutoplayProgressBar'
import { ProficiencyLegend } from './components/ProficiencyLegend'

export function SkillsSection() {
  const t = useTranslations('skills')
  const topStackKeys = ['typescript', 'react', 'express', 'postgresql', 'azure']

  return (
    <section id="skills" className="py-16 sm:py-20 md:py-24 lg:py-32">
      <Container size="xl">
        <SectionHeading
          title={t('title')}
          subtitle={t('subtitle')}
          className="mb-4 sm:mb-6 lg:mb-8"
          titleClassName="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem]"
          subtitleClassName="max-w-prose text-[var(--fg-muted)]/90"
        />

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-12 lg:mb-14">
          {topStackKeys.map((key) => (
            <Chip
              key={key}
              label={t(`topStack.${key}`)}
              size="sm"
              variant="subtle"
            />
          ))}
        </div>

        <SkillsDetailsModalController>
          {({ onViewDetails }) => (
            <SkillsShowcaseController
              onOpenModal={(categoryId, initialSkillId) => onViewDetails(categoryId, initialSkillId)}
            >
              {({
                activeCategoryId,
                onViewMore,
                onChipClick,
                onNextGroup,
                onPrevGroup,
                progress,
                onPause,
                onResume,
              }) => {
                const activeCategory = SKILL_CATEGORIES.find((cat) => cat.id === activeCategoryId)
                const currentCategoryIndex = SKILL_CATEGORIES.findIndex(
                  (cat) => cat.id === activeCategoryId
                )
                if (!activeCategory) return null

                const categorySkills = activeCategory.skills.map((skillId) => {
                  const skill = SKILLS[skillId]
                  return {
                    id: skill.id,
                    label: t(skill.labelKey),
                    iconKey: skill.iconKey,
                    proficiency: skill.proficiency,
                  }
                })

                const categoryLabels = SKILL_CATEGORIES.map((cat) => t(cat.titleKey))

                const handleKeyDown = (key: 'ArrowLeft' | 'ArrowRight') => {
                  if (key === 'ArrowLeft') {
                    onPrevGroup()
                  } else if (key === 'ArrowRight') {
                    onNextGroup()
                  }
                }

                return (
                  <SkillsShowcaseCard
                    header={
                      <GroupCarouselHeader
                        title={t(activeCategory.titleKey)}
                        description={
                          activeCategory.descriptionKey
                            ? t(activeCategory.descriptionKey)
                            : undefined
                        }
                        position={currentCategoryIndex}
                        total={SKILL_CATEGORIES.length}
                        progressBar={<AutoplayProgressBar progress={progress} />}
                      />
                    }
                    chips={
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill) => {
                          const Icon = getSkillIcon(skill.iconKey)
                          return (
                            <ShowcaseSkillChip
                              key={skill.id}
                              label={skill.label}
                              icon={Icon}
                              proficiency={skill.proficiency}
                              onClick={() => onChipClick(skill.id)}
                            />
                          )
                        })}
                      </div>
                    }
                    legend={<ProficiencyLegend />}
                    footer={
                      <>
                        <GroupDotsIndicator
                          total={SKILL_CATEGORIES.length}
                          activeIndex={currentCategoryIndex}
                          labels={categoryLabels}
                          className="flex-1"
                        />
                        <Button
                          onClick={onViewMore}
                          variant="primary"
                          size="sm"
                          className="whitespace-nowrap"
                        >
                          {t('showcase.viewMore')}
                        </Button>
                      </>
                    }
                    prevLabel={t('showcase.prevGroup')}
                    nextLabel={t('showcase.nextGroup')}
                    onPrev={onPrevGroup}
                    onNext={onNextGroup}
                    onPause={onPause}
                    onResume={onResume}
                    onKeyDown={handleKeyDown}
                  />
                )
              }}
            </SkillsShowcaseController>
          )}
        </SkillsDetailsModalController>
      </Container>
    </section>
  )
}
