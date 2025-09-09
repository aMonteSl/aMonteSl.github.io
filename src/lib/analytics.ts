export interface AnalyticsConfig {
  enabled: boolean
  plausibleDomain?: string
  plausibleScript?: string
}

export const analyticsConfig: AnalyticsConfig = {
  enabled: false, // Set to true when ready to enable analytics
  plausibleDomain: 'amontesl.github.io',
  plausibleScript: 'https://plausible.io/js/script.js'
}

export function initAnalytics(): void {
  if (!analyticsConfig.enabled || typeof window === 'undefined') {
    return
  }

  // Initialize Plausible Analytics
  if (analyticsConfig.plausibleScript && analyticsConfig.plausibleDomain) {
    const script = document.createElement('script')
    script.defer = true
    script.setAttribute('data-domain', analyticsConfig.plausibleDomain)
    script.src = analyticsConfig.plausibleScript
    document.head.appendChild(script)
  }
}

export function trackEvent(eventName: string, options?: { props?: Record<string, string | number> }): void {
  if (!analyticsConfig.enabled || typeof window === 'undefined') {
    return
  }

  // Track with Plausible
  if ('plausible' in window) {
    ;(window as any).plausible(eventName, options)
  }
}

export function trackPageView(url?: string): void {
  if (!analyticsConfig.enabled || typeof window === 'undefined') {
    return
  }

  const page = url || window.location.pathname + window.location.search

  // Track page view with Plausible
  if ('plausible' in window) {
    ;(window as any).plausible('pageview', { u: page })
  }
}

// Predefined events for common actions
export const trackDownloadCV = () => trackEvent('Download CV')
export const trackContactClick = (method: string) => trackEvent('Contact Click', { props: { method } })
export const trackProjectView = (projectName: string) => trackEvent('Project View', { props: { project: projectName } })
export const trackExternalLink = (url: string) => trackEvent('External Link', { props: { url } })
