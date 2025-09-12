'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Types
type Locale = 'en' | 'es'
type Dictionary = Record<string, string | Record<string, unknown>>

interface I18nContextType {
  locale: Locale
  t: (key: string, vars?: Record<string, string>) => string
  setLocale: (locale: Locale) => void
}

// Context
const I18nContext = createContext<I18nContextType | null>(null)

// Static import for English (source of truth)
import enDictionary from './dictionaries/en.json'

// Helper to get nested value from object using dot notation
const getNestedValue = (obj: Dictionary, path: string): string => {
  return path.split('.').reduce((current: unknown, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj) as string || path
}

// Helper to replace variables in text
const replaceVariables = (text: string, vars?: Record<string, string>): string => {
  if (!vars) return text
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, 'g'), value),
    text
  )
}

// Get default locale: localStorage if exists, otherwise always "en"
const getDefaultLocale = (): Locale => {
  if (typeof window === 'undefined') return 'en'
  
  // Check localStorage first
  const saved = localStorage.getItem('locale') as Locale | null
  if (saved && (saved === 'en' || saved === 'es')) return saved
  
  // Default to English always (ignore navigator.language)
  return 'en'
}

// Provider component
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [dictionaries, setDictionaries] = useState<Record<Locale, Dictionary>>({
    en: enDictionary,
    es: {}
  })

  // Translation function
  const t = (key: string, vars?: Record<string, string>): string => {
    const currentDict = dictionaries[locale]
    let text = getNestedValue(currentDict, key)
    
    // Fallback to English if translation not found
    if (text === key && locale !== 'en') {
      text = getNestedValue(dictionaries.en, key)
    }
    
    return replaceVariables(text, vars)
  }

  // Set locale with persistence and meta updates
  const setLocale = async (newLocale: Locale) => {
    if (newLocale === locale) return
    
    // If switching to Spanish and dictionary not loaded, load it
    if (newLocale === 'es' && Object.keys(dictionaries.es).length === 0) {
      try {
        const esModule = await import('./dictionaries/es.json')
        setDictionaries(prev => ({
          ...prev,
          es: esModule.default
        }))
      } catch {
        console.warn('Spanish dictionary not available yet. Staying in English.')
        // Show user-friendly message
        if (typeof window !== 'undefined') {
          // Simple notification without external deps
          const notification = document.createElement('div')
          notification.textContent = 'Spanish translation is being prepared. Please try again later.'
          notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            background: #1f2937; color: white; padding: 12px 16px;
            border-radius: 8px; font-size: 14px; max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          `
          document.body.appendChild(notification)
          setTimeout(() => notification.remove(), 4000)
        }
        return
      }
    }
    
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  // Initialize on mount
  useEffect(() => {
    const defaultLocale = getDefaultLocale()
    setLocaleState(defaultLocale)
    
    // If default is Spanish, try to load it
    if (defaultLocale === 'es') {
      import('./dictionaries/es.json')
        .then(esModule => {
          setDictionaries(prev => ({
            ...prev,
            es: esModule.default
          }))
        })
        .catch(() => {
          // Spanish not available, stay in English
          setLocaleState('en')
          localStorage.setItem('locale', 'en')
        })
    }
  }, [])

  // Update document meta when locale changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
      const title = getNestedValue(dictionaries[locale], 'meta.title') || 
                   getNestedValue(dictionaries.en, 'meta.title')
      if (title && title !== 'meta.title') {
        document.title = title
      }
    }
  }, [locale, dictionaries])

  const contextValue: I18nContextType = {
    locale,
    t,
    setLocale
  }

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  )
}

// Hook to use I18n context
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
