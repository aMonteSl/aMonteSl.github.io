import { profile } from '@/data/profile'
import { projects } from '@/data/projects'

export interface PersonSchema {
  '@context': string
  '@type': string
  name: string
  email: string
  url: string
  sameAs: string[]
  address: {
    '@type': string
    addressLocality: string
    addressCountry: string
  }
  jobTitle: string
  description: string
  alumniOf: {
    '@type': string
    name: string
    url?: string
  }
}

export interface CreativeWorkSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  author: {
    '@type': string
    name: string
  }
  url?: string
  codeRepository?: string
  programmingLanguage?: string[]
  dateCreated: string
  keywords: string[]
}

export function generatePersonSchema(): PersonSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    email: profile.email,
    url: 'https://amontesl.github.io',
    sameAs: [
      `https://${profile.linkedin}`,
      `https://${profile.github}`,
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Madrid',
      addressCountry: 'Spain'
    },
    jobTitle: 'Telematics Engineering Student & Software Developer',
    description: profile.summary,
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Universidad Rey Juan Carlos',
      url: 'https://www.urjc.es'
    }
  }
}

export function generateProjectSchema(projectId: string): CreativeWorkSchema | null {
  const project = projects.find(p => p.id === projectId)
  if (!project) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    description: project.description,
    author: {
      '@type': 'Person',
      name: profile.name
    },
    url: project.links.website,
    codeRepository: project.links.github,
    programmingLanguage: project.tags.filter(tag => 
      ['TypeScript', 'JavaScript', 'Python', 'C++', 'Kotlin'].includes(tag)
    ),
    dateCreated: project.year.toString(),
    keywords: project.tags
  }
}

export function generateAllSchemas(): Array<PersonSchema | CreativeWorkSchema> {
  const schemas: Array<PersonSchema | CreativeWorkSchema> = [
    generatePersonSchema()
  ]

  // Add featured project schemas
  projects
    .filter(p => p.featured)
    .forEach(project => {
      const schema = generateProjectSchema(project.id)
      if (schema) schemas.push(schema)
    })

  return schemas
}

export function injectJsonLd(schemas: Array<PersonSchema | CreativeWorkSchema>): void {
  // Remove existing JSON-LD scripts
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]')
  existingScripts.forEach(script => script.remove())

  // Add new schemas
  schemas.forEach(schema => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema, null, 2)
    document.head.appendChild(script)
  })
}
