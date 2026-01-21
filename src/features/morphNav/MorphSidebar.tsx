'use client'

import { useState, type ReactElement } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useMorphNav } from '@/features/morphNav/MorphNavProvider'
import {
  sidebarItemVariants,
  floatingButtonVariants,
  drawerVariants,
  backdropVariants,
} from '@/features/morphNav/morphVariants'
import { LanguageSwitcher } from '@/features/language'
import { Avatar, Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, SOCIAL_LINKS, getCvUrl } from '@/lib/constants'
import { useTranslations, useLocale } from '@/i18n'

// Social icon components
function GitHubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

const iconMap: Record<string, () => ReactElement> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: EmailIcon,
}

/**
 * The morphing sidebar that appears as user scrolls past the hero.
 * On mobile, becomes a floating button that opens a drawer.
 */
export function MorphSidebar() {
  const { isMorphed, scrollToSection, activeSection, prefersReducedMotion } = useMorphNav()
  const t = useTranslations('nav')
  const tHero = useTranslations('hero')
  const { locale } = useLocale()
  const cvUrl = getCvUrl(locale)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Use Framer Motion's useScroll for smooth scroll-based animations
  const { scrollY } = useScroll()

  // Transform scroll position to sidebar reveal values
  // Sidebar starts appearing at 120px and is fully visible at 520px
  const sidebarOpacity = useTransform(scrollY, [120, 520], [0, 1])
  const sidebarX = useTransform(scrollY, [120, 520], [-24, 0])

  // Handle click on avatar - scroll to home
  const handleAvatarClick = () => {
    scrollToSection('home')
  }

  // Desktop sidebar content
  const SidebarContent = ({ inDrawer = false }: { inDrawer?: boolean }) => (
    <div className={cn('flex flex-col h-full', inDrawer ? 'p-6' : 'p-4')}>
      {/* Avatar and name - clickable to go home */}
      <div className="flex flex-col items-center text-center mb-6">
        <motion.button
          onClick={handleAvatarClick}
          className="mb-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] cursor-pointer group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Go to home"
        >
          <div className="relative">
            <Avatar size="lg" />
            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-[var(--accent)]/50 ring-offset-2 ring-offset-[var(--bg)]" />
          </div>
        </motion.button>
        <motion.h2
          layoutId={inDrawer ? undefined : 'sidebar-name'}
          className="text-lg font-semibold text-[var(--fg)]"
        >
          Adrián Montes
        </motion.h2>
        <p className="text-sm text-[var(--fg-muted)] mt-1">
          {tHero('headline')}
        </p>
      </div>

      {/* Social links */}
      <motion.div
        layoutId={inDrawer ? undefined : 'sidebar-socials'}
        className="flex justify-center gap-3 mb-6"
      >
        {SOCIAL_LINKS.map(({ key, href, icon }) => {
          const IconComponent = iconMap[icon]
          return (
            <a
              key={key}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              className="p-2 rounded-lg text-[var(--fg-muted)] hover:text-[var(--accent)] hover:bg-[var(--card)]/50 transition-colors"
              aria-label={key}
            >
              {IconComponent && <IconComponent />}
            </a>
          )
        })}
      </motion.div>

      {/* Download CV button */}
      <div className="mb-6">
        <Button asChild className="w-full justify-center shadow-md shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 transition-shadow">
          <a href={cvUrl} download rel="noopener">
            {tHero('ctaResume')}
          </a>
        </Button>
      </div>

      {/* Divider */}
      <div className="h-px bg-[var(--border)]/50 mb-6" />

      {/* Navigation */}
      <nav className="flex-1" role="navigation" aria-label="Sidebar navigation">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ key, href }, index) => {
            const sectionId = href.replace('#', '')
            const isActive = activeSection === sectionId

            return (
              <motion.li
                key={key}
                custom={index}
                initial={false}
                animate={isMorphed ? 'visible' : 'hidden'}
                variants={sidebarItemVariants}
              >
                <button
                  onClick={() => {
                    scrollToSection(sectionId)
                    if (inDrawer) setIsDrawerOpen(false)
                  }}
                  className={cn(
                    'relative w-full px-4 py-2.5 pl-5 rounded-lg text-left text-sm font-medium transition-all duration-200',
                    "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:rounded-full before:bg-[var(--accent)] before:opacity-0 before:transition-opacity",
                    'after:absolute after:left-2 after:top-1/2 after:-translate-y-1/2 after:size-1.5 after:rounded-full after:bg-[var(--accent)] after:opacity-0 after:transition-opacity after:shadow-[0_0_10px_rgba(220,162,147,0.45)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
                    isActive
                      ? 'bg-[var(--card)]/60 text-[var(--fg)] before:opacity-100 after:opacity-100'
                      : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card)]/40 hover:before:opacity-40 hover:after:opacity-40'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {t(key)}
                </button>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      {/* Language switcher at bottom */}
      <div className="pt-4 border-t border-[var(--border)]/50">
        <div className="flex items-center justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar - uses scroll-based transforms for smooth reveal */}
      <motion.aside
        style={{
          opacity: prefersReducedMotion ? (isMorphed ? 1 : 0) : sidebarOpacity,
          x: prefersReducedMotion ? 0 : sidebarX,
          pointerEvents: isMorphed ? 'auto' : 'none',
        }}
        className={cn(
          'fixed left-0 top-0 bottom-0 z-30 w-64 hidden lg:flex flex-col',
          'bg-[var(--bg)]/90 backdrop-blur-md border-r border-[var(--border)]/50',
          'pt-20' // Space for potential minimal header
        )}
        aria-hidden={!isMorphed}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile floating button */}
      <AnimatePresence>
        {isMorphed && (
          <motion.button
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={floatingButtonVariants}
            onClick={() => setIsDrawerOpen(true)}
            className={cn(
              'fixed left-4 bottom-4 z-40 lg:hidden',
              'w-14 h-14 rounded-full shadow-lg',
              'bg-[var(--accent)] text-white',
              'flex items-center justify-center',
              'hover:scale-105 active:scale-95 transition-transform'
            )}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={drawerVariants}
              className={cn(
                'fixed left-0 top-0 bottom-0 z-50 w-72 lg:hidden',
                'bg-[var(--bg)] border-r border-[var(--border)]/50',
                'shadow-2xl'
              )}
            >
              {/* Close button */}
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card)]/50 transition-colors"
                aria-label="Close navigation menu"
              >
                <CloseIcon />
              </button>

              <SidebarContent inDrawer />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
