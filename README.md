# Adrián Montes - Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Features dark theme design, smooth animations, and excellent performance across all device sizes.

🌐 **Live Site**: [https://amontesl.github.io](https://amontesl.github.io)

## 🎨 Design Features

- **Single-Page Layout**: Smooth scrolling between sections with sticky navigation header
- **Dark Theme**: Elegant dark aesthetic with warm brown accent colors (#D2B6A1) and steel blue secondary (#6E8CA0)
- **Responsive Design**: Mobile-first approach with collapsible hamburger menu on smaller screens
- **Smooth Animations**: Framer Motion powered micro-interactions with respect for prefers-reduced-motion
- **Accessibility**: WCAG compliant with proper focus management, semantic HTML, and keyboard navigation

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom CSS variables and container queries
- **Build Tool**: Vite for fast development and optimized builds
- **Animations**: Framer Motion for smooth transitions with accessibility support
- **Image Gallery**: Yet Another React Lightbox for accessible image viewing
- **Icons**: Lucide React for consistent iconography
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (Button, Card, Badge, etc.)
│   └── sections/     # Layout components (Navbar, Footer)
├── data/             # Static data (profile, projects, skills, etc.)
├── layout/           # Layout components (RootLayout, SEOHead)
├── lib/              # Utilities (SEO, analytics, schema, utils)
├── pages/            # Route components
├── styles/           # Global CSS with Tailwind
└── assets/           # Static assets
```

## 🛠️ Installation & Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/aMonteSl/github-portfolio.git
   cd github-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🚀 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"

2. **Configure Base Path (if needed)**
   
   For **User/Organization site** (e.g., `username.github.io`):
   ```typescript
   // vite.config.ts
   export default defineConfig({
     base: '/',
     // ... other config
   })
   ```

   For **Project site** (e.g., `username.github.io/repository-name`):
   ```typescript
   // vite.config.ts
   export default defineConfig({
     base: '/repository-name/',
     // ... other config
   })
   ```

3. **Deploy**
   - Push to `main` branch
   - GitHub Actions will automatically build and deploy
   - Site will be available at your GitHub Pages URL

### Manual Deployment

To deploy manually:

```bash
npm run build
# Upload the 'dist' folder to your hosting provider
```

## 🌐 Custom Domain Setup

To use a custom domain with GitHub Pages:

### For Subdomain (www.example.com)

1. **DNS Configuration**
   ```
   Type: CNAME
   Name: www
   Value: username.github.io
   ```

2. **GitHub Pages Settings**
   - Go to Settings → Pages
   - Custom domain: `www.example.com`
   - Check "Enforce HTTPS"

### For Apex Domain (example.com)

1. **DNS Configuration**
   ```
   Type: A (or ALIAS/ANAME)
   Name: @
   Value: 185.199.108.153
          185.199.109.153
          185.199.110.153
          185.199.111.153
   ```

2. **GitHub Pages Settings**
   - Custom domain: `example.com`
   - Check "Enforce HTTPS"

## 📊 Performance & SEO

### Lighthouse Targets
- Performance: ≥ 95
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 95

### SEO Features
- Dynamic meta tags for each page
- Open Graph and Twitter Card support
- JSON-LD structured data
- Sitemap.xml
- Robots.txt
- Canonical URLs

### Performance Optimizations
- Code splitting by routes
- Lazy loading images
- Prefetch on hover for internal links
- Optimized bundle sizes
- CSS and JS minification

## 🎨 Customization

### Content Management

All content is managed through TypeScript files in the `src/data/` directory:

- `profile.ts` - Personal information and summary
- `projects.ts` - Project portfolio
- `education.ts` - Academic background and achievements
- `activities.ts` - Professional activities and events
- `skills.ts` - Technical skills and expertise
- `languages.ts` - Language proficiencies
- `contacts.ts` - Contact information

### Theme Customization

Colors and styling can be customized in:

- `tailwind.config.js` - Theme colors, fonts, spacing
- `src/styles/index.css` - Custom CSS and component styles

### Analytics

Analytics can be enabled by modifying `src/lib/analytics.ts`:

```typescript
export const analyticsConfig = {
  enabled: true, // Set to true to enable
  plausibleDomain: 'your-domain.com',
  plausibleScript: 'https://plausible.io/js/script.js'
}
```

## 🔧 Tech Stack Details

### Core Technologies
- **React 18** - UI library with hooks and concurrent features
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### Development Tools
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **PostCSS** - CSS processing with Tailwind
- **Framer Motion** - Smooth animations and transitions

### Deployment
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static site hosting

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📞 Support

For questions or support, please contact:
- Email: adrian.adyra@gmail.com
- LinkedIn: [adrianmonteslinares](https://linkedin.com/in/adrianmonteslinares)
- GitHub: [aMonteSl](https://github.com/aMonteSl)

---

Built with ❤️ by Adrián Montes
