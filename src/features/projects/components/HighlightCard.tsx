'use client'

import { cn } from '@/lib/utils'

interface HighlightCardProps {
  /** String in "Label → text" format, or plain text */
  highlight: string
  /** 0 = problem (red), 1 = solution (accent), 2 = impact (green) */
  index: number
  className?: string
}

const STYLES = [
  {
    border: 'border-red-800/40',
    dot: 'bg-red-400',
    label: 'text-red-400/90',
  },
  {
    border: 'border-[var(--accent)]/40',
    dot: 'bg-[var(--accent)]',
    label: 'text-[var(--accent)]/90',
  },
  {
    border: 'border-emerald-700/40',
    dot: 'bg-emerald-400',
    label: 'text-emerald-400/90',
  },
] as const

/**
 * Renders a single highlight entry.
 * Parses "Label → text" format to separate label from body.
 * Color-codes by index: 0 = problem, 1 = solution, 2 = impact.
 * Falls back to rendering the full string as body if no " → " separator.
 *
 * Fully dumb — no business logic, just formatting.
 */
export function HighlightCard({ highlight, index, className }: HighlightCardProps) {
  const style = STYLES[index % STYLES.length]

  const sepIdx = highlight.indexOf(' → ')
  const hasLabel = sepIdx !== -1
  const label = hasLabel ? highlight.slice(0, sepIdx) : null
  const text = hasLabel ? highlight.slice(sepIdx + 3) : highlight

  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-xl p-3 border bg-[var(--card)]/60 backdrop-blur-sm',
        'flex-1 min-w-0',
        style.border,
        className,
      )}
    >
      {label && (
        <span
          className={cn(
            'text-[10px] font-bold uppercase tracking-widest',
            'flex items-center gap-1.5 flex-shrink-0',
            style.label,
          )}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', style.dot)} />
          {label}
        </span>
      )}
      <p className="text-xs text-[var(--fg-muted)] leading-relaxed">{text}</p>
    </div>
  )
}
