# amontesl.github.io

Personal portfolio website for **Adrián Montesinos López**.

🌐 **Live**: [amontesl.github.io](https://amontesl.github.io/)

## Tech Stack

- **Framework**: Next.js 15 (App Router, static export)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **i18n**: next-intl (English primary, Spanish secondary)
- **3D Background**: Three.js + React Three Fiber
- **Deployment**: GitHub Pages

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (static export)
npm run build

# Lint code
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally.

## Project Structure

```
src/
├── app/[locale]/      # Next.js App Router (locale-based routing)
├── components/        # UI components (ui/ and common/)
├── features/          # Feature modules (landing, language, etc.)
├── i18n/              # next-intl config and messages
├── lib/               # Utilities and constants
└── content/           # Static JSON data
```

See [AGENTS.md](./AGENTS.md) for detailed architecture documentation.

## Internationalization (i18n)

This site supports **English** (primary) and **Spanish** (secondary).

- Messages stored in `src/i18n/messages/{locale}.json`
- Language switch persists via URL locale segment
- Automatic translation workflow via GitHub Actions

### Translation Scripts

```bash
# Auto-translate en.json -> es.json (requires API keys)
npm run translate

# Check translation coverage
npm run check-translations
```

## Deployment

The site deploys automatically to GitHub Pages on push to `main`.

### How it works

1. GitHub Actions runs `npm run build`
2. Next.js exports static HTML to `./out/`
3. `actions/deploy-pages` publishes to GitHub Pages

### Manual deploy

```bash
npm run build
# Static files are in ./out/
```

## Development Notes

- **Static Export**: This project uses `output: 'export'` for GitHub Pages compatibility
- **No Image Optimization API**: Images are unoptimized (static hosting limitation)
- **Trailing Slashes**: Enabled for GitHub Pages URL consistency

## License

MIT
