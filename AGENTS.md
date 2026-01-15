# AGENTS.md — AI/Agent Collaboration Guide

## Project Summary

**Portfolio Website** for Adrián Montesinos López  
- **URL**: https://amontesl.github.io/  
- **Purpose**: Personal developer portfolio showcasing skills, projects, and CV  
- **Status**: Active development — Hero section complete, other sections marked "under construction"

### Current Goals
1. **Preserve UI/UX**: Keep the current landing experience identical (hero, navbar, language switch, scroll guard modal)
2. **Refactor Architecture**: Migrate from ad-hoc structure to clean, scalable frontend architecture
3. **Migrate i18n**: Replace custom i18n with `next-intl` for better maintainability
4. **Prepare for Growth**: Structure supports adding blog, more projects, sections, etc.

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
│   ├── [locale]/                 # Locale-based routing (en, es)
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Home page
│   │   └── projects/             # Projects routes
│   │       ├── page.tsx
│   │       └── [slug]/
│   │           └── page.tsx
│   ├── globals.css               # Global styles + Tailwind imports
│   ├── robots.ts                 # SEO robots
│   └── sitemap.ts                # SEO sitemap
│
├── components/
│   ├── ui/                       # Pure presentational (Button, Badge, Card, Modal)
│   │   └── *.tsx                 # No data fetching, minimal logic
│   └── common/                   # Shared layout components (Navbar, Footer, Container)
│       └── *.tsx
│
├── features/                     # Domain features (encapsulated behavior + UI)
│   ├── landing/                  # Hero section components
│   ├── language/                 # Language switch logic + UI
│   ├── constructionNotice/       # Scroll guard + modal
│   └── projects/                 # Project cards, detail views
│
├── i18n/                         # next-intl configuration
│   ├── messages/                 # Translation files
│   │   ├── en.json
│   │   └── es.json
│   ├── routing.ts                # Locale config + pathnames
│   └── request.ts                # Server request config
│
├── lib/                          # Shared utilities
│   ├── constants.ts              # Routes, links, socials, CV URL
│   ├── utils.ts                  # cn() helper, etc.
│   └── motion.ts                 # Framer Motion presets
│
├── content/                      # Static content data
│   ├── projects.json
│   ├── skills.json
│   └── links.json
│
└── types/                        # TypeScript declarations
    └── *.d.ts

public/
├── images/                       # Static images
├── cv/                           # CV PDF files
└── projects/                     # Project screenshots
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
- Constants: `SCREAMING_SNAKE_CASE`

### Component Boundaries
- **`components/ui/`**: Pure presentational, receive all data via props, no side effects
- **`features/`**: May contain hooks, context, data fetching, composed UI
- **`app/`**: Route handlers and layouts only — delegate to features/components

### Hooks Rules
- Custom hooks live in `features/<name>/hooks/` or `lib/hooks/`
- Prefix with `use`
- Keep focused on single responsibility

### Styling
- Tailwind utility classes preferred
- Use `cn()` helper for conditional classes
- CSS variables for theming in `globals.css`
- Avoid inline `style={}` unless dynamic values required

---

## How to Run

```bash
# Install dependencies
npm install

# Development server (with Turbopack)
npm run dev

# Production build (static export)
npm run build

# Lint
npm run lint

# Generate responsive images
npm run gen:images

# Translate (requires API keys)
npm run translate

# Check translation coverage
npm run check-translations
```

---

## Definition of Done

A migration/feature is complete when:

- [ ] **UI/UX matches** current site behavior and content exactly
- [ ] **next-intl integrated** — no legacy custom i18n usage remains
- [ ] **New `src/` is clean** — follows folder architecture above
- [ ] **`src_old/` excluded** — exists for reference but not in build/lint
- [ ] **Build works** — `npm run build` produces valid static export
- [ ] **Deploy works** — GitHub Pages serves the site correctly
- [ ] **No dead code** — unused imports, components, or files removed
- [ ] **Accessibility** — modals focus-trapped, ESC closes, keyboard nav works
- [ ] **TypeScript strict** — no `any` types, proper typing throughout

---

## Agent Workflow Guidelines

### For AI Coding Agents (Copilot, Claude, etc.)

1. **Small steps**: Make incremental changes, verify each before proceeding
2. **Verify builds**: Run `npm run dev` and `npm run build` after significant changes
3. **Preserve behavior**: When migrating, test that UI looks/works identically
4. **Follow structure**: Place files according to folder architecture above
5. **Use existing patterns**: Check how similar components are built before adding new ones
6. **No giant rewrites**: Prefer refactoring file-by-file over massive multi-file changes
7. **Leave clean code**: No placeholder TODOs unless absolutely necessary

### Commit Style
- Prefix: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Keep commits focused on single logical change
- Example: `refactor: migrate Hero to features/landing`

---

## Key Files Reference

| Purpose | Path |
|---------|------|
| Next.js config | `next.config.ts` |
| Tailwind config | `tailwind.config.ts` |
| TypeScript config | `tsconfig.json` |
| ESLint config | `eslint.config.mjs` |
| Deploy workflow | `.github/workflows/deploy.yml` |
| Translation workflow | `.github/workflows/i18n-translate.yml` |
