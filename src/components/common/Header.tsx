'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Nav } from './Nav'
import { LanguageSwitcher } from '@/features/language/LanguageSwitcher'
import { Avatar } from '@/components/ui'

export function Header() {
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 8)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`header sticky top-0 z-50 w-full bg-bg/80 backdrop-blur-sm border-b border-border ${hasScrolled ? 'has-shadow' : ''}`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          aria-label="Go to home"
          className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-lg"
        >
          <Avatar size="sm" />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Nav />
          <LanguageSwitcher />
        </div>

        {/* Mobile menu with language switcher */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button
            className="p-2 text-fg-muted hover:text-fg transition-colors"
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
