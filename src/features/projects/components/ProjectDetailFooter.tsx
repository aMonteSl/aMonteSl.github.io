'use client'

import {
  ArrowLeftIcon,
  EmailIcon,
  GitHubIcon,
  LinkedInIcon,
} from '@/components/ui'
import { localizeHash, useLocale, useTranslations } from '@/i18n'
import { LINKS, SITE } from '@/lib/constants'
import { useEmailCopyFeedback } from '@/lib/hooks/useEmailCopyFeedback'

const contactLinks = [
  { label: 'GitHub', href: LINKS.github, Icon: GitHubIcon, external: true },
  { label: 'LinkedIn', href: LINKS.linkedin, Icon: LinkedInIcon, external: true },
  { label: 'Email', href: LINKS.email, Icon: EmailIcon, external: false },
] as const

export function ProjectDetailFooter() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const { locale } = useLocale()
  const year = new Date().getFullYear()
  const { copiedEmail, copyEmail } = useEmailCopyFeedback()

  return (
    <footer className="rounded-2xl border border-[var(--border)]/60 bg-[var(--surface)]/30 px-4 py-4 backdrop-blur-sm sm:px-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--fg)]">{SITE.author}</p>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[var(--fg-muted)]">{t('brand')}</p>
          <p className="mt-2 text-[11px] text-[var(--fg-muted)]/60">
            &copy; {year} {SITE.author}. {t('copyright')} &middot; {t('by')}
          </p>
        </div>

        <div className="shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={localizeHash('#projects', locale)}
              className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-[var(--border)]/65 bg-black/12 px-3 text-xs font-semibold text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/45 hover:text-[var(--fg)]"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              <span>{t('links.projects')}</span>
            </a>

            {contactLinks.map(({ label, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
                onClick={!external ? copyEmail : undefined}
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)]/65 bg-black/12 text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/45 hover:text-[var(--fg)]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p
            aria-live="polite"
            className={`mt-2 min-h-4 text-right text-[11px] font-medium text-[var(--accent)] transition-opacity ${copiedEmail ? 'opacity-100' : 'opacity-0'}`}
          >
            {tNav('emailCopied')}
          </p>
        </div>
      </div>
    </footer>
  )
}
