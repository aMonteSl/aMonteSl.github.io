'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowRightIcon, EmailIcon, GitHubIcon, LinkedInIcon, SectionHeader, SectionShell } from '@/components/ui'
import { EASING, DURATION, fadeInUp } from '@/lib/motion'
import { LINKS } from '@/lib/constants'
import { useEmailCopyFeedback } from '@/lib/hooks/useEmailCopyFeedback'

export function ContactCTASection() {
  const t = useTranslations('contact')
  const tNav = useTranslations('nav')
  const { copiedEmail, copyEmail } = useEmailCopyFeedback()

  return (
    <SectionShell id="contact">
      <SectionHeader
        kicker={t('kicker')}
        title={t('title')}
        subtitle={t('subtitle')}
        align="left"
      />

      <div className="mx-auto max-w-6xl">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 h-[22rem] w-[min(42rem,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/5 blur-[110px]" />
        </div>

        <motion.div
          className="overflow-hidden rounded-2xl border border-[var(--border)]/80 bg-[var(--card)]/50 shadow-[0_26px_90px_rgba(0,0,0,0.22)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
            hidden: {},
          }}
        >
          <motion.div
            className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:p-10"
            {...fadeInUp()}
          >
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
                {t('availabilityLabel')}
              </div>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base">
                {t('available')}
              </p>

              <div className="mt-7">
                <motion.a
                  href={LINKS.email}
                  onClick={copyEmail}
                  className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[var(--accent)]/35 bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#120d0b] shadow-[0_16px_42px_rgba(220,162,147,0.16)] transition-colors hover:bg-[var(--fg)] sm:w-auto"
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ duration: DURATION.fast, ease: EASING }}
                >
                  <EmailIcon className="h-4 w-4" />
                  <span>{t('cta')}</span>
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </motion.a>
                <p
                  aria-live="polite"
                  className={`mt-3 min-h-4 text-xs font-medium text-[var(--accent)] transition-opacity ${copiedEmail ? 'opacity-100' : 'opacity-0'}`}
                >
                  {tNav('emailCopied')}
                </p>
              </div>
            </div>

            <div className="min-w-0 rounded-xl border border-[var(--border)]/70 bg-black/14 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]/65">
                {t('or')}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <motion.a
                  href={LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-black/18 text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/35 hover:text-[var(--fg)]"
                  whileHover={{ y: -2 }}
                  transition={{ duration: DURATION.fast, ease: EASING }}
                  aria-label="GitHub"
                >
                  <GitHubIcon className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-black/18 text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/35 hover:text-[var(--fg)]"
                  whileHover={{ y: -2 }}
                  transition={{ duration: DURATION.fast, ease: EASING }}
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href={LINKS.email}
                  onClick={copyEmail}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-black/18 text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/35 hover:text-[var(--fg)]"
                  whileHover={{ y: -2 }}
                  transition={{ duration: DURATION.fast, ease: EASING }}
                  aria-label={t('email')}
                >
                  <EmailIcon className="h-5 w-5" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionShell>
  )
}
