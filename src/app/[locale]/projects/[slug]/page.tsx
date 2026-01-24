import { notFound } from 'next/navigation'
import projectsData from '@/content/projects.json'
import { ProjectPageClient } from '@/features/projects'
import type { Project } from '@/features/projects'
import { locales } from '@/i18n/config'

interface PageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

// Generate static params for static export (locale + slug combinations)
export async function generateStaticParams() {
  const params = []
  
  for (const locale of locales) {
    for (const project of projectsData) {
      params.push({
        locale,
        slug: project.slug
      })
    }
  }
  
  return params
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = projectsData.find((p) => p.slug === slug) as Project | undefined

  if (!project) {
    notFound()
  }

  return <ProjectPageClient project={project} />
}
