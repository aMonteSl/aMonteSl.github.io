import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd, LocalizedShell } from '@/components/common'
import { getProjectBySlug, getProjectSeoImage, getProjects, ProjectPageClient } from '@/features/projects'
import type { Project } from '@/features/projects'
import { buildProjectJsonLd, buildProjectMetadata } from '@/lib/seo'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for static export
export async function generateStaticParams() {
  return getProjects().map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return {}
  }

  return buildProjectMetadata(project, 'en', getProjectSeoImage(project))
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug) as Project | undefined

  if (!project) {
    notFound()
  }

  return (
    <LocalizedShell locale="en" showFooter={false}>
      <JsonLd data={buildProjectJsonLd(project, 'en', getProjectSeoImage(project))} />
      <ProjectPageClient project={project} />
    </LocalizedShell>
  )
}
