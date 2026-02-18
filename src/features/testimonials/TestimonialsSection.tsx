'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { fadeInUp } from '@/lib/motion'
import { TESTIMONIALS } from '@/content/testimonials'

export function TestimonialsSection() {
  const t = useTranslations('testimonials')

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <Container>
        {/* Background accent */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-t from-[var(--accent)]/5 to-transparent blur-3xl" />
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

        {/* Testimonials Grid or Pending State */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
            hidden: {},
          }}
        >
          {TESTIMONIALS.length === 0 ? (
            // Pending state
            <motion.div
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 md:p-12 text-center"
              {...fadeInUp()}
            >
              <p className="text-[var(--fg)]/70 text-sm md:text-base leading-relaxed">
                {t('pending')}
              </p>
            </motion.div>
          ) : (
            // Testimonials cards
            <div className="grid grid-cols-1, md:grid-cols-2 gap-6">
              {TESTIMONIALS.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-200 hover:border-[var(--accent)]/30"
                  {...fadeInUp()}
                  whileHover={{ y: -2 }}
                >
                  {/* Quote */}
                  <blockquote className="text-[var(--fg)]/80 text-sm leading-relaxed mb-4">
                    &quot;{t(testimonial.quote)}&quot;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    {/* Avatar placeholder */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/60 flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>

                    {/* Name & role */}
                    <div>
                      <p className="font-medium text-sm text-[var(--fg)]">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-[var(--fg)]/60">
                        {testimonial.role}
                        {testimonial.organization && ` · ${testimonial.organization}`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </Container>
    </section>
  )
}
