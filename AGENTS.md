# AGENTS.md — AI/Agent Collaboration Guide

## Project Summary

**Portfolio Website** for Adrián Montes Linares  
- **URL**: https://amontesl.github.io/  
- **Purpose**: Personal developer portfolio showcasing skills, projects, and CV  
- **Status**: Active development

### Current Goals
1. **Maintain UI/UX**: Keep the current landing experience consistent
2. **Clean Architecture**: Feature-based structure with clear boundaries
3. **Scalable Development**: Support adding projects, blog posts, and new sections

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 15.x |
| React | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Animation | Framer Motion | 12.x |
| 3D Background | Three.js + React Three Fiber | 0.180 / 9.x |
| i18n | next-intl | latest |
| Deployment | GitHub Pages (static export) | — |

---

## Folder Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with providers, metadata, footer
│   ├── page.tsx                  # Home page (delegates to features)
│   ├── globals.css               # Global styles + Tailwind imports + CSS vars
│   ├── robots.ts                 # SEO robots configuration
│   ├── sitemap.ts                # SEO sitemap generation
│   └── projects/                 # Projects routes
│       └── [slug]/
│           └── page.tsx          # Dynamic project detail page
│
├── components/
│   ├── ui/                       # Pure presentational components
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Chip.tsx
│   │   ├── Container.tsx
│   │   ├── Modal.tsx
│   │   ├── SectionHeading.tsx
│   │   └── index.ts              # Barrel export
│   └── common/                   # Shared layout components
│       ├── Footer.tsx
│       ├── Header.tsx
│       ├── Nav.tsx
│       └── index.ts
│
├── features/                     # Domain features (encapsulated behavior + UI)
│   ├── landing/                  # Hero section components
│   │   ├── Hero.tsx
│   │   ├── AnimatedBackground.tsx
│   │   ├── FeaturedProjectCard.tsx
│   │   ├── Silk.tsx              # 3D particle background (Three.js)
│   │   ├── useFeaturedRotation.ts
│   │   └── index.ts
│   ├── language/                 # Language switcher
│   ├── constructionNotice/       # Scroll guard + modal
│   ├── morphNav/                 # Morphing navigation system
│   ├── projects/                 # Project cards, detail views
│   ├── skills/                   # Skills section
│   └── journey/                  # Professional journey timeline
│
├── i18n/                         # Internationalization (next-intl)
│   ├── config.ts                 # Locale definitions
│   ├── provider.tsx              # I18nProvider (client-side with localStorage)
│   ├── index.ts                  # Barrel export
│   └── messages/                 # Translation files
│       ├── en.json               # English (primary)
│       └── es.json               # Spanish (secondary)
│
├── lib/                          # Shared utilities
│   ├── constants.ts              # Routes, links, socials, CV URLs
│   ├── utils.ts                  # cn() helper (clsx + tailwind-merge)
│   └── motion.ts                 # Framer Motion presets
│
├── content/                      # Static content data
│   ├── projects.json
│   ├── featuredProjects.ts
│   └── skills.ts
│
└── types/                        # TypeScript declarations
    ├── fiber.d.ts
    ├── three-fiber.d.ts
    └── tailwind-plugins.d.ts

