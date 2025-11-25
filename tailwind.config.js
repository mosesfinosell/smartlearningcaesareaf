/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Caesarea Brand Colors
        brand: {
          gold: '#C9A05C',
          'deep-gold': '#B8904A',
          'light-gold': '#E8D4B0',
          cream: '#F5F0E8',
          'off-white': '#FAFAF8',
          maroon: '#8B1538',
          charcoal: '#1A1A1A',
          'warm-grey': '#8B8B8B',
          'dark-grey': '#2C2C2C',
        },
        border: "#E8D4B0",
        input: "#E8D4B0",
        ring: "#C9A05C",
        background: "#F5F0E8",
        foreground: "#2C2C2C",
        primary: {
          DEFAULT: "#C9A05C",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F5F0E8",
          foreground: "#2C2C2C",
        },
        destructive: {
          DEFAULT: "#C0392B",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F5F0E8",
          foreground: "#8B8B8B",
        },
        accent: {
          DEFAULT: "#8B1538",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#FAFAF8",
          foreground: "#2C2C2C",
        },
        card: {
          DEFAULT: "#FAFAF8",
          foreground: "#2C2C2C",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
