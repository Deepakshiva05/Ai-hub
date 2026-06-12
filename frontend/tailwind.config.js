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
        premium: {
          darkBg: '#0f172a',
          darkCard: '#1e293b',
          darkBorder: 'rgba(255, 255, 255, 0.08)',
          indigo: '#6366f1',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          goldStart: '#f59e0b',
          goldEnd: '#f97316',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['Outfit', 'SF Pro Display', 'sans-serif']
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'border-spin': 'border-spin 4s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'border-spin': {
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      boxShadow: {
        'premium-glow': '0 0 25px rgba(99, 102, 241, 0.15)',
        'premium-glow-strong': '0 0 35px rgba(139, 92, 246, 0.35)',
        'cyan-glow': '0 0 25px rgba(6, 182, 212, 0.25)',
        'gold-glow': '0 0 25px rgba(245, 158, 11, 0.25)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
