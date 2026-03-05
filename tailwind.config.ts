import type { Config } from 'tailwindcss';
const tailwindcssAnimate = require('tailwindcss-animate');

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          50: 'hsl(var(--color-primary-50))',
          500: 'hsl(var(--primary))',
          600: 'hsl(var(--color-primary-600))',
          700: 'hsl(var(--color-primary-700))',
          900: 'hsl(var(--color-primary-900))',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        success: {
          DEFAULT: 'hsl(var(--color-success))',
          dark: 'hsl(var(--color-success-dark))',
        },
        warning: 'hsl(var(--color-warning))',
        error: {
          DEFAULT: 'hsl(var(--color-error))',
          dark: 'hsl(var(--color-error-dark))',
        },
        gray: {
          50: 'hsl(var(--color-gray-50))',
          100: 'hsl(var(--color-gray-100))',
          200: 'hsl(var(--color-gray-200))',
          300: 'hsl(var(--color-gray-300))',
          500: 'hsl(var(--color-gray-500))',
          600: 'hsl(var(--color-gray-600))',
          700: 'hsl(var(--color-gray-700))',
          900: 'hsl(var(--color-gray-900))',
        },
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        'figma-sm': 'var(--shadow-sm)',
        'figma-md': 'var(--shadow-md)',
        'figma-lg': 'var(--shadow-lg)',
        'figma-xl': 'var(--shadow-xl)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '1.4' }],
      },
      maxWidth: {
        '8xl': '88rem',
      },
      animation: {
        orbit: 'orbit calc(var(--duration, 20) * 1s) linear infinite',
      },
      keyframes: {
        orbit: {
          '0%': {
            transform: 'translate(-50%, -50%) rotate(calc(var(--angle, 0) * 1deg)) translateX(calc(var(--radius, 50) * 1px)) rotate(calc(var(--angle, 0) * -1deg))',
          },
          '100%': {
            transform: 'translate(-50%, -50%) rotate(calc(var(--angle, 0) * 1deg + 360deg)) translateX(calc(var(--radius, 50) * 1px)) rotate(calc(var(--angle, 0) * -1deg - 360deg))',
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
