# amontesl.github.io

Personal portfolio website for **Adrián Montes Linares**.

Live: [adrianmonteslinares.com](https://adrianmonteslinares.com/)

## Tech Stack

- **Framework**: Next.js 15 (App Router, static export)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **i18n**: next-intl with static English and Spanish routes
- **3D Background**: Three.js + React Three Fiber
- **Deployment**: GitHub Pages

## Quick Start

```bash
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

Open [http://localhost:3000](http://localhost:3000) for development. Static preview serves `./out` at [http://localhost:4173](http://localhost:4173) after `npm run build`.

## Routes And i18n

- English canonical routes live at `/`, `/uses/`, and `/projects/[slug]/`.
- Spanish SEO routes live at `/es/`, `/es/uses/`, and `/es/projects/[slug]/`.
- Messages are stored in `src/i18n/messages/{locale}.json`.
- The language switcher navigates between equivalent localized URLs.

## Project Structure

```text
src/
├── app/                 # Next.js App Router routes
├── components/          # UI and common shell components
├── features/            # Domain features
├── i18n/                # next-intl config, routing helpers, messages
├── lib/                 # Utilities, constants, SEO helpers
└── content/             # Static content data
```

See [AGENTS.md](./AGENTS.md) for detailed architecture documentation.

## Scripts

```bash
npm run dev                 # Development server
npm run lint                # ESLint
npm run typecheck           # TypeScript strict check
npm run check-translations  # i18n coverage sanity check
npm run check               # lint + typecheck + translations
npm run build               # Static export to ./out
npm run preview             # Serve ./out locally
npm run ship "message"      # Check, build, commit, and push current branch
```

`npm run ship` refuses to commit directly to `main`; use a feature branch and open a pull request.

## Deployment

GitHub Pages deploys automatically from `main` using `.github/workflows/deploy.yml`.

Pull requests run `.github/workflows/ci.yml`, which installs dependencies, runs checks, and builds the static export without deploying.
