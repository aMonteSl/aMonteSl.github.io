'use client'

import { ExternalLinkIcon, GitHubIcon } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { ProjectDetailLink } from '../detail'

interface ProjectDetailLinksProps {
  links: ProjectDetailLink[]
  className?: string
}

export function ProjectDetailLinks({ links, className }: ProjectDetailLinksProps) {
  if (links.length === 0) {
    return null
  }

  return (
    <div className={cn('grid gap-2 sm:grid-cols-2', className)}>
      {links.map((link) => (
        <a
          key={`${link.kind}-${link.url}`}
          href={link.url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--border)]/70 bg-black/14 px-3 py-2 text-sm font-medium text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/35 hover:text-[var(--fg)] lg:min-h-9 lg:py-1.5 lg:text-xs"
        >
          {link.kind === 'repo' ? (
            <GitHubIcon className="h-4 w-4 shrink-0" />
          ) : (
            <ExternalLinkIcon className="h-4 w-4 shrink-0" />
          )}
          <span className="min-w-0 flex-1 truncate">{link.label}</span>
        </a>
      ))}
    </div>
  )
}
