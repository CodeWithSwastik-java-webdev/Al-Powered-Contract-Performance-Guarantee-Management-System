import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FAF4',
          100: '#D8F3DC',
          500: '#40916C',
          600: '#2D6A4F',
        },
        neutral: {
          100: '#F4F6F5',
          300: '#C5D0CB',
          500: '#6B7B73',
          700: '#3D4A44',
          900: '#1A1F1C',
        },
        status: {
          healthy: '#2D6A4F',
          warning: '#9A7B2F',
          critical: '#A94442',
          info: '#4A90A4',
          neutral: '#4A708B',
        },
      },
      boxShadow: {
        surface: '0 18px 45px rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Cascadia Code', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config
