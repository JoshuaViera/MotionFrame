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
        'electric-blue-dark': '#00a8cc',
        'dark': '#0a0a0a',
      },
    },
  },
  plugins: [],
} satisfies Config;