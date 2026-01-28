'use client'

import { Container, Chip } from '@/components/ui'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useTranslations } from '@/i18n'
import { BentoSkillsGrid } from './components/BentoSkillsGrid'

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

        {/* Top stack chips */}
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

        {/* Bento Grid */}
        <BentoSkillsGrid />
      </Container>
    </section>
  )
}

