'use client'

import type { ReactElement } from 'react'
import { motion } from 'framer-motion'
import { useMorphNav } from '@/features/morphNav/MorphNavProvider'
import { sidebarItemVariants } from '@/features/morphNav/morphVariants'
import { LanguageSwitcher } from '@/features/language'
import { Avatar, Button, EmailIcon, GitHubIcon, LinkedInIcon } from '@/components/ui'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, SOCIAL_LINKS, getCvUrl } from '@/lib/constants'
import { useEmailCopyFeedback } from '@/lib/hooks/useEmailCopyFeedback'
import { useTranslations, useLocale } from '@/i18n'

const iconMap: Record<string, () => ReactElement> = {
  github: () => <GitHubIcon className="w-5 h-5" />,
  linkedin: () => <LinkedInIcon className="w-5 h-5" />,
  email: () => <EmailIcon className="w-5 h-5" />,
}

export interface SidebarPanelProps {
  /**
   * Rendered inside the mobile/tablet drawer instead of the fixed desktop sidebar:
   * larger touch targets and nav items always visible (the drawer can open at scroll 0).
   */
  inDrawer?: boolean
}

/**
 * Shared content of the desktop sidebar and the mobile drawer: avatar, socials,
 * CV download, section navigation and language switcher.
 *
 * The root is the scroll region, so short viewports (1280x720) and small phones
 * scroll the panel instead of clipping the last items.
 */
export function SidebarPanel({ inDrawer = false }: SidebarPanelProps) {
  const { isMorphed, scrollToSection, activeSection, closeDrawer } = useMorphNav()
  const t = useTranslations('nav')
  const tHero = useTranslations('hero')
  const { locale } = useLocale()
  const cvUrl = getCvUrl(locale)
  const { copiedEmail, copyEmail } = useEmailCopyFeedback()

  // The desktop sidebar reveals its items with the morph; the drawer must show them regardless.
  const itemsVisible = inDrawer || isMorphed

  const navigateTo = (sectionId: string) => {
    closeDrawer()
    scrollToSection(sectionId)
  }

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain [scrollbar-width:thin]',
        inDrawer
          ? 'px-5 pt-16 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6'
          : 'px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]'
      )}
    >
      <div
        className={cn(
          'rounded-2xl border border-[var(--border)]/70 bg-[var(--surface)]/45 text-center shadow-[0_18px_60px_rgba(0,0,0,0.22)]',
          inDrawer ? 'mb-5 p-4' : 'mb-3 p-3'
        )}
      >
        <motion.button
          type="button"
          onClick={() => navigateTo('home')}
          className={cn(
            'rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] cursor-pointer group',
            inDrawer ? 'mb-3' : 'mb-2'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={t('goHome')}
        >
          <div className="relative rounded-full ring-2 ring-[var(--accent)]/20 group-hover:ring-[var(--accent)]/50 transition-colors duration-300">
            {/* Short laptop screens (≤800px tall, e.g. 1366×768) get a smaller portrait so the whole rail fits */}
            <Avatar size="lg" className={inDrawer ? '!h-24 !w-24' : '!h-20 !w-20 [@media(max-height:50rem)]:!h-16 [@media(max-height:50rem)]:!w-16'} />
          </div>
        </motion.button>
        <h2 className={cn('font-semibold leading-tight text-[var(--fg)]', inDrawer ? 'text-base' : 'text-sm')}>
          Adrián Montes
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-[var(--fg-muted)]">
          {tHero('headline')}
        </p>
      </div>

      <div className={cn('grid grid-cols-3 gap-2', inDrawer ? 'mb-4' : 'mb-3')}>
        {SOCIAL_LINKS.map(({ key, href, icon }) => {
          const IconComponent = iconMap[icon]
          return (
            <a
              key={key}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              onClick={href.startsWith('mailto:') ? copyEmail : undefined}
              className={cn(
                'flex items-center justify-center rounded-xl border border-[var(--border)]/70 bg-[var(--surface)]/35 text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/35 hover:bg-[var(--accent)]/8 hover:text-[var(--fg)]',
                inDrawer ? 'h-11' : 'h-9 pointer-coarse:h-11'
              )}
              aria-label={key}
            >
              {IconComponent && <IconComponent />}
            </a>
          )
        })}
      </div>
      <div
        aria-live="polite"
        className={cn(
          'min-h-4 text-center text-[11px] font-medium text-[var(--accent)] transition-opacity',
          copiedEmail ? 'opacity-100' : 'opacity-0',
          inDrawer ? 'mb-3' : 'mb-2'
        )}
      >
        {t('emailCopied')}
      </div>

      <div className={cn(inDrawer ? 'mb-5' : 'mb-3')}>
        <Button
          asChild
          variant="outline"
          className={cn(
            'w-full justify-center border-[var(--accent)]/25 bg-transparent shadow-none hover:bg-[var(--accent)]/8',
            inDrawer ? 'h-11 text-sm' : 'h-9 text-xs pointer-coarse:h-11'
          )}
        >
          <a href={cvUrl} download rel="noopener">
            {tHero('ctaResume')}
          </a>
        </Button>
      </div>

      <nav
        className={cn(inDrawer ? 'flex-none overflow-visible pr-1' : 'flex-none overflow-visible')}
        role="navigation"
        aria-label={t('sidebarNavigation')}
      >
        <ul className={cn(inDrawer ? 'space-y-1.5' : 'space-y-1')}>
          {NAV_ITEMS.map(({ key, href }, index) => {
            const sectionId = href.replace('#', '')
            const isActive = activeSection === sectionId

            return (
              <motion.li
                key={key}
                custom={index}
                initial={false}
                animate={itemsVisible ? 'visible' : 'hidden'}
                variants={sidebarItemVariants}
              >
                <button
                  type="button"
                  onClick={() => navigateTo(sectionId)}
                  className={cn(
                    'group relative flex w-full items-center gap-3 rounded-xl text-left font-medium transition-colors duration-200',
                    inDrawer
                      ? 'min-h-11 px-3 py-2.5 text-sm'
                      : 'min-h-9 px-3 py-1.5 text-xs pointer-coarse:min-h-11 [@media(max-height:50rem)]:min-h-8 [@media(max-height:50rem)]:py-1',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
                    isActive
                      ? 'border border-[var(--accent)]/25 bg-[var(--accent)]/10 text-[var(--fg)]'
                      : 'border border-transparent text-[var(--fg-muted)] hover:border-[var(--border)]/70 hover:bg-[var(--surface)]/45 hover:text-[var(--fg)]'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={cn(
                      'h-2 w-2 shrink-0 rounded-full transition-colors',
                      isActive
                        ? 'bg-[var(--accent)] shadow-[0_0_12px_rgba(220,162,147,0.65)]'
                        : 'bg-[var(--fg-muted)]/25 group-hover:bg-[var(--accent)]/50'
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate">{t(key)}</span>
                </button>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      <div className={cn('border-t border-[var(--border)]/60', inDrawer ? 'mt-5 pt-4' : 'mt-auto pt-3')}>
        <div className="flex items-center justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}
