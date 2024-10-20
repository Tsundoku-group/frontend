import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
    },
    extend: {
      colors: {
        'primary-black': '#13181F',
        'secondary-black': '#171C26',
        'tertiary-black': '#1D2330',

        'text-white': '#D2D5E9',
        
        'green-highlight': '#20D998',
        'red-highlight': '#FF5C64',
        'purple-highlight': '#8146FF',
        'yellow-highlight': '#FFBC33',

        primary: {
          DEFAULT: '#353a45',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#2c3648',
          foreground: '#d2d5e9',
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config