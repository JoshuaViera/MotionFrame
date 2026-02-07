import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'electric-blue': '#00d4ff',
        'electric-blue-dark': '#0088aa',
        'obsidian': '#050505',
        'void': '#020202',
      },
      animation: {
        'glitch': 'glitch 0.2s infinite',
        'rgb-shift': 'rgb-shift 0.1s infinite',
        'stress-tremor': 'stress-tremor 0.15s infinite ease-in-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glitch: {
          '0%': { clipPath: 'inset(40% 0 61% 0)', transform: 'translate(-2px, -2px)' },
          '20%': { clipPath: 'inset(92% 0 1% 0)', transform: 'translate(1px, 2px)' },
          '40%': { clipPath: 'inset(43% 0 1% 0)', transform: 'translate(-1px, -1px)' },
          '60%': { clipPath: 'inset(25% 0 58% 0)', transform: 'translate(2px, 1px)' },
          '80%': { clipPath: 'inset(54% 0 7% 0)', transform: 'translate(-2px, 2px)' },
          '100%': { clipPath: 'inset(58% 0 43% 0)', transform: 'translate(1px, -2px)' },
        },
        'rgb-shift': {
          '0%': { textShadow: '2px 0 0 #ff0000, -2px 0 0 #0000ff' },
          '25%': { textShadow: '-2px 0 0 #ff0000, 2px 0 0 #0000ff' },
          '50%': { textShadow: '2px 2px 0 #ff0000, -2px -2px 0 #0000ff' },
          '75%': { textShadow: '-2px -2px 0 #ff0000, 2px 2px 0 #0000ff' },
          '100%': { textShadow: '2px 0 0 #ff0000, -2px 0 0 #0000ff' },
        },
        'stress-tremor': {
          '0%, 100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-1px, -1px)' },
          '20%': { transform: 'translate(1px, 1px)' },
          '30%': { transform: 'translate(-1px, 1px)' },
          '40%': { transform: 'translate(1px, -1px)' },
          '50%': { transform: 'translate(-0.5px, -0.5px)' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config;