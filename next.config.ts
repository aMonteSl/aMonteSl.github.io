import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isProd = process.env.NODE_ENV === 'production';
const isUserPages = true; // Este es un repo <usuario>.github.io

const nextConfig: NextConfig = {
  output: "export",              // Imprescindible para GitHub Pages
  trailingSlash: true,           // Ayuda con rutas relativas en GH Pages
  images: {
    unoptimized: true,           // Evita optimizador de imágenes (no funciona en GH Pages)
  },
  // Para user pages (<usuario>.github.io), basePath y assetPrefix están vacíos
  basePath: isUserPages ? '' : (isProd ? '/aMonteSl.github.io' : ''),
  assetPrefix: isUserPages ? '' : (isProd ? '/aMonteSl.github.io/' : ''),
};

export default withNextIntl(nextConfig);
