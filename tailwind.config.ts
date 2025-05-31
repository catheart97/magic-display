import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx,md}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx,md}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx,md}",
    "./data/**/*.{js,ts,jsx,tsx,mdx,md}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      transitionProperty: {
        border: "border,border-radius,box-shadow,background-color",
      },
      fontFamily: {
        default: "MedievalSharp",
        sans: "MedievalSharp",
        serif: "MedievalSharp",
        mono: "MedievalSharp",
      },
      colors: {
        french: {
          DEFAULT: "#D9D1D9",
          900: "#2f272f",
          800: "#5e4d5e",
          700: "#8d748d",
          600: "#b4a3b4",
          500: "#d9d1d9",
          400: "#e2dbe2",
          300: "#e9e4e9",
          200: "#f0edf0",
          100: "#f8f6f8",
        },
      },
      typography: ({ theme }: any) => ({
        DEFAULT: {
          css: {
            "--tw-prose-bullets": theme("colors.neutral[400]"),
            "--tw-prose-th-borders": theme("colors.neutral[300]"),
            "--tw-prose-td-borders": theme("colors.neutral[200]"),
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
