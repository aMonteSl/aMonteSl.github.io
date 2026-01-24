# Frontend Development Instructions

## Component Architecture

### Pure UI Components (`components/ui/`)

**Purpose**: Presentational components with zero business logic.

**Rules**:
- Props in, JSX out — no side effects
- No data fetching or external state
- Only `useRef`, `useMemo`, `useCallback` hooks allowed
- All data passed via props
- Reusable across features

**Example**:
```typescript
// components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

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
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all'
  
  const variants = {
    primary: 'bg-[var(--accent)] text-[var(--bg)] hover:shadow-lg',
    ghost: 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card)]',
    outline: 'border border-[var(--border)] hover:bg-[var(--card)]'
  }
  
  const sizes = {
    sm: 'h-8 px-3 text-sm rounded-lg',
    md: 'h-10 px-4 py-2 rounded-xl',
    lg: 'h-12 px-6 py-3 rounded-xl'
  }
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'
```

### Feature Components (`features/`)

**Purpose**: Domain-specific logic + composed UI.

**Capabilities**:
- State management (`useState`, `useReducer`)
- Side effects (`useEffect`)
- Context consumption
- Data fetching
- Custom hooks
- Composition of UI components

**Example**:
```typescript
// features/projects/FeaturedProjectsSection.tsx
'use client'

import { useState } from 'react'
import { Container, SectionHeading } from '@/components/ui'
import { useTranslations } from '@/i18n'
import { ProjectCard } from './ProjectCard'
import { useFeaturedProjects } from './hooks/useFeaturedProjects'

export function FeaturedProjectsSection() {
  const t = useTranslations('projects')
  const projects = useFeaturedProjects()
  const [filter, setFilter] = useState<string | null>(null)
  
  const filtered = filter 
    ? projects.filter(p => p.category === filter)
    : projects
  
  return (
    <Container>
      <SectionHeading>{t('title')}</SectionHeading>
      {/* Feature logic here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Container>
  )
}
```

### When to Use Client Components

Mark with `'use client'` directive when component needs:
- Browser APIs (`window`, `document`, `localStorage`)
- Event handlers (`onClick`, `onChange`)
- State hooks (`useState`, `useReducer`, `useContext`)
- Effects (`useEffect`, `useLayoutEffect`)
- Browser-only libraries (Framer Motion, Three.js)

**Default to server components** unless you need the above.

---

## Tailwind CSS Conventions

### CSS Variables (Theming)

Defined in `src/app/globals.css`:
```css
:root {
  --bg: #040304;
  --fg: #fffcf7;
  --fg-muted: #c0b8a8;
  --accent: #dca293;
  --card: #0f0e0d;
  --border: #2a2825;
}
```

**Usage in components**:
```typescript
<div className="bg-[var(--bg)] text-[var(--fg)] border-[var(--border)]">
  <p className="text-[var(--fg-muted)]">Muted text</p>
  <button className="bg-[var(--accent)]">Accent button</button>
</div>
```

### Fluid Typography

Uses `tailwindcss-fluid-type` plugin for responsive text sizes.

**Available sizes**:
- `text-fluid-xs` through `text-fluid-5xl`
- Automatically scales between 360px → 2560px screens
- No manual breakpoint management needed

**Example**:
```typescript
<h1 className="text-fluid-4xl font-bold">Hero Title</h1>
<p className="text-fluid-base">Body text</p>
```

### Fluid Spacing

Uses `tailwindcss-fluid-spacing` plugin.

**Available utilities**:
- `p-fluid-{size}`, `m-fluid-{size}`, `gap-fluid-{size}`
- Scales from `8px` (mobile) → `24px` (desktop)

**Example**:
```typescript
<section className="py-fluid-16 px-fluid-8">
  <div className="flex gap-fluid-4">
    {/* Content */}
  </div>
</section>
```

### Conditional Classes with `cn()`

**Always use** the `cn()` helper for conditional classes:

```typescript
import { cn } from '@/lib/utils'

<Button
  className={cn(
    "base-class",
    isActive && "active-class",
    isDisabled && "opacity-50 cursor-not-allowed",
    className // Allow override from props
  )}
/>
```

