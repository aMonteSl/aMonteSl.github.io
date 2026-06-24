'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { CheckIcon, SectionHeader, SectionShell, SparkIcon } from '@/components/ui'
import { fadeInUp } from '@/lib/motion'
import { RECOMMENDATIONS, type Recommendation } from '@/content/testimonials'
import { cn } from '@/lib/utils'

const typeTone = {
  professional: 'border-emerald-300/25 bg-emerald-300/8 text-emerald-200',
  academic: 'border-sky-300/25 bg-sky-300/8 text-sky-200',
  formal: 'border-[var(--accent)]/25 bg-[var(--accent)]/8 text-[var(--accent)]',
} as const

function RecommendationCard({
  recommendation,
  featured = false,
}: {
  recommendation: Recommendation
  featured?: boolean
}) {
  const t = useTranslations('testimonials')

  return (
    <motion.article
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)]/75 bg-[var(--card)]/58 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.18)]',
        'transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)]/35 hover:bg-[var(--card)]/70',
        featured && 'md:p-6 lg:min-h-[21rem]'
      )}
      {...fadeInUp()}
    >
      <div className="mb-5 flex min-h-10 flex-wrap items-start justify-between gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--accent)]/25 bg-[var(--accent)]/10 text-[var(--accent)]">
          <SparkIcon className="h-5 w-5" />
        </span>
        <span
          className={cn(
            'rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]',
            typeTone[recommendation.type]
          )}
        >
          {t(`types.${recommendation.type}`)}
        </span>
      </div>

      <div className={cn('mb-4', !featured && 'lg:min-h-[4.65rem]')}>
        <h3 className={cn('font-semibold leading-tight text-[var(--fg)]', featured ? 'text-2xl' : 'text-lg')}>
          {recommendation.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-[var(--accent)]/85">
          {t(recommendation.roleKey)}
        </p>
        <p className="mt-1 text-xs text-[var(--fg-muted)]">
          {recommendation.organization} · {recommendation.date}
        </p>
      </div>

      <p className={cn(
        'mb-5 text-sm leading-relaxed text-[var(--fg)]/78',
        featured ? 'max-w-4xl md:text-base' : 'lg:min-h-[8.75rem]'
      )}>
        {t(recommendation.summaryKey)}
      </p>

      <div className={cn('mb-5 flex flex-wrap content-start gap-2', !featured && 'lg:min-h-[3.1rem]')}>
        {recommendation.strengthKeys.map((strengthKey) => (
          <span
            key={strengthKey}
            className="rounded-full border border-[var(--border)]/70 bg-black/18 px-2.5 py-1 text-[11px] font-medium text-[var(--fg-muted)]"
          >
            {t(strengthKey)}
          </span>
        ))}
      </div>

      <div className="mt-auto border-t border-[var(--border)]/45 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--fg-muted)]">
          {t(recommendation.relationshipKey)}
        </p>
        <div className="flex items-center gap-2 text-xs text-[var(--fg)]/68">
          <CheckIcon className="h-4 w-4 shrink-0 text-emerald-300" />
          <span>{t('availableOnRequest')}</span>
        </div>
      </div>
    </motion.article>
  )
}

export function TestimonialsSection() {
  const t = useTranslations('testimonials')
  const featuredRecommendation = RECOMMENDATIONS.find((recommendation) => recommendation.id === 'david-moreno')
  const secondaryRecommendations = RECOMMENDATIONS.filter((recommendation) => recommendation.id !== 'david-moreno')

  return (
    <SectionShell id="testimonials" tone="default">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
      </div>

      <motion.div className="mb-10 md:mb-14" {...fadeInUp()}>
        <SectionHeader kicker={t('kicker')} title={t('title')} subtitle={t('subtitle')} align="left" />
      </motion.div>

      <motion.div
        className="mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {},
        }}
      >
        <div className="grid grid-cols-1 gap-4">
          {featuredRecommendation && (
            <RecommendationCard recommendation={featuredRecommendation} featured />
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {secondaryRecommendations.map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </div>
      </motion.div>
    </SectionShell>
  )
}
