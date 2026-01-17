import { MetadataRoute } from 'next'
import { LINKS } from '@/lib/constants'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${LINKS.website}/sitemap.xml`,
  }
}
