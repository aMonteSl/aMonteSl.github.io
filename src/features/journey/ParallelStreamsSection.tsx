'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/ui'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import { shouldAnimate } from '@/lib/motion'

import { StreamCard } from './StreamCard'
import { StreamLegend } from './StreamLegend'
import type { JourneyEntry, JourneyLane } from './types'
import {
  JOURNEY_ENTRIES,
  LANE_CONFIG,
  TIMELINE_START,
  TIMELINE_END,
  getTimelineYears,
} from '@/content/journey'

/** Lane order for consistent rendering */
const LANE_ORDER: JourneyLane[] = ['education', 'work', 'project', 'achievement']

/** Color mappings */
const LANE_COLORS: Record<JourneyLane, { bg: string; glow: string; ring: string }> = {
  education: { bg: 'bg-blue-500', glow: 'shadow-blue-500/40', ring: 'ring-blue-500/30' },
  work: { bg: 'bg-emerald-500', glow: 'shadow-emerald-500/40', ring: 'ring-emerald-500/30' },
  project: { bg: 'bg-violet-500', glow: 'shadow-violet-500/40', ring: 'ring-violet-500/30' },
  achievement: { bg: 'bg-amber-500', glow: 'shadow-amber-500/40', ring: 'ring-amber-500/30' },
}

/** Convert year to percentage position on timeline */
function yearToPercent(year: number): number {
  const range = TIMELINE_END - TIMELINE_START
  return ((year - TIMELINE_START) / range) * 100
}

/**
 * ParallelStreamsSection
 * Main component for the professional journey visualization
 * Displays parallel colored streams representing concurrent career tracks
 */
