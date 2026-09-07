// Main section component
export { ParallelStreamsSection } from './ParallelStreamsSection'

// Reusable sub-components
export { StreamCard } from './StreamCard'
export { StreamLegend } from './StreamLegend'
export { VerticalTimeline } from './VerticalTimeline'

// Hooks
export { useGlowAnimation } from './useGlowAnimation'

// Layout helpers
export { MARKER_MIN_GAP_PX, MARKER_ROW_CLASSES, staggerMarkers } from './staggerMarkers'

// Types
export type {
  ActiveHighlightRef,
  JourneyEntry,
  JourneyHighlight,
  JourneyLane,
  JourneyEntryType,
  LaneConfig,
  YearMarker,
} from './types'
export type { MarkerRow } from './staggerMarkers'
