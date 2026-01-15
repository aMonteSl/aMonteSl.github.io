'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Nav } from './Nav'
import { LanguageSwitcher } from '@/features/language/LanguageSwitcher'
import { Avatar } from '@/components/ui'
import { cn } from '@/lib/utils'

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
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        'border-b backdrop-blur-md',
        hasScrolled
          ? 'bg-[var(--bg)]/80 border-[var(--border)]/50 shadow-sm'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          aria-label="Go to home"
          className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] rounded-lg"
        >
          <Avatar size="sm" />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Nav />
          <div className="h-5 w-px bg-[var(--border)]/50" aria-hidden="true" />
          <LanguageSwitcher />
        </div>

        {/* Mobile menu with language switcher */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
