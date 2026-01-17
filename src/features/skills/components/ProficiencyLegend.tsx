'use client'

import { useTranslations } from 'next-intl'
import { ProficiencyDots } from './ProficiencyDots'

export function ProficiencyLegend() {
  const t = useTranslations('skills')

  return (
    <div className="flex items-center justify-center gap-3 text-xs text-white/50">
      <span className="flex items-center gap-1.5">
        <ProficiencyDots level="basic" hideLabel />
        {t('proficiency.basic')}
      </span>
      <span className="text-white/30">·</span>
      <span className="flex items-center gap-1.5">
        <ProficiencyDots level="intermediate" hideLabel />
        {t('proficiency.intermediate')}
      </span>
      <span className="text-white/30">·</span>
      <span className="flex items-center gap-1.5">
        <ProficiencyDots level="advanced" hideLabel />
        {t('proficiency.advanced')}
      </span>
    </div>
  )
}
