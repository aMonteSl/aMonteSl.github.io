'use client'

import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMorphNav } from '@/features/morphNav/MorphNavProvider'
import {
  floatingButtonVariants,
  drawerVariants,
  backdropVariants,
} from '@/features/morphNav/morphVariants'
import { SidebarPanel } from '@/features/morphNav/SidebarPanel'
import { CloseIcon, MenuIcon } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n'

/** DOM id of the drawer dialog, referenced by the `aria-controls` of its triggers. */
export const MORPH_NAV_DRAWER_ID = 'morph-nav-drawer'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Below the `xl` sidebar breakpoint the navigation lives in a drawer, opened from the
 * header hamburger (always) or from the floating button (once the header has morphed away).
 * Owns the modal behaviour: body scroll lock, focus handling, Tab trap and Escape.
 */
export function MorphDrawer() {
  const { isMorphed, isDrawerOpen, openDrawer, closeDrawer } = useMorphNav()
  const t = useTranslations('nav')
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Scroll lock + Escape while open. Restore whatever overflow the body had before.
  useEffect(() => {
    if (!isDrawerOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDrawerOpen, closeDrawer])

  // Move focus to the close button on open; hand it back to the trigger on close.
  useEffect(() => {
    if (!isDrawerOpen) return

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    return () => {
      window.cancelAnimationFrame(frame)
      // Only hand focus back to a trigger that can still take it. The header hamburger is
      // inert once the page has morphed past the hero, and the floating button unmounts
      // when scrolling back up; in those cases focus is left on the body rather than on
      // an invisible control.
      const canRestoreFocus =
        previouslyFocused !== null &&
        previouslyFocused !== document.body &&
        previouslyFocused.isConnected &&
        previouslyFocused.closest('[inert]') === null

      if (canRestoreFocus) previouslyFocused.focus({ preventScroll: true })
    }
  }, [isDrawerOpen])

  const handleDrawerKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !drawerRef.current) return

    const focusable = Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement
    const focusIsInside = drawerRef.current.contains(active)

    if (event.shiftKey) {
      if (active === first || !focusIsInside) {
        event.preventDefault()
        last.focus()
      }
    } else if (active === last || !focusIsInside) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <>
      {/* Floating button: appears once the header has morphed away */}
      <AnimatePresence>
        {isMorphed && (
          <motion.button
            type="button"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={floatingButtonVariants}
            onClick={openDrawer}
            className={cn(
              'fixed left-4 z-40 bottom-[max(1rem,env(safe-area-inset-bottom))] xl:hidden',
              'flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/40',
              'border border-[var(--accent)]/30 bg-[var(--accent)] text-[#120d0b]',
              'transition-transform hover:scale-105 active:scale-95'
            )}
            aria-label={t('openMenu')}
            aria-expanded={isDrawerOpen}
            aria-controls={isDrawerOpen ? MORPH_NAV_DRAWER_ID : undefined}
          >
            <MenuIcon className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
              onClick={closeDrawer}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm xl:hidden"
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              ref={drawerRef}
              id={MORPH_NAV_DRAWER_ID}
              initial="closed"
              animate="open"
              exit="closed"
              variants={drawerVariants}
              onKeyDown={handleDrawerKeyDown}
              className={cn(
                'fixed inset-y-0 left-0 z-50 flex w-[min(88vw,22rem)] max-w-[22rem] flex-col overflow-hidden xl:hidden',
                'border-r border-[var(--border)]/80 bg-[var(--bg)]',
                'shadow-2xl shadow-black/60'
              )}
              role="dialog"
              aria-modal="true"
              aria-label={t('menuLabel')}
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDrawer}
                className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)]/70 bg-[var(--card)]/70 text-[var(--fg-muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                aria-label={t('closeMenu')}
              >
                <CloseIcon className="h-5 w-5" />
              </button>

              <SidebarPanel inDrawer />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
