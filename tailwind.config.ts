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
        bg:    "#0c0f0a",
        cream: "#f0ebe3",
        warm:  "#c8b89a",
        muted: "#a89f8c",
        bark:  "#3d2b1a",
        forest: {
          950: "#020a04",
          900: "#051a08",
          800: "#0a2e10",
          700: "#0f4018",
          600: "#165c22",
          500: "#1e7a2e",
          400: "#2a9e3d",
          300: "#3dc454",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        mono:  ["'JetBrains Mono'", "monospace"],
        sans:  ["'Inter'", "sans-serif"],
      },
      animation: {
        "mist-drift":      "mistDrift 18s ease-in-out infinite alternate",
        "mist-drift-slow": "mistDrift 28s ease-in-out infinite alternate-reverse",
      },
      keyframes: {
        mistDrift: {
          "0%":   { transform: "translateX(-3%) scaleX(1.03)" },
          "100%": { transform: "translateX(3%) scaleX(0.97)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;