**Why `cn()`?**
- Merges Tailwind classes intelligently (later classes win)
- Prevents duplicate/conflicting utilities
- Handles conditional logic cleanly

---

## Framer Motion Patterns

### Import Presets

Use motion presets from `@/lib/motion`:
```typescript
import { fadeInUp, avatarHover, shouldAnimate } from '@/lib/motion'
import { motion } from 'framer-motion'

<motion.div
  initial={shouldAnimate() ? "hidden" : false}
  animate="visible"
  variants={fadeInUp}
>
  {/* Content */}
</motion.div>
```

### Respect User Preferences

Always check `prefers-reduced-motion`:
```typescript
import { shouldAnimate } from '@/lib/motion'

// Only animate if user hasn't disabled motion
const animate = shouldAnimate()

<motion.div
  initial={animate ? { opacity: 0, y: 20 } : false}
  animate={animate ? { opacity: 1, y: 0 } : false}
/>
```

### Performance

- Use `will-change-transform` for animated elements
- Prefer `transform` over `top`/`left` (GPU acceleration)
- Use `layout` prop sparingly (expensive)
- Memoize variant objects outside component

---

## Custom Hooks

### Naming
- Prefix with `use`: `useFeaturedRotation`, `useScrollGuard`
- One hook = one responsibility

### Location
- Feature-specific: `features/{feature}/hooks/use{Hook}.ts`
- Shared: `lib/hooks/use{Hook}.ts`

### Example
```typescript
// features/landing/useFeaturedRotation.ts
import { useState, useEffect } from 'react'

export function useFeaturedRotation(items: any[], interval = 5000) {
  const [current, setCurrent] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % items.length)
    }, interval)
    
    return () => clearInterval(timer)
  }, [items.length, interval])
  
  return { current, setCurrent }
}
```

---

## Internationalization (i18n)

### Current Implementation
- Client-side i18n with `localStorage` persistence
- Uses `next-intl` for message management
- Locale stored in key: `'portfolio-locale'`

### Adding Translations

1. **Add to English** (`src/i18n/messages/en.json`):
```json
{
  "projects": {
    "title": "Featured Projects",
    "viewAll": "View All Projects",
    "categories": {
      "web": "Web Development",
      "xr": "Extended Reality"
    }
  }
}
```

2. **Add to Spanish** (`src/i18n/messages/es.json`):
```json
{
  "projects": {
    "title": "Proyectos Destacados",
    "viewAll": "Ver Todos los Proyectos",
    "categories": {
      "web": "Desarrollo Web",
      "xr": "Realidad Extendida"
    }
  }
}
```

3. **Use in component**:
```typescript
import { useTranslations } from '@/i18n'

export function ProjectsSection() {
  const t = useTranslations('projects')
  
  return (
    <div>
      <h2>{t('title')}</h2>
      <button>{t('viewAll')}</button>
      <p>{t('categories.web')}</p>
    </div>
  )
}
```

### Locale-Specific Assets

For content that varies by locale (CVs, images):
```typescript
import { useLocale } from '@/i18n'
import { getCvUrl } from '@/lib/constants'

const { locale } = useLocale()
const cvUrl = getCvUrl(locale) // Returns en or es PDF
```

---

## Accessibility

### Focus Management
- Modals: Trap focus inside, restore on close
- Skip links: Provide "Skip to main content"
- Focus indicators: Never remove `outline` without replacement

### Keyboard Navigation
- All interactive elements keyboard accessible
- ESC closes modals/drawers
- Enter/Space activates buttons
- Arrow keys for lists/carousels (when appropriate)

### ARIA
- Use semantic HTML first (`<button>`, `<nav>`, `<main>`)
- Add ARIA when semantics insufficient
- Always include `aria-label` for icon-only buttons

**Example**:
```typescript
<button
  aria-label="Close modal"
  onClick={onClose}
  className="p-2"
>
  <XIcon className="w-6 h-6" />
</button>
```

### Color Contrast
- Ensure 4.5:1 ratio for text
- 3:1 for large text (18px+)
- Test with browser DevTools

---

## Performance Considerations

