import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add your custom colors here
        primary: {
          "50": "#fffbeb",
          "100": "#fef3c7",
          "200": "#fde68a",
          "300": "#fcd34d",
          "400": "#fbbf24",
          "500": "#f59e0b",
          "600": "#d97706",
          "700": "#b45309",
          "800": "#92400e",
          "900": "#78350f",
          "950": "#451a03",
        },
        secondary: {
          "50": "#f0f8ff",
          "100": "#e0f0fe",
          "200": "#bae2fd",
          "300": "#7ccbfd",
          "400": "#37b1f9",
          "500": "#0d97ea",
          "600": "#016fb9",
          "700": "#025fa2",
          "800": "#065186",
          "900": "#0c446e",
        },
        black: "#1f1f1f",
        white: "#FFFFFF",
        heading: "#1f1f1f",
        paragraph: "#4b5563",
        labels: "#1f1f1f",
        placeholder: "#9ca3af",
        table: colors.gray[900],
        backgroundDisable: "#F3F4F6",
        border: "#E5E7EB",
        "input-border": colors.gray[300],
        icon: colors.gray[500],
      },
      fontSize: {
        sm: "0.8rem",
        base: "1rem",
        xl: "1.25rem",
        "2xl": "1.563rem",
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
        h1: [
          "4rem",
          {
            lineHeight: "5rem",
            letterSpacing: "0.0375rem",
            fontWeight: "700",
          },
        ],
        h2: [
          "3rem",
          {
            lineHeight: "2rem",
            letterSpacing: "0.035rem",
            fontWeight: "700",
          },
        ],
        h3: [
          "2.5rem",
          {
            lineHeight: "3.5rem",
            letterSpacing: "0.05rem",
            fontWeight: "700",
          },
        ],
        h4: [
          "2rem",
          {
            lineHeight: "2.75rem",
            letterSpacing: "0rem",
            fontWeight: "700",
          },
        ],
        h5: [
          "1.5rem",
          {
            lineHeight: "2.5rem",
            letterSpacing: "0rem",
            fontWeight: "600",
          },
        ],
        h6: [
          "1.25rem",
          {
            lineHeight: "2rem",
            letterSpacing: "0rem",
            fontWeight: "600",
          },
        ],
        p: [
          "1.25rem",
          {
            lineHeight: "2rem",
            letterSpacing: "0rem",
            fontWeight: "500",
          },
        ],
        div: [
          "1rem",
          {
            lineHeight: "1.5rem",
            letterSpacing: "0em",
            fontWeight: "400",
          },
        ],
        span: [
          "0.75rem",
          {
            lineHeight: "1.5rem",
            letterSpacing: "0em",
            fontWeight: "400",
          },
        ],
      },
      fontWeight: {
        thin: "100",
        hairline: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        "extra-bold": "800",
        black: "900",
      },
      screens: {
        xs: "360px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1480px",
        "3xl": "1680px",
        "4xl": "1920px",
      },
      container: {
        center: true,
        screens: {
          xs: "360px",
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1480px",
          "3xl": "1680px",
          "4xl": "1920px",
        },
        padding: {
          DEFAULT: "0rem",
          xs: "0rem",
          sm: "0rem",
          md: "0rem",
          lg: "0rem",
          xl: "0rem",
          "2xl": "2rem",
          "3xl": "2rem",
          "4xl": "2rem",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        // You can add your custom fonts here
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  // Important: This ensures Tailwind doesn't conflict with Sanity Studio
  important: "#app",
  // Prefix Tailwind classes to avoid conflicts
  prefix: "tw-",
};

export default config;
