import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { initAnalytics } from './lib/analytics'
import { generateAllSchemas, injectJsonLd } from './lib/schema'
import './styles/index.css'

// Initialize analytics
initAnalytics()

// Inject JSON-LD schemas
injectJsonLd(generateAllSchemas())

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
