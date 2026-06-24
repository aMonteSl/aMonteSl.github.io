'use client'

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionTone = 'default' | 'band' | 'xr'
type SurfaceVariant = 'flat' | 'raised' | 'interactive' | 'terminal' | 'xr'
type StatusTone = 'accent' | 'success' | 'muted' | 'xr' | 'warning'

export interface SectionShellProps {
  id?: string
  children: ReactNode
  className?: string
  innerClassName?: string
  size?: 'lg' | 'xl' | 'full'
  tone?: SectionTone
}

const sectionSizes = {
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
}

export function SectionShell({
  id,
  children,
  className,
  innerClassName,
  size = 'xl',
  tone = 'default',
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28',
        tone === 'band' && 'border-y border-[var(--border)]/55 bg-[var(--surface)]/18',
        tone === 'xr' && 'xr-grid',
        className
      )}
    >
      <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sectionSizes[size], innerClassName)}>
        {children}
      </div>
    </section>
  )
}

export interface SectionHeaderProps {
  kicker?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({ kicker, title, subtitle, align = 'center', className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-10 sm:mb-12', align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl', className)}>
      {kicker && <Kicker className={align === 'center' ? 'justify-center' : undefined}>{kicker}</Kicker>}
      <h2 className="mt-3 text-2xl font-semibold tracking-normal text-[var(--fg)] sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base', align === 'center' && 'mx-auto max-w-2xl')}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export interface SurfaceProps {
  children: ReactNode
  variant?: SurfaceVariant
  className?: string
}

const surfaceVariants: Record<SurfaceVariant, string> = {
  flat: 'border-[var(--border)]/70 bg-[var(--surface)]/48',
  raised: 'border-[var(--border)]/75 bg-[var(--surface-strong)]/62 shadow-[0_24px_70px_rgba(0,0,0,0.24)]',
  interactive: 'border-[var(--border)]/75 bg-[var(--surface)]/55 transition-colors duration-200 hover:border-[var(--accent)]/32 hover:bg-[var(--surface-strong)]/72',
  terminal: 'border-[var(--border)]/80 bg-[#070605]/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
  xr: 'border-[var(--xr)]/18 bg-[linear-gradient(135deg,rgba(220,162,147,0.08),rgba(95,123,156,0.08))]',
}

export function Surface({ children, variant = 'flat', className }: SurfaceProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl border backdrop-blur-md', surfaceVariants[variant], className)}>
      {children}
    </div>
  )
}

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]', className)}>
      <span className="h-px w-6 bg-[var(--accent)]/55" />
      {children}
    </p>
  )
}

export interface MetricTileProps {
  label: string
  value: string
  detail?: string
  className?: string
}

export function MetricTile({ label, value, detail, className }: MetricTileProps) {
  return (
    <Surface variant="flat" className={cn('p-4', className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fg-muted)]/58">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-snug text-[var(--fg)]">{value}</p>
      {detail && <p className="mt-2 text-xs leading-relaxed text-[var(--fg-muted)]/78">{detail}</p>}
    </Surface>
  )
}

const statusTones: Record<StatusTone, string> = {
  accent: 'border-[var(--accent)]/25 bg-[var(--accent)]/10 text-[var(--fg)]',
  success: 'border-[var(--success)]/20 bg-[var(--success)]/9 text-[var(--fg)]',
  muted: 'border-[var(--border)]/80 bg-black/16 text-[var(--fg-muted)]',
  xr: 'border-[var(--xr)]/25 bg-[var(--xr)]/10 text-[var(--fg)]',
  warning: 'border-[var(--warning)]/25 bg-[var(--warning)]/10 text-[var(--fg)]',
}

export function StatusPill({
  children,
  tone = 'accent',
  className,
}: {
  children: ReactNode
  tone?: StatusTone
  className?: string
}) {
  return (
    <span className={cn('inline-flex min-h-7 items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium', statusTones[tone], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {children}
    </span>
  )
}

export function LinkButton({
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#120d0b] transition-colors hover:bg-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}

export function IconButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)]/75 bg-[var(--surface)]/50 text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/35 hover:text-[var(--fg)]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function DividerLine({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-[linear-gradient(90deg,transparent,var(--border),transparent)]', className)} />
}
