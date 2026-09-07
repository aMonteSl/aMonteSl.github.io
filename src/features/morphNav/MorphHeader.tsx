'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useMorphNav } from '@/features/morphNav/MorphNavProvider'
import { headerVariants } from '@/features/morphNav/morphVariants'
import { MORPH_NAV_DRAWER_ID } from '@/features/morphNav/MorphDrawer'
import { LanguageSwitcher } from '@/features/language'
import { Avatar, IconButton, MenuIcon } from '@/components/ui'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/constants'
import { localizePath, useLocale, useTranslations } from '@/i18n'

/**
 * The morphing header that fades out as user scrolls down.
 * From `xl` it carries the full section nav; below that, the language switcher
 * and a hamburger that opens the navigation drawer.
 */
export function MorphHeader() {
  const { progress, scrollToSection, activeSection, isDrawerOpen, toggleDrawer } = useMorphNav()
  const t = useTranslations('nav')
  const { locale } = useLocale()

  // Hide header when fully morphed. The faded header stays in the DOM, so it is also
  // made inert: otherwise its brand link, nav buttons and hamburger would keep taking
  // focus while invisible (e.g. after the drawer hands focus back to the hamburger).
  const isVisible = progress < 1

  // Interpolate styles based on progress
  const opacity = 1 - progress
  const translateY = -20 * progress

  return (
    <motion.header
      initial="visible"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={headerVariants}
      inert={!isVisible}
      style={{
        opacity,
        y: translateY,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      className={cn(
        'fixed top-0 left-0 right-0 z-40 w-full transition-colors duration-300',
        'border-b backdrop-blur-md',
        progress > 0.1
          ? 'bg-[var(--bg)]/80 border-[var(--border)]/50 shadow-sm'
          : 'bg-transparent border-transparent'
      )}
    >
      {/* Same container as the sections (max-w-7xl) so the header lines up with the content;
          the old 1200px `.container` left the desktop nav wrapping onto two lines at every width. */}
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand: Avatar + Name with shared layoutId */}
        <Link
          href={localizePath('/', locale)}
          aria-label={t('goHome')}
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] rounded-lg group"
        >
          <motion.div layoutId="profile-avatar">
            <Avatar size="sm" />
          </motion.div>
          <motion.span
            layoutId="profile-name"
            className="font-semibold text-sm sm:text-base text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors duration-200"
          >
            {/* The full name lives in the hero h1; the header keeps the short form so the
                eight nav items, the divider and the language switcher fit in one 1216px row. */}
            <span className="hidden sm:inline">Adrián Montes</span>
            <span className="sm:hidden">Adrián M.</span>
          </motion.span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden shrink-0 items-center gap-2.5 xl:flex">
          <nav className="flex items-center gap-0.5" role="navigation" aria-label={t('mainNavigation')}>
            {NAV_ITEMS.map(({ key, href }) => {
              const sectionId = href.replace('#', '')
              const isActive = activeSection === sectionId

              return (
                <button
                  key={key}
                  onClick={() => scrollToSection(sectionId)}
                  className={cn(
                    'relative whitespace-nowrap px-1.5 py-2 text-xs font-medium rounded-lg transition-all duration-200',
                    'after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:rounded-full after:bg-[var(--accent)] after:transition-all after:duration-200',
                    isActive
                      ? 'text-[var(--fg)] after:w-4 after:opacity-100'
                      : 'text-[var(--fg-muted)] after:w-0 after:opacity-0 hover:text-[var(--fg)] hover:bg-[var(--card)]/30'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {t(key)}
                </button>
              )
            })}
          </nav>

          <div className="h-5 w-px bg-[var(--border)]/50" aria-hidden="true" />

          <LanguageSwitcher />
        </div>

        {/* Below xl: language switcher + hamburger opening the navigation drawer */}
        <div className="flex items-center gap-2 xl:hidden">
          <LanguageSwitcher />
          <IconButton
            type="button"
            onClick={toggleDrawer}
            className="h-11 w-11"
            aria-label={t('openMenu')}
            aria-expanded={isDrawerOpen}
            aria-controls={isDrawerOpen ? MORPH_NAV_DRAWER_ID : undefined}
          >
            <MenuIcon className="h-6 w-6" />
          </IconButton>
        </div>
      </div>
    </motion.header>
  )
}
