'use client'

import { motion } from 'framer-motion'
import { fadeInUp, avatarHover, shouldAnimate } from '@/lib/motion'
import { Container, Avatar, Button } from '@/components/ui'
import { useTranslations, useLocale } from '@/i18n'
import { SOCIAL_LINKS, getCvUrl } from '@/lib/constants'
import { FEATURED_PROJECTS } from '@/content/featuredProjects'
import { useFeaturedRotation } from './useFeaturedRotation'
import { FeaturedProjectCard } from './FeaturedProjectCard'

// Icons
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: EmailIcon,
}

export function Hero() {
  const t = useTranslations('hero')
  const { locale } = useLocale()
  const animate = shouldAnimate()

  // Featured projects rotation
  const {
    activeItem: activeProject,
    activeIndex,
    goToIndex,
    pause,
    resume,
    total,
  } = useFeaturedRotation(FEATURED_PROJECTS)

  // CV URL based on current locale
  const cvUrl = getCvUrl(locale)

  return (
    <section id="home" className="min-h-[calc(100vh-4rem)] flex items-center pt-20 sm:pt-16 md:pt-20 lg:pt-24 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
      <Container size="xl" className="w-full">
        {/* Two-column grid: visual left, copy right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 xl:gap-20 items-center">
          {/* Left Column — Visual */}
          <motion.div
            {...(animate ? fadeInUp(0) : {})}
            className="lg:col-span-5 flex flex-col items-center"
          >
            {/* Avatar with enhanced styling */}
            <motion.div
              {...(animate ? avatarHover : {})}
              className="relative group will-change-transform"
              tabIndex={0}
              role="img"
              aria-label="Profile photo of Adrián Montes"
            >
              {/* Outer glow ring */}
              <div className="absolute -inset-5 sm:-inset-6 md:-inset-8 rounded-full bg-gradient-to-br from-[var(--accent)]/20 via-transparent to-[var(--accent)]/10 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Primary ring */}
              <div className="absolute inset-0 rounded-full ring-2 ring-[var(--accent)]/40 ring-offset-4 sm:ring-offset-6 md:ring-offset-8 ring-offset-[var(--bg)] transition-all duration-300 group-hover:ring-[var(--accent)]/60" />

              {/* Avatar container */}
              <div className="relative shine-on-hover rounded-full overflow-hidden shadow-2xl shadow-black/30">
                <Avatar size="hero" loading="eager" fetchPriority="high" />
              </div>

              {/* Floating accent dot */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 rounded-full bg-[var(--accent)] shadow-lg shadow-[var(--accent)]/30"
              />
            </motion.div>

            {/* Featured Project Card with rotation — hidden on mobile */}
            <motion.div
              {...(animate ? fadeInUp(0.2) : {})}
              className="hidden lg:block mt-8 w-full max-w-sm"
            >
              <FeaturedProjectCard
                project={activeProject}
                activeIndex={activeIndex}
                total={total}
                onDotClick={goToIndex}
                onMouseEnter={pause}
                onMouseLeave={resume}
              />
            </motion.div>
          </motion.div>

          {/* Right Column — Copy */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* H1: Name */}
            <motion.h1
              {...(animate ? fadeInUp(0.05) : {})}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-[var(--fg)] leading-[1.1] mb-3 sm:mb-4"
            >
              {t('name')}
            </motion.h1>

            {/* H2: Role */}
            <motion.h2
              {...(animate ? fadeInUp(0.08) : {})}
              className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-semibold text-[var(--fg-muted)] mb-4 sm:mb-5"
            >
              {t('headline')}
            </motion.h2>

            {/* Badges row - availability + location */}
            <motion.div
              {...(animate ? fadeInUp(0.1) : {})}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-5 sm:mb-6"
            >
              {/* Availability badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 bg-[var(--accent)]/10 backdrop-blur-sm ring-1 ring-[var(--accent)]/25">
                <BriefcaseIcon className="w-4 h-4 text-[var(--accent)]" />
                <span className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-[var(--accent)]">{t('availabilityLabel')}</span>
                  <span className="text-[var(--fg-muted)]">·</span>
                  <span className="text-[var(--fg-muted)]">{t('availabilityText')}</span>
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
                </span>
              </div>

              {/* Location badge */}
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/5 backdrop-blur-sm ring-1 ring-white/10 text-sm text-[var(--fg-muted)]">
                <span>{t('location')}</span>
                <span>·</span>
                <span>{t('language')}</span>
              </div>
            </motion.div>

            {/* About Me paragraph */}
            <motion.p
              {...(animate ? fadeInUp(0.12) : {})}
              className="text-sm sm:text-base text-[var(--fg-muted)] max-w-prose leading-relaxed mb-6 sm:mb-8"
            >
              {t('aboutMe')}
            </motion.p>

            {/* CTA Buttons + Social Icons */}
            <motion.div
              {...(animate ? fadeInUp(0.14) : {})}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-4"
            >
              {/* Primary: Download CV — prominent with glow */}
              <Button asChild size="lg" className="group relative overflow-hidden shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 transition-shadow">
                <a href={cvUrl} download rel="noopener">
                  {t('ctaResume')}
                </a>
              </Button>

              {/* Secondary: View Projects */}
              <Button asChild variant="outline" size="lg">
                <a href="#projects">{t('ctaProjects')}</a>
              </Button>

              {/* Social Icons - aligned with buttons */}
              <div className="flex items-center gap-2 ml-0 lg:ml-2">
                {SOCIAL_LINKS.map((link) => {
                  const Icon = iconMap[link.icon]
                  return (
                    <a
                      key={link.key}
                      href={link.key === 'email' ? `${link.href}?subject=Contact%20%E2%80%94%20Adri%C3%A1n%20Montes%20Linares` : link.href}
                      target={link.key === 'email' ? undefined : '_blank'}
                      rel={link.key === 'email' ? undefined : 'noopener noreferrer'}
                      aria-label={link.key}
                      className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--card)]/60 text-[var(--fg-muted)] ring-1 ring-[var(--border)]/50 backdrop-blur-sm transition-all duration-200 hover:text-[var(--fg)] hover:ring-[var(--accent)]/50 hover:bg-[var(--card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
}
