'use client'

import { useEffect, useState, type ReactElement } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useMorphNav } from '@/features/morphNav/MorphNavProvider'
import {
  sidebarItemVariants,
  floatingButtonVariants,
  drawerVariants,
  backdropVariants,
} from '@/features/morphNav/morphVariants'
import { LanguageSwitcher } from '@/features/language'
import { Avatar, Button, CloseIcon, EmailIcon, GitHubIcon, LinkedInIcon, MenuIcon } from '@/components/ui'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, SOCIAL_LINKS, getCvUrl } from '@/lib/constants'
import { useEmailCopyFeedback } from '@/lib/hooks/useEmailCopyFeedback'
import { useTranslations, useLocale } from '@/i18n'

const iconMap: Record<string, () => ReactElement> = {
  github: () => <GitHubIcon className="w-5 h-5" />,
  linkedin: () => <LinkedInIcon className="w-5 h-5" />,
  email: () => <EmailIcon className="w-5 h-5" />,
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
  const { copiedEmail, copyEmail } = useEmailCopyFeedback()

  // Use Framer Motion's useScroll for smooth scroll-based animations
  const { scrollY, scrollYProgress } = useScroll()

  // Transform scroll position to sidebar reveal values
  // Sidebar starts appearing at 120px and is fully visible at 520px
  const sidebarOpacity = useTransform(scrollY, [120, 520], [0, 1])
  const sidebarX = useTransform(scrollY, [120, 520], [-24, 0])
  const pageProgressScale = useTransform(scrollYProgress, [0, 1], [0.02, 1])

  useEffect(() => {
    if (!isDrawerOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen])

  const handleAvatarClick = () => {
    scrollToSection('home')
    setIsDrawerOpen(false)
  }

  const SidebarContent = ({ inDrawer = false }: { inDrawer?: boolean }) => (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col',
        inDrawer ? 'px-5 pb-5 pt-16 sm:px-6' : 'px-4 pb-4 pt-4'
      )}
    >
      <div
        className={cn(
          'rounded-2xl border border-[var(--border)]/70 bg-[var(--surface)]/45 text-center shadow-[0_18px_60px_rgba(0,0,0,0.22)]',
          inDrawer ? 'mb-5 p-4' : 'mb-3 p-3'
        )}
      >
        <motion.button
          onClick={handleAvatarClick}
          className={cn(
            'rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] cursor-pointer group',
            inDrawer ? 'mb-3' : 'mb-2'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Go to home"
        >
          <div className="relative rounded-full ring-2 ring-[var(--accent)]/20 group-hover:ring-[var(--accent)]/50 transition-colors duration-300">
            <Avatar size="lg" className={inDrawer ? undefined : '!h-20 !w-20 md:!h-20 md:!w-20'} />
          </div>
        </motion.button>
        <motion.h2
          layoutId={inDrawer ? undefined : 'sidebar-name'}
          className={cn('font-semibold leading-tight text-[var(--fg)]', inDrawer ? 'text-base' : 'text-sm')}
        >
          Adrián Montes
        </motion.h2>
        <p className="mt-1 text-xs leading-relaxed text-[var(--fg-muted)]">
          {tHero('headline')}
        </p>
      </div>

      <motion.div
        layoutId={inDrawer ? undefined : 'sidebar-socials'}
        className={cn('grid grid-cols-3 gap-2', inDrawer ? 'mb-4' : 'mb-3')}
      >
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
                inDrawer ? 'h-10' : 'h-9'
              )}
              aria-label={key}
            >
              {IconComponent && <IconComponent />}
            </a>
          )
        })}
      </motion.div>
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
            inDrawer ? 'h-10 text-sm' : 'h-9 text-xs'
          )}
        >
          <a href={cvUrl} download rel="noopener">
            {tHero('ctaResume')}
          </a>
        </Button>
      </div>

      <nav
        className={cn(
          inDrawer ? 'flex-none overflow-visible pr-1' : 'flex-none overflow-visible'
        )}
        role="navigation"
        aria-label="Sidebar navigation"
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
                animate={isMorphed ? 'visible' : 'hidden'}
                variants={sidebarItemVariants}
              >
                <button
                  onClick={() => {
                    scrollToSection(sectionId)
                    if (inDrawer) setIsDrawerOpen(false)
                  }}
                  className={cn(
                    'group relative flex w-full items-center gap-3 rounded-xl text-left font-medium transition-colors duration-200',
                    inDrawer ? 'min-h-11 px-3 py-2.5 text-sm' : 'min-h-9 px-3 py-1.5 text-xs',
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
                      isActive ? 'bg-[var(--accent)] shadow-[0_0_12px_rgba(220,162,147,0.65)]' : 'bg-[var(--fg-muted)]/25 group-hover:bg-[var(--accent)]/50'
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
          'fixed left-0 top-0 bottom-0 z-30 hidden w-[17rem] flex-col lg:flex',
          'border-r border-[var(--border)]/70 bg-[var(--bg)]/92 backdrop-blur-xl',
          'pt-16'
        )}
        aria-hidden={!isMorphed}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-[-1px] top-0 w-px bg-[var(--border)]/35"
        >
          <motion.div
            className="h-full w-px origin-top bg-[var(--accent)] shadow-[0_0_18px_rgba(220,162,147,0.45)]"
            style={{ scaleY: prefersReducedMotion ? 1 : pageProgressScale }}
          />
        </div>
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
              'fixed bottom-4 left-4 z-40 lg:hidden',
              'h-14 w-14 rounded-full shadow-lg shadow-black/40',
              'border border-[var(--accent)]/30 bg-[var(--accent)] text-[#120d0b]',
              'flex items-center justify-center',
              'hover:scale-105 active:scale-95 transition-transform'
            )}
            aria-label="Open navigation menu"
            aria-expanded={isDrawerOpen}
          >
            <MenuIcon className="w-6 h-6" />
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
                'fixed bottom-0 left-0 top-0 z-50 max-w-[22rem] w-[min(88vw,22rem)] lg:hidden',
                'overflow-hidden border-r border-[var(--border)]/80 bg-[var(--bg)]',
                'shadow-2xl shadow-black/60'
              )}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)]/70 bg-[var(--card)]/70 text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] hover:bg-[var(--card)]"
                aria-label="Close navigation menu"
              >
                <CloseIcon className="h-5 w-5" />
              </button>

              <SidebarContent inDrawer />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

