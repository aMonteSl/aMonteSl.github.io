'use client'

interface ProjectDetailSummaryProps {
  title: string
  body: string
  roleTitle: string
  role: string
}

export function ProjectDetailSummary({ title, body, roleTitle, role }: ProjectDetailSummaryProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)]/70 bg-[var(--surface)]/45 p-5 backdrop-blur-sm sm:p-6 lg:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{title}</p>
      <div className="mt-3 max-w-4xl space-y-3 text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base lg:text-[13px] lg:leading-[1.62] xl:columns-2 xl:gap-7">
        {body.split('\n').filter(Boolean).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-4 border-t border-[var(--border)]/60 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]/70">{roleTitle}</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)] lg:text-[13px] lg:leading-[1.58]">{role}</p>
      </div>
    </section>
  )
}
