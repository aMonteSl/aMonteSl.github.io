'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, SectionShell } from '@/components/ui'
import { ProfileBio } from './ProfileBio'
import { useTranslations } from '@/i18n'
import { useMorphNav } from '@/features/morphNav'

export function ScrollCue() {
  const t = useTranslations('profile.transition')
  const { activeSection, prefersReducedMotion } = useMorphNav()
  const [isProfileVisible, setIsProfileVisible] = useState(false)

  useEffect(() => {
    const profile = document.getElementById('profile')
    if (!profile) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsProfileVisible(entry.isIntersecting)
      },
      { threshold: 0.02 }
    )

    observer.observe(profile)
    return () => observer.disconnect()
  }, [])

  const shouldShow = activeSection === 'home' && !isProfileVisible

  return (
    <motion.div
      className="pointer-events-none relative z-10 -mt-8 flex justify-center px-4 sm:-mt-10 lg:-translate-x-[calc(8.5rem+0.75rem)] xl:-translate-x-[calc(8.5rem+1rem)]"
      animate={{
        opacity: shouldShow ? 1 : 0,
        y: shouldShow ? 0 : -6,
      }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
      aria-hidden={!shouldShow}
    >
      <a
        href="#profile"
        aria-label={t('label')}
        tabIndex={shouldShow ? 0 : -1}
        className={`scroll-cue group inline-flex h-12 w-12 items-center justify-center text-[var(--accent)]/78 transition-colors hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:h-14 sm:w-14 2xl:h-16 2xl:w-16 ${shouldShow ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <svg
          className="h-8 w-8 transition-transform group-hover:translate-y-0.5 sm:h-9 sm:w-9 2xl:h-10 2xl:w-10"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M8 12.5 16 20.5 24 12.5" />
          <path d="M10.5 5.5h11" opacity="0.45" />
        </svg>
      </a>
    </motion.div>
  )
}

export function ProfileSection() {
  const t = useTranslations('profile')

  return (
    <SectionShell id="profile" className="pt-14 sm:pt-16 lg:pt-20">
        <SectionHeader
          kicker={t('kicker')}
          title={t('title')}
          subtitle={t('subtitle')}
          align="left"
        />

        <div className="mx-auto max-w-6xl">
          <ProfileBio />
        </div>
    </SectionShell>
  )
}
