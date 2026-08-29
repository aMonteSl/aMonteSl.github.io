'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeader, SectionShell } from '@/components/ui'
import { useLocale, useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'
import { shouldAnimate } from '@/lib/motion'

import { StreamCard } from './StreamCard'
import { StreamLegend } from './StreamLegend'
import { useGlowAnimation } from './useGlowAnimation'
import type { JourneyEntry, JourneyLane, JourneyHighlight } from './types'
import {
  clampPercent,
  dateToTimelinePercent as getTimelinePercent,
  dateToYearPercent,
  getEntryEndDate,
  getEntryStartDate,
  getHighlightDate,
  getVisibleTimelineYears,
  getYearState,
  parseJourneyDate,
  toJourneyDate,
  toLocalDate,
  type JourneyDate,
} from './timelineMath'
import {
  LANE_COLORS,
  LANE_ORDER,
} from './timelineConfig'
import {
  JOURNEY_ENTRIES,
  LANE_CONFIG,
  TIMELINE_START,
  TIMELINE_END,
  CURRENT_DATE,
} from '@/content/journey'

type ActiveHighlightRef = {
  entryId: string
  highlightId: string
}

/** Format date for display */
function formatPeriod(
  startYear: number,
  startMonth: number | undefined,
  endYear: number | null,
  endMonth: number | undefined,
  presentLabel: string,
  locale: string,
): string {
  const localeCode = locale === 'es' ? 'es-ES' : 'en-US'
  const formatDate = (year: number, month?: number) => {
    if (month) {
      const monthLabel = new Intl.DateTimeFormat(localeCode, { month: 'short' })
        .format(new Date(year, month - 1, 1))
        .replace('.', '')

      return `${monthLabel.charAt(0).toUpperCase()}${monthLabel.slice(1)} ${year}`
    }
    return `${year}`
  }

  const start = formatDate(startYear, startMonth)
  
  if (endYear === null) {
    return `${start} - ${presentLabel}`
  }
  
  if (startYear === endYear && startMonth === endMonth) {
    return start
  }
  
  const end = formatDate(endYear, endMonth)
  return `${start} - ${end}`
}

declare global {
  interface Window {
    __JOURNEY_TODAY__?: string
  }
}

function dateToTimelinePercent(date: JourneyDate, timelineEndYear: number): number {
  return getTimelinePercent(date, TIMELINE_START, timelineEndYear)
}

function isPointEntry(entry: JourneyEntry): boolean {
  return (
    entry.startYear === entry.endYear &&
    entry.startMonth === entry.endMonth &&
    entry.startDay === entry.endDay
  )
}

function isFutureLearningEntry(entry: JourneyEntry, today: JourneyDate): boolean {
  return entry.lane === 'learning' && toLocalDate(getEntryStartDate(entry)).getTime() > toLocalDate(today).getTime()
}

function isSameHighlight(a: ActiveHighlightRef | null, b: ActiveHighlightRef): boolean {
  return Boolean(a && a.entryId === b.entryId && a.highlightId === b.highlightId)
}

function useJourneyToday(): JourneyDate {
  const [today, setToday] = useState<JourneyDate>(CURRENT_DATE)

  useEffect(() => {
    const queryToday = new URLSearchParams(window.location.search).get('journeyToday') ?? undefined
    setToday(parseJourneyDate(window.__JOURNEY_TODAY__) ?? parseJourneyDate(queryToday) ?? toJourneyDate(new Date()))
  }, [])

  return today
}

/**
 * ParallelStreamsSection
 * Professional journey visualization with year drill-down
 */
export function ParallelStreamsSection() {
  const t = useTranslations('journey')
  const { locale } = useLocale()
  const animate = shouldAnimate()
  const today = useJourneyToday()
  const years = useMemo(
    () => getVisibleTimelineYears(JOURNEY_ENTRIES, today, TIMELINE_START, TIMELINE_END),
    [today],
  )
  const timelineEndYear = years.at(-1) ?? TIMELINE_END
  const yearStates = useMemo(
    () => new Map(years.map((year) => [year, getYearState(year, JOURNEY_ENTRIES, today)])),
    [today, years],
  )
  
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const [hoveredHighlight, setHoveredHighlight] = useState<ActiveHighlightRef | null>(null)
  const [selectedHighlight, setSelectedHighlight] = useState<ActiveHighlightRef | null>(null)
  const [drillDownYear, setDrillDownYear] = useState<number | null>(null)
  const [visibleLanes, setVisibleLanes] = useState<Set<JourneyLane>>(new Set(['education', 'work', 'project', 'achievement', 'learning']))
  const monthNames = useMemo(
    () => Array.from({ length: 12 }, (_, index) => {
      const label = new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', { month: 'short' })
        .format(new Date(2026, index, 1))
        .replace('.', '')

      return `${label.charAt(0).toUpperCase()}${label.slice(1)}`
    }),
    [locale],
  )
  const backLabel = locale === 'es' ? 'Volver' : 'Back'
  const startLabel = locale === 'es' ? 'Inicio' : 'Start'

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
    const id = hoveredHighlight?.entryId ?? hoveredEntry ?? selectedHighlight?.entryId ?? selectedEntry
    return id ? JOURNEY_ENTRIES.find((e) => e.id === id) : null
  }, [hoveredEntry, hoveredHighlight, selectedEntry, selectedHighlight])

  const activeHighlightRef = hoveredHighlight ?? (hoveredEntry ? null : selectedHighlight)

  const formatHighlightDate = useCallback((date: JourneyDate) => {
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(toLocalDate(date))
  }, [locale])

  const todayLabel = useMemo(() => formatHighlightDate(today), [formatHighlightDate, today])

  const activeHighlight = useMemo(() => {
    if (!activeEntry || !activeHighlightRef || activeEntry.id !== activeHighlightRef.entryId) {
      return null
    }

    const highlight = activeEntry.highlights?.find((item) => item.id === activeHighlightRef.highlightId)
    if (!highlight) {
      return null
    }

    return {
      id: highlight.id,
      label: t(`entries.${activeEntry.id}.highlights.${highlight.id}`),
      date: formatHighlightDate(getHighlightDate(highlight)),
      lane: activeEntry.lane,
    }
  }, [activeEntry, activeHighlightRef, formatHighlightDate, t])

  const handleEntryHoverStart = useCallback((entryId: string) => {
    setHoveredHighlight(null)
    setHoveredEntry(entryId)
  }, [])

  const handleEntryHoverEnd = useCallback((entryId: string) => {
    setHoveredEntry((current) => (current === entryId ? null : current))
  }, [])

  const handleEntryClick = useCallback((entryId: string, event?: { stopPropagation: () => void }) => {
    event?.stopPropagation()
    setSelectedHighlight(null)
    setSelectedEntry((current) => (current === entryId ? null : entryId))
  }, [])

  const handleHighlightHoverStart = useCallback((entryId: string, highlightId: string) => {
    setHoveredEntry(null)
    setHoveredHighlight({ entryId, highlightId })
  }, [])

  const handleHighlightHoverEnd = useCallback((entryId: string, highlightId: string) => {
    setHoveredHighlight((current) => (
      isSameHighlight(current, { entryId, highlightId }) ? null : current
    ))
  }, [])

  const handleHighlightClick = useCallback((
    entryId: string,
    highlightId: string,
    event?: { stopPropagation: () => void },
  ) => {
    event?.stopPropagation()
    setSelectedEntry(null)
    setSelectedHighlight((current) => (
      isSameHighlight(current, { entryId, highlightId }) ? null : { entryId, highlightId }
    ))
  }, [])

  const isHighlightActive = useCallback((entryId: string, highlightId: string) => (
    isSameHighlight(hoveredHighlight, { entryId, highlightId }) ||
    isSameHighlight(selectedHighlight, { entryId, highlightId })
  ), [hoveredHighlight, selectedHighlight])

  // Build legend items from lane config
  const legendItems = useMemo(
    () =>
      LANE_CONFIG.map((config) => ({
        lane: config.lane,
        label: t(`legend.${config.lane}`),
      })),
    [t]
  )

  /** Calculate percentage position for month drill-down */
  const monthToPercent = useCallback((month: number, day: number = 15): number => {
    return dateToYearPercent({ year: drillDownYear ?? today.year, month, day })
  }, [drillDownYear, today])

  /** Get percentage position for an entry's start (year view) */
  const getStartPercent = useCallback((entry: JourneyEntry) => {
    return dateToTimelinePercent(getEntryStartDate(entry), timelineEndYear)
  }, [timelineEndYear])

  /** Get percentage position for an entry's end (year view) */
  const getEndPercent = useCallback((entry: JourneyEntry) => {
    return dateToTimelinePercent(getEntryEndDate(entry, today), timelineEndYear)
  }, [timelineEndYear, today])

  /** Get highlight percentage (year view) */
  const getHighlightPercent = useCallback((h: JourneyHighlight) => {
    return dateToTimelinePercent(getHighlightDate(h), timelineEndYear)
  }, [timelineEndYear])

  /** Check if entry is visible in drill-down year */
  const isEntryInYear = useCallback((entry: JourneyEntry, year: number): boolean => {
    const startTime = toLocalDate(getEntryStartDate(entry)).getTime()
    const endTime = toLocalDate(getEntryEndDate(entry, today)).getTime()
    const yearStart = new Date(year, 0, 1).getTime()
    const yearEnd = new Date(year, 11, 31).getTime()

    return startTime <= yearEnd && endTime >= yearStart
  }, [today])

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
    } else if (entry.endYear === null) {
      if (year === today.year) {
        endMonth = today.month
        endDay = today.day
      } else if (year < today.year) {
        endMonth = 12
        endDay = 31
      } else {
        return null
      }
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
  }, [monthToPercent, today])

  const renderEntryInlineHighlights = useCallback((
    entry: JourneyEntry,
    startPercent: number,
    endPercent: number,
    drillYear?: number
  ) => {
    if (entry.lane !== 'project' || !entry.highlights?.length) {
      return null
    }

    const width = Math.max(endPercent - startPercent, 0.1)

    return entry.highlights
      .filter((highlight) => drillYear === undefined || getHighlightDate(highlight).year === drillYear)
      .map((highlight) => {
        const highlightDate = getHighlightDate(highlight)
        const absolutePercent = drillYear === undefined
          ? getHighlightPercent(highlight)
          : monthToPercent(highlightDate.month, highlightDate.day)

        if (absolutePercent < startPercent - 0.1 || absolutePercent > endPercent + 0.1) {
          return null
        }

        const localPercent = clampPercent(((absolutePercent - startPercent) / width) * 100)
        const isActive = isHighlightActive(entry.id, highlight.id)

        return (
          <motion.button
            key={`inline-highlight-${entry.id}-${highlight.id}-${drillYear ?? 'overview'}`}
            type="button"
            className={cn(
              'absolute top-1/2 z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full',
              'border border-violet-100/70 bg-violet-300 shadow-[0_0_0_3px_rgba(139,92,246,0.22)]',
              'transition-all duration-200 hover:scale-125 hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200',
              isActive && 'scale-125 bg-violet-100 shadow-[0_0_0_5px_rgba(139,92,246,0.32),0_0_18px_rgba(139,92,246,0.55)]'
            )}
            style={{ left: `${localPercent}%` }}
            initial={animate ? { scale: 0, opacity: 0 } : undefined}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.5 }}
            onClick={(event) => handleHighlightClick(entry.id, highlight.id, event)}
            onPointerEnter={() => handleHighlightHoverStart(entry.id, highlight.id)}
            onPointerMove={() => handleHighlightHoverStart(entry.id, highlight.id)}
            onPointerLeave={() => handleHighlightHoverEnd(entry.id, highlight.id)}
            title={t(`entries.${entry.id}.highlights.${highlight.id}`)}
            aria-label={t(`entries.${entry.id}.highlights.${highlight.id}`)}
          />
        )
      })
  }, [animate, getHighlightPercent, handleHighlightClick, handleHighlightHoverEnd, handleHighlightHoverStart, isHighlightActive, monthToPercent, t])

  /** Handle year click for drill-down */
  const handleYearClick = useCallback((year: number) => {
    if (!yearStates.get(year)?.isClickable) {
      return
    }

    if (drillDownYear === year) {
      setDrillDownYear(null)
    } else {
      setDrillDownYear(year)
      setSelectedEntry(null)
      setHoveredEntry(null)
      setSelectedHighlight(null)
      setHoveredHighlight(null)
    }
  }, [drillDownYear, yearStates])

  /** Back to overview */
  const handleBackToOverview = useCallback(() => {
    setDrillDownYear(null)
    setHoveredHighlight(null)
    setHoveredEntry(null)
    setSelectedHighlight(null)
  }, [])

  const verticalFocusedEntry = useMemo(() => {
    const focusedId = selectedHighlight?.entryId ?? selectedEntry
    return focusedId ? JOURNEY_ENTRIES.find((entry) => entry.id === focusedId) ?? null : null
  }, [selectedEntry, selectedHighlight])

  const getVerticalTop = useCallback((date: JourneyDate) => (
    100 - dateToTimelinePercent(date, timelineEndYear)
  ), [timelineEndYear])

  const renderDetailCard = (className = 'mt-10') => (
    <div className={cn(className, 'min-h-[190px]')}>
      <AnimatePresence mode="wait">
        {activeEntry ? (
          <motion.div
            key={activeEntry.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="h-full min-h-[190px]"
          >
            <StreamCard
              lane={activeEntry.lane}
              title={t(`entries.${activeEntry.id}.role`)}
              organization={t(`entries.${activeEntry.id}.org`)}
              period={formatPeriod(
                activeEntry.startYear,
                activeEntry.startMonth,
                activeEntry.endYear,
                activeEntry.endMonth,
                t('present'),
                locale
              )}
              description={t(`entries.${activeEntry.id}.desc`)}
              highlights={activeEntry.highlights?.map((h) => ({
                id: h.id,
                label: t(`entries.${activeEntry.id}.highlights.${h.id}`),
                year: h.year,
                date: formatHighlightDate(getHighlightDate(h)),
              }))}
              activeHighlight={activeHighlight}
              activeHighlightLabel={t('selectedMilestone')}
              tags={activeEntry.tags}
              link={activeEntry.link}
              isOngoing={activeEntry.endYear === null}
              ongoingLabel={t('ongoing')}
              moreLabel={t('viewMore')}
            />
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[190px] flex-col items-center justify-center rounded-xl bg-[var(--card)]/10 text-center ring-1 ring-[var(--border)]/10"
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
  )

  return (
    <SectionShell id="journey" tone="xr">
        <SectionHeader kicker={t('kicker')} title={t('title')} subtitle={t('subtitle')} align="left" />

      <div className="mx-auto max-w-6xl">
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

        {/* Vertical lane timeline for mobile and portrait layouts */}
        <div className="relative hidden w-full max-md:block max-lg:portrait:block">
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[var(--border)]/20 bg-[var(--card)]/15 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
              {t('today')}
            </span>
            <span className="rounded-full border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
              {todayLabel}
            </span>
          </div>

          <motion.div
            layout
            className={cn(
              'relative mb-24 rounded-2xl border border-[var(--border)]/20 bg-[var(--card)]/15',
              verticalFocusedEntry
                ? 'grid grid-cols-[3.25rem_minmax(0,1fr)] gap-3 overflow-visible p-3'
                : 'overflow-hidden p-4'
            )}
          >
            <motion.div
              layout
              className={cn(
                'relative w-full',
                verticalFocusedEntry
                  ? 'h-[72vh] min-h-[35rem] max-h-[54rem]'
                  : 'h-[84vh] min-h-[50rem] max-h-[70rem]'
              )}
            >
              <div className={cn(
                'absolute inset-y-10 left-0 w-12 transition-opacity duration-200',
                verticalFocusedEntry && 'pointer-events-none opacity-0'
              )}>
                {years.map((year) => {
                  const state = yearStates.get(year)
                  return (
                    <button
                      key={year}
                      type="button"
                      disabled={!state?.isClickable}
                      onClick={() => handleYearClick(year)}
                      className={cn(
                        'absolute right-1 -translate-y-1/2 rounded-full px-2 py-1 text-[0.62rem] font-mono font-semibold transition-colors',
                        state?.isCurrent
                          ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                          : state?.isPreview
                            ? 'text-[var(--fg-muted)]/35'
                            : 'text-[var(--fg-muted)]/65',
                        state?.isClickable && 'hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]'
                      )}
                      style={{ top: `${getVerticalTop({ year, month: 1, day: 1 })}%` }}
                    >
                      {year}
                    </button>
                  )
                })}
              </div>

              <div className={cn('absolute bottom-10 top-10 transition-all duration-300', verticalFocusedEntry ? 'left-0 right-0' : 'left-14 right-1')}>
                <div className="absolute inset-x-0 top-0 h-px bg-[var(--border)]/12" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--border)]/12" />
                <div
                  className="group absolute inset-x-0 h-px -translate-y-1/2 bg-[var(--accent)]/55"
                  style={{ top: `${getVerticalTop(today)}%` }}
                  title={`${t('today')}: ${todayLabel}`}
                >
                  <span className="pointer-events-none absolute right-0 top-1 -translate-y-1/2 rounded-full border border-[var(--accent)]/35 bg-[var(--bg)]/90 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
                    {todayLabel}
                  </span>
                </div>

                {LANE_ORDER.filter((lane) => visibleLanes.has(lane)).map((lane, laneIndex, laneList) => {
                  const laneEntries = entriesByLane[lane]
                  const colors = LANE_COLORS[lane]
                  const laneIsFocused = verticalFocusedEntry?.lane === lane
                  const left = laneList.length === 1 ? 50 : (laneIndex / (laneList.length - 1)) * 100

                  return (
                    <motion.div
                      key={lane}
                      layout
                      className={cn(
                        'absolute bottom-0 top-0 transition-opacity duration-300',
                        verticalFocusedEntry && !laneIsFocused ? 'pointer-events-none opacity-0' : 'opacity-100'
                      )}
                      style={{ left: verticalFocusedEntry ? '50%' : `${left}%` }}
                    >
                              <div className="absolute bottom-0 top-0 w-px -translate-x-1/2 bg-[var(--border)]/18" />
                      {laneEntries.map((entry) => {
                        const isActive = hoveredEntry === entry.id || selectedEntry === entry.id || selectedHighlight?.entryId === entry.id
                        const isPointEvent = isPointEntry(entry)
                        const startTop = getVerticalTop(getEntryStartDate(entry))
                        const endTop = getVerticalTop(getEntryEndDate(entry, today))
                        const top = isPointEvent ? startTop : Math.min(startTop, endTop)
                        const height = Math.max(Math.abs(startTop - endTop), 2)
                        const isFutureLearning = isFutureLearningEntry(entry, today)

                        if (isPointEvent) {
                          return (
                            <motion.button
                              key={entry.id}
                              type="button"
                              layout
                              className={cn(
                                'absolute z-20 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[var(--bg)] transition-all duration-200 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                                isFutureLearning ? 'border border-dashed border-pink-200/45 bg-pink-400/30 opacity-70' : colors.bg,
                                isActive && 'scale-125 shadow-[0_0_18px_rgba(238,174,148,0.45)]'
                              )}
                              style={{ top: `${top}%` }}
                              onPointerEnter={() => handleEntryHoverStart(entry.id)}
                              onPointerMove={() => handleEntryHoverStart(entry.id)}
                              onPointerLeave={() => handleEntryHoverEnd(entry.id)}
                              onClick={(event) => handleEntryClick(entry.id, event)}
                              aria-label={t(`entries.${entry.id}.role`)}
                              title={t(`entries.${entry.id}.role`)}
                            />
                          )
                        }

                        return (
                          <motion.div
                            key={entry.id}
                            layout
                              className={cn(
                              'absolute z-10 w-2 -translate-x-1/2 cursor-pointer rounded-full transition-all duration-200 hover:w-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                              colors.bg,
                              isActive && 'w-3 shadow-[0_0_18px_rgba(238,174,148,0.45)]'
                            )}
                            style={{ top: `${top}%`, height: `${height}%` }}
                            role="button"
                            tabIndex={0}
                            onPointerEnter={() => handleEntryHoverStart(entry.id)}
                            onPointerMove={() => handleEntryHoverStart(entry.id)}
                            onPointerLeave={() => handleEntryHoverEnd(entry.id)}
                            onClick={(event) => handleEntryClick(entry.id, event)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                handleEntryClick(entry.id, event)
                              }
                            }}
                            aria-label={t(`entries.${entry.id}.role`)}
                            title={t(`entries.${entry.id}.role`)}
                          >
                            <span className={cn('absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[var(--bg)]', colors.bg, entry.endYear === null && 'ring-white/60')} />
                            <span className={cn('absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full ring-2 ring-[var(--bg)]', colors.bg)} />

                            {entry.highlights?.map((highlight) => {
                              const highlightTop = getVerticalTop(getHighlightDate(highlight))
                              const localTop = clampPercent(((highlightTop - top) / height) * 100)
                              const isSelected = isHighlightActive(entry.id, highlight.id)

                              return (
                                <span
                                  key={highlight.id}
                                  role="button"
                                  tabIndex={0}
                                  className={cn(
                                    'absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-100/70 bg-violet-300 shadow-[0_0_0_2px_rgba(139,92,246,0.2)] transition-all hover:scale-125',
                                    isSelected && 'scale-125 bg-violet-100 shadow-[0_0_0_5px_rgba(139,92,246,0.32),0_0_18px_rgba(139,92,246,0.55)]'
                                  )}
                                  style={{ top: `${localTop}%` }}
                                  onPointerEnter={(event) => {
                                    event.stopPropagation()
                                    handleHighlightHoverStart(entry.id, highlight.id)
                                  }}
                                  onPointerMove={(event) => {
                                    event.stopPropagation()
                                    handleHighlightHoverStart(entry.id, highlight.id)
                                  }}
                                  onPointerLeave={(event) => {
                                    event.stopPropagation()
                                    handleHighlightHoverEnd(entry.id, highlight.id)
                                  }}
                                  onClick={(event) => handleHighlightClick(entry.id, highlight.id, event)}
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                      handleHighlightClick(entry.id, highlight.id, event)
                                    }
                                  }}
                                  aria-label={t(`entries.${entry.id}.highlights.${highlight.id}`)}
                                  title={t(`entries.${entry.id}.highlights.${highlight.id}`)}
                                />
                              )
                            })}
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {verticalFocusedEntry && (
              <motion.div
                layout
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="min-w-0"
              >
                {renderDetailCard('mt-0')}
              </motion.div>
            )}
          </motion.div>

          {!verticalFocusedEntry && renderDetailCard()}
        </div>

        {/* Main Timeline Visualization */}
        <div className="relative w-full max-md:hidden max-lg:portrait:hidden">
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
                <div className="relative mb-4 h-9 px-6 sm:px-8">
                  <div className="absolute inset-x-6 top-0 h-full sm:inset-x-8">
                    {years.map((year) => {
                      const state = yearStates.get(year)

                      return (
                        <button
                          key={year}
                          type="button"
                          disabled={!state?.isClickable}
                          onClick={() => handleYearClick(year)}
                          className={cn(
                            'group absolute -translate-x-1/2 rounded-lg px-2 py-1.5 transition-all duration-200',
                            state?.isClickable
                              ? 'cursor-pointer hover:bg-[var(--accent)]/10 hover:scale-105'
                              : 'cursor-default',
                            state?.isCurrent
                              ? 'text-[var(--accent)] font-semibold'
                              : state?.isPreview
                                ? 'text-[var(--fg-muted)]/30'
                                : state?.isFuture
                                  ? 'text-[var(--fg-muted)]/55 hover:text-[var(--accent)]/80'
                                  : 'text-[var(--fg-muted)]/70 hover:text-[var(--accent)]'
                          )}
                          style={{ left: `${dateToTimelinePercent({ year, month: 1, day: 1 }, timelineEndYear)}%` }}
                          title={state?.isClickable ? `Ver detalles de ${year}` : `${year}`}
                          aria-disabled={!state?.isClickable}
                        >
                          <span className="text-xs sm:text-sm font-mono">{year}</span>
                          <span
                            className={cn(
                              'absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-[var(--accent)] transition-all duration-200',
                              state?.isClickable ? 'w-0 group-hover:w-3/4' : 'w-1 opacity-25'
                            )}
                          />
                        </button>
                      )
                    })}
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
                        style={{ left: `${dateToTimelinePercent({ year, month: 1, day: 1 }, timelineEndYear)}%` }}
                      />
                    ))}
                  </div>

                  <div className="absolute inset-y-0 left-6 right-6 z-10 pointer-events-none sm:left-8 sm:right-8">
                    <div
                      className="group absolute bottom-0 top-0 w-px bg-[var(--accent)]/45"
                      style={{ left: `${dateToTimelinePercent(today, timelineEndYear)}%` }}
                      title={`${t('today')}: ${todayLabel}`}
                      aria-hidden="true"
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--accent)]/40 bg-[var(--bg)]/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                        {todayLabel}
                      </span>
                    </div>
                  </div>

                  {/* Lanes */}
                  <div className="relative py-6 sm:py-8">
                    {/* Start label on the left */}
                    <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 flex items-center justify-center pointer-events-none">
                      <div className="text-xs font-mono text-[var(--fg-muted)]/40 rotate-180" style={{ writingMode: 'vertical-lr' }}>
                        {startLabel}
                      </div>
                    </div>
                    {LANE_ORDER.filter(lane => lane !== 'achievement' && visibleLanes.has(lane)).map((lane, laneIndex) => {
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
                              const isPointEvent = isPointEntry(entry)
                              const isFutureLearning = isFutureLearningEntry(entry, today)
                              const glowIntensity = getIntensity(entry.id)

                              // Dynamic glow style
                              const glowStyle = !isFutureLearning && glowIntensity > 0 ? {
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
                                      isFutureLearning
                                        ? 'border border-dashed border-pink-200/45 bg-pink-400/25 ring-4 ring-pink-400/10 opacity-65 hover:opacity-100'
                                        : [colors.bg, 'ring-2 ring-[var(--bg)]'],
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
                                    onPointerEnter={() => handleEntryHoverStart(entry.id)}
                                    onPointerMove={() => handleEntryHoverStart(entry.id)}
                                    onPointerLeave={() => handleEntryHoverEnd(entry.id)}
                                    onClick={(event) => handleEntryClick(entry.id, event)}
                                    title={`${t(`entries.${entry.id}.role`)} - ${formatPeriod(entry.startYear, entry.startMonth, entry.endYear, entry.endMonth, t('present'), locale)}`}
                                    aria-label={t(`entries.${entry.id}.role`)}
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
                                  onPointerEnter={() => handleEntryHoverStart(entry.id)}
                                  onPointerMove={() => handleEntryHoverStart(entry.id)}
                                  onPointerLeave={() => handleEntryHoverEnd(entry.id)}
                                  onClick={(event) => handleEntryClick(entry.id, event)}
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

                                  {renderEntryInlineHighlights(entry, startPercent, endPercent)}

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
                            const isActive = isHighlightActive(entry.id, highlight.id)

                            const haloStyle = glowIntensity > 0 ? {
                              boxShadow: `0 0 ${24 * glowIntensity}px ${haloColor}`,
                              filter: `brightness(${1 + 0.4 * glowIntensity})`,
                            } : {
                              boxShadow: `0 0 16px rgba(59, 130, 246, 0.3)`
                            }

                            return (
                              <motion.button
                                key={`highlight-${entry.id}-${highlight.id}`}
                                type="button"
                                className={cn(
                                  'absolute top-1/2 -translate-y-1/2 z-20 cursor-pointer',
                                  'h-7 w-7 rounded-full bg-amber-400 sm:h-8 sm:w-8',
                                  'ring-2 ring-[var(--bg)]',
                                  isActive && 'scale-125 ring-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.55)]',
                                  'transition-all duration-300 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200'
                                )}
                                style={{
                                  left: `calc(${percent}% - 12px)`,
                                  ...haloStyle,
                                }}
                                initial={animate ? { scale: 0 } : undefined}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 }}
                                onPointerEnter={() => handleHighlightHoverStart(entry.id, highlight.id)}
                                onPointerMove={() => handleHighlightHoverStart(entry.id, highlight.id)}
                                onPointerLeave={() => handleHighlightHoverEnd(entry.id, highlight.id)}
                                onClick={(event) => handleHighlightClick(entry.id, highlight.id, event)}
                                title={`${t(`entries.${entry.id}.highlights.${highlight.id}`)} (${t('legend.education')})`}
                                aria-label={t(`entries.${entry.id}.highlights.${highlight.id}`)}
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
                            const isActive = isHighlightActive(entry.id, highlight.id)

                            const haloStyle = glowIntensity > 0 ? {
                              boxShadow: `0 0 ${24 * glowIntensity}px ${haloColor}`,
                              filter: `brightness(${1 + 0.4 * glowIntensity})`,
                            } : {
                              boxShadow: `0 0 16px rgba(16, 185, 129, 0.3)`
                            }

                            return (
                              <motion.button
                                key={`highlight-${entry.id}-${highlight.id}`}
                                type="button"
                                className={cn(
                                  'absolute top-1/2 -translate-y-1/2 z-20 cursor-pointer',
                                  'h-7 w-7 rounded-full bg-amber-400 sm:h-8 sm:w-8',
                                  'ring-2 ring-[var(--bg)]',
                                  isActive && 'scale-125 ring-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.55)]',
                                  'transition-all duration-300 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200'
                                )}
                                style={{
                                  left: `calc(${percent}% - 12px)`,
                                  ...haloStyle,
                                }}
                                initial={animate ? { scale: 0 } : undefined}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 }}
                                onPointerEnter={() => handleHighlightHoverStart(entry.id, highlight.id)}
                                onPointerMove={() => handleHighlightHoverStart(entry.id, highlight.id)}
                                onPointerLeave={() => handleHighlightHoverEnd(entry.id, highlight.id)}
                                onClick={(event) => handleHighlightClick(entry.id, highlight.id, event)}
                                title={`${t(`entries.${entry.id}.highlights.${highlight.id}`)} (${t('legend.work')})`}
                                aria-label={t(`entries.${entry.id}.highlights.${highlight.id}`)}
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
                          const haloColor = LANE_COLORS.achievement.hex

                          const haloStyle = glowIntensity > 0 ? {
                            boxShadow: `0 0 ${24 * glowIntensity}px ${haloColor}`,
                            filter: `brightness(${1 + 0.4 * glowIntensity})`,
                          } : {
                            boxShadow: `0 0 16px rgba(245, 158, 11, 0.3)`
                          }

                          return (
                            <motion.button
                              key={entry.id}
                              type="button"
                              className={cn(
                                'absolute top-1/2 -translate-y-1/2 z-20 cursor-pointer',
                                'h-7 w-7 rounded-full bg-amber-400 sm:h-8 sm:w-8',
                                'ring-2 ring-[var(--bg)]',
                                (hoveredEntry === entry.id || selectedEntry === entry.id) && 'scale-125',
                                'transition-all duration-300 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200'
                              )}
                              style={{
                                left: `calc(${percent}% - 12px)`,
                                ...haloStyle,
                              }}
                              initial={animate ? { scale: 0 } : undefined}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.6 }}
                              onPointerEnter={() => handleEntryHoverStart(entry.id)}
                              onPointerMove={() => handleEntryHoverStart(entry.id)}
                              onPointerLeave={() => handleEntryHoverEnd(entry.id)}
                              onClick={(event) => handleEntryClick(entry.id, event)}
                              title={t(`entries.${entry.id}.role`)}
                              aria-label={t(`entries.${entry.id}.role`)}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hint to click years */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  <span className="h-px w-6 bg-[var(--border)]" aria-hidden="true" />
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
                    <span aria-hidden="true">&larr;</span>
                    <span>{backLabel}</span>
                  </button>
                  <h3 className="text-2xl font-bold text-[var(--accent)]">
                    {drillDownYear}
                  </h3>
                  <div className="w-24" /> {/* Spacer for balance */}
                </div>

                {/* Month axis */}
                <div className="relative mb-3 h-5">
                  <div className="absolute inset-x-0 inset-y-0">
                      {monthNames.map((month, index) => (
                        <span
                          key={month}
                          className="absolute -translate-x-1/2 text-[0.6rem] sm:text-xs font-mono text-[var(--fg-muted)]/60"
                          style={{ left: `${dateToYearPercent({ year: drillDownYear, month: index + 1, day: 1 })}%` }}
                        >
                          {month}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Monthly timeline container */}
                <div className="relative bg-[var(--card)]/20 rounded-2xl ring-1 ring-[var(--border)]/20 overflow-visible backdrop-blur-sm">
                  {/* Vertical month grid lines with current month indicator */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-x-0 inset-y-0">
                      {monthNames.map((_, i) => {
                        return (
                          <div
                            key={i}
                            className="absolute top-0 bottom-0 w-px bg-[var(--border)]/10"
                            style={{ left: `${dateToYearPercent({ year: drillDownYear, month: i + 1, day: 1 })}%` }}
                          />
                        )
                      })}
                      {drillDownYear === today.year && (
                        <div
                          className="group absolute top-0 bottom-0 z-10 w-4 -translate-x-1/2 cursor-help pointer-events-auto"
                          style={{ left: `${dateToYearPercent(today)}%` }}
                          title={`${t('today')}: ${todayLabel}`}
                          aria-label={`${t('today')}: ${todayLabel}`}
                        >
                          <span className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-[var(--accent)]/55" />
                          <span className="pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--accent)]/40 bg-[var(--bg)]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)] opacity-0 shadow-lg shadow-black/20 transition-opacity duration-150 group-hover:opacity-100">
                            {todayLabel}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lanes for drill-down year */}
                  <div className="relative py-6 sm:py-8">
                    {/* Start label */}
                    <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 flex items-center justify-center pointer-events-none">
                      <div className="text-xs font-mono text-[var(--fg-muted)]/40 rotate-180" style={{ writingMode: 'vertical-lr' }}>
                        {startLabel}
                      </div>
                    </div>

                    {LANE_ORDER.filter(lane => lane !== 'achievement' && visibleLanes.has(lane)).map((lane) => {
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
                              const isPointEvent = isPointEntry(entry)
                              const isFutureLearning = isFutureLearningEntry(entry, today)

                              if (isPointEvent) {
                                const glowIntensity = getIntensity(entry.id)
                                const glowStyle = !isFutureLearning && glowIntensity > 0 ? {
                                  boxShadow: `0 0 ${16 * glowIntensity}px ${colors.hex}`,
                                  filter: `brightness(${1 + 0.25 * glowIntensity})`,
                                } : {}

                                return (
                                  <motion.div
                                    key={entry.id}
                                    className={cn(
                                      'absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer',
                                      'w-5 h-5 sm:w-6 sm:h-6 rounded-full',
                                      isFutureLearning
                                        ? 'border border-dashed border-pink-200/45 bg-pink-400/25 ring-4 ring-pink-400/10 opacity-65 hover:opacity-100'
                                        : [colors.bg, 'ring-2 ring-[var(--bg)]'],
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
                                    onPointerEnter={() => handleEntryHoverStart(entry.id)}
                                    onPointerMove={() => handleEntryHoverStart(entry.id)}
                                    onPointerLeave={() => handleEntryHoverEnd(entry.id)}
                                    onClick={(event) => handleEntryClick(entry.id, event)}
                                    title={`${t(`entries.${entry.id}.role`)} - ${formatPeriod(entry.startYear, entry.startMonth, entry.endYear, entry.endMonth, t('present'), locale)}`}
                                    aria-label={t(`entries.${entry.id}.role`)}
                                  />
                                )
                              }

                              const glowIntensity = getIntensity(entry.id)
                              const glowStyle = glowIntensity > 0 ? {
                                boxShadow: `0 0 ${16 * glowIntensity}px ${colors.hex}, inset 0 0 8px ${colors.hex}${Math.floor(0.3 * glowIntensity * 255).toString(16).padStart(2, '0')}`,
                                filter: `brightness(${1 + 0.2 * glowIntensity})`,
                              } : {}

                              const isRecent = entry.endYear === null || (
                                entry.endYear === today.year &&
                                Boolean(entry.endMonth && entry.endMonth >= today.month - 2)
                              )

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
                                  onPointerEnter={() => handleEntryHoverStart(entry.id)}
                                  onPointerMove={() => handleEntryHoverStart(entry.id)}
                                  onPointerLeave={() => handleEntryHoverEnd(entry.id)}
                                  onClick={(event) => handleEntryClick(entry.id, event)}
                                  title={`${t(`entries.${entry.id}.role`)} - ${formatPeriod(entry.startYear, entry.startMonth, entry.endYear, entry.endMonth, t('present'), locale)}`}
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

                                  {renderEntryInlineHighlights(entry, startPercent, endPercent, drillDownYear)}

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
                            const isActive = isHighlightActive(entry.id, highlight.id)

                            const haloStyle = glowIntensity > 0 ? {
                              boxShadow: `0 0 ${20 * glowIntensity}px ${haloColor}`,
                              filter: `brightness(${1 + 0.4 * glowIntensity})`,
                            } : {
                              boxShadow: `0 0 14px rgba(59, 130, 246, 0.3)`
                            }

                            return (
                              <motion.button
                                key={`highlight-${entry.id}-${highlight.id}`}
                                type="button"
                                className={cn(
                                  'absolute top-1/2 -translate-y-1/2 z-20 cursor-pointer',
                                  'h-7 w-7 rounded-full bg-amber-400 sm:h-8 sm:w-8',
                                  'ring-2 ring-[var(--bg)]',
                                  isActive && 'scale-125 ring-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.55)]',
                                  'transition-all duration-300 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200'
                                )}
                                style={{
                                  left: `calc(${percent}% - 12px)`,
                                  ...haloStyle,
                                }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.4 }}
                                onPointerEnter={() => handleHighlightHoverStart(entry.id, highlight.id)}
                                onPointerMove={() => handleHighlightHoverStart(entry.id, highlight.id)}
                                onPointerLeave={() => handleHighlightHoverEnd(entry.id, highlight.id)}
                                onClick={(event) => handleHighlightClick(entry.id, highlight.id, event)}
                                title={`${t(`entries.${entry.id}.highlights.${highlight.id}`)} (${monthNames[highlight.month ? highlight.month - 1 : 5]} ${highlight.day || 15}) - ${t('legend.education')}`}
                                aria-label={t(`entries.${entry.id}.highlights.${highlight.id}`)}
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
                            const isActive = isHighlightActive(entry.id, highlight.id)

                            const haloStyle = glowIntensity > 0 ? {
                              boxShadow: `0 0 ${20 * glowIntensity}px ${haloColor}`,
                              filter: `brightness(${1 + 0.4 * glowIntensity})`,
                            } : {
                              boxShadow: `0 0 14px rgba(16, 185, 129, 0.3)`
                            }

                            return (
                              <motion.button
                                key={`highlight-${entry.id}-${highlight.id}`}
                                type="button"
                                className={cn(
                                  'absolute top-1/2 -translate-y-1/2 z-20 cursor-pointer',
                                  'h-7 w-7 rounded-full bg-amber-400 sm:h-8 sm:w-8',
                                  'ring-2 ring-[var(--bg)]',
                                  isActive && 'scale-125 ring-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.55)]',
                                  'transition-all duration-300 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200'
                                )}
                                style={{
                                  left: `calc(${percent}% - 12px)`,
                                  ...haloStyle,
                                }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.4 }}
                                onPointerEnter={() => handleHighlightHoverStart(entry.id, highlight.id)}
                                onPointerMove={() => handleHighlightHoverStart(entry.id, highlight.id)}
                                onPointerLeave={() => handleHighlightHoverEnd(entry.id, highlight.id)}
                                onClick={(event) => handleHighlightClick(entry.id, highlight.id, event)}
                                title={`${t(`entries.${entry.id}.highlights.${highlight.id}`)} (${monthNames[highlight.month ? highlight.month - 1 : 5]} ${highlight.day || 15}) - ${t('legend.work')}`}
                                aria-label={t(`entries.${entry.id}.highlights.${highlight.id}`)}
                              />
                            )
                          })
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {renderDetailCard()}
        </div>
      </div>
    </SectionShell>
  )
}
