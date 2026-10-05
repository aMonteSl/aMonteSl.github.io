'use client'

import { useEffect, useState } from 'react'
import { BUILD_DATE, JOURNEY_ENTRIES } from '@/content/journey'
import { isUpcomingEntry, parseJourneyDate, toJourneyDate, type JourneyDate } from './timelineMath'

declare global {
  interface Window {
    __JOURNEY_TODAY__?: string
  }
}

/**
 * The date the journey is drawn for.
 *
 * Starts at the build date so the prerendered markup hydrates identically, then
 * switches to `window.__JOURNEY_TODAY__`, the `?journeyToday=YYYY-MM-DD` query
 * parameter, or the visitor's real date.
 */
export function useJourneyToday(): JourneyDate {
  const [today, setToday] = useState<JourneyDate>(BUILD_DATE)

  useEffect(() => {
    const queryToday = new URLSearchParams(window.location.search).get('journeyToday') ?? undefined
    setToday(parseJourneyDate(window.__JOURNEY_TODAY__) ?? parseJourneyDate(queryToday) ?? toJourneyDate(new Date()))
  }, [])

  return today
}

export type EntryPhase = 'upcoming' | 'current'

/** Whether a journey entry has started yet, so copy can switch on its start date */
export function useEntryPhase(entryId: string): EntryPhase {
  const today = useJourneyToday()
  const entry = JOURNEY_ENTRIES.find((item) => item.id === entryId)

  return entry && isUpcomingEntry(entry, today) ? 'upcoming' : 'current'
}
