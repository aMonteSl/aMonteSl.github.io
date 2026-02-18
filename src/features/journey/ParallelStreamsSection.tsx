'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/ui'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import { shouldAnimate } from '@/lib/motion'

import { StreamCard } from './StreamCard'
import { StreamLegend } from './StreamLegend'
import { useGlowAnimation } from './useGlowAnimation'
import type { JourneyEntry, JourneyLane, JourneyHighlight } from './types'
import {
  JOURNEY_ENTRIES,
  LANE_CONFIG,
  TIMELINE_START,
  TIMELINE_END,
  getTimelineYears,
  dateToDecimalYear,
} from '@/content/journey'

/** Lane order for consistent rendering */
const LANE_ORDER: JourneyLane[] = ['education', 'work', 'project', 'achievement', 'learning']

/** Color mappings with hex values for dynamic styles */
const LANE_COLORS: Record<JourneyLane, { 
  bg: string
  hex: string
  ring: string
  text: string 
}> = {
  education: { 
    bg: 'bg-blue-500', 
    hex: '#3b82f6',
    ring: 'ring-blue-500/30',
    text: 'text-blue-400'
  },
  work: { 
    bg: 'bg-emerald-500', 
    hex: '#10b981',
    ring: 'ring-emerald-500/30',
    text: 'text-emerald-400'
  },
  project: { 
    bg: 'bg-violet-500', 
    hex: '#8b5cf6',
    ring: 'ring-violet-500/30',
    text: 'text-violet-400'
  },
  achievement: { 
    bg: 'bg-amber-500', 
    hex: '#f59e0b',
    ring: 'ring-amber-500/30',
    text: 'text-amber-400'
  },
  learning: {
    bg: 'bg-pink-500',
    hex: '#ec4899',
    ring: 'ring-pink-500/30',
    text: 'text-pink-400'
  },
}

/** Month names for drill-down view */
const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

/** Format date for display */
function formatPeriod(
  startYear: number,
  startMonth: number | undefined,
  endYear: number | null,
  endMonth: number | undefined,
  presentLabel: string
): string {
  const formatDate = (year: number, month?: number) => {
    if (month) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${monthNames[month - 1]} ${year}`
    }
    return `${year}`
  }

  const start = formatDate(startYear, startMonth)
  
  if (endYear === null) {
    return `${start} — ${presentLabel}`
  }
  
  if (startYear === endYear && startMonth === endMonth) {
    return start
  }
  
  const end = formatDate(endYear, endMonth)
  return `${start} — ${end}`
}

function formatStartOnly(startYear: number, startMonth?: number): string {
  if (startMonth) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[startMonth - 1]} ${startYear}`
  }
  return `${startYear}`
}

/**
 * ParallelStreamsSection
 * Professional journey visualization with year drill-down
 */
export function ParallelStreamsSection() {
  const t = useTranslations('journey')
  const animate = shouldAnimate()
  const years = useMemo(() => getTimelineYears(), [])
  
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const [drillDownYear, setDrillDownYear] = useState<number | null>(null)
  const [visibleLanes, setVisibleLanes] = useState<Set<JourneyLane>>(new Set(['education', 'work', 'project', 'achievement', 'learning']))

  // Get all entry IDs for glow animation
  const entryIds = useMemo(() => JOURNEY_ENTRIES.map((e) => e.id), [])
  
  // Smooth glow animation with crossfade (works in both views)
  const { getIntensity } = useGlowAnimation(entryIds, {
    fadeDuration: 1500,
    holdDuration: 2500,
    enabled: animate,
  })

  // Group entries by lane for rendering
  const entriesByLane = useMemo(() => {
    const grouped: Record<JourneyLane, JourneyEntry[]> = {
      education: [],
      work: [],
      project: [],
      achievement: [],
      learning: [],
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
      })),
    [t]
  )

  /** Calculate percentage position on timeline (year view) */
  const yearToPercent = useCallback((decimalYear: number): number => {
    const range = TIMELINE_END - TIMELINE_START
    return ((decimalYear - TIMELINE_START) / range) * 100
  }, [])

  /** Calculate percentage position for month drill-down */
  const monthToPercent = useCallback((month: number, day: number = 15): number => {
    // Month 1-12 maps to 0-100%
    return ((month - 1 + (day - 1) / 30) / 12) * 100
  }, [])

  /** Get percentage position for an entry's start (year view) */
  const getStartPercent = useCallback((entry: JourneyEntry) => {
    const decimalYear = dateToDecimalYear(entry.startYear, entry.startMonth, entry.startDay)
    return yearToPercent(decimalYear)
  }, [yearToPercent])

  /** Get percentage position for an entry's end (year view) */
  const getEndPercent = useCallback((entry: JourneyEntry) => {
    if (entry.endYear === null) {
      return yearToPercent(TIMELINE_END)
    }
    const decimalYear = dateToDecimalYear(entry.endYear, entry.endMonth, entry.endDay)
    return yearToPercent(decimalYear)
  }, [yearToPercent])

  /** Get highlight percentage (year view) */
  const getHighlightPercent = useCallback((h: JourneyHighlight) => {
    const decimalYear = dateToDecimalYear(h.year, h.month, h.day)
    return yearToPercent(decimalYear)
  }, [yearToPercent])

  /** Check if entry is visible in drill-down year */
  const isEntryInYear = useCallback((entry: JourneyEntry, year: number): boolean => {
    const startDecimal = dateToDecimalYear(entry.startYear, entry.startMonth, entry.startDay)
    const endDecimal = entry.endYear 
      ? dateToDecimalYear(entry.endYear, entry.endMonth, entry.endDay)
      : TIMELINE_END + 1
    return startDecimal < year + 1 && endDecimal >= year
  }, [])

  /** Get start/end month percentages for drill-down */
  const getMonthRange = useCallback((entry: JourneyEntry, year: number) => {
    // Clamp to this year
    let startMonth = 1
    let startDay = 1
    if (entry.startYear === year) {
      startMonth = entry.startMonth ?? 1
      startDay = entry.startDay ?? 1
    }

    let endMonth = 12
    let endDay = 31
    if (entry.endYear === year) {
      endMonth = entry.endMonth ?? 12
      endDay = entry.endDay ?? 31
    } else if (entry.endYear !== null && entry.endYear < year) {
      return null // Entry ended before this year
    }

    if (entry.startYear > year) {
      return null // Entry starts after this year
    }

    return {
      startPercent: monthToPercent(startMonth, startDay),
      endPercent: monthToPercent(endMonth, endDay),
    }
  }, [monthToPercent])

  /** Handle year click for drill-down */
  const handleYearClick = useCallback((year: number) => {
    if (drillDownYear === year) {
      setDrillDownYear(null)
    } else {
      setDrillDownYear(year)
      setSelectedEntry(null)
      setHoveredEntry(null)
    }
  }, [drillDownYear])

  /** Back to overview */
  const handleBackToOverview = useCallback(() => {
    setDrillDownYear(null)
  }, [])

  return (
    <section
      id="journey"
      className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-transparent via-[var(--card)]/5 to-transparent"
    >
      <Container size="xl">
        <SectionHeading title={t('title')} subtitle={t('subtitle')} />

        {/* Legend - Compact pills with filtering */}
        <div className="mb-10 sm:mb-14">
          <StreamLegend 
            items={legendItems}
            visibleLanes={visibleLanes}
            onToggleLane={(lane) => {
              const newSet = new Set(visibleLanes)
              if (newSet.has(lane)) {
                newSet.delete(lane)
              } else {
                newSet.add(lane)
              }
              setVisibleLanes(newSet)
            }}
          />
        </div>

        {/* Main Timeline Visualization */}
        <div className="relative w-full">
          <AnimatePresence mode="wait">
            {drillDownYear === null ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Year axis (top) - clickable for drill-down */}
                <div className="relative mb-4 px-6 sm:px-8">
                  <div className="flex justify-between">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => handleYearClick(year)}
                        className={cn(
                          'group relative px-2 py-1.5 rounded-lg transition-all duration-200',
                          'hover:bg-[var(--accent)]/10 hover:scale-105 cursor-pointer',
                          year === TIMELINE_END
                            ? 'text-[var(--accent)] font-semibold'
                            : 'text-[var(--fg-muted)]/70 hover:text-[var(--accent)]'
                        )}
                        title={`Ver detalles de ${year}`}
                      >
                        <span className="text-xs sm:text-sm font-mono">{year}</span>
                        {/* Underline indicator on hover */}
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--accent)] rounded-full transition-all duration-200 group-hover:w-3/4" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline container */}
                <div className="relative bg-[var(--card)]/20 rounded-2xl ring-1 ring-[var(--border)]/20 overflow-visible backdrop-blur-sm px-6 sm:px-8">
                  {/* Vertical year grid lines */}
                  <div className="absolute inset-y-0 left-6 right-6 sm:left-8 sm:right-8 pointer-events-none">
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
                    {/* Start label on the left */}
                    <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 flex items-center justify-center pointer-events-none">
                      <div className="text-xs font-mono text-[var(--fg-muted)]/40 rotate-180" style={{ writingMode: 'vertical-lr' }}>
                        Inicio / Start
                      </div>
                    </div>
                    {LANE_ORDER.filter(lane => lane !== 'achievement' && lane !== 'learning' && visibleLanes.has(lane)).map((lane, laneIndex) => {
                      const laneEntries = entriesByLane[lane]
                      const colors = LANE_COLORS[lane]

                      return (
                        <div
                          key={lane}
                          className="relative flex items-center h-12 sm:h-14"
                        >
                          {/* Track area - full width with margins */}
                          <div className="absolute inset-x-0 h-full flex items-center">
                            {/* Base track line */}
                            <div className="absolute inset-x-0 h-0.5 bg-[var(--border)]/10 rounded-full" />

                            {/* Entry lines or markers */}
                            {laneEntries.map((entry) => {
                              const startPercent = getStartPercent(entry)
                              const endPercent = getEndPercent(entry)
                              const isOngoing = entry.endYear === null
                              const isActive = hoveredEntry === entry.id || selectedEntry === entry.id
                              const isPointEvent = entry.startYear === entry.endYear && entry.startMonth === entry.endMonth
                              const glowIntensity = getIntensity(entry.id)

                              // Dynamic glow style
                              const glowStyle = glowIntensity > 0 ? {
                                boxShadow: `0 0 ${20 * glowIntensity}px ${colors.hex}`,
                                filter: `brightness(${1 + 0.3 * glowIntensity})`,
                              } : {}

                              // For point events (achievements), show as a larger marker
                              if (isPointEvent) {
                                return (
                                  <motion.div
                                    key={entry.id}
                                    className={cn(
                                      'absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer',
                                      'w-5 h-5 sm:w-6 sm:h-6 rounded-full',
                                      colors.bg,
                                      'ring-2 ring-[var(--bg)]',
                                      isActive && 'scale-125',
                                      hoveredEntry && !isActive && glowIntensity === 0 && 'opacity-40',
                                      'transition-all duration-300'
                                    )}
                                    style={{
                                      left: `calc(${startPercent}% - 12px)`,
                                      ...glowStyle,
                                    }}
                                    initial={animate ? { scale: 0, opacity: 0 } : undefined}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ 
                                      duration: 0.8,
                                      ease: [0.25, 0.46, 0.45, 0.94],
                                      delay: laneIndex * 0.15 + 0.3
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
                                    'absolute h-2 rounded-full cursor-pointer z-10',
                                    colors.bg,
                                    isActive && 'h-2.5',
                                    hoveredEntry && !isActive && glowIntensity === 0 && 'opacity-40',
                                    'transition-all duration-300'
                                  )}
                                  style={{
                                    left: `${startPercent}%`,
                                    width: `${endPercent - startPercent}%`,
                                    ...glowStyle,
                                  }}
                                  initial={animate ? { scaleX: 0, opacity: 0, originX: 0 } : undefined}
                                  animate={{ scaleX: 1, opacity: 1 }}
                                  transition={{
                                    duration: 1,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                    delay: laneIndex * 0.15 + 0.2,
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
                                      'w-3.5 h-3.5 rounded-full',
                                      colors.bg,
                                      'ring-2 ring-[var(--bg)]'
                                    )}
                                    initial={animate ? { scale: 0, opacity: 0 } : undefined}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.6, ease: 'easeOut', delay: laneIndex * 0.15 + 0.4 }}
                                  />

                                  {/* End node */}
                                  <motion.div
                                    className={cn(
                                      'absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2',
                                      'w-3.5 h-3.5 rounded-full',
                                      colors.bg,
                                      isOngoing && 'ring-2 ring-white/60',
                                      !isOngoing && 'ring-2 ring-[var(--bg)]'
                                    )}
                                    initial={animate ? { scale: 0, opacity: 0 } : undefined}
                                    animate={
                                      isOngoing
                                        ? { scale: [1, 1.2, 1], opacity: 1 }
                                        : { scale: 1, opacity: 1 }
                                    }
                                    transition={
                                      isOngoing
                                        ? { repeat: Infinity, duration: 1.5, delay: 0.6 }
                                        : { duration: 0.6, ease: 'easeOut', delay: laneIndex * 0.15 + 0.5 }
                                    }
                                  />
                                </motion.div>
                              )
                            })}

                            {/* Highlight markers are moved to achievements row */}
                          </div>
                        </div>
                      )
                    })}

                    {/* Achievements row with highlights from all lanes + standalone achievements */}
                    <div className="relative flex items-center h-12 sm:h-14 mt-2">
                      {/* Track area */}
                      <div className="absolute inset-x-0 h-full flex items-center">
                        <div className="absolute inset-x-0 h-0.5 bg-[var(--border)]/10 rounded-full" />

                        {/* Highlights from education lane */}
                        {JOURNEY_ENTRIES.filter(e => e.lane === 'education').map((entry) =>
                          entry.highlights?.map((highlight) => {
                            const percent = getHighlightPercent(highlight)
                            const glowIntensity = getIntensity(entry.id)
                            const haloColor = LANE_COLORS.education.hex // Blue halo

                            const haloStyle = glowIntensity > 0 ? {
                              boxShadow: `0 0 ${24 * glowIntensity}px ${haloColor}`,
                              filter: `brightness(${1 + 0.4 * glowIntensity})`,
                            } : {
                              boxShadow: `0 0 16px rgba(59, 130, 246, 0.3)`
                            }

                            return (
                              <motion.div
                                key={`highlight-${entry.id}-${highlight.id}`}
                                className={cn(
                                  'absolute top-1/2 -translate-y-1/2 z-20',
                                  'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400',
                                  'ring-2 ring-[var(--bg)]'
                                )}
                                style={{
                                  left: `calc(${percent}% - 12px)`,
                                  ...haloStyle,
                                }}
                                initial={animate ? { scale: 0 } : undefined}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 }}
                                title={`${t(`entries.${entry.id}.highlights.${highlight.id}`)} (Formación)`}
                              />
                            )
                          })
                        )}

                        {/* Highlights from work lane */}
                        {JOURNEY_ENTRIES.filter(e => e.lane === 'work').map((entry) =>
                          entry.highlights?.map((highlight) => {
                            const percent = getHighlightPercent(highlight)
                            const glowIntensity = getIntensity(entry.id)
                            const haloColor = LANE_COLORS.work.hex // Green halo

                            const haloStyle = glowIntensity > 0 ? {
                              boxShadow: `0 0 ${24 * glowIntensity}px ${haloColor}`,
                              filter: `brightness(${1 + 0.4 * glowIntensity})`,
                            } : {
                              boxShadow: `0 0 16px rgba(16, 185, 129, 0.3)`
                            }

                            return (
                              <motion.div
                                key={`highlight-${entry.id}-${highlight.id}`}
                                className={cn(
                                  'absolute top-1/2 -translate-y-1/2 z-20',
                                  'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400',
                                  'ring-2 ring-[var(--bg)]'
                                )}
                                style={{
                                  left: `calc(${percent}% - 12px)`,
                                  ...haloStyle,
                                }}
                                initial={animate ? { scale: 0 } : undefined}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 }}
                                title={`${t(`entries.${entry.id}.highlights.${highlight.id}`)} (Experiencia)`}
                              />
                            )
                          })
                        )}

                        {/* Standalone achievements (vissoft, etc) */}
                        {JOURNEY_ENTRIES.filter(e => e.lane === 'achievement').map((entry) => {
                          const percent = getHighlightPercent({ 
                            year: entry.startYear, 
                            month: entry.startMonth, 
                            day: entry.startDay 
                          } as JourneyHighlight)
                          const glowIntensity = getIntensity(entry.id)
                          const haloColor = LANE_COLORS.project.hex // Purple halo for projects

                          const haloStyle = glowIntensity > 0 ? {
                            boxShadow: `0 0 ${24 * glowIntensity}px ${haloColor}`,
                            filter: `brightness(${1 + 0.4 * glowIntensity})`,
                          } : {
                            boxShadow: `0 0 16px rgba(139, 92, 246, 0.3)`
                          }

                          return (
                            <motion.div
                              key={entry.id}
                              className={cn(
                                'absolute top-1/2 -translate-y-1/2 z-20 cursor-pointer',
                                'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400',
                                'ring-2 ring-[var(--bg)]',
                                (hoveredEntry === entry.id || selectedEntry === entry.id) && 'scale-125',
                                'transition-all duration-300'
                              )}
                              style={{
                                left: `calc(${percent}% - 12px)`,
                                ...haloStyle,
                              }}
                              initial={animate ? { scale: 0 } : undefined}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.6 }}
                              onMouseEnter={() => setHoveredEntry(entry.id)}
                              onMouseLeave={() => setHoveredEntry(null)}
                              onClick={() =>
                                setSelectedEntry(selectedEntry === entry.id ? null : entry.id)
                              }
                              title={t(`entries.${entry.id}.role`)}
                            />
                          )
                        })}
                      </div>
                    </div>

                    {visibleLanes.has('learning') && entriesByLane.learning.length > 0 && (
                      <div className="mt-4 px-6 sm:px-8">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={cn('inline-flex w-2 h-2 rounded-full', LANE_COLORS.learning.bg)} />
                          <span className="text-xs uppercase tracking-wide text-[var(--fg-muted)]/70">
                            {t('legend.learning')}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {entriesByLane.learning.map((entry) => {
                            const startLabel = formatStartOnly(entry.startYear, entry.startMonth)
                            const isActive = hoveredEntry === entry.id || selectedEntry === entry.id

                            return (
                              <motion.button
                                key={entry.id}
                                type="button"
                                className={cn(
                                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
                                  'bg-[var(--card)]/40 ring-1 ring-[var(--border)]/20',
                                  'text-xs text-[var(--fg)]/80 hover:text-[var(--fg)]',
                                  'transition-all duration-300',
                                  isActive && 'ring-2 ring-pink-500/40'
                                )}
                                initial={animate ? { opacity: 0, y: 6 } : undefined}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                onMouseEnter={() => setHoveredEntry(entry.id)}
                                onMouseLeave={() => setHoveredEntry(null)}
                                onClick={() =>
                                  setSelectedEntry(selectedEntry === entry.id ? null : entry.id)
                                }
                              >
                                <span className="text-pink-400">🎯</span>
                                <span className="font-medium">{t(`entries.${entry.id}.role`)}</span>
                                <span className="text-[var(--fg-muted)]/70">{startLabel}</span>
                              </motion.button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hint to click years */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  <span className="text-xs text-[var(--fg-muted)]/40">💡</span>
                  <p className="text-xs text-[var(--fg-muted)]/50">
                    {t('clickYearHint')}
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Drill-down view for specific year */
              <motion.div
                key={`drilldown-${drillDownYear}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header with back button and year */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handleBackToOverview}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg',
                      'bg-[var(--card)]/40 ring-1 ring-[var(--border)]/30',
                      'text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]',
                      'transition-colors'
                    )}
                  >
                    <span>←</span>
                    <span>Volver</span>
                  </button>
                  <h3 className="text-2xl font-bold text-[var(--accent)]">
                    {drillDownYear}
                  </h3>
                  <div className="w-24" /> {/* Spacer for balance */}
                </div>

                {/* Month axis */}
                <div className="relative mb-3">
                  <div className="flex">
                    <div className="w-14 sm:w-16 flex-shrink-0" />
                    <div className="flex-1 flex justify-between">
                      {MONTH_NAMES.map((month) => (
                        <span
                          key={month}
                          className="text-[0.6rem] sm:text-xs font-mono text-[var(--fg-muted)]/60"
                        >
                          {month}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Monthly timeline container */}
                <div className="relative bg-[var(--card)]/20 rounded-2xl ring-1 ring-[var(--border)]/20 overflow-visible backdrop-blur-sm">
                  {/* Vertical month grid lines with current month indicator */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-y-0 left-14 sm:left-16 right-0">
                      {MONTH_NAMES.map((_, i) => {
                        const now = new Date()
                        const isCurrentMonth = drillDownYear === now.getFullYear() && i === now.getMonth()
                        return (
                          <div
                            key={i}
                            className={cn(
                              'absolute top-0 bottom-0',
                              isCurrentMonth ? 'w-1 bg-[var(--accent)]/30' : 'w-px bg-[var(--border)]/10'
                            )}
                            style={{ left: `${(i / 12) * 100}%` }}
                          />
                        )
                      })}
                    </div>
                  </div>

                  {/* Lanes for drill-down year */}
                  <div className="relative py-6 sm:py-8">
                    {/* Start label */}
                    <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 flex items-center justify-center pointer-events-none">
                      <div className="text-xs font-mono text-[var(--fg-muted)]/40 rotate-180" style={{ writingMode: 'vertical-lr' }}>
                        Inicio / Start
                      </div>
                    </div>

                    {LANE_ORDER.filter(lane => lane !== 'achievement' && lane !== 'learning' && visibleLanes.has(lane)).map((lane) => {
                      const laneEntries = entriesByLane[lane].filter(e => 
                        isEntryInYear(e, drillDownYear)
                      )
                      const colors = LANE_COLORS[lane]

                      return (
                        <div
                          key={lane}
                          className="relative flex items-center h-12 sm:h-14"
                        >
                          {/* Track area */}
                          <div className="absolute inset-x-0 h-full flex items-center">
                            <div className="absolute inset-x-0 h-0.5 bg-[var(--border)]/10 rounded-full" />

                            {laneEntries.map((entry) => {
                              const range = getMonthRange(entry, drillDownYear)
                              if (!range) return null

                              const { startPercent, endPercent } = range
                              const isActive = hoveredEntry === entry.id || selectedEntry === entry.id
                              const isPointEvent = startPercent === endPercent

                              if (isPointEvent) {
                                const glowIntensity = getIntensity(entry.id)
                                const glowStyle = glowIntensity > 0 ? {
                                  boxShadow: `0 0 ${16 * glowIntensity}px ${colors.hex}`,
                                  filter: `brightness(${1 + 0.25 * glowIntensity})`,
                                } : {}

                                return (
                                  <motion.div
                                    key={entry.id}
                                    className={cn(
                                      'absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer',
                                      'w-5 h-5 sm:w-6 sm:h-6 rounded-full',
                                      colors.bg,
                                      'ring-2 ring-[var(--bg)]',
                                      isActive && 'scale-150 shadow-lg',
                                      hoveredEntry && !isActive && glowIntensity === 0 && 'opacity-50',
                                      'transition-all duration-300'
                                    )}
                                    style={{
                                      left: `calc(${startPercent}% - 12px)`,
                                      ...glowStyle,
                                    }}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
                                    onMouseEnter={() => setHoveredEntry(entry.id)}
                                    onMouseLeave={() => setHoveredEntry(null)}
                                    onClick={() =>
                                      setSelectedEntry(selectedEntry === entry.id ? null : entry.id)
                                    }
                                  />
                                )
                              }

                              const glowIntensity = getIntensity(entry.id)
                              const glowStyle = glowIntensity > 0 ? {
                                boxShadow: `0 0 ${16 * glowIntensity}px ${colors.hex}, inset 0 0 8px ${colors.hex}${Math.floor(0.3 * glowIntensity * 255).toString(16).padStart(2, '0')}`,
                                filter: `brightness(${1 + 0.2 * glowIntensity})`,
                              } : {}

                              const isRecent = entry.endYear === drillDownYear && entry.endMonth && entry.endMonth >= (new Date().getMonth() + 1) - 3

                              return (
                                <motion.div
                                  key={entry.id}
                                  className={cn(
                                    'absolute rounded-full cursor-pointer z-10 group',
                                    colors.bg,
                                    isActive ? 'h-4 sm:h-4.5 shadow-2xl' : 'h-2.5 sm:h-3',
                                    hoveredEntry && !isActive && glowIntensity === 0 && 'opacity-50',
                                    'transition-all duration-300'
                                  )}
                                  style={{
                                    left: `${startPercent}%`,
                                    width: `${Math.max(endPercent - startPercent, 2)}%`,
                                    ...glowStyle,
                                  }}
                                  initial={{ scaleX: 0, opacity: 0, originX: 0 }}
                                  animate={{ scaleX: 1, opacity: 1 }}
                                  transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
                                  onMouseEnter={() => setHoveredEntry(entry.id)}
                                  onMouseLeave={() => setHoveredEntry(null)}
                                  onClick={() =>
                                    setSelectedEntry(selectedEntry === entry.id ? null : entry.id)
                                  }
                                  title={`${t(`entries.${entry.id}.role`)} - ${formatPeriod(entry.startYear, entry.startMonth, entry.endYear, entry.endMonth, t('present'))}`}
                                >
                                  {/* Animated pulse for recent events */}
                                  {isRecent && !isActive && (
                                    <motion.div
                                      className="absolute inset-0 rounded-full"
                                      style={{ backgroundColor: colors.hex }}
                                      animate={{ opacity: [0.5, 0] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    />
                                  )}
                                  
                                  {/* Start node */}
                                  <motion.div
                                    className={cn(
                                      'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2',
                                      'w-4 h-4 rounded-full',
                                      colors.bg,
                                      'ring-2 ring-[var(--bg)]'
                                    )}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
                                  />
                                  {/* End node */}
                                  <motion.div
                                    className={cn(
                                      'absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2',
                                      'w-4 h-4 rounded-full',
                                      colors.bg,
                                      'ring-2 ring-[var(--bg)]'
                                    )}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
                                  />
                                </motion.div>
                              )
                            })}

                            {/* Highlights are moved to achievements row below */}
                          </div>
                        </div>
                      )}
                    )}

                    {/* Achievements row with highlights from all lanes */}
                    <div className="relative flex items-center h-12 sm:h-14 mt-2">
                      {/* Track area */}
                      <div className="absolute inset-x-0 h-full flex items-center">
                        <div className="absolute inset-x-0 h-0.5 bg-[var(--border)]/10 rounded-full" />

                        {/* Highlights from education lane */}
                        {JOURNEY_ENTRIES.filter(e => e.lane === 'education').map((entry) =>
                          entry.highlights?.filter(h => h.year === drillDownYear).map((highlight) => {
                            const percent = monthToPercent(highlight.month ?? 6, highlight.day ?? 15)
                            const glowIntensity = getIntensity(entry.id)
                            const haloColor = LANE_COLORS.education.hex

                            const haloStyle = glowIntensity > 0 ? {
                              boxShadow: `0 0 ${20 * glowIntensity}px ${haloColor}`,
                              filter: `brightness(${1 + 0.4 * glowIntensity})`,
                            } : {
                              boxShadow: `0 0 14px rgba(59, 130, 246, 0.3)`
                            }

                            return (
                              <motion.div
                                key={`highlight-${entry.id}-${highlight.id}`}
                                className={cn(
                                  'absolute top-1/2 -translate-y-1/2 z-20 cursor-pointer',
                                  'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400',
                                  'ring-2 ring-[var(--bg)]',
                                  'transition-all duration-300'
                                )}
                                style={{
                                  left: `calc(${percent}% - 12px)`,
                                  ...haloStyle,
                                }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.4 }}
                                onMouseEnter={() => setHoveredEntry(entry.id)}
                                onMouseLeave={() => setHoveredEntry(null)}
                                title={`${t(`entries.${entry.id}.highlights.${highlight.id}`)} (${MONTH_NAMES[highlight.month ? highlight.month - 1 : 5]} ${highlight.day || 15}) - Formación`}
                              />
                            )
                          })
                        )}

                        {/* Highlights from work lane */}
                        {JOURNEY_ENTRIES.filter(e => e.lane === 'work').map((entry) =>
                          entry.highlights?.filter(h => h.year === drillDownYear).map((highlight) => {
                            const percent = monthToPercent(highlight.month ?? 6, highlight.day ?? 15)
                            const glowIntensity = getIntensity(entry.id)
                            const haloColor = LANE_COLORS.work.hex

                            const haloStyle = glowIntensity > 0 ? {
                              boxShadow: `0 0 ${20 * glowIntensity}px ${haloColor}`,
                              filter: `brightness(${1 + 0.4 * glowIntensity})`,
                            } : {
                              boxShadow: `0 0 14px rgba(16, 185, 129, 0.3)`
                            }

                            return (
                              <motion.div
                                key={`highlight-${entry.id}-${highlight.id}`}
                                className={cn(
                                  'absolute top-1/2 -translate-y-1/2 z-20 cursor-pointer',
                                  'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400',
                                  'ring-2 ring-[var(--bg)]',
                                  'transition-all duration-300'
                                )}
                                style={{
                                  left: `calc(${percent}% - 12px)`,
                                  ...haloStyle,
                                }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.4 }}
                                onMouseEnter={() => setHoveredEntry(entry.id)}
                                onMouseLeave={() => setHoveredEntry(null)}
                                title={`${t(`entries.${entry.id}.highlights.${highlight.id}`)} (${MONTH_NAMES[highlight.month ? highlight.month - 1 : 5]} ${highlight.day || 15}) - Experiencia`}
                              />
                            )
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {visibleLanes.has('learning') && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={cn('inline-flex w-2 h-2 rounded-full', LANE_COLORS.learning.bg)} />
                        <span className="text-xs uppercase tracking-wide text-[var(--fg-muted)]/70">
                          {t('legend.learning')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {entriesByLane.learning
                          .filter((entry) => isEntryInYear(entry, drillDownYear))
                          .map((entry) => {
                            const startLabel = formatStartOnly(entry.startYear, entry.startMonth)
                            const isActive = hoveredEntry === entry.id || selectedEntry === entry.id

                            return (
                              <motion.button
                                key={entry.id}
                                type="button"
                                className={cn(
                                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
                                  'bg-[var(--card)]/40 ring-1 ring-[var(--border)]/20',
                                  'text-xs text-[var(--fg)]/80 hover:text-[var(--fg)]',
                                  'transition-all duration-300',
                                  isActive && 'ring-2 ring-pink-500/40'
                                )}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                onMouseEnter={() => setHoveredEntry(entry.id)}
                                onMouseLeave={() => setHoveredEntry(null)}
                                onClick={() =>
                                  setSelectedEntry(selectedEntry === entry.id ? null : entry.id)
                                }
                              >
                                <span className="text-pink-400">🎯</span>
                                <span className="font-medium">{t(`entries.${entry.id}.role`)}</span>
                                <span className="text-[var(--fg-muted)]/70">{startLabel}</span>
                              </motion.button>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Detail Card - Fixed height placeholder */}
          <div className="mt-10 h-[180px] sm:h-[160px]">
            <AnimatePresence mode="wait">
              {activeEntry ? (
                <motion.div
                  key={activeEntry.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="h-full"
                >
                  <StreamCard
                    lane={activeEntry.lane}
                    title={t(`entries.${activeEntry.id}.role`)}
                    organization={t(`entries.${activeEntry.id}.org`)}
                    period={
                      activeEntry.lane === 'learning'
                        ? formatStartOnly(activeEntry.startYear, activeEntry.startMonth)
                        : formatPeriod(
                            activeEntry.startYear,
                            activeEntry.startMonth,
                            activeEntry.endYear,
                            activeEntry.endMonth,
                            t('present')
                          )
                    }
                    description={t(`entries.${activeEntry.id}.desc`)}
                    highlights={activeEntry.highlights?.map((h) => ({
                      label: t(`entries.${activeEntry.id}.highlights.${h.id}`),
                      year: h.year,
                    }))}
                    tags={activeEntry.tags}
                    link={activeEntry.link}
                    isOngoing={activeEntry.endYear === null && activeEntry.lane !== 'learning'}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center rounded-xl bg-[var(--card)]/10 ring-1 ring-[var(--border)]/10"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--fg-muted)]/10 flex items-center justify-center mb-3">
                    <svg 
                      className="w-5 h-5 text-[var(--fg-muted)]/40" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                  <p className="text-sm text-[var(--fg-muted)]/50 font-medium">
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
