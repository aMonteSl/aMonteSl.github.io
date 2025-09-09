/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors with new palette
        brand: {
          black: '#040304',
          brown: '#D2B6A1',
          'brown-light': '#EFD2BC',
          secondary: '#DCA293',
        },
        // Semantic variables mapped to CSS vars
        bg: 'var(--bg)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        'accent-3': 'var(--accent-3)',
        // CSS Variables approach for consistent theming
      },
      screens: {
        '3xl': '1920px',  // 1080p/2K entry
        '4k': '2560px',   // 2K wide
        '5k': '3840px',   // True 4K width
      },
      maxWidth: {
        'prose': '75ch',
        'content': '1600px',
        '4k': '2000px',
      },
      fontSize: {
        // Fluid typography using clamp()
        'xs': ['clamp(0.75rem, 0.2vw + 0.7rem, 0.875rem)', { lineHeight: '1.4' }],
        'sm': ['clamp(0.875rem, 0.25vw + 0.8rem, 1rem)', { lineHeight: '1.5' }],
        'base': ['clamp(0.95rem, 0.35vw + 0.85rem, 1.125rem)', { lineHeight: '1.6' }],
        'lg': ['clamp(1.125rem, 0.5vw + 1rem, 1.25rem)', { lineHeight: '1.6' }],
        'xl': ['clamp(1.25rem, 0.75vw + 1.1rem, 1.5rem)', { lineHeight: '1.5' }],
        '2xl': ['clamp(1.5rem, 1vw + 1.3rem, 2rem)', { lineHeight: '1.4' }],
        '3xl': ['clamp(1.875rem, 1.5vw + 1.5rem, 2.5rem)', { lineHeight: '1.3' }],
        '4xl': ['clamp(2.25rem, 2vw + 1.8rem, 3rem)', { lineHeight: '1.2' }],
        '5xl': ['clamp(2.5rem, 2.5vw + 2rem, 3.5rem)', { lineHeight: '1.1' }],
      },
      spacing: {
        // Fluid spacing using clamp()
        'fluid-xs': 'clamp(0.5rem, 1vw, 0.75rem)',
        'fluid-sm': 'clamp(0.75rem, 1.5vw, 1rem)',
        'fluid-md': 'clamp(1rem, 2vw, 1.5rem)',
        'fluid-lg': 'clamp(1.25rem, 2.5vw, 2rem)',
        'fluid-xl': 'clamp(1.5rem, 3vw, 2.5rem)',
        'fluid-2xl': 'clamp(2rem, 4vw, 3rem)',
        'fluid-3xl': 'clamp(2.5rem, 5vw, 4rem)',
        // Section padding
        'section-y': 'clamp(1.25rem, 1.5vw + 1rem, 3rem)',
        'section-x': 'clamp(1rem, 2vw + 0.5rem, 2rem)',
      },
      gridTemplateColumns: {
        // Responsive sidebar with clamp
        'sidebar': 'clamp(260px, 24vw, 360px) minmax(0, 1fr)',
        // Responsive card grids
        'cards-responsive': 'repeat(auto-fit, minmax(280px, 1fr))',
        'cards-1': 'repeat(1, 1fr)',
        'cards-2': 'repeat(2, 1fr)',
        'cards-3': 'repeat(3, 1fr)',
        'cards-4': 'repeat(4, 1fr)',
        'cards-5': 'repeat(5, 1fr)',
        'cards-6': 'repeat(6, 1fr)',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px var(--accent)' },
          '100%': { boxShadow: '0 0 20px var(--accent), 0 0 30px var(--accent)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      containers: {
        '2xs': '16rem',
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
