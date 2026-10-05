import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const isUserPages = true; // Este es un repo <usuario>.github.io

// Fecha del build (YYYY-MM-DD, hora de Madrid): "hoy" con el que se pre-renderiza el HTML estático
const buildDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date());

const nextConfig: NextConfig = {
  output: "export",              // Imprescindible para GitHub Pages
  env: {
    NEXT_PUBLIC_BUILD_DATE: buildDate,
  },
  trailingSlash: true,           // Ayuda con rutas relativas en GH Pages
  distDir: isProd ? 'out' : '.next-dev',  // Evita conflictos: .next-dev en dev, out en prod
  images: {
    unoptimized: true,           // Evita optimizador de imágenes (no funciona en GH Pages)
  },
  // Para user pages (<usuario>.github.io), basePath y assetPrefix están vacíos
  basePath: isUserPages ? '' : (isProd ? '/aMonteSl.github.io' : ''),
  assetPrefix: isUserPages ? '' : (isProd ? '/aMonteSl.github.io/' : ''),
};

export default nextConfig;
