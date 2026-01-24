import { getRequestConfig } from 'next-intl/server'

// For static export with statically loaded messages
// Messages are provided by the layout, but we need a valid config
export default getRequestConfig(async ({ locale }) => {
  const validLocale = locale || 'en'
  
  // Load messages for the request config (even though layout also loads them)
  const messages = (await import(`./messages/${validLocale}.json`)).default
  
  return {
    locale: validLocale,
    messages
  }
})
