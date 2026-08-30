/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        surface: {
          DEFAULT: '#FFFFFF',
          card: '#FFFFFF',
          muted: '#F1F5F9',
          border: '#E2E8F0',
          hover: '#F8FAFC'
        },
        navy: {
          DEFAULT: '#12304A',
          secondary: '#234E70',
          dark: '#0B1E2E',
          light: '#1B476E'
        },
        teal: {
          DEFAULT: '#087E8B',
          light: '#E6F4F5',
          dark: '#06636E',
          50: '#E6F4F5',
          100: '#CEEAEB',
          500: '#087E8B',
          600: '#076D78',
          700: '#065C66'
        },
        primary: {
          DEFAULT: '#087E8B',
          50: '#E6F4F5',
          100: '#CEEAEB',
          200: '#9DD5D8',
          300: '#6CBFC4',
          400: '#3BAAB1',
          500: '#087E8B',
          600: '#076D78',
          700: '#065C66',
          800: '#054C54',
          900: '#033B42'
        },
        brandText: {
          main: '#17212B',
          secondary: '#64748B',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'intel-card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'intel-modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
