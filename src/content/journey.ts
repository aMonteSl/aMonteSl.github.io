import { JourneyEntry, LaneConfig } from '@/features/journey/types'

/**
 * Lane configuration - defines colors and icons for each track
 * Using CSS variables for theming consistency
 */
export const LANE_CONFIG: LaneConfig[] = [
  {
    lane: 'education',
    colorVar: '--stream-education',
    labelKey: 'journey.legend.education',
    icon: '🎓',
  },
  {
    lane: 'work',
    colorVar: '--stream-work',
    labelKey: 'journey.legend.work',
    icon: '💼',
  },
  {
    lane: 'project',
    colorVar: '--stream-project',
    labelKey: 'journey.legend.project',
    icon: '🚀',
  },
  {
    lane: 'achievement',
    colorVar: '--stream-achievement',
    labelKey: 'journey.legend.achievement',
    icon: '🏆',
  },
]

/**
 * Journey entries - based on CV
 * Ordered by start year for rendering
 */
export const JOURNEY_ENTRIES: JourneyEntry[] = [
  // === EDUCATION (Lane 1) ===
  {
    id: 'urjc',
    type: 'education',
    lane: 'education',
    roleKey: 'journey.entries.urjc.role',
    orgKey: 'journey.entries.urjc.org',
    descKey: 'journey.entries.urjc.desc',
    startYear: 2020,
    startMonth: 9,
    startDay: 1,
    endYear: 2026,
    endMonth: 1,
    endDay: 15,
    highlights: [
      { id: 'ast', labelKey: 'journey.entries.urjc.highlights.ast', year: 2024, month: 5, day: 10 },
      { id: 'lsmu', labelKey: 'journey.entries.urjc.highlights.lsmu', year: 2025, month: 5, day: 10 },
    ],
    tags: ['Software Engineering', 'Networks', 'XR'],
  },

  // === WORK (Lane 2) ===
  {
    id: 'adyra',
    type: 'work',
    lane: 'work',
    roleKey: 'journey.entries.adyra.role',
    orgKey: 'journey.entries.adyra.org',
    descKey: 'journey.entries.adyra.desc',
    startYear: 2020,
    startMonth: 9,
    startDay: 1,
    endYear: 2025,
    endMonth: 11,
    endDay: 2,
    tags: ['Automation', 'Scripts', 'IT Support'],
  },
  {
    id: 'vbgroup',
    type: 'work',
    lane: 'work',
    roleKey: 'journey.entries.vbgroup.role',
    orgKey: 'journey.entries.vbgroup.org',
    descKey: 'journey.entries.vbgroup.desc',
    startYear: 2025,
    startMonth: 11,
    startDay: 3,
    endYear: 2026,
    endMonth: 1,
    endDay: 15,
    highlights: [
      { id: 'fullstack', labelKey: 'journey.entries.vbgroup.highlights.fullstack', year: 2025, month: 12, day: 1 },
    ],
    tags: ['TypeScript', 'React', 'Azure', 'Express'],
    link: 'https://vbgroup.es',
  },

  // === PROJECT (Lane 3) ===
  {
    id: 'codexr',
    type: 'project',
    lane: 'project',
    roleKey: 'journey.entries.codexr.role',
    orgKey: 'journey.entries.codexr.org',
    descKey: 'journey.entries.codexr.desc',
    startYear: 2025,
    startMonth: 1,
    startDay: 14,
    endYear: 2025,
    endMonth: 10,
    endDay: 20,
    tags: ['VS Code API', 'A-Frame', 'XR', 'TypeScript'],
    link: 'https://github.com/aMonteSl/CodeXR',
  },

  // === ACHIEVEMENTS (Lane 4 - Discrete events) ===
  {
    id: 'vissoft',
    type: 'achievement',
    lane: 'achievement',
    roleKey: 'journey.entries.vissoft.role',
    orgKey: 'journey.entries.vissoft.org',
    descKey: 'journey.entries.vissoft.desc',
    startYear: 2025,
    startMonth: 9,
    startDay: 7,
    endYear: 2025,
    endMonth: 9,
    endDay: 7,
    link: 'https://vissoft.info',
  },
]

/** Timeline boundaries */
export const TIMELINE_START = 2020
export const TIMELINE_END = 2026

/** Convert a date to a decimal year (for precise positioning) */
export function dateToDecimalYear(year: number, month?: number, day?: number): number {
  const m = month ?? 1
  const d = day ?? 1
  // Approximate: each month is ~1/12 of a year, each day ~1/365
  const monthFraction = (m - 1) / 12
  const dayFraction = (d - 1) / 365
  return year + monthFraction + dayFraction
}

/** Convert a decimal year to percentage position on timeline */
export function decimalYearToPercent(decimalYear: number): number {
  const range = TIMELINE_END - TIMELINE_START
  return ((decimalYear - TIMELINE_START) / range) * 100
}

/** Get all years for the timeline axis */
export function getTimelineYears(): number[] {
  const years: number[] = []
  for (let y = TIMELINE_START; y <= TIMELINE_END; y++) {
    years.push(y)
  }
  return years
}

/** Get entries for a specific lane */
export function getEntriesByLane(lane: JourneyEntry['lane']): JourneyEntry[] {
  return JOURNEY_ENTRIES.filter((e) => e.lane === lane)
}
