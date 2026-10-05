'use client'

import { useId, useState } from 'react'
import {
  ArrowRightIcon,
  Avatar,
  DividerLine,
  EmailIcon,
  GitHubIcon,
  Kicker,
  LinkButton,
  LinkedInIcon,
  MetricTile,
  SectionShell,
  StatusPill,
  Surface,
} from '@/components/ui'
import { useTranslations, useLocale } from '@/i18n'
import { cn } from '@/lib/utils'
import { SOCIAL_LINKS, getCvUrl } from '@/lib/constants'
import { useEmailCopyFeedback } from '@/lib/hooks/useEmailCopyFeedback'
import { FEATURED_PROJECTS } from '@/content/featuredProjects'
import { SIDEBAR_BLEED_CLASS } from '@/features/morphNav/layout'
import { CURRENT_ROLE_ID } from '@/content/journey'
import { useEntryPhase } from '@/features/journey'
import { useFeaturedRotation } from './useFeaturedRotation'
import { FeaturedProjectCard } from './FeaturedProjectCard'

type SocialKey = (typeof SOCIAL_LINKS)[number]['key']

const METRIC_TILE_CLASS = 'lg:short:p-3'
const METRIC_DETAIL_CLASS = 'lg:short:max-xl:hidden'

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: EmailIcon,
}

