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
        // Caesarea Smart School Brand Colors
        maroon: '#800020',    // Primary brand color
        gold: '#FFD700',      // Secondary/accent color
        cream: '#FFFDD0',     // Background color
        // Additional shades for flexibility
        'maroon-light': '#A0152E',
        'maroon-dark': '#600018',
        'gold-light': '#FFED4E',
        'gold-dark': '#CCB000',
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
