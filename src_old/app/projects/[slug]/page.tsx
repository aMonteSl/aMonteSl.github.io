import { notFound } from 'next/navigation'
import projectsData from '../../_content/projects.json'
import ProjectPageClient from './ProjectPageClient'

interface Project {
  id: number
  slug: string
  title: string
  summary_en: string
  summary_es: string
  description_en: string
  description_es: string
  image: string
  tech: string[]
  highlights_en: string[]
  highlights_es: string[]
  role_en: string
  role_es: string
  links?: {
    github?: string
    demo?: string
    live?: string
  }
}

interface PageProps {
  params: {
    slug: string
  }
}

// Generate static params for static export
export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }))
}

export default function ProjectPage({ params }: PageProps) {
  const project = projectsData.find((p) => p.slug === params.slug) as Project | undefined
  
  if (!project) {
    notFound()
  }

  return <ProjectPageClient project={project} />
}
