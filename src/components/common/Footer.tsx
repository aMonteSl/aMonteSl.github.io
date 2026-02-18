'use client'

import { useTranslations, useLocale } from '@/i18n'
import { Container } from '@/components/ui'
import { LINKS, SITE, getCvUrl } from '@/lib/constants'
import { motion } from 'framer-motion'

export function Footer() {
  const t = useTranslations('footer')
  const { locale } = useLocale()
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { label: t('links.home'), href: '#home' },
    { label: t('links.projects'), href: '#projects' },
    { label: t('links.skills'), href: '#skills' },
    { label: t('links.journey'), href: '#journey' },
    { label: t('links.uses'), href: '/uses' },
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
    <footer className="border-t border-[var(--border)] bg-[var(--card)]/30 relative overflow-hidden">
      {/* Subtle gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[var(--accent)]/3 rounded-full blur-[120px]" />
      </div>

      <Container>
        <div className="relative py-12 sm:py-16">
          {/* Main footer grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="font-semibold text-[var(--fg)] text-lg mb-2">{SITE.author}</p>
              <p className="text-[var(--fg-muted)] text-sm leading-relaxed max-w-xs">
                Telematics Engineer. Full-Stack (TypeScript/Node/React), DevTools & XR.
              </p>
            </div>

            {/* Navigation links */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]/60 mb-4">
                {t('sections.navigation')}
              </h3>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]/60 mb-4">
                {t('sections.resources')}
              </h3>
              <ul className="space-y-2.5">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-200 inline-flex items-center gap-1"
                    >
                      {link.label}
                      {link.external && (
                        <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]/60 mb-4">
                {t('sections.connect')}
              </h3>
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.icon}
                    href={link.href}
                    target={link.icon !== 'email' ? '_blank' : undefined}
                    rel={link.icon !== 'email' ? 'noopener noreferrer' : undefined}
                    className="w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--accent)]/40 transition-colors duration-200"
                    aria-label={link.label}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SocialIcon name={link.icon} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[var(--border)]/60 mb-6" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[var(--fg-muted)]/60 text-xs">
              &copy; {currentYear} {SITE.author}. {t('copyright')}
            </p>
            <p className="text-[var(--fg-muted)]/40 text-xs">
              {t('by')}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}

function SocialIcon({ name }: { name: 'github' | 'linkedin' | 'email' }) {
  switch (name) {
    case 'github':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    case 'email':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
  }
}
