/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F5F3D',
          dark: '#153F29',
          light: '#2F7E52',
          50: '#EEF6F0',
          100: '#D7EBDC',
        },
        secondary: {
          DEFAULT: '#8FBF5C',
          light: '#B9DB93',
          dark: '#6FA23E',
        },
        bg: '#FBF7EE',
        card: '#FFFFFF',
        warning: {
          DEFAULT: '#E8A33D',
          light: '#FBEBD2',
        },
        danger: {
          DEFAULT: '#D2503A',
          light: '#F9E1DA',
        },
        healthy: {
          DEFAULT: '#2F9E52',
          light: '#E1F2E4',
        },
        soil: {
          DEFAULT: '#8B6544',
          light: '#EFE5D8',
        },
        sky: {
          DEFAULT: '#3E7CA6',
          light: '#E1EDF4',
        },
        ink: {
          DEFAULT: '#262A20',
          muted: '#6C7062',
          faint: '#9CA08E',
        },
        border: '#E7E1D3',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(38, 42, 32, 0.06), 0 8px 24px -8px rgba(38, 42, 32, 0.08)',
        card: '0 1px 3px rgba(38, 42, 32, 0.05), 0 6px 18px -6px rgba(38, 42, 32, 0.10)',
        lift: '0 12px 32px -8px rgba(31, 95, 61, 0.22)',
      },
      backgroundImage: {
        'furrow': 'repeating-linear-gradient(180deg, rgba(31,95,61,0.05) 0px, rgba(31,95,61,0.05) 1px, transparent 1px, transparent 14px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'grow-arc': {
          '0%': { strokeDashoffset: 'var(--arc-full)' },
          '100%': { strokeDashoffset: 'var(--arc-offset)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'grow-arc': 'grow-arc 1.1s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-soft': 'pulse-soft 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
