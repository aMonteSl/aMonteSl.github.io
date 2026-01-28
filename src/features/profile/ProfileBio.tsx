'use client'

import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

// Icon components for stats
function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
  )
}

function AcademicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
  )
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  )
}

interface ProfileBioProps {
  className?: string
}

/**
 * Profile bio component with name, description, and stats
 */
export function ProfileBio({ className }: ProfileBioProps) {
  const t = useTranslations('profile')

  const stats = [
    { icon: CodeIcon, label: t('stats.experience'), value: t('stats.experienceValue') },
    { icon: AcademicIcon, label: t('stats.education'), value: t('stats.educationValue') },
    { icon: LocationIcon, label: t('stats.location'), value: t('stats.locationValue') },
    { icon: SparklesIcon, label: t('stats.focus'), value: t('stats.focusValue') },
  ]

  return (
    <div className={cn('flex flex-col justify-center', className)}>
      {/* Name and role */}
      <motion.div {...fadeInUp(0)} className="mb-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--fg)] mb-2">
          {t('name')}
        </h2>
        <p className="text-lg text-[var(--accent)] font-medium">
          {t('role')}
        </p>
      </motion.div>

      {/* Bio paragraphs */}
      <motion.div {...fadeInUp(0.1)} className="space-y-4 mb-8">
        <p className="text-[var(--fg-muted)] leading-relaxed">
          {t('bio1')}
        </p>
        <p className="text-[var(--fg-muted)] leading-relaxed">
          {t('bio2')}
        </p>
      </motion.div>

      {/* Stats grid */}
      <motion.div 
        {...fadeInUp(0.2)}
        className="grid grid-cols-2 gap-4"
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              'p-4 rounded-xl',
              'bg-[var(--card)]/50 border border-[var(--border)]/50',
              'hover:border-[var(--accent)]/30 transition-colors duration-200'
            )}
          >
            <stat.icon className="w-5 h-5 text-[var(--accent)] mb-2" />
            <p className="text-sm text-[var(--fg-muted)] mb-1">{stat.label}</p>
            <p className="text-sm font-medium text-[var(--fg)]">{stat.value}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
