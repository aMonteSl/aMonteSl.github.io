'use client'

import type { KeyboardEvent, PointerEvent, ReactNode } from 'react'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

import { LANE_COLORS, LANE_ORDER } from './timelineConfig'
import {
  clampPercent,
  getEntryEndDate,
  getEntryStartDate,
  getHighlightDate,
  isFutureLearningEntry,
  isPointEntry,
  type JourneyDate,
  type TimelineYearState,
} from './timelineMath'
import type { ActiveHighlightRef, JourneyEntry, JourneyLane } from './types'

/**
 * Tap targets grow through a pseudo-element so the drawing stays small. Lanes are at
 * least ~49px apart (5 lanes at 320px), so 44px-wide targets never overlap sideways.
 */
/** 8px bar -> 44px wide (primary control) */
const HIT_AREA = "before:absolute before:content-[''] before:-inset-x-[18px] before:-inset-y-1"
/** 14px point event -> 44px (primary control) */
const HIT_AREA_POINT = "before:absolute before:content-[''] before:-inset-[15px]"
/** 12px highlight dot on a bar -> 40px (secondary control, stays inside the bar's target) */
const HIT_AREA_HIGHLIGHT = "before:absolute before:content-[''] before:-inset-3.5"

type StopPropagation = { stopPropagation: () => void }

export interface VerticalTimelineProps {
  years: number[]
  yearStates: Map<number, TimelineYearState>
  today: JourneyDate
  todayLabel: string
  visibleLanes: Set<JourneyLane>
  entriesByLane: Record<JourneyLane, JourneyEntry[]>
  hoveredEntry: string | null
  selectedEntry: string | null
  selectedHighlight: ActiveHighlightRef | null
  /** Vertical position (percent from the top) of a date on the map */
  getVerticalTop: (date: JourneyDate) => number
  isHighlightActive: (entryId: string, highlightId: string) => boolean
  onEntryHoverStart: (entryId: string) => void
  onEntryHoverEnd: (entryId: string) => void
  onEntryClick: (entryId: string, event?: StopPropagation) => void
  onHighlightHoverStart: (entryId: string, highlightId: string) => void
  onHighlightHoverEnd: (entryId: string, highlightId: string) => void
  onHighlightClick: (entryId: string, highlightId: string, event?: StopPropagation) => void
  /** Detail card (or its placeholder), rendered by the parent */
  detailCard: ReactNode
  /** Pins the detail card to the bottom of the viewport while an entry is active */
  hasActiveEntry: boolean
}

/** Hover only follows a real mouse; touch pointers select on tap through onClick */
function isMousePointer(event: PointerEvent<HTMLElement>): boolean {
  return event.pointerType === 'mouse'
}

function isActivationKey(event: KeyboardEvent<HTMLElement>): boolean {
  return event.key === 'Enter' || event.key === ' '
}

/** Spread the visible lanes across the map without hugging the edges when few remain */
function getLaneLeft(index: number, count: number): number {
  if (count === 1) return 50
  if (count === 2) return 25 + index * 50
  return (index / (count - 1)) * 100
}

/**
 * VerticalTimeline
 * Lane map used below the `lg` breakpoint: years run top-to-bottom, lanes
 * left-to-right, and the detail card follows the map as an in-flow sheet.
 */
