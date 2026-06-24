'use client'

import { SectionHeader, SectionShell } from '@/components/ui'
import { useTranslations } from '@/i18n'
import { BentoSkillsGrid } from './components/BentoSkillsGrid'
import { SkillLevelLegend } from './components/SkillLevelLegend'

export function SkillsSection() {
  const t = useTranslations('skills')

  return (
    <SectionShell id="skills" tone="default">
        <SectionHeader
          kicker={t('kicker')}
          title={t('title')}
          subtitle={t('subtitle')}
          align="left"
          className="mb-6"
        />

        <div className="mx-auto max-w-6xl">
          <SkillLevelLegend className="mb-10 sm:mb-12 lg:mb-14" />

          {/* Bento Grid */}
          <BentoSkillsGrid />
        </div>
    </SectionShell>
  )
}

