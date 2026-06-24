'use client'

import Link from 'next/link'
import { ArrowRightIcon, ExternalLinkIcon } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface ProjectCardLink {
  href: string
  label: string
  external?: boolean
  primary?: boolean
}

interface ProjectCardLinksProps {
  links: ProjectCardLink[]
  className?: string
}

export function ProjectCardLinks({ links, className }: ProjectCardLinksProps) {
  if (links.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {links.map((link) => {
        const classes = cn(
          'inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors',
          link.primary
            ? 'border-[var(--accent)]/40 bg-[var(--accent)] text-[#120d0b] hover:bg-[var(--fg)]'
            : 'border-[var(--border)]/70 bg-black/14 text-[var(--fg-muted)] hover:border-[var(--accent)]/35 hover:text-[var(--fg)]'
        )
        const icon = link.external ? (
          <ExternalLinkIcon className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden />
        )

        if (link.external) {
          return (
            <a
              key={`${link.label}-${link.href}`}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className={classes}
              onClick={(event) => event.stopPropagation()}
            >
              <span>{link.label}</span>
              {icon}
            </a>
          )
        }

        return (
          <Link
            key={`${link.label}-${link.href}`}
            href={link.href}
            className={classes}
            onClick={(event) => event.stopPropagation()}
          >
            <span>{link.label}</span>
            {icon}
          </Link>
        )
      })}
    </div>
  )
}
