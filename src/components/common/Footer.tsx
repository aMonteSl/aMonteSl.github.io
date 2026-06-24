'use client'

import { localizeHash, localizePath, useTranslations, useLocale } from '@/i18n'
import { Container, EmailIcon, ExternalLinkIcon, GitHubIcon, LinkedInIcon } from '@/components/ui'
import { LINKS, SITE, getCvUrl } from '@/lib/constants'
import { useEmailCopyFeedback } from '@/lib/hooks/useEmailCopyFeedback'
import { motion } from 'framer-motion'

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const { locale } = useLocale()
  const currentYear = new Date().getFullYear()
  const { copiedEmail, copyEmail } = useEmailCopyFeedback()

  const navLinks = [
    { label: t('links.home'), href: localizeHash('#home', locale) },
    { label: t('links.profile'), href: localizeHash('#profile', locale) },
    { label: t('links.projects'), href: localizeHash('#projects', locale) },
    { label: t('links.skills'), href: localizeHash('#skills', locale) },
    { label: t('links.journey'), href: localizeHash('#journey', locale) },
    { label: t('links.testimonials'), href: localizeHash('#testimonials', locale) },
    { label: t('links.certifications'), href: localizeHash('#certifications', locale) },
    { label: t('links.contact'), href: localizeHash('#contact', locale) },
    { label: t('links.uses'), href: localizePath('/uses', locale) },
  ]

  const resourceLinks = [
    { label: t('links.cv'), href: getCvUrl(locale), external: true },
    { label: t('links.source'), href: LINKS.github + '/aMonteSl.github.io', external: true },
  ]

  const socialLinks = [
    { label: 'GitHub', href: LINKS.github, icon: 'github' as const },
    { label: 'LinkedIn', href: LINKS.linkedin, icon: 'linkedin' as const },
    { label: 'Email', href: LINKS.email, icon: 'email' as const },
  ]

  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--card)]/30">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 h-[14rem] w-[min(42rem,90vw)] -translate-x-1/2 rounded-full bg-[var(--accent)]/4 blur-[120px]" />
      </div>

      <Container>
        <div className="relative py-10 sm:py-14">
          <div className="mb-9 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.25fr_1.05fr_0.75fr_0.75fr] lg:gap-10">
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="mb-2 text-lg font-semibold text-[var(--fg)]">{SITE.author}</p>
              <p className="max-w-sm text-sm leading-relaxed text-[var(--fg-muted)]">
                {t('brand')}
              </p>
            </div>

            <div className="min-w-0">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]/60">
                {t('sections.navigation')}
              </h3>
              <ul className="grid grid-cols-2 gap-x-5 gap-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex min-h-6 items-center text-sm text-[var(--fg-muted)] transition-colors duration-200 hover:text-[var(--fg)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]/60">
                {t('sections.resources')}
              </h3>
              <ul className="space-y-2.5">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="inline-flex min-h-6 max-w-full items-center gap-1.5 text-sm text-[var(--fg-muted)] transition-colors duration-200 hover:text-[var(--fg)]"
                    >
                      <span className="min-w-0 truncate">{link.label}</span>
                      {link.external && (
                        <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0 opacity-50" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]/60">
                {t('sections.connect')}
              </h3>
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.icon}
                    href={link.href}
                    target={link.icon !== 'email' ? '_blank' : undefined}
                    rel={link.icon !== 'email' ? 'noopener noreferrer' : undefined}
                    onClick={link.icon === 'email' ? copyEmail : undefined}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--fg-muted)] transition-colors duration-200 hover:border-[var(--accent)]/40 hover:text-[var(--fg)]"
                    aria-label={link.label}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.icon === 'github' && <GitHubIcon className="h-4 w-4" />}
                    {link.icon === 'linkedin' && <LinkedInIcon className="h-4 w-4" />}
                    {link.icon === 'email' && <EmailIcon className="h-4 w-4" />}
                  </motion.a>
                ))}
              </div>
              <p
                aria-live="polite"
                className={`mt-2 min-h-4 text-xs font-medium text-[var(--accent)] transition-opacity ${copiedEmail ? 'opacity-100' : 'opacity-0'}`}
              >
                {tNav('emailCopied')}
              </p>
            </div>
          </div>

          <div className="mb-6 h-px bg-[var(--border)]/60" />

          <div className="flex flex-col items-start justify-between gap-3 text-left sm:flex-row sm:items-center">
            <p className="text-xs text-[var(--fg-muted)]/60">
              &copy; {currentYear} {SITE.author}. {t('copyright')}
            </p>
            <p className="text-xs text-[var(--fg-muted)]/40">
              {t('by')}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
