import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { generatePageSEO, generateMetaTags } from '@/lib/seo'

export function SEOHead() {
  const location = useLocation()
  const pageName = location.pathname === '/' ? 'home' : location.pathname.slice(1)
  const seoData = generatePageSEO(pageName)
  const metaTags = generateMetaTags(seoData)

  useEffect(() => {
    // Update document title
    document.title = seoData.title
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = seoData.url || ''
    
    // Ensure favicon is present
    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.rel = 'icon'
      document.head.appendChild(favicon)
    }
    favicon.href = '/favicon.svg'
    
    // Update meta tags
    metaTags.forEach(tag => {
      let meta: HTMLMetaElement | null = null
      
      if (tag.name) {
        meta = document.querySelector(`meta[name="${tag.name}"]`)
        if (!meta) {
          meta = document.createElement('meta')
          meta.name = tag.name
          document.head.appendChild(meta)
        }
      } else if (tag.property) {
        meta = document.querySelector(`meta[property="${tag.property}"]`)
        if (!meta) {
          meta = document.createElement('meta')
          meta.setAttribute('property', tag.property)
          document.head.appendChild(meta)
        }
      }
      
      if (meta) {
        meta.content = tag.content
      }
    })
  }, [seoData, metaTags])

  return null
}
