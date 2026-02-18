'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Container, SectionHeading } from '@/components/ui'
import { useTranslations } from '@/i18n'
import { USES_ITEMS, USES_CATEGORIES} from '@/content/uses'
import type { UsesCategory } from '@/content/uses'
import { fadeInUp, shouldAnimate, EASING, DURATION } from '@/lib/motion'

const CATEGORY_ICONS: Record<UsesCategory, string> = {
  editor: '🖥️',
  terminal: '⌨️',
  devTools: '🔧',
  design: '🎨',
  hardware: '🖱️',
  browser: '🌐',
}

export function UsesPageClient() {
  const t = useTranslations('uses')
  const animate = shouldAnimate()

  const groupedItems = useMemo(() => {
    return USES_CATEGORIES.map((category) => ({
      category,
      items: USES_ITEMS.filter((item) => item.category === category),
    }))
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Container>
        <div className="py-12 sm:py-16 md:py-20">
          {/* Back link */}
          <motion.a
            href="/"
            {...(animate ? fadeInUp(0) : {})}
            className="inline-flex items-center gap-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors mb-10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backHome')}
          </motion.a>

          <SectionHeading
            title={t('title')}
            subtitle={t('subtitle')}
            centered={false}
          />

          {/* Categories */}
          <div className="space-y-12 sm:space-y-16">
            {groupedItems.map(({ category, items }, catIndex) => (
              <motion.div
                key={category}
                {...(animate ? fadeInUp(catIndex * 0.05) : {})}
              >
                {/* Category header */}
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--fg)] mb-6 flex items-center gap-3">
                  <span className="text-xl">{CATEGORY_ICONS[category]}</span>
                  {t(`categories.${category}`)}
                </h3>

                {/* Items grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((item) => {
                    const content = (
                      <motion.div
                        className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all duration-200 hover:border-[var(--accent)]/30 hover:shadow-lg hover:shadow-[var(--accent)]/5"
                        whileHover={{ y: -2 }}
                        transition={{ duration: DURATION.fast, ease: EASING }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-[var(--fg)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                              {t(`items.${item.id}.name`)}
                            </h4>
                            <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                              {t(`items.${item.id}.desc`)}
                            </p>
                          </div>
                          {item.url && (
                            <svg className="w-4 h-4 text-[var(--fg-muted)]/40 group-hover:text-[var(--accent)] transition-colors shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          )}
                        </div>
                      </motion.div>
                    )

                    if (item.url) {
                      return (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {content}
                        </a>
                      )
                    }

                    return <div key={item.id}>{content}</div>
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
