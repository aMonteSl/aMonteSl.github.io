'use client'

import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import { DividerLine, Kicker, MetricTile, StatusPill, Surface } from '@/components/ui'

interface ProfileBioProps {
  className?: string
}

export function ProfileBio({ className }: ProfileBioProps) {
  const t = useTranslations('profile')

  const pills = [
    { label: t('pills.satec'), tone: 'success' as const },
    { label: t('pills.vbgroup'), tone: 'accent' as const },
    { label: t('pills.upm'), tone: 'xr' as const },
    { label: t('pills.english'), tone: 'muted' as const },
  ]

  const stats = [
    { label: t('stats.experience'), value: t('stats.experienceValue') },
    { label: t('stats.education'), value: t('stats.educationValue') },
    { label: t('stats.focus'), value: t('stats.focusValue') },
    { label: t('stats.languages'), value: t('stats.languagesValue') },
  ]

  return (
    <div className={cn('grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.75fr)] lg:gap-12', className)}>
      <motion.div {...fadeInUp(0)} className="min-w-0">
        <div className="max-w-3xl">
          <Kicker>{t('operatingKicker')}</Kicker>
          <h3 className="mt-4 text-2xl font-semibold leading-tight text-[var(--fg)] sm:text-3xl lg:text-4xl">
            {t('name')}
          </h3>
          <p className="mt-3 text-sm font-medium leading-relaxed text-[var(--accent)] sm:text-base">
            {t('role')}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {pills.map((pill) => (
              <StatusPill key={pill.label} tone={pill.tone}>
                {pill.label}
              </StatusPill>
            ))}
          </div>

          <DividerLine className="my-7" />

          <div className="space-y-5 text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base">
            <p>{t('bio1')}</p>
            <p>{t('bio2')}</p>
            <p>{t('bio3')}</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Surface variant="flat" className="p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fg-muted)]/58">{t('proof.vbgroup.label')}</p>
              <p className="mt-2 text-sm font-semibold text-[var(--fg)]">{t('proof.vbgroup.value')}</p>
            </Surface>
            <Surface variant="flat" className="p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fg-muted)]/58">{t('proof.codexr.label')}</p>
              <p className="mt-2 text-sm font-semibold text-[var(--fg)]">{t('proof.codexr.value')}</p>
            </Surface>
            <Surface variant="flat" className="p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fg-muted)]/58">{t('proof.english.label')}</p>
              <p className="mt-2 text-sm font-semibold text-[var(--fg)]">{t('proof.english.value')}</p>
            </Surface>
          </div>
        </div>
      </motion.div>

      <motion.aside {...fadeInUp(0.1)} className="grid content-start gap-3">
        <Surface variant="terminal" className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{t('snapshotTitle')}</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">{t('snapshotBody')}</p>
        </Surface>

        {stats.map((stat) => (
          <MetricTile key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </motion.aside>
    </div>
  )
}
