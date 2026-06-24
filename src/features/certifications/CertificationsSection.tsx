'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import type { IconType } from 'react-icons'
import { FaAward, FaCode, FaLanguage, FaUniversity } from 'react-icons/fa'
import { CheckIcon, ClockIcon, ExternalLinkIcon, PinIcon, SectionHeader, SectionShell } from '@/components/ui'
import { localizePath, useLocale } from '@/i18n'
import { EASING, DURATION, fadeInUp } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { CERTIFICATIONS } from '@/content/certifications'
import { getTechIcon } from '@/features/projects/components/TechTag'

const statusOrder = ['completed', 'in-progress', 'planned'] as const

const statusConfig = {
  completed: {
    colors: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
    dot: 'bg-emerald-400',
    Icon: CheckIcon,
    labelKey: 'completed',
  },
  'in-progress': {
    colors: 'border-amber-300/25 bg-amber-300/10 text-amber-200',
    dot: 'bg-amber-300',
    Icon: ClockIcon,
    labelKey: 'inProgress',
  },
  planned: {
    colors: 'border-sky-300/25 bg-sky-300/10 text-sky-200',
    dot: 'bg-sky-300',
    Icon: PinIcon,
    labelKey: 'planned',
  },
} as const

function getTagIcon(tag: string): IconType {
  const normalized = tag.toLowerCase()

  if (normalized.includes('urjc') || normalized.includes('upm')) return FaUniversity
  if (normalized.includes('english') || normalized.includes('professional development')) return FaLanguage
  if (normalized.includes('vissoft') || normalized.includes('icsme') || normalized.includes('code-xr')) return FaAward

  const TechIcon = getTechIcon(tag)
  return TechIcon === FaCode ? FaCode : TechIcon
}

function formatCertificationDate(date: string, locale: string) {
  if (!date) return ''

  if (/^\d{4}-Q[1-4]$/.test(date)) {
    const [year, quarter] = date.split('-')
    return `${quarter} ${year}`
  }

  if (/^\d{4}-\d{2}$/.test(date)) {
    const [year, month] = date.split('-')
    return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(
      new Date(Number(year), Number(month) - 1, 1),
    )
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(new Date(date))
  }

  return date
}

export function CertificationsSection() {
  const t = useTranslations('certificates')

  const groupedByStatus = {
    completed: CERTIFICATIONS.filter((cert) => cert.status === 'completed'),
    'in-progress': CERTIFICATIONS.filter((cert) => cert.status === 'in-progress'),
    planned: CERTIFICATIONS.filter((cert) => cert.status === 'planned'),
  }

  return (
    <SectionShell id="certifications">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-0 top-1/3 h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
        </div>

        <motion.div className="mb-10 md:mb-14" {...fadeInUp()}>
          <SectionHeader kicker="Professional record" title={t('title')} subtitle={t('subtitle')} align="left" />
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.75fr)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.12 } },
            hidden: {},
          }}
        >
          <CertificationStatusPanel status="completed" items={groupedByStatus.completed} />

          <div className="grid min-w-0 gap-5">
            {statusOrder
              .filter((status) => status !== 'completed')
              .map((status) => (
                <CertificationStatusPanel key={status} status={status} items={groupedByStatus[status]} compact />
              ))}
          </div>
        </motion.div>
    </SectionShell>
  )
}

function CertificationStatusPanel({
  status,
  items,
  compact = false,
}: {
  status: (typeof statusOrder)[number]
  items: typeof CERTIFICATIONS
  compact?: boolean
}) {
  const t = useTranslations('certificates')
  const config = statusConfig[status]
  const Icon = config.Icon

  return (
    <motion.section
      className={cn(
        'min-w-0 overflow-hidden rounded-2xl border border-[var(--border)]/70 bg-[var(--surface)]/40 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm',
        compact ? 'p-4 sm:p-5' : 'p-4 sm:p-5 lg:p-6'
      )}
      {...fadeInUp()}
    >
      <div className="mb-5 flex min-w-0 items-center justify-between gap-3 border-b border-[var(--border)]/45 pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border', config.colors)}>
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="min-w-0 text-base font-semibold text-[var(--fg)]">
              {t(config.labelKey)}
            </h3>
            <p className="mt-0.5 text-xs text-[var(--fg-muted)]">
              {t(`statusDescriptions.${status}`)}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-[var(--border)]/70 bg-black/22 px-2.5 py-1 text-xs font-medium text-[var(--fg-muted)]">
          {items.length}
        </span>
      </div>

      <div className={cn('grid gap-3', !compact && 'md:grid-cols-2')}>
        {items.map((cert) => (
          <CertificationCard key={cert.id} cert={cert} compact={compact} />
        ))}
      </div>
    </motion.section>
  )
}

