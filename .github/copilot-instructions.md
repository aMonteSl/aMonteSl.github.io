# GitHub Copilot Instructions

## Project Context

This is a **personal portfolio website** deployed on GitHub Pages.
- Framework: Next.js 15 (App Router) with static export
- Styling: Tailwind CSS v4
- i18n: next-intl (EN primary, ES secondary)
- Animation: Framer Motion

## Code Style Preferences

### TypeScript
- Strict mode enabled — avoid `any` types
- Prefer explicit return types on functions
- Use interfaces for object shapes, types for unions/primitives

### React
- Functional components only
- Named exports for components
- Props interfaces named `{ComponentName}Props`

### Tailwind
- Use utility classes directly in JSX
- Use `cn()` helper from `@/lib/utils` for conditional classes
- Avoid `@apply` unless creating base component styles

### File Organization
- Components in `components/ui/` (presentational) or `components/common/` (layout)
- Feature logic in `features/{featureName}/`
- Shared utilities in `lib/`

## Workflow Guidelines

1. **Incremental changes**: Make small, focused edits
2. **Verify often**: Test after each significant change
3. **Preserve behavior**: When refactoring, ensure UI/UX remains identical
4. **Follow existing patterns**: Check similar code before adding new patterns
5. **No massive rewrites**: Prefer iterative improvements

## Common Tasks

### Adding a new UI component
1. Create in `src/components/ui/{ComponentName}.tsx`
2. Export from `src/components/ui/index.ts`
3. Keep it pure — props in, JSX out, no side effects

### Adding a translation
1. Add key to `src/i18n/messages/en.json`
2. Add Spanish translation to `src/i18n/messages/es.json`
3. Use `useTranslations('namespace')` in component

### Adding a new page
1. Create in `src/app/[locale]/{route}/page.tsx`
2. Use default export (Next.js requirement)
3. Delegate rendering to feature components

## Things to Avoid

- ❌ Inline styles (use Tailwind)
- ❌ `any` types (use proper typing)
- ❌ Giant multi-file refactors in one go
- ❌ Hardcoded strings (use i18n)
- ❌ Direct DOM manipulation (use React state)
- ❌ Barrel exports that create circular dependencies
