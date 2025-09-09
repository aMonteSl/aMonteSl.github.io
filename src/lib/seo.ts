export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  author?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
}

export const defaultSEO: SEOData = {
  title: 'Adrián Montes - Software Developer & Telematics Engineer',
  description: 'Telematics Engineering student focused on modern software development. Creator of Code-XR, an open-source VS Code plugin for real-time code metrics visualization with XR integration.',
  keywords: [
    'Adrián Montes',
    'Software Developer',
    'Telematics Engineer',
    'TypeScript',
    'React',
    'VS Code Extension',
    'WebXR',
    'Code Visualization',
    'Full Stack Developer',
    'Madrid',
    'Spain'
  ],
  author: 'Adrián Montes',
  image: '/og-image.png',
  url: 'https://amontesl.github.io',
  type: 'profile'
}

export function generatePageSEO(pageName: string, customData?: Partial<SEOData>): SEOData {
  const baseTitle = 'Adrián Montes'
  const pageSpecificTitles: Record<string, string> = {
    home: `${baseTitle} - Software Developer & Telematics Engineer`,
    projects: `Projects - ${baseTitle}`,
    education: `Education & Achievements - ${baseTitle}`,
    activities: `Activities - ${baseTitle}`,
    skills: `Skills - ${baseTitle}`,
    languages: `Languages - ${baseTitle}`,
    contact: `Contact - ${baseTitle}`,
    resume: `Resume - ${baseTitle}`
  }

  const pageSpecificDescriptions: Record<string, string> = {
    home: defaultSEO.description,
    projects: 'Explore my software development projects including Code-XR, a revolutionary VS Code extension for XR-based code visualization.',
    education: 'My academic journey at Universidad Rey Juan Carlos, honors received, and professional achievements in software engineering.',
    activities: 'Hackathons, tech conferences, and continuous learning activities that shape my professional development.',
    skills: 'Technical skills in programming languages, frameworks, tools, and specialized technologies like XR and AI.',
    languages: 'Language proficiencies including native Spanish and intermediate English (TOEIC B2).',
    contact: 'Get in touch for collaboration opportunities, internships, or to discuss innovative software projects.',
    resume: 'Complete professional resume of Adrián Montes, Telematics Engineering student and software developer.'
  }

  const siteBase = defaultSEO.url ?? ''
  const siteBaseTrimmed = siteBase.replace(/\/$/, '')

  return {
    ...defaultSEO,
    title: pageSpecificTitles[pageName] || `${pageName} - ${baseTitle}`,
    description: pageSpecificDescriptions[pageName] || defaultSEO.description,
    url: customData?.url || (siteBaseTrimmed ? `${siteBaseTrimmed}/${pageName === 'home' ? '' : pageName}` : `/${pageName === 'home' ? '' : pageName}`),
    // ensure an image is always present; prefer custom, then default og-image, then favicon
    image: customData?.image || defaultSEO.image || '/favicon.svg',
    ...customData
  }
}

export function generateMetaTags(seo: SEOData): Array<{ name?: string; property?: string; content: string }> {
  // Helper to ensure we expose absolute URLs for social meta tags
  const toAbsolute = (p?: string) => {
    if (!p) return ''
    if (p.startsWith('http://') || p.startsWith('https://')) return p
    const base = defaultSEO.url ?? ''
    const trimmed = base.replace(/\/$/, '')
    if (trimmed) return `${trimmed}${p.startsWith('/') ? p : `/${p}`}`
    return p.startsWith('/') ? p : `/${p}`
  }

  const tags = [
    { name: 'description', content: seo.description },
    { name: 'author', content: seo.author || defaultSEO.author || '' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    
    // Open Graph
    { property: 'og:type', content: seo.type || 'website' },
    { property: 'og:title', content: seo.title },
    { property: 'og:description', content: seo.description },
  { property: 'og:image', content: toAbsolute(seo.image || defaultSEO.image || '') },
  { property: 'og:image:alt', content: seo.title || defaultSEO.title || '' },
  { property: 'og:url', content: seo.url || defaultSEO.url || '' },
    { property: 'og:site_name', content: 'Adrián Montes Portfolio' },
    
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seo.title },
    { name: 'twitter:description', content: seo.description },
  { name: 'twitter:image', content: toAbsolute(seo.image || defaultSEO.image || '') },
  ]

  if (seo.keywords && seo.keywords.length > 0) {
    tags.push({ name: 'keywords', content: seo.keywords.join(', ') })
  }

  return tags.filter(tag => tag.content)
}
