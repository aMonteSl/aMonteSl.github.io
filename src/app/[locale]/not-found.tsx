'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/en" style={{ color: '#dca293' }}>Go to homepage</Link>
    </div>
  )
}
