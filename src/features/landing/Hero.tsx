'use client'

import { motion } from 'framer-motion'
import { fadeInUp, avatarHover, shouldAnimate } from '@/lib/motion'
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
import { SOCIAL_LINKS, getCvUrl } from '@/lib/constants'
import { useEmailCopyFeedback } from '@/lib/hooks/useEmailCopyFeedback'
import { FEATURED_PROJECTS } from '@/content/featuredProjects'
import { useFeaturedRotation } from './useFeaturedRotation'
import { FeaturedProjectCard } from './FeaturedProjectCard'

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
  const { locale } = useLocale()
  const animate = shouldAnimate()
  const {
    activeItem: activeProject,
    activeIndex,
    goToIndex,
    pause,
    resume,
    total,
    progress,
    isPaused,
  } = useFeaturedRotation(FEATURED_PROJECTS)
  const cvUrl = getCvUrl(locale)
  const { copiedEmail, copyEmail } = useEmailCopyFeedback()

  return (
    <SectionShell id="home" className="flex min-h-[calc(100vh-4rem)] items-center pt-24 sm:pt-24 lg:pt-28" tone="xr">
      <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <motion.div {...(animate ? fadeInUp(0) : {})} className="order-2 flex flex-col items-center lg:order-1 lg:col-span-5">
          <Surface variant="xr" className="technical-frame w-full max-w-md p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]/55">
              <span>XR FIELD</span>
              <span>MD-ES / 2026</span>
            </div>

            <motion.div
              {...(animate ? avatarHover : {})}
              className="relative mx-auto w-fit will-change-transform"
              tabIndex={0}
              role="img"
              aria-label="Profile photo of Adrian Montes"
            >
              <div className="absolute -inset-6 rounded-full border border-[var(--accent)]/20" />
              <div className="relative overflow-hidden rounded-full border border-[var(--accent)]/28 bg-black/30 p-2 shadow-2xl shadow-black/35">
                <Avatar size="hero" loading="eager" fetchPriority="high" />
              </div>
            </motion.div>

            <DividerLine className="my-6" />

            <FeaturedProjectCard
              project={activeProject}
              activeIndex={activeIndex}
              total={total}
              progress={progress}
              isPaused={isPaused}
              onDotClick={goToIndex}
              onMouseEnter={pause}
              onMouseLeave={resume}
            />
          </Surface>
        </motion.div>

        <div className="order-1 flex flex-col items-center text-center lg:order-2 lg:col-span-7 lg:items-start lg:text-left">
          <motion.div {...(animate ? fadeInUp(0.02) : {})}>
            <Kicker className="justify-center lg:justify-start">{t('kicker')}</Kicker>
          </motion.div>

          <motion.h1
            {...(animate ? fadeInUp(0.05) : {})}
            className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-normal text-[var(--fg)] sm:text-5xl md:text-6xl xl:text-7xl"
          >
            {t('name')}
          </motion.h1>

          <motion.h2
            {...(animate ? fadeInUp(0.08) : {})}
            className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-[var(--fg-muted)] sm:text-lg"
          >
            {t('headline')}
          </motion.h2>

          <motion.div {...(animate ? fadeInUp(0.1) : {})} className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <StatusPill tone="success">
              <BriefcaseIcon className="h-3.5 w-3.5" />
              {t('availabilityLabel')}
            </StatusPill>
            <StatusPill tone="muted">{t('availabilityText')}</StatusPill>
            <StatusPill tone="xr">{t('location')}</StatusPill>
          </motion.div>

          <motion.p {...(animate ? fadeInUp(0.12) : {})} className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base">
            {t('aboutMe')}
          </motion.p>

          <motion.div {...(animate ? fadeInUp(0.14) : {})} className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
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
                    aria-label={link.key}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)]/75 bg-[var(--surface)]/55 text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/35 hover:text-[var(--fg)]"
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                  </a>
                )
              })}
            </div>
            <span
              aria-live="polite"
              className={`min-h-4 text-xs font-medium text-[var(--accent)] transition-opacity ${copiedEmail ? 'opacity-100' : 'opacity-0'}`}
            >
              {tNav('emailCopied')}
            </span>
          </motion.div>

          <motion.div {...(animate ? fadeInUp(0.18) : {})} className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            <MetricTile label={t('metrics.current.label')} value={t('metrics.current.value')} detail={t('metrics.current.detail')} />
            <MetricTile label={t('metrics.research.label')} value={t('metrics.research.value')} detail={t('metrics.research.detail')} />
            <MetricTile label={t('metrics.next.label')} value={t('metrics.next.value')} detail={t('metrics.next.detail')} />
          </motion.div>
        </div>
      </div>
    </SectionShell>
  )
}
