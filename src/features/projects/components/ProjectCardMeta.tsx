'use client'

import { StatusPill } from '@/components/ui'

interface ProjectCardMetaProps {
  period?: string
  status?: string
  badges?: string[]
  typeLabel?: string
  index: number
  featured?: boolean
}

export function ProjectCardMeta({ period, status, badges = [], typeLabel, index, featured = false }: ProjectCardMetaProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {typeLabel && (
          <StatusPill tone={featured ? 'xr' : 'muted'} className="min-h-6 px-2.5 py-0.5 text-[11px]">
            {typeLabel}
          </StatusPill>
        )}
        {status && (
          <StatusPill tone="success" className="min-h-6 px-2.5 py-0.5 text-[11px]">
            {status}
          </StatusPill>
        )}
        {badges.map((badge) => (
          <StatusPill key={badge} tone={featured ? 'xr' : 'success'} className="min-h-6 px-2.5 py-0.5 text-[11px]">
            {badge}
          </StatusPill>
        ))}
        {period && (
          <span className="rounded-full border border-[var(--border)]/70 bg-black/14 px-2.5 py-1 text-[11px] font-medium text-[var(--fg-muted)]">
            {period}
          </span>
        )}
      </div>
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]/48">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  )
}
