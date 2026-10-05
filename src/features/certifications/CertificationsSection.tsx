'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import type { IconType } from 'react-icons'
import { FaAward, FaCode, FaLanguage, FaUniversity } from 'react-icons/fa'
import { CheckIcon, ClockIcon, ExternalLinkIcon, PinIcon, SectionHeader, SectionShell } from '@/components/ui'
import { localizePath, useLocale } from '@/i18n'
import { fadeInUp } from '@/lib/motion'
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
  if (
    normalized.includes('english') ||
    normalized.includes('cefr') ||
    normalized.includes('oxford') ||
    normalized.includes('professional development')
  ) {
    return FaLanguage
  }
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
          <SectionHeader kicker={t('kicker')} title={t('title')} subtitle={t('subtitle')} align="left" />
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.75fr)]">
          <CertificationStatusPanel status="completed" items={groupedByStatus.completed} />

          <div className="grid min-w-0 gap-5">
            {statusOrder
              .filter((status) => status !== 'completed' && groupedByStatus[status].length > 0)
              .map((status) => (
                <CertificationStatusPanel key={status} status={status} items={groupedByStatus[status]} compact />
              ))}
          </div>
        </div>
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
        // `@container` lets the card grid below follow the panel width instead of the viewport.
        '@container min-w-0 overflow-hidden rounded-2xl border border-[var(--border)]/70 bg-[var(--surface)]/40 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm',
        compact ? 'p-4 sm:p-5' : 'p-4 sm:p-5 lg:p-6'
      )}
      {...fadeInUp()}
    >
      <div className="mb-5 flex min-w-0 items-center gap-3 border-b border-[var(--border)]/45 pb-4">
        <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border', config.colors)}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          {/* The count sits on the title row so the description keeps the full text width on narrow panels. */}
          <div className="flex min-w-0 items-center justify-between gap-3">
            <h3 className="min-w-0 text-base font-semibold text-[var(--fg)]">
              {t(config.labelKey)}
            </h3>
            <span className="shrink-0 rounded-full border border-[var(--border)]/70 bg-black/22 px-2.5 py-1 text-xs font-medium text-[var(--fg-muted)]">
              {items.length}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[var(--fg-muted)]">
            {t(`statusDescriptions.${status}`)}
          </p>
        </div>
      </div>

      {/* 30rem, not `@lg` (32rem): at 1280px with the xl sidebar the completed panel is ~512px of content, so
          the 32rem step sat on the edge and a wider scrollbar or a zoom step would collapse it to one column. */}
      <div className={cn('grid gap-3', !compact && '@[30rem]:grid-cols-2')}>
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
    'oxfordC1',
    'oxfordC1Issuer',
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
    <article
      className={cn(
        'group flex min-h-full flex-col rounded-xl border border-[var(--border)]/75 bg-black/16 p-4 transition-[border-color,background-color,box-shadow] duration-200',
        'hover:border-[var(--accent)]/32 hover:bg-[var(--card)]/68 hover:shadow-[0_18px_55px_rgba(0,0,0,0.22)]',
        // Fixed heights only align cards once they sit side by side; on phones they would leave empty bands.
        compact ? 'md:min-h-[11rem]' : 'md:min-h-[13rem]'
      )}
    >
      <div className="mb-3 flex min-w-0 items-start justify-between gap-3 md:min-h-[4.25rem]">
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

      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[var(--fg)]/55 md:min-h-5">
        <span>{formatCertificationDate(cert.date, locale)}</span>
      </div>

      {cert.tags && cert.tags.length > 0 && (
        <div className="flex flex-wrap content-start gap-1.5 md:min-h-[4.25rem]">
          {cert.tags.map((tag) => {
            const TagIcon = getTagIcon(tag)

            return (
              <span
                key={tag}
                className="inline-flex min-h-6 max-w-full items-center gap-1.5 rounded-full border border-[var(--accent)]/16 bg-[var(--accent)]/8 px-2 py-0.5 text-[11px] font-medium text-[var(--accent)]"
              >
                <TagIcon className="h-3 w-3 shrink-0 opacity-85" aria-hidden />
                <span className="min-w-0 break-words">{tag}</span>
              </span>
            )
          })}
        </div>
      )}

      {href && (
        <div className="mt-auto flex items-end pt-4 md:min-h-9">
          {/* 40px hit area; the negative block margins keep the row at its previous visual height. */}
          <motion.a
            href={href}
            target={cert.linkType === 'internal' ? undefined : '_blank'}
            rel={cert.linkType === 'internal' ? undefined : 'noopener noreferrer'}
            className="-my-2.5 inline-flex min-h-10 w-fit items-center gap-1.5 py-2.5 text-xs font-semibold text-[var(--accent)] transition-colors hover:text-[var(--fg)]"
            whileHover={{ x: 2 }}
          >
            {t('verify')}
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </motion.a>
        </div>
      )}
    </article>
  )
}
