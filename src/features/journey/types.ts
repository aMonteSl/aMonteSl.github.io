/**
 * Journey Feature Types
 * Defines the data structures for the Parallel Streams visualization
 */

/** Lane identifiers for parallel tracks */
export type JourneyLane = 'education' | 'work' | 'project' | 'achievement'

/** Entry types determine visual styling */
export type JourneyEntryType = 'education' | 'work' | 'project' | 'achievement'

/** A highlight is a sub-milestone within a main entry */
export interface JourneyHighlight {
  id: string
  labelKey: string // i18n key
  year: number
  month?: number // 1-12
  day?: number // 1-31
}

/** Main journey entry - represents a significant period or event */
export interface JourneyEntry {
  id: string
  type: JourneyEntryType
  lane: JourneyLane
  /** i18n key for role/title */
  roleKey: string
  /** i18n key for organization */
  orgKey: string
  /** i18n key for description */
  descKey: string
  /** Start year (for positioning) */
  startYear: number
  /** Start month (1-12, optional for monthly precision) */
  startMonth?: number
  /** Start day (1-31, optional for daily precision) */
  startDay?: number
  /** End year (null = ongoing) */
  endYear: number | null
  /** End month (1-12, optional for monthly precision) */
  endMonth?: number
  /** End day (1-31, optional for daily precision) */
  endDay?: number
  /** Nested highlights (e.g., honors within education) */
  highlights?: JourneyHighlight[]
  /** Optional link */
  link?: string
  /** Tech tags (optional) */
  tags?: string[]
}

/** Lane configuration for visual rendering */
export interface LaneConfig {
  lane: JourneyLane
  colorVar: string
  labelKey: string
  icon: string
}

/** Year marker for the timeline axis */
export interface YearMarker {
  year: number
  isStart?: boolean
  isEnd?: boolean
}
