/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae3',
          300: '#b0b9c9',
          400: '#8593aa',
          500: '#677591',
          600: '#525d76',
          700: '#434c60',
          800: '#3a4151',
          900: '#343945',
          950: '#22252e',
        },
        brand: {
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#bcddff',
          300: '#8ec8ff',
          400: '#59abff',
          500: '#2f8cff',
          600: '#176cf5',
          700: '#1257e1',
          800: '#1547b6',
          900: '#173f8f',
          950: '#102656',
        },
        accent: {
          400: '#facc5c',
          500: '#f5b536',
          600: '#e09a1c',
        },
        success: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16,24,40,0.04), 0 4px 16px rgba(16,24,40,0.06)',
        lift: '0 8px 30px rgba(16,24,40,0.10)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out both',
        slideUp: 'slideUp 0.6s cubic-bezier(0.22,1,0.36,1) both',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