public/
├── images/                       # Static images
├── cv/                           # CV PDF files (en/es)
├── projects/                     # Project screenshots
└── favicons/                     # Favicon assets
```

---

## Coding Conventions

### Exports
- **Named exports** for components, hooks, utilities
- **Default exports** only for Next.js pages/layouts (required by framework)
- **Barrel exports** (`index.ts`) per feature folder — keep shallow to avoid circular deps

### Naming
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- Constants: File `camelCase.ts`, exports `SCREAMING_SNAKE_CASE`

### Import Patterns
All imports use the **`@/*` path alias** (mapped to `src/*` in tsconfig.json):

```typescript
// ✅ Correct
import { Button, Badge } from '@/components/ui'
import { Hero, AnimatedBackground } from '@/features/landing'
import { useTranslations, useLocale } from '@/i18n'
import { LINKS, getCvUrl } from '@/lib/constants'

// ❌ Incorrect
import { Button } from '../../../components/ui/Button'
import Hero from '@/features/landing/Hero' // Use named exports
```

### Component Boundaries
- **`components/ui/`**: Pure presentational, receive all data via props, no side effects
  - Props in, JSX out
  - No hooks except `useRef`, `useMemo`, `useCallback`
  - No data fetching or business logic
  - Example: `Button`, `Badge`, `Modal`, `Avatar`

- **`features/`**: May contain hooks, context, data fetching, composed UI
  - Encapsulated domain logic
  - Can use state, effects, context
  - May compose multiple UI components
  - Example: `Hero`, `SkillsSection`, `ProjectCard`

- **`app/`**: Route handlers and layouts only — delegate to features/components
  - Minimal logic
  - Metadata and SEO configuration
  - Provider setup

### TypeScript
- **Strict mode enabled** — avoid `any` types
- Prefer explicit return types on functions
- Use **interfaces** for object shapes, **types** for unions/primitives
- Props interfaces named `{ComponentName}Props`

Example:
```typescript
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}, ref) => {
  // Implementation
})
```

### Styling
- **Tailwind utility classes** directly in JSX
- Use **`cn()`** helper from `@/lib/utils` for conditional classes
- **CSS variables** for theming in `globals.css`:
  - `var(--bg)` — background
  - `var(--fg)` — foreground text
  - `var(--fg-muted)` — muted text
  - `var(--accent)` — accent color
  - `var(--card)` — card background
  - `var(--border)` — border color
- **Fluid typography**: Tailwind plugin (`tailwindcss-fluid-type`)
- **Fluid spacing**: Tailwind plugin (`tailwindcss-fluid-spacing`)
- Avoid `@apply` unless creating base component styles

Example:
```typescript
import { cn } from '@/lib/utils'

<Button 
  className={cn(
    "base-styles",
    isActive && "active-styles",
    className
  )}
>
  Click me
</Button>
```

### React Patterns
- **Functional components only**
- **Client components**: Mark with `'use client'` directive at top of file
- **Server components**: Default (no directive needed)
- Custom hooks live in `features/<name>/hooks/` or `lib/hooks/`
- Prefix hooks with `use`: `useFeaturedRotation`, `useScrollProgress`

### i18n Strategy (Current Implementation)
- **Client-side** i18n with `localStorage` persistence
- Locale stored in `localStorage` key: `'portfolio-locale'`
- Uses `next-intl` for message management
- **Messages**: Nested JSON structure in `messages/{locale}.json`
- **Usage**: `useTranslations('namespace')` hook
- **Language switch**: Updates context + localStorage, triggers re-render
- Document `lang` attribute updated dynamically

Example:
```typescript
import { useTranslations, useLocale } from '@/i18n'

export function MyComponent() {
  const t = useTranslations('hero')
  const { locale, setLocale } = useLocale()
  
  return <h1>{t('title')}</h1>
}
```

**Translation keys** in `messages/en.json`:
```json
{
  "hero": {
    "title": "Welcome",
    "subtitle": "Portfolio of Adrián Montes Linares"
  }
}
```

---

## Common Tasks

### Adding a New UI Component

1. Create in `src/components/ui/{ComponentName}.tsx`
2. Export from `src/components/ui/index.ts`
3. Keep it pure — props in, JSX out, no side effects

```typescript
// src/components/ui/Card.tsx
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn(
      "bg-[var(--card)] border border-[var(--border)] rounded-xl p-6",
      className
    )}>
      {children}
    </div>
  )
}
```

```typescript
// src/components/ui/index.ts
export { Card } from './Card'
export type { CardProps } from './Card'
// ... other exports
```

### Adding a Translation

1. Add key to `src/i18n/messages/en.json` (primary language)
2. Add Spanish translation to `src/i18n/messages/es.json`
3. Use `useTranslations('namespace')` in component

```json
// src/i18n/messages/en.json
{
  "projects": {
    "title": "Featured Projects",
    "viewAll": "View All Projects"
  }
}
```

```typescript
// Usage
const t = useTranslations('projects')
return <h2>{t('title')}</h2>
```

### Adding a New Feature

1. Create folder in `src/features/{featureName}/`
2. Add feature components (can be stateful)
3. Create `index.ts` for barrel export
4. Compose UI components from `@/components/ui`

```
src/features/blog/
├── BlogPost.tsx
├── BlogList.tsx
├── useBlogData.ts
└── index.ts
```

```typescript
// src/features/blog/index.ts
export { BlogPost } from './BlogPost'
export { BlogList } from './BlogList'
export { useBlogData } from './useBlogData'
```

### Adding a New Page/Route

1. Create in `src/app/{route}/page.tsx`
2. Use **default export** (Next.js requirement)
3. Delegate rendering to feature components
4. Add metadata export for SEO

```typescript
// src/app/blog/page.tsx
import type { Metadata } from 'next'
import { BlogList } from '@/features/blog'

export const metadata: Metadata = {
  title: 'Blog | Adrián Montes Linares',
  description: 'Articles and thoughts on software engineering',
}

export default function BlogPage() {
  return <BlogList />
}
```

### Adding Locale-Specific Content

For content that varies by locale (e.g., CV files):

```typescript
// In @/lib/constants
export const CV_FILES = {
  en: '/cv/CV_Color_Adrian_Montes_Linares_ENG.pdf',
  es: '/cv/CV_Color_Adrian_Montes_Linares.pdf',
} as const

export function getCvUrl(locale: string): string {
  return locale === 'es' ? CV_FILES.es : CV_FILES.en
}
```

```typescript
// Usage in component
import { useLocale } from '@/i18n'
import { getCvUrl } from '@/lib/constants'

const { locale } = useLocale()
const cvUrl = getCvUrl(locale)
```

---

## Definition of Done

A migration/feature is complete when:

- [ ] **UI/UX matches** design and content requirements
- [ ] **Build succeeds** — `npm run build` produces valid static export
- [ ] **TypeScript strict** — no `any` types, proper typing throughout
- [ ] **Accessibility** — modals focus-trapped, ESC closes, keyboard nav works
- [ ] **i18n coverage** — all user-facing text has translation keys
- [ ] **No dead code** — unused imports, components, or files removed
- [ ] **Follows conventions** — matches patterns in this document
- [ ] **Responsive** — works on mobile, tablet, desktop (fluid spacing/type)
- [ ] **Deploy works** — GitHub Pages serves correctly

---

## Workflow Guidelines

### For AI Coding Agents (Copilot, Claude, etc.)

1. **Small steps**: Make incremental changes, verify each before proceeding
2. **Verify builds**: Run `npm run dev` or `npm run build` after significant changes
3. **Preserve behavior**: When refactoring, test that UI looks/works identically
4. **Follow structure**: Place files according to folder architecture above
5. **Use existing patterns**: Check how similar components are built before adding new ones
6. **No giant rewrites**: Prefer refactoring file-by-file over massive multi-file changes
7. **Leave clean code**: No placeholder TODOs unless absolutely necessary

### Commit Style
- Prefix: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Keep commits focused on single logical change
- Example: `feat: add blog post list component`

---

## Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# Production build (static export for GitHub Pages)
npm run build

# Start production server locally
npm start

# Lint code
npm run lint

# Generate responsive images (Sharp-based)
npm run gen:images

# Auto-translate en.json → es.json (requires API keys)
npm run translate

# Check translation coverage
npm run check-translations
```

---

## Future Vision

**Optional Improvements** (not required, documented for future consideration):

### Server-Side i18n
Currently using client-side i18n with localStorage. Potential future migration:
- Use `[locale]` route segments in App Router: `app/[locale]/page.tsx`
- Server-side locale detection from URL
- Type-safe routing with `createLocalizedPathnamesNavigation`
- Benefits: Better SEO, no hydration flash, simpler state management

### Testing
- Add **Vitest** + **React Testing Library**
- Unit tests for utilities (`cn`, motion presets)
- Component tests for UI components
- Integration tests for features

### Component Library
- Extract `components/ui/` to shareable package (optional)
- Publish to npm for reuse across projects
- Generate Storybook documentation

---

## Key Files Reference

| Purpose | Path |
|---------|------|
| Next.js config | `next.config.ts` |
| Tailwind config | `tailwind.config.ts` |
| TypeScript config | `tsconfig.json` |
| ESLint config | `eslint.config.mjs` |
| Root layout | `src/app/layout.tsx` |
| Home page | `src/app/page.tsx` |
| Global styles | `src/app/globals.css` |
| i18n provider | `src/i18n/provider.tsx` |
| Constants | `src/lib/constants.ts` |
| Utilities | `src/lib/utils.ts` |
| Motion presets | `src/lib/motion.ts` |

---

## Questions?

For architecture questions or contribution guidelines, refer to:
- This file (`AGENTS.md`) — comprehensive architecture guide
- `.github/copilot-instructions.md` — concise coding standards
- `.github/instructions/frontend.instructions.md` — detailed frontend patterns
