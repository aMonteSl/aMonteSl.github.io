'use client'

import { cn } from '@/lib/utils'

interface BentoCardProps {
  /** Small uppercase label shown at the top of the card */
  label?: string
  className?: string
  children: React.ReactNode
  /** Allow internal vertical scroll when content overflows its cell */
  scrollable?: boolean
  /** Remove default inner padding (e.g. for custom-padded children) */
  noPadding?: boolean
}

/**
 * Generic bento grid cell.
 * Provides dark glass card styling, flex-column layout,
 * an optional accent label, and optional internal scroll.
 *
 * Fully dumb — receives all data as props, no business logic.
 */
export function BentoCard({
  label,
  className,
  children,
  scrollable = false,
  noPadding = false,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--card)]/70 backdrop-blur-sm rounded-xl border border-[var(--border)]/60',
        'flex flex-col min-h-0 overflow-hidden',
        className,
      )}
    >
      {label && (
        <div className="px-4 pt-3 pb-1 flex-shrink-0">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]/70">
            {label}
          </span>
        </div>
      )}

      <div
        className={cn(
          'flex-1 min-h-0',
          !noPadding && (label ? 'px-4 pb-4' : 'p-4'),
          scrollable && 'overflow-y-auto',
        )}
      >
        {children}
      </div>
    </div>
  )
}
