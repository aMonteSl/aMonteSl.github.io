'use client'

import { Container } from '@/components/ui'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TimelineItem, TimelineEntry } from './TimelineItem'
import { useTranslations } from '@/i18n'

// Placeholder journey data - will be moved to content files later
const journeyData: TimelineEntry[] = [
  {
    id: '1',
    title: 'VISSOFT 2025 Paper Accepted',
    organization: 'IEEE VISSOFT 2025 (co-located with ICSME)',
    period: '2025',
    description: 'Research paper on XR visualization of software metrics accepted for presentation. Demonstrating novel approaches to immersive code analysis and developer experience.',
    type: 'achievement',
    tags: ['Research', 'XR', 'Visualization'],
  },
  {
    id: '2',
    title: 'Code-XR Development',
    organization: 'Open Source Project',
    period: '2024 – Present',
    description: 'Created and maintaining Code-XR, a VS Code extension for XR/3D visualization of software metrics. Built with TypeScript, A-Frame, and babia-xr for immersive code analysis.',
    type: 'work',
    tags: ['TypeScript', 'VS Code API', 'A-Frame', 'XR'],
  },
  {
    id: '3',
    title: 'Telematics Engineering',
    organization: 'Universidad Rey Juan Carlos (URJC)',
    period: '2020 – 2025',
    description: 'Completing degree with focus on software engineering, backend development, and emerging XR technologies. Final thesis on software visualization in extended reality environments.',
    type: 'education',
    tags: ['Software Engineering', 'Backend', 'XR'],
  },
  {
    id: '4',
    title: 'Personal Projects & Contributions',
    organization: 'Self-directed Learning',
    period: '2019 – Present',
    description: 'Continuous development of personal projects exploring clean architecture, modern frontend frameworks, and developer tooling. Active contributor to open-source ecosystem.',
    type: 'work',
    tags: ['Next.js', 'React', 'Clean Architecture'],
  },
]

export function ProfessionalJourneySection() {
  const t = useTranslations('journey')

  return (
    <section id="journey" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[var(--card)]/20">
      <Container size="lg">
        <SectionHeading
          title={t('title')}
          subtitle={t('subtitle')}
        />

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {journeyData.map((entry, index) => (
            <TimelineItem
              key={entry.id}
              {...entry}
              index={index}
              isLast={index === journeyData.length - 1}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