export function VerticalTimeline({
  years,
  yearStates,
  today,
  todayLabel,
  visibleLanes,
  entriesByLane,
  hoveredEntry,
  selectedEntry,
  selectedHighlight,
  getVerticalTop,
  isHighlightActive,
  onEntryHoverStart,
  onEntryHoverEnd,
  onEntryClick,
  onHighlightHoverStart,
  onHighlightHoverEnd,
  onHighlightClick,
  detailCard,
  hasActiveEntry,
}: VerticalTimelineProps) {
  const t = useTranslations('journey')
  const lanes = LANE_ORDER.filter((lane) => visibleLanes.has(lane))
  // ~6rem per year plus the rail padding, bounded so the map never outgrows the viewport
  const mapHeight = `clamp(32rem, ${years.length * 6 + 5}rem, 86svh)`

  return (
    <div className="relative hidden w-full max-lg:block">
      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[var(--border)]/20 bg-[var(--card)]/15 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
          {t('today')}
        </span>
        <span className="rounded-full border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
          {todayLabel}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)]/20 bg-[var(--card)]/15 p-4">
        <div className="relative w-full" style={{ height: mapHeight }}>
          {/* Year rail: labels only, the per-year drill-down lives in the horizontal layout */}
          <div className="absolute inset-y-10 left-0 w-11">
            {years.map((year) => {
              const state = yearStates.get(year)

              return (
                <span
                  key={year}
                  className={cn(
                    'absolute right-1 -translate-y-1/2 rounded-full px-2 py-1 font-mono text-[0.62rem] font-semibold',
                    state?.isCurrent
                      ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                      : state?.isPreview
                        ? 'text-[var(--fg-muted)]/35'
                        : 'text-[var(--fg-muted)]/65'
                  )}
                  style={{ top: `${getVerticalTop({ year, month: 1, day: 1 })}%` }}
                >
                  {year}
                </span>
              )
            })}
          </div>

          {/* Lanes (12px right gutter keeps the last lane inside the card) */}
          <div className="absolute inset-y-10 left-12 right-3">
            <div className="absolute inset-x-0 top-0 h-px bg-[var(--border)]/12" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--border)]/12" />
            <div
              className="pointer-events-none absolute inset-x-0 h-px -translate-y-1/2 bg-[var(--accent)]/55"
              style={{ top: `${getVerticalTop(today)}%` }}
              aria-hidden="true"
            />

            {lanes.map((lane, laneIndex) => {
              const colors = LANE_COLORS[lane]

              return (
                <div
                  key={lane}
                  role="group"
                  aria-label={t(`legend.${lane}`)}
                  className="absolute inset-y-0"
                  style={{ left: `${getLaneLeft(laneIndex, lanes.length)}%` }}
                >
                  <div className="absolute inset-y-0 w-px -translate-x-1/2 bg-[var(--border)]/18" aria-hidden="true" />
                  <span
                    className={cn(
                      'absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[var(--bg)]',
                      colors.bg
                    )}
                    aria-hidden="true"
                  />

                  {entriesByLane[lane].map((entry) => {
                    const isActive =
                      hoveredEntry === entry.id ||
                      selectedEntry === entry.id ||
                      selectedHighlight?.entryId === entry.id
                    const isPointEvent = isPointEntry(entry)
                    const startTop = getVerticalTop(getEntryStartDate(entry))
                    const endTop = getVerticalTop(getEntryEndDate(entry, today))
                    const top = isPointEvent ? startTop : Math.min(startTop, endTop)
                    const height = Math.max(Math.abs(startTop - endTop), 2)
                    const isFutureLearning = isFutureLearningEntry(entry, today)
                    const label = t(`entries.${entry.id}.role`)

                    if (isPointEvent) {
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          className={cn(
                            'absolute z-20 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[var(--bg)] transition-all duration-200 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                            HIT_AREA_POINT,
                            isFutureLearning
                              ? 'border border-dashed border-pink-200/45 bg-pink-400/30 opacity-70'
                              : colors.bg,
                            isActive && 'scale-125 shadow-[0_0_18px_rgba(238,174,148,0.45)]'
                          )}
                          style={{ top: `${top}%` }}
                          onPointerEnter={(event) => {
                            if (isMousePointer(event)) onEntryHoverStart(entry.id)
                          }}
                          onPointerMove={(event) => {
                            if (isMousePointer(event)) onEntryHoverStart(entry.id)
                          }}
                          onPointerLeave={() => onEntryHoverEnd(entry.id)}
                          onClick={(event) => onEntryClick(entry.id, event)}
                          aria-label={label}
                          title={label}
                        />
                      )
                    }

                    return (
                      <div
                        key={entry.id}
                        role="button"
                        tabIndex={0}
                        className={cn(
                          'absolute z-10 w-2 -translate-x-1/2 cursor-pointer rounded-full transition-all duration-200 hover:w-3 active:w-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                          HIT_AREA,
                          colors.bg,
                          isActive && 'w-3 shadow-[0_0_18px_rgba(238,174,148,0.45)]'
                        )}
                        style={{ top: `${top}%`, height: `${height}%` }}
                        onPointerEnter={(event) => {
                          if (isMousePointer(event)) onEntryHoverStart(entry.id)
                        }}
                        onPointerMove={(event) => {
                          if (isMousePointer(event)) onEntryHoverStart(entry.id)
                        }}
                        onPointerLeave={() => onEntryHoverEnd(entry.id)}
                        onClick={(event) => onEntryClick(entry.id, event)}
                        onKeyDown={(event) => {
                          if (isActivationKey(event)) {
                            event.preventDefault()
                            onEntryClick(entry.id, event)
                          }
                        }}
                        aria-label={label}
                        title={label}
                      >
                        <span
                          className={cn(
                            'absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[var(--bg)]',
                            colors.bg,
                            entry.endYear === null && 'ring-white/60'
                          )}
                        />
                        <span
                          className={cn(
                            'absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full ring-2 ring-[var(--bg)]',
                            colors.bg
                          )}
                        />

                        {entry.highlights?.map((highlight) => {
                          const highlightTop = getVerticalTop(getHighlightDate(highlight))
                          const localTop = clampPercent(((highlightTop - top) / height) * 100)
                          const isSelected = isHighlightActive(entry.id, highlight.id)
                          const highlightLabel = t(`entries.${entry.id}.highlights.${highlight.id}`)

                          return (
                            <span
                              key={highlight.id}
                              role="button"
                              tabIndex={0}
                              className={cn(
                                'absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-100/70 bg-violet-300 shadow-[0_0_0_2px_rgba(139,92,246,0.2)] transition-all hover:scale-125',
                                HIT_AREA_HIGHLIGHT,
                                isSelected && 'scale-125 bg-violet-100 shadow-[0_0_0_5px_rgba(139,92,246,0.32),0_0_18px_rgba(139,92,246,0.55)]'
                              )}
                              style={{ top: `${localTop}%` }}
                              onPointerEnter={(event) => {
                                event.stopPropagation()
                                if (isMousePointer(event)) onHighlightHoverStart(entry.id, highlight.id)
                              }}
                              onPointerMove={(event) => {
                                event.stopPropagation()
                                if (isMousePointer(event)) onHighlightHoverStart(entry.id, highlight.id)
                              }}
                              onPointerLeave={(event) => {
                                event.stopPropagation()
                                onHighlightHoverEnd(entry.id, highlight.id)
                              }}
                              onClick={(event) => onHighlightClick(entry.id, highlight.id, event)}
                              onKeyDown={(event) => {
                                if (isActivationKey(event)) {
                                  event.preventDefault()
                                  event.stopPropagation()
                                  onHighlightClick(entry.id, highlight.id, event)
                                }
                              }}
                              aria-label={highlightLabel}
                              title={highlightLabel}
                            />
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Detail sheet: in flow after the map, pinned to the viewport bottom while something is selected */}
      <div className={cn('mt-4', hasActiveEntry && 'sticky bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[45]')}>
        {detailCard}
      </div>
    </div>
  )
}
