'use client'

import { motion } from 'framer-motion'
import { fadeInUp, avatarHover, shouldAnimate } from '@/lib/motion'
import { Container, Avatar, Button } from '@/components/ui'
import { useTranslations } from '@/i18n'
import { LINKS } from '@/lib/constants'

export function Hero() {
  const t = useTranslations('hero')
  const animate = shouldAnimate()

  const bullets = [t('bullet1'), t('bullet2')]

  return (
    <section id="home" className="section-y">
      <Container size="md" className="text-center content-width mx-auto">
        {/* Animated Profile Photo */}
        <motion.div
          {...(animate ? fadeInUp(0) : {})}
          className="flex justify-center mb-6"
        >
          <motion.div
            {...(animate ? avatarHover : {})}
            className="relative group rounded-full will-change-transform hero-spotlight"
            tabIndex={0}
            role="img"
            aria-label="Profile photo of Adrián Montes"
          >
            {/* Enhanced ring with subtle glow */}
            <div className="absolute inset-0 rounded-full ring-2 ring-[var(--accent)]/60 ring-offset-2 ring-offset-[var(--bg)] transition-all duration-300 group-hover:ring-[var(--accent)]/80 group-hover:ring-offset-4 group-focus:ring-[var(--accent)]/80 group-focus:ring-offset-4" />

            {/* Avatar with shine effect */}
            <div className="relative shine-on-hover rounded-full overflow-hidden">
              <Avatar size="lg" loading="eager" fetchPriority="high" />
            </div>
          </motion.div>
        </motion.div>

        {/* Animated Name with Enhanced Typography */}
        <motion.div
          {...(animate ? fadeInUp(0.05) : {})}
          className="mb-4 will-change-transform"
        >
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="text-fluid-6xl md:text-fluid-7xl font-extrabold tracking-tight inline-block relative"
          >
            <motion.span
              whileHover={{ scale: 1.035 }}
              whileFocus={{ scale: 1.035 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'inline-block' }}
              className="relative after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:bg-[var(--accent)] after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:after:scale-x-100"
              tabIndex={0}
            >
              {t('title')}
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Open to internship badge */}
        <motion.div
          {...(animate ? fadeInUp(0.08) : {})}
          className="mb-6 will-change-transform"
        >
          <motion.span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm bg-[var(--card)]/70 ring-1 ring-[var(--border)]"
            initial={{ scale: 0.96, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.22 }}
          >
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse [animation-iteration-count:1]" />
            {t('openToWork')}
          </motion.span>
        </motion.div>

        {/* Animated Subtitles */}
        <motion.div
          {...(animate ? fadeInUp(0.12) : {})}
          className="space-y-2 mb-4"
        >
          <p className="text-fluid-2xl text-fg-muted">
            {t('subtitle1')}
          </p>
          <p className="text-fluid-xl text-accent">
            {t('subtitle2')}
          </p>
        </motion.div>

        {/* Value bullets */}
        <motion.ul
          {...(animate ? fadeInUp(0.14) : {})}
          className="mt-4 mb-6 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--fg-muted)]"
        >
          {bullets.map((text, i) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.18 }}
            >
              • {text}
            </motion.li>
          ))}
        </motion.ul>

        {/* Animated Tagline */}
        <motion.p
          {...(animate ? fadeInUp(0.16) : {})}
          className="text-fluid-lg text-fg-muted max-w-3xl mx-auto mb-8 leading-relaxed text-balance"
        >
          {t('tagline')}
        </motion.p>

        {/* Animated CTA Buttons */}
        <motion.div
          {...(animate ? fadeInUp(0.2) : {})}
          className="flex justify-center items-center mb-8"
        >
          <motion.div
            {...(animate ? fadeInUp(0.22) : {})}
            className="will-change-transform"
          >
            <Button asChild>
              <a href={LINKS.cv} download rel="noopener">
                {t('ctaResume')}
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          {...(animate ? fadeInUp(0.25) : {})}
          className="flex justify-center"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full ring-1 ring-[var(--border)]/60 hover:ring-[var(--accent)]/50 transition-all duration-200 hover:translate-y-0.5 focus-visible:ring-[var(--accent)]/50 focus-visible:outline-none"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="rotate-180">
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </motion.div>
      </Container>
    </section>
  )
}
