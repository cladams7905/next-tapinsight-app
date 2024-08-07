import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  daisyui: {
    styled: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    themes: [
      "dark",
      {
        default: {
          primary: "#7A81EB",
          secondary: "#f0abfc",
          accent: "#172554",
          neutral: "#D1D3D7" /**9ca3af */,
          "base-100": "#ffffff",
          "base-content": "#172554",
          info: "#C4C4F8",
          success: "#4ade80",
          warning: "#fde047",
          error: "#f87171",
          "accent-light": "#f9fafb",
          "accent-tab": "#ffffff",
          "link-hover": "var(--fallback-p,oklch(var(--p)/0.20))",
        },
      },
    ],
  },
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      height: {
        "screen-minus-navbar": "calc(100vh - 68px)",
      },
      fontFamily: {
        heading: ["var(--font-changaOne)"],
        sans: ["var(--font-openSans)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "accent-light": "#f9fafb",
        "accent-tab": "#ffffff",
        "link-hover": "var(--fallback-p,oklch(var(--p)/0.20))",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(-20%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideOut: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-20%)", opacity: "0" },
        },
      },
      animation: {
        slideIn: "slideIn 0.3s ease-in-out forwards",
        slideOut: "slideOut 0.2s ease-in-out forwards",
      },
    },
  },
  plugins: [daisyui],
};
export default config;
