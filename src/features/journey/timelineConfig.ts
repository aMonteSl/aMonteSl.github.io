import type { JourneyLane } from './types'

export const LANE_ORDER: JourneyLane[] = ['education', 'work', 'project', 'achievement', 'learning']

export const LANE_COLORS: Record<JourneyLane, {
  bg: string
  hex: string
  ring: string
  text: string
}> = {
  education: {
    bg: 'bg-blue-500',
    hex: '#3b82f6',
    ring: 'ring-blue-500/30',
    text: 'text-blue-400',
  },
  work: {
    bg: 'bg-emerald-500',
    hex: '#10b981',
    ring: 'ring-emerald-500/30',
    text: 'text-emerald-400',
  },
  project: {
    bg: 'bg-violet-500',
    hex: '#8b5cf6',
    ring: 'ring-violet-500/30',
    text: 'text-violet-400',
  },
  achievement: {
    bg: 'bg-amber-500',
    hex: '#f59e0b',
    ring: 'ring-amber-500/30',
    text: 'text-amber-400',
  },
  learning: {
    bg: 'bg-pink-500',
    hex: '#ec4899',
    ring: 'ring-pink-500/30',
    text: 'text-pink-400',
  },
}

export const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const DISPLAY_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(year: number, month?: number): string {
  return month ? `${DISPLAY_MONTH_NAMES[month - 1]} ${year}` : `${year}`
}

export function formatPeriod(
  startYear: number,
  startMonth: number | undefined,
  endYear: number | null,
  endMonth: number | undefined,
  presentLabel: string,
): string {
  const start = formatDate(startYear, startMonth)

  if (endYear === null) {
    return `${start} - ${presentLabel}`
  }

  if (startYear === endYear && startMonth === endMonth) {
    return start
  }

  return `${start} - ${formatDate(endYear, endMonth)}`
}

export function formatStartOnly(startYear: number, startMonth?: number): string {
  return formatDate(startYear, startMonth)
}
