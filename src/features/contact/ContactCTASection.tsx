'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EASING, DURATION, fadeInUp } from '@/lib/motion'
import { LINKS } from '@/lib/constants'

export function ContactCTASection() {
  const t = useTranslations('contact')

  return (
    <section id="contact" className="relative py-16 md:py-24 overflow-hidden">
      <Container>
        {/* Background glow effect */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-b from-[var(--accent)]/5 to-transparent blur-3xl" />
        </div>

        {/* Content */}
        <motion.div
          className="text-center max-w-2xl mx-auto space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
            hidden: {},
          }}
        >
          {/* Heading */}
          <motion.div {...fadeInUp()}>
            <SectionHeading
              title={t('title')}
              subtitle={t('subtitle')}
              centered
            />
          </motion.div>

          {/* CTA Button & Email */}
          <motion.div className="space-y-4" {...fadeInUp()}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* Email Link */}
              <motion.a
                href={LINKS.email}
                className="inline-flex items-center px-8 py-4 rounded-lg border border-[var(--accent)]/20 bg-[var(--accent)]/5 text-[var(--fg)] font-medium transition-all duration-200 hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/40 group"
                whileHover={{ y: -2, scale: 1.02 }}
                transition={{ duration: DURATION.fast, ease: EASING }}
              >
                <span className="mr-2">✉️</span>
                <span>{t('cta')}</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </motion.a>

              {/* Or text */}
              <p className="text-sm text-[var(--fg)]/60">{t('or')}</p>

              {/* Social Links */}
              <div className="flex gap-3">
                {/* GitHub */}
                <motion.a
                  href={LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-12 h-12 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] transition-all duration-200 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5"
                  whileHover={{ y: -2 }}
                  transition={{ duration: DURATION.fast, ease: EASING }}
                  title="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </motion.a>

                {/* LinkedIn */}
                <motion.a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-12 h-12 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] transition-all duration-200 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5"
                  whileHover={{ y: -2 }}
                  transition={{ duration: DURATION.fast, ease: EASING }}
                  title="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.047-8.733 0-9.65h3.554v1.367c.427-.659 1.191-1.597 2.894-1.597 2.115 0 3.704 1.385 3.704 4.362v5.518zM5.337 8.855c-1.144 0-1.915-.759-1.915-1.71 0-.955.771-1.71 1.958-1.71 1.187 0 1.914.755 1.939 1.71 0 .951-.752 1.71-1.982 1.71zm1.581 11.597H3.756V9.802h3.162v10.65zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </motion.a>
              </div>
            </div>

            {/* Available status */}
            <motion.p
              className="text-sm text-[var(--fg)]/60 pt-2"
              {...fadeInUp()}
            >
              {t('available')}
            </motion.p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
