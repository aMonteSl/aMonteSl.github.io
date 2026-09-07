'use client'

import { useEffect, useState } from 'react'

/**
 * Subscribe to a CSS media query.
 *
 * Returns `fallback` on the server and during the first client render so the
 * markup hydrates identically; the real value arrives in an effect.
 */
export function useMediaQuery(query: string, fallback = false): boolean {
  const [matches, setMatches] = useState(fallback)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia(query)
    const update = () => setMatches(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [query])

  return matches
}
