import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SmartLearning by Caesarea College brand palette (from logo)
        maroon: '#2a1f1a',    // Deep charcoal headline color
        gold: '#b5863c',      // Signature gold accent
        cream: '#f3ede4',     // Light background tone
        'maroon-light': '#46352d',
        'maroon-dark': '#1b1512',
        'gold-light': '#c89d5a',
        'gold-dark': '#8f6623',
      },
      keyframes: {
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-28px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-in-left': 'slide-in-left 700ms ease-out forwards',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
