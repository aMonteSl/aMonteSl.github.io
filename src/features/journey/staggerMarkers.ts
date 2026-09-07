/**
 * Three-position stagger for the achievement markers of the horizontal timeline.
 *
 * A marker whose nearest neighbour is at least `minGapPx` away stays centred on
 * the track line (row 0, exactly where every marker sat before the stagger
 * existed). Markers that would overlap form a cluster and alternate above (row 1)
 * and below (row 2) the line. The helper is pure, so the layout is deterministic
 * and easy to reason about; the classes are literal strings so Tailwind can see them.
 */

/** Vertical position per row: 0 centred on the track line, 1 above it, 2 below it */
export const MARKER_ROW_CLASSES = ['top-1/2', 'top-[calc(50%-12px)]', 'top-[calc(50%+12px)]'] as const

/**
 * Minimum centre distance (px) for two markers to share a row: 32px circle plus a
 * 2px ring on each side is 36px, so 38px leaves 2px of air between the rings.
 */
export const MARKER_MIN_GAP_PX = 38

export type MarkerRow = 0 | 1 | 2

type StaggeredRow = Exclude<MarkerRow, 0>

/**
 * Assign a row to every marker.
 *
 * @param percents   Horizontal position of each marker as a percentage of the track
 * @param trackWidth Measured track width in px; `0` (before measurement) keeps everything centred
 * @param minGapPx   Minimum centre distance between markers on the same row
 * @returns One row per input index, in the same order as `percents`
 */
export function staggerMarkers(
  percents: readonly number[],
  trackWidth: number,
  minGapPx: number = MARKER_MIN_GAP_PX,
): MarkerRow[] {
  const rows: MarkerRow[] = percents.map(() => 0)
  if (trackWidth <= 0 || percents.length < 2) {
    return rows
  }

  const order = percents
    .map((_, index) => index)
    .sort((a, b) => percents[a] - percents[b])
  const xs = order.map((index) => (percents[index] / 100) * trackWidth)

  // Walk the sorted markers and cut a cluster wherever two neighbours are far enough apart
  let clusterStart = 0
  for (let i = 1; i <= order.length; i += 1) {
    const isClusterEnd = i === order.length || xs[i] - xs[i - 1] >= minGapPx
    if (!isClusterEnd) continue

    if (i - clusterStart >= 2) {
      assignStaggeredRows(order, xs, clusterStart, i, minGapPx, rows)
    }
    clusterStart = i
  }

  return rows
}

/** Spread one cluster of colliding markers (sorted indices `from`..`to`) over rows 1 and 2 */
function assignStaggeredRows(
  order: readonly number[],
  xs: readonly number[],
  from: number,
  to: number,
  minGapPx: number,
  rows: MarkerRow[],
): void {
  const lastX: Record<StaggeredRow, number> = { 1: Number.NEGATIVE_INFINITY, 2: Number.NEGATIVE_INFINITY }
  let lastRow: StaggeredRow = 2

  for (let i = from; i < to; i += 1) {
    const x = xs[i]
    let row: StaggeredRow

    if (x - lastX[1] >= minGapPx) {
      row = 1
    } else if (x - lastX[2] >= minGapPx) {
      row = 2
    } else {
      // Three or more markers inside one gap: alternate so no row gets them all
      row = lastRow === 1 ? 2 : 1
    }

    rows[order[i]] = row
    lastX[row] = x
    lastRow = row
  }
}
