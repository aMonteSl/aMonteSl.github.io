'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EASING, DURATION, fadeInUp } from '@/lib/motion'
import { CERTIFICATIONS } from '@/content/certifications'

export function CertificationsSection() {
  const t = useTranslations('certificates')

  const groupedByStatus = {
    completed: CERTIFICATIONS.filter((c) => c.status === 'completed'),
    'in-progress': CERTIFICATIONS.filter((c) => c.status === 'in-progress'),
    planned: CERTIFICATIONS.filter((c) => c.status === 'planned'),
  }

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <Container>
        {/* Background accent */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-gradient-to-r from-[var(--accent)]/5 to-transparent blur-3xl" />
        </div>

        {/* Heading */}
        <motion.div
          className="mb-12 md:mb-16"
          {...fadeInUp()}
        >
          <SectionHeading
            title={t('title')}
            subtitle={t('subtitle')}
            centered
          />
        </motion.div>

        {/* Certifications by status */}
        <motion.div
          className="space-y-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
            hidden: {},
          }}
        >
          {/* Completed */}
          {groupedByStatus.completed.length > 0 && (
            <motion.div {...fadeInUp()}>
              <h3 className="text-lg font-semibold text-[var(--fg)] mb-6 flex items-center gap-2">
                <span className="inline-block w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 text-sm font-bold">
                  {groupedByStatus.completed.length}
                </span>
                {t('completed')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedByStatus.completed.map((cert) => (
                  <CertificationCard key={cert.id} cert={cert} />
                ))}
              </div>
            </motion.div>
          )}

          {/* In Progress */}
          {groupedByStatus['in-progress'].length > 0 && (
            <motion.div {...fadeInUp()}>
              <h3 className="text-lg font-semibold text-[var(--fg)] mb-6 flex items-center gap-2">
                <span className="inline-block w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 text-sm font-bold">
                  {groupedByStatus['in-progress'].length}
                </span>
                {t('inProgress')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedByStatus['in-progress'].map((cert) => (
                  <CertificationCard key={cert.id} cert={cert} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Planned */}
          {groupedByStatus.planned.length > 0 && (
            <motion.div {...fadeInUp()}>
              <h3 className="text-lg font-semibold text-[var(--fg)] mb-6 flex items-center gap-2">
                <span className="inline-block w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-sm font-bold">
                  {groupedByStatus.planned.length}
                </span>
                {t('planned')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedByStatus.planned.map((cert) => (
                  <CertificationCard key={cert.id} cert={cert} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  )
}

function CertificationCard({
  cert,
}: {
  cert: (typeof CERTIFICATIONS)[0]
}) {
  const t = useTranslations('certificates')

  const statusConfig = {
    completed: { colors: 'bg-green-500/10 border-green-500/30 text-green-400', icon: '✓' },
    'in-progress': { colors: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400', icon: '⟳' },
    planned: { colors: 'bg-blue-500/10 border-blue-500/30 text-blue-400', icon: '📌' },
  }

  const { colors: statusColors, icon: statusIcon } = statusConfig[cert.status]

  return (
    <motion.div
      className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 transition-all duration-200 hover:border-[var(--accent)]/20"
      whileHover={{ y: -2 }}
      transition={{ duration: DURATION.fast, ease: EASING }}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-[var(--fg)] text-sm truncate">
            {cert.name.startsWith('certificates.')
              ? t(cert.name)
              : cert.name}
          </h4>
          <p className="text-xs text-[var(--fg)]/60 mt-1">
            {cert.issuer.startsWith('certificates.')
              ? t(cert.issuer)
              : cert.issuer}
          </p>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 whitespace-nowrap ${statusColors}`}>
          {statusIcon}
        </div>
      </div>

      {/* Date & Tags */}
      <div className="space-y-3">
        {cert.date && (
          <p className="text-xs text-[var(--fg)]/50">
            {cert.date === 'In Progress' ? cert.date : new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
          </p>
        )}

        {cert.tags && cert.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {cert.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 rounded text-xs bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Link */}
      {cert.link && (
        <motion.a
          href={cert.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center text-xs text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors group"
          whileHover={{ x: 2 }}
        >
          {t('verify')} <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
        </motion.a>
      )}
    </motion.div>
  )
}