export function ParallelStreamsSection() {
  const t = useTranslations('journey')
  const animate = shouldAnimate()
  const years = useMemo(() => getTimelineYears(), [])
  
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)

  // Group entries by lane for rendering
  const entriesByLane = useMemo(() => {
    const grouped: Record<JourneyLane, JourneyEntry[]> = {
      education: [],
      work: [],
      project: [],
      achievement: [],
    }
    JOURNEY_ENTRIES.forEach((entry) => {
      grouped[entry.lane].push(entry)
    })
    return grouped
  }, [])

  // Get the active entry (hovered or selected)
  const activeEntry = useMemo(() => {
    const id = hoveredEntry || selectedEntry
    return id ? JOURNEY_ENTRIES.find((e) => e.id === id) : null
  }, [hoveredEntry, selectedEntry])

  // Build legend items from lane config
  const legendItems = useMemo(
    () =>
      LANE_CONFIG.map((config) => ({
        lane: config.lane,
        label: t(`legend.${config.lane}`),
        icon: config.icon,
      })),
    [t]
  )

  return (
    <section
      id="journey"
      className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-transparent via-[var(--card)]/5 to-transparent"
    >
      <Container size="lg">
        <SectionHeading title={t('title')} subtitle={t('subtitle')} />

        {/* Legend - Compact pills */}
        <div className="mb-10 sm:mb-14">
          <StreamLegend items={legendItems} />
        </div>

        {/* Main Timeline Visualization */}
        <div className="relative max-w-4xl mx-auto">
          {/* Year axis (top) */}
          <div className="flex justify-between mb-3 px-4 sm:px-6">
            {years.map((year) => (
              <span
                key={year}
                className={cn(
                  'text-[0.7rem] sm:text-xs font-mono tracking-tight',
                  year === TIMELINE_END
                    ? 'text-[var(--accent)] font-semibold'
                    : 'text-[var(--fg-muted)]/60'
                )}
              >
                {year}
              </span>
            ))}
          </div>

          {/* Timeline container */}
          <div className="relative bg-[var(--card)]/20 rounded-2xl ring-1 ring-[var(--border)]/20 overflow-hidden backdrop-blur-sm">
            {/* Vertical year grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              {years.map((year, i) => (
                <div
                  key={year}
                  className={cn(
                    'absolute top-0 bottom-0 w-px',
                    i === 0 || i === years.length - 1
                      ? 'bg-transparent'
                      : 'bg-[var(--border)]/10'
                  )}
                  style={{ left: `${yearToPercent(year)}%` }}
                />
              ))}
            </div>

            {/* Lanes */}
            <div className="relative py-6 sm:py-8">
              {LANE_ORDER.map((lane, laneIndex) => {
                const laneEntries = entriesByLane[lane]
                const config = LANE_CONFIG.find((c) => c.lane === lane)
                const colors = LANE_COLORS[lane]

                return (
                  <div
                    key={lane}
                    className="relative flex items-center h-12 sm:h-14 px-4 sm:px-6"
                  >
                    {/* Lane icon (left) */}
                    <div
                      className={cn(
                        'absolute left-3 sm:left-4 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center',
                        'bg-[var(--bg)] ring-1',
                        colors.ring,
                        'text-xs sm:text-sm z-20'
                      )}
                      title={t(`legend.${lane}`)}
                    >
                      {config?.icon}
                    </div>

                    {/* Stream track area */}
                    <div className="absolute inset-x-12 sm:inset-x-14 h-0.5 bg-[var(--border)]/10 rounded-full" />

                    {/* Entry lines or markers */}
                    {laneEntries.map((entry) => {
                      const startPercent = yearToPercent(entry.startYear)
                      const endPercent = yearToPercent(entry.endYear ?? TIMELINE_END)
                      const isOngoing = entry.endYear === null
                      const isActive = hoveredEntry === entry.id || selectedEntry === entry.id
                      const isPointEvent = entry.startYear === entry.endYear

                      // For point events (achievements), show as a larger marker
                      if (isPointEvent) {
                        return (
                          <motion.div
                            key={entry.id}
                            className={cn(
                              'absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer',
                              'w-4 h-4 sm:w-5 sm:h-5 rounded-full',
                              colors.bg,
                              'ring-2 ring-[var(--bg)] shadow-lg',
                              colors.glow,
                              isActive && 'scale-125',
                              hoveredEntry && !isActive && 'opacity-40',
                              'transition-all duration-200'
                            )}
                            style={{
                              left: `calc(${startPercent}% + 3rem - 8px)`,
                            }}
                            initial={animate ? { scale: 0 } : undefined}
                            animate={{ scale: 1 }}
                            transition={{
                              type: 'spring',
                              stiffness: 300,
                              damping: 20,
                              delay: laneIndex * 0.12 + 0.2,
                            }}
                            onMouseEnter={() => setHoveredEntry(entry.id)}
                            onMouseLeave={() => setHoveredEntry(null)}
                            onClick={() =>
                              setSelectedEntry(selectedEntry === entry.id ? null : entry.id)
                            }
                          />
                        )
                      }

                      // For duration events, show as lines
                      return (
                        <motion.div
                          key={entry.id}
                          className={cn(
                            'absolute h-1.5 rounded-full cursor-pointer z-10',
                            colors.bg,
                            isActive && ['h-2 shadow-lg', colors.glow],
                            hoveredEntry && !isActive && 'opacity-40',
                            'transition-all duration-200'
                          )}
                          style={{
                            left: `calc(${startPercent}% + 3rem)`,
                            width: `calc(${endPercent - startPercent}% - 1.5rem)`,
                          }}
                          initial={animate ? { scaleX: 0, originX: 0 } : undefined}
                          animate={{ scaleX: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 80,
                            damping: 18,
                            delay: laneIndex * 0.12 + 0.1,
                          }}
                          onMouseEnter={() => setHoveredEntry(entry.id)}
                          onMouseLeave={() => setHoveredEntry(null)}
                          onClick={() =>
                            setSelectedEntry(selectedEntry === entry.id ? null : entry.id)
                          }
                        >
                          {/* Start node */}
                          <motion.div
                            className={cn(
                              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2',
                              'w-3 h-3 rounded-full',
                              colors.bg,
                              'ring-2 ring-[var(--bg)]'
                            )}
                            initial={animate ? { scale: 0 } : undefined}
                            animate={{ scale: 1 }}
                            transition={{ delay: laneIndex * 0.12 + 0.2 }}
                          />

                          {/* End node */}
                          <motion.div
                            className={cn(
                              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2',
                              'w-3 h-3 rounded-full',
                              colors.bg,
                              isOngoing
                                ? 'ring-2 ring-white/60 shadow-lg ' + colors.glow
                                : 'ring-2 ring-[var(--bg)]'
                            )}
                            initial={animate ? { scale: 0 } : undefined}
                            animate={
                              isOngoing
                                ? { scale: [1, 1.2, 1] }
                                : { scale: 1 }
                            }
                            transition={
                              isOngoing
                                ? { repeat: Infinity, duration: 1.5, delay: 0.5 }
                                : { delay: laneIndex * 0.12 + 0.3 }
                            }
                          />
                        </motion.div>
                      )
                    })}

                    {/* Highlight markers (matrículas on education) */}
                    {lane === 'education' &&
                      laneEntries.map((entry) =>
                        entry.highlights?.map((highlight) => {
                          const percent = yearToPercent(highlight.year)
                          return (
                            <motion.div
                              key={highlight.id}
                              className={cn(
                                'absolute top-1/2 -translate-y-1/2 z-20',
                                'w-2.5 h-2.5 rounded-full bg-amber-400',
                                'ring-2 ring-[var(--bg)] shadow-sm shadow-amber-400/30'
                              )}
                              style={{
                                left: `calc(${percent}% + 3rem - 5px)`,
                              }}
                              initial={animate ? { scale: 0 } : undefined}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.6 }}
                              title={t(`entries.urjc.highlights.${highlight.id}`)}
                            />
                          )
                        })
                      )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Detail Card */}
          <div className="mt-8 min-h-[140px]">
            <AnimatePresence mode="wait">
              {activeEntry ? (
                <motion.div
                  key={activeEntry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <StreamCard
                    lane={activeEntry.lane}
                    title={t(`entries.${activeEntry.id}.role`)}
                    organization={t(`entries.${activeEntry.id}.org`)}
                    period={
                      activeEntry.endYear === null
                        ? `${activeEntry.startYear} — ${t('present')}`
                        : activeEntry.startYear === activeEntry.endYear
                          ? `${activeEntry.startYear}`
                          : `${activeEntry.startYear} — ${activeEntry.endYear}`
                    }
                    description={t(`entries.${activeEntry.id}.desc`)}
                    highlights={activeEntry.highlights?.map((h) => ({
                      label: t(`entries.urjc.highlights.${h.id}`),
                      year: h.year,
                    }))}
                    tags={activeEntry.tags}
                    link={activeEntry.link}
                    isOngoing={activeEntry.endYear === null}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <span className="text-2xl mb-2">👆</span>
                  <p className="text-xs text-[var(--fg-muted)]/60">
                    {t('hoverHint')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  )
}
