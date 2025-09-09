# Architecture Overview

## Tech Stack Summary
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom dark theme, Container Queries, Typography & Forms plugins
- **Routing**: React Router DOM (SPA with 404 fallback)
- **Animations**: Framer Motion with `prefers-reduced-motion` support
- **Icons**: Lucide React
- **Build**: Vite with manual code splitting (vendor, router, animation chunks)
- **Deployment**: GitHub Pages via GitHub Actions

## Directory Structure
```
src/
├── components/
│   ├── layout/          # Layout components (Sidebar, Mobile, RootLayout)
│   ├── sections/        # Page sections (About, Projects, etc.)
│   └── ui/             # Reusable UI components (Button, Card, Badge)
├── data/               # TypeScript data files (profile, projects, etc.)
├── hooks/              # Custom React hooks (media query, scroll spy)
├── lib/                # Utilities (analytics, SEO, schema)
├── pages/              # Route components
└── styles/             # Global CSS with CSS variables
```

## Data Flow
- **Static Data**: Structured content in `src/data/*.ts` with TypeScript interfaces
- **Profile Context**: `useProfile()` hook provides global profile data
- **Route-based**: React Router handles navigation with scrollspy for single-page sections
- **Responsive**: CSS variables + Tailwind classes for consistent theming

## Key Components
- **RootLayout**: Two-pane layout (sidebar + main) with responsive mobile collapse
- **Sidebar**: Fixed navigation with profile, quick nav, and contact info
- **Section Components**: Individual portfolio sections with consistent structure
- **SEO Components**: Per-route meta tags, JSON-LD, and Open Graph

## Build & Deploy
1. `npm run build` → TypeScript compilation + Vite bundling
2. GitHub Actions on `main` push → Build + deploy to `gh-pages`
3. GitHub Pages serves from `/dist` via Actions artifact

## Issues/Improvements to Address

### SEO & Performance
- [ ] Missing structured JSON-LD for Person and SoftwareSourceCode schemas  
- [ ] No canonical URLs or per-route SEO components
- [ ] Missing OG image and proper favicon generation
- [ ] Images lack proper width/height attributes and lazy loading

### Accessibility
- [ ] Missing landmark roles and ARIA navigation
- [ ] Scrollspy needs `aria-current` and keyboard navigation
- [ ] Focus management in mobile drawer needs improvement
- [ ] Color contrast verification for forced-colors mode

### Routing & Navigation  
- [ ] App.tsx uses sections instead of proper routing
- [ ] Missing 404 handling and route-based code splitting
- [ ] No smooth scroll behavior between route sections
- [ ] Quick navigation needs keyboard arrow key support

### Assets & Branding
- [ ] Create proper favicon set (16-512px) with brand monogram "A"
- [ ] Generate placeholder profile image at exact path `/src/assets/profile.jpg`
- [ ] Create gallery placeholder images with proper optimization
- [ ] Generate branded OG social sharing image

### Content & Data
- [ ] Improve English fluency in profile descriptions
- [ ] Add Images/Gallery section with lightbox component
- [ ] Enhance project data with proper screenshots
- [ ] Add missing TypeScript types for all data structures

### Responsive Design
- [ ] Test and fix layout on ultrawide screens (3xl, 4k, 5k breakpoints)
- [ ] Ensure no horizontal scroll at 360px width
- [ ] Verify text line lengths stay under 75ch
- [ ] Container queries implementation for section-level responsiveness
