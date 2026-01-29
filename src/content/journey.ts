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
    endYear: 2026,
    highlights: [
      { id: 'ast', labelKey: 'journey.entries.urjc.highlights.ast', year: 2024 },
      { id: 'lsmu', labelKey: 'journey.entries.urjc.highlights.lsmu', year: 2025 },
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
    endYear: 2025,
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
    endYear: null, // Ongoing
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
    startYear: 2024,
    endYear: 2025,
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
    endYear: 2025,
    link: 'https://vissoft.info',
  },
]

/** Timeline boundaries */
export const TIMELINE_START = 2020
export const TIMELINE_END = 2026

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
