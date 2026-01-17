import type { Config } from 'tailwindcss'
import fluidType from 'tailwindcss-fluid-type'
import fluidSpacing from 'tailwindcss-fluid-spacing'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        'fg-muted': 'var(--fg-muted)',
        accent: 'var(--accent)',
        card: 'var(--card)',
        border: 'var(--border)',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          '"Open Sans"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(220, 162, 147, 0.1)',
        'soft-lg': '0 4px 16px rgba(220, 162, 147, 0.15)',
      },
    },
  },
  plugins: [
    fluidType({
      // Escala UTOPIA-like
      settings: {
        fontSizeMin: 1.0,   // rem base en móviles
        fontSizeMax: 1.25,  // rem en pantallas grandes
        ratioMin: 1.2,
        ratioMax: 1.333,
        screenMin: 360,
        screenMax: 2560
      },
      // Mapea nombres -> pasos de escala
      values: {
        xs: -2, sm: -1, base: 0, lg: 1, xl: 2,
        "2xl": 3, "3xl": 4, "4xl": 5, "5xl": 6
      }
    }),
    fluidSpacing({
      fromScreen: 360,
      toScreen: 2560,
      fromSize: 8,
      toSize: 24
    })
  ],
}

export default config