export function Hero() {
  const t = useTranslations('hero')
  const tNav = useTranslations('nav')
  const tProfile = useTranslations('profile')
  const { locale } = useLocale()
  const {
    activeIndex,
    goToIndex,
    pause,
    resume,
    progress,
    isPaused,
    isUserPaused,
    togglePause,
  } = useFeaturedRotation(FEATURED_PROJECTS)
  const cvUrl = getCvUrl(locale)
  const { copiedEmail, copyEmail } = useEmailCopyFeedback()
  // On short screens (`short`: ≤900px tall) the long bio is clamped so the whole hero fits the first screen;
  // the full text stays in the DOM for screen readers and search engines.
  const [isBioExpanded, setIsBioExpanded] = useState(false)
  const bioId = useId()
  // Copy about the current role switches on its start date (see useEntryPhase)
  const isRoleUpcoming = useEntryPhase(CURRENT_ROLE_ID) === 'upcoming'
  const roleMetric = isRoleUpcoming ? 'metrics.upcoming' : 'metrics.current'
  const socialLabels: Record<SocialKey, string> = {
    github: t('social.github'),
    linkedin: t('social.linkedin'),
    email: t('social.email'),
  }

  return (
    <SectionShell
      id="home"
      // From lg the hero owns the first screen: content is centred between the 64px header and the fold
      className={`flex min-h-[calc(100svh-4rem)] items-center pt-24 lg:min-h-svh lg:pt-28 lg:pb-16 lg:short:pt-20 lg:short:pb-8 ${SIDEBAR_BLEED_CLASS}`}
      tone="xr"
    >
      <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10 xl:gap-14">
        {/* CSS entrance (.hero-enter): the first screen is visible before hydration */}
        <div className="hero-enter order-2 flex flex-col items-center [animation-delay:160ms] lg:order-1">
          <Surface variant="xr" className="technical-frame w-full max-w-md p-5 sm:p-6 lg:short:p-5">
            <div className="mb-5 flex items-center justify-between gap-4 text-[10px] lg:short:mb-3 font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]/55">
              <span>XR FIELD</span>
              <span>MD-ES / 2026</span>
            </div>

            <div
              className="relative mx-auto w-fit transition-transform duration-300 ease-[var(--ease)] hover:-translate-y-0.5 motion-reduce:transition-none"
              role="img"
              aria-label={tProfile('imageAlt')}
            >
              <div className="absolute -inset-6 rounded-full border border-[var(--accent)]/20" />
              <div className="relative overflow-hidden rounded-full border border-[var(--accent)]/28 bg-black/30 p-2 shadow-2xl shadow-black/35">
                {/* From lg the portrait scales with the viewport height (138px at 657px tall, capped at 224px) */}
                <Avatar
                  size="hero"
                  loading="eager"
                  fetchPriority="high"
                  className="lg:!h-[clamp(8rem,21svh,14rem)] lg:!w-[clamp(8rem,21svh,14rem)]"
                />
              </div>
            </div>

            <DividerLine className="my-6 lg:short:my-4" />

            <FeaturedProjectCard
              projects={FEATURED_PROJECTS}
              activeIndex={activeIndex}
              progress={progress}
              isPaused={isPaused}
              isUserPaused={isUserPaused}
              onDotClick={goToIndex}
              onTogglePause={togglePause}
              onPause={pause}
              onResume={resume}
            />
          </Surface>
        </div>

        <div className="order-1 flex flex-col items-center text-center lg:order-2 lg:items-start lg:text-left">
          <div className="hero-enter">
            <Kicker className="justify-center lg:justify-start">{t('kicker')}</Kicker>
          </div>

          <h1
            className="hero-enter mt-4 [animation-delay:40ms] max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-normal text-[var(--fg)] sm:text-5xl md:text-6xl lg:mt-3 lg:text-[clamp(2.75rem,7svh,4.5rem)]"
            translate="no"
          >
            {t('name')}
          </h1>

          <h2
            className="hero-enter mt-4 [animation-delay:80ms] lg:short:mt-3 max-w-2xl text-balance text-base font-medium leading-relaxed text-[var(--fg-muted)] sm:text-lg"
          >
            {t('headline')}
          </h2>

          <div className="hero-enter mt-6 flex [animation-delay:120ms] lg:short:mt-4 flex-wrap items-center justify-center gap-3 lg:justify-start">
            <StatusPill tone="success">
              <BriefcaseIcon className="h-3.5 w-3.5" />
              {t(isRoleUpcoming ? 'availabilityLabelUpcoming' : 'availabilityLabel')}
            </StatusPill>
            <StatusPill tone="muted">{t(isRoleUpcoming ? 'availabilityTextUpcoming' : 'availabilityText')}</StatusPill>
            <StatusPill tone="xr">{t('location')}</StatusPill>
          </div>

          <div className="hero-enter relative mt-7 flex [animation-delay:160ms] lg:short:mt-5 flex-wrap items-center justify-center gap-3 lg:justify-start">
            <LinkButton href={cvUrl} download rel="noopener">
              {t('ctaResume')}
              <ArrowRightIcon className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="#projects" className="border-[var(--border)]/80 bg-[var(--surface)]/60 text-[var(--fg)] hover:bg-[var(--surface-strong)]">
              {t('ctaProjects')}
            </LinkButton>

            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((link) => {
                const Icon = iconMap[link.icon]
                return (
                  <a
                    key={link.key}
                    href={link.key === 'email' ? `${link.href}?subject=Contact%20-%20Adrian%20Montes%20Linares` : link.href}
                    target={link.key === 'email' ? undefined : '_blank'}
                    rel={link.key === 'email' ? undefined : 'noopener noreferrer'}
                    onClick={link.key === 'email' ? copyEmail : undefined}
                    aria-label={socialLabels[link.key]}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)]/75 bg-[var(--surface)]/55 text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/35 hover:text-[var(--fg)]"
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                  </a>
                )
              })}
            </div>
            {/* Out of flow so the CTA row keeps its height; the text mounts only while copied so aria-live announces it. */}
            <span
              aria-live="polite"
              className="pointer-events-none absolute inset-x-0 -bottom-5 min-h-4 text-center text-xs font-medium text-[var(--accent)] lg:text-left"
            >
              {copiedEmail ? tNav('emailCopied') : null}
            </span>
          </div>

          <div className="hero-enter mt-8 w-full max-w-2xl text-left [animation-delay:200ms] lg:short:mt-5">
            <p
              id={bioId}
              className={cn(
                'text-pretty text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base',
                !isBioExpanded && 'short:line-clamp-4 lg:short:line-clamp-3'
              )}
            >
              {t(isRoleUpcoming ? 'aboutMeUpcoming' : 'aboutMe')}
            </p>
            {/* Only short screens clamp the bio, so only they need the toggle */}
            <button
              type="button"
              onClick={() => setIsBioExpanded((expanded) => !expanded)}
              aria-expanded={isBioExpanded}
              aria-controls={bioId}
              className="mt-1 hidden min-h-9 items-center gap-1 rounded-lg text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] short:inline-flex pointer-coarse:min-h-11"
            >
              {t(isBioExpanded ? 'readLess' : 'readMore')}
              <ArrowRightIcon className={cn('h-3.5 w-3.5 transition-transform duration-200', isBioExpanded ? '-rotate-90' : 'rotate-90')} />
            </button>
          </div>

          <div className="hero-enter mt-8 grid [animation-delay:240ms] w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 lg:short:mt-5">
            {/* Short lg/laptop screens: tighter tiles; below xl the narrow columns would wrap the detail onto two lines */}
            <MetricTile label={t(`${roleMetric}.label`)} value={t(`${roleMetric}.value`)} detail={t(`${roleMetric}.detail`)} className={METRIC_TILE_CLASS} detailClassName={METRIC_DETAIL_CLASS} />
            <MetricTile label={t('metrics.research.label')} value={t('metrics.research.value')} detail={t('metrics.research.detail')} className={METRIC_TILE_CLASS} detailClassName={METRIC_DETAIL_CLASS} />
            <MetricTile label={t('metrics.next.label')} value={t('metrics.next.value')} detail={t('metrics.next.detail')} className={METRIC_TILE_CLASS} detailClassName={METRIC_DETAIL_CLASS} />
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
