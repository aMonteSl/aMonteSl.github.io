import { JourneyEntry, LaneConfig } from '@/features/journey/types'

/**
 * Lane configuration - defines colors for each track
 * Using CSS variables for theming consistency
 */
export const LANE_CONFIG: LaneConfig[] = [
  {
    lane: 'education',
    colorVar: '--stream-education',
    labelKey: 'journey.legend.education',
  },
  {
    lane: 'work',
    colorVar: '--stream-work',
    labelKey: 'journey.legend.work',
  },
  {
    lane: 'project',
    colorVar: '--stream-project',
    labelKey: 'journey.legend.project',
  },
  {
    lane: 'achievement',
    colorVar: '--stream-achievement',
    labelKey: 'journey.legend.achievement',
  },
  {
    lane: 'learning',
    colorVar: '--stream-learning',
    labelKey: 'journey.legend.learning',
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
  {
    id: 'satecCloud',
    type: 'work',
    lane: 'work',
    roleKey: 'journey.entries.satecCloud.role',
    orgKey: 'journey.entries.satecCloud.org',
    descKey: 'journey.entries.satecCloud.desc',
    startYear: 2026,
    startMonth: 3,
    startDay: 14,
    endYear: null,
    tags: ['Cloud', 'Systems', 'N2 Support', 'Infrastructure'],
    link: 'https://www.satec.es',
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
    endYear: null,
    highlights: [
      { id: 'v008Poster', labelKey: 'journey.entries.codexr.highlights.v008Poster', year: 2025, month: 9, day: 7 },
      { id: 'v100Defense', labelKey: 'journey.entries.codexr.highlights.v100Defense', year: 2025, month: 10, day: 20 },
      { id: 'v110Release', labelKey: 'journey.entries.codexr.highlights.v110Release', year: 2026, month: 3, day: 22 },
      { id: 'v120Release', labelKey: 'journey.entries.codexr.highlights.v120Release', year: 2026, month: 7, day: 30 },
    ],
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

  // === LEARNING GOALS (Lane 5 - Future objectives) ===
  {
    id: 'cambridgeC1',
    type: 'learning',
    lane: 'learning',
    roleKey: 'journey.entries.cambridgeC1.role',
    orgKey: 'journey.entries.cambridgeC1.org',
    descKey: 'journey.entries.cambridgeC1.desc',
    startYear: 2026,
    startMonth: 3,
    startDay: 1,
    endYear: null,
    tags: ['English', 'Certification', 'Professional Development'],
  },
  {
    id: 'masterTelecomUPM',
    type: 'learning',
    lane: 'learning',
    roleKey: 'journey.entries.masterTelecomUPM.role',
    orgKey: 'journey.entries.masterTelecomUPM.org',
    descKey: 'journey.entries.masterTelecomUPM.desc',
    startYear: 2026,
    startMonth: 9,
    startDay: 1,
    endYear: 2026,
    endMonth: 9,
    endDay: 1,
    tags: ['Telecommunications', 'Networks', 'Cloud', 'Systems'],
  },
]

/** Timeline boundaries */
export const TIMELINE_START = 2020
export const TIMELINE_END = 2026
export const CURRENT_DATE = {
  year: 2026,
  month: 8,
  day: 29,
} as const

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
