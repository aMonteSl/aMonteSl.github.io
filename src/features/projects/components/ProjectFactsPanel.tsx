'use client'

interface ProjectFactsPanelProps {
  typeLabel?: string
  period: string
  periodLabel: string
  typeHeadingLabel: string
}

/**
 * Compact two-row quick-facts table: type and period.
 * Receives all already-translated labels — no i18n inside.
 * Fully dumb and reusable for any project type.
 */
export function ProjectFactsPanel({
  typeLabel,
  period,
  periodLabel,
  typeHeadingLabel,
}: ProjectFactsPanelProps) {
  return (
    <dl className="space-y-3">
      {typeLabel && (
        <div className="flex items-center justify-between gap-2">
          <dt className="text-[var(--fg-muted)] text-xs">{typeHeadingLabel}</dt>
          <dd className="text-[var(--fg)] font-medium text-xs text-right">{typeLabel}</dd>
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        <dt className="text-[var(--fg-muted)] text-xs">{periodLabel}</dt>
        <dd className="text-[var(--fg)] font-medium text-xs text-right">{period}</dd>
      </div>
    </dl>
  )
}
