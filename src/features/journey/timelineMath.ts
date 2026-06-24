import type { JourneyEntry, JourneyHighlight } from './types'

export type JourneyDate = { year: number; month: number; day: number }

export type TimelineYearState = {
  year: number
  hasContent: boolean
  isCurrent: boolean
  isFuture: boolean
  isPreview: boolean
  isClickable: boolean
}

const DAY_MS = 86_400_000

export function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value))
}

export function toLocalDate({ year, month, day }: JourneyDate): Date {
  return new Date(year, month - 1, day)
}

export function toJourneyDate(date: Date): JourneyDate {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }
}

export function parseJourneyDate(value: string | undefined): JourneyDate | null {
  if (!value) return null

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }
}

export function getDaysInYear(year: number): number {
  return Math.round((new Date(year + 1, 0, 1).getTime() - new Date(year, 0, 1).getTime()) / DAY_MS)
}

export function dateToYearPercent(date: JourneyDate): number {
  const yearStart = new Date(date.year, 0, 1)
  const currentDate = toLocalDate(date)
  const elapsedDays = Math.round((currentDate.getTime() - yearStart.getTime()) / DAY_MS)
  const yearSpan = getDaysInYear(date.year) - 1

  return clampPercent((elapsedDays / yearSpan) * 100)
}

export function dateToTimelinePercent(
  date: JourneyDate,
  timelineStartYear: number,
  timelineEndYear: number,
): number {
  const startDate = toLocalDate({ year: timelineStartYear, month: 1, day: 1 })
  const endDate = toLocalDate({ year: timelineEndYear, month: 12, day: 31 })
  const currentDate = toLocalDate(date)
  const range = endDate.getTime() - startDate.getTime()

  return range === 0 ? 0 : clampPercent(((currentDate.getTime() - startDate.getTime()) / range) * 100)
}

export function getEntryStartDate(entry: JourneyEntry): JourneyDate {
  return {
    year: entry.startYear,
    month: entry.startMonth ?? 1,
    day: entry.startDay ?? 1,
  }
}

export function getEntryEndDate(entry: JourneyEntry, today: JourneyDate): JourneyDate {
  if (entry.endYear === null) {
    return today
  }

  return {
    year: entry.endYear,
    month: entry.endMonth ?? 12,
    day: entry.endDay ?? 31,
  }
}

export function getHighlightDate(highlight: JourneyHighlight, today: JourneyDate): JourneyDate {
  if (highlight.id === 'v120Current') {
    return today
  }

  return {
    year: highlight.year,
    month: highlight.month ?? 1,
    day: highlight.day ?? 1,
  }
}

export function isPastHalfOfYear(today: JourneyDate): boolean {
  return dateToYearPercent(today) > 50
}

export function hasScheduledContentInYear(
  entries: JourneyEntry[],
  year: number,
  today: JourneyDate,
): boolean {
  const yearStart = new Date(year, 0, 1).getTime()
  const yearEnd = new Date(year, 11, 31).getTime()

  return entries.some((entry) => {
    const startTime = toLocalDate(getEntryStartDate(entry)).getTime()
    const endTime = toLocalDate(getEntryEndDate(entry, today)).getTime()

    if (startTime <= yearEnd && endTime >= yearStart) {
      return true
    }

    return entry.highlights?.some((highlight) => getHighlightDate(highlight, today).year === year) ?? false
  })
}

export function getLatestScheduledYear(
  entries: JourneyEntry[],
  today: JourneyDate,
  minimumEndYear: number,
): number {
  const explicitYears = entries.flatMap((entry) => [
    entry.startYear,
    entry.endYear ?? today.year,
    ...(entry.highlights?.map((highlight) => getHighlightDate(highlight, today).year) ?? []),
  ])

  return Math.max(minimumEndYear, today.year, ...explicitYears)
}

export function getVisibleTimelineYears(
  entries: JourneyEntry[],
  today: JourneyDate,
  timelineStartYear: number,
  minimumEndYear: number,
): number[] {
  const scheduledEndYear = getLatestScheduledYear(entries, today, minimumEndYear)
  const previewEndYear = isPastHalfOfYear(today) ? today.year + 1 : today.year
  const timelineEndYear = Math.max(scheduledEndYear, previewEndYear)
  const years: number[] = []

  for (let year = timelineStartYear; year <= timelineEndYear; year += 1) {
    years.push(year)
  }

  return years
}

export function getYearState(
  year: number,
  entries: JourneyEntry[],
  today: JourneyDate,
): TimelineYearState {
  const hasContent = hasScheduledContentInYear(entries, year, today)
  const isFuture = year > today.year
  const isPreview = isFuture && !hasContent

  return {
    year,
    hasContent,
    isCurrent: year === today.year,
    isFuture,
    isPreview,
    isClickable: !isPreview && (year <= today.year || hasContent),
  }
}