### Static Export Limitations
- No Image Optimization API (GitHub Pages)
- All images must be pre-optimized
- Use `unoptimized: true` in next.config.ts

### Image Handling
- Generate responsive images with `npm run gen:images`
- Use `srcSet` for different screen densities
- Preload critical images (hero avatars)

**Example**:
```typescript
<img
  srcSet="/images/profile/hero-196.avif 1x, /images/profile/hero-196@2x.avif 2x"
  src="/images/profile/hero-196.avif"
  alt="Adrián Montes Linares"
  width={196}
  height={196}
/>
```

### Code Splitting
- Dynamic imports for heavy components (Three.js)
- Lazy load below-the-fold content

```typescript
import dynamic from 'next/dynamic'

const Silk = dynamic(() => import('./Silk').then(mod => mod.Silk), {
  ssr: false, // Client-only (uses WebGL)
  loading: () => <div>Loading...</div>
})
```

### Animation Performance
- Use `transform` and `opacity` (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Add `will-change-transform` to animated elements
- Remove `will-change` after animation completes

---

## TypeScript Patterns

### Strict Typing
```typescript
// ✅ Explicit types
export function getCvUrl(locale: string): string {
  return locale === 'es' ? CV_FILES.es : CV_FILES.en
}

// ❌ Implicit any
export function getCvUrl(locale) {
  return locale === 'es' ? CV_FILES.es : CV_FILES.en
}
```

### Props Interfaces
```typescript
// ✅ Named interface extending HTML attributes
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

// ❌ Inline type
export const Button = ({ variant, size }: { variant?: string, size?: string }) => {}
```

### Type Exports
```typescript
// Export types for consumer use
export type { ButtonProps } from './Button'
export type { BadgeProps } from './Badge'
```

---

## File Structure Patterns

### Feature Module Structure
```
features/projects/
├── FeaturedProjectsSection.tsx   # Main export
├── ProjectCard.tsx                # Sub-component
├── ProjectPageClient.tsx          # Client component wrapper
├── components/                    # Feature-specific UI
│   └── ProjectBadge.tsx
├── hooks/                         # Feature hooks
│   └── useFeaturedProjects.ts
├── types.ts                       # Feature types
└── index.ts                       # Barrel export
```

### Barrel Export Pattern
```typescript
// features/projects/index.ts
export { FeaturedProjectsSection } from './FeaturedProjectsSection'
export { ProjectCard } from './ProjectCard'
export { ProjectPageClient } from './ProjectPageClient'
export { useFeaturedProjects } from './hooks/useFeaturedProjects'
export type { Project, ProjectCategory } from './types'
```

**Avoid circular dependencies**:
- Keep barrel exports shallow (1 level)
- Don't import from index within same folder
- Import specific files instead

---

## Testing (Future)

When tests are added, follow these patterns:

### File Naming
- Component tests: `ComponentName.test.tsx`
- Hook tests: `useHookName.test.ts`
- Utility tests: `utilityName.test.ts`

### Test Location
- Co-locate with source: `Button.tsx` → `Button.test.tsx`
- Or use `__tests__/` folder per feature

### Test Structure
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('applies variant styles', () => {
    render(<Button variant="primary">Click</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-[var(--accent)]')
  })
})
```

---

## Common Patterns

### Modal with Focus Trap
```typescript
'use client'

import { useEffect, useRef } from 'react'
import { Modal } from '@/components/ui'

export function MyModal({ isOpen, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus()
    }
  }, [isOpen])
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <button ref={closeButtonRef} onClick={onClose}>
        Close
      </button>
      {/* Content */}
    </Modal>
  )
}
```

### Responsive Container
```typescript
export function Container({ children, className }: Props) {
  return (
    <div className={cn(
      "w-full mx-auto",
      "px-fluid-4 sm:px-fluid-6 lg:px-fluid-8",
      "max-w-7xl",
      className
    )}>
      {children}
    </div>
  )
}
```

### Animation Stagger
```typescript
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

<motion.div variants={container} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={item}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## Questions?

See also:
- `AGENTS.md` — Architecture overview and common tasks
- `.github/copilot-instructions.md` — Quick reference checklist