function CertificationCard({
  cert,
  compact = false,
}: {
  cert: (typeof CERTIFICATIONS)[0]
  compact?: boolean
}) {
  const t = useTranslations('certificates')
  const { locale } = useLocale()
  const config = statusConfig[cert.status]

  const translatableCertKeys = [
    'cambridgeC1',
    'masterTelecomUPM',
    'masterTelecomUPMIssuer',
    'telematicsDegree',
    'telematicsDegreeIssuer',
    'codeXrAward',
    'codeXrAwardIssuer',
    'greenhouseHighDistinction',
    'greenhouseHighDistinctionIssuer',
    'stepByStepHighDistinction',
    'stepByStepHighDistinctionIssuer',
  ]
  const name = translatableCertKeys.includes(cert.name) ? t(cert.name) : cert.name
  const issuer = translatableCertKeys.includes(cert.issuer) ? t(cert.issuer) : cert.issuer
  const href = cert.linkType === 'internal' && cert.link ? localizePath(cert.link, locale) : cert.link

  return (
    <motion.article
      className={cn(
        'group flex min-h-full flex-col rounded-xl border border-[var(--border)]/75 bg-black/16 p-4 transition-all duration-200',
        'hover:border-[var(--accent)]/32 hover:bg-[var(--card)]/68 hover:shadow-[0_18px_55px_rgba(0,0,0,0.22)]',
        compact ? 'min-h-[11rem]' : 'min-h-[13rem]'
      )}
      whileHover={{ y: -2 }}
      transition={{ duration: DURATION.fast, ease: EASING }}
    >
      <div className="mb-3 flex min-h-[4.25rem] min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold leading-snug text-[var(--fg)]">
            {name}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-[var(--fg-muted)]">
            {issuer}
          </p>
        </div>
        <span className={cn('mt-1 h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_16px_currentColor]', config.dot)} />
      </div>

      <div className="mb-3 flex min-h-5 flex-wrap items-center gap-2 text-xs text-[var(--fg)]/55">
        <span>{formatCertificationDate(cert.date, locale)}</span>
      </div>

      {cert.tags && cert.tags.length > 0 && (
        <div className="flex min-h-[4.25rem] flex-wrap content-start gap-1.5">
          {cert.tags.map((tag) => {
            const TagIcon = getTagIcon(tag)

            return (
              <span
                key={tag}
                className="inline-flex min-h-6 items-center gap-1.5 rounded-full border border-[var(--accent)]/16 bg-[var(--accent)]/8 px-2 py-0.5 text-[11px] font-medium text-[var(--accent)]"
              >
                <TagIcon className="h-3 w-3 shrink-0 opacity-85" aria-hidden />
                <span>{tag}</span>
              </span>
            )
          })}
        </div>
      )}

      <div className="mt-auto flex min-h-9 items-end pt-4">
      {href ? (
        <motion.a
          href={href}
          target={cert.linkType === 'internal' ? undefined : '_blank'}
          rel={cert.linkType === 'internal' ? undefined : 'noopener noreferrer'}
          className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-[var(--accent)] transition-colors hover:text-[var(--fg)]"
          whileHover={{ x: 2 }}
        >
          {t('verify')}
          <ExternalLinkIcon className="h-3.5 w-3.5" />
        </motion.a>
      ) : null}
      </div>
    </motion.article>
  )
}
