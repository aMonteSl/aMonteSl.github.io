import { notFound } from 'next/navigation'
import projectsData from '@/content/projects.json'
import { ProjectPageClient } from '@/features/projects'
import type { Project } from '@/features/projects'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for static export
export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = projectsData.find((p) => p.slug === slug) as Project | undefined

  if (!project) {
    notFound()
  }

  return <ProjectPageClient project={project} />
}
