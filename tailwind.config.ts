import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#8b1e26',
          dark: '#60171e',
          black: '#1a1616',
          gold: '#e8b73e',
          cream: '#faf5eb',
          gray: '#f6f3ef',
          border: '#e4ded7',
          green: '#16804f',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